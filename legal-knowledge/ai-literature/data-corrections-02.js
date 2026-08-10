(() => {
  if (!Array.isArray(window.AI_LITERATURE_RECORDS)) return;

  const id = "thesis-yoon-ai-criminal-2018";
  if (!window.AI_LITERATURE_RECORDS.some(item => item.id === id)) {
    window.AI_LITERATURE_RECORDS.push({
      id,
      type: "국내 박사학위논문",
      priority: "A",
      stage: "교리",
      jurisdiction: "대한민국",
      language: "한국어",
      title: "인공지능로봇에 관한 형사법적 연구",
      translatedTitle: "A Criminal Law Study on Artificial Intelligence Robots",
      author: "윤영석",
      year: 2018,
      publication: "서울대학교 법학박사학위논문",
      citation: "윤영석, 「인공지능로봇에 관한 형사법적 연구」, 서울대학교 법학박사학위논문, 2018.",
      legalAreas: ["형사법", "법철학·규제이론"],
      issues: ["AI 형사법적 지위", "고의", "과실", "책임능력", "공범", "형사제재"],
      summary: "AI 로봇의 형사법적 지위를 물건·동물·법인·사람·새로운 개체 모델로 비교하고, 충분히 발달한 AI 로봇을 전제로 객관적 구성요건, 고의·과실, 정당방위·긴급피난, 책임능력, 법률의 착오, 공동정범·간접정범, 형사제재까지 체계적으로 검토한다.",
      mustRead: [
        "제3장 AI로봇의 형사법적 지위: 물건·동물·법인·사람·새로운 개체 모델의 비교",
        "제4장 고의·과실·책임능력: 인간 형사책임 개념을 AI에 적용할 수 있는지에 대한 검토",
        "공동정범·교사범·간접정범: 인간과 AI가 함께 범죄 결과에 관여하는 구조",
        "형사제재의 종류와 AI에 대한 제재 가능성"
      ],
      argumentUse: [
        "AI의 사실상 자율성과 법적 책임주체성은 별개의 규범판단이라는 근거",
        "민사상 기능적 법적 지위와 형사상 책임능력을 분리하는 비교논증",
        "다중 에이전트와 인간이 함께 결과를 발생시키는 경우 공범·간접정범 법리와 계층적 귀속구조를 비교",
        "법적 지위를 하나의 포괄적 인격이 아니라 법영역별 기능으로 나누어 검토해야 한다는 근거"
      ],
      researchFit: "기능적 단위에 책임재산·등록·제한적 소송상 지위 등을 인정하는 논증이 곧 AI의 고의·과실·책임능력 또는 형벌능력 인정으로 이어지는 것은 아니라는 점을 형사법에서 검증하는 핵심 국내 박사학위논문으로 사용한다. 또한 인간과 AI의 협업·공범 구조는 다중에이전트 책임귀속의 형사법적 비교축으로 활용한다.",
      counterpoint: "강한 AI와 충분히 발달한 AI 로봇을 전제로 한 부분은 현재의 Agentic AI에 그대로 적용하지 않는다. 현존 시스템에는 인간의 설계·배치·관리·이용 행위를 우선적으로 분석하고, 미래적 논의와 현행법 해석을 구별한다.",
      related: ["article-ahn-ai-criminal-2017", "book-hallevy-ai-crime-2015", "article-oh-ai-criminal-2025", "article-shin-new-ai-crime-2025", "article-han-ml-criminal-2025"],
      url: "https://www.dbpia.co.kr/journal/detail?nodeId=T14953300",
      access: "학위논문 서지·초록·목차"
    });
  }

  // 기존 문헌 4건에 누락된 연구상 증거역할 메타데이터를 보완한다.
  // 서지·요약·링크는 건드리지 않고, 현재 연구에서의 사용 역할만 명시한다.
  const evidenceRoleById = new Map([
    ["article-kim-ai-crime-2023", ["직접 인용 핵심문헌"]],
    ["article-fairness-2023", ["직접 인용 핵심문헌"]],
    ["article-park-bias-2022", ["직접 인용 핵심문헌"]],
    ["thesis-kang-civil-procedure-2024", ["직접 인용 핵심문헌"]]
  ]);
  for (const [recordId, evidenceRoles] of evidenceRoleById) {
    const record = window.AI_LITERATURE_RECORDS.find(item => item.id === recordId);
    if (record && (!Array.isArray(record.evidenceRoles) || !record.evidenceRoles.length)) {
      record.evidenceRoles = evidenceRoles;
    }
  }

  if (Array.isArray(window.AI_LITERATURE_ROUTES)) {
    const route = window.AI_LITERATURE_ROUTES.find(item => item.id === "route-criminal");
    if (route) {
      route.path = "윤영석 박사논문 → 안성조 → Hallevy → 김준성 → 오병두 → 신혜진 → 한우현";
      route.recordIds = [
        "thesis-yoon-ai-criminal-2018",
        "article-ahn-ai-criminal-2017",
        "book-hallevy-ai-crime-2015",
        "article-kim-ai-crime-2023",
        "article-oh-ai-criminal-2025",
        "article-shin-new-ai-crime-2025",
        "article-han-ml-criminal-2025"
      ];
    }
  }
})();
