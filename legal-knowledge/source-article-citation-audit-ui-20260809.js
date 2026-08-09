(function(){
  const data=window.LEGAL_KNOWLEDGE||[];
  function esc(s=''){return String(s).replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));}

  function decorate(){
    const detail=document.getElementById('detailContent');
    if(!detail||detail.querySelector('[data-source-citation-audit]')) return;
    const title=detail.querySelector('.detail-title')?.textContent?.trim();
    if(!title) return;
    const item=data.find(x=>x.title===title);
    if(!item||!item.sourceLinkGrade) return;
    const counts=item.sourceLinkAudit?.counts||{};
    const fragile=item.sourceLinkAudit?.fragile||[];
    const block=`<section class="detail-section source-citation-audit-section" data-source-citation-audit>
      <h4>출처·조문·판례 인용 품질등급</h4>
      <div class="analysis-row"><strong>출처 링크 ${esc(item.sourceLinkGrade)}</strong><p>A1 공식 직접 ${counts.A1||0} · A2 공식 일반 ${counts.A2||0} · B1 공식 취약경로 ${counts.B1||0} · C 보조자료 ${counts.C||0} · D 오류 ${counts.D||0}</p></div>
      <div class="analysis-row"><strong>조문번호 ${esc(item.articleAccuracyGrade)}</strong><p>${esc(item.articleAccuracyAudit?.note||'')}</p></div>
      <div class="analysis-row"><strong>판례 인용 ${esc(item.precedentCitationGrade)}</strong><p>${esc(item.precedentCitationAudit?.note||'')}</p></div>
      ${fragile.length?`<div class="analysis-row"><strong>링크 안정성 주의</strong><p>${esc(fragile.join(' · '))} — 공식 출처이지만 검색·웹방화벽·구형 경로 가능성이 있어 직접 고정링크로 교체 권장</p></div>`:''}
      <div class="analysis-row"><strong>감사일</strong><p>${esc(item.sourceAuditChecked||'2026.08.09')}</p></div>
    </section>`;
    const caseBlock=detail.querySelector('[data-case-scope]');
    const lawBlock=detail.querySelector('[data-law-currentness]');
    if(caseBlock) caseBlock.insertAdjacentHTML('afterend',block);
    else if(lawBlock) lawBlock.insertAdjacentHTML('afterend',block);
    else detail.querySelector('.detail-meta-row')?.insertAdjacentHTML('afterend',block);
  }

  const detail=document.getElementById('detailContent');
  if(detail)new MutationObserver(()=>decorate()).observe(detail,{childList:true,subtree:false});
})();
