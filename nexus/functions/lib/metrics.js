const ALLOWED_EVENTS = new Set([
  'project_click',
  'search',
  'search_open',
  'featured_open',
  'recent_open',
  'copy'
]);

let metricsSchemaReady = false;

function cleanEvent(value) {
  const event = String(value || '').trim();
  return ALLOWED_EVENTS.has(event) ? event : null;
}

function cleanProjectId(value) {
  const id = String(value || '').trim();
  if (!id) return '';
  return /^[a-z0-9][a-z0-9-]{0,79}$/i.test(id) ? id : '';
}

export async function ensureMetricsSchema(db) {
  if (metricsSchemaReady) return;
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS nexus_event_daily (
      day TEXT NOT NULL,
      event TEXT NOT NULL,
      project_id TEXT NOT NULL DEFAULT '',
      count INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (day, event, project_id)
    )
  `).run();
  metricsSchemaReady = true;
}

export async function recordMetric(db, eventValue, projectValue = '') {
  if (!db) return false;
  const event = cleanEvent(eventValue);
  if (!event) return false;
  const projectId = cleanProjectId(projectValue);
  await ensureMetricsSchema(db);
  await db.prepare(`
    INSERT INTO nexus_event_daily (day, event, project_id, count)
    VALUES (date('now'), ?, ?, 1)
    ON CONFLICT(day, event, project_id)
    DO UPDATE SET count = count + 1
  `).bind(event, projectId).run();
  return true;
}

export async function readMetrics(db, days = 30) {
  await ensureMetricsSchema(db);
  const safeDays = Math.max(1, Math.min(365, Number(days) || 30));
  const modifier = `-${safeDays - 1} day`;
  const totals = await db.prepare(`
    SELECT event, SUM(count) AS count
    FROM nexus_event_daily
    WHERE day >= date('now', ?)
    GROUP BY event
    ORDER BY event
  `).bind(modifier).all();
  const projects = await db.prepare(`
    SELECT project_id, SUM(count) AS count
    FROM nexus_event_daily
    WHERE day >= date('now', ?)
      AND event = 'project_click'
      AND project_id <> ''
    GROUP BY project_id
    ORDER BY count DESC, project_id ASC
    LIMIT 20
  `).bind(modifier).all();
  return {
    days: safeDays,
    totals: totals?.results || [],
    projectClicks: projects?.results || []
  };
}
