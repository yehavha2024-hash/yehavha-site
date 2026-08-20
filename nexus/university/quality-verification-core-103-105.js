(()=>{'use strict';
const q=window.NEXUS_QA_REGISTER;if(!q)return;
q.verified=q.verified||{};q.revised=q.revised||{};q.notes=q.notes||{};
const V=(sources,note)=>({date:'2026-08-20',scope:'본문 핵심주장·대표문헌 위치·서지의 1차 원자료 대조. Lesson의 모든 세부명제에 대한 최종 사실검증을 의미하지 않는다.',sources,note});
Object.assign(q.verified,{
 'CORE-103-L01':V(['Adler & Van Doren, How to Read a Book, rev. ed. 1972, ch. 2, ch. 4, Part II chs. 6–12, ch. 22.'],'Adler의 네 독해수준과 inspectional·analytical·syntopical reading의 위치를 대조하고 용어를 교정.'),
 'CORE-103-L02':V(['Greenhalgh, How to Read a Paper, 7th ed. 2024, ch. 3, pp. 30–44.'],'논문을 본격적으로 읽기 전에 연구질문·설계·핵심구조를 파악하는 reading orientation과 Lesson 주장의 정합성 확인.'),
 'CORE-103-L03':V(['Booth et al., The Craft of Research, 5th ed. 2024, §4.4, ch. 5, chs. 7–9.'],'주장·근거·warrant·반론을 추출하여 논증구조를 재구성하는 읽기와 정합성 확인.'),
 'CORE-103-L04':V(['Greenhalgh, How to Read a Paper, 7th ed. 2024, ch. 3, pp. 30–44.','Greenhalgh, BMJ 315 (1997): 243, doi:10.1136/bmj.315.7102.243.'],'IMRaD 각 부분의 기능을 구분하고 결과와 해석을 분리해 읽는 방법의 근거 확인.'),
 'CORE-103-L05':V(['Eco, How to Write a Thesis, MIT Press, 2015, ch. 3, pp. 45–106.','Hutchinson & Duncan, “Defining and Describing What We Do: Doctrinal Legal Research,” Deakin Law Review 17(1) (2012): 83–119, esp. 113–116.'],'인문 원전·판본 검토와 법학의 1차 법원자료 식별·분석을 구분하도록 출처를 보강.'),
 'CORE-103-L06':V(['Tufte, The Visual Display of Quantitative Information, 2nd ed. 2001, ch. 2, pp. 53–78; ch. 3, pp. 79–90.'],'축·척도·자료표현과 graphical integrity 검토가 수치·시각자료 비판적 읽기와 부합함을 확인.'),
 'CORE-103-L07':V(['Booth et al., The Craft of Research, 5th ed. 2024, §§4.1, 4.6–4.7, §12.7.'],'서지정보 기록·출처 추적·인용의 학술적 기능과 Lesson의 citation chaining 취지를 대조.'),
 'CORE-103-L08':V(['Eco, How to Write a Thesis, 2015, ch. 3, pp. 45–106; ch. 4, pp. 107–144.','Adler & Van Doren, How to Read a Book, rev. ed. 1972, ch. 8.'],'판본·원어·용어·저자 개념을 확인하며 번역과 2차해석을 대조하는 읽기 원칙 확인.'),
 'CORE-103-L09':V(['Cochrane Handbook for Systematic Reviews of Interventions, version 6.5/6.5.1, chs. 3, 4, 8, 10, 13.'],'선정기준·검색·risk of bias·meta-analysis·missing evidence를 점검해야 한다는 Lesson 구조와 정확히 대응.'),
 'CORE-103-L10':V(['Shadish, Cook & Campbell, Experimental and Quasi-Experimental Designs for Generalized Causal Inference, 2002, chs. 2–3.'],'통계적 결론·내적·구성·외적 타당도와 대안설명 점검의 근거 확인.'),
 'CORE-103-L11':V(['Booth et al., The Craft of Research, 5th ed. 2024, §§4.1, 4.6–4.7.','Hart, Doing a Literature Review, 3rd ed. 2026, ch. 7.'],'문헌별 공통 필드 추출과 비교 가능한 연구노트·매트릭스 작성의 근거 확인.'),
 'CORE-103-L12':V(['Hart, Doing a Literature Review, 3rd ed. 2026, chs. 5, 7–10.','Booth et al., The Craft of Research, 5th ed. 2024, §4.4, ch. 9.'],'문헌 간 합의·대립·공백을 논증과 방법 차이로 종합하는 독해의 근거 확인.'),

 'CORE-104-L01':V(['Booth et al., The Craft of Research, 5th ed. 2024, chs. 1–2, §6.1.'],'주제에서 질문·연구문제로 좁히고 논증가능한 claim을 만드는 과정과 Lesson 정합성 확인.'),
 'CORE-104-L02':V(['Williams & Bizup, Style: Lessons in Clarity and Grace, 13th ed. 2021, Lessons 2–5.'],'문장·문단의 cohesion, coherence, emphasis를 확인하고 “두괄식”을 절대형식으로 보던 표현을 수정.'),
 'CORE-104-L03':V(['Toulmin, The Uses of Argument, 2nd ed. 2003, ch. III “The Layout of Arguments.”'],'claim·data·warrant·qualifier·rebuttal 구조와 Lesson의 논증작성법을 대조.'),
 'CORE-104-L04':V(['Giovanni Sartori, “Concept Misformation in Comparative Politics,” APSR 64(4) (1970): 1033–1053.'],'개념의 범위·분류·개념신장 문제를 연구개념 명료화의 대표 원전으로 대조.'),
 'CORE-104-L05':V(['Turabian, A Manual for Writers, 9th ed. 2018, §§7.4–7.9.','Booth et al., The Craft of Research, 5th ed. 2024, §§12.1–12.9.'],'quotation·paraphrase·summary·citation·plagiarism의 구분을 확인하고 모든 문장에 기계적 인용을 요구하는 표현을 방지.'),
 'CORE-104-L06':V(['Hart, Doing a Literature Review, 3rd ed. 2026, chs. 5, 7, 9–10.'],'저자별 나열보다 논증·방법·쟁점·개념축으로 문헌을 조직하고 종합하는 방식과 정합성 확인.'),
 'CORE-104-L07':V(['Appelbaum et al., “Journal Article Reporting Standards for Quantitative Research in Psychology,” American Psychologist 73(1) (2018): 3–25.','Levitt et al., “Journal Article Reporting Standards for Qualitative Primary, Qualitative Meta-Analytic, and Mixed Methods Research in Psychology,” American Psychologist 73(1) (2018): 26–46.'],'양적 연구의 재현가능한 절차보고와 질적 연구의 맥락·분석·연구자 위치성 투명성을 분리해 검증.'),
 'CORE-104-L08':V(['Greenhalgh, How to Read a Paper, 7th ed. 2024, chs. 3–5.'],'관찰된 결과와 저자의 해석·인과추론을 분리해야 한다는 주장과 정합성 확인.'),
 'CORE-104-L09':V(['Booth et al., The Craft of Research, 5th ed. 2024, ch. 9, especially §§9.3–9.5.'],'acknowledgments·responses·limitations를 논증강화의 일부로 다루는 구조와 정합성 확인.'),
 'CORE-104-L10':V(['Tufte, The Visual Display of Quantitative Information, 2nd ed. 2001, pp. 53–90.','Booth et al., The Craft of Research, 5th ed. 2024, ch. 13.'],'표·그림이 독립 장식이 아니라 증거전달 수단이며 graphical integrity를 지켜야 한다는 점 확인.'),
 'CORE-104-L11':V(['Williams & Bizup, Style, 13th ed. 2021, Lessons 2–5, 8–10.','Booth et al., The Craft of Research, 5th ed. 2024, ch. 15.'],'명사화·행위자·응집성·간결성·강조를 중심으로 퇴고하는 기준과 정합성 확인.'),
 'CORE-104-L12':V(['Booth et al., The Craft of Research, 5th ed. 2024, chs. 10–14, esp. ch. 14, pp. 235–251.','Turabian, A Manual for Writers, 9th ed. 2018, chs. 7–10.'],'초안·구조·자료통합·도입·결론·퇴고를 하나의 논문형 과제로 통합하는 근거 확인.'),

 'CORE-105-L01':V(['Popper, The Logic of Scientific Discovery, Routledge Classics, 2002, §6, pp. 17–20.','Creswell & Creswell, Research Design, 6th ed. 2022, ch. 7.'],'Popper의 falsifiability와 통계검정의 H0/H1을 동일시하지 않도록 분리하고 연구질문·가설의 위치를 확인.'),
 'CORE-105-L02':V(['Kuhn, The Structure of Scientific Revolutions, 50th Anniversary ed. 2012, ch. III p. 23, ch. VI p. 52, chs. VII–IX pp. 66–110.'],'normal science·anomaly·crisis·revolution의 전개와 Lesson 핵심주장을 대조.'),
 'CORE-105-L03':V(['Babbie, The Practice of Social Research, ch. 5.','Novick, “The Axioms and Principal Results of Classical Test Theory,” Journal of Mathematical Psychology 3(1) (1966): 1–18.'],'conceptualization·operationalization은 Babbie에, X=T+E는 고전검사이론에 각각 귀속하도록 수정.'),
 'CORE-105-L04':V(['Cochran, Sampling Techniques, 3rd ed. 1977, ch. 2, §§2.5–2.7, pp. 23–26.'],'단순무작위추출 표준오차와 finite population correction의 적용조건을 확인하고 보편식처럼 보이던 표현을 교정.'),
 'CORE-105-L05':V(['Shadish, Cook & Campbell, 2002, ch. 8.','Rubin, “Estimating Causal Effects of Treatments in Randomized and Nonrandomized Studies,” JEP 66(5) (1974): 688–701.'],'무작위배정과 potential outcomes 기반 treatment effect의 근거를 분리해 대조.'),
 'CORE-105-L06':V(['Angrist & Pischke, Mostly Harmless Econometrics, 2009, chs. 5–6.','Rosenbaum & Rubin, “The Central Role of the Propensity Score…,” Biometrika 70(1) (1983): 41–55.'],'DiD·RDD와 propensity-score matching을 서로 다른 식별전략·원자료에 연결.'),
 'CORE-105-L07':V(['Pearl, Causality, 2nd ed. 2009, ch. 3, §3.3.1 pp. 79–80, §3.4 pp. 85–86.'],'back-door criterion과 intervention/do-calculus 위치를 대조하여 DAG·교란통제 설명과 정합성 확인.'),
 'CORE-105-L08':V(['Creswell & Poth, Qualitative Inquiry and Research Design, 5th ed. 2024, chs. 4 and 7.'],'질적 접근별 표본·자료수집의 차이를 확인하고 theoretical saturation을 모든 질적연구의 보편기준으로 일반화하지 않도록 수정.'),
 'CORE-105-L09':V(['Creswell & Creswell, Research Design, 6th ed. 2022, ch. 10.'],'정량·질적 자료를 단순 병렬배치하지 않고 mixed-methods design에서 integration point를 설계해야 한다는 점 확인.'),
 'CORE-105-L10':V(['Nosek et al., “Promoting an Open Research Culture,” Science 348(6242) (2015): 1422–1425.'],'transparency·openness·preregistration·replication을 촉진하는 TOP framework와 Lesson 취지의 정합성 확인.'),
 'CORE-105-L11':V(['The Belmont Report, 1979, Part B “Basic Ethical Principles,” Part C “Applications.”'],'Respect for Persons·Beneficence·Justice와 informed consent·risk/benefit·subject selection을 연구윤리 구조로 직접 확인.'),
 'CORE-105-L12':V(['Creswell & Creswell, Research Design, 6th ed. 2022, chs. 1, 3–4, 7–10.','Shadish, Cook & Campbell, 2002, chs. 1–3 and 8–14.'],'질문·설계·측정·분석·타당도·방법선택을 일관된 연구설계로 종합하는 근거 확인.')
});
Object.assign(q.revised,{
 'CORE-103-L01':{date:'2026-08-20',reason:'Adler의 4단계 독해 분류에 research reading을 사용',change:'elementary·inspectional·analytical·syntopical reading으로 교정.'},
 'CORE-103-L05':{date:'2026-08-20',reason:'법학 연구문헌 읽기를 Eco 단독문헌으로 뒷받침',change:'doctrinal legal research의 1차 법원자료 분석을 Hutchinson & Duncan 원문으로 보강.'},
 'CORE-104-L02':{date:'2026-08-20',reason:'모든 문단이 주제문 선두의 두괄식이어야 하는 것처럼 과도하게 규칙화',change:'통제아이디어·응집성·일관성·강조 중심으로 수정.'},
 'CORE-104-L05':{date:'2026-08-20',reason:'모든 핵심주장에 일률적 인용이 필요하다는 오해 가능성',change:'타인의 아이디어·자료·특정 사실은 추적가능한 인용을 요구하되 일반상식·독자분석은 구분.'},
 'CORE-104-L07':{date:'2026-08-20',reason:'양적·질적 연구를 동일한 재현가능성 기준으로 표현',change:'APA JARS를 사용해 양적 reproducibility와 질적 transparency/auditability를 분리.'},
 'CORE-105-L01':{date:'2026-08-20',reason:'Popper의 falsifiability와 H0/H1 통계검정을 직접 결합',change:'H0/H1 공식을 제거하고 falsifiability와 통계가설검정의 역할을 분리.'},
 'CORE-105-L03':{date:'2026-08-20',reason:'Observed=True+Error를 일반 측정·조작화 식처럼 Babbie에 귀속',change:'X=T+E를 고전검사이론으로 한정하고 Novick 1966을 직접 출처로 추가.'},
 'CORE-105-L04':{date:'2026-08-20',reason:'SE≈σ/√n을 표본설계와 모집단 조건 없이 보편식처럼 제시',change:'단순무작위추출 조건과 유한모집단 보정식을 명시.'},
 'CORE-105-L08':{date:'2026-08-20',reason:'theoretical saturation을 모든 질적연구의 보편 표본종료기준처럼 표현',change:'특히 grounded theory 등 접근별 기준임을 명시하고 일반화를 제거.'}
});
q.notes['CORE-103']={status:'FIRST_PASS_CLAIM_SOURCE_ALIGNMENT_COMPLETE',next:'개별 본문문장·예시·평가문항의 2차 세부검증'};
q.notes['CORE-104']={status:'FIRST_PASS_CLAIM_SOURCE_ALIGNMENT_COMPLETE',next:'인용윤리·문체규칙·방법보고 예시의 2차 세부검증'};
q.notes['CORE-105']={status:'FIRST_PASS_CLAIM_SOURCE_ALIGNMENT_COMPLETE',next:'공식·인과식별·질적방법·윤리사례의 2차 세부검증'};
const batch=(q.batches||[]).find(x=>x.id==='QA-01');if(batch)batch.status='ACTIVE · 60/420 SOURCE PASS';
q.version='1.3';q.updated='2026-08-20';
})();