const TARGET_TYPES = Object.freeze({
  person: { label: '인물' },
  organization: { label: '회사·기관' },
  product: { label: '상품' },
  service: { label: '서비스' },
  place: { label: '장소' }
});

const SOURCE_QUERIES = Object.freeze({
  person: [
    { group: '기본정보', q: '"{target}" (프로필 OR 소개 OR 경력 OR 소속 OR 공식)' },
    { group: '공식·언론', q: '"{target}" (공식 OR 인터뷰 OR 경력 OR 보도)' },
    { group: '공개평가', q: '"{target}" (평가 OR 평판 OR 후기)' }
  ],
  organization: [
    { group: '기본정보', q: '"{target}" (회사소개 OR 기업소개 OR 기관소개 OR 사업 OR 서비스 OR 공식 홈페이지)' },
    { group: '재직·면접', q: '"{target}" (재직 OR 면접 OR 조직문화 OR 복지 OR 퇴사) 후기' },
    { group: '공개평가', q: '"{target}" (평판 OR 후기 OR 리뷰 OR 거래)' },
    { group: '공식·언론', q: '"{target}" (공시 OR 보도자료 OR 행정처분 OR 판결 OR 뉴스)' }
  ],
  product: [
    { group: '기본정보', q: '"{target}" (제품소개 OR 상품소개 OR 제조사 OR 사양 OR 공식)' },
    { group: '구매·사용', q: '"{target}" (구매후기 OR 사용기 OR 리뷰 OR 단점 OR 장점)' },
    { group: '문제·지원', q: '"{target}" (불량 OR 환불 OR AS OR 고객지원)' },
    { group: '공식·언론', q: '"{target}" (공식 OR 출시 OR 리콜 OR 뉴스)' }
  ],
  service: [
    { group: '기본정보', q: '"{target}" (서비스소개 OR 운영사 OR 이용방법 OR 공식 홈페이지)' },
    { group: '이용경험', q: '"{target}" (이용후기 OR 리뷰 OR 사용후기)' },
    { group: '문제·지원', q: '"{target}" (환불 OR 해지 OR 고객센터 OR 불만)' },
    { group: '공식·언론', q: '"{target}" (공식 OR 공지 OR 뉴스)' }
  ],
  place: [
    { group: '기본정보', q: '"{target}" (장소소개 OR 시설소개 OR 주소 OR 운영시간 OR 공식)' },
    { group: '방문경험', q: '"{target}" (방문후기 OR 리뷰 OR 카카오맵 OR 네이버지도)' },
    { group: '이용평가', q: '"{target}" (친절 OR 가격 OR 대기 OR 청결 OR 재방문)' },
    { group: '공식·언론', q: '"{target}" (공식 OR 공지 OR 뉴스)' }
  ]
});

const TOPICS = Object.freeze({
  organization: {
    '업무강도': ['업무량','야근','업무강도','과중','워라밸','근무시간'],
    '조직문화': ['조직문화','수직적','수평적','소통','분위기','경영진'],
    '보상·복지': ['급여','연봉','복지','성과급','보상'],
    '채용·면접': ['면접','채용','입사','전형'],
    '퇴사·이직': ['퇴사','이직','퇴직','중도퇴사'],
    '거래·신뢰': ['납기','정산','거래','계약','신뢰','대금']
  },
  product: {
    '품질': ['품질','마감','내구성','불량','고장'],
    '가격·가치': ['가격','가성비','비싸','저렴'],
    '배송': ['배송','도착','지연','포장'],
    '사용성': ['사용','편리','불편','성능'],
    '사후지원': ['AS','A/S','환불','교환','고객센터']
  },
  service: {
    '서비스 품질': ['품질','서비스','처리','안정성'],
    '고객응대': ['고객센터','응대','친절','상담'],
    '가격·비용': ['가격','요금','비용','수수료'],
    '환불·해지': ['환불','해지','취소','위약금'],
    '사용성': ['사용','편리','불편','오류','장애']
  },
  place: {
    '친절·응대': ['친절','불친절','응대','직원'],
    '가격': ['가격','비싸','저렴','가성비'],
    '청결·시설': ['청결','위생','시설','깨끗'],
    '대기·예약': ['대기','예약','시간','줄'],
    '재방문': ['재방문','다시','추천','재이용']
  },
  person: {
    '공개경력': ['경력','재직','학력','활동','수상'],
    '전문성 평가': ['전문성','실력','성과','능력'],
    '공적 활동': ['발언','인터뷰','강연','저서','프로젝트'],
    '논쟁·상반평가': ['논란','비판','반박','평가']
  }
});

