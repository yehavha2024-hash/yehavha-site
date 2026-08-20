import fs from 'node:fs';

// One-time idempotent migration: promote Strategic Intelligence to Nexus priority 00.
const file = 'nexus/portal-v2.js';
let source = fs.readFileSync(file, 'utf8');
let next = source;

if (!next.includes("intelligence: '<svg")) {
  next = next.replace(
    "  const categoryIcons = {\n",
    "  const categoryIcons = {\n    intelligence: '<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 3 20 6v5c0 5-3.4 8.2-8 10-4.6-1.8-8-5-8-10V6l8-3Z\"/><path d=\"M8 12h8M12 8v8\"/></svg>',\n    university: '<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m3 9 9-5 9 5-9 5-9-5Z\"/><path d=\"M5 12v7M9 14v5M15 14v5M19 12v7M3 20h18\"/></svg>',\n"
  );
}

const tierStart = next.indexOf('  const portalTiers = [');
const tierEndMarker = '\n  const featuredDefinitions = [';
const tierEnd = next.indexOf(tierEndMarker, tierStart);
if (tierStart < 0 || tierEnd < 0) throw new Error('portalTiers block not found');

const tiers = `  const portalTiers = [
    {
      id: 'intelligence',
      number: '00',
      eyebrow: 'STRATEGIC INTELLIGENCE',
      title: '정보·전략',
      description: '국내외 핵심 정보를 선별·검증·분석해 판단에 필요한 변화와 위험·기회를 가장 먼저 제시합니다.',
      categoryIds: ['intelligence'],
      variant: 'primary'
    },
    {
      id: 'university',
      number: '01',
      eyebrow: 'NEXUS UNIVERSITY',
      title: 'NEXUS UNIVERSITY',
      description: '대학 수준의 체계적 학습과 연구 기반을 연결합니다.',
      categoryIds: ['university'],
      variant: 'primary'
    },
    {
      id: 'core',
      number: '02',
      eyebrow: 'CORE WORKSPACES',
      title: '핵심 작업영역',
      description: '직접 사용하는 웹서비스와 장기 연구 기반을 배치합니다.',
      categoryIds: ['apps', 'research'],
      variant: 'primary'
    },
    {
      id: 'create',
      number: '03',
      eyebrow: 'CREATE · LEARN · SHARE',
      title: '제작·교육·공개',
      description: '교육·출판·미디어 결과물을 한 층위로 묶습니다.',
      categoryIds: ['education', 'publishing', 'media'],
      variant: 'compact'
    },
    {
      id: 'ideas',
      number: '04',
      eyebrow: 'PUBLIC IDEAS',
      title: '아이디어 허브',
      description: '공개 가능한 아이디어와 프로젝트 후보를 한곳에서 확인합니다.',
      categoryIds: ['initiatives'],
      variant: 'compact'
    }
  ];
`;
next = next.slice(0, tierStart) + tiers + next.slice(tierEnd);

if (!next.includes("{ id: 'strategic-intelligence-briefing', kicker: 'INTELLIGENCE'")) {
  next = next.replace(
    "  const featuredDefinitions = [\n",
    "  const featuredDefinitions = [\n    { id: 'strategic-intelligence-briefing', kicker: 'INTELLIGENCE', note: '오늘의 핵심 전략정보 브리핑' },\n"
  );
}

if (!next.includes("project.category === 'intelligence'")) {
  next = next.replace(
    "  function maturityFor(project) {\n",
    "  function maturityFor(project) {\n    if (project.category === 'intelligence') return { label: '최우선 정보', tone: 'research' };\n"
  );
}

next = next.replace(
  "description: '웹앱·연구·출판·미디어·AI 실무·교육·아이디어 프로젝트를 연결하는 통합 포털',",
  "description: '전략정보·대학·웹앱·연구·출판·미디어·교육·아이디어 프로젝트를 연결하는 통합 포털',"
);
next = next.replace("id: 'more', number: '04', eyebrow: 'MORE'", "id: 'more', number: '05', eyebrow: 'MORE'");

if (next !== source) {
  fs.writeFileSync(file, next, 'utf8');
  console.log('Nexus intelligence priority migration applied.');
} else {
  console.log('Nexus intelligence priority migration already applied.');
}
