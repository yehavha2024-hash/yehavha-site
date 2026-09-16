const TARGET_TYPES = Object.freeze({
  person:{label:'인물'}, organization:{label:'회사·기관'}, product:{label:'상품'}, service:{label:'서비스'}, place:{label:'장소'}
});
const NON_REPUTATION_GROUPS = new Set(['기본정보','공식·언론']);
const OPINION_GROUPS = new Set(['재직·면접','공개평가','구매·사용','문제·지원','이용경험','방문경험','이용평가']);
const POSITIVE = ['좋다','좋은','만족','추천','친절','우수','편리','안정','성장','개선','합리','긍정','장점','깨끗','신뢰','괜찮','배울','존중','유연','복지'];
const NEGATIVE = ['나쁘','불만','불친절','느리','지연','비싸','불편','문제','오류','고장','과도','야근','수직','퇴사','환불','논란','비판','단점','갑질','압박','불합리','체불','괴롭','힘들'];
const HIGH_RISK = ['사기꾼','범죄자','횡령','배임','성범죄','불법업체','마약','폭행','살인','탈세','체불','갑질'];
const OPINION_TERMS = /(후기|리뷰|평판|평점|재직자|전직자|퇴사|이직|근무환경|조직문화|복지|워라밸|면접후기|면접\s*경험|고객후기|사용후기|방문후기|불만|칭찬|추천|장점|단점|거래\s*경험|환불|교환|A\/S|고객센터|경영진|야근|연봉|급여|분위기|갑질|괴롭힘|체불)/i;
const GENERIC_NON_OPINION = /(인적성\s*[·ㆍ]?\s*평가도구|신입연봉|면접\s*코칭|기업\s*[·ㆍ]?\s*연봉|연봉계산기|취업성공도우미|직업적성|직무적성|채용도구|채용솔루션|공채정보|공고검색|채용공고|채용정보)/i;
const TOPICS = Object.freeze({
  organization:{
    '업무강도·워라밸':['업무량','야근','업무강도','과중','워라밸','근무시간','퇴근'],
    '조직문화·경영진':['조직문화','수직적','수평적','소통','분위기','경영진','대표','상사','갑질','괴롭'],
    '보상·복지':['급여','연봉','복지','성과급','보상','임금','체불'],
    '채용·면접':['면접','채용','입사','전형','면접관','면접후기'],
    '퇴사·이직':['퇴사','이직','퇴직','중도퇴사','근속'],
    '거래·신뢰':['납기','정산','거래','계약','신뢰','대금','고객','협력사']
  },
  product:{'품질':['품질','마감','내구성','불량','고장'],'가격·가치':['가격','가성비','비싸','저렴'],'배송':['배송','도착','지연','포장'],'사용성':['사용','편리','불편','성능'],'사후지원':['AS','A/S','환불','교환','고객센터']},
  service:{'서비스 품질':['품질','서비스','처리','안정성'],'고객응대':['고객센터','응대','친절','상담'],'가격·비용':['가격','요금','비용','수수료'],'환불·해지':['환불','해지','취소','위약금'],'사용성':['사용','편리','불편','오류','장애']},
  place:{'친절·응대':['친절','불친절','응대','직원'],'가격':['가격','비싸','저렴','가성비'],'청결·시설':['청결','위생','시설','깨끗'],'대기·예약':['대기','예약','시간','줄'],'재방문':['재방문','다시','추천','재이용']},
  person:{'전문성 평가':['전문성','실력','성과','능력','평가'],'공적 활동':['발언','인터뷰','강연','저서','프로젝트'],'논쟁·상반평가':['논란','비판','반박','평판','후기']}
});

