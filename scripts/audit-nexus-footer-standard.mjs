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

const STANDARD = Object.freeze({
  business: [
    '스카이예슈아 · 사업자등록번호 536-38-01234',
    '통신판매번호 : 2025-서울서초-2352 · 대표 이명훈'
  ],
  research: [
    '국가연구자번호 13169680 · ISNI 0000000513760591',
    'ORCID 0009-0000-6095-8067'
  ],
  copyright: 'Copyright © 이명훈 2026. All rights reserved.'
});

const SOURCE_EXTENSIONS = new Set(['.html', '.htm', '.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx']);
const META_ANCHORS = ['사업자등록번호', '통신판매번호', '국가연구자번호', 'ISNI', 'ORCID'];
const TEMP_FOOTER_FILE = /(?:footer[-_.]?(?:fix|override|patch|hotfix)|(?:fix|override|patch|hotfix)[-_.]?footer)/i;

let errors = 0;
let checkedFooters = 0;
let checkedProducers = 0;
let checkedFooterCss = 0;

const norm = file => file.split(path.sep).join('/');
const fail = (file, message) => {
  errors += 1;
  console.error(`ERROR ${file}: ${message}`);
  console.error(`::error file=${file}::${message}`);
};

function walk(dir, predicate, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, predicate, out);
    else if (entry.isFile() && predicate(full)) out.push(norm(full));
  }
  return out;
}

function decodeEntities(text) {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&middot;/gi, '·')
    .replace(/&copy;/gi, '©')
    .replace(/&amp;/gi, '&');
}

function visibleLines(fragment) {
  return decodeEntities(fragment)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p\s*>|<\/div\s*>|<\/li\s*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\\n/g, '\n')
    .split(/\r?\n/)
    .map(line => line.replace(/[\t ]+/g, ' ').trim())
    .filter(Boolean);
}

function footerBlocks(source) {
  return [...source.matchAll(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi)].map(match => match[0]);
}

function classBody(footer, className) {
  const escaped = className.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = footer.match(new RegExp(`<p\\b[^>]*class=["'][^"']*\\b${escaped}\\b[^"']*["'][^>]*>([\\s\\S]*?)<\\/p>`, 'i'));
  return match ? match[1] : null;
}

function sameLines(actual, expected) {
  return actual.length === expected.length && actual.every((line, index) => line === expected[index]);
}

