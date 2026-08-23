import fs from 'node:fs';

const projectsPath = 'nexus/projects.json';
let projects = fs.readFileSync(projectsPath, 'utf8');
projects = projects.replace('"updatedAt": "2026-08-22"', '"updatedAt": "2026-08-24"');
if (!projects.includes('"id":"commentary"')) {
  projects = projects.replace(
    '  "categories": [\n    {"id":"intelligence"',
    '  "categories": [\n    {"id":"commentary","eyebrow":"NEXUS COMMENTARY","title":"넥서스 논평","icon":"","iconClass":"commentary-icon","description":"국내외 주요 현안을 대상으로 사실관계를 바탕으로 판단·비판·제언을 제시하는 논평 영역"},\n    {"id":"intelligence"'
  );
}
if (!projects.includes('"id":"nexus-commentary"')) {
  projects = projects.replace(
    '  "projects": [\n    {"id":"strategic-intelligence-briefing"',
    '  "projects": [\n    {"id":"nexus-commentary","category":"commentary","meta":"Editorial Commentary","title":"넥서스 논평","description":"국내외 주요 현안을 대상으로 확인된 사실과 공개자료를 바탕으로 판단·비판·제언을 제시합니다. 언론사 사설에 가장 가까운 형식으로 운영하되 특정 언론사의 공식 사설이 아닌 독립 논평을 싣습니다.","url":"https://yehavha-nexus-hub.pages.dev/commentary/","actionLabel":"논평 읽기","external":false},\n    {"id":"strategic-intelligence-briefing"'
  );
}
fs.writeFileSync(projectsPath, projects);

const jsPath = 'nexus/portal-v2.js';
let js = fs.readFileSync(jsPath, 'utf8');
if (!js.includes('commentary: \'<svg')) {
  js = js.replace(
    '  const categoryIcons = {\n    intelligence:',
    '  const categoryIcons = {\n    commentary: \'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19h4L19 9a2.1 2.1 0 0 0-3-3L6 16l-1 3Z"/><path d="m14.5 7.5 2 2"/><path d="M12.5 19H19"/></svg>\',\n    intelligence:'
  );
}
if (!js.includes("id: 'commentary'")) {
  js = js.replace(
    '  const portalTiers = [\n    { id: \'intelligence\'',
    '  const portalTiers = [\n    { id: \'commentary\', number: \'00\', eyebrow: \'NEXUS COMMENTARY\', title: \'넥서스 논평\', description: \'국내외 주요 현안에 대한 판단·비판·제언을 제시합니다.\', categoryIds: [\'commentary\'], variant: \'primary\' },\n    { id: \'intelligence\''
  );
  js = js
    .replace("{ id: 'intelligence', number: '00'", "{ id: 'intelligence', number: '01'")
    .replace("{ id: 'university', number: '01'", "{ id: 'university', number: '02'")
    .replace("{ id: 'core', number: '02'", "{ id: 'core', number: '03'")
    .replace("{ id: 'publicsector', number: '03'", "{ id: 'publicsector', number: '04'")
    .replace("{ id: 'create', number: '04'", "{ id: 'create', number: '05'")
    .replace("{ id: 'ideas', number: '05'", "{ id: 'ideas', number: '06'")
    .replace("const extraTier = {id:'more',number:'06'", "const extraTier = {id:'more',number:'07'");
}
if (!js.includes("project.category === 'commentary'")) {
  js = js.replace(
    "  function maturityFor(project) {\n    if (project.category === 'intelligence')",
    "  function maturityFor(project) {\n    if (project.category === 'commentary') return { label: '논평', tone: 'research' };\n    if (project.category === 'intelligence')"
  );
}
js = js.replace(
  "description: '전략정보·대학·웹앱·연구·정부 AX 전략·대응·출판·미디어·교육·아이디어 프로젝트를 연결하는 통합 포털'",
  "description: '논평·전략정보·대학·웹앱·연구·정부 AX 전략·대응·출판·미디어·교육·아이디어 프로젝트를 연결하는 통합 포털'"
);
fs.writeFileSync(jsPath, js);

const indexPath = 'nexus/index.html';
let html = fs.readFileSync(indexPath, 'utf8');
html = html.replace(/portal-v2\.js\?v=[^\"']+/, 'portal-v2.js?v=20260824-commentary-1');
fs.writeFileSync(indexPath, html);

console.log('NEXUS Commentary registered as the first portal category.');
