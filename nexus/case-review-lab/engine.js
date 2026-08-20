(() => {
  'use strict';

  const arr = value => Array.isArray(value) ? value.filter(Boolean) : [];
  const nodes = (caseId, prefix, values) => arr(values).map((text,index)=>({id:`${caseId}-${prefix}${String(index+1).padStart(2,'0')}`,text,refs:[]}));
  const stage = label => ({label,status:'대기',outputs:[],missing:[]});
  const validUrl = value => /^https?:\/\//i.test(String(value || '').trim());

  function normalizeCase(item){
    const caseId = item.caseId || `LAB-${Date.now()}`;
    return {
      schemaVersion:'1.1',
      pipelineVersion:'1.1',
      caseId,
      metadata:{title:item.title||'',mode:item.mode||'',area:item.area||'',question:item.question||'',summary:item.summary||''},
      intake:{facts:nodes(caseId,'F',item.facts),legalFacts:nodes(caseId,'LF',item.legalFacts),relations:nodes(caseId,'R',item.relations),issues:nodes(caseId,'I',item.issues)},
      law:{laws:nodes(caseId,'L',item.laws),precedents:nodes(caseId,'P',item.precedents),officialSources:arr(item.sources).map((source,index)=>({id:`${caseId}-SRC${String(index+1).padStart(2,'0')}`,label:source.label||`자료 ${index+1}`,url:source.url||'',linkValid:validUrl(source.url)}))},
      evidence:{items:nodes(caseId,'E',item.evidence),burdens:nodes(caseId,'B',item.burdens)},
      arguments:{claimant:nodes(caseId,'A',item.claimant),respondent:nodes(caseId,'C',item.respondent)},
      analysis:{subsumption:nodes(caseId,'S',item.subsumption),procedure:nodes(caseId,'PR',item.procedure)},
      decision:{conclusions:nodes(caseId,'D',item.conclusions)},
      review:{
        status:'대기',
        stages:{
          inputCheck:stage('핵심 입력 점검'),
          lawCheck:stage('법률자료 연결 점검'),
          evidenceCheck:stage('증거·증명책임 점검'),
          argumentCheck:stage('양측 주장 점검'),
          analysisCheck:stage('분석항목 점검'),
          summary:stage('검토 준비상태 요약')
        },
        gates:{coreInput:'대기',sourceLinks:'대기',reviewReadiness:'대기'},
        unresolved:[]
      },
      audit:{generatedAt:new Date().toISOString(),automaticScope:'입력자료의 형식·누락·연결상태 점검',manualLegalReviewRequired:true}
    };
  }

  function inputCheck(record){
    const missing = [];
    if (!record.metadata.title) missing.push('사건명');
    if (!record.metadata.question) missing.push('판단질문');
    if (!record.intake.facts.length) missing.push('사실관계');
    if (!record.intake.issues.length) missing.push('핵심쟁점');
    const complete = missing.length === 0;
    record.review.stages.inputCheck = {
      label:'핵심 입력 점검',
      status:complete ? '완료' : '보강 필요',
      outputs:[
        `사실관계 ${record.intake.facts.length}개 · 법적 사실 ${record.intake.legalFacts.length}개 · 법률관계 ${record.intake.relations.length}개 · 핵심쟁점 ${record.intake.issues.length}개`,
        complete ? '필수 입력항목이 모두 있습니다.' : `필수 입력 누락: ${missing.join(', ')}`
      ],
      missing
    };
    record.review.gates.coreInput = complete ? '필수입력 완료' : '필수입력 보강 필요';
  }

  function lawCheck(record){
    const validSources = record.law.officialSources.filter(source => source.linkValid);
    const invalidSources = record.law.officialSources.filter(source => !source.linkValid);
    const missing = [];
    if (!record.law.laws.length) missing.push('적용 법령·법규범');
    if (!validSources.length) missing.push('공식자료 URL');
    record.review.stages.lawCheck = {
      label:'법률자료 연결 점검',
      status:missing.length ? '보강 필요' : '연결 있음',
      outputs:[
        `사용자 입력 법령·법규범 ${record.law.laws.length}개 · 판례·판례법리 ${record.law.precedents.length}개`,
        `URL 형식이 유효한 자료 링크 ${validSources.length}개${invalidSources.length ? ` · 형식 오류 ${invalidSources.length}개` : ''}`,
        '이 단계는 링크 존재와 입력 여부만 확인합니다. 법령 현행성·판결문 내용·출처의 진위를 자동 검증하지 않습니다.'
      ],
      missing
    };
    record.review.gates.sourceLinks = validSources.length ? '자료 링크 있음 · 원문검증 필요' : '공식자료 링크 없음';
  }

  function evidenceCheck(record){
    const missing = [];
    if (!record.evidence.items.length) missing.push('증거');
    if (!record.evidence.burdens.length) missing.push('증명책임·입증위험');
    record.review.stages.evidenceCheck = {
      label:'증거·증명책임 점검',
      status:missing.length ? '보강 필요' : '입력 있음',
      outputs:[
        `사용자 입력 증거 ${record.evidence.items.length}개 · 증명책임/입증위험 ${record.evidence.burdens.length}개`,
        '증거 개수만으로 증거가 충분한지, 신빙성이 있는지, 증명력이 높은지는 판정하지 않습니다.'
      ],
      missing
    };
  }

  function argumentCheck(record){
    const missing = [];
    if (!record.arguments.claimant.length) missing.push('주장측 논리');
    if (!record.arguments.respondent.length) missing.push('상대방 반론');
    record.review.stages.argumentCheck = {
      label:'양측 주장 점검',
      status:missing.length ? '보강 필요' : '양측 입력 있음',
      outputs:[
        `주장측 논리 ${record.arguments.claimant.length}개 · 상대방 반론 ${record.arguments.respondent.length}개`,
        record.arguments.respondent.length ? '반대논증 입력이 존재합니다.' : '상대방 관점의 반론이 없어 일방향 검토 위험이 있습니다.'
      ],
      missing
    };
  }

  function analysisCheck(record){
    const missing = [];
    if (!record.analysis.subsumption.length) missing.push('포섭');
    if (!record.analysis.procedure.length) missing.push('절차·구제');
    if (!record.decision.conclusions.length) missing.push('조건부 결론');
    record.review.stages.analysisCheck = {
      label:'분석항목 점검',
      status:missing.length ? '보강 필요' : '입력 있음',
      outputs:[
        `포섭 ${record.analysis.subsumption.length}개 · 절차/구제 ${record.analysis.procedure.length}개 · 조건부 결론 ${record.decision.conclusions.length}개`,
        '여기에 표시되는 포섭과 결론은 사용자가 입력한 내용입니다. 시스템이 새 법률의견을 생성한 것이 아닙니다.'
      ],
      missing
    };
  }

  function summarize(record){
    const checked = ['inputCheck','lawCheck','evidenceCheck','argumentCheck','analysisCheck'];
    const missing = checked.flatMap(id => record.review.stages[id].missing || []);
    record.review.unresolved = [...new Set(missing)];
    const ready = record.review.unresolved.length === 0;
    record.review.stages.summary = {
      label:'검토 준비상태 요약',
      status:ready ? '구조화 완료' : '보강 필요',
      outputs:[
        ready ? '입력자료의 구조상 필수 검토항목이 모두 채워져 있습니다.' : `추가 입력·확인이 필요한 항목: ${record.review.unresolved.join(', ')}`,
        '다음 단계는 최신 법령·판례 원문 확인, 증거가치 평가, 사실인정, 법률적 포섭과 최종 판단입니다. 이 단계는 현재 자동 수행하지 않습니다.'
      ],
      missing:record.review.unresolved
    };
    record.review.gates.reviewReadiness = ready ? '구조화 완료 · 법률검토 필요' : '입력 보강 후 법률검토';
    record.review.status = ready ? '구조화 완료' : '입력 보강 필요';
  }

  function run(item){
    const record = normalizeCase(item);
    inputCheck(record);
    lawCheck(record);
    evidenceCheck(record);
    argumentCheck(record);
    analysisCheck(record);
    summarize(record);
    return record;
  }

  window.CASE_REVIEW_ENGINE = {schemaVersion:'1.1',pipelineVersion:'1.1',run,normalizeCase};
})();
