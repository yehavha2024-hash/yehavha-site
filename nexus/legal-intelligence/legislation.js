(() => {
  'use strict';

  const LEGISLATION_URL = './legislation.json';
  const PEOPLE_URL = './legal-people.json';
  const MATERIALS_URL = './legal-materials.json';

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
    if (record.sourceType === 'assembly') return `국회 ${record.sourceId}`;
    return record.officialLbicId ? `정부 ${record.officialLbicId}` : `정부 ${record.sourceId}`;
  }

  function metaItems(record) {
    if (record.sourceType === 'assembly') {
      return [
        ['현재 단계', record.statusLabel],
        ['소관위원회', record.committee || '-'],
        ['상태 기준일', formatDate(record.statusDate)],
        ['제안자', record.proposer || '-'],
        ['제안일', formatDate(record.proposedAt)],
        ['의안번호', record.sourceId]
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

  function usefulSummary(record) {
    const summary = String(record.summary || '').trim();
    const generic = /공식 (국회|정부|법제처).*자동 선별|공식 공개자료에서 .* 확인된/.test(summary);
    if (!generic && summary) return summary;
    if (record.mainContent) return record.mainContent;
    if (record.amendmentReason) return record.amendmentReason;
    const topics = Array.isArray(record.topics) ? record.topics.join(' · ') : '';
    return topics ? `${topics} 영역과 직접 연결되는 입법으로 현재 ${record.statusLabel || '진행상태'} 단계입니다.` : summary;
  }

  function appendHistory(card, record) {
    const history = Array.isArray(record.history) ? record.history.filter(item => item?.date && item?.stage) : [];
    const stages = Array.isArray(record.processStages) ? record.processStages : [];
    const documents = Array.isArray(record.documents) ? record.documents : [];
    const hasGovernmentContent = record.mainContent || record.amendmentReason || record.legislativePlan || documents.length;
    if (!history.length && !stages.length && !hasGovernmentContent) return;

    const detail = el('details', 'tracker-detail');
    detail.append(el('summary', '', record.sourceType === 'government' ? '핵심내용·추진경과' : '추진경과 보기'));
    if (record.mainContent) detail.append(el('p', 'tracker-detail-row', `주요내용 · ${record.mainContent}`));
    if (record.amendmentReason) detail.append(el('p', 'tracker-detail-row', `제·개정이유 · ${record.amendmentReason}`));
    if (record.legislativePlan) detail.append(el('p', 'tracker-detail-row', `입법계획·정비의견 · ${record.legislativePlan}`));

    if (history.length) {
      const list = el('div', 'tracker-stage-list');
      for (const item of history.slice(-10)) list.append(el('p', 'tracker-detail-row', `${formatDate(item.date)} · ${item.stage}`));
      detail.append(list);
    }
    if (stages.length) {
      const list = el('div', 'tracker-stage-list');
      for (const item of stages.slice(-10)) {
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
    card.append(head, el('p', '', usefulSummary(record)));
    const fields = el('div', 'field-grid');
    for (const [label, value] of metaItems(record)) {
      const item = el('span');
      item.append(el('b', '', label), document.createTextNode(value || '-'));
      fields.append(item);
    }
    card.append(fields);
    appendHistory(card, record);
    const tags = el('div', 'tag-row');
    for (const topic of record.topics || []) tags.append(el('span', '', topic));
    if (tags.childElementCount) card.append(tags);
    if (record.sourceUrl) {
      const actions = el('div', 'source-actions');
      const source = el('a', '', '공식 원문·진행상황 ↗');
      source.href = record.sourceUrl;
      source.target = '_blank';
      source.rel = 'noopener noreferrer';
      actions.append(source);
      card.append(actions);
    }
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

  function appendSummaryCell(host, label, value) {
    const cell = el('div', 'summary-cell');
    cell.append(el('b', '', label), el('span', '', value));
    host.append(cell);
  }

  function renderLegislationSummary(records, data) {
    const host = document.getElementById('legislation-live-summary');
    if (!host) return;
    host.replaceChildren();
    const assembly = records.filter(record => record.sourceType === 'assembly');
    const government = records.filter(record => record.sourceType === 'government');
    const latest = records.map(record => record.statusDate).filter(Boolean).sort().at(-1) || data.updatedAt || '';
    const topicCounts = new Map();
    for (const record of records) for (const topic of record.topics || []) topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
    const leadingTopic = [...topicCounts.entries()].sort((a, b) => b[1] - a[1])[0];
    appendSummaryCell(host, '선별 추적', `${records.length}건`);
    appendSummaryCell(host, '국회 / 정부', `${assembly.length} / ${government.length}건`);
    appendSummaryCell(host, '최근 상태변경', formatDate(latest));
    appendSummaryCell(host, '최다 관심영역', leadingTopic ? `${leadingTopic[0]} ${leadingTopic[1]}건` : '-');
  }

  function renderLegislation(data) {
    const section = document.getElementById('legislation-tracker');
    const anchor = section?.querySelector('.watch-wrap');
    if (!section || !anchor) return;
    section.querySelectorAll('[data-live-legislation]').forEach(node => node.remove());
    const records = (Array.isArray(data.records) ? data.records : [])
      .filter(record => record && record.active !== false)
      .sort((a, b) => String(b.statusDate || '').localeCompare(String(a.statusDate || '')));
    renderLegislationSummary(records, data);
    const assembly = records.filter(record => record.sourceType === 'assembly');
    const government = records.filter(record => record.sourceType === 'government');
    const host = el('div');
    host.dataset.liveLegislation = 'true';
    const info = el('div', 'exclusion-note');
    info.append(
      el('strong', '', `데이터 기준 ${formatDate(data.updatedAt)}`),
      el('span', '', '의안번호와 정부입법 식별자를 기준으로 중복을 통제하고, 동일 법안의 새 심사단계는 기존 기록의 추진경과에 누적합니다.')
    );
    host.append(info);
    if (assembly.length) host.append(renderGroup('국회 입법 · 선별 추적', '법안의 제안 취지와 소관위원회, 현재 심사단계, 날짜별 추진경과를 같은 카드에서 확인합니다.', assembly));
    if (government.length) host.append(renderGroup('정부 입법 · 선별 추적', '정부입법 목록·상세자료에서 소관부처, 제·개정이유, 세부 심사단계와 법령안 파일을 연결합니다.', government));
    anchor.insertAdjacentElement('afterend', host);
  }

  function materialTypeDescription(type) {
    if (type === '판례') return '대법원 중요판결 가운데 계약·손해배상·절차·시장질서 등 NEXUS 연구와 직접 연결되는 판결입니다.';
    if (type === '헌재결정') return '헌법재판소의 최근 주요결정 가운데 기본권·입법의무·교육·플랫폼 규제 쟁점을 선별했습니다.';
    if (type === '법령') return '현재 시행 중이거나 시행이 확정된 핵심 법령을 시행일과 연구 포인트 중심으로 정리했습니다.';
    return '법제·AI·데이터·에듀테크·연구윤리 분야의 공식 연구보고서를 연구 쟁점과 함께 연결했습니다.';
  }

  function renderMaterialCard(record) {
    const card = el('article', 'material-card');
    const top = el('div', 'material-top');
    top.append(el('span', `material-type material-${record.type === '법령' ? 'statute' : record.type === '연구자료' ? 'research' : 'case'}`, record.type), el('span', 'material-source', record.source || '공식자료'));
    card.append(top, el('h3', '', record.title || ''));
    const reference = el('p', 'material-reference');
    reference.textContent = [record.reference, formatDate(record.date), record.result].filter(Boolean).join(' · ');
    card.append(reference, el('p', 'material-summary', record.summary || ''));
    if (record.legalPoint) {
      const point = el('div', 'material-point');
      point.append(el('b', '', '연구 포인트'), el('span', '', record.legalPoint));
      card.append(point);
    }
    const tags = el('div', 'people-live-tags');
    for (const topic of record.topics || []) tags.append(el('span', '', topic));
    if (tags.childElementCount) card.append(tags);
    if (record.sourceUrl) {
      const actions = el('div', 'source-actions');
      const link = el('a', '', record.type === '연구자료' ? '연구보고서 원문 ↗' : '공식 원문 ↗');
      link.href = record.sourceUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      actions.append(link);
      card.append(actions);
    }
    return card;
  }

  function renderMaterials(data) {
    document.querySelectorAll('[data-legal-materials]').forEach(node => node.remove());
    const anchor = document.getElementById('research-analysis');
    if (!anchor) return;
    const records = (Array.isArray(data.records) ? data.records : [])
      .filter(record => record && record.active !== false)
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')) || String(a.title || '').localeCompare(String(b.title || '')));

    const section = el('section', 'legal-section section-soft legal-materials-section');
    section.dataset.legalMaterials = 'true';
    section.id = 'legal-materials';
    const container = el('div', 'container');
    const head = el('div', 'legal-section-head');
    head.append(el('p', 'legal-eyebrow', 'CURATED LAW & RESEARCH'), el('h2', '', '판례·법령·연구자료 실제 데이터'), el('p', '', '제목만 나열하지 않고 사건번호·시행일·핵심쟁점·연구 포인트와 공식 원문을 함께 제공합니다.'));
    container.append(head);

    const counts = new Map();
    for (const record of records) counts.set(record.type, (counts.get(record.type) || 0) + 1);
    const summary = el('div', 'live-summary');
    appendSummaryCell(summary, '전체 선별', `${records.length}건`);
    appendSummaryCell(summary, '판례·헌재', `${(counts.get('판례') || 0) + (counts.get('헌재결정') || 0)}건`);
    appendSummaryCell(summary, '현행·예정 법령', `${counts.get('법령') || 0}건`);
    appendSummaryCell(summary, '연구자료', `${counts.get('연구자료') || 0}건`);
    container.append(summary);

    for (const type of ['판례', '헌재결정', '법령', '연구자료']) {
      const group = records.filter(record => record.type === type);
      if (!group.length) continue;
      const wrap = el('div', 'material-group');
      const groupHead = el('div', 'tracker-head');
      groupHead.append(el('span', '', `${group.length}건`), el('h3', '', type === '판례' ? '대법원 중요판례' : type === '헌재결정' ? '헌법재판소 주요결정' : type === '법령' ? '현행·시행예정 핵심법령' : '법률·AI 연구자료'));
      wrap.append(groupHead, el('p', 'material-group-description', materialTypeDescription(type)));
      const grid = el('div', 'material-grid');
      for (const record of group) grid.append(renderMaterialCard(record));
      wrap.append(grid);
      container.append(wrap);
    }

    const note = el('div', 'exclusion-note');
    note.append(el('strong', '', `자료 기준 ${formatDate(data.updatedAt)}`), el('span', '', '법적 판단이 필요한 경우에는 반드시 연결된 법원·헌법재판소·국가법령정보센터·연구기관의 공식 원문과 최신 시행일을 다시 확인합니다.'));
    container.append(note);
    section.append(container);
    anchor.insertAdjacentElement('beforebegin', section);
  }

  function renderPeopleCard(record) {
    const card = el('article', 'people-live-card');
    const top = el('div', 'people-live-top');
    top.append(el('span', 'people-live-category', record.category || '법조계'), el('span', 'people-live-source', record.source || '공개자료'));
    card.append(top, el('h3', '', record.title || ''));
    const date = record.effectiveAt ? `발표 ${formatDate(record.publishedAt)} · 시행 ${formatDate(record.effectiveAt)}` : `기준 ${formatDate(record.publishedAt)}`;
    card.append(el('p', 'people-live-date', date), el('p', 'people-live-summary', record.summary || '공식 공개자료의 주요 내용을 확인합니다.'));
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

  function renderPeopleSummary(records, data) {
    const host = document.getElementById('people-live-summary');
    if (!host) return;
    host.replaceChildren();
    const counts = new Map();
    for (const record of records) counts.set(record.category || '기타', (counts.get(record.category || '기타') || 0) + 1);
    const latest = records.map(record => record.publishedAt).filter(Boolean).sort().at(-1) || data.updatedAt || '';
    appendSummaryCell(host, '선별 동향', `${records.length}건`);
    appendSummaryCell(host, '인사 / 이동·개업', `${counts.get('인사') || 0} / ${counts.get('이동·개업') || 0}건`);
    appendSummaryCell(host, '연구·학술 / 시장', `${counts.get('연구·학술') || 0} / ${counts.get('법률시장') || 0}건`);
    appendSummaryCell(host, '최근 공개자료', formatDate(latest));
  }

  function renderLegalPeople(data) {
    const section = document.getElementById('legal-people');
    const anchor = section?.querySelector('.exclusion-note');
    if (!section || !anchor) return;
    section.querySelectorAll('[data-live-legal-people]').forEach(node => node.remove());
    const records = (Array.isArray(data.records) ? data.records : [])
      .filter(record => record && record.active !== false)
      .sort((a, b) => String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')))
      .slice(0, 20);
    renderPeopleSummary(records, data);
    const host = el('div', 'legal-people-live');
    host.dataset.liveLegalPeople = 'true';
    const info = el('div', 'exclusion-note people-live-info');
    info.append(el('strong', '', `데이터 기준 ${formatDate(data.updatedAt)}`), el('span', '', '공식기관·변호사단체·주요 로펌의 공개자료를 정기 확인하고, 동일 URL·동일 제목은 기존 기록을 갱신합니다.'));
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
    const [legislationResult, peopleResult, materialsResult] = await Promise.allSettled([
      loadJson(LEGISLATION_URL),
      loadJson(PEOPLE_URL),
      loadJson(MATERIALS_URL)
    ]);

    if (legislationResult.status === 'fulfilled') renderLegislation(legislationResult.value);
    else {
      console.error('LEGAL INTELLIGENCE legislation data load failed:', legislationResult.reason);
      renderLoadError('legislation-tracker', '.watch-wrap', 'liveLegislation', '선별 입법 데이터를 불러오지 못했습니다. 공식 원천 링크는 계속 사용할 수 있습니다.');
    }

    if (peopleResult.status === 'fulfilled') renderLegalPeople(peopleResult.value);
    else {
      console.error('LEGAL INTELLIGENCE people data load failed:', peopleResult.reason);
      renderLoadError('legal-people', '.exclusion-note', 'liveLegalPeople', '법조계 동향 데이터를 불러오지 못했습니다. 공식 원천 확인은 계속 가능합니다.');
    }

    if (materialsResult.status === 'fulfilled') renderMaterials(materialsResult.value);
    else console.error('LEGAL INTELLIGENCE curated material data load failed:', materialsResult.reason);
  }

  load();
})();
