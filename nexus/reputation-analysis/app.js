(() => {
  const form = document.getElementById('queryForm');
  const input = document.getElementById('targetInput');
  const status = document.getElementById('statusPanel');
  const report = document.getElementById('report');
  const submit = document.getElementById('submitBtn');

  const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const formatDate = value => {
    if (!value) return '';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('ko-KR', {year:'numeric',month:'2-digit',day:'2-digit'});
  };

  function opinionMarkup(opinions) {
    if (!opinions.length) return '<article class="source empty"><span class="source-id">—</span><div><strong>실제 후기 내용을 확보하지 못했습니다.</strong><p>회사 소개·채용공고·연봉정보는 평판 근거에서 제외했습니다. 아래 추가 확인 경로에서 원문을 직접 확인하십시오.</p></div></article>';
    return opinions.map(item => {
      const meta = [item.platform, item.host, formatDate(item.publishedAt)].filter(Boolean).join(' · ');
      return `<article class="source">
        <span class="source-id">${esc(item.id)}</span>
        <div class="source-copy">
          <strong>${esc(item.title || item.platform || '공개 후기')}</strong>
          <p>${esc(meta)}${item.excerpt ? `<span class="source-snippet">${esc(item.excerpt)}</span>` : ''}</p>
        </div>
        <a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">원문 ↗</a>
      </article>`;
    }).join('');
  }

  function themeMarkup(themes, byId) {
    if (!themes.length) return '<article class="signal signal-empty"><h4>반복 주제 확인 제한</h4><p>실제 후기 자료가 적거나 서로 다른 주제로 흩어져 있어 반복 패턴을 만들지 않았습니다.</p></article>';
    return themes.map(theme => {
      const excerpts = (theme.opinionIds || []).slice(0,4).map(id => byId.get(id)).filter(Boolean);
      const detail = excerpts.map(item => `<p><span class="refs">${esc(item.id)} · ${esc(item.platform)}</span><br>${esc(item.excerpt)}</p>`).join('');
      return `<article class="signal"><div class="signal-top"><h4>${esc(theme.topic)}</h4><span class="signal-state mixed">${esc(theme.count)}건</span></div>${detail}</article>`;
    }).join('');
  }

  function platformMarkup(platforms) {
    if (!platforms.length) return '<article class="signal signal-empty"><h4>출처 없음</h4><p>실제 후기 자료가 확보되지 않았습니다.</p></article>';
    return platforms.map(item => `<article class="signal"><div class="signal-top"><h4>${esc(item.name)}</h4><span class="signal-state mixed">${esc(item.count)}건</span></div><p>${esc(item.hosts.join(' · '))}</p></article>`).join('');
  }

  function actionMarkup(actions) {
    if (!actions.length) return '<article class="action-item"><span class="action-priority">확인</span><div><strong>정보 부족</strong><p>공개 후기가 적다면 회사가 좋다는 뜻으로 해석하지 말고, 실제 근무시간·보고라인·수습조건·급여일·공석 사유를 면접과 근로계약서에서 직접 확인하십시오.</p></div></article>';
    return actions.map((item,index) => `<article class="action-item"><span class="action-priority">${index === 0 ? '우선' : '확인'}</span><div><strong>${esc(item.title)}</strong><p>${esc(item.text)}</p>${item.refs?.length ? `<span class="action-refs">근거 ${esc(item.refs.join(' · '))}</span>` : ''}</div></article>`).join('');
  }

  function render(data) {
    const opinions = Array.isArray(data.opinions) ? data.opinions : [];
    const themes = Array.isArray(data.themes) ? data.themes : [];
    const platforms = Array.isArray(data.platforms) ? data.platforms : [];
    const actions = Array.isArray(data.actions) ? data.actions : [];
    const byId = new Map(opinions.map(item => [item.id, item]));
    const generated = new Date(data.generatedAt).toLocaleString('ko-KR');

    document.getElementById('reportTitle').textContent = `${data.company} 회사 평판 분석`;
    document.getElementById('reportMeta').textContent = `구직자용 · 기준 ${generated}`;
    document.getElementById('metricGrid').innerHTML = [
      ['실제 후기', `${opinions.length}건`],
      ['출처·플랫폼', `${platforms.length}곳`],
      ['반복 주제', `${themes.length}개`],
      ['제외한 비평판 자료', `${data.metrics?.excludedNonOpinion ?? 0}건`]
    ].map(([label,value]) => `<div class="metric"><span>${label}</span><strong>${value}</strong></div>`).join('');

    document.getElementById('executiveSummary').textContent = data.summary;
    document.getElementById('coverageText').textContent = opinions.length ? `실제 경험 내용이 확인된 공개 자료 ${opinions.length}건을 채택했습니다.` : '실제 경험 내용이 확인되는 공개 자료를 충분히 확보하지 못했습니다.';
    document.getElementById('themeText').textContent = themes.length ? themes.slice(0,5).map(t => `${t.topic} ${t.count}건`).join(' · ') : '반복 주제 확인 제한';
    document.getElementById('limitText').textContent = '공개 후기는 작성자 경험과 시점에 따라 달라질 수 있습니다. 이 화면은 후기의 사실 여부나 회사 전체를 단정하지 않고 반복되는 확인 포인트를 보여줍니다.';
    document.getElementById('identitySummary').textContent = data.identity?.message || '회사명이 검색 결과에 직접 연결되는 자료만 채택했습니다.';

    document.getElementById('themeGrid').innerHTML = themeMarkup(themes, byId);
    document.getElementById('opinionSourceList').innerHTML = opinionMarkup(opinions);
    document.getElementById('platformGrid').innerHTML = platformMarkup(platforms);
    document.getElementById('actionSummary').textContent = actions.length ? '아래 질문은 실제 반복된 공개 의견에서 나온 쟁점을 면접·입사 전 확인사항으로 바꾼 것입니다.' : '실제 후기 자료가 부족해 일반적인 입사 전 확인사항만 표시합니다.';
    document.getElementById('actionList').innerHTML = actionMarkup(actions);
    document.getElementById('searchLinks').innerHTML = (data.searchLinks || []).map(link => `<a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.label)} ↗</a>`).join('');
    document.getElementById('methodBox').innerHTML =
      `<p><strong>채택 기준</strong> ${esc(data.methodology?.accepted || '')}</p>` +
      `<p><strong>제외 기준</strong> ${esc(data.methodology?.excluded || '')}</p>` +
      `<p><strong>검색 범위</strong> ${esc(data.methodology?.coverage || '')}</p>` +
      `<p><strong>내부 처리</strong> 검색 후보 ${esc(data.metrics?.rawCandidates ?? 0)}건 중 회사 직접일치·실제 의견 내용 조건을 통과한 자료만 표시했습니다.</p>`;

    status.hidden = true;
    report.hidden = false;
    report.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function renderError(message) {
    status.hidden = false;
    document.getElementById('statusTitle').textContent = '회사 평판 분석을 완료하지 못했습니다.';
    document.getElementById('statusText').textContent = message;
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const company = input.value.trim();
    if (company.length < 2) {input.focus(); return;}
    report.hidden = true;
    status.hidden = false;
    submit.disabled = true;
    document.getElementById('statusTitle').textContent = `${company}의 실제 공개 후기를 찾고 있습니다.`;
    document.getElementById('statusText').textContent = '공개 후기 탐색 → 회사 직접일치 확인 → 소개·채용정보 제외 → 실제 경험 문장 추출 → 반복 주제 분석';
    try {
      const response = await fetch('/api/reputation-analysis', {
        method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({company})
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || '분석 API 오류');
      render(data);
    } catch (error) {
      renderError(`공개 출처 연결 또는 분석 과정에서 오류가 발생했습니다. 잠시 후 다시 시도하십시오. (${error.message})`);
    } finally {
      submit.disabled = false;
    }
  });
})();
