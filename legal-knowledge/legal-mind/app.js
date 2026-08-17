(() => {
  'use strict';
  const cases = Array.isArray(window.LEGAL_MIND_CASES) ? window.LEGAL_MIND_CASES : [];
  const modes = [
    {id:'판례 기반',no:'01',title:'판례 기반 사례훈련',desc:'공식 판결문을 사례로 재구성하고 법원이 어떤 순서로 사실·규범·결론을 연결했는지 읽습니다.'},
    {id:'현실 사례',no:'02',title:'현실생활 분쟁훈련',desc:'일상적인 분쟁을 법적 사실·법률관계·쟁점으로 바꾸는 모범 사고과정을 읽습니다.'},
    {id:'사례변형',no:'03',title:'사례변형 훈련',desc:'사실 하나가 바뀔 때 어느 요건·증거·결론이 움직이는지 판단 경로를 비교합니다.'},
    {id:'종합훈련',no:'04',title:'종합 법률가 사고훈련',desc:'복수 당사자·청구권·증거·절차가 얽힌 사건을 법률가가 구조화하는 순서대로 읽습니다.'}
  ];
  const state = {mode:'전체',area:'전체',level:'전체',search:''};
  const $ = sel => document.querySelector(sel);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const list = items => `<ul>${(items||[]).map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`;
  const para = items => Array.isArray(items) ? list(items) : `<p>${esc(items||'')}</p>`;
  const first = items => Array.isArray(items) && items.length ? items[0] : '';
  const joined = (items, limit = 3) => (Array.isArray(items) ? items.slice(0, limit) : []).join(' / ');
  const stripQuestion = value => String(value || '').replace(/[?？]\s*$/,'');

  function thought(label, text){
    return `<div class="thinking-note"><strong>${esc(label)}</strong><p>${esc(text)}</p></div>`;
  }

  function modelOverview(item){
    const relation = first(item.relation);
    const issue = first(item.issues);
    const law = first(item.laws) || first(item.precedents);
    const burden = first(item.burden);
    const subsumption = first(item.subsumption);
    const conclusion = first(item.conclusion);
    const parts = [];
    if (relation) parts.push(`먼저 ${relation}의 법률관계를 세웁니다.`);
    if (issue) parts.push(`그 다음 핵심 쟁점을 “${issue}”로 한정합니다.`);
    if (law) parts.push(`판단규범은 ${law}에서 찾습니다.`);
    if (burden) parts.push(`증명 단계에서는 ${burden}`);
    if (subsumption) parts.push(`포섭에서는 ${subsumption}`);
    if (conclusion) parts.push(`이 과정을 거친 결론은 다음과 같습니다. ${conclusion}`);
    return parts.join(' ');
  }

  function variationList(item){
    const issue = first(item.issues) || '핵심 쟁점';
    const legalFact = first(item.legalFacts) || '법적으로 의미 있는 사실';
    return `<div class="variation-list">${(item.variations||[]).map((variation,index)=>`<div class="variation-item"><b>변형 ${String(index+1).padStart(2,'0')}</b><p>${esc(stripQuestion(variation))}</p><span>판단 방향 · 이 사실이 바뀌면 먼저 “${esc(legalFact)}”에 미치는 영향을 확인하고, 이어 “${esc(issue)}”에 대한 답이 달라지는지 다시 포섭합니다. 기존 결론을 그대로 복사하지 않습니다.</span></div>`).join('')}</div>`;
  }

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
    $('#caseGrid').innerHTML = data.map(item => `<article class="case-card"><div class="case-index">${esc(item.id)}</div><div class="case-main"><div class="case-meta"><span>${esc(item.mode)}</span><span>${esc(item.area)}</span><span>${esc(item.level)}</span></div><h3>${esc(item.title)}</h3><p class="summary">${esc(item.summary)}</p><p class="question">출발 쟁점 · ${esc(item.question)}</p></div><button class="open-case" type="button" data-case="${esc(item.id)}">모범 사고과정 읽기</button></article>`).join('');
  }

  function step(no,title,body,open=false){return `<details class="step"${open?' open':''}><summary><span class="step-no">${no}</span><span class="step-title">${esc(title)}</span></summary><div class="step-body">${body}</div></details>`;}

  function openCase(id){
    const item = cases.find(c=>c.id===id); if(!item)return;
    const sources = (item.sources||[]).length ? `<div class="source-list">${item.sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join('')}</div>` : '<p>이 사례는 훈련용 가상사례입니다. 실제 적용 전 최신 공식 법령·판례를 별도로 확인하십시오.</p>';
    const argumentsHtml = `${thought('법률가의 사고','한쪽 주장만 강화하면 법률가적 판단이 되지 않습니다. 청구·문제제기 측의 가장 강한 논리와 상대방의 가장 강한 반론을 모두 세운 뒤, 어느 쪽이 법규범·증거·증명책임 구조와 더 잘 맞는지 비교합니다.')}<div class="two-col"><div class="argument-box"><strong>청구·문제제기 측의 논리</strong>${para(item.claimant)}</div><div class="argument-box"><strong>상대방의 반론</strong>${para(item.respondent)}</div></div>`;

    const factsThought = `아직 누가 옳은지 판단하지 않습니다. 먼저 사건을 시간순으로 고정합니다. 이 사례에서는 ${joined(item.facts,3)}${(item.facts||[]).length>3?' 등의 순서로 놓습니다.':'의 순서로 놓습니다.'}`;
    const legalFactsThought = `모든 사실에 같은 무게를 주지 않습니다. 결론을 움직이는 사실은 ${joined(item.legalFacts,4)}입니다. 감정·도덕평가보다 법적 요건의 충족 여부를 바꾸는 사실을 먼저 남깁니다.`;
    const relationThought = `당사자를 단순히 “누가 잘못했는가”로 보지 않고 권리·의무와 청구의 방향으로 바꿉니다. 이 사건의 기본 구조는 ${joined(item.relation,3)}입니다.`;
    const issuesThought = `일상적인 질문을 법원이 답할 수 있는 규범 질문으로 바꿉니다. 이 사건에서 법률가가 먼저 세울 질문은 ${joined(item.issues,3)}입니다. 쟁점이 정확해야 뒤의 조문·판례 검색도 정확해집니다.`;
    const normsThought = `쟁점을 먼저 정한 뒤 그 질문에 답하는 규범을 찾습니다. 적용 후보는 ${joined(item.laws,3)}${(item.precedents||[]).length?`이고, 판례에서는 ${joined(item.precedents,2)}를 확인합니다.`:'입니다.'} 조문은 요건과 효과를 주고 판례는 그 의미와 적용범위를 구체화합니다.`;
    const evidenceThought = `법적으로 중요한 사실도 증명되지 않으면 재판의 기초가 되기 어렵습니다. 이 사건에서는 ${joined(item.evidence,4)}가 핵심 자료가 되고, 증명책임은 ${joined(item.burden,2)}의 구조로 봅니다.`;
    const subsumptionThought = `여기가 법률가적 사고의 핵심입니다. 조문을 반복하는 것이 아니라 이미 확정한 사실을 요건 하나하나에 대입합니다. 이 사례의 모범 포섭은 ${joined(item.subsumption,4)}입니다.`;
    const procedureThought = `실체법상 권리가 있다는 판단과 실제로 그 권리를 실현하는 절차는 구별합니다. 이 사건에서는 ${joined(item.procedure,3)}의 순서와 수단을 검토합니다.`;
    const conclusionThought = `결론은 직감이나 가치판단을 새로 덧붙이는 단계가 아닙니다. 앞서 정리한 사실·쟁점·규범·증거·포섭을 압축한 결과입니다. 이 사건의 결론은 ${joined(item.conclusion,3)}입니다.`;
    const variationThought = `사례변형은 새로운 문제를 던져 혼자 맞히게 하는 단계가 아닙니다. 원래 결론을 만든 핵심 사실 중 하나를 바꾸고, 어느 요건과 증거가 움직이는지 비교하여 “왜 결론이 유지되거나 달라지는가”를 읽는 단계입니다.`;

    $('#caseDetail').innerHTML = `<header class="detail-head"><div class="detail-kicker">${esc(item.id)} · ${esc(item.mode)} · ${esc(item.area)}</div><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p><div class="detail-meta"><span>${esc(item.level)}</span><span>${esc(item.mode)}</span><span>${esc(item.area)}</span></div></header><div class="training-question"><strong>읽는 방법</strong><span>먼저 스스로 답을 만들지 않습니다. 아래의 모범 사고과정을 순서대로 읽으면서 “왜 이 단계에서 이 사실을 보고, 왜 다음 단계로 넘어가는가”를 추적하십시오.</span><em>출발 쟁점 · ${esc(item.question)}</em></div><div class="model-overview"><strong>먼저 읽는 전체 모범 사고</strong><p>${esc(modelOverview(item))}</p></div><div class="detail-steps">${step('01','사실관계 — 판단 전에 사건의 시간축을 고정한다',thought('법률가의 사고',factsThought)+list(item.facts),true)}${step('02','법적으로 의미 있는 사실 — 결론을 움직이는 사실만 선별한다',thought('법률가의 사고',legalFactsThought)+list(item.legalFacts),true)}${step('03','당사자·법률관계 — 사람관계를 청구·권리·의무 관계로 바꾼다',thought('법률가의 사고',relationThought)+list(item.relation),true)}${step('04','핵심 쟁점 — 일상적 질문을 법적 판단 질문으로 바꾼다',thought('법률가의 사고',issuesThought)+list(item.issues),true)}${step('05','적용 법규범·판례 — 쟁점에 답하는 규범을 찾는다',thought('법률가의 사고',normsThought)+list(item.laws)+list(item.precedents),true)}${step('06','증거·증명책임 — 주장할 사실과 증명할 사실을 분리한다',thought('법률가의 사고',evidenceThought)+`<h4>핵심 증거</h4>${list(item.evidence)}<h4>증명책임</h4>${list(item.burden)}`)}${step('07','주장·반론 — 양쪽 논리를 같은 강도로 구성한다',argumentsHtml)}${step('08','포섭 — 구체적 사실을 법적 요건에 대입한다',thought('법률가의 사고',subsumptionThought)+list(item.subsumption),true)}${step('09','절차·구제 — 권리판단과 권리실현 수단을 구별한다',thought('법률가의 사고',procedureThought)+list(item.procedure))}${step('10','결론 — 앞 단계의 판단을 압축해 결론을 낸다',thought('법률가의 사고',conclusionThought)+list(item.conclusion),true)}${step('11','사례변형 — 바뀐 사실이 어느 요건을 움직이는지 읽는다',thought('법률가의 사고',variationThought)+variationList(item))}${step('12','공식자료·검증 — 모범 사고를 원문과 대조한다',thought('검증 원칙','모범 사고과정은 학습용 구조입니다. 판례 기반 사례는 반드시 판결문과 법령 원문에 다시 연결하고, 가상사례는 실제 사건에 그대로 대입하지 않습니다.')+sources)}</div>`;
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
