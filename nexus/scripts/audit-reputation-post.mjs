const primaryUrl = 'https://yehavha.com/api/reputation-analysis';
const deepUrl = 'https://yehavha.com/api/reputation-analysis-deep';
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 45000);
const requestBody = JSON.stringify({ type: 'organization', target: '지방자치연구소' });

async function probe(label, probeUrl) {
  try {
    const response = await fetch(probeUrl, {
      redirect: 'follow',
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; YEHAVHA-Nexus-Reputation-Regression/3.0)' },
      signal: controller.signal
    });
    const text = await response.text();
    const hasTarget = text.includes('지방자치연구소');
    const links = [...text.matchAll(/href=["']([^"']+)["']/gi)]
      .map(match => match[1])
      .filter(href => /jobplanet|jobkorea|saramin|naver|daum|kakao|company|review|salary|interview|기업|리뷰|연봉|면접/i.test(href))
      .slice(0, 12);
    console.log(`PROBE ${label}: HTTP ${response.status}; final=${response.url}; bytes=${text.length}; target=${hasTarget}; links=${JSON.stringify(links)}`);
  } catch (error) {
    console.log(`PROBE ${label}: ERROR ${error.message}`);
  }
}

async function postJson(url, label) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'YEHAVHA-Nexus-Reputation-Regression/3.0'
    },
    body: requestBody,
    signal: controller.signal
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || data?.ok !== true) {
    throw new Error(`${label} HTTP ${response.status}; payload=${JSON.stringify(data)}`);
  }
  return data;
}

try {
  const [data, deep] = await Promise.all([
    postJson(primaryUrl, 'primary'),
    postJson(deepUrl, 'deep')
  ]);

  if (data?.schema !== 'nexus-reputation-analysis-v5') {
    throw new Error(`unexpected reputation schema: ${data?.schema}`);
  }
  if (deep?.schema !== 'nexus-reputation-deep-v1') {
    throw new Error(`unexpected deep reputation schema: ${deep?.schema}`);
  }

  const evidence = Array.isArray(data.evidence) ? data.evidence : [];
  const opinions = evidence.filter(item => item?.kind === 'opinion');
  const hosts = new Set(evidence.map(item => String(item?.host || '')).filter(Boolean));
  const opinionHostsSet = new Set(opinions.map(item => String(item?.host || '')).filter(Boolean));
  const expectedHost = [...hosts].some(host =>
    ['lgrc.co.kr', 'jobkorea.co.kr', 'saramin.co.kr', 'jobplanet.co.kr'].some(domain => host === domain || host.endsWith(`.${domain}`))
  );
  const opinionSources = Number(data?.metrics?.opinionSources ?? opinions.length);
  const opinionHosts = Number(data?.metrics?.opinionHosts ?? opinionHostsSet.size);

  const deepEvidence = Array.isArray(deep.evidence) ? deep.evidence : [];
  const deepHosts = new Set(deepEvidence.map(item => String(item?.host || '')).filter(Boolean));
  const deepSignals = Array.isArray(deep.signals) ? deep.signals : [];
  const concreteDeepItems = deepEvidence.filter(item => String(item?.snippet || '').replace(/\s+/g, ' ').trim().length >= 20);
  const deepDirect = Number(deep?.metrics?.directLinked ?? deepEvidence.filter(item => item?.identityConfidence === 'direct').length);

  const combinedKeys = new Set();
  for (const item of [...opinions, ...deepEvidence]) {
    const key = `${String(item?.url || '').replace(/#.*$/, '')}|${String(item?.title || '').trim().toLowerCase()}`;
    if (key !== '|') combinedKeys.add(key);
  }

  console.log(`Reputation primary: sources=${data?.metrics?.sources}, profile=${data?.metrics?.profileSources}, opinions=${opinionSources}, opinionHosts=${opinionHosts}, hosts=${[...hosts].join(', ')}`);
  console.log(`Reputation deep: opinions=${deepEvidence.length}, hosts=${deepHosts.size}, direct=${deepDirect}, signals=${deepSignals.length}, concrete=${concreteDeepItems.length}, hostsList=${[...deepHosts].join(', ')}`);
  console.log(`Reputation combined distinct opinion records=${combinedKeys.size}`);

  if (opinionSources < 5 || opinionHosts < 3) {
    const target = encodeURIComponent('지방자치연구소');
    await probe('jobplanet', `https://www.jobplanet.co.kr/search?query=${target}`);
    await probe('jobkorea', `https://www.jobkorea.co.kr/Search/?stext=${target}`);
    await probe('saramin', `https://www.saramin.co.kr/zf_user/search?searchword=${target}`);
    throw new Error(`primary opinion coverage too shallow; opinions=${opinionSources}, hosts=${opinionHosts}, metrics=${JSON.stringify(data?.metrics)}`);
  }
  if (Number(data?.metrics?.sources || 0) < 1 || Number(data?.metrics?.profileSources || 0) < 1) {
    throw new Error(`primary identification coverage missing; metrics=${JSON.stringify(data?.metrics)}`);
  }
  if (!expectedHost) {
    throw new Error(`known public-source domains missing; hosts=${JSON.stringify([...hosts])}`);
  }
  if (deepEvidence.length < 3 || deepHosts.size < 2) {
    const target = encodeURIComponent('지방자치연구소');
    await probe('naver', `https://search.naver.com/search.naver?where=nexearch&query=${target}`);
    await probe('daum', `https://search.daum.net/search?w=tot&q=${target}`);
    await probe('jobplanet', `https://www.jobplanet.co.kr/search?query=${target}`);
    throw new Error(`deep public-source expansion too shallow; opinions=${deepEvidence.length}, hosts=${deepHosts.size}, metrics=${JSON.stringify(deep?.metrics)}`);
  }
  if (deepSignals.length < 1 || concreteDeepItems.length < 2) {
    throw new Error(`deep content analysis missing; signals=${deepSignals.length}, concreteItems=${concreteDeepItems.length}`);
  }
  if (combinedKeys.size < 12) {
    throw new Error(`combined reputation evidence unexpectedly small; distinct=${combinedKeys.size}`);
  }

  console.log(`Reputation intelligence regression passed: primary=${opinionSources}/${opinionHosts}hosts, deep=${deepEvidence.length}/${deepHosts.size}hosts, combined=${combinedKeys.size}, signals=${deepSignals.length}`);
} finally {
  clearTimeout(timer);
}
