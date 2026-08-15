/* Canonical reading-length owner for TOEIC HUMAN V1.
   No other runtime module should trim the final reading length. */
(function (root) {
  'use strict';

  const MIN_WORDS = 500;
  const MAX_WORDS = 650;
  const TARGET_WORDS = 575;

  const countWords = text => String(text || '').trim().split(/\s+/).filter(Boolean).length;
  const splitSentences = text => String(text || '').match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];

  function getProgram() {
    try {
      if (typeof TOEIC_READING_V2 !== 'undefined') return TOEIC_READING_V2;
    } catch {}
    return root.TOEIC_READING_V2 || null;
  }

  function normalizeParagraph(text) {
    return String(text || '').replace(/\s+/g, ' ').trim();
  }

  function removeLastSentence(text) {
    const parts = splitSentences(text);
    if (parts.length <= 1) return null;
    parts.pop();
    return parts.join(' ').replace(/\s+/g, ' ').trim();
  }

  function compressParagraphs(paragraphs) {
    const next = (paragraphs || []).map(normalizeParagraph).filter(Boolean);
    let total = countWords(next.join(' '));
    let safety = 0;

    while (total > MAX_WORDS && safety++ < 500) {
      const candidates = [];
      for (let i = 0; i < next.length; i += 1) {
        const shortened = removeLastSentence(next[i]);
        if (!shortened) continue;
        const delta = countWords(next[i]) - countWords(shortened);
        if (delta <= 0 || total - delta < MIN_WORDS) continue;
        candidates.push({ i, shortened, delta, distance: Math.abs((total - delta) - TARGET_WORDS) });
      }
      if (!candidates.length) break;
      candidates.sort((a, b) => a.distance - b.distance || b.delta - a.delta);
      const chosen = candidates[0];
      next[chosen.i] = chosen.shortened;
      total -= chosen.delta;
    }

    safety = 0;
    while (total > MAX_WORDS && next.length > 4 && safety++ < 50) {
      const candidates = [];
      for (let i = 1; i < next.length - 1; i += 1) {
        const words = countWords(next[i]);
        if (total - words < MIN_WORDS) continue;
        candidates.push({ i, words, distance: Math.abs((total - words) - TARGET_WORDS) });
      }
      if (!candidates.length) break;
      candidates.sort((a, b) => a.distance - b.distance || b.words - a.words);
      const chosen = candidates[0];
      next.splice(chosen.i, 1);
      total -= chosen.words;
    }

    return next;
  }

  function normalizeDay(day) {
    if (!day || !Array.isArray(day.reading?.paragraphs)) return day;
    const before = countWords(day.reading.paragraphs.join(' '));
    if (before > MAX_WORDS) day.reading.paragraphs = compressParagraphs(day.reading.paragraphs);
    const after = countWords(day.reading.paragraphs.join(' '));

    day.reading.instructionKo = '약 500~650단어의 집중 본문을 끝까지 읽으세요. 핵심 흐름을 먼저 유지하고, 어휘·숙어·문법은 해부·학습 단계에서 따로 확인합니다.';
    day.coverage ||= {};
    day.coverage.normalizedWordCount = after;
    day.coverage.readingTarget = '500~650 words';
    day.coverage.readingWithinTarget = after >= MIN_WORDS && after <= MAX_WORDS;
    day.coverage.lengthOwner = 'reading-length-normalizer';
    return day;
  }

  function normalizeDays(days) {
    if (!Array.isArray(days)) return;
    for (const day of days) normalizeDay(day);
  }

  const program = getProgram();
  if (program?.days) normalizeDays(program.days);

  const ready = root.TOEIC_READING_V2_READY;
  if (ready && typeof ready.then === 'function') {
    root.TOEIC_READING_V2_READY = ready.then(result => {
      if (result?.days) normalizeDays(result.days);
      const currentProgram = getProgram();
      if (currentProgram?.days) normalizeDays(currentProgram.days);
      return result;
    });
  }
})(globalThis);
