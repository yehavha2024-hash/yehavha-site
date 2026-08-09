import fs from 'node:fs';
import path from 'node:path';

const DIR = path.join(process.cwd(), 'toeic-human-100');
const coverage = JSON.parse(fs.readFileSync(path.join(DIR, 'READING_V2_COVERAGE.json'), 'utf8'));
const policy = JSON.parse(fs.readFileSync(path.join(DIR, 'coverage-policy-v2.json'), 'utf8'));
const OUT_JSON = path.join(DIR, 'NEXT_10_DAY_TARGETS.json');
const OUT_MD = path.join(DIR, 'NEXT_10_DAY_TARGETS.md');

const entries = Array.isArray(coverage.entries) ? coverage.entries : [];
const missing = entries.filter(x => Number(x.exposureCount || 0) === 0);
const planning = policy.nextBlockPlanning || {};
const finalMin = policy.finalMinimumExposureByRole || {};
const roleShares = planning.newRoleShares || {};
const roleOrder = ['toeic-specific', 'academic-book-extension', 'general-core'];
const dayCount = Number(coverage.dayCount || 0);
const totalDays = Number(policy.totalDays || 100);
const blockSize = Number(policy.blockSize || 10);

const roles = item => Array.isArray(item.roles) ? item.roles : [];
const hasRole = (item, role) => roles(item).includes(role);
const requiredExposure = item => Math.max(1, ...roles(item).map(r => Number(finalMin[r] || 1)));
function priorityScore(item) {
  let score = 0;
  if (hasRole(item, 'toeic-specific') && hasRole(item, 'academic-book-extension')) score += 500;
  if (hasRole(item, 'toeic-specific')) score += 300;
  if (hasRole(item, 'academic-book-extension')) score += 200;
  if (hasRole(item, 'general-core')) score += 100;
  score += Math.max(0, requiredExposure(item) - Number(item.exposureCount || 0)) * 15;
  return score;
}
const sortPriority = items => [...items].sort((a,b) => priorityScore(b) - priorityScore(a) || String(a.lemma).localeCompare(String(b.lemma)));

const currentMilestone = (policy.milestones || []).find(m => Number(m.day) === dayCount) || null;
const currentMilestonePassed = currentMilestone ? missing.length <= Number(currentMilestone.maxMissingHeadwords) : true;
const nextMilestoneDay = dayCount >= totalDays ? totalDays : Math.min(totalDays, Math.ceil((dayCount + 1) / blockSize) * blockSize);
const daysRemaining = Math.max(0, nextMilestoneDay - dayCount);
const nextMilestone = (policy.milestones || []).find(m => Number(m.day) === nextMilestoneDay) || {day:nextMilestoneDay,maxMissingHeadwords:0};
const maxMissingAtNext = Number(nextMilestone.maxMissingHeadwords || 0);
const requiredNew = Math.max(0, missing.length - maxMissingAtNext);
const bufferedRequired = Math.ceil(requiredNew * Number(planning.coverageBufferRatio || 1));
const minCapacity = Number(planning.minNewHeadwordsPerDay || 0) * daysRemaining;
const maxCapacity = Number(planning.maxNewHeadwordsPerDay || 9999) * daysRemaining;
let targetNew = daysRemaining ? Math.max(requiredNew, bufferedRequired, minCapacity) : 0;
if (daysRemaining) targetNew = Math.min(missing.length, Math.min(targetNew, maxCapacity));
const capacityWarning = requiredNew > maxCapacity;

const requiredRoleNewCounts = {};
for (const role of roleOrder) requiredRoleNewCounts[role] = Math.floor(targetNew * Number(roleShares[role] || 0));

const candidatePoolTarget = Math.min(missing.length, Math.max(targetNew, Math.ceil(targetNew * Number(planning.candidatePoolMultiplier || 1))));
const selected = new Map();
const add = item => { if (item && !selected.has(item.id)) selected.set(item.id, item); };
for (const role of roleOrder) {
  const desired = Math.max(requiredRoleNewCounts[role], Math.floor(candidatePoolTarget * Number(roleShares[role] || 0)));
  for (const item of sortPriority(missing.filter(x => hasRole(x, role)))) {
    if ([...selected.values()].filter(x => hasRole(x, role)).length >= desired) break;
    add(item);
  }
}
for (const item of sortPriority(missing)) {
  if (selected.size >= candidatePoolTarget) break;
  add(item);
}
const candidatePool = sortPriority([...selected.values()]).map(x => ({lemma:x.lemma,roles:x.roles,sourceLists:x.sourceLists}));
const candidateRoleCounts = {};
for (const role of roleOrder) candidateRoleCounts[role] = [...selected.values()].filter(x => hasRole(x, role)).length;

const repeatActualTarget = Math.min(entries.filter(x => Number(x.exposureCount || 0) > 0).length, Number(planning.repeatTargetsPerDay || 0) * daysRemaining);
const repeatCandidatePoolTarget = Math.min(entries.length, Math.max(repeatActualTarget, repeatActualTarget * 2));
const repeatCandidatePool = sortPriority(entries.filter(x => {
  const exposure = Number(x.exposureCount || 0);
  return exposure > 0 && exposure < requiredExposure(x);
})).sort((a,b) => {
  const da = requiredExposure(a) - Number(a.exposureCount || 0);
  const db = requiredExposure(b) - Number(b.exposureCount || 0);
  return db - da || priorityScore(b) - priorityScore(a) || String(a.lemma).localeCompare(String(b.lemma));
}).slice(0, repeatCandidatePoolTarget).map(x => ({lemma:x.lemma,roles:x.roles,sourceLists:x.sourceLists,priorExposure:Number(x.exposureCount || 0),requiredExposure:requiredExposure(x)}));

