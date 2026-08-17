(() => {
  'use strict';

  const terms = [
    { code:'AI', en:'AI · Artificial Intelligence', ko:'인공지능', meaning:'사람의 지능적 기능인 학습·추론·판단·인식·생성 등을 전자적 장치나 소프트웨어를 통해 인공적으로 구현하는 기술과 시스템의 총칭', triggers:['인공지능'], lead:['AI · Artificial Intelligence'] },
    { code:'AGI', en:'AGI · Artificial General Intelligence', ko:'범용 인공지능', meaning:'특정 과업에 한정되지 않고 여러 분야의 지적 과업을 폭넓게 수행하는 일반목적 지능을 가정하는 개념', triggers:['AGI','범용 인공지능'], lead:['AGI'] },
    { code:'ASI', en:'ASI · Artificial Superintelligence', ko:'초지능 인공지능', meaning:'인간의 광범위한 인지능력을 현저히 넘어서는 인공지능을 가정하는 장기적·규범적 시나리오 개념', triggers:['ASI','초지능 인공지능'], lead:['ASI'] },
    { code:'GPAI', en:'GPAI · General-Purpose AI', ko:'범용 AI', meaning:'다양한 목적과 업무에 재사용될 수 있는 범용 인공지능 모델 또는 시스템을 뜻하는 규제·기술 개념', triggers:['GPAI','General-Purpose AI','범용 AI'], lead:['GPAI','General-Purpose AI'] },
    { code:'LLM', en:'LLM · Large Language Model', ko:'대규모 언어모델', meaning:'방대한 언어데이터에서 패턴을 학습해 문장을 이해·생성하고 여러 언어 과업을 수행하는 인공지능 모델', triggers:['LLM','Large Language Model','대규모 언어모델'], lead:['LLM','Large Language Model'] },
    { code:'FOUNDATION', en:'Foundation Model', ko:'기반모델', meaning:'대규모 데이터로 사전학습되어 다양한 후속 서비스와 과업의 공통 기반으로 재사용되는 모델', triggers:['Foundation Model','기반모델','기초모델'], lead:['Foundation Model'] },
    { code:'FRONTIER', en:'Frontier Model', ko:'프런티어 모델·최첨단 모델', meaning:'동시대 최고 수준의 범용 성능과 새로운 능력을 보이는 대규모 최첨단 인공지능 모델을 가리키는 실무적 표현', triggers:['Frontier Model','frontier AI','프런티어','최첨단 AI'], lead:['Frontier Model'] },
    { code:'GENAI', en:'Generative AI', ko:'생성형 인공지능', meaning:'학습한 패턴을 바탕으로 텍스트·이미지·음성·영상·코드 등 새로운 콘텐츠를 만들어 내는 인공지능', triggers:['Generative AI','생성형 AI','생성형 인공지능'], lead:['Generative AI'] },
    { code:'AGENTIC', en:'Agentic AI', ko:'에이전틱 AI·행위주도형 인공지능', meaning:'목표를 여러 단계로 나누고 도구와 메모리를 사용하면서 다음 행동을 스스로 선택해 장기 과업을 수행하는 인공지능 시스템', triggers:['Agentic AI','에이전틱 AI'], lead:['Agentic AI'] },
    { code:'AGENT', en:'AI Agent', ko:'AI 에이전트·인공지능 행위주체형 프로그램', meaning:'목표를 받아 계획하고 외부 도구·데이터·서비스를 호출하여 실제 작업이나 행동을 연속적으로 수행하는 소프트웨어 단위', triggers:['AI Agent','AI 에이전트','에이전트'], lead:['AI Agent'] },
    { code:'MAS', en:'Multi-Agent System', ko:'다중 인공지능 에이전트 시스템', meaning:'복수의 AI 에이전트가 역할을 나누고 서로 협력·협상·경쟁하며 하나의 과업이나 결과를 만들어 내는 시스템', triggers:['Multi-Agent System','Multi-Agent','다중 에이전트','멀티에이전트'], lead:['Multi-Agent System','Multi-Agent'] },
    { code:'ORCH', en:'Orchestration', ko:'오케스트레이션·통합조정', meaning:'여러 모델·에이전트·도구의 역할과 실행순서를 배분하고 전체 작업흐름을 조정하는 기능', triggers:['Orchestration','오케스트레이션','오케스트레이터'], lead:['Orchestration'] },
    { code:'RAG', en:'RAG · Retrieval-Augmented Generation', ko:'검색증강생성', meaning:'외부 문서나 데이터베이스에서 관련 자료를 먼저 검색한 뒤 그 자료를 모델 입력에 결합하여 답변을 생성하는 방식', triggers:['RAG','Retrieval-Augmented Generation','검색증강'], lead:['RAG','Retrieval-Augmented Generation'] },
    { code:'FINE', en:'Fine-tuning', ko:'미세조정·추가학습', meaning:'이미 학습된 모델을 특정 업무·도메인·행동방식에 맞도록 추가 데이터로 조정하는 학습 방식', triggers:['Fine-tuning','파인튜닝','미세조정'], lead:['Fine-tuning'] },
    { code:'TOOL', en:'Tool Calling', ko:'도구호출', meaning:'인공지능이 검색·계산·파일·결제·브라우저·API 같은 외부 기능을 선택하여 실행하도록 요청하는 기능', triggers:['Tool Calling','도구호출','도구 호출'], lead:['Tool Calling'] },
    { code:'API', en:'API · Application Programming Interface', ko:'응용프로그램 연결규격', meaning:'서로 다른 소프트웨어나 서비스가 정해진 형식으로 기능과 데이터를 요청·응답하도록 연결하는 인터페이스', triggers:['API','응용프로그램 인터페이스'], lead:['API'] },
    { code:'INJECTION', en:'Prompt Injection', ko:'프롬프트 인젝션·지시문 주입 공격', meaning:'웹페이지·이메일·문서 같은 외부 입력에 악성 지시를 숨겨 모델의 원래 지시를 덮어쓰거나 우회하게 만드는 공격', triggers:['Prompt Injection','프롬프트 인젝션','지시문 주입'], lead:['Prompt Injection'] },
    { code:'REDTEAM', en:'Red Teaming', ko:'레드팀 검증·공격자 관점 안전성 시험', meaning:'공격자의 입장에서 시스템의 취약점·오용경로·실패조건을 의도적으로 찾아내는 안전성 평가 방법', triggers:['Red Teaming','레드팀','레드 티밍'], lead:['Red Teaming'] },
    { code:'SELFPLAY', en:'Self-Play', ko:'자기대전 학습', meaning:'AI가 서로 다른 역할을 맡아 반복적으로 대결하거나 상호작용하면서 전략과 대응능력을 학습하는 방식', triggers:['Self-Play','self-play','자기대전'], lead:['Self-Play'] },
    { code:'INTEROP', en:'Interoperability', ko:'상호운용성', meaning:'서로 다른 에이전트·도구·서비스·시스템이 공통 규격을 통해 정보를 주고받고 함께 작동할 수 있는 능력', triggers:['Interoperability','상호운용성'], lead:['Interoperability'] },
    { code:'IDENTITY', en:'Identity', ko:'신원·식별체계', meaning:'어떤 에이전트나 시스템이 누구의 것인지, 어떤 출처와 권한을 가지는지를 식별·인증하는 체계', triggers:['Identity','신원체계','신원·권한','에이전트 신원'], lead:['Identity'] },
    { code:'HARNESS', en:'Evaluation Harness', ko:'평가 실행환경', meaning:'모델을 일정한 조건에서 실행하고 점수를 측정하기 위해 사용하는 코드·도구·설정·메모리·프롬프트 구성의 묶음', triggers:['Evaluation Harness','평가 실행환경','harness'], lead:['Evaluation Harness'] },
    { code:'BENCH', en:'Benchmark', ko:'벤치마크·공통 성능평가기준', meaning:'여러 모델이나 시스템을 같은 과제와 지표로 비교하기 위해 만든 표준화된 평가문제와 측정기준', triggers:['Benchmark','benchmark','벤치마크'], lead:['Benchmark'] },
    { code:'REASON', en:'Reasoning', ko:'추론', meaning:'주어진 정보와 규칙을 여러 단계로 연결하여 중간 판단을 만들고 결론에 도달하는 처리', triggers:['Reasoning','reasoning','추론'], lead:['Reasoning'] },
    { code:'COMPACT', en:'Compaction', ko:'맥락 압축', meaning:'긴 대화나 장기 작업의 정보를 줄여 핵심 상태와 필요한 맥락만 남기고 계속 활용하는 처리', triggers:['Compaction','compaction','맥락 압축','컨텍스트 압축'], lead:['Compaction'] },
    { code:'DEPLOYMENT', en:'Deployment', ko:'배치·실서비스 적용', meaning:'개발·평가된 모델이나 시스템을 실제 사용자와 업무환경에서 작동하도록 설치하고 운영하는 단계', triggers:['Deployment','deployment','배치 단계'], lead:['Deployment'] },
    { code:'ROUTING', en:'Routing', ko:'라우팅·자동 분기', meaning:'요청의 내용·비용·위험·난이도에 따라 적절한 모델이나 도구로 작업을 자동 배분하는 처리', triggers:['Routing','routing','라우팅'], lead:['Routing'] },
    { code:'VLA', en:'VLA · Vision-Language-Action Model', ko:'시각·언어·행동 모델', meaning:'영상과 언어를 함께 이해하여 로봇이나 기계의 실제 행동 명령까지 연결하는 인공지능 모델', triggers:['VLA','Vision-Language-Action','시각·언어·행동'], lead:['VLA','Vision-Language-Action'] },
    { code:'EMBODIED', en:'Embodied AI', ko:'체화 인공지능', meaning:'센서와 물리적 몸체를 통해 현실환경을 인식하고 그 환경 안에서 직접 행동하는 인공지능', triggers:['Embodied AI','체화 AI','체화 인공지능'], lead:['Embodied AI'] },
    { code:'EMBREASON', en:'Embodied Reasoning', ko:'체화추론·물리환경 기반 추론', meaning:'몸체·센서·공간·물체의 상태와 물리적 제약을 함께 고려하여 행동을 판단하는 추론', triggers:['Embodied Reasoning','체화추론','체화 추론'], lead:['Embodied Reasoning'] },
    { code:'ONDEVICE', en:'On-device AI', ko:'온디바이스 AI·기기내장 인공지능', meaning:'클라우드 서버에 보내지 않고 스마트폰·PC·로봇 같은 개별 기기 안에서 직접 모델을 실행하는 방식', triggers:['On-device AI','온디바이스'], lead:['On-device AI'] },
    { code:'EDGE', en:'Edge AI', ko:'엣지 AI·현장단말 인공지능', meaning:'데이터가 발생하는 현장 가까이의 단말이나 엣지 장비에서 인공지능을 실행하여 지연과 통신의존을 줄이는 방식', triggers:['Edge AI','엣지 AI'], lead:['Edge AI'] },
    { code:'FULLSTACK', en:'Full-Stack Safety', ko:'전계층 안전·전체 계층 통합 안전', meaning:'하드웨어·운영체제·모델·제어·검증 등 시스템 전체 계층의 안전장치를 하나의 구조로 연결하는 접근', triggers:['Full-Stack Safety','Full-Stack','전계층 안전'], lead:['Full-Stack Safety','Full-Stack'] },
    { code:'UNIFIED', en:'Unified Memory', ko:'통합 메모리', meaning:'CPU·GPU 등 여러 연산장치가 하나의 메모리 공간을 공유하도록 구성해 데이터 복사 부담을 줄이는 구조', triggers:['Unified Memory','통합 메모리'], lead:['Unified Memory'] },
    { code:'VRAM', en:'VRAM · Video Random Access Memory', ko:'비디오 메모리·GPU 전용 메모리', meaning:'GPU가 모델 가중치·중간 연산값·그래픽 데이터를 저장하는 고속 전용 메모리', triggers:['VRAM','비디오 메모리'], lead:['VRAM'] },
    { code:'KVCACHE', en:'KV Cache · Key-Value Cache', ko:'키-값 캐시', meaning:'언어모델이 이미 처리한 토큰의 중간 계산결과를 저장하여 다음 토큰 생성의 반복연산을 줄이는 메모리 구조', triggers:['KV Cache','KV 캐시','키-값 캐시'], lead:['KV Cache'] },
    { code:'LOCAL', en:'Local Inference', ko:'로컬 추론', meaning:'클라우드 서버가 아니라 개인 PC·워크스테이션·기기에서 모델의 추론연산을 직접 수행하는 방식', triggers:['Local Inference','로컬 추론'], lead:['Local Inference'] },
    { code:'ADS', en:'ADS · Automated Driving System', ko:'자동주행시스템', meaning:'정해진 운행조건에서 차량의 주행업무를 자동으로 수행하도록 설계된 시스템', triggers:['ADS','Automated Driving System','자동주행시스템'], lead:['ADS','Automated Driving System'] },
    { code:'ADAS', en:'ADAS · Advanced Driver Assistance Systems', ko:'첨단운전자보조시스템', meaning:'운전자를 완전히 대체하지 않고 조향·제동·차로유지 같은 운전기능을 보조하는 시스템', triggers:['ADAS','첨단운전자보조'], lead:['ADAS'] },
    { code:'ODD', en:'ODD · Operational Design Domain', ko:'운행설계영역', meaning:'자율주행 기능이 정상적으로 작동하도록 설계된 도로·날씨·속도·지역·시간 등 운행조건의 범위', triggers:['ODD','Operational Design Domain','운행설계영역'], lead:['ODD'] },
    { code:'OTA', en:'OTA · Over-the-Air Update', ko:'무선 원격 업데이트', meaning:'기기를 회수하지 않고 통신망을 통해 소프트웨어·모델·기능을 원격으로 변경하거나 갱신하는 방식', triggers:['OTA','Over-the-Air','원격업데이트','원격 업데이트'], lead:['OTA','Over-the-Air'] },
    { code:'UAS', en:'UAS · Unmanned Aircraft System', ko:'무인항공시스템', meaning:'드론 기체뿐 아니라 조종·통신·지상통제·운영체계까지 포함하는 전체 무인항공 시스템', triggers:['UAS','Unmanned Aircraft System','무인항공시스템'], lead:['UAS'] },
    { code:'BVLOS', en:'BVLOS · Beyond Visual Line of Sight', ko:'비가시권 비행', meaning:'조종자가 육안으로 기체를 직접 볼 수 없는 범위에서 통신·감시체계를 이용해 수행하는 무인기 비행', triggers:['BVLOS','Beyond Visual Line of Sight','비가시권'], lead:['BVLOS'] },

    { code:'DUTY', en:'Duty of Care', ko:'주의의무', meaning:'합리적인 사람이 같은 상황에서 손해를 예방하기 위해 취했어야 할 주의와 조치를 요구하는 법적 의무', triggers:['Duty of Care','주의의무','주의 의무'], lead:['Duty of Care'] },
    { code:'NEGLIGENCE', en:'Negligence', ko:'과실', meaning:'요구되는 주의의무를 다하지 않아 예견·회피할 수 있었던 손해를 발생시키는 책임의 기초', triggers:['Negligence','과실책임','과실'], lead:['Negligence'] },
    { code:'CAUSATION', en:'Causation', ko:'인과관계', meaning:'행위·결함·부작위와 발생한 손해 사이에 법적으로 책임을 연결할 수 있는 원인관계가 있는지를 판단하는 개념', triggers:['Causation','인과관계'], lead:['Causation'] },
    { code:'FORESEE', en:'Foreseeability', ko:'예견가능성', meaning:'행위 당시 합리적인 사람이 해당 종류의 위험이나 손해를 미리 예상할 수 있었는지를 판단하는 기준', triggers:['Foreseeability','예견가능성'], lead:['Foreseeability'] },
    { code:'PRODUCT', en:'Product Liability', ko:'제조물책임', meaning:'제조물의 제조·설계·표시상 결함으로 생명·신체·재산에 손해가 발생한 경우 제조업자 등의 책임을 묻는 법영역', triggers:['Product Liability','제조물책임','제품책임'], lead:['Product Liability'] },
    { code:'STRICT', en:'Strict Liability', ko:'엄격책임·무과실책임', meaning:'일정한 위험활동이나 법정 요건에서는 행위자의 과실을 별도로 입증하지 않아도 책임을 인정하는 책임구조', triggers:['Strict Liability','엄격책임','무과실책임'], lead:['Strict Liability'] },
    { code:'BURDEN', en:'Burden of Proof', ko:'증명책임', meaning:'소송에서 특정 사실이 참인지 불분명할 때 그 불이익을 어느 당사자가 부담하는지를 정하는 규칙', triggers:['Burden of Proof','증명책임','입증책임'], lead:['Burden of Proof'] },
    { code:'DISCOVERY', en:'Discovery', ko:'증거개시', meaning:'주로 영미소송에서 재판 전에 상대방이 보유한 문서·전자정보·증언 등 사건 관련 증거를 상호 확보하는 절차', triggers:['Discovery','증거개시'], lead:['Discovery'] },
    { code:'SPOLIATION', en:'Spoliation of Evidence', ko:'증거훼손·증거보존 위반', meaning:'소송이 예상되거나 진행 중인 상황에서 관련 증거를 파기·변경·미보존하여 상대방의 입증을 어렵게 만드는 행위와 그 제재 문제', triggers:['Spoliation','증거훼손','보존의무 위반'], lead:['Spoliation'] },
    { code:'PROVIDER', en:'Provider', ko:'공급자', meaning:'EU AI Act 등에서 AI 시스템이나 범용 AI 모델을 개발하거나 개발하게 하여 자신의 명칭·상표로 시장에 제공하거나 사용에 투입하는 주체', triggers:['Provider','공급자'], lead:['Provider'] },
    { code:'DEPLOYER', en:'Deployer', ko:'배치자·업무사용자', meaning:'EU AI Act 등에서 개인적 비전문 사용이 아니라 자신의 권한 아래 AI 시스템을 실제 업무나 서비스에 사용하는 주체', triggers:['Deployer','배치자'], lead:['Deployer'] },
    { code:'CONFORMITY', en:'Conformity Assessment', ko:'적합성 평가', meaning:'제품이나 AI 시스템이 적용되는 법적·기술적 요구사항을 충족하는지 시장 출시 또는 사용 전에 확인하는 절차', triggers:['Conformity Assessment','적합성 평가'], lead:['Conformity Assessment'] },
    { code:'FRIA', en:'Fundamental Rights Impact Assessment', ko:'기본권 영향평가', meaning:'AI 시스템의 사용이 개인정보·차별금지·표현의 자유 등 기본권에 미칠 위험을 사전에 식별하고 완화조치를 검토하는 평가', triggers:['Fundamental Rights Impact Assessment','기본권 영향평가'], lead:['Fundamental Rights Impact Assessment'] },
    { code:'TRANSPARENCY', en:'Transparency', ko:'투명성', meaning:'AI의 사용 여부·작동조건·한계·정보출처·책임주체 등 이용자와 감독자가 판단에 필요한 정보를 알 수 있게 하는 원칙', triggers:['Transparency','투명성'], lead:['Transparency'] },
    { code:'EXPLAIN', en:'Explainability', ko:'설명가능성', meaning:'AI의 결과가 왜 나왔는지 이해관계자에게 의미 있는 수준에서 이유·주요 요인·검토가능성을 제시할 수 있는 성질', triggers:['Explainability','설명가능성'], lead:['Explainability'] },
    { code:'ACCOUNT', en:'Accountability', ko:'책임성', meaning:'AI의 설계·배치·운영에 관한 역할과 의무를 특정하고 결과에 대해 설명·시정·책임을 부담할 수 있게 하는 원칙', triggers:['Accountability','책임성'], lead:['Accountability'] },
    { code:'GOV', en:'Governance', ko:'거버넌스·관리통제체계', meaning:'조직이 AI의 권한·위험·승인·감사·사고대응을 지속적으로 관리하기 위해 마련하는 규칙과 의사결정 구조', triggers:['Governance','거버넌스'], lead:['Governance'] }
  ];

  const format = term => `${term.en} (${term.ko}, ${term.meaning})`;
  const flatten = value => {
    if (value == null) return [];
    if (Array.isArray(value)) return value.flatMap(flatten);
    if (typeof value === 'object') return Object.entries(value).flatMap(([key, val]) => ['url','sourceUrl'].includes(key) ? [] : flatten(val));
    return [String(value)];
  };

  function containsTerm(term, haystack) {
    if (term.code === 'AI') return /(^|[^A-Z])AI([^A-Z]|$)/i.test(haystack) || haystack.includes('인공지능');
    return term.triggers.some(trigger => haystack.includes(String(trigger).toLowerCase()));
  }

  function guideFor(value, limit = 14) {
    const haystack = flatten(value).join(' ').toLowerCase();
    const found = [];
    for (const term of terms) {
      if (containsTerm(term, haystack)) found.push(format(term));
      if (found.length >= limit) break;
    }
    return found;
  }

  function canonicalizeLabel(value) {
    const label = String(value ?? '').trim();
    if (!label) return label;
    const lower = label.toLowerCase();
    for (const term of terms) {
      if ((term.lead || []).some(lead => lower.startsWith(String(lead).toLowerCase()))) return format(term);
    }
    return label;
  }

  function normalizeForesightLabels() {
    const records = Array.isArray(window.AI_FORESIGHT_RECORDS) ? window.AI_FORESIGHT_RECORDS : [];
    records.forEach(record => {
      if (Array.isArray(record.tech)) record.tech = record.tech.map(canonicalizeLabel);
    });
    const meta = window.AI_FORESIGHT_META;
    if (meta && Array.isArray(meta.latestTerms)) meta.latestTerms = meta.latestTerms.map(canonicalizeLabel);
  }

  window.RESEARCH_TERMINOLOGY_STANDARD = { terms, format, guideFor, canonicalizeLabel, normalizeForesightLabels };
  normalizeForesightLabels();
})();
