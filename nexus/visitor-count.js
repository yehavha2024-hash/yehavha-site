(() => {
  'use strict';

  const COUNTER_ENDPOINT = '/api/access?op=get';
  const target = document.getElementById('accessCount');
  if (!target) return;

  const formatter = new Intl.NumberFormat('ko-KR');

  async function renderVisitorCounts() {
    try {
      const response = await fetch(COUNTER_ENDPOINT, {
        method: 'GET',
        cache: 'no-store',
        credentials: 'same-origin',
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) return;
      const payload = await response.json();
      const today = Number(payload?.today);
      const total = Number(payload?.count);
      if (!payload?.ok || !Number.isFinite(today) || !Number.isFinite(total)) return;

      target.textContent = `오늘 ${formatter.format(today)} | 누적 ${formatter.format(total)}`;
      target.setAttribute('aria-label', `오늘 방문자 ${formatter.format(today)}명, 누적 방문자 ${formatter.format(total)}명`);
      target.hidden = false;
    } catch (_) {
      // Existing cumulative counter remains visible if the daily query is unavailable.
    }
  }

  function startAfterBaseCounter() {
    const text = target.textContent.trim();
    if (text && text !== '확인 중') {
      renderVisitorCounts();
      return;
    }

    const observer = new MutationObserver(() => {
      const current = target.textContent.trim();
      if (!current || current === '확인 중') return;
      observer.disconnect();
      renderVisitorCounts();
    });

    observer.observe(target, { childList: true, characterData: true, subtree: true });
    window.setTimeout(() => {
      observer.disconnect();
      renderVisitorCounts();
    }, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAfterBaseCounter, { once: true });
  } else {
    startAfterBaseCounter();
  }
})();
