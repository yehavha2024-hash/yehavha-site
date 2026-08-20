(()=>{'use strict';
const tb=window.NEXUS_CORE_TEXTBOOK||{};
window.NEXUS_QA_CORRECTIONS=window.NEXUS_QA_CORRECTIONS||{};
function apply(id,texts,refs,patches){const c=tb[id];if(!c)return;c.texts=texts;refs.forEach((r,i)=>{if(c.lessons[i])c.lessons[i][5]=Array.isArray(r)?r:[r]});Object.entries(patches||{}).forEach(([k,p])=>{const l=c.lessons[Number(k)];if(!l)return;if(p.title!==undefined)l[0]=p.title;if(p.body!==undefined)l[1]=p.body;if(p.concepts!==undefined)l[2]=p.concepts;if(p.formula!==undefined)l[3]=p.formula;if(p.caseText!==undefined)l[4]=p.caseText;});}

apply('CORE-161',[
'Aristotle, Nicomachean Ethics, I.7, II.1–6, VI.5–13.','Immanuel Kant, Groundwork of the Metaphysics of Morals, Ak. 4:421, 4:429.','John Stuart Mill, Utilitarianism, chs. 2 and 5.','John Rawls, A Theory of Justice, rev. ed., §§4, 11, 24, 46.','Tom L. Beauchamp & James F. Childress, Principles of Biomedical Ethics, 8th ed., chs. 4–7.','Luciano Floridi et al., “AI4People—An Ethical Framework for a Good AI Society,” Minds and Machines 28 (2018): 689–707.'],[
['Russ Shafer-Landau, The Fundamentals of Ethics, chs. 1–3.'],
['Aristotle, Nicomachean Ethics, I.7 (1097b22–1098a20); II.6 (1106b36–1107a8); VI.5 (1140b4–30).'],
['J. S. Mill, Utilitarianism, ch. 2, especially paras. 2–8; ch. 5 on justice.'],
['Kant, Groundwork, Ak. 4:421 (Formula of Universal Law); 4:429 (Formula of Humanity).'],
['Wesley Newcomb Hohfeld, “Some Fundamental Legal Conceptions as Applied in Judicial Reasoning,” Yale Law Journal 23 (1913): 16–59; Ronald Dworkin, Taking Rights Seriously, ch. 7.'],
['Rawls, A Theory of Justice, rev. ed., §§4, 11, 24, 46.'],
['Carol Gilligan, In a Different Voice; Virginia Held, The Ethics of Care, chs. 1–2; Catriona Mackenzie & Natalie Stoljar, eds., Relational Autonomy, introduction.'],
['Beauchamp & Childress, Principles of Biomedical Ethics, 8th ed., chs. 4–7.'],
['Aldo Leopold, A Sand County Almanac, “The Land Ethic”; Stephen Gardiner, A Perfect Moral Storm, chs. 1–2.'],
['Michael Davis, Profession, Code and Ethics; OECD, Managing Conflict of Interest in the Public Service, 2003, chs. 1–2.'],
['Floridi et al., “AI4People,” Minds and Machines 28 (2018): 689–707; NIST AI RMF 1.0, 2023, pp. 1–6.'],
['Rawls, A Theory of Justice, §9 on reflective equilibrium; William MacAskill, Krister Bykvist & Toby Ord, Moral Uncertainty, chs. 1–2.']
],{
0:{body:'메타윤리는 “무엇을 해야 하는가”라는 규범윤리의 직접 답변과 달리 도덕판단의 의미, 진리값, 이유, 객관성의 지위를 분석한다. 서로 다른 문화의 관행이 존재한다는 기술적 사실만으로 규범적 상대주의가 논리적으로 도출되지는 않는다.'},
1:{body:'아리스토텔레스의 덕윤리는 단순한 “중간값 선택”이 아니다. eudaimonia는 인간의 기능과 탁월성에 관한 I.7의 논증과 연결되고, 중용은 II.6에서 “우리와 관련된 중간”으로 규정되며 phronesis는 VI권의 실천적 이성 논의와 연결된다.'},
2:{body:'Mill의 공리주의는 모든 관련자의 행복을 공평하게 고려하는 결과주의적 기준이지만 단순한 숫자 합산 알고리즘으로 환원되지 않는다. Mill은 행복의 질적 차이와 정의·권리 문제도 별도로 논한다.',formula:'교육용 추상화: choose action a to maximize expected welfare Σ_i w_i·E[U_i|a]; 이것은 Mill 원문의 공식이 아니라 현대적 형식화 예시다.'},
3:{body:'Kant의 정언명령은 “내가 싫어하는 행동은 금지” 같은 직관검사가 아니다. Groundwork 4:421의 보편법칙 정식과 4:429의 인간성 정식은 서로 관련되지만 구별되는 정식이며, 실제 적용에서는 행위준칙(maxim)을 정확히 구성해야 한다.',formula:'Universal Law test: act only on a maxim that one can will as universal law; 이는 수학식이 아니다.'},
4:{body:'도덕적 권리, 헌법상 기본권, 사법상 청구권은 동일 개념이 아니다. Hohfeld의 claim-right/duty, privilege/no-right, power/liability, immunity/disability는 법적 관계의 분석도구이고 Dworkin의 권리론은 정치철학적 논증이므로 관할법의 실제 권리판단과 분리한다.'},
5:{body:'Rawls의 original position과 veil of ignorance는 실제 역사적 계약이 아니라 공정한 선택조건을 모델링하는 사고실험이다. 두 정의원칙과 difference principle을 AI 분배정책에 적용할 때에도 Rawls 원전의 기본구조·기본재 논의를 현대정책의 경험효과와 구별한다.'},
6:{body:'돌봄윤리와 relational autonomy는 동일 이론이 아니다. care ethics는 관계·의존·돌봄의 도덕적 중요성을 강조하고 relational autonomy는 자율성이 사회관계와 권력조건 속에서 형성된다는 별도 논의를 발전시킨다.'},
7:{body:'자율성·악행금지·선행·정의의 네 원칙은 Beauchamp와 Childress의 principlism에서 널리 사용되는 분석틀이다. 네 원칙은 자동 우선순위를 갖는 알고리즘이 아니며 임상판단·법적 의무·환자선호를 대신하지 않는다.'},
8:{body:'Leopold의 land ethic과 미래세대 정의는 동일 논증이 아니다. 생태계의 도덕적 고려범위, 동물윤리, 기후의 세대간 책임은 서로 다른 이론적 근거를 가질 수 있으므로 하나의 “환경윤리” 결론으로 합치지 않는다.'},
9:{body:'전문직의 높은 주의·충실성은 직역별 법률·계약·직업규범에 따라 달라진다. 모든 전문가가 법률상 fiduciary인 것은 아니므로 professional ethics, conflict of interest와 법적 fiduciary duty를 분리한다.'},
10:{body:'AI 윤리원칙은 법규범·표준·조직정책과 효력이 다르다. AI4People의 beneficence, non-maleficence, autonomy, justice, explicability는 규범적 프레임이고 NIST AI RMF는 위험관리 프레임워크다. 이를 법적 책임요건으로 직접 치환하지 않는다.'},
11:{body:'도덕적 불확실성은 여러 윤리이론을 임의 가중평균하는 것과 동일하지 않다. reflective equilibrium, 이론 간 불확실성, precaution, 절차적 정당성은 서로 다른 판단전략이며 적용 시 선택근거를 명시해야 한다.'}
});
window.NEXUS_QA_CORRECTIONS['CORE-161']={date:'2026-08-20',status:'ETHICS_SOURCE_SCOPE_REVISED',changes:['Aristotle 원전 위치 특정','Mill 원문과 수학적 효용합산식 분리','Kant 4:421·4:429 구분','도덕적 권리와 법적 권리 분리','Rawls 사고실험 성격 명시','principlism의 비알고리즘적 성격 명시','AI 윤리원칙과 법규범 효력 분리']};

apply('CORE-162',[
'Plato, Republic, Book X, 595a–608b.','Aristotle, Poetics, 1447a–1454b.','Kant, Critique of the Power of Judgment, §§1–5, 23–29.','Arthur Danto, “The Artworld,” Journal of Philosophy 61(19) (1964): 571–584.','Walter Benjamin, “The Work of Art in the Age of Its Technological Reproducibility,” second version.','Margaret A. Boden & Ernest A. Edmonds, “What is Generative Art?,” Digital Creativity 20(1–2) (2009): 21–46.'],[
['Plato, Republic X, 595a–608b; compare Republic II–III on poetry and education.'],
['Aristotle, Poetics 1447a–1454b; catharsis at 1449b24–28; plot at 1450a15–1451b.'],
['Kant, Critique of Judgment, §§1–5 on judgments of taste; §§23–29 on the sublime.'],
['Clive Bell, Art, ch. 1, “The Aesthetic Hypothesis.”'],
['R. G. Collingwood, The Principles of Art, Book I, chs. 5–6; Book III on expression and imagination.'],
['Danto, “The Artworld,” Journal of Philosophy 61(19) (1964): 571–584; George Dickie, Art and the Aesthetic, ch. 2.'],
['Walter Benjamin, “The Work of Art in the Age of Its Technological Reproducibility,” §§II–XV in the second version; edition pagination varies.'],
['Clement Greenberg, “Modernist Painting,” 1960/1965 version; Peter Bürger, Theory of the Avant-Garde, introduction and ch. 3.'],
['Eduard Hanslick, On the Musically Beautiful, chs. 1–3.'],
['Pierre Bourdieu, Distinction, introduction and Part I; Hans Robert Jauss, “Literary History as a Challenge to Literary Theory.”'],
['Donald Norman, The Design of Everyday Things, rev. ed., chs. 1–2; Yuriko Saito, Everyday Aesthetics, introduction.'],
['Boden & Edmonds, “What is Generative Art?,” Digital Creativity 20 (2009): 21–46; Joanna Zylinska, AI Art, 2020, introduction.']
],{
0:{body:'Plato의 Republic X는 모방시를 진리에서 멀어진 모방으로 비판하고 영혼에 미치는 영향 때문에 이상국가의 교육·정치 문제로 다룬다. 그러나 이를 “플라톤은 모든 예술을 동일하게 부정했다”는 명제로 확대하지 않고 Republic II–III의 교육논의와 다른 대화편도 구분한다.'},
1:{body:'Aristotle의 mimesis는 단순복제가 아니라 인간행위의 가능한 구조를 구성하는 시적 재현이다. 비극의 핵심요소 가운데 plot을 중시하며 catharsis는 Poetics 1449b24–28의 짧은 구절 때문에 해석사에서 논쟁이 있음을 명시한다.'},
2:{body:'Kant의 미와 숭고는 같은 판단이 아니다. §§1–5의 taste는 disinterested pleasure와 보편타당성 요구를 다루고 §§23–29의 sublime은 형식적 아름다움과 다른 경험구조를 논한다.'},
3:{body:'Bell의 significant form은 20세기 형식주의의 특정 이론이다. 모든 작품의 가치가 객관적으로 형식만으로 결정된다는 검증된 사실이 아니라 미학적 논제이며 역사·사회·도상·제도적 해석과 경쟁한다.'},
4:{body:'Collingwood는 art proper를 craft·amusement·magic 등과 구분하고 예술적 expression을 단순 감정방출과 구별한다. 블루스의 사회사나 청자의 실제 정서효과는 이 철학적 이론만으로 입증되지 않는다.'},
5:{body:'Danto의 artworld 논의와 Dickie의 institutional theory는 관련되지만 동일 이론이 아니다. Duchamp의 Fountain 사례는 물리적 속성만으로 예술지위를 설명하기 어렵다는 논의를 보여주지만 “미술관에 들어가면 무엇이든 예술”이라는 규칙을 뜻하지 않는다.'},
6:{body:'Benjamin의 aura와 기술복제 논의는 사진·영화와 대중정치의 역사적 맥락에서 전개됐다. 스트리밍·NFT·생성AI에 적용할 때는 현대적 확장이며 Benjamin이 직접 그 기술들을 분석한 것처럼 소급하지 않는다.'},
7:{body:'Greenberg의 medium specificity와 Bürger의 avant-garde 제도비판은 구분한다. modernism과 avant-garde를 하나의 동일 운동으로 묶지 않고 작품·매체·제도에 따라 분석한다.'},
8:{body:'Hanslick의 형식주의는 음악의 미적 내용을 “sonically moving forms”에 두는 입장으로 읽혀 왔다. 이것이 음악의 감정·사회적 의미가 실제로 존재하지 않는다는 경험적 사실을 증명하는 것은 아니다.'},
9:{body:'Bourdieu의 taste 분석은 계급·교육·문화자본과 취향의 사회적 구조를 경험적으로 연구한다. reception theory·interpretive community·작가의도 논쟁은 다른 전통이므로 하나의 이론으로 합치지 않는다.'},
10:{body:'Norman의 affordance·signifier·feedback는 사용성 설계의 핵심개념이고 Saito의 everyday aesthetics는 일상경험의 미학적 차원을 논한다. “사용하기 쉽다=아름답다”는 동일성은 성립하지 않는다.'},
11:{body:'생성형 AI 예술은 저자성·과정·선택·우연·규칙·데이터를 새롭게 문제화하지만 Danto의 1964/1981 논의가 생성AI에 대한 직접 원자료는 아니다. generative art의 계보와 AI art의 현대 논의를 별도 자료로 연결한다.'}
});
window.NEXUS_QA_CORRECTIONS['CORE-162']={date:'2026-08-20',status:'AESTHETICS_ATTRIBUTION_REVISED',changes:['Plato의 범위 과잉일반화 제거','Poetics 원전 좌표 특정','Kant 미·숭고 구분','Danto/Dickie 이론 분리','Benjamin 현대기술 소급 방지','생성AI 미학에 현대 원자료 추가']};

apply('CORE-163',[
'Ninian Smart, Dimensions of the Sacred, 1996, ch. 1 and dimensional framework.','Mircea Eliade, The Sacred and the Profane, 1957; use as a historical theory, not a universal empirical law.','William W. Hallo, ed., The Context of Scripture, vols. 1–3.','The Hebrew Bible; Mishnah, especially Avot and selected tractates; Dead Sea Scrolls for Second Temple diversity.','Council of Nicaea (325) and Niceno-Constantinopolitan Creed (381), distinguished historically.','Qur’an; early Hadith collections; Marshall Hodgson, The Venture of Islam, vol. 1.'],[
['Smart, Dimensions of the Sacred, ch. 1; Wilfred Cantwell Smith, The Meaning and End of Religion, chs. 1–2.'],
['Eliade, The Sacred and the Profane, introduction and chs. 1–2; Catherine Bell, Ritual Theory, Ritual Practice, chs. 1–2.'],
['The Context of Scripture, vols. 1–3; ANET selections; primary texts must be identified by document and period rather than “ancient Near East” generally.'],
['Hebrew Bible; Mishnah Avot 1; selected Mishnah tractates; Josephus and Dead Sea Scrolls for Second Temple Judaism.'],
['New Testament; Creed of Nicaea 325; Niceno-Constantinopolitan Creed 381; Athanasius, Orations Against the Arians.'],
['Qur’an; selected Hadith; Hodgson, Venture of Islam, vol. 1; Wael Hallaq, An Introduction to Islamic Law, chs. 1–3.'],
['Selected Upanishads; Bhagavad Gita, chs. 2–3, 12, 18; Gavin Flood, An Introduction to Hinduism.'],
['Dhammacakkappavattana Sutta, SN 56.11; Anattalakkhana Sutta, SN 22.59; Dhammapada selections.'],
['Analects; Daodejing; selected Buddhist texts; note historical periods and regional transmission separately.'],
['Max Weber, Sociology of Religion; José Casanova, Public Religions in the Modern World, introduction and ch. 1.'],
['John Hick, An Interpretation of Religion, normative philosophy of religion; Charles Taylor, A Secular Age, introduction; legal religious-freedom questions require jurisdiction-specific law.'],
['Heidi Campbell, ed., Digital Religion, introduction; Heidi Campbell & Wendi Bellar, Digital Religion, 2023, selected chapters.']
],{
0:{body:'“종교”는 학계에서도 단일 필수조건으로 합의된 자연종류가 아니다. Smart의 dimensions는 비교를 위한 휴리스틱이고 Smith는 religion이라는 서구 근대 범주의 역사성을 비판한다. 따라서 신 개념의 유무 하나로 종교 여부를 판정하지 않는다.'},
1:{body:'Eliade의 sacred/profane은 영향력 있는 종교현상학적 이론이지만 모든 문화에서 동일하게 확인된 보편법칙으로 취급하지 않는다. ritual은 상징, 권력, 수행, 제도 등 여러 이론으로 분석될 수 있다.'},
2:{body:'고대근동 종교는 수천 년과 여러 정치체를 포괄하므로 “왕권=신권, 신전=경제” 같은 단일모형으로 요약하지 않는다. 각 주장마다 메소포타미아·이집트·우가릿 등 문서의 작성시기·장르·정치맥락을 특정한다.'},
3:{body:'유대교의 Torah·Temple·covenant·rabbinic tradition은 같은 시대의 요소가 아니다. 제2성전기에는 다양한 집단과 해석전통이 있었고, 70 CE 이후의 rabbinic Judaism 형성도 장기과정이므로 성서시대·제2성전기·미쉬나 시대를 구분한다.'},
4:{body:'초기 기독교의 교리형성에서 325년 Nicaea의 creed와 381년 Constantinople에서 확립된 Niceno-Constantinopolitan Creed를 동일 문서로 쓰지 않는다. Christology·Trinity의 후대 정식화를 1세기 공동체가 이미 동일 전문용어로 체계화한 것처럼 소급하지 않는다.'},
5:{body:'Qur’an, Hadith, fiqh, madhhab은 성립·정전화 시기와 권위구조가 다르다. 7세기 초기 ummah의 정치질서를 후대의 성숙한 fiqh 체계와 동일시하지 않고 Sunni/Shiʿa 분화도 정치적 계기와 후대 신학·법 전통을 구분한다.'},
6:{body:'“Hinduism”은 Vedic, Upanishadic, devotional, philosophical, ritual traditions를 포괄하는 후대의 광범위한 명칭이다. dharma·karma·moksha·atman의 의미도 문헌과 학파마다 다르므로 Bhagavad Gita의 특정 논의를 전체 힌두 전통의 단일교리로 일반화하지 않는다.'},
7:{body:'사성제와 팔정도는 초기불교의 핵심교설이지만 Buddhist traditions 전체의 철학을 하나의 체계로 환원하지 않는다. anatta와 dependent origination의 의미도 Nikāya 자료와 후대 Abhidharma·Mahāyāna 논의를 구분한다.'},
8:{body:'유교·도교·불교·민간신앙은 시대와 지역에 따라 상호작용했지만 “동아시아 종교”라는 하나의 혼합종교가 있었던 것은 아니다. 원전의 작성·편집시기와 후대 국가제도·제례를 분리한다.'},
9:{body:'secularization은 종교의 단순 소멸을 뜻하는 단일 법칙이 아니다. 제도 분화, 개인적 신앙 변화, 공적 종교의 지속 등 여러 차원을 구분하고 국가별 경험자료를 확인한다.'},
10:{body:'Hick의 pluralism은 규범적 종교철학의 한 입장이지 세계 종교관계의 중립적 경험법칙이 아니다. 종교자유·국가중립성은 각 헌법과 국제인권법의 관할별 규범을 별도로 검토한다.'},
11:{body:'digital religion 연구는 온라인과 오프라인 종교권위·공동체·의례가 어떻게 재구성되는지 경험적으로 분석한다. AI가 신학답변을 생성할 수 있다는 기술능력과 그 답변의 종교적 권위·정통성·법적 지위를 동일시하지 않는다.'}
});
window.NEXUS_QA_CORRECTIONS['CORE-163']={date:'2026-08-20',status:'RELIGION_HISTORY_SOURCE_REVISED',changes:['종교 정의의 비본질주의적 성격 명시','고대근동 사료의 시공간 범위 분리','유대교 시대층 구분','325 Nicaea와 381 creed 구분','초기 Islam과 후대 fiqh 분리','Hindu/Buddhist 전통 내부 다양성 반영','Hick 규범이론과 경험자료 분리']};

apply('CORE-164',[
'Lewis Mumford, Technics and Civilization, 1934.','E. P. Thompson, “Time, Work-Discipline, and Industrial Capitalism,” Past & Present 38 (1967): 56–97.','Karl Marx, Capital, vol. I, chs. 13–15; Economic and Philosophic Manuscripts of 1844 for alienation.','Martin Heidegger, “The Question Concerning Technology,” in The Question Concerning Technology and Other Essays.','Wiebe Bijker, Thomas Hughes & Trevor Pinch, eds., The Social Construction of Technological Systems.','Jack Stilgoe, Richard Owen & Phil Macnaghten, “Developing a Framework for Responsible Innovation,” Research Policy 42(9) (2013): 1568–1580.'],[
['Mumford, Technics and Civilization, introduction and chs. 1–2.'],
['Thompson, “Time, Work-Discipline, and Industrial Capitalism,” Past & Present 38 (1967): 56–97.'],
['Marx, Capital I, chs. 13–15 on cooperation, manufacture and machinery; 1844 Manuscripts, “Estranged Labour” for alienation.'],
['Heidegger, “The Question Concerning Technology,” especially discussion of instrumentality, revealing, Bestand and Gestell; edition pagination varies.'],
['Jacques Ellul, The Technological Society, introduction and Part I; treat as social theory, not deterministic empirical law.'],
['Marshall McLuhan, Understanding Media, ch. 1, “The Medium Is the Message.”'],
['Bijker, Hughes & Pinch, Social Construction of Technological Systems, introduction and Pinch/Bijker bicycle study.'],
['Charles Perrow, Normal Accidents, chs. 1–3; Ulrich Beck, Risk Society, introduction; theories are distinct.'],
['Shoshana Zuboff, The Age of Surveillance Capitalism, introduction; empirical claims require platform- and dataset-specific evidence.'],
['Jürgen Habermas, The Future of Human Nature; normative bioethics, not an empirical forecast of BCI or gene editing.'],
['Andy Clark & David Chalmers, “The Extended Mind,” Analysis 58(1) (1998): 7–19; deskilling is a separate empirical claim.'],
['Stilgoe, Owen & Macnaghten, “Developing a Framework for Responsible Innovation,” Research Policy 42 (2013): 1568–1580.']
],{
0:{body:'기술은 artefact뿐 아니라 지식, 표준, 인프라, 조직, 사용자 관행을 포함하는 sociotechnical system으로 분석할 수 있다. 그러나 모든 기술변화를 하나의 시스템논리로 설명하는 기술결정론도, 사회적 선택만으로 설명하는 사회결정론도 피한다.'},
1:{body:'Thompson은 산업자본주의의 확산과 함께 task-oriented time에서 clock time·work-discipline으로의 변화가 나타났음을 역사적으로 논증한다. 모든 산업화 사회가 동일 속도와 경로로 변화했다는 보편법칙으로 확대하지 않는다.'},
2:{body:'Marx의 machinery 분석은 Capital I chs. 13–15에, alienated labour의 고전적 서술은 1844 Manuscripts에 있다. 기술 자체가 소외를 필연적으로 만든다는 기술결정론이 아니라 생산관계·소유·노동과정과 함께 읽는다.'},
3:{body:'Heidegger의 Gestell과 Bestand는 기술의 경험적 인과모형이 아니라 현대기술의 존재론적 드러남을 분석하는 철학적 개념이다. 이를 데이터센터나 AI의 실제 사회효과를 측정한 실증연구처럼 인용하지 않는다.'},
4:{body:'Ellul의 technique 자율성 논제는 강한 사회이론적 주장이다. “효율성 추구는 언제나 인간 목적을 압도한다”는 경험적 법칙으로 단정하지 않고 제도·문화·정치적 countervailing force를 별도로 검토한다.'},
5:{body:'McLuhan의 “the medium is the message”는 매체형식이 사회적 경험과 관계를 구성한다는 이론적 명제다. 숏폼이 특정 정치태도를 실제로 유발한다는 인과주장은 별도의 노출자료·실험·관찰연구가 필요하다.'},
6:{body:'SCOT의 bicycle 사례는 relevant social groups, interpretive flexibility, closure를 보여준다. Actor-network theory와 SCOT는 서로 다른 STS 전통이므로 “사회가 기술을 만든다”는 하나의 공식으로 합치지 않는다.'},
7:{body:'Perrow의 normal accident theory는 tight coupling과 interactive complexity를 중심으로, Beck의 risk society는 근대사회에서 제조된 위험의 정치·사회구조를 논한다. 두 이론을 동일한 사고원인모형으로 사용하지 않는다.'},
8:{body:'Zuboff의 surveillance capitalism은 플랫폼 경제에 대한 이론적·역사적 비판이다. 특정 모니터링 기술이 생산성·자율성에 미치는 효과크기는 기업·직무·측정설계별 경험연구로 별도 검증한다.'},
9:{body:'Habermas의 생명공학 논의는 인간자율성·정체성에 대한 규범철학이다. CRISPR·BCI의 안전성, 효과, 실제 사용자 경험은 임상·공학 자료로 따로 검증하고 “치료/향상” 구분도 기술적으로 항상 명확한 것은 아니다.'},
10:{body:'Clark와 Chalmers의 extended mind 논증은 인지과정의 경계를 재고하는 철학적 주장이다. AI 사용이 실제로 deskilling 또는 augmentation을 초래하는지는 task, 숙련도, workflow와 시간에 따른 경험연구가 필요하다.'},
11:{body:'responsible innovation의 anticipation, reflexivity, inclusion, responsiveness는 연구·혁신 거버넌스를 위한 프레임이다. 참여절차를 실시했다는 사실만으로 안전·공정성·적법성이 자동 확보되는 것은 아니다.'}
});
window.NEXUS_QA_CORRECTIONS['CORE-164']={date:'2026-08-20',status:'TECHNOLOGY_PHILOSOPHY_CAUSAL_SCOPE_REVISED',changes:['Marx 원전 귀속 분리','Heidegger 철학개념과 경험명제 분리','Ellul 결정론적 독해 완화','McLuhan과 경험인과 구분','SCOT/ANT 구분','Perrow/Beck 이론 분리','extended mind와 deskilling 효과 분리']};

apply('CORE-165',[
'IPCC, Climate Change 2023: AR6 Synthesis Report, Summary for Policymakers and Longer Report.','NIST AI Risk Management Framework 1.0, 2023; current legal obligations must be checked jurisdiction by jurisdiction.','WHO, International Health Regulations (2005), as amended; WHO pandemic preparedness guidance.','UNHCR, Convention Relating to the Status of Refugees (1951), Art. 1A(2), and current UNHCR guidance.','United Nations, World Population Prospects 2024, methodology and key findings.','IEA, World Energy Outlook and Electricity reports; distinguish scenarios from forecasts.'],[
['IPCC AR6 Synthesis Report, SPM and Sections 2–4.'],
['NIST AI RMF 1.0, 2023; OECD AI Principles, updated 2024; binding AI law must be identified separately by jurisdiction.'],
['WHO International Health Regulations; WHO pandemic preparedness materials; R0 definitions from infectious-disease epidemiology, not a universal βcD identity.'],
['Thomas Schelling, Arms and Influence, chs. 1–2; Robert Jervis, “Cooperation Under the Security Dilemma,” World Politics 30(2) (1978): 167–214.'],
['Robert Dahl, On Democracy for democratic institutions; empirical misinformation/polarization claims require contemporary election and media studies.'],
['Thomas Piketty, Capital in the Twenty-First Century; World Inequality Database methodology for current distributional data.'],
['1951 Refugee Convention, Art. 1A(2); UNHCR Global Trends; climate-related mobility does not automatically satisfy refugee status.'],
['UN World Population Prospects 2024; UN DESA definitions of age groups and support/dependency ratios.'],
['IEA World Energy Outlook; scenario definitions and electricity-system analysis; LCOE alone is insufficient for system planning.'],
['WHO, Social Determinants of Health; IHME GBD methodology for DALY; distinguish normative policy from burden measurement.'],
['Financial Stability Board materials on systemic risk; OECD/World Bank supply-chain resilience work; Taleb is conceptual, not a primary empirical dataset.'],
['Donella Meadows, Thinking in Systems, chs. 1–3; capstone claims must cite domain-specific primary evidence in addition to systems heuristics.']
],{
0:{body:'기후위험은 hazard, exposure, vulnerability의 상호작용으로 분석하지만 Risk=f(H,E,V)는 개념적 함수표현이지 보편적 수치공식이 아니다. 관측된 기후변화, attribution, future projection, adaptation 효과를 서로 다른 증거유형으로 구분한다.',formula:'Conceptual only: Risk = f(Hazard, Exposure, Vulnerability); 변수의 정의·단위·모형은 평가대상에 따라 별도 명시'},
1:{body:'AI 전환의 기술성능·생산성·고용·시장집중·안전·법적 책임은 서로 다른 증거와 제도를 요구한다. NIST AI RMF는 위험관리 프레임워크이며 각 국가의 법적 의무나 실제 생산성 효과를 대신하지 않는다.'},
2:{body:'R0는 완전 감수성 집단에서 하나의 감염자가 만들어내는 기대 2차 감염수라는 모형개념이며 접촉구조·감염기간·감염력 등에 의존한다. R0≈βcD는 단순화된 homogeneous-mixing 모형의 표현이지 모든 감염병에 적용되는 보편식이 아니다.',formula:'Simple homogeneous-mixing illustration: R0≈β·c·D; 실제 추정은 모형구조와 자료에 따라 달라짐'},
3:{body:'security dilemma와 deterrence는 동일개념이 아니다. Schelling의 coercion/deterrence 논의와 Jervis의 security dilemma 조건을 분리하고 핵·AI 조기경보의 실제 위험은 기술신뢰도, 조직절차, 경보시간, 지휘통제 자료로 별도 검증한다.'},
4:{body:'민주주의 제도에 관한 Dahl의 이론과 현대 misinformation·polarization의 경험적 효과를 분리한다. 생성형 AI 콘텐츠가 존재한다는 사실만으로 투표행동 변화나 민주주의 약화를 인과적으로 결론내리지 않는다.'},
5:{body:'Gini coefficient는 소득·부 분포의 불평등을 요약하는 지표이지 사회이동성이나 기회의 불평등을 직접 측정하지 않는다. 표본가중치, 단위(개인/가구), 소득개념, 세전/세후에 따라 값이 달라질 수 있다.',formula:'Population form: G=(Σ_iΣ_j|y_i−y_j|)/(2n²μ), μ>0; 표본·가중자료는 별도 추정식 필요'},
6:{body:'전쟁·박해·경제·재난·기후와 관련된 이동은 법적 범주가 다르다. 1951 Refugee Convention Art. 1A(2)의 refugee 정의는 특정한 박해사유를 요구하므로 “기후이주민=난민”으로 자동 분류하지 않고 보완적 보호와 국내법을 별도 검토한다.'},
7:{body:'dependency ratio는 선택한 연령구간에 따른 인구통계 지표이고 실제 경제적 부양부담·돌봄수요와 동일하지 않다. 국가·기관별 young/working/old age 기준을 명시한 뒤 계산한다.',formula:'Example only: dependency ratio=(population in defined young + defined old ages)/(population in defined working ages); age cutoffs must be stated'},
8:{body:'IEA의 stated policies, announced pledges, net-zero 등 scenario는 조건부 경로이지 발생확률이 부여된 단일 forecast가 아니다. 전력전환 평가는 발전비용뿐 아니라 grid, storage, flexibility, reliability, transmission과 수요반응을 함께 본다.'},
9:{body:'DALY=YLL+YLD는 질병부담 측정의 요약식이지만 disability weights, standard life expectancy, cause attribution 등 방법론적 선택을 포함한다. 사회적 결정요인의 인과효과와 의료 AI의 접근성 개선은 별도의 경험연구가 필요하다.',formula:'DALY = YLL + YLD; 각 구성요소의 추정방법과 자료원을 명시'},
10:{body:'systemic risk는 네트워크 상호연결, 공통익스포저, 레버리지, 유동성, 대체불가능성 등으로 전파될 수 있다. supply-chain disruption과 금융시스템 위기는 유사한 “연쇄효과”가 있어도 동일 모형이 아니며 Taleb의 antifragility는 개념적 프레임이지 실증 데이터셋이 아니다.'},
11:{body:'Capstone은 systems thinking을 근거 대체물로 사용하지 않는다. 문제경계와 feedback loop를 Meadows의 도구로 구조화하되 기후·의학·법·경제·AI 각각의 핵심 주장은 해당 분야의 원자료와 최신 통계로 별도 입증한다.'}
});
window.NEXUS_QA_CORRECTIONS['CORE-165']={date:'2026-08-20',status:'GLOBAL_ISSUES_EVIDENCE_LAYER_REVISED',changes:['기후 risk 함수의 개념적 성격 명시','AI framework와 법적 의무 분리','R0 단순식의 모형조건 명시','민주주의 이론과 misinformation 인과효과 분리','Gini 적용조건 보강','기후이주와 Refugee Convention 지위 분리','dependency ratio 연령기준 명시','IEA scenario와 forecast 구분','DALY 방법론 명시','systems thinking과 원자료 증거 분리']};
})();