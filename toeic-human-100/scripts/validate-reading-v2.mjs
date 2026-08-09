import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();
const DIR = path.join(ROOT, 'toeic-human-100');
const PROGRAM_FILE = path.join(DIR, 'reading-content-v2.js');

if (!fs.existsSync(PROGRAM_FILE)) {
  console.log('V2 validator ready: reading-content-v2.js has not been created yet.');
  process.exit(0);
}

const source = fs.readFileSync(PROGRAM_FILE, 'utf8');
const context = {};
vm.createContext(context);
vm.runInContext(`${source}\nglobalThis.__READING_V2__ = TOEIC_READING_V2;`, context, { filename: PROGRAM_FILE });
const program = context.__READING_V2__;

if (!program || typeof program !== 'object') throw new Error('TOEIC_READING_V2 missing');
if (!Array.isArray(program.days)) throw new Error('TOEIC_READING_V2.days must be an array');

const meta = program.meta || {};
const targetMin = Number(meta.minWords || 1350);
const targetMax = Number(meta.maxWords || 1650);
const expectedDays = Number(meta.totalDays || 100);

function wordCount(text = '') {
  return String(text)
    .replace(/[“”‘’]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

const errors = [];
const warnings = [];
const dayNumbers = new Set();
const exposures = new Map();
const grammarSeen = new Map();
const structuresSeen = new Map();
const questionTypesSeen = new Map();
const genresSeen = new Map();

for (const day of program.days) {
  if (!Number.isInteger(day.day) || day.day < 1 || day.day > expectedDays) {
    errors.push(`invalid day number: ${day.day}`);
    continue;
  }
  if (dayNumbers.has(day.day)) errors.push(`duplicate DAY ${day.day}`);
  dayNumbers.add(day.day);

  const paragraphs = Array.isArray(day.reading?.paragraphs) ? day.reading.paragraphs : [];
  const text = paragraphs.join('\n\n');
  const count = wordCount(text);
  if (count < targetMin || count > targetMax) {
    errors.push(`DAY ${day.day}: reading ${count} words, expected ${targetMin}-${targetMax}`);
  }
  if (paragraphs.length < 8) errors.push(`DAY ${day.day}: at least 8 paragraphs required`);

  const blocks = Array.isArray(day.blocks) ? day.blocks : [];
  const requiredBlocks = ['read','analyze','apply'];
  for (const block of requiredBlocks) {
    if (!blocks.includes(block)) errors.push(`DAY ${day.day}: missing completion block '${block}'`);
  }
  if (new Set(blocks).size !== 3) errors.push(`DAY ${day.day}: completion blocks must be exactly 3`);

  const lexicon = [
    ...(Array.isArray(day.vocabulary) ? day.vocabulary : []),
    ...(Array.isArray(day.expressions) ? day.expressions : [])
  ];
  for (const item of lexicon) {
    const key = normalize(item.id || item.lemma || item.title);
    if (!key) continue;
    exposures.set(key, (exposures.get(key) || 0) + 1);
  }

  for (const item of (day.grammar || [])) {
    const key = normalize(item.id || item.title);
    if (key) grammarSeen.set(key, (grammarSeen.get(key) || 0) + 1);
  }
  for (const item of (day.sentenceStructures || [])) {
    const key = normalize(item.id || item.title);
    if (key) structuresSeen.set(key, (structuresSeen.get(key) || 0) + 1);
  }
  for (const item of (day.practice?.part7 || [])) {
    const key = normalize(item.type);
    if (key) questionTypesSeen.set(key, (questionTypesSeen.get(key) || 0) + 1);
    if (!item.explanation?.trim()) errors.push(`DAY ${day.day}: Part 7 explanation missing`);
    if (!item.evidence?.trim()) warnings.push(`DAY ${day.day}: Part 7 evidence missing`);
  }
  const genre = normalize(day.genre);
  if (genre) genresSeen.set(genre, (genresSeen.get(genre) || 0) + 1);
}

if (program.days.length === expectedDays) {
  for (let day = 1; day <= expectedDays; day += 1) {
    if (!dayNumbers.has(day)) errors.push(`DAY ${day} missing`);
  }
} else {
  warnings.push(`V2 is in staged build: ${program.days.length}/${expectedDays} days present`);
}

const master = program.masterCoverage || {};
function checkMaster(items, seenMap, label) {
  for (const item of (items || [])) {
    const id = normalize(item.id || item.lemma || item.title || item);
    if (!id) continue;
    const count = seenMap.get(id) || 0;
    const min = Number(item.minExposure || 1);
    if (count < min) errors.push(`${label} '${id}': exposure ${count}, minimum ${min}`);
  }
}
checkMaster(master.lexicon, exposures, 'lexicon');
checkMaster(master.grammar, grammarSeen, 'grammar');
checkMaster(master.sentenceStructures, structuresSeen, 'sentence structure');
checkMaster(master.questionTypes, questionTypesSeen, 'question type');

const report = {
  generatedAt: new Date().toISOString(),
  totalDaysPresent: program.days.length,
  expectedDays,
  wordRange: [targetMin, targetMax],
  uniqueLexicalItemsTagged: exposures.size,
  grammarPatternsTagged: grammarSeen.size,
  sentenceStructuresTagged: structuresSeen.size,
  questionTypesTagged: questionTypesSeen.size,
  genreTypesUsed: genresSeen.size,
  warnings,
  errors
};

fs.writeFileSync(path.join(DIR, 'READING_V2_VALIDATION.json'), JSON.stringify(report, null, 2) + '\n');

if (errors.length) {
  console.error(JSON.stringify(report, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(report, null, 2));
