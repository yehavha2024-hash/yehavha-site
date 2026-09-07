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

(()=>{
  const anchor=document.getElementById('project-db');
  if(!anchor||document.getElementById('g2b-live'))return;

  const section=document.createElement('section');
  section.className='section';
  section.id='g2b-live';
  section.innerHTML='<div class="section-head"><p class="eyebrow">LIVE DATA · G2B</p><h2>나라장터 용역 입찰·계약</h2><p id="g2b-live-meta">조달청 공공 API에서 최근 용역 입찰공고와 계약현황을 불러오는 중입니다.</p></div><div class="grid-2" id="g2b-live-grid"><div class="live-card"><h3>실시간 데이터 확인 중</h3><p>공공데이터 응답을 기다리고 있습니다.</p></div></div>';
  anchor.insertAdjacentElement('afterend',section);

  const host=section.querySelector('#g2b-live-grid');
  const meta=section.querySelector('#g2b-live-meta');
  const el=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node};
  const pick=(record,keys)=>{for(const key of keys){const value=record?.[key];if(value!==undefined&&value!==null&&String(value).trim())return String(value).trim()}return''};

  function kstYmd(offsetDays=0){
    const date=new Date(Date.now()+offsetDays*86400000);
    const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
    const get=type=>parts.find(part=>part.type===type)?.value||'';
    return `${get('year')}${get('month')}${get('day')}`;
  }

  async function loadPublicData(source,params){
    const url=new URL('/api/public-data',location.origin);
    url.searchParams.set('source',source);
    Object.entries(params).forEach(([key,value])=>url.searchParams.set(key,value));
    const response=await fetch(url,{cache:'no-store'});
    const payload=await response.json();
    if(!response.ok||!payload.ok||payload.upstreamStatus!==200)throw new Error(`${source}: ${response.status}`);
    return payload.data;
  }

  function items(data){
    const value=data?.response?.body?.items;
    if(Array.isArray(value))return value;
    if(Array.isArray(value?.item))return value.item;
    if(value?.item)return [value.item];
    return [];
  }

  function liveCard(kind,record){
    const card=el('div','live-card');
    const path=el('div','path',kind==='입찰'?'조달청 나라장터 → 용역 입찰공고':'조달청 나라장터 → 용역 계약현황');
    const title=kind==='입찰'
      ?pick(record,['bidNtceNm','bidNtceName','ntceNm'])
      :pick(record,['cntrctNm','contractNm','cntrctName']);
    const h3=el('h3','',title||`${kind} 정보`);
    const org=kind==='입찰'
      ?pick(record,['ntceInsttNm','dminsttNm','orderInsttNm'])
      :pick(record,['cntrctInsttNm','dminsttNm','orderInsttNm']);
    const date=kind==='입찰'
      ?pick(record,['bidNtceDt','bidClseDt','opengDt'])
      :pick(record,['cntrctCnclsDate','cntrctDt','contractDate']);
    const number=kind==='입찰'?pick(record,['bidNtceNo']):pick(record,['cntrctNo','bidNtceNo']);
    const amount=kind==='계약'?pick(record,['totCntrctAmt','cntrctAmt','contractAmt']):'';
    const p=el('p','',[org,date].filter(Boolean).join(' · ')||'기관·일정 정보 확인 중');
    const facts=el('div','facts');
    if(number)facts.append(el('span','',`${kind}번호 ${number}`));
    if(amount)facts.append(el('span','',`계약금액 ${amount}`));
    if(!facts.childElementCount)facts.append(el('span','','나라장터 공공 API 실시간 자료'));
    card.append(path,h3,p,facts);
    return card;
  }

  async function load(){
    const from=kstYmd(-7)+'0000';
    const to=kstYmd()+'2359';
    const settled=await Promise.allSettled([
      loadPublicData('g2b-bid-service',{inqryDiv:'1',inqryBgnDt:from,inqryEndDt:to,numOfRows:'6'}),
      loadPublicData('g2b-contract-service',{inqryDiv:'1',inqryBgnDt:from,inqryEndDt:to,numOfRows:'6'})
    ]);
    host.replaceChildren();
    let count=0;
    if(settled[0].status==='fulfilled')for(const record of items(settled[0].value).slice(0,4)){host.append(liveCard('입찰',record));count++}
    if(settled[1].status==='fulfilled')for(const record of items(settled[1].value).slice(0,4)){host.append(liveCard('계약',record));count++}
    if(!count){const card=el('div','live-card');card.append(el('h3','','나라장터 데이터를 불러오지 못했습니다.'),el('p','','기존 사업기획 DB는 그대로 사용할 수 있으며 공공 API는 다음 접속 때 다시 조회합니다.'));host.append(card)}
    meta.textContent=count?`최근 7일 용역 입찰·계약 ${count}건 표시 · 페이지를 열 때 최신 공공데이터를 다시 조회합니다.`:'나라장터 실시간 응답을 확인하지 못했습니다.';
  }

  load().catch(error=>{console.error('G2B live data load failed:',error);meta.textContent='나라장터 실시간 응답을 확인하지 못했습니다.'});
})();
