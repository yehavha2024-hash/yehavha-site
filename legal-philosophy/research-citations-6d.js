(() => {
  'use strict';
  window.LEGAL_PHILOSOPHY_CITATIONS = window.LEGAL_PHILOSOPHY_CITATIONS || {};

  const checked = '2026-08-19';
  const row = (citation, pinpoint, url='') => ({citation, pinpoint, url});
  const quote = (level, scope, basis) => ({level, scope, basis, checked});
  const entry = ({status='인용검증 완료', primary, followUp, opposition, usableClaim, caution, quoteVerification}) => ({
    status,
    primary:Array.isArray(primary)?primary:[primary],
    followUp:Array.isArray(followUp)?followUp:[followUp],
    opposition:Array.isArray(opposition)?opposition:[opposition],
    usableClaim,
    caution,
    ...(quoteVerification?{quoteVerification}:{})
  });

  Object.assign(window.LEGAL_PHILOSOPHY_CITATIONS, {
    aristotle:entry({
      status:'인용검증 완료 · 직접 인용 가능',
      quoteVerification:quote('직접 인용 가능','분배적 정의·교정적 정의는 Nicomachean Ethics Book V, chs. 3–4 및 Bekker 1131b 이하, 형평은 Book V, ch. 10을 기준으로 직접 인용한다.','공개 원문과 Bekker 표기가 교차 확인됨.'),
      primary:[row('Aristotle, Nicomachean Ethics, Book V, chs. 3–4; ch. 10.','분배적 정의와 교정적 정의의 구별은 Book V, chs. 3–4, 특히 Bekker 1131b 이하. 형평(epieikeia)은 Book V, ch. 10.','https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0054%3Abekker+page%3D1131b'),row('Aristotle, Nicomachean Ethics, trans. W. D. Ross, Book V.','Book V 공개 원문. 판본별 쪽수보다 Book/Chapter/Bekker 표기를 우선.','https://classics.mit.edu/Aristotle/nicomachaen.5.v.html')],
      followUp:row('Ernest J. Weinrib, The Idea of Private Law, 2nd ed. (OUP, 2012), Ch. 3, pp. 56–83.','아리스토텔레스의 교정적 정의를 현대 사법의 상관적 구조로 재구성.','https://academic.oup.com/book/4099/chapter-abstract/145815769'),
      opposition:row('Guido Calabresi, The Cost of Accidents (Yale UP, 1970).','사법책임을 사고비용 최소화와 위험배분으로 분석하는 경쟁축.'),
      usableClaim:'아리스토텔레스의 분배적 정의와 교정적 정의의 구별은 AI 손해의 외부책임, 내부 구상·분담, 위험배분을 서로 다른 정의문제로 나누는 출발점으로 사용할 수 있다.',
      caution:'교정적 정의를 현대 민사법의 특정 책임요건과 동일시하지 않는다. 현대 불법행위론으로 전환할 때 Weinrib·Coleman 등 후속이론을 매개한다.'
    }),
    aquinas:entry({
      status:'인용검증 완료 · 위치 확인',
      quoteVerification:quote('위치 확인','Summa Theologiae I–II q.90 aa.1–4, q.94, q.96의 Question/Article 구조와 공개 영문 번역 위치를 확인했다. 직접 문언을 인용할 때에는 사용할 라틴어·번역판을 최종 대조한다.','New Advent 공개본에서 q.90·q.94·q.96의 질문·논증 구조를 교차 확인함.'),
      primary:[row('Thomas Aquinas, Summa Theologiae, I–II, q. 90, aa. 1–4.','법의 본질을 이성·공공선·정당한 권위·공포의 요소로 분석. q./a. 표기를 기준으로 인용.','https://www.newadvent.org/summa/2090.htm'),row('Thomas Aquinas, Summa Theologiae, I–II, q. 94.','자연법의 성격·명제·보편성·변경가능성을 다루는 Question 94.','https://www.newadvent.org/summa/2094.htm'),row('Thomas Aquinas, Summa Theologiae, I–II, q. 96.','인간법의 범위·구속력·공동체 지향과 법문을 벗어난 적용 문제를 다루는 Question 96.','https://www.newadvent.org/summa/2096.htm')],
      followUp:row('John Finnis, Natural Law and Natural Rights, 2nd ed. (OUP, 2011), Chs. III–VI.','기본적 선·실천이성·공동선을 현대 자연법론으로 재구성.','https://books.google.com/books/about/Natural_Law_and_Natural_Rights.html?id=zHBCAgAAQBAJ'),
      opposition:row('John Austin, The Province of Jurisprudence Determined, Lecture I.','법의 존재를 명령·의무·제재 구조로 분석하는 고전적 법실증주의 대립축.','https://www.cambridge.org/core/books/abs/austin-the-province-of-jurisprudence-determined/lecture-i/DFACA9497BB9458160B9AC7DAFA2A043'),
      usableClaim:'AI 규제나 책임특례의 정당성은 단순한 제정 사실만이 아니라 공공선과 규범적 목적의 정당화 문제로 별도 검토할 수 있다.',
      caution:'중세 자연법론을 현대 위헌심사나 기본권 심사기준과 직접 동일시하지 않는다.'
    }),
    hobbes:entry({
      status:'인용검증 완료 · 직접 인용 가능',
      quoteVerification:quote('직접 인용 가능','Leviathan Part II Chs. XVII–XVIII과 Ch. XXVI의 공개 원문에서 안전·공통권력·주권권능·civil law 정의의 위치를 직접 확인했다.','Project Gutenberg의 공개 원문과 장 제목·본문을 대조함.'),
      primary:row('Thomas Hobbes, Leviathan, Part II, Chs. XVII–XVIII; Ch. XXVI.','Ch. XVII–XVIII은 공통권력과 안전, Ch. XXVI는 civil law와 명령의 구조. 장 번호를 기준으로 인용.','https://www.gutenberg.org/files/3207/3207-h/3207-h'),
      followUp:row('Joseph Raz, The Morality of Freedom (OUP, 1986), Ch. 3, pp. 38–69.','권위를 단순 강제력이 아니라 정당화된 이유구조로 재구성.','https://academic.oup.com/book/9926/chapter-abstract/157253316'),
      opposition:row('John Locke, Second Treatise of Government, §§4, 87, 123–131.','자연적 자유·권리와 정부권력 제한의 대립축.','https://www.gutenberg.org/files/7370/7370-h/7370-h.htm'),
      usableClaim:'고위험 AI 규제의 공적 안전·질서 정당화 배경을 설명하되, 현대적 규제 정당성은 별도의 기본권 심사를 거쳐야 한다.',
      caution:'홉스의 강한 주권론을 현대 기본권 제한의 직접 근거로 사용하지 않는다.'
    }),
    locke:entry({
      status:'인용검증 완료 · 직접 인용 가능',
      quoteVerification:quote('직접 인용 가능','Second Treatise §§4, 87, 123–131의 공개 원문에서 자연적 자유, 정치사회 형성, 정부 목적과 입법권 한계의 위치를 직접 확인했다.','Project Gutenberg 공개 원문에서 절 번호와 문맥을 대조함.'),
      primary:[row('John Locke, Second Treatise of Government, §§4, 87, 123–131.','§4 자연적 자유, §87 정치사회 형성, §§123–131 정부 형성 목적과 입법권 한계.','https://www.gutenberg.org/files/7370/7370-h/7370-h.htm'),row('John Locke, Second Treatise of Government, §131.','정부권력은 구성원의 보전이라는 목적을 넘어 무제한 확장될 수 없다는 제한 논증.','https://www.gutenberg.org/files/7370/7370-h/7370-h.htm')],
      followUp:row('Robert Nozick, Anarchy, State, and Utopia (Basic Books, 1974), Ch. 3, pp. 26–53.','개인 권리를 국가목표에 대한 side constraints로 강화.'),
      opposition:row('Thomas Hobbes, Leviathan, Part II, Chs. XVII–XVIII.','안전과 질서를 위해 강한 공적 권위를 정당화하는 대립축.'),
      usableClaim:'AI 규제가 정보·재산·직업·표현의 자유를 제한할 때 권력의 목적과 한계를 묻는 고전적 제한정부 논거로 사용할 수 있다.',
      caution:'Locke의 property를 현행 헌법상 재산권 범위와 직접 등치하지 않는다.'
    }),
    bentham:entry({
      status:'인용검증 완료 · 직접 인용 가능',
      quoteVerification:quote('직접 인용 가능','An Introduction to the Principles of Morals and Legislation Ch. I §§I–IV의 공개 전문에서 효용원칙과 공동체 이익 정의의 위치를 직접 확인했다.','University of Texas 공개 원문에서 Chapter I §§I–IV를 대조함.'),
      primary:row('Jeremy Bentham, An Introduction to the Principles of Morals and Legislation, Ch. I, especially §§I–IV.','효용원칙과 community interest의 정의가 제시되는 핵심 구간. 장·절 표기를 우선.','https://laits.utexas.edu/poltheory/bentham/ipml/ipml.c01.html'),
      followUp:row('Guido Calabresi, The Cost of Accidents (Yale UP, 1970).','사고비용·예방비용·제도비용을 결합한 현대 위험배분론.'),
      opposition:row('John Rawls, A Theory of Justice, rev. ed., §§11–17, 26.','기본적 자유와 공정한 정의원칙을 총효용에 종속시키지 않는 대립축.'),
      usableClaim:'AI 책임제도를 피해예방·보험가능성·혁신비용·행정비용 등 실제 결과의 관점에서 평가하는 보조기준으로 활용할 수 있다.',
      caution:'효용 극대화를 책임귀속의 단독 기준으로 사용하지 않고 기본권·교정적 정의와 함께 사용한다.'
    }),
    mill:entry({
      status:'인용검증 완료 · 직접 인용 가능',
      quoteVerification:quote('직접 인용 가능','해악원칙은 On Liberty Ch. I 공개 원문에서 직접 확인하고 적용범위는 Ch. IV와 함께 인용한다.','Project Gutenberg 공개 원문과 장 구조 확인.'),
      primary:row('John Stuart Mill, On Liberty, Ch. I “Introductory”; Ch. IV “Of the Limits to the Authority of Society over the Individual.”','Ch. I 해악원칙 정식화와 Ch. IV의 자유 제한 경계를 함께 읽는다.','https://www.gutenberg.org/ebooks/34901'),
      followUp:row('Joel Feinberg, The Moral Limits of the Criminal Law, Vol. 1: Harm to Others (OUP, 1984).','harm principle을 위해·권리·이익 침해의 현대적 분석으로 정교화.'),
      opposition:row('Gerald Dworkin, “Paternalism,” The Monist 56(1) (1972), pp. 64–84.','일정한 paternalism의 정당화 조건을 검토하는 경쟁축.'),
      usableClaim:'AI 사용의 자유를 원칙으로 두되 타인에게 구체적 해악을 초래하거나 상당한 위험을 부과하는 경우 규제개입을 정당화하는 자유주의적 기준으로 사용할 수 있다.',
      caution:'예방적 위험규제는 실제 손해 이전에도 가능하므로 해악원칙만으로 규제 문턱을 결정하지 않는다.'
    }),
    austin:entry({
      status:'인용검증 완료 · 위치 확인',
      quoteVerification:quote('위치 확인','Wilfrid E. Rumble 편 Cambridge 판에서 Lecture I pp.18–37, Lecture VI pp.164–293의 공식 장·쪽수와 요약을 확인했다. 직접 문언은 사용할 판본 본문에서 최종 대조한다.','Cambridge Core의 공식 chapter metadata와 summary를 교차 확인함.'),
      primary:[row('John Austin, The Province of Jurisprudence Determined, ed. W. Rumble (CUP, 1995), Lecture I, pp. 18–37.','법·명령·의무·제재의 상관구조.','https://www.cambridge.org/core/books/abs/austin-the-province-of-jurisprudence-determined/lecture-i/DFACA9497BB9458160B9AC7DAFA2A043'),row('John Austin, The Province of Jurisprudence Determined, Lecture VI, pp. 164–293.','독립 정치사회와 주권적 상위자의 구조.','https://www.cambridge.org/core/books/abs/austin-the-province-of-jurisprudence-determined/lecture-vi/1ECA605BA8D3CF3284787E2C72D742CA')],
      followUp:row('H. L. A. Hart, The Concept of Law, 3rd ed. (OUP, 2012), Chs. II–IV.','명령·위협 모델을 비판하고 규칙 중심 법체계로 전환.'),
      opposition:row('Lon L. Fuller, “Positivism and Fidelity to Law,” Harvard Law Review 71(4) (1958), pp. 630–672.','법의 절차적 도덕성과 법치 조건을 강조하는 대립축.','https://www.jstor.org/stable/1338226'),
      usableClaim:'AI가 규칙을 생성·집행한다는 사실과 법적 권위의 존재를 구별하는 분석의 출발점으로 사용할 수 있다.',
      caution:'현대 법실증주의를 Austin의 명령설로 환원하지 않는다.'
    }),
    radbruch:entry({
      status:'인용검증 완료 · 간접 인용 권장',
      quoteVerification:quote('간접 인용 권장','Radbruch formula의 영어 번역 위치는 OJLS 26(1), pp. 1–11로 확인되지만 직접 인용은 사용할 번역판의 문언을 다시 대조한다.','원출전과 번역판 서지는 확인되었으나 번역문언의 판본차를 통제할 필요가 있음.'),
      primary:row('Gustav Radbruch, “Statutory Lawlessness and Supra-Statutory Law (1946),” trans. B. L. Paulson & S. L. Paulson, Oxford Journal of Legal Studies 26(1) (2006), pp. 1–11.','극단적 부정의와 실정법의 효력 문제. 직접 인용 전 해당 번역 PDF의 문언을 최종 대조.','https://academic.oup.com/ojls/article-abstract/26/1/1/1505665'),
      followUp:row('Robert Alexy, “On the Concept and the Nature of Law,” Ratio Juris 21(3) (2008), pp. 281–299.','Radbruch formula를 비실증주의 법개념과 연결하는 대표 후속논의.','https://doi.org/10.1111/j.1467-9337.2008.00391.x'),
      opposition:row('H. L. A. Hart, “Positivism and the Separation of Law and Morals,” Harvard Law Review 71(4) (1958), pp. 593–629.','법의 존재와 도덕적 평가를 분석적으로 구별하는 대립축.'),
      usableClaim:'법적 안정성은 중요하지만 극단적 부정의에서는 실정법의 정당성과 효력 관계를 다시 문제 삼는 경계논증으로 사용할 수 있다.',
      caution:'Radbruch formula를 일반적인 부당성이나 정책적 불만에 확대하지 않는다.'
    }),
    fuller:entry({
      status:'인용검증 완료 · 간접 인용 권장',
      quoteVerification:quote('간접 인용 권장','The Morality of Law Ch. II는 p. 33에서 시작하며 eight ways to fail to make law의 구조가 확인된다. 직접 문언은 사용하는 판본에서 다시 대조한다.','공개 발췌와 출판정보로 장·구조는 확인되었으나 판본별 페이지·문언 차를 통제함.'),
      primary:row('Lon L. Fuller, The Morality of Law, rev. ed. (Yale UP, 1969), Ch. II “The Morality that Makes Law Possible,” beginning p. 33.','일반성·공포·장래성·명확성·비모순성·준수가능성·안정성·공식행위와 규칙의 합치라는 legality 조건을 다루는 핵심 장.','https://www.open.edu/openlearn/ocw/pluginfile.php/612902/mod_resource/content/1/a222_1_moralities.pdf'),
      followUp:row('Kristen Rundle, Forms Liberate: Reclaiming the Jurisprudence of Lon L Fuller (Hart, 2012).','Fuller의 legality·agency·법치 논의를 현대적으로 재구성.'),
      opposition:row('H. L. A. Hart, “Positivism and the Separation of Law and Morals,” Harvard Law Review 71(4) (1958), pp. 593–629.','법의 유효성과 도덕을 분리하는 대표 대립축.'),
      usableClaim:'AI 규제의 불명확한 위험기준, 소급적 기준변경, 준수불가능한 의무, 자동집행과 공표규칙의 불일치를 법치의 절차적 결함으로 분석할 수 있다.',
      caution:'Fuller의 내적 도덕성을 실체적 정의의 충분조건으로 과장하지 않는다.'
    }),
    nozick:entry({
      status:'인용검증 완료 · 간접 인용 권장',
      quoteVerification:quote('간접 인용 권장','Anarchy, State, and Utopia Ch. 3 pp. 26–53 및 Ch. 7 p. 149 이하의 위치는 확인되었으나 직접 문언은 사용판본을 최종 대조한다.','Google Books/학술 안내의 장·페이지 구조 확인.'),
      primary:[row('Robert Nozick, Anarchy, State, and Utopia (Basic Books, 1974), Ch. 3 “Moral Constraints and the State,” pp. 26–53.','side constraints와 개인권리의 강한 제약기능.'),row('Robert Nozick, Anarchy, State, and Utopia, Ch. 7 “Distributive Justice,” beginning p. 149.','entitlement theory와 patterned principles 비판.')],
      followUp:row('Stanford Encyclopedia of Philosophy, “Robert Nozick’s Political Philosophy.”','권리제약·소유권·최소국가 논증의 구조를 정리한 후속 검증자료.','https://plato.stanford.edu/entries/nozick-political/'),
      opposition:row('John Rawls, A Theory of Justice, rev. ed. (1999).','사회 기본구조의 공정성과 분배원칙을 강조하는 직접 대립축.'),
      usableClaim:'책임기금·강제보험·공탁·데이터 의무가 기업·이용자의 자유와 재산에 부과하는 부담의 정당화 한계를 검토하는 반대축으로 사용할 수 있다.',
      caution:'Nozick의 정치철학을 현행 재산권·직업의 자유 심사공식으로 직접 대체하지 않는다.'
    }),
    raz:entry({
      status:'인용검증 완료 · 간접 인용 권장',
      quoteVerification:quote('간접 인용 권장','The Morality of Freedom Ch. 3 “The Justification of Authority,” pp. 38–69 위치가 OUP에서 확인됨. 직접 문언은 사용판본에서 재대조한다.','OUP 장·쪽수 확인, 본문 직접 인용문은 최종판본 대조 필요.'),
      primary:row('Joseph Raz, The Morality of Freedom (OUP, 1986), Ch. 3 “The Justification of Authority,” pp. 38–69.','service conception of authority의 핵심 장.','https://academic.oup.com/book/9926/chapter-abstract/157253316'),
      followUp:row('Joseph Raz, “The Problem of Authority: Revisiting the Service Conception,” Minnesota Law Review 90 (2006), pp. 1003–1044.','service conception을 재검토·정교화한 후속논문.'),
      opposition:row('Ronald Dworkin, Law’s Empire (Harvard UP, 1986).','법적 권위를 integrity와 해석적 정당화에서 설명하는 경쟁축.'),
      usableClaim:'AI 의사결정지원 시스템의 출력이 독립된 권위가 아니라 인간이 이미 적용받는 이유를 더 잘 따르도록 돕는 보조수단이어야 하는지 검토하는 데 활용할 수 있다.',
      caution:'Raz의 정상정당화명제를 AI 시스템 자체의 법적 권위 인정 근거로 역전시키지 않는다.'
    }),
    finnis:entry({
      status:'인용검증 완료 · 위치 확인',
      quoteVerification:quote('위치 확인','Natural Law and Natural Rights 2nd ed.의 Ch. III p.59, Ch. IV p.81, Ch. V p.100, Ch. VI p.134 장 시작 위치를 2판 서지·목차와 대조했다. 직접 문언은 OUP 사용판본에서 최종 확인한다.','2011년 2판 서지와 상세 목차의 장 시작 페이지를 교차 확인함.'),
      primary:row('John Finnis, Natural Law and Natural Rights, 2nd ed. (OUP, 2011), Chs. III–VI.','Ch. III p. 59, Ch. IV p. 81, Ch. V p. 100, Ch. VI p. 134부터. basic goods·practical reasonableness·community/common good의 핵심 구간.','https://search.worldcat.org/title/Natural-law-and-natural-rights/oclc/760886285'),
      followUp:row('Stanford Encyclopedia of Philosophy, “The Natural Law Tradition in Ethics.”','현대 자연법론과 실천이성 논의의 배경 검증자료.','https://plato.stanford.edu/entries/natural-law-ethics/'),
      opposition:row('H. L. A. Hart, The Concept of Law, 3rd ed. (OUP, 2012).','법의 유효성을 도덕적 선과 개념적으로 동일시하지 않는 법실증주의 대립축.'),
      usableClaim:'AI 규범을 위험관리·효율만이 아니라 인간의 기본적 선과 공동선, 실천이성이라는 규범적 차원에서 평가하는 보조축으로 사용할 수 있다.',
      caution:'Finnis의 기본적 선 목록을 헌법상 기본권 목록이나 직접적인 입법요건으로 동일시하지 않는다.'
    }),
    barak:entry({
      status:'인용검증 완료 · 직접 인용 가능',
      quoteVerification:quote('직접 인용 가능','Proportionality Ch. 6 pp. 131–174 및 Chs. 9–12의 공식 Cambridge 장·페이지 위치가 확인되어 구조적 명제는 직접 인용 가능하다.','Cambridge Core 공식 장 PDF와 목차의 페이지 범위를 교차 확인함.'),
      primary:[row('Aharon Barak, Proportionality: Constitutional Rights and their Limitations (CUP, 2012), Ch. 6, pp. 131–174.','proper purpose, rational connection, necessity, proportionality stricto sensu의 전체 구조.','https://www.cambridge.org/core/services/aop-cambridge-core/content/view/5D27E24EBDCE307FE5DF0F7550508B3F/9781139035293c6_p131-174_CBO.pdf/the-nature-and-function-of-proportionality.pdf'),row('Aharon Barak, Proportionality, Chs. 9–12.','Ch. 9 proper purpose pp. 245–302; Ch. 10 rational connection pp. 303–316; Ch. 11 necessity pp. 317–339; Ch. 12 proportionality stricto sensu pp. 340–370.','https://www.cambridge.org/core/books/proportionality/6E9C523D5653FEE453068DEFECF4C4F5')],
      followUp:row('Robert Alexy, A Theory of Constitutional Rights (OUP, English trans. 2002).','원칙이론과 비례성의 구조적 연계를 제공하는 대표 이론축.'),
      opposition:row('Grégoire Webber, The Negotiable Constitution (CUP, 2009).','비례성·형량 중심 권리심사의 한계를 비판하는 경쟁축.'),
      usableClaim:'AI 안전·투명성·로그보존·책임추정 의무를 목적의 정당성, 합리적 관련성, 필요성, 법익균형성 순으로 구조화해 심사하는 데 직접 활용할 수 있다.',
      caution:'비례성을 자동 결론 산식으로 취급하지 않고 보호범위·제한·정당화와 입증구조를 구체적 헌법질서에 맞게 설정한다.'
    }),
    weinrib:entry({
      status:'인용검증 완료 · 위치 확인',
      quoteVerification:quote('위치 확인','The Idea of Private Law Ch. 3 pp. 56–83, Ch. 5 pp. 114–144의 공식 위치는 확인됨. 직접 문장은 OUP 사용판본 원문에서 최종 확인한다.','Oxford Academic의 공식 장·쪽수와 초록을 확인함.'),
      primary:row('Ernest J. Weinrib, The Idea of Private Law, 2nd ed. (OUP, 2012), Ch. 3 “Corrective Justice,” pp. 56–83; Ch. 5 “Correlativity,” pp. 114–144.','원고와 피고의 상관적 규범지위와 교정적 정의를 검토하는 핵심 위치.','https://academic.oup.com/book/4099'),
      followUp:row('Ernest J. Weinrib, Corrective Justice (OUP, 2012).','correlativity와 권리·의무 구조를 확장한 후속 단행본.','https://academic.oup.com/book/6436'),
      opposition:row('Guido Calabresi, The Cost of Accidents (Yale UP, 1970).','사회적 효율·위험배분 중심의 도구주의적 대립축.'),
      usableClaim:'AI 손해에서 왜 특정 피고가 특정 원고에게 배상해야 하는지를 원고-피고 사이의 상관적 권리·의무 관계로 별도 정당화하는 데 활용할 수 있다.',
      caution:'교정적 정의만으로 보험·기금·다수주체 공급망의 위험분산을 모두 설명하지 않는다.'
    }),
    schauer:entry({
      status:'인용검증 완료 · 위치 확인',
      quoteVerification:quote('위치 확인','Playing by the Rules의 1991 Clarendon Press/OUP 인쇄판 서지와 OUP 장별 위치 Ch. 2 pp.17–37, Ch. 3 pp.38–52를 확인했다. 직접 문언은 사용할 판본에서 최종 대조한다.','WorldCat 인쇄판 서지와 Oxford Academic 공식 chapter metadata를 교차 확인함.'),
      primary:[row('Frederick Schauer, Playing by the Rules (Clarendon Press/OUP, 1991), Ch. 2 “Rules as Generalizations,” pp. 17–37.','§2.7의 under- and over-inclusiveness를 포함한 규칙 일반화 논증.','https://academic.oup.com/book/4020/chapter-abstract/145660096'),row('Frederick Schauer, Playing by the Rules, Ch. 3 “The Entrenchment of Generalizations,” pp. 38–52.','규칙 일반화가 독립된 결정이유가 되는 구조.','https://academic.oup.com/book/4020/chapter-abstract/145660991')],
      followUp:row('Frederick Schauer, Thinking Like a Lawyer (Harvard UP, 2009).','규칙·선례·권위의 법적 추론 기능을 실천적으로 확장.'),
      opposition:row('Ronald Dworkin, Taking Rights Seriously, “The Model of Rules.”','법판단을 규칙뿐 아니라 원칙·권리논증으로 확장하는 대립축.'),
      usableClaim:'AI 위험등급·고위험 시스템 정의의 과잉·과소포섭을 인정하면서도 예측가능성과 통제가능성이라는 규칙의 제도적 가치를 분석할 수 있다.',
      caution:'과잉·과소포섭이 곧 규칙의 실패를 뜻하지 않으며, 기본권 침해가 큰 영역에는 예외·이의제기·개별심사를 결합한다.'
    }),
    'haeberle-open-society':entry({
      status:'인용검증 완료 · 위치 확인',
      quoteVerification:quote('위치 확인','독일 원논문은 JuristenZeitung 30(10), 1975, pp. 297–305로 서지가 확인됨. 독일어 직접 인용은 원 JZ 판본을 최종 대조한다.','JSTOR 수록 호와 LEO-BW 서지정보에서 권·호·연도·페이지를 교차 확인함.'),
      primary:row('Peter Häberle, “Die offene Gesellschaft der Verfassungsinterpreten,” JuristenZeitung 30(10) (1975), pp. 297–305.','국가기관 밖 시민·집단 등 다양한 해석주체를 포함하는 열린 헌법해석사회 논증의 원출전.','https://www.leo-bw.de/web/guest/detail/-/Detail/details/DOKUMENT/bsz_swb/1145732070/Die%20offene%20Gesellschaft%20der%20Verfassungsinterpreten%20ein%20Beitrag%20zur%20pluralistischen%20und%20%22prozessualen%22%20Verfassungsinterpr'),
      followUp:row('Peter Häberle, Verfassung als öffentlicher Prozeß (Duncker & Humblot, 1978), pp. 155–181.','1975년 논문을 보강한 후속 단행본 수록 위치.'),
      opposition:row('전통적 기관중심 헌법해석론.','헌법해석의 법적 권위와 최종적 구속력을 법원·공권력기관에 집중하는 접근.'),
      usableClaim:'AI 규범형성을 기술기업·행정기관의 폐쇄적 전문판단에 한정하지 않고 이용자·피해자·학계·시민사회의 참여와 공론을 제도화하는 절차적 논거로 활용할 수 있다.',
      caution:'다원적 참여와 헌법기관의 최종 법적 권한·책임을 구별한다.'
    }),
    'ripstein-private-wrong':entry({
      status:'인용검증 완료 · 위치 확인',
      quoteVerification:quote('위치 확인','Private Wrongs Ch. 1 pp. 1–28, Ch. 4 pp. 80–122, Ch. 8 pp. 233–262의 장·페이지 구조가 확인됨. 특정 직접 문장은 원문 접근본에서 최종 대조한다.','공식 장별 페이지는 확인되었으나 전체 본문 접근이 제한됨.'),
      primary:[row('Arthur Ripstein, Private Wrongs (Harvard UP, 2016), Ch. 1, pp. 1–28.','사적 wrong을 독립된 관계적 문제로 설정하는 서론.','https://www.degruyterbrill.com/document/doi/10.4159/9780674969896-001/html'),row('Arthur Ripstein, Private Wrongs, Ch. 4, pp. 80–122; Ch. 8, pp. 233–262.','책임부담과 사법적 구제의 관계를 구체화.','https://www.degruyterbrill.com/document/doi/10.4159/9780674969896/html')],
      followUp:row('Sandy Steel, “Saving Private Wrongs,” Jerusalem Review of Legal Studies 14(1), pp. 1–21.','Ripstein 이론의 주요 명제와 비판을 정리.','https://academic.oup.com/jrls/article/14/1/1/3061392'),
      opposition:row('법경제학적 불법행위 이론.','private wrong보다 억지·비용최소화·효율을 중심에 두는 Calabresi형 접근.'),
      usableClaim:'AI가 통계적 위험만 증가시킨 경우와 특정 피해자에 대한 법적 wrong을 발생시킨 경우를 구별하는 관계적 책임논거로 활용할 수 있다.',
      caution:'Kantian tort theory를 한국 민법상 위법성·과실·인과관계 요건의 직접 해석론으로 사용하지 않는다.'
    }),
    'fletcher-reciprocity':entry({
      status:'인용검증 완료 · 직접 인용 가능',
      quoteVerification:quote('직접 인용 가능','Harvard Law Review 85(3), pp. 537–573의 공개 전문이 확인되어 reciprocity of risk 논증을 직접 인용할 수 있다.','Columbia 서지와 Harvard 공개 전문 교차 확인.'),
      primary:row('George P. Fletcher, “Fairness and Utility in Tort Theory,” Harvard Law Review 85(3) (1972), pp. 537–573.','reciprocity paradigm과 reasonableness/utility paradigm의 대비.','https://cyber.harvard.edu/torts3y/readings/fletcher.html'),
      followUp:row('Arthur Ripstein, Private Wrongs (Harvard UP, 2016).','관계적 자유와 private wrong을 체계화한 비도구주의 후속축.'),
      opposition:row('Guido Calabresi, The Cost of Accidents (Yale UP, 1970).','사고비용 최소화와 효율적 위험배분의 경쟁축.'),
      usableClaim:'고위험 AI가 일반 사회생활의 상호적 위험 수준을 넘어 비대칭·비상호적 위험을 타인에게 부과하는 경우 책임강화를 정당화하는 보조기준으로 사용할 수 있다.',
      caution:'위험의 비상호성을 곧바로 무과실책임의 법정요건으로 등치하지 않는다.'
    }),
    'gunkel-robot-rights':entry({
      status:'인용검증 완료 · 직접 인용 가능',
      quoteVerification:quote('직접 인용 가능','Ethics and Information Technology 20(2), pp. 87–99의 CC BY 공개원문이 확인되어 can/should 구별과 관계적 접근을 직접 인용할 수 있다.','Springer 공식 오픈액세스 원문과 DOI 확인.'),
      primary:[row('David J. Gunkel, “The Other Question: Can and Should Robots Have Rights?,” Ethics and Information Technology 20(2) (2018), pp. 87–99.','can/should 구별과 관계적 대안 제시.','https://link.springer.com/article/10.1007/s10676-017-9442-4'),row('David J. Gunkel, Robot Rights (MIT Press, 2018), Chs. 1–6.','Chs. 2–5에서 can/should 조합을 검토하고 Ch. 6에서 대안적 접근 제시.','https://direct.mit.edu/books/monograph/4125/Robot-Rights')],
      followUp:row('Abeba Birhane & Jelle van Dijk, “Robot Rights? Let’s Talk about Human Welfare Instead,” AIES ’20: Proceedings of the AAAI/ACM Conference on AI, Ethics, and Society (ACM, 2020), pp. 207–213.','robot rights보다 실제 인간복지와 설계·판매·배치 주체의 책임 문제를 우선하는 비판적 후속논의.','https://doi.org/10.1145/3375627.3375855'),
      opposition:row('Joanna J. Bryson, Mihailis E. Diamantis & Thomas D. Grant, “Of, for, and by the People,” Artificial Intelligence and Law 25 (2017), pp. 273–291.','인공적 법인격의 책임회피·인간책임 약화 위험을 지적하는 법적 반대축.','https://doi.org/10.1007/s10506-017-9214-9'),
      usableClaim:'로봇·AI 권리 문제를 내부 의식이나 인간유사성만으로 결정하지 않고 사회적 관계와 상호작용의 변화까지 검토해야 한다는 장기적 반대가설로 사용할 수 있다.',
      caution:'Gunkel을 현재 AI에 인간과 동등한 기본권이나 전면적 법인격을 부여해야 한다는 주장으로 단순화하지 않는다.'
    })
  });

  const ids = ['aristotle','aquinas','hobbes','locke','bentham','mill','austin','radbruch','fuller','nozick','raz','finnis','barak','weinrib','schauer','haeberle-open-society','ripstein-private-wrong','fletcher-reciprocity','gunkel-robot-rights'];
  const quoteIds = ids.filter(id => window.LEGAL_PHILOSOPHY_CITATIONS[id]?.quoteVerification);
  const uniformIds = ids.filter(id => {
    const item = window.LEGAL_PHILOSOPHY_CITATIONS[id];
    return Boolean(
      item &&
      item.status &&
      Array.isArray(item.primary) && item.primary.length &&
      Array.isArray(item.followUp) && item.followUp.length &&
      Array.isArray(item.opposition) && item.opposition.length &&
      item.usableClaim &&
      item.caution &&
      item.quoteVerification?.level &&
      item.quoteVerification?.scope &&
      item.quoteVerification?.basis
    );
  });
  const baseIds = Array.isArray(window.LEGAL_PHILOSOPHY)
    ? window.LEGAL_PHILOSOPHY.map(item => item?.id).filter(Boolean)
    : [];
  const missingIds = baseIds.filter(id => !window.LEGAL_PHILOSOPHY_CITATIONS[id]);
  const covered = baseIds.filter(id => window.LEGAL_PHILOSOPHY_CITATIONS[id]).length;

  window.LEGAL_PHILOSOPHY_CITATION_AUDIT = Object.freeze({
    checked,
    added:ids.length,
    totalExpected:baseIds.length || 56,
    totalCovered:covered || Object.keys(window.LEGAL_PHILOSOPHY_CITATIONS).length,
    missingIds:Object.freeze([...missingIds]),
    quoteVerified:quoteIds.length,
    uniformVerified:uniformIds.length,
    uniformExpected:ids.length,
    uniformComplete:uniformIds.length === ids.length,
    complete:(baseIds.length ? missingIds.length === 0 : Object.keys(window.LEGAL_PHILOSOPHY_CITATIONS).length >= 56),
    quoteLevels:quoteIds.reduce((acc,id)=>{
      const level=window.LEGAL_PHILOSOPHY_CITATIONS[id].quoteVerification.level;
      acc[level]=(acc[level]||0)+1;
      return acc;
    },{})
  });
})();
