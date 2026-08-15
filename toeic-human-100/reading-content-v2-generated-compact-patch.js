/* Short-reading + lexicon rebalance for generated DAY 011~100. */
(function (root) {
  const builder = root.TOEIC_READING_V2_BUILDER;
  if (!builder || typeof builder.build !== "function") return;

  const TARGET_MAX = 850;
  const TARGET_MIN = 700;
  const ORIGINAL_PAD = "A further reading principle is to preserve the sentence frame when an unfamiliar expression appears. Instead of stopping immediately, identify the subject, locate the main verb, observe the connector, and decide whether the unknown item is essential to the author's claim. This controlled tolerance for uncertainty is what allows readers to finish long passages and later confirm vocabulary without losing the argument.";
  const PHRASE_POOL = [
    ["in accordance with", "~에 따라"], ["be responsible for", "~을 담당하다·책임지다"],
    ["be required to", "~하도록 요구되다"], ["no later than", "늦어도 ~까지"],
    ["as a result", "그 결과"], ["in response to", "~에 대응하여"],
    ["in order to", "~하기 위하여"], ["according to", "~에 따르면"],
    ["be eligible for", "~의 자격이 있다"], ["subject to", "~을 조건으로·~의 적용을 받는"],
    ["rather than", "~라기보다·~대신"], ["in addition to", "~에 더하여"],
    ["on behalf of", "~을 대신하여"], ["with regard to", "~에 관하여"],
    ["as long as", "~하는 한"], ["in contrast", "대조적으로"],
    ["as soon as", "~하자마자"], ["take into account", "~을 고려하다"]
  ];

  const countWords = text => String(text || "").trim().split(/\s+/).filter(Boolean).length;
  const splitSentences = text => String(text || "").match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
  const lemmaOf = entry => String(entry?.lemma || entry?.word || entry || "").trim();

  function uniqueEntries(entries) {
    const seen = new Set();
    return (entries || []).filter(entry => {
      const lemma = lemmaOf(entry).toLowerCase();
      if (!lemma || seen.has(lemma)) return false;
      seen.add(lemma);
      return true;
    });
  }

  function stripScaffolding(text) {
    return String(text || "")
      .replace(/Operational material in this section also exposes the reader to [\s\S]*?memorize a detached list\./g, "")
      .replace(/General nonfiction vocabulary is broadened with [\s\S]*?before checking details\./g, "")
      .replace(/The TEPS and book-reading bridge adds [\s\S]*?without losing the larger argument\./g, "")
      .replace(/TOEIC vocabulary in this paragraph includes[^.!?]*\./g, "")
      .replace(/General nonfiction vocabulary here includes[^.!?]*\./g, "")
      .replace(/TEPS and book-reading vocabulary here includes[^.!?]*\./g, "")
      .split(ORIGINAL_PAD).join("")
      .replace(/\s+/g, " ")
      .trim();
  }

  function removeOneSentence(paragraph) {
    const parts = splitSentences(paragraph);
    if (parts.length <= 1) return paragraph;
    parts.pop();
    return parts.join(" ").trim();
  }

  function shortenParagraphs(paragraphs) {
    const next = (paragraphs || []).map(stripScaffolding).filter(Boolean);
    let total = countWords(next.join(" "));
    let safety = 0;
    while (total > TARGET_MAX && safety++ < 300) {
      let candidate = -1;
      let candidateWords = 0;
      for (let i = 0; i < next.length; i += 1) {
        const parts = splitSentences(next[i]);
        const words = countWords(next[i]);
        if (parts.length > 1 && words > candidateWords) {
          candidate = i;
          candidateWords = words;
        }
      }
      if (candidate < 0) break;
      next[candidate] = removeOneSentence(next[candidate]);
      total = countWords(next.join(" "));
    }
    return next;
  }

  function firstExposureMap(result) {
    const first = new Map();
    if (!(result?.targetMap instanceof Map)) return first;
    for (let day = 11; day <= 100; day += 1) {
      for (const entry of uniqueEntries(result.targetMap.get(day) || [])) {
        const lemma = lemmaOf(entry).toLowerCase();
        if (!first.has(lemma)) first.set(lemma, day);
      }
    }
    return first;
  }

  function priority(entry) {
    const roles = entry?.roles || [];
    if (roles.includes("toeic-specific")) return 0;
    if (roles.includes("general-core")) return 1;
    if (roles.includes("academic-book-extension")) return 2;
    return 3;
  }

  function meaningFor(entry, existing) {
    if (existing?.meaningKo) return existing.meaningKo;
    if (entry?.meaningKo) return entry.meaningKo;
    const roles = entry?.roles || [];
    if (roles.includes("toeic-specific")) return "TOEIC 핵심·실무 어휘 — 문맥과 결합으로 확인";
    if (roles.includes("academic-book-extension")) return "TEPS·원서 확장 어휘 — 문맥에서 의미 추론";
    if (roles.includes("general-core")) return "일반 비문학 핵심 어휘 — 반복 노출로 정착";
    return "오늘의 확장 어휘 — 문맥 속 의미 확인";
  }

  function tierFor(entry, existing) {
    if (existing?.tier) return existing.tier;
    const roles = entry?.roles || [];
    if (roles.includes("toeic-specific")) return "A";
    if (roles.includes("academic-book-extension")) return "B";
    return "C";
  }

  function rebalanceVocabulary(day, result, firstMap) {
    if (!(result?.targetMap instanceof Map)) return;
    const scheduled = uniqueEntries(result.targetMap.get(day.day) || []);
    const existing = new Map((day.vocabulary || []).map(item => [lemmaOf(item).toLowerCase(), item]));
    const first = scheduled.filter(entry => firstMap.get(lemmaOf(entry).toLowerCase()) === day.day);
    const repeats = scheduled
      .filter(entry => firstMap.get(lemmaOf(entry).toLowerCase()) !== day.day)
      .sort((a, b) => {
        const aExisting = existing.has(lemmaOf(a).toLowerCase()) ? 0 : 1;
        const bExisting = existing.has(lemmaOf(b).toLowerCase()) ? 0 : 1;
        return aExisting - bExisting || priority(a) - priority(b) || lemmaOf(a).localeCompare(lemmaOf(b));
      });

    const targetSize = day.day <= 80 ? 30 : 24;
    const selected = uniqueEntries([...first, ...repeats.slice(0, Math.max(0, targetSize - first.length))]);
    day.vocabulary = selected.map(entry => {
      const lemma = lemmaOf(entry);
      const previous = existing.get(lemma.toLowerCase());
      return { lemma, meaningKo: meaningFor(entry, previous), tier: tierFor(entry, previous) };
    });

    day.coverage ||= {};
    day.coverage.firstExposureCount = first.length;
    day.coverage.studyVocabularyCount = selected.length;
    day.coverage.reinforcementCount = Math.max(0, selected.length - first.length);
    day.coverage.studyLemmas = selected.map(lemmaOf);
    day.coverage.studyDesign = "short-reading-v3";
  }

  function expandExpressions(day) {
    day.expressions = Array.isArray(day.expressions) ? day.expressions : [];
    const seen = new Set(day.expressions.map(x => String(x.title || "").toLowerCase()));
    let cursor = day.day % PHRASE_POOL.length;
    while (day.expressions.length < 6) {
      const [title, meaningKo] = PHRASE_POOL[cursor % PHRASE_POOL.length];
      cursor += 1;
      if (seen.has(title.toLowerCase())) continue;
      seen.add(title.toLowerCase());
      day.expressions.push({ title, meaningKo, tier: "A" });
    }
  }

  function normalizeDay(day, result, firstMap) {
    if (!day || day.day < 11 || !Array.isArray(day.reading?.paragraphs)) return day;
    day.reading.paragraphs = shortenParagraphs(day.reading.paragraphs);
    const total = countWords(day.reading.paragraphs.join(" "));
    day.reading.instructionKo = `약 700~850단어의 집중 본문을 끝까지 읽으세요. 오늘의 핵심은 문장구조와 문단기능을 놓치지 않고 전체 흐름을 유지하는 것입니다. 모르는 단어는 1회독 뒤 해부·학습 단계에서 확인합니다.`;
    rebalanceVocabulary(day, result, firstMap);
    expandExpressions(day);
    day.coverage ||= {};
    day.coverage.normalizedWordCount = total;
    day.coverage.readingTarget = "700~850 words";
    day.coverage.readingWithinTarget = total >= TARGET_MIN && total <= TARGET_MAX;
    return day;
  }

  function compactResult(result) {
    if (!result) return result;
    const firstMap = firstExposureMap(result);
    for (const day of result.days || []) normalizeDay(day, result, firstMap);
    return result;
  }

  const originalBuild = builder.build.bind(builder);
  builder.build = master => compactResult(originalBuild(master));
  builder.compactResult = compactResult;

  if (root.TOEIC_READING_V2_READY && typeof root.TOEIC_READING_V2_READY.then === "function") {
    root.TOEIC_READING_V2_READY = root.TOEIC_READING_V2_READY.then(compactResult);
  }
})(globalThis);
