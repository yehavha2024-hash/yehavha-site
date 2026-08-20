(()=>{'use strict';
const cur=window.NEXUS_CURRICULUM||{};const theology=window.NEXUS_THEOLOGY_TEXTBOOKS||{};const humanities=window.NEXUS_HUMANITIES_TEXTBOOKS||{};const arts=window.NEXUS_ARTS_TEXTBOOKS||{};
const base=window.NEXUS_TEXTBOOK_INTEGRITY||{ok:true,counts:{},invalid:[]};const invalid=[...(base.invalid||[])];const counts={...(base.counts||{})};
const groups=[['신학',theology,(cur.courses||[]).filter(c=>/^(BIB|BLG|SYS|CHH|JRS)-/.test(c.id))],['인문학',humanities,(cur.courses||[]).filter(c=>/^(HIS|LIT|LIN|CIV)-/.test(c.id))],['예술',arts,(cur.courses||[]).filter(c=>/^(MUS|FAR|DES|AES)-/.test(c.id))]];
for(const [label,data,courses] of groups){counts[label]={expected:courses.length,loaded:Object.keys(data).length};for(const c of courses){const t=data[c.id];if(!t)invalid.push(`${c.id}: ${label} 교재 데이터 없음`);else if(!Array.isArray(t.lessons)||t.lessons.length!==12)invalid.push(`${c.id}: Lesson ${t.lessons?.length||0}/12`);}}
window.NEXUS_TEXTBOOK_INTEGRITY={ok:invalid.length===0,counts,invalid};
if(invalid.length)console.error('NEXUS UNIVERSITY humanities textbook integrity failed',window.NEXUS_TEXTBOOK_INTEGRITY);else console.info(`NEXUS UNIVERSITY textbook integrity OK: Theology ${counts.신학.expected}, Humanities ${counts.인문학.expected}, Arts ${counts.예술.expected}`);
})();