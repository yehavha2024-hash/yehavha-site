import fs from 'node:fs';

const changed = [];
const edit = (file, transform) => {
  const before = fs.readFileSync(file, 'utf8');
  const after = transform(before);
  if (after === before) throw new Error(`expected change not applied: ${file}`);
  fs.writeFileSync(file, after);
  changed.push(file);
};

edit('scripts/audit-business-footer.mjs', source => {
  let next = source;

  const oldTight = "const hasTightLegalRows = css => /(?:\\.footer-meta|\\.footer-note)[^\\{]*\\s+p[^\\{]*\\{[^}]*margin\\s*:\\s*0(?:\\s+auto)?(?:\\s*!important)?\\s*;/si.test(stripCssComments(css));";
  const newTight = "const hasTightLegalRows = css => /(?:\\.footer-meta|\\.footer-note)[^\\{]*\\s+p[^\\{]*\\{[^}]*margin\\s*:\\s*0(?:\\s+auto)?(?:\\s*!important)?\\s*(?:;|(?=\\}))/si.test(stripCssComments(css));";
  if (!next.includes(oldTight)) throw new Error('business audit tight-row detector not found');
  next = next.replace(oldTight, newTight);

  const backToken = "  '.back{display:inline-flex',\n";
  if (!next.includes(backToken)) throw new Error('obsolete compact back token not found');
  next = next.replace(backToken, '');

  const oldPortalCheck = `  if (/portal-v2\\.css/.test(html) && /data-footer-standard=/.test(html)) {
    if (!/class=["'][^"']*(?:\\bfooter-meta\\b|\\bresearch-footer-meta\\b)/.test(html)) fail(file, '전역 사업자정보가 적용될 Footer meta 클래스가 없음');
  }`;
  const newPortalCheck = `  if (/portal-v2\\.css/.test(html) && /data-footer-standard=/.test(html)) {
    const hasSharedMeta = /class=["'][^"']*(?:\\bfooter-meta\\b|\\bresearch-footer-meta\\b)/.test(html);
    if (!hasSharedMeta && !html.includes(BUSINESS_FOOTER)) fail(file, '전역 사업자정보 공유 클래스 또는 명시적 사업자정보가 없음');
  }`;
  if (!next.includes(oldPortalCheck)) throw new Error('portal footer metadata detector not found');
  next = next.replace(oldPortalCheck, newPortalCheck);

  return next;
});

edit('scripts/audit-style-ownership.mjs', source => {
  const start = source.indexOf('function ownerBlocks(css, className) {');
  const end = source.indexOf('\n\nfunction activeReturnClass', start);
  if (start < 0 || end < 0) throw new Error('ownerBlocks function not found');
  const replacement = `function ownerBlocks(css, className) {
  const blocks = [];
  const cleanCss = css.replace(/\\/\\*[\\s\\S]*?\\*\\//g, '');
  const re = /([^{}]+)\\{([^{}]*)\\}/g;
  for (const match of cleanCss.matchAll(re)) {
    if (selectorOwnsClass(match[1], className)) blocks.push(match[1] + '{' + match[2] + '}');
  }
  return blocks;
}`;
  return source.slice(0, start) + replacement + source.slice(end);
});

edit('scripts/audit-web-architecture.mjs', source => {
  let next = source;
  const oldRef = "    if (!ref || ref.startsWith('#') || /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(ref)) continue;";
  const newRef = "    if (!ref || ref.includes('${') || ref.startsWith('#') || /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(ref)) continue;";
  if (!next.includes(oldRef)) throw new Error('dynamic local-reference guard not found');
  next = next.replace(oldRef, newRef);

  const oldVersion = `  if (!index.includes('data-footer-standard="v1"')) {
    report('ERROR', root, '메인 footer에 data-footer-standard="v1" 없음');
  }`;
  const newVersion = `  if (!index.includes('data-footer-standard="v2"')) {
    report('ERROR', root, '메인 footer에 data-footer-standard="v2" 없음');
  }`;
  if (!next.includes(oldVersion)) throw new Error('legacy v1 architecture rule not found');
  next = next.replace(oldVersion, newVersion);
  return next;
});

edit('toeic-human-100/reading-v2.css', source => {
  const legacy = '.site-footer strong{color:var(--navy)}';
  if (!source.includes(legacy)) throw new Error('duplicate TOEIC footer owner not found');
  return source.replace(legacy, '');
});

console.log(`Resolved audit blind spots in ${changed.length} file(s):`);
changed.forEach(file => console.log(`- ${file}`));
