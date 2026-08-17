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

  const literature = document.querySelector('[aria-labelledby="literature-archive-title"]');
  if (literature && !document.getElementById('legal-mind-training-entry')) {
    const section = document.createElement('section');
    section.className = 'notice';
    section.id = 'legal-mind-training-entry';
    section.setAttribute('aria-labelledby', 'legal-mind-training-title');
    section.innerHTML = `
      <div>
        <div class="section-kicker">LEGAL MIND · CASE TRAINING</div>
        <h2 id="legal-mind-training-title">리걸 마인드 · 사례해결 훈련</h2>
      </div>
      <p>판례와 현실 분쟁을 사실관계 → 법적 사실 → 법률관계 → 쟁점 → 법규범·판례 → 증거·증명책임 → 주장·반론 → 포섭 → 절차·구제 → 결론·사례변형으로 반복 훈련합니다. <a href="./legal-mind/"><strong>사례해결 훈련 시작 →</strong></a></p>`;
    literature.insertAdjacentElement('afterend', section);
  }

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
