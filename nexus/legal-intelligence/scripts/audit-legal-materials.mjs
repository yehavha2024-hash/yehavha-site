import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const target = path.resolve(here, '..', 'legal-materials.json');
const data = JSON.parse(await fs.readFile(target, 'utf8'));
const allowedTypes = new Set(['판례', '헌재결정', '법령', '연구자료']);
const datePattern = /^20\d{2}-\d{2}-\d{2}$/;
const seenKeys = new Set();
const seenRefs = new Set();

if (!Array.isArray(data.records)) throw new Error('legal-materials records[] is required.');
if (!data.records.length) throw new Error('legal-materials must contain at least one record.');

for (const record of data.records) {
  const key = String(record.recordKey || '').trim();
  if (!key) throw new Error('recordKey is required.');
  if (seenKeys.has(key)) throw new Error(`Duplicate recordKey: ${key}`);
  seenKeys.add(key);

  if (!allowedTypes.has(record.type)) throw new Error(`Invalid type in ${key}: ${record.type}`);
  for (const field of ['source', 'title', 'reference', 'date', 'result', 'summary', 'legalPoint']) {
    if (!String(record[field] || '').trim()) throw new Error(`${field} is required: ${key}`);
  }
  if (!datePattern.test(record.date)) throw new Error(`Invalid date: ${key}`);
  if (!Array.isArray(record.topics) || !record.topics.length) throw new Error(`topics[] required: ${key}`);
  if (!/^https:\/\//.test(String(record.sourceUrl || ''))) throw new Error(`HTTPS sourceUrl required: ${key}`);

  const referenceKey = `${record.type}|${String(record.reference).replace(/\s+/g, ' ').trim()}`;
  if (seenRefs.has(referenceKey)) throw new Error(`Duplicate type/reference: ${referenceKey}`);
  seenRefs.add(referenceKey);

  if (String(record.summary).trim().length < 40) throw new Error(`summary too short: ${key}`);
  if (String(record.legalPoint).trim().length < 30) throw new Error(`legalPoint too short: ${key}`);
}

console.log(`Legal materials audit passed: ${data.records.length} unique record(s).`);
