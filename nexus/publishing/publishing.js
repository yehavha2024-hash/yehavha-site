(() => {
  'use strict';

  const grid = document.getElementById('bookGrid');
  const detailRoot = document.getElementById('bookDetail');

  function make(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function externalBookLink(book) {
    const link = make('a', 'book-link', book.actionLabel || '도서 보기');
    link.href = book.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.append(document.createTextNode(' ↗'));
    return link;
  }

  function renderBook(book) {
    const article = make('article', 'book-card');
    const platform = make('span', 'book-platform', book.platform || 'eBook');
    const title = make('h3', '', book.title);
    const description = make('p', '', book.description || '');
    const actions = make('div', 'book-actions');
    if (book.detailEnabled && book.detail) {
      const detailLink = make('a', 'book-link book-link-secondary', '책 소개');
      detailLink.href = `./detail.html?id=${encodeURIComponent(book.id)}`;
      actions.append(detailLink);
    }
    actions.append(externalBookLink(book));
    article.append(platform, title, description, actions);
    return article;
  }

  function addListSection(parent, title, items) {
    if (!Array.isArray(items) || !items.length) return;
    const section = make('section', 'book-detail-section');
    section.append(make('h2', '', title));
    const list = make('ul', 'book-detail-list');
    items.forEach((item) => list.append(make('li', '', item)));
    section.append(list);
    parent.append(section);
  }

  function renderDetail(book) {
    document.title = `${book.title} | 대표 출간 도서 | YEHAVHA Nexus`;
    const detail = book.detail || {};
    const header = make('section', 'book-detail-header');
    header.append(
      make('p', 'eyebrow', detail.eyebrow || book.platform || 'EBOOK'),
      make('span', 'book-platform', book.platform || 'eBook'),
      make('h1', '', book.title),
      make('p', 'book-detail-lead', book.description || '')
    );
    const problem = make('section', 'book-detail-section');
    problem.append(make('h2', '', '이 책이 다루는 문제'), make('p', 'book-detail-copy', detail.problem || book.description || ''));
    detailRoot.replaceChildren(header, problem);
    addListSection(detailRoot, '핵심 주제와 관점', detail.keyPoints);
    if (Array.isArray(detail.topics) && detail.topics.length) {
      const section = make('section', 'book-detail-section');
      section.append(make('h2', '', '주요 주제'));
      const row = make('div', 'book-topic-row');
      detail.topics.forEach((topic) => row.append(make('span', 'book-topic', topic)));
      section.append(row);
      detailRoot.append(section);
    }
    addListSection(detailRoot, '추천 독자', detail.recommendedFor);
    const actions = make('div', 'book-detail-actions');
    const back = make('a', 'book-link book-link-secondary', '대표 도서 목록');
    back.href = './';
    actions.append(back, externalBookLink(book));
    detailRoot.append(actions);
  }

  function renderMissingDetail() {
    if (!detailRoot) return;
    detailRoot.replaceChildren(make('div', 'empty-state', '해당 도서의 상세 소개를 찾을 수 없습니다.'));
  }

  async function load() {
    try {
      const response = await fetch('./books.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const books = Array.isArray(data.books) ? data.books : [];
      if (grid) {
        grid.replaceChildren();
        books.forEach((book) => grid.append(renderBook(book)));
      }
      if (detailRoot) {
        const id = new URLSearchParams(window.location.search).get('id');
        const book = books.find((item) => item.id === id && item.detailEnabled && item.detail);
        if (book) renderDetail(book); else renderMissingDetail();
      }
    } catch (error) {
      console.error('Publishing data load failed:', error);
      if (grid) grid.replaceChildren(make('div', 'empty-state', '출간 도서 정보를 불러오지 못했습니다.'));
      renderMissingDetail();
    }
  }

  load();
})();
