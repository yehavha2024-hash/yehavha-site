import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();
let errors = 0;
let warnings = 0;

const exists = relative => fs.existsSync(path.join(ROOT, relative));
const read = relative => fs.readFileSync(path.join(ROOT, relative), 'utf8');
const json = relative => JSON.parse(read(relative));
const fail = (source, message) => { errors += 1; console.error(`ERROR ${source}: ${message}`); };
const warn = (source, message) => { warnings += 1; console.warn(`WARNING ${source}: ${message}`); };
const unique = values => new Set(values).size === values.length;
const countWords = text => String(text || '').trim().split(/\s+/).filter(Boolean).length;

function auditJson(relative) {
  if (!exists(relative)) return fail(relative, '파일 없음');
  try { return json(relative); }
  catch (error) { fail(relative, `JSON 파싱 실패: ${error.message}`); return null; }
}

function auditInternalProjectUrls() {
  const source = 'nexus/projects.json';
  const data = auditJson(source);
  if (!data) return;
  for (const project of data.projects || []) {
    let url;
    try { url = new URL(project.url); }
    catch { continue; }
    if (url.hostname !== 'yehavha-nexus-hub.pages.dev') continue;
    const pathname = decodeURIComponent(url.pathname).replace(/^\/+|\/+$/g, '');
    const target = pathname ? `nexus/${pathname}` : 'nexus';
    const html = path.extname(target) ? target : `${target}/index.html`;
    if (!exists(html)) fail(source, `${project.id} 내부 실행 URL 대상 없음: ${html}`);
  }
}

