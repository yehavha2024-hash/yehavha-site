(()=>{'use strict';
const tb=window.NEXUS_CORE_TEXTBOOK||{};
window.NEXUS_QA_CORRECTIONS=window.NEXUS_QA_CORRECTIONS||{};
function apply(id,texts,refs,patches){const c=tb[id];if(!c)return;c.texts=texts;refs.forEach((r,i)=>{if(c.lessons[i])c.lessons[i][5]=Array.isArray(r)?r:[r]});Object.entries(patches||{}).forEach(([k,p])=>{const l=c.lessons[Number(k)];if(!l)return;if(p.title!==undefined)l[0]=p.title;if(p.body!==undefined)l[1]=p.body;if(p.concepts!==undefined)l[2]=p.concepts;if(p.formula!==undefined)l[3]=p.formula;if(p.caseText!==undefined)l[4]=p.caseText;});}

apply('CORE-151',[
 'Claude E. Shannon, “A Mathematical Theory of Communication,” Bell System Technical Journal 27, 1948, 379–423, 623–656.',
 'David A. Patterson & John L. Hennessy, Computer Organization and Design.',
 'Randal E. Bryant & David R. O’Hallaron, Computer Systems: A Programmer’s Perspective.',
 'Remzi H. Arpaci-Dusseau & Andrea C. Arpaci-Dusseau, Operating Systems: Three Easy Pieces.',
 'E. G. Coffman Jr. et al., “System Deadlocks,” ACM Computing Surveys 3(2), 1971, 67–78.',
 'Abraham Silberschatz, Henry F. Korth & S. Sudarshan, Database System Concepts.',
 'RFC 9293, Transmission Control Protocol, IETF, 2022; RFC 9000, QUIC, 2021; RFC 9114, HTTP/3, 2022.',
 'Ross Anderson, Security Engineering, 3rd ed.; NIST SP 800-63B, Digital Identity Guidelines.',
 'Seth Gilbert & Nancy Lynch, “Brewer’s Conjecture and the Feasibility of Consistent, Available, Partition-Tolerant Web Services,” SIGACT News 33(2), 2002, 51–59.',
 'Martin Kleppmann, Designing Data-Intensive Applications.',
 'Patterson & Hennessy; Bryant & O’Hallaron.',
 'IEA, Energy and AI, 2025; Koomey et al. literature on computing energy efficiency.'
],[
 ['Shannon 1948, Part I. Self-information is I(x)=−log₂p(x); entropy is the expected self-information H(X)=−Σp(x)log₂p(x). Encoding format and information-theoretic entropy are related but not identical concepts.'],
 ['Patterson & Hennessy, chapters on digital logic. Combinational circuits compute outputs from current inputs; sequential circuits include state whose evolution depends on prior state and clock/event behavior.'],
 ['Patterson & Hennessy; Bryant & O’Hallaron. ISA is the programmer-visible instruction interface while microarchitecture is an implementation. “fetch-decode-execute” is an introductory abstraction, not a literal timing model for every pipelined/out-of-order CPU.'],
 ['Bryant & O’Hallaron, memory hierarchy chapters. AMAT=hit time+miss rate×miss penalty is a one-level cache expectation model; multilevel caches, overlap, prefetching and parallel misses require richer models.'],
 ['OSTEP, process/thread/scheduling chapters. A process is a protected execution abstraction; a thread is an execution stream sharing process resources. Scheduling policy and hardware topology affect observed concurrency.'],
 ['Coffman et al. 1971. Mutual exclusion, hold-and-wait, no preemption and circular wait are necessary conditions in the classical reusable-resource deadlock model; their presence does not mean every execution is already deadlocked.'],
 ['OSTEP, file-system chapters. Journaling can make metadata/data recovery more robust after crashes, but durability depends on journaling mode, write ordering, caches, fsync semantics and storage hardware.'],
 ['Database System Concepts, relational model and normalization chapters. Keys and normal forms reduce anomalies but do not by themselves guarantee transaction isolation, business-rule correctness or availability.'],
 ['RFC 9293 specifies TCP; RFC 9000 specifies QUIC; RFC 9114 maps HTTP semantics to QUIC. A modern HTTPS request may use HTTP/3 over QUIC rather than TCP. Throughput≈window/RTT is only an idealized flow-control bound and ignores congestion control, losses and application behavior.'],
 ['Anderson; NIST SP 800-63B. Passwords should not be stored with reversible encryption or unsalted fast hashes; password verifiers use salted, computationally expensive password hashing/KDFs. Generic C=E_K(P) is notation, not a complete security construction.'],
 ['Gilbert & Lynch 2002. CAP is an impossibility result for specified consistency and availability guarantees in an asynchronous model under partition; it is not a rule that every distributed system permanently “chooses two of three.”'],
 ['Kleppmann, distributed systems chapters. Replication and fault tolerance address partial failures, but consistency, latency, durability and recovery objectives must be specified separately.'],
 ['Energy use is an empirical system property requiring workload, hardware utilization, PUE, location, electricity mix and time boundary. A history-of-computing text cannot establish a current data-centre energy effect size.']
],{
 0:{body:'디지털 부호화는 정보를 비트열로 표현하지만 정보이론의 self-information과 entropy는 확률분포에 대한 수학량이다. 특정 사건 x의 정보량과 확률변수 X의 평균 정보량을 구분한다.',formula:'I(x)=−log₂p(x);  H(X)=E[I(X)]=−Σ_x p(x)log₂p(x)'},
 2:{body:'CPU의 fetch–decode–execute는 명령처리를 이해하기 위한 추상화다. ISA는 소프트웨어가 관찰하는 명령·레지스터·메모리 의미를 정의하고, pipeline·superscalar·out-of-order execution 같은 microarchitecture는 동일 ISA를 서로 다르게 구현할 수 있다.'},
 3:{body:'AMAT는 단순 캐시모형에서 평균 접근시간을 계산하는 기대값이다. 여러 cache level, memory-level parallelism, prefetching이 있는 실제 시스템에서는 하나의 hit/miss 식으로 전체 지연을 설명할 수 없다.',formula:'one-level model: AMAT = T_hit + miss_rate·miss_penalty'},
 5:{body:'고전적 deadlock 분석에서 mutual exclusion, hold-and-wait, no preemption, circular wait 네 조건은 deadlock이 발생하기 위해 필요한 조건이다. 네 조건이 가능한 시스템이라고 해서 특정 순간 반드시 deadlock 상태라는 뜻은 아니다.'},
 8:{body:'인터넷 프로토콜은 계층적으로 기능을 분리하지만 실제 웹 연결은 하나의 고정 순서를 항상 따르지 않는다. HTTP/1.1·HTTP/2는 보통 TCP를 사용하지만 HTTP/3는 QUIC 위에서 동작한다. DNS, TLS, connection reuse, cache와 proxy 여부도 경로를 바꾼다.',formula:'idealized flow-control ceiling ≈ advertised_window/RTT; actual throughput also depends on congestion control, loss, path and application'},
 9:{body:'암호화는 기밀성, 해시는 일방향 무결성·식별에 사용될 수 있지만 비밀번호 저장은 일반 암호화나 단순 SHA 해시 문제가 아니다. salt와 비용조절 가능한 password KDF를 사용하고 인증·권한·키관리·위협모형을 별도로 설계한다.'},
 10:{body:'CAP 정리는 네트워크 partition이 발생한 비동기 분산시스템에서 linearizable consistency와 모든 요청에 대한 availability를 동시에 보장할 수 없다는 특정 불가능성 결과다. 평상시의 latency·consistency trade-off나 모든 복제정책을 “CAP에서 두 개 선택”으로 설명하지 않는다.'},
 11:{body:'컴퓨팅의 에너지·노동·프라이버시 영향은 기술의 존재만으로 효과크기가 정해지지 않는다. 데이터센터 전력은 workload·accelerator efficiency·utilization·PUE·전력원에 따라 달라지고, 사회적 편익과 분배효과는 별도 경험자료와 정책기준을 요구한다.'}
});
window.NEXUS_QA_CORRECTIONS['CORE-151']={date:'2026-08-20',status:'COMPUTER_SYSTEMS_MODEL_SCOPE_REVISED',changes:['self-information과 entropy 구분','ISA와 microarchitecture 구분','AMAT 적용범위 명시','Coffman deadlock 조건의 논리적 지위 교정','HTTP/3·QUIC 반영','CAP의 partition 조건 명시','비밀번호 저장을 단순 암호화/해시와 분리']};

apply('CORE-152',[
 'Jeannette M. Wing, “Computational Thinking,” Communications of the ACM 49(3), 2006, 33–35.',
 'Harold Abelson & Gerald Jay Sussman, Structure and Interpretation of Computer Programs.',
 'Allen B. Downey, Think Python.',
 'Thomas H. Cormen et al., Introduction to Algorithms, 4th ed.',
 'Brian W. Kernighan & Rob Pike, The Practice of Programming.',
 'Michael T. Goodrich, Roberto Tamassia & Michael H. Goldwasser, Data Structures and Algorithms.',
 'Cormen et al., recurrence relations and divide-and-conquer chapters.',
 'Cormen et al., asymptotic notation chapters.',
 'Glenford J. Myers et al., The Art of Software Testing; Kernighan & Pike.',
 'Gamma et al., Design Patterns; SICP.',
 'Scott Chacon & Ben Straub, Pro Git.',
 'SICP; Kernighan & Pike.'
],[
 ['Wing 2006. Computational thinking uses abstraction, decomposition and automation ideas, but decomposition is not required to produce fully independent subproblems. Interfaces and dependencies must be modeled explicitly.'],
 ['Programming-language semantics vary: a variable may denote a mutable storage location, a binding or an immutable value name. Type systems constrain representations/operations according to language rules, not a universal hardware law.'],
 ['Control-flow correctness requires mutually consistent conditions, reachable branches and well-defined boundary cases. Boolean simplification does not by itself prove policy fairness or legal validity.'],
 ['Cormen et al. Loop invariants support proofs of initialization, maintenance and postcondition; termination must be established separately for total correctness.'],
 ['SICP. Pure functions are useful because outputs depend only on inputs, but many programs legitimately use state and effects; modular design requires making effects and contracts explicit rather than eliminating all effects.'],
 ['Operation costs depend on implementation: dynamic arrays, linked lists, balanced trees and hash tables have different worst-case, amortized and average complexities.'],
 ['Master theorem applies only to recurrences satisfying its structural conditions. Binary search and merge sort have different recurrence forms.'],
 ['Big-O is an asymptotic upper-bound relation. Runtime claims must specify input representation, computational model, worst/average/amortized case and constants when relevant.'],
 ['Testing can reveal defects and increase confidence but finite tests generally cannot prove absence of all bugs. Boundary, property-based, fuzz and regression tests serve different purposes.'],
 ['Object orientation is one design paradigm. Encapsulation can help reasoning, but inheritance is not inherently superior to composition or functional/data-oriented designs.'],
 ['Git records source-history snapshots, but reproducible execution additionally requires dependency versions, build environment, data/model artifacts and configuration.'],
 ['A program-design project should connect specification to tests and trace failure cases. Passing the authored tests is evidence for those cases, not proof of complete correctness.']
],{
 0:{body:'문제분해는 복잡성을 줄이기 위한 수단이지만 하위문제가 항상 독립적인 것은 아니다. shared state, ordering, resource dependency가 있으면 인터페이스와 의존관계를 함께 모델링해야 한다.'},
 3:{body:'loop invariant는 반복 전·후에 유지되어야 하는 명제로 partial correctness를 증명하는 도구다. 초기화(initialization), 유지(maintenance), 종료 후 결론을 확인하고 별도로 termination을 보여야 total correctness에 접근한다.'},
 6:{body:'재귀식은 알고리즘 구조를 비용식으로 표현한다. Master theorem은 모든 재귀식에 적용되는 공식이 아니며 a≥1, b>1 형태의 분할재귀와 정규성 조건 등을 확인해야 한다.',formula:'binary search: T(n)=T(n/2)+Θ(1)=Θ(log n); merge sort: T(n)=2T(n/2)+Θ(n)=Θ(n log n)'},
 7:{body:'Big-O는 입력크기 n이 충분히 커질 때 함수 성장률의 asymptotic upper bound다. O(n)이라는 표기만으로 실제 실행시간, 평균시간, 최악시간, 메모리비용이 모두 정해지지 않는다.',formula:'f(n)∈O(g(n)) iff ∃c>0,n₀ such that 0≤f(n)≤c·g(n) for all n≥n₀'},
 8:{body:'테스트는 특정 입력·성질·경계에서 구현이 specification과 일치하는지 확인한다. 테스트 통과를 “버그가 없다”는 논리적 증명으로 바꾸지 않으며, 회귀테스트·property test·fuzzing과 정적분석의 역할을 구분한다.'},
 10:{body:'Git commit은 소스변경의 계보를 남기지만 그 자체가 실험·빌드 재현성을 보장하지 않는다. dependency lock, compiler/runtime version, configuration, input data와 외부서비스 버전까지 기록해야 실행환경을 재구성할 수 있다.'}
});
window.NEXUS_QA_CORRECTIONS['CORE-152']={date:'2026-08-20',status:'PROGRAMMING_COMPLEXITY_CORRECTNESS_REVISED',changes:['decomposition의 독립성 가정 제거','loop invariant와 termination 분리','Master theorem 적용조건 명시','Big-O를 실제 실행시간과 구분','testing 통과와 correctness proof 분리','Git 이력과 실행재현성 분리']};

apply('CORE-153',[
 'Martin Kleppmann, Designing Data-Intensive Applications.',
 'Thomas H. Cormen et al., Introduction to Algorithms, 4th ed.',
 'Cormen et al., sorting and searching chapters.',
 'Cormen et al., graph algorithms chapters.',
 'Jim Gray & Andreas Reuter, Transaction Processing; Database System Concepts.',
 'Seth Gilbert & Nancy Lynch, SIGACT News 33(2), 2002, 51–59; Kleppmann.',
 'Francesco Ricci et al. (eds.), Recommender Systems Handbook.',
 'Christopher D. Manning, Prabhakar Raghavan & Hinrich Schütze, Introduction to Information Retrieval.',
 'Roy T. Fielding, Architectural Styles and the Design of Network-based Software Architectures, 2000.',
 'Kleppmann; machine-learning data management literature on lineage and train-serving skew.',
 'Betsy Beyer et al. (eds.), Site Reliability Engineering.',
 'Jean-Charles Rochet & Jean Tirole, “Platform Competition in Two-Sided Markets,” JEEA 1(4), 2003, 990–1029.'
],[
 ['Relational/document/graph are data models with different consistency, query and evolution trade-offs; “NoSQL” does not imply schemaless or consistency-free.'],
 ['Hash-table expected O(1) lookup assumes a suitable hash distribution, bounded load factor and resizing strategy; worst-case lookup can be O(n).'],
 ['Binary search requires an ordered search space and random/direct access or equivalent indexing. Comparison count is logarithmic; sorting/preprocessing cost must not be ignored.'],
 ['Dijkstra’s algorithm requires nonnegative edge weights. O((V+E)logV) is a common binary-heap implementation bound, not one implementation-independent complexity.'],
 ['ACID names transaction properties, but actual isolation depends on the isolation level; serializability is stronger than common snapshot/read-committed modes.'],
 ['CAP applies during network partitions to specific consistency/availability guarantees. Replication strategy also involves latency, staleness, durability and failure detection outside the CAP shorthand.'],
 ['Matrix factorization score p_u·q_i is one recommender model. Observed clicks are exposure-dependent data, so offline relevance estimates can inherit presentation/popularity feedback.'],
 ['TF-IDF has multiple weighting conventions; BM25 and PageRank are distinct ranking signals. No one scalar is a universal relevance truth.'],
 ['Fielding’s REST is an architectural style with constraints including statelessness, cacheability and uniform interface; “JSON over HTTP” alone is not sufficient to call a system RESTful.'],
 ['Data lineage records origin/transformation, but reliable ML pipelines additionally need schema/quality checks, versioning, leakage controls and train-serving consistency.'],
 ['Availability=MTBF/(MTBF+MTTR) is a steady-state two-state repairable-system approximation. SLO availability for a service depends on measurement window, request weighting, dependencies and correlated failures.'],
 ['Platform network effects and governance rules are economic/institutional mechanisms whose magnitude is empirical. Market concentration, lock-in and welfare effects are not implied solely by having an API.']
],{
 1:{body:'해시테이블의 평균·기대 O(1) 조회는 hash function, load factor, collision handling과 resizing 가정에 의존한다. 적대적 또는 심하게 충돌하는 키에서는 한 bucket/chain에 값이 몰려 최악 O(n)이 될 수 있다.',formula:'expected lookup ≈ O(1) under controlled load/distribution; worst case O(n)'},
 2:{body:'이진탐색은 정렬된 배열·단조 조건 같은 ordered search space가 필요하다. 100만 개 항목에서 비교횟수는 대략 log₂n 규모지만, 데이터 정렬·인덱스 구축비용과 저장장치 접근비용은 별도다.',formula:'comparisons = O(log n) after ordering/index precondition is satisfied'},
 3:{body:'Dijkstra는 모든 간선 가중치가 음수가 아닐 때 단일출발점 최단경로를 계산한다. complexity는 priority queue 구현에 따라 달라진다.',formula:'binary heap: O((V+E)log V); nonnegative edge weights required'},
 4:{body:'ACID는 atomicity, consistency, isolation, durability를 말하지만 “I”의 실제 강도는 구현·isolation level에 따라 달라진다. read committed나 snapshot isolation을 serializable execution과 동일시하지 않는다.'},
 5:{body:'분산저장에서 CAP는 partition 상황의 불가능성 정리다. consistency/availability를 시스템의 영구적인 단일 선택으로 표현하지 않고, operation별 semantics, stale read, quorum, latency와 recovery 전략을 구체적으로 적는다.'},
 7:{body:'TF-IDF, BM25, PageRank는 목적과 입력신호가 다르다. TF-IDF는 term/document frequency를, BM25는 길이 정규화와 saturation을, PageRank는 링크그래프를 이용한다. 이를 하나의 “검색 정확도 공식”으로 합치지 않는다.'},
 8:{body:'REST는 특정 URL 문법이나 JSON 포맷이 아니라 client-server, stateless, cache, uniform interface, layered system 등의 제약으로 정의되는 architectural style이다. API 계약에는 auth, versioning, idempotency, errors와 schema가 별도로 필요하다.'},
 10:{body:'MTBF/MTTR 식은 repairable two-state system의 steady-state 근사다. 실제 SRE는 user-visible SLI와 SLO, error budget, dependency failure, correlated outage를 함께 본다.',formula:'simple steady-state model: A=MTBF/(MTBF+MTTR); service SLO requires an explicitly defined SLI/window'}
});
window.NEXUS_QA_CORRECTIONS['CORE-153']={date:'2026-08-20',status:'DATA_ALGORITHM_PLATFORM_ASSUMPTIONS_REVISED',changes:['hash O(1) 가정과 worst case 분리','binary search 사전조건 명시','Dijkstra 비음수 가중치 조건 추가','ACID와 isolation level 분리','CAP 단순 trade-off 표현 교정','REST를 JSON/HTTP와 구분','availability 식의 two-state 가정 명시']};

apply('CORE-154',[
 'Alan M. Turing, “Computing Machinery and Intelligence,” Mind 59(236), 1950, 433–460.',
 'Stuart Russell & Peter Norvig, Artificial Intelligence: A Modern Approach, 4th ed.',
 'Russell & Norvig, logic and knowledge representation chapters.',
 'Judea Pearl, Probabilistic Reasoning in Intelligent Systems, 1988.',
 'Christopher M. Bishop, Pattern Recognition and Machine Learning; Hastie, Tibshirani & Friedman, The Elements of Statistical Learning.',
 'Hastie, Tibshirani & Friedman; Ian Goodfellow et al., Deep Learning.',
 'Ian Goodfellow, Yoshua Bengio & Aaron Courville, Deep Learning, 2016.',
 'Ashish Vaswani et al., “Attention Is All You Need,” NeurIPS 2017.',
 'Rishi Bommasani et al., “On the Opportunities and Risks of Foundation Models,” 2021; Jurafsky & Martin, Speech and Language Processing.',
 'Richard S. Sutton & Andrew G. Barto, Reinforcement Learning: An Introduction, 2nd ed.',
 'Shunyu Yao et al., “ReAct: Synergizing Reasoning and Acting in Language Models,” ICLR 2023; Russell & Norvig.',
 'NIST AI 100-1, AI Risk Management Framework 1.0, 2023; NIST AI 600-1, Generative AI Profile, 2024; Amodei et al., “Concrete Problems in AI Safety,” 2016.'
],[
 ['Turing 1950 proposed the imitation game as an operational question about machine intelligence; passing it is not a proof of consciousness, general intelligence or legal personhood.'],
 ['A*: f(n)=g(n)+h(n). Optimality depends on search variant and heuristic assumptions; graph search commonly requires consistency or node reopening, while admissibility alone supports standard tree-search results.'],
 ['Semantic entailment KB⊨α means every model satisfying KB satisfies α; it is distinct from a particular proof algorithm deriving KB⊢α.'],
 ['A Bayesian network factorizes a joint distribution according to a DAG and its local Markov/conditional-independence structure: P(x₁,…,xₙ)=∏P(xᵢ|paᵢ).'],
 ['MSE is one regression loss, not the definition of supervised learning. Generalization estimates depend on sampling, leakage control and how deployment distribution relates to training/evaluation data.'],
 ['PCA requires centering (and sometimes scaling by analysis choice); the first component maximizes projected sample variance subject to a unit-vector constraint. Clusters/components are model constructs, not automatically natural social categories.'],
 ['Backpropagation efficiently computes derivatives through a computational graph; gradient descent/SGD uses those derivatives to update parameters. Optimization success does not by itself imply out-of-distribution generalization.'],
 ['Vaswani et al. 2017 uses scaled dot-product attention softmax(QKᵀ/√d_k)V and multi-head attention. Attention weights are internal model quantities and should not automatically be treated as causal explanations of model decisions.'],
 ['Autoregressive language-model cross-entropy estimates next-token distributions. High likelihood/fluent output does not guarantee factual correctness, grounding or source attribution; RAG can reduce some errors but does not logically guarantee truth.'],
 ['Discounted return assumes an MDP-style formalization; γ controls weighting of future rewards. A reward function encodes an optimization target, not a complete statement of human values or legal duties.'],
 ['ReAct is one architecture/prompting paradigm interleaving reasoning traces and environment actions. Tool use, memory and planning are technical capabilities; they do not by themselves create legal agency, authority, consent or responsibility.'],
 ['NIST AI RMF 1.0 is a voluntary risk-management framework organized around Govern, Map, Measure, Manage; NIST states it is being revised in 2026. NIST AI 600-1 is a GenAI profile. Risk is multidimensional; Probability×Impact is at most a heuristic matrix, not a universal AI-risk equation.']
],{
 0:{body:'AI는 탐색·추론·학습·지각·언어·행동 등 서로 다른 기능을 형식화해 연구한다. Turing의 imitation game은 인간과 기계의 대화행동을 비교하는 operational test 제안이며 consciousness·도덕적 지위·법인격을 판정하는 검사가 아니다.'},
 1:{body:'A*는 누적비용 g와 heuristic h를 결합한다. “admissible이면 언제나 최적”이라는 문장은 구현형태를 생략한다. tree search와 graph search, inconsistent heuristic에서 reopen 여부를 구분한다.',formula:'f(n)=g(n)+h(n); admissible: h(n)≤h*(n); graph-search optimality commonly uses consistency h(n)≤c(n,n′)+h(n′) or reopening'},
 2:{body:'논리적 entailment는 의미론적 관계이고 proof procedure는 계산절차다. soundness·completeness가 확보된 체계에서는 둘을 연결할 수 있지만 KB⊨α와 프로그램이 실제로 α를 찾아냈다는 사실은 동일한 문장이 아니다.',formula:'semantic: KB ⊨ α; syntactic derivability: KB ⊢ α'},
 3:{body:'Bayesian network는 DAG의 parent 관계에 따라 joint distribution을 factorize한다. factorization은 선택된 그래프가 나타내는 conditional-independence 가정과 변수정의에 의존하며, edge가 있다고 곧바로 causal relation을 뜻하지는 않는다.',formula:'P(x₁,…,xₙ)=∏ᵢP(xᵢ|Pa(Xᵢ))'},
 4:{body:'지도학습은 입력·target 자료와 loss를 이용해 예측함수를 추정하는 넓은 범주다. MSE는 연속형 회귀의 대표적 손실일 뿐 classification이나 ranking의 일반식이 아니다. train/validation/test 분리도 leakage와 distribution shift가 없다는 보장을 자동 제공하지 않는다.',formula:'regression example: MSE=(1/n)Σᵢ(yᵢ−ŷᵢ)²; loss must match task/model'},
 5:{body:'PCA는 보통 데이터를 중심화한 뒤 unit direction으로 투영된 분산을 최대화한다. cluster나 low-dimensional axis는 데이터·거리·스케일·모형 선택의 결과이며 현실의 사회범주가 “발견됐다”고 자동 해석하지 않는다.',formula:'centered X; first PC: max_{||w||=1} wᵀS w'},
 6:{body:'backpropagation은 chain rule을 이용해 loss의 parameter gradient를 계산하는 방법이고, gradient descent/SGD가 그 gradient를 이용해 parameter를 업데이트한다. training loss 감소와 deployment generalization은 별도 검증문제다.',formula:'gradient step: w←w−η∇_wL; backprop computes ∇_wL'},
 7:{body:'Transformer의 scaled dot-product attention은 query와 key의 내적을 √d_k로 scaling한 뒤 softmax weight로 value를 결합한다. multi-head 구조와 position information까지 함께 봐야 한다. attention weight를 인간이 이해하는 causal explanation과 동일시하지 않는다.',formula:'Attention(Q,K,V)=softmax(QKᵀ/√d_k)V'},
 8:{body:'autoregressive language model은 앞선 token 조건에서 다음 token 분포의 log-likelihood를 학습한다. 유창성은 학습목표에서 직접 최적화되지만 사실성·출처·논리적 타당성은 별도 평가가 필요하다. retrieval을 붙여도 retrieval error·conflicting source·generation error가 남을 수 있다.',formula:'L=−Σ_t log P_θ(x_t|x_<t)'},
 9:{body:'강화학습은 상태·행동·전이·보상으로 문제를 모델링하고 expected return을 최적화한다. reward는 설계자가 정한 proxy일 수 있어 reward hacking과 specification failure를 별도로 평가해야 한다.',formula:'G_t=Σ_{k=0}^∞γ^kR_{t+k+1}, typically 0≤γ<1 for continuing discounted tasks'},
 10:{body:'Agentic AI는 목표를 여러 단계 작업으로 분해하고 외부도구·메모리·환경피드백을 이용할 수 있지만, 이것은 기술적 action capability의 설명이다. 이메일·결제·계약 API를 실행할 수 있다는 사실만으로 민법상 대리권, 회사 내부 권한, 책임능력 또는 독립 법적 인격이 발생하지 않는다.'},
 11:{body:'AI 안전평가는 accuracy 하나가 아니라 robustness, security, misuse, human factors, distribution shift와 context-specific harm을 함께 본다. NIST AI RMF는 voluntary framework이며 2026년 현재 개정 작업 중이다. 위험평가에 Probability×Impact matrix를 사용할 수 있지만 이를 정확한 보편수식으로 취급하지 않는다.',formula:'risk assessment = context-specific characterization of likelihood/uncertainty, severity, exposure, affected parties and controls; no universal Risk=P×I identity'}
});
window.NEXUS_QA_CORRECTIONS['CORE-154']={date:'2026-08-20',status:'AI_MATH_CAPABILITY_SCOPE_REVISED',changes:['Turing test를 의식·법인격 판정과 분리','A* 최적성 조건 보강','entailment와 proof procedure 구분','Bayesian network와 causality 구분','MSE의 적용과 generalization 가정 명시','PCA 중심화·제약조건 명시','backprop과 optimizer 역할 분리','Transformer √d_k 표기 교정','fluency와 factuality 분리','Agent 기술능력과 법적 대리권 분리','NIST AI RMF voluntary/revision 상태 반영']};

apply('CORE-155',[
 'David H. Autor, “Why Are There Still So Many Jobs?,” Journal of Economic Perspectives 29(3), 2015, 3–30.',
 'Daron Acemoglu & Pascual Restrepo, work on automation and new tasks; U.S. DOJ/FTC Merger Guidelines for HHI interpretation.',
 'Moritz Hardt, Eric Price & Nathan Srebro, “Equality of Opportunity in Supervised Learning,” NeurIPS 2016; Kleinberg, Mullainathan & Raghavan, 2016; Alexandra Chouldechova, Big Data 5(2), 2017, 153–163.',
 'Cynthia Dwork et al., “Calibrating Noise to Sensitivity in Private Data Analysis,” TCC 2006; NIST differential privacy guidance.',
 'Claire Wardle & Hossein Derakhshan, Information Disorder, Council of Europe, 2017; contemporary empirical misinformation literature.',
 'Raja Parasuraman & Victor Riley, “Humans and Automation,” Human Factors 39(2), 1997, 230–253; Dietvorst et al., algorithm aversion; Lee & See, trust in automation.',
 'NIST AI RMF 1.0; Regulation (EU) 2024/1689; applicable national law by jurisdiction.',
 'U.S. Copyright Office, Copyright and Artificial Intelligence Part 2: Copyrightability, 2025; Part 3: Generative AI Training, pre-publication 2025; Regulation (EU) 2024/1689 Art. 53 copyright-policy obligations.',
 'NIST AI 600-1, Generative AI Profile, 2024; NIST cybersecurity guidance.',
 'ICRC positions and CCW discussions on autonomous weapon systems; jurisdiction-specific policing and fundamental-rights law.',
 'Virginia Eubanks, Automating Inequality, 2018; sector-specific education/health/public-service evidence.',
 'NIST AI RMF 1.0, 2023; OECD AI Principles, adopted 2019 and updated 2024; Regulation (EU) 2024/1689.'
],[
 ['Autor 2015 uses a task-based framework: technology may substitute for some tasks and complement/create others. Net employment and wage effects are empirical and vary across occupations, sectors and time.'],
 ['HHI=Σs_i² only becomes numerically interpretable after declaring whether shares are fractions or percentage points; concentration is a screening metric, not a direct causal measure of market power or AI productivity.'],
 ['Fairness criteria are distinct. Demographic parity, equalized odds and calibration can conflict, especially when base rates differ; one fairness equation cannot establish legal nondiscrimination.'],
 ['ε-differential privacy is a property of a randomized mechanism over neighboring datasets, not a synonym for de-identification, consent or compliance with privacy law.'],
 ['Generative capability lowers production costs for synthetic content, but claims about persuasion, voting behavior or polarization require separate empirical causal evidence and platform/context specification.'],
 ['Automation bias, algorithm aversion and calibrated reliance are distinct phenomena. Human-in-the-loop is an organizational design choice and does not guarantee meaningful oversight if the human lacks time, information or authority.'],
 ['Technical traceability supports accountability but legal responsibility depends on jurisdiction, duty, authority, causation and applicable statutory/contractual rules. NIST AI RMF is voluntary and cannot be cited as a liability statute.'],
 ['Copyright questions are jurisdiction-specific and partly unsettled. U.S. Copyright Office Part 2 states protection depends on sufficient human-authored expressive contribution and mere prompting alone is insufficient under its analysis; training issues are addressed separately in Part 3. EU AI Act Art. 53 adds provider obligations but does not replace substantive copyright law.'],
 ['Prompt injection, data poisoning and model extraction are different threat classes. Risk=Threat×Vulnerability×Impact is a qualitative mnemonic, not a universal cybersecurity equation.'],
 ['Military and policing decisions involve distinct international, constitutional, criminal-procedure and administrative-law regimes. Technical error rate alone does not decide legality or proportionality.'],
 ['Evidence of benefit/harm in education, medicine and public benefits is context-specific. A model’s benchmark accuracy cannot substitute for workflow evaluation, appeal rights, clinical/educational validity or distributional analysis.'],
 ['NIST AI RMF is voluntary; OECD AI Principles were updated in 2024; the EU AI Act is binding EU law with staged obligations. “AI governance” is therefore a layered mix of law, standards, organizational controls and public participation rather than one universal regime.']
],{
 0:{body:'AI의 노동효과는 “직업이 사라진다/생긴다”의 이분법보다 task 수준에서 분석한다. 어떤 task는 자동화되고 다른 task는 보완되며 새로운 task가 생길 수 있다. 생산성 증가가 고용·임금 증가로 동일하게 전이된다는 인과관계는 별도 경험검증이 필요하다.'},
 1:{body:'시장집중은 compute·capital·data·distribution·switching cost 등 여러 메커니즘의 결과다. HHI는 concentration 지표이지 시장지배력이나 경쟁제한 효과를 자동 입증하는 법적 결론이 아니다.',formula:'if market shares are fractions: HHI=Σ_i s_i² ∈[0,1]; if percentage shares: HHI=Σ_i s_i² ∈[0,10000]'},
 2:{body:'공정성은 하나의 수치가 아니다. demographic parity는 selection rate, equalized odds는 outcome 조건부 오류율, calibration은 score의 확률적 의미를 본다. base rate가 다른 경우 여러 기준을 동시에 만족하기 어려운 불가능성 결과가 있으므로 기술적 metric 선택과 법적 차별판단을 분리한다.',formula:'demographic parity example: P(Ŷ=1|A=a)=P(Ŷ=1|A=b); this is not equivalent to equalized odds or calibration'},
 3:{body:'differential privacy는 인접 데이터셋에서 randomized mechanism의 출력분포가 크게 달라지지 않도록 제한하는 수학적 privacy guarantee다. ε 값, adjacency 정의, composition과 utility trade-off를 명시해야 하며 DP를 consent·purpose limitation·법적 compliance 전체와 동일시하지 않는다.',formula:'ε-DP: for neighboring D,D′ and measurable S, P[M(D)∈S]≤e^ε·P[M(D′)∈S]'},
 4:{body:'생성AI는 대량 합성콘텐츠 생산비용을 낮출 수 있지만 deepfake가 존재한다는 사실과 실제 유권자 행동·정치적 양극화의 인과효과는 다른 명제다. 노출, 신뢰, 반복, 플랫폼 추천, counter-speech와 사전태도가 효과를 수정하므로 경험연구의 설계를 확인한다.'},
 5:{body:'human-in-the-loop라는 조직도만으로 인간감독이 실질적이라고 판단하지 않는다. 인간이 AI 결과를 이해할 정보, 재검토할 시간, override 권한과 책임을 가져야 meaningful oversight가 가능하다. automation bias와 algorithm aversion은 반대방향의 실패모드로 별도 측정한다.'},
 6:{body:'로그·model card·audit trail은 사실관계를 추적하는 기술적 기반이지만 법적 책임을 자동 배분하지 않는다. 책임은 관할법, 역할별 의무, 권한·통제, 인과관계, 예견가능성, 계약·법령의 위험배분을 따로 검토해야 한다. NIST AI RMF는 자발적 위험관리 프레임워크이지 책임법 규정이 아니다.'},
 7:{body:'생성AI와 저작권은 “AI 사용=보호 불가” 또는 “prompt=저작자” 같은 단일 규칙으로 처리하지 않는다. 미국 Copyright Office의 2025 Part 2는 인간이 충분한 표현요소를 결정했는지를 중심으로 보고 mere prompting alone은 충분하지 않다고 설명한다. 학습데이터 문제는 별도 침해·예외·라이선스 쟁점이며 국가별 법제가 다르다.'},
 8:{body:'AI 보안은 prompt injection, data poisoning, model extraction, credential abuse, malicious tool call 등 공격면별 threat model이 필요하다. Threat×Vulnerability×Impact는 교육용 분해도식일 뿐 확률·의존관계·control effectiveness가 포함된 보편수학식이 아니다.'},
 9:{body:'자율무기·예측치안·얼굴인식은 모두 고위험일 수 있지만 동일한 법체계를 적용하지 않는다. 무력충돌법, 국내 헌법·형사절차·행정법, 개인정보·차별법의 관할과 기준을 분리하고 기술적 false-positive rate를 법적 비례성 판단 자체와 동일시하지 않는다.'},
 10:{body:'교육·의료·복지 AI의 benchmark performance는 실제 서비스의 임상·교육·행정적 순편익을 자동 보장하지 않는다. workflow integration, distribution shift, human override, 오류정정·이의제기, 취약집단 영향과 현장 outcome을 별도로 평가한다.'},
 11:{body:'AI 거버넌스는 법률, 행정규제, 표준, voluntary framework, 내부통제와 시민참여가 층위별로 결합한다. 2026년 현재 NIST AI RMF 1.0은 voluntary이며 개정 중이고, OECD AI Principles는 2024년에 업데이트됐으며, EU AI Act는 단계적으로 적용되는 법적 규범이다. 서로의 법적 효력을 혼동하지 않는다.'}
});
window.NEXUS_QA_CORRECTIONS['CORE-155']={date:'2026-08-20',status:'AI_SOCIAL_LEGAL_INFERENCE_REVISED',changes:['task automation과 net employment 효과 분리','HHI 단위·법적 의미 보강','fairness metric 불가능성/법적 차별판단 분리','differential privacy 정확한 정의 추가','생성콘텐츠 능력과 사회적 인과효과 분리','human-in-loop와 meaningful oversight 구분','기술적 traceability와 법적 책임 분리','2025 USCO AI copyright 보고서 반영','보안 위험도식의 비수학적 성격 명시','고위험 사용의 관할법 분리','NIST/OECD/EU 규범의 법적 효력 구분']};
})();