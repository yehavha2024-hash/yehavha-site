function json(body,status=200){return new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store, max-age=0','x-content-type-options':'nosniff'}})}
function clean(value,max=20000){return String(value||'').replace(/\s+/g,' ').trim().slice(0,max)}
function decodeHtml(value){return String(value||'').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n))).replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCharCode(parseInt(n,16))).replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&nbsp;/g,' ')}
function stripTags(value){return decodeHtml(value).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}
function tag(block,name){const m=String(block||'').match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`,'i'));return m?stripTags(m[1]):''}
function entityText(value){return String(value||'').normalize('NFKC').toLowerCase().replace(/[\s"'`’‘“”·ㆍ•:;,.!?()[\]{}<>/\\|_+=~^*-]+/g,'')}
function aliases(company){const raw=String(company||'').normalize('NFKC').trim();return [...new Set([raw,raw.replace(/\(주\)|㈜|주식회사|유한회사|재단법인|사단법인/gi,'').trim()])].map(entityText).filter(v=>v.length>=2)}
function companyMatch(company,text){const hay=entityText(text);return aliases(company).some(alias=>hay.includes(alias))}
function canonicalCompany(value){return String(value||'').normalize('NFKC').replace(/\s+/g,'').replace(/\(주\)|㈜|주식회사|유한회사|재단법인|사단법인/gi,'').toLowerCase()}
function sourceHost(url){try{return new URL(url).hostname.replace(/^www\./,'')}catch{return ''}}
function decodeBase64Url(v){try{let s=String(v||'').replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';return atob(s)}catch{return ''}}
function unwrapSearchUrl(v){const raw=decodeHtml(v);try{const u=new URL(raw,'https://www.bing.com');if(/(^|\.)bing\.com$/i.test(u.hostname)){const q=u.searchParams.get('u');if(q){const d=decodeBase64Url(q.startsWith('a1')?q.slice(2):q);if(/^https?:\/\//i.test(d))return d}}const uddg=u.searchParams.get('uddg');if(uddg){const d=decodeURIComponent(uddg);if(/^https?:\/\//i.test(d))return d}return u.href}catch{return raw}}
async function fetchText(url,timeoutMs=6500){const c=new AbortController();const timer=setTimeout(()=>c.abort(),timeoutMs);try{const r=await fetch(url,{headers:{accept:'text/html,application/xhtml+xml,application/rss+xml,application/xml;q=0.9,*/*;q=0.7','user-agent':'Mozilla/5.0 (compatible; YEHAVHA-NEXUS-Company-Intelligence/3.0; +https://yehavha.com/)'},signal:c.signal});if(!r.ok)throw new Error(`upstream_${r.status}`);return await r.text()}finally{clearTimeout(timer)}}
function bingRssUrl(q){return `https://www.bing.com/search?format=rss&setlang=ko-KR&cc=KR&q=${encodeURIComponent(q)}`}
function bingHtmlUrl(q){return `https://www.bing.com/search?setlang=ko-KR&cc=KR&count=20&q=${encodeURIComponent(q)}`}
function ddgHtmlUrl(q){return `https://html.duckduckgo.com/html/?kl=kr-kr&q=${encodeURIComponent(q)}`}
function parseRss(xml,query){const out=[];for(const block of String(xml||'').match(/<item\b[\s\S]*?<\/item>/gi)||[]){const title=tag(block,'title'),url=unwrapSearchUrl(tag(block,'link')),snippet=tag(block,'description'),publishedAt=tag(block,'pubDate');if(title&&/^https?:\/\//i.test(url))out.push({title,url,snippet,publishedAt:publishedAt||null,query});if(out.length>=18)break}return out}
function parseBingHtml(html,query){const out=[];for(const block of String(html||'').match(/<li[^>]+class="[^"]*b_algo[^"]*"[\s\S]*?<\/li>/gi)||[]){const a=block.match(/<h2[^>]*>\s*<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);if(!a)continue;const p=block.match(/<p[^>]*>([\s\S]*?)<\/p>/i),url=unwrapSearchUrl(a[1]);if(/^https?:\/\//i.test(url))out.push({title:stripTags(a[2]),url,snippet:p?stripTags(p[1]):'',publishedAt:null,query});if(out.length>=18)break}return out}
function parseDdg(html,query){const out=[];for(const block of String(html||'').match(/<div[^>]+class="[^"]*result[^"]*"[\s\S]*?(?=<div[^>]+class="[^"]*result[^"]*"|$)/gi)||[]){const a=block.match(/<a[^>]+class="[^"]*result__a[^"]*"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i)||block.match(/<a[^>]+href="([^"]+)"[^>]+class="[^"]*result__a[^"]*"[^>]*>([\s\S]*?)<\/a>/i);if(!a)continue;const s=block.match(/<(?:a|div)[^>]+class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/(?:a|div)>/i),url=unwrapSearchUrl(a[1]);if(/^https?:\/\//i.test(url))out.push({title:stripTags(a[2]),url,snippet:s?stripTags(s[1]):'',publishedAt:null,query});if(out.length>=18)break}return out}
async function search(query){const settled=await Promise.allSettled([fetchText(bingRssUrl(query)).then(x=>parseRss(x,query)),fetchText(bingHtmlUrl(query)).then(x=>parseBingHtml(x,query)),fetchText(ddgHtmlUrl(query)).then(x=>parseDdg(x,query))]);return {items:settled.flatMap(r=>r.status==='fulfilled'?r.value:[]),successes:settled.filter(r=>r.status==='fulfilled').length,failures:settled.filter(r=>r.status==='rejected').length}}
function unique(items){const seen=new Set(),out=[];for(const item of items){const key=String(item.url||'').replace(/#.*$/,'');if(!key||seen.has(key))continue;seen.add(key);out.push({...item,url:key})}return out}
function firstNumber(text,patterns){for(const pattern of patterns){const m=String(text||'').match(pattern);if(m){const n=Number(String(m[1]).replace(/,/g,''));if(Number.isFinite(n))return n}}return null}

const HOSTS={
  reputation:/(^|\.)(jobplanet\.co\.kr|teamblind\.com|blind\.com|saramin\.co\.kr|jobkorea\.co\.kr|wanted\.co\.kr|catch\.co\.kr|incruit\.com)$/i,
  recruiting:/(^|\.)(saramin\.co\.kr|jobkorea\.co\.kr|wanted\.co\.kr|incruit\.com|career\.co\.kr|catch\.co\.kr|rememberapp\.co\.kr)$/i,
  official:/(^|\.)(go\.kr|scourt\.go\.kr|law\.go\.kr|fss\.or\.kr|dart\.fss\.or\.kr|kisa\.or\.kr|or\.kr)$/i,
  media:/(^|\.)(yna\.co\.kr|yonhapnews\.co\.kr|newsis\.com|mk\.co\.kr|hankyung\.com|sedaily\.com|edaily\.co\.kr|fnnews\.com|mt\.co\.kr|etnews\.com|zdnet\.co\.kr|chosun\.com|joongang\.co\.kr|donga\.com|hani\.co\.kr|kmib\.co\.kr|reuters\.com|apnews\.com|news\.naver\.com)$/i
};
const PROFILE_TERMS=/(기업정보|기업개요|회사소개|사업내용|설립|대표자|직원수|사원수|매출|본사|업종|주요사업|기업형태)/i;
const RECRUIT_TERMS=/(채용|모집|구인|입사|경력|신입|채용공고|직무|자격요건|근무지)/i;
const SALARY_TERMS=/(연봉|평균연봉|급여|초봉|보상|성과급|임금|연봉정보)/i;
const REPUTATION_TERMS=/(기업리뷰|리뷰|후기|면접후기|재직자|전직자|퇴사|워라밸|조직문화|경영진|복지)/i;
const LEGAL_TERMS=/(판결|소송|행정처분|과징금|과태료|시정명령|고발|기소|노동위원회|체불|임금|산재|공정위|국세청|감사원|제재|처분)/i;
const NEWS_TERMS=/(뉴스|발표|투자|실적|사업|계약|수주|조직|인사|협약|출시|확대|감축|매출|영업이익|분기|연간)/i;

const CURATED_PUBLIC_SNAPSHOTS=Object.freeze({
  '지방자치연구소':{
    capturedAt:'2026-09-16',period:'2018–2026',
    signal:{platform:'잡플래닛',host:'jobplanet.co.kr',participantCount:52,rating:1.4,recommendRate:13,ceoSupportRate:17,growthRate:8,categories:{'복지·급여':1.5,'워라밸':1.5,'사내문화':1.4,'승진기회':1.4,'경영진':1.4},positiveMentions:['위치·주변환경','점심 제공','다양한 업무 경험','국가 컨소시엄 관련 업무 경험','일부 동료관계'],interpretation:'2018~2026년 여러 직군의 익명 리뷰에서 유사 주제가 반복된다는 점은 조직문화 신호로 볼 수 있으나, 각 익명 작성자의 개별 주장과 법 위반 여부를 사실로 확정할 수는 없습니다.',sourceLabel:'잡플래닛 공개 화면 · 2026-09-16',note:'잡플래닛 화면에 표시된 전체 리뷰 통계 52명과 평점·항목별 수치입니다.'},
    themes:[
      {topic:'대표 중심 의사결정·조직운영',countLabel:'장기간 반복',note:'여러 연도·직군의 익명 리뷰에서 대표 개인에게 의사결정이 집중되고 업무가 대표 판단에 좌우된다는 취지의 주장이 반복됩니다.'},
      {topic:'업무체계·업무분장 미비',countLabel:'반복 확인',note:'업무분장, 인수인계, 시스템 부족과 한 사람이 여러 업무를 맡는다는 취지의 서술이 반복됩니다.'},
      {topic:'근로시간·야근·주말근무',countLabel:'반복 확인',note:'야근, 늦은 퇴근, 주말·행사 업무와 추가근무 보상에 관한 불만이 여러 시기의 리뷰에서 반복됩니다.'},
      {topic:'퇴사·이직·근속 불안정',countLabel:'반복 확인',note:'직원 교체가 잦고 입·퇴사가 반복된다는 취지의 주장이 여러 리뷰에 나타납니다.'},
      {topic:'보상·복지',countLabel:'반복 확인',note:'급여·연봉·복지 및 추가근무 보상에 대한 낮은 평가가 반복되며, 플랫폼 집계에서도 복지·급여가 1.5/5로 표시됩니다.'},
      {topic:'커뮤니케이션·조직문화',countLabel:'반복 확인',note:'고성·질책 등 강압적 커뮤니케이션과 경직된 조직문화에 관한 익명 주장이 여러 시기에 등장합니다.'}
    ],
    verificationPoints:[
      {title:'보고라인과 의사결정 구조 확인',text:'직속 보고라인, 대표 직접보고 빈도, 업무 우선순위 변경 권한, 담당자가 독립적으로 결정할 수 있는 범위를 면접에서 구체적으로 확인하십시오.',refs:['잡플래닛 공개화면']},
      {title:'실제 근무시간과 추가근무 보상 확인',text:'최근 3개월 기준 평균 퇴근시간, 야근·주말·행사 근무 빈도, 연장·휴일근로 수당 또는 대체휴무 기준을 근로계약·취업규칙과 함께 확인하십시오.',refs:['잡플래닛 공개화면']},
      {title:'공석 사유와 최근 근속 현황 확인',text:'지원 직무의 전임자 퇴사 사유와 근속기간, 최근 1년 팀 입·퇴사 인원, 이번 채용이 증원인지 대체채용인지 확인하십시오.',refs:['잡플래닛 공개화면']},
      {title:'업무분장과 인수인계 확인',text:'입사 후 담당업무 목록, 겸임 업무, 인수인계 문서, 결원 발생 시 추가업무 배분 기준을 구체적으로 확인하십시오.',refs:['잡플래닛 공개화면']},
      {title:'보상·연차·최근 제도개선 확인',text:'기본급·연봉인상 기준·성과급·연차 사용 절차와 함께 최근 1~2년 사이 조직문화·근로시간·인사제도가 실제로 개선됐는지 확인하십시오.',refs:['잡플래닛 공개화면']}
    ],
    summary:'잡플래닛 화면에는 전체 리뷰 통계 52명, 종합평점 1.4/5, 기업추천율 13%, CEO 지지율 17%, 성장가능성 8%가 표시됩니다. 2018~2026년 여러 직군의 익명 리뷰에서는 대표 중심 의사결정, 업무체계·분장, 근로시간, 인력교체, 보상, 커뮤니케이션 문제가 반복적으로 제기됩니다. 이는 반복 평판 신호이며 개별 익명 주장의 사실 여부나 위법 여부를 확정하는 자료는 아닙니다.'
  }
});
function curatedSnapshot(company){return CURATED_PUBLIC_SNAPSHOTS[canonicalCompany(company)]||null}

function saraminCultureTags(text){const patterns=[/평균근속\s*\d+년\s*(?:미만|이상)?/i,/정시출근/i,/야근\s*(?:강요\s*)?(?:안함|없음|적음)/i,/간단한\s*식사회식/i,/회식\s*(?:강요\s*)?(?:안함|없음|적음)/i,/평균\s*연령\s*\d+대/i,/프리한\s*복장\s*가능/i,/자유로운\s*연차/i,/수평적\s*문화/i,/자율복장/i];const tags=[];for(const pattern of patterns){const m=String(text||'').match(pattern);if(m&&!tags.includes(m[0]))tags.push(clean(m[0],60))}return tags.slice(0,8)}
async function collectSaramin(company){const searched=await Promise.all([search(`site:saramin.co.kr "${company}" 기업리뷰`),search(`site:saramin.co.kr "${company}" 기업정보 연봉`)]);const results=unique(searched.flatMap(x=>x.items)).filter(item=>/saramin\.co\.kr$/i.test(sourceHost(item.url))&&companyMatch(company,`${item.title} ${item.snippet}`));if(!results.length)return null;const candidate=results.find(x=>/company-review|기업리뷰/i.test(`${x.url} ${x.title}`))||results[0];let text=clean(`${candidate.title} ${candidate.snippet}`,12000);try{const html=await fetchText(candidate.url,8000);const page=stripTags(html);if(companyMatch(company,page))text=clean(`${text} ${page}`,30000)}catch{}const participantCount=firstNumber(text,[/([\d,]+)명이\s*참여한\s*통계\s*&?\s*리뷰/i,/전체\s*리뷰\s*통계\s*\(?([\d,]+)명\)?/i]);const cultureTags=saraminCultureTags(text);if(participantCount===null&&!cultureTags.length)return null;return {platform:'사람인',host:'saramin.co.kr',url:candidate.url,participantCount,cultureTags,note:[participantCount!==null?`공개 기업리뷰 참여 ${participantCount}명`:'',cultureTags.length?`공개 기업문화: ${cultureTags.join(' · ')}`:''].filter(Boolean).join('. ')}}

function classifyEvidence(item,queryKind){const host=sourceHost(item.url),text=`${item.title} ${item.snippet}`;if(queryKind==='profile'&&PROFILE_TERMS.test(text))return {kind:'profile',label:'회사·기업정보'};if(queryKind==='recruiting'&&(RECRUIT_TERMS.test(text)||HOSTS.recruiting.test(host)))return {kind:'recruiting',label:'채용정보'};if(queryKind==='salary'&&SALARY_TERMS.test(text))return {kind:'salary',label:'연봉·보상정보'};if(queryKind==='reputation'&&(REPUTATION_TERMS.test(text)||HOSTS.reputation.test(host)))return {kind:'reputation',label:'평판·후기'};if(queryKind==='legal'&&LEGAL_TERMS.test(text))return {kind:HOSTS.official.test(host)?'official':'legal-media',label:HOSTS.official.test(host)?'공공·공식자료':'법률·분쟁자료'};if(queryKind==='news'&&(NEWS_TERMS.test(text)||HOSTS.media.test(host)))return {kind:'media',label:'최근 뉴스·사업신호'};if(HOSTS.reputation.test(host)&&REPUTATION_TERMS.test(text))return {kind:'reputation',label:'평판·후기'};if(HOSTS.recruiting.test(host)&&SALARY_TERMS.test(text))return {kind:'salary',label:'연봉·보상정보'};if(HOSTS.recruiting.test(host)&&RECRUIT_TERMS.test(text))return {kind:'recruiting',label:'채용정보'};if(HOSTS.media.test(host))return {kind:'media',label:'최근 뉴스·사업신호'};return null}
function evidenceScore(item){const host=sourceHost(item.url);let score=0;if(HOSTS.reputation.test(host)||HOSTS.recruiting.test(host)||HOSTS.official.test(host)||HOSTS.media.test(host))score+=4;if(item.snippet?.length>80)score+=2;if(item.publishedAt)score+=1;if(item.kind==='profile'||item.kind==='salary'||item.kind==='reputation')score+=1;return score}

async function collectEvidence(company){const q=`"${company}"`;const specs=[
  {kind:'profile',query:`${q} 기업정보 회사소개 사업내용 직원수 설립`},
  {kind:'profile',query:`site:jobkorea.co.kr ${q} 기업정보`},
  {kind:'profile',query:`site:saramin.co.kr ${q} 기업정보`},
  {kind:'recruiting',query:`${q} 채용 공고 경력 신입 직무`},
  {kind:'salary',query:`${q} 연봉 평균연봉 초봉 급여`},
  {kind:'salary',query:`site:jobkorea.co.kr ${q} 연봉정보`},
  {kind:'salary',query:`site:saramin.co.kr ${q} 연봉`},
  {kind:'reputation',query:`${q} 기업리뷰 면접후기 재직자 워라밸 조직문화`},
  {kind:'reputation',query:`site:jobplanet.co.kr/companies ${q}`},
  {kind:'reputation',query:`site:teamblind.com ${q}`},
  {kind:'news',query:`${q} 뉴스 사업 실적 투자 조직 인사`},
  {kind:'legal',query:`${q} 판결 소송 행정처분 공정위 고용노동부`}
];
  const settled=await Promise.all(specs.map(async spec=>({spec,result:await search(spec.query)})));
  const candidates=[];let successes=0,failures=0;
  for(const {spec,result} of settled){successes+=result.successes;failures+=result.failures;for(const item of result.items){if(!companyMatch(company,`${item.title} ${item.snippet} ${item.url}`))continue;const classified=classifyEvidence(item,spec.kind);if(!classified)continue;candidates.push({...item,...classified,host:sourceHost(item.url),queryKind:spec.kind})}}
  const deduped=unique(candidates).sort((a,b)=>evidenceScore(b)-evidenceScore(a));
  const perKind=new Map(),selected=[];
  for(const item of deduped){const n=perKind.get(item.kind)||0;if(n>=6)continue;perKind.set(item.kind,n+1);selected.push(item);if(selected.length>=30)break}
  return {items:selected.map((item,index)=>({id:`E${index+1}`,kind:item.kind,label:item.label,title:clean(item.title,220),snippet:clean(item.snippet,420),host:item.host,url:item.url,publishedAt:item.publishedAt||null})),sourceStatus:{searchProvidersSucceeded:successes,searchProvidersFailed:failures}}
}

function buildIntelligence(evidence,signals,curated){const group=kind=>evidence.filter(x=>x.kind===kind);const pick=(kinds,max=2)=>evidence.filter(x=>kinds.includes(x.kind)).slice(0,max);const make=(key,label,items,fallback='')=>({key,label,items,text:items.length?clean(items.map(x=>x.snippet||x.title).filter(Boolean).slice(0,2).join(' / '),700):fallback});const repFallback=curated?.summary||(signals.length?signals.map(s=>[s.platform,Number.isFinite(Number(s.rating))?`평점 ${Number(s.rating).toFixed(1)}/5`:'',s.note].filter(Boolean).join(' · ')).join(' / '):'자동수집에서 직접 인용 가능한 후기 본문이 제한될 수 있습니다. 이는 플랫폼의 로그인·색인 제한 때문이며 회사에 후기가 없다는 뜻은 아닙니다.');const sections=[make('profile','회사 개요',pick(['profile'],3),'공개 검색에서 회사 개요를 직접 확인할 자료가 제한적입니다.'),make('recruiting','채용 현황',pick(['recruiting'],3),'현재 검색 결과에서 직접 연결되는 채용공고는 확인 범위가 제한적입니다.'),make('salary','연봉·보상',pick(['salary'],3),'공개 연봉·급여 정보는 출처별 기준연도와 직군 차이가 커서 직접 확인 가능한 자료가 제한적입니다.'),make('reputation','평판·근무경험',pick(['reputation'],3),repFallback),make('recent','최근 회사 신호',pick(['media','official','legal-media'],4),'최근 회사 뉴스·공식자료는 이번 검색에서 뚜렷한 항목을 확인하지 못했습니다.')];const available=sections.filter(s=>s.items.length||s.key==='reputation');return {sections,summary:`${available.map(s=>s.label).join('·')} 정보를 함께 사용해 구직 관점에서 회사를 분석했습니다. 평판 후기만으로 결론내리지 않고 채용 반복, 보상정보, 최근 사업·조직 변화와 공식자료를 함께 확인합니다.`}}

function verificationPoints(evidence){const kinds=new Set(evidence.map(item=>item.kind)),points=[];if(kinds.has('recruiting'))points.push({title:'채용의 성격 확인',text:'이번 채용이 증원인지 퇴사자 대체인지, 같은 직무의 최근 채용 빈도와 전임자 근속기간을 확인하십시오.',refs:evidence.filter(x=>x.kind==='recruiting').slice(0,3).map(x=>x.id)});if(kinds.has('salary'))points.push({title:'연봉 기준 통일해 비교',text:'공개 연봉 수치는 기준연도·직군·성과급 포함 여부가 다를 수 있습니다. 지원 직무의 기본급, 고정수당, 성과급, 수습급여를 오퍼 기준으로 다시 확인하십시오.',refs:evidence.filter(x=>x.kind==='salary').slice(0,3).map(x=>x.id)});if(kinds.has('media'))points.push({title:'최근 사업 변화와 직무 연결',text:'최근 투자·실적·사업확대·조직변화가 지원 직무의 인력수요와 업무범위에 어떤 영향을 주는지 면접에서 연결해 확인하십시오.',refs:evidence.filter(x=>x.kind==='media').slice(0,3).map(x=>x.id)});if(kinds.has('official')||kinds.has('legal-media'))points.push({title:'공식 사건·처분 상태 확인',text:'법률·분쟁 자료가 있으면 제목만으로 판단하지 말고 사건번호, 처분기관, 현재 절차와 확정 여부를 공식 원문에서 확인하십시오.',refs:evidence.filter(x=>x.kind==='official'||x.kind==='legal-media').slice(0,3).map(x=>x.id)});if(kinds.has('reputation'))points.push({title:'후기는 반복성과 최신성 중심으로 확인',text:'한두 개 후기보다 여러 시기·직군에서 같은 주제가 반복되는지, 최근 후기에서 개선 또는 악화 신호가 있는지를 확인하십시오.',refs:evidence.filter(x=>x.kind==='reputation').slice(0,3).map(x=>x.id)});return points.slice(0,6)}

export async function onRequestGet({request}){const url=new URL(request.url),company=clean(url.searchParams.get('company'),120);if(company.length<2)return json({ok:false,error:'company_too_short'},400);const [saraminResult,evidenceResult]=await Promise.allSettled([collectSaramin(company),collectEvidence(company)]),curated=curatedSnapshot(company),signals=[];if(saraminResult.status==='fulfilled'&&saraminResult.value)signals.push(saraminResult.value);if(curated?.signal)signals.push(curated.signal);const evidence=evidenceResult.status==='fulfilled'?evidenceResult.value.items:[],sourceStatus=evidenceResult.status==='fulfilled'?evidenceResult.value.sourceStatus:{searchProvidersSucceeded:0,searchProvidersFailed:0},basePoints=verificationPoints(evidence),curatedPoints=curated?.verificationPoints||[],intelligence=buildIntelligence(evidence,signals,curated);return json({ok:true,schema:'nexus-company-intelligence-v4',company,signals,evidence,intelligence,verificationPoints:[...curatedPoints,...basePoints].slice(0,8),submittedThemes:curated?.themes||[],snapshotSummary:curated?.summary||'',snapshotMeta:curated?{source:'잡플래닛 공개 화면',platform:'잡플래닛',capturedAt:curated.capturedAt,period:curated.period}:null,sourceStatus,generatedAt:new Date().toISOString(),note:'회사 개요·채용·연봉·평판·최근 뉴스·공공자료를 함께 수집해 구직 관점에서 분석합니다. 평판 자료가 제한될 때도 다른 공개정보를 활용해 회사 상태와 확인할 쟁점을 제시합니다.'})}