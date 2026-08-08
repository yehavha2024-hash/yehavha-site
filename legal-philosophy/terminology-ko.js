(() => {
  'use strict';

  const terms = [
    ['meaningful human control', '의미 있는 인간 통제'],
    ['responsibility abundance', '책임의 다중·과잉 상태'],
    ['moral responsibility gap', '도덕적 책임공백'],
    ['civil liability gap', '민사책임 공백'],
    ['responsibility gap', '책임공백'],
    ['artificial moral agency', '인공적 도덕 행위자성'],
    ['moral agency', '도덕적 행위자성'],
    ['legal personhood', '법인격'],
    ['synthetic personhood', '합성적 법인격'],
    ['legal personality', '법인격'],
    ['legal person', '법적 인격체'],
    ['moral agent', '도덕적 행위자'],
    ['moral entity', '도덕적 평가대상'],
    ['bundle theory', '묶음 이론'],
    ['fiction theory', '의제설'],
    ['real entity theory', '실재설'],
    ['practical concordance', '실제적 조화'],
    ['praktische Konkordanz', '실제적 조화'],
    ['status positivus libertatis', '자유의 적극적 지위'],
    ['status passivus', '수동적 지위'],
    ['status negativus', '소극적 지위'],
    ['status positivus', '적극적 지위'],
    ['status activus', '능동적 지위'],
    ['corrective justice', '교정적 정의'],
    ['distributive justice', '분배적 정의'],
    ['correlativity', '상관성'],
    ['outcome responsibility', '결과책임'],
    ['role-responsibility', '역할책임'],
    ['causal responsibility', '인과책임'],
    ['liability responsibility', '법적 책임'],
    ['capacity responsibility', '능력책임'],
    ['prospective responsibility', '사전적 책임'],
    ['retrospective responsibility', '사후적 책임'],
    ['cheapest cost avoider', '최소비용 회피자'],
    ['rights as trumps', '권리의 으뜸패성'],
    ['law as integrity', '통합성으로서의 법'],
    ['rule of recognition', '승인규칙'],
    ['optimization requirements', '최적화 명령'],
    ['reason-responsiveness', '이유반응성'],
    ['guidance control', '지도적 통제'],
    ['responsibility-loci', '책임의 위치'],
    ['human–robot collaborations', '인간-로봇 협업'],
    ['human-robot collaborations', '인간-로봇 협업'],
    ['tracking', '추적 조건'],
    ['tracing', '귀속추적 조건'],
    ['Schutzpflicht', '국가의 기본권 보호의무'],
    ['Objektformel', '객체공식'],
    ['Anspruch', '청구권'],
    ['claim-right', '청구권'],
    ['no-right', '무권리'],
    ['privilege', '특권·자유'],
    ['immunity', '면책·면제'],
    ['disability', '무권능'],
    ['incidents', '법적 지위 요소'],
    ['incident', '법적 지위 요소'],
    ['agency', '행위자성'],
    ['hard case', '난해사건']
  ];

  const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const ordered = terms.slice().sort((a, b) => b[0].length - a[0].length);

  function localize(value) {
    let text = String(value ?? '');
    ordered.forEach(([foreign, korean]) => {
      const pattern = new RegExp(`${escapeRegex(foreign)}(?!\\s*\\()`, 'gi');
      text = text.replace(pattern, match => `${match} (${korean})`);
    });
    return text;
  }

  window.LEGAL_PHILOSOPHY_TERMINOLOGY = {
    terms: Object.freeze(Object.fromEntries(terms)),
    localize
  };
})();
