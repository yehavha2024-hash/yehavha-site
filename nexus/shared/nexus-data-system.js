(()=>{
  if (window.NexusData) return;

  const requestCache = new Map();
  const STYLE_ID = 'nexus-data-system-style';

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const link = document.createElement('link');
    link.id = STYLE_ID;
    link.rel = 'stylesheet';
    link.href = '/shared/nexus-data-system.css?v=20260907';
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
      if (!response.ok || !payload.ok || payload.upstreamStatus !== 200) {
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

  ensureStyle();
  window.NexusData = Object.freeze({
    query,
    records,
    renderGrid,
    renderIntelligence,
    recordCard,
    bilingualTitle,
    ensureStyle,
    clearCache(){ requestCache.clear(); }
  });
})();
