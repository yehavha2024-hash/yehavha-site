(function(){
  const data=window.LEGAL_KNOWLEDGE||[];
  const patchSource=(id,label,url)=>{const item=data.find(x=>x.id===id);if(item)item.statuteSources=[{label,url}];};
  const unique=(arr=[])=>[...new Set(arr.filter(Boolean))];

  const trademark=data.find(x=>x.id==='ip-trademark-similarity');
  if(trademark) trademark.statuteSources=[
    {label:'상표법 제34조 제1항 제7호 · 선등록상표와의 유사·등록배제 · 국가법령정보센터',url:'https://law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1030464713'},
    {label:'상표법 제108조 · 침해로 보는 행위 · 국가법령정보센터',url:'https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1016361677'}
  ];

  patchSource('public-proportionality','행정기본법 제10조 비례의 원칙 · 국가법령정보센터','https://www.law.go.kr/법령/행정기본법');
  patchSource('public-legitimate-expectation','행정기본법 제12조 신뢰보호의 원칙 · 국가법령정보센터','https://www.law.go.kr/법령/행정기본법');
  patchSource('public-invalid-voidable-act','행정기본법 제18조 위법 또는 부당한 처분의 취소 · 국가법령정보센터','https://www.law.go.kr/법령/행정기본법');
  patchSource('public-state-liability','국가배상법 제2조 배상책임 · 국가법령정보센터','https://www.law.go.kr/법령/국가배상법');
  patchSource('criminal-omission','형법 제18조 부작위범 · 국가법령정보센터','https://www.law.go.kr/법령/형법');
  patchSource('criminal-causation-attribution','형법 제17조 인과관계 · 국가법령정보센터','https://www.law.go.kr/법령/형법');
  patchSource('criminal-joint-principal','형법 제30조 공동정범 · 국가법령정보센터','https://www.law.go.kr/법령/형법');
  patchSource('criminal-exclusionary-rule','형사소송법 제308조의2 위법수집증거의 배제 · 국가법령정보센터','https://www.law.go.kr/법령/형사소송법');

  const canonical=data.find(x=>x.id==='criminal-exclusionary-rule');
  const legacyIndex=data.findIndex(x=>x.id==='criminal-illegal-evidence');
  if(canonical && legacyIndex>-1){
    const legacy=data[legacyIndex];
    canonical.keywords=unique([...(canonical.keywords||[]),...(legacy.keywords||[])]);
    canonical.requirements=unique([...(canonical.requirements||[]),...(legacy.requirements||[])]);
    canonical.application=unique([...(canonical.application||[]),...(legacy.application||[])]);
    canonical.relatedRules=unique([...(canonical.relatedRules||[]),...(legacy.relatedRules||[])]);
    canonical.deepDive=[...(canonical.deepDive||[])];
    if(!canonical.deepDive.some(x=>x.title==='동의와 임의성')) canonical.deepDive.push({title:'동의와 임의성',body:'형식상 동의나 임의제출의 외관이 있어도 강압·오인 등으로 진정한 자발성이 없었다면 적법성 판단이 달라질 수 있다. 동의가 유효하더라도 수사기관이 동의의 대상과 범위를 넘었는지 별도로 검토한다.'});
    canonical.proofIssues=unique([...(canonical.proofIssues||[]),'동의·임의제출 사건은 동의서뿐 아니라 고지내용, 거부가능성, 조사환경과 실제 제출·탐색범위를 함께 확인한다.']);
    canonical.reviewed='2026.08.14';
    canonical.lawDate='2026.08.14';
    canonical.refinementStage='중복통합·심화 2026-08-14';
    data.splice(legacyIndex,1);
  }
})();