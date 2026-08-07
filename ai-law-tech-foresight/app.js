(() => {
  'use strict';

  const meta = window.AI_FORESIGHT_META || {};
  const data = Array.isArray(window.AI_FORESIGHT_RECORDS) ? window.AI_FORESIGHT_RECORDS : [];
  const comparative = Array.isArray(window.AI_FORESIGHT_COMPARATIVE) ? window.AI_FORESIGHT_COMPARATIVE : [];
  const gaps = Array.isArray(window.AI_FORESIGHT_GAPS) ? window.AI_FORESIGHT_GAPS : [];
  const policies = Array.isArray(window.AI_FORESIGHT_POLICIES) ? window.AI_FORESIGHT_POLICIES : [];
  const $ = (id) => document.getElementById(id);
  const searchInput = $('searchInput');
  const stageFilter = $('stageFilter');
  const lawFilter = $('lawFilter');
  const phdFilter = $('phdFilter');
  const techCards = $('techCards');
  const emptyState = $('emptyState');
  const dialog = $('detailDialog');
  const detailContent = $('detailContent');

  const esc = (value='') => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const list = (items=[]) => items.length ? `<ul>${items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '<p class="muted">추가 연구 예정</p>';
  const chips = (items=[]) => items.map(x => `<span>${esc(x)}</span>`).join('');
  const section = (title, body) => `<section class="detail-section"><h4>${esc(title)}</h4>${body}</section>`;
  const textOf = (values=[]) => values.flat(Infinity).filter(Boolean).join(' ').toLowerCase();

  const lawAxisKeywords = {
    '인공지능법':['인공지능','ai 기본','고영향','위험기반'],
    '민사책임법':['민법','불법행위','민사책임','과실','인과관계'],
    '제조물책임법':['제조물','제품책임','결함'],
    '소프트웨어법':['소프트웨어','업데이트','코드'],
    '개인정보·데이터법':['개인정보','데이터','신용정보','위치정보','민감정보'],
    '저작권법':['저작권','공정이용','저작물'],
    '지식재산법':['특허','지식재산','영업비밀','발명'],
    '자율주행자동차법':['자율주행','자동차','도로교통','ads','adas'],
    '로봇법':['로봇','휴머노이드','physical ai'],
    '보험법':['보험','공탁','책임기금'],
    '회사법·법인론':['회사','법인','내부통제','책임관리인','기능적 법적 지위'],
    '증명책임·소송법':['증명','소송','문서제출','로그','입증','증거']
  };

  function renderStatic() {
    $('researchFlow').innerHTML = (meta.researchFlow || []).map((item, i, arr) => `<span>${esc(item)}</span>${i < arr.length - 1 ? '<b>→</b>' : ''}`).join('');
    $('lawAxes').innerHTML = chips(meta.lawAxes || []);
    $('sourceTypes').innerHTML = chips(meta.sourceTypes || []);
    $('phdTags').innerHTML = chips(meta.phdTags || []);

    const lineage = meta.thesisLineage || {};
    const path = lineage.path || [];
    const master = lineage.master || {};
    $('thesisLineage').innerHTML = `
      <div class="lineage-path">${path.map((x,i)=>`<span>${esc(x)}</span>${i < path.length - 1 ? '<b>→</b>' : ''}`).join('')}</div>
      <p class="master-link-status"><strong>${esc(master.label || '석사논문')}</strong> · ${master.url ? `<a href="${esc(master.url)}" target="_blank" rel="noopener noreferrer">공식 원문 보기 ↗</a>` : esc(master.status || '공식 공개 링크 확인 후 연결')}</p>`;

    $('stats').innerHTML = [
      [data.length, '기술 연구'],
      [comparative.length, '비교법 권역'],
      [gaps.length, '법적 공백'],
      [policies.length, '정책·입법 수단']
    ].map(([n,label]) => `<div class="stat"><strong>${n}</strong><span>${esc(label)}</span></div>`).join('');
  }

  function populateFilters() {
    const stages = ['전체', ...new Set(data.map(x => x.stage))];
    stageFilter.innerHTML = stages.map(x => `<option value="${esc(x)}">${esc(x)}</option>`).join('');
    lawFilter.innerHTML = ['전체', ...(meta.lawAxes || [])].map(x => `<option value="${esc(x)}">${esc(x)}</option>`).join('');
    phdFilter.innerHTML = ['전체', ...(meta.phdTags || [])].map(x => `<option value="${esc(x)}">${esc(x)}</option>`).join('');
  }

  function searchable(item) {
    return textOf([item.title,item.en,item.stage,item.maturity,item.summary,item.scenarioNote,item.tech,item.currentLaw,item.issues,item.doctrine,item.gaps,item.comparative,item.policy,item.governance,item.legislation,item.phdTags]);
  }

  function matchesLawAxis(item, axis) {
    if (axis === '전체') return true;
    const haystack = searchable(item);
    return (lawAxisKeywords[axis] || [axis]).some(keyword => haystack.includes(keyword.toLowerCase()));
  }

  function filtered() {
    const q = searchInput.value.trim().toLowerCase();
    const stage = stageFilter.value;
    const law = lawFilter.value;
    const phd = phdFilter.value;
    return data.filter(item => {
      const stageOk = stage === '전체' || item.stage === stage;
      const lawOk = matchesLawAxis(item, law);
      const phdOk = phd === '전체' || (item.phdTags || []).includes(phd);
      return stageOk && lawOk && phdOk && (!q || searchable(item).includes(q));
    }).sort((a,b) => a.order - b.order);
  }

  function renderCards() {
    const items = filtered();
    emptyState.hidden = items.length > 0;
    techCards.innerHTML = items.map(item => `
      <article class="tech-card">
        <div class="sequence">${String(item.order).padStart(2,'0')}</div>
        <div class="tech-body">
          <div class="card-top"><span class="stage ${item.stage.includes('시나리오') ? 'scenario' : ''}">${esc(item.stage)}</span><span class="maturity">${esc(item.maturity)}</span></div>
          <h3>${esc(item.title)} <small>${esc(item.en)}</small></h3>
          <p>${esc(item.summary)}</p>
          <div class="card-chips">${chips((item.phdTags || []).slice(0,4))}</div>
          ${item.scenarioNote ? `<p class="scenario-note">예측 구분 · ${esc(item.scenarioNote)}</p>` : ''}
          <button class="detail-button" data-id="${esc(item.id)}">선제연구 노트 보기 →</button>
        </div>
      </article>`).join('');

    techCards.querySelectorAll('.detail-button').forEach(button => {
      button.addEventListener('click', () => openDetail(button.dataset.id));
    });
  }

  function renderResearchUnits() {
    const q = searchInput.value.trim().toLowerCase();
    const qMatch = values => !q || textOf(values).includes(q);

    const comp = comparative.filter(x => qMatch([x.jurisdiction,x.priority,x.focus,x.materials,x.caseMethod]));
    $('comparativeCards').innerHTML = comp.map(x => `
      <article class="research-card"><div class="research-card-top"><strong>${esc(x.jurisdiction)}</strong><span>${esc(x.priority)}</span></div><div class="card-chips">${chips(x.focus || [])}</div><h4>축적자료</h4>${list(x.materials || [])}<p class="method"><strong>판례 분석:</strong> ${esc(x.caseMethod)}</p></article>`).join('');

    const gapItems = gaps.filter(x => qMatch([x.title,x.problem,x.existing,x.solutions]));
    $('gapCards').innerHTML = gapItems.map(x => `
      <article class="research-card gap-card"><strong>${esc(x.title)}</strong><p>${esc(x.problem)}</p><h4>기존 법리 검토</h4><p>${esc(x.existing)}</p><h4>가능한 해결방법</h4>${list(x.solutions || [])}</article>`).join('');

    const policyItems = policies.filter(x => qMatch([x.title,x.role,x.trigger,x.caution]));
    $('policyCards').innerHTML = policyItems.map(x => `
      <article class="research-card policy-card"><strong>${esc(x.title)}</strong><p>${esc(x.role)}</p><h4>적용 검토 시점</h4><p>${esc(x.trigger)}</p><h4>설계상 주의</h4><p>${esc(x.caution)}</p></article>`).join('');
  }

  function openDetail(id) {
    const item = data.find(x => x.id === id);
    if (!item) return;
    detailContent.innerHTML = `
      <p class="eyebrow">${esc(item.stage)} · ${esc(item.maturity)}</p>
      <h3 class="detail-title">${esc(item.title)} <small>${esc(item.en)}</small></h3>
      <p class="detail-summary">${esc(item.summary)}</p>
      ${item.scenarioNote ? `<div class="forecast-warning"><strong>기술예측·시나리오</strong><p>${esc(item.scenarioNote)}</p></div>` : ''}
      ${section('1. 기술', list(item.tech || []))}
      ${section('2. 현행법', list(item.currentLaw || []))}
      ${section('3. 법적 쟁점', list(item.issues || []))}
      ${section('4. 기존 법리 적용 가능성', list(item.doctrine || []))}
      ${section('5. 법적 공백', list(item.gaps || []))}
      ${section('6. 비교법', list(item.comparative || []))}
      ${section('7. 정책', list(item.policy || []))}
      ${section('8. 거버넌스', list(item.governance || []))}
      ${section('9. 입법대안', list(item.legislation || []))}
      ${section('박사논문 연결 태그', `<div class="card-chips detail-tags">${chips(item.phdTags || [])}</div>`)}
      <div class="solution-principle"><strong>연구 원칙</strong><p>법적 공백을 발견한 경우 문제 제기에서 멈추지 않고 현행법 해석, 법률 개정, 특별법, 로그·증명책임, 보험·공탁·책임재산, 기능적 법적 지위 등 가능한 해결방법을 비교합니다.</p></div>`;
    dialog.showModal();
  }

  function rerender() {
    renderCards();
    renderResearchUnits();
  }

  searchInput.addEventListener('input', rerender);
  [stageFilter, lawFilter, phdFilter].forEach(el => el.addEventListener('change', renderCards));

  renderStatic();
  populateFilters();
  rerender();
})();
