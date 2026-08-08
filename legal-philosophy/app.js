(() => {
  'use strict';

  const data = Array.isArray(window.LEGAL_PHILOSOPHY) ? window.LEGAL_PHILOSOPHY : [];
  const axes = Array.isArray(window.LEGAL_PHILOSOPHY_AXES) ? window.LEGAL_PHILOSOPHY_AXES : ['전체'];
  const depthMap = window.LEGAL_PHILOSOPHY_DEPTH || {};
  const axisMeaning = {
    '법의 본질·정당성':'무엇이 법을 유효한 규범으로 만들고, 법적 권위와 도덕적 정당성이 어떤 관계를 가지는지 검토하는 축이다.',
    '권리·청구권·기본권':'누가 어떤 법익에 대해 권리·청구권·자유·권능을 가지며 상대방에게 어떤 의무가 발생하는지 분석하는 축이다.',
    '책임·귀속':'사실적 인과관계와 별도로 행위·결과·역할·통제를 어떤 규범적 이유로 특정 인간·법인의 책임으로 전환할지 검토하는 축이다.',
    '법인격·법적 주체':'권리·의무·재산·소송·책임의 귀속점을 법이 어떤 단위에 어떤 범위로 구성하는지 분석하는 축이다.',
    '정의·분배':'피해·이익·비용·위험을 누구에게 어떤 기준으로 배분하거나 당사자 사이에서 교정해야 하는지 검토하는 축이다.',
    '해석·논증':'법문·판례·원칙·목적·결과를 어떤 순서와 기준으로 연결하여 법적 결론을 정당화할지 다루는 축이다.',
    '헌법·비례성':'국가의 보호개입과 자유권 제한, 충돌하는 기본권과 공익을 헌법적으로 어떻게 심사할지 다루는 축이다.',
    'AI·신기술':'기술적 자율성·학습·다중 에이전트 상호작용이 기존 법의 행위·책임·주체 개념에 어떤 변형을 요구하는지 검토하는 축이다.'
  };

  const $ = id => document.getElementById(id);
  const searchInput = $('searchInput');
  const axisFilter = $('axisFilter');
  const priorityFilter = $('priorityFilter');
  const cards = $('cards');
  const count = $('count');
  const empty = $('empty');
  const dialog = $('detailDialog');
  const detailContent = $('detailContent');

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[ch]));
  const list = (items, cls='') => `<ul class="${esc(cls)}">${(items || []).filter(Boolean).map(item => `<li>${esc(item)}</li>`).join('')}</ul>`;
  const flattenText = value => {
    if (value == null) return [];
    if (Array.isArray(value)) return value.flatMap(flattenText);
    if (typeof value === 'object') return Object.values(value).flatMap(flattenText);
    return [String(value)];
  };
  const unique = items => [...new Set((items || []).filter(Boolean))];
  const searchable = item => {
    const depth = depthMap[item.id] || {};
    return flattenText([item.thinker,item.en,item.period,item.priority,item.axes,item.keywords,item.thesis,item.concepts,item.relevance,item.works,depth]).join(' ').toLowerCase();
  };

  function populateAxis() {
    axisFilter.innerHTML = axes.map(axis => `<option value="${esc(axis)}">${esc(axis)}</option>`).join('');
  }

  function filtered() {
    const query = searchInput.value.trim().toLowerCase();
    const axis = axisFilter.value;
    const priority = priorityFilter.value;
    return data.filter(item => {
      const qOk = !query || searchable(item).includes(query);
      const axisOk = axis === '전체' || (item.axes || []).includes(axis);
      const priorityOk = priority === '전체' || item.priority === priority;
      return qOk && axisOk && priorityOk;
    }).sort((a,b) => a.order - b.order);
  }

  function render() {
    const items = filtered();
    count.textContent = `전체 ${data.length}개 · 표시 ${items.length}개`;
    empty.hidden = items.length > 0;
    cards.innerHTML = items.map(item => `
      <article class="card">
        <div class="number">${String(item.order).padStart(2,'0')}</div>
        <div class="card-main">
          <div class="card-top"><span class="badge priority-${esc(item.priority)}">${esc(item.priority)}</span><span class="badge">${esc(item.period)}</span>${(item.axes || []).slice(0,2).map(axis => `<span class="badge">${esc(axis)}</span>`).join('')}</div>
          <h3>${esc(item.thinker)}<small>${esc(item.en)}</small></h3>
          <p class="thesis">${esc(item.thesis)}</p>
          <div class="keywords">${(item.keywords || []).map(x => `<span>${esc(x)}</span>`).join('')}</div>
        </div>
        <button type="button" class="open-btn" data-id="${esc(item.id)}">연구내용 보기</button>
      </article>
    `).join('');
    cards.querySelectorAll('.open-btn').forEach(button => button.addEventListener('click', () => openDetail(button.dataset.id)));
  }

  function section(no, title, body) {
    return `<section class="detail-section"><div class="secno">${no}</div><div><h4>${esc(title)}</h4>${body}</div></section>`;
  }

  function renderAxes(item, depth) {
    const rows = (item.axes || []).map(axis => `
      <div class="axis-explain-row">
        <strong>${esc(axis)}</strong>
        <p>${esc(axisMeaning[axis] || '이 항목의 주장을 해당 법철학 연구영역과 연결하여 검토하는 분석축이다.')}</p>
      </div>
    `).join('');
    return `<p class="detail-focus">${esc(depth.axisFocus || item.thesis)}</p><div class="axis-explain-list">${rows}</div>`;
  }

  function renderTerms(item, depth) {
    const terms = Array.isArray(depth.terms) && depth.terms.length
      ? depth.terms
      : (item.keywords || []).map(term => [term, `${item.thinker}의 핵심 명제와 연결되는 개념이다. 대표 저작에서 정의·범위·예외를 확인해야 한다.`]);
    return `<div class="term-list">${terms.map(([term, explanation]) => `
      <div class="term-row"><strong>${esc(term)}</strong><p>${esc(explanation)}</p></div>
    `).join('')}</div>`;
  }

  function renderWorks(item, depth) {
    const works = (item.works || []).map(work => `<li><strong>${esc(work)}</strong></li>`).join('');
    const reading = Array.isArray(depth.reading) && depth.reading.length ? list(depth.reading, 'reading-list') : '<p>대표 저작에서 핵심 명제의 원문과 사용 맥락을 확인하고 직접 인용 전 판본·쪽수를 재검증합니다.</p>';
    return `<div class="works-block"><p class="subhead">대표 저작</p><ul class="work-list">${works}</ul><p class="subhead">읽기 포인트</p>${reading}</div>`;
  }

  function openDetail(id) {
    const item = data.find(row => row.id === id);
    if (!item) return;
    const depth = depthMap[item.id] || {};
    const mustKnow = depth.mustKnow || item.concepts || [];
    const debate = depth.debate || ['이 학설의 적용범위와 반대학설을 대표 저작 및 후속 연구에서 함께 검토해야 합니다.'];
    const application = unique([...(depth.application || []), ...(item.relevance || [])]);
    const source = item.sourceUrl
      ? `<div class="verification-note"><p>아래 자료는 해당 항목의 대표적 검증자료입니다. 논문에 직접 인용할 때에는 원저 또는 학술논문의 해당 판본·권호·쪽수를 다시 확인해야 합니다.</p><a class="source-link" href="${esc(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(item.sourceLabel || '검증자료 보기')} ↗</a></div>`
      : `<div class="verification-note"><p>대표 저작을 1차 자료로 확인하고, 직접 인용할 문장은 학술 DB 또는 사용 판본에서 정확한 원문·권호·쪽수를 재검증합니다. 현재 상세해설은 학설의 연구범위와 접목점을 학습하기 위한 연구노트입니다.</p></div>`;

    detailContent.innerHTML = `
      <header class="detail-head">
        <div class="meta">${String(item.order).padStart(2,'0')} · ${esc(item.period)} · ${esc(item.priority)}</div>
        <h3>${esc(item.thinker)}<small>${esc(item.en)}</small></h3>
        <p class="lead-detail">${esc(item.thesis)}</p>
      </header>
      <div class="detail-body">
        ${section('01','연구축과 문제의식',renderAxes(item, depth))}
        ${section('02','핵심 용어·개념 해설',renderTerms(item, depth))}
        ${section('03','반드시 익혀야 할 주장·학설',list(mustKnow, 'study-list'))}
        ${section('04','쟁점·반론·구별',list(debate, 'debate-list'))}
        ${section('05','현재 연구와의 구체적 접목',list(application, 'application-list'))}
        ${section('06','대표 저작과 읽기 포인트',renderWorks(item, depth))}
        ${section('07','검증자료와 인용 원칙',source)}
      </div>
      <footer class="detail-footer">
        <div><strong>법철학·기본권 연구</strong><br>Copyright © 이명훈 2026. All rights reserved.<br>문의 kimbrighth@gmail.com</div>
        <button type="button" data-close>창 닫기 ×</button>
      </footer>
    `;
    detailContent.querySelector('[data-close]')?.addEventListener('click', () => dialog.close());
    dialog.showModal();
    requestAnimationFrame(() => detailContent.scrollTo({top:0,behavior:'auto'}));
  }

  searchInput.addEventListener('input', render);
  axisFilter.addEventListener('change', render);
  priorityFilter.addEventListener('change', render);
  $('dialogClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

  populateAxis();
  render();
})();