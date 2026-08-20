(() => {
  'use strict';

  const arr = value => Array.isArray(value) ? value.filter(Boolean) : [];
  const unique = values => [...new Set(arr(values).filter(Boolean))];
  const nodes = (caseId, prefix, values) => arr(values).map((text,index)=>({id:`${caseId}-${prefix}${String(index+1).padStart(2,'0')}`,text,refs:[]}));
  const texts = values => arr(values).map(item => typeof item === 'string' ? item : item.text).filter(Boolean);
  const stage = role => ({role,status:'waiting',outputs:[],sourceRefs:[],notes:[]});

  function normalizeCase(item){
    const caseId = item.caseId || `LAB-${Date.now()}`;
    return {
      schemaVersion:'1.0',
      pipelineVersion:'1.0',
      caseId,
      metadata:{title:item.title||'',mode:item.mode||'',area:item.area||'',level:item.level||'',question:item.question||'',summary:item.summary||''},
      intake:{facts:nodes(caseId,'F',item.facts),legalFacts:nodes(caseId,'LF',item.legalFacts),relations:nodes(caseId,'R',item.relations),issues:nodes(caseId,'I',item.issues)},
      law:{laws:nodes(caseId,'L',item.laws),precedents:nodes(caseId,'P',item.precedents),officialSources:arr(item.sources).map((source,index)=>({id:`${caseId}-SRC${String(index+1).padStart(2,'0')}`,label:source.label||`공식자료 ${index+1}`,url:source.url||'',verificationStatus:'linked'}))},
      evidence:{items:nodes(caseId,'E',item.evidence),burdens:nodes(caseId,'B',item.burdens)},
      arguments:{claimant:nodes(caseId,'A',item.claimant),respondent:nodes(caseId,'C',item.respondent)},
      analysis:{subsumption:nodes(caseId,'S',item.subsumption),procedure:nodes(caseId,'PR',item.procedure)},
      decision:{conclusions:nodes(caseId,'D',item.conclusions),variations:nodes(caseId,'V',item.variations)},
      review:{status:'ready',stages:{collector:stage('법률자료수집가'),analyst:stage('법률분석가'),counter:stage('반론가'),verifier:stage('검증관'),neutralPanel:stage('중립평가단'),integrator:stage('판단통합자')},gates:{sourceGate:'대기',counterArgumentGate:'대기',neutralityGate:'대기'}},
      audit:{generatedAt:new Date().toISOString(),sourceCaseId:caseId,manualReviewRequired:true}
    };
  }

  function collect(record){
    const laws = texts(record.law.laws);
    const precedents = texts(record.law.precedents);
    const sources = record.law.officialSources.filter(source => /^https?:\/\//i.test(source.url));
    record.review.stages.collector = {
      role:'법률자료수집가',
      status:laws.length ? 'completed' : 'manual-review-required',
      outputs:[`적용 법규범 ${laws.length}개`, `판례·판례법리 ${precedents.length}개`, `공식자료 링크 ${sources.length}개`],
      sourceRefs:[...record.law.laws.map(n=>n.id),...record.law.precedents.map(n=>n.id),...sources.map(n=>n.id)],
      notes:['자료수집 단계는 적용후보와 원문 위치를 고정합니다.']
    };
  }

  function analyze(record){
    const issues = texts(record.intake.issues);
    const subsumption = texts(record.analysis.subsumption);
    const procedures = texts(record.analysis.procedure);
    record.review.stages.analyst = {
      role:'법률분석가',
      status:issues.length ? 'completed' : 'manual-review-required',
      outputs:unique([
        issues.length ? `핵심 쟁점: ${issues.join(' / ')}` : '쟁점 입력 필요',
        subsumption.length ? `포섭: ${subsumption.join(' / ')}` : '포섭 보강 필요',
        procedures.length ? `절차·구제: ${procedures.join(' / ')}` : ''
      ]),
      sourceRefs:[...record.intake.issues.map(n=>n.id),...record.analysis.subsumption.map(n=>n.id),...record.evidence.items.map(n=>n.id)],
      notes:['사실과 규범을 분리하고 증명 가능한 사실을 중심으로 판단합니다.']
    };
  }

  function counter(record){
    const respondent = texts(record.arguments.respondent);
    const burdens = texts(record.evidence.burdens);
    record.review.stages.counter = {
      role:'반론가',
      status:respondent.length ? 'completed' : 'manual-review-required',
      outputs:unique([
        respondent.length ? `상대방 핵심 반론: ${respondent.join(' / ')}` : '반대논증 입력 필요',
        burdens.length ? `증명책임 위험: ${burdens.join(' / ')}` : ''
      ]),
      sourceRefs:[...record.arguments.respondent.map(n=>n.id),...record.evidence.burdens.map(n=>n.id)],
      notes:['분석가의 결론을 승인하지 않고 독립적으로 공격합니다.']
    };
    record.review.gates.counterArgumentGate = respondent.length ? '통과' : '수동보강 필요';
  }

  function verify(record){
    const validSources = record.law.officialSources.filter(source => /^https?:\/\//i.test(source.url));
    const lawCount = record.law.laws.length;
    const gate = lawCount && validSources.length ? '원문 연결' : '수동 원문확인 필요';
    record.review.stages.verifier = {
      role:'검증관',
      status:gate === '원문 연결' ? 'conditional' : 'manual-review-required',
      outputs:[`법규범 ${lawCount}개 · 공식자료 ${validSources.length}개`, `출처 게이트: ${gate}`, '현행성·판결문 문구의 최종 확인은 수동검토 대상입니다.'],
      sourceRefs:[...record.law.laws.map(n=>n.id),...validSources.map(n=>n.id)],
      notes:['원문 미확인 자료는 확정근거로 승격하지 않습니다.']
    };
    record.review.gates.sourceGate = gate;
    record.audit.manualReviewRequired = true;
  }

  function neutral(record){
    const lawCount = record.law.laws.length;
    const evidenceCount = record.evidence.items.length;
    const claimantCount = record.arguments.claimant.length;
    const respondentCount = record.arguments.respondent.length;
    const lawStrength = lawCount >= 2 ? '강함' : lawCount === 1 ? '경합' : '약함';
    const evidenceFit = evidenceCount >= 4 ? '충분' : evidenceCount >= 2 ? '일부 부족' : '핵심증거 부족';
    const counterDurability = respondentCount && claimantCount ? '경합' : respondentCount ? '높음' : '취약';
    const uncertainty = record.review.gates.sourceGate === '원문 연결' && evidenceCount >= 4 && respondentCount ? '중간' : '높음';
    record.review.stages.neutralPanel = {
      role:'중립평가단',
      status:'conditional',
      outputs:[`법리 강도: ${lawStrength}`,`증거 충족도: ${evidenceFit}`,`반론 내구성: ${counterDurability}`,`불확실성: ${uncertainty}`],
      sourceRefs:[...record.evidence.items.map(n=>n.id),...record.arguments.claimant.map(n=>n.id),...record.arguments.respondent.map(n=>n.id)],
      notes:['확률 수치 대신 법리·증거·반론·불확실성의 네 축으로 평가합니다.']
    };
    record.review.gates.neutralityGate = '중립평가 완료';
  }

  function integrate(record){
    const conclusions = texts(record.decision.conclusions);
    const legalFacts = texts(record.intake.legalFacts);
    const burdens = texts(record.evidence.burdens);
    const manual = ['collector','analyst','counter','verifier'].some(id => record.review.stages[id].status === 'manual-review-required');
    record.review.stages.integrator = {
      role:'판단통합자',
      status:manual ? 'manual-review-required' : 'completed',
      outputs:unique([
        conclusions.length ? `통합 결론: ${conclusions.join(' / ')}` : '조건부 결론 입력 필요',
        legalFacts.length ? `결론을 바꿀 핵심 사실: ${legalFacts.slice(0,3).join(' / ')}` : '',
        burdens.length ? `남은 증명위험: ${burdens.slice(0,2).join(' / ')}` : '',
        manual ? '수동보강 또는 원문검토가 남아 있습니다.' : '자동 단계는 완료되었으며 최종 수동검토가 필요합니다.'
      ]),
      sourceRefs:[...record.decision.conclusions.map(n=>n.id),...record.intake.legalFacts.map(n=>n.id),...record.evidence.burdens.map(n=>n.id)],
      notes:['분석·반론·검증상태를 함께 보존합니다.']
    };
    record.review.status = manual ? 'manual-review-required' : 'completed';
    record.audit.manualReviewRequired = true;
  }

  function run(item){
    const record = normalizeCase(item);
    record.review.status = 'running';
    collect(record);
    analyze(record);
    counter(record);
    verify(record);
    neutral(record);
    integrate(record);
    return record;
  }

  window.CASE_REVIEW_ENGINE = {schemaVersion:'1.0',pipelineVersion:'1.0',run,normalizeCase};
})();
