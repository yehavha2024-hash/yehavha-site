const data = window.LEGAL_KNOWLEDGE || [];
const cardsEl = document.getElementById('cards');
const filtersEl = document.getElementById('areaFilters');
const searchEl = document.getElementById('searchInput');
const dialog = document.getElementById('detailDialog');
const detailEl = document.getElementById('detailContent');
const emptyEl = document.getElementById('emptyState');
const countEl = document.getElementById('contentCount');
const statsEl = document.getElementById('stats');
let activeArea = '전체';

const areas = ['전체', ...new Set(data.map(item => item.area))];
countEl.textContent = `연구 항목 ${data.length}`;

function esc(s='') {
  return String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

function renderFilters() {
  filtersEl.innerHTML = areas.map(area => `<button class="filter-btn ${area === activeArea ? 'active':''}" data-area="${esc(area)}">${esc(area)}</button>`).join('');
  filtersEl.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
    activeArea = btn.dataset.area;
    renderFilters();
    renderCards();
  }));
}

function renderStats() {
  const realAreas = areas.filter(a => a !== '전체');
  statsEl.innerHTML = realAreas.map(area => {
    const n = data.filter(i => i.area === area).length;
    return `<div class="stat"><strong>${n}</strong><span>${esc(area)}</span></div>`;
  }).join('');
}

function searchableText(item) {
  const deep = (item.deepDive || []).flatMap(x => [x.title, x.body]);
  return [item.title,item.area,item.subfield,item.type,item.summary,item.issue,item.rule,item.analysis,...(item.keywords||[]),...deep,...(item.application||[])].join(' ').toLowerCase();
}

function filteredData() {
  const q = searchEl.value.trim().toLowerCase();
  return data.filter(item => {
    const areaOk = activeArea === '전체' || item.area === activeArea;
    return areaOk && (!q || searchableText(item).includes(q));
  });
}

function renderCards() {
  const items = filteredData();
  emptyEl.hidden = items.length > 0;
  cardsEl.innerHTML = items.map(item => `
    <article class="card">
      <div class="card-top"><span class="badge">${esc(item.area)} · ${esc(item.subfield || item.type)}</span><span class="level">${esc(item.level)}</span></div>
      <h3>${esc(item.title)}</h3>
      <p class="summary">${esc(item.summary)}</p>
      <div class="card-keywords">${(item.keywords||[]).map(k=>`<span>${esc(k)}</span>`).join('')}</div>
      <div class="card-footer"><span class="reviewed">검토 ${esc(item.reviewed)}</span><button class="open-detail" data-id="${esc(item.id)}">연구노트 보기 →</button></div>
    </article>`).join('');
  cardsEl.querySelectorAll('.open-detail').forEach(btn => btn.addEventListener('click', () => openDetail(btn.dataset.id)));
}

function section(title, body) {
  if (!body) return '';
  return `<section class="detail-section"><h4>${esc(title)}</h4>${body}</section>`;
}

function openDetail(id) {
  const item = data.find(x => x.id === id);
  if (!item) return;
  const sources = (item.sources || []).length
    ? `<div class="source-links">${item.sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)} ↗</a>`).join('')}</div>`
    : '<p>이 항목은 법적 추론 방법론으로, 특정 법조문보다 판례·법학 방법론과 사례분석을 중심으로 구성합니다.</p>';
  const deep = (item.deepDive || []).map(x => `<div class="deep-item"><strong>${esc(x.title)}</strong><p>${esc(x.body)}</p></div>`).join('');
  const application = (item.application || []).length ? `<ol class="detail-list application-list">${item.application.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>` : '';
  detailEl.innerHTML = `
    <div class="section-kicker">${esc(item.area)} · ${esc(item.subfield || '')} · ${esc(item.type)} · ${esc(item.level)}</div>
    <h3 class="detail-title">${esc(item.title)}</h3>
    <div class="detail-sub">최종 검토 ${esc(item.reviewed)}</div>
    ${section('쟁점 구조', `<p>${esc(item.issue)}</p>`)}
    ${section('규범·판례 구조', `<p>${esc(item.rule)}</p>`)}
    ${section('전문 해설', `<p>${esc(item.analysis)}</p>`)}
    ${section('심화 쟁점 해설', deep)}
    ${section('사례 적용·논증 순서', application)}
    ${section('공식·주요 출처', sources)}
  `;
  dialog.showModal();
}

searchEl.addEventListener('input', renderCards);
renderFilters();
renderStats();
renderCards();
