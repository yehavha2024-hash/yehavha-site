window.LEGAL_KNOWLEDGE = [];
document.write('<script src="data-core-expansion-20.js"><\/script>');
document.write('<script src="data-core-expansion-20-enrichment-civil.js"><\/script>');
document.write('<script src="data-core-expansion-20-enrichment-public-criminal.js"><\/script>');
document.write('<script src="data-core-expansion-20-enrichment-ip-special.js"><\/script>');
document.addEventListener('DOMContentLoaded', () => {
  const meta = document.querySelector('.hero-meta span:last-child');
  if (meta) meta.textContent = '법령·판례 기준 2026.08.09';

  const currentness = document.createElement('script');
  currentness.src = 'data-law-currentness-20260809.js';
  currentness.onload = () => {
    const currentnessHotfix = document.createElement('script');
    currentnessHotfix.src = 'data-law-currentness-hotfix-20260809.js';
    currentnessHotfix.onload = () => {
      const currentnessUi = document.createElement('script');
      currentnessUi.src = 'law-currentness-ui-20260809.js';
      currentnessUi.onload = () => {
        const caseData = document.createElement('script');
        caseData.src = 'data-case-verification-round2-20260809.js';
        caseData.onload = () => {
          const dedupData = document.createElement('script');
          dedupData.src = 'data-dedup-round6-ai-20260809.js';
          dedupData.onload = () => {
            const caseUi = document.createElement('script');
            caseUi.src = 'case-verification-ui-20260809.js';
            document.body.appendChild(caseUi);
            if (typeof renderCards === 'function') renderCards();
          };
          document.body.appendChild(dedupData);
        };
        document.body.appendChild(caseData);
      };
      document.body.appendChild(currentnessUi);
    };
    document.body.appendChild(currentnessHotfix);
  };
  document.body.appendChild(currentness);
});
