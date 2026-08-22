import fs from 'node:fs';
import path from 'node:path';

const roots = [
  'ai-law-tech-foresight',
  'legal-philosophy',
  'legal-knowledge',
  'three-minute-break',
  'toeic-human-100',
  'nexus'
];

const forbiddenLegacy = [
  'ai-law-tech-foresight/card-density-20260817.css',
  'ai-law-tech-foresight/mobile-flow.css',
  'ai-law-tech-foresight/contrast-fix-20260809.css',
  'ai-law-tech-foresight/card-title-compact-20260817.js',
  'legal-philosophy/contrast-fix-20260809.css',
  'three-minute-break/nexus-shell.css',
  'toeic-human-100/nexus-shell.css',
  'toeic-human-100/v2-ui-theme.css',
  'nexus/research-groups.css',
  'nexus/articles/public-layout-20260820.css',
  'nexus/intelligence-briefing/compact-top.css'
];

const coreStyles = new Set([
  'ai-law-tech-foresight/styles.css',
  'ai-law-tech-foresight/project-standard.css',
  'legal-philosophy/styles.css',
  'legal-philosophy/project-standard.css',
  'legal-knowledge/styles.css',
  'legal-knowledge/project-standard.css',
  'legal-knowledge/ai-literature/styles.css',
  'three-minute-break/style.css',
  'toeic-human-100/style.css',
  'toeic-human-100/project-standard.css',
  'nexus/portal-v2.css',
  'nexus/nexus-standard.css',
  'nexus/articles/articles.css'
]);

const returnClasses = ['back-link', 'nexus-link', 'back'];
const requiredReturnPages = new Set([
  'ai-law-tech-foresight/index.html',
  'legal-philosophy/index.html',
  'legal-knowledge/index.html',
  'three-minute-break/index.html',
  'toeic-human-100/index.html',
  'nexus/ai-legal-glossary/index.html',
  'nexus/ai-music-archive/index.html',
  'nexus/ai-trends/index.html',
  'nexus/articles/index.html',
  'nexus/education-hub/index.html',
  'nexus/government-ax/index.html',
  'nexus/initiatives/index.html',
  'nexus/intelligence-briefing/index.html',
  'nexus/living-law/index.html',
  'nexus/publishing/index.html',
  'nexus/research-track/index.html',
  'nexus/toeic-human-v2/index.html',
  'nexus/university/index.html'
]);
const canonicalReturnTokens = [
  'min-height:36px',
  'padding:0 12px',
  'border-radius:10px',
  'background:#081a30',
  'font-size:11.5px'
];

let errors = 0;
let warnings = 0;
const referencedCss = new Set();

const normalize = p => p.split(path.sep).join('/');
const fail = (file, message) => {
  errors += 1;
  console.error(`ERROR ${file}: ${message}`);
  console.log(`::error file=${file}::${message}`);
};
const warn = (file, message) => {
  warnings += 1;
  console.warn(`WARNING ${file}: ${message}`);
  console.log(`::warning file=${file}::${message}`);
};
const read = file => fs.readFileSync(file, 'utf8');

function walk(dir, predicate) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, predicate));
    else if (predicate(full)) out.push(full);
  }
  return out;
}

function cssRefs(html) {
  return [...html.matchAll(/<link\s+[^>]*href=["']([^"']+\.css(?:\?[^"']*)?)["'][^>]*>/gi)].map(match => match[1]);
}

function cssImports(css) {
  return [...css.matchAll(/@import\s+(?:url\()?['"]?([^'"\)\s]+\.css(?:\?[^'"\)\s]*)?)/gi)].map(match => match[1]);
}

function resolveCssRef(fromFile, ref) {
  const clean = ref.split('?')[0].split('#')[0];
  return normalize(path.relative(process.cwd(), path.resolve(path.dirname(fromFile), clean)));
}

function collectCssClosure(indexFile, refs) {
  const out = [];
  const seen = new Set();
  const visit = (fromFile, ref) => {
    if (/^(?:https?:|data:)/i.test(ref)) return;
    const resolved = resolveCssRef(fromFile, ref);
    if (seen.has(resolved)) return;
    seen.add(resolved);
    if (!fs.existsSync(resolved)) return;
    out.push(resolved);
    const css = read(resolved);
    for (const imported of cssImports(css)) visit(resolved, imported);
  };
  for (const ref of refs) visit(indexFile, ref);
  return out;
}

function isPageLocalCore(resolved, indexFile) {
  if (coreStyles.has(resolved)) return true;
  const base = path.basename(resolved).toLowerCase();
  if (!['style.css', 'styles.css'].includes(base)) return false;
  return normalize(path.dirname(resolved)) === normalize(path.dirname(indexFile));
}

function selectorOwnsClass(selector, className) {
  return selector.split(',').some(part => {
    const trimmed = part.trim();
    return new RegExp(`^\\.${className}(?:$|[\\s:.#\\[])`).test(trimmed);
  });
}

