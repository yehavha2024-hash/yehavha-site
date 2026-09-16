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
    person: '공개 활동이 확인되는 인물의 기본정보와 제3자의 공개 평가를 분리해 조사합니다.',
    organization: '회사·기관의 공식정보와 직원·면접자·거래상대 등의 실제 경험자료를 분리해 조사합니다.',
    product: '상품 설명과 실제 구매·사용·사후지원 평가를 분리해 조사합니다.',
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
  const reputationGroups = new Set(['재직·면접','공개평가','구매·사용','문제·지원','이용경험','방문경험','이용평가']);
  const genericPlatformPage = /(인적성\s*[·ㆍ]?\s*평가도구|신입연봉|면접\s*코칭|기업\s*[·ㆍ]?\s*연봉|연봉계산기|취업성공도우미|직업적성|직무적성|채용도구|채용솔루션|공채정보|공고검색)/i;
  const reviewLanguage = /(후기|리뷰|평판|평점|재직자|전직자|퇴사|이직|근무환경|조직문화|복지|워라밸|면접후기|면접\s*경험|고객후기|사용후기|방문후기|불만|칭찬|추천|거래\s*경험|환불|교환|A\/S|고객센터)/i;

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
  const isProfileEvidence = item => ['기본정보','공식·언론'].includes(item.group);
  const isVerifiedReputationEvidence = item => {
    if (isProfileEvidence(item)) return false;
    const text = `${item.title || ''} ${item.snippet || ''} ${item.url || ''}`;
    if (genericPlatformPage.test(text)) return false;
    if (reviewLanguage.test(text)) return true;
    return reputationGroups.has(item.group) && item.group !== '재직·면접';
  };

  const stateLabel = state => ({
    positive:'긍정 신호', negative:'주의 신호', conflicted:'평가 상충', mixed:'혼합'
  }[state] || '혼합');
  const profileStateLabel = state => ({
    identified:'기본정보 확인', limited:'식별자료 제한', unidentified:'공개자료 없음'
  }[state] || '확인 제한');

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
      const snippet = (s.snippet || '').replace(/\s+/g,' ').trim().slice(0,150);
      return `<article class="source">
        <span class="source-id">${esc(s.id)}</span>
        <div class="source-copy">
          <strong>${esc(s.title)}</strong>
          <p>${esc(meta)}${snippet ? `<span class="source-snippet">${esc(snippet)}</span>` : ''}</p>
        </div>
        <a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">원문 ↗</a>
      </article>`;
    }).join('');
  }

  function normalizeSignals(signals, allowedEvidence) {
    const evidenceById = new Map(allowedEvidence.map(item => [item.id, item]));
    const hostCount = ids => new Set(ids.map(id => evidenceById.get(id)?.host).filter(Boolean)).size;
    return (signals || []).map(signal => {
      const positive = (signal.positive || []).filter(id => evidenceById.has(id));
      const negative = (signal.negative || []).filter(id => evidenceById.has(id));
      const neutral = (signal.neutral || []).filter(id => evidenceById.has(id));
      const independentSources = new Set([...positive,...negative,...neutral].map(id => evidenceById.get(id)?.host).filter(Boolean)).size;
      let state = 'mixed';
      if (positive.length && negative.length) state = 'conflicted';
      else if (negative.length > positive.length) state = 'negative';
      else if (positive.length > negative.length) state = 'positive';
      return {
        ...signal, positive, negative, neutral, state, independentSources,
        positiveIndependentSources:hostCount(positive), negativeIndependentSources:hostCount(negative), neutralIndependentSources:hostCount(neutral),
        total:positive.length + negative.length + neutral.length
      };
    }).filter(signal => signal.total > 0);
  }

  function isStrongSignal(signal) {
    if (signal.state === 'negative') return signal.negativeIndependentSources >= 2;
    if (signal.state === 'positive') return signal.positiveIndependentSources >= 2;
    if (signal.state === 'conflicted') return signal.positiveIndependentSources >= 1 && signal.negativeIndependentSources >= 1 && signal.independentSources >= 2;
    return signal.neutralIndependentSources >= 2;
  }

  function profileNarrative(target, profileEvidence) {
    if (!profileEvidence.length) return `${target}과 직접 연결되는 기본·공식 자료를 충분히 확보하지 못했습니다. 대상의 정확한 법인명·공식 홈페이지·지역 등 추가 식별정보가 필요합니다.`;
    const hosts = uniqueHosts(profileEvidence);
    const nonRecruitHosts = [...hosts].filter(host => !/(jobkorea|saramin|jobplanet)/i.test(host));
    const titles = profileEvidence.map(item => item.title).filter(Boolean).slice(0,3);
    const anchor = titles.length ? ` 대표 확인 자료는 ${titles.map(title => `“${title}”`).join(', ')}입니다.` : '';
    return `${target}과 직접 연결되는 기본·공식 자료 ${profileEvidence.length}건을 ${hosts.size}개 도메인에서 확인했습니다. 이 자료는 대상의 존재·사업·활동 범위를 확인하기 위한 자료이며 긍정·부정 평판 판단에는 합산하지 않습니다.${nonRecruitHosts.length ? ` 채용 플랫폼 외 독립 도메인 ${nonRecruitHosts.length}곳도 확인했습니다.` : ''}${anchor}`;
  }

  function reputationNarrative(target, reputationEvidence, discardedGeneric) {
    const repHosts = uniqueHosts(reputationEvidence);
    const removed = discardedGeneric.length ? ` 단순 채용·검색·연봉·평가도구 성격의 페이지 ${discardedGeneric.length}건은 평판 근거에서 제외했습니다.` : '';
    if (!reputationEvidence.length) return `${target}에 관해 직원·면접자·고객·거래상대 등 제3자의 실제 평가·경험으로 확인되는 공개 평판 자료가 현재 검증 범위에서는 확보되지 않았습니다. 따라서 긍정 또는 부정 평판을 판단하지 않습니다.${removed}`;
    if (repHosts.size < 2) return `${target}의 실제 평가·경험 자료 ${reputationEvidence.length}건을 확인했지만 ${repHosts.size}개 도메인에 집중돼 독립 교차검증이 부족합니다. 한 사이트의 여러 페이지는 여러 독립 출처로 계산하지 않습니다.${removed}`;
    return `${target}의 실제 평가·경험 자료 ${reputationEvidence.length}건을 ${repHosts.size}개 독립 도메인에서 확인했습니다. 아래 반복·상충 신호는 동일 방향의 평가가 복수 독립 출처에서 재현되는지를 기준으로 해석합니다.${removed}`;
  }

  function verdictFor(reputationEvidence, signals) {
    const repHosts = uniqueHosts(reputationEvidence).size;
    const strong = signals.filter(isStrongSignal);
    if (!reputationEvidence.length) return '판단 보류 · 검증된 평판 근거 부족';
    if (repHosts < 2) return '근거 제한 · 독립 출처 부족';
    if (strong.some(s => s.state === 'conflicted')) return '평가 상충 · 긍정·부정 신호 병존';
    if (strong.some(s => s.state === 'negative')) return '주의 신호 · 복수 출처 반복';
    if (strong.some(s => s.state === 'positive')) return '긍정 신호 · 복수 출처 반복';
    return '혼합·불충분 · 반복 신호 미형성';
  }

  function executiveNarrative(target, profileEvidence, reputationEvidence, signals) {
    const repHosts = uniqueHosts(reputationEvidence).size;
    const strong = signals.filter(isStrongSignal).slice(0,3);
    if (!reputationEvidence.length) return `${target}에 대한 공개자료는 확인됐지만 현재 확보된 자료의 중심은 대상 설명·채용·공식 정보입니다. 실제 경험을 담은 평판 근거가 검증되지 않아 ‘좋다·나쁘다’는 결론을 내릴 수 없습니다. 이 보고서의 핵심 결론은 평판이 좋거나 나쁘다는 것이 아니라, 현재 공개근거만으로는 평판을 판단할 증거가 부족하다는 점입니다.`;
    if (repHosts < 2) return `${target}에 대한 실제 평가자료는 일부 확인됐지만 독립 출처가 부족합니다. 같은 사이트의 여러 페이지를 반복 근거로 계산하지 않았으며, 현재 단계에서는 방향성보다 근거 집중도를 먼저 봐야 합니다.`;
    if (!strong.length) return `${target}에 대한 실제 평가자료를 복수 독립 출처에서 확인했지만 같은 방향의 평가가 충분히 반복되지 않았습니다. 개별 의견은 존재하나 안정적인 평판 패턴으로 일반화하기에는 근거가 부족합니다.`;
    const parts = strong.map(s => s.state === 'conflicted' ? `${s.topic}은 긍정·부정 평가가 함께 나타남` : s.state === 'negative' ? `${s.topic}에서 부정 신호가 복수 출처에 반복됨` : s.state === 'positive' ? `${s.topic}에서 긍정 신호가 복수 출처에 반복됨` : `${s.topic} 언급이 복수 출처에 반복됨`);
    return `${target}의 평판 자료를 공식정보와 분리해 교차검증한 결과, ${parts.join(', ')}. 각 신호는 아래 근거 ID와 원문을 함께 확인해야 하며 단일 후기나 한 사이트의 다수 페이지만으로 평판을 단정하지 않습니다.`;
  }

  function render(data) {
    const generated = new Date(data.generatedAt).toLocaleString('ko-KR');
    const evidence = data.evidence || [];
    const profileEvidence = evidence.filter(isProfileEvidence);
    const reputationEvidence = evidence.filter(isVerifiedReputationEvidence);
    const discardedGeneric = evidence.filter(item => !isProfileEvidence(item) && !isVerifiedReputationEvidence(item));
    const signals = normalizeSignals(data.signals, reputationEvidence);
    const repHosts = uniqueHosts(reputationEvidence).size;
    const allUsedEvidence = [...profileEvidence, ...reputationEvidence];
    const profile = data.profile || {status:'limited', sourceIds:[]};

    document.getElementById('reportTitle').textContent = `${data.target.name} 평판 분석`;
    document.getElementById('reportMeta').textContent = `${data.target.typeLabel} · 기준 ${generated}`;
    document.getElementById('executiveSummary').textContent = executiveNarrative(data.target.name, profileEvidence, reputationEvidence, signals);
    document.getElementById('verdictText').textContent = verdictFor(reputationEvidence, signals);
    document.getElementById('basisText').textContent = `기본·공식 ${profileEvidence.length}건 · 실제 평판 ${reputationEvidence.length}건 · 평판 독립출처 ${repHosts}곳`;
    document.getElementById('limitText').textContent = reputationEvidence.length === 0
      ? '공개된 제3자 경험자료가 부족해 조직문화·보상·면접·거래 신뢰도 등 세부 평판을 일반화할 수 없음'
      : repHosts < 2
        ? '평판자료가 특정 도메인에 집중돼 출처 독립성이 부족함'
        : '공개 웹자료 기반 1차 분석이므로 비공개 경험과 표본편향은 포함하지 않음';

    document.getElementById('metricGrid').innerHTML = [
      ['분석 근거', `${allUsedEvidence.length}건`],
      ['기본·공식', `${profileEvidence.length}건`],
      ['실제 평판', `${reputationEvidence.length}건`],
      ['평판 독립출처', `${repHosts}곳`]
    ].map(([label,value]) => `<div class="metric"><span>${label}</span><strong>${value}</strong></div>`).join('');

    document.getElementById('profileState').textContent = profileStateLabel(profile.status);
    document.getElementById('profileSummary').textContent = profileNarrative(data.target.name, profileEvidence);
    document.getElementById('profileRefs').textContent = profileEvidence.length
      ? `기본정보 근거 ${profileEvidence.slice(0,8).map(item => item.id).join(' · ')}`
      : '기본정보 근거 자료 없음';

    document.getElementById('reputationState').textContent = reputationEvidence.length === 0 ? '판단 보류' : repHosts < 2 ? '근거 제한' : '교차확인 가능';
    document.getElementById('reputationSummary').textContent = reputationNarrative(data.target.name, reputationEvidence, discardedGeneric);

    document.getElementById('signalGrid').innerHTML = signals.length ? signals.map(s => {
      const refs = [...s.positive,...s.negative,...s.neutral].join(' · ');
      const detail = `긍정 ${s.positive.length}건/${s.positiveIndependentSources}출처 · 부정 ${s.negative.length}건/${s.negativeIndependentSources}출처 · 중립 ${s.neutral.length}건/${s.neutralIndependentSources}출처`;
      return `<article class="signal">
        <div class="signal-top"><h4>${esc(s.topic)}</h4><span class="signal-state ${esc(s.state)}">${stateLabel(s.state)}</span></div>
        <p>${esc(detail)}<br><span class="refs">근거 ${esc(refs || '—')}</span></p>
      </article>`;
    }).join('') : `<article class="signal signal-empty"><h4>반복 가능한 평판 신호 없음</h4><p>${reputationEvidence.length ? '실제 평가자료는 일부 있으나 복수 독립 출처에서 같은 방향이 반복되지 않았습니다.' : '검증된 제3자 평가·경험 자료가 없어 긍정·부정·상충 신호를 생성하지 않았습니다.'}</p></article>`;

    document.getElementById('profileSourceList').innerHTML = sourceMarkup(
      profileEvidence,
      '관련 기본·공식 자료가 확인되지 않았습니다.',
      '대상을 안정적으로 설명할 공개 소개 자료가 부족합니다.'
    );
    document.getElementById('reputationSourceList').innerHTML = sourceMarkup(
      reputationEvidence,
      '검증된 평판·후기 자료가 확인되지 않았습니다.',
      '채용공고·검색도구·연봉도구처럼 실제 평가가 아닌 페이지는 평판 근거에서 제외했습니다.'
    );

    document.getElementById('searchLinks').innerHTML = (data.searchLinks || []).map(link =>
      `<a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.label)} ↗</a>`
    ).join('');

    const filtered = data.metrics?.filteredIrrelevant ?? 0;
    const raw = data.metrics?.rawCandidates ?? allUsedEvidence.length;
    document.getElementById('methodBox').innerHTML =
      `<p><strong>분석 절차</strong> ${esc((data.methodology?.stages || []).join(' → '))}</p>` +
      `<p><strong>수집 범위</strong> ${esc(data.methodology?.note || '공개 웹자료를 대상 직접일치 기준으로 수집합니다.')}</p>` +
      `<p><strong>필터링</strong> 검색 후보 ${esc(raw)}건 중 대상 직접일치가 아니거나 평판으로 보기 어려운 자료를 분리했습니다. 직접일치 제외 ${esc(filtered)}건, 일반 도구·검색성 페이지 제외 ${esc(discardedGeneric.length)}건.</p>` +
      `<p><strong>판단 원칙</strong> ${esc(data.disclaimer || '중요한 결정에는 원문과 공식자료를 직접 확인해야 합니다.')}</p>`;

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
    document.getElementById('statusText').textContent = '대상 직접일치 확인 → 공식정보·실제평가 분리 → 일반 검색·도구 페이지 제거 → 독립출처 교차검증 → 근거 연결';

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
