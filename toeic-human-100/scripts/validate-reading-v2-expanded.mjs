import fs from 'node:fs';
import path from 'node:path';
import { loadToeicRuntime } from './runtime-v2-loader.mjs';

const DIR = path.join(process.cwd(), 'toeic-human-100');
const { program, teps, runtimeFiles } = loadToeicRuntime(DIR);

const countWords = text => String(text || '').trim().split(/\s+/).filter(Boolean).length;
const errors = [];
const warnings = [];
const stats = [];
const ids = new Set();

if (!program || !Array.isArray(program.days)) errors.push('TOEIC runtime program missing');
if (!teps || !Array.isArray(teps.days)) errors.push('TEPS runtime extension missing');

for (let dayNo = 1; dayNo <= 100; dayNo += 1) {
  const day = program?.days?.find(d => d.day === dayNo);
  if (!day) { errors.push(`DAY ${dayNo} missing`); continue; }
  if (ids.has(day.day)) errors.push(`duplicate DAY ${day.day}`);
  ids.add(day.day);

  const paragraphs = day.reading?.paragraphs || [];
  const readingWords = countWords(paragraphs.join(' '));
  const t = teps?.days?.find(d => d.day === dayNo);
  const tepsWords = countWords(t?.passage || '');
  const vocabCount = day.vocabulary?.length || 0;
  const phraseCount = day.expressions?.length || 0;
  const grammarCount = day.grammar?.length || 0;

  stats.push({
    day: dayNo,
    toeicWords: readingWords,
    paragraphs: paragraphs.length,
    tepsWords,
    tepsQuestions: t?.questions?.length || 0,
    vocabCount,
    phraseCount,
    grammarCount,
    newActiveHeadwords: day.coverage?.newActiveHeadwordCount || 0,
    lengthOwner: day.coverage?.lengthOwner || ''
  });

  if (readingWords < 500 || readingWords > 650) errors.push(`DAY ${dayNo}: TOEIC reading ${readingWords} words, expected 500-650`);
  if (paragraphs.length < 8) errors.push(`DAY ${dayNo}: paragraphs ${paragraphs.length}, minimum 8`);
  if (!Array.isArray(day.blocks) || day.blocks.join(',') !== 'read,analyze,apply') errors.push(`DAY ${dayNo}: completion blocks invalid`);
  if (phraseCount < 6) errors.push(`DAY ${dayNo}: expressions ${phraseCount}, minimum 6`);
  if (grammarCount < 3) errors.push(`DAY ${dayNo}: grammar ${grammarCount}, minimum 3`);
  if (day.coverage?.lengthOwner !== 'reading-length-normalizer') errors.push(`DAY ${dayNo}: final reading length owner missing or duplicated`);
  if (dayNo >= 11 && vocabCount < 28) errors.push(`DAY ${dayNo}: active vocabulary ${vocabCount}, minimum 28`);

  if (!t) errors.push(`DAY ${dayNo}: TEPS extension missing`);
  else {
    if (tepsWords < 180) errors.push(`DAY ${dayNo}: TEPS extension too short (${tepsWords})`);
    if ((t.questions?.length || 0) < 3) errors.push(`DAY ${dayNo}: TEPS questions fewer than 3`);
    if ((t.vocabulary?.length || 0) < 6) errors.push(`DAY ${dayNo}: TEPS vocabulary fewer than 6`);
  }
}

const generated = stats.filter(x => x.day >= 11);
const report = {
  generatedAt: new Date().toISOString(),
  design: 'focused-reading-v4',
  runtimeFiles,
  daysValidated: 100,
  generatedDays: generated.length,
  generatedWordRange: generated.length ? {
    min: Math.min(...generated.map(x => x.toeicWords)),
    max: Math.max(...generated.map(x => x.toeicWords))
  } : null,
  generatedVocabularyRange: generated.length ? {
    min: Math.min(...generated.map(x => x.vocabCount)),
    max: Math.max(...generated.map(x => x.vocabCount))
  } : null,
  generatedTepsWordRange: generated.length ? {
    min: Math.min(...generated.map(x => x.tepsWords)),
    max: Math.max(...generated.map(x => x.tepsWords))
  } : null,
  stats,
  warnings,
  errors
};

fs.writeFileSync(path.join(DIR, 'READING_V2_EXPANDED_VALIDATION.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  daysValidated: report.daysValidated,
  generatedDays: report.generatedDays,
  generatedWordRange: report.generatedWordRange,
  generatedVocabularyRange: report.generatedVocabularyRange,
  errorCount: errors.length,
  errors: errors.slice(0, 30)
}, null, 2));
if (errors.length) process.exit(1);
