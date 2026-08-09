(function(){
  const data=window.LEGAL_KNOWLEDGE||[];
  function esc(s=''){return String(s).replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));}
  function decorate(){
    const detail=document.getElementById('detailContent');
    if(!detail || detail.querySelector('[data-case-scope]')) return;
    const title=detail.querySelector('.detail-title')?.textContent?.trim();
    if(!title) return;
    const item=data.find(x=>x.title===title);
    if(!item || !item.caseNo) return;
    const block=`<section class="detail-section case-scope-section" data-case-scope>
      <h4>판례 원문·판시범위 검증</h4>
      <div class="analysis-row"><strong>법원·선고일</strong><p>${esc(item.caseCourt)} ${esc(item.caseDate)}</p></div>
      <div class="analysis-row"><strong>사건번호·사건명</strong><p>${esc(item.caseNo)} · ${esc(item.caseName||'')} ${item.caseResult?`· ${esc(item.caseResult)}`:''}</p></div>
      <div class="analysis-row"><strong>이 카드의 인용 가능 판시범위</strong><p>${esc(item.caseScope||'')}</p></div>
      <div class="analysis-row"><strong>과잉 일반화 금지선</strong><p>${esc(item.caseLimit||'')}</p></div>
      <div class="analysis-row"><strong>원문 대조일</strong><p>${esc(item.caseChecked||'2026.08.09')}</p></div>
      ${item.caseOfficialUrl?`<div class="source-links"><a href="${esc(item.caseOfficialUrl)}" target="_blank" rel="noopener noreferrer">공식 판례 원문·주요판결 확인 ↗</a></div>`:''}
    </section>`;
    const currentness=detail.querySelector('[data-law-currentness]');
    if(currentness) currentness.insertAdjacentHTML('afterend',block);
    else detail.querySelector('.detail-meta-row')?.insertAdjacentHTML('afterend',block);
  }
  const detail=document.getElementById('detailContent');
  if(detail){new MutationObserver(()=>decorate()).observe(detail,{childList:true,subtree:false});}
})();
