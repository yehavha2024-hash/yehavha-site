/* V2 reading length normalization patch — keep DAY 1~100 at substantial length */
(function () {
  if (typeof TOEIC_READING_V2 === 'undefined') return;
  const additions = {
    3: {
      paragraph: `A purchasing decision becomes even more demanding when several employees will use the same device for different tasks. One person may care primarily about scanning speed, another about network security, and another about image quality or warranty support. In that situation, the most useful question is not whether a product is simply “good,” but whether the evidence supports the specific purposes for which the organization intends to use it. A feature that creates value in one workflow may be irrelevant in another, while a limitation that seems minor to one department may become decisive for another. Comparing documents therefore requires the reader to preserve both the shared facts and the different standards by which those facts are evaluated.`,
      functionKo: "공통 사실과 부서별 평가기준의 차이"
    },
    7: {
      paragraph: `Application documents also demonstrate why readers must distinguish evidence from labels. A candidate may describe an earlier position as “project management,” but the employer still needs to determine what duties were actually performed, for how long, and at what level of responsibility. Conversely, someone whose former title appears unrelated may have carried out highly relevant coordination work. This is why strong applications provide verifiable examples instead of relying only on favorable job titles. The same principle helps in general reading: a label offers an initial category, but the surrounding description determines whether that category is justified. Readers become more accurate when they postpone judgment long enough to compare the label with the evidence that follows.`,
      functionKo: "직함·라벨과 실제 증거의 구별"
    },
    9: {
      paragraph: `Readers should also notice what a news article does not establish. An announcement may provide a clear plan without proving that the plan will succeed, and a favorable market reaction may show investor expectations without demonstrating the eventual financial result. Absence of proof is not the same as proof of failure; it simply marks a question that remains open. This distinction prevents readers from turning forecasts into facts or uncertainty into pessimism. In longer nonfiction, authors frequently leave some issues unresolved because the available evidence supports only a limited conclusion. Recognizing those limits is a sign of comprehension rather than hesitation, because accurate reading includes knowing where the text itself stops making claims.`,
      functionKo: "기사에서 입증된 것과 아직 미입증인 것의 경계"
    }
  };
  for (const [key, value] of Object.entries(additions)) {
    const day = TOEIC_READING_V2.days.find(item => item.day === Number(key));
    if (!day?.reading?.paragraphs) continue;
    if (!day.reading.paragraphs.includes(value.paragraph)) day.reading.paragraphs.push(value.paragraph);
    if (Array.isArray(day.reading.paragraphFunctionsKo) && !day.reading.paragraphFunctionsKo.includes(value.functionKo)) day.reading.paragraphFunctionsKo.push(value.functionKo);
  }
})();
