const url = 'https://yehavha.com/api/reputation-analysis';
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 45000);

async function probe(label, probeUrl) {
  try {
    const response = await fetch(probeUrl, {
      redirect: 'follow',
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; YEHAVHA-Nexus-Reputation-Regression/1.0)' },
      signal: controller.signal
    });
    const text = await response.text();
    const hasTarget = text.includes('지방자치연구소');
    const links = [...text.matchAll(/href=["']([^"']+)["']/gi)]
      .map(match => match[1])
      .filter(href => /jobplanet|jobkorea|saramin|company|review|salary|interview|기업|리뷰|연봉|면접/i.test(href))
      .slice(0, 8);
    console.log(`PROBE ${label}: HTTP ${response.status}; final=${response.url}; bytes=${text.length}; target=${hasTarget}; links=${JSON.stringify(links)}`);
  } catch (error) {
    console.log(`PROBE ${label}: ERROR ${error.message}`);
  }
}

try {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'YEHAVHA-Nexus-Reputation-Regression/1.0'
    },
    body: JSON.stringify({ type: 'organization', target: '지방자치연구소' }),
    signal: controller.signal
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || data?.ok !== true) {
    throw new Error(`HTTP ${response.status}; payload=${JSON.stringify(data)}`);
  }

  const evidence = Array.isArray(data.evidence) ? data.evidence : [];
  const hosts = new Set(evidence.map(item => String(item?.host || '')).filter(Boolean));
  const expectedHost = [...hosts].some(host =>
    ['lgrc.co.kr', 'jobkorea.co.kr', 'saramin.co.kr', 'jobplanet.co.kr'].some(domain => host === domain || host.endsWith(`.${domain}`))
  );

  console.log(`Reputation POST current: sources=${data?.metrics?.sources}, profile=${data?.metrics?.profileSources}, reputation=${data?.metrics?.reputationSources}, hosts=${[...hosts].join(', ')}`);

  if (Number(data?.metrics?.reputationSources || 0) < 1) {
    const target = encodeURIComponent('지방자치연구소');
    await probe('jobplanet', `https://www.jobplanet.co.kr/search?query=${target}`);
    await probe('jobkorea', `https://www.jobkorea.co.kr/Search/?stext=${target}`);
    await probe('saramin', `https://www.saramin.co.kr/zf_user/search?searchword=${target}`);
  }

  if (Number(data?.metrics?.sources || 0) < 1) {
    throw new Error(`related sources still zero; metrics=${JSON.stringify(data?.metrics)}`);
  }
  if (Number(data?.metrics?.profileSources || 0) < 1) {
    throw new Error(`profile sources still zero; metrics=${JSON.stringify(data?.metrics)}`);
  }
  if (Number(data?.metrics?.reputationSources || 0) < 1) {
    throw new Error(`reputation sources still zero; metrics=${JSON.stringify(data?.metrics)}`);
  }
  if (!expectedHost) {
    throw new Error(`known public-source domains missing; hosts=${JSON.stringify([...hosts])}`);
  }

  console.log(`Reputation POST regression passed: sources=${data.metrics.sources}, profile=${data.metrics.profileSources}, reputation=${data.metrics.reputationSources}, hosts=${[...hosts].join(', ')}`);
} finally {
  clearTimeout(timer);
}
