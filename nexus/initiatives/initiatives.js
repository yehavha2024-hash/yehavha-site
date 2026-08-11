(() => {
  'use strict';

  const links = document.getElementById('initiativeLinks');
  const lifecycle = document.getElementById('lifecycle');
  const visibility = document.getElementById('visibility');
  const groupsRoot = document.getElementById('initiativeGroups');

  function make(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function formatDate(value) {
    return value ? String(value).replaceAll('-', '.') : '-';
  }

  function renderLifecycle(stages) {
    lifecycle.replaceChildren();
    stages.forEach((stage, index) => {
      const chip = make('div', 'stage');
      chip.append(make('strong', '', stage.label), make('span', '', stage.title));
      lifecycle.append(chip);
      if (index < stages.length - 1) lifecycle.append(make('span', 'stage-arrow', '→'));
    });
  }

  function renderVisibility(items) {
    visibility.replaceChildren();
    items.forEach((item) => {
      const block = make('div', 'visibility-item');
      block.append(make('strong', '', item.label), make('span', '', item.description));
      visibility.append(block);
    });
  }

  function renderLinks(groups) {
    links.replaceChildren();
    groups.slice(0, 7).forEach((group) => {
      const a = make('a', '', group.title);
      a.href = `#${group.id}`;
      links.append(a);
    });
  }

  function renderItem(item) {
    const article = make('article', 'initiative-item');
    const badges = make('div', 'item-badges');
    badges.append(
      make('span', 'badge', item.meta || 'Initiative'),
      make('span', 'badge badge-status', item.status || 'REVIEW'),
      make('span', `badge${item.visibilityId === 'public' ? ' badge-public' : ''}`, item.visibility || 'SUMMARY')
    );
    article.append(badges, make('h3', '', item.title), make('p', '', item.summary || ''));

    const record = make('div', 'item-record');
    const registered = make('div', 'record');
    registered.append(make('strong', '', '등록'), make('span', '', formatDate(item.registeredAt)));
    const updated = make('div', 'record');
    updated.append(make('strong', '', '최근 수정'), make('span', '', formatDate(item.updatedAt)));
    record.append(registered, updated);
    article.append(record);

    if (item.nextAction) {
      const next = make('p', 'next-action');
      next.append(make('strong', '', '다음 행동 · '), document.createTextNode(item.nextAction));
      article.append(next);
    }
    return article;
  }

  function renderGroups(groups, items) {
    groupsRoot.replaceChildren();
    groups.forEach((group) => {
      const section = make('section', 'initiative-group');
      section.id = group.id;
      section.setAttribute('aria-labelledby', `${group.id}-title`);

      const head = make('div', 'initiative-group-head');
      head.append(make('div', 'group-number', group.number));
      const copy = make('div', '');
      copy.append(make('p', 'eyebrow', group.eyebrow), make('h2', '', group.title), make('p', 'group-description', group.description));
      copy.querySelector('h2').id = `${group.id}-title`;
      head.append(copy);

      const grid = make('div', 'initiative-items');
      const groupItems = items.filter((item) => item.group === group.id && item.visibilityId !== 'private' && item.visibilityId !== 'embargo');
      if (groupItems.length) groupItems.forEach((item) => grid.append(renderItem(item)));
      else grid.append(make('div', 'empty-state', '등록된 공개 항목이 없습니다.'));

      section.append(head, grid);
      groupsRoot.append(section);
    });
  }

  async function load() {
    try {
      const response = await fetch('./data.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const groups = Array.isArray(data.groups) ? data.groups : [];
      const items = Array.isArray(data.items) ? data.items : [];
      renderLinks(groups);
      renderLifecycle(Array.isArray(data.lifecycle) ? data.lifecycle : []);
      renderVisibility(Array.isArray(data.visibility) ? data.visibility : []);
      renderGroups(groups, items);
    } catch (error) {
      console.error('Open Initiatives load failed:', error);
      groupsRoot.replaceChildren(make('section', 'initiative-group', '운영 데이터를 불러오지 못했습니다.'));
    }
  }

  load();
})();
