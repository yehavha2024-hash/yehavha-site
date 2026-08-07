(function(){
  const data=window.LEGAL_KNOWLEDGE||[];
  const countEl=document.getElementById('contentCount');
  if(countEl){
    const cases=data.filter(x=>x.isCaseNote);
    const verified=cases.filter(x=>x.caseOriginalVerified).length;
    countEl.textContent=`연구 항목 ${data.length} · 판례 원문검증 ${verified}/${cases.length}`;
  }

  const footer=document.querySelector('footer');
  if(footer){
    footer.innerHTML=`
      <div>Copyright © 이명훈 2026. All rights reserved.</div>
      <div class="footer-contact">문의 <a href="mailto:kimbrighth@gmail.com">kimbrighth@gmail.com</a></div>
      <div class="footer-note">Research archive · Updated by verified topic units</div>`;
  }
})();