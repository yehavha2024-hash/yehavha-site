import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const briefingDir = path.join(root, 'nexus', 'intelligence-briefing');
const latestPath = path.join(briefingDir, 'latest.json');
const archiveDir = path.join(briefingDir, 'archive');
const indexPath = path.join(briefingDir, 'archive-index.json');
const ROLLING_WINDOW_DAYS = 7;

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

function kstDate(value) {
  const t = kstParts(value);
  return `${t.year}-${t.month}-${t.day}`;
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

function loadPreviousBriefs(latest, currentArchivePath) {
  if (!fs.existsSync(archiveDir)) return [];
  const latestTime = new Date(latest.generatedAt).getTime();
  const windowMs = ROLLING_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  return fs.readdirSync(archiveDir)
    .filter((name) => name.endsWith('.json'))
    .map((name) => path.join(archiveDir, name))
    .filter((file) => path.resolve(file) !== path.resolve(currentArchivePath))
    .map((file) => {
      try {
        return { file, brief: readJson(file) };
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .filter(({ brief }) => brief.generatedAt)
    .filter(({ brief }) => {
      const time = new Date(brief.generatedAt).getTime();
      return Number.isFinite(time) && time < latestTime && latestTime - time <= windowMs;
    });
}

function validateNovelty(latest, previousBriefs) {
  const items = Array.isArray(latest.items) ? latest.items : [];
  if (!items.length) throw new Error('latest.json must contain at least one briefing item.');

  const currentKeys = new Set();
  for (const item of items) {
    if (!item.topicKey || typeof item.topicKey !== 'string' || !item.topicKey.trim()) {
      throw new Error(`Every new briefing item requires topicKey: ${item.headline || item.category || 'untitled item'}`);
    }
    if (currentKeys.has(item.topicKey)) {
      throw new Error(`Duplicate topicKey inside latest briefing: ${item.topicKey}`);
    }
    currentKeys.add(item.topicKey);
  }

  const latestDate = kstDate(latest.generatedAt);
  const sameDayKeys = new Set();
  const recentKeys = new Set();

  for (const { brief } of previousBriefs) {
    const isSameDay = kstDate(brief.generatedAt) === latestDate;
    for (const item of brief.items || []) {
      if (!item.topicKey) continue;
      recentKeys.add(item.topicKey);
      if (isSameDay) sameDayKeys.add(item.topicKey);
    }
  }

  for (const item of items) {
    if (sameDayKeys.has(item.topicKey)) {
      throw new Error(
        `Repeated same-day briefing topic is prohibited: ${item.topicKey}. ` +
        'Replace the entire item with a genuinely new issue.'
      );
    }

    if (recentKeys.has(item.topicKey)) {
      const hasMaterialChange = item.materialChange === true &&
        typeof item.changeReason === 'string' && item.changeReason.trim();
      if (!hasMaterialChange) {
        throw new Error(
          `Topic repeated within ${ROLLING_WINDOW_DAYS} days: ${item.topicKey}. ` +
          'Use a new issue, or document a qualitative turning point with materialChange=true and changeReason.'
        );
      }
    }
  }
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
validateNovelty(latest, loadPreviousBriefs(latest, archivePath));

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
