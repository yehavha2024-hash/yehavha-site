(() => {
  'use strict';

  const grid = document.getElementById('bookGrid');

  function make(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function renderBook(book) {
    const article = make('article', 'book-card');
    const platform = make('span', 'book-platform', book.platform || 'eBook');
    const title = make('h3', '', book.title);
    const description = make('p', '', book.description || '');
    const link = make('a', 'book-link', book.actionLabel || '도서 보기');
    link.href = book.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.append(document.createTextNode(' ↗'));
    article.append(platform, title, description, link);
    return article;
  }

  async function load() {
    try {
      const response = await fetch('./books.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const books = Array.isArray(data.books) ? data.books : [];
      grid.replaceChildren();
      books.forEach((book) => grid.append(renderBook(book)));
    } catch (error) {
      console.error('Publishing data load failed:', error);
      grid.replaceChildren(make('div', 'empty-state', '출간 도서 정보를 불러오지 못했습니다.'));
    }
  }

  load();
})();
