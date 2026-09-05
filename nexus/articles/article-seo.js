(() => {
  'use strict';

  const ARCHIVE_URL = 'https://yehavha.com/articles/';
  const DETAIL_URL = `${ARCHIVE_URL}article.html`;

  function ensureMeta(selector, attributes) {
    let node = document.head.querySelector(selector);
    if (!node) {
      node = document.createElement('meta');
      document.head.append(node);
    }
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  }

  function ensureCanonical(url) {
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.append(link);
    }
    link.href = url;
  }

  function structuredType(article) {
    const section = String(article.section || '');
    return section.startsWith('ai-law') ? 'ScholarlyArticle' : 'Article';
  }

  async function start() {
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) return;

    try {
      const response = await fetch('./articles.json', { cache: 'no-store' });
      if (!response.ok) return;
      const data = await response.json();
      const article = (Array.isArray(data.articles) ? data.articles : [])
        .find((item) => item.id === id && item.status !== 'draft');
      if (!article) return;

      const canonical = `${DETAIL_URL}?id=${encodeURIComponent(article.id)}`;
      const title = `${article.title} | YEHAVHA NEXUS`;
      const description = article.summary || article.subtitle || article.title;
      const language = article.language || 'ko';

      ensureCanonical(canonical);
      ensureMeta('meta[name="robots"]', { name: 'robots', content: 'index,follow,max-image-preview:large' });
      ensureMeta('meta[property="og:title"]', { property: 'og:title', content: title });
      ensureMeta('meta[property="og:description"]', { property: 'og:description', content: description });
      ensureMeta('meta[property="og:type"]', { property: 'og:type', content: 'article' });
      ensureMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });

      document.querySelector('script[data-article-structured-data]')?.remove();
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.articleStructuredData = 'true';
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': structuredType(article),
        headline: article.title,
        alternativeHeadline: article.subtitle || undefined,
        description,
        url: canonical,
        inLanguage: language,
        datePublished: article.publishedAt || undefined,
        dateModified: article.updatedAt || article.publishedAt || undefined,
        author: { '@type': 'Person', name: article.author || '이명훈' },
        isPartOf: { '@type': 'CollectionPage', name: '글·연구 아카이브', url: ARCHIVE_URL },
        mainEntityOfPage: canonical
      });
      document.head.append(script);
    } catch (error) {
      console.warn('Article SEO metadata unavailable:', error);
    }
  }

  start();
})();
