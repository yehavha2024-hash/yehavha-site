(() => {
  'use strict';

  const root = document.getElementById('nexusFrontline');
  if (!root) return;

  const dateEl = root.querySelector('#todayNexusDate');
  const projectCountEl = root.querySelector('#frontlineProjectCount');
  const categoryCountEl = root.querySelector('#frontlineCategoryCount');
  const updatedEl = root.querySelector('#frontlineUpdatedAt');
  const barsEl = root.querySelector('#frontlineDistribution');

  const formatKoreaDate = () => {
    const parts = new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short'
    }).formatToParts(new Date());
    const map = Object.fromEntries(parts.map(part => [part.type, part.value]));
    return `${map.year}.${map.month}.${map.day} ${map.weekday}`;
  };

  if (dateEl) dateEl.textContent = formatKoreaDate();

  const renderDistribution = (categories, projects) => {
    if (!barsEl) return;
    const counts = categories
      .map(category => ({
        label: category.title,
        count: projects.filter(project => project.category === category.id).length
      }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'ko-KR'))
      .slice(0, 7);

    const max = Math.max(1, ...counts.map(item => item.count));
    barsEl.replaceChildren();

    for (const item of counts) {
      const row = document.createElement('div');
      row.className = 'distribution-row';

      const label = document.createElement('span');
      label.className = 'distribution-label';
      label.textContent = item.label;
      label.title = item.label;

      const track = document.createElement('span');
      track.className = 'distribution-track';
      track.setAttribute('aria-hidden', 'true');

      const fill = document.createElement('span');
      fill.className = 'distribution-fill';
      fill.style.width = `${Math.max(5, (item.count / max) * 100)}%`;
      track.append(fill);

      const count = document.createElement('span');
      count.className = 'distribution-count';
      count.textContent = String(item.count);

      row.append(label, track, count);
      barsEl.append(row);
    }
  };

  fetch('./projects.json', {cache: 'no-store'})
    .then(response => {
      if (!response.ok) throw new Error(`projects.json HTTP ${response.status}`);
      return response.json();
    })
    .then(data => {
      const categories = Array.isArray(data.categories) ? data.categories : [];
      const projects = Array.isArray(data.projects) ? data.projects : [];
      if (projectCountEl) projectCountEl.textContent = new Intl.NumberFormat('ko-KR').format(projects.length);
      if (categoryCountEl) categoryCountEl.textContent = new Intl.NumberFormat('ko-KR').format(categories.length + 2);
      if (updatedEl) updatedEl.textContent = data.updatedAt ? String(data.updatedAt).replaceAll('-', '.') : '확인 중';
      renderDistribution(categories, projects);
    })
    .catch(error => {
      console.warn('Nexus frontline data unavailable:', error);
      if (projectCountEl) projectCountEl.textContent = '—';
      if (categoryCountEl) categoryCountEl.textContent = '—';
      if (updatedEl) updatedEl.textContent = '확인 불가';
      if (barsEl) barsEl.textContent = '구성 데이터를 불러오지 못했습니다.';
    });
})();