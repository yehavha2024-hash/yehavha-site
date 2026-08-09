(function(){
  const data=window.LEGAL_KNOWLEDGE||[];
  const CHECKED='2026.08.09';

  // 국가법령정보센터의 2026-08-09 현재 시행본을 기준으로 한 법률별 기준표.
  // 하나의 법률에 단계별 시행일이 있는 경우 카드가 인용하는 조문을 우선하고,
  // 장래 시행 개정은 pending으로 분리하여 현행법과 혼동하지 않는다.
  const registry=[
    {re:/민법(?!.*소송)/,name:'민법',effective:'2026.03.17',ref:'법률 제21454호',url:'https://www.law.go.kr/법령/민법'},
    {re:/민사소송법/,name:'민사소송법',effective:'2025.07.12',ref:'법률 제19516호',url:'https://www.law.go.kr/법령/민사소송법',pending:[{effective:'2028.03.01',ref:'법률 제21455호',note:'2026.03.17 공포 개정 중 장래 시행 부분'}]},
    {re:/민사집행법/,name:'민사집행법',effective:'2026.02.01',ref:'법률 제20733호',url:'https://www.law.go.kr/법령/민사집행법',pending:[{effective:'2028.03.01',ref:'법률 제21456호',note:'2026.03.17 공포 개정 중 장래 시행 부분'}]},
    {re:/상법(?!.*등기)/,name:'상법',effective:'2026.07.23',ref:'조문별 단계시행',url:'https://www.law.go.kr/법령/상법',note:'상법은 개정조문별 시행일이 달라 카드가 다루는 조문의 연혁을 우선 확인'},
    {re:/행정기본법/,name:'행정기본법',effective:'2026.03.19',ref:'법률 제20824호',url:'https://www.law.go.kr/법령/행정기본법'},
    {re:/행정소송법/,name:'행정소송법',effective:'현행 조문별 확인',ref:'',url:'https://www.law.go.kr/법령/행정소송법'},
    {re:/국가배상법/,name:'국가배상법',effective:'2025.01.07',ref:'법률 제20635호',url:'https://www.law.go.kr/법령/국가배상법'},
    {re:/형법(?!.*소송)/,name:'형법',effective:'2026.03.12',ref:'법률 제21450호',url:'https://www.law.go.kr/법령/형법'},
    {re:/형사소송법/,name:'형사소송법',effective:'2026.07.01',ref:'법률 제21241호 등 조문별 단계시행',url:'https://www.law.go.kr/법령/형사소송법',note:'일부 조문은 2026.06.24 등 별도 시행일이 있으므로 인용조문 연혁을 우선'},
    {re:/저작권법/,name:'저작권법',effective:'2026.05.11',ref:'2026-08-09 현재 시행본',url:'https://www.law.go.kr/법령/저작권법',pending:[{effective:'2026.08.11',ref:'법률 제21336호',note:'2026.02.10 공포 개정 시행 예정'}]},
    {re:/부정경쟁.*영업비밀|부정경쟁방지법/,name:'부정경쟁방지 및 영업비밀보호에 관한 법률',effective:'2026.05.28',ref:'법률 제21065호 계열 현행본',url:'https://www.law.go.kr/법령/부정경쟁방지및영업비밀보호에관한법률'},
    {re:/디자인보호법/,name:'디자인보호법',effective:'2025.11.28',ref:'법률 제21065호',url:'https://www.law.go.kr/법령/디자인보호법'},
    {re:/특허법/,name:'특허법',effective:'2025.11.11',ref:'2026-08-09 현재 관련 조문 시행본',url:'https://www.law.go.kr/법령/특허법'},
    {re:/상표법/,name:'상표법',effective:'2025.10.01',ref:'2026-08-09 현재 관련 조문 시행본',url:'https://www.law.go.kr/법령/상표법'},
    {re:/국세기본법/,name:'국세기본법',effective:'2026.07.01',ref:'법률 제21212호 중심 현행본',url:'https://www.law.go.kr/법령/국세기본법',note:'일부 개정조문은 2026.06.02 등 별도 시행일이 있으므로 해당 조문 연혁 우선'},
    {re:/부동산등기법/,name:'부동산등기법',effective:'2025.01.31',ref:'법률 제20435호',url:'https://www.law.go.kr/법령/부동산등기법'},
    {re:/상업등기법/,name:'상업등기법',effective:'2025.01.31',ref:'법률 제20437호',url:'https://www.law.go.kr/법령/상업등기법'},
    {re:/공탁법/,name:'공탁법',effective:'현행 조문별 확인',ref:'',url:'https://www.law.go.kr/법령/공탁법'},
    {re:/제조물 ?책임법/,name:'제조물 책임법',effective:'2018.04.19',ref:'법률 제14764호',url:'https://www.law.go.kr/법령/제조물책임법'},
    {re:/소비자기본법/,name:'소비자기본법',effective:'2026.01.02',ref:'법률 제21065호',url:'https://www.law.go.kr/법령/소비자기본법'},
    {re:/전자상거래.*소비자보호|전자상거래법/,name:'전자상거래 등에서의 소비자보호에 관한 법률',effective:'2026.07.21',ref:'법률 제21312호',url:'https://www.law.go.kr/법령/전자상거래등에서의소비자보호에관한법률'},
    {re:/표시.*광고.*공정화|표시광고법/,name:'표시·광고의 공정화에 관한 법률',effective:'2025.01.21',ref:'법률 제20712호',url:'https://www.law.go.kr/법령/표시광고의공정화에관한법률'},
    {re:/독점규제.*공정거래|공정거래법/,name:'독점규제 및 공정거래에 관한 법률',effective:'2026.05.12',ref:'법률 제21644호',url:'https://www.law.go.kr/법령/독점규제및공정거래에관한법률'},
    {re:/개인정보 ?보호법/,name:'개인정보 보호법',effective:'2025.10.02',ref:'2026-08-09 현재 시행본',url:'https://www.law.go.kr/법령/개인정보보호법',pending:[{effective:'2026.09.11',ref:'법률 제21445호',note:'2026.03.10 공포 개정 시행 예정'}]},
    {re:/신용정보.*이용.*보호|신용정보법/,name:'신용정보의 이용 및 보호에 관한 법률',effective:'2024.08.14',ref:'2026-08-09 현재 관련 조문 시행본',url:'https://www.law.go.kr/법령/신용정보의이용및보호에관한법률',pending:[{effective:'2026.08.13',ref:'법률 제21646호',note:'2026.05.12 공포 개정 시행 예정'}]},
    {re:/위치정보.*보호.*이용|위치정보법/,name:'위치정보의 보호 및 이용 등에 관한 법률',effective:'2025.10.01',ref:'법률 제21066호',url:'https://www.law.go.kr/법령/위치정보의보호및이용등에관한법률'},
    {re:/데이터 산업진흥.*이용촉진|데이터산업법/,name:'데이터 산업진흥 및 이용촉진에 관한 기본법',effective:'2025.10.01',ref:'법률 제21066호',url:'https://www.law.go.kr/법령/데이터산업진흥및이용촉진에관한기본법'},
    {re:/인공지능.*발전.*신뢰기반|인공지능기본법/,name:'인공지능 발전과 신뢰 기반 조성 등에 관한 기본법',effective:'2026.07.21',ref:'법률 제21311호 중심 조문별 단계시행',url:'https://www.law.go.kr/법령/인공지능발전과신뢰기반조성등에관한기본법',note:'일부 정의·기초조문은 2026.01.22 등 단계별 시행. 카드가 인용하는 조문 시행일 우선'},
    {re:/인공지능 및 데이터 기반 행정 활성화/,name:'인공지능 및 데이터 기반 행정 활성화에 관한 법률',effective:'시행예정 2026.08.28',ref:'법률 제21392호',url:'https://www.law.go.kr/법령/인공지능및데이터기반행정활성화에관한법률',pending:[{effective:'2026.08.28',ref:'법률 제21392호',note:'공공분야 AI 영향평가 관련 개정 시행 예정'}]},
    {re:/자동차관리법/,name:'자동차관리법',effective:'2026.06.16',ref:'법률 제21817호 등 조문별 단계시행',url:'https://www.law.go.kr/법령/자동차관리법',pending:[{effective:'2026.12.17',ref:'법률 제21817호',note:'일부 조문 장래 시행'}]},
    {re:/자율주행자동차.*상용화|자율주행자동차법/,name:'자율주행자동차 상용화 촉진 및 지원에 관한 법률',effective:'2026.06.18',ref:'법률 제21482호 관련 조문',url:'https://www.law.go.kr/법령/자율주행자동차상용화촉진및지원에관한법률'},
    {re:/도로교통법/,name:'도로교통법',effective:'2026.07.01',ref:'법률 제21246호',url:'https://www.law.go.kr/법령/도로교통법'},
    {re:/자동차손해배상.*보장/,name:'자동차손해배상 보장법',effective:'2025.10.01',ref:'2026-08-09 현재 관련 조문 시행본',url:'https://www.law.go.kr/법령/자동차손해배상보장법'},
    {re:/지능형 로봇 개발.*보급|지능형로봇법/,name:'지능형 로봇 개발 및 보급 촉진법',effective:'2025.10.01',ref:'법률 제21065호',url:'https://www.law.go.kr/법령/지능형로봇개발및보급촉진법'},
    {re:/항공안전법/,name:'항공안전법',effective:'2026.07.01',ref:'법률 제21268호 등 단계시행',url:'https://www.law.go.kr/법령/항공안전법',pending:[{effective:'2026.11.13',ref:'법률 제21636호',note:'2026.05.12 공포 개정 중 일부 조문 장래 시행'}]},
    {re:/도심항공교통.*활용|도심항공교통법/,name:'도심항공교통 활용 촉진 및 지원에 관한 법률',effective:'2026.02.01',ref:'법률 제20727호',url:'https://www.law.go.kr/법령/도심항공교통활용촉진및지원에관한법률',pending:[{effective:'2026.10.25',ref:'제17조',note:'일부 조문 별도 시행'}]},
    {re:/산업안전보건법/,name:'산업안전보건법',effective:'2026.07.07',ref:'카드 인용조문 기준',url:'https://www.law.go.kr/법령/산업안전보건법'},
    {re:/중대재해.*처벌/,name:'중대재해 처벌 등에 관한 법률',effective:'2024.01.27',ref:'전 사업장 확대 시행 기준',url:'https://www.law.go.kr/법령/중대재해처벌등에관한법률'},
    {re:/의료법/,name:'의료법',effective:'2026.04.07',ref:'법률 제21524호',url:'https://www.law.go.kr/법령/의료법'},
    {re:/디지털의료제품법/,name:'디지털의료제품법',effective:'2026.01.24',ref:'법률 제20139호',url:'https://www.law.go.kr/법령/디지털의료제품법'},
    {re:/의료기기법/,name:'의료기기법',effective:'2026.07.01',ref:'카드 인용조문 기준',url:'https://www.law.go.kr/법령/의료기기법'},
    {re:/소프트웨어 진흥법/,name:'소프트웨어 진흥법',effective:'2026.06.03',ref:'카드 인용조문 기준',url:'https://www.law.go.kr/법령/소프트웨어진흥법'},
    {re:/정보통신산업 진흥법/,name:'정보통신산업 진흥법',effective:'2026.06.03',ref:'법률 제21154호',url:'https://www.law.go.kr/법령/정보통신산업진흥법'},
    {re:/정보통신 진흥 및 융합 활성화|정보통신융합법/,name:'정보통신 진흥 및 융합 활성화 등에 관한 특별법',effective:'2026.04.21',ref:'카드 인용조문 기준',url:'https://www.law.go.kr/법령/정보통신진흥및융합활성화등에관한특별법'},
    {re:/지능정보화 기본법/,name:'지능정보화 기본법',effective:'2026.01.22',ref:'카드 인용조문 기준',url:'https://www.law.go.kr/법령/지능정보화기본법'}
  ];

  function textOf(item){
    return [item.title,item.subfield,...(item.keywords||[]),...(item.relatedRules||[]),...(item.statuteSources||[]).map(x=>x.label),...(item.sources||[]).map(x=>x.label)].filter(Boolean).join(' ');
  }

  data.forEach(item=>{
    const text=textOf(item);
    const hits=[];
    registry.forEach(r=>{if(r.re.test(text))hits.push(r);});
    item.lawChecked=CHECKED;
    item.currentLawVersions=hits.map(r=>({name:r.name,effective:r.effective,ref:r.ref,url:r.url,note:r.note||''}));
    item.pendingLawChanges=[];
    hits.forEach(r=>(r.pending||[]).forEach(p=>item.pendingLawChanges.push(`${r.name} — ${p.effective} 시행 예정${p.ref?` (${p.ref})`:''}${p.note?` · ${p.note}`:''}`)));

    // 2026-08-09를 실제 시행일처럼 입력한 신규 20개 카드의 lawDate를 법령 시행일로 교정한다.
    if(item.lawDate==='2026.08.09' && hits.length){
      const primary=hits[0];
      item.lawDate=primary.effective;
    }
    // 확인된 개별 오기·불일치 교정.
    if(item.id==='ai-location-mobility-data') item.lawDate='2025.10.01';
    if(item.id==='ai-auto-management-safety') item.lawDate='2026.06.16';
    if(item.id==='ai-drone-aviation-safety') item.lawDate='2026.07.01';
    if(item.id==='ai-public-sector-impact-assessment') item.lawDate='시행예정 2026.08.28';
    if(item.id==='ai-copyright-training-output') item.lawDate='2026.05.11';
    if(item.id==='ai-credit-automated-evaluation') item.lawDate='2024.08.14';

    item.currentnessStatus = hits.length ? '2026-08-09 현행법 대조' : (item.area==='법적 추론' ? '법령 비의존 연구노트' : '개별 출처 재확인 대상');
  });
})();
