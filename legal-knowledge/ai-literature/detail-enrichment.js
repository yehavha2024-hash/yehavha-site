(() => {
  'use strict';

  const records = Array.isArray(window.AI_LITERATURE_RECORDS) ? window.AI_LITERATURE_RECORDS : [];

  const clean = value => String(value ?? '').replace(/\s+/g, ' ').trim();
  const quoteKo = title => `"${clean(title).replace(/^[\"“”']+|[\"“”']+$/g, '')}"`;
  const quoteEn = title => `“${clean(title).replace(/^[\"“”']+|[\"“”']+$/g, '')}”`;

  function formatKoreanPages(value) {
    const pages = clean(value).replace(/–/g, '-');
    return pages ? `${pages}쪽` : '';
  }

  function parseKoreanJournal(publication) {
    const source = clean(publication);
    const match = source.match(/^(.+?)\s+(\d+)(?:\((\d+)\))?,\s*(\d+(?:[-–]\d+)?)$/);
    if (!match) return null;

    const [, journal, volume, issue, pages] = match;
    const journalPart = issue
      ? `${journal.trim()} 제${volume}권 제${issue}호`
      : `${journal.trim()} 제${volume}호`;

    return { journalPart, pages: formatKoreanPages(pages) };
  }

  function standardizeCitation(record) {
    const type = clean(record.type);
    const language = clean(record.language);
    const jurisdiction = clean(record.jurisdiction);
    const author = clean(record.author);
    const year = clean(record.year);

    if (type === '국내 학술논문' || (language !== '영어' && jurisdiction === '대한민국' && type.includes('학술논문'))) {
      const parsed = parseKoreanJournal(record.publication);
      if (parsed) {
        record.citation = `${author}, ${quoteKo(record.title)}, ${parsed.journalPart}, ${year}, ${parsed.pages}.`;
      } else {
        record.citation = `${author}, ${quoteKo(record.title)}, ${clean(record.publication)}, ${year}.`;
      }
      record.citationStandard = 'KO-JOURNAL-v3';
      return;
    }

    if (type.includes('학위논문')) {
      record.citation = `${author}, ${quoteKo(record.title)}, ${clean(record.publication)}, ${year}.`;
      record.citationStandard = 'KO-THESIS-v2';
      return;
    }

    if (type === '해외 학술논문' || (language === '영어' && type.includes('학술논문'))) {
      record.citation = `${author}, ${quoteEn(record.title)}, ${clean(record.publication)} (${year}).`;
      record.citationStandard = 'EN-JOURNAL-v1';
    }
  }

  records.forEach(standardizeCitation);

  const byId = new Map(records.map(record => [record.id, record]));
  const detailContent = document.getElementById('detailContent');
  if (!detailContent) return;

  const roleDescriptions = {
    '직접 인용 핵심문헌': '핵심 명제·법적 요건·정책 근거를 본문 논증에 직접 사용할 수 있는 문헌입니다. 실제 직접 인용 전에는 원문 문장과 쪽수를 다시 확인합니다.',
    '반대학설': '현재 논지를 제한하거나 반박하는 경쟁 견해입니다. 반론 검토와 주장 범위의 한정, 보충성 논증을 위해 사용합니다.',
    '비교법': '외국 규범·판례·제도와 국내법의 기능을 비교하고, 제도 이식 가능성과 한계를 검토하는 근거입니다.',
    '최신문헌': '최근 규범·판례·학술논의를 반영하여 쟁점의 현재 상태와 변화 방향을 확인하는 자료입니다.',
    '교리 근거': '현행 실정법의 요건·해석·판례 법리를 중심으로 주장에 법적 기반을 제공하는 자료입니다.',
    '제도설계': '책임주체·증명책임·로그·보험·책임재산·감독 등 구체적인 제도구조를 설계하는 데 사용하는 자료입니다.'
  };

  function make(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined && text !== null) el.textContent = String(text);
    return el;
  }

  function addTextNote(parent, label, value) {
    if (!value) return;
    const wrap = make('div', 'related-note');
    wrap.append(make('strong', '', label), make('p', '', value));
    parent.append(wrap);
  }

  function addListNote(parent, label, values) {
    const items = Array.isArray(values) ? values.filter(Boolean).slice(0, 3) : [];
    if (!items.length) return;
    const wrap = make('div', 'related-note');
    wrap.append(make('strong', '', label));
    const ul = make('ul', '');
    items.forEach(item => ul.append(make('li', '', item)));
    wrap.append(ul);
    parent.append(wrap);
  }

  function enhanceRelated() {
    const section = detailContent.querySelector('#detail-related');
    if (!section) return;
    const list = section.querySelector(':scope > ul');
    if (!list) return;

    list.querySelectorAll(':scope > li').forEach(li => {
      if (li.dataset.enriched === 'true') return;
      const button = li.querySelector('.inline-related[data-related-id]');
      if (!button) return;
      const record = byId.get(button.dataset.relatedId);
      if (!record) return;

      li.dataset.enriched = 'true';
      li.classList.add('related-literature-item');

      const meta = [record.year, record.publication, record.type].filter(Boolean).join(' · ');
      if (meta) li.append(make('div', 'related-meta', meta));

      const roles = Array.isArray(record.evidenceRoles) ? record.evidenceRoles.filter(Boolean) : [];
      if (roles.length) {
        const row = make('div', 'related-role-row');
        roles.slice(0, 5).forEach(role => row.append(make('span', 'related-role', role)));
        li.append(row);
      }

      addTextNote(li, '핵심 관점', record.summary);
      addListNote(li, '주요 논거·활용', (record.argumentUse && record.argumentUse.length) ? record.argumentUse : record.mustRead);
      addTextNote(li, '현재 연구 연결', record.researchFit);
      addTextNote(li, '반대·적용상 주의', record.counterpoint);
    });
  }

  function enhanceRoles() {
    const section = detailContent.querySelector('#detail-role');
    if (!section || section.dataset.roleEnriched === 'true') return;
    const roles = [...section.querySelectorAll('.tag')].map(tag => tag.textContent.trim()).filter(Boolean);
    if (!roles.length) return;

    section.dataset.roleEnriched = 'true';
    const grid = make('div', 'role-explanations');
    roles.forEach(role => {
      const block = make('div', 'role-explanation');
      block.append(
        make('strong', '', role),
        make('p', '', roleDescriptions[role] || '이 문헌이 해당 쟁점에서 수행하는 논증상의 기능을 표시합니다. 핵심 요지와 연구 접목 항목을 함께 확인합니다.')
      );
      grid.append(block);
    });
    section.append(grid);
  }

  function enhanceDetail() {
    enhanceRoles();
    enhanceRelated();
  }

  const observer = new MutationObserver(() => enhanceDetail());
  observer.observe(detailContent, { childList: true, subtree: true });
  enhanceDetail();
})();
