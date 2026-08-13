(() => {
  'use strict';

  const page = document.body.dataset.page || 'index';

  async function fetchJson(url) {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
    return response.json();
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function formatDate(value) {
    if (!value) return '';
    return String(value).replaceAll('-', '.');
  }

  function visibleArticles(data) {
    return (Array.isArray(data.articles) ? data.articles : []).filter((article) => article.status !== 'draft');
  }

  function renderIndex(data) {
    const sections = Array.isArray(data.sections) ? data.sections : [];
    const articles = visibleArticles(data);
    const topicGrid = document.getElementById('topicGrid');
    const articleGrid = document.getElementById('articleGrid');
    const emptyState = document.getElementById('emptyState');
    const filterReset = document.getElementById('filterReset');
    const latestTitle = document.getElementById('latestTitle');

    document.getElementById('sectionCount').textContent = String(sections.length);
    document.getElementById('articleCount').textContent = String(articles.length);
    document.getElementById('updatedAt').textContent = formatDate(data.updatedAt) || '-';

    const sectionMap = new Map(sections.map((section) => [section.id, section]));
    let activeSection = null;

    function renderArticleCards() {
      articleGrid.replaceChildren();
      const list = activeSection ? articles.filter((article) => article.section === activeSection) : articles;
      const section = activeSection ? sectionMap.get(activeSection) : null;
      latestTitle.textContent = section ? section.title : '전체 글';
      filterReset.hidden = !activeSection;

      document.querySelectorAll('.topic-card').forEach((card) => {
        card.classList.toggle('active', card.dataset.section === activeSection);
      });

      if (!list.length) {
        emptyState.hidden = false;
        return;
      }

      emptyState.hidden = true;
      list
        .slice()
        .sort((a, b) => String(b.publishedAt || b.updatedAt || '').localeCompare(String(a.publishedAt || a.updatedAt || '')))
        .forEach((article) => {
          const card = el('article', 'article-card');
          const top = el('div', 'article-card-top');
          const articleSection = sectionMap.get(article.section);
          top.append(el('span', '', articleSection?.title || '글'));
          if (article.series) top.append(el('span', '', `· ${article.series}`));

          const title = el('h3');
          const link = el('a', '', article.title || '제목 없음');
          link.href = `./article.html?id=${encodeURIComponent(article.id)}`;
          title.append(link);

          const summary = el('p', '', article.summary || '');
          const meta = el('div', 'article-card-meta');
          const date = formatDate(article.publishedAt || article.updatedAt);
          if (date) meta.append(el('span', '', date));
          if (article.readingMinutes) meta.append(el('span', '', `${article.readingMinutes}분 읽기`));
          if (article.author) meta.append(el('span', '', article.author));

          card.append(top, title, summary, meta);
          articleGrid.append(card);
        });
    }

    sections.forEach((section, index) => {
      const count = articles.filter((article) => article.section === section.id).length;
      const button = el('button', 'topic-card');
      button.type = 'button';
      button.dataset.section = section.id;
      button.setAttribute('aria-label', `${section.title} 글 보기`);
      button.append(
        el('span', 'topic-number', String(index + 1).padStart(2, '0')),
        el('span', 'eyebrow', section.eyebrow || 'TOPIC'),
        el('h3', '', section.title),
        el('p', '', section.description || ''),
        el('span', 'topic-count', `${count} ARTICLE${count === 1 ? '' : 'S'}`)
      );
      button.addEventListener('click', () => {
        activeSection = activeSection === section.id ? null : section.id;
        renderArticleCards();
        document.getElementById('latestTitle')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      topicGrid.append(button);
    });

    filterReset.addEventListener('click', () => {
      activeSection = null;
      renderArticleCards();
    });

    renderArticleCards();
  }

  function addMeta(container, label, value) {
    if (!value) return;
    container.append(el('span', '', `${label} ${value}`));
  }

  function renderBlock(block, container) {
    if (!block || typeof block !== 'object') return;
    const type = block.type || 'paragraph';

    if (type === 'heading') {
      const level = Number(block.level) === 3 ? 3 : 2;
      container.append(el(`h${level}`, '', block.text || ''));
      return;
    }

    if (type === 'paragraph') {
      container.append(el('p', '', block.text || ''));
      return;
    }

    if (type === 'scripture') {
      const box = el('section', 'scripture-block');
      if (block.reference) box.append(el('span', 'scripture-reference', block.reference));
      box.append(el('p', '', block.text || ''));
      container.append(box);
      return;
    }

    if (type === 'quote') {
      container.append(el('blockquote', '', block.text || ''));
      return;
    }

    if (type === 'note') {
      container.append(el('aside', 'article-note', block.text || ''));
      return;
    }

    if (type === 'divider') {
      container.append(el('hr', 'article-divider'));
      return;
    }

    if (type === 'list') {
      const list = document.createElement(block.ordered ? 'ol' : 'ul');
      (Array.isArray(block.items) ? block.items : []).forEach((item) => list.append(el('li', '', item)));
      container.append(list);
      return;
    }

    container.append(el('p', '', block.text || ''));
  }

  async function renderDetail(data) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const readerCard = document.getElementById('readerCard');
    const readerError = document.getElementById('readerError');
    const articles = visibleArticles(data);
    const article = articles.find((item) => item.id === id);

    if (!article) {
      readerError.hidden = false;
      return;
    }

    const sectionMap = new Map((Array.isArray(data.sections) ? data.sections : []).map((section) => [section.id, section]));
    const section = sectionMap.get(article.section);
    const contentUrl = article.contentUrl || `./content/${encodeURIComponent(article.id)}.json`;

    try {
      const content = await fetchJson(contentUrl);
      document.title = `${article.title} | YEHAVHA Nexus`;
      document.querySelector('meta[name="description"]')?.setAttribute('content', article.summary || article.title || 'YEHAVHA Nexus 글');

      document.getElementById('articleSection').textContent = section?.title || '글';
      const seriesNode = document.getElementById('articleSeries');
      if (article.series) {
        seriesNode.textContent = article.series;
        seriesNode.hidden = false;
      }

      document.getElementById('articleTitle').textContent = article.title || '';
      const subtitleNode = document.getElementById('articleSubtitle');
      if (article.subtitle) {
        subtitleNode.textContent = article.subtitle;
        subtitleNode.hidden = false;
      }
      document.getElementById('articleSummary').textContent = article.summary || '';

      const meta = document.getElementById('articleMeta');
      addMeta(meta, '작성', article.author || '');
      addMeta(meta, '공개', formatDate(article.publishedAt));
      if (article.updatedAt && article.updatedAt !== article.publishedAt) addMeta(meta, '수정', formatDate(article.updatedAt));
      if (article.readingMinutes) addMeta(meta, '읽기', `${article.readingMinutes}분`);

      const tags = document.getElementById('articleTags');
      (Array.isArray(article.tags) ? article.tags : []).forEach((tag) => tags.append(el('span', '', tag)));

      const lead = document.getElementById('articleLead');
      if (content.lead) {
        lead.textContent = content.lead;
        lead.hidden = false;
      }

      const body = document.getElementById('articleBody');
      (Array.isArray(content.blocks) ? content.blocks : []).forEach((block) => renderBlock(block, body));

      const related = articles
        .filter((item) => item.id !== article.id && (item.section === article.section || (article.series && item.series === article.series)))
        .slice(0, 4);
      if (related.length) {
        const relatedWrap = document.getElementById('relatedArticles');
        const relatedGrid = document.getElementById('relatedGrid');
        related.forEach((item) => {
          const link = el('a', 'related-link', item.title);
          link.href = `./article.html?id=${encodeURIComponent(item.id)}`;
          relatedGrid.append(link);
        });
        relatedWrap.hidden = false;
      }

      readerCard.hidden = false;
    } catch (error) {
      console.error('Article content load failed:', error);
      readerError.hidden = false;
    }
  }

  async function start() {
    try {
      const data = await fetchJson('./articles.json');
      if (page === 'detail') await renderDetail(data);
      else renderIndex(data);
    } catch (error) {
      console.error('Article archive load failed:', error);
      if (page === 'detail') {
        document.getElementById('readerError').hidden = false;
      } else {
        const emptyState = document.getElementById('emptyState');
        emptyState.hidden = false;
        emptyState.querySelector('strong').textContent = '아카이브 정보를 불러오지 못했습니다.';
      }
    }
  }

  start();
})();
