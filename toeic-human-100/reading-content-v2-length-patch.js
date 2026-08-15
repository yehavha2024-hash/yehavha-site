/* V2 short-reading normalization — DAY 001~010 */
(function (root) {
  const program = root.TOEIC_READING_V2;
  if (!program || !Array.isArray(program.days)) return;

  const TARGET_MAX = 850;
  const PHRASE_POOL = [
    ["in accordance with", "~에 따라"],
    ["be responsible for", "~을 담당하다·책임지다"],
    ["be required to", "~하도록 요구되다"],
    ["no later than", "늦어도 ~까지"],
    ["as a result", "그 결과"],
    ["in response to", "~에 대응하여"],
    ["in order to", "~하기 위하여"],
    ["according to", "~에 따르면"],
    ["be eligible for", "~의 자격이 있다"],
    ["subject to", "~을 조건으로·~의 적용을 받는"],
    ["rather than", "~라기보다·~대신"],
    ["in addition to", "~에 더하여"]
  ];

  const additions = {
    3: {
      paragraph: `A purchasing decision becomes more demanding when several employees will use the same device for different tasks. One person may care about scanning speed, another about network security, and another about image quality or warranty support. The useful question is therefore not whether a product is simply good, but whether the evidence supports the specific purposes for which the organization intends to use it. Comparing documents requires the reader to preserve both shared facts and the different standards by which those facts are evaluated.`,
      functionKo: "공통 사실과 부서별 평가기준의 차이"
    },
    7: {
      paragraph: `Application documents show why readers must distinguish evidence from labels. A candidate may describe an earlier position as project management, but the employer still needs to determine what duties were actually performed, for how long, and at what level of responsibility. Someone with an unrelated title may nevertheless have relevant coordination experience. A label gives an initial category, but the surrounding evidence determines whether the category is justified.`,
      functionKo: "직함·라벨과 실제 증거의 구별"
    },
    9: {
      paragraph: `Readers should also notice what a news article does not establish. An announcement may provide a clear plan without proving that the plan will succeed, and a favorable market reaction may show expectations without demonstrating the eventual result. Absence of proof is not proof of failure. Accurate reading therefore includes knowing where the text itself stops making claims.`,
      functionKo: "기사에서 입증된 것과 아직 미입증인 것의 경계"
    }
  };

  const wordCount = text => String(text || "").trim().split(/\s+/).filter(Boolean).length;
  const sentences = text => String(text || "").match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];

  function removeOneSentence(paragraph) {
    const parts = sentences(paragraph);
    if (parts.length <= 2) return paragraph;
    parts.pop();
    return parts.join(" ").trim();
  }

  function shortenParagraphs(paragraphs) {
    const next = paragraphs.map(p => String(p || "").replace(/\s+/g, " ").trim()).filter(Boolean);
    let total = wordCount(next.join(" "));
    let safety = 0;
    while (total > TARGET_MAX && safety++ < 200) {
      let candidate = -1;
      let candidateWords = 0;
      for (let i = 0; i < next.length; i += 1) {
        const parts = sentences(next[i]);
        const count = wordCount(next[i]);
        if (parts.length > 2 && count > candidateWords) {
          candidate = i;
          candidateWords = count;
        }
      }
      if (candidate < 0) break;
      next[candidate] = removeOneSentence(next[candidate]);
      total = wordCount(next.join(" "));
    }
    return next;
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

  for (const [key, value] of Object.entries(additions)) {
    const day = program.days.find(item => item.day === Number(key));
    if (!day?.reading?.paragraphs) continue;
    if (!day.reading.paragraphs.includes(value.paragraph)) day.reading.paragraphs.push(value.paragraph);
    if (Array.isArray(day.reading.paragraphFunctionsKo) && !day.reading.paragraphFunctionsKo.includes(value.functionKo)) {
      day.reading.paragraphFunctionsKo.push(value.functionKo);
    }
  }

  for (const day of program.days) {
    if (!day || day.day > 10 || !Array.isArray(day.reading?.paragraphs)) continue;
    day.reading.paragraphs = shortenParagraphs(day.reading.paragraphs);
    const count = wordCount(day.reading.paragraphs.join(" "));
    const originalInstruction = String(day.reading.instructionKo || "").replace(/^약\s*1,500단어[^.]*\.\s*/i, "");
    day.reading.instructionKo = `약 700~850단어의 집중 본문을 끝까지 읽으세요. ${originalInstruction || "모르는 단어가 있어도 먼저 문장구조와 문단기능을 유지합니다."}`;
    expandExpressions(day);
    day.coverage ||= {};
    day.coverage.normalizedWordCount = count;
    day.coverage.readingTarget = "700~850 words";
    day.coverage.studyDesign = "short-reading-v3";
  }

  function fixReadingMeta() {
    document.querySelectorAll(".reading-meta span").forEach(span => {
      if (/1,500단어|1500단어/.test(span.textContent || "")) span.textContent = "약 700~850단어 집중 본문";
    });
  }

  if (!root.__TOEIC_SHORT_READING_META_OBSERVER__) {
    root.__TOEIC_SHORT_READING_META_OBSERVER__ = true;
    const install = () => {
      fixReadingMeta();
      const observer = new MutationObserver(fixReadingMeta);
      observer.observe(document.body, { childList: true, subtree: true });
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install, { once: true });
    else install();
  }
})(globalThis);
