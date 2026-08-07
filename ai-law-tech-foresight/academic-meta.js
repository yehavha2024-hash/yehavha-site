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
