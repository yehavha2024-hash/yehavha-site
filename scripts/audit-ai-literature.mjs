import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve('legal-knowledge/ai-literature');
const files = [
  'data.js',
  'data-corrections.js',
  'data-corrections-02.js',
  'data-expansion-helpers.js',
  'data-domestic-thesis.js',
  'data-domestic-civil.js',
  'data-domestic-company.js',
  'data-domestic-public.js',
  'data-domestic-crim.js',
  'data-domestic-data.js',
  'data-domestic-ip.js',
  'data-overseas-civil.js',
  'data-overseas-company.js',
  'data-overseas-public.js',
  'data-overseas-privacy.js',
  'data-overseas-crim.js',
  'data-overseas-ip.js',
  'data-evidence-roles.js'
];

global.window = {};
let errors = 0;
const fail = message => { console.error(`ERROR: ${message}`); errors += 1; };

for (const file of files) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) {
    fail(`필수 데이터 파일 없음: ${file}`);
    continue;
  }
  try {
    vm.runInThisContext(fs.readFileSync(full, 'utf8'), { filename: full });
  } catch (error) {
    fail(`${file} 실행 실패: ${error.message}`);
  }
}

const records = Array.isArray(window.AI_LITERATURE_RECORDS) ? window.AI_LITERATURE_RECORDS : [];
const routes = Array.isArray(window.AI_LITERATURE_ROUTES) ? window.AI_LITERATURE_ROUTES : [];
const domestic = records.filter(r => r.type === '국내 박사학위논문' || r.type === '국내 학술논문');
const overseas = records.filter(r => r.language === '영어');

if (records.length < 217) fail(`전체 문헌 ${records.length}개: 목표 217개 이상 미달`);
if (domestic.length < 100) fail(`국내 박사·KCI ${domestic.length}개: 목표 100개 이상 미달`);
if (overseas.length < 100) fail(`해외 핵심 ${overseas.length}개: 목표 100개 이상 미달`);
if (routes.length < 9) fail(`읽기 경로 ${routes.length}개: 기존 9개 경로 유지 실패`);

const ids = records.map(r => r.id);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicateIds.length) fail(`중복 ID: ${duplicateIds.join(', ')}`);

const required = ['id','type','priority','stage','title','author','year','publication','legalAreas','issues','evidenceRoles','summary','mustRead','argumentUse','researchFit','counterpoint','url'];
for (const record of records) {
  for (const key of required) {
    const value = record[key];
    if (value == null || value === '' || (Array.isArray(value) && !value.length)) {
      fail(`${record.id || '(id 없음)'} 필수 필드 누락: ${key}`);
    }
  }
}

const areas = ['민사·책임법','상법·회사법','헌법·공법','형사법','데이터·개인정보','지식재산'];
const roles = ['직접 인용 핵심문헌','반대학설','비교법','최신문헌'];
for (const area of areas) {
  const areaRecords = records.filter(r => (r.legalAreas || []).includes(area));
  if (!areaRecords.length) fail(`${area}: 문헌 없음`);
  for (const role of roles) {
    const count = areaRecords.filter(r => (r.evidenceRoles || []).includes(role)).length;
    if (!count) fail(`${area}: ${role} 문헌 없음`);
  }
}

for (const route of routes) {
  for (const id of route.recordIds || []) {
    if (!ids.includes(id)) fail(`읽기 경로 ${route.id}가 존재하지 않는 문헌 ID 참조: ${id}`);
  }
}

console.log(`AI literature audit`);
console.log(`- 전체 문헌: ${records.length}`);
console.log(`- 국내 박사·KCI: ${domestic.length}`);
console.log(`- 해외 핵심(영문): ${overseas.length}`);
console.log(`- 읽기 경로: ${routes.length}`);
for (const area of areas) {
  const areaRecords = records.filter(r => (r.legalAreas || []).includes(area));
  const roleCounts = Object.fromEntries(roles.map(role => [role, areaRecords.filter(r => (r.evidenceRoles || []).includes(role)).length]));
  console.log(`- ${area}: ${areaRecords.length} | ${JSON.stringify(roleCounts)}`);
}
console.log(`- 오류: ${errors}`);

if (errors) process.exit(1);
