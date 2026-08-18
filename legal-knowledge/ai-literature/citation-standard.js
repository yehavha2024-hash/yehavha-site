(() => {
  'use strict';

  const VERSION = 'AI-LITERATURE-CITATION-v6';
  const records = Array.isArray(window.AI_LITERATURE_RECORDS) ? window.AI_LITERATURE_RECORDS : [];

  const clean = value => String(value ?? '').replace(/\*/g, '').replace(/\s+/g, ' ').trim();
  const quoteKo = title => `"${clean(title).replace(/^['"“”]+|['"“”]+$/g, '')}"`;
  const quoteEn = title => `“${clean(title).replace(/^['"“”]+|['"“”]+$/g, '')}”`;
  const bookTitle = title => `『${clean(title).replace(/^『|』$/g, '')}』`;

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

    if (parsed) return `${author}, ${title}, ${parsed.journalPart}, ${year}, ${parsed.pages}.`;
    return `${author}, ${title}, ${clean(record.publication)}, ${year}.`;
  }

  function formatDomesticThesis(record) {
    return `${clean(record.author)}, ${quoteKo(record.title)}, ${clean(record.publication)}, ${clean(record.year)}.`;
  }

  function formatDomesticBook(record) {
    const existing = clean(record.citation);
    if (existing.includes('『') && existing.includes('』')) return existing;
    return `${clean(record.author)}, ${bookTitle(record.title)}, ${clean(record.publication)}, ${clean(record.year)}.`;
  }

  function formatOverseasBook(record) {
    return `${clean(record.author)}, ${bookTitle(record.title)}, ${clean(record.publication)}, ${clean(record.year)}.`;
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
    const isBook = type === '필수도서' || type === '전공서적' || type.includes('단행본');

    if (isBook) {
      record.citation = language === '영어' ? formatOverseasBook(record) : formatDomesticBook(record);
      record.citationStandard = language === '영어' ? 'EN-BOOK-v6' : 'KO-BOOK-v3';
      return;
    }

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
      record.citationStandard = 'EN-JOURNAL-v6';
      return;
    }

    if (typeof record.citation === 'string') record.citation = clean(record.citation);
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
    let escaped = escapeHtml(normalizeCitation(value));
    escaped = escaped.replace(/『([^』]*[A-Za-z][^』]*)』/g, '『<em class="western-book-title" lang="en">$1</em>』');
    return escaped.replace(/“([^”]*[A-Za-z][^”]*)”(?=,)/g, '“<em class="western-article-title" lang="en">$1</em>”');
  }

  window.AI_LITERATURE_CITATION_STANDARD = Object.freeze({
    version: VERSION,
    rule: '단행본은 『책 제목』으로 표시하고 영문 책 제목만 이탤릭체, 출판사는 일반체, 서양 논문 제목은 따옴표를 유지하고 제목만 이탤릭체, 면수는 p.123 / pp.123-125 형식',
    normalizeCitation,
    renderCitation
  });
})();
