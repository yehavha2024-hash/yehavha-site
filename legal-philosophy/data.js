window.LEGAL_PHILOSOPHY = [
  {
    id:'aristotle', order:1, thinker:'아리스토텔레스', en:'Aristotle', period:'고대', priority:'기초필수',
    axes:['정의·분배','책임·귀속'], keywords:['분배적 정의','교정적 정의','형평'],
    thesis:'정의는 모든 사람에게 동일한 몫을 주는 것이 아니라 관계와 기준에 따라 정당한 몫을 배분하고, 잘못된 교환이나 침해는 교정하는 질서이다.',
    concepts:['분배적 정의는 명예·재화·부담의 배분 문제를 다룬다.','교정적 정의는 거래·침해에서 생긴 불균형을 바로잡는 논리로 사법적 책임론의 원형이 된다.','형평은 일반 규칙이 개별 사안에서 과도한 결과를 낳을 때 법의 목적에 맞게 보정하는 사고방식이다.'],
    relevance:['AI 손해의 외부적 책임과 내부적 구상·분담을 구별할 때 교정적 정의의 관점을 사용할 수 있다.','다수 개발·통합·배치·운용 주체 사이의 부담 배분을 단순 균등이 아니라 기여·통제·위험에 따라 정당화하는 출발점이 된다.'],
    works:['Nicomachean Ethics, Book V','Politics']
  },
  {
    id:'aquinas', order:2, thinker:'토마스 아퀴나스', en:'Thomas Aquinas', period:'중세', priority:'기초필수',
    axes:['법의 본질·정당성','권리·청구권·기본권'], keywords:['자연법','정당한 법','공공선'],
    thesis:'실정법은 단순히 제정되었다는 이유만으로 충분하지 않고 이성·공공선·정당한 권위라는 규범적 조건과 연결된다.',
    concepts:['자연법과 실정법의 관계','공공선과 법의 목적','극단적으로 부정의한 법의 규범적 결함'],
    relevance:['AI 규제나 책임특례가 형식적으로 적법하더라도 인간 존엄·평등·자유와 충돌하는 경우 정당성 문제를 별도로 검토하게 한다.','법적 지위 부여가 기술편의가 아니라 정당한 목적과 공공선에 의해 설명되어야 한다는 기준을 제공한다.'],
    works:['Summa Theologiae, Treatise on Law']
  },
  {
    id:'hobbes', order:3, thinker:'토머스 홉스', en:'Thomas Hobbes', period:'근대', priority:'기초필수',
    axes:['법의 본질·정당성','헌법·비례성'], keywords:['주권','사회계약','질서'],
    thesis:'법과 정치권위는 분산된 사적 힘을 통제하고 예측 가능한 질서를 만들기 위한 공적 권위의 문제와 연결된다.',
    concepts:['주권과 법의 권위','사회계약','안전과 질서의 우선성'],
    relevance:['자율적 AI 시스템에 대한 국가 규제의 근거와 안전확보 의무를 검토할 때 공적 권위의 정당화 문제를 제시한다.','다만 안전을 이유로 기본권 제한을 무제한 정당화할 수 없다는 후대 기본권 이론과 대비하여 읽어야 한다.'],
    works:['Leviathan']
  },
  {
    id:'locke', order:4, thinker:'존 로크', en:'John Locke', period:'근대', priority:'기초필수',
    axes:['권리·청구권·기본권','헌법·비례성'], keywords:['자연권','자유','재산','제한정부'],
    thesis:'개인은 국가 이전부터 일정한 자유와 권리를 가지며 정부의 정당성은 이러한 권리를 보호하는 데서 나온다.',
    concepts:['생명·자유·재산','동의와 제한정부','권리보호와 저항'],
    relevance:['AI 규율이 개인정보·표현의 자유·재산권·직업의 자유를 제한할 때 국가권력의 한계를 검토하는 기본 틀이 된다.','기본권을 국가가 임의로 부여하는 혜택이 아니라 권력행사를 제한하는 기준으로 이해하게 한다.'],
    works:['Two Treatises of Government']
  },
  {
    id:'bentham', order:5, thinker:'제러미 벤담', en:'Jeremy Bentham', period:'근대', priority:'기초필수',
    axes:['법의 본질·정당성','정의·분배'], keywords:['공리주의','법실증주의','효용'],
    thesis:'법과 제도는 추상적 권리 선언보다 사회적 효용과 실제 결과를 기준으로 평가할 수 있다.',
    concepts:['최대다수의 최대행복','법과 도덕의 분석적 구별','자연권 비판'],
    relevance:['AI 책임제도가 혁신비용·피해예방·보험가능성·행정비용을 어떻게 배분하는지 결과 중심으로 평가하는 데 유용하다.','그러나 소수자의 기본권을 전체 효용에 종속시킬 위험 때문에 Rawls·Dworkin과 대비해 사용해야 한다.'],
    works:['An Introduction to the Principles of Morals and Legislation']
  },
  {
    id:'mill', order:6, thinker:'존 스튜어트 밀', en:'John Stuart Mill', period:'근대', priority:'기초필수',
    axes:['권리·청구권·기본권','헌법·비례성'], keywords:['자유론','해악원칙','표현의 자유'],
    thesis:'개인의 자유에 대한 강제는 타인에 대한 해악을 방지하기 위한 경우에 정당화될 수 있다는 자유주의적 제한원리를 제시한다.',
    concepts:['해악원칙','표현의 자유','개성의 발전'],
    relevance:['생성형 AI·에이전트 사용의 자유를 어디까지 허용하고 어떤 위험에서 규제할지 판단하는 기준이 된다.','단순한 불쾌감이나 추상적 위험과 구체적 타인 피해를 구별하는 데 활용할 수 있다.'],
    works:['On Liberty']
  },
  {
    id:'kant', order:7, thinker:'임마누엘 칸트', en:'Immanuel Kant', period:'근대', priority:'핵심필수',
    axes:['법의 본질·정당성','권리·청구권·기본권','AI·신기술'], keywords:['자율','인간존엄','목적 그 자체','권리'],
    thesis:'인간을 단순한 수단이 아니라 목적 그 자체로 대해야 한다는 자율과 존엄의 관점은 현대 기본권과 인간중심 AI 규범의 핵심 철학적 토대이다.',
    concepts:['자율과 자유','인간을 목적 그 자체로 대할 의무','외적 자유의 공존을 가능하게 하는 법'],
    relevance:['AI에 법적 지위를 부여하더라도 인간의 도덕적 인격과 동일시할 수 있는지 비판적으로 검토하게 한다.','자동화된 의사결정이 인간을 데이터나 수단으로만 취급하는지 기본권 심사 기준을 제공한다.'],
    works:['Groundwork of the Metaphysics of Morals','The Metaphysics of Morals']
  },
  {
    id:'austin', order:8, thinker:'존 오스틴', en:'John Austin', period:'19세기', priority:'기초필수',
    axes:['법의 본질·정당성'], keywords:['명령설','법실증주의','주권자'],
    thesis:'법을 주권자의 명령과 제재의 구조로 설명한 고전적 법실증주의는 법의 존재와 도덕적 정당성을 구별하는 분석의 출발점이다.',
    concepts:['법과 도덕의 구별','명령·의무·제재','주권'],
    relevance:['AI가 규칙을 생성하거나 집행하더라도 그것이 곧 법이 되는 것은 아니라는 점, 즉 법적 권위의 근거를 인간의 제도적 권위에서 찾아야 한다는 문제를 선명하게 한다.'],
    works:['The Province of Jurisprudence Determined']
  },
  {
    id:'savigny', order:9, thinker:'프리드리히 카를 폰 사비니', en:'Friedrich Carl von Savigny', period:'19세기', priority:'핵심필수',
    axes:['법인격·법적 주체','법의 본질·정당성','AI·신기술'], keywords:['역사법학','법인격','의제설'],
    thesis:'사비니의 고전적 의제설은 자연적 의미의 사람과 법이 기술적으로 구성한 인격을 구별하여 법인의 법인격을 설명한다.',
    concepts:['역사법학','법인의 의제적 인격','권리주체와 인간의 구별'],
    relevance:['AI 기능단위에 제한적 법적 지위를 부여할 수 있는지 검토할 때 “실재적 인간성”과 “법기술적 인격”을 구별하는 출발점이다.','법인격을 곧 도덕적 인간성과 동일시하지 않아야 한다는 논증에 중요하다.'],
    works:['System des heutigen Römischen Rechts'],
    sourceLabel:'Kurki, Legal Personhood — Savigny의 의제설 설명', sourceUrl:'https://www.cambridge.org/core/elements/legal-personhood/EB28AB0B045936DBDAA1DF2D20E923A0'
  },
  {
    id:'jhering', order:10, thinker:'루돌프 폰 예링', en:'Rudolf von Jhering', period:'19세기', priority:'핵심필수',
    axes:['권리·청구권·기본권','책임·귀속'], keywords:['이익설','권리','목적법학'],
    thesis:'권리는 추상적 의지의 형식만이 아니라 법적으로 보호되는 이익이라는 관점에서 이해할 수 있다.',
    concepts:['권리의 이익설','목적법학','권리투쟁'],
    relevance:['AI의 법적 지위를 논할 때 “AI 자체의 이익 보호”와 “피해자·이용자·사회적 이익 보호를 위한 법기술적 지위”를 구별하는 데 유용하다.','권리주체성을 인정해야 하는 이유가 누구의 어떤 이익을 보호하기 위한 것인지 질문하게 한다.'],
    works:['Der Kampf ums Recht','Der Zweck im Recht']
  },
  {
    id:'windscheid', order:11, thinker:'베른하르트 빈트샤이트', en:'Bernhard Windscheid', period:'19세기', priority:'핵심필수',
    axes:['권리·청구권·기본권','책임·귀속'], keywords:['Anspruch','청구권','판덱텐법학'],
    thesis:'근대 사법학에서 Anspruch를 권리자가 타인에게 일정한 작위·부작위를 요구할 수 있는 독립된 청구권 구조로 정교화한 인물이다.',
    concepts:['주관적 권리와 청구권의 구별','급부를 요구할 수 있는 법적 지위','청구권 중심의 사법구제 구조'],
    relevance:['AI 손해에서 피해자가 누구에게 어떤 급부·손해배상·자료제출을 청구할 수 있는지 구조화할 때 중요하다.','법적 지위를 인정한다는 것과 피고적격·책임재산·직접청구권을 부여한다는 것을 분리해 설계하는 데 도움이 된다.'],
    works:['Lehrbuch des Pandektenrechts']
  },
  {
    id:'gierke', order:12, thinker:'오토 폰 기르케', en:'Otto von Gierke', period:'19~20세기', priority:'핵심필수',
    axes:['법인격·법적 주체','책임·귀속'], keywords:['실재설','단체인격','법인'],
    thesis:'단체를 단순한 법적 허구가 아니라 사회적으로 실재하는 조직적 단위로 파악하는 실재설은 법인격의 사회적 기초를 강조한다.',
    concepts:['실재적 단체인격','조직의 독자성','법인과 구성원의 구별'],
    relevance:['다중 에이전트 시스템이 하나의 기능적 조직단위로 외부에서 작동할 때 그 단위를 단순한 개별 요소의 합으로만 볼 것인지 검토하는 이론적 대비축이다.','다만 기술적 통합성이 곧 법인격을 정당화하지는 않는다는 통제장치가 필요하다.'],
    works:['Das deutsche Genossenschaftsrecht'],
    sourceLabel:'Cambridge — real entity theory 개관', sourceUrl:'https://www.cambridge.org/core/journals/journal-of-institutional-economics/article/abs/from-fictions-and-aggregates-to-real-entities-in-the-theory-of-the-firm/D84C16728393207E422E92F325C4C85A'
  },
  {
    id:'jellinek', order:13, thinker:'게오르크 옐리네크', en:'Georg Jellinek', period:'19~20세기', priority:'핵심필수',
    axes:['권리·청구권·기본권','헌법·비례성'], keywords:['지위이론','status negativus','status positivus','status activus'],
    thesis:'개인과 국가의 관계를 소극적 자유, 국가의 급부를 요구하는 적극적 지위, 정치적 참여지위 등으로 구분한 기본권 지위이론을 제시했다.',
    concepts:['소극적 지위','적극적 지위','능동적 지위','국가에 대한 공권'],
    relevance:['AI 시대 기본권을 단순한 국가방어권만이 아니라 보호의무·절차적 권리·정보접근·구제청구로 확장해 분석하는 데 직접 연결된다.','자동화된 국가의사결정에 대해 설명·이의제기·재심을 요구하는 권리가 어떤 기본권 기능에 속하는지 정리할 수 있다.'],
    works:['Allgemeine Staatslehre']
  },
  {
    id:'kelsen', order:14, thinker:'한스 켈젠', en:'Hans Kelsen', period:'20세기', priority:'핵심필수',
    axes:['법의 본질·정당성','법인격·법적 주체','책임·귀속'], keywords:['순수법학','기초규범','규범체계','법적 인격'],
    thesis:'법을 사실이나 도덕으로 환원하지 않는 규범체계로 이해하고, 법적 인격도 권리·의무 규범을 하나의 단위로 귀속시키는 법적 구성으로 분석할 수 있게 한다.',
    concepts:['순수법학','규범의 단계구조','기초규범','법적 인격의 규범적 구성'],
    relevance:['AI에 “사람과 같은 존재”라는 형이상학적 전제를 두지 않고도 일정한 권리·의무·책임을 하나의 기능단위에 귀속시키는 법기술이 가능한지 검토하는 데 매우 중요하다.','기능적 단위의 제한적 법적 지위를 존재론이 아니라 규범배치 문제로 재구성할 수 있다.'],
    works:['Pure Theory of Law','General Theory of Law and State'],
    sourceLabel:'Stanford Encyclopedia — Pure Theory of Law', sourceUrl:'https://plato.stanford.edu/entries/lawphil-theory/'
  },
  {
    id:'radbruch', order:15, thinker:'구스타프 라드브루흐', en:'Gustav Radbruch', period:'20세기', priority:'기초필수',
    axes:['법의 본질·정당성','정의·분배'], keywords:['법적 안정성','정의','라드브루흐 공식'],
    thesis:'법적 안정성과 실정법 존중은 중요하지만 실정법의 부정의가 극단적 수준에 이르면 정의와 법 사이의 관계를 다시 물어야 한다.',
    concepts:['정의·합목적성·법적 안정성','극단적 부정의','실정법의 한계'],
    relevance:['AI 특별법이나 면책구조가 형식적으로 명확하더라도 피해자 구제와 인간 존엄을 현저하게 침해하는 경우 규범적 한계를 검토하게 한다.'],
    works:['Legal Philosophy','Statutory Lawlessness and Supra-Statutory Law']
  },
  {
    id:'hohfeld', order:16, thinker:'웨슬리 뉴컴 호펠드', en:'Wesley Newcomb Hohfeld', period:'20세기', priority:'핵심필수',
    axes:['권리·청구권·기본권','법인격·법적 주체','책임·귀속'], keywords:['claim-right','privilege','power','immunity'],
    thesis:'“권리”라는 하나의 말 아래 섞여 있는 법적 지위를 청구권·자유·권능·면제로 분해해 상대방의 의무·무권능·책임관계까지 정확히 분석한다.',
    concepts:['claim-right ↔ duty','privilege ↔ no-right','power ↔ liability','immunity ↔ disability'],
    relevance:['AI에 어떤 법적 지위를 부여한다는 주장을 “권리주체 인정”이라는 추상어 대신 실제 incidents의 조합으로 분해할 수 있다.','피소송능력, 재산보유, 보험가입, 정보접근, 책임부담을 서로 독립적으로 설계하는 데 직접적인 분석도구가 된다.'],
    works:['Fundamental Legal Conceptions as Applied in Judicial Reasoning'],
    sourceLabel:'Stanford Encyclopedia — Hohfeldian analysis of rights', sourceUrl:'https://plato.stanford.edu/entries/legal-rights/'
  },
  {
    id:'hart', order:17, thinker:'H. L. A. 하트', en:'H. L. A. Hart', period:'20세기', priority:'핵심필수',
    axes:['법의 본질·정당성','책임·귀속','AI·신기술'], keywords:['승인규칙','1차·2차 규칙','책임개념'],
    thesis:'법체계를 1차 규칙과 2차 규칙의 결합으로 설명하고 법의 유효성을 승인규칙이라는 사회적 규칙에 연결했으며, 책임도 역할·인과·법적 책임·능력 등 여러 의미로 분해했다.',
    concepts:['rule of recognition','primary/secondary rules','role responsibility','causal responsibility','liability responsibility','capacity responsibility'],
    relevance:['AI가 원인이라는 사실, 특정 주체에게 법적 책임을 귀속하는 판단, 관리자의 역할책임, 행위능력 문제를 서로 분리할 수 있다.','다중 에이전트 사고에서 “원인을 제공한 시스템”과 “법적으로 책임지는 인간·법인”을 구별하는 핵심 틀이다.'],
    works:['The Concept of Law','Punishment and Responsibility'],
    sourceLabel:'Stanford Encyclopedia — Legal Positivism', sourceUrl:'https://plato.stanford.edu/entries/legal-positivism/'
  },
  {
    id:'fuller', order:18, thinker:'론 L. 풀러', en:'Lon L. Fuller', period:'20세기', priority:'기초필수',
    axes:['법의 본질·정당성','해석·논증'], keywords:['법의 내적 도덕성','명확성','공개성','일관성'],
    thesis:'법이 사람의 행위를 규율하려면 일반성·공개성·장래성·명확성·비모순성·준수가능성·안정성·공식행위와 규칙의 합치 같은 절차적 조건을 갖추어야 한다.',
    concepts:['법의 내적 도덕성','규칙의 공표와 명확성','공식행위와 규칙의 합치'],
    relevance:['AI 규제에서 불명확한 위험기준, 설명불가능한 자동 집행, 사후적 기준변경이 법치주의를 해치는지 검토하는 기준이 된다.'],
    works:['The Morality of Law']
  },
  {
    id:'rawls', order:19, thinker:'존 롤스', en:'John Rawls', period:'20세기', priority:'핵심필수',
    axes:['정의·분배','권리·청구권·기본권','헌법·비례성'], keywords:['정의론','원초적 입장','무지의 베일','차등원칙'],
    thesis:'자유롭고 평등한 시민들이 자신의 구체적 지위를 모르는 공정한 조건에서 사회의 기본구조 원칙을 선택한다고 가정해 정의의 기준을 구성한다.',
    concepts:['justice as fairness','원초적 입장','무지의 베일','동등한 기본적 자유','공정한 기회균등','차등원칙'],
    relevance:['AI로 인한 편익과 위험·책임비용을 누가 부담해야 하는지, 기술기업·이용자·피해자의 현실적 지위를 모른 상태에서도 수용할 수 있는 규칙인지 검토할 수 있다.','기본적 자유를 단순 효용과 교환하지 않는다는 점에서 AI 안전규제와 기본권의 관계를 평가하는 기준이 된다.'],
    works:['A Theory of Justice','Political Liberalism','Justice as Fairness'],
    sourceLabel:'Stanford Encyclopedia — John Rawls', sourceUrl:'https://plato.stanford.edu/entries/rawls/'
  },
  {
    id:'nozick', order:20, thinker:'로버트 노직', en:'Robert Nozick', period:'20세기', priority:'심화',
    axes:['정의·분배','권리·청구권·기본권'], keywords:['권리제약','소유권','최소국가'],
    thesis:'정의는 결과의 평등한 패턴보다 정당한 취득·이전·교정 과정과 개인의 강한 권리제약을 중시해야 한다.',
    concepts:['entitlement theory','side constraints','최소국가'],
    relevance:['AI 위험을 이유로 기업·개인의 자유와 재산을 광범위하게 제한할 때 규제의 한계를 검토하는 반대축을 제공한다.','Rawls의 분배정의와 대비하여 책임기금·강제보험·공탁의 정당성을 분석할 수 있다.'],
    works:['Anarchy, State, and Utopia']
  },
  {
    id:'dworkin', order:21, thinker:'로널드 드워킨', en:'Ronald Dworkin', period:'20세기', priority:'핵심필수',
    axes:['권리·청구권·기본권','해석·논증','헌법·비례성'], keywords:['권리의 우선성','원칙','법의 통일성'],
    thesis:'법은 규칙만의 체계가 아니라 원칙을 포함하며 개인의 권리는 집단적 효용이나 정책목표에 쉽게 희생될 수 없는 특별한 규범적 지위를 가진다.',
    concepts:['rights as trumps','rules and principles','law as integrity','constructive interpretation'],
    relevance:['AI 혁신·산업경쟁력이라는 정책목표가 개인정보·평등·절차적 권리를 자동으로 압도하지 못한다는 논증에 중요하다.','법적 공백에서 단순한 정책선택이 아니라 기존 법체계의 원칙과 정합성을 바탕으로 해석대안을 구성하게 한다.'],
    works:['Taking Rights Seriously','Law’s Empire'],
    sourceLabel:'Stanford Encyclopedia — Legal Rights', sourceUrl:'https://plato.stanford.edu/entries/legal-rights/'
  },
  {
    id:'raz', order:22, thinker:'조지프 라즈', en:'Joseph Raz', period:'20~21세기', priority:'심화',
    axes:['법의 본질·정당성','권리·청구권·기본권'], keywords:['권위','배제적 이유','이익설'],
    thesis:'법적 권위는 사람들이 이미 적용받는 이유에 더 잘 따르도록 도와주는 정당화 구조를 가져야 하며 권리는 중요한 이익을 보호하는 이유로 분석될 수 있다.',
    concepts:['service conception of authority','exclusionary reasons','interest theory of rights'],
    relevance:['AI가 의사결정을 보조하거나 대리할 때 시스템의 출력이 언제 독립된 권위가 아니라 인간의 판단을 돕는 수단에 머물러야 하는지 검토할 수 있다.','법적 지위 설계에서 보호할 이익과 부과할 의무의 연결을 평가하는 데 유용하다.'],
    works:['The Authority of Law','The Morality of Freedom']
  },
  {
    id:'finnis', order:23, thinker:'존 피니스', en:'John Finnis', period:'20~21세기', priority:'심화',
    axes:['법의 본질·정당성','권리·청구권·기본권'], keywords:['신자연법','기본적 선','실천이성'],
    thesis:'법과 공공선의 정당성을 인간의 기본적 선과 실천이성의 요구에 연결하는 현대 자연법론을 전개한다.',
    concepts:['basic goods','practical reasonableness','common good'],
    relevance:['AI 규범을 단순 위험관리나 경제효율이 아니라 인간의 삶과 공동체의 기본적 가치에 연결해 평가하는 기준을 제공한다.'],
    works:['Natural Law and Natural Rights']
  },
  {
    id:'habermas', order:24, thinker:'위르겐 하버마스', en:'Jürgen Habermas', period:'20~21세기', priority:'핵심필수',
    axes:['법의 본질·정당성','권리·청구권·기본권','헌법·비례성'], keywords:['담론이론','민주적 정당성','의사소통'],
    thesis:'법의 정당성은 시민이 자유롭고 평등한 참여자로서 공적 의사형성 과정에 참여할 수 있는 절차와 연결된다.',
    concepts:['담론원리','법과 민주주의의 상호관계','공론장','절차적 정당성'],
    relevance:['AI 규범을 전문가·기업 중심으로 설계하지 않고 영향을 받는 시민과 집단의 참여·이의제기·설명 요구를 제도화해야 한다는 근거가 된다.','자동화된 행정결정에서 절차적 기본권과 인간의 최종 판단권을 평가하는 데 유용하다.'],
    works:['Between Facts and Norms']
  },
  {
    id:'alexy', order:25, thinker:'로베르트 알렉시', en:'Robert Alexy', period:'현대', priority:'핵심필수',
    axes:['권리·청구권·기본권','헌법·비례성','해석·논증'], keywords:['원칙이론','최적화명령','비례성','형량'],
    thesis:'기본권은 대체로 가능한 사실적·법적 조건 아래 최대한 실현되어야 하는 원칙이며, 원칙 충돌은 비례성 심사를 통해 해결해야 한다.',
    concepts:['규칙과 원칙의 구별','원칙=최적화명령','적합성·필요성·법익균형성','형량법칙'],
    relevance:['AI 안전·투명성·감독 의무와 개인정보·영업비밀·표현의 자유·재산권이 충돌할 때 구조화된 기본권 심사틀을 제공한다.','책임추정이나 로그보존 의무가 피해자 구제를 위해 필요한지, 덜 제한적인 수단이 있는지 검토할 수 있다.'],
    works:['A Theory of Constitutional Rights','A Theory of Legal Argumentation'],
    sourceLabel:'Cambridge — Alexy와 비례성·기본권 원칙이론', sourceUrl:'https://www.cambridge.org/core/journals/german-law-journal/article/alexy-and-the-german-model-of-proportionality-why-the-theory-of-constitutional-rights-does-not-provide-a-representative-reconstruction-of-the-proportionality-test/2EB57D7431F604A4FE37663F41F99206'
  },
  {
    id:'barak', order:26, thinker:'아하론 바라크', en:'Aharon Barak', period:'현대', priority:'심화',
    axes:['헌법·비례성','해석·논증','권리·청구권·기본권'], keywords:['비례성','목적론적 해석','기본권 제한'],
    thesis:'기본권 제한의 정당성을 목적과 수단의 관계, 필요성, 균형성으로 단계화하고 목적론적 해석을 통해 헌법적 권리의 실현을 구체화한다.',
    concepts:['proportionality','purposive interpretation','권리의 범위와 제한'],
    relevance:['AI 기본법·특별법의 목적을 확인하고 구체적 의무가 기본권을 과도하게 제한하는지 단계적으로 심사하는 데 직접 활용할 수 있다.'],
    works:['Proportionality: Constitutional Rights and their Limitations','Purposive Interpretation in Law'],
    sourceLabel:'Cambridge — Proportionality', sourceUrl:'https://www.cambridge.org/core/books/proportionality/369D7D68D3CBF7B38A7F34B871E18D87'
  },
  {
    id:'kurki', order:27, thinker:'비사 A. J. 쿠르키', en:'Visa A. J. Kurki', period:'현대', priority:'최핵심',
    axes:['법인격·법적 주체','권리·청구권·기본권','AI·신기술'], keywords:['legal personhood','bundle theory','AI legal personhood','person-thing distinction'],
    thesis:'법인격을 하나의 단일한 전부 또는 전무의 지위가 아니라 여러 법적 incidents와 법적 관계의 결합으로 분석하여 자연인·법인·동물·자연물·AI의 법적 지위를 비교한다.',
    concepts:['법인격의 분해적 분석','법적 사람과 법적 사물의 구별 비판','인공적 법인격','AI 법인격'],
    relevance:['기능적 단위에 전면적 인격을 부여하지 않고 피소송능력·책임재산·보험·관리인·특정 권능만 제한적으로 부여하는 설계를 이론적으로 정교화하는 데 가장 직접적으로 연결된다.','“AI가 인간인가”라는 존재론적 질문을 피하고 어떤 법적 incidents가 필요한지를 묻게 한다.'],
    works:['A Theory of Legal Personhood','Legal Personhood'],
    sourceLabel:'Cambridge Open Access — Legal Personhood', sourceUrl:'https://www.cambridge.org/core/elements/legal-personhood/EB28AB0B045936DBDAA1DF2D20E923A0'
  },
  {
    id:'cane', order:28, thinker:'피터 케인', en:'Peter Cane', period:'현대', priority:'핵심필수',
    axes:['책임·귀속','AI·신기술'], keywords:['책임','책임귀속','법적 책임','책임관행'],
    thesis:'책임은 단일한 도덕개념이 아니라 법적 제도와 사회적 관행 속에서 행위·결과·역할·책임부담을 서로 다른 방식으로 연결하는 구조로 분석해야 한다.',
    concepts:['responsibility practices','legal responsibility','책임의 제도적 배분'],
    relevance:['AI 사고에서 기술적 인과관계와 규범적 책임귀속을 분리하고, 설계자·통합자·배치자·운용자에게 왜 다른 책임을 부과하는지 정당화하는 데 중요하다.'],
    works:['Responsibility in Law and Morality']
  },
  {
    id:'weinrib', order:29, thinker:'어니스트 와인립', en:'Ernest J. Weinrib', period:'현대', priority:'심화',
    axes:['책임·귀속','정의·분배'], keywords:['교정적 정의','사법','원고-피고 관계'],
    thesis:'사법상 책임은 사회 전체의 효율이나 분배정책만으로 설명할 수 없고 원고와 피고 사이의 상관적 권리·의무 관계를 교정하는 구조를 가진다.',
    concepts:['corrective justice','correlativity','private law'],
    relevance:['AI 피해구제에서 전체 산업에 비용을 분산하는 정책논리와 특정 피고에게 손해배상책임을 귀속하는 사법논리를 구별하게 한다.','공동불법행위·구상관계·직접청구 구조를 교정적 정의의 관점에서 검토할 수 있다.'],
    works:['The Idea of Private Law']
  },
  {
    id:'calabresi', order:30, thinker:'귀도 칼라브레시', en:'Guido Calabresi', period:'현대', priority:'핵심필수',
    axes:['책임·귀속','정의·분배','AI·신기술'], keywords:['사고비용','최소비용회피자','위험배분'],
    thesis:'사고법과 책임제도는 사고 자체의 비용뿐 아니라 사고예방비용과 제도운영비용까지 고려해 위험을 가장 효율적으로 통제할 수 있는 위치에 배분해야 한다.',
    concepts:['cost of accidents','cheapest cost avoider','risk distribution'],
    relevance:['AI 공급망에서 어느 주체가 위험을 가장 잘 예측·통제·보험할 수 있는지 판단하는 경제적 보조기준을 제공한다.','다만 효율성만으로 책임귀속을 결정하면 권리·정의의 문제가 누락될 수 있으므로 교정적 정의와 함께 사용해야 한다.'],
    works:['The Costs of Accidents']
  },
  {
    id:'maccormick', order:31, thinker:'닐 매코믹', en:'Neil MacCormick', period:'현대', priority:'핵심필수',
    axes:['해석·논증','법의 본질·정당성'], keywords:['법적 논증','정합성','결과고려'],
    thesis:'법적 판단은 단순한 연역만이 아니라 정합성·일관성·결과의 정당화가 결합된 실천적 논증과정이다.',
    concepts:['legal reasoning','coherence','consistency','consequentialist arguments'],
    relevance:['AI 책임의 새로운 사례에서 기존 조문만으로 답이 나오지 않을 때 유추·원칙·정합성·결과를 어떻게 논증에 배열할지 방법론을 제공한다.'],
    works:['Legal Reasoning and Legal Theory','Rhetoric and the Rule of Law']
  },
  {
    id:'schauer', order:32, thinker:'프레더릭 샤우어', en:'Frederick Schauer', period:'현대', priority:'심화',
    axes:['해석·논증','AI·신기술'], keywords:['규칙','일반화','예측가능성','과소·과잉포섭'],
    thesis:'규칙은 일반화 때문에 개별사건에 과소포섭·과잉포섭을 낳지만 그럼에도 예측가능성·통제가능성이라는 제도적 가치를 가진다.',
    concepts:['rule-based decision','generalization','under/over-inclusiveness'],
    relevance:['AI 위험등급이나 고위험 시스템 정의가 모든 사례를 완벽히 포착하지 못하더라도 어떤 수준의 일반화를 허용할지 검토하는 데 유용하다.','원칙 중심 규제와 명확한 규칙 중심 규제의 장단점을 비교할 수 있다.'],
    works:['Playing by the Rules']
  }
];

window.LEGAL_PHILOSOPHY_AXES = [
  '전체',
  '법의 본질·정당성',
  '권리·청구권·기본권',
  '책임·귀속',
  '법인격·법적 주체',
  '정의·분배',
  '해석·논증',
  '헌법·비례성',
  'AI·신기술'
];
