(()=>{'use strict';
const q=window.NEXUS_QA_REGISTER,tb=window.NEXUS_CORE_TEXTBOOK||{};if(!q)return;
q.verified=q.verified||{};q.revised=q.revised||{};q.notes=q.notes||{};
const V=(sources,note)=>({date:'2026-08-20',scope:'정의·정리·공식의 기호·조건·단위·해석과 지정 대표문헌의 1차 정합성 검수. 이 상태는 모든 예제·연습문제의 최종 수치검산 또는 모든 판본의 페이지 대조 완료를 의미하지 않는다.',sources:Array.isArray(sources)?sources:[sources],note});
const courseNotes={
 'CORE-111':'수학적 정의와 증명조건을 점검하고 정의역·공역, 귀납 시작점, 극한의 ε–N 정의, 군 공리, convexity 조건과 차원표기를 교정했다.',
 'CORE-112':'비율·성장률·단위·기울기·로그·그래프·현재가치·기대손실·z-score의 적용조건과 단위를 점검했다.',
 'CORE-113':'확률공리·조건부확률·분포가정·CLT·표준오차·신뢰구간·p값·효과크기·회귀·FDR의 수학적·통계적 해석을 점검했다.',
 'CORE-114':'데이터 생성·측정척도·선택편향·결측기제·Simpson 역설·예측/인과·피드백루프·재현가능성의 해석 경계를 점검했다.',
 'CORE-115':'stock-flow 단위, 네트워크 표기, 민감도, Monte Carlo, 일반화·calibration, robust decisionmaking, leverage points의 적용범위를 점검했다.'
};
for(const id of ['CORE-111','CORE-112','CORE-113','CORE-114','CORE-115']){const c=tb[id];if(!c)continue;c.lessons.forEach((l,i)=>{const key=`${id}-L${String(i+1).padStart(2,'0')}`;q.verified[key]=V(l[5]||[],`${courseNotes[id]} 현재 Lesson(${l[0]})의 표기·조건과 연결 문헌을 1차 대조했다.`);});}
Object.assign(q.revised,{
 'CORE-111-L01':{date:'2026-08-20',reason:'여집합 표기가 기준 전체집합을 숨김',change:'Aᶜ=U\\A로 전체집합 의존성을 명시.'},
 'CORE-111-L03':{date:'2026-08-20',reason:'range가 공역과 image를 혼동시킬 수 있음',change:'domain·codomain·image를 분리하고 f(A)⊆B를 명시.'},
 'CORE-111-L05':{date:'2026-08-20',reason:'귀납법이 P(1)에서만 시작하는 것처럼 고정',change:'일반 시작점 n₀에 대한 귀납원리로 교정.'},
 'CORE-111-L06':{date:'2026-08-20',reason:'극한을 단순 안정값으로만 설명',change:'ε–N 정의를 추가해 수렴의 정량조건 명시.'},
 'CORE-111-L09':{date:'2026-08-20',reason:'대수구조와 군의 정의가 과도하게 축약',change:'닫힘·결합법칙·항등원·역원 공리를 명시.'},
 'CORE-111-L10':{date:'2026-08-20',reason:'일반 최적화와 convex optimization의 범위 혼동',change:'일반 제약식과 convexity 추가조건을 분리.'},
 'CORE-112-L02':{date:'2026-08-20',reason:'복리식이 변화하는 성장률에도 그대로 적용될 수 있음',change:'일정 r과 기간별 rₖ의 경우를 분리.'},
 'CORE-112-L03':{date:'2026-08-20',reason:'NIST SI Guide만을 현행 SI 권위자료처럼 제시',change:'BIPM SI Brochure 9판 2019, 2026 update를 현행 기준자료로 추가.'},
 'CORE-112-L05':{date:'2026-08-20',reason:'로그 항등식의 정의역 조건 누락',change:'x,y>0, b>0, b≠1 조건을 명시.'},
 'CORE-112-L06':{date:'2026-08-20',reason:'축 0 시작 규칙의 그래프 전반 과잉일반화 가능성',change:'막대길이 인코딩과 선그래프를 구별해 축 범위 원칙을 수정.'},
 'CORE-112-L07':{date:'2026-08-20',reason:'대표값 Lesson에 index number가 혼입',change:'평균·중앙값·분포 중심으로 제목과 개념을 정리.'},
 'CORE-112-L08':{date:'2026-08-20',reason:'Fermi 추정 요인을 확률적으로 독립이라고 오인할 표현',change:'단순 분해요인으로 수정하고 독립성은 별도 가정임을 명시.'},
 'CORE-112-L09':{date:'2026-08-20',reason:'PV 단일 미래금액 식이 현금흐름 일반식처럼 사용될 가능성',change:'복수 현금흐름 PV 합으로 확장하고 일정 할인율 조건 명시.'},
 'CORE-112-L11':{date:'2026-08-20',reason:'z-score에 모집단 μ,σ만 제시',change:'모집단 기준과 표본 내부 표준화를 분리.'},
 'CORE-113-L01':{date:'2026-08-20',reason:'확률공리를 P(Ω)=1과 여사건만으로 축약',change:'비음성·정규화·가산가법성을 명시하고 여사건식을 파생결과로 이동.'},
 'CORE-113-L02':{date:'2026-08-20',reason:'조건부확률 정의의 P(B)>0 조건 누락',change:'정의조건과 독립성 등가식을 추가.'},
 'CORE-113-L05':{date:'2026-08-20',reason:'Binomial 공식을 여러 분포의 일반식처럼 보이게 할 위험',change:'고정 n·독립 Bernoulli·동일 p 조건을 명시하고 다른 분포의 가정과 분리.'},
 'CORE-113-L06':{date:'2026-08-20',reason:'CLT의 조건과 수렴방식 누락',change:'대표 iid·유한분산 조건과 분포수렴 기호 ⇒를 명시.'},
 'CORE-113-L07':{date:'2026-08-20',reason:'SE(X̄)=s/√n을 정의식처럼 사용',change:'σ/√n과 추정량 s/√n을 분리하고 비복원추출 FPC를 추가.'},
 'CORE-113-L08':{date:'2026-08-20',reason:'z 신뢰구간을 일반 95% CI처럼 제시',change:'σ 미지 정규표본의 t 구간을 제시하고 빈도주의 coverage 해석을 명시.'},
 'CORE-113-L09':{date:'2026-08-20',reason:'p=P(T≥Tobs|H0)를 모든 p값의 보편식처럼 표기',change:'지정 모형 아래 equally/more incompatible 결과의 확률로 일반정의하고 단·양측 검정 차이를 명시.'},
 'CORE-113-L10':{date:'2026-08-20',reason:'통계적 유의성과 효과크기·검정력 관계 축약',change:'α·효과크기·n·분산·설계가 검정력에 영향을 준다는 조건 추가.'},
 'CORE-113-L11':{date:'2026-08-20',reason:'회귀계수를 인과효과로 오인할 가능성',change:'조건부 연관과 인과식별 가정을 분리.'},
 'CORE-113-L12':{date:'2026-08-20',reason:'FDR·Bayesian inference·preregistration이 한 종류의 불확실성 방법처럼 결합',change:'오류율·추론체계·연구운영 절차로 역할을 분리하고 BH 1995를 추가.'},
 'CORE-114-L01':{date:'2026-08-20',reason:'Observed=Signal+Noise를 보편적 데이터 생성식처럼 제시',change:'schematic measurement model로 한정.'},
 'CORE-114-L02':{date:'2026-08-20',reason:'Stevens 척도에 따른 연산제한을 절대규칙처럼 읽을 위험',change:'고전적 측정틀과 실제 분석판단을 분리.'},
 'CORE-114-L03':{date:'2026-08-20',reason:'선택편향을 단순 대표성 문제로만 설명할 위험',change:'포함·제외 메커니즘의 인과구조를 Hernán et al. 2004에 맞춰 명확화.'},
 'CORE-114-L04':{date:'2026-08-20',reason:'MCAR/MAR/MNAR을 데이터에서 직접 판정 가능한 범주처럼 단순화',change:'분석모형과 관측정보에 조건부인 결측기제 가정임을 명시.'},
 'CORE-114-L07':{date:'2026-08-20',reason:'Simpson 역설을 분모 재구성만으로 해결하는 인상',change:'적절한 집계·층화는 인과구조와 질문에 달린다는 점을 명시.'},
 'CORE-114-L08':{date:'2026-08-20',reason:'예측정확도와 인과설명의 구분 보강 필요',change:'Shmueli 2010과 causal inference를 연결해 예측/개입 질문을 분리.'},
 'CORE-114-L09':{date:'2026-08-20',reason:'알고리즘 피드백루프에 기술적 원문헌 부족',change:'Perdomo et al. 2020과 Ensign et al. 2018을 직접 연결.'},
 'CORE-114-L11':{date:'2026-08-20',reason:'재현가능성 요건이 추상적',change:'데이터·코드·버전·분석결정·실행순서 기록을 명시.'},
 'CORE-115-L03':{date:'2026-08-20',reason:'stock-flow 식의 다중유입·유출과 단위가 생략',change:'Σ inflow−Σ outflow와 [flow]=[stock]/time을 명시.'},
 'CORE-115-L08':{date:'2026-08-20',reason:'∂Y/∂Xᵢ를 global sensitivity의 일반식처럼 사용',change:'local derivative와 variance-based Sobol first-order index를 분리.'},
 'CORE-115-L09':{date:'2026-08-20',reason:'Monte Carlo 표본평균을 결과분포 추정식으로 오인할 수 있음',change:'기댓값 추정 μ̂와 empirical CDF F̂를 분리.'},
 'CORE-115-L10':{date:'2026-08-20',reason:'calibration과 validation/generalization 개념 혼재',change:'학습·검증·일반화·확률보정/파라미터보정을 문맥별로 분리.'},
 'CORE-115-L11':{date:'2026-08-20',reason:'minimax 식을 Robust Decision Making 전체 절차의 정의처럼 사용',change:'minimax를 예시 규칙으로 한정하고 RAND RDM의 plausible futures·vulnerability 탐색을 명시.'},
 'CORE-115-L12':{date:'2026-08-20',reason:'Meadows leverage points를 보편적 처방순위처럼 읽을 위험',change:'맥락검증이 필요한 시스템사고 휴리스틱임을 명시.'}
});
q.version='1.4';q.updated='2026-08-20';
const batch=(q.batches||[]).find(b=>b.id==='QA-01');if(batch)batch.status='ACTIVE · 120/420 SOURCE PASS';
Object.assign(q.notes,{
 'CORE-111':{status:'FIRST_PASS_MATH_DEFINITION_COMPLETE',next:'예제·증명의 논리적 완결성과 반례·경계조건 2차 검산'},
 'CORE-112':{status:'FIRST_PASS_QUANT_UNITS_COMPLETE',next:'실제 수치예제의 단위·환산·금융계산 2차 검산'},
 'CORE-113':{status:'FIRST_PASS_STATISTICAL_INTERPRETATION_COMPLETE',next:'분포별 가정·검정통계량·CI·효과크기 예제의 수치검산'},
 'CORE-114':{status:'FIRST_PASS_DATA_INTERPRETATION_COMPLETE',next:'데이터 사례의 선택·결측·시각화·거버넌스 적용조건 2차 검증'},
 'CORE-115':{status:'FIRST_PASS_MODEL_UNCERTAINTY_COMPLETE',next:'민감도·Monte Carlo·RDM 예제와 시뮬레이션 산출물의 수치검산'}
});
})();