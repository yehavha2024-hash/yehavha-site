import fs from 'node:fs';
import path from 'node:path';

const BUSINESS = '스카이예슈아 · 사업자등록번호 536-38-01234 · 대표 이명훈';
const COPYRIGHT = 'Copyright © 이명훈 2026. All rights reserved.';
const ROOTS = [
  'ai-law-tech-foresight',
  'legal-philosophy',
  'legal-knowledge',
  'three-minute-break',
  'toeic-human-100'
];

let errors = 0;
let checked = 0;
const fail = (file, message) => {
  errors += 1;
  console.error(`ERROR ${file}: ${message}`);
  console.error(`::error file=${file}::${message}`);
};

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(full.split(path.sep).join('/'));
  }
  return out;
}

function siteFooter(html) {
  const match = html.match(/<footer\b[^>]*class=["'][^"']*\bsite-footer\b[^"']*["'][^>]*>[\s\S]*?<\/footer>/i);
  return match ? match[0] : '';
}

for (const file of ROOTS.flatMap(root => walk(root))) {
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes('Copyright ©')) continue;
  checked += 1;

  const footer = siteFooter(html);
  if (!footer) {
    fail(file, 'Copyright가 있으나 정적 site-footer 원문이 없음');
    continue;
  }
  if (!/data-footer-standard=["']v2["']/i.test(footer)) fail(file, 'Footer 표준 버전 v2 누락');
  if (!footer.includes(BUSINESS)) fail(file, '사업자정보가 HTML Footer 원문에 직접 존재하지 않음');
  if (!footer.includes(COPYRIGHT)) fail(file, '표준 Copyright 문구 불일치');
  if (!/문의\s*<a[^>]+href=["']mailto:kimbrighth@gmail\.com["']/is.test(footer)) fail(file, '표준 문의 mailto 누락');
  if (!footer.includes('AI 활용 안내')) fail(file, 'AI 활용 안내 누락');
  if (!/href=["']#top["']/i.test(footer) || !footer.includes('맨 위로 이동')) fail(file, '맨 위로 이동 링크 누락');

  const businessAt = footer.indexOf(BUSINESS);
  const copyrightAt = footer.indexOf(COPYRIGHT);
  const contactAt = footer.indexOf('mailto:kimbrighth@gmail.com');
  const aiAt = footer.indexOf('AI 활용 안내');
  const topAt = footer.search(/href=["']#top["']/i);
  if (!(businessAt >= 0 && businessAt < copyrightAt && copyrightAt < contactAt && contactAt < aiAt && aiAt < topAt)) {
    fail(file, 'HTML Footer 원문 순서가 사업자정보 → Copyright → 문의 → AI 활용 안내 → 맨 위로 이동 순서가 아님');
  }

  if (/<a\b[^>]*href=["']#top["'][^>]*onclick=/i.test(footer)) {
    fail(file, '맨 위로 이동이 인라인 JavaScript 보정에 의존함');
  }
}

for (const root of ROOTS) {
  if (!fs.existsSync(root)) continue;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.css')) continue;
    if (/(?:footer[-_.]?(?:fix|override|patch|hotfix)|(?:fix|patch|hotfix)[-_.]?footer)/i.test(entry.name)) {
      fail(`${root}/${entry.name}`, 'Footer 임시 fix/override/patch/hotfix CSS 파일이 남아 있음');
    }
  }
}

console.log(`Standalone business/footer source audit: ${errors} error(s); HTML checked=${checked}`);
if (errors) process.exit(1);
