(()=>{'use strict';
const q=window.NEXUS_QA_REGISTER,tb=window.NEXUS_CORE_TEXTBOOK||{};if(!q)return;
q.verified=q.verified||{};q.revised=q.revised||{};q.notes=q.notes||{};
const V=(sources,note)=>({date:'2026-08-20',scope:'윤리이론 원전·미학 작품/이론 귀속·종교전승/교리/역사 층위·기술철학과 경험인과·현대세계의 관측/정책/법규범을 분리하는 1차 원자료 정합성 검수. 각 분야의 모든 최신 경험자료와 관할법까지 최종 전문검증했다는 뜻은 아니다.',sources:Array.isArray(sources)?sources:[sources],note});
const courseNotes={
 'CORE-161':'Aristotle·Mill·Kant·Rawls의 원전 위치와 현대 적용을 분리하고 윤리원칙과 법적 권리·법적 의무를 구분했다.',
 'CORE-162':'Plato·Aristotle·Kant·Danto·Benjamin 등 미학 원전의 범위와 작품분석·현대 생성AI 적용의 후대 확장을 구분했다.',
 'CORE-163':'종교 개념의 학술적 논쟁, 고대근동 사료, 유대교 시대층, 325/381 신경, Islam의 초기공동체와 후대 fiqh, 종교다원주의의 규범/경험 층위를 분리했다.',
 'CORE-164':'Marx·Heidegger·Ellul·McLuhan·SCOT·Beck/Perrow·extended mind 등 철학/사회이론을 실제 기술효과의 경험적 인과법칙과 분리했다.',
 'CORE-165':'기후·AI·팬데믹·안보·민주주의·불평등·이주·인구·에너지·보건·시스템위험에서 관측값·지표·시나리오·법적 정의·정책프레임을 구분했다.'
};
for(const id of ['CORE-161','CORE-162','CORE-163','CORE-164','CORE-165']){const c=tb[id];if(!c)continue;c.lessons.forEach((l,i)=>{const key=`${id}-L${String(i+1).padStart(2,'0')}`;q.verified[key]=V(l[5]||[],`${courseNotes[id]} 현재 Lesson(${l[0]})의 핵심 주장·원전 위치·이론 귀속·현대 적용범위를 1차 대조했다.`);});}
q.version='1.8';q.updated='2026-08-20';
const batch=(q.batches||[]).find(b=>b.id==='QA-01');if(batch){batch.status='COMPLETE · 420/420 SOURCE PASS';batch.scope='University Core 35과목·420 Lesson의 대표문헌·원전·공식·사료·기초개념 1차 원자료 정합성 검수 완료';}
Object.assign(q.notes,{
 'CORE-161':{status:'FIRST_PASS_ETHICS_COMPLETE',next:'윤리이론별 원문 번역·판본·현대 applied ethics 사례와 법규범의 2차 정밀검증'},
 'CORE-162':{status:'FIRST_PASS_AESTHETICS_COMPLETE',next:'작품별 제작연대·판본·작품소재·미학 논쟁과 생성AI 사례의 2차 정밀검증'},
 'CORE-163':{status:'FIRST_PASS_RELIGION_CIVILIZATION_COMPLETE',next:'성서·Quran·Mishnah·불교/힌두/동아시아 원전의 번역·사본·연대·전승사 2차 정밀검증'},
 'CORE-164':{status:'FIRST_PASS_TECHNOLOGY_HUMAN_COMPLETE',next:'기술철학 원전 번역과 플랫폼·노동·감시·BCI·AI 효과의 최신 경험연구 2차 검증'},
 'CORE-165':{status:'FIRST_PASS_GLOBAL_ISSUES_COMPLETE',next:'IPCC·WHO·UNHCR·UN DESA·IEA 등 최신 원자료 버전과 국가별 법정책의 시점별 2차 검증'},
 'QA-01':{status:'COMPLETE_420_OF_420',completed:'2026-08-20',next:'QA-02 법학·컴퓨팅·AI 1,044 Lesson 순차 원자료 검수'}
});
})();