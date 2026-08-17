import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const NEXUS = path.join(ROOT, 'nexus');
const BASE_FILE = path.join(NEXUS, 'projects.json');
const STATUS_FILE = path.join(NEXUS, 'project-status.json');
const REGISTRY_FILE = path.join(NEXUS, 'approved-manifests.json');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function loadManifestRegistry() {
  const registry = readJson(REGISTRY_FILE);
  const manifests = registry?.manifests;
  if (!Array.isArray(manifests) || !manifests.length) {
    throw new Error('Approved Nexus manifest registry is empty or invalid');
  }
  if (new Set(manifests).size !== manifests.length) {
    throw new Error('Duplicate manifest path in approved Nexus manifest registry');
  }
  return manifests;
}

// Nexus 상태를 자동 추적할 프로젝트는 이 승인 레지스트리만 읽습니다.
// 카드의 제목·설명·URL은 nexus/projects.json만을 단일 원본으로 사용합니다.
const MANIFEST_FILES = loadManifestRegistry();

function valueAtPath(root, pathSpec) {
  if (!pathSpec) return root;
  return String(pathSpec)
    .split('.')
    .filter(Boolean)
    .reduce((value, key) => value?.[key], root);
}

function loadApprovedManifests() {
  const manifests = [];
  const seenIds = new Set();

  for (const relative of MANIFEST_FILES) {
    const file = path.join(ROOT, relative);
    if (!fs.existsSync(file)) {
      throw new Error(`Approved Nexus manifest is missing: ${relative}`);
    }

    const data = readJson(file);
    if (!data?.id) {
      throw new Error(`Invalid Nexus manifest: ${relative}`);
    }
    if (data.publish === false) continue;
    if (seenIds.has(data.id)) {
      throw new Error(`Duplicate Nexus project id: ${data.id}`);
    }
    seenIds.add(data.id);
    manifests.push({ file, relative, data });
  }

  return manifests;
}

function validateProject(project, source, categoryIds) {
  if (!project?.id) throw new Error(`Project id is missing: ${source}`);
  if (!project?.title) throw new Error(`Project title is missing: ${source}`);
  if (!categoryIds.has(project.category)) {
    throw new Error(`Unknown Nexus category '${project.category}' in ${source}`);
  }
  if (!/^https?:\/\//i.test(project.url || '')) {
    throw new Error(`Invalid project URL in ${source}: ${project.url || '(empty)'}`);
  }
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

function latestLocalDate(paths = []) {
  const dates = paths.map(gitDateForPath).filter(Boolean);
  if (!dates.length) return null;
  return dates.sort((a, b) => new Date(b) - new Date(a))[0];
}

function fetchText(url) {
  const args = ['-fsSL', '-H', 'User-Agent: YEHAVHA-Nexus'];
  try {
    const target = new URL(url);
    const trustedAuthHosts = new Set(['api.github.com', 'raw.githubusercontent.com']);
    if (process.env.GITHUB_TOKEN && trustedAuthHosts.has(target.hostname)) {
      args.push('-H', `Authorization: Bearer ${process.env.GITHUB_TOKEN}`);
    }
  } catch {}
  args.push(url);
  return execFileSync('curl', args, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
}

function externalCommitDate(repository, branch, relativePath) {
  try {
    const params = new URLSearchParams({ sha: branch || 'main', path: relativePath, per_page: '1' });
    const url = `https://api.github.com/repos/${repository}/commits?${params}`;
    const rows = JSON.parse(fetchText(url));
    return rows?.[0]?.commit?.committer?.date || rows?.[0]?.commit?.author?.date || null;
  } catch (error) {
    console.warn(`External GitHub date lookup failed for ${repository}/${relativePath}: ${error.message}`);
    return null;
  }
}

function latestExternalDate(tracking = {}) {
  const repository = tracking.externalRepository;
  if (!repository) return null;
  const branch = tracking.externalBranch || 'main';
  const paths = tracking.externalPaths || ['index.html'];
  const dates = paths.map(item => externalCommitDate(repository, branch, item)).filter(Boolean);
  if (!dates.length) return null;
  return dates.sort((a, b) => new Date(b) - new Date(a))[0];
}

function latestDate(tracking, fallbackPaths = []) {
  if (tracking.externalRepository) return latestExternalDate(tracking);
  return latestLocalDate(tracking.paths || fallbackPaths);
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
  const text = config.url
    ? fetchText(config.url)
    : fs.readFileSync(path.join(ROOT, config.file), 'utf8');
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

function countJsonArray(config) {
  const file = path.join(ROOT, config.file || '');
  const value = valueAtPath(readJson(file), config.path);
  if (!Array.isArray(value)) {
    throw new Error(`JSON array not found: ${config.file}#${config.path || '(root)'}`);
  }
  return value.length;
}

function countJsonNestedArray(config) {
  const file = path.join(ROOT, config.file || '');
  const parents = valueAtPath(readJson(file), config.path);
  if (!Array.isArray(parents)) {
    throw new Error(`JSON parent array not found: ${config.file}#${config.path || '(root)'}`);
  }
  if (!config.child) throw new Error(`Nested array child key is missing: ${config.file}`);
  return parents.reduce((sum, parent) => sum + (Array.isArray(parent?.[config.child]) ? parent[config.child].length : 0), 0);
}

function contentCount(config) {
  if (!config) return null;
  if (config.type === 'static') {
    const value = Number(config.value);
    if (!Number.isFinite(value) || value < 0) throw new Error(`Invalid static content count: ${config.value}`);
    return value;
  }
  if (config.type === 'json-array') return countJsonArray(config);
  if (config.type === 'json-nested-array') return countJsonNestedArray(config);
  if (config.type === 'regex') return countRegex(config);
  if (config.type === 'window-array') return countWindowArray(config);
  throw new Error(`Unsupported content count type: ${config.type}`);
}

const base = readJson(BASE_FILE);
const categoryIds = new Set((base.categories || []).map(item => item.id));
const baseIds = new Set();
for (const project of base.projects || []) {
  validateProject(project, 'nexus/projects.json', categoryIds);
  if (baseIds.has(project.id)) throw new Error(`Duplicate base project id: ${project.id}`);
  baseIds.add(project.id);
}

const manifests = loadApprovedManifests();
const statusMap = {};

for (const { file, relative, data } of manifests) {
  if (!baseIds.has(data.id)) {
    throw new Error(`Approved Nexus manifest id '${data.id}' is missing from nexus/projects.json: ${relative}`);
  }

  const tracking = data.tracking || {};
  const fallbackPaths = [path.relative(ROOT, path.dirname(file)) || '.'];
  const latest = latestDate(tracking, fallbackPaths);
  let count = null;

  try {
    count = contentCount(tracking.count);
  } catch (error) {
    console.warn(`Content count failed for ${data.id}: ${error.message}`);
  }

  statusMap[data.id] = {
    id: data.id,
    managedBy: tracking.externalRepository ? 'github-external' : 'github',
    ...statusFor(latest, tracking),
    lastUpdated: dateOnly(latest),
    contentCount: count,
    contentLabel: tracking.count?.label || '콘텐츠'
  };
}

writeJson(STATUS_FILE, statusMap);

console.log(`YEHAVHA Nexus status refreshed: ${Object.keys(statusMap).length} approved GitHub-managed project(s).`);
for (const item of Object.values(statusMap)) {
  const title = (base.projects || []).find(project => project.id === item.id)?.title || item.id;
  console.log(`- ${title}: ${item.status}, ${item.contentLabel} ${item.contentCount ?? '-'}, ${item.lastUpdated ?? '-'}`);
}
