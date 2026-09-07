import { getPublicDataSource, listPublicDataSources, listPublicDataProviderCatalog } from '../lib/public-data-registry.js';
import { normalizePublicData, NEXUS_PUBLIC_DATA_SCHEMA } from '../lib/public-data-normalizers.js';
import { buildPublicDataIntelligence } from '../lib/public-data-intelligence.js';

const MAX_BODY_BYTES = 16_384;
const MAX_ROWS = 100;
const UPSTREAM_DEPENDENCY_STATUS = 424;
const SNAPSHOT_TTL_SECONDS = 60 * 60 * 24 * 90;

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store, max-age=0',
      'x-content-type-options': 'nosniff',
      ...extraHeaders
    }
  });
}

function publicSource(source) {
  return {
    axis: source.axis,
    owner: source.owner,
    category: source.category,
    provider: source.provider,
    title: source.title,
    titleEn: source.titleEn,
    method: source.method,
    cacheTtl: source.cacheTtl,
    docsUrl: source.docsUrl || ''
  };
}

function readCredential(source, env) {
  const key = source.auth?.env ? env?.[source.auth.env] : null;
  return typeof key === 'string' && key.trim() ? key.trim() : null;
}

function clampRows(name, value) {
  if (!['display', 'numOfRows', 'pSize'].includes(name)) return value;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return value;
  return String(Math.min(parsed, MAX_ROWS));
}

function hasParam(inputUrl, name) {
  const value = inputUrl.searchParams.get(name);
  return value !== null && value.trim() !== '';
}

function validateRequiredParams(source, inputUrl) {
  const missing = [];
  for (const requirement of source.requiredParams || []) {
    if (Array.isArray(requirement)) {
      if (!requirement.some((name) => hasParam(inputUrl, name))) return { ok: false, missingAny: requirement };
      continue;
    }
    if (!hasParam(inputUrl, requirement)) missing.push(requirement);
  }
  if (missing.length) return { ok: false, missing };

  for (const group of source.requiredAny || []) {
    if (!group.some((name) => hasParam(inputUrl, name))) return { ok: false, missingAny: group };
  }

  return { ok: true };
}

function isLawOpenDataSource(source) {
  return source.provider === '법제처 국가법령정보 공동활용';
}

function isDataGoKrSource(source) {
  return source.auth?.env === 'DATA_GO_KR_SERVICE_KEY';
}

function normalizeCredentialForUpstream(source, credential) {
  if (!isDataGoKrSource(source) || !/%[0-9a-f]{2}/i.test(credential)) return credential;
  try {
    return decodeURIComponent(credential);
  } catch {
    return credential;
  }
}

function applyLawDefaults(source, upstream) {
  if (!isLawOpenDataSource(source) || !upstream.pathname.endsWith('/lawSearch.do')) return;
  if (!upstream.searchParams.has('search')) upstream.searchParams.set('search', '1');
  if (!upstream.searchParams.has('page')) upstream.searchParams.set('page', '1');
  if (!upstream.searchParams.has('display')) upstream.searchParams.set('display', '20');
}

function buildUpstreamUrl(source, inputUrl, env) {
  const credential = readCredential(source, env);
  if (!credential) {
    const error = new Error('credential_missing');
    error.code = 'credential_missing';
    error.envName = source.auth?.env || null;
    throw error;
  }

  const upstream = new URL(source.url);
  upstream.searchParams.set(source.auth.param, normalizeCredentialForUpstream(source, credential));

  for (const [name, value] of Object.entries(source.fixedParams || {})) upstream.searchParams.set(name, value);
  for (const name of source.allowedParams || []) {
    const value = inputUrl.searchParams.get(name);
    if (value !== null && value !== '') upstream.searchParams.set(name, clampRows(name, value));
  }

  applyLawDefaults(source, upstream);
  return upstream;
}

function safeRequestParams(source, inputUrl) {
  const params = {};
  for (const name of source.allowedParams || []) {
    const value = inputUrl.searchParams.get(name);
    if (value !== null && value !== '') params[name] = clampRows(name, value);
  }
  return params;
}

function upstreamHeaders(source) {
  if (isLawOpenDataSource(source)) {
    return {
      accept: 'application/json, application/xml, text/xml;q=0.9, */*;q=0.8',
      'user-agent': 'YEHAVHA-NEXUS/2.0 (+https://yehavha.com/)',
      referer: 'https://yehavha.com/'
    };
  }
  return { accept: '*/*' };
}