function ownerBlocks(css, className) {
  const blocks = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  for (const match of css.matchAll(re)) {
    if (selectorOwnsClass(match[1], className)) blocks.push(`${match[1]}{${match[2]}}`);
  }
  return blocks;
}

function activeReturnClass(html) {
  for (const match of html.matchAll(/<a\b[^>]*class=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    if (!/YEHAVHA\s+NEXUS/i.test(match[2])) continue;
    const classes = match[1].split(/\s+/);
    const found = returnClasses.find(name => classes.includes(name));
    if (found) return found;
  }
  return null;
}

function normalizedCss(value) {
  return value.replace(/\/\*[\s\S]*?\*\//g, '').replace(/!important/g, '').replace(/\s+/g, '');
}

function hasCanonicalReturnShape(blocks) {
  const compact = normalizedCss(blocks.join('\n'));
  return canonicalReturnTokens.every(token => compact.includes(normalizedCss(token)));
}

for (const relative of forbiddenLegacy) {
  if (fs.existsSync(relative)) fail(relative, '핵심 파일로 통합 완료된 구형 보조 레이어가 다시 존재함');
}

const indexFiles = roots.flatMap(root => walk(root, file => path.basename(file) === 'index.html'));
for (const indexFile of indexFiles) {
  const html = read(indexFile);
  const refs = cssRefs(html);
  const seen = new Set();

  for (const ref of refs) {
    if (/^(?:https?:|data:)/i.test(ref)) continue;
    const resolved = resolveCssRef(indexFile, ref);
    if (seen.has(resolved)) fail(indexFile, `동일 CSS 중복 로드: ${ref.split('?')[0]}`);
    seen.add(resolved);
    referencedCss.add(resolved);
    if (!fs.existsSync(resolved)) {
      fail(indexFile, `CSS 참조 대상 없음: ${ref.split('?')[0]}`);
      continue;
    }

    const css = read(resolved);
    if (isPageLocalCore(resolved, indexFile)) continue;

    const declaresNexusTheme = /YEHAVHA NEXUS[^\n]*(?:Visual Standard|Owned App Shell|UI Theme)/i.test(css)
      || /:root\s*\{[^}]{0,1600}--nxs-bg\s*:/is.test(css);
    const broadSelectors = [
      /(^|\n)\s*body(?:\s|,|\{|::)/m,
      /(^|\n)\s*html(?:\s|,|\{|:)/m,
      /(^|\n)\s*h1(?:\s|,|\{)/m,
      /(^|\n)\s*\.app-shell(?:\s|,|\{)/m,
      /(^|\n)\s*\.wrap(?:\s|,|\{)/m,
      /(^|\n)\s*\.container(?:\s|,|\{|:)/m,
      /(^|\n)\s*\.site-footer(?:\s|,|\{)/m
    ].filter(pattern => pattern.test(css)).length;

    if (declaresNexusTheme) fail(resolved, '기능 CSS가 전역 Nexus 테마를 다시 선언함. canonical style로 통합 필요');
    else if (broadSelectors >= 4) fail(resolved, `기능 CSS가 전역 레이아웃 선택자 ${broadSelectors}종을 동시에 소유함`);
  }

  const normalizedIndex = normalize(indexFile);
  const returnClass = activeReturnClass(html);
  if (requiredReturnPages.has(normalizedIndex) && !returnClass) {
    fail(indexFile, 'YEHAVHA NEXUS 복귀 셀 누락');
  }
  if (returnClass) {
    const closure = collectCssClosure(indexFile, refs);
    const owners = [];
    for (const cssFile of closure) {
      const blocks = ownerBlocks(read(cssFile), returnClass);
      if (blocks.length) owners.push({ source: cssFile, blocks });
    }
    const inlineStyles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(match => match[1]);
    inlineStyles.forEach((css, i) => {
      const blocks = ownerBlocks(css, returnClass);
      if (blocks.length) owners.push({ source: `${indexFile}#inline-style-${i + 1}`, blocks });
    });

    if (!owners.length) fail(indexFile, `YEHAVHA NEXUS 복귀 셀 .${returnClass}의 스타일 소유자가 없음`);
    if (owners.length > 1) fail(indexFile, `YEHAVHA NEXUS 복귀 셀 .${returnClass} 중복 소유: ${owners.map(x => x.source).join(', ')}`);
    if (owners.length === 1 && !hasCanonicalReturnShape(owners[0].blocks)) {
      fail(owners[0].source, `.${returnClass}이 표준 복귀 셀 규격(36px · 12px · radius 10 · #081a30 · 11.5px)과 불일치`);
    }
  }
}

/* Article archive has a stricter two-layer contract: shared shell + article content. */
const articlePages = [
  'nexus/articles/index.html',
  'nexus/articles/article.html',
  'nexus/articles/judicial-ai-prompt-injection.html'
];
for (const page of articlePages) {
  if (!fs.existsSync(page)) continue;
  const html = read(page);
  const refs = cssRefs(html).map(ref => ref.split('?')[0]);
  if (refs.length !== 2) fail(page, `글 아카이브 CSS는 공통 shell + articles.css 2개만 허용: 현재 ${refs.length}개`);
  if (!refs.some(ref => ref.endsWith('portal-v2.css'))) fail(page, '공통 shell portal-v2.css 누락');
  if (!refs.some(ref => ref.endsWith('articles.css'))) fail(page, '콘텐츠 canonical articles.css 누락');
  if (/public-layout-\d{8}\.css/i.test(html)) fail(page, '삭제된 날짜형 레이아웃 패치 참조');
  if (/<style[\s>]/i.test(html)) fail(page, '페이지별 <style> 금지: articles.css에 통합해야 함');
}

const portal = 'nexus/portal-v2.css';
if (fs.existsSync(portal)) {
  const css = read(portal);
  for (const token of [
    '--nxs-body-size:15px',
    '--nxs-footer-project:13px',
    '--nxs-footer-text:12px',
    '스카이예슈아 · 사업자등록번호 536-38-01234 · 대표 이명훈'
  ]) if (!css.includes(token)) fail(portal, `중앙 UI 토큰/법적 메타데이터 누락: ${token}`);
  if (!/\.back-link\s*,\s*\.nexus-link\s*,\s*\.back/.test(css)) fail(portal, 'Nexus 복귀 링크 중앙 소유권 누락');
  const returnBlocks = ownerBlocks(css, 'back-link');
  if (!hasCanonicalReturnShape(returnBlocks)) fail(portal, 'Nexus 복귀 링크가 표준 셀 규격과 불일치');
  if (/@import[^;]*(?:fix|patch|hotfix|override|compact-top)/i.test(css)) fail(portal, '공통 shell이 patch/override CSS를 import함');
  if (!/\.footer-card[^\{]*\{[^}]*text-align:center/is.test(css)) fail(portal, 'Footer 중앙정렬 canonical 규칙 누락');
}

const articleCss = 'nexus/articles/articles.css';
if (fs.existsSync(articleCss)) {
  const css = read(articleCss);
  const forbiddenSharedOwners = [
    ['footer', /(^|\n)\s*\.(?:footer|footer-card|footer-meta|reader-site-footer|research-footer)(?:\s|,|\{|:)/m],
    ['Nexus 복귀 링크', /(^|\n)\s*\.(?:back-link|nexus-link|back)(?:\s|,|\{|:)/m],
    ['공통 container', /(^|\n)\s*\.container(?:\s|,|\{|:)/m]
  ];
  for (const [name, pattern] of forbiddenSharedOwners) if (pattern.test(css)) fail(articleCss, `${name}를 로컬 CSS가 재소유함`);
  if (!/\.archive-summary\s*\{[^}]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/s.test(css)) fail(articleCss, '아카이브 현황 3열 canonical 규칙 누락');
  if (/\.archive-summary\s*\{[^}]*grid-template-columns:\s*1fr/s.test(css)) fail(articleCss, '아카이브 현황을 1열로 되돌리는 규칙 금지');
  if (!/\.article-body\s*\{[^}]*font-size:15px/s.test(css)) fail(articleCss, '상세글 본문 15px canonical 규칙 누락');
}

/* Dated/fix/patch layers are technical debt. Existing ones are reported; new article patches are errors. */
const patchName = /(?:\d{8}|(?:^|[-_.])(fix|patch|hotfix|override)(?:[-_.]|$))/i;
for (const root of roots) {
  for (const cssFile of walk(root, file => file.endsWith('.css'))) {
    const relative = normalize(cssFile);
    if (relative.startsWith('nexus/articles/') && patchName.test(path.basename(relative))) fail(relative, '글 아카이브에 날짜/patch형 CSS를 새 canonical 레이어로 유지할 수 없음');
    if (referencedCss.has(relative)) continue;
    const css = read(cssFile);
    if (/contrast[-_]?fix|mobile[-_]?flow|card[-_]?density|hotfix|patch/i.test(path.basename(cssFile))) fail(relative, '참조되지 않는 패치형 CSS 잔존');
    if (/YEHAVHA NEXUS[^\n]*(?:Visual Standard|Owned App Shell|UI Theme)/i.test(css)) warn(relative, '참조되지 않는 전역 스타일 후보');
    if (!relative.startsWith('nexus/articles/') && patchName.test(path.basename(relative))) warn(relative, '날짜/patch형 CSS 기술부채: 기능 확인 후 canonical owner로 단계 통합 권장');
  }
}

console.log(`Style ownership audit: ${errors} error(s), ${warnings} warning(s), ${indexFiles.length} page(s)`);
if (errors) process.exit(1);