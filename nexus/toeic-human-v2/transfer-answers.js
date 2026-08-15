(() => {
  'use strict';

  const data = window.TOEIC_HUMAN_V2 || {};
  const lessons = (data.branches || []).flatMap((branch) =>
    (branch.lessons || []).map((lesson, index) => ({
      ...lesson,
      branchId: branch.id,
      focusTitle: branch.focuses?.[index]?.[0] || lesson.focusTitle || ''
    }))
  );

  function sentences(text) {
    return String(text || '').match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((s) => s.trim()) || [];
  }

  function currentLesson() {
    const day = Number(new URL(location.href).searchParams.get('day')) || 1;
    return lessons.find((lesson) => lesson.day === day) || lessons[0] || null;
  }

  function clean(text) {
    return String(text || '').replace(/\s+/g, ' ').trim();
  }

  function passageFacts(lesson) {
    const p = lesson?.reading?.paragraphs || [];
    const p1 = sentences(p[0]);
    const p2 = sentences(p[1]);
    const p3 = sentences(p[2]);
    const p7 = sentences(p[6]);
    return {
      situation: clean(p1[0]),
      metric: clean(p1[4]),
      evidence: clean(p2[2]),
      revised: clean(p3[0]).replace(/^After the second review, the team proposed a revised approach:\s*/i, ''),
      condition: clean(p3[2]),
      exception: clean(p3[4]),
      result: clean(p7[1]),
      next: clean(p7[2])
    };
  }

  function focusAnswer(lesson) {
    const special = (lesson?.questions || []).find((q) => /interpretation of|best handles|this requirement|valid paraphrase|keeps an inference|two documents|general rule|argumentative conclusion|retain a long chapter|time pressure/i.test(q.question || ''));
    if (!special) return '';
    const answer = special.options?.[special.answer];
    if (!answer) return '';
    return `오늘의 핵심 판단: ${answer} ${special.explanationKo ? `— ${special.explanationKo}` : ''}`;
  }

  function answerFor(lesson, index) {
    const f = passageFacts(lesson);
    const focus = focusAnswer(lesson);

    if (index === 0) {
      return {
        answer: `${f.situation} ${f.evidence} The team therefore adopted this revised approach: ${f.revised} The decision remains conditional: ${f.condition} A limited exception also remains: ${f.exception}`,
        note: '문제 → 핵심근거 → 수정안 → 조건 → 예외의 순서가 모두 들어가면 좋은 요약입니다.'
      };
    }

    if (index === 1) {
      return {
        answer: `The organization did not adopt an unconditional change. Instead, it chose a narrower revised approach — ${f.revised} — while keeping the following condition in force: ${f.condition}`,
        note: focus || '원문의 결론 강도와 조건 범위를 유지한 채 어순과 표현만 바꾸는 것이 핵심입니다.'
      };
    }

    if (index === 2) {
      return {
        answer: `Claim: ${f.revised}\nEvidence: ${f.evidence || f.metric}\nCondition: ${f.condition}\nException: ${f.exception}\nNext action: ${f.next || f.result}`,
        note: '각 칸은 서로 다른 기능입니다. 특히 Evidence와 Condition을 같은 것으로 처리하지 않아야 합니다.'
      };
    }

    return {
      answer: `Evidence 1: ${f.metric}\nEvidence 2: ${f.evidence}\nCondition: ${f.condition}`,
      note: '90초 훈련의 정답 기준은 근거 두 개와 적용조건 하나를 정확히 회수하는 것입니다.'
    };
  }

  function injectAnswers() {
    const cards = [...document.querySelectorAll('.transfer-card')];
    if (!cards.length) return;
    const lesson = currentLesson();
    if (!lesson) return;

    cards.forEach((card, index) => {
      if (card.querySelector('.transfer-model-answer')) return;
      const result = answerFor(lesson, index);
      const box = document.createElement('div');
      box.className = 'transfer-model-answer';

      const label = document.createElement('strong');
      label.className = 'model-answer-label';
      label.textContent = '모범답안';

      const answer = document.createElement('p');
      answer.className = 'model-answer-text';
      answer.textContent = result.answer;

      const note = document.createElement('p');
      note.className = 'model-answer-note';
      note.textContent = result.note;

      box.append(label, answer, note);
      card.append(box);
    });
  }

  let scheduled = false;
  function scheduleInject() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      injectAnswers();
    });
  }

  const observer = new MutationObserver(scheduleInject);
  const start = () => {
    const target = document.getElementById('cardContent');
    if (!target) return;
    observer.observe(target, { childList: true, subtree: true });
    injectAnswers();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
