import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const DIR = path.join(process.cwd(), 'toeic-human-100');
const MASTER_FILE = path.join(DIR, 'master-lexicon-v2.json');
const OUTPUT_JSON = path.join(DIR, 'READING_V2_COVERAGE.json');
const OUTPUT_MD = path.join(DIR, 'READING_V2_COVERAGE.md');
const readingFiles = [
  'reading-content-v2.js',
  'reading-content-v2-days02-04.js',
  'reading-content-v2-days05-07.js',
  'reading-content-v2-days08-10.js',
  'reading-content-v2-length-patch.js'
].filter(file => fs.existsSync(path.join(DIR,file)));

if (!readingFiles.length) throw new Error('V2 reading files missing');
if (!fs.existsSync(MASTER_FILE)) throw new Error('master-lexicon-v2.json missing');

const context = {console};
vm.createContext(context);
for (const file of readingFiles) vm.runInContext(fs.readFileSync(path.join(DIR,file),'utf8'), context, {filename:file});
vm.runInContext(fs.readFileSync(path.join(DIR,'teps-extension-v2.js'),'utf8'), context, {filename:'teps-extension-v2.js'});
const tepsPatch = path.join(DIR,'teps-extension-length-patch.js');
if (fs.existsSync(tepsPatch)) vm.runInContext(fs.readFileSync(tepsPatch,'utf8'), context, {filename:'teps-extension-length-patch.js'});
vm.runInContext(fs.readFileSync(path.join(DIR,'reading-content-v2-days11-100-builder.js'),'utf8'), context, {filename:'reading-content-v2-days11-100-builder.js'});
vm.runInContext(fs.readFileSync(path.join(DIR,'reading-content-v2-generated-compact-patch.js'),'utf8'), context, {filename:'reading-content-v2-generated-compact-patch.js'});
const master = JSON.parse(fs.readFileSync(MASTER_FILE, 'utf8'));
context.__MASTER__ = master;
vm.runInContext('TOEIC_READING_V2_BUILDER.attach(TOEIC_READING_V2_BUILDER.build(__MASTER__)); globalThis.__READING_V2__ = TOEIC_READING_V2; globalThis.__TEPS_V2__ = TEPS_READING_EXTENSION_V2;', context);
const program = context.__READING_V2__;
const teps = context.__TEPS_V2__;

