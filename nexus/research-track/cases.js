window.RESEARCH_TRACK.updatedAt = '2026-08-28';

window.RESEARCH_CASES = [
  {
    id: 'agentic-ai-scam-2026',
    order: 'CASE 01',
    eyebrow: 'LEGAL CASE STUDY',
    title: '에이전틱 AI 기반 온라인 사기 자동화와 책임귀속',
    status: '원자료 검증',
    classification: '판례가 아니라 2026년에 확인된 범죄기술의 전환을 법학적 책임귀속 문제로 재구성한 사건형 연구자료입니다.',
    summary: '생성형 AI가 문구 작성·번역·딥페이크 제작을 보조하던 단계에서, Agentic AI가 피해자 탐색·다국어 대화·개인화 기망·후속 접촉·작업 실행을 연속적으로 수행하는 단계로 이동할 경우 기존의 인간 중심 책임법리가 어떤 방식으로 적용되고 어디에서 증명·귀속의 공백이 생기는지를 분석합니다.',
    focus: ['Agentic AI', '온라인 사기', '행위귀속', '형사책임', '민사책임', '로그·증명위험'],
    facts: [
      {
        title: '범죄 생애주기 전반의 AI 활용',
        text: 'TRM Labs의 2026 AI-in-Crime Adoption Index는 AI가 표적선정·기망·실행·자금세탁·현금화 등 범죄 생애주기의 여러 단계로 확장되고 있다고 분석합니다. 특히 사기 영역은 조사 대상 범죄유형 중 AI 도입 성숙도가 가장 높은 영역으로 평가됩니다.'
      },
      {
        title: '사기의 자동화·개인화',
        text: 'TRM Labs는 LLM을 이용하면 한 명의 운영자가 여러 언어로 다수 피해자와 설득력 있는 대화를 동시에 유지할 수 있고, 피해자의 언어·지역·대화 맥락에 맞춘 장기적 상호작용과 실시간 딥페이크 활용이 가능해지고 있다고 설명합니다.'
      },
      {
        title: '피해 규모의 확대',
        text: 'UNODC 2026 동남아시아 초국가적 조직범죄 위협평가는 2025년 동아시아·동남아시아·호주·뉴질랜드의 온라인 사기 손실을 약 883억~1,141억 달러로 추산하며, 사기·자금세탁·인신매매·데이터 수집 등이 공유 인프라를 이용하는 상호연결된 범죄 생태계로 발전하고 있다고 봅니다.'
      },
      {
        title: 'Agentic AI의 조직 대체 가능성',
        text: 'TRM Labs의 Jonno Newman은 SCMP 직접 인터뷰에서 범죄조직이 Agentic AI 에이전트 훈련에 투자하고 있으며, 하나의 봇이 종전 인간 운영자 여러 명의 업무를 대신할 경우 대규모 사기센터 없이도 원격 분산형 운영이 가능해질 수 있다고 경고했습니다.'
      }
    ],
    legalIssues: [
      {
        title: '행위효과와 책임귀속의 분리',
        text: 'AI가 피해자에게 허위정보를 제시하고 대화를 지속하여 재산처분을 유도했다는 사실상 작동과, 그 기망행위를 어느 인간 또는 조직의 법적 행위로 평가할 것인지는 분리해야 합니다. 범죄목적 설정, 권한 부여, 운영 통제, 위험 인식, 이익 귀속을 중심으로 귀속 연결고리를 검토합니다.'
      },
      {
        title: '형법 제347조 사기와 제347조의2 컴퓨터등사용사기의 구별',
        text: 'Agentic AI가 사람을 기망하여 피해자의 착오와 처분행위를 거쳐 재산을 취득하게 하는 구조라면 형법 제347조의 사기죄가 기본 출발점입니다. 반면 정보처리장치에 허위정보·부정한 명령을 입력하거나 권한 없이 정보를 입력·변경하여 정보처리 결과로 재산상 이익을 취득하는 경우에는 제347조의2의 적용 여부를 별도로 검토해야 합니다. AI가 사용됐다는 이유만으로 두 죄를 동일하게 취급하지 않습니다.'
      },
      {
        title: '인간 행위자의 고의·공모·방조와 AI 기능분해',
        text: '여러 AI 에이전트가 피해자 탐색, 메시지 작성, 신원위장, 결제 유도 등을 분담하더라도 그 기능분해 자체가 공동정범 관계를 구성하는 것은 아닙니다. 형사책임은 자연인 등 책임주체의 고의, 기능적 행위지배, 공모와 기여행위를 기준으로 판단해야 하며 AI 자체의 형사책임과 구별합니다.'
      },
      {
        title: '민법 제750조와 공급망 책임의 단계화',
        text: '사기 목적의 사용자·운영자에게는 고의의 위법행위와 손해 사이의 인과관계가 핵심이 됩니다. 개발자·모델 제공자·배포자·플랫폼 운영자까지 책임을 확장하려면 단순한 기술 제공 사실만으로는 부족하고, 구체적인 예견가능성, 위험통제 가능성, 주의의무 위반, 인과관계를 별도로 입증해야 합니다.'
      },
      {
        title: '피해구제 특별법의 적용범위',
        text: '통신사기피해환급법은 전기통신금융사기의 지급정지·채권소멸·피해환급 절차를 규율하므로 AI를 사용한 모든 사기에 자동 적용되는 일반법이 아닙니다. 구체적 범죄수법과 자금이동 방식이 법정 요건에 해당하는지를 먼저 확인해야 합니다.'
      },
      {
        title: '로그와 증명위험',
        text: 'Agentic AI에서는 최종 출력만으로 인간의 지시범위와 시스템의 자율적 선택을 구별하기 어렵습니다. 프롬프트, 시스템 지시, 에이전트별 역할, 도구 호출, 계정 권한, 모델·버전, 실행 로그, 외부 데이터 접근기록을 보존해야 행위경로와 통제가능성을 사후 재구성할 수 있습니다.'
      }
    ],
    researchLinks: [
      {
        title: '심화연구 연결',
        text: '이 사례는 단일 AI의 결과책임보다 Agentic AI의 다단계 실행과 인간 통제의 관계를 분석하는 자료로 사용합니다. 특히 행위효과와 책임귀속의 분리, 계층적 책임귀속, 증명위험 배분을 실제 범죄구조에 대입할 수 있습니다.'
      },
      {
        title: '다중 에이전트 확장',
        text: '표적선정 에이전트, 대화 에이전트, 딥페이크 에이전트, 결제·자금이동 에이전트가 상호작용하는 구조에서는 개별 출력보다 전체 워크플로의 기능적 결합과 각 단계의 인간 통제점을 식별하는 것이 중요합니다.'
      },
      {
        title: '기능적 단위 법적 지위의 한계 검증',
        text: '기능적 단위는 형사상 비난가능성을 AI에 부여하기 위한 개념이 아니라, 위험을 발생시키는 작동단위를 식별하고 로그·등록·책임재산·보험 등 책임실현 장치를 결합할 수 있는지 검증하는 법기술적 연구도구로 사용합니다.'
      }
    ],
    sources: [
      {
        type: '기관 원자료',
        title: 'TRM Labs · The 2026 AI-in-Crime Adoption Index',
        note: '2026.08.17. AI의 범죄 생애주기별 도입, 사기 자동화, 다국어 대화, 딥페이크 및 AI 관련 사기 증가를 분석한 TRM Labs 공식 보고서.',
        url: 'https://www.trmlabs.com/reports-and-whitepapers/the-2026-ai-in-crime-adoption-index'
      },
      {
        type: 'UN 원자료',
        title: 'UNODC · An Interconnected Criminal Ecosystem: Transnational Organized Crime Threat Assessment for South-East Asia 2026',
        note: '2026.07.21. 동남아시아의 사이버 기반 사기, 자금세탁, 인신매매, 데이터 수집 등이 결합한 초국가적 조직범죄 생태계를 다룬 UNODC 공식 위협평가.',
        url: 'https://www.unodc.org/roseap/uploads/documents/Publications/2026/TOCTA_South-East_Asia_2026.pdf'
      },
      {
        type: '직접 인터뷰 원문',
        title: 'South China Morning Post · Asia faces scam ‘epidemic’ threat as gangs exploit agentic AI',
        note: '2026.08.21. TRM Labs Jonno Newman의 Agentic AI 사기조직 활용 전망과 “한 봇이 여러 인간 운영자의 역할을 대체”할 수 있다는 직접 인터뷰 원문.',
        url: 'https://www.scmp.com/week-asia/economics/article/3364789/asia-faces-scam-epidemic-threat-gangs-exploit-agentic-ai-cybercrime-expert-warns'
      },
      {
        type: '법령 원문',
        title: '국가법령정보센터 · 형법 제347조·제347조의2',
        note: '사기와 컴퓨터등사용사기의 구성요건을 구별하기 위한 현행 법령 원문.',
        url: 'https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1022927943'
      },
      {
        type: '법령 원문',
        title: '국가법령정보센터 · 민법 제750조',
        note: '고의·과실, 위법행위, 손해, 인과관계를 중심으로 민사상 불법행위책임을 검토하기 위한 법령 원문.',
        url: 'https://www.law.go.kr/LSW/LsiJoLinkP.do?docType=JO&joNo=080000000&languageType=KO&lsNm=%EB%AF%BC%EB%B2%95&paras=1'
      },
      {
        type: '법령 원문',
        title: '국가법령정보센터 · 통신사기피해환급법',
        note: '전기통신금융사기의 지급정지·채권소멸·피해환급 절차와 적용범위를 확인하기 위한 현행 법령 원문.',
        url: 'https://law.go.kr/LSW/lsInfoP.do?ancYnChk=0&lsId=011359'
      }
    ],
    sourcePolicy: '재전재 기사와 포털 요약은 최종 연구출처에서 제외합니다. 사실관계와 통계는 기관 원자료를 우선하고, 전문가 발언은 직접 인터뷰 원문으로 확인하며, 법적 평가는 국가법령정보센터의 현행 법령 원문을 기준으로 분리합니다.'
  }
];