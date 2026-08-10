(() => {
  if (!Array.isArray(window.AI_LITERATURE_RECORDS)) return;

  const records = window.AI_LITERATURE_RECORDS;
  const patch = (id, changes) => {
    const record = records.find(item => item.id === id);
    if (record) Object.assign(record, changes);
  };
  const add = record => {
    if (!window.AI_LITERATURE_RECORDS.some(item => item.id === record.id)) window.AI_LITERATURE_RECORDS.push(record);
  };

  // 검증되지 않은 탐색용 임시 노드는 실제 출판문헌 목록에서 제거한다.
  window.AI_LITERATURE_RECORDS = records.filter(item => item.id !== "article-ai-fairness-law-2023-en");

  // 2024년 한국 자동화 의사결정 영문 비교논문의 정확한 서지로 정정한다.
  patch("article-ai-constitutional-automation-2024", {
    title: "Automated decision-making in South Korea: a critical review of the revised Personal Information Protection Act",
    translatedTitle: "한국의 자동화된 의사결정: 개정 개인정보 보호법에 대한 비판적 검토",
    author: "Dong Hyeon Kim & Do Hyun Park",
    publication: "Humanities and Social Sciences Communications 11, Article 974",
    citation: "Dong Hyeon Kim & Do Hyun Park, Automated decision-making in South Korea: a critical review of the revised Personal Information Protection Act, 11 Humanities and Social Sciences Communications 974 (2024).",
    summary: "한국 개인정보 보호법 제37조의2의 자동화된 결정 규율을 GDPR 제22조와 비교하면서 규율 형식, 적용대상, 설명 내용의 차이를 분석한다. 다단계 프로파일링과 완전자동화 기준에서 발생할 수 있는 보호 공백도 검토한다.",
    mustRead: ["개인정보 보호법 제37조의2와 GDPR 제22조의 구조 차이", "완전자동화와 다단계 프로파일링의 규율 공백", "거부권·설명요구권의 실효성"],
    argumentUse: ["한국 자동화 의사결정 규율을 EU와 비교하는 직접 영문 근거", "시스템 전체와 개별 처리단계를 구별하는 책임분석", "설명·거부·인간개입을 권리묶음으로 분석"],
    researchFit: "다중에이전트 시스템에서 최종 산출물만 보아 완전자동화 여부를 판단하면 중간 에이전트의 프로파일링·추천·선별 단계가 규율에서 누락될 수 있다는 비교논거로 활용한다.",
    counterpoint: "개인정보 보호법상 자동화된 결정 규율은 민사상 책임귀속이나 독립 법적 지위를 직접 결정하지 않으므로 기능적 비교에 한정한다.",
    url: "https://doi.org/10.1057/s41599-024-03470-y",
    access: "DOI·오픈액세스"
  });

  add({
    id: "article-scored-society-2014", type: "해외 학술논문", priority: "A", stage: "교리", jurisdiction: "미국", language: "영어",
    title: "The Scored Society: Due Process for Automated Predictions", translatedTitle: "점수화된 사회: 자동화된 예측과 적법절차", author: "Danielle Keats Citron & Frank Pasquale", year: 2014, publication: "89 Washington Law Review 1-34",
    citation: "Danielle Keats Citron & Frank Pasquale, The Scored Society: Due Process for Automated Predictions, 89 Washington Law Review 1 (2014).",
    legalAreas: ["헌법·공법", "데이터·개인정보", "비교법·국제"], issues: ["자동화 예측", "적법절차", "점수화", "투명성", "이의제기"],
    summary: "신용·고용·주거·보험 등 중요한 기회를 좌우하는 자동화 점수화가 불투명하고 감독이 부족할 때 절차적 보호가 필요하다고 논증한다. 규제기관의 검증과 개인의 실질적 이의제기 기회를 핵심 장치로 제시한다.",
    mustRead: ["자동화 점수화의 불투명성과 권리영향", "규제기관의 공정성·정확성 검증", "불리한 자동화 판단에 대한 이의제기 절차"],
    argumentUse: ["알고리즘 결과에 대한 절차적 통제의 고전적 근거", "설명뿐 아니라 검증·이의제기를 결합해야 한다는 논증", "데이터 기반 평가의 권리침해 위험을 공법적 절차와 연결"],
    researchFit: "에이전트 시스템의 결과가 개인에 대한 등급·선별·추천으로 이어질 때 로그보존, 감사, 이의제기, 인간검토를 기능적 단위의 절차 incidents로 설계하는 근거에 접목한다.",
    counterpoint: "미국의 due process 전통과 사적 사업자의 규율구조를 한국 헌법·개인정보법에 그대로 이식하지 않고 기능적 유사성을 중심으로 비교한다.",
    related: ["article-citron-2008", "article-barocas-selbst-2016", "article-kroll-accountable-2017", "article-kaminski-explanation-2019"],
    url: "https://digitalcommons.law.uw.edu/wlr/vol89/iss1/2/", access: "원문"
  });

  patch("article-fairness-2023", {
    translatedTitle: "Theory and Practice of AI Fairness",
    url: "https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART002994595",
    access: "KCI"
  });
  patch("article-human-intervention-2026", {
    translatedTitle: "Human Intervention in Artificial Intelligence-Based Automated Decision-Making",
    url: "https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003337578",
    access: "KCI"
  });
  patch("article-hallucination-rights-2026", {
    translatedTitle: "The Legal Responsibility Framework of Generative AI Hallucinations and Normative Design for the Protection of Fundamental Rights",
    publication: "법이론실무연구 14(1), 49-88",
    citation: "이형석, 「생성형 인공지능 할루시네이션 현상의 법적 책임 구조와 기본권 보호를 위한 규범설계」, 『법이론실무연구』 14(1), 2026, 49-88.",
    url: "https://journal.kci.go.kr/kltp/archive/articleView?artiId=ART003314937",
    access: "KCI·학술지"
  });
  patch("article-ai-search-liability-2025", {
    url: "https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003276179",
    access: "KCI·DOI"
  });
  patch("article-ai-washing-2025", {
    url: "https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003242758",
    access: "KCI"
  });

  add({
    id: "article-korea-ai-governance-2024", type: "해외 학술논문", priority: "B", stage: "비교법", jurisdiction: "대한민국·비교법", language: "영어",
    title: "A Tough Balancing Act – The Evolving AI Governance in Korea", translatedTitle: "어려운 균형: 진화하는 한국의 AI 거버넌스", author: "Do Hyun Park, Eunjung Cho & Yong Lim", year: 2024, publication: "East Asian Science, Technology and Society 18(2), 135-154",
    citation: "Do Hyun Park, Eunjung Cho & Yong Lim, A Tough Balancing Act – The Evolving AI Governance in Korea, 18(2) East Asian Science, Technology and Society 135 (2024).",
    legalAreas: ["법철학·규제이론", "헌법·공법", "비교법·국제", "산업·융합법"], issues: ["한국 AI 거버넌스", "혁신", "안전", "규제정책", "신뢰할 수 있는 AI"],
    summary: "한국 AI 거버넌스가 기술혁신 촉진과 안전·신뢰 확보라는 두 목표를 병행하는 과정에서 형성된 정책·규범의 흐름과 긴장을 분석한다.",
    mustRead: ["한국 AI 거버넌스의 역사적 전개", "혁신촉진과 안전규율의 긴장", "정부 가이드라인·윤리원칙·입법의 상호작용"],
    argumentUse: ["한국 AI 법제의 정책적 배경 설명", "혁신과 책임규율 사이의 비례성 논증", "국내 제도설계의 비교법적 위치 확인"],
    researchFit: "기능적 단위와 계층적 책임제도가 혁신을 과도하게 억제하지 않도록 위험수준·외부효과·통제가능성에 따라 차등 적용해야 한다는 정책적 정당화에 활용한다.",
    counterpoint: "거버넌스의 정책사적 분석은 개별 민사책임 요건의 직접 근거가 아니므로 교리문헌과 구별하여 사용한다.",
    related: ["norm-korea-ai-basic", "article-trustworthy-ai-2022", "article-scherer-2016"],
    url: "https://doi.org/10.1080/18752160.2024.2348307", access: "DOI·오픈액세스"
  });

  // 형사법 축: 주체성 → 책임귀속 → 에이전트 신종범죄 → 고의·과실 판단으로 연결한다.
  add({
    id: "article-ahn-ai-criminal-2017", type: "국내 학술논문", priority: "A", stage: "교리", jurisdiction: "대한민국", language: "한국어",
    title: "인공지능 로봇의 형사책임 ―논의방향의 설정에 관한 몇 가지 발전적 제언―", translatedTitle: "Artificial Intelligence and Criminal Liability", author: "안성조", year: 2017, publication: "법철학연구 20(2), 77-122",
    citation: "안성조, 「인공지능 로봇의 형사책임 ―논의방향의 설정에 관한 몇 가지 발전적 제언―」, 『법철학연구』 20(2), 2017, 77-122.",
    legalAreas: ["형사법", "법철학·규제이론"], issues: ["형사책임", "행위주체", "제조자", "사용자", "AI 로봇"],
    summary: "AI 로봇 사고에서 제조업자·사용자·AI 자체 중 누구에게 형사책임을 귀속할 수 있는지 전통적 책임주의와 행위주체 논의를 중심으로 검토한다.",
    mustRead: ["형사책임의 행위·책임능력 전제", "제조자와 사용자의 귀책 가능성", "AI 자체에 형사책임을 인정하는 논리의 한계"],
    argumentUse: ["형사법에서 법적 주체성 인정 문턱을 민사법과 비교", "인간 배후책임과 AI 자체 책임의 구별", "기능적 법적 지위가 형사책임능력까지 포함할 필요가 없는 근거"],
    researchFit: "기능적 단위의 법적 지위는 법영역별 incidents가 달라야 한다는 점, 특히 민사상 책임재산·소송지위 인정과 형사상 책임능력 인정은 분리할 수 있다는 근거로 활용한다.",
    counterpoint: "형사책임의 엄격한 책임주의를 민사상 위험책임이나 조직책임에 그대로 이식하지 않는다.",
    related: ["book-hallevy-ai-crime-2015", "article-oh-ai-criminal-2025", "article-kim-ai-crime-2023"],
    url: "https://doi.org/10.22286/kjlp.2017.20.2.003", access: "DOI·KCI"
  });

  add({
    id: "article-kim-ai-crime-2023", type: "국내 학술논문", priority: "B", stage: "교리", jurisdiction: "대한민국", language: "한국어",
    title: "AI범죄에 대한 형사책임의 귀속문제", translatedTitle: "The Problem of Attribution of Criminal Responsibility for AI Crime", author: "김준성", year: 2023, publication: "중앙법학 25(3), 73-97",
    citation: "김준성, 「AI범죄에 대한 형사책임의 귀속문제」, 『중앙법학』 25(3), 2023, 73-97.",
    legalAreas: ["형사법"], issues: ["AI범죄", "형사책임 귀속", "관리자", "배후정범", "보증인"],
    summary: "AI 자체를 형사책임 주체로 보기보다 소유자·대표자·실질 관리자 등 인간의 운영·관리 관여도에 따라 책임을 귀속하고, 책임관리 자연인의 등록 가능성까지 검토한다.",
    mustRead: ["AI 형사주체 부정 논리", "운영·관리 관여도와 인간 책임", "보증인 또는 책임관리자 등록 구상"],
    argumentUse: ["책임관리인 제도의 형사법적 비교근거", "배후 인간책임을 차단하지 않는 기능적 단위론", "관리·감독의무를 책임귀속 요소로 세분화"],
    researchFit: "기능적 단위에 책임관리인을 결합하고 배후 인간의 형사책임 가능성을 유지하는 구조를 설계할 때 비교문헌으로 활용한다.",
    counterpoint: "관리자 등록만으로 고의·과실과 인과관계가 추정되는 것은 아니며 죄형법정주의·책임주의가 우선한다.",
    related: ["article-ahn-ai-criminal-2017", "article-shin-new-ai-crime-2025"],
    url: "https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003003201", access: "KCI·DOI"
  });

  add({
    id: "article-shin-new-ai-crime-2025", type: "국내 학술논문", priority: "A", stage: "쟁점", jurisdiction: "대한민국", language: "한국어",
    title: "인공지능(AI) 시대의 신종 범죄에 대한 형사법적 대응 방향 - 형사책임의 주체 및 범위를 중심으로 -", translatedTitle: "Criminal law response to new crimes in the era of Artificial Intelligence (AI)", author: "신혜진", year: 2025, publication: "형사법의 신동향 87, 221-277",
    citation: "신혜진, 「인공지능(AI) 시대의 신종 범죄에 대한 형사법적 대응 방향 - 형사책임의 주체 및 범위를 중심으로 -」, 『형사법의 신동향』 87, 2025, 221-277.",
    legalAreas: ["형사법", "소비자·플랫폼"], issues: ["AI 에이전트", "신종범죄", "딥페이크", "사이버범죄", "책임주체"],
    summary: "생성형 AI와 AI 에이전트를 이용한 사기·딥페이크·개인정보 탈취·사이버공격 등 신종범죄를 전제로 형사책임의 주체와 범위를 검토한다.",
    mustRead: ["AI 에이전트를 범죄도구로 이용하는 구조", "사용자·개발자·서비스제공자 사이의 책임범위", "현행 형법 적용과 입법 보완의 경계"],
    argumentUse: ["Agentic AI가 직접 외부행위를 수행하는 최신 형사법 사례", "명령자와 실행 에이전트 사이의 책임간극 분석", "다중 에이전트 범죄의 관여구조를 민사상 계층귀속과 비교"],
    researchFit: "민사상 창발적 손해와 달리 범죄에서는 고의·방조·예견가능성 등 엄격한 주관적 요건이 필요하다는 차이를 명확히 하면서, AI 에이전트 책임분산 문제의 범법 영역을 확장하는 데 활용한다.",
    counterpoint: "범죄의 악용 사례를 일반적인 AI 시스템의 자율적 오류·손해와 혼동하지 않는다.",
    related: ["article-oh-ai-criminal-2025", "book-hallevy-ai-crime-2015", "article-han-ml-criminal-2025"],
    url: "https://doi.org/10.23026/crclps.2025..87.006", access: "DOI·KCI"
  });

  add({
    id: "article-oh-ai-criminal-2025", type: "국내 학술논문", priority: "A", stage: "쟁점", jurisdiction: "대한민국", language: "한국어",
    title: "인공지능(AI)과 형사책임 –‘형사적인 것’의 탐구를 위한 문제 제기를 겸하여 –", translatedTitle: "Artificial Intelligence (AI) and Criminal Liability: As a Proposal to the Exploration of ‘The Criminal’", author: "오병두", year: 2025, publication: "홍익법학 26(4), 285-312",
    citation: "오병두, 「인공지능(AI)과 형사책임 –‘형사적인 것’의 탐구를 위한 문제 제기를 겸하여 –」, 『홍익법학』 26(4), 2025, 285-312.",
    legalAreas: ["형사법", "법철학·규제이론"], issues: ["형사책임", "전자인", "행위능력", "책임능력", "형벌능력"],
    summary: "AI에 인간과 동일한 행위능력·책임능력·형벌능력을 적용하기 어렵다는 점에서 출발해, AI 형사책임 논의가 ‘형사적인 것’의 개념과 책임주의의 토대를 재검토하게 한다고 논증한다.",
    mustRead: ["행위능력·책임능력·형벌능력의 분리", "전자인 논의에 대한 형사법적 한계", "제한적 영역에서 별도 법정 제재를 설계할 가능성"],
    argumentUse: ["법적 지위의 모듈화 근거", "민사상 기능인격과 형사상 책임능력을 분리하는 논증", "법인격이라는 단일 개념으로 모든 법효과를 묶는 방식에 대한 반론"],
    researchFit: "기능적 단위 법적 지위를 ‘포괄적 인격’이 아니라 목적별 incidents의 묶음으로 설계해야 한다는 핵심 방법론을 형사법의 엄격한 반례로 검증하는 데 활용한다.",
    counterpoint: "형사정책상 제한적 제재 가능성과 전통적 의미의 범죄능력 인정은 구별한다.",
    related: ["article-ahn-ai-criminal-2017", "article-shin-personhood-2018", "article-bryson-persons-2017"],
    url: "https://doi.org/10.16960/jhlr.26.4.202512.285", access: "DOI·KCI"
  });

  add({
    id: "article-han-ml-criminal-2025", type: "국내 학술논문", priority: "A", stage: "제도설계", jurisdiction: "대한민국", language: "한국어",
    title: "기계학습 방법에 따른 인공지능 사고 유형 분류와 인공지능 개발자의 고의 및 과실 판단 기준에 관한 연구", translatedTitle: "", author: "한우현", year: 2025, publication: "형사법의 신동향 88, 192-225",
    citation: "한우현, 「기계학습 방법에 따른 인공지능 사고 유형 분류와 인공지능 개발자의 고의 및 과실 판단 기준에 관한 연구」, 『형사법의 신동향』 88, 2025, 192-225.",
    legalAreas: ["형사법", "법적 추론"], issues: ["기계학습", "고의", "과실", "개발자", "사고유형"],
    summary: "지도학습·비지도학습·강화학습 등 기계학습 방식과 사고 발생구조를 유형화하고, 그 차이를 개발자의 고의·과실 판단 기준과 연결한다.",
    mustRead: ["기계학습 방식별 사고유형 분류", "개발자의 인식·예견가능성과 기술구조의 관계", "기술적 실패유형을 형법상 고의·과실로 번역하는 방법"],
    argumentUse: ["기술적 작동을 규범적 귀책요건으로 전환하는 구체 사례", "모델 유형별 주의의무 차등화", "기술유형과 법적 평가기준 사이의 연결로직"],
    researchFit: "AI의 비규범적 작동을 인간의 규범적 책임으로 전환할 때 단순 결과책임이 아니라 기술유형·통제가능성·예견가능성을 매개해야 한다는 논증에 직접 활용한다.",
    counterpoint: "기계학습 유형은 귀책 판단의 사실요소이지 고의·과실을 자동 결정하는 법적 요건은 아니다.",
    related: ["article-shin-new-ai-crime-2025", "book-ai-principles-2021", "thesis-park-emergent-2021"],
    url: "https://doi.org/10.23026/crclps.2025..88.005", access: "DOI·KCI"
  });

  add({
    id: "book-hallevy-ai-crime-2015", type: "해외 단행본", priority: "A", stage: "교리", jurisdiction: "비교법", language: "영어",
    title: "Liability for Crimes Involving Artificial Intelligence Systems", translatedTitle: "인공지능 시스템이 관여한 범죄의 책임", author: "Gabriel Hallevy", year: 2015, publication: "Springer",
    citation: "Gabriel Hallevy, Liability for Crimes Involving Artificial Intelligence Systems, Springer (2015).",
    legalAreas: ["형사법", "법철학·규제이론", "비교법·국제"], issues: ["AI 형사책임", "정범", "공범", "도구", "고의·과실", "형벌"],
    summary: "AI 시스템이 범죄의 정범·공범·도구로 관여하는 경우를 구분해 행위요소, 주관적 책임요소, 처벌가능성을 체계적으로 검토하는 대표적 해외 단행본이다.",
    mustRead: ["AI가 범죄도구·행위자·매개체로 기능하는 유형", "actus reus와 mens rea의 귀속", "AI 자체의 처벌가능성 논의"],
    argumentUse: ["해외 AI 형사책임론의 기본 분류틀", "AI 자체 책임과 인간 파생책임의 대조", "다중 에이전트 형사책임 구조의 비교법 출발점"],
    researchFit: "민사상 계층적 책임귀속과 형사상 정범·공범·도구 모델을 비교하여 법영역별 귀속논리가 어떻게 달라지는지를 보여주는 데 활용한다.",
    counterpoint: "Hallevy의 AI 직접책임 모델을 그대로 채택하지 않고 한국 형법의 책임주의·죄형법정주의와 최신 에이전트 구조에서 재검증한다.",
    related: ["article-ahn-ai-criminal-2017", "article-oh-ai-criminal-2025", "article-shin-new-ai-crime-2025"],
    url: "https://doi.org/10.1007/978-3-319-10124-8", access: "Springer·DOI"
  });

  if (Array.isArray(window.AI_LITERATURE_ROUTES) && !window.AI_LITERATURE_ROUTES.some(route => route.id === "route-criminal")) {
    window.AI_LITERATURE_ROUTES.push({
      id: "route-criminal", title: "형사책임·AI 에이전트 범죄", area: "형사법",
      description: "형사책임 주체성에서 출발해 인간에 대한 귀속, AI 에이전트 신종범죄, 기계학습 유형별 고의·과실 판단으로 이어집니다.",
      path: "안성조 → Hallevy → 김준성 → 오병두 → 신혜진 → 한우현",
      recordIds: ["article-ahn-ai-criminal-2017", "book-hallevy-ai-crime-2015", "article-kim-ai-crime-2023", "article-oh-ai-criminal-2025", "article-shin-new-ai-crime-2025", "article-han-ml-criminal-2025"]
    });
  }
})();
