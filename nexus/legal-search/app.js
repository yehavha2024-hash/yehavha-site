(() => {
  const form = document.getElementById('legalSearchForm');
  const input = document.getElementById('legalQuery');
  const clearBtn = document.getElementById('clearBtn');
  const status = document.getElementById('searchStatus');
  const grid = document.getElementById('sourceGrid');
  const casePattern = /(?:19|20)?\d{2}\s*(?:가합|가단|가소|나|다|라|마|재다|재나|두|구합|구단|누|도|노|고합|고단|고정|카합|카단|카명|카기|카경|카정|카확|카허|카담|카임|카소|헌가|헌나|헌다|헌라|헌마|헌바|헌사|헌아|후|허|므|스)\s*\d{1,10}/g;
  let renderToken = 0;

  function detectCases(value) {
    return [...new Set((value.match(casePattern) || []).map(v => v.replace(/\s+/g, '')) )];
  }

  function sourceCard(title, text, href, internal = false) {
    const a = document.createElement('a');
    a.className = `source-card${internal ? ' nexus-card' : ''}`;
    a.href = href;
    if (!internal && !window.matchMedia('(max-width: 760px)').matches) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    const copy = document.createElement('div');
    const strong = document.createElement('strong');
    const span = document.createElement('span');
    const em = document.createElement('em');
    strong.textContent = title;
    span.textContent = text;
    em.textContent = internal ? '이동 →' : '열기 ↗';
    copy.append(strong, span);
    a.append(copy, em);
    return a;
  }

  async function loadPublicData(source, params) {
    const url = new URL('../api/public-data', location.href);
    url.searchParams.set('source', source);
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
    const response = await fetch(url, { cache: 'no-store' });
    const payload = await response.json();
    if (!response.ok || !payload.ok || payload.upstreamStatus !== 200) throw new Error(`${source}: ${response.status}`);
    return payload.data;
  }

  function firstObjectArray(root, preferredKeys) {
    const queue = [root];
    const seen = new Set();
    while (queue.length) {
      const value = queue.shift();
      if (!value || typeof value !== 'object' || seen.has(value)) continue;
      seen.add(value);
      for (const key of preferredKeys) {
        const direct = value[key];
        if (Array.isArray(direct)) return direct;
        if (direct && typeof direct === 'object' && !Array.isArray(direct)) return [direct];
      }
      for (const child of Object.values(value)) {
        if (child && typeof child === 'object') queue.push(child);
      }
    }
    return [];
  }

  function pick(record, keys) {
    for (const key of keys) {
      const value = record?.[key];
      if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
    }
    return '';
  }

  function liveLawCards(data) {
    return firstObjectArray(data, ['law', '법령']).slice(0, 3).map(record => {
      const title = pick(record, ['법령명한글', '법령명', 'lawName', '법령명_한글']) || '법령';
      const ministry = pick(record, ['소관부처명', '소관부처', '담당부처']);
      const effective = pick(record, ['시행일자', '시행일']);
      const detail = [ministry, effective ? `시행 ${effective}` : ''].filter(Boolean).join(' · ') || '국가법령정보 공동활용 실시간 조회';
      return sourceCard(`LIVE 법령 · ${title}`, detail, `https://www.law.go.kr/lsSc.do?query=${encodeURIComponent(title)}`);
    });
  }

  function livePrecedentCards(data) {
    return firstObjectArray(data, ['prec', '판례']).slice(0, 3).map(record => {
      const title = pick(record, ['사건명', '판례명']) || '판례';
      const caseNo = pick(record, ['사건번호', '사건_번호']);
      const court = pick(record, ['법원명', '법원']);
      const date = pick(record, ['선고일자', '선고일']);
      const detail = [caseNo, court, date].filter(Boolean).join(' · ') || '국가법령정보 공동활용 실시간 조회';
      return sourceCard(`LIVE 판례 · ${title}`, detail, `https://www.law.go.kr/precSc.do?query=${encodeURIComponent(caseNo || title)}`);
    });
  }

  async function render(value) {
    const token = ++renderToken;
    const query = value.trim();
    grid.replaceChildren();
    document.querySelector('.case-tags')?.remove();
    if (!query) {
      status.textContent = '법률명·조문·판례번호·법률 쟁점을 입력하세요.';
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = '검색어를 입력하면 실시간 법령·판례와 검색 가능한 법률정보원이 표시됩니다.';
      grid.append(empty);
      return;
    }

    const cases = detectCases(query);
    const primary = cases[0] || query;
    const q = encodeURIComponent(query);
    const p = encodeURIComponent(primary);
    status.textContent = cases.length ? `판례번호 ${cases.length}건을 인식했습니다. 실시간 법률정보를 조회합니다.` : '실시간 법령·판례를 조회합니다.';

    if (cases.length) {
      const tags = document.createElement('div');
      tags.className = 'case-tags';
      cases.forEach(caseNo => {
        const tag = document.createElement('span');
        tag.className = 'case-tag';
        tag.textContent = caseNo;
        tags.append(tag);
      });
      status.insertAdjacentElement('afterend', tags);
    }

    const settled = await Promise.allSettled([
      loadPublicData('law-current', { query, display: '3' }),
      loadPublicData('precedent-list', { query: primary, display: '3' })
    ]);
    if (token !== renderToken) return;

    const liveCards = [];
    if (settled[0].status === 'fulfilled') liveCards.push(...liveLawCards(settled[0].value));
    if (settled[1].status === 'fulfilled') liveCards.push(...livePrecedentCards(settled[1].value));
    liveCards.forEach(card => grid.append(card));

    grid.append(
      sourceCard('국가법령정보센터 · 법령검색', '법률명·조문·법령본문을 검색합니다.', `https://www.law.go.kr/lsSc.do?query=${q}`),
      sourceCard('국가법령정보센터 · 판례검색', cases.length ? `사건번호 ${primary}를 기준으로 판례 원자료를 찾습니다.` : '사건번호 또는 판례 키워드로 원자료를 찾습니다.', `https://www.law.go.kr/precSc.do?query=${p}`),
      sourceCard('CaseNote · 판례 보조검색', '입력한 사건번호 또는 판례 키워드를 검색합니다.', `https://casenote.kr/search/?q=${p}`),
      sourceCard('Google · 법률검색', '입력한 검색어를 Google에서 폭넓게 검색합니다.', `https://www.google.com/search?q=${q}`),
      sourceCard('NEXUS 법률정보 포털', '법령·입법·판례·행정해석·연구자료를 확인합니다.', `../legal-intelligence/?q=${q}`, true)
    );

    const liveCount = liveCards.length;
    status.textContent = liveCount
      ? `공공 API 실시간 결과 ${liveCount}건을 불러왔습니다.`
      : '실시간 결과가 없거나 일시적으로 응답하지 않았습니다. 공식 검색 연결은 계속 사용할 수 있습니다.';
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const value = input.value.trim();
    const url = new URL(location.href);
    if (value) url.searchParams.set('q', value); else url.searchParams.delete('q');
    history.replaceState(null, '', `${url.pathname}${url.search}`);
    render(value);
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    history.replaceState(null, '', location.pathname);
    render('');
    input.focus();
  });

  const initial = new URL(location.href).searchParams.get('q') || '';
  input.value = initial;
  render(initial);
})();