(()=>{'use strict';
const cur=window.NEXUS_CURRICULUM||{};const law=window.NEXUS_LAW_TEXTBOOKS||{};const ai=window.NEXUS_AI_TEXTBOOKS||{};
const lawCourses=(cur.courses||[]).filter(c=>/^(LAW|PPA)-/.test(c.id));const aiCourses=(cur.courses||[]).filter(c=>/^(CS|DS|AI|ROB|SEC)-/.test(c.id));
const invalid=[];
for(const c of lawCourses){const t=law[c.id];if(!t)invalid.push(`${c.id}: 법학 교재 데이터 없음`);else if(!Array.isArray(t.lessons)||t.lessons.length!==12)invalid.push(`${c.id}: Lesson ${t.lessons?.length||0}/12`);}
for(const c of aiCourses){const t=ai[c.id];if(!t)invalid.push(`${c.id}: AI 교재 데이터 없음`);else if(!Array.isArray(t.lessons)||t.lessons.length!==12)invalid.push(`${c.id}: Lesson ${t.lessons?.length||0}/12`);}
window.NEXUS_TEXTBOOK_INTEGRITY={ok:invalid.length===0,lawExpected:lawCourses.length,lawLoaded:Object.keys(law).length,aiExpected:aiCourses.length,aiLoaded:Object.keys(ai).length,invalid};
if(invalid.length)console.error('NEXUS UNIVERSITY textbook integrity failed',window.NEXUS_TEXTBOOK_INTEGRITY);else console.info(`NEXUS UNIVERSITY textbook integrity OK: Law ${lawCourses.length}, AI ${aiCourses.length}`);
})();