import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const dataPath = path.join(root, 'legal-people.json');
const sourcePath = path.join(root, 'legal-people-sources.json');
const data = JSON.parse(await fs.readFile(dataPath, 'utf8'));
const config = JSON.parse(await fs.readFile(sourcePath, 'utf8'));

const clean = value => String(value ?? '').replace(/\s+/g, ' ').trim();
const stripTags = html => clean(String(html || '')
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replaceAll('&nbsp;', ' ')
  .replaceAll('&amp;', '&')
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"')
  .replaceAll('&#39;', "'"));

function normalizeDate(text) {
  const match = clean(text).match(/(20\d{2})[.\-/년\s]+(\d{1,2})[.\-/월\s]+(\d{1,2})/);
  return match ? `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}` : '';
}

function categoryFor(title) {
  if (/(학술|세미나|포럼|심포지엄|연구|학술대회)/.test(title)) return '연구·학술';
  if (/(개업|이직|영입|파트너|등록|승진)/.test(title)) return '이동·개업';
  if (/(회원|법무법인|전문팀|시장|LegalTech|리걸테크)/i.test(title)) return '법률시장';
  return '인사';
}

function stableId(sourceId, url, title) {
  const digest = crypto.createHash('sha256').update(`${sourceId}|${url}|${title}`).digest('hex').slice(0, 16);
  return `legalpeople:${sourceId}:${digest}`;
}

async function fetchText(url) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {'User-Agent': 'YEHAVHA-Nexus-Legal-People/1.0', Accept: 'text/html,application/xhtml+xml'},
        signal: AbortSignal.timeout(30000)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 900 * (attempt + 1)));
    }
  }
  throw lastError;
}

function discover(source, html) {
  const records = [];
  const anchorRegex = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  for (const match of html.matchAll(anchorRegex)) {
    const href = clean(match[1]);
    const title = stripTags(match[2]);
    if (!href || !title || title.length < 4 || title.length > 140 || /^(더보기|목록|이전|다음|홈|Home)$/i.test(title)) continue;
    if (!(source.includeKeywords || []).some(keyword => title.includes(keyword))) continue;
    if ((source.excludeKeywords || []).some(keyword => title.includes(keyword))) continue;
    if (/^(javascript:|#)/i.test(href)) continue;

    let sourceUrl;
    try { sourceUrl = new URL(href, source.url).href; } catch { continue; }
    const index = match.index || 0;
    const context = stripTags(html.slice(Math.max(0, index - 220), Math.min(html.length, index + match[0].length + 260)));
    const publishedAt = normalizeDate(context);
    const category = categoryFor(title);
    records.push({
      recordKey: stableId(source.id, sourceUrl, title),
      category,
      source: source.label,
      title,
      publishedAt,
      summary: `${source.label} 공개자료에서 자동 선별된 ${category} 관련 동향입니다. 세부 내용은 공식 원문에서 확인할 수 있습니다.`,
      sourceUrl,
      tags: [source.label, category],
      active: true,
      autoCollected: true
    });
  }
  return records;
}

const existing = Array.isArray(data.records) ? data.records : [];
const byUrl = new Map(existing.filter(r => r.sourceUrl).map(r => [r.sourceUrl, r]));
const byTitle = new Map(existing.map(r => [`${r.source}|${r.title}`, r]));
const merged = new Map(existing.map(r => [r.recordKey, r]));
const failures = [];

for (const source of config.sources || []) {
  try {
    const html = await fetchText(source.url);
    const found = discover(source, html);
    for (const record of found) {
      const previous = byUrl.get(record.sourceUrl) || byTitle.get(`${record.source}|${record.title}`);
      const key = previous?.recordKey || record.recordKey;
      merged.set(key, {
        ...(previous || {}),
        ...record,
        recordKey: key,
        publishedAt: record.publishedAt || previous?.publishedAt || '',
        summary: previous?.summary && !previous.autoCollected ? previous.summary : record.summary,
        tags: [...new Set([...(previous?.tags || []), ...(record.tags || [])])]
      });
    }
    console.log(`${source.id}: ${found.length} candidate(s)`);
  } catch (error) {
    failures.push({source: source.id, message: error.message});
    console.warn(`${source.id}: ${error.message}`);
  }
}

const today = new Intl.DateTimeFormat('en-CA', {timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date());
const records = [...merged.values()]
  .filter(record => record.active !== false)
  .sort((a, b) => String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')) || String(a.recordKey).localeCompare(String(b.recordKey)))
  .slice(0, 80);

if (!records.length) throw new Error('Legal people collector produced zero records.');
const output = {...data, updatedAt: today, sourceFailures: failures, records};
await fs.writeFile(dataPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`Legal people data updated: ${records.length} record(s), failures=${failures.length}`);
