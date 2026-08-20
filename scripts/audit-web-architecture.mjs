import fs from 'node:fs';
import path from 'node:path';

const projects = [
  { dir: 'ai-law-tech-foresight', detailFiles: ['app.js', 'research-document-standard.js'] },
  { dir: 'legal-philosophy', detailFiles: ['app.js'] },
  { dir: 'legal-knowledge', detailFiles: ['research-document-standard.js'] },
  { dir: 'legal-knowledge/legal-mind', detailFiles: [] },
  { dir: 'legal-knowledge/ai-literature', detailFiles: [] },
  { dir: 'three-minute-break', detailFiles: [] },
  { dir: 'toeic-human-100', detailFiles: [] },
  { dir: 'nexus', detailFiles: [] },
  { dir: 'nexus/research-track', detailFiles: [] },
];

const nexusRuntimePages = [
  'nexus/intelligence-briefing',
  'nexus/university',
  'nexus/living-law',
  'nexus/toeic-human-v2',
  'nexus/research-track',
  'nexus/ai-legal-glossary',
  'nexus/publishing',
  'nexus/articles',
  'nexus/ai-trends',
  'nexus/ai-music-archive',
  'nexus/education-hub',
  'nexus/initiatives'
];

const nexusDetailPages = [
  'nexus/publishing/detail.html',
  'nexus/articles/article.html',
  'nexus/university/course.html',
  'nexus/university/quality-audit.html'
];

const nexusJsonFiles = [
  'nexus/projects.json',
  'nexus/project-status.json',
  'nexus/approved-manifests.json',
  'nexus/intelligence-briefing/latest.json',
  'nexus/intelligence-briefing/archive-index.json',
  'nexus/publishing/books.json',
  'nexus/articles/articles.json',
  'nexus/ai-trends/data.json',
  'nexus/initiatives/data.json'
];

const retiredNexusPaths = [
  'nexus/ai-practice',
  'nexus/ai-governance',
  'nexus/ai-service-operations'
];

const COPYRIGHT_STANDARD = 'Copyright © 이명훈 2026. All rights reserved.';

let errors = 0;
let warnings = 0;

const read = p => fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
const annotationPath = project => {
  try {
    if (fs.existsSync(project) && fs.statSync(project).isFile()) return project;
  } catch {}
  const index = path.join(project, 'index.html');
  return fs.existsSync(index) ? index : project;
};
const escapeWorkflow = value => String(value).replaceAll('%', '%25').replaceAll('\r', '%0D').replaceAll('\n', '%0A');
const report = (kind, project, message) => {
  console.log(`${kind} ${project}: ${message}`);
  const command = kind === 'ERROR' ? 'error' : 'warning';
  console.log(`::${command} file=${annotationPath(project)}::${escapeWorkflow(message)}`);
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

const auditLocalReferences = (root, index) => {
  const refs = [...index.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)].map(match => match[1]);
  const seen = new Set();
  for (const ref of refs) {
    if (!ref || ref.startsWith('#') || /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(ref)) continue;
    const clean = ref.split('#')[0].split('?')[0];
    if (!clean) continue;
    if (seen.has(clean) && /\.(?:js|css)$/i.test(clean)) {
      report('WARNING', root, `동일 로컬 자산 중복 참조: ${clean}`);
    }
    seen.add(clean);
    const target = clean.startsWith('/')
      ? path.join('nexus', clean.replace(/^\/+/, ''))
      : path.resolve(root, clean);
    if (!fs.existsSync(target)) report('ERROR', root, `로컬 링크 대상 없음: ${ref}`);
  }
};

const auditFooterStandard = file => {
  if (!fs.existsSync(file)) return report('ERROR', file, 'footer 감사 대상 HTML 없음');
  const html = read(file);
  if (!html.includes(COPYRIGHT_STANDARD)) {
    report('ERROR', file, `표준 Copyright 문구 누락 또는 순서 오류: ${COPYRIGHT_STANDARD}`);
  }
  if (/Copyright ©\s*2026\s*이명훈/.test(html)) {
    report('ERROR', file, '구버전 Copyright 순서(2026 이명훈)가 잔존');
  }
  if (!html.includes('mailto:kimbrighth@gmail.com')) report('ERROR', file, '표준 문의 mailto 누락');
  if (!html.includes('AI 활용 안내')) report('ERROR', file, 'AI 활용 안내 누락');
  if (/\.footer::after/.test(html)) report('ERROR', file, 'HTML 안에 footer 가상요소 소유 흔적이 있음');
};

