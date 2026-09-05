const schemaPromises = new WeakMap();

async function prepareAccessCounterSchema(db) {
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

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS nexus_daily_access (
      access_date TEXT PRIMARY KEY,
      count INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
}

export function ensureAccessCounterSchema(db) {
  const existing = schemaPromises.get(db);
  if (existing) return existing;

  const pending = prepareAccessCounterSchema(db).catch(error => {
    schemaPromises.delete(db);
    throw error;
  });
  schemaPromises.set(db, pending);
  return pending;
}

export async function readAccessStats(db) {
  await ensureAccessCounterSchema(db);

  const row = await db.prepare(`
    SELECT
      COALESCE((
        SELECT count
        FROM nexus_access_counter
        WHERE id = 1
      ), 0) AS count,
      COALESCE((
        SELECT count
        FROM nexus_daily_access
        WHERE access_date = date('now', '+9 hours')
      ), 0) AS today
  `).first();

  return {
    count: Number(row?.count ?? 0),
    today: Number(row?.today ?? 0)
  };
}

export async function incrementAccessCount(db) {
  await ensureAccessCounterSchema(db);

  await db.batch([
    db.prepare(`
      UPDATE nexus_access_counter
      SET count = count + 1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `),
    db.prepare(`
      INSERT INTO nexus_daily_access (access_date, count, updated_at)
      VALUES (date('now', '+9 hours'), 1, CURRENT_TIMESTAMP)
      ON CONFLICT(access_date) DO UPDATE SET
        count = count + 1,
        updated_at = CURRENT_TIMESTAMP
    `)
  ]);
}
