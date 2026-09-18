import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const nexusDir = path.resolve(here, '..');
const newsDir = path.join(nexusDir, 'news');
const articleDir = path.join(newsDir, 'articles');
const registryPath = path.join(newsDir, 'news-data.js');
const sitemapPath = path.join(newsDir, 'sitemap.xml');
// Stable display order; actual categories are still discovered from article metadata below.
const preferredCategoryOrder = ['정치', '정부', '경제·산업', '사회', '법·정책', 'AI·기술', '글로벌·컬처'];

function decodeHtml(value = '') {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/\s+/g, ' ')
    .trim();
}

function textByClass(source, tag, className) {
  const pattern = new RegExp(`<${tag}\\b(?=[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'])[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = source.match(pattern);
  return match ? decodeHtml(match[1]) : '';
}

function youtubeId(value = '') {
  const match = value.match(/(?:youtube\.com\/(?:watch\?[^"'\s]*?v=|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i);
  return match?.[1] || '';
}

function articleVideo(filename, source) {
  const links = [...source.matchAll(/<a\b(?=[^>]*class=["'][^"']*\barticle-video-link\b[^"']*["'])[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  if (links.length > 1) throw new Error(`${filename}: only one canonical article-video-link is allowed.`);
  if (!links.length) return null;

  const [, url, body] = links[0];
  const id = youtubeId(url);
  const thumbnail = body.match(/<img\b(?=[^>]*class=["'][^"']*\barticle-video-thumb\b[^"']*["'])[^>]*src=["']([^"']+)["'][^>]*>/i)?.[1] || '';
  const sourceLabel = textByClass(body, 'span', 'article-video-meta');
  const title = decodeHtml(body.match(/<strong\b[^>]*>([\s\S]*?)<\/strong>/i)?.[1] || '');

  if (!id) throw new Error(`${filename}: article-video-link must use a supported YouTube URL.`);
  if (!thumbnail.includes(`/vi/${id}/`)) throw new Error(`${filename}: article-video-thumb must match YouTube video ${id}.`);
  if (!sourceLabel) throw new Error(`${filename}: article-video-meta source label is missing.`);
  if (!title) throw new Error(`${filename}: article-video title is missing.`);

  return { url, youtubeId: id, title, source: sourceLabel, thumbnail };
}

function loadRegistry() {
  const source = fs.readFileSync(registryPath, 'utf8');
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: registryPath });
  const config = JSON.parse(JSON.stringify(context.window.YEHAVHA_NEWS_CONFIG || {}));
  const data = JSON.parse(JSON.stringify(context.window.YEHAVHA_NEWS_DATA || []));
  if (!Array.isArray(data)) throw new Error('YEHAVHA_NEWS_DATA must be an array.');
  return { config, data };
}

function articleRecord(filename, source, previous = {}) {
  const id = filename.replace(/\.html$/i, '');
  const title = decodeHtml(source.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '');
  const summary = textByClass(source, 'p', 'article-deck');
  const kicker = textByClass(source, 'p', 'article-kicker');
  const meta = textByClass(source, 'p', 'article-meta');
  const metaParts = meta.split(/\s+·\s+/).map(part => part.trim()).filter(Boolean);
  const filenameDate = id.match(/^(20\d{2}-\d{2}-\d{2})/)?.[1] || '';
  const publishedAt = source.match(/<time\\b(?=[^>]*class=["'][^"']*\\barticle-published\\b[^"']*["'])[^>]*datetime=["']([^"']+)["'][^>]*>/i)?.[1] || '';
  const modifiedAt = source.match(/<time\\b(?=[^>]*class=["'][^"']*\\barticle-modified\\b[^"']*["'])[^>]*datetime=["']([^"']+)["'][^>]*>/i)?.[1] || '';
  const date = /^20\d{2}-\d{2}-\d{2}T/.test(publishedAt) ? publishedAt.slice(0, 10) : filenameDate;
  const category = kicker || previous.category || '';
  const author = metaParts.at(-1) || previous.author || '이명훈';
  const video = articleVideo(filename, source);
  const { video: _staleVideo, publishedAt: _stalePublishedAt, modifiedAt: _staleModifiedAt, ...preserved } = previous;

  if (!title) throw new Error(`${filename}: article title is missing.`);
  if (!summary) throw new Error(`${filename}: article deck is missing.`);
  if (!date) throw new Error(`${filename}: article date is missing.`);
  if (!category) throw new Error(`${filename}: article category is missing.`);

  return {
    ...preserved,
    id,
    date,
    category,
    author,
    type: previous.type || '기사',
    title,
    summary,
    publishedAt,
    ...(modifiedAt ? { modifiedAt } : {}),
    href: `./articles/${filename}`,
    keywords: previous.keywords || `${title} ${category}`,
    ...(video ? { video } : {})
  };
}

function gitDate(relativePath, fallback) {
  try {
    const value = execFileSync('git', ['log', '-1', '--format=%cs', '--', relativePath], {
      cwd: path.resolve(nexusDir, '..'),
      encoding: 'utf8'
    }).trim();
    return /^20\d{2}-\d{2}-\d{2}$/.test(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function xmlEscape(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function buildSitemap(records) {
  const latestDate = records.reduce((latest, item) => item.date > latest ? item.date : latest, '');
  const aboutDate = gitDate('nexus/news/about.html', latestDate);
  const policyPages = [
    ['policies/', 'nexus/news/policies/index.html', '0.6'],
    ['policies/editorial-ethics.html', 'nexus/news/policies/editorial-ethics.html', '0.5'],
    ['policies/anti-graft.html', 'nexus/news/policies/anti-graft.html', '0.5'],
    ['policies/legal-review.html', 'nexus/news/policies/legal-review.html', '0.5'],
    ['policies/ads-sponsorship.html', 'nexus/news/policies/ads-sponsorship.html', '0.5'],
    ['policies/corrections-replies.html', 'nexus/news/policies/corrections-replies.html', '0.6']
  ];
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <url><loc>https://yehavha.com/news/</loc><lastmod>${xmlEscape(latestDate)}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`,
    `  <url><loc>https://yehavha.com/news/about.html</loc><lastmod>${xmlEscape(aboutDate)}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>`,
    ...policyPages.map(([url, file, priority]) => {
      const changed = gitDate(file, latestDate);
      return `  <url><loc>https://yehavha.com/news/${xmlEscape(url)}</loc><lastmod>${xmlEscape(changed)}</lastmod><changefreq>monthly</changefreq><priority>${priority}</priority></url>`;
    })
  ];

  for (const record of records) {
    const filename = path.basename(record.href);
    const lastmod = record.modifiedAt?.slice(0, 10) || record.date;
    lines.push(`  <url><loc>https://yehavha.com/news/articles/${xmlEscape(filename)}</loc><lastmod>${xmlEscape(lastmod)}</lastmod></url>`);
  }
  lines.push('</urlset>', '');
  return lines.join('\n');
}

