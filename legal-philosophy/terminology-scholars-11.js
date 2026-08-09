(() => {
  'use strict';

  const current = window.LEGAL_PHILOSOPHY_TERMINOLOGY || {};
  const baseLocalize = typeof current.localize === 'function'
    ? current.localize.bind(current)
    : value => String(value ?? '');

  const scholarTerms = [
    ['constitutional personhood', '헌법적 인격성'],
    ['trustee', '수탁자'],
    ['Santoni de Sio', '산토니 데 시오'],
    ['van den Hoven', '판 덴 호벤'],
    ['Chesterman', '체스터먼'],
    ['Diamantis', '디아만티스'],
    ['Novelli', '노벨리'],
    ['Floridi', '플로리디'],
    ['Teubner', '토이브너'],
    ['Bryson', '브라이슨'],
    ['Sartor', '사르토르'],
    ['Solum', '솔럼'],
    ['Grant', '그랜트']
  ].sort((a, b) => b[0].length - a[0].length);

  const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  function protectTerms(value) {
    let text = String(value ?? '');
    const replacements = [];

    scholarTerms.forEach(([foreign, korean]) => {
      const pattern = new RegExp(`(^|[^A-Za-z])(${escapeRegex(foreign)})(?![A-Za-z]|\\s*\\()`, 'gi');
      text = text.replace(pattern, (full, prefix, match) => {
        const index = replacements.length;
        replacements.push(`${match} (${korean})`);
        return `${prefix}\uE400${index}\uE401`;
      });
    });

    return { text, replacements };
  }

  function localize(value) {
    const protectedTerms = protectTerms(value);
    let text = baseLocalize(protectedTerms.text);

    protectedTerms.replacements.forEach((replacement, index) => {
      text = text.replace(`\uE400${index}\uE401`, replacement);
    });

    return text;
  }

  window.LEGAL_PHILOSOPHY_TERMINOLOGY = {
    ...current,
    scholarTerms: Object.freeze(Object.fromEntries(scholarTerms)),
    localize
  };
})();
