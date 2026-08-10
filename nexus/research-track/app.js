(() => {
  'use strict';

  const data = window.RESEARCH_TRACK || {};
  const overviewGrid = document.getElementById('overviewGrid');
  const researchAxes = document.getElementById('researchAxes');
  const methodGrid = document.getElementById('methodGrid');
  const standardsList = document.getElementById('standardsList');
  const track = document.getElementById('track');
  const knowledge = document.getElementById('knowledgeGrid');
  const updatedAt = document.getElementById('updatedAt');

  function make(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function renderOverview(item) {
    const article = make('article', 'overview-card');
    article.append(make('span', 'overview-label', item.label), make('h3', '', item.title), make('p', '', item.description));
    return article;
  }

  function renderAxis(item) {
    const article = make('article', 'axis-card');
    const no = make('span', 'axis-no', item.no);
    const body = make('div', 'axis-body');
    body.append(make('h3', '', item.title), make('p', '', item.description));
    article.append(no, body);
    return article;
  }

  function renderMethod(item) {
    const article = make('article', 'method-card');
    article.append(make('h3', '', item.title), make('p', '', item.description));
    return article;
  }

  function renderStage(stage) {
    const article = make('article', `stage-card tone-${stage.tone || 'future'}`);
    article.id = stage.id;
    const rail = make('div', 'stage-rail');
    rail.append(make('span', 'stage-order', stage.order));
    const body = make('div', 'stage-body');
    const top = make('div', 'stage-top');
    const titleWrap = make('div', 'stage-title-wrap');
    titleWrap.append(make('p', 'eyebrow', stage.eyebrow), make('h2', '', stage.title));
    top.append(titleWrap, make('span', 'stage-status', stage.status));
    body.append(top, make('p', 'stage-summary', stage.summary));

    if (Array.isArray(stage.focus) && stage.focus.length) {
      const focus = make('div', 'stage-focus');
      stage.focus.forEach((item) => focus.append(make('span', '', item)));
      body.append(focus);
    }

    if (stage.deliverable) {
      const output = make('div', 'stage-output');
      output.append(make('span', 'output-label', '주요 산출물'), make('strong', '', stage.deliverable));
      body.append(output);
    }

    if (Array.isArray(stage.items) && stage.items.length) {
      const items = make('div', 'stage-items');
      stage.items.forEach((item) => {
        const box = make('div', 'stage-item');
        box.append(make('span', 'item-type', item.type), make('strong', '', item.title));
        if (item.note) box.append(make('p', '', item.note));
        if (item.url) {
          const link = make('a', 'item-link', '원문 보기 →');
          link.href = item.url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          box.append(link);
        }
        items.append(box);
      });
      body.append(items);
    } else {
      body.append(make('p', 'empty-note', '성과가 확정되면 이 단계에 순차적으로 추가합니다.'));
    }

    article.append(rail, body);
    return article;
  }

  function renderKnowledge(item) {
    const article = make('article', 'knowledge-card');
    article.append(make('h3', '', item.title), make('p', '', item.description));
    const link = make('a', '', '연구 기반 보기 →');
    link.href = item.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    article.append(link);
    return article;
  }

  (data.profile?.overview || []).forEach((item) => overviewGrid?.append(renderOverview(item)));
  (data.axes || []).forEach((item) => researchAxes?.append(renderAxis(item)));
  (data.methods || []).forEach((item) => methodGrid?.append(renderMethod(item)));
  (data.standards || []).forEach((item, index) => {
    const li = make('li', 'standard-item');
    li.append(make('span', 'standard-no', String(index + 1).padStart(2, '0')), make('span', '', item));
    standardsList?.append(li);
  });
  (data.stages || []).forEach((stage) => track?.append(renderStage(stage)));
  (data.knowledge || []).forEach((item) => knowledge?.append(renderKnowledge(item)));

  if (updatedAt && data.updatedAt) updatedAt.textContent = `업데이트 ${String(data.updatedAt).replaceAll('-', '.')}`;
})();
