import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();
let errors = 0;
const exists = file => fs.existsSync(path.join(ROOT, file));
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const json = file => JSON.parse(read(file));
const fail = (file, message) => {
  errors += 1;
  console.error(`ERROR ${file}: ${message}`);
};
const isoDate = value => !value || /^\d{4}-\d{2}-\d{2}$/.test(String(value));

function requireFiles(files) {
  for (const file of files) if (!exists(file)) fail(file, '필수 파일 없음');
}

async function auditAccessCounter() {
  const file = 'nexus/functions/lib/access-counter.js';
  if (!exists(file)) return;

  let count = 3;
  let today = 2;
  const statements = [];
  const database = {
    prepare(sql) {
      const statement = sql.replace(/\s+/g, ' ').trim();
      statements.push(statement);
      return {
        async run() {
          if (statement.startsWith('UPDATE nexus_access_counter')) count += 1;
          if (statement.startsWith('INSERT INTO nexus_daily_access')) today += 1;
          return { success: true };
        },
        async first() {
          return statement.includes('AS count') && statement.includes('AS today')
            ? { count, today }
            : null;
        }
      };
    },
    async batch(batchStatements) {
      return Promise.all(batchStatements.map(statement => statement.run()));
    }
  };

  try {
    const counter = await import('../functions/lib/access-counter.js');
    const [initial, concurrent] = await Promise.all([
      counter.readAccessStats(database),
      counter.readAccessStats(database)
    ]);
    await counter.incrementAccessCount(database);
    const updated = await counter.readAccessStats(database);
    if (
      initial?.count !== 3 || initial?.today !== 2 ||
      concurrent?.count !== 3 || concurrent?.today !== 2 ||
      updated?.count !== 4 || updated?.today !== 3
    ) {
      fail(
        file,
        `읽기·증가 결과 불일치: ${JSON.stringify(initial)}/${JSON.stringify(concurrent)} → ${JSON.stringify(updated)}`
      );
    }
    const accessSchemaCreates = statements.filter(statement => statement.startsWith('CREATE TABLE IF NOT EXISTS nexus_access_counter')).length;
    const dailySchemaCreates = statements.filter(statement => statement.startsWith('CREATE TABLE IF NOT EXISTS nexus_daily_access')).length;
    if (accessSchemaCreates !== 1 || dailySchemaCreates !== 1) fail(file, '스키마 준비가 중복 실행됨');
  } catch (error) {
    fail(file, `공유 access counter 실행 실패: ${error.message}`);
  }
}

requireFiles([
  'nexus/projects.json',
  'nexus/project-status.json',
  'nexus/approved-manifests.json',
  'nexus/index.html',
  'nexus/portal-v2.js',
  'nexus/portal-v2.css',
  'nexus/nexus-standard.css',
  'nexus/articles/articles.json',
  'nexus/articles/archive-index.js',
  'nexus/ai-trends/data.json',
  'nexus/intelligence-briefing/latest.json',
  'nexus/korea-social-intelligence/latest.json',
  'nexus/news/news-data.js'
]);
for (const retired of ['nexus/portal-enhancements.css', 'nexus/status.css', 'nexus/portal-v2-core.css']) {
  if (exists(retired)) fail(retired, '폐기된 전역 override 또는 중간 소유권 레이어가 다시 존재함');
}

