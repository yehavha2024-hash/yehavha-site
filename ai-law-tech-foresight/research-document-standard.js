(() => {
  'use strict';

  const dialog = document.getElementById('detailDialog');
  const content = document.getElementById('detailContent');
  const siteTitle = (document.querySelector('h1')?.textContent || document.title || 'YEHAVHA NEXUS').trim();
  const aiNotice = 'AI 활용 안내: 일부 기술·법률 연구자료의 탐색·구조화·초안 작성에 생성형 AI를 활용했으며, 사실과 전망의 구분, 법적 분석, 출처 검토와 최종 편집은 운영자가 관리합니다.';

  function makeVisible(notice) {
    if (!notice) return;
    notice.textContent = aiNotice;
    notice.style.setProperty('display', 'block', 'important');
    notice.style.setProperty('visibility', 'visible', 'important');
    notice.style.setProperty('opacity', '1', 'important');
    notice.style.setProperty('height', 'auto', 'important');
    notice.style.setProperty('max-height', 'none', 'important');
    notice.style.setProperty('overflow', 'visible', 'important');
    notice.style.setProperty('position', 'static', 'important');
    notice.style.setProperty('clip', 'auto', 'important');
    notice.style.setProperty('clip-path', 'none', 'important');
    notice.style.setProperty('white-space', 'normal', 'important');
  }

  function insertAfterContact(scope, contactLink) {
    if (!scope || !contactLink) return;
    let notice = scope.querySelector('.ai-disclosure, [data-ai-disclosure="main"]');
    if (!notice) {
      notice = document.createElement('p');
      notice.className = 'ai-disclosure';
      notice.dataset.aiDisclosure = 'main';
      const contactRow = contactLink.closest('p, li, div') || contactLink.parentElement;
      if (contactRow && contactRow.parentElement) contactRow.insertAdjacentElement('afterend', notice);
      else scope.appendChild(notice);
    }
    makeVisible(notice);
  }

  function ensureSiteFooterDisclosure() {
    let handled = false;

    document.querySelectorAll('footer').forEach(footer => {
      if (footer.classList.contains('document-footer')) return;
      const contactLink = footer.querySelector('a[href^="mailto:"]');
      if (!contactLink) return;
      insertAfterContact(footer, contactLink);
      handled = true;
    });

    if (handled) return;

    document.querySelectorAll('a[href^="mailto:"]').forEach(contactLink => {
      if (contactLink.closest('.document-footer, dialog')) return;
      const scope = contactLink.closest('footer, section, div') || document.body;
      insertAfterContact(scope, contactLink);
    });
  }

  ensureSiteFooterDisclosure();

  if (!dialog || !content) {
    window.addEventListener('load', ensureSiteFooterDisclosure, { once: true });
    new MutationObserver(() => queueMicrotask(ensureSiteFooterDisclosure))
      .observe(document.documentElement, { childList: true, subtree: true });
    return;
  }

  function ensureFooter() {
    let footer = content.querySelector('.document-footer');
    if (!footer) {
      footer = document.createElement('footer');
      footer.className = 'document-footer';
      footer.setAttribute('aria-label', '연구문서 하단');
      footer.innerHTML = `
        <div class="document-footer-copy">
          <strong>${siteTitle}</strong>
          <p>Copyright © 이명훈 2026. All rights reserved.</p>
          <p>문의 <a href="mailto:kimbrighth@gmail.com">kimbrighth@gmail.com</a></p>
          <p class="ai-disclosure">${aiNotice}</p>
        </div>
        <div class="document-actions">
          <button type="button" class="document-action" data-standard-top>맨 위로 ↑</button>
          <button type="button" class="document-action close-action" data-standard-close>창 닫기 ×</button>
        </div>`;
      content.appendChild(footer);
      return;
    }

    const footerCopy = footer.querySelector('.document-footer-copy');
    if (!footerCopy) return;
    let notice = footerCopy.querySelector('.ai-disclosure');
    if (!notice) {
      notice = document.createElement('p');
      notice.className = 'ai-disclosure';
      notice.textContent = aiNotice;
      const contact = footerCopy.querySelector('a[href^="mailto:"]')?.closest('p');
      if (contact) contact.insertAdjacentElement('afterend', notice);
      else footerCopy.appendChild(notice);
    }
    makeVisible(notice);
  }

  function ensureToc() {
    const sections = [...content.querySelectorAll('.article-section, .detail-section')];
    if (!sections.length) return;

    sections.forEach((section, index) => {
      const number = String(index + 1).padStart(2, '0');
      section.id = `document-section-${number}`;
      section.dataset.documentNumber = number;
      const visibleNumber = section.querySelector('.section-number');
      if (visibleNumber) visibleNumber.textContent = number;
    });

    let toc = content.querySelector('.document-toc');
    if (!toc) {
      toc = document.createElement('nav');
      toc.className = 'document-toc';
      toc.setAttribute('aria-label', '문서 목차');
      const header = content.querySelector('.article-header');
      const meta = content.querySelector('.detail-meta-row');
      if (header) header.insertAdjacentElement('afterend', toc);
      else if (meta) meta.insertAdjacentElement('afterend', toc);
      else content.prepend(toc);
    }

    toc.innerHTML = `<strong class="document-toc-title">목차</strong><div class="document-toc-list">${sections.map((section, index) => {
      const number = String(index + 1).padStart(2, '0');
      const title = section.querySelector('h4')?.textContent?.trim() || `항목 ${number}`;
      return `<button type="button" data-toc-target="document-section-${number}"><span>${number}</span><b>${title}</b></button>`;
    }).join('')}</div>`;
  }

  function standardize() {
    ensureSiteFooterDisclosure();
    if (!content.childElementCount) return;
    ensureToc();
    ensureFooter();
  }

  content.addEventListener('click', event => {
    const tocButton = event.target.closest('[data-toc-target]');
    if (tocButton) {
      const target = document.getElementById(tocButton.dataset.tocTarget);
      if (target) content.scrollTo({ top: Math.max(0, target.offsetTop - 14), behavior: 'smooth' });
      return;
    }
    if (event.target.closest('[data-standard-top]')) {
      content.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (event.target.closest('[data-standard-close]')) dialog.close();
  });

  const detailObserver = new MutationObserver(() => queueMicrotask(standardize));
  detailObserver.observe(content, { childList: true, subtree: false });

  const pageObserver = new MutationObserver(() => queueMicrotask(ensureSiteFooterDisclosure));
  pageObserver.observe(document.documentElement, { childList: true, subtree: true });

  dialog.addEventListener('close', () => content.scrollTo({ top: 0, behavior: 'auto' }));
  window.addEventListener('load', ensureSiteFooterDisclosure, { once: true });
  standardize();
})();