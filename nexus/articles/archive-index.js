(() => {
  'use strict';

  const articleGrid = document.getElementById('articleGrid');
  const emptyState = document.getElementById('emptyState');
  const articleCount = document.getElementById('articleCount');
  const updatedAt = document.getElementById('updatedAt');

  const standaloneArticles = [
    {
      id: 'nepal-disaster-repentance-warning-en',
      section: 'bible-theology',
      sectionLabel: 'Bible & Theology',
      language: 'en',
      translationOf: 'nepal-disaster-repentance-warning',
      series: 'Bible Message · English',
      title: 'What We Must Examine First in the Face of Disaster',
      summary: 'A biblical reflection on the 2026 Nepal Himalayan tragedy, the danger of judging victims, God’s patience, repentance, and the call to remain watchful.',
      author: 'MyungHun Lee',
      publishedAt: '2026-08-30',
      href: './nepal-disaster-repentance-warning-en.html'
    },
    {
      id: 'judicial-ai-prompt-injection',
      section: 'ai-law-essay',
      language: 'ko',
      series: '사법 AI 연구',
      title: '재판지원 AI에 대한 프롬프트 인젝션과 사법절차의 무결성',
      summary: 'Elliott 사건과 브라질 Galileu 사건을 중심으로 사실관계, 기술구조, 미국·브라질 법리, 한국 재판지원 AI, 책임귀속과 입법·실무 개선안을 분석한다.',
      author: '이명훈',
      publishedAt: '2026-08-21',
      href: './judicial-ai-prompt-injection.html'
    }
  ];

  function make(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function formatDate(value) {
    return value ? String(value).replaceAll('-', '.') : '';
  }

  function articleDate(article) {
    return String(article.publishedAt || article.updatedAt || '');
  }

  function articleHref(article) {
    return article.href || `./article.html?id=${encodeURIComponent(article.id)}`;
  }

  function renderCard(article, sectionMap) {
    const card = make('article', 'article-card');
    const top = make('div', 'article-card-top');
    const section = sectionMap.get(article.section);

    top.append(make('span', '', article.sectionLabel || section?.title || '글'));
    if (article.series) top.append(make('span', '', `· ${article.series}`));

    const title = make('h3');
    const link = make('a', '', article.title || '제목 없음');
    link.href = articleHref(article);
    title.append(link);

    const summary = make('p', '', article.summary || '');
    const meta = make('div', 'article-card-meta');
    const date = formatDate(articleDate(article));
    if (date) meta.append(make('span', '', date));
    if (article.author) meta.append(make('span', '', article.author));

    card.append(top, title, summary, meta);
    return card;
  }

  async function start() {
    try {
      const response = await fetch('./articles.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`articles.json: HTTP ${response.status}`);
      const data = await response.json();
      const sections = Array.isArray(data.sections) ? data.sections : [];
      const sectionMap = new Map(sections.map((section) => [section.id, section]));
      const articles = (Array.isArray(data.articles) ? data.articles : [])
        .filter((article) => article.status !== 'draft');

      const existingIds = new Set(articles.map((article) => article.id));
      standaloneArticles.forEach((article) => {
        if (!existingIds.has(article.id)) articles.push(article);
      });

      articles.sort((a, b) => articleDate(b).localeCompare(articleDate(a)));

      articleCount.textContent = String(articles.length);
      updatedAt.textContent = formatDate(data.updatedAt) || '-';
      articleGrid.replaceChildren();

      if (!articles.length) {
        emptyState.hidden = false;
        return;
      }

      emptyState.hidden = true;
      articles.forEach((article) => articleGrid.append(renderCard(article, sectionMap)));
    } catch (error) {
      console.error('Article archive load failed:', error);
      articleGrid.replaceChildren();
      emptyState.hidden = false;
      emptyState.querySelector('strong').textContent = '아카이브 정보를 불러오지 못했습니다.';
    }
  }

  start();
})();
