let schemaReady = false;

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

async function readCount(db) {
  await ensureSchema(db);
  const row = await db.prepare(`
    SELECT count
    FROM nexus_access_counter
    WHERE id = 1
  `).first();

  return Number(row?.count ?? 0);
}

export async function onRequestGet({ env }) {
  if (!env?.NEXUS_DB) {
    return json({ ok: false, error: 'nexus_db_binding_missing' }, 500);
  }

  try {
    const count = await readCount(env.NEXUS_DB);
    return json({ ok: true, count });
  } catch (error) {
    return json({
      ok: false,
      error: 'nexus_db_query_failed',
      detail: String(error?.message || error)
    }, 500);
  }
}
