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
  const data = rawData
    .map((item, index) => ({...item, _sequence:index}))
    .filter((item, index) => {
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
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a._sequence - b._sequence);

  const state = {
    category: 'all',
    query: '',
    visible: pageSize,
    month: ''
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

  function renderCategoryNav() {
    if (!els.categoryNav) return;
    const entries = [['all', '전체'], ...categories.map(category => [category, category])];
    const buttons = entries.map(([value, label]) => {
      const button = make('button', 'category-btn', label);
      button.type = 'button';
      button.dataset.category = value;
      button.setAttribute('aria-pressed', 'false');
      return button;
    });
    const policyLink = make('a', 'category-btn policy-category-link', '운영규정');
    policyLink.href = './policies/';
    policyLink.setAttribute('aria-label', 'YEHAVHA NEWS 내부 운영규정 보기');
    els.categoryNav.replaceChildren(...buttons, policyLink);
  }

  function articleCard(item, compact = false, media = false) {
    const video = item?.video;
    const hasVideo = media
      && video
      && typeof video.url === 'string' && video.url
      && typeof video.thumbnail === 'string' && video.thumbnail;

    if (hasVideo) {
      const card = make('article', 'opinion-feature news-media-feature');
      const visual = make('div', 'news-media-visual');
      const articleThumbLink = make('a', 'news-media-thumb-link');
      articleThumbLink.href = item.href;
      articleThumbLink.setAttribute('aria-label', `${item.title} 기사 보기`);

      const image = make('img');
      image.src = video.thumbnail;
      image.alt = `${item.title} 관련 YouTube 영상 썸네일`;
      image.width = 480;
      image.height = 270;
      image.loading = 'lazy';
      image.decoding = 'async';
      articleThumbLink.append(image);

      const relatedLink = make('a', 'news-media-related', `${item.category} 관련 영상 ↗`);
      relatedLink.href = video.url;
      relatedLink.target = '_blank';
      relatedLink.rel = 'noopener noreferrer';
      relatedLink.setAttribute('aria-label', `${item.title} 관련 영상 새 창에서 보기`);
      visual.append(articleThumbLink, relatedLink);

      const copy = make('div', 'opinion-copy news-media-copy');
      const meta = make('div', 'news-card-meta news-media-meta');
      [item.category, formatDate(item.date), item.author || 'YEHAVHA NEWS']
        .forEach(value => meta.append(make('span', '', value)));

      const heading = make('h3', 'news-media-title');
      const titleLink = make('a', '', item.title);
      titleLink.href = item.href;
      heading.append(titleLink);

      const summary = make('span', 'news-media-summary', item.summary);
      const actions = make('b', 'news-media-actions');
      const articleLink = make('a', 'news-media-action', '기사 보기 →');
      articleLink.href = item.href;
      actions.append(articleLink);

      copy.append(meta, heading, summary, actions);
      card.append(visual, copy);
      return card;
    }

    const link = make('a', compact ? 'news-card news-card-compact' : 'news-card');
    link.href = item.href;
    const meta = make('div', 'news-card-meta');
    [item.category, formatDate(item.date), item.author || 'YEHAVHA NEWS']
      .forEach(value => meta.append(make('span', '', value)));
    link.append(
      meta,
      make('h3', '', item.title),
      make('p', '', item.summary)
    );
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
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(new Date());
    const value = Object.fromEntries(parts.map(part => [part.type, part.value]));
    return `${value.year}-${value.month}-${value.day}`;
  }

  function renderLatest() {
    if (!els.latestList) return;
    if (!data.length) {
      els.latestList.replaceChildren(make('p', 'empty-state', '등록된 뉴스가 없습니다.'));
      return;
    }
    const latestDate = data[0].date;
    const latestItems = data.filter(item => item.date === latestDate).slice(0, homeLatestLimit);
    const isToday = latestDate === latestKstDate();
    if (els.latestTitle) els.latestTitle.textContent = isToday ? '오늘의 주요뉴스' : '최신 주요뉴스';
    if (els.latestMeta) els.latestMeta.textContent = `${formatDate(latestDate)} · ${latestItems.length}건`;
    els.latestList.replaceChildren(...latestItems.map(item => articleCard(item, false, true)));
  }

  function renderCategoryLatest() {
    if (!els.categoryGrid) return;
    const fragment = document.createDocumentFragment();
    categories.forEach(category => {
      const items = data.filter(item => item.category === category).slice(0, categoryLatestLimit);
      if (!items.length) return;
      const section = make('section', 'category-latest-block');
      const head = make('div', 'category-latest-head');
      const more = make('a', 'category-more', '전체 보기 →');
      more.href = `?category=${encodeURIComponent(category)}`;
      head.append(make('h3', '', category), more);
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
    if (!months.length) {
      els.archiveMonth.replaceChildren();
      if (els.archiveDates) els.archiveDates.replaceChildren(make('p', 'empty-state', '지난 뉴스가 없습니다.'));
      return;
    }
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
      details.dataset.date = date;
      details.open = index === 0;

      const summary = make('summary', 'archive-day-summary');
      summary.append(
        make('strong', '', formatDateKorean(date)),
        make('span', '', `${items.length}건`)
      );

      const list = make('div', 'archive-day-list');
      const renderItems = () => {
        if (list.dataset.rendered === 'true') return;
        items.forEach(item => list.append(archiveRow(item)));
        list.dataset.rendered = 'true';
      };
      if (details.open) renderItems();
      details.addEventListener('toggle', () => {
        if (details.open) renderItems();
      });
      details.append(summary, list);
      fragment.append(details);
    });

    els.archiveDates.replaceChildren(fragment);
  }

  function searchableText(item) {
    return [item.title, item.summary, item.category, item.author, item.keywords]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
  }

  function filteredData() {
    const q = state.query.toLowerCase();
    return data.filter(item => {
      const categoryMatch = state.category === 'all' || item.category === state.category;
      const queryMatch = !q || searchableText(item).includes(q);
      return categoryMatch && queryMatch;
    });
  }

  function resultsHeading() {
    if (state.category !== 'all' && state.query) return `${state.category} · “${state.query}” 검색`;
    if (state.category !== 'all') return `${state.category} 뉴스`;
    if (state.query) return `“${state.query}” 검색 결과`;
    return '전체 뉴스';
  }

  function isResultsMode() {
    return state.category !== 'all' || Boolean(state.query);
  }

  function renderResults() {
    if (!els.resultsList) return;
    const results = filteredData();
    const visible = results.slice(0, state.visible);
    const heading = resultsHeading();
    if (els.resultsTitle) els.resultsTitle.textContent = heading;
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
    announce(`${heading} ${results.length}건`);
  }

  function renderHome() {
    renderLatest();
    renderCategoryLatest();
    renderArchiveMonthOptions();
  }

  function renderView() {
    const resultsMode = isResultsMode();
    if (els.homeView) els.homeView.hidden = resultsMode;
    if (els.resultsView) els.resultsView.hidden = !resultsMode;
    if (resultsMode) renderResults();
    else renderHome();
  }

  function updateCategoryButtons() {
    if (!els.categoryNav) return;
    els.categoryNav.querySelectorAll('[data-category]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.category === state.category));
    });
  }

  function updateUrl(push = true) {
    const next = new URL(location.href);
    if (state.category === 'all') next.searchParams.delete('category');
    else next.searchParams.set('category', state.category);
    if (state.query) next.searchParams.set('q', state.query);
    else next.searchParams.delete('q');
    if (!isResultsMode() && state.month) next.searchParams.set('month', state.month);
    else next.searchParams.delete('month');
    const method = push ? 'pushState' : 'replaceState';
    history[method]({}, '', `${next.pathname}${next.search}${next.hash}`);
  }

  function syncFromUrl() {
    const current = new URLSearchParams(location.search);
    const requestedCategory = current.get('category');
    state.category = requestedCategory && categories.includes(requestedCategory) ? requestedCategory : 'all';
    state.query = (current.get('q') || '').trim();
    state.month = current.get('month') || '';
    state.visible = pageSize;
    if (els.searchInput) els.searchInput.value = state.query;
    updateCategoryButtons();
    renderView();
  }

  function announce(message) {
    if (els.status) els.status.textContent = message;
  }

  renderCategoryNav();

  if (els.categoryNav) {
    els.categoryNav.addEventListener('click', event => {
      const button = event.target.closest('[data-category]');
      if (!button) return;
      state.category = button.dataset.category || 'all';
      state.visible = pageSize;
      updateCategoryButtons();
      updateUrl(true);
      renderView();
    });
  }

  if (els.searchForm) {
    els.searchForm.addEventListener('submit', event => {
      event.preventDefault();
      state.query = (els.searchInput?.value || '').trim();
      state.visible = pageSize;
      updateUrl(true);
      renderView();
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
      renderView();
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

  syncFromUrl();
  initWeather();
})();