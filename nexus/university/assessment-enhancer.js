(()=>{'use strict';
const cur=window.NEXUS_CURRICULUM||{};const id=new URLSearchParams(location.search).get('id');const c=(cur.all||[]).find(x=>x.id===id);if(!c)return;
const esc=window.NEXUS_UNIVERSITY_UTILS.escapeHtml;
function kind(id,domain){if(id.startsWith('CORE-'))return'core';if(/^(LAW|PPA)-/.test(id))return'law';if(/^(CS|DS|AI|ROB|SEC)-/.test(id))return'ai';if(/^PHI-/.test(id))return'philosophy';if(/^(SOC|POL|PSY|ANT|URBS)-/.test(id))return'social';if(/^(MATH|PHY|CHEM|BIO|ENV)-/.test(id))return'natural';if(/^(ME|EE|CE|MSE|ISE)-/.test(id))return'engineering';if(/^(BMS|CLN|NEU|PH|MEH)-/.test(id))return'medicine';if(/^(BIB|BLG|SYS|CHH|JRS)-/.test(id))return'theology';if(/^(HIS|LIT|LIN|CIV)-/.test(id))return'humanities';if(/^(MUS|FAR|DES|AES)-/.test(id))return'arts';if(/^(ECO|BUS|FIN)-/.test(id))return'economics';if(/^(ARC|ARE|URB)-/.test(id))return'architecture';if(/^(EDU|LRS)-/.test(id))return'education';if(/^(INT|SEM)-/.test(id))return'interdisciplinary';return domain||'core'}
function tier(v){const n=Number(v)||0;if(n>=500||(n>=5&&n<10))return{code:'T4',name:'Synthesis · Defense',weight:'독립적 종합·대안설계·구두방어'};if(n>=400||n===4)return{code:'T3',name:'Evaluation · Design',weight:'근거평가·설계·비판·검증'};if(n>=300||n===3)return{code:'T2',name:'Analysis · Application',weight:'분석·적용·비교·오류검출'};return{code:'T1',name:'Foundation · Explanation',weight:'정의·구분·기초적용·정확성'}}
const profiles={
 core:['개념·논증 시험|핵심개념 6개를 정의·구분하고 전제와 적용한계를 설명한다.','근거비교 과제|대표문헌 2개를 비교해 주장·근거·방법·한계를 표로 재구성한다.','통합 적용|처음 보는 사례를 두 개 이상의 학문 렌즈로 분석한다.','현대 복합문제를 문제정의→근거→대안설명→반론→잠정결론으로 분석한다.'],
 law:['법원·쟁점 시험|적용 가능한 법원과 쟁점을 식별하고 법률요건·법효과를 구조화한다.','판례·학설 과제|권위 있는 원문을 확인해 판시사항·다수/대립논증·학설 차이를 비교한다.','사례 포섭|사실→쟁점→조문→요건→증거→포섭→반론→구제수단 순으로 작성한다.','새로운 복합사례에 조문·판례·학설·비교법을 사용한 법률의견서를 작성하고 가장 강한 반대논증에 답한다.'],
 ai:['원리·수학 시험|핵심 알고리즘의 입력·출력·목적함수·복잡도 또는 오차요인을 설명한다.','구현·재현 과제|최소 구현 또는 실험설계를 작성하고 평가척도·baseline·로그를 정의한다.','실패 분석|대표 failure mode를 재현하거나 가정해 원인·영향·검출·완화대책을 제시한다.','하나의 AI 시스템을 설계해 알고리즘·데이터·아키텍처·평가·보안·안전·사회적 한계를 통합 방어한다.'],
 philosophy:['원전 시험|핵심 구절의 문제설정과 명제를 정확히 재구성한다.','논증지도 과제|전제→추론→결론을 형식화하고 숨은 전제를 표시한다.','대립학설 논박|경쟁입장을 steelman한 뒤 반론과 재반론을 작성한다.','원전 2개 이상을 직접 대조하여 현대 문제에 대한 독립 논증을 구성하고 예상 반론에 답한다.'],
 social:['이론·개념화 시험|이론을 변수와 관찰가능한 지표로 변환한다.','연구설계 과제|가설·표본·측정·식별전략·자료·윤리를 설계한다.','인과·경쟁설명|상관과 인과를 구분하고 최소 두 경쟁설명을 검토한다.','실제 사회문제에 대해 재현 가능한 연구계획 또는 데이터 분석노트를 작성하고 외적타당도까지 평가한다.'],
 natural:['법칙·모형 시험|법칙의 변수·단위·가정·경계조건을 설명하고 기본 계산을 수행한다.','실험설계|독립/종속변수·통제·측정장치·불확도를 명시한다.','데이터·오차 분석|예측값과 관측값의 차이를 오차·모형한계·경쟁가설로 분해한다.','하나의 현상을 이론→수학모형→실험→데이터→불확도→한계 순으로 재현 가능한 연구보고서로 작성한다.'],
 engineering:['요구조건 시험|기능·성능·제약·안전 요구조건을 측정가능하게 정의한다.','설계계산 과제|모델·계산·시뮬레이션으로 설계대안을 비교하고 설계여유를 제시한다.','V&V·FMEA|검증기준과 시험계획을 만들고 대표 고장모드의 위험을 평가한다.','요구조건→설계→계산→시뮬레이션→프로토타입→검증→FMEA→안전대책을 하나의 설계검토서로 통합한다.'],
 medicine:['기전 시험|정상구조·생리에서 병태생리와 증상·징후가 발생하는 경로를 설명한다.','진단추론 과제|교육용 사례에서 문제목록·위험신호·감별진단·검사전확률을 구성한다.','근거비평|가이드라인·RCT·관찰연구의 근거수준과 적용한계를 비교한다.','교육용 복합사례를 정상→병태생리→감별→검사→치료원리→근거→환자안전 순으로 분석하고 불확실성을 명시한다.'],
 theology:['본문·원어 시험|본문의 핵심 어휘·문법·문맥을 번역과 구별해 설명한다.','본문비평·해석사|주요 사본·전승·역사맥락과 대표 해석의 근거를 비교한다.','대립해석 논증|교리적 결론과 본문이 직접 말하는 범위를 구분하고 경쟁해석을 검토한다.','원문·본문비평·역사맥락·해석사·교리적 함의를 연결한 주해논문을 작성하고 대립해석에 답한다.'],
 humanities:['원전·사료 시험|자료의 작성자·시기·목적·장르·전승조건을 식별한다.','사료비판 과제|독립자료를 교차검증하고 침묵·편향·생존편향을 평가한다.','해석 비교|사학사 또는 비평이론 두 관점으로 동일 자료를 재해석한다.','원전·1차자료를 중심으로 하나의 해석을 논증하고 경쟁해석과 자료의 한계를 함께 제시한다.'],
 arts:['형식·작품분석|대표작품을 형식·재료·기법·맥락으로 분석한다.','기법 실습|정해진 제약조건 아래 짧은 작품·디자인·편곡을 제작한다.','비평·수정|동료비평 기준표로 결과물을 평가하고 수정 전후 근거를 기록한다.','기획→제작→비평→수정의 전 과정을 포트폴리오로 제출하고 미학적·기술적 선택을 구두 또는 서면으로 방어한다.'],
 economics:['모형 시험|가정·변수·균형조건·비교정태 또는 회계관계를 설명하고 계산한다.','자료·추정 과제|자료 출처·변수·식별전략·민감도 또는 재무가정을 명시한다.','의사결정 사례|정량결과를 위험·기회비용·이해관계자 효과와 연결한다.','현실 의사결정 문제를 모형→자료→추정·계산→시나리오→민감도→위험→결론으로 분석한다.'],
 architecture:['대지·프로그램 시험|사용자·대지·법규·환경·프로그램 요구를 설계조건으로 전환한다.','설계·성능 과제|도면/BIM/모형으로 대안을 제시하고 구조·환경·동선·접근성을 검증한다.','비평·수정|성능지표와 비평을 근거로 설계를 반복 수정한다.','대지분석→프로그램→설계안→구조·환경·법규검토→표현→비평→수정안을 통합한 Design Review를 제출한다.'],
 education:['학습이론 시험|학습목표·선수지식·인지과정·전이조건을 설명한다.','교수설계 과제|목표-활동-평가 정렬을 갖춘 수업·학습환경을 설계한다.','학습데이터 분석|평가결과·오개념·피드백 반응을 근거로 재설계한다.','진단→목표→활동→평가→피드백→데이터→재설계의 완결된 Instructional Design과 검증계획을 제출한다.'],
 interdisciplinary:['시스템 정의|문제경계·이해관계자·인과경로와 전문분야별 핵심 질문을 정의한다.','증거·위험 매트릭스|각 분야의 자료·불확실성·실패경로를 하나의 표에 통합한다.','정책·설계 대안|가치충돌·법·윤리·기술·경제 trade-off를 비교한다.','복합문제에 대해 시스템맵→증거→위험→시나리오→법·거버넌스→대안설계→잔여위험을 통합하고 공개 방어 가능한 Capstone을 작성한다.']
};
const k=kind(c.id,c.domain),p=profiles[k]||profiles.core,t=tier(c.level);const section=[...document.querySelectorAll('section')].find(s=>s.querySelector('.section-head h2')?.textContent.includes('Final Assessment'));if(!section)return;
const cards=section.querySelector('.textbook-assessment');if(cards){cards.innerHTML=p.slice(0,3).map((x,i)=>{const [a,b]=x.split('|');return `<div><strong>${esc(`${t.code}-${i+1} ${a}`)}</strong><span>${esc(b)} · 난이도 기준: ${esc(t.weight)}</span></div>`}).join('')}
const cap=[...section.querySelectorAll('.assessment')].find(x=>x.querySelector('h3')?.textContent.includes('Capstone'));if(cap){cap.innerHTML=`<h3>Capstone · ${esc(t.code)} ${esc(t.name)}</h3><p>${esc(p[3])}</p><p><strong>평가기준</strong> 정확성 25 · 근거/원자료 25 · 방법/적용 20 · 반론/한계 15 · 구조/표현 15. 고급 Level일수록 독립자료 대조와 대안설계의 비중을 높입니다.</p>`}
section.querySelector('.section-head span').textContent=`${t.code} · ${t.name.toUpperCase()}`;
})();