if (!errors) {
  const projects = json('nexus/projects.json');
  const status = json('nexus/project-status.json');
  const registry = json('nexus/approved-manifests.json');
  const categoryIds = new Set((projects.categories || []).map(item => item.id));
  const projectIds = (projects.projects || []).map(item => item.id);
  if (new Set(projectIds).size !== projectIds.length) fail('nexus/projects.json', '프로젝트 id 중복');
  for (const project of projects.projects || []) {
    if (!project.id || !project.title || !project.description || !project.url) fail('nexus/projects.json', '프로젝트 표시정보 누락');
    if (!categoryIds.has(project.category)) fail('nexus/projects.json', `${project.id}: category 대상 없음`);
  }

  const approved = Array.isArray(registry.manifests) ? registry.manifests : [];
  const approvedIds = new Set();
  for (const file of approved) {
    if (!exists(file)) {
      fail('nexus/approved-manifests.json', `승인 manifest 없음: ${file}`);
      continue;
    }
    const manifest = json(file);
    if (manifest.publish !== false) approvedIds.add(manifest.id);
  }

  const allowedStatus = new Set([
    'id','managedBy','status','statusTone','lastUpdated','contentCount','contentLabel',
    'contentReviewedAt','baselineAt','baselineLabel'
  ]);
  const forbiddenContent = new Set(['title','description','url','category','meta','actionLabel','researchGroup','eyebrow','icon','iconClass']);
  for (const [id, item] of Object.entries(status)) {
    if (!approvedIds.has(id)) fail('nexus/project-status.json', `승인 manifest가 없는 상태 id: ${id}`);
    for (const key of Object.keys(item || {})) {
      if (forbiddenContent.has(key)) fail('nexus/project-status.json', `${id}: 콘텐츠 필드 ${key}는 projects.json만 소유`);
      if (!allowedStatus.has(key)) fail('nexus/project-status.json', `${id}: 허용되지 않은 상태 필드 ${key}`);
    }
    if (!isoDate(item.lastUpdated) || !isoDate(item.contentReviewedAt) || !isoDate(item.baselineAt)) fail('nexus/project-status.json', `${id}: 날짜 형식 오류`);
  }
}

if (exists('nexus/portal-v2.js') && exists('nexus/index.html')) {
  const js = read('nexus/portal-v2.js');
  const html = read('nexus/index.html');
  for (const token of [
    "fetchJson(`${dataPrefix}projects.json`)",
    "fetchJson(`${dataPrefix}project-status.json`)",
    "fetchJson('./intelligence-briefing/latest.json')",
    "fetchJson('./korea-social-intelligence/latest.json')",
    'window.YEHAVHA_NEWS_DATA',
    'renderHomeNews();',
    "const KOREA_TIME_ZONE = 'Asia/Seoul'",
    "const COUNTER_ENDPOINT = '/api/access'"
  ]) {
    if (!js.includes(token)) fail('nexus/portal-v2.js', `런타임 소유권 누락: ${token}`);
  }
  for (const marker of ['portal-runtime','portal-mark','accessCount','portalGrid','homeLatestNewsList','homeLatestNewsMeta','homeStrategyTitle','homeSocialTitle','homeBriefStrategyHeadline','homeBriefSocialHeadline']) {
    if (!html.includes(marker)) fail('nexus/index.html', `메인 DOM 누락: ${marker}`);
  }
  for (const retiredMarker of ['homeNewsGrid','homeNewsDate']) {
    if (html.includes(retiredMarker)) fail('nexus/index.html', `폐기된 메인 뉴스 DOM이 다시 존재함: ${retiredMarker}`);
  }
  if (!html.includes('./news/news-data.js')) fail('nexus/index.html', '메인 YEHAVHA NEWS가 canonical news-data.js를 로드하지 않음');
  if (/\.\/news\/articles\/20\d{2}-\d{2}-\d{2}-/.test(html)) fail('nexus/index.html', '당일 뉴스 기사 카드가 메인 HTML에 정적으로 중복 저장됨');
  if (/(?:portal-v2|nexus-standard)\.(?:css|js)\?v=/.test(html)) fail('nexus/index.html', 'no-cache 원소스와 중복되는 수동 cache-busting query가 남아 있음');
  if (js.includes('portal-enhancements.css') || js.includes('status.css') || js.includes('portal-v2-core.css')) fail('nexus/portal-v2.js', '폐기된 전역 스타일 또는 중간 소유권 연결 잔존');
  if (html.includes('visitor-count.js') || exists('nexus/visitor-count.js')) fail('nexus/index.html', '방문자 조회·표시 소유자가 중복됨');
  if (!html.includes('rel="canonical" href="https://yehavha.com/"') || !js.includes("const canonicalUrl = 'https://yehavha.com/';")) fail('nexus/index.html', '대표 도메인 불일치');
}

