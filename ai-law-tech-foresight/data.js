window.AI_FORESIGHT_META = {
  title: 'AI 법·기술 선제연구 아카이브',
  subtitle: 'AI Law & Technology Foresight Archive',
  purpose: '기술이 등장한 뒤 법이 뒤따라가는 것이 아니라, 앞으로 발생할 법률문제를 미리 연구하고 대응 법리·거버넌스·입법대안을 준비한다.',
  researchFlow: ['기술','현행법','법적 쟁점','기존 법리 적용 가능성','법적 공백','비교법','정책','거버넌스','입법대안'],
  lawAxes: [
    '인공지능법','민사책임법','제조물책임법','소프트웨어법','개인정보·데이터법','저작권법','지식재산법','자율주행자동차법','로봇법','보험법','회사법·법인론','증명책임·소송법'
  ],
  jurisdictions: ['대한민국','EU','미국','영국','일본','중국','기타 주요 국가'],
  sourceTypes: ['법률','정책','규제','가이드라인','입법안','판례','학술논의'],
  gapTaxonomy: [
    '행위귀속 공백','책임귀속 공백','인과관계 문제','예견가능성','다중 에이전트 책임분산','창발적 손해','증명곤란','로그 접근','설명가능성','책임재산','보험','기능적 법적 지위'
  ],
  policyOptions: [
    '현행법 해석으로 해결','기존 법률 개정','특별법','등록제도','책임관리인','로그보존 의무','보험','공탁','책임재산','증명책임 조정','기능적 단위의 법적 지위','제한적 소송상 지위'
  ],
  phdTags: ['행위효과','책임귀속','Agentic AI','Multi-Agent','창발적 손해','계층적 책임귀속','증명위험','기능적 단위','입법론'],
  thesisLineage: {
    master: { label: '석사논문', status: '공식 공개 링크 확인 후 연결', url: null },
    path: ['석사논문','후속 연구','Agentic AI','Multi-Agent AI','박사논문 연구']
  }
};

