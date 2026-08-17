import fs from 'node:fs';
import path from 'node:path';

const roots = [
  'ai-law-tech-foresight',
  'legal-philosophy',
  'legal-knowledge',
  'three-minute-break',
  'toeic-human-100',
  'nexus'
];

const forbiddenLegacy = [
  'ai-law-tech-foresight/card-density-20260817.css',
  'ai-law-tech-foresight/mobile-flow.css',
  'ai-law-tech-foresight/contrast-fix-20260809.css',
  'ai-law-tech-foresight/card-title-compact-20260817.js',
  'legal-philosophy/contrast-fix-20260809.css',
  'three-minute-break/nexus-shell.css',
  'toeic-human-100/nexus-shell.css',
  'toeic-human-100/v2-ui-theme.css',
  'nexus/research-groups.css'
];

const coreStyles = new Set([
  'ai-law-tech-foresight/styles.css',
  'ai-law-tech-foresight/project-standard.css',
  'legal-philosophy/styles.css',
  'legal-philosophy/project-standard.css',
  'legal-knowledge/styles.css',
  'legal-knowledge/project-standard.css',
  'legal-knowledge/ai-literature/styles.css',
  'three-minute-break/style.css',
  'toeic-human-100/style.css',
  'toeic-human-100/project-standard.css',
  'nexus/portal-v2.css',
  'nexus/nexus-standard.css'
]);

let errors = 0;
let warnings = 0;
const referencedCss = new Set();

const normalize = p => p.split(path.sep).join('/');
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

function walk(dir, predicate) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, predicate));
    else if (predicate(full)) out.push(full);
  }
  return out;
}

for (const relative of forbiddenLegacy) {
  if (fs.existsSync(relative)) fail(relative, '핵심 파일로 통합 완료된 구형 보조 레이어가 다시 존재함');
}

const indexFiles = roots.flatMap(root => walk(root, file => path.basename(file) === 'index.html'));
for (const indexFile of indexFiles) {
  const html = fs.readFileSync(indexFile, 'utf8');
  const refs = [...html.matchAll(/<link\s+[^>]*href=["']([^"']+\.css(?:\?[^"']*)?)["'][^>]*>/gi)].map(match => match[1]);
  const seen = new Set();

  for (const ref of refs) {
    if (/^(?:https?:|data:)/i.test(ref)) continue;
    const clean = ref.split('?')[0].split('#')[0];
    const resolved = normalize(path.normalize(path.resolve(path.dirname(indexFile), clean)).replace(`${process.cwd().replaceAll('\\','/')}/`, ''));
    if (seen.has(resolved)) fail(indexFile, `동일 CSS 중복 로드: ${clean}`);
    seen.add(resolved);
    referencedCss.add(resolved);
    if (!fs.existsSync(resolved)) {
      fail(indexFile, `CSS 참조 대상 없음: ${clean}`);
      continue;
    }

    const css = fs.readFileSync(resolved, 'utf8');
    if (coreStyles.has(resolved)) continue;

    const declaresNexusTheme = /YEHAVHA NEXUS[^\n]*(?:Visual Standard|Owned App Shell|UI Theme)/i.test(css)
      || /:root\s*\{[^}]{0,1600}--nxs-bg\s*:/is.test(css);
    const broadSelectors = [
      /(^|\n)\s*body(?:\s|,|\{|::)/m,
      /(^|\n)\s*html(?:\s|,|\{|:)/m,
      /(^|\n)\s*h1(?:\s|,|\{)/m,
      /(^|\n)\s*\.app-shell(?:\s|,|\{)/m,
      /(^|\n)\s*\.wrap(?:\s|,|\{)/m,
      /(^|\n)\s*\.container(?:\s|,|\{)/m,
      /(^|\n)\s*\.site-footer(?:\s|,|\{)/m
    ].filter(pattern => pattern.test(css)).length;

    if (declaresNexusTheme) {
      fail(resolved, '기능 CSS가 전역 Nexus 테마를 다시 선언함. project-standard/style 계열 핵심 파일로 이동 필요');
    } else if (broadSelectors >= 4) {
      fail(resolved, `기능 CSS가 전역 레이아웃 선택자 ${broadSelectors}종을 동시에 소유함`);
    }
  }
}

for (const root of roots) {
  for (const cssFile of walk(root, file => file.endsWith('.css'))) {
    const relative = normalize(cssFile);
    if (referencedCss.has(relative)) continue;
    const css = fs.readFileSync(cssFile, 'utf8');
    if (/contrast[-_]?fix|mobile[-_]?flow|card[-_]?density|hotfix|patch/i.test(path.basename(cssFile))) {
      fail(relative, '참조되지 않는 패치형 CSS 잔존');
    }
    if (/YEHAVHA NEXUS[^\n]*(?:Visual Standard|Owned App Shell|UI Theme)/i.test(css)) {
      warn(relative, '참조되지 않는 전역 스타일 후보');
    }
  }
}

console.log(`Style ownership audit: ${errors} error(s), ${warnings} warning(s), ${indexFiles.length} page(s)`);
if (errors) process.exit(1);
