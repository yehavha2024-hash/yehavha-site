import fs from 'node:fs';
import path from 'node:path';

const DIR = path.join(process.cwd(), 'toeic-human-100');
const coverage = JSON.parse(fs.readFileSync(path.join(DIR, 'READING_V2_COVERAGE.json'), 'utf8'));
const policy = JSON.parse(fs.readFileSync(path.join(DIR, 'coverage-policy-v2.json'), 'utf8'));
const OUT_JSON = path.join(DIR, 'NEXT_10_DAY_TARGETS.json');
const OUT_MD = path.join(DIR, 'NEXT_10_DAY_TARGETS.md');

const totalDays = Number(policy.totalDays || 100);
const blockSize = Number(policy.blockSize || 10);
const dayCount = Number(coverage.dayCount || 0);
const activeTarget = Number(policy.vocabularyDesign?.activeUniqueTarget || 2520);
const activeNow = Number(coverage.activeUniqueHeadwords || 0);
const remaining = Math.max(0, activeTarget - activeNow);
const milestones = policy.activeVocabularyMilestones || [];
const nextDay = dayCount >= totalDays ? null : dayCount + 1;
const nextMilestoneDay = nextDay === null ? totalDays : Math.min(totalDays, Math.ceil(nextDay / blockSize) * blockSize);
const nextMilestone = milestones.find(x => Number(x.day) === nextMilestoneDay) || null;
const requiredByMilestone = nextMilestone ? Number(nextMilestone.minimumCumulativeNewHeadwords || 0) : activeTarget;
const requiredAdditional = Math.max(0, requiredByMilestone - activeNow);
const daysRemaining = nextDay === null ? 0 : Math.max(0, nextMilestoneDay - dayCount);

function quotas(total, days) {
  if (!days) return [];
  const base = Math.floor(total / days);
  const remainder = total % days;
  return Array.from({length:days}, (_,i) => base + (i < remainder ? 1 : 0));
}

const newQuotas = quotas(requiredAdditional, daysRemaining);
const dayQuotas = Array.from({length:daysRemaining}, (_,i) => ({
  day:dayCount + 1 + i,
  newActiveHeadwordQuota:newQuotas[i],
  reviewHeadwordQuota:2,
  phraseMinimum:Number(policy.phraseAndGrammarCoverage?.phrasesPerDayMin || 6),
  instruction:'본문 길이를 늘리지 말고 핵심어휘·숙어는 해부·학습 단계에서 처리한다.'
}));

const report = {
  generatedAt:new Date().toISOString(),
  design:'short-reading-v3',
  current:{
    dayCount,
    masterPoolHeadwords:Number(coverage.masterHeadwords || policy.vocabularyDesign?.masterPoolHeadwords || 4786),
    activeUniqueHeadwords:activeNow,
    activeUniqueTarget:activeTarget,
    remainingActiveHeadwords:remaining,
    inactiveExtensionPool:Number(coverage.inactiveExtensionPool || 0)
  },
  nextBlock:{
    startDay:nextDay,
    endDay:nextDay === null ? null : nextMilestoneDay,
    milestone:nextMilestone,
    requiredAdditional,
    dayQuotas
  },
  rules:{
    readingWords:'700~850',
    newActiveWordsPerGeneratedDay:28,
    reviewWordsPerGeneratedDay:2,
    phrasesPerDayMin:Number(policy.phraseAndGrammarCoverage?.phrasesPerDayMin || 6),
    fullMasterForcedIntoReading:false
  }
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report,null,2) + '\n');
const dayLines = dayQuotas.length ? dayQuotas.map(x => `- DAY ${String(x.day).padStart(3,'0')}: 신규 활성어휘 ${x.newActiveHeadwordQuota}, 복습 ${x.reviewHeadwordQuota}, 숙어·연어 ${x.phraseMinimum}개 이상`).join('\n') : '- 100일 활성어휘 배치 완료';
const md = `# 다음 10일 활성어휘 보정 목표\n\n- 현재 DAY: ${dayCount}\n- 마스터 원본 풀: ${report.current.masterPoolHeadwords}\n- 핵심 활성어휘: ${activeNow}/${activeTarget}\n- 남은 활성어휘: ${remaining}\n- 확장학습 풀: ${report.current.inactiveExtensionPool}\n\n## DAY별 기준\n\n${dayLines}\n\n## 원칙\n\n본문은 700~850단어를 유지하고 어휘량을 맞추기 위해 본문을 늘리지 않는다. 신규 핵심어휘·반복어휘·숙어·연어는 해부·학습 단계에서 관리하며, 전체 4,786개 마스터 풀은 선별·감사·확장학습의 원본으로 유지한다.\n`;
fs.writeFileSync(OUT_MD, md);
console.log(md);
