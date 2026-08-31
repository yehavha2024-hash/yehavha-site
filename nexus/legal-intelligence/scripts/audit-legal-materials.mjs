import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const target = path.resolve(here, '..', 'legal-materials.json');
const policyTarget = path.resolve(here, '..', 'legal-materials-policy.json');
const data = JSON.parse(await fs.readFile(target, 'utf8'));
const policy = JSON.parse(await fs.readFile(policyTarget, 'utf8'));
const allowedTypes = new Set(['판례', '헌재결정', '법령', '연구자료']);
const datePattern = /^20\d{2}-\d{2}-\d{2}$/;
const seenKeys = new Set();
const seenRefs = new Set();

const expectedPriorityOrder = [
  'AI·책임귀속',
  '데이터·개인정보',
  '자동화된 의사결정·행정',
  '피지컬 AI·로봇',
  '플랫폼·소비자책임',
  '교육·에듀테크',
  'LegalTech·법조제도'
];

const nexusInterestPattern = /(AI|인공지능|에이전틱|책임|데이터|개인정보|자동화|행정|지방자치|피지컬|로봇|플랫폼|소비자|에듀테크|교육|LegalTech|법조|사법제도)/i;
const interpretiveLeakPattern = /(NEXUS|연구\s*포인트|연구에\s*(?:활용|연결)|연구를\s*(?:위해|위한)|확장\s*해석|시사점|후속\s*연구)/i;

// 2026-08-31 이전에 간략 형식으로 이미 등록된 자료만 예외로 둔다.
// 이 목록에 없는 신규 판례·연구자료는 반드시 쟁점·법리·NEXUS 연구 포인트 3단 분석을 가져야 한다.
const legacyCompactKeys = new Set([
  'case:scourt:2026da201223',
  'case:scourt:2026da202771',
  'case:scourt:2025da217842',
  'research:klri:2381',
  'research:klri:2379',
  'research:klri:2367',
  'research:klri:2368',
  'research:klri:2337',
  'research:klri:2308'
]);

if (!Array.isArray(data.records)) throw new Error('legal-materials records[] is required.');
if (!data.records.length) throw new Error('legal-materials must contain at least one record.');

if (policy.mode !== 'NEXUS에 필요한 자료를 깊게 축적') throw new Error('Unexpected legal-materials curation mode.');
if (JSON.stringify(policy.priorityOrder) !== JSON.stringify(expectedPriorityOrder)) throw new Error('NEXUS legal-material priority order changed unexpectedly.');
if (JSON.stringify(policy.requiredAnalysis) !== JSON.stringify(['issue', 'legalRule', 'researchPoint'])) throw new Error('Three-layer analysis policy is required.');
if (!String(policy.caseAnalysisBoundary?.legalRule || '').includes('판시하거나 설시한 법리만')) throw new Error('Case legalRule boundary is missing.');
if (!String(policy.caseAnalysisBoundary?.researchPoint || '').includes('NEXUS 관심영역')) throw new Error('Case researchPoint boundary is missing.');

for (const record of data.records) {
  const key = String(record.recordKey || '').trim();
  if (!key) throw new Error('recordKey is required.');
  if (seenKeys.has(key)) throw new Error(`Duplicate recordKey: ${key}`);
  seenKeys.add(key);

  if (!allowedTypes.has(record.type)) throw new Error(`Invalid type in ${key}: ${record.type}`);
  for (const field of ['source', 'title', 'reference', 'date', 'result', 'summary', 'legalPoint']) {
    if (!String(record[field] || '').trim()) throw new Error(`${field} is required: ${key}`);
  }
  if (!datePattern.test(record.date)) throw new Error(`Invalid date: ${key}`);
  if (!Array.isArray(record.topics) || !record.topics.length) throw new Error(`topics[] required: ${key}`);
  if (!/^https:\/\//.test(String(record.sourceUrl || ''))) throw new Error(`HTTPS sourceUrl required: ${key}`);

  const referenceKey = `${record.type}|${String(record.reference).replace(/\s+/g, ' ').trim()}`;
  if (seenRefs.has(referenceKey)) throw new Error(`Duplicate type/reference: ${referenceKey}`);
  seenRefs.add(referenceKey);

  if (String(record.summary).trim().length < 40) throw new Error(`summary too short: ${key}`);

  const requiresThreeLayerAnalysis = (record.type === '판례' || record.type === '연구자료') && !legacyCompactKeys.has(key);
  if (requiresThreeLayerAnalysis) {
    for (const field of ['issue', 'legalRule', 'researchPoint']) {
      const value = String(record[field] || '').trim();
      if (!value) throw new Error(`${field} is required for curated ${record.type}: ${key}`);
      if (value.length < 35) throw new Error(`${field} too short for curated ${record.type}: ${key}`);
    }

    const topicText = record.topics.join(' ');
    if (!nexusInterestPattern.test(topicText)) throw new Error(`No direct NEXUS interest-area match: ${key}`);

    if (record.type === '판례') {
      const legalRule = String(record.legalRule).trim();
      if (interpretiveLeakPattern.test(legalRule)) {
        throw new Error(`NEXUS/research interpretation leaked into case legalRule; move it to researchPoint: ${key}`);
      }
    }

    // 3단 분석 자료에서는 legalPoint를 카드용 짧은 결론으로 사용한다.
    if (String(record.legalPoint).trim().length < 15) throw new Error(`legalPoint too short: ${key}`);
  } else if (String(record.legalPoint).trim().length < 30) {
    throw new Error(`legalPoint too short: ${key}`);
  }
}

console.log(`Legal materials audit passed: ${data.records.length} unique record(s). NEXUS priority order and issue/legalRule/researchPoint separation enforced.`);
