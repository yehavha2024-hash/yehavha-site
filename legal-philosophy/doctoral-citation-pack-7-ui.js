(() => {
  'use strict';

  const pack = Array.isArray(window.LEGAL_PHILOSOPHY_DISSERTATION_CITATIONS) ? window.LEGAL_PHILOSOPHY_DISSERTATION_CITATIONS : [];
  const meta = window.LEGAL_PHILOSOPHY_DISSERTATION_CITATION_META || {};
  const root = document.getElementById('doctoralCitationPack');
  const summary = document.getElementById('doctoralCitationSummary');
  if (!root) return;

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const axisCounts = pack.reduce((acc, item) => {
    acc[item.axis] = (acc[item.axis] || 0) + 1;
    return acc;
  }, {});

  if (summary) {
    summary.innerHTML = [
      `<span class="strong">핵심문헌 ${pack.length}개</span>`,
      `<span>${esc(meta.status || '박사논문 투입')}</span>`,
      ...Object.entries(axisCounts).map(([axis, count]) => `<span>${esc(axis)} ${count}</span>`),
      `<span>검증일 ${esc(meta.checked || '')}</span>`
    ].join('');
  }

  root.innerHTML = pack.map((item, index) => `
    <details class="doctoral-citation-card" ${index === 0 ? 'open' : ''}>
      <summary>
        <span class="doctoral-rank">${esc(item.rank)}</span>
        <span class="doctoral-summary-copy">
          <strong>${esc(item.author)}</strong>
          <small>${esc(item.role)} · ${esc(item.title)}</small>
        </span>
      </summary>
      <div class="doctoral-citation-body">
        <div class="doctoral-source-head">
          <h4>${esc(item.title)}</h4>
          <p>${esc(item.edition)}</p>
          <div class="doctoral-meta-row"><span>${esc(item.axis)}</span><span>${esc(item.role)}</span><span>${esc(item.verification)}</span></div>
        </div>
        <div class="doctoral-grid">
          <div class="doctoral-block wide">
            <strong>직접 인용 원문</strong>
            <blockquote class="doctoral-quote" lang="en">“${esc(item.originalQuote)}”</blockquote>
            <p class="doctoral-quote-ko">의미: ${esc(item.quoteKo)}</p>
          </div>
          <div class="doctoral-block">
            <strong>정확한 판본·페이지</strong>
            <p>${esc(item.edition)}<br>${esc(item.pinpoint)}</p>
          </div>
          <div class="doctoral-block">
            <strong>논문 각주 표준안</strong>
            <p class="doctoral-footnote">${esc(item.footnote)}</p>
          </div>
          <div class="doctoral-block wide">
            <strong>해당 논증에서의 사용 위치</strong>
            <p>${esc(item.placement)}</p>
          </div>
          <div class="doctoral-block wide doctoral-draft">
            <strong>본문 투입 문장</strong>
            <p>${esc(item.draftSentence)}</p>
          </div>
          <div class="doctoral-block wide doctoral-caution">
            <strong>인용·논증상 한계</strong>
            <p>${esc(item.caution)}</p>
          </div>
        </div>
        ${item.url ? `<a class="doctoral-source-link" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">원문·판본 확인 ↗</a>` : ''}
      </div>
    </details>
  `).join('');
})();
