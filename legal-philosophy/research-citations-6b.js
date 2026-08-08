(() => {
  'use strict';
  window.LEGAL_PHILOSOPHY_CITATIONS = window.LEGAL_PHILOSOPHY_CITATIONS || {};
  Object.assign(window.LEGAL_PHILOSOPHY_CITATIONS, {
    kant:{
      status:'핵심필수 검증',
      primary:[
        {citation:'Immanuel Kant, Groundwork of the Metaphysics of Morals (1785), Akademie-Ausgabe Bd. 4.',pinpoint:'AA 4:428–429. 인간성을 자신과 타인의 인격에서 언제나 동시에 목적으로 대하고 단순한 수단으로만 대하지 말라는 인간성 정식의 핵심 위치.',url:'https://korpora.zim.uni-duisburg-essen.de/kant/aa04/'},
        {citation:'Immanuel Kant, The Metaphysics of Morals, Doctrine of Right, Introduction § C (1797).',pinpoint:'AA 6:230. Universal Principle of Right. 외적 자유의 공존가능성을 법의 보편원리로 정식화하는 핵심 위치; 선천적 자유권은 AA 6:237–238과 함께 확인.',url:'https://korpora.zim.uni-duisburg-essen.de/kant/aa06/'}
      ],
      followUp:[
        {citation:'Paul Guyer, “Kant’s Deductions of the Principles of Right,” in Kant’s Doctrine of Right: A Commentary (Oxford University Press).',pinpoint:'pp. 23–64. 특히 RL 6:230의 Universal Principle of Right를 칸트 권리론의 연역구조 속에서 재구성.',url:'https://doi.org/10.1093/oso/9780198250098.003.0002'}
      ],
      opposition:[
        {citation:'Jeremy Bentham, An Introduction to the Principles of Morals and Legislation, Ch. I.',pinpoint:'효용원리를 제도평가의 기본기준으로 놓는 결과주의적 경쟁축. 칸트의 인격·자유 중심 정당화와 대비하여 사용.',url:'https://www.ucl.ac.uk/Bentham-Project/'}
      ],
      usableClaim:'칸트의 논의는 인간의 도덕적 인격과 외적 자유가 법질서의 정당화에서 특별한 지위를 가진다는 근거로 사용할 수 있다. AI 규범에서는 인간을 단순한 데이터·위험관리의 수단으로 취급하는 제도설계의 한계를 검토하는 규범적 출발점이 된다.',
      caution:'칸트의 목적 그 자체 정식을 현대 헌법재판의 인간존엄 공식과 동일시하지 않는다. 또한 칸트의 도덕적 인격 개념을 AI의 법기술적 personhood와 같은 층위로 비교하지 않는다.'
    },
    savigny:{
      status:'핵심필수 검증',
      primary:[
        {citation:'Friedrich Carl von Savigny, System des heutigen Römischen Rechts, Bd. II (Berlin, 1840), Abschnitt über juristische Personen.',pinpoint:'§ 85 “Juristische Personen. Begriff”, p. 235부터. 법인의 개념과 자연인 이외의 권리주체 문제를 다루는 출발점; 유형론은 p. 242ff., 성립·소멸은 p. 275ff.에서 이어진다.',url:'https://books.google.com/books?q=Savigny+System+des+heutigen+R%C3%B6mischen+Rechts+Band+2+1840'}
      ],
      followUp:[
        {citation:'John Dewey, “The Historic Background of Corporate Legal Personality,” 35 Yale Law Journal (1926) 655–673.',pinpoint:'pp. 655–673. 의제설·실재설 등 법인격의 역사적 존재론 논쟁을 기능적 관점에서 비판적으로 재검토.',url:'https://doi.org/10.2307/788782'}
      ],
      opposition:[
        {citation:'Otto von Gierke, Deutsches Privatrecht, Bd. I (1895).',pinpoint:'p. 470ff. 단체를 독자적·실재적 인격체로 파악하는 실재단체설이 Savigny의 의제적 설명에 대한 고전적 대립축을 이룬다.',url:'https://archive.org/search?query=Otto+von+Gierke+Deutsches+Privatrecht'}
      ],
      usableClaim:'Savigny는 법적 인격이 자연인의 생물학적 존재와 동일한 개념이 아님을 보여주는 고전적 출발점으로 사용할 수 있다. 이로부터 비인간 주체의 법기술적 구성가능성은 논의할 수 있지만 AI 법인격의 필요성까지 도출되지는 않는다.',
      caution:'사비니의 이론을 곧바로 현대 AI의 제한적 법적 지위에 찬성하는 선행이론으로 기술하지 않는다. 그의 논의대상은 역사적 법인이고, AI 적용은 후대 연구자가 구성하는 비교논증이다.'
    },
    jhering:{
      status:'핵심필수 검증',
      primary:[
        {citation:'Rudolf von Jhering, Geist des römischen Rechts auf den verschiedenen Stufen seiner Entwicklung, 4. Aufl., Bd. III (1888), § 60.',pinpoint:'p. 339ff.; “Rechte sind rechtlich geschützte Interessen”의 정식은 p. 351로 후속 학술문헌에서 반복 확인된다. 직접 인용 시 해당 판본 원문을 재대조.',url:'https://books.google.com/books?q=Jhering+Geist+des+r%C3%B6mischen+Rechts+1888+Band+3'}
      ],
      followUp:[
        {citation:'D. Frydrych, “What Is the Will Theory of Rights?,” Ratio Juris 32(4) (2019) 455–472.',pinpoint:'pp. 455–472. 현대 권리론의 Interest Theory와 Will Theory 경쟁구조를 정리하고 Hohfeld식 권리모형과 권리의 정당화 이론을 구별.',url:'https://doi.org/10.1111/raju.12259'}
      ],
      opposition:[
        {citation:'Bernhard Windscheid, Lehrbuch des Pandektenrechts, Bd. I, 4. Aufl. (1875).',pinpoint:'p. 101ff. Anspruch 중심의 사법상 권리구조는 Jhering의 보호이익 중심 설명과 다른 분석축을 제공한다.',url:'https://books.google.com/books?q=Windscheid+Lehrbuch+des+Pandektenrechts+1875'}
      ],
      usableClaim:'Jhering의 이익설은 권리주체성을 논할 때 “누구의 어떤 이익을 법이 보호하려는가”를 선행 질문으로 제시하는 데 유용하다. AI 법적 지위가 AI 자체의 이익보호인지 피해자·거래상대방 보호를 위한 법기술인지 구별하는 논거가 된다.',
      caution:'이익설만으로 어떤 존재가 곧 권리주체가 되는 것은 아니다. 보호할 이익과 그 이익을 해당 주체 자신의 권리로 구성할 필요성은 별도 논증이 필요하다.'
    },
    windscheid:{
      status:'핵심필수 검증',
      primary:[
        {citation:'Bernhard Windscheid, Lehrbuch des Pandektenrechts, Bd. I, 4. Aufl. (1875).',pinpoint:'p. 101 “Begriff. Dingliche und persönliche Ansprüche”; actio in rem/in personam 관련 논의는 p. 107ff. 판본별 쪽수 차이를 최종 인용 전 확인.',url:'https://books.google.com/books?q=Windscheid+Lehrbuch+des+Pandektenrechts+1875'}
      ],
      followUp:[
        {citation:'Wesley Newcomb Hohfeld, “Some Fundamental Legal Conceptions as Applied in Judicial Reasoning,” 23 Yale Law Journal (1913) 16–59.',pinpoint:'pp. 28–33 등을 중심으로 claim-right와 duty를 포함한 법률관계의 분석적 분해를 전개하여 근대 청구권 논의를 더 세밀한 관계구조로 확장.',url:'https://doi.org/10.2307/785533'}
      ],
      opposition:[
        {citation:'Rudolf von Jhering, Geist des römischen Rechts, 4. Aufl., Bd. III, § 60.',pinpoint:'p. 351의 “법적으로 보호된 이익” 정식은 권리의 본질을 보호이익에서 설명하는 경쟁축.',url:'https://books.google.com/books?q=Jhering+Geist+des+r%C3%B6mischen+Rechts+1888+Band+3'}
      ],
      usableClaim:'Windscheid는 피해자가 누구에게 어떤 작위·부작위·급부를 요구할 수 있는지 청구권 구조로 정리하는 데 사용한다. AI 손해에서는 추상적인 AI 권리주체성보다 피해자의 구체적 손해배상·자료제출·이행청구를 먼저 확정하는 분석순서를 뒷받침한다.',
      caution:'현대 독일민법의 Anspruch 개념 전체를 Windscheid 혼자 “창시”했다고 단정하지 않는다. 판덱텐법학의 역사적 전개 속에서 그가 개념을 체계화·정교화한 핵심 인물이라는 정도로 표현한다.'
    },
    gierke:{
      status:'핵심필수 검증',
      primary:[
        {citation:'Otto von Gierke, Deutsches Privatrecht, Bd. I (Leipzig, 1895).',pinpoint:'p. 470ff. 단체의 독자적·실재적 인격성 논의; p. 471ff. 및 p. 474 부근에서 조직체의 독자성과 기관구조가 구체화된다.',url:'https://archive.org/search?query=Otto+von+Gierke+Deutsches+Privatrecht'},
        {citation:'Otto von Gierke, Die Genossenschaftstheorie und die deutsche Rechtsprechung (1887).',pinpoint:'pp. 624–625로 인용되는 기관행위의 단체귀속 논의는 직접인용 전 해당 판본 원문 재대조.',url:'https://books.google.com/books?q=Gierke+Genossenschaftstheorie+1887'}
      ],
      followUp:[
        {citation:'John Dewey, “The Historic Background of Corporate Legal Personality,” 35 Yale Law Journal (1926) 655–673.',pinpoint:'pp. 655–673. 실재설과 의제설의 존재론적 대립을 법적 기능의 관점에서 재평가.',url:'https://doi.org/10.2307/788782'}
      ],
      opposition:[
        {citation:'Friedrich Carl von Savigny, System des heutigen Römischen Rechts, Bd. II, § 85.',pinpoint:'p. 235ff. 법인의 의제적·법기술적 설명이 Gierke 실재단체설의 고전적 대립축.',url:'https://books.google.com/books?q=Savigny+System+des+heutigen+R%C3%B6mischen+Rechts+Band+2+1840'}
      ],
      usableClaim:'Gierke는 조직이 구성원의 단순 합을 넘어 법적으로 독자성을 가질 수 있다는 논의를 검토하는 고전적 대립축이다. 다중 AI 시스템의 기술적 통합성과 법적 조직단위의 독자성을 비교하는 데 사용할 수 있다.',
      caution:'기술적 통합성·창발성이 사회적 실재단체와 동일하다고 보아서는 안 된다. Gierke의 이론은 AI 시스템의 법인격을 직접 지지하지 않으며 조직적 실재성과 법적 인격부여 사이에는 별도 정당화가 필요하다.'
    },
    jellinek:{
      status:'핵심필수 검증',
      primary:[
        {citation:'Georg Jellinek, System der subjektiven öffentlichen Rechte, 2. Aufl. (1905).',pinpoint:'개인의 공권 체계는 p. 81ff.; 특별부 p. 94ff.; status positivus는 p. 114ff.; Rechtsschutzanspruch은 p. 124 부근. 최종 직접인용 시 1905년 판본 스캔과 재대조.',url:'https://books.google.com/books?q=Jellinek+System+der+subjektiven+%C3%B6ffentlichen+Rechte+1905'}
      ],
      followUp:[
        {citation:'Robert Alexy, A Theory of Constitutional Rights (Oxford University Press, 2002), Ch. 5 “Constitutional Rights and Legal Status”.',pinpoint:'p. 163ff.; passive status p. 164, negative status p. 166, positive status p. 169, active status p. 172, 지위이론 평가 p. 173.',url:'https://academic.oup.com/book/9191/chapter/155815607'}
      ],
      opposition:[
        {citation:'Dieter Grimm, “Return to the Traditional Understanding of Fundamental Rights?,” in Constitutionalism: Past, Present, and Future (OUP, 2016).',pinpoint:'pp. 183–196. 기본권의 주관적 방어권과 객관적 원칙·수평효·보호의무의 확장을 구별하여 고전적 status 체계 이후의 경쟁적 기본권 기능론을 제시.',url:'https://doi.org/10.1093/acprof:oso/9780198766124.003.0008'}
      ],
      usableClaim:'Jellinek의 지위론은 국가와 개인의 법률관계를 방어·급부·참여 등 서로 다른 기능으로 구분하는 분석도구이다. 자동화 행정에 대한 설명·이의제기·구제·참여 요구가 동일한 하나의 “기본권”이 아니라 서로 다른 법적 지위인지 구조화하는 데 유용하다.',
      caution:'Jellinek의 status positivus를 현대 기본권 보호의무와 동일시하지 않는다. 보호의무·수평효는 후대 헌법이론에서 발전한 별도 문제이다.'
    },
    kelsen:{
      status:'핵심필수 검증',
      primary:[
        {citation:'Hans Kelsen, Pure Theory of Law, trans. Max Knight (University of California Press, 1967).',pinpoint:'“Legal Capacity (Rechtsfähigkeit); Representation” p. 158ff.; “The Legal Subject—the Person” p. 168ff. 법적 인격을 권리·의무 규범의 귀속단위로 분석하는 핵심 부분.',url:'https://books.google.com/books?id=8N5S6BjX3RAC'}
      ],
      followUp:[
        {citation:'Visa A.J. Kurki, A Theory of Legal Personhood (OUP, 2019), Ch. 3.',pinpoint:'pp. 91–126. 법적 인격을 규범적 귀속의 단일한 허구로만 보지 않고 여러 incidents의 구조로 분해하는 현대적 재구성.',url:'https://academic.oup.com/book/35026/chapter/298855652'}
      ],
      opposition:[
        {citation:'Otto von Gierke, Deutsches Privatrecht, Bd. I (1895), p. 470ff.',pinpoint:'법인격의 사회적·조직적 실재성을 강조하는 실재단체설은 Kelsen식 규범주의적 인격구성과 다른 존재론적·사회이론적 대립축.',url:'https://archive.org/search?query=Otto+von+Gierke+Deutsches+Privatrecht'}
      ],
      usableClaim:'Kelsen을 통해 법적 person은 자연적 실체의 발견이 아니라 법규범이 권리·의무를 하나의 귀속점에 통일하는 구성으로 분석할 수 있다. 이는 AI 기능단위의 법적 지위를 존재론보다 규범배치 문제로 검토하는 데 유용하다.',
      caution:'규범적 구성가능성은 AI에게 새로운 법적 지위를 부여해야 한다는 정책적 필요성과 별개이다. Kelsen의 인격론을 AI 법인격 찬성론으로 직접 분류하지 않는다.'
    },
    hohfeld:{
      status:'핵심필수 검증',
      primary:[
        {citation:'Wesley Newcomb Hohfeld, “Some Fundamental Legal Conceptions as Applied in Judicial Reasoning,” 23 Yale Law Journal (1913) 16–59.',pinpoint:'전체 pp. 16–59; 기본 jural relations의 구별은 pp. 28–33, correlatives/opposites의 전개는 pp. 45–46 및 p. 55 등에서 확인. 후대 1919 단행본 판본과 쪽수가 다를 수 있음.',url:'https://doi.org/10.2307/785533'}
      ],
      followUp:[
        {citation:'D. Frydrych, “What Is the Will Theory of Rights?,” Ratio Juris 32(4) (2019) 455–472.',pinpoint:'pp. 455–472. Hohfeld의 관계모형과 권리의 목적·정당화를 다루는 Will/Interest theories를 명확히 구별.',url:'https://doi.org/10.1111/raju.12259'},
        {citation:'R. Cruft, “Why Aren’t Duties Rights?,” Philosophical Quarterly 56(223) (2006) 175–192.',pinpoint:'pp. 175–192; Hohfeld 1964 reprint pp. 36–50을 토대로 권리와 의무의 범주경계를 재검토.',url:'https://doi.org/10.1111/j.1467-9213.2006.00436.x'}
      ],
      opposition:[
        {citation:'Joseph Raz, The Morality of Freedom (1986), interest theory of rights; H.L.A. Hart, Essays on Bentham (1982), choice/will-oriented account.',pinpoint:'Hohfeld은 권리의 형식적 관계모형을 제시하고 Raz·Hart는 무엇이 그러한 권리를 정당화하는지 경쟁적으로 설명한다. 직접 반박관계라기보다 분석모형과 권리이론의 층위차이다.',url:''}
      ],
      usableClaim:'Hohfeld를 이용하면 “AI에게 권리가 있다”는 총칭을 claim·privilege·power·immunity와 그 상대방의 duty·no-right·liability·disability로 분해할 수 있다. 소송능력·재산보유·계약권능·면책을 하나의 법인격 패키지로 묶지 않고 개별적으로 심사하는 데 직접 사용된다.',
      caution:'Hohfeld 모형은 누가 권리주체가 되어야 하는지에 관한 도덕적·정책적 기준을 스스로 제공하지 않는다. Interest/Will theory와 결합할 때 분석층위를 구별한다.'
    },
    hart:{
      status:'핵심필수 검증',
      primary:[
        {citation:'H. L. A. Hart, Punishment and Responsibility, 2nd ed. (Oxford University Press, 2008), “Postscript: Responsibility and Retribution”.',pinpoint:'pp. 210–237. role-, causal-, liability-, capacity-responsibility 등 책임개념의 다의성과 형사책임의 정당화를 구별하는 핵심 범위.',url:'https://academic.oup.com/book/11532/chapter-abstract/160311870'},
        {citation:'H. L. A. Hart, The Concept of Law, 2nd ed. (Oxford University Press, 1994).',pinpoint:'Ch. V “Law as the Union of Primary and Secondary Rules” p. 79ff.; “The Elements of Law” p. 91ff.; Ch. VI rule of recognition p. 100ff.; Postscript의 principles 관련 논의 p. 263ff.',url:'https://books.google.com/books?q=Hart+The+Concept+of+Law+second+edition+1994'}
      ],
      followUp:[
        {citation:'Peter Cane, Responsibility in Law and Morality (Hart Publishing, 2002), Ch. 2.',pinpoint:'p. 29ff.; civil responsibility의 outcomes·social values·관계적 구조는 pp. 49–53 부근을 중심으로 확인.',url:'https://books.google.com/books?q=Peter+Cane+Responsibility+in+Law+and+Morality'}
      ],
      opposition:[
        {citation:'Ronald Dworkin, Taking Rights Seriously (Harvard University Press, 1977/1978), Ch. 2 “The Model of Rules I”.',pinpoint:'pp. 22–31 부근의 rules/principles 구별이 Hart식 규칙중심 법실증주의에 대한 대표적 비판축. Hart의 Postscript는 이 비판에 대한 사후 응답을 포함.',url:'https://books.google.com/books?q=Dworkin+Taking+Rights+Seriously'}
      ],
      usableClaim:'Hart의 책임개념 분해는 AI가 사실적 원인이었다는 명제, 특정 인간에게 역할의무가 있었다는 명제, 법률상 배상책임을 진다는 명제, 책임능력이 있다는 명제를 분리하는 기본도구가 된다.',
      caution:'Hart의 책임분류 자체가 민사책임요건을 정하는 것은 아니다. role/causal/capacity responsibility에서 liability responsibility로 이동하려면 실정법상 의무·인과·귀책 또는 위험책임 근거가 필요하다.'
    },
    rawls:{
      status:'핵심필수 검증',
      primary:[
        {citation:'John Rawls, A Theory of Justice, rev. ed. (Harvard University Press, 1999).',pinpoint:'§ 11 “Two Principles of Justice” pp. 52–56; § 13 “Democratic Equality and the Difference Principle” pp. 65–73; § 24 “The Veil of Ignorance” p. 118ff.',url:'https://books.google.com/books?q=Rawls+A+Theory+of+Justice+Revised+Edition+1999'}
      ],
      followUp:[
        {citation:'H. L. A. Hart, “Rawls on Liberty and Its Priority,” University of Chicago Law Review 40(3) (1973) 534–555.',pinpoint:'pp. 534–555. 기본적 자유의 내용·우선성·최대화 문제에 대한 고전적 비판. Rawls가 후대에 기본적 자유 정식을 수정하는 중요한 논쟁배경.',url:'https://chicagounbound.uchicago.edu/uclrev/vol40/iss3/5/'}
      ],
      opposition:[
        {citation:'Robert Nozick, Anarchy, State, and Utopia (Basic Books, 1974), Part II.',pinpoint:'p. 149ff. entitlement theory와 side constraints를 중심으로 patterned/distributive principles에 대한 대표적 자유지상주의 경쟁축.',url:'https://books.google.com/books?q=Nozick+Anarchy+State+and+Utopia'}
      ],
      usableClaim:'Rawls는 기술기업·운영자·이용자·피해자 중 자신이 어느 위치에 놓일지 모르는 조건에서도 수용할 수 있는 책임·위험배분 규칙인지 질문하는 공정성 검토에 사용할 수 있다. 기본적 자유를 단순한 총효용과 교환하지 않는다는 점도 규제정당화의 한계축이 된다.',
      caution:'차등원칙은 모든 개별 불법행위 책임을 정하는 원칙이 아니라 사회의 기본구조와 분배정의에 관한 원칙이다. 개별 민사책임 귀속에 직접 대입하지 말고 책임제도·기금·보험 등 제도설계의 공정성 평가에 제한하여 사용한다.'
    },
    dworkin:{
      status:'핵심필수 검증',
      primary:[
        {citation:'Ronald Dworkin, Taking Rights Seriously (Harvard University Press, 1977/1978), Ch. 2 “The Model of Rules I”.',pinpoint:'규칙과 원칙의 구별은 통상 pp. 22–31에서 집중적으로 인용된다. 판본별 pagination을 최종 직접인용 전 재확인.',url:'https://books.google.com/books?q=Dworkin+Taking+Rights+Seriously'},
        {citation:'Ronald Dworkin, “Rights as Trumps,” in Jeremy Waldron (ed.), Theories of Rights (Oxford University Press, 1984).',pinpoint:'pp. 153–167. 집단적 정책목표에 대해 개인의 권리가 갖는 특별한 규범적 힘을 설명하는 대표 텍스트.',url:'https://books.google.com/books?q=Dworkin+Rights+as+Trumps+153+167'}
      ],
      followUp:[
        {citation:'Peter Koller, “Ronald Dworkin: In Memoriam (1931–2013),” Ratio Juris 26(4) (2013) 560–564.',pinpoint:'pp. 560–564. rights as trumps, constructive interpretation, law as integrity의 관계를 압축적으로 재구성.',url:'https://doi.org/10.1111/raju.12025'}
      ],
      opposition:[
        {citation:'Joseph Raz, “Professor Dworkin’s Theory of Rights,” Political Studies 26(1) (1978) 123–137.',pinpoint:'pp. 123–137. Dworkin의 권리론에 대한 대표적 직접 비판.',url:'https://doi.org/10.1111/j.1467-9248.1978.tb01528.x'},
        {citation:'H. L. A. Hart, The Concept of Law, 2nd ed., Postscript (1994).',pinpoint:'Dworkin의 원칙·법실증주의 비판에 대한 Hart의 사후 응답을 함께 검토.',url:'https://books.google.com/books?q=Hart+The+Concept+of+Law+Postscript+Dworkin'}
      ],
      usableClaim:'Dworkin은 AI 혁신·산업경쟁력 같은 정책목표만으로 개인의 개인정보·평등·절차적 권리를 쉽게 희생해서는 안 된다는 권리중심 정당화에 사용할 수 있다. 또한 법적 공백에서 기존 법체계의 원칙과 제도역사를 정합적으로 해석해야 한다는 방법론을 제공한다.',
      caution:'rights as trumps를 절대적 권리론으로 단순화하지 않는다. Dworkin의 권리는 정치도덕적·해석적 정당화 속에서 작동하며 현대 비례성 이론과 동일하지 않다.'
    },
    habermas:{
      status:'핵심필수 검증',
      primary:[
        {citation:'Jürgen Habermas, Between Facts and Norms, trans. William Rehg (MIT Press, 1996).',pinpoint:'discourse principle p. 107; democracy principle p. 110; private autonomy와 public autonomy의 상호전제 관계 p. 128 부근. 판본에 따라 문장배치 재확인.',url:'https://books.google.com/books?q=Habermas+Between+Facts+and+Norms+1996'}
      ],
      followUp:[
        {citation:'James Gordon Finlayson, The Habermas–Rawls Debate (Columbia University Press, 2019).',pinpoint:'Habermas의 Between Facts and Norms와 Rawls의 political liberalism 사이의 정당성·공적이성·자율성 논쟁을 체계적으로 재구성.',url:'https://doi.org/10.7312/finl16410'}
      ],
      opposition:[
        {citation:'John Rawls, “Political Liberalism: Reply to Habermas,” Journal of Philosophy 92(3) (1995) 132–180.',pinpoint:'pp. 132–180. 민주적 정당성·공적이성·자유의 관계에 관한 Habermas와의 직접 논쟁.',url:'https://doi.org/10.2307/2940843'}
      ],
      usableClaim:'Habermas의 담론이론은 고위험 AI 규범을 전문가·기업의 기술적 판단만으로 정당화하지 않고 영향을 받는 시민·이용자·피해자가 이의제기와 공적 의사형성에 참여할 수 있는 절차가 필요하다는 근거로 사용할 수 있다.',
      caution:'담론원리를 곧바로 특정 설명요구권·알고리즘 이의제기권의 실정법상 근거로 단정하지 않는다. 구체적 권리화에는 헌법·행정절차·개별법상 근거가 별도로 필요하다.'
    },
    alexy:{
      status:'핵심필수 검증',
      primary:[
        {citation:'Robert Alexy, A Theory of Constitutional Rights, trans. Julian Rivers (Oxford University Press, 2002).',pinpoint:'원칙을 optimization requirements로 설명하는 핵심 위치 p. 47; principles와 proportionality의 연결 p. 66; law of balancing p. 102 부근. 직접 인용 시 영문판 쪽수 확인.',url:'https://academic.oup.com/book/9191'}
      ],
      followUp:[
        {citation:'Matthias Klatt & Moritz Meister, The Constitutional Structure of Proportionality (Oxford University Press, 2012).',pinpoint:'Alexy 이후 proportionality의 구조와 정당화 논증을 체계화한 대표 후속문헌.',url:'https://global.oup.com/academic/product/the-constitutional-structure-of-proportionality-9780199662463'}
      ],
      opposition:[
        {citation:'Niels Petersen, “Alexy and the ‘German’ Model of Proportionality: Why the Theory of Constitutional Rights Does Not Provide a Representative Reconstruction of the Proportionality Test,” German Law Journal 21(2) (2020) 163–173.',pinpoint:'pp. 163–173. Alexy의 이론이 독일 연방헌법재판소의 위헌심사 실무를 부분적으로만 재구성한다는 직접 비판.',url:'https://doi.org/10.1017/glj.2020.9'},
        {citation:'Ralf Poscher, “Resuscitation of a Phantom? On Robert Alexy’s Latest Attempt to Save His Concept of Principle,” Ratio Juris 33 (2020).',pinpoint:'원칙=최적화명령이라는 구조 자체에 대한 이론적 비판축.',url:'https://doi.org/10.1111/raju.12286'}
      ],
      usableClaim:'Alexy의 원칙·비례성 이론은 AI 안전의무·로그보존·설명요구가 개인정보·영업비밀·재산권·표현의 자유를 제한할 때 적합성·필요성·균형성을 구조적으로 검토하는 분석틀로 사용할 수 있다.',
      caution:'Alexy의 이론을 독일 헌법재판 실무 그 자체로 동일시하지 않는다. 또한 비례성은 책임귀속의 독립적 근거가 아니라 국가규제·기본권 제한의 정당성을 심사하는 헌법적 도구이다.'
    },
    cane:{
      status:'핵심필수 검증',
      primary:[
        {citation:'Peter Cane, Responsibility in Law and Morality (Hart Publishing, 2002), Ch. 2 “The Nature and Functions of Responsibility”.',pinpoint:'p. 29ff.; outcomes의 중요성 p. 50, social values p. 53, responsibility as relational phenomenon p. 49 부근. 민사·형사 책임 패러다임의 차이도 같은 장과 후속 장에서 확인.',url:'https://books.google.com/books?q=Peter+Cane+Responsibility+in+Law+and+Morality'}
      ],
      followUp:[
        {citation:'William Lucy, “Responsibility in Law and Morality” (book review), Modern Law Review 66(4) (2003) 658–661.',pinpoint:'pp. 658–661. Cane의 outcomes, social values, civil/criminal paradigms, distributive dimension에 대한 직접 평가와 비판.',url:'https://doi.org/10.1111/1468-2230.66040093'},
        {citation:'John Gardner, “The Negligence Standard: Political Not Metaphysical,” Modern Law Review 80(1) (2017) 1–21.',pinpoint:'pp. 1–21. 기본적 책임과 assignable responsibility를 구별하여 법적 책임배분의 제도적 성격을 후속 논의.',url:'https://doi.org/10.1111/1468-2230.12240'}
      ],
      opposition:[
        {citation:'Ernest J. Weinrib, The Idea of Private Law, rev. ed. (OUP, 2012), Ch. 5 “Correlativity”.',pinpoint:'pp. 114–144. 분배적 사회가치보다 원고-피고의 상관적 사법관계를 중심에 두는 교정적 정의론이 Cane의 분배적 요소 강조에 대한 경쟁축.',url:'https://academic.oup.com/book/4099/chapter/145817773'}
      ],
      usableClaim:'Cane은 AI 책임을 단일한 “비난가능성” 문제가 아니라 사전 역할의무, 행위·결과, 피해자 관계, 제도적 책임관행으로 나누는 데 유용하다. 설계·통합·배치·운용 단계별 prospective responsibility와 사고 후 liability를 구별하는 이론적 기반으로 사용할 수 있다.',
      caution:'Cane의 철학적 책임론을 민법상 과실·인과관계·공동불법행위의 구체적 성립요건으로 대체하지 않는다. 법적 책임관행의 구조를 설명하는 메타이론으로 한정한다.'
    },
    calabresi:{
      status:'핵심필수 검증',
      primary:[
        {citation:'Guido Calabresi, The Cost of Accidents: A Legal and Economic Analysis (Yale University Press, 1970; electronic ed. 2008).',pinpoint:'Ch. 4 “Secondary Accident Cost Avoidance: The Loss Spreading and Deep Pocket Methods” pp. 39–67. 사고비용·손실분산 논의의 정확 위치.',url:'https://doi.org/10.12987/9780300157970-007'}
      ],
      followUp:[
        {citation:'Arthur Ripstein, “Equality, Luck, and Responsibility,” Philosophy & Public Affairs 23(1) (1994) 3–23.',pinpoint:'pp. 3–23. 현대 불법행위법에서 Calabresi식 전체 사고손실 최소화·보험·분배 논리가 교정적 책임과 경쟁하는 구조를 명시적으로 검토.',url:'https://doi.org/10.1111/j.1088-4963.1994.tb00002.x'}
      ],
      opposition:[
        {citation:'Jules L. Coleman, Risks and Wrongs (OUP, 2002), Ch. 17 “Wrongfulness”.',pinpoint:'pp. 329–360. wrongful loss와 responsibility를 중심으로 교정적 정의를 구성하여 순수한 비용최소화 설명과 경쟁.',url:'https://doi.org/10.1093/acprof:oso/9780199253616.003.0018'},
        {citation:'Ernest J. Weinrib, The Idea of Private Law, Ch. 5 “Correlativity”.',pinpoint:'pp. 114–144. 특정 원고와 피고의 상관적 권리·의무를 중심에 두는 직접 경쟁축.',url:'https://academic.oup.com/book/4099/chapter/145817773'}
      ],
      usableClaim:'Calabresi는 AI 공급망에서 누가 위험정보를 가장 잘 확보하고 예방·통제·보험할 수 있는지를 비교하여 예방의무와 내부 비용분담을 설계하는 경제적 보조기준으로 사용할 수 있다.',
      caution:'cheapest cost avoider 또는 사고비용 최소화만으로 특정 피고의 외부적 민사책임을 확정하지 않는다. 피해자에 대한 법적 의무·인과·귀책 근거를 먼저 심사하고 경제분석은 제도설계·내부분담의 보조논거로 사용한다.'
    },
    maccormick:{
      status:'핵심필수 검증',
      primary:[
        {citation:'Neil MacCormick, Legal Reasoning and Legal Theory, rev. ed. (Oxford University Press, 1994), Ch. V “Second-Order Justification”.',pinpoint:'pp. 100–128. 선택가능한 법적 결론을 consistency, coherence, consequentialist argument로 2차 정당화하는 핵심 장.',url:'https://academic.oup.com/book/10467/chapter-abstract/158338649'}
      ],
      followUp:[
        {citation:'Aldo Schiavello, “Neil MacCormick’s Second Thoughts on Legal Reasoning and Legal Theory: A Defence of the Original View,” Ratio Juris 24(2) (2011) 140–155.',pinpoint:'pp. 140–155. 초기 Legal Reasoning and Legal Theory와 후기사상 사이의 변화를 분석하고 원래 관점을 방어.',url:'https://doi.org/10.1111/j.1467-9337.2011.00480.x'},
        {citation:'Amalia Amaya, “Legal Justification by Optimal Coherence,” Ratio Juris 24(3) (2011) 304–329.',pinpoint:'pp. 304–329. coherence를 법적 정당화 방법론으로 발전시킨 대표 후속 논의.',url:'https://onlinelibrary.wiley.com/journal/14679337'}
      ],
      opposition:[
        {citation:'Ronald Dworkin, Law’s Empire (Harvard University Press, 1986).',pinpoint:'law as integrity와 constructive interpretation은 원칙·정합성에 더 강한 규범적 역할을 부여하는 경쟁적 법적 추론모형.',url:'https://books.google.com/books?q=Dworkin+Law%27s+Empire'},
        {citation:'Frederick Schauer, Playing by the Rules (Oxford University Press, 1991).',pinpoint:'규칙의 일반화와 제약기능을 더 강하게 평가하는 경쟁축.',url:'https://books.google.com/books?q=Frederick+Schauer+Playing+by+the+Rules'}
      ],
      usableClaim:'MacCormick은 AI 관련 hard case에서 조문에서 바로 답이 나오지 않을 때 유추·원칙·정합성·결과를 어떤 순서로 정당화할지 방법론을 제공한다. 특히 새로운 책임귀속 규칙이 기존 민사법 체계와 모순되지 않는지와 일반화된 결과를 함께 검토하는 데 유용하다.',
      caution:'결과고려를 정책목표에 따른 자유로운 법창조로 이해하지 않는다. 결과논증은 consistency·coherence 및 법적 권한구조 안에서 제한된다.'
    }
  });
})();