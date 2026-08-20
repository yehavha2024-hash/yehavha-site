(()=>{'use strict';
const V=(sources,note)=>({date:'2026-08-20',scope:'대표문헌 서지·수업주제 적합성 1차 원자료 대조',sources,note});
window.NEXUS_QA_REGISTER={
 version:'1.1',updated:'2026-08-20',totalCourses:496,totalLessons:5952,
 policy:{automatic:'자동점검은 누락·형식·중복·연결·난이도 위험을 탐지한다. 자동점검 통과는 원자료 검증완료를 의미하지 않는다.',verified:'verified는 표시된 scope 범위에서 공식 원문·원전·출판사·논문 또는 신뢰할 수 있는 1차 자료를 실제 대조한 경우에만 부여한다. 한 Lesson의 verified가 그 Lesson 모든 명제의 사실검증 완료를 뜻하지 않는다.',revision:'검증 중 오류·부정확·과도한 단순화가 발견되면 수정 후 재검증한다.'},
 batches:[
  {id:'QA-01',title:'University Core',courses:35,lessons:420,status:'ACTIVE',scope:'대표문헌·원전·공식·기초개념의 기준점 확정'},
  {id:'QA-02',title:'법학 · 컴퓨팅·AI',courses:87,lessons:1044,status:'QUEUED',scope:'조문·판례·비교법·논문·알고리즘·수학모형·기술표준'},
  {id:'QA-03',title:'철학 · 사회과학',courses:57,lessons:684,status:'QUEUED',scope:'원전·논증·경험연구·인과·경쟁설명'},
  {id:'QA-04',title:'의학 · 자연과학 · 공학',courses:117,lessons:1404,status:'QUEUED',scope:'가이드라인·근거수준·공식·실험·설계기준·안전표준'},
  {id:'QA-05',title:'신학 · 인문학 · 예술',courses:106,lessons:1272,status:'QUEUED',scope:'본문·원어·사본·사료·작품·비평·기법'},
  {id:'QA-06',title:'경제경영 · 건축도시 · 교육 · 융합',courses:94,lessons:1128,status:'QUEUED',scope:'경제모형·회계기준·설계법규·학습연구·융합 Capstone'}
 ],
 verified:{
  'CORE-101-L01':V(['John Dewey, How We Think, 1910'],'Dewey 원전의 서지와 반성적 사고 주제 적합성 확인.'),
  'CORE-101-L02':V(['Anthony Weston, A Rulebook for Arguments, 5th ed., 2018'],'Hackett 출판사 서지와 reasons/evidence/argument 구성 주제 적합성 확인.'),
  'CORE-101-L03':V(['C. K. Ogden & I. A. Richards, The Meaning of Meaning, 1923'],'1923 초판 서지와 의미·언어·정의 문제의 관련성 확인.'),
  'CORE-101-L04':V(['Copi, Cohen & McMahon, Introduction to Logic, 14th ed., 2011'],'Routledge 14판 서지와 deduction/validity 범위 확인.'),
  'CORE-101-L05':V(['David Hume, An Enquiry Concerning Human Understanding, 1748','Ian Hacking, An Introduction to Probability and Inductive Logic, 2001'],'Hume는 귀납의 철학적 문제, Hacking은 Bayes rule·확률형식의 출처로 분리 확인.'),
  'CORE-101-L06':V(['Judea Pearl & Dana Mackenzie, The Book of Why, 2018','Donald B. Rubin, Journal of Educational Psychology 66(5), 1974','Hernán & Robins, Causal Inference: What If, 2024 online edition'],'인과추론 개념과 potential-outcomes/causal effect 표기의 출처를 분리 확인.'),
  'CORE-101-L07':V(['Douglas Walton, Informal Logic: A Pragmatic Approach, 2nd ed., 2008'],'Cambridge 서지 및 fallacies/argument criticism 범위 확인.'),
  'CORE-101-L08':V(['Daniel Kahneman, Thinking, Fast and Slow, 2011'],'판단·휴리스틱·편향을 다루는 대표문헌으로 서지·주제 적합성 확인.'),
  'CORE-101-L09':V(['Booth, Colomb, Williams, Bizup & FitzGerald, The Craft of Research, 5th ed., 2024'],'University of Chicago Press 5판과 source evaluation/research argument 범위 확인.'),
  'CORE-101-L10':V(['Stephen E. Toulmin, The Uses of Argument, 2nd ed., 2003','Anthony Weston, A Rulebook for Arguments, 5th ed., 2018'],'Toulmin의 rebuttal/warrant와 현대적 charitable reconstruction/steelman을 구분하도록 교정.'),
  'CORE-101-L11':V(['Ian Hacking, An Introduction to Probability and Inductive Logic, 2001','Hammond, Keeney & Raiffa, Smart Choices, rev. ed. 2015'],'Hacking의 expected value·decision under uncertainty와 Smart Choices의 실천적 의사결정 범위 확인.'),
  'CORE-101-L12':V(['Stephen E. Toulmin, The Uses of Argument, 2nd ed., 2003'],'Cambridge 판본의 The Layout of Arguments를 종합 논증분석의 기준자료로 확인.')
 },
 revised:{
  'CORE-101-L05':{date:'2026-08-20',reason:'Bayes 식을 Hume 단독출처처럼 보이게 한 연결 수정',change:'Bayes 정리 정확식으로 교체하고 Hacking 2001 추가.'},
  'CORE-101-L06':{date:'2026-08-20',reason:'ATE 표기의 출처 정밀도 부족',change:'Rubin 1974와 Hernán & Robins 추가, Pearl은 인과개념 자료로 유지.'},
  'CORE-101-L10':{date:'2026-08-20',reason:'steelman을 Toulmin 고유 개념처럼 오인할 가능성',change:'자비의 원칙·현대적 steelman과 Toulmin rebuttal/warrant를 명시적으로 구분.'}
 },
 notes:{'CORE-101':{status:'FIRST_PASS_SOURCE_ALIGNMENT_COMPLETE',next:'강의본문의 개별 사실명제·공식 해설·평가문항을 2차 세부검증'}}
};
})();