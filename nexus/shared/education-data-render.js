(()=>{
  const DATASET_IDS=['schoolinfo-disclosure','university-info-standard'];

  const EDTECH_SOURCE_GROUPS=[
    {
      title:'정책·공공 핵심',
      en:'Policy & Public Core',
      priority:'S',
      count:4,
      mode:'보도자료 · 사업공고 · 연구자료 · 공공 API',
      sources:'교육부 · 한국교육학술정보원(KERIS) · 정보통신산업진흥원(NIPA) · 국가평생교육진흥원'
    },
    {
      title:'산업·시장·교육데이터',
      en:'Industry, Market & Education Data',
      priority:'S',
      count:3,
      mode:'기업지원 · 콘테스트 · 산업동향 · 교육데이터 거버넌스',
      sources:'한국에듀테크산업협회 · 한국디지털교육협회 · DX교육데이터협회'
    },
    {
      title:'연구·학술',
      en:'Research & Academic Societies',
      priority:'A',
      count:5,
      mode:'학술대회 · 논문모집 · 연구공모 · 세미나',
      sources:'한국교육공학회 · 한국인공지능교육학회 · 한국컴퓨터교육학회 · 에듀테크학회 · 스마트교육학회'
    },
    {
      title:'고등·평생·직업교육',
      en:'Higher, Lifelong & Vocational Education',
      priority:'A',
      count:2,
      mode:'원격교육 · 평생학습 · 직업교육 · 대학혁신',
      sources:'한국원격대학협의회 · 한국전문대학교육협의회'
    },
    {
      title:'지역 교육정책·학교 현장',
      en:'Regional Education Offices & School Practice',
      priority:'A',
      count:16,
      mode:'보도자료 · 공고 · 교원연수 · 학교 실증 · 지역 AI교육',
      sources:'서울 · 부산 · 대구 · 인천 · 대전 · 울산 · 세종 · 경기 · 강원 · 충북 · 충남 · 전북 · 전남광주통합 · 경북 · 경남 · 제주 교육청'
    }
  ];

  const EDTECH_TRENDS=[
    {
      organization:'교육부',
      date:'2026-09-01',
      status:'현장 인력',
      category:'AI·디지털 교육',
      title:{ko:'전국 디지털튜터 양성센터 교육생 1,700명 모집',en:'National Digital Tutor Training Recruitment'},
      summary:'전국 6개 권역에서 신규 1,200명과 재교육 500명을 모집합니다. NEXUS에서는 교원 지원인력, 디지털 격차 해소, 학교 현장 AI 활용 역량의 확산 지표로 추적합니다.',
      original_url:'https://www.korea.kr/briefing/pressReleaseView.do?newsId=156776367'
    },
    {
      organization:'한국컴퓨터교육학회',
      date:'2026-09-03',
      status:'모집',
      category:'교원 역량',
      title:{ko:'한국형 AI 기반 교사개발자 양성과정 3기 모집',en:'Korean AI-based Teacher-Developer Program'},
      summary:'AI 기반 수업을 직접 설계·개발할 수 있는 교사 전문성 강화 흐름입니다. 교수설계와 현장실증 영역에서 교사-개발자 모델을 관찰합니다.',
      original_url:'https://kace.re.kr/'
    },
    {
      organization:'한국교육학술정보원(KERIS)',
      date:'2026-08-27',
      status:'연구공모',
      category:'Responsible AI',
      title:{ko:'교사용 AI 활용 교육 가이드 개발 연구 공모',en:'Teacher AI-use Education Guide Research'},
      summary:'법·제도, 윤리원칙, 시도교육청 가이드라인을 종합해 공통원칙·교육활동별 활용기준·체크리스트·FAQ를 개발하는 연구입니다. Responsible AI와 교수설계의 직접 연결점입니다.',
      original_url:'https://www.keris.or.kr/'
    },
    {
      organization:'국가평생교육진흥원',
      date:'2026-08-10',
      status:'협력',
      category:'평생교육',
      title:{ko:'네이버와 전 국민 AI·디지털 평생교육 활성화 협력',en:'Nationwide AI & Digital Lifelong Learning Partnership'},
      summary:'성인 문해교육과 AI·플랫폼 기술을 결합해 디지털 문해력과 평생교육 기회를 확대하는 흐름입니다. 성인학습자 AI Tutor 연구와 직접 연결합니다.',
      original_url:'https://www.nile.or.kr/usr/wap/detail.do?app=11762&seq=2190155'
    },
    {
      organization:'DX교육데이터협회',
      date:'2026-08-10',
      status:'동향',
      category:'교육데이터·AI Agent',
      title:{ko:'AI 교육의 중심이 수업·평가·학습데이터로 이동',en:'AI Education Shifts to Teaching, Assessment & Learning Data'},
      summary:'교원 역량, 학생 맞춤지원, 데이터 기반 수업설계, 생성형 AI, AI Agent, AI 기반 평가·피드백이 핵심 키워드로 부상했습니다. 학습분석과 AI 에이전트 연구 우선순위에 반영합니다.',
      original_url:'https://www.dx-data.or.kr/board/boardView.do?bbsId=BBSMSTR_000000000018&nttId=452'
    },
    {
      organization:'에듀테크 코리아 페어',
      date:'2026-09-17',
      status:'예정',
      category:'산업·현장',
      title:{ko:'2026 에듀테크 코리아 페어 9월 17~19일 개최',en:'EdTech Korea Fair 2026'},
      summary:'AI 코스웨어·평가, SW·코딩·로봇, 평생교육, 교육정책과 약 300개 기업·기관이 한자리에 모이는 핵심 산업·현장 관측 지점입니다. 참가기업과 발표자료를 후속 정보원으로 편입합니다.',
      original_url:'https://www.edtechkorea.or.kr/'
    }
  ];

  function element(tag,className,text){
    const node=document.createElement(tag);
    if(className)node.className=className;
    if(text!==undefined)node.textContent=text;
    return node;
  }

  function statusLabel(entry,active){
    if(active?.credentialConfigured)return 'LIVE READY';
    const state=entry?.activation?.state||'registered';
    if(state==='requires-endpoint-activation')return 'ADAPTER REGISTERED';
    if(state==='requires-provider-setup')return 'PROVIDER SETUP';
    return 'REGISTERED';
  }

  function statusText(entry,active){
    if(active?.credentialConfigured)return '공통 어댑터·인증이 활성화된 소스입니다.';
    return entry?.activation?.reason||'공통 데이터 레지스트리에 등록되어 있으며 제공기관 활성화 후 같은 화면에서 자동 연결됩니다.';
  }

  function sourceCard(group){
    const card=element('article','nexus-data-card');
    const title=element('h3','nexus-data-title');
    title.append(element('span','nexus-title-ko',group.title),element('span','nexus-title-en',group.en));
    card.append(title);
    card.append(element('p','nexus-data-meta',`PRIORITY ${group.priority} · ${group.count}개 정보원 · ${group.mode}`));
    card.append(element('p','nexus-data-summary',group.sources));
    return card;
  }

  function renderSourceSection(main,ND){
    if(document.querySelector('[data-edtech-source-watch]'))return;
    const section=element('section','section');
    section.dataset.edtechSourceWatch='true';
    const container=element('div','container');
    const head=element('div','section-head');
    head.append(element('p','eyebrow','NEXUS EDTECH SOURCE WATCH · 30 SOURCES'));
    head.append(ND.bilingualTitle('에듀테크 정보원 기관','EdTech Intelligence Sources','h2'));
    head.append(element('p','', '정책·공공, 산업·시장, 연구·학술, 고등·평생교육, 지역교육청을 합쳐 30개 핵심 정보원을 추적합니다. 공식 API·RSS가 확인되는 경우 이를 우선하고, 그 밖의 기관은 공식 게시판의 목록·메타데이터를 중심으로 수집합니다.'));

    const grid=element('div','nexus-data-grid nexus-data-grid--2');
    for(const group of EDTECH_SOURCE_GROUPS)grid.append(sourceCard(group));

    const flow=element('div','nexus-intelligence-card');
    for(const [label,text] of [
      ['SOURCE','30개 핵심 기관'],
      ['INGEST','공식 API·RSS 우선 · HTML 보완'],
      ['FILTER','AI · EdTech · 데이터 · 교원 · 실증'],
      ['OUTPUT','정책 · 공고 · 연구 · 현장 동향']
    ]){
      const cell=element('div','nexus-intelligence-cell');
      cell.append(element('strong','',label),element('p','',text));
      flow.append(cell);
    }

    const note=element('p','nexus-data-meta','수집 원칙: 공식 원문 우선 · 중복 제거 · 날짜/기관/유형 기준 정규화 · 크롤링은 공개 목록과 메타데이터 중심 · 이용약관 및 robots 정책 준수');
    container.append(head,grid,flow,note);
    section.append(container);
    main.append(section);
  }

  function renderTrendSection(main,ND){
    if(document.querySelector('[data-edtech-trends]'))return;
    const section=element('section','section');
    section.dataset.edtechTrends='true';
    const container=element('div','container');
    const head=element('div','section-head');
    head.append(element('p','eyebrow','CURRENT SIGNALS · 2026.09'));
    head.append(ND.bilingualTitle('정보원 기관 주요 동향','Key Institutional Trends','h2'));
    head.append(element('p','', '최근 확인된 AI·에듀테크 정책, 교원역량, 평생교육, 교육데이터, 연구공모와 산업행사를 연구 트리와 연결해 정리합니다.'));

    const grid=element('div','nexus-data-grid nexus-data-grid--2');
    for(const trend of EDTECH_TRENDS)grid.append(ND.recordCard(trend,{linkLabel:'공식·원문 확인 ↗'}));

    const flow=element('div','nexus-intelligence-card');
    for(const [label,text] of [
      ['POLICY','AI 교과 · 디지털튜터 · 현장 적용'],
      ['RESEARCH','교사용 AI 가이드 · 학술 연구'],
      ['DATA','학습데이터 · AI Agent · 평가·피드백'],
      ['MARKET','에듀테크 페어 · 기업·서비스 실증']
    ]){
      const cell=element('div','nexus-intelligence-cell');
      cell.append(element('strong','',label),element('p','',text));
      flow.append(cell);
    }
    container.append(head,grid,flow);
    section.append(container);
    main.append(section);
  }

  async function render(){
    const main=document.querySelector('main');
    if(!main||document.querySelector('[data-education-intelligence]'))return;

    try{
      await import('/shared/nexus-data-system.js?v=20260907');
      const ND=window.NexusData;
      if(!ND)return;

      let catalog=null;
      try{catalog=await ND.catalog();}catch(error){console.error('Education public-data catalog failed:',error);}

      if(catalog){
        const providerCatalog=catalog.providerCatalog||[];
        const sources=catalog.sources||[];

        const section=element('section','section');
        section.dataset.educationIntelligence='true';
        const container=element('div','container');
        const head=element('div','section-head');
        const eyebrow=element('p','eyebrow','EDUCATION PUBLIC DATA · COMMON LAYER');
        head.append(eyebrow,ND.bilingualTitle('교육 공공데이터 연결','Education Public Data Intelligence','h2'));
        head.append(element('p','', '학교·대학 공시정보를 NEXUS 공통 스키마로 정규화해 N-UNIVERSITY와 에듀테크 연구가 같은 원천데이터를 사용하도록 연결합니다.'));

        const grid=element('div','nexus-data-grid nexus-data-grid--2');
        for(const id of DATASET_IDS){
          const entry=providerCatalog.find(item=>item.id===id);
          const active=sources.find(item=>item.id===id);
          if(!entry&&!active)continue;
          const info=entry||active;
          const card=element('article','nexus-data-card');
          card.append(ND.bilingualTitle(info.title||id,info.titleEn||'', 'h3'));
          card.append(element('p','nexus-data-meta',`${info.provider||'공공데이터'} · ${statusLabel(entry,active)}`));
          card.append(element('p','nexus-data-summary',statusText(entry,active)));
          if(info.datasetId)card.append(element('p','nexus-data-meta',`DATASET ${info.datasetId}`));
          grid.append(card);
        }

        const flow=element('div','nexus-intelligence-card');
        const steps=[
          ['SOURCE','학교알리미 · 대학정보'],
          ['NORMALIZE','기관 · 지역 · 기준일 · 상태 · 지표'],
          ['ANALYZE','교육여건 · 재정 · 기관 특성 · 변화'],
          ['USE','N-UNIVERSITY · EdTech Research']
        ];
        for(const [label,text] of steps){
          const cell=element('div','nexus-intelligence-cell');
          cell.append(element('strong','',label),element('p','',text));
          flow.append(cell);
        }

        const note=element('p','nexus-data-meta',catalog.knowledgeStore?.configured
          ?'교육 데이터도 NEXUS_KNOWLEDGE 스냅샷 계층을 사용할 수 있습니다.'
          :'현재 영속 스냅샷 저장소는 미연결 상태입니다. API 조회·정규화 구조와 화면 규격은 먼저 공유됩니다.');
        container.append(head,grid,flow,note);
        section.append(container);
        main.append(section);
      }

      renderSourceSection(main,ND);
      renderTrendSection(main,ND);
    }catch(error){
      console.error('Education public data renderer failed:',error);
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});
  else render();
})();
