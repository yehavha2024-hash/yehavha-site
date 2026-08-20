(()=>{'use strict';
const q=window.NEXUS_QA_REGISTER,tb=window.NEXUS_CORE_TEXTBOOK||{};if(!q)return;
q.verified=q.verified||{};q.revised=q.revised||{};q.notes=q.notes||{};
const V=(sources,note)=>({date:'2026-08-20',scope:'물리 법칙·상수·단위·적용조건, 생명과학의 설명수준, 의학의 근거수준·외적타당성, 기후 관측·시나리오·projection 불확실성에 대한 1차 정합성 검수. 모든 수치예제·임상지침·모형 산출값의 최종 전문검산까지 완료했다는 뜻은 아니다.',sources:Array.isArray(sources)?sources:[sources],note});
const courseNotes={
 'CORE-141':'과학철학의 고전명제와 현대 연구실무를 분리하고, Popper·Kuhn·Lakatos의 이론범위, GUM 불확실성, 통계증거와 reproducibility/replicability의 정의를 교정했다.',
 'CORE-142':'고전역학·열역학·유체·회로·상대론·양자·우주론의 공식에 관성계·질량·계 경계·매질·근사·상수 불확실성 등 적용조건을 명시했다.',
 'CORE-143':'Mendel·Hardy-Weinberg·자연선택·집단진화의 설명수준을 분리하고 central dogma, 효소, 확산, logistic growth, PCR의 이상조건을 명시했다.',
 'CORE-144':'생리식과 임상추론을 분리하고 HOMA-IR, renal clearance, likelihood ratio, pharmacokinetics, NNT와 GRADE의 적용조건·외적타당성 한계를 명시했다.',
 'CORE-145':'지구시스템의 관측과 모형을 분리하고 radiative equilibrium, CO₂ forcing 근사, proxy uncertainty, SSP/RCP scenario projection, WHO guideline, LCOE와 climate risk의 범위를 교정했다.'
};
for(const id of ['CORE-141','CORE-142','CORE-143','CORE-144','CORE-145']){const c=tb[id];if(!c)continue;c.lessons.forEach((l,i)=>{const key=`${id}-L${String(i+1).padStart(2,'0')}`;q.verified[key]=V(l[5]||[],`${courseNotes[id]} 현재 Lesson(${l[0]})의 핵심 주장·공식·적용조건과 지정 원자료/대표문헌을 1차 대조했다.`);});}
Object.assign(q.revised,{
 'CORE-141-L03':{date:'2026-08-20',reason:'반증을 Theory→Prediction의 단순 modus tollens로 제시',change:'보조가설·초기조건·측정모형을 포함한 시험구조로 교정.'},
 'CORE-141-L04':{date:'2026-08-20',reason:'anomaly 누적이 paradigm shift를 자동 유발하는 듯한 서술',change:'Kuhn의 crisis·exemplar·공동체 판단을 포함하도록 수정.'},
 'CORE-141-L06':{date:'2026-08-20',reason:'measurement error와 uncertainty 혼용 및 x̄±u 과잉단순화',change:'JCGM 100에 따라 combined/expanded uncertainty와 U=k·u_c(y)를 구분.'},
 'CORE-141-L10':{date:'2026-08-20',reason:'reproducibility와 replicability 용어 혼용 가능성',change:'NASEM 2019의 computational reproducibility/new-data replication 정의로 고정.'},
 'CORE-142-L02':{date:'2026-08-20',reason:'ΣF=ma의 관성계·질량 일정 조건 누락',change:'일반형 dp/dt와 constant-mass 특수형을 분리.'},
 'CORE-142-L03':{date:'2026-08-20',reason:'비탄성 충돌을 에너지손실로 표현해 총에너지 소실 오해',change:'운동에너지→내부에너지 전환과 운동량 보존조건을 분리.'},
 'CORE-142-L04':{date:'2026-08-20',reason:'G를 불확실성 없는 상수처럼 사용',change:'CODATA 2022 G=6.67430(15)×10⁻¹¹ m³ kg⁻¹ s⁻² 반영.'},
 'CORE-142-L05':{date:'2026-08-20',reason:'A₁v₁=A₂v₂를 모든 유체흐름에 적용',change:'steady incompressible 1D 특수조건과 일반 연속방정식 분리.'},
 'CORE-142-L06':{date:'2026-08-20',reason:'ΔS≥0의 계 경계 누락',change:'고립계 전체 엔트로피에 적용하고 reversible equality를 명시.'},
 'CORE-142-L08':{date:'2026-08-20',reason:'V=IR을 모든 회로소자의 보편법칙처럼 제시',change:'ohmic regime 조건을 명시.'},
 'CORE-142-L10':{date:'2026-08-20',reason:'E=mc²를 전체 상대론적 에너지식처럼 제시하고 GPS를 SR만으로 설명',change:'정지에너지/전체 에너지 구분 및 GPS의 GR 보정 추가.'},
 'CORE-142-L11':{date:'2026-08-20',reason:'불확정성 원리를 측정교란만으로 오해할 위험',change:'Robertson 표준편차 관계로 교정.'},
 'CORE-142-L12':{date:'2026-08-20',reason:'Friedmann 식 생략부호와 redshift-distance 단일증거 서술',change:'곡률·Λ를 포함한 식과 다중 우주론 관측자료를 명시.'},
 'CORE-143-L03':{date:'2026-08-20',reason:'ΔG 식의 조건과 효소의 평형효과 불명확',change:'constant T,P 조건과 activation barrier/equilibrium 분리.'},
 'CORE-143-L04':{date:'2026-08-20',reason:'Watson-Crick 구조논문을 DNA 복제 검증자료처럼 사용',change:'Meselson-Stahl 1958 semiconservative replication 증거 분리.'},
 'CORE-143-L05':{date:'2026-08-20',reason:'DNA→RNA→Protein을 보편적 central dogma 정의로 사용',change:'reverse transcription·RNA biology를 인정하고 Crick 원래 명제범위로 수정.'},
 'CORE-143-L06':{date:'2026-08-20',reason:'Mendel Lesson에 Hardy-Weinberg p²를 혼입',change:'Aa×Aa Mendelian segregation으로 교체하고 linkage 조건 명시.'},
 'CORE-143-L07':{date:'2026-08-20',reason:'Hardy-Weinberg 식만 제시하고 equilibrium 가정 생략',change:'random mating 및 세대간 안정에 필요한 추가 가정을 명시.'},
 'CORE-143-L08':{date:'2026-08-20',reason:'진화·선택의 개체/집단 수준 혼동',change:'selection의 differential performance와 population evolution을 분리.'},
 'CORE-143-L10':{date:'2026-08-20',reason:'K를 고정된 자연상수처럼 읽을 위험',change:'logistic model의 단순화와 환경의존적 carrying capacity를 명시.'},
 'CORE-143-L12':{date:'2026-08-20',reason:'PCR copies≈2ⁿ을 실제 증폭의 보편식처럼 사용',change:'100% efficiency 이상모형과 N₀(1+E)ⁿ 효율모형을 분리.'},
 'CORE-144-L02':{date:'2026-08-20',reason:'MAP≈CO×SVR에서 CVP 조건 누락',change:'MAP−CVP≈CO×SVR를 기본형으로 제시.'},
 'CORE-144-L04':{date:'2026-08-20',reason:'clearance 정의를 GFR과 혼동할 위험',change:'C_x=U_xV/P_x 정의와 ideal filtration marker 조건 분리.'},
 'CORE-144-L06':{date:'2026-08-20',reason:'HOMA-IR을 단순 “concept”로 두고 단위·한계 누락',change:'Matthews 1985 기반 공식과 population surrogate 한계 명시.'},
 'CORE-144-L10':{date:'2026-08-20',reason:'post-test odds 식만 제시해 확률↔odds 변환 생략',change:'pretest odds·LR·posttest probability 전체 변환식 추가.'},
 'CORE-144-L11':{date:'2026-08-20',reason:'C(t)=C₀e⁻ᵏᵗ를 모든 약동학에 적용',change:'one-compartment first-order bolus 특수조건으로 한정.'},
 'CORE-144-L12':{date:'2026-08-20',reason:'NNT를 기간·기저위험과 무관한 단일값처럼 제시',change:'ARR·baseline risk·time horizon과 GRADE indirectness를 명시.'},
 'CORE-145-L03':{date:'2026-08-20',reason:'p=ρRT에서 R과 공기조성 조건 누락',change:'dry-air specific gas constant와 Kelvin 조건 명시.'},
 'CORE-145-L05':{date:'2026-08-20',reason:'zero-dimensional radiative balance의 T를 지표온도로 오인 가능',change:'effective emission temperature T_e로 명확화.'},
 'CORE-145-L06':{date:'2026-08-20',reason:'5.35 ln(C/C₀)를 AR6 전체 forcing 식처럼 사용',change:'historical first-order approximation으로 한정.'},
 'CORE-145-L08':{date:'2026-08-20',reason:'SSP/RCP를 미래확률예측처럼 읽을 가능성',change:'scenario-conditioned projection과 internal/model/scenario uncertainty를 분리.'},
 'CORE-145-L10':{date:'2026-08-20',reason:'Risk≈Hazard×Exposure를 일반 환경보건 공식처럼 제시',change:'정성적 도식을 제거하고 dose·susceptibility 포함 평가구조로 교정.'},
 'CORE-145-L11':{date:'2026-08-20',reason:'LCOE를 전력시스템 총비용처럼 사용',change:'plant-level metric과 integration/system cost를 분리.'},
 'CORE-145-L12':{date:'2026-08-20',reason:'Climate risk=factors를 곱셈식으로 고정할 위험',change:'IPCC의 hazard·exposure·vulnerability 상호작용 개념으로 교정.'}
});
q.version='1.6';q.updated='2026-08-20';
const batch=(q.batches||[]).find(b=>b.id==='QA-01');if(batch)batch.status='ACTIVE · 300/420 SOURCE PASS';
Object.assign(q.notes,{
 'CORE-141':{status:'FIRST_PASS_SCIENTIFIC_METHOD_COMPLETE',next:'측정불확실성 전파·실험설계·p값 사례의 실제 수치/설계 2차 검산'},
 'CORE-142':{status:'FIRST_PASS_PHYSICS_DOMAIN_COMPLETE',next:'역학·열역학·상대론·우주론 수치예제의 SI 단위·상수값·근사오차 2차 검산'},
 'CORE-143':{status:'FIRST_PASS_BIOLOGY_LEVELS_COMPLETE',next:'유전확률·Hardy-Weinberg·population model·PCR 효율 예제의 계산 및 최신 분자생물학 근거 2차 검증'},
 'CORE-144':{status:'FIRST_PASS_MEDICAL_EVIDENCE_COMPLETE',next:'진단검사·약동학·NNT 사례의 수치검산과 현행 임상가이드라인의 적용대상·근거확실성 2차 검증'},
 'CORE-145':{status:'FIRST_PASS_CLIMATE_UNCERTAINTY_COMPLETE',next:'IPCC AR6 수치·forcing·scenario 범위, WHO guideline, 에너지비용 가정의 표·그림 단위 2차 검증'}
});
})();