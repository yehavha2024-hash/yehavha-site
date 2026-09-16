(() => {
  const form = document.getElementById('queryForm');
  const input = document.getElementById('targetInput');
  const status = document.getElementById('statusPanel');
  const report = document.getElementById('report');
  const submit = document.getElementById('submitBtn');

  const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const cleanPublic = value => String(value ?? '')
    .replace(/사용자가 제출한 잡플래닛 공개 화면에는/g, '잡플래닛 화면에는')
    .replace(/사용자 제출 공개 페이지 캡처/g, '잡플래닛 공개 화면')
    .replace(/사용자 제출/g, '')
    .replace(/사용자가 제출한/g, '')
    .replace(/추가로 제출된/g, '추가로 확인된')
    .replace(/제출된 공개 화면/g, '공개 화면')
    .replace(/제출 공개화면/g, '공개화면')
    .replace(/제출 잡플래닛 공개화면/g, '잡플래닛 공개화면')
    .replace(/\s{2,}/g, ' ')
    .trim();
  const clip = (value,max=260) => {
    const text = cleanPublic(value).replace(/\s+/g,' ').trim();
    return text.length > max ? `${text.slice(0,max-1)}…` : text;
  };
  const formatDate = value => {
    if (!value) return '';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('ko-KR', {year:'numeric',month:'2-digit',day:'2-digit'});
  };

  function signalText(signals) {
    if (!Array.isArray(signals) || !signals.length) return '';
    return signals.map(item => {
      const bits = [item.platform];
      if (Number.isFinite(Number(item.participantCount))) bits.push(`리뷰 ${Number(item.participantCount).toLocaleString('ko-KR')}명`);
      else if (Number.isFinite(Number(item.reviewCount))) bits.push(`리뷰 ${Number(item.reviewCount).toLocaleString('ko-KR')}건`);
      if (Number.isFinite(Number(item.rating))) bits.push(`평점 ${Number(item.rating).toFixed(1)}/5`);
      if (Number.isFinite(Number(item.recommendRate))) bits.push(`추천 ${Number(item.recommendRate)}%`);
      if (Number.isFinite(Number(item.ceoSupportRate))) bits.push(`CEO 지지 ${Number(item.ceoSupportRate)}%`);
      if (Number.isFinite(Number(item.growthRate))) bits.push(`성장가능성 ${Number(item.growthRate)}%`);
      if (Array.isArray(item.cultureTags) && item.cultureTags.length) bits.push(item.cultureTags.join(' · '));
      return bits.filter(Boolean).join(' · ');
    }).join(' / ');
  }

  function defaultSections(company, evidence, signals, snapshotSummary) {
    const group = kinds => evidence.filter(item => kinds.includes(item.kind));
    const text = (items, fallback) => items.length ? clip(items.map(x => x.snippet || x.title).filter(Boolean).slice(0,2).join(' / '),700) : fallback;
    const repSignal = signalText(signals);
    return [
      {key:'profile',label:'회사 개요',items:group(['profile']),text:text(group(['profile']),`${company}의 기업 기본정보는 아래 근거자료와 직접 검색 경로에서 확인할 수 있습니다.`)},
      {key:'recruiting',label:'채용 현황',items:group(['recruiting']),text:text(group(['recruiting']),'현재 자동 조회에서 직접 연결되는 채용공고가 제한적입니다. 채용사이트 원문을 함께 확인하십시오.')},
      {key:'salary',label:'연봉·보상',items:group(['salary']),text:text(group(['salary']),'공개 연봉정보는 기준연도·직군·성과급 포함 여부가 다를 수 있으므로 지원 직무 기준으로 재확인해야 합니다.')},
      {key:'reputation',label:'평판·근무경험',items:group(['reputation']),text:clip(snapshotSummary || repSignal || text(group(['reputation']),'자동수집에서 직접 인용 가능한 후기 본문은 제한될 수 있습니다. 이는 검색 색인·로그인 제한 때문이며 회사 자체에 후기가 없다는 뜻은 아닙니다.'),700)},
      {key:'recent',label:'최근 회사 신호',items:group(['media','official','legal-media']),text:text(group(['media','official','legal-media']),'최근 사업·조직 변화나 공식자료는 아래 검색 경로를 통해 추가 확인할 수 있습니다.')}
    ];
  }

  function intelligenceMarkup(sections, signals) {
    const repSignal = signalText(signals);
    return sections.map(section => {
      const links = (section.items || []).slice(0,2).map(item => `<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(clip(item.title || item.host || '원문',60))} ↗</a>`).join(' · ');
      const extra = section.key === 'reputation' && repSignal && !String(section.text||'').includes(repSignal) ? `<p><strong>공개 집계</strong><br>${esc(repSignal)}</p>` : '';
      return `<article class="signal">
        <div class="signal-top"><h4>${esc(section.label)}</h4></div>
        <p>${esc(clip(section.text,760))}</p>
        ${extra}
        ${links ? `<p>${links}</p>` : ''}
      </article>`;
    }).join('');
  }

  function evidenceMarkup(items) {
    if (!items.length) return '<article class="source empty"><span class="source-id">—</span><div><strong>자동 수집 결과가 제한적입니다.</strong><p>아래 추가 확인 경로에서 Google·네이버·잡플래닛·사람인·잡코리아 검색을 바로 열어 최신 원문을 확인할 수 있습니다.</p></div></article>';
    const order = {profile:1,recruiting:2,salary:3,reputation:4,media:5,official:6,'legal-media':7};
    return [...items].sort((a,b)=>(order[a.kind]||99)-(order[b.kind]||99)).map(item => {
      const meta = [item.label || item.kind, item.host, formatDate(item.publishedAt)].filter(Boolean).join(' · ');
      return `<article class="source">
        <span class="source-id">${esc(item.id || 'E')}</span>
        <div class="source-copy">
          <strong>${esc(item.title || '공개자료')}</strong>
          <p>${esc(meta)}${item.snippet ? `<span class="source-snippet">${esc(clip(item.snippet,420))}</span>` : ''}</p>
        </div>
        <a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">원문 ↗</a>
      </article>`;
    }).join('');
  }

  function opinionMarkup(opinions) {
    return opinions.map(item => {
      const meta = [item.platform, item.host, formatDate(item.publishedAt)].filter(Boolean).join(' · ');
      return `<article class="source">
        <span class="source-id">${esc(item.id)}</span>
        <div class="source-copy">
          <strong>${esc(item.title || item.platform || '공개 후기')}</strong>
          <p>${esc(meta)}${item.excerpt ? `<span class="source-snippet">${esc(clip(item.excerpt,520))}</span>` : ''}</p>
        </div>
        <a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">원문 ↗</a>
      </article>`;
    }).join('');
  }

  function mergeThemes(primary, additional) {
    const out = [], seen = new Set();
    for (const item of [...primary, ...additional]) {
      const key = String(item.topic || '').trim();
      if (!key || seen.has(key)) continue;
      seen.add(key); out.push(item);
    }
    return out;
  }

  function themeMarkup(themes, byId) {
    return themes.map(theme => {
      const excerpts = (theme.opinionIds || []).slice(0,3).map(id => byId.get(id)).filter(Boolean);
      const detail = excerpts.map(item => `<p><span class="refs">${esc(item.id)} · ${esc(item.platform)}</span><br>${esc(clip(item.excerpt,360))}</p>`).join('');
      const label = theme.countLabel || (Number.isFinite(Number(theme.count)) ? `${theme.count}건` : '반복 신호');
      return `<article class="signal"><div class="signal-top"><h4>${esc(theme.topic)}</h4><span class="signal-state mixed">${esc(label)}</span></div>${theme.note?`<p>${esc(cleanPublic(theme.note))}</p>`:''}${detail}</article>`;
    }).join('');
  }

  function actionMarkup(actions) {
    const unique = [], seen = new Set();
    for (const item of actions) {
      const key = String(item.title || '').trim();
      if (!key || seen.has(key)) continue;
      seen.add(key); unique.push(item);
    }
    const list = unique.length ? unique.slice(0,8) : [
      {title:'채용 사유 확인',text:'증원인지 퇴사자 대체인지, 전임자의 근속기간과 퇴사 사유를 확인하십시오.'},
      {title:'실제 업무범위 확인',text:'공고의 직무와 입사 후 실제 담당업무, 겸임업무, 보고라인을 구체적으로 확인하십시오.'},
      {title:'보상조건 확인',text:'기본급·고정수당·성과급·수습급여·연장근로 보상을 오퍼와 근로계약서 기준으로 확인하십시오.'},
      {title:'근무조건 확인',text:'평균 퇴근시간, 주말근무, 연차 사용방식, 인수인계와 결원 시 업무분담을 확인하십시오.'}
    ];
    return list.map((item,index) => `<article class="action-item"><span class="action-priority">${index===0?'우선':'확인'}</span><div><strong>${esc(item.title)}</strong><p>${esc(cleanPublic(item.text))}</p>${item.refs?.length?`<span class="action-refs">근거 ${esc(cleanPublic(item.refs.join(' · ')))}</span>`:''}</div></article>`).join('');
  }

  function directSearchLinks(company) {
    const q = encodeURIComponent(company);
    const quoted = encodeURIComponent(`"${company}"`);
    return [
      {label:'Google 검색',url:`https://www.google.com/search?q=${quoted}`},
      {label:'네이버 검색',url:`https://search.naver.com/search.naver?where=nexearch&query=${q}`},
      {label:'잡플래닛 검색',url:`https://www.jobplanet.co.kr/search?query=${q}`},
      {label:'사람인 검색',url:`https://www.saramin.co.kr/zf_user/search?searchword=${q}`},
      {label:'잡코리아 검색',url:`https://www.jobkorea.co.kr/Search/?stext=${q}`},
      {label:'블라인드 검색',url:`https://www.google.com/search?q=site%3Ateamblind.com+${quoted}`}
    ];
  }

  function buildExecutiveSummary(company, sections, bundle, data) {
    const snapshot = cleanPublic(bundle.snapshotSummary || '');
    const useful = sections.filter(section => (section.items || []).length).map(section => `${section.label}: ${clip(section.text,220)}`);
    const base = snapshot || cleanPublic(data.summary || '');
    if (useful.length) return `${base ? `${base} ` : ''}${useful.join(' ')}`.trim();
    return base || `${company}의 회사 개요·채용·연봉·평판·최근 공개자료를 통합 조회했습니다. 자동 검색 결과가 제한된 항목은 아래 직접 검색 경로에서 최신 원문을 확인할 수 있습니다.`;
  }

  function render(data, bundle = {}) {
    const opinions = Array.isArray(data.opinions) ? data.opinions : [];
    const evidence = Array.isArray(bundle.evidence) ? bundle.evidence : [];
    const signals = [...(Array.isArray(data.platformSignals)?data.platformSignals:[]),...(Array.isArray(bundle.signals)?bundle.signals:[])];
    const themes = mergeThemes(Array.isArray(data.themes)?data.themes:[],Array.isArray(bundle.submittedThemes)?bundle.submittedThemes:[]);
    const actions = [...(Array.isArray(data.actions)?data.actions:[]),...(Array.isArray(bundle.verificationPoints)?bundle.verificationPoints:[])];
    const byId = new Map(opinions.map(item => [item.id,item]));
    const generated = new Date(data.generatedAt).toLocaleString('ko-KR');
    const sections = Array.isArray(bundle.intelligence?.sections) && bundle.intelligence.sections.length
      ? bundle.intelligence.sections.map(section => ({...section,text:cleanPublic(section.text)}))
      : defaultSections(data.company,evidence,signals,cleanPublic(bundle.snapshotSummary||''));

    document.getElementById('reportTitle').textContent = `${data.company} 회사 평판 분석`;
    document.getElementById('reportMeta').textContent = `구직자용 · 기준 ${generated}`;
    document.getElementById('executiveSummary').textContent = buildExecutiveSummary(data.company,sections,bundle,data);
    document.getElementById('intelligenceGrid').innerHTML = intelligenceMarkup(sections,signals);
    document.getElementById('publicEvidenceList').innerHTML = evidenceMarkup(evidence);

    const themeSection = document.getElementById('themeSection');
    if (themes.length) {
      themeSection.hidden = false;
      document.getElementById('themeGrid').innerHTML = themeMarkup(themes,byId);
    } else themeSection.hidden = true;

    const opinionSection = document.getElementById('opinionSection');
    if (opinions.length) {
      opinionSection.hidden = false;
      document.getElementById('opinionSourceList').innerHTML = opinionMarkup(opinions);
    } else opinionSection.hidden = true;

    document.getElementById('actionSummary').textContent = '공개정보를 실제 입사 판단에 사용할 수 있도록 확인 질문으로 바꿨습니다. 공개 연봉은 기준이 다를 수 있고 익명 후기는 개별 주장일 수 있으므로 최종 조건은 면접·오퍼·근로계약서와 공식자료로 확인하십시오.';
    document.getElementById('actionList').innerHTML = actionMarkup(actions);
    document.getElementById('searchLinks').innerHTML = directSearchLinks(data.company).map(link => `<a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.label)} ↗</a>`).join('');

    status.hidden = true;
    report.hidden = false;
    report.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function renderError(message) {
    status.hidden = false;
    document.getElementById('statusTitle').textContent = '회사 분석을 완료하지 못했습니다.';
    document.getElementById('statusText').textContent = message;
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const company = input.value.trim();
    if (company.length < 2) {input.focus(); return;}
    report.hidden = true;
    status.hidden = false;
    submit.disabled = true;
    document.getElementById('statusTitle').textContent = `${company}의 회사·채용·연봉·평판 정보를 찾고 있습니다.`;
    document.getElementById('statusText').textContent = '회사 확인 → 기업정보 → 채용·연봉 → 평판 → 최근 뉴스·공공자료 → 입사 전 확인사항';
    try {
      const [mainResult, intelligenceResult] = await Promise.allSettled([
        fetch('/api/reputation-analysis',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({company})}).then(async response=>({response,data:await response.json()})),
        fetch(`/api/reputation-platforms?company=${encodeURIComponent(company)}`).then(async response=>({response,data:await response.json()}))
      ]);
      if (mainResult.status !== 'fulfilled') throw mainResult.reason;
      const {response,data} = mainResult.value;
      if (!response.ok || !data.ok) throw new Error(data.error || '분석 API 오류');
      let bundle = {};
      if (intelligenceResult.status === 'fulfilled' && intelligenceResult.value.response.ok && intelligenceResult.value.data?.ok) bundle = intelligenceResult.value.data;
      render(data,bundle);
    } catch (error) {
      renderError(`공개정보 연결 또는 분석 과정에서 오류가 발생했습니다. 잠시 후 다시 시도하십시오. (${error.message})`);
    } finally {
      submit.disabled = false;
    }
  });
})();