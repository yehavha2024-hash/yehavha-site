const COUNTER_UP = 'https://api.counterapi.dev/v1/yehavha-nexus-6f2a9c1d/network-access/up';

const STATIC_ASSET_RE = /\.(?:css|js|mjs|cjs|json|map|png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf|mp4|webm|mp3|wav|zip)$/i;

function shouldCount(request) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return false;

  const url = new URL(request.url);
  const path = url.pathname;

  // 카운터 조회 자체는 다시 카운트하지 않아 이중집계를 막습니다.
  if (path.startsWith('/api/access')) return false;

  // 한 번의 화면 접속이 CSS·JS·이미지 로딩 때문에 여러 번 부풀려지지 않게
  // 정적 보조파일은 제외합니다. HTML, robots.txt, sitemap.xml, 확장자 없는
  // 크롤러/봇 요청과 임의 탐색 경로는 모두 접속으로 집계합니다.
  if (STATIC_ASSET_RE.test(path)) return false;

  return true;
}

async function incrementAccess() {
  try {
    await fetch(COUNTER_UP, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'user-agent': 'YEHAVHA-Nexus-EdgeCounter/2.0'
      },
      cf: { cacheTtl: 0, cacheEverything: false }
    });
  } catch {
    // 통계 장애가 본문 제공을 막아서는 안 됩니다.
  }
}

export async function onRequest(context) {
  if (shouldCount(context.request)) {
    context.waitUntil(incrementAccess());
  }

  return context.next();
}
