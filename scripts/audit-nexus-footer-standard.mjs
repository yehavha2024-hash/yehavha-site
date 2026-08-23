import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'nexus';
const BUSINESS = '스카이예슈아 · 사업자등록번호 536-38-01234 · 대표 이명훈';
const COPYRIGHT = 'Copyright © 이명훈 2026. All rights reserved.';
let errors = 0;
let checked = 0;

const norm = file => file.split(path.sep).join('/');
const fail = (file, message) => {
  errors += 1;
  console.error(`ERROR ${file}: ${message}`);
  console.error(`::error file=${file}::${message}`);
};

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(norm(full));
  }
  return out;
}

function footerBlocks(html) {
  return [...html.matchAll(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi)].map(match => match[0]);
}

function indexOfHrefTop(footer) {
  const match = footer.match(/href=["']#top["']/i);
  return match ? match.index : -1;
}

function inlineFooterOwnership(html) {
  const styles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]);
  return styles.some(css => /(?:^|[}\n])\s*\.(?:footer|footer-card|footer-meta|reader-site-footer|research-footer)(?:[\s,{.#:>+~]|$)/m.test(css));
}

for (const file of walk(ROOT)) {
  const html = fs.readFileSync(file, 'utf8');
  const footers = footerBlocks(html);
  const hasCopyright = html.includes('Copyright ©');
  if (!hasCopyright && footers.length === 0) continue;

  if (hasCopyright && footers.length === 0) {
    fail(file, 'Copyright가 있으나 <footer> 요소가 없음');
    continue;
  }

  for (const footer of footers) {
    if (!/Copyright ©/.test(footer) && !/data-footer-standard=/.test(footer)) continue;
    checked += 1;

    if (!/data-footer-standard=["']v2["']/i.test(footer)) fail(file, 'Footer 표준 버전이 v2가 아님');
    if (!footer.includes(COPYRIGHT)) fail(file, '표준 Copyright 문구가 정확히 일치하지 않음');
    if (!/문의\s*<a[^>]+href=["']mailto:kimbrighth@gmail\.com["']/is.test(footer)) fail(file, '표준 문의 mailto가 없음');
    if (!footer.includes('AI 활용 안내')) fail(file, 'AI 활용 안내가 없음');
    if (!/href=["']#top["']/i.test(footer) || !/맨 위로/.test(footer)) fail(file, '맨 위로 이동 링크가 없음');
    if ((footer.match(/href=["']#top["']/gi) || []).length !== 1) fail(file, 'Footer의 #top 링크는 정확히 1개여야 함');
    if (!/<strong\b[^>]*>[\s\S]*?<\/strong>/i.test(footer)) fail(file, 'Footer 프로젝트명이 <strong>으로 명시되지 않음');

    const copyrightAt = footer.indexOf(COPYRIGHT);
    const contactAt = footer.indexOf('mailto:kimbrighth@gmail.com');
    const aiAt = footer.indexOf('AI 활용 안내');
    const topAt = indexOfHrefTop(footer);
    if (!(copyrightAt >= 0 && copyrightAt < contactAt && contactAt < aiAt && aiAt < topAt)) {
      fail(file, 'Footer 순서가 Copyright → 문의 → AI 활용 안내 → 맨 위로 이동 순서가 아님');
    }

    const businessAt = footer.indexOf(BUSINESS);
    const usesPortalOwner = /(?:\.\.\/|\.\/)portal-v2\.css(?:\?|["'])/i.test(html) && /\b(?:footer-meta|research-footer-meta)\b/.test(footer);
    if (businessAt >= 0) {
      if (!(businessAt < copyrightAt)) fail(file, '사업자정보가 Copyright보다 뒤에 있음');
    } else if (!usesPortalOwner) {
      fail(file, '사업자정보 원문이 Footer에 없고 승인된 portal-v2.css 공유원본도 사용하지 않음');
    }

    if (/layer-compact\.css/i.test(html)) {
      if (businessAt < 0) fail(file, 'compact Footer는 사업자정보를 HTML 원문으로 포함해야 함');
      if (!/class=["'][^"']*footer-description\b/i.test(footer)) fail(file, 'compact Footer에 프로젝트 영문명/설명 행이 없음');
    }

    if (/\bsite-footer\b/.test(footer) && !/portal-v2\.css/i.test(html)) {
      if (businessAt < 0) fail(file, '독립 site-footer는 사업자정보를 HTML에 직접 기록해야 함');
    }
  }

  if ((/portal-v2\.css/i.test(html) || /layer-compact\.css/i.test(html)) && inlineFooterOwnership(html)) {
    fail(file, '공통 Footer CSS를 사용하면서 inline style이 Footer 선택자를 다시 정의함');
  }
}

console.log(`Nexus footer standard audit: ${errors} error(s); standardized footers checked=${checked}`);
if (errors) process.exit(1);
