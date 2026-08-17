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
    const type = txt(ref?.type || '자료');
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
          <div><h3>${txt(item.title)}</h3><p class="synthesis-chain">${txt(item.chain)}</p></div>
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
      <div class="debate-top"><span>${String(idx + 1).padStart(2,'0')}</span><h3>${txt(item.title)}</h3></div>
      <p class="debate-thesis">${txt(item.thesis)}</p>
      <div class="debate-sides">
        ${(item.sides || []).map(([title,text]) => `<div><strong>${txt(title)}</strong><p>${txt(text)}</p></div>`).join('')}
      </div>
    </article>
  `).join('');

  const philosophyTerms = [
    ['AI · Artificial Intelligence','인공지능','사람의 지능적 기능인 학습·추론·판단·인식·생성 등을 전자적 장치나 소프트웨어를 통해 인공적으로 구현하는 기술과 시스템의 총칭',['인공지능',' AI ','AI·']],
    ['Legal Positivism','법실증주의','법의 존재와 효력을 도덕적 옳고 그름과 구별하여 사회적 사실·제정·승인규칙 등 법체계 내부의 기준에서 설명하는 법철학 입장',['legal positivism','법실증주의']],
    ['Natural Law','자연법론','실정법의 정당성이나 법다움이 인간의 이성·도덕·정의와 일정한 필연적 관계를 가진다고 보는 법철학 전통',['natural law','자연법론','자연법']],
    ['Rule of Law','법치주의','공권력도 미리 정해진 일반적 법규범과 절차에 구속되고 자의적 권력행사가 제한되어야 한다는 원리',['rule of law','법치주의','법의 지배']],
    ['Legal Personhood','법인격·법적 인격','법이 특정 인간·법인·조직·기능단위를 권리·의무·재산·책임의 귀속점으로 인정하는 법적 지위',['legal personhood','legal personality','법인격','법적 인격']],
    ['Functional Personhood','기능적 법인격','완전한 인간과 동일한 인격을 부여하지 않고 특정 법적 기능에 필요한 권리·의무·재산·절차상 지위만 제한적으로 부여하는 구상',['functional personhood','기능적 법인격']],
    ['Bundle Theory of Legal Personhood','법인격의 묶음 이론','법인격을 하나의 전부 또는 전무의 지위가 아니라 권리능력·재산·책임·소송지위 등 여러 법적 요소의 묶음으로 파악하는 이론',['bundle theory of legal personhood','bundle theory','묶음 이론']],
    ['Agency','행위자성','어떤 존재나 시스템이 환경을 인식하고 목표에 따라 선택·행동하여 결과를 발생시키는 능력 또는 그 능력을 행위의 주체로 평가하는 개념',['agency','행위자성']],
    ['Agency Attribution','행위자성 귀속','어떤 행동이나 결과를 특정 인간·조직·시스템의 행위로 규범적으로 연결하는 판단',['agency attribution','행위자성 귀속']],
    ['Moral Agency','도덕적 행위자성','옳고 그름을 이해하고 이유에 따라 행동하며 도덕적 평가의 주체가 될 수 있는 능력',['moral agency','도덕적 행위자성']],
    ['Legal Agency','법적 행위자성','행위의 효과가 법적으로 특정 주체의 의사·권한·책임과 연결될 수 있는 상태 또는 능력',['legal agency','법적 행위자성']],
    ['Responsibility Gap','책임공백','자율적·학습형 시스템이 손해를 발생시켰지만 전통적 책임요건만으로 어느 인간이나 조직에 책임을 충분히 귀속하기 어려워지는 문제',['responsibility gap','책임공백']],
    ['Meaningful Human Control','의미 있는 인간 통제','사람이 명목상 승인만 하는 것이 아니라 충분한 정보·시간·권한을 가지고 시스템의 중요 행동을 이해·중단·수정할 수 있어야 한다는 통제 개념',['meaningful human control','의미 있는 인간 통제']],
    ['Responsibility','책임','행위·역할·통제·결과에 관하여 어떤 주체에게 설명·비난·배상·시정 등의 규범적 부담을 귀속하는 개념',['responsibility','책임']],
    ['Causation','인과관계','행위나 사건과 결과 사이에 사실적·법적으로 책임을 연결할 수 있는 원인관계가 존재하는지를 판단하는 개념',['causation','인과관계']],
    ['Strict Liability','엄격책임·무과실책임','일정한 위험활동이나 법정 요건에서는 행위자의 과실을 별도로 입증하지 않아도 책임을 인정하는 책임구조',['strict liability','무과실책임','엄격책임']],
    ['Corrective Justice','교정적 정의','한 당사자가 다른 당사자에게 부당한 손실을 발생시킨 관계를 배상·회복을 통해 바로잡는 정의의 원리',['corrective justice','교정적 정의']],
    ['Distributive Justice','분배적 정의','사회적 이익·부담·기회·위험을 구성원 사이에 어떤 기준으로 배분할 것인지 다루는 정의의 원리',['distributive justice','분배적 정의']],
    ['Correlativity','상관성','한 사람의 권리가 다른 사람의 의무와 대응한다는 식으로 권리와 의무의 관계를 쌍으로 파악하는 개념',['correlativity','상관성','상관관계']],
    ['Claim-right','청구권','권리자가 상대방에게 일정한 행위 또는 부작위를 요구할 수 있고 그 상대방에게 대응하는 의무가 발생하는 호펠드식 법적 지위',['claim-right','claim right','청구권']],
    ['Liberty','자유·특권','어떤 행위를 하지 않을 의무가 없다는 의미의 호펠드식 법적 지위로, 상대방에게 곧바로 적극적 의무를 발생시키는 청구권과 구별된다',['liberty','privilege','자유·특권']],
    ['Power','권능','법률관계를 창설·변경·소멸시킬 수 있는 법적 능력으로, 계약·취소·대리권 행사와 같은 법적 효과 발생능력을 설명한다',['power','권능']],
    ['Immunity','면제권','다른 주체가 자신의 법적 지위를 변경할 권능으로부터 보호되는 호펠드식 법적 지위',['immunity','면제권']],
    ['Proportionality','비례성·비례원칙','공권력의 제한조치가 목적달성에 적합하고 필요하며 침해되는 권리와 얻는 공익 사이에 균형이 있어야 한다는 심사원리',['proportionality','비례성','비례원칙']],
    ['Balancing','형량·이익형량','충돌하는 권리·원칙·공익의 무게와 구체적 사정을 비교하여 어느 쪽을 어느 범위까지 우선할지 판단하는 법적 논증방법',['balancing','형량','이익형량']],
    ['Principle','원칙','법규칙처럼 단순히 적용 여부가 결정되는 것이 아니라 다른 원칙과 충돌할 때 구체적 사안에서 무게와 최적화를 요구하는 규범유형을 가리키는 개념',['principle','원칙']],
    ['Deontology','의무론','행위의 결과만이 아니라 행위 자체의 원칙·의무·인간존중 여부를 도덕적 판단의 중심에 두는 윤리이론',['deontology','의무론']],
    ['Consequentialism','결과주의','행위나 제도의 옳고 그름을 주로 그 결과와 사회적 효용·복지에 따라 평가하는 윤리이론',['consequentialism','결과주의','효용주의']]
  ];

  const detailContent = document.getElementById('detailContent');
  const data = Array.isArray(window.LEGAL_PHILOSOPHY) ? window.LEGAL_PHILOSOPHY : [];
  const depthMap = window.LEGAL_PHILOSOPHY_DEPTH || {};

  function currentPhilosophyRecord() {
    const heading = detailContent?.querySelector('.detail-head h3')?.textContent?.trim();
    if (!heading) return null;
    return data.find(item => heading.includes(item.thinker)) || null;
  }

  function conceptGuideFor(item, limit = 12) {
    const raw = JSON.stringify([item, depthMap[item.id] || {}]).toLowerCase();
    const found = [];
    for (const [en, ko, meaning, triggers] of philosophyTerms) {
      const hit = en.startsWith('AI ·')
        ? /(^|[^a-z])ai([^a-z]|$)/i.test(raw) || raw.includes('인공지능')
        : triggers.some(trigger => raw.includes(String(trigger).toLowerCase()));
      if (hit) found.push(`${en} (${ko}, ${meaning})`);
      if (found.length >= limit) break;
    }
    return found;
  }

  function enhanceConceptGuide() {
    if (!detailContent) return;
    const item = currentPhilosophyRecord();
    if (!item) return;
    const terms = conceptGuideFor(item);
    const termList = detailContent.querySelector('.term-list');
    if (!termList) return;

    const section = termList.closest('.detail-section');
    if (!section) return;
    let guide = section.querySelector('.concept-learning-guide');
    const signature = terms.join('|');
    if (guide?.dataset.signature === signature) return;

    if (!guide) {
      guide = document.createElement('div');
      guide.className = 'concept-learning-guide';
      termList.insertAdjacentElement('beforebegin', guide);
    }
    guide.dataset.signature = signature;
    guide.innerHTML = `
      <p class="subhead">영어 원어 · 한글 통용명 · 개념의 뜻</p>
      <ul class="study-list">${terms.map(term => `<li>${esc(term)}</li>`).join('')}</ul>
      <p>단순 번역이나 음역이 아니라, 이 연구항목을 처음 읽을 때 필요한 최소 개념을 먼저 익히기 위한 해설입니다.</p>`;
  }

  if (detailContent) {
    const detailObserver = new MutationObserver(() => queueMicrotask(enhanceConceptGuide));
    detailObserver.observe(detailContent, { childList: true, subtree: true });
    enhanceConceptGuide();
  }
})();