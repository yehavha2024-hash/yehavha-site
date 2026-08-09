(function(){
  const data=window.LEGAL_KNOWLEDGE||[];
  const second=(id)=>data.filter(x=>x.id===id)[1];

  const creditor=second('civil-creditor-revocation');
  if(creditor){
    creditor.id='civil-creditor-revocation-elements';
    creditor.title='채권자취소권의 성립요건·제척기간';
    creditor.summary='피보전채권, 사해행위, 채무자·수익자·전득자의 주관적 요건과 민법 제406조의 제척기간을 중심으로 채권자취소권의 성립구조를 정리한다.';
    creditor.statuteSources=[
      {label:'민법 제406조 채권자취소권 · 국가법령정보센터',url:'https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=900140979'},
      {label:'민법 제407조 채권자취소의 효력 · 국가법령정보센터',url:'https://www.law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1032053257'}
    ];
    creditor.articleManualReviewChecked='2026.08.09';
    creditor.articleManualReviewNote='기존 중복 ID를 분리하고 제406조의 성립요건·제척기간 및 제407조의 효력 구조를 공식 조문으로 재대조.';
  }

  const proportionality=second('public-proportionality');
  if(proportionality){
    proportionality.id='public-constitutional-proportionality';
    proportionality.title='헌법상 과잉금지원칙';
    proportionality.summary='헌법 제37조 제2항을 중심으로 목적의 정당성·수단의 적합성·침해최소성·법익균형성의 기본권 제한 심사구조를 정리한다.';
    proportionality.relatedRules=Array.from(new Set([...(proportionality.relatedRules||[]),'행정기본법 제10조 비례의 원칙']));
  }

  const state=second('public-state-liability');
  if(state){
    state.id='public-state-liability-protective-norm';
    state.title='국가배상책임의 위법성·보호규범';
    state.summary='국가배상법 제2조의 법령위반을 단순한 객관적 법규위반과 구별하고, 직무상 의무의 보호목적·개인적 법익 보호 여부·부작위의 작위의무를 중심으로 위법성 구조를 정리한다.';
    state.relatedRules=Array.from(new Set([...(state.relatedRules||[]),'보호규범','부작위의 작위의무']));
  }

  const tax=second('special-tax-legality');
  if(tax){
    tax.id='special-tax-strict-interpretation';
    tax.title='조세법률주의와 세법의 엄격해석';
    tax.summary='헌법 제59조의 조세법률주의를 전제로 과세요건 법정주의·명확주의와 납세자에게 불리한 유추·확장해석 금지의 한계를 세법해석론으로 정리한다.';
    tax.relatedRules=Array.from(new Set([...(tax.relatedRules||[]),'엄격해석','유추해석 금지','과세요건 명확주의']));
  }

  const ids=data.map(x=>x.id);
  const duplicateCount=ids.length-new Set(ids).size;
  window.LEGAL_DUPLICATE_ID_RESOLUTION={checked:'2026.08.09',duplicateCount};
})();
