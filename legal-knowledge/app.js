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
let activeArea = '전체';
let activeExam = '전체';
let activeSubfield = '전체';

const areaOf = item => item.systemArea || item.area;
const preferredAreaOrder = [
  '헌법·공법','민사·상사·책임법','형사법','데이터·플랫폼·소비자법','모빌리티·로봇·항공법','보건의료법','지식재산법','AI 산업·융합법','조세·전문법','법적 추론'
];
const areaSet = new Set(data.map(areaOf));
const orderedAreas = preferredAreaOrder.filter(a => areaSet.has(a));
const extraAreas = [...areaSet].filter(a => !preferredAreaOrder.includes(a));
const areas = ['전체', ...orderedAreas, ...extraAreas];
const exams = ['전체', ...new Set(data.flatMap(item => item.examTags || []))];
const subfields = ['전체', ...new Set(data.map(item => item.subfield).filter(Boolean))];
countEl.textContent = `연구 항목 ${data.length}`;

function ensureDocumentControlsStyles() {
  if (document.querySelector('link[data-document-controls]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'document-controls.css?v=20260808-2135';
  link.dataset.documentControls = 'true';
  document.head.appendChild(link);
}

function ensureMainTopLink() {
  const hero = document.querySelector('.hero');
  if (hero && !hero.id) hero.id = 'top';
  const footer = document.querySelector('body > footer');
  if (!footer || footer.querySelector('.footer-top-link')) return;
  const link = document.createElement('a');
  link.className = 'footer-top-link';
  link.href = '#top';
  link.textContent = '맨 위로 이동 ↑';
  footer.appendChild(link);
}

function documentFooter() {
  return `<footer class="document-footer" aria-label="연구노트 문서 하단">
    <div class="document-footer-copy">
      <strong>법리·판례 연구</strong>
      <p>Copyright © 이명훈 2026. All rights reserved.</p>
      <p>문의 <a href="mailto:kimbrighth@gmail.com">kimbrighth@gmail.com</a></p>
      <p class="ai-disclosure">AI 활용 안내: 일부 법률 연구노트·사례·요약의 초안 작성과 구조화에 생성형 AI를 활용했으며, 법령·판례·공식자료의 확인과 내용 검토·편집은 운영자가 관리합니다. 본 자료는 개별 법률자문을 대체하지 않습니다.</p>
    </div>
    <div class="document-actions">
      <button type="button" class="document-action" data-document-top aria-label="이 연구노트의 맨 위로 이동">맨 위로 ↑</button>
      <button type="button" class="document-action close-action" data-document-close aria-label="연구노트 창 닫기">창 닫기 ×</button>
    </div>
  </footer>`;
}

function scrollDetailTop(behavior = 'smooth') {
  if (typeof dialog.scrollTo === 'function') dialog.scrollTo({ top: 0, behavior });
  if (typeof detailEl.scrollTo === 'function') detailEl.scrollTo({ top: 0, behavior });
}

function bindDocumentControls() {
  detailEl.querySelector('[data-document-top]')?.addEventListener('click', () => scrollDetailTop('smooth'));
  detailEl.querySelector('[data-document-close]')?.addEventListener('click', () => dialog.close());
}

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
function matrix(rows=[]) {
  if (!rows.length) return '';
  return `<div class="fact-matrix">${rows.map(row => `<div class="fact-row"><strong>${esc(row[0])}</strong><p>${esc(row[1])}</p></div>`).join('')}</div>`;
}
function analysisRow(label, value) {
  if (!value) return '';
  return `<div class="analysis-row"><strong>${esc(label)}</strong><p>${esc(value)}</p></div>`;
}
function variationCases(item, hard=false) {
  const cases = hard ? (item.hardVariations || []) : (item.variations || []);
  if (!cases.length) return '';
  const answers = hard ? (item.hardVariationAnalyses || []) : (item.variationAnalyses || []);
  return `<div class="variation-cases ${hard ? 'hard' : ''}">${cases.map((v,i)=>{
    const a = answers[i] || {};
    const body = a.analysis
      ? `<p class="direct-analysis">${esc(a.analysis)}</p>`
      : [
          analysisRow('쟁점',a.issue),
          analysisRow('적용 법리',a.rule),
          analysisRow('포섭·논증',a.application),
          hard ? analysisRow('증명·로그',a.proof || a.evidence) : analysisRow('증거·확인사항',a.evidence),
          analysisRow('반대논리',a.counter),
          analysisRow('결론 방향',a.conclusion)
        ].join('');
    return `<article class="variation-case">
      <div class="variation-question"><span>${hard ? '고난도 사례' : '사례변형'} ${i+1}</span><p>${esc(v)}</p></div>
      <div class="variation-answer"><div class="answer-title">${hard ? '법리적 논증·해결' : '법리적 해결'}</div>${body}</div>
    </article>`;
  }).join('')}</div>`;
}

function renderAreaFilters() {
  filtersEl.innerHTML = areas.map(area => `<button class="filter-btn ${area === activeArea ? 'active':''}" data-area="${esc(area)}">${esc(area)}</button>`).join('');
  filtersEl.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => { activeArea = btn.dataset.area; renderAreaFilters(); renderCards(); }));
}
function renderExamFilters() {
  examFiltersEl.innerHTML = exams.map(exam => `<button class="filter-btn exam ${exam === activeExam ? 'active':''}" data-exam="${esc(exam)}">${esc(exam)}</button>`).join('');
  examFiltersEl.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => { activeExam = btn.dataset.exam; renderExamFilters(); renderCards(); }));
}
function renderSubfields() {
  subfieldEl.innerHTML = subfields.map(s=>`<option value="${esc(s)}">${esc(s)}</option>`).join('');
  subfieldEl.addEventListener('change',()=>{activeSubfield=subfieldEl.value; renderCards();});
}
function searchableText(item) {
  const deep = (item.deepDive || []).flatMap(x => [x.title, x.body]);
  const matrixText = (item.factMatrix || []).flat();
  const guidanceText = (item.officialGuidance || []).flatMap(x => [x.label, x.url]);
  const solutionText = [...(item.variationAnalyses||[]),...(item.hardVariationAnalyses||[])].flatMap(a => Object.values(a||{}));
  const fields = [
    item.title,item.area,item.systemArea,item.subfield,item.type,item.summary,item.concept,item.issue,item.rule,item.coreRule,item.analysis,item.effect,item.theories,
    item.doctrineDebate,item.comparativeLaw,item.crossLawConflict,item.adjacentCaseLaw,item.precedentLineage,item.methodLineage,item.caseFacts,item.courtHolding,item.courtReasoning,item.counter,item.refinementStage,item.followUpResearch,
    ...(item.keywords||[]),...(item.examTags||[]),...(item.requirements||[]),...(item.relatedRules||[]),...(item.variations||[]),...(item.hardVariations||[]),...(item.proofIssues||[]),...(item.researchQuestions||[]),...solutionText,...guidanceText,...matrixText,...deep,...(item.application||[])
  ];
  return fields.filter(Boolean).join(' ').toLowerCase();
}
function filteredData() {
  const q = searchEl.value.trim().toLowerCase();
  return data.filter(item => {
    const areaOk = activeArea === '전체' || areaOf(item) === activeArea;
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
      <div class="card-top"><span class="badge">${esc(areaOf(item))} · ${esc(item.subfield || item.type)}</span><span class="level">${esc(item.level)}</span></div>
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
  const guidanceLinks = links(item.officialGuidance || []);
  const allSources = links(item.sources || []);
  const deep = (item.deepDive || []).map(x => `<div class="deep-item"><strong>${esc(x.title)}</strong><p>${esc(x.body)}</p></div>`).join('');
  const application = (item.application || []).length ? `<ol class="detail-list application-list">${item.application.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>` : '';
  const researchQuestions = list(item.researchQuestions || [], 'detail-list research-question-list');
  const variation = variationCases(item,false);
  const hardVariation = variationCases(item,true);
  const proofIssues = list(item.proofIssues || [], 'detail-list proof-list');
  const factMatrix = matrix(item.factMatrix || []);
  const caseVerification = item.isCaseNote && item.caseOriginalVerified ? `<p class="case-verification ok">판결 원문 대조 완료</p>` : '';
  detailEl.innerHTML = `
    <div class="section-kicker">${esc(areaOf(item))} · ${esc(item.subfield || '')} · ${esc(item.type)} · ${esc(item.level)}</div>
    <h3 class="detail-title">${esc(item.title)}</h3>
    <div class="detail-meta-row"><span>연구모형 ${esc(item.noteModel || '')}</span><span>법령·판례 기준 ${esc(item.lawDate || item.reviewed)}</span><span>최종 검토 ${esc(item.reviewed)}</span>${item.refinementStage ? `<span>${esc(item.refinementStage)}</span>` : ''}</div>
    ${caseVerification}
    ${section('관련 시험', chips(item.examTags || []))}
    ${section('개념·핵심정의', `<p>${esc(item.concept || item.summary)}</p>`)}
    ${section('관련 조문·공식 근거', statuteLinks)}
    ${section('성립요건·판단요소', list(item.requirements || []))}
    ${section('법적 효과', item.effect ? `<p>${esc(item.effect)}</p>` : '')}
    ${section('주요 쟁점', `<p>${esc(item.issue)}</p>`)}
    ${section('학설·해석론', item.theories ? `<p>${esc(item.theories)}</p>` : '')}
    ${section('학설 대립구조', item.doctrineDebate ? `<p>${esc(item.doctrineDebate)}</p>` : '')}
    ${section('비교법', item.comparativeLaw ? `<p>${esc(item.comparativeLaw)}</p>` : '')}
    ${section('판례의 선행·후속 관계', item.precedentLineage ? `<p>${esc(item.precedentLineage)}</p>` : '')}
    ${section('인접 판례·공식 해석', item.adjacentCaseLaw ? `<p>${esc(item.adjacentCaseLaw)}</p>` : '')}
    ${section('방법론의 연결구조', item.methodLineage ? `<p>${esc(item.methodLineage)}</p>` : '')}
    ${section('판례 사실관계', item.caseFacts ? `<p>${esc(item.caseFacts)}</p>` : '')}
    ${section('판례 사실관계 세분화', factMatrix)}
    ${section('법원의 판단', item.courtHolding ? `<p>${esc(item.courtHolding)}</p>` : '')}
    ${section('법원의 논증', item.courtReasoning ? `<p>${esc(item.courtReasoning)}</p>` : '')}
    ${section('핵심 법리·규범 구조', `<p>${esc(item.coreRule || item.rule)}</p>`)}
    ${section('법률 간 충돌·조정', item.crossLawConflict ? `<p>${esc(item.crossLawConflict)}</p>` : '')}
    ${section('증명책임·로그·증거', proofIssues)}
    ${section('반대논리·한계', item.counter ? `<p>${esc(item.counter)}</p>` : '')}
    ${section('전문 해설', `<p>${esc(item.analysis)}</p>`)}
    ${section('심화 쟁점 해설', deep)}
    ${section('사례 적용·논증 순서', application)}
    ${section('사례변형 및 해설', variation)}
    ${section('고난도 사례변형 및 논증', hardVariation)}
    ${section('연구 확인문제·퀴즈', researchQuestions)}
    ${section('후속 연구 포인트', item.followUpResearch ? `<p>${esc(item.followUpResearch)}</p>` : '')}
    ${section('관련 법리', chips(item.relatedRules || []))}
    ${section('관련 판례', caseLinks)}
    ${section('공식 가이드라인·비교자료', guidanceLinks)}
    ${section('공식·주요 출처', allSources || '<p>법적 추론 방법론 항목은 특정 조문에 종속되지 않으며, 법학 방법론과 사례분석을 중심으로 구성합니다.</p>')}
    ${documentFooter()}
  `;
  bindDocumentControls();
  dialog.showModal();
  requestAnimationFrame(() => scrollDetailTop('auto'));
}

dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) dialog.close();
});

searchEl.addEventListener('input', renderCards);
ensureDocumentControlsStyles();
ensureMainTopLink();
renderAreaFilters();
renderExamFilters();
renderSubfields();
renderCards();