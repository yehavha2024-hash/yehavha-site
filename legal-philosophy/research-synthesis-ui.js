(() => {
  'use strict';

  const synthesis = Array.isArray(window.LEGAL_PHILOSOPHY_SYNTHESIS) ? window.LEGAL_PHILOSOPHY_SYNTHESIS : [];
  const debates = Array.isArray(window.LEGAL_PHILOSOPHY_DEBATES) ? window.LEGAL_PHILOSOPHY_DEBATES : [];
  const synthesisGrid = document.getElementById('synthesisGrid');
  const debateGrid = document.getElementById('debateGrid');
  if (!synthesisGrid || !debateGrid) return;

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  synthesisGrid.innerHTML = synthesis.map(item => `
    <article class="synthesis-card">
      <div class="synthesis-head">
        <span class="synthesis-no">${esc(item.no)}</span>
        <div><h3>${esc(item.title)}</h3><p class="synthesis-chain">${esc(item.chain)}</p></div>
      </div>
      <p class="synthesis-proposition">${esc(item.proposition)}</p>
      <details class="synthesis-detail">
        <summary>논증 전개와 학술적 근거</summary>
        <div class="synthesis-body">
          ${(item.argument || []).map((p, i) => `<div class="argument-step"><span>${String(i + 1).padStart(2,'0')}</span><p>${esc(p)}</p></div>`).join('')}
          <div class="synthesis-caution"><strong>해석상 주의</strong><p>${esc(item.caution)}</p></div>
          <div class="synthesis-sources"><strong>주요 검증자료</strong>${(item.sources || []).map(([label,url]) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`).join('')}</div>
        </div>
      </details>
    </article>
  `).join('');

  debateGrid.innerHTML = debates.map((item, idx) => `
    <article class="debate-card">
      <div class="debate-top"><span>${String(idx + 1).padStart(2,'0')}</span><h3>${esc(item.title)}</h3></div>
      <p class="debate-thesis">${esc(item.thesis)}</p>
      <div class="debate-sides">
        ${(item.sides || []).map(([title,text]) => `<div><strong>${esc(title)}</strong><p>${esc(text)}</p></div>`).join('')}
      </div>
    </article>
  `).join('');
})();