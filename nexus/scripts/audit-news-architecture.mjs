import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const nexusDir = path.resolve(here, '..');
const newsDir = path.join(nexusDir, 'news');
const articleDir = path.join(newsDir, 'articles');
const fail = message => { throw new Error(`[YEHAVHA NEWS audit] ${message}`); };
const text = file => fs.readFileSync(file, 'utf8');
const sorted = values => [...values].sort((a, b) => a.localeCompare(b));
const sameSet = (left, right) => JSON.stringify(sorted(left)) === JSON.stringify(sorted(right));
const visible = value => value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const median = values => {
  if (!values.length) return 0;
  const ordered = [...values].sort((a, b) => a - b);
  const mid = Math.floor(ordered.length / 2);
  return ordered.length % 2 ? ordered[mid] : Math.round((ordered[mid - 1] + ordered[mid]) / 2);
};
const bodySourceOf = source => {
  const match = source.match(/<div\b[^>]*class\s*=\s*(["'])[^"']*\barticle-body\b[^"']*\1[^>]*>([\s\S]*?)<\/div>\s*<\/article>/i);
  return match ? match[2] : '';
};
const paragraphCount = source => [...source.matchAll(/<p\b/gi)].length;
const headingCount = source => [...source.matchAll(/<h2\b/gi)].length;
const sentenceCount = value => (value.match(/[.!?。？！](?:\s|$)/g) || []).length;
const youtubeId = value => value.match(/(?:youtube\.com\/(?:watch\?[^"'\s]*?v=|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i)?.[1] || '';
const textByClass = (source, tag, className) => {
  const pattern = new RegExp(`<${tag}\\b(?=[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'])[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = source.match(pattern);
  return match ? visible(match[1]) : '';
};
const articleVideoOf = (filename, source) => {
  const links = [...source.matchAll(/<a\b(?=[^>]*class=["'][^"']*\barticle-video-link\b[^"']*["'])[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  if (links.length > 1) fail(`${filename}: only one canonical article-video-link is allowed`);
  if (!links.length) return null;
  const [, url, body] = links[0];
  const id = youtubeId(url);
  const thumbnail = body.match(/<img\b(?=[^>]*class=["'][^"']*\barticle-video-thumb\b[^"']*["'])[^>]*src=["']([^"']+)["'][^>]*>/i)?.[1] || '';
  const sourceLabel = textByClass(body, 'span', 'article-video-meta');
  const title = visible(body.match(/<strong\b[^>]*>([\s\S]*?)<\/strong>/i)?.[1] || '');
  if (!id) fail(`${filename}: article-video-link must use a supported YouTube URL`);
  if (!thumbnail.includes(`/vi/${id}/`)) fail(`${filename}: article-video-thumb does not match video ${id}`);
  if (!sourceLabel) fail(`${filename}: article-video-meta source label missing`);
  if (!title) fail(`${filename}: article-video title missing`);
  return { url, youtubeId: id, title, source: sourceLabel, thumbnail };
};

const dataSource = text(path.join(newsDir, 'news-data.js'));
const dataSandbox = { window: {} };
vm.runInNewContext(dataSource, dataSandbox, { filename: 'news-data.js' });
const data = dataSandbox.window.YEHAVHA_NEWS_DATA;
const config = dataSandbox.window.YEHAVHA_NEWS_CONFIG;
if (!Array.isArray(data) || !data.length) fail('canonical article registry is missing or empty');
if (!config || !Array.isArray(config.categories) || !config.categories.length) fail('category configuration is missing');

const ids = new Set();
const hrefs = new Set();
const dataFiles = [];
const dataByFile = new Map();
for (const [index, item] of data.entries()) {
  if (!item || typeof item !== 'object') fail(`record ${index} is not an object`);
  for (const key of ['id', 'date', 'category', 'title', 'summary', 'href']) {
    if (typeof item[key] !== 'string' || !item[key].trim()) fail(`record ${index} has invalid ${key}`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date)) fail(`${item.id}: invalid date ${item.date}`);
  if (!config.categories.includes(item.category)) fail(`${item.id}: unknown category ${item.category}`);
  if (ids.has(item.id)) fail(`duplicate id: ${item.id}`);
  if (hrefs.has(item.href)) fail(`duplicate href: ${item.href}`);
  ids.add(item.id);
  hrefs.add(item.href);
  const expectedHref = `./articles/${item.id}.html`;
  if (item.href !== expectedHref) fail(`${item.id}: href must be ${expectedHref}`);
  if (!item.id.startsWith(item.date)) fail(`${item.id}: id/date mismatch (${item.date})`);
  const filename = path.basename(item.href);
  dataFiles.push(filename);
  dataByFile.set(filename, item);
  if (item.video !== undefined) {
    if (!item.video || typeof item.video !== 'object') fail(`${item.id}: video metadata must be an object`);
    for (const key of ['url', 'youtubeId', 'title', 'source', 'thumbnail']) {
      if (typeof item.video[key] !== 'string' || !item.video[key].trim()) fail(`${item.id}: invalid video.${key}`);
    }
    if (youtubeId(item.video.url) !== item.video.youtubeId) fail(`${item.id}: video URL/id mismatch`);
    if (!item.video.thumbnail.includes(`/vi/${item.video.youtubeId}/`)) fail(`${item.id}: video thumbnail/id mismatch`);
  }
}

const articleFiles = fs.readdirSync(articleDir).filter(name => name.endsWith('.html'));
if (!sameSet(articleFiles, dataFiles)) {
  const missingInData = articleFiles.filter(name => !dataFiles.includes(name));
  const missingOnDisk = dataFiles.filter(name => !articleFiles.includes(name));
  fail(`article registry mismatch; missingInData=${missingInData.join(',') || '-'}; missingOnDisk=${missingOnDisk.join(',') || '-'}`);
}

const articleStats = new Map();
let videoArticleCount = 0;
for (const filename of articleFiles) {
  const source = text(path.join(articleDir, filename));
  if (!source.includes('../style.css')) fail(`${filename}: shared news stylesheet link missing`);
  if (!source.includes('<article')) fail(`${filename}: article element missing`);
  if (!source.includes('<link rel="canonical"')) fail(`${filename}: canonical link missing`);
  if (!/<body\b[^>]*\bid\s*=\s*(["'])top\1/i.test(source)) fail(`${filename}: body #top anchor missing`);
  if (!/class\s*=\s*(["'])[^"']*\bnews-head\b[^"']*\1/i.test(source)) fail(`${filename}: standard news header missing`);
  if (!/data-footer-standard\s*=\s*(["'])v2\1/i.test(source)) fail(`${filename}: standard footer missing`);
  for (const requiredClass of ['business-meta', 'research-identifiers', 'copyright', 'contact', 'ai-disclosure']) {
    const pattern = new RegExp(`class\\s*=\\s*(["'])${requiredClass}\\1`, 'i');
    if (!pattern.test(source)) fail(`${filename}: footer field ${requiredClass} missing`);
  }
  for (const match of source.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)) {
    const heading = visible(match[1]);
    if (heading.length > 24) fail(`${filename}: subheading is too long (${heading})`);
    if (/[.!?。？！]$/.test(heading) || /다$/.test(heading)) fail(`${filename}: subheading should be a compact phrase (${heading})`);
  }

  const registryRecord = dataByFile.get(filename);
  const sourceTitle = visible(source.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '');
  const sourceSummary = textByClass(source, 'p', 'article-deck');
  const sourceCategory = textByClass(source, 'p', 'article-kicker');
  const sourceMeta = textByClass(source, 'p', 'article-meta');
  const sourceMetaParts = sourceMeta.split(/\s+·\s+/).map(part => part.trim()).filter(Boolean);
  const publishedAt = source.match(/<time\b(?=[^>]*class=["'][^"']*\barticle-published\b[^"']*["'])[^>]*datetime=["']([^"']+)["'][^>]*>/i)?.[1] || '';
  const modifiedAt = source.match(/<time\b(?=[^>]*class=["'][^"']*\barticle-modified\b[^"']*["'])[^>]*datetime=["']([^"']+)["'][^>]*>/i)?.[1] || '';
  if (!/^20\d{2}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+09:00$/.test(publishedAt)) fail(`${filename}: written timestamp missing or invalid`);
  if (modifiedAt && !/^20\d{2}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+09:00$/.test(modifiedAt)) fail(`${filename}: modified timestamp invalid`);
  if (modifiedAt && new Date(modifiedAt) <= new Date(publishedAt)) fail(`${filename}: modified timestamp must be later than written timestamp`);
  const sourceDate = publishedAt.slice(0, 10);
  const sourceAuthor = sourceMetaParts.at(-1) || '';
  const displayChecks = [
    ['title', sourceTitle],
    ['summary', sourceSummary],
    ['category', sourceCategory],
    ['date', sourceDate],
    ['author', sourceAuthor],
    ['publishedAt', publishedAt],
    ['modifiedAt', modifiedAt]
  ];
  for (const [field, expected] of displayChecks) {
    const actual = registryRecord?.[field] || '';
    if (actual !== expected) fail(`${filename}: article-owned ${field} and registry are not synchronized`);
  }

  const revisionNoticeMatch = source.match(/<aside\b(?=[^>]*class=["'][^"']*\barticle-revision-notice\b[^"']*["'])[^>]*>[\s\S]*?<\/aside>/i);
  if (revisionNoticeMatch) {
    const notice = revisionNoticeMatch[0];
    if (!modifiedAt) fail(`${filename}: major revision notice requires modified timestamp`);
    if (!/data-editor-approved=["']true["']/i.test(notice)) fail(`${filename}: major revision notice requires editor approval`);
    const editor = notice.match(/data-editor=["']([^"']+)["']/i)?.[1] || '';
    const approvedAt = notice.match(/data-approved-at=["']([^"']+)["']/i)?.[1] || '';
    if (!editor) fail(`${filename}: major revision notice editor missing`);
    if (!/^20\d{2}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+09:00$/.test(approvedAt)) fail(`${filename}: major revision approval timestamp missing or invalid`);
    if (new Date(approvedAt) > new Date(modifiedAt)) fail(`${filename}: editor approval cannot be later than published modification timestamp`);
    for (const requiredClass of ['revision-before', 'revision-after', 'revision-reason', 'revision-approval']) {
      const pattern = new RegExp(`class=["'][^"']*\\b${requiredClass}\\b[^"']*["']`, 'i');
      if (!pattern.test(notice)) fail(`${filename}: major revision notice missing ${requiredClass}`);
    }
    const articleHeadMatch = source.match(/<header\b(?=[^>]*class=["'][^"']*\barticle-head\b[^"']*["'])[^>]*>[\s\S]*?<\/header>/i);
    const headEnd = articleHeadMatch ? source.indexOf(articleHeadMatch[0]) + articleHeadMatch[0].length : -1;
    const noticeIndex = source.indexOf(revisionNoticeMatch[0]);
    if (headEnd < 0) fail(`${filename}: article-head missing for revision notice placement`);
    const videoIndex = source.search(/<a\b(?=[^>]*class=["'][^"']*\barticle-video-link\b)/i);
    const bodyIndex = source.search(/<div\b(?=[^>]*class=["'][^"']*\barticle-body\b)/i);
    const firstContentIndex = [videoIndex, bodyIndex].filter(index => index >= 0).sort((a, b) => a - b)[0] ?? -1;
    if (noticeIndex <= headEnd || (firstContentIndex >= 0 && noticeIndex >= firstContentIndex)) {
      fail(`${filename}: major revision notice must appear below the lead/meta and before article content`);
    }
  }

  const canonicalVideo = articleVideoOf(filename, source);
  const registryVideo = registryRecord?.video || null;
  if (canonicalVideo) videoArticleCount += 1;
  if (JSON.stringify(canonicalVideo) !== JSON.stringify(registryVideo)) {
    fail(`${filename}: article-owned video metadata and registry are not synchronized`);
  }

  const bodySource = bodySourceOf(source);
  if (!bodySource) fail(`${filename}: article-body content missing`);
  const bodyText = visible(bodySource);
  articleStats.set(filename, {
    chars: bodyText.length,
    paragraphs: paragraphCount(bodySource),
    headings: headingCount(bodySource),
    sentences: sentenceCount(bodyText),
    hasDecisionFrame: /(판단|판단기준|확인|지표|기준|점검|살펴|봐야)/.test(bodyText),
    hasConditionalFrame: /(경우|조건|시나리오|여부|달라질|확정되지|불확실|다만)/.test(bodyText),
    hasPoint: /class\s*=\s*(["'])[^"']*\barticle-point\b[^"']*\1/i.test(bodySource),
    exposesInternalLabels: /\b(FACT|CONTEXT|STRATEGY|ACTION|WATCH|ASSESSMENT|IMPACT|NEXUS ACTION)\b/.test(bodyText)
  });
}

const dates = sorted([...new Set(data.map(item => item.date))]);
const latestDate = dates.at(-1);
const previousDate = dates.length > 1 ? dates.at(-2) : null;
const latestItems = data.filter(item => item.date === latestDate);
const previousItems = previousDate ? data.filter(item => item.date === previousDate) : [];
const previousLengths = previousItems
  .map(item => articleStats.get(path.basename(item.href))?.chars || 0)
  .filter(Boolean);
const previousMedian = median(previousLengths);
const densityFloor = Math.max(1800, previousMedian ? Math.round(previousMedian * 0.70) : 1800);
const homeLatestLimit = Number(config.homeLatestLimit) || 0;

if (latestItems.length < 4) fail(`${latestDate}: latest edition has too few articles (${latestItems.length}); expected at least 4 meaningful articles`);
if (homeLatestLimit < latestItems.length) fail(`${latestDate}: homeLatestLimit ${homeLatestLimit} hides ${latestItems.length - homeLatestLimit} validated latest-edition article(s)`);
for (const item of latestItems) {
  const filename = path.basename(item.href);
  const stats = articleStats.get(filename);
  if (!stats) fail(`${filename}: quality statistics missing`);
  if (stats.chars < densityFloor) fail(`${filename}: article-body is too shallow (${stats.chars} chars; minimum ${densityFloor}, previous-date median ${previousMedian || 'n/a'})`);
  if (stats.paragraphs < 8) fail(`${filename}: depth gate requires at least 8 body paragraphs (${stats.paragraphs})`);
  if (stats.headings < 3) fail(`${filename}: depth gate requires at least 3 compact h2 sections (${stats.headings})`);
  if (stats.sentences < 14) fail(`${filename}: depth gate requires at least 14 body sentences (${stats.sentences})`);
  if (!stats.hasPoint) fail(`${filename}: article-point judgment dashboard is missing`);
  if (!stats.hasDecisionFrame) fail(`${filename}: concrete judgment/monitoring criteria are missing`);
  if (!stats.hasConditionalFrame) fail(`${filename}: uncertainty or conditional path analysis is missing`);
  if (stats.exposesInternalLabels) fail(`${filename}: internal editorial labels must not appear in public article text`);
}

const sitemap = text(path.join(newsDir, 'sitemap.xml'));
const sitemapFiles = [...sitemap.matchAll(/<loc>https:\/\/yehavha\.com\/news\/articles\/([^<]+)<\/loc>/g)].map(match => match[1]);
if (!sameSet(articleFiles, sitemapFiles)) fail('news sitemap and article files are not synchronized');
if (!sitemap.includes('<loc>https://yehavha.com/news/</loc>')) fail('news home is missing from sitemap');
if (!sitemap.includes('<loc>https://yehavha.com/news/about.html</loc>')) fail('media information page is missing from sitemap');

const indexSource = text(path.join(newsDir, 'index.html'));
const aboutSource = text(path.join(newsDir, 'about.html'));
for (const required of ['news-data.js', 'app.js', 'categoryNav', 'latestNewsList', 'categoryLatestGrid', 'archiveMonth', 'archiveDates', 'about.html']) {
  if (!indexSource.includes(required)) fail(`index.html missing required hook: ${required}`);
}
if (indexSource.includes('archive-group')) fail('legacy static archive markup remains in index.html');
if (/[?&]v=/.test(indexSource) || /[?&]v=/.test(aboutSource)) fail('manual cache-busting query remains in news HTML');

const appSource = text(path.join(newsDir, 'app.js'));
new vm.Script(appSource, { filename: 'app.js' });
for (const required of ['renderCategoryNav()', 'renderHome()', 'renderView()', "addEventListener('popstate'", 'news-media-feature', 'item?.video']) {
  if (!appSource.includes(required)) fail(`app.js missing required runtime path: ${required}`);
}

const styleSource = text(path.join(newsDir, 'style.css'));
for (const selector of ['.category-latest-grid', '.archive-day', '.article-page', '.article-body', '.news-accountability', '.article-point', '.opinion-feature', '.article-video-link', '.article-revision-notice']) {
  if (!styleSource.includes(selector)) fail(`style.css missing selector: ${selector}`);
}
if (/\.news-head-tools\{[^}]*flex-direction:column/.test(styleSource)) fail('news header tools must not be forced into a vertical row');
if (/\.news-search input\{[^}]*grid-column:1\/-1/.test(styleSource)) fail('news search input must not force a separate row');

const headers = text(path.join(nexusDir, '_headers'));
if (!headers.includes('/news/*') || !headers.includes('Cache-Control: no-cache, no-store, must-revalidate')) fail('canonical /news/* cache policy missing');
const robots = text(path.join(nexusDir, 'robots.txt'));
if (!robots.includes('Sitemap: https://yehavha.com/news/sitemap.xml')) fail('news sitemap is not declared in robots.txt');

console.log(`YEHAVHA NEWS audit passed: ${articleFiles.length} articles, latest=${latestDate}, latestEdition=${latestItems.length}/${homeLatestLimit} visible, videos=${videoArticleCount}, latestDepthFloor=${densityFloor}, previousMedian=${previousMedian || 'n/a'}, ${config.categories.length} categories, article quality/shell/footer/layout/cache synchronized.`);
