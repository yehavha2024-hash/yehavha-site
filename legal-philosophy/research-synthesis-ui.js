(() => {
  'use strict';

  const synthesis = Array.isArray(window.LEGAL_PHILOSOPHY_SYNTHESIS) ? window.LEGAL_PHILOSOPHY_SYNTHESIS : [];
  const debates = Array.isArray(window.LEGAL_PHILOSOPHY_DEBATES) ? window.LEGAL_PHILOSOPHY_DEBATES : [];
  const terminology = window.LEGAL_PHILOSOPHY_TERMINOLOGY || {};
  const localize = value => typeof terminology.localize === 'function' ? terminology.localize(value) : String(value ?? '');
  const synthesisGrid = document.getElementById('synthesisGrid');
  const debateGrid = document.getElementById('debateGrid');
  if (!synthesisGrid || !debateGrid) return;

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const txt = value => esc(localize(value));

  const renderReference = ref => {
    const type = esc(ref?.type || '자료');
    const citation = esc(ref?.citation || '');
    const pinpoint = txt(ref?.pinpoint || '');
    const url = String(ref?.url || '').trim();
    const link = url
      ? `<a class="citation-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">자료 확인 ↗</a>`
      : '<span class="citation-link citation-link-muted">원저·판본 확인</span>';
    return `
      <li class="citation-item">
        <div class="citation-meta"><span class="citation-type">${type}</span>${link}</div>
        <p class="citation-text">${citation}</p>
        ${pinpoint ? `<p class="citation-pinpoint"><strong>인용 위치</strong> ${pinpoint}</p>` : ''}
      </li>
    `;
  };

  const renderLegacySources = sources => {
    if (!Array.isArray(sources) || !sources.length) return '';
    return `
      <div class="synthesis-sources">
        <strong>주요 검증자료</strong>
        ${sources.map(([label,url]) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`).join('')}
      </div>
    `;
  };

  synthesisGrid.innerHTML = synthesis.map(item => {
    const references = Array.isArray(item.references) ? item.references : [];
    return `
      <article class="synthesis-card">
        <div class="synthesis-head">
          <span class="synthesis-no">${esc(item.no)}</span>
          <div><h3>${esc(item.title)}</h3><p class="synthesis-chain">${esc(item.chain)}</p></div>
        </div>
        <p class="synthesis-proposition">${txt(item.proposition)}</p>
        <details class="synthesis-detail">
          <summary>논증·원저·반대학설 확인</summary>
          <div class="synthesis-body">
            <div class="argument-label">학술적 논증 전개</div>
            ${(item.argument || []).map((p, i) => `<div class="argument-step"><span>${String(i + 1).padStart(2,'0')}</span><p>${txt(p)}</p></div>`).join('')}
            ${item.researchConclusion ? `
              <div class="research-conclusion">
                <strong>연구상 도출 가능한 결론</strong>
                <p>${txt(item.researchConclusion)}</p>
              </div>
            ` : ''}
            <div class="synthesis-caution"><strong>해석상 주의</strong><p>${txt(item.caution)}</p></div>
            ${references.length ? `
              <div class="citation-section">
                <div class="citation-heading">
                  <strong>원저·주요 논문·반대학설</strong>
                  <span>쪽수는 확인 가능한 범위만 표시하며 판본별 차이는 재확인 대상으로 남깁니다.</span>
                </div>
                <ol class="citation-list">${references.map(renderReference).join('')}</ol>
              </div>
            ` : renderLegacySources(item.sources)}
          </div>
        </details>
      </article>
    `;
  }).join('');

  debateGrid.innerHTML = debates.map((item, idx) => `
    <article class="debate-card">
      <div class="debate-top"><span>${String(idx + 1).padStart(2,'0')}</span><h3>${esc(item.title)}</h3></div>
      <p class="debate-thesis">${txt(item.thesis)}</p>
      <div class="debate-sides">
        ${(item.sides || []).map(([title,text]) => `<div><strong>${txt(title)}</strong><p>${txt(text)}</p></div>`).join('')}
      </div>
    </article>
  `).join('');
})();