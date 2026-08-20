(()=>{'use strict';
const core=window.NEXUS_CORE_TEXTBOOK=window.NEXUS_CORE_TEXTBOOK||{};
const law=window.NEXUS_LAW_TEXTBOOKS||{};
const ai=window.NEXUS_AI_TEXTBOOKS||{};
Object.entries(law).forEach(([id,c])=>{
 core[id]={overview:`${c.focus}을 조문·법리·학설·판례·비교법·사례 포섭의 순서로 학습하는 전공 교재 과정이다. 단순한 법률요약이 아니라 적용규범을 특정하고 요건을 분해한 뒤 사실과 증거를 포섭하여 반론과 구제수단까지 구성한다.`,texts:c.readings||[],lessons:(c.lessons||[]).map(l=>[
  l.title,
  (l.lecture||[]).join(' '),
  [...(l.norms||[]).map(x=>`조문·규범: ${x}`),...(l.theory||[]).map(x=>`법리·학설: ${x}`),...(l.caseLaw||[]).map(x=>`판례: ${x}`),...(l.comparison||[]).map(x=>`비교법: ${x}`)],
  '',
  l.application||'',
  [...(c.readings||[]).slice(0,4),...(l.caseLaw||[])]
 ])};
});
Object.entries(ai).forEach(([id,c])=>{
 core[id]={overview:`${c.focus}을 알고리즘·수학모형·시스템 아키텍처·대표논문·실험·실패모드의 순서로 학습하는 전공 교재 과정이다. 개념을 암기하는 데 그치지 않고 최소 구현, 복잡도와 오차 분석, 실패 재현, 로그 기반 원인분석과 완화 설계까지 수행한다.`,texts:c.readings||[],lessons:(c.lessons||[]).map(l=>[
  l.title,
  (l.lecture||[]).join(' '),
  [...(l.algorithm||[]).map(x=>`알고리즘: ${x}`),...(l.system||[]).map(x=>`시스템 구조: ${x}`),...(l.papers||[]).map(x=>`대표논문: ${x}`),...(l.failures||[]).map(x=>`실패모드: ${x}`)],
  (l.math||[]).join(' · '),
  l.lab||'',
  [...(c.readings||[]).slice(0,4),...(l.papers||[])]
 ])};
});
window.NEXUS_SPECIALIZED_TEXTBOOK_COUNTS={law:Object.keys(law).length,ai:Object.keys(ai).length,total:Object.keys(law).length+Object.keys(ai).length};
})();