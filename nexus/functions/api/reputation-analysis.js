const TOPICS = Object.freeze({
  '업무강도·워라밸':['야근','퇴근','근무시간','업무량','업무강도','워라밸','주말근무','휴가','연차','과중'],
  '조직문화·경영진':['조직문화','분위기','대표','경영진','상사','팀장','수직','수평','소통','눈치','압박','괴롭'],
  '보상·복지':['급여','연봉','성과급','보상','복지','수당','임금','급여일','체불'],
  '채용·면접':['면접','면접관','질문','채용','입사','전형','수습','공석'],
  '퇴사·이직·근속':['퇴사','이직','퇴직','근속','전임자','중도퇴사','이직률'],
  '업무체계·성장':['업무분장','인수인계','체계','교육','성장','배울','경력','전문성','업무범위']
});

const ACTIONS = Object.freeze({
  '업무강도·워라밸':'최근 실제 퇴근시간, 주말근무 빈도, 긴급 연락 기준, 결원 시 업무분담, 연차 사용 방식과 미사용 사유를 구체적으로 확인하십시오.',
  '조직문화·경영진':'직속 상사와 보고라인, 대표·관리자의 의사결정 개입 범위, 팀 내 갈등 처리방식, 최근 팀 이직률과 고충 제기 절차를 질문하십시오.',
  '보상·복지':'기본급, 수습기간 급여, 급여일, 성과급 기준, 야근·휴일수당, 복지 항목은 구두 설명이 아니라 오퍼·근로계약서·공식 문서로 확인하십시오.',
  '채용·면접':'공석 발생 이유, 전임자 근속기간, 실제 담당업무, 팀 인원, 수습평가 기준, 면접에서 설명한 조건과 근로계약 조건이 같은지 확인하십시오.',
  '퇴사·이직·근속':'최근 퇴사자가 많은지, 같은 직무의 평균 근속기간과 전임자 퇴사 사유가 무엇인지 확인하고 다른 지원처도 병행하십시오.',
  '업무체계·성장':'업무 인수인계 문서, 교육기간, 담당업무 범위, 의사결정 권한, 평가기준, 경력으로 인정되는 핵심 업무가 무엇인지 확인하십시오.'
});

const EXPERIENCE_TERMS = /(재직|전직|퇴사|이직|근무|직원|면접|면접관|상사|대표|경영진|팀장|업무|야근|퇴근|연차|휴가|급여|연봉|복지|수습|조직문화|워라밸|인수인계|업무량|분위기|질문)/i;
const ACTUAL_VOICE = /(많다|많고|많음|많은|적다|적고|적음|좋다|좋고|좋은|나쁘|힘들|빡세|어렵|없다|없고|있다|있고|배울|추천|비추천|만족|불만|눈치|자주|거의|빠르|느리|친절|불친절|강하다|강한|낮다|낮은|높다|높은|잦다|잦은|부족|과도|수직|수평|보수적|자유롭|체계적|체계가|압박|장점|단점|퇴사했|이직했|면접에서|질문은|면접관이|분위기는|업무는|급여는|복지는|대표가|상사가)/i;
const GENERIC_ONLY = /(회사소개|기업소개|기업정보|채용정보|채용공고|공고보기|연봉정보|재무정보|매출액|사업내용|기업개요|복리후생 안내|인재상|공식 홈페이지|회사 홈페이지|채용중|입사지원|연봉계산기)/i;
const REVIEW_URL = /(jobplanet|teamblind|blind|company-review|company_review|review|interview|면접후기|기업리뷰|reviews)/i;
const OPINION_SIGNAL_WORDS = ['야근','퇴근','워라밸','업무량','상사','대표','경영진','분위기','수직','수평','소통','복지','급여','연봉','휴가','연차','수습','면접관','질문','퇴사','이직','배울','성장','압박','체계','힘들','좋','나쁘','만족','불만','추천','비추천','장점','단점','인수인계'];

