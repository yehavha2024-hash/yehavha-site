(() => {
  'use strict';

  window.LEGAL_PHILOSOPHY_DISSERTATION_CITATION_META = Object.freeze({
    checked:'2026-08-09',
    count:12,
    status:'박사논문 투입 1차 확정',
    footnoteStyle:'국내 법학논문 영문문헌 각주 표준안',
    rule:'직접 인용은 원문·판본·페이지가 특정된 짧은 문구만 사용하고, 철학적 책임과 현행 민사법상 책임을 동일시하지 않는다.'
  });

  window.LEGAL_PHILOSOPHY_DISSERTATION_CITATIONS = [
    {
      key:'kurki-functional-personhood', itemId:'kurki', rank:'A1', axis:'법인격', role:'분석틀의 핵심 근거', verification:'원문·판본·페이지 확인',
      author:'Visa A.J. Kurki', title:'A Theory of Legal Personhood', edition:'Oxford University Press, 2019. Print ISBN 9780198844037.',
      pinpoint:'Introduction, p. 28; Ch. 3 “The Incidents of Legal Personhood,” pp. 91–126.',
      originalQuote:'one can be a legal person for some purposes without being a legal person for all purposes',
      quoteKo:'어떤 목적에서는 법적 사람일 수 있지만 모든 목적에서 법적 사람일 필요는 없다.',
      footnote:'Visa A.J. Kurki, A Theory of Legal Personhood, Oxford University Press, 2019, p. 28.',
      placement:'03 법인격 → 기능적 단위의 제한적 법적 지위. 전면적 AI 법인격을 주장하기 전에 법인격을 개별 incidents로 분해할 수 있다는 분석명제를 제시하는 문단.',
      draftSentence:'Kurki의 분석에 따르면 법인격은 전부 또는 전무의 단일 지위가 아니라 상호연결되면서도 분리 가능한 법적 incidents의 결합으로 파악할 수 있다. 따라서 기능적 단위에 필요한 소송·재산·책임 관련 지위를 개별적으로 설계할 수 있는지는 전면적 인격 인정과 분리하여 검토할 수 있다.',
      caution:'분해 가능성은 입법 필요성의 증명이 아니다. 기존 인간·법인 책임, 보험, 공탁, 책임재산으로 해결되지 않는 잔여문제를 먼저 특정한다.',
      url:'https://academic.oup.com/book/35026/chapter/298854871'
    },
    {
      key:'solum-possibility-question', itemId:'solum-ai-personhood', rank:'A2', axis:'법인격', role:'역사적 출발점·가능성 질문', verification:'원문 p.1231 확인',
      author:'Lawrence B. Solum', title:'Legal Personhood for Artificial Intelligences', edition:'North Carolina Law Review, Vol. 70, No. 4, 1992, pp. 1231–1287.',
      pinpoint:'p. 1231, opening paragraph.',
      originalQuote:'Could an artificial intelligence become a legal person?',
      quoteKo:'인공지능은 법적 사람이 될 수 있는가?',
      footnote:'Lawrence B. Solum, “Legal Personhood for Artificial Intelligences,” North Carolina Law Review, Vol. 70, No. 4 (1992), p. 1231.',
      placement:'03 법인격 → AI 법인격 논쟁의 선행연구. 가능성·능력·구체적 법적 역할을 질문하는 역사적 출발점으로 배치하고, 곧바로 필요성 논증으로 넘어가지 않는다.',
      draftSentence:'Solum의 고전적 문제제기는 AI 법인격을 기정사실화한 것이 아니라 인공지능이 특정한 법적 역할을 수행할 수 있는지를 법적 사고실험으로 검토한 것이다. 이 연구에서는 그 가능성 질문과 실제 제도적 필요성의 증명을 구별한다.',
      caution:'1992년 기술상황을 현재 Agentic AI의 능력에 그대로 적용하지 않는다. 법인격의 가능성과 규범적 필요성을 분리한다.',
      url:'https://scholarship.law.unc.edu/nclr/vol70/iss4/4/'
    },
    {
      key:'chesterman-limits', itemId:'chesterman-personality', rank:'A3', axis:'법인격', role:'필요성 입증의 반대논거', verification:'공식 OA 원문·권호·페이지 확인',
      author:'Simon Chesterman', title:'Artificial Intelligence and the Limits of Legal Personality', edition:'International & Comparative Law Quarterly, Vol. 69, No. 4, 2020, pp. 819–844.',
      pinpoint:'p. 819, Abstract; DOI 10.1017/S0020589320000366.',
      originalQuote:'such arguments are insufficient to show that they should',
      quoteKo:'그러한 논거만으로는 실제로 그렇게 해야 한다는 점이 충분히 입증되지 않는다.',
      footnote:'Simon Chesterman, “Artificial Intelligence and the Limits of Legal Personality,” International & Comparative Law Quarterly, Vol. 69, No. 4 (2020), p. 819.',
      placement:'03 법인격 → 가능성과 정당화의 구별. 기능적 법적 지위를 제안하는 절의 반대논증으로 먼저 제시한 뒤 잔여영역·보충성 요건을 도출한다.',
      draftSentence:'AI를 위한 새로운 법적 인격범주를 구성할 법기술적 가능성이 존재한다는 사정만으로 그 제도의 정당성이 입증되는 것은 아니다. 따라서 제한적 법적 지위의 도입은 구체적 기능과 피해회복상 필요성을 별도로 증명해야 한다.',
      caution:'Chesterman을 법인격의 절대적 불가능론으로 분류하지 않는다. 핵심은 가능성과 정당화, 그리고 책임이전 위험의 구별이다.',
      url:'https://www.cambridge.org/core/journals/international-and-comparative-law-quarterly/article/artificial-intelligence-and-the-limits-of-legal-personality/1859C6E12F75046309C60C150AB31A29'
    },
    {
      key:'bryson-synthetic-warning', itemId:'bryson-synthetic-persons', rank:'A4', axis:'법인격', role:'전면적 법인격 부여의 직접 반대축', verification:'공식 OA 원문·페이지 확인',
      author:'Joanna J. Bryson, Mihailis E. Diamantis & Thomas D. Grant', title:'Of, for, and by the people: the legal lacuna of synthetic persons', edition:'Artificial Intelligence and Law, Vol. 25, 2017, pp. 273–291.',
      pinpoint:'p. 273, Abstract; DOI 10.1007/s10506-017-9214-9.',
      originalQuote:'such legislative action would be morally unnecessary and legally troublesome',
      quoteKo:'그러한 입법조치는 도덕적으로 불필요하고 법적으로 문제를 일으킬 수 있다.',
      footnote:'Joanna J. Bryson, Mihailis E. Diamantis & Thomas D. Grant, “Of, for, and by the people: the legal lacuna of synthetic persons,” Artificial Intelligence and Law, Vol. 25 (2017), p. 273.',
      placement:'03 법인격 → 법인격 부정론 vs 기능적 법인격론. 전면적 synthetic personhood의 부작용을 제시하여 제한적 지위가 기존 책임주체의 책임회피 수단이 되어서는 안 된다는 한계선을 설정한다.',
      draftSentence:'합성적 법인격의 법적 구성 가능성에도 불구하고 그 지위가 인간 책임을 희석하거나 법적 의제를 남용하는 통로가 될 위험은 별도로 통제되어야 한다. 이에 따라 기능적 법적 지위는 인간·법인의 기존 책임을 대체하지 않는 범위에서만 검토되어야 한다.',
      caution:'논문에서는 전면적 합성적 법인격 비판과 특정 소송지위·책임재산 같은 제한적 incidents의 가능성을 구별한다.',
      url:'https://link.springer.com/article/10.1007/s10506-017-9214-9'
    },
    {
      key:'matthias-gap', itemId:'matthias-responsibility-gap', rank:'A5', axis:'책임귀속', role:'책임공백 문제의 고전적 제기', verification:'서지·초록·p.175 확인',
      author:'Andreas Matthias', title:'The Responsibility Gap: Ascribing Responsibility for the Actions of Learning Automata', edition:'Ethics and Information Technology, Vol. 6, No. 3, 2004, pp. 175–183.',
      pinpoint:'p. 175, Abstract; DOI 10.1007/s10676-004-3422-1.',
      originalQuote:'a responsibility gap, which cannot be bridged by traditional concepts of responsibility ascription',
      quoteKo:'전통적 책임귀속 개념으로 메울 수 없는 책임공백.',
      footnote:'Andreas Matthias, “The Responsibility Gap: Ascribing Responsibility for the Actions of Learning Automata,” Ethics and Information Technology, Vol. 6, No. 3 (2004), p. 175.',
      placement:'02 책임귀속 → Agentic AI·다중 에이전트의 창발적 손해가 기존 예견·통제 중심 책임론에 제기하는 난점을 설명하는 문제제기 문단.',
      draftSentence:'Matthias의 책임공백론은 학습시스템의 예측·통제 한계가 전통적 책임귀속 관념에 긴장을 발생시킬 수 있음을 보여준다. 다만 이 철학적 난점은 곧바로 현행 민사법상 무책임의 결론을 뜻하지 않는다.',
      caution:'moral responsibility gap과 civil liability gap을 동일시하지 않는다. 과실책임 외의 무과실책임·조직책임·증명위험·보험 가능성을 별도로 검토한다.',
      url:'https://commons.ln.edu.hk/sw_master/759/'
    },
    {
      key:'santoni-tracing', itemId:'santoni-vandenhoven-control', rank:'A6', axis:'책임귀속', role:'인간통제·추적가능성의 연결근거', verification:'공식 PDF 인쇄면 p.9 직접 확인',
      author:'Filippo Santoni de Sio & Jeroen van den Hoven', title:'Meaningful Human Control over Autonomous Systems: A Philosophical Account', edition:'Frontiers in Robotics and AI, Vol. 5, Article 15, 2018.',
      pinpoint:'p. 9, “Second necessary condition of meaningful human control”; DOI 10.3389/frobt.2018.00015.',
      originalQuote:'there is at least one human agent in the design history or use context',
      quoteKo:'설계 이력이나 사용 맥락에는 적어도 한 명의 인간 행위자가 존재해야 한다.',
      footnote:'Filippo Santoni de Sio & Jeroen van den Hoven, “Meaningful Human Control over Autonomous Systems: A Philosophical Account,” Frontiers in Robotics and AI, Vol. 5, Art. 15 (2018), p. 9.',
      placement:'02 책임귀속·06 AI 규범설계 → 설계·통합·배치·운용의 계층별 통제와 로그·권한·개입가능성을 책임귀속 요소로 연결하는 문단.',
      draftSentence:'의미 있는 인간통제는 단순한 human-in-the-loop의 존재가 아니라 시스템이 관련 인간의 이유에 반응하고 결과를 설계·운용 사슬의 인간에게 추적할 수 있는 구조를 요구한다. 이는 다중 에이전트 시스템에서 권한·로그·승인·개입가능성을 계층별 책임귀속과 연결하는 규범적 기준으로 활용할 수 있다.',
      caution:'tracking·tracing은 민사법상 과실이나 인과관계의 법정요건 그 자체가 아니다. 실정법상 의무와 연결하는 별도 논증이 필요하다.',
      url:'https://www.frontiersin.org/journals/robotics-and-ai/articles/10.3389/frobt.2018.00015/full'
    },
    {
      key:'nyholm-collaboration', itemId:'nyholm-responsibility-loci', rank:'A7', axis:'책임귀속', role:'독립적 AI agency 추론의 반대축', verification:'공식 OA 원문·p.1201 확인',
      author:'Sven Nyholm', title:'Attributing Agency to Automated Systems: Reflections on Human–Robot Collaborations and Responsibility-Loci', edition:'Science and Engineering Ethics, Vol. 24, No. 4, 2018, pp. 1201–1219.',
      pinpoint:'p. 1201, Abstract; DOI 10.1007/s11948-017-9943-x.',
      originalQuote:'we ought not to regard them as acting on their own',
      quoteKo:'그 시스템들이 인간과 독립하여 스스로 행위한다고 보아서는 안 된다.',
      footnote:'Sven Nyholm, “Attributing Agency to Automated Systems: Reflections on Human–Robot Collaborations and Responsibility-Loci,” Science and Engineering Ethics, Vol. 24, No. 4 (2018), p. 1201.',
      placement:'02 책임귀속·대립학설 04 → 기술적 행위성을 인정하더라도 설계자·통합자·배치자·운용자의 협업구조에서 책임 위치를 우선 탐색해야 한다는 논증.',
      draftSentence:'자동화시스템에 일정한 기술적 행위성을 인정하는 것과 그 시스템을 인간과 독립된 책임주체로 보는 것은 별개의 문제이다. 현 단계에서는 인간-기계 협업구조 속에서 누가 시스템의 행위를 시작·감독·관리했는지를 복원하는 것이 책임분석의 선행단계가 된다.',
      caution:'Nyholm의 논의는 도덕철학적 agency 분석이다. 현행법상 사용자·사업자 책임을 자동 확정하는 근거로 사용하지 않는다.',
      url:'https://link.springer.com/article/10.1007/s11948-017-9943-x'
    },
    {
      key:'johnson-no-moral-agent', itemId:'johnson-moral-entities', rank:'A8', axis:'AI agency', role:'도덕적 중요성과 독립행위자성의 구별', verification:'서지·초록·p.195 확인',
      author:'Deborah G. Johnson', title:'Computer systems: Moral entities but not moral agents', edition:'Ethics and Information Technology, Vol. 8, No. 4, 2006, pp. 195–204.',
      pinpoint:'p. 195, Abstract; DOI 10.1007/s10676-006-9111-5.',
      originalQuote:'Computer systems do not have mental states',
      quoteKo:'컴퓨터 시스템은 정신상태를 가지지 않는다.',
      footnote:'Deborah G. Johnson, “Computer systems: Moral entities but not moral agents,” Ethics and Information Technology, Vol. 8, No. 4 (2006), p. 195.',
      placement:'대립학설 04 AI agency와 법적 책임주체의 분리 → AI의 도덕적 중요성을 인정하면서도 독립적 책임주체성으로의 비약을 차단하는 문단.',
      draftSentence:'컴퓨터시스템이 인간행위의 도덕적 구조에 중요한 구성요소라는 점과 그것이 독립된 도덕행위자라는 주장은 구별되어야 한다. 이 구별은 기술적 자율성을 곧바로 독립적 법적 책임주체성으로 번역하지 않는 근거가 된다.',
      caution:'moral agent와 legal person은 서로 다른 개념이다. Johnson의 주장을 AI 법인격의 법적 불가능성 논증으로 과도하게 확장하지 않는다.',
      url:'https://doi.org/10.1007/s10676-006-9111-5'
    },
    {
      key:'kiener-abundance', itemId:'matthias-responsibility-gap', rank:'A9', axis:'책임귀속', role:'책임공백론의 최신 직접 반론', verification:'공식 OA 원문·p.357 확인',
      author:'Maximilian Kiener', title:'AI and Responsibility: No Gap, but Abundance', edition:'Journal of Applied Philosophy, Vol. 42, No. 1, 2025, pp. 357–374. First published online 12 September 2024.',
      pinpoint:'p. 357, Abstract; DOI 10.1111/japp.12765.',
      originalQuote:'there is responsibility abundance',
      quoteKo:'책임공백이 아니라 다수 행위자에게 책임이 존재하는 책임의 다수성이 있다.',
      footnote:'Maximilian Kiener, “AI and Responsibility: No Gap, but Abundance,” Journal of Applied Philosophy, Vol. 42, No. 1 (2025), p. 357.',
      placement:'02 책임귀속·대립학설 02 → Matthias 직후 배치. 창발적 손해를 무책임의 공백보다 다수 개발·통합·배치·운용 주체 사이의 책임분산·배분 문제로 재구성하는 문단.',
      draftSentence:'책임공백론과 달리 Kiener는 AI 손해의 핵심 난점을 책임의 부재가 아니라 다수 행위자에게 책임이 겹쳐 존재하는 상황으로 재구성한다. 이 관점은 다중 에이전트 환경에서 책임귀속을 단일 주체 탐색이 아니라 역할별 의무·인과기여·통제의 계층적 배분 문제로 전환하는 데 유용하다.',
      caution:'Kiener의 strict moral answerability는 민사법상 법적 책임과 동일하지 않다. 다만 역할별 의무와 다수 책임주체 분석의 철학적 반대축으로 사용한다.',
      url:'https://onlinelibrary.wiley.com/doi/10.1111/japp.12765'
    },
    {
      key:'fletcher-nonreciprocal-risk', itemId:'fletcher-reciprocity', rank:'A10', axis:'책임귀속', role:'위험비대칭에 따른 책임강화의 보조근거', verification:'Harvard Law Review 원문 p.542 확인',
      author:'George P. Fletcher', title:'Fairness and Utility in Tort Theory', edition:'Harvard Law Review, Vol. 85, No. 3, 1972, pp. 537–573.',
      pinpoint:'p. 542, reciprocity paradigm.',
      originalQuote:'for injuries resulting from nonreciprocal risks',
      quoteKo:'비상호적 위험으로 인한 손해에 대하여.',
      footnote:'George P. Fletcher, “Fairness and Utility in Tort Theory,” Harvard Law Review, Vol. 85, No. 3 (1972), p. 542.',
      placement:'02 책임귀속 → 고위험 AI의 위험창출·위험부담. 일반 이용자가 상호적으로 부담하지 않는 비대칭적 위험을 사업자가 창출한 경우 책임강화의 규범적 보조근거를 검토하는 문단.',
      draftSentence:'고위험 AI의 배치가 일반적 사회활동에서 상호적으로 부담하는 수준을 넘어 특정 집단에게 비상호적 위험을 집중시키는 경우에는 위험의 비대칭성이 책임강화의 규범적 보조근거가 될 수 있다.',
      caution:'Fletcher의 reciprocity는 현행 민법상 무과실책임 요건이 아니다. 위험등급과 책임강도를 연결하는 입법론·정당화 논증에 제한적으로 사용한다.',
      url:'https://scholarship.law.columbia.edu/faculty_scholarship/1024/'
    },
    {
      key:'barak-balancing', itemId:'barak', rank:'A11', axis:'기본권', role:'AI 규제의 비례성 심사구조', verification:'Cambridge 공식 판본 Ch.12 pp.340–370 확인',
      author:'Aharon Barak', title:'Proportionality: Constitutional Rights and their Limitations', edition:'Cambridge University Press, 2012. Print ISBN 9781107008588.',
      pinpoint:'Ch. 12 “Proportionality stricto sensu (balancing),” pp. 340–370, especially p. 340.',
      originalQuote:'The last test of proportionality is the “proportional result,” or “proportionality stricto sensu”',
      quoteKo:'비례성의 마지막 심사는 비례적 결과, 즉 협의의 비례성이다.',
      footnote:'Aharon Barak, Proportionality: Constitutional Rights and their Limitations, Cambridge University Press, 2012, p. 340.',
      placement:'04 기본권·06 AI 규범설계 → 로그보존·설명의무·데이터 접근·책임추정 등 AI 규제가 기본권을 제한할 때 목적·관련성·필요성·협의의 비례성을 단계적으로 심사하는 문단.',
      draftSentence:'AI 위험으로부터의 보호필요성이 인정되더라도 그 규제수단이 기본권을 제한하는 경우에는 정당한 목적과 수단의 관련성, 덜 침해적인 대안의 존재, 그리고 규제로 얻는 편익과 기본권 침해 사이의 균형을 단계적으로 검토해야 한다.',
      caution:'비례성론을 민사책임 성립요건의 직접 판단공식으로 사용하지 않는다. 국가의 규제·입법 및 기본권 제한 정당화 단계에서 사용한다.',
      url:'https://www.cambridge.org/core/books/abs/proportionality/proportionality-stricto-sensu-balancing/F487166FA283954695420785FE066F44'
    },
    {
      key:'floridi-sanders-separation', itemId:'floridi-sanders-distributed', rank:'A12', axis:'AI agency', role:'agency와 responsibility의 개념적 분리', verification:'권호·페이지·초록 확인',
      author:'Luciano Floridi & J.W. Sanders', title:'On the Morality of Artificial Agents', edition:'Minds and Machines, Vol. 14, No. 3, 2004, pp. 349–379.',
      pinpoint:'p. 349, Abstract; DOI 10.1023/B:MIND.0000035461.63578.9d.',
      originalQuote:'separate the concerns of morality and responsibility of agents',
      quoteKo:'행위자의 도덕성과 책임 문제를 분리하여 다룬다.',
      footnote:'Luciano Floridi & J.W. Sanders, “On the Morality of Artificial Agents,” Minds and Machines, Vol. 14, No. 3 (2004), p. 349.',
      placement:'대립학설 04 AI agency와 법적 책임주체의 분리 → 기능적·철학적 agency 개념을 소개한 뒤 그것이 법적 책임주체성으로 자동 전환되지 않는다는 구별을 세우는 문단.',
      draftSentence:'인공적 행위성을 기능적으로 분석할 수 있다는 입장은 agency와 responsibility를 분리하여 다룰 수 있음을 보여준다. 따라서 다중 에이전트 시스템을 기술적 행위단위로 분석하는 것과 그 시스템 자체에 법적 책임을 귀속하는 것은 별도의 규범적 판단이다.',
      caution:'Floridi와 Sanders의 artificial moral agency는 현행법상 법인격이나 민사책임주체성을 의미하지 않는다. 기술적·도덕철학적 agency 분석에 한정한다.',
      url:'https://doi.org/10.1023/B:MIND.0000035461.63578.9d'
    }
  ];
})();
