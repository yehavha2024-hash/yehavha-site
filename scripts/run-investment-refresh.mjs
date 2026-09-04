import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const PAGE = path.join(ROOT, 'nexus', 'investment-strategy', 'index.html');
const REFRESH = path.join(ROOT, 'scripts', 'refresh-investment-strategy.mjs');
const SENTINEL = '<div class="market-dashboard"></div>';
const CURRENT_MARKER = '<aside class="rate-board">';

let html = fs.readFileSync(PAGE, 'utf8');
let insertedSentinel = false;

if (!html.includes('<div class="market-dashboard">')) {
  if (!html.includes(CURRENT_MARKER)) {
    throw new Error('Investment dashboard structure marker is unavailable.');
  }
  html = html.replace(CURRENT_MARKER, `${SENTINEL}${CURRENT_MARKER}`);
  fs.writeFileSync(PAGE, html, 'utf8');
  insertedSentinel = true;
}

const result = spawnSync(process.execPath, [REFRESH], {
  cwd: ROOT,
  env: process.env,
  stdio: 'inherit'
});

html = fs.readFileSync(PAGE, 'utf8');
if (insertedSentinel) {
  html = html.replace(SENTINEL, '');
  fs.writeFileSync(PAGE, html, 'utf8');
}

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
