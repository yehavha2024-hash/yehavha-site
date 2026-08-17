(() => {
  'use strict';

  const dialog = document.getElementById('detailDialog');
  const content = document.getElementById('detailContent');
  if (!dialog || !content) return;

  const siteTitle = (document.querySelector('h1')?.textContent || document.title || 'YEHAVHA NEXUS').trim();
  const aiNotice = 'AI 활용 안내: 일부 법률 연구노트·사례·요약의 초안 작성과 구조화 과정에서 생성형 AI를 보조적으로 활용했습니다. 법령·판례·공식자료의 확인, 법적 판단, 내용 검토 및 최종 편집은 운영자가 수행·관리합니다. 본 자료는 개별 사건에 대한 법률자문을 대체하지 않습니다.';
  const aiBaseTerm = 'AI · Artificial Intelligence (인공지능, 사람의 지능적 기능인 학습·추론·판단·인식·생성 등을 전자적 장치나 소프트웨어를 통해 인공적으로 구현하는 기술과 시스템의 총칭)';
  let terminologyRequested = false;

  function ensureTerminologyLibrary() {
    if (window.RESEARCH_TERMINOLOGY_STANDARD || terminologyRequested) return;
    terminologyRequested = true;
    const script = document.createElement('script');
    script.src = 'research-terminology-standard.js?v=20260817-2';
    script.onload = () => queueMicrotask(standardize);
    script.onerror = () => { terminologyRequested = false; };
    document.head.appendChild(script);
  }

  function syncSiteFooterNotice() {
    const siteNotice = document.querySelector('.site-footer .ai-disclosure');
    if (siteNotice) siteNotice.textContent = aiNotice;
  }

  function ensureFooter() {
    const existing = content.querySelector('.document-footer');
    if (existing) {
      const notice = existing.querySelector('.ai-disclosure');
      if (notice) notice.textContent = aiNotice;
      return;
    }
    const footer = document.createElement('footer');
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
  }

  function currentRecord() {
    const title = content.querySelector('.detail-title')?.textContent?.trim();
    if (!title) return null;
    return (window.LEGAL_KNOWLEDGE || []).find(item => item.title === title) || null;
  }

  function ensureTerminologyGuide() {
    const item = currentRecord();
    if (!item) return;

    const raw = JSON.stringify(item);
    const terms = [];
    if (/\bAI\b/i.test(raw) || raw.includes('인공지능')) terms.push(aiBaseTerm);

    const standard = window.RESEARCH_TERMINOLOGY_STANDARD;
    if (standard && typeof standard.guideFor === 'function') {
      standard.guideFor(item, 14).forEach(term => {
        if (!terms.includes(term)) terms.push(term);
      });
    }

    let guide = content.querySelector('.terminology-guide');
    if (!terms.length) {
      guide?.remove();
      return;
    }

    const signature = terms.join('|');
    if (guide?.dataset.signature === signature) return;

    if (!guide) {
      guide = document.createElement('section');
      guide.className = 'detail-section terminology-guide';
      const firstSection = content.querySelector('.detail-section');
      if (firstSection) firstSection.insertAdjacentElement('beforebegin', guide);
      else {
        const meta = content.querySelector('.detail-meta-row');
        if (meta) meta.insertAdjacentElement('afterend', guide);
        else content.prepend(guide);
      }
    }

    guide.dataset.signature = signature;
    guide.innerHTML = `
      <h4>핵심 용어 해설 · 영어 원어 → 한글 용어 → 뜻</h4>
      <ul class="detail-list terminology-list">${terms.map(term => `<li>${term}</li>`).join('')}</ul>
      <p class="standard-note">영어 전문용어는 단순 음역에 그치지 않고, 국내에서 통용되는 한글 명칭과 이 연구노트에서 필요한 개념적 의미를 함께 제시합니다.</p>`;
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

  const observer = new MutationObserver(() => queueMicrotask(standardize));
  observer.observe(content, { childList: true, subtree: false });
  dialog.addEventListener('close', () => content.scrollTo({ top: 0, behavior: 'auto' }));
  syncSiteFooterNotice();
  ensureTerminologyLibrary();
  standardize();
})();
