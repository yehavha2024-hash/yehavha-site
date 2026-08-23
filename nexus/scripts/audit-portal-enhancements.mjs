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
const STATUS_KEYS = new Set([
  'id','managedBy','status','statusTone','lastUpdated','contentCount','contentLabel',
  'contentReviewedAt','baselineAt','baselineLabel'
]);
const CONTENT_KEYS = new Set([
  'title','description','url','category','meta','actionLabel','external','researchGroup','eyebrow','icon','iconClass'
]);

function auditPortalSources() {
  const projectsPath = 'nexus/projects.json';
  const statusPath = 'nexus/project-status.json';
  const registryPath = 'nexus/approved-manifests.json';
  for (const file of [projectsPath, statusPath, registryPath, 'nexus/portal-v2.js', 'nexus/portal-v2.css', 'nexus/nexus-standard.css']) {
    if (!exists(file)) fail(file, '필수 파일 없음');
  }
  for (const retired of ['nexus/portal-enhancements.css', 'nexus/status.css']) {
    if (exists(retired)) fail(retired, '폐기된 전역 override 레이어가 다시 존재함');
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
    for (const key of Object.keys(item || {})) {
      if (CONTENT_KEYS.has(key)) fail(statusPath, `${id}: 표시 콘텐츠 필드 '${key}'는 projects.json만 소유할 수 있음`);
      if (!STATUS_KEYS.has(key)) fail(statusPath, `${id}: 허용되지 않은 상태 필드 '${key}'`);
    }
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
  const shell = read('nexus/portal-v2.css');
  const mainTheme = read('nexus/nexus-standard.css');
  const index = read('nexus/index.html');

  if (!portal.includes("fetchJson('./projects.json')")) fail('nexus/portal-v2.js', 'projects.json 단일 표시원본을 소비하지 않음');
  if (!portal.includes("fetchJson('./project-status.json')")) fail('nexus/portal-v2.js', 'project-status.json 상태원본을 소비하지 않음');
  if (portal.includes('portal-enhancements.css') || portal.includes('status.css')) fail('nexus/portal-v2.js', '폐기된 스타일 레이어 동적 연결이 남아 있음');
  if (!portal.includes('Nexus 통합검색')) fail('nexus/portal-v2.js', '통합검색 UI 누락');
  if (!portal.includes('최근 업데이트')) fail('nexus/portal-v2.js', '최근 업데이트 UI 누락');
  if (!portal.includes('운영·검증 기준')) fail('nexus/portal-v2.js', '검증 레이어 UI 누락');
  if (!portal.includes('application/ld+json')) fail('nexus/portal-v2.js', '구조화 데이터 생성 누락');
  if (!portal.includes("const KOREA_TIME_ZONE = 'Asia/Seoul'")) fail('nexus/portal-v2.js', 'KST 시간 원본 누락');
  if (!portal.includes("const COUNTER_ENDPOINT = '/api/access'")) fail('nexus/portal-v2.js', '방문자수 API 원본 누락');

  for (const marker of ['portal-brand', 'portal-runtime', 'portal-mark', 'accessCount', 'portalGrid']) {
    if (!index.includes(marker)) fail('nexus/index.html', `메인 런타임 DOM 누락: ${marker}`);
  }
  if (/\.portal-mark[^{}]*\{[^}]*font-size\s*:\s*0/i.test(mainTheme)) fail('nexus/nexus-standard.css', 'KST 텍스트를 숨기는 font-size:0 규칙 금지');
  if (/\.portal-mark[^{}]*::(?:before|after)[^{]*\{[^}]*content\s*:/is.test(mainTheme)) fail('nexus/nexus-standard.css', 'KST 문자열을 CSS content로 대체하는 규칙 금지');
  if (/\.portal-tier-[^{]+\{[^}]*\border\s*:/is.test(mainTheme)) fail('nexus/nexus-standard.css', '목록 순서를 CSS order가 소유하면 안 됨');
  if (/\.main[^{}]*\{[^}]*display\s*:\s*none/is.test(shell)) fail('nexus/portal-v2.css', '공통 shell이 본문을 숨기면 안 됨');
}

function auditContentSurfaces() {
  const expectations = [
    ['nexus/articles/index.html', ['id="articleArchive"','id="sectionCount"','id="articleCount"','id="topicGrid"','id="articleGrid"','./articles.js']],
    ['nexus/articles/article.html', ['id="readerCard"','id="articleBody"','id="articleToc"','id="relatedArticles"','./articles.js']],
    ['nexus/ai-trends/index.html', ['id="radarGrid"','id="scopeGrid"','id="filterRow"','id="briefFeed"']],
    ['nexus/intelligence-briefing/index.html', ['id="executiveSummary"','id="briefFeed"','id="archiveList"']],
    ['nexus/publishing/index.html', ['id="top"']],
    ['nexus/initiatives/index.html', ['id="top"']]
  ];

  for (const [file, markers] of expectations) {
    if (!exists(file)) {
      fail(file, '핵심 화면 파일 없음');
      continue;
    }
    const source = read(file);
    for (const marker of markers) if (!source.includes(marker)) fail(file, `색상 변경 전 핵심 구조 누락: ${marker}`);
  }

  const articleData = json('nexus/articles/articles.json');
  if ((articleData.sections || []).length < 5) fail('nexus/articles/articles.json', '글 아카이브 주제 분류가 5개 미만으로 회귀');
  if ((articleData.articles || []).length < 20) fail('nexus/articles/articles.json', '글 아카이브 항목 수가 비정상적으로 감소');

  const trendData = json('nexus/ai-trends/data.json');
  if (!Array.isArray(trendData.items) || !trendData.items.length) fail('nexus/ai-trends/data.json', 'AI 동향 데이터가 비어 있음');

  const briefing = json('nexus/intelligence-briefing/latest.json');
  if (!Array.isArray(briefing.items) || !briefing.items.length) fail('nexus/intelligence-briefing/latest.json', '전략 브리핑 핵심정보가 비어 있음');
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

function auditSeoOwnership() {
  const livingLaw = 'nexus/living-law/index.html';
  const archive = 'nexus/articles/index.html';
  const reader = 'nexus/articles/article.html';
  const articleSeo = 'nexus/articles/article-seo.js';
  for (const file of [livingLaw, archive, reader, articleSeo]) {
    if (!exists(file)) fail(file, 'SEO 필수 파일 없음');
  }
  if (errors) return;

  if (!read(livingLaw).includes('rel="canonical" href="https://yehavha-nexus-hub.pages.dev/living-law/"')) fail(livingLaw, '생활법률 canonical 누락');
  if (!read(livingLaw).includes('"@type":"WebApplication"')) fail(livingLaw, '생활법률 WebApplication 구조화 데이터 누락');
  if (!read(archive).includes('rel="canonical" href="https://yehavha-nexus-hub.pages.dev/articles/"')) fail(archive, '글 아카이브 canonical 누락');
  if (!read(archive).includes('"@type":"CollectionPage"')) fail(archive, '글 아카이브 CollectionPage 구조화 데이터 누락');
  if (!read(reader).includes('./article-seo.js')) fail(reader, '개별 글 동적 SEO 스크립트 연결 누락');

  const seo = read(articleSeo);
  if (!seo.includes("fetch('./articles.json'")) fail(articleSeo, 'articles.json 원본을 소비하지 않음');
  if (!seo.includes("'ScholarlyArticle'")) fail(articleSeo, 'AI 법 연구글 ScholarlyArticle 타입 누락');
  if (!seo.includes("'Article'")) fail(articleSeo, '일반 글 Article 타입 누락');
  if (/const\s+articles\s*=\s*\[/.test(seo)) fail(articleSeo, '글 목록을 SEO 스크립트가 중복 소유함');
}

auditPortalSources();
auditPortalRuntimeOwnership();
auditContentSurfaces();
auditMetricsOwnership();
auditSeoOwnership();

console.log(`Nexus structural ownership audit: ${errors} error(s)`);
if (errors) process.exit(1);
