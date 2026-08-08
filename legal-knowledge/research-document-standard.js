(() => {
  'use strict';

  const dialog = document.getElementById('detailDialog');
  const content = document.getElementById('detailContent');
  if (!dialog || !content) return;

  const siteTitle = (document.querySelector('h1')?.textContent || document.title || 'YEHAVHA NEXUS').trim();

  function ensureFooter() {
    if (content.querySelector('.document-footer')) return;
    const footer = document.createElement('footer');
    footer.className = 'document-footer';
    footer.setAttribute('aria-label', '연구문서 하단');
    footer.innerHTML = `
      <div class="document-footer-copy">
        <strong>${siteTitle}</strong>
        <p>Copyright © 이명훈 2026. All rights reserved.</p>
        <p>문의 <a href="mailto:kimbrighth@gmail.com">kimbrighth@gmail.com</a></p>
      </div>
      <div class="document-actions">
        <button type="button" class="document-action" data-standard-top>맨 위로 ↑</button>
        <button type="button" class="document-action close-action" data-standard-close>창 닫기 ×</button>
      </div>`;
    content.appendChild(footer);
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

  const observer = new MutationObserver(() => queueMicrotask(standardize));
  observer.observe(content, { childList: true, subtree: false });
  dialog.addEventListener('close', () => content.scrollTo({ top: 0, behavior: 'auto' }));
  standardize();
})();
