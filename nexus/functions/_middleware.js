let schemaReady = false;

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
    context.waitUntil(
      incrementAccess(context.env.NEXUS_DB).catch(() => undefined)
    );
  }

  return context.next();
}
