(()=>{
  const db=window.LOCAL_GOV_PROJECTS_2027;
  const host=document.getElementById('project-db');
  if(!db||!host)return;
  const css=document.createElement('style');
  css.textContent=`
  .local-detail-grid>div{min-width:0;overflow-wrap:anywhere;word-break:break-word}.local-detail-head>*{min-width:0;overflow-wrap:anywhere}
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
