(()=>{'use strict';
const tb=window.NEXUS_CORE_TEXTBOOK||{};
window.NEXUS_QA_CORRECTIONS=window.NEXUS_QA_CORRECTIONS||{};
function apply(id,texts,refs,patches){const c=tb[id];if(!c)return;c.texts=texts;refs.forEach((r,i)=>{if(c.lessons[i])c.lessons[i][5]=Array.isArray(r)?r:[r]});Object.entries(patches||{}).forEach(([k,p])=>{const l=c.lessons[Number(k)];if(!l)return;if(p.title!==undefined)l[0]=p.title;if(p.body!==undefined)l[1]=p.body;if(p.concepts!==undefined)l[2]=p.concepts;if(p.formula!==undefined)l[3]=p.formula;if(p.caseText!==undefined)l[4]=p.caseText;});}

apply('CORE-131',[
 'C. Wright Mills, The Sociological Imagination, Oxford University Press, 1959.',
 'Émile Durkheim, The Rules of Sociological Method, 1895; Suicide, 1897.',
 'Karl Marx, Capital, Vol. I, 1867; Economic and Philosophic Manuscripts of 1844.',
 'Max Weber, Economy and Society, 1922.',
 'Erving Goffman, The Presentation of Self in Everyday Life, 1956/1959.',
 'Peter L. Berger & Thomas Luckmann, The Social Construction of Reality, 1966.',
 'Pierre Bourdieu, Distinction, 1979/1984; “The Forms of Capital,” 1986.',
 'Paul J. DiMaggio & Walter W. Powell, “The Iron Cage Revisited,” American Sociological Review 48(2), 1983, 147–160.',
 'Howard S. Becker, Outsiders, 1963.',
 'Mark S. Granovetter, “The Strength of Weak Ties,” American Journal of Sociology 78(6), 1973, 1360–1380.',
 'Ulrich Beck, Risk Society, German ed. 1986; English trans. 1992.',
 'José van Dijck, Thomas Poell & Martijn de Waal, The Platform Society, Oxford University Press, 2018.'
],[
 ['Mills, The Sociological Imagination, ch. 1 “The Promise,” especially the distinction between personal troubles of milieu and public issues of social structure.'],
 ['Durkheim, The Rules of Sociological Method, ch. I “What Is a Social Fact?”; Suicide, Book II, for social causes and aggregate-rate analysis. The historical study is a classic explanatory program, not a modern randomized causal design.'],
 ['Marx, Capital, Vol. I, chs. 6–9 on labour-power and surplus value; Economic and Philosophic Manuscripts of 1844, First Manuscript, “Estranged Labour,” for alienation.'],
 ['Weber, Economy and Society, Part I, ch. 1 on social action and Part I, ch. 3 on legitimate domination; bureaucracy and rationalization are related but analytically distinct themes.'],
 ['Goffman, The Presentation of Self in Everyday Life, Introduction and Parts I–II on performance, teams and impression management. Goffman’s dramaturgical analysis should not be treated as the definition of all symbolic interactionism.'],
 ['Berger & Luckmann, The Social Construction of Reality, Part III “Society as Subjective Reality,” on socialization and internalization. Claims about AI recommendation effects require separate contemporary empirical evidence.'],
 ['Bourdieu, Distinction, on taste and cultural differentiation; Bourdieu, “The Forms of Capital,” in Richardson (ed.), Handbook of Theory and Research for the Sociology of Education, 1986, 241–258, on economic, cultural and social capital.'],
 ['DiMaggio & Powell, “The Iron Cage Revisited,” American Sociological Review 48(2), 1983, 147–160, distinguishing coercive, mimetic and normative isomorphism.'],
 ['Becker, Outsiders, ch. 1, “Outsiders,” on rule creation, enforcement and labeling. Labeling theory does not imply that every harmful act is merely a label.'],
 ['Granovetter, “The Strength of Weak Ties,” AJS 78(6), 1973, 1360–1380. Weak ties can bridge otherwise separated social circles; the job-information result is contextual rather than a universal law.'],
 ['Beck, Risk Society, English trans. Sage, 1992. “Risk society” is a macro-sociological diagnosis and is not direct empirical proof about contemporary AI supply chains.'],
 ['van Dijck, Poell & de Waal, The Platform Society, 2018; Alex Rosenblat & Luke Stark, “Algorithmic Labor and Information Asymmetries: A Case Study of Uber’s Drivers,” International Journal of Communication 10, 2016, 3758–3784.']
],{
 0:{body:'사회학적 상상력은 개인의 생애경험을 역사적 변화와 제도구조에 연결하는 분석능력이다. Mills의 personal troubles/public issues 구분은 개인원인을 지우는 규칙이 아니라, 동일 현상이 개인 수준과 사회구조 수준에서 서로 다른 설명을 요구할 수 있음을 보여주는 분석틀이다.'},
 1:{body:'Durkheim은 사회적 사실을 개인에게 외재적이며 강제력을 가진 행위·사고·감정의 방식으로 다루고, Suicide에서는 집단별 자살률 차이를 사회통합·규제와 연결했다. 이 고전 연구는 집계자료와 비교논리에 기반하므로 현대적 의미의 실험적 인과식별과 동일시하지 않는다.'},
 2:{body:'Marx의 계급·잉여가치 분석과 소외론은 동일 저작 한 곳에 모여 있지 않다. Capital Vol. I은 노동력·가치증식·잉여가치의 자본주의 생산관계를 분석하고, alienated/estranged labour의 고전적 전개는 1844 Manuscripts에 있다. 플랫폼 노동 적용은 현대적 분석이며 원전의 직접 실증결론이 아니다.'},
 3:{body:'Weber의 사회행위론, 정당한 지배의 유형, 관료제, 합리화는 연결되지만 동일 개념은 아니다. 관료제는 규칙·직위·전문성·문서화 같은 이상형적 특징으로 분석되고, 실제 조직이 그 이상형에 완전히 일치한다고 가정하지 않는다.'},
 4:{title:'Goffman의 상호작용·자아표현',body:'Goffman의 dramaturgical analysis는 일상적 대면상황에서 performance, audience, impression management가 자아표현을 어떻게 조직하는지 분석한다. 이를 상징적 상호작용론 전체의 단일 정의나 온라인 행동에 대한 보편적 인과법칙으로 확대하지 않는다.',concepts:['interaction order','performance','impression management','self-presentation']},
 5:{body:'사회화는 역할·규범·정체성이 사회적 상호작용 속에서 내면화되는 과정이지만 개인은 재해석과 저항도 한다. Berger와 Luckmann의 고전이론은 AI 추천의 효과를 실증한 연구가 아니므로, “추천이 취향을 변화시킨다”는 현대적 인과명제는 별도 자료와 설계를 요구한다.'},
 6:{body:'Bourdieu의 자본 개념은 출처를 구분해야 한다. Distinction은 취향·계급·문화적 구별을 중심으로 하고, 경제·문화·사회자본을 체계적으로 구분한 대표 텍스트는 1986년 “The Forms of Capital”이다. 상징자본 역시 다른 저작들과 함께 읽어야 하며 모든 교육격차를 한 변수로 환원하지 않는다.'},
 7:{body:'신제도주의 조직론에서 DiMaggio와 Powell은 조직장이 경쟁효율만이 아니라 정당성 압력 아래 서로 유사해질 수 있다고 보며 coercive, mimetic, normative isomorphism을 구분한다. 조직 유사성이 관찰됐다는 사실만으로 세 메커니즘 중 하나가 인과적으로 입증되는 것은 아니다.'},
 8:{body:'Becker의 labeling approach는 일탈을 규칙의 제정·적용·낙인 과정과 함께 분석한다. 이는 행위의 물리적 피해나 모든 규범위반을 부정한다는 주장이 아니라, 무엇이 deviant로 분류되고 누구에게 제재가 집중되는지를 사회과정으로 분석하자는 제안이다.'},
 9:{body:'Granovetter의 weak ties 논지는 약한 연결이 서로 다른 사회원 사이의 bridge가 되어 새로운 정보에 접근하게 할 수 있다는 구조적 주장이다. “약한 연결이 항상 강한 연결보다 더 많은 취업정보를 준다”는 보편적 법칙으로 읽지 않으며 네트워크 구조와 모집단에 따라 효과가 달라질 수 있다.'},
 10:{body:'Beck의 risk society는 근대화가 생산한 위험의 초국경성·비가시성·제도적 반성성을 논하는 이론적 진단이다. 기후위험과 AI 공급망을 비교할 수 있지만, 두 현상의 동일한 메커니즘이나 효과를 Beck의 저작만으로 실증했다고 처리하지 않는다.'},
 11:{body:'플랫폼 사회론은 데이터화·중개·거버넌스와 공공가치의 재조직을 분석하는 이론적 틀이다. 배차알고리즘이 노동통제·정보비대칭을 만든다는 구체적 주장은 Uber 등 플랫폼노동의 경험연구와 별도로 연결해 검증한다.'}
});
window.NEXUS_QA_CORRECTIONS['CORE-131']={date:'2026-08-20',status:'SOCIOLOGY_THEORY_EVIDENCE_REVISED',changes:['Durkheim 고전 설명과 현대 인과식별 분리','Marx surplus value와 alienation의 원전 분리','Goffman을 symbolic interactionism 전체와 동일시하지 않음','Bourdieu capital 개념의 저작별 귀속 교정','isomorphism 세 메커니즘 명시','weak ties를 보편 인과법칙으로 과장하지 않음','플랫폼 노동 경험연구 별도 연결']};

apply('CORE-132',[
 'Steven Lukes, Power: A Radical View, 3rd ed., Bloomsbury Academic, 2026.',
 'Max Weber, “Politics as a Vocation,” lecture 1919.',
 'Thomas Hobbes, Leviathan; John Locke, Second Treatise of Government; Jean-Jacques Rousseau, The Social Contract.',
 'Montesquieu, The Spirit of the Laws, Book XI, ch. 6; The Federalist Nos. 47 and 51.',
 'Robert A. Dahl, Polyarchy: Participation and Opposition, Yale University Press, 1971.',
 'Arend Lijphart, Patterns of Democracy, 2nd ed., Yale University Press, 2012.',
 'E. E. Schattschneider, Party Government, 1942; Mancur Olson, The Logic of Collective Action, 1965.',
 'Terry M. Moe, “The Politics of Bureaucratic Structure,” in Chubb & Peterson (eds.), Can the Government Govern?, 1989.',
 'Giovanni Sartori, Comparative Constitutional Engineering, 2nd ed., 1997; Juan J. Linz, “The Perils of Presidentialism,” Journal of Democracy 1(1), 1990, 51–69.',
 'Kenneth Waltz, Theory of International Politics, 1979; Robert Keohane, After Hegemony, 1984; Alexander Wendt, Social Theory of International Politics, 1999.',
 'Steven Levitsky & Daniel Ziblatt, How Democracies Die, 2018; Shanto Iyengar et al., “The Origins and Consequences of Affective Polarization in the United States,” Annual Review of Political Science 22, 2019, 129–146.',
 'Karen Yeung, “Algorithmic regulation: A critical interrogation,” Regulation & Governance 12(4), 2018, 505–523.'
],[
 ['Lukes, Power: A Radical View, 3rd ed., chs. 1–5, distinguishing decision, agenda/nondecision and preference-shaping dimensions of power.'],
 ['Weber, “Politics as a Vocation” (1919): the modern state is defined sociologically by its claim to the monopoly of legitimate physical force within a territory. This is not a complete general theory of legal sovereignty.'],
 ['Hobbes, Leviathan, chs. 13–18; Locke, Second Treatise, §§4–15 and chs. VIII–IX; Rousseau, Social Contract, Book I ch. 6 and Book II chs. 1–4.'],
 ['Montesquieu, Spirit of the Laws XI.6; Federalist No. 47 and No. 51. The Federalist is evidence of the U.S. constitutional design debate, not a universal constitutional template.'],
 ['Dahl, Polyarchy, ch. 1, especially the dimensions of public contestation and inclusiveness/participation and the institutional guarantees associated with polyarchy.'],
 ['Lijphart, Patterns of Democracy, electoral-system and party-system chapters. Institutional effects are comparative tendencies conditioned by district magnitude, thresholds, party systems and social context.'],
 ['Schattschneider, Party Government, on parties and responsible party government; Olson, The Logic of Collective Action, on organized collective action. Parties, interest groups and civil society are distinct institutional objects.'],
 ['Moe, “The Politics of Bureaucratic Structure,” 1989. Principal-agent language is an analytical model of delegation and control, not a complete description of all bureaucracy.'],
 ['Sartori, Comparative Constitutional Engineering; Linz, “The Perils of Presidentialism,” Journal of Democracy 1(1), 1990, 51–69. Regime-type effects remain a comparative empirical debate rather than a deterministic rule.'],
 ['Waltz, Theory of International Politics; Keohane, After Hegemony; Wendt, Social Theory of International Politics. These are competing theoretical frameworks, not three variables whose causal effects are jointly established by one experiment.'],
 ['Levitsky & Ziblatt, How Democracies Die, on institutional erosion; Iyengar et al., Annual Review of Political Science 22, 2019, 129–146, on affective polarization. Claims about recommender systems causing polarization require separate platform-specific causal evidence.'],
 ['Yeung, “Algorithmic regulation,” Regulation & Governance 12(4), 2018, 505–523; Republic of Korea, AI Basic Act, current version effective 2026-07-21, esp. Arts. 4 and 34; EU Regulation 2024/1689, Art. 113, general application from 2026-08-02 with staged exceptions.']
],{
 0:{body:'권력은 관찰되는 명령·결정뿐 아니라 의제에서 배제되는 쟁점과 선호형성의 조건까지 분석될 수 있다. Lukes의 3차원 권력이론은 분석틀이며, 특정 정책이 실제로 숨은 권력효과 때문에 배제됐다는 인과주장은 자료를 통해 별도로 입증해야 한다.'},
 1:{body:'Weber의 유명한 정의는 현대국가가 일정 영토 안에서 정당한 물리적 강제력 사용의 독점을 성공적으로 주장하는 인간공동체라는 사회학적 정의다. sovereignty, legal authority, state capacity는 관련되지만 동일 개념이 아니며 국제법·헌법질서에 따라 별도 분석이 필요하다.'},
 2:{body:'홉스·로크·루소의 social contract는 실제 역사적 계약을 보고한 경험연구가 아니라 정치적 정당성을 구성하는 규범·철학적 논증이다. 세 저자의 자연상태, 동의, 권리, 주권, 일반의지는 서로 달라 비상권한이나 자유제한에 적용할 때 원문 논증을 분리해야 한다.'},
 3:{body:'권력분립은 하나의 고정된 3분법 모델이 아니다. Montesquieu와 Federalist의 논증은 서로 다른 역사적 헌정맥락에서 읽어야 하며, Federalist Nos. 47·51은 미국 연방헌법의 기관설계 논증이다. 이를 모든 국가의 사법심사 구조에 그대로 적용하지 않는다.'},
 4:{body:'Dahl의 polyarchy는 실제 대규모 민주체제를 비교하기 위한 경험적·제도적 개념으로, public contestation과 inclusiveness/participation을 핵심 차원으로 본다. 선거 존재만으로 polyarchy가 성립하지 않으며, polyarchy 자체도 민주주의의 모든 규범적 이상과 동일하지 않다.'},
 5:{body:'다수대표·비례대표·혼합제의 효과는 district magnitude, threshold, ballot structure, party system 등 구체적 제도에 달려 있다. 선거제도와 정당수·대표성·정부형성 사이에는 비교정치의 강한 경험연구가 있지만 하나의 제도가 언제나 동일 결과를 만든다고 단정하지 않는다.'},
 6:{body:'정당, 이익집단, 시민사회는 조직형태와 대표·동원기능이 다르다. Schattschneider의 Party Government를 시민사회 전체의 이론처럼 사용하지 않고, 집단행동과 조직화 문제는 Olson 등 별도 이론과 구분해 읽는다.'},
 7:{body:'principal-agent model은 위임자가 대리인에게 권한을 맡길 때 정보비대칭·목표불일치·감시비용이 생길 수 있다는 분석모형이다. 실제 관료제는 다중 principal, 전문규범, 법적 권한, 조직문화도 포함하므로 단일 위임모형으로 환원하지 않는다.'},
 8:{body:'대통령제와 의원내각제의 안정성·책임성 효과는 비교정치의 논쟁적 경험문제다. Linz의 presidentialism 비판과 후속 비교연구를 함께 읽고, 특정 체제유형이 자동으로 민주주의 실패나 교착을 일으킨다는 결정론적 명제로 사용하지 않는다.'},
 9:{body:'realism, institutional liberalism, constructivism은 국제정치를 다르게 문제화하는 이론적 연구프로그램이다. AI 군비경쟁 사례에 적용할 수 있으나 동일 사건을 세 틀로 설명했다고 해서 어느 하나가 경험적으로 확정되는 것은 아니다.'},
 10:{body:'민주주의 후퇴, 정서적 양극화, 허위정보, 제도불신은 관련될 수 있지만 서로 다른 개념과 측정치를 가진다. 특히 추천알고리즘이 양극화를 “강화한다”는 인과명제는 플랫폼·노출·사용자 자기선택·시간효과를 식별한 별도 경험연구가 필요하다.'},
 11:{body:'자동행정과 algorithmic regulation은 정치적 정당성·책임성 문제와 실제 법적 의무를 구분해야 한다. 2026-08-20 현재 한국 AI기본법은 2026-07-21 시행 중이며 고영향 AI에 위험관리·설명방안·이용자보호·사람의 관리감독·문서보관 등의 의무를 둔다. EU AI Act는 2026-08-02 일반 적용이 시작됐지만 Art. 113의 단계별 예외가 있으므로 모든 조항이 같은 날 적용된다고 쓰지 않는다.'}
});
window.NEXUS_QA_CORRECTIONS['CORE-132']={date:'2026-08-20',status:'POLITICAL_THEORY_EMPIRICS_JURISDICTION_REVISED',changes:['Lukes 권력차원과 실제 인과입증 분리','Weber 국가정의와 sovereignty 분리','사회계약을 역사적 계약사실처럼 읽지 않음','Federalist의 미국 헌정맥락 명시','Dahl polyarchy의 두 차원 명확화','선거제도 효과의 조건부 성격 명시','체제유형 결정론 제거','국제정치 이론과 경험검증 분리','알고리즘-양극화 인과 과잉단정 제거','한국 AI기본법·EU AI Act를 2026-08-20 시점과 관할별로 표시']};

apply('CORE-133',[
 'N. Gregory Mankiw, Principles of Economics.',
 'Hal R. Varian, Intermediate Microeconomics: A Modern Approach, 9th ed., 2014.',
 'Hal R. Varian, Intermediate Microeconomics, elasticity chapters.',
 'Hal R. Varian, Intermediate Microeconomics, consumer theory chapters.',
 'Hal R. Varian, Intermediate Microeconomics, producer theory and cost chapters.',
 'Jean Tirole, The Theory of Industrial Organization, MIT Press, 1988.',
 'Martin J. Osborne, An Introduction to Game Theory, Oxford University Press, 2004.',
 'A. C. Pigou, The Economics of Welfare; Ronald Coase, “The Problem of Social Cost,” Journal of Law and Economics 3, 1960, 1–44.',
 'Olivier Blanchard, Macroeconomics; System of National Accounts concepts for GDP expenditure accounting.',
 'Olivier Blanchard, Macroeconomics; Irving Fisher, The Purchasing Power of Money, 1911, for the equation of exchange.',
 'Paul Krugman, Maurice Obstfeld & Marc Melitz, International Economics, comparative-advantage chapters.',
 'Richard H. Thaler, Misbehaving, 2015; Jean-Charles Rochet & Jean Tirole, “Platform Competition in Two-Sided Markets,” JEEA 1(4), 2003, 990–1029.'
],[
 ['Mankiw, Principles of Economics, introductory principles on opportunity cost and marginal changes. MB≥MC is a decision rule for a marginal/discrete comparison, not a universal first-order condition.'],
 ['Mankiw, supply-demand chapters. Qd=a−bP and Qs=c+dP are linear illustrative forms; the law of demand/supply does not require linearity.'],
 ['Varian, Intermediate Microeconomics, elasticity material: point price elasticity ε=(dQ/dP)(P/Q); finite changes often use arc/midpoint measures. Demand elasticity is often reported in absolute value, but the signed derivative is normally negative for ordinary downward-sloping demand.'],
 ['Varian, consumer choice: maximize preferences/utility representation subject to p·x≤m. Budget equality requires assumptions such as local nonsatiation/monotonicity and positive prices. Utility is ordinal up to increasing transformation in standard consumer theory.'],
 ['Varian, producer theory: profit π(q)=R(q)−C(q); fixed/sunk costs affect entry and long-run decisions differently from marginal output choice.'],
 ['Tirole, Industrial Organization, monopoly and oligopoly chapters. MR=MC is an interior differentiable profit-maximization condition under relevant regularity assumptions, not a universal description of every market structure.'],
 ['Osborne, An Introduction to Game Theory: Nash equilibrium s* satisfies u_i(s_i*,s_-i*)≥u_i(s_i,s_-i*) for every player i and every feasible unilateral deviation s_i.'],
 ['Pigou, Economics of Welfare, external-cost analysis; Coase, “The Problem of Social Cost,” JLE 3, 1960, 1–44. Coasian bargaining conclusions depend on transaction costs, property-rights definition and other conditions.'],
 ['Blanchard, Macroeconomics, national accounts: Y=C+I+G+NX is the expenditure identity for GDP in an open economy; nominal versus real GDP and domestic production boundaries must be distinguished.'],
 ['Fisher, equation of exchange MV=PY. With velocity defined from nominal transactions/output, this is an accounting relation and becomes a causal monetary theory only with additional behavioral assumptions.'],
 ['Krugman, Obstfeld & Melitz, International Economics: comparative advantage is relative opportunity cost. A country has comparative advantage in X when its opportunity cost of X is lower than its trading partner’s, under the specified model.'],
 ['Rochet & Tirole, JEEA 1(4), 2003, 990–1029, on two-sided platform pricing; Metcalfe-style V∝N² is a heuristic network-value claim, not a universal law of platform value.']
],{
 0:{body:'기회비용은 선택 때문에 포기한 최선의 대안가치다. “MB≥MC이면 선택”은 작은 추가단위나 이산 선택을 비교하는 유용한 규칙이지만, 연속적 내부해의 최적조건은 보통 MB=MC와 2차조건·제약조건을 함께 확인한다.',formula:'marginal discrete choice: choose increment if MB≥MC; interior differentiable optimum typically MB=MC plus regularity/constraint conditions'},
 1:{body:'수요와 공급은 가격과 다른 조건 사이의 관계를 나타내는 모형이다. Qd=a−bP, Qs=c+dP는 선형 예시일 뿐 실제 수요·공급이 선형이라는 법칙은 아니다. 외생변수 변화에 따른 curve shift와 동일 곡선 위 movement를 구분한다.',formula:'illustrative linear case: Q_d=a−bP, b>0; Q_s=c+dP, d>0'},
 2:{body:'가격탄력성은 가격의 비례변화에 대한 수요량의 비례변화다. 미분가능한 수요함수에서는 point elasticity ε=(dQ/dP)(P/Q)로 정의한다. 유한한 변화율을 단순 시작값 백분율로 계산하면 기준점 문제가 생기므로 midpoint/arc elasticity를 사용할 수 있다.',formula:'point elasticity: ε_QP=(dQ/dP)(P/Q); arc elasticity uses midpoint percentage changes'},
 3:{body:'표준 소비자이론은 예산집합 안에서 선호를 최대화하는 선택을 다룬다. 효용함수는 선호를 표현하는 도구이며 일반적으로 양의 단조변환에 대해 동일한 순서를 표현한다. p·x=m이라는 등식은 local nonsatiation 등 추가조건 아래 예산이 소진될 때 성립한다.',formula:'max_x U(x) subject to p·x≤m; if local nonsatiation and positive prices, optimum typically satisfies p·x=m'},
 4:{body:'기업의 생산·비용 모형은 기술과 시장조건 아래 이윤을 정의한다. 고정비는 현재 산출량의 marginal condition에는 직접 들어가지 않을 수 있지만 진입·퇴출과 장기 규모결정에는 중요하다. sunk cost와 avoidable fixed cost도 구분한다.',formula:'π(q)=R(q)−C(q); marginal condition applies only where differentiable/interior'},
 5:{body:'MR=MC는 미분가능한 이윤함수의 내부해에서 필요한 전형적 조건이다. 완전경쟁기업은 가격수용자라는 가정 아래 MR=p가 되어 내부해에서 p=MC가 될 수 있고, 독점기업은 downward-sloping demand에서 MR과 가격을 구분한다. 경계해·비볼록성·전략적 과점에서는 별도 분석이 필요하다.',formula:'interior differentiable profit maximum: MR(q*)=MC(q*) with second-order/global checks; perfect competition adds MR=p'},
 6:{body:'Nash equilibrium은 각 참여자의 전략이 다른 참여자의 전략을 주어진 것으로 볼 때 최적반응인 전략프로필이다. 단순히 payoff function u_i(s_i,s_-i)를 적는 것만으로 균형조건이 되지 않는다.',formula:'s* is Nash iff ∀i,∀s_i: u_i(s_i*,s_-i*)≥u_i(s_i,s_-i*)'},
 7:{body:'externality는 의사결정자의 사적 비용·편익과 제3자에게 발생하는 사회적 비용·편익이 어긋나는 상황이다. MSC=MPC+MEC는 해당 marginal-cost 정의가 가산될 때의 표현이다. Pigouvian tax와 Coasian bargaining은 서로 다른 제도조건을 전제로 하며 Coase 논의를 “정부개입은 불필요하다”는 보편명제로 읽지 않는다.',formula:'when marginal costs are additively defined: MSC=MPC+MEC'},
 8:{body:'GDP는 일정 기간 한 경제의 경계 안에서 생산된 최종재·서비스의 시장가치를 측정한다. 지출접근의 Y=C+I+G+NX는 회계항등식이며, nominal/real GDP·국내생산/국민소득·재고투자·수입차감을 구분해야 한다.',formula:'GDP expenditure identity: Y=C+I+G+(X−M)'},
 9:{body:'MV=PY는 화폐량·유통속도·물가·실질산출의 정의 아래 성립하는 equation of exchange로 사용할 수 있지만, 이것만으로 금리·재정지출·기대·금융마찰의 인과효과가 결정되지는 않는다. 현대 거시정책 분석은 추가 행동방정식과 제도적 전달경로를 필요로 한다.',formula:'equation of exchange: M·V=P·Y; causal interpretation requires additional assumptions'},
 10:{body:'comparative advantage는 절대생산성보다 상대적 기회비용의 비교다. 두 국가 A,B와 두 재화 X,Y의 단순모형에서 A가 X 한 단위를 생산할 때 포기하는 Y의 양이 B보다 작다면 A는 X에 비교우위를 가진다. 실제 무역효과에는 규모의 경제·운송비·분배·전략적 정책 등 추가요인이 있다.',formula:'A has comparative advantage in X if OC_A(X in units of Y) < OC_B(X in units of Y)'},
 11:{body:'행동경제학의 제한된 합리성·프레이밍과 플랫폼경제의 network effects·two-sided pricing은 서로 다른 이론군이다. 플랫폼가치를 V≈αN²로 두는 Metcalfe식 표현은 휴리스틱일 뿐 보편 경제법칙이 아니다. 양면시장에서는 양쪽 이용자 집단의 교차네트워크효과와 가격구조를 함께 분석한다.',formula:''}
});
window.NEXUS_QA_CORRECTIONS['CORE-133']={date:'2026-08-20',status:'ECONOMIC_MODEL_ASSUMPTIONS_REVISED',changes:['MB≥MC 규칙과 연속 최적조건 분리','수요공급 선형식을 예시모형으로 한정','탄력성의 point/arc 정의 교정','소비자 예산등식의 조건 명시','고정비·sunk cost·marginal decision 구분','MR=MC 적용조건 명시','Nash equilibrium의 정확한 부등식 정의 추가','Coase/Pigou 조건 분리','GDP 항등식의 측정범위 명시','MV=PY를 인과정책식으로 사용하지 않음','비교우위 기회비용식 교정','Metcalfe N²를 플랫폼경제 보편법칙에서 제거']};

apply('CORE-134',[
 'H. L. A. Hart, The Concept of Law, 3rd ed., Oxford University Press, 2012.',
 'H. L. A. Hart, The Concept of Law, chs. V–VI.',
 'Wesley Newcomb Hohfeld, “Some Fundamental Legal Conceptions as Applied in Judicial Reasoning,” Yale Law Journal 23, 1913, 16–59; 26, 1917, 710–770.',
 'John Dewey, “The Historic Background of Corporate Legal Personality,” Yale Law Journal 35(6), 1926, 655–673.',
 'Comparative contract law: Korean Civil Act and common-law contract doctrine must be distinguished; P. S. Atiyah, The Rise and Fall of Freedom of Contract, 1979.',
 'Republic of Korea Civil Act Art. 750, current as of 2026-08-20; comparative common-law negligence doctrine.',
 'Comparative criminal-law structures: Korean/German tripartite offence analysis and common-law actus reus/mens rea are not interchangeable taxonomies.',
 'Republic of Korea Constitution Art. 37(2); Robert Alexy, A Theory of Constitutional Rights, proportionality analysis.',
 'Administrative-law requirements depend on jurisdiction; Jerry L. Mashaw, Due Process in the Administrative State, 1985.',
 'William Twining, Rethinking Evidence, 2nd ed., 2006. Bayesian evidential models and legal standards/burdens of proof must remain distinct.',
 'H. L. A. Hart, The Concept of Law, ch. VII; Ronald Dworkin, Law’s Empire; Scalia & Garner, Reading Law; Aharon Barak, Purposive Interpretation in Law.',
 'Lawrence Lessig, Code and Other Laws of Cyberspace; Republic of Korea AI Basic Act, effective 2026-07-21; EU AI Act, Regulation (EU) 2024/1689, staged application under Art. 113.'
],[
 ['Sources and hierarchy vary by legal system. For Korea, Constitution Art. 6(1) gives duly concluded/promulgated treaties and generally recognized international law the same effect as domestic law; statutory hierarchy and the legal effect of precedent/administrative guidance must be identified by the relevant jurisdiction.'],
 ['Hart, The Concept of Law, ch. V “Law as the Union of Primary and Secondary Rules” and ch. VI “The Foundations of a Legal System.”'],
 ['Hohfeld, Yale Law Journal 23 (1913) 16–59 and 26 (1917) 710–770: claim-right/duty, privilege(or liberty)/no-right, power/liability, immunity/disability.'],
 ['Dewey, “The Historic Background of Corporate Legal Personality,” Yale Law Journal 35(6), 1926, 655–673. Legal personality, capacity and specific incidents of status should be distinguished.'],
 ['Contract formation and validity are jurisdiction-specific. Consideration is central to common-law contract doctrine but is not a universal element of civil-law contracts, including Korean private law. Good-faith doctrines also differ in source and scope.'],
 ['Republic of Korea Civil Act Art. 750 (current statute effective 2026-03-17): intentional or negligent unlawful conduct causing damage gives rise to liability. Common-law negligence typically analyzes duty, breach, factual/legal causation and damage; the two frameworks should not be fused into one formula.'],
 ['Korean criminal-law teaching commonly separates elements/constituent facts, unlawfulness and culpability, while common-law materials use actus reus and mens rea plus defences. Comparative categories must be labeled by jurisdiction and doctrine.'],
 ['Republic of Korea Constitution Art. 37(2) limits restrictions on freedoms and rights; Korean Constitutional Court proportionality analysis is commonly articulated through legitimate purpose, suitability, minimal impairment and balance of legal interests. Alexy’s proportionality theory has its own analytical structure and should not be treated as the text of Korean law.'],
 ['Administrative delegation, discretion, procedure, reasons and judicial review depend on the jurisdiction and the enabling statute. Mashaw is a U.S. due-process work rather than a universal administrative code.'],
 ['Twining, Rethinking Evidence. Likelihoods/probabilities can assist evidential reasoning, but burdens and standards of proof are normative legal rules and cannot be replaced by P(E|H) or a single Bayesian threshold without legal authority.'],
 ['Hart ch. VII on open texture; Dworkin, Law’s Empire; Scalia & Garner, Reading Law; Barak, Purposive Interpretation in Law. Textualism, purposivism, precedent and principle are distinct traditions and vary across jurisdictions.'],
 ['As of 2026-08-20: Korea AI Basic Act current version effective 2026-07-21, including Art. 34 duties for high-impact AI; EU AI Act generally applies from 2026-08-02 but Art. 113 contains staged exceptions, including Art. 6(1)-linked obligations from 2027-08-02. Lessig is a theory of code/architecture as regulation, not a statement of these current statutory duties.']
],{
 0:{body:'법원(source of law)과 효력위계는 법체계마다 다르다. 헌법·법률·명령·조례·조약·관습·판례·행정규칙의 지위는 관할을 특정해야 하며, civil-law 체계에서 판례의 사실상 구속력·선례기능과 formal source 지위를 common-law stare decisis와 동일시하지 않는다.'},
 1:{body:'Hart는 의무를 부과하는 primary rules와 법적 규칙을 식별·변경·적용하는 secondary rules를 구분하고, rule of recognition을 법체계의 유효성 기준을 식별하는 사회적 규칙으로 논한다. 이를 단순한 헌법 조문 하나와 동일시하지 않는다.'},
 2:{body:'Hohfeld의 법률관계는 correlatives와 opposites를 구분한다. claim-right에는 상대방의 duty가 대응하고, privilege/liberty에는 no-right, power에는 liability, immunity에는 disability가 대응한다. “권리”라는 한 단어로 이 서로 다른 법적 지위를 합치지 않는다.',formula:'claim-right↔duty; privilege/liberty↔no-right; power↔liability; immunity↔disability'},
 3:{body:'legal personality는 권리·의무의 귀속단위라는 지위이고 capacity는 특정 법률행위를 하거나 소송·재산관계를 수행할 능력의 문제다. 회사도 모든 자연인과 동일한 권리능력을 갖는 것은 아니며, AI에 법적 지위를 부여하는 문제도 어떤 incidents를 부여할 것인지 구체적으로 설계해야 한다.'},
 4:{body:'계약의 성립·효력요건은 관할별로 구분한다. offer/acceptance/consideration은 common-law 분석의 핵심이지만 consideration은 한국 민법을 포함한 civil-law 계약의 일반 성립요건이 아니다. good faith, 강행법규, 공서양속, 정보의무의 근거와 범위도 법체계마다 다르다.'},
 5:{body:'불법행위의 요건을 하나의 영미법 공식으로 일반화하지 않는다. 2026-08-20 현재 한국 민법 제750조는 고의 또는 과실로 인한 위법행위로 타인에게 손해를 가한 경우를 규정한다. common-law negligence의 duty/breach/causation/damage 분석은 비교법적 별도 틀이다. 자율주행 사고는 제조물책임·계약·특별법까지 관할별로 추가 검토해야 한다.',formula:''},
 6:{body:'형사책임의 분석틀도 관할별로 분리한다. 한국·독일계 도그마틱의 구성요건 해당성→위법성→책임 구조와 common-law의 actus reus/mens rea/defences 어휘는 서로 대응관계가 있을 수 있지만 동일 체계가 아니다. 자동화 시스템의 결과를 인간에게 귀속하려면 행위·부작위의무·주관적 책임요건·인과·특별범죄 규정을 각각 확인한다.'},
 7:{body:'비례성은 관할과 법원에 따라 표현과 심사강도가 다르다. 한국에서는 헌법 제37조 제2항과 헌법재판소의 목적 정당성·수단 적합성·침해 최소성·법익 균형성 심사가 중요한 기준이다. Alexy의 suitability→necessity→proportionality stricto sensu는 대표 이론모형으로 비교하되 한국 실정법 조문 자체로 취급하지 않는다.',formula:'comparative model: legitimate aim → suitability → necessity/minimal impairment → balancing/proportionality stricto sensu'},
 8:{body:'행정재량과 규제권한은 “전문기관이므로 재량이 있다”는 일반명제로 결정되지 않는다. 법률유보·위임범위·절차·이유제시·청문·정보공개·사법심사 등은 해당 관할의 헌법·행정법·개별법을 확인해야 한다. 미국 due process 문헌을 한국이나 EU의 직접 법원으로 사용하지 않는다.'},
 9:{body:'증거의 probative value를 확률적으로 분석하는 것과 법적 입증책임·증명도를 정하는 것은 다른 문제다. P(E|H)나 likelihood ratio는 추론을 보조할 수 있지만 “합리적 의심 없음”, “우월한 개연성”, 민사상 증명책임 같은 법적 기준을 자동으로 수치화하지 않는다.',formula:'Bayesian/evidential quantities ≠ legal burden or standard of proof unless a legal rule expressly makes such mapping'},
 10:{body:'법해석은 문언·체계·목적·역사·선례·원칙의 관계를 다루지만 textualism, purposivism, Dworkinian principle, Hartian open texture를 하나의 축으로 단순 대응시키지 않는다. 어느 해석자료가 허용되고 어떤 선례가 구속하는지는 관할별 institutional law를 먼저 확인한다.'},
 11:{body:'법과 AI는 이론과 현행법을 구분한다. Lessig의 “code is law” 계열 논의는 기술아키텍처의 규제효과를 설명하는 이론이다. 2026-08-20 현재 한국 AI기본법은 2026-07-21 시행 중이며 고영향 AI에 대한 제34조 의무 등을 둔다. EU AI Act는 2026-08-02 일반 적용이 시작됐지만 Art. 113의 단계별 적용일을 따라야 한다. 따라서 “AI 규제”를 하나의 세계 공통법처럼 서술하지 않는다.'}
});
window.NEXUS_QA_CORRECTIONS['CORE-134']={date:'2026-08-20',status:'LAW_JURISDICTION_TIME_REVISED',changes:['법원과 판례효력을 관할별로 분리','Hohfeld 8개 jural relations 완전화','legal personality와 capacity 구분','consideration을 common-law 한정으로 교정','한국 민법 제750조와 common-law negligence 분리','형사법 도그마틱과 actus reus/mens rea 혼합 제거','한국 비례심사와 Alexy 이론 분리','Bayesian evidence와 법적 증명도 분리','해석이론의 관할차이 명시','한국 AI기본법·EU AI Act를 2026-08-20 현행시점과 단계별 시행일로 갱신']};

apply('CORE-135',[
 'Open Science Collaboration, “Estimating the Reproducibility of Psychological Science,” Science 349(6251), 2015, aac4716; subsequent methodological debate.',
 'Eric R. Kandel et al., Principles of Neural Science, 6th ed., 2021.',
 'E. Bruce Goldstein, Cognitive Psychology; standard signal detection theory sources.',
 'B. F. Skinner, Science and Human Behavior, 1953; contemporary learning texts for conditioning terminology.',
 'Alan Baddeley, Working Memory; Elizabeth Loftus, eyewitness-memory research.',
 'E. Bruce Goldstein, Cognitive Psychology; heuristics are efficient strategies whose accuracy is task-dependent.',
 'Daniel Kahneman & Amos Tversky, “Prospect Theory,” Econometrica 47(2), 1979, 263–291; Amos Tversky & Daniel Kahneman, “Advances in Prospect Theory,” Journal of Risk and Uncertainty 5, 1992, 297–323.',
 'Edward L. Deci & Richard M. Ryan, Self-Determination Theory; Deci, Koestner & Ryan, Psychological Bulletin 125(6), 1999, 627–668.',
 'Jean Piaget, The Origins of Intelligence in Children; Lev Vygotsky, Mind in Society, ed. Cole et al., 1978.',
 'Paul T. Costa & Robert R. McCrae, Revised NEO Personality Inventory; Barrick & Mount, Personnel Psychology 44(1), 1991, 1–26.',
 'Solomon Asch, conformity experiments; Stanley Milgram, “Behavioral Study of Obedience,” Journal of Abnormal and Social Psychology 67, 1963, 371–378; Tajfel & Turner, social identity theory.',
 'Raja Parasuraman & Victor Riley, “Humans and Automation,” Human Factors 39(2), 1997, 230–253; Lee & See, “Trust in Automation,” Human Factors 46(1), 2004, 50–80; Dietvorst, Simmons & Massey, “Algorithm Aversion,” JEP: General 144(1), 2015, 114–126.'
],[
 ['Open Science Collaboration, Science 349(6251), 2015, aac4716, replicated 100 studies and reported substantially smaller replication effects; the paper itself generated methodological debate, so no single percentage should be treated as psychology’s timeless replication rate.'],
 ['Kandel et al., Principles of Neural Science, 6th ed. Complex behavior emerges from distributed interacting neural systems; lesion/imaging associations do not support a one-region/one-psychological-function rule.'],
 ['Signal detection theory: d′=Z(hit rate)−Z(false-alarm rate) under the standard equal-variance Gaussian SDT formulation. Sensitivity and decision criterion are distinct.'],
 ['Skinner, Science and Human Behavior. Positive/negative refer to adding/removing a stimulus; reinforcement/punishment refer to increasing/decreasing future behavior. Negative reinforcement is not punishment.'],
 ['Baddeley, working-memory model; Loftus, misinformation/eyewitness research. Memory is reconstructive, but distortion effects depend on procedure and do not imply that all memory reports are unreliable.'],
 ['Goldstein, Cognitive Psychology. Heuristics can improve efficiency and sometimes accuracy; “heuristic” is not synonymous with “bias.”'],
 ['Kahneman & Tversky, Econometrica 47(2), 1979, 263–291, original prospect theory; Tversky & Kahneman, Journal of Risk and Uncertainty 5, 1992, 297–323, cumulative prospect theory and commonly used power-form value function parameterization.'],
 ['Deci, Koestner & Ryan, Psychological Bulletin 125(6), 1999, 627–668, meta-analysis of extrinsic rewards and intrinsic motivation. Reward effects vary by expectedness, contingency, task and outcome measure.'],
 ['Piaget and Vygotsky are major developmental traditions, but stage universality and age boundaries are empirical questions rather than immutable biological laws; Mind in Society is a 1978 edited English collection from Vygotsky’s writings.'],
 ['Barrick & Mount, Personnel Psychology 44(1), 1991, 1–26, meta-analytic associations between Big Five dimensions and job-performance criteria. Predictive associations are probabilistic and context/criterion dependent, not deterministic person classifications.'],
 ['Asch conformity, Milgram obedience and Tajfel social identity address different processes. Classic laboratory effects should be read with design, ethics, culture, replication and effect-size evidence rather than as fixed universal percentages.'],
 ['Parasuraman & Riley, Human Factors 39(2), 1997, 230–253; Lee & See, Human Factors 46(1), 2004, 50–80; Dietvorst et al., JEP: General 144(1), 2015, 114–126. Misuse/overreliance, disuse, trust calibration and algorithm aversion are distinct phenomena.']
],{
 0:{body:'심리학의 경험명제는 가설·측정·표본·설계·효과크기·불확실성과 재현가능성으로 평가한다. Open Science Collaboration의 2015 프로젝트는 100개 연구의 재현을 시도해 원 연구보다 평균적으로 작은 효과와 낮은 유의성 재현을 보고했지만, 그 수치 자체도 방법론적 논쟁의 대상이었다. 따라서 한 프로젝트의 비율을 심리학 전체의 고정 “재현율”로 일반화하지 않는다.'},
 1:{body:'뇌기능과 행동은 분산된 신경회로와 상호작용의 결과다. 특정 영역의 손상·활성화와 과제수행 사이의 연관은 중요하지만 단일 영역이 복잡한 성격·도덕성·충동통제를 독점적으로 “담당한다”는 역추론을 경계한다.'},
 2:{body:'signal detection theory는 sensory sensitivity와 response criterion을 분리한다. 표준 equal-variance Gaussian SDT에서 d′는 hit rate와 false-alarm rate의 z 변환 차이로 표현한다. 경고시스템에서 낮은 false alarm을 추구하면 miss가 바뀔 수 있으므로 민감도와 의사결정 기준을 따로 평가한다.',formula:'standard equal-variance SDT: d′=Z(Hit rate)−Z(False-alarm rate)'},
 3:{body:'classical conditioning은 자극 간 연합, operant conditioning은 행동과 결과의 관계를 중심으로 한다. reinforcement는 행동의 미래 빈도를 높이고 punishment는 낮춘다는 기능적 정의이며, positive/negative는 자극의 추가/제거를 뜻한다. negative reinforcement를 punishment와 혼동하지 않는다.'},
 4:{body:'기억은 encoding·maintenance/storage·retrieval 과정과 작업기억의 제한을 가진다. Loftus 계열 연구는 사후정보와 질문방식이 특정 조건에서 기억보고를 바꿀 수 있음을 보여주지만, “기억은 항상 거짓”이라는 결론을 지지하지 않는다. 효과크기와 절차조건을 함께 본다.'},
 5:{body:'schema와 heuristic은 제한된 자원에서 문제해결을 빠르게 할 수 있는 인지구조·전략이다. heuristic이라는 이유만으로 오류라고 부르지 않으며, 어떤 환경에서 편향을 만들고 어떤 환경에서 합리적 근사가 되는지 성과기준과 비교한다.'},
 6:{body:'1979년 original prospect theory와 1992년 cumulative prospect theory를 구분한다. 준거점 의존·손실영역/이득영역의 비대칭이라는 핵심 아이디어는 1979 논문에 있지만, α·β·λ를 둔 대표적 power-form 가치함수와 누적 의사결정가중의 정식화는 1992 확장과 함께 정확히 귀속한다.',formula:'common cumulative-PT value form: v(x)=x^α for x≥0; v(x)=−λ(−x)^β for x<0  (Tversky & Kahneman 1992 parameterization)'},
 7:{body:'self-determination theory는 autonomy, competence, relatedness와 동기의 질을 강조한다. 외적 보상이 내재동기를 “항상” 약화시키는 것은 아니며, meta-analysis에서는 보상의 기대가능성·과제유형·성과조건·측정방식에 따라 결과가 달라진다.'},
 8:{body:'발달이 생물학·환경·문화의 상호작용이라는 큰 원칙과 Piaget의 세부 stage chronology를 구분한다. Piaget 단계의 연령경계와 보편성은 후속 경험연구의 검토대상이다. Vygotsky의 Mind in Society는 저자가 1978년에 직접 집필·출판한 단행본이 아니라 사후 편집된 영어 자료집이라는 서지상태도 명시한다.'},
 9:{body:'Big Five는 비교적 안정적인 성격특성의 차원을 측정하는 대표 모형이지만 점수는 행동을 결정론적으로 예측하지 않는다. 직무성과와의 연관은 직무·기준·측정·표본에 따라 달라지며, 채용자동화에 사용하려면 타당도·증분타당도·공정성·법적 차별위험을 별도로 검증한다.'},
 10:{body:'conformity, obedience, social identity는 서로 다른 사회심리 메커니즘이다. Asch와 Milgram의 고전 실험에서 나온 특정 순응·복종 비율을 시대·문화·절차가 다른 모든 집단에 고정값처럼 적용하지 않는다. 효과크기, 재현, 윤리적 변경, 문화적 조절변수를 함께 본다.'},
 11:{body:'AI에 대한 인간반응은 한 방향의 “자동화편향”으로만 설명되지 않는다. automation misuse/overreliance와 disuse, algorithm aversion, trust calibration은 서로 다른 현상이며 시스템 정확도·오류경험·설명·사용자 통제·업무위험에 따라 달라진다. 의료 AI 사례에서 자동화편향을 주장하려면 human-only와 AI-assisted 조건의 실제 오류변화를 비교해야 한다.'}
});
window.NEXUS_QA_CORRECTIONS['CORE-135']={date:'2026-08-20',status:'PSYCHOLOGY_REPLICATION_EFFECT_REVISED',changes:['2015 재현성 프로젝트를 심리학 전체 고정 재현율로 일반화하지 않음','뇌영역-복잡행동 일대일 환원 제거','d-prime 식과 sensitivity/criterion 분리','negative reinforcement와 punishment 구분','기억왜곡 효과의 조건부 성격 명시','heuristic과 bias 동일시 제거','1979 prospect theory와 1992 cumulative prospect theory의 공식 귀속 교정','reward와 intrinsic motivation의 meta-analytic 조건 명시','Piaget 단계의 경험적 검증대상 성격 및 Vygotsky 편집상태 명시','Big Five 예측을 결정론에서 확률적 타당도로 교정','고전 사회심리 실험의 효과크기·재현·문화조건 명시','automation bias·algorithm aversion·trust calibration 분리']};
})();