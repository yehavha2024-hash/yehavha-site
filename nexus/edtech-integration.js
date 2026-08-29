(()=>{
  'use strict';
  const CATEGORY_ID='edtechresearch';
  const icon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h9a3 3 0 0 1 3 3v10H7a3 3 0 0 0-3 3v-16Z"/><path d="M16 8.5h4v9h-4M8 10h4M8 13h5"/></svg>';
  let installing=false;
  const make=(tag,className,text)=>{const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;};
  const trackedUrl=project=>`/go?${new URLSearchParams({to:project.url,id:project.id}).toString()}`;
  function installQuickLink(category,count){
    const host=document.getElementById('quickLinks');
    if(!host||host.querySelector(`[data-category="${CATEGORY_ID}"]`))return;
    const link=make('a',`quick-link quick-link-${CATEGORY_ID}`);
    link.href=`#${CATEGORY_ID}`;link.dataset.category=CATEGORY_ID;
    const i=make('span','quick-icon');i.innerHTML=icon;i.setAttribute('aria-hidden','true');
    link.append(i,make('span','quick-label',category.title),make('span','quick-count',String(count)));
    const university=host.querySelector('[data-category="university"]');
    if(university)university.insertAdjacentElement('afterend',link);else host.append(link);
  }
  function buildCategory(category,projects){
    const section=make('section',`category-card category-${CATEGORY_ID} category-primary`);section.id=CATEGORY_ID;section.dataset.category=CATEGORY_ID;section.setAttribute('aria-labelledby',`${CATEGORY_ID}-title`);
    const head=make('div','category-head');const iconWrap=make('div','category-icon research-icon');iconWrap.innerHTML=icon;iconWrap.setAttribute('aria-hidden','true');
    const copy=make('div','category-copy');const titleRow=make('div','category-title-row');const title=make('h2','',category.title);title.id=`${CATEGORY_ID}-title`;titleRow.append(title,make('span','category-count',`${projects.length} PROJECT${projects.length>1?'S':''}`));copy.append(make('p','eyebrow',category.eyebrow),titleRow,make('p','category-description',category.description));head.append(iconWrap,copy);
    const grid=make('div',`items-grid${projects.length===1?' one-item':''}`);
    projects.forEach(project=>{const article=make('article','item-card');const top=make('div','item-top');top.append(make('span','item-meta',project.meta||'Project'),make('span','maturity-chip maturity-research','전문 연구'));const actions=make('div','item-actions');const visit=make('a','visit-link');visit.href=trackedUrl(project);visit.dataset.trackAccess='project';visit.append(`${project.actionLabel||'바로가기'} `,make('span','','→'));const copyBtn=make('button','copy-btn','링크 복사');copyBtn.type='button';copyBtn.dataset.url=project.url;copyBtn.dataset.projectId=project.id;actions.append(visit,copyBtn);article.append(top,make('h3','',project.title),make('p','',project.description),actions);grid.append(article);});
    section.append(head,grid);return section;
  }
  async function install(){
    const knowledgeGrid=document.querySelector('.portal-tier-knowledge .portal-tier-grid');
    if(!knowledgeGrid||document.getElementById(CATEGORY_ID)||installing)return false;
    installing=true;
    try{
      const response=await fetch('./projects.json',{cache:'no-store'});if(!response.ok)return false;const data=await response.json();
      const category=(data.categories||[]).find(item=>item.id===CATEGORY_ID);const projects=(data.projects||[]).filter(item=>item.category===CATEGORY_ID);
      if(!category||!projects.length||document.getElementById(CATEGORY_ID))return false;
      knowledgeGrid.insertBefore(buildCategory(category,projects),knowledgeGrid.firstChild);
      installQuickLink(category,projects.length);
      return true;
    }catch{return false;}finally{installing=false;}
  }
  const portal=document.getElementById('portalGrid');
  if(portal){const observer=new MutationObserver(()=>{void install();});observer.observe(portal,{childList:true,subtree:true});}
  window.addEventListener('load',()=>{void install();});
  void install();
})();