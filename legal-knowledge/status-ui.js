(function(){
  const data=window.LEGAL_KNOWLEDGE||[];
  const countEl=document.getElementById('contentCount');
  if(!countEl)return;
  const complete=data.filter(x=>x.qualityStatus==='16항목 완성').length;
  const cases=data.filter(x=>x.isCaseNote);
  const verified=cases.filter(x=>x.caseOriginalVerified).length;
  countEl.textContent=`연구 항목 ${data.length} · 16항목 완성 ${complete} · 판례 원문검증 ${verified}/${cases.length}`;
})();