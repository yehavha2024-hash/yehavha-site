(()=>{'use strict';
const q=window.NEXUS_QA_REGISTER,tb=window.NEXUS_CORE_TEXTBOOK||{};if(!q)return;
q.verified=q.verified||{};q.revised=q.revised||{};q.notes=q.notes||{};
const V=(sources,note)=>({date:'2026-08-20',scope:'계산모형·알고리즘 복잡도·자료구조 가정, 네트워크 계층·RFC 프로토콜, ML 학습·일반화 가정, Transformer·생성형 AI 수학구조, Agent 기술능력과 사회적·법적 결론의 구분에 대한 1차 정합성 검수. 모든 구현체·벤치마크·법적 관할·최신 모델의 최종 전문검증까지 완료했다는 뜻은 아니다.',sources:Array.isArray(sources)?sources:[sources],note});
const courseNotes={
 'CORE-151':'정보량·CPU·메모리·운영체제·네트워크·보안·분산시스템의 계산모형과 실제 구현조건을 분리하고 HTTP/3·QUIC 및 CAP의 정확한 범위를 반영했다.',
 'CORE-152':'추상화·반복불변식·재귀·Big-O·테스트·버전관리에서 증명가능한 명제와 실무적 경험칙을 분리하고 복잡도 표기의 전제를 명시했다.',
 'CORE-153':'해시·검색·그래프·트랜잭션·분산저장·REST·SRE의 알고리즘/시스템 가정을 명시하고 플랫폼의 기술기능과 경제적 효과를 구분했다.',
 'CORE-154':'A*·Bayesian network·ML·PCA·backprop·Transformer·LM·RL의 수학적 정의와 가정을 보강하고 Agent의 도구사용 능력과 법적 agency를 분리했다.',
 'CORE-155':'자동화·공정성·privacy·감독·책임·저작권·보안·거버넌스에서 기술지표·경험연구·법규범의 증거수준과 법적 효력을 서로 분리했다.'
};
for(const id of ['CORE-151','CORE-152','CORE-153','CORE-154','CORE-155']){const c=tb[id];if(!c)continue;c.lessons.forEach((l,i)=>{const key=`${id}-L${String(i+1).padStart(2,'0')}`;q.verified[key]=V(l[5]||[],`${courseNotes[id]} 현재 Lesson(${l[0]})의 핵심 주장·수식·계산모형·프로토콜·기술/사회 추론과 지정 원자료를 1차 대조했다.`);});}
Object.assign(q.revised,{
 'CORE-151-L01':{date:'2026-08-20',reason:'self-information과 entropy를 동일 수식처럼 제시할 위험',change:'I(x)와 H(X)를 사건/분포 수준으로 분리.'},
 'CORE-151-L03':{date:'2026-08-20',reason:'fetch-decode-execute를 모든 CPU의 실제 실행순서처럼 단순화',change:'ISA와 microarchitecture, pipeline/out-of-order 구현을 분리.'},
 'CORE-151-L04':{date:'2026-08-20',reason:'AMAT 단일식의 다단 캐시 일반화',change:'one-level expectation model로 적용범위를 제한.'},
 'CORE-151-L06':{date:'2026-08-20',reason:'Coffman 4조건을 deadlock 자체의 충분조건처럼 읽을 위험',change:'고전모형의 필요조건임을 명시.'},
 'CORE-151-L09':{date:'2026-08-20',reason:'현대 웹이 항상 TCP를 거친다는 서술',change:'RFC 9293 TCP와 RFC 9000 QUIC, RFC 9114 HTTP/3을 분리.'},
 'CORE-151-L10':{date:'2026-08-20',reason:'비밀번호 저장을 일반 암호화/해시 문제로 축약',change:'salt와 비용조절 password KDF 중심으로 교정.'},
 'CORE-151-L11':{date:'2026-08-20',reason:'CAP를 상시 “세 개 중 둘 선택” 규칙으로 설명',change:'partition 상황의 consistency/availability 불가능성 정리로 교정.'},
 'CORE-152-L04':{date:'2026-08-20',reason:'loop invariant만으로 total correctness가 증명되는 듯한 서술',change:'initialization·maintenance와 termination을 분리.'},
 'CORE-152-L07':{date:'2026-08-20',reason:'Master theorem을 모든 재귀식에 적용할 위험',change:'binary search/merge sort 재귀식과 적용조건을 별도 제시.'},
 'CORE-152-L08':{date:'2026-08-20',reason:'Big-O를 실제 실행시간과 동일시할 위험',change:'점근적 상한의 정식 정의와 계산모형/평균·최악·분할상환 구분 추가.'},
 'CORE-152-L09':{date:'2026-08-20',reason:'테스트 통과를 프로그램 무결성 증명처럼 읽을 위험',change:'테스트와 정형증명·정적분석의 증거수준을 분리.'},
 'CORE-152-L11':{date:'2026-08-20',reason:'Git 이력만으로 실행재현성이 확보된다고 설명',change:'dependency/runtime/data/configuration 버전의 추가기록 필요 명시.'},
 'CORE-153-L02':{date:'2026-08-20',reason:'hash lookup O(1)을 무조건적 복잡도로 제시',change:'분포·load factor 가정과 worst-case O(n)을 분리.'},
 'CORE-153-L03':{date:'2026-08-20',reason:'binary search의 정렬 사전조건 생략',change:'ordered search space와 preprocessing cost를 명시.'},
 'CORE-153-L04':{date:'2026-08-20',reason:'Dijkstra의 음수간선 제한 및 구현별 복잡도 누락',change:'nonnegative weight 조건과 binary-heap 복잡도 명시.'},
 'CORE-153-L05':{date:'2026-08-20',reason:'ACID만으로 serializable isolation이 보장된다는 오해 가능',change:'isolation level과 serializability를 분리.'},
 'CORE-153-L06':{date:'2026-08-20',reason:'CAP shorthand 과잉일반화',change:'partition 중 operation semantics와 latency/staleness/recovery를 별도 평가.'},
 'CORE-153-L09':{date:'2026-08-20',reason:'REST를 JSON over HTTP와 동일시할 위험',change:'Fielding의 architectural constraints로 교정.'},
 'CORE-153-L11':{date:'2026-08-20',reason:'MTBF/MTTR 식을 서비스 전체 availability의 보편식으로 제시',change:'two-state steady-state 근사와 SLI/SLO 정의를 분리.'},
 'CORE-154-L01':{date:'2026-08-20',reason:'Turing test를 일반지능·의식·법인격 판단으로 확장할 위험',change:'1950 imitation game의 operational 범위로 한정.'},
 'CORE-154-L02':{date:'2026-08-20',reason:'A* admissibility 하나만으로 모든 graph-search 최적성을 설명',change:'consistency 또는 reopen 조건을 포함해 구현형태를 구분.'},
 'CORE-154-L03':{date:'2026-08-20',reason:'semantic entailment와 알고리즘적 derivation 혼동',change:'KB⊨α와 KB⊢α를 분리.'},
 'CORE-154-L04':{date:'2026-08-20',reason:'Bayesian-network edge를 causal edge처럼 읽을 위험',change:'DAG factorization/conditional independence와 causal interpretation을 분리.'},
 'CORE-154-L05':{date:'2026-08-20',reason:'MSE를 지도학습 일반손실처럼 제시',change:'회귀 예시로 한정하고 leakage/distribution shift를 일반화 조건에 포함.'},
 'CORE-154-L06':{date:'2026-08-20',reason:'PCA와 군집결과를 자연범주 발견으로 해석할 위험',change:'centering·scaling·model construct 조건 추가.'},
 'CORE-154-L07':{date:'2026-08-20',reason:'backpropagation과 gradient optimizer 역할 혼합',change:'gradient 계산과 parameter update를 분리.'},
 'CORE-154-L08':{date:'2026-08-20',reason:'Transformer attention 식의 d 표기가 모호하고 attention=설명으로 확대 가능',change:'√d_k로 교정하고 attention weight와 causal explanation을 분리.'},
 'CORE-154-L09':{date:'2026-08-20',reason:'언어모델 유창성과 사실성·grounding 혼동',change:'next-token objective와 factual/source evaluation을 분리.'},
 'CORE-154-L10':{date:'2026-08-20',reason:'reward를 인간가치·법적 의무와 동일시할 위험',change:'MDP optimization target과 normative objective를 분리.'},
 'CORE-154-L11':{date:'2026-08-20',reason:'Agent의 tool use를 법적 agency로 읽을 위험',change:'기술적 action capability와 대리권·권한·책임능력을 명시적으로 분리.'},
 'CORE-154-L12':{date:'2026-08-20',reason:'Risk=Probability×Impact를 보편 AI 위험 공식처럼 사용',change:'NIST AI RMF의 context-specific risk management와 voluntary status를 반영.'},
 'CORE-155-L01':{date:'2026-08-20',reason:'task 자동화에서 순고용 효과를 직접 추론',change:'task substitution/complementation과 employment outcome의 경험검증을 분리.'},
 'CORE-155-L02':{date:'2026-08-20',reason:'HHI 단위와 시장지배력 의미가 불명확',change:'fraction/percentage convention과 screening metric 성격을 명시.'},
 'CORE-155-L03':{date:'2026-08-20',reason:'demographic parity를 공정성 일반정의로 사용',change:'equalized odds·calibration과의 차이 및 불가능성 결과를 반영.'},
 'CORE-155-L04':{date:'2026-08-20',reason:'differential privacy를 privacy compliance 전체로 확대',change:'neighboring datasets에 대한 randomized mechanism 보장으로 정확히 정의.'},
 'CORE-155-L06':{date:'2026-08-20',reason:'human-in-the-loop를 실질적 감독과 동일시',change:'시간·정보·override 권한을 포함한 meaningful oversight 조건 추가.'},
 'CORE-155-L07':{date:'2026-08-20',reason:'로그/감사가 법적 책임을 자동 배분한다는 오해 가능',change:'traceability와 관할법·의무·인과·권한 판단을 분리.'},
 'CORE-155-L08':{date:'2026-08-20',reason:'생성AI 저작권을 단일 글로벌 규칙으로 설명',change:'USCO 2025 인간저작성 분석과 training issue, EU 의무를 관할별로 분리.'},
 'CORE-155-L09':{date:'2026-08-20',reason:'Threat×Vulnerability×Impact를 정확한 보편 방정식처럼 제시',change:'공격면별 threat modeling 도식으로 한정.'},
 'CORE-155-L10':{date:'2026-08-20',reason:'군사·치안 고위험 사용을 동일 법체계로 처리',change:'IHL·헌법·형사절차·행정법 등 관할과 적용규범을 분리.'},
 'CORE-155-L12':{date:'2026-08-20',reason:'NIST·OECD·EU AI Act의 법적 효력을 동일시할 위험',change:'voluntary framework·principles·binding staged law를 구분.'}
});
q.version='1.7';q.updated='2026-08-20';
const batch=(q.batches||[]).find(b=>b.id==='QA-01');if(batch)batch.status='ACTIVE · 360/420 SOURCE PASS';
Object.assign(q.notes,{
 'CORE-151':{status:'FIRST_PASS_COMPUTER_SYSTEMS_COMPLETE',next:'cache/throughput/deadlock/CAP 사례의 실제 계산과 RFC packet-flow·security configuration 2차 검산'},
 'CORE-152':{status:'FIRST_PASS_PROGRAMMING_COMPLEXITY_COMPLETE',next:'loop invariant·recurrence·Big-O별 증명문제와 테스트/정형검증 난이도 2차 검산'},
 'CORE-153':{status:'FIRST_PASS_DATA_PLATFORM_COMPLETE',next:'hash·Dijkstra·transaction isolation·SLO의 수치예제와 platform empirical evidence 2차 검증'},
 'CORE-154':{status:'FIRST_PASS_AI_MATH_COMPLETE',next:'A*·PCA·attention·LM loss·RL return의 실제 수치/shape 검산과 최신 agent evaluation 2차 검증'},
 'CORE-155':{status:'FIRST_PASS_AI_SOCIAL_LEGAL_COMPLETE',next:'현행 법령·저작권·공정성·노동·고위험 사용의 관할별 원자료와 경험효과크기 2차 검증'}
});
})();