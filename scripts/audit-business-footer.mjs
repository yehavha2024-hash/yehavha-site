import fs from 'node:fs';
import path from 'node:path';

const BUSINESS_FOOTER = '스카이예슈아 · 사업자등록번호 536-38-01234 · 대표 이명훈';
const PORTAL_CSS = 'nexus/portal-v2.css';
const ARTICLE_CSS = 'nexus/articles/articles.css';

let errors = 0;
const fail = (file, message) => {
  errors += 1;
  console.error(`ERROR ${file}: ${message}`);
  console.error(`::error file=${file}::${message}`);
};

const css = fs.readFileSync(PORTAL_CSS, 'utf8');
if (!css.includes(BUSINESS_FOOTER)) {
  fail(PORTAL_CSS, 'Nexus 전역 사업자정보 단일 원본이 누락됨');
}
if (!/\.footer-meta::before\s*,\s*\n?\s*\.research-footer-meta::before\s*\{/.test(css)) {
  fail(PORTAL_CSS, '일반 Footer와 전문 연구 Footer에 사업자정보가 함께 적용되지 않음');
}

const articleCss = fs.readFileSync(ARTICLE_CSS, 'utf8');
const requiredArticleFooterTokens = [
  'Canonical article footer — same type scale and spacing as the project footer standard.',
  'font-size:13px!important',
  'font-size:11px!important',
  'font-size:12px!important',
  'font-size:11.5px!important',
  'grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr)!important',
  'text-align:right!important',
  'text-align:left!important'
];
for (const token of requiredArticleFooterTokens) {
  if (!articleCss.includes(token)) fail(ARTICLE_CSS, `글 아카이브 Footer 표준 규격 누락: ${token}`);
}
if (/\.reader-site-footer \.footer-card strong\{[^}]*font-size:10px/.test(articleCss)) {
  fail(ARTICLE_CSS, '구형 10px 글 아카이브 Footer 브랜드 규칙이 재등장함');
}
if (/\.research-footer-brand strong\{[^}]*font-size:(?!13px)/.test(articleCss)) {
  fail(ARTICLE_CSS, '전문 연구 Footer 브랜드 글자크기가 표준 13px과 다름');
}

const htmlFiles = [];
const walk = dir => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(full);
  }
};
walk('nexus');

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  if (!/portal-v2\.css/.test(html) || !/data-footer-standard=/.test(html)) continue;
  if (!/class=["'][^"']*(?:\bfooter-meta\b|\bresearch-footer-meta\b)/.test(html)) {
    fail(file, '전역 사업자정보가 적용될 Footer meta 클래스가 없음');
  }
}

console.log(`Business/footer typography audit: ${errors} error(s)`);
if (errors) process.exit(1);
