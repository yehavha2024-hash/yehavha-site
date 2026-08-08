(() => {
  'use strict';

  const toast = document.getElementById('toast');
  const quickLinks = document.getElementById('quickLinks');
  const portalGrid = document.getElementById('portalGrid');
  let toastTimer;

  const categoryNumber = {
    apps: '01',
    research: '02',
    publishing: '03',
    media: '04',
    education: '05'
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

  function formatDate(value) {
    if (!value) return '';
    return String(value).replaceAll('-', '.');
  }

  function isExternalProject(project) {
    const url = project.url || '';
    return project.category === 'publishing' || project.category === 'media' || /upaper\.kr|youtube\.com|youtu\.be/i.test(url);
  }

  function renderQuickLinks(categories) {
    quickLinks.replaceChildren();
    categories.forEach((category) => {
      const link = make('a', 'quick-link');
      link.href = `#${category.id}`;
      link.append(`${categoryNumber[category.id] || '00'} ${category.title}`);
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
    const icon = make('div', `category-icon ${category.iconClass || ''}`, categoryNumber[category.id] || '00');
    icon.setAttribute('aria-hidden', 'true');

    const headText = make('div');
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

    const link = event.target.closest('a[href^="#"]');
    if (link) {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) target.setAttribute('tabindex', '-1');
    }
  });

  loadPortal();
})();
