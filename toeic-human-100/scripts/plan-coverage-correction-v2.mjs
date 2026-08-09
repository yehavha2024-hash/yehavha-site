import fs from 'node:fs';
import path from 'node:path';

const DIR = path.join(process.cwd(), 'toeic-human-100');
const COVERAGE_FILE = path.join(DIR, 'READING_V2_COVERAGE.json');
const POLICY_FILE = path.join(DIR, 'coverage-policy-v2.json');
const OUTPUT_JSON = path.join(DIR, 'NEXT_10_DAY_TARGETS.json');
const OUTPUT_MD = path.join(DIR, 'NEXT_10_DAY_TARGETS.md');

if (!fs.existsSync(COVERAGE_FILE)) throw new Error('READING_V2_COVERAGE.json missing; run audit-reading-coverage-v2.mjs first');
if (!fs.existsSync(POLICY_FILE)) throw new Error('coverage-policy-v2.json missing');

const coverage = JSON.parse(fs.readFileSync(COVERAGE_FILE, 'utf8'));
const policy = JSON.parse(fs.readFileSync(POLICY_FILE, 'utf8'));
const dayCount = Number(coverage.dayCount || 0);
const totalDays = Number(policy.totalDays || 100);
const blockSize = Number(policy.blockSize || 10);
const entries = Array.isArray(coverage.entries) ? coverage.entries : [];
const missing = entries.filter(item => Number(item.exposureCount || 0) === 0);
const planning = policy.nextBlockPlanning || {};
const roleShares = planning.newRoleShares || {};
const finalMin = policy.finalMinimumExposureByRole || {};

function roles(item) {
  return Array.isArray(item.roles) ? item.roles : [];
}
function hasRole(item, role) {
  return roles(item).includes(role);
}
function requiredExposure(item) {
  return Math.max(1, ...roles(item).map(role => Number(finalMin[role] || 1)));
}
function priorityScore(item) {
  let score = 0;
  if (hasRole(item, 'toeic-specific') && hasRole(item, 'academic-book-extension')) score += 500;
  if (hasRole(item, 'toeic-specific')) score += 300;
  if (hasRole(item, 'academic-book-extension')) score += 200;
  if (hasRole(item, 'general-core')) score += 100;
  const exposure = Number(item.exposureCount || 0);
  score += Math.max(0, requiredExposure(item) - exposure) * 15;
  return score;
}
function sortPriority(items) {
  return [...items].sort((a,b) => priorityScore(b) - priorityScore(a) || String(a.lemma).localeCompare(String(b.lemma)));
}

const currentMilestone = (policy.milestones || []).find(m => Number(m.day) === dayCount) || null;
const currentMilestonePassed = currentMilestone ? missing.length <= Number(currentMilestone.maxMissingHeadwords) : true;

let nextMilestoneDay;
if (dayCount >= totalDays) nextMilestoneDay = totalDays;
else nextMilestoneDay = Math.min(totalDays, Math.ceil((dayCount + 1) / blockSize) * blockSize);
const daysRemaining = Math.max(0, nextMilestoneDay - dayCount);
const nextMilestone = (policy.milestones || []).find(m => Number(m.day) === nextMilestoneDay) || {day: nextMilestoneDay, maxMissingHeadwords: 0};
const maxMissingAtNextMilestone = Number(nextMilestone.maxMissingHeadwords || 0);
const requiredNewToMilestone = Math.max(0, missing.length - maxMissingAtNextMilestone);
const bufferRatio = Number(planning.coverageBufferRatio || 1);
const bufferedRequired = Math.ceil(requiredNewToMilestone * bufferRatio);
const minPerDay = Number(planning.minNewHeadwordsPerDay || 0);
const maxPerDay = Number(planning.maxNewHeadwordsPerDay || 9999);
const minCapacity = minPerDay * daysRemaining;
const maxCapacity = maxPerDay * daysRemaining;
const capacityWarning = requiredNewToMilestone > maxCapacity;
let targetNew = daysRemaining ? Math.max(requiredNewToMilestone, minCapacity, bufferedRequired) : 0;
if (daysRemaining) targetNew = Math.min(missing.length, Math.min(targetNew, maxCapacity));

