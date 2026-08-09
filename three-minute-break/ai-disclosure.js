(() => {
  const text = 'AI 활용 안내: 일부 명언 해설·생활영어·성경 핵심 의미 요약·퀴즈 콘텐츠는 생성형 AI를 활용해 초안 또는 구성안을 만들었으며, 운영자가 검토·편집합니다.';

  function ensureAiDisclosure() {
    const footer = document.querySelector('.site-footer');
    if (!footer) return;
    let meta = footer.querySelector('.footer-meta');
    if (!meta) {
      meta = document.createElement('div');
      meta.className = 'footer-meta';
      footer.appendChild(meta);
    }
    let notice = meta.querySelector('.ai-disclosure');
    if (!notice) {
      notice = document.createElement('p');
      notice.className = 'ai-disclosure';
      const contact = meta.querySelector('a[href^="mailto:"]')?.closest('p');
      if (contact) contact.insertAdjacentElement('afterend', notice);
      else meta.appendChild(notice);
    }
    notice.textContent = text;
    notice.style.marginTop = '8px';
    notice.style.paddingTop = '8px';
    notice.style.borderTop = '1px solid rgba(49,67,62,.12)';
    notice.style.lineHeight = '1.65';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureAiDisclosure, { once: true });
  } else {
    ensureAiDisclosure();
  }
  window.addEventListener('pageshow', ensureAiDisclosure);
})();
