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
  const url = new URL(context.request.url);
  if (['yehavha-nexus-hub.pages.dev', 'yehavha-nexus.pages.dev', 'www.yehavha.com'].includes(url.hostname)) {
    url.host = 'yehavha.com';
    url.protocol = 'https:';
    return Response.redirect(url.href, 301);
  }

  if (shouldCount(context.request) && context.env?.NEXUS_DB) {
    context.waitUntil(
      incrementAccessCount(context.env.NEXUS_DB).catch(() => undefined)
    );
  }

  return context.next();
}