function auditUniversity() {
  const source = 'nexus/university';
  const coursePage = `${source}/course.html`;
  for (const file of ['index.html', 'course.html', 'core-101.html', 'university.css', 'university-utils.js', 'readability.css', 'guided-practice.css', 'guided-practice.js']) {
    if (!exists(`${source}/${file}`)) fail(source, `필수 실행파일 없음: ${file}`);
  }
  if (!exists(coursePage)) return;

  const scripts = [...read(coursePage).matchAll(/<script\s+[^>]*src=["']\.\/([^"']+\.js)(?:\?[^"']*)?["']/gi)]
    .map(match => match[1]);
  const engineIndex = scripts.indexOf('course-engine.js');
  if (engineIndex < 0) return fail(coursePage, 'course-engine.js 로드 순서 없음');
  if (!scripts.includes('guided-practice.js')) fail(coursePage, 'canonical guided-practice.js 누락');
  if (scripts.some(file => /-20\d{6}\.(?:css|js)$/.test(file))) fail(coursePage, '날짜형 실행 레이어가 로드됨');

  const canonicalCoreRoute = './course.html?id=CORE-101';
  const indexPage = read(`${source}/index.html`);
  const indexRuntime = read(`${source}/university-index.js`);
  const courseRuntime = read(`${source}/course-engine.js`);
  const legacyCorePage = read(`${source}/core-101.html`);
  if (!indexPage.includes(`href="${canonicalCoreRoute}"`)) fail(`${source}/index.html`, 'CORE-101 표준강좌가 canonical course 경로를 사용하지 않음');
  if (indexRuntime.includes("'./core-101.html'")) fail(`${source}/university-index.js`, 'CORE-101 카드가 legacy redirect 경로를 사용함');
  if (courseRuntime.includes("location.replace('./core-101.html')")) fail(`${source}/course-engine.js`, 'CORE-101 강좌가 legacy 경로로 되돌아가 순환 이동함');
  if (!legacyCorePage.includes(`location.replace('${canonicalCoreRoute}')`)) fail(`${source}/core-101.html`, 'legacy CORE-101 주소의 단방향 canonical 이동 누락');

  const context = {
    window: {},
    console: { info() {}, warn() {}, error() {}, log() {} }
  };
  vm.createContext(context);
  for (const file of scripts.slice(0, engineIndex)) {
    const relative = `${source}/${file}`;
    if (!exists(relative)) {
      fail(coursePage, `교재 데이터 실행파일 없음: ${file}`);
      continue;
    }
    try {
      vm.runInContext(read(relative), context, { filename: file });
    } catch (error) {
      fail(relative, `교재 데이터 실행 실패: ${error.message}`);
      return;
    }
  }

  const curriculum = context.window.NEXUS_CURRICULUM;
  const courses = Array.isArray(curriculum?.all) ? curriculum.all : [];
  const textbooks = context.window.NEXUS_CORE_TEXTBOOK || {};
  if (courses.length !== 496) fail(source, `전체 과목 ${courses.length}개, 기대값 496개`);
  if (!unique(courses.map(course => course.id))) fail(source, '전체 과목 id 중복');
  if (Object.keys(textbooks).length !== courses.length) fail(source, `교재 적용 ${Object.keys(textbooks).length}/${courses.length}`);

  for (const course of courses) {
    const lessons = textbooks[course.id]?.lessons;
    if (!Array.isArray(lessons) || lessons.length !== 12) fail(`${source}/${course.id}`, `Lesson ${lessons?.length || 0}/12`);
  }

  const bridge = context.window.NEXUS_TEXTBOOK_COVERAGE_BRIDGE;
  if (!bridge || bridge.count !== 0 || bridge.generated?.length) fail(source, `범용 보완 교재가 남아 있음: ${bridge?.count ?? '확인 불가'}개`);
  for (const [globalName, sampleId] of [
    ['NEXUS_PHILOSOPHY_TEXTBOOKS', 'PHI-101'],
    ['NEXUS_THEOLOGY_TEXTBOOKS', 'BIB-101'],
    ['NEXUS_HUMANITIES_TEXTBOOKS', 'HIS-101'],
    ['NEXUS_ARTS_TEXTBOOKS', 'MUS-101']
  ]) {
    const lessons = context.window[globalName]?.[sampleId]?.lessons;
    if (!Array.isArray(lessons) || lessons.length !== 12) fail(source, `${sampleId} 전공 교재 데이터 누락`);
  }
}

function auditAdvancedToeic() {
  const source = 'nexus/toeic-human-v2';
  for (const file of ['data.js', 'learning-data.js', 'app.js', 'transfer-answers.js', 'style.css', 'transfer-answers.css', 'index.html']) {
    if (!exists(`${source}/${file}`)) fail(source, `필수 실행파일 없음: ${file}`);
  }
  if (errors && !exists(`${source}/data.js`)) return;

  const context = { window: {}, console };
  vm.createContext(context);
  try {
    vm.runInContext(read(`${source}/data.js`), context, { filename: 'data.js' });
    vm.runInContext(read(`${source}/learning-data.js`), context, { filename: 'learning-data.js' });
  } catch (error) {
    fail(source, `학습 데이터 실행 실패: ${error.message}`);
    return;
  }

  const data = context.window.TOEIC_HUMAN_V2;
  const branches = data?.branches;
  if (!Array.isArray(branches)) return fail(source, 'branches 배열 없음');
  if (branches.length !== 10) fail(source, `심화축 ${branches.length}개, 기대값 10개`);
  const lessons = branches.flatMap(branch => Array.isArray(branch.lessons) ? branch.lessons : []);
  if (lessons.length !== 100) fail(source, `학습일 ${lessons.length}개, 기대값 100개`);
  const days = lessons.map(item => item.day);
  if (!unique(days)) fail(source, 'DAY 번호 중복');
  for (let day = 1; day <= 100; day += 1) if (!days.includes(day)) fail(source, `DAY ${day} 누락`);

  for (const branch of branches) {
    if (!Array.isArray(branch.focuses) || branch.focuses.length !== 10) fail(source, `${branch.id || '?'} focuses가 10개가 아님`);
    if (!Array.isArray(branch.lessons) || branch.lessons.length !== 10) fail(source, `${branch.id || '?'} lessons가 10개가 아님`);
  }

  for (const lesson of lessons) {
    const label = `${source}/DAY-${String(lesson.day).padStart(3, '0')}`;
    const paragraphs = lesson.reading?.paragraphs;
    if (!Array.isArray(paragraphs) || paragraphs.length < 7) fail(label, '읽기 본문 문단이 7개 미만');
    const actualWords = countWords((paragraphs || []).join(' '));
    if (actualWords < 500) warn(label, `본문이 지나치게 짧음: ${actualWords} words`);
    if (actualWords > 900) fail(label, `심화 본문이 과도하게 김: ${actualWords} words`);
    if (lesson.reading?.wordCount && Math.abs(Number(lesson.reading.wordCount) - actualWords) > 5) {
      fail(label, `표시 단어수(${lesson.reading.wordCount})와 실제 단어수(${actualWords}) 불일치`);
    }
    if ((lesson.vocabulary || []).length < 18) fail(label, `핵심어휘 ${(lesson.vocabulary || []).length}개, 최소 18개`);
    if ((lesson.collocations || []).length < 8) fail(label, `숙어·연어 ${(lesson.collocations || []).length}개, 최소 8개`);
    if ((lesson.syntax || []).length < 4) fail(label, `문장구조 ${(lesson.syntax || []).length}개, 최소 4개`);
    if ((lesson.questions || []).length < 6) fail(label, `문제 ${(lesson.questions || []).length}개, 최소 6개`);
    if ((lesson.transfer || []).length < 4) fail(label, `전이훈련 ${(lesson.transfer || []).length}개, 최소 4개`);
    (lesson.questions || []).forEach((q, index) => {
      if (!Array.isArray(q.options) || q.options.length < 4) fail(label, `Q${index + 1} 선택지 부족`);
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= (q.options || []).length) fail(label, `Q${index + 1} 정답 인덱스 오류`);
      if (!q.explanationKo) fail(label, `Q${index + 1} 해설 누락`);
      if (!q.evidence) fail(label, `Q${index + 1} 근거 누락`);
    });
  }
}

function auditLivingLaw() {
  const source = 'nexus/living-law';
  for (const file of ['data.js', 'app.js', 'style.css', 'index.html', 'nexus.project.json']) {
    if (!exists(`${source}/${file}`)) fail(source, `필수 실행파일 없음: ${file}`);
  }
  if (!exists(`${source}/data.js`)) return;

  const context = { window: {}, console };
  vm.createContext(context);
  try {
    vm.runInContext(read(`${source}/data.js`), context, { filename: 'living-law/data.js' });
  } catch (error) {
    fail(source, `생활법률 데이터 실행 실패: ${error.message}`);
    return;
  }

  const data = context.window.LIVING_LAW_DATA;
  if (!data) return fail(source, 'LIVING_LAW_DATA 없음');
  if (!data.updatedAt || !data.legalBaseline) fail(source, '업데이트일 또는 법령 기준일 누락');

  const categories = Array.isArray(data.categories) ? data.categories : [];
  const items = Array.isArray(data.items) ? data.items : [];
  const sourceMap = data.sources && typeof data.sources === 'object' ? data.sources : {};
  if (categories.length !== 10) fail(source, `생활분야 ${categories.length}개, 기대값 10개`);
  if (items.length !== 100) fail(source, `생활법률 ${items.length}개, 기대값 100개`);
  if (!unique(categories.map(item => item.id))) fail(source, '생활분야 id 중복');
  if (!unique(items.map(item => item.id))) fail(source, '생활법률 id 중복');
  if (!unique(items.map(item => item.n))) fail(source, '생활법률 번호 중복');

  const categoryIds = new Set(categories.map(item => item.id));
  for (let n = 1; n <= 100; n += 1) if (!items.some(item => item.n === n)) fail(source, `생활법률 ${n}번 누락`);

  for (const item of items) {
    const label = `${source}/${item.id || item.n || '?'}`;
    if (!categoryIds.has(item.category)) fail(label, `분야 대상 없음: ${item.category}`);
    for (const key of ['title','summary','now','route','caution']) if (!item[key]) fail(label, `${key} 누락`);
    if (!Array.isArray(item.evidence) || !item.evidence.length) fail(label, '확보자료 누락');
    if (!Array.isArray(item.laws) || !item.laws.length) fail(label, '법률근거 누락');
    if (!Array.isArray(item.sources) || !item.sources.length) fail(label, '공식 확인처 누락');
    for (const key of item.sources || []) if (!sourceMap[key]) fail(label, `공식 확인처 키 없음: ${key}`);
  }
}

function auditPublishing() {
  const source = 'nexus/publishing/books.json';
  const data = auditJson(source);
  if (!data) return;
  const books = Array.isArray(data.books) ? data.books : [];
  if (!books.length) fail(source, '대표도서 없음');
  const ids = books.map(item => item.id);
  if (!unique(ids)) fail(source, '도서 id 중복');
  for (const book of books) {
    if (!book.id || !book.title || !book.url) fail(source, '도서 필수 필드(id/title/url) 누락');
    try {
      const url = new URL(book.url);
      if (url.protocol !== 'https:') fail(source, `${book.id} HTTPS URL 아님`);
    } catch { fail(source, `${book.id} URL 파싱 실패`); }
    if (book.detailEnabled && !book.detail) fail(source, `${book.id} detailEnabled=true이나 detail 없음`);
  }
  for (const file of ['nexus/publishing/index.html', 'nexus/publishing/detail.html', 'nexus/publishing/publishing.js', 'nexus/publishing/publishing.css']) {
    if (!exists(file)) fail(source, `출판 실행파일 없음: ${file}`);
  }
}

function auditArticles() {
  const source = 'nexus/articles/articles.json';
  const data = auditJson(source);
  if (!data) return;
  const sections = new Set((data.sections || []).map(item => item.id));
  const articles = Array.isArray(data.articles) ? data.articles : [];
  if (!unique(articles.map(item => item.id))) fail(source, '글 id 중복');
  for (const article of articles) {
    if (!sections.has(article.section)) fail(source, `${article.id}의 section 대상 없음: ${article.section}`);
    if (!article.contentUrl) { fail(source, `${article.id} contentUrl 누락`); continue; }
    const clean = article.contentUrl.replace(/^\.\//, '');
    const target = `nexus/articles/${clean}`;
    if (!exists(target)) fail(source, `${article.id} 본문 파일 없음: ${target}`);
    else auditJson(target);
    if (article.translationOf && !articles.some(item => item.id === article.translationOf)) fail(source, `${article.id} translationOf 대상 없음`);
  }
}

function auditStatusModel() {
  const status = auditJson('nexus/project-status.json');
  const projects = auditJson('nexus/projects.json');
  const registry = auditJson('nexus/approved-manifests.json');
  if (!status || !projects || !registry) return;

  const manifestFiles = Array.isArray(registry.manifests) ? registry.manifests : [];
  if (!manifestFiles.length) return fail('nexus/approved-manifests.json', '승인 manifest 목록이 비어 있음');
  if (!unique(manifestFiles)) fail('nexus/approved-manifests.json', '승인 manifest 경로 중복');

  const managedIds = [];
  for (const relative of manifestFiles) {
    const manifest = auditJson(relative);
    if (!manifest || manifest.publish === false) continue;
    if (!manifest.id) {
      fail(relative, 'manifest id 누락');
      continue;
    }
    managedIds.push(manifest.id);
  }
  if (!unique(managedIds)) fail('nexus/approved-manifests.json', '승인 manifest id 중복');

  const projectIds = new Set((projects.projects || []).map(item => item.id));
  const managedSet = new Set(managedIds);
  for (const id of managedIds) {
    if (!(id in status)) fail('nexus/project-status.json', `관리 프로젝트 상태 누락: ${id}`);
    if (!projectIds.has(id)) fail('nexus/projects.json', `관리 프로젝트 카드 누락: ${id}`);
  }
  for (const id of Object.keys(status)) {
    if (!managedSet.has(id)) fail('nexus/project-status.json', `승인 registry에 없는 상태 id 잔존: ${id}`);
  }
}

auditInternalProjectUrls();
auditUniversity();
auditAdvancedToeic();
auditLivingLaw();
auditPublishing();
auditArticles();
auditStatusModel();

console.log(`Nexus runtime audit: ${errors} error(s), ${warnings} warning(s)`);
if (errors) process.exit(1);
