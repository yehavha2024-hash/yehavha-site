import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const files=[
  'data-core-expansion-20.js',
  'data-core-expansion-20-enrichment-civil.js',
  'data-core-expansion-20-enrichment-public-criminal.js',
  'data-core-expansion-20-enrichment-ip-special.js',
  'data-civil.js','data-public.js','data-criminal.js','data-ip.js','data-reasoning.js','data-reasoning-advanced.js','data-special.js',
  'data-ai-foundation.js','data-ai-foundation-advanced.js','data-ai-data-consumer.js','data-ai-mobility.js','data-ai-industry-medical-ip.js',
  'data-verification-cases.js','data-verification-cases-02.js','data-verification-cases-03.js','data-verification-criminal-01.js','data-verification-ip.js',
  'data-enrichment-civil.js','data-enrichment-public.js','data-enrichment-criminal.js','data-enrichment-ip.js','data-enrichment-special.js','data-enrichment-reasoning.js','data-corrections.js',
  'data-refinement-round2-civil.js','data-refinement-round2-public-criminal.js','data-refinement-round2-ip-special.js','data-refinement-round2-reasoning.js','data-refinement-ai-round3.js',
  'data-variation-solutions-manual-round1.js','data-variation-solutions-manual-round2.js','data-variation-solutions-manual-round3.js','data-variation-solutions-manual-round4-civil.js','data-variation-solutions-manual-round5-public.js','data-variation-solutions-manual-round6-criminal.js','data-variation-solutions-manual-round7-ip.js','data-variation-solutions-manual-round8-special.js','data-variation-solutions-manual-round9-reasoning-a.js','data-variation-solutions-manual-round9-reasoning-b.js','manual-solution-audit.js','data-variation-solutions.js',
  'data-density-round4-foundation-data.js','data-density-round4-mobility.js','data-density-round4-industry.js','data-density-round5-high-impact-duties.js',
  'schema.js',
  'data-law-currentness-20260809.js','data-law-currentness-hotfix-20260809.js','data-case-verification-round2-20260809.js','data-dedup-round6-ai-20260809.js','data-source-link-hotfix-20260809.js','data-source-manual-review-round2-20260809.js','data-article-manual-review-round2-20260809.js','data-source-article-citation-audit-20260809.js'
];

const sandbox={window:{LEGAL_KNOWLEDGE:[]},console,URL};
sandbox.window.window=sandbox.window;
const context=vm.createContext(sandbox);
for(const file of files){
  const full=path.join(here,file);
  if(!fs.existsSync(full)) throw new Error(`Missing audit input: ${file}`);
  vm.runInContext(fs.readFileSync(full,'utf8'),context,{filename:file});
}

const data=sandbox.window.LEGAL_KNOWLEDGE;
const summary=sandbox.window.LEGAL_SOURCE_AUDIT_SUMMARY||{};
const weakSource=data.filter(x=>['D','C'].includes(x.sourceLinkGrade));
const b1=data.filter(x=>(x.sourceLinkAudit?.counts?.B1||0)>0);
const articleC=data.filter(x=>x.articleAccuracyGrade==='C');
const articleB=data.filter(x=>['B','B+'].includes(x.articleAccuracyGrade));

const cardView=item=>({
  id:item.id,
  title:item.title,
  area:item.systemArea||item.area,
  subfield:item.subfield,
  sourceLinkGrade:item.sourceLinkGrade,
  sourceCounts:item.sourceLinkAudit?.counts,
  weakOrFragileSources:(item.sourceLinkAudit?.entries||[]).filter(x=>['D','C','B1'].includes(x.code)).map(x=>({label:x.label,url:x.url,code:x.code,note:x.note,field:x.field})),
  articleAccuracyGrade:item.articleAccuracyGrade,
  articleNote:item.articleAccuracyAudit?.note,
  articleRefs:item.articleAccuracyAudit?.refs,
  precedentCitationGrade:item.precedentCitationGrade,
  precedentNote:item.precedentCitationAudit?.note,
  statuteSources:item.statuteSources||[],
  relatedCases:item.relatedCases||[]
});

const out={
  generatedAt:'2026-08-09',
  expectedTotal:105,
  actualTotal:data.length,
  summary,
  priority:{
    sourceDC:weakSource.map(cardView),
    sourceB1:b1.map(cardView),
    articleC:articleC.map(cardView),
    articleB_Bplus:articleB.map(cardView)
  }
};
if(data.length!==105) out.warning=`Expected 105 cards but got ${data.length}`;
const outPath=path.join(here,'RUNTIME_AUDIT_OUTPUT_20260809.json');
fs.writeFileSync(outPath,JSON.stringify(out,null,2)+'\n','utf8');

const md=[];
md.push('# 런타임 취약 인용 우선검증 목록 — 2026-08-09','');
md.push(`- 전체 카드: ${data.length}`);
md.push(`- 출처 D/C: ${weakSource.length}`);
md.push(`- 출처 B1 포함 카드: ${b1.length}`);
md.push(`- 조문 C: ${articleC.length}`);
md.push(`- 조문 B/B+: ${articleB.length}`,'');

const section=(title,items,formatter)=>{
  md.push(`## ${title} (${items.length})`,'');
  if(!items.length){md.push('- 없음','');return;}
  items.forEach((item,i)=>{
    md.push(`${i+1}. **${item.id} — ${item.title}**`);
    formatter(item).forEach(line=>md.push(`   - ${line}`));
  });
  md.push('');
};
section('1순위 — 출처 D/C',weakSource,item=>[
  ...(item.sourceLinkAudit?.entries||[]).filter(x=>['D','C'].includes(x.code)).map(x=>`${x.code} ${x.label} → ${x.url}`)
]);
section('2순위 — 출처 B1',b1,item=>[
  ...(item.sourceLinkAudit?.entries||[]).filter(x=>x.code==='B1').map(x=>`${x.label} → ${x.url}`),
  `판례강도 ${item.precedentCitationGrade}: ${item.precedentCitationAudit?.note||''}`
]);
section('3순위 — 조문 C',articleC,item=>[
  item.articleAccuracyAudit?.note||'',
  ...(item.statuteSources||[]).map(x=>`${x.label} → ${x.url}`)
]);
section('4순위 — 조문 B/B+',articleB,item=>[
  `등급 ${item.articleAccuracyGrade}: ${item.articleAccuracyAudit?.note||''}`,
  ...(item.statuteSources||[]).map(x=>`${x.label} → ${x.url}`)
]);
fs.writeFileSync(path.join(here,'RUNTIME_AUDIT_PRIORITY_20260809.md'),md.join('\n')+'\n','utf8');

console.log(JSON.stringify({actualTotal:data.length,sourceGrades:summary.sourceGrades,articleGrades:summary.articleGrades,precedentGrades:summary.precedentGrades,priorityCounts:{sourceDC:weakSource.length,sourceB1:b1.length,articleC:articleC.length,articleB_Bplus:articleB.length}},null,2));
