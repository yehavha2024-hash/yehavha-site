(() => {
  'use strict';

  const data = Array.isArray(window.LEGAL_PHILOSOPHY) ? window.LEGAL_PHILOSOPHY : [];
  const axes = Array.isArray(window.LEGAL_PHILOSOPHY_AXES) ? window.LEGAL_PHILOSOPHY_AXES : ['전체'];
  const $ = id => document.getElementById(id);
  const searchInput = $('searchInput');
  const axisFilter = $('axisFilter');
  const priorityFilter = $('priorityFilter');
  const cards = $('cards');
  const count = $('count');
  const empty = $('empty');
  const dialog = $('detailDialog');
  const detailContent = $('detailContent');

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const list = items => `<ul>${(items || []).map(item => `<li>${esc(item)}</li>`).join('')}</ul>`;
  const searchable = item => [item.thinker,item.en,item.period,item.priority,item.axes,item.keywords,item.thesis,item.concepts,item.relevance,item.works].flat(Infinity).filter(Boolean).join(' ').toLowerCase();

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

  function openDetail(id) {
    const item = data.find(row => row.id === id);
    if (!item) return;
    const source = item.sourceUrl ? `<p><a class="source-link" href="${esc(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(item.sourceLabel || '검증자료 보기')} ↗</a></p>` : '<p>대표 저작과 학술문헌을 기준으로 계속 보강합니다.</p>';
    detailContent.innerHTML = `
      <header class="detail-head">
        <div class="meta">${String(item.order).padStart(2,'0')} · ${esc(item.period)} · ${esc(item.priority)}</div>
        <h3>${esc(item.thinker)}<small>${esc(item.en)}</small></h3>
        <p class="lead-detail">${esc(item.thesis)}</p>
      </header>
      <div class="detail-body">
        ${section('01','핵심 개념',list(item.concepts))}
        ${section('02','현재 연구와의 연결',list(item.relevance))}
        ${section('03','연구축·키워드',`<p>${esc((item.axes || []).join(' · '))}</p><p>${esc((item.keywords || []).join(' · '))}</p>`)}
        ${section('04','대표 저작',list(item.works))}
        ${section('05','검증자료',source)}
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
