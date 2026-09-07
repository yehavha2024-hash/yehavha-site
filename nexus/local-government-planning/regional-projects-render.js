(()=>{
  const db=window.LOCAL_GOV_PROJECTS_2027;
  const host=document.getElementById('project-db');
  if(!db||!host)return;
  const css=document.createElement('style');
  css.textContent=`
  .local-detail-grid>div{min-width:0;overflow-wrap:anywhere;word-break:break-word}.local-detail-head>*{min-width:0;overflow-wrap:anywhere}
  #proposal .section-sub{margin:5px 0 3px}#proposal .ops-kv{gap:3px;margin-top:3px}#proposal .ops-kv span{padding:3px 5px}#proposal .ops-kv b{display:inline-block!important;margin:0 6px 0 0!important}#proposal .reject-grid{gap:3px;margin-top:3px}#proposal .reject-grid span{padding:3px 5px}#proposal .ops-note{margin-top:4px;padding:5px 7px}#annual{padding-top:10px;padding-bottom:10px}#annual .section-head{margin-bottom:5px}#annual .grid-4{gap:4px}#annual .card{padding:6px 7px}#annual .card strong{margin-bottom:2px}#annual .card p{line-height:1.35}
  .project-db-head{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;margin-bottom:6px}.project-db-head div{padding:6px 7px;border:1px solid #dfe3e8;border-radius:7px}.project-db-head span{display:block;font-size:.6rem;color:#667085;font-weight:800}.project-db-head strong{display:block;margin-top:1px;font-size:.82rem}.project-region-list{display:grid;gap:5px}.project-region{border:1px solid #d9dee5;border-radius:9px;overflow:hidden;background:#fff}.project-region summary{cursor:pointer;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;padding:7px 8px;font-size:.72rem;font-weight:900;list-style:none}.project-region summary::-webkit-details-marker{display:none}.project-region summary small{font-size:.59rem;color:#667085;text-align:right}.project-region[open] summary{background:#f7f8fa;border-bottom:1px solid #e4e7eb}.project-region-body{padding:5px}.project-buttons{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:4px}.project-btn{padding:6px 5px;border:1px solid #e1e4e8;border-radius:7px;background:#fff;text-align:left;cursor:pointer;font-size:.62rem;font-weight:850;line-height:1.25}.project-btn small{display:block;margin-top:2px;font-size:.56rem;font-weight:700;color:#667085}.project-btn:hover,.project-btn:focus,.project-btn.active{border-color:#68778a;background:#f2f5f8}.project-badge{display:inline-block;margin-right:3px;padding:1px 4px;border:1px solid #cbd2da;border-radius:999px;font-size:.53rem;line-height:1.25}.project-detail{display:none;margin-top:5px;padding:6px;border:1px solid #dce1e7;border-radius:8px;background:#f7f8fa}.project-detail.show{display:block}.project-detail h3{margin:0 0 4px;font-size:.76rem}.project-detail-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px}.project-detail-grid div{padding:5px 6px;border:1px solid #e1e4e8;border-radius:7px;background:#fff;font-size:.61rem;line-height:1.35}.project-detail-grid b{display:block;margin-bottom:2px;font-size:.63rem}.project-interview{margin-top:4px;padding:6px 7px;border-left:3px solid #222;background:#fff;font-size:.63rem;line-height:1.4}.project-source{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-top:4px;font-size:.58rem;color:#667085}.project-source a{color:#111;font-weight:800}.project-region-note{margin:0 0 5px;padding:5px 6px;background:#fafafa;border:1px solid #eceff2;border-radius:6px;font-size:.58rem;line-height:1.35;color:#5b6573}
  @media(max-width:900px){.project-buttons{grid-template-columns:repeat(4,minmax(0,1fr))}.project-detail-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
  @media(max-width:620px){.project-db-head{grid-template-columns:repeat(4,minmax(0,1fr))}.project-db-head div{padding:5px}.project-db-head strong{font-size:.7rem}.project-buttons{grid-template-columns:repeat(3,minmax(0,1fr))}.project-detail-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.project-region summary{padding:6px;font-size:.67rem}}
  `;
  document.head.append(css);
  const aCount=db.regions.flatMap(r=>r.projects).filter(p=>p.grade==='A').length;
  const bCount=db.regions.flatMap(r=>r.projects).filter(p=>p.grade==='B').length;
  host.innerHTML=`<div class="section-head"><p class="eyebrow">06 · REGIONAL CORE PROJECTS</p><h2>지역 핵심 프로젝트 DB</h2><p>2027 예산과 중장기성이 있는 핵심 프로젝트를 지역·인물·예산·취재 포인트로 연결합니다. 같은 사업이 여러 시군구에 걸리면 하나의 프로젝트에 관련 지역만 연결합니다.</p></div><div class="project-db-head"><div><span>분석 권역</span><strong>${db.meta.scope.replace('개 사업분석 권역','')}</strong></div><div><span>핵심 프로젝트</span><strong>${db.meta.projectCount}개</strong></div><div><span>A 핵심추적</span><strong>${aCount}개</strong></div><div><span>B 연차추적</span><strong>${bCount}개</strong></div></div><div class="project-region-list" id="regionalProjectList"></div>`;
  const list=host.querySelector('#regionalProjectList');
  db.regions.forEach((region,idx)=>{
    const details=document.createElement('details');details.className='project-region';if(idx===0)details.open=true;
    const summary=document.createElement('summary');summary.innerHTML=`<strong>${region.region}</strong><small>${region.leader} · ${region.projects.length}개 핵심사업</small>`;
    const body=document.createElement('div');body.className='project-region-body';
    if(region.note){const note=document.createElement('p');note.className='project-region-note';note.textContent=region.note;body.append(note)}
    const buttons=document.createElement('div');buttons.className='project-buttons';
    const detail=document.createElement('div');detail.className='project-detail';
    region.projects.forEach(project=>{
      const btn=document.createElement('button');btn.type='button';btn.className='project-btn';btn.innerHTML=`<span class="project-badge">${project.grade}</span>${project.title}<small>${project.category} · ${project.period}</small>`;
      btn.addEventListener('click',()=>{
        buttons.querySelectorAll('.project-btn').forEach(x=>x.classList.remove('active'));btn.classList.add('active');detail.className='project-detail show';
        detail.innerHTML=`<h3>${region.region} · ${project.title}</h3><div class="project-detail-grid"><div><b>관련 인물</b>${project.people}</div><div><b>관련 지역</b>${project.areas.join(' · ')}</div><div><b>2027 예산상태</b>${project.budget2027}</div><div><b>기간·분야</b>${project.period} · ${project.category}</div></div><div class="project-interview"><b>취재 포인트</b><br>${project.interview}</div><div class="project-source"><span>기준 ${db.meta.updated}</span><a href="${project.sourceUrl}" target="_blank" rel="noopener">최근 근거 · ${project.sourceTitle}</a></div>`;
      });
      buttons.append(btn);
    });
    body.append(buttons,detail);details.append(summary,body);list.append(details);
  });
  document.getElementById('rules')?.remove();
})();

