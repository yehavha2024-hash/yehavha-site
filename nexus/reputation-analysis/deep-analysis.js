(() => {
  const nativeFetch = window.fetch.bind(window);
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const clean = (value,max=220) => String(value || '').replace(/\s+/g,' ').trim().slice(0,max);
  const opinion = item => item?.kind === 'opinion';
  const hostOf = item => item?.host || item?.provider || '출처 확인';
  const sentimentLabel = s => ({positive:'긍정',negative:'부정',neutral:'중립·혼합'}[s] || '중립·혼합');
  const stateLabel = s => ({positive:'긍정 중심',negative:'부정 중심',conflicted:'긍정·부정 상충',mixed:'혼합'}[s] || '혼합');

  function normalizeUrl(url) {
    try {
      const u = new URL(url, location.origin);
      ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid'].forEach(k => u.searchParams.delete(k));
      u.hash = '';
      return u.toString();
    } catch { return String(url || ''); }
  }

  function mergeSignals(baseSignals=[], extraSignals=[]) {
    const map = new Map();
    for (const signal of [...baseSignals,...extraSignals]) {
      if (!signal?.topic) continue;
      if (!map.has(signal.topic)) map.set(signal.topic,{topic:signal.topic,positive:[],negative:[],neutral:[],highRisk:[]});
      const row = map.get(signal.topic);
      for (const key of ['positive','negative','neutral','highRisk']) {
        row[key] = [...new Set([...row[key],...((signal[key] || []))])];
      }
    }
    return [...map.values()];
  }

  function mergeData(base, deep) {
    if (!deep?.ok || !Array.isArray(deep.evidence)) return base;
    const seen = new Set((base.evidence || []).map(item => `${normalizeUrl(item.url)}|${clean(item.title,100).toLowerCase()}`));
    const added = [];
    for (const item of deep.evidence) {
      const key = `${normalizeUrl(item.url)}|${clean(item.title,100).toLowerCase()}`;
      if (!seen.has(key)) { seen.add(key); added.push(item); }
    }
    const evidence = [...(base.evidence || []),...added];
    const opinions = evidence.filter(opinion);
    const counts = opinions.reduce((a,e) => { const k=['positive','negative','neutral'].includes(e.sentiment)?e.sentiment:'neutral'; a[k]++; return a; },{positive:0,negative:0,neutral:0});
    const searchLinks = [...(base.searchLinks || [])];
    for (const link of deep.searchLinks || []) if (!searchLinks.some(x => x.url === link.url)) searchLinks.push(link);
    return {
      ...base,
      schema:'nexus-reputation-analysis-v5+deep-v1',
      evidence,
      signals:mergeSignals(base.signals,deep.signals),
      searchLinks,
      deepExpansion:deep,
      metrics:{...(base.metrics || {}),opinionSources:opinions.length,opinionHosts:new Set(opinions.map(hostOf).filter(Boolean)).size,positiveOpinions:counts.positive,negativeOpinions:counts.negative,neutralOpinions:counts.neutral,deepAdded:added.length,deepDirectLinked:Number(deep.metrics?.directLinked || 0)}
    };
  }

  window.fetch = async (input, init={}) => {
    const url = typeof input === 'string' ? input : input?.url || '';
    const isPrimary = /\/api\/reputation-analysis(?:\?|$)/.test(url) && !/reputation-analysis-deep/.test(url) && String(init?.method || 'GET').toUpperCase() === 'POST';
    if (!isPrimary) return nativeFetch(input, init);

    let payload = null;
    try { payload = JSON.parse(init?.body || '{}'); } catch {}
    const deepController = new AbortController();
    const deepTimer = setTimeout(() => deepController.abort(), 15000);
    const deepPromise = payload?.target ? nativeFetch('/api/reputation-analysis-deep', {
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify({type:payload.type,target:payload.target}),
      signal:deepController.signal
    }).then(r => r.json()).catch(() => null).finally(() => clearTimeout(deepTimer)) : Promise.resolve(null);

    const primary = await nativeFetch(input, init);
    let base = null;
    try { base = await primary.clone().json(); } catch { return primary; }
    if (!primary.ok || !base?.ok) return primary;
    const deep = await deepPromise;
    const merged = mergeData(base, deep);
    window.__NEXUS_REPUTATION_DATA__ = merged;
    return new Response(JSON.stringify(merged), {
      status:primary.status,
      statusText:primary.statusText,
      headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}
    });
  };

  function excerpt(item,max=180) {
    const text = clean(item?.snippet || item?.title || '',max);
    return text || '원문 제목만 확인됨';
  }

  function groupByTopic(opinions) {
    const map = new Map();
    for (const item of opinions) {
      const topics = Array.isArray(item.topics) && item.topics.length ? item.topics : ['기타 공개평가'];
      for (const topic of topics) {
        if (!map.has(topic)) map.set(topic,[]);
        map.get(topic).push(item);
      }
    }
    return [...map.entries()].map(([topic,items]) => {
      const counts = items.reduce((a,e) => { const k=['positive','negative','neutral'].includes(e.sentiment)?e.sentiment:'neutral'; a[k]++; return a; },{positive:0,negative:0,neutral:0});
      const hosts = new Set(items.map(hostOf).filter(Boolean));
      const state = counts.positive && counts.negative ? 'conflicted' : counts.negative > counts.positive ? 'negative' : counts.positive > counts.negative ? 'positive' : 'mixed';
      return {topic,items,counts,hosts:[...hosts],state,total:items.length};
    }).sort((a,b) => b.total-a.total || b.hosts.length-a.hosts.length);
  }

  function findingCard(item) {
    const topics = (item.topics || []).slice(0,2).join(' · ');
    const identity = item.identityConfidence === 'direct' ? '직접 연계' : '이름 일치';
    return `<article class="deep-finding">
      <div class="deep-finding-meta"><span>${esc(hostOf(item))}</span><span>${esc(identity)}</span><span>${esc(item.id || '')}</span></div>
      <strong>${esc(clean(item.title,140))}</strong>
      <p>${esc(excerpt(item,220))}</p>
      <div class="deep-finding-foot">${topics ? `<span>${esc(topics)}</span>` : '<span>기타 공개평가</span>'}<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">원문 ↗</a></div>
    </article>`;
  }

  function themeCard(group) {
    const positives = group.items.filter(x => x.sentiment === 'positive').slice(0,2);
    const negatives = group.items.filter(x => x.sentiment === 'negative').slice(0,2);
    const neutral = group.items.filter(x => x.sentiment === 'neutral').slice(0,1);
    const parts = [];
    if (positives.length) parts.push(`<div><b>긍정에서 실제로 나온 내용</b>${positives.map(x => `<p><span>${esc(x.id)}</span>${esc(excerpt(x,150))}</p>`).join('')}</div>`);
    if (negatives.length) parts.push(`<div><b>부정에서 실제로 나온 내용</b>${negatives.map(x => `<p><span>${esc(x.id)}</span>${esc(excerpt(x,150))}</p>`).join('')}</div>`);
    if (!positives.length && !negatives.length && neutral.length) parts.push(`<div><b>중립·혼합 내용</b>${neutral.map(x => `<p><span>${esc(x.id)}</span>${esc(excerpt(x,150))}</p>`).join('')}</div>`);
    return `<article class="deep-theme">
      <div class="deep-theme-head"><h4>${esc(group.topic)}</h4><span class="deep-state ${esc(group.state)}">${esc(stateLabel(group.state))}</span></div>
      <p class="deep-theme-stats">총 ${group.total}건 · ${group.hosts.length}개 출처 · 긍정 ${group.counts.positive} · 부정 ${group.counts.negative} · 중립/혼합 ${group.counts.neutral}</p>
      <div class="deep-theme-evidence">${parts.join('')}</div>
      <p class="deep-theme-refs">근거 ${esc(group.items.slice(0,8).map(x => x.id).join(' · '))}</p>
    </article>`;
  }

  function platformRows(opinions) {
    const map = new Map();
    for (const item of opinions) {
      const h = hostOf(item);
      if (!map.has(h)) map.set(h,{host:h,positive:0,negative:0,neutral:0,topics:new Set(),refs:[]});
      const row = map.get(h);
      const k=['positive','negative','neutral'].includes(item.sentiment)?item.sentiment:'neutral';
      row[k]++;
      (item.topics || []).forEach(t => row.topics.add(t));
      row.refs.push(item.id);
    }
    return [...map.values()].sort((a,b) => (b.positive+b.negative+b.neutral)-(a.positive+a.negative+a.neutral)).slice(0,12);
  }

  function repeatedTerms(opinions,target) {
    const stop = new Set(['후기','리뷰','평판','기업','회사','기관','관련','대한','에서','으로','하고','있다','있는','입니다','합니다','직원','검색','정보','면접','채용','사람','대해','정도','그리고','하지만','the','and','with']);
    String(target || '').split(/\s+/).forEach(x => stop.add(x.toLowerCase()));
    const map = new Map();
    for (const item of opinions) {
      const tokens = `${item.title || ''} ${item.snippet || ''}`.toLowerCase().match(/[가-힣]{2,}|[a-z]{3,}/g) || [];
      for (const token of tokens) if (!stop.has(token)) map.set(token,(map.get(token)||0)+1);
    }
    return [...map.entries()].filter(([,n]) => n>=2).sort((a,b) => b[1]-a[1]).slice(0,14);
  }

  const ORG_CHECKS={
    '업무강도·워라밸':'최근 실제 퇴근시간, 주말근무 빈도, 결원 시 업무분담, 휴가 사용 방식, 퇴근 후 연락 기준을 구체적으로 확인하십시오.',
    '조직문화·경영진':'직속 상사와 보고라인, 의사결정 방식, 팀 이직률, 갈등·고충 처리방식, 대표·관리자 개입 범위를 확인하십시오.',
    '보상·복지':'연봉, 수습급여, 급여일, 성과급, 야근수당, 복지 조건을 구두가 아니라 오퍼·근로계약서·공식 문서로 확인하십시오.',
    '채용·면접':'공석 발생 이유, 전임자 근속기간, 실제 담당업무, 팀 인원, 수습평가 기준과 면접 과정의 태도를 확인하십시오.',
    '퇴사·이직':'최근 퇴사 사유와 평균 근속을 확인하고, 입사 결정을 서두르지 말고 다른 지원처를 병행하십시오.',
    '직무·성장':'실제 맡을 업무, 교육·인수인계, 의사결정 권한, 경력 확장 가능성이 공고 내용과 같은지 확인하십시오.',
    '거래·신뢰':'계약조건, 정산일, 납기, 책임자, 분쟁처리 절차와 기존 거래 실적을 문서로 확인하십시오.'
  };
  const ORG_IMPROVE={
    '업무강도·워라밸':'근무시간·초과근로·주말업무·휴가사용을 실제 데이터로 점검하고 반복되는 과부하 원인을 인력·업무배분 차원에서 수정해야 합니다.',
    '조직문화·경영진':'재직자·퇴사자 피드백과 고충처리 기록을 통해 반복되는 관리자·소통 문제를 확인하고 행동기준과 책임자를 명확히 해야 합니다.',
    '보상·복지':'채용공고, 오퍼, 근로계약, 실제 지급조건의 불일치를 점검하고 급여·수습·성과급·복지 기준을 문서화해야 합니다.',
    '채용·면접':'직무범위, 보고라인, 공석사유, 팀인원, 면접절차를 표준화하고 반복되는 면접 불만의 원인을 수정해야 합니다.',
    '퇴사·이직':'입사 초기 퇴사와 반복 이직 사유를 별도 집계하고 온보딩·관리자·직무불일치 원인을 분리해 개선해야 합니다.',
    '직무·성장':'공고상 직무와 실제 업무의 차이를 줄이고 교육·인수인계·역할권한을 명확히 해야 합니다.',
    '거래·신뢰':'계약·납기·정산·민원 처리의 책임자와 기한을 명확히 하고 반복 불만을 절차 개선으로 연결해야 합니다.'
  };

  function renderActionPanels(data,groups) {
    const type = data.target?.type;
    if (type !== 'organization') return;
    const priority = groups.filter(g => g.state === 'negative' || g.state === 'conflicted').slice(0,5);
    const selected = priority.length ? priority : groups.slice(0,4);
    const subjectTitle = document.getElementById('subjectActionTitle');
    const userTitle = document.getElementById('userActionTitle');
    if (subjectTitle) subjectTitle.textContent = '반복 평판 신호별 개선 과제';
    if (userTitle) userTitle.textContent = '구직자·거래상대 확인 항목';
    const subjectSummary = document.getElementById('subjectActionSummary');
    const userSummary = document.getElementById('userActionSummary');
    if (subjectSummary) subjectSummary.textContent = selected.length ? '아래 항목은 일반론이 아니라 실제 수집된 반복 주제와 근거 번호를 기준으로 정리한 개선 과제입니다.' : '분석 가능한 반복 주제가 부족합니다.';
    if (userSummary) userSummary.textContent = selected.length ? '아래 질문은 실제 평판에서 반복된 주제를 면접·오퍼·계약 단계에서 검증하기 위한 확인 항목입니다.' : '공개 평판만으로 판단하지 말고 핵심 조건을 직접 확인하십시오.';
    const subject = document.getElementById('subjectActionList');
    const user = document.getElementById('userActionList');
    if (subject) subject.innerHTML = selected.map((g,i) => `<article class="action-item"><span class="action-priority">${i===0?'우선':'점검'}</span><div><strong>${esc(g.topic)}</strong><p>${esc(ORG_IMPROVE[g.topic] || '반복된 공개 의견의 원문을 원인별로 확인하고 실제 운영상 재현 여부를 점검한 뒤 개선 이력을 남겨야 합니다.')}</p><span class="action-refs">근거 ${esc(g.items.slice(0,6).map(x=>x.id).join(' · '))}</span></div></article>`).join('');
    if (user) user.innerHTML = selected.map((g,i) => `<article class="action-item"><span class="action-priority">${i===0?'확인':'비교'}</span><div><strong>${esc(g.topic)}</strong><p>${esc(ORG_CHECKS[g.topic] || '같은 주제의 여러 원문과 현재 조건을 비교하고 면접·계약 단계에서 직접 확인하십시오.')}</p><span class="action-refs">근거 ${esc(g.items.slice(0,6).map(x=>x.id).join(' · '))}</span></div></article>`).join('');
  }

  function renderDeep(data) {
    const section = document.getElementById('deepAnalysisSection');
    if (!section || !data?.target) return;
    const opinions = (data.evidence || []).filter(opinion);
    const groups = groupByTopic(opinions);
    const counts = opinions.reduce((a,e) => { const k=['positive','negative','neutral'].includes(e.sentiment)?e.sentiment:'neutral'; a[k]++; return a; },{positive:0,negative:0,neutral:0});
    const hosts = new Set(opinions.map(hostOf).filter(Boolean));
    const direct = opinions.filter(x => x.identityConfidence === 'direct').length;
    const positives = opinions.filter(x => x.sentiment === 'positive').slice(0,8);
    const negatives = opinions.filter(x => x.sentiment === 'negative').slice(0,8);
    const conflicts = groups.filter(x => x.state === 'conflicted').slice(0,6);
    const terms = repeatedTerms(opinions,data.target.name);
    const topNames = groups.slice(0,5).map(g => `${g.topic} ${g.total}건`).join(', ');

    const lead = document.getElementById('deepAnalysisLead');
    if (lead) lead.innerHTML = opinions.length
      ? `<strong>${esc(data.target.name)}에 대해 공개 의견 ${opinions.length}건을 ${hosts.size}개 출처에서 취합했습니다.</strong> 긍정 ${counts.positive}건, 부정 ${counts.negative}건, 중립·혼합 ${counts.neutral}건이며${topNames ? ` 반복 주제는 ${esc(topNames)}입니다.` : ''} 여기서부터는 단순 개수 집계가 아니라 각 주제에 실제로 어떤 내용이 게시됐는지 근거 번호와 함께 보여줍니다.`
      : `<strong>현재 자동 수집에서 분석 가능한 공개 의견을 확보하지 못했습니다.</strong> 공개 의견이 없다는 뜻은 아니며 추가 출처 확인이 필요합니다.`;

    const identityBox = document.getElementById('identityAnalysis');
    if (identityBox) identityBox.innerHTML = `<strong>동명이름·대상 식별 점검</strong><p>현재 공개 의견 ${opinions.length}건 중 직접 회사·기관 페이지에서 연계된 자료는 ${direct}건입니다. 나머지는 이름·검색문맥 일치 자료이므로 동일 명칭의 다른 법인·기관이 존재할 수 있는 경우 원문에서 지역·업종·대표자·홈페이지 등 식별정보를 확인해야 합니다. 직접 연계 자료와 이름 일치 자료를 같은 확실성으로 취급하지 않습니다.</p>`;

    const themeGrid = document.getElementById('deepThemeGrid');
    if (themeGrid) themeGrid.innerHTML = groups.length ? groups.slice(0,8).map(themeCard).join('') : '<article class="deep-empty">분석 가능한 반복 주제가 아직 없습니다.</article>';

    const positiveList = document.getElementById('positiveFindingList');
    const negativeList = document.getElementById('negativeFindingList');
    if (positiveList) positiveList.innerHTML = positives.length ? positives.map(findingCard).join('') : '<article class="deep-empty">긍정으로 분류할 수 있는 구체적 공개 의견이 현재 표본에서는 확인되지 않았습니다.</article>';
    if (negativeList) negativeList.innerHTML = negatives.length ? negatives.map(findingCard).join('') : '<article class="deep-empty">부정으로 분류할 수 있는 구체적 공개 의견이 현재 표본에서는 확인되지 않았습니다.</article>';

    const conflictList = document.getElementById('conflictAnalysis');
    if (conflictList) conflictList.innerHTML = conflicts.length ? conflicts.map(g => `<article class="deep-conflict"><strong>${esc(g.topic)}</strong><p>같은 주제에서 긍정 ${g.counts.positive}건과 부정 ${g.counts.negative}건이 함께 확인됐습니다. 시기·부서·직무·이용조건 차이일 수 있으므로 단일 결론보다 원문별 조건 차이를 확인해야 합니다.</p><span>근거 ${esc(g.items.slice(0,8).map(x=>x.id).join(' · '))}</span></article>`).join('') : '<article class="deep-empty">현재 표본에서는 같은 주제 안의 뚜렷한 긍정·부정 상충이 많지 않습니다.</article>';

    const platform = document.getElementById('platformBreakdown');
    if (platform) platform.innerHTML = platformRows(opinions).map(r => `<div class="platform-row"><strong>${esc(r.host)}</strong><span>총 ${r.positive+r.negative+r.neutral} · 긍정 ${r.positive} · 부정 ${r.negative} · 중립 ${r.neutral}</span><small>${esc([...r.topics].slice(0,4).join(' · ') || '주제 미분류')} · ${esc(r.refs.slice(0,6).join(' · '))}</small></div>`).join('') || '<article class="deep-empty">출처 분포를 계산할 공개 의견이 없습니다.</article>';

    const termBox = document.getElementById('repeatedTerms');
    if (termBox) termBox.innerHTML = terms.length ? terms.map(([t,n]) => `<span>${esc(t)} <b>${n}</b></span>`).join('') : '<span>반복 표현 부족</span>';

    renderActionPanels(data,groups);
    section.hidden = false;
  }

  const report = document.getElementById('report');
  if (report) {
    const observer = new MutationObserver(() => {
      if (!report.hidden && window.__NEXUS_REPUTATION_DATA__) renderDeep(window.__NEXUS_REPUTATION_DATA__);
    });
    observer.observe(report,{attributes:true,attributeFilter:['hidden']});
  }
})();
