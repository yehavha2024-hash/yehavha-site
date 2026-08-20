(()=>{'use strict';
const q=window.NEXUS_QA_REGISTER,tb=window.NEXUS_CORE_TEXTBOOK||{};if(!q)return;
q.verified=q.verified||{};q.revised=q.revised||{};q.notes=q.notes||{};
const V=(sources,note)=>({date:'2026-08-20',scope:'고전이론 원문과 현대 경험연구의 구분, 법적 관할·시점, 경제모형의 가정·조건, 심리학 효과크기·재현성·인과해석의 1차 정합성 검수. 모든 후속 경험연구의 최신 메타분석이나 모든 관할의 법령·판례를 최종 확정했다는 뜻은 아니다.',sources:Array.isArray(sources)?sources:[sources],note});
const courseNotes={
 'CORE-131':'고전 사회이론의 원문명제와 현대적 AI·플랫폼 적용을 분리하고, 이론적 설명을 경험적 인과결론처럼 쓰는 부분을 교정했다.',
 'CORE-132':'정치사상·비교정치·국제정치의 이론수준을 분리하고, 알고리즘 거버넌스의 경험명제와 한국·EU 현행법의 시점·관할을 구분했다.',
 'CORE-133':'미시·거시경제의 공식이 성립하는 가정·내부해·시장구조·회계항등식을 명시하고 휴리스틱 식을 보편법칙처럼 쓰는 부분을 교정했다.',
 'CORE-134':'법원·계약·불법행위·형사책임·비례심사·증거·법해석을 관할별로 구분하고 2026-08-20 현행 AI 법제를 별도 표시했다.',
 'CORE-135':'고전 심리실험과 현대 재현성 연구를 분리하고, 전망이론 공식 귀속·신호탐지·학습용어·성격예측·인간-AI 신뢰의 효과조건을 교정했다.'
};
for(const id of ['CORE-131','CORE-132','CORE-133','CORE-134','CORE-135']){const c=tb[id];if(!c)continue;c.lessons.forEach((l,i)=>{const key=`${id}-L${String(i+1).padStart(2,'0')}`;q.verified[key]=V(l[5]||[],`${courseNotes[id]} 현재 Lesson(${l[0]})의 핵심 주장과 지정 문헌·법령·모형을 1차 대조했다.`);});}
Object.assign(q.revised,{
 'CORE-131-L02':{date:'2026-08-20',reason:'Durkheim의 집계비교를 현대적 causal identification처럼 읽을 위험',change:'Rules의 social fact 정의와 Suicide의 역사적 설명을 현대 실험인과와 분리.'},
 'CORE-131-L03':{date:'2026-08-20',reason:'Marx alienation을 Capital 단일 출처에 귀속',change:'surplus value는 Capital, estranged labour는 1844 Manuscripts로 원전 분리.'},
 'CORE-131-L05':{date:'2026-08-20',reason:'Goffman dramaturgy를 symbolic interactionism 전체와 동일시',change:'interaction order·performance·impression management로 범위 한정.'},
 'CORE-131-L07':{date:'2026-08-20',reason:'Bourdieu의 모든 자본개념을 Distinction에 일괄 귀속',change:'1986 The Forms of Capital을 경제·문화·사회자본의 직접 자료로 추가.'},
 'CORE-131-L10':{date:'2026-08-20',reason:'weak ties 취업효과를 보편법칙처럼 표현',change:'Granovetter 1973의 네트워크 bridge 메커니즘과 경험적 범위를 구분.'},
 'CORE-131-L12':{date:'2026-08-20',reason:'platform society 이론만으로 알고리즘 노동통제를 경험적으로 단정',change:'Rosenblat & Stark 2016 경험연구를 별도 연결.'},
 'CORE-132-L01':{date:'2026-08-20',reason:'권력을 강제·의제설정 정도로 축약',change:'Lukes의 3차원과 preference-shaping을 분리하고 실제 인과입증 필요 명시.'},
 'CORE-132-L02':{date:'2026-08-20',reason:'Weber의 state 정의와 sovereignty를 동일시',change:'정당한 물리적 강제력 독점 주장과 법적 주권개념을 분리.'},
 'CORE-132-L04':{date:'2026-08-20',reason:'Federalist의 미국 헌정논증을 보편 권력분립 모델처럼 사용',change:'Montesquieu와 Federalist 47·51의 역사·관할 맥락 명시.'},
 'CORE-132-L05':{date:'2026-08-20',reason:'polyarchy를 민주주의의 모든 규범적 이상과 동일시할 위험',change:'public contestation과 inclusiveness/participation의 경험적 개념으로 정리.'},
 'CORE-132-L08':{date:'2026-08-20',reason:'관료제를 단일 principal-agent 구조로 환원',change:'분석모형임을 명시하고 다중 principal·전문규범·법적 권한의 별도성을 보강.'},
 'CORE-132-L09':{date:'2026-08-20',reason:'대통령제/의원내각제 효과를 결정론적으로 읽을 위험',change:'Linz 논쟁과 후속 비교연구의 경험적 조건부 성격 명시.'},
 'CORE-132-L11':{date:'2026-08-20',reason:'추천알고리즘→정치양극화를 자동 인과로 표현',change:'polarization/backsliding/disinformation 개념을 분리하고 플랫폼별 causal evidence 필요 명시.'},
 'CORE-132-L12':{date:'2026-08-20',reason:'algorithmic governance 이론과 현행 AI 법규 혼재',change:'한국 AI기본법 2026-07-21 시행 및 EU AI Act 2026-08-02 일반적용·Art.113 단계별 예외를 2026-08-20 시점으로 분리.'},
 'CORE-133-L01':{date:'2026-08-20',reason:'MB≥MC를 모든 최적화의 보편조건처럼 사용',change:'이산 marginal rule과 연속 내부해 MB=MC·2차조건을 구분.'},
 'CORE-133-L02':{date:'2026-08-20',reason:'선형 수요·공급식을 일반법칙처럼 제시',change:'Qd/Qs 선형식을 illustrative model로 한정.'},
 'CORE-133-L03':{date:'2026-08-20',reason:'탄력성의 미분정의·부호·유한변화 기준점 누락',change:'point elasticity와 arc/midpoint elasticity를 분리.'},
 'CORE-133-L04':{date:'2026-08-20',reason:'예산제약을 항상 등식으로 표기',change:'p·x≤m을 기본으로 하고 local nonsatiation 등 조건 아래 binding을 설명.'},
 'CORE-133-L05':{date:'2026-08-20',reason:'고정비·sunk cost와 marginal output decision 혼재',change:'단기 산출량과 진입·장기규모 의사결정 분리.'},
 'CORE-133-L06':{date:'2026-08-20',reason:'MR=MC를 모든 시장구조의 일반식처럼 표기',change:'내부·미분가능 이윤최적화 조건으로 한정하고 perfect competition의 p=MR 조건을 별도 명시.'},
 'CORE-133-L07':{date:'2026-08-20',reason:'payoff 함수 표기를 Nash equilibrium 정의로 오인 가능',change:'모든 unilateral deviation에 대한 no-profitable-deviation 부등식 추가.'},
 'CORE-133-L09':{date:'2026-08-20',reason:'GDP 항등식의 측정범위·수입차감·nominal/real 구분 부족',change:'Y=C+I+G+(X−M)의 회계항등식 성격 명시.'},
 'CORE-133-L10':{date:'2026-08-20',reason:'MV=PY를 재정·통화정책 효과의 causal model처럼 제시',change:'equation of exchange로 한정하고 추가 행동가정 필요 명시.'},
 'CORE-133-L11':{date:'2026-08-20',reason:'comparative advantage 공식이 불완전',change:'두 국가·두 재화의 상대기회비용 부등식으로 교정.'},
 'CORE-133-L12':{date:'2026-08-20',reason:'Metcalfe V≈αN²를 platform value 보편법칙처럼 표기',change:'식을 제거하고 Rochet-Tirole 양면시장 가격구조로 교체.'},
 'CORE-134-L01':{date:'2026-08-20',reason:'법원과 법원위계를 하나의 보편순서로 제시',change:'관할별 formal source·precedent·administrative guidance의 지위 구분.'},
 'CORE-134-L03':{date:'2026-08-20',reason:'Hohfeld 관계가 right/duty, power/liability만 표시',change:'privilege/no-right와 immunity/disability까지 완전화.'},
 'CORE-134-L04':{date:'2026-08-20',reason:'legal personality와 capacity 혼용',change:'법적 인격과 개별 권리능력·행위능력·소송능력을 구분.'},
 'CORE-134-L05':{date:'2026-08-20',reason:'consideration을 계약 일반요건처럼 표시',change:'common law 고유요소로 한정하고 한국/civil law와 분리.'},
 'CORE-134-L06':{date:'2026-08-20',reason:'불법행위 구조를 영미법 혼합공식으로 일반화',change:'한국 민법 제750조와 common-law negligence를 비교법적 별도 구조로 분리.'},
 'CORE-134-L07':{date:'2026-08-20',reason:'한국·독일형 범죄체계와 actus reus/mens rea 혼용',change:'관할별 criminal-law taxonomy를 명시적으로 분리.'},
 'CORE-134-L08':{date:'2026-08-20',reason:'Alexy 비례성 모형을 한국 실정법 자체처럼 사용할 위험',change:'헌법 제37조 제2항·한국 헌재 4요소와 Alexy 이론을 비교 구조로 분리.'},
 'CORE-134-L10':{date:'2026-08-20',reason:'P(E|H)와 법적 증명도를 같은 척도로 보일 위험',change:'확률적 evidential reasoning과 normative burden/standard of proof를 분리.'},
 'CORE-134-L12':{date:'2026-08-20',reason:'Lessig 이론과 현행 AI 법의무 혼재',change:'한국 AI기본법·EU AI Act의 관할·시점·단계별 시행을 별도 표시.'},
 'CORE-135-L01':{date:'2026-08-20',reason:'재현성 문제를 교과서 일반론으로만 처리',change:'OSC 2015 100-study replication과 후속 방법론 논쟁을 연결하고 단일 재현율 일반화를 금지.'},
 'CORE-135-L03':{date:'2026-08-20',reason:'d-prime 표기만 있고 정의·가정 누락',change:'equal-variance Gaussian SDT의 d′=Z(hit)−Z(false alarm) 및 sensitivity/criterion 구분.'},
 'CORE-135-L04':{date:'2026-08-20',reason:'reinforcement/punishment와 positive/negative 용어혼동 위험',change:'행동빈도 효과와 자극의 추가/제거를 직교적으로 구분.'},
 'CORE-135-L07':{date:'2026-08-20',reason:'1979 prospect theory에 1992 cumulative prospect theory power-form 공식 귀속',change:'1979 원이론과 1992 누적전망이론·αβλ parameterization을 분리.'},
 'CORE-135-L08':{date:'2026-08-20',reason:'외적 보상이 내재동기를 항상 약화한다고 읽힐 위험',change:'Deci et al. 1999 meta-analysis의 task·contingency·expectedness 조건 명시.'},
 'CORE-135-L09':{date:'2026-08-20',reason:'Piaget 단계와 Vygotsky 저작상태를 고정된 보편발달법칙처럼 제시',change:'단계 보편성을 경험문제로 두고 Mind in Society의 1978 사후 편집상태 명시.'},
 'CORE-135-L10':{date:'2026-08-20',reason:'Big Five를 개인행동의 결정론적 예측기로 읽을 위험',change:'meta-analytic predictive association과 criterion/context dependence 명시.'},
 'CORE-135-L11':{date:'2026-08-20',reason:'고전 conformity/obedience 효과를 보편 고정비율로 소급할 위험',change:'효과크기·문화·절차·윤리·replication의 조절가능성 명시.'},
 'CORE-135-L12':{date:'2026-08-20',reason:'automation bias와 algorithm aversion을 한 방향의 AI 신뢰현상으로 통합',change:'misuse/disuse, trust calibration, algorithm aversion을 별개 현상·연구로 분리.'}
});
q.version='1.6';q.updated='2026-08-20';
const batch=(q.batches||[]).find(b=>b.id==='QA-01');if(batch)batch.status='ACTIVE · 240/420 SOURCE PASS';
Object.assign(q.notes,{
 'CORE-131':{status:'FIRST_PASS_SOCIOLOGY_THEORY_EVIDENCE_COMPLETE',next:'고전 연구의 표본·자료·현대 재검증 및 플랫폼노동 경험연구 효과크기 2차 점검'},
 'CORE-132':{status:'FIRST_PASS_POLITICAL_THEORY_INSTITUTIONS_COMPLETE',next:'선거제도·양극화·민주주의 후퇴의 비교자료와 현행 AI 거버넌스 법제 업데이트 추적'},
 'CORE-133':{status:'FIRST_PASS_ECON_MODEL_ASSUMPTIONS_COMPLETE',next:'탄력성·소비자선택·시장구조·GDP·무역 수치예제와 경계해 2차 검산'},
 'CORE-134':{status:'FIRST_PASS_LAW_JURISDICTION_TIME_COMPLETE',next:'한국/EU/미국 등 관할별 조문·판례·행정절차·AI 규제의 세부 원자료 2차 검증'},
 'CORE-135':{status:'FIRST_PASS_PSYCH_REPLICATION_EFFECT_COMPLETE',next:'각 실험의 원자료·효과크기·후속 meta-analysis·replication·문화조절효과 2차 검증'}
});
})();