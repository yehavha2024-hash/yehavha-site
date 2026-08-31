import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const target = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : path.join(root, 'legal-people.json');
const data = JSON.parse(await fs.readFile(target, 'utf8'));
const allowed = new Set(['인사', '이동·개업', '연구·학술', '법률시장']);
const seen = new Set();
const datePattern = /^20\d{2}-\d{2}-\d{2}$/;

if (!Array.isArray(data.records)) throw new Error('records[] is required.');
for (const record of data.records) {
  if (!record.recordKey?.startsWith('legalpeople:')) throw new Error(`Invalid recordKey: ${record.recordKey}`);
  if (seen.has(record.recordKey)) throw new Error(`Duplicate recordKey: ${record.recordKey}`);
  seen.add(record.recordKey);
  if (!allowed.has(record.category)) throw new Error(`Invalid category: ${record.category}`);
  if (!record.source || !record.title) throw new Error(`source/title required: ${record.recordKey}`);
  if (record.publishedAt && !datePattern.test(record.publishedAt)) throw new Error(`Invalid publishedAt: ${record.recordKey}`);
  if (record.effectiveAt && !datePattern.test(record.effectiveAt)) throw new Error(`Invalid effectiveAt: ${record.recordKey}`);
  if (!Array.isArray(record.tags)) throw new Error(`tags[] required: ${record.recordKey}`);
  if (!/^https:\/\//.test(record.sourceUrl || '')) throw new Error(`Valid sourceUrl required: ${record.recordKey}`);
  if (/(부음|부고|결혼|화촉|모친상|부친상|장모상|장인상)/.test(record.title)) throw new Error(`Excluded personal event found: ${record.recordKey}`);
}

console.log(`Legal people audit passed: ${data.records.length} unique record(s).`);
