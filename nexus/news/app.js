(() => {
  'use strict';

  const rawData = Array.isArray(window.YEHAVHA_NEWS_DATA) ? window.YEHAVHA_NEWS_DATA : [];
  const config = window.YEHAVHA_NEWS_CONFIG || {};
  const categories = Array.isArray(config.categories) ? config.categories : [];
  const pageSize = Number(config.resultsPageSize) || 20;
  const homeLatestLimit = Number(config.homeLatestLimit) || 10;
  const categoryLatestLimit = Number(config.categoryLatestLimit) || 3;

  const els = {
    categoryNav: document.getElementById('categoryNav'),
    searchForm: document.getElementById('newsSearchForm'),
    searchInput: document.getElementById('newsSearch'),
    searchClear: document.getElementById('newsSearchClear'),
    homeView: document.getElementById('homeView'),
    resultsView: document.getElementById('resultsView'),
    resultsTitle: document.getElementById('resultsTitle'),
    resultsMeta: document.getElementById('resultsMeta'),
    resultsList: document.getElementById('resultsList'),
    loadMore: document.getElementById('loadMore'),
    latestTitle: document.getElementById('latestNewsTitle'),
    latestMeta: document.getElementById('latestNewsMeta'),
    latestList: document.getElementById('latestNewsList'),
    categoryGrid: document.getElementById('categoryLatestGrid'),
    archiveMonth: document.getElementById('archiveMonth'),
    archiveDates: document.getElementById('archiveDates'),
    status: document.getElementById('newsStatus'),
    weather: document.getElementById('weatherContent')
  };

  const isoDate = /^\d{4}-\d{2}-\d{2}$/;
  const seenIds = new Set();
  const seenHrefs = new Set();
  const data = rawData.filter((item, index) => {
    const valid = item && typeof item === 'object'
      && typeof item.id === 'string' && item.id
      && typeof item.date === 'string' && isoDate.test(item.date)
      && typeof item.category === 'string' && categories.includes(item.category)
      && typeof item.title === 'string' && item.title
      && typeof item.summary === 'string'
      && typeof item.href === 'string' && item.href;
    if (!valid) {
      console.warn('[YEHAVHA NEWS] Invalid article record skipped:', index, item);
      return false;
    }
    if (seenIds.has(item.id) || seenHrefs.has(item.href)) {
      console.warn('[YEHAVHA NEWS] Duplicate article record skipped:', item.id, item.href);
      return false;
    }
    seenIds.add(item.id);
    seenHrefs.add(item.href);
    return true;
  }).slice().sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

  const params = new URLSearchParams(location.search);
  const requestedCategory = params.get('category');
  const state = {
    category: requestedCategory && categories.includes(requestedCategory) ? requestedCategory : 'all',
    query: (params.get('q') || '').trim(),
    visible: pageSize,
    month: params.get('month') || ''
  };

  function formatDate(date) {
    return date.replace(/-/g, '.');
  }

  function formatDateKorean(date) {
    const [year, month, day] = date.split('-').map(Number);
    return `${year}년 ${month}월 ${day}일`;
  }

  function formatMonthKorean(month) {
    const [year, value] = month.split('-').map(Number);
    return `${year}년 ${value}월`;
  }

  function make(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function articleCard(item, compact = false) {
    const link = make('a', compact ? 'news-card news-card-compact' : 'news-card');
    link.href = item.href;
    const meta = make('div', 'news-card-meta');
    [item.category, formatDate(item.date), item.author || 'YEHAVHA NEWS'].forEach(value => meta.append(make('span', '', value)));
    const title = make('h3', '', item.title);
    const summary = make('p', '', item.summary);
    link.append(meta, title, summary);
    return link;
  }

  function archiveRow(item) {
    const link = make('a', 'archive-row');
    link.href = item.href;
    link.append(
      make('span', 'archive-category', item.category),
      make('span', 'archive-title', item.title),
      make('span', 'archive-arrow', '기사 보기 →')
    );
    return link;
  }

  function latestKstDate() {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(new Date());
    const value = Object.fromEntries(parts.map(part => [part.type, part.value]));
    return `${value.year}-${value.month}-${value.day}`;
  }

  function renderLatest() {
    if (!els.latestList || !data.length) return;
    const latestDate = data[0].date;
    const latestItems = data.filter(item => item.date === latestDate).slice(0, homeLatestLimit);
    const isToday = latestDate === latestKstDate();
    if (els.latestTitle) els.latestTitle.textContent = isToday ? '오늘의 주요뉴스' : '최신 주요뉴스';
    if (els.latestMeta) els.latestMeta.textContent = `${formatDate(latestDate)} · ${latestItems.length}건`;
    els.latestList.replaceChildren(...latestItems.map(item => articleCard(item)));
  }

  function renderCategoryLatest() {
    if (!els.categoryGrid) return;
    const fragment = document.createDocumentFragment();
    categories.forEach(category => {
      const items = data.filter(item => item.category === category).slice(0, categoryLatestLimit);
      if (!items.length) return;
      const section = make('section', 'category-latest-block');
      const head = make('div', 'category-latest-head');
      const title = make('h3', '', category);
      const more = make('a', 'category-more', '전체 보기 →');
      more.href = `?category=${encodeURIComponent(category)}`;
      head.append(title, more);
      const list = make('div', 'category-latest-list');
      items.forEach(item => list.append(articleCard(item, true)));
      section.append(head, list);
      fragment.append(section);
    });
    els.categoryGrid.replaceChildren(fragment);
  }

  function monthList() {
    return [...new Set(data.map(item => item.date.slice(0, 7)))].sort((a, b) => b.localeCompare(a));
  }

  function renderArchiveMonthOptions() {
    if (!els.archiveMonth) return;
    const months = monthList();
    if (!months.length) return;
    if (!months.includes(state.month)) state.month = months[0];
    const options = months.map(month => {
      const option = make('option', '', formatMonthKorean(month));
      option.value = month;
      return option;
    });
    els.archiveMonth.replaceChildren(...options);
    els.archiveMonth.value = state.month;
    renderArchiveDates();
  }

  function renderArchiveDates() {
    if (!els.archiveDates || !state.month) return;
    const monthItems = data.filter(item => item.date.startsWith(state.month));
    const dates = [...new Set(monthItems.map(item => item.date))].sort((a, b) => b.localeCompare(a));
    const fragment = document.createDocumentFragment();
    dates.forEach((date, index) => {
      const items = monthItems.filter(item => item.date === date);
      const details = make('details', 'archive-day');
      if (index === 0) details.open = true;
      details.dataset.date = date;
      const summary = make('summary', 'archive-day-summary');
      summary.append(
        make('strong', '', formatDateKorean(date)),
        make('span', '', `${items.length}건`)
      );
      const list = make('div', 'archive-day-list');
      if (details.open) {
        items.forEach(item => list.append(archiveRow(item)));
        list.dataset.rendered = 'true';
      }
      details.addEventListener('toggle', () => {
        if (details.open && list.dataset.rendered !== 'true') {
          items.forEach(item => list.append(archiveRow(item)));
          list.dataset.rendered = 'true';
        }
      });
      details.append(summary, list);
      fragment.append(details);
    });
    els.archiveDates.replaceChildren(fragment);
  }

  function searchableText(item) {
    return [item.title, item.summary, item.category, item.author, item.keywords].filter(Boolean).join(' ').toLowerCase();
  }

  function filteredData() {
    const q = state.query.toLowerCase();
    return data.filter(item => {
      const categoryMatch = state.category === 'all' || item.category === state.category;
      const queryMatch = !q || searchableText(item).includes(q);
      return categoryMatch && queryMatch;
    });
  }

  function resultsHeading(total) {
    if (state.category !== 'all' && state.query) return `${state.category} · “${state.query}” 검색`;
    if (state.category !== 'all') return `${state.category} 뉴스`;
    if (state.query) return `“${state.query}” 검색 결과`;
    return '전체 뉴스';
  }

  function renderResults() {
    const active = state.category !== 'all' || Boolean(state.query);
    if (els.homeView) els.homeView.hidden = active;
    if (els.resultsView) els.resultsView.hidden = !active;
    if (!active || !els.resultsList) return;

    const results = filteredData();
    const visible = results.slice(0, state.visible);
    if (els.resultsTitle) els.resultsTitle.textContent = resultsHeading(results.length);
    if (els.resultsMeta) els.resultsMeta.textContent = `${results.length}건 · 최신순`;
    if (visible.length) {
      els.resultsList.replaceChildren(...visible.map(item => articleCard(item)));
    } else {
      els.resultsList.replaceChildren(make('p', 'empty-state', '해당 조건의 뉴스가 없습니다.'));
    }
    if (els.loadMore) {
      els.loadMore.hidden = visible.length >= results.length;
      els.loadMore.textContent = `더 보기 (${visible.length}/${results.length})`;
    }
    announce(`${resultsHeading(results.length)} ${results.length}건`);
  }

  function updateCategoryButtons() {
    if (!els.categoryNav) return;
    els.categoryNav.querySelectorAll('[data-category]').forEach(button => {
      const selected = button.dataset.category === state.category;
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  function updateUrl(push = true) {
    const next = new URL(location.href);
    if (state.category === 'all') next.searchParams.delete('category');
    else next.searchParams.set('category', state.category);
    if (state.query) next.searchParams.set('q', state.query);
    else next.searchParams.delete('q');
    if (!state.category || state.category === 'all') {
      if (state.month && !state.query) next.searchParams.set('month', state.month);
      else next.searchParams.delete('month');
    } else {
      next.searchParams.delete('month');
    }
    const method = push ? 'pushState' : 'replaceState';
    history[method]({}, '', `${next.pathname}${next.search}${next.hash}`);
  }

  function syncFromUrl() {
    const current = new URLSearchParams(location.search);
    const category = current.get('category');
    state.category = category && categories.includes(category) ? category : 'all';
    state.query = (current.get('q') || '').trim();
    state.month = current.get('month') || state.month;
    state.visible = pageSize;
    if (els.searchInput) els.searchInput.value = state.query;
    updateCategoryButtons();
    renderResults();
    if (state.category === 'all' && !state.query) renderArchiveMonthOptions();
  }

  function announce(message) {
    if (els.status) els.status.textContent = message;
  }

  if (els.categoryNav) {
    els.categoryNav.addEventListener('click', event => {
      const button = event.target.closest('[data-category]');
      if (!button) return;
      state.category = button.dataset.category || 'all';
      state.visible = pageSize;
      updateCategoryButtons();
      updateUrl(true);
      renderResults();
      if (state.category === 'all' && !state.query) renderArchiveMonthOptions();
    });
  }

  if (els.searchForm) {
    els.searchForm.addEventListener('submit', event => {
      event.preventDefault();
      state.query = (els.searchInput?.value || '').trim();
      state.visible = pageSize;
      updateUrl(true);
      renderResults();
    });
  }

  if (els.searchClear) {
    els.searchClear.addEventListener('click', () => {
      state.query = '';
      state.category = 'all';
      state.visible = pageSize;
      if (els.searchInput) els.searchInput.value = '';
      updateCategoryButtons();
      updateUrl(true);
      renderResults();
      renderArchiveMonthOptions();
      els.searchInput?.focus();
    });
  }

  if (els.loadMore) {
    els.loadMore.addEventListener('click', () => {
      state.visible += pageSize;
      renderResults();
    });
  }

  if (els.archiveMonth) {
    els.archiveMonth.addEventListener('change', () => {
      state.month = els.archiveMonth.value;
      renderArchiveDates();
      updateUrl(false);
    });
  }

  window.addEventListener('popstate', syncFromUrl);

  const ptyText = {0:'강수 없음',1:'비',2:'비·눈',3:'눈',5:'빗방울',6:'빗방울·눈날림',7:'눈날림'};
  function kstBase(minutesBack) {
    const d = new Date(Date.now() + 9 * 60 * 60 * 1000 - minutesBack * 60 * 1000);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    const h = String(d.getUTCHours()).padStart(2, '0');
    return {date:`${y}${m}${day}`, time:`${h}00`};
  }

  async function loadWeather(minutesBack = 70) {
    if (!els.weather) return;
    const base = kstBase(minutesBack);
    const url = `/api/public-data?source=weather-ultra-now&base_date=${base.date}&base_time=${base.time}&nx=60&ny=127`;
    const response = await fetch(url, {headers:{accept:'application/json'}});
    const body = await response.json();
    if (!response.ok || !body.ok) throw new Error('weather_unavailable');
    const items = body?.data?.response?.body?.items?.item;
    if (!Array.isArray(items) || !items.length) throw new Error('weather_empty');
    const value = category => items.find(item => item.category === category)?.obsrValue;
    const temp = value('T1H');
    const humidity = value('REH');
    const pty = value('PTY');
    const wind = value('WSD');
    const nodes = [];
    nodes.push(make('strong', '', temp !== undefined ? `${temp}℃` : '서울'));
    nodes.push(make('span', '', ptyText[Number(pty)] || '기상 관측'));
    if (humidity !== undefined) nodes.push(make('span', '', `습도 ${humidity}%`));
    if (wind !== undefined) nodes.push(make('span', '', `바람 ${wind}m/s`));
    nodes.push(make('span', 'weather-note', '기상청 초단기실황'));
    els.weather.replaceChildren(...nodes);
  }

  function initWeather() {
    loadWeather().catch(() => loadWeather(130).catch(() => {
      if (!els.weather) return;
      els.weather.replaceChildren(
        make('span', '', '기상청 날씨 정보를 현재 불러올 수 없습니다.'),
        make('span', 'weather-note', '잠시 후 다시 확인해 주세요.')
      );
    }));
  }

  renderLatest();
  renderCategoryLatest();
  renderArchiveMonthOptions();
  syncFromUrl();
  initWeather();
})();
