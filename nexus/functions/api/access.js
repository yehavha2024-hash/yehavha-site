import { readMetrics, recordMetric } from '../lib/metrics.js';
import { readAccessStats } from '../lib/access-counter.js';

const ALLOWED_OPS = new Set(['get', 'event', 'metrics']);

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

export async function onRequestGet({ request, env }) {
  if (!env?.NEXUS_DB) {
    return json({ ok: false, error: 'nexus_db_binding_missing' }, 500);
  }

  try {
    const url = new URL(request.url);
    const op = url.searchParams.get('op') || 'get';

    if (!ALLOWED_OPS.has(op)) {
      return json({ ok: false, error: 'unsupported_operation' }, 400);
    }

    if (op === 'event') {
      const recorded = await recordMetric(
        env.NEXUS_DB,
        url.searchParams.get('event'),
        url.searchParams.get('project')
      );
      return recorded
        ? json({ ok: true })
        : json({ ok: false, error: 'invalid_metric_event' }, 400);
    }

    if (op === 'metrics') {
      const metrics = await readMetrics(env.NEXUS_DB, url.searchParams.get('days') || 30);
      return json({ ok: true, ...metrics });
    }

    const { count, today } = await readAccessStats(env.NEXUS_DB);
    return json({ ok: true, count, today });
  } catch (error) {
    console.error('Nexus metrics API failed:', error);
    return json({ ok: false, error: 'nexus_db_query_failed' }, 500);
  }
}
