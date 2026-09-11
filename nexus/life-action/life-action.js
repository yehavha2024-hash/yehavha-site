(() => {
  'use strict';

  const PROFILE_KEY = 'nexus2:moveProfile';
  const PROGRESS_KEY = 'nexus2:moveProgress';
  const kindLabel = { must: '해야 하는 것', risk: '놓치면 손해', execute: '지금 실행' };
  let graph = null;

  const $ = (id) => document.getElementById(id);

  function readJSON(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch (_) {
      return fallback;
    }
  }

  function daysUntil(dateString) {
    if (!dateString) return null;
    const target = new Date(`${dateString}T12:00:00`);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
    return Math.ceil((target - today) / 86400000);
  }

  function matchesConditions(action, profile) {
    if (!action.conditions) return true;
    return Object.entries(action.conditions).every(([key, allowed]) => allowed.includes(profile[key]));
  }

  function actionsForProfile(profile) {
    return graph.stages.flatMap((stage) => stage.actions
      .filter((action) => matchesConditions(action, profile))
      .map((action) => ({ ...action, stageId: stage.id, stageLabel: stage.label, fromDays: stage.fromDays, toDays: stage.toDays }))
    );
  }

  function currentStage(days) {
    if (days === null) return graph.stages[0];
    const exact = graph.stages.find((stage) => days <= stage.fromDays && days >= stage.toDays);
    if (exact) return exact;
    if (days > graph.stages[0].fromDays) return graph.stages[0];
    return graph.stages[graph.stages.length - 1];
  }

  function dueActions(profile) {
    const days = daysUntil(profile.moveDate);
    const stage = currentStage(days);
    return stage.actions
      .filter((action) => matchesConditions(action, profile))
      .sort((a, b) => b.priority - a.priority);
  }

  function renderNow(profile) {
    const groups = { must: [], risk: [], execute: [] };
    dueActions(profile).forEach((action) => groups[action.kind].push(action));

    Object.entries(groups).forEach(([kind, actions]) => {
      const target = $(`now-${kind}`);
      if (!target) return;
      if (!actions.length) {
        target.innerHTML = '<p class="life-empty">현재 단계에서 별도 항목이 없습니다.</p>';
        return;
      }
      target.innerHTML = actions.slice(0, 3).map((action) => `
        <article class="life-now-item">
          <strong>${action.title}</strong>
          <p>${action.summary}</p>
          ${action.url ? `<a class="life-action-link" href="${action.url}" target="_blank" rel="noopener noreferrer">${action.sourceLabel || '공식 경로'} 확인 →</a>` : ''}
        </article>
      `).join('');
    });
  }

  function renderTimeline(profile) {
    const progress = readJSON(PROGRESS_KEY, {});
    const timeline = $('lifeTimeline');
    timeline.innerHTML = '';

    graph.stages.forEach((stage) => {
      const actions = stage.actions.filter((action) => matchesConditions(action, profile));
      if (!actions.length) return;
      const completed = actions.filter((action) => progress[action.id]).length;
      const section = document.createElement('section');
      section.className = 'life-stage';
      section.innerHTML = `
        <div class="life-stage-head"><strong>${stage.label}</strong><span>${completed}/${actions.length} 완료</span></div>
        <div class="life-actions">
          ${actions.map((action) => `
            <label class="life-check ${progress[action.id] ? 'is-done' : ''}" data-action-id="${action.id}">
              <input type="checkbox" ${progress[action.id] ? 'checked' : ''} />
              <span class="life-check-copy"><strong>${action.title}</strong><p>${action.summary}${action.url ? ` · <a href="${action.url}" target="_blank" rel="noopener noreferrer">${action.sourceLabel || '공식 경로'}</a>` : ''}</p></span>
              <span class="life-kind">${kindLabel[action.kind] || action.kind}</span>
            </label>
          `).join('')}
        </div>
      `;
      timeline.appendChild(section);
    });

    timeline.querySelectorAll('.life-check input').forEach((input) => {
      input.addEventListener('change', (event) => {
        const label = event.target.closest('.life-check');
        const id = label.dataset.actionId;
        const next = readJSON(PROGRESS_KEY, {});
        next[id] = event.target.checked;
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
        renderDashboard(profile);
      });
    });
  }

  function renderSummary(profile) {
    const actions = actionsForProfile(profile);
    const progress = readJSON(PROGRESS_KEY, {});
    const complete = actions.filter((action) => progress[action.id]).length;
    const days = daysUntil(profile.moveDate);
    $('totalActions').textContent = `${actions.length}개`;
    $('completedActions').textContent = `${complete}개`;
    $('moveDday').textContent = days === null ? '미설정' : days > 0 ? `D-${days}` : days === 0 ? 'D-DAY' : `D+${Math.abs(days)}`;
  }

  function renderDashboard(profile) {
    $('resultPanel').hidden = false;
    renderSummary(profile);
    renderNow(profile);
    renderTimeline(profile);
  }

  function applyProfile(profile) {
    if (!profile) return;
    $('moveDate').value = profile.moveDate || '';
    $('region').value = profile.region || 'seoul';
    $('residence').value = profile.residence || 'owner';
    $('household').value = profile.household || 'solo';
    if (profile.moveDate) renderDashboard(profile);
  }

  async function init() {
    try {
      const response = await fetch('./events/move.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Action Graph load failed');
      graph = await response.json();
      $('graphVersion').textContent = `Action Data v${graph.version} · ${graph.updatedAt}`;
      applyProfile(readJSON(PROFILE_KEY, null));
    } catch (error) {
      $('loadError').hidden = false;
      console.error(error);
    }

    $('moveEvent').addEventListener('click', () => $('configure').scrollIntoView({ behavior: 'smooth', block: 'start' }));

    $('lifeForm').addEventListener('submit', (event) => {
      event.preventDefault();
      if (!graph) return;
      const profile = {
        moveDate: $('moveDate').value,
        region: $('region').value,
        residence: $('residence').value,
        household: $('household').value
      };
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      renderDashboard(profile);
      $('resultPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    $('resetLife').addEventListener('click', () => {
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(PROGRESS_KEY);
      $('lifeForm').reset();
      $('resultPanel').hidden = true;
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