const selected = new Map();
function addItem(item) {
  if (item && !selected.has(item.id)) selected.set(item.id, item);
}

const roleOrder = ['toeic-specific','academic-book-extension','general-core'];
const roleQuotas = {};
for (const role of roleOrder) roleQuotas[role] = Math.floor(targetNew * Number(roleShares[role] || 0));

for (const role of roleOrder) {
  const candidates = sortPriority(missing.filter(item => hasRole(item, role)));
  const quota = roleQuotas[role];
  const countSelectedForRole = () => [...selected.values()].filter(item => hasRole(item, role)).length;
  for (const item of candidates) {
    if (countSelectedForRole() >= quota) break;
    addItem(item);
  }
}
for (const item of sortPriority(missing)) {
  if (selected.size >= targetNew) break;
  addItem(item);
}

const repeatTargetCount = Math.min(
  entries.filter(item => Number(item.exposureCount || 0) > 0).length,
  Number(planning.repeatTargetsPerDay || 0) * daysRemaining
);
const repeatCandidates = sortPriority(entries.filter(item => {
  const exposure = Number(item.exposureCount || 0);
  return exposure > 0 && exposure < requiredExposure(item);
})).sort((a,b) => {
  const deficitA = requiredExposure(a) - Number(a.exposureCount || 0);
  const deficitB = requiredExposure(b) - Number(b.exposureCount || 0);
  return deficitB - deficitA || priorityScore(b) - priorityScore(a) || String(a.lemma).localeCompare(String(b.lemma));
}).slice(0, repeatTargetCount);

const dayPlans = [];
for (let d = dayCount + 1; d <= nextMilestoneDay; d += 1) {
  dayPlans.push({day:d,newTargets:[],repeatTargets:[],roleCounts:{'toeic-specific':0,'academic-book-extension':0,'general-core':0}});
}
function assignBalanced(items, field) {
  for (const item of items) {
    dayPlans.sort((a,b) => a[field].length - b[field].length || a.day - b.day);
    const targetDay = dayPlans[0];
    targetDay[field].push({lemma:item.lemma,roles:item.roles,sourceLists:item.sourceLists,priorExposure:Number(item.exposureCount || 0)});
    if (field === 'newTargets') for (const role of roles(item)) if (role in targetDay.roleCounts) targetDay.roleCounts[role] += 1;
  }
  dayPlans.sort((a,b) => a.day - b.day);
}
assignBalanced(sortPriority([...selected.values()]), 'newTargets');
assignBalanced(repeatCandidates, 'repeatTargets');

const selectedRoleCounts = {};
for (const role of roleOrder) selectedRoleCounts[role] = [...selected.values()].filter(item => hasRole(item, role)).length;

const finalExposureDeficits = {};
for (const role of roleOrder) {
  const roleItems = entries.filter(item => hasRole(item, role));
  finalExposureDeficits[role] = {
    requiredMinimum: Number(finalMin[role] || 1),
    belowMinimum: roleItems.filter(item => Number(item.exposureCount || 0) < Number(finalMin[role] || 1)).length,
    total: roleItems.length
  };
}

const finalGateErrors = [];
if (dayCount === totalDays) {
  if (missing.length) finalGateErrors.push(`Final coverage incomplete: ${missing.length} headwords missing`);
  for (const [role, stat] of Object.entries(finalExposureDeficits)) {
    if (stat.belowMinimum) finalGateErrors.push(`${role}: ${stat.belowMinimum} items below minimum exposure ${stat.requiredMinimum}`);
  }
}
if (currentMilestone && !currentMilestonePassed) finalGateErrors.push(`DAY ${dayCount} milestone failed: missing ${missing.length} > allowed ${currentMilestone.maxMissingHeadwords}`);
if (capacityWarning) finalGateErrors.push(`Next block capacity insufficient: need ${requiredNewToMilestone} new headwords but configured maximum is ${maxCapacity}`);