function quotas(total, days) {
  if (!days) return [];
  const base = Math.floor(total / days);
  const remainder = total % days;
  return Array.from({length:days}, (_,i) => base + (i < remainder ? 1 : 0));
}
const newQuotas = quotas(targetNew, daysRemaining);
const repeatQuotas = quotas(repeatActualTarget, daysRemaining);
const dayQuotas = Array.from({length:daysRemaining}, (_,i) => ({
  day:dayCount + 1 + i,
  newHeadwordQuota:newQuotas[i],
  repeatHeadwordQuota:repeatQuotas[i],
  instruction:'해당 날짜의 장르·주제와 의미상 자연스러운 항목을 후보군에서 선택한다. 부자연스러우면 후보군 밖의 다른 미등장 headword로 교체 가능하다.'
}));

const finalExposureDeficits = {};
for (const role of roleOrder) {
  const roleItems = entries.filter(x => hasRole(x, role));
  const minimum = Number(finalMin[role] || 1);
  finalExposureDeficits[role] = {requiredMinimum:minimum,total:roleItems.length,belowMinimum:roleItems.filter(x => Number(x.exposureCount || 0) < minimum).length};
}

const errors = [];
if (currentMilestone && !currentMilestonePassed) errors.push(`DAY ${dayCount} milestone failed: ${missing.length} missing > ${currentMilestone.maxMissingHeadwords}`);
if (capacityWarning) errors.push(`Next block capacity insufficient: ${requiredNew} required > ${maxCapacity} configured maximum`);
if (dayCount === totalDays) {
  if (missing.length) errors.push(`Final coverage incomplete: ${missing.length} headwords missing`);
  for (const [role,stat] of Object.entries(finalExposureDeficits)) if (stat.belowMinimum) errors.push(`${role}: ${stat.belowMinimum} below exposure minimum ${stat.requiredMinimum}`);
}

const report = {
  generatedAt:new Date().toISOString(),
  current:{dayCount,masterHeadwords:Number(coverage.masterHeadwords || entries.length),seenHeadwords:Number(coverage.seenHeadwords || 0),missingHeadwords:missing.length,coveragePercent:Number(coverage.headwordCoveragePercent || 0),milestone:currentMilestone,milestonePassed:currentMilestonePassed},
  nextBlock:{
    startDay:dayCount < totalDays ? dayCount + 1 : null,
    endDay:dayCount < totalDays ? nextMilestoneDay : null,
    nextMilestone,
    requiredNewToMilestone:requiredNew,
    bufferedRequired,
    targetNewHeadwords:targetNew,
    minCapacity,maxCapacity,
    requiredRoleNewCounts,
    candidatePoolSize:candidatePool.length,
    candidateRoleCounts,
    repeatActualTarget,
    repeatCandidatePoolSize:repeatCandidatePool.length,
    semanticPlacementRequired:true,
    bindingRule:'DAY별 숫자와 10일 전체 신규·반복·역할별 최소량은 구속적이다. 특정 단어의 날짜배정은 구속적이지 않으며 자연스러운 문맥을 우선한다.'
  },
  dayQuotas,
  candidatePool,
  repeatCandidatePool,
  finalExposureDeficits,
  errors
};
fs.writeFileSync(OUT_JSON, JSON.stringify(report,null,2) + '\n');

const byRoleSample = roleOrder.map(role => {
  const words = candidatePool.filter(x => x.roles.includes(role)).slice(0,80).map(x => x.lemma).join(', ');
  return `### ${role}\n\n${words}\n`;
}).join('\n');
const dayLines = dayQuotas.map(x => `- DAY ${String(x.day).padStart(3,'0')}: 신규 ${x.newHeadwordQuota}, 반복 ${x.repeatHeadwordQuota}`).join('\n');
const md = `# 다음 10일 커버리지 보정 목표\n\n` +
  `- 현재 DAY: ${dayCount}\n- 마스터: ${coverage.masterHeadwords}\n- 등장: ${coverage.seenHeadwords} (${coverage.headwordCoveragePercent}%)\n- 미등장: ${missing.length}\n` +
  `- 다음 마일스톤 DAY ${nextMilestoneDay}: 미등장 ${maxMissingAtNext} 이하\n- 최소 신규 필요: ${requiredNew}\n- 안전버퍼 적용 신규 목표: ${targetNew}\n- 반복 실제 목표: ${repeatActualTarget}\n` +
  `- 신규 후보군: ${candidatePool.length}개\n- 역할별 최소 신규량: TOEIC ${requiredRoleNewCounts['toeic-specific']}, 학술·원서 ${requiredRoleNewCounts['academic-book-extension']}, 일반핵심 ${requiredRoleNewCounts['general-core']}\n\n` +
  `## DAY별 구속적 수량\n\n${dayLines}\n\n` +
  `## 의미배치 원칙\n\n후보군의 특정 단어를 특정 날짜에 강제하지 않는다. 각 DAY의 장르·주제에 자연스럽게 맞는 미등장어를 선택하고, 맞지 않는 후보는 같은 블록 또는 후속 블록의 적절한 장르로 넘긴다. 단, 10일 전체 신규 목표량과 역할별 최소 신규량은 낮출 수 없다.\n\n` +
  `## 우선 후보 예시\n\n${byRoleSample}\n` +
  `## DAY 100 최종 반복기준\n\n- TOEIC-specific 최소 ${finalMin['toeic-specific']}회\n- general-core 최소 ${finalMin['general-core']}회\n- academic-book-extension 최소 ${finalMin['academic-book-extension']}회\n`;
fs.writeFileSync(OUT_MD, md);
console.log(md.split('\n').slice(0,24).join('\n'));
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
