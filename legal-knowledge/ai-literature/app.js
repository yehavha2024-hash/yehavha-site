(() => {
  const records = Array.isArray(window.AI_LITERATURE_RECORDS) ? window.AI_LITERATURE_RECORDS : [];
  const routes = Array.isArray(window.AI_LITERATURE_ROUTES) ? window.AI_LITERATURE_ROUTES : [];
  const byId = new Map(records.map(record => [record.id, record]));
  const state = { query:"", type:"전체", area:"전체", priority:"all", stage:"all", routeIds:null };

  const els = {
    recordCount: document.getElementById("recordCount"),
    routeCount: document.getElementById("routeCount"),
    routeGrid: document.getElementById("routeGrid"),
    searchInput: document.getElementById("searchInput"),
    typeFilters: document.getElementById("typeFilters"),
    areaFilters: document.getElementById("areaFilters"),
    prioritySelect: document.getElementById("prioritySelect"),
    stageSelect: document.getElementById("stageSelect"),
    resetButton: document.getElementById("resetButton"),
    resultCount: document.getElementById("resultCount"),
    cards: document.getElementById("cards"),
    emptyState: document.getElementById("emptyState"),
    dialog: document.getElementById("detailDialog"),
    detailContent: document.getElementById("detailContent"),
    dialogClose: document.getElementById("dialogClose")
  };

  const escapeHtml = value => String(value ?? "").replace(/[&<>'\"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'\"':"&quot;"}[char]));
  const normalize = value => String(value ?? "").toLocaleLowerCase("ko-KR").replace(/\s+/g," ").trim();
  const unique = values => [...new Set(values)].filter(Boolean);

  function makeButton(label, key, value) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-button";
    button.textContent = label;
    button.dataset.filterKey = key;
    button.dataset.filterValue = value;
    button.addEventListener("click", () => {
      state[key] = value;
      state.routeIds = null;
      renderFilters();
      renderCards();
    });
    return button;
  }

  function renderFilters() {
    const types = ["전체", ...unique(records.map(r => r.type))];
    const areas = ["전체", ...unique(records.flatMap(r => r.legalAreas || []))];
    els.typeFilters.replaceChildren(...types.map(type => makeButton(type, "type", type)));
    els.areaFilters.replaceChildren(...areas.map(area => makeButton(area, "area", area)));
    els.typeFilters.querySelectorAll("button").forEach(button => button.classList.toggle("active", button.dataset.filterValue === state.type));
    els.areaFilters.querySelectorAll("button").forEach(button => button.classList.toggle("active", button.dataset.filterValue === state.area));
  }

  function initStageOptions() {
    const stages = unique(records.map(r => r.stage));
    stages.forEach(stage => {
      const option = document.createElement("option");
      option.value = stage;
      option.textContent = stage;
      els.stageSelect.appendChild(option);
    });
  }

  function renderRoutes() {
    els.routeGrid.replaceChildren(...routes.map((route, index) => {
      const article = document.createElement("article");
      article.className = "route-card";
      article.innerHTML = `
        <div class="route-head"><div><div class="route-no">${String(index + 1).padStart(2,"0")} · ${escapeHtml(route.area)}</div><h3>${escapeHtml(route.title)}</h3></div><span class="meta-chip">${route.recordIds.length}개</span></div>
        <p>${escapeHtml(route.description)}</p>
        <div class="route-path">${escapeHtml(route.path)}</div>
      `;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "route-button";
      button.textContent = "이 경로 문헌 보기 →";
      button.addEventListener("click", () => {
        state.routeIds = new Set(route.recordIds);
        state.query = "";
        state.type = "전체";
        state.area = "전체";
        state.priority = "all";
        state.stage = "all";
        els.searchInput.value = "";
        els.prioritySelect.value = "all";
        els.stageSelect.value = "all";
        renderFilters();
        renderCards();
        document.getElementById("library-title")?.scrollIntoView({behavior:"smooth", block:"start"});
      });
      article.appendChild(button);
      return article;
    }));
  }

  function searchableText(record) {
    return normalize([
      record.title, record.translatedTitle, record.author, record.publication, record.summary,
      record.researchFit, record.counterpoint, record.type, record.stage, record.priority,
      ...(record.legalAreas || []), ...(record.issues || []), ...(record.mustRead || []), ...(record.argumentUse || [])
    ].join(" "));
  }

  function filteredRecords() {
    const query = normalize(state.query);
    return records.filter(record => {
      if (state.routeIds && !state.routeIds.has(record.id)) return false;
      if (state.type !== "전체" && record.type !== state.type) return false;
      if (state.area !== "전체" && !(record.legalAreas || []).includes(state.area)) return false;
      if (state.priority !== "all" && record.priority !== state.priority) return false;
      if (state.stage !== "all" && record.stage !== state.stage) return false;
      if (query && !searchableText(record).includes(query)) return false;
      return true;
    });
  }

  function cardFor(record) {
    const article = document.createElement("article");
    article.className = "literature-card";
    const titleSecondary = record.translatedTitle ? `<p class="translated-title">${escapeHtml(record.translatedTitle)}</p>` : "";
    article.innerHTML = `
      <div class="card-top"><span class="type-label">${escapeHtml(record.type)} · ${escapeHtml(record.stage)}</span><span class="priority">${escapeHtml(record.priority)} · ${record.priority === "A" ? "핵심" : record.priority === "B" ? "심화" : "확장"}</span></div>
      <h3>${escapeHtml(record.title)}</h3>
      ${titleSecondary}
      <p class="bibliography">${escapeHtml(record.author)} · ${escapeHtml(record.year)} · ${escapeHtml(record.publication)}</p>
      <p class="card-summary">${escapeHtml(record.summary)}</p>
      <div class="tag-row">${(record.legalAreas || []).slice(0,3).map(area => `<span class="tag">${escapeHtml(area)}</span>`).join("")}</div>
      <div class="card-use"><strong>연구 접목</strong>${escapeHtml(record.researchFit)}</div>
    `;
    const actions = document.createElement("div");
    actions.className = "card-actions";
    const detail = document.createElement("button");
    detail.type = "button";
    detail.className = "card-button";
    detail.textContent = "연구노트 열기 →";
    detail.addEventListener("click", () => openDetail(record));
    actions.appendChild(detail);
    article.appendChild(actions);
    return article;
  }

  function renderCards() {
    const result = filteredRecords();
    els.cards.replaceChildren(...result.map(cardFor));
    els.resultCount.textContent = `${result.length}개 문헌 표시${state.routeIds ? " · 읽기 경로 필터 적용" : ""}`;
    els.emptyState.hidden = result.length !== 0;
  }

  function relatedList(record) {
    return (record.related || []).map(id => byId.get(id)).filter(Boolean);
  }

  function listHtml(items) {
    return `<ul>${(items || []).map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function openDetail(record) {
    const related = relatedList(record);
    const originalLine = record.translatedTitle ? `<p class="detail-original-title">${escapeHtml(record.translatedTitle)}</p>` : "";
    const relatedHtml = related.length ? `<ul>${related.map(item => `<li><button type="button" class="inline-related" data-related-id="${escapeHtml(item.id)}">${escapeHtml(item.author)} · ${escapeHtml(item.title)}</button></li>`).join("")}</ul>` : `<p>연결 문헌 없음</p>`;
    els.detailContent.innerHTML = `
      <header class="detail-header">
        <div class="section-kicker">${escapeHtml(record.type)} · PRIORITY ${escapeHtml(record.priority)} · ${escapeHtml(record.stage)}</div>
        <h2 id="detailTitle">${escapeHtml(record.title)}</h2>
        ${originalLine}
        <p>${escapeHtml(record.author)} · ${escapeHtml(record.year)} · ${escapeHtml(record.publication)}</p>
        <div class="tag-row">${(record.legalAreas || []).map(area => `<span class="tag">${escapeHtml(area)}</span>`).join("")}</div>
      </header>
      <nav class="detail-toc" aria-label="문헌 상세 목차">
        <a href="#detail-biblio">01 서지정보</a><a href="#detail-summary">02 핵심 요지</a><a href="#detail-must">03 반드시 볼 논점</a><a href="#detail-use">04 주장에 쓰는 방식</a><a href="#detail-fit">05 현재 연구 접목</a><a href="#detail-counter">06 반대·보완</a><a href="#detail-related">07 연결 문헌</a><a href="#detail-source">08 링크</a>
      </nav>
      <section class="detail-section" id="detail-biblio"><h3>01 서지정보</h3><div class="citation-box">${escapeHtml(record.citation)}</div></section>
      <section class="detail-section" id="detail-summary"><h3>02 핵심 요지</h3><p>${escapeHtml(record.summary)}</p></section>
      <section class="detail-section" id="detail-must"><h3>03 반드시 볼 논점</h3>${listHtml(record.mustRead)}</section>
      <section class="detail-section" id="detail-use"><h3>04 주장에 쓰는 방식</h3>${listHtml(record.argumentUse)}</section>
      <section class="detail-section" id="detail-fit"><h3>05 현재 연구와의 구체적 접목</h3><p>${escapeHtml(record.researchFit)}</p></section>
      <section class="detail-section" id="detail-counter"><h3>06 반대논리·적용상 주의</h3><p>${escapeHtml(record.counterpoint)}</p></section>
      <section class="detail-section" id="detail-related"><h3>07 반대·보완·연결 문헌</h3>${relatedHtml}</section>
      <section class="detail-section" id="detail-source"><h3>08 원문·서지 링크</h3><p>${escapeHtml(record.access)}</p><a class="source-link" href="${escapeHtml(record.url)}" target="_blank" rel="noopener noreferrer">원문·서지 확인 ↗</a></section>
      <footer class="detail-footer"><p>Copyright © 이명훈 2026. All rights reserved.</p><p>AI 활용 요약은 원문을 대체하지 않으며 직접 인용 전 원문·쪽수·최신 규범을 재검증합니다.</p></footer>
    `;
    els.detailContent.querySelectorAll(".inline-related").forEach(button => {
      button.addEventListener("click", () => {
        const target = byId.get(button.dataset.relatedId);
        if (target) openDetail(target);
      });
    });
    els.dialog.showModal();
    document.body.style.overflow = "hidden";
    els.dialog.querySelector(".dialog-shell").scrollTop = 0;
  }

  function closeDialog() {
    if (els.dialog.open) els.dialog.close();
    document.body.style.overflow = "";
  }

  function resetFilters() {
    state.query = "";
    state.type = "전체";
    state.area = "전체";
    state.priority = "all";
    state.stage = "all";
    state.routeIds = null;
    els.searchInput.value = "";
    els.prioritySelect.value = "all";
    els.stageSelect.value = "all";
    renderFilters();
    renderCards();
  }

  els.searchInput.addEventListener("input", event => { state.query = event.target.value; state.routeIds = null; renderCards(); });
  els.prioritySelect.addEventListener("change", event => { state.priority = event.target.value; state.routeIds = null; renderCards(); });
  els.stageSelect.addEventListener("change", event => { state.stage = event.target.value; state.routeIds = null; renderCards(); });
  els.resetButton.addEventListener("click", resetFilters);
  els.dialogClose.addEventListener("click", closeDialog);
  els.dialog.addEventListener("click", event => { if (event.target === els.dialog) closeDialog(); });
  els.dialog.addEventListener("close", () => { document.body.style.overflow = ""; });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && els.dialog.open) closeDialog(); });

  els.recordCount.textContent = `코어 문헌 ${records.length}`;
  els.routeCount.textContent = `읽기 경로 ${routes.length}`;
  initStageOptions();
  renderFilters();
  renderRoutes();
  renderCards();
})();