const POSITIVE = ['좋다','좋은','만족','추천','친절','빠르','우수','편리','안정','성장','개선','합리','긍정','장점','깨끗','신뢰'];
const NEGATIVE = ['나쁘','불만','불친절','느리','지연','비싸','불편','문제','오류','고장','과도','야근','수직','퇴사','환불','논란','비판','단점'];
const HIGH_RISK = ['사기꾼','범죄자','횡령','배임','성범죄','불법업체','마약','폭행','살인','탈세'];
const NON_REPUTATION_GROUPS = new Set(['기본정보','공식·언론']);

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type':'application/json; charset=utf-8', 'cache-control':'no-store, max-age=0', 'x-content-type-options':'nosniff' } });
}
function clean(value, max = 120) { return String(value || '').replace(/\s+/g,' ').trim().slice(0,max); }
function stripTags(value) { return String(value || '').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(); }
function decodeXml(value) { return String(value || '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'"); }
function tag(block, name) { const m=block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`,'i')); return m?stripTags(decodeXml(m[1])):''; }
function parseRss(xml, provider, group) {
  const items=[]; const blocks=String(xml||'').match(/<item\b[\s\S]*?<\/item>/gi)||[];
  for(const block of blocks.slice(0,12)){
    const title=tag(block,'title'); const link=tag(block,'link'); const description=tag(block,'description'); const pubDate=tag(block,'pubDate'); const sourceName=tag(block,'source');
    if(title&&link)items.push({title,url:link,snippet:description,publishedAt:pubDate||null,provider,group,sourceName});
  }
  return items;
}
async function fetchText(url, timeoutMs=5500){const c=new AbortController();const timer=setTimeout(()=>c.abort(),timeoutMs);try{const r=await fetch(url,{headers:{accept:'application/rss+xml, application/xml, text/xml;q=0.9, text/html;q=0.6','user-agent':'YEHAVHA-NEXUS-Reputation/1.0 (+https://yehavha.com/)'},signal:c.signal});if(!r.ok)throw new Error(`upstream_${r.status}`);return await r.text();}finally{clearTimeout(timer);}}
function bingRssUrl(q){return `https://www.bing.com/search?format=rss&setlang=ko-KR&cc=KR&q=${encodeURIComponent(q)}`;}
function googleNewsUrl(q){return `https://news.google.com/rss/search?hl=ko&gl=KR&ceid=KR:ko&q=${encodeURIComponent(q)}`;}
function normalizeUrl(url){try{const u=new URL(url);['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid'].forEach(k=>u.searchParams.delete(k));u.hash='';return u.toString();}catch{return url;}}
function dedupe(items){const seen=new Set(),out=[];for(const item of items){const url=normalizeUrl(item.url);const key=`${url}|${item.title.toLowerCase().replace(/\W/g,'').slice(0,60)}`;if(seen.has(key))continue;seen.add(key);out.push({...item,url});}return out;}
function scoreSentiment(text){const t=text.toLowerCase();let pos=0,neg=0;POSITIVE.forEach(k=>{if(t.includes(k.toLowerCase()))pos++;});NEGATIVE.forEach(k=>{if(t.includes(k.toLowerCase()))neg++;});return{direction:pos>neg?'positive':neg>pos?'negative':'neutral'};}
function highRisk(text){const t=text.toLowerCase();return HIGH_RISK.some(k=>t.includes(k.toLowerCase()));}
function topicMatches(type,text){const groups=TOPICS[type]||{},t=text.toLowerCase();return Object.entries(groups).filter(([,words])=>words.some(w=>t.includes(w.toLowerCase()))).map(([name])=>name);}
function sourceHost(url){try{return new URL(url).hostname.replace(/^www\./,'');}catch{return '';}}
function annotateEvidence(type,items){return items.map((item,index)=>{const text=`${item.title} ${item.snippet}`;return{id:`S${String(index+1).padStart(2,'0')}`,...item,host:item.sourceName||sourceHost(item.url),topics:topicMatches(type,text),sentiment:scoreSentiment(text).direction,highRisk:highRisk(text)};});}
function isStrongSignal(s){
  if(s.state==='negative')return s.negativeIndependentSources>=2;
  if(s.state==='positive')return s.positiveIndependentSources>=2;
  if(s.state==='conflicted')return s.independentSources>=2&&s.positiveIndependentSources>=1&&s.negativeIndependentSources>=1;
  return s.neutralIndependentSources>=2;
}
function buildSignals(type,evidence){
  const m=new Map();
  for(const e of evidence){
    if(e.highRisk)continue;
    for(const topic of e.topics){
      if(!m.has(topic))m.set(topic,{topic,positive:[],negative:[],neutral:[],hosts:new Set(),positiveHosts:new Set(),negativeHosts:new Set(),neutralHosts:new Set()});
      const r=m.get(topic);
      const sentiment=['positive','negative','neutral'].includes(e.sentiment)?e.sentiment:'neutral';
      r[sentiment].push(e.id);
      if(e.host){
        r.hosts.add(e.host);
        r[`${sentiment}Hosts`].add(e.host);
      }
    }
  }
  return[...m.values()].map(r=>({
    topic:r.topic,
    positive:r.positive,
    negative:r.negative,
    neutral:r.neutral,
    independentSources:r.hosts.size,
    positiveIndependentSources:r.positiveHosts.size,
    negativeIndependentSources:r.negativeHosts.size,
    neutralIndependentSources:r.neutralHosts.size,
    total:r.positive.length+r.negative.length+r.neutral.length,
    state:r.positive.length&&r.negative.length?'conflicted':r.negative.length>r.positive.length?'negative':r.positive.length>r.negative.length?'positive':'mixed'
  })).sort((a,b)=>b.independentSources-a.independentSources||b.total-a.total).slice(0,8);
}
function buildProfile(type,target,evidence,reputationEvidence,signals){
  const profileEvidence=evidence.filter(e=>NON_REPUTATION_GROUPS.has(e.group));
  const overviewSource=profileEvidence.find(e=>e.group==='기본정보'&&e.snippet)||profileEvidence.find(e=>e.snippet)||profileEvidence[0]||null;
  const overview=overviewSource?clean(overviewSource.snippet||overviewSource.title,420):'';
  const strongSignals=signals.filter(isStrongSignal);
  let reputationStatus='none';
  let reputationMessage=`현재 자동 확인 범위에서는 ${target}에 관한 공개 평판·후기 자료가 확인되지 않았습니다. 이는 긍정적이거나 부정적이라는 뜻이 아니라, 공개적으로 축적된 평가 자료가 아직 부족하다는 의미입니다.`;
  if(reputationEvidence.length>0&&strongSignals.length===0){
    reputationStatus='insufficient';
    reputationMessage=`${target}에 관한 평판·후기 자료 ${reputationEvidence.length}건은 확인됐지만, 동일 방향의 평가가 서로 다른 복수 출처에서 충분히 반복되지는 않았습니다. 현재 단계에서는 일반화된 평판으로 판단하지 않는 것이 적절합니다.`;
  }else if(strongSignals.length>0){
    reputationStatus='available';
    reputationMessage=`${target}에 관해 서로 다른 복수 출처에서 반복되거나 상충하는 평판 신호가 확인됐습니다. 아래 반복·상충 신호와 개별 근거를 함께 확인하십시오.`;
  }
  if(profileEvidence.length){
    return {status:'identified',overview:overview||`${target}에 관한 기본·공식 공개자료가 확인되었습니다.`,sourceIds:profileEvidence.slice(0,5).map(e=>e.id),sourceCount:profileEvidence.length,reputationStatus,reputationMessage};
  }
  if(evidence.length){
    return {status:'limited',overview:`${target}에 관한 일부 공개자료는 확인됐지만, 대상을 안정적으로 설명할 수 있는 기본·공식 소개 자료는 충분하지 않습니다. 동명이 대상이나 유사 명칭 여부를 추가 확인할 필요가 있습니다.`,sourceIds:evidence.slice(0,3).map(e=>e.id),sourceCount:0,reputationStatus,reputationMessage};
  }
  return {status:'unidentified',overview:`현재 자동 확인 범위에서는 ${target}의 기본 정보와 공개 평판 자료를 충분히 확인하지 못했습니다. 신규·소규모 대상이거나 검색 노출이 적을 수 있으며, 자료가 없다는 사실 자체는 신뢰성에 대한 긍정 또는 부정 판단 근거가 아닙니다.`,sourceIds:[],sourceCount:0,reputationStatus:'none',reputationMessage};
}
function reportSummary(target,signals,reputationEvidence,profile){
  const strong=signals.filter(isStrongSignal).slice(0,3);
  if(!strong.length)return `${profile.overview} ${profile.reputationMessage}`;
  const parts=strong.map(s=>s.state==='conflicted'?`${s.topic}에 대해서는 서로 다른 독립 출처에서 긍정·부정 평가가 함께 나타납니다`:s.state==='negative'?`${s.topic} 관련 부정적 신호가 서로 다른 복수 출처에서 확인됩니다`:s.state==='positive'?`${s.topic} 관련 긍정적 신호가 서로 다른 복수 출처에서 확인됩니다`:`${s.topic} 관련 언급이 서로 다른 복수 출처에서 반복됩니다`);
  return `${profile.overview} 평판 자료를 교차 확인한 결과, ${parts.join('. ')}. 아래 출처별 근거와 상반된 자료를 함께 확인해야 합니다.`;
}
function searchLinks(type,target){const q=encodeURIComponent(target);const links=[{label:'Google 웹검색',url:`https://www.google.com/search?q=${q}`},{label:'네이버 통합검색',url:`https://search.naver.com/search.naver?query=${q}`},{label:'다음 검색',url:`https://search.daum.net/search?q=${q}`}];if(type==='organization')links.push({label:'잡코리아 관련검색',url:`https://www.google.com/search?q=site%3Ajobkorea.co.kr+${q}+후기`},{label:'잡플래닛 관련검색',url:`https://www.google.com/search?q=site%3Ajobplanet.co.kr+${q}`});if(type==='place')links.push({label:'카카오맵 검색',url:`https://map.kakao.com/?q=${q}`},{label:'네이버지도 검색',url:`https://map.naver.com/p/search/${q}`});if(type==='product')links.push({label:'쿠팡 관련검색',url:`https://www.google.com/search?q=site%3Acoupang.com+${q}+상품평`});return links;}
async function collect(type,target){const tasks=[];for(const item of SOURCE_QUERIES[type]||[]){const query=item.q.replaceAll('{target}',target);tasks.push(fetchText(bingRssUrl(query)).then(x=>parseRss(x,'Bing Web RSS',item.group)).catch(()=>[]));if(item.group==='공식·언론')tasks.push(fetchText(googleNewsUrl(query)).then(x=>parseRss(x,'Google News RSS',item.group)).catch(()=>[]));}return dedupe((await Promise.all(tasks)).flat()).slice(0,44);}

export async function onRequestPost({request}){
  let body;try{body=await request.json();}catch{return json({ok:false,error:'invalid_json'},400);}
  const type=clean(body?.type,24),target=clean(body?.target,120);
  if(!TARGET_TYPES[type])return json({ok:false,error:'invalid_type'},400);
  if(target.length<2)return json({ok:false,error:'target_too_short'},400);
  const evidence=annotateEvidence(type,await collect(type,target));
  const safe=evidence.filter(e=>!e.highRisk);
  const held=evidence.filter(e=>e.highRisk).map(e=>({id:e.id,reason:'고위험 주장 키워드가 포함되어 자동 요약에서 제외',url:e.url,title:e.title}));
  const reputationEvidence=safe.filter(e=>!NON_REPUTATION_GROUPS.has(e.group));
  const signals=buildSignals(type,reputationEvidence),generatedAt=new Date().toISOString();
  const profile=buildProfile(type,target,safe,reputationEvidence,signals);
  return json({ok:true,schema:'nexus-reputation-analysis-v2',target:{type,typeLabel:TARGET_TYPES[type].label,name:target},generatedAt,methodology:{mode:'public-source-osint',stages:['대상 식별','기본정보 확인','평판자료 분리','중복 제거','주제 분류','상반 평가 탐지','고위험 주장 분리','근거 연결'],note:'기본·공식 자료와 평판·후기 자료를 분리해 처리합니다. 공개 웹에서 자동 확인 가능한 범위의 1차 분석이며, 유료·로그인 제한 자료, 비공개 정보, 접근이 제한된 원문은 포함하지 않습니다.'},profile,executiveSummary:reportSummary(target,signals,reputationEvidence,profile),metrics:{sources:safe.length,profileSources:profile.sourceCount,reputationSources:reputationEvidence.length,independentHosts:new Set(safe.map(e=>e.host).filter(Boolean)).size,heldHighRisk:held.length,signals:signals.length},signals,evidence:safe,heldEvidence:held,searchLinks:searchLinks(type,target),disclaimer:'공개 평판 자료가 없거나 적다는 사실은 대상의 신뢰성이나 품질에 대한 긍정·부정 판단을 의미하지 않습니다. 이 보고서는 공개된 자료의 존재와 반복 패턴을 정리한 것이며, 중요한 결정에는 원문과 공식자료를 직접 확인하십시오.'});
}
export async function onRequestGet(){return json({ok:true,service:'NEXUS 평판 분석',version:'2.0',types:Object.entries(TARGET_TYPES).map(([id,v])=>({id,label:v.label}))});}