(() => {
  'use strict';

  const meta = window.AI_FORESIGHT_META || {};
  const data = Array.isArray(window.AI_FORESIGHT_RECORDS) ? window.AI_FORESIGHT_RECORDS : [];
  const comparative = Array.isArray(window.AI_FORESIGHT_COMPARATIVE) ? window.AI_FORESIGHT_COMPARATIVE : [];
  const gaps = Array.isArray(window.AI_FORESIGHT_GAPS) ? window.AI_FORESIGHT_GAPS : [];
  const policies = Array.isArray(window.AI_FORESIGHT_POLICIES) ? window.AI_FORESIGHT_POLICIES : [];
  const $ = id => document.getElementById(id);

  const searchInput = $('searchInput');
  const stageFilter = $('stageFilter');
  const lawFilter = $('lawFilter');
  const phdFilter = $('phdFilter');
  const techCards = $('techCards');
  const emptyState = $('emptyState');
  const dialog = $('detailDialog');
  const detailContent = $('detailContent');

  const esc = (value='') => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[ch]));
  const chips = (items=[]) => items.map(x => `<span>${esc(x)}</span>`).join('');
  const textOf = (values=[]) => values.flat(Infinity).filter(Boolean).join(' ').toLowerCase();
  const paragraphs = (items=[]) => items.length ? items.map(x => `<p>${esc(x)}</p>`).join('') : '<p class="muted">추가 연구 예정</p>';
  const list = (items=[]) => items.length ? `<ul>${items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '<p class="muted">추가 연구 예정</p>';
  const articleSection = (number, title, body) => `<section class="article-section"><div class="section-number">${esc(number)}</div><div class="article-section-body"><h4>${esc(title)}</h4>${body}</div></section>`;

  function documentFooter() {
    return `<footer class="document-footer" aria-label="연구본문 문서 하단">
      <div class="document-footer-copy">
        <strong>AI 법·기술 선제연구 아카이브</strong>
        <p>Copyright © 이명훈 2026. All rights reserved.</p>
        <p>문의 <a href="mailto:kimbrighth@gmail.com">kimbrighth@gmail.com</a></p>
        <p class="ai-disclosure">AI 활용 안내: 일부 기술·법률 연구자료의 탐색·구조화·초안 작성에 생성형 AI를 활용했으며, 사실과 전망의 구분, 법적 분석, 출처 검토와 최종 편집은 운영자가 관리합니다.</p>
      </div>
      <div class="document-actions">
        <button type="button" class="document-action" data-document-top aria-label="이 연구본문의 맨 위로 이동">맨 위로 ↑</button>
        <button type="button" class="document-action close-action" data-document-close aria-label="연구본문 창 닫기">창 닫기 ×</button>
      </div>
    </footer>`;
  }

  function scrollDetailTop(behavior = 'smooth') {
    if (typeof dialog.scrollTo === 'function') dialog.scrollTo({ top: 0, behavior });
    if (typeof detailContent.scrollTo === 'function') detailContent.scrollTo({ top: 0, behavior });
  }

  function bindDocumentControls() {
    detailContent.querySelector('[data-document-top]')?.addEventListener('click', () => scrollDetailTop('smooth'));
    detailContent.querySelector('[data-document-close]')?.addEventListener('click', () => dialog.close());
  }

  const lawAxisKeywords = {
    '인공지능법':['인공지능','ai act','고영향','범용 ai','frontier','위험기반'],
    '민사책임법':['민법','불법행위','민사책임','과실','인과관계','손해배상'],
    '제조물책임법':['제조물','제품책임','결함','product liability'],
    '소프트웨어법':['소프트웨어','업데이트','코드','api','클라우드'],
    '개인정보·데이터법':['개인정보','데이터','신용정보','위치정보','신경정보','민감정보'],
    '저작권법':['저작권','공정이용','저작물','학습데이터'],
    '지식재산법':['특허','지식재산','영업비밀','발명'],
    '자율주행자동차법':['자율주행','자동차','도로교통','ads','adas','odd'],
    '로봇법':['로봇','휴머노이드','physical ai','기계'],
    '보험법':['보험','공탁','책임기금','책임재산'],
    '회사법·법인론':['회사','법인','내부통제','책임관리인','기능적 법적 지위'],
    '증명책임·소송법':['증명','소송','문서제출','로그','입증','증거','감사기록']
  };

  function academicText(item) {
    const a = item.academic || {};
    return Object.values(a).flat(Infinity);
  }

  function searchable(item) {
    return textOf([
      item.title,item.en,item.stage,item.maturity,item.summary,item.scenarioNote,item.researchQuestion,
      item.tech,item.currentLaw,item.issues,item.doctrine,item.gaps,item.comparative,item.policy,item.governance,item.legislation,item.phdTags,
      academicText(item),
      (item.sources || []).flatMap(x => [x.label,x.url])
    ]);
  }

  function matchesLawAxis(item, axis) {
    if (axis === '전체') return true;
    const haystack = searchable(item);
    return (lawAxisKeywords[axis] || [axis]).some(keyword => haystack.includes(keyword.toLowerCase()));
  }

  function populateFilters() {
    const stages = ['전체', ...new Set(data.map(x => x.stage))];
    stageFilter.innerHTML = stages.map(x => `<option value="${esc(x)}">${esc(x)}</option>`).join('');
    lawFilter.innerHTML = ['전체', ...(meta.lawAxes || [])].map(x => `<option value="${esc(x)}">${esc(x)}</option>`).join('');
    phdFilter.innerHTML = ['전체', ...(meta.phdTags || [])].map(x => `<option value="${esc(x)}">${esc(x)}</option>`).join('');
  }

  function renderStatic() {
    $('researchFlow').innerHTML = (meta.researchFlow || []).map((item, i, arr) => `<span>${esc(item)}</span>${i < arr.length - 1 ? '<b>→</b>' : ''}`).join('');
    $('sourceTypes').innerHTML = chips(meta.sourceTypes || []);
    $('phdTags').innerHTML = chips(meta.phdTags || []);

    const lineage = meta.thesisLineage || {};
    const path = lineage.path || [];
    const master = lineage.master || {};
    $('thesisLineage').innerHTML = `
      <div class="lineage-path">${path.map((x,i)=>`<span>${esc(x)}</span>${i < path.length - 1 ? '<b>→</b>' : ''}`).join('')}</div>
      <p class="master-link-status"><strong>${esc(master.label || '석사논문')}</strong> · ${master.url ? `<a href="${esc(master.url)}" target="_blank" rel="noopener noreferrer">공식 원문 보기 ↗</a>` : esc(master.status || '공식 공개 링크 확인 후 연결')}</p>`;

    const scenarioCount = data.filter(x => (x.stage || '').includes('시나리오')).length;
    $('stats').innerHTML = [
      [data.length, '기술 연구'],
      [data.filter(x => x.academic).length, '학술 심화'],
      [scenarioCount, '시나리오'],
      [comparative.length, '비교법 권역']
    ].map(([n,label]) => `<div class="stat"><strong>${n}</strong><span>${esc(label)}</span></div>`).join('');
  }

  function filteredData() {
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
    const items = filteredData();
    emptyState.hidden = items.length > 0;
    techCards.innerHTML = items.map(item => `
      <article class="research-row">
        <div class="row-number">${String(item.order).padStart(2,'0')}</div>
        <div class="row-main">
          <div class="row-meta"><span>${esc(item.stage)}</span><span>${esc(item.maturity)}</span>${item.academic ? '<span class="academic-badge">학술 심화</span>' : ''}</div>
          <h3>${esc(item.title)} <small>${esc(item.en)}</small></h3>
          <p class="row-summary">${esc(item.summary)}</p>
          ${item.researchQuestion ? `<p class="research-question"><strong>연구질문</strong> ${esc(item.researchQuestion)}</p>` : ''}
          <div class="row-tags">${chips((item.phdTags || []).slice(0,5))}</div>
        </div>
        <div class="row-action"><button class="detail-button" data-id="${esc(item.id)}">연구본문 보기</button></div>
      </article>`).join('');

    techCards.querySelectorAll('.detail-button').forEach(button => button.addEventListener('click', () => openDetail(button.dataset.id)));
  }

  function renderResearchUnits() {
    const q = searchInput.value.trim().toLowerCase();
    const qMatch = values => !q || textOf(values).includes(q);

    const comp = comparative.filter(x => qMatch([x.jurisdiction,x.priority,x.focus,x.materials,x.caseMethod]));
    $('comparativeCards').innerHTML = comp.map(x => `
      <article class="index-card"><div class="index-card-top"><strong>${esc(x.jurisdiction)}</strong><span>${esc(x.priority)}</span></div><div class="mini-chips">${chips(x.focus || [])}</div><h4>축적자료</h4>${list(x.materials || [])}<p class="method"><strong>판례 분석기준</strong> ${esc(x.caseMethod)}</p></article>`).join('');

    const gapItems = gaps.filter(x => qMatch([x.title,x.problem,x.existing,x.solutions]));
    $('gapCards').innerHTML = gapItems.map(x => `
      <article class="index-card"><strong>${esc(x.title)}</strong><p>${esc(x.problem)}</p><h4>기존 법리</h4><p>${esc(x.existing)}</p><h4>해결방향</h4>${list(x.solutions || [])}</article>`).join('');

    const policyItems = policies.filter(x => qMatch([x.title,x.role,x.trigger,x.caution]));
    $('policyCards').innerHTML = policyItems.map(x => `
      <article class="index-card"><strong>${esc(x.title)}</strong><p>${esc(x.role)}</p><h4>적용 시점</h4><p>${esc(x.trigger)}</p><h4>설계상 주의</h4><p>${esc(x.caution)}</p></article>`).join('');
  }

  function sourceLinks(sources=[]) {
    if (!sources.length) return '<p class="muted">공식·비교자료를 계속 축적합니다.</p>';
    return `<div class="source-list">${sources.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer"><span>${esc(s.label)}</span><b>↗</b></a>`).join('')}</div>`;
  }

  function openDetail(id) {
    const item = data.find(x => x.id === id);
    if (!item) return;
    const a = item.academic || {};

    detailContent.innerHTML = `
      <header class="article-header">
        <div class="article-kicker">${String(item.order).padStart(2,'0')} · ${esc(item.stage)} · ${esc(item.maturity)}</div>
        <h3>${esc(item.title)} <small>${esc(item.en)}</small></h3>
        <p class="article-lead">${esc(item.summary)}</p>
        ${item.researchQuestion ? `<div class="article-question"><strong>핵심 연구질문</strong><p>${esc(item.researchQuestion)}</p></div>` : ''}
        ${item.scenarioNote ? `<div class="forecast-warning"><strong>기술예측·시나리오</strong><p>${esc(item.scenarioNote)}</p></div>` : ''}
      </header>

      <div class="article-body">
        ${articleSection('01','기술적 정의와 작동구조', paragraphs(a.technical || item.tech || []))}
        ${articleSection('02','현행법 규율', paragraphs(a.currentLawAnalysis || item.currentLaw || []))}
        ${articleSection('03','법적 쟁점', paragraphs(a.legalIssuesAnalysis || item.issues || []))}
        ${articleSection('04','학설·기존 법리', paragraphs(a.doctrineAnalysis || item.doctrine || []))}
        ${articleSection('05','법적 공백', paragraphs(a.gapAnalysis || item.gaps || []))}
        ${articleSection('06','비교법·해외사례', paragraphs(a.comparativeAnalysis || item.comparative || []))}
        ${articleSection('07','책임·증명구조', paragraphs(a.liabilityEvidence || []))}
        ${articleSection('08','정책대안', paragraphs(a.policyAnalysis || item.policy || []))}
        ${articleSection('09','입법론', paragraphs(a.legislationAnalysis || item.legislation || []))}
        ${articleSection('10','박사논문 연결', `<div class="article-tags">${chips(item.phdTags || [])}</div>`)}
        ${articleSection('11','공식·비교자료', sourceLinks(item.sources || []))}
      </div>

      <div class="article-note"><strong>연구방법상 주의</strong><p>법령·판례·정책자료와 기술예측을 구분하고, 신설 기술영역에 존재하지 않는 판례를 임의로 만들지 않습니다. 법적 공백을 지적한 경우에는 현행법 해석 또는 제도적 해결대안을 함께 검토합니다.</p></div>
      ${documentFooter()}`;

    bindDocumentControls();
    dialog.showModal();
    requestAnimationFrame(() => scrollDetailTop('auto'));
  }

  function rerender() {
    renderCards();
    renderResearchUnits();
  }

  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) dialog.close();
  });

  searchInput.addEventListener('input', rerender);
  [stageFilter, lawFilter, phdFilter].forEach(el => el.addEventListener('change', renderCards));

  renderStatic();
  populateFilters();
  rerender();
})();