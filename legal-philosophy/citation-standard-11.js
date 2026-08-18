(() => {
  'use strict';

  const VERSION = 'LAW-KR-WESTERN-v7';
  const RULE = '서양 단행본은 『책 제목』으로 표시하고 제목만 이탤릭체, 출판사는 일반체, 서양 논문 제목은 따옴표를 유지하고 제목만 이탤릭체, 면수는 p.123 / pp.123-125 형식';
  const citationFields = new Set(['citation', 'footnote']);
  const pageFields = new Set(['citation', 'footnote', 'pinpoint', 'edition']);

  // 법철학 인용 데이터에서 단행본·편집서로 직접 확인한 제목만 수동 허용한다.
  // 출판사명이나 특정 단어만으로 자동 판별하지 않아 논문·보고서를 책으로 오인하지 않는다.
  const westernBookTitles = Object.freeze([
    'Punishment and Responsibility: Essays in the Philosophy of Law',
    'Playing by the Rules: A Philosophical Examination of Rule-Based Decision-Making in Law and in Life',
    'Forms Liberate: Reclaiming the Jurisprudence of Lon L Fuller',
    'The Cost of Accidents: A Legal and Economic Analysis',
    'Constitutional and Political Theory: Selected Writings',
    'The Moral Limits of the Criminal Law, Vol. 1: Harm to Others',
    'Proportionality: Constitutional Rights and their Limitations',
    'Law’s Meaning of Life: Philosophy, Religion, Darwin and the Legal Person',
    'The Oxford Handbook of Comparative Constitutional Law',
    'A Legal Theory for Autonomous Artificial Agents',
    'An Introduction to the Principles of Morals and Legislation',
    'The Constitutional Structure of Proportionality',
    'System der subjektiven öffentlichen Rechte',
    'Die Genossenschaftstheorie und die deutsche Rechtsprechung',
    'Kant’s Doctrine of Right: A Commentary',
    'Constitutionalism: Past, Present, and Future',
    'Groundwork of the Metaphysics of Morals',
    'The Province of Jurisprudence Determined',
    'A Theory of Constitutional Rights',
    'Justice as Fairness: A Restatement',
    'A Theory of Legal Argumentation',
    'A Theory of Legal Personhood',
    'Responsibility in Law and Morality',
    'Die Menschenwürde in der Verfassungsordnung',
    'The Metaphysics of Morals',
    'System des heutigen Römischen Rechts',
    'Natural Law and Natural Rights',
    'The Habermas–Rawls Debate',
    'Punishment and Responsibility',
    'The Cost of Accidents',
    'Legal Reasoning and Legal Theory',
    'The Morality of Freedom',
    'Second Treatise of Government',
    'Anarchy, State, and Utopia',
    'The Concept of Law',
    'Taking Rights Seriously',
    'A Theory of Justice',
    'Theories of Rights',
    'Between Facts and Norms',
    'The Idea of Private Law',
    'Risks and Wrongs',
    'Responsibility and Fault',
    'Das Grundrecht auf Sicherheit',
    'Pure Theory of Law',
    'Law’s Empire',
    'Playing by the Rules',
    'The Morality of Law',
    'Legal Personhood',
    'Corrective Justice',
    'Private Wrongs',
    'Selected Writings',
    'Nicomachean Ethics',
    'Summa Theologiae',
    'Leviathan',
    'On Liberty',
    'Robot Rights',
    'Deutsches Privatrecht',
    'Lehrbuch des Pandektenrechts'
  ].sort((a, b) => b.length - a.length));

  const publisherMarker = /(?:University Press|\bOUP\b|\bCUP\b|\bUP\b|MIT Press|Clarendon Press|Hart Publishing|Basic Books|Columbia University Press|De Gruyter|Mohr Siebeck|Springer|Routledge|Edward Elgar)/i;
  const escapeRegExp = value => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const bookTitlePattern = new RegExp(westernBookTitles.map(escapeRegExp).join('|'), 'g');

  function normalizePageSpacing(value) {
    return String(value ?? '').replace(/\b(pp?\.)\s+(?=\d)/gi, '$1');
  }

  function correctKnownBibliographicTypos(value) {
    return String(value ?? '')
      .replace(/Visa A\. J\. Kurki/g, 'Visa A.J. Kurki')
      .replace(/Guido Calabresi, The Costs of Accidents: A Legal and Economic Analysis/g, 'Guido Calabresi, The Cost of Accidents: A Legal and Economic Analysis')
      .replace(/Guido Calabresi, The Costs of Accidents/g, 'Guido Calabresi, The Cost of Accidents');
  }

  function markKnownBookTitles(value) {
    const text = String(value ?? '');
    // 이미 단행본으로 표시된 구간과 논문·장 제목의 따옴표 구간은 보호한다.
    // 한 구간에서 모든 책 제목을 한 번에 치환해 긴 제목 속 짧은 제목이 다시 감싸지는 중첩을 막는다.
    return text
      .split(/(『[^』]*』|“[^”]*”)/g)
      .map(segment => {
        if (!segment || segment.startsWith('『') || segment.startsWith('“')) return segment;
        return segment.replace(bookTitlePattern, match => `『${match}』`);
      })
      .join('');
  }

  function normalizeBookPublisherPunctuation(value) {
    return String(value ?? '').replace(/(『[^』]+』)\s*\(([^()]*)\)/g, (match, title, inside) => {
      return publisherMarker.test(inside) ? `${title}, ${inside}` : match;
    });
  }

  function normalizeCitationText(value) {
    let text = String(value ?? '').replace(/\*/g, '');
    text = correctKnownBibliographicTypos(text);
    text = markKnownBookTitles(text);
    text = normalizeBookPublisherPunctuation(text);
    text = normalizePageSpacing(text);
    text = text.replace(/,\s*”/g, '”,');
    return text;
  }

  function normalizeRecord(value) {
    if (Array.isArray(value)) {
      value.forEach(normalizeRecord);
      return;
    }
    if (!value || typeof value !== 'object') return;

    Object.keys(value).forEach(field => {
      const current = value[field];
      if (typeof current === 'string') {
        if (citationFields.has(field)) value[field] = normalizeCitationText(current);
        else if (pageFields.has(field)) value[field] = normalizePageSpacing(current);
        return;
      }
      normalizeRecord(current);
    });
  }

  [
    window.LEGAL_PHILOSOPHY_DISSERTATION_CITATIONS,
    window.LEGAL_PHILOSOPHY_CITATIONS,
    window.LEGAL_PHILOSOPHY_SYNTHESIS,
    window.LEGAL_PHILOSOPHY_DEBATES
  ].forEach(normalizeRecord);

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[ch]));

  function renderCitation(value) {
    let escaped = escapeHtml(normalizeCitationText(value));
    escaped = escaped.replace(
      /『([^』]*[A-Za-z][^』]*)』/g,
      '『<em class="western-book-title" lang="en">$1</em>』'
    );
    return escaped.replace(
      /“([^”]*[A-Za-z][^”]*)”(?=,)/g,
      '“<em class="western-article-title" lang="en">$1</em>”'
    );
  }

  window.LEGAL_CITATION_STANDARD = Object.freeze({
    version: VERSION,
    rule: RULE,
    westernBookTitles,
    normalizePageSpacing,
    normalizeCitationText,
    renderCitation
  });
})();
