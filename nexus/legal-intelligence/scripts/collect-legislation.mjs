import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const config = JSON.parse(await fs.readFile(path.join(root, 'collector-config.json'), 'utf8'));
const current = JSON.parse(await fs.readFile(path.join(root, 'legislation.json'), 'utf8'));
const outputPath = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : path.resolve(process.cwd(), '.tmp-legislation-collected.json');
const assemblyKey = process.env.OPEN_ASSEMBLY_API_KEY?.trim();
const lawmakingOc = process.env.LAWMAKING_OC?.trim();

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const clean = value => value == null ? '' : String(value).replace(/\s+/g, ' ').trim();
const decodeXml = value => clean(value)
  .replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&')
  .replaceAll('&quot;', '"').replaceAll('&#39;', "'")
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
const stripHtml = value => decodeXml(String(value || '').replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' '));

async function request(url, options = {}, retries = 2) {
  let lastError;
  const {accept = '*/*', headers = {}, ...fetchOptions} = options;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {'User-Agent': 'YEHAVHA-Nexus-Legal-Intelligence/1.2', Accept: accept, ...headers},
        signal: AbortSignal.timeout(30000)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status} ${url}`);
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < retries) await wait(800 * (attempt + 1));
    }
  }
  throw lastError;
}

function parseAssemblyPayload(data, endpoint) {
  if (data?.RESULT && !data?.[endpoint]) {
    const code = data.RESULT.CODE || '';
    if (code === 'INFO-200') return {rows: [], total: 0};
    throw new Error(`Assembly API ${code}: ${data.RESULT.MESSAGE || 'unknown error'}`);
  }
  const body = data?.[endpoint];
  if (!Array.isArray(body) || !body.length) throw new Error(`Unexpected Assembly API response: ${endpoint}`);
  const head = body[0]?.head || [];
  const code = head?.[1]?.RESULT?.CODE || '';
  if (code === 'INFO-200') return {rows: [], total: 0};
  if (code && code !== 'INFO-000') throw new Error(`Assembly API ${code}: ${head?.[1]?.RESULT?.MESSAGE || 'unknown error'}`);
  const total = Number(head?.[0]?.list_total_count || 0);
  const rawRows = body?.[1]?.row || [];
  return {rows: Array.isArray(rawRows) ? rawRows : [rawRows], total};
}

async function assemblyCall(endpoint, params) {
  if (!assemblyKey) throw new Error('OPEN_ASSEMBLY_API_KEY is not configured.');
  const url = new URL(`https://open.assembly.go.kr/portal/openapi/${endpoint}`);
  const merged = {KEY: assemblyKey, Type: 'json', ...params};
  for (const [key, value] of Object.entries(merged)) if (value !== '' && value != null) url.searchParams.set(key, String(value));
  const response = await request(url, {accept: 'application/json'});
  return parseAssemblyPayload(await response.json(), endpoint);
}

function xmlValue(segment, tag) {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = segment.match(new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, 'i'));
  return match ? decodeXml(match[1].replace(/<[^>]+>/g, '')) : '';
}

function xmlSegments(xml, tag) {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return [...xml.matchAll(new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, 'gi'))].map(match => match[1]);
}

function absoluteGovernmentUrl(value) {
  const text = clean(value);
  if (!text) return '';
  try {
    return new URL(text, 'https://www.lawmaking.go.kr').href;
  } catch {
    return text;
  }
}

function parseGovernmentRows(xml) {
  const starts = [...xml.matchAll(/<lbicId(?:\s[^>]*)?>/gi)].map(match => match.index ?? 0);
  const rows = [];
  for (let i = 0; i < starts.length; i += 1) {
    const segment = xml.slice(starts[i], starts[i + 1] ?? xml.length);
    const lbicId = xmlValue(segment, 'lbicId');
    const lsNmKo = xmlValue(segment, 'lsNmKo');
    if (!lbicId || !lsNmKo) continue;
    rows.push({
      lbicId,
      lsNmKo,
      lsKndNm: xmlValue(segment, 'lsKndNm') || xmlValue(segment, 'lsKndCdNm'),
      rrFrNm: xmlValue(segment, 'rrFrNm') || xmlValue(segment, 'rrFrCdNm'),
      cptOfiOrgNm: xmlValue(segment, 'cptOfiOrgNm') || xmlValue(segment, 'asndOfiCdNm'),
      lbPrcStsNm: xmlValue(segment, 'lbPrcStsNm') || xmlValue(segment, 'lbPrcStsCdGrpNm'),
      lbPrcStsDt: xmlValue(segment, 'lbPrcStsDt'),
      publicSourceUrl: `https://opinion.lawmaking.go.kr/lmSts/govLm/${lbicId}/detailRP`
    });
  }
  return rows;
}

