(() => {
  'use strict';

  const engine = window.CASE_REVIEW_ENGINE;
  const form = document.getElementById('caseForm');
  const output = document.getElementById('reviewOutput');
  const gates = document.getElementById('reviewGates');
  const stages = document.getElementById('reviewStages');
  const trace = document.getElementById('reviewTrace');
  if (!engine || !form || !output || !gates || !stages || !trace) return;

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
      if (split.length > 1) return {label:split[0] || `공식자료 ${index+1}`, url:split.slice(1).join('|')};
      return {label:`공식자료 ${index+1}`, url:line};
    });
  }

  function collectInput() {
    return {
      caseId:$('caseId').value.trim() || `LAB-${Date.now()}`,
      title:$('caseTitle').value.trim(),
      mode:$('caseMode').value,
      area:$('caseArea').value.trim(),
      level:'실제 검토',
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
      conclusions:lines($('conclusions').value),
      variations:[]
    };
  }

  function gate(label, value) {
    const box = make('div','gate');
    box.append(make('span','',label), make('strong','',value));
    return box;
  }

  function render(record) {
    gates.replaceChildren(
      gate('출처 게이트', record.review.gates.sourceGate),
      gate('반대논증 게이트', record.review.gates.counterArgumentGate),
      gate('중립성 게이트', record.review.gates.neutralityGate)
    );

    stages.replaceChildren();
    const order = ['collector','analyst','counter','verifier','neutralPanel','integrator'];
    order.forEach(id => {
      const stage = record.review.stages[id];
      const card = make('article','review-stage');
      const head = make('header');
      head.append(make('h3','',stage.role), make('span','stage-status',stage.status));
      const list = make('ul');
      stage.outputs.forEach(text => list.append(make('li','',text)));
      card.append(head,list);
      stages.append(card);
    });

    trace.textContent = `${record.caseId} · ${record.intake.facts.length} facts · ${record.intake.issues.length} issues · ${record.law.laws.length} laws · ${record.evidence.items.length} evidence · ${record.law.officialSources.length} sources · ${record.review.status}`;
    output.hidden = false;
    output.scrollIntoView({behavior:'smooth',block:'start'});
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const item = collectInput();
    if (!item.title || !item.question || !item.facts.length || !item.issues.length) {
      window.alert('사건명, 판단질문, 사실관계, 핵심쟁점을 입력해 주세요.');
      return;
    }
    render(engine.run(item));
  });

  document.getElementById('clearCase').addEventListener('click', () => {
    form.reset();
    output.hidden = true;
    gates.replaceChildren();
    stages.replaceChildren();
    trace.textContent = '';
  });
})();
