(() => {
  'use strict';

  const REVIEW_PARAM = 'review';

  function completedData() {
    try {
      return typeof getCompleted === 'function'
        ? getCompleted()
        : JSON.parse(localStorage.getItem('toeic100_completed') || '{}');
    } catch {
      return {};
    }
  }

  function dayIsComplete(day, data = completedData()) {
    const entries = Array.isArray(data[day]) ? data[day] : [];
    return new Set(entries).size >= categoryOrder.length;
  }

  function nextStudyDay() {
    const data = completedData();
    for (let day = 1; day <= 100; day += 1) {
      if (!dayIsComplete(day, data)) return day;
    }
    return 100;
  }

  function firstIncompleteCategory(day) {
    const data = completedData();
    const done = new Set(Array.isArray(data[day]) ? data[day] : []);
    return categoryOrder.find(category => !done.has(category)) || categoryOrder[0];
  }

  function isExplicitReviewLink() {
    const params = new URLSearchParams(location.search);
    return params.get(REVIEW_PARAM) === '1' && Number(params.get('day')) >= 1;
  }

  function cleanOldDayParameter() {
    const url = new URL(location.href);
    url.searchParams.delete('day');
    url.searchParams.delete(REVIEW_PARAM);
    history.replaceState({}, '', url);
  }

  function resumeFromProgress() {
    // 공유된 복습 링크만 day 파라미터를 존중합니다.
    // 일반 접속에서는 예전에 주소창에 남은 ?day=1 때문에 DAY 1로 고정되지 않도록 합니다.
    if (isExplicitReviewLink()) return;

    autoDay = nextStudyDay();
    activeDay = autoDay;
    activeCategory = firstIncompleteCategory(activeDay);
    cleanOldDayParameter();
    render();
  }

  function shareCurrentStudy(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    const url = new URL(location.href);
    url.searchParams.set('category', activeCategory);
    url.searchParams.set('day', activeDay);
    url.searchParams.set(REVIEW_PARAM, '1');

    const payload = {
      title: `토익인간 DAY ${activeDay}`,
      text: `${CATEGORIES[activeCategory].label} · 토익인간 100일 프로젝트`,
      url: url.toString()
    };

    (async () => {
      try {
        if (navigator.share) await navigator.share(payload);
        else {
          await navigator.clipboard.writeText(url.toString());
          showToast('학습 링크를 복사했습니다.');
        }
      } catch (error) {
        if (error?.name !== 'AbortError') showToast('공유하지 못했습니다.');
      }
    })();
  }

  // 기존 공유 버튼은 일반 URL의 day 값을 고정시키므로 공유 전용 review=1 링크로 교체합니다.
  els.shareBtn?.addEventListener('click', shareCurrentStudy, true);

  // 마지막(5번째) 학습항목까지 완료되면 다음 접속에서 다음 DAY가 열림을 안내합니다.
  els.completeBtn?.addEventListener('click', () => {
    window.setTimeout(() => {
      if (!dayIsComplete(activeDay)) return;
      const next = Math.min(100, activeDay + 1);
      if (activeDay < 100) showToast(`DAY ${activeDay} 완료 · 다음 학습은 DAY ${next}입니다.`);
      else showToast('DAY 100까지 모든 학습을 완료했습니다.');
    }, 0);
  });

  resumeFromProgress();
})();
