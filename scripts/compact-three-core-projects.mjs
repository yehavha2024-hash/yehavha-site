import fs from 'node:fs';

function edit(path, pairs) {
  let text = fs.readFileSync(path, 'utf8');
  const before = text;
  for (const [from, to, required = true] of pairs) {
    if (required && !text.includes(from)) throw new Error(`${path}: missing expected fragment: ${from}`);
    text = text.split(from).join(to);
  }
  if (text === before) throw new Error(`${path}: no changes produced`);
  fs.writeFileSync(path, text);
  console.log(`updated ${path}`);
}

edit('legal-knowledge/legal-mind/style.css', [
  ['.hero{padding:28px 0 42px', '.hero{padding:22px 0 30px'],
  ['.back-nav{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px}', '.back-nav{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:18px}'],
  ['.lead{max-width:960px;margin:20px 0 0;color:#111111;font-size:16px;line-height:1.86}', '.lead{max-width:960px;margin:14px 0 0;color:#111111;font-size:16px;line-height:1.76}'],
  ['.hero-meta{display:flex;flex-wrap:wrap;gap:7px;margin-top:22px', '.hero-meta{display:flex;flex-wrap:wrap;gap:6px;margin-top:14px'],
  ['.hero-meta span{padding:6px 9px', '.hero-meta span{padding:5px 8px'],
  ['main{padding:30px 0 56px}', 'main{padding:22px 0 40px}'],
  ['gap:22px;padding:18px 20px;border:1px solid var(--line);border-left:3px solid var(--accent)', 'gap:14px;padding:14px 16px;border:1px solid var(--line);border-left:3px solid var(--accent)'],
  ['.training-map,.reasoning-engine,.case-section{margin-top:34px}', '.training-map,.reasoning-engine,.case-section{margin-top:24px}'],
  ['.section-head{display:flex;justify-content:space-between;gap:22px;align-items:flex-end;margin-bottom:14px}', '.section-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-end;margin-bottom:10px}'],
  ['.mode-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}', '.mode-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}'],
  ['gap:3px 11px;align-items:center;min-width:0;padding:13px 14px', 'gap:2px 9px;align-items:center;min-width:0;padding:10px 12px'],
  ['.engine-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}', '.engine-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px}'],
  ['column-gap:8px;row-gap:1px;align-items:center;min-width:0;padding:11px 10px', 'column-gap:8px;row-gap:1px;align-items:center;min-width:0;padding:8px 10px'],
  ['gap:10px;margin-top:34px;padding:12px;border:1px solid var(--line)', 'gap:8px;margin-top:24px;padding:10px;border:1px solid var(--line)'],
  ['.case-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}', '.case-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}'],
  ['gap:11px;min-width:0;padding:16px;border:1px solid var(--line)', 'gap:9px;min-width:0;padding:12px;border:1px solid var(--line)'],
  ['.case-card h3{margin:9px 0 6px', '.case-card h3{margin:6px 0 4px'],
  ['.case-card .question{margin:9px 0 0', '.case-card .question{margin:6px 0 0'],
  ['min-height:38px;margin-top:10px', 'min-height:36px;margin-top:7px'],
  ['.case-dialog article{height:100%;overflow-y:auto;padding:30px 34px 38px}', '.case-dialog article{height:100%;overflow-y:auto;padding:24px 26px 28px}'],
  ['padding:0 48px 22px 0', 'padding:0 48px 16px 0'],
  ['margin:16px auto 0;padding:14px 15px', 'margin:12px auto 0;padding:11px 13px'],
  ['margin:10px auto 0;padding:15px 16px', 'margin:8px auto 0;padding:11px 13px'],
  ['padding:7px 0;border-top:1px solid var(--line-soft)', 'padding:5px 0;border-top:1px solid var(--line-soft)'],
  ['.detail-steps{max-width:820px;margin:10px auto 0}', '.detail-steps{max-width:820px;margin:8px auto 0}'],
  ['gap:8px;align-items:center;padding:14px 0;cursor:pointer', 'gap:8px;align-items:center;padding:10px 0;cursor:pointer'],
  ['.step>.step-body{padding:0 0 15px 42px}', '.step>.step-body{padding:0 0 12px 42px}'],
  ['margin:0 0 7px;padding:11px 12px', 'margin:0 0 6px;padding:9px 11px'],
  ['.two-col{display:grid;grid-template-columns:1fr 1fr;gap:9px}', '.two-col{display:grid;grid-template-columns:1fr 1fr;gap:7px}'],
  ['.argument-box{padding:12px;', '.argument-box{padding:10px;'],
  ['.variation-list{display:grid;gap:9px;margin-top:9px}', '.variation-list{display:grid;gap:7px;margin-top:7px}'],
  ['.variation-item{padding:11px 12px', '.variation-item{padding:9px 10px'],
  ['.detail-disclaimer{max-width:820px;margin:18px auto 0;padding:14px 15px', '.detail-disclaimer{max-width:820px;margin:13px auto 0;padding:11px 13px'],
  ['padding:0 0 36px', 'padding:0 0 28px'],
  ['.footer-inner{padding-top:18px', '.footer-inner{padding-top:14px'],
  ['.footer-meta{margin:13px auto 0;padding-top:13px', '.footer-meta{margin:9px auto 0;padding-top:9px'],
  ['@media(max-width:620px){.wrap{width:calc(100% - 20px)}.hero{padding:22px 0 30px}.back-nav{margin-bottom:20px}.lead{font-size:15px}.hero-meta{margin-top:16px', '@media(max-width:620px){.wrap{width:calc(100% - 20px)}.hero{padding:18px 0 24px}.back-nav{margin-bottom:14px}.lead{font-size:16px}.hero-meta{margin-top:12px'],
  ['.notice{padding:14px 15px}', '.notice{padding:12px 13px}'],
  ['.case-card{grid-template-columns:32px minmax(0,1fr);padding:14px}', '.case-card{grid-template-columns:32px minmax(0,1fr);padding:11px 12px}'],
  ['.case-dialog article{padding:25px 16px 30px}', '.case-dialog article{padding:20px 14px 24px}'],
  ['font-size:9.5px', 'font-size:13px'],
  ['font-size:10px', 'font-size:13px'],
  ['font-size:10.5px', 'font-size:13px'],
  ['font-size:11px', 'font-size:13px'],
  ['font-size:11.5px', 'font-size:13px'],
  ['font-size:12px', 'font-size:13px'],
  ['font-size:12.2px', 'font-size:13px'],
  ['font-size:12.5px', 'font-size:13px'],
  ['font-size:12.8px', 'font-size:13px']
]);

