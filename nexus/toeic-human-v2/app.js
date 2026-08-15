(() => {
  'use strict';

  const data = window.TOEIC_HUMAN_V2 || {};
  const CATEGORIES = {
    read: { label: '장문읽기', part: 'ADVANCED READING' },
    analyze: { label: '해부·학습', part: 'VOCAB · COLLOCATION · SYNTAX' },
    apply: { label: '문제·복습', part: 'EVIDENCE-BASED QUESTIONS' },
    speed: { label: '전이·속도', part: 'TRANSFER · TIMED REVIEW' }
  };
  const categoryOrder = Object.keys(CATEGORIES);
  const COMPLETION_KEY = 'toeic-human-v2-stage-completed-v3';
  const WRONG_KEY = 'toeic-human-v2-wrong-v3';

  const $ = (id) => document.getElementById(id);
  const els = {
    dayLabel: $('dayLabel'), dayHeadline: $('dayHeadline'), dayTrack: $('dayTrack'),
    progressRing: $('progressRing'), progressNumber: $('progressNumber'),
    dailyProgressText: $('dailyProgressText'), dailyProgressBar: $('dailyProgressBar'),
    badge: $('badge'), partBadge: $('partBadge'), cardContent: $('cardContent'),
    speakBtn: $('speakBtn'), completeBtn: $('completeBtn'),
    prevDayBtn: $('prevDayBtn'), nextDayBtn: $('nextDayBtn'), navDay: $('navDay'),
    totalCompleted: $('totalCompleted'), completedDays: $('completedDays'), wrongCount: $('wrongCount'),
    shareBtn: $('shareBtn'), resetBtn: $('resetBtn'), toast: $('toast')
  };

  const lessons = (data.branches || []).flatMap((branch) =>
    (branch.lessons || []).map((lesson, index) => ({
      ...lesson,
      branchId: branch.id,
      branchOrder: branch.order,
      branchTitle: branch.title,
      focusTitle: branch.focuses?.[index]?.[0] || lesson.focusTitle || '',
      focusKo: branch.focuses?.[index]?.[1] || lesson.focusKo || ''
    }))
  ).sort((a, b) => a.day - b.day);

  let activeCategory = 'read';
  let activeDay = 1;
  let currentSpeechText = '';
  let speechToken = 0;
  let toastTimer;

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'\"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
  }

  function showToast(message) {
    if (!els.toast) return;
    clearTimeout(toastTimer);
    els.toast.textContent = message;
    els.toast.classList.add('show');
    toastTimer = setTimeout(() => els.toast.classList.remove('show'), 1700);
  }

  function getCompleted() {
    try { return JSON.parse(localStorage.getItem(COMPLETION_KEY) || '{}'); }
    catch { return {}; }
  }
  function setCompleted(value) { localStorage.setItem(COMPLETION_KEY, JSON.stringify(value)); }
  function getWrong() {
    try { return JSON.parse(localStorage.getItem(WRONG_KEY) || '[]'); }
    catch { return []; }
  }
  function setWrong(value) { localStorage.setItem(WRONG_KEY, JSON.stringify([...new Set(value)])); }
  function isCompleted(day, category) { return Boolean(getCompleted()[day]?.includes(category)); }
  function dayIsComplete(day, completed = getCompleted()) {
    const set = new Set(completed[day] || []);
    return categoryOrder.every((category) => set.has(category));
  }
  function firstIncompleteDay() {
    const completed = getCompleted();
    for (let day = 1; day <= 100; day += 1) if (!dayIsComplete(day, completed)) return day;
    return 100;
  }
  function toggleCompleted(day, category) {
    const completed = getCompleted();
    completed[day] ||= [];
    if (completed[day].includes(category)) completed[day] = completed[day].filter((x) => x !== category);
    else completed[day].push(category);
    setCompleted(completed);
  }

  function lessonFor(day) { return lessons.find((item) => item.day === day) || null; }

  function updateUrl() {
    const url = new URL(location.href);
    url.searchParams.set('day', String(activeDay));
    url.searchParams.set('category', activeCategory);
    history.replaceState({}, '', url);
  }

  function renderReading(lesson) {
    currentSpeechText = (lesson.reading?.paragraphs || []).join(' ');
    const paragraphs = (lesson.reading?.paragraphs || []).map((p) => `<p>${escapeHtml(p)}</p>`).join('');
    return `
      <div class="reading-header">
        <h2 class="reading-title">${escapeHtml(lesson.reading?.title || lesson.focusTitle)}</h2>
        <p class="reading-instruction">${escapeHtml(lesson.reading?.instructionKo || '')}</p>
        <div class="reading-meta">
          <span>${Number(lesson.reading?.wordCount || 0).toLocaleString('ko-KR')} words</span>
          <span>${escapeHtml(lesson.branchTitle)}</span>
          <span>${escapeHtml(lesson.focusTitle)}</span>
        </div>
      </div>
      <article class="long-reading">${paragraphs}</article>
      <details class="reading-details">
        <summary>1회독 후 핵심 흐름 확인</summary>
        <div><p>${escapeHtml(lesson.reading?.summaryKo || '')}</p></div>
      </details>`;
  }

  function lexiconHtml(items) {
    return (items || []).map((item) => `
      <div class="lexicon-item">
        <strong>${escapeHtml(item.term)}</strong>
        ${item.tier ? `<span class="tier">${escapeHtml(item.tier)}</span>` : ''}
        <span>${escapeHtml(item.meaningKo)}</span>
        <span class="example-en">${escapeHtml(item.example)}</span>
      </div>`).join('');
  }

  function renderAnalysis(lesson) {
    currentSpeechText = [...(lesson.vocabulary || []), ...(lesson.collocations || []), ...(lesson.syntax || [])]
      .map((item) => item.example).filter(Boolean).join(' ');
    const syntax = (lesson.syntax || []).map((item) => `
      <div class="structure-card">
        <strong>${escapeHtml(item.term)}</strong>
        <p>${escapeHtml(item.meaningKo)}</p>
        <p class="example-en">${escapeHtml(item.example)}</p>
      </div>`).join('');
    return `
      <p class="section-label">핵심어휘 18</p>
      <p class="analysis-note">뜻 하나만 외우지 않고 예문 속 의미·결합·문체를 함께 확인합니다.</p>
      <div class="lexicon-grid">${lexiconHtml(lesson.vocabulary)}</div>
      <p class="section-label">숙어·연어·고정결합 8</p>
      <div class="lexicon-grid">${lexiconHtml(lesson.collocations)}</div>
      <p class="section-label">문장구조 4</p>
      <div class="structure-list">${syntax}</div>`;
  }

  function renderQuestions(lesson) {
    currentSpeechText = '';
    return `
      <div class="reading-header">
        <h2 class="reading-title">${escapeHtml(lesson.focusTitle)} · 근거형 문제</h2>
        <p class="reading-instruction">정답을 선택한 뒤 반드시 근거와 해설을 확인합니다.</p>
      </div>
      ${(lesson.questions || []).map((q, index) => `
        <article class="question-card" data-question-index="${index}">
          <span class="question-no">Q${index + 1}</span>
          <p class="question">${escapeHtml(q.question)}</p>
          <div class="quiz-options">
            ${(q.options || []).map((option, optionIndex) => `<button class="quiz-option" type="button" data-option-index="${optionIndex}"><strong>${String.fromCharCode(65 + optionIndex)}.</strong> ${escapeHtml(option)}</button>`).join('')}
          </div>
          <div class="explanation-box" hidden>
            <strong class="answer-line"></strong>
            <span>${escapeHtml(q.explanationKo || '')}</span>
            <small>근거: ${escapeHtml(q.evidence || '')}</small>
          </div>
        </article>`).join('')}`;
  }

  function renderTransfer(lesson) {
    currentSpeechText = '';
    return `
      <div class="reading-header">
        <h2 class="reading-title">${escapeHtml(lesson.focusTitle)} · 전이훈련</h2>
        <p class="reading-instruction">같은 기술을 요약·재작성·근거회수·시간훈련에 옮겨 적용합니다.</p>
      </div>
      <div class="transfer-grid">
        ${(lesson.transfer || []).map((task, index) => `
          <article class="transfer-card">
            <span>${String(index + 1).padStart(2, '0')}</span>
            <strong>${escapeHtml(task.title)}</strong>
            <p>${escapeHtml(task.instruction)}</p>
          </article>`).join('')}
      </div>`;
  }

  function renderCard() {
    const lesson = lessonFor(activeDay);
    if (!lesson) {
      els.cardContent.innerHTML = '<p class="reading-instruction">학습 데이터를 불러오지 못했습니다.</p>';
      return;
    }
    const category = CATEGORIES[activeCategory];
    els.badge.textContent = category.label;
    els.partBadge.textContent = category.part;
    if (activeCategory === 'read') els.cardContent.innerHTML = renderReading(lesson);
    if (activeCategory === 'analyze') els.cardContent.innerHTML = renderAnalysis(lesson);
    if (activeCategory === 'apply') els.cardContent.innerHTML = renderQuestions(lesson);
    if (activeCategory === 'speed') els.cardContent.innerHTML = renderTransfer(lesson);
    els.speakBtn.hidden = !currentSpeechText;
  }

  function updateStats() {
    const completed = getCompleted();
    const stageCount = Object.values(completed).reduce((sum, items) => sum + new Set(items || []).size, 0);
    let days = 0;
    for (let day = 1; day <= 100; day += 1) if (dayIsComplete(day, completed)) days += 1;
    els.totalCompleted.textContent = String(stageCount);
    els.completedDays.textContent = String(days);
    els.wrongCount.textContent = String(getWrong().length);
  }

  function render() {
    const lesson = lessonFor(activeDay);
    if (!lesson) return;
    els.dayLabel.textContent = `DAY ${activeDay}`;
    els.dayHeadline.textContent = lesson.focusTitle || '심화 영어독해';
    els.dayTrack.textContent = `${lesson.branchOrder} · ${lesson.branchTitle}`;
    els.progressNumber.textContent = String(activeDay);
    els.progressRing.style.setProperty('--progress', `${activeDay}%`);
    els.navDay.textContent = `DAY ${activeDay}`;
    els.prevDayBtn.disabled = activeDay <= 1;
    els.nextDayBtn.disabled = activeDay >= 100;

    document.querySelectorAll('.category').forEach((button) => button.classList.toggle('active', button.dataset.category === activeCategory));
    const completed = getCompleted();
    const todayCount = new Set(completed[activeDay] || []).size;
    els.dailyProgressText.textContent = `${todayCount} / 4`;
    els.dailyProgressBar.style.width = `${todayCount * 25}%`;
    const done = isCompleted(activeDay, activeCategory);
    els.completeBtn.classList.toggle('completed', done);
    els.completeBtn.textContent = done ? '이 단계 완료됨 ✓' : '이 단계 완료';

    renderCard();
    updateStats();
    updateUrl();
  }

  function splitSpeech(text, maxLength = 210) {
    const sentenceList = String(text || '').replace(/\s+/g, ' ').match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
    const chunks = [];
    let current = '';
    sentenceList.forEach((sentence) => {
      const next = `${current} ${sentence}`.trim();
      if (next.length <= maxLength) current = next;
      else { if (current) chunks.push(current); current = sentence.trim(); }
    });
    if (current) chunks.push(current);
    return chunks;
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) return showToast('이 브라우저에서는 음성 재생을 지원하지 않습니다.');
    speechSynthesis.cancel();
    const token = ++speechToken;
    const chunks = splitSpeech(text);
    let index = 0;
    const voices = speechSynthesis.getVoices();
    const preferred = voices.find((v) => /en-US/i.test(v.lang)) || voices.find((v) => /^en/i.test(v.lang));
    const next = () => {
      if (token !== speechToken || index >= chunks.length) return;
      const utterance = new SpeechSynthesisUtterance(chunks[index++]);
      utterance.lang = 'en-US';
      utterance.rate = .82;
      if (preferred) utterance.voice = preferred;
      utterance.onend = next;
      speechSynthesis.speak(utterance);
    };
    next();
  }

  document.querySelectorAll('.category').forEach((button) => {
    button.addEventListener('click', () => {
      activeCategory = button.dataset.category;
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  els.cardContent.addEventListener('click', (event) => {
    const option = event.target.closest('.quiz-option');
    if (!option) return;
    const card = option.closest('.question-card');
    if (!card || card.dataset.answered === '1') return;
    const lesson = lessonFor(activeDay);
    const qIndex = Number(card.dataset.questionIndex);
    const selected = Number(option.dataset.optionIndex);
    const question = lesson?.questions?.[qIndex];
    if (!question) return;
    card.dataset.answered = '1';
    card.querySelectorAll('.quiz-option').forEach((button, index) => {
      button.disabled = true;
      if (index === question.answer) button.classList.add('correct');
    });
    if (selected !== question.answer) {
      option.classList.add('wrong');
      setWrong([...getWrong(), `d${activeDay}-q${qIndex + 1}`]);
    }
    const explanation = card.querySelector('.explanation-box');
    explanation.hidden = false;
    explanation.querySelector('.answer-line').textContent = selected === question.answer ? '정답입니다.' : `정답은 ${String.fromCharCode(65 + question.answer)}입니다.`;
    updateStats();
  });

  els.completeBtn.addEventListener('click', () => {
    toggleCompleted(activeDay, activeCategory);
    render();
  });
  els.speakBtn.addEventListener('click', () => speak(currentSpeechText));
  els.prevDayBtn.addEventListener('click', () => { if (activeDay > 1) { activeDay -= 1; render(); window.scrollTo({top:0,behavior:'smooth'}); } });
  els.nextDayBtn.addEventListener('click', () => { if (activeDay < 100) { activeDay += 1; render(); window.scrollTo({top:0,behavior:'smooth'}); } });

  els.shareBtn.addEventListener('click', async () => {
    const url = new URL(location.href);
    url.searchParams.set('day', String(activeDay));
    url.searchParams.set('category', activeCategory);
    try {
      await navigator.clipboard.writeText(url.toString());
      showToast('현재 학습 링크를 복사했습니다.');
    } catch {
      window.prompt('아래 주소를 복사하세요.', url.toString());
    }
  });

  els.resetBtn.addEventListener('click', () => {
    if (!window.confirm('심화 토익인간 V2의 학습 진행기록과 오답기록을 초기화할까요?')) return;
    localStorage.removeItem(COMPLETION_KEY);
    localStorage.removeItem(WRONG_KEY);
    activeDay = 1;
    activeCategory = 'read';
    render();
    showToast('진행기록을 초기화했습니다.');
  });

  const params = new URL(location.href).searchParams;
  const requestedDay = Number(params.get('day'));
  const requestedCategory = params.get('category');
  activeDay = Number.isInteger(requestedDay) && requestedDay >= 1 && requestedDay <= 100 ? requestedDay : firstIncompleteDay();
  if (requestedCategory && CATEGORIES[requestedCategory]) activeCategory = requestedCategory;

  render();
})();
