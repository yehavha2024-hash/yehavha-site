(()=>{'use strict';
const core=window.NEXUS_CORE_TEXTBOOK=window.NEXUS_CORE_TEXTBOOK||{};
const law=window.NEXUS_LAW_TEXTBOOKS||{};
const ai=window.NEXUS_AI_TEXTBOOKS||{};
const philosophy=window.NEXUS_PHILOSOPHY_TEXTBOOKS||{};
const social=window.NEXUS_SOCIAL_TEXTBOOKS||{};
Object.entries(law).forEach(([id,c])=>{
 core[id]={overview:`${c.focus}을 조문·법리·학설·판례·비교법·사례 포섭의 순서로 학습하는 전공 교재 과정이다. 단순한 법률요약이 아니라 적용규범을 특정하고 요건을 분해한 뒤 사실과 증거를 포섭하여 반론과 구제수단까지 구성한다.`,texts:c.readings||[],lessons:(c.lessons||[]).map(l=>[
  l.title,(l.lecture||[]).join(' '),
  [...(l.norms||[]).map(x=>`조문·규범: ${x}`),...(l.theory||[]).map(x=>`법리·학설: ${x}`),...(l.caseLaw||[]).map(x=>`판례: ${x}`),...(l.comparison||[]).map(x=>`비교법: ${x}`)],'',l.application||'',
  [...(c.readings||[]).slice(0,4),...(l.caseLaw||[])]
 ])};
});
Object.entries(ai).forEach(([id,c])=>{
 core[id]={overview:`${c.focus}을 알고리즘·수학모형·시스템 아키텍처·대표논문·실험·실패모드의 순서로 학습하는 전공 교재 과정이다. 개념을 암기하는 데 그치지 않고 최소 구현, 복잡도와 오차 분석, 실패 재현, 로그 기반 원인분석과 완화 설계까지 수행한다.`,texts:c.readings||[],lessons:(c.lessons||[]).map(l=>[
  l.title,(l.lecture||[]).join(' '),
  [...(l.algorithm||[]).map(x=>`알고리즘: ${x}`),...(l.system||[]).map(x=>`시스템 구조: ${x}`),...(l.papers||[]).map(x=>`대표논문: ${x}`),...(l.failures||[]).map(x=>`실패모드: ${x}`)],
  (l.math||[]).join(' · '),l.lab||'',
  [...(c.readings||[]).slice(0,4),...(l.papers||[])]
 ])};
});
Object.entries(philosophy).forEach(([id,c])=>{
 core[id]={overview:`${c.focus}을 사상가 소개나 결론 암기가 아니라 원전의 문제설정에서 출발해 핵심명제와 논증을 재구성하고, 대립학설과 가장 강한 반론을 검토한 뒤 현대 문제에 적용하는 철학 전공 교재 과정이다.`,texts:c.readings||[],lessons:(c.lessons||[]).map(l=>[
  l.title,(l.lecture||[]).join(' '),
  [...(l.primary||[]).map(x=>`원전: ${x}`),...(l.thesis||[]).map(x=>`핵심명제: ${x}`),...(l.argument||[]).map(x=>`논증: ${x}`),...(l.rival||[]).map(x=>`대립학설: ${x}`),...(l.objection||[]).map(x=>`반론: ${x}`)],
  '',l.modern||'',
  [...(c.readings||[]).slice(0,4),...(l.primary||[])]
 ])};
});
Object.entries(social).forEach(([id,c])=>{
 core[id]={overview:`${c.focus}을 이론 설명에 머물지 않고 개념화·변수화·연구설계·자료·인과추론·대표 경험연구·경쟁설명으로 검증하는 사회과학 전공 교재 과정이다. 상관관계와 인과관계를 구별하고 측정·표본·선택편향·외적타당도를 지속적으로 점검한다.`,texts:c.readings||[],lessons:(c.lessons||[]).map(l=>[
  l.title,(l.lecture||[]).join(' '),
  [...(l.theory||[]).map(x=>`이론: ${x}`),...(l.variables||[]).map(x=>`개념·변수: ${x}`),...(l.design||[]).map(x=>`연구설계: ${x}`),...(l.study||[]).map(x=>`경험연구: ${x}`),...(l.rival||[]).map(x=>`경쟁설명: ${x}`)],
  '',l.application||'',
  [...(c.readings||[]).slice(0,4),...(l.study||[])]
 ])};
});
window.NEXUS_SPECIALIZED_TEXTBOOK_COUNTS={law:Object.keys(law).length,ai:Object.keys(ai).length,philosophy:Object.keys(philosophy).length,social:Object.keys(social).length,total:Object.keys(law).length+Object.keys(ai).length+Object.keys(philosophy).length+Object.keys(social).length};
})();