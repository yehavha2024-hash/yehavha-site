import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const briefDir = path.join(root, 'nexus', 'korea-social-intelligence');
const latestPath = path.join(briefDir, 'latest.json');
const archiveDir = path.join(briefDir, 'archive');
const indexPath = path.join(briefDir, 'archive-index.json');

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const stableJson = value => `${JSON.stringify(value, null, 2)}\n`;
const nonEmpty = value => typeof value === 'string' && value.trim().length > 0;

function validateSource(source, headline) {
  if (!source || !nonEmpty(source.label) || !nonEmpty(source.url)) {
    throw new Error(`Invalid source in: ${headline}`);
  }
  let url;
  try { url = new URL(source.url); } catch { throw new Error(`Invalid source URL in: ${headline}`); }
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error(`Unsupported source URL in: ${headline}`);
}

function validateBrief(brief) {
  if (brief?.schemaVersion !== 1) throw new Error('latest.json schemaVersion must be 1.');
  if (!/^20\d{2}-\d{2}-\d{2}$/.test(brief?.date || '')) throw new Error('latest.json requires YYYY-MM-DD date.');
  if (!brief.generatedAt || Number.isNaN(new Date(brief.generatedAt).getTime())) throw new Error('latest.json requires valid generatedAt.');
  if (!Array.isArray(brief.executiveSummary) || !brief.executiveSummary.some(nonEmpty)) throw new Error('Executive summary is required.');
  if (!Array.isArray(brief.sections) || !brief.sections.length) throw new Error('At least one section is required.');

  let itemCount = 0;
  for (const section of brief.sections) {
    if (!nonEmpty(section?.category)) throw new Error('Every section requires category.');
    if (!Array.isArray(section.items) || !section.items.length) continue;
    for (const item of section.items) {
      itemCount += 1;
      if (!nonEmpty(item?.headline) || !nonEmpty(item?.fact) || !nonEmpty(item?.why) || !nonEmpty(item?.impact) || !nonEmpty(item?.assessment)) {
        throw new Error(`Required analytical field missing: ${item?.headline || section.category}`);
      }
      if (!Array.isArray(item.sources) || !item.sources.length) throw new Error(`At least one source required: ${item.headline}`);
      item.sources.forEach(source => validateSource(source, item.headline));
    }
  }
  if (!itemCount) throw new Error('At least one briefing item is required.');
  if (!Array.isArray(brief.situationAssessment) || !brief.situationAssessment.some(nonEmpty)) throw new Error('Situation assessment is required.');

  const kstDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date(brief.generatedAt));
  if (kstDate !== brief.date) throw new Error(`date (${brief.date}) must match generatedAt KST date (${kstDate}).`);
  return itemCount;
}

if (!fs.existsSync(latestPath)) throw new Error(`Missing latest briefing: ${latestPath}`);
const latest = readJson(latestPath);
const itemCount = validateBrief(latest);

fs.mkdirSync(archiveDir, { recursive: true });
const relativeFile = `archive/${latest.date}.json`;
const archivePath = path.join(briefDir, relativeFile);
fs.writeFileSync(archivePath, stableJson(latest));

const index = fs.existsSync(indexPath) ? readJson(indexPath) : { entries: [] };
const entries = Array.isArray(index.entries) ? index.entries : [];
const entry = {
  title: `${latest.date.replaceAll('-', '.')} 국내 사회동향 인텔리전스`,
  date: latest.date,
  generatedAt: latest.generatedAt,
  itemCount,
  file: relativeFile
};
const byDate = new Map(entries.filter(item => /^20\d{2}-\d{2}-\d{2}$/.test(item?.date || '')).map(item => [item.date, item]));
byDate.set(latest.date, entry);
index.entries = [...byDate.values()].sort((a, b) => b.date.localeCompare(a.date));
fs.writeFileSync(indexPath, stableJson(index));

console.log(`Archived domestic social intelligence ${latest.date}: ${itemCount} item(s).`);
