/* TEPS extension content enrichment. This module adds semantic depth only; it does not own reading-length normalization. */
(function () {
  if (typeof TEPS_READING_EXTENSION_V2 === 'undefined') return;
  const additions = {
    3: ` Operationalization also helps readers compare sources that use different terminology, because once the underlying criterion is made explicit, surface wording becomes less important than the evidence being measured.`,
    4: ` Responsibility analysis therefore adds a second layer to causal explanation, asking not merely what contributed to the outcome but which contribution matters under the relevant rule or standard.`,
    5: ` In practice, the most revealing sentence in a difficult passage is sometimes the exception clause, because it exposes the boundary that the general statement alone leaves invisible.`,
    6: ` This is why a careful reader may annotate a paragraph with labels such as hypothesis, objection, concession, evidence, and conclusion rather than treating every proposition as equally endorsed.`,
    7: ` The distinction also protects against overclaiming: showing that a condition is necessary does not show that it is enough, and showing that it is helpful does not show that it is necessary.`,
    8: ` A disciplined reader therefore asks what kind of claim is being made before deciding what kind of evidence could support or challenge it.`,
    9: ` Framing becomes especially significant when a short quotation is extracted from a much longer interview, since omitted questions or qualifications may change how strongly the speaker appears to endorse a position.`,
    10: ` Once this diagnostic habit develops, difficult reading becomes less mysterious: the learner can choose whether to inspect vocabulary, reconstruct syntax, resolve a reference, or reconsider the logic of the paragraph.`
  };
  for (const [key, extra] of Object.entries(additions)) {
    const day = TEPS_READING_EXTENSION_V2.days.find(item => item.day === Number(key));
    if (day && !day.passage.endsWith(extra)) day.passage += extra;
  }
})();
