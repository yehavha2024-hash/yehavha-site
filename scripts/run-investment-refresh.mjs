import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const PAGE = path.join(ROOT, 'nexus', 'investment-strategy', 'index.html');
const REFRESH = path.join(ROOT, 'scripts', 'refresh-investment-strategy.mjs');
const MARKET_SENTINEL = '<div class="market-dashboard"></div>';
const RATE_BOARD_MARKER = '<aside class="rate-board">';
const ARCHIVE_START = '<!-- NEXUS_INVESTMENT_REFRESH_COMPAT_START -->';
const ARCHIVE_END = '<!-- NEXUS_INVESTMENT_REFRESH_COMPAT_END -->';
const IPO_MARKER = '<section class="section"><div class="wrap"><div class="section-head"><h2>AI·로봇 공모주 청약</h2>';

const TEMP_ARCHIVE = `${ARCHIVE_START}
<section class="section"><div class="wrap"><div class="section-head"><h2>분석 아카이브</h2><p>자동 갱신 호환 영역</p></div><article class="archive-card"><div class="stock-head"><div><p class="label">AUTO REFRESH</p><h3>앤로보틱스</h3></div><span class="stock-date">자동 갱신 준비</span></div><div class="stock-kpis"><div class="kpi"><span>KRX 기준가격</span><strong>-</strong></div><div class="kpi"><span>최근 변동</span><strong>-</strong></div><div class="kpi"><span>시가총액</span><strong>-</strong></div><div class="kpi"><span>52주 범위</span><strong>-</strong></div></div><div class="stock-grid"><section class="case-box"><h4>기업·사업 구조</h4><p>-</p></section><section class="case-box"><h4>실적과 이익의 질</h4><p>-</p></section><section class="case-box"><h4>최근 가격 흐름</h4><p>-</p></section><section class="case-box"><h4>관찰 가격대</h4><ul><li>-</li></ul></section><section class="case-box"><h4>자본구조 변화</h4><p>-</p></section><section class="case-box"><h4>핵심 위험</h4><ul><li>-</li></ul></section><section class="case-box"><h4>현재 판단</h4><p>-</p></section></div><div class="source-note">자동 갱신 호환용 임시 영역 <a href="https://kind.krx.co.kr/" target="_blank" rel="noopener">KRX KIND</a></div></article></div></section>
${ARCHIVE_END}`;

function cleanupCompatibility(html) {
  html = html.replace(MARKET_SENTINEL, '');
  const start = html.indexOf(ARCHIVE_START);
  const end = html.indexOf(ARCHIVE_END);
  if (start !== -1 && end !== -1 && end >= start) {
    html = html.slice(0, start) + html.slice(end + ARCHIVE_END.length);
  }
  return html;
}

let html = fs.readFileSync(PAGE, 'utf8');

if (!html.includes('<div class="market-dashboard">')) {
  if (!html.includes(RATE_BOARD_MARKER)) {
    throw new Error('Investment dashboard structure marker is unavailable.');
  }
  html = html.replace(RATE_BOARD_MARKER, `${MARKET_SENTINEL}${RATE_BOARD_MARKER}`);
}

if (!html.includes('<h2>분석 아카이브</h2>')) {
  if (!html.includes(IPO_MARKER)) {
    throw new Error('Investment archive compatibility insertion point is unavailable.');
  }
  html = html.replace(IPO_MARKER, `${TEMP_ARCHIVE}${IPO_MARKER}`);
}

fs.writeFileSync(PAGE, html, 'utf8');

const result = spawnSync(process.execPath, [REFRESH], {
  cwd: ROOT,
  env: process.env,
  stdio: 'inherit'
});

html = cleanupCompatibility(fs.readFileSync(PAGE, 'utf8'));
fs.writeFileSync(PAGE, html, 'utf8');

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
