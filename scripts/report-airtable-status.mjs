import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PAGE = path.join(ROOT, 'nexus', 'investment-strategy', 'index.html');

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN || '';
const BASE_ID = process.env.AIRTABLE_NEXUS_BASE_ID || 'app1pTOfgqPtoNt4o';
const TABLE_ID = process.env.AIRTABLE_NEXUS_TABLE_ID || 'tblD19Btd7vaYWFjF';
const RECORD_ID = process.env.AIRTABLE_NEXUS_RECORD_ID || 'recL9oitkJduN8yeD';
const REFRESH_STATUS = (process.env.NEXUS_REFRESH_STATUS || 'unknown').toLowerCase();
const RUN_URL = process.env.GITHUB_RUN_URL || '';

function extractDataDate() {
  try {
    const html = fs.readFileSync(PAGE, 'utf8');
    const match = html.match(/자동 갱신 · (\d{4})\.(\d{2})\.(\d{2}) 기준/)
      || html.match(/분석 기준 (\d{4})\.(\d{2})\.(\d{2})/);
    if (!match) return null;
    return `${match[1]}-${match[2]}-${match[3]}`;
  } catch {
    return null;
  }
}

async function report() {
  if (!AIRTABLE_TOKEN) {
    console.log('Airtable status report skipped: AIRTABLE_TOKEN is not configured.');
    return;
  }

  const isSuccess = REFRESH_STATUS === 'success';
  const isCancelled = REFRESH_STATUS === 'cancelled';
  const dataDate = extractDataDate();
  const fields = {
    '최근 실행일시': new Date().toISOString(),
    '상태': isSuccess ? '정상' : (isCancelled ? '주의' : '오류'),
    '최근 오류': isSuccess ? '' : `GitHub Actions ${REFRESH_STATUS}${RUN_URL ? ` · ${RUN_URL}` : ''}`
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

    console.log(`Airtable status report completed: ${fields['상태']}${dataDate ? ` / ${dataDate}` : ''}`);
  } catch (error) {
    console.warn(`Airtable status report skipped after error: ${error?.message || error}`);
  }
}

await report();
