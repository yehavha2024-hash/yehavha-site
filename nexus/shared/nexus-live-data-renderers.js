(()=>{
  if (window.NexusLiveData) return;

  const el=(tag,className,text)=>{
    const node=document.createElement(tag);
    if(className)node.className=className;
    if(text!==undefined&&text!==null)node.textContent=String(text);
    return node;
  };

  async function dataSystem(){
    if(!window.NexusData)await import('/shared/nexus-data-system.js?v=20260907');
    if(!window.NexusData)throw new Error('NexusData unavailable');
    return window.NexusData;
  }

  function sourceRecord(payload,predicate){
    const rows=Array.isArray(payload?.records)?payload.records:[];
    return rows.find(predicate)||rows[0]||null;
  }

  function metadata(record,key){
    const value=record?.metadata?.[key];
    return value===undefined||value===null?'':String(value).trim();
  }

  function weatherLabel(code,value){
    const raw=String(value||'');
    if(code==='TMP')return raw?`기온 ${raw}℃`:'';
    if(code==='SKY')return ({'1':'맑음','3':'구름많음','4':'흐림'})[raw]||'';
    if(code==='PTY')return ({'0':'강수 없음','1':'비','2':'비/눈','3':'눈','4':'소나기'})[raw]||'';
    if(code==='POP')return raw?`강수확률 ${raw}%`:'';
    if(code==='REH')return raw?`습도 ${raw}%`:'';
    return '';
  }

  function airGrade(value){
    return ({'1':'좋음','2':'보통','3':'나쁨','4':'매우 나쁨'})[String(value||'')]||'';
  }

  function briefingBox(title,text){
    const box=el('div');
    box.append(el('strong','',title),el('span','',text));
    return box;
  }

  function weatherSummary(payload){
    const rows=Array.isArray(payload?.records)?payload.records:[];
    if(!rows.length)return '최신 예보값 확인 중';
    const times=rows.map(row=>`${metadata(row,'fcstDate')}${metadata(row,'fcstTime')}`).filter(Boolean).sort();
    const first=times[0]||'';
    const group=first?rows.filter(row=>`${metadata(row,'fcstDate')}${metadata(row,'fcstTime')}`===first):rows;
    const values=new Map();
    for(const row of group){
      const category=metadata(row,'category');
      const value=metadata(row,'fcstValue');
      if(category&&!values.has(category))values.set(category,value);
    }
    return ['TMP','SKY','PTY','POP','REH'].map(code=>weatherLabel(code,values.get(code))).filter(Boolean).join(' · ')||'최신 예보값 확인 중';
  }

  function airSummary(payload){
    const record=sourceRecord(payload,row=>metadata(row,'pm10Value')&&metadata(row,'pm10Value')!=='-');
    if(!record)return '실시간 측정값 확인 중';
    const pm10=metadata(record,'pm10Value');
    const pm25=metadata(record,'pm25Value');
    return [
      record.title?.ko||metadata(record,'stationName'),
      pm10&&pm10!=='-'?`PM10 ${pm10}㎍/㎥ ${airGrade(metadata(record,'pm10Grade'))}`:'',
      pm25&&pm25!=='-'?`PM2.5 ${pm25}㎍/㎥ ${airGrade(metadata(record,'pm25Grade'))}`:'',
      record.date||metadata(record,'dataTime')
    ].filter(Boolean).join(' · ');
  }

  async function briefingWeatherAir({cards,meta,weatherParams,airParams}){
    const ND=await dataSystem();
    const settled=await Promise.allSettled([
      ND.query('weather-short-forecast',weatherParams),
      ND.query('airkorea-realtime',airParams)
    ]);
    cards.replaceChildren();
    let ok=0;
    let latestIntelligence=null;
    if(settled[0].status==='fulfilled'){
      const payload=settled[0].value;
      cards.append(briefingBox('기상청 · 서울 단기예보',weatherSummary(payload)));
      latestIntelligence=payload.intelligence||latestIntelligence;
      ok++;
    }
    if(settled[1].status==='fulfilled'){
      const payload=settled[1].value;
      cards.append(briefingBox('에어코리아 · 서울 대기질',airSummary(payload)));
      latestIntelligence=payload.intelligence||latestIntelligence;
      ok++;
    }
    if(!ok)cards.append(briefingBox('공공데이터 응답 확인 필요','기존 전략정보 브리핑은 그대로 유지되며 다음 자동 갱신에서 다시 조회합니다.'));
    if(meta)meta.textContent=ok===2?'기상청·에어코리아 · NEXUS 공통 정규화 계층 연결':`${ok}/2개 공공 API 응답 확인`;
    return {ok,settled,intelligence:latestIntelligence};
  }

  async function apartmentTrades({host,meta,params,label,limit=6}){
    const ND=await dataSystem();
    const payload=await ND.query('apt-trade',params);
    const rows=Array.isArray(payload.records)?payload.records:[];
    ND.renderGrid(host,rows.slice(0,limit),{columns:2,emptyText:`${label||''} 실거래 자료가 아직 없거나 공표 전입니다.`,linkLabel:'국토교통부 원천 ↗'});
    if(meta)meta.textContent=`서울 강남구 · ${label||''} · 실거래 ${rows.length}건 중 ${Math.min(rows.length,limit)}건 표시 · ${payload.cache?.status||'LIVE'}`;
    return payload;
  }

  window.NexusLiveData=Object.freeze({briefingWeatherAir,apartmentTrades});
})();
