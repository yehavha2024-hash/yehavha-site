let schemaReady = false;

const STATIC_ASSET_RE = /\.(?:css|js|mjs|cjs|json|map|png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf|mp4|webm|mp3|wav|zip)$/i;

function shouldCount(request) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return false;

  const url = new URL(request.url);
  const path = url.pathname;

  // 카운터 조회 API는 다시 집계하지 않아 이중 카운트를 막습니다.
  if (path.startsWith('/api/access')) return false;

  // 화면 1회 접속이 CSS·JS·이미지 요청 때문에 여러 회로 부풀려지지 않게
  // 정적 보조파일은 제외합니다. HTML, robots.txt, sitemap.xml, /go,
  // 확장자 없는 사람·검색봇·AI 크롤러 요청은 모두 접속으로 집계합니다.
  if (STATIC_ASSET_RE.test(path)) return false;

  return true;
}

async function ensureSchema(db) {
  if (schemaReady) return;

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS nexus_access_counter (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      count INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  await db.prepare(`
    INSERT INTO nexus_access_counter (id, count)
    VALUES (1, 0)
    ON CONFLICT(id) DO NOTHING
  `).run();

  schemaReady = true;
}

async function incrementAccess(db) {
  await ensureSchema(db);
  await db.prepare(`
    UPDATE nexus_access_counter
    SET count = count + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = 1
  `).run();
}

export async function onRequest(context) {
  if (shouldCount(context.request) && context.env?.NEXUS_DB) {
    // 통계 기록 실패가 페이지 제공을 막지 않도록 비동기로 처리합니다.
    context.waitUntil(
      incrementAccess(context.env.NEXUS_DB).catch(() => undefined)
    );
  }

  return context.next();
}
