(() => {
  'use strict';

  const current = window.LEGAL_PHILOSOPHY_TERMINOLOGY || {};
  const baseLocalize = typeof current.localize === 'function'
    ? current.localize.bind(current)
    : value => String(value ?? '');

  const statusTerms = [
    ['passivus', '수동적 지위'],
    ['negativus', '소극적 지위'],
    ['positivus', '적극적 지위'],
    ['activus', '능동적 지위'],
    ['Chesterman', '체스터먼'],
    ['Diamantis', '디아만티스'],
    ['Novelli', '노벨리'],
    ['Floridi', '플로리디'],
    ['Teubner', '토이브너'],
    ['Bryson', '브라이슨'],
    ['Sartor', '사르토르'],
    ['Solum', '솔럼'],
    ['Grant', '그랜트'],
    ['trustee', '수탁자'],
    ['right', '권리']
  ].sort((a, b) => b[0].length - a[0].length);

  const exactReplacements = [
    ['constitutional personhood (인격성)', 'constitutional personhood (헌법적 인격성)'],
    ['constitutional personhood', 'constitutional personhood (헌법적 인격성)']
  ];

  const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  function localize(value) {
    let text = baseLocalize(value);

    exactReplacements.forEach(([from, to]) => {
      if (from === 'constitutional personhood' && text.includes('constitutional personhood (')) return;
      text = text.split(from).join(to);
    });

    const replacements = [];
    statusTerms.forEach(([foreign, korean]) => {
      const pattern = new RegExp(`(^|[^A-Za-z])(${escapeRegex(foreign)})(?![A-Za-z]|\\s*\\()`, 'gi');
      text = text.replace(pattern, (full, prefix, match) => {
        const index = replacements.length;
        replacements.push(`${match} (${korean})`);
        return `${prefix}\uE300${index}\uE301`;
      });
    });

    replacements.forEach((replacement, index) => {
      text = text.replace(`\uE300${index}\uE301`, replacement);
    });

    return text;
  }

  window.LEGAL_PHILOSOPHY_TERMINOLOGY = {
    ...current,
    statusTerms: Object.freeze(Object.fromEntries(statusTerms)),
    localize
  };
})();
