import fs from 'node:fs';

const HTML_FILE = 'nexus/research-track/index.html';
const CSS_FILE = 'nexus/research-track/project-standard.css';
const BUSINESS = '스카이예슈아 · 사업자등록번호 536-38-01234 · 대표 이명훈';
const COPYRIGHT = 'Copyright © 이명훈 2026. All rights reserved.';

let errors = 0;
const fail = message => {
  errors += 1;
  console.error(`ERROR ${HTML_FILE}: ${message}`);
  console.error(`::error file=${HTML_FILE}::${message}`);
};

if (!fs.existsSync(HTML_FILE)) fail('법학 학술연구 트랙 index.html 누락');
if (!fs.existsSync(CSS_FILE)) fail('canonical Footer 스타일 project-standard.css 누락');

if (!errors) {
  const html = fs.readFileSync(HTML_FILE, 'utf8');
  const css = fs.readFileSync(CSS_FILE, 'utf8');
  const footerMatch = html.match(/<footer\b[^>]*class=["'][^"']*\bsite-footer\b[^"']*["'][^>]*>[\s\S]*?<\/footer>/i);
  const footer = footerMatch ? footerMatch[0] : '';
  const footerTags = [...html.matchAll(/<footer\b[^>]*class=["']([^"']*)["'][^>]*>/gi)];
  const usesLegacyFooterClass = footerTags.some(match => match[1].split(/\s+/).includes('footer'));

  if (!footer) fail('표준 site-footer DOM을 사용하지 않음');
  if (usesLegacyFooterClass) fail('구형 footer 클래스가 다시 사용됨');
  if (!/data-footer-standard=["']v2["']/.test(footer)) fail('Footer 표준 버전 v2 누락');
  if (!/project-standard\.css\?v=/.test(html)) fail('canonical Footer CSS가 버전 쿼리와 함께 연결되지 않음');

  const required = [
    '법학 학술연구 트랙',
    'ACADEMIC LEGAL RESEARCH TRACK',
    BUSINESS,
    COPYRIGHT,
    'mailto:kimbrighth@gmail.com',
    'AI 활용 안내',
    'href="#top"',
    '맨 위로 이동 ↑'
  ];
  for (const token of required) if (!footer.includes(token)) fail(`Footer 필수 항목 누락: ${token}`);

  const projectAt = footer.indexOf('법학 학술연구 트랙');
  const descriptionAt = footer.indexOf('ACADEMIC LEGAL RESEARCH TRACK');
  const businessAt = footer.indexOf(BUSINESS);
  const copyrightAt = footer.indexOf(COPYRIGHT);
  const contactAt = footer.indexOf('mailto:kimbrighth@gmail.com');
  const aiAt = footer.indexOf('AI 활용 안내');
  const topAt = footer.indexOf('href="#top"');
  if (!(projectAt >= 0 && projectAt < descriptionAt && descriptionAt < businessAt && businessAt < copyrightAt && copyrightAt < contactAt && contactAt < aiAt && aiAt < topAt)) {
    fail('Footer 표시 순서가 프로젝트명 → 설명 → 사업자정보 → Copyright → 문의 → AI 안내 → 맨 위 순서가 아님');
  }

  if (!/\.site-footer\s*\{[^}]*text-align\s*:\s*center/i.test(css)) fail('canonical Footer 중앙정렬 규칙 누락');
  if (!/\.site-footer\s*\{[^}]*margin\s*:\s*0\s+auto/i.test(css)) fail('Footer 컨테이너 중앙 배치 규칙 누락');
  if (!/\.footer-meta\s+p\s*\{[^}]*margin\s*:\s*0\s+auto/i.test(css)) fail('사업자정보·Copyright·문의 행의 무간격 규칙 누락');
  if (/\.site-footer\s*\{[^}]*text-align\s*:\s*(?:left|right)/i.test(css)) fail('Footer가 중앙정렬 이외의 정렬을 사용함');
  if (/@media[\s\S]*?\.site-footer\s*\{[^}]*text-align\s*:\s*(?:left|right)/i.test(css)) fail('모바일에서 Footer 정렬이 변경됨');
}

console.log(`Research-track footer audit: ${errors} error(s)`);
if (errors) process.exit(1);
