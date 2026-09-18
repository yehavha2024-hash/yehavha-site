import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..', '..');
const articleDir = path.join(repoRoot, 'nexus', 'news', 'articles');

function git(args, fallback = '') {
  try {
    return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return fallback;
  }
}

function show(commit, relativePath) {
  try {
    return execFileSync('git', ['show', `${commit}:${relativePath}`], {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    });
  } catch {
    return '';
  }
}

function visible(value = '') {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function articleFingerprint(source = '') {
  const article = source.match(/<article\b[^>]*class=["'][^"']*\bnews-article\b[^"']*["'][^>]*>[\s\S]*?<\/article>/i)?.[0] || '';
  return article
    .replace(/<p\b(?=[^>]*class=["'][^"']*\barticle-meta\b[^"']*["'])[^>]*>[\s\S]*?<\/p>/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function commitTime(commit) {
  return git(['show', '-s', '--format=%cI', commit]);
}

function seoulIso(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date);
  const map = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}:${map.second}+09:00`;
}

function displayTime(value) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) return value;
  return `${match[1]}.${match[2]}.${match[3]} ${match[4]}:${match[5]}`;
}

function existingTime(source, className) {
  return source.match(new RegExp(`<time\\b(?=[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'])[^>]*datetime=["']([^"']+)["'][^>]*>`, 'i'))?.[1] || '';
}

function sourceAuthor(source) {
  const meta = source.match(/<p\b(?=[^>]*class=["'][^"']*\barticle-meta\b[^"']*["'])[^>]*>([\s\S]*?)<\/p>/i)?.[1] || '';
  const text = visible(meta);
  const parts = text.split(/\s+·\s+/).map(part => part.trim()).filter(Boolean);
  return parts.at(-1) || '이명훈';
}

function category(source) {
  const value = source.match(/<p\b(?=[^>]*class=["'][^"']*\barticle-kicker\b[^"']*["'])[^>]*>([\s\S]*?)<\/p>/i)?.[1] || '';
  return visible(value);
}

function historyFor(relativePath) {
  return git(['log', '--format=%H', '--', relativePath])
    .split('\n')
    .map(value => value.trim())
    .filter(Boolean);
}

function meaningfulTimes(relativePath, currentSource) {
  const history = historyFor(relativePath);
  if (!history.length) {
    const now = seoulIso(new Date().toISOString());
    return { publishedAt: now, modifiedAt: '' };
  }

  const oldest = history.at(-1);
  const publishedAt = seoulIso(commitTime(oldest));
  let modifiedCommit = '';

  for (const commit of history) {
    if (commit === oldest) break;
    const current = articleFingerprint(show(commit, relativePath));
    const parent = git(['rev-parse', `${commit}^`]);
    const previous = parent ? articleFingerprint(show(parent, relativePath)) : '';
    if (current && current !== previous) {
      modifiedCommit = commit;
      break;
    }
  }

  // The checked-out article may already contain intentional editorial changes
  // not yet reflected in an older explicit timestamp. If HEAD changed the article
  // content (excluding article-meta), use the HEAD commit time.
  const head = git(['rev-parse', 'HEAD']);
  if (head) {
    const parent = git(['rev-parse', 'HEAD^']);
    const before = parent ? articleFingerprint(show(parent, relativePath)) : '';
    const current = articleFingerprint(currentSource);
    if (before && current && before !== current) modifiedCommit = head;
  }

  return {
    publishedAt,
    modifiedAt: modifiedCommit && modifiedCommit !== oldest ? seoulIso(commitTime(modifiedCommit)) : ''
  };
}

const files = fs.readdirSync(articleDir).filter(name => name.endsWith('.html')).sort();
let changed = 0;

for (const filename of files) {
  const fullPath = path.join(articleDir, filename);
  const relativePath = path.relative(repoRoot, fullPath).replaceAll('\\', '/');
  const original = fs.readFileSync(fullPath, 'utf8');
  const metaPattern = /<p\b(?=[^>]*class=["'][^"']*\barticle-meta\b[^"']*["'])[^>]*>[\s\S]*?<\/p>/i;
  if (!metaPattern.test(original)) throw new Error(`${filename}: article-meta missing`);

  const priorPublished = existingTime(original, 'article-published');
  const priorModified = existingTime(original, 'article-modified');
  const times = meaningfulTimes(relativePath, original);
  const publishedAt = priorPublished || times.publishedAt;
  let modifiedAt = priorModified;

  const head = git(['rev-parse', 'HEAD']);
  const parent = git(['rev-parse', 'HEAD^']);
  if (head && parent && priorPublished) {
    const before = articleFingerprint(show(parent, relativePath));
    const current = articleFingerprint(original);
    if (before && current && before !== current) modifiedAt = seoulIso(commitTime(head));
  } else if (!priorPublished) {
    modifiedAt = times.modifiedAt;
  }

  if (modifiedAt && new Date(modifiedAt) <= new Date(publishedAt)) modifiedAt = '';

  const author = sourceAuthor(original);
  const section = category(original);
  const timeParts = [
    `<time class="article-published" datetime="${publishedAt}">작성 ${displayTime(publishedAt)}</time>`,
    ...(modifiedAt ? [`<time class="article-modified" datetime="${modifiedAt}">수정 ${displayTime(modifiedAt)}</time>`] : []),
    section,
    author
  ].filter(Boolean);

  const meta = `<p class="article-meta">${timeParts.join(' · ')}</p>`;
  const next = original.replace(metaPattern, meta);
  if (next !== original) {
    fs.writeFileSync(fullPath, next.endsWith('\n') ? next : `${next}\n`, 'utf8');
    changed += 1;
    console.log(`timestamped ${filename}`);
  }
}

console.log(`YEHAVHA NEWS article timestamps complete: ${changed} changed / ${files.length} checked.`);
