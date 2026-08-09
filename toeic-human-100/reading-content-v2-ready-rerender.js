/* Ensure the UI refreshes after async master-lexicon driven generation finishes. */
(function () {
  const ready = globalThis.TOEIC_READING_V2_READY;
  if (!ready || typeof ready.then !== 'function') return;
  ready.then(() => {
    if (typeof render === 'function') render();
  }).catch(() => {});
})();
