(() => {
  'use strict';

  function splitList(value) {
    return String(value || '').split('|').map(item => item.trim()).filter(Boolean);
  }

  function escapeHtml(value = '') {
    return String(value).replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
  }

  window.NEXUS_UNIVERSITY_UTILS = Object.freeze({ splitList, escapeHtml });
  import('/shared/education-data-render.js?v=20260907').catch(error => console.error('N-University education data layer failed:', error));
})();
