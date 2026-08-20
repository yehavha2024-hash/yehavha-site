(()=>{'use strict';
const cur=window.NEXUS_CURRICULUM||{};
const law=window.NEXUS_LAW_TEXTBOOKS||{};const ai=window.NEXUS_AI_TEXTBOOKS||{};const philosophy=window.NEXUS_PHILOSOPHY_TEXTBOOKS||{};const social=window.NEXUS_SOCIAL_TEXTBOOKS||{};const natural=window.NEXUS_NATURAL_TEXTBOOKS||{};const engineering=window.NEXUS_ENGINEERING_TEXTBOOKS||{};const medicine=window.NEXUS_MEDICINE_TEXTBOOKS||{};
const groups=[
 ['법학',law,(cur.courses||[]).filter(c=>/^(LAW|PPA)-/.test(c.id))],
 ['AI',ai,(cur.courses||[]).filter(c=>/^(CS|DS|AI|ROB|SEC)-/.test(c.id))],
 ['철학',philosophy,(cur.courses||[]).filter(c=>/^PHI-/.test(c.id))],
 ['사회과학',social,(cur.courses||[]).filter(c=>/^(SOC|POL|PSY|ANT|URBS)-/.test(c.id))],
 ['자연과학',natural,(cur.courses||[]).filter(c=>/^(MATH|PHY|CHEM|BIO|ENV)-/.test(c.id))],
 ['공학',engineering,(cur.courses||[]).filter(c=>/^(ME|EE|CE|MSE|ISE)-/.test(c.id))],
 ['의학',medicine,(cur.courses||[]).filter(c=>/^(BMS|CLN|NEU|PH|MEH)-/.test(c.id))]
];
const invalid=[];const counts={};
for(const [label,data,courses] of groups){counts[label]={expected:courses.length,loaded:Object.keys(data).length};for(const c of courses){const t=data[c.id];if(!t)invalid.push(`${c.id}: ${label} 교재 데이터 없음`);else if(!Array.isArray(t.lessons)||t.lessons.length!==12)invalid.push(`${c.id}: Lesson ${t.lessons?.length||0}/12`);}}
window.NEXUS_TEXTBOOK_INTEGRITY={ok:invalid.length===0,counts,invalid};
if(invalid.length)console.error('NEXUS UNIVERSITY textbook integrity failed',window.NEXUS_TEXTBOOK_INTEGRITY);else console.info(`NEXUS UNIVERSITY textbook integrity OK: Law ${counts.법학.expected}, AI ${counts.AI.expected}, Philosophy ${counts.철학.expected}, Social ${counts.사회과학.expected}, Natural ${counts.자연과학.expected}, Engineering ${counts.공학.expected}, Medicine ${counts.의학.expected}`);
})();