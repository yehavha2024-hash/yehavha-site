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
    person: '공개 활동과 온라인 평가를 취합하고, 당사자의 평판관리와 이용자의 확인·대응 행동까지 제시합니다.',
    organization: '회사·기관의 공개 의견을 취합하고, 기업의 평판관리와 구직자·거래상대의 행동까지 제시합니다.',
    product: '상품에 대한 공개 의견을 취합하고, 판매자 개선과 구매자의 의사결정 행동까지 제시합니다.',
    service: '서비스 공개 의견을 취합하고, 운영자 개선과 이용자의 의사결정 행동까지 제시합니다.',
    place: '장소 공개 의견을 취합하고, 운영자 개선과 방문자의 확인·대응 행동까지 제시합니다.'
  };
  const placeholders = {
    person: '예: 공개 활동이 있는 인물명',
    organization: '예: 회사명 또는 기관명',
    product: '예: 제조사와 상품명',
    service: '예: 서비스명',
    place: '예: 상호·시설·장소명'
  };
  const actionTitles = {
    person:{subject:'당사자·소속조직 평판관리 실행안',user:'평판 이용자 확인·대응안'},
    organization:{subject:'기업·기관 평판관리 실행안',user:'구직자·거래상대 행동안'},
    product:{subject:'제조·판매자 개선 실행안',user:'구매자 의사결정·대응안'},
    service:{subject:'서비스 운영자 개선 실행안',user:'이용자 의사결정·대응안'},
    place:{subject:'운영자 평판관리 실행안',user:'방문자 확인·대응안'}
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
    if (!opinions.length) return `${target}에 관한 기본·공식 자료는 확인할 수 있으나 현재 자동 탐색에서 공개 의견·후기 성격의 결과는 확보하지 못했습니다. 따라서 평판을 단정하지 않고, 대상 측에는 모니터링·정보공개 과제를, 이용자 측에는 직접 확인 질문과 비교 검토 행동을 제시합니다.`;
    const c = opinionCounts(opinions);
    const hosts = uniqueHosts(opinions).size;
    const top = signals.slice(0,4).map(s => `${s.topic} ${s.total}건`).join(', ');
    const dominant = c.positive > c.negative ? '긍정 의견이 더 많았고' : c.negative > c.positive ? '부정 의견이 더 많았고' : '긍정·부정 의견 수가 비슷하거나 혼재했고';
    return `${target} 관련 공개 의견 ${opinions.length}건을 취합한 결과, ${dominant} 긍정 ${c.positive}건·부정 ${c.negative}건·중립/혼합 ${c.neutral}건으로 분류됐습니다. 의견 출처는 ${hosts}개 도메인입니다.${top ? ` 주요 언급 주제는 ${top}입니다.` : ''} 아래 실행 제안은 이 평판 신호를 실제 운영개선과 의사결정 행동으로 전환한 것입니다.`;
  }

  const orgSubjectByTopic = {
    '업무강도·워라밸':'실제 근무시간·초과근로·주말업무·휴가사용·업무배분을 팀별로 점검하고, 결원이나 상시 과부하가 확인되면 인력·업무량을 조정하십시오. 채용 단계에서도 실제 근무 기대치를 숨기지 말고 명시해야 합니다.',
    '조직문화·경영진':'퇴사·재직자 면담과 익명 고충채널을 통해 반복되는 관리자·소통 문제를 확인하고, 관리자 행동기준·피드백·고충처리 절차를 운영지표로 관리하십시오.',
    '보상·복지':'기본급·지급일·수습조건·성과급·복지의 기준과 실제 적용이 일치하는지 점검하고, 채용공고·오퍼·근로조건 안내가 서로 다르지 않도록 정리하십시오.',
    '채용·면접':'직무범위·보고라인·팀인원·공석 사유·면접절차·근무조건을 표준화해 사전에 안내하고, 면접자 불만이 반복되는 질문·태도·절차를 수정하십시오.',
    '퇴사·이직':'입사 90일 이내 퇴사와 반복 이직 사유를 별도로 집계하고, 온보딩·업무인수인계·관리자 문제·직무불일치를 원인별로 개선하십시오.',
    '거래·신뢰':'계약·납기·정산·민원·대금 처리의 책임자와 응답기한을 정하고, 반복 불만이 생기는 지점을 SLA와 체크리스트로 관리하십시오.'
  };
  const orgUserByTopic = {
    '업무강도·워라밸':'면접에서 최근 실제 퇴근시간, 주말근무 빈도, 결원 시 업무분담, 휴가 사용 방식, 긴급연락 기준을 구체적으로 확인하십시오. 답변이 추상적이면 다른 회사도 병행 검토하십시오.',
    '조직문화·경영진':'직속 상사와 보고라인, 의사결정 방식, 팀 이직률, 갈등·고충 처리방식을 질문하십시오. 가능하면 같은 직무 재직자·퇴사자 의견을 시기별로 비교하십시오.',
    '보상·복지':'연봉·수습급여·급여일·성과급·복지·야근수당 등 중요한 조건은 구두 설명만 믿지 말고 오퍼·근로계약서·공식 안내에서 확인하십시오.',
    '채용·면접':'공석 발생 이유, 전임자 근속기간, 실제 담당업무, 팀 규모, 수습평가 기준을 면접에서 확인하십시오. 면접 과정에서 평판 신호와 같은 문제가 재현되는지도 관찰하십시오.',
    '퇴사·이직':'평균 근속과 최근 퇴사 사유를 확인하고, 입사 결정을 서두르기보다 다른 지원처를 함께 유지하십시오. 입사 후에는 첫 2주·첫 급여일·수습 종료 시점을 재평가 지점으로 잡으십시오.',
    '거래·신뢰':'거래 전 계약조건·정산일·납기·책임자·분쟁처리 절차를 문서로 확인하고, 가능하면 기존 거래처 사례나 공식 실적을 별도로 확인하십시오.'
  };

  function genericSubjectAction(type, topic, state) {
    const base = state === 'positive'
      ? '긍정 평가가 나온 이유를 실제 운영기준과 연결해 유지하고, 과장된 홍보보다 확인 가능한 근거와 개선 이력을 공개하십시오.'
      : state === 'conflicted'
        ? '긍정·부정이 엇갈리므로 원문을 시기·이용상황·담당부서별로 나눠 원인을 확인하고, 반복되는 불만부터 운영개선 과제로 전환하십시오.'
        : '부정 의견의 삭제나 반박부터 시작하지 말고 원문을 원인별로 분류해 실제 운영·품질·응대 과정에서 재현되는 문제인지 먼저 점검하고 개선 결과를 기록하십시오.';
    const prefix = type === 'person' ? '발언·활동·응대 과정에서' : type === 'product' ? '품질·배송·사용·사후지원 과정에서' : type === 'service' ? '이용·응대·비용·해지 과정에서' : type === 'place' ? '방문·응대·가격·시설 운영에서' : '';
    return `${prefix} ${topic} 관련 신호를 별도 관리하십시오. ${base}`.trim();
  }

  function genericUserAction(type, topic, state) {
    const caution = state === 'positive'
      ? '긍정 의견도 자신의 이용조건·시기와 같은지 원문에서 확인하십시오.'
      : '단일 후기를 사실로 확정하지 말고 같은 주제의 여러 원문과 최근 자료를 비교한 뒤 결정하십시오.';
    if (type === 'person') return `${topic} 관련 공개평가의 작성 시점과 맥락을 확인하고, 중요한 판단은 당사자의 공식 기록·최근 활동과 함께 비교하십시오. ${caution}`;
    if (type === 'product') return `${topic} 관련 의견을 실제 구매조건과 비교하고, 반품·교환·A/S 조건과 대체상품을 함께 확인하십시오. ${caution}`;
    if (type === 'service') return `${topic} 관련 의견을 자신의 이용방식과 비교하고, 요금·해지·환불·고객지원 조건을 가입 전에 확인하십시오. ${caution}`;
    if (type === 'place') return `${topic} 관련 최근 후기를 방문시간·가격·예약조건과 함께 확인하고, 중요한 일정이라면 대체 장소도 함께 검토하십시오. ${caution}`;
    return `${topic} 관련 원문을 확인하고 다른 선택지와 비교하십시오. ${caution}`;
  }

  function actionItem(priority, title, text, refs='') {
    return `<article class="action-item"><span class="action-priority">${esc(priority)}</span><div><strong>${esc(title)}</strong><p>${esc(text)}</p>${refs ? `<span class="action-refs">근거 ${esc(refs)}</span>` : ''}</div></article>`;
  }

  function buildActionPlan(type, target, opinions, signals) {
    const counts = opinionCounts(opinions);
    const priority = signals.filter(s => s.state === 'negative' || s.state === 'conflicted').slice(0,4);
    const positive = signals.filter(s => s.state === 'positive').slice(0,2);
    const selected = priority.length ? priority : positive.length ? positive : signals.slice(0,2);
    const titles = actionTitles[type] || actionTitles.person;
    const subject = [];
    const user = [];

    if (selected.length) {
      selected.forEach((signal,index) => {
        const refs = [...signal.positive,...signal.negative,...signal.neutral].join(' · ');
        const urgency = index === 0 && (signal.state === 'negative' || signal.state === 'conflicted') ? '우선' : '점검';
        const subjectText = type === 'organization' && orgSubjectByTopic[signal.topic]
          ? orgSubjectByTopic[signal.topic]
          : genericSubjectAction(type, signal.topic, signal.state);
        const userText = type === 'organization' && orgUserByTopic[signal.topic]
          ? orgUserByTopic[signal.topic]
          : genericUserAction(type, signal.topic, signal.state);
        subject.push(actionItem(urgency, signal.topic, subjectText, refs));
        user.push(actionItem(urgency === '우선' ? '확인' : '비교', signal.topic, userText, refs));
      });
    } else {
      subject.push(actionItem('기본', '평판 모니터링', `${target}에 관한 공개 의견이 적거나 주제화되지 않았습니다. 검색 노출·채용·고객·거래 접점에서 새 의견을 정기적으로 확인하고, 반복되는 표현이 생기면 원문과 실제 운영상태를 연결해 개선 과제로 전환하십시오.`));
      user.push(actionItem('기본', '정보 부족 대응', `공개 평판이 적다는 사실을 좋은 신호로 간주하지 마십시오. 자신의 목적에 중요한 조건을 직접 질문하고 공식 문서·계약·최근 이용정보로 확인한 뒤 다른 선택지와 비교하십시오.`));
    }

    if (type === 'organization') {
      if (counts.negative > 0 || priority.length) {
        subject.push(actionItem('30일', '개선→설명→재측정', '부정 의견을 단순 홍보로 덮지 말고 반복 주제를 실제 운영지표와 연결해 개선한 뒤, 채용페이지·회사소개·응대문서에 바뀐 기준을 반영하고 30일 단위로 신규 의견 변화를 다시 측정하십시오.'));
        user.push(actionItem('결정', '대안 병행·검증 후 결정', '부정·상충 평판이 확인되면 이 회사를 유일한 선택지로 두지 말고 다른 지원처나 거래처를 병행하십시오. 면접·오퍼·계약 단계에서 평판과 같은 문제가 실제로 확인되는지를 점검한 뒤 최종 결정하십시오.'));
      } else {
        subject.push(actionItem('유지', '긍정 평판의 원인 보존', '긍정 의견이 나온 운영방식·팀·서비스를 특정해 유지하고, 신규 인력·관리자 변경 후에도 같은 수준이 유지되는지 추적하십시오.'));
        user.push(actionItem('확인', '긍정 평판도 적용범위 확인', '긍정 평판이 현재 지원 직무·팀·근무시기에도 적용되는지 확인하십시오. 회사 전체 평판과 특정 부서 경험은 다를 수 있습니다.'));
      }
    } else {
      subject.push(actionItem('지속', '변화 추적', '개선 조치 후 같은 주제의 신규 의견이 줄거나 방향이 바뀌는지 정기적으로 확인하고, 반복되는 불만은 다시 원인분석 대상으로 올리십시오.'));
      user.push(actionItem('결정', '대체 선택지 비교', '평판 신호가 자신의 핵심 조건과 충돌하면 대체 인물·상품·서비스·장소를 함께 비교하고, 중요한 조건을 직접 확인한 뒤 결정하십시오.'));
    }

    const subjectSummary = priority.length
      ? `부정 또는 상충 신호가 ${priority.length}개 주제에서 확인됐습니다. 평판관리의 핵심은 반박이 아니라 원인 확인 → 운영개선 → 설명 → 재측정입니다.`
      : positive.length
        ? `현재는 긍정 신호가 상대적으로 두드러집니다. 강점의 실제 원인을 유지하고 변화가 생길 때 평판이 악화되지 않는지 추적해야 합니다.`
        : `현재 뚜렷한 주제 신호가 적습니다. 평판 노출 자체를 모니터링하면서 새로운 반복 신호가 생기는지 확인해야 합니다.`;
    const userSummary = type === 'organization'
      ? (counts.negative > 0 || priority.length
          ? '부정·상충 평판은 취업·거래의 자동 탈락 사유가 아니라 검증 질문입니다. 대안을 병행하고, 면접·오퍼·계약에서 해당 신호가 실제로 재현되는지 확인하십시오.'
          : '현재 부정 신호가 두드러지지 않더라도 직무·팀·시기별 차이가 있으므로 핵심 근무·보상·조직조건은 직접 확인해야 합니다.')
      : '평판은 선택을 대신하는 결론이 아니라 확인해야 할 위험·강점 신호입니다. 자신의 조건과 맞는지 원문과 실제 조건을 비교한 뒤 행동하십시오.';

    return {titles,subject,user,subjectSummary,userSummary};
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
    const actions = buildActionPlan(data.target.type, data.target.name, opinions, signals);

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

    document.getElementById('subjectActionTitle').textContent = actions.titles.subject;
    document.getElementById('userActionTitle').textContent = actions.titles.user;
    document.getElementById('subjectActionSummary').textContent = actions.subjectSummary;
    document.getElementById('userActionSummary').textContent = actions.userSummary;
    document.getElementById('subjectActionList').innerHTML = actions.subject.join('');
    document.getElementById('userActionList').innerHTML = actions.user.join('');

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
      `<p><strong>실행 원칙</strong> 평판 신호를 단순 나열하지 않고 대상 측에는 운영·커뮤니케이션 개선과 재측정 과제를, 이용자 측에는 확인 질문·대안 비교·문서 확인·의사결정 행동으로 전환합니다.</p>` +
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
    document.getElementById('statusText').textContent = '공개 의견 수집 → 대상·중복 확인 → 긍정·부정·상충 분석 → 핵심 주제 도출 → 대상자·이용자 실행안 생성';

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
