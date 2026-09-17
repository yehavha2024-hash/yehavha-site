import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const nexusDir = path.resolve(here, '..');
const articleDir = path.join(nexusDir, 'news', 'articles');

const STANDARD_HEADER = '<header class="news-head"><div class="news-wrap news-head-inner"><a class="news-home" href="../">← YEHAVHA NEWS</a><span class="news-mark">YEHAVHA NEWS</span></div></header>';
const STANDARD_SLOGAN = '뉴스에서 전략으로, 전략에서 실행으로';
const STANDARD_FOOTER = `<footer class="footer" data-footer-standard="v2"><div class="container"><div class="footer-card"><strong>YEHAVHA NEWS</strong><p>${STANDARD_SLOGAN}</p><div aria-label="사업자정보·저작권 및 문의" class="footer-meta"><p class="business-meta">스카이예슈아 · 사업자등록번호 536-38-01234<br/>통신판매번호 : 2025-서울서초-2352 · 대표 이명훈</p><p class="research-identifiers">국가연구자번호 13169680 · ISNI 0000000513760591<br/>ORCID 0009-0000-6095-8067</p><p class="copyright">Copyright © 이명훈 2026. All rights reserved.</p><p class="contact">문의 <a href="mailto:kimbrighth@gmail.com">kimbrighth@gmail.com</a></p><p class="ai-disclosure">AI 활용 안내: 자료 탐색·정리와 초안 구성에 생성형 AI를 보조적으로 활용할 수 있으며, 사실 확인·판단·편집·공개 여부는 운영자가 관리합니다.</p><a href="#top">맨 위로 이동 ↑</a></div></div></div></footer>`;

const articleFiles = fs.readdirSync(articleDir).filter(name => name.endsWith('.html')).sort();
let changed = 0;

function addTopAnchor(source) {
  return source.replace(/<body\b([^>]*)>/i, (whole, attrs) => {
    if (/\bid\s*=\s*(["'])top\1/i.test(whole)) return whole;
    return `<body${attrs} id="top">`;
  });
}

function replaceSingleton(source, pattern, replacement) {
  let seen = false;
  return source.replace(pattern, () => {
    if (seen) return '';
    seen = true;
    return replacement;
  });
}

function normalizeArticle(source, filename) {
  if (!/<body\b[^>]*>/i.test(source)) throw new Error(`${filename}: body element missing`);
  if (!/<\/body>/i.test(source)) throw new Error(`${filename}: closing body element missing`);
  if (!/<main\b/i.test(source)) throw new Error(`${filename}: main element missing`);

  let next = addTopAnchor(source);

  const headerPattern = /<header\b(?=[^>]*class\s*=\s*(["'])[^"']*\bnews-head\b[^"']*\1)[^>]*>[\s\S]*?<\/header>/gi;
  if (headerPattern.test(next)) {
    headerPattern.lastIndex = 0;
    next = replaceSingleton(next, headerPattern, STANDARD_HEADER);
  } else {
    next = next.replace(/<body\b[^>]*>/i, match => `${match}${STANDARD_HEADER}`);
  }

  const footerPattern = /<footer\b(?=[^>]*(?:data-footer-standard\s*=|class\s*=\s*(["'])[^"']*\bfooter\b[^"']*\1))[^>]*>[\s\S]*?<\/footer>/gi;
  if (footerPattern.test(next)) {
    footerPattern.lastIndex = 0;
    next = replaceSingleton(next, footerPattern, STANDARD_FOOTER);
  } else {
    next = next.replace(/<\/body>/i, `${STANDARD_FOOTER}</body>`);
  }

  return next;
}

for (const filename of articleFiles) {
  const file = path.join(articleDir, filename);
  const original = fs.readFileSync(file, 'utf8');
  const normalized = normalizeArticle(original, filename);

  if (normalized !== original) {
    fs.writeFileSync(file, normalized.endsWith('\n') ? normalized : `${normalized}\n`, 'utf8');
    changed += 1;
    console.log(`normalized ${filename}`);
  }
}

for (const filename of articleFiles) {
  const source = fs.readFileSync(path.join(articleDir, filename), 'utf8');
  const required = [
    ['top anchor', /<body\b[^>]*\bid\s*=\s*(["'])top\1/i],
    ['news header', /<header\b(?=[^>]*class\s*=\s*(["'])[^"']*\bnews-head\b[^"']*\1)[^>]*>/i],
    ['standard footer', /data-footer-standard\s*=\s*(["'])v2\1/i],
    ['standard slogan', new RegExp(STANDARD_SLOGAN)],
    ['business metadata', /class\s*=\s*(["'])business-meta\1/i],
    ['copyright', /class\s*=\s*(["'])copyright\1/i],
    ['contact', /class\s*=\s*(["'])contact\1/i],
    ['AI disclosure', /class\s*=\s*(["'])ai-disclosure\1/i]
  ];
  for (const [label, pattern] of required) {
    if (!pattern.test(source)) throw new Error(`${filename}: ${label} missing after normalization`);
  }

  const headerCount = (source.match(/<header\b(?=[^>]*class\s*=\s*(["'])[^"']*\bnews-head\b[^"']*\1)[^>]*>/gi) || []).length;
  const footerCount = (source.match(/data-footer-standard\s*=\s*(["'])v2\1/gi) || []).length;
  const footerElementCount = (source.match(/<footer\b/gi) || []).length;
  if (headerCount !== 1) throw new Error(`${filename}: expected exactly one standard news header, found ${headerCount}`);
  if (footerCount !== 1) throw new Error(`${filename}: expected exactly one standard footer, found ${footerCount}`);
  if (footerElementCount !== 1) throw new Error(`${filename}: expected exactly one footer element, found ${footerElementCount}`);
}

console.log(`YEHAVHA NEWS shell normalization complete: ${changed} changed / ${articleFiles.length} checked.`);
