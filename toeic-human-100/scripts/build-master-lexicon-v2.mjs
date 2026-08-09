import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DIR = path.join(ROOT, 'toeic-human-100');
const OUTPUT = path.join(DIR, 'master-lexicon-v2.json');

const SOURCES = [
  {
    id: 'NGSL-1.2',
    name: 'New General Service List 1.2',
    role: 'general-core',
    url: 'https://www.newgeneralservicelist.com/s/NGSL_12_lemmatized_for_teaching.csv',
    expectedMin: 2700,
    citation: 'Browne, C., Culligan, B., & Phillips, J. New General Service List 1.2',
    license: 'CC BY-SA 4.0'
  },
  {
    id: 'TSL-1.2',
    name: 'TOEIC Service List 1.2',
    role: 'toeic-specific',
    url: 'https://www.newgeneralservicelist.com/s/TSL_12_lemmatized_for_teaching.csv',
    expectedMin: 1200,
    citation: 'Browne, C. & Culligan, B. TOEIC Service List 1.2',
    license: 'CC BY-SA 4.0'
  },
  {
    id: 'NAWL-1.2',
    name: 'New Academic Word List 1.2',
    role: 'academic-book-extension',
    url: 'https://www.newgeneralservicelist.com/s/NAWL_12_lemmatized_for_teaching.csv',
    expectedMin: 900,
    citation: 'Browne, C., Culligan, B., & Phillips, J. New Academic Word List 1.2',
    license: 'CC BY-SA 4.0'
  }
];

function parseCsvLine(line) {
  const cells = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') { cell += '"'; i += 1; }
      else quoted = !quoted;
    } else if (char === ',' && !quoted) {
      cells.push(cell.trim());
      cell = '';
    } else cell += char;
  }
  cells.push(cell.trim());
  return cells;
}

function clean(value = '') {
  return String(value)
    .replace(/^\uFEFF/, '')
    .replace(/^['"]|['"]$/g, '')
    .trim();
}

function normalizeLemma(value = '') {
  return clean(value).toLowerCase().replace(/\s+/g, ' ');
}

function looksLikeWord(value) {
  return /[a-z]/i.test(value) && !/^https?:/i.test(value);
}

function extractRows(text) {
  const rows = [];
  for (const raw of String(text).replace(/\r\n/g, '\n').split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const cells = parseCsvLine(line).map(clean).filter(Boolean);
    if (!cells.length) continue;
    const first = normalizeLemma(cells[0]);
    if (!looksLikeWord(first)) continue;
    if (['word','headword','lemma','head word','head_word'].includes(first)) continue;
    const forms = [];
    for (const cell of cells) {
      for (const part of cell.split(/[;|]/)) {
        const form = normalizeLemma(part);
        if (looksLikeWord(form) && !forms.includes(form)) forms.push(form);
      }
    }
    rows.push({ lemma: first, forms: forms.length ? forms : [first] });
  }
  return rows;
}

async function fetchText(source) {
  const response = await fetch(source.url, {
    headers: {
      'user-agent': 'yehavha-toeic-human-v2/1.0',
      'accept': 'text/csv,text/plain;q=0.9,*/*;q=0.5'
    },
    redirect: 'follow'
  });
  if (!response.ok) throw new Error(`${source.id}: HTTP ${response.status}`);
  return response.text();
}

const merged = new Map();
const sourceStats = [];

for (const source of SOURCES) {
  const text = await fetchText(source);
  const rows = extractRows(text);
  if (rows.length < source.expectedMin) {
    throw new Error(`${source.id}: parsed ${rows.length}, expected at least ${source.expectedMin}`);
  }
  sourceStats.push({ id: source.id, rows: rows.length, role: source.role, url: source.url });
  for (const row of rows) {
    const existing = merged.get(row.lemma) || {
      id: row.lemma.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      lemma: row.lemma,
      forms: [],
      sourceLists: [],
      roles: []
    };
    for (const form of row.forms) if (!existing.forms.includes(form)) existing.forms.push(form);
    if (!existing.sourceLists.includes(source.id)) existing.sourceLists.push(source.id);
    if (!existing.roles.includes(source.role)) existing.roles.push(source.role);
    merged.set(row.lemma, existing);
  }
}

const entries = [...merged.values()].sort((a,b) => a.lemma.localeCompare(b.lemma));
const uniqueForms = new Set(entries.flatMap(item => item.forms));
const toeicSpecific = entries.filter(item => item.sourceLists.includes('TSL-1.2')).length;
const academicExtension = entries.filter(item => item.sourceLists.includes('NAWL-1.2')).length;

const output = {
  generatedAt: new Date().toISOString(),
  purpose: '토익 핵심 어휘의 체계적 커버리지와 영어 원서 독해 확장을 위한 V2 마스터 어휘 기반',
  scopeNote: 'ETS가 역대 TOEIC의 모든 출제어를 단일 공식 목록으로 공개하지 않으므로, 이 파일은 공개·검증 가능한 코퍼스 기반 목록을 마스터 기준으로 사용한다. 별도 공식 샘플/OOV 보충목록을 지속적으로 합쳐 100일 콘텐츠 누락을 관리한다.',
  sources: SOURCES.map(({expectedMin, ...source}) => source),
  sourceStats,
  counts: {
    uniqueHeadwords: entries.length,
    uniqueSurfaceForms: uniqueForms.size,
    toeicSpecificHeadwords: toeicSpecific,
    academicExtensionHeadwords: academicExtension
  },
  entries
};

fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify(output.counts, null, 2));
console.log(sourceStats.map(s => `${s.id}: ${s.rows}`).join('\n'));
