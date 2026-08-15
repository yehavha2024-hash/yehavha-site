(() => {
  'use strict';

  const data = window.TOEIC_HUMAN_V2 || {};
  const overviewGrid = document.getElementById('overviewGrid');
  const formatGrid = document.getElementById('formatGrid');
  const principlesList = document.getElementById('principlesList');
  const tree = document.getElementById('learningTree');
  const branchesWrap = document.getElementById('branches');
  const updatedAt = document.getElementById('updatedAt');
  const completedCount = document.getElementById('completedCount');
  const progressBar = document.getElementById('progressBar');
  const STORAGE_KEY = 'toeic-human-v2-completed';

  function make(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function loadCompleted() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return new Set(Array.isArray(parsed) ? parsed.map(Number) : []);
    } catch {
      return new Set();
    }
  }

  function saveCompleted(set) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set].sort((a, b) => a - b)));
  }

  const completed = loadCompleted();

  function updateProgress() {
    const count = completed.size;
    if (completedCount) completedCount.textContent = `${count} / 100`;
    if (progressBar) progressBar.style.width = `${Math.min(100, count)}%`;
    document.querySelectorAll('[data-complete-day]').forEach((button) => {
      const day = Number(button.dataset.completeDay);
      const done = completed.has(day);
      button.classList.toggle('is-complete', done);
      button.textContent = done ? '완료됨 ✓' : '학습 완료';
    });
    document.querySelectorAll('[data-day-card]').forEach((card) => {
      card.classList.toggle('day-complete', completed.has(Number(card.dataset.dayCard)));
    });
  }

  function renderOverview(item) {
    const card = make('article', 'overview-card');
    card.append(
      make('span', 'overview-label', item.label),
      make('h3', '', item.title),
      make('p', '', item.description)
    );
    return card;
  }

  function renderFormat(item) {
    const card = make('article', 'format-card');
    const no = make('span', 'format-no', item.no);
    const body = make('div', 'format-body');
    body.append(
      make('h3', '', item.title),
      make('strong', 'format-target', item.target),
      make('p', '', item.description)
    );
    card.append(no, body);
    return card;
  }

  function renderTree() {
    if (!tree) return;
    const root = make('div', 'tree-root');
    const parent = make('a', 'tree-node tree-parent');
    parent.href = data.parent?.url || '#';
    parent.target = '_blank';
    parent.rel = 'noopener noreferrer';
    parent.append(
      make('span', 'tree-kicker', 'FOUNDATION'),
      make('strong', '', data.parent?.title || '토익인간 100일 프로젝트'),
      make('small', '', data.parent?.role || '')
    );

    const connector = make('div', 'tree-connector', '↓');
    const v2 = make('div', 'tree-node tree-v2');
    v2.append(
      make('span', 'tree-kicker', 'ADVANCED CHILD TREE'),
      make('strong', '', data.title || '심화 토익인간 V2'),
      make('small', '', 'V1의 부족한 영역만 심화하는 독립 100일 하위 트리')
    );
    root.append(parent, connector, v2);

    const branchGrid = make('div', 'tree-branches');
    (data.branches || []).forEach((branch) => {
      const link = make('a', 'tree-branch');
      link.href = `#${branch.id}`;
      link.append(
        make('span', 'branch-order', branch.order),
        make('strong', '', branch.title),
        make('small', '', branch.days)
      );
      branchGrid.append(link);
    });
    root.append(branchGrid);
    tree.append(root);
  }

  function stageCard(no, title, body, output) {
    const card = make('div', 'day-stage');
    const head = make('div', 'day-stage-head');
    head.append(make('span', 'day-stage-no', no), make('strong', '', title));
    card.append(head, make('p', '', body));
    if (output) card.append(make('small', 'stage-output', output));
    return card;
  }

  function renderDay(branch, focus, dayNo) {
    const details = make('details', 'day-card');
    details.dataset.dayCard = String(dayNo);
    const summary = make('summary', 'day-summary');
    const dayLabel = make('span', 'day-number', `DAY ${String(dayNo).padStart(3, '0')}`);
    const titleWrap = make('span', 'day-title-wrap');
    titleWrap.append(make('strong', '', focus[0]), make('small', '', focus[1]));
    summary.append(dayLabel, titleWrap, make('span', 'day-chevron', '+'));

    const body = make('div', 'day-body');
    const point = make('div', 'day-focus-box');
    point.append(make('span', 'focus-label', '오늘의 심화 포인트'), make('p', '', focus[1]));
    body.append(point);

    const stages = make('div', 'day-stages');
    stages.append(
      stageCard('01', '심화독해', `${branch.readingFocus} 오늘은 특히 ‘${focus[0]}’이 실제 문맥에서 어떻게 작동하는지 표시하면서 읽습니다.`, '산출물: 문단기능 표시 + 핵심 근거 3개'),
      stageCard('02', '해부·학습', `${branch.studyFocus} 오늘의 핵심개념을 단독 암기가 아니라 문장·결합·대조관계 속에서 정리합니다.`, '산출물: 핵심어휘 18 + 결합 8 + 구문 4'),
      stageCard('03', '추론·문제', `${branch.questionFocus} 선택한 답마다 본문 근거를 붙이고 나머지 선택지가 왜 틀렸는지 한 줄로 설명합니다.`, '산출물: 근거형 문제 6 + 오답원인 기록'),
      stageCard('04', '전이·속도', `${branch.transferFocus} 같은 기술을 새로운 문서와 문장에 옮겨 적용해 단순 암기가 아닌 전이를 확인합니다.`, '산출물: 압축요약·재작성·시간훈련')
    );
    body.append(stages);

    const actions = make('div', 'day-actions');
    const complete = make('button', 'complete-btn', '학습 완료');
    complete.type = 'button';
    complete.dataset.completeDay = String(dayNo);
    complete.addEventListener('click', (event) => {
      event.preventDefault();
      if (completed.has(dayNo)) completed.delete(dayNo);
      else completed.add(dayNo);
      saveCompleted(completed);
      updateProgress();
    });
    actions.append(complete);
    body.append(actions);

    details.append(summary, body);
    return details;
  }

  function renderBranch(branch, branchIndex) {
    const section = make('section', 'branch-card');
    section.id = branch.id;
    const rail = make('div', 'branch-rail');
    rail.append(make('span', 'branch-big-no', branch.order));

    const body = make('div', 'branch-body');
    const top = make('div', 'branch-top');
    const titleWrap = make('div', 'branch-title-wrap');
    titleWrap.append(make('p', 'eyebrow', branch.eyebrow), make('h2', '', branch.title));
    top.append(titleWrap, make('span', 'branch-days', branch.days));
    body.append(top);

    const gap = make('div', 'gap-box');
    gap.append(make('span', 'gap-label', 'V1 보완점'), make('p', '', branch.gap));
    body.append(gap);

    const axisGrid = make('div', 'branch-axis-grid');
    [
      ['독해', branch.readingFocus],
      ['학습', branch.studyFocus],
      ['문제', branch.questionFocus],
      ['전이', branch.transferFocus]
    ].forEach(([label, text]) => {
      const item = make('div', 'branch-axis');
      item.append(make('strong', '', label), make('p', '', text));
      axisGrid.append(item);
    });
    body.append(axisGrid);

    const dayList = make('div', 'day-list');
    (branch.focuses || []).forEach((focus, index) => {
      const dayNo = branchIndex * 10 + index + 1;
      dayList.append(renderDay(branch, focus, dayNo));
    });
    body.append(dayList);
    section.append(rail, body);
    return section;
  }

  (data.overview || []).forEach((item) => overviewGrid?.append(renderOverview(item)));
  (data.dailyFormat || []).forEach((item) => formatGrid?.append(renderFormat(item)));
  (data.principles || []).forEach((text, index) => {
    const li = make('li', 'principle-item');
    li.append(make('span', 'principle-no', String(index + 1).padStart(2, '0')), make('span', '', text));
    principlesList?.append(li);
  });
  renderTree();
  (data.branches || []).forEach((branch, index) => branchesWrap?.append(renderBranch(branch, index)));

  if (updatedAt && data.updatedAt) updatedAt.textContent = `업데이트 ${String(data.updatedAt).replaceAll('-', '.')}`;
  updateProgress();
})();
