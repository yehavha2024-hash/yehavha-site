import fs from 'node:fs';

const projects = JSON.parse(fs.readFileSync('nexus/projects.json', 'utf8')).projects || [];
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

async function check(project) {
  let url;
  try { url = new URL(project.url); }
  catch { return; }
  if (!isManaged(url)) return;
  url.hash = '';
  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'user-agent': 'YEHAVHA-Nexus-Smoke-Test/1.0' },
      signal: AbortSignal.timeout(15000)
    });
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

for (const project of projects) await check(project);

console.log(`Live Nexus smoke test: ${errors} error(s)`);
if (errors) process.exit(1);
