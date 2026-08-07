(function(){
  const data = window.LEGAL_KNOWLEDGE || [];
  const aiAreas = new Set([
    '헌법·AI 기본규제','민사책임·소비자법','데이터·플랫폼법','모빌리티·로봇법','보건의료·AI','지식재산·AI','AI 산업·융합법'
  ]);

  const official = {
    aiAct:[
      {label:'대한민국 인공지능기본법 제34조 · 국가법령정보센터',url:'https://law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1031810845'},
      {label:'대한민국 인공지능기본법 제35조 · 국가법령정보센터',url:'https://www.law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1031810855'},
      {label:'EU AI Act Regulation (EU) 2024/1689 · EUR-Lex',url:'https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng'}
    ],
    product:[
      {label:'EU Product Liability Directive (EU) 2024/2853 · EUR-Lex',url:'https://eur-lex.europa.eu/eli/dir/2024/2853/oj/eng'}
    ],
    privacy:[
      {label:'EDPB Automated decision-making and profiling guideline',url:'https://www.edpb.europa.eu/documents/guideline/automated-decision-making-and-profiling_en'},
      {label:'EU AI Act · EUR-Lex',url:'https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng'}
    ],
    mobility:[
      {label:'국토교통부 자율주행자동차 영상정보의 안전성 확보 조치',url:'https://www.molit.go.kr/USR/I0204/m_45/dtl.jsp?idx=18882'},
      {label:'NHTSA Standing General Order on ADS/ADAS crash reporting',url:'https://www.nhtsa.gov/laws-regulations/standing-general-order-crash-reporting'}
    ],
    aviation:[
      {label:'FAA Small UAS Regulations Part 107',url:'https://www.faa.gov/newsroom/small-unmanned-aircraft-systems-uas-regulations-part-107'}
    ],
    medical:[
      {label:'식품의약품안전처 2026 디지털의료제품 안전관리 시행계획',url:'https://www.mfds.go.kr/brd/m_218/view.do?seq=33707'},
      {label:'FDA Digital Health Guidance Collection',url:'https://www.fda.gov/medical-devices/digital-health-center-excellence/guidances-digital-health-content'},
      {label:'FDA AI-Enabled Device Software Functions Lifecycle Guidance',url:'https://www.fda.gov/news-events/press-announcements/fda-issues-comprehensive-draft-guidance-developers-artificial-intelligence-enabled-medical-devices'}
    ],
    patent:[
      {label:'USPTO Revised Inventorship Guidance for AI-Assisted Inventions (2025)',url:'https://www.uspto.gov/subscription-center/2025/revised-inventorship-guidance-ai-assisted-inventions'}
    ],
    copyright:[
      {label:'U.S. Copyright Office Artificial Intelligence Study',url:'https://www.copyright.gov/policy/artificial-intelligence/'},
      {label:'U.S. Copyright Office Part 3 — Generative AI Training',url:'https://www.copyright.gov/ai/Copyright-and-Artificial-Intelligence-Part-3-Generative-AI-Training-Report-Pre-Publication-Version.pdf'}
    ]
  };

  function has(s, words){ return words.some(w => (s||'').includes(w)); }
  function appendSources(item, arr){
    const current=item.sources||[];
    const seen=new Set(current.map(x=>x.url));
    arr.forEach(x=>{if(!seen.has(x.url)){current.push(x);seen.add(x.url);}});
    item.sources=current;
    item.officialGuidance=(item.officialGuidance||[]);
    const gseen=new Set(item.officialGuidance.map(x=>x.url));
    arr.forEach(x=>{if(!gseen.has(x.url)){item.officialGuidance.push(x);gseen.add(x.url);}});
  }

  function commonEvidence(item){
    return [
      '적용 시점의 시스템 버전·모델 식별자·배포환경과 변경이력을 보존한다.',
      '입력데이터·프롬프트·센서정보·출력·후처리·사람의 승인 또는 개입을 시간순으로 연결한 로그를 확보한다.',
      '개발자·통합자·배치자·운영자 중 누가 해당 위험을 통제하고 관련 정보를 보유했는지 역할별로 구분한다.',
      '사고 또는 권리침해 직전의 경고·모니터링·업데이트·우회 또는 인간개입 기록을 확보하여 예견가능성과 회피가능성을 검토한다.',
      '로그가 삭제·요약·비식별화되었거나 사업자에게 편재된 경우 문서제출·입증방해·증명책임 조정 문제를 별도로 검토한다.'
    ];
  }

  function refineFoundation(item){
    item.doctrineDebate = has(item.title,['헌법','기본권'])
      ? 'AI 규율의 헌법적 쟁점은 기술중립적 일반 기본권 심사로 충분하다는 접근과, 자동화·규모·불투명성·집단적 차별이라는 AI 특유의 위험 때문에 강화된 절차적 통제와 설명·이의제기 구조가 필요하다는 접근이 대립한다. 전자는 과잉규제를 경계하고 후자는 정보비대칭과 권력집중을 중시한다. 실제 심사에서는 평등권·개인정보자기결정권·표현의 자유·직업의 자유·적법절차를 개별적으로 분해한 뒤 비례원칙과 절차적 보장을 함께 검토하는 것이 타당하다.'
      : '인공지능기본법의 위험기반 규율은 사전에 규제대상을 명확히 분류해야 예측가능성이 확보된다는 견해와, 기술·용도 변화가 빠르므로 형식적 분류보다 실제 기능·위험과 지속적 모니터링을 중시해야 한다는 견해가 긴장한다. 고영향성 판단, 설명가능성, 인간감독, 문서보관은 서로 독립된 의무가 아니라 실제 통제가능성과 책임추적성을 확보하는 하나의 체계로 이해할 필요가 있다.';
    item.comparativeLaw = 'EU AI Act는 고위험 AI를 제품안전 연계형과 Annex III 사용영역형으로 분류하고 위험관리, 데이터 거버넌스, 기술문서, 로그, 투명성, 인간감독, 정확성·견고성·사이버보안 및 공급자·배치자 의무를 법정 구조로 결합한다. 한국 인공지능기본법은 고영향 AI와 일정 규모 이상의 최첨단 AI에 별도의 책무를 두므로, EU의 high-risk/GPAI/systemic-risk 구조와 일대일 대응시키지 말고 규율목적과 의무주체를 비교해야 한다.';
    item.crossLawConflict = has(item.title,['공공','행정','자동'])
      ? '공공기관의 AI 활용은 인공지능기본법만으로 끝나지 않는다. 행정기본법상 자동적 처분의 허용범위, 개인정보 보호법상 자동화된 결정과 개인정보 처리, 행정절차법상 이유제시·의견제출, 행정소송법상 처분성·원고적격·취소사유가 중첩될 수 있다. 사전 영향평가가 이루어졌다는 사실이 개별 처분의 위법성을 자동으로 치유하지는 않는다.'
      : '인공지능기본법상 안전·설명·감독·문서화 의무는 개인정보 보호법, 소비자법, 제조물책임법, 의료·교통 등 분야별 안전법의 의무를 대체하는 일반 면책규정이 아니다. 동일 시스템에 복수 법률이 적용될 경우 각 법률의 보호법익, 의무주체, 위반효과와 중복이행 인정조항을 분리하여 판단해야 한다.';
    item.proofIssues = commonEvidence(item).concat([
      '고영향 AI 해당 여부의 내부 분류자료, 위험평가표, 인간감독 설계와 실제 감독기록을 확보한다.',
      '설명 의무가 문제되면 실제 이용자에게 제공된 설명과 내부 모델 문서·학습데이터 개요 사이의 차이를 확인한다.'
    ]);
    item.adjacentCaseLaw = '신설 인공지능기본법 자체의 축적된 대법원 판례가 없는 쟁점에서는 존재하지 않는 판례를 만들지 않는다. 대신 헌법재판소의 비례원칙·평등원칙·개인정보자기결정권, 대법원의 행정처분 이유제시·재량통제·국가배상 법리를 인접법리로 사용하고, 시행령·고시·정부 공식 가이드라인을 우선한다.';
    item.hardVariations = (item.hardVariations||[]).concat([
      `${item.title} 적용대상 여부가 불명확한 AI가 채용·신용·복지 판단을 동시에 수행하고 공급자와 이용사업자가 서로 고영향 AI 해당성 판단을 상대방에게 미룬 경우 의무주체와 책임을 어떻게 배분할 것인가.`,
      `기본모델은 해외에서 개발되고 국내 사업자가 파인튜닝·RAG·에이전트 기능을 결합한 뒤 중요한 결정을 자동화한 경우, 원모델 제공자·국내 통합자·배치기관의 위험평가·설명·문서화 의무와 민사책임을 어떻게 연결할 것인가.`,
      `법정 영향평가나 위험관리 문서는 형식적으로 존재하지만 실제 운영로그가 문서의 전제와 다른 경우, 규제준수 사실의 증명력과 과실·인과관계 판단에 어떤 의미를 부여할 것인가.`
    ]);
    appendSources(item, official.aiAct);
  }

  function refineLiability(item){
    item.doctrineDebate = has(item.title,['제조물','제품'])
      ? 'AI 손해를 제조물책임으로 다룰 때 핵심 대립은 현행 제조물 개념을 하드웨어에 탑재된 소프트웨어까지 기능적으로 포섭할 수 있는 범위와 독립형 소프트웨어·클라우드 AI까지 포함하려면 입법이 필요한 범위를 어디에서 나눌지에 있다. 결함 판단도 출시시점 정적 안전성만 볼 것인지, 업데이트·학습·사이버보안·사후모니터링까지 제조자의 통제범위로 볼 것인지가 쟁점이다.'
      : 'AI 불법행위책임은 전통적 과실책임으로 충분하다는 견해, 위험을 창출·통제하고 정보와 보험능력을 보유한 자에게 강화된 주의의무나 위험책임을 배분해야 한다는 견해, 기능적 단위별로 개발·통합·배치·운용 책임을 계층화해야 한다는 견해가 대립한다. 결과의 예측곤란성을 곧바로 무책임으로 연결해서는 안 되고, 통제가능성과 정보지배를 중심으로 구체적 의무를 특정해야 한다.';
    item.comparativeLaw = 'EU Product Liability Directive 2024/2853은 소프트웨어와 AI 시스템을 제품 개념에 명시적으로 포함하고, 제조자 통제 아래의 업데이트·업그레이드·관련 서비스와 일부 증거접근·인과관계 추정 구조를 디지털 제품에 맞게 조정하였다. 이는 현행 한국 제조물책임법의 제조·가공된 동산 중심 정의와 비교할 때 독립형 소프트웨어와 지속 업데이트 AI를 어떻게 규율할지 입법론적 비교축을 제공한다.';
    item.crossLawConflict = '하나의 AI 사고에서 민법 제750조 과실책임, 사용자·도급·공동불법행위, 제조물책임법, 인공지능기본법상 위험관리·문서화, 분야별 안전법과 보험·구상관계가 동시에 문제될 수 있다. 규제법 위반을 민사책임의 자동 성립요건으로 보지 말고, 해당 의무가 보호하려는 위험이 현실화되었는지를 과실·위법성·인과관계에서 각각 평가한다.';
    item.proofIssues = commonEvidence(item).concat([
      '결함 또는 과실을 주장하는 측이 접근하기 어려운 모델 버전, 업데이트 기록, 테스트 결과, 알려진 사고·취약점 자료의 편재를 확인한다.',
      '다중 에이전트·복수 사업자 환경에서는 손해 발생에 기여한 각 기능단위의 로그와 통제권을 연결하여 공동불법행위 또는 구상관계를 검토한다.'
    ]);
    item.adjacentCaseLaw = 'AI 자체에 대한 확립된 대법원 책임판례가 없는 영역은 기존 제조물 결함·경고상 결함·인과관계, 의료·자동차·시설안전 관련 과실판례의 판단요소를 인접법리로 활용하되 사실관계 차이를 명시해야 한다.';
    item.hardVariations = (item.hardVariations||[]).concat([
      `${item.title} 사안에서 사고 전날 공급자가 안전패치를 배포했지만 운영자가 자동업데이트를 비활성화한 경우 제조자·운영자의 책임과 구상비율을 어떻게 정할 것인가.`,
      `기초모델·에이전트 오케스트레이터·센서모듈·최종 서비스가 각각 다른 사업자에 의해 공급되고 어느 한 구성의 단독 결함으로 손해를 설명하기 어려운 경우 공동원인과 증명책임을 어떻게 처리할 것인가.`,
      `사업자가 핵심 로그를 법정 보존기간 전에 삭제하여 정확한 인과경로 확인이 불가능해진 경우 문서보관의무 위반과 입증방해를 민사상 인과관계 판단에 어느 정도 반영할 것인가.`
    ]);
    appendSources(item, official.product.concat(official.aiAct));
  }

  function refineDataConsumer(item){
    const privacy=has(item.subfield,['개인정보','신용정보','위치정보'])||has(item.title,['개인정보','자동화','가명','신용','위치']);
    item.doctrineDebate = privacy
      ? '데이터·자동화 규율에서는 정보주체의 자기결정·설명·거부권을 강하게 보장해야 한다는 견해와, 복잡한 모델의 완전한 내부설명은 기술적으로 어렵고 영업비밀·보안·제3자 권리와 충돌하므로 결정에 영향을 준 주요 기준과 이의제기 가능성 중심의 기능적 설명으로 충분하다는 견해가 대립한다. 가명정보 활용에서도 혁신을 위한 2차 이용과 재식별·목적외 이용 위험 사이의 균형이 핵심이다.'
      : 'AI 소비자·플랫폼 규율에서는 기존의 기만행위·표시광고·전자상거래 규칙으로 충분하다는 견해와, 개인화·생성형 대화·다크패턴·합성후기처럼 소비자별로 내용이 달라지는 AI 환경에서는 기록의무와 알고리즘적 책임을 강화해야 한다는 견해가 대립한다. 판단기준은 AI 사용 자체보다 평균적 또는 취약 소비자의 거래결정이 왜곡되는 방식과 사업자의 통제가능성이다.';
    item.comparativeLaw = privacy
      ? 'EU에서는 GDPR의 자동화된 의사결정·프로파일링 규율과 EU AI Act의 고위험 AI 투명성·인간감독·기록의무가 병존한다. 동일한 자동화 판단이라도 개인정보법은 정보주체 권리와 처리근거를, AI Act는 시스템 위험과 공급자·배치자 의무를 중심으로 보므로 두 규제를 기능적으로 구별해야 한다.'
      : 'EU AI Act는 사람과 상호작용하는 AI와 딥페이크 등 특정 합성콘텐츠에 투명성 의무를 두고, 일반 소비자법은 기만·불공정 상관행을 별도로 통제한다. 미국 FTC도 AI라는 명칭과 관계없이 허위·기만적 주장과 소비자피해를 기존 소비자보호 권한으로 다루므로, 기술특별법과 일반 소비자법의 병존이 비교법상 공통적인 특징이다.';
    item.crossLawConflict = privacy
      ? '개인정보 보호법·신용정보법·위치정보법의 특별규정과 인공지능기본법의 설명·위험관리, 전자상거래·소비자법, 영업비밀 보호가 동시에 문제될 수 있다. 설명요구에 응하기 위해 타인의 개인정보·영업비밀을 과도하게 공개해서도 안 되므로 설명범위와 비공개 정보의 조정이 필요하다.'
      : '전자상거래법·표시광고법·소비자기본법·공정거래법과 개인정보 보호법이 중첩된다. 개인화된 허위 추천은 기만행위이면서 개인정보 프로파일링 문제일 수 있고, 플랫폼이 제3자 판매자의 AI 도구를 제공한 경우 통신판매중개자의 의무와 직접 기만행위 책임을 구분해야 한다.';
    item.proofIssues = commonEvidence(item).concat(privacy ? [
      '자동화된 결정에 사용된 데이터 항목, 프로파일링 변수, 임계값 또는 주요 판단기준과 인간 재검토 기록을 확보한다.',
      '가명처리의 경우 원본과 가명정보의 연결가능성, 추가정보 분리·접근통제, 재식별 시도와 제3자 결합 가능성을 검증한다.'
    ] : [
      '소비자에게 실제 노출된 화면·대화·추천·가격·후기의 시점별 버전을 보존하고 A/B 테스트·개인화 로직과 연결한다.',
      '합성후기·챗봇 안내가 사업자 승인 콘텐츠인지 제3자 생성물인지, 사업자가 오류를 알게 된 후 수정·차단했는지 확인한다.'
    ]);
    item.adjacentCaseLaw = 'AI 특화 판례가 축적되지 않은 부분은 개인정보·신용평가·표시광고·전자상거래의 기존 판례와 개인정보보호위원회 등 감독기관의 공식 결정·가이드라인을 인접자료로 사용한다. 해외 자료는 법적 구속력이 다른 점을 명시하고 비교법으로만 활용한다.';
    item.hardVariations = (item.hardVariations||[]).concat([
      `${item.title} 시스템이 이용자마다 서로 다른 설명·가격·추천을 생성하고 사업자도 사후에 정확한 출력내용을 재현하기 어려운 경우 기만성, 개인정보 처리, 증명책임을 어떻게 판단할 것인가.`,
      `합법적으로 수집된 데이터가 외부 모델의 학습·추론을 거치며 민감한 속성을 높은 정확도로 추론하게 된 경우 원래 처리근거와 새 추론정보의 법적 지위를 어떻게 구별할 것인가.`,
      `소비자가 AI 추천을 신뢰해 거래했으나 추천 근거가 판매자 광고데이터, 플랫폼 최적화, 모델의 환각이 복합된 경우 각 주체의 설명·시정·손해배상 책임을 어떻게 배분할 것인가.`
    ]);
    appendSources(item, privacy ? official.privacy.concat(official.aiAct) : official.aiAct);
  }

  function refineMobility(item){
    const air=has(item.title,['드론','UAM','항공'])||has(item.subfield,['항공']);
    item.doctrineDebate = air
      ? '자율비행 규율에서는 기존의 조종자 중심 항공안전 체계를 유지하면서 자동화 수준에 따라 원격조종자·운영자 의무를 강화하면 충분하다는 접근과, 고도 자율화에서는 시스템 제공자·운항관리·통신·버티포트 등 복수 주체의 기능별 안전책임을 별도로 설계해야 한다는 접근이 대립한다. 핵심은 자율화가 인간의 모든 책임을 소멸시키는지가 아니라 실제 통제권과 개입가능성이 어느 단계에 존재하는지다.'
      : '자율주행·이동로봇에서는 기존 운행자·운전자 책임과 보험을 피해자 보호의 중심으로 유지해야 한다는 견해와, 고도자율화에서는 제조자·소프트웨어 제공자·원격운영자의 위험통제에 맞춰 책임을 재배분해야 한다는 견해가 대립한다. 피해자에 대한 1차 보상과 최종적인 구상·결함책임은 분리해서 설계할 수 있다.';
    item.comparativeLaw = air
      ? '미국 FAA Part 107은 소형 UAS의 운항요건과 원격조종자 책임을 기본구조로 두고 있으며, 고도 자율운항·AAM은 별도의 인증·운항승인 체계와 결합된다. 한국 항공안전법·드론법·UAM 법제와 비교할 때 기체 인증, 운항자 책임, 공역관리, 원격식별과 데이터 기록을 구분하여 비교해야 한다.'
      : '미국 NHTSA는 ADS 및 Level 2 ADAS 관련 일정 사고에 대해 제조사·운영자 보고를 요구하는 Standing General Order를 운용해 실제 사고데이터를 안전감독에 활용한다. 한국은 자동차손해배상 보장법의 피해자 보상, 자동차관리법·자율주행자동차법의 안전·운행 규제, 도로교통법상 도로 이용규칙을 결합하므로 미국의 사고보고·리콜 중심 체계와 비교할 수 있다.';
    item.crossLawConflict = air
      ? '항공안전법·드론 활용 촉진법·도심항공교통 관련 특별법, 전파·통신규제, 개인정보·위치정보, 제조물책임·민법이 하나의 사고에 중첩될 수 있다. 비행승인이나 실증특례를 받았다는 사실은 민사상 주의의무나 제품결함을 당연히 배제하지 않는다.'
      : '자동차손해배상 보장법의 운행자책임과 보험, 자동차관리법·자율주행자동차법의 안전규제, 도로교통법의 운전자·도로통행 의무, 제조물책임법과 민법, 개인정보·위치정보가 중첩된다. 피해자에 대한 신속한 보상관계와 결함 제공자에 대한 구상관계를 분리하여 검토해야 한다.';
    item.proofIssues = commonEvidence(item).concat([
      '사고 직전 ODD, 자율주행 모드, 제어권 전환요구, 운전자·원격운영자의 개입가능시간과 센서 인식결과를 재구성한다.',
      '지도·통신·센서·모델·차량제어 소프트웨어의 버전과 업데이트 주체를 분리하여 결함 또는 과실의 기능적 위치를 특정한다.',
      '영상·위치·주행로그의 개인정보보호상 보존·제공 제한과 사고원인 규명을 위한 증거보전 필요를 조정한다.'
    ]);
    item.adjacentCaseLaw = '고도자율주행·UAM에 대한 확립된 국내 판례가 부족한 부분은 기존 자동차 운행자성·제조물 결함·교통사고 과실·항공안전 판례를 인접법리로 활용하고, 국토교통부 안전기준·고시·사고조사자료를 우선한다.';
    item.hardVariations = (item.hardVariations||[]).concat([
      `${item.title} 운행 중 지도서버 장애와 센서 오인식, 원격관제 지연이 동시에 발생하여 어느 원인 하나도 단독으로 사고를 설명하지 못하는 경우 복수사업자 책임과 인과관계를 어떻게 판단할 것인가.`,
      `시스템이 운전자에게 제어권 전환을 요구했으나 인간이 현실적으로 대응하기 어려운 짧은 시간만 제공한 경우 운전자 과실과 설계상 결함을 어떻게 비교할 것인가.`,
      `사고원인 규명에 필수적인 영상·위치로그가 개인정보 보호를 이유로 조기 삭제된 경우 피해자의 증명곤란을 누구에게 귀속할 것인가.`
    ]);
    appendSources(item, air ? official.aviation.concat(official.aiAct) : official.mobility.concat(official.product));
  }

  function refineMedical(item){
    item.doctrineDebate = '의료 AI에서는 의료인이 최종 판단을 한다는 이유로 의료인에게 책임을 집중해야 한다는 접근과, 의료인이 알 수 없는 모델결함·업데이트·데이터 편향은 제조자·의료기관·시스템 공급자의 통제영역이므로 기능별 책임분담이 필요하다는 접근이 대립한다. 의료인의 독립적 임상판단 의무와 제조자의 제품안전·정보제공 의무를 상호대체 관계가 아니라 병존 의무로 이해해야 한다.';
    item.comparativeLaw = '미국 FDA는 AI-enabled medical device를 총제품수명주기(TPLC) 관점에서 보고 데이터, 성능, 편향, 투명성, 사이버보안, 출시 후 변경과 Predetermined Change Control Plan을 연결한다. 한국 디지털의료제품법과 의료기기법의 허가·변경관리, 의료법상 의료행위·기록의무를 비교할 때 제품규제와 개별 진료책임을 분리하는 점이 핵심이다.';
    item.crossLawConflict = '디지털의료제품법·의료기기법의 제품안전 규제, 의료법상 의료인의 진료·기록의무, 개인정보 보호법의 건강정보 처리, 제조물책임법·민법상 손해배상이 중첩된다. 식약처 허가를 받았다는 사실은 개별 환자에 대한 의료인의 주의의무를 소멸시키지 않고, 반대로 의료인의 사용이 있었다는 이유만으로 제조자의 결함책임이 사라지지도 않는다.';
    item.proofIssues = commonEvidence(item).concat([
      '환자에게 실제 적용된 모델 버전, 입력 임상데이터, 출력·신뢰도, 경고메시지, 의료인의 수정·무시·추가검사 여부를 진료기록과 연결한다.',
      '성능저하가 환자군 편향, 데이터 드리프트, 업데이트, 장비·센서 문제 중 어디에서 발생했는지 검증한다.',
      '병원과 제조사 사이의 성능모니터링·사고보고·업데이트 통지 기록을 확보하여 정보지배와 예견가능성을 평가한다.'
    ]);
    item.adjacentCaseLaw = 'AI 의료기기의 직접 판례가 축적되지 않은 영역은 기존 의료과실의 설명의무·진단상 과실·인과관계 판례와 의료기기·의약품 제조물책임 법리를 인접기준으로 활용한다. FDA·식약처 가이드라인은 법적 구속력의 성격을 구별하되 주의의무의 기술적 내용을 구체화하는 자료로 사용할 수 있다.';
    item.hardVariations = (item.hardVariations||[]).concat([
      `${item.title} 시스템이 임상시험에서는 높은 정확도를 보였으나 특정 연령·인종·희귀질환군에서 성능이 급격히 저하되고 제조사와 병원 모두 이를 사전에 몰랐던 경우 주의의무와 개발위험을 어떻게 판단할 것인가.`,
      `의료인이 AI 권고와 반대되는 임상판단을 했으나 결과적으로 AI 권고가 맞았던 경우, 사후적 결과만으로 의료과실을 판단하지 않기 위해 어떤 정보와 당시 합리적 진료기준을 보아야 하는가.`,
      `승인된 모델이 병원 내부 데이터로 지속학습하면서 원래 허가성능과 달라진 경우 제조사·병원·개발자의 변경관리와 환자손해 책임을 어떻게 배분할 것인가.`
    ]);
    appendSources(item, official.medical.concat(official.product));
  }

  function refineIP(item){
    const patent=has(item.title,['발명','발명자','특허']);
    item.doctrineDebate = patent
      ? 'AI 보조발명에서는 발명자성을 인간의 착상(conception)과 창작적 기여에 한정해야 한다는 견해와, 고도 자율적 탐색시스템이 실질적 해결책을 산출하는 경우 현행 자연인 발명자 체계가 연구개발 현실을 충분히 설명하지 못한다는 입법론이 대립한다. 현행법 해석에서는 AI 자체를 발명자로 인정할지와 인간 이용자의 구체적 창작기여를 인정할지를 분리해야 한다.'
      : '생성형 AI 저작권에서는 학습을 저작물 이용으로 보되 공정이용 등 기존 제한규정으로 조정할 수 있다는 견해와, 대규모 상업적 학습에는 권리자 보상·옵트아웃 또는 별도 법정허락이 필요하다는 견해가 대립한다. 생성물 보호에서는 프롬프트만으로는 인간 창작성을 인정하기 어렵다는 접근과 반복적 선택·배열·수정·후편집을 전체 창작과정으로 평가해야 한다는 접근이 핵심이다.';
    item.comparativeLaw = patent
      ? '미국 USPTO의 2025년 개정 지침은 AI를 발명도구로 취급하면서 미국 특허법상 발명자는 자연인만 가능하다는 원칙을 재확인하고, AI 사용 자체에 별도의 발명자성 기준을 만들지 않았다. 한국에서도 AI 자체의 발명자 인정 문제와 인간의 구체적 창작·착상 기여를 구별하여 비교할 수 있다.'
      : '미국 Copyright Office는 2025년 AI 생성물 보고서에서 충분한 인간의 표현적 결정이 있는 부분만 저작권 보호가 가능하고 단순 프롬프트 제공만으로는 부족하다는 입장을 제시했으며, 별도 보고서에서 생성형 AI 학습의 공정이용·시장영향·라이선스 문제를 분석했다. 한국 저작권법에는 AI 학습 전반을 자동 면책하는 일반조항이 없으므로 공정이용 등 현행 조문과 구체적 이용행태를 분석해야 한다.';
    item.crossLawConflict = patent
      ? '특허법상 발명자·권리귀속과 영업비밀, 직무발명, 공동발명, 연구계약이 중첩될 수 있다. 학습데이터 또는 외부 AI 서비스에 비공개 기술정보를 입력했다면 특허 신규성·비밀관리성과도 연결된다.'
      : '저작권법상 복제·공정이용·2차적저작물, 개인정보 보호법상 학습데이터 처리, 부정경쟁방지법상 성과·데이터 이용, 계약·이용약관이 중첩될 수 있다. 하나의 데이터셋이 공개되어 있다는 사실이 저작권·개인정보·계약상 제한을 모두 소멸시키지는 않는다.';
    item.proofIssues = commonEvidence(item).concat(patent ? [
      '발명 아이디어가 형성된 시간순으로 인간 연구자의 문제설정·제약조건·선택·검증·수정 기록과 AI 출력물을 비교한다.',
      'AI가 제안한 수많은 후보 중 인간이 어떤 기술적 이유로 특정 해결책을 선택·구체화했는지 연구노트·커밋·실험기록으로 확인한다.'
    ] : [
      '학습데이터의 출처·취득방법·복제 범위·필터링·옵트아웃 준수 여부와 모델 출력의 원저작물 재현 가능성을 구분해 증명한다.',
      '생성물의 인간 창작성은 프롬프트 횟수보다 구체적인 선택·배열·수정·후편집과 최종 표현에 반영된 인간의 통제기록을 중심으로 본다.'
    ]);
    item.adjacentCaseLaw = patent
      ? '국내 AI 발명자성 판례가 충분히 축적되지 않은 부분은 기존 공동발명·직무발명·발명자 확정 법리와 해외 DABUS 계열 판단, USPTO 공식지침을 비교자료로 사용한다. 해외 판단을 국내법 결론으로 그대로 전환하지 않는다.'
      : '국내 생성형 AI 학습·생성물 판례가 부족한 부분은 저작물성·아이디어/표현·공정이용·실질적 유사성 기존 판례를 인접법리로 사용하고, 미국 Copyright Office 등 해외 공식자료는 비교법으로 구별한다.';
    item.hardVariations = (item.hardVariations||[]).concat([
      `${item.title}에서 AI가 핵심 해결책 또는 표현을 먼저 제시했지만 인간이 반복 실험·선택·수정으로 최종 결과를 완성한 경우 보호대상과 인간 기여의 경계를 어떻게 정할 것인가.`,
      `학습데이터가 저작권·개인정보·영업비밀이 서로 다른 자료를 혼합하고 모델이 일부 원자료를 근접 재현한 경우 권리별 청구요건과 증명대상을 어떻게 분리할 것인가.`,
      `기업 내부 AI가 여러 연구자의 아이디어와 공개 선행기술을 결합해 결과를 생성했으나 생성과정 로그가 불완전한 경우 발명자·저작자·권리귀속을 어떤 증거로 판단할 것인가.`
    ]);
    appendSources(item, patent ? official.patent : official.copyright);
  }

  function refineIndustry(item){
    item.doctrineDebate = 'AI 산업진흥법제에서는 규제샌드박스와 실증특례를 폭넓게 활용해 기술·서비스 출시를 촉진해야 한다는 견해와, 안전·기본권 위험이 불명확한 단계에서 규제유예가 사실상 위험을 사회에 전가할 수 있으므로 사전 위험평가·보험·기록·종료조건을 강화해야 한다는 견해가 대립한다. 진흥과 안전을 이분법으로 보지 말고 실증범위·기간·피해구제·데이터회수 조건을 설계해야 한다.';
    item.comparativeLaw = 'EU AI Act는 규제샌드박스와 실제환경 테스트를 AI 규제체계 내부에 두면서도 고위험 AI의 기본 요구사항과 감독을 결합한다. 한국의 ICT 규제샌드박스·실증특례와 비교할 때 허용 자체보다 감독기관 접근, 사고보고, 종료 후 데이터와 책임의 처리, 중소기업 지원 구조를 비교할 필요가 있다.';
    item.crossLawConflict = '소프트웨어 진흥법·정보통신산업 진흥법·정보통신융합법상 지원·특례를 받더라도 인공지능기본법, 개인정보 보호법, 제조물책임·민법, 의료·교통 등 개별 안전법의 적용이 당연히 배제되는 것은 아니다. 특례의 범위를 정확히 확인하고 적용제외되지 않은 법적 의무를 별도로 검토해야 한다.';
    item.proofIssues = commonEvidence(item).concat([
      '실증특례 신청서의 위험가정, 조건·부관, 시험범위, 사고보고와 실제 운영이 일치하는지 비교한다.',
      '사업자가 실증단계에서 알게 된 오류·근접사고를 상용화 의사결정에 어떻게 반영했는지 기록을 확보한다.'
    ]);
    item.adjacentCaseLaw = '신산업 실증·임시허가 자체에 AI 특화 판례가 부족하면 규제특례 승인조건, 감독기관 고시·가이드라인, 행정법상 부관·재량통제·신뢰보호 법리를 인접기준으로 활용한다.';
    item.hardVariations = (item.hardVariations||[]).concat([
      `${item.title} 실증특례 기간 중 반복된 근접사고가 있었지만 인명피해가 없어 사업자가 상용화를 계속한 뒤 중대한 사고가 발생한 경우 사전 자료의 법적 의미를 어떻게 평가할 것인가.`,
      `복수 부처 규제샌드박스가 중첩되고 한 기관은 허용했지만 다른 법률의 안전요건은 충족하지 못한 경우 특례의 효력범위를 어떻게 판단할 것인가.`,
      `실증 종료 후 수집된 데이터·모델을 다른 사업목적으로 재사용한 경우 원래 특례와 개인정보·계약·지식재산 규율의 적용범위를 어떻게 정할 것인가.`
    ]);
    appendSources(item, official.aiAct.concat([{label:'EU AI Act · EUR-Lex',url:'https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng'}]));
  }

  let refined=0;
  data.forEach(item=>{
    if(!aiAreas.has(item.area)) return;
    refined++;
    if(item.area==='헌법·AI 기본규제') refineFoundation(item);
    else if(item.area==='민사책임·소비자법') {
      if(has(item.subfield,['제조물','민법'])||has(item.title,['제조물','불법행위','과실','인과','책임'])) refineLiability(item);
      else refineDataConsumer(item);
    }
    else if(item.area==='데이터·플랫폼법') refineDataConsumer(item);
    else if(item.area==='모빌리티·로봇법') refineMobility(item);
    else if(item.area==='보건의료·AI') refineMedical(item);
    else if(item.area==='지식재산·AI') refineIP(item);
    else if(item.area==='AI 산업·융합법') refineIndustry(item);
    item.refinementStage='AI 법제 제3차 심화';
    item.reviewed='2026.08.07';
  });

  window.AI_REFINEMENT_ROUND3_COUNT=refined;
})();