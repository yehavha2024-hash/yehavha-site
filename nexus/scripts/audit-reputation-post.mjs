const apiUrl = 'https://yehavha.com/api/reputation-analysis';
const pageUrl = 'https://yehavha.com/reputation-analysis/';
const company = '지방자치연구소';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchNewSchema() {
  let last;
  for (let attempt = 1; attempt <= 8; attempt++) {
    const response = await fetch(apiUrl, {
      method:'POST',
      headers:{'content-type':'application/json','user-agent':'YEHAVHA-Nexus-Reputation-Audit/6.5'},
      body:JSON.stringify({company})
    });
    const data = await response.json().catch(() => null);
    last = {response,data};
    if (response.ok && data?.schema === 'nexus-company-reputation-v2') return data;
    if (attempt < 8) await sleep(10000);
  }
  throw new Error(`new company-reputation schema not deployed; status=${last?.response?.status}; schema=${last?.data?.schema}`);
}

const page = await fetch(pageUrl, {headers:{'user-agent':'YEHAVHA-Nexus-Reputation-Audit/6.5'}}).then(r => r.text());
if (!page.includes('구직자를 위한 회사 평판 분석')) throw new Error('jobseeker company reputation title missing');
for (const forbidden of ['data-type="person"','data-type="product"','data-type="service"','data-type="place"']) {
  if (page.includes(forbidden)) throw new Error(`removed reputation category still present: ${forbidden}`);
}
if (!page.includes('회사 이름')) throw new Error('company-only input label missing');
if (!page.includes('공개 플랫폼 평판 지표')) throw new Error('platform reputation aggregate section missing');

const data = await fetchNewSchema();
const opinions = Array.isArray(data.opinions) ? data.opinions : [];
const themes = Array.isArray(data.themes) ? data.themes : [];
const platformSignals = Array.isArray(data.platformSignals) ? data.platformSignals : [];
const indexedReviews = Number(data?.metrics?.indexedReviewCount ?? 0);
const indexedInterviews = Number(data?.metrics?.indexedInterviewCount ?? 0);

if (data.company !== company) throw new Error(`company mismatch: ${data.company}`);
if ('positiveOpinions' in (data.metrics || {}) || 'negativeOpinions' in (data.metrics || {})) throw new Error('legacy positive/negative aggregate metrics still present');
if (!Array.isArray(data.searchLinks) || data.searchLinks.length < 4) throw new Error('company review verification links missing');
if (!data.methodology?.excluded?.includes('회사 소개')) throw new Error('non-opinion exclusion rule missing');
if (!data.methodology?.excluded?.includes('추정')) throw new Error('hidden review anti-fabrication rule missing');
if (opinions.some(item => !item.excerpt || item.excerpt.trim().length < 24)) throw new Error('opinion without concrete excerpt detected');
if (opinions.some(item => /(회사소개|기업소개|채용공고|재무정보)/.test(item.excerpt) && !/(야근|퇴근|워라밸|상사|대표|분위기|면접|퇴사|이직|업무|복지|급여|연봉)/.test(item.excerpt))) throw new Error('generic company information leaked into opinion evidence');
if (opinions.length && !themes.length) throw new Error('accepted opinions exist but no themes were produced');

const jobplanet = platformSignals.find(item => item?.platform === '잡플래닛');
if (!jobplanet) throw new Error(`known public JobPlanet reputation aggregate missing; signals=${JSON.stringify(platformSignals)}`);
console.log(`JobPlanet public aggregate: ${JSON.stringify(jobplanet)}`);
if (indexedReviews < 30 || Number(jobplanet.reviewCount || 0) < 30) throw new Error(`review-volume regression: indexed=${indexedReviews}, jobplanet=${jobplanet.reviewCount}`);
if (jobplanet.rating != null && (!Number.isFinite(Number(jobplanet.rating)) || Number(jobplanet.rating) <= 0 || Number(jobplanet.rating) > 5)) throw new Error(`JobPlanet rating invalid: ${jobplanet.rating}`);
if (jobplanet.interviewCount != null && Number(jobplanet.interviewCount) < 1) throw new Error(`JobPlanet interview count invalid: ${jobplanet.interviewCount}`);
if (indexedInterviews && indexedInterviews < 1) throw new Error(`indexed interview count invalid: ${indexedInterviews}`);

console.log(`Company reputation audit passed: registeredReviews=${indexedReviews}, interviewReviews=${jobplanet.interviewCount ?? 'public-runtime-unavailable'}, publicExcerpts=${opinions.length}, themes=${themes.length}, excludedNonOpinion=${data.metrics?.excludedNonOpinion ?? 0}, jobplanetRating=${jobplanet.rating ?? 'public-runtime-unavailable'}, categories=${JSON.stringify(jobplanet.categories || {})}`);