function assertStaticFooter(file, footer) {
  checkedFooters += 1;
  if (!/data-footer-standard=["']v2["']/i.test(footer)) fail(file, 'Footer 표준 버전 v2 누락');
  if (/ORCID\s+ID\b/i.test(footer)) fail(file, '구형 ORCID ID 표기가 남아 있음');

  const business = classBody(footer, 'business-meta');
  const research = classBody(footer, 'research-identifiers');
  if (business === null) fail(file, 'business-meta 클래스가 없음');
  else if (!sameLines(visibleLines(business), STANDARD.business)) fail(file, '사업자정보는 사업자등록번호 다음 줄에 통신판매번호·대표가 오는 고정 2행이어야 함');
  if (research === null) fail(file, 'research-identifiers 클래스가 없음');
  else if (!sameLines(visibleLines(research), STANDARD.research)) fail(file, '연구자정보는 국가연구자번호·ISNI 다음 줄에 ORCID가 오는 고정 2행이어야 함');

  const copyright = classBody(footer, 'copyright');
  if (copyright === null || visibleLines(copyright).join(' ') !== STANDARD.copyright) fail(file, 'Copyright copyright 클래스 또는 표준 문구 불일치');
  if (!/<p\b[^>]*class=["'][^"']*\bcontact\b[^"']*["'][^>]*>[\s\S]*?문의\s*<a[^>]+href=["']mailto:kimbrighth@gmail\.com["']/is.test(footer)) fail(file, '문의 contact 클래스 또는 표준 mailto 누락');
  if (!footer.includes('AI 활용 안내')) fail(file, 'AI 활용 안내 누락');
  if (!/href=["']#top["']/i.test(footer) || !footer.includes('맨 위로 이동')) fail(file, '표준 맨 위로 이동 링크 누락');
  if (/<a\b[^>]*href=["']#top["'][^>]*onclick=/i.test(footer)) fail(file, '맨 위로 이동이 인라인 JavaScript 보정에 의존함');

  const text = visibleLines(footer).join('\n');
  const positions = [
    text.indexOf(STANDARD.business[0]),
    text.indexOf(STANDARD.business[1]),
    text.indexOf(STANDARD.research[0]),
    text.indexOf(STANDARD.research[1]),
    text.indexOf(STANDARD.copyright),
    text.indexOf('kimbrighth@gmail.com'),
    text.indexOf('AI 활용 안내'),
    text.indexOf('맨 위로 이동')
  ];
  if (positions.some(position => position < 0) || positions.some((position, index) => index > 0 && position <= positions[index - 1])) {
    fail(file, 'Footer DOM 순서가 사업자 2행 → 연구자 2행 → Copyright → 문의 → AI 안내 → 맨 위로 이동 순서가 아님');
  }
}

function assertDynamicProducer(file, source) {
  if (!META_ANCHORS.some(anchor => source.includes(anchor))) return;
  if (file.endsWith('.html') && footerBlocks(source).length) return;
  checkedProducers += 1;

  for (const line of [...STANDARD.business, ...STANDARD.research]) {
    if (!source.includes(line)) fail(file, `동적 Footer/템플릿의 표준 메타데이터 누락: ${line}`);
  }

  const oldBusiness = `${STANDARD.business[0]} · ${STANDARD.business[1]}`;
  const oldResearch = `${STANDARD.research[0]} · ${STANDARD.research[1]}`;
  if (source.includes(oldBusiness)) fail(file, '동적 Footer/템플릿에 사업자정보 단일행 생성이 남아 있음');
  if (source.includes(oldResearch)) fail(file, '동적 Footer/템플릿에 연구자정보 단일행 생성이 남아 있음');
}

function assertFooterCss(file, css) {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = [...clean.matchAll(/([^{}]*footer[^{}]*)\{([^{}]*)\}/gi)];
  if (!rules.length) return;
  checkedFooterCss += 1;

  if (TEMP_FOOTER_FILE.test(path.basename(file))) fail(file, 'Footer 임시 fix/override/patch/hotfix 파일이 남아 있음');
  for (const [, selectorRaw, body] of rules) {
    const selector = selectorRaw.trim();
    if (/\border\s*:/i.test(body)) fail(file, `Footer CSS order 재배치 금지: ${selector}`);
    if (/::(?:before|after)/i.test(selector) && /\bcontent\s*:/i.test(body)) fail(file, `Footer 메타데이터를 CSS content로 생성하면 안 됨: ${selector}`);
    if (/white-space\s*:\s*nowrap/i.test(body) && !/(?:orcid|identifier)/i.test(selector)) {
      fail(file, `Footer 전체/광범위 nowrap 금지; 식별자 단위로만 허용: ${selector}`);
    }
  }
}

const sourceFiles = ROOTS.flatMap(root => walk(root, file => SOURCE_EXTENSIONS.has(path.extname(file).toLowerCase())));
for (const file of sourceFiles) {
  const source = fs.readFileSync(file, 'utf8');
  if (/data-footer-standard=["']v1["']/i.test(source)) fail(file, '구형 Footer 표준 v1이 남아 있음');

  const footers = footerBlocks(source);
  if (file.endsWith('.html')) {
    for (const footer of footers) {
      if (footer.includes('Copyright ©') || /data-footer-standard=/i.test(footer)) assertStaticFooter(file, footer);
    }
    if (!footers.length && source.includes('Copyright ©') && META_ANCHORS.some(anchor => source.includes(anchor))) {
      fail(file, 'Footer 메타데이터가 있으나 정적 footer 원문을 찾을 수 없음');
    }
  }
  assertDynamicProducer(file, source);
}

for (const file of ROOTS.flatMap(root => walk(root, candidate => candidate.endsWith('.css')))) {
  assertFooterCss(file, fs.readFileSync(file, 'utf8'));
}

for (const stale of [
  '.github/workflows/footer-audit-sync.yml',
  '.github/workflows/footer-audit-report.yml',
  '.github/workflows/footer-standard-migration.yml',
  'scripts/migrate-nexus-footer-v2.mjs',
  'scripts/fix-audit-findings.mjs',
  'scripts/sync-footer-audit.mjs',
  'scripts/footer-audit-trigger.txt',
  'nexus/footer-audit-report.txt',
  'nexus/footer-full-audit-report.txt'
]) {
  if (fs.existsSync(stale)) fail(stale, '일회성 Footer 마이그레이션/감사 산출물이 다시 존재함');
}

console.log(`Global footer source audit: ${errors} error(s); static footers=${checkedFooters}; dynamic producers=${checkedProducers}; footer CSS files=${checkedFooterCss}`);
if (errors) process.exit(1);
