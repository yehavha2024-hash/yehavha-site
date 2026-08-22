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
const hasTightLegalRows = css => /(?:\.footer-meta|\.footer-note)[^\{]*\s+p[^\{]*\{[^}]*margin\s*:\s*0(?:\s+auto)?(?:\s*!important)?\s*;/si.test(stripCssComments(css));

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

const walkFiles = (dir, predicate, out = []) => {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, predicate, out);
    else if (entry.isFile() && predicate(entry.name, full)) out.push(normalize(full));
  }
  return out;
};

const walkHtml = dir => walkFiles(dir, name => name.endsWith('.html'));
const walkCss = dir => walkFiles(dir, name => name.endsWith('.css'));
const walkJs = dir => walkFiles(dir, name => /\.(?:js|mjs)$/i.test(name));

const extractSiteFooter = html => {
  const match = html.match(/<footer\b[^>]*class=["'][^"']*\bsite-footer\b[^"']*["'][^>]*>[\s\S]*?<\/footer>/i);
  return match ? match[0] : '';
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
if (!/\.footer-meta::before\s*,\s*\.research-footer-meta::before\s*\{[^}]*margin:\s*0 auto/s.test(css)) {
  fail(PORTAL_CSS, '사업자정보 행에 불필요한 세로 margin이 있음');
}
if (!/\.footer-meta p\s*,\s*\.research-footer-meta p\s*\{[^}]*margin:\s*0 auto!important/s.test(css)) {
  fail(PORTAL_CSS, '사업자정보·Copyright·문의 3행이 무간격 규격이 아님');
}
if (!/\.footer-meta \.ai-disclosure\s*,\s*\.research-footer-meta \.ai-disclosure\s*\{[^}]*margin-top:\s*6px!important/s.test(css)) {
  fail(PORTAL_CSS, 'AI 활용 안내 분리 간격이 명시되지 않음');
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
  '.footer-meta>p{margin:0 auto;color:var(--footer-text);font-size:12px',
  '.footer .ai-disclosure{order:3',
  'font-size:11.5px',
  '.footer-meta>a{order:4',
  'font-size:11px'
];
for (const token of compactTokens) if (!compactCss.includes(token)) fail(COMPACT_CSS, `compact template 공통 규격 누락: ${token}`);
if (!/\.footer-meta>p:nth-child\(2\)\{order:0/.test(compactCss)) fail(COMPACT_CSS, 'compact Footer 사업자정보가 Copyright 앞으로 재정렬되지 않음');
if (!/\.footer \.ai-disclosure\{[^}]*margin:6px auto 0/.test(compactCss)) fail(COMPACT_CSS, 'compact Footer AI 안내 분리 간격이 명시되지 않음');

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
  if (/<a\b[^>]*href=["']#top["'][^>]*onclick=/i.test(html)) fail(file, '맨 위로 이동에 인라인 JavaScript 보정이 남아 있음. native fragment를 사용해야 함');
}

// Reject stale patch/hotfix CSS that can later be re-linked and override canonical ownership.
for (const root of STANDALONE_ROOTS) {
  for (const file of walkCss(root)) {
    const source = fs.readFileSync(file, 'utf8');
    if (!hasSiteFooterSelector(source)) continue;
    const base = path.basename(file);
    if (/(?:override|patch|hotfix|footer[-_.]?(?:fix|override|patch|hotfix))/i.test(base)) {
      fail(file, '사이트 Footer를 소유하는 임시 override/patch/hotfix CSS가 저장소에 남아 있음');
    }
  }
  for (const file of walkJs(root)) {
    const source = fs.readFileSync(file, 'utf8');
    if (/querySelector\([^\n;]*["']\.site-footer["']/.test(source) && /(?:innerHTML|outerHTML|insertAdjacentHTML|replaceChildren|\.append\(|\.prepend\()/.test(source)) {
      fail(file, 'JavaScript가 site-footer DOM을 생성·교체함. Footer는 HTML 정적 원본이 소유해야 함');
    }
  }
}

// Standalone projects must not rely on "last CSS wins". Each footer has one visual owner.
const standaloneHtml = STANDALONE_ROOTS.flatMap(root => walkHtml(root));
for (const file of standaloneHtml) {
  const html = fs.readFileSync(file, 'utf8');
  const footerHtml = extractSiteFooter(html);
  const hasSiteFooter = Boolean(footerHtml);
  const hasCopyright = html.includes(COPYRIGHT) || /Copyright ©/.test(html);
  if (!hasSiteFooter && !hasCopyright) continue;

  if (!hasSiteFooter) {
    fail(file, 'Copyright가 있으나 표준 site-footer DOM을 사용하지 않음');
    continue;
  }
  if (!/data-footer-standard=["']v2["']/.test(footerHtml)) fail(file, 'Footer 표준 버전은 v2여야 함');
  if (!footerHtml.includes(BUSINESS_FOOTER)) fail(file, '독립 프로젝트 Footer에 사업자정보 원문이 없음');
  if (!footerHtml.includes(COPYRIGHT)) fail(file, '표준 Copyright 문구가 없음');
  if (!/문의\s*<a[^>]+href=["']mailto:kimbrighth@gmail\.com["']/s.test(footerHtml)) fail(file, '표준 문의 mailto가 없음');
  if (!/AI 활용 안내/.test(footerHtml)) fail(file, 'AI 활용 안내가 없음');
  if (!/href=["']#top["']/.test(footerHtml) || !/맨 위로/.test(footerHtml)) fail(file, '맨 위로 이동 링크가 없음');
  if (/<a\b[^>]*href=["']#top["'][^>]*onclick=/i.test(footerHtml)) fail(file, '맨 위로 이동 링크가 인라인 JavaScript에 의존함');

  const businessAt = footerHtml.indexOf(BUSINESS_FOOTER);
  const copyrightAt = footerHtml.indexOf(COPYRIGHT);
  const contactAt = footerHtml.indexOf('mailto:kimbrighth@gmail.com');
  const aiAt = footerHtml.indexOf('AI 활용 안내');
  const topMatch = footerHtml.match(/href=["']#top["']/);
  const topAt = topMatch ? topMatch.index : -1;
  if (!(businessAt >= 0 && businessAt < copyrightAt && copyrightAt < contactAt && contactAt < aiAt && aiAt < topAt)) {
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
  if (specificOwners.length === 1 && !hasTightLegalRows(specificOwners[0].source)) {
    fail(specificOwners[0].file, '사업자정보·Copyright·문의 3행 사이 margin은 0이어야 함');
  }
}

// Legal philosophy detail documents are generated at runtime, so audit their static source explicitly.
const philosophyApp = 'legal-philosophy/app.js';
if (fs.existsSync(philosophyApp)) {
  const source = fs.readFileSync(philosophyApp, 'utf8');
  if (/detail-footer/.test(source)) {
    if (!source.includes(BUSINESS_FOOTER)) fail(philosophyApp, '연구내용 보기 Footer에 사업자정보 원문이 없음');
    if (!source.includes(COPYRIGHT)) fail(philosophyApp, '연구내용 보기 Footer에 표준 Copyright가 없음');
    if (!/mailto:kimbrighth@gmail\.com/.test(source)) fail(philosophyApp, '연구내용 보기 Footer 문의가 mailto가 아님');
    if (!/detail-footer-meta/.test(source)) fail(philosophyApp, '연구내용 보기 Footer가 canonical detail-footer-meta 구조를 사용하지 않음');
  }
}

console.log(`Business/footer canonical audit: ${errors} error(s); standalone HTML checked=${standaloneHtml.length}`);
if (errors) process.exit(1);
