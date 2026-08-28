(() => {
  'use strict';

  const data = window.RESEARCH_TRACK || {};
  const caseStudies = window.RESEARCH_CASES || [];
  const overviewGrid = document.getElementById('overviewGrid');
  const researchAxes = document.getElementById('researchAxes');
  const methodGrid = document.getElementById('methodGrid');
  const standardsList = document.getElementById('standardsList');
  const track = document.getElementById('track');
  const legalCases = document.getElementById('legalCases');
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

  function renderStageDetail(detail) {
    const section = make('section', 'thesis-brief');
    section.setAttribute('aria-label', detail.label || '연구 핵심 요약');

    const head = make('div', 'brief-head');
    head.append(make('span', 'brief-label', detail.label || '연구 핵심 요약'));
    if (detail.title) head.append(make('h3', '', detail.title));
    section.append(head);

    if (detail.lead) section.append(make('p', 'brief-lead', detail.lead));

    if (Array.isArray(detail.toc) && detail.toc.length) {
      const toc = make('div', 'brief-toc');
      detail.toc.forEach((item, index) => {
        const chip = make('span', 'brief-toc-item');
        chip.append(make('b', '', String(index + 1).padStart(2, '0')), document.createTextNode(item));
        toc.append(chip);
      });
      section.append(toc);
    }

    if (Array.isArray(detail.sections) && detail.sections.length) {
      const grid = make('div', 'brief-grid');
      detail.sections.forEach((item, index) => {
        const article = make('article', 'brief-section');
        const title = make('div', 'brief-section-title');
        title.append(make('span', '', String(index + 1).padStart(2, '0')), make('h4', '', item.title));
        article.append(title, make('p', '', item.text));
        grid.append(article);
      });
      section.append(grid);
    }

    if (Array.isArray(detail.flow) && detail.flow.length) {
      const block = make('div', 'brief-block');
      block.append(make('p', 'brief-block-title', '핵심 책임귀속 구조'));
      const flow = make('div', 'brief-flow');
      detail.flow.forEach((item, index) => {
        const step = make('div', 'flow-step');
        step.append(make('span', 'flow-no', String(index + 1).padStart(2, '0')), make('strong', '', item));
        flow.append(step);
      });
      block.append(flow);
      section.append(block);
    }

    if (Array.isArray(detail.contributions) && detail.contributions.length) {
      const block = make('div', 'brief-block');
      block.append(make('p', 'brief-block-title', '연구의 학술적 의미'));
      const grid = make('div', 'contribution-grid');
      detail.contributions.forEach((item) => {
        const card = make('article', 'contribution-card');
        card.append(make('h4', '', item.title), make('p', '', item.text));
        grid.append(card);
      });
      block.append(grid);
      section.append(block);
    }

    if (detail.note) section.append(make('p', 'brief-note', detail.note));
    return section;
  }

  function renderStage(stage) {
    const article = make('article', `stage-card tone-${stage.tone || 'future'}`);
    article.id = stage.id;
    article.style.display = 'block';

    const body = make('div', 'stage-body');
    const top = make('div', 'stage-top');
    const titleWrap = make('div', 'stage-title-wrap');
    titleWrap.append(make('p', 'eyebrow', stage.eyebrow));

    const heading = make('div', 'stage-heading');
    heading.style.display = 'flex';
    heading.style.alignItems = 'baseline';
    heading.style.gap = '10px';
    heading.append(make('span', 'stage-order', stage.order), make('h2', '', stage.title));
    titleWrap.append(heading);

    top.append(titleWrap, make('span', 'stage-status', stage.status));
    body.append(top, make('p', 'stage-summary', stage.summary));

    if (Array.isArray(stage.focus) && stage.focus.length) {
      const focus = make('div', 'stage-focus');
      stage.focus.forEach((item) => focus.append(make('span', '', item)));
      body.append(focus);
    }

    if (stage.deliverable && stage.id !== 'master') {
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

    if (stage.detail) body.append(renderStageDetail(stage.detail));

    article.append(body);
    return article;
  }

  function renderCaseBlock(label, items) {
    const section = make('section', 'thesis-brief');
    const head = make('div', 'brief-head');
    head.append(make('span', 'brief-label', label));
    section.append(head);

    const grid = make('div', 'brief-grid');
    items.forEach((item, index) => {
      const card = make('article', 'brief-section');
      const title = make('div', 'brief-section-title');
      title.append(make('span', '', String(index + 1).padStart(2, '0')), make('h4', '', item.title));
      card.append(title, make('p', '', item.text));
      grid.append(card);
    });
    section.append(grid);
    return section;
  }

  function renderCaseStudy(item) {
    const article = make('article', 'stage-card tone-active');
    article.id = item.id;
    article.style.display = 'block';

    const body = make('div', 'stage-body');
    const top = make('div', 'stage-top');
    const titleWrap = make('div', 'stage-title-wrap');
    titleWrap.append(make('p', 'eyebrow', item.eyebrow || 'LEGAL CASE STUDY'));

    const heading = make('div', 'stage-heading');
    heading.style.display = 'flex';
    heading.style.alignItems = 'baseline';
    heading.style.gap = '10px';
    heading.append(make('span', 'stage-order', item.order || 'CASE'), make('h2', '', item.title));
    titleWrap.append(heading);

    top.append(titleWrap, make('span', 'stage-status', item.status || '검토'));
    body.append(top, make('p', 'stage-summary', item.summary));
    if (item.classification) body.append(make('p', 'brief-note', item.classification));

    if (Array.isArray(item.focus) && item.focus.length) {
      const focus = make('div', 'stage-focus');
      item.focus.forEach((tag) => focus.append(make('span', '', tag)));
      body.append(focus);
    }

    if (Array.isArray(item.facts) && item.facts.length) body.append(renderCaseBlock('검증된 사실관계', item.facts));
    if (Array.isArray(item.legalIssues) && item.legalIssues.length) body.append(renderCaseBlock('핵심 법적 쟁점', item.legalIssues));
    if (Array.isArray(item.researchLinks) && item.researchLinks.length) body.append(renderCaseBlock('심화연구 연결', item.researchLinks));

    if (Array.isArray(item.sources) && item.sources.length) {
      const section = make('section', 'thesis-brief');
      const head = make('div', 'brief-head');
      head.append(make('span', 'brief-label', '원자료·법령 원문'));
      section.append(head);

      const items = make('div', 'stage-items');
      item.sources.forEach((source) => {
        const box = make('div', 'stage-item');
        box.append(make('span', 'item-type', source.type), make('strong', '', source.title));
        if (source.note) box.append(make('p', '', source.note));
        if (source.url) {
          const link = make('a', 'item-link', '원자료 보기 →');
          link.href = source.url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          box.append(link);
        }
        items.append(box);
      });
      section.append(items);
      if (item.sourcePolicy) section.append(make('p', 'brief-note', item.sourcePolicy));
      body.append(section);
    }

    article.append(body);
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
  caseStudies.forEach((item) => legalCases?.append(renderCaseStudy(item)));
  (data.knowledge || []).forEach((item) => knowledge?.append(renderKnowledge(item)));

  if (updatedAt && data.updatedAt) updatedAt.textContent = `업데이트 ${String(data.updatedAt).replaceAll('-', '.')}`;
})();