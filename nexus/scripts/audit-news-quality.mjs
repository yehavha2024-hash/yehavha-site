import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const nexusDir = path.resolve(here, '..');
const newsDir = path.join(nexusDir, 'news');
const articleDir = path.join(newsDir, 'articles');
const fail = message => { throw new Error(`[YEHAVHA NEWS quality] ${message}`); };
const read = file => fs.readFileSync(file, 'utf8');
const visible = value => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const count = (source, pattern) => [...source.matchAll(pattern)].length;
const median = values => {
  if (!values.length) return 0;
  const ordered = [...values].sort((a, b) => a - b);
  const mid = Math.floor(ordered.length / 2);
  return ordered.length % 2 ? ordered[mid] : Math.round((ordered[mid - 1] + ordered[mid]) / 2);
};
const bodySourceOf = source => {
  const start = source.search(/<div\b[^>]*class\s*=\s*(["'])[^"']*\barticle-body\b[^"']*\1[^>]*>/i);
  if (start < 0) return '';
  const openEnd = source.indexOf('>', start);
  const articleEnd = source.lastIndexOf('</article>');
  if (openEnd < 0 || articleEnd < 0) return '';
  const slice = source.slice(openEnd + 1, articleEnd);
  const lastDiv = slice.lastIndexOf('</div>');
  return lastDiv >= 0 ? slice.slice(0, lastDiv) : slice;
};

const dataSource = read(path.join(newsDir, 'news-data.js'));
const sandbox = { window: {} };
vm.runInNewContext(dataSource, sandbox, { filename: 'news-data.js' });
const data = sandbox.window.YEHAVHA_NEWS_DATA;
if (!Array.isArray(data) || !data.length) fail('news-data.js registry is empty');

const dates = [...new Set(data.map(item => item.date))].sort((a, b) => a.localeCompare(b));
const latestDate = dates.at(-1);
const previousDate = dates.length > 1 ? dates.at(-2) : null;
const latestItems = data.filter(item => item.date === latestDate);
const previousItems = previousDate ? data.filter(item => item.date === previousDate) : [];
const seoulParts = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul',
  year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit',
  hourCycle: 'h23'
}).formatToParts(new Date());
const seoul = Object.fromEntries(seoulParts.map(part => [part.type, part.value]));
const seoulToday = `${seoul.year}-${seoul.month}-${seoul.day}`;
const seoulHour = Number(seoul.hour);
const earlyEditionMinimum = latestDate === seoulToday && seoulHour < 6 ? 1 : 4;
if (latestItems.length < earlyEditionMinimum) {
  fail(`${latestDate}: expected at least ${earlyEditionMinimum} meaningful article(s), found ${latestItems.length}`);
}

