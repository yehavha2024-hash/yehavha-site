import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const canonicalPath = path.join(root, 'legal-materials.json');
const additionsPath = path.join(root, 'legal-materials-additions.json');

const canonical = JSON.parse(await fs.readFile(canonicalPath, 'utf8'));
const additions = JSON.parse(await fs.readFile(additionsPath, 'utf8'));
const baseRecords = Array.isArray(canonical.records) ? canonical.records : [];
const newRecords = Array.isArray(additions.records) ? additions.records : [];
const clean = value => String(value ?? '').replace(/\s+/g, ' ').trim();
const referenceKey = record => `${clean(record.type)}|${clean(record.reference)}`;

const byReference = new Map();
for (const record of baseRecords) byReference.set(referenceKey(record), {...record});

let added = 0;
let updated = 0;
for (const record of newRecords) {
  const key = referenceKey(record);
  const previous = byReference.get(key);
  if (previous) {
    byReference.set(key, {
      ...previous,
      ...record,
      recordKey: previous.recordKey || record.recordKey,
      topics: [...new Set([...(previous.topics || []), ...(record.topics || [])])],
      active: record.active !== false
    });
    updated += 1;
  } else {
    byReference.set(key, {...record});
    added += 1;
  }
}

const typeOrder = {'판례': 0, '헌재결정': 1, '법령': 2, '연구자료': 3};
const records = [...byReference.values()].sort((a, b) => {
  const typeDiff = (typeOrder[a.type] ?? 9) - (typeOrder[b.type] ?? 9);
  if (typeDiff) return typeDiff;
  return String(b.date || '').localeCompare(String(a.date || '')) || String(a.reference || '').localeCompare(String(b.reference || ''));
});

const today = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'
}).format(new Date());
const output = {...canonical, updatedAt: today, records};
const before = JSON.stringify(canonical.records || []);
const after = JSON.stringify(records);
if (before !== after) await fs.writeFile(canonicalPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`Legal material merge complete: base=${baseRecords.length}, additions=${newRecords.length}, added=${added}, updated=${updated}, total=${records.length}.`);
