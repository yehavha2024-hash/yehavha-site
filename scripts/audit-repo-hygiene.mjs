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
    'toeic-human-100/reading-content-v2-length-patch.js',
    'toeic-human-100/teps-extension-length-patch.js',
    'toeic-human-100/reading-content-v2-generated-compact-patch.js',
    'toeic-human-100/reading-final-compact.js',
    'toeic-human-100/reading-content-v2-ready-rerender.js',
    'toeic-human-100/focused-reading-ui-patch.js',
    'toeic-human-100/scripts/validate-reading-v2.mjs',
    'toeic-human-100/V2_STATUS_20260809.md',
    'toeic-human-100/V2_FINAL_STATUS_20260809.md',
    'toeic-human-100/READING_PROGRAM_V2.md',
    'toeic-human-100/COVERAGE_CORRECTION_SYSTEM.md',
    'nexus/ai-practice',
    'nexus/initiatives'
  ];
  for (const relative of forbidden) {
    if (exists(relative)) error(relative, '정리 완료된 구버전·삭제 프로젝트가 다시 추가됨');
  }
}

function auditWorkflowPermissions() {
  const dir = path.join(ROOT, '.github/workflows');
  if (!fs.existsSync(dir)) return;

  // Repository write access is exceptional. Each approved writer owns only the
  // generated data paths listed here; UI shell/CSS/HTML are never workflow outputs.
  const writePolicies = new Map([
    ['refresh-nexus-status.yml', {
      required: ['git add nexus/project-status.json nexus/sitemap.xml'],
      allowedPathTokens: ['nexus/project-status.json', 'nexus/sitemap.xml']
    }],
    ['refresh-investment-strategy.yml', {
      required: ['git add nexus/investment-strategy/index.html'],
      allowedPathTokens: ['nexus/investment-strategy/index.html']
    }],
    ['toeic-master-lexicon-build.yml', {
      required: ['git add toeic-human-100/master-lexicon-v2.json'],
      allowedPathTokens: ['toeic-human-100/master-lexicon-v2.json']
    }],
    ['intelligence-briefing-archive.yml', {
      required: ['git add -- nexus/intelligence-briefing/archive nexus/intelligence-briefing/archive-index.json'],
      allowedPathTokens: ['nexus/intelligence-briefing/archive', 'nexus/intelligence-briefing/archive-index.json']
    }],
    ['refresh-legal-intelligence.yml', {
      required: ['git add nexus/legal-intelligence/legislation.json'],
      allowedPathTokens: ['nexus/legal-intelligence/legislation.json']
    }],
    ['refresh-legal-materials.yml', {
      required: ['git add nexus/legal-intelligence/legal-materials.json'],
      allowedPathTokens: ['nexus/legal-intelligence/legal-materials.json']
    }],
    ['refresh-legal-people.yml', {
      required: ['git add nexus/legal-intelligence/legal-people.json'],
      allowedPathTokens: ['nexus/legal-intelligence/legal-people.json']
    }]
  ]);

  for (const file of fs.readdirSync(dir).filter(name => /\.ya?ml$/i.test(name))) {
    const source = fs.readFileSync(path.join(dir, file), 'utf8');
    const hasContentsWrite = /^\s*contents:\s*write\s*$/m.test(source);
    const policy = writePolicies.get(file);

    if (hasContentsWrite && !policy) {
      error(`.github/workflows/${file}`, '저장소 쓰기 권한이 불필요하게 부여됨');
      continue;
    }
    if (!hasContentsWrite && !/^permissions:\s*\n(?:[ \t]+.*\n)*?[ \t]+contents:\s*read\s*$/m.test(source)) {
      warn(`.github/workflows/${file}`, 'contents: read 권한이 명시되지 않음');
    }
    if (!hasContentsWrite || !policy) continue;

    for (const token of policy.required) {
      if (!source.includes(token)) error(`.github/workflows/${file}`, `승인된 write 대상 명령 누락: ${token}`);
    }
    if (/git\s+add\s+(?:-A|--all|\.)\b/.test(source) || /git\s+commit\s+-a\b/.test(source) || /git\s+push\s+[^\n]*(?:--force|-f)\b/.test(source)) {
      error(`.github/workflows/${file}`, 'write workflow가 광범위 add/commit 또는 force push를 사용함');
    }

    for (const match of source.matchAll(/git\s+add\s+(?:--\s+)?([^\n]+)/g)) {
      const addArgs = match[1].trim();
      const tokens = addArgs.split(/\s+/).filter(Boolean);
      for (const token of tokens) {
        if (token.startsWith('-')) continue;
        if (!policy.allowedPathTokens.some(allowed => token === allowed)) {
          error(`.github/workflows/${file}`, `승인 범위를 벗어난 git add 대상: ${token}`);
        }
      }
    }
  }
}

