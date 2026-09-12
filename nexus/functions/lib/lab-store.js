const schemaPromises = new WeakMap();

async function prepareLabSchema(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS nexus_lab_runs (
      run_id TEXT PRIMARY KEY,
      scenario_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'running',
      score INTEGER NOT NULL DEFAULT 0,
      result_code TEXT NOT NULL DEFAULT '',
      state_json TEXT NOT NULL DEFAULT '{}',
      started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completed_at TEXT
    )
  `).run();

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS nexus_lab_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      run_id TEXT NOT NULL,
      scenario_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      step_id TEXT NOT NULL DEFAULT '',
      choice_id TEXT NOT NULL DEFAULT '',
      score INTEGER NOT NULL DEFAULT 0,
      state_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_nexus_lab_events_run
    ON nexus_lab_events (run_id, created_at)
  `).run();
}

export function ensureLabSchema(db) {
  const existing = schemaPromises.get(db);
  if (existing) return existing;

  const pending = prepareLabSchema(db).catch(error => {
    schemaPromises.delete(db);
    throw error;
  });
  schemaPromises.set(db, pending);
  return pending;
}

export async function recordLabEvent(db, entry) {
  await ensureLabSchema(db);

  const stateJson = JSON.stringify(entry.state || {});
  const isComplete = entry.eventType === 'complete';
  const status = isComplete ? 'completed' : 'running';

  const statements = [
    db.prepare(`
      INSERT INTO nexus_lab_runs (
        run_id, scenario_id, status, score, result_code, state_json, started_at, updated_at, completed_at
      ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)
      ON CONFLICT(run_id) DO UPDATE SET
        scenario_id = excluded.scenario_id,
        status = excluded.status,
        score = excluded.score,
        result_code = excluded.result_code,
        state_json = excluded.state_json,
        updated_at = CURRENT_TIMESTAMP,
        completed_at = CASE
          WHEN excluded.status = 'completed' THEN CURRENT_TIMESTAMP
          ELSE nexus_lab_runs.completed_at
        END
    `).bind(
      entry.runId,
      entry.scenarioId,
      status,
      entry.score,
      entry.resultCode || '',
      stateJson,
      isComplete ? new Date().toISOString() : null
    ),
    db.prepare(`
      INSERT INTO nexus_lab_events (
        run_id, scenario_id, event_type, step_id, choice_id, score, state_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      entry.runId,
      entry.scenarioId,
      entry.eventType,
      entry.stepId || '',
      entry.choiceId || '',
      entry.score,
      stateJson
    )
  ];

  await db.batch(statements);
}

export async function readLabSummary(db) {
  await ensureLabSchema(db);
  const row = await db.prepare(`
    SELECT
      COUNT(*) AS runs,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completions,
      COALESCE(ROUND(AVG(CASE WHEN status = 'completed' THEN score END), 1), 0) AS average_score
    FROM nexus_lab_runs
  `).first();

  return {
    runs: Number(row?.runs || 0),
    completions: Number(row?.completions || 0),
    averageScore: Number(row?.average_score || 0)
  };
}
