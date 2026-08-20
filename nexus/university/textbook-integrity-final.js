(()=>{'use strict';
const cur=window.NEXUS_CURRICULUM||{};
const econ=window.NEXUS_ECON_BUS_TEXTBOOKS||{},arch=window.NEXUS_ARCH_URBAN_TEXTBOOKS||{},edu=window.NEXUS_EDUCATION_TEXTBOOKS||{},inter=window.NEXUS_INTERDISCIPLINARY_TEXTBOOKS||{};
const groups=[['경제·경영',econ,(cur.courses||[]).filter(c=>/^(ECO|BUS|FIN)-/.test(c.id))],['건축·도시',arch,(cur.courses||[]).filter(c=>/^(ARC|ARE|URB)-/.test(c.id))],['교육·학습과학',edu,(cur.courses||[]).filter(c=>/^(EDU|LRS)-/.test(c.id))],['융합학부·세미나',inter,(cur.courses||[]).filter(c=>/^(INT|SEM)-/.test(c.id))]];
const invalid=[],counts={};for(const [label,data,courses] of groups){counts[label]={expected:courses.length,loaded:Object.keys(data).length};for(const c of courses){const t=data[c.id];if(!t)invalid.push(`${c.id}: ${label} 교재 데이터 없음`);else if(!Array.isArray(t.lessons)||t.lessons.length!==12)invalid.push(`${c.id}: Lesson ${t.lessons?.length||0}/12`);}}
const prior=window.NEXUS_TEXTBOOK_INTEGRITY||{ok:true,counts:{},invalid:[]};
const finalInvalid=[...(prior.invalid||[]),...invalid];
const totalCourses=(cur.all||[]).length||496;
const coreCount=(cur.core||[]).length||35;
const specializedPrevious=367;
const final94=Object.keys(econ).length+Object.keys(arch).length+Object.keys(edu).length+Object.keys(inter).length;
const deepTotal=coreCount+specializedPrevious+final94;
window.NEXUS_FULL_TEXTBOOK_INTEGRITY={ok:finalInvalid.length===0&&final94===94&&deepTotal===totalCourses,totalCourses,coreCount,specializedPrevious,final94,deepTotal,counts:{...(prior.counts||{}),...counts},invalid:finalInvalid};
window.NEXUS_TEXTBOOK_INTEGRITY=window.NEXUS_FULL_TEXTBOOK_INTEGRITY;
if(window.NEXUS_FULL_TEXTBOOK_INTEGRITY.ok)console.info(`NEXUS UNIVERSITY full textbook coverage OK: ${deepTotal}/${totalCourses}`);else console.error('NEXUS UNIVERSITY full textbook coverage failed',window.NEXUS_FULL_TEXTBOOK_INTEGRITY);
})();