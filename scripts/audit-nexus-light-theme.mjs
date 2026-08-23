import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'nexus';
const LIGHT_BG = new Set(['#fff', '#ffffff', 'white', 'transparent', 'none']);
const TRACK_BG = new Set(['#e5e7eb', '#e4ebf3']);
const BLACK_TEXT = new Set(['#111', '#111111', '#000', '#000000', 'black', 'inherit', 'currentcolor']);
const preservedVisual = /(?:icon|glyph|svg|logo|mark|dot|artwork|avatar|illustration|pictogram|emoji|swatch|progress-(?:bar|fill|ring)|meter-(?:bar|fill)|chart|spark)/i;
const trackSelector = /(?:progress|meter)-track/i;
let errors = 0;
let checkedRules = 0;

const fail = (file, message) => {
  errors += 1;
  console.error(`ERROR ${file}: ${message}`);
  console.log(`::error file=${file}::${message}`);
};

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

function stripImportant(value) {
  return value.replace(/\s*!important\s*$/i, '').trim().toLowerCase();
}

function declarations(body) {
  return [...body.matchAll(/(^|;)\s*([\w-]+)\s*:\s*([^;}]*)/g)].map(m => [m[2].toLowerCase(), m[3].trim()]);
}

function auditCss(css, file) {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const rule = /([^{}]+)\{([^{}]*)\}/g;
  for (const match of clean.matchAll(rule)) {
    const selector = match[1].trim();
    if (!selector || selector.startsWith('@') || preservedVisual.test(selector)) continue;
    checkedRules += 1;
    for (const [prop, raw] of declarations(match[2])) {
      const value = stripImportant(raw);
      if (prop === 'background' || prop === 'background-color') {
        if (/url\(/i.test(value) && !/(?:^|,)\s*(?:html|body)(?:\b|[.:#\[])/i.test(selector)) continue;
        if (trackSelector.test(selector) && TRACK_BG.has(value)) continue;
        if (!LIGHT_BG.has(value)) fail(file, `비시각 요소 배경이 흰색이 아님: ${selector} { ${prop}:${raw} }`);
      }
      if (prop === 'color') {
        if (value.startsWith('var(')) continue;
        if (!BLACK_TEXT.has(value)) fail(file, `텍스트 색상이 검정이 아님: ${selector} { color:${raw} }`);
      }
      if (/^border(?:-(?:top|right|bottom|left))?(?:-color)?$/.test(prop)) {
        if (/rgba?\(\s*255\s*,\s*255\s*,\s*255|#fff(?:fff)?\b|\bwhite\b/i.test(value)) {
          fail(file, `테두리·구분선에 흰색이 남아 있음: ${selector} { ${prop}:${raw} }`);
        }
      }
    }
  }
  if (/footer-meta::before[\s\S]{0,500}content\s*:\s*["']스카이예슈아/i.test(clean)) {
    fail(file, 'Footer 법적 고지문을 CSS content로 생성하고 있음');
  }
}

for (const file of walk(ROOT, file => file.endsWith('.css'))) auditCss(fs.readFileSync(file, 'utf8'), file);

for (const file of walk(ROOT, file => file.endsWith('.html'))) {
  const html = fs.readFileSync(file, 'utf8');
  const theme = html.match(/<meta\b[^>]*name=["']theme-color["'][^>]*content=["']([^"']+)["'][^>]*>/i)
    || html.match(/<meta\b[^>]*content=["']([^"']+)["'][^>]*name=["']theme-color["'][^>]*>/i);
  if (theme && theme[1].toLowerCase() !== '#ffffff' && theme[1].toLowerCase() !== '#fff') fail(file, `theme-color가 흰색이 아님: ${theme[1]}`);
  for (const style of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) auditCss(style[1], `${file}#style`);
}

const portal = fs.readFileSync('nexus/portal-v2.css', 'utf8');
for (const token of ['--nxs-body-line:1.75', '--nxs-card-title:18px', '--nxs-card-text:13.5px', '--nxs-footer-text:12px', '--nxs-footer-link:11px']) {
  if (!portal.includes(token)) fail('nexus/portal-v2.css', `비색상 UI 토큰 훼손 또는 누락: ${token}`);
}

const standard = fs.readFileSync('NEXUS_UI_STANDARD.md', 'utf8');
for (const token of ['기본 배경: `#FFFFFF`', '기본 글자: `#111111`', '구분선·테두리: `#CFD4DC`']) {
  if (!standard.includes(token)) fail('NEXUS_UI_STANDARD.md', `라이트 UI 표준 누락: ${token}`);
}
if (/기본 배경:\s*`#071225`|Panel:\s*`rgba\(8,18,38/i.test(standard)) fail('NEXUS_UI_STANDARD.md', '구형 다크 테마 표준이 남아 있음');

console.log(`Nexus light theme audit: ${errors} error(s), ${checkedRules} structural CSS rule(s) checked`);
if (errors) process.exit(1);
