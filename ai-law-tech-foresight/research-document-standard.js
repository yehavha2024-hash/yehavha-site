(() => {
  'use strict';

  const dialog = document.getElementById('detailDialog');
  const content = document.getElementById('detailContent');
  if (!dialog || !content) return;

  const siteTitle = (document.querySelector('h1')?.textContent || document.title || 'AI 법·기술 선제연구 아카이브').trim();
  const aiNotice = 'AI 활용 안내: 일부 기술·법률 연구자료의 탐색·구조화·초안 작성에 생성형 AI를 활용했으며, 사실과 전망의 구분, 법적 분석, 출처 검토와 최종 편집은 운영자가 관리합니다.';
  let terminologyRequested = false;

  function ensureTerminologyLibrary() {
    if (window.RESEARCH_TERMINOLOGY_STANDARD || terminologyRequested) return;
    terminologyRequested = true;
    const script = document.createElement('script');
    script.src = 'research-terminology-standard.js?v=20260817-2';
    script.onload = () => {
      window.RESEARCH_TERMINOLOGY_STANDARD?.normalizeForesightLabels?.();
      queueMicrotask(standardize);
    };
    script.onerror = () => { terminologyRequested = false; };
    document.head.appendChild(script);
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
    } else if (notice.textContent.trim() !== aiNotice) {
      notice.textContent = aiNotice;
    }
  }

  function currentRecord() {
    const heading = content.querySelector('.article-header h3')?.textContent?.trim();
    if (!heading) return null;
    return (window.AI_FORESIGHT_RECORDS || []).find(item => heading.includes(item.title)) || null;
  }

  function ensureTerminologyGuide() {
    const standard = window.RESEARCH_TERMINOLOGY_STANDARD;
    const item = currentRecord();
    if (!standard || !item || typeof standard.guideFor !== 'function') return;

    const terms = standard.guideFor(item, 16);
    let guide = content.querySelector('.terminology-guide');
    if (!terms.length) {
      guide?.remove();
      return;
    }

    const signature = terms.join('|');
    if (guide?.dataset.signature === signature) return;

    if (!guide) {
      guide = document.createElement('section');
      guide.className = 'article-section terminology-guide';
      const header = content.querySelector('.article-header');
      if (header) header.insertAdjacentElement('afterend', guide);
      else content.prepend(guide);
    }

    guide.dataset.signature = signature;
    guide.innerHTML = `
      <div class="section-number"></div>
      <div class="article-section-body">
        <h4>핵심 용어 해설 · 영어 원어 → 한글 용어 → 뜻</h4>
        <ul>${terms.map(term => `<li>${term}</li>`).join('')}</ul>
        <p class="muted">기술용어와 영문 법개념은 원어를 유지하되, 국내에서 부르는 한글 명칭과 이 연구에서 필요한 기능·법적 의미를 함께 제시합니다.</p>
      </div>`;
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
    ensureTerminologyGuide();
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

  dialog.addEventListener('close', () => content.scrollTo({ top: 0, behavior: 'auto' }));
  ensureTerminologyLibrary();
  standardize();
})();