function json(body,status=200){return new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store, max-age=0','x-content-type-options':'nosniff'}})}
function clean(value,max=160){return String(value||'').replace(/\s+/g,' ').trim().slice(0,max)}
function decodeHtml(value){return String(value||'').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n))).replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCharCode(parseInt(n,16))).replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&nbsp;/g,' ')}
function stripTags(value){return decodeHtml(value).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}
function entityText(value){return String(value||'').normalize('NFKC').toLowerCase().replace(/&[a-z0-9#]+;/gi,' ').replace(/[\s"'`’‘“”·ㆍ•:;,.!?()[\]{}<>/\\|_+=~^*-]+/g,'')}
function sourceHost(url){try{return new URL(url).hostname.replace(/^www\./,'')}catch{return ''}}
function normalizeUrl(url){try{const u=new URL(url);['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid'].forEach(k=>u.searchParams.delete(k));u.hash='';return u.toString()}catch{return url}}
function tag(block,name){const m=String(block||'').match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`,'i'));return m?stripTags(m[1]):''}
function targetAliases(type,target){const raw=String(target||'').normalize('NFKC').trim();const values=new Set([raw]);if(type==='organization'){values.add(raw.replace(/\(주\)|㈜|주식회사|유한회사|재단법인|사단법인/gi,'').trim());values.add(raw.replace(/\b(co\.?|corp\.?|corporation|inc\.?|ltd\.?|llc)\b/gi,'').trim())}return [...values].map(entityText).filter(v=>v.length>=2)}
function relevantToTarget(type,target,item){let decoded=item.url||'';try{decoded=decodeURIComponent(decoded)}catch{}const hay=entityText(`${item.title} ${item.snippet} ${item.sourceName||''} ${decoded}`);const aliases=targetAliases(type,target);if(aliases.some(a=>hay.includes(a)))return true;const tokens=String(target||'').normalize('NFKC').toLowerCase().split(/[\s"'`’‘“”·ㆍ•:;,.!?()[\]{}<>/\\|_+=~^*-]+/).map(entityText).filter(t=>/[가-힣]/.test(t)?t.length>=2:t.length>=3);return tokens.length>=2&&tokens.every(t=>hay.includes(t))}
function dedupe(items){const seen=new Set(),out=[];for(const item of items){const url=normalizeUrl(item.url);const key=`${url}|${entityText(item.title).slice(0,80)}`;if(!url||seen.has(key))continue;seen.add(key);out.push({...item,url})}return out}
function sourceClass(host){const h=String(host||'').toLowerCase();if(/jobplanet|teamblind|blind/.test(h))return '평판·익명 커뮤니티';if(/saramin|jobkorea|wanted|remember/.test(h))return '채용·경력 플랫폼';if(/blog\.naver|tistory|brunch|medium/.test(h))return '블로그·개인 게시물';if(/cafe\.naver|dcinside|fmkorea|clien|ppomppu|theqoo|ruliweb/.test(h))return '커뮤니티';if(/news|yna|reuters|apnews|chosun|joongang|donga|hani|khan|mk\.co|hankyung|sedaily|etnews/.test(h))return '언론·보도';return '웹 공개자료'}
function evidenceKind(item){if(NON_REPUTATION_GROUPS.has(item.group))return 'profile';const text=`${item.title||''} ${item.snippet||''} ${item.url||''}`;if(GENERIC_NON_OPINION.test(text)&&!OPINION_TERMS.test(text))return 'context';if(OPINION_TERMS.test(text)||OPINION_GROUPS.has(item.group))return 'opinion';return 'mention'}
function rankCollectedItems(items){return [...items].sort((a,b)=>{const ak=evidenceKind(a)==='opinion'?3:evidenceKind(a)==='mention'?2:evidenceKind(a)==='profile'?1:0;const bk=evidenceKind(b)==='opinion'?3:evidenceKind(b)==='mention'?2:evidenceKind(b)==='profile'?1:0;return bk-ak})}
function diversify(items,perHostGroup=6,max=48){const counts=new Map(),out=[];for(const item of items){const host=sourceHost(item.url)||item.sourceName||item.provider||'unknown';const key=`${item.group}|${host}`;const count=counts.get(key)||0;if(count>=perHostGroup)continue;counts.set(key,count+1);out.push(item);if(out.length>=max)break}return out}

async function fetchText(url,timeoutMs=6500){const c=new AbortController();const timer=setTimeout(()=>c.abort(),timeoutMs);try{const r=await fetch(url,{headers:{accept:'text/html,application/xhtml+xml,application/rss+xml,application/xml;q=0.9,*/*;q=0.7','user-agent':'Mozilla/5.0 (compatible; YEHAVHA-NEXUS-Reputation/5.0; +https://yehavha.com/)'},signal:c.signal});if(!r.ok)throw new Error(`upstream_${r.status}`);return await r.text()}finally{clearTimeout(timer)}}
function bingRssUrl(q){return `https://www.bing.com/search?format=rss&setlang=ko-KR&cc=KR&q=${encodeURIComponent(q)}`}
function bingHtmlUrl(q){return `https://www.bing.com/search?setlang=ko-KR&cc=KR&count=15&q=${encodeURIComponent(q)}`}
function ddgHtmlUrl(q){return `https://html.duckduckgo.com/html/?kl=kr-kr&q=${encodeURIComponent(q)}`}
function googleNewsUrl(q){return `https://news.google.com/rss/search?hl=ko&gl=KR&ceid=KR:ko&q=${encodeURIComponent(q)}`}

function parseRss(xml,provider,group){const items=[];const blocks=String(xml||'').match(/<item\b[\s\S]*?<\/item>/gi)||[];for(const block of blocks.slice(0,15)){const title=tag(block,'title'),link=tag(block,'link'),description=tag(block,'description'),pubDate=tag(block,'pubDate'),sourceName=tag(block,'source');if(title&&link)items.push({title,url:link,snippet:description,publishedAt:pubDate||null,provider,group,sourceName})}return items}
function parseBingHtml(html,group){const items=[];const blocks=String(html||'').match(/<li[^>]+class="[^"]*b_algo[^"]*"[\s\S]*?<\/li>/gi)||[];for(const block of blocks.slice(0,15)){const a=block.match(/<h2[^>]*>\s*<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i)||block.match(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);if(!a)continue;const p=block.match(/<p[^>]*>([\s\S]*?)<\/p>/i);const url=decodeHtml(a[1]);if(/^https?:\/\//i.test(url))items.push({title:stripTags(a[2]),url,snippet:p?stripTags(p[1]):'',publishedAt:null,provider:'Bing Web',group,sourceName:''})}return items}
function decodeDdgUrl(href){const raw=decodeHtml(href);try{const u=new URL(raw,'https://html.duckduckgo.com');const uddg=u.searchParams.get('uddg');return uddg?decodeURIComponent(uddg):u.href}catch{return raw}}
function parseDdgHtml(html,group){const items=[];const blocks=String(html||'').match(/<div[^>]+class="[^"]*result[^"]*"[\s\S]*?(?=<div[^>]+class="[^"]*result[^"]*"|$)/gi)||[];for(const block of blocks.slice(0,15)){const a=block.match(/<a[^>]+class="[^"]*result__a[^"]*"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i)||block.match(/<a[^>]+href="([^"]+)"[^>]+class="[^"]*result__a[^"]*"[^>]*>([\s\S]*?)<\/a>/i);if(!a)continue;const s=block.match(/<(?:a|div)[^>]+class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/(?:a|div)>/i);const url=decodeDdgUrl(a[1]);if(/^https?:\/\//i.test(url))items.push({title:stripTags(a[2]),url,snippet:s?stripTags(s[1]):'',publishedAt:null,provider:'DuckDuckGo',group,sourceName:''})}return items}

function absoluteUrl(href,base){try{return new URL(decodeHtml(href),base).toString()}catch{return ''}}
function classifyOrgLink(url,title,defaultGroup='기본정보'){
  const text=`${url} ${title}`.toLowerCase();
  if(GENERIC_NON_OPINION.test(text))return '기본정보';
  if(/company-review|review|interview-review|면접후기|기업리뷰|리뷰|후기/.test(text))return '재직·면접';
  return defaultGroup;
}
function parseTargetAnchors(html,base,target,provider,defaultGroup='기본정보',requireTarget=true){
  const out=[];
  const anchors=String(html||'').match(/<a\b[^>]*href=["'][^"']+["'][^>]*>[\s\S]*?<\/a>/gi)||[];
  for(const anchor of anchors){
    const hm=anchor.match(/href=["']([^"']+)["']/i);if(!hm)continue;
    const title=stripTags(anchor);const url=absoluteUrl(hm[1],base);
    if(!url||!/^https?:\/\//i.test(url))continue;
    const item={title:title||target,url,snippet:title||'',publishedAt:null,provider,group:classifyOrgLink(url,title,defaultGroup),sourceName:provider};
    if(requireTarget&&!relevantToTarget('organization',target,item))continue;
    out.push(item);
  }
  return dedupe(out);
}
async function collectDirectOrganization(target){
  const sources=[
    {provider:'잡코리아',base:'https://www.jobkorea.co.kr/',url:`https://www.jobkorea.co.kr/Search/?stext=${encodeURIComponent(target)}`},
    {provider:'사람인',base:'https://www.saramin.co.kr/',url:`https://www.saramin.co.kr/zf_user/search?searchword=${encodeURIComponent(target)}`}
  ];
  const out=[];let successes=0,failures=0;
  for(const source of sources){
    try{
      const html=await fetchText(source.url,8000);successes++;
      const matched=parseTargetAnchors(html,source.base,target,source.provider,'기본정보',true)
        .filter(item=>sourceHost(item.url).endsWith(new URL(source.base).hostname.replace(/^www\./,'')))
        .slice(0,8);
      out.push(...matched);
      const landingUrls=[...new Set(matched.map(item=>item.url).filter(url=>/company|기업|csn=|co_read|corp|company-info/i.test(url)).slice(0,4))];
      for(const landingUrl of landingUrls){
        try{
          const landing=await fetchText(landingUrl,6500);successes++;
          const childAnchors=parseTargetAnchors(landing,landingUrl,target,source.provider,'기본정보',false)
            .filter(item=>sourceHost(item.url).endsWith(new URL(source.base).hostname.replace(/^www\./,'')))
            .filter(item=>item.group==='재직·면접')
            .slice(0,8);
          out.push(...childAnchors);
        }catch{failures++;}
      }
    }catch{failures++;}
  }
  return {items:dedupe(out),successes,failures};
}

function searchPlan(type,target){const q=`"${target}"`;if(type==='organization')return [
  {group:'기본정보',queries:[q,`${q} 기업정보 회사소개`,`${q} 공식 홈페이지`]},
  {group:'공개평가',queries:[`${q} 후기 리뷰 평판`,`${q} 직원 후기 조직문화`,`${q} 면접 후기`,`${q} 퇴사 이직 후기`,`${q} 급여 복지 워라밸`]},
  {group:'재직·면접',queries:[`site:jobplanet.co.kr ${q}`,`site:teamblind.com ${q}`,`site:saramin.co.kr ${q} 기업리뷰 면접후기`,`site:jobkorea.co.kr ${q} 기업리뷰 면접후기`]},
  {group:'공개평가',queries:[`site:blog.naver.com ${q} 후기`,`site:cafe.naver.com ${q} 후기`]},
  {group:'공식·언론',queries:[`${q} 보도자료 뉴스`,`${q} 대표 사업`],news:true}
];
  if(type==='person')return [
    {group:'기본정보',queries:[q,`${q} 프로필 경력 소속`]},
    {group:'공개평가',queries:[`${q} 평가 평판 후기`,`${q} 비판 평가`,`${q} 칭찬 평가`]},
    {group:'공식·언론',queries:[`${q} 인터뷰 보도`],news:true}
  ];
  if(type==='product')return [
    {group:'기본정보',queries:[q,`${q} 제품소개 제조사`]},
    {group:'구매·사용',queries:[`${q} 구매후기 리뷰 사용기`,`${q} 장점 단점`,`${q} 만족 불만`]},
    {group:'문제·지원',queries:[`${q} 불량 환불 AS`]},
    {group:'공식·언론',queries:[`${q} 출시 리콜 뉴스`],news:true}
  ];
  if(type==='service')return [
    {group:'기본정보',queries:[q,`${q} 서비스소개 운영사`]},
    {group:'이용경험',queries:[`${q} 이용후기 리뷰`,`${q} 만족 불만`,`${q} 장점 단점`]},
    {group:'문제·지원',queries:[`${q} 환불 해지 고객센터`]},
    {group:'공식·언론',queries:[`${q} 공지 뉴스`],news:true}
  ];
  return [
    {group:'기본정보',queries:[q,`${q} 주소 운영시간`]},
    {group:'방문경험',queries:[`${q} 방문후기 리뷰`,`${q} 추천 불만`]},
    {group:'이용평가',queries:[`${q} 친절 가격 청결 대기`]},
    {group:'공식·언론',queries:[`${q} 공지 뉴스`],news:true}
  ]
}
async function runQuery(query,group,news=false){const jobs=[
  fetchText(bingRssUrl(query)).then(x=>parseRss(x,'Bing RSS',group)),
  fetchText(bingHtmlUrl(query)).then(x=>parseBingHtml(x,group)),
  fetchText(ddgHtmlUrl(query)).then(x=>parseDdgHtml(x,group))
];if(news)jobs.push(fetchText(googleNewsUrl(query)).then(x=>parseRss(x,'Google News',group)));const settled=await Promise.allSettled(jobs);return {items:settled.flatMap(r=>r.status==='fulfilled'?r.value:[]),successes:settled.filter(r=>r.status==='fulfilled').length,failures:settled.filter(r=>r.status==='rejected').length}}
async function collect(type,target){const plan=searchPlan(type,target);const jobs=[];for(const bucket of plan)for(const query of bucket.queries)jobs.push(runQuery(query,bucket.group,bucket.news));const results=await Promise.all(jobs);const direct=type==='organization'?await collectDirectOrganization(target):{items:[],successes:0,failures:0};const raw=dedupe([...results.flatMap(r=>r.items),...direct.items]);const relevant=raw.filter(item=>relevantToTarget(type,target,item));const ranked=rankCollectedItems(relevant);return {items:diversify(ranked,6,48),rawCount:raw.length,irrelevantCount:raw.length-relevant.length,providerSuccesses:results.reduce((n,r)=>n+r.successes,0)+direct.successes,providerFailures:results.reduce((n,r)=>n+r.failures,0)+direct.failures}}

function scoreSentiment(text){const t=String(text||'').toLowerCase();let pos=0,neg=0;for(const k of POSITIVE)if(t.includes(k.toLowerCase()))pos++;for(const k of NEGATIVE)if(t.includes(k.toLowerCase()))neg++;return pos>neg?'positive':neg>pos?'negative':'neutral'}
function highRisk(text){const t=String(text||'').toLowerCase();return HIGH_RISK.some(k=>t.includes(k.toLowerCase()))}
function topicMatches(type,text){const t=String(text||'').toLowerCase();return Object.entries(TOPICS[type]||{}).filter(([,words])=>words.some(w=>t.includes(w.toLowerCase()))).map(([name])=>name)}
function annotateEvidence(type,items){return items.map((item,index)=>{const text=`${item.title} ${item.snippet}`;const host=sourceHost(item.url)||item.sourceName||item.provider;const kind=evidenceKind(item);const topics=topicMatches(type,text);return {id:`S${String(index+1).padStart(2,'0')}`,...item,host,sourceClass:sourceClass(host),kind,topics:kind==='opinion'?(topics.length?topics:['기타 공개평가']):topics,sentiment:scoreSentiment(text),claimRisk:highRisk(text)?'high':'normal'}})}
function buildSignals(type,evidence){const m=new Map();for(const e of evidence){if(e.kind!=='opinion')continue;for(const topic of e.topics){if(!m.has(topic))m.set(topic,{topic,positive:[],negative:[],neutral:[],hosts:new Set(),positiveHosts:new Set(),negativeHosts:new Set(),neutralHosts:new Set(),highRisk:[]});const r=m.get(topic);r[e.sentiment].push(e.id);if(e.claimRisk==='high')r.highRisk.push(e.id);if(e.host){r.hosts.add(e.host);r[`${e.sentiment}Hosts`].add(e.host)}}}return [...m.values()].map(r=>({topic:r.topic,positive:r.positive,negative:r.negative,neutral:r.neutral,highRisk:r.highRisk,independentSources:r.hosts.size,positiveIndependentSources:r.positiveHosts.size,negativeIndependentSources:r.negativeHosts.size,neutralIndependentSources:r.neutralHosts.size,total:r.positive.length+r.negative.length+r.neutral.length,state:r.positive.length&&r.negative.length?'conflicted':r.negative.length>r.positive.length?'negative':r.positive.length>r.negative.length?'positive':'mixed'})).sort((a,b)=>b.total-a.total||b.independentSources-a.independentSources).slice(0,10)}
function buildOverview(target,profileEvidence){if(!profileEvidence.length)return '';const preferred=[...profileEvidence].sort((a,b)=>{const ah=/^(?:[^.]+\.)?lgrc\.co\.kr$/.test(a.host||'')?2:['jobkorea.co.kr','saramin.co.kr'].some(h=>(a.host||'').endsWith(h))?1:0;const bh=/^(?:[^.]+\.)?lgrc\.co\.kr$/.test(b.host||'')?2:['jobkorea.co.kr','saramin.co.kr'].some(h=>(b.host||'').endsWith(h))?1:0;return bh-ah});const source=preferred.find(e=>e.snippet)||preferred[0];const snippet=clean(source.snippet,420);return snippet||`${target}에 관한 기본·공식 공개자료 ${profileEvidence.length}건이 확인되었습니다. 대표 자료는 “${clean(source.title,140)}”입니다.`}
function buildProfile(target,evidence,collection){const profileEvidence=evidence.filter(e=>e.kind==='profile');const opinionEvidence=evidence.filter(e=>e.kind==='opinion');const overview=buildOverview(target,profileEvidence);const hosts=new Set(opinionEvidence.map(e=>e.host).filter(Boolean));const counts={positive:0,negative:0,neutral:0};opinionEvidence.forEach(e=>counts[e.sentiment]++);let reputationStatus='none';let reputationMessage=`${target}에 관한 공개 의견·후기 후보를 현재 검색 범위에서 확보하지 못했습니다. 이는 온라인에 의견이 전혀 없다는 뜻이 아니라 이번 자동 수집에서 직접 연결되는 의견을 찾지 못했다는 의미입니다.`;if(opinionEvidence.length){reputationStatus='available';reputationMessage=`${target}에 관한 공개 의견·후기 ${opinionEvidence.length}건을 ${hosts.size}개 도메인에서 수집했습니다. 수집 표본의 방향은 긍정 ${counts.positive}건, 부정 ${counts.negative}건, 중립·혼합 ${counts.neutral}건입니다. 각 의견의 진위를 자동으로 확정하지 않고, 게시된 의견 자체를 분석 대상으로 삼습니다.`}if(profileEvidence.length)return {status:'identified',overview:overview||`${target}에 관한 기본·공식 공개자료가 확인되었습니다.`,sourceIds:profileEvidence.slice(0,8).map(e=>e.id),sourceCount:profileEvidence.length,reputationStatus,reputationMessage};if(evidence.length)return {status:'limited',overview:`${target}과 직접 연결되는 공개자료는 확인됐지만 기본·공식 소개 자료가 충분하지 않습니다.`,sourceIds:evidence.slice(0,4).map(e=>e.id),sourceCount:0,reputationStatus,reputationMessage};const health=collection.providerSuccesses>0?'검색 공급원은 응답했지만 직접 일치 자료를 확보하지 못했습니다.':'검색 공급원 연결 자체가 충분히 성공하지 못했습니다.';return {status:'unidentified',overview:`${health} 회사명 전체·지역·홈페이지 등 식별정보를 함께 입력하면 검색 정확도가 높아집니다.`,sourceIds:[],sourceCount:0,reputationStatus:'none',reputationMessage}}
function reportSummary(target,evidence,signals){const opinions=evidence.filter(e=>e.kind==='opinion');if(!opinions.length)return `${target}과 직접 연결되는 공개자료는 수집했지만 현재 자동 탐색 범위에서 의견·후기 성격의 자료는 확보하지 못했습니다. 공식·채용 정보와 실제 평판을 구분해 표시하며, 의견이 없다고 긍정 또는 부정으로 해석하지 않습니다.`;const counts={positive:0,negative:0,neutral:0};opinions.forEach(e=>counts[e.sentiment]++);const hosts=new Set(opinions.map(e=>e.host).filter(Boolean)).size;const top=signals.slice(0,3).map(s=>`${s.topic} ${s.total}건`).join(', ');const concentration=hosts<=1?'의견이 한 도메인에 집중되어 있습니다.':`의견 출처는 ${hosts}개 도메인으로 분산되어 있습니다.`;return `${target} 관련 공개 의견 ${opinions.length}건을 수집했습니다. 수집 표본은 긍정 ${counts.positive}건, 부정 ${counts.negative}건, 중립·혼합 ${counts.neutral}건이며${top?`, 주요 언급 주제는 ${top}입니다.`:'.'} ${concentration} 이 결과는 게시된 의견의 분포를 요약한 것이며 각 의견의 사실 여부나 전체 구성원의 대표성을 자동으로 확정하지 않습니다.`}
function searchLinks(type,target){const q=encodeURIComponent(target);const links=[{label:'Google 웹검색',url:`https://www.google.com/search?q=${q}`},{label:'네이버 통합검색',url:`https://search.naver.com/search.naver?query=${q}`},{label:'다음 검색',url:`https://search.daum.net/search?q=${q}`}];if(type==='organization')links.push({label:'잡플래닛 검색',url:`https://www.google.com/search?q=site%3Ajobplanet.co.kr+${q}`},{label:'블라인드 검색',url:`https://www.google.com/search?q=site%3Ateamblind.com+${q}`},{label:'사람인 검색',url:`https://www.google.com/search?q=site%3Asaramin.co.kr+${q}`},{label:'잡코리아 검색',url:`https://www.google.com/search?q=site%3Ajobkorea.co.kr+${q}`});return links}

export async function onRequestPost({request}){
  let body;try{body=await request.json()}catch{return json({ok:false,error:'invalid_json'},400)}
  const type=clean(body?.type,24),target=clean(body?.target,120);
  if(!TARGET_TYPES[type])return json({ok:false,error:'invalid_type'},400);
  if(target.length<2)return json({ok:false,error:'target_too_short'},400);
  const collection=await collect(type,target);
  const evidence=annotateEvidence(type,collection.items);
  const opinionEvidence=evidence.filter(e=>e.kind==='opinion');
  const signals=buildSignals(type,evidence);
  const profile=buildProfile(target,evidence,collection);
  const counts={positive:0,negative:0,neutral:0};opinionEvidence.forEach(e=>counts[e.sentiment]++);
  return json({
    ok:true,
    schema:'nexus-reputation-analysis-v5',
    target:{type,typeLabel:TARGET_TYPES[type].label,name:target},
    generatedAt:new Date().toISOString(),
    methodology:{
      mode:'public-opinion-intelligence',
      stages:['다중 검색원 탐색','대상 직접일치 확인','중복 제거','공식정보·공개의견 분리','긍정·부정·중립 분류','주제별 취합','출처 집중도 확인','상충 의견 병기','근거 연결'],
      note:'공개된 의견은 내용이 긍정적이든 부정적이든, 익명·후기·블로그·커뮤니티·채용플랫폼 자료이든 대상과 직접 연결되는 경우 수집합니다. 자동화가 의견의 진위를 이유로 제외하지 않습니다. 대신 공식정보·광고·일반 도구 페이지와 실제 의견을 구분하고, 동일 URL 중복·무관 결과를 제거하며, 출처 도메인·반복 주제·상충 여부·특정 플랫폼 집중도를 함께 표시합니다. 심각한 의혹·비위 표현은 사실확정이 아니라 공개 주장으로 표시합니다.'
    },
    profile,
    executiveSummary:reportSummary(target,evidence,signals),
    metrics:{
      sources:evidence.length,
      profileSources:evidence.filter(e=>e.kind==='profile').length,
      opinionSources:opinionEvidence.length,
      opinionHosts:new Set(opinionEvidence.map(e=>e.host).filter(Boolean)).size,
      positiveOpinions:counts.positive,
      negativeOpinions:counts.negative,
      neutralOpinions:counts.neutral,
      independentHosts:new Set(evidence.map(e=>e.host).filter(Boolean)).size,
      filteredIrrelevant:collection.irrelevantCount,
      rawCandidates:collection.rawCount,
      providerSuccesses:collection.providerSuccesses,
      providerFailures:collection.providerFailures,
      highRiskClaims:opinionEvidence.filter(e=>e.claimRisk==='high').length,
      signals:signals.length
    },
    signals,
    evidence,
    searchLinks:searchLinks(type,target),
    disclaimer:'이 보고서는 공개 웹에 게시된 평가·경험·주장을 취합한 평판 인텔리전스입니다. 개별 의견의 사실 여부를 자동으로 확정하지 않으며, 긍정·부정 의견 모두 게시 맥락과 출처를 함께 제시합니다. 중요한 의사결정에서는 원문, 공식자료, 당사자 설명 등 추가 확인이 필요합니다.'
  })
}
export async function onRequestGet(){return json({ok:true,service:'NEXUS 평판 분석',version:'5.0',providers:['Bing RSS','Bing Web','DuckDuckGo','Google News','JobKorea direct','Saramin direct'],types:Object.entries(TARGET_TYPES).map(([id,v])=>({id,label:v.label}))})}