const NEXUS_GATE_IDS = [
  'strategy-intelligence',
  'legal-policy',
  'research-education',
  'life-action',
  'culture-media',
  'resources-services'
];
const NEXUS_DEDICATED_GATES = new Map([
  ['legal-policy', 'nexus/legal-policy/index.html'],
  ['research-education', 'nexus/research-education/index.html'],
  ['life-action', 'nexus/life-action/index.html'],
  ['resources-services', 'nexus/resources-services/index.html']
]);

if (exists('nexus/projects.json')) {
  const gateData = json('nexus/projects.json');
  const tierIds = (gateData.tiers || []).map(item => item.id);
  if (tierIds.length !== NEXUS_GATE_IDS.length || NEXUS_GATE_IDS.some(id => !tierIds.includes(id))) {
    fail('nexus/projects.json', `NEXUS 6개 Gate 구조 불일치: ${tierIds.join(', ')}`);
  }
  const categoriesById = new Map((gateData.categories || []).map(item => [item.id, item]));
  for (const category of gateData.categories || []) {
    if (!NEXUS_GATE_IDS.includes(category.tier)) {
      fail('nexus/projects.json', `${category.id}: 허용되지 않은 Gate tier ${category.tier}`);
    }
  }
  for (const project of gateData.projects || []) {
    const category = categoriesById.get(project.category);
    if (!NEXUS_GATE_IDS.includes(project.primaryGate)) {
      fail('nexus/projects.json', `${project.id}: primaryGate 누락 또는 잘못된 값`);
    } else if (category && project.primaryGate !== category.tier) {
      fail('nexus/projects.json', `${project.id}: primaryGate(${project.primaryGate})와 category tier(${category.tier}) 불일치`);
    }
  }
}

if (exists('nexus/index.html') && exists('nexus/portal-v2.js')) {
  const home = read('nexus/index.html');
  const runtime = read('nexus/portal-v2.js');
  const expectedRoutes = new Map([
    ['legal-policy', './legal-policy/'],
    ['research-education', './research-education/'],
    ['life-action', './life-action/'],
    ['resources-services', './resources-services/']
  ]);
  for (const [gate, href] of expectedRoutes) {
    if (!home.includes(`href="${href}"`)) fail('nexus/index.html', `${gate}: 전용 Gate 페이지 링크 누락`);
    if (home.includes(`href="#gate-${gate}"`)) fail('nexus/index.html', `${gate}: 구형 메인 내부앵커가 다시 존재함`);
  }
  for (const gate of ['strategy-intelligence','culture-media']) {
    if (!home.includes(`href="#gate-${gate}"`)) fail('nexus/index.html', `${gate}: 메인 노출 Gate 앵커 누락`);
  }
  if (!home.includes('data-nexus-architecture="gate-v1"')) {
    fail('nexus/index.html', 'NEXUS Gate 구조 버전 표식 누락');
  }
  if (!home.includes('./news/about.html#mediaInfoTitle')) {
    fail('nexus/index.html', '매체정보 링크가 실제 about.html 원본을 가리키지 않음');
  }
  if (!runtime.includes("new Set(['strategy-intelligence','culture-media'])")) {
    fail('nexus/portal-v2.js', '메인에 노출할 Gate가 전략·인텔리전스와 문화·미디어로 고정되지 않음');
  }
  if (!runtime.includes("const gatePortalGrid = document.getElementById('gatePortalGrid')")) {
    fail('nexus/portal-v2.js', '전용 Gate 렌더링이 canonical portal runtime에 통합되지 않음');
  }
  if (exists('nexus/gate-page.js') || exists('nexus/gate-page.css')) {
    fail('nexus', '폐기된 Gate 전용 중복 CSS/JS가 다시 존재함');
  }
}

