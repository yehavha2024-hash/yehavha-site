(() => {
  'use strict';

  const statsRoot = document.getElementById('ideaStats');
  const lifecycleRoot = document.getElementById('lifecycle');
  const filtersRoot = document.getElementById('categoryFilters');
  const boardRoot = document.getElementById('initiativeBoard');
  const boardCount = document.getElementById('boardCount');
  let activeFilter = 'all';
  let currentGroups = [];
  let currentItems = [];

  function make(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function formatDate(value) {
    return value ? String(value).replaceAll('-', '.') : '-';
  }

  function publicText(value) {
    return String(value || '')
      .replaceAll('ChatGPT·Suno·CapCut·GitHub·Cloudflare 등 반복 사용하는 도구', '반복 사용하는 제작·연구 서비스')
      .replaceAll('ChatGPT', '생성형 AI')
      .replaceAll('NotebookLM', '자료분석 서비스')
      .replaceAll('GitHub', '운영 저장소')
      .replaceAll('Cloudflare Pages', '웹 배포 환경')
      .replaceAll('Cloudflare', '웹 배포 환경');
  }

  function publicItem(item) {
    if (item.id !== 'ai-tool-budget') return item;
    return {
      ...item,
      meta: '운영 자원',
      title: '제작·연구 운영자원의 역할과 비용 정리',
      summary: '반복 사용하는 제작·연구 서비스를 주도·보조·배포 역할로 나누고 중복 비용과 사용 목적을 정리합니다.',
      nextAction: '실제로 매달 사용하는 서비스부터 비용·용도·대체 가능성을 기록합니다.'
    };
  }

  function visibleItems(items) {
    return items.filter(item => item.visibilityId !== 'private' && item.visibilityId !== 'embargo');
  }

  function renderStats(items) {
    const visible = visibleItems(items);
    const review = visible.filter(item => ['idea', 'review', 'planned'].includes(item.statusId)).length;
    const active = visible.filter(item => item.statusId === 'active').length;
    const done = visible.filter(item => ['completed', 'archived'].includes(item.statusId)).length;
    const stats = [
      ['ALL IDEAS', visible.length, '전체 등록'],
      ['TO DECIDE', review, '검토·계획'],
      ['IN MOTION', active, '실행 중'],
      ['DONE', done, '완료·보관']
    ];
    statsRoot.replaceChildren();
    stats.forEach(([label, value, title]) => {
      const card = make('div', 'idea-stat');
      card.append(make('span', 'idea-stat-label', label), make('strong', '', String(value)), make('small', '', title));
      statsRoot.append(card);
    });
  }

  function renderLifecycle(stages) {
    lifecycleRoot.replaceChildren();
    (stages || []).forEach((stage, index) => {
      const step = make('div', 'flow-step');
      step.append(make('span', 'flow-index', String(index + 1).padStart(2, '0')), make('div', 'flow-copy'));
      const copy = step.lastElementChild;
      copy.append(make('strong', '', stage.label), make('small', '', stage.title));
      lifecycleRoot.append(step);
    });
  }

  function groupMap(groups) {
    return new Map(groups.map(group => [group.id, group]));
  }

  function renderFilters(groups, items) {
    filtersRoot.replaceChildren();
    const visible = visibleItems(items);
    const buttons = [{ id: 'all', icon: '◈', title: '전체', count: visible.length }, ...groups.map(group => ({
      ...group,
      count: visible.filter(item => item.group === group.id).length
    }))];

    buttons.forEach(group => {
      const button = make('button', `filter-chip${activeFilter === group.id ? ' is-active' : ''}`);
      button.type = 'button';
      button.dataset.filter = group.id;
      if (group.id !== 'all') button.id = group.id;
      button.append(make('span', 'filter-icon', group.icon || '•'), make('span', 'filter-title', group.title), make('span', 'filter-count', String(group.count)));
      button.addEventListener('click', () => {
        activeFilter = group.id;
        renderFilters(currentGroups, currentItems);
        renderBoard(currentGroups, currentItems);
        history.replaceState(null, '', group.id === 'all' ? location.pathname : `#${group.id}`);
      });
      filtersRoot.append(button);
    });
  }

  function statusLabel(item) {
    const labels = { idea: '수집', review: '검토', planned: '계획', active: '실행', completed: '완료', archived: '보관' };
    return labels[item.statusId] || item.status || '검토';
  }

  function renderItem(rawItem, groupsById) {
    const item = publicItem(rawItem);
    const group = groupsById.get(item.group) || {};
    const article = make('article', 'idea-card');

    const head = make('div', 'idea-card-head');
    const groupTag = make('span', 'group-tag');
    groupTag.append(make('span', 'group-tag-icon', group.icon || '•'), document.createTextNode(group.title || item.group || '기타'));
    const state = make('span', `state-tag state-${item.statusId || 'review'}`, statusLabel(item));
    head.append(groupTag, state);

    const title = make('h3', '', publicText(item.title));
    const summary = make('p', 'idea-summary', publicText(item.summary));

    const meta = make('div', 'idea-meta');
    if (item.priority) meta.append(make('span', 'meta-chip', item.priority));
    if (item.meta) meta.append(make('span', 'meta-chip', publicText(item.meta)));
    if (item.visibility) meta.append(make('span', 'meta-chip meta-soft', item.visibility));

    article.append(head, title, summary, meta);

    if (item.nextAction) {
      const next = make('div', 'idea-next');
      next.append(make('span', '', 'NEXT'), make('p', '', publicText(item.nextAction)));
      article.append(next);
    }

    const foot = make('div', 'idea-foot');
    foot.append(make('span', '', `등록 ${formatDate(item.registeredAt)}`), make('span', '', `수정 ${formatDate(item.updatedAt)}`));
    article.append(foot);
    return article;
  }

  function renderBoard(groups, items) {
    const visible = visibleItems(items);
    const filtered = activeFilter === 'all' ? visible : visible.filter(item => item.group === activeFilter);
    const statusOrder = { active: 0, planned: 1, review: 2, idea: 3, completed: 4, archived: 5 };
    filtered.sort((a, b) => {
      const state = (statusOrder[a.statusId] ?? 9) - (statusOrder[b.statusId] ?? 9);
      if (state !== 0) return state;
      return String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''));
    });

    boardRoot.replaceChildren();
    if (boardCount) boardCount.textContent = `${filtered.length}개 항목`;
    if (!filtered.length) {
      boardRoot.append(make('div', 'empty-state', '이 분류에는 아직 공개 등록된 아이디어가 없습니다. 새 생각은 먼저 아이디어 인박스에 등록합니다.'));
      return;
    }
    const groupsById = groupMap(groups);
    filtered.forEach(item => boardRoot.append(renderItem(item, groupsById)));
  }

  function applyHashFilter(groups) {
    const hash = location.hash.replace('#', '');
    if (hash && groups.some(group => group.id === hash)) activeFilter = hash;
  }

  async function load() {
    try {
      const response = await fetch('./data.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      currentGroups = Array.isArray(data.groups) ? data.groups : [];
      currentItems = Array.isArray(data.items) ? data.items : [];
      applyHashFilter(currentGroups);
      renderStats(currentItems);
      renderLifecycle(Array.isArray(data.lifecycle) ? data.lifecycle : []);
      renderFilters(currentGroups, currentItems);
      renderBoard(currentGroups, currentItems);
    } catch (error) {
      console.error('Idea hub load failed:', error);
      boardRoot.replaceChildren(make('div', 'empty-state', '아이디어 데이터를 불러오지 못했습니다.'));
    }
  }

  load();
})();
