import fs from 'node:fs';

const file = 'scripts/audit-business-footer.mjs';
let source = fs.readFileSync(file, 'utf8');

const startMarker = "const compactCss = fs.readFileSync(COMPACT_CSS, 'utf8');";
const endMarker = '// Nexus HTML continues to use the global portal owner or the compact template owner.';
const start = source.indexOf(startMarker);
const end = source.indexOf(endMarker, start);

if (start < 0 || end < 0) {
  throw new Error('compact footer audit block not found');
}

const replacement = `const compactCss = fs.readFileSync(COMPACT_CSS, 'utf8');
const compactTokens = [
  'font-size:15px;line-height:1.75',
  '.back{display:inline-flex',
  'font-size:11.5px',
  '.footer{margin-top:0;padding:18px 0 36px',
  'text-align:center',
  '.footer>strong{display:block;color:#d7e1ea;font-size:13px',
  '.footer-description{margin:3px auto 0',
  '.footer-meta::before{content:none!important;display:none!important}',
  '.footer-meta>p{margin:0 auto;color:var(--footer-text);font-size:12px',
  '.footer .ai-disclosure{max-width:920px;margin:6px auto 0',
  'font-size:11.5px',
  '.footer-meta>a{display:inline-block;margin-top:6px',
  'font-size:11px'
];
for (const token of compactTokens) if (!compactCss.includes(token)) fail(COMPACT_CSS, \`compact template 공통 규격 누락: \${token}\`);
if (/\\.footer-meta>\\*\\{order:|\\.footer-meta>p:nth-child\\([^)]*\\)\\{order:/.test(compactCss)) {
  fail(COMPACT_CSS, 'compact Footer에 legacy CSS order 재배치가 남아 있음');
}
if (!/\\.footer \\.ai-disclosure\\{[^}]*margin:6px auto 0/.test(compactCss)) fail(COMPACT_CSS, 'compact Footer AI 안내 분리 간격이 명시되지 않음');

`;

source = source.slice(0, start) + replacement + source.slice(end);
fs.writeFileSync(file, source);
console.log('Updated audit-business-footer.mjs compact footer rules to canonical v2 order.');