function json(body,status=200){return new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store, max-age=0','x-content-type-options':'nosniff'}})}
function clean(value,max=1200){return String(value||'').replace(/\s+/g,' ').trim().slice(0,max)}
function decodeHtml(value){return String(value||'').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n))).replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCharCode(parseInt(n,16))).replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&nbsp;/g,' ')}
function stripTags(value){return decodeHtml(value).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}
function pageText(value){return stripTags(String(value||'').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi,' '))}
function tag(block,name){const m=String(block||'').match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`,'i'));return m?stripTags(m[1]):''}
function sourceHost(url){try{return new URL(url).hostname.replace(/^www\./,'')}catch{return ''}}
function normalizeUrl(url){try{const u=new URL(url);['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid'].forEach(k=>u.searchParams.delete(k));u.hash='';return u.toString()}catch{return String(url||'')}}
function absoluteUrl(href,base){try{return new URL(decodeHtml(href),base).toString()}catch{return ''}}
function entityText(value){return String(value||'').normalize('NFKC').toLowerCase().replace(/&[a-z0-9#]+;/gi,' ').replace(/[\s"'`’‘“”·ㆍ•:;,.!?()[\]{}<>/\\|_+=~^*-]+/g,'')}
function companyAliases(company){const raw=String(company||'').normalize('NFKC').trim();return [...new Set([raw,raw.replace(/\(주\)|㈜|주식회사|유한회사|재단법인|사단법인/gi,'').trim()])].map(entityText).filter(v=>v.length>=2)}
function relevantToCompany(company,item){let decoded=item.url||'';try{decoded=decodeURIComponent(decoded)}catch{}const hay=entityText(`${item.title||''} ${item.snippet||''} ${decoded}`);return companyAliases(company).some(alias=>hay.includes(alias))}
function signalCount(text){const t=String(text||'').toLowerCase();return new Set(OPINION_SIGNAL_WORDS.filter(word=>t.includes(word.toLowerCase()))).size}
function numberFrom(text,patterns){for(const pattern of patterns){const m=String(text||'').match(pattern);if(m){const n=Number(String(m[1]).replace(/,/g,''));if(Number.isFinite(n))return n}}return null}
function decimalFrom(text,patterns){for(const pattern of patterns){const m=String(text||'').match(pattern);if(m){const n=Number(m[1]);if(Number.isFinite(n))return n}}return null}
function decodeBase64Url(value){try{let raw=String(value||'').replace(/-/g,'+').replace(/_/g,'/');while(raw.length%4)raw+='=';return atob(raw)}catch{return ''}}
function unwrapSearchUrl(value){
  const raw=decodeHtml(value);
  try{
    const url=new URL(raw,'https://www.bing.com');
    if(/(^|\.)bing\.com$/i.test(url.hostname)){
      const u=url.searchParams.get('u');
      if(u){
        const encoded=u.startsWith('a1')?u.slice(2):u;
        const decoded=decodeBase64Url(encoded);
        if(/^https?:\/\//i.test(decoded))return decoded;
      }
    }
    const uddg=url.searchParams.get('uddg');
    if(uddg){const decoded=decodeURIComponent(uddg);if(/^https?:\/\//i.test(decoded))return decoded;}
    return url.href;
  }catch{return raw}
}

async function fetchText(url,timeoutMs=6500){const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),timeoutMs);try{const response=await fetch(url,{headers:{accept:'text/html,application/xhtml+xml,application/rss+xml,application/xml;q=0.9,*/*;q=0.7','user-agent':'Mozilla/5.0 (compatible; YEHAVHA-NEXUS-Jobseeker-Reputation/6.2; +https://yehavha.com/)'},signal:controller.signal});if(!response.ok)throw new Error(`upstream_${response.status}`);return await response.text()}finally{clearTimeout(timer)}}
function bingRssUrl(q){return `https://www.bing.com/search?format=rss&setlang=ko-KR&cc=KR&q=${encodeURIComponent(q)}`}
function bingHtmlUrl(q){return `https://www.bing.com/search?setlang=ko-KR&cc=KR&count=20&q=${encodeURIComponent(q)}`}
function ddgHtmlUrl(q){return `https://html.duckduckgo.com/html/?kl=kr-kr&q=${encodeURIComponent(q)}`}

function parseRss(xml,provider,query){const out=[];const blocks=String(xml||'').match(/<item\b[\s\S]*?<\/item>/gi)||[];for(const block of blocks.slice(0,20)){const title=tag(block,'title'),link=tag(block,'link'),snippet=tag(block,'description'),publishedAt=tag(block,'pubDate');const url=unwrapSearchUrl(link);if(title&&url)out.push({title,url,snippet,publishedAt:publishedAt||null,provider,query})}return out}
function parseBingHtml(html,query){const out=[];const blocks=String(html||'').match(/<li[^>]+class="[^"]*b_algo[^"]*"[\s\S]*?<\/li>/gi)||[];for(const block of blocks.slice(0,20)){const a=block.match(/<h2[^>]*>\s*<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);if(!a)continue;const p=block.match(/<p[^>]*>([\s\S]*?)<\/p>/i);const url=unwrapSearchUrl(a[1]);if(/^https?:\/\//i.test(url))out.push({title:stripTags(a[2]),url,snippet:p?stripTags(p[1]):'',publishedAt:null,provider:'Bing Web',query})}return out}
function decodeDdgUrl(href){const raw=decodeHtml(href);try{const u=new URL(raw,'https://html.duckduckgo.com');const uddg=u.searchParams.get('uddg');return uddg?decodeURIComponent(uddg):u.href}catch{return raw}}
function parseDdgHtml(html,query){const out=[];const blocks=String(html||'').match(/<div[^>]+class="[^"]*result[^"]*"[\s\S]*?(?=<div[^>]+class="[^"]*result[^"]*"|$)/gi)||[];for(const block of blocks.slice(0,20)){const a=block.match(/<a[^>]+class="[^"]*result__a[^"]*"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i)||block.match(/<a[^>]+href="([^"]+)"[^>]+class="[^"]*result__a[^"]*"[^>]*>([\s\S]*?)<\/a>/i);if(!a)continue;const s=block.match(/<(?:a|div)[^>]+class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/(?:a|div)>/i);const url=decodeDdgUrl(a[1]);if(/^https?:\/\//i.test(url))out.push({title:stripTags(a[2]),url,snippet:s?stripTags(s[1]):'',publishedAt:null,provider:'DuckDuckGo',query})}return out}

function queryPlan(company){const q=`"${company}"`;return [
  `${q} 재직자 후기`,`${q} 전직자 후기`,`${q} 직원 후기`,`${q} 퇴사 후기`,`${q} 이직 후기`,`${q} 면접 후기`,`${q} 조직문화 워라밸`,`${q} 야근 업무량`,`${q} 대표 경영진 후기`,`${q} 급여 복지 후기`,
  `site:jobplanet.co.kr/companies ${q} 기업리뷰`, `site:jobplanet.co.kr/companies ${q} 면접후기`, `site:jobplanet.co.kr/companies ${q} 리뷰평점`, `site:teamblind.com ${q}`, `site:saramin.co.kr ${q} 기업리뷰`, `site:jobkorea.co.kr ${q} 기업리뷰 면접후기`, `site:incruit.com ${q} 기업리뷰`, `site:blog.naver.com ${q} 재직 후기`, `site:cafe.naver.com ${q} 면접 후기`
]}
async function runQuery(query){const settled=await Promise.allSettled([
  fetchText(bingRssUrl(query)).then(text=>parseRss(text,'Bing RSS',query)),
  fetchText(bingHtmlUrl(query)).then(text=>parseBingHtml(text,query)),
  fetchText(ddgHtmlUrl(query)).then(text=>parseDdgHtml(text,query))
]);return {items:settled.flatMap(r=>r.status==='fulfilled'?r.value:[]),successes:settled.filter(r=>r.status==='fulfilled').length,failures:settled.filter(r=>r.status==='rejected').length}}

function candidateKey(item){return `${normalizeUrl(item.url)}|${entityText(item.snippet).slice(0,220)}`}
function dedupeCandidates(items){const seen=new Set(),out=[];for(const item of items){const key=candidateKey(item);if(!item.url||seen.has(key))continue;seen.add(key);out.push({...item,url:normalizeUrl(item.url)});}return out}
function platformName(host){const h=String(host||'').toLowerCase();if(h.includes('jobplanet'))return '잡플래닛';if(h.includes('teamblind')||/(^|\.)blind\./.test(h))return '블라인드';if(h.includes('saramin'))return '사람인';if(h.includes('jobkorea'))return '잡코리아';if(h.includes('incruit'))return '인크루트';if(h.includes('remember'))return '리멤버';if(h.includes('catch'))return '캐치';if(h.includes('blog.naver'))return '네이버 블로그';if(h.includes('cafe.naver'))return '네이버 카페';if(h.includes('tistory'))return '티스토리';return host||'기타 공개 웹'}

function isConcreteOpinion(company,item){
  if(!relevantToCompany(company,item))return false;
  const title=clean(item.title,280);
  const snippet=clean(item.snippet,1200);
  if(snippet.length<30)return false;
  if(!EXPERIENCE_TERMS.test(snippet))return false;
  const signals=signalCount(snippet);
  if(signals<2)return false;
  const actual=ACTUAL_VOICE.test(snippet);
  const reviewSpecific=REVIEW_URL.test(item.url||'')||/(후기|리뷰|재직자|전직자|퇴사|면접)/i.test(title);
  if(!actual&&!reviewSpecific)return false;
  if(GENERIC_ONLY.test(title)&&!actual)return false;
  if(/(복지 및 급여|사내문화|업무와 삶의 균형|승진 기회 및 가능성|리뷰\s*\d+건|면접후기\s*\d+건)/i.test(snippet)&&signals<3&&!actual)return false;
  return true;
}
function extractExcerpt(item){const snippet=clean(item.snippet,700);const chunks=snippet.split(/(?<=[.!?。])\s+|\s*[·•]\s*/).map(s=>clean(s,260)).filter(Boolean);const selected=chunks.filter(part=>EXPERIENCE_TERMS.test(part)&&(ACTUAL_VOICE.test(part)||signalCount(part)>=2)&&!GENERIC_ONLY.test(part)).slice(0,3);return clean(selected.length?selected.join(' / '):snippet,520)}
function topicsFor(text){const t=String(text||'').toLowerCase();const found=Object.entries(TOPICS).filter(([,words])=>words.some(word=>t.includes(word.toLowerCase()))).map(([topic])=>topic);return found.length?found:['기타 근무경험']}
function buildOpinions(company,candidates){const accepted=candidates.filter(item=>isConcreteOpinion(company,item));const seen=new Set(),out=[];for(const item of accepted){const excerpt=extractExcerpt(item);if(excerpt.length<24)continue;const key=`${normalizeUrl(item.url)}|${entityText(excerpt).slice(0,180)}`;if(seen.has(key))continue;seen.add(key);const host=sourceHost(item.url);out.push({...item,host,platform:platformName(host),excerpt,topics:topicsFor(excerpt)});if(out.length>=60)break;}return out.map((item,index)=>({id:`R${String(index+1).padStart(2,'0')}`,...item}))}
function buildThemes(opinions){const map=new Map();for(const opinion of opinions){for(const topic of opinion.topics){if(!map.has(topic))map.set(topic,[]);map.get(topic).push(opinion.id)}}return [...map.entries()].map(([topic,ids])=>({topic,count:ids.length,opinionIds:ids})).sort((a,b)=>b.count-a.count||a.topic.localeCompare(b.topic,'ko')).slice(0,8)}
function buildPlatforms(opinions){const map=new Map();for(const o of opinions){if(!map.has(o.platform))map.set(o.platform,{name:o.platform,count:0,hosts:new Set()});const row=map.get(o.platform);row.count++;if(o.host)row.hosts.add(o.host)}return [...map.values()].map(row=>({name:row.name,count:row.count,hosts:[...row.hosts]})).sort((a,b)=>b.count-a.count)}
function buildActions(themes){return themes.filter(theme=>ACTIONS[theme.topic]).slice(0,6).map(theme=>({title:theme.topic,text:ACTIONS[theme.topic],refs:theme.opinionIds.slice(0,6)}))}

function jobplanetCompanyId(url){const m=String(url||'').match(/jobplanet\.co\.kr\/companies\/(\d+)/i);return m?m[1]:''}
function jobplanetCompanyUrl(id,kind='reviews'){return `https://www.jobplanet.co.kr/companies/${id}/${kind}`}
function parseJobplanetCompanyAnchors(html,base,company){
  const out=[];const source=String(html||'');const re=/<a\b[^>]*href=["']([^"']*\/companies\/(\d+)[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;let m;
  while((m=re.exec(source))){
    const url=absoluteUrl(m[1],base);if(!jobplanetCompanyId(url))continue;
    const around=stripTags(source.slice(Math.max(0,m.index-700),Math.min(source.length,re.lastIndex+1100)));
    const title=stripTags(m[3]);
    const item={title:title||company,url,snippet:around,publishedAt:null,provider:'JobPlanet public search',query:'direct'};
    if(relevantToCompany(company,item))out.push(item);
  }
  return dedupeCandidates(out);
}
async function discoverJobplanetCompany(company,candidates){
  const collected=[];
  for(const item of candidates||[]){if(jobplanetCompanyId(item.url)&&/jobplanet\.co\.kr$/i.test(sourceHost(item.url))&&relevantToCompany(company,item))collected.push(item)}

  const targeted=[
    `site:jobplanet.co.kr/companies "${company}" 기업리뷰`,
    `site:jobplanet.co.kr/companies "${company}" 면접후기`,
    `site:jobplanet.co.kr/companies "${company}" 리뷰평점`
  ];
  const targetedResults=await Promise.all(targeted.map(runQuery));
  for(const result of targetedResults){for(const item of result.items){if(jobplanetCompanyId(item.url)&&/jobplanet\.co\.kr$/i.test(sourceHost(item.url))&&relevantToCompany(company,item))collected.push(item)}}

  const directUrls=[
    `https://www.jobplanet.co.kr/search?query=${encodeURIComponent(company)}`,
    `https://www.jobplanet.co.kr/search/companies?query=${encodeURIComponent(company)}`,
    `https://www.jobplanet.co.kr/companies?query=${encodeURIComponent(company)}`
  ];
  for(const url of directUrls){
    try{const html=await fetchText(url,8000);collected.push(...parseJobplanetCompanyAnchors(html,url,company));}catch{}
  }

  const unique=dedupeCandidates(collected);
  if(!unique.length)return null;
  const aliases=companyAliases(company);
  unique.sort((a,b)=>{
    const score=item=>{
      const title=entityText(item.title);const snippet=entityText(item.snippet);let s=0;
      if(aliases.some(alias=>title.includes(alias)))s+=8;
      if(aliases.some(alias=>snippet.includes(alias)))s+=4;
      if(/기업리뷰|리뷰평점|면접후기|전체 리뷰/i.test(`${item.title} ${item.snippet}`))s+=3;
      if(/\/reviews/i.test(item.url))s+=2;
      return s;
    };
    return score(b)-score(a);
  });
  const chosen=unique[0];
  const id=jobplanetCompanyId(chosen.url);
  const text=unique.filter(item=>jobplanetCompanyId(item.url)===id).map(item=>`${item.title} ${item.snippet}`).join(' ');
  return {id,url:chosen.url,text,items:unique.filter(item=>jobplanetCompanyId(item.url)===id)};
}
function parseJobplanetAggregate(text,url){
  const reviewCount=numberFrom(text,[/전체 리뷰 통계\s*\(?([\d,]+)명\)?/i,/기업리뷰\s*([\d,]+)건/i,/리뷰\s*([\d,]+)건/i,/리뷰\s*([\d,]+)(?=\s|$)/i]);
  const interviewCount=numberFrom(text,[/면접후기\s*([\d,]+)건/i,/면접\s*([\d,]+)건/i,/면접\s*([\d,]+)(?=\s|$)/i]);
  const rating=decimalFrom(text,[/전체 리뷰 통계\s*\(?[\d,]+명\)?\s*([0-5](?:\.\d+)?)/i,/([0-5](?:\.\d+)?)\s*리뷰평점/i,/리뷰평점\s*([0-5](?:\.\d+)?)/i]);
  const recommendRate=numberFrom(text,[/([\d,]+)%\s*기업 추천율/i]);
  const ceoSupportRate=numberFrom(text,[/([\d,]+)%\s*CEO 지지율/i]);
  const growthRate=numberFrom(text,[/([\d,]+)%\s*성장 가능성/i]);
  const categories={};
  const labels=[['복지·급여','복지[\\/·]?급여'],['워라밸','워라밸'],['사내문화','사내문화'],['승진기회','승진 기회'],['경영진','경영진']];
  for(const [key,label] of labels){const m=String(text||'').match(new RegExp(`${label}\\s*([0-5](?:\\.\\d+)?)`,'i'));if(m)categories[key]=Number(m[1]);}
  if(reviewCount===null&&interviewCount===null&&rating===null&&!Object.keys(categories).length)return null;
  return {platform:'잡플래닛',host:'jobplanet.co.kr',url,reviewCount,interviewCount,rating,recommendRate,ceoSupportRate,growthRate,categories,note:'잡플래닛 공개 페이지에 표시된 사용자 리뷰·면접후기 집계와 공개 통계입니다. 로그인·멤버십 영역의 개별 후기 전문은 우회 수집하지 않습니다.'};
}
async function buildPublicPlatformSignals(company,candidates){
  const discovery=await discoverJobplanetCompany(company,candidates);
  if(!discovery)return [];
  const reviewUrl=jobplanetCompanyUrl(discovery.id,'reviews');
  const landingUrl=jobplanetCompanyUrl(discovery.id,'landing');
  let combined=clean(discovery.text,12000);
  for(const url of [reviewUrl,landingUrl]){
    try{
      const html=await fetchText(url,8500);const text=pageText(html);
      if(companyAliases(company).some(alias=>entityText(text).includes(alias)))combined=clean(`${combined} ${text}`,40000);
    }catch{}
  }
  const parsed=parseJobplanetAggregate(combined,reviewUrl);
  return parsed?[parsed]:[];
}

function buildSummary(company,opinions,themes,platformSignals){
  const registered=platformSignals.reduce((n,item)=>n+(Number(item.reviewCount)||0),0);
  const interviews=platformSignals.reduce((n,item)=>n+(Number(item.interviewCount)||0),0);
  const aggregate=registered||interviews?` 공개 평판 플랫폼에서는 사용자 리뷰 ${registered||'확인 제한'}건${interviews?`, 면접후기 ${interviews}건`:''}이 등록된 것으로 확인됩니다.`:'';
  if(!opinions.length)return `${company}에 대해 회사 소개·채용공고·연봉정보는 평판에서 제외했습니다.${aggregate} 다만 자동 수집에서 내용까지 공개된 실제 경험 문장은 충분히 확보하지 못했습니다. 등록 건수와 공개 통계는 아래에 표시하고, 읽을 수 없는 후기 내용을 임의로 추정하지 않습니다.`;
  const top=themes.slice(0,4).map(t=>`${t.topic} ${t.count}건`).join(', ');
  return `${company}에 대해 회사 소개·채용공고·일반 기업정보를 평판에서 제외했습니다.${aggregate} 이 가운데 공개 검색에서 실제 경험 문장까지 확인되는 자료는 ${opinions.length}건입니다.${top?` 공개된 내용에서 반복된 주제는 ${top}입니다.`:''} 전체를 긍정·부정 한 줄 결론으로 환산하지 않습니다.`;
}
function searchLinks(company){const q=encodeURIComponent(company);const quote=encodeURIComponent(`"${company}"`);return [
  {label:'Google 실제 후기 검색',url:`https://www.google.com/search?q=${quote}+재직자+후기+퇴사+면접`},
  {label:'네이버 실제 후기 검색',url:`https://search.naver.com/search.naver?query=${q}+재직자+후기+퇴사+면접`},
  {label:'잡플래닛 검색',url:`https://www.google.com/search?q=site%3Ajobplanet.co.kr+${quote}+후기`},
  {label:'블라인드 검색',url:`https://www.google.com/search?q=site%3Ateamblind.com+${quote}`},
  {label:'사람인 기업리뷰 검색',url:`https://www.google.com/search?q=site%3Asaramin.co.kr+${quote}+기업리뷰`},
  {label:'잡코리아 기업리뷰 검색',url:`https://www.google.com/search?q=site%3Ajobkorea.co.kr+${quote}+기업리뷰+면접후기`}
]}

async function collect(company){
  const results=await Promise.all(queryPlan(company).map(runQuery));
  const raw=dedupeCandidates(results.flatMap(r=>r.items));
  const companyMatched=raw.filter(item=>relevantToCompany(company,item));
  const platformSignals=await buildPublicPlatformSignals(company,raw);
  const opinions=buildOpinions(company,companyMatched);
  return {raw,companyMatched,opinions,platformSignals,providerSuccesses:results.reduce((n,r)=>n+r.successes,0),providerFailures:results.reduce((n,r)=>n+r.failures,0)};
}

export async function onRequestPost({request}){
  let body;try{body=await request.json()}catch{return json({ok:false,error:'invalid_json'},400)}
  const company=clean(body?.company||body?.target,120);
  if(company.length<2)return json({ok:false,error:'company_too_short'},400);
  const collection=await collect(company);
  const themes=buildThemes(collection.opinions);
  const platforms=buildPlatforms(collection.opinions);
  const actions=buildActions(themes);
  const indexedReviewCount=collection.platformSignals.reduce((n,item)=>n+(Number(item.reviewCount)||0),0);
  const indexedInterviewCount=collection.platformSignals.reduce((n,item)=>n+(Number(item.interviewCount)||0),0);
  return json({
    ok:true,
    schema:'nexus-company-reputation-v2',
    company,
    generatedAt:new Date().toISOString(),
    summary:buildSummary(company,collection.opinions,themes,collection.platformSignals),
    identity:{message:`회사명이 제목·검색요약·URL에 직접 연결되는 자료만 후보로 남겼습니다. 동일 상호가 존재할 수 있으므로 원문에서 법인명·지역·사업분야가 같은 회사인지 확인해야 합니다. 이번 검색에서 회사명 직접일치 후보 ${collection.companyMatched.length}건 중 회사소개·채용공고 등 비평판 자료를 분리하고 실제 경험 문장이 확인되는 ${collection.opinions.length}건만 내용 분석에 사용했습니다.`},
    metrics:{rawCandidates:collection.raw.length,companyMatched:collection.companyMatched.length,acceptedOpinions:collection.opinions.length,excludedNonOpinion:Math.max(0,collection.companyMatched.length-collection.opinions.length),platforms:platforms.length,platformSignals:collection.platformSignals.length,indexedReviewCount,indexedInterviewCount,themes:themes.length,providerSuccesses:collection.providerSuccesses,providerFailures:collection.providerFailures},
    platformSignals:collection.platformSignals,
    themes,
    platforms,
    actions,
    opinions:collection.opinions.map(o=>({id:o.id,title:o.title,url:o.url,excerpt:o.excerpt,publishedAt:o.publishedAt,host:o.host,platform:o.platform,topics:o.topics})),
    searchLinks:searchLinks(company),
    methodology:{
      accepted:'회사명이 직접 일치하고, 검색요약에 재직·퇴사·면접·근무 경험 표현과 구체적인 평가·상황 단어가 함께 나타나는 공개 자료만 내용 분석에 채택합니다. 별도로 공개 평판 플랫폼이 제공하는 사용자 리뷰 수·면접후기 수·평점·항목별 통계는 플랫폼 집계자료로 표시합니다.',
      excluded:'회사 소개, 기업정보, 채용공고, 재무정보, 홍보문구는 평판 내용에서 제외합니다. 플랫폼의 리뷰 수·평점은 사용자 집계 통계로만 별도 표시하며, 읽을 수 없는 개별 후기 내용을 추정하거나 만들어내지 않습니다.',
      coverage:'Bing·DuckDuckGo 공개 검색과 잡플래닛 공개 회사검색 경로를 이용해 잡플래닛·블라인드·사람인·잡코리아·인크루트·네이버 블로그·카페 등 공개적으로 색인된 후기와 일반 웹의 실제 경험 글을 병렬 탐색합니다. 잡플래닛 공개 리뷰 집계 페이지는 사용자 리뷰 규모와 공개 통계 확인에 사용합니다. 로그인·유료벽·비공개 게시물은 우회 수집하지 않습니다.'
    }
  });
}

export async function onRequestGet(){return json({ok:true,service:'NEXUS 구직자 회사 평판 분석',version:'6.2',schema:'nexus-company-reputation-v2',scope:'company-only-public-experience-reviews'})}