function redactCredentialString(value, credentials = []) {
  let redacted = value.replace(/([?&](?:OC|serviceKey|KEY)=)[^&#\s"']+/gi, '$1[REDACTED]');
  for (const credential of credentials) {
    if (!credential) continue;
    const variants = new Set([credential, encodeURIComponent(credential), encodeURIComponent(encodeURIComponent(credential))]);
    for (const variant of variants) if (variant) redacted = redacted.split(variant).join('[REDACTED]');
  }
  return redacted;
}

function redactCredentials(value, credentials = []) {
  if (typeof value === 'string') return redactCredentialString(value, credentials);
  if (Array.isArray(value)) return value.map((item) => redactCredentials(item, credentials));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, redactCredentials(item, credentials)]));
  }
  return value;
}

async function parseUpstream(response, source) {
  const text = await response.text();
  const format = source.responseFormat || 'auto';
  if (format === 'xml') return { format: 'xml', data: text };
  if (format === 'json') {
    try { return { format: 'json', data: JSON.parse(text) }; }
    catch { return { format: 'text', data: text }; }
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('json') || /^[\s\r\n]*[\[{]/.test(text)) {
    try { return { format: 'json', data: JSON.parse(text) }; }
    catch { /* Preserve malformed upstream text. */ }
  }
  return { format: contentType.includes('xml') ? 'xml' : 'text', data: text };
}

function detectApplicationError(source, parsed) {
  if (!isLawOpenDataSource(source) || parsed.format !== 'json' || !parsed.data || typeof parsed.data !== 'object') return null;
  const directResult = parsed.data.result;
  const directMessage = parsed.data.msg;
  if (typeof directResult === 'string' && /실패|fail|error/i.test(directResult)) {
    return { code: 'law_open_data_validation_failed', message: directMessage || directResult };
  }
  return null;
}

function cacheControl(ttl) {
  const safeTtl = Math.max(0, Number(ttl) || 0);
  return safeTtl ? `public, max-age=0, s-maxage=${safeTtl}, stale-while-revalidate=${Math.min(safeTtl, 900)}` : 'no-store, max-age=0';
}

function cacheRequest(request) {
  return new Request(request.url, { method: 'GET', headers: { accept: 'application/json' } });
}

async function readEdgeCache(request, source) {
  const ttl = Number(source.cacheTtl) || 0;
  const cache = globalThis.caches?.default;
  if (!cache || ttl <= 0) return null;
  const hit = await cache.match(cacheRequest(request));
  if (!hit) return null;
  try {
    const body = await hit.json();
    body.cache = { status: 'HIT', ttl };
    return json(body, 200, { 'cache-control': cacheControl(ttl), 'x-nexus-cache': 'HIT' });
  } catch {
    return null;
  }
}

async function writeEdgeCache(request, source, response) {
  const ttl = Number(source.cacheTtl) || 0;
  const cache = globalThis.caches?.default;
  if (!cache || ttl <= 0 || !response.ok) return;
  await cache.put(cacheRequest(request), response.clone());
}

function compareSnapshots(previous, records) {
  if (!previous?.records || !Array.isArray(previous.records)) return null;
  const before = new Set(previous.records.map((record) => record.raw_id).filter(Boolean));
  const after = new Set(records.map((record) => record.raw_id).filter(Boolean));
  const added = [...after].filter((id) => !before.has(id)).length;
  const removed = [...before].filter((id) => !after.has(id)).length;
  return { previous_at: previous.generated_at || null, added, removed, unchanged: Math.max(0, after.size - added) };
}

async function persistKnowledgeSnapshot(env, sourceId, source, records, intelligence, fetchedAt) {
  const store = env?.NEXUS_KNOWLEDGE;
  if (!store?.get || !store?.put || !records.length) return { status: 'disabled', binding: 'NEXUS_KNOWLEDGE' };

  try {
    const latestKey = `latest:${sourceId}`;
    const previous = await store.get(latestKey, 'json');
    const delta = compareSnapshots(previous, records);
    if (delta) {
      intelligence.trend = {
        state: 'historical',
        direction: delta.added > delta.removed ? 'expanding' : delta.removed > delta.added ? 'contracting' : 'stable',
        delta,
        note: '직전 저장 스냅샷과 raw_id를 비교한 변화량입니다. 내용 중요도 판단은 별도 분석 규칙에서 수행합니다.'
      };
    }

    const snapshot = {
      schema: NEXUS_PUBLIC_DATA_SCHEMA.version,
      source: sourceId,
      owner: source.owner,
      generated_at: fetchedAt,
      records,
      intelligence
    };
    const encoded = JSON.stringify(snapshot);
    const bucket = fetchedAt.slice(0, 13).replace(/[-T:]/g, '');
    await Promise.all([
      store.put(`snapshot:${sourceId}:${bucket}`, encoded, { expirationTtl: SNAPSHOT_TTL_SECONDS }),
      store.put(latestKey, encoded)
    ]);
    return { status: 'stored', binding: 'NEXUS_KNOWLEDGE', delta };
  } catch (error) {
    console.error('Nexus knowledge snapshot failed:', sourceId, error);
    return { status: 'error', binding: 'NEXUS_KNOWLEDGE' };
  }
}

function catalogPayload(env) {
  const sources = listPublicDataSources().map((entry) => {
    const source = getPublicDataSource(entry.id);
    return { ...entry, credentialConfigured: Boolean(readCredential(source, env)) };
  });
  return {
    ok: true,
    schema: NEXUS_PUBLIC_DATA_SCHEMA,
    architecture: ['external-api', 'adapter', 'normalized-records', 'edge-cache', 'classification-analysis', 'nexus-owner-view'],
    sources,
    providerCatalog: listPublicDataProviderCatalog(),
    knowledgeStore: { binding: 'NEXUS_KNOWLEDGE', configured: Boolean(env?.NEXUS_KNOWLEDGE?.get && env?.NEXUS_KNOWLEDGE?.put) }
  };
}

async function proxyGet(context) {
  const { request, env } = context;
  const inputUrl = new URL(request.url);
  const sourceId = inputUrl.searchParams.get('source');

  if (!sourceId || sourceId === 'catalog') return json(catalogPayload(env));

  const source = getPublicDataSource(sourceId);
  if (!source) return json({ ok: false, error: 'unknown_source' }, 404);
  if (source.method !== 'GET') return json({ ok: false, error: 'method_not_allowed' }, 405);

  const validation = validateRequiredParams(source, inputUrl);
  if (!validation.ok) {
    return json({ ok: false, error: 'missing_required_parameter', source: sourceId, missing: validation.missing || [], missingAny: validation.missingAny || [] }, 400);
  }

  const cached = await readEdgeCache(request, source);
  if (cached) return cached;

  let upstream;
  try {
    upstream = buildUpstreamUrl(source, inputUrl, env);
  } catch (error) {
    if (error?.code === 'credential_missing') return json({ ok: false, error: 'credential_missing', env: error.envName, source: sourceId }, 503);
    throw error;
  }

  const upstreamResponse = await fetch(upstream.toString(), { method: 'GET', headers: upstreamHeaders(source) });
  const parsed = await parseUpstream(upstreamResponse, source);
  const applicationError = detectApplicationError(source, parsed);
  const credential = readCredential(source, env);
  const normalizedCredential = credential ? normalizeCredentialForUpstream(source, credential) : null;
  const clientData = redactCredentials(parsed.data, [credential, normalizedCredential]);
  const fetchedAt = new Date().toISOString();

  if (applicationError) {
    return json({
      ok: false, error: applicationError.code, message: applicationError.message, source: sourceId,
      sourceInfo: publicSource(source), fetchedAt, request: safeRequestParams(source, inputUrl),
      upstreamStatus: upstreamResponse.status, format: parsed.format, data: clientData, records: []
    }, UPSTREAM_DEPENDENCY_STATUS);
  }

  if (!upstreamResponse.ok) {
    return json({
      ok: false, source: sourceId, sourceInfo: publicSource(source), fetchedAt,
      request: safeRequestParams(source, inputUrl), upstreamStatus: upstreamResponse.status,
      format: parsed.format, data: clientData, records: []
    }, UPSTREAM_DEPENDENCY_STATUS);
  }

  const records = normalizePublicData(sourceId, source, clientData, fetchedAt);
  const intelligence = buildPublicDataIntelligence(sourceId, source, records, fetchedAt);
  const knowledge = await persistKnowledgeSnapshot(env, sourceId, source, records, intelligence, fetchedAt);
  const ttl = Number(source.cacheTtl) || 0;
  const body = {
    ok: true,
    schema: NEXUS_PUBLIC_DATA_SCHEMA.version,
    source: sourceId,
    sourceInfo: publicSource(source),
    fetchedAt,
    request: safeRequestParams(source, inputUrl),
    upstreamStatus: upstreamResponse.status,
    format: parsed.format,
    data: clientData,
    records,
    intelligence,
    cache: { status: ttl > 0 ? 'MISS' : 'BYPASS', ttl },
    knowledge
  };
  const response = json(body, 200, { 'cache-control': cacheControl(ttl), 'x-nexus-cache': ttl > 0 ? 'MISS' : 'BYPASS' });
  await writeEdgeCache(request, source, response);
  return response;
}

function normalizeBusinessNumbers(value) {
  if (!Array.isArray(value) || value.length < 1 || value.length > 100) return null;
  const numbers = value.map((item) => String(item || '').replace(/-/g, '').trim());
  return numbers.every((item) => /^\d{10}$/.test(item)) ? numbers : null;
}

async function proxyPost({ request, env }) {
  const contentLength = Number.parseInt(request.headers.get('content-length') || '0', 10);
  if (contentLength > MAX_BODY_BYTES) return json({ ok: false, error: 'request_too_large' }, 413);

  const inputUrl = new URL(request.url);
  const sourceId = inputUrl.searchParams.get('source');
  const source = getPublicDataSource(sourceId);
  if (!source) return json({ ok: false, error: 'unknown_source' }, 404);
  if (source.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);

  const credential = readCredential(source, env);
  if (!credential) return json({ ok: false, error: 'credential_missing', env: source.auth?.env || null, source: sourceId }, 503);
  const normalizedCredential = normalizeCredentialForUpstream(source, credential);

  let body;
  try { body = await request.json(); }
  catch { return json({ ok: false, error: 'invalid_json' }, 400); }

  if (source.bodyType !== 'businessNumbers') return json({ ok: false, error: 'unsupported_body_type' }, 400);
  const businessNumbers = normalizeBusinessNumbers(body?.b_no);
  if (!businessNumbers) return json({ ok: false, error: 'invalid_business_numbers', detail: 'b_no must contain 1-100 ten-digit business numbers' }, 400);

  const upstream = new URL(source.url);
  upstream.searchParams.set(source.auth.param, normalizedCredential);
  const upstreamResponse = await fetch(upstream.toString(), {
    method: 'POST', headers: { ...upstreamHeaders(source), 'content-type': 'application/json' }, body: JSON.stringify({ b_no: businessNumbers })
  });
  const parsed = await parseUpstream(upstreamResponse, source);
  const clientData = redactCredentials(parsed.data, [credential, normalizedCredential]);
  const fetchedAt = new Date().toISOString();
  const records = upstreamResponse.ok ? normalizePublicData(sourceId, source, clientData, fetchedAt) : [];
  const intelligence = buildPublicDataIntelligence(sourceId, source, records, fetchedAt);

  return json({
    ok: upstreamResponse.ok,
    schema: NEXUS_PUBLIC_DATA_SCHEMA.version,
    source: sourceId,
    sourceInfo: publicSource(source),
    fetchedAt,
    requestCount: businessNumbers.length,
    upstreamStatus: upstreamResponse.status,
    format: parsed.format,
    data: clientData,
    records,
    intelligence,
    cache: { status: 'BYPASS', ttl: 0 }
  }, upstreamResponse.ok ? 200 : UPSTREAM_DEPENDENCY_STATUS);
}

export async function onRequestGet(context) {
  try { return await proxyGet(context); }
  catch (error) {
    console.error('Nexus public data GET failed:', error);
    return json({ ok: false, error: 'public_data_upstream_failed' }, UPSTREAM_DEPENDENCY_STATUS);
  }
}

export async function onRequestPost(context) {
  try { return await proxyPost(context); }
  catch (error) {
    console.error('Nexus public data POST failed:', error);
    return json({ ok: false, error: 'public_data_upstream_failed' }, UPSTREAM_DEPENDENCY_STATUS);
  }
}
