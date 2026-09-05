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
  const statements = [];
  const database = {
    prepare(sql) {
      const statement = sql.replace(/\s+/g, ' ').trim();
      statements.push(statement);
      return {
        async run() {
          if (statement.startsWith('UPDATE nexus_access_counter')) count += 1;
          return { success: true };
        },
        async first() {
          return statement.startsWith('SELECT count') ? { count } : null;
        }
      };
    }
  };

  try {
    const counter = await import('../functions/lib/access-counter.js');
    const [initial, concurrent] = await Promise.all([
      counter.readAccessCount(database),
      counter.readAccessCount(database)
    ]);
    await counter.incrementAccessCount(database);
    const updated = await counter.readAccessCount(database);
    if (initial !== 3 || concurrent !== 3 || updated !== 4) fail(file, `읽기·증가 결과 불일치: ${initial}/${concurrent} → ${updated}`);
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
  'nexus/intelligence-briefing/latest.json'
]);
for (const retired of ['nexus/portal-enhancements.css', 'nexus/status.css']) {
  if (exists(retired)) fail(retired, '폐기된 전역 override 레이어가 다시 존재함');
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
  for (const token of ["fetchJson('./projects.json')", "fetchJson('./project-status.json')", "const KOREA_TIME_ZONE = 'Asia/Seoul'", "const COUNTER_ENDPOINT = '/api/access'"]) {
    if (!js.includes(token)) fail('nexus/portal-v2.js', `런타임 소유권 누락: ${token}`);
  }
  for (const marker of ['portal-runtime','portal-mark','accessCount','portalGrid']) {
    if (!html.includes(marker)) fail('nexus/index.html', `메인 DOM 누락: ${marker}`);
  }
  if (js.includes('portal-enhancements.css') || js.includes('status.css')) fail('nexus/portal-v2.js', '폐기된 전역 스타일 동적 연결 잔존');
  if (html.includes('visitor-count.js') || exists('nexus/visitor-count.js')) fail('nexus/index.html', '방문자 조회·표시 소유자가 중복됨');
  if (!html.includes('rel="canonical" href="https://yehavha.com/"') || !js.includes("const canonicalUrl = 'https://yehavha.com/';")) fail('nexus/index.html', '대표 도메인 불일치');
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
