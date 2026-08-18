(() => {
  'use strict';

  const records = Array.isArray(window.AI_LITERATURE_RECORDS) ? window.AI_LITERATURE_RECORDS : [];

  const clean = value => String(value ?? '').replace(/\s+/g, ' ').trim();
  const quoteKo = title => `"${clean(title).replace(/^['"“”]+|['"“”]+$/g, '')}"`;
  const quoteEn = title => `“${clean(title).replace(/^['"“”]+|['"“”]+$/g, '')}”`;

  function formatPages(value) {
    const pages = clean(value).replace(/–/g, '-');
    return pages ? `${pages}쪽` : '';
  }

  function parseKoreanJournal(publication) {
    const source = clean(publication);
    const match = source.match(/^(.+?)\s+(\d+)(?:\((\d+)\))?,\s*(\d+(?:[-–]\d+)?)$/);
    if (!match) return null;

    const [, journal, volume, issue, pages] = match;
    const journalPart = issue
      ? `${journal.trim()} 제${volume}권 제${issue}호`
      : `${journal.trim()} 제${volume}호`;

    return { journalPart, pages: formatPages(pages) };
  }

  function formatDomesticArticle(record) {
    const author = clean(record.author);
    const title = quoteKo(record.title);
    const year = clean(record.year);
    const parsed = parseKoreanJournal(record.publication);

    if (parsed) {
      return `${author}, ${title}, ${parsed.journalPart}, ${year}, ${parsed.pages}.`;
    }

    return `${author}, ${title}, ${clean(record.publication)}, ${year}.`;
  }

  function formatDomesticThesis(record) {
    return `${clean(record.author)}, ${quoteKo(record.title)}, ${clean(record.publication)}, ${clean(record.year)}.`;
  }

  function formatOverseasPublication(value) {
    const source = clean(value).replace(/–/g, '-');
    const ranged = source.match(/^(.*?),\s*(\d+)-(\d+)$/);
    if (ranged) return `${ranged[1]}, pp.${ranged[2]}-${ranged[3]}`;
    return source.replace(/\b(pp?\.)\s+(?=\d)/gi, '$1');
  }

  function formatOverseasArticle(record) {
    return `${clean(record.author)}, ${quoteEn(record.title)}, ${formatOverseasPublication(record.publication)} (${clean(record.year)}).`;
  }

  records.forEach(record => {
    const type = clean(record.type);
    const language = clean(record.language);
    const jurisdiction = clean(record.jurisdiction);

    if (type === '국내 학술논문' || (language !== '영어' && jurisdiction === '대한민국' && type.includes('학술논문'))) {
      record.citation = formatDomesticArticle(record);
      record.citationStandard = 'KO-JOURNAL-v3';
      return;
    }

    if (type.includes('학위논문')) {
      record.citation = formatDomesticThesis(record);
      record.citationStandard = 'KO-THESIS-v2';
      return;
    }

    if (type === '해외 학술논문' || (language === '영어' && type.includes('학술논문'))) {
      record.citation = formatOverseasArticle(record);
      record.citationStandard = 'EN-JOURNAL-v3';
    }
  });

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[ch]));

  function normalizeCitation(value) {
    return clean(value)
      .replace(/,\s*”/g, '”,')
      .replace(/\b(pp?\.)\s+(?=\d)/gi, '$1');
  }

  function renderCitation(value) {
    const escaped = escapeHtml(normalizeCitation(value));
    return escaped.replace(/“([^”]*[A-Za-z][^”]*)”(?=,)/g, '“<em class="western-article-title" lang="en">$1</em>”');
  }

  function processCitationBoxes(root) {
    if (!(root instanceof Element)) return;
    const boxes = [];
    if (root.matches('.citation-box')) boxes.push(root);
    root.querySelectorAll?.('.citation-box').forEach(box => boxes.push(box));
    boxes.forEach(box => {
      box.innerHTML = renderCitation(box.textContent || '');
      box.dataset.citationStandard = 'EN-JOURNAL-v3';
    });
  }

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => mutation.addedNodes.forEach(node => processCitationBoxes(node)));
  });
  if (document.documentElement) observer.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => processCitationBoxes(document.body), { once: true });
  } else {
    processCitationBoxes(document.body);
  }
})();
