(() => {
  'use strict';

  const records = Array.isArray(window.AI_LITERATURE_RECORDS) ? window.AI_LITERATURE_RECORDS : [];

  const clean = value => String(value ?? '').replace(/\s+/g, ' ').trim();
  const quoteKo = title => `"${clean(title).replace(/^['"“”]+|['"“”]+$/g, '')}"`;
  const quoteEn = title => `“${clean(title).replace(/^['"“”]+|['"“”]+$/g, '')}”`;

  function formatPages(value) {
    const pages = clean(value).replace(/–/g, '-');
    return pages ? `pp. ${pages}` : '';
  }

  function parseKoreanJournal(publication) {
    const source = clean(publication);
    const match = source.match(/^(.+?)\s+(\d+)(?:\((\d+)\))?,\s*(\d+(?:[-–]\d+)?)$/);
    if (!match) return null;

    const [, journal, volume, issue, pages] = match;
    const journalPart = issue
      ? `『${journal.trim()}』 제${volume}권 제${issue}호`
      : `『${journal.trim()}』 제${volume}호`;

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

    const publication = clean(record.publication);
    return `${author}, ${title}, ${publication}, ${year}.`;
  }

  function formatDomesticThesis(record) {
    const author = clean(record.author);
    const title = quoteKo(record.title);
    const publication = clean(record.publication);
    const year = clean(record.year);
    return `${author}, ${title}, ${publication}, ${year}.`;
  }

  function formatOverseasArticle(record) {
    const author = clean(record.author);
    const title = quoteEn(record.title);
    const publication = clean(record.publication);
    const year = clean(record.year);
    return `${author}, ${title}, ${publication} (${year}).`;
  }

  records.forEach(record => {
    const type = clean(record.type);
    const language = clean(record.language);
    const jurisdiction = clean(record.jurisdiction);

    if (type === '국내 학술논문' || (language !== '영어' && jurisdiction === '대한민국' && type.includes('학술논문'))) {
      record.citation = formatDomesticArticle(record);
      record.citationStandard = 'KO-JOURNAL-v1';
      return;
    }

    if (type.includes('학위논문')) {
      record.citation = formatDomesticThesis(record);
      record.citationStandard = 'KO-THESIS-v1';
      return;
    }

    if (type === '해외 학술논문' || (language === '영어' && type.includes('학술논문'))) {
      record.citation = formatOverseasArticle(record);
      record.citationStandard = 'EN-JOURNAL-v1';
    }
  });
})();