for (const [gate, file] of NEXUS_DEDICATED_GATES) {
  if (!exists(file)) {
    fail(file, `${gate}: 전용 Gate 페이지 없음`);
    continue;
  }
  const page = read(file);
  if (!page.includes('class="gate-lead-titleline"')) fail(file, 'Gate 번호·라벨·제목 병렬 표기 누락');
  if (/기존 원본 페이지|원본 페이지로 연결/.test(page)) fail(file, '독자용 Gate 리드문에 내부 구현 표현이 노출됨');
  if (!page.includes('class="portal-mark" aria-label="한국 표준시"')) fail(file, 'Gate 상단 날짜 영역이 공통 topbar 마크업과 다름');
  if (!page.includes('class="access-count" id="accessCount" aria-label="방문자수" hidden')) fail(file, 'Gate 방문자수 영역이 공통 topbar 마크업과 다름');
  if (!page.includes(`data-gate="${gate}"`)) fail(file, `data-gate="${gate}" 누락`);
  if (!page.includes('../portal-v2.js')) fail(file, '공통 portal-v2.js 런타임 누락');
  if (page.includes('gate-page.js') || page.includes('gate-page.css')) fail(file, '폐기된 Gate 전용 중복 파일 참조');
  if (page.includes('인터넷신문 「예하바」 창간 준비 중') || page.includes('뉴스에서 전략으로, 전략을 실행으로')) {
    fail(file, '전용 NEXUS Gate에 뉴스 메인 전용 브랜드 문구가 혼입됨');
  }
  if (!page.includes('data-footer-standard="v2"')) fail(file, '표준 NEXUS Footer 누락');
  if (gate !== 'life-action' && !page.includes('id="gatePortalGrid"')) fail(file, '프로젝트 Gate 렌더링 대상 누락');
}

if (exists('nexus/_headers')) {
  const headers = read('nexus/_headers');
  for (const route of ['/', '/legal-policy/', '/research-education/', '/life-action/', '/resources-services/']) {
    const requiredBlock = route + '\n  Cache-Control: no-cache, no-store, must-revalidate';
    if (!headers.includes(requiredBlock)) fail('nexus/_headers', route + ': 구조 HTML no-store 규칙 누락');
  }
} else {
  fail('nexus/_headers', 'NEXUS 캐시 정책 파일 없음');
}

const surfaces = [
  ['nexus/articles/index.html', ['id="articleArchive"','id="articleCount"','id="updatedAt"','id="latestTitle"','id="articleGrid"','./archive-index.js']],
  ['nexus/articles/article.html', ['id="readerCard"','id="articleBody"','id="articleToc"','id="relatedArticles"','./articles.js']],
  ['nexus/ai-trends/index.html', ['id="radarGrid"','id="scopeGrid"','id="filterRow"','id="briefFeed"']],
  ['nexus/intelligence-briefing/index.html', ['id="executiveSummary"','id="briefFeed"','id="archiveList"']],
  ['nexus/publishing/index.html', ['id="top"','id="bookGrid"']]
];
for (const [file, markers] of surfaces) {
  if (!exists(file)) {
    fail(file, '핵심 화면 없음');
    continue;
  }
  const source = read(file);
  for (const marker of markers) if (!source.includes(marker)) fail(file, `핵심 구조 누락: ${marker}`);
}

if (exists('nexus/articles/articles.json')) {
  const data = json('nexus/articles/articles.json');
  if ((data.sections || []).length < 5) fail('nexus/articles/articles.json', '주제 분류가 비정상적으로 감소');
  if ((data.articles || []).length < 20) fail('nexus/articles/articles.json', '공개 글 수가 비정상적으로 감소');
}
if (exists('nexus/ai-trends/data.json')) {
  const data = json('nexus/ai-trends/data.json');
  const entries = Array.isArray(data.entries) ? data.entries : (Array.isArray(data.items) ? data.items : []);
  if (!entries.length) fail('nexus/ai-trends/data.json', 'AI 동향 엔트리가 비어 있음');
  if (!Array.isArray(data.radar) || !data.radar.length) fail('nexus/ai-trends/data.json', 'AI 풍향계 데이터가 비어 있음');
  if (!Array.isArray(data.scope) || !data.scope.length) fail('nexus/ai-trends/data.json', 'AI 관찰범위 데이터가 비어 있음');
}
if (exists('nexus/intelligence-briefing/latest.json')) {
  const data = json('nexus/intelligence-briefing/latest.json');
  const items = Array.isArray(data.items) ? data.items : (Array.isArray(data.briefs) ? data.briefs : []);
  if (!items.length) fail('nexus/intelligence-briefing/latest.json', '전략 브리핑 핵심정보가 비어 있음');
}
if (exists('nexus/korea-social-intelligence/latest.json')) {
  const data = json('nexus/korea-social-intelligence/latest.json');
  const sections = Array.isArray(data.sections) ? data.sections : [];
  if (!sections.some(section => Array.isArray(section?.items) && section.items.length)) fail('nexus/korea-social-intelligence/latest.json', '사회동향 핵심정보가 비어 있음');
}

