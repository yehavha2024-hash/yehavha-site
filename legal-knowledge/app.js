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

function filteredData() {
  const q = searchEl.value.trim().toLowerCase();
  return data.filter(item => {
    const areaOk = activeArea === '전체' || item.area === activeArea;
    const hay = [item.title,item.area,item.type,item.summary,item.issue,item.rule,item.analysis,...item.keywords,...item.research].join(' ').toLowerCase();
    return areaOk && (!q || hay.includes(q));
  });
}

function renderCards() {
  const items = filteredData();
  emptyEl.hidden = items.length > 0;
  cardsEl.innerHTML = items.map(item => `
    <article class="card">
      <div class="card-top"><span class="badge">${esc(item.area)} · ${esc(item.type)}</span><span class="level">${esc(item.level)}</span></div>
      <h3>${esc(item.title)}</h3>
      <p class="summary">${esc(item.summary)}</p>
      <div class="card-keywords">${item.keywords.map(k=>`<span>${esc(k)}</span>`).join('')}</div>
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
  const sources = item.sources.length ? `<div class="source-links">${item.sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)} ↗</a>`).join('')}</div>` : '<p>법적 추론 연구노트: 특정 조문에 종속되지 않는 방법론 항목입니다.</p>';
  detailEl.innerHTML = `
    <div class="section-kicker">${esc(item.area)} · ${esc(item.type)} · ${esc(item.level)}</div>
    <h3 class="detail-title">${esc(item.title)}</h3>
    <div class="detail-sub">최종 검토 ${esc(item.reviewed)}</div>
    ${section('핵심 쟁점', `<p>${esc(item.issue)}</p>`)}
    ${section('규범·판례 구조', `<p>${esc(item.rule)}</p>`)}
    ${section('전문 해설', `<p>${esc(item.analysis)}</p>`)}
    ${section('추가 연구 포인트', `<ul class="detail-list">${item.research.map(r=>`<li>${esc(r)}</li>`).join('')}</ul>`)}
    ${section('공식·주요 출처', sources)}
  `;
  dialog.showModal();
}

searchEl.addEventListener('input', renderCards);
renderFilters();
renderStats();
renderCards();
