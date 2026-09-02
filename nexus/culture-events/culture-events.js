(() => {
  'use strict';

  const categoryFilters = document.getElementById('categoryFilters');
  const regionFilters = document.getElementById('regionFilters');
  const snapshotGrid = document.getElementById('snapshotGrid');
  const eventGrid = document.getElementById('eventGrid');
  const sourceGrid = document.getElementById('sourceGrid');
  const emptyState = document.getElementById('emptyState');
  const eventCountText = document.getElementById('eventCountText');
  const updatedAtText = document.getElementById('updatedAtText');
  const pastToggle = document.getElementById('pastToggle');

  let data = null;
  let activeCategory = '전체';
  let activeRegion = '전국';
  let showPast = false;

  function kstDate() {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(new Date());
  }

  function statusFor(item, today = kstDate()) {
    if (today < item.startDate) return '예정';
    if (today > item.endDate) return '종료';
    return '진행중';
  }

  function dateLabel(item) {
    const start = item.startDate.replaceAll('-', '.');
    const end = item.endDate.replaceAll('-', '.');
    return start === end ? start : `${start}–${end}`;
  }

  function inNextDays(item, days) {
    const today = new Date(`${kstDate()}T00:00:00+09:00`);
    const start = new Date(`${item.startDate}T00:00:00+09:00`);
    const end = new Date(`${item.endDate}T23:59:59+09:00`);
    const limit = new Date(today.getTime() + days * 86400000);
    return end >= today && start <= limit;
  }

  function makeButton(label, pressed, handler) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-btn';
    button.textContent = label;
    button.setAttribute('aria-pressed', String(pressed));
    button.addEventListener('click', handler);
    return button;
  }

  function renderFilters() {
    categoryFilters.replaceChildren();
    for (const category of data.categories) {
      categoryFilters.append(makeButton(category, activeCategory === category, () => {
        activeCategory = category;
        renderFilters();
        renderEvents();
      }));
    }

    regionFilters.replaceChildren();
    for (const region of data.regions) {
      regionFilters.append(makeButton(region, activeRegion === region, () => {
        activeRegion = region;
        renderFilters();
        renderEvents();
      }));
    }
  }

  function filteredEvents() {
    return data.events
      .filter(item => showPast || statusFor(item) !== '종료')
      .filter(item => activeCategory === '전체' || item.category === activeCategory)
      .filter(item => activeRegion === '전국' || item.regionGroup === activeRegion)
      .sort((a, b) => {
        const rank = {진행중: 0, 예정: 1, 종료: 2};
        const byStatus = rank[statusFor(a)] - rank[statusFor(b)];
        if (byStatus) return byStatus;
        if (a.startDate !== b.startDate) return a.startDate.localeCompare(b.startDate);
        return (a.priority || 9) - (b.priority || 9);
      });
  }

  function renderSnapshot() {
    const live = data.events.filter(item => statusFor(item) === '진행중').length;
    const week = data.events.filter(item => statusFor(item) !== '종료' && inNextDays(item, 7)).length;
    const performance = data.events.filter(item => item.category === '공연' && statusFor(item) !== '종료').length;
    const visual = data.events.filter(item => ['전시','박람회'].includes(item.category) && statusFor(item) !== '종료').length;
    const regional = data.events.filter(item => item.category === '지역행사' && statusFor(item) !== '종료').length;
    const cells = [
      ['진행중', live],
      ['7일 내 일정', week],
      ['공연', performance],
      ['전시·박람회', visual],
      ['지역행사', regional]
    ];
    snapshotGrid.replaceChildren();
    for (const [label, value] of cells) {
      const cell = document.createElement('div');
      cell.className = 'snapshot-cell';
      cell.innerHTML = `<strong>${value}</strong><span>${label}</span>`;
      snapshotGrid.append(cell);
    }
  }

  function renderEvents() {
    const items = filteredEvents();
    eventGrid.replaceChildren();
    eventCountText.textContent = `${items.length}건 표시`;
    emptyState.hidden = items.length > 0;

    items.forEach((item, index) => {
      const status = statusFor(item);
      const card = document.createElement('article');
      card.className = 'event-card';
      card.dataset.status = status;

      const headline = document.createElement('div');
      headline.className = 'event-headline';
      const number = document.createElement('span');
      number.className = 'event-index';
      number.textContent = String(index + 1).padStart(2, '0');
      const category = document.createElement('span');
      category.className = 'event-category';
      category.textContent = item.category;
      const title = document.createElement('h3');
      title.textContent = item.title;
      headline.append(number, category, title);

      const meta = document.createElement('div');
      meta.className = 'event-meta';
      for (const value of [status, dateLabel(item), item.region, item.venue].filter(Boolean)) {
        const span = document.createElement('span');
        span.textContent = value;
        if (value === status) span.className = 'event-status';
        meta.append(span);
      }

      const note = document.createElement('p');
      note.className = 'event-note';
      note.textContent = item.note;

      const link = document.createElement('a');
      link.className = 'event-link';
      link.href = item.sourceUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = `${item.sourceName} 확인 ↗`;

      card.append(headline, meta, note, link);
      eventGrid.append(card);
    });
  }

  function renderSources() {
    sourceGrid.replaceChildren();
    for (const source of data.sources) {
      const link = document.createElement('a');
      link.className = 'source-card';
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      const title = document.createElement('strong');
      title.textContent = source.label;
      const note = document.createElement('span');
      note.textContent = source.note;
      link.append(title, note);
      sourceGrid.append(link);
    }
  }

  async function load() {
    eventGrid.innerHTML = '<p class="culture-loading">문화·행사 정보를 불러오는 중입니다.</p>';
    try {
      const response = await fetch('./events.json', {cache: 'no-store'});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      data = await response.json();
      updatedAtText.textContent = `업데이트 ${String(data.updatedAt || '').replaceAll('-', '.')}`;
      renderFilters();
      renderSnapshot();
      renderEvents();
      renderSources();
    } catch (error) {
      console.error('Culture events data load failed:', error);
      eventGrid.innerHTML = '<p class="culture-loading">정보를 불러오지 못했습니다. 공식 기준원 링크를 이용해 주세요.</p>';
    }
  }

  pastToggle.addEventListener('click', () => {
    showPast = !showPast;
    pastToggle.textContent = showPast ? '지난 행사 숨기기' : '지난 행사 보기';
    renderEvents();
  });

  load();
})();
