(() => {
  'use strict';

  const rows = Array.isArray(window.LEGAL_PHILOSOPHY_SYNTHESIS) ? window.LEGAL_PHILOSOPHY_SYNTHESIS : [];
  const patch = {
    '01': {
      proposition:'권리구조의 분석은 “권리주체”라는 총칭보다 청구권·의무·권능·면제의 구체적 법률관계를 먼저 특정해야 한다. AI 관련 분쟁에서도 피해자의 청구권과 인간·법인의 대응의무를 먼저 확정하고, AI 기능단위에 필요한 법적 능력은 그 다음 단계에서 개별적으로 검토하는 것이 분석상 더 정확하다.',
      argument:[
        '빈트샤이트의 판덱텐법학은 Anspruch를 중심으로 실체법상 요구가능성을 체계화하는 데 중요한 역할을 했다. 다만 오늘날의 청구권 개념 전체를 한 문장으로 빈트샤이트에게 귀속시키기보다, 그의 Lehrbuch des Pandektenrechts에서 dingliche und persönliche Ansprüche가 독립된 체계항목으로 다뤄진다는 점을 원전 확인의 출발점으로 삼는 것이 안전하다.',
        '호펠드는 1913년 Yale Law Journal 논문에서 right라는 표현 아래 혼재하던 claim·privilege·power·immunity를 구별하고 각각 duty·no-right·liability·disability와 상관관계에 놓았다. 이 분석은 특정 주체에게 “권리가 있다”는 추상적 표현을 실제 법률관계의 묶음으로 분해하는 데 직접 사용할 수 있다.',
        '옐리네크는 개인과 국가의 법률관계를 status passivus·negativus·positivus·activus로 유형화하였다. 따라서 국가에 대한 방어, 급부·보호 요구, 참여와 같은 공법상 지위를 하나의 권리 개념으로 뭉뚱그리지 않고 기능별로 구별할 수 있다.',
        '드워킨은 규칙만으로 포착되지 않는 원칙과 개인의 권리가 법적 판단에서 독자적 규범적 무게를 가진다고 보았다. 그러나 이러한 권리론을 호펠드의 분석모형과 동일시해서는 안 된다. 호펠드는 법적 지위의 형식을 분석하고, 드워킨은 법해석과 정치도덕에서 권리가 갖는 정당화의 무게를 다룬다.',
        '따라서 AI 민사책임 연구에서는 피해자의 손해배상청구권, 정보·로그 접근 또는 자료제출 요구, 절차적 이의권을 각각 상대방의 의무와 연결하고, AI 기능단위의 소송상 지위·재산보유능력·특정 권능은 별도의 법기술적 문제로 분리하는 논증이 가능하다.'
      ],
      caution:'빈트샤이트·호펠드·옐리네크·드워킨은 하나의 단일한 권리이론 계보가 아니다. 사법상 청구권, 법률관계 분석, 공법상 지위론, 원칙·권리 중심 해석론을 서로 다른 층위의 분석도구로 배열한다.',
      researchConclusion:'연구상 안전한 결론은 “AI가 권리주체인가”를 선결문제로 삼지 않는 것이다. 먼저 인간 피해자의 구체적 청구권과 상대방 의무를 확정하고, 그 후에도 제도적 공백이 남는 경우에만 AI 기능단위의 개별 법적 incidents를 검토한다.',
      references:[
        {type:'원저',citation:'Bernhard Windscheid, Lehrbuch des Pandektenrechts, Bd. 1, 4. Aufl. (1875).',pinpoint:'목차상 “Begriff. Dingliche und persönliche Ansprüche” p.101 확인. 판본별 쪽수 상이.',url:'https://books.google.com/books/about/Lehrbuch_des_Pandektenrechts.html?id=6yhiAAAAcAAJ'},
        {type:'원논문',citation:'Wesley Newcomb Hohfeld, “Some Fundamental Legal Conceptions as Applied in Judicial Reasoning,” 23 Yale Law Journal 16 (1913).',pinpoint:'pp.16–59.',url:'https://www.jstor.org/stable/785533'},
        {type:'원저',citation:'Georg Jellinek, System der subjektiven öffentlichen Rechte (1892; 2nd ed. 1905).',pinpoint:'status passivus·negativus·positivus·activus. 판본별 정확 쪽수는 인용 시 재확인.',url:'https://www.mohrsiebeck.com/buch/system-der-subjektiven-oeffentlichen-rechte-9783161672446/'},
        {type:'원저',citation:'Ronald Dworkin, Taking Rights Seriously (Harvard University Press, 1977).',pinpoint:'권리·원칙 논의. 인용문 사용 시 해당 판본 쪽수 재확인.',url:''},
        {type:'반대·보완',citation:'Joseph Raz, “Professor Dworkin’s Theory of Rights,” 26 Political Studies 123 (1978).',pinpoint:'pp.123–137.',url:'https://doi.org/10.1111/j.1467-9248.1978.tb01528.x'},
        {type:'반대·보완',citation:'D. Frydrych, “What Is the Will Theory of Rights?,” 32 Ratio Juris 455 (2019).',pinpoint:'pp.455–472. Interest Theory와 Will Theory의 경쟁구조 및 Hohfeld 모형과의 구별.',url:'https://doi.org/10.1111/raju.12259'}
      ]
    },
    '02': {
      proposition:'책임귀속은 기술적 인과관계를 법적 책임으로 자동 변환하는 작업이 아니다. 손해를 둘러싼 당사자 관계, 역할, 통제가능성, 위험인수와 제도적 목적을 구별하고, 그중 어떤 이유가 피해자에 대한 외부책임을 정당화하는지 별도로 제시해야 한다.',
      argument:[
        '아리스토텔레스의 교정적 정의는 침해나 거래로 생긴 불균형을 당사자 사이에서 교정하는 정의의 형식을 제시한다. 이는 사법상 책임을 단순한 사회전체의 비용분배와 구별하여 피해자와 책임주체 사이의 관계적 문제로 파악하는 이론적 출발점이다.',
        '하트는 책임을 role-responsibility, causal responsibility, liability responsibility, capacity responsibility 등으로 구별하였다. 따라서 “AI가 원인이었다”, “운영자에게 역할의무가 있었다”, “법적으로 배상책임을 진다”는 명제는 서로 다른 판단이며 한 단계에서 다른 단계로 바로 도약할 수 없다.',
        '케인은 책임을 법과 도덕의 제도적 관행 속에서 분석하면서 책임의 종류, 증명, 관계적 성격과 기능을 구별한다. 이 접근은 AI 사고에서 책임귀속 기준뿐 아니라 누가 어떤 사실을 입증해야 하는지까지 책임제도의 일부로 검토하게 한다.',
        '와인립은 교정적 정의를 원고와 피고가 동일한 부정의의 행위자와 피해자로 상관적으로 연결되는 구조로 설명한다. 반면 칼라브레시의 사고비용론은 사고·예방·관리 비용을 줄이고 위험을 더 잘 통제할 수 있는 위치에 부담을 배치하는 제도설계적 관점을 제시한다.',
        '따라서 다중 AI 에이전트 손해에서는 ① 사실·로그와 인과기여를 재구성하고 ② 설계·통합·배치·운용 주체의 역할·통제를 특정한 뒤 ③ 피해자에 대한 외부책임의 법적 근거를 심사하고 ④ 그 후 내부 구상·분담과 보험·책임재산을 검토하는 순서가 타당하다. 비용효율성은 책임의 유일한 근거가 아니라 제도설계의 보조기준으로 제한해야 한다.'
      ],
      caution:'교정적 정의론과 사고비용론은 서로 경쟁하거나 보완할 수 있지만 동일한 정당화 이론이 아니다. 전자는 당사자 간 권리·의무의 상관성에, 후자는 위험과 사고비용의 제도적 배분에 무게를 둔다.',
      researchConclusion:'AI 책임귀속 연구의 중심 명제는 “인과기여의 발견 → 책임주체 확정”이 아니라 “인과기여 → 역할·통제·법적 의무 → 외부책임 → 내부 분담”의 단계적 귀속이어야 한다.',
      references:[
        {type:'원저',citation:'Aristotle, Nicomachean Ethics, Book V.',pinpoint:'교정적 정의(corrective justice) 부분. 번역판에 따라 쪽수 상이.',url:''},
        {type:'원저',citation:'H. L. A. Hart, Punishment and Responsibility: Essays in the Philosophy of Law, 2nd ed. (OUP, 2008).',pinpoint:'“Postscript: Responsibility and Retribution,” pp.210–237; role·causal·legal-liability·capacity responsibility.',url:'https://academic.oup.com/book/11532/chapter-abstract/160311870'},
        {type:'원저',citation:'Peter Cane, Responsibility in Law and Morality (Hart Publishing, 2002).',pinpoint:'Ch.2 “The Nature and Functions of Responsibility,” 특히 responsibility as a relational phenomenon p.49부터.',url:'https://pegasus.law.columbia.edu/record/186418'},
        {type:'원저',citation:'Ernest J. Weinrib, The Idea of Private Law, rev. ed. (OUP, 2012).',pinpoint:'Ch.5 “Correlativity,” pp.114–144.',url:'https://academic.oup.com/book/4099/chapter/145817773'},
        {type:'원저',citation:'Guido Calabresi, The Costs of Accidents: A Legal and Economic Analysis (Yale University Press, 1970).',pinpoint:'사고비용·위험배분 논의. 인용 시 사용 판본 쪽수 재확인.',url:''},
        {type:'반대·보완',citation:'Aditi Bagchi, “From Private to Public Right: Resizing Correlativity and Systematicity,” 38 Canadian Journal of Law & Jurisprudence 460 (2025).',pinpoint:'pp.460–471. Weinrib의 correlativity가 사법의 복잡성을 충분히 포착하지 못한다는 비판.',url:'https://doi.org/10.1017/cjlj.2025.10050'}
      ]
    },
    '03': {
      proposition:'법인격이 법적으로 구성될 수 있다는 명제와 AI에게 법인격을 부여해야 한다는 명제는 구별되어야 한다. 현대 법인격론이 보여주는 핵심은 법적 지위를 여러 incidents로 분해할 수 있다는 점이며, AI에 대해서는 기존 인간·법인 책임과 보험·책임재산 장치로 해결되지 않는 잔여문제가 확인될 때만 제한적 지위를 검토할 수 있다.',
      argument:[
        '사비니의 의제설과 기르케의 실재단체론은 법인이 독립된 법적 주체가 되는 이유를 서로 다르게 설명한다. 이 논쟁은 법인격이 자연인의 생물학적 속성과 동일하지 않다는 점을 보여주지만, 그 자체로 비인간 AI의 인격을 정당화하지는 않는다.',
        '켈젠은 법적 사람을 권리와 의무가 귀속되는 규범적 통일체로 분석하고, 호펠드는 그 법률관계를 claim·privilege·power·immunity 등으로 분해한다. 이 둘을 결합하면 법인격을 존재론보다 규범적 귀속과 법적 incidents의 문제로 분석할 수 있다.',
        '쿠르키의 법인격 이론은 법인격을 전부 또는 전무의 단일 지위가 아니라 여러 법적 incidents와 관계의 결합으로 분석한다. 이는 제한적·기능적 법적 지위를 검토할 수 있는 분석언어를 제공하지만, 특정 AI 시스템에 그 지위를 실제로 부여해야 한다는 정책결론까지 자동으로 제공하지는 않는다.',
        '솔럼은 AI 법인격을 추상적 찬반으로 결정하기보다 trustee와 constitutional personhood 같은 구체적 법적 역할을 통해 능력과 책임의 조건을 시험하였다. 반면 Chesterman은 법체계가 새로운 인격을 창설할 수 있다는 사실만으로 창설해야 할 이유가 되지 않는다고 명시적으로 비판한다.',
        'Bryson·Diamantis·Grant는 합성적 인격이 도덕적으로 불필요하고 법적으로 문제를 만들 수 있으며, 특히 제조자·개발자의 책임을 인공적 주체로 전가하는 책임회피 장치가 될 위험을 지적한다. 최근 Novelli·Floridi·Sartor·Teubner의 검토도 AI 법인격의 전망이 기술능력뿐 아니라 책임법·대리·데이터보호·사이버보안과의 정합성에 좌우된다고 본다.',
        '따라서 기능적 단위의 피소송능력·책임재산·등록·관리인·보험·공탁을 검토하려면 각 incident가 어떤 구제공백을 해결하는지, 기존 인간·법인의 책임범위를 축소하지 않는지, 독립된 자산풀과 지속적 식별가능성이 있는지를 각각 입증해야 한다.'
      ],
      caution:'“법인격은 법적 구성이다”에서 “그러므로 AI에게 법인격을 부여할 수/해야 한다”로 바로 도약하면 안 된다. 가능성, 필요성, 제도효과는 서로 다른 명제다.',
      researchConclusion:'기능적 법적 지위는 1차 해법이 아니라 잔여적·보충적 해법으로 위치시키는 것이 현재 문헌의 대립구조를 가장 왜곡 없이 반영한다. 특히 책임회피 효과가 나타나면 법인격 부여의 정당성이 약화된다.',
      references:[
        {type:'핵심 현대이론',citation:'Visa A. J. Kurki, A Theory of Legal Personhood (Oxford University Press, 2019).',pinpoint:'법인격의 incidents·bundle 분석. 정확 인용은 사용 판본 쪽수 재확인.',url:'https://academic.oup.com/book/35026'},
        {type:'핵심 현대이론',citation:'Visa A. J. Kurki, Legal Personhood (Cambridge University Press, 2023).',pinpoint:'인간·법인·동물·자연물·AI를 포함하는 법인격 분석.',url:'https://www.cambridge.org/core/elements/legal-personhood/EB28AB0B045936DBDAA1DF2D20E923A0'},
        {type:'AI 원논문',citation:'Lawrence B. Solum, “Legal Personhood for Artificial Intelligences,” 70 North Carolina Law Review 1231 (1992).',pinpoint:'p.1231 이하; trustee와 constitutional personhood를 구체적 시험사례로 사용.',url:'https://peterasaro.org/courses/MMP/legalpersonhood.htm'},
        {type:'반대학설',citation:'Simon Chesterman, “Artificial Intelligence and the Limits of Legal Personality,” 69 International & Comparative Law Quarterly 819 (2020).',pinpoint:'pp.819–844. 법적 창설 가능성과 규범적 필요성을 구별.',url:'https://doi.org/10.1017/S0020589320000366'},
        {type:'반대학설',citation:'Joanna J. Bryson, Mihailis E. Diamantis & Thomas D. Grant, “Of, for, and by the People: The Legal Lacuna of Synthetic Persons,” 25 Artificial Intelligence and Law 273 (2017).',pinpoint:'pp.273–291. 합성적 법인격의 도덕적 불필요성·법적 위험 비판.',url:'https://doi.org/10.1007/s10506-017-9214-9'},
        {type:'최신 문헌검토',citation:'C. Novelli, L. Floridi, G. Sartor & G. Teubner, “AI as legal persons: past, patterns, and prospects,” 52 Journal of Law and Society 533 (2025).',pinpoint:'pp.533–555. personhood 이론·기술능력·제도통합·책임법의 상호작용을 검토.',url:'https://doi.org/10.1111/jols.70021'}
      ]
    },
    '04': {
      proposition:'AI 규제의 기본권 심사는 기술안전이나 혁신이라는 집단목표만으로 정당화될 수 없다. 먼저 어떤 자유·권리가 보호 또는 제한되는지를 특정하고, 그 다음 제한의 정당한 목적·적합성·필요성·법익균형을 검토해야 하며, 권리의 규범적 우선성과 비례성 심사의 한계도 함께 제시해야 한다.',
      argument:[
        '칸트의 법론에서 핵심은 각자의 외적 자유가 모든 사람의 자유와 보편적 법칙 아래 공존할 수 있어야 한다는 것이다. 이는 AI 규제에서 인간의 자유를 단순 효용계산의 변수로만 취급해서는 안 된다는 철학적 기준을 제공하지만, 현대 헌법상 비례성 공식 자체를 칸트에게 귀속시켜서는 안 된다.',
        '롤스는 정의의 제1원칙에서 동등한 기본적 자유의 체계를 제시하고 이를 사회·경제적 이익에 우선시한다. 따라서 기술혁신이나 총효용의 증가가 기본적 자유의 침해를 곧바로 상쇄한다는 논리를 경계할 근거가 된다.',
        '드워킨은 개인의 권리와 법원칙이 단순한 정책목표와 다른 규범적 지위를 가진다고 본다. 이 입장은 AI 산업정책·행정효율 같은 집단목표가 개인정보·평등·절차적 권리를 자동으로 압도하지 못한다는 논증에 사용될 수 있다.',
        '알렉시는 기본권 원칙을 최적화 요구로 설명하고 적합성·필요성·좁은 의미의 비례성으로 연결한다. 그의 Law of Balancing은 한 원칙의 불충족 정도가 커질수록 경쟁 원칙의 실현 중요성도 그만큼 커야 한다는 구조를 제시한다.',
        '바라크 역시 헌법상 권리제한을 비례성 심사로 구조화하지만 알렉시와 권리의 범위·비례성의 헌법적 위치에 관해 차이가 있다. 따라서 두 학자를 하나의 동일한 비례성 이론으로 처리하지 않는 것이 정확하다.',
        'AI 규율에서는 안전·차별방지·피해예방을 위한 국가의 보호조치와 개인정보·표현·재산·직업·절차적 자유의 제한을 동시에 표에 올려놓고, 덜 침해적인 로그·감사·보험·설명의무가 가능한지 검토한 다음 직접적 금지나 광범위한 책임특례로 넘어가야 한다.'
      ],
      caution:'칸트·롤스·드워킨은 비례성 심사의 구성요소가 아니라 권리와 자유의 규범적 지위를 설명하는 철학적 토대다. 알렉시·바라크의 비례성론과 층위를 구별해야 한다.',
      researchConclusion:'AI 기본권 논증은 “안전 대 자유”의 단순 형량이 아니라 ① 권리범위 특정 ② 제한 목적 ③ 적합성 ④ 필요성 ⑤ 좁은 의미의 비례성 ⑥ 권리우선성·법적 확실성에 관한 반론 검토로 구성하는 것이 적절하다.',
      references:[
        {type:'원저',citation:'Immanuel Kant, The Metaphysics of Morals, Doctrine of Right.',pinpoint:'MS 6:237의 innate right 논의가 대표적 출발점.',url:'https://www.cambridge.org/core/books/abs/kants-metaphysics-of-morals/kants-innate-right-as-a-rational-criterion-for-human-rights/6F08BBB82ED9C9C64443758DBEC094D8'},
        {type:'원저',citation:'John Rawls, A Theory of Justice (1971; rev. ed. 1999) / Justice as Fairness: A Restatement (2001).',pinpoint:'동등한 기본적 자유와 우선성. Restatement의 두 원칙은 pp.42–43으로 널리 인용됨.',url:'https://plato.stanford.edu/entries/rawls/'},
        {type:'원저',citation:'Ronald Dworkin, Taking Rights Seriously (1977).',pinpoint:'rights·principles와 collective goals의 구별. 판본별 쪽수 재확인.',url:''},
        {type:'원저',citation:'Robert Alexy, A Theory of Constitutional Rights (OUP English trans., 2002).',pinpoint:'principles as optimization requirements p.47; Law of Balancing p.102가 후속 OUP 논문에서 재확인됨.',url:'https://academic.oup.com/icon/article/3/4/572/792008'},
        {type:'원저·대표논문',citation:'Aharon Barak, “Proportionality (2),” in The Oxford Handbook of Comparative Constitutional Law (2012).',pinpoint:'pp.738–755.',url:'https://academic.oup.com/edited-volume/43728/chapter-abstract/367620265'},
        {type:'내부 대립',citation:'Robert Alexy, “Proportionality, constitutional law, and sub-constitutional law: A reply to Aharon Barak,” 16 International Journal of Constitutional Law 871 (2018).',pinpoint:'pp.871–879. Alexy와 Barak의 권리범위·비례성 위치에 관한 차이.',url:'https://doi.org/10.1093/icon/moy084'},
        {type:'반대학설',citation:'Ariel L. Bendor & Tal Sela, “How proportional is proportionality?,” 13 International Journal of Constitutional Law 530 (2015).',pinpoint:'pp.530–544. 권리의 과도한 확장·비교불가능성·주관성 문제를 비판.',url:'https://doi.org/10.1093/icon/mov028'}
      ]
    },
    '05': {
      proposition:'AI 관련 신유형 분쟁에서 규범의 공백이나 불확실성이 발견되더라도 정책적 필요를 곧바로 법적 결론으로 바꾸어서는 안 된다. 법치주의적 명확성, 기존 법원칙과의 정합성, 법적 논증의 공개가능성, 결과고려, 규칙의 일반화 비용을 단계적으로 점검해야 한다.',
      argument:[
        '풀러는 법이 법으로서 행위지침 기능을 수행하려면 일반성·공포·장래성·명확성·비모순성·준수가능성·상대적 안정성·공식행위와 규칙의 합치라는 legality의 요구를 갖춰야 한다고 보았다. AI 위험등급이나 책임기준이 지나치게 불명확하면 실체적 목적과 별개로 법치주의 문제가 생길 수 있다.',
        '드워킨은 hard case에서 규칙 외에도 법원칙이 판단을 구속할 수 있으며, 법을 하나의 정합적 실천으로 해석하는 접근을 발전시켰다. 그러나 Raz를 비롯한 비판은 이러한 정합성·원칙 중심 접근이 법적 권위와 법원(source)의 한계를 넘어설 위험을 지적한다.',
        '알렉시는 법적 논증을 일반 실천적 담론의 특수사례로 설명하면서 법적 결정의 정당성이 이유제시와 논증의 합리성에 의존한다고 본다. 따라서 AI 책임에서 새로운 기준을 제시하려면 단지 결과가 바람직하다는 이유가 아니라 법적 자료·원칙·논증규칙과 연결해야 한다.',
        '매코믹은 단순 연역이 충분하지 않은 문제사건에서 second-order justification을 요구하고, 경쟁 가능한 판결안을 결과·일관성·정합성으로 시험한다. 이는 유추·원칙·정책논거를 사용하더라도 기존 법체계와의 연결을 명시하게 한다.',
        '샤우어는 규칙이 일반화 때문에 과소포섭과 과잉포섭을 피할 수 없다고 분석한다. 따라서 “고위험 AI”, “자율 에이전트”, “통제가능성” 같은 법정 개념은 완벽한 사례포착이 아니라 예측가능성과 오류비용 사이의 제도적 선택으로 평가해야 한다.',
        '결론적으로 AI 법적 공백은 입법공백·해석공백·증명공백을 나누어야 한다. 현행법 해석으로 가능한 범위와 입법정책 제안을 문단과 표에서 분리하고, 유추나 원칙을 사용할 때는 법적 자료와 반대논증을 함께 제시해야 한다.'
      ],
      caution:'정합성·원칙·비례성은 법률문언이나 제정법상 근거를 대체하는 만능논거가 아니다. 반대로 규칙의 명확성만 강조하면 새로운 기술사례에 대한 법의 적응가능성을 지나치게 제한할 수 있다.',
      researchConclusion:'박사논문의 법적 논증은 “현행법상 해석 → 증명문제 → 규범적 평가 → 입법대안”을 분리하고, 각 단계에서 사용한 논증유형과 반대논거를 명시하는 방식이 가장 검증가능하다.',
      references:[
        {type:'원저',citation:'Lon L. Fuller, The Morality of Law (1964; rev. ed. 1969).',pinpoint:'eight principles of legality. 판본별 쪽수 상이.',url:'https://academic.oup.com/edited-volume/34715/chapter-abstract/296445356'},
        {type:'원저',citation:'Ronald Dworkin, Taking Rights Seriously (1977); Law’s Empire (1986).',pinpoint:'rules/principles 및 law as integrity. 사용 판본 쪽수 재확인.',url:''},
        {type:'원저',citation:'Robert Alexy, A Theory of Legal Argumentation (Clarendon Press/OUP, English trans. 1989).',pinpoint:'Part C: legal discourse as a special case pp.211 이하; outline of legal argumentation pp.221 이하; legal and general practical discourse p.287 이하.',url:'https://pegasus.law.columbia.edu/record/540917'},
        {type:'원저',citation:'Neil MacCormick, Legal Reasoning and Legal Theory, rev. ed. (OUP, 1994).',pinpoint:'Second-order justification pp.100–128; consequentialist arguments pp.129–151; coherence pp.152–194.',url:'https://academic.oup.com/book/10467'},
        {type:'원저',citation:'Frederick Schauer, Playing by the Rules (OUP, 1991/1993 online ed.).',pinpoint:'Ch.2 “Rules as Generalizations,” pp.17–37; under- and over-inclusiveness 포함.',url:'https://academic.oup.com/book/4020/chapter-abstract/145660096'},
        {type:'반대·보완',citation:'Ralf Poscher, “Insights, Errors and Self-Misconceptions of the Theory of Principles,” 22 Ratio Juris 425 (2009).',pinpoint:'pp.425–454. 원칙이론의 규칙/원칙 구조 및 형량 방법론에 대한 비판.',url:'https://doi.org/10.1111/j.1467-9337.2009.00434.x'}
      ]
    },
    '06': {
      proposition:'AI 규범설계에서는 기술적 agency, 도덕적 책임, 법적 책임주체성을 분리해야 한다. 현 단계에서 AI의 자율성·예측곤란성을 곧 인간책임의 소멸이나 AI 법인격의 필요성으로 연결하기보다, 인간·법인의 통제와 역할을 추적하고 증명·보험·위험배분 장치를 먼저 설계한 뒤 잔여적 책임공백이 존재하는지를 검증해야 한다.',
      argument:[
        '하트의 책임개념 분해는 AI가 결과의 인과적 원인이라는 사실과 특정 인간·법인에게 역할책임 또는 법적 배상책임을 부과하는 판단을 구별하게 한다. 케인의 제도적 책임론 역시 책임을 단일한 비난개념이 아니라 관계·증명·기능을 포함하는 책임관행으로 파악한다.',
        '알렉시의 기본권·비례성 논의는 AI 안전을 이유로 정보수집·감시·설명·접근·사용제한 의무를 설계할 때 권리제한의 구조적 통제를 제공한다. 칼라브레시는 위험을 더 잘 회피·보험·분산할 위치를 검토하는 경제적 보조기준을 제공한다.',
        '쿠르키의 법인격 분석은 책임재산·소송지위·특정 권능을 전면적 법인격과 분리해 사고할 수 있게 하지만, 그러한 incidents를 AI에 실제 부여할 필요성은 별도의 제도적 입증을 요구한다.',
        'Matthias는 학습자동화가 제조자·운영자의 예측과 통제를 벗어날 경우 전통적 책임귀속으로 메우기 어려운 responsibility gap이 발생할 수 있다고 제기했다. 이는 AI 책임공백 논쟁의 고전적 출발점이지만 그 결론은 이후 문헌에서 강하게 논쟁되고 있다.',
        'Santoni de Sio와 van den Hoven은 meaningful human control을 tracking과 tracing으로 구성한다. 시스템이 관련된 인간의 도덕적 이유와 환경사실에 반응해야 하고, 결과가 설계·운용 사슬의 적어도 한 인간에게 추적될 수 있어야 한다는 것이다. Nyholm도 현행 자동화시스템의 agency를 인정하면서 이를 독립된 인간 없는 행위보다 human–robot collaboration으로 이해해야 한다고 주장한다.',
        '최근 Kiener는 AI 책임문제를 책임의 “공백”보다 여러 인간·조직에 책임이 중첩되는 “responsibility abundance”로 재구성한다. 이는 다중 에이전트 시스템에서 책임주체가 사라진다는 가정보다 오히려 복수 주체의 책임범위와 내부 분담을 정교화해야 할 가능성을 제시한다.',
        '따라서 AI 규범설계의 우선순위는 ① 로그·추적가능성 ② 역할·통제 기준 ③ 증명위험 조정 ④ 보험·공탁·책임재산 ⑤ 외부책임과 내부구상의 구별이며, 이 수단들로도 피해구제와 책임귀속에 구조적 공백이 남을 때 제한적 법적 지위를 검토하는 순서가 더 신중하다.'
      ],
      caution:'Matthias의 responsibility gap은 주로 도덕적·책임철학적 문제제기이며 곧바로 민사법상 무책임을 의미하지 않는다. 반대로 meaningful human control이나 responsibility abundance도 현행 민사법의 구체적 요건을 자동으로 충족시키는 법리 자체는 아니다.',
      researchConclusion:'AI 규범설계에서 가장 강한 중간결론은 “AI agency의 증가 ≠ 인간·법인 책임의 소멸 ≠ AI 법인격의 필요성”이다. 각 등호 사이에는 별도의 사실인정과 규범적 정당화가 필요하다.',
      references:[
        {type:'고전 문제제기',citation:'Andreas Matthias, “The responsibility gap: Ascribing responsibility for the actions of learning automata,” 6 Ethics and Information Technology 175 (2004).',pinpoint:'pp.175–183.',url:'https://commons.ln.edu.hk/sw_master/759/'},
        {type:'대안이론',citation:'Filippo Santoni de Sio & Jeroen van den Hoven, “Meaningful Human Control over Autonomous Systems: A Philosophical Account,” 5 Frontiers in Robotics and AI 15 (2018).',pinpoint:'tracking condition와 tracing condition.',url:'https://doi.org/10.3389/frobt.2018.00015'},
        {type:'대안이론',citation:'Sven Nyholm, “Attributing Agency to Automated Systems: Reflections on Human–Robot Collaborations and Responsibility-Loci,” 24 Science and Engineering Ethics 1201 (2018).',pinpoint:'pp.1201–1219. 자동화시스템의 agency를 human–robot collaboration으로 재구성.',url:'https://doi.org/10.1007/s11948-017-9943-x'},
        {type:'최근 반대학설',citation:'M. Kiener, “AI and Responsibility: No Gap, but Abundance,” 42 Journal of Applied Philosophy 357 (2025 issue; online 2024).',pinpoint:'pp.357–374. responsibility gap 대신 responsibility abundance 제안.',url:'https://doi.org/10.1111/japp.12765'},
        {type:'법인격 반대',citation:'Simon Chesterman, “Artificial Intelligence and the Limits of Legal Personality,” 69 ICLQ 819 (2020).',pinpoint:'pp.819–844.',url:'https://doi.org/10.1017/S0020589320000366'},
        {type:'법인격 반대',citation:'Bryson, Diamantis & Grant, “Of, for, and by the People: The Legal Lacuna of Synthetic Persons,” 25 Artificial Intelligence and Law 273 (2017).',pinpoint:'pp.273–291.',url:'https://doi.org/10.1007/s10506-017-9214-9'},
        {type:'최신 문헌검토',citation:'Novelli, Floridi, Sartor & Teubner, “AI as legal persons: past, patterns, and prospects,” 52 Journal of Law and Society 533 (2025).',pinpoint:'pp.533–555. 책임법·agency·법인격 논쟁의 최신 종합.',url:'https://doi.org/10.1111/jols.70021'}
      ]
    }
  };

  rows.forEach(row => {
    const next = patch[row.no];
    if (next) Object.assign(row, next);
  });
})();