edit('toeic-human-100/project-standard.css', [
  ['--ink:#10233d;--muted:#64748b;', '--ink:#111111;--muted:#111111;'],
  ['.app-shell{width:min(100%,620px);padding:18px 14px 32px}', '.app-shell{width:min(100%,620px);padding:14px 10px 24px}'],
  ['.hero{border-radius:28px;padding:20px}', '.hero{border-radius:24px;padding:16px}'],
  ['.day-dashboard{gap:16px;margin-top:22px;padding-top:18px}', '.day-dashboard{gap:12px;margin-top:14px;padding-top:12px}'],
  ['.day-progress{margin-top:16px}', '.day-progress{margin-top:12px}'],
  ['gap:4px;margin:10px 0;padding:5px', 'gap:4px;margin:8px 0;padding:4px'],
  ['.category{min-width:0;border-radius:12px;padding:8px 2px 7px;', '.category{min-width:0;border-radius:12px;padding:7px 2px 6px;'],
  ['.learning-card{min-height:430px;padding:22px 20px 24px', '.learning-card{min-height:0;padding:17px 16px 18px'],
  ['.reading-header{margin:24px 0 0}', '.reading-header{margin:18px 0 0}'],
  ['.reading-instruction{margin:8px 0 0;', '.reading-instruction{margin:5px 0 0;'],
  ['.reading-meta{gap:6px;margin:11px 0 0}', '.reading-meta{gap:5px;margin:8px 0 0}'],
  ['.long-reading{margin-top:20px}', '.long-reading{margin-top:15px}'],
  ['margin:0 0 17px;color:#183250', 'margin:0 0 14px;color:#183250'],
  ['.reading-details,.study-details{margin-top:14px;', '.reading-details,.study-details{margin-top:10px;'],
  ['padding:12px 14px;color:var(--navy)', 'padding:10px 12px;color:var(--navy)'],
  ['padding:0 14px 14px;color:#5d6e82', 'padding:0 12px 11px;color:#111111'],
  ['.paragraph-functions{color:#5d6e82;', '.paragraph-functions{color:#111111;'],
  ['.analysis-section{margin-top:24px}', '.analysis-section{margin-top:18px}'],
  ['margin:0 0 8px;color:var(--blue)', 'margin:0 0 6px;color:var(--blue)'],
  ['.analysis-note{margin:0 0 12px;color:#67788d;', '.analysis-note{margin:0 0 8px;color:#111111;'],
  ['.lexicon-grid{display:grid;grid-template-columns:1fr;gap:8px}', '.lexicon-grid{display:grid;grid-template-columns:1fr;gap:6px}'],
  ['padding:13px 48px 13px 14px', 'padding:10px 44px 10px 12px'],
  ['color:#52677f;', 'color:#111111;'],
  ['color:#6d7e91!important;', 'color:#111111!important;'],
  ['.grammar-list,.structure-list{gap:8px}', '.grammar-list,.structure-list{gap:6px}'],
  ['padding:13px 14px;border:1px solid var(--line)', 'padding:10px 12px;border:1px solid var(--line)'],
  ['background:#f6f9fd;color:#5f7185;', 'background:#f6f9fd;color:#111111;'],
  ['.sentence-lab{margin:8px 0;', '.sentence-lab{margin:6px 0;'],
  ['.sentence-lab summary{padding:12px 14px', '.sentence-lab summary{padding:10px 12px'],
  ['.sentence-lab-body{padding:0 14px 14px}', '.sentence-lab-body{padding:0 12px 11px}'],
  ['.sentence-explain{color:#5f7086;', '.sentence-explain{color:#111111;'],
  ['.practice-group{margin-top:24px}', '.practice-group{margin-top:18px}'],
  ['.practice-item{margin:15px 0;padding:14px;', '.practice-item{margin:10px 0;padding:11px;'],
  ['margin:0 0 13px;color:#112a49', 'margin:0 0 9px;color:#112a49'],
  ['.quiz-options{gap:8px}', '.quiz-options{gap:6px}'],
  ['border-radius:13px;padding:12px 13px;background:#fff', 'border-radius:13px;padding:10px 11px;background:#fff'],
  ['margin-top:10px;border:1px solid #d7e5f6;border-radius:13px;padding:12px 13px', 'margin-top:8px;border:1px solid #d7e5f6;border-radius:13px;padding:10px 11px'],
  ['margin-top:8px;padding:10px 12px;border-left:3px solid #6b8fbd', 'margin-top:6px;padding:8px 10px;border-left:3px solid #6b8fbd'],
  ['.review-box{margin-top:20px;padding:14px;', '.review-box{margin-top:14px;padding:11px;'],
  ['.legacy-combined{gap:9px;margin-top:18px}', '.legacy-combined{gap:7px;margin-top:14px}'],
  ['.legacy-combined .legacy-card{padding:14px;', '.legacy-combined .legacy-card{padding:11px;'],
  ['.teps-extension{margin-top:24px;padding-top:20px', '.teps-extension{margin-top:18px;padding-top:14px'],
  ['.teps-purpose{color:#5f7086;', '.teps-purpose{color:#111111;'],
  ['.teps-passage{padding:14px;', '.teps-passage{padding:11px;'],
  ['margin-top:10px;padding:12px 13px;border-left:3px solid var(--blue)', 'margin-top:8px;padding:10px 11px;border-left:3px solid var(--blue)'],
  ['.learning-actions{grid-template-columns:.9fr 1.35fr;gap:9px;margin:12px 0}', '.learning-actions{grid-template-columns:.9fr 1.35fr;gap:8px;margin:10px 0}'],
  ['border-radius:17px;padding:15px 12px', 'border-radius:15px;padding:12px 11px'],
  ['gap:9px;padding:10px;border-radius:20px', 'gap:8px;padding:8px;border-radius:18px'],
  ['.stats{margin-top:12px;padding:14px 10px', '.stats{margin-top:10px;padding:10px 8px'],
  ['padding:20px 16px 22px', 'padding:16px 14px 18px'],
  ['color:#66768a;', 'color:#111111;'],
  ['color:#536b82', 'color:#111111'],
  ['font-size:.66rem', 'font-size:.8125rem'],
  ['font-size:.67rem', 'font-size:.8125rem'],
  ['font-size:.7rem', 'font-size:.8125rem'],
  ['font-size:.72rem', 'font-size:.8125rem'],
  ['font-size:.74rem', 'font-size:.8125rem'],
  ['font-size:.76rem', 'font-size:.8125rem'],
  ['font-size:11px', 'font-size:13px'],
  ['font-size:11.5px', 'font-size:13px'],
  ['font-size:12px', 'font-size:13px'],
  ['font-size:12.5px', 'font-size:13px'],
  ['@media(max-width:460px){.app-shell{padding-left:10px;padding-right:10px}.hero,.learning-card{border-radius:24px}', '@media(max-width:460px){.app-shell{padding-left:8px;padding-right:8px}.hero,.learning-card{border-radius:20px}'],
  ['.category{padding:7px 1px 6px;', '.category{padding:6px 1px 5px;'],
  ['.learning-card{min-height:450px;padding-left:17px;padding-right:17px}', '.learning-card{min-height:0;padding:15px 14px 16px}']
]);

