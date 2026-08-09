(function(){
  const data=window.LEGAL_KNOWLEDGE||[];

  function esc(s=''){
    return String(s).replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
  }

  function currentnessBlock(item){
    if(!item) return '';
    const versions=(item.currentLawVersions||[]).map(v=>{
      const note=v.note?` · ${esc(v.note)}`:'';
      const ref=v.ref?` · ${esc(v.ref)}`:'';
      return `<li><strong>${esc(v.name)}</strong> — 시행 ${esc(v.effective)}${ref}${note}</li>`;
    }).join('');
    const pending=(item.pendingLawChanges||[]).map(x=>`<li>${esc(x)}</li>`).join('');
    return `<section class="detail-section law-currentness-section" data-law-currentness>
      <h4>법령 최신성 검증</h4>
      <div class="analysis-row"><strong>현행법 확인일</strong><p>${esc(item.lawChecked||'2026.08.09')}</p></div>
      <div class="analysis-row"><strong>카드 적용 기준</strong><p>${esc(item.lawDate||item.reviewed||'')}</p></div>
      ${versions?`<div class="analysis-row"><strong>대조한 현행 법령</strong><ul class="detail-list">${versions}</ul></div>`:''}
      ${pending?`<div class="analysis-row"><strong>시행예정 법령 변경</strong><ul class="detail-list pending-law-list">${pending}</ul></div>`:''}
      <div class="analysis-row"><strong>검증 상태</strong><p>${esc(item.currentnessStatus||'개별 출처 재확인 대상')}</p></div>
    </section>`;
  }

  function decorate(){
    const detail=document.getElementById('detailContent');
    if(!detail || detail.querySelector('[data-law-currentness]')) return;
    const title=detail.querySelector('.detail-title')?.textContent?.trim();
    if(!title) return;
    const item=data.find(x=>x.title===title);
    if(!item) return;
    const meta=detail.querySelector('.detail-meta-row');
    if(meta && item.lawChecked && !meta.querySelector('[data-law-checked]')){
      const span=document.createElement('span');
      span.dataset.lawChecked='true';
      span.textContent=`현행법 확인 ${item.lawChecked}`;
      meta.appendChild(span);
    }
    const html=currentnessBlock(item);
    if(html){
      const anchor=detail.querySelector('.detail-meta-row');
      if(anchor) anchor.insertAdjacentHTML('afterend',html);
    }
  }

  const detail=document.getElementById('detailContent');
  if(detail){
    const observer=new MutationObserver(()=>decorate());
    observer.observe(detail,{childList:true,subtree:false});
  }
  if(typeof renderCards==='function') renderCards();
})();
