(() => {
  'use strict';

  const data = Array.isArray(window.LEGAL_KNOWLEDGE) ? window.LEGAL_KNOWLEDGE : [];
  const countEl = document.getElementById('contentCount');
  if (countEl) {
    const cases = data.filter(item => item.isCaseNote);
    const verified = cases.filter(item => item.caseOriginalVerified).length;
    countEl.textContent = `연구 항목 ${data.length} · 판례 원문검증 ${verified}/${cases.length}`;
  }

  const stats = document.getElementById('stats');
  if (stats) stats.remove();

  const stripTrailingPeriod = element => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let last = null;
    while (walker.nextNode()) {
      if (walker.currentNode.nodeValue.trim()) last = walker.currentNode;
    }
    if (last) last.nodeValue = last.nodeValue.replace(/[.。．]+(\s*)$/, '$1');
  };

  document.querySelectorAll('h1,h2,h3,h4').forEach(stripTrailingPeriod);

  document.querySelectorAll('a[href="#top"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      history.replaceState(null, '', location.pathname + location.search + '#top');
    });
  });
})();
