const apiUrl = 'https://yehavha.com/api/reputation-analysis';
const evidenceUrl = 'https://yehavha.com/api/reputation-platforms';
const pageUrl = 'https://yehavha.com/reputation-analysis/';
const company = 'NEXUS검증회사';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchMainSchema() {
  let last;
  for (let attempt = 1; attempt <= 8; attempt++) {
    const response = await fetch(apiUrl, {
      method:'POST',
      headers:{'content-type':'application/json','user-agent':'YEHAVHA-Nexus-Reputation-Audit/7.0'},
      body:JSON.stringify({company})
    });
    const data = await response.json().catch(() => null);
    last = {response,data};
    if (response.ok && data?.schema === 'nexus-company-reputation-v2') return data;
    if (attempt < 8) await sleep(10000);
  }
  throw new Error(`company-reputation schema not deployed; status=${last?.response?.status}; schema=${last?.data?.schema}`);
}

async function fetchEvidenceSchema() {
  let last;
  for (let attempt = 1; attempt <= 8; attempt++) {
    const response = await fetch(`${evidenceUrl}?company=${encodeURIComponent(company)}`, {
      headers:{'user-agent':'YEHAVHA-Nexus-Reputation-Audit/7.0'}
    });
    const data = await response.json().catch(() => null);
    last = {response,data};
    if (response.ok && data?.schema === 'nexus-reputation-public-evidence-v2') return data;
    if (attempt < 8) await sleep(10000);
  }
  throw new Error(`public-evidence schema not deployed; status=${last?.response?.status}; schema=${last?.data?.schema}`);
}

const page = await fetch(pageUrl, {headers:{'user-agent':'YEHAVHA-Nexus-Reputation-Audit/7.0'}}).then(r => r.text());
if (!page.includes('구직자를 위한 회사 평판 인텔리전스')) throw new Error('jobseeker reputation intelligence title missing');
if (!page.includes('회사명 또는 법인명을 입력하세요')) throw new Error('neutral company placeholder missing');
if (page.includes('예: 지방자치연구소') || page.includes('01 · 구직자를 위한 회사 평판 분석')) throw new Error('specific-company example or legacy step label still present');
for (const forbidden of ['data-type="person"','data-type="product"','data-type="service"','data-type="place"']) {
  if (page.includes(forbidden)) throw new Error(`removed reputation category still present: ${forbidden}`);
}
if (!page.includes('공개 플랫폼 평판 지표')) throw new Error('platform reputation aggregate section missing');
if (!page.includes('공개자료 기반 회사 신호')) throw new Error('public evidence section missing');

const [data,evidenceData] = await Promise.all([fetchMainSchema(),fetchEvidenceSchema()]);
const opinions = Array.isArray(data.opinions) ? data.opinions : [];
const themes = Array.isArray(data.themes) ? data.themes : [];

if (data.company !== company) throw new Error(`company mismatch: ${data.company}`);
if ('positiveOpinions' in (data.metrics || {}) || 'negativeOpinions' in (data.metrics || {})) throw new Error('legacy positive/negative aggregate metrics still present');
if (!Array.isArray(data.searchLinks) || data.searchLinks.length < 4) throw new Error('company review verification links missing');
if (!data.methodology?.excluded?.includes('회사 소개')) throw new Error('non-opinion exclusion rule missing');
if (!data.methodology?.excluded?.includes('추정')) throw new Error('hidden review anti-fabrication rule missing');
if (opinions.some(item => !item.excerpt || item.excerpt.trim().length < 24)) throw new Error('opinion without concrete excerpt detected');
if (opinions.some(item => /(회사소개|기업소개|채용공고|재무정보)/.test(item.excerpt) && !/(야근|퇴근|워라밸|상사|대표|분위기|면접|퇴사|이직|업무|복지|급여|연봉)/.test(item.excerpt))) throw new Error('generic company information leaked into opinion evidence');
if (opinions.length && !themes.length) throw new Error('accepted opinions exist but no themes were produced');

if (!Array.isArray(evidenceData.signals)) throw new Error('platform signals contract missing');
if (!Array.isArray(evidenceData.evidence)) throw new Error('public evidence contract missing');
if (!Array.isArray(evidenceData.verificationPoints)) throw new Error('verification points contract missing');
if (!evidenceData.coverage || !Number.isFinite(Number(evidenceData.coverage.evidenceCount))) throw new Error('public evidence coverage missing');
if (evidenceData.evidence.some(item => !item.id || !item.kind || !item.label || !item.title || !item.url)) throw new Error('invalid public evidence record');

console.log(`Company reputation audit passed: publicExcerpts=${opinions.length}, themes=${themes.length}, platformSignals=${evidenceData.signals.length}, publicEvidence=${evidenceData.evidence.length}, verificationPoints=${evidenceData.verificationPoints.length}`);