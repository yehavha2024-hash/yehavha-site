(() => {
  'use strict';

  const citationFields = new Set(['citation', 'footnote']);
  const pageFields = new Set(['citation', 'footnote', 'pinpoint', 'edition']);
  const audit = { citationFields: 0, commaFixes: 0, pageSpacingFixes: 0, italicCandidates: 0 };

  function normalizePageSpacing(value) {
    let text = String(value ?? '');
    text = text.replace(/\b(pp?\.)\s+(?=\d)/gi, match => {
      audit.pageSpacingFixes += 1;
      return match.replace(/\s+/g, '');
    });
    return text;
  }

  function normalizeCitationText(value) {
    let text = normalizePageSpacing(value);
    text = text.replace(/,\s*”/g, () => {
      audit.commaFixes += 1;
      return '”,';
    });
    return text;
  }

  function normalizeRecord(value, key = '') {
    if (Array.isArray(value)) {
      value.forEach(item => normalizeRecord(item, key));
      return;
    }
    if (!value || typeof value !== 'object') return;

    Object.keys(value).forEach(field => {
      const current = value[field];
      if (typeof current === 'string') {
        if (citationFields.has(field)) {
          audit.citationFields += 1;
          value[field] = normalizeCitationText(current);
        } else if (pageFields.has(field)) {
          value[field] = normalizePageSpacing(current);
        }
        return;
      }
      normalizeRecord(current, field);
    });
  }

  [
    window.LEGAL_PHILOSOPHY_DISSERTATION_CITATIONS,
    window.LEGAL_PHILOSOPHY_CITATIONS,
    window.LEGAL_PHILOSOPHY_SYNTHESIS,
    window.LEGAL_PHILOSOPHY_DEBATES
  ].forEach(collection => normalizeRecord(collection));

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[ch]));

  function renderCitation(value) {
    const normalized = normalizeCitationText(value);
    const escaped = escapeHtml(normalized);
    return escaped.replace(/“([^”]*[A-Za-z][^”]*)”(?=,)/g, (_, title) => {
      audit.italicCandidates += 1;
      return `“<em class="western-article-title" lang="en">${title}</em>”`;
    });
  }

  const citationSelector = '.doctoral-footnote, .citation-title, .citation-text';

  function processNode(node) {
    if (!(node instanceof Element)) return;
    const targets = [];
    if (node.matches(citationSelector)) targets.push(node);
    node.querySelectorAll?.(citationSelector).forEach(target => targets.push(target));

    targets.forEach(target => {
      const raw = target.textContent || '';
      const rendered = renderCitation(raw);
      if (target.innerHTML !== rendered) target.innerHTML = rendered;
      target.dataset.citationStandard = 'LAW-KR-WESTERN-v3';
    });
  }

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => processNode(node));
    });
  });

  if (document.documentElement) {
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => processNode(document.body), { once: true });
  } else {
    processNode(document.body);
  }

  window.LEGAL_CITATION_STANDARD = Object.freeze({
    version: 'LAW-KR-WESTERN-v3',
    rule: '서양 논문 제목은 따옴표를 유지하고 제목만 이탤릭체, 제목 뒤 쉼표는 닫는 따옴표 밖, 면수는 p.123 / pp.123-125 형식',
    normalizeCitationText,
    renderCitation,
    audit
  });
})();
