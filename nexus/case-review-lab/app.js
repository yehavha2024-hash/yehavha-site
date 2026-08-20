(() => {
  'use strict';

  const cases = Array.isArray(window.LEGAL_MIND_CASES) ? window.LEGAL_MIND_CASES : [];
  const select = document.getElementById('caseSelect');
  const detail = document.getElementById('caseDetail');
  const count = document.getElementById('caseCount');
  if (!select || !detail) return;

  const arr = value => Array.isArray(value) ? value : [];
  const make = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  };

  function record(label, value) {
    const box = make('div', 'record');
    box.append(make('strong', '', label), make('span', '', value));
    return box;
  }

  function fixSharedLinks() {
    const schema = detail.querySelector('.schema-strip a');
    if (schema) schema.href = 'https://yehavha-legal-knowledge.danielie.workers.dev/legal-mind/case-review.schema.json';
  }

  function render(item) {
    if (!item) {
      detail.replaceChildren(make('p', 'lab-empty', '등록된 사건 사례가 없습니다.'));
      return;
    }

    detail.replaceChildren();
    const kicker = make('p', 'detail-kicker', `${item.id} · ${item.mode || '사례'} · ${item.area || '법영역'}`);
    const overview = make('section', 'model-overview');
    overview.append(
      make('h2', '', item.title || item.id),
      make('p', 'case-summary', item.summary || ''),
      make('strong', 'case-question', item.question || '')
    );

    const meta = make('div', 'record-grid lab-records');
    meta.append(
      record('FACTS', `${arr(item.facts).length}개`),
      record('ISSUES', `${arr(item.issues).length}개`),
      record('LAW', `${arr(item.laws).length}개`),
      record('EVIDENCE', `${arr(item.evidence).length}개`),
      record('COUNTER', `${arr(item.respondent).length}개`),
      record('SOURCES', `${arr(item.sources).length}개`)
    );

    detail.append(kicker, overview, meta);
    window.setTimeout(fixSharedLinks, 0);
  }

  cases.forEach(item => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = `${item.id} · ${item.title}`;
    select.append(option);
  });
  if (count) count.textContent = `${cases.length} CASES`;

  select.addEventListener('change', () => render(cases.find(item => item.id === select.value)));
  render(cases[0]);

  new MutationObserver(fixSharedLinks).observe(detail, {childList:true, subtree:true});
})();
