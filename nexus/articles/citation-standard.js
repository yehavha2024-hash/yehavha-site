(() => {
  'use strict';

  const VERSION = 'LAW-KR-WESTERN-v7';
  const RULE = '서양 단행본은 『책 제목』으로 표시하고 제목만 이탤릭체, 출판사는 일반체, 서양 논문 제목은 따옴표를 유지하고 제목만 이탤릭체, 면수는 p.123 / pp.123-125 형식';
  const body = document.getElementById('articleBody');
  if (!body) return;

  const citationHeading = /(?:참고문헌|핵심\s*문헌|핵심\s*연결문헌|학술\s*자료|학술\s*연결|법령[·ㆍ・,\s]*판례[·ㆍ・,\s]*학술|해외\s*원자료|references|bibliography)/i;
  const academicSignal = /(?:\bDOI\b|doi\.org|ssrn\.com|heinonline|jstor|springer|cambridge\.org|oup\.com|Law Review|\bJournal\b|University Press|Handbook|Working Paper|Public Law\s*&\s*Legal Theory Series)/i;

  // 공개 글에서 실제로 등장하거나 법학 연구 트리에서 확인된 단행본만 명시적으로 허용한다.
  const westernBookTitles = Object.freeze([
    'The Cambridge Handbook of Private Law and Artificial Intelligence',
    'The Cambridge Handbook of the Law, Policy, and Regulation for Human-Robot Interaction',
    'Research Handbook on the Law of Artificial Intelligence',
    'Punishment and Responsibility: Essays in the Philosophy of Law',
    'Playing by the Rules: A Philosophical Examination of Rule-Based Decision-Making in Law and in Life',
    'The Cost of Accidents: A Legal and Economic Analysis',
    'Constitutional and Political Theory: Selected Writings',
    'Law for Computer Scientists and Other Folk',
    'The Oxford Handbook of Comparative Constitutional Law',
    'Proportionality: Constitutional Rights and their Limitations',
    'A Legal Theory for Autonomous Artificial Agents',
    'A Theory of Legal Argumentation',
    'Justice as Fairness: A Restatement',
    'A Theory of Legal Personhood',
    'A Theory of Constitutional Rights',
    'The Reasonable Robot: Artificial Intelligence and the Law',
    'We, the Robots? Regulating Artificial Intelligence and the Limits of the Law',
    'Kant’s Doctrine of Right: A Commentary',
    'Constitutionalism: Past, Present, and Future',
    'Constitutional and Political Theory: Selected Writings',
    'Responsibility in Law and Morality',
    'Natural Law and Natural Rights',
    'Punishment and Responsibility',
    'The Concept of Law',
    'Taking Rights Seriously',
    'A Theory of Justice',
    'Between Facts and Norms',
    'The Idea of Private Law',
    'Risks and Wrongs',
    'The Cost of Accidents',
    'Legal Reasoning and Legal Theory',
    'The Morality of Law',
    'Legal Personhood',
    'Corrective Justice',
    'Private Wrongs',
    'Robot Rights',
    'Law’s Empire'
  ].sort((a, b) => b.length - a.length));

  const publisherMarker = /(?:University Press|\bOUP\b|\bCUP\b|\bUP\b|MIT Press|Clarendon Press|Hart Publishing|Basic Books|Columbia University Press|De Gruyter|Mohr Siebeck|Springer|Routledge|Edward Elgar)/i;
  const escapeRegExp = value => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const bookTitlePattern = new RegExp(westernBookTitles.map(escapeRegExp).join('|'), 'g');

  function correctKnownBibliographicTypos(value) {
    return String(value ?? '')
      .replace(/Visa A\. J\. Kurki/g, 'Visa A.J. Kurki')
      .replace(/Guido Calabresi, The Costs of Accidents: A Legal and Economic Analysis/g, 'Guido Calabresi, The Cost of Accidents: A Legal and Economic Analysis')
      .replace(/Guido Calabresi, The Costs of Accidents/g, 'Guido Calabresi, The Cost of Accidents');
  }

  function markKnownBookTitles(value) {
    return String(value ?? '')
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
    return text
      .replace(/,\s*”/g, '”,')
      .replace(/\b(pp?\.)\s+(?=\d)/gi, '$1');
  }

  function appendStyledText(fragment, value) {
    const text = String(value ?? '');
    const pattern = /『([^』]+)』|“([^”]+)”/g;
    let lastIndex = 0;

    for (const match of text.matchAll(pattern)) {
      const index = match.index ?? 0;
      if (index > lastIndex) fragment.append(document.createTextNode(text.slice(lastIndex, index)));

      if (match[1] != null) {
        fragment.append(document.createTextNode('『'));
        const title = document.createElement('em');
        title.className = 'western-book-title';
        title.lang = 'en';
        title.textContent = match[1];
        fragment.append(title, document.createTextNode('』'));
      } else {
        fragment.append(document.createTextNode('“'));
        const title = document.createElement('em');
        title.className = 'western-article-title';
        title.lang = 'en';
        title.textContent = match[2];
        fragment.append(title, document.createTextNode('”'));
      }
      lastIndex = index + match[0].length;
    }

    if (lastIndex < text.length) fragment.append(document.createTextNode(text.slice(lastIndex)));
  }

  function appendFormattedPrefix(fragment, value, academic) {
    let text = normalizeCitationText(value);
    if (academic && /[A-Za-z]/.test(text)) {
      let match = text.match(/^(.+?),\s*“([^”]+)”\s*,\s*(.+)$/);
      if (!match) match = text.match(/^([^,]+),\s*([^,]+),\s*(.+)$/);
      if (match && /[A-Za-z]/.test(match[2]) && !match[2].trim().startsWith('『')) {
        text = `${match[1]}, “${match[2].trim()}”, ${match[3]}`;
      }
    }
    appendStyledText(fragment, text);
  }

  function processReferenceNode(node) {
    if (!(node instanceof HTMLElement) || node.dataset.citationStandard === VERSION) return;

    const childNodes = Array.from(node.childNodes);
    const firstElement = childNodes.find(child => child.nodeType === Node.ELEMENT_NODE) || null;
    const prefixNodes = [];
    for (const child of childNodes) {
      if (child === firstElement) break;
      if (child.nodeType === Node.TEXT_NODE) prefixNodes.push(child);
    }

    if (!prefixNodes.length && firstElement) {
      node.dataset.citationStandard = VERSION;
      return;
    }

    const prefixText = prefixNodes.length
      ? prefixNodes.map(child => child.textContent || '').join('')
      : node.textContent || '';
    const academic = academicSignal.test(node.textContent || '');
    const fragment = document.createDocumentFragment();
    appendFormattedPrefix(fragment, prefixText, academic);

    if (prefixNodes.length) {
      prefixNodes.forEach(child => child.remove());
      node.insertBefore(fragment, firstElement);
    } else if (!firstElement) {
      node.replaceChildren(fragment);
    }

    node.dataset.citationStandard = VERSION;
  }

  function processSectionNode(node) {
    if (node.matches?.('p, li')) processReferenceNode(node);
    node.querySelectorAll?.('p, li').forEach(processReferenceNode);
  }

  function scanCitationSections() {
    let inCitationSection = false;
    Array.from(body.children).forEach(node => {
      if (/^H[23]$/.test(node.tagName)) {
        inCitationSection = citationHeading.test(node.textContent || '');
        return;
      }
      if (inCitationSection) processSectionNode(node);
    });
  }

  let scanQueued = false;
  function queueScan() {
    if (scanQueued) return;
    scanQueued = true;
    queueMicrotask(() => {
      scanQueued = false;
      scanCitationSections();
    });
  }

  // 공개 글은 JSON 본문이 비동기로 들어오므로 articleBody의 직접 자식 추가만 감시한다.
  // subtree/attributes/characterData는 감시하지 않아 다른 UI를 재작성하지 않는다.
  const observer = new MutationObserver(queueScan);
  observer.observe(body, { childList: true });
  queueScan();

  window.NEXUS_ARTICLE_CITATION_STANDARD = Object.freeze({
    version: VERSION,
    rule: RULE,
    westernBookTitles,
    normalizeCitationText,
    scan: scanCitationSections
  });
})();
