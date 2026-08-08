(function(){
  const data=window.LEGAL_KNOWLEDGE||[];
  const countEl=document.getElementById('contentCount');
  if(countEl){
    const cases=data.filter(x=>x.isCaseNote);
    const verified=cases.filter(x=>x.caseOriginalVerified).length;
    countEl.textContent=`연구 항목 ${data.length} · 판례 원문검증 ${verified}/${cases.length}`;
  }

  const stats=document.getElementById('stats');
  if(stats)stats.remove();

  if(!document.getElementById('project-ui-standard')){
    const ui=document.createElement('style');
    ui.id='project-ui-standard';
    ui.textContent=`
      :root{--project-font:Pretendard,"Noto Sans KR","Apple SD Gothic Neo",system-ui,-apple-system,sans-serif;--project-max:1180px;--project-h1:clamp(40px,5vw,64px);--project-h2:clamp(30px,3.5vw,40px);--project-h3:20px}
      html,body,button,input,select,textarea{font-family:var(--project-font)!important}
      body{font-size:16px!important;line-height:1.82!important;letter-spacing:-.018em!important;word-break:keep-all}
      .hero-inner,main{max-width:var(--project-max)!important}
      h1,h2,h3,h4,.detail-title,.brand-mark,.brand strong{font-family:var(--project-font)!important}
      h1{font-size:var(--project-h1)!important;font-weight:780!important;line-height:1.16!important;letter-spacing:-.045em!important}
      .section-heading h2,.notice h2{font-size:var(--project-h2)!important;font-weight:760!important;line-height:1.3!important;letter-spacing:-.038em!important}
      .card h3{font-size:var(--project-h3)!important;font-weight:750!important;line-height:1.45!important}
      .hero-copy{font-size:17px!important;line-height:1.88!important}
      .notice p,.section-heading p,.card .summary,.program-card p,.roadmap-grid span,.detail-sub,.detail-section p,.detail-list{font-size:15px!important;line-height:1.82!important}
      .eyebrow,.section-kicker,.badge,.level,.card-keywords span,.reviewed{font-size:11px!important}
      .flow span{font-size:14px!important;line-height:1.65!important}
      .research-model,.content-section,.roadmap{margin-top:64px!important}
      .cards{gap:16px!important}
      @media(max-width:680px){
        body{font-size:16px!important;line-height:1.86!important}
        .hero-inner{padding-left:16px!important;padding-right:16px!important}
        main{padding-left:16px!important;padding-right:16px!important}
        .notice p,.section-heading p,.card .summary,.roadmap-grid span,.detail-sub,.detail-section p,.detail-list{font-size:16px!important;line-height:1.84!important}
        .cards,.roadmap-grid{grid-template-columns:1fr!important}
        .notice{grid-template-columns:1fr!important}
      }
    `;
    document.head.appendChild(ui);

    const strip=e=>{
      const w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);
      let n=null;
      while(w.nextNode())if(w.currentNode.nodeValue.trim())n=w.currentNode;
      if(n)n.nodeValue=n.nodeValue.replace(/[.。．]+(\s*)$/,'$1');
    };
    document.querySelectorAll('h1,h2,h3,h4').forEach(strip);
  }

  const footer=document.querySelector('body > footer');
  if(!footer)return;
  if(!document.getElementById('top'))document.body.id='top';
  const style=document.createElement('style');
  style.id='copyright-standard-style';
  style.textContent=`body > footer.copyright-standard{font-family:Pretendard,"Noto Sans KR","Apple SD Gothic Neo",system-ui,-apple-system,sans-serif!important;background:#06111d!important;color:#8fa1b3!important;border-top:1px solid rgba(255,255,255,.10)!important;padding:32px 0!important;font-size:12px!important;line-height:1.7!important;letter-spacing:0!important;text-align:left!important}.copyright-standard-inner{width:min(1180px,calc(100% - 48px));margin:0 auto;display:flex;justify-content:space-between;align-items:flex-start;gap:28px;min-height:0!important}.copyright-standard-brand strong{display:block;font-family:inherit!important;font-size:13px!important;font-weight:600!important;line-height:1.5!important;letter-spacing:0!important;color:#d7e1ea!important}.copyright-standard-brand p,.copyright-standard-meta p{margin:4px 0 0!important;font-family:inherit!important;font-size:12px!important;font-weight:400!important;line-height:1.7!important;letter-spacing:0!important;color:#8fa1b3!important}.copyright-standard-brand p{font-size:11px!important}.copyright-standard-meta{text-align:right!important}.copyright-standard a{font-family:inherit!important;color:#a9bfd2!important;text-decoration:none!important}.copyright-standard-top{display:inline-block;margin-top:7px!important;font-size:11px!important;font-weight:600!important;line-height:1.7!important;letter-spacing:0!important}@media(max-width:680px){.copyright-standard-inner{width:min(100% - 32px,1180px);display:block}.copyright-standard-meta{text-align:left!important;margin-top:18px;padding-top:16px;border-top:1px solid rgba(255,255,255,.08)}}`;
  document.head.appendChild(style);
  footer.className='site-footer copyright-standard';
  footer.innerHTML=`<div class="copyright-standard-inner"><div class="copyright-standard-brand"><strong>법리·판례 연구</strong><p>Advanced Legal Studies</p></div><div class="copyright-standard-meta"><p>Copyright © 이명훈 2026. All rights reserved.</p><p>문의 <a href="mailto:kimbrighth@gmail.com">kimbrighth@gmail.com</a></p><a class="copyright-standard-top" href="#top">맨 위로 이동 ↑</a></div></div>`;
})();