function parseGovernmentStageList(xml, tag, phase, stageField, statusField) {
  return xmlSegments(xml, tag).map(segment => ({
    phase,
    stage: xmlValue(segment, stageField),
    status: xmlValue(segment, statusField)
  })).filter(item => item.stage || item.status);
}

function parseGovernmentDocuments(xml) {
  const documents = [];
  const listTags = ['dsImportList', 'jsdImportList', 'GnrImportList'];
  for (const tag of listTags) {
    for (const segment of xmlSegments(xml, tag)) {
      const pairs = [
        ['FileName', 'fileDownLinkUrl'],
        ['fileName', 'fileDownLinkUrl'],
        ['FileName2', 'fileDown2LinkUrl'],
        ['fileName2', 'fileDown2LinkUrl']
      ];
      for (const [nameField, urlField] of pairs) {
        const name = xmlValue(segment, nameField);
        const url = absoluteGovernmentUrl(xmlValue(segment, urlField));
        if (name || url) documents.push({name, url});
      }
    }
  }
  const unique = new Map();
  for (const document of documents) {
    const key = `${document.url}|${document.name}`;
    if (key !== '|') unique.set(key, document);
  }
  return [...unique.values()];
}

function parseGovernmentDetail(xml) {
  const processStages = [
    ...parseGovernmentStageList(xml, 'dsImportList', '입안', 'lbPrcStsCdGrpNm', 'lbPrcStst'),
    ...parseGovernmentStageList(xml, 'jsdImportList', '심사', 'rcvbFlClsCdNm', 'lbSts'),
    ...parseGovernmentStageList(xml, 'GnrImportList', '심사·의결', 'flClsCdNm', 'lbSts')
  ];

  return {
    lbicId: xmlValue(xml, 'lbicId'),
    lsNmKo: xmlValue(xml, 'lsNmKo'),
    lsKndCdNm: xmlValue(xml, 'lsKndCdNm'),
    rrFrCdNm: xmlValue(xml, 'rrFrCdNm'),
    bgtAttdYn: xmlValue(xml, 'bgtAttdYn'),
    abYn: xmlValue(xml, 'abYn'),
    asndOfiCdNm: xmlValue(xml, 'asndOfiCdNm'),
    asndDptCdNm: xmlValue(xml, 'asndDptCdNm'),
    lmPlnIncludeYn: xmlValue(xml, 'lmPlnIncludeYn'),
    strCts: xmlValue(xml, 'StrCts'),
    rrRsn: xmlValue(xml, 'rrRsn'),
    essCts: xmlValue(xml, 'essCts'),
    processStages,
    documents: parseGovernmentDocuments(xml),
    detailCollectionMode: 'oc-api'
  };
}

function dotDate(date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}. ${m}. ${d}.`;
}

function governmentErrorResponse(text) {
  return /retMsg[^>]*>\s*(400|401|403|500)|<error/i.test(text);
}

async function governmentApiCall(params) {
  if (!lawmakingOc) throw new Error('LAWMAKING_OC is not configured.');
  const url = new URL(config.government.endpoint);
  url.searchParams.set('OC', lawmakingOc);
  for (const [key, value] of Object.entries(params)) if (value !== '' && value != null) url.searchParams.set(key, String(value));
  const response = await request(url, {accept: 'application/xml,text/xml,*/*'});
  const text = await response.text();
  if (governmentErrorResponse(text)) throw new Error('Government legislation API returned an error response.');
  return parseGovernmentRows(text);
}

async function governmentDetailCall(lbicId) {
  if (!lawmakingOc) throw new Error('LAWMAKING_OC is not configured.');
  const id = clean(lbicId);
  if (!/^\d+$/.test(id)) throw new Error(`Invalid government lbicId: ${id}`);
  const base = String(config.government.detailBase || 'https://www.lawmaking.go.kr/rest/govLmSts').replace(/\/$/, '');
  const url = new URL(`${base}/${id}.xml`);
  url.searchParams.set('OC', lawmakingOc);
  const response = await request(url, {accept: 'application/xml,text/xml,*/*'});
  const text = await response.text();
  if (governmentErrorResponse(text)) throw new Error(`Government detail API returned an error response for ${id}.`);
  return parseGovernmentDetail(text);
}

function parseGovernmentPublicHtml(html) {
  const rows = [];
  for (const match of html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const rowHtml = match[1];
    const link = rowHtml.match(/<a\b[^>]*href=["']([^"']*\/lmSts\/govLm\/(\d+)\/detailRP[^"']*)["'][^>]*>([\s\S]*?)<\/a>/i);
    if (!link) continue;
    const cells = [...rowHtml.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(cell => stripHtml(cell[1]));
    const lbicId = clean(link[2]);
    const lsNmKo = stripHtml(link[3]);
    if (!lbicId || !lsNmKo) continue;
    rows.push({
      lbicId,
      lsNmKo,
      lsKndNm: cells[2] || '',
      rrFrNm: cells[3] || '',
      cptOfiOrgNm: cells[4] || '',
      lbPrcStsNm: cells[5] || '',
      lbPrcStsDt: '',
      publicSourceUrl: new URL(link[1], 'https://opinion.lawmaking.go.kr').href,
      collectionMode: 'public-html'
    });
  }
  return rows;
}

async function collectGovernmentPublic() {
  const pages = Number(config.government.publicPages || 12);
  const rows = [];
  for (let page = 1; page <= pages; page += 1) {
    const url = new URL('https://opinion.lawmaking.go.kr/lmSts/govLm');
    url.searchParams.set('pageIndex', String(page));
    const response = await request(url, {accept: 'text/html,application/xhtml+xml'});
    const pageRows = parseGovernmentPublicHtml(await response.text());
    rows.push(...pageRows);
    if (!pageRows.length) break;
  }
  return rows;
}

function recordMap() {
  return new Map((current.records || []).map(record => [record.recordKey, record]));
}

async function collectAssembly() {
  if (!assemblyKey) throw new Error('OPEN_ASSEMBLY_API_KEY is not configured; Assembly source skipped.');
  const cfg = config.assembly;
  const candidates = new Map();
  const tracked = new Set((current.records || []).filter(record => record.sourceType === 'assembly').map(record => clean(record.sourceId)));

  for (const keyword of config.discoveryKeywords || []) {
    for (let page = 1; page <= cfg.maxPagesPerKeyword; page += 1) {
      const {rows, total} = await assemblyCall(cfg.endpoint, {AGE: cfg.age, BILL_NAME: keyword, pIndex: page, pSize: cfg.pageSize});
      for (const row of rows) {
        const billNo = clean(row.BILL_NO);
        if (billNo) candidates.set(billNo, {...candidates.get(billNo), ...row});
      }
      if (!rows.length || page * cfg.pageSize >= total) break;
    }
  }

  for (const billNo of tracked) {
    if (!billNo) continue;
    try {
      const detail = await assemblyCall(cfg.detailEndpoint, {BILL_NO: billNo, pIndex: 1, pSize: 5});
      if (detail.rows[0]) candidates.set(billNo, {...candidates.get(billNo), ...detail.rows[0]});
    } catch (error) {
      console.warn(`Assembly tracked detail skipped ${billNo}: ${error.message}`);
    }
  }

  const output = [];
  for (const [billNo, base] of candidates) {
    if (!tracked.has(billNo)) {
      output.push({sourceType: 'assembly', sourceId: billNo, raw: base});
      continue;
    }
    let review = {};
    try {
      review = (await assemblyCall(cfg.reviewEndpoint, {AGE: cfg.age, BILL_NO: billNo, pIndex: 1, pSize: 10})).rows[0] || {};
    } catch (error) {
      console.warn(`Assembly tracked review skipped ${billNo}: ${error.message}`);
    }
    output.push({sourceType: 'assembly', sourceId: billNo, raw: {...base, ...review}});
  }
  return output;
}

function governmentRelevant(row) {
  const haystack = `${clean(row.lsNmKo)} ${clean(row.cptOfiOrgNm)} ${clean(row.asndOfiCdNm)} ${clean(row.rrRsn)} ${clean(row.essCts)}`.toLocaleLowerCase('ko-KR');
  return (config.discoveryKeywords || []).some(keyword => haystack.includes(String(keyword).toLocaleLowerCase('ko-KR')));
}

async function enrichGovernmentDetails(candidates, existingByTitle) {
  if (!lawmakingOc || !candidates.size) return;
  const limit = Number(config.government.detailLimit || 80);
  const entries = [...candidates.entries()].sort((a, b) => {
    const aExisting = existingByTitle.has(clean(a[1].lsNmKo)) ? 1 : 0;
    const bExisting = existingByTitle.has(clean(b[1].lsNmKo)) ? 1 : 0;
    return bExisting - aExisting || String(b[1].lbPrcStsDt || '').localeCompare(String(a[1].lbPrcStsDt || ''));
  }).slice(0, limit);

  for (const [canonicalId, row] of entries) {
    const lbicId = clean(row.officialLbicId || row.lbicId);
    if (!lbicId) continue;
    try {
      const detail = await governmentDetailCall(lbicId);
      candidates.set(canonicalId, {
        ...row,
        ...detail,
        canonicalSourceId: canonicalId,
        officialLbicId: clean(detail.lbicId || lbicId),
        publicSourceUrl: row.publicSourceUrl || `https://opinion.lawmaking.go.kr/lmSts/govLm/${lbicId}/detailRP`
      });
    } catch (error) {
      console.warn(`Government detail skipped ${lbicId}: ${error.message}`);
    }
  }
}

