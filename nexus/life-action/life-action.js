(() => {
  'use strict';

  const EVENT_FILES = {
    move: 'move.json', career: 'career.json', retire: 'retire.json',
    startup: 'startup.json', care: 'care.json', travel: 'travel.json'
  };
  const DAILY_DATA_URL = './daily-nexus.json';
  const kindLabel = { must: '해야 하는 것', risk: '놓치면 손해', execute: '지금 실행' };
  let graph = null;
  let currentEvent = 'move';
  let draftProfile = {};

  const $ = (id) => document.getElementById(id);
  const profileKey = () => `nexus2:${currentEvent}:profile`;
  const progressKey = () => `nexus2:${currentEvent}:progress`;

  function readJSON(key, fallback) {
    try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; }
    catch (_) { return fallback; }
  }

  function formatDailyDate(value) {
    if (!value) return '';
    const [year, month, day] = String(value).split('-');
    return `${year}.${month}.${day}`;
  }

  function dailyThumbnail(item) {
    if (item.youtubeId) return `https://i.ytimg.com/vi/${encodeURIComponent(item.youtubeId)}/hqdefault.jpg`;
    return item.image || '../assets/cards/strategy.webp';
  }

  function renderDailyItem(item) {
    const link = document.createElement('a');
    link.className = 'life-daily-item';
    link.href = item.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    const thumb = document.createElement('span');
    thumb.className = 'life-daily-thumb';
    const image = document.createElement('img');
    image.src = dailyThumbnail(item);
    image.alt = '';
    image.width = 640;
    image.height = 360;
    image.loading = 'lazy';
    image.decoding = 'async';
    thumb.append(image);

    const body = document.createElement('span');
    body.className = 'life-daily-body';
    const meta = document.createElement('span');
    meta.className = 'life-daily-meta';
    const source = document.createElement('span');
    source.textContent = item.source || 'NEXUS 선정';
    meta.append(source);
    if (item.meta) {
      const detail = document.createElement('span');
      detail.textContent = `· ${item.meta}`;
      meta.append(detail);
    }
    const title = document.createElement('strong');
    title.textContent = item.title;
    const reason = document.createElement('span');
    reason.className = 'life-daily-reason';
    reason.textContent = item.reason || '';
    const sourceLink = document.createElement('span');
    sourceLink.className = 'life-daily-source';
    sourceLink.textContent = item.youtubeId ? '영상 바로 보기 →' : '선정 자료 바로 보기 →';
    body.append(meta, title, reason, sourceLink);
    link.append(thumb, body);
    return link;
  }

  function renderDailySection(section) {
    const wrapper = document.createElement('section');
    wrapper.className = 'life-daily-section';
    const head = document.createElement('div');
    head.className = 'life-daily-section-title';
    const title = document.createElement('h3');
    title.textContent = section.title;
    const count = document.createElement('span');
    count.textContent = `${section.items?.length || 0}개 선정`;
    head.append(title, count);
    const items = document.createElement('div');
    items.className = 'life-daily-items';
    (section.items || []).forEach((item) => items.append(renderDailyItem(item)));
    wrapper.append(head, items);
    return wrapper;
  }

  async function loadDailyNexus() {
    const host = $('dailyNexus');
    if (!host) return;
    try {
      const response = await fetch(DAILY_DATA_URL, { cache: 'no-store' });
      if (!response.ok) throw new Error(`DAILY NEXUS load failed: ${response.status}`);
      const data = await response.json();
      host.replaceChildren();
      (data.sections || []).forEach((section) => host.append(renderDailySection(section)));
      if (!host.childElementCount) host.innerHTML = '<p class="life-empty">오늘 선정된 항목이 없습니다.</p>';
      if ($('dailyDate')) $('dailyDate').textContent = formatDailyDate(data.date);
    } catch (error) {
      host.innerHTML = '<p class="life-empty">오늘의 선별 정보를 불러오지 못했습니다.</p>';
      console.error(error);
    }
  }

  function daysUntil(dateString) {
    if (!dateString) return null;
    const target = new Date(`${dateString}T12:00:00`);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
    return Math.ceil((target - today) / 86400000);
  }

  function conditionMatches(conditions, profile) {
    if (!conditions) return true;
    return Object.entries(conditions).every(([key, allowed]) => allowed.includes(profile[key]));
  }

  function matchesConditions(action, profile) { return conditionMatches(action.conditions, profile); }
  function inputVisible(input, profile) { return conditionMatches(input.conditions, profile); }

  function defaultProfile() {
    if (!graph) return {};
    return Object.fromEntries((graph.inputs || []).map((input) => [input.id, input.default || '']));
  }

  function actionsForProfile(profile) {
    return graph.stages.flatMap((stage) => stage.actions
      .filter((action) => matchesConditions(action, profile))
      .map((action) => ({ ...action, stageId: stage.id, stageLabel: stage.label })));
  }

  function currentStage(days) {
    if (days === null) return graph.stages[0];
    const exact = graph.stages.find((stage) => days <= stage.fromDays && days >= stage.toDays);
    if (exact) return exact;
    if (days > graph.stages[0].fromDays) return graph.stages[0];
    return graph.stages[graph.stages.length - 1];
  }

  function dueActions(profile) {
    const stage = currentStage(daysUntil(profile.targetDate));
    return stage.actions.filter((action) => matchesConditions(action, profile)).sort((a,b) => b.priority - a.priority);
  }

  function fieldMarkup(input, value) {
    if (input.type === 'select') {
      const options = (input.options || []).map((option) => `<option value="${option.value}" ${String(value) === String(option.value) ? 'selected' : ''}>${option.label}</option>`).join('');
      return `<div class="life-field"><label for="field-${input.id}">${input.label}</label><select id="field-${input.id}" name="${input.id}">${options}</select></div>`;
    }
    return `<div class="life-field"><label for="field-${input.id}">${input.label}</label><input id="field-${input.id}" name="${input.id}" type="${input.type || 'text'}" value="${value || ''}" ${input.required ? 'required' : ''}/></div>`;
  }

  function renderForm(profile = {}) {
    draftProfile = { ...defaultProfile(), ...draftProfile, ...profile };
    const visibleInputs = (graph.inputs || []).filter((input) => inputVisible(input, draftProfile));
    $('lifeForm').innerHTML = `${visibleInputs.map((input) => fieldMarkup(input, draftProfile[input.id] ?? input.default ?? '')).join('')}<div class="life-form-actions"><button class="life-primary" type="submit">내 실행 순서 만들기</button><button class="life-secondary" id="resetLife" type="button">초기화</button></div>`;
    visibleInputs.forEach((input) => {
      const field = $(`field-${input.id}`);
      if (!field) return;
      field.addEventListener('change', () => {
        draftProfile[input.id] = field.value;
        if ((graph.inputs || []).some((item) => item.conditions && Object.prototype.hasOwnProperty.call(item.conditions, input.id))) renderForm(draftProfile);
      });
    });
    $('resetLife').addEventListener('click', resetCurrentEvent);
  }

  function collectProfile() {
    const profile = { ...draftProfile };
    (graph.inputs || []).forEach((input) => {
      const field = $(`field-${input.id}`);
      if (field) profile[input.id] = field.value;
    });
    draftProfile = profile;
    return profile;
  }

  function renderNow(profile) {
    const groups = { must: [], risk: [], execute: [] };
    dueActions(profile).forEach((action) => groups[action.kind].push(action));
    Object.entries(groups).forEach(([kind, actions]) => {
      const target = $(`now-${kind}`);
      if (!target) return;
      target.innerHTML = actions.length ? actions.slice(0,4).map((action) => `<article class="life-now-item"><strong>${action.title}</strong><p>${action.summary}</p>${action.url ? `<a class="life-action-link" href="${action.url}" target="_blank" rel="noopener noreferrer">${action.sourceLabel || '공식 경로'} 확인 →</a>` : ''}</article>`).join('') : '<p class="life-empty">현재 단계에서 별도 항목이 없습니다.</p>';
    });
  }

  function renderTimeline(profile) {
    const progress = readJSON(progressKey(), {});
    const timeline = $('lifeTimeline');
    timeline.innerHTML = '';
    graph.stages.forEach((stage) => {
      const actions = stage.actions.filter((action) => matchesConditions(action, profile));
      if (!actions.length) return;
      const completed = actions.filter((action) => progress[action.id]).length;
      const section = document.createElement('section');
      section.className = 'life-stage';
      section.innerHTML = `<div class="life-stage-head"><strong>${stage.label}</strong><span>${completed}/${actions.length} 완료</span></div><div class="life-actions">${actions.map((action) => `<label class="life-check ${progress[action.id] ? 'is-done' : ''}" data-action-id="${action.id}"><input type="checkbox" ${progress[action.id] ? 'checked' : ''}/><span class="life-check-copy"><strong>${action.title}</strong><p>${action.summary}${action.url ? ` · <a href="${action.url}" target="_blank" rel="noopener noreferrer">${action.sourceLabel || '공식 경로'}</a>` : ''}</p></span><span class="life-kind">${kindLabel[action.kind] || action.kind}</span></label>`).join('')}</div>`;
      timeline.appendChild(section);
    });
    timeline.querySelectorAll('.life-check input').forEach((input) => {
      input.addEventListener('change', (event) => {
        const label = event.target.closest('.life-check');
        const next = readJSON(progressKey(), {});
        next[label.dataset.actionId] = event.target.checked;
        localStorage.setItem(progressKey(), JSON.stringify(next));
        const saved = readJSON(profileKey(), null);
        if (saved && saved.targetDate) renderDashboard(saved); else renderTimeline(profile);
      });
    });
  }

  function renderSummary(profile) {
    const actions = actionsForProfile(profile);
    const progress = readJSON(progressKey(), {});
    const complete = actions.filter((action) => progress[action.id]).length;
    const days = daysUntil(profile.targetDate);
    $('totalActions').textContent = `${actions.length}개`;
    $('completedActions').textContent = `${complete}개`;
    $('targetSummaryLabel').textContent = graph.targetLabel || '기준일';
    $('targetSummaryValue').textContent = days === null ? '미설정' : days > 0 ? `D-${days}` : days === 0 ? 'D-DAY' : `D+${Math.abs(days)}`;
  }

  function renderDashboard(profile) { $('resultPanel').hidden = false; renderSummary(profile); renderNow(profile); renderTimeline(profile); }

  function resetCurrentEvent() {
    localStorage.removeItem(profileKey());
    localStorage.removeItem(progressKey());
    draftProfile = defaultProfile();
    renderForm(draftProfile);
    $('resultPanel').hidden = true;
    renderTimeline(draftProfile);
  }

  function setActiveButton(eventKey) {
    document.querySelectorAll('.life-event').forEach((button) => button.classList.toggle('is-active', button.dataset.event === eventKey));
  }

  async function loadEvent(eventKey, shouldScroll = false, restoreSaved = true) {
    if (!EVENT_FILES[eventKey]) return;
    currentEvent = eventKey;
    setActiveButton(eventKey);
    $('loadError').hidden = true;
    try {
      const response = await fetch(`./events/${EVENT_FILES[eventKey]}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`${eventKey} Action Graph load failed`);
      graph = await response.json();
      $('configureTitle').textContent = `${graph.title} 실행순서 만들기`;
      $('configureDescription').textContent = graph.subtitle || '조건을 선택하면 필요한 실행순서를 보여줍니다.';
      $('timelineTitle').textContent = `${graph.title} Action Graph`;
      $('timelineDescription').textContent = '전체 실행흐름을 시점별로 확인하고 완료상태를 남깁니다.';
      const saved = restoreSaved ? readJSON(profileKey(), null) : null;
      draftProfile = saved || defaultProfile();
      renderForm(draftProfile);
      renderTimeline(draftProfile);
      if (saved && saved.targetDate) renderDashboard(saved); else $('resultPanel').hidden = true;
      if (shouldScroll) $('configure').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (error) {
      $('loadError').hidden = false;
      $('lifeForm').innerHTML = '';
      $('lifeTimeline').innerHTML = '<p class="life-empty">실행 데이터를 불러오지 못했습니다.</p>';
      $('resultPanel').hidden = true;
      console.error(error);
    }
  }

  async function init() {
    loadDailyNexus();
    document.querySelectorAll('.life-event').forEach((button) => button.addEventListener('click', () => loadEvent(button.dataset.event, true, true)));
    $('lifeForm').addEventListener('submit', (event) => {
      event.preventDefault();
      if (!graph) return;
      const profile = collectProfile();
      localStorage.setItem(profileKey(), JSON.stringify(profile));
      renderDashboard(profile);
      $('resultPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    const requestedEvent = new URLSearchParams(window.location.search).get('event');
    const initialEvent = EVENT_FILES[requestedEvent] ? requestedEvent : 'move';
    await loadEvent(initialEvent, Boolean(EVENT_FILES[requestedEvent]), Boolean(EVENT_FILES[requestedEvent]));
  }

  document.addEventListener('DOMContentLoaded', init);
})();
