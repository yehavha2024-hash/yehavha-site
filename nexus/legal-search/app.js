(() => {
  const form = document.getElementById('legalSearchForm');
  const input = document.getElementById('legalQuery');
  const clearBtn = document.getElementById('clearBtn');
  const status = document.getElementById('searchStatus');
  const grid = document.getElementById('sourceGrid');
  const casePattern = /(?:19|20)?\d{2}\s*(?:가합|가단|가소|나|다|라|마|재다|재나|두|구합|구단|누|도|노|고합|고단|고정|카합|카단|카명|카기|카경|카정|카확|카허|카담|카임|카소|헌가|헌나|헌다|헌라|헌마|헌바|헌사|헌아|후|허|므|스)\s*\d{1,10}/g;

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

  function render(value) {
    const query = value.trim();
    grid.replaceChildren();
    document.querySelector('.case-tags')?.remove();
    if (!query) {
      status.textContent = '법률명·조문·판례번호·법률 쟁점을 입력하세요.';
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = '검색어를 입력하면 검색 가능한 법률정보원이 표시됩니다.';
      grid.append(empty);
      return;
    }

    const cases = detectCases(query);
    const primary = cases[0] || query;
    const q = encodeURIComponent(query);
    const p = encodeURIComponent(primary);
    status.textContent = cases.length ? `판례번호 ${cases.length}건을 인식했습니다.` : '일반 법률검색으로 연결합니다.';

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

    grid.append(
      sourceCard('국가법령정보센터 · 법령검색', '법률명·조문·법령본문을 검색합니다.', `https://www.law.go.kr/lsSc.do?query=${q}`),
      sourceCard('국가법령정보센터 · 판례검색', cases.length ? `사건번호 ${primary}를 기준으로 판례 원자료를 찾습니다.` : '사건번호 또는 판례 키워드로 원자료를 찾습니다.', `https://www.law.go.kr/precSc.do?query=${p}`),
      sourceCard('CaseNote · 판례 보조검색', '입력한 사건번호 또는 판례 키워드를 검색합니다.', `https://casenote.kr/search/?q=${p}`),
      sourceCard('NEXUS 법률정보 포털', '법령·입법·판례·행정해석·연구자료를 확인합니다.', `../legal-intelligence/?q=${q}`, true)
    );
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
