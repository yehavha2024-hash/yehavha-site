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

  function appendLinkedText(node, value) {
    const text = String(value || '');
    const urlPattern = /https?:\/\/[^\s]+/g;
    let lastIndex = 0;

    for (const match of text.matchAll(urlPattern)) {
      const rawUrl = match[0];
      const trailingMatch = rawUrl.match(/[),.;]+$/);
      const trailing = trailingMatch ? trailingMatch[0] : '';
      const href = trailing ? rawUrl.slice(0, -trailing.length) : rawUrl;
      const index = match.index ?? 0;

      if (index > lastIndex) node.append(document.createTextNode(text.slice(lastIndex, index)));

      const link = el('a', 'article-source-link', href);
      link.href = href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      node.append(link);

      if (trailing) node.append(document.createTextNode(trailing));
      lastIndex = index + rawUrl.length;
    }

    if (lastIndex < text.length) node.append(document.createTextNode(text.slice(lastIndex)));
  }

  function formatDate(value) {
    if (!value) return '';
    return String(value).replaceAll('-', '.');
  }

  function visibleArticles(data) {
    return (Array.isArray(data.articles) ? data.articles : []).filter((article) => article.status !== 'draft');
  }

  const essayHeadingMap = {
    'ai-agent-responsibility-law': {
      "1. 문제의 출발점은 ‘AI가 누구인가’가 아니라 ‘책임이 어디에 붙는가’이다": '1. 책임귀속의 출발점',
      '2. 첫 번째 구별은 행위효과와 손해책임이다': '2. 행위효과와 손해책임',
      '3. 권한의 연쇄는 Agentic AI 책임법의 첫 번째 구조적 문제다': '3. 권한연쇄',
      '4. 다중 에이전트의 핵심 위험은 개별 오류보다 상호작용에서 생긴다': '4. 다중 에이전트와 창발손해',
      '5. 현행 민법의 출발점은 제750조의 인간·법인 책임이다': '5. 민법 제750조와 책임주체',
      '6. 복수 주체가 관여하면 민법 제760조의 적용가능성과 한계를 함께 보아야 한다': '6. 민법 제760조와 복수책임',
      '7. AI 손해에서 가장 큰 실무문제는 인과관계보다 먼저 증거접근이다': '7. 증거접근',
      '8. 증명곤란을 해결하려면 전면적 책임전환보다 단계적 추정구조가 적절하다': '8. 단계적 증명완화',
      '9. EU 신 제조물책임지침은 디지털·AI 손해의 증명구조를 한 단계 더 전진시킨다': '9. EU 제조물책임지침',
      '10. 책임법은 선형 공급망보다 AI 가치사슬의 역할과 통제능력을 보아야 한다': '10. AI 가치사슬 책임',
      "11. 인간 감독은 ‘사람이 화면을 봤다’는 사실이 아니라 실질적 통제기능이어야 한다": '11. 인간 감독',
      '12. 로그는 기술문서가 아니라 책임귀속의 기반시설이다': '12. 로그와 책임귀속',
      '13. 사후학습과 업데이트는 책임의 기준시점을 공급 당시로 고정하기 어렵게 만든다': '13. 사후학습·업데이트',
      '14. Physical AI에서는 소프트웨어의 판단이 곧 물리적 손해로 연결된다': '14. Physical AI',
      '15. 자율주행은 로그·행위주체·책임주체를 분리해서 보는 대표적 실증영역이다': '15. 자율주행 사고데이터',
      '16. 국내 인공지능기본법은 민사책임법이 아니지만 주의의무의 구체화 자료가 될 수 있다': '16. 인공지능기본법과 주의의무',
      '17. 완전한 AI 법인격보다 먼저 검토할 것은 제한된 기능적 법적 지위다': '17. 기능적 법적 지위',
      '18. 기능적 책임단위의 잠정모형': '18. 기능적 책임단위',
      '19. 반론은 세 가지다': '19. 반론과 한계',
      "20. 결론: AI 책임법은 ‘누가 AI인가’보다 ‘어디에 책임을 고정할 것인가’를 설계해야 한다": '20. 결론',
      '핵심 국내 법적 근거': '국내 법적 근거',
      '핵심 연결문헌': '핵심문헌'
    },
    'ai-agent-functional-agency': {
      '1. 가상사례와 분석의 전제': '1. 가상사례',
      '2. 먼저 네 개의 법률관계를 분리해야 한다': '2. 법률관계의 분리',
      '3. 현행 민법상 AI를 곧바로 대리인이라고 할 수 있는가': '3. AI와 대리인 지위',
      '4. 그러나 대법원의 대리인·사자 구별기준에 비추면 기능적으로는 대리에 가까워진다': '4. 대리·사자의 경계',
      '5. 현행법에서는 거래효과를 어떻게 사용자에게 귀속시킬 것인가': '5. 거래효과의 귀속',
      '6. 다중 에이전트의 재위임은 민법상 복대리와 같은가': '6. 재위임과 복대리',
      '7. 가짜 호텔 선택은 권한초과가 아니라 권한범위 내의 부적절한 수행일 수 있다': '7. 권한초과와 업무수행',
      "8. 민법 제116조는 AI의 '인식과 과실' 문제를 드러낸다": '8. 민법 제116조와 AI 인식',
      '9. 사칭사업자와의 예약계약은 사기취소가 중심이 된다': '9. 사기취소',
      '10. 중개플랫폼을 거친 경우 전자상거래법의 신원확인의무가 중요하다': '10. 플랫폼 신원확인',
      '11. 유료 AI 서비스 제공자의 책임은 민법 제390조를 중심으로 본다': '11. AI 서비스의 계약책임',
      "12. 서비스 제공자는 'AI가 자율적으로 결정했다'는 이유만으로 책임에서 빠질 수 있는가": '12. 자율성과 사업자 책임',
      '13. 카드 비밀번호와 결제권한의 위임은 별도의 전자금융법 문제다': '13. 결제권한과 전자금융',
      '14. 손해의 1차 원인은 사기자이지만 최종 손해부담은 층위별로 달라질 수 있다': '14. 손해원인과 책임층위',
      "15. 이 사례는 순수한 창발적 손해가 아니라 '혼합형 AI 실행손해'다": '15. 혼합형 AI 실행손해',
      "16. 현행법의 진짜 공백은 '권한은 작동하지만 법적 행위자는 비어 있는 구조'다": '16. 법적 지위의 공백',
      '17. 기능적 대리단위라는 제한적 제도모형': '17. 기능적 대리단위',
      '18. 가상사례에 대한 잠정적 법적 결론': '18. 사례의 잠정결론',
      '19. 연구상 핵심명제': '19. 핵심명제',
      '20. 이 글에서 파생되는 연구자료': '20. 파생 연구자료',
      '주요 법령·판례·학술연결': '법령·판례·학술자료'
    }
  };

  function compactResearchHeading(value) {
    const text = String(value || '').trim();
    const match = text.match(/^(\d+\.\s*)?(.*)$/);
    const prefix = match?.[1] || '';
    const body = match?.[2] || text;
    const simple = (label) => `${prefix}${label}`;

    if (body === '연구쟁점' || body === '핵심명제' || body === '법리' || body === '검증상태') return text;
    if (body.includes('문제의 출발점')) return simple('문제의 출발점');
    if (body.includes('구체적 적용사례')) return simple('적용사례');
    if (body.includes('반론') && body.includes('한계')) return simple('반론과 한계');
    if (body.includes('잠정 결론') || body.includes('잠정적 결론')) return simple('잠정결론');
    if (body.includes('박사논문') && body.includes('잠정')) return simple('박사논문 잠정모형');
    if (body.includes('핵심 연결문헌')) return simple('핵심문헌');
    if (body.includes('국내 법적 근거')) return simple('국내 법적 근거');
    if (body.includes('해외 원자료')) return simple('해외 원자료');
    if (body.includes('후속 연구과제')) return simple('후속 연구과제');
    if (body.includes('현재 법제와 기술적 접점')) return simple('법제·기술');
    if (body.includes('한계와 추가 쟁점')) return simple('한계');
    if (body.includes('행위효과') && body.includes('손해책임')) return simple('행위효과와 손해책임');
    if (body.includes('국내 대리법')) return simple('국내 대리법');
    if (body.includes('전자계약')) return simple('자동화 전자계약');
    if (body.includes('A2A') && body.includes('권한')) return simple('A2A와 권한연쇄');
    if (body.includes('권한연쇄')) return simple('권한연쇄');
    if (body.includes('증거접근')) return simple('증거접근');
    if (body.includes('결함') && body.includes('인과관계')) return simple('결함·인과관계 추정');
    if (body.includes('인간 감독')) return simple('인간 감독');
    if (body.includes('책임관리인')) return simple('책임관리인');
    if (body.includes('사후학습') || body.includes('업데이트')) return simple('사후학습·업데이트');
    if (body.includes('Physical AI')) return simple('Physical AI');
    if (body.includes('자율주행')) return simple('자율주행');
    if (body.includes('제조물책임')) return simple('제조물책임');
    if (body.includes('가치사슬')) return simple('AI 가치사슬');
    if (body.includes('복대리')) return simple('복대리 법리');
    if (body.includes('재위임') && body.includes('책임경로')) return simple('재위임과 책임경로');
    if (body.includes('기능적') && body.includes('법적 지위')) return simple('기능적 법적 지위');
    if (body.includes('기능적') && body.includes('책임')) return simple('기능적 책임단위');
    if (body.includes('전자금융') || body.includes('접근매체')) return simple('전자금융·접근매체');
    if (body.includes('사기') && body.includes('손해')) return simple('사기와 손해귀속');
    if (body.length <= 24) return text;
    return text;
  }

  function compactHeading(article, value) {
    const text = String(value || '');
    if (!article || article.publishedAt !== '2026-08-18') return text;
    if (article.section === 'ai-law-essay') return essayHeadingMap[article.id]?.[text] || text;
    if (article.section === 'ai-law-research') return compactResearchHeading(text);
    return text;
  }

  function normalizeLead(article, value) {
    const text = String(value || '');
    if (article?.section !== 'ai-law-research') return text;
    return text.replace(/^[A-Z]\d{2}(?:은|는)\s*/, '');
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
    const sectionPriority = new Map(sections.map((section, index) => [section.id, index]));
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
      let lastSection = '';
      list
        .slice()
        .sort((a, b) => {
          if (!activeSection) {
            const sectionOrder = (sectionPriority.get(a.section) ?? 99) - (sectionPriority.get(b.section) ?? 99);
            if (sectionOrder) return sectionOrder;
          }
          return String(b.publishedAt || b.updatedAt || '').localeCompare(String(a.publishedAt || a.updatedAt || ''));
        })
        .forEach((article) => {
          if (!activeSection && article.section !== lastSection) {
            articleGrid.append(el('div', 'article-group-title', sectionMap.get(article.section)?.title || '기타 주제'));
            lastSection = article.section;
          }

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
        el('h3', '', section.title),
        el('span', 'eyebrow', section.eyebrow || 'TOPIC'),
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

  function renderBlock(block, container, article) {
    if (!block || typeof block !== 'object') return;
    const type = block.type || 'paragraph';

    if (type === 'heading') {
      const level = Number(block.level) === 3 ? 3 : 2;
      container.append(el(`h${level}`, '', compactHeading(article, block.text || '')));
      return;
    }

    if (type === 'paragraph') {
      const paragraph = el('p');
      appendLinkedText(paragraph, block.text || '');
      container.append(paragraph);
      return;
    }

    if (type === 'scripture') {
      const box = el('section', 'scripture-block');
      if (block.reference) box.append(el('span', 'scripture-reference', block.reference));
      const scriptureText = String(block.text || '').replace(/\bJesus\b/g, 'Yeshua');
      box.append(el('p', '', scriptureText));
      container.append(box);
      return;
    }

    if (type === 'quote') {
      const quote = el('blockquote');
      appendLinkedText(quote, block.text || '');
      container.append(quote);
      return;
    }

    if (type === 'note') {
      let noteText = String(block.text || '');
      if (noteText === 'Scripture quotations are from the King James Version (KJV).') {
        noteText = 'Scripture quotations are from the King James Version (KJV), with “Jesus” in the text rendered as “Yeshua.”';
      }
      const note = el('aside', 'article-note');
      appendLinkedText(note, noteText);
      container.append(note);
      return;
    }

    if (type === 'divider') return;

    if (type === 'list') {
      const list = document.createElement(block.ordered ? 'ol' : 'ul');
      (Array.isArray(block.items) ? block.items : []).forEach((item) => {
        const listItem = el('li');
        appendLinkedText(listItem, item);
        list.append(listItem);
      });
      container.append(list);
      return;
    }

    const paragraph = el('p');
    appendLinkedText(paragraph, block.text || '');
    container.append(paragraph);
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
      if (content.lead) body.append(el('p', 'article-opening', normalizeLead(article, content.lead)));
      (Array.isArray(content.blocks) ? content.blocks : []).forEach((block) => renderBlock(block, body, article));
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
