import { getPublicDataSource, listPublicDataSources } from '../lib/public-data-registry.js';

const MAX_BODY_BYTES = 16_384;
const MAX_ROWS = 100;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store, max-age=0',
      'x-content-type-options': 'nosniff'
    }
  });
}

function publicSource(source) {
  return {
    axis: source.axis,
    provider: source.provider,
    title: source.title,
    method: source.method
  };
}

function readCredential(source, env) {
  const key = source.auth?.env ? env?.[source.auth.env] : null;
  return typeof key === 'string' && key.trim() ? key.trim() : null;
}

function clampRows(name, value) {
  if (!['display', 'numOfRows'].includes(name)) return value;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return value;
  return String(Math.min(parsed, MAX_ROWS));
}

function validateRequiredParams(source, inputUrl) {
  const missing = (source.requiredParams || []).filter((name) => {
    const value = inputUrl.searchParams.get(name);
    return value === null || value.trim() === '';
  });
  if (missing.length) return { ok: false, missing };

  for (const group of source.requiredAny || []) {
    const present = group.some((name) => {
      const value = inputUrl.searchParams.get(name);
      return value !== null && value.trim() !== '';
    });
    if (!present) return { ok: false, missingAny: group };
  }

  return { ok: true };
}

function isLawOpenDataSource(source) {
  return source.provider === '법제처 국가법령정보 공동활용';
}

function isDataGoKrSource(source) {
  return source.auth?.env === 'DATA_GO_KR_SERVICE_KEY';
}

function applyLawDefaults(source, upstream) {
  if (!isLawOpenDataSource(source)) return;
  if (!upstream.pathname.endsWith('/lawSearch.do')) return;

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
  upstream.searchParams.set(source.auth.param, credential);

  for (const [name, value] of Object.entries(source.fixedParams || {})) {
    upstream.searchParams.set(name, value);
  }

  for (const name of source.allowedParams || []) {
    const value = inputUrl.searchParams.get(name);
    if (value !== null && value !== '') {
      upstream.searchParams.set(name, clampRows(name, value));
    }
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

function safeUpstreamParams(source, upstream) {
  const params = {};
  for (const [name, value] of upstream.searchParams.entries()) {
    if (name === source.auth?.param) continue;
    params[name] = value;
  }
  return params;
}

function upstreamHeaders(source) {
  if (isLawOpenDataSource(source)) {
    return {
      accept: 'application/json, application/xml, text/xml;q=0.9, */*;q=0.8',
      'user-agent': 'YEHAVHA-NEXUS/1.0 (+https://yehavha.com/)',
      referer: 'https://yehavha.com/'
    };
  }

  if (isDataGoKrSource(source)) {
    return {
      accept: '*/*',
      'user-agent': 'curl/8.4.0'
    };
  }

  return { accept: '*/*' };
}

function redactCredentialString(value, credentials = []) {
  let redacted = value.replace(/([?&](?:OC|serviceKey)=)[^&#\s"']+/gi, '$1[REDACTED]');

  for (const credential of credentials) {
    if (!credential) continue;
    const variants = new Set([
      credential,
      encodeURIComponent(credential),
      encodeURIComponent(encodeURIComponent(credential))
    ]);
    for (const variant of variants) {
      if (variant) redacted = redacted.split(variant).join('[REDACTED]');
    }
  }

  return redacted;
}

function redactCredentials(value, credentials = []) {
  if (typeof value === 'string') return redactCredentialString(value, credentials);
  if (Array.isArray(value)) return value.map((item) => redactCredentials(item, credentials));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, redactCredentials(item, credentials)])
    );
  }
  return value;
}

