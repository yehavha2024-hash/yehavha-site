(() => {
  const sourceText = document.getElementById('sourceText');
  const directInput = document.getElementById('directInput');
  const searchBtn = document.getElementById('searchBtn');
  const clearBtn = document.getElementById('clearBtn');
  const resultGrid = document.getElementById('resultGrid');
  const detectedCount = document.getElementById('detectedCount');
  const statusText = document.getElementById('statusText');

  const casePattern = /(?:19|20)?\d{2}\s*(?:가합|가단|가소|나|다|라|마|재다|재나|두|구합|구단|누|도|노|고합|고단|고정|카합|카단|카명|카기|카경|카정|카확|카허|카담|카임|카소|헌가|헌나|헌다|헌라|헌마|헌바|헌사|헌아|후|허|므|스)\s*\d{1,10}/g;

  function normalizeCaseNo(value) {
    return value.replace(/\s+/g, '').trim();
  }

  function detect(text) {
    const found = text.match(casePattern) || [];
    return [...new Set(found.map(normalizeCaseNo))];
  }

  function urls(caseNo) {
    const q = encodeURIComponent(caseNo);
    return {
      official: `https://www.law.go.kr/precSc.do?menuId=7&query=${q}`,
      casenote: `https://casenote.kr/search/?q=${q}`,
      nexus: `../legal-intelligence/?q=${q}#source-workbench`
    };
  }

  function card(caseNo) {
    const link = urls(caseNo);
    const article = document.createElement('article');
    article.className = 'case-card';
    article.innerHTML = `
      <div class="case-copy">
        <small>DETECTED CASE NUMBER</small>
        <strong>${caseNo}</strong>
      </div>
      <div class="case-actions">
        <a href="${link.official}" target="_blank" rel="noopener noreferrer">원자료</a>
        <a href="${link.casenote}" target="_blank" rel="noopener noreferrer">CaseNote</a>
        <a href="${link.nexus}">NEXUS</a>
      </div>`;
    return article;
  }

  function render(items, message) {
    resultGrid.innerHTML = '';
    detectedCount.textContent = `인식 ${items.length}건`;
    statusText.textContent = message || (items.length ? '인식된 사건번호에서 바로 검색할 수 있습니다.' : '텍스트를 입력하면 자동으로 판례번호를 찾습니다.');
    if (!items.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = '인식된 사건번호가 없습니다.';
      resultGrid.appendChild(empty);
      return;
    }
    items.forEach(item => resultGrid.appendChild(card(item)));
  }

  function runAuto() {
    render(detect(sourceText.value));
  }

  function runDirect() {
    const raw = directInput.value.trim();
    if (!raw) {
      runAuto();
      return;
    }
    const items = detect(raw);
    if (items.length) {
      render(items, '직접 입력한 사건번호를 인식했습니다.');
      return;
    }
    render([], '사건번호 형식을 확인해 주세요. 예: 2003다29043');
  }

  let timer;
  sourceText.addEventListener('input', () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(runAuto, 120);
  });
  searchBtn.addEventListener('click', runDirect);
  directInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') runDirect();
  });
  clearBtn.addEventListener('click', () => {
    sourceText.value = '';
    directInput.value = '';
    render([]);
    sourceText.focus();
  });
})();
