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
const context = {};
vm.createContext(context);
for (const file of readingFiles) {
  const src = fs.readFileSync(path.join(DIR,file),'utf8');
  vm.runInContext(src, context, {filename:file});
}
vm.runInContext('globalThis.__PROGRAM__ = TOEIC_READING_V2;', context);
const program = context.__PROGRAM__;

vm.runInContext(fs.readFileSync(path.join(DIR,'teps-extension-v2.js'),'utf8'), context, {filename:'teps-extension-v2.js'});
vm.runInContext(fs.readFileSync(path.join(DIR,'teps-extension-length-patch.js'),'utf8'), context, {filename:'teps-extension-length-patch.js'});
vm.runInContext('globalThis.__TEPS__ = TEPS_READING_EXTENSION_V2;', context);
const teps = context.__TEPS__;

const countWords = text => String(text || '').trim().split(/\s+/).filter(Boolean).length;
const errors = [];
const warnings = [];
const stats = [];
const ids = new Set();

for (let dayNo=1; dayNo<=10; dayNo++) {
  const day = program.days.find(d=>d.day===dayNo);
  if (!day) { errors.push(`DAY ${dayNo} missing`); continue; }
  if (ids.has(day.day)) errors.push(`duplicate DAY ${day.day}`);
  ids.add(day.day);
  const paragraphs = day.reading?.paragraphs || [];
  const words = countWords(paragraphs.join(' '));
  const t = teps.days.find(d=>d.day===dayNo);
  const tepsWords = countWords(t?.passage || '');
  stats.push({day:dayNo,toeicWords:words,paragraphs:paragraphs.length,tepsWords,tepsQuestions:t?.questions?.length||0});
  if (words < 1350 || words > 1650) errors.push(`DAY ${dayNo}: TOEIC reading ${words} words, expected 1350-1650`);
  if (paragraphs.length < 8) errors.push(`DAY ${dayNo}: paragraphs ${paragraphs.length}, minimum 8`);
  if (!Array.isArray(day.blocks) || day.blocks.join(',') !== 'read,analyze,apply') errors.push(`DAY ${dayNo}: completion blocks invalid`);
  if (!t) errors.push(`DAY ${dayNo}: TEPS extension missing`);
  else {
    if (tepsWords < 180) errors.push(`DAY ${dayNo}: TEPS extension too short (${tepsWords})`);
    if ((t.questions?.length||0) < 3) errors.push(`DAY ${dayNo}: TEPS questions fewer than 3`);
    if ((t.vocabulary?.length||0) < 6) errors.push(`DAY ${dayNo}: TEPS vocabulary fewer than 6`);
  }
}

const report = {generatedAt:new Date().toISOString(),daysValidated:10,stats,warnings,errors};
fs.writeFileSync(path.join(DIR,'READING_V2_EXPANDED_VALIDATION.json'), JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if (errors.length) process.exit(1);
