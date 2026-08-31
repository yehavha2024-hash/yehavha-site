import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const config = JSON.parse(await fs.readFile(path.join(root, 'collector-config.json'), 'utf8'));
const targetPath = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : path.join(root, 'legislation.json');
const data = JSON.parse(await fs.readFile(targetPath, 'utf8'));
const allowedSources = new Set(['assembly', 'government']);
const allowedTopics = new Set((config.topicRules || []).map(rule => rule.topic));
const seen = new Set();
const datePattern = /^20\d{2}-\d{2}-\d{2}$/;

if (!Array.isArray(data.records)) throw new Error('records[] is required.');
for (const record of data.records) {
  if (!allowedSources.has(record.sourceType)) throw new Error(`Invalid sourceType: ${record.sourceType}`);
  if (!record.sourceId) throw new Error('sourceId is required.');
  const key = `${record.sourceType}:${record.sourceId}`;
  if (record.recordKey && record.recordKey !== key) throw new Error(`recordKey mismatch: ${record.recordKey} !== ${key}`);
  if (seen.has(key)) throw new Error(`Duplicate legislation record: ${key}`);
  seen.add(key);
  if (!record.title) throw new Error(`title is required: ${key}`);
  if (!record.statusLabel) throw new Error(`statusLabel is required: ${key}`);
  if (record.statusDate && !datePattern.test(record.statusDate)) throw new Error(`Invalid statusDate: ${key}`);
  if (record.proposedAt && !datePattern.test(record.proposedAt)) throw new Error(`Invalid proposedAt: ${key}`);
  if (record.noticeStart && !datePattern.test(record.noticeStart)) throw new Error(`Invalid noticeStart: ${key}`);
  if (record.noticeEnd && !datePattern.test(record.noticeEnd)) throw new Error(`Invalid noticeEnd: ${key}`);
  if (!Array.isArray(record.topics) || !record.topics.length) throw new Error(`topics[] required: ${key}`);
  for (const topic of record.topics) if (!allowedTopics.has(topic)) throw new Error(`Unknown topic '${topic}' in ${key}`);
  if (record.sourceUrl && !/^https:\/\//.test(record.sourceUrl)) throw new Error(`Invalid sourceUrl: ${key}`);
}

console.log(`Legislation audit passed: ${data.records.length} unique record(s).`);
