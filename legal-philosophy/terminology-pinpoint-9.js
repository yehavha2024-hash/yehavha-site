(() => {
  'use strict';

  const current = window.LEGAL_PHILOSOPHY_TERMINOLOGY || {};
  const baseLocalize = typeof current.localize === 'function'
    ? current.localize.bind(current)
    : value => String(value ?? '');

  const pinpointPairs = [
    ['principles as optimization requirements', '최적화 명령으로서의 원칙'],
    ['Law of Balancing', '형량법칙'],
    ['rights·principles', '권리·원칙'],
    ['collective goals', '집단적 목표'],
    ['innate right', '생득적 권리'],
    ['Restatement', '재진술']
  ].sort((a, b) => b[0].length - a[0].length);

  const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  function protectPinpointTerms(value) {
    let text = String(value ?? '');
    const replacements = [];

    pinpointPairs.forEach(([foreign, korean]) => {
      const pattern = new RegExp(`(^|[^A-Za-z])(${escapeRegex(foreign)})(?![A-Za-z]|\\s*\\()`, 'gi');
      text = text.replace(pattern, (full, prefix, match) => {
        const index = replacements.length;
        replacements.push(`${match} (${korean})`);
        return `${prefix}\uE200${index}\uE201`;
      });
    });

    return { text, replacements };
  }

  function localize(value) {
    const protectedTerms = protectPinpointTerms(value);
    let text = baseLocalize(protectedTerms.text);

    protectedTerms.replacements.forEach((replacement, index) => {
      text = text.replace(`\uE200${index}\uE201`, replacement);
    });

    return text;
  }

  window.LEGAL_PHILOSOPHY_TERMINOLOGY = {
    ...current,
    pinpointTerms: Object.freeze(Object.fromEntries(pinpointPairs)),
    localize
  };
})();
