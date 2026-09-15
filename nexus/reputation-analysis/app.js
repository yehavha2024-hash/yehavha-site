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
    person: '공개 활동이 확인되는 인물의 공개 기록·평가를 중심으로 조사합니다.',
    organization: '재직·면접·거래 경험과 공식자료를 분리해 교차 확인합니다.',
    product: '구매·사용 경험, 품질·배송·사후지원 관련 공개 평가를 조사합니다.',
    service: '이용 경험, 고객응대·비용·환불·해지 관련 공개 평가를 조사합니다.',
    place: '방문 경험, 친절·가격·청결·대기 등 공개 평가를 조사합니다.'
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

  function render(data) {
    document.getElementById('reportMeta').textContent = `${data.target.typeLabel} · ${data.target.name} · 기준 ${new Date(data.generatedAt).toLocaleString('ko-KR')}`;
    document.getElementById('executiveSummary').textContent = data.executiveSummary;
    document.getElementById('metricGrid').innerHTML = [
      ['확인 자료', `${data.metrics.sources}건`], ['독립 출처', `${data.metrics.independentHosts}곳`], ['분석 신호', `${data.metrics.signals}개`], ['자동 제외', `${data.metrics.heldHighRisk}건`]
    ].map(([a,b]) => `<div class="metric"><span>${a}</span><strong>${b}</strong></div>`).join('');

    const evidenceById = new Map((data.evidence || []).map(item => [item.id, item]));
    const countHosts = ids => new Set((ids || []).map(id => evidenceById.get(id)?.host).filter(Boolean)).size;

    document.getElementById('signalGrid').innerHTML = data.signals.length ? data.signals.map(s => {
      const refs = [...s.positive,...s.negative,...s.neutral].join(' · ');
      const positiveHosts = s.positiveIndependentSources ?? countHosts(s.positive);
      const negativeHosts = s.negativeIndependentSources ?? countHosts(s.negative);
      const neutralHosts = s.neutralIndependentSources ?? countHosts(s.neutral);
      const detail = `긍정 ${s.positive.length}건/${positiveHosts}출처 · 부정 ${s.negative.length}건/${negativeHosts}출처 · 중립 ${s.neutral.length}건/${neutralHosts}출처 · 전체 독립 출처 ${s.independentSources}곳`;
      return `<article class="signal"><div class="signal-top"><h4>${esc(s.topic)}</h4><span class="signal-state ${esc(s.state)}">${stateLabel(s.state)}</span></div><p>${detail}<br><span class="refs">근거 ${esc(refs || '—')}</span></p></article>`;
    }).join('') : '<article class="signal"><h4>반복 신호 부족</h4><p>현재 자동 확인 범위에서는 복수 독립 출처에서 반복되는 주제가 충분하지 않습니다.</p></article>';

    document.getElementById('sourceList').innerHTML = data.evidence.length ? data.evidence.map(s => `<article class="source"><span class="source-id">${esc(s.id)}</span><div><strong>${esc(s.title)}</strong><p>${esc(s.group)} · ${esc(s.provider)} · ${esc(s.host || '출처 확인')} ${s.publishedAt ? ' · '+esc(s.publishedAt) : ''}<br>${esc((s.snippet || '').slice(0,220))}</p></div><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">원문 보기 ↗</a></article>`).join('') : '<article class="source"><span class="source-id">—</span><div><strong>자동 확인된 원문이 없습니다.</strong><p>추가 확인 경로를 이용해 원문을 직접 조사하십시오.</p></div></article>';

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
    document.getElementById('statusText').textContent = '출처 탐색 → 중복 제거 → 주제 분류 → 상반 평가 확인 → 근거 연결';
    try {
      const response = await fetch('/api/reputation-analysis', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({type:selectedType,target}) });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || '분석 API 오류');
      render(data);
    } catch (error) {
      renderError(`공개 출처 연결을 확인할 수 없습니다. 잠시 후 다시 시도하거나 아래 검색 경로에서 원문을 직접 확인하십시오. (${error.message})`);
    } finally { submit.disabled = false; }
  });

  document.getElementById('printBtn').addEventListener('click', () => window.print());
})();