requireFiles([
  'nexus/functions/lib/access-counter.js',
  'nexus/functions/lib/metrics.js',
  'nexus/functions/api/access.js',
  'nexus/functions/go.js',
  'nexus/functions/_middleware.js'
]);
if (exists('nexus/functions/_middleware.js') && !read('nexus/functions/_middleware.js').includes('./lib/access-counter.js')) fail('nexus/functions/_middleware.js', '공유 access counter helper 미사용');
if (exists('nexus/functions/api/access.js') && !read('nexus/functions/api/access.js').includes('../lib/access-counter.js')) fail('nexus/functions/api/access.js', '공유 access counter helper 미사용');
if (exists('nexus/functions/api/access.js') && !read('nexus/functions/api/access.js').includes('../lib/metrics.js')) fail('nexus/functions/api/access.js', '공유 metrics helper 미사용');
if (exists('nexus/functions/go.js') && !read('nexus/functions/go.js').includes('./lib/metrics.js')) fail('nexus/functions/go.js', '공유 metrics helper 미사용');

await auditAccessCounter();

// Run the updater against the actual page with isolated market data and writes.
// In particular, the existing IPO section must survive each refresh unchanged.
async function auditInvestmentRefresh() {
  const file = 'scripts/refresh-investment-strategy.mjs';
  const original = read('nexus/investment-strategy/index.html');
  const ipoMarker = '<section class="section"><div class="wrap"><div class="section-head"><h2>AI·로봇 공모주 청약</h2>';
  const source = read(file).replace(/^import .+;\n/gm, '').replace('main().catch', 'result = main().catch');
  async function run(input, mismatchedDates = false) {
    let output = input;
    let writes = 0;
    const requests = [];
    const sandbox = {
      fs: { readFileSync: () => input, writeFileSync: (_path, value) => { output = value; writes += 1; } },
      path, console: { log() {}, warn() {}, error() {} }, Intl, AbortSignal,
      process: { cwd: () => ROOT, env: {}, exitCode: 0 },
      fetch: async url => {
        requests.push(url);
        const isKosdaq = url.includes('/KOSDAQ/');
        const index = { closePrice: isKosdaq ? '800' : '6000', fluctuationsRatio: '1.25', localTradedAt: mismatchedDates && isKosdaq ? '2026-09-03' : '2026-09-04' };
        return { ok: true, json: async () => url.includes('/api/index/') ? index : [] };
      }
    };
    vm.runInNewContext(source, sandbox, { timeout: 5000 });
    await sandbox.result;
    return { output, writes, requests, failed: sandbox.process.exitCode === 1 };
  }
  try {
    const first = await run(original);
    const second = await run(first.output);
    if (first.failed || first.writes !== 1 || second.output !== first.output) throw new Error('갱신 실패 또는 반복 실행 시 중복 생성');
    if (!original.includes(ipoMarker) || first.output.slice(first.output.indexOf(ipoMarker)) !== original.slice(original.indexOf(ipoMarker))) throw new Error('공모주 본문·Footer가 변경됨');
    if (first.requests.some(url => /\/api\/stock\/|polling\.finance/.test(url))) throw new Error('삭제한 개별종목 데이터를 여전히 조회함');
    const invalid = await run(original, true);
    if (!invalid.failed || invalid.writes !== 0) throw new Error('거래일 불일치 데이터가 파일에 반영됨');
  } catch (error) {
    fail(file, error.message);
  }
}
await auditInvestmentRefresh();

console.log(`Nexus structural ownership audit: ${errors} error(s)`);
if (errors) process.exit(1);
