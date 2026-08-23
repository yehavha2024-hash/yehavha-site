import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TARGET_ROOTS = [
  'nexus',
  'legal-knowledge',
  'legal-philosophy',
  'ai-law-tech-foresight',
  'living-law-100',
  'toeic-human',
  'toeic-human-v2'
];

const BLACK = '#111111';
const ICON_A = '#225f96';
const ICON_B = '#43a6cf';
const ICON_BORDER = '#1d5a8c';
const CELL_BG = '#eef4f8';
const CELL_BORDER = '#b8c6d3';
const PALE_TEXT = new Set([
  '#4b5563','#667085','#6b7280','#64748b','#737373','#7b8490','#94a3b8','#9ca3af','#a0aec0','#cbd5e1','#d1d5db','#d6d9de','#e2e8f0'
]);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'build') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function normalizeVars(css) {
  return css
    .replace(/(--[\w-]*(?:muted|subtle|paperMuted|text-muted|text-secondary|secondary-text)[\w-]*\s*:)\s*(?:#[0-9a-fA-F]{3,8}|rgba?\([^;]+\)|var\([^;]+\))/g, `$1${BLACK}`)
    .replace(/color\s*:\s*var\(--[\w-]*(?:muted|subtle|paperMuted|text-muted|text-secondary|secondary-text)[\w-]*\)(\s*!important)?/gi, `color:${BLACK}$1`)
    .replace(/color\s*:\s*(#[0-9a-fA-F]{6})(\s*!important)?/gi, (m, hex, imp = '') => PALE_TEXT.has(hex.toLowerCase()) ? `color:${BLACK}${imp}` : m);
}

function setDecl(body, prop, value) {
  const re = new RegExp(`(^|;)\\s*${prop.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\s*:[^;}]*(?=;|$)`, 'i');
  if (re.test(body)) return body.replace(re, (m, prefix) => `${prefix}${prop}:${value}`);
  return `${body.trim().replace(/;?$/, ';')}${prop}:${value};`;
}

function selectorHasClass(selector, terms) {
  return terms.some(term => new RegExp(`\\.${term}(?:$|[\\s:>.#,+~\\[])`, 'i').test(selector));
}

const iconClasses = [
  'quick-icon','category-icon','section-icon','feature-icon','project-icon','hero-icon','profile-icon','result-icon','public-icon','course-icon','icon-box','card-icon','item-icon','nav-icon','tool-icon','badge-icon','footer-icon'
];
const tagClasses = [
  'tag','chip','badge','pill','meta-chip','status-chip','maturity-chip','item-type','brief-label','priority','type-label','hero-meta','case-meta','detail-meta','filter-label'
];

function isReadingSelector(selector) {
  if (/(?:button|\.active|:hover|:focus|::before|::after|icon|svg)/i.test(selector)) return false;
  return /(^|[\s,>+~])(p|li|dd|dt|blockquote|figcaption)(?=$|[\s,>+~.:#\[])/i.test(selector)
    || /(?:description|summary|lead|copy|bibliography|translated-title|card-use|research-content|research-body|article-body|detail-section|step-body|thinking-note|argument-box|source-card|brief-section|notice|question|explanation|content-text|body-copy)/i.test(selector);
}

function transformBlocks(css) {
  const blockRe = /([^{}]+)\{([^{}]*)\}/g;
  const run = input => input.replace(blockRe, (full, selectorRaw, bodyRaw) => {
    const selector = selectorRaw.trim();
    let body = bodyRaw;

    if (isReadingSelector(selector)) {
      body = body.replace(/color\s*:\s*(?:#[0-9a-fA-F]{3,8}|rgba?\([^;]+\)|var\([^;]+\))(\s*!important)?/gi, `color:${BLACK}$1`);
    }

    const isTag = selectorHasClass(selector, tagClasses) || /(?:hero-meta\s+span|case-meta\s+span|detail-meta\s+span)/i.test(selector);
    if (isTag && !/(?:\.active|:hover|:focus)/i.test(selector)) {
      body = setDecl(body, 'color', BLACK);
      body = setDecl(body, 'background', CELL_BG);
      if (/border(?:-color)?\s*:/i.test(body)) body = body.replace(/border-color\s*:[^;}]*/gi, `border-color:${CELL_BORDER}`);
    }

    const isIcon = selectorHasClass(selector, iconClasses);
    if (isIcon && !/\bsvg\b/i.test(selector)) {
      body = setDecl(body, 'background', `linear-gradient(145deg,${ICON_A},${ICON_B})`);
      body = setDecl(body, 'color', '#ffffff');
      if (/border\s*:/i.test(body)) body = body.replace(/border\s*:[^;}]*/i, `border:1px solid ${ICON_BORDER}`);
      body = setDecl(body, 'box-shadow', '0 7px 18px rgba(34,95,150,.18)');
    }
    if (isIcon && /\bsvg\b/i.test(selector)) {
      body = setDecl(body, 'fill', 'none');
      body = setDecl(body, 'stroke', '#ffffff');
      body = setDecl(body, 'stroke-width', '1.95');
      body = setDecl(body, 'stroke-linecap', 'round');
      body = setDecl(body, 'stroke-linejoin', 'round');
    }

    return `${selectorRaw}{${body}}`;
  });
  return run(run(css));
}

function normalizeCss(css) {
  let out = normalizeVars(css);
  out = transformBlocks(out);
  return out;
}

const iconMap = `const categoryIcons = {
    intelligence: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5 19 6.2v5.1c0 4.4-2.9 7.4-7 9.2-4.1-1.8-7-4.8-7-9.2V6.2L12 3.5Z"/><path d="M8.2 12h2.1l1.2-2.5 1.8 5 1.1-2.5h1.7"/></svg>',
    university: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3.2 8.5 8.8-4.2 8.8 4.2-8.8 4.2-8.8-4.2Z"/><path d="M6.2 11.2v5.3c3.7 2.2 7.9 2.2 11.6 0v-5.3M20.8 8.5v5.3"/></svg>',
    apps: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4" width="17" height="16" rx="3"/><path d="M3.5 8.2h17M7.2 12h3.8v3.8H7.2zM14.2 12h2.8M14.2 15.8h2.8"/></svg>',
    research: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5h9.2a2.8 2.8 0 0 1 2.8 2.8v10.2H7.8A2.8 2.8 0 0 0 5 20.3V4.5Z"/><path d="M7.8 20.3H19V7.8M8.5 9h5M8.5 12h4"/></svg>',
    publicsector: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 9 9-5 9 5H3Z"/><path d="M5 10.5v7M9.5 10.5v7M14.5 10.5v7M19 10.5v7M3 19.5h18"/></svg>',
    publishing: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5c3.3-.6 5.9.1 8 2.1v11c-2.1-2-4.7-2.7-8-2.1v-11Z"/><path d="M20 5.5c-3.3-.6-5.9.1-8 2.1v11c2.1-2 4.7-2.7 8-2.1v-11Z"/></svg>',
    media: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="3"/><path d="m10 9 5 3-5 3V9Z"/></svg>',
    education: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 8.7 9-4.2 9 4.2-9 4.2-9-4.2Z"/><path d="M6 11.1v5c3.8 2.4 8.2 2.4 12 0v-5"/><path d="M21 8.7v5.1"/></svg>',
    initiatives: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4"/><path d="M8 14.7A6 6 0 1 1 16 14.7c-.9.7-1.4 1.5-1.6 2.4H9.6c-.2-.9-.7-1.7-1.6-2.4Z"/><path d="M12 5.7v2.2M7.9 7.4l1.5 1.5M16.1 7.4l-1.5 1.5"/></svg>'
  };`;

function normalizePortalJs(text) {
  return text.replace(/const categoryIcons = \{[\s\S]*?\n  \};/, iconMap);
}

function bumpHtml(text) {
  return text
    .replace(/(href=["'][^"']+\.css)(?:\?v=[^"']*)?(["'])/g, '$1?v=20260824-contrast-icons-1$2')
    .replace(/(src=["'][^"']+portal-v2\.js)(?:\?v=[^"']*)?(["'])/g, '$1?v=20260824-contrast-icons-1$2');
}

const files = TARGET_ROOTS.flatMap(root => walk(path.join(ROOT, root)));
let changed = [];
for (const file of files) {
  const rel = path.relative(ROOT, file).replaceAll('\\', '/');
  if (file.endsWith('.css')) {
    const before = fs.readFileSync(file, 'utf8');
    const after = normalizeCss(before);
    if (after !== before) {
      fs.writeFileSync(file, after);
      changed.push(rel);
    }
  } else if (file.endsWith('.html')) {
    const before = fs.readFileSync(file, 'utf8');
    const after = bumpHtml(before);
    if (after !== before) {
      fs.writeFileSync(file, after);
      changed.push(rel);
    }
  }
}

const portalJs = path.join(ROOT, 'nexus/portal-v2.js');
if (fs.existsSync(portalJs)) {
  const before = fs.readFileSync(portalJs, 'utf8');
  const after = normalizePortalJs(before);
  if (after !== before) {
    fs.writeFileSync(portalJs, after);
    changed.push('nexus/portal-v2.js');
  }
}

const standard = path.join(ROOT, 'NEXUS_UI_STANDARD.md');
if (fs.existsSync(standard)) {
  let text = fs.readFileSync(standard, 'utf8');
  const marker = '\n## 4.1 시각 대비·아이콘 표준 (2026-08-24)\n';
  if (!text.includes(marker.trim())) {
    text += `${marker}- 읽기 본문·설명·연구내용·상세보기의 기본 글자색은 #111111로 고정합니다.\n- muted/subtle은 레이아웃 의미를 위해 남기더라도 읽기 텍스트의 색상으로 사용하지 않습니다.\n- 태그·배지·상태 셀은 밝은 청회색 배경과 검정 글자를 사용합니다.\n- 큰·작은 기능 아이콘은 동일한 청색 계열 컨테이너와 흰색 1.95px 선형 SVG를 기본으로 합니다.\n- 상세보기 셀은 흰색 또는 밝은 청회색을 사용하고 본문 대비를 낮추지 않습니다.\n`;
    fs.writeFileSync(standard, text);
    changed.push('NEXUS_UI_STANDARD.md');
  }
}

console.log(`Normalized ${changed.length} files.`);
for (const file of changed) console.log(file);
