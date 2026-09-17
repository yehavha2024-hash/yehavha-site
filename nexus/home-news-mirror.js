document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const list = document.getElementById('homeLatestNewsList');
  const meta = document.getElementById('homeLatestNewsMeta');
  if (!list) return;

  const raw = Array.isArray(window.YEHAVHA_NEWS_DATA) ? window.YEHAVHA_NEWS_DATA : [];
  const config = window.YEHAVHA_NEWS_CONFIG || {};
  const categories = Array.isArray(config.categories) ? config.categories : [];
  const seenIds = new Set();
  const seenHrefs = new Set();
  const data = raw
    .map((item, index) => ({...item, _sequence:index}))
    .filter(item => {
      const valid = item && typeof item.id === 'string' && item.id
        && typeof item.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date)
        && typeof item.category === 'string' && (!categories.length || categories.includes(item.category))
        && typeof item.title === 'string' && item.title
        && typeof item.summary === 'string'
        && typeof item.href === 'string' && item.href;
      if (!valid || seenIds.has(item.id) || seenHrefs.has(item.href)) return false;
      seenIds.add(item.id);
      seenHrefs.add(item.href);
      return true;
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a._sequence - b._sequence);

  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const articleHref = href => href.startsWith('./articles/') ? `./news/${href.slice(2)}` : href;
  const formatDate = value => value.replace(/-/g, '.');

  const articleCard = item => {
    const href = articleHref(item.href);
    const video = item.video;
    const hasVideo = video && typeof video.url === 'string' && video.url
      && typeof video.thumbnail === 'string' && video.thumbnail;

    if (hasVideo) {
      const card = make('article', 'opinion-feature news-media-feature');
      const visual = make('div', 'news-media-visual');
      const thumbLink = make('a', 'news-media-thumb-link');
      thumbLink.href = href;
      thumbLink.setAttribute('aria-label', `${item.title} 기사 보기`);
      const image = make('img');
      image.src = video.thumbnail;
      image.alt = `${item.title} 관련 YouTube 영상 썸네일`;
      image.width = 480;
      image.height = 270;
      image.loading = 'lazy';
      image.decoding = 'async';
      thumbLink.append(image);

      const relatedLink = make('a', 'news-media-related', `${item.category} 관련 영상 ↗`);
      relatedLink.href = video.url;
      relatedLink.target = '_blank';
      relatedLink.rel = 'noopener noreferrer';
      relatedLink.setAttribute('aria-label', `${item.title} 관련 영상 새 창에서 보기`);
      visual.append(thumbLink, relatedLink);

      const copy = make('div', 'opinion-copy news-media-copy');
      const cardMeta = make('div', 'news-card-meta news-media-meta');
      [item.category, formatDate(item.date), item.author || 'YEHAVHA NEWS']
        .forEach(value => cardMeta.append(make('span', '', value)));
      const heading = make('h3', 'news-media-title');
      const titleLink = make('a', '', item.title);
      titleLink.href = href;
      heading.append(titleLink);
      const summary = make('span', 'news-media-summary', item.summary);
      const actions = make('b', 'news-media-actions');
      const action = make('a', 'news-media-action', '기사 보기 →');
      action.href = href;
      actions.append(action);
      copy.append(cardMeta, heading, summary, actions);
      card.append(visual, copy);
      return card;
    }

    const link = make('a', 'news-card');
    link.href = href;
    const cardMeta = make('div', 'news-card-meta');
    [item.category, formatDate(item.date), item.author || 'YEHAVHA NEWS']
      .forEach(value => cardMeta.append(make('span', '', value)));
    link.append(cardMeta, make('h3', '', item.title), make('p', '', item.summary));
    return link;
  };

  if (!data.length) {
    list.replaceChildren(make('p', 'home-news-empty', '등록된 뉴스가 없습니다.'));
    if (meta) meta.textContent = '최신 기사';
    return;
  }

  const latestDate = data[0].date;
  const configuredLimit = Number(config.homeLatestLimit);
  const limit = Number.isFinite(configuredLimit) && configuredLimit > 0 ? configuredLimit : 10;
  const latestItems = data.filter(item => item.date === latestDate).slice(0, limit);
  list.replaceChildren(...latestItems.map(articleCard));
  if (meta) meta.textContent = `${formatDate(latestDate)} · ${latestItems.length}건`;
});
