import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const NEXUS = path.join(ROOT, 'nexus');
const BASE_FILE = path.join(NEXUS, 'projects.json');
const GENERATED_FILE = path.join(NEXUS, 'projects.generated.json');
const STATUS_FILE = path.join(NEXUS, 'project-status.json');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function findManifests(dir = ROOT, found = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', '.next', '.wrangler'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) findManifests(full, found);
    else if (entry.isFile() && entry.name === 'nexus.project.json') found.push(full);
  }
  return found;
}

function gitDateForPath(relativePath) {
  try {
    const result = execFileSync(
      'git',
      ['log', '-1', '--format=%cI', '--', relativePath],
      { cwd: ROOT, encoding: 'utf8' }
    ).trim();
    return result || null;
  } catch {
    return null;
  }
}

function latestDate(paths = []) {
  const dates = paths.map(gitDateForPath).filter(Boolean);
  if (!dates.length) return null;
  return dates.sort((a, b) => new Date(b) - new Date(a))[0];
}

function dateOnly(iso) {
  return iso ? iso.slice(0, 10) : null;
}

function ageDays(iso) {
  if (!iso) return Number.POSITIVE_INFINITY;
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}

function statusFor(latest, tracking = {}) {
  if (!latest) return { status: '상태 확인 필요', statusTone: 'unknown' };
  const age = ageDays(latest);
  const freshDays = Number.isFinite(tracking.freshDays) ? tracking.freshDays : 7;
  const staleDays = Number.isFinite(tracking.staleDays) ? tracking.staleDays : 30;
  if (age <= freshDays) return { status: '최근 업데이트', statusTone: 'fresh' };
  if (age <= staleDays) return { status: '운영 중', statusTone: 'active' };
  return { status: '안정 운영', statusTone: 'stable' };
}

function countRegex(config) {
  const file = path.join(ROOT, config.file);
  const text = fs.readFileSync(file, 'utf8');
  return [...text.matchAll(new RegExp(config.pattern, 'g'))].length;
}

function countWindowArray(config) {
  const globalName = config.global;
  const context = { window: { [globalName]: [] }, console };
  vm.createContext(context);
  for (const relative of config.files || []) {
    const source = fs.readFileSync(path.join(ROOT, relative), 'utf8');
    vm.runInContext(`(function(){\n${source}\n})();`, context, { filename: relative });
  }
  const value = context.window[globalName];
  return Array.isArray(value) ? value.length : 0;
}

function contentCount(config) {
  if (!config) return null;
  if (config.type === 'regex') return countRegex(config);
  if (config.type === 'window-array') return countWindowArray(config);
  return null;
}

const base = readJson(BASE_FILE);
const manifests = findManifests().map(file => ({ file, data: readJson(file) }));
const managed = new Map();
const statusMap = {};

for (const { file, data } of manifests) {
  if (!data?.id || !data?.project || data.publish === false) continue;
  const tracking = data.tracking || {};
  const latest = latestDate(tracking.paths || [path.relative(ROOT, path.dirname(file)) || '.']);
  const count = contentCount(tracking.count);
  const dynamic = {
    id: data.id,
    managedBy: 'github',
    ...statusFor(latest, tracking),
    lastUpdated: dateOnly(latest),
    contentCount: count,
    contentLabel: tracking.count?.label || '콘텐츠'
  };
  const project = { id: data.id, ...data.project, ...dynamic };
  managed.set(data.id, project);
  statusMap[data.id] = dynamic;
}

const projects = (base.projects || []).map(project => {
  const replacement = project.id ? managed.get(project.id) : null;
  if (!replacement) return project;
  managed.delete(project.id);
  return { ...project, ...replacement };
});

for (const project of managed.values()) projects.push(project);

const generated = {
  ...base,
  projects
};

writeJson(GENERATED_FILE, generated);
writeJson(STATUS_FILE, statusMap);

console.log(`YEHAVHA Nexus status refreshed: ${Object.keys(statusMap).length} GitHub-managed project(s).`);
for (const project of projects.filter(item => item.managedBy === 'github')) {
  console.log(`- ${project.title}: ${project.status}, ${project.contentLabel} ${project.contentCount ?? '-'}, ${project.lastUpdated ?? '-'}`);
}
