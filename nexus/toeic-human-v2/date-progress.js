(() => {
  'use strict';

  const KST = 'Asia/Seoul';
  const START_KEY = 'toeic-human-v2_start_date';
  const COMPLETION_KEY = 'toeic-human-v2-stage-completed-v3';
  const WRONG_KEY = 'toeic-human-v2-wrong-v3';
  const CATEGORIES = ['read', 'analyze', 'apply', 'speed'];
  const initialUrl = new URL(location.href);
  const requestedDay = Number(initialUrl.searchParams.get('day'));
  const explicitDay = Number.isInteger(requestedDay) && requestedDay >= 1 && requestedDay <= 100;

  function kstDateString(date = new Date()) {
    return new Intl.DateTimeFormat('en-CA', { timeZone: KST, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
  }

  function dayDiff(start, end) {
    const a = Date.parse(`${start}T00:00:00+09:00`);
    const b = Date.parse(`${end}T00:00:00+09:00`);
    return Math.floor((b - a) / 86400000);
  }

  function shiftDate(dateKey, amount) {
    const [year, month, day] = dateKey.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day + amount));
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
  }

  function firstIncompleteDay() {
    let completed = {};
    try { completed = JSON.parse(localStorage.getItem(COMPLETION_KEY) || '{}'); } catch {}
    for (let day = 1; day <= 100; day += 1) {
      const done = new Set(Array.isArray(completed[day]) ? completed[day] : []);
      if (!CATEGORIES.every((category) => done.has(category))) return day;
    }
    return 100;
  }

  function getDateDay() {
    const today = kstDateString();
    let start = localStorage.getItem(START_KEY);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(start || '')) {
      const currentDay = firstIncompleteDay();
      start = shiftDate(today, -(currentDay - 1));
      localStorage.setItem(START_KEY, start);
    }
    return Math.min(100, Math.max(1, dayDiff(start, today) + 1));
  }

  const todayDay = getDateDay();
  if (!explicitDay) {
    const nextUrl = new URL(location.href);
    nextUrl.searchParams.set('day', String(todayDay));
    history.replaceState({}, '', nextUrl);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const dayLabel = document.getElementById('dayLabel');
    const completeBtn = document.getElementById('completeBtn');
    const resetBtn = document.getElementById('resetBtn');

    const syncCompleteLabel = () => {
      if (completeBtn) completeBtn.textContent = completeBtn.classList.contains('completed') ? '완료 기록됨 ✓' : '완료 기록';
    };

    if (completeBtn) new MutationObserver(syncCompleteLabel).observe(completeBtn, { attributes: true, attributeFilter: ['class'] });

    resetBtn?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!confirm('완료·오답 기록만 초기화할까요? 날짜 기준 DAY는 그대로 유지됩니다.')) return;
      localStorage.removeItem(COMPLETION_KEY);
      localStorage.removeItem(WRONG_KEY);
      location.reload();
    }, true);

    if (dayLabel) dayLabel.setAttribute('title', `${kstDateString()} 기준 오늘 학습은 DAY ${todayDay}`);
    syncCompleteLabel();
  });
})();
