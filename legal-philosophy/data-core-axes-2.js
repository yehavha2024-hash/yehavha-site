(() => {
  const additions = [
    {
      id:'dewey-personhood', order:33, thinker:'존 듀이', en:'John Dewey', period:'20세기', priority:'핵심필수',
      axes:['법인격·법적 주체','법의 본질·정당성'], keywords:['corporate personality','legal person','functional personhood'],
      thesis:'법에서 말하는 사람은 생물학적 인간과 동일한 개념이 아니라 법적 목적에 따라 권리·의무를 배치하기 위해 구성되는 제도적 개념으로 분석될 수 있다.',
      concepts:['법인격 이론을 실재설·의제설의 존재론 논쟁만으로 처리하지 않고 법이 어떤 기능을 수행하려는지 묻는다.','법적 person 개념은 다양한 조직과 제도에 적용되는 법기술적 장치라는 점을 강조한다.'],
      relevance:['AI 기능단위에 제한적 지위를 부여할지 판단할 때 “AI가 인간과 같은 존재인가”보다 어떤 법적 기능이 필요한가를 먼저 검토하게 한다.','책임재산·소송지위·등록·공시 같은 기능을 전면적 인격과 분리하는 논거로 사용할 수 있다.'],
      works:['The Historic Background of Corporate Legal Personality']
    },
    {
      id:'teubner-nonhumans', order:34, thinker:'군터 토이브너', en:'Gunther Teubner', period:'현대', priority:'최핵심',
      axes:['법인격·법적 주체','AI·신기술'], keywords:['electronic agents','non-human actors','personification','attribution'],
      thesis:'비인간 행위자를 법적으로 personify하는 문제는 인간과 동일한 존재임을 선언하는 것이 아니라 복잡한 상호작용에서 행위·귀속·기대구조를 조직하는 법적 전략으로 볼 수 있다.',
      concepts:['전자적 에이전트와 비인간 행위자','행위귀속과 personification','사회적 상호작용의 법적 구성'],
      relevance:['다중 AI 에이전트의 상호작용을 단순한 기계적 인과관계로만 설명하기 어려운 경우 어떤 단위를 법적 행위귀속의 대상으로 볼지 검토하게 한다.','법적 지위를 책임회피 수단이 아니라 귀속·통제·구제의 제도적 장치로 설계해야 한다는 점을 강조한다.'],
      works:['Rights of Non-humans? Electronic Agents and Animals as New Actors in Politics and Law'],
      sourceLabel:'Wiley — Rights of Non-humans?', sourceUrl:'https://onlinelibrary.wiley.com/doi/full/10.1111/j.1467-6478.2006.00368.x'
    },
    {
      id:'naffine-law-persons', order:35, thinker:'네어 나핀', en:'Ngaire Naffine', period:'현대', priority:'핵심필수',
      axes:['법인격·법적 주체','권리·청구권·기본권'], keywords:['law’s persons','legal subject','humanity','personhood'],
      thesis:'법적 사람이라는 범주는 자연적·도덕적 인간성의 단순한 반영이 아니라 법이 누구를 권리·의무의 중심으로 구성하는지에 관한 규범적 선택이다.',
      concepts:['법적 사람과 인간의 관계','권리주체 구성의 규범성','법인격 개념의 경계'],
      relevance:['AI 법적 지위 논쟁에서 인간의 존엄과 법기술적 권리주체성을 혼동하지 않도록 개념을 분리하는 데 유용하다.','자연인에게 보장되는 비양도적 기본권과 기능적 법인격에 부여되는 제한적 incidents를 구별하는 논거가 된다.'],
      works:['Law’s Meaning of Life: Philosophy, Religion, Darwin and the Legal Person']
    },
    {
      id:'solum-ai-personhood', order:36, thinker:'로런스 B. 솔럼', en:'Lawrence B. Solum', period:'현대', priority:'최핵심',
      axes:['법인격·법적 주체','AI·신기술','권리·청구권·기본권'], keywords:['AI legal personhood','legal capacity','rights and duties','artificial intelligence'],
      thesis:'인공지능의 법인격 문제는 추상적 찬반보다 어떤 능력과 법적 관계가 권리·의무의 귀속을 정당화할 수 있는지를 구체적으로 검토해야 하는 문제이다.',
      concepts:['인공지능 법인격의 가능조건','권리와 의무의 상호관계','법적 능력의 단계적 검토'],
      relevance:['AI에 전면적 법인격을 선제적으로 부여하기보다 계약·소송·재산·책임 등 개별 법적 능력을 항목별로 심사하는 틀을 제공한다.','기능적 단위의 제한적 법적 지위를 최종적 보충수단으로 검토할 때 직접적인 선행논의가 된다.'],
      works:['Legal Personhood for Artificial Intelligences'],
      sourceLabel:'SSRN — Legal Personhood for Artificial Intelligences', sourceUrl:'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1108671'
    },
    {
      id:'hesse-concordance', order:37, thinker:'콘라트 헤세', en:'Konrad Hesse', period:'20세기', priority:'최핵심',
      axes:['헌법·비례성','권리·청구권·기본권'], keywords:['praktische Konkordanz','실제적 조화','기본권 충돌','헌법해석'],
      thesis:'충돌하는 헌법적 가치와 기본권 가운데 하나를 전면 희생시키기보다 각각이 가능한 범위에서 최적의 효력을 가지도록 조화시키는 해석이 필요하다.',
      concepts:['실제적 조화의 원칙','기본권 충돌','헌법규범의 상호최적화'],
      relevance:['AI 안전·혁신·영업비밀과 개인정보·표현의 자유·재산권·절차적 권리가 충돌할 때 단순 우선순위가 아닌 조화적 해결을 구성하는 데 중요하다.','설명가능성 요구와 기업 비밀보호 사이의 제도설계에도 직접 사용할 수 있다.'],
      works:['Grundzüge des Verfassungsrechts der Bundesrepublik Deutschland'],
      sourceLabel:'연구자료 — Konrad Hesse와 실제적 조화', sourceUrl:'https://www.portaldeperiodicos.idp.edu.br/direitopublico/article/view/5854'
    },
    {
      id:'boeckenfoerde-rights', order:38, thinker:'에른스트-볼프강 뵈켄푀르데', en:'Ernst-Wolfgang Böckenförde', period:'20~21세기', priority:'핵심필수',
      axes:['헌법·비례성','권리·청구권·기본권'], keywords:['방어권','객관적 기본권 원칙','자유','국가의 보호'],
      thesis:'기본권은 국가권력을 제한하는 개인의 자유보장이라는 성격을 중심에 두면서도 사회적 권력관계 속에서 그 자유가 실질적으로 가능하도록 하는 국가의 역할을 함께 검토해야 한다.',
      concepts:['기본권의 방어권적 기능','객관적 원칙화의 한계','자유의 사회적 전제'],
      relevance:['AI 규제를 이유로 국가의 보호의무를 확대하더라도 개인의 자유영역을 과도하게 국가정책의 수단으로 전환하지 않도록 경계하게 한다.','플랫폼·AI 기업의 사실상 권력이 개인의 기본권 향유를 약화시키는 경우 국가의 보호개입 근거도 함께 검토할 수 있다.'],
      works:['Fundamental Rights as Constitutional Principles','Constitutional and Political Theory: Selected Writings'],
      sourceLabel:'Oxford Academic — Fundamental Rights as Constitutional Principles', sourceUrl:'https://academic.oup.com/book/5358/chapter-abstract/148153633'
    },
    {
      id:'haeberle-open-society', order:39, thinker:'페터 헤벌레', en:'Peter Häberle', period:'현대', priority:'심화',
      axes:['헌법·비례성','해석·논증'], keywords:['열린 헌법해석사회','헌법해석','다원주의','공론'],
      thesis:'헌법해석은 법원과 국가기관만의 폐쇄적 작업이 아니라 시민·학계·사회집단 등 다양한 해석주체가 참여하는 개방적 과정으로 이해할 수 있다.',
      concepts:['열린 헌법해석사회','다원적 해석주체','헌법문화'],
      relevance:['AI 규범을 기술기업이나 행정기관의 전문판단에만 맡기지 않고 이용자·피해자·학계·시민사회의 참여를 제도화해야 하는 이유를 제공한다.','고위험 AI 규제에서 공론·영향평가·이해관계자 참여 절차를 정당화하는 데 연결된다.'],
      works:['Die offene Gesellschaft der Verfassungsinterpreten']
    },
    {
      id:'duerig-dignity', order:40, thinker:'귄터 뒤리히', en:'Günter Dürig', period:'20세기', priority:'핵심필수',
      axes:['권리·청구권·기본권','헌법·비례성','AI·신기술'], keywords:['인간존엄','객체공식','주체성','수단화 금지'],
      thesis:'국가가 인간을 단순한 객체나 수단으로 취급하여 주체적 지위를 근본적으로 부정할 때 인간존엄 문제가 발생한다는 사고는 현대 독일 기본권론의 중요한 논증도구가 되었다.',
      concepts:['인간존엄과 객체화','주체로서의 인간','국가에 의한 수단화의 한계'],
      relevance:['자동화된 행정·채용·신용평가가 개인을 설명과 이의제기 가능성이 없는 단순 데이터 객체로 취급하는지 검토할 때 중요하다.','AI에게 기능적 지위를 부여하는 경우에도 인간의 존엄과 도덕적 인격을 동일선상에서 상대화해서는 안 된다는 경계선이 된다.'],
      works:['Der Grundrechtssatz von der Menschenwürde']
    },
    {
      id:'honore-outcome-responsibility', order:41, thinker:'토니 오노레', en:'Tony Honoré', period:'현대', priority:'핵심필수',
      axes:['책임·귀속','정의·분배'], keywords:['outcome responsibility','인과관계','책임','결과귀속'],
      thesis:'책임은 비난가능성만으로 구성되지 않으며 사람이 자신의 행위와 그 결과를 일정 범위에서 부담하는 결과책임의 구조도 법적 책임관행의 중요한 부분이다.',
      concepts:['outcome responsibility','행위와 결과의 귀속','인과관계와 책임의 구별'],
      relevance:['AI 손해에서 인간 주체의 구체적 과실이 약하더라도 배치·운용·위험인수라는 역할에 근거하여 일정 결과를 부담시킬 수 있는지 검토하게 한다.','무과실책임과 과실책임 사이의 규범적 차이를 분석하는 데 유용하다.'],
      works:['Responsibility and Fault','Causation in the Law']
    },
    {
      id:'coleman-corrective-justice', order:42, thinker:'줄스 콜먼', en:'Jules L. Coleman', period:'현대', priority:'핵심필수',
      axes:['책임·귀속','정의·분배'], keywords:['corrective justice','tort theory','wrongful loss','private law'],
      thesis:'불법행위 책임은 단순한 사회적 비용최소화가 아니라 잘못과 손실 사이의 규범적 관계를 교정하는 정의의 문제로 분석할 수 있다.',
      concepts:['교정적 정의','부당한 손실의 교정','불법행위법의 규범적 구조'],
      relevance:['AI 피해자 구제에서 보험이나 사회적 분산만으로는 설명되지 않는 “왜 이 피고가 이 원고에게 배상해야 하는가”를 묻는 기준이 된다.','효율성 중심의 칼라브레시 접근과 교정적 정의를 비교하는 데 유용하다.'],
      works:['Risks and Wrongs']
    },
    {
      id:'ripstein-private-wrong', order:43, thinker:'아서 립스타인', en:'Arthur Ripstein', period:'현대', priority:'심화',
      axes:['책임·귀속','권리·청구권·기본권'], keywords:['private wrong','freedom','tort law','relational justice'],
      thesis:'사법상 잘못은 한 사람의 자유가 다른 사람의 동등한 자유를 침해하는 관계적 문제로 이해할 수 있으며 손해배상은 그 관계를 바로잡는 제도이다.',
      concepts:['사적 잘못','동등한 자유','관계적 책임'],
      relevance:['AI 손해에서 단순한 통계적 위험 증가와 특정 피해자에 대한 법적 wrong을 구별하는 데 도움이 된다.','피해자와 책임주체 사이의 직접적 법적 관계를 중심으로 책임귀속을 구성하는 데 사용한다.'],
      works:['Private Wrongs']
    },
    {
      id:'fletcher-reciprocity', order:44, thinker:'조지 P. 플레처', en:'George P. Fletcher', period:'현대', priority:'심화',
      axes:['책임·귀속','정의·분배'], keywords:['reciprocity of risk','비상호적 위험','strict liability','tort'],
      thesis:'일상적이고 상호적인 위험과 달리 한 당사자가 타인에게 비정상적·비상호적 위험을 부과한 경우 보다 강한 책임을 정당화할 수 있다는 관점을 제시한다.',
      concepts:['위험의 상호성','비상호적 위험','무과실책임의 정당화'],
      relevance:['고위험 AI를 배치한 사업자가 일반 이용자에게 통상적 사회생활에서 감수하지 않는 비대칭적 위험을 전가하는 경우 책임강화 논거로 검토할 수 있다.','AI 위험등급과 책임강도의 연동 가능성을 철학적으로 검토하는 데 도움이 된다.'],
      works:['Fairness and Utility in Tort Theory']
    },
    {
      id:'matthias-responsibility-gap', order:45, thinker:'안드레아스 마티아스', en:'Andreas Matthias', period:'현대', priority:'최핵심',
      axes:['AI·신기술','책임·귀속'], keywords:['responsibility gap','learning automata','예측불가능성','통제'],
      thesis:'학습하고 자율적으로 작동하는 시스템의 행위를 제조자나 운용자가 합리적으로 예측·통제하기 어려워질 때 전통적 책임귀속 기준과 실제 결과 사이에 책임공백이 발생할 수 있다.',
      concepts:['responsibility gap','학습 시스템의 예측불가능성','인간 통제의 한계'],
      relevance:['에이전틱 AI와 다중 에이전트 시스템에서 창발적 손해가 발생했을 때 기존 과실책임이 어디서 약화되는지 분석하는 직접적인 출발점이다.','다만 책임공백을 곧바로 AI 법인격으로 메우지 않고 증명위험·보험·책임재산·인간주체의 통제가능성 조정부터 검토하게 한다.'],
      works:['The Responsibility Gap: Ascribing Responsibility for the Actions of Learning Automata'],
      sourceLabel:'Ethics and Information Technology — Responsibility Gap', sourceUrl:'https://commons.ln.edu.hk/sw_master/759/'
    },
    {
      id:'floridi-sanders-distributed', order:46, thinker:'루치아노 플로리디·J. W. 샌더스', en:'Luciano Floridi & J. W. Sanders', period:'현대', priority:'핵심필수',
      axes:['AI·신기술','책임·귀속'], keywords:['distributed morality','artificial agents','moral action','distributed responsibility'],
      thesis:'복잡한 정보환경에서는 도덕적으로 중요한 행위가 단일 인간 행위자에게만 환원되지 않고 인간·소프트웨어·조직이 결합된 분산된 행위구조에서 발생할 수 있다.',
      concepts:['분산된 행위성','인공적 행위자','도덕적 행위와 도덕적 책임의 구별'],
      relevance:['다중 에이전트 시스템의 기술적 행위구조를 분석할 때 유용하지만 법적 책임은 별도로 인간·법인에게 규범적으로 귀속해야 한다는 구별을 명확히 할 수 있다.','기술적 agency와 법적 responsibility를 동일시하지 않는 연구틀을 강화한다.'],
      works:['On the Morality of Artificial Agents','Distributed Morality in an Information Society']
    },
    {
      id:'bryson-synthetic-persons', order:47, thinker:'조애나 브라이슨·미하일리스 디아만티스·토머스 그랜트', en:'Joanna J. Bryson, Mihailis E. Diamantis & Thomas D. Grant', period:'현대', priority:'최핵심',
      axes:['AI·신기술','법인격·법적 주체','책임·귀속'], keywords:['synthetic persons','legal lacuna','AI personhood','human accountability'],
      thesis:'순수한 인공적 시스템에 법인격을 부여하는 것은 법적으로 가능할 수 있지만 도덕적으로 필수적인 것은 아니며 책임회피와 법적 혼란을 초래할 위험도 크다는 비판적 입장이다.',
      concepts:['합성적 법인격의 위험','법적 의제의 남용','인간 책임의 유지'],
      relevance:['기능적 단위의 제한적 법적 지위를 검토할 때 전면적 AI 법인격을 기본해법으로 삼아서는 안 된다는 강력한 반대논거가 된다.','책임재산·보험·등록·관리인 같은 기존 제도를 먼저 검토해야 한다는 보충성 원칙을 강화한다.'],
      works:['Of, for, and by the People: The Legal Lacuna of Synthetic Persons'],
      sourceLabel:'Springer — Legal Lacuna of Synthetic Persons', sourceUrl:'https://doi.org/10.1007/s10506-017-9214-9'
    },
    {
      id:'chopra-white-agents', order:48, thinker:'사미르 초프라·로런스 F. 화이트', en:'Samir Chopra & Laurence F. White', period:'현대', priority:'최핵심',
      axes:['AI·신기술','법인격·법적 주체','책임·귀속'], keywords:['autonomous artificial agents','legal agency','contracts','torts'],
      thesis:'자율적 인공 에이전트의 법적 문제는 계약·대리·불법행위·법적 지위 등 기존 법영역과 연결하여 단계적으로 분석할 수 있으며 법적 agency와 personhood를 구별해 검토해야 한다.',
      concepts:['인공 에이전트의 법적 대리','계약과 불법행위','법적 agency와 personhood의 구별'],
      relevance:['AI가 계약·결제·전송을 수행할 때 그 행위효과를 누구에게 귀속할지 현재법의 대리·전자거래 구조와 연결할 수 있다.','새로운 법인격을 만들기 전에 기존 대리·계약·불법행위 규칙의 적용범위를 점검하는 연구순서에 부합한다.'],
      works:['A Legal Theory for Autonomous Artificial Agents'],
      sourceLabel:'University of Michigan Press — A Legal Theory for Autonomous Artificial Agents', sourceUrl:'https://press.umich.edu/Books/A/A-Legal-Theory-for-Autonomous-Artificial-Agents2'
    },
    {
      id:'pagallo-laws-robots', order:49, thinker:'우고 파갈로', en:'Ugo Pagallo', period:'현대', priority:'핵심필수',
      axes:['AI·신기술','책임·귀속','법인격·법적 주체'], keywords:['law of robots','agency','contracts','torts','accountability'],
      thesis:'로봇과 자율시스템은 어떤 경우에는 인간의 도구로, 다른 경우에는 법적 분석에서 독립된 행위단위처럼 다뤄질 수 있으므로 범죄·계약·불법행위별로 책임구조를 구체화해야 한다.',
      concepts:['로봇의 법적 agency','도구와 행위단위의 구별','계약·불법행위 책임'],
      relevance:['기술적 자율성이 증가했다고 해서 모든 영역에서 동일한 법적 지위를 인정하지 않고 법률관계별로 기능을 분리하는 데 도움이 된다.','에이전트의 권한범위·로그·대리효과·손해배상구조를 영역별로 설계할 수 있다.'],
      works:['The Laws of Robots: Crimes, Contracts, and Torts'],
      sourceLabel:'Springer — The Laws of Robots', sourceUrl:'https://link.springer.com/book/10.1007/978-94-007-6564-1'
    },
    {
      id:'gunkel-robot-rights', order:50, thinker:'데이비드 J. 건켈', en:'David J. Gunkel', period:'현대', priority:'심화',
      axes:['AI·신기술','권리·청구권·기본권','법인격·법적 주체'], keywords:['robot rights','relational ethics','moral status','otherness'],
      thesis:'로봇의 권리나 도덕적 지위를 내부의 의식·본질을 먼저 입증한 뒤 결정하는 방식만이 아니라 인간과 비인간 행위자의 관계와 사회적 상호작용에서 검토할 필요가 있다는 관계적 접근을 제시한다.',
      concepts:['로봇 권리 논쟁','관계적 윤리','도덕적 지위와 법적 지위의 구별'],
      relevance:['현재 AI에 인간과 같은 권리를 인정한다는 결론으로 사용하기보다 미래 AI의 사회적 관계성이 법적 지위 논의에 어떤 영향을 줄 수 있는지 반대가설로 검토하는 데 적합하다.','기능적 법적 지위와 도덕적 권리주체성을 명확히 구별하면서 장기적 법철학 논의를 확장한다.'],
      works:['Robot Rights','The Other Question: Can and Should Robots Have Rights?']
    }
  ];

  const base = Array.isArray(window.LEGAL_PHILOSOPHY) ? window.LEGAL_PHILOSOPHY : [];
  const existing = new Set(base.map(item => item.id));
  window.LEGAL_PHILOSOPHY = [...base, ...additions.filter(item => !existing.has(item.id))];
})();
