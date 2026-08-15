(() => {
  'use strict';

  function countWords(text) {
    return String(text || '').trim().split(/\s+/).filter(Boolean).length;
  }

  function applyFocusedReadingLabels() {
    const readTab = document.querySelector('.category[data-category="read"]');
    if (readTab) {
      const number = readTab.querySelector('span')?.outerHTML || '<span>01</span>';
      if (!/집중읽기/.test(readTab.textContent || '')) readTab.innerHTML = `${number}집중읽기`;
    }

    const badge = document.getElementById('badge');
    if (badge && /장문읽기/.test(badge.textContent || '')) badge.textContent = '집중읽기';

    const partBadge = document.getElementById('partBadge');
    if (partBadge && /LONG READING/.test(partBadge.textContent || '')) partBadge.textContent = 'FOCUSED READING';

    const headline = document.getElementById('dayHeadline');
    if (headline && /장문독해/.test(headline.textContent || '')) {
      headline.textContent = headline.textContent.replace('장문독해', '집중독해');
    }

    const paragraphs = [...document.querySelectorAll('.long-reading p')];
    if (paragraphs.length) {
      const actualCount = countWords(paragraphs.map(p => p.textContent).join(' '));
      const firstMeta = document.querySelector('.reading-meta span');
      if (firstMeta) firstMeta.textContent = `${actualCount.toLocaleString('ko-KR')} words · 집중 본문`;
    }
  }

  let queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      applyFocusedReadingLabels();
    });
  }

  const start = () => {
    applyFocusedReadingLabels();
    const target = document.getElementById('learningCard') || document.body;
    new MutationObserver(schedule).observe(target, { childList: true, subtree: true, characterData: true });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
