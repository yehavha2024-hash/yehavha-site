(() => {
  'use strict';

  const pack = Array.isArray(window.LEGAL_PHILOSOPHY_DISSERTATION_CITATIONS) ? window.LEGAL_PHILOSOPHY_DISSERTATION_CITATIONS : [];
  const meta = window.LEGAL_PHILOSOPHY_DISSERTATION_CITATION_META || {};
  const terminology = window.LEGAL_PHILOSOPHY_TERMINOLOGY || {};
  const localize = value => typeof terminology.localize === 'function' ? terminology.localize(value) : String(value ?? '');
  const root = document.getElementById('doctoralCitationPack');
  const summary = document.getElementById('doctoralCitationSummary');
  if (!root) return;

  const bibliographyKo = Object.freeze({
    'kurki-functional-personhood': { author: '비사 A. J. 쿠르키', title: '법인격 이론' },
    'solum-possibility-question': { author: '로런스 B. 솔럼', title: '인공지능을 위한 법인격' },
    'chesterman-limits': { author: '사이먼 체스터먼', title: '인공지능과 법인격의 한계' },
    'bryson-synthetic-warning': { author: '조애나 J. 브라이슨, 미하일리스 E. 디아만티스 & 토머스 D. 그랜트', title: '사람들의, 사람들을 위한, 사람들에 의한: 합성적 인격체의 법적 공백' },
    'matthias-gap': { author: '안드레아스 마티아스', title: '책임공백: 학습 자동기계의 행위에 대한 책임 귀속' },
    'santoni-tracing': { author: '필리포 산토니 데 시오 & 예룬 판 덴 호번', title: '자율시스템에 대한 의미 있는 인간 통제: 철학적 고찰' },
    'nyholm-collaboration': { author: '스벤 뉘홀름', title: '자동화시스템에 행위자성 귀속하기: 인간-로봇 협업과 책임의 위치에 관한 성찰' },
    'johnson-no-moral-agent': { author: '데버라 G. 존슨', title: '컴퓨터 시스템: 도덕적 개체이지만 도덕적 행위자는 아니다' },
    'kiener-abundance': { author: '막시밀리안 키너', title: 'AI와 책임: 공백이 아니라 책임의 다수성' },
    'fletcher-nonreciprocal-risk': { author: '조지 P. 플레처', title: '불법행위 이론에서의 공정성과 효용' },
    'barak-balancing': { author: '아하론 바라크', title: '비례성: 헌법상 권리와 그 제한' },
    'floridi-sanders-separation': { author: '루치아노 플로리디 & J. W. 샌더스', title: '인공 행위자의 도덕성에 관하여' }
  });

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const txt = value => esc(localize(value));
  const citationHtml = value => typeof window.LEGAL_CITATION_STANDARD?.renderCitation === 'function'
    ? window.LEGAL_CITATION_STANDARD.renderCitation(value)
    : esc(value);
  const bilingual = item => bibliographyKo[item.key] || { author: item.author, title: item.title };
  const axisCounts = pack.reduce((acc, item) => {
    acc[item.axis] = (acc[item.axis] || 0) + 1;
    return acc;
  }, {});

  if (summary) {
    summary.innerHTML = [
      `<span class="strong">핵심문헌 ${pack.length}개</span>`,
      `<span>${txt(meta.status || '박사논문 투입')}</span>`,
      ...Object.entries(axisCounts).map(([axis, count]) => `<span>${txt(axis)} ${count}</span>`),
      `<span>검증일 ${esc(meta.checked || '')}</span>`
    ].join('');
  }

  root.innerHTML = pack.map((item, index) => {
    const ko = bilingual(item);
    return `
    <details class="doctoral-citation-card" ${index === 0 ? 'open' : ''}>
      <summary>
        <span class="doctoral-rank">${esc(item.rank)}</span>
        <span class="doctoral-summary-copy">
          <strong><span class="doctoral-author-en" lang="en">${esc(item.author)}</span><span class="doctoral-author-ko">(${esc(ko.author)})</span></strong>
          <small><span>${txt(item.role)}</span><span class="doctoral-title-en" lang="en">${esc(item.title)}</span><span class="doctoral-title-ko">(${esc(ko.title)})</span></small>
        </span>
      </summary>
      <div class="doctoral-citation-body">
        <div class="doctoral-source-head">
          <h4><span class="doctoral-title-en" lang="en">${esc(item.title)}</span><span class="doctoral-title-ko">(${esc(ko.title)})</span></h4>
          <p>${esc(item.edition)}</p>
          <div class="doctoral-meta-row"><span>${txt(item.axis)}</span><span>${txt(item.role)}</span><span>${txt(item.verification)}</span></div>
        </div>
        <div class="doctoral-grid">
          <div class="doctoral-block wide">
            <strong>직접 인용 원문</strong>
            <blockquote class="doctoral-quote" lang="en">“${esc(item.originalQuote)}”</blockquote>
            <p class="doctoral-quote-ko">의미: ${txt(item.quoteKo)}</p>
          </div>
          <div class="doctoral-block">
            <strong>정확한 판본·페이지</strong>
            <p>${esc(item.edition)}<br>${txt(item.pinpoint)}</p>
          </div>
          <div class="doctoral-block">
            <strong>논문 각주 표준안</strong>
            <p class="doctoral-footnote" data-citation-standard="${esc(window.LEGAL_CITATION_STANDARD?.version || '')}">${citationHtml(item.footnote)}</p>
          </div>
          <div class="doctoral-block wide">
            <strong>해당 논증에서의 사용 위치</strong>
            <p>${txt(item.placement)}</p>
          </div>
          <div class="doctoral-block wide doctoral-draft">
            <strong>본문 투입 문장</strong>
            <p>${txt(item.draftSentence)}</p>
          </div>
          <div class="doctoral-block wide doctoral-caution">
            <strong>인용·논증상 한계</strong>
            <p>${txt(item.caution)}</p>
          </div>
        </div>
        ${item.url ? `<a class="doctoral-source-link" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">원문·판본 확인 ↗</a>` : ''}
      </div>
    </details>
  `;
  }).join('');
})();