async function collectGovernment() {
  const candidates = new Map();
  const existingGovernment = (current.records || []).filter(record => record.sourceType === 'government');
  const existingByTitle = new Map(existingGovernment.filter(record => record.title).map(record => [clean(record.title), record]));
  let apiSucceeded = false;

  if (lawmakingOc) {
    const lookback = Number(config.government.lookbackDays || 45);
    const end = new Date();
    const start = new Date(Date.now() - lookback * 86400000);
    try {
      for (const keyword of config.discoveryKeywords || []) {
        const rows = await governmentApiCall({stDtFmt: dotDate(start), edDtFmt: dotDate(end), lsNmKo: keyword});
        for (const row of rows) {
          const previous = existingByTitle.get(clean(row.lsNmKo));
          const canonicalId = previous?.sourceId || clean(row.lbicId);
          if (canonicalId) candidates.set(canonicalId, {...row, canonicalSourceId: canonicalId, officialLbicId: clean(row.lbicId)});
        }
      }
      for (const record of existingGovernment) {
        if (!record.title) continue;
        const rows = await governmentApiCall({lsNmKo: record.title});
        const exact = rows.find(row => clean(row.lbicId) === clean(record.officialLbicId || record.sourceId)) || rows.find(row => clean(row.lsNmKo) === clean(record.title));
        if (exact?.lbicId) candidates.set(clean(record.sourceId), {...exact, canonicalSourceId: clean(record.sourceId), officialLbicId: clean(exact.lbicId)});
      }
      apiSucceeded = true;
      await enrichGovernmentDetails(candidates, existingByTitle);
    } catch (error) {
      console.warn(`Government OC API unavailable; switching to public HTML: ${error.message}`);
    }
  }

  if (!apiSucceeded) {
    const rows = await collectGovernmentPublic();
    for (const row of rows) {
      const previous = existingByTitle.get(clean(row.lsNmKo));
      if (!previous && !governmentRelevant(row)) continue;
      const canonicalId = previous?.sourceId || clean(row.lbicId);
      if (canonicalId) candidates.set(canonicalId, {...row, canonicalSourceId: canonicalId, officialLbicId: clean(row.lbicId)});
    }
  }

  return [...candidates.entries()].map(([sourceId, raw]) => ({sourceType: 'government', sourceId, raw}));
}

const existing = recordMap();
const collected = [];
const sourceErrors = [];

for (const [name, collector] of [['assembly', collectAssembly], ['government', collectGovernment]]) {
  try {
    const rows = await collector();
    collected.push(...rows);
    console.log(`${name}: collected ${rows.length}`);
  } catch (error) {
    sourceErrors.push({source: name, message: error.message});
    console.error(`${name}: ${error.message}`);
  }
}

if (!collected.length) throw new Error(`No legislation candidates collected. ${JSON.stringify(sourceErrors)}`);

const deduped = new Map();
for (const item of collected) {
  const key = `${item.sourceType}:${item.sourceId}`;
  deduped.set(key, {...item, recordKey: key, existing: existing.has(key)});
}

const output = {collectedAt: new Date().toISOString(), sourceErrors, records: [...deduped.values()]};
await fs.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`Collected ${output.records.length} unique candidate(s) -> ${outputPath}`);
