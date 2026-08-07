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
  data.forEach(item => {
    item.examTags = item.examTags || examMap[item.subfield] || ['기타 전문 법률시험'];
    item.lawDate = item.lawDate || item.reviewed || '2026.08.07';
    item.concept = item.concept || item.summary;
    item.coreRule = item.coreRule || item.rule;
    item.relatedRules = item.relatedRules || (item.keywords || []).slice(0,5);
    item.relatedCases = item.relatedCases || (item.sources || []).filter(s => /대법원|헌법재판소|판결|주요판결/.test(s.label));
    item.statuteSources = item.statuteSources || (item.sources || []).filter(s => !/대법원|헌법재판소|판결|주요판결/.test(s.label));
    item.noteModel = item.area === '법적 추론' ? '추론·논증형' : (/판례/.test(item.type) ? '판례·법리형' : '법리·조문형');
  });
})();
