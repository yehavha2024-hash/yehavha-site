(() => {
  'use strict';

  const records = Array.isArray(window.AI_FORESIGHT_RECORDS) ? window.AI_FORESIGHT_RECORDS : [];
  const normalize = value => String(value || '').replace(/\s+/g,' ').trim().toLowerCase();

  records.forEach(item => {
    if (normalize(item.title) && normalize(item.title) === normalize(item.en)) item.en = '';
  });
})();
