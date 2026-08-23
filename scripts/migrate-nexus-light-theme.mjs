import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = 'nexus';
const BASE = '67d3b5f3181545f3343dcdc80f4e128b3f995cc0';
const restored = [];
const changed = [];

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

function baseFile(file) {
  try { return execFileSync('git', ['show', `${BASE}:${file}`], { encoding: 'utf8' }); }
  catch { return ''; }
}

function customValues(css) {
  const map = new Map();
  for (const m of css.matchAll(/(--[\w-]+)\s*:\s*([^;}]+)/g)) {
    const list = map.get(m[1]) || [];
    list.push(m[2].trim());
    map.set(m[1], list);
  }
  return map;
}

function colorLike(value) {
  return /(?:#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|\b(?:white|black|transparent|currentcolor)\b)/i.test(value);
}

function layoutLike(value) {
  const v = value.trim();
  if (colorLike(v)) return false;
  if (/^(?:-?\d*\.?\d+)(?:px|rem|em|%|vw|vh|vmin|vmax|ch|ex|s|ms)?$/i.test(v)) return true;
  if (/^(?:calc|clamp|min|max)\(/i.test(v)) return true;
  if (/^(?:-?\d*\.?\d+(?:px|rem|em|%|vw|vh|vmin|vmax|ch|ex)?\s+){1,5}-?\d*\.?\d+(?:px|rem|em|%|vw|vh|vmin|vmax|ch|ex)?$/i.test(v)) return true;
  return false;
}

for (const file of walk(ROOT, f => f.endsWith('.css'))) {
  const original = baseFile(file);
  if (!original) continue;
  const originalMap = customValues(original);
  const current = fs.readFileSync(file, 'utf8');
  const counters = new Map();
  const repaired = current.replace(/(--[\w-]+)\s*:\s*([^;}]+)/g, (whole, name, raw) => {
    const index = counters.get(name) || 0;
    counters.set(name, index + 1);
    const originals = originalMap.get(name) || [];
    const oldValue = originals[index];
    const now = raw.trim();
    if (!oldValue || !layoutLike(oldValue) || !colorLike(now)) return whole;
    restored.push(`${file}: ${name} ${now} -> ${oldValue}`);
    return `${name}:${oldValue}`;
  });
  if (repaired !== current) {
    fs.writeFileSync(file, repaired);
    changed.push(file);
  }
}

const portal = 'nexus/portal-v2.css';
const portalCss = fs.readFileSync(portal, 'utf8');
const required = [
  '--nxs-body-line:1.75',
  '--nxs-card-title:18px',
  '--nxs-card-text:13.5px',
  '--nxs-footer-text:12px',
  '--nxs-footer-link:11px'
];
const missing = required.filter(token => !portalCss.includes(token));

const previousReport = fs.existsSync('nexus/LIGHT_THEME_MIGRATION_REPORT.txt')
  ? fs.readFileSync('nexus/LIGHT_THEME_MIGRATION_REPORT.txt', 'utf8')
  : '';
const report = [
  previousReport.trim(),
  '',
  'TOKEN TYPE REPAIR',
  `repaired files: ${changed.length}`,
  `restored layout tokens: ${restored.length}`,
  `missing required portal tokens: ${missing.length}`,
  ...missing.map(x => `MISSING ${x}`),
  '',
  ...restored
].join('\n').trim() + '\n';
fs.writeFileSync('nexus/LIGHT_THEME_MIGRATION_REPORT.txt', report);
console.log(report);
