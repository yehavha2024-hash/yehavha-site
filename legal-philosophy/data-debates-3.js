(() => {
  const additions = [
    {
      id:'chesterman-personality', order:51, thinker:'사이먼 체스터먼', en:'Simon Chesterman', period:'현대', priority:'최핵심',
      axes:['법인격·법적 주체','AI·신기술'], keywords:['AI legal personality','accountability gap','juridical personality','instrumental justification'],
      thesis:'법체계가 AI를 위한 새로운 법인격 범주를 만들 수 있다는 가능성과 실제로 그렇게 해야 한다는 정당화는 별개의 문제이며, 책임공백이나 인간과의 유사성만으로는 법인격 부여가 충분히 정당화되지 않는다.',
      concepts:['법적 가능성과 규범적 정당화의 구별','법인격의 도구적 근거','AI 법인격의 한계'],
      relevance:['기능적 법적 지위를 검토할 때 새로운 주체를 만드는 것이 기존 인간·법인 책임을 회피시키는지 먼저 검증하게 한다.','제한적 법적 지위가 필요하다는 주장은 구체적 법적 기능과 피해구제상 이익을 입증해야 한다는 반대논거를 제공한다.'],
      works:['Artificial Intelligence and the Limits of Legal Personality'],
      sourceLabel:'Cambridge Core — Artificial Intelligence and the Limits of Legal Personality', sourceUrl:'https://www.cambridge.org/core/journals/international-and-comparative-law-quarterly/article/artificial-intelligence-and-the-limits-of-legal-personality/1859C6E12F75046309C60C150AB31A29'
    },
    {
      id:'santoni-vandenhoven-control', order:52, thinker:'필리포 산토니 데 시오·예룬 판 덴 호벤', en:'Filippo Santoni de Sio & Jeroen van den Hoven', period:'현대', priority:'최핵심',
      axes:['책임·귀속','AI·신기술'], keywords:['meaningful human control','tracking','tracing','responsibility gap'],
      thesis:'자율시스템의 높은 자율성과 인간책임은 양립할 수 있으며, 의미 있는 인간통제는 시스템이 인간의 관련 도덕적 이유에 반응하는 tracking 조건과 결과를 적어도 한 명의 인간에게 추적할 수 있는 tracing 조건을 요구한다.',
      concepts:['meaningful human control','tracking condition','tracing condition','책임가능한 설계'],
      relevance:['다중 에이전트 시스템에서 단순한 human-in-the-loop 형식보다 각 설계·통합·배치·운용 단계의 실질적 통제와 추적가능성을 책임귀속 요건으로 검토하게 한다.','로그·권한·개입가능성·책임관리인을 기술적 통제장치와 법적 귀속구조 사이의 연결점으로 설계하는 데 직접 연결된다.'],
      works:['Meaningful Human Control over Autonomous Systems: A Philosophical Account'],
      sourceLabel:'Frontiers — Meaningful Human Control over Autonomous Systems', sourceUrl:'https://www.frontiersin.org/journals/robotics-and-ai/articles/10.3389/frobt.2018.00015/full'
    },
    {
      id:'nyholm-responsibility-loci', order:53, thinker:'스벤 뉘홀름', en:'Sven Nyholm', period:'현대', priority:'핵심필수',
      axes:['책임·귀속','AI·신기술'], keywords:['human-robot collaboration','responsibility-loci','agency','responsibility gap'],
      thesis:'현재의 자동화시스템에 상당한 행위성을 인정할 수 있더라도 인간과 독립된 행위자로 보는 것은 부정확하며, 인간이 시작·감독·관리하는 인간-기계 협업구조 안에서 책임의 위치를 찾아야 한다.',
      concepts:['협업적 행위성','responsibility-loci','독립적 AI agency 비판','인간 감독과 관리'],
      relevance:['Agentic AI의 기술적 행위성을 인정하더라도 법적 책임주체성을 곧바로 인정하지 않고 설계자·통합자·배치자·운용자의 협업구조와 역할을 먼저 분석하는 근거가 된다.','다중 에이전트의 창발적 결과를 이유로 인간책임이 자동 소멸한다는 결론을 경계하게 한다.'],
      works:['Attributing Agency to Automated Systems: Reflections on Human–Robot Collaborations and Responsibility-Loci'],
      sourceLabel:'Springer — Attributing Agency to Automated Systems', sourceUrl:'https://link.springer.com/article/10.1007/s11948-017-9943-x'
    },
    {
      id:'isensee-protection-duty', order:54, thinker:'요제프 이젠제', en:'Josef Isensee', period:'현대', priority:'핵심필수',
      axes:['권리·청구권·기본권','헌법·비례성'], keywords:['방어권','국가의 보호의무','Schutzpflicht','기본권 기능'],
      thesis:'기본권은 국가의 침해를 막는 방어권으로 기능하는 동시에 일정한 상황에서는 기본권적 법익을 사적 위험으로부터 보호해야 할 국가의 의무와 연결될 수 있다.',
      concepts:['기본권의 방어기능','국가의 보호의무','자유보장과 보호개입의 긴장'],
      relevance:['고위험 AI로부터 생명·신체·개인정보·평등을 보호하기 위한 국가규제의 근거를 검토하는 동시에 그 규제가 기업·이용자의 자유권을 과도하게 침해하는지 함께 심사하는 틀을 제공한다.'],
      works:['The Fundamental Right as a Right of Defence and a State Duty to Protect'],
      sourceLabel:'Konrad Adenauer Stiftung — Right of Defence and State Duty to Protect', sourceUrl:'https://www.kas.de/en/web/rspno/fundamental-works-of-constitutional-law/detail/-/content/the-fundamental-right-as-a-right-of-defence-and-a-state-duty-to-protect'
    },
    {
      id:'grimm-fundamental-rights', order:55, thinker:'디터 그림', en:'Dieter Grimm', period:'현대', priority:'핵심필수',
      axes:['권리·청구권·기본권','헌법·비례성'], keywords:['defensive rights','objective principles','horizontal effect','state protection'],
      thesis:'기본권을 국가에 대한 소극적 방어권으로 이해하는 전통과 객관적 헌법원리로 이해하는 확장 사이에는 중요한 구조적 차이가 있으며, 객관적 이해는 수평적 효력과 국가의 적극적 보호의무를 확대한다.',
      concepts:['기본권 방어권','객관적 기본권 질서','수평효','국가 보호의무'],
      relevance:['AI 플랫폼이나 개발자의 사적 권력이 기본권 향유를 위협할 때 국가 보호개입의 가능성을 설명하면서도, 보호의무 논리가 무제한 규제권한으로 확대되지 않도록 두 기본권 기능의 차이를 유지하게 한다.'],
      works:['Return to the Traditional Understanding of Fundamental Rights?'],
      sourceLabel:'Oxford Academic — Return to the Traditional Understanding of Fundamental Rights?', sourceUrl:'https://academic.oup.com/book/5378/chapter-abstract/148192546'
    },
    {
      id:'johnson-moral-entities', order:56, thinker:'데버라 G. 존슨', en:'Deborah G. Johnson', period:'현대', priority:'최핵심',
      axes:['책임·귀속','AI·신기술'], keywords:['moral entities','moral agents','human intentionality','sociotechnical systems'],
      thesis:'컴퓨터시스템은 인간행위의 도덕적 구조에 중요한 구성요소이지만 독립된 도덕적 행위자는 아니며, 그 의미와 작동은 설계자·사용자의 의도와 사회기술적 맥락 속에서 이해해야 한다.',
      concepts:['도덕적 객체와 도덕적 행위자의 구별','인간 의도와 인공물의 결합','사회기술적 책임구조'],
      relevance:['AI가 자율적으로 작동한다는 기술적 설명을 곧바로 독립된 법적 책임주체성으로 연결하는 것을 비판하는 근거가 된다.','AI 시스템·설계자·이용자·조직의 결합구조 전체를 책임분석 대상으로 삼아야 한다는 점에서 다중주체 책임귀속과 직접 연결된다.'],
      works:['Computer Systems: Moral Entities but Not Moral Agents'],
      sourceLabel:'Springer/PhilPapers — Computer Systems: Moral Entities but Not Moral Agents', sourceUrl:'https://philpapers.org/rec/JOHCSM'
    }
  ];

  if (!Array.isArray(window.LEGAL_PHILOSOPHY)) window.LEGAL_PHILOSOPHY = [];
  const ids = new Set(window.LEGAL_PHILOSOPHY.map(item => item.id));
  additions.forEach(item => { if (!ids.has(item.id)) window.LEGAL_PHILOSOPHY.push(item); });
})();