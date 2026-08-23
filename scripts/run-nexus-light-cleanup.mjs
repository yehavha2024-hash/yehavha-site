import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'nexus';
const WHITE = '#ffffff';
const BLACK = '#111111';
const LINE = '#cfd4dc';
const TRACK = '#e5e7eb';
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

function isActualVisual(selector) {
  const tokens = selector.toLowerCase().split(/[^a-z0-9_-]+/).filter(Boolean);
  return tokens.some(token =>
    token === 'icon' || token.endsWith('-icon') || token.endsWith('_icon') ||
    token === 'glyph' || token.endsWith('-glyph') || token.endsWith('_glyph') ||
    token === 'svg' || token === 'logo' || token.endsWith('-logo') ||
    token === 'mark' || token.endsWith('-mark') || token === 'dot' || token.endsWith('-dot') ||
    token === 'artwork' || token === 'avatar' || token === 'illustration' || token === 'pictogram' || token === 'emoji' || token === 'swatch' ||
    token === 'progress-ring' || token === 'progress-bar' || token === 'progress-fill' ||
    token === 'meter-bar' || token === 'meter-fill' || token === 'chart' || token === 'spark'
  );
}

function isTrack(selector) {
  return /(?:^|[^a-z0-9_-])(?:progress|meter)-track(?:$|[^a-z0-9_-])/i.test(selector);
}

function keepImportant(raw, value) {
  return /!important\s*$/i.test(raw) ? `${value}!important` : value;
}

function grayBorder(raw) {
  let out = raw;
  out = out.replace(/rgba?\([^)]*\)/gi, LINE);
  out = out.replace(/hsla?\([^)]*\)/gi, LINE);
  out = out.replace(/#[0-9a-f]{3,8}\b/gi, LINE);
  out = out.replace(/\b(?:white|black)\b/gi, LINE);
  return out;
}

function transformRule(selector, body) {
  const visual = isActualVisual(selector);
  return body.replace(/(^|;)\s*([\w-]+)\s*:\s*([^;}]*)/g, (whole, lead, prop, raw) => {
    const p = prop.toLowerCase();
    const value = raw.trim();
    let next = value;

    if (p.startsWith('--')) return whole;

    if (p === 'color' || p === 'caret-color') {
      if (!visual) next = keepImportant(value, BLACK);
    } else if (p === 'background' || p === 'background-color') {
      if (visual) {
        next = value;
      } else if (isTrack(selector)) {
        next = keepImportant(value, TRACK);
      } else if (/url\(/i.test(value)) {
        next = value;
      } else {
        next = keepImportant(value, WHITE);
      }
    } else if (p === 'background-image') {
      if (!visual && !/url\(/i.test(value)) next = keepImportant(value, 'none');
    } else if (/^border(?:-(?:top|right|bottom|left))?$/.test(p)) {
      if (!visual) next = grayBorder(value);
    } else if (/^border(?:-(?:top|right|bottom|left))?-color$/.test(p)) {
      if (!visual) next = keepImportant(value, LINE);
    }

    if (next !== value) declarationChanges += 1;
    return `${lead}${prop}:${next}`;
  });
}

function transformCss(css) {
  return css.replace(/([^{}]+)\{([^{}]*)\}/g, (whole, selector, body) => {
    const trimmed = selector.trim();
    if (!trimmed || trimmed.startsWith('@')) return whole;
    return `${selector}{${transformRule(trimmed, body)}}`;
  });
}

function write(file, next) {
  const current = fs.readFileSync(file, 'utf8');
  if (current === next) return;
  fs.writeFileSync(file, next);
  changed.push(file);
}

for (const file of walk(ROOT, f => f.endsWith('.css'))) {
  const source = fs.readFileSync(file, 'utf8');
  write(file, transformCss(source));
}

for (const file of walk(ROOT, f => f.endsWith('.html'))) {
  const source = fs.readFileSync(file, 'utf8');
  const next = source.replace(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi, (whole, attrs, css) => `<style${attrs}>${transformCss(css)}</style>`);
  write(file, next);
}

console.log(`Precise Nexus light cleanup: ${changed.length} file(s), ${declarationChanges} declaration(s)`);
changed.forEach(file => console.log(`- ${file}`));
