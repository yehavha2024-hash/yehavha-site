(() => {
  const meta = window.AI_FORESIGHT_META || (window.AI_FORESIGHT_META = {});
  meta.researchFlow = [
    '기술적 정의와 작동구조',
    '현행법 규율',
    '법적 쟁점',
    '학설·기존법리',
    '법적 공백',
    '비교법·해외사례',
    '책임·증명구조',
    '정책대안',
    '입법론'
  ];
})();

(() => {
  if (document.getElementById('project-ui-standard')) return;
  const style = document.createElement('style');
  style.id = 'project-ui-standard';
  style.textContent = `
    :root{--project-font:Pretendard,"Noto Sans KR","Apple SD Gothic Neo",system-ui,-apple-system,sans-serif;--project-max:1180px;--project-h1:clamp(40px,5vw,64px);--project-h2:clamp(30px,3.5vw,40px);--project-h3:20px}
    html,body,button,input,select,textarea{font-family:var(--project-font)!important}
    body{font-size:16px!important;line-height:1.82!important;letter-spacing:-.018em!important;word-break:keep-all}
    .wrap{width:min(var(--project-max),calc(100% - 48px))!important}
    h1,h2,h3,h4,.row-main h3,.article-header h3,.article-section-body h4{font-family:var(--project-font)!important}
    h1{font-size:var(--project-h1)!important;font-weight:780!important;line-height:1.16!important;letter-spacing:-.045em!important}
    .method-head h2,.browser-head h2,.section-title h2,.thesis-box h2{font-size:var(--project-h2)!important;font-weight:760!important;line-height:1.3!important;letter-spacing:-.038em!important}
    .row-main h3{font-size:var(--project-h3)!important;font-weight:750!important;line-height:1.45!important}
    .article-header h3{font-size:clamp(26px,3vw,34px)!important;font-weight:760!important;line-height:1.35!important}
    .lead{font-size:17px!important;line-height:1.88!important}
    .method-head>p,.browser-head p,.section-title p,.thesis-box p,.row-summary,.research-question,.index-card p,.index-card li,.article-lead,.article-question p,.forecast-warning p,.article-note p,.article-section-body p,.article-section-body li{font-size:15px!important;line-height:1.82!important}
    .eyebrow,.panel-label,.row-meta span,.row-tags span,.chip-grid span,.mini-chips span,.article-tags span{font-size:11px!important}
    .flow span,.principle-line span{font-size:14px!important;line-height:1.65!important}
    .browser-section,.index-section{padding-top:64px!important;padding-bottom:64px!important}
    @media(max-width:680px){
      body{font-size:16px!important;line-height:1.86!important}
      .wrap{width:calc(100% - 32px)!important}
      .browser-section,.index-section{padding-top:52px!important;padding-bottom:52px!important}
      .method-head>p,.browser-head p,.section-title p,.thesis-box p,.row-summary,.research-question,.index-card p,.index-card li,.article-lead,.article-question p,.forecast-warning p,.article-note p,.article-section-body p,.article-section-body li{font-size:16px!important;line-height:1.84!important}
      .controls,.stats,.research-grid,.thesis-box{grid-template-columns:1fr!important}
      .research-row{grid-template-columns:30px 1fr!important}
      .row-action{grid-column:2!important}
    }
  `;
  document.head.appendChild(style);

  const stripTrailingPeriod = (element) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let last = null;
    while (walker.nextNode()) if (walker.currentNode.nodeValue.trim()) last = walker.currentNode;
    if (last) last.nodeValue = last.nodeValue.replace(/[.。．]+(\s*)$/, '$1');
  };
  document.querySelectorAll('h1,h2,h3,h4').forEach(stripTrailingPeriod);
})();

(() => {
  const footer = document.querySelector('body > footer');
  if (!footer) return;
  if (!document.getElementById('top')) document.body.id = 'top';
  const style = document.createElement('style');
  style.id = 'copyright-standard-style';
  style.textContent = `body > footer.copyright-standard{font-family:Pretendard,"Noto Sans KR","Apple SD Gothic Neo",system-ui,-apple-system,sans-serif!important;background:#06111d!important;color:#8fa1b3!important;border-top:1px solid rgba(255,255,255,.10)!important;padding:32px 0!important;font-size:12px!important;line-height:1.7!important;letter-spacing:0!important;text-align:left!important}.copyright-standard-inner{width:min(1180px,calc(100% - 48px));margin:0 auto;display:flex;justify-content:space-between;align-items:flex-start;gap:28px;min-height:0!important}.copyright-standard-brand strong{display:block;font-family:inherit!important;font-size:13px!important;font-weight:600!important;line-height:1.5!important;letter-spacing:0!important;color:#d7e1ea!important}.copyright-standard-brand p,.copyright-standard-meta p{margin:4px 0 0!important;font-family:inherit!important;font-size:12px!important;font-weight:400!important;line-height:1.7!important;letter-spacing:0!important;color:#8fa1b3!important}.copyright-standard-brand p{font-size:11px!important}.copyright-standard-meta{text-align:right!important}.copyright-standard a{font-family:inherit!important;color:#a9bfd2!important;text-decoration:none!important}.copyright-standard-top{display:inline-block;margin-top:7px!important;font-size:11px!important;font-weight:600!important;line-height:1.7!important;letter-spacing:0!important}@media(max-width:680px){.copyright-standard-inner{width:min(100% - 32px,1180px);display:block}.copyright-standard-meta{text-align:left!important;margin-top:18px;padding-top:16px;border-top:1px solid rgba(255,255,255,.08)}}`;
  document.head.appendChild(style);
  footer.className = 'site-footer copyright-standard';
  footer.innerHTML = `<div class="copyright-standard-inner"><div class="copyright-standard-brand"><strong>AI 법·기술 선제연구 아카이브</strong><p>AI Law & Technology Foresight Archive</p></div><div class="copyright-standard-meta"><p>Copyright © 이명훈 2026. All rights reserved.</p><p>문의 <a href="mailto:kimbrighth@gmail.com">kimbrighth@gmail.com</a></p><a class="copyright-standard-top" href="#top">맨 위로 이동 ↑</a></div></div>`;
})();
