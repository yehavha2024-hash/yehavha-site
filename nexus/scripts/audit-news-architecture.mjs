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
  dataFiles.push(path.basename(item.href));
}

const articleFiles = fs.readdirSync(articleDir).filter(name => name.endsWith('.html'));
if (!sameSet(articleFiles, dataFiles)) {
  const missingInData = articleFiles.filter(name => !dataFiles.includes(name));
  const missingOnDisk = dataFiles.filter(name => !articleFiles.includes(name));
  fail(`article registry mismatch; missingInData=${missingInData.join(',') || '-'}; missingOnDisk=${missingOnDisk.join(',') || '-'}`);
}

for (const filename of articleFiles) {
  const source = text(path.join(articleDir, filename));
  if (!source.includes('../style.css')) fail(`${filename}: shared news stylesheet link missing`);
  if (!source.includes('<article')) fail(`${filename}: article element missing`);
  if (!source.includes('<link rel="canonical"')) fail(`${filename}: canonical link missing`);
  for (const match of source.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)) {
    const heading = visible(match[1]);
    if (heading.length > 24) fail(`${filename}: subheading is too long (${heading})`);
    if (/[.!?。？！]$/.test(heading) || /다$/.test(heading)) fail(`${filename}: subheading should be a compact phrase (${heading})`);
  }
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
for (const required of ['renderCategoryNav()', 'renderHome()', 'renderView()', "addEventListener('popstate'"]) {
  if (!appSource.includes(required)) fail(`app.js missing required runtime path: ${required}`);
}

const styleSource = text(path.join(newsDir, 'style.css'));
for (const selector of ['.category-latest-grid', '.archive-day', '.article-page', '.article-body', '.news-accountability']) {
  if (!styleSource.includes(selector)) fail(`style.css missing selector: ${selector}`);
}
if (/\.news-head-tools\{[^}]*flex-direction:column/.test(styleSource)) fail('news header tools must not be forced into a vertical row');
if (/\.news-search input\{[^}]*grid-column:1\/-1/.test(styleSource)) fail('news search input must not force a separate row');

const headers = text(path.join(nexusDir, '_headers'));
if (!headers.includes('/news/*') || !headers.includes('Cache-Control: no-cache, no-store, must-revalidate')) fail('canonical /news/* cache policy missing');
const robots = text(path.join(nexusDir, 'robots.txt'));
if (!robots.includes('Sitemap: https://yehavha.com/news/sitemap.xml')) fail('news sitemap is not declared in robots.txt');

console.log(`YEHAVHA NEWS audit passed: ${articleFiles.length} articles, ${config.categories.length} categories, compact layout/cache/subheadings synchronized.`);
