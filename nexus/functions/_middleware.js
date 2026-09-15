import { incrementAccessCount } from './lib/access-counter.js';

const STATIC_ASSET_RE = /\.(?:css|js|mjs|cjs|json|map|png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf|mp4|webm|mp3|wav|zip|txt|xml|webmanifest)$/i;
const RETIRED_PATHS = new Set([
  '/ai-practice/',
  '/ai-governance/',
  '/ai-service-operations/',
  '/initiatives/'
]);

function normalizedPagePath(pathname) {
  if (pathname === '/') return '/';
  return `${pathname.replace(/\/+$/, '')}/`;
}

function shouldCount(request) {
  if (request.method !== 'GET') return false;

  const url = new URL(request.url);
  const path = url.pathname;

  if (path.startsWith('/api/')) return false;
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

  if (RETIRED_PATHS.has(normalizedPagePath(url.pathname))) {
    return new Response('This YEHAVHA NEXUS route has been retired.', {
      status: 410,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'no-store'
      }
    });
  }

  const response = await context.next();

  if (
    shouldCount(context.request) &&
    response.status >= 200 && response.status < 400 &&
    context.env?.NEXUS_DB
  ) {
    context.waitUntil(
      incrementAccessCount(context.env.NEXUS_DB).catch(() => undefined)
    );
  }

  return response;
}
