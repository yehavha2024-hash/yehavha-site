import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();
const DIR = path.join(ROOT, 'three-minute-break');
const indexSource = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
const appSource = fs.readFileSync(path.join(DIR, 'app.js'), 'utf8');
const marker = '\nconst labels =';
const markerIndex = appSource.indexOf(marker);
if (markerIndex < 0) throw new Error('Cannot locate 3-minute content boundary in app.js');

const scriptFiles = [...indexSource.matchAll(/<script\s+[^>]*src=["']([^"']+)["']/gi)]
  .map(match => match[1].split('?')[0].replace(/^\.\//, ''))
  .filter(file => file && !/^https?:\/\//i.test(file));
const appIndex = scriptFiles.indexOf('app.js');
if (appIndex < 0) throw new Error('index.html does not load app.js');
const contentLayerFiles = scriptFiles.slice(appIndex + 1);

// 콘텐츠 검증은 브라우저 UI 소유권과 분리합니다. 데이터 레이어에 남아 있는
// 선택적 UI 후처리가 검증기의 DOM 환경을 요구하지 않도록 최소 no-op 문서만 제공합니다.
const context = {
  console,
  document: { querySelector: () => null }
};
vm.createContext(context);
vm.runInContext(`${appSource.slice(0, markerIndex)}\nglobalThis.__CONTENT__ = content;`, context, { filename: 'three-minute-break/app.js' });
for (const file of contentLayerFiles) {
  const full = path.join(DIR, file);
  if (!fs.existsSync(full)) throw new Error(`Runtime content layer missing: ${file}`);
  vm.runInContext(fs.readFileSync(full, 'utf8'), context, { filename: `three-minute-break/${file}` });
}
vm.runInContext('globalThis.__CONTENT__ = content;', context);
const content = context.__CONTENT__;

const categories = ['quote', 'english', 'bible', 'quiz'];
const counts = {};
for (const category of categories) {
  if (!Array.isArray(content?.[category])) throw new Error(`Missing category: ${category}`);
  if (content[category].length < 30) throw new Error(`${category}: unexpectedly small runtime content set (${content[category].length})`);
  const titles = content[category].map(item => item.title);
  if (new Set(titles).size !== titles.length) throw new Error(`${category}: duplicate title detected`);
  counts[category] = content[category].length;
}

for (const [index, item] of content.quiz.entries()) {
  if (!Array.isArray(item.options) || item.options.length !== 4) throw new Error(`quiz ${index + 1}: options must be 4`);
  if (!Number.isInteger(item.answer) || item.answer < 0 || item.answer >= item.options.length) throw new Error(`quiz ${index + 1}: invalid answer index`);
  if (!item.explanation?.trim()) throw new Error(`quiz ${index + 1}: explanation missing`);
}
if (!appSource.includes('timeZone: "Asia/Seoul"')) throw new Error('Asia/Seoul date calculation not found');

function csvCell(value = '') {
  const text = String(value ?? '').replace(/\r\n/g, '\n');
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

const rows = [['category', 'number', 'title', 'body', 'meta', 'options', 'answer', 'explanation']];
for (const category of categories) {
  content[category].forEach((item, index) => {
    rows.push([
      category,
      index + 1,
      item.title,
      item.body,
      item.meta,
      Array.isArray(item.options) ? item.options.join(' | ') : '',
      Number.isInteger(item.answer) ? item.answer : '',
      item.explanation || ''
    ]);
  });
}
fs.writeFileSync(path.join(DIR, 'CONTENT_CATALOG.csv'), `${rows.map(row => row.map(csvCell).join(',')).join('\n')}\n`);

const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
const report = `# 자동 검증 결과\n\n- 총 런타임 콘텐츠: ${total}개\n- 명언: ${counts.quote}개\n- 생활영어: ${counts.english}개\n- 성경 핵심 의미: ${counts.bible}개\n- 미니퀴즈: ${counts.quiz}개\n- 카테고리별 제목 중복: 없음\n- 모든 퀴즈 보기 수: 4개\n- 모든 퀴즈 정답 인덱스: 유효\n- 모든 퀴즈 해설: 존재\n- 날짜 계산 시간대: Asia/Seoul\n- 런타임 콘텐츠 계층: app.js → ${contentLayerFiles.join(' → ')}\n- 검증 기준: index.html의 실제 로드 순서\n`;
fs.writeFileSync(path.join(DIR, 'VALIDATION_REPORT.md'), report);

console.log(`3분 쉼표 검증 완료: ${categories.length}개 카테고리, 총 ${total}개 런타임 콘텐츠`);
console.log(JSON.stringify({ counts, total, contentLayerFiles }, null, 2));
