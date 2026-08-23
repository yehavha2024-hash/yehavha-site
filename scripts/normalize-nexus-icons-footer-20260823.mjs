import fs from 'node:fs';
import path from 'node:path';

const BUSINESS = '스카이예슈아 · 사업자등록번호 536-38-01234 · 대표 이명훈';
const COPYRIGHT = 'Copyright © 이명훈 2026. All rights reserved.';
const ICON_START = '#326da8';
const ICON_END = '#55b9d8';
const ICON_BLUE = '#326da8';
const ICON_WHITE = '#ffffff';
const changed = new Set();

function walk(dir, predicate, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', '.wrangler'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, predicate, out);
    else if (predicate(full)) out.push(full);
  }
  return out;
}

function write(file, next) {
  const prev = fs.readFileSync(file, 'utf8');
  if (prev === next) return;
  fs.writeFileSync(file, next);
  changed.add(file.split(path.sep).join('/'));
}

function setDecl(body, prop, value) {
  const re = new RegExp(`(^|;)\\s*${prop.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*:\\s*([^;}]*)`, 'i');
  if (re.test(body)) return body.replace(re, (m, lead) => `${lead}${prop}:${value}`);
  return `${body.replace(/\s+$/,'')};${prop}:${value}`;
}

function normalizeIconCss(css) {
  return css.replace(/([^{}]+)\{([^{}]*)\}/g, (whole, rawSelector, rawBody) => {
    const selector = rawSelector.trim();
    if (!selector || selector.startsWith('@')) return whole;
    let body = rawBody;

    const categoryBox = /(?:^|[\s,>+~])(?:\.[\w-]+\s+)*\.category-icon(?:$|[\s,>+~:.#\[])/i.test(selector)
      && !/\.category-icon-glyph/i.test(selector)
      && !/\.category-icon::(?:before|after)/i.test(selector);
    const namedLarge = /\.(?:research|publishing|media|education|apps|university|publicsector|intelligence)-icon(?:$|[\s,>+~:.#\[])/i.test(selector);
    const quick = /\.quick-icon(?:$|[\s,>+~:.#\[])/i.test(selector) && !/::(?:before|after)/i.test(selector);
    const glyph = /\.category-icon-glyph(?:$|[\s,>+~:.#\[])/i.test(selector);
    const universityLargePseudo = /\.category-university\s+\.category-icon::before/i.test(selector);
    const universityQuickPseudo = /\.quick-link-university\s+\.quick-icon::before/i.test(selector);
    const itemTitlePseudo = /\.item-card\s+h3::before/i.test(selector);

    if (categoryBox || namedLarge) {
      body = setDecl(body, 'background', `linear-gradient(135deg,${ICON_START},${ICON_END})!important`);
      body = setDecl(body, 'color', `${ICON_WHITE}!important`);
      body = setDecl(body, 'border-color', 'rgba(50,109,168,.24)!important');
    }
    if (quick) {
      body = setDecl(body, 'color', `${ICON_BLUE}!important`);
    }
    if (glyph) {
      body = setDecl(body, 'width', '32px!important');
      body = setDecl(body, 'height', '32px!important');
    }
    if (universityLargePseudo) {
      body = setDecl(body, 'width', '36px!important');
      body = setDecl(body, 'height', '36px!important');
      body = setDecl(body, 'background', `${ICON_WHITE}!important`);
    }
    if (universityQuickPseudo) {
      body = setDecl(body, 'width', '20px!important');
      body = setDecl(body, 'height', '20px!important');
      body = setDecl(body, 'background', `${ICON_BLUE}!important`);
    }
    if (itemTitlePseudo) {
      body = setDecl(body, 'color', `${ICON_BLUE}!important`);
      body = setDecl(body, 'border-color', `${ICON_BLUE}!important`);
    }
    return `${rawSelector}{${body}}`;
  });
}

// 1) Canonical Nexus icon palette.
for (const file of [
  'nexus/portal-v2.css',
  'nexus/nexus-standard.css',
  'nexus/portal-enhancements.css',
  'nexus/status.css'
]) {
  if (!fs.existsSync(file)) continue;
  const prev = fs.readFileSync(file, 'utf8');
  let next = normalizeIconCss(prev);
  if (file === 'nexus/portal-v2.css' && !next.includes('--nxs-icon-start:')) {
    next = next.replace(':root {', `:root {--nxs-icon-start:${ICON_START};--nxs-icon-end:${ICON_END};--nxs-icon-blue:${ICON_BLUE};--nxs-icon-glyph:${ICON_WHITE};`);
  }
  if (file === 'nexus/portal-enhancements.css' && !next.includes('NEXUS ICON PALETTE 2026-08-23')) {
    next += `\n\n/* NEXUS ICON PALETTE 2026-08-23: one blue family for all portal icons. */\n.item-card h3::before{color:${ICON_BLUE}!important;border-color:${ICON_BLUE}!important}\n`;
  }
  write(file, next);
}

// Bump runtime versions so mobile browsers do not retain the old icon palette.
if (fs.existsSync('nexus/index.html')) {
  const prev = fs.readFileSync('nexus/index.html', 'utf8');
  const next = prev
    .replace(/portal-v2\.css\?v=[^"']+/g, 'portal-v2.css?v=20260823-icon-v1')
    .replace(/status\.css\?v=[^"']+/g, 'status.css?v=20260823-icon-v1')
    .replace(/nexus-standard\.css\?v=[^"']+/g, 'nexus-standard.css?v=20260823-icon-v1');
  write('nexus/index.html', next);
}
if (fs.existsSync('nexus/portal-v2.js')) {
  const prev = fs.readFileSync('nexus/portal-v2.js', 'utf8');
  const next = prev.replace(/\.\/portal-enhancements\.css\?v=[^'";]+/, './portal-enhancements.css?v=20260823-icon-v1');
  write('nexus/portal-v2.js', next);
}

// 2) Every HTML footer that carries copyright must carry business registration metadata directly in HTML.
for (const file of walk('.', f => f.endsWith('.html'))) {
  const prev = fs.readFileSync(file, 'utf8');
  let next = prev.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, footer => {
    if (!/(?:Copyright\s*©|All rights reserved\.)/i.test(footer)) return footer;
    let out = footer;
    // Normalize the copyright line when it is already in a paragraph.
    out = out.replace(/<p([^>]*)>\s*Copyright\s*©[\s\S]*?All rights reserved\.\s*<\/p>/i, `<p$1>${COPYRIGHT}</p>`);
    if (!out.includes(BUSINESS)) {
      const copyrightParagraph = /(<p\b[^>]*>\s*Copyright\s*©[\s\S]*?<\/p>)/i;
      if (copyrightParagraph.test(out)) {
        out = out.replace(copyrightParagraph, `<p class="business-meta">${BUSINESS}</p>$1`);
      }
    }
    return out;
  });
  write(file, next);
}

// 3) Remove obsolete CSS-generated business metadata to prevent duplicated footer lines.
for (const file of walk('.', f => f.endsWith('.css'))) {
  const prev = fs.readFileSync(file, 'utf8');
  const next = prev
    .replace(/[^{}]*(?:footer-meta|research-footer-meta)::before[^{}]*\{[^{}]*content\s*:\s*["']스카이예슈아[^{}]*\}/gi, '')
    .replace(/[^{}]*(?:footer-meta|research-footer-meta)::before[^{}]*\{[^{}]*content\s*:\s*["'][^"']*사업자등록번호[^{}]*\}/gi, '');
  write(file, next);
}

// 4) Nexus footer audit must require business metadata and its correct order.
{
  const file = 'scripts/audit-nexus-footer-standard.mjs';
  if (fs.existsSync(file)) {
    const prev = fs.readFileSync(file, 'utf8');
    let next = prev;
    if (!next.includes("const BUSINESS = '스카이예슈아 · 사업자등록번호 536-38-01234 · 대표 이명훈';")) {
      next = next.replace("const COPYRIGHT = 'Copyright © 이명훈 2026. All rights reserved.';", "const BUSINESS = '스카이예슈아 · 사업자등록번호 536-38-01234 · 대표 이명훈';\nconst COPYRIGHT = 'Copyright © 이명훈 2026. All rights reserved.';");
    }
    if (!next.includes("if (!footer.includes(BUSINESS)) fail(file, '사업자등록 정보 누락');")) {
      next = next.replace("if (!footer.includes(COPYRIGHT)) fail(file, '표준 Copyright 문구 불일치');", "if (!footer.includes(BUSINESS)) fail(file, '사업자등록 정보 누락');\n    if (!footer.includes(COPYRIGHT)) fail(file, '표준 Copyright 문구 불일치');");
    }
    if (!next.includes('const businessAt = footer.indexOf(BUSINESS);')) {
      next = next.replace('const copyrightAt = footer.indexOf(COPYRIGHT);', 'const businessAt = footer.indexOf(BUSINESS);\n    const copyrightAt = footer.indexOf(COPYRIGHT);');
      next = next.replace('if (!(copyrightAt >= 0 && copyrightAt < contactAt && contactAt < aiAt && aiAt < topAt)) {', 'if (!(businessAt >= 0 && businessAt < copyrightAt && copyrightAt < contactAt && contactAt < aiAt && aiAt < topAt)) {');
      next = next.replace("fail(file, 'HTML 원문 순서가 Copyright → 문의 → AI 활용 안내 → 맨 위로 이동 순서가 아님');", "fail(file, 'HTML 원문 순서가 사업자정보 → Copyright → 문의 → AI 활용 안내 → 맨 위로 이동 순서가 아님');");
    }
    write(file, next);
  }
}

// 5) Correct the permanent copyright standard: business metadata lives in HTML and follows the white Nexus shell.
{
  const file = 'COPYRIGHT_STANDARD.md';
  if (fs.existsSync(file)) {
    const prev = fs.readFileSync(file, 'utf8');
    let next = prev;
    next = next.replace(
      /사업자정보는 Nexus 전체에서 동일한 법적 메타데이터이므로[\s\S]*?사업자정보를 수정할 때는 이 단일 원본만 수정합니다\.\n\n독립 프로젝트와 독립 웹앱은 사업자정보를 해당 페이지의 실제 Footer HTML에 기록합니다\. 독립 프로젝트에서는 CSS 가상요소를 사업자정보의 데이터 원본으로 사용하지 않습니다\./,
      '사업자정보는 Nexus와 독립 프로젝트를 포함한 모든 공개 Footer의 실제 HTML에 직접 기록합니다. CSS `::before`, `::after`, `content` 또는 JavaScript를 사업자정보의 데이터 원본으로 사용하지 않습니다. 표준 문자열은 `스카이예슈아 · 사업자등록번호 536-38-01234 · 대표 이명훈`으로 고정하며, Copyright 바로 앞에 표시합니다.'
    );
    next = next.replace('- 배경: `#050b19` 또는 동일 계열 Nexus 하단 배경', '- 배경: `#FFFFFF`');
    next = next.replace('- 상단 경계선: `rgba(255,255,255,.09)`', '- 상단 경계선: `#CFD4DC`');
    next = next.replace('- 프로젝트명: `#d7e1ea`', '- 프로젝트명: `#111111`');
    next = next.replace('- 기본 텍스트: `#8fa1b3`', '- 기본 텍스트: `#111111`');
    next = next.replace('- 링크: `#a9bfd2`', '- 링크: `#111111`');
    next = next.replace('Nexus 내부 페이지는 전역 Footer 컴포넌트 구조를 사용할 수 있으며, 사업자정보만 `nexus/portal-v2.css`의 승인된 단일 원본을 공유합니다.', 'Nexus 내부 페이지도 사업자정보를 실제 Footer HTML에 직접 기록합니다. CSS나 JavaScript가 사업자등록 정보를 생성하거나 보충하지 않습니다.');
    write(file, next);
  }
}

console.log(`Normalized Nexus icons/footer: ${changed.size} file(s)`);
for (const file of [...changed].sort()) console.log(`- ${file}`);
