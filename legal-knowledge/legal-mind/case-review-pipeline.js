(() => {
  'use strict';

  const cases = Array.isArray(window.LEGAL_MIND_CASES) ? window.LEGAL_MIND_CASES : [];
  const roleMap = [
    {role:'사건정리자',steps:'01–03',job:'사실관계·법적 사실·법률관계를 사건기록으로 고정'},
    {role:'쟁점분석가',steps:'04',job:'일상적 질문을 법적 판단질문과 쟁점트리로 전환'},
    {role:'법률자료수집가',steps:'05',job:'쟁점별 법령·판례·공식자료를 수집하고 출처를 묶음화'},
    {role:'법률분석가',steps:'06·08·09',job:'증명구조를 반영해 요건별 포섭과 절차·구제를 분석'},
    {role:'반론가',steps:'07',job:'상대방의 최강 반론과 증거·인과관계 공격을 구성'},
    {role:'검증관',steps:'05·06 교차',job:'법령·판례 출처, 현행성, 증명자료 연결상태를 검증'},
    {role:'중립평가단',steps:'06–08 교차',job:'법리·증거·반론 내구성과 남은 불확실성을 중립평가'},
    {role:'판단통합자',steps:'10',job:'검증된 논증과 반론을 통합해 조건부 결론과 위험요인을 정리'}
  ];

  const pipeline = [
    {id:'collector',no:'01',role:'법률자료수집가'},
    {id:'analyst',no:'02',role:'법률분석가'},
    {id:'counter',no:'03',role:'반론가'},
    {id:'verifier',no:'04',role:'검증관'},
    {id:'neutralPanel',no:'05',role:'중립평가단'},
    {id:'integrator',no:'06',role:'판단통합자'}
  ];

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const arr = value => Array.isArray(value) ? value.filter(Boolean) : [];
  const nodeList = (caseId, prefix, values) => arr(values).map((text,index)=>({id:`${caseId}-${prefix}${String(index+1).padStart(2,'0')}`,text,refs:[]}));
  const sourceList = item => arr(item.sources).map((source,index)=>({id:`${item.id}-SRC${String(index+1).padStart(2,'0')}`,label:source.label || `공식자료 ${index+1}`,url:source.url || '',verificationStatus:'linked'}));
  const texts = nodes => arr(nodes).map(node => typeof node === 'string' ? node : node.text).filter(Boolean);
  const first = values => arr(values)[0] || '';
  const unique = values => [...new Set(arr(values).filter(Boolean))];

  function emptyStage(role){
    return {role,status:'waiting',outputs:[],sourceRefs:[],notes:[]};
  }

  function normalizeCase(item){
    const record = {
      schemaVersion:'1.0',
      pipelineVersion:'1.0',
      caseId:item.id,
      metadata:{
        title:item.title || '', mode:item.mode || '', area:item.area || '', level:item.level || '',
        question:item.question || '', summary:item.summary || ''
      },
      intake:{
        facts:nodeList(item.id,'F',item.facts),
        legalFacts:nodeList(item.id,'LF',item.legalFacts),
        relations:nodeList(item.id,'R',item.relation),
        issues:nodeList(item.id,'I',item.issues)
      },
      law:{
        laws:nodeList(item.id,'L',item.laws),
        precedents:nodeList(item.id,'P',item.precedents),
        officialSources:sourceList(item)
      },
      evidence:{
        items:nodeList(item.id,'E',item.evidence),
        burdens:nodeList(item.id,'B',item.burden)
      },
      arguments:{
        claimant:nodeList(item.id,'A',item.claimant),
        respondent:nodeList(item.id,'C',item.respondent)
      },
      analysis:{
        subsumption:nodeList(item.id,'S',item.subsumption),
        procedure:nodeList(item.id,'PR',item.procedure)
      },
      decision:{
        conclusions:nodeList(item.id,'D',item.conclusion),
        variations:nodeList(item.id,'V',item.variations)
      },
      review:{
        status:'ready',
        stages:{
          collector:emptyStage('법률자료수집가'),
          analyst:emptyStage('법률분석가'),
          counter:emptyStage('반론가'),
          verifier:emptyStage('검증관'),
          neutralPanel:emptyStage('중립평가단'),
          integrator:emptyStage('판단통합자')
        },
        gates:{sourceGate:'대기',counterArgumentGate:'대기',neutralityGate:'대기'}
      },
      audit:{generatedAt:new Date().toISOString(),sourceCaseId:item.id,manualReviewRequired:true}
    };
    return record;
  }

  function collect(record){
    const laws = texts(record.law.laws);
    const precedents = texts(record.law.precedents);
    const sources = record.law.officialSources;
    const outputs = [
      `쟁점 ${record.intake.issues.length}개를 기준으로 적용 법규범 ${laws.length}개를 수집했습니다.`,
      precedents.length ? `관련 판례·판례법리 ${precedents.length}개를 검토대상으로 고정했습니다.` : '직접 연결된 판례가 없어 판례 보강이 필요합니다.',
      sources.length ? `공식자료 링크 ${sources.length}개를 원문 확인 대상으로 등록했습니다.` : '공식자료 링크가 없어 원문 검증자료를 추가해야 합니다.'
    ];
    record.review.stages.collector = {
      role:'법률자료수집가',
      status:(laws.length && (precedents.length || record.metadata.mode !== '판례 기반')) ? 'completed' : 'conditional',
      outputs,
      sourceRefs:[...record.law.laws.map(n=>n.id),...record.law.precedents.map(n=>n.id),...sources.map(n=>n.id)],
      notes:['자료수집 단계는 결론을 작성하지 않고 적용후보와 공식원문 위치만 고정합니다.']
    };
  }

  function analyze(record){
    const issues = texts(record.intake.issues);
    const subsumption = texts(record.analysis.subsumption);
    const procedures = texts(record.analysis.procedure);
    const claimant = texts(record.arguments.claimant);
    record.review.stages.analyst = {
      role:'법률분석가',
      status:issues.length && subsumption.length ? 'completed' : 'conditional',
      outputs:unique([
        issues.length ? `핵심 판단질문: ${issues.join(' / ')}` : '',
        subsumption.length ? `요건 포섭: ${subsumption.join(' / ')}` : '',
        claimant.length ? `주장측 핵심논리: ${claimant.join(' / ')}` : '',
        procedures.length ? `절차·구제 검토: ${procedures.join(' / ')}` : ''
      ]),
      sourceRefs:[...record.intake.issues.map(n=>n.id),...record.analysis.subsumption.map(n=>n.id),...record.evidence.items.map(n=>n.id)],
      notes:['사실과 규범을 분리한 뒤 증명 가능한 사실만 포섭에 사용합니다.']
    };
  }

  function counter(record){
    const respondent = texts(record.arguments.respondent);
    const burdens = texts(record.evidence.burdens);
    const legalFacts = texts(record.intake.legalFacts);
    const outputs = unique([
      respondent.length ? `상대방 최강 반론: ${respondent.join(' / ')}` : '직접 작성된 상대방 반론이 없어 반대논증 보강이 필요합니다.',
      burdens.length ? `증명책임 공격점: ${burdens.join(' / ')}` : '',
      legalFacts.length ? `반론에서 흔들 수 있는 핵심 사실: ${legalFacts.slice(0,3).join(' / ')}` : ''
    ]);
    record.review.stages.counter = {
      role:'반론가',
      status:respondent.length ? 'completed' : 'manual-review-required',
      outputs,
      sourceRefs:[...record.arguments.respondent.map(n=>n.id),...record.evidence.burdens.map(n=>n.id),...record.intake.legalFacts.map(n=>n.id)],
      notes:['반론가는 분석가의 결론을 보강하지 않고 사실전제·증거·법리·포섭 순서로 공격합니다.']
    };
    record.review.gates.counterArgumentGate = respondent.length ? '통과' : '수동보강 필요';
  }

  function verify(record){
    const sources = record.law.officialSources;
    const precedentCount = record.law.precedents.length;
    const lawCount = record.law.laws.length;
    const precedentCase = record.metadata.mode === '판례 기반';
    let gate = '조건부';
    if (lawCount && sources.length && (!precedentCase || precedentCount)) gate = '원문 연결 완료';
    if (!sources.length || (precedentCase && !precedentCount)) gate = '수동 원문확인 필요';
    const manual = gate !== '원문 연결 완료';
    record.review.stages.verifier = {
      role:'검증관',
      status:manual ? 'manual-review-required' : 'conditional',
      outputs:[
        `법규범 ${lawCount}개, 판례·판례법리 ${precedentCount}개, 공식자료 링크 ${sources.length}개를 대조 대상으로 확인했습니다.`,
        `출처 게이트: ${gate}`,
        '현재 화면의 자동 검증은 공식자료 연결상태를 확인하는 단계이며 판결문 문구·법령 현행성의 최종 수동검토를 대체하지 않습니다.'
      ],
      sourceRefs:[...record.law.laws.map(n=>n.id),...record.law.precedents.map(n=>n.id),...sources.map(n=>n.id)],
      notes:['공식 원문 미확인 자료는 판단통합자의 확정근거로 승격하지 않습니다.']
    };
    record.review.gates.sourceGate = gate;
    record.audit.manualReviewRequired = manual;
  }

  function neutralAssess(record){
    const lawCount = record.law.laws.length;
    const precedentCount = record.law.precedents.length;
    const evidenceCount = record.evidence.items.length;
    const claimantCount = record.arguments.claimant.length;
    const respondentCount = record.arguments.respondent.length;
    const sourceReady = record.review.gates.sourceGate === '원문 연결 완료';
    const lawStrength = lawCount >= 2 && precedentCount >= 1 ? '강함' : lawCount >= 1 ? '경합' : '약함';
    const evidenceFit = evidenceCount >= 4 ? '충분' : evidenceCount >= 2 ? '일부 부족' : '핵심증거 부족';
    const counterDurability = respondentCount >= claimantCount && respondentCount > 0 ? '경합' : respondentCount > 0 ? '상대적으로 높음' : '취약';
    const uncertainty = sourceReady && evidenceCount >= 4 && respondentCount > 0 ? '중간' : '높음';
    record.review.stages.neutralPanel = {
      role:'중립평가단',
      status:'conditional',
      outputs:[
        `법리 강도: ${lawStrength}`,
        `증거 충족도: ${evidenceFit}`,
        `반론 내구성: ${counterDurability}`,
        `불확실성: ${uncertainty}`
      ],
      sourceRefs:[...record.evidence.items.map(n=>n.id),...record.arguments.claimant.map(n=>n.id),...record.arguments.respondent.map(n=>n.id)],
      notes:['확률 수치 대신 법리·증거·반론·불확실성의 네 축으로 평가합니다.']
    };
    record.review.gates.neutralityGate = '중립평가 완료';
  }

  function integrate(record){
    const conclusions = texts(record.decision.conclusions);
    const legalFacts = texts(record.intake.legalFacts);
    const burdens = texts(record.evidence.burdens);
    const verifierNeedsManual = record.review.stages.verifier.status === 'manual-review-required';
    const counterNeedsManual = record.review.stages.counter.status === 'manual-review-required';
    const status = verifierNeedsManual || counterNeedsManual ? 'manual-review-required' : 'completed';
    record.review.stages.integrator = {
      role:'판단통합자',
      status,
      outputs:unique([
        conclusions.length ? `통합 결론: ${conclusions.join(' / ')}` : '기존 사건자료에 결론이 없어 조건부 결론 작성이 필요합니다.',
        legalFacts.length ? `결론을 바꿀 수 있는 핵심 사실: ${legalFacts.slice(0,3).join(' / ')}` : '',
        burdens.length ? `남은 증명위험: ${burdens.slice(0,2).join(' / ')}` : '',
        verifierNeedsManual ? '공식 원문 검증 전이므로 확정적 법률의견이 아니라 조건부 검토결과로 유지합니다.' : '공식자료 연결상태를 통과했으나 실제 사건 적용 전 최신 원문 수동검토가 필요합니다.'
      ]),
      sourceRefs:[...record.decision.conclusions.map(n=>n.id),...record.intake.legalFacts.map(n=>n.id),...record.evidence.burdens.map(n=>n.id)],
      notes:['분석가와 반론가 중 하나를 삭제하지 않고 양측 논증과 검증상태를 함께 보존합니다.']
    };
    record.review.status = status === 'completed' ? 'completed' : 'manual-review-required';
    record.audit.manualReviewRequired = record.audit.manualReviewRequired || status !== 'completed';
  }

  function run(item){
    const record = normalizeCase(item);
    record.review.status = 'running';
    collect(record);
    analyze(record);
    counter(record);
    verify(record);
    neutralAssess(record);
    integrate(record);
    return record;
  }

  function roleMapHtml(){
    return roleMap.map((item,index)=>`<article class="review-role-card"><div><b>${String(index+1).padStart(2,'0')}</b><span>${esc(item.steps)}</span></div><h3>${esc(item.role)}</h3><p>${esc(item.job)}</p></article>`).join('');
  }

  function pipelineHtml(){
    return pipeline.map((item,index)=>`<div class="review-pipeline-stage"><b>${item.no}</b><strong>${esc(item.role)}</strong>${index < pipeline.length-1 ? '<span aria-hidden="true">→</span>' : ''}</div>`).join('');
  }

  function mountOverview(){
    const anchor = document.querySelector('.controls');
    if (!anchor || document.querySelector('[data-case-review-overview]')) return;
    const section = document.createElement('section');
    section.className = 'case-review-system';
    section.dataset.caseReviewOverview = 'true';
    section.innerHTML = `
      <div class="section-head">
        <div><p class="section-kicker">ROLE-BASED CASE REVIEW</p><h2>역할분담 사건검토 시스템</h2></div>
        <p>기존 10단계 리걸 마인드를 역할별 책임으로 재배치하고, 같은 사건기록을 수집·분석·반론·검증·중립평가·판단통합의 순서로 통과시킵니다.</p>
      </div>
      <div class="review-role-map">${roleMapHtml()}</div>
      <div class="review-pipeline-box">
        <div><small>EXECUTION PIPELINE</small><strong>실제 사건검토 실행 순서</strong></div>
        <div class="review-pipeline-flow">${pipelineHtml()}</div>
        <p>사건정리자와 쟁점분석가가 만든 정규화 사건기록을 입력값으로 사용하며, 검증관의 출처 게이트와 중립평가단의 불확실성 평가를 통과하지 않은 결과는 확정결론으로 승격하지 않습니다.</p>
      </div>`;
    anchor.parentNode.insertBefore(section,anchor);
  }

  function stageCard(id,stage,index){
    const statusLabel = {
      completed:'완료', conditional:'조건부', 'manual-review-required':'수동검토 필요', waiting:'대기'
    }[stage.status] || stage.status;
    const outputs = arr(stage.outputs).map(text=>`<li>${esc(text)}</li>`).join('');
    const notes = arr(stage.notes).map(text=>`<p>${esc(text)}</p>`).join('');
    return `<article class="case-review-stage" data-stage="${esc(id)}"><header><b>${String(index+1).padStart(2,'0')}</b><div><strong>${esc(stage.role)}</strong><span class="stage-status status-${esc(stage.status)}">${esc(statusLabel)}</span></div></header><ul>${outputs}</ul>${notes ? `<div class="stage-note">${notes}</div>`:''}</article>`;
  }

  function renderWorkbench(item,root){
    const record = run(item);
    root.dataset.reviewRan = 'true';
    root.querySelector('[data-review-state]').textContent = record.review.status === 'completed' ? '파이프라인 완료' : '조건부 완료 · 수동검토 필요';
    root.querySelector('[data-run-case-review]').textContent = '다시 실행';
    root.querySelector('[data-review-results]').innerHTML = pipeline.map((stage,index)=>stageCard(stage.id,record.review.stages[stage.id],index)).join('');
    root.querySelector('[data-review-gates]').innerHTML = `
      <div><span>출처 게이트</span><strong>${esc(record.review.gates.sourceGate)}</strong></div>
      <div><span>반대논증 게이트</span><strong>${esc(record.review.gates.counterArgumentGate)}</strong></div>
      <div><span>중립성 게이트</span><strong>${esc(record.review.gates.neutralityGate)}</strong></div>`;
    root.querySelector('[data-review-schema]').textContent = `${record.schemaVersion} · ${record.caseId} · ${record.intake.facts.length} facts · ${record.intake.issues.length} issues · ${record.law.officialSources.length} sources`;
  }

  function enhanceCaseDetail(){
    const detail = document.querySelector('#caseDetail');
    if (!detail || !detail.children.length || detail.querySelector('[data-case-review-workbench]')) return;
    const kicker = detail.querySelector('.detail-kicker');
    if (!kicker) return;
    const caseId = kicker.textContent.split('·')[0].trim();
    const item = cases.find(entry=>entry.id===caseId);
    if (!item) return;
    const workbench = document.createElement('section');
    workbench.className = 'case-review-workbench';
    workbench.dataset.caseReviewWorkbench = 'true';
    workbench.dataset.caseId = caseId;
    workbench.innerHTML = `
      <div class="workbench-head"><div><small>CASE REVIEW WORKBENCH</small><h4>역할분담 사건검토 실행</h4><p>이 사례의 동일한 사건기록을 여섯 역할이 순차 검토합니다. 각 역할은 이전 역할의 결과를 그대로 승인하지 않고 정해진 검증책임만 수행합니다.</p></div><div class="workbench-action"><span data-review-state>실행 전</span><button type="button" data-run-case-review>사건검토 실행</button></div></div>
      <div class="schema-strip"><span>사건기록 스키마</span><strong data-review-schema>1.0 · ${esc(caseId)}</strong><a href="./case-review.schema.json" target="_blank" rel="noopener">스키마 보기</a></div>
      <div class="review-gates" data-review-gates><div><span>출처 게이트</span><strong>대기</strong></div><div><span>반대논증 게이트</span><strong>대기</strong></div><div><span>중립성 게이트</span><strong>대기</strong></div></div>
      <div class="case-review-results" data-review-results>${pipeline.map((stage,index)=>stageCard(stage.id,emptyStage(stage.role),index)).join('')}</div>`;
    const overview = detail.querySelector('.model-overview');
    if (overview && overview.parentNode) overview.insertAdjacentElement('afterend',workbench);
    else detail.prepend(workbench);
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-run-case-review]');
    if (!button) return;
    const root = button.closest('[data-case-review-workbench]');
    const item = root && cases.find(entry=>entry.id===root.dataset.caseId);
    if (root && item) renderWorkbench(item,root);
  });

  const detail = document.querySelector('#caseDetail');
  if (detail) new MutationObserver(enhanceCaseDetail).observe(detail,{childList:true,subtree:false});

  window.LEGAL_CASE_REVIEW_ENGINE = {schemaVersion:'1.0',pipelineVersion:'1.0',roleMap,pipeline,normalizeCase,run};

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',mountOverview);
  else mountOverview();
})();
