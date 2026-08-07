import fs from 'node:fs';
import vm from 'node:vm';

const files = [
  'ai-law-tech-foresight/data.js',
  'ai-law-tech-foresight/academic-meta.js',
  'ai-law-tech-foresight/academic-data-1.js',
  'ai-law-tech-foresight/academic-data-2.js',
  'ai-law-tech-foresight/academic-data-3.js'
];

const context = { window: {}, console };
vm.createContext(context);
for (const file of files) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename:file });
}

const records = context.window.AI_FORESIGHT_RECORDS || [];
const required = [
  'technical','currentLawAnalysis','legalIssuesAnalysis','doctrineAnalysis','gapAnalysis',
  'comparativeAnalysis','liabilityEvidence','policyAnalysis','legislationAnalysis'
];

const errors = [];
if (records.length !== 14) errors.push(`Expected 14 technology records, found ${records.length}.`);

for (const item of records) {
  if (!item.researchQuestion || item.researchQuestion.trim().length < 30) errors.push(`${item.id}: researchQuestion is missing or too short.`);
  if (!item.academic) {
    errors.push(`${item.id}: academic section missing.`);
    continue;
  }
  for (const key of required) {
    const paragraphs = item.academic[key];
    if (!Array.isArray(paragraphs) || paragraphs.length < 2) errors.push(`${item.id}: ${key} must contain at least two substantive paragraphs.`);
  }
  if (!Array.isArray(item.sources) || item.sources.length < 2) errors.push(`${item.id}: official/comparative sources are insufficient.`);
}

const flow = context.window.AI_FORESIGHT_META?.researchFlow || [];
if (flow.length !== 9 || !flow.includes('책임·증명구조')) errors.push('Academic researchFlow is not aligned with the nine-stage standard.');

if (errors.length) {
  console.error('AI foresight academic validation failed:');
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`AI foresight academic validation passed: ${records.length} records, 9 academic sections each.`);