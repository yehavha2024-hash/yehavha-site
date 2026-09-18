import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..', '..');
const registryPath = path.join(repoRoot, 'nexus', 'news', 'news-data.js');
const outDir = path.join(repoRoot, 'operations', 'news-records', 'arrangement');
const statePath = path.join(outDir, 'state.json');

function git(args) { return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8' }).trim(); }
function loadRegistry() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(registryPath, 'utf8'), context, { filename: registryPath });
  return {
    config: JSON.parse(JSON.stringify(context.window.YEHAVHA_NEWS_CONFIG || {})),
    data: JSON.parse(JSON.stringify(context.window.YEHAVHA_NEWS_DATA || []))
  };
}
function readState() {
  if (!fs.existsSync(statePath)) return { schemaVersion: 1, items: {} };
  return JSON.parse(fs.readFileSync(statePath, 'utf8'));
}

fs.mkdirSync(outDir, { recursive: true });
const { config, data } = loadRegistry();
const commit = process.env.NEWS_ARCHIVE_HEAD || process.env.GITHUB_SHA || git(['rev-parse', 'HEAD']);
const capturedAt = git(['show', '-s', '--format=%cI', commit]);
const limit = Number(config.homeLatestLimit) || 10;
const top = data.slice(0, limit);
const state = readState();
state.schemaVersion = 1;
state.items ||= {};

const priorActive = Object.values(state.items)
  .filter(item => item.currentPosition)
  .sort((a, b) => a.currentPosition - b.currentPosition)
  .map(item => item.id);
const nextActive = top.map(item => item.id);
const unchanged = priorActive.length === nextActive.length
  && priorActive.every((id, index) => id === nextActive[index]);
if (unchanged && fs.existsSync(statePath)) {
  console.log('YEHAVHA NEWS arrangement archive: no ordering change.');
  process.exit(0);
}

const activeIds = new Set(nextActive);
for (const [id, item] of Object.entries(state.items)) {
  if (item.currentPosition && !activeIds.has(id)) {
    item.removedAt = capturedAt;
    item.currentPosition = null;
  }
}
top.forEach((item, index) => {
  const record = state.items[item.id] || {
    id: item.id,
    title: item.title,
    firstExposedAt: capturedAt,
    removedAt: null
  };
  record.title = item.title;
  record.lastExposedAt = capturedAt;
  record.currentPosition = index + 1;
  record.removedAt = null;
  state.items[item.id] = record;
});
state.updatedAt = capturedAt;
state.sourceCommit = commit;
fs.writeFileSync(statePath, JSON.stringify(state, null, 2) + '\n', 'utf8');

const snapshot = {
  schemaVersion: 1,
  capturedAt,
  sourceCommit: commit,
  surface: 'YEHAVHA NEWS top-level latest-news list',
  positionBasis: 'render order after news-data.js synchronization',
  items: top.map((item, index) => ({
    position: index + 1,
    id: item.id,
    title: item.title,
    category: item.category,
    href: item.href,
    firstExposedAt: state.items[item.id].firstExposedAt,
    lastExposedAt: capturedAt
  }))
};
const safeTime = capturedAt.replaceAll(':', '-');
const snapshotPath = path.join(outDir, `${safeTime}-${commit.slice(0, 12)}.json`);
fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2) + '\n', 'utf8');
console.log(`YEHAVHA NEWS arrangement archived: ${top.length} item(s).`);
