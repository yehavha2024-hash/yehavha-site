import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
let errors = 0;
let warnings = 0;

const fail = (file, message) => {
  errors += 1;
  console.error(`ERROR ${file}: ${message}`);
  console.log(`::error file=${file}::${message}`);
};
const warn = (file, message) => {
  warnings += 1;
  console.warn(`WARNING ${file}: ${message}`);
  console.log(`::warning file=${file}::${message}`);
};
const exists = relative => fs.existsSync(path.join(ROOT, relative));
const read = relative => fs.readFileSync(path.join(ROOT, relative), 'utf8');

const forbiddenLegacy = [
  'ai-law-tech-foresight/card-density-20260817.css',
  'ai-law-tech-foresight/mobile-flow.css',
  'ai-law-tech-foresight/contrast-fix-20260809.css',
  'ai-law-tech-foresight/card-title-compact-20260817.js',
  'legal-philosophy/contrast-fix-20260809.css',
  'three-minute-break/nexus-shell.css',
  'toeic-human-100/nexus-shell.css',
  'toeic-human-100/v2-ui-theme.css',
  'nexus/research-groups.css',
  'nexus/articles/public-layout-20260820.css',
  'nexus/intelligence-briefing/compact-top.css',
  'nexus/portal-enhancements.css',
  'nexus/status.css'
];

for (const file of forbiddenLegacy) {
  if (exists(file)) fail(file, '폐기된 override/legacy 레이어가 다시 존재함');
}

const requiredReturnPages = [
  'ai-law-tech-foresight/index.html',
  'legal-philosophy/index.html',
  'legal-knowledge/index.html',
  'three-minute-break/index.html',
  'toeic-human-100/index.html',
  'nexus/ai-legal-glossary/index.html',
  'nexus/ai-music-archive/index.html',
  'nexus/ai-trends/index.html',
  'nexus/articles/index.html',
  'nexus/education-hub/index.html',
  'nexus/government-ax/index.html',
  'nexus/intelligence-briefing/index.html',
  'nexus/living-law/index.html',
  'nexus/publishing/index.html',
  'nexus/research-track/index.html',
  'nexus/toeic-human-v2/index.html',
  'nexus/university/index.html'
];

for (const file of requiredReturnPages) {
  if (!exists(file)) {
    fail(file, '필수 공개 페이지 없음');
    continue;
  }
  const html = read(file);
  if (!/<a\b[^>]*href=["'][^"']*["'][^>]*>[^<]*←?\s*YEHAVHA\s+NEXUS/i.test(html) && !/YEHAVHA\s+NEXUS/i.test(html)) {
    fail(file, 'YEHAVHA NEXUS 복귀 링크 누락');
  }
}

const portal = 'nexus/portal-v2.css';
if (!exists(portal)) {
  fail(portal, '공통 shell 없음');
} else {
  const css = read(portal);
  for (const token of [
    '--nxs-body-size:16.5px',
    '--nxs-footer-project:15px',
    '--nxs-footer-text:14px',
    '.back-link,.nexus-link,.back',
    'min-height:42px',
    'padding:0 14px',
    'border-radius:10px',
    'background:#fff',
    'font-size:14px'
  ]) {
    if (!css.replace(/\s+/g, '').includes(token.replace(/\s+/g, ''))) fail(portal, `공통 shell 핵심 규격 누락: ${token}`);
  }
  if (css.includes('스카이예슈아 · 사업자등록번호')) {
    fail(portal, '법적 메타데이터를 CSS가 소유함. 실제 HTML Footer만 소유해야 함');
  }
  if (/background\s*:\s*#081a30/i.test(css)) fail(portal, '복귀 링크/공통 shell에 구형 다크 배경이 남아 있음');
  if (!/\.footer-card[^\{]*\{[^}]*text-align:center/is.test(css)) fail(portal, 'Footer 중앙정렬 canonical 규칙 누락');
}

const articlePages = [
  'nexus/articles/index.html',
  'nexus/articles/article.html',
  'nexus/articles/judicial-ai-prompt-injection.html'
];
for (const page of articlePages) {
  if (!exists(page)) continue;
  const html = read(page);
  const refs = [...html.matchAll(/<link\s+[^>]*href=["']([^"']+\.css(?:\?[^"']*)?)["']/gi)].map(m => m[1].split('?')[0]);
  if (refs.length !== 2) fail(page, `글 아카이브 CSS는 공통 shell + articles.css 2개만 허용: 현재 ${refs.length}개`);
  if (!refs.some(ref => ref.endsWith('portal-v2.css'))) fail(page, '공통 shell portal-v2.css 누락');
  if (!refs.some(ref => ref.endsWith('articles.css'))) fail(page, '콘텐츠 canonical articles.css 누락');
  if (/<style[\s>]/i.test(html)) fail(page, '페이지별 inline style 금지');
}

const structuralFiles = [
  'nexus/nexus-standard.css',
  'nexus/articles/articles.css',
  'legal-philosophy/project-standard.css',
  'legal-knowledge/project-standard.css',
  'ai-law-tech-foresight/project-standard.css'
];
for (const file of structuralFiles) {
  if (!exists(file)) continue;
  const css = read(file);
  if (/footer-(?:fix|override|hotfix)|patch\.css/i.test(css)) fail(file, '임시 footer/theme override 참조 금지');
}

for (const file of ['nexus/readability-20260820.css', 'nexus/university/guided-practice-20260820.css']) {
  if (exists(file)) warn(file, '날짜형 CSS 기술부채: 기능 검증 후 canonical owner로 단계 통합 권장');
}

console.log(`Style ownership audit: ${errors} error(s), ${warnings} warning(s)`);
if (errors) process.exit(1);
