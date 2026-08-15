import fs from 'node:fs';

const projects = JSON.parse(fs.readFileSync('nexus/projects.json', 'utf8')).projects || [];
const NEXUS_ORIGIN = 'https://yehavha-nexus-hub.pages.dev';
const OWNED_HOSTS = [
  /\.pages\.dev$/i,
  /\.danielie\.workers\.dev$/i
];
const EXCLUDED_HOSTS = new Set(['www.youtube.com']);
let errors = 0;

function isManaged(url) {
  if (EXCLUDED_HOSTS.has(url.hostname)) return false;
  return OWNED_HOSTS.some(pattern => pattern.test(url.hostname));
}

async function request(url, options = {}) {
  return fetch(url, {
    method: options.method || 'GET',
    redirect: options.redirect || 'follow',
    headers: { 'user-agent': 'YEHAVHA-Nexus-Smoke-Test/1.1', ...(options.headers || {}) },
    signal: AbortSignal.timeout(15000)
  });
}

async function check(project) {
  let url;
  try { url = new URL(project.url); }
  catch { return; }
  if (!isManaged(url)) return;
  url.hash = '';
  try {
    const response = await request(url);
    if (!response.ok) {
      errors += 1;
      console.error(`ERROR ${project.id}: HTTP ${response.status} ${url}`);
      return;
    }
    const body = await response.text();
    if (body.trim().length < 100) {
      errors += 1;
      console.error(`ERROR ${project.id}: 응답 본문이 비정상적으로 짧음 (${body.length} bytes) ${url}`);
      return;
    }
    console.log(`OK ${project.id}: HTTP ${response.status} ${response.url}`);
  } catch (error) {
    errors += 1;
    console.error(`ERROR ${project.id}: ${error.message} ${url}`);
  }
}

async function checkJson(pathname, validator) {
  const url = `${NEXUS_ORIGIN}${pathname}`;
  try {
    const response = await request(url);
    if (!response.ok) {
      errors += 1;
      console.error(`ERROR ${pathname}: HTTP ${response.status}`);
      return;
    }
    const data = await response.json();
    if (!validator(data)) {
      errors += 1;
      console.error(`ERROR ${pathname}: JSON 구조 검증 실패`);
      return;
    }
    console.log(`OK ${pathname}: HTTP ${response.status}`);
  } catch (error) {
    errors += 1;
    console.error(`ERROR ${pathname}: ${error.message}`);
  }
}

async function checkAccessApi() {
  const pathname = '/api/access';
  const url = `${NEXUS_ORIGIN}${pathname}`;
  try {
    const response = await request(url);
    const data = await response.json().catch(() => null);
    if (!response.ok || data?.ok !== true || !Number.isFinite(Number(data?.count))) {
      errors += 1;
      console.error(`ERROR ${pathname}: HTTP ${response.status}, payload=${JSON.stringify(data)}`);
      return;
    }
    console.log(`OK ${pathname}: HTTP ${response.status}, count=${data.count}`);
  } catch (error) {
    errors += 1;
    console.error(`ERROR ${pathname}: ${error.message}`);
  }
}

async function checkRedirect() {
  const target = 'https://yehavha-3min-rest.pages.dev/';
  const url = `${NEXUS_ORIGIN}/go?to=${encodeURIComponent(target)}`;
  try {
    const response = await request(url, { redirect: 'manual' });
    const location = response.headers.get('location');
    if (![301, 302, 303, 307, 308].includes(response.status) || location !== target) {
      errors += 1;
      console.error(`ERROR /go: HTTP ${response.status}, location=${location || '-'}`);
      return;
    }
    console.log(`OK /go: HTTP ${response.status} → ${location}`);
  } catch (error) {
    errors += 1;
    console.error(`ERROR /go: ${error.message}`);
  }
}

for (const project of projects) await check(project);
await checkJson('/projects.json', data => Array.isArray(data?.projects) && data.projects.length > 0);
await checkJson('/project-status.json', data => data && typeof data === 'object' && Object.keys(data).length >= 10);
await checkAccessApi();
await checkRedirect();

console.log(`Live Nexus smoke test: ${errors} error(s)`);
if (errors) process.exit(1);