const report = {
  generatedAt:new Date().toISOString(),
  current:{
    dayCount,
    masterHeadwords:Number(coverage.masterHeadwords || entries.length),
    seenHeadwords:Number(coverage.seenHeadwords || 0),
    missingHeadwords:missing.length,
    coveragePercent:Number(coverage.headwordCoveragePercent || 0),
    milestone:currentMilestone,
    milestonePassed:currentMilestonePassed
  },
  nextBlock:{
    startDay:dayCount < totalDays ? dayCount + 1 : null,
    endDay:dayCount < totalDays ? nextMilestoneDay : null,
    daysRemaining,
    nextMilestone,
    requiredNewToMilestone,
    bufferedRequired,
    targetNewHeadwords:targetNew,
    minCapacity,
    maxCapacity,
    roleQuotas,
    selectedRoleCounts,
    repeatTargetCount:repeatCandidates.length,
    semanticPlacementRequired:Boolean(policy.contentRules?.semanticPlacementRequired),
    note:'DAY 배정은 균등 목표버킷이다. 실제 집필 시 장르·문맥에 맞게 같은 10일 블록 안에서 이동할 수 있으나 블록 전체 목표수는 유지한다.'
  },
  finalExposureDeficits,
  days:dayPlans,
  errors:finalGateErrors
};

fs.writeFileSync(OUTPUT_JSON, JSON.stringify(report,null,2) + '\n');
const dayLines = dayPlans.map(d => {
  const newWords = d.newTargets.map(x => x.lemma).join(', ');
  const repeatWords = d.repeatTargets.map(x => x.lemma).join(', ');
  return `### DAY ${String(d.day).padStart(3,'0')}\n\n- 신규 목표 ${d.newTargets.length}: ${newWords}\n- 반복 목표 ${d.repeatTargets.length}: ${repeatWords}\n`;
}).join('\n');
const md = `# 다음 10일 커버리지 보정 목표\n\n` +
  `- 현재: DAY ${dayCount}, ${coverage.seenHeadwords}/${coverage.masterHeadwords} headword 노출 (${coverage.headwordCoveragePercent}%)\n` +
  `- 현재 미등장: ${missing.length}\n` +
  `- 다음 검사: DAY ${nextMilestoneDay}, 허용 미등장 최대 ${maxMissingAtNextMilestone}\n` +
  `- 다음 블록 최소 필요 신규: ${requiredNewToMilestone}\n` +
  `- 버퍼 적용 신규 목표: ${targetNew}\n` +
  `- 반복 보강 목표: ${repeatCandidates.length}\n` +
  `- 역할별 신규 목표(실제 선택): TOEIC ${selectedRoleCounts['toeic-specific']}, 학술·원서 ${selectedRoleCounts['academic-book-extension']}, 일반핵심 ${selectedRoleCounts['general-core']}\n` +
  `- 원칙: 단어를 문장에 억지로 끼워 넣지 않고 해당 DAY 장르와 의미상 자연스러운 문맥에 배치한다. DAY 간 이동은 가능하지만 10일 총량은 유지한다.\n\n` +
  `## DAY별 목표 버킷\n\n${dayLines}` +
  `\n## 최종 노출 기준\n\n- TOEIC-specific: 최소 ${finalMin['toeic-specific']}회\n- general-core: 최소 ${finalMin['general-core']}회\n- academic-book-extension: 최소 ${finalMin['academic-book-extension']}회\n`;
fs.writeFileSync(OUTPUT_MD, md);
console.log(md.split('\n').slice(0,18).join('\n'));

if (finalGateErrors.length) {
  console.error(finalGateErrors.join('\n'));
  process.exit(1);
}
