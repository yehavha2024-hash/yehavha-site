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
function unwrapDdg(href){const raw=decodeHtml(href);try{const u=new URL(raw,'https://html.duckduckgo.com');const uddg=u.searchParams.get('uddg');return uddg?decodeURIComponent(uddg):u.href}catch{return raw}}
async function fetchText(url,timeoutMs=6500){const c=new AbortController();const timer=setTimeout(()=>c.abort(),timeoutMs);try{const r=await fetch(url,{headers:{accept:'text/html,application/xhtml+xml,application/rss+xml,application/xml;q=0.9,*/*;q=0.7','user-agent':'Mozilla/5.0 (compatible; YEHAVHA-NEXUS-Reputation-Public-Evidence/2.1; +https://yehavha.com/)'},signal:c.signal});if(!r.ok)throw new Error(`upstream_${r.status}`);return await r.text()}finally{clearTimeout(timer)}}
function bingRssUrl(q){return `https://www.bing.com/search?format=rss&setlang=ko-KR&cc=KR&q=${encodeURIComponent(q)}`}
function ddgHtmlUrl(q){return `https://html.duckduckgo.com/html/?kl=kr-kr&q=${encodeURIComponent(q)}`}
function parseRss(xml){const out=[];for(const block of String(xml||'').match(/<item\b[\s\S]*?<\/item>/gi)||[]){const title=tag(block,'title'),url=tag(block,'link'),snippet=tag(block,'description'),publishedAt=tag(block,'pubDate');if(title&&/^https?:\/\//i.test(url))out.push({title,url,snippet,publishedAt:publishedAt||null});if(out.length>=16)break}return out}
function parseDdg(html){const out=[];for(const block of String(html||'').match(/<div[^>]+class="[^"]*result[^"]*"[\s\S]*?(?=<div[^>]+class="[^"]*result[^"]*"|$)/gi)||[]){const a=block.match(/<a[^>]+class="[^"]*result__a[^"]*"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i)||block.match(/<a[^>]+href="([^"]+)"[^>]+class="[^"]*result__a[^"]*"[^>]*>([\s\S]*?)<\/a>/i);if(!a)continue;const s=block.match(/<(?:a|div)[^>]+class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/(?:a|div)>/i);const url=unwrapDdg(a[1]);if(/^https?:\/\//i.test(url))out.push({title:stripTags(a[2]),url,snippet:s?stripTags(s[1]):'',publishedAt:null});if(out.length>=16)break}return out}
async function search(query){const settled=await Promise.allSettled([fetchText(bingRssUrl(query)).then(parseRss),fetchText(ddgHtmlUrl(query)).then(parseDdg)]);return {items:settled.flatMap(r=>r.status==='fulfilled'?r.value:[]),successes:settled.filter(r=>r.status==='fulfilled').length,failures:settled.filter(r=>r.status==='rejected').length}}
function unique(items){const seen=new Set(),out=[];for(const item of items){const key=item.url;if(!key||seen.has(key))continue;seen.add(key);out.push(item)}return out}
function firstNumber(text,patterns){for(const pattern of patterns){const m=String(text||'').match(pattern);if(m){const n=Number(String(m[1]).replace(/,/g,''));if(Number.isFinite(n))return n}}return null}

const HOSTS={
  reputation:/(^|\.)(jobplanet\.co\.kr|teamblind\.com|blind\.com|saramin\.co\.kr|jobkorea\.co\.kr|wanted\.co\.kr|catch\.co\.kr)$/i,
  recruiting:/(^|\.)(saramin\.co\.kr|jobkorea\.co\.kr|wanted\.co\.kr|incruit\.com|career\.co\.kr|catch\.co\.kr)$/i,
  official:/(^|\.)(go\.kr|scourt\.go\.kr|law\.go\.kr|fss\.or\.kr|dart\.fss\.or\.kr|kisa\.or\.kr|or\.kr)$/i,
  media:/(^|\.)(yna\.co\.kr|yonhapnews\.co\.kr|newsis\.com|mk\.co\.kr|hankyung\.com|sedaily\.com|edaily\.co\.kr|fnnews\.com|mt\.co\.kr|etnews\.com|zdnet\.co\.kr|chosun\.com|joongang\.co\.kr|donga\.com|hani\.co\.kr|kmib\.co\.kr|reuters\.com|apnews\.com)$/i
};
const LEGAL_TERMS=/(판결|소송|행정처분|과징금|과태료|시정명령|고발|기소|노동위원회|체불|임금|산재|공정위|국세청|감사원|제재|처분)/i;
const RECRUIT_TERMS=/(채용|모집|구인|입사|면접|경력|신입|채용공고)/i;

const CURATED_PUBLIC_SNAPSHOTS=Object.freeze({
  '지방자치연구소':{
    capturedAt:'2026-09-16',
    period:'2018–2026',
    signal:{
      platform:'잡플래닛',
      host:'jobplanet.co.kr',
      participantCount:52,
      rating:1.4,
      recommendRate:13,
      ceoSupportRate:17,
      growthRate:8,
      categories:{'복지·급여':1.5,'워라밸':1.5,'사내문화':1.4,'승진기회':1.4,'경영진':1.4},
      positiveMentions:['위치·주변환경','점심 제공','다양한 업무 경험','국가 컨소시엄 관련 업무 경험','일부 동료관계'],
      interpretation:'2018~2026년 여러 직군의 익명 리뷰에서 유사 주제가 반복된다는 점은 조직문화 신호로 볼 수 있으나, 각 익명 작성자의 개별 주장과 법 위반 여부를 사실로 확정할 수는 없습니다.',
      sourceLabel:'사용자 제출 공개 페이지 캡처 · 2026-09-16',
      note:'잡플래닛 공개 화면에 표시된 전체 리뷰 통계 52명과 평점·항목별 수치입니다. 로그인·멤버십 영역을 우회 수집한 자료가 아닙니다.'
    },
    themes:[
      {topic:'대표 중심 의사결정·조직운영',countLabel:'장기간 반복',note:'여러 연도·직군의 익명 리뷰에서 대표 개인에게 의사결정이 집중되고 업무가 대표 판단에 좌우된다는 취지의 주장이 반복됩니다.'},
      {topic:'업무체계·업무분장 미비',countLabel:'반복 확인',note:'업무분장, 인수인계, 시스템 부족과 한 사람이 여러 업무를 맡는다는 취지의 서술이 반복됩니다.'},
      {topic:'근로시간·야근·주말근무',countLabel:'반복 확인',note:'야근, 늦은 퇴근, 주말·행사 업무와 추가근무 보상에 관한 불만이 여러 시기의 리뷰에서 반복됩니다.'},
      {topic:'퇴사·이직·근속 불안정',countLabel:'반복 확인',note:'직원 교체가 잦고 입·퇴사가 반복된다는 취지의 주장이 여러 리뷰에 나타납니다.'},
      {topic:'보상·복지',countLabel:'반복 확인',note:'급여·연봉·복지 및 추가근무 보상에 대한 낮은 평가가 반복되며, 플랫폼 집계에서도 복지·급여가 1.5/5로 표시됩니다.'},
      {topic:'커뮤니케이션·조직문화',countLabel:'반복 확인',note:'고성·질책 등 강압적 커뮤니케이션과 경직된 조직문화에 관한 익명 주장이 여러 시기에 등장합니다.'}
    ],
    verificationPoints:[
      {title:'보고라인과 의사결정 구조 확인',text:'직속 보고라인, 대표 직접보고 빈도, 업무 우선순위 변경 권한, 담당자가 독립적으로 결정할 수 있는 범위를 면접에서 구체적으로 확인하십시오.',refs:['제출 잡플래닛 공개화면']},
      {title:'실제 근무시간과 추가근무 보상 확인',text:'최근 3개월 기준 평균 퇴근시간, 야근·주말·행사 근무 빈도, 연장·휴일근로 수당 또는 대체휴무 기준을 근로계약·취업규칙과 함께 확인하십시오.',refs:['제출 잡플래닛 공개화면']},
      {title:'공석 사유와 최근 근속 현황 확인',text:'지원 직무의 전임자 퇴사 사유와 근속기간, 최근 1년 팀 입·퇴사 인원, 이번 채용이 증원인지 대체채용인지 확인하십시오.',refs:['제출 잡플래닛 공개화면']},
      {title:'업무분장과 인수인계 확인',text:'입사 후 담당업무 목록, 겸임 업무, 인수인계 문서, 결원 발생 시 추가업무 배분 기준을 구체적으로 확인하십시오.',refs:['제출 잡플래닛 공개화면']},
      {title:'보상·연차·최근 제도개선 확인',text:'기본급·연봉인상 기준·성과급·연차 사용 절차와 함께 최근 1~2년 사이 조직문화·근로시간·인사제도가 실제로 개선됐는지 확인하십시오.',refs:['제출 잡플래닛 공개화면']}
    ],
    summary:'사용자가 제출한 잡플래닛 공개 화면에는 전체 리뷰 통계 52명, 종합평점 1.4/5, 기업추천율 13%, CEO 지지율 17%, 성장가능성 8%가 표시됩니다. 2018~2026년 여러 직군의 익명 리뷰에서는 대표 중심 의사결정, 업무체계·분장, 근로시간, 인력교체, 보상, 커뮤니케이션 문제가 반복적으로 제기됩니다. 이는 반복 평판 신호이며 개별 익명 주장의 사실 여부나 위법 여부를 확정하는 자료는 아닙니다.'
  }
});
function curatedSnapshot(company){return CURATED_PUBLIC_SNAPSHOTS[canonicalCompany(company)]||null}

function saraminCultureTags(text){const patterns=[/평균근속\s*\d+년\s*(?:미만|이상)?/i,/정시출근/i,/야근\s*(?:강요\s*)?(?:안함|없음|적음)/i,/간단한\s*식사회식/i,/회식\s*(?:강요\s*)?(?:안함|없음|적음)/i,/평균\s*연령\s*\d+대/i,/프리한\s*복장\s*가능/i,/자유로운\s*연차/i,/수평적\s*문화/i,/자율복장/i];const tags=[];for(const pattern of patterns){const m=String(text||'').match(pattern);if(m&&!tags.includes(m[0]))tags.push(clean(m[0],60))}return tags.slice(0,8)}

async function collectSaramin(company){const searched=await Promise.all([search(`site:saramin.co.kr/zf_user/company-review/view "${company}"`),search(`site:saramin.co.kr "${company}" 기업리뷰 통계 리뷰`)]);const results=unique(searched.flatMap(x=>x.items)).filter(item=>/saramin\.co\.kr$/i.test(sourceHost(item.url))&&/company-review\/view/i.test(item.url)&&companyMatch(company,`${item.title} ${item.snippet}`));if(!results.length)return null;const candidate=results[0];let text=clean(`${candidate.title} ${candidate.snippet}`,12000);try{const html=await fetchText(candidate.url,8000);const page=stripTags(html);if(companyMatch(company,page))text=clean(`${text} ${page}`,30000)}catch{}const participantCount=firstNumber(text,[/([\d,]+)명이\s*참여한\s*통계\s*&?\s*리뷰/i,/전체\s*리뷰\s*통계\s*\(?([\d,]+)명\)?/i]);const cultureTags=saraminCultureTags(text);if(participantCount===null&&!cultureTags.length)return null;const noteParts=[];if(participantCount!==null)noteParts.push(`공개 기업리뷰 참여 ${participantCount}명`);if(cultureTags.length)noteParts.push(`직원들이 뽑은 공개 기업문화: ${cultureTags.join(' · ')}`);return {platform:'사람인',host:'saramin.co.kr',url:candidate.url,participantCount,cultureTags,note:noteParts.join('. ')}}

function classifyEvidence(item,queryKind){const host=sourceHost(item.url);const text=`${item.title} ${item.snippet}`;if(HOSTS.reputation.test(host))return {kind:'reputation',label:'평판 플랫폼'};if(HOSTS.official.test(host)&&LEGAL_TERMS.test(text))return {kind:'official',label:'공공·공식 자료'};if(queryKind==='legal'&&LEGAL_TERMS.test(text)&&HOSTS.media.test(host))return {kind:'legal-media',label:'법률·분쟁 보도'};if(HOSTS.recruiting.test(host)&&RECRUIT_TERMS.test(text))return {kind:'recruiting',label:'채용·구인 자료'};if(HOSTS.media.test(host))return {kind:'media',label:'언론 보도'};return null}

async function collectEvidence(company){const specs=[
  {kind:'reputation',query:`"${company}" 기업리뷰 면접후기 직원 후기`},
  {kind:'recruiting',query:`"${company}" 채용 구인 경력 신입`},
  {kind:'legal',query:`"${company}" 판결 소송 행정처분 노동`},
  {kind:'media',query:`"${company}" 뉴스 경영 조직 사업`}
];
  const settled=await Promise.all(specs.map(async spec=>({spec,result:await search(spec.query)})));
  const candidates=[];let successes=0,failures=0;
  for(const {spec,result} of settled){successes+=result.successes;failures+=result.failures;for(const item of result.items){if(!companyMatch(company,`${item.title} ${item.snippet} ${item.url}`))continue;const classified=classifyEvidence(item,spec.kind);if(!classified)continue;candidates.push({...item,...classified,host:sourceHost(item.url),queryKind:spec.kind})}}
  const deduped=unique(candidates).slice(0,16).map((item,index)=>({id:`E${index+1}`,kind:item.kind,label:item.label,title:clean(item.title,220),snippet:clean(item.snippet,360),host:item.host,url:item.url,publishedAt:item.publishedAt||null}));
  return {items:deduped,sourceStatus:{searchProvidersSucceeded:successes,searchProvidersFailed:failures}}
}

function verificationPoints(evidence){const kinds=new Set(evidence.map(item=>item.kind));const points=[];if(kinds.has('recruiting'))points.push({title:'공석 사유와 채용 반복 여부 확인',text:'채용공고가 확인된 경우 신규증원인지 퇴사자 대체인지, 같은 직무의 최근 채용 빈도와 전임자 근속기간을 면접에서 확인하십시오.',refs:evidence.filter(x=>x.kind==='recruiting').slice(0,3).map(x=>x.id)});if(kinds.has('official')||kinds.has('legal-media'))points.push({title:'공식 사건·처분 상태 재확인',text:'소송·처분·노동 관련 공개자료는 검색 제목만으로 결론내리지 말고 사건번호, 처분기관, 현재 절차와 확정 여부를 공식 원문에서 다시 확인하십시오.',refs:evidence.filter(x=>x.kind==='official'||x.kind==='legal-media').slice(0,3).map(x=>x.id)});if(kinds.has('media'))points.push({title:'최근 조직·사업 변화 확인',text:'언론에 확인되는 조직·사업 변화가 있다면 실제 담당업무, 조직개편 여부, 인력변동과 근로조건에 미치는 영향을 면접에서 확인하십시오.',refs:evidence.filter(x=>x.kind==='media').slice(0,3).map(x=>x.id)});if(kinds.has('reputation'))points.push({title:'평판 표본과 최신성 확인',text:'평판 플랫폼의 리뷰 수·평점과 개별 후기 문장은 서로 다른 근거이므로 작성시점, 표본규모, 반복주제를 나눠 확인하십시오.',refs:evidence.filter(x=>x.kind==='reputation').slice(0,3).map(x=>x.id)});return points.slice(0,5)}

export async function onRequestGet({request}){
  const url=new URL(request.url);const company=clean(url.searchParams.get('company'),120);if(company.length<2)return json({ok:false,error:'company_too_short'},400);
  const [saraminResult,evidenceResult]=await Promise.allSettled([collectSaramin(company),collectEvidence(company)]);
  const curated=curatedSnapshot(company);
  const signals=[];
  if(saraminResult.status==='fulfilled'&&saraminResult.value)signals.push(saraminResult.value);
  if(curated?.signal)signals.push(curated.signal);
  const evidence=evidenceResult.status==='fulfilled'?evidenceResult.value.items:[];
  const sourceStatus=evidenceResult.status==='fulfilled'?evidenceResult.value.sourceStatus:{searchProvidersSucceeded:0,searchProvidersFailed:0};
  const kinds=[...new Set(evidence.map(item=>item.kind))];
  const basePoints=verificationPoints(evidence);
  const submittedPoints=curated?.verificationPoints||[];
  return json({ok:true,schema:'nexus-reputation-public-evidence-v3',company,signals,evidence,verificationPoints:[...submittedPoints,...basePoints].slice(0,8),submittedThemes:curated?.themes||[],snapshotSummary:curated?.summary||'',snapshotMeta:curated?{source:'사용자 제출 공개 페이지 캡처',platform:'잡플래닛',capturedAt:curated.capturedAt,period:curated.period}:null,coverage:{evidenceCount:evidence.length,kindCount:kinds.length,kinds},sourceStatus,generatedAt:new Date().toISOString(),note:curated?'평판 플랫폼 공개 집계와 사용자가 제출한 공개 페이지 캡처를 보강 근거로 사용하고, 채용·공공기관·언론 자료와 분리합니다. 익명 리뷰의 개별 주장은 사실 또는 위법행위로 확정하지 않습니다.':'평판 플랫폼 사용자 집계와 채용·공공기관·언론 등 기타 공개자료를 서로 다른 근거로 분리합니다. 검색결과 제목·요약은 탐색 신호이며 위법·부정행위의 확정 근거로 사용하지 않습니다.'});
}