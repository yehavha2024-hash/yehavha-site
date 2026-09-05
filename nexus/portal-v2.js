(() => {
  'use strict';

  const toast = document.getElementById('toast');
  const quickLinks = document.getElementById('quickLinks');
  const portalGrid = document.getElementById('portalGrid');
  const accessCount = document.getElementById('accessCount');
  const portalMarkText = document.querySelector('.portal-mark span:last-child');
  const todayNexusDate = document.getElementById('todayNexusDate');
  let toastTimer;
  let koreaClockTimer;

  const COUNTER_ENDPOINT = '/api/access';
  const KOREA_TIME_ZONE = 'Asia/Seoul';

  if (accessCount) {
    accessCount.textContent = '확인 중';
    accessCount.hidden = false;
  }

  const governmentIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 9 9-5 9 5H3Z"/><path d="M5 10.5v7M9.5 10.5v7M14.5 10.5v7M19 10.5v7M3 19.5h18"/></svg>';

  const categoryIcons = {
    commentary: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19h4L19 9a2.1 2.1 0 0 0-3-3L6 16l-1 3Z"/><path d="m14.5 7.5 2 2"/><path d="M12.5 19H19"/></svg>',
    intelligence: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5 19 6.2v5.1c0 4.4-2.9 7.4-7 9.2-4.1-1.8-7-4.8-7-9.2V6.2L12 3.5Z"/><path d="M8.2 12h2.1l1.2-2.5 1.8 5 1.1-2.5h1.7"/></svg>',
    investment: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18V10M10 18V6M16 18v-5M3 20h18"/><path d="m4 8 5-4 6 5 5-5"/></svg>',
    publicsector: governmentIcon,
    'local-government-planning': governmentIcon,
    university: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3.2 8.5 8.8-4.2 8.8 4.2-8.8 4.2-8.8-4.2Z"/><path d="M6.2 11.2v5.3c3.7 2.2 7.9 2.2 11.6 0v-5.3M20.8 8.5v5.3"/></svg>',
    edtechresearch: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h9a3 3 0 0 1 3 3v10H7a3 3 0 0 0-3 3v-16Z"/><path d="M16 8.5h4v9h-4M8 10h4M8 13h5"/></svg>',
    learningapps: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4" width="17" height="16" rx="3"/><path d="M3.5 8.2h17M7.2 12h3.8v3.8H7.2zM14.2 12h2.8M14.2 15.8h2.8"/></svg>',
    education: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 8.7 9-4.2 9 4.2-9 4.2-9-4.2Z"/><path d="M6 11.1v5c3.8 2.4 8.2 2.4 12 0v-5"/><path d="M21 8.7v5.1"/></svg>',
    aiknowledge: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3M5.8 5.8l2.1 2.1M16.1 16.1l2.1 2.1M18.2 5.8l-2.1 2.1M7.9 16.1l-2.1 2.1"/><circle cx="12" cy="12" r="4.2"/></svg>',
    'ai-work-infrastructure': '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="9" y="14" width="6" height="6" rx="1.5"/><path d="M7 10v2h10v-2M12 12v2"/></svg>',
    legalpractice: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v15M6 7h12M7.5 7 4.5 13h6L7.5 7ZM16.5 7l-3 6h6l-3-6ZM8 20h8"/></svg>',
    legalresearch: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5h9.2a2.8 2.8 0 0 1 2.8 2.8v10.2H7.8A2.8 2.8 0 0 0 5 20.3V4.5Z"/><path d="M7.8 20.3H19V7.8M8.5 9h5M8.5 12h4"/></svg>',
    legalintelligence: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5h14v15H5z"/><path d="M8 8h8M8 11.5h8M8 15h5"/><path d="M3 7.5h2M3 12h2M3 16.5h2"/></svg>',
    legalsearch: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 5 5"/><path d="M8 10.5h5M10.5 8v5"/></svg>',
    culture: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16v13H4z"/><path d="M7 9h4M7 12h7M7 15h5"/><path d="M17 8.5v6M14 11.5h6"/></svg>',
    publishing: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5c3.3-.6 5.9.1 8 2.1v11c-2.1-2-4.7-2.7-8-2.1v-11Z"/><path d="M20 5.5c-3.3-.6-5.9.1-8 2.1v11c2.1-2 4.7-2.7 8-2.1v-11Z"/></svg>',
    media: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="3"/><path d="m10 9 5 3-5 3V9Z"/></svg>'
  };

  const categoryMaturity = {
    commentary: {label:'논평',tone:'research'},
    intelligence: {label:'전략정보',tone:'research'},
    investment: {label:'분석·참고',tone:'operational'},
    publicsector: {label:'전략·대응',tone:'research'},
    'local-government-planning': {label:'실무 매뉴얼',tone:'operational'},
    edtechresearch: {label:'전문 연구',tone:'research'},
    aiknowledge: {label:'지식·동향',tone:'research'},
    'ai-work-infrastructure': {label:'구축 매뉴얼',tone:'operational'},
    legalresearch: {label:'전문 연구',tone:'research'},
    legalintelligence: {label:'법률정보',tone:'research'},
    legalsearch: {label:'법률검색',tone:'research'},
    culture: {label:'문화정보',tone:'operational'},
    legalpractice: {label:'실무·훈련',tone:'operational'},
    learningapps: {label:'학습',tone:'operational'},
    university: {label:'학습',tone:'operational'}
  };

  function updateKoreaClock() {
    if (!portalMarkText) return;
    const now = new Date();
    const dateText = new Intl.DateTimeFormat('en-CA', {timeZone:KOREA_TIME_ZONE,year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
    const timeText = new Intl.DateTimeFormat('en-GB', {timeZone:KOREA_TIME_ZONE,hour:'2-digit',minute:'2-digit',hour12:false}).format(now);
    portalMarkText.textContent = `${dateText} · ${timeText} KST`;
    portalMarkText.setAttribute('aria-label', `현재 한국 표준시 ${dateText} ${timeText}`);
  }

  function installKoreaClock() {
    updateKoreaClock();
    window.clearInterval(koreaClockTimer);
    koreaClockTimer = window.setInterval(updateKoreaClock, 30000);
  }

  function updateTodayDate() {
    if (!todayNexusDate) return;
    const parts = new Intl.DateTimeFormat('ko-KR', {timeZone:KOREA_TIME_ZONE,year:'numeric',month:'2-digit',day:'2-digit',weekday:'short'}).formatToParts(new Date());
    const map = Object.fromEntries(parts.map(part => [part.type, part.value]));
    todayNexusDate.textContent = `${map.year}.${map.month}.${map.day} ${map.weekday}`;
  }

  function make(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function makeCategoryIcon(categoryId, className = '') {
    const icon = make('span', className);
    icon.innerHTML = categoryIcons[categoryId] || categoryIcons.learningapps;
    icon.setAttribute('aria-hidden', 'true');
    return icon;
  }

  function formatDate(value) {
    return value ? String(value).replaceAll('-', '.') : '';
  }

  function showToast(message) {
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 1600);
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    if (!copied) throw new Error('copy failed');
  }

  function isExternalProject(project) {
    if (typeof project.external === 'boolean') return project.external;
    return project.category === 'publishing' || project.category === 'media' || /upaper\.kr|youtube\.com|youtu\.be/i.test(project.url || '');
  }

  function trackedProjectUrl(project) {
    const params = new URLSearchParams({to:project.url});
    if (project.id) params.set('id', project.id);
    return `/go?${params.toString()}`;
  }

  function maturityFor(project) {
    return categoryMaturity[project.category] || {label:'운영',tone:'operational'};
  }

  function configureProjectLink(link, project) {
    const external = isExternalProject(project);
    link.href = trackedProjectUrl(project);
    link.dataset.trackAccess = 'project';
    link.target = external ? '_blank' : '_self';
    if (external) link.rel = 'noopener noreferrer';
    return external;
  }

  function trackEvent(eventName, projectId = '') {
    const params = new URLSearchParams({op:'event',event:eventName});
    if (projectId) params.set('project', projectId);
    fetch(`${COUNTER_ENDPOINT}?${params.toString()}`, {method:'GET',cache:'no-store',credentials:'same-origin',keepalive:true}).catch(() => undefined);
  }

  function showAccessCount(value) {
    if (!accessCount || !Number.isFinite(Number(value))) return;
    accessCount.textContent = new Intl.NumberFormat('ko-KR').format(Number(value));
    accessCount.hidden = false;
  }

  async function requestAccessCount() {
    try {
      const response = await fetch(`${COUNTER_ENDPOINT}?op=get`, {method:'GET',cache:'no-store',credentials:'same-origin',headers:{Accept:'application/json'}});
      if (!response.ok) throw new Error(`counter HTTP ${response.status}`);
      const payload = await response.json();
      if (!payload?.ok || !Number.isFinite(Number(payload.count))) throw new Error('counter value missing');
      showAccessCount(payload.count);
    } catch (error) {
      console.warn('Nexus D1 access counter unavailable:', error);
      if (accessCount) accessCount.textContent = '확인 불가';
    }
  }

  function groupProjectsByCategory(projects) {
    const groups = new Map();
    for (const project of projects) {
      if (!groups.has(project.category)) groups.set(project.category, []);
      groups.get(project.category).push(project);
    }
    return groups;
  }

  function renderQuickLinks(categories, projectsByCategory) {
    if (!quickLinks) return;
    quickLinks.replaceChildren();
    for (const category of categories) {
      const count = projectsByCategory.get(category.id)?.length || 0;
      const link = make('a', `quick-link quick-link-${category.id}`);
      link.href = `#${category.id}`;
      link.dataset.category = category.id;
      link.append(makeCategoryIcon(category.id, 'quick-icon'), make('span', 'quick-label', category.title), make('span', 'quick-count', String(count)));
      quickLinks.append(link);
    }
  }

  function projectSearchText(project, categoriesById) {
    const category = categoriesById.get(project.category);
    return [project.id,project.title,project.meta,project.description,category?.title,category?.description,project.contentLabel].filter(Boolean).join(' ').toLocaleLowerCase('ko-KR');
  }

  function renderSearch(data) {
    document.querySelector('.portal-discovery')?.remove();
    const heroCard = document.querySelector('.hero-card');
    if (!heroCard) return;
    const host = make('div', 'portal-discovery');
    const block = make('section', 'portal-search');
    block.setAttribute('aria-labelledby', 'nexus-search-title');
    const head = make('div', 'portal-search-head');
    const title = make('h2', '', 'NEXUS 통합검색');
    title.id = 'nexus-search-title';
    head.append(title, make('p', '', '현재 등록된 전체 프로젝트 검색'));
    const box = make('div', 'portal-search-box');
    const input = make('input', 'portal-search-input');
    input.type = 'search';
    input.autocomplete = 'off';
    input.placeholder = '예: Agentic AI, 책임귀속, 임대차, Suno, 성경';
    input.setAttribute('aria-label', 'NEXUS 통합검색');
    const clear = make('button', 'portal-search-clear', '지우기');
    clear.type = 'button';
    const results = make('div', 'portal-search-results');
    results.setAttribute('aria-live', 'polite');
    box.append(input, clear);
    block.append(head, box, results);
    host.append(block);
    heroCard.insertAdjacentElement('afterend', host);

    const renderResults = () => {
      const query = input.value.trim().toLocaleLowerCase('ko-KR');
      results.replaceChildren();
      if (!query) return;
      const matches = data.projects.filter(project => projectSearchText(project, data.categoriesById).includes(query)).slice(0, 10);
      if (!matches.length) {
        results.append(make('p', 'search-empty', '일치하는 등록 프로젝트가 없습니다. 다른 핵심어로 검색해 주세요.'));
        return;
      }
      for (const project of matches) {
        const category = data.categoriesById.get(project.category);
        const link = make('a', 'search-result');
        link.dataset.searchResult = project.id;
        const external = configureProjectLink(link, project);
        const copy = make('span');
        copy.append(make('strong', '', project.title), make('span', '', `${category?.title || '프로젝트'} · ${project.meta || ''}`));
        link.append(copy, make('span', 'search-result-arrow', external ? '↗' : '→'));
        results.append(link);
      }
    };

    input.addEventListener('input', renderResults);
    input.addEventListener('keydown', event => {
      if (event.key !== 'Enter' || !input.value.trim()) return;
      trackEvent('search');
      const url = new URL(window.location.href);
      url.searchParams.set('q', input.value.trim());
      history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    });
    clear.addEventListener('click', () => {
      input.value = '';
      results.replaceChildren();
      const url = new URL(window.location.href);
      url.searchParams.delete('q');
      history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
      input.focus();
    });
    const initialQuery = new URL(window.location.href).searchParams.get('q');
    if (initialQuery) {
      input.value = initialQuery;
      renderResults();
    }
  }

  function renderProject(project) {
    const article = make('article', 'item-card');
    const top = make('div', 'item-top');
    top.append(make('span', 'item-meta', project.meta || 'Project'));
    const maturity = maturityFor(project);
    top.append(make('span', `maturity-chip maturity-${maturity.tone}`, maturity.label));
    if (project.status) {
      const tone = ['fresh','active','stable','unknown'].includes(project.statusTone) ? project.statusTone : 'active';
      top.append(make('span', `project-status status-${tone}`, project.status));
    }
    const title = make('h3', '', project.title);
    const description = make('p', '', project.description);
    const actions = make('div', 'item-actions');
    const visit = make('a', 'visit-link');
    const external = configureProjectLink(visit, project);
    visit.append(`${project.actionLabel || '바로가기'} `, make('span', '', external ? '↗' : '→'));
    const copy = make('button', 'copy-btn', '링크 복사');
    copy.type = 'button';
    copy.dataset.url = project.url;
    copy.dataset.projectId = project.id;
    actions.append(visit, copy);
    article.append(top, title, description);

    if (project.managedBy === 'github' || project.managedBy === 'github-external') {
      const info = make('div', 'project-live-meta');
      if (Number.isFinite(project.contentCount)) info.append(make('span', '', `${project.contentLabel || '콘텐츠'} ${project.contentCount}`));
      if (project.lastUpdated) info.append(make('span', '', `운영수정 ${formatDate(project.lastUpdated)}`));
      if (info.childElementCount) article.append(info);
      const review = make('div', 'project-review-meta');
      if (project.contentReviewedAt) review.append(make('span', '', `내용검토 ${formatDate(project.contentReviewedAt)}`));
      if (project.baselineAt) review.append(make('span', '', `${project.baselineLabel || '기준일'} ${formatDate(project.baselineAt)}`));
      if (review.childElementCount) article.append(review);
    }
    article.append(actions);
    return article;
  }

  function renderCategory(category, projects, variant) {
    const section = make('section', `category-card category-${category.id} category-${variant}`);
    section.id = category.id;
    section.dataset.category = category.id;
    section.setAttribute('aria-labelledby', `${category.id}-title`);
    const head = make('div', 'category-head');
    const icon = make('div', `category-icon ${category.iconClass || ''}`);
    icon.append(makeCategoryIcon(category.id, 'category-icon-glyph'));
    icon.setAttribute('aria-hidden', 'true');
    const copy = make('div', 'category-copy');
    const titleRow = make('div', 'category-title-row');
    const title = make('h2', '', category.title);
    title.id = `${category.id}-title`;
    titleRow.append(title, make('span', 'category-count', `${projects.length} PROJECT${projects.length > 1 ? 'S' : ''}`));
    copy.append(make('p', 'eyebrow', category.eyebrow), titleRow, make('p', 'category-description', category.description));
    head.append(icon, copy);
    const grid = make('div', `items-grid${projects.length === 1 ? ' one-item' : ''}`);
    projects.forEach(project => grid.append(renderProject(project)));
    section.append(head, grid);
    return section;
  }

  function renderTier(tier, categories, projectsByCategory) {
    const section = make('section', `portal-tier portal-tier-${tier.id}`);
    section.setAttribute('aria-labelledby', `tier-${tier.id}-title`);
    const head = make('div', 'portal-tier-head');
    const number = make('span', 'tier-number', tier.number);
    const copy = make('div', 'tier-copy');
    copy.append(make('p', 'eyebrow', tier.eyebrow), make('h2', '', tier.title), make('p', 'tier-description', tier.description));
    copy.querySelector('h2').id = `tier-${tier.id}-title`;
    head.append(number, copy);
    const grid = make('div', 'portal-tier-grid');
    const tierCategories = categories.filter(category => category.tier === tier.id);
    for (const category of tierCategories) {
      const categoryProjects = projectsByCategory.get(category.id) || [];
      if (categoryProjects.length) grid.append(renderCategory(category, categoryProjects, tier.variant || 'primary'));
    }
    if (!grid.childElementCount) return null;
    section.append(head, grid);
    return section;
  }

  function installSeo(data) {
    const canonicalUrl = 'https://yehavha-nexus-hub.pages.dev/';
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = canonicalUrl;
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.append(robots);
    }
    robots.content = 'index,follow,max-image-preview:large';
    document.querySelector('script[data-nexus-structured-data]')?.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.nexusStructuredData = 'true';
    script.textContent = JSON.stringify({
      '@context':'https://schema.org',
      '@type':'WebSite',
      name:'YEHAVHA Nexus',
      alternateName:'예하바 프로젝트 포털',
      url:canonicalUrl,
      description:'논평·전략정보·투자·정부 AX·지방정부 사업기획·학습·AI 지식·업무 인프라·법률실무·법학 AI 연구·법률정보·법률검색·문화행사·출판·미디어를 연결하는 통합 포털',
      potentialAction:{'@type':'SearchAction',target:`${canonicalUrl}?q={search_term_string}`,'query-input':'required name=search_term_string'},
      hasPart:data.projects.map(project => ({'@type':'WebPage',name:project.title,url:project.url,description:project.description}))
    });
    document.head.append(script);
  }

  function renderPortal(data) {
    const tiers = Array.isArray(data.tiers) ? data.tiers : [];
    const categories = Array.isArray(data.categories) ? data.categories : [];
    const projects = Array.isArray(data.projects) ? data.projects : [];
    const projectsByCategory = groupProjectsByCategory(projects);
    const categoriesById = new Map(categories.map(category => [category.id, category]));
    const visibleCategories = categories.filter(category => projectsByCategory.has(category.id));
    renderQuickLinks(visibleCategories, projectsByCategory);
    renderSearch({categoriesById,projects});
    installSeo({projects});
    if (!portalGrid) return;
    portalGrid.replaceChildren();
    for (const tier of tiers) {
      const section = renderTier(tier, visibleCategories, projectsByCategory);
      if (section) portalGrid.append(section);
    }
  }

  async function fetchJson(url) {
    const response = await fetch(url, {cache:'no-store'});
    if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
    return response.json();
  }

  async function loadPortal() {
    try {
      const data = await fetchJson('./projects.json');
      let statusMap = {};
      try {
        statusMap = await fetchJson('./project-status.json');
      } catch (error) {
        console.warn('Nexus project status unavailable; rendering canonical project data only.', error);
      }
      const projects = (Array.isArray(data.projects) ? data.projects : []).map(project => ({...project,...(statusMap?.[project.id] || {})}));
      renderPortal({...data,projects});
    } catch (error) {
      console.error('YEHAVHA Nexus data load failed:', error);
      if (portalGrid) portalGrid.replaceChildren(make('section', 'category-card', '프로젝트 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'));
    }
  }

  document.addEventListener('click', async event => {
    const button = event.target.closest('.copy-btn');
    if (button) {
      const url = button.dataset.url;
      if (!url) return;
      const previous = button.textContent;
      try {
        await copyText(url);
        button.textContent = '복사 완료';
        showToast('프로젝트 링크를 복사했습니다.');
        trackEvent('copy', button.dataset.projectId || '');
      } catch {
        window.prompt('아래 주소를 복사하세요.', url);
      } finally {
        window.setTimeout(() => { button.textContent = previous; }, 1400);
      }
      return;
    }
    const projectLink = event.target.closest('a[data-track-access="project"]');
    if (projectLink) {
      if (projectLink.dataset.searchResult) trackEvent('search_open', projectLink.dataset.searchResult);
      return;
    }
    const link = event.target.closest('a[href^="#"]');
    if (link) {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') document.querySelector(targetId)?.setAttribute('tabindex', '-1');
    }
  });

  updateTodayDate();
  installKoreaClock();
  window.setTimeout(() => { void requestAccessCount(); }, 700);
  loadPortal();
})();