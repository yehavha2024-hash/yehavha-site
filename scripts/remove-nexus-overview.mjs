import fs from 'node:fs';

const jsPath = 'nexus/portal-v2.js';
let js = fs.readFileSync(jsPath, 'utf8');
const beforeJs = js;
js = js.replace(/\n  function renderHeroOverview\(categories, projects, updatedAt\) \{[\s\S]*?\n  \}\n\n  function projectSearchText/, '\n\n  function projectSearchText');
js = js.replace(/\n    renderHeroOverview\(visibleCategories, projects, data\.updatedAt\);/, '');
if (js === beforeJs) throw new Error('portal-v2.js overview block was not found');
fs.writeFileSync(jsPath, js);

const cssPath = 'nexus/nexus-standard.css';
let css = fs.readFileSync(cssPath, 'utf8');
const beforeCss = css;
css = css.split('\n').filter(line => !line.startsWith('.portal-overview') && !line.startsWith('.overview-item')).join('\n');
if (css === beforeCss) throw new Error('nexus-standard.css overview rules were not found');
fs.writeFileSync(cssPath, css);

const htmlPath = 'nexus/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace(/nexus-standard\.css\?v=[^\"']+/, 'nexus-standard.css?v=20260824-remove-overview-1');
html = html.replace(/portal-v2\.js\?v=[^\"']+/, 'portal-v2.js?v=20260824-remove-overview-1');
fs.writeFileSync(htmlPath, html);

console.log('Removed Nexus hero overview statistics and refreshed cache versions.');
