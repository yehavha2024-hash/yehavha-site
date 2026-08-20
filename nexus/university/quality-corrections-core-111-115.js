(()=>{'use strict';
const tb=window.NEXUS_CORE_TEXTBOOK||{};
window.NEXUS_QA_CORRECTIONS=window.NEXUS_QA_CORRECTIONS||{};
function apply(id,texts,refs,patches){const c=tb[id];if(!c)return;c.texts=texts;refs.forEach((r,i)=>{if(c.lessons[i])c.lessons[i][5]=Array.isArray(r)?r:[r]});Object.entries(patches||{}).forEach(([k,p])=>{const l=c.lessons[Number(k)];if(!l)return;if(p.title!==undefined)l[0]=p.title;if(p.body!==undefined)l[1]=p.body;if(p.concepts!==undefined)l[2]=p.concepts;if(p.formula!==undefined)l[3]=p.formula;if(p.caseText!==undefined)l[4]=p.caseText;});}

apply('CORE-111',[
 'Paul R. Halmos, Naive Set Theory, Springer, 1974.',
 'Daniel J. Velleman, How to Prove It: A Structured Approach, 3rd ed., Cambridge University Press, 2019.',
 'Stephen Abbott, Understanding Analysis, 2nd ed., Springer, 2015.',
 'Ronald L. Graham, Donald E. Knuth & Oren Patashnik, Concrete Mathematics, 2nd ed., Addison-Wesley, 1994.',
 'Stephen Boyd & Lieven Vandenberghe, Convex Optimization, Cambridge University Press, 2004.'
],[
 ['Halmos, Naive Set Theory, 1974, “Unions and Intersections,” pp. 12–16; “Complements and Powers,” pp. 17–21; “Relations,” pp. 26–29.'],
 ['Velleman, How to Prove It, 3rd ed., 2019, ch. 1 “Sentential Logic” and ch. 3 “Proofs.”'],
 ['Halmos, Naive Set Theory, 1974, “Functions,” pp. 30–33; Velleman, How to Prove It, 3rd ed., 2019, ch. 5 “Functions.”'],
 ['Velleman, How to Prove It, 3rd ed., 2019, ch. 3 “Proofs.”'],
 ['Velleman, How to Prove It, 3rd ed., 2019, §6.1 “Proof by Mathematical Induction,” pp. 273–280.'],
 ['Abbott, Understanding Analysis, 2nd ed., 2015, ch. 2 “Sequences and Series,” pp. 39–84.'],
 ['Graham, Knuth & Patashnik, Concrete Mathematics, 2nd ed., 1994, ch. 5 “Binomial Coefficients,” especially §5.1.'],
 ['Reinhard Diestel, Graph Theory, 5th ed., Springer, 2017, ch. 1 “The Basics,” pp. 1–34.'],
 ['Joseph A. Gallian, Contemporary Abstract Algebra, group axioms and symmetry chapters; use the edition assigned by the course.'],
 ['Boyd & Vandenberghe, Convex Optimization, 2004, ch. 4 “Convex Optimization Problems,” especially §4.1 standard form.'],
 ['BIPM, The International System of Units (SI), 9th ed., 2019, updated 2026; dimensional homogeneity used as a consistency check.'],
 ['George Pólya, How to Solve It, 2nd ed., Princeton University Press, 1957, Part I “In the Classroom”: Understand the Problem → Devise a Plan → Carry Out the Plan → Look Back.']
],{
 0:{body:'집합연산은 기준 전체집합 U와 부분집합을 명시해야 모호하지 않다. 합집합과 교집합은 원소의 포함조건으로 정의하고, 여집합 Aᶜ는 U에 상대적인 U\\A로 해석한다. 관계는 일반적으로 데카르트곱의 부분집합으로 볼 수 있다.',formula:'A∪B={x:x∈A or x∈B}, A∩B={x:x∈A and x∈B}, Aᶜ=U\\A'},
 1:{body:'고전 명제논리에서 P→Q는 그 대우 ¬Q→¬P와 논리적으로 동치다. 필요조건·충분조건은 방향을 뒤집으면 의미가 달라지므로, 역 Q→P와 이 ¬P→¬Q를 원명제 또는 대우와 혼동하지 않는다.',formula:'P→Q ≡ ¬Q→¬P  (classical propositional logic)'},
 2:{body:'함수 f:A→B는 정의역 A의 각 원소에 공역 B의 정확히 하나의 원소를 대응시킨다. 공역 B와 실제로 도달한 값들의 집합인 상(image) f(A)는 구분해야 하며, “range”라는 말은 문헌에 따라 공역 또는 상을 뜻할 수 있으므로 이 강좌에서는 image를 사용한다.',concepts:['function','domain','codomain','image'],formula:'f:A→B,  f(A)={f(x):x∈A}⊆B'},
 4:{body:'수학적 귀납법은 시작점 n₀에서 P(n₀)을 증명하고, 모든 k≥n₀에 대해 P(k)⇒P(k+1)을 증명하면 모든 n≥n₀에 대해 P(n)을 결론내리는 원리다. 시작점은 반드시 1일 필요가 없다.',formula:'P(n₀) ∧ ∀k≥n₀[P(k)→P(k+1)] ⇒ ∀n≥n₀ P(n)'},
 5:{body:'수열 (aₙ)이 L로 수렴한다는 것은 n이 충분히 커지면 aₙ을 L에 임의로 가깝게 만들 수 있다는 뜻이다. 직관적 “안정값” 표현은 보조 설명일 뿐이며, 엄밀한 정의는 모든 ε>0에 대해 어떤 N이 존재하여 n≥N이면 |aₙ−L|<ε가 되는 것이다.',formula:'aₙ→L ⇔ ∀ε>0 ∃N ∀n≥N: |aₙ−L|<ε'},
 6:{formula:'C(n,r)=n!/[r!(n−r)!],  0≤r≤n'},
 7:{body:'단순 무방향 그래프는 정점집합 V와 서로 다른 두 정점을 잇는 간선들의 집합 E로 표현할 수 있다. 방향·다중간선·자기루프를 허용하는 경우에는 이 정의를 별도로 확장해야 한다.',formula:'G=(V,E),  E⊆{{u,v}:u,v∈V, u≠v}'},
 8:{body:'군(group)은 집합 G와 이항연산 *가 닫힘, 결합법칙, 항등원의 존재, 각 원소의 역원의 존재를 만족하는 대수구조다. “연산 아래 유지되는 성질”만으로는 군의 정의가 되지 않으며, 대칭은 군 작용과 불변량을 통해 분석한다.',concepts:['group','binary operation','identity','inverse','invariant']},
 9:{body:'일반 제약 최적화는 목적함수와 부등식·등식 제약을 명시한다. Boyd와 Vandenberghe의 convex optimization은 목적함수와 부등식 제약함수가 convex이고 등식 제약이 affine인 경우처럼 추가 조건이 있을 때 전역최적성에 강한 결과를 제공한다. 모든 최적화문제가 convex인 것은 아니다.',formula:'minₓ f₀(x)  s.t. fᵢ(x)≤0, hⱼ(x)=0'},
 10:{body:'차원분석은 식의 양변이 같은 물리차원을 가져야 한다는 차원적 동질성을 이용한 일관성 점검이다. 단위 환산과 차원은 구분하며, 속도의 차원은 길이/시간이다.',formula:'[v]=L·T⁻¹'}
});
window.NEXUS_QA_CORRECTIONS['CORE-111']={date:'2026-08-20',status:'MATH_FOUNDATIONS_REVISED',changes:['여집합의 전체집합 의존성 명시','함수의 공역과 image 구분','귀납법 시작점 일반화','수열 극한 ε–N 정의 추가','군 공리 명시','일반 최적화와 convex optimization의 조건 분리','차원식 표기 교정']};

apply('CORE-112',[
 'Lynn Arthur Steen (ed.), Mathematics and Democracy: The Case for Quantitative Literacy, National Council on Education and the Disciplines, 2001.',
 'BIPM, The International System of Units (SI), 9th ed., 2019, updated 2026.',
 'NIST SP 811, Guide for the Use of the International System of Units (SI), 2008.',
 'Edward R. Tufte, The Visual Display of Quantitative Information, 2nd ed., Graphics Press, 2001.',
 'David S. Moore, William I. Notz & Michael A. Fligner, The Basic Practice of Statistics, 8th ed., W. H. Freeman, 2017.'
],[
 ['Steen (ed.), Mathematics and Democracy, 2001, quantitative literacy sections on ratios, percentages, rates and public claims.'],
 ['John Allen Paulos, Innumeracy: Mathematical Illiteracy and Its Consequences, Hill and Wang, 1988; compound-growth calculation is verified algebraically.'],
 ['BIPM, SI Brochure, 9th ed. (2019), updated 2026; NIST SP 811 (2008), Guide for the Use of SI.'],
 ['OpenStax, College Algebra 2e, linear functions section; slope interpreted as change in y per unit change in x.'],
 ['OpenStax, Precalculus 2e, exponential and logarithmic functions sections; logarithm identities require positive arguments and a valid base.'],
 ['Tufte, The Visual Display of Quantitative Information, 2nd ed., 2001, graphical integrity and data-ink discussions.'],
 ['Moore, Notz & Fligner, The Basic Practice of Statistics, 8th ed., descriptive statistics chapters on distributions, mean, median and spread.'],
 ['Lawrence Weinstein & John A. Adam, Guesstimation, Princeton University Press, 2008, order-of-magnitude decomposition examples.'],
 ['Richard A. Brealey, Stewart C. Myers & Franklin Allen, Principles of Corporate Finance, present-value and discounting chapters.'],
 ['Gerd Gigerenzer, Risk Savvy, Viking, 2014; expected-loss formula is a discrete expectation and is not by itself a complete tail-risk criterion.'],
 ['Moore, Notz & Fligner, The Basic Practice of Statistics, standard scores and distributions; distinguish population μ,σ from sample x̄,s.'],
 ['Steen (ed.), Mathematics and Democracy, 2001; Tufte, Visual Display, 2nd ed., 2001.']
],{
 0:{body:'백분율은 분모가 0이 아닌 part/whole 비율에 100을 곱한 표현이다. 절대증가량, 상대증가율, 백분율을 바꾸어 말하면 규모가 왜곡될 수 있으므로 분자·분모와 기준시점을 함께 적는다.',formula:'percentage = 100×(part/whole)%,  whole≠0'},
 1:{body:'매 기간 동일한 비율 r로 복리 성장하고 기간 수가 t일 때 Vₜ=V₀(1+r)ᵗ이다. r이 기간마다 달라지면 단일 r의 거듭제곱을 쓸 수 없고 기간별 성장인자를 곱해야 한다. 퍼센트 변화와 퍼센트포인트 변화도 구별한다.',formula:'constant r: Vₜ=V₀(1+r)ᵗ; varying rates: Vₜ=V₀∏ₖ(1+rₖ)'},
 2:{body:'물리량의 수치와 단위는 함께 해석한다. SI의 현재 권위자료는 BIPM SI Brochure이며, NIST SP 811은 미국의 SI 사용지침이다. 환산식은 동일한 물리량을 다른 단위로 표현하는 것이므로 차원이 보존되어야 한다.',formula:'1 m·s⁻¹ = 3.6 km·h⁻¹'},
 3:{body:'선형모형 y=mx+b에서 m은 x가 1단위 변할 때 y가 m단위 변하는 비율이며 단위는 [y]/[x]다. 절편 b는 x=0이 실제 정의역과 해석범위 안에 있을 때만 실질적 의미를 가진다.',formula:'m=Δy/Δx,  [m]=[y]/[x]'},
 4:{body:'연속시간 지수모형 y(t)=ae^{kt}는 k가 일정하다는 가정 아래 사용한다. 로그 항등식은 로그의 진수가 양수이고 밑 b가 b>0, b≠1일 때 성립한다. 로그축에서 같은 시각적 간격은 같은 절대차가 아니라 같은 비율을 뜻할 수 있다.',formula:'y(t)=ae^{kt};  log_b(xy)=log_b x+log_b y  (x,y>0; b>0,b≠1)'},
 5:{body:'시각적 왜곡은 그래프 종류의 인코딩 방식에 따라 판단한다. 막대그래프처럼 막대 길이 자체가 크기를 표현하는 경우 잘린 기준선은 차이를 과장할 수 있다. 반면 선그래프의 y축이 언제나 0에서 시작해야 하는 것은 아니며, 축 범위와 목적을 명시해 변화패턴을 정직하게 보여야 한다.'},
 6:{title:'평균·중앙값·분포',body:'평균과 중앙값은 서로 다른 중심위치 통계량이며 분포의 비대칭성과 이상치에 대한 민감도가 다르다. 대표값 하나만으로 분포를 설명하지 말고 산포와 분위수도 함께 확인한다.',concepts:['mean','median','distribution','outlier'],formula:'x̄=(1/n)Σᵢxᵢ'},
 7:{body:'Fermi 추정은 복잡한 양을 추정 가능한 여러 요인으로 분해해 자릿수 수준의 범위를 얻는 방법이다. 요인들을 확률론적으로 “독립”이라고 가정할 필요는 없으며, 상관·중복이 있으면 그 영향을 별도로 점검한다.',formula:'Q≈a×b×c  (decomposition; independence is not implied)'},
 8:{body:'현재가치는 미래 현금흐름과 할인율을 명시해 계산한다. 하나의 일정 할인율 r을 쓰는 식은 단순화된 경우이며, 위험을 할인율에 어떻게 반영할지는 자산가격결정과 평가방법에 따라 달라진다.',formula:'PV=Σₜ₌₀ᵀ CFₜ/(1+r)ᵗ  (constant r case)'},
 9:{body:'서로 배타적이고 포괄적인 이산 상태 i에 손실 Lᵢ와 확률 pᵢ가 주어지면 기대손실은 ΣpᵢLᵢ다. 기대값은 평균적 규모를 요약하지만 희귀한 대형손실의 허용가능성, 분산·꼬리위험·파산제약까지 자동으로 반영하지는 않는다.',formula:'E[L]=ΣᵢpᵢLᵢ,  Σᵢpᵢ=1'},
 10:{body:'z-score는 기준 평균과 표준편차로부터 몇 표준편차 떨어져 있는지를 나타낸다. 모집단 기준이면 μ,σ를, 표본 내부 표준화면 보통 x̄,s를 사용한다. z-score가 같다고 해서 서로 다른 지표의 내용적 의미까지 동일해지는 것은 아니다.',formula:'population: z=(x−μ)/σ; sample standardization: zᵢ=(xᵢ−x̄)/s'}
});
window.NEXUS_QA_CORRECTIONS['CORE-112']={date:'2026-08-20',status:'QUANT_REASONING_REVISED',changes:['BIPM 현행 SI Brochure를 기준자료로 추가','성장률 일정/변동 조건 분리','기울기의 단위 명시','로그 항등식 정의역 명시','그래프 기준선 규칙 과잉일반화 수정','Fermi 요인의 독립성 오해 제거','현재가치 식 적용조건 명시','기대손실과 꼬리위험 분리','z-score 모수/표본 표기 분리']};

apply('CORE-113',[
 'Larry Wasserman, All of Statistics: A Concise Course in Statistical Inference, Springer, 2004.',
 'David Freedman, Robert Pisani & Roger Purves, Statistics, 4th ed., W. W. Norton, 2007.',
 'Ronald L. Wasserstein & Nicole A. Lazar, “The ASA Statement on p-Values: Context, Process, and Purpose,” The American Statistician 70(2), 2016, 129–133.',
 'Yoav Benjamini & Yosef Hochberg, “Controlling the False Discovery Rate,” JRSS B 57(1), 1995, 289–300.',
 'Andrew Gelman, Jennifer Hill & Aki Vehtari, Regression and Other Stories, Cambridge University Press, 2020.'
],[
 ['Wasserman, All of Statistics, 2004, “Probability,” pp. 3–17.'],
 ['Wasserman, All of Statistics, 2004, “Probability,” pp. 3–17; conditional probability and independence.'],
 ['Wasserman, All of Statistics, 2004, probability/Bayes sections; Richard McElreath, Statistical Rethinking, 2nd ed., CRC, 2020, Bayesian updating chapters.'],
 ['Wasserman, All of Statistics, 2004, “Random Variables,” pp. 19–46 and “Expectation,” pp. 48–61.'],
 ['Wasserman, All of Statistics, 2004, “Random Variables,” pp. 19–46; distribution models must match the data-generating assumptions.'],
 ['Wasserman, All of Statistics, 2004, “Convergence of Random Variables,” pp. 71–84.'],
 ['Freedman, Pisani & Purves, Statistics, 4th ed., sampling and standard-error chapters; estimated SE distinguishes σ from s.'],
 ['Wasserman, All of Statistics, 2004, “Parametric Inference,” pp. 119–148; confidence-interval coverage interpretation.'],
 ['Wasserstein & Lazar, The American Statistician 70(2), 2016, pp. 129–133, especially Principles 1–6.'],
 ['Jacob Cohen, Statistical Power Analysis for the Behavioral Sciences, 2nd ed., 1988; ASA Statement 2016, Principle 5 on effect size versus significance.'],
 ['Gelman, Hill & Vehtari, Regression and Other Stories, 2020, regression chapters; regression association does not itself identify a causal effect.'],
 ['Benjamini & Hochberg, JRSS B 57(1), 1995, pp. 289–300; Gelman & Loken, “The Garden of Forking Paths,” 2013; preregistration is a workflow control, not a Bayesian inference rule.']
],{
 0:{body:'확률측도 P는 표본공간 Ω의 사건들에 대해 비음성 P(A)≥0, 정규화 P(Ω)=1, 서로 배반인 가산 사건열에 대한 가산가법성을 만족한다. 여사건 공식은 이 공리들에서 따라오는 결과다.',concepts:['sample space','event','Kolmogorov axioms','countable additivity'],formula:'P(A)≥0; P(Ω)=1; disjoint Aᵢ: P(⋃ᵢAᵢ)=ΣᵢP(Aᵢ); hence P(Aᶜ)=1−P(A)'},
 1:{body:'조건부확률 P(A|B)=P(A∩B)/P(B)는 P(B)>0일 때 정의된다. A와 B의 독립성은 P(A∩B)=P(A)P(B)로 표현되며, 이는 일반적으로 P(A|B)=P(A)와 동치다. “조건부”와 “독립”은 서로 반대말이 아니라 별개의 개념이다.',formula:'P(A|B)=P(A∩B)/P(B), P(B)>0;  A⊥B ⇔ P(A∩B)=P(A)P(B)'},
 2:{body:'Bayes 정리는 P(E)>0일 때 사전확률과 우도를 이용해 사후확률을 계산한다. 양성검사 정확도만으로 P(H|E)를 알 수 없으며 기저율 P(H)와 위양성 구조가 함께 필요하다.',formula:'P(H|E)=P(E|H)P(H)/P(E),  P(E)>0'},
 3:{body:'이산 확률변수에서는 E[X]=Σx·p(x)이고 Var(X)=E[(X−μ)²], μ=E[X]다. 연속형에서는 합 대신 확률밀도에 대한 적분을 사용한다. 기댓값이 존재하려면 해당 적분 또는 합이 적절히 수렴해야 한다.',formula:'discrete: E[X]=Σₓx p(x), Var(X)=E[(X−E[X])²]'},
 4:{body:'Binomial(n,p)은 고정된 n번의 Bernoulli 시행이 독립이고 각 시행의 성공확률 p가 같다는 조건에서 성공횟수를 모델링한다. Poisson은 일정한 평균발생률과 독립증분 같은 별도 가정을 가지며, Normal은 연속분포다. 분포이름을 데이터 모양만 보고 선택하지 않는다.',formula:'X~Bin(n,p): P(X=k)=C(n,k)pᵏ(1−p)ⁿ⁻ᵏ, k=0,…,n'},
 5:{body:'대수의 법칙과 중심극한정리는 서로 다른 결과다. 대표적인 iid CLT에서는 X₁,…,Xₙ이 동일분포이고 평균 μ와 유한한 양의 분산 σ²를 가질 때 표준화된 표본평균이 분포수렴으로 N(0,1)에 접근한다. 무거운 꼬리나 의존구조에서는 조건을 다시 확인해야 한다.',formula:'iid, E[X]=μ, 0<Var(X)=σ²<∞: √n( X̄ₙ−μ )/σ ⇒ N(0,1)'},
 6:{body:'iid 표본에서 모집단 표준편차 σ를 알면 표본평균의 표준오차는 σ/√n이고, σ를 모르면 보통 s/√n으로 추정한다. 유한모집단에서 비복원 단순무작위추출을 하면 sampling fraction이 크지 않은지 확인하고 필요하면 finite-population correction을 적용한다.',formula:'SE(X̄)=σ/√n; estimated SE=s/√n; SRSWOR: ×√((N−n)/(N−1))'},
 7:{body:'빈도주의 95% 신뢰구간의 95%는 동일 절차를 반복했을 때 그렇게 만든 구간의 장기적 포함률을 뜻한다. 관측된 하나의 구간에 대해 고정된 모수 μ가 “95% 확률로 들어 있다”고 말하는 것은 일반적인 빈도주의 해석이 아니다. σ를 모르는 정규표본에서는 t 임계값을 사용하는 전형적 구간이 있다.',formula:'normal iid, σ unknown: X̄ ± tₙ₋₁,1−α/2 · s/√n'},
 8:{body:'p값은 귀무가설을 포함한 지정 통계모형이 참이라고 가정했을 때 관측된 통계량과 같거나 그보다 더 귀무가설과 양립하기 어려운 결과가 나올 확률이다. 검정통계량과 단측·양측 정의에 따라 “더 극단적”의 집합이 달라지므로 p=P(T≥Tobs|H₀)는 모든 검정의 보편식이 아니다.',formula:'p = P₍H₀₎{ T(X) is at least as incompatible with H₀ as T(x_obs) }'},
 9:{body:'통계적 유의성과 효과크기는 다른 질문에 답한다. 검정력은 유의수준 α, 실제 효과크기, 표본크기, 분산과 설계에 의존한다. Cohen의 d도 두 집단 평균차를 pooled SD로 표준화한 특정 효과크기일 뿐 모든 연구에 동일하게 적용되는 척도는 아니다.',formula:'two-group pooled-SD effect size: d=(x̄₁−x̄₂)/s_p'},
 10:{body:'단순 선형회귀는 E[Y|X=x]를 β₀+β₁x 같은 함수로 모델링한다. β₁은 모델과 표본설계 아래 조건부 연관을 나타내며, 무작위화·식별가정·적절한 조정 없이 자동으로 개입의 인과효과가 되지 않는다.',formula:'E[Y|X=x]=β₀+β₁x  (association model unless causal identification assumptions are added)'},
 11:{body:'FDR, Bayesian inference, preregistration은 서로 대체되는 하나의 방법이 아니다. FDR은 다중검정 오류율의 한 정의이고, Bayesian inference는 사전분포와 likelihood를 결합하는 추론체계이며, preregistration은 분석선택과 선택적 보고를 줄이기 위한 연구운영 절차다.',formula:'FDR=E[V/(R∨1)], where V=false rejections and R=all rejections'}
});
window.NEXUS_QA_CORRECTIONS['CORE-113']={date:'2026-08-20',status:'PROBABILITY_STATISTICS_REVISED',changes:['확률공리 완전표기','조건부확률의 P(B)>0 조건 추가','Binomial 가정 명시','CLT의 iid·유한분산 조건과 분포수렴 기호 교정','SE에서 σ와 s 구분 및 유한모집단 보정','신뢰구간의 빈도주의 해석 명확화','p값 보편식 과잉단순화 제거','회귀와 인과효과 분리','FDR·Bayesian·preregistration의 역할 분리']};

apply('CORE-114',[
 'Roderick J. A. Little & Donald B. Rubin, Statistical Analysis with Missing Data, 3rd ed., Wiley, 2019.',
 'S. S. Stevens, “On the Theory of Scales of Measurement,” Science 103(2684), 1946, 677–680.',
 'Galit Shmueli, “To Explain or to Predict?,” Statistical Science 25(3), 2010, 289–310.',
 'Roger D. Peng, “Reproducible Research in Computational Science,” Science 334(6060), 2011, 1226–1227.',
 'Juan Perdomo et al., “Performative Prediction,” PMLR 119, 2020, 7599–7609.'
],[
 ['Carl T. Bergstrom & Jevin D. West, Calling Bullshit, Random House, 2020; the equation shown here is explicitly marked as a schematic measurement model, not a universal identity.'],
 ['S. S. Stevens, “On the Theory of Scales of Measurement,” Science 103(2684), 1946, pp. 677–680; treat the classical taxonomy as a starting framework, not an automatic ban on every numerical operation.'],
 ['Miguel A. Hernán, Sonia Hernández-Díaz & James M. Robins, “A Structural Approach to Selection Bias,” Epidemiology 15(5), 2004, 615–625.'],
 ['Little & Rubin, Statistical Analysis with Missing Data, 3rd ed., 2019, ch. 1 pp. 1–28; chs. 3–5; ch. 15 “Missing Not at Random Models,” pp. 351–404.'],
 ['John W. Tukey, Exploratory Data Analysis, Addison-Wesley, 1977; quartiles and IQR are descriptive summaries whose exact sample quantile convention should be reported when material.'],
 ['Edward R. Tufte, The Visual Display of Quantitative Information, 2nd ed., 2001, graphical integrity and design chapters.'],
 ['Judea Pearl, Causality, 2nd ed., Cambridge University Press, 2009, ch. 6 “Simpson’s Paradox, Confounding, and Collapsibility”; Pearl, “Simpson’s Paradox: An Anatomy,” 1999.'],
 ['Galit Shmueli, “To Explain or to Predict?,” Statistical Science 25(3), 2010, 289–310; Hernán & Robins, Causal Inference: What If, 2024 online edition.'],
 ['Perdomo, Zrnic, Mendler-Dünner & Hardt, “Performative Prediction,” PMLR 119, 2020, 7599–7609; Ensign et al., “Runaway Feedback Loops in Predictive Policing,” PMLR 81, 2018, 160–171.'],
 ['Helen Nissenbaum, Privacy in Context, Stanford University Press, 2010; where EU personal-data law applies, Regulation (EU) 2016/679 Art. 5 states principles including purpose limitation and data minimisation.'],
 ['Roger D. Peng, “Reproducible Research in Computational Science,” Science 334(6060), 2011, 1226–1227.'],
 ['Bergstrom & West, Calling Bullshit, 2020; audit sequence is a course synthesis rubric rather than a claimed universal formal standard.']
],{
 0:{body:'데이터는 관찰대상의 완전한 복사본이 아니라 측정도구·표본설계·행정절차·라벨링 규칙을 거친 산출물이다. X_obs=X_target+ε 같은 식은 특정 측정오차 모형을 단순화한 도식일 뿐 모든 데이터 생성과정을 설명하는 보편적 항등식이 아니다.',formula:'schematic only: X_obs = X_target + ε'},
 1:{body:'Stevens의 명목·서열·등간·비율 척도는 측정과 허용변환을 구분하는 고전적 틀이다. 다만 실제 분석에서 어떤 요약통계가 유용한지는 측정과정·분포·연구목적에도 좌우되므로 “서열척도에는 평균을 절대로 계산할 수 없다” 같은 기계적 규칙으로 사용하지 않는다.'},
 2:{body:'선택편향은 분석대상에 포함되는 과정이 노출·결과 또는 그 원인과 구조적으로 연결되어 비교를 왜곡할 때 생길 수 있다. 단순히 표본이 작다는 것과 선택편향은 같은 문제가 아니며, 누가 어떤 메커니즘으로 포함·제외됐는지를 먼저 그린다.'},
 3:{body:'결측기제는 분석모형과 관측정보를 조건으로 MCAR, MAR, MNAR 등의 가정을 구분한다. MAR/MNAR은 데이터 자체만 보고 자동 판정되는 라벨이 아니며, 결측기제에 관한 가정과 민감도분석을 명시해야 한다. complete-case 분석이나 단일대체는 조건에 따라 편향과 불확실성 과소평가를 만들 수 있다.'},
 4:{formula:'IQR = Q₀.₇₅ − Q₀.₂₅  (state the sample-quantile convention when it matters)'},
 6:{body:'Simpson 역설은 집단을 합쳤을 때의 연관 방향이 층별 연관과 달라질 수 있는 현상이다. 어떤 집계 또는 층화가 인과질문에 적절한지는 단순 산술만으로 결정되지 않으며 변수의 인과적 역할과 자료생성과정을 검토해야 한다.'},
 7:{body:'예측은 새로운 관측값의 결과를 잘 맞히는 것을 목표로 할 수 있고, 인과추론은 개입했을 때 결과가 어떻게 달라지는지를 묻는다. 높은 예측정확도나 변수중요도만으로 인과효과가 식별되는 것은 아니다.'},
 8:{body:'모델의 예측이 의사결정을 바꾸고 그 결정이 다시 관측되는 데이터분포를 바꾸면 performative feedback가 생길 수 있다. 예측치안처럼 관측기회가 배치결정에 의해 달라지는 시스템에서는 관측된 체포데이터와 잠재적인 실제 발생률을 동일시하면 자기강화 편향이 생길 수 있다.'},
 10:{body:'재현가능한 계산분석은 원자료 또는 허용 가능한 입력자료, 정제·변환 코드, 소프트웨어·패키지 버전, 분석결정과 실행순서를 기록해 다른 연구자가 결과 생성과정을 점검할 수 있게 한다. 데이터 비공개가 필요한 경우에도 가능한 범위에서 코드·메타데이터·synthetic example을 제공할 수 있다.'}
});
window.NEXUS_QA_CORRECTIONS['CORE-114']={date:'2026-08-20',status:'DATA_LITERACY_REVISED',changes:['Signal+Noise 식을 보편항등식이 아닌 도식으로 제한','Stevens 척도론의 기계적 적용 경계 명시','선택편향을 구조적 포함메커니즘 문제로 교정','MCAR/MAR/MNAR 가정의 성격 명확화','Simpson 역설의 인과적 해석 주의','예측과 인과추론 분리','performative prediction·predictive policing feedback 원 논문 보강','재현가능성 요건 구체화']};

apply('CORE-115',[
 'George E. P. Box, “Science and Statistics,” Journal of the American Statistical Association 71(356), 1976, 791–799.',
 'Donella H. Meadows, Thinking in Systems: A Primer, Chelsea Green, 2008.',
 'John D. Sterman, Business Dynamics, McGraw-Hill, 2000.',
 'Andrea Saltelli et al., Global Sensitivity Analysis: The Primer, Wiley, 2008.',
 'Reuven Y. Rubinstein & Dirk P. Kroese, Simulation and the Monte Carlo Method, 3rd ed., Wiley, 2016.'
],[
 ['George E. P. Box, “Science and Statistics,” JASA 71(356), 1976, pp. 791–799.'],
 ['Donella H. Meadows, Thinking in Systems, 2008, systems lens and system-boundary discussions.'],
 ['John D. Sterman, Business Dynamics, 2000, ch. 6 “Stocks and Flows,” especially §§6.1–6.2, pp. 191–209.'],
 ['Meadows, Thinking in Systems, 2008, feedback-loop chapters; Sterman, Business Dynamics, ch. 5 “Causal Loop Diagrams.”'],
 ['Sterman, Business Dynamics, 2000, ch. 11 “Delays” and ch. 14 on nonlinear relationships; delay and nonlinearity are distinct mechanisms.'],
 ['Albert-László Barabási, Network Science, 2016, ch. 2 “Graph Theory,” §§2.2–2.10 including adjacency matrix, paths, connectedness and clustering.'],
 ['Melanie Mitchell, Complexity: A Guided Tour, Oxford University Press, 2009, emergence and self-organization chapters.'],
 ['Saltelli et al., Global Sensitivity Analysis: The Primer, Wiley, 2008; distinguish local derivative sensitivity from variance-based global Sobol indices.'],
 ['Rubinstein & Kroese, Simulation and the Monte Carlo Method, 3rd ed., 2016, ch. 1 pp. 1–47 and statistical-analysis/variance-control chapters; the sample mean estimates an expectation, not an entire distribution by itself.'],
 ['Trevor Hastie, Robert Tibshirani & Jerome Friedman, The Elements of Statistical Learning, 2nd ed., Springer, 2009, ch. 7 “Model Assessment and Selection”; distinguish generalization validation from probability calibration.'],
 ['Robert J. Lempert, Steven W. Popper & Steven C. Bankes, Shaping the Next One Hundred Years, RAND, 2003, robust decisionmaking under deep uncertainty, especially the discussion around pp. 39–41.'],
 ['Donella H. Meadows, “Leverage Points: Places to Intervene in a System,” Sustainability Institute, 1999, revised list of 12 leverage points.']
],{
 0:{body:'모델은 질문과 목적에 따라 현실을 선택적으로 단순화한다. Box의 논점은 모델의 부정확성 자체를 결함으로만 보는 것이 아니라, 어떤 목적에서 어떤 근사가 유용한지와 모델 부적합을 선택적으로 점검하는 과학적 반복과정을 강조하는 데 있다.'},
 2:{body:'stock S(t)는 시점에 축적된 상태량이고 flow는 단위시간당 변화율이다. 연속시간에서 stock의 변화율은 유입률의 합에서 유출률의 합을 뺀 값이며, stock과 flow의 물리단위도 서로 다르다.',formula:'dS/dt = Σ inflow rates − Σ outflow rates;  [flow]=[stock]/time'},
 5:{body:'네트워크 결과는 노드 특성과 연결구조 모두에 의존한다. 인접행렬 A=[aᵢⱼ]는 특정 노드쌍의 연결을 부호화하지만, directed/undirected, weighted/unweighted에 따라 행렬의 대칭성과 값의 의미가 달라진다.',formula:'A=[aᵢⱼ]; undirected simple graph ⇒ A=Aᵀ, aᵢᵢ=0'},
 7:{body:'∂Y/∂Xᵢ는 한 지점에서의 local derivative sensitivity이며 변수의 단위와 기준점에 의존한다. Saltelli의 global sensitivity analysis는 입력의 전체 분포 범위에서 출력분산의 기여를 평가하며 Sobol first-order index처럼 다른 정의를 사용한다. 두 개념을 같은 식으로 부르지 않는다.',concepts:['local sensitivity','global sensitivity','Sobol index','parameter uncertainty'],formula:'local: ∂Y/∂Xᵢ;  Sobol first-order: Sᵢ=Var(E[Y|Xᵢ])/Var(Y)'},
 8:{body:'Monte Carlo에서 iid 표본 X₁,…,X_N을 목표분포에서 생성할 수 있으면 표본평균은 μ=E[f(X)]의 추정량으로 사용된다. 이것은 결과분포 전체를 직접 나타내는 식이 아니다. 결과분포 자체는 시뮬레이션 값 f(Xᵢ)의 empirical distribution 또는 quantile 등으로 추정한다.',formula:'μ̂_N=(1/N)Σᵢf(Xᵢ) estimates E[f(X)];  F̂_N(y)=(1/N)Σᵢ1{f(Xᵢ)≤y}'},
 9:{title:'학습·검증·일반화·보정',body:'모델이 학습자료에 잘 맞는 것과 새로운 자료에 일반화되는 것은 다르다. train/validation/test 또는 적절한 resampling을 통해 일반화오차를 평가한다. “calibration”은 분야에 따라 모형 파라미터 보정 또는 예측확률의 calibration을 뜻할 수 있으므로 이 강좌에서는 문맥을 명시한다.',concepts:['training error','validation','generalization','overfitting','calibration']},
 10:{body:'Robust Decision Making(RDM)은 하나의 최적 예측미래에 맞추기보다 많은 plausible futures에서 전략의 취약성과 trade-off를 탐색하고 강건한 대안을 찾는다. minₐmaxₛ Loss(a,s)는 강건성의 한 예시인 minimax 규칙이지 RAND의 RDM 전체 절차를 정의하는 공식은 아니다.',formula:'illustrative minimax rule only: minₐ maxₛ Loss(a,s)'},
 11:{body:'Meadows의 leverage points는 단순한 “순위표 처방”이 아니라 복잡계 개입을 더 넓게 사고하기 위한 휴리스틱이다. 파라미터보다 정보흐름·규칙·자기조직화·목표·패러다임 같은 상위구조가 더 강한 지렛점이 될 수 있지만, 실제 효과는 시스템 맥락과 저항을 분석해 검증해야 한다.'}
});
window.NEXUS_QA_CORRECTIONS['CORE-115']={date:'2026-08-20',status:'MODELS_SYSTEMS_REVISED',changes:['stock-flow 식의 단위·다중유입출력 명시','local derivative sensitivity와 Sobol global sensitivity 분리','Monte Carlo 평균추정과 결과분포 추정 분리','validation·generalization과 calibration 용어 분리','minimax 식을 RDM 전체 정의에서 분리','Meadows leverage points의 휴리스틱 성격 명시']};
})();