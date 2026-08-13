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
          top.append(el('span', '', article.sectionLabel || articleSection?.title || '글'));
          if (article.series) top.append(el('span', '', `· ${article.series}`));

          const title = el('h3');
          const link = el('a', '', article.title || '제목 없음');
          link.href = `./article.html?id=${encodeURIComponent(article.id)}`;
          title.append(link);

          const summary = el('p', '', article.summary || '');
          const meta = el('div', 'article-card-meta');
          const date = formatDate(article.publishedAt || article.updatedAt);
          if (date) meta.append(el('span', '', date));
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

    if (type === 'divider') return;

    if (type === 'list') {
      const list = document.createElement(block.ordered ? 'ol' : 'ul');
      (Array.isArray(block.items) ? block.items : []).forEach((item) => list.append(el('li', '', item)));
      container.append(list);
      return;
    }

    container.append(el('p', '', block.text || ''));
  }

  function buildTableOfContents(body) {
    const toc = document.getElementById('articleToc');
    const list = document.getElementById('tocList');
    const headings = Array.from(body.querySelectorAll('h2, h3'));
    list.replaceChildren();

    if (!headings.length) {
      toc.hidden = true;
      return;
    }

    headings.forEach((heading, index) => {
      heading.id = heading.id || `article-section-${index + 1}`;
      const item = el('li', heading.tagName === 'H3' ? 'toc-subitem' : 'toc-item');
      const link = el('a', '', heading.textContent.trim());
      link.href = `#${heading.id}`;
      item.append(link);
      list.append(item);
    });

    toc.hidden = false;
  }

  function applyLanguageUI(article) {
    const isEnglish = String(article.language || '').toLowerCase().startsWith('en');
    document.documentElement.lang = isEnglish ? 'en' : (article.language || 'ko');
    if (!isEnglish) return;

    const skipLink = document.querySelector('.skip-link');
    const backLink = document.querySelector('.reader-nav .back-link');
    const tocTitle = document.getElementById('tocTitle');
    const relatedTitle = document.querySelector('#relatedArticles h2');
    const topLink = document.querySelector('.article-closing a');

    if (skipLink) skipLink.textContent = 'Skip to article';
    if (backLink) backLink.textContent = '← Articles & Research Archive';
    if (tocTitle) tocTitle.textContent = 'Contents';
    if (relatedTitle) relatedTitle.textContent = 'Related Articles';
    if (topLink) topLink.textContent = 'Back to top ↑';
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
    const isEnglish = String(article.language || '').toLowerCase().startsWith('en');

    try {
      const content = await fetchJson(contentUrl);
      applyLanguageUI(article);
      document.title = `${article.title} | YEHAVHA Nexus`;
      document.querySelector('meta[name="description"]')?.setAttribute('content', article.summary || article.title || (isEnglish ? 'YEHAVHA Nexus article' : 'YEHAVHA Nexus 글'));

      document.getElementById('articleSection').textContent = article.sectionLabel || section?.title || (isEnglish ? 'Article' : '글');
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

      document.getElementById('articleAuthor').textContent = `${isEnglish ? 'Author' : '지은이'} ${article.author || '이명훈'}`;

      const summaryNode = document.getElementById('articleSummary');
      if (article.summary) {
        summaryNode.textContent = article.summary;
        summaryNode.hidden = false;
      }

      const body = document.getElementById('articleBody');
      if (content.lead) body.append(el('p', 'article-opening', content.lead));
      (Array.isArray(content.blocks) ? content.blocks : []).forEach((block) => renderBlock(block, body));
      buildTableOfContents(body);

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
