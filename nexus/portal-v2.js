(() => {
  'use strict';

  const toast = document.getElementById('toast');
  const quickLinks = document.getElementById('quickLinks');
  const portalGrid = document.getElementById('portalGrid');
  const accessCount = document.getElementById('accessCount');
  let toastTimer;

  const COUNTER_BASE = 'https://api.counterapi.dev/v1/yehavha-nexus-6f2a9c1d/network-access';

  const categoryIcons = {
    apps: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/></svg>',
    research: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 7.2 10 10M17 7.2 14 10M7 16.8 10 14M17 16.8 14 14"/></svg>',
    publishing: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5c3.2-.7 5.8 0 8 2v11c-2.2-2-4.8-2.7-8-2V5.5Z"/><path d="M20 5.5c-3.2-.7-5.8 0-8 2v11c2.2-2 4.8-2.7 8-2V5.5Z"/></svg>',
    media: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="m10 8.7 5.4 3.3-5.4 3.3V8.7Z"/></svg>',
    education: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 9 9-4 9 4-9 4-9-4Z"/><path d="M6.5 11v4.5c3.5 2.3 7.5 2.3 11 0V11"/><path d="M21 9v5"/></svg>'
  };

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
    return project.category === 'publishing' || project.category === 'media' || /upaper\.kr|youtube\.com|youtu\.be/i.test(url);
  }

  function extractCount(payload) {
    const candidates = [
      payload?.count,
      payload?.value,
      payload?.data?.count,
      payload?.data?.value,
      payload?.counter?.count,
      payload?.counter?.value
    ];
    const found = candidates.find((value) => Number.isFinite(Number(value)));
    return found === undefined ? null : Number(found);
  }

  function showAccessCount(value) {
    if (!accessCount || !Number.isFinite(value)) return;
    accessCount.textContent = new Intl.NumberFormat('ko-KR').format(value);
    accessCount.hidden = false;
  }

  async function bumpAccessCount() {
    try {
      const response = await fetch(`${COUNTER_BASE}/up`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-store',
        keepalive: true,
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error(`counter HTTP ${response.status}`);
      const payload = await response.json();
      const value = extractCount(payload);
      if (value !== null) showAccessCount(value);
      return value;
    } catch (error) {
      console.warn('Nexus access counter unavailable:', error);
      return null;
    }
  }

  function renderQuickLinks(categories) {
    quickLinks.replaceChildren();
    categories.forEach((category) => {
      const link = make('a', 'quick-link');
      link.href = `#${category.id}`;
      link.append(makeCategoryIcon(category.id, 'quick-icon'), make('span', 'quick-label', category.title));
      quickLinks.append(link);
    });
  }

  function renderProject(project) {
    const article = make('article', 'item-card');
    const top = make('div', 'item-top');
    top.append(make('span', 'item-meta', project.meta || 'Project'));

    if (project.status) {
      const tone = ['fresh', 'active', 'stable', 'unknown'].includes(project.statusTone)
        ? project.statusTone
        : 'active';
      top.append(make('span', `project-status status-${tone}`, project.status));
    }

    const title = make('h3', '', project.title);
    const description = make('p', '', project.description);
    const actions = make('div', 'item-actions');

    const visit = make('a', 'visit-link');
    visit.href = project.url;
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
      if (Number.isFinite(project.contentCount)) {
        info.append(make('span', '', `${project.contentLabel || '콘텐츠'} ${project.contentCount}`));
      }
      if (project.lastUpdated) {
        info.append(make('span', '', `업데이트 ${formatDate(project.lastUpdated)}`));
      }
      if (info.childElementCount) article.append(info);
    }

    article.append(actions);
    return article;
  }

  function renderCategory(category, projects) {
    const section = make('section', 'category-card');
    section.id = category.id;
    section.setAttribute('aria-labelledby', `${category.id}-title`);

    const head = make('div', 'category-head');
    const icon = make('div', `category-icon ${category.iconClass || ''}`);
    icon.append(makeCategoryIcon(category.id, 'category-icon-glyph'));
    icon.setAttribute('aria-hidden', 'true');

    const headText = make('div', 'category-copy');
    headText.append(
      make('p', 'eyebrow', category.eyebrow),
      make('h2', '', category.title),
      make('p', 'category-description', category.description)
    );
    headText.querySelector('h2').id = `${category.id}-title`;
    head.append(icon, headText);

    const grid = make('div', `items-grid${projects.length === 1 ? ' one-item' : ''}`);
    projects.forEach((project) => grid.append(renderProject(project)));
    section.append(head, grid);
    return section;
  }

  function renderPortal(data) {
    const categories = Array.isArray(data.categories) ? data.categories : [];
    const projects = Array.isArray(data.projects) ? data.projects : [];

    renderQuickLinks(categories);
    portalGrid.replaceChildren();

    categories.forEach((category) => {
      const categoryProjects = projects.filter((project) => project.category === category.id);
      if (categoryProjects.length) portalGrid.append(renderCategory(category, categoryProjects));
    });
  }

  async function fetchJson(url) {
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
    return response.json();
  }

  async function loadPortal() {
    try {
      let data;
      try {
        data = await fetchJson('./projects.generated.json');
      } catch (generatedError) {
        console.warn('Generated Nexus data unavailable; using base projects.json.', generatedError);
        data = await fetchJson('./projects.json');
      }
      renderPortal(data);
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
      try {
        await copyText(url);
        button.textContent = '복사 완료';
        showToast('프로젝트 링크를 복사했습니다.');
      } catch (error) {
        window.prompt('아래 주소를 복사하세요.', url);
      } finally {
        window.setTimeout(() => { button.textContent = previous; }, 1400);
      }
      return;
    }

    const projectLink = event.target.closest('a[data-track-access="project"]');
    if (projectLink) {
      const newTab = projectLink.target === '_blank' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
      if (newTab) {
        void bumpAccessCount();
        return;
      }

      event.preventDefault();
      const href = projectLink.href;
      await Promise.race([
        bumpAccessCount(),
        new Promise((resolve) => window.setTimeout(resolve, 220))
      ]);
      window.location.assign(href);
      return;
    }

    const link = event.target.closest('a[href^="#"]');
    if (link) {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) target.setAttribute('tabindex', '-1');
    }
  });

  void bumpAccessCount();
  loadPortal();
})();
