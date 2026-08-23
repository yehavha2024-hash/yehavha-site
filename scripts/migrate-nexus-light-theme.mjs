import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'nexus';
const BG = '#ffffff';
const TEXT = '#111111';
const LINE = '#cfd4dc';
const SOFT_LINE = '#e5e7eb';
const SHADOW = '0 4px 16px rgba(0,0,0,.06)';
const BUSINESS = '스카이예슈아 · 사업자등록번호 536-38-01234 · 대표 이명훈';
const visualSelector = /(?:icon|glyph|svg|logo|mark|dot|photo|image|img|cover|thumb|artwork|avatar|illustration|pictogram|emoji|progress|meter|chart|spark|swatch)/i;
const changed = [];
let declarationChanges = 0;

function walk(dir, predicate, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'assets' || entry.name === '.git') continue;
      walk(full, predicate, out);
    } else if (predicate(full)) out.push(full);
  }
  return out;
}

function writeIfChanged(file, before, after) {
  if (before === after) return;
  fs.writeFileSync(file, after);
  changed.push(file);
}

function keepImportant(raw, value) {
  return /!important\s*$/i.test(raw) ? `${value}!important` : value;
}

function replaceBorderColor(value) {
  let out = value;
  out = out.replace(/rgba?\([^)]*\)/gi, LINE);
  out = out.replace(/#[0-9a-f]{3,8}\b/gi, LINE);
  out = out.replace(/\b(?:white|black)\b/gi, LINE);
  return out;
}

function transformVariable(name, raw) {
  const lower = name.toLowerCase();
  const important = /!important\s*$/i.test(raw) ? '!important' : '';
  if (/(?:accent|blue|critical|high|watch|good|warn|danger|success|error)/.test(lower)) return raw;
  if (/(?:line|border|divider|rule)/.test(lower)) return `${LINE}${important}`;
  if (/(?:text|muted|dim|foreground|footer-text|footer-link|link-color)/.test(lower)) return `${TEXT}${important}`;
  if (/(?:shadow)/.test(lower)) return `${SHADOW}${important}`;
  if (/(?:bg|background|panel|surface|card|deep|navy|footer-bg|shell)/.test(lower)) return `${BG}${important}`;
  return raw;
}