edit('three-minute-break/style.css', [
  ['--nxs-muted:#4b5563;', '--nxs-muted:#111111;'],
  ['--nxs-subtle:#667085;', '--nxs-subtle:#111111;'],
  ['padding:18px 14px 32px', 'padding:12px 10px 22px'],
  ['min-height:36px;margin:0 0 12px;padding:0 12px', 'min-height:34px;margin:0 0 9px;padding:0 10px'],
  ['gap:16px;padding:14px 16px', 'gap:10px;padding:11px 13px'],
  ['.intro{margin:14px 0;padding:15px 16px}', '.intro{margin:10px 0;padding:12px 14px}'],
  ['.intro h2{margin:0 0 7px', '.intro h2{margin:0 0 5px'],
  ['gap:8px;margin-bottom:14px', 'gap:6px;margin-bottom:10px'],
  ['padding:10px 8px;background:#fff', 'padding:8px 6px;background:#fff'],
  ['.content-card{min-height:330px;padding:26px 24px;', '.content-card{min-height:0;padding:18px 18px;'],
  ['.content-card h2{margin:38px 0 16px', '.content-card h2{margin:18px 0 10px'],
  ['.card-meta{margin:auto 0 0;padding-top:24px', '.card-meta{margin:0;padding-top:14px'],
  ['.quiz-area{margin-top:20px}', '.quiz-area{margin-top:14px}'],
  ['.quiz-options{display:grid;gap:9px}', '.quiz-options{display:grid;gap:6px}'],
  ['border-radius:10px;padding:13px 14px;text-align:left', 'border-radius:10px;padding:10px 12px;text-align:left'],
  ['min-height:24px;margin:12px 2px 0', 'min-height:22px;margin:8px 2px 0'],
  ['gap:10px;margin-top:14px', 'gap:8px;margin-top:10px'],
  ['border-radius:10px;padding:15px 14px', 'border-radius:10px;padding:12px 12px'],
  ['margin:16px 2px 0;padding:14px 16px', 'margin:10px 2px 0;padding:10px 13px'],
  ['.footer-disclaimer{margin:16px 4px 0', '.footer-disclaimer{margin:10px 4px 0'],
  ['margin-top:12px;padding:20px 17px 22px', 'margin-top:9px;padding:16px 14px 18px'],
  ['margin:13px auto 0;padding-top:12px', 'margin:9px auto 0;padding-top:9px'],
  ['font-size:11px', 'font-size:13px'],
  ['font-size:11.5px', 'font-size:13px'],
  ['font-size:12px', 'font-size:13px'],
  ['font-size:12.5px', 'font-size:13px'],
  ['@media(max-width:460px){.app-shell{padding-left:10px;padding-right:10px}.content-card{padding:22px 19px}', '@media(max-width:460px){.app-shell{padding-left:8px;padding-right:8px}.content-card{padding:16px 15px}'],
  ['@media(max-width:390px){.category-grid{grid-template-columns:repeat(2,1fr)}.content-card{min-height:350px}', '@media(max-width:390px){.category-grid{grid-template-columns:repeat(2,1fr)}.content-card{min-height:0}']
]);

edit('legal-knowledge/legal-mind/index.html', [
  ['style.css?v=20260824-contrast-icons-2', 'style.css?v=20260824-density-1']
]);
edit('toeic-human-100/index.html', [
  ['project-standard.css?v=20260822-1512', 'project-standard.css?v=20260824-density-1']
]);
edit('three-minute-break/index.html', [
  ['style.css?v=20260823-structural-1', 'style.css?v=20260824-density-1']
]);