const auditNexusRuntimePages = () => {
  for (const retired of retiredNexusPaths) {
    if (fs.existsSync(retired)) report('ERROR', retired, '삭제된 Nexus 프로젝트 경로가 다시 존재함');
  }

  for (const root of nexusRuntimePages) {
    const indexPath = path.join(root, 'index.html');
    const index = read(indexPath);
    if (!index) {
      report('ERROR', root, 'index.html 없음');
      continue;
    }
    auditAnchors(root, index);
    auditLocalReferences(root, index);
    auditFooterStandard(indexPath);
  }

  auditFooterStandard('nexus/index.html');
  for (const file of nexusDetailPages) auditFooterStandard(file);

  for (const file of nexusJsonFiles) {
    if (!fs.existsSync(file)) {
      report('ERROR', file, '필수 JSON 없음');
      continue;
    }
    try { JSON.parse(read(file)); }
    catch (error) { report('ERROR', file, `JSON 파싱 실패: ${error.message}`); }
  }
};

const auditNexusModel = () => {
  const root = 'nexus';
  const basePath = path.join(root, 'projects.json');
  const statusPath = path.join(root, 'project-status.json');
  const registryPath = path.join(root, 'approved-manifests.json');
  const generatedPath = path.join(root, 'projects.generated.json');
  const portalPath = path.join(root, 'portal-v2.js');
  const redirectPath = path.join(root, 'functions/go.js');

  if (fs.existsSync(generatedPath)) report('ERROR', generatedPath, 'projects.generated.json은 단일원본 원칙에 따라 존재하면 안 됨');
  if (!fs.existsSync(basePath)) return report('ERROR', root, 'projects.json 없음');
  if (!fs.existsSync(statusPath)) return report('ERROR', root, 'project-status.json 없음');
  if (!fs.existsSync(registryPath)) return report('ERROR', root, 'approved-manifests.json 없음');
  if (!fs.existsSync(redirectPath)) return report('ERROR', root, 'functions/go.js 없음');

  let base;
  let status;
  let registry;
  try { base = JSON.parse(read(basePath)); }
  catch { return report('ERROR', basePath, 'projects.json JSON 파싱 실패'); }
  try { status = JSON.parse(read(statusPath)); }
  catch { return report('ERROR', statusPath, 'project-status.json JSON 파싱 실패'); }
  try { registry = JSON.parse(read(registryPath)); }
  catch { return report('ERROR', registryPath, 'approved-manifests.json JSON 파싱 실패'); }

  const manifestFiles = Array.isArray(registry?.manifests) ? registry.manifests : [];
  if (!manifestFiles.length) report('ERROR', registryPath, '승인 manifest 목록이 비어 있음');
  if (new Set(manifestFiles).size !== manifestFiles.length) report('ERROR', registryPath, '승인 manifest 경로 중복');

  const redirectSource = read(redirectPath);
  const allowedHosts = new Set(
    [...redirectSource.matchAll(/['"]([a-z0-9.-]+\.[a-z]{2,})['"]/gi)].map(match => match[1].toLowerCase())
  );
  if (!allowedHosts.size) report('ERROR', redirectPath, '리다이렉트 허용 호스트를 확인할 수 없음');

  const categories = new Set((base.categories || []).map(item => item.id));
  const projectIds = new Set();
  const urls = new Set();
  for (const project of base.projects || []) {
    if (!project?.id || !project?.title || !project?.url) report('ERROR', basePath, '필수 카드 필드(id/title/url) 누락');
    if (projectIds.has(project.id)) report('ERROR', basePath, `중복 프로젝트 id: ${project.id}`);
    projectIds.add(project.id);
    if (!categories.has(project.category)) report('ERROR', basePath, `알 수 없는 카테고리: ${project.category}`);
    if (!/^https?:\/\//i.test(project.url || '')) {
      report('ERROR', basePath, `잘못된 프로젝트 URL: ${project.id}`);
    } else {
      try {
        const projectUrl = new URL(project.url);
        if (projectUrl.protocol !== 'https:') report('ERROR', basePath, `HTTPS가 아닌 프로젝트 URL: ${project.id}`);
        if (!allowedHosts.has(projectUrl.hostname.toLowerCase())) {
          report('ERROR', redirectPath, `projects.json의 호스트가 /go 허용목록에 없음: ${project.id} → ${projectUrl.hostname}`);
        }
        if (projectUrl.hostname === 'yehavha-nexus-hub.pages.dev') {
          const cleanPath = decodeURIComponent(projectUrl.pathname).replace(/^\/+|\/+$/g, '');
          const localRoot = cleanPath ? path.join('nexus', cleanPath) : 'nexus';
          const localTarget = path.extname(localRoot) ? localRoot : path.join(localRoot, 'index.html');
          if (!fs.existsSync(localTarget)) report('ERROR', basePath, `Nexus 내부 URL의 로컬 대상 없음: ${project.id} → ${localTarget}`);
        }
      } catch {
        report('ERROR', basePath, `URL 파싱 실패: ${project.id}`);
      }
    }
    if (urls.has(project.url)) report('WARNING', basePath, `동일 URL을 공유하는 카드 존재: ${project.url}`);
    urls.add(project.url);
  }

  const manifestIds = new Set();
  for (const relative of manifestFiles) {
    if (!fs.existsSync(relative)) {
      report('ERROR', relative, '승인 Nexus manifest 없음');
      continue;
    }
    let manifest;
    try { manifest = JSON.parse(read(relative)); }
    catch { report('ERROR', relative, 'manifest JSON 파싱 실패'); continue; }
    if (!manifest.id) report('ERROR', relative, 'manifest id 누락');
    if (manifest.project) report('ERROR', relative, 'manifest에 카드 표시정보(project)가 중복 저장됨');
    if (manifestIds.has(manifest.id)) report('ERROR', relative, `중복 manifest id: ${manifest.id}`);
    manifestIds.add(manifest.id);
    if (!projectIds.has(manifest.id)) report('ERROR', relative, `projects.json에 없는 manifest id: ${manifest.id}`);
  }

  for (const id of Object.keys(status || {})) {
    if (!projectIds.has(id)) report('ERROR', statusPath, `projects.json에 없는 상태 id: ${id}`);
    if (!manifestIds.has(id)) report('ERROR', statusPath, `승인 manifest가 없는 상태 id: ${id}`);
  }
  for (const id of manifestIds) {
    if (!(id in (status || {}))) report('ERROR', statusPath, `상태 정보가 없는 승인 manifest id: ${id}`);
  }

  const portal = read(portalPath);
  if (/projects\.generated\.json/.test(portal)) {
    report('ERROR', portalPath, 'portal-v2.js가 제거된 projects.generated.json을 참조함');
  }
  if (/\bpractice\b|ai-practice/.test(portal)) {
    report('ERROR', portalPath, '삭제된 AI 실무·아이디어 분류 또는 경로 참조가 portal-v2.js에 잔존');
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
  auditLocalReferences(root, index);

  for (const file of fs.readdirSync(root)) {
    if (!file.endsWith('.js')) continue;
    const full = path.join(root, file);
    const source = read(full);

    if (/new\s+MutationObserver[\s\S]{0,400}document\.(documentElement|body)/.test(source)) {
      report('ERROR', full, '페이지 전체 MutationObserver 사용');
    }
    if (/createElement\(['"]style['"]\)/.test(source)) {
      report('WARNING', full, '런타임 style 생성 발견');
    }
    if (/site-footer[\s\S]{0,250}\.innerHTML|\.innerHTML[\s\S]{0,250}site-footer/.test(source)) {
      report('ERROR', full, 'JavaScript가 메인 footer를 다시 생성할 가능성');
    }
  }

  const configPath = path.join(root, 'config.js');
  if (fs.existsSync(configPath)) {
    const config = read(configPath);
    if (/\bdocument\.|createElement\(|addEventListener\(|innerHTML/.test(config)) {
      report('ERROR', configPath, 'config.js에 DOM/동작 코드 존재');
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

auditNexusRuntimePages();
auditNexusModel();

console.log(`\nArchitecture audit: ${errors} error(s), ${warnings} warning(s)`);
if (errors) process.exit(1);
