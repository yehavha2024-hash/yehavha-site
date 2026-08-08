const COUNTER_BASE = 'https://api.counterapi.dev/v1/yehavha-nexus-6f2a9c1d/network-access';

function extractCount(payload) {
  const candidates = [
    payload?.count,
    payload?.value,
    payload?.data,
    payload?.data?.count,
    payload?.data?.value,
    payload?.counter?.count,
    payload?.counter?.value,
    payload?.result?.count,
    payload?.result?.value
  ];

  for (const candidate of candidates) {
    if (candidate === null || candidate === undefined || typeof candidate === 'object') continue;
    const number = Number(candidate);
    if (Number.isFinite(number)) return number;
  }

  return null;
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store, max-age=0',
      'x-content-type-options': 'nosniff'
    }
  });
}

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const op = url.searchParams.get('op') === 'get' ? 'get' : 'up';
  const endpoint = op === 'get' ? COUNTER_BASE : `${COUNTER_BASE}/up`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'user-agent': 'YEHAVHA-Nexus/1.0'
      },
      cf: { cacheTtl: 0, cacheEverything: false }
    });

    const text = await response.text();
    let payload = null;
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }

    if (!response.ok) {
      return json({ ok: false, status: response.status, error: 'counter_upstream_error' }, 502);
    }

    const count = extractCount(payload);
    if (count === null) {
      return json({ ok: false, error: 'counter_value_missing' }, 502);
    }

    return json({ ok: true, count });
  } catch (error) {
    return json({ ok: false, error: 'counter_request_failed' }, 502);
  }
}
