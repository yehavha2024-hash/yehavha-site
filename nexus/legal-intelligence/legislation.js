(() => {
  'use strict';

  const LEGISLATION_URL = './legislation.json';
  const PEOPLE_URL = './legal-people.json';

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
      ['소관부서', record.department || '-'],
      ['법령종류', record.lawType || '-'],
      ['제·개정형태', record.revisionType || '-'],
      ['상태 기준일', formatDate(record.statusDate)]
    ];
  }

  function appendGovernmentDetails(card, record) {
    const stages = Array.isArray(record.processStages) ? record.processStages : [];
    const documents = Array.isArray(record.documents) ? record.documents : [];
    if (!record.mainContent && !record.amendmentReason && !record.legislativePlan && !stages.length && !documents.length) return;

    const detail = el('details', 'tracker-detail');
    detail.append(el('summary', '', '상세 내용·추진경과'));
    if (record.mainContent) detail.append(el('p', 'tracker-detail-row', `주요내용 · ${record.mainContent}`));
    if (record.amendmentReason) detail.append(el('p', 'tracker-detail-row', `제개정이유 · ${record.amendmentReason}`));
    if (record.legislativePlan) detail.append(el('p', 'tracker-detail-row', `입법계획·정비의견 · ${record.legislativePlan}`));

    if (stages.length) {
      const list = el('div', 'tracker-stage-list');
      for (const item of stages.slice(-8)) {
        const label = [item.phase, item.stage, item.status].filter(Boolean).join(' · ');
        if (label) list.append(el('p', 'tracker-detail-row', label));
      }
      detail.append(list);
    }

    if (documents.length) {
      const actions = el('div', 'source-actions');
      for (const document of documents.slice(0, 3)) {
        if (!document.url) continue;
        const link = el('a', '', `${document.name || '법령안 파일'} ↗`);
        link.href = document.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        actions.append(link);
      }
      if (actions.childElementCount) detail.append(actions);
    }
    card.append(detail);
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

    if (record.sourceType === 'government') appendGovernmentDetails(card, record);

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

  function renderLegislation(data) {
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

    if (assembly.length) host.append(renderGroup('국회 입법 · 선별 추적', 'NEXUS 관심영역과 직접 연결되는 국회 법률안을 의안번호 기준으로 추적합니다.', assembly));
    if (government.length) host.append(renderGroup('정부 입법 · 선별 추적', '정부입법 lbicId를 기준으로 목록·상세 API의 추진단계와 주요내용을 함께 추적합니다.', government));

    anchor.insertAdjacentElement('afterend', host);
  }

  function renderPeopleCard(record) {
    const card = el('article', 'people-live-card');
    const top = el('div', 'people-live-top');
    top.append(el('span', 'people-live-category', record.category || '법조계'), el('span', 'people-live-source', record.source || '공개자료'));
    card.append(top, el('h3', '', record.title || ''));

    const date = record.effectiveAt
      ? `발표 ${formatDate(record.publishedAt)} · 시행 ${formatDate(record.effectiveAt)}`
      : `기준 ${formatDate(record.publishedAt)}`;
    card.append(el('p', 'people-live-date', date), el('p', 'people-live-summary', record.summary || ''));

    const tags = el('div', 'people-live-tags');
    for (const tag of record.tags || []) tags.append(el('span', '', tag));
    if (tags.childElementCount) card.append(tags);

    if (record.sourceUrl) {
      const actions = el('div', 'source-actions');
      const link = el('a', '', '공식 원문 ↗');
      link.href = record.sourceUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      actions.append(link);
      card.append(actions);
    }
    return card;
  }

  function renderLegalPeople(data) {
    const section = document.getElementById('legal-people');
    const anchor = section?.querySelector('.exclusion-note');
    if (!section || !anchor) return;
    section.querySelectorAll('[data-live-legal-people]').forEach(node => node.remove());

    const records = (Array.isArray(data.records) ? data.records : [])
      .filter(record => record && record.active !== false)
      .sort((a, b) => String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')))
      .slice(0, 16);

    const host = el('div', 'legal-people-live');
    host.dataset.liveLegalPeople = 'true';
    const info = el('div', 'exclusion-note people-live-info');
    info.append(
      el('strong', '', `선별 동향 ${records.length}건`),
      el('span', '', `데이터 기준 ${formatDate(data.updatedAt)} · 법원·검찰·헌재·변호사단체·학술 공개자료를 갱신하며 경조사와 가십은 제외합니다.`)
    );
    host.append(info);

    const grid = el('div', 'legal-people-live-grid');
    for (const record of records) grid.append(renderPeopleCard(record));
    host.append(grid);
    anchor.insertAdjacentElement('afterend', host);
  }

  function renderLoadError(sectionId, anchorSelector, type, message) {
    const section = document.getElementById(sectionId);
    const anchor = section?.querySelector(anchorSelector);
    if (!anchor) return;
    const note = el('div', 'exclusion-note');
    note.dataset[type] = 'true';
    note.append(el('strong', '', '데이터'), el('span', '', message));
    anchor.insertAdjacentElement('afterend', note);
  }

  async function loadJson(url) {
    const response = await fetch(url, {cache: 'no-store'});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  async function load() {
    const [legislationResult, peopleResult] = await Promise.allSettled([
      loadJson(LEGISLATION_URL),
      loadJson(PEOPLE_URL)
    ]);

    if (legislationResult.status === 'fulfilled') {
      renderLegislation(legislationResult.value);
    } else {
      console.error('LEGAL INTELLIGENCE legislation data load failed:', legislationResult.reason);
      renderLoadError('legislation-tracker', '.watch-wrap', 'liveLegislation', '선별 입법 데이터를 불러오지 못했습니다. 공식 원천 링크는 계속 사용할 수 있습니다.');
    }

    if (peopleResult.status === 'fulfilled') {
      renderLegalPeople(peopleResult.value);
    } else {
      console.error('LEGAL INTELLIGENCE people data load failed:', peopleResult.reason);
      renderLoadError('legal-people', '.exclusion-note', 'liveLegalPeople', '법조계 동향 데이터를 불러오지 못했습니다. 공식 원천 확인은 계속 가능합니다.');
    }
  }

  load();
})();
