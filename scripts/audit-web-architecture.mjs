import fs from 'node:fs';
import path from 'node:path';

const projects = [
  { dir: 'ai-law-tech-foresight', detailFiles: ['app.js', 'research-document-standard.js'] },
  { dir: 'legal-philosophy', detailFiles: ['app.js'] },
  { dir: 'legal-knowledge', detailFiles: ['research-document-standard.js'] },
  { dir: 'three-minute-break', detailFiles: [] },
  { dir: 'toeic-human-100', detailFiles: [] },
  { dir: 'nexus', detailFiles: [] },
];

let errors = 0;
let warnings = 0;

const read = p => fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
const report = (kind, project, message) => {
  console.log(`${kind} ${project}: ${message}`);
  if (kind === 'ERROR') errors += 1;
  else warnings += 1;
};

const auditAnchors = (root, index) => {
  const ids = new Set([...index.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]));
  const idList = [...index.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]);
  const duplicates = [...new Set(idList.filter((id, i) => idList.indexOf(id) !== i))];
  duplicates.forEach(id => report('ERROR', root, `중복 id 발견: #${id}`));

  const hrefTargets = [...index.matchAll(/\bhref=["']#([^"']+)["']/g)].map(match => match[1]);
  for (const target of new Set(hrefTargets)) {
    if (!ids.has(target)) report('ERROR', root, `내부 링크 #${target}의 대상 id 없음`);
  }

  if (/맨 위로/.test(index)) {
    const hasTopControl = /href=["']#top["']/.test(index) || /data-(?:standard-)?top/.test(index);
    if (!hasTopControl) report('ERROR', root, '맨 위로 UI는 있으나 스크롤 대상/동작 표식 없음');
  }
};

for (const project of projects) {
  const root = project.dir;
  const indexPath = path.join(root, 'index.html');
  const index = read(indexPath);

  if (!index) {
    report('ERROR', root, 'index.html 없음');
    continue;
  }

  if (!index.includes('data-footer-standard="v1"')) {
    report('ERROR', root, '메인 footer에 data-footer-standard="v1" 없음');
  }
  if (!index.includes('Copyright ©')) report('ERROR', root, 'Copyright 없음');
  if (!index.includes('mailto:')) report('ERROR', root, '문의 mailto 없음');
  if (!index.includes('AI 활용 안내')) report('ERROR', root, '메인 AI 활용 안내 없음');

  auditAnchors(root, index);

  for (const file of fs.readdirSync(root)) {
    if (!file.endsWith('.js')) continue;
    const full = path.join(root, file);
    const source = read(full);

    if (/new\s+MutationObserver[\s\S]{0,400}document\.(documentElement|body)/.test(source)) {
      report('ERROR', `${root}/${file}`, '페이지 전체 MutationObserver 사용');
    }
    if (/createElement\(['"]style['"]\)/.test(source)) {
      report('WARNING', `${root}/${file}`, '런타임 style 생성 발견');
    }
    if (/site-footer[\s\S]{0,250}\.innerHTML|\.innerHTML[\s\S]{0,250}site-footer/.test(source)) {
      report('ERROR', `${root}/${file}`, 'JavaScript가 메인 footer를 다시 생성할 가능성');
    }
  }

  const configPath = path.join(root, 'config.js');
  if (fs.existsSync(configPath)) {
    const config = read(configPath);
    if (/\bdocument\.|createElement\(|addEventListener\(|innerHTML/.test(config)) {
      report('ERROR', `${root}/config.js`, 'config.js에 DOM/동작 코드 존재');
    }
  }

  for (const temp of ['home-v2.html', '_worker.js', 'deploy-version.txt', 'deploy-counter-version.txt', 'ai-disclosure.js']) {
    if (fs.existsSync(path.join(root, temp))) {
      report('WARNING', root, `임시·중복 파일 잔존: ${temp}`);
    }
  }

  for (const detailFile of project.detailFiles) {
    const source = read(path.join(root, detailFile));
    if (source && /document-footer|detail-footer/.test(source) && !source.includes('AI 활용 안내')) {
      report('ERROR', `${root}/${detailFile}`, '상세문서 footer 생성 코드에 AI 활용 안내 없음');
    }
  }
}

console.log(`\nArchitecture audit: ${errors} error(s), ${warnings} warning(s)`);
if (errors) process.exit(1);
