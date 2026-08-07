(() => {
  'use strict';

  const toast = document.getElementById('toast');
  const quickLinks = document.getElementById('quickLinks');
  const portalGrid = document.getElementById('portalGrid');
  let toastTimer;

  const iconMap = {
    apps: '📱',
    education: '🎓',
    research: '⚖️',
    publishing: '📚',
    media: '🎬'
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

  function renderQuickLinks(categories) {
    quickLinks.replaceChildren();
    categories.forEach((category) => {
      const link = make('a', 'quick-link');
      link.href = `#${category.id}`;
      link.append(`${category.icon || iconMap[category.id] || '•'} ${category.title}`);
      quickLinks.append(link);
    });
  }

  function renderProject(project) {
    const article = make('article', 'item-card');
    const top = make('div', 'item-top');
    top.append(make('span', 'item-meta', project.meta || 'Project'));

    const title = make('h3', '', project.title);
    const description = make('p', '', project.description);
    const actions = make('div', 'item-actions');

    const visit = make('a', 'visit-link');
    visit.href = project.url;
    visit.target = '_blank';
    visit.rel = 'noopener noreferrer';
    visit.append(`${project.actionLabel || '바로가기'} `);
    const arrow = make('span', '', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    visit.append(arrow);

    const copy = make('button', 'copy-btn', '링크 복사');
    copy.type = 'button';
    copy.dataset.url = project.url;

    actions.append(visit, copy);
    article.append(top, title, description, actions);
    return article;
  }

  function renderCategory(category, projects) {
    const section = make('section', 'category-card');
    section.id = category.id;
    section.setAttribute('aria-labelledby', `${category.id}-title`);

    const head = make('div', 'category-head');
    const icon = make('div', `category-icon ${category.iconClass || ''}`, category.icon || iconMap[category.id] || '•');
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

  async function loadPortal() {
    try {
      const response = await fetch('./projects.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
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
