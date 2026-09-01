import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const dataPath = path.join(root, 'legal-people.json');
const sourcePath = path.join(root, 'legal-people-sources.json');
const curatedPath = path.join(root, 'legal-people-curated.json');
const data = JSON.parse(await fs.readFile(dataPath, 'utf8'));
const config = JSON.parse(await fs.readFile(sourcePath, 'utf8'));
const curated = JSON.parse(await fs.readFile(curatedPath, 'utf8'));

const clean = value => String(value ?? '').replace(/\s+/g, ' ').trim();
const decode = value => clean(String(value || '')
  .replaceAll('&nbsp;', ' ').replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"').replaceAll('&#39;', "'"));
const stripTags = html => decode(String(html || '')
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' '));

function normalizeDate(text) {
  const match = clean(text).match(/(20\d{2})[.\-/년\s]+(\d{1,2})[.\-/월\s]+(\d{1,2})/);
  return match ? `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}` : '';
}

function ageDays(value) {
  if (!value) return Number.POSITIVE_INFINITY;
  const time = Date.parse(`${value}T00:00:00+09:00`);
  return Number.isFinite(time) ? Math.floor((Date.now() - time) / 86400000) : Number.POSITIVE_INFINITY;
}

function cleanTitle(value) {
  return clean(value)
    .replace(/^\[보도자료\]\s*/u, '')
    .replace(/^(기타|위촉|소식|뉴스)\s+/u, '')
    .replace(/\s+20\d{2}[.\-/]\s*\d{1,2}[.\-/]\s*\d{1,2}\.?\s*$/u, '')
    .replace(/\s+20\d{2}\.\s*\d{1,2}\.\s*\d{1,2}\.?\s*$/u, '');
}

function categoryFor(title) {
  if (/(학술|세미나|포럼|심포지엄|토론회|연구|학술대회|변호사대회|논문|저서|발간|출간|학술상|법률문화상|법률문화|판결집|자료집|변호사시험|전문변호사)/u.test(title)) return '연구·학술';
  if (/(전문팀|센터|TF|팀 출범|서비스|법률시장|LegalTech|리걸테크|리걸 AI|AI.*운영|컴플라이언스.*체계)/iu.test(title)) return '법률시장';
  if (/(개업|이직|영입|합류|파트너|승진)/u.test(title)) return '이동·개업';
  if (/(인사|임명|임용|전보|퇴임|보직|위촉|재판관|연구관)/u.test(title)) return '인사';
  return '법률시장';
}

function canonicalSourceUrl(value) {
  if (!value) return '';
  try {
    const url = new URL(value);
    url.hash = '';
    if (/^(www\.)?koreanbar\.or\.kr$/i.test(url.hostname)) {
      url.hostname = 'www.koreanbar.or.kr';
      if (/\/pages\/news\/view\.asp$/i.test(url.pathname)) {
        const seq = url.searchParams.get('seq');
        const types = url.searchParams.get('types');
        url.search = '';
        if (seq) url.searchParams.set('seq', seq);
        if (types) url.searchParams.set('types', types);
      }
    }
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid$|gclid$)/i.test(key)) url.searchParams.delete(key);
    }
    return url.href;
  } catch {
    return clean(value);
  }
}

function stableId(sourceId, url, title) {
  const digest = crypto.createHash('sha256').update(`${sourceId}|${canonicalSourceUrl(url)}|${title}`).digest('hex').slice(0, 16);
  return `legalpeople:${sourceId}:${digest}`;
}

async function fetchText(url) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {'User-Agent': 'YEHAVHA-Nexus-Legal-People/1.5', Accept: 'text/html,application/xhtml+xml'},
        signal: AbortSignal.timeout(22000)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 700 * (attempt + 1)));
    }
  }
  throw lastError;
}

function extractMetaDescription(html) {
  const patterns = [
    /<meta\b[^>]*(?:name|property)=["'](?:description|og:description)["'][^>]*content=["']([^"']+)["'][^>]*>/i,
    /<meta\b[^>]*content=["']([^"']+)["'][^>]*(?:name|property)=["'](?:description|og:description)["'][^>]*>/i
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    const text = match ? stripTags(match[1]) : '';
    if (text.length >= 35) return text;
  }
  return '';
}

function meaningfulParagraphs(html) {
  return [...String(html || '').matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map(match => stripTags(match[1]))
    .filter(text => text.length >= 35 && text.length <= 1200)
    .filter(text => !/(copyright|all rights reserved|개인정보|이메일무단수집|Tel\.|Fax\.|오시는 길|목록으로)/i.test(text));
}

function clip(text, max = 340) {
  const value = clean(text);
  if (value.length <= max) return value;
  const cut = value.slice(0, max);
  const sentenceEnds = [cut.lastIndexOf('다.'), cut.lastIndexOf('니다.'), cut.lastIndexOf('. ')];
  const sentence = Math.max(...sentenceEnds);
  const result = sentence > 130 ? cut.slice(0, sentence + 2) : cut;
  return `${result.trim()}…`;
}

function fallbackSummary(title, category) {
  if (category === '인사') return `${title} 관련 공식 인사 발표입니다. 대상·보직·시행일 등 인사 변동의 핵심사항을 원문과 함께 추적합니다.`;
  if (category === '이동·개업') return `${title} 관련 법조인·전문인력 이동입니다. 합류 배경과 강화되는 전문분야를 중심으로 추적합니다.`;
  if (category === '연구·학술') return `${title} 관련 연구·학술 활동입니다. 발표 주제, 연구성과와 법률실무에 연결되는 쟁점을 확인합니다.`;
  return `${title} 관련 법률시장 변화입니다. 전문조직·서비스·LegalTech 등 법률업무 구조의 변화를 확인합니다.`;
}

function candidateScore(text, title) {
  let score = Math.min(text.length / 70, 5);
  const titleWords = clean(title).replace(/[^0-9A-Za-z가-힣 ]/g, ' ').split(/\s+/).filter(word => word.length >= 2);
  for (const word of titleWords) if (text.includes(word)) score += 1;
  if (/(개최|출범|영입|합류|임명|임용|전보|선정|수상|위촉|발간|연구|발표|주제|대응|강화)/u.test(text)) score += 3;
  if (/(참가비|입금|계좌|수도권 지역 회원|비수도권 지역 회원|\d{2,3},\d{3}원)/u.test(text)) score -= 9;
  if (/^(①|②|③|1\.|2\.|3\.)/.test(text) && text.length < 120) score -= 4;
  if (text.length < 110 && !/(다\.|니다\.|[.!?])$/u.test(text)) score -= 6;
  return score;
}

function detailSummary(title, category, html) {
  const candidates = [extractMetaDescription(html), ...meaningfulParagraphs(html)]
    .map(clean)
    .filter(text => text && text !== title && text.length >= 35)
    .filter(text => !/공식 홈페이지|최적의 솔루션|본문으로 바로가기|메뉴 열기/i.test(text))
    .sort((a, b) => candidateScore(b, title) - candidateScore(a, title));
  const best = candidates[0];
  return best && candidateScore(best, title) > 0 ? clip(best) : fallbackSummary(title, category);
}

function tagsFor(title, source, category) {
  const dictionary = ['AI', '인공지능', 'LegalTech', '리걸AI', '검사', '법관', '헌법재판소', '변호사', '영입', '세미나', '토론회', '학술', '공정거래', '금융', '노동', '개인정보', '정보보호', '컴플라이언스'];
  const tags = [source, category];
  for (const keyword of dictionary) if (title.toLocaleLowerCase('ko-KR').includes(keyword.toLocaleLowerCase('ko-KR'))) tags.push(keyword);
  return [...new Set(tags)].slice(0, 6);
}

function discover(source, html) {
  const records = [];
  const maxAgeDays = Number(config.maxAgeDays || 240);
  const anchorRegex = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  for (const match of html.matchAll(anchorRegex)) {
    const href = clean(match[1]);
    const rawTitle = stripTags(match[2]);
    const title = cleanTitle(rawTitle);
    if (!href || !title || title.length < 5 || title.length > 150 || /^(더보기|목록|이전|다음|홈|Home|회원현황|연수 안내 및 신청)$/i.test(title)) continue;
    if (!(source.includeKeywords || []).some(keyword => rawTitle.includes(keyword) || title.includes(keyword))) continue;
    if ((source.excludeKeywords || []).some(keyword => rawTitle.includes(keyword) || title.includes(keyword))) continue;
    if (/^(javascript:|#)/i.test(href)) continue;

    let sourceUrl;
    try { sourceUrl = canonicalSourceUrl(new URL(href, source.url).href); } catch { continue; }
    const index = match.index || 0;
    const context = stripTags(html.slice(Math.max(0, index - 320), Math.min(html.length, index + match[0].length + 480)));
    const publishedAt = normalizeDate(context);
    if (!publishedAt || ageDays(publishedAt) < -7 || ageDays(publishedAt) > maxAgeDays) continue;

    const category = categoryFor(title);
    records.push({
      recordKey: stableId(source.id, sourceUrl, title),
      category,
      source: source.label,
      title,
      publishedAt,
      summary: fallbackSummary(title, category),
      sourceUrl,
      tags: tagsFor(title, source.label, category),
      active: true,
      autoCollected: true
    });
  }
  const unique = new Map();
  for (const record of records) unique.set(canonicalSourceUrl(record.sourceUrl), record);
  return [...unique.values()].sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
}

async function enrich(records, source) {
  const limit = Number(source.detailLimit || config.detailLimitPerSource || 5);
  const enriched = [];
  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    if (index >= limit) {
      enriched.push(record);
      continue;
    }
    try {
      const html = await fetchText(record.sourceUrl);
      enriched.push({...record, summary: detailSummary(record.title, record.category, html)});
    } catch {
      enriched.push(record);
    }
  }
  return enriched;
}

function stillAllowedBySource(record) {
  const sourceId = String(record.recordKey || '').split(':')[1];
  const source = (config.sources || []).find(item => item.id === sourceId);
  if (!source) return true;
  const title = cleanTitle(record.title);
  const includeKeywords = source.includeKeywords || [];
  if (includeKeywords.length && !includeKeywords.some(keyword => title.includes(keyword))) return false;
  return !(source.excludeKeywords || []).some(keyword => title.includes(keyword));
}

const existing = Array.isArray(data.records) ? data.records : [];
const curatedRecords = Array.isArray(curated.records) ? curated.records : [];
const maxAgeDays = Number(config.maxAgeDays || 240);
const normalizedCurated = curatedRecords.map(record => ({...record, sourceUrl: canonicalSourceUrl(record.sourceUrl), curated: true, autoCollected: false}));
const retainedManual = existing.filter(record => !record.autoCollected);
const baseline = new Map(retainedManual.map(record => [record.recordKey, {...record, sourceUrl: canonicalSourceUrl(record.sourceUrl)}]));
for (const record of normalizedCurated) baseline.set(record.recordKey, record);

const curatedUrls = new Set(normalizedCurated.map(record => canonicalSourceUrl(record.sourceUrl)).filter(Boolean));
const curatedTitles = new Set(normalizedCurated.map(record => `${record.source}|${cleanTitle(record.title)}`));
const retainedAutos = existing.filter(record => record.autoCollected && record.publishedAt && ageDays(record.publishedAt) <= maxAgeDays)
  .map(record => ({...record, title: cleanTitle(record.title), sourceUrl: canonicalSourceUrl(record.sourceUrl), category: categoryFor(cleanTitle(record.title))}))
  .filter(stillAllowedBySource)
  .filter(record => !baseline.has(record.recordKey))
  .filter(record => !curatedUrls.has(canonicalSourceUrl(record.sourceUrl)))
  .filter(record => !curatedTitles.has(`${record.source}|${cleanTitle(record.title)}`));
const retained = [...baseline.values(), ...retainedAutos];
const byUrl = new Map(retained.filter(record => record.sourceUrl).map(record => [canonicalSourceUrl(record.sourceUrl), record]));
const byTitle = new Map(retained.map(record => [`${record.source}|${cleanTitle(record.title)}`, record]));
const merged = new Map(retained.map(record => [record.recordKey, record]));
const failures = [];

for (const source of config.sources || []) {
  try {
    const html = await fetchText(source.url);
    const found = await enrich(discover(source, html), source);
    for (const record of found) {
      const previous = byUrl.get(canonicalSourceUrl(record.sourceUrl)) || byTitle.get(`${record.source}|${cleanTitle(record.title)}`);
      if (previous?.curated) continue;
      const key = previous?.recordKey || record.recordKey;
      merged.set(key, {
        ...(previous || {}),
        ...record,
        recordKey: key,
        sourceUrl: canonicalSourceUrl(record.sourceUrl),
        tags: [...new Set([...(previous?.tags || []), ...(record.tags || [])])].slice(0, 8)
      });
    }
    console.log(`${source.id}: ${found.length} candidate(s)`);
  } catch (error) {
    failures.push({source: source.id, message: error.message});
    console.warn(`${source.id}: ${error.message}`);
  }
}

for (const record of normalizedCurated) {
  const recordUrl = canonicalSourceUrl(record.sourceUrl);
  const recordTitle = `${record.source}|${cleanTitle(record.title)}`;
  for (const [key, item] of merged) {
    if (key === record.recordKey) continue;
    const sameUrl = recordUrl && canonicalSourceUrl(item.sourceUrl) === recordUrl;
    const sameTitle = `${item.source}|${cleanTitle(item.title)}` === recordTitle;
    if (sameUrl || sameTitle) merged.delete(key);
  }
  merged.set(record.recordKey, record);
}

const semanticSeen = new Map();
for (const [key, record] of [...merged]) {
  const urlKey = canonicalSourceUrl(record.sourceUrl);
  if (!urlKey) continue;
  const previousKey = semanticSeen.get(urlKey);
  if (!previousKey) {
    semanticSeen.set(urlKey, key);
    continue;
  }
  const previous = merged.get(previousKey);
  if (previous?.curated && !record.curated) merged.delete(key);
  else if (record.curated && !previous?.curated) {
    merged.delete(previousKey);
    semanticSeen.set(urlKey, key);
  } else if (String(previous?.summary || '').length >= String(record.summary || '').length) merged.delete(key);
  else {
    merged.delete(previousKey);
    semanticSeen.set(urlKey, key);
  }
}

const today = new Intl.DateTimeFormat('en-CA', {timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date());
const displayMaxAgeDays = Math.max(1, Number(config.displayMaxAgeDays || 60));
const latestPerSourceCategory = Math.max(1, Number(config.latestPerSourceCategory || 1));
const currentCandidates = [...merged.values()]
  .filter(record => record.active !== false)
  .filter(record => {
    const publishedAge = ageDays(record.publishedAt);
    const effectiveAge = ageDays(record.effectiveAt);
    return publishedAge <= displayMaxAgeDays || effectiveAge <= 0;
  })
  .sort((a, b) => String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')) || Number(Boolean(b.curated)) - Number(Boolean(a.curated)) || String(a.recordKey).localeCompare(String(b.recordKey)));

const groupCounts = new Map();
const records = currentCandidates
  .filter(record => {
    const sourceKey = clean(record.source) || String(record.recordKey || '').split(':')[1] || 'unknown';
    const groupKey = `${sourceKey}|${record.category || '기타'}`;
    const count = groupCounts.get(groupKey) || 0;
    if (count >= latestPerSourceCategory) return false;
    groupCounts.set(groupKey, count + 1);
    return true;
  })
  .slice(0, 100);

if (!records.length) throw new Error('Legal people collector produced zero records.');
const output = {...data, updatedAt: today, sourceFailures: failures, records};
await fs.writeFile(dataPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`Legal people data updated: ${records.length} record(s), curated=${normalizedCurated.length}, failures=${failures.length}`);
