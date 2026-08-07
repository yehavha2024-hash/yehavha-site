(function(){
  const data=window.LEGAL_KNOWLEDGE||[];
  const countEl=document.getElementById('contentCount');
  if(!countEl)return;
  const cases=data.filter(x=>x.isCaseNote);
  const verified=cases.filter(x=>x.caseOriginalVerified).length;
  countEl.textContent=`연구 항목 ${data.length} · 판례 원문검증 ${verified}/${cases.length}`;
})();