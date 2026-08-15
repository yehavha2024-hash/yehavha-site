/* Expose classic-script lexical reading data to runtime patches. */
(() => {
  try {
    if (typeof TOEIC_READING_V2 !== "undefined") globalThis.TOEIC_READING_V2 = TOEIC_READING_V2;
  } catch {}
  try {
    if (typeof TEPS_READING_EXTENSION_V2 !== "undefined") globalThis.TEPS_READING_EXTENSION_V2 = TEPS_READING_EXTENSION_V2;
  } catch {}
})();
