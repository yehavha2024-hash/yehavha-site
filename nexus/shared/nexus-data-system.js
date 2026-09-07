(()=>{
  if (window.NexusData) return;

  const requestCache = new Map();
  const STYLE_ID = 'nexus-data-system-style';

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const link = document.createElement('link');
    link.id = STYLE_ID;
    link.rel = 'stylesheet';
    link.href = '/shared/nexus-data-system.css?v=20260907-knowledge-1';
    document.head.append(link);
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function requestKey(source, params) {
    return `${source}?${new URLSearchParams(Object.entries(params || {}).filter(([, value]) => value !== undefined && value !== null)).toString()}`;
  }

  async function query(source, params = {}, options = {}) {
    const key = requestKey(source, params);
    if (!options.refresh && requestCache.has(key)) return requestCache.get(key);

    const task = (async()=>{
      const url = new URL('/api/public-data', location.origin);
      url.searchParams.set('source', source);
      for (const [name, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && String(value) !== '') url.searchParams.set(name, value);
      }
      const response = await fetch(url, { cache: options.refresh ? 'reload' : 'default' });
      const payload = await response.json();
      const upstreamFailed = payload.upstreamStatus !== undefined && payload.upstreamStatus !== 200;
      if (!response.ok || !payload.ok || upstreamFailed) {
        const error = new Error(`${source}: HTTP ${response.status}`);
        error.payload = payload;
        throw error;
      }
      return payload;
    })();

    requestCache.set(key, task);
    try {
      return await task;
    } catch (error) {
      requestCache.delete(key);
      throw error;
    }
  }

  async function records(source, params = {}, options = {}) {
    const payload = await query(source, params, options);
    return Array.isArray(payload.records) ? payload.records : [];
  }

  async function catalog(options = {}) {
    return query('catalog', {}, options);
  }

  async function knowledge(axis, options = {}) {
    const limit = Math.min(Math.max(Number(options.limit) || 12, 2), 48);
    const key = `knowledge:${axis}:${limit}`;
    if (!options.refresh && requestCache.has(key)) return requestCache.get(key);
    const task = (async()=>{
      const url = new URL('/api/nexus-knowledge', location.origin);
      url.searchParams.set('axis', axis);
      url.searchParams.set('limit', String(limit));
      const response = await fetch(url, { cache: options.refresh ? 'reload' : 'default' });
      let payload = null;
      try { payload = await response.json(); } catch { return null; }
      if (response.status === 503 && payload?.error === 'knowledge_store_not_bound') return null;
      if (!response.ok || !payload?.ok) return null;
      return payload;
    })();
    requestCache.set(key, task);
    try { return await task; }
    catch { requestCache.delete(key); return null; }
  }

  function titleNode(record, tag = 'h3') {
    const title = el(tag, 'nexus-data-title');
    title.append(el('span', 'nexus-title-ko', record?.title?.ko || '공공데이터'));
    if (record?.title?.en) title.append(el('span', 'nexus-title-en', record.title.en));
    return title;
  }

  function metadataLine(record) {
    const values = [record?.organization, record?.region, record?.date, record?.status].filter(Boolean);
    return values.length ? el('p', 'nexus-data-meta', values.join(' · ')) : null;
  }

  function recordCard(record, options = {}) {
    const card = el('article', `nexus-data-card${options.className ? ` ${options.className}` : ''}`);
    card.dataset.source = record?.source || '';
    card.append(titleNode(record));
    const meta = metadataLine(record);
    if (meta) card.append(meta);
    if (record?.summary) card.append(el('p', 'nexus-data-summary', record.summary));

    const tags = [record?.category, record?.status].filter(Boolean);
    if (tags.length) {
      const row = el('div', 'nexus-data-tags');
      for (const value of [...new Set(tags)]) row.append(el('span', 'nexus-data-tag', value));
      card.append(row);
    }

    if (record?.original_url) {
      const actions = el('div', 'nexus-data-actions');
      const link = el('a', '', options.linkLabel || '공식 원문 ↗');
      link.href = record.original_url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      actions.append(link);
      card.append(actions);
    }
    return card;
  }

  function renderGrid(host, rows, options = {}) {
    ensureStyle();
    const columns = Number(options.columns) === 4 ? 4 : 2;
    host.replaceChildren();
    host.classList.add('nexus-data-grid', `nexus-data-grid--${columns}`);
    for (const record of rows || []) host.append(recordCard(record, options));
    if (!host.childElementCount && options.emptyText) host.append(el('div', 'nexus-data-empty', options.emptyText));
    return host;
  }

  function intelligenceCard(intelligence) {
    ensureStyle();
    const box = el('section', 'nexus-intelligence-card');
    const briefing = intelligence?.briefing || {};
    const cells = [
      ['FACT', briefing.fact],
      ['ASSESSMENT', briefing.assessment],
      ['IMPACT', briefing.impact],
      ['WATCH', briefing.watch]
    ];
    for (const [label, text] of cells) {
      if (!text) continue;
      const cell = el('div', 'nexus-intelligence-cell');
      cell.append(el('strong', '', label), el('p', '', text));
      box.append(cell);
    }
    return box;
  }

  function renderIntelligence(host, intelligence) {
    host.replaceChildren(intelligenceCard(intelligence));
    return host;
  }

  function bilingualTitle(ko, en, tag = 'h2') {
    ensureStyle();
    return titleNode({ title: { ko, en } }, tag);
  }

  function routeAxis(pathname = location.pathname) {
    const path = String(pathname || '').toLowerCase();
    if (path.includes('/legal-intelligence')) return 'legal';
    if (path.includes('/local-government-planning')) return 'local-government';
    if (path.includes('/university') || path.includes('/edtech-research')) return 'education';
    if (path.includes('/intelligence-briefing') || path.includes('/investment-strategy')) return 'strategy';
    return '';
  }

  function knowledgeSourceCard(item) {
    const card = el('article', 'nexus-knowledge-source');
    const title = el('h3', 'nexus-data-title');
    title.append(el('span', 'nexus-title-ko', item?.headline || item?.source || '변화 감지'));
    if (item?.headline_en) title.append(el('span', 'nexus-title-en', item.headline_en));
    const counts = item?.delta?.counts || {};
    const meta = el('p', 'nexus-data-meta', `${item?.priority || 'NORMAL'} · ${item?.direction || 'baseline'} · 신규 ${counts.added || 0} · 변경 ${counts.changed || 0} · 소멸 ${counts.removed || 0}`);
    const body = el('p', 'nexus-data-summary', item?.assessment || item?.fact || '');
    card.append(title, meta, body);
    return card;
  }

  async function renderKnowledge(host, axis, options = {}) {
    ensureStyle();
    const payload = await knowledge(axis, options);
    const axisData = payload?.axes?.find((entry) => entry.axis === axis) || payload?.axes?.[0];
    if (!axisData || !payload?.stored_sources) return false;

    const panel = el('section', 'nexus-knowledge-panel');
    const head = el('div', 'nexus-knowledge-head');
    head.append(bilingualTitle('축적 지식 · 변화 동향', 'Accumulated Knowledge & Change Intelligence', 'h2'));
    head.append(el('p', 'nexus-data-meta', `${axisData.sources || 0}개 소스 · 변화 감지 ${axisData.changed_sources || 0}개 · 우선도 ${axisData.priority || 'NORMAL'}`));
    panel.append(head);

    const executive = el('div', 'nexus-knowledge-executive');
    renderIntelligence(executive, { briefing: axisData.executive || {} });
    panel.append(executive);

    const changed = (axisData.briefings || []).filter((item) => Number(item?.score || 0) > 0).slice(0, 4);
    if (changed.length) {
      const grid = el('div', 'nexus-knowledge-grid');
      for (const item of changed) grid.append(knowledgeSourceCard(item));
      panel.append(grid);
    }

    host.replaceChildren(panel);
    return true;
  }

  async function autoKnowledge() {
    if (document.querySelector('[data-nexus-knowledge-auto]')) return;
    const axis = routeAxis();
    const main = document.querySelector('main');
    if (!axis || !main) return;
    const host = el('div', 'nexus-knowledge-auto');
    host.dataset.nexusKnowledgeAuto = axis;
    const visible = await renderKnowledge(host, axis, { limit: 12 });
    if (visible) main.append(host);
  }

  ensureStyle();
  window.NexusData = Object.freeze({
    query,
    records,
    catalog,
    knowledge,
    renderGrid,
    renderIntelligence,
    renderKnowledge,
    recordCard,
    bilingualTitle,
    ensureStyle,
    routeAxis,
    clearCache(){ requestCache.clear(); }
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoKnowledge, { once: true });
  else queueMicrotask(autoKnowledge);
})();
