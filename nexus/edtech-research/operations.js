(() => {
  const root = document.querySelector('[data-edtech-operations]');
  if (!root) return;

  const statusLabels = {
    'literature-review': '문헌검토',
    'model-design': '연구모형 설계',
    'research-question': '연구질문 구체화',
    'candidate': '후보',
    'prototype-design': '프로토타입 설계',
    'protocol-design': '실증 프로토콜 설계',
    'signal-definition': '신호 정의',
    'concept-design': '개념 설계',
    'priority-a': '최우선',
    'candidate-high': '우선 후보'
  };

  const make = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  };

  const renderLane = (title, eyebrow, href, items, kind) => {
    const lane = make('article', 'ops-lane');
    lane.append(make('span', 'ops-eyebrow', eyebrow));
    const head = make('div', 'ops-lane-head');
    head.append(make('h3', '', title));
    const link = make('a', '', '연구실 보기 →');
    link.href = href;
    head.append(link);
    lane.append(head);

    const list = make('div', 'ops-list');
    items.forEach((item) => {
      const card = make('div', 'ops-item');
      const meta = make('div', 'ops-item-meta');
      meta.append(make('strong', '', item.id));
      meta.append(make('span', 'ops-status', statusLabels[item.status] || item.status));
      card.append(meta);
      card.append(make('h4', '', item.title));
      card.append(make('p', 'ops-next', `다음: ${item.nextAction}`));
      const foot = make('p', 'ops-foot', `최근 검토 ${item.lastReviewed}${kind === 'field' && item.stage ? ` · ${item.stage}` : ''}`);
      card.append(foot);
      list.append(card);
    });
    lane.append(list);
    return lane;
  };

  fetch('./research-operations.json', { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      root.replaceChildren();
      const summary = make('div', 'ops-summary');
      summary.append(make('div', 'ops-stat', `${data.researchProjects.length}\n08 연구과제`));
      summary.append(make('div', 'ops-stat', `${data.fieldEvidence.length}\n09 실증과제`));
      summary.append(make('div', 'ops-stat', `${data.doctoralCandidates.length}\n10 박사후보`));
      summary.append(make('div', 'ops-stat', `${data.updatedAt}\n운영원장 갱신`));
      root.append(summary);

      const lanes = make('div', 'ops-lanes');
      lanes.append(
        renderLane('Research Lab', '08 · ACTIVE RESEARCH', './research-lab/', data.researchProjects, 'research'),
        renderLane('Field Practice', '09 · FIELD EVIDENCE', './field-practice/', data.fieldEvidence, 'field'),
        renderLane('Doctoral Research', '10 · DOCTORAL BANK', './doctoral-research/', data.doctoralCandidates, 'doctoral')
      );
      root.append(lanes);
    })
    .catch(() => {
      root.replaceChildren(make('p', 'ops-error', '운영 원장 데이터를 불러오지 못했습니다.'));
    });
})();
