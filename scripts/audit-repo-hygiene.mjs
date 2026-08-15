import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
let errors = 0;
let warnings = 0;

const exists = relative => fs.existsSync(path.join(ROOT, relative));
const read = relative => fs.readFileSync(path.join(ROOT, relative), 'utf8');
const json = relative => JSON.parse(read(relative));
const error = (source, message) => { errors += 1; console.error(`ERROR ${source}: ${message}`); };
const warn = (source, message) => { warnings += 1; console.warn(`WARNING ${source}: ${message}`); };

function auditForbiddenArtifacts() {
  const forbidden = [
    'legal-knowledge/RUNTIME_AUDIT_OUTPUT_20260809.json',
    'legal-knowledge/RUNTIME_AUDIT_PRIORITY_20260809.md',
    'toeic-human-100/contrast-fix-20260809.css',
    'nexus/ai-practice/runs/2026-08-12-P1-03.json',
    'nexus/ai-practice/runs/2026-08-12-P1-04.json',
    'nexus/ai-practice/runs/2026-08-12-P2-02.json',
    'nexus/ai-practice/deliverables/ebook-promo-yhwh-yeshua-30s.json',
    'nexus/ai-practice/deliverables/song-media-master-template.json',
    'nexus/ai-practice/deliverables/explainer-video-scripts-v1.json'
  ];
  for (const relative of forbidden) if (exists(relative)) error(relative, '정리 완료된 구버전·생성 산출물이 다시 추가됨');
}

function auditWorkflowPermissions() {
  const dir = path.join(ROOT, '.github/workflows');
  if (!fs.existsSync(dir)) return;
  const writeAllowlist = new Set([
    'refresh-nexus-status.yml',
    'toeic-master-lexicon-build.yml'
  ]);
  for (const file of fs.readdirSync(dir).filter(name => /\.ya?ml$/i.test(name))) {
    const source = fs.readFileSync(path.join(dir, file), 'utf8');
    const hasContentsWrite = /^\s*contents:\s*write\s*$/m.test(source);
    if (hasContentsWrite && !writeAllowlist.has(file)) error(`.github/workflows/${file}`, '저장소 쓰기 권한이 불필요하게 부여됨');
    if (!hasContentsWrite && !/^permissions:\s*\n(?:[ \t]+.*\n)*?[ \t]+contents:\s*read\s*$/m.test(source)) {
      warn(`.github/workflows/${file}`, 'contents: read 권한이 명시되지 않음');
    }
  }
}

function auditServiceWorkerAssets(project) {
  const swPath = `${project}/sw.js`;
  if (!exists(swPath)) return;
  const source = read(swPath);
  const quoted = [...source.matchAll(/["'](\.\/?[^"']+|[^"']+\.(?:html|css|js|json|webmanifest|png|webp|svg|ico))["']/g)]
    .map(match => match[1])
    .filter(value => !value.includes('${'));
  const assetBlock = source.match(/const\s+(?:ASSETS|ASSET_URLS)\s*=\s*\[([\s\S]*?)\];/);
  if (!assetBlock) return;
  const assets = [...assetBlock[1].matchAll(/["']([^"']+)["']/g)].map(match => match[1]);
  for (const asset of assets) {
    const clean = asset.split('?')[0].replace(/^\.\//, '');
    if (!clean || clean === '.') continue;
    const target = `${project}/${clean}`;
    if (!exists(target)) error(swPath, `precache 대상 파일 없음: ${asset}`);
  }
  if (project === 'three-minute-break') {
    const index = read(`${project}/index.html`);
    const runtimeScripts = [...index.matchAll(/<script\s+[^>]*src=["']([^"']+)["']/gi)]
      .map(match => match[1].split('?')[0].replace(/^\.\//, ''));
    for (const script of runtimeScripts) {
      if (!assets.some(asset => asset.replace(/^\.\//, '') === script)) error(swPath, `현재 index.html 실행 스크립트가 precache에서 누락됨: ${script}`);
    }
  }
  void quoted;
}

function auditAiPracticeIndex() {
  const source = 'nexus/ai-practice/run-index.json';
  if (!exists(source)) return error(source, '실행 인덱스 없음');
  const index = json(source);
  const listed = new Set(index.files || []);
  for (const relative of listed) {
    const target = `nexus/ai-practice/${relative}`;
    if (!exists(target)) error(source, `인덱스가 없는 파일을 참조함: ${relative}`);
  }

  const runDir = path.join(ROOT, 'nexus/ai-practice/runs');
  if (fs.existsSync(runDir)) {
    for (const file of fs.readdirSync(runDir).filter(name => name.endsWith('.json'))) {
      const relative = `runs/${file}`;
      if (!listed.has(relative)) error(source, `인덱스에 등록되지 않은 실행 JSON 잔존: ${relative}`);
    }
  }

  const deliverableRefs = new Set();
  const runFiles = [...listed].filter(relative => relative.endsWith('.json'));
  for (const relative of runFiles) {
    const target = `nexus/ai-practice/${relative}`;
    if (!exists(target)) continue;
    const text = read(target);
    for (const match of text.matchAll(/nexus\/ai-practice\/deliverables\/([^"'?#\s]+\.json)/g)) deliverableRefs.add(match[1]);
  }

  const deliverableDir = path.join(ROOT, 'nexus/ai-practice/deliverables');
  if (fs.existsSync(deliverableDir)) {
    for (const file of fs.readdirSync(deliverableDir).filter(name => name.endsWith('.json'))) {
      if (!deliverableRefs.has(file)) warn(`nexus/ai-practice/deliverables/${file}`, '현재 실행 인덱스에서 참조되지 않는 산출물');
    }
    for (const file of deliverableRefs) {
      if (!exists(`nexus/ai-practice/deliverables/${file}`)) error(source, `실행기록이 없는 산출물을 참조함: ${file}`);
    }
  }
}

function auditSingleSourceRules() {
  const forbidden = [
    ['nexus/projects.generated.json', 'Nexus 프로젝트 카드는 projects.json만 단일 원본으로 사용'],
    ['nexus/project-status.generated.json', 'Nexus 상태는 project-status.json만 사용']
  ];
  for (const [relative, message] of forbidden) if (exists(relative)) error(relative, message);

  const legalWorkflow = '.github/workflows/legal-knowledge-runtime-audit.yml';
  if (exists(legalWorkflow) && /git\s+(?:add|commit|push)/.test(read(legalWorkflow))) {
    error(legalWorkflow, '진단 워크플로가 생성물을 저장소에 다시 쓰고 있음');
  }
}

auditForbiddenArtifacts();
auditWorkflowPermissions();
auditServiceWorkerAssets('three-minute-break');
auditServiceWorkerAssets('toeic-human-100');
auditAiPracticeIndex();
auditSingleSourceRules();

console.log(`Repository hygiene audit: ${errors} error(s), ${warnings} warning(s)`);
if (errors) process.exit(1);
