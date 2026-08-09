import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();
const DIR = path.join(ROOT, 'toeic-human-100');
const MASTER_FILE = path.join(DIR, 'master-lexicon-v2.json');
const OUTPUT_JSON = path.join(DIR, 'READING_V2_COVERAGE.json');
const OUTPUT_MD = path.join(DIR, 'READING_V2_COVERAGE.md');
const readingFiles = [
  'reading-content-v2.js',
  'reading-content-v2-days02-04.js',
  'reading-content-v2-days05-07.js',
  'reading-content-v2-days08-10.js'
].filter(file => fs.existsSync(path.join(DIR,file)));

if (!readingFiles.length) throw new Error('V2 reading files missing');
if (!fs.existsSync(MASTER_FILE)) throw new Error('master-lexicon-v2.json missing');

const context = {};
vm.createContext(context);
for (const file of readingFiles) vm.runInContext(fs.readFileSync(path.join(DIR,file),'utf8'), context, {filename:file});
vm.runInContext('globalThis.__READING_V2__ = TOEIC_READING_V2;', context);
const program = context.__READING_V2__;
let teps = {days:[]};
const tepsFile = path.join(DIR,'teps-extension-v2.js');
if (fs.existsSync(tepsFile)) {
  vm.runInContext(fs.readFileSync(tepsFile,'utf8'), context, {filename:'teps-extension-v2.js'});
  vm.runInContext('globalThis.__TEPS_V2__ = TEPS_READING_EXTENSION_V2;', context);
  teps = context.__TEPS_V2__;
}
const master = JSON.parse(fs.readFileSync(MASTER_FILE, 'utf8'));

function normalizeText(text = '') {
  return String(text).toLowerCase().replace(/[’‘]/g, "'").replace(/[–—]/g, '-').replace(/[^a-z0-9'\-\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

const dayTexts = new Map();
for (const day of (program.days || [])) {
  const reading = (day.reading?.paragraphs || []).join(' ');
  const practice = [...(day.practice?.part5 || []),...(day.practice?.part6 || []),...(day.practice?.part7 || [])].flatMap(q => [q.question, ...(q.options || [])]).join(' ');
  const analysis = [...(day.sentenceLab || []).map(x => x.sentence),...(day.sentenceStructures || []).map(x => x.example)].join(' ');
  const tepsDay = (teps.days || []).find(x => x.day === day.day);
  const tepsText = tepsDay ? [tepsDay.passage,...(tepsDay.questions||[]).flatMap(q=>[q.question,...(q.options||[])]),...(tepsDay.vocabulary||[]).flat()].join(' ') : '';
  dayTexts.set(day.day, normalizeText(`${reading} ${practice} ${analysis} ${tepsText}`));
}

function occurrences(text, form) {
  const cleanForm = normalizeText(form);
  if (!cleanForm) return 0;
  if (!cleanForm.includes(' ')) return text.split(' ').filter(token => token === cleanForm).length;
  const escaped = cleanForm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.match(new RegExp(`(?:^|\\s)${escaped}(?=\\s|$)`, 'g'))?.length || 0;
}

const auditEntries = [];
for (const item of (master.entries || [])) {
  let total = 0;
  const days = [];
  for (const [day, text] of dayTexts.entries()) {
    let dayCount = 0;
    for (const form of item.forms || [item.lemma]) dayCount += occurrences(text, form);
    if (dayCount > 0) { total += dayCount; days.push({day,count:dayCount}); }
  }
  auditEntries.push({id:item.id,lemma:item.lemma,sourceLists:item.sourceLists,roles:item.roles,exposureCount:total,exposureDays:days.map(d=>d.day),dayCounts:days});
}

const present = auditEntries.filter(x=>x.exposureCount>0);
const missing = auditEntries.filter(x=>x.exposureCount===0);
const byRole = {};
for (const role of ['general-core','toeic-specific','academic-book-extension']) {
  const items = auditEntries.filter(x=>x.roles.includes(role));
  const seen = items.filter(x=>x.exposureCount>0);
  byRole[role] = {total:items.length,seen:seen.length,missing:items.length-seen.length,coveragePercent:items.length?Number((seen.length/items.length*100).toFixed(2)):0};
}

const dayCount = program.days?.length || 0;
const expectedDays = program.meta?.totalDays || 100;
const finished = dayCount === expectedDays;
const report = {
  generatedAt:new Date().toISOString(),
  staged:!finished,
  dayCount,
  expectedDays,
  tepsDayCount:teps.days?.length||0,
  masterHeadwords:auditEntries.length,
  seenHeadwords:present.length,
  missingHeadwords:missing.length,
  headwordCoveragePercent:auditEntries.length?Number((present.length/auditEntries.length*100).toFixed(2)):0,
  byRole,
  repetition:{seenAtLeast2:auditEntries.filter(x=>x.exposureCount>=2).length,seenAtLeast4:auditEntries.filter(x=>x.exposureCount>=4).length,seenAtLeast8:auditEntries.filter(x=>x.exposureCount>=8).length},
  missing:missing.map(x=>({lemma:x.lemma,sourceLists:x.sourceLists,roles:x.roles})),
  entries:auditEntries
};
fs.writeFileSync(OUTPUT_JSON, JSON.stringify(report,null,2)+'\n');
const md = `# Reading V2 Master Coverage\n\n- 생성일: ${report.generatedAt}\n- V2 작성일수: ${dayCount}/${expectedDays}\n- TEPS 확장 작성일수: ${report.tepsDayCount}/${expectedDays}\n- 마스터 headword: ${report.masterHeadwords}\n- 현재 등장 headword: ${report.seenHeadwords}\n- 현재 미등장 headword: ${report.missingHeadwords}\n- 현재 headword coverage: ${report.headwordCoveragePercent}%\n- 2회 이상: ${report.repetition.seenAtLeast2}\n- 4회 이상: ${report.repetition.seenAtLeast4}\n- 8회 이상: ${report.repetition.seenAtLeast8}\n\n## 역할별\n\n${Object.entries(report.byRole).map(([role,v])=>`- ${role}: ${v.seen}/${v.total} (${v.coveragePercent}%), 미등장 ${v.missing}`).join('\n')}\n\n## 판정\n\n${finished ? (missing.length ? '100일 작성은 완료됐으나 미등장 마스터 어휘가 남아 있으므로 콘텐츠 완성으로 판정하지 않는다.' : '마스터 headword 1회 이상 노출 기준을 충족했다.') : '현재는 단계적 제작 중이므로 미등장 항목은 다음 DAY 배치대상이다. TOEIC 본문·분석·문제와 TEPS 확장을 모두 학습 노출로 계산한다.'}\n`;
fs.writeFileSync(OUTPUT_MD,md);
console.log(md);
if (finished && missing.length) process.exitCode=1;
