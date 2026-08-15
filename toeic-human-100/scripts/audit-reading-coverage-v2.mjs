import fs from 'node:fs';
import path from 'node:path';
import { loadToeicRuntime } from './runtime-v2-loader.mjs';

const DIR = path.join(process.cwd(), 'toeic-human-100');
const POLICY_FILE = path.join(DIR, 'coverage-policy-v2.json');
const OUTPUT_JSON = path.join(DIR, 'READING_V2_COVERAGE.json');
const OUTPUT_MD = path.join(DIR, 'READING_V2_COVERAGE.md');

const { master, program, teps, runtimeFiles } = loadToeicRuntime(DIR);
const policy = JSON.parse(fs.readFileSync(POLICY_FILE, 'utf8'));

const norm = value => String(value || '').trim().toLowerCase();
const masterEntries = Array.isArray(master.entries) ? master.entries : [];
const masterMap = new Map(masterEntries.map(item => [norm(item.lemma), item]));
const activeCounts = new Map();
const activeDays = new Map();
let phraseMinimumViolations = 0;
let readingRangeViolations = 0;
let readingDays = 0;

const readingMin = Number(policy.readingDesign?.toeicReadingWordsMin || 500);
const readingMax = Number(policy.readingDesign?.toeicReadingWordsMax || 650);
const countWords = text => String(text || '').trim().split(/\s+/).filter(Boolean).length;

for (const day of (program.days || [])) {
  const paragraphs = day.reading?.paragraphs || [];
  if (Array.isArray(paragraphs) && paragraphs.length) readingDays += 1;
  const words = countWords(paragraphs.join(' '));
  if (words < readingMin || words > readingMax) readingRangeViolations += 1;
  if ((day.expressions?.length || 0) < Number(policy.phraseAndGrammarCoverage?.phrasesPerDayMin || 6)) phraseMinimumViolations += 1;

  for (const item of (day.vocabulary || [])) {
    const lemma = norm(item.lemma || item.word || item.title);
    if (!lemma || !masterMap.has(lemma)) continue;
    activeCounts.set(lemma, (activeCounts.get(lemma) || 0) + 1);
    if (!activeDays.has(lemma)) activeDays.set(lemma, []);
    if (!activeDays.get(lemma).includes(day.day)) activeDays.get(lemma).push(day.day);
  }
}

const entries = masterEntries.map(item => {
  const lemma = norm(item.lemma);
  return {
    id: item.id,
    lemma: item.lemma,
    roles: item.roles || [],
    sourceLists: item.sourceLists || [],
    activeStudyCount: activeCounts.get(lemma) || 0,
    activeStudyDays: activeDays.get(lemma) || [],
    selectedForActiveStudy: activeCounts.has(lemma)
  };
});

const activeEntries = entries.filter(x => x.selectedForActiveStudy);
const inactiveEntries = entries.filter(x => !x.selectedForActiveStudy);
const activeTarget = Number(policy.vocabularyDesign?.activeUniqueTarget || 2520);
const byRole = {};
for (const role of ['toeic-specific', 'general-core', 'academic-book-extension']) {
  const items = entries.filter(x => x.roles.includes(role));
  const selected = items.filter(x => x.selectedForActiveStudy);
  byRole[role] = {
    total: items.length,
    active: selected.length,
    inactive: items.length - selected.length,
    activePercent: items.length ? Number((selected.length / items.length * 100).toFixed(2)) : 0
  };
}

const toeicRole = byRole['toeic-specific'] || { total: 0, active: 0 };
const tepsDayCount = teps.days?.length || 0;
const pass = (program.days?.length || 0) === 100
  && tepsDayCount === 100
  && activeEntries.length >= activeTarget
  && toeicRole.active === toeicRole.total
  && phraseMinimumViolations === 0
  && readingRangeViolations === 0;

const report = {
  generatedAt: new Date().toISOString(),
  design: 'focused-reading-v4',
  runtimeFiles,
  dayCount: program.days?.length || 0,
  readingDays,
  tepsDayCount,
  readingRange: `${readingMin}-${readingMax}`,
  readingRangeViolations,
  masterHeadwords: masterEntries.length,
  masterPoolPurpose: 'selection-source',
  activeUniqueTarget: activeTarget,
  activeUniqueHeadwords: activeEntries.length,
  inactiveExtensionPool: inactiveEntries.length,
  activeCoverageAgainstTargetPercent: activeTarget ? Number((Math.min(activeEntries.length, activeTarget) / activeTarget * 100).toFixed(2)) : 0,
  fullMasterForcedIntoReading: false,
  phraseMinimumViolations,
  byRole,
  entries,
  inactiveExtensionEntries: inactiveEntries.map(x => ({ lemma: x.lemma, roles: x.roles, sourceLists: x.sourceLists })),
  pass
};

fs.writeFileSync(OUTPUT_JSON, `${JSON.stringify(report, null, 2)}\n`);
const md = `# Reading V2 Active Vocabulary Coverage\n\n- 생성일: ${report.generatedAt}\n- 설계: ${report.design}\n- 학습일: ${report.dayCount}/100\n- 집중 본문: ${readingMin}~${readingMax}단어\n- 본문 범위 위반: ${report.readingRangeViolations}\n- 마스터 원본 풀: ${report.masterHeadwords} headwords\n- 핵심 활성어휘 목표: ${report.activeUniqueTarget}\n- 실제 활성어휘: ${report.activeUniqueHeadwords}\n- 확장학습 풀: ${report.inactiveExtensionPool}\n- 본문 전수 강제삽입: 사용하지 않음\n- 하루 숙어·연어 최소량 위반: ${report.phraseMinimumViolations}\n\n## 역할별 활성화\n\n${Object.entries(report.byRole).map(([role, v]) => `- ${role}: ${v.active}/${v.total} (${v.activePercent}%)`).join('\n')}\n\n## 운영 원칙\n\n- 500~650단어 본문은 독해 흐름과 문단 구조를 우선한다.\n- 마스터 4,786개는 선별·감사·확장학습용 원본 풀로 유지한다.\n- 약 2,520개를 100일 핵심 활성어휘로 분리 학습한다.\n- TOEIC-specific은 활성학습에서 우선 전수 포함한다.\n- 나머지 어휘는 TEPS·문제해설·재독·후속 확장학습에서 사용한다.\n\n## 판정\n\n${pass ? 'PASS — 집중 독해와 핵심 활성어휘 분리 기준을 충족했다.' : 'FAIL — 본문 길이·활성어휘·TOEIC 핵심어·숙어 또는 일수 기준을 확인해야 한다.'}\n`;
fs.writeFileSync(OUTPUT_MD, md);
console.log(md);
if (!pass) process.exitCode = 1;
