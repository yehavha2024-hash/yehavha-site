(() => {
  'use strict';

  const data = window.LIVING_LAW_DATA;
  if (!data) return;

  const categoryMap = new Map(data.categories.map((item) => [item.id, item]));
  const $ = (selector, root = document) => root.querySelector(selector);
  const make = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  };

  const searchInput = $('#lawSearch');
  const categoryFilters = $('#categoryFilters');
  const resultCount = $('#resultCount');
  const cards = $('#lawCards');
  const empty = $('#emptyState');
  const dialog = $('#lawDialog');
  const dialogBody = $('#dialogBody');
  const closeDialog = $('#closeDialog');
  const resetFilters = $('#resetFilters');
  let activeCategory = 'all';
  let query = '';

  function normal(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function searchable(item) {
    return normal([
      item.n,item.title,item.summary,item.now,item.route,item.caution,
      ...(item.evidence || []),...(item.laws || []),categoryMap.get(item.category)?.title
    ].join(' '));
  }

  function filteredItems() {
    return data.items.filter((item) => {
      const categoryOk = activeCategory === 'all' || item.category === activeCategory;
      const queryOk = !query || searchable(item).includes(query);
      return categoryOk && queryOk;
    });
  }

  function renderFilters() {
    categoryFilters.replaceChildren();
    const all = [{id:'all',icon:'◎',title:'전체',count:data.items.length}, ...data.categories.map((category) => ({
      ...category,
      count:data.items.filter((item) => item.category === category.id).length
    }))];
    all.forEach((category) => {
      const button = make('button', `filter-chip${activeCategory === category.id ? ' active' : ''}`);
      button.type = 'button';
      button.dataset.category = category.id;
      button.append(
        make('span','filter-icon',category.icon || '•'),
        make('span','filter-title',category.title),
        make('span','filter-count',String(category.count))
      );
      button.addEventListener('click', () => {
        activeCategory = category.id;
        renderFilters();
        renderCards();
      });
      categoryFilters.append(button);
    });
  }

  function makePreview(item) {
    const category = categoryMap.get(item.category) || {};
    const article = make('article', 'law-card');
    const top = make('div','law-card-top');
    const number = make('span','law-number',String(item.n).padStart(3,'0'));
    const badges = make('div','law-badges');
    badges.append(make('span','law-category',category.title || item.category));
    if (item.hot) badges.append(make('span','hot-badge','핵심'));
    top.append(number,badges);
    const title = make('h3','',item.title);
    const summary = make('p','law-summary',item.summary);
    const quick = make('div','quick-action');
    quick.append(make('span','quick-label','먼저'),make('p','',item.now));
    const law = make('div','law-basis-preview');
    law.append(make('span','quick-label','근거'),make('p','',(item.laws || []).slice(0,2).join(' · ')));
    const button = make('button','detail-button','대응방법 보기');
    button.type = 'button';
    button.addEventListener('click', () => openDetail(item));
    article.append(top,title,summary,quick,law,button);
    return article;
  }

  function renderCards() {
    const list = filteredItems();
    cards.replaceChildren();
    resultCount.textContent = `${list.length}개 항목`;
    empty.hidden = list.length > 0;
    list.forEach((item) => cards.append(makePreview(item)));
  }

  function section(title, content, className='detail-section') {
    const block = make('section', className);
    block.append(make('h4','',title));
    if (typeof content === 'string') block.append(make('p','',content));
    else if (content) block.append(content);
    return block;
  }

  function listNode(items) {
    const list = make('ul','detail-list');
    (items || []).forEach((item) => list.append(make('li','',item)));
    return list;
  }

  function sourceLinks(item) {
    const row = make('div','source-links');
    const used = new Set();
    (item.sources || []).forEach((key) => {
      if (used.has(key)) return;
      const source = data.sources[key];
      if (!source) return;
      used.add(key);
      const link = make('a','',`${source.label} ↗`);
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      row.append(link);
    });
    return row;
  }

  function openDetail(item) {
    const category = categoryMap.get(item.category) || {};
    dialogBody.replaceChildren();
    const header = make('header','dialog-header');
    const meta = make('div','dialog-meta');
    meta.append(make('span','law-number',String(item.n).padStart(3,'0')),make('span','law-category',category.title || item.category));
    if (item.hot) meta.append(make('span','hot-badge','핵심'));
    header.append(meta,make('h2','',item.title),make('p','dialog-summary',item.summary));

    const action = make('div','action-panel');
    action.append(make('strong','','지금 할 일'),make('p','',item.now));

    dialogBody.append(
      header,
      action,
      section('확보할 자료·증거',listNode(item.evidence)),
      section('법률 분류·핵심 근거',listNode(item.laws)),
      section('접수·문의·다음 절차',item.route),
      section('주의할 점',item.caution,'detail-section caution-section'),
      section('공식 확인처',sourceLinks(item))
    );

    const note = make('p','dialog-disclaimer','이 항목은 일반적인 생활법률 정보입니다. 실제 결론은 계약내용·증거·당사자 관계·사건일 당시 시행법에 따라 달라질 수 있습니다. 중요한 기한, 고액 손해, 형사사건, 신변위험, 보전처분·항소 등은 해당 업무범위의 자격전문가 또는 공식기관 확인이 필요합니다.');
    dialogBody.append(note);
    if (typeof dialog.showModal === 'function') dialog.showModal();
  }

  function close() {
    if (dialog.open) dialog.close();
  }

  searchInput.addEventListener('input', (event) => {
    query = normal(event.target.value);
    renderCards();
  });
  closeDialog.addEventListener('click', close);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });
  resetFilters.addEventListener('click', () => {
    activeCategory = 'all';
    query = '';
    searchInput.value = '';
    renderFilters();
    renderCards();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && dialog.open) close();
  });

  $('#updatedAt').textContent = data.updatedAt.replaceAll('-','.');
  $('#baselineDate').textContent = data.legalBaseline.replaceAll('-','.');
  $('#totalCount').textContent = String(data.items.length);
  renderFilters();
  renderCards();
})();
