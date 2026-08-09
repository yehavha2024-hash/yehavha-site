/* TEPS Reading Extension V2 — self-authored, no official item reproduction */
const TEPS_READING_EXTENSION_V2 = {
  meta: {
    version: "1.0",
    purpose: "TOEIC 실무독해를 넘어 TEPS 및 영어 원서 독해에 필요한 추상어휘·논리·추론을 확장",
    note: "TEPS 공식 문항을 복제하지 않고 현행 독해 유형의 학습목적만 반영한 자체 제작 자료"
  },
  days: [
    {
      day:1,
      title:"TEPS 독해 확장 · 익숙함과 실제 이해의 차이",
      passage:`Repeated exposure to a text often creates a feeling of familiarity, but familiarity should not be confused with comprehension. A reader may recognize nearly every word in a paragraph and still fail to identify the author's claim, the relationship between examples, or the assumption on which the conclusion depends. This happens partly because recognition is cognitively cheaper than integration. Recognizing a word requires the reader to connect a visible form with stored information. Understanding an argument, by contrast, requires several pieces of information to remain active while the reader determines how they fit together. The difference becomes especially noticeable in long passages. When attention is repeatedly interrupted by dictionary use, translation, or anxiety about unfamiliar expressions, the reader may understand individual sentences yet lose the larger structure. For this reason, productive rereading should not merely repeat the same act. The first reading can establish direction; the second can examine vocabulary and syntax; a later reading can test whether the argument can be followed with less conscious effort. In this sense, repetition is valuable not because the text becomes visually familiar but because the reader gradually transfers attention from decoding language to organizing meaning.`,
      vocabulary:[
        ["familiarity","익숙함"],["comprehension","이해"],["assumption","가정"],["cognitively","인지적으로"],["integration","통합"],["retain","유지하다"],["syntax","통사구조"],["decoding","해독·기호를 의미로 바꾸는 과정"]
      ],
      logicKo:"핵심 대조는 familiarity ≠ comprehension입니다. 반복의 목적은 같은 글자를 다시 보는 것이 아니라, 주의력을 단어 해독에서 의미구조 통합으로 이동시키는 데 있습니다.",
      questions:[
        {type:"빈칸",question:"The author suggests that effective rereading should _____ .",options:["repeat exactly the same mental task","change its purpose across successive readings","avoid vocabulary analysis","focus exclusively on speed"],answer:1,explanation:"첫 회독·두 번째 회독·후속 회독의 목적을 다르게 제시합니다."},
        {type:"문맥상 어색한 내용",question:"Which statement is NOT consistent with the passage?",options:["Word recognition can occur without full comprehension.","Long passages require integration across sentences.","Dictionary interruption can sometimes damage global understanding.","Visual familiarity guarantees accurate understanding."],answer:3,explanation:"글은 오히려 familiarity와 comprehension을 구별합니다."},
        {type:"주제",question:"What is the main idea?",options:["Why dictionaries should never be used","Why repetition must develop from recognition toward structural comprehension","Why short texts are superior to long ones","Why vocabulary is unrelated to reading"],answer:1,explanation:"반복을 통해 해독에서 구조적 이해로 이동한다는 것이 핵심입니다."}
      ]
    },
    {
      day:2,
      title:"TEPS 독해 확장 · 불확실한 정보의 업데이트",
      passage:`People frequently imagine decision-making as a process in which facts are first collected and a conclusion is then chosen. Real decisions are often less orderly. Information arrives at different times, some sources are more reliable than others, and earlier beliefs must be revised without being discarded too quickly. A useful reader therefore treats a developing text much as a careful decision-maker treats new evidence. An early statement may establish a provisional model; a later sentence may qualify it; still later evidence may confirm one part while overturning another. The difficulty is not simply remembering details. It is knowing which details should change the reader's current interpretation. Words such as apparently, initially, nevertheless, confirmed, and no longer perform an important function because they signal updates in epistemic status—the degree to which a claim is supported. Readers who ignore these signals often preserve the first interpretation they formed even after the text has provided reasons to modify it. Skilled reading, by contrast, requires intellectual flexibility: maintaining enough continuity to follow the text while remaining willing to reconstruct one's understanding as stronger evidence appears.`,
      vocabulary:[["provisional","잠정적인"],["qualify","한정·수정하다"],["overturn","뒤집다"],["interpretation","해석"],["epistemic","인식론적·지식상태의"],["continuity","연속성"],["reconstruct","재구성하다"],["apparently","겉보기에는"]],
      logicKo:"초기 해석을 유지하되 더 강한 증거가 나오면 수정해야 한다는 논리입니다. 시간순 정보추적을 ‘인식상태 업데이트’로 확장합니다.",
      questions:[
        {type:"빈칸",question:"Skilled readers must preserve continuity while remaining willing to _____ their interpretation.",options:["freeze","reconstruct","ignore","translate literally"],answer:1,explanation:"강한 새 증거에 따라 기존 해석을 재구성해야 합니다."},
        {type:"추론",question:"What problem arises when readers ignore words such as 'initially' and 'confirmed'?",options:["They may fail to update an early interpretation.","They may read too quickly.","They will learn too much vocabulary.","They will confuse nouns with verbs."],answer:0,explanation:"정보의 확실성 변화 신호를 놓치면 초기 해석을 고수하게 됩니다."},
        {type:"주제",question:"The passage mainly discusses",options:["how developing evidence should reshape understanding","why decisions should never change","how to memorize timelines","why all sources are equally reliable"],answer:0,explanation:"새 증거에 따른 해석 업데이트가 중심입니다."}
      ]
    },
    {
      day:3,
      title:"TEPS 독해 확장 · 설득적 표현과 측정가능한 주장",
      passage:`Persuasive language is not necessarily false language. The problem is that persuasive expressions often compress several conditions into a memorable phrase. A product described as efficient, advanced, or environmentally friendly may genuinely possess useful characteristics, yet each adjective invites a question about the standard of comparison. Efficient in relation to what resource? Advanced compared with which earlier design? Environmentally friendly across which stage of production or use? The more general the adjective, the more work the reader must do to identify the evidence that could make the statement meaningful. This principle extends far beyond advertising. Political speeches, corporate reports, academic abstracts, and even historical narratives use evaluative terms that summarize complex judgments. Critical reading does not require automatic suspicion. It requires operationalization: translating a broad claim into conditions that could, at least in principle, be observed or compared. Once a claim has been operationalized, readers can distinguish disagreement about values from disagreement about facts. They can also recognize when two writers seem to disagree only because they are using different standards to evaluate the same phenomenon.`,
      vocabulary:[["compress","압축하다"],["characteristic","특성"],["criterion","기준"],["evaluative","평가적인"],["operationalization","조작화·측정 가능한 형태로 바꾸기"],["observable","관찰 가능한"],["phenomenon","현상"],["suspicion","의심"]],
      logicKo:"광고의 형용사 판단을 ‘무엇과 비교하는가, 무엇으로 측정하는가’라는 비판적 독해 원리로 확장합니다.",
      questions:[
        {type:"빈칸",question:"The author argues that broad evaluative claims become more useful when they are _____ .",options:["operationalized","memorized","made more emotional","removed from context"],answer:0,explanation:"측정·관찰 가능한 조건으로 바꿔야 의미가 분명해집니다."},
        {type:"문맥상 어색한 내용",question:"Which idea is inconsistent with the passage?",options:["Persuasive language can contain true information.","General adjectives require standards of comparison.","Critical reading means automatically rejecting promotional language.","Some apparent disagreements result from different standards."],answer:2,explanation:"비판적 독해는 자동 불신이 아니라 조건과 근거의 명확화라고 설명합니다."},
        {type:"추론",question:"Two reports may appear to conflict even when they describe the same facts because",options:["they use different evaluative standards","facts never matter","both are advertisements","adjectives have no meaning"],answer:0,explanation:"평가기준이 다르면 같은 현상을 다른 결론으로 표현할 수 있습니다."}
      ]
    },
    {
      day:4,
      title:"TEPS 독해 확장 · 원인과 책임의 분리",
      passage:`Explanations often become misleading when they identify a cause and then silently treat that cause as a complete assignment of responsibility. Suppose a system fails after several events occur in sequence: an external shock creates pressure, a procedural error prevents recovery, and a management decision magnifies the final loss. It may be correct to say that each event contributed causally, but responsibility is a separate judgment. Responsibility may depend on foreseeability, control, contractual duty, available alternatives, or the reasonableness of precautions. This distinction is important because causal language is flexible. We often say that one dramatic event “caused” an outcome even when many background conditions were necessary. Such shorthand is useful in ordinary conversation but dangerous in analytical reading. Readers should ask whether an author is identifying a trigger, a necessary condition, a contributing factor, or a normatively relevant failure. When these categories are separated, complex reports become easier to evaluate. One can accept an author's account of what produced an outcome while still questioning the argument about who ought to bear its consequences.`,
      vocabulary:[["magnify","확대하다"],["foreseeability","예견가능성"],["precaution","예방조치"],["shorthand","축약적 표현"],["trigger","촉발요인"],["contributing","기여하는"],["normatively","규범적으로"],["consequence","결과"]],
      logicKo:"DAY 4의 배송 인과를 규범적 책임 판단과 분리하는 논리로 확장합니다. causation과 responsibility를 동일시하지 않습니다.",
      questions:[
        {type:"빈칸",question:"The passage emphasizes that causal contribution does not automatically determine _____ .",options:["responsibility","chronology","vocabulary","physical movement"],answer:0,explanation:"원인 기여와 책임 귀속은 별도 판단입니다."},
        {type:"추론",question:"Why can ordinary causal shorthand be dangerous in analysis?",options:["It may hide multiple contributing conditions and responsibility criteria.","It always uses passive voice.","It makes texts too short.","It removes all events from a timeline."],answer:0,explanation:"하나의 극적인 원인만 강조하면 복수원인과 책임요소가 가려집니다."},
        {type:"주제",question:"What is the main distinction?",options:["Cause versus normative responsibility","Past versus present tense","Domestic versus international trade","Facts versus vocabulary"],answer:0,explanation:"인과와 책임의 분리가 중심입니다."}
      ]
    },
    {
      day:5,
      title:"TEPS 독해 확장 · 예외가 규칙을 설명하는 방식",
      passage:`Exceptions are sometimes treated as annoying complications added after a rule has already been understood. In sophisticated writing, however, exceptions often reveal what the rule actually means. Consider a policy that applies to “all reservations” except those canceled because of documented transportation disruptions. The exception tells us that the rule is not merely about the act of canceling; it also reflects a judgment about circumstances beyond the traveler's control. Similarly, a scientific generalization may hold under normal atmospheric conditions but fail at extreme temperatures. The failure does not necessarily destroy the generalization. It may define its domain. Good readers therefore ask whether an exception contradicts a rule, narrows its scope, or exposes an unstated assumption. This distinction is especially important in legal, scientific, and philosophical texts, where apparently small qualifications can determine whether a proposition is defensible. A reader who remembers only the general rule may sound confident while being wrong precisely in the cases where careful interpretation matters most.`,
      vocabulary:[["sophisticated","정교한"],["generalization","일반화"],["domain","적용영역"],["unstated","명시되지 않은"],["defensible","방어·정당화 가능한"],["qualification","한정조건"],["circumstance","상황"],["contradict","모순되다"]],
      logicKo:"호텔정책의 예외를 원서의 일반명제·적용범위 읽기로 확장합니다. 예외는 규칙을 깨는 것이 아니라 규칙의 범위를 정의할 수도 있습니다.",
      questions:[
        {type:"빈칸",question:"An exception may help define the _____ within which a rule is valid.",options:["domain","translation","headline","pronunciation"],answer:0,explanation:"글은 예외가 적용영역을 규정할 수 있다고 설명합니다."},
        {type:"추론",question:"A scientific rule failing only at extreme temperatures may",options:["still be useful within a limited domain","be meaningless in every context","prove that exceptions never matter","eliminate the need for conditions"],answer:0,explanation:"예외가 규칙의 범위를 한정할 수 있습니다."},
        {type:"주제",question:"The passage argues that exceptions",options:["often reveal the scope and assumptions of rules","should always be ignored","are found only in travel policies","make reasoning impossible"],answer:0,explanation:"예외를 통해 규칙의 범위·가정을 이해한다는 내용입니다."}
      ]
    },
    {
      day:6,
      title:"TEPS 독해 확장 · 제안과 결론 사이의 거리",
      passage:`In group discussion, ideas often acquire an undeserved sense of authority merely because they are repeated. A suggestion mentioned by several participants may later be remembered as something the group agreed to, even when no decision was made. Written argument contains a similar risk. An author may introduce a possible explanation, examine it at length, and ultimately reject it. Readers who remember only the amount of attention devoted to the idea can mistakenly attribute the rejected position to the author. Reporting verbs provide important guidance. To speculate, propose, concede, challenge, establish, and conclude represent different stages and strengths of commitment. The surrounding structure matters as well. Phrases such as “one possibility is,” “this account fails to explain,” and “the evidence therefore supports” signal movement through an argument. Reading accurately requires tracking not only propositions but their status. The question is not simply “What idea appeared?” but “What role did the idea play in the author's reasoning?”`,
      vocabulary:[["undeserved","부당하게 부여된"],["authority","권위"],["attribute","귀속하다"],["speculate","추측하다"],["concede","인정·양보하다"],["proposition","명제"],["commitment","입장 확정의 강도"],["reasoning","추론"]],
      logicKo:"회의록에서 제안과 결정을 구별했던 방법을 논증문에서 가설·반론·결론의 상태 추적으로 확장합니다.",
      questions:[
        {type:"빈칸",question:"Readers should track not only an idea but also its _____ within the argument.",options:["status","font","length","spelling"],answer:0,explanation:"명제가 가설인지 결론인지 역할을 추적해야 합니다."},
        {type:"문맥상 어색한 내용",question:"Which statement conflicts with the passage?",options:["A frequently repeated suggestion may still be unapproved.","An author can discuss an explanation before rejecting it.","The amount of attention given to an idea proves the author accepts it.","Reporting verbs signal levels of commitment."],answer:2,explanation:"많이 논의됐다는 사실만으로 채택된 입장이라고 볼 수 없습니다."},
        {type:"주제",question:"What skill is emphasized?",options:["Tracking the argumentative status of propositions","Counting repeated words","Avoiding all speculation","Memorizing reporting verbs without context"],answer:0,explanation:"논증에서 명제의 역할과 확정 수준을 추적하는 능력입니다."}
      ]
    },
    {
      day:7,
      title:"TEPS 독해 확장 · 필요조건과 충분조건",
      passage:`Everyday language often uses the word “requirement” without distinguishing different logical relationships. Yet careful reading benefits from separating necessary conditions from sufficient ones. A necessary condition must be present for an outcome to occur, but its presence may not guarantee the outcome. Meeting the minimum experience requirement for a job, for example, may make a candidate eligible without ensuring selection. A sufficient condition, by contrast, is enough to establish the relevant result within the rule being discussed. Confusion between these relationships is common in arguments. Evidence that a factor is associated with success may be treated as if it guarantees success; a condition that is merely helpful may be described as indispensable. Readers should therefore pay attention to words such as required, enough, only, unless, whenever, and at least. These terms frequently reveal the logical architecture of a claim. Understanding that architecture is especially important in philosophy, science, law, and policy, where a seemingly minor change in condition can alter the validity of an entire conclusion.`,
      vocabulary:[["necessary","필요한"],["sufficient","충분한"],["eligible","적격의"],["guarantee","보장하다"],["associated","연관된"],["indispensable","필수불가결한"],["architecture","논리구조"],["validity","타당성"]],
      logicKo:"required/preferred를 논리학의 필요조건·충분조건으로 확장합니다. 최소요건 충족은 필요할 수 있지만 선발을 보장하는 충분조건은 아닙니다.",
      questions:[
        {type:"빈칸",question:"Meeting a minimum job requirement may be necessary for selection but not _____ .",options:["sufficient","relevant","documented","preferred"],answer:0,explanation:"최소요건만으로 최종선발이 보장되지는 않습니다."},
        {type:"추론",question:"Which mistake does the author warn against?",options:["Treating a helpful factor as indispensable","Distinguishing eligibility from selection","Reading words such as unless carefully","Separating necessary and sufficient conditions"],answer:0,explanation:"도움이 되는 요인을 필수조건이나 보장조건으로 과장하는 오류입니다."},
        {type:"주제",question:"The passage is primarily about",options:["logical relationships among conditions","how to write a résumé","why job interviews are unnecessary","the history of formal logic"],answer:0,explanation:"조건의 논리적 강도를 구별하는 것이 중심입니다."}
      ]
    },
    {
      day:8,
      title:"TEPS 독해 확장 · 사실판단과 규범판단",
      passage:`Disputes become difficult when factual and normative questions are blended together. Whether a machine contains a manufacturing defect is primarily an empirical question: evidence can be gathered through inspection, testing, and comparison. Whether a seller should provide a particular remedy is a normative or rule-based question that may depend on contract terms, consumer law, institutional policy, or fairness. The two inquiries interact, but neither can simply replace the other. A confirmed defect may trigger a rule without determining every consequence, while a generous remedy does not prove that the original factual claim was correct. Similar distinctions appear in public debate. Evidence may show that a policy has certain effects, yet citizens can still disagree about whether those effects justify the policy. Conversely, strong moral preferences cannot establish what the empirical effects actually are. Readers of serious nonfiction should therefore identify when a text moves from “is” to “ought.” The transition may be justified, but it requires an additional premise rather than occurring automatically.`,
      vocabulary:[["normative","규범적인"],["empirical","경험적·실증적인"],["inquiry","탐구·질문"],["institutional","제도적인"],["justify","정당화하다"],["premise","전제"],["consequence","결과"],["interact","상호작용하다"]],
      logicKo:"제품 결함의 사실판단과 보상·구제의 규범판단을 구별합니다. is에서 ought로 넘어갈 때 추가 전제가 필요하다는 원서형 논리독해입니다.",
      questions:[
        {type:"빈칸",question:"Moving from an empirical finding to a normative conclusion requires an additional _____ .",options:["premise","photograph","invoice","pronunciation"],answer:0,explanation:"사실만으로 당위를 자동 도출할 수 없으며 규범적 전제가 필요합니다."},
        {type:"추론",question:"A generous remedy by a seller does NOT necessarily prove that",options:["the customer's factual account was correct in every respect","the seller values customer relations","a remedy was offered","rules and facts can interact"],answer:0,explanation:"재량적 구제와 사실인정은 별개일 수 있습니다."},
        {type:"주제",question:"The passage emphasizes the distinction between",options:["empirical and normative questions","customers and retailers","old and new machines","public and private companies"],answer:0,explanation:"사실과 규범의 구별이 중심입니다."}
      ]
    },
    {
      day:9,
      title:"TEPS 독해 확장 · 인용문의 역할과 관점",
      passage:`Quotations can make a text appear more objective because they allow readers to hear multiple voices directly. Yet quotation itself does not eliminate selection. A journalist decides whom to quote, which sentence to include, and what context to place around it. An academic author similarly chooses which opposing argument deserves extended attention and which can be summarized briefly. The result is that perspective operates at two levels: within the quoted statement and within the writer's arrangement of statements. Critical readers therefore examine both content and framing. A cautious analyst may be quoted accurately, but if the surrounding article presents the quotation as a complete rejection of a policy rather than a limited qualification, the overall impression may still be misleading. This does not mean readers should distrust quotation. It means they should ask what question the speaker was answering, what claim the quotation actually supports, and how the writer uses it in the larger structure. Such questions become increasingly important as texts grow longer and contain more competing voices.`,
      vocabulary:[["objective","객관적인"],["selection","선택"],["perspective","관점"],["framing","프레이밍·맥락 설정"],["qualification","한정·조건"],["misleading","오도하는"],["competing","경쟁하는"],["arrangement","배열·구성"]],
      logicKo:"기업뉴스의 직접·간접 인용을 넘어, 인용의 내용과 저자의 배치·프레이밍을 함께 읽는 비판적 독해로 확장합니다.",
      questions:[
        {type:"빈칸",question:"Quotation does not remove the writer's role in _____ information.",options:["selecting and framing","pronouncing","translating all words","eliminating perspective"],answer:0,explanation:"누구를 무엇을 어떤 맥락에서 인용할지 선택합니다."},
        {type:"문맥상 어색한 내용",question:"Which statement is inconsistent with the passage?",options:["A quotation can be accurate but framed misleadingly.","Readers should consider what question a speaker was answering.","Direct quotation automatically makes the entire article objective.","Perspective can exist in both a quote and its placement."],answer:2,explanation:"직접인용이 전체 글의 객관성을 자동 보장하지 않습니다."},
        {type:"주제",question:"The main point is that readers should",options:["analyze both quotations and the way they are framed","avoid all quoted material","trust only indirect speech","ignore competing voices"],answer:0,explanation:"인용내용과 글 속 배치를 함께 평가해야 합니다."}
      ]
    },
    {
      day:10,
      title:"TEPS 독해 확장 · 독해는 지식이 아니라 조작의 체계다",
      passage:`Advanced reading ability is sometimes described as possessing a very large vocabulary, but vocabulary size alone does not explain why some readers can follow difficult texts more effectively than others. Skilled readers perform a set of operations with relative speed and stability. They identify sentence cores, postpone nonessential uncertainty, resolve references, detect contrast, distinguish evidence from claims, update interpretations, and compress paragraphs into functional summaries. None of these operations eliminates the need for vocabulary or grammar. Instead, vocabulary and grammar provide the material on which the operations work. This distinction has practical consequences for study. If every unknown word becomes a separate emergency, the reader has little capacity left for integration. If grammar is memorized only as terminology, it may not help when a thirty-word subject separates a noun from its main verb. Training must therefore make reading operations repeatable under varied content. The ultimate objective is not that every text become easy. It is that difficulty become analyzable: the reader can identify whether the obstacle is lexical, syntactic, referential, logical, or conceptual and respond accordingly.`,
      vocabulary:[["operation","조작·처리과정"],["stability","안정성"],["nonessential","비핵심적인"],["reference","지칭"],["compress","압축하다"],["capacity","처리능력"],["referential","지칭관계의"],["conceptual","개념적인"]],
      logicKo:"10일간의 학습을 ‘단어량’이 아니라 반복 가능한 독해 조작의 체계로 정리합니다. 어려움을 어휘·통사·지칭·논리·개념 문제로 진단하는 것이 목표입니다.",
      questions:[
        {type:"빈칸",question:"The author argues that advanced reading depends on vocabulary plus repeatable reading _____ .",options:["operations","decorations","translations","headlines"],answer:0,explanation:"독해를 수행하는 일련의 처리과정이 핵심입니다."},
        {type:"추론",question:"Why can grammar terminology alone be insufficient?",options:["It may not transfer automatically to processing complex sentence structure.","Grammar has no role in reading.","Terminology is always incorrect.","Long subjects do not occur in English."],answer:0,explanation:"용어암기가 실제 긴 문장 처리로 자동 연결되지 않을 수 있습니다."},
        {type:"주제",question:"What is the ultimate objective described?",options:["Make every text easy","Diagnose the source of difficulty and apply the right reading operation","Eliminate unknown vocabulary","Translate every sentence into Korean"],answer:1,explanation:"어려움의 종류를 진단하고 적절한 독해처리를 적용하는 상태가 목표입니다."}
      ]
    }
  ]
};
