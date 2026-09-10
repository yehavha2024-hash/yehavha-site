import fs from 'node:fs';
import path from 'node:path';

const BUSINESS = '스카이예슈아 · 사업자등록번호 536-38-01234 · 통신판매번호 2025-서울서초-2352 · 대표 이명훈';
const RESEARCH = '국가연구자번호 13169680 · ISNI 0000000513760591 · ORCID 0009-0000-6095-8067';
const COPYRIGHT = 'Copyright © 이명훈 2026. All rights reserved.';
const ROOTS = [
  'ai-law-tech-foresight',
  'legal-philosophy',
  'legal-knowledge',
  'three-minute-break',
  'toeic-human-100'
];

let errors = 0;
let checked = 0;
const fail = (file, message) => {
  errors += 1;
  console.error(`ERROR ${file}: ${message}`);
  console.error(`::error file=${file}::${message}`);
};

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(full.split(path.sep).join('/'));
  }
  return out;
}

function siteFooter(html) {
  const match = html.match(/<footer\b[^>]*class=["'][^"']*\bsite-footer\b[^"']*["'][^>]*>[\s\S]*?<\/footer>/i);
  return match ? match[0] : '';
}

function hasClassedParagraph(footer, className, text) {
  const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`<p\\b[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>[\\s\\S]*?${escaped}[\\s\\S]*?<\\/p>`, 'i').test(footer);
}

for (const file of ROOTS.flatMap(root => walk(root))) {
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes('Copyright ©')) continue;
  checked += 1;

  const footer = siteFooter(html);
  if (!footer) {
    fail(file, 'Copyright가 있으나 정적 site-footer 원문이 없음');
    continue;
  }
  if (!/data-footer-standard=["']v2["']/i.test(footer)) fail(file, 'Footer 표준 버전 v2 누락');
  if (!footer.includes(BUSINESS)) fail(file, '사업자정보가 HTML Footer 원문에 직접 존재하지 않음');
  if (!footer.includes(RESEARCH)) fail(file, 'NEXUS 메인 연구자 식별자 표준 불일치');
  if (/ORCID\s+ID\b/i.test(footer)) fail(file, '구형 ORCID ID 표기가 남아 있음');
  if (!hasClassedParagraph(footer, 'business-meta', BUSINESS)) fail(file, '사업자정보 business-meta 클래스 누락');
  if (!hasClassedParagraph(footer, 'research-identifiers', RESEARCH)) fail(file, '연구자 식별자 research-identifiers 클래스 누락');
  if (!hasClassedParagraph(footer, 'copyright', COPYRIGHT)) fail(file, 'Copyright copyright 클래스 누락');
  if (!/<p\b[^>]*class=["'][^"']*\bcontact\b[^"']*["'][^>]*>[\s\S]*?문의\s*<a[^>]+href=["']mailto:kimbrighth@gmail\.com["']/is.test(footer)) fail(file, '문의 contact 클래스 또는 표준 mailto 누락');
  if (!footer.includes(COPYRIGHT)) fail(file, '표준 Copyright 문구 불일치');
  if (!footer.includes('AI 활용 안내')) fail(file, 'AI 활용 안내 누락');
  if (!/href=["']#top["']/i.test(footer) || !footer.includes('맨 위로 이동')) fail(file, '맨 위로 이동 링크 누락');

  const businessAt = footer.indexOf(BUSINESS);
  const researchAt = footer.indexOf(RESEARCH);
  const copyrightAt = footer.indexOf(COPYRIGHT);
  const contactAt = footer.indexOf('mailto:kimbrighth@gmail.com');
  const aiAt = footer.indexOf('AI 활용 안내');
  const topAt = footer.search(/href=["']#top["']/i);
  if (!(businessAt >= 0 && businessAt < researchAt && researchAt < copyrightAt && copyrightAt < contactAt && contactAt < aiAt && aiAt < topAt)) {
    fail(file, 'HTML Footer 원문 순서가 사업자정보 → 연구자 식별자 → Copyright → 문의 → AI 활용 안내 → 맨 위로 이동 순서가 아님');
  }

  if (/<a\b[^>]*href=["']#top["'][^>]*onclick=/i.test(footer)) {
    fail(file, '맨 위로 이동이 인라인 JavaScript 보정에 의존함');
  }
}

for (const root of ROOTS) {
  if (!fs.existsSync(root)) continue;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.css')) continue;
    if (/(?:footer[-_.]?(?:fix|override|patch|hotfix)|(?:fix|patch|hotfix)[-_.]?footer)/i.test(entry.name)) {
      fail(`${root}/${entry.name}`, 'Footer 임시 fix/override/patch/hotfix CSS 파일이 남아 있음');
    }
  }
}

const FOOTER_CSS_EXPECTATIONS = {
  'legal-knowledge/project-standard.css': [
    '>div:first-child strong{display:block;font-size:15px!important;font-weight:700!important',
    '.footer-note p{margin:0!important;font-size:14px!important',
    '.business-meta{color:var(--nxs-text)!important;font-weight:700!important}',
    '.ai-disclosure{margin-top:7px!important;font-size:13.5px!important;line-height:1.75!important}',
    '.site-footer[data-footer-standard="v2"] a{color:var(--nxs-accent)!important;font-weight:700!important',
    '.footer-note>a{display:inline-block;margin-top:7px!important;font-size:13.5px!important;font-weight:700!important}'
  ],
  'legal-knowledge/ai-literature/styles.css': [
    '.site-footer[data-footer-standard="v2"] strong{display:block;color:var(--text);font-size:15px;font-weight:700;line-height:1.5}',
    '.footer-note p{margin:0;color:#111111;font-size:14px;line-height:1.75;text-align:center}',
    '.business-meta{color:var(--text);font-weight:700}',
    '.ai-disclosure{margin-top:7px;font-size:13.5px;line-height:1.75}',
    '.footer-note p a{color:var(--accent);font-size:14px;font-weight:700;text-decoration:none}',
    '.footer-note>a{display:inline-block;margin-top:7px;color:var(--accent);text-decoration:none;font-size:13.5px;font-weight:700}'
  ],
  'legal-knowledge/legal-mind/style.css': [
    '.footer-brand strong{display:block;color:var(--text);font-size:15px;font-weight:700;line-height:1.5}',
    '.footer-brand p{margin:5px 0 0;color:#111111;font-size:13.5px;line-height:1.72}',
    '.footer-meta p{margin:0;color:#111111;font-size:14px;line-height:1.75;text-align:center}',
    '.footer-meta .business-meta{color:var(--text);font-weight:700}',
    '.footer-meta .ai-disclosure{max-width:920px;margin:7px auto 0;font-size:13.5px;line-height:1.75}',
    '.footer-meta p a{color:var(--accent);font-size:14px;font-weight:700;text-decoration:none}',
    '.footer-meta>a{display:inline-block;margin-top:7px;color:var(--accent);font-size:13.5px;font-weight:700;text-decoration:none}'
  ]
};

for (const [file, tokens] of Object.entries(FOOTER_CSS_EXPECTATIONS)) {
  if (!fs.existsSync(file)) {
    fail(file, 'Footer CSS 소유 파일 없음');
    continue;
  }
  const compact = fs.readFileSync(file, 'utf8').replace(/\s+/g, '');
  for (const token of tokens) {
    if (!compact.includes(token.replace(/\s+/g, ''))) fail(file, `NEXUS 메인 Footer CSS 규격 불일치: ${token}`);
  }
}

console.log(`Standalone business/footer source audit: ${errors} error(s); HTML checked=${checked}`);
if (errors) process.exit(1);
