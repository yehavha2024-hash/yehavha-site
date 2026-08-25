import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_URL = 'https://yehavha-nexus-hub.pages.dev';
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const nexusDir = path.resolve(scriptDir, '..');
const articlesDir = path.join(nexusDir, 'articles');

function xmlEscape(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function urlNode({ loc, lastmod }) {
  const lines = ['  <url>', `    <loc>${xmlEscape(loc)}</loc>`];
  if (lastmod) lines.push(`    <lastmod>${xmlEscape(lastmod)}</lastmod>`);
  lines.push('  </url>');
  return lines.join('\n');
}

const archive = JSON.parse(
  await fs.readFile(path.join(articlesDir, 'articles.json'), 'utf8')
);
const archiveUpdatedAt = archive.updatedAt || undefined;

const urls = [
  { loc: `${SITE_URL}/`, lastmod: archiveUpdatedAt },
  { loc: `${SITE_URL}/articles/`, lastmod: archiveUpdatedAt }
];

for (const article of Array.isArray(archive.articles) ? archive.articles : []) {
  if (!article?.id || article.status === 'draft') continue;
  urls.push({
    loc: `${SITE_URL}/articles/article.html?id=${encodeURIComponent(article.id)}`,
    lastmod: article.updatedAt || article.publishedAt || archiveUpdatedAt
  });
}

const staticArticleFiles = (await fs.readdir(articlesDir, { withFileTypes: true }))
  .filter((entry) =>
    entry.isFile()
    && entry.name.endsWith('.html')
    && entry.name !== 'index.html'
    && entry.name !== 'article.html'
  )
  .map((entry) => entry.name)
  .sort();

for (const fileName of staticArticleFiles) {
  urls.push({
    loc: `${SITE_URL}/articles/${encodeURIComponent(fileName)}`,
    lastmod: archiveUpdatedAt
  });
}

const uniqueUrls = Array.from(
  new Map(urls.map((entry) => [entry.loc, entry])).values()
);

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...uniqueUrls.map(urlNode),
  '</urlset>',
  ''
].join('\n');

await fs.writeFile(path.join(nexusDir, 'sitemap.xml'), xml, 'utf8');

console.log(`Updated Nexus sitemap with ${uniqueUrls.length} URLs.`);
