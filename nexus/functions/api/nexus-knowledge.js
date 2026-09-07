import { listPublicDataSources } from '../lib/public-data-registry.js';

const DEFAULT_HISTORY_LIMIT = 12;
const MAX_HISTORY_LIMIT = 48;

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

function stableObject(value) {
  if (Array.isArray(value)) return value.map(stableObject);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableObject(value[key])]));
}

function fingerprint(record) {
  return JSON.stringify(stableObject({
    title: record?.title || null,
    date: record?.date || '',
    organization: record?.organization || '',
    region: record?.region || '',
    status: record?.status || '',
    summary: record?.summary || '',
    original_url: record?.original_url || '',
    metadata: record?.metadata || null
  }));
}

function compareRecords(previousRecords = [], currentRecords = []) {
  const previous = new Map(previousRecords.filter(Boolean).map((record) => [record.raw_id, record]));
  const current = new Map(currentRecords.filter(Boolean).map((record) => [record.raw_id, record]));
  const added = [];
  const removed = [];
  const changed = [];
  const unchanged = [];

  for (const [id, record] of current) {
    if (!previous.has(id)) {
      added.push(record);
      continue;
    }
    const before = previous.get(id);
    if (fingerprint(before) !== fingerprint(record)) changed.push({ raw_id: id, before, after: record });
    else unchanged.push(record);
  }
  for (const [id, record] of previous) if (!current.has(id)) removed.push(record);

  return {
    counts: { added: added.length, changed: changed.length, removed: removed.length, unchanged: unchanged.length },
    added: added.slice(0, 20),
    changed: changed.slice(0, 20),
    removed: removed.slice(0, 20)
  };
}

function changeScore(delta) {
  const counts = delta?.counts || {};
  return (counts.added || 0) * 2 + (counts.changed || 0) * 3 + (counts.removed || 0) * 2;
}

function direction(delta) {
  const counts = delta?.counts || {};
  if ((counts.added || 0) === 0 && (counts.changed || 0) === 0 && (counts.removed || 0) === 0) return 'stable';
  if ((counts.added || 0) > (counts.removed || 0)) return 'expanding';
  if ((counts.removed || 0) > (counts.added || 0)) return 'contracting';
  return 'changing';
}

function priority(score) {
  if (score >= 25) return 'HIGH';
  if (score >= 8) return 'WATCH';
  return 'NORMAL';
}

function sourceBriefing(source, current, previous, delta) {
  const score = changeScore(delta);
  const counts = delta?.counts || {};
  const trendDirection = direction(delta);
  const title = current?.intelligence?.briefing?.fact || `${source.title} ${current?.records?.length || 0}건`;
  const changes = [`신규 ${counts.added || 0}`, `변경 ${counts.changed || 0}`, `소멸 ${counts.removed || 0}`].join(' · ');
  const baseline = !previous;

  return {
    source: source.id,
    axis: source.axis,
    owner: source.owner,
    category: source.category,
    priority: baseline ? 'NORMAL' : priority(score),
    score,
    direction: baseline ? 'baseline' : trendDirection,
    current_at: current?.generated_at || null,
    previous_at: previous?.generated_at || null,
    headline: source.title,
    headline_en: source.titleEn || '',
    fact: baseline ? `${title} · 첫 저장 스냅샷` : `${title} · ${changes}`,
    assessment: baseline
      ? '현재 스냅샷을 변화 탐지의 기준선으로 저장했습니다.'
      : score === 0
        ? '직전 스냅샷과 비교해 식별 가능한 데이터 변화가 없습니다.'
        : `${trendDirection} 상태입니다. 신규·변경·소멸 항목을 이전 시점과 비교해 확인해야 합니다.`,
    impact: current?.intelligence?.briefing?.impact || '해당 NEXUS 트리의 분석·의사결정 자료에 반영할 수 있습니다.',
    watch: score === 0
      ? '다음 자동 스냅샷에서 변화 발생 여부를 계속 확인합니다.'
      : `변화점수 ${score}. 특히 변경 ${counts.changed || 0}건의 상태·내용 변화를 우선 확인합니다.`,
    delta
  };
}

async function readSnapshot(store, key) {
  try { return await store.get(key, 'json'); }
  catch { return null; }
}

async function historyForSource(store, sourceId, limit) {
  const listed = await store.list({ prefix: `snapshot:${sourceId}:`, limit: Math.min(limit, MAX_HISTORY_LIMIT) });
  const keys = (listed?.keys || []).map((item) => item.name).sort().reverse().slice(0, limit);
  const values = await Promise.all(keys.map((key) => readSnapshot(store, key)));
  return values.filter(Boolean).sort((a, b) => String(b.generated_at || '').localeCompare(String(a.generated_at || '')));
}

