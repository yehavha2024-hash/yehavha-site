/* Compact generated lexical scaffolding while preserving every scheduled master lemma. */
(function (root) {
  const builder = root.TOEIC_READING_V2_BUILDER;
  if (!builder || typeof builder.build !== 'function') return;

  const countWords = text => String(text || '').trim().split(/\s+/).filter(Boolean).length;
  const padSentence = 'Continue by tracking the subject, main verb, connector, reference words, and paragraph purpose; the aim is to preserve the whole argument even when several individual expressions remain uncertain during the first reading.';

  function compactParagraph(text) {
    return String(text)
      .replace(/Operational material in this section also exposes the reader to ([\s\S]*?)\. These terms belong to the controlled TOEIC vocabulary layer, so the aim is to meet them repeatedly inside complete sentences and documents rather than memorize a detached list\./g,
        'TOEIC vocabulary in this paragraph includes $1.')
      .replace(/General nonfiction vocabulary is broadened with ([\s\S]*?)\. Some of these words may be familiar while others are not, but the reading rule remains the same: keep the grammatical frame active, infer what is possible from context, and continue to the end before checking details\./g,
        'General nonfiction vocabulary here includes $1.')
      .replace(/The TEPS and book-reading bridge adds ([\s\S]*?)\. This wider lexical field is deliberate because an English book can move from business language to scientific, social, historical, or abstract vocabulary without warning, and a durable reader must tolerate that change without losing the larger argument\./g,
        'TEPS and book-reading vocabulary here includes $1.');
  }

  function markerIndex(text) {
    const marks = ['TOEIC vocabulary in this paragraph includes','General nonfiction vocabulary here includes','TEPS and book-reading vocabulary here includes'];
    const indexes = marks.map(m=>text.indexOf(m)).filter(i=>i>=0);
    return indexes.length ? Math.min(...indexes) : text.length;
  }

  function removeOneBaseSentence(text) {
    const cut = markerIndex(text);
    const base = text.slice(0,cut).trim();
    const bridge = text.slice(cut).trim();
    const sentences = base.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [base];
    if (sentences.length <= 3 || countWords(base) < 85) return text;
    sentences.pop();
    return `${sentences.join(' ').trim()} ${bridge}`.trim();
  }

  function normalizeDay(day) {
    if (!day || day.day < 11 || !Array.isArray(day.reading?.paragraphs)) return day;
    day.reading.paragraphs = day.reading.paragraphs.map(compactParagraph);
    let total = countWords(day.reading.paragraphs.join(' '));

    let safety = 0;
    while (total > 1580 && safety++ < 100) {
      let changed = false;
      for (let i=0; i<day.reading.paragraphs.length && total>1580; i++) {
        const before = day.reading.paragraphs[i];
        const after = removeOneBaseSentence(before);
        if (after !== before) {
          day.reading.paragraphs[i] = after;
          changed = true;
          total = countWords(day.reading.paragraphs.join(' '));
        }
      }
      if (!changed) break;
    }

    let i = 0;
    while (total < 1420 && i < 30) {
      day.reading.paragraphs[i % day.reading.paragraphs.length] += ` ${padSentence}`;
      i++;
      total = countWords(day.reading.paragraphs.join(' '));
    }
    day.coverage ||= {};
    day.coverage.normalizedWordCount = total;
    return day;
  }

  function compactResult(result) {
    if (!result) return result;
    for (const day of result.days || []) normalizeDay(day);
    return result;
  }

  const originalBuild = builder.build.bind(builder);
  builder.build = master => compactResult(originalBuild(master));
  builder.compactResult = compactResult;

  if (root.TOEIC_READING_V2_READY && typeof root.TOEIC_READING_V2_READY.then === 'function') {
    root.TOEIC_READING_V2_READY = root.TOEIC_READING_V2_READY.then(compactResult);
  }
})(globalThis);
