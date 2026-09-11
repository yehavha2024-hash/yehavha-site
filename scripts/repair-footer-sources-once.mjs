import fs from 'node:fs';
import path from 'node:path';

const roots = [
  'nexus',
  'ai-law-tech-foresight',
  'legal-philosophy',
  'legal-knowledge',
  'three-minute-break',
  'toeic-human-100',
];
const extensions = new Set(['.html', '.js', '.mjs', '.jsx', '.ts', '.tsx']);
const business = '스카이예슈아 · 사업자등록번호 536-38-01234<br />통신판매번호 : 2025-서울서초-2352 · 대표 이명훈';
const research = '국가연구자번호 13169680 · ISNI 0000000513760591<br />ORCID 0009-0000-6095-8067';
const businessRe = /(<p\b[^>]*class=["'][^"']*\bbusiness-meta\b[^"']*["'][^>]*>)(.*?)(<\/p>)/gis;
const researchRe = /(<p\b[^>]*class=["'][^"']*\bresearch-identifiers\b[^"']*["'][^>]*>)(.*?)(<\/p>)/gis;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && extensions.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

const changed = [];
for (const root of roots) {
  for (const file of walk(root)) {
    const rel = file.split(path.sep).join('/');
    const original = fs.readFileSync(file, 'utf8');
    let text = original;

    if (text.includes('business-meta')) {
      text = text.replace(businessRe, (_all, open, _inner, close) => `${open}${business}${close}`);
    }
    if (text.includes('research-identifiers')) {
      text = text.replace(researchRe, (_all, open, _inner, close) => `${open}${research}${close}`);
    }

    if ((rel === 'legal-philosophy/app.js' || rel === 'legal-knowledge/app.js') && !text.includes('research-identifiers')) {
      const lineRe = /^(\s*)(<p class="business-meta">.*?<\/p>)\s*$/m;
      const match = text.match(lineRe);
      if (!match) throw new Error(`Could not locate dynamic business footer line in ${rel}`);
      text = text.replace(lineRe, `${match[1]}${match[2]}\n${match[1]}<p class="research-identifiers">${research}</p>`);
    }

    if (text !== original) {
      fs.writeFileSync(file, text, 'utf8');
      changed.push(rel);
    }
  }
}

console.log(`Directly normalized ${changed.length} source file(s):`);
for (const rel of changed) console.log(`  ${rel}`);
if (!changed.length) throw new Error('No footer source files changed; refusing empty repair run');
