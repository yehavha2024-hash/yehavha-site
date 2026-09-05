import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DEFAULT_INVESTMENT_PAGE = path.join(ROOT, 'nexus', 'investment-strategy', 'index.html');

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN || '';
const BASE_ID = process.env.AIRTABLE_NEXUS_BASE_ID || 'app1pTOfgqPtoNt4o';
const TABLE_ID = process.env.AIRTABLE_NEXUS_TABLE_ID || 'tblD19Btd7vaYWFjF';
const RECORD_ID = process.env.AIRTABLE_NEXUS_RECORD_ID || 'recL9oitkJduN8yeD';
const REFRESH_STATUS = (process.env.NEXUS_REFRESH_STATUS || 'unknown').toLowerCase();
const RUN_URL = process.env.GITHUB_RUN_URL || '';
const SOURCE_PATH = process.env.NEXUS_STATUS_SOURCE_PATH || '';
const DATE_FIELD = process.env.NEXUS_STATUS_DATE_FIELD || '';
const WARNING_SOURCE_PATH = process.env.NEXUS_STATUS_WARNING_SOURCE_PATH || '';
const WARNING_FIELD = process.env.NEXUS_STATUS_WARNING_FIELD || '';

function resolveSource(relativeOrAbsolute) {
  if (!relativeOrAbsolute) return '';
  return path.isAbsolute(relativeOrAbsolute) ? relativeOrAbsolute : path.join(ROOT, relativeOrAbsolute);
}

function normalizeDate(value) {
  if (!value) return null;
  const text = String(value).trim();
  const match = text.match(/(20\d{2})[-./](\d{1,2})[-./](\d{1,2})/);
  if (match) return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
  const parsed = new Date(text);
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString().slice(0, 10) : null;
}

function getNestedValue(object, fieldPath) {
  if (!fieldPath) return undefined;
  return fieldPath.split('.').reduce((value, key) => value?.[key], object);
}

function readJson(relativeOrAbsolute) {
  const target = resolveSource(relativeOrAbsolute);
  if (!target) return null;
  try {
    return JSON.parse(fs.readFileSync(target, 'utf8'));
  } catch {
    return null;
  }
}

function extractInvestmentDate() {
  try {
    const html = fs.readFileSync(DEFAULT_INVESTMENT_PAGE, 'utf8');
    const match = html.match(/자동 갱신 · (\d{4})\.(\d{2})\.(\d{2}) 기준/)
      || html.match(/분석 기준 (\d{4})\.(\d{2})\.(\d{2})/);
    if (!match) return null;
    return `${match[1]}-${match[2]}-${match[3]}`;
  } catch {
    return null;
  }
}

function extractDataDate() {
  if (!SOURCE_PATH) return extractInvestmentDate();
  const data = readJson(SOURCE_PATH);
  if (!data) return null;
  const explicit = getNestedValue(data, DATE_FIELD);
  if (explicit != null) return normalizeDate(explicit);
  for (const key of ['updatedAt', 'generatedAt', 'collectedAt', 'date']) {
    const normalized = normalizeDate(data?.[key]);
    if (normalized) return normalized;
  }
  return null;
}

function extractWarnings() {
  const warningSource = WARNING_SOURCE_PATH || SOURCE_PATH;
  if (!warningSource) return [];
  const data = readJson(warningSource);
  if (!data) return [];
  const candidates = WARNING_FIELD
    ? getNestedValue(data, WARNING_FIELD)
    : (data.sourceFailures ?? data.sourceErrors ?? []);
  if (!Array.isArray(candidates)) return [];
  return candidates.filter(Boolean).map(item => {
    if (typeof item === 'string') return item;
    const source = item.source ? `${item.source}: ` : '';
    return `${source}${item.message || item.error || JSON.stringify(item)}`;
  });
}

async function report() {
  if (!AIRTABLE_TOKEN) {
    console.log('Airtable status report skipped: AIRTABLE_TOKEN is not configured.');
    return;
  }

  const isSuccess = REFRESH_STATUS === 'success';
  const isCancelled = REFRESH_STATUS === 'cancelled';
  const dataDate = extractDataDate();
  const warnings = isSuccess ? extractWarnings() : [];
  const status = isSuccess
    ? (warnings.length ? '주의' : '정상')
    : (isCancelled ? '주의' : '오류');
  const errorText = isSuccess
    ? (warnings.length ? `부분 원천 오류: ${warnings.join(' | ')}` : '')
    : `GitHub Actions ${REFRESH_STATUS}${RUN_URL ? ` · ${RUN_URL}` : ''}`;

  const fields = {
    '최근 실행일시': new Date().toISOString(),
    '상태': status,
    '최근 오류': errorText
  };

  if (isSuccess && dataDate) fields['최근 데이터 기준일'] = dataDate;

  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${RECORD_ID}`;

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields }),
      signal: AbortSignal.timeout(8000)
    });

    if (!response.ok) {
      const text = await response.text();
      console.warn(`Airtable status report failed (${response.status}): ${text.slice(0, 500)}`);
      return;
    }

    console.log(`Airtable status report completed: ${status}${dataDate ? ` / ${dataDate}` : ''}`);
  } catch (error) {
    console.warn(`Airtable status report skipped after error: ${error?.message || error}`);
  }
}

await report();
