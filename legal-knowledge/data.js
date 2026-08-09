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
    const ui = document.createElement('script');
    ui.src = 'law-currentness-ui-20260809.js';
    document.body.appendChild(ui);
  };
  document.body.appendChild(currentness);
});
