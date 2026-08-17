(() => {
  'use strict';
  const cases = Array.isArray(window.LEGAL_MIND_CASES) ? window.LEGAL_MIND_CASES : [];
  const modes = [
    {id:'판례 기반',no:'01',title:'판례 기반 사례훈련',desc:'공식 판결문의 사실관계와 판시법리를 사건 문제로 다시 풀어봅니다.'},
    {id:'현실 사례',no:'02',title:'현실생활 분쟁훈련',desc:'생활 주변의 분쟁을 민사·형사·행정의 법적 문제로 변환합니다.'},
    {id:'사례변형',no:'03',title:'사례변형 훈련',desc:'사실 하나를 바꿔 어떤 요건·증거·결론이 움직이는지 비교합니다.'},
    {id:'종합훈련',no:'04',title:'종합 법률가 사고훈련',desc:'복수 당사자·청구권·절차를 하나의 사건에서 동시에 구조화합니다.'}
  ];
  const state = {mode:'전체',area:'전체',level:'전체',search:''};
  const $ = sel => document.querySelector(sel);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const list = items => `<ul>${(items||[]).map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`;
  const para = items => Array.isArray(items) ? list(items) : `<p>${esc(items||'')}</p>`;

  function renderModes(){
    const root = $('#modeGrid');
    root.innerHTML = modes.map(mode => {
      const count = cases.filter(item => item.mode === mode.id).length;
      return `<button class="mode-card" type="button" data-mode="${esc(mode.id)}"><span class="mode-top"><span class="mode-no">${mode.no}</span><span class="mode-count">${count} CASES</span></span><h3>${esc(mode.title)}</h3><p>${esc(mode.desc)}</p></button>`;
    }).join('');
    root.addEventListener('click', e => {
      const btn = e.target.closest('[data-mode]');
      if (!btn) return;
      state.mode = btn.dataset.mode;
      syncFilters();
      renderCases();
      $('#caseTitle').scrollIntoView({behavior:'smooth',block:'start'});
    });
  }

  function buildFilters(){
    const modeRoot = $('#modeFilters');
    const areaRoot = $('#areaFilters');
    const areas = ['전체', ...new Set(cases.map(item => item.area))];
    modeRoot.innerHTML = ['전체',...modes.map(m=>m.id)].map(value=>`<button class="filter-btn${value==='전체'?' active':''}" type="button" data-filter-mode="${esc(value)}">${esc(value)}</button>`).join('');
    areaRoot.innerHTML = areas.map(value=>`<button class="filter-btn${value==='전체'?' active':''}" type="button" data-filter-area="${esc(value)}">${esc(value)}</button>`).join('');
    modeRoot.addEventListener('click',e=>{const b=e.target.closest('[data-filter-mode]');if(!b)return;state.mode=b.dataset.filterMode;syncFilters();renderCases();});
    areaRoot.addEventListener('click',e=>{const b=e.target.closest('[data-filter-area]');if(!b)return;state.area=b.dataset.filterArea;syncFilters();renderCases();});
    $('#levelFilter').addEventListener('change',e=>{state.level=e.target.value;renderCases();});
    $('#searchInput').addEventListener('input',e=>{state.search=e.target.value.trim().toLowerCase();renderCases();});
  }

  function syncFilters(){
    document.querySelectorAll('[data-filter-mode]').forEach(btn=>btn.classList.toggle('active',btn.dataset.filterMode===state.mode));
    document.querySelectorAll('[data-filter-area]').forEach(btn=>btn.classList.toggle('active',btn.dataset.filterArea===state.area));
  }

  function searchable(item){
    return [item.id,item.mode,item.level,item.area,item.title,item.summary,item.question,...(item.issues||[]),...(item.laws||[]),...(item.precedents||[])].join(' ').toLowerCase();
  }

  function filtered(){
    return cases.filter(item => (state.mode==='전체'||item.mode===state.mode) && (state.area==='전체'||item.area===state.area) && (state.level==='전체'||item.level===state.level) && (!state.search||searchable(item).includes(state.search)));
  }

  function renderCases(){
    const data = filtered();
    $('#resultCount').textContent = `${data.length}개 사례`;
    $('#emptyState').hidden = data.length > 0;
    $('#caseGrid').innerHTML = data.map(item => `<article class="case-card"><div class="case-index">${esc(item.id)}</div><div class="case-main"><div class="case-meta"><span>${esc(item.mode)}</span><span>${esc(item.area)}</span><span>${esc(item.level)}</span></div><h3>${esc(item.title)}</h3><p class="summary">${esc(item.summary)}</p><p class="question">핵심 질문 · ${esc(item.question)}</p></div><button class="open-case" type="button" data-case="${esc(item.id)}">훈련 시작</button></article>`).join('');
  }

  function step(no,title,body,open=false){return `<details class="step"${open?' open':''}><summary><span class="step-no">${no}</span><span class="step-title">${esc(title)}</span></summary><div class="step-body">${body}</div></details>`;}
  function openCase(id){
    const item = cases.find(c=>c.id===id); if(!item)return;
    const sources = (item.sources||[]).length ? `<div class="source-list">${item.sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join('')}</div>` : '<p>이 사례는 훈련용 가상사례입니다. 실제 적용 전 최신 공식 법령·판례를 별도로 확인하십시오.</p>';
    const argumentsHtml = `<div class="two-col"><div class="argument-box"><strong>청구·문제제기 측</strong>${para(item.claimant)}</div><div class="argument-box"><strong>상대방 반론</strong>${para(item.respondent)}</div></div>`;
    $('#caseDetail').innerHTML = `<header class="detail-head"><div class="detail-kicker">${esc(item.id)} · ${esc(item.mode)} · ${esc(item.area)}</div><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p><div class="detail-meta"><span>${esc(item.level)}</span><span>${esc(item.mode)}</span><span>${esc(item.area)}</span></div></header><div class="training-question">먼저 스스로 답해보십시오. ${esc(item.question)}</div><div class="detail-steps">${step('01','사실관계 — 사건을 시간순으로 정리',list(item.facts),true)}${step('02','법적으로 의미 있는 사실 — 결론을 움직이는 사실 선별',list(item.legalFacts))}${step('03','당사자·법률관계 — 누가 누구에게 무엇을 주장하는가',list(item.relation))}${step('04','핵심 쟁점 — 법원이 답해야 할 질문',list(item.issues))}${step('05','적용 법규범·판례 — 조문과 법리를 연결',list(item.laws)+list(item.precedents))}${step('06','증거·증명책임 — 무엇을 누가 증명하는가',list(item.evidence)+list(item.burden))}${step('07','주장·반론 — 양쪽 논리를 모두 구성',argumentsHtml)}${step('08','포섭 — 사실을 요건에 대입',list(item.subsumption))}${step('09','절차·구제 — 협의에서 소송·집행까지',list(item.procedure))}${step('10','결론 — 왜 그런 결론에 이르는가',list(item.conclusion))}${step('11','사례변형 — 사실 하나를 바꿔 다시 풀기',list(item.variations))}${step('12','공식자료·검증',sources)}</div>`;
    $('#caseDialog').showModal();
  }

  $('#caseGrid').addEventListener('click',e=>{const b=e.target.closest('[data-case]');if(b)openCase(b.dataset.case);});
  $('#dialogClose').addEventListener('click',()=>$('#caseDialog').close());
  $('#caseDialog').addEventListener('click',e=>{if(e.target===$('#caseDialog'))$('#caseDialog').close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#caseDialog').open)$('#caseDialog').close();});
  document.querySelectorAll('a[href="#top"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();window.scrollTo({top:0,behavior:'smooth'});}));

  $('#totalCount').textContent = `사례 ${cases.length}`;
  renderModes(); buildFilters(); renderCases();
})();
