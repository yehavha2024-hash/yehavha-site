function json(body,status=200){return new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store, max-age=0','x-content-type-options':'nosniff'}})}
function clean(value,max=20000){return String(value||'').replace(/\s+/g,' ').trim().slice(0,max)}
function decodeHtml(value){return String(value||'').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n))).replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCharCode(parseInt(n,16))).replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&nbsp;/g,' ')}
function stripTags(value){return decodeHtml(value).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}
function tag(block,name){const m=String(block||'').match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`,'i'));return m?stripTags(m[1]):''}
function entityText(value){return String(value||'').normalize('NFKC').toLowerCase().replace(/[\s"'`’‘“”·ㆍ•:;,.!?()[\]{}<>/\\|_+=~^*-]+/g,'')}
function aliases(company){const raw=String(company||'').normalize('NFKC').trim();return [...new Set([raw,raw.replace(/\(주\)|㈜|주식회사|유한회사|재단법인|사단법인/gi,'').trim()])].map(entityText).filter(v=>v.length>=2)}
function companyMatch(company,text){const hay=entityText(text);return aliases(company).some(alias=>hay.includes(alias))}
function sourceHost(url){try{return new URL(url).hostname.replace(/^www\./,'')}catch{return ''}}
function unwrapDdg(href){const raw=decodeHtml(href);try{const u=new URL(raw,'https://html.duckduckgo.com');const uddg=u.searchParams.get('uddg');return uddg?decodeURIComponent(uddg):u.href}catch{return raw}}
async function fetchText(url,timeoutMs=8000){const c=new AbortController();const timer=setTimeout(()=>c.abort(),timeoutMs);try{const r=await fetch(url,{headers:{accept:'text/html,application/xhtml+xml,application/rss+xml,application/xml;q=0.9,*/*;q=0.7','user-agent':'Mozilla/5.0 (compatible; YEHAVHA-NEXUS-Reputation-Platforms/1.0; +https://yehavha.com/)'},signal:c.signal});if(!r.ok)throw new Error(`upstream_${r.status}`);return await r.text()}finally{clearTimeout(timer)}}
function bingRssUrl(q){return `https://www.bing.com/search?format=rss&setlang=ko-KR&cc=KR&q=${encodeURIComponent(q)}`}
function ddgHtmlUrl(q){return `https://html.duckduckgo.com/html/?kl=kr-kr&q=${encodeURIComponent(q)}`}
function parseRss(xml){const out=[];for(const block of String(xml||'').match(/<item\b[\s\S]*?<\/item>/gi)||[]){const title=tag(block,'title'),url=tag(block,'link'),snippet=tag(block,'description');if(title&&/^https?:\/\//i.test(url))out.push({title,url,snippet});if(out.length>=20)break}return out}
function parseDdg(html){const out=[];for(const block of String(html||'').match(/<div[^>]+class="[^"]*result[^"]*"[\s\S]*?(?=<div[^>]+class="[^"]*result[^"]*"|$)/gi)||[]){const a=block.match(/<a[^>]+class="[^"]*result__a[^"]*"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i)||block.match(/<a[^>]+href="([^"]+)"[^>]+class="[^"]*result__a[^"]*"[^>]*>([\s\S]*?)<\/a>/i);if(!a)continue;const s=block.match(/<(?:a|div)[^>]+class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/(?:a|div)>/i);const url=unwrapDdg(a[1]);if(/^https?:\/\//i.test(url))out.push({title:stripTags(a[2]),url,snippet:s?stripTags(s[1]):''});if(out.length>=20)break}return out}
async function search(query){const settled=await Promise.allSettled([fetchText(bingRssUrl(query)).then(parseRss),fetchText(ddgHtmlUrl(query)).then(parseDdg)]);return settled.flatMap(r=>r.status==='fulfilled'?r.value:[])}
function unique(items){const seen=new Set(),out=[];for(const item of items){const key=item.url;if(!key||seen.has(key))continue;seen.add(key);out.push(item)}return out}
function firstNumber(text,patterns){for(const pattern of patterns){const m=String(text||'').match(pattern);if(m){const n=Number(String(m[1]).replace(/,/g,''));if(Number.isFinite(n))return n}}return null}

function saraminCultureTags(text){const patterns=[
  /평균근속\s*\d+년\s*(?:미만|이상)?/i,
  /정시출근/i,
  /야근\s*(?:강요\s*)?(?:안함|없음|적음)/i,
  /간단한\s*식사회식/i,
  /회식\s*(?:강요\s*)?(?:안함|없음|적음)/i,
  /평균\s*연령\s*\d+대/i,
  /프리한\s*복장\s*가능/i,
  /자유로운\s*연차/i,
  /수평적\s*문화/i,
  /자율복장/i
];
  const tags=[];
  for(const pattern of patterns){const m=String(text||'').match(pattern);if(m&&!tags.includes(m[0]))tags.push(clean(m[0],60));}
  return tags.slice(0,8);
}

async function collectSaramin(company){
  const results=unique([
    ...await search(`site:saramin.co.kr/zf_user/company-review/view "${company}"`),
    ...await search(`site:saramin.co.kr "${company}" 기업리뷰 통계 리뷰`)
  ]).filter(item=>/saramin\.co\.kr$/i.test(sourceHost(item.url))&&/company-review\/view/i.test(item.url)&&companyMatch(company,`${item.title} ${item.snippet}`));
  if(!results.length)return null;
  const candidate=results[0];
  let text=clean(`${candidate.title} ${candidate.snippet}`,12000);
  try{const html=await fetchText(candidate.url,9000);const page=stripTags(html);if(companyMatch(company,page))text=clean(`${text} ${page}`,30000);}catch{}
  const participantCount=firstNumber(text,[/([\d,]+)명이\s*참여한\s*통계\s*&?\s*리뷰/i,/전체\s*리뷰\s*통계\s*\(?([\d,]+)명\)?/i]);
  const cultureTags=saraminCultureTags(text);
  if(participantCount===null&&!cultureTags.length)return null;
  const noteParts=[];
  if(participantCount!==null)noteParts.push(`공개 기업리뷰 참여 ${participantCount}명`);
  if(cultureTags.length)noteParts.push(`직원들이 뽑은 공개 기업문화: ${cultureTags.join(' · ')}`);
  return {platform:'사람인',host:'saramin.co.kr',url:candidate.url,participantCount,cultureTags,note:noteParts.join('. ')};
}

export async function onRequestGet({request}){
  const url=new URL(request.url);
  const company=clean(url.searchParams.get('company'),120);
  if(company.length<2)return json({ok:false,error:'company_too_short'},400);
  const settled=await Promise.allSettled([collectSaramin(company)]);
  const signals=settled.flatMap(r=>r.status==='fulfilled'&&r.value?[r.value]:[]);
  return json({ok:true,schema:'nexus-reputation-platforms-v1',company,signals,generatedAt:new Date().toISOString(),note:'공개 평판 플랫폼에서 로그인 없이 확인되는 사용자 집계·기업문화 요약만 제공합니다. 개별 후기 전문이 가려진 경우 내용을 추정하지 않습니다.'});
}
