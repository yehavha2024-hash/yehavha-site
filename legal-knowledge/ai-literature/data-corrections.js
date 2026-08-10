(() => {
  if (!Array.isArray(window.AI_LITERATURE_RECORDS)) return;

  const records = window.AI_LITERATURE_RECORDS;
  const patch = (id, changes) => {
    const record = records.find(item => item.id === id);
    if (record) Object.assign(record, changes);
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

  // 실제 해외 법학문헌을 추가하여 공정성·자동화 판단의 절차법 축을 보강한다.
  if (!window.AI_LITERATURE_RECORDS.some(item => item.id === "article-scored-society-2014")) {
    window.AI_LITERATURE_RECORDS.push({
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
  }

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

  // 한국 AI 거버넌스의 혁신·안전 균형을 다루는 검증된 영문 비교문헌을 추가한다.
  if (!window.AI_LITERATURE_RECORDS.some(item => item.id === "article-korea-ai-governance-2024")) {
    window.AI_LITERATURE_RECORDS.push({
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
  }
})();
