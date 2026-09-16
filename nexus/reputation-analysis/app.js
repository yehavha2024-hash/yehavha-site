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
    if (!opinions.length) return '<article class="source empty"><span class="source-id">—</span><div><strong>자동 검색에서 원문 문장까지 직접 확보된 후기는 없습니다.</strong><p>플랫폼의 공개 집계·사용자 제출 공개 화면과 자동 수집된 후기 원문은 서로 다른 근거로 분리합니다. 집계에 포함된 익명 후기 내용을 임의로 추정하지 않습니다.</p></div></article>';
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

  function evidenceMarkup(items) {
    if (!items.length) return '<article class="source empty"><span class="source-id">—</span><div><strong>추가 공개자료 신호를 확보하지 못했습니다.</strong><p>검색 결과를 억지로 채우지 않고 회사와 직접 연결되는 공개자료만 표시합니다.</p></div></article>';
    return items.map(item => {
      const meta = [item.label || item.kind, item.host, formatDate(item.publishedAt)].filter(Boolean).join(' · ');
      return `<article class="source">
        <span class="source-id">${esc(item.id || 'E')}</span>
        <div class="source-copy">
          <strong>${esc(item.title || '공개자료')}</strong>
          <p>${esc(meta)}${item.snippet ? `<span class="source-snippet">${esc(item.snippet)}</span>` : ''}</p>
        </div>
        <a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">원문 ↗</a>
      </article>`;
    }).join('');
  }

  function aggregateMarkup(signals) {
    if (!signals.length) return '<article class="signal signal-empty"><h4>공개 플랫폼 집계 미확보</h4><p>현재 자동 검색 또는 제출 자료에서 회사와 직접 연결되는 사용자 리뷰 집계를 확인하지 못했습니다.</p></article>';
    return signals.map(item => {
      const stats = [];
      if (Number.isFinite(Number(item.reviewCount))) stats.push(`기업리뷰 ${Number(item.reviewCount).toLocaleString('ko-KR')}건`);
      if (Number.isFinite(Number(item.participantCount))) stats.push(`전체 리뷰 통계 ${Number(item.participantCount).toLocaleString('ko-KR')}명`);
      if (Number.isFinite(Number(item.interviewCount))) stats.push(`면접후기 ${Number(item.interviewCount).toLocaleString('ko-KR')}건`);
      if (Number.isFinite(Number(item.rating))) stats.push(`종합평점 ${Number(item.rating).toFixed(1)}/5`);
      if (Number.isFinite(Number(item.recommendRate))) stats.push(`기업추천율 ${Number(item.recommendRate)}%`);
      if (Number.isFinite(Number(item.ceoSupportRate))) stats.push(`CEO 지지율 ${Number(item.ceoSupportRate)}%`);
      if (Number.isFinite(Number(item.growthRate))) stats.push(`성장가능성 ${Number(item.growthRate)}%`);
      const categories = Object.entries(item.categories || {}).map(([key,value]) => `${key} ${Number(value).toFixed(1)}/5`);
      const cultureTags = Array.isArray(item.cultureTags) ? item.cultureTags : [];
      const positives = Array.isArray(item.positiveMentions) ? item.positiveMentions : [];
      return `<article class="signal">
        <div class="signal-top"><h4>${esc(item.platform)}</h4><span class="signal-state mixed">${esc(item.sourceLabel || '사용자 집계')}</span></div>
        <p>${esc(stats.join(' · ') || '공개 집계 확인')}</p>
        ${categories.length ? `<p><strong>항목별 평점</strong><br>${esc(categories.join(' · '))}</p>` : ''}
        ${cultureTags.length ? `<p><strong>공개 기업문화 요약</strong><br>${esc(cultureTags.join(' · '))}</p>` : ''}
        ${positives.length ? `<p><strong>긍정적으로 언급된 요소</strong><br>${esc(positives.join(' · '))}</p>` : ''}
        ${item.interpretation ? `<p><strong>해석 주의</strong><br>${esc(item.interpretation)}</p>` : ''}
        ${item.note ? `<p>${esc(item.note)}</p>` : ''}
        ${item.url ? `<p><a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">평판 원문 페이지 ↗</a></p>` : ''}
      </article>`;
    }).join('');
  }

  function signalRichness(item) {
    let score = 0;
    for (const key of ['reviewCount','participantCount','interviewCount','rating','recommendRate','ceoSupportRate','growthRate']) {
      if (Number.isFinite(Number(item?.[key]))) score += 1;
    }
    score += Object.keys(item?.categories || {}).length;
    score += Array.isArray(item?.positiveMentions) ? item.positiveMentions.length : 0;
    return score;
  }

  function mergePlatformSignals(primary, additional) {
    const byPlatform = new Map();
    for (const item of [...primary, ...additional]) {
      const key = String(item.platform || item.host || item.url || '').toLowerCase();
      if (!key) continue;
      const prev = byPlatform.get(key);
      if (!prev) { byPlatform.set(key, {...item}); continue; }
      const richer = signalRichness(item) >= signalRichness(prev) ? item : prev;
      const other = richer === item ? prev : item;
      byPlatform.set(key, {
        ...other,
        ...richer,
        categories:{...(other.categories || {}),...(richer.categories || {})},
        cultureTags:[...new Set([...(other.cultureTags || []),...(richer.cultureTags || [])])],
        positiveMentions:[...new Set([...(other.positiveMentions || []),...(richer.positiveMentions || [])])]
      });
    }
    return [...byPlatform.values()];
  }

  function mergeThemes(primary, submitted) {
    const out = [];
    const seen = new Set();
    for (const item of [...primary, ...submitted]) {
      const key = String(item.topic || '').trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(item);
    }
    return out;
  }

  function themeMarkup(themes, byId) {
    if (!themes.length) return '<article class="signal signal-empty"><h4>반복 주제 확인 제한</h4><p>실제 문장까지 공개된 후기 자료가 적거나 서로 다른 주제로 흩어져 있어 반복 패턴을 만들지 않았습니다.</p></article>';
    return themes.map(theme => {
      const excerpts = (theme.opinionIds || []).slice(0,4).map(id => byId.get(id)).filter(Boolean);
      const detail = excerpts.map(item => `<p><span class="refs">${esc(item.id)} · ${esc(item.platform)}</span><br>${esc(item.excerpt)}</p>`).join('');
      const label = theme.countLabel || (Number.isFinite(Number(theme.count)) ? `${theme.count}건` : '반복 신호');
      const note = theme.note ? `<p>${esc(theme.note)}</p>` : '';
      return `<article class="signal"><div class="signal-top"><h4>${esc(theme.topic)}</h4><span class="signal-state mixed">${esc(label)}</span></div>${note}${detail}</article>`;
    }).join('');
  }

  function platformMarkup(platforms) {
    if (!platforms.length) return '<article class="signal signal-empty"><h4>자동 원문 확인 출처 없음</h4><p>플랫폼 집계 또는 제출된 공개 화면이 존재하더라도 자동 검색으로 개별 후기 원문까지 확보한 출처는 별도로 표시합니다.</p></article>';
    return platforms.map(item => `<article class="signal"><div class="signal-top"><h4>${esc(item.name)}</h4><span class="signal-state mixed">${esc(item.count)}건</span></div><p>${esc(item.hosts.join(' · '))}</p></article>`).join('');
  }

  function actionMarkup(actions) {
    if (!actions.length) return '<article class="action-item"><span class="action-priority">확인</span><div><strong>입사 전 기본 검증</strong><p>실제 근무시간·보고라인·수습조건·급여일·공석 사유·전임자 근속기간·업무범위를 근로계약과 면접에서 직접 확인하십시오.</p></div></article>';
    return actions.map((item,index) => `<article class="action-item"><span class="action-priority">${index === 0 ? '우선' : '확인'}</span><div><strong>${esc(item.title)}</strong><p>${esc(item.text)}</p>${item.refs?.length ? `<span class="action-refs">근거 ${esc(item.refs.join(' · '))}</span>` : ''}</div></article>`).join('');
  }

  function evidenceKinds(items) {
    const labels = [...new Set(items.map(item => item.label).filter(Boolean))];
    return labels.slice(0,5).join(' · ');
  }

  function reviewAggregate(signals) {
    return signals.reduce((sum,item) => {
      const participant = Number(item.participantCount);
      const reviews = Number(item.reviewCount);
      if (Number.isFinite(participant) && participant > 0) return sum + participant;
      if (Number.isFinite(reviews) && reviews > 0) return sum + reviews;
      return sum;
    },0);
  }

  function render(data, bundle = {}) {
    const opinions = Array.isArray(data.opinions) ? data.opinions : [];
    const submittedThemes = Array.isArray(bundle.submittedThemes) ? bundle.submittedThemes : [];
    const themes = mergeThemes(Array.isArray(data.themes) ? data.themes : [], submittedThemes);
    const platforms = Array.isArray(data.platforms) ? data.platforms : [];
    const extraSignals = Array.isArray(bundle.signals) ? bundle.signals : [];
    const publicEvidence = Array.isArray(bundle.evidence) ? bundle.evidence : [];
    const verificationPoints = Array.isArray(bundle.verificationPoints) ? bundle.verificationPoints : [];
    const platformSignals = mergePlatformSignals(Array.isArray(data.platformSignals) ? data.platformSignals : [], extraSignals);
    const actions = [
      ...(Array.isArray(data.actions) ? data.actions : []),
      ...verificationPoints
    ];
    const byId = new Map(opinions.map(item => [item.id, item]));
    const generated = new Date(data.generatedAt).toLocaleString('ko-KR');
    const indexedReviews = Math.max(Number(data.metrics?.indexedReviewCount || 0), reviewAggregate(platformSignals));
    const indexedInterviews = Number(data.metrics?.indexedInterviewCount || 0);
    const coverage = bundle.coverage || {};
    const sourceKinds = new Set(Array.isArray(coverage.kinds) ? coverage.kinds : []);
    if (platformSignals.length) sourceKinds.add('platform-aggregate');
    if (bundle.snapshotMeta) sourceKinds.add('submitted-public-capture');

    document.getElementById('reportTitle').textContent = `${data.company} 회사 평판 분석`;
    document.getElementById('reportMeta').textContent = `구직자용 · 기준 ${generated}`;
    document.getElementById('metricGrid').innerHTML = [
      ['공개 평판 플랫폼', `${platformSignals.length}곳`],
      ['평판 리뷰 집계', indexedReviews ? `${indexedReviews.toLocaleString('ko-KR')}명` : `${opinions.length}건`],
      ['공개자료 신호', `${publicEvidence.length}건`],
      ['확인 출처 유형', `${sourceKinds.size || Number(coverage.kindCount || 0)}종`]
    ].map(([label,value]) => `<div class="metric"><span>${label}</span><strong>${value}</strong></div>`).join('');

    const evidenceSummary = publicEvidence.length
      ? ` 평판 플랫폼 외에도 회사와 직접 연결되는 공개자료 ${publicEvidence.length}건을 근거 유형별로 확인했습니다.`
      : ' 추가 공개자료 신호는 확인 범위가 제한적이었습니다.';
    const snapshotSummary = bundle.snapshotSummary ? ` ${bundle.snapshotSummary}` : '';
    document.getElementById('executiveSummary').textContent = `${snapshotSummary || data.summary || `${data.company}에 대한 공개 평판자료를 확인했습니다.`}${evidenceSummary}`;

    const snapshotMeta = bundle.snapshotMeta;
    const snapshotText = snapshotMeta ? ` 사용자 제출 ${snapshotMeta.platform} 공개 화면(${snapshotMeta.capturedAt})에서 ${snapshotMeta.period} 작성 리뷰와 플랫폼 집계를 별도 보강자료로 반영했습니다.` : '';
    document.getElementById('coverageText').textContent = `공개 평판 플랫폼 ${platformSignals.length}곳, 플랫폼 표시 리뷰 집계 ${indexedReviews || '확인 제한'}명, 자동 검색으로 원문 문장까지 직접 확보한 후기 ${opinions.length}건, 채용·공공·언론 등 추가 공개자료 ${publicEvidence.length}건을 서로 다른 근거로 분리했습니다.${snapshotText}${indexedInterviews ? ` 면접후기 집계 ${indexedInterviews}건도 별도 확인했습니다.` : ''}`;
    document.getElementById('themeText').textContent = themes.length
      ? themes.slice(0,6).map(t => `${t.topic} ${t.countLabel || (Number.isFinite(Number(t.count)) ? `${t.count}건` : '반복')}`).join(' · ')
      : publicEvidence.length
        ? `후기 반복주제는 확인 제한 · 공개자료 유형 ${evidenceKinds(publicEvidence) || '복수 유형'} 확인`
        : '공개된 개별 후기 문장과 추가 공개자료 모두 충분하지 않아 반복 신호 확인 제한';
    document.getElementById('limitText').textContent = bundle.snapshotMeta
      ? '익명 리뷰의 반복성은 조직문화 신호로 활용하되 개별 작성자의 주장 자체를 사실로 확정하지 않습니다. 근로시간·수당·폭언·인사 등 법적 쟁점은 근로계약서, 급여명세서, 출퇴근기록, 취업규칙 등 별도 자료가 있어야 판단할 수 있습니다.'
      : '리뷰·평점, 채용공고, 공공기관 자료, 언론자료는 서로 다른 성격의 근거입니다. 검색결과 제목·요약만으로 위법·부정행위를 확정하지 않으며 비공개 후기 내용은 추정하지 않습니다.';
    document.getElementById('identitySummary').textContent = `${data.identity?.message || '회사명이 검색 결과에 직접 연결되는 자료만 채택했습니다.'}${bundle.snapshotMeta ? ` 추가로 제출된 ${bundle.snapshotMeta.platform} 공개 화면에서 회사명과 플랫폼 표시 내용을 확인해 집계·반복주제를 보강했습니다. 작성자 신원과 각 익명 주장의 사실 여부는 별도 검증하지 않았습니다.` : ''}${publicEvidence.length ? ` 추가 공개자료 ${publicEvidence.length}건도 회사명 직접일치 여부를 확인했습니다.` : ''}`;

    document.getElementById('publicEvidenceList').innerHTML = evidenceMarkup(publicEvidence);
    document.getElementById('aggregateGrid').innerHTML = aggregateMarkup(platformSignals);
    document.getElementById('themeGrid').innerHTML = themeMarkup(themes, byId);
    document.getElementById('opinionSourceList').innerHTML = opinionMarkup(opinions);
    document.getElementById('platformGrid').innerHTML = platformMarkup(platforms);
    document.getElementById('actionSummary').textContent = actions.length
      ? '아래 항목은 공개 후기의 반복 쟁점, 플랫폼 집계와 공개자료 신호를 면접·입사 전 확인사항으로 바꾼 것입니다. 익명 리뷰를 사실로 단정하지 말고 현재 조직상태와 근로조건을 직접 확인하십시오.'
      : '확인 가능한 평판·공개자료가 충분하지 않아 기본 검증사항만 제시합니다.';
    document.getElementById('actionList').innerHTML = actionMarkup(actions);
    document.getElementById('searchLinks').innerHTML = (data.searchLinks || []).map(link => `<a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.label)} ↗</a>`).join('');
    document.getElementById('methodBox').innerHTML =
      `<p><strong>채택 기준</strong> ${esc(data.methodology?.accepted || '')}</p>` +
      `<p><strong>제외 기준</strong> ${esc(data.methodology?.excluded || '')}</p>` +
      `<p><strong>검색 범위</strong> ${esc(data.methodology?.coverage || '')}</p>` +
      `<p><strong>공개자료 보강</strong> ${esc(bundle.note || '평판 외 공개자료는 채용·공공·언론 등 근거 유형별로 분리해 제공합니다.')}</p>` +
      `<p><strong>내부 처리</strong> 검색 후보 ${esc(data.metrics?.rawCandidates ?? 0)}건 중 회사 직접일치 자료를 분리하고, 회사 소개·채용정보는 평판 내용에서 제외했습니다. 플랫폼 집계, 자동 확보 후기 원문, 제출 공개화면, 기타 공개자료를 서로 다른 증거계층으로 처리합니다.</p>`;

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
    document.getElementById('statusTitle').textContent = `${company}의 공개 평판·회사 신호를 찾고 있습니다.`;
    document.getElementById('statusText').textContent = '회사 식별 → 공개 평판 집계 → 실제 후기 문장 → 채용·공공·언론 공개자료 → 구직 검증 포인트';
    try {
      const [mainResult, platformResult] = await Promise.allSettled([
        fetch('/api/reputation-analysis', {
          method:'POST',
          headers:{'content-type':'application/json'},
          body:JSON.stringify({company})
        }).then(async response => ({response,data:await response.json()})),
        fetch(`/api/reputation-platforms?company=${encodeURIComponent(company)}`).then(async response => ({response,data:await response.json()}))
      ]);

      if (mainResult.status !== 'fulfilled') throw mainResult.reason;
      const {response,data} = mainResult.value;
      if (!response.ok || !data.ok) throw new Error(data.error || '분석 API 오류');

      let bundle = {};
      if (platformResult.status === 'fulfilled' && platformResult.value.response.ok && platformResult.value.data?.ok) {
        bundle = platformResult.value.data;
      }
      render(data, bundle);
    } catch (error) {
      renderError(`공개 출처 연결 또는 분석 과정에서 오류가 발생했습니다. 잠시 후 다시 시도하십시오. (${error.message})`);
    } finally {
      submit.disabled = false;
    }
  });
})();