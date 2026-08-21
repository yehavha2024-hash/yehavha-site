import fs from 'node:fs';
import path from 'node:path';

const BUSINESS_FOOTER = '스카이예슈아 · 사업자등록번호 536-38-01234 · 대표 이명훈';
const PORTAL_CSS = 'nexus/portal-v2.css';
const ARTICLE_CSS = 'nexus/articles/articles.css';
const COMPACT_CSS = 'nexus/layer-compact.css';

let errors = 0;
const fail = (file, message) => {
  errors += 1;
  console.error(`ERROR ${file}: ${message}`);
  console.error(`::error file=${file}::${message}`);
};

const css = fs.readFileSync(PORTAL_CSS, 'utf8');
if (!css.includes(BUSINESS_FOOTER)) fail(PORTAL_CSS, 'Nexus 전역 사업자정보 단일 원본이 누락됨');
if (!/\.footer-meta::before\s*,\s*\.research-footer-meta::before\s*\{/.test(css.replace(/\n/g, ' '))) {
  fail(PORTAL_CSS, '일반 Footer와 전문 연구 Footer에 사업자정보가 함께 적용되지 않음');
}

const requiredPortalFooterTokens = [
  '--nxs-footer-project:13px',
  '--nxs-footer-description:11px',
  '--nxs-footer-text:12px',
  '--nxs-footer-ai:11.5px',
  '--nxs-footer-link:11px',
  'text-align:center!important',
  'flex-direction:column!important',
  'align-items:center!important'
];
for (const token of requiredPortalFooterTokens) {
  if (!css.includes(token)) fail(PORTAL_CSS, `전역 Footer 규격 누락: ${token}`);
}

const articleCss = fs.readFileSync(ARTICLE_CSS, 'utf8');
if (/(^|\n)\s*\.(?:footer|footer-card|footer-meta|reader-site-footer|research-footer)(?:\s|,|\{|:)/m.test(articleCss)) {
  fail(ARTICLE_CSS, '글 아카이브가 전역 Footer 스타일을 다시 소유함');
}
if (articleCss.includes(BUSINESS_FOOTER)) fail(ARTICLE_CSS, '사업자정보가 로컬 CSS에 중복됨');

const compactCss = fs.readFileSync(COMPACT_CSS, 'utf8');
const compactTokens = [
  'font-size:15px;line-height:1.75',
  '.back{display:inline-flex',
  'font-size:11.5px',
  '.footer{margin-top:0;padding:18px 0 36px',
  'text-align:center',
  '.footer>strong{display:block;color:#d7e1ea;font-size:13px',
  '.footer-meta>p{margin:2px auto;color:var(--footer-text);font-size:12px',
  '.footer .ai-disclosure{order:3',
  'font-size:11.5px',
  '.footer-meta>a{order:4',
  'font-size:11px'
];
for (const token of compactTokens) if (!compactCss.includes(token)) fail(COMPACT_CSS, `compact template 공통 규격 누락: ${token}`);
if (!/\.footer-meta>p:nth-child\(2\)\{order:0/.test(compactCss)) fail(COMPACT_CSS, 'compact Footer 사업자정보가 Copyright 앞으로 재정렬되지 않음');

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
  if (/portal-v2\.css/.test(html) && /data-footer-standard=/.test(html)) {
    if (!/class=["'][^"']*(?:\bfooter-meta\b|\bresearch-footer-meta\b)/.test(html)) fail(file, '전역 사업자정보가 적용될 Footer meta 클래스가 없음');
  }
  if (/layer-compact\.css/.test(html)) {
    if (!/class=["'][^"']*\bfooter-meta\b/.test(html)) fail(file, 'compact template Footer meta 클래스가 없음');
    if (!html.includes(BUSINESS_FOOTER)) fail(file, 'compact template HTML의 사업자정보 원문 누락');
  }
  if (/Copyright ©/.test(html) && !/문의\s*<a[^>]+mailto:/s.test(html)) fail(file, 'Copyright는 있으나 문의 mailto가 없음');
  if (/맨 위로 이동/.test(html) && !/href=["']#top["']/.test(html)) fail(file, '맨 위로 이동 링크 대상이 #top이 아님');
}

console.log(`Business/footer canonical audit: ${errors} error(s)`);
if (errors) process.exit(1);
