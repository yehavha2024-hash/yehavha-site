import { readLabSummary, recordLabEvent } from '../lib/lab-store.js';

const ALLOWED_EVENTS = new Set(['start', 'choice', 'complete']);
const SAFE_ID = /^[A-Za-z0-9._:-]{1,120}$/;

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

function cleanId(value, required = false) {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text) return required ? null : '';
  return SAFE_ID.test(text) ? text : null;
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
}

function normalizeEventScore(eventType, bodyScore, state) {
  if (eventType === 'complete') return clampScore(bodyScore);

  const rawScore = Number(state?.score);
  const possibleScore = Number(state?.decisionPossible);
  if (Number.isFinite(rawScore) && Number.isFinite(possibleScore) && possibleScore > 0) {
    return clampScore((rawScore / possibleScore) * 100);
  }
  return clampScore(bodyScore);
}

export async function onRequestGet({ env }) {
  if (!env?.NEXUS_DB) {
    return json({ ok: false, error: 'nexus_db_binding_missing' }, 500);
  }

  try {
    const summary = await readLabSummary(env.NEXUS_DB);
    return json({ ok: true, service: 'nexus-lab', ...summary });
  } catch (error) {
    console.error('NEXUS LAB summary failed:', error);
    return json({ ok: false, error: 'lab_summary_failed' }, 500);
  }
}

export async function onRequestPost({ request, env }) {
  if (!env?.NEXUS_DB) {
    return json({ ok: false, error: 'nexus_db_binding_missing' }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch (_) {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  const eventType = cleanId(body?.eventType, true);
  const runId = cleanId(body?.runId, true);
  const scenarioId = cleanId(body?.scenarioId, true);
  const stepId = cleanId(body?.stepId) ?? null;
  const choiceId = cleanId(body?.choiceId) ?? null;
  const resultCode = cleanId(body?.resultCode) ?? null;
  const state = body?.state && typeof body.state === 'object' && !Array.isArray(body.state) ? body.state : {};

  if (!eventType || !ALLOWED_EVENTS.has(eventType)) {
    return json({ ok: false, error: 'invalid_event_type' }, 400);
  }
  if (!runId || !scenarioId || stepId === null || choiceId === null || resultCode === null) {
    return json({ ok: false, error: 'invalid_identifier' }, 400);
  }

  const score = normalizeEventScore(eventType, body?.score, state);
  const stateJson = JSON.stringify(state);
  if (stateJson.length > 24000) {
    return json({ ok: false, error: 'state_too_large' }, 413);
  }

  try {
    await recordLabEvent(env.NEXUS_DB, {
      eventType,
      runId,
      scenarioId,
      stepId,
      choiceId,
      resultCode,
      score,
      state
    });
    return json({ ok: true, stored: true });
  } catch (error) {
    console.error('NEXUS LAB event write failed:', error);
    return json({ ok: false, error: 'lab_write_failed' }, 500);
  }
}