async function buildSourceKnowledge(store, source, limit) {
  let history = await historyForSource(store, source.id, limit);
  const latest = await readSnapshot(store, `latest:${source.id}`);
  if (latest && !history.some((item) => item.generated_at === latest.generated_at)) history = [latest, ...history];
  history = history.filter(Boolean).sort((a, b) => String(b.generated_at || '').localeCompare(String(a.generated_at || ''))).slice(0, limit);
  if (!history.length) return null;

  const current = history[0];
  const previous = history[1] || null;
  const delta = previous ? compareRecords(previous.records, current.records) : { counts: { added: 0, changed: 0, removed: 0, unchanged: current.records?.length || 0 }, added: [], changed: [], removed: [] };
  return {
    source: source.id,
    sourceInfo: source,
    current,
    previous,
    history: history.map((item) => ({ generated_at: item.generated_at, count: item.records?.length || 0 })),
    delta,
    briefing: sourceBriefing(source, current, previous, delta)
  };
}

function axisSummary(axis, items) {
  const briefings = items.map((item) => item.briefing).filter(Boolean).sort((a, b) => b.score - a.score || String(b.current_at || '').localeCompare(String(a.current_at || '')));
  const totals = briefings.reduce((acc, item) => {
    const counts = item.delta?.counts || {};
    acc.added += counts.added || 0;
    acc.changed += counts.changed || 0;
    acc.removed += counts.removed || 0;
    acc.score += item.score || 0;
    return acc;
  }, { added: 0, changed: 0, removed: 0, score: 0 });
  const active = briefings.filter((item) => item.score > 0);
  const lead = active[0] || briefings[0] || null;

  return {
    axis,
    generated_at: new Date().toISOString(),
    sources: briefings.length,
    changed_sources: active.length,
    totals,
    priority: priority(totals.score),
    executive: {
      fact: briefings.length
        ? `${briefings.length}개 데이터 소스 비교 · 신규 ${totals.added} · 변경 ${totals.changed} · 소멸 ${totals.removed}`
        : '저장된 스냅샷이 없습니다.',
      assessment: active.length
        ? `${active.length}개 소스에서 직전 스냅샷 대비 변화가 감지됐습니다.${lead ? ` 현재 변화점수가 가장 높은 소스는 ${lead.headline}입니다.` : ''}`
        : '비교 가능한 범위에서 유의한 데이터 변화가 감지되지 않았습니다.',
      impact: lead?.impact || '축적된 원천데이터가 NEXUS 분석축의 기준자료가 됩니다.',
      watch: lead?.watch || '다음 자동 갱신에서 변화 여부를 계속 비교합니다.'
    },
    briefings
  };
}

export async function onRequestGet({ request, env }) {
  const store = env?.NEXUS_KNOWLEDGE;
  if (!store?.get || !store?.list) {
    return json({
      ok: false,
      error: 'knowledge_store_not_bound',
      binding: 'NEXUS_KNOWLEDGE',
      detail: 'Cloudflare Pages Functions에 NEXUS_KNOWLEDGE KV binding이 필요합니다.'
    }, 503);
  }

  const url = new URL(request.url);
  const sourceId = String(url.searchParams.get('source') || '').trim();
  const axis = String(url.searchParams.get('axis') || '').trim();
  const requested = Number.parseInt(url.searchParams.get('limit') || String(DEFAULT_HISTORY_LIMIT), 10);
  const limit = Math.min(Math.max(Number.isFinite(requested) ? requested : DEFAULT_HISTORY_LIMIT, 2), MAX_HISTORY_LIMIT);
  const allSources = listPublicDataSources();

  if (sourceId) {
    const source = allSources.find((item) => item.id === sourceId);
    if (!source) return json({ ok: false, error: 'unknown_source', source: sourceId }, 404);
    const knowledge = await buildSourceKnowledge(store, source, limit);
    return json({ ok: true, binding: 'NEXUS_KNOWLEDGE', source: sourceId, knowledge });
  }

  const selected = axis ? allSources.filter((source) => source.axis === axis) : allSources;
  if (axis && !selected.length) return json({ ok: false, error: 'unknown_axis', axis }, 404);
  const items = (await Promise.all(selected.map((source) => buildSourceKnowledge(store, source, limit)))).filter(Boolean);
  const axes = axis
    ? [axisSummary(axis, items)]
    : [...new Set(items.map((item) => item.sourceInfo.axis))].map((axisName) => axisSummary(axisName, items.filter((item) => item.sourceInfo.axis === axisName)));

  return json({
    ok: true,
    binding: 'NEXUS_KNOWLEDGE',
    generated_at: new Date().toISOString(),
    stored_sources: items.length,
    axes,
    items: items.map((item) => ({ source: item.source, history: item.history, delta: item.delta, briefing: item.briefing }))
  });
}
