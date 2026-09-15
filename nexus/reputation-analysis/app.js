(() => {
  const typeButtons = [...document.querySelectorAll('.type-btn')];
  const form = document.getElementById('queryForm');
  const input = document.getElementById('targetInput');
  const hint = document.getElementById('formHint');
  const status = document.getElementById('statusPanel');
  const report = document.getElementById('report');
  const submit = document.getElementById('submitBtn');
  let selectedType = 'person';

  const hints = {
    person: '공개 활동이 확인되는 인물의 기본정보와 공개 평가를 분리해 조사합니다.',
    organization: '회사·기관 소개와 재직·면접·거래 평판을 분리해 교차 확인합니다.',
    product: '상품 기본정보와 구매·사용·사후지원 평가를 분리해 조사합니다.',
    service: '서비스 소개와 이용 경험·고객응대·비용 관련 평가를 분리해 조사합니다.',
    place: '장소 기본정보와 방문 경험·친절·가격·청결 평가를 분리해 조사합니다.'
  };
  const placeholders = {
    person: '예: 공개 활동이 있는 인물명', organization: '예: 회사명 또는 기관명', product: '예: 제조사와 상품명', service: '예: 서비스명', place: '예: 상호·시설·장소명'
  };

  typeButtons.forEach(btn => btn.addEventListener('click', () => {
    selectedType = btn.dataset.type;
    typeButtons.forEach(b => b.classList.toggle('active', b === btn));
    hint.textContent = hints[selectedType];
    input.placeholder = placeholders[selectedType];
    input.focus();
  }));

  const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const stateLabel = state => ({positive:'긍정 신호',negative:'주의 신호',conflicted:'평가 상충',mixed:'혼합'}[state] || '혼합');
  const profileStateLabel = state => ({identified:'기본정보 확인',limited:'식별자료 제한',unidentified:'공개자료 부족'}[state] || '확인 제한');
  const reputationStateLabel = state => ({available:'평판자료 확인',insufficient:'평판자료 부족',none:'공개 평판 없음'}[state] || '평판자료 제한');

  function render(data) {
    document.getElementById('reportMeta').textContent = `${data.target.typeLabel} · ${data.target.name} · 기준 ${new Date(data.generatedAt).toLocaleString('ko-KR')}`;
    document.getElementById('executiveSummary').textContent = data.executiveSummary;
    document.getElementById('metricGrid').innerHTML = [
      ['전체 확인 자료', `${data.metrics.sources}건`],
      ['기본·공식 자료', `${data.metrics.profileSources ?? 0}건`],
      ['평판·후기 자료', `${data.metrics.reputationSources ?? 0}건`],
      ['독립 출처', `${data.metrics.independentHosts}곳`]
    ].map(([a,b]) => `<div class="metric"><span>${a}</span><strong>${b}</strong></div>`).join('');

    const profile = data.profile || {status:'limited',overview:'대상 기본정보를 충분히 확인하지 못했습니다.',sourceIds:[],reputationStatus:'insufficient',reputationMessage:'공개 평판 자료를 충분히 확인하지 못했습니다.'};
    document.getElementById('profileState').textContent = profileStateLabel(profile.status);
    document.getElementById('profileSummary').textContent = profile.overview;
    document.getElementById('profileRefs').textContent = profile.sourceIds?.length ? `기본정보 근거 ${profile.sourceIds.join(' · ')}` : '기본정보 근거 자료 없음';
    document.getElementById('reputationState').textContent = reputationStateLabel(profile.reputationStatus);
    document.getElementById('reputationSummary').textContent = profile.reputationMessage;

    const evidenceById = new Map((data.evidence || []).map(item => [item.id, item]));
    const countHosts = ids => new Set((ids || []).map(id => evidenceById.get(id)?.host).filter(Boolean)).size;

    document.getElementById('signalGrid').innerHTML = data.signals.length ? data.signals.map(s => {
      const refs = [...s.positive,...s.negative,...s.neutral].join(' · ');
      const positiveHosts = s.positiveIndependentSources ?? countHosts(s.positive);
      const negativeHosts = s.negativeIndependentSources ?? countHosts(s.negative);
      const neutralHosts = s.neutralIndependentSources ?? countHosts(s.neutral);
      const detail = `긍정 ${s.positive.length}건/${positiveHosts}출처 · 부정 ${s.negative.length}건/${negativeHosts}출처 · 중립 ${s.neutral.length}건/${neutralHosts}출처 · 전체 독립 출처 ${s.independentSources}곳`;
      return `<article class="signal"><div class="signal-top"><h4>${esc(s.topic)}</h4><span class="signal-state ${esc(s.state)}">${stateLabel(s.state)}</span></div><p>${detail}<br><span class="refs">근거 ${esc(refs || '—')}</span></p></article>`;
    }).join('') : profile.reputationStatus === 'none'
      ? '<article class="signal"><h4>공개 평판 자료 없음</h4><p>현재 자동 확인 범위에서는 반복 분석할 공개 후기·평판 자료가 확인되지 않았습니다. 자료 부재 자체를 긍정 또는 부정 평가로 해석하지 않습니다.</p></article>'
      : '<article class="signal"><h4>반복 신호 부족</h4><p>평판 관련 자료는 일부 확인됐지만 서로 다른 복수 출처에서 같은 방향의 평가가 충분히 반복되지 않았습니다.</p></article>';

    document.getElementById('sourceList').innerHTML = data.evidence.length ? data.evidence.map(s => `<article class="source"><span class="source-id">${esc(s.id)}</span><div><strong>${esc(s.title)}</strong><p>${esc(s.group)} · ${esc(s.provider)} · ${esc(s.host || '출처 확인')} ${s.publishedAt ? ' · '+esc(s.publishedAt) : ''}<br>${esc((s.snippet || '').slice(0,220))}</p></div><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">원문 보기 ↗</a></article>`).join('') : '<article class="source"><span class="source-id">—</span><div><strong>자동 확인된 공개자료가 없습니다.</strong><p>신규·소규모 대상이거나 검색 노출이 적을 수 있습니다. 추가 확인 경로에서 공식 홈페이지·등록정보 등을 직접 확인하십시오.</p></div></article>';

    document.getElementById('searchLinks').innerHTML = data.searchLinks.map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label)} ↗</a>`).join('');
    document.getElementById('methodBox').innerHTML = `<strong>분석 방법</strong><br>${esc(data.methodology.stages.join(' → '))}<br>${esc(data.methodology.note)}<br><br><strong>판단 원칙</strong><br>${esc(data.disclaimer)}`;
    status.hidden = true;
    report.hidden = false;
    report.scrollIntoView({behavior:'smooth', block:'start'});
  }

  function renderError(message) {
    status.hidden = false;
    document.getElementById('statusTitle').textContent = '분석을 완료하지 못했습니다.';
    document.getElementById('statusText').textContent = message;
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const target = input.value.trim();
    if (target.length < 2) { input.focus(); return; }
    report.hidden = true;
    status.hidden = false;
    submit.disabled = true;
    document.getElementById('statusTitle').textContent = `${target} 공개 출처를 조사하고 있습니다.`;
    document.getElementById('statusText').textContent = '대상 식별 → 기본정보 확인 → 평판자료 분리 → 중복 제거 → 교차 분석 → 근거 연결';
    try {
      const response = await fetch('/api/reputation-analysis', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({type:selectedType,target}) });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || '분석 API 오류');
      render(data);
    } catch (error) {
      renderError(`공개 출처 연결을 확인할 수 없습니다. 잠시 후 다시 시도하거나 검색 경로에서 원문을 직접 확인하십시오. (${error.message})`);
    } finally { submit.disabled = false; }
  });

  document.getElementById('printBtn').addEventListener('click', () => window.print());
})();