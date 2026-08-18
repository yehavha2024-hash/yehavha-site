(() => {
  'use strict';

  const VERSION = 'LAW-KR-WESTERN-v4';
  const RULE = '서양 논문 제목은 따옴표를 유지하고 제목만 이탤릭체, 제목 뒤 쉼표는 닫는 따옴표 밖, 면수는 p.123 / pp.123-125 형식';
  const citationFields = new Set(['citation', 'footnote']);
  const pageFields = new Set(['citation', 'footnote', 'pinpoint', 'edition']);

  function normalizePageSpacing(value) {
    return String(value ?? '').replace(/\b(pp?\.)\s+(?=\d)/gi, '$1');
  }

  function normalizeCitationText(value) {
    return normalizePageSpacing(value).replace(/,\s*”/g, '”,');
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
    const escaped = escapeHtml(normalizeCitationText(value));
    return escaped.replace(
      /“([^”]*[A-Za-z][^”]*)”(?=,)/g,
      '“<em class="western-article-title" lang="en">$1</em>”'
    );
  }

  // 세 UI가 평문으로 출력하는 인용 전용 셀만 소유한다.
  // 링크·버튼 등 다른 컴포넌트가 들어온 셀은 건드리지 않아 후처리의 권한을 제한한다.
  const citationSelector = '.doctoral-footnote, .citation-title, .citation-text';

  function isOwnedCitationNode(target) {
    return Array.from(target.children).every(child => child.matches('em.western-article-title'));
  }

  function processNode(node) {
    if (!(node instanceof Element)) return;
    const targets = [];
    if (node.matches(citationSelector)) targets.push(node);
    node.querySelectorAll?.(citationSelector).forEach(target => targets.push(target));

    targets.forEach(target => {
      if (!isOwnedCitationNode(target)) return;
      const rendered = renderCitation(target.textContent || '');
      if (target.innerHTML !== rendered) target.innerHTML = rendered;
      target.dataset.citationStandard = VERSION;
    });
  }

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => mutation.addedNodes.forEach(processNode));
  });

  if (document.documentElement) observer.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => processNode(document.body), { once: true });
  } else {
    processNode(document.body);
  }

  window.LEGAL_CITATION_STANDARD = Object.freeze({
    version: VERSION,
    rule: RULE,
    normalizePageSpacing,
    normalizeCitationText,
    renderCitation
  });
})();
