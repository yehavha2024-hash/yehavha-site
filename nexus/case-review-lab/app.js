(() => {
  'use strict';

  const engine = window.CASE_REVIEW_ENGINE;
  const form = document.getElementById('caseForm');
  const output = document.getElementById('reviewOutput');
  const snapshot = document.getElementById('reviewSnapshot');
  const gates = document.getElementById('reviewGates');
  const stages = document.getElementById('reviewStages');
  const trace = document.getElementById('reviewTrace');
  if (!engine || !form || !output || !snapshot || !gates || !stages || !trace) return;

  const $ = id => document.getElementById(id);
  const lines = value => String(value || '').split(/\n+/).map(item => item.trim()).filter(Boolean);
  const make = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  };

  function sources(value) {
    return lines(value).map((line,index) => {
      const split = line.split('|').map(item => item.trim());
      if (split.length > 1) return {label:split[0] || `자료 ${index+1}`, url:split.slice(1).join('|')};
      return {label:`자료 ${index+1}`, url:line};
    });
  }

  function collectInput() {
    return {
      caseId:`LAB-${Date.now()}`,
      title:$('caseTitle').value.trim(),
      mode:$('caseMode').value,
      area:$('caseArea').value.trim(),
      question:$('caseQuestion').value.trim(),
      summary:$('caseSummary').value.trim(),
      facts:lines($('facts').value),
      legalFacts:lines($('legalFacts').value),
      relations:lines($('relations').value),
      issues:lines($('issues').value),
      laws:lines($('laws').value),
      precedents:lines($('precedents').value),
      sources:sources($('sources').value),
      evidence:lines($('evidence').value),
      burdens:lines($('burdens').value),
      claimant:lines($('claimant').value),
      respondent:lines($('respondent').value),
      subsumption:lines($('subsumption').value),
      procedure:lines($('procedure').value),
      conclusions:lines($('conclusions').value)
    };
  }

  function gate(label, value) {
    const box = make('div','gate');
    box.append(make('span','',label), make('strong','',value));
    return box;
  }

  function snapshotItem(label, value, origin) {
    const box = make('div','snapshot-item');
    box.append(make('span','',label), make('strong','',value), make('small','',origin));
    return box;
  }

  function render(record) {
    snapshot.replaceChildren(
      snapshotItem('사건 ID', record.caseId, '자동 생성'),
      snapshotItem('사실관계', `${record.intake.facts.length}개`, '사용자 입력'),
      snapshotItem('핵심쟁점', `${record.intake.issues.length}개`, '사용자 입력'),
      snapshotItem('법규범', `${record.law.laws.length}개`, '사용자 입력'),
      snapshotItem('증거', `${record.evidence.items.length}개`, '사용자 입력'),
      snapshotItem('자료 링크', `${record.law.officialSources.length}개`, '사용자 입력 · 형식만 자동점검')
    );

    gates.replaceChildren(
      gate('핵심입력', record.review.gates.coreInput),
      gate('자료연결', record.review.gates.sourceLinks),
      gate('검토준비', record.review.gates.reviewReadiness)
    );

    stages.replaceChildren();
    const order = ['inputCheck','lawCheck','evidenceCheck','argumentCheck','analysisCheck','summary'];
    order.forEach((id,index) => {
      const stage = record.review.stages[id];
      const card = make('article','review-stage');
      const head = make('header');
      const title = make('div','stage-title');
      title.append(make('b','stage-no',String(index+1).padStart(2,'0')), make('h3','',stage.label));
      head.append(title, make('span','stage-status',stage.status));
      const list = make('ul');
      stage.outputs.forEach(text => list.append(make('li','',text)));
      card.append(head,list);
      stages.append(card);
    });

    const unresolved = record.review.unresolved.length ? record.review.unresolved.join(', ') : '없음';
    trace.replaceChildren(
      make('strong','',`최종 상태: ${record.review.status}`),
      make('span','',`자동 처리 범위: ${record.audit.automaticScope}`),
      make('span','',`남은 확인사항: ${unresolved}`),
      make('span','', '자동 수행하지 않는 항목: 법령·판례 원문 검색/현행성 검증, 사실 진위 판단, 증거가치 평가, 법률의견 생성, 승패예측')
    );
    output.hidden = false;
    output.scrollIntoView({behavior:'smooth',block:'start'});
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const item = collectInput();
    if (!item.title || !item.question || !item.facts.length || !item.issues.length) {
      window.alert('필수 입력: 사건명, 판단질문, 사실관계, 핵심쟁점');
      return;
    }
    render(engine.run(item));
  });

  document.getElementById('clearCase').addEventListener('click', () => {
    form.reset();
    output.hidden = true;
    snapshot.replaceChildren();
    gates.replaceChildren();
    stages.replaceChildren();
    trace.replaceChildren();
  });
})();
