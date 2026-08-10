window.RESEARCH_TRACK = {
  updatedAt: '2026-08-10',
  currentStage: 'phd-plan',
  profile: {
    title: 'AI 책임법제의 장기 연구계보 구축',
    description: '석사학위논문에서 제기한 AI 행위의 책임귀속 문제를 출발점으로, 단일 AI를 넘어 Agentic AI와 다중 인공지능 에이전트 시스템의 행위효과·창발적 손해·책임배분·법적 지위 문제까지 단계적으로 확장합니다.',
    overview: [
      { label: '연구 목표', title: 'AI 작동을 법적 책임구조로 전환', description: 'AI의 기술적 작동과 법적 책임 사이의 간극을 분석하고, 책임귀속을 정당화할 수 있는 규범적 기준과 제도적 수단을 설계합니다.' },
      { label: '핵심 문제', title: '행위효과와 책임귀속의 분리', description: 'AI가 사실상 결과를 발생시켰다는 점과 그 결과를 특정 인간·조직·기능적 단위에 법적으로 귀속하는 문제를 구별하여 검토합니다.' },
      { label: '연구 확장', title: '단일 AI에서 Agentic·Multi-Agent로', description: '독립적 목표수행, 도구사용, 상호작용과 창발성이 강화되는 시스템에서 기존 책임법리가 어디까지 작동하는지 단계적으로 검증합니다.' },
      { label: '최종 방향', title: '독자적 박사 연구체계 완성', description: '학술논문과 학회 발표에서 검증된 세부 논증을 축적해 박사학위논문에서 하나의 통합된 AI 책임귀속 모델로 완성하는 것을 목표로 합니다.' }
    ]
  },
  axes: [
    { no: '01', title: '행위효과와 책임귀속', description: 'AI의 사실상 작동·결정·결과발생과 법적 책임주체의 규범적 귀속을 구별하고, 귀속의 연결기준을 정립합니다.' },
    { no: '02', title: '창발적 손해와 인과구조', description: '다중 에이전트 상호작용에서 개별 행위만으로 설명하기 어려운 손해가 발생할 때 인과관계와 책임범위를 어떻게 구성할지 연구합니다.' },
    { no: '03', title: '계층적 책임귀속', description: '설계·통합·배치·운용 단계의 통제가능성, 위험창출, 이익귀속과 주의의무를 기준으로 책임을 계층적으로 배분하는 모델을 검토합니다.' },
    { no: '04', title: '증명위험과 절차적 책임', description: '로그·설명가능성·정보비대칭을 고려하여 피해자의 증명부담, 사업자의 자료보존·제출의무와 증명위험 배분 원리를 연구합니다.' },
    { no: '05', title: '기능적 단위의 법적 지위', description: '등록·책임관리인·보험·공탁·책임재산·제한적 소송상 지위 등 필요한 법적 incidents를 기능별로 설계하고 남용통제 기준을 검토합니다.' }
  ],
  methods: [
    { title: '법리·판례 분석', description: '민사책임·불법행위·법인격·증명책임 관련 실정법과 판례를 중심으로 기존 법질서 안에서 적용 가능한 규범과 한계를 확인합니다.' },
    { title: '비교법·정책 분석', description: 'EU·미국 등 주요 법제의 AI 규율, 책임정책과 제도설계를 비교하여 국내법에 적용 가능한 요소와 차이를 구분합니다.' },
    { title: '법철학적 정당화', description: '책임의 정당화, 지배영역, 위험창출, 이익귀속, 정의와 같은 규범적 근거를 통해 단순 정책제안을 법학적 논증으로 전환합니다.' },
    { title: '기술구조와 법적 대응의 연결', description: 'Agentic AI, 멀티에이전트 상호작용, 로그·도구사용·권한위임 등 기술적 구조가 법적 통제가능성과 책임귀속에 미치는 영향을 대응시킵니다.' }
  ],
  standards: [
    '사실·기존 법리·해석·입법론을 구분하여 서술',
    '원문·판례·법령·공식자료를 우선 확인하고 인용범위를 검증',
    '반론과 경쟁학설을 함께 검토하고 적용 한계를 명시',
    '학회 발표와 KCI 동료평가를 박사논문 이전의 외부 검증 단계로 활용',
    '각 후속논문은 박사논문의 특정 논증축과 연결되도록 연구계보를 유지'
  ],
  stages: [
    {
      id: 'master', order: '00', eyebrow: 'MASTER THESIS', title: '석사 연구 기반', status: '완료', tone: 'done',
      summary: 'AI 행위의 책임귀속과 기능적 단위의 법적 지위를 중심으로 석사학위논문을 완성하고 후속 연구의 출발점을 확립했습니다.',
      focus: ['책임귀속 원칙', '책임범위', '기능적 단위', '법인격 incidents'],
      deliverable: '석사학위논문 및 우수논문상',
      items: [
        { type: '석사학위논문', title: 'AI 행위에 대한 책임귀속 및 범위에 관한 원칙과 그 실현 방안에 대한 연구', note: '기능적 단위의 법인격 부여라는 수단을 중심으로' },
        { type: '학술성과', title: '석사학위논문 우수논문상', note: '석사학위기 수여식 대표 수상자' }
      ]
    },
    {
      id: 'kci', order: '01', eyebrow: 'KCI JOURNAL', title: 'KCI 학술논문', status: '준비', tone: 'next',
      summary: '석사논문의 핵심 논증과 박사연구의 주요 쟁점을 독립된 학술논문 단위로 분해하여 외부 동료평가를 받습니다.',
      focus: ['석사논문 핵심명제 압축', '책임귀속 정당화', 'Agentic AI 확장'],
      deliverable: 'KCI 등재(후보) 학술지 논문',
      items: [
        { type: '후보 연구', title: 'AI 행위의 책임귀속 원리와 기능적 단위의 법적 지위', note: '석사논문의 핵심 논증을 외부 동료평가용 논문으로 재구성하는 후보 주제' },
        { type: '후보 연구', title: 'Agentic AI의 행위효과와 민사책임 구조', note: '자율적 목표수행·도구사용·권한위임이 기존 책임법리에 미치는 영향을 검토하는 후속 후보 주제' }
      ]
    },
    {
      id: 'conference', order: '02', eyebrow: 'ACADEMIC CONFERENCE', title: '학술대회 발표', status: '준비', tone: 'next',
      summary: 'AI 책임법제·민사책임·법철학 관련 학술대회에서 핵심 명제를 발표하고 토론과 반론을 후속 연구에 반영합니다.',
      focus: ['논증 공개검증', '전공자 토론', '반론 수집', '후속 수정'],
      deliverable: '학술대회 발표문·토론기록·수정논문',
      items: [
        { type: '발표 후보', title: '다중 AI 에이전트의 창발적 손해와 계층적 책임귀속', note: '박사논문의 핵심 쟁점을 학회 발표 단위로 선행 검증하는 후보 주제' }
      ]
    },
    {
      id: 'phd-plan', order: '03', eyebrow: 'PHD RESEARCH PLAN', title: '박사 연구계획', status: '진행', tone: 'active',
      summary: '석사 연구를 Agentic AI 및 다중 인공지능 에이전트 시스템의 행위효과·창발적 손해·계층적 책임귀속 문제로 확장합니다.',
      focus: ['Agentic AI', 'Multi-Agent Systems', '창발적 손해', '계층적 책임귀속', '기능적 법적 지위'],
      deliverable: '박사 연구계획서 및 세부 연구질문',
      items: [
        { type: '박사 연구주제', title: 'Agentic AI 및 다중 인공지능 에이전트 시스템의 행위효과와 책임귀속', note: '창발적 손해에 대한 계층적 책임귀속과 기능적 단위 법적 지위의 통합' },
        { type: '핵심 명제', title: 'AI의 비규범적 작동을 인간의 규범적 채무로 전환하려면 그 귀속은 정의로 정당화되어야 한다', note: '책임귀속을 단순한 정책선택이 아니라 규범적 정당화 문제로 다루는 연구의 중심 명제' }
      ]
    },
    {
      id: 'phd-research', order: '04', eyebrow: 'PHD RESEARCH', title: '박사과정 연구', status: '예정', tone: 'future',
      summary: '세부 논문·Working Paper·학술발표를 누적해 박사학위논문의 각 장과 논증축으로 발전시킵니다.',
      focus: ['세부논문 축적', '학회 검증', '판례·비교법 업데이트', '논증 통합'],
      deliverable: '세부 학술논문·Working Paper·박사논문 장별 초안',
      items: []
    },
    {
      id: 'dissertation', order: '05', eyebrow: 'DOCTORAL DISSERTATION', title: '박사학위논문', status: '최종 목표', tone: 'future',
      summary: '석사 단계에서 시작한 AI 책임귀속 연구를 하나의 독자적 법학 연구체계로 통합해 법학박사 학위논문으로 완성합니다.',
      focus: ['통합 책임귀속 모델', '규범적 정당화', '제도설계', '비교법', '입법·해석론'],
      deliverable: '법학박사 학위논문',
      items: []
    }
  ],
  knowledge: [
    { title: '법리·판례 연구', description: '실정법·판례·법적 추론과 논증을 체계화한 연구 기반', url: 'https://yehavha-legal-knowledge.danielie.workers.dev' },
    { title: '법철학·기본권 연구', description: '책임귀속·법적 지위·기본권·정의론·법적 논증의 이론 기반', url: 'https://yehavha-legal-philosophy.pages.dev/' },
    { title: 'AI 법·기술 선제연구', description: 'AI 기술 변화와 현행법·비교법·정책·입법대안을 연결하는 선제 연구', url: 'https://yehavha-ai-foresight-v2.pages.dev/' }
  ]
};