function transformDeclaration(prop, raw, selector) {
  const lower = prop.toLowerCase();
  const isVisual = visualSelector.test(selector);
  const isPseudo = /::(?:before|after)/i.test(selector);
  if (lower.startsWith('--')) return transformVariable(lower, raw);
  if (isVisual) return raw;

  if (lower === 'color' || lower === 'caret-color') return keepImportant(raw, TEXT);

  if (lower === 'background' || lower === 'background-color') {
    if (/url\(/i.test(raw) && !/(?:^|,)\s*(?:html|body)(?:\b|[.:#\[])/i.test(selector)) return raw;
    if (isPseudo) return keepImportant(raw, 'none');
    return keepImportant(raw, BG);
  }

  if (lower === 'background-image') {
    if (/url\(/i.test(raw) && !/(?:^|,)\s*(?:html|body)(?:\b|[.:#\[])/i.test(selector)) return raw;
    return keepImportant(raw, 'none');
  }

  if (/^border(?:-(?:top|right|bottom|left))?$/.test(lower)) {
    return replaceBorderColor(raw);
  }
  if (/^border(?:-(?:top|right|bottom|left))?-color$/.test(lower) || lower === 'outline-color') {
    return keepImportant(raw, LINE);
  }
  if (lower === 'box-shadow') return keepImportant(raw, SHADOW);
  if (lower === 'text-shadow') return keepImportant(raw, 'none');
  return raw;
}

function transformRule(selector, body) {
  const transformed = body.replace(/(^|;)\s*([\w-]+)\s*:\s*([^;}]*)/g, (whole, lead, prop, raw) => {
    const next = transformDeclaration(prop, raw.trim(), selector);
    if (next !== raw.trim()) declarationChanges += 1;
    return `${lead}${prop}:${next}`;
  });
  return transformed;
}

function transformCss(css) {
  let out = css.replace(/([^{}]+)\{([^{}]*)\}/g, (whole, selector, body) => {
    const trimmed = selector.trim();
    if (!trimmed || trimmed.startsWith('@')) return whole;
    return `${selector}{${transformRule(trimmed, body)}}`;
  });

  // Legal/business text must live in HTML, never in CSS generated content.
  out = out.replace(/[^{}]*footer-meta::before[^{}]*\{[^{}]*content\s*:\s*["']스카이예슈아[^{}]*\}/gi, '');
  out = out.replace(/[^{}]*research-footer-meta::before[^{}]*\{[^{}]*content\s*:\s*["']스카이예슈아[^{}]*\}/gi, '');
  return out;
}

function transformThemeMeta(html) {
  return html.replace(/<meta\b[^>]*>/gi, tag => {
    if (!/name=["']theme-color["']/i.test(tag)) return tag;
    if (/content=["'][^"']*["']/i.test(tag)) return tag.replace(/content=["'][^"']*["']/i, 'content="#ffffff"');
    return tag.replace(/\s*\/>$|>$/, m => ` content="#ffffff"${m}`);
  });
}

function transformHtml(html) {
  let out = transformThemeMeta(html);
  out = out.replace(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi, (whole, attrs, css) => `<style${attrs}>${transformCss(css)}</style>`);
  return out;
}

for (const file of walk(ROOT, file => file.endsWith('.css'))) {
  const before = fs.readFileSync(file, 'utf8');
  const after = transformCss(before);
  writeIfChanged(file, before, after);
}

for (const file of walk(ROOT, file => file.endsWith('.html'))) {
  const before = fs.readFileSync(file, 'utf8');
  const after = transformHtml(before);
  writeIfChanged(file, before, after);
}

// Update the permanent interface standard so later UI changes inherit the white theme instead of reviving dark files.
{
  const file = 'NEXUS_UI_STANDARD.md';
  const before = fs.readFileSync(file, 'utf8');
  let after = before
    .replace(/Version:\s*[^\n]+/, 'Version: 3.0  ')
    .replace(/Updated:\s*[^\n]+/, 'Updated: 2026-08-23')
    .replace('- 사업자정보 고정 문자열', '- Footer의 배경·정렬·간격·타이포그래피')
    .replace(/- 공통 Footer의 배경·정렬·간격·타이포그래피\n- Footer의 배경·정렬·간격·타이포그래피/, '- 공통 Footer의 배경·정렬·간격·타이포그래피');

  const section5 = `## 5. 공통 시각 규격\n\n- 기본 배경: \`#FFFFFF\`\n- 카드·Panel·셀 배경: \`#FFFFFF\`\n- 입력창·검색창·버튼 기본 배경: \`#FFFFFF\`\n- Footer 배경: \`#FFFFFF\`\n- 기본 글자: \`#111111\`\n- 보조·설명 글자도 기본적으로 \`#111111\`을 사용하며, 정보 위계는 크기·굵기·여백으로 구분\n- 구분선·테두리: \`#CFD4DC\` 또는 더 옅은 \`#E5E7EB\`\n- 구분선과 셀 테두리에 흰색 사용 금지\n- 이미지와 아이콘의 고유색은 유지\n- 링크·텍스트를 색상만으로 구별하지 않고 밑줄·굵기·버튼 형태를 함께 사용\n- 기본 서체: Pretendard → Noto Sans KR → Apple SD Gothic Neo → system sans-serif\n\nNexus의 인터페이스 기본값은 라이트 테마입니다. 페이지 전체 배경, 카드, 셀, Footer를 다크 계열로 되돌리지 않습니다. 새 인터페이스나 하위 페이지가 추가되더라도 흰색 바탕과 검정 글자, 회색 테두리를 기본 원판으로 사용합니다. 다크 테마가 필요해지는 경우 별도 테마 기능으로 명시적으로 설계하며 기본 파일을 다시 다크 색상으로 변경하지 않습니다.\n\n`;
  after = after.replace(/## 5\. 공통 시각 규격[\s\S]*?(?=## 6\.)/, section5);
  after = after.replace(
    '- 동일 법적 고지문을 여러 JS/CSS/HTML에서 각각 소유',
    '- 동일 법적 고지문을 여러 JS/CSS/HTML에서 각각 소유\n- Footer 사업자정보·Copyright·문의·AI 안내를 CSS `content` 또는 JavaScript로 생성\n- 기본 배경을 다크 색상으로 복구하거나 흰색 텍스트를 기본 본문색으로 사용\n- 테두리·구분선에 흰색 또는 반투명 흰색을 사용'
  );
  writeIfChanged(file, before, after);
}

// Internal post-migration scan. It never fails the workflow; remaining exceptions are recorded for direct cleanup.
const remaining = [];
const light = new Set(['#fff','#ffffff','white','transparent','none']);
const black = new Set(['#111','#111111','#000','#000000','black','inherit','currentcolor']);
function stripImportant(v){return v.replace(/\s*!important\s*$/i,'').trim().toLowerCase()}
function scanCss(css, file) {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of clean.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = m[1].trim();
    if (!selector || selector.startsWith('@') || visualSelector.test(selector)) continue;
    for (const d of m[2].matchAll(/(^|;)\s*([\w-]+)\s*:\s*([^;}]*)/g)) {
      const prop = d[2].toLowerCase(), value = stripImportant(d[3]);
      if ((prop === 'background' || prop === 'background-color') && !light.has(value) && !(/url\(/i.test(value) && !/(?:^|,)\s*(?:html|body)(?:\b|[.:#\[])/i.test(selector))) {
        remaining.push(`${file}: background ${selector} => ${d[3].trim()}`);
      }
      if (prop === 'color' && !value.startsWith('var(') && !black.has(value)) remaining.push(`${file}: color ${selector} => ${d[3].trim()}`);
      if (/^border(?:-(?:top|right|bottom|left))?(?:-color)?$/.test(prop) && /rgba?\(\s*255\s*,\s*255\s*,\s*255|#fff(?:fff)?\b|\bwhite\b/i.test(value)) {
        remaining.push(`${file}: white border ${selector} => ${d[3].trim()}`);
      }
    }
  }
  if (new RegExp(`content\\s*:\\s*["']${BUSINESS.split(' · ')[0]}`, 'i').test(clean)) remaining.push(`${file}: business metadata generated by CSS`);
}
for (const file of walk(ROOT, file => file.endsWith('.css'))) scanCss(fs.readFileSync(file,'utf8'),file);
for (const file of walk(ROOT, file => file.endsWith('.html'))) {
  const html=fs.readFileSync(file,'utf8');
  for(const s of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) scanCss(s[1],`${file}#style`);
}

const report = [
  'NEXUS LIGHT THEME MIGRATION',
  `changed files: ${changed.length}`,
  `changed declarations: ${declarationChanges}`,
  `remaining structural color issues: ${remaining.length}`,
  '',
  ...remaining.slice(0,500),
  '',
  'CHANGED FILES',
  ...changed
].join('\n');
fs.writeFileSync(path.join(ROOT, 'LIGHT_THEME_MIGRATION_REPORT.txt'), report + '\n');
console.log(report);
