(()=>{'use strict';
const cur=window.NEXUS_CURRICULUM||{};
const law=window.NEXUS_LAW_TEXTBOOKS||{};const ai=window.NEXUS_AI_TEXTBOOKS||{};const philosophy=window.NEXUS_PHILOSOPHY_TEXTBOOKS||{};const social=window.NEXUS_SOCIAL_TEXTBOOKS||{};
const groups=[
 ['법학',law,(cur.courses||[]).filter(c=>/^(LAW|PPA)-/.test(c.id))],
 ['AI',ai,(cur.courses||[]).filter(c=>/^(CS|DS|AI|ROB|SEC)-/.test(c.id))],
 ['철학',philosophy,(cur.courses||[]).filter(c=>/^PHI-/.test(c.id))],
 ['사회과학',social,(cur.courses||[]).filter(c=>/^(SOC|POL|PSY|ANT|URBS)-/.test(c.id))]
];
const invalid=[];const counts={};
for(const [label,data,courses] of groups){counts[label]={expected:courses.length,loaded:Object.keys(data).length};for(const c of courses){const t=data[c.id];if(!t)invalid.push(`${c.id}: ${label} 교재 데이터 없음`);else if(!Array.isArray(t.lessons)||t.lessons.length!==12)invalid.push(`${c.id}: Lesson ${t.lessons?.length||0}/12`);}}
window.NEXUS_TEXTBOOK_INTEGRITY={ok:invalid.length===0,counts,lawExpected:counts.법학.expected,lawLoaded:counts.법학.loaded,aiExpected:counts.AI.expected,aiLoaded:counts.AI.loaded,philosophyExpected:counts.철학.expected,philosophyLoaded:counts.철학.loaded,socialExpected:counts.사회과학.expected,socialLoaded:counts.사회과학.loaded,invalid};
if(invalid.length)console.error('NEXUS UNIVERSITY textbook integrity failed',window.NEXUS_TEXTBOOK_INTEGRITY);else console.info(`NEXUS UNIVERSITY textbook integrity OK: Law ${counts.법학.expected}, AI ${counts.AI.expected}, Philosophy ${counts.철학.expected}, Social Science ${counts.사회과학.expected}`);
})();