const { config, data: previousData } = loadRegistry();
const previousById = new Map(previousData.map(item => [item.id, item]));
const previousOrder = new Map(previousData.map((item, index) => [item.id, index]));
const articleFiles = fs.readdirSync(articleDir).filter(name => name.endsWith('.html')).sort();

const records = articleFiles.map(filename => {
  const id = filename.replace(/\.html$/i, '');
  const source = fs.readFileSync(path.join(articleDir, filename), 'utf8');
  return articleRecord(filename, source, previousById.get(id) || {});
});

const observedCategories = [...new Set(records.map(item => item.category).filter(Boolean))];
const configuredCategories = Array.isArray(config.categories) ? config.categories : [];
const allCategories = [...new Set([...configuredCategories, ...observedCategories])];
config.categories = [
  ...preferredCategoryOrder.filter(category => allCategories.includes(category)),
  ...allCategories.filter(category => !preferredCategoryOrder.includes(category))
];

records.sort((a, b) => {
  const byDate = b.date.localeCompare(a.date);
  if (byDate) return byDate;
  const aOrder = previousOrder.has(a.id) ? previousOrder.get(a.id) : Number.MAX_SAFE_INTEGER;
  const bOrder = previousOrder.has(b.id) ? previousOrder.get(b.id) : Number.MAX_SAFE_INTEGER;
  if (aOrder !== bOrder) return aOrder - bOrder;
  return b.id.localeCompare(a.id);
});

// The latest edition must never hide a validated same-day article merely because
// the edition grew past the historical 10-card default.
const latestRecordDate = records[0]?.date || '';
const latestEditionCount = latestRecordDate
  ? records.filter(item => item.date === latestRecordDate).length
  : 0;
config.homeLatestLimit = Math.max(10, latestEditionCount);

const ids = new Set();
for (const record of records) {
  if (ids.has(record.id)) throw new Error(`Duplicate article id: ${record.id}`);
  ids.add(record.id);
}

const output = `/* YEHAVHA NEWS generated article registry.\n   Display metadata, observed categories, and optional related-video metadata are derived from article HTML. Keywords and non-display metadata are preserved from the previous registry.\n   Do not hand-edit title, summary, date, category, author, href or video here; edit the article instead. */\nwindow.YEHAVHA_NEWS_CONFIG = Object.freeze(${JSON.stringify(config, null, 2)});\n\nwindow.YEHAVHA_NEWS_DATA = Object.freeze(${JSON.stringify(records, null, 2)});\n`;

const before = fs.readFileSync(registryPath, 'utf8');
if (before !== output) {
  fs.writeFileSync(registryPath, output, 'utf8');
  console.log(`YEHAVHA NEWS registry synchronized: ${records.length} article(s), ${config.categories.length} categor(ies).`);
} else {
  console.log(`YEHAVHA NEWS registry already synchronized: ${records.length} article(s), ${config.categories.length} categor(ies).`);
}

const sitemap = buildSitemap(records);
const beforeSitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : '';
if (beforeSitemap !== sitemap) {
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log(`YEHAVHA NEWS sitemap synchronized: ${records.length} article URL(s).`);
} else {
  console.log(`YEHAVHA NEWS sitemap already synchronized: ${records.length} article URL(s).`);
}
