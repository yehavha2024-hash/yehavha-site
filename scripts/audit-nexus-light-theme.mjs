import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
let errors = 0;
let checked = 0;

const exists = relative => fs.existsSync(path.join(ROOT, relative));
const read = relative => fs.readFileSync(path.join(ROOT, relative), 'utf8');
const fail = (file, message) => {
  errors += 1;
  console.error(`ERROR ${file}: ${message}`);
  console.log(`::error file=${file}::${message}`);
};

function walk(dir, predicate, out = []) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return out;
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    const relative = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['assets', '.git'].includes(entry.name)) walk(relative, predicate, out);
    } else if (predicate(relative)) out.push(relative);
  }
  return out;
}

for (const file of walk('nexus', file => file.endsWith('.html'))) {
  const html = read(file);
  const theme = html.match(/<meta\b[^>]*name=["']theme-color["'][^>]*content=["']([^"']+)["'][^>]*>/i)
    || html.match(/<meta\b[^>]*content=["']([^"']+)["'][^>]*name=["']theme-color["'][^>]*>/i);
  if (theme) {
    checked += 1;
    const value = theme[1].toLowerCase();
    if (value !== '#fff' && value !== '#ffffff') fail(file, `theme-color가 라이트 기준이 아님: ${theme[1]}`);
  }
}

const portalFile = 'nexus/portal-v2.css';
if (!exists(portalFile)) {
  fail(portalFile, '공통 shell 없음');
} else {
  const css = read(portalFile).replace(/\s+/g, '');
  const required = [
    '--bg:#ffffff',
    '--text:#111111',
    '--line:#cfd4dc',
    '--nxs-body-size:15px',
    '--nxs-body-line:1.75',
    '--nxs-footer-text:12px',
    '--nxs-footer-link:11px',
    'body{',
    'background:var(--bg)',
    'color:var(--text)'
  ];
  for (const token of required) if (!css.includes(token.replace(/\s+/g, ''))) fail(portalFile, `라이트 shell 핵심 토큰 누락: ${token}`);
  if (/content:["']스카이예슈아/i.test(css)) fail(portalFile, '법적 메타데이터를 CSS content로 생성함');
  checked += required.length;
}

const mainFile = 'nexus/nexus-standard.css';
if (!exists(mainFile)) {
  fail(mainFile, '메인 포털 canonical CSS 없음');
} else {
  const css = read(mainFile).replace(/\s+/g, '');
  const required = [
    '--portal-text:#111111',
    '--portal-muted:#4b5563',
    '--portal-line:#cfd4dc',
    'body{',
    'background:#fff',
    '.hero-card{',
    '.category-card{',
    '.item-card{'
  ];
  for (const token of required) if (!css.includes(token.replace(/\s+/g, ''))) fail(mainFile, `메인 라이트 구조 토큰 누락: ${token}`);
  if (/\.category-card\{[^}]*background:(?:#071225|#081a30)/i.test(css)) fail(mainFile, '카테고리 카드에 구형 다크 배경이 남아 있음');
  if (/\.item-card\{[^}]*background:(?:#071225|#081a30)/i.test(css)) fail(mainFile, '프로젝트 카드에 구형 다크 배경이 남아 있음');
  checked += required.length;
}

for (const file of walk('nexus', file => file.endsWith('.css'))) {
  const css = read(file);
  if (/::(?:before|after)[^{]*\{[^}]*content\s*:\s*["'][^"']*(?:스카이예슈아|Copyright © 이명훈|kimbrighth@gmail\.com)/is.test(css)) {
    fail(file, 'Footer 법적 메타데이터를 CSS 가상요소가 생성함');
  }
  checked += 1;
}

const standardFile = 'NEXUS_UI_STANDARD.md';
if (!exists(standardFile)) {
  fail(standardFile, 'UI 표준 문서 없음');
} else {
  const standard = read(standardFile);
  for (const token of ['기본 배경: `#FFFFFF`', '기본 글자: `#111111`', '구분선·테두리: `#CFD4DC`']) {
    if (!standard.includes(token)) fail(standardFile, `라이트 UI 표준 누락: ${token}`);
  }
  if (/기본 배경:\s*`#071225`|Panel:\s*`rgba\(8,18,38/i.test(standard)) fail(standardFile, '구형 다크 테마 표준이 남아 있음');
  checked += 3;
}

console.log(`Nexus light theme audit: ${errors} error(s), ${checked} checks`);
if (errors) process.exit(1);
