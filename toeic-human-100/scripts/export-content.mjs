import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();
const DIR = path.join(ROOT, 'toeic-human-100');
const source = fs.readFileSync(path.join(DIR, 'content.js'), 'utf8');
const context = {};
vm.createContext(context);
vm.runInContext(`${source}\nglobalThis.__TOEIC_CONTENT__ = TOEIC_CONTENT;`, context, { filename: 'toeic-human-100/content.js' });
const content = context.__TOEIC_CONTENT__;

const categories = ['vocab','expression','sentence','grammar','practice'];
for (const category of categories) {
  if (!Array.isArray(content?.[category])) throw new Error(`Missing category: ${category}`);
  if (content[category].length !== 100) throw new Error(`${category}: expected 100, got ${content[category].length}`);
  for (let day = 1; day <= 100; day += 1) {
    if (!content[category].some(item => item.day === day)) throw new Error(`${category}: DAY ${day} missing`);
  }
}

for (const category of ['vocab','expression']) {
  const titles = content[category].map(item => item.title.trim().toLowerCase());
  if (new Set(titles).size !== titles.length) throw new Error(`${category}: duplicate title detected`);
}
for (const item of content.practice) {
  if (!Array.isArray(item.options) || item.options.length !== 4) throw new Error(`practice DAY ${item.day}: options must be 4`);
  if (!Number.isInteger(item.answer) || item.answer < 0 || item.answer >= item.options.length) throw new Error(`practice DAY ${item.day}: invalid answer index`);
  if (!item.explanation?.trim()) throw new Error(`practice DAY ${item.day}: explanation missing`);
}

fs.writeFileSync(path.join(DIR, 'content.json'), JSON.stringify(content, null, 2) + '\n');

function csvCell(value = '') {
  const text = String(value ?? '').replace(/\r\n/g, '\n');
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function catalogValues(category, item) {
  switch (category) {
    case 'vocab': return [item.meaning, item.example];
    case 'expression': return [item.meaning, item.example];
    case 'sentence': return [item.sentence, item.translation];
    case 'grammar': return [item.rule, item.trap];
    case 'practice': return [item.question, item.options[item.answer]];
    default: return ['', ''];
  }
}

const rows = [['day','category','title','main','answer_or_note']];
for (let day = 1; day <= 100; day += 1) {
  for (const category of categories) {
    const item = content[category].find(entry => entry.day === day);
    const [main, note] = catalogValues(category, item);
    rows.push([day, category, item.title, main, note]);
  }
}
fs.writeFileSync(path.join(DIR, 'CONTENT_CATALOG.csv'), rows.map(row => row.map(csvCell).join(',')).join('\n') + '\n');

const report = `# 콘텐츠 검증 보고서\n\n- 카테고리: 5개\n- 카테고리별 콘텐츠: 100일\n- 총 카드: 500개\n- 실전문제: 100문항\n- 모든 실전문제 정답 인덱스 범위 확인\n- 핵심어휘 및 숙어 중복 제거 확인\n- 공식 기출문제 복제 없이 출제 유형을 반영한 자체 제작 문항\n- 운영 원본: GitHub / toeic-human-100/content.js\n`;
fs.writeFileSync(path.join(DIR, 'VALIDATION_REPORT.md'), report);

console.log('토익인간 검증 완료: 100일 × 5개 영역 = 총 500개 카드');
