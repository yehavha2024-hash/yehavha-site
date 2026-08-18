(() => {
  'use strict';

  const VERSION = 'LAW-KR-WESTERN-v4';
  const RULE = '서양 논문 제목은 따옴표를 유지하고 제목만 이탤릭체, 제목 뒤 쉼표는 닫는 따옴표 밖, 면수는 p.123 / pp.123-125 형식';
  const body = document.getElementById('articleBody');
  if (!body) return;

  const citationHeading = /(?:참고문헌|핵심\s*문헌|핵심\s*연결문헌|학술\s*자료|학술\s*연결|법령[·ㆍ・,\s]*판례[·ㆍ・,\s]*학술|해외\s*원자료|references|bibliography)/i;
  const academicSignal = /(?:\bDOI\b|doi\.org|ssrn\.com|heinonline|jstor|springer|cambridge\.org|oup\.com|Law Review|\bJournal\b|University Press|Handbook|Working Paper|Public Law\s*&\s*Legal Theory Series)/i;

  function normalizeCitationText(value) {
    return String(value ?? '')
      .replace(/,\s*”/g, '”,')
      .replace(/\b(pp?\.)\s+(?=\d)/gi, '$1');
  }

  function appendFormattedPrefix(fragment, value, academic) {
    const text = normalizeCitationText(value);
    if (!academic || !/[A-Za-z]/.test(text)) {
      fragment.append(document.createTextNode(text));
      return;
    }

    let match = text.match(/^(.+?),\s*“([^”]+)”\s*,\s*(.+)$/);
    if (!match) match = text.match(/^([^,]+),\s*([^,]+),\s*(.+)$/);
    if (!match || !/[A-Za-z]/.test(match[2])) {
      fragment.append(document.createTextNode(text));
      return;
    }

    fragment.append(document.createTextNode(`${match[1]}, “`));
    const title = document.createElement('em');
    title.className = 'western-article-title';
    title.lang = 'en';
    title.textContent = match[2].trim();
    fragment.append(title, document.createTextNode(`”, ${match[3]}`));
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

  const observer = new MutationObserver(queueScan);
  observer.observe(body, { childList: true });
  queueScan();

  window.NEXUS_ARTICLE_CITATION_STANDARD = Object.freeze({
    version: VERSION,
    rule: RULE,
    normalizeCitationText,
    scan: scanCitationSections
  });
})();
