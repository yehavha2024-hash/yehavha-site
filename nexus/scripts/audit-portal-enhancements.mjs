import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
let errors = 0;

const exists = relative => fs.existsSync(path.join(ROOT, relative));
const read = relative => fs.readFileSync(path.join(ROOT, relative), 'utf8');
const json = relative => JSON.parse(read(relative));
const fail = (source, message) => {
  errors += 1;
  console.error(`ERROR ${source}: ${message}`);
};
const unique = values => new Set(values).size === values.length;
const isoDate = value => /^\d{4}-\d{2}-\d{2}$/.test(String(value || ''));

function auditPortalSources() {
  const projectsPath = 'nexus/projects.json';
  const statusPath = 'nexus/project-status.json';
  const registryPath = 'nexus/approved-manifests.json';
  for (const file of [projectsPath, statusPath, registryPath, 'nexus/portal-v2.js', 'nexus/portal-enhancements.css']) {
    if (!exists(file)) fail(file, '필수 파일 없음');
  }
  if (errors) return;

  const projects = json(projectsPath);
  const status = json(statusPath);
  const registry = json(registryPath);
  const categoryIds = new Set((projects.categories || []).map(item => item.id));
  const projectIds = (projects.projects || []).map(item => item.id);
  if (!unique(projectIds)) fail(projectsPath, '프로젝트 id 중복');
  for (const project of projects.projects || []) {
    if (!categoryIds.has(project.category)) fail(projectsPath, `${project.id} category 대상 없음: ${project.category}`);
    if (!project.title || !project.description || !project.url) fail(projectsPath, `${project.id} 표시정보 누락`);
  }

  const approved = Array.isArray(registry.manifests) ? registry.manifests : [];
  if (!unique(approved)) fail(registryPath, '승인 manifest 경로 중복');
  const approvedIds = new Set();
  const reviewById = new Map();
  for (const relative of approved) {
    if (!exists(relative)) {
      fail(registryPath, `승인 manifest 없음: ${relative}`);
      continue;
    }
    const manifest = json(relative);
    if (manifest.publish === false) continue;
    if (approvedIds.has(manifest.id)) fail(registryPath, `승인 manifest id 중복: ${manifest.id}`);
    approvedIds.add(manifest.id);
    const review = manifest.review || {};
    reviewById.set(manifest.id, review);
    if (review.contentReviewedAt && !isoDate(review.contentReviewedAt)) fail(relative, 'contentReviewedAt YYYY-MM-DD 형식 아님');
    if (review.baselineAt && !isoDate(review.baselineAt)) fail(relative, 'baselineAt YYYY-MM-DD 형식 아님');
    if (review.baselineAt && !review.baselineLabel) fail(relative, 'baselineAt이 있으나 baselineLabel 누락');
  }

  for (const id of Object.keys(status)) {
    if (!approvedIds.has(id)) fail(statusPath, `승인 manifest가 소유하지 않는 상태 id: ${id}`);
    const item = status[id];
    if (item.contentReviewedAt && !isoDate(item.contentReviewedAt)) fail(statusPath, `${id} contentReviewedAt 형식 오류`);
    if (item.baselineAt && !isoDate(item.baselineAt)) fail(statusPath, `${id} baselineAt 형식 오류`);
    const review = reviewById.get(id) || {};
    for (const key of ['contentReviewedAt', 'baselineAt', 'baselineLabel']) {
      const manifestValue = review[key] || null;
      const statusValue = item[key] || null;
      if (manifestValue !== statusValue) {
        fail(statusPath, `${id} ${key}가 승인 manifest와 불일치: manifest=${manifestValue ?? '-'} status=${statusValue ?? '-'}`);
      }
    }
  }

  for (const id of approvedIds) {
    if (!status[id]) fail(statusPath, `승인 manifest 상태 출력 누락: ${id}`);
  }

  for (const forbidden of ['nexus/search-index.json', 'nexus/projects.search.json', 'nexus/projects.generated.json']) {
    if (exists(forbidden)) fail(forbidden, '프로젝트/검색 정보를 중복 소유하는 파일 금지');
  }
}

function auditPortalRuntimeOwnership() {
  const portal = read('nexus/portal-v2.js');
  if (!portal.includes("fetchJson('./projects.json')")) fail('nexus/portal-v2.js', 'projects.json 단일 표시원본을 소비하지 않음');
  if (!portal.includes("fetchJson('./project-status.json')")) fail('nexus/portal-v2.js', 'project-status.json 상태원본을 소비하지 않음');
  if (!portal.includes('portal-enhancements.css')) fail('nexus/portal-v2.js', '보강 스타일 연결 누락');
  if (!portal.includes('Nexus 통합검색')) fail('nexus/portal-v2.js', '통합검색 UI 누락');
  if (!portal.includes('최근 업데이트')) fail('nexus/portal-v2.js', '최근 업데이트 UI 누락');
  if (!portal.includes('운영·검증 기준')) fail('nexus/portal-v2.js', '검증 레이어 UI 누락');
  if (!portal.includes('application/ld+json')) fail('nexus/portal-v2.js', '구조화 데이터 생성 누락');
}

function auditMetricsOwnership() {
  const helper = 'nexus/functions/lib/metrics.js';
  const access = 'nexus/functions/api/access.js';
  const go = 'nexus/functions/go.js';
  const middleware = 'nexus/functions/_middleware.js';
  for (const file of [helper, access, go, middleware]) if (!exists(file)) fail(file, '측정 런타임 파일 없음');
  if (errors) return;

  if (!read(access).includes("../lib/metrics.js")) fail(access, '공유 metrics helper를 사용하지 않음');
  if (!read(go).includes("./lib/metrics.js")) fail(go, '공유 metrics helper를 사용하지 않음');
  if (!read(middleware).includes("path === '/go'")) fail(middleware, '/go 리다이렉트가 접속횟수에서 제외되지 않음');
  const helperText = read(helper).toLowerCase();
  for (const forbidden of ['cf-connecting-ip', 'user-agent', 'referer', 'search_term', 'search_query']) {
    if (helperText.includes(forbidden)) fail(helper, `개인·검색 원문 수집 가능 필드 금지: ${forbidden}`);
  }
}

auditPortalSources();
auditPortalRuntimeOwnership();
auditMetricsOwnership();

console.log(`Nexus portal enhancement audit: ${errors} error(s)`);
if (errors) process.exit(1);
