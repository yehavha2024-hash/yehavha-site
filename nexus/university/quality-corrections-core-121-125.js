(()=>{'use strict';
const tb=window.NEXUS_CORE_TEXTBOOK||{};
window.NEXUS_QA_CORRECTIONS=window.NEXUS_QA_CORRECTIONS||{};
function apply(id,texts,refs,patches){const c=tb[id];if(!c)return;c.texts=texts;refs.forEach((r,i)=>{if(c.lessons[i])c.lessons[i][5]=Array.isArray(r)?r:[r]});Object.entries(patches||{}).forEach(([k,p])=>{const l=c.lessons[Number(k)];if(!l)return;if(p.title!==undefined)l[0]=p.title;if(p.body!==undefined)l[1]=p.body;if(p.concepts!==undefined)l[2]=p.concepts;if(p.formula!==undefined)l[3]=p.formula;if(p.caseText!==undefined)l[4]=p.caseText;});}

apply('CORE-121',[
 "Martha T. Roth, Law Collections from Mesopotamia and Asia Minor, 2nd ed., Scholars Press, 1997.",
 "Ian Shaw (ed.), The Oxford History of Ancient Egypt, Oxford University Press, 2000.",
 "Jonathan Mark Kenoyer, Ancient Cities of the Indus Valley Civilization, Oxford University Press, 1998.",
 "Mark Edward Lewis, The Early Chinese Empires: Qin and Han, Harvard University Press, 2007.",
 "Dennis J. McCarthy, Treaty and Covenant, Pontifical Biblical Institute, 1978.",
 "Mogens Herman Hansen, The Athenian Democracy in the Age of Demosthenes, University of Oklahoma Press, 1999.",
 "Graham Shipley, The Greek World After Alexander 323–30 BC, Routledge, 2000.",
 "Mary Beard, SPQR: A History of Ancient Rome, Liveright, 2015.",
 "Peter Brown, The World of Late Antiquity, Thames & Hudson, 1971.",
 "Hugh Kennedy, The Prophet and the Age of the Caliphates, 3rd ed., Routledge, 2016.",
 "Susan Reynolds, Fiefs and Vassals, Oxford University Press, 1994.",
 "Janet L. Abu-Lughod, Before European Hegemony, Oxford University Press, 1989."
],[
 ["Code of Hammurabi, prologue and laws §§196–201, in Roth, Law Collections, 2nd ed., 1997; social categories awīlum/muškēnum/wardum require cautious translation."],
 ["Pyramid Texts, Old Kingdom royal mortuary corpus; Ian Shaw (ed.), The Oxford History of Ancient Egypt, Old Kingdom chapters. The Book of the Dead is a later funerary corpus and is not used as a primary source for pyramid-state formation."],
 ["Kenoyer, Ancient Cities of the Indus Valley Civilization, 1998; Gregory L. Possehl, The Indus Civilization, 2002. The Indus script remains undeciphered, limiting claims about political institutions."],
 ["Sima Qian, Shiji, especially Qin and early Han biographies/annals; Confucius, Analects; Mark Edward Lewis, The Early Chinese Empires, 2007. Qin-Han institutions cannot be reduced to a simple Legalism→Confucianism replacement."],
 ["Hebrew Bible: Exodus 20–24 and Deuteronomy 5–28; McCarthy, Treaty and Covenant, 1978. Comparisons with ancient Near Eastern treaty forms are typological and historical, not proof of simple one-way derivation."],
 ["Aristotle, Constitution of the Athenians §§20–22, 42; Thucydides 2.37–46; Hansen, Athenian Democracy, 1999. The relation between hoplite warfare and democratization is debated rather than a settled causal chain."],
 ["Arrian, Anabasis III.1–2 on the foundation of Alexandria; Strabo, Geography 17.1.8 on Alexandria; Shipley, The Greek World After Alexander, 2000. Cultural interaction included coexistence, adaptation and hierarchy, not only ‘fusion’."],
 ["Polybius, Histories VI.11–18 on the Roman constitution; Augustus, Res Gestae §34; Constitutio Antoniniana, P.Giss. 40 (AD 212). Citizenship expanded over centuries and should not be treated as a timeless feature of one uniform Roman legal order."],
 ["Lactantius, De Mortibus Persecutorum 48 on the 313 imperial policy of toleration/restitution; Codex Theodosianus 16.1.2, Cunctos populos (27 Feb. 380), on Nicene imperial religious policy; Eusebius, Life of Constantine, read as an interested/panegyrical source."],
 ["Qur’an and early community sources; Kennedy, The Prophet and the Age of the Caliphates, 3rd ed., 2016; Wael B. Hallaq, The Origins and Evolution of Islamic Law, Cambridge University Press, 2005. Mature schools of fiqh and systematic sharia doctrine developed over later centuries."],
 ["Marc Bloch, Feudal Society, 1939–40; Susan Reynolds, Fiefs and Vassals, 1994. ‘Feudalism’ is a contested analytical category rather than a single medieval constitutional blueprint."],
 ["Ibn Battuta, Rihla, fourteenth-century travel account; Abu-Lughod, Before European Hegemony, 1989; plague transmission is analyzed through connected routes while exact origins and pathways require separate epidemiological evidence."]
],{
 0:{body:"Old Babylonian states combined irrigation, temples, palaces, scribal administration and royal adjudication, but the so-called Code of Hammurabi is a royal inscribed law collection, not a modern exhaustive statutory code. Its casuistic provisions and status distinctions illuminate ideology and legal practice only when read together with contracts, court records and letters."},
 1:{body:"Old Kingdom Egyptian kingship linked taxation, labor mobilization, mortuary cult and monumental building. The Pyramid Texts are relevant royal mortuary sources; the later Book of the Dead should not be projected backward as evidence for the organization of Fourth-Dynasty pyramid construction."},
 3:{body:"From Shang and Zhou precedents through Qin and Han, kingship, ritual, bureaucratic techniques and competing textual traditions changed substantially. Qin-Han government retained coercive and administrative practices often associated with Legalist thinkers while Confucian learning gained increasing ideological and educational importance; this was not an abrupt replacement of one pure system by another."},
 4:{body:"Biblical covenant and law traditions developed within the wider ancient Near Eastern world of treaties, temples, kingship and law collections. Similar forms can be compared, but chronology, redaction and genre must be examined before claiming direct dependence or treating later theological categories as unchanged across all periods."},
 5:{body:"Greek poleis differed sharply. Classical Athens developed unusually broad male-citizen participation while excluding women, enslaved people and resident foreigners from full political citizenship. Military organization, social class, institutions and ideology interacted, but a simple ‘hoplite warfare caused democracy’ thesis remains debated."},
 6:{body:"After Alexander, Koine Greek, royal institutions, cities and trade networks expanded across a world that retained strong Egyptian, Iranian, Jewish and other local traditions. ‘Hellenization’ therefore describes uneven interaction, adaptation and power relations rather than an automatic cultural fusion."},
 7:{body:"Roman integration changed from Republic to Principate and later Empire. Citizenship, local status, taxation, military service and juristic practice evolved over time; Caracalla’s Constitutio Antoniniana in AD 212 extended Roman citizenship to most free inhabitants of the empire, so ‘Roman citizenship’ must always be located chronologically."},
 8:{body:"Christianity grew from Jewish settings into the Greek- and Latin-speaking Roman world. Constantine’s 313 policy protected Christian worship and restored property but did not itself make Christianity the empire’s sole official religion. In 380 Cunctos populos endorsed Nicene Christianity as the required imperial confession. These distinct stages must not be collapsed into one event."},
 9:{body:"Islam emerged in seventh-century Arabia as a religious and political community and expanded under the caliphates. Qur’anic norms and early practice were foundational, but the mature juristic schools, legal theory and the later systematization commonly called sharia/fiqh developed through eighth- and ninth-century and later scholarship; those later structures should not be projected intact into the earliest period."},
 10:{body:"Medieval European lordship, landholding, vassalage, manorial relations, kingship, ecclesiastical jurisdictions and towns varied by place and century. ‘Feudalism’ is useful only as a qualified analytical label and should not be taught as one universal pyramid extending uniformly across medieval Europe."},
 11:{body:"Silk Road, Indian Ocean and trans-Saharan networks moved goods, people, beliefs and pathogens across Eurasia and Africa. For the Black Death, connected trade and mobility help explain rapid spread, but exact origins and transmission routes require archaeological, textual and biological evidence and should not be inferred from a single travel narrative."}
});
window.NEXUS_QA_CORRECTIONS['CORE-121']={date:'2026-08-20',status:'CHRONOLOGY_PRIMARY_SOURCE_REVISED',changes:['함무라비 법전을 현대적 포괄 법전처럼 읽는 표현 교정','이집트 Old Kingdom에 후기 Book of the Dead를 소급 적용한 출처 교체','진·한의 법가→유가 단순 교체서사 수정','성서 언약과 고대근동 조약 비교의 직접의존 단정 방지','아테네 민주정과 hoplite 인과의 논쟁성 명시','헬레니즘을 단순 문화융합으로 표현한 서술 수정','로마 시민권의 시대별 변화와 212년 Constitutio Antoniniana 반영','313년 관용과 380년 니케아 제국규범 구분','성숙한 sharia/fiqh를 7세기에 소급 적용하지 않도록 수정','feudalism의 분석개념 논쟁 명시']};

apply('CORE-122',[
 "C. A. Bayly, The Birth of the Modern World, 1780–1914, Blackwell, 2004.",
 "Diarmaid MacCulloch, The Reformation, Viking, 2003.",
 "Steven Shapin, The Scientific Revolution, University of Chicago Press, 1996.",
 "Alfred W. Crosby, The Columbian Exchange, Greenwood, 1972.",
 "Laurent Dubois, Avengers of the New World, Harvard University Press, 2004.",
 "Robert C. Allen, The British Industrial Revolution in Global Perspective, Cambridge University Press, 2009.",
 "Benedict Anderson, Imagined Communities, rev. ed., Verso, 2006.",
 "Jürgen Osterhammel, Colonialism: A Theoretical Overview, Markus Wiener, 2005.",
 "Christopher Clark, The Sleepwalkers, Harper, 2013.",
 "Richard J. Evans, The Coming of the Third Reich, Penguin, 2004.",
 "Odd Arne Westad, The Global Cold War, Cambridge University Press, 2005.",
 "Manuel Castells, The Rise of the Network Society, 2nd ed., Wiley-Blackwell, 2010."
],[
 ["Petrarch, selected Letters; Jacob Burckhardt as a later historiographical interpretation; Elizabeth Eisenstein, The Printing Press as an Agent of Change, 1979. Movable-type print spread from the mid-fifteenth century and should not be made the cause of the earlier Italian Renaissance."],
 ["Martin Luther, Ninety-Five Theses (1517); Freedom of a Christian (1520); Augsburg Confession (1530); Peace of Augsburg (1555). The famous church-door posting is not required for explaining the documented circulation of the theses."],
 ["Galileo, Dialogue Concerning the Two Chief World Systems (1632); Newton, Principia (1687); Shapin, The Scientific Revolution, 1996. Early modern science used heterogeneous mathematical, observational, experimental and artisanal practices rather than one timeless ‘scientific method’."],
 ["Crosby, The Columbian Exchange, 1972; Dennis O. Flynn & Arturo Giráldez, “Born with a Silver Spoon: The Origin of World Trade in 1571,” Journal of World History 6(2), 1995, 201–221."],
 ["Declaration of the Rights of Man and of the Citizen (1789), arts. 1 and 6; Haitian Declaration of Independence (1804); Constitution of Haiti (1805); C. L. R. James, The Black Jacobins, 1938."],
 ["Allen, The British Industrial Revolution in Global Perspective, 2009; Kenneth Pomeranz, The Great Divergence, 2000; Friedrich Engels, The Condition of the Working Class in England, 1845, used as a contemporary partisan source rather than neutral statistics."],
 ["Anderson, Imagined Communities, rev. ed. 2006, especially chs. 2–3; Ernest Gellner, Nations and Nationalism, 1983. Print-capitalism is one influential explanation, not a complete universal causal law."],
 ["J. A. Hobson, Imperialism: A Study, 1902; Edward Said, Orientalism, 1978; Osterhammel, Colonialism, 2005. These works represent distinct economic, cultural and comparative interpretations, not interchangeable primary causes."],
 ["Clark, The Sleepwalkers, 2013; Fritz Fischer, Germany’s Aims in the First World War, English ed. 1967. Sarajevo, 28 June 1914, is treated as a trigger within a larger causal debate, not the sole cause."],
 ["Evans, The Coming of the Third Reich, 2004; Saul Friedländer, Nazi Germany and the Jews, vol. 1, 1997. Economic crisis alone is not a sufficient explanation of fascism, dictatorship or the Holocaust."],
 ["Westad, The Global Cold War, 2005; Final Communiqué of the Asian-African Conference, Bandung (1955); Korean and Vietnamese wars require both Cold War and local/decolonization histories."],
 ["Castells, The Rise of the Network Society, 2nd ed. 2010; Richard Baldwin, The Great Convergence, 2016. Osterhammel’s The Transformation of the World is principally a nineteenth-century global history and is not used as the sole source for post-1970 digital globalization."]
],{
 0:{body:"Renaissance humanism and urban patronage developed before movable-type printing transformed the scale and speed of textual circulation after the mid-fifteenth century. Printing amplified and reorganized intellectual exchange; it should not be treated as the single origin of Renaissance humanism."},
 2:{body:"The label ‘Scientific Revolution’ describes major early-modern changes in astronomy, mechanics, natural philosophy, instruments and institutions, but historians dispute both its boundaries and any single method. Galileo and Newton combined mathematics, observation, argument and inherited traditions in different ways."},
 4:{body:"Enlightenment languages of rights and sovereignty intersected with Atlantic revolutions, but their claimed universality coexisted with slavery, colonial rule, property and gender exclusions. The Haitian Revolution (1791–1804) must be studied through its own revolutionary texts and social history rather than as a mere application of the 1789 French declaration."},
 6:{body:"Modern nationalism was built through political institutions, education, military service, print, language standardization and historical narratives in different combinations. Anderson’s ‘imagined communities’ and print-capitalism are influential analytical propositions, not timeless descriptions of all nations."},
 7:{body:"Nineteenth-century imperialism had economic, strategic, technological, racial-ideological and domestic-political dimensions. Hobson, Said and later comparative historians explain different aspects, so no single work should be presented as a neutral comprehensive causal account."},
 8:{body:"The assassination at Sarajevo on 28 June 1914 triggered the July Crisis, but the war’s causes involve alliances, military planning, imperial rivalry, nationalism, decision-making and contingency. Competing historiographies assign responsibility differently; the trigger must be distinguished from structural and proximate causes."},
 9:{body:"The Great Depression weakened many political systems, but economic crisis alone neither defines fascism nor explains the Holocaust. Fascist ideology, authoritarian institutions, political violence, racial antisemitism, war and occupation require distinct causal analysis."},
 11:{body:"Post-1970 globalization combined trade liberalization, containerization, global value chains, finance, computing and digital networks. Internet and platform economies belong to a later chronology than Osterhammel’s nineteenth-century synthesis, so contemporary digital globalization requires separate twentieth- and twenty-first-century sources."}
});
window.NEXUS_QA_CORRECTIONS['CORE-122']={date:'2026-08-20',status:'MODERN_HISTORY_CHRONOLOGY_REVISED',changes:['인쇄술을 르네상스 발생원인으로 소급하는 서술 제한','종교개혁 자료의 연대·문서 구분','Scientific Revolution을 단일 과학방법으로 설명하지 않도록 수정','아이티혁명에 독자 원자료 추가','민족주의·제국주의의 단일원인론 방지','사라예보 촉발요인과 전쟁원인 구분','대공황과 홀로코스트 사이의 단선인과 방지','19세기 Osterhammel을 디지털 세계화의 직접 근거로 사용한 연결 교체']};

apply('CORE-123',[
 "Plato, Republic, standard Stephanus pagination.",
 "Aristotle, Nicomachean Ethics and Politics, standard Bekker pagination.",
 "Epictetus, Enchiridion; Epicurus, Letter to Menoeceus.",
 "Thomas Aquinas, Summa Theologiae I–II, qq. 90–97.",
 "Erasmus, De libero arbitrio (1524); Martin Luther, De servo arbitrio (1525).",
 "Descartes, Meditations (1641); Locke, Essay (1689); Hume, Enquiry (1748).",
 "Hobbes, Leviathan (1651); Locke, Second Treatise (1689); Rousseau, Du contrat social (1762).",
 "Kant, Critique of Pure Reason (A/B pagination); Groundwork (Akademie pagination).",
 "Hegel, Phenomenology of Spirit (1807); Marx, Economic and Philosophic Manuscripts of 1844 and Capital vol. I (1867).",
 "Darwin, On the Origin of Species (1859); Nietzsche, On the Genealogy of Morality (1887); Freud, Introductory Lectures (1916–17).",
 "Husserl, Ideas I (1913); Wittgenstein, Philosophical Investigations (1953).",
 "Foucault, Discipline and Punish (1975); Beauvoir, The Second Sex (1949); Said, Orientalism (1978); Heidegger, The Question Concerning Technology (1954)."
],[
 ["Plato, Republic IV 435b–444e on justice and city/soul; V 473c–d on philosophers and political power; VII 514a–521b on the cave and education."],
 ["Aristotle, Physics II.3 (four causes); Nicomachean Ethics I.7, 1097b22–1098a20 (eudaimonia and function); II.1–6 on virtue; Politics I.1–2 on polis and household."],
 ["Epictetus, Enchiridion §1 on what is and is not ‘up to us’; Epicurus, Letter to Menoeceus §§127–132 on desires, pleasure and prudent choice."],
 ["Augustine, City of God, especially XI–XIV on creation, will and the two cities; Aquinas, Summa Theologiae I–II q.90–97, especially q.94 on natural law."],
 ["Erasmus, De libero arbitrio (1524); Luther, De servo arbitrio (1525). ‘Modern individual’ is a later historiographical category and is not attributed directly to these authors."],
 ["Descartes, Meditations I–II; Locke, Essay II.i and II.xxiii; Hume, Enquiry §§IV–V and VII. ‘Rationalism’ and ‘empiricism’ are later classificatory labels useful with caution."],
 ["Hobbes, Leviathan chs. 13–18; Locke, Second Treatise §§4–15 and §§87–99; Rousseau, Social Contract I.6 and II.1–4. Their hypothetical contracts perform different argumentative functions."],
 ["Kant, Critique of Pure Reason, Prefaces and Transcendental Aesthetic/Analytic; Groundwork, Ak. 4:421–424 on the universal-law formulation. ‘Consequentialism’ is a later category used only for comparison."],
 ["Hegel, Phenomenology of Spirit, Preface and self-consciousness sections; Marx, Economic and Philosophic Manuscripts of 1844 for alienated labour; Capital I for commodity, value, accumulation and class relations. ‘Historical materialism’ is a later label and should not replace Marx’s own texts."],
 ["Darwin, Origin, chs. 3–4 and 14; Nietzsche, Genealogy, Preface and Treatises I–III; Freud, Introductory Lectures, lectures on slips, dreams and neuroses. The three authors do not form one shared theory of ‘human nature’."],
 ["Husserl, Ideas I §§27–33 on the natural attitude and phenomenological reduction; Wittgenstein, Philosophical Investigations §§23, 43, 66–71 on language-games, use and family resemblance."],
 ["Foucault, Discipline and Punish, Part III; Beauvoir, The Second Sex, Introduction; Said, Orientalism, Introduction; Heidegger, The Question Concerning Technology. These are distinct critical traditions and are not collapsed into one theory of power."]
],{
 4:{body:"Renaissance humanism and Reformation controversies changed practices of textual authority, philology, conscience and ecclesial obedience. Calling these developments the birth of a fully ‘modern individual’ is a later teleological interpretation, so the Lesson instead compares the historically specific Erasmus–Luther controversy over free will and authority."},
 5:{body:"Descartes, Locke and Hume are commonly grouped through the later categories ‘rationalism’ and ‘empiricism’, but their projects differ substantially. Hume’s analysis of causal inference treats necessary connection and inductive expectation through custom or habit; the labels are pedagogical classifications, not self-descriptions shared by all three thinkers."},
 7:{body:"Kant’s transcendental philosophy asks about conditions of possible experience, while his moral philosophy develops autonomy and the categorical imperative. Comparing the universal-law formulation with later consequentialist theories is a modern pedagogical contrast, not a claim that Kant was responding to a fully formed doctrine called consequentialism."},
 8:{body:"Hegel and Marx should not be compressed into a textbook ‘thesis–antithesis–synthesis’ formula. Hegel analyzes historical forms of consciousness, while Marx’s writings shift across alienation, material production, commodity relations and class. Alienated labour is anchored especially in the 1844 Manuscripts rather than attributed generically to Capital."},
 9:{body:"Darwin, Nietzsche and Freud each challenged influential inherited accounts of humans, but by different arguments: biological descent and selection, genealogy of moral values, and psychoanalytic accounts of unconscious processes. Treating them as a single theory of irrational or non-fixed human nature would be anachronistic."},
 11:{body:"Critical theory, feminism, postcolonial thought and philosophy of technology are internally diverse traditions. Foucault, Beauvoir, Said and Heidegger address different objects and methods; contemporary AI analysis may draw analogies from them only after separating historical claims from present-day application."}
});
window.NEXUS_QA_CORRECTIONS['CORE-123']={date:'2026-08-20',status:'INTELLECTUAL_HISTORY_ATTRIBUTION_REVISED',changes:['Plato·Aristotle 원전 위치를 Stephanus/Bekker 단위로 특정','Epictetus control distinction §1 명시','Aquinas 자연법 q.94 위치 특정','Renaissance/Reformation을 근대적 개인의 탄생으로 단선화한 서술 수정','rationalism/empiricism을 후대 분류임을 명시','사회계약 사상가별 논증기능 구분','Kant와 consequentialism의 시대차 명시','Marx 노동소외 원전을 1844 Manuscripts로 교정','Hegel의 단순 삼단계 변증법 소급 방지','서로 다른 20세기 비판전통을 하나로 합치지 않도록 수정']};

apply('CORE-124',[
 "The Epic of Gilgamesh; Homer, Iliad; Jan Assmann, Cultural Memory and Early Civilization, Cambridge University Press, 2011.",
 "Aristotle, Poetics; Sophocles, Oedipus Tyrannus.",
 "Jonathan Swift, A Modest Proposal (1729); Mikhail Bakhtin, Rabelais and His World, English trans. 1968.",
 "Laurence Perrine, Sound and Sense, various editions.",
 "Gustave Flaubert, Madame Bovary (1857); Ian Watt, The Rise of the Novel, 1957.",
 "Émile Zola, The Experimental Novel (1880).",
 "Virginia Woolf, Mrs Dalloway (1925); Woolf, Modern Fiction (1919/1925).",
 "Gérard Genette, Narrative Discourse, English trans., Cornell University Press, 1980.",
 "Mikhail Bakhtin, Problems of Dostoevsky’s Poetics, trans. Caryl Emerson, 1984.",
 "Chinua Achebe, Things Fall Apart (1958); Edward Said, Culture and Imperialism (1993); Homi Bhabha, The Location of Culture (1994); Gayatri Spivak, Can the Subaltern Speak? (1988).",
 "Martha C. Nussbaum, Love’s Knowledge, Oxford University Press, 1990; Suzanne Keen, Empathy and the Novel, Oxford University Press, 2007.",
 "N. Katherine Hayles, Electronic Literature, University of Notre Dame Press, 2008; Emily Bender & Alexander Koller, ACL 2020, 5185–5198."
],[
 ["Epic of Gilgamesh, Tablets X–XI on mortality and the flood narrative; Iliad Books 9, 18 and 24 on honour, mortality and reconciliation; ‘collective memory’ is a modern analytical concept, not an ancient emic term."],
 ["Aristotle, Poetics 1449b24–28 on catharsis; 1452a22–1452b on recognition; 1453a7–17 on the tragic protagonist and hamartia. Modern translations differ over hamartia and catharsis."],
 ["Swift, A Modest Proposal (1729); Bakhtin, Rabelais and His World. ‘Carnivalesque’ is Bakhtin’s later critical concept and is not presented as Swift’s own term."],
 ["Perrine, Sound and Sense, chapters on speaker, imagery, metaphor, rhythm and meter. The poetic speaker is analytically distinct from the empirical author unless the text supplies evidence to identify them."],
 ["Flaubert, Madame Bovary, 1857; Watt, The Rise of the Novel, 1957. The rise of the novel and modern individuality are historiographical problems rather than one uncontested linear development."],
 ["Zola, The Experimental Novel, 1880. Zola’s programmatic naturalism emphasized heredity, environment and quasi-experimental analogy, but not every work called naturalist follows the program identically."],
 ["Woolf, Mrs Dalloway, 1925; Woolf, Modern Fiction. ‘Stream of consciousness’ is a critical label covering heterogeneous techniques rather than one fixed formal device."],
 ["Genette, Narrative Discourse: sections ‘Order,’ ‘Duration,’ ‘Frequency,’ ‘Mood,’ and ‘Voice.’ Focalization is distinguished from grammatical first/third person and from narrator identity."],
 ["Bakhtin, Problems of Dostoevsky’s Poetics, ch. 1 on polyphony; The Dialogic Imagination for heteroglossia. Polyphony and heteroglossia are related but not identical concepts."],
 ["Achebe, Things Fall Apart; Said, Culture and Imperialism; Bhabha, The Location of Culture for hybridity; Spivak, Can the Subaltern Speak? for subalternity. These concepts are not retroactively attributed to Achebe himself."],
 ["Nussbaum, Love’s Knowledge, essays on literature and moral perception; Keen, Empathy and the Novel, 2007. Narrative empathy is a possible reader response, not a guarantee of moral truth or prosocial action."],
 ["Hayles, Electronic Literature, 2008, for electronic/digital literary forms; Bender & Koller, ‘Climbing towards NLU,’ ACL 2020, 5185–5198, for the form/meaning distinction in language systems. Hayles predates contemporary generative-AI authorship debates and is not cited as evidence about modern LLMs."]
],{
 0:{body:"Ancient epics can be studied as vehicles through which later communities remember origins, kingship, war and mortality, but ‘collective memory’ is a modern analytical framework. The Gilgamesh and Homeric traditions have complex oral, scribal and redaction histories and should not be treated as transparent chronicles of one historical event."},
 1:{body:"Aristotle’s Poetics links tragedy to action, reversal, recognition, suffering and catharsis, but key Greek terms such as hamartia and catharsis have contested translations. Reading Oedipus in terms of modern legal ‘responsibility’ is an interpretive application, not an ancient technical category."},
 2:{body:"Satire and comedy can expose norms through irony, inversion and exaggeration. Bakhtin’s ‘carnivalesque’ is a twentieth-century critical concept developed from Rabelais and popular culture; it should not be retroactively presented as Swift’s own eighteenth-century theory."},
 4:{body:"The relation between the modern novel, interiority and individualism is a historiographical thesis rather than an uncontested fact. Flaubert’s Madame Bovary can be analyzed for narrated consciousness, desire and social convention, while broader claims about the ‘rise of the individual’ require separate historical argument."},
 8:{body:"Bakhtin’s polyphony concerns relatively autonomous voices in Dostoevsky, while heteroglossia describes the interaction of socially differentiated speech types more broadly. The terms should not be treated as synonyms or as claims that the empirical author disappears."},
 9:{body:"Postcolonial criticism contains distinct concepts developed by different theorists. Hybridity is associated especially with Bhabha and subalternity with Gramscian/Spivak debates; these later terms may illuminate Achebe but must not be attributed to Achebe’s own vocabulary without evidence."},
 11:{body:"Electronic literature changed relations among text, code, medium, reader and procedurality before the current generative-AI wave. Contemporary LLM-based co-writing adds a separate problem of statistical generation, editing, agency and authorship. Earlier electronic-literature scholarship is historical background, not direct empirical evidence about modern generative models."}
});
window.NEXUS_QA_CORRECTIONS['CORE-124']={date:'2026-08-20',status:'LITERARY_SOURCE_CONCEPT_REVISED',changes:['collective memory를 고대 원전의 자기개념처럼 소급하지 않음','Poetics의 catharsis·anagnorisis·hamartia 위치와 번역논쟁 명시','Bakhtin carnivalesque를 Swift의 개념처럼 보이지 않도록 수정','근대소설=개인 탄생의 단선서사 제한','polyphony와 heteroglossia 구분','hybridity·subaltern의 이론가 귀속 교정','Hayles 2008을 현대 LLM 직접근거로 쓰지 않도록 수정']};

apply('CORE-125',[
 "Ferdinand de Saussure, Course in General Linguistics, ed. Charles Bally & Albert Sechehaye, 1916; trans. Wade Baskin, 1959.",
 "Gottlob Frege, Über Sinn und Bedeutung, Zeitschrift für Philosophie und philosophische Kritik 100 (1892), 25–50.",
 "Ludwig Wittgenstein, Tractatus Logico-Philosophicus (1921/1922); Philosophical Investigations (1953).",
 "J. L. Austin, How to Do Things with Words, Oxford University Press, 1962.",
 "H. P. Grice, Logic and Conversation, in Syntax and Semantics 3, Academic Press, 1975, 41–58.",
 "Stephen C. Levinson, Pragmatics, Cambridge University Press, 1983.",
 "Friedrich Schleiermacher, Hermeneutics and Criticism; Wilhelm Dilthey, The Rise of Hermeneutics (1900).",
 "Hans-Georg Gadamer, Truth and Method, 2nd rev. English ed., Continuum, 1989.",
 "Paul Ricoeur, Interpretation Theory: Discourse and the Surplus of Meaning, Texas Christian University Press, 1976.",
 "Roman Jakobson, On Linguistic Aspects of Translation, in Reuben Brower (ed.), On Translation, Harvard University Press, 1959, 232–239.",
 "H. L. A. Hart, The Concept of Law, 3rd ed.; Antonin Scalia & Bryan Garner, Reading Law, 2012; Aharon Barak, Purposive Interpretation in Law, 2005.",
 "Emily M. Bender & Alexander Koller, Climbing towards NLU, ACL 2020, 5185–5198; Stevan Harnad, The Symbol Grounding Problem, Physica D 42 (1990), 335–346."
],[
 ["Course in General Linguistics was published posthumously in 1916, compiled by Charles Bally and Albert Sechehaye from lecture notes and student materials. Its propositions should be attributed to the edited Course/lecture tradition rather than treated uncritically as Saussure’s own completed manuscript."],
 ["Frege, Über Sinn und Bedeutung, Zeitschrift für Philosophie und philosophische Kritik 100 (1892), 25–50; English trans. ‘On Sense and Reference’ in Geach & Black, pp. 56–78. Morning Star/Evening Star illustrates same reference with different sense."],
 ["Tractatus 2.1 and 4.01 on picture/proposition; Philosophical Investigations §§23 and 43 on language-games/use, §§66–71 on family resemblance. Early and late positions should not be merged into one continuous doctrine."],
 ["Austin, How to Do Things with Words, Lectures I–II on performatives/felicity and VIII–XII on locutionary, illocutionary and perlocutionary acts. Institutional legal effects require appropriate conventions, authority and circumstances."],
 ["Grice, ‘Logic and Conversation,’ 1975, 41–58. Scalar ‘some, therefore not all’ is normally a conversational implicature, defeasible/cancellable in context, not a truth-conditional entailment of ‘some’."],
 ["Levinson, Pragmatics, 1983, chapters on deixis and presupposition. In ‘he came again,’ pronoun resolution is context-dependent while ‘again’ conventionally triggers a prior-occurrence presupposition in ordinary uses."],
 ["Schleiermacher, Hermeneutics and Criticism, grammatical and technical/psychological interpretation; Dilthey, ‘The Rise of Hermeneutics’ (1900). Neither should be reduced to a simple rule of recovering one fixed subjective intention."],
 ["Gadamer, Truth and Method, Part II, sections on prejudice, effective-history and fusion of horizons. ‘Prejudice’ translates Vorurteil and is not limited to irrational bias."],
 ["Ricoeur, Interpretation Theory, especially chs. 2–4 on speech/writing, metaphor/symbol and explanation/understanding. Distanciation and textual autonomy do not imply unlimited interpretation."],
 ["Jakobson, ‘On Linguistic Aspects of Translation,’ 1959, 232–239, distinguishing intralingual, interlingual and intersemiotic translation and ‘equivalence in difference’. It does not promise complete one-to-one lexical equivalence."],
 ["Hart, The Concept of Law, ch. VII on open texture; Scalia & Garner, Reading Law, for textualist canons; Barak, Purposive Interpretation in Law, for purposive theory. Textualism and purposivism are not simply Hart versus Dworkin."],
 ["Bender & Koller, ACL 2020, 5185–5198, argue that a system trained only on linguistic form lacks access to meaning as they define it. The paper is a position argument about form/meaning, not a timeless empirical proof that every later multimodal or tool-using LLM lacks all possible forms of understanding; Harnad 1990 supplies the broader grounding problem."]
],{
 0:{body:"The Course in General Linguistics presents the sign as a relation of signifier/signified and emphasizes differences within langue, but the 1916 Course was assembled after Saussure’s death by Charles Bally and Albert Sechehaye from lecture materials. Claims should therefore be attributed to the edited Course tradition rather than to a finalized book manuscript written by Saussure himself."},
 2:{body:"Early Wittgenstein’s Tractatus develops a picture account of propositions, whereas Philosophical Investigations criticizes the search for a single essence of language and emphasizes language-games, use and family resemblance. The two phases are compared as historically distinct projects, not merged into one theory."},
 3:{body:"Utterances can perform actions only under appropriate conventional and institutional conditions. A statement such as ‘I hereby terminate the contract’ does not create legal effect merely because the words are spoken; authority, procedure, notice requirements and other felicity/legal conditions determine whether the illocution succeeds institutionally."},
 4:{body:"Gricean implicature allows a hearer to infer more than literal truth conditions. In ordinary contexts ‘some students passed’ may suggest ‘not all students passed’, but that inference is cancellable and is not logically entailed by the quantifier some. Context and conversational assumptions determine whether the implicature arises."},
 6:{body:"Schleiermacher combines grammatical interpretation with interpretation of an author’s individual discourse, while Dilthey embeds understanding in historical life and the human sciences. Reducing modern hermeneutics to recovery of one psychologically fixed authorial intention would oversimplify both traditions."},
 7:{body:"For Gadamer, understanding is historically situated: inherited prejudgments, tradition and effective history participate in interpretation, and ‘fusion of horizons’ describes a dialogical transformation of horizons. It is not a license to replace historical meanings with present preferences without argument."},
 9:{body:"Jakobson distinguishes intralingual, interlingual and intersemiotic translation and describes translation through ‘equivalence in difference’. Translation therefore involves structured recoding and interpretive choice, not an expectation that every word has one context-free one-to-one equivalent in another language."},
 10:{body:"Legal interpretation combines linguistic meaning with institutional sources, precedent, enacted purpose and constitutional structure. Hart’s open texture is not identical with American textualism, and Dworkin is not simply a synonym for purposivism. Textualist and purposive approaches are therefore studied through their own representative theories."},
 11:{body:"Bender and Koller argue specifically that systems trained only on linguistic form cannot acquire meaning as grounded communicative intent/world relation merely from form. That position is a major contribution to the debate, but it should not be converted into an empirical verdict on every later multimodal, embodied or tool-using model. Fluency, factual truth, grounding and understanding remain analytically distinct questions."}
});
window.NEXUS_QA_CORRECTIONS['CORE-125']={date:'2026-08-20',status:'LANGUAGE_HERMENEUTICS_ATTRIBUTION_REVISED',changes:['Saussure Course의 사후 편집 저작상태 명시','Frege 1892 원논문 서지 특정','Wittgenstein 초기/후기 원전 위치 분리','Austin 화행의 felicity·제도조건 추가','Grice some→not all을 취소가능한 함축으로 교정','Schleiermacher/Dilthey를 단순 저자의도론으로 축약하지 않음','Gadamer prejudice·fusion of horizons의 역사적 의미 명확화','Jakobson 번역론의 equivalence in difference 반영','Hart/Dworkin을 textualism/purposivism과 단순 대응시키지 않음','Bender & Koller 2020의 논증범위를 form-only systems로 한정']};
})();