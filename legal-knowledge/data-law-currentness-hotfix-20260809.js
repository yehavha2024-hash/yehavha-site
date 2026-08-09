(function(){
  const data=window.LEGAL_KNOWLEDGE||[];

  // Node 런타임 감사에서도 브라우저와 동일하게 중복 ID를 먼저 해소한다.
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
  }
  const proportionality=second('public-proportionality');
  if(proportionality){
    proportionality.id='public-constitutional-proportionality';
    proportionality.title='헌법상 과잉금지원칙';
    proportionality.summary='헌법 제37조 제2항을 중심으로 목적의 정당성·수단의 적합성·침해최소성·법익균형성의 기본권 제한 심사구조를 정리한다.';
  }
  const state=second('public-state-liability');
  if(state){
    state.id='public-state-liability-protective-norm';
    state.title='국가배상책임의 위법성·보호규범';
    state.summary='국가배상법 제2조의 법령위반을 단순한 객관적 법규위반과 구별하고 직무상 의무의 보호목적·개인적 법익 보호 여부·부작위의 작위의무를 중심으로 위법성 구조를 정리한다.';
  }
  const tax=second('special-tax-legality');
  if(tax){
    tax.id='special-tax-strict-interpretation';
    tax.title='조세법률주의와 세법의 엄격해석';
    tax.summary='헌법 제59조의 조세법률주의를 전제로 과세요건 법정주의·명확주의와 납세자에게 불리한 유추·확장해석 금지의 한계를 세법해석론으로 정리한다.';
  }

  // 상표법 현행 시행일 교정.
  data.forEach(item=>{
    const text=[item.title,item.subfield,...(item.keywords||[]),...(item.relatedRules||[]),...(item.statuteSources||[]).map(x=>x.label),...(item.sources||[]).map(x=>x.label)].filter(Boolean).join(' ');
    if(!/상표법/.test(text)) return;
    (item.currentLawVersions||[]).forEach(v=>{
      if(v.name==='상표법'){
        v.effective='2025.11.11';
        v.ref='법률 제21134호';
      }
    });
    item.lawDate='2025.11.11';
    item.currentnessStatus='2026-08-09 현행법 대조';
  });

  // 공공분야 AI 영향평가 제32조는 법률명 변경·일부 조문의 2026-08-28 시행과 달리
  // 해당 조문 자체의 시행일이 2027-02-28이므로 카드 기준을 조문 단위로 교정한다.
  const publicAi=data.find(x=>x.id==='ai-public-sector-impact-assessment');
  if(publicAi){
    publicAi.title='공공분야 AI 영향평가·공표와 위험관리 — 2027.02.28 시행 예정';
    publicAi.lawDate='시행예정 2027.02.28';
    publicAi.currentnessStatus='제32조 시행예정 2027.02.28 · 2026-08-09 개정문 대조';
    publicAi.pendingLawChanges=[
      '인공지능 및 데이터 기반 행정 활성화에 관한 법률 — 2026.08.28 법률명·일부 조문 시행',
      '제32조 공공분야 인공지능 영향평가 등 — 2027.02.28 시행 예정'
    ];
    publicAi.currentLawVersions=[{
      name:'인공지능 및 데이터 기반 행정 활성화에 관한 법률 제32조',
      effective:'시행예정 2027.02.28',
      ref:'2026.02.27 신설',
      url:'https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=283735&viewCls=lsRvsDocInfoR',
      note:'법률명 변경·다른 일부 조문 시행일 2026.08.28과 구별'
    }];
  }
})();
