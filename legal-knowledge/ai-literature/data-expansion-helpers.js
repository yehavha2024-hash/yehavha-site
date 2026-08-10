(() => {
  window.AI_LITERATURE_RECORDS = Array.isArray(window.AI_LITERATURE_RECORDS) ? window.AI_LITERATURE_RECORDS : [];
  window.AI_LITERATURE_ROUTES = Array.isArray(window.AI_LITERATURE_ROUTES) ? window.AI_LITERATURE_ROUTES : [];

  const roleLabels = ["직접 인용 핵심문헌", "반대학설", "비교법", "최신문헌"];
  const defaultAreaNote = {
    "민사·책임법": "불법행위·계약·제조물책임의 성립요건과 증명구조",
    "상법·회사법": "이사의 주의·감독의무와 기업 내부통제·위험관리",
    "헌법·공법": "기본권 보호·적법절차·국가의 규율의무",
    "형사법": "행위·고의·과실·객관적 귀속·책임능력과 형벌의 정당화",
    "데이터·개인정보": "개인정보 처리원칙·자동화된 결정·설명·거부·감사 가능성",
    "지식재산": "학습·산출·창작기여·발명자·권리침해와 권리귀속",
    "비교법·국제": "외국 규범·판례의 기능과 국내법 이식 한계"
  };

  window.addAiLawLiterature = meta => {
    if (!meta?.id || window.AI_LITERATURE_RECORDS.some(item => item.id === meta.id)) return;
    const roles = [...new Set((meta.evidenceRoles || []).filter(role => roleLabels.includes(role)))];
    if (!roles.length) {
      if (meta.priority === "A") roles.push("직접 인용 핵심문헌");
      if (meta.stage === "비교법") roles.push("비교법");
      if ((meta.year || 0) >= 2025) roles.push("최신문헌");
    }
    const primaryArea = (meta.legalAreas || [])[0] || "법철학·규제이론";
    const doctrinal = defaultAreaNote[primaryArea] || "AI 법적 효과와 책임귀속의 규범적 구조";
    const focus = meta.focus || (meta.issues || []).slice(0, 3).join("·") || meta.title;
    const roleUse = roles.includes("반대학설")
      ? "현재 연구의 주장을 제한하거나 기존 법리로 해결할 수 있다는 경쟁설로 대조"
      : roles.includes("비교법")
        ? "국내법의 해석·입법안과 외국법의 기능을 비교하고 직접 이식의 한계를 검토"
        : "해당 법영역의 요건·효과·책임근거를 직접 뒷받침하는 근거로 활용";

    window.AI_LITERATURE_RECORDS.push({
      id: meta.id,
      type: meta.type || (meta.language === "영어" ? "해외 학술논문" : "국내 학술논문"),
      priority: meta.priority || "B",
      stage: meta.stage || "쟁점",
      jurisdiction: meta.jurisdiction || (meta.language === "영어" ? "비교법" : "대한민국"),
      language: meta.language || "한국어",
      title: meta.title,
      translatedTitle: meta.translatedTitle || "",
      author: meta.author,
      year: meta.year,
      publication: meta.publication,
      citation: meta.citation || `${meta.author}, ${meta.title}, ${meta.publication} (${meta.year}).`,
      legalAreas: meta.legalAreas || [],
      issues: meta.issues || [],
      evidenceRoles: roles,
      summary: meta.summary || `${meta.title}은(는) ${focus}을 중심으로 ${doctrinal}의 적용·한계와 제도적 대응을 검토하는 문헌이다.`,
      mustRead: meta.mustRead || [
        `${focus}에 관한 저자의 핵심 명제와 전제`,
        `${doctrinal}과의 연결 방식`,
        "결론이 적용되는 범위와 저자가 명시하거나 전제한 한계"
      ],
      argumentUse: meta.argumentUse || [
        roleUse,
        `현재 연구의 ${focus} 논증에서 선행연구·교리·정책근거를 분리하여 인용`,
        "직접 인용 시 원문 문장·쪽수와 판본·법령 상태를 재확인"
      ],
      researchFit: meta.researchFit || `현재 박사연구에서는 ${focus}을(를) 설계·통합·배치·운용 등 책임층위와 연결하고, ${doctrinal}이 기능적 단위의 법적 지위·증명위험·책임재산 설계에 어떤 한계를 주는지 검증하는 데 접목한다.`,
      counterpoint: meta.counterpoint || `이 문헌의 결론을 AI 일반에 확장하지 않고 기술유형·법영역·사실관계·연구시점을 확인한다. ${roles.includes("반대학설") ? "경쟁설의 논거 자체를 독립적으로 검증한다." : "반대문헌과 함께 읽어 단일 견해로 고정하지 않는다."}`,
      related: meta.related || [],
      url: meta.url,
      access: meta.access || (meta.language === "영어" ? "원문·DOI" : "KCI·서지")
    });
  };
})();
