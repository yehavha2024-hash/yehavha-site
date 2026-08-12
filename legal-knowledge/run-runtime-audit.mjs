import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.join(here, 'index.html');
const index = fs.readFileSync(indexPath, 'utf8');
const EXPECTED_TOTAL = 107;

// 실제 배포 index.html에 선언된 데이터 스크립트 순서를 감사의 단일 원본으로 사용한다.
// 별도 파일목록을 유지하지 않아 배포와 감사가 서로 다른 데이터를 검사하는 문제를 방지한다.
const files = [...index.matchAll(/<script\s+[^>]*src=["']([^"']+)["'][^>]*><\/script>/gi)]
  .map(match => match[1].split('?')[0])
  .filter(file => file === 'schema.js' || file === 'manual-solution-audit.js' || file.startsWith('data-'));

if (!files.length) throw new Error('No legal knowledge data scripts found in index.html');

const sandbox = { window: { LEGAL_KNOWLEDGE: [] }, console, URL };
sandbox.window.window = sandbox.window;
const context = vm.createContext(sandbox);
for (const file of files) {
  const full = path.join(here, file);
  if (!fs.existsSync(full)) throw new Error(`Missing runtime input declared by index.html: ${file}`);
  vm.runInContext(fs.readFileSync(full, 'utf8'), context, { filename: file });
}

const data = sandbox.window.LEGAL_KNOWLEDGE;
const summary = sandbox.window.LEGAL_SOURCE_AUDIT_SUMMARY || {};
const weakSource = data.filter(x => ['D', 'C'].includes(x.sourceLinkGrade));
const b1 = data.filter(x => (x.sourceLinkAudit?.counts?.B1 || 0) > 0);
const articleC = data.filter(x => x.articleAccuracyGrade === 'C');
const articleB = data.filter(x => ['B', 'B+'].includes(x.articleAccuracyGrade));
const idCounts = data.reduce((m, x) => { m[x.id] = (m[x.id] || 0) + 1; return m; }, {});
const duplicateIds = Object.entries(idCounts).filter(([, count]) => count > 1).map(([id, count]) => ({
  id, count,
  cards: data.filter(x => x.id === id).map((x, index) => ({
    index,
    title: x.title,
    area: x.systemArea || x.area,
    subfield: x.subfield,
    type: x.type,
    summary: x.summary,
    refinementStage: x.refinementStage || '',
    articleGrade: x.articleAccuracyGrade || '',
    statuteSources: x.statuteSources || []
  }))
}));

const cardView = item => ({
  id: item.id,
  title: item.title,
  area: item.systemArea || item.area,
  subfield: item.subfield,
  sourceLinkGrade: item.sourceLinkGrade,
  sourceCounts: item.sourceLinkAudit?.counts,
  weakOrFragileSources: (item.sourceLinkAudit?.entries || []).filter(x => ['D', 'C', 'B1'].includes(x.code)).map(x => ({ label: x.label, url: x.url, code: x.code, note: x.note, field: x.field })),
  articleAccuracyGrade: item.articleAccuracyGrade,
  articleNote: item.articleAccuracyAudit?.note,
  articleRefs: item.articleAccuracyAudit?.refs,
  precedentCitationGrade: item.precedentCitationGrade,
  precedentNote: item.precedentCitationAudit?.note,
  statuteSources: item.statuteSources || [],
  relatedCases: item.relatedCases || []
});

const out = {
  generatedAt: '2026-08-12',
  expectedTotal: EXPECTED_TOTAL,
  actualTotal: data.length,
  runtimeFiles: files,
  duplicateIds,
  summary,
  priority: {
    sourceDC: weakSource.map(cardView),
    sourceB1: b1.map(cardView),
    articleC: articleC.map(cardView),
    articleB_Bplus: articleB.map(cardView)
  }
};
if (data.length !== EXPECTED_TOTAL) out.warning = `Expected ${EXPECTED_TOTAL} cards but got ${data.length}`;
const outPath = path.join(here, 'RUNTIME_AUDIT_OUTPUT_20260809.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`, 'utf8');

const md = [];
md.push('# 런타임 취약 인용 우선검증 목록 — 2026-08-09', '');
md.push(`- 전체 카드: ${data.length}`);
md.push(`- 중복 ID: ${duplicateIds.length}`);
duplicateIds.forEach(x => {
  md.push(`  - ${x.id} × ${x.count}`);
  x.cards.forEach(c => md.push(`    - [${c.index}] ${c.title} · ${c.area} · ${c.subfield} · ${c.type} · 조문 ${c.articleGrade}`));
});
md.push(`- 출처 D/C: ${weakSource.length}`);
md.push(`- 출처 B1 포함 카드: ${b1.length}`);
md.push(`- 조문 C: ${articleC.length}`);
md.push(`- 조문 B/B+: ${articleB.length}`, '');

const section = (title, items, formatter) => {
  md.push(`## ${title} (${items.length})`, '');
  if (!items.length) { md.push('- 없음', ''); return; }
  items.forEach((item, i) => {
    md.push(`${i + 1}. **${item.id} — ${item.title}**`);
    formatter(item).forEach(line => md.push(`   - ${line}`));
  });
  md.push('');
};
section('1순위 — 출처 D/C', weakSource, item => [
  ...(item.sourceLinkAudit?.entries || []).filter(x => ['D', 'C'].includes(x.code)).map(x => `${x.code} ${x.label} → ${x.url}`)
]);
section('2순위 — 출처 B1', b1, item => [
  ...(item.sourceLinkAudit?.entries || []).filter(x => x.code === 'B1').map(x => `${x.label} → ${x.url}`),
  `판례강도 ${item.precedentCitationGrade}: ${item.precedentCitationAudit?.note || ''}`
]);
section('3순위 — 조문 C', articleC, item => [
  item.articleAccuracyAudit?.note || '',
  ...(item.statuteSources || []).map(x => `${x.label} → ${x.url}`)
]);
section('4순위 — 조문 B/B+', articleB, item => [
  `등급 ${item.articleAccuracyGrade}: ${item.articleAccuracyAudit?.note || ''}`,
  ...(item.statuteSources || []).map(x => `${x.label} → ${x.url}`)
]);
fs.writeFileSync(path.join(here, 'RUNTIME_AUDIT_PRIORITY_20260809.md'), `${md.join('\n')}\n`, 'utf8');

console.log(JSON.stringify({
  actualTotal: data.length,
  runtimeFiles: files.length,
  duplicateIds,
  sourceGrades: summary.sourceGrades,
  articleGrades: summary.articleGrades,
  precedentGrades: summary.precedentGrades,
  priorityCounts: { sourceDC: weakSource.length, sourceB1: b1.length, articleC: articleC.length, articleB_Bplus: articleB.length }
}, null, 2));

if (data.length !== EXPECTED_TOTAL || duplicateIds.length) process.exit(1);
