import fs from 'node:fs';
import path from 'node:path';

const BUSINESS_FOOTER = '스카이예슈아 · 사업자등록번호 536-38-01234 · 대표 이명훈';
const PORTAL_CSS = 'nexus/portal-v2.css';

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

console.log(`Business footer audit: ${errors} error(s)`);
if (errors) process.exit(1);
