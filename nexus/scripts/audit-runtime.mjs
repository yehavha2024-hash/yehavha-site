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

function auditInitiatives() {
  const source = 'nexus/initiatives/data.json';
  const data = auditJson(source);
  if (!data) return;
  const groups = new Set((data.groups || []).map(item => item.id));
  const statuses = new Set((data.lifecycle || []).map(item => item.id));
  const visibility = new Set((data.visibility || []).map(item => item.id));
  const items = Array.isArray(data.items) ? data.items : [];
  if (!unique(items.map(item => item.id))) fail(source, '아이디어 id 중복');
  for (const item of items) {
    if (!groups.has(item.group)) fail(source, `${item.id} group 대상 없음: ${item.group}`);
    if (!statuses.has(item.statusId)) fail(source, `${item.id} statusId 대상 없음: ${item.statusId}`);
    if (!visibility.has(item.visibilityId)) fail(source, `${item.id} visibilityId 대상 없음: ${item.visibilityId}`);
    if (!item.title || !item.summary || !item.nextAction) fail(source, `${item.id} 필수 실행정보 누락`);
  }
  const obsolete = ['one-song-multiplatform'];
  for (const id of obsolete) if (items.some(item => item.id === id)) fail(source, `삭제 결정된 항목 잔존: ${id}`);
}

function auditAiPractice() {
  const source = 'nexus/ai-practice/data.json';
  const data = auditJson(source);
  if (!data) return;
  const groups = Array.isArray(data.groups) ? data.groups : [];
  if (!groups.length) fail(source, '실행 그룹 없음');
  if (!unique(groups.map(item => item.id))) fail(source, '실행 그룹 id 중복');
  for (const group of groups) {
    if (!Array.isArray(group.items) || !group.items.length) warn(source, `${group.id} 실행 항목 없음`);
    for (const item of group.items || []) {
      if (!item.title || !item.purpose || !Array.isArray(item.workflow) || !item.workflow.length) fail(source, `${group.id} 실행 항목 필수정보 누락: ${item.title || '(제목 없음)'}`);
    }
  }
  const text = JSON.stringify(data);
  for (const phrase of ['전자책 30초 홍보영상', '법률연구·AI 강좌 60~90초 설명영상']) {
    if (text.includes(phrase)) fail(source, `삭제 결정된 항목 잔존: ${phrase}`);
  }
}

function auditStatusModel() {
  const status = auditJson('nexus/project-status.json');
  const projects = auditJson('nexus/projects.json');
  if (!status || !projects) return;
  const managedIds = [
    'ai-law-institute','three-min-rest','living-law-100','toeicman','toeicman-v2','legal-research-track','legal-knowledge',
    'ai-law-literature','ai-law-tech-foresight','legal-philosophy','publishing-hub','article-library','ai-practice-library','initiative-hub'
  ];
  for (const id of managedIds) {
    if (!(id in status)) fail('nexus/project-status.json', `관리 프로젝트 상태 누락: ${id}`);
    if (!(projects.projects || []).some(item => item.id === id)) fail('nexus/projects.json', `관리 프로젝트 카드 누락: ${id}`);
  }
}

auditInternalProjectUrls();
auditAdvancedToeic();
auditLivingLaw();
auditPublishing();
auditArticles();
auditInitiatives();
auditAiPractice();
auditStatusModel();

console.log(`Nexus runtime audit: ${errors} error(s), ${warnings} warning(s)`);
if (errors) process.exit(1);
