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
    person: '예: 공개 활동이 있는 인물명',
    organization: '예: 회사명 또는 기관명',
    product: '예: 제조사와 상품명',
    service: '예: 서비스명',
    place: '예: 상호·시설·장소명'
  };

  typeButtons.forEach(btn => btn.addEventListener('click', () => {
    selectedType = btn.dataset.type;
    typeButtons.forEach(b => b.classList.toggle('active', b === btn));
    hint.textContent = hints[selectedType];
    input.placeholder = placeholders[selectedType];
    input.focus();
  }));

  const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'
  }[c]));

  const stateLabel = state => ({
    positive:'긍정 신호',
    negative:'주의 신호',
    conflicted:'평가 상충',
    mixed:'혼합'
  }[state] || '혼합');

  const profileStateLabel = state => ({
    identified:'기본정보 확인',
    limited:'식별자료 제한',
    unidentified:'공개자료 없음'
  }[state] || '확인 제한');

  const reputationStateLabel = state => ({
    available:'평판자료 확인',
    insufficient:'평판자료 부족',
    none:'공개 평판 없음'
  }[state] || '평판자료 제한');

  const isProfileEvidence = item => ['기본정보','공식·언론'].includes(item.group);

  function formatDate(value) {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString('ko-KR', {year:'numeric',month:'2-digit',day:'2-digit'});
  }

  function sourceMarkup(items, emptyTitle, emptyText) {
    if (!items.length) {
      return `<article class="source empty"><span class="source-id">—</span><div><strong>${esc(emptyTitle)}</strong><p>${esc(emptyText)}</p></div></article>`;
    }
    return items.map(s => {
      const date = formatDate(s.publishedAt);
      const meta = [s.group, s.host || s.provider || '출처 확인', date].filter(Boolean).join(' · ');
      const snippet = (s.snippet || '').slice(0,220);
      return `<article class="source">
        <span class="source-id">${esc(s.id)}</span>
        <div>
          <strong>${esc(s.title)}</strong>
          <p>${esc(meta)}${snippet ? `<br>${esc(snippet)}` : ''}</p>
        </div>
        <a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">원문 보기 ↗</a>
      </article>`;
    }).join('');
  }

  function render(data) {
    const generated = new Date(data.generatedAt).toLocaleString('ko-KR');
    document.getElementById('reportTitle').textContent = `${data.target.name} 평판 분석`;
    document.getElementById('reportMeta').textContent = `${data.target.typeLabel} · 기준 ${generated}`;
    document.getElementById('executiveSummary').textContent = data.executiveSummary;

    document.getElementById('metricGrid').innerHTML = [
      ['관련 공개자료', `${data.metrics.sources}건`],
      ['기본·공식 자료', `${data.metrics.profileSources ?? 0}건`],
      ['평판·후기 자료', `${data.metrics.reputationSources ?? 0}건`],
      ['독립 출처', `${data.metrics.independentHosts}곳`]
    ].map(([a,b]) => `<div class="metric"><span>${a}</span><strong>${b}</strong></div>`).join('');

    const profile = data.profile || {
      status:'limited',
      overview:'대상 기본정보를 충분히 확인하지 못했습니다.',
      sourceIds:[],
      reputationStatus:'insufficient',
      reputationMessage:'공개 평판 자료를 충분히 확인하지 못했습니다.'
    };

    document.getElementById('profileState').textContent = profileStateLabel(profile.status);
    document.getElementById('profileSummary').textContent = profile.overview;
    document.getElementById('profileRefs').textContent = profile.sourceIds?.length
      ? `기본정보 근거 ${profile.sourceIds.join(' · ')}`
      : '기본정보 근거 자료 없음';

    document.getElementById('reputationState').textContent = reputationStateLabel(profile.reputationStatus);
    document.getElementById('reputationSummary').textContent = profile.reputationMessage;

    const evidence = data.evidence || [];
    const evidenceById = new Map(evidence.map(item => [item.id, item]));
    const countHosts = ids => new Set((ids || []).map(id => evidenceById.get(id)?.host).filter(Boolean)).size;

    document.getElementById('signalGrid').innerHTML = data.signals?.length ? data.signals.map(s => {
      const refs = [...s.positive,...s.negative,...s.neutral].join(' · ');
      const positiveHosts = s.positiveIndependentSources ?? countHosts(s.positive);
      const negativeHosts = s.negativeIndependentSources ?? countHosts(s.negative);
      const neutralHosts = s.neutralIndependentSources ?? countHosts(s.neutral);
      const detail = `긍정 ${s.positive.length}건/${positiveHosts}출처 · 부정 ${s.negative.length}건/${negativeHosts}출처 · 중립 ${s.neutral.length}건/${neutralHosts}출처`;
      return `<article class="signal">
        <div class="signal-top">
          <h4>${esc(s.topic)}</h4>
          <span class="signal-state ${esc(s.state)}">${stateLabel(s.state)}</span>
        </div>
        <p>${esc(detail)}<br><span class="refs">근거 ${esc(refs || '—')}</span></p>
      </article>`;
    }).join('') : profile.reputationStatus === 'none'
      ? '<article class="signal"><h4>공개 평판 자료 없음</h4><p>현재 자동 확인 범위에서는 대상과 직접 연결되는 반복 가능한 후기·평판 자료가 확인되지 않았습니다.</p></article>'
      : '<article class="signal"><h4>반복 신호 부족</h4><p>대상과 관련된 평판 자료는 일부 확인됐지만 서로 다른 복수 출처에서 같은 방향의 평가가 충분히 반복되지 않았습니다.</p></article>';

    const profileEvidence = evidence.filter(isProfileEvidence);
    const reputationEvidence = evidence.filter(item => !isProfileEvidence(item));
    document.getElementById('profileSourceList').innerHTML = sourceMarkup(
      profileEvidence,
      '관련 기본·공식 자료가 확인되지 않았습니다.',
      '대상을 안정적으로 설명할 공개 소개 자료가 부족합니다.'
    );
    document.getElementById('reputationSourceList').innerHTML = sourceMarkup(
      reputationEvidence,
      '관련 평판·후기 자료가 확인되지 않았습니다.',
      '평판 자료가 없다는 사실 자체는 긍정 또는 부정 평가를 의미하지 않습니다.'
    );

    document.getElementById('searchLinks').innerHTML = (data.searchLinks || []).map(l =>
      `<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label)} ↗</a>`
    ).join('');

    const filtered = data.metrics.filteredIrrelevant ?? 0;
    document.getElementById('methodBox').innerHTML =
      `<strong>분석 방법</strong><br>${esc(data.methodology.stages.join(' → '))}<br>${esc(data.methodology.note)}` +
      `<br><br><strong>대상 일치 필터</strong><br>검색 후보 중 대상과 직접 연결되지 않은 결과 ${esc(filtered)}건을 보고서에서 제외했습니다.` +
      `<br><br><strong>판단 원칙</strong><br>${esc(data.disclaimer)}`;

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
    if (target.length < 2) {
      input.focus();
      return;
    }

    report.hidden = true;
    status.hidden = false;
    submit.disabled = true;
    document.getElementById('statusTitle').textContent = `${target} 공개 출처를 확인하고 있습니다.`;
    document.getElementById('statusText').textContent = '대상 직접일치 확인 → 무관 검색결과 제거 → 기본정보·평판 분리 → 교차 분석 → 근거 연결';

    try {
      const response = await fetch('/api/reputation-analysis', {
        method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({type:selectedType,target})
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || '분석 API 오류');
      render(data);
    } catch (error) {
      renderError(`공개 출처 연결을 확인할 수 없습니다. 잠시 후 다시 시도하십시오. (${error.message})`);
    } finally {
      submit.disabled = false;
    }
  });

  document.getElementById('printBtn').addEventListener('click', () => window.print());
})();
