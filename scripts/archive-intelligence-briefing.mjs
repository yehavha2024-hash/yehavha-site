import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const briefingDir = path.join(root, 'nexus', 'intelligence-briefing');
const latestPath = path.join(briefingDir, 'latest.json');
const archiveDir = path.join(briefingDir, 'archive');
const indexPath = path.join(briefingDir, 'archive-index.json');

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const stableJson = (value) => `${JSON.stringify(value, null, 2)}\n`;

function kstParts(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid generatedAt: ${value}`);
  }

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date);

  const get = (type) => parts.find((part) => part.type === type)?.value;
  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hour: get('hour'),
    minute: get('minute')
  };
}

function makeDetail(brief) {
  if (typeof brief.archiveDetail === 'string' && brief.archiveDetail.trim()) {
    return brief.archiveDetail.trim();
  }

  return (brief.items || [])
    .slice(0, 6)
    .map((item) => item.headline || item.category)
    .filter(Boolean)
    .join(' · ');
}

if (!fs.existsSync(latestPath)) {
  throw new Error(`Missing latest briefing: ${latestPath}`);
}

const latest = readJson(latestPath);
if (!latest.generatedAt) {
  throw new Error('latest.json must contain generatedAt.');
}

const t = kstParts(latest.generatedAt);
const date = `${t.year}-${t.month}-${t.day}`;
const time = `${t.hour}${t.minute}`;
const relativeFile = `archive/${date}-${time}.json`;
const archivePath = path.join(briefingDir, relativeFile);

fs.mkdirSync(archiveDir, { recursive: true });

if (fs.existsSync(archivePath)) {
  const existing = readJson(archivePath);
  if (stableJson(existing) !== stableJson(latest)) {
    throw new Error(
      `Refusing to overwrite immutable briefing snapshot: ${relativeFile}. ` +
      'Use a new generatedAt value for a new update.'
    );
  }
} else {
  fs.writeFileSync(archivePath, stableJson(latest));
}

const index = fs.existsSync(indexPath) ? readJson(indexPath) : { entries: [] };
const entry = {
  title: `${t.year}.${t.month}.${t.day} ${t.hour}:${t.minute} 전략정보 브리핑`,
  detail: makeDetail(latest),
  date,
  generatedAt: latest.generatedAt,
  file: relativeFile
};

const entries = Array.isArray(index.entries) ? index.entries : [];
const byFile = new Map(entries.map((item) => [item.file, item]));
byFile.set(relativeFile, entry);

index.entries = [...byFile.values()].sort(
  (a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
);

fs.writeFileSync(indexPath, stableJson(index));
console.log(`Archived ${latest.generatedAt} -> ${relativeFile}`);
