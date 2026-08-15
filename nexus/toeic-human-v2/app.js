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
    card.append(make('span', 'overview-label', item.label), make('h3', '', item.title), make('p', '', item.description));
    return card;
  }

  function renderFormat(item) {
    const card = make('article', 'format-card');
    const no = make('span', 'format-no', item.no);
    const body = make('div', 'format-body');
    body.append(make('h3', '', item.title), make('strong', 'format-target', item.target), make('p', '', item.description));
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
    parent.append(make('span', 'tree-kicker', 'FOUNDATION'), make('strong', '', data.parent?.title || '토익인간 100일 프로젝트'), make('small', '', data.parent?.role || ''));

    const connector = make('div', 'tree-connector', '↓');
    const v2 = make('div', 'tree-node tree-v2');
    v2.append(make('span', 'tree-kicker', 'ADVANCED CHILD TREE'), make('strong', '', data.title || '심화 토익인간 V2'), make('small', '', '실제 영문 본문·어휘·구문·근거형 문제를 학습하는 후속 100일 과정'));
    root.append(parent, connector, v2);

    const branchGrid = make('div', 'tree-branches');
    (data.branches || []).forEach((branch) => {
      const link = make('a', 'tree-branch');
      link.href = `#${branch.id}`;
      link.append(make('span', 'branch-order', branch.order), make('strong', '', branch.title), make('small', '', branch.days));
      branchGrid.append(link);
    });
    root.append(branchGrid);
    tree.append(root);
  }

  function sectionTitle(no, title, meta) {
    const head = make('div', 'lesson-section-head');
    head.append(make('span', 'lesson-section-no', no), make('h4', '', title));
    if (meta) head.append(make('span', 'lesson-section-meta', meta));
    return head;
  }

  function renderReading(lesson) {
    const section = make('section', 'lesson-section reading-section');
    section.append(sectionTitle('01', '심화독해', `${lesson.reading.wordCount} words`));
    const intro = make('div', 'reading-intro');
    intro.append(make('strong', '', lesson.reading.title), make('p', '', lesson.reading.instructionKo));
    section.append(intro);
    const article = make('article', 'advanced-reading');
    lesson.reading.paragraphs.forEach((paragraph, index) => {
      const row = make('div', 'reading-paragraph');
      row.append(make('span', 'paragraph-no', String(index + 1).padStart(2, '0')), make('p', '', paragraph));
      article.append(row);
    });
    section.append(article);
    const summary = make('details', 'answer-details');
    summary.append(make('summary', '', '1회독 후 핵심 흐름 확인'));
    const summaryBody = make('div', 'answer-box');
    summaryBody.append(make('p', '', lesson.reading.summaryKo));
    summary.append(summaryBody);
    section.append(summary);
    return section;
  }

  function renderLexiconCards(items, className = '') {
    const grid = make('div', `learning-grid ${className}`.trim());
    items.forEach((item) => {
      const card = make('article', 'learning-item');
      const top = make('div', 'learning-item-top');
      top.append(make('strong', '', item.term));
      if (item.tier) top.append(make('span', 'tier-badge', item.tier));
      card.append(top, make('p', 'meaning-ko', item.meaningKo), make('p', 'example-en', item.example));
      grid.append(card);
    });
    return grid;
  }

  function renderAnalysis(lesson) {
    const section = make('section', 'lesson-section');
    section.append(sectionTitle('02', '해부·학습', '18 vocab · 8 collocations · 4 syntax'));

    const vocabBlock = make('div', 'learning-block');
    vocabBlock.append(make('h5', '', '본문·확장 핵심어휘 18'), make('p', 'block-note', '뜻 하나만 외우지 않고 예문 속 역할과 결합을 함께 확인합니다.'), renderLexiconCards(lesson.vocabulary, 'vocab-grid'));
    section.append(vocabBlock);

    const collocationBlock = make('div', 'learning-block');
    collocationBlock.append(make('h5', '', '숙어·연어·고정결합 8'), renderLexiconCards(lesson.collocations, 'collocation-grid'));
    section.append(collocationBlock);

    const syntaxBlock = make('div', 'learning-block');
    syntaxBlock.append(make('h5', '', '문장구조 4'));
    const syntaxGrid = make('div', 'syntax-grid');
    lesson.syntax.forEach((item) => {
      const card = make('article', 'syntax-card');
      card.append(make('strong', '', item.term), make('p', 'meaning-ko', item.meaningKo), make('p', 'example-en', item.example));
      syntaxGrid.append(card);
    });
    syntaxBlock.append(syntaxGrid);
    section.append(syntaxBlock);
    return section;
  }

  function renderQuestion(question, qid, number) {
    const card = make('article', 'question-card');
    card.dataset.questionId = qid;
    card.append(make('span', 'question-no', `Q${number}`), make('p', 'question-text', question.question));
    const options = make('div', 'question-options');
    question.options.forEach((option, index) => {
      const button = make('button', 'question-option');
      button.type = 'button';
      button.dataset.index = String(index);
      button.append(make('strong', '', `${String.fromCharCode(65 + index)}.`), document.createTextNode(` ${option}`));
      button.addEventListener('click', () => {
        if (card.dataset.answered === '1') return;
        card.dataset.answered = '1';
        const all = [...options.querySelectorAll('.question-option')];
        all.forEach((btn, idx) => {
          btn.disabled = true;
          if (idx === question.answer) btn.classList.add('correct');
        });
        if (index !== question.answer) button.classList.add('wrong');
        result.hidden = false;
        result.querySelector('strong').textContent = index === question.answer ? '정답입니다.' : `정답은 ${String.fromCharCode(65 + question.answer)}입니다.`;
      });
      options.append(button);
    });
    card.append(options);
    const result = make('div', 'question-result');
    result.hidden = true;
    result.append(make('strong', '', ''), make('p', '', question.explanationKo), make('small', '', `근거: ${question.evidence}`));
    card.append(result);
    return card;
  }

  function renderQuestions(lesson) {
    const section = make('section', 'lesson-section');
    section.append(sectionTitle('03', '추론·문제', '6 evidence-based items'));
    const note = make('p', 'block-note', '정답을 고른 뒤 반드시 근거 문장과 오답이 틀린 이유를 확인합니다.');
    section.append(note);
    const wrap = make('div', 'questions-wrap');
    lesson.questions.forEach((question, index) => wrap.append(renderQuestion(question, `d${lesson.day}-q${index + 1}`, index + 1)));
    section.append(wrap);
    return section;
  }

  function renderTransfer(lesson) {
    const section = make('section', 'lesson-section');
    section.append(sectionTitle('04', '전이·속도', 'summary · rewrite · evidence · timed review'));
    const grid = make('div', 'transfer-grid');
    lesson.transfer.forEach((task, index) => {
      const card = make('article', 'transfer-card');
      card.append(make('span', 'transfer-no', String(index + 1).padStart(2, '0')), make('strong', '', task.title), make('p', '', task.instruction));
      grid.append(card);
    });
    section.append(grid);
    return section;
  }

  function renderDay(branch, focus, lesson, dayNo) {
    const details = make('details', 'day-card');
    details.dataset.dayCard = String(dayNo);
    const summary = make('summary', 'day-summary');
    const dayLabel = make('span', 'day-number', `DAY ${String(dayNo).padStart(3, '0')}`);
    const titleWrap = make('span', 'day-title-wrap');
    titleWrap.append(make('strong', '', focus[0]), make('small', '', lesson?.reading?.title || focus[1]));
    summary.append(dayLabel, titleWrap, make('span', 'day-chevron', '+'));

    const body = make('div', 'day-body');
    const point = make('div', 'day-focus-box');
    point.append(make('span', 'focus-label', '오늘의 심화 포인트'), make('p', '', focus[1]));
    body.append(point);

    if (lesson) {
      const actual = make('div', 'actual-learning');
      actual.append(renderReading(lesson), renderAnalysis(lesson), renderQuestions(lesson), renderTransfer(lesson));
      body.append(actual);
    } else {
      body.append(make('p', 'missing-lesson', '학습 데이터를 불러오지 못했습니다.'));
    }

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
    gap.append(make('span', 'gap-label', '심화 목표'), make('p', '', branch.gap));
    body.append(gap);

    const dayList = make('div', 'day-list');
    (branch.focuses || []).forEach((focus, index) => {
      const dayNo = branchIndex * 10 + index + 1;
      const lesson = branch.lessons?.[index];
      dayList.append(renderDay(branch, focus, lesson, dayNo));
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
