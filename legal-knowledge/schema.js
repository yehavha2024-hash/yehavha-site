(function(){
  const examMap = {
    '민법 총칙':['변호사시험','법무사'], '물권법':['변호사시험','법무사'], '채권법':['변호사시험','법무사'],
    '상법':['변호사시험','법무사'], '민사소송법':['변호사시험','법무사'], '민사집행·보전':['법무사','변호사시험'],
    '헌법':['변호사시험','법무사','LEET 연계'], '행정법':['변호사시험','LEET 연계'], '행정쟁송':['변호사시험'], '국가책임':['변호사시험'],
    '형법 총론':['변호사시험','법무사'], '형법 각론':['변호사시험','법무사'], '형사소송·증거법':['변호사시험','법무사'],
    '특허법':['변리사'], '상표법':['변리사'], '디자인보호법':['변리사'], '저작권법':['변리사 연계','기타 전문 법률시험'], '부정경쟁방지법':['변리사 연계','기타 전문 법률시험'],
    '법해석':['LEET','변호사시험'], '포섭':['LEET','변호사시험'], '논증':['LEET','변호사시험'], '요건사실':['변호사시험','법무사'],
    '증명책임':['변호사시험','법무사'], '판례분석':['LEET','변호사시험'], '논리구조':['LEET','변호사시험'], '조건추론':['LEET','변호사시험'],
    '규칙·예외':['LEET','변호사시험'], '쟁점추출':['LEET','변호사시험','법무사','변리사'], '반례':['LEET','변호사시험'], '규범충돌':['LEET','변호사시험']
  };

  const data = window.LEGAL_KNOWLEDGE || [];
  const hasText = value => typeof value === 'string' && value.trim().length > 0;
  const hasList = value => Array.isArray(value) && value.length > 0;
  const hasAnalysis = value => value && (hasText(value.analysis) || hasText(value.application) || hasText(value.conclusion));

  function systemArea(item){
    if (item.area === '공법' || item.area === '헌법·AI 기본규제') return '헌법·공법';
    if (item.area === '민사법') return '민사·상사·책임법';
    if (item.area === '형사법') return '형사법';
    if (item.area === '지식재산법' || item.area === '지식재산·AI') return '지식재산법';
    if (item.area === '조세·전문법') return '조세·전문법';
    if (item.area === '법적 추론') return '법적 추론';
    if (item.area === '데이터·플랫폼법') return '데이터·플랫폼·소비자법';
    if (item.area === '모빌리티·로봇법') return '모빌리티·로봇·항공법';
    if (item.area === '보건의료·AI') return '보건의료법';
    if (item.area === 'AI 산업·융합법') return 'AI 산업·융합법';
    if (item.area === '민사책임·소비자법') {
      return ['제조물 책임법','민법·AI 책임'].includes(item.subfield)
        ? '민사·상사·책임법'
        : '데이터·플랫폼·소비자법';
    }
    return item.area;
  }

  function variationSolutionsComplete(item,isReasoning){
    const normal = Array.isArray(item.variations) ? item.variations : [];
    const hard = Array.isArray(item.hardVariations) ? item.hardVariations : [];
    if (!normal.length && !hard.length) return isReasoning && hasList(item.application);
    const normalAnswers = Array.isArray(item.variationAnalyses) ? item.variationAnalyses : [];
    const hardAnswers = Array.isArray(item.hardVariationAnalyses) ? item.hardVariationAnalyses : [];
    const normalOk = normal.length === 0 || (normalAnswers.length === normal.length && normalAnswers.every(hasAnalysis));
    const hardOk = hard.length === 0 || (hardAnswers.length === hard.length && hardAnswers.every(hasAnalysis));
    return normalOk && hardOk;
  }

  data.forEach(item => {
    item.systemArea = systemArea(item);
    item.examTags = item.examTags || examMap[item.subfield] || ['기타 전문 법률시험'];
    item.lawDate = item.lawDate || item.reviewed || '2026.08.07';
    item.concept = item.concept || item.summary;
    item.coreRule = item.coreRule || item.rule;
    item.relatedRules = item.relatedRules || (item.keywords || []).slice(0,5);
    item.relatedCases = item.relatedCases || (item.sources || []).filter(s => /대법원|헌법재판소|판결|주요판결/.test(s.label));
    item.statuteSources = item.statuteSources || (item.sources || []).filter(s => !/대법원|헌법재판소|판결|주요판결/.test(s.label));
    item.noteModel = item.area === '법적 추론' ? '추론·논증형' : (/판례/.test(item.type) ? '판례·법리형' : '법리·조문형');

    const isReasoning = item.area === '법적 추론';
    const isCaseNote = item.noteModel === '판례·법리형' || hasText(item.caseFacts) || hasText(item.courtHolding) || hasText(item.courtReasoning);
    item.isCaseNote = isCaseNote;
    item.variationSolutionsComplete = variationSolutionsComplete(item,isReasoning);

    const checks = [
      {key:'concept', label:'주제·개념', ok:hasText(item.concept)},
      {key:'statutes', label:'관련 조문', ok:isReasoning || hasList(item.statuteSources)},
      {key:'requirements', label:'성립요건', ok:isReasoning || hasList(item.requirements)},
      {key:'effect', label:'법적 효과', ok:isReasoning || hasText(item.effect)},
      {key:'issue', label:'주요 쟁점', ok:hasText(item.issue)},
      {key:'theories', label:'학설·해석론', ok:hasText(item.theories) || (isReasoning && hasText(item.analysis))},
      {key:'caseFacts', label:'판례 사실관계', ok:!isCaseNote || hasText(item.caseFacts), conditional:!isCaseNote},
      {key:'courtHolding', label:'법원의 판단', ok:!isCaseNote || hasText(item.courtHolding), conditional:!isCaseNote},
      {key:'courtReasoning', label:'법원의 논증', ok:!isCaseNote || hasText(item.courtReasoning), conditional:!isCaseNote},
      {key:'coreRule', label:'핵심 법리', ok:hasText(item.coreRule)},
      {key:'counter', label:'반대논리·한계', ok:hasText(item.counter) || (isReasoning && hasList(item.deepDive))},
      {key:'variations', label:'사례변형·법리적 해설', ok:item.variationSolutionsComplete},
      {key:'relatedRules', label:'관련 법리', ok:hasList(item.relatedRules)},
      {key:'relatedCases', label:'관련 판례', ok:!isCaseNote || hasList(item.relatedCases), conditional:!isCaseNote},
      {key:'examTags', label:'관련 시험', ok:hasList(item.examTags)},
      {key:'dates', label:'기준일·검토일', ok:hasText(item.lawDate) && hasText(item.reviewed)}
    ];

    item.standard16 = checks;
    item.standard16Done = checks.filter(x => x.ok).length;
    item.standard16Total = 16;
    item.standard16Missing = checks.filter(x => !x.ok).map(x => x.label);

    item.caseOriginalVerified = !isCaseNote || item.caseOriginalChecked === true;

    if (isCaseNote && !item.caseOriginalVerified) {
      item.qualityStatus = '원문 검증 필요';
    } else if (item.standard16Done < item.standard16Total) {
      item.qualityStatus = '보강 중';
    } else {
      item.qualityStatus = '16항목 완성';
    }
  });
})();