(async()=>{
  const anchor=document.getElementById('project-db');
  if(!anchor||document.getElementById('g2b-live'))return;

  const section=document.createElement('section');
  section.className='section';
  section.id='g2b-live';
  anchor.insertAdjacentElement('afterend',section);

  try{
    await import('/shared/nexus-data-system.js?v=20260907');
    const ND=window.NexusData;
    if(!ND)throw new Error('NexusData unavailable');

    const head=document.createElement('div');head.className='section-head';
    const eyebrow=document.createElement('p');eyebrow.className='eyebrow';eyebrow.textContent='LIVE DATA · LOCAL FINANCE → G2B';
    const title=ND.bilingualTitle('지방재정365 → 나라장터 사업 흐름','Local Finance → G2B Procurement Flow','h2');
    const meta=document.createElement('p');meta.textContent='예산·세출 → 입찰 → 계약을 하나의 공통 데이터 규격으로 연결합니다.';
    head.append(eyebrow,title,meta);

    const stages=document.createElement('div');stages.className='grid-3';
    const dataHost=document.createElement('div');
    const insightHost=document.createElement('div');
    section.append(head,stages,dataHost,insightHost);

    const stage=(ko,en,text)=>{
      const card=document.createElement('div');card.className='live-card';
      card.append(ND.bilingualTitle(ko,en,'h3'));
      const p=document.createElement('p');p.textContent=text;card.append(p);return card;
    };

    stages.append(
      stage('1 · 예산·세출','Budget & Expenditure','지방재정365 어댑터 등록 상태를 확인하고 있습니다.'),
      stage('2 · 입찰','Public Bids','나라장터 최근 용역 입찰을 조회하고 있습니다.'),
      stage('3 · 계약','Contracts','나라장터 최근 용역 계약을 조회하고 있습니다.')
    );

    const kstYmd=(offsetDays=0)=>{
      const date=new Date(Date.now()+offsetDays*86400000);
      const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
      const get=type=>parts.find(part=>part.type===type)?.value||'';
      return `${get('year')}${get('month')}${get('day')}`;
    };
    const from=kstYmd(-7)+'0000';
    const to=kstYmd()+'2359';
    const [catalogResult,bidResult,contractResult]=await Promise.allSettled([
      ND.catalog(),
      ND.query('g2b-bid-service',{inqryDiv:'1',inqryBgnDt:from,inqryEndDt:to,numOfRows:'8'}),
      ND.query('g2b-contract-service',{inqryDiv:'1',inqryBgnDt:from,inqryEndDt:to,numOfRows:'8'})
    ]);

    const finance=catalogResult.status==='fulfilled'?catalogResult.value.providerCatalog?.find(x=>x.id==='local-finance-365'):null;
    const bid=bidResult.status==='fulfilled'?bidResult.value:null;
    const contract=contractResult.status==='fulfilled'?contractResult.value:null;
    const stageCards=stages.children;
    stageCards[0].querySelector('p').textContent=finance?.activation?.state==='requires-provider-setup'
      ?'공통 소유 레지스트리에 등록 완료 · 제공기관 인증 활성화 후 세출자료가 이 흐름에 자동 합류합니다.'
      :'지방재정365 연결 상태를 확인하지 못했습니다.';
    stageCards[1].querySelector('p').textContent=bid?`최근 7일 입찰 ${bid.records?.length||0}건 · ${bid.cache?.status||'LIVE'}`:'나라장터 입찰 응답을 확인하지 못했습니다.';
    stageCards[2].querySelector('p').textContent=contract?`최근 7일 계약 ${contract.records?.length||0}건 · ${contract.cache?.status||'LIVE'}`:'나라장터 계약 응답을 확인하지 못했습니다.';

    const rows=[...(bid?.records||[]).slice(0,4),...(contract?.records||[]).slice(0,4)];
    ND.renderGrid(dataHost,rows,{columns:2,emptyText:'현재 표시할 나라장터 실시간 자료가 없습니다.'});

    for(const payload of [bid,contract]){
      if(!payload?.intelligence)continue;
      const block=document.createElement('div');
      block.append(ND.bilingualTitle(payload.sourceInfo?.title||'공공데이터 분석',payload.sourceInfo?.titleEn||'Public Data Intelligence','h3'));
      const body=document.createElement('div');ND.renderIntelligence(body,payload.intelligence);block.append(body);insightHost.append(block);
    }
    meta.textContent=`최근 7일 입찰 ${(bid?.records||[]).length}건 · 계약 ${(contract?.records||[]).length}건 · 동일 스키마로 정규화해 표시합니다.`;
  }catch(error){
    console.error('Local government public data flow failed:',error);
    section.innerHTML='<div class="section-head"><p class="eyebrow">LIVE DATA · LOCAL FINANCE → G2B</p><h2>지방재정·나라장터 데이터 흐름</h2><p>공통 데이터 계층의 실시간 응답을 확인하지 못했습니다. 기존 지역사업 DB는 그대로 유지됩니다.</p></div>';
  }
})();
