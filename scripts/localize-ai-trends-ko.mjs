import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const DATA_PATH = path.join(process.cwd(), 'nexus', 'ai-trends', 'data.json');

const KO = {
  'auto-2026-09-07-arxiv-cs-ai-fe46207998': {
    title: 'EXAONE Finance, 금융 예측에 특화된 시계열 기반모델 제시',
    summary: '이 기술보고서는 금융 예측에 특화된 시계열 기반모델 EXAONE Forecast for Finance(EXAONE Finance)를 제시한다. 최근 시계열 기반모델은 대규모 사전학습을 통해 강한 제로샷 성능을 보이지만 주로 범용 시계열을 대상으로 개발돼 왔다는 한계를 짚고, 금융 데이터에 특화된 예측 모델의 필요성을 다룬다.'
  },
  'auto-2026-09-07-arxiv-cs-ai-fddbfd5a18': {
    title: 'Harbor Adapters·Harbor-Index, 대규모 에이전틱 평가를 위한 통합 인프라 제시',
    summary: '에이전트 벤치마크는 서로 다른 실행환경과 에이전트 통합 방식 때문에 대규모 비교평가가 어렵다. 이 연구는 여러 에이전틱 벤치마크를 공통 방식으로 연결하는 Harbor Adapters와 선별된 메타데이터셋 Harbor-Index를 제시해 평가 인프라를 표준화하려는 접근을 제안한다.'
  },
  'auto-2026-09-07-arxiv-cs-ai-7cd10302c5': {
    title: 'LLM 설명의 충실성을 높이는 테스트 시점 제거 기반 접근법',
    summary: '대규모 언어모델이 중요한 의사결정에 활용되면서 모델 설명은 행동을 감사하는 핵심 수단이 되고 있다. 그러나 생성된 설명이 실제 모델 판단 과정과 일치하지 않는 문제가 있다. 이 연구는 테스트 시점에서 입력 요소를 제거하며 반응 변화를 확인하는 방식으로 설명의 충실성을 높이는 접근을 제안한다.'
  },
  'auto-2026-09-07-arxiv-cs-ai-43f5bdb9a8': {
    title: 'Iris 검색 에이전트, 대규모 다단계 검색 능력 학습 방식 제시',
    summary: '이 연구는 Iris-mini와 Iris-pro 두 검색 에이전트와 함께 데이터 생성 파이프라인과 학습 방식을 제시한다. 웹 문서의 하이퍼링크 구조에서 여러 단계를 거쳐야 하는 검색 과업을 역으로 구성해, 에이전트가 복잡한 정보 탐색과 다단계 검색을 수행하도록 학습하는 방법을 다룬다.'
  },
  'auto-2026-09-07-arxiv-cs-ai-3c434585f9': {
    title: 'AI 채용, 단순 매칭 모델에서 다단계 채용 에이전트로 이동',
    summary: 'AI 채용 시스템의 자동화 대상이 단순한 후보자-직무 매칭과 순위화에서 증거 검색, 후보 비교, 판단 지원과 실행까지 포함하는 다단계 워크플로로 확대되고 있다. 이 연구는 이러한 변화를 체계적으로 검토하고 평가 방법과 거버넌스 쟁점을 함께 정리한다.'
  },
  'auto-2026-09-06-openai-news-eb96acc10a': {
    title: '고도화되는 AI와 정렬 문제…더 강한 안전장치와 국제 공조 필요성 제기',
    summary: 'OpenAI의 Jakub Pachocki는 AI의 능력이 빠르게 높아질수록 인간의 의도와 목표에 맞게 시스템을 유지하는 정렬 문제가 더 중요해진다고 설명한다. 그는 보다 강한 안전장치와 국제적 협력 체계가 필요하다는 점을 강조한다.'
  },
  'auto-2026-09-06-openai-news-57fbb99319': {
    title: 'OpenAI 내부 연구에서 코딩 에이전트 활용 확대…연구 속도와 과업 복잡도 변화',
    summary: 'OpenAI 내부에서 코딩 에이전트가 AI 연구 방식 자체를 바꾸고 있다. 에이전트 사용량, 실험 수행 속도, 처리 가능한 과업의 복잡도와 연구 가속 효과에 관한 초기 데이터를 통해 장기 연구 워크플로에서 에이전트의 역할이 확대되는 흐름을 보여준다.'
  },
  'auto-2026-09-04-github-changelog-e8b832d5df': {
    title: 'GitHub Copilot 주간 업데이트…모델 선택·콘텐츠 보호·에이전트 세션 관리 확대',
    summary: 'GitHub Copilot은 사용할 수 있는 모델 선택 폭과 콘텐츠 보호 기능을 확대했다. VS Code에는 여러 에이전트 세션을 관리하고 풀 리퀘스트를 병합 가능한 상태로 준비하는 기능이 추가돼, 코딩 에이전트를 실제 개발 워크플로에 통합하는 범위가 넓어졌다.'
  },
  'auto-2026-09-04-github-changelog-80a2fe16fd': {
    title: 'GPT-6 Astra, GitHub Copilot에서 정식 제공…장기 자율 코딩 과업 지원 확대',
    summary: 'OpenAI의 GPT-6 Astra가 GitHub Copilot에서 정식 제공된다. GitHub는 이 모델이 장시간 이어지는 자율 코딩과 에이전틱 과업을 수행하도록 설계됐다고 설명했으며, Copilot 안에서 복잡한 개발 작업을 장기적으로 수행하는 모델 선택지가 확대됐다.'
  }
};

function hasHangul(value = '') {
  return /[가-힣]/.test(String(value));
}

const raw = await fs.readFile(DATA_PATH, 'utf8');
const data = JSON.parse(raw);
const entries = Array.isArray(data.entries) ? data.entries : [];
let localized = 0;
let withheld = 0;

const next = [];
for (const entry of entries) {
  if (!entry?.autoCollected) {
    next.push(entry);
    continue;
  }

  const translated = KO[entry.id];
  if (translated) {
    next.push({ ...entry, ...translated, localizedKo: true });
    localized += 1;
    continue;
  }

  if (hasHangul(entry.title) && hasHangul(entry.summary)) {
    next.push({ ...entry, localizedKo: true });
    continue;
  }

  withheld += 1;
}

data.entries = next;
data.collector = {
  ...(data.collector || {}),
  publicLanguage: 'ko',
  localizationPolicy: '한국어 제목·요약이 완료된 자동수집 항목만 공개',
  lastLocalizedCount: localized,
  lastWithheldUnlocalizedCount: withheld
};

await fs.writeFile(DATA_PATH, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
console.log(`[ai-trends-ko] localized ${localized}; withheld ${withheld} unlocalized automated entries.`);
