import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..', '..');
const articlePrefix = 'nexus/news/articles/';
const archiveRoot = path.join(repoRoot, 'operations', 'news-records', 'articles');

function git(args, options = {}) {
  return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...options }).trim();
}
function canShow(commit, file) {
  try { execFileSync('git', ['cat-file', '-e', `${commit}:${file}`], { cwd: repoRoot, stdio: 'ignore' }); return true; } catch { return false; }
}
function show(commit, file) { return execFileSync('git', ['show', `${commit}:${file}`], { cwd: repoRoot, encoding: 'utf8' }); }
function commitMeta(commit) {
  const [recordedAt = '', ...message] = git(['show', '-s', '--format=%cI%n%s', commit]).split('\n');
  return { recordedAt, message: message.join(' ').trim() || '기사 변경' };
}
function sourceLinks(html = '') {
  const section = html.match(/<section\b(?=[^>]*class=["'][^"']*\barticle-sources\b[^"']*["'])[^>]*>[\s\S]*?<\/section>/i)?.[0] || '';
  return [...new Set([...section.matchAll(/href=["'](https?:\/\/[^"']+)["']/gi)].map(match => match[1]))];
}
function revisionApproval(html = '') {
  const notice = html.match(/<aside\b(?=[^>]*class=["'][^"']*\barticle-revision-notice\b[^"']*["'])[^>]*>[\s\S]*?<\/aside>/i)?.[0] || '';
  if (!notice) return null;
  const editor = notice.match(/data-editor=["']([^"']+)["']/i)?.[1] || '';
  const approvedAt = notice.match(/data-approved-at=["']([^"']+)["']/i)?.[1] || '';
  const approved = /data-editor-approved=["']true["']/i.test(notice);
  const summary = notice
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return { approved, editor, approvedAt, summary };
}
function readManifest(file, articleId, sourcePath) {
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  return {
    schemaVersion: 1,
    articleId,
    sourcePath,
    draftRef: '',
    retention: { minimumMonths: 6, defaultPolicy: 'indefinite-unless-lawful-disposal-approved' },
    evidenceNotes: [],
    versions: []
  };
}
function addVersion(manifest, entry) {
  if (manifest.versions.some(item => item.commit === entry.commit && item.stage === entry.stage)) return;
  manifest.versions.push(entry);
  manifest.versions.sort((a, b) => String(a.recordedAt).localeCompare(String(b.recordedAt)));
}
function writeSnapshot(articleId, commit, html) {
  const dir = path.join(archiveRoot, articleId);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${commit}.html`);
  if (!fs.existsSync(file)) fs.writeFileSync(file, html.endsWith('\n') ? html : `${html}\n`, 'utf8');
  return path.relative(repoRoot, file).replaceAll('\\', '/');
}

const head = process.env.NEWS_ARCHIVE_HEAD || process.env.GITHUB_SHA || 'HEAD';
let before = process.env.NEWS_ARCHIVE_BEFORE || process.env.GITHUB_EVENT_BEFORE || '';
if (!before || /^0+$/.test(before)) {
  try { before = git(['rev-parse', `${head}^`]); } catch { before = ''; }
}

let diff = '';
if (before) {
  diff = git(['diff', '--name-status', `${before}..${head}`, '--', 'nexus/news/articles'], { stdio: ['ignore', 'pipe', 'ignore'] });
} else {
  diff = git(['diff-tree', '--root', '--no-commit-id', '--name-status', '-r', head, '--', 'nexus/news/articles'], { stdio: ['ignore', 'pipe', 'ignore'] });
}

if (!diff) {
  const seeded = fs.existsSync(archiveRoot)
    && fs.readdirSync(archiveRoot, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .some(entry => fs.existsSync(path.join(archiveRoot, entry.name, 'manifest.json')));
  if (seeded) {
    console.log('YEHAVHA NEWS revision archive: no article changes.');
    process.exit(0);
  }
  const liveArticleDir = path.join(repoRoot, articlePrefix);
  const currentFiles = fs.readdirSync(liveArticleDir)
    .filter(name => name.endsWith('.html'))
    .sort()
    .map(name => `S\t${articlePrefix}${name}`);
  diff = currentFiles.join('\n');
  console.log(`YEHAVHA NEWS revision archive: seeding ${currentFiles.length} current article(s).`);
}

for (const line of diff.split('\n').filter(Boolean)) {
  const cols = line.split('\t');
  const status = cols[0];
  const sourcePath = status.startsWith('R') ? cols[2] : cols[1];
  const previousPath = status.startsWith('R') ? cols[1] : sourcePath;
  if (!sourcePath?.startsWith(articlePrefix) && !previousPath?.startsWith(articlePrefix)) continue;

  const idPath = sourcePath || previousPath;
  const articleId = path.basename(idPath, '.html');
  const dir = path.join(archiveRoot, articleId);
  fs.mkdirSync(dir, { recursive: true });
  const manifestPath = path.join(dir, 'manifest.json');
  const manifest = readManifest(manifestPath, articleId, sourcePath || previousPath);

  if (status !== 'S' && before && previousPath && canShow(before, previousPath)) {
    const previousHtml = show(before, previousPath);
    const previousMeta = commitMeta(before);
    const previousSnapshot = writeSnapshot(articleId, before, previousHtml);
    if (!manifest.versions.some(item => item.commit === before)) {
      addVersion(manifest, {
        stage: 'baseline',
        commit: before,
        recordedAt: previousMeta.recordedAt,
        revisionReason: '자동 기초 보존',
        snapshot: previousSnapshot,
        evidenceSources: sourceLinks(previousHtml)
      });
    }
  }

  if (status.startsWith('D')) {
    const meta = commitMeta(head);
    addVersion(manifest, {
      stage: 'withdrawn',
      commit: head,
      recordedAt: meta.recordedAt,
      revisionReason: meta.message,
      snapshot: '',
      evidenceSources: []
    });
  } else if (sourcePath && canShow(head, sourcePath)) {
    const html = show(head, sourcePath);
    const meta = commitMeta(head);
    const snapshot = writeSnapshot(articleId, head, html);
    addVersion(manifest, {
      stage: status === 'S' ? 'baseline' : (status.startsWith('A') ? 'published' : 'revised'),
      commit: head,
      recordedAt: meta.recordedAt,
      revisionReason: status === 'S'
        ? '보존체계 도입 시점 기준 발행본 스냅샷'
        : (status.startsWith('A') ? '최초 발행 · ' + meta.message : meta.message),
      snapshot,
      evidenceSources: sourceLinks(html),
      ...(revisionApproval(html) ? { editorApproval: revisionApproval(html) } : {})
    });
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log(`archived ${articleId}: ${status}`);
}
