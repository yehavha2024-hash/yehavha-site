const url = 'https://yehavha.com/api/reputation-analysis';
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 45000);

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
