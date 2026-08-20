(()=>{'use strict';
const tb=window.NEXUS_CORE_TEXTBOOK||{};
window.NEXUS_QA_CORRECTIONS=window.NEXUS_QA_CORRECTIONS||{};
function apply(id,texts,refs,patches){const c=tb[id];if(!c)return;c.texts=texts;refs.forEach((r,i)=>{if(c.lessons[i])c.lessons[i][5]=Array.isArray(r)?r:[r]});Object.entries(patches||{}).forEach(([k,p])=>{const l=c.lessons[Number(k)];if(!l)return;if(p.title!==undefined)l[0]=p.title;if(p.body!==undefined)l[1]=p.body;if(p.concepts!==undefined)l[2]=p.concepts;if(p.formula!==undefined)l[3]=p.formula;if(p.caseText!==undefined)l[4]=p.caseText;});}

apply('CORE-141',[
 'Norwood Russell Hanson, Patterns of Discovery, Cambridge University Press, 1958.',
 'Francis Bacon, Novum Organum, 1620; David Hume, An Enquiry Concerning Human Understanding, 1748.',
 'Karl Popper, The Logic of Scientific Discovery, English ed., Hutchinson, 1959.',
 'Thomas S. Kuhn, The Structure of Scientific Revolutions, 2nd ed., University of Chicago Press, 1970.',
 'Imre Lakatos, The Methodology of Scientific Research Programmes, Cambridge University Press, 1978.',
 'JCGM 100:2008, Evaluation of measurement data — Guide to the expression of uncertainty in measurement; Amendment 1:2026.',
 'R. A. Fisher, The Design of Experiments, 1935; Douglas C. Montgomery, Design and Analysis of Experiments.',
 'Ronald N. Giere, Scientific Perspectivism, University of Chicago Press, 2006.',
 'Ronald L. Wasserstein & Nicole A. Lazar, “The ASA Statement on p-Values,” The American Statistician 70(2), 2016, 129–133.',
 'National Academies of Sciences, Engineering, and Medicine, Reproducibility and Replicability in Science, National Academies Press, 2019.',
 'Robert K. Merton, The Sociology of Science, University of Chicago Press, 1973.',
 'Heather E. Douglas, Science, Policy, and the Value-Free Ideal, University of Pittsburgh Press, 2009.'
],[
 ['Hanson, Patterns of Discovery, Part I. Theory-ladenness does not imply that observation is arbitrary; calibration, operational definitions, intersubjective procedures and converging instruments can constrain claims.'],
 ['Bacon, Novum Organum, Book I; Hume, Enquiry, Section IV. Baconian induction and Hume’s logical problem of induction are historically distinct positions and should not be merged into one “inductive method.”'],
 ['Popper, Logic of Scientific Discovery, §§6–8 and §§20–22. Empirical testing concerns systems of theory plus auxiliary assumptions; a failed prediction does not logically identify which component is false.'],
 ['Kuhn, Structure of Scientific Revolutions, chs. II–VIII and IX–X. Anomalies do not mechanically or automatically produce a revolution; crisis, exemplars and disciplinary judgment are part of the historical account.'],
 ['Lakatos, Methodology of Scientific Research Programmes, “Falsification and the Methodology of Scientific Research Programmes.” Progressive problemshifts are judged by theoretical and empirical progress, not simply by adding any novel prediction.'],
 ['JCGM 100:2008, §§2–5 and Annex D; JCGM 100:2008/Amd.1:2026 on nonlinearity in measurement models. Measurement error and measurement uncertainty are related but not synonymous.'],
 ['Fisher, Design of Experiments, on randomization and experimental design; modern causal interpretation also requires attention to estimand, interference, attrition and protocol deviations. Blinding is useful when feasible but is not a universal requirement for every experiment.'],
 ['Giere, Scientific Perspectivism, on models as purpose-relative representations. F=ma is used here only as an example whose domain includes classical nonrelativistic mechanics in inertial frames.'],
 ['Wasserstein & Lazar, ASA Statement on p-Values, 2016, Principles 1–6. A p-value alone does not measure effect size, practical importance, truth of a hypothesis or strength of evidence in isolation from design and multiplicity.'],
 ['National Academies, Reproducibility and Replicability in Science, 2019, pp. 1–4 and 45–49: reproducibility = same data/code/computational conditions; replicability = new data addressing the same question.'],
 ['Merton, The Sociology of Science; publication bias and conflict-of-interest claims require separate empirical literatures. Peer review is a filtering institution, not a certificate of truth.'],
 ['Douglas, Science, Policy, and the Value-Free Ideal. Evidence can constrain factual claims while policy choices also involve value judgments about acceptable risk, distribution, precaution and trade-offs.']
],{
 0:{body:'관찰은 개념·분류·기기·모형의 영향을 받지만 그렇다고 임의적인 것은 아니다. 측정규칙, 교정, 독립적 기기, 반복관찰과 공개된 절차가 이론 간 판별력을 높인다. theory-ladenness는 “모든 해석이 동등하다”는 상대주의 명제가 아니다.'},
 1:{body:'Bacon은 체계적 경험자료와 배제·비교를 통해 성급한 일반화를 피하려 했고, Hume은 유한한 과거관찰만으로 미래의 동일성을 논리적으로 보증할 수 없다는 귀납의 문제를 제기했다. 두 입장을 모두 단순한 “관찰을 많이 하면 법칙이 나온다”는 방식으로 축약하지 않는다.'},
 2:{body:'Popper의 반증가능성은 이론이 위험한 경험적 예측을 허용해야 한다는 경계획정 원리다. 실제 시험은 이론 T뿐 아니라 초기조건·측정모형·보조가설 A를 함께 사용하므로 예측 실패가 T 하나의 논리적 거짓을 곧바로 확정하는 것은 아니다.',formula:'(T ∧ A ∧ C) → P; observed ¬P ⇒ at least one element of {T,A,C,measurement model} requires review'},
 3:{body:'Kuhn에서 정상과학은 공유된 exemplar와 문제풀이 관행 아래 진행되며, anomaly가 존재한다는 사실만으로 즉시 paradigm shift가 발생하지 않는다. 위기와 대안이론의 성숙, 공동체의 판단, 문제해결능력의 변화가 역사적으로 함께 작용한다.'},
 4:{body:'Lakatos의 research programme은 hard core와 protective belt를 구분하며, 보조가설 수정이 단순히 반례를 피하는지 아니면 새로운 내용과 독립적 경험적 성공을 낳는지 평가한다. “새 예측 하나가 있으면 진보적”이라는 기계적 판정은 피한다.'},
 5:{title:'측정·오차·불확실성',body:'측정오차(error)는 측정값과 참값 또는 기준값의 차이를 가리키는 개념이고 측정불확실성(uncertainty)은 측정량에 귀속되는 값들의 분산을 정량화한다. 알려진 systematic effect는 가능한 경우 보정하고, 표준불확실성들을 측정모형에 따라 결합한 뒤 필요할 때 coverage factor를 사용해 expanded uncertainty를 보고한다.',concepts:['measurement error','standard uncertainty','combined standard uncertainty','expanded uncertainty'],formula:'y = f(x₁,…,xₙ);  U = k·u_c(y)  (coverage interpretation and k must be stated)'},
 6:{body:'무작위화는 처리군 배정과 잠재적 교란의 체계적 연관을 줄여 설계기반 인과추론을 돕는다. 대조군·맹검·위약은 질문과 상황에 따라 편향을 줄이는 수단이지만, 모든 과학실험에 동일한 형태로 요구되는 보편 체크리스트는 아니다.'},
 7:{body:'과학모형은 목적에 맞게 현실의 일부를 이상화한다. 예를 들어 F=ma는 고전적·비상대론적 영역의 관성계에서 질량이 일정한 입자계에 적용되는 단순형이며, 모든 물리적 운동을 무조건 설명하는 보편식으로 사용하지 않는다.',formula:'classical constant-mass case in an inertial frame: ΣF = m a'},
 8:{body:'통계적 증거는 연구설계, 효과크기, 불확실성, 표본선택, 다중분석, 사전가설과 모델 적합성을 함께 평가한다. p값 하나만으로 재현성·실질적 중요성·가설의 참 확률을 판단하지 않는다.'},
 9:{body:'National Academies의 2019 용어에서 reproducibility는 같은 데이터와 계산절차를 이용해 계산결과를 재현하는 computational reproducibility를 뜻하고, replicability는 새로운 데이터를 수집한 독립 연구가 동일·유사 과학질문에 일관된 결과를 얻는지를 뜻한다. 분야별 다른 용례가 있을 수 있으므로 정의를 명시한다.'},
 10:{body:'동료평가·학술지·연구비·이해상충 규정은 과학의 사회적 품질관리 장치지만 오류를 제거하지는 않는다. publication bias, selective reporting, sponsor influence는 별도 경험연구로 평가하며 “peer reviewed” 자체를 사실확정 표지로 사용하지 않는다.'},
 11:{body:'과학은 위험크기·불확실성·가능한 결과에 관한 증거를 제공할 수 있지만 어떤 위험을 허용할지, 비용과 편익을 누구에게 배분할지, 예방원칙을 얼마나 강하게 적용할지는 규범적 판단을 포함한다. 사실판단과 가치판단을 구분하되 실제 정책에서 상호작용함을 인정한다.'}
});
window.NEXUS_QA_CORRECTIONS['CORE-141']={date:'2026-08-20',status:'SCIENCE_METHOD_SCOPE_REVISED',changes:['Popper 시험에서 보조가설·측정모형 조건 추가','Kuhn anomaly→revolution 자동서사 제거','Lakatos progressive programme 기준 보강','JCGM에 따라 error와 uncertainty 분리','reproducibility/replicability를 NASEM 2019 기준으로 구분','p값과 효과크기·설계 분리']};

apply('CORE-142',[
 'NIST, CODATA Recommended Values of the Fundamental Physical Constants: 2022, NIST SP 961 / JPCRD adjustment.',
 'Richard P. Feynman, Robert B. Leighton & Matthew Sands, The Feynman Lectures on Physics, Vols. I–III.',
 'Hugh D. Young & Roger A. Freedman, University Physics with Modern Physics.',
 'Daniel V. Schroeder, An Introduction to Thermal Physics.',
 'David J. Griffiths, Introduction to Electrodynamics, 4th ed.',
 'Eugene Hecht, Optics, 5th ed.',
 'Albert Einstein, “On the Electrodynamics of Moving Bodies,” 1905; “Does the Inertia of a Body Depend upon Its Energy-Content?”, 1905.',
 'David J. Griffiths & Darrell F. Schroeter, Introduction to Quantum Mechanics, 3rd ed.',
 'Barbara Ryden, Introduction to Cosmology, 2nd ed.; Sean Carroll, Spacetime and Geometry.'
],[
 ['Young & Freedman, mechanics chapters on units, vectors and kinematics. SI: [x]=m, [v]=m s⁻¹, [a]=m s⁻².'],
 ['Newton, Principia, Book I; modern form dp/dt=ΣF. The familiar ΣF=ma assumes constant mass and an inertial frame.'],
 ['Young & Freedman, work-energy and momentum chapters. Momentum of an isolated system is conserved when net external impulse is zero; kinetic/mechanical energy need not be conserved in inelastic processes although total energy is.'],
 ['Newtonian gravity: F=Gm₁m₂/r² in the classical weak-field/nonrelativistic regime. CODATA 2022: G=6.67430(15)×10⁻¹¹ m³ kg⁻¹ s⁻², unlike c and h, G is not exact.'],
 ['Continuity A₁v₁=A₂v₂ is the steady incompressible one-dimensional special case of mass conservation. Bernoulli-type relations require additional idealizations; blood flow is pulsatile and viscous in compliant vessels.'],
 ['First law sign convention used here: ΔU=Q−W where W is work done by the system. For an isolated system, total entropy satisfies ΔS_total≥0; reversible processes give equality.'],
 ['For a monochromatic wave in a specified medium v=fλ. Sound speed depends on medium properties; diagnostic ultrasound involves attenuation, bandwidth, scattering and transducer design in addition to simple frequency trade-offs.'],
 ['Ohm’s V=IR describes an ohmic element over a regime in which R is effectively constant; it is not a constitutive law for every device. P=VI is instantaneous/DC circuit power relation under the stated sign convention.'],
 ['Snell’s law n₁sinθ₁=n₂sinθ₂ applies at an interface for isotropic media under geometric-optics assumptions; diffraction limits arise outside the ray approximation.'],
 ['Special relativity: γ=1/√(1−v²/c²); E₀=mc² is rest energy. GPS timing requires both special-relativistic satellite-motion corrections and general-relativistic gravitational corrections. CODATA/SI gives c=299,792,458 m s⁻¹ exactly.'],
 ['Robertson uncertainty relation: σ_x σ_p ≥ ħ/2 for standard deviations of quantum observables. It is not merely a statement about measurement-device disturbance.'],
 ['Friedmann equation for FLRW cosmology: H²=(8πG/3)ρ−kc²/a²+Λc²/3 under the chosen conventions. Low-redshift Hubble–Lemaître relation v≈H₀d is an approximation and redshift-distance evidence is combined with CMB, nucleosynthesis, structure and other observations.']
],{
 0:{body:'위치·속도·가속도는 좌표계와 시간매개변수에 대해 정의하며, 벡터량에는 크기와 방향이 있다. 미분형 정의는 연속적으로 미분가능한 궤도에 적용되고 측정데이터에서는 차분과 잡음처리가 별도로 필요하다.',formula:'v = dx/dt  [m s⁻¹];  a = dv/dt = d²x/dt²  [m s⁻²]'},
 1:{body:'Newton 제2법칙의 일반적 고전형은 계의 운동량 변화율과 외력의 관계로 쓸 수 있다. 질량이 일정한 입자를 관성계에서 다룰 때 ΣF=ma가 된다. 로켓처럼 질량교환이 있는 계에는 단순식의 직접 적용에 주의한다.',formula:'general classical form: ΣF_ext = dp/dt; constant m in inertial frame: ΣF = m a'},
 2:{body:'일-에너지 정리는 순일이 운동에너지 변화와 연결됨을 말하고, 운동량 보존은 계에 작용한 순외부충격량이 0인 조건에서 성립한다. 비탄성 충돌에서 “에너지가 사라지는” 것이 아니라 운동에너지 일부가 열·변형·소리 등 내부에너지로 전환된다.',formula:'W_net=ΔK;  Δp_system=∫F_ext dt;  F_ext=0 ⇒ p_system constant'},
 3:{body:'Newton의 역제곱 중력은 고전적 약한 중력장·비상대론적 영역에서 매우 정확한 근사다. 중력상수 G는 측정불확실성을 가진 CODATA 조정값이며, 원궤도 속도 v=√(GM/r)는 중심질량이 지배적이고 원궤도라는 추가 가정을 사용한다.',formula:'F=Gm₁m₂/r²;  circular orbit (m≪M): v=√(GM/r);  G=6.67430(15)×10⁻¹¹ m³ kg⁻¹ s⁻²'},
 4:{body:'질량보존의 일반식은 연속방정식이며 A₁v₁=A₂v₂는 정상·비압축·1차원 평균흐름의 특수형이다. 실제 혈류는 점성·박동·혈관 탄성을 가지므로 이 식은 직관적 근사로만 사용한다.',formula:'mass conservation: ∂ρ/∂t + ∇·(ρv)=0; steady incompressible tube: A₁v₁=A₂v₂'},
 5:{body:'제1법칙의 부호규약을 ΔU=Q−W로 두면 W는 계가 외부에 한 일이다. 제2법칙의 ΔS≥0은 고립계 전체 엔트로피에 적용되는 형태이며, 가역과정에서는 ΔS_total=0이다. 열기관의 최대 효율은 두 열원 온도에 의존하는 Carnot 한계로 설명한다.',formula:'ΔU=Q−W; isolated system: ΔS_total≥0; Carnot: η_max=1−T_c/T_h (absolute K)'},
 6:{body:'주어진 매질에서 단색파의 위상속도·주파수·파장은 v=fλ로 연결된다. 초음파에서 높은 주파수는 일반적으로 짧은 파장과 더 나은 공간분해능을 가능하게 하지만 조직감쇠도 증가할 수 있으며 실제 성능은 탐촉자·대역폭·신호처리에 의존한다.',formula:'v=fλ  (v is wave speed in the specified medium)'},
 7:{body:'전압·전류·저항 관계 V=IR은 소자가 관심 작동범위에서 ohmic하게 동작하는 경우의 선형 관계다. 다이오드·트랜지스터·배터리 내부화학 등 비선형 소자에는 그대로 적용되지 않는다. 전력은 수동부호관례에서 p=vi로 계산한다.',formula:'ohmic regime: V=IR; instantaneous power: p=vi; DC: P=VI'},
 8:{body:'Snell 법칙은 균질·등방 매질 경계에서 굴절률과 입사·굴절각을 연결하는 기하광학식이다. 렌즈 해상도에는 회절과 개구가 중요하며, 파동광학 효과를 단순 광선추적으로 모두 설명할 수 없다.',formula:'n₁ sinθ₁ = n₂ sinθ₂'},
 9:{body:'특수상대성이론은 모든 관성계에서 물리법칙의 동일성과 진공에서의 빛의 속도 불변을 전제로 한다. E₀=mc²는 정지에너지이고 전체 상대론적 에너지는 운동량을 포함한다. GPS는 위성의 운동에 따른 특수상대론 효과뿐 아니라 중력퍼텐셜 차이에 따른 일반상대론 효과도 함께 보정한다.',formula:'γ=1/√(1−v²/c²);  E²=(pc)²+(mc²)²;  c=299,792,458 m s⁻¹ exact'},
 10:{body:'위치와 운동량의 불확정성 관계는 상태에서 측정한 두 관측량의 표준편차 사이의 하한이다. “관측자가 전자를 건드려 생기는 장비오차”만을 뜻하지 않으며, 양자상태의 비가환 관측량 구조에서 나온다.',formula:'σ_x σ_p ≥ ħ/2'},
 11:{body:'표준 FLRW 우주론에서 Friedmann 방정식은 물질·복사·곡률·우주상수 성분에 따라 팽창률을 연결한다. 낮은 적색편이에서 거리와 recession velocity의 근사 선형관계는 팽창의 한 증거지만, 현대 우주론은 CMB·원소합성·대규모구조·초신성 등 여러 독립 자료를 결합한다.',formula:'H²=(8πG/3)ρ − kc²/a² + Λc²/3; low-z approximation: v≈H₀d'}
});
window.NEXUS_QA_CORRECTIONS['CORE-142']={date:'2026-08-20',status:'PHYSICS_DOMAIN_UNITS_REVISED',changes:['Newton 제2법칙의 관성계·질량조건 명시','운동량보존과 kinetic-energy 보존 구분','G의 CODATA 2022 측정불확실성 반영','continuity 특수조건 명시','엔트로피 증가법칙을 고립계 전체로 한정','Ohm 법칙 작동범위 명시','GPS에 일반상대론 보정 추가','불확정성을 장비교란으로 축약하지 않음','Friedmann 식 완전화']};

apply('CORE-143',[
 'Bruce Alberts et al., Molecular Biology of the Cell, 7th ed., Garland Science, 2022.',
 'Neil A. Campbell et al., Campbell Biology, 12th ed.',
 'J. D. Watson & F. H. C. Crick, “Molecular Structure of Nucleic Acids,” Nature 171, 1953, 737–738; Meselson & Stahl, PNAS 44, 1958, 671–682.',
 'Francis Crick, “Central Dogma of Molecular Biology,” Nature 227, 1970, 561–563.',
 'Gregor Mendel, “Versuche über Pflanzen-Hybriden,” 1866; Anthony J. F. Griffiths et al., Introduction to Genetic Analysis.',
 'Godfrey H. Hardy, “Mendelian Proportions in a Mixed Population,” Science 28, 1908, 49–50; Wilhelm Weinberg, 1908.',
 'Charles Darwin, On the Origin of Species, 1859; Douglas J. Futuyma & Mark Kirkpatrick, Evolution, 4th ed.',
 'Mark Ridley, Evolution; modern phylogenetics texts.',
 'Janeway’s Immunobiology, 10th ed.',
 'Jennifer Doudna & Samuel Sternberg, A Crack in Creation; foundational CRISPR literature.'
],[
 ['Alberts et al., Molecular Biology of the Cell, molecular structure and macromolecule chapters. Structure-function statements are mechanistic hypotheses constrained by biochemical context, not simple one-molecule/one-function rules.'],
 ['Alberts et al., membrane transport chapters. Fick-type J=−D∇C describes passive diffusion under specified approximations; active transport requires free-energy input/coupling and is not captured by the simple diffusion equation.'],
 ['Campbell Biology, metabolism chapters. At constant temperature and pressure ΔG=ΔH−TΔS; enzymes alter activation barriers/rates but not the reaction equilibrium constant or ΔG° itself.'],
 ['Watson & Crick 1953 proposed complementary double-helical structure; Meselson & Stahl 1958 supplied classic evidence for semiconservative DNA replication. Structure and replication evidence should be historically separated.'],
 ['Crick, Nature 227 (1970), 561–563. The central dogma concerns prohibited transfer of sequence information from protein back to nucleic acid/protein; DNA→RNA→protein is a useful common pathway, not an exhaustive universal map of all RNA biology or reverse transcription.'],
 ['Mendel 1866; Griffiths et al. Independent assortment applies to loci that segregate independently; physical linkage can violate the simple independent model. Hardy–Weinberg p² belongs to population genetics, not a Mendelian cross formula.'],
 ['Hardy 1908; modern population genetics. Under random mating genotype proportions p²:2pq:q² arise from allele frequencies for a two-allele autosomal locus; constancy across generations additionally requires absence of evolutionary forces or explicit modeling of them.'],
 ['Darwin, Origin, chs. 3–4; Futuyma & Kirkpatrick. Natural selection is differential survival/reproductive success associated with heritable variation; populations evolve, while selection is manifested through differential performance of phenotypes/individuals.'],
 ['Modern phylogenetics texts. Reproductive isolation is one species concept among several and does not apply uniformly to asexual organisms or fossils; phylogenetic trees are hypotheses with uncertainty, not direct photographs of ancestry.'],
 ['Ecology texts on logistic growth. dN/dt=rN(1−N/K) assumes a simplified density dependence and constant parameters; K is environment-dependent and need not be temporally fixed.'],
 ['Janeway’s Immunobiology. Innate immunity is germline-encoded and pattern-recognition based; calling it simply “nonspecific” can obscure receptor specificity. Microbiome associations do not automatically establish causal effects on health.'],
 ['PCR ideal doubling gives N_n=N_0·2ⁿ only at 100% efficiency before plateau; more generally N_n=N_0(1+E)ⁿ over the exponential phase. CRISPR editing requires attention to off-target changes, mosaicism, delivery and biological context.']
],{
 1:{body:'막을 통한 수송에는 수동확산·촉진확산·능동수송 등이 있다. Fick 법칙의 단순형은 농도구배에 따른 수동확산을 나타내며, 능동수송은 ATP 가수분해나 이온구배 같은 자유에너지원을 사용하므로 같은 식으로 설명되지 않는다.',formula:'passive diffusion approximation: J = −D∇C'},
 2:{body:'생화학에서 Gibbs 자유에너지 관계 ΔG=ΔH−TΔS는 일정 온도·압력 조건에서 사용한다. 효소는 반응경로의 활성화 자유에너지를 낮춰 반응속도를 높이지만 반응물과 생성물 사이의 ΔG 및 평형상수 자체를 바꾸지 않는다.',formula:'constant T,P: ΔG=ΔH−TΔS; enzyme changes activation barrier, not equilibrium ΔG'},
 3:{body:'Watson과 Crick의 1953년 논문은 상보적 염기쌍을 갖는 이중나선 구조를 제안했고, 이 구조는 복제기작을 시사했다. 반보존적 복제를 실험적으로 판별한 고전적 근거는 Meselson–Stahl 1958이므로 구조 제안과 복제 검증을 같은 증거로 취급하지 않는다.'},
 4:{body:'DNA에서 RNA, RNA에서 단백질로 이어지는 흐름은 많은 유전자발현의 핵심경로지만 모든 정보흐름을 망라하지 않는다. reverse transcription, RNA genomes, non-coding RNA와 RNA processing이 존재한다. Crick의 central dogma는 특히 단백질 서열정보가 다시 핵산 또는 단백질 서열로 역전달된다는 가정을 배제하는 명제로 읽는다.',formula:'common expression route: DNA → RNA → protein; not an exhaustive universal flow diagram'},
 5:{body:'Mendel의 segregation은 한 개체의 두 allele이 gamete 형성 때 분리된다는 모델이고 independent assortment는 서로 독립적으로 분리되는 loci에 대한 조건부 명제다. linkage가 강한 유전자에는 독립분리 가정이 성립하지 않는다. 집단의 p² 유전자형 비율은 Mendelian cross가 아니라 Hardy–Weinberg 맥락이다.',formula:'simple Aa×Aa Mendelian cross: P(AA)=1/4, P(Aa)=1/2, P(aa)=1/4'},
 6:{body:'두 allele A,a의 빈도를 p,q(p+q=1)라 할 때 무작위교배 후 autosomal diploid genotype 비율은 p²,2pq,q²로 기대된다. allele 빈도가 세대 간 변하지 않는 equilibrium을 유지하려면 선택·돌연변이·이동·표류 등의 효과가 없거나 무시가능하다는 추가조건이 필요하다.',formula:'p+q=1; random mating ⇒ p²+2pq+q²=1; stable allele frequencies require additional no-evolution assumptions'},
 7:{body:'진화는 세대에 걸친 집단의 유전적 구성 변화로 정의할 수 있고, 자연선택은 heritable variation과 차등적인 생존·번식 성공이 있을 때 작동한다. 개체가 필요에 따라 유전적으로 “진화”하는 것이 아니며 fitness는 환경과 형질에 상대적인 개념이다.',formula:'relative fitness commonly normalized: w_i = expected reproductive contribution_i / reference contribution'},
 8:{body:'종분화는 gene flow 감소와 divergence가 누적되는 다양한 경로를 포함한다. biological species concept의 reproductive isolation은 중요한 틀이지만 무성생식·화석·잡종화가 빈번한 계통에는 제한이 있다. 계통수는 자료와 모형에 따른 공통조상 관계의 추정가설이며 branch support와 대안 tree를 함께 본다.'},
 9:{body:'logistic model은 성장률이 밀도에 선형적으로 감소하고 r,K가 분석기간 동안 일정하다는 단순화를 사용한다. 현실의 carrying capacity는 자원·기후·종간상호작용에 따라 변할 수 있으므로 K를 자연이 가진 영구적 고정숫자로 해석하지 않는다.',formula:'dN/dt = rN(1−N/K)  under simplified density-dependent assumptions'},
 10:{body:'선천면역은 germline-encoded pattern-recognition receptors를 통해 보존된 미생물·손상 패턴을 인식하고, 적응면역은 somatic receptor diversification을 통해 높은 항원특이성과 기억을 형성한다. “선천면역=무차별 비특이”라는 설명은 지나치게 단순하다. microbiome과 건강의 연관 역시 인과관계를 자동으로 뜻하지 않는다.'},
 11:{body:'PCR의 2ⁿ 증폭은 각 cycle이 정확히 100% 효율로 진행되고 exponential phase가 유지된다는 이상모형이다. 실제 효율은 1보다 작을 수 있고 시약고갈·산물억제 등으로 plateau가 나타난다. CRISPR는 표적특이성뿐 아니라 off-target, mosaicism, 전달효율과 장기효과를 검증해야 한다.',formula:'ideal: N_n=N_0·2ⁿ; exponential-phase efficiency model: N_n=N_0(1+E)ⁿ, 0≤E≤1'}
});
window.NEXUS_QA_CORRECTIONS['CORE-143']={date:'2026-08-20',status:'BIOLOGY_EVOLUTION_LEVELS_REVISED',changes:['Fick 법칙을 passive diffusion으로 한정','효소가 평형을 바꾸지 않음을 명확화','DNA 구조 제안과 semiconservative replication 증거 분리','central dogma 과잉단순화 제거','Mendel과 Hardy-Weinberg 수준 분리','HWE 가정 명시','개체선택과 집단진화 구분','species concept 한계 명시','logistic K의 고정값 오해 제거','PCR 2^n의 이상조건 명시']};

apply('CORE-144',[
 'John E. Hall & Michael E. Hall, Guyton and Hall Textbook of Medical Physiology, 15th ed.',
 'John B. West & Andrew M. Luks, West’s Respiratory Physiology: The Essentials.',
 'Jameson et al., Harrison’s Principles of Internal Medicine, 22nd ed.',
 'D. R. Matthews et al., “Homeostasis model assessment,” Diabetologia 28(7), 1985, 412–419.',
 'Kandel et al., Principles of Neural Science, 6th ed.',
 'Janeway’s Immunobiology, 10th ed.',
 'Robbins & Cotran Pathologic Basis of Disease, 11th ed.',
 'David L. Sackett et al., Evidence-Based Medicine; Users’ Guides to the Medical Literature.',
 'GRADE Working Group guidance on certainty of evidence and indirectness.',
 'Bertram Katzung et al., Basic & Clinical Pharmacology.',
 'BMJ Best Practice, EBM Toolbox: risk measures, ARR and NNT.',
 'Beauchamp & Childress, Principles of Biomedical Ethics, 8th ed.'
],[
 ['Guyton & Hall, homeostasis chapters. Homeostasis means regulated dynamic ranges, not exact constancy of a single set-point for every variable.'],
 ['Guyton & Hall, cardiovascular physiology. CO=HR×SV; arterial pressure relation is more fully MAP−CVP≈CO×SVR, with MAP≈CO×SVR only when central venous pressure is negligible.'],
 ['West’s Respiratory Physiology, ventilation and V/Q chapters. V̇_A=(V_T−V_D)f is alveolar ventilation; arterial oxygenation also depends on V/Q distribution, diffusion, shunt and inspired oxygen.'],
 ['Renal physiology texts. Clearance C_x=U_x·V/P_x is a defined virtual plasma volume per time; interpreting it as GFR requires an appropriate marker and assumptions.'],
 ['Harrison’s and physiology texts. “Liver function tests” are a heterogeneous set and many measure injury/cholestasis rather than global synthetic function.'],
 ['Matthews et al., Diabetologia 28(7), 1985, 412–419. HOMA-IR is a fasting surrogate model, not a universal diagnostic cutoff; common HOMA1 formula depends on glucose units.'],
 ['Kandel et al. Membrane potential and action potentials arise from ion gradients, selective conductances and membrane capacitance; one vague “conductance balance” scalar is not a complete neural model.'],
 ['Janeway’s Immunobiology. Innate immunity uses germline-encoded receptors and adaptive immunity uses clonally diversified receptors; “nonspecific vs specific” is only a rough introductory contrast.'],
 ['Robbins & Cotran, carcinogenesis chapters. Smoking increases risk through repeated exposures and multiple molecular pathways; it does not deterministically imply that any one exposed cell progresses to cancer.'],
 ['Evidence-based diagnosis: pretest odds=p/(1−p); post-test odds=pretest odds×LR; sensitivity/specificity/LR can vary across disease spectrum, thresholds and settings.'],
 ['Katzung, pharmacokinetics. C(t)=C₀e^(−kt) is the one-compartment, first-order elimination, IV bolus-type special case; multi-compartment kinetics, absorption and nonlinear elimination require other models.'],
 ['BMJ Best Practice EBM Toolbox: ARR=AR_control−AR_treatment for a bad outcome; NNT=1/ARR over a specified follow-up and baseline risk. GRADE: certainty depends on risk of bias, inconsistency, indirectness, imprecision and publication bias, among other domains.']
],{
 0:{body:'homeostasis는 체온·혈당·pH 같은 변수를 생존가능한 범위 안에서 동적으로 조절하는 과정이다. 모든 생리변수가 하나의 고정 set point를 유지하는 것은 아니며 circadian rhythm, 발달, 운동, 임신과 환경에 따라 정상범위와 목표가 달라질 수 있다.'},
 1:{body:'심박출량은 심박수와 일회박출량의 곱이고, 정상상태에서 평균동맥압과 혈류저항의 관계는 중심정맥압까지 포함해 이해하는 것이 정확하다. 출혈 시 교감신경·정맥수축·RAAS 등 보상이 작동하지만 보상이 항상 장기관류를 유지하는 것은 아니다.',formula:'CO=HR×SV;  MAP−CVP≈CO×SVR; when CVP≪MAP, MAP≈CO×SVR'},
 2:{body:'폐포환기는 일회호흡량에서 해부학적·생리학적 dead space를 제외한 유효환기량이다. 저산소혈증은 V/Q mismatch, shunt, diffusion limitation, hypoventilation, 낮은 inspired oxygen 등 서로 다른 기전으로 발생할 수 있으므로 폐렴을 하나의 메커니즘으로만 설명하지 않는다.',formula:'V̇_A=(V_T−V_D)·f'},
 3:{body:'renal clearance는 일정 시간 동안 혈장에서 특정 물질이 완전히 제거된 것처럼 보이는 가상 혈장용적이다. C_x=U_xV/P_x는 정의식이지만 GFR로 해석하려면 marker가 자유롭게 여과되고 유의한 재흡수·분비·대사가 없어야 한다. creatinine clearance는 임상적 근사로 한계를 가진다.',formula:'C_x = U_x·V/P_x  [volume/time]; ideal filtration marker ⇒ C_x≈GFR'},
 5:{title:'내분비·대사와 HOMA-IR',body:'호르몬은 수용체·feedback loop를 통해 대사를 조절한다. HOMA-IR은 fasting glucose와 fasting insulin으로 insulin resistance를 근사하는 population/research surrogate이며 euglycemic clamp의 직접대체나 개인의 보편 진단기준이 아니다. cut-off는 모집단·검사법에 따라 달라질 수 있다.',concepts:['hormone','feedback','insulin resistance','HOMA-IR'],formula:'HOMA1-IR ≈ fasting insulin (µU/mL) × fasting glucose (mmol/L) / 22.5; if glucose mg/dL, common equivalent denominator ≈405'},
 6:{body:'신경세포 막전위는 여러 이온의 농도구배, 선택적 channel conductance, equilibrium potential과 membrane capacitance에 의해 동적으로 결정된다. “특정 뇌영역 하나가 특정 행동 하나를 담당한다”는 단순 localization을 피하고 네트워크와 연결성을 함께 본다.',formula:'conductance-based form: C_m dV/dt = I_ext − Σ_i g_i(V−E_i)'},
 7:{body:'선천면역은 빠르고 germline-encoded pattern recognition을 사용하며, 적응면역은 V(D)J recombination 등으로 매우 다양한 antigen receptor를 만들고 clonal expansion과 memory를 형성한다. 두 계통은 cytokine·antigen presentation 등을 통해 긴밀히 상호작용한다.'},
 8:{body:'질병기전은 세포손상·염증·혈역학 이상·면역·유전·환경노출 등이 복합적으로 연결된 과정이다. 흡연은 폐암의 중요한 인과적 위험요인이지만 개인 수준에서 질병발생을 결정하는 충분조건은 아니며 노출량·유전감수성·기타 요인이 위험을 수정한다.'},
 9:{body:'진단검사는 “양성/음성 정확도”만으로 해석하지 않는다. 검사 전확률을 odds로 바꾸고 likelihood ratio를 적용해 검사 후확률을 계산하며, sensitivity·specificity와 LR은 질병 spectrum, threshold, reference standard와 setting에 따라 달라질 수 있다.',formula:'pretest odds=p/(1−p); post-test odds=pretest odds×LR; post-test p=odds/(1+odds)'},
 10:{body:'지수감소식은 one-compartment model에서 약물이 순간적으로 분포하고 first-order elimination을 따른다는 특수조건의 근사다. 실제 경구투여에는 absorption phase가 있고 multi-compartment distribution, saturable elimination, active metabolites, organ dysfunction이 kinetics를 바꿀 수 있다.',formula:'one-compartment first-order elimination after bolus: C(t)=C₀e^(−kt); t₁/₂=ln2/k'},
 11:{body:'임상 근거는 연구설계 이름 하나만으로 결정되지 않는다. GRADE는 risk of bias, inconsistency, indirectness, imprecision, publication bias 등을 outcome별로 평가한다. NNT는 특정 baseline risk와 follow-up 기간의 absolute risk difference에 의존하므로 다른 집단·기간에 그대로 일반화하지 않는다. 검진은 lead-time bias, length bias, overdiagnosis와 위양성도 함께 평가한다.',formula:'ARR=Risk_control−Risk_treatment; NNT=1/ARR for a specified population and time horizon'}
});
window.NEXUS_QA_CORRECTIONS['CORE-144']={date:'2026-08-20',status:'MEDICINE_EVIDENCE_GENERALIZABILITY_REVISED',changes:['homeostasis를 동적 범위로 수정','MAP 식에 CVP 조건 추가','renal clearance와 GFR 해석조건 분리','HOMA-IR 단위·surrogate 한계 명시','진단 LR의 pre/post odds 전체식 추가','약동학 지수식 적용범위 한정','GRADE 근거확실성과 indirectness 반영','NNT의 baseline risk·기간 의존성 명시']};

apply('CORE-145',[
 'IPCC, Climate Change 2021: The Physical Science Basis, AR6 Working Group I.',
 'IPCC, Climate Change 2022: Impacts, Adaptation and Vulnerability, AR6 Working Group II.',
 'IPCC, Climate Change 2022: Mitigation of Climate Change, AR6 Working Group III.',
 'IPCC, AR6 Synthesis Report, 2023.',
 'Kump, Kasting & Crane, The Earth System.',
 'John M. Wallace & Peter V. Hobbs, Atmospheric Science, 2nd ed.',
 'USGS, This Dynamic Earth / plate tectonics resources.',
 'NOAA, ENSO resources.',
 'IPBES, Global Assessment Report on Biodiversity and Ecosystem Services, 2019.',
 'WHO, Global Air Quality Guidelines, 2021.',
 'IEA, World Energy Outlook and power-system integration assessments.'
],[
 ['Kump et al., Earth-system chapters. Reservoirs and fluxes operate on different time scales; a “cycle” does not imply that anthropogenic perturbations are immediately balanced.'],
 ['USGS plate-tectonics resources. Plate motion reflects slab pull, ridge forces, mantle convection and boundary interactions; “mantle convection alone pushes plates” is an oversimplification.'],
 ['Wallace & Hobbs, atmospheric thermodynamics. p=ρR_dT is an ideal-gas relation for dry air with specific gas constant R_d and requires consistent SI units; moist air requires virtual temperature/composition treatment.'],
 ['NOAA ENSO resources. ENSO is coupled ocean-atmosphere variability in the tropical Pacific; thermohaline circulation is not a single conveyor belt with one fixed speed.'],
 ['IPCC AR6 WGI, ch. 7. The zero-dimensional balance S(1−α)/4=σT_e⁴ defines an effective emission temperature under strong idealizations; it is not a direct formula for mean surface temperature.'],
 ['IPCC AR6 WGI chs. 5 and 7. ΔF≈5.35 ln(C/C₀) is a historically useful Myhre et al.-style approximation for CO₂ forcing over a range, not the full AR6 effective-radiative-forcing calculation.'],
 ['IPCC AR6 WGI ch. 2 on paleoclimate archives. Proxy records require calibration, chronology and uncertainty; ice-core gas age can differ from surrounding ice age.'],
 ['IPCC AR6 WGI ch. 1 §1.4.3 and ch. 4: SSP/RCP pathways are scenarios used for conditional projections, not probability-ranked forecasts of what society will choose. Uncertainty includes internal variability, model/response uncertainty and scenario uncertainty.'],
 ['IPBES Global Assessment 2019. Biodiversity change includes habitat/land-use change, direct exploitation, climate change, pollution and invasive species; global averages do not imply identical local effects.'],
 ['WHO Global Air Quality Guidelines 2021. PM2.5 guideline: annual 5 µg/m³ and 24-hour 15 µg/m³. These are health-based guidelines, not automatically legally binding standards in every jurisdiction.'],
 ['IEA and system-analysis literature. LCOE is a discounted plant-level cost metric and does not by itself capture full system integration, flexibility, network, reliability or externality costs.'],
 ['IPCC AR6 WGII/WGIII and Synthesis Report. Climate risk is conceptualized through interactions among hazard, exposure and vulnerability; it is not a universal multiplicative engineering equation.']
],{
 0:{body:'지구시스템은 대기·해양·빙권·지권·생물권 사이의 reservoir와 flux로 구성되며 각 과정의 시간척도가 다르다. 탄소가 “순환”한다는 사실은 인간이 추가한 CO₂가 짧은 시간에 자동 상쇄된다는 뜻이 아니며, source·sink와 residence/adjustment time을 구분한다.'},
 1:{body:'판구조론은 해령에서의 생성, 섭입, transform motion과 지질·지진·자기줄무늬 자료를 통합한다. plate motion의 driving force는 slab pull, ridge-related forces, mantle flow 등 복수 메커니즘이 상호작용하므로 “맨틀대류가 판을 단순히 끌고 간다”는 단일원인 설명을 피한다.'},
 2:{body:'대기는 혼합기체이며 건조공기를 이상기체로 근사하면 p=ρR_dT를 사용할 수 있다. 여기서 R_d는 dry-air specific gas constant이고 T는 absolute temperature(K)다. 수증기가 많은 공기는 virtual temperature나 조성변화를 고려해야 한다. Coriolis effect 역시 위도와 속도에 의존한다.',formula:'dry-air ideal-gas approximation: p=ρR_dT, T in K'},
 3:{body:'해양은 바람, 밀도차, 지구자전, 지형과 surface buoyancy forcing에 의해 순환한다. ENSO는 tropical Pacific의 ocean-atmosphere coupled variability이며, 장기 심층순환을 “고정된 thermohaline conveyor belt” 하나로 단순화하지 않는다.'},
 4:{body:'간단한 zero-dimensional radiative-equilibrium model은 지구가 흡수하는 평균 태양복사와 우주로 방출하는 장파복사를 같게 놓아 effective emission temperature를 계산한다. 이 T_e는 지표 평균온도가 아니며 대기흡수·대류·구름·수증기·고도별 방출을 생략한다.',formula:'idealized effective emission temperature: S(1−α)/4 = σT_e⁴'},
 5:{body:'인간활동은 화석연료 연소·시멘트·토지이용변화를 통해 탄소순환에 순증가를 가한다. CO₂ 농도와 복사강제력의 로그근사는 교육용으로 유용하지만 계수와 forcing 정의는 스펙트럼 계산·중첩기체·effective radiative forcing의 정의에 따라 정교화된다. 이를 AR6 전체 기후응답식으로 취급하지 않는다.',formula:'historical first-order CO₂ forcing approximation: ΔF≈5.35 ln(C/C₀) W m⁻²; use current assessed forcing methods for precision work'},
 6:{body:'고기후 proxy는 직접 온도계가 아니라 동위원소·생물·퇴적·나이테와 환경변수 사이의 관계를 이용한 간접지표다. calibration, dating, spatial representativeness와 proxy-system uncertainty를 함께 보고한다. ice core의 포획된 기체는 주변 얼음보다 젊을 수 있어 gas-age/ice-age difference를 고려한다.'},
 7:{body:'기후모형 projection은 물리방정식과 초기조건·forcing pathway를 이용해 “이 조건이면 어떤 기후가 가능한가”를 계산한다. SSP/RCP는 사회가 실제로 선택할 미래의 확률예보가 아니다. near-term에는 internal variability와 model response uncertainty가 중요하고 장기에는 emissions/scenario uncertainty의 비중이 커질 수 있다.',formula:'projection = model response conditional on forcing/scenario; distinguish internal variability + model/response uncertainty + scenario uncertainty'},
 8:{body:'생물다양성 감소는 land/sea-use change, direct exploitation, climate change, pollution, invasive alien species 등 복수 직접동인의 영향을 받는다. “인간활동이 멸종률을 높인다”는 전지구 평가를 개별 지역·종에 동일한 효과크기로 일반화하지 않고 공간·분류군·시간척도를 구분한다.'},
 9:{body:'환경보건 위험은 hazard가 존재한다는 사실과 실제 exposure·dose·susceptibility를 구분해 평가한다. Risk≈Hazard×Exposure 같은 표현은 정성적 도식일 뿐 일반적인 dose-response 공식이 아니다. WHO 2021 PM2.5 guideline은 연평균 5 µg/m³, 24시간 15 µg/m³의 health-based guideline이며 각국의 법적 대기기준과 동일하지 않을 수 있다.',formula:'risk assessment requires hazard identification + exposure/dose + dose-response + population susceptibility; no universal Risk=Hazard×Exposure identity'},
 10:{body:'LCOE는 발전설비의 생애주기 할인비용을 할인 발전량으로 나눈 plant-level 평균비용 지표다. discount rate, capacity factor, lifetime, fuel and capital assumptions에 민감하며 송전망·저장·예비력·curtailment·신뢰도·외부비용을 자동 포함하지 않는다. 기술 비교에는 system value와 integration cost를 별도로 본다.',formula:'LCOE = Σ_t Cost_t/(1+r)^t  ÷  Σ_t Energy_t/(1+r)^t  (scope and assumptions must be stated)'},
 11:{body:'IPCC의 기후위험은 hazard, exposure, vulnerability의 상호작용으로 이해한다. 이를 보편적인 곱셈식으로 취급하지 않는다. mitigation은 온실가스 배출원·흡수원을 바꾸는 전략이고 adaptation은 현재·예상 기후와 영향에 조정하는 전략이며, 정의·형평성·적응한계·maladaptation까지 함께 평가한다.',formula:'conceptual: Climate risk = f(hazard, exposure, vulnerability, response); not a universal multiplicative law'}
});
window.NEXUS_QA_CORRECTIONS['CORE-145']={date:'2026-08-20',status:'CLIMATE_OBSERVATION_SCENARIO_UNCERTAINTY_REVISED',changes:['plate motion 단일원인 설명 제거','dry-air ideal-gas 조건 명시','radiative equilibrium의 T_e와 surface temperature 분리','CO2 forcing 5.35 log식을 역사적 근사로 한정','proxy calibration·dating uncertainty 명시','SSP/RCP를 확률예측이 아닌 조건부 scenario projection으로 구분','WHO guideline과 법적 기준 구분','LCOE와 system cost 분리','climate risk를 단순 곱셈식으로 취급하지 않음']};
})();