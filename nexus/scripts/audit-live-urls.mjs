import fs from 'node:fs';

const projects = JSON.parse(fs.readFileSync('nexus/projects.json', 'utf8')).projects || [];
const NEXUS_ORIGIN = 'https://yehavha.com';
const COPYRIGHT_STANDARD = 'Copyright © 이명훈 2026. All rights reserved.';
const RETIRED_PATHS = ['/ai-practice/', '/ai-governance/', '/ai-service-operations/', '/initiatives/'];
const OWNED_HOSTS = [
  /^yehavha\.com$/i,
  /\.pages\.dev$/i,
  /\.danielie\.workers\.dev$/i
];
const EXCLUDED_HOSTS = new Set(['www.youtube.com']);
let errors = 0;
let warnings = 0;

function isManaged(url) {
  if (EXCLUDED_HOSTS.has(url.hostname)) return false;
  return OWNED_HOSTS.some(pattern => pattern.test(url.hostname));
}

async function request(url, options = {}) {
  return fetch(url, {
    method: options.method || 'GET',
    redirect: options.redirect || 'follow',
    headers: { 'user-agent': 'YEHAVHA-Nexus-Smoke-Test/1.2', ...(options.headers || {}) },
    signal: AbortSignal.timeout(15000)
  });
}

function auditLiveCopyright(projectId, url, body) {
  if (url.origin !== NEXUS_ORIGIN) return;
  if (!body.includes(COPYRIGHT_STANDARD)) {
    errors += 1;
    console.error(`ERROR ${projectId}: 라이브 Copyright 표준문구 미반영 ${url}`);
  }
  if (/Copyright ©\s*2026\s*이명훈/.test(body)) {
    errors += 1;
    console.error(`ERROR ${projectId}: 구버전 Copyright 순서가 라이브에 잔존 ${url}`);
  }
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
    auditLiveCopyright(project.id, url, body);
    console.log(`OK ${project.id}: HTTP ${response.status} ${response.url}`);
  } catch (error) {
    errors += 1;
    console.error(`ERROR ${project.id}: ${error.message} ${url}`);
  }
}

async function checkNoCache(pathname) {
  const url = `${NEXUS_ORIGIN}${pathname}`;
  try {
    const response = await request(url);
    const cache = response.headers.get('cache-control') || '';
    if (!response.ok) {
      errors += 1;
      console.error(`ERROR ${pathname}: HTTP ${response.status}`);
      return null;
    }
    if (!/no-cache/i.test(cache) || !/no-store/i.test(cache)) {
      errors += 1;
      console.error(`ERROR ${pathname}: cache policy not deployed (${cache || '-'})`);
      return null;
    }
    console.log(`OK ${pathname}: HTTP ${response.status}, cache=${cache}`);
    return response;
  } catch (error) {
    errors += 1;
    console.error(`ERROR ${pathname}: ${error.message}`);
    return null;
  }
}

async function checkHomeRuntime() {
  const url = `${NEXUS_ORIGIN}/`;
  try {
    const response = await request(url);
    const body = await response.text();
    for (const marker of ['id="homeLatestNewsList"','id="homeLatestNewsMeta"','id="homeStrategyTitle"','id="homeSocialTitle"','./news/news-data.js','./portal-v2.js']) {
      if (!body.includes(marker)) {
        errors += 1;
        console.error(`ERROR /: canonical homepage feed marker missing: ${marker}`);
      }
    }
    for (const retiredMarker of ['id="homeNewsGrid"','id="homeNewsDate"']) {
      if (body.includes(retiredMarker)) {
        errors += 1;
        console.error(`ERROR /: retired homepage feed marker returned: ${retiredMarker}`);
      }
    }
    if (/\.\/news\/articles\/20\d{2}-\d{2}-\d{2}-/.test(body)) {
      errors += 1;
      console.error('ERROR /: live homepage still contains statically duplicated daily news cards');
    }
    if (/(?:portal-v2|nexus-standard)\.(?:css|js)\?v=/.test(body)) {
      errors += 1;
      console.error('ERROR /: live homepage still contains manual cache-busting query');
    }
  } catch (error) {
    errors += 1;
    console.error(`ERROR / canonical feed markers: ${error.message}`);
  }
  for (const pathname of ['/portal-v2.js', '/nexus-standard.css', '/news/news-data.js']) await checkNoCache(pathname);
}

async function checkNewsRuntime() {
  for (const pathname of ['/news/', '/news/about.html']) {
    await check({ id: `yehavha-news${pathname === '/news/' ? '' : '-media-info'}`, url: `${NEXUS_ORIGIN}${pathname}` });
  }
  for (const pathname of ['/news/style.css', '/news/app.js']) await checkNoCache(pathname);
}

async function checkJson(pathname, validator, requireNoCache = false) {
  const url = `${NEXUS_ORIGIN}${pathname}`;
  try {
    const response = await request(url);
    if (!response.ok) {
      errors += 1;
      console.error(`ERROR ${pathname}: HTTP ${response.status}`);
      return;
    }
    if (requireNoCache) {
      const cache = response.headers.get('cache-control') || '';
      if (!/no-cache/i.test(cache) || !/no-store/i.test(cache)) {
        errors += 1;
        console.error(`ERROR ${pathname}: cache policy not deployed (${cache || '-'})`);
        return;
      }
    }
    const data = await response.json();
    if (!validator(data)) {
      errors += 1;
      console.error(`ERROR ${pathname}: JSON 구조 검증 실패`);
      return;
    }
    console.log(`OK ${pathname}: HTTP ${response.status}${requireNoCache ? ', canonical feed fresh' : ''}`);
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

async function checkRetiredPaths() {
  for (const pathname of RETIRED_PATHS) {
    const url = `${NEXUS_ORIGIN}${pathname}`;
    try {
      const response = await request(url, { redirect: 'manual' });
      if (response.status < 400) {
        warnings += 1;
        console.warn(`WARNING ${pathname}: 소스에서는 폐기됨. Pages 배포·fallback 때문에 라이브 HTTP ${response.status}가 남아 있을 수 있음`);
      } else {
        console.log(`OK ${pathname}: retired HTTP ${response.status}`);
      }
    } catch (error) {
      warnings += 1;
      console.warn(`WARNING ${pathname}: retired-path 확인 실패: ${error.message}`);
    }
  }
}

await check({ id: 'nexus-home', url: `${NEXUS_ORIGIN}/` });
await checkHomeRuntime();
await checkNewsRuntime();
for (const project of projects) await check(project);
await check({ id: 'legal-mind-training', url: 'https://yehavha-legal-knowledge.danielie.workers.dev/legal-mind/' });
await checkJson('/projects.json', data => Array.isArray(data?.projects) && data.projects.length > 0);
await checkJson('/project-status.json', data => data && typeof data === 'object' && Object.keys(data).length >= 10);
await checkJson('/intelligence-briefing/latest.json', data => Array.isArray(data?.items) && data.items.length > 0, true);
await checkJson('/korea-social-intelligence/latest.json', data => Array.isArray(data?.sections) && data.sections.some(section => Array.isArray(section?.items) && section.items.length > 0), true);
await checkAccessApi();
await checkRedirect();
await checkRetiredPaths();

console.log(`Live Nexus smoke test: ${errors} error(s), ${warnings} warning(s)`);
if (errors) process.exit(1);
