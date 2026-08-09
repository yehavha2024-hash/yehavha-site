(function(){
  const data=window.LEGAL_KNOWLEDGE||[];
  const get=id=>data.find(x=>x.id===id);

  // 판례검색 결과 페이지는 인용자료가 아니라 탐색도구이므로 관련판례 목록에서 제거한다.
  data.forEach(item=>{
    if(Array.isArray(item.relatedCases)){
      item.relatedCases=item.relatedCases.filter(src=>{
        const u=src?.url||'';
        const l=src?.label||'';
        const generic=/precSc\.do/i.test(u) && /관련 판례검색|판례검색|관련 판례·결정 검색/i.test(l);
        return !generic;
      });
    }
  });

  // 사건번호가 확정된 국가법령정보센터 검색링크는 판례 직접경로로 교체한다.
  const exactCases={
    'civil-apparent-agency':['2001다29896','2012다66303'],
    'commercial-director-duty':['2006다33333','2007다35787'],
    'ip-equivalents':['2022후10722','2024후11590'],
    'ip-selected-invention':['2001후2740'],
    'ip-inventive-step':['2024후10641','2023후10965','2006후138'],
    'ip-trademark-similarity':['2017후981'],
    'ip-design-similarity':['2025후10235'],
    'ip-unfair-competition':['2023다290355']
  };
  Object.entries(exactCases).forEach(([id,nos])=>{
    const item=get(id); if(!item) return;
    const existing=(item.relatedCases||[]).filter(src=>{
      const label=src?.label||'';
      return !nos.some(no=>label.includes(no));
    });
    nos.forEach(no=>existing.push({label:`${no} · 국가법령정보센터 판례 직접`,url:`https://www.law.go.kr/LSW/precInfoP.do?evtNo=${encodeURIComponent(no)}`}));
    item.relatedCases=existing;
  });

  // 이미 더 강한 직접판례 출처가 있는 경우 법원 뉴스·보도자료 중복 링크는 sources에서도 제거한다.
  const director=get('commercial-director-duty');
  if(director){
    director.relatedCases=(director.relatedCases||[]).filter(src=>!(/2019다280481/.test(src.label||'') && /scourt\.go\.kr/.test(src.url||'')));
    director.sources=(director.sources||[]).filter(src=>!(/2019다280481/.test(src.label||'') && /NewsViewAction/i.test(src.url||'')));
  }

  // 2024도4824는 국가법령정보센터 표시와 대법원 공식 판례속보 사이의 주문 표기 불일치가 확인되어
  // 대법원 공식 판례속보를 우선 출처로 유지하고 보도자료 중복은 제거한다.
  const dolus=get('criminal-dolus-eventualis');
  if(dolus){
    dolus.relatedCases=(dolus.relatedCases||[]).filter(src=>!/보도자료/.test(src.label||''));
    dolus.sources=(dolus.sources||[]).filter(src=>!/보도자료/.test(src.label||''));
    dolus.sourceManuallyVerifiedOfficialUrls=[dolus.caseOfficialUrl].filter(Boolean);
    dolus.sourceManualReviewNote='2024도4824는 대법원 공식 판례속보의 판시·주문을 2026-08-09 수동 대조하여 우선 출처로 유지함.';
  }

  // 특허 진보성 카드의 2024후10641은 국가법령정보센터 직접판례 링크를 이미 추가했으므로 법원 뉴스 중복 제거.
  const inventive=get('ip-inventive-step');
  if(inventive){
    inventive.sources=(inventive.sources||[]).filter(src=>!(/2024후10641/.test(src.label||'') && /NewsViewAction/i.test(src.url||'')));
  }

  // 특허법원 2005허10107은 특허법원 공식 주요판결 페이지를 직접 대조한 하급심 원문 출처다.
  const selected=get('ip-selected-invention');
  if(selected){
    const verified=(selected.relatedCases||[]).filter(src=>/2005허10107/.test(src.label||'') && /scourt\.go\.kr/.test(src.url||''));
    selected.sourceManuallyVerifiedOfficialUrls=verified.map(x=>x.url);
    selected.sourceManualReviewNote='특허법원 2005허10107 공식 주요판결 페이지를 2026-08-09 수동검증. 대법원 판례와 동일 권위로 취급하지 않음.';
  }

  data.forEach(item=>{item.sourceManualReviewChecked='2026.08.09';});
})();
