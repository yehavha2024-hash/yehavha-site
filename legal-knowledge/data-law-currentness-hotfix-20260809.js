(function(){
  const data=window.LEGAL_KNOWLEDGE||[];

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
