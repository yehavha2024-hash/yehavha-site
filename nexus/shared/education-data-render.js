(()=>{
  const DATASET_IDS=['schoolinfo-disclosure','university-info-standard'];

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

  async function render(){
    const main=document.querySelector('main');
    if(!main||document.querySelector('[data-education-intelligence]'))return;

    try{
      await import('/shared/nexus-data-system.js?v=20260907');
      const ND=window.NexusData;
      if(!ND)return;
      const catalog=await ND.catalog();
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
    }catch(error){
      console.error('Education public data renderer failed:',error);
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});
  else render();
})();