const statsFor = item => {
  const filename = path.basename(item.href || '');
  const file = path.join(articleDir, filename);
  if (!filename || !fs.existsSync(file)) fail(`${item.id}: article file is missing`);
  const source = read(file);
  const bodySource = bodySourceOf(source);
  if (!bodySource) fail(`${filename}: article-body content is missing`);
  const bodyText = visible(bodySource);
  const headings = [...bodySource.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)].map(match => visible(match[1]));
  const paragraphTexts = [...bodySource.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map(match => visible(match[1]))
    .filter(Boolean);
  const substantialParagraphs = paragraphTexts.filter(text => text.length >= 80);
  const normalizedParagraphs = substantialParagraphs.map(text =>
    text.toLocaleLowerCase('ko-KR').replace(/[^0-9a-z가-힣]+/gi, ' ').replace(/\s+/g, ' ').trim()
  );
  const uniqueSubstantialParagraphs = new Set(normalizedParagraphs);
  return {
    filename,
    source,
    bodySource,
    bodyText,
    chars: bodyText.length,
    paragraphs: count(bodySource, /<p\b/gi),
    substantialParagraphs: substantialParagraphs.length,
    uniqueSubstantialParagraphs: uniqueSubstantialParagraphs.size,
    headings,
    uniqueHeadings: new Set(headings.map(text => text.toLocaleLowerCase('ko-KR').trim())).size,
    sentences: (bodyText.match(/[.!?。？！](?=\s|$)/g) || []).length,
    pointCount: count(bodySource, /class\s*=\s*(["'])[^"']*\barticle-point\b[^"']*\1/gi)
  };
};

const previousLengths = previousItems.map(item => statsFor(item).chars).filter(Boolean);
const previousMedian = median(previousLengths);
const densityFloor = Math.max(1800, previousMedian ? Math.round(previousMedian * 0.70) : 1800);

for (const item of latestItems) {
  const stats = statsFor(item);
  const { filename, source, bodyText } = stats;
  if (!/<body\b[^>]*\bid\s*=\s*(["'])top\1/i.test(source)) fail(`${filename}: body #top is missing`);
  if (!/class\s*=\s*(["'])[^"']*\bnews-head\b[^"']*\1/i.test(source)) fail(`${filename}: standard NEWS header is missing`);
  if (!/data-footer-standard\s*=\s*(["'])v2\1/i.test(source)) fail(`${filename}: standard v2 footer is missing`);
  if (stats.chars < densityFloor) fail(`${filename}: shallow body ${stats.chars} chars; minimum ${densityFloor} (previous-date median ${previousMedian || 'n/a'})`);
  if (stats.paragraphs < 8) fail(`${filename}: requires >=8 body paragraphs, found ${stats.paragraphs}`);
  if (stats.substantialParagraphs < 6) fail(`${filename}: requires >=6 substantial body paragraphs (80+ chars), found ${stats.substantialParagraphs}`);
  if (stats.uniqueSubstantialParagraphs < Math.ceil(stats.substantialParagraphs * 0.8)) {
    fail(`${filename}: body paragraphs are too repetitive (${stats.uniqueSubstantialParagraphs}/${stats.substantialParagraphs} substantial paragraphs are unique)`);
  }
  if (stats.headings.length < 3) fail(`${filename}: requires >=3 compact h2 sections, found ${stats.headings.length}`);
  if (stats.uniqueHeadings !== stats.headings.length) fail(`${filename}: duplicate h2 section heading detected`);
  if (stats.sentences < 14) fail(`${filename}: requires >=14 complete sentences, found ${stats.sentences}`);
  if (stats.pointCount < 1) fail(`${filename}: article-point judgment dashboard is missing`);
  for (const heading of stats.headings) {
    if (heading.length > 24) fail(`${filename}: h2 is too long (${heading})`);
    if (/[.!?。？！]$/.test(heading)) fail(`${filename}: h2 must be a compact phrase (${heading})`);
  }
  if (!/(원인|경로|구조|전달|메커니즘|병목|과정|단계)/.test(bodyText)) fail(`${filename}: mechanism/change-path analysis is missing`);
  if (!/(기업|가계|정부|의료|기관|지역|산업|시장|이용자|당사자|국가|투자자|근로자|기업별|업종)/.test(bodyText)) fail(`${filename}: affected actors are not concrete enough`);
  if (!/(첫째|둘째|셋째|첫 번째|두 번째|세 번째|경우|경로|시나리오)/.test(bodyText)) fail(`${filename}: conditional paths/scenarios are missing`);
  if (!/(판단|확인|지표|기준|변곡점|후속|여부|추적|대시보드)/.test(bodyText)) fail(`${filename}: concrete judgment/monitoring criteria are missing`);
  if (!/(다만|불확실|확정되지|달라질|가능성|조건)/.test(bodyText)) fail(`${filename}: uncertainty/conditions are missing`);
  if (/\b(FACT|CONTEXT|STRATEGY|ACTION|WATCH|ASSESSMENT|IMPACT|NEXUS ACTION)\b/.test(bodyText)) fail(`${filename}: internal editorial labels are exposed`);
  if (/class\s*=\s*(["'])[^"']*\barticle-sources\b[^"']*\1/i.test(source)) fail(`${filename}: public source list must not be emitted`);
}

console.log(`YEHAVHA NEWS quality passed: latest=${latestDate}, articles=${latestItems.length}, minimumBody=${densityFloor}, previousDate=${previousDate || 'n/a'}, previousMedian=${previousMedian || 'n/a'}.`);
