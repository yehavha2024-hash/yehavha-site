(() => {
  'use strict';

  const toast = document.getElementById('toast');
  const quickLinks = document.getElementById('quickLinks');
  const portalGrid = document.getElementById('portalGrid');
  const accessCount = document.getElementById('accessCount');
  let toastTimer;

  const COUNTER_ENDPOINT = '/api/access';

  if (accessCount) {
    accessCount.textContent = '0';
    accessCount.hidden = false;
  }

  const categoryIcons = {
    apps: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4" width="17" height="16" rx="2.5"/><path d="M3.5 8h17M7 6h.01M10 6h.01"/><path d="M7 12h4v4H7zM14 12h3M14 16h3"/></svg>',
    research: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M6 6h12"/><path d="m7 6-3 6h6L7 6Zm10 0-3 6h6l-3-6Z"/><path d="M4 12c.5 2 5.5 2 6 0M14 12c.5 2 5.5 2 6 0M8 21h8"/></svg>',
    publishing: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5c3.2-.7 5.8 0 8 2v11c-2.2-2-4.8-2.7-8-2V5.5Z"/><path d="M20 5.5c-3.2-.7-5.8 0-8 2v11c2.2-2 4.8-2.7 8-2V5.5Z"/></svg>',
    media: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="3"/><path d="m10 9 5 3-5 3V9Z"/><path d="M7 3v2M17 3v2"/></svg>',
    practice: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m11.5 3 1.35 4.15L17 8.5l-4.15 1.35L11.5 14l-1.35-4.15L6 8.5l4.15-1.35L11.5 3Z"/><path d="m18.5 13 .75 2.25 2.25.75-2.25.75L18.5 19l-.75-2.25L15.5 16l2.25-.75L18.5 13Z"/><path d="M5.5 15.5 3 18l3 3 2.5-2.5"/></svg>',
    education: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 9 9-4 9 4-9 4-9-4Z"/><path d="M6.5 11v4.5c3.5 2.3 7.5 2.3 11 0V11"/><path d="M21 9v5"/></svg>',
    initiatives: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4"/><path d="M8.2 14.5C6.8 13.4 6 11.8 6 10a6 6 0 1 1 12 0c0 1.8-.8 3.4-2.2 4.5-.8.6-1.3 1.4-1.5 2.5H9.7c-.2-1.1-.7-1.9-1.5-2.5Z"/><path d="M12 5.5V8M7.8 7.2l1.7 1.7M16.2 7.2l-1.7 1.7"/></svg>'
  };

  const portalTiers = [
    {
      id: 'core',
      number: '01',
      eyebrow: 'CORE WORKSPACES',
      title: '핵심 작업영역',
      description: '직접 사용하는 웹서비스와 장기 연구 기반을 가장 먼저 배치합니다.',
      categoryIds: ['apps', 'research'],
      variant: 'primary'
    },
    {
      id: 'create',
      number: '02',
      eyebrow: 'CREATE · LEARN · SHARE',
      title: '제작·교육·공개',
      description: 'AI 실무를 교육·출판·미디어 결과물로 확장하는 영역을 한 층위로 묶습니다.',
      categoryIds: ['practice', 'education', 'publishing', 'media'],
      variant: 'compact'
    },
    {
      id: 'ideas',
      number: '03',
      eyebrow: 'PUBLIC IDEAS',
      title: '아이디어 허브',
      description: '공개 가능한 아이디어와 프로젝트 후보를 한곳에서 확인합니다.',
      categoryIds: ['initiatives'],
      variant: 'compact'
    }
  ];

  function showToast(message) {
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 1600);
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
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

  function make(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function makeCategoryIcon(categoryId, className = '') {
    const icon = make('span', className);
    icon.innerHTML = categoryIcons[categoryId] || categoryIcons.apps;
    icon.setAttribute('aria-hidden', 'true');
    return icon;
  }

  function formatDate(value) {
    if (!value) return '';
    return String(value).replaceAll('-', '.');
  }

  function isExternalProject(project) {
    const url = project.url || '';
    if (typeof project.external === 'boolean') return project.external;
    return project.category === 'publishing' || project.category === 'media' || /upaper\.kr|youtube\.com|youtu\.be/i.test(url);
  }

  function trackedProjectUrl(url) {
    return `/go?to=${encodeURIComponent(url)}`;
  }

  function showAccessCount(value) {
    if (!accessCount || !Number.isFinite(Number(value))) return;
    accessCount.textContent = new Intl.NumberFormat('ko-KR').format(Number(value));
    accessCount.hidden = false;
  }

  async function requestAccessCount(op = 'get') {
    try {
      const response = await fetch(`${COUNTER_ENDPOINT}?op=${encodeURIComponent(op)}`, {method:'GET',cache:'no-store',credentials:'same-origin',headers:{Accept:'application/json'}});
      if (!response.ok) throw new Error(`counter HTTP ${response.status}`);
      const payload = await response.json();
      const value = Number(payload?.count);
      if (!payload?.ok || !Number.isFinite(value)) throw new Error('counter value missing');
      showAccessCount(value);
      return value;
    } catch (error) {
      console.warn('Nexus D1 access counter unavailable:', error);
      return null;
    }
  }

  function orderedCategories(categories, projects) {
    const byId = new Map(categories.map((category) => [category.id, category]));
    const ordered = [];
    portalTiers.forEach((tier) => tier.categoryIds.forEach((id) => {
      const category = byId.get(id);
      if (category && projects.some((project) => project.category === id)) ordered.push(category);
    }));
    categories.forEach((category) => {
      if (!ordered.some((item) => item.id === category.id) && projects.some((project) => project.category === category.id)) ordered.push(category);
    });
    return ordered;
  }

  function renderQuickLinks(categories, projects) {
    quickLinks.replaceChildren();
    categories.forEach((category) => {
      const count = projects.filter((project) => project.category === category.id).length;
      const link = make('a', `quick-link quick-link-${category.id}`);
      link.href = `#${category.id}`;
      link.dataset.category = category.id;
      link.append(
        makeCategoryIcon(category.id, 'quick-icon'),
        make('span', 'quick-label', category.title),
        make('span', 'quick-count', String(count))
      );
      quickLinks.append(link);
    });
  }

  function renderHeroOverview(categories, projects, updatedAt) {
    const old = document.querySelector('.portal-overview');
    if (old) old.remove();
    if (!quickLinks) return;
    const overview = make('div', 'portal-overview');
    const values = [
      ['분야', categories.length],
      ['프로젝트', projects.length],
      ['업데이트', formatDate(updatedAt) || '상시']
    ];
    values.forEach(([label, value]) => {
      const item = make('div', 'overview-item');
      item.append(make('span', '', label), make('strong', '', String(value)));
      overview.append(item);
    });
    quickLinks.insertAdjacentElement('afterend', overview);
  }

  function renderProject(project) {
    const article = make('article', 'item-card');
    const top = make('div', 'item-top');
    top.append(make('span', 'item-meta', project.meta || 'Project'));
    if (project.status) {
      const tone = ['fresh','active','stable','unknown'].includes(project.statusTone) ? project.statusTone : 'active';
      top.append(make('span', `project-status status-${tone}`, project.status));
    }
    const title = make('h3', '', project.title);
    const description = make('p', '', project.description);
    const actions = make('div', 'item-actions');
    const visit = make('a', 'visit-link');
    visit.href = trackedProjectUrl(project.url);
    visit.dataset.trackAccess = 'project';
    const external = isExternalProject(project);
    visit.target = external ? '_blank' : '_self';
    if (external) visit.rel = 'noopener noreferrer';
    visit.append(`${project.actionLabel || '바로가기'} `);
    const arrow = make('span', '', external ? '↗' : '→');
    arrow.setAttribute('aria-hidden', 'true');
    visit.append(arrow);
    const copy = make('button', 'copy-btn', '링크 복사');
    copy.type = 'button';
    copy.dataset.url = project.url;
    actions.append(visit, copy);
    article.append(top, title, description);
    if (project.managedBy === 'github' || project.managedBy === 'github-external') {
      const info = make('div', 'project-live-meta');
      if (Number.isFinite(project.contentCount)) info.append(make('span', '', `${project.contentLabel || '콘텐츠'} ${project.contentCount}`));
      if (project.lastUpdated) info.append(make('span', '', `업데이트 ${formatDate(project.lastUpdated)}`));
      if (info.childElementCount) article.append(info);
    }
    article.append(actions);
    return article;
  }

  function renderItemsGrid(projects) {
    const grid = make('div', `items-grid${projects.length === 1 ? ' one-item' : ''}`);
    projects.forEach((project) => grid.append(renderProject(project)));
    return grid;
  }

  function renderResearchGroup(group, projects) {
    const block = make('section', `research-subgroup research-subgroup-${group.id}`);
    block.setAttribute('aria-labelledby', `research-group-${group.id}`);
    const head = make('div', 'research-subgroup-head');
    head.append(make('p','eyebrow',group.eyebrow || 'RESEARCH'), make('h3','',group.title), make('p','research-subgroup-description',group.description || ''));
    head.querySelector('h3').id = `research-group-${group.id}`;
    block.append(head, renderItemsGrid(projects));
    return block;
  }

  function renderCategory(category, projects, researchGroups = [], variant = 'primary') {
    const section = make('section', `category-card category-${category.id} category-${variant}`);
    section.id = category.id;
    section.dataset.category = category.id;
    section.setAttribute('aria-labelledby', `${category.id}-title`);

    const head = make('div', 'category-head');
    const icon = make('div', `category-icon ${category.iconClass || ''}`);
    icon.append(makeCategoryIcon(category.id, 'category-icon-glyph'));
    icon.setAttribute('aria-hidden', 'true');

    const headText = make('div', 'category-copy');
    const titleRow = make('div', 'category-title-row');
    const title = make('h2', '', category.title);
    title.id = `${category.id}-title`;
    titleRow.append(title, make('span', 'category-count', `${projects.length} PROJECT${projects.length > 1 ? 'S' : ''}`));
    headText.append(make('p','eyebrow',category.eyebrow), titleRow, make('p','category-description',category.description));
    head.append(icon, headText);

    if (category.id === 'research' && researchGroups.length) {
      const groups = make('div', 'research-groups');
      const assigned = new Set();
      researchGroups.forEach((group) => {
        const groupProjects = projects.filter((project) => {
          const projectGroup = project.researchGroup || 'knowledge';
          if (projectGroup === group.id) { assigned.add(project.id); return true; }
          return false;
        });
        if (groupProjects.length) groups.append(renderResearchGroup(group, groupProjects));
      });
      const unassigned = projects.filter((project) => !assigned.has(project.id));
      if (unassigned.length) groups.append(renderResearchGroup({id:'other',eyebrow:'OTHER RESEARCH',title:'기타 연구',description:'기존 연구자료와 독립 프로젝트입니다.'}, unassigned));
      section.append(head, groups);
      return section;
    }

    section.append(head, renderItemsGrid(projects));
    return section;
  }

  function renderTier(tier, categories, projects, researchGroups) {
    const section = make('section', `portal-tier portal-tier-${tier.id}`);
    section.setAttribute('aria-labelledby', `tier-${tier.id}-title`);

    const head = make('div', 'portal-tier-head');
    const number = make('span', 'tier-number', tier.number);
    const copy = make('div', 'tier-copy');
    copy.append(make('p', 'eyebrow', tier.eyebrow), make('h2', '', tier.title), make('p', 'tier-description', tier.description));
    copy.querySelector('h2').id = `tier-${tier.id}-title`;
    head.append(number, copy);

    const grid = make('div', 'portal-tier-grid');
    tier.categoryIds.forEach((id) => {
      const category = categories.find((item) => item.id === id);
      if (!category) return;
      const categoryProjects = projects.filter((project) => project.category === id);
      if (!categoryProjects.length) return;
      grid.append(renderCategory(category, categoryProjects, researchGroups, tier.variant));
    });

    if (!grid.childElementCount) return null;
    section.append(head, grid);
    return section;
  }

  function renderPortal(data) {
    const categories = Array.isArray(data.categories) ? data.categories : [];
    const projects = Array.isArray(data.projects) ? data.projects : [];
    const researchGroups = Array.isArray(data.researchGroups) ? data.researchGroups : [];
    const visibleCategories = orderedCategories(categories, projects);

    renderQuickLinks(visibleCategories, projects);
    renderHeroOverview(visibleCategories, projects, data.updatedAt);
    portalGrid.replaceChildren();

    portalTiers.forEach((tier) => {
      const tierSection = renderTier(tier, visibleCategories, projects, researchGroups);
      if (tierSection) portalGrid.append(tierSection);
    });

    const tierIds = new Set(portalTiers.flatMap((tier) => tier.categoryIds));
    const extraCategories = visibleCategories.filter((category) => !tierIds.has(category.id));
    if (extraCategories.length) {
      const extraTier = {
        id: 'more', number: '04', eyebrow: 'MORE', title: '기타 영역',
        description: '추가된 프로젝트 영역입니다.', categoryIds: extraCategories.map((category) => category.id), variant: 'compact'
      };
      const tierSection = renderTier(extraTier, visibleCategories, projects, researchGroups);
      if (tierSection) portalGrid.append(tierSection);
    }
  }

  async function fetchJson(url) {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
    return response.json();
  }

  async function loadPortal() {
    try {
      const data = await fetchJson('./projects.json');
      let statusMap = {};
      try {
        statusMap = await fetchJson('./project-status.json');
      } catch (statusError) {
        console.warn('Nexus project status unavailable; rendering canonical project data only.', statusError);
      }
      const projects = (Array.isArray(data.projects) ? data.projects : []).map((project) => ({
        ...project,
        ...(statusMap?.[project.id] || {})
      }));
      renderPortal({ ...data, projects });
    } catch (error) {
      console.error('YEHAVHA Nexus data load failed:', error);
      portalGrid.replaceChildren(make('section', 'category-card', '프로젝트 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'));
    }
  }

  document.addEventListener('click', async (event) => {
    const button = event.target.closest('.copy-btn');
    if (button) {
      const url = button.dataset.url;
      if (!url) return;
      const previous = button.textContent;
      try { await copyText(url); button.textContent = '복사 완료'; showToast('프로젝트 링크를 복사했습니다.'); }
      catch (error) { window.prompt('아래 주소를 복사하세요.', url); }
      finally { window.setTimeout(() => { button.textContent = previous; }, 1400); }
      return;
    }
    const projectLink = event.target.closest('a[data-track-access="project"]');
    if (projectLink) return;
    const link = event.target.closest('a[href^="#"]');
    if (link) {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) target.setAttribute('tabindex', '-1');
    }
  });

  window.setTimeout(async () => {
    const value = await requestAccessCount('get');
    if (value === null) window.setTimeout(() => { void requestAccessCount('get'); }, 1800);
  }, 250);

  loadPortal();
})();
