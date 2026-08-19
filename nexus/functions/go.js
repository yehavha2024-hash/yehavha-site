import { recordMetric } from './lib/metrics.js';

const ALLOWED_HOSTS = new Set([
  'yehavha-nexus-hub.pages.dev',
  'yehavha-3min-rest.pages.dev',
  'yehavha-toeicman.pages.dev',
  'ai-song-studio.pages.dev',
  'yehavha-ai-law-institute.pages.dev',
  'yehavha-legal-knowledge.danielie.workers.dev',
  'yehavha-ai-foresight-v2.pages.dev',
  'yehavha-legal-philosophy.pages.dev',
  'yehavha.upaper.kr',
  'www.youtube.com',
  'youtube.com'
]);

function safeDestination(value) {
  if (!value) return null;
  try {
    const target = new URL(value);
    if (target.protocol !== 'https:') return null;
    if (!ALLOWED_HOSTS.has(target.hostname)) return null;
    return target;
  } catch {
    return null;
  }
}

export async function onRequestGet({ request, env, waitUntil }) {
  const requestUrl = new URL(request.url);
  const target = safeDestination(requestUrl.searchParams.get('to'));

  if (!target) {
    return new Response('Invalid Nexus destination', {
      status: 400,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'no-store'
      }
    });
  }

  if (env?.NEXUS_DB) {
    const projectId = requestUrl.searchParams.get('id') || '';
    waitUntil(recordMetric(env.NEXUS_DB, 'project_click', projectId).catch(() => undefined));
  }

  return Response.redirect(target.toString(), 302);
}
