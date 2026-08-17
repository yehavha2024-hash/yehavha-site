(() => {
  'use strict';

  const records = Array.isArray(window.AI_LITERATURE_RECORDS) ? window.AI_LITERATURE_RECORDS : [];
  const aiBaseTerm = 'AI · Artificial Intelligence (인공지능, 사람의 지능적 기능인 학습·추론·판단·인식·생성 등을 전자적 장치나 소프트웨어를 통해 인공적으로 구현하는 기술과 시스템의 총칭)';
  let terminologyRequested = false;

  const clean = value => String(value ?? '').replace(/\s+/g, ' ').trim();
  const quoteKo = title => `"${clean(title).replace(/^[\"“”']+|[\"“”']+$/g, '')}"`;
  const quoteEn = title => `“${clean(title).replace(/^[\"“”']+|[\"“”']+$/g, '')}”`;

  function ensureTerminologyLibrary() {
    if (window.RESEARCH_TERMINOLOGY_STANDARD || terminologyRequested) return;
    terminologyRequested = true;
    const script = document.createElement('script');
    script.src = '../research-terminology-standard.js?v=20260817-2';
    script.onload = () => queueMicrotask(enhanceDetail);
    script.onerror = () => { terminologyRequested = false; };
    document.head.appendChild(script);
  }

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

  function normalizeThesisPublication(publication) {
    let source = clean(publication);
    source = source.replace(/법학\s*박사(?!학위논문)/g, '박사학위논문');
    source = source.replace(/법학박사학위논문/g, '박사학위논문');
    source = source.replace(/박사\s*학위\s*논문/g, '박사학위논문');
    return source;
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
      record.publication = normalizeThesisPublication(record.publication);
      record.citation = `${author}, ${quoteKo(record.title)}, ${record.publication}, ${year}.`;
      record.citationStandard = 'KO-THESIS-v3';
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

  function currentRecord() {
    const title = detailContent.querySelector('#detailTitle')?.textContent?.trim();
    if (!title) return null;
    return records.find(record => record.title === title) || null;
  }

  function enhanceTerminology() {
    const record = currentRecord();
    if (!record) return;

    const raw = JSON.stringify(record);
    const terms = [];
    if (/\bAI\b/i.test(raw) || raw.includes('인공지능')) terms.push(aiBaseTerm);

    const standard = window.RESEARCH_TERMINOLOGY_STANDARD;
    if (standard && typeof standard.guideFor === 'function') {
      standard.guideFor(record, 14).forEach(term => {
        if (!terms.includes(term)) terms.push(term);
      });
    }

    let section = detailContent.querySelector('.terminology-guide');
    if (!terms.length) {
      section?.remove();
      return;
    }

    const signature = terms.join('|');
    if (section?.dataset.signature === signature) return;

    if (!section) {
      section = make('section', 'detail-section terminology-guide');
      const toc = detailContent.querySelector('.detail-toc');
      const first = detailContent.querySelector('.detail-section');
      if (toc) toc.insertAdjacentElement('afterend', section);
      else if (first) first.insertAdjacentElement('beforebegin', section);
      else detailContent.append(section);
    }

    section.dataset.signature = signature;
    section.replaceChildren();
    section.append(make('h3', '', '핵심 용어 해설 · 영어 원어 → 한글 용어 → 뜻'));
    const ul = make('ul', 'terminology-list');
    terms.forEach(term => ul.append(make('li', '', term)));
    section.append(ul, make('p', 'detail-note', '해외 문헌과 영문 법개념은 원어를 유지하면서 국내 통용 한글 명칭과 이 문헌을 읽는 데 필요한 개념적 의미를 함께 제시합니다.'));
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
    enhanceTerminology();
    enhanceRoles();
    enhanceRelated();
  }

  const observer = new MutationObserver(() => enhanceDetail());
  observer.observe(detailContent, { childList: true, subtree: true });
  ensureTerminologyLibrary();
  enhanceDetail();
})();
