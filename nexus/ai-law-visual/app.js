(() => {
  const episodes = Array.isArray(window.NEXUS_AI_LAW_EPISODES) ? window.NEXUS_AI_LAW_EPISODES : [];
  const grid = document.getElementById('cardGrid');
  const searchInput = document.getElementById('searchInput');
  const resultCount = document.getElementById('resultCount');
  const emptyState = document.getElementById('emptyState');
  const seriesCount = document.getElementById('seriesCount');
  const viewer = document.getElementById('viewer');
  const viewerClose = document.getElementById('viewerClose');
  const viewerImage = document.getElementById('viewerImage');
  const viewerIndex = document.getElementById('viewerIndex');
  const viewerTitle = document.getElementById('viewerTitle');
  const viewerTakeaway = document.getElementById('viewerTakeaway');
  const viewerKeywords = document.getElementById('viewerKeywords');

  seriesCount.textContent = `${episodes.length} CARDS`;

  const normalize = (value) => String(value || '').toLocaleLowerCase('ko-KR').replace(/\s+/g, ' ').trim();

  function openViewer(item) {
    viewerImage.src = item.image;
    viewerImage.alt = `그림으로 이해하는 AI 법률 ${item.id}편: ${item.title}`;
    viewerIndex.textContent = `SERIES ${String(item.id).padStart(2, '0')} / ${String(episodes.length).padStart(2, '0')}`;
    viewerTitle.textContent = item.title;
    viewerTakeaway.textContent = item.takeaway;
    viewerKeywords.replaceChildren(...item.keywords.map((keyword) => {
      const chip = document.createElement('span');
      chip.textContent = keyword;
      return chip;
    }));
    if (typeof viewer.showModal === 'function') viewer.showModal();
  }

  function cardFor(item, position) {
    const article = document.createElement('article');
    article.className = 'series-card';

    const button = document.createElement('button');
    button.className = 'card-button';
    button.type = 'button';
    button.setAttribute('aria-label', `${item.id}편 크게 보기: ${item.title}`);
    button.addEventListener('click', () => openViewer(item));

    const media = document.createElement('div');
    media.className = 'card-image-wrap';
    const image = document.createElement('img');
    image.src = item.image;
    image.alt = `그림으로 이해하는 AI 법률 ${item.id}편: ${item.title}`;
    image.width = 1254;
    image.height = 1254;
    image.loading = position === 0 ? 'eager' : 'lazy';
    image.decoding = 'async';
    media.appendChild(image);

    const body = document.createElement('div');
    body.className = 'card-body';
    const meta = document.createElement('div');
    meta.className = 'card-meta';
    meta.innerHTML = `<span>SERIES ${String(item.id).padStart(2, '0')}</span><span>AI LAW</span>`;
    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = item.title;
    const takeaway = document.createElement('p');
    takeaway.className = 'card-takeaway';
    takeaway.textContent = item.takeaway;
    const action = document.createElement('span');
    action.className = 'card-action';
    action.textContent = '그림 크게 보기 →';
    body.append(meta, title, takeaway, action);
    button.append(media, body);
    article.appendChild(button);
    return article;
  }

  function render(query = '') {
    const needle = normalize(query);
    const visible = needle
      ? episodes.filter((item) => normalize([item.title, item.takeaway, ...item.keywords].join(' ')).includes(needle))
      : episodes;

    grid.replaceChildren(...visible.map(cardFor));
    resultCount.textContent = `${visible.length} / ${episodes.length}편`;
    emptyState.hidden = visible.length !== 0;
  }

  searchInput.addEventListener('input', (event) => render(event.target.value));
  viewerClose.addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', (event) => {
    if (event.target === viewer) viewer.close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && viewer.open) viewer.close();
  });

  render();
})();