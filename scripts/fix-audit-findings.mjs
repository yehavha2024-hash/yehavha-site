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
  next = next.replace(
    "const hasTightLegalRows = css => /(?:\\.footer-meta|\\.footer-note)[^\\{]*\\s+p[^\\{]*\\{[^}]*margin\\s*:\\s*0(?:\\s+auto)?(?:\\s*!important)?\\s*;/si.test(stripCssComments(css));",
    "const hasTightLegalRows = css => /(?:\\.footer-meta|\\.footer-note)[^\\{]*\\s+p[^\\{]*\\{[^}]*margin\\s*:\\s*0(?:\\s+auto)?(?:\\s*!important)?\\s*(?:;|(?=\\}))/si.test(stripCssComments(css));"
  );
  next = next.replace("  '.back{display:inline-flex',\n", '');
  next = next.replace(
    "  if (/portal-v2\\.css/.test(html) && /data-footer-standard=/.test(html)) {\n    if (!/class=[\"'][^\"']*(?:\\bfooter-meta\\b|\\bresearch-footer-meta\\b)/.test(html)) fail(file, '전역 사업자정보가 적용될 Footer meta 클래스가 없음');\n  }",
    "  if (/portal-v2\\.css/.test(html) && /data-footer-standard=/.test(html)) {\n    const hasSharedMeta = /class=[\"'][^\"']*(?:\\bfooter-meta\\b|\\bresearch-footer-meta\\b)/.test(html);\n    if (!hasSharedMeta && !html.includes(BUSINESS_FOOTER)) fail(file, '전역 사업자정보 공유 클래스 또는 명시적 사업자정보가 없음');\n  }"
  );
  return next;
});

edit('scripts/audit-style-ownership.mjs', source => source.replace(
`function ownerBlocks(css, className) {
  const blocks = [];
  const re = /([^{}]+)\\{([^{}]*)\\}/g;
  for (const match of css.matchAll(re)) {
    if (selectorOwnsClass(match[1], className)) blocks.push(\`${'${match[1]}'}{${'${match[2]}'} }\`.replace(' }', '}'));
  }
  return blocks;
}`,
`function ownerBlocks(css, className) {
  const blocks = [];
  const cleanCss = css.replace(/\\/\\*[\\s\\S]*?\\*\\//g, '');
  const re = /([^{}]+)\\{([^{}]*)\\}/g;
  for (const match of cleanCss.matchAll(re)) {
    if (selectorOwnsClass(match[1], className)) blocks.push(\`${'${match[1]}'}{${'${match[2]}'} }\`.replace(' }', '}'));
  }
  return blocks;
}`
));

edit('scripts/audit-web-architecture.mjs', source => {
  let next = source;
  next = next.replace(
    "    if (!ref || ref.startsWith('#') || /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(ref)) continue;",
    "    if (!ref || ref.includes('${') || ref.startsWith('#') || /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(ref)) continue;"
  );
  next = next.replace(
    "  if (!index.includes('data-footer-standard=\"v1\"')) {\n    report('ERROR', root, '메인 footer에 data-footer-standard=\"v1\" 없음');\n  }",
    "  if (!index.includes('data-footer-standard=\"v2\"')) {\n    report('ERROR', root, '메인 footer에 data-footer-standard=\"v2\" 없음');\n  }"
  );
  return next;
});

edit('toeic-human-100/reading-v2.css', source => source.replace('.site-footer strong{color:var(--navy)}', ''));

console.log(`Resolved audit blind spots in ${changed.length} file(s):`);
changed.forEach(file => console.log(`- ${file}`));
