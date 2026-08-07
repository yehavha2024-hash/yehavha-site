import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();
const DIR = path.join(ROOT, 'three-minute-break');
const source = fs.readFileSync(path.join(DIR, 'app.js'), 'utf8');
const marker = '\nconst labels =';
const markerIndex = source.indexOf(marker);
if (markerIndex < 0) throw new Error('Cannot locate 3-minute content boundary in app.js');

const context = {};
vm.createContext(context);
vm.runInContext(`${source.slice(0, markerIndex)}\nglobalThis.__CONTENT__ = content;`, context, { filename: 'three-minute-break/app.js' });
const content = context.__CONTENT__;

const expected = { quote: 50, english: 50, bible: 50, quiz: 50 };
for (const [category, count] of Object.entries(expected)) {
  if (!Array.isArray(content?.[category])) throw new Error(`Missing category: ${category}`);
  if (content[category].length !== count) throw new Error(`${category}: expected ${count}, got ${content[category].length}`);
  const titles = content[category].map(item => item.title);
  if (new Set(titles).size !== titles.length) throw new Error(`${category}: duplicate title detected`);
}

for (const [index, item] of content.quiz.entries()) {
  if (!Array.isArray(item.options) || item.options.length !== 4) throw new Error(`quiz ${index + 1}: options must be 4`);
  if (!Number.isInteger(item.answer) || item.answer < 0 || item.answer >= item.options.length) throw new Error(`quiz ${index + 1}: invalid answer index`);
  if (!item.explanation?.trim()) throw new Error(`quiz ${index + 1}: explanation missing`);
}
if (!source.includes('timeZone: "Asia/Seoul"')) throw new Error('Asia/Seoul date calculation not found');

function csvCell(value = '') {
  const text = String(value ?? '').replace(/\r\n/g, '\n');
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

const rows = [['category','number','title','body','meta','options','answer','explanation']];
for (const category of Object.keys(expected)) {
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
fs.writeFileSync(path.join(DIR, 'CONTENT_CATALOG.csv'), rows.map(row => row.map(csvCell).join(',')).join('\n') + '\n');

const report = `# 자동 검증 결과\n\n- 총 콘텐츠: 200개\n- 명언: 50개\n- 생활영어: 50개\n- 성경 핵심 의미: 50개\n- 미니퀴즈: 50개\n- 카테고리별 제목 중복: 없음\n- 모든 퀴즈 보기 수: 4개\n- 모든 퀴즈 정답 인덱스: 유효\n- 모든 퀴즈 해설: 존재\n- 날짜 계산 시간대: Asia/Seoul\n- 카테고리별 자동 순환 주기: 50일\n- 운영 원본: GitHub / three-minute-break/app.js\n`;
fs.writeFileSync(path.join(DIR, 'VALIDATION_REPORT.md'), report);

console.log('3분 쉼표 검증 완료: 4개 카테고리, 총 200개 콘텐츠');
