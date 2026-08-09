/* TEPS extension UI patch — loaded after app-v2.js */
(function () {
  if (typeof TEPS_READING_EXTENSION_V2 === 'undefined') return;
  const getTepsDay = day => TEPS_READING_EXTENSION_V2.days.find(item => item.day === day);
  const baseRead = renderV2Read;
  const baseAnalyze = renderV2Analyze;
  const baseApply = renderV2Apply;

  renderV2Read = function(day) {
    const html = baseRead(day);
    const teps = getTepsDay(day.day);
    if (!teps) return html;
    currentSpeechText = `${currentSpeechText} ${teps.passage}`.trim();
    return `${html}
      <section class="teps-extension teps-reading">
        <div class="teps-kicker">TEPS READING EXTENSION</div>
        <h3>${escapeHtml(teps.title)}</h3>
        <p class="teps-purpose">TOEIC 실무영어에서 한 단계 더 나아가 추상어휘·논리·추론을 훈련합니다. 먼저 사전 없이 끝까지 읽으세요.</p>
        <article class="teps-passage"><p>${escapeHtml(teps.passage)}</p></article>
        <details class="reading-details teps-logic"><summary>TEPS 확장 논리 확인</summary><div><p>${escapeHtml(teps.logicKo)}</p></div></details>
      </section>`;
  };

  renderV2Analyze = function(day) {
    const html = baseAnalyze(day);
    const teps = getTepsDay(day.day);
    if (!teps) return html;
    const vocab = (teps.vocabulary || []).map(([word, meaning]) => `<div class="lexicon-item teps-word"><strong>${escapeHtml(word)}</strong><span>${escapeHtml(meaning)}</span><span class="tier">TEPS+</span></div>`).join('');
    return `${html}
      <section class="analysis-section teps-extension teps-analysis">
        <div class="teps-kicker">TEPS VOCABULARY & LOGIC</div>
        <h3>TEPS 고급어휘·논리 확장</h3>
        <p class="analysis-note">TOEIC에서 익힌 구조를 학술·사회·논증 문맥으로 옮깁니다. 단어 뜻보다 문장 안에서 어떤 논리적 역할을 하는지 확인하세요.</p>
        <div class="lexicon-grid">${vocab}</div>
        <div class="teps-logic-box"><strong>논리 핵심</strong><p>${escapeHtml(teps.logicKo)}</p></div>
      </section>`;
  };

  renderV2Apply = function(day) {
    const html = baseApply(day);
    const teps = getTepsDay(day.day);
    if (!teps) return html;
    const questions = (teps.questions || []).map((q,i) => questionHtml(q, `d${day.day}-teps-${i}`, `TEPS · ${q.type}`)).join('');
    return `${html}
      <section class="practice-group teps-extension teps-practice">
        <div class="teps-kicker">TEPS PRACTICE</div>
        <h3>TEPS 대비 독해 확장</h3>
        <p class="analysis-note">빈칸·문맥·주제·추론을 통해 문장 해석을 넘어 글의 논리구조를 확인합니다.</p>
        ${questions}
      </section>`;
  };

  if (typeof render === 'function') render();
})();
