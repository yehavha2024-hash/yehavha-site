(() => {
  'use strict';

  const current = window.LEGAL_PHILOSOPHY_TERMINOLOGY || {};
  const baseLocalize = typeof current.localize === 'function'
    ? current.localize.bind(current)
    : value => String(value ?? '');

  const exactReplacements = [
    ['법원(source)', 'source of law (법원)'],
    ['법원 (source)', 'source of law (법원)']
  ];

  const extraTerms = [
    ['second-order justification', '2차적 정당화'],
    ['under- and over-inclusiveness', '과소·과잉포섭'],
    ['rules/principles', '규칙/원칙'],
    ['legal discourse', '법적 담론'],
    ['special case', '특수사례'],
    ['source of law', '법원'],
    ['legality', '합법성'],
    ['human–robot collaborations', '인간-로봇 협업'],
    ['human–robot collaboration', '인간-로봇 협업'],
    ['human-robot collaborations', '인간-로봇 협업'],
    ['human-robot collaboration', '인간-로봇 협업'],
    ['human‑robot collaborations', '인간-로봇 협업'],
    ['human‑robot collaboration', '인간-로봇 협업'],
    ['human—robot collaborations', '인간-로봇 협업'],
    ['human—robot collaboration', '인간-로봇 협업'],
    ['Raz', '라즈'],
    ['Matthias', '마티아스'],
    ['Santoni de Sio', '산토니 데 시오'],
    ['van den Hoven', '판 덴 호벤'],
    ['Nyholm', '뉘홀름'],
    ['Kiener', '키너']
  ];

  const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const ordered = extraTerms.slice().sort((a, b) => b[0].length - a[0].length);

  function localize(value) {
    let text = String(value ?? '');

    exactReplacements.forEach(([from, to]) => {
      text = text.split(from).join(to);
    });

    text = baseLocalize(text);

    const replacements = [];
    ordered.forEach(([foreign, korean]) => {
      const pattern = new RegExp(`(^|[^A-Za-z])(${escapeRegex(foreign)})(?![A-Za-z]|\\s*\\()`, 'gi');
      text = text.replace(pattern, (full, prefix, match) => {
        const index = replacements.length;
        replacements.push(`${match} (${korean})`);
        return `${prefix}\uE100${index}\uE101`;
      });
    });

    replacements.forEach((replacement, index) => {
      text = text.replace(`\uE100${index}\uE101`, replacement);
    });

    return text;
  }

  window.LEGAL_PHILOSOPHY_TERMINOLOGY = {
    ...current,
    extraTerms: Object.freeze(Object.fromEntries(extraTerms)),
    localize
  };
})();
