import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.resolve(here, '..', 'legislation.json');
const inputPath = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : null;

if (!inputPath) {
  console.error('Usage: node nexus/legal-intelligence/scripts/upsert-legislation.mjs <verified-records.json>');
  process.exit(1);
}

const readJson = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const data = await readJson(dataPath);
const incomingRaw = await readJson(inputPath);
const incoming = Array.isArray(incomingRaw) ? incomingRaw : incomingRaw.records;

if (!Array.isArray(incoming) || !incoming.length) {
  throw new Error('Input must be a non-empty array or an object with records[].');
}

function expectedKey(record) {
  if (!record?.sourceType || !record?.sourceId) throw new Error('sourceType and sourceId are required.');
  return `${record.sourceType}:${record.sourceId}`;
}

function mergeHistory(previous = [], next = []) {
  const map = new Map();
  for (const item of [...previous, ...next]) {
    if (!item?.date || !item?.stage) continue;
    map.set(`${item.date}|${item.stage}`, {date: item.date, stage: item.stage});
  }
  return [...map.values()].sort((a, b) => `${a.date}|${a.stage}`.localeCompare(`${b.date}|${b.stage}`));
}

const records = Array.isArray(data.records) ? data.records : [];
const byKey = new Map(records.map(record => [record.recordKey, record]));

for (const patch of incoming) {
  const key = expectedKey(patch);
  if (patch.recordKey && patch.recordKey !== key) {
    throw new Error(`recordKey mismatch: ${patch.recordKey} !== ${key}`);
  }
  const previous = byKey.get(key);
  const merged = {
    ...(previous || {}),
    ...patch,
    recordKey: key,
    history: mergeHistory(previous?.history, patch.history)
  };
  byKey.set(key, merged);
}

const updatedRecords = [...byKey.values()].sort((a, b) => {
  const typeOrder = {assembly: 0, government: 1};
  const typeDiff = (typeOrder[a.sourceType] ?? 9) - (typeOrder[b.sourceType] ?? 9);
  if (typeDiff) return typeDiff;
  return String(b.statusDate || '').localeCompare(String(a.statusDate || '')) || String(a.recordKey).localeCompare(String(b.recordKey));
});

const keySet = new Set();
for (const record of updatedRecords) {
  const key = expectedKey(record);
  if (record.recordKey !== key) throw new Error(`Invalid canonical key: ${record.recordKey}`);
  if (keySet.has(key)) throw new Error(`Duplicate legislation key: ${key}`);
  keySet.add(key);
}

const seoulDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'
}).format(new Date());

const output = {...data, updatedAt: incomingRaw.updatedAt || seoulDate, records: updatedRecords};
await fs.writeFile(dataPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`Updated ${incoming.length} record(s); canonical total ${updatedRecords.length}.`);
