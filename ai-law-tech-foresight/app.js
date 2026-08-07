(() => {
  'use strict';

  const meta = window.AI_FORESIGHT_META || {};
  const data = Array.isArray(window.AI_FORESIGHT_RECORDS) ? window.AI_FORESIGHT_RECORDS : [];
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

  function renderStatic() {
    $('researchFlow').innerHTML = (meta.researchFlow || []).map((item, i, arr) => `<span>${esc(item)}</span>${i < arr.length - 1 ? '<b>→</b>' : ''}`).join('');
    $('lawAxes').innerHTML = chips(meta.lawAxes || []);
    $('jurisdictions').innerHTML = chips(meta.jurisdictions || []);
    $('sourceTypes').innerHTML = chips(meta.sourceTypes || []);
    $('gapTaxonomy').innerHTML = chips(meta.gapTaxonomy || []);
    $('policyOptions').innerHTML = chips(meta.policyOptions || []);
    $('phdTags').innerHTML = chips(meta.phdTags || []);

    const lineage = meta.thesisLineage || {};
    const path = lineage.path || [];
    const master = lineage.master || {};
    $('thesisLineage').innerHTML = `
      <div class="lineage-path">${path.map((x,i)=>`<span>${esc(x)}</span>${i < path.length - 1 ? '<b>→</b>' : ''}`).join('')}</div>
      <p class="master-link-status"><strong>${esc(master.label || '석사논문')}</strong> · ${master.url ? `<a href="${esc(master.url)}" target="_blank" rel="noopener noreferrer">공식 원문 보기 ↗</a>` : esc(master.status || '공식 공개 링크 확인 후 연결')}</p>`;

    $('stats').innerHTML = [
      [data.length, '기술 연구'],
      [(meta.lawAxes || []).length, '법률 연구축'],
      [(meta.jurisdictions || []).length, '비교법 권역'],
      [(meta.phdTags || []).length, '박사논문 태그']
    ].map(([n,label]) => `<div class="stat"><strong>${n}</strong><span>${esc(label)}</span></div>`).join('');
  }

  function populateFilters() {
    const stages = ['전체', ...new Set(data.map(x => x.stage))];
    stageFilter.innerHTML = stages.map(x => `<option value="${esc(x)}">${esc(x)}</option>`).join('');
    lawFilter.innerHTML = ['전체', ...(meta.lawAxes || [])].map(x => `<option value="${esc(x)}">${esc(x)}</option>`).join('');
    phdFilter.innerHTML = ['전체', ...(meta.phdTags || [])].map(x => `<option value="${esc(x)}">${esc(x)}</option>`).join('');
  }

  function searchable(item) {
    return [item.title,item.en,item.stage,item.maturity,item.summary,item.scenarioNote,
      ...(item.tech||[]),...(item.currentLaw||[]),...(item.issues||[]),...(item.doctrine||[]),...(item.gaps||[]),
      ...(item.comparative||[]),...(item.policy||[]),...(item.governance||[]),...(item.legislation||[]),...(item.phdTags||[])
    ].filter(Boolean).join(' ').toLowerCase();
  }

  function filtered() {
    const q = searchInput.value.trim().toLowerCase();
    const stage = stageFilter.value;
    const law = lawFilter.value;
    const phd = phdFilter.value;
    return data.filter(item => {
      const stageOk = stage === '전체' || item.stage === stage;
      const lawOk = law === '전체' || (item.currentLaw || []).some(x => x.includes(law.replace('법','')) || x === law);
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

  [searchInput, stageFilter, lawFilter, phdFilter].forEach(el => el.addEventListener(el === searchInput ? 'input' : 'change', renderCards));

  renderStatic();
  populateFilters();
  renderCards();
})();