function auditServiceWorkerAssets(project) {
  const swPath = `${project}/sw.js`;
  const indexPath = `${project}/index.html`;
  if (!exists(swPath)) return;
  const source = read(swPath);
  const assetBlock = source.match(/const\s+(?:ASSETS|ASSET_URLS)\s*=\s*\[([\s\S]*?)\];/);
  if (!assetBlock) return error(swPath, 'precache 자산 배열을 확인할 수 없음');
  const assets = [...assetBlock[1].matchAll(/["']([^"']+)["']/g)].map(match => match[1]);
  const normalizedAssets = new Set(assets.map(asset => asset.split('?')[0].replace(/^\.\//, '')));

  for (const asset of assets) {
    const clean = asset.split('?')[0].replace(/^\.\//, '');
    if (!clean || clean === '.') continue;
    const target = `${project}/${clean}`;
    if (!exists(target)) error(swPath, `precache 대상 파일 없음: ${asset}`);
  }

  if (exists(indexPath)) {
    const index = read(indexPath);
    const runtimeScripts = [...index.matchAll(/<script\s+[^>]*src=["']([^"']+)["']/gi)]
      .map(match => match[1].split('?')[0].replace(/^\.\//, ''))
      .filter(script => script && !/^https?:\/\//i.test(script));
    for (const script of runtimeScripts) {
      if (!normalizedAssets.has(script)) error(swPath, `현재 index.html 실행 스크립트가 precache에서 누락됨: ${script}`);
    }
  }
}

function auditToeicCanonicalOwnership() {
  const source = 'toeic-human-100/index.html';
  if (!exists(source)) return;
  const index = read(source);
  const canonical = [
    'reading-content-v2-days01-10-enrichment.js',
    'teps-extension-enrichment.js',
    'reading-content-v2-generated-study-plan.js',
    'reading-length-normalizer.js',
    'reading-ready-sync.js',
    'focused-reading-ui.js'
  ];
  for (const file of canonical) {
    if (!exists(`toeic-human-100/${file}`)) error(source, `canonical 런타임 파일 없음: ${file}`);
    if (!index.includes(file)) error(source, `canonical 런타임 파일이 index.html 로드순서에서 누락됨: ${file}`);
  }

  const loader = 'toeic-human-100/scripts/runtime-v2-loader.mjs';
  if (!exists(loader)) error(loader, '검증 런타임 단일 로더 없음');
  else {
    const loaderSource = read(loader);
    for (const file of canonical.slice(0, 4)) {
      if (!loaderSource.includes(file)) error(loader, `브라우저 canonical 데이터 모듈과 검증 로더가 불일치: ${file}`);
    }
  }

  const normalizer = 'toeic-human-100/reading-length-normalizer.js';
  if (exists(normalizer) && !read(normalizer).includes("lengthOwner = 'reading-length-normalizer'")) {
    error(normalizer, '최종 본문 길이 소유권 표식 없음');
  }
}

function auditSingleSourceRules() {
  const forbidden = [
    ['nexus/projects.generated.json', 'Nexus 프로젝트 카드는 projects.json만 단일 원본으로 사용'],
    ['nexus/project-status.generated.json', 'Nexus 상태는 project-status.json만 사용']
  ];
  for (const [relative, message] of forbidden) if (exists(relative)) error(relative, message);

  const registryPath = 'nexus/approved-manifests.json';
  if (!exists(registryPath)) {
    error(registryPath, '승인 manifest 단일 레지스트리 없음');
  } else {
    try {
      const manifests = json(registryPath)?.manifests;
      if (!Array.isArray(manifests) || !manifests.length) error(registryPath, '승인 manifest 목록이 비어 있거나 형식이 잘못됨');
      else {
        if (new Set(manifests).size !== manifests.length) error(registryPath, '승인 manifest 경로 중복');
        for (const relative of manifests) if (!exists(relative)) error(registryPath, `승인 manifest 대상 없음: ${relative}`);
      }
    } catch (cause) {
      error(registryPath, `JSON 파싱 실패: ${cause.message}`);
    }
  }

  const registryConsumers = [
    'nexus/scripts/update-status.mjs',
    'scripts/audit-web-architecture.mjs',
    'nexus/scripts/audit-runtime.mjs'
  ];
  for (const relative of registryConsumers) {
    if (!exists(relative)) continue;
    if (!read(relative).includes('approved-manifests.json')) {
      error(relative, '승인 manifest 목록을 독자 소유함. approved-manifests.json을 사용해야 함');
    }
  }
  if (exists('nexus/scripts/update-status.mjs') && /const\s+MANIFEST_FILES\s*=\s*\[/.test(read('nexus/scripts/update-status.mjs'))) {
    error('nexus/scripts/update-status.mjs', '승인 manifest 경로를 하드코딩함');
  }
  if (exists('scripts/audit-web-architecture.mjs') && /const\s+manifestFiles\s*=\s*\[/.test(read('scripts/audit-web-architecture.mjs'))) {
    error('scripts/audit-web-architecture.mjs', '승인 manifest 경로를 하드코딩함');
  }

  for (const relative of ['README.md', 'nexus/README.md']) {
    if (exists(relative) && read(relative).includes('nexus/research-groups.css')) {
      error(relative, '삭제된 research-groups.css 경로가 문서에 잔존');
    }
  }

  const headers = 'nexus/_headers';
  if (exists(headers)) {
    const source = read(headers);
    for (const retired of ['/ai-governance/*', '/ai-service-operations/*', '/research-groups.css', '/initiatives/*']) {
      if (source.includes(retired)) error(headers, `삭제된 경로의 캐시 규칙 잔존: ${retired}`);
    }
  }

  const retiredIdeaHubRefs = [
    ['nexus/projects.json', ['"id":"initiatives"', '"id":"initiative-hub"', '/initiatives/']],
    ['nexus/portal-v2.js', ["id: 'ideas'", "categoryIds: ['initiatives']", "project.category === 'initiatives'"]],
    ['nexus/nexus-standard.css', ['.portal-tier-ideas']]
  ];
  for (const [relative, markers] of retiredIdeaHubRefs) {
    if (!exists(relative)) continue;
    const source = read(relative);
    for (const marker of markers) {
      if (source.includes(marker)) error(relative, `삭제된 아이디어 허브 참조 잔존: ${marker}`);
    }
  }

  const compactCss = 'nexus/layer-compact.css';
  if (exists(compactCss)) {
    const source = read(compactCss);
    if (/\.footer::after/.test(source) || source.includes('Copyright © 이명훈 2026. All rights reserved.')) {
      error(compactCss, 'Copyright를 CSS 가상요소가 소유함. 저작권 문구는 HTML footer가 명시적으로 소유해야 함');
    }
  }

  const legalWorkflow = '.github/workflows/legal-knowledge-runtime-audit.yml';
  if (exists(legalWorkflow) && /git\s+(?:add|commit|push)/.test(read(legalWorkflow))) {
    error(legalWorkflow, '진단 워크플로가 생성물을 저장소에 다시 쓰고 있음');
  }
}

function auditStandardsDrift() {
  const webStandard = 'WEB_PROJECT_STANDARD.md';
  const copyrightStandard = 'COPYRIGHT_STANDARD.md';
  const architectureWorkflow = '.github/workflows/web-architecture-audit.yml';

  if (exists(webStandard)) {
    const source = read(webStandard);
    for (const token of [
      '한 기능에 한 소유자',
      '사이트 Footer를 소유하는 파일을 정확히 1개',
      '`pull_request`와 `main` push에서 자동 실행',
      '자동 workflow는 자신이 명시적으로 소유하는 데이터·산출물만 수정'
    ]) {
      if (!source.includes(token)) error(webStandard, `최신 구조 규격 누락: ${token}`);
    }
    if (/수동 실행을 유지합니다/.test(source)) error(webStandard, '폐기된 수동-only 감사 정책이 다시 들어옴');
  }

  if (exists(copyrightStandard)) {
    const source = read(copyrightStandard);
    for (const token of ['단일 소유권 원칙', '정확히 1개', '캐시·배포 원칙', '자동 회귀 방지']) {
      if (!source.includes(token)) error(copyrightStandard, `Footer 최신 규격 누락: ${token}`);
    }
  }

  if (exists(architectureWorkflow)) {
    const source = read(architectureWorkflow);
    if (!/pull_request:/.test(source)) error(architectureWorkflow, 'PR 구조 감사 트리거 누락');
    if (!/push:\s*\n\s*branches:\s*\n\s*- main/m.test(source)) error(architectureWorkflow, 'main push 구조 감사 트리거 누락');
    if (!source.includes('node scripts/audit-business-footer.mjs')) error(architectureWorkflow, 'Footer canonical 감사 실행 누락');
    if (!source.includes('node scripts/audit-repo-hygiene.mjs')) error(architectureWorkflow, '저장소 위생 감사 실행 누락');
    if (!source.includes('node scripts/audit-style-ownership.mjs')) error(architectureWorkflow, 'CSS 소유권 감사 실행 누락');
  }
}

auditForbiddenArtifacts();
auditWorkflowPermissions();
auditServiceWorkerAssets('three-minute-break');
auditServiceWorkerAssets('toeic-human-100');
auditToeicCanonicalOwnership();
auditSingleSourceRules();
auditStandardsDrift();

console.log(`Repository hygiene audit: ${errors} error(s), ${warnings} warning(s)`);
if (errors) process.exit(1);
