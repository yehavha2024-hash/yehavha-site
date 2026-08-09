(() => {
  'use strict';

  const text = 'AI 활용 안내: 일부 기술·법률 연구자료의 탐색·구조화·초안 작성에 생성형 AI를 활용했으며, 사실과 전망의 구분, 법적 분석, 출처 검토와 최종 편집은 운영자가 관리합니다.';

  function ensureNotice(container) {
    if (!container) return;
    let notice = container.querySelector('.ai-disclosure');
    if (!notice) {
      const contact = container.querySelector('a[href^="mailto:"]')?.closest('p');
      notice = document.createElement('p');
      notice.className = 'ai-disclosure';
      notice.textContent = text;
      if (contact) contact.insertAdjacentElement('afterend', notice);
      else container.appendChild(notice);
    } else if (!notice.textContent.trim()) {
      notice.textContent = text;
    }
  }

  function ensureAiDisclosure() {
    document.querySelectorAll('.site-footer .footer-meta, .document-footer .document-footer-copy').forEach(ensureNotice);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureAiDisclosure, { once: true });
  } else {
    ensureAiDisclosure();
  }

  window.addEventListener('load', ensureAiDisclosure, { once: true });
})();