function normalizeText(text = '') {
  return String(text).toLowerCase().replace(/[’‘]/g, "'").replace(/[–—]/g, '-').replace(/[^a-z0-9'\-\s]/g, ' ').replace(/\s+/g, ' ').trim();
}
function requiredExposure(item) {
  const roles = item.roles || [];
  let n = 1;
  if (roles.includes('toeic-specific')) n = Math.max(n,4);
  if (roles.includes('general-core')) n = Math.max(n,3);
  if (roles.includes('academic-book-extension')) n = Math.max(n,2);
  return n;
}
function makeCounter(text) {
  const counter = new Map();
  if (!text) return counter;
  for (const token of text.split(' ')) counter.set(token,(counter.get(token)||0)+1);
  return counter;
}
function phraseCount(text, phrase) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.match(new RegExp(`(?:^|\\s)${escaped}(?=\\s|$)`, 'g'))?.length || 0;
}

const dayIndex = new Map();
for (const day of (program.days || [])) {
  const reading = (day.reading?.paragraphs || []).join(' ');
  const practice = [...(day.practice?.part5 || []),...(day.practice?.part6 || []),...(day.practice?.part7 || [])].flatMap(q => [q.question, ...(q.options || [])]).join(' ');
  const analysis = [...(day.sentenceLab || []).map(x => x.sentence),...(day.sentenceStructures || []).map(x => x.example)].join(' ');
  const tepsDay = (teps.days || []).find(x => x.day === day.day);
  const tepsText = tepsDay ? [tepsDay.passage,...(tepsDay.questions||[]).flatMap(q=>[q.question,...(q.options||[])]),...(tepsDay.vocabulary||[]).flat()].join(' ') : '';
  const text = normalizeText(`${reading} ${practice} ${analysis} ${tepsText}`);
  dayIndex.set(day.day,{text,counter:makeCounter(text)});
}

const auditEntries = [];
for (const item of (master.entries || [])) {
  const forms = [...new Set((item.forms || [item.lemma]).map(normalizeText).filter(Boolean))];
  const single = forms.filter(x=>!x.includes(' '));
  const phrases = forms.filter(x=>x.includes(' '));
  let total = 0;
  const days = [];
  for (const [day,index] of dayIndex.entries()) {
    let dayCount = 0;
    for (const form of single) dayCount += index.counter.get(form) || 0;
    for (const form of phrases) dayCount += phraseCount(index.text,form);
    if (dayCount > 0) { total += dayCount; days.push({day,count:dayCount}); }
  }
  const required = requiredExposure(item);
  auditEntries.push({
    id:item.id,lemma:item.lemma,sourceLists:item.sourceLists,roles:item.roles,
    requiredExposure:required,exposureCount:total,meetsMinimum:total>=required,
    exposureDays:days.map(d=>d.day),dayCounts:days,seenByDay80:days.some(d=>d.day<=80)
  });
}

const present = auditEntries.filter(x=>x.exposureCount>0);
const missing = auditEntries.filter(x=>x.exposureCount===0);
const missingBy80 = auditEntries.filter(x=>!x.seenByDay80);
const belowMinimum = auditEntries.filter(x=>!x.meetsMinimum);
const byRole = {};
for (const role of ['general-core','toeic-specific','academic-book-extension']) {
  const items = auditEntries.filter(x=>(x.roles||[]).includes(role));
  const seen = items.filter(x=>x.exposureCount>0);
  const below = items.filter(x=>!x.meetsMinimum);
  byRole[role] = {total:items.length,seen:seen.length,missing:items.length-seen.length,belowMinimum:below.length,coveragePercent:items.length?Number((seen.length/items.length*100).toFixed(2)):0};
}

const dayCount = program.days?.length || 0;
const expectedDays = 100;
const tepsDayCount = teps.days?.length || 0;
const finished = dayCount === expectedDays && tepsDayCount === expectedDays;
const report = {
  generatedAt:new Date().toISOString(),staged:!finished,dayCount,expectedDays,tepsDayCount,
  masterHeadwords:auditEntries.length,seenHeadwords:present.length,missingHeadwords:missing.length,
  missingByDay80:missingBy80.length,belowMinimumExposure:belowMinimum.length,
  headwordCoveragePercent:auditEntries.length?Number((present.length/auditEntries.length*100).toFixed(2)):0,
  byRole,
  repetition:{seenAtLeast2:auditEntries.filter(x=>x.exposureCount>=2).length,seenAtLeast3:auditEntries.filter(x=>x.exposureCount>=3).length,seenAtLeast4:auditEntries.filter(x=>x.exposureCount>=4).length,seenAtLeast8:auditEntries.filter(x=>x.exposureCount>=8).length},
  missing:missing.map(x=>({lemma:x.lemma,sourceLists:x.sourceLists,roles:x.roles})),
  missingBy80:missingBy80.map(x=>({lemma:x.lemma,roles:x.roles})),
  belowMinimum:belowMinimum.map(x=>({lemma:x.lemma,roles:x.roles,requiredExposure:x.requiredExposure,exposureCount:x.exposureCount})),
  entries:auditEntries
};
fs.writeFileSync(OUTPUT_JSON, JSON.stringify(report,null,2)+'\n');
const pass = finished && !missing.length && !missingBy80.length && !belowMinimum.length;
const md = `# Reading V2 Master Coverage — Final 100 Days\n\n- 생성일: ${report.generatedAt}\n- V2 작성일수: ${dayCount}/${expectedDays}\n- TEPS 확장 작성일수: ${tepsDayCount}/${expectedDays}\n- 마스터 headword: ${report.masterHeadwords}\n- 등장 headword: ${report.seenHeadwords}\n- 미등장 headword: ${report.missingHeadwords}\n- DAY 080까지 미등장: ${report.missingByDay80}\n- 최종 최소 반복 미달: ${report.belowMinimumExposure}\n- headword coverage: ${report.headwordCoveragePercent}%\n- 2회 이상: ${report.repetition.seenAtLeast2}\n- 3회 이상: ${report.repetition.seenAtLeast3}\n- 4회 이상: ${report.repetition.seenAtLeast4}\n- 8회 이상: ${report.repetition.seenAtLeast8}\n\n## 역할별\n\n${Object.entries(report.byRole).map(([role,v])=>`- ${role}: ${v.seen}/${v.total} (${v.coveragePercent}%), 미등장 ${v.missing}, 최종 반복기준 미달 ${v.belowMinimum}`).join('\n')}\n\n## 최종 기준\n\n- 모든 마스터 headword는 DAY 080까지 최소 1회 노출\n- TOEIC-specific 최소 4회\n- general-core 최소 3회\n- academic-book-extension 최소 2회\n\n## 판정\n\n${pass ? 'PASS — 100일 전체 커버리지와 반복기준을 충족했다.' : 'FAIL — 누락 또는 반복기준 미달 항목을 보정해야 한다.'}\n`;
fs.writeFileSync(OUTPUT_MD,md);
console.log(md);
if (finished && !pass) process.exitCode=1;
