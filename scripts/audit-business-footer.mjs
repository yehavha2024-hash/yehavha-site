import fs from 'node:fs';
import path from 'node:path';

const BUSINESS_FOOTER = '스카이예슈아 · 사업자등록번호 536-38-01234 · 대표 이명훈';
const COPYRIGHT = 'Copyright © 이명훈 2026. All rights reserved.';
const PORTAL_CSS = 'nexus/portal-v2.css';
const ARTICLE_CSS = 'nexus/articles/articles.css';
const COMPACT_CSS = 'nexus/layer-compact.css';
const STANDALONE_ROOTS = [
  'ai-law-tech-foresight',
  'legal-philosophy',
  'legal-knowledge',
  'three-minute-break',
  'toeic-human-100'
];

let errors = 0;
const fail = (file, message) => {
  errors += 1;
  console.error(`ERROR ${file}: ${message}`);
  console.error(`::error file=${file}::${message}`);
};

const normalize = file => file.split(path.sep).join('/');
const stripCssComments = css => css.replace(/\/\*[\s\S]*?\*\//g, '');
const hasSiteFooterSelector = css => /(?:^|[}\n])\s*\.site-footer(?:\[[^\]]+\])?(?=[\s,{.#:>+~])/m.test(stripCssComments(css));
const hasGenericFooterSelector = css => /(?:^|[}\n])\s*footer(?=[\s,{.#:>+~])/m.test(stripCssComments(css));
const hasCenteredSiteFooter = css => /\.site-footer[^\{]*\{[^}]*text-align\s*:\s*center/si.test(stripCssComments(css));

const linkedLocalCss = htmlFile => {
  const html = fs.readFileSync(htmlFile, 'utf8');
  const links = [];
  const re = /<link\b[^>]*\bhref=["']([^"']+\.css(?:\?[^"']*)?)["'][^>]*>/gi;
  for (const match of html.matchAll(re)) {
    const href = match[1].split('#')[0].split('?')[0];
    if (/^(?:https?:)?\/\//i.test(href) || href.startsWith('data:')) continue;
    const resolved = normalize(path.normalize(path.join(path.dirname(htmlFile), href)));
    if (fs.existsSync(resolved)) links.push(resolved);
  }
  return [...new Set(links)];
};

const walkHtml = (dir, out = []) => {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, out);
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(normalize(full));
  }
  return out;
};

// Nexus keeps one global business-metadata source in portal-v2.css.
const css = fs.readFileSync(PORTAL_CSS, 'utf8');
if (!css.includes(BUSINESS_FOOTER)) fail(PORTAL_CSS, 'Nexus 전역 사업자정보 단일 원본이 누락됨');
if (!/\.footer-meta::before\s*,\s*\.research-footer-meta::before\s*\{/.test(css.replace(/\n/g, ' '))) {
  fail(PORTAL_CSS, '일반 Footer와 전문 연구 Footer에 사업자정보가 함께 적용되지 않음');
}

const requiredPortalFooterTokens = [
  '--nxs-footer-project:13px',
  '--nxs-footer-description:11px',
  '--nxs-footer-text:12px',
  '--nxs-footer-ai:11.5px',
  '--nxs-footer-link:11px',
  'text-align:center!important',
  'flex-direction:column!important',
  'align-items:center!important'
];
for (const token of requiredPortalFooterTokens) {
  if (!css.includes(token)) fail(PORTAL_CSS, `전역 Footer 규격 누락: ${token}`);
}

const articleCss = fs.readFileSync(ARTICLE_CSS, 'utf8');
if (/(^|\n)\s*\.(?:footer|footer-card|footer-meta|reader-site-footer|research-footer)(?:\s|,|\{|:)/m.test(articleCss)) {
  fail(ARTICLE_CSS, '글 아카이브가 전역 Footer 스타일을 다시 소유함');
}
if (articleCss.includes(BUSINESS_FOOTER)) fail(ARTICLE_CSS, '사업자정보가 로컬 CSS에 중복됨');

const compactCss = fs.readFileSync(COMPACT_CSS, 'utf8');
const compactTokens = [
  'font-size:15px;line-height:1.75',
  '.back{display:inline-flex',
  'font-size:11.5px',
  '.footer{margin-top:0;padding:18px 0 36px',
  'text-align:center',
  '.footer>strong{display:block;color:#d7e1ea;font-size:13px',
  '.footer-meta>p{margin:2px auto;color:var(--footer-text);font-size:12px',
  '.footer .ai-disclosure{order:3',
  'font-size:11.5px',
  '.footer-meta>a{order:4',
  'font-size:11px'
];
for (const token of compactTokens) if (!compactCss.includes(token)) fail(COMPACT_CSS, `compact template 공통 규격 누락: ${token}`);
if (!/\.footer-meta>p:nth-child\(2\)\{order:0/.test(compactCss)) fail(COMPACT_CSS, 'compact Footer 사업자정보가 Copyright 앞으로 재정렬되지 않음');

// Nexus HTML continues to use the global portal owner or the compact template owner.
for (const file of walkHtml('nexus')) {
  const html = fs.readFileSync(file, 'utf8');
  if (/portal-v2\.css/.test(html) && /data-footer-standard=/.test(html)) {
    if (!/class=["'][^"']*(?:\bfooter-meta\b|\bresearch-footer-meta\b)/.test(html)) fail(file, '전역 사업자정보가 적용될 Footer meta 클래스가 없음');
  }
  if (/layer-compact\.css/.test(html)) {
    if (!/class=["'][^"']*\bfooter-meta\b/.test(html)) fail(file, 'compact template Footer meta 클래스가 없음');
    if (!html.includes(BUSINESS_FOOTER)) fail(file, 'compact template HTML의 사업자정보 원문 누락');
  }
  if (/Copyright ©/.test(html) && !/문의\s*<a[^>]+mailto:/s.test(html)) fail(file, 'Copyright는 있으나 문의 mailto가 없음');
  if (/맨 위로 이동/.test(html) && !/href=["']#top["']/.test(html)) fail(file, '맨 위로 이동 링크 대상이 #top이 아님');
}

// Standalone projects must not rely on "last CSS wins". Each footer has one visual owner.
const standaloneHtml = STANDALONE_ROOTS.flatMap(root => walkHtml(root));
for (const file of standaloneHtml) {
  const html = fs.readFileSync(file, 'utf8');
  const hasSiteFooter = /<footer\b[^>]*class=["'][^"']*\bsite-footer\b[^"']*["'][^>]*>/i.test(html);
  const hasCopyright = html.includes(COPYRIGHT) || /Copyright ©/.test(html);
  if (!hasSiteFooter && !hasCopyright) continue;

  if (!hasSiteFooter) fail(file, 'Copyright가 있으나 표준 site-footer DOM을 사용하지 않음');
  if (!/data-footer-standard=["']v2["']/.test(html)) fail(file, 'Footer 표준 버전은 v2여야 함');
  if (!html.includes(BUSINESS_FOOTER)) fail(file, '독립 프로젝트 Footer에 사업자정보 원문이 없음');
  if (!html.includes(COPYRIGHT)) fail(file, '표준 Copyright 문구가 없음');
  if (!/문의\s*<a[^>]+href=["']mailto:kimbrighth@gmail\.com["']/s.test(html)) fail(file, '표준 문의 mailto가 없음');
  if (!/AI 활용 안내/.test(html)) fail(file, 'AI 활용 안내가 없음');
  if (!/href=["']#top["']/.test(html) || !/맨 위로/.test(html)) fail(file, '맨 위로 이동 링크가 없음');

  const businessAt = html.indexOf(BUSINESS_FOOTER);
  const copyrightAt = html.indexOf(COPYRIGHT);
  const contactAt = html.indexOf('mailto:kimbrighth@gmail.com');
  const aiAt = html.indexOf('AI 활용 안내');
  const topAt = html.indexOf('href="#top"') >= 0 ? html.indexOf('href="#top"') : html.indexOf("href='#top'");
  if (!(businessAt < copyrightAt && copyrightAt < contactAt && contactAt < aiAt && aiAt < topAt)) {
    fail(file, 'Footer 표시 순서가 사업자정보 → Copyright → 문의 → AI 활용 안내 → 맨 위로 이동 순서가 아님');
  }

  const linkedCss = linkedLocalCss(file);
  const cssOwnership = linkedCss.map(cssFile => {
    const source = fs.readFileSync(cssFile, 'utf8');
    return {
      file: cssFile,
      source,
      specific: hasSiteFooterSelector(source),
      generic: hasGenericFooterSelector(source)
    };
  });
  const owners = cssOwnership.filter(item => item.specific || item.generic);
  const specificOwners = cssOwnership.filter(item => item.specific);

  if (specificOwners.length !== 1) {
    fail(file, `site-footer 전용 CSS 소유자는 정확히 1개여야 함: ${specificOwners.map(x => x.file).join(', ') || '없음'}`);
  }
  if (owners.length !== 1) {
    fail(file, `Footer에 영향을 주는 CSS 소유권이 중복됨: ${owners.map(x => x.file).join(', ') || '없음'}`);
  }
  if (specificOwners.length === 1 && !hasCenteredSiteFooter(specificOwners[0].source)) {
    fail(specificOwners[0].file, 'canonical site-footer 소유자에 중앙정렬 규칙이 없음');
  }
  for (const owner of owners) {
    if (/(?:footer|override|patch|hotfix)[^/]*\.css$/i.test(path.basename(owner.file))) {
      fail(owner.file, 'Footer 전용 patch/override/hotfix CSS를 별도 소유자로 두지 말고 기존 canonical CSS에 통합해야 함');
    }
  }
}

console.log(`Business/footer canonical audit: ${errors} error(s); standalone HTML checked=${standaloneHtml.length}`);
if (errors) process.exit(1);
