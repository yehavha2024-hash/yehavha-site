import { incrementAccessCount } from './lib/access-counter.js';

const STATIC_ASSET_RE = /\.(?:css|js|mjs|cjs|json|map|png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf|mp4|webm|mp3|wav|zip|txt|xml|webmanifest)$/i;

function shouldCount(request) {
  if (request.method !== 'GET') return false;

  const url = new URL(request.url);
  const path = url.pathname;

  if (path.startsWith('/api/access')) return false;
  if (path === '/go' || path.startsWith('/go/')) return false;
  if (STATIC_ASSET_RE.test(path)) return false;

  return true;
}

export async function onRequest(context) {
  if (shouldCount(context.request) && context.env?.NEXUS_DB) {
    context.waitUntil(
      incrementAccessCount(context.env.NEXUS_DB).catch(() => undefined)
    );
  }

  return context.next();
}
