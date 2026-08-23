import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'nexus';
const COPYRIGHT = 'Copyright © 이명훈 2026. All rights reserved.';
const PORTAL = 'nexus/portal-v2.css';
const COMPACT = 'nexus/layer-compact.css';
let errors = 0;
let checked = 0;

const norm = p => p.split(path.sep).join('/');
const fail = (file, message) => {
  errors += 1;
  console.error(`ERROR ${file}: ${message}`);
  console.error(`::error file=${file}::${message}`);
};

function walk(dir, predicate, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, predicate, out);
    else if (entry.isFile() && predicate(full)) out.push(norm(full));
  }
  return out;
}

function footerBlocks(html) {
  return [...html.matchAll(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi)].map(m => m[0]);
}

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

for (const file of walk(ROOT, f => f.endsWith('.html'))) {
  const html = fs.readFileSync(file, 'utf8');
  if (/data-footer-standard=["']v1["']/i.test(html)) fail(file, '구형 Footer 표준 v1이 남아 있음');

  const blocks = footerBlocks(html);
  if (!blocks.length && !html.includes('Copyright ©')) continue;

  for (const footer of blocks) {
    if (!footer.includes('Copyright ©') && !/data-footer-standard=/i.test(footer)) continue;
    checked += 1;
    if (!/data-footer-standard=["']v2["']/i.test(footer)) fail(file, 'Footer 표준 버전 v2 누락');
    if (!footer.includes(COPYRIGHT)) fail(file, '표준 Copyright 문구 불일치');
    if (!/문의\s*<a[^>]+href=["']mailto:kimbrighth@gmail\.com["']/is.test(footer)) fail(file, '표준 문의 mailto 누락');
    if (!footer.includes('AI 활용 안내')) fail(file, 'AI 활용 안내 누락');
    if (!/href=["']#top["']/i.test(footer) || !footer.includes('맨 위로 이동')) fail(file, '표준 맨 위로 이동 링크 누락');

    const copyrightAt = footer.indexOf(COPYRIGHT);
    const contactAt = footer.indexOf('mailto:kimbrighth@gmail.com');
    const aiAt = footer.indexOf('AI 활용 안내');
    const topMatch = footer.match(/href=["']#top["']/i);
    const topAt = topMatch ? topMatch.index : -1;
    if (!(copyrightAt >= 0 && copyrightAt < contactAt && contactAt < aiAt && aiAt < topAt)) {
      fail(file, 'HTML 원문 순서가 Copyright → 문의 → AI 활용 안내 → 맨 위로 이동 순서가 아님');
    }
  }
}

if (!fs.existsSync(PORTAL)) fail(PORTAL, 'canonical portal CSS 없음');
else {
  const css = stripComments(fs.readFileSync(PORTAL, 'utf8'));
  const footerStart = css.indexOf('.footer,.reader-site-footer,.research-footer');
  const footerEnd = css.indexOf('.toast', footerStart);
  const footerCss = footerStart >= 0 ? css.slice(footerStart, footerEnd >= 0 ? footerEnd : undefined) : '';
  if (!footerCss) fail(PORTAL, 'canonical Footer 스타일 블록을 찾을 수 없음');
  if (/\border\s*:/i.test(footerCss)) fail(PORTAL, 'Footer CSS에서 order 재배치 금지: HTML DOM 순서가 유일한 순서 원본이어야 함');
  if (/nth-child\([^)]*\)[^{]*\{[^}]*\border\s*:/is.test(footerCss)) fail(PORTAL, 'nth-child 기반 Footer 순서 보정 금지');
}

if (!fs.existsSync(COMPACT)) fail(COMPACT, 'compact canonical CSS 없음');
else {
  const css = stripComments(fs.readFileSync(COMPACT, 'utf8'));
  if (/^\s*@import[^;]*portal-v2\.css/im.test(css)) fail(COMPACT, 'compact CSS가 portal-v2.css를 import하면 Footer 소유권이 중복됨');
  const footerStart = css.indexOf('.footer{');
  const footerCss = footerStart >= 0 ? css.slice(footerStart) : '';
  if (/\border\s*:/i.test(footerCss)) fail(COMPACT, 'compact Footer CSS에 order 재배치가 남아 있음');
  if (/footer-meta::before/i.test(footerCss)) fail(COMPACT, 'compact Footer가 상위 CSS 가상요소를 무효화하는 override 구조를 사용함');
}

const universityIndex = 'nexus/university/index.html';
if (fs.existsSync(universityIndex)) {
  const html = fs.readFileSync(universityIndex, 'utf8');
  if (/portal-v2\.css/i.test(html)) fail(universityIndex, 'NEXUS UNIVERSITY는 자체 university.css Footer를 사용하므로 portal-v2.css 중복 로드를 금지함');
}

for (const cssFile of walk(ROOT, f => f.endsWith('.css'))) {
  const base = path.basename(cssFile);
  if (/(?:footer[-_.]?(?:fix|override|patch|hotfix)|(?:fix|patch|hotfix)[-_.]?footer)/i.test(base)) {
    fail(cssFile, 'Footer 임시 fix/override/patch/hotfix 파일이 저장소에 남아 있음');
  }
}

for (const stale of [
  '.github/workflows/footer-audit-sync.yml',
  '.github/workflows/footer-audit-report.yml',
  '.github/workflows/footer-standard-migration.yml',
  'scripts/migrate-nexus-footer-v2.mjs',
  'scripts/fix-audit-findings.mjs',
  'scripts/sync-footer-audit.mjs',
  'scripts/footer-audit-trigger.txt',
  'nexus/footer-audit-report.txt',
  'nexus/footer-full-audit-report.txt'
]) {
  if (fs.existsSync(stale)) fail(stale, '일회성 Footer 마이그레이션/감사 산출물이 다시 존재함');
}

console.log(`Nexus footer source audit: ${errors} error(s); standardized footers checked=${checked}`);
if (errors) process.exit(1);
