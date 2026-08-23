import fs from 'node:fs';

function replace(path, pairs) {
  let text = fs.readFileSync(path, 'utf8');
  const before = text;
  for (const [from, to] of pairs) {
    if (!text.includes(from)) {
      console.warn(`skip ${path}: ${from}`);
      continue;
    }
    text = text.split(from).join(to);
  }
  if (text !== before) fs.writeFileSync(path, text);
}

replace('legal-knowledge/legal-mind/style.css', [
  ['.section-head>p{max-width:520px;margin:0;color:#111111;font-size:13px;', '.section-head>p{max-width:520px;margin:0;color:#111111;font-size:14px;'],
  ['.mode-card p{grid-column:2/4;grid-row:2;margin:2px 0 0;color:#111111;font-size:13px;', '.mode-card p{grid-column:2/4;grid-row:2;margin:2px 0 0;color:#111111;font-size:14px;'],
  ['.engine-grid strong{grid-column:2;grid-row:1;display:block;color:var(--text);font-size:13px;', '.engine-grid strong{grid-column:2;grid-row:1;display:block;color:var(--text);font-size:15px;'],
  ['.engine-grid span{grid-column:2;grid-row:2;display:block;margin:1px 0 0;color:#111111;font-size:13px;', '.engine-grid span{grid-column:2;grid-row:2;display:block;margin:1px 0 0;color:#111111;font-size:14px;'],
  ['.case-card .summary{margin:0;color:#111111;font-size:13px;', '.case-card .summary{margin:0;color:#111111;font-size:14px;'],
  ['.case-card .question{margin:6px 0 0;color:#111111;font-size:13px;', '.case-card .question{margin:6px 0 0;color:#111111;font-size:14px;']
]);

replace('toeic-human-100/project-standard.css', [
  ['color:#5f7086;', 'color:#111111;'],
  ['color:#53677d;', 'color:#111111;'],
  ['color:#5d6e82;', 'color:#111111;'],
  ['color:#5c6f84;', 'color:#111111;'],
  ['font-size:.82rem', 'font-size:.875rem'],
  ['font-size:.84rem', 'font-size:.875rem'],
  ['font-size:.85rem', 'font-size:.875rem'],
  ['font-size:.86rem', 'font-size:.875rem']
]);
