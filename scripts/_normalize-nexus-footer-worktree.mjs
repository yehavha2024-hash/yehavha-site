import fs from 'node:fs';
import path from 'node:path';

const ROOTS = [
  'nexus',
  'ai-law-tech-foresight',
  'legal-philosophy',
  'legal-knowledge',
  'three-minute-break',
  'toeic-human-100'
];
const BUSINESS = '스카이예슈아 · 사업자등록번호 536-38-01234 · 대표 이명훈';
const RESEARCH = '국가연구자번호 13169680 · ISNI 0000000513760591 · ORCID 0009-0000-6095-8067';
const COPYRIGHT = 'Copyright © 이명훈 2026. All rights reserved.';

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function addClass(attrs, className) {
  const match = attrs.match(/\bclass=(['"])(.*?)\1/i);
  if (match) {
    const classes = match[2].split(/\s+/).filter(Boolean);
    if (!classes.includes(className)) classes.push(className);
    return attrs.replace(match[0], `class=${match[1]}${classes.join(' ')}${match[1]}`);
  }
  return `${attrs} class="${className}"`;
}

function normalizeParagraphs(footer) {
  let out = footer.replace(/ORCID\s+ID\b/gi, 'ORCID');

  // Remove any pre-existing researcher identifier paragraph so one canonical line can be inserted in one position.
  out = out.replace(/\s*<p\b[^>]*>[^<]*(?:국가연구자번호|ISNI|ORCID)[\s\S]*?<\/p>/gi, match => {
    if (!/(?:국가연구자번호|ISNI|ORCID)/i.test(match)) return match;
    return '';
  });

  // Normalize semantic classes and exact text on legal/business metadata paragraphs.
  out = out.replace(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi, (whole, attrs, inner) => {
    const plain = inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (plain === BUSINESS) return `<p${addClass(attrs, 'business-meta')}>${BUSINESS}</p>`;
    if (plain === COPYRIGHT) return `<p${addClass(attrs, 'copyright')}>${COPYRIGHT}</p>`;
    if (/문의\s*/.test(plain) && /mailto:kimbrighth@gmail\.com/i.test(inner)) {
      return `<p${addClass(attrs, 'contact')}>${inner.trim()}</p>`;
    }
    return whole;
  });

  // Insert researcher identifiers immediately after business metadata, matching the local indentation.
  if (!out.includes(RESEARCH)) {
    out = out.replace(/(^[ \t]*)<p\b([^>]*)class=(['"])([^'"]*\bbusiness-meta\b[^'"]*)\3([^>]*)>\s*스카이예슈아 · 사업자등록번호 536-38-01234 · 대표 이명훈\s*<\/p>/mi,
      (whole, indent) => `${whole}\n${indent}<p class="research-identifiers">${RESEARCH}</p>`);
  }

  // Brand descriptions in standalone site-footer structures get an explicit semantic hook for direct CSS ownership.
  out = out.replace(/(<div\b[^>]*class=(['"])[^'"]*\bfooter-brand\b[^'"]*\2[^>]*>[\s\S]*?<strong[\s\S]*?<\/strong>\s*)<p\b([^>]*)>/i,
    (whole, prefix, _quote, attrs) => `${prefix}<p${addClass(attrs, 'footer-description')}>`);

  // Main standard uses a direct top link rather than a paragraph wrapper.
  out = out.replace(/<p\b[^>]*>\s*(<a\b[^>]*href=(['"])#top\2[^>]*>\s*맨 위로 이동 ↑\s*<\/a>)\s*<\/p>/gi, '$1');
  return out;
}

let changed = 0;
for (const file of ROOTS.flatMap(root => walk(root))) {
  const original = fs.readFileSync(file, 'utf8');
  if (!/data-footer-standard=["']v2["']/i.test(original) || !original.includes('Copyright ©')) continue;
  const next = original.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, block => {
    if (!/data-footer-standard=["']v2["']/i.test(block) || !block.includes('Copyright ©')) return block;
    return normalizeParagraphs(block);
  });
  if (next !== original) {
    fs.writeFileSync(file, next, 'utf8');
    changed += 1;
    console.log(`normalized ${file.split(path.sep).join('/')}`);
  }
}
console.log(`Footer HTML source normalization changed ${changed} file(s).`);
