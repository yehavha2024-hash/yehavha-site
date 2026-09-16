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
    person: '공개 활동과 함께 온라인에 게시된 평가·비판·칭찬·경험을 수집해 출처별로 취합합니다.',
    organization: '회사·기관의 공식정보와 직원·면접자·거래상대·이용자의 공개 의견을 함께 수집해 분석합니다.',
    product: '상품 설명과 실제 구매·사용·사후지원에 관한 공개 의견을 함께 수집합니다.',
    service: '서비스 소개와 이용 경험·고객응대·비용에 관한 공개 의견을 함께 수집합니다.',
    place: '장소 기본정보와 방문 경험·친절·가격·청결에 관한 공개 의견을 함께 수집합니다.'
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
  const uniqueHosts = items => new Set(items.map(item => item.host || item.provider).filter(Boolean));
  const isProfileEvidence = item => item.kind ? item.kind === 'profile' : ['기본정보','공식·언론'].includes(item.group);
  const isOpinionEvidence = item => item.kind ? item.kind === 'opinion' : (!isProfileEvidence(item) && ['재직·면접','공개평가','구매·사용','문제·지원','이용경험','방문경험','이용평가'].includes(item.group));
  const sentimentLabel = sentiment => ({positive:'긍정',negative:'부정',neutral:'중립·혼합'}[sentiment] || '중립·혼합');
  const stateLabel = state => ({positive:'긍정 의견',negative:'부정 의견',conflicted:'상반 의견',mixed:'중립·혼합'}[state] || '중립·혼합');
  const profileStateLabel = state => ({identified:'기본정보 확인',limited:'식별자료 제한',unidentified:'공개자료 없음'}[state] || '확인 제한');

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
      const parts = [s.group, s.sourceClass, s.host || s.provider || '출처 확인', date].filter(Boolean);
      if (isOpinionEvidence(s)) parts.push(`의견방향 ${sentimentLabel(s.sentiment)}`);
      if (s.claimRisk === 'high') parts.push('주장·의혹 표현 포함');
      const snippet = (s.snippet || '').replace(/\s+/g,' ').trim().slice(0,220);
      return `<article class="source">
        <span class="source-id">${esc(s.id)}</span>
        <div class="source-copy">
          <strong>${esc(s.title)}</strong>
          <p>${esc(parts.join(' · '))}${snippet ? `<span class="source-snippet">${esc(snippet)}</span>` : ''}</p>
        </div>
        <a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">원문 ↗</a>
      </article>`;
    }).join('');
  }

  function normalizeSignals(signals, opinionEvidence) {
    const evidenceById = new Map(opinionEvidence.map(item => [item.id, item]));
    const hostCount = ids => new Set(ids.map(id => evidenceById.get(id)?.host).filter(Boolean)).size;
    return (signals || []).map(signal => {
      const positive = (signal.positive || []).filter(id => evidenceById.has(id));
      const negative = (signal.negative || []).filter(id => evidenceById.has(id));
      const neutral = (signal.neutral || []).filter(id => evidenceById.has(id));
      if (!(positive.length + negative.length + neutral.length)) return null;
      let state = 'mixed';
      if (positive.length && negative.length) state = 'conflicted';
      else if (negative.length > positive.length) state = 'negative';
      else if (positive.length > negative.length) state = 'positive';
      return {
        ...signal,
        positive, negative, neutral, state,
        independentSources:new Set([...positive,...negative,...neutral].map(id => evidenceById.get(id)?.host).filter(Boolean)).size,
        positiveIndependentSources:hostCount(positive),
        negativeIndependentSources:hostCount(negative),
        neutralIndependentSources:hostCount(neutral),
        total:positive.length + negative.length + neutral.length
      };
    }).filter(Boolean).sort((a,b) => b.total - a.total || b.independentSources - a.independentSources);
  }

  function opinionCounts(items) {
    return items.reduce((acc,item) => {
      const key = ['positive','negative','neutral'].includes(item.sentiment) ? item.sentiment : 'neutral';
      acc[key]++;
      return acc;
    }, {positive:0,negative:0,neutral:0});
  }

  function flowLabel(opinions) {
    if (!opinions.length) return '공개 의견 검색 결과 없음';
    const c = opinionCounts(opinions);
    if (c.positive > c.negative && c.positive > c.neutral) return '긍정 의견 우세 · 수집 표본 기준';
    if (c.negative > c.positive && c.negative > c.neutral) return '부정 의견 우세 · 수집 표본 기준';
    if (c.positive && c.negative) return '긍정·부정 의견 혼재';
    return '의견 방향 혼합 · 단일 방향 우세 없음';
  }

  function profileNarrative(target, profileEvidence) {
    if (!profileEvidence.length) return `${target}과 직접 연결되는 기본·공식 자료를 충분히 확보하지 못했습니다. 대상 식별은 공개 의견과 별도로 처리합니다.`;
    const hosts = uniqueHosts(profileEvidence);
    const titles = profileEvidence.map(item => item.title).filter(Boolean).slice(0,3);
    const anchor = titles.length ? ` 주요 확인 자료는 ${titles.map(title => `“${title}”`).join(', ')}입니다.` : '';
    return `${target}의 존재·사업·활동을 확인하는 기본·공식 자료 ${profileEvidence.length}건을 ${hosts.size}개 도메인에서 확인했습니다. 이 자료는 대상 식별용이며 공개 의견의 긍정·부정 분포와는 별도로 봅니다.${anchor}`;
  }

  function reputationNarrative(target, opinions) {
    if (!opinions.length) return `${target}과 직접 연결되는 공개 의견·후기를 이번 자동 탐색에서는 확보하지 못했습니다. 이는 의견이 존재하지 않는다는 뜻이 아니라 현재 검색 결과에 직접 연결되는 의견이 잡히지 않았다는 뜻입니다.`;
    const c = opinionCounts(opinions);
    const hosts = uniqueHosts(opinions).size;
    const risky = opinions.filter(item => item.claimRisk === 'high').length;
    const concentration = hosts === 1 ? '현재 수집 의견은 한 도메인에 집중되어 있어 플랫폼 편향 가능성을 함께 봐야 합니다.' : `현재 의견은 ${hosts}개 도메인에 걸쳐 있습니다.`;
    const riskText = risky ? ` 이 가운데 ${risky}건은 비위·위법 등 강한 주장 표현을 포함하므로 사실확정이 아니라 해당 게시물의 주장으로만 취급합니다.` : '';
    return `${target}에 관해 게시된 공개 의견 ${opinions.length}건을 취합했습니다. 긍정 ${c.positive}건, 부정 ${c.negative}건, 중립·혼합 ${c.neutral}건입니다. ${concentration}${riskText} 의견 내용이 맞는지 틀린지를 이유로 자동 제외하지 않고, 출처·반복·상충·집중도를 함께 표시합니다.`;
  }

  function executiveNarrative(target, opinions, signals) {
    if (!opinions.length) return `${target}에 관한 기본·공식 자료는 확인할 수 있으나 현재 자동 탐색에서 공개 의견·후기 성격의 결과는 확보하지 못했습니다. 검색 범위를 넓힐 수 있도록 추가 확인 경로를 함께 제공합니다.`;
    const c = opinionCounts(opinions);
    const hosts = uniqueHosts(opinions).size;
    const top = signals.slice(0,4).map(s => `${s.topic} ${s.total}건`).join(', ');
    const dominant = c.positive > c.negative ? '긍정 의견이 더 많았고' : c.negative > c.positive ? '부정 의견이 더 많았고' : '긍정·부정 의견 수가 비슷하거나 혼재했고';
    return `${target} 관련 공개 의견 ${opinions.length}건을 취합한 결과, ${dominant} 긍정 ${c.positive}건·부정 ${c.negative}건·중립/혼합 ${c.neutral}건으로 분류됐습니다. 의견 출처는 ${hosts}개 도메인입니다.${top ? ` 주요 언급 주제는 ${top}입니다.` : ''} 이는 온라인에 게시된 의견의 현재 표본을 요약한 것이며, 개별 의견의 진위나 전체 구성원의 대표성을 의미하지 않습니다.`;
  }

  function render(data) {
    const generated = new Date(data.generatedAt).toLocaleString('ko-KR');
    const evidence = data.evidence || [];
    const profileEvidence = evidence.filter(isProfileEvidence);
    const opinions = evidence.filter(isOpinionEvidence);
    const signals = normalizeSignals(data.signals, opinions);
    const counts = opinionCounts(opinions);
    const opinionHosts = uniqueHosts(opinions).size;
    const profile = data.profile || {status:'limited',sourceIds:[]};

    document.getElementById('reportTitle').textContent = `${data.target.name} 평판 분석`;
    document.getElementById('reportMeta').textContent = `${data.target.typeLabel} · 기준 ${generated}`;
    document.getElementById('executiveSummary').textContent = executiveNarrative(data.target.name, opinions, signals);
    document.getElementById('verdictText').textContent = flowLabel(opinions);
    document.getElementById('basisText').textContent = `공개 의견 ${opinions.length}건 · 긍정 ${counts.positive} · 부정 ${counts.negative} · 중립/혼합 ${counts.neutral} · 의견 출처 ${opinionHosts}곳`;
    document.getElementById('limitText').textContent = opinions.length
      ? '게시 의견은 작성자의 경험·의도·표본편향·홍보 또는 악의적 게시 가능성을 포함할 수 있으므로 사실확정이 아니라 평판 신호로 해석'
      : '현재 자동 탐색 결과에 의견 자료가 잡히지 않았으며, 이는 온라인 의견 부재를 의미하지 않음';

    document.getElementById('metricGrid').innerHTML = [
      ['공개 의견', `${opinions.length}건`],
      ['긍정', `${counts.positive}건`],
      ['부정', `${counts.negative}건`],
      ['의견 출처', `${opinionHosts}곳`]
    ].map(([label,value]) => `<div class="metric"><span>${label}</span><strong>${value}</strong></div>`).join('');

    document.getElementById('profileState').textContent = profileStateLabel(profile.status);
    document.getElementById('profileSummary').textContent = profileNarrative(data.target.name, profileEvidence);
    document.getElementById('profileRefs').textContent = profileEvidence.length
      ? `기본정보 근거 ${profileEvidence.slice(0,8).map(item => item.id).join(' · ')}`
      : '기본정보 근거 자료 없음';

    document.getElementById('reputationState').textContent = opinions.length ? `공개 의견 ${opinions.length}건` : '공개 의견 미확보';
    document.getElementById('reputationSummary').textContent = reputationNarrative(data.target.name, opinions);

    document.getElementById('signalGrid').innerHTML = signals.length ? signals.map(s => {
      const refs = [...s.positive,...s.negative,...s.neutral].join(' · ');
      const detail = `긍정 ${s.positive.length}건/${s.positiveIndependentSources}출처 · 부정 ${s.negative.length}건/${s.negativeIndependentSources}출처 · 중립 ${s.neutral.length}건/${s.neutralIndependentSources}출처`;
      const risk = (s.highRisk || []).length ? ` · 강한 주장 ${(s.highRisk || []).length}건` : '';
      return `<article class="signal">
        <div class="signal-top"><h4>${esc(s.topic)}</h4><span class="signal-state ${esc(s.state)}">${stateLabel(s.state)}</span></div>
        <p>${esc(detail + risk)}<br><span class="refs">근거 ${esc(refs || '—')}</span></p>
      </article>`;
    }).join('') : `<article class="signal signal-empty"><h4>분류 가능한 의견 주제 없음</h4><p>${opinions.length ? '공개 의견은 수집됐지만 현재 키워드 기준으로 특정 주제에 묶이지 않았습니다. 아래 원문 목록에서 의견 내용을 확인할 수 있습니다.' : '현재 자동 탐색에서 대상과 직접 연결되는 공개 의견을 확보하지 못했습니다.'}</p></article>`;

    document.getElementById('profileSourceList').innerHTML = sourceMarkup(
      profileEvidence,
      '관련 기본·공식 자료가 확인되지 않았습니다.',
      '대상 식별용 공개자료가 부족합니다.'
    );
    document.getElementById('reputationSourceList').innerHTML = sourceMarkup(
      opinions,
      '현재 검색에서 공개 의견·후기를 확보하지 못했습니다.',
      '추가 확인 경로를 통해 블로그·커뮤니티·평판 플랫폼 등 검색 범위를 직접 확장할 수 있습니다.'
    );

    document.getElementById('searchLinks').innerHTML = (data.searchLinks || []).map(link =>
      `<a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.label)} ↗</a>`
    ).join('');

    const filtered = data.metrics?.filteredIrrelevant ?? 0;
    const raw = data.metrics?.rawCandidates ?? evidence.length;
    const claims = data.metrics?.highRiskClaims ?? opinions.filter(item => item.claimRisk === 'high').length;
    document.getElementById('methodBox').innerHTML =
      `<p><strong>분석 절차</strong> ${esc((data.methodology?.stages || []).join(' → '))}</p>` +
      `<p><strong>수집 원칙</strong> ${esc(data.methodology?.note || '대상과 직접 연결되는 공개 의견을 긍정·부정 구분 없이 수집합니다.')}</p>` +
      `<p><strong>내부 검증</strong> 검색 후보 ${esc(raw)}건에서 대상과 직접 연결되지 않는 결과 ${esc(filtered)}건과 URL 중복을 제거했습니다. 의견의 내용이 맞다·틀리다는 이유로는 제외하지 않습니다. 강한 주장 표현 ${esc(claims)}건은 사실확정이 아니라 공개 주장으로 표시합니다.</p>` +
      `<p><strong>해석 원칙</strong> ${esc(data.disclaimer || '공개 의견의 분포와 반복 양상을 보여주며 사실확정과는 구분합니다.')}</p>`;

    status.hidden = true;
    report.hidden = false;
    report.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function renderError(message) {
    status.hidden = false;
    document.getElementById('statusTitle').textContent = '분석을 완료하지 못했습니다.';
    document.getElementById('statusText').textContent = message;
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const target = input.value.trim();
    if (target.length < 2) {input.focus();return;}

    report.hidden = true;
    status.hidden = false;
    submit.disabled = true;
    document.getElementById('statusTitle').textContent = `${target} 공개 평판을 수집하고 있습니다.`;
    document.getElementById('statusText').textContent = '대상 직접일치 확인 → 후기·커뮤니티·평판플랫폼 탐색 → 긍정·부정 의견 모두 수집 → 중복 제거 → 주제·출처별 취합';

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
