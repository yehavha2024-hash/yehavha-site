(() => {
  'use strict';

  const DATA_URL = './legislation.json';

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function formatDate(value) {
    return value ? String(value).replaceAll('-', '.') : '-';
  }

  function sourceLabel(record) {
    return record.sourceType === 'assembly' ? `국회 ${record.sourceId}` : `정부 ${record.sourceId}`;
  }

  function metaItems(record) {
    if (record.sourceType === 'assembly') {
      return [
        ['현재 단계', record.statusLabel],
        ['소관위원회', record.committee || '-'],
        ['상태 기준일', formatDate(record.statusDate)],
        ['제안자', record.proposer || '-'],
        ['제안일', formatDate(record.proposedAt)],
        ['레코드 키', record.recordKey]
      ];
    }
    return [
      ['현재 단계', record.statusLabel],
      ['소관부처', record.ministry || '-'],
      ['법령종류', record.lawType || '-'],
      ['예고 시작', formatDate(record.noticeStart)],
      ['예고 종료', formatDate(record.noticeEnd)],
      ['공고번호', record.announcementNo || '-']
    ];
  }

  function renderRecord(record) {
    const card = el('article', 'tracker-panel');
    const head = el('div', 'tracker-head');
    head.append(el('span', '', sourceLabel(record)), el('h3', '', record.title));
    card.append(head, el('p', '', record.summary || ''));

    const fields = el('div', 'field-grid');
    for (const [label, value] of metaItems(record)) {
      const item = el('span');
      item.append(el('b', '', label), document.createTextNode(value || '-'));
      fields.append(item);
    }
    card.append(fields);

    const tags = el('div', 'tag-row');
    for (const topic of record.topics || []) tags.append(el('span', '', topic));
    if (tags.childElementCount) card.append(tags);

    const actions = el('div', 'source-actions');
    const source = el('a', '', '공식 원문·진행상황 ↗');
    source.href = record.sourceUrl;
    source.target = '_blank';
    source.rel = 'noopener noreferrer';
    actions.append(source);
    card.append(actions);
    return card;
  }

  function renderGroup(title, description, records) {
    const wrap = el('div', 'watch-wrap');
    const head = el('div', 'tracker-head');
    head.append(el('span', '', 'LIVE'), el('h3', '', title));
    wrap.append(head, el('p', '', description));
    const grid = el('div', 'legislation-grid');
    for (const record of records) grid.append(renderRecord(record));
    wrap.append(grid);
    return wrap;
  }

  function render(data) {
    const section = document.getElementById('legislation-tracker');
    const anchor = section?.querySelector('.watch-wrap');
    if (!section || !anchor) return;

    section.querySelectorAll('[data-live-legislation]').forEach(node => node.remove());

    const records = (Array.isArray(data.records) ? data.records : [])
      .filter(record => record && record.active !== false)
      .sort((a, b) => String(b.statusDate || '').localeCompare(String(a.statusDate || '')));

    const assembly = records.filter(record => record.sourceType === 'assembly');
    const government = records.filter(record => record.sourceType === 'government');
    const host = el('div');
    host.dataset.liveLegislation = 'true';

    const info = el('div', 'exclusion-note');
    info.append(
      el('strong', '', `선별 추적 ${records.length}건`),
      el('span', '', `데이터 기준 ${formatDate(data.updatedAt)} · 동일 의안번호·정부입법 식별자는 새 항목을 만들지 않고 기존 레코드를 갱신합니다.`)
    );
    host.append(info);

    if (assembly.length) {
      host.append(renderGroup('국회 입법 · 선별 추적', 'NEXUS 관심영역과 직접 연결되는 국회 법률안을 의안번호 기준으로 추적합니다.', assembly));
    }
    if (government.length) {
      host.append(renderGroup('정부 입법 · 선별 추적', '현재 입법예고 또는 후속 절차를 진행 중인 정부 법령안을 정부입법 식별자 기준으로 추적합니다.', government));
    }

    anchor.insertAdjacentElement('afterend', host);
  }

  async function load() {
    try {
      const response = await fetch(DATA_URL, {cache: 'no-store'});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      render(data);
    } catch (error) {
      console.error('LEGAL INTELLIGENCE legislation data load failed:', error);
      const section = document.getElementById('legislation-tracker');
      const anchor = section?.querySelector('.watch-wrap');
      if (!anchor) return;
      const note = el('div', 'exclusion-note');
      note.dataset.liveLegislation = 'true';
      note.append(el('strong', '', '입법 데이터'), el('span', '', '선별 입법 데이터를 불러오지 못했습니다. 공식 원천 링크는 계속 사용할 수 있습니다.'));
      anchor.insertAdjacentElement('afterend', note);
    }
  }

  load();
})();