async function parseUpstream(response, source) {
  const text = await response.text();
  const format = source.responseFormat || 'auto';

  if (format === 'xml') return { format: 'xml', data: text };
  if (format === 'json') {
    try {
      return { format: 'json', data: JSON.parse(text) };
    } catch {
      return { format: 'text', data: text };
    }
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('json') || /^[\s\r\n]*[\[{]/.test(text)) {
    try {
      return { format: 'json', data: JSON.parse(text) };
    } catch {
      // Preserve upstream text when a provider returns malformed JSON.
    }
  }
  return { format: contentType.includes('xml') ? 'xml' : 'text', data: text };
}

function detectApplicationError(source, parsed) {
  if (!isLawOpenDataSource(source) || parsed.format !== 'json' || !parsed.data || typeof parsed.data !== 'object') {
    return null;
  }

  const directResult = parsed.data.result;
  const directMessage = parsed.data.msg;
  if (typeof directResult === 'string' && /실패|fail|error/i.test(directResult)) {
    return {
      code: 'law_open_data_validation_failed',
      message: directMessage || directResult
    };
  }

  return null;
}

async function proxyGet({ request, env }) {
  const inputUrl = new URL(request.url);
  const sourceId = inputUrl.searchParams.get('source');

  if (!sourceId || sourceId === 'catalog') {
    return json({ ok: true, sources: listPublicDataSources() });
  }

  const source = getPublicDataSource(sourceId);
  if (!source) return json({ ok: false, error: 'unknown_source' }, 404);
  if (source.method !== 'GET') return json({ ok: false, error: 'method_not_allowed' }, 405);

  const validation = validateRequiredParams(source, inputUrl);
  if (!validation.ok) {
    return json({
      ok: false,
      error: 'missing_required_parameter',
      source: sourceId,
      missing: validation.missing || [],
      missingAny: validation.missingAny || []
    }, 400);
  }

  let upstream;
  try {
    upstream = buildUpstreamUrl(source, inputUrl, env);
  } catch (error) {
    if (error?.code === 'credential_missing') {
      return json({ ok: false, error: 'credential_missing', env: error.envName, source: sourceId }, 503);
    }
    throw error;
  }

  const upstreamResponse = await fetch(upstream.toString(), {
    method: 'GET',
    headers: upstreamHeaders(source)
  });
  const parsed = await parseUpstream(upstreamResponse, source);
  const applicationError = detectApplicationError(source, parsed);
  const credential = readCredential(source, env);
  const clientData = redactCredentials(parsed.data, [credential]);

  if (applicationError) {
    return json({
      ok: false,
      error: applicationError.code,
      message: applicationError.message,
      source: sourceId,
      sourceInfo: publicSource(source),
      fetchedAt: new Date().toISOString(),
      request: safeRequestParams(source, inputUrl),
      upstreamRequest: safeUpstreamParams(source, upstream),
      upstreamStatus: upstreamResponse.status,
      format: parsed.format,
      data: clientData
    }, 502);
  }

  return json({
    ok: upstreamResponse.ok,
    source: sourceId,
    sourceInfo: publicSource(source),
    fetchedAt: new Date().toISOString(),
    request: safeRequestParams(source, inputUrl),
    upstreamRequest: safeUpstreamParams(source, upstream),
    upstreamStatus: upstreamResponse.status,
    format: parsed.format,
    data: clientData
  }, upstreamResponse.ok ? 200 : 502);
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
  if (!credential) {
    return json({ ok: false, error: 'credential_missing', env: source.auth?.env || null, source: sourceId }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  if (source.bodyType !== 'businessNumbers') {
    return json({ ok: false, error: 'unsupported_body_type' }, 400);
  }

  const businessNumbers = normalizeBusinessNumbers(body?.b_no);
  if (!businessNumbers) {
    return json({ ok: false, error: 'invalid_business_numbers', detail: 'b_no must contain 1-100 ten-digit business numbers' }, 400);
  }

  const upstream = new URL(source.url);
  upstream.searchParams.set(source.auth.param, credential);
  const upstreamResponse = await fetch(upstream.toString(), {
    method: 'POST',
    headers: { ...upstreamHeaders(source), 'content-type': 'application/json' },
    body: JSON.stringify({ b_no: businessNumbers })
  });
  const parsed = await parseUpstream(upstreamResponse, source);
  const clientData = redactCredentials(parsed.data, [credential]);

  return json({
    ok: upstreamResponse.ok,
    source: sourceId,
    sourceInfo: publicSource(source),
    fetchedAt: new Date().toISOString(),
    requestCount: businessNumbers.length,
    upstreamStatus: upstreamResponse.status,
    format: parsed.format,
    data: clientData
  }, upstreamResponse.ok ? 200 : 502);
}

export async function onRequestGet(context) {
  try {
    return await proxyGet(context);
  } catch (error) {
    console.error('Nexus public data GET failed:', error);
    return json({ ok: false, error: 'public_data_upstream_failed' }, 502);
  }
}

export async function onRequestPost(context) {
  try {
    return await proxyPost(context);
  } catch (error) {
    console.error('Nexus public data POST failed:', error);
    return json({ ok: false, error: 'public_data_upstream_failed' }, 502);
  }
}
