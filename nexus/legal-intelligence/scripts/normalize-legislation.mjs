import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.resolve(here, '..', 'legislation.json');
const data = JSON.parse(await fs.readFile(dataPath, 'utf8'));
const clean = value => value == null ? '' : String(value).replace(/\s+/g, ' ').trim();

function governmentTitleKey(title) {
  return clean(title)
    .replace(/\s+(일부|전부)?개정(?:법률|령|규칙)?안$/u, '')
    .replace(/\s+제정(?:법률|령|규칙)?안$/u, '')
    .replace(/\s+개정안$/u, '')
    .replace(/\s+/g, '')
    .toLocaleLowerCase('ko-KR');
}

function genericSummary(value) {
  const text = clean(value);
  return !text || /공식 (국회|정부|법제처).*자동 선별|공식 공개자료에서 .* 확인된/u.test(text);
}

function mergeUnique(previous = [], next = [], keyFn) {
  const map = new Map();
  for (const item of [...previous, ...next]) {
    if (!item) continue;
    const key = keyFn(item);
    if (key) map.set(key, item);
  }
  return [...map.values()];
}

function richness(record) {
  let score = 0;
  if (!/^200\d{10,}$/.test(clean(record.sourceId))) score += 5;
  if (!genericSummary(record.summary)) score += 4;
  if (record.mainContent) score += 3;
  if (record.amendmentReason) score += 3;
  if (record.department) score += 1;
  if (Array.isArray(record.processStages) && record.processStages.length) score += 2;
  if (Array.isArray(record.documents) && record.documents.length) score += 2;
  if (record.noticeStart || record.noticeEnd || record.announcementNo) score += 1;
  return score;
}

function laterRecord(a, b) {
  return String(b.statusDate || '').localeCompare(String(a.statusDate || '')) > 0 ? b : a;
}

function mergeGovernment(group) {
  const ranked = [...group].sort((a, b) => richness(b) - richness(a));
  const canonical = {...ranked[0]};
  const latest = group.reduce((best, item) => laterRecord(best, item), group[0]);
  const longIdRecord = group.find(item => /^200\d{10,}$/.test(clean(item.officialLbicId || item.sourceId)));
  const officialLbicId = clean(longIdRecord?.officialLbicId || longIdRecord?.sourceId || canonical.officialLbicId);

  const detailed = group.find(item => item.mainContent || item.amendmentReason || item.processStages?.length || item.documents?.length) || canonical;
  const curatedSummary = group.find(item => !genericSummary(item.summary))?.summary;
  const fullerTitle = [...group].map(item => clean(item.title)).sort((a, b) => b.length - a.length)[0] || canonical.title;

  const merged = {
    ...canonical,
    title: fullerTitle,
    ministry: clean(detailed.ministry || canonical.ministry),
    department: clean(detailed.department || canonical.department) || undefined,
    lawType: clean(detailed.lawType || canonical.lawType),
    revisionType: clean(detailed.revisionType || canonical.revisionType) || undefined,
    statusCode: latest.statusCode || canonical.statusCode,
    statusLabel: latest.statusLabel || canonical.statusLabel,
    statusDate: latest.statusDate || canonical.statusDate,
    active: latest.active !== false,
    topics: mergeUnique([], group.flatMap(item => item.topics || []), item => clean(item)),
    history: mergeUnique([], group.flatMap(item => item.history || []), item => `${item.date}|${item.stage}`)
      .sort((a, b) => `${a.date}|${a.stage}`.localeCompare(`${b.date}|${b.stage}`)),
    processStages: mergeUnique([], group.flatMap(item => item.processStages || []), item => `${item.phase}|${item.stage}|${item.status}`),
    documents: mergeUnique([], group.flatMap(item => item.documents || []), item => `${item.url}|${item.name}`),
    summary: curatedSummary || detailed.mainContent || detailed.amendmentReason || canonical.summary
  };

  if (officialLbicId) merged.officialLbicId = officialLbicId;
  for (const field of ['mainContent', 'amendmentReason', 'legislativePlan', 'budgetRequired', 'plainLanguage', 'planIncluded', 'announcementNo', 'noticeStart', 'noticeEnd']) {
    const value = group.map(item => item[field]).find(Boolean);
    if (value) merged[field] = value;
  }
  merged.recordKey = `government:${merged.sourceId}`;
  return merged;
}

const records = Array.isArray(data.records) ? data.records : [];
const assembly = records.filter(record => record.sourceType !== 'government');
const government = records.filter(record => record.sourceType === 'government');
const groups = new Map();

for (const record of government) {
  const key = `${governmentTitleKey(record.title)}|${clean(record.ministry).toLocaleLowerCase('ko-KR')}|${clean(record.lawType).toLocaleLowerCase('ko-KR')}`;
  const list = groups.get(key) || [];
  list.push(record);
  groups.set(key, list);
}

let mergedCount = 0;
const normalizedGovernment = [];
for (const group of groups.values()) {
  if (group.length > 1) mergedCount += group.length - 1;
  normalizedGovernment.push(group.length > 1 ? mergeGovernment(group) : {...group[0], recordKey: `government:${group[0].sourceId}`});
}

const typeOrder = {assembly: 0, government: 1};
const outputRecords = [...assembly, ...normalizedGovernment].sort((a, b) => {
  const typeDiff = (typeOrder[a.sourceType] ?? 9) - (typeOrder[b.sourceType] ?? 9);
  if (typeDiff) return typeDiff;
  return String(b.statusDate || '').localeCompare(String(a.statusDate || '')) || String(a.recordKey || '').localeCompare(String(b.recordKey || ''));
});

const before = JSON.stringify(records);
const after = JSON.stringify(outputRecords);
if (before !== after) {
  const today = new Intl.DateTimeFormat('en-CA', {timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date());
  await fs.writeFile(dataPath, `${JSON.stringify({...data, updatedAt: today, records: outputRecords}, null, 2)}\n`, 'utf8');
}
console.log(`Legislation normalization complete: ${records.length} -> ${outputRecords.length}, merged duplicates=${mergedCount}.`);
