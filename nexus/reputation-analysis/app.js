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
    if (!opinions.length) return '<article class="source empty"><span class="source-id">—</span><div><strong>문장까지 공개된 실제 후기를 확보하지 못했습니다.</strong><p>플랫폼에 등록된 리뷰 수·평점과 개별 후기 전문은 구분합니다. 읽을 수 없는 후기 내용은 추정하지 않습니다.</p></div></article>';
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

  function aggregateMarkup(signals) {
    if (!signals.length) return '<article class="signal signal-empty"><h4>공개 플랫폼 집계 미확보</h4><p>현재 자동 검색에서 회사와 직접 연결되는 사용자 리뷰 집계 페이지를 확인하지 못했습니다.</p></article>';
    return signals.map(item => {
      const stats = [];
      if (Number.isFinite(Number(item.reviewCount))) stats.push(`기업리뷰 ${Number(item.reviewCount).toLocaleString('ko-KR')}건`);
      if (Number.isFinite(Number(item.interviewCount))) stats.push(`면접후기 ${Number(item.interviewCount).toLocaleString('ko-KR')}건`);
      if (Number.isFinite(Number(item.rating))) stats.push(`전체평점 ${Number(item.rating).toFixed(1)}/5`);
      if (Number.isFinite(Number(item.recommendRate))) stats.push(`기업추천율 ${Number(item.recommendRate)}%`);
      if (Number.isFinite(Number(item.ceoSupportRate))) stats.push(`CEO 지지율 ${Number(item.ceoSupportRate)}%`);
      if (Number.isFinite(Number(item.growthRate))) stats.push(`성장가능성 ${Number(item.growthRate)}%`);
      const categories = Object.entries(item.categories || {}).map(([key,value]) => `${key} ${Number(value).toFixed(1)}/5`);
      return `<article class="signal">
        <div class="signal-top"><h4>${esc(item.platform)}</h4><span class="signal-state mixed">사용자 집계</span></div>
        <p>${esc(stats.join(' · ') || '공개 집계 확인')}</p>
        ${categories.length ? `<p>${esc(categories.join(' · '))}</p>` : ''}
        <p>${esc(item.note || '')}</p>
        ${item.url ? `<p><a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">평판 원문 페이지 ↗</a></p>` : ''}
      </article>`;
    }).join('');
  }

  function themeMarkup(themes, byId) {
    if (!themes.length) return '<article class="signal signal-empty"><h4>반복 주제 확인 제한</h4><p>실제 문장까지 공개된 후기 자료가 적거나 서로 다른 주제로 흩어져 있어 반복 패턴을 만들지 않았습니다.</p></article>';
    return themes.map(theme => {
      const excerpts = (theme.opinionIds || []).slice(0,4).map(id => byId.get(id)).filter(Boolean);
      const detail = excerpts.map(item => `<p><span class="refs">${esc(item.id)} · ${esc(item.platform)}</span><br>${esc(item.excerpt)}</p>`).join('');
      return `<article class="signal"><div class="signal-top"><h4>${esc(theme.topic)}</h4><span class="signal-state mixed">${esc(theme.count)}건</span></div>${detail}</article>`;
    }).join('');
  }

  function platformMarkup(platforms) {
    if (!platforms.length) return '<article class="signal signal-empty"><h4>내용 확인 출처 없음</h4><p>플랫폼 집계는 있을 수 있지만 실제 후기 문장까지 공개된 출처는 현재 자동 검색에서 확보하지 못했습니다.</p></article>';
    return platforms.map(item => `<article class="signal"><div class="signal-top"><h4>${esc(item.name)}</h4><span class="signal-state mixed">${esc(item.count)}건</span></div><p>${esc(item.hosts.join(' · '))}</p></article>`).join('');
  }

  function actionMarkup(actions) {
    if (!actions.length) return '<article class="action-item"><span class="action-priority">확인</span><div><strong>실제 내용 추가 확인</strong><p>공개된 개별 후기 문장이 부족하면 리뷰 수나 평점만으로 결론내리지 말고, 면접에서 실제 근무시간·보고라인·수습조건·급여일·공석 사유·전임자 근속기간을 직접 확인하십시오.</p></div></article>';
    return actions.map((item,index) => `<article class="action-item"><span class="action-priority">${index === 0 ? '우선' : '확인'}</span><div><strong>${esc(item.title)}</strong><p>${esc(item.text)}</p>${item.refs?.length ? `<span class="action-refs">근거 ${esc(item.refs.join(' · '))}</span>` : ''}</div></article>`).join('');
  }

  function render(data) {
    const opinions = Array.isArray(data.opinions) ? data.opinions : [];
    const themes = Array.isArray(data.themes) ? data.themes : [];
    const platforms = Array.isArray(data.platforms) ? data.platforms : [];
    const platformSignals = Array.isArray(data.platformSignals) ? data.platformSignals : [];
    const actions = Array.isArray(data.actions) ? data.actions : [];
    const byId = new Map(opinions.map(item => [item.id, item]));
    const generated = new Date(data.generatedAt).toLocaleString('ko-KR');
    const indexedReviews = Number(data.metrics?.indexedReviewCount || 0);
    const indexedInterviews = Number(data.metrics?.indexedInterviewCount || 0);

    document.getElementById('reportTitle').textContent = `${data.company} 회사 평판 분석`;
    document.getElementById('reportMeta').textContent = `구직자용 · 기준 ${generated}`;
    document.getElementById('metricGrid').innerHTML = [
      ['플랫폼 사용자 리뷰', indexedReviews ? `${indexedReviews.toLocaleString('ko-KR')}건` : '확인 제한'],
      ['플랫폼 면접후기', indexedInterviews ? `${indexedInterviews.toLocaleString('ko-KR')}건` : '확인 제한'],
      ['내용까지 공개된 후기', `${opinions.length}건`],
      ['제외한 비평판 자료', `${data.metrics?.excludedNonOpinion ?? 0}건`]
    ].map(([label,value]) => `<div class="metric"><span>${label}</span><strong>${value}</strong></div>`).join('');

    document.getElementById('executiveSummary').textContent = data.summary;
    document.getElementById('coverageText').textContent = indexedReviews || indexedInterviews
      ? `공개 평판 플랫폼에서 사용자 리뷰 ${indexedReviews || '확인 제한'}건${indexedInterviews ? `, 면접후기 ${indexedInterviews}건` : ''}을 확인했습니다. 실제 문장까지 자동 확인된 자료는 ${opinions.length}건입니다.`
      : `회사와 직접 연결되는 실제 공개 경험 문장은 ${opinions.length}건 확인했습니다.`;
    document.getElementById('themeText').textContent = themes.length ? themes.slice(0,5).map(t => `${t.topic} ${t.count}건`).join(' · ') : '공개된 개별 후기 문장 기준 반복 주제 확인 제한';
    document.getElementById('limitText').textContent = '플랫폼의 리뷰 수·평점은 사용자 집계자료이고, 개별 후기 내용은 별도입니다. 멤버십·로그인이 필요한 후기 전문은 우회하지 않으며 보이지 않는 내용을 추정하지 않습니다.';
    document.getElementById('identitySummary').textContent = data.identity?.message || '회사명이 검색 결과에 직접 연결되는 자료만 채택했습니다.';

    document.getElementById('aggregateGrid').innerHTML = aggregateMarkup(platformSignals);
    document.getElementById('themeGrid').innerHTML = themeMarkup(themes, byId);
    document.getElementById('opinionSourceList').innerHTML = opinionMarkup(opinions);
    document.getElementById('platformGrid').innerHTML = platformMarkup(platforms);
    document.getElementById('actionSummary').textContent = actions.length ? '아래 질문은 실제 문장까지 공개된 후기에서 반복된 쟁점을 면접·입사 전 확인사항으로 바꾼 것입니다.' : '개별 후기 내용이 충분하지 않아 리뷰 집계만으로 행동 결론을 만들지 않습니다. 아래 기본 검증사항을 직접 확인하십시오.';
    document.getElementById('actionList').innerHTML = actionMarkup(actions);
    document.getElementById('searchLinks').innerHTML = (data.searchLinks || []).map(link => `<a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.label)} ↗</a>`).join('');
    document.getElementById('methodBox').innerHTML =
      `<p><strong>채택 기준</strong> ${esc(data.methodology?.accepted || '')}</p>` +
      `<p><strong>제외 기준</strong> ${esc(data.methodology?.excluded || '')}</p>` +
      `<p><strong>검색 범위</strong> ${esc(data.methodology?.coverage || '')}</p>` +
      `<p><strong>내부 처리</strong> 검색 후보 ${esc(data.metrics?.rawCandidates ?? 0)}건 중 회사 직접일치 자료를 분리하고, 사용자 집계 통계와 실제 공개 경험 문장을 서로 다른 근거로 처리했습니다.</p>`;

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
    document.getElementById('statusTitle').textContent = `${company}의 회사 평판 자료를 찾고 있습니다.`;
    document.getElementById('statusText').textContent = '평판 플랫폼 탐색 → 회사 직접일치 확인 → 회사소개·채용정보 분리 → 사용자 리뷰 통계 확인 → 실제 공개 의견 분석';
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