window.AI_FORESIGHT_RECORDS = [
  {
    id:'ai-foundations', order:1, title:'인공지능 기본개념', en:'Artificial Intelligence Foundations', stage:'현재 기술', maturity:'기반',
    summary:'AI를 단순 소프트웨어가 아니라 입력·모델·출력·배치환경·인간감독이 결합된 기능적 시스템으로 파악하는 출발점이다.',
    tech:['규칙기반 시스템','통계적 학습','추론','분류·예측','자동화된 의사결정'],
    currentLaw:['인공지능 발전과 신뢰 기반 조성 등에 관한 기본법','민법','개인정보 보호법','소프트웨어 진흥법'],
    issues:['AI 시스템의 법적 단위 설정','자동화 수준과 인간 통제의 경계','설명·투명성 의무의 대상','위험분류와 책임주체 특정'],
    doctrine:['과실책임과 주의의무','위험원 지배','사용자·운영자 책임','행정법상 자동적 처분'],
    gaps:['기능적 시스템 단위의 불명확성','개발·배치·운영 주체의 책임경계'],
    comparative:['EU 위험기반 AI 규율','미국 분야별·기관별 규율','영국 원칙기반 접근'],
    policy:['위험기반 분류','책임주체 매핑','시스템 문서화'], governance:['모델카드·시스템카드','변경이력','인간감독 체계'], legislation:['용어·책임주체 정의 정교화','고위험 영역별 특별규정'],
    phdTags:['행위효과','책임귀속','기능적 단위','입법론']
  },
  {
    id:'machine-learning', order:2, title:'머신러닝', en:'Machine Learning', stage:'현재 기술', maturity:'성숙',
    summary:'데이터에서 규칙을 학습하는 시스템은 전통적 프로그램과 달리 성능·편향·오류가 데이터와 학습과정에 의존한다.',
    tech:['지도학습','비지도학습','강화학습','모델평가','데이터 드리프트'],
    currentLaw:['개인정보 보호법','신용정보법','소비자기본법','민법'],
    issues:['학습데이터 적법성','편향과 차별','성능저하의 예견가능성','모델 변경 후 책임'],
    doctrine:['개인정보 처리원칙','평등원칙','과실·인과관계','설명의무'],
    gaps:['데이터 드리프트에 대한 지속적 의무','학습과정의 증명곤란'],
    comparative:['EU 데이터 거버넌스·고위험 AI 요구','미국 알고리즘 차별 규율 논의'],
    policy:['데이터 계보관리','성능모니터링'], governance:['학습데이터 기록','편향 테스트','재학습 승인'], legislation:['중대한 모델변경 통지·기록의무'],
    phdTags:['책임귀속','증명위험','입법론']
  },
  {
    id:'generative-ai', order:3, title:'생성형 AI', en:'Generative AI', stage:'현재 기술', maturity:'급속 확산',
    summary:'텍스트·이미지·음성·코드 등을 생성하는 시스템은 학습데이터 권리, 허위정보, 생성물 귀속과 신뢰성 문제를 동시에 발생시킨다.',
    tech:['텍스트 생성','이미지 생성','음성 생성','코드 생성','합성콘텐츠'],
    currentLaw:['인공지능기본법','저작권법','개인정보 보호법','표시·광고의 공정화에 관한 법률','전자상거래법'],
    issues:['AI 학습과 저작권 제한','생성물의 인간 창작성','딥페이크·합성콘텐츠 표시','환각에 의한 허위 안내'],
    doctrine:['공정이용','저작물성','기망행위','불법행위'],
    gaps:['대규모 학습의 권리처리 기준','개인별 생성출력의 증거보전'],
    comparative:['EU 생성형 AI 투명성','미국 저작권청 AI 연구','각국 딥페이크 규율'],
    policy:['생성물 고지','출처·학습정책 투명성'], governance:['콘텐츠 필터','출력로그','고위험 사용 제한'], legislation:['권리자 선택권·보상체계 검토','합성콘텐츠 표시 정교화'],
    phdTags:['행위효과','책임귀속','증명위험','입법론']
  },
  {
    id:'llm', order:4, title:'LLM', en:'Large Language Models', stage:'현재 기술', maturity:'급속 고도화',
    summary:'대규모 언어모델은 범용 기반모델로서 다수 서비스의 공통 인프라가 되면서 기초모델 제공자와 최종 배치자의 책임분담을 어렵게 한다.',
    tech:['Foundation Model','Transformer','RAG','Fine-tuning','Tool Use'],
    currentLaw:['인공지능기본법','민법','저작권법','개인정보 보호법','영업비밀·계약법'],
    issues:['기초모델과 응용서비스 책임분리','RAG 원천자료 오류','파인튜닝 이후 통제권 변화','프롬프트·출력의 기밀성'],
    doctrine:['공동불법행위','도급·위탁 책임','계약상 안전의무','정보제공의무'],
    gaps:['기초모델-통합자-배치자 계층책임 기준','모델 내부 원인경로 입증'],
    comparative:['EU GPAI 규율','미국 모델 안전평가 정책논의'],
    policy:['공급망 책임지도','모델·데이터 문서화'], governance:['모델 버전관리','RAG 출처관리','도구권한 제한'], legislation:['기초모델과 배치자 의무의 계층화'],
    phdTags:['책임귀속','계층적 책임귀속','증명위험','기능적 단위']
  },
  {
    id:'ai-agent', order:5, title:'AI Agent', en:'AI Agent', stage:'현재·확장 기술', maturity:'확산 초기',
    summary:'AI Agent는 목표를 받아 계획하고 외부 도구를 호출하며 연속행동을 수행하므로 단일 출력보다 행위효과와 권한관리 문제가 중심이 된다.',
    tech:['Planning','Memory','Tool Calling','API Action','Browser/Computer Use'],
    currentLaw:['민법','전자문서·전자거래법제','개인정보 보호법','정보통신·보안법제','계약법'],
    issues:['에이전트의 계약·결제·전송 행위 귀속','권한 초과','기억·로그의 개인정보','외부도구 오작동'],
    doctrine:['대리·표현대리 유추 가능성','사용자 과실','전자적 의사표시','위험원 지배'],
    gaps:['자율행위의 법적 귀속기준','에이전트 권한등록·취소 체계'],
    comparative:['EU AI 규율과 에이전트형 시스템의 포섭 논의','미국 사업자별 Agent 안전정책'],
    policy:['권한최소화','행위승인 단계화'], governance:['권한 토큰','행위로그','중요행위 인간승인'], legislation:['에이전트 행위로그·권한관리 의무','고위험 행위 사전승인'],
    phdTags:['행위효과','책임귀속','Agentic AI','기능적 단위','증명위험']
  },
  {
    id:'agentic-ai', order:6, title:'Agentic AI', en:'Agentic AI', stage:'확장 기술', maturity:'발전 중',
    summary:'Agentic AI는 장기목표를 분해하고 환경에 적응하며 스스로 다음 행동을 선택한다는 점에서 정적 AI보다 자율성·예견가능성·감독가능성 문제가 커진다.',
    tech:['Autonomous Planning','Long-horizon Tasks','Self-correction','Dynamic Tool Use'],
    currentLaw:['민법','인공지능기본법','회사법·내부통제','개인정보 보호법','보험법'],
    issues:['장기행동의 예견가능성','인간감독의 실효성','기업 내부통제와 AI 위임','자율행위의 취소·중단'],
    doctrine:['선관주의의무','내부통제의무','과실과 예견가능성','공동불법행위'],
    gaps:['자율성 증가에 따른 주의의무 기준','중간행위의 책임단위','사후 로그재구성'],
    comparative:['EU 고위험 AI·GPAI 구조의 적용가능성','미국 Agent 안전·평가 프레임 논의'],
    policy:['자율성 등급','중요행위 승인','킬스위치'], governance:['감독자 지정','행위예산·권한한도','감사로그'], legislation:['책임관리인','로그보존','고자율 시스템 등록제 검토'],
    phdTags:['행위효과','책임귀속','Agentic AI','계층적 책임귀속','기능적 단위','입법론']
  },
  {
    id:'multi-agent', order:7, title:'Multi-Agent System', en:'Multi-Agent Systems', stage:'확장 기술', maturity:'연구·도입 확대',
    summary:'복수 AI 에이전트가 역할을 분담·협상·경쟁하며 결과를 만들어내면 개별 행위의 합으로 설명되지 않는 창발적 손해와 책임분산이 문제된다.',
    tech:['Agent Collaboration','Agent Negotiation','Orchestration','Emergence','Distributed Decision'],
    currentLaw:['민법상 공동불법행위','회사법','제품·소프트웨어 책임','증명책임·소송법','보험법'],
    issues:['복수 에이전트 행위효과의 귀속','오케스트레이터 책임','창발적 손해','복수 사업자 구상'],
    doctrine:['공동불법행위','인과관계 경합','사용자·관리자 책임','위험분담'],
    gaps:['개별 원인 특정 불가능성','계층적 책임귀속 기준','다중 로그 접근권'],
    comparative:['분산시스템 책임 논의','EU 공급망·배치자 의무와의 비교'],
    policy:['에이전트 식별자','역할·권한 명시','공동 로그'], governance:['오케스트레이터 감사','상호작용 기록','에이전트 격리'], legislation:['증명책임 조정','공동책임·구상기준','기능적 단위 책임재산 검토'],
    phdTags:['책임귀속','Multi-Agent','창발적 손해','계층적 책임귀속','증명위험','기능적 단위']
  },
  {
    id:'physical-ai', order:8, title:'Physical AI', en:'Physical AI', stage:'확장 기술', maturity:'산업 확장',
    summary:'AI가 센서·구동계·로봇을 통해 현실세계에 직접 물리적 효과를 발생시키면 소프트웨어 오류가 신체·재산 손해로 전환된다.',
    tech:['Embodied AI','Sensors','Actuators','Vision-Language-Action','Edge AI'],
    currentLaw:['제조물책임법','민법','산업안전보건법','지능형로봇법','개인정보 보호법'],
    issues:['소프트웨어와 하드웨어 결함의 결합','실시간 환경인지 오류','사이버보안과 물리안전','현장 운영자의 개입가능성'],
    doctrine:['제조물 결함','과실·인과관계','시설·작업장 안전의무'],
    gaps:['지속학습 로봇의 결함 판단시점','소프트웨어 공급망 책임'],
    comparative:['EU 기계·제품안전 및 AI 규율의 결합','미국 로봇·산업안전 기준'],
    policy:['안전모드','위험영역 제한'], governance:['센서·행동로그','업데이트 승인','현장 정지권'], legislation:['지속학습 로봇 변경관리','고위험 물리 AI 보험 검토'],
    phdTags:['행위효과','책임귀속','증명위험','기능적 단위']
  },
  {
    id:'autonomous-driving', order:9, title:'자율주행', en:'Autonomous Driving', stage:'현재·확장 기술', maturity:'상용화 진행',
    summary:'자율주행은 피해자 보상, 운행자 책임, 운전자 개입, 제조물 결함, 소프트웨어 업데이트와 사고로그를 동시에 분석해야 하는 대표적 복합 AI 법제다.',
    tech:['ADS','ADAS','ODD','Sensor Fusion','Remote Operation'],
    currentLaw:['자동차손해배상 보장법','자동차관리법','자율주행자동차 상용화 촉진 및 지원에 관한 법률','도로교통법','제조물책임법','개인정보 보호법'],
    issues:['운행자 1차 보상과 제조사 구상','제어권 전환','ODD 이탈','센서·지도·통신 복합원인','사고로그 접근'],
    doctrine:['운행자책임','제조물 결함','과실상계','공동불법행위'],
    gaps:['고도자율화에서 운전자 개념','복수 기술사업자의 인과관계','로그 미보존 시 증명위험'],
    comparative:['미국 ADS 사고보고·차량안전 규제','EU 차량형식승인·AI 규율 연계'],
    policy:['사고로그 표준화','원격운영 책임기준'], governance:['ODD 기록','제어권 전환기록','OTA 변경관리'], legislation:['로그보존·접근권','보험자 구상기준 정교화'],
    phdTags:['책임귀속','계층적 책임귀속','증명위험','입법론']
  },
  {
    id:'robots-humanoids', order:10, title:'로봇·휴머노이드', en:'Robots & Humanoids', stage:'확장 기술', maturity:'실증·산업화',
    summary:'휴머노이드와 서비스로봇은 사람의 생활공간에서 이동·조작·대화를 결합하므로 안전·프라이버시·대리행위·책임재산 문제가 결합된다.',
    tech:['Humanoid Robotics','Service Robots','Mobile Manipulation','Social Robotics'],
    currentLaw:['지능형 로봇 개발 및 보급 촉진법','제조물책임법','민법','도로교통법','개인정보 보호법'],
    issues:['보행공간 안전','인간과의 접촉손해','상시 촬영·음성수집','로봇의 구매·예약·업무행위'],
    doctrine:['제조물책임','시설·운영자 과실','개인정보 처리','대리·의사표시'],
    gaps:['범용 휴머노이드의 책임주체','서비스 간 권한이동','책임재산의 독립성'],
    comparative:['일본 로봇정책·안전기준','EU 제품안전·AI 규율'],
    policy:['사용영역별 안전등급','운영자 교육'], governance:['행동제한','프라이버시 모드','사고기록'], legislation:['고위험 로봇 등록·보험 검토','책임관리인 제도 검토'],
    phdTags:['행위효과','책임귀속','기능적 단위','입법론']
  },
  {
    id:'human-ai-integration', order:11, title:'인간-AI 결합', en:'Human-AI Integration', stage:'미래 확장', maturity:'초기·분야별 상이',
    summary:'웨어러블·뇌-컴퓨터 인터페이스·인지보조 AI가 인간의 판단과 신체기능에 결합되면 자율성·동의·신체정보·능력증강의 법적 경계가 재설정될 수 있다.',
    tech:['Wearable AI','BCI','Cognitive Assistants','Augmentation'],
    currentLaw:['헌법상 인간의 존엄·자기결정','개인정보 보호법','의료기기·보건의료법','민법'],
    issues:['뇌·생체정보의 보호','AI 보조결정과 인간의사 귀속','의료와 능력증강의 경계','고용·보험 차별'],
    doctrine:['자기결정권','민감정보 보호','의료동의','차별금지 원리'],
    gaps:['신경정보 특수성','AI 증강 인간의 의사능력 평가','업무상 강제사용'],
    comparative:['EU·미국 신경기술 윤리·규제논의','칠레 등 neurorights 논의 참고'],
    policy:['신경정보 별도 보호','강제사용 금지'], governance:['동의철회','데이터 분리','인간 최종통제'], legislation:['신경정보 보호특례 검토','고위험 증강기기 책임기준'],
    phdTags:['행위효과','책임귀속','입법론']
  },
  {
    id:'transhumanism', order:12, title:'Transhumanism', en:'Transhumanism', stage:'기술예측·시나리오', maturity:'규범 시나리오',
    summary:'인간 능력의 지속적 기술증강이 사회제도로 확산되는 상황을 전제로 인간개념, 평등, 신체·인지 강화의 정당성과 권리구조를 선제적으로 검토한다.',
    tech:['Human Enhancement','Longevity Tech','Neurotechnology','Bio-Digital Integration'],
    currentLaw:['헌법','의료법제','생명윤리법제','개인정보 보호법','노동·보험법제'],
    issues:['강화 접근의 불평등','정상성 개념','동의와 사회적 압력','강화된 능력의 법적 평가'],
    doctrine:['인간의 존엄','평등원칙','자기결정권','사회국가 원리'],
    gaps:['강화와 치료의 법적 경계','강화 능력에 따른 의무·책임 차등 가능성'],
    comparative:['유럽 인권·생명윤리 논의','미국 생명윤리·증강 논의'],
    policy:['시나리오 기반 영향평가','접근격차 관리'], governance:['윤리위원회','장기추적'], legislation:['치료/강화 구분기준','차별·강제사용 방지규정 검토'],
    phdTags:['행위효과','책임귀속','입법론'], scenarioNote:'현존 기술의 확정적 미래가 아니라 규범적 시나리오로 취급한다.'
  },
  {
    id:'agi', order:13, title:'AGI', en:'Artificial General Intelligence', stage:'기술예측·시나리오', maturity:'불확실',
    summary:'광범위한 인지과제를 인간 수준 이상으로 수행하는 일반지능형 시스템을 가정한 선제 규범연구다. 등장 시기와 성능은 사실로 단정하지 않는다.',
    tech:['General-purpose Reasoning','Cross-domain Learning','Autonomous Goal Pursuit'],
    currentLaw:['인공지능기본법','민법','회사법·법인론','보험법','증명책임·소송법'],
    issues:['광범위한 행위권한','예견가능성의 급감','감독가능성','책임주체와 책임재산','중단·통제권'],
    doctrine:['위험책임 입법론','법인격·법적 지위론','신탁·관리자 모델','증명책임 조정'],
    gaps:['기존 인간행위자 중심 책임구조의 한계','독립적 책임재산·소송상 지위 문제','초대형 위험의 보험가능성'],
    comparative:['국가별 frontier AI·고급 AI 안전정책','국제적 안전거버넌스 논의'],
    policy:['능력평가 임계값','배치허가·등록','비상중단'], governance:['독립 안전평가','책임관리인','감사·로그'], legislation:['기능적 단위 법적 지위','책임재산·공탁','제한적 소송상 지위 검토'],
    phdTags:['행위효과','책임귀속','Agentic AI','창발적 손해','증명위험','기능적 단위','입법론'], scenarioNote:'AGI의 도달 시기는 예측치·시나리오로만 기록하며 사실처럼 단정하지 않는다.'
  },
  {
    id:'asi', order:14, title:'ASI', en:'Artificial Superintelligence', stage:'기술예측·시나리오', maturity:'가상·장기 시나리오',
    summary:'인간의 광범위한 인지능력을 현저히 초과하는 시스템을 가정해 극단적 자율성·통제·책임·국제거버넌스 문제를 스트레스 테스트한다.',
    tech:['Superhuman General Capability','Recursive Improvement Scenario','Strategic Autonomy'],
    currentLaw:['헌법·국가안전법제','인공지능법','민사책임법','회사법·법인론','국제법·거버넌스'],
    issues:['통제불가능 위험','국경을 넘는 행위효과','인간 감독의 실질성','초대형 손해와 책임재산','국제적 규제경쟁'],
    doctrine:['예방원칙','국가의 보호의무','위험책임·기금 모델','국제협력'],
    gaps:['현행 사법책임만으로 처리하기 어려운 시스템 위험','국제적 감독·집행 공백'],
    comparative:['국제 AI 안전기구·조약 모델의 가능성','핵·금융·항공 등 고위험 국제규제 비교'],
    policy:['국제 등록·평가','배치 제한 시나리오','사고기금'], governance:['다자 감독','독립 평가','컴퓨트·배치 통제 시나리오'], legislation:['특별법·국제협정','책임기금·보험·공탁','기능적 법적 지위의 한계 검토'],
    phdTags:['책임귀속','창발적 손해','증명위험','기능적 단위','입법론'], scenarioNote:'ASI는 현재 확인된 사실이 아니라 장기 기술예측·규범 스트레스테스트 시나리오다.'
  }
];
