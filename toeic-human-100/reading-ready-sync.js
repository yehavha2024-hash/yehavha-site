/* Refresh the UI once asynchronous master-lexicon generation has completed. */
(function () {
  const ready = globalThis.TOEIC_READING_V2_READY;
  if (!ready || typeof ready.then !== 'function') return;
  ready.then(() => {
    if (typeof render === 'function') render();
  }).catch(() => {});
})();
