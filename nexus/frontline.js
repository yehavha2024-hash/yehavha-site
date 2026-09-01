(() => {
  'use strict';
  const dateEl = document.getElementById('todayNexusDate');
  if (!dateEl) return;
  const parts = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short'
  }).formatToParts(new Date());
  const map = Object.fromEntries(parts.map(part => [part.type, part.value]));
  dateEl.textContent = `${map.year}.${map.month}.${map.day} ${map.weekday}`;
})();
