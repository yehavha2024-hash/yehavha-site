import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const DIR = path.join(process.cwd(), 'toeic-human-100');
const readingFiles = [
  'reading-content-v2.js',
  'reading-content-v2-days02-04.js',
  'reading-content-v2-days05-07.js',
  'reading-content-v2-days08-10.js',
  'reading-content-v2-length-patch.js'
];
const context = { console };
vm.createContext(context);
for (const file of readingFiles) {
  vm.runInContext(fs.readFileSync(path.join(DIR,file),'utf8'), context, {filename:file});
}
vm.runInContext(fs.readFileSync(path.join(DIR,'teps-extension-v2.js'),'utf8'), context, {filename:'teps-extension-v2.js'});
vm.runInContext(fs.readFileSync(path.join(DIR,'teps-extension-length-patch.js'),'utf8'), context, {filename:'teps-extension-length-patch.js'});
vm.runInContext(fs.readFileSync(path.join(DIR,'reading-content-v2-days11-100-builder.js'),'utf8'), context, {filename:'reading-content-v2-days11-100-builder.js'});
context.__MASTER__ = JSON.parse(fs.readFileSync(path.join(DIR,'master-lexicon-v2.json'),'utf8'));
vm.runInContext('TOEIC_READING_V2_BUILDER.attach(TOEIC_READING_V2_BUILDER.build(__MASTER__));', context);
vm.runInContext('globalThis.__PROGRAM__ = TOEIC_READING_V2; globalThis.__TEPS__ = TEPS_READING_EXTENSION_V2;', context);
const program = context.__PROGRAM__;
const teps = context.__TEPS__;

const countWords = text => String(text || '').trim().split(/\s+/).filter(Boolean).length;
const errors = [];
const warnings = [];
const stats = [];
const ids = new Set();

for (let dayNo=1; dayNo<=100; dayNo++) {
  const day = program.days.find(d=>d.day===dayNo);
  if (!day) { errors.push(`DAY ${dayNo} missing`); continue; }
  if (ids.has(day.day)) errors.push(`duplicate DAY ${day.day}`);
  ids.add(day.day);
  const paragraphs = day.reading?.paragraphs || [];
  const readingWords = countWords(paragraphs.join(' '));
  const t = teps.days.find(d=>d.day===dayNo);
  const tepsWords = countWords(t?.passage || '');
  stats.push({day:dayNo,toeicWords:readingWords,paragraphs:paragraphs.length,tepsWords,tepsQuestions:t?.questions?.length||0,coverageTargets:day.coverage?.targetCount||0});
  if (readingWords < 1350 || readingWords > 1650) errors.push(`DAY ${dayNo}: TOEIC reading ${readingWords} words, expected 1350-1650`);
  if (paragraphs.length < 8) errors.push(`DAY ${dayNo}: paragraphs ${paragraphs.length}, minimum 8`);
  if (!Array.isArray(day.blocks) || day.blocks.join(',') !== 'read,analyze,apply') errors.push(`DAY ${dayNo}: completion blocks invalid`);
  if (!t) errors.push(`DAY ${dayNo}: TEPS extension missing`);
  else {
    if (tepsWords < 180) errors.push(`DAY ${dayNo}: TEPS extension too short (${tepsWords})`);
    if ((t.questions?.length||0) < 3) errors.push(`DAY ${dayNo}: TEPS questions fewer than 3`);
    if ((t.vocabulary?.length||0) < 6) errors.push(`DAY ${dayNo}: TEPS vocabulary fewer than 6`);
  }
}

const generated = stats.filter(x=>x.day>=11);
const report = {
  generatedAt:new Date().toISOString(),
  daysValidated:100,
  generatedDays:generated.length,
  generatedWordRange:generated.length ? {min:Math.min(...generated.map(x=>x.toeicWords)),max:Math.max(...generated.map(x=>x.toeicWords))} : null,
  generatedTepsWordRange:generated.length ? {min:Math.min(...generated.map(x=>x.tepsWords)),max:Math.max(...generated.map(x=>x.tepsWords))} : null,
  stats,warnings,errors
};
fs.writeFileSync(path.join(DIR,'READING_V2_EXPANDED_VALIDATION.json'), JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({daysValidated:report.daysValidated,generatedDays:report.generatedDays,generatedWordRange:report.generatedWordRange,generatedTepsWordRange:report.generatedTepsWordRange,errorCount:errors.length,errors:errors.slice(0,30)},null,2));
if (errors.length) process.exit(1);
