const data = window.LEGAL_KNOWLEDGE || [];
const cardsEl = document.getElementById('cards');
const filtersEl = document.getElementById('areaFilters');
const examFiltersEl = document.getElementById('examFilters');
const subfieldEl = document.getElementById('subfieldSelect');
const searchEl = document.getElementById('searchInput');
const dialog = document.getElementById('detailDialog');
const detailEl = document.getElementById('detailContent');
const emptyEl = document.getElementById('emptyState');
const countEl = document.getElementById('contentCount');
const statsEl = document.getElementById('stats');
let activeArea = '전체';
let activeExam = '전체';
let activeSubfield = '전체';

const areas = ['전체', ...new Set(data.map(item => item.area))];
const exams = ['전체', ...new Set(data.flatMap(item => item.examTags || []))];
const subfields = ['전체', ...new Set(data.map(item => item.subfield).filter(Boolean))];
const completeCount = data.filter(item => item.qualityStatus === '16항목 완성').length;
const caseVerifyCount = data.filter(item => item.qualityStatus === '원문 검증 필요').length;
countEl.textContent = `연구 항목 ${data.length} · 16항목 완성 ${completeCount}`;

function esc(s='') {
  return String(s).replace(/[&<>'\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
}
function list(arr=[], cls='detail-list') {
  if (!arr.length) return '';
  return `<ul class="${cls}">${arr.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
}
function chips(arr=[], cls='meta-chips') {
  if (!arr.length) return '';
  return `<div class="${cls}">${arr.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`;
}
function links(arr=[]) {
  if (!arr.length) return '';
  return `<div class="source-links">${arr.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)} ↗</a>`).join('')}</div>`;
}
function section(title, body) {
  if (!body) return '';
  return `<section class="detail-section"><h4>${esc(title)}</h4>${body}</section>`;
}
function qualityClass(status='') {
  if (status === '16항목 완성') return 'complete';
  if (status === '원문 검증 필요') return 'verify';
  return 'progress';
}
function qualityChecklist(item) {
  const rows = (item.standard16 || []).map(x => `
    <li class="${x.ok ? 'ok' : 'missing'}">
      <span>${x.ok ? '✓' : '•'}</span><strong>${esc(x.label)}</strong><em>${x.ok ? (x.conditional ? '적용 제외/충족' : '충족') : '보강 필요'}</em>
    </li>`).join('');
  return `<div class="quality-summary"><strong>${esc(item.qualityStatus || '보강 중')}</strong><span>${item.standard16Done || 0}/16</span></div><ul class="quality-checklist">${rows}</ul>`;
}

function renderAreaFilters() {
  filtersEl.innerHTML = areas.map(area => `<button class="filter-btn ${area === activeArea ? 'active':''}" data-area="${esc(area)}">${esc(area)}</button>`).join('');
  filtersEl.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
    activeArea = btn.dataset.area; renderAreaFilters(); renderCards();
  }));
}
function renderExamFilters() {
  examFiltersEl.innerHTML = exams.map(exam => `<button class="filter-btn exam ${exam === activeExam ? 'active':''}" data-exam="${esc(exam)}">${esc(exam)}</button>`).join('');
  examFiltersEl.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
    activeExam = btn.dataset.exam; renderExamFilters(); renderCards();
  }));
}
function renderSubfields() {
  subfieldEl.innerHTML = subfields.map(s=>`<option value="${esc(s)}">${esc(s)}</option>`).join('');
  subfieldEl.addEventListener('change',()=>{activeSubfield=subfieldEl.value; renderCards();});
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
  const fields = [item.title,item.area,item.subfield,item.type,item.summary,item.concept,item.issue,item.rule,item.coreRule,item.analysis,item.effect,item.theories,item.caseFacts,item.courtHolding,item.courtReasoning,item.counter,item.qualityStatus,
    ...(item.keywords||[]),...(item.examTags||[]),...(item.requirements||[]),...(item.relatedRules||[]),...(item.variations||[]),...deep,...(item.application||[])];
  return fields.filter(Boolean).join(' ').toLowerCase();
}
function filteredData() {
  const q = searchEl.value.trim().toLowerCase();
  return data.filter(item => {
    const areaOk = activeArea === '전체' || item.area === activeArea;
    const examOk = activeExam === '전체' || (item.examTags || []).includes(activeExam);
    const subOk = activeSubfield === '전체' || item.subfield === activeSubfield;
    return areaOk && examOk && subOk && (!q || searchableText(item).includes(q));
  });
}
function renderCards() {
  const items = filteredData();
  emptyEl.hidden = items.length > 0;
  cardsEl.innerHTML = items.map(item => `
    <article class="card">
      <div class="card-top"><span class="badge">${esc(item.area)} · ${esc(item.subfield || item.type)}</span><span class="level">${esc(item.level)}</span></div>
      <div class="quality-badge ${qualityClass(item.qualityStatus)}">${esc(item.qualityStatus || '보강 중')} · ${item.standard16Done || 0}/16</div>
      <h3>${esc(item.title)}</h3>
      <p class="summary">${esc(item.summary)}</p>
      ${chips((item.examTags||[]).slice(0,3),'exam-chips')}
      <div class="card-keywords">${(item.keywords||[]).slice(0,5).map(k=>`<span>${esc(k)}</span>`).join('')}</div>
      <div class="card-footer"><span class="reviewed">검토 ${esc(item.reviewed)}</span><button class="open-detail" data-id="${esc(item.id)}">연구노트 보기 →</button></div>
    </article>`).join('');
  cardsEl.querySelectorAll('.open-detail').forEach(btn => btn.addEventListener('click', () => openDetail(btn.dataset.id)));
}
function openDetail(id) {
  const item = data.find(x => x.id === id);
  if (!item) return;
  const statuteLinks = links(item.statuteSources || []);
  const caseLinks = links(item.relatedCases || []);
  const allSources = links(item.sources || []);
  const deep = (item.deepDive || []).map(x => `<div class="deep-item"><strong>${esc(x.title)}</strong><p>${esc(x.body)}</p></div>`).join('');
  const application = (item.application || []).length ? `<ol class="detail-list application-list">${item.application.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>` : '';
  const variation = list(item.variations || []);
  const caseVerification = item.isCaseNote
    ? `<p class="case-verification ${item.caseOriginalVerified ? 'ok' : 'pending'}">${item.caseOriginalVerified ? '판결 원문 대조 완료' : '판결 원문 사실관계·판단·논증 대조 필요'}</p>`
    : '';
  detailEl.innerHTML = `
    <div class="section-kicker">${esc(item.area)} · ${esc(item.subfield || '')} · ${esc(item.type)} · ${esc(item.level)}</div>
    <h3 class="detail-title">${esc(item.title)}</h3>
    <div class="detail-meta-row"><span>연구모형 ${esc(item.noteModel || '')}</span><span>법령·판례 기준 ${esc(item.lawDate || item.reviewed)}</span><span>최종 검토 ${esc(item.reviewed)}</span></div>
    ${caseVerification}
    ${section('16개 표준형 완성도', qualityChecklist(item))}
    ${section('관련 시험', chips(item.examTags || []))}
    ${section('개념·핵심정의', `<p>${esc(item.concept || item.summary)}</p>`)}
    ${section('관련 조문·공식 근거', statuteLinks)}
    ${section('성립요건·판단요소', list(item.requirements || []))}
    ${section('법적 효과', item.effect ? `<p>${esc(item.effect)}</p>` : '')}
    ${section('주요 쟁점', `<p>${esc(item.issue)}</p>`)}
    ${section('학설·해석론', item.theories ? `<p>${esc(item.theories)}</p>` : '')}
    ${section('판례 사실관계', item.caseFacts ? `<p>${esc(item.caseFacts)}</p>` : '')}
    ${section('법원의 판단', item.courtHolding ? `<p>${esc(item.courtHolding)}</p>` : '')}
    ${section('법원의 논증', item.courtReasoning ? `<p>${esc(item.courtReasoning)}</p>` : '')}
    ${section('핵심 법리·규범 구조', `<p>${esc(item.coreRule || item.rule)}</p>`)}
    ${section('반대논리·한계', item.counter ? `<p>${esc(item.counter)}</p>` : '')}
    ${section('전문 해설', `<p>${esc(item.analysis)}</p>`)}
    ${section('심화 쟁점 해설', deep)}
    ${section('사례 적용·논증 순서', application)}
    ${section('사례변형', variation)}
    ${section('관련 법리', chips(item.relatedRules || []))}
    ${section('관련 판례', caseLinks)}
    ${section('공식·주요 출처', allSources || '<p>법적 추론 방법론 항목은 특정 조문에 종속되지 않으며, 법학 방법론과 사례분석을 중심으로 구성합니다.</p>')}
  `;
  dialog.showModal();
}

searchEl.addEventListener('input', renderCards);
renderAreaFilters();
renderExamFilters();
renderSubfields();
renderStats();
renderCards();
