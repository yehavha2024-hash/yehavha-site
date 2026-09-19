(() => {
  'use strict';
  const body=document.body;
  const gateId=body.dataset.gate || '';
  const portalGrid=document.getElementById('gatePortalGrid');
  const clock=document.getElementById('gateClock');
  const count=document.getElementById('gateAccessCount');
  const searchToggle=document.getElementById('gateSearchToggle');
  const searchPanel=document.getElementById('gateSearchPanel');
  const searchInput=document.getElementById('gateSearchInput');
  const searchResults=document.getElementById('gateSearchResults');
  const TZ='Asia/Seoul';

  function updateClock(){
    if(!clock) return;
    const now=new Date();
    const d=new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
    const t=new Intl.DateTimeFormat('en-GB',{timeZone:TZ,hour:'2-digit',minute:'2-digit',hour12:false}).format(now);
    clock.textContent=`${d} · ${t} KST`;
  }
  updateClock(); setInterval(updateClock,30000);

  fetch('/api/access?op=get',{cache:'no-store',credentials:'same-origin'})
    .then(r=>r.ok?r.json():Promise.reject())
    .then(v=>{if(count&&v?.ok) count.textContent=`오늘 ${Number(v.today||0).toLocaleString('ko-KR')} | 누적 ${Number(v.count||0).toLocaleString('ko-KR')}`;})
    .catch(()=>{if(count) count.textContent='';});

  const make=(tag,cls,text)=>{const el=document.createElement(tag); if(cls) el.className=cls; if(text!==undefined) el.textContent=text; return el;};
  const trackedUrl=p=>`/go?${new URLSearchParams({to:p.url,id:p.id||''}).toString()}`;
  const isExternal=p=>typeof p.external==='boolean'?p.external:/youtube\.com|youtu\.be|pages\.dev|workers\.dev|upaper\.kr/i.test(p.url||'');
  function projectCard(project,category){
    const article=make('article','item-card');
    if(category.thumbnail){
      const a=make('a','project-thumbnail'); a.href=trackedUrl(project); a.target=isExternal(project)?'_blank':'_self'; if(a.target==='_blank') a.rel='noopener noreferrer';
      const img=make('img'); img.src='../'+category.thumbnail.replace(/^\.\//,''); img.alt=''; img.loading='lazy'; img.width=960; img.height=540;
      const cap=make('span','project-thumbnail-caption'); cap.append(make('span','project-thumbnail-label','YEHAVHA NEXUS'),make('strong','',category.title));
      a.append(img,cap); article.append(a);
    }
    const top=make('div','item-top'); top.append(make('span','item-meta',project.meta||'Project'));
    article.append(top,make('h3','',project.title),make('p','',project.description||''));
    const actions=make('div','item-actions'); const visit=make('a','visit-link',project.actionLabel||'바로가기');
    visit.href=trackedUrl(project); visit.target=isExternal(project)?'_blank':'_self'; if(visit.target==='_blank') visit.rel='noopener noreferrer';
    actions.append(visit); article.append(actions); return article;
  }
  function categoryBlock(category,projects){
    const section=make('section',`category-card category-${category.id} category-primary`);
    const head=make('div','category-head'); const icon=make('div','category-icon'); icon.textContent='◆'; icon.setAttribute('aria-hidden','true');
    const copy=make('div','category-copy'); const row=make('div','category-title-row');
    row.append(make('h2','',category.title),make('span','category-count',`${projects.length} PROJECT${projects.length>1?'S':''}`));
    copy.append(make('p','eyebrow',category.eyebrow||''),row,make('p','category-description',category.description||''));
    head.append(icon,copy);
    const grid=make('div',`items-grid${projects.length===1?' one-item':''}`); projects.forEach(p=>grid.append(projectCard(p,category)));
    section.append(head,grid); return section;
  }
  function render(data){
    const categories=(data.categories||[]).filter(c=>c.tier===gateId);
    const projects=data.projects||[];
    const byCat=new Map();
    projects.forEach(p=>{if(!byCat.has(p.category)) byCat.set(p.category,[]); byCat.get(p.category).push(p);});
    portalGrid.replaceChildren();
    categories.forEach(c=>{const ps=byCat.get(c.id)||[]; if(ps.length) portalGrid.append(categoryBlock(c,ps));});
    if(!portalGrid.childElementCount){
      const e=make('section','gate-empty'); e.append(make('h2','','등록된 프로젝트가 없습니다.'),make('p','','이 Gate에 연결된 프로젝트가 추가되면 이곳에 자동으로 표시됩니다.')); portalGrid.append(e);
    }
    if(searchInput){
      const all=projects.map(p=>({...p,categoryTitle:(data.categories||[]).find(c=>c.id===p.category)?.title||''}));
      searchInput.addEventListener('input',()=>{const q=searchInput.value.trim().toLocaleLowerCase('ko-KR'); searchResults.replaceChildren(); if(!q)return; all.filter(p=>[p.title,p.description,p.meta,p.categoryTitle].join(' ').toLocaleLowerCase('ko-KR').includes(q)).slice(0,10).forEach(p=>{const a=make('a','search-result'); a.href=trackedUrl(p); a.append(make('span','',p.title),make('span','search-result-arrow','→')); searchResults.append(a);});});
    }
  }
  searchToggle?.addEventListener('click',()=>{const open=searchPanel.hidden; searchPanel.hidden=!open; searchToggle.setAttribute('aria-expanded',String(open)); if(open) setTimeout(()=>searchInput?.focus(),0);});
  fetch('../projects.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error();return r.json();}).then(render).catch(()=>{portalGrid.innerHTML='<section class="gate-empty"><h2>프로젝트 정보를 불러오지 못했습니다.</h2><p>잠시 후 다시 확인해 주세요.</p></section>';});
})();