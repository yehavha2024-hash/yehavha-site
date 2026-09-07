(()=>{
  async function run(){
    const section=document.getElementById('legislation-tracker');
    const anchor=section?.querySelector('.watch-wrap');
    const ND=window.NexusData;
    if(!section||!anchor||!ND||section.querySelector('[data-nexus-assembly]'))return;

    const host=document.createElement('div');
    host.dataset.nexusAssembly='true';
    host.className='watch-wrap';
    const head=document.createElement('div');head.className='tracker-head';
    const label=document.createElement('span');label.textContent='LIVE PUBLIC DATA · NATIONAL ASSEMBLY';
    head.append(label,ND.bilingualTitle('국회 의안 실시간 연결','National Assembly Bill Intelligence','h3'));
    const note=document.createElement('p');note.textContent='국회 의안 API를 NEXUS 공통 데이터 스키마로 정규화해 법률·입법 흐름에 연결합니다.';
    const grid=document.createElement('div');
    const intelligence=document.createElement('div');
    host.append(head,note,grid,intelligence);
    anchor.insertAdjacentElement('afterend',host);

    const query=new URLSearchParams(location.search).get('q')?.trim()||'인공지능';
    try{
      const payload=await ND.query('assembly-bill-search',{AGE:'22',BILL_NAME:query,pSize:'8'});
      ND.renderGrid(grid,(payload.records||[]).slice(0,8),{columns:2,emptyText:'현재 검색어에 해당하는 국회 의안이 없습니다.',linkLabel:'국회 원문 ↗'});
      if(payload.intelligence)ND.renderIntelligence(intelligence,payload.intelligence);
      note.textContent=`검색어 ${query} · 국회 의안 ${(payload.records||[]).length}건 · ${payload.cache?.status||'LIVE'} · 동일 법안은 식별자를 기준으로 갱신합니다.`;
    }catch(error){
      console.error('National Assembly public data load failed:',error);
      const state=error?.payload?.error==='credential_missing'
        ?'국회 제공기관 인증이 아직 활성화되지 않았습니다. 공통 레지스트리와 화면 연결은 완료되어 인증값이 연결되면 같은 위치에서 자동 조회됩니다.'
        :'국회 의안 API 응답을 확인하지 못했습니다. 기존 NEXUS 입법 자료는 그대로 유지됩니다.';
      ND.renderGrid(grid,[],{columns:2,emptyText:state});
      note.textContent='국회 의안 데이터 연결 상태';
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});
  else run();
})();
