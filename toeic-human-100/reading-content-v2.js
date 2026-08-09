const TOEIC_READING_V2 = {
  meta: {
    version: "2.0-pilot",
    totalDays: 100,
    targetWords: 1500,
    minWords: 1350,
    maxWords: 1650,
    completionBlocks: ["read", "analyze", "apply"],
    primaryGoal: "영어 원서까지 이어지는 장문 독해 체계 형성",
    secondaryGoal: "TOEIC 핵심 어휘·숙어·문법·구문·문제유형의 반복 습득"
  },
  masterCoverage: {
    lexicon: [],
    grammar: [],
    sentenceStructures: [],
    questionTypes: []
  },
  days: [
    {
      day: 1,
      title: "Learning to Stay With a Long Text",
      genre: "business-feature-report",
      blocks: ["read", "analyze", "apply"],
      reading: {
        title: "Why Westbridge Changed the Way Its Employees Learn",
        instructionKo: "처음에는 모르는 단어를 확인하지 말고 마지막 문단까지 읽으세요. 첫 회독의 목표는 완벽한 번역이 아니라 글의 방향을 놓치지 않는 것입니다.",
        paragraphs: [
          `For many companies, training used to be treated as a separate activity that happened only when a new employee joined the organization or when a new system was introduced. Workers attended a short orientation session, received a handbook, and were expected to learn the rest of their jobs by asking experienced colleagues for help. That approach was inexpensive and familiar, but it often produced uneven results. Some employees quickly developed the skills they needed, while others struggled because the information they received depended on who happened to be available. As companies expanded into new markets and began using more complex technology, managers discovered that informal learning was no longer sufficient. A mistake made by one department could delay a shipment, create an inaccurate invoice, or cause a customer complaint that another department had to resolve. For this reason, many organizations have started to view training not as a one-time event but as a continuous process that affects productivity, service quality, and long-term growth.`,
          `Westbridge Solutions, a medium-sized provider of office equipment and business software, recently changed its training system after an internal review revealed several recurring problems. The company had grown from one regional office to seven locations in less than five years, and its workforce had nearly doubled. Although sales had increased, customer-service records showed that employees at different offices were following different procedures. Some staff members were using outdated forms, others were unaware of revised warranty policies, and several new supervisors could not explain how expense reports were supposed to be approved. In addition, the human resources department found that many employees were uncertain about whom to contact when a problem involved more than one department. The review did not identify a lack of effort. Instead, it showed that information had been distributed in too many ways: e-mail messages, printed notices, informal conversations, online documents, and instructions given during meetings. Because there was no single system for confirming that everyone had received and understood important updates, managers sometimes assumed that employees knew procedures that had never been clearly explained.`,
          `To address the problem, Westbridge introduced a twelve-week learning program that combines scheduled workshops, short online lessons, guided reading, and practical assignments. Participation is mandatory for newly hired employees and supervisors, while other staff members may enroll with the approval of their department managers. The program does not attempt to teach every possible situation. Instead, it focuses on patterns that employees are likely to encounter repeatedly: responding to customer requests, processing orders, reviewing invoices, arranging deliveries, reporting technical problems, protecting confidential information, and communicating across departments. Each lesson begins with a realistic workplace situation rather than a list of rules. Participants are first asked to read a detailed account of a problem, identify the people involved, and determine what information is missing. Only after they have formed an initial understanding do they review the relevant policy, vocabulary, and procedure. The company believes that employees remember instructions more effectively when they can connect them to a situation that has a clear purpose and consequence.`,
          `One of the most important changes is the amount of reading required. In the previous training system, employees often received short bullet points that could be reviewed in a few minutes. Under the new program, participants read longer materials that resemble the documents they actually use at work. These materials include customer e-mails, service agreements, product descriptions, meeting summaries, internal reports, travel policies, safety notices, and explanations of new software features. Some employees initially complained that the reading assignments were too long, especially when they contained unfamiliar terms or sentences with several clauses. The training team decided not to shorten the materials. Instead, instructors taught participants how to locate the main subject and verb, separate essential information from additional detail, notice words that signal contrast or cause, and continue reading even when one unfamiliar word appears. According to the training manager, the goal is not to understand every word immediately. The goal is to remain oriented while moving through a long passage and to recognize the structure that holds the information together.`,
          `The company also changed the way vocabulary is taught. Previously, employees were given lists of technical terms and asked to memorize definitions. The new system introduces important words repeatedly in different contexts. For example, the word “issue” may first appear in a customer complaint about a defective printer, then in an accounting lesson about issuing an invoice, and later in a company newsletter that discusses the latest issue of an industry magazine. Similarly, employees encounter “available” when they read about rooms available for a conference, a manager who is available for a meeting, and replacement parts that are available for purchase. Trainers believe that this repeated exposure helps participants understand how meaning changes according to context. It also encourages them to pay attention to common combinations of words, such as “meet a deadline,” “submit a request,” “reach an agreement,” “place an order,” and “be responsible for.” These combinations are easier to recognize during reading than isolated vocabulary items because they function as familiar units.`,
          `Grammar is handled in much the same way. Instead of beginning with long explanations of terminology, instructors select sentences from the day’s reading and show how grammar controls meaning. A sentence such as “Employees who have not completed the security course are required to attend Friday’s session” is used to show that the words between “employees” and “are required” provide additional information about the employees but do not change the main structure of the sentence. Another sentence, “Although the delivery was scheduled to arrive on Monday, it was postponed because several items had not passed the final inspection,” allows participants to see how contrast and cause can appear in the same sentence. The instructors still teach terms such as relative clause, passive voice, participle, conjunction, and infinitive, but those labels are introduced as tools for describing patterns that participants have already seen. The purpose is practical: when a sentence becomes long, readers should be able to identify which words carry the central message and which words explain, limit, or connect that message.`,
          `Not everyone welcomed the new approach. Several department heads were concerned that employees would spend too much time studying instead of completing their regular duties. One sales manager argued that experienced staff members already knew how to communicate with customers and should not be required to read long training documents. The training team responded by comparing error rates before and after a six-week pilot program. Employees who completed the pilot made fewer mistakes when entering orders, requested fewer corrections from the accounting department, and resolved customer questions more quickly. More importantly, they were better able to explain why a particular procedure applied. In the past, an employee might say, “That is how we have always done it.” After the pilot, participants were more likely to refer to the relevant policy, identify an exception, and explain what additional approval was required. The improvement was not dramatic in every category, but it was consistent enough for senior management to authorize a company-wide rollout.`,
          `Employees who participated in the pilot reported another unexpected benefit: they became less anxious when they received long e-mails or reports from clients. One participant explained that he had previously looked for a few familiar words and then guessed what the sender wanted. If the message contained an unfamiliar expression, he often stopped reading carefully and asked a colleague to summarize it. During the training, he learned to continue through the paragraph, identify repeated nouns and pronouns, notice transitions such as “however,” “therefore,” and “in addition,” and ask what function each paragraph served. He still used a dictionary when necessary, but he no longer believed that every unknown word had to be translated before he could understand the message. Another participant said that reading the same passage more than once was especially useful. The first reading was often slow and confusing, but after reviewing key vocabulary and sentence structure, the second reading felt significantly easier.`,
          `Westbridge’s experience illustrates a broader principle about learning to read complex English. Improvement does not come only from memorizing more words or studying more grammar rules, although both are necessary. Readers also need repeated experience staying with a long text, recognizing familiar structures, tolerating temporary uncertainty, and building meaning across sentences and paragraphs. A person who stops at every unknown word has little opportunity to see how a paragraph develops. A person who recognizes words but cannot identify the main verb may misunderstand the relationship between ideas. A person who understands individual sentences but forgets the previous paragraph may lose the author’s overall argument. For that reason, effective reading practice must combine vocabulary, grammar, sentence structure, and sustained attention rather than treating them as unrelated skills.`,
          `The company will review the program again at the end of the year, using employee feedback, customer-service records, training completion rates, and error reports to determine whether further changes are necessary. Managers do not expect every employee to become an expert reader in a few weeks, but they have already noticed that many participants approach difficult documents differently. Instead of immediately deciding that a long text is too hard, they begin by identifying its purpose, then move through the paragraphs while looking for patterns they have seen before. When they encounter a complicated sentence, they search for its main structure before translating every detail. When a word is unfamiliar, they consider whether the surrounding sentence provides enough information to continue. These habits may appear simple, but they represent a significant change. The ultimate objective of the program is not merely to help employees pass an internal assessment. It is to make careful reading a normal part of their work, so that complex information becomes something they can analyze rather than something they automatically avoid.`
        ],
        summaryKo: "Westbridge Solutions는 지식 전달을 짧은 공지와 단어 암기에 의존하던 기존 교육에서 벗어나, 긴 실제 업무문서를 반복해서 읽고 어휘·문법·문장구조를 문맥 안에서 익히는 방식으로 전환했다. 핵심은 모르는 단어 하나에서 멈추지 않고 긴 글의 구조와 문단 사이의 관계를 유지하면서 끝까지 읽는 습관을 만드는 것이다.",
        paragraphFunctionsKo: [
          "기존 교육방식의 한계와 문제 제기",
          "Westbridge의 구체적 문제 상황",
          "새 교육 프로그램의 기본 구조",
          "긴 글 읽기를 핵심훈련으로 채택한 이유",
          "어휘를 문맥·반복노출로 익히는 방식",
          "문법을 긴 문장 해석도구로 사용하는 방식",
          "새 방식에 대한 반론과 시범운영 결과",
          "장문에 대한 불안 감소와 실제 읽기 습관의 변화",
          "장문독해에 필요한 일반 원리",
          "프로그램의 최종 목표와 결론"
        ]
      },
      vocabulary: [
        {id:"orientation",lemma:"orientation",meaningKo:"오리엔테이션, 적응 교육",tier:"B"},
        {id:"available",lemma:"available",meaningKo:"이용 가능한, 시간이 되는",tier:"A"},
        {id:"sufficient",lemma:"sufficient",meaningKo:"충분한",tier:"B"},
        {id:"shipment",lemma:"shipment",meaningKo:"배송, 선적품",tier:"A"},
        {id:"invoice",lemma:"invoice",meaningKo:"송장, 청구서",tier:"A"},
        {id:"productivity",lemma:"productivity",meaningKo:"생산성",tier:"B"},
        {id:"recurring",lemma:"recurring",meaningKo:"반복적으로 발생하는",tier:"B"},
        {id:"workforce",lemma:"workforce",meaningKo:"인력, 노동력",tier:"B"},
        {id:"procedure",lemma:"procedure",meaningKo:"절차",tier:"A"},
        {id:"warranty",lemma:"warranty",meaningKo:"보증, 품질보증",tier:"A"},
        {id:"supervisor",lemma:"supervisor",meaningKo:"관리자, 감독자",tier:"A"},
        {id:"distribute",lemma:"distribute",meaningKo:"배포하다, 분배하다",tier:"A"},
        {id:"mandatory",lemma:"mandatory",meaningKo:"의무적인",tier:"A"},
        {id:"enroll",lemma:"enroll",meaningKo:"등록하다",tier:"B"},
        {id:"approval",lemma:"approval",meaningKo:"승인",tier:"A"},
        {id:"encounter",lemma:"encounter",meaningKo:"마주치다",tier:"B"},
        {id:"confidential",lemma:"confidential",meaningKo:"기밀의",tier:"A"},
        {id:"relevant",lemma:"relevant",meaningKo:"관련 있는",tier:"A"},
        {id:"require",lemma:"require",meaningKo:"요구하다",tier:"A"},
        {id:"agreement",lemma:"agreement",meaningKo:"합의, 계약",tier:"A"},
        {id:"initially",lemma:"initially",meaningKo:"처음에는",tier:"B"},
        {id:"unfamiliar",lemma:"unfamiliar",meaningKo:"익숙하지 않은",tier:"B"},
        {id:"locate",lemma:"locate",meaningKo:"찾아내다, 위치시키다",tier:"B"},
        {id:"essential",lemma:"essential",meaningKo:"필수적인, 핵심적인",tier:"A"},
        {id:"issue",lemma:"issue",meaningKo:"문제 / 발행하다 / 발행물",tier:"A"},
        {id:"exposure",lemma:"exposure",meaningKo:"노출",tier:"B"},
        {id:"terminology",lemma:"terminology",meaningKo:"전문용어 체계",tier:"C"},
        {id:"particular",lemma:"particular",meaningKo:"특정한",tier:"A"},
        {id:"exception",lemma:"exception",meaningKo:"예외",tier:"B"},
        {id:"authorize",lemma:"authorize",meaningKo:"승인하다, 권한을 부여하다",tier:"A"},
        {id:"anxious",lemma:"anxious",meaningKo:"불안한",tier:"B"},
        {id:"summarize",lemma:"summarize",meaningKo:"요약하다",tier:"B"},
        {id:"pronoun",lemma:"pronoun",meaningKo:"대명사",tier:"C"},
        {id:"transition",lemma:"transition",meaningKo:"전환, 연결표현",tier:"B"},
        {id:"illustrate",lemma:"illustrate",meaningKo:"보여주다, 예증하다",tier:"B"},
        {id:"uncertainty",lemma:"uncertainty",meaningKo:"불확실성",tier:"B"},
        {id:"sustained",lemma:"sustained",meaningKo:"지속적인",tier:"B"},
        {id:"determine",lemma:"determine",meaningKo:"결정하다, 판단하다",tier:"A"},
        {id:"objective",lemma:"objective",meaningKo:"목표, 목적",tier:"B"},
        {id:"assessment",lemma:"assessment",meaningKo:"평가",tier:"B"}
      ],
      expressions: [
        {id:"be-expected-to",title:"be expected to",meaningKo:"~할 것으로 기대되다",tier:"A"},
        {id:"be-supposed-to",title:"be supposed to",meaningKo:"~하기로 되어 있다",tier:"A"},
        {id:"in-addition",title:"in addition",meaningKo:"게다가",tier:"A"},
        {id:"to-address-the-problem",title:"address a problem",meaningKo:"문제를 다루다·해결하려 하다",tier:"A"},
        {id:"be-likely-to",title:"be likely to",meaningKo:"~할 가능성이 높다",tier:"A"},
        {id:"according-to",title:"according to",meaningKo:"~에 따르면",tier:"A"},
        {id:"pay-attention-to",title:"pay attention to",meaningKo:"~에 주의를 기울이다",tier:"A"},
        {id:"meet-a-deadline",title:"meet a deadline",meaningKo:"마감기한을 맞추다",tier:"A"},
        {id:"submit-a-request",title:"submit a request",meaningKo:"요청서를 제출하다",tier:"A"},
        {id:"reach-an-agreement",title:"reach an agreement",meaningKo:"합의에 이르다",tier:"A"},
        {id:"place-an-order",title:"place an order",meaningKo:"주문하다",tier:"A"},
        {id:"be-responsible-for",title:"be responsible for",meaningKo:"~을 담당하다",tier:"A"},
        {id:"instead-of",title:"instead of",meaningKo:"~하는 대신에",tier:"A"},
        {id:"refer-to",title:"refer to",meaningKo:"~을 언급하다·참조하다",tier:"A"},
        {id:"rather-than",title:"rather than",meaningKo:"~라기보다, ~대신",tier:"A"},
        {id:"when-necessary",title:"when necessary",meaningKo:"필요할 때",tier:"B"},
        {id:"more-than-once",title:"more than once",meaningKo:"한 번 이상",tier:"B"},
        {id:"at-the-end-of",title:"at the end of",meaningKo:"~의 끝에",tier:"A"}
      ],
      grammar: [
        {id:"relative-clause",title:"관계절",pointKo:"명사 뒤 who/which/that 이하를 설명 덩어리로 보고 본동사를 따로 찾는다."},
        {id:"passive-voice",title:"수동태",pointKo:"be + p.p.에서 행위의 대상이 주어가 된다. 긴 문장에서 본동사 후보를 찾는 데 중요하다."},
        {id:"present-perfect",title:"현재완료",pointKo:"have/has + p.p.를 하나의 동사덩어리로 인식한다."},
        {id:"past-perfect",title:"과거완료",pointKo:"had + p.p.는 다른 과거시점보다 앞선 사건을 표시한다."},
        {id:"concession-clause",title:"양보·대조절",pointKo:"although/while 등이 나오면 주절과 반대·대조 관계를 예상한다."},
        {id:"cause-clause",title:"원인절",pointKo:"because/since/as가 이유를 제시하는지 확인한다."},
        {id:"infinitive",title:"to부정사",pointKo:"목적·예정·보충설명 등 문맥상 기능을 덩어리로 읽는다."},
        {id:"embedded-question",title:"간접의문문",pointKo:"whom to contact, what information is missing처럼 의문사 이하를 명사덩어리로 처리한다."}
      ],
      sentenceStructures: [
        {id:"noun-relative-mainverb",title:"명사 + 관계절 + 본동사",example:"Employees who completed the pilot made fewer mistakes."},
        {id:"although-main-because",title:"Although A, B because C",example:"Although sales had increased, records showed problems because procedures differed."},
        {id:"passive-infinitive",title:"수동태 + to부정사",example:"Employees are expected to review the material."},
        {id:"long-subject-mainverb",title:"긴 주어 뒤 본동사 찾기",example:"The information employees received depended on who happened to be available."},
        {id:"parallel-gerunds",title:"동명사 병렬",example:"responding, processing, reviewing, arranging, reporting, protecting, and communicating"},
        {id:"not-but",title:"not A but B",example:"not as a one-time event but as a continuous process"},
        {id:"only-after-inversion",title:"Only after + 절 + 도치",example:"Only after they have formed an understanding do they review the policy."},
        {id:"whether-enough-to",title:"whether + 절 / enough to",example:"whether the surrounding sentence provides enough information to continue"}
      ],
      sentenceLab: [
        {
          sentence:"Because there was no single system for confirming that everyone had received and understood important updates, managers sometimes assumed that employees knew procedures that had never been clearly explained.",
          chunks:["Because there was no single system", "for confirming [that everyone had received and understood important updates]", "managers sometimes assumed", "[that employees knew procedures]", "[that had never been clearly explained]"],
          explanationKo:"앞부분 전체는 이유를 나타내는 because절이다. 주절의 중심은 managers assumed이며, assumed 뒤 that절 안에 다시 procedures를 꾸미는 관계절 that had never been clearly explained가 들어간다."
        },
        {
          sentence:"Participants are first asked to read a detailed account of a problem, identify the people involved, and determine what information is missing.",
          chunks:["Participants", "are first asked", "to read ...", "identify ...", "and determine [what information is missing]"],
          explanationKo:"주어 Participants와 본동사 are asked를 먼저 잡는다. 뒤의 세 동작 read, identify, determine이 병렬로 이어지고, determine 뒤 what절은 목적어 역할을 한다."
        },
        {
          sentence:"Some employees initially complained that the reading assignments were too long, especially when they contained unfamiliar terms or sentences with several clauses.",
          chunks:["Some employees initially complained", "[that the reading assignments were too long]", "especially [when they contained ...]"],
          explanationKo:"complained가 본동사이고 that절이 불평의 내용이다. when절은 그 불평이 특히 심해지는 상황을 덧붙인다."
        },
        {
          sentence:"A sentence such as Employees who have not completed the security course are required to attend Friday’s session is used to show that the words between employees and are required provide additional information about the employees but do not change the main structure of the sentence.",
          chunks:["A sentence such as ...", "is used", "to show", "[that the words ... provide additional information]", "but [do not change the main structure]"],
          explanationKo:"가장 바깥 문장의 주어는 A sentence, 본동사는 is used이다. 예시문 내부의 관계절과 수동태를 바깥 문장 구조와 혼동하지 않는 것이 핵심이다."
        },
        {
          sentence:"Employees who participated in the pilot reported another unexpected benefit: they became less anxious when they received long e-mails or reports from clients.",
          chunks:["Employees [who participated in the pilot]", "reported another unexpected benefit", "they became less anxious", "when they received ..."],
          explanationKo:"who절은 Employees를 꾸미고 본동사는 reported이다. 콜론 뒤에는 benefit의 구체적 내용이 독립절로 설명된다."
        },
        {
          sentence:"Instead of immediately deciding that a long text is too hard, they begin by identifying its purpose, then move through the paragraphs while looking for patterns they have seen before.",
          chunks:["Instead of immediately deciding [that ...]", "they begin", "by identifying its purpose", "then move through the paragraphs", "while looking for patterns [they have seen before]"],
          explanationKo:"주절은 they begin ... then move ...의 병렬이다. 문두의 Instead of는 대체되는 행동을, while은 동시에 이루어지는 행동을 나타낸다."
        }
      ],
      practice: {
        part5: [
          {question:"Participation in the new program is _____ for newly hired supervisors.",options:["mandate","mandatory","mandatorily","mandating"],answer:1,explanation:"be동사 뒤 보어 자리에는 형용사 mandatory가 적절하다.",focus:"품사"},
          {question:"Employees are expected _____ the briefing before the meeting begins.",options:["review","reviewing","to review","reviewed"],answer:2,explanation:"be expected to + 동사원형 구조이므로 to review가 정답이다.",focus:"to부정사"},
          {question:"The company introduced longer reading tasks _____ employees could practice maintaining context.",options:["so that","despite","unless","whereas"],answer:0,explanation:"목적을 나타내는 so that이 문맥에 맞는다.",focus:"접속사"},
          {question:"Several procedures _____ before the company-wide rollout was authorized.",options:["revised","were revised","have revising","revision"],answer:1,explanation:"절의 주어 procedures가 개정되는 대상이므로 수동태 were revised가 필요하다.",focus:"수동태"}
        ],
        part6: [
          {type:"connector",question:"The materials were difficult at first. _____, the training team chose not to shorten them.",options:["However","For example","Therefore","Similarly"],answer:0,explanation:"앞문장의 어려움과 뒤문장의 결정이 대조되므로 However가 적절하다."},
          {type:"context-word",question:"Repeated _____ to the same word in different contexts can make its meaning easier to recognize.",options:["exposure","approval","shipment","procedure"],answer:0,explanation:"본문의 핵심 개념인 repeated exposure가 자연스러운 결합이다."}
        ],
        part7: [
          {type:"purpose",question:"What is the main purpose of the passage?",options:["To advertise a commercial language course","To explain why a company redesigned employee training around sustained reading","To compare the prices of several training programs","To announce that Westbridge will close regional offices"],answer:1,explanation:"글 전체는 Westbridge가 왜 교육방식을 장문 읽기와 문맥학습 중심으로 바꾸었는지 설명한다.",evidence:"Paragraphs 1-4 introduce the problem and the new reading-centered program."},
          {type:"detail",question:"What problem was identified during Westbridge’s internal review?",options:["Employees were refusing to attend meetings","Different offices were following inconsistent procedures","The company had stopped selling office equipment","Customers preferred printed invoices"],answer:1,explanation:"2문단에서 서로 다른 사무소 직원들이 서로 다른 절차를 따르고 있었다고 명시한다.",evidence:"employees at different offices were following different procedures"},
          {type:"inference",question:"What can be inferred about the previous training system?",options:["It relied heavily on a single standardized platform","It provided information through many disconnected channels","It required employees to read long reports every day","It was designed mainly for customers"],answer:1,explanation:"이메일·인쇄공지·대화·온라인 문서·회의 등 여러 방식으로 정보가 분산되어 있었다는 설명에서 추론할 수 있다.",evidence:"information had been distributed in too many ways"},
          {type:"vocabulary-in-context",question:"The word “issue” in the vocabulary paragraph is used to demonstrate what?",options:["A word may have different meanings depending on context","Invoices should never be sent electronically","Technical vocabulary should be avoided","Industry magazines are more useful than training manuals"],answer:0,explanation:"issue가 문제, 발행하다, 잡지의 호 등 다른 의미로 쓰이는 예를 통해 문맥에 따른 의미 변화를 보여준다.",evidence:"issue may first appear ... issuing an invoice ... latest issue of an industry magazine"},
          {type:"author-method",question:"Why does the passage include the sentence about employees who have not completed the security course?",options:["To explain a security incident","To illustrate how a relative clause fits inside a longer sentence","To announce a new Friday schedule","To criticize the security course"],answer:1,explanation:"관계절이 길어져도 주어 Employees와 본동사 are required를 찾는 방법을 설명하기 위한 예시이다.",evidence:"is used to show that the words between employees and are required provide additional information"},
          {type:"paragraph-function",question:"What is the primary function of the paragraph beginning “Not everyone welcomed the new approach”?",options:["To introduce opposition and then present evidence from a pilot program","To list new vocabulary terms","To describe a customer complaint","To explain how invoices are processed"],answer:0,explanation:"반론을 제시한 뒤 시범운영의 오류율 감소와 설명능력 향상을 근거로 대응한다.",evidence:"Several department heads were concerned ... The training team responded by comparing error rates"},
          {type:"reference",question:"In the final paragraph, what does “These habits” refer to?",options:["Closing regional offices","Reading only familiar words","Identifying purpose and structure and continuing despite unfamiliar words","Memorizing every policy before reading"],answer:2,explanation:"직전 문장들에서 목적 파악, 구조 탐색, 모르는 단어를 문맥으로 넘기는 행동들을 나열한 뒤 These habits로 받는다.",evidence:"they begin by identifying its purpose ... search for its main structure ... consider whether the surrounding sentence provides enough information"},
          {type:"overall-logic",question:"Which sequence best describes the organization of the passage?",options:["Advertisement → price list → order form","Problem → redesigned method → examples → resistance and evidence → broader principle → conclusion","Biography → travel schedule → interview","Complaint → refund policy → legal notice"],answer:1,explanation:"문제 제기에서 시작해 새 방법, 구체 예, 반론과 결과, 일반원리, 결론으로 발전한다.",evidence:"The paragraph functions follow that sequence across the full passage."}
        ]
      },
      review: {
        rereadInstructionKo:"어휘·문법·문장구조를 확인한 뒤 원문을 다시 처음부터 끝까지 읽으세요. 두 번째 회독에서는 한국어 번역을 만들기보다 영어 문장 덩어리와 문단의 기능이 더 빨리 보이는지 확인합니다.",
        selfCheck:[
          "첫 회독보다 두 번째 회독이 빨라졌는가",
          "모르는 단어가 나와도 문단의 방향을 유지했는가",
          "긴 문장에서 주어와 본동사를 먼저 찾을 수 있었는가",
          "각 문단이 앞 문단을 어떻게 이어가는지 설명할 수 있는가",
          "글 전체를 한국어 1~2문장으로 요약할 수 있는가"
        ],
        errorReasons:["어휘","숙어·결합","문법","주어·본동사","긴 수식구조","질문 이해","근거 탐색","paraphrase","문단 기억","시간 부족","추측/찍기"]
      }
    }
  ]
};
