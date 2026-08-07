(function(){
  const data = window.LEGAL_KNOWLEDGE || [];

  const text = v => typeof v === 'string' ? v.trim() : '';
  const first = (arr,n=3) => (Array.isArray(arr) ? arr.filter(Boolean).slice(0,n) : []);
  const joinRules = arr => first(arr,4).join(' · ');

  function ruleText(item){
    return text(item.coreRule) || text(item.rule) || text(item.analysis) || text(item.summary);
  }
  function requirementsText(item){
    const req = first(item.requirements,4);
    return req.length ? req.join(' / ') : '해당 법률요건과 판단요소';
  }
  function applicationText(item){
    const steps = first(item.application,4);
    if(steps.length) return steps.join(' → ');
    return `변경된 사실이 ${requirementsText(item)}에 어떤 영향을 미치는지 순서대로 포섭한다.`;
  }
  function opposingText(item){
    return text(item.counter) || text(item.doctrineDebate) || '반대 결론을 뒷받침하는 예외사유·보호법익·상대방의 합리적 신뢰 또는 통제가능성도 함께 검토해야 한다.';
  }
  function evidenceText(item){
    const p = first(item.proofIssues,4);
    if(p.length) return p.join(' ');
    const c = first(item.relatedCases,2).map(x=>x.label).filter(Boolean);
    const s = first(item.statuteSources,2).map(x=>x.label).filter(Boolean);
    const base = [...s,...c];
    return base.length
      ? `결론을 위해서는 ${base.join(' / ')} 등 공식 근거와 사실관계에 관한 자료를 대조해야 한다.`
      : '결론을 위해서는 당사자 행위의 시점·목적·통제가능성·인식 정도와 결과 사이의 인과관계를 뒷받침하는 자료를 확인해야 한다.';
  }
  function conditionalConclusion(item){
    const effect = text(item.effect);
    if(effect) return `따라서 변경된 사실이 핵심 요건을 충족하고 반대사정이 배척될 정도로 증명된다면 ${effect} 반대로 결정적 요건이 충족되지 않거나 예외사유가 인정되면 그 법적 효과는 제한되거나 반대 결론이 가능하다.`;
    return '따라서 결론은 변경된 사실이 핵심 요건을 충족하는지와 반대사정이 어느 정도 증명되는지에 따라 갈린다. 요건 충족이 인정되면 해당 법리가 적용되고, 결정적 요건이 결여되면 반대 결론이 된다.';
  }

  function makeNormal(item, variation, index){
    const custom = Array.isArray(item.variationSolutions) ? item.variationSolutions[index] : null;
    if(custom) return typeof custom === 'string' ? {analysis:custom} : custom;
    return {
      issue:`이 사례변형의 핵심은 “${variation}”이라는 변경사실이 ${item.title}의 성립요건·법적 효과를 바꾸는지 여부이다. 단순히 원래 결론을 반복하지 말고 어떤 요건에 변화가 생겼는지를 먼저 특정해야 한다.`,
      rule:ruleText(item),
      application:`우선 원래 사례와 달라진 사실을 분리한다. 그 다음 ${requirementsText(item)}를 기준으로 변경사실을 포섭한다. 구체적 검토순서는 ${applicationText(item)}이다. 변경사실이 핵심 요건을 강화하는 방향이면 원래 법리의 적용가능성이 높아지고, 반대로 요건을 약화하거나 예외사유를 발생시키면 결론이 달라질 수 있다.`,
      counter:opposingText(item),
      evidence:evidenceText(item),
      conclusion:conditionalConclusion(item)
    };
  }

  function makeHard(item, variation, index){
    const custom = Array.isArray(item.hardVariationSolutions) ? item.hardVariationSolutions[index] : null;
    if(custom) return typeof custom === 'string' ? {analysis:custom} : custom;
    const conflict = text(item.crossLawConflict);
    const debate = text(item.doctrineDebate);
    return {
      issue:`고난도 변형 “${variation}”에서는 하나의 법리만 적용해서는 부족하다. ${item.title}의 핵심요건과 함께 복수 당사자의 역할, 규제법과 사법상 책임의 중첩, 인과관계와 증명책임을 분리하여 검토해야 한다.`,
      rule:`기본 법리는 다음과 같다. ${ruleText(item)}${conflict ? ` 동시에 법률 간 관계는 다음과 같이 조정한다. ${conflict}` : ''}`,
      application:`1단계에서는 행위주체별로 개발·제공·통합·배치·운용 또는 의사결정 권한을 나눈다. 2단계에서는 ${requirementsText(item)}를 각 주체별로 포섭한다. 3단계에서는 각 위반 또는 결함이 결과발생에 실제로 기여했는지 인과관계를 검토한다. 4단계에서는 손해의 최종 부담, 구상관계, 책임제한 또는 예외를 분리한다.${debate ? ` 해석론상으로는 다음 대립도 고려한다. ${debate}` : ''}`,
      proof:`증명에서는 ${evidenceText(item)} 특히 정보가 사업자 또는 특정 당사자에게 편재된 경우 자료제출 거부·로그 삭제·불완전한 기록이 증명책임과 사실인정에 미치는 영향까지 검토한다.`,
      counter:opposingText(item),
      conclusion:`결론은 단일 주체에게 책임을 일괄 귀속하기보다 각 주체의 통제가능성·주의의무 위반·결과기여도·증거지배를 구분하여 도출해야 한다. ${conditionalConclusion(item)}`
    };
  }

  let normalCount=0;
  let hardCount=0;
  data.forEach(item=>{
    const variations = Array.isArray(item.variations) ? item.variations : [];
    const hard = Array.isArray(item.hardVariations) ? item.hardVariations : [];
    item.variationAnalyses = variations.map((v,i)=>makeNormal(item,v,i));
    item.hardVariationAnalyses = hard.map((v,i)=>makeHard(item,v,i));
    normalCount += item.variationAnalyses.length;
    hardCount += item.hardVariationAnalyses.length;
  });
  window.VARIATION_SOLUTION_COUNTS={normal:normalCount,hard:hardCount};
})();