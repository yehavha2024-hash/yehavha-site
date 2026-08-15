(() => {
  'use strict';

  const data = window.TOEIC_HUMAN_V2;
  if (!data || !Array.isArray(data.branches)) return;

  const rows = (list) => list.map((row) => {
    const [term, meaningKo, example] = row.split('|');
    return { term, meaningKo, example };
  });
  const countWords = (text) => String(text || '').trim().split(/\s+/).filter(Boolean).length;
  const sentences = (text) => String(text || '').match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
  const rotate = (arr, start, count) => Array.from({length: Math.min(count, arr.length)}, (_, i) => arr[(start + i) % arr.length]);

  const CASES = [
    {
      name:'Regional Software Renewal', org:'Northstar Services', domain:'procurement',
      issue:'whether to renew a company-wide scheduling platform after a six-week pilot revealed uneven adoption across departments',
      initial:'purchase 420 annual licenses before the current contract expires',
      revised:'buy 280 licenses now and keep 140 seats as optional quarterly additions', deadline:'September 18',
      metric:'the pilot reduced average scheduling time by 17 percent but produced only a 4 percent improvement in the smallest teams',
      condition:'the vendor must provide single sign-on support and a written data-export procedure',
      exception:'temporary contractors may continue using the existing portal until their projects close',
      stakeholder:'the finance director', evidence:'usage logs showed that three departments accounted for nearly two thirds of all active sessions',
      result:'the staged purchase is expected to cut first-year licensing costs by about 23 percent without delaying the migration',
      keyword:'material', keyMeaning:'important enough to affect a decision',
      vocab: rows(['procurement|조달|The procurement team compared three licensing models.','renewal|갱신|The renewal decision depends on verified usage.','adoption|도입·이용 확산|User adoption varied sharply across departments.','license|사용권|Each active license carries an annual fee.','capacity|수용량·사용가능 규모|The company bought only the capacity it needed.','vendor|공급업체|The vendor agreed to provide export tools.','migration|이전·전환|The migration will begin after security approval.','usage|사용량|Usage data changed the purchasing recommendation.'])
    },
    {
      name:'Airport Shuttle Schedule', org:'Metroline Mobility', domain:'transport operations',
      issue:'how to revise an airport shuttle timetable after road construction made the evening route increasingly unreliable',
      initial:'keep the existing 20-minute interval and add one reserve vehicle during the evening peak',
      revised:'operate a 15-minute interval between 5:00 and 8:00 p.m. while moving the reserve vehicle to the airport terminal', deadline:'October 2',
      metric:'late arrivals rose from 8 percent to 21 percent during the first three weeks of construction',
      condition:'the revised timetable will continue only if average terminal congestion remains above the agreed threshold',
      exception:'the final shuttle after midnight will keep the original route because connecting rail service is unavailable',
      stakeholder:'the operations manager', evidence:'GPS records showed that most delays occurred on the downtown segment rather than near the airport',
      result:'simulation results indicate that the revised allocation can reduce missed airport connections without increasing the fleet size',
      keyword:'interval', keyMeaning:'the period of time between repeated services',
      vocab: rows(['interval|간격|The service interval was shortened during peak hours.','congestion|혼잡|Traffic congestion caused repeated delays.','allocation|배치·할당|Vehicle allocation changed after the route review.','threshold|기준치|The plan remains active above the congestion threshold.','terminal|터미널|A reserve vehicle waits at the airport terminal.','timetable|시간표|The revised timetable begins next month.','reliable|신뢰할 수 있는|Passengers need a reliable evening connection.','simulation|모의실험|The simulation compared three operating patterns.'])
    },
    {
      name:'Conference Cancellation Policy', org:'Harborview Hotel', domain:'hospitality policy',
      issue:'whether a hotel should revise its conference cancellation policy after several large groups changed attendance at short notice',
      initial:'retain a single cancellation fee for all group reservations made more than thirty days in advance',
      revised:'use a two-stage fee that distinguishes room reductions from full event cancellation', deadline:'November 12',
      metric:'three recent conferences reduced room blocks by more than 25 percent within ten days of arrival',
      condition:'organizers may reduce up to 10 percent of reserved rooms without a fee if notice is given at least fourteen days ahead',
      exception:'weather-related transportation closures documented by the carrier remain exempt from the cancellation charge',
      stakeholder:'the revenue manager', evidence:'food and staffing costs were recoverable, but unsold rooms represented most of the lost revenue',
      result:'the revised policy is projected to protect room revenue while giving organizers limited flexibility for normal attendance changes',
      keyword:'waive', keyMeaning:'to choose not to require a fee or rule that would normally apply',
      vocab: rows(['waive|면제하다|The hotel may waive a fee in documented emergencies.','reservation|예약|The reservation covers rooms and meeting space.','attendance|참석 인원|Attendance fell shortly before the event.','cancellation|취소|Full cancellation triggers a higher charge.','exempt|면제되는|Documented transport closures are exempt.','revenue|수익|Unsold rooms created the largest revenue loss.','notice|사전 통지|Fourteen days of notice is required.','flexibility|유연성|The policy allows limited flexibility.'])
    },
    {
      name:'Graduate Hiring Assessment', org:'Meridian Analytics', domain:'human resources',
      issue:'how to evaluate graduate applicants after managers found that interview scores varied too widely between departments',
      initial:'allow each department to conduct its own interview and make an independent hiring recommendation',
      revised:'use one structured interview, a short work sample, and a common scoring guide before department-specific interviews', deadline:'August 29',
      metric:'agreement between interviewers was only 52 percent in the previous recruitment cycle',
      condition:'all interviewers must complete a calibration session and record evidence for each scored competency',
      exception:'applicants for specialist research roles may submit a published technical paper instead of the standard work sample',
      stakeholder:'the head of talent acquisition', evidence:'work-sample scores predicted probation performance more consistently than unstructured interview ratings',
      result:'the combined process is expected to improve consistency while preserving a later stage for role-specific judgment',
      keyword:'calibrate', keyMeaning:'to adjust a process so that different evaluators apply the same standard',
      vocab: rows(['calibrate|기준을 맞추다|Interviewers calibrate their scoring before selection.','competency|역량|Each competency requires recorded evidence.','applicant|지원자|Every applicant completes the same first-stage interview.','assessment|평가|The assessment combines an interview and work sample.','consistency|일관성|A common rubric improves scoring consistency.','probation|수습기간|Work samples predicted probation performance.','criterion|기준|Each criterion has a defined scoring scale.','specialist|전문직 지원자|Specialist applicants may use an alternative sample.'])
    },
    {
      name:'Warehouse Energy Retrofit', org:'GreenGrid Distribution', domain:'energy management',
      issue:'whether to replace warehouse lighting and cooling equipment at once or divide the retrofit into two investment stages',
      initial:'replace all lighting and cooling units during a single three-week closure',
      revised:'replace lighting immediately and postpone the cooling upgrade until winter maintenance', deadline:'December 6',
      metric:'new lighting cut electricity use by 31 percent in the test zone, while the cooling pilot delivered an estimated 9 percent saving',
      condition:'the second stage will proceed only if updated energy prices keep the projected payback period below five years',
      exception:'the temperature-controlled medical storage area must receive the cooling upgrade regardless of the payback calculation',
      stakeholder:'the facilities director', evidence:'maintenance records showed that lighting failures caused more operational disruption than cooling repairs',
      result:'the staged retrofit lowers immediate capital spending and preserves mandatory upgrades for temperature-sensitive storage',
      keyword:'yield', keyMeaning:'to produce a particular result or return',
      vocab: rows(['retrofit|설비 개조|The retrofit replaces inefficient equipment.','yield|산출하다|The lighting upgrade yielded larger savings.','payback|투자회수|The project has a five-year payback target.','capital|자본·설비 투자비|Staging reduces immediate capital spending.','efficiency|효율|Energy efficiency improved in the test zone.','mandatory|의무적인|Medical storage requires a mandatory upgrade.','maintenance|유지보수|Winter maintenance provides a second installation window.','projection|예측치|The projection depends on future energy prices.'])
    },
    {
      name:'Customer Data Incident', org:'Apex Retail', domain:'data governance',
      issue:'how to respond after a customer-support tool exposed a limited set of contact records to an unauthorized user',
      initial:'notify every customer in the national database immediately and suspend all support accounts',
      revised:'disable the affected integration, notify verified affected customers, and complete a forty-eight-hour access review before broader action', deadline:'within 48 hours',
      metric:'the investigation identified 1,240 exposed records out of more than 600,000 customer profiles',
      condition:'broader notification will occur if the forensic review finds evidence that payment or authentication data was accessible',
      exception:'support agents using the unaffected internal portal may continue handling urgent service requests',
      stakeholder:'the privacy officer', evidence:'audit logs showed that the unauthorized account accessed contact fields but did not reach the payment database',
      result:'the targeted response limits unnecessary disruption while preserving escalation if the forensic evidence changes',
      keyword:'scope', keyMeaning:'the extent or range covered by an incident, rule, or investigation',
      vocab: rows(['scope|범위|The review defined the scope of the exposure.','forensic|포렌식의|A forensic review examined the access logs.','exposure|노출|The exposure involved contact information.','credential|인증정보|No payment credentials were accessed.','integration|연동기능|The affected integration was disabled.','escalate|상향 조치하다|The company will escalate the response if new evidence appears.','audit log|감사 로그|Audit logs recorded each access event.','disruption|업무 중단|A targeted response limits unnecessary disruption.'])
    },
    {
      name:'Supplier Quality Review', org:'Atlas Components', domain:'manufacturing supply',
      issue:'whether to keep a key supplier after a batch of precision parts failed a dimensional inspection',
      initial:'suspend all orders and move the full volume to a higher-cost backup supplier',
      revised:'quarantine the affected batch, require corrective action, and shift only 35 percent of new orders to the backup supplier for six weeks', deadline:'September 9',
      metric:'the defect rate reached 3.8 percent in one batch but remained below 0.6 percent in the previous eleven shipments',
      condition:'full volume will return only after two consecutive shipments pass enhanced inspection',
      exception:'parts used in the safety-critical assembly will come exclusively from the backup supplier during the review',
      stakeholder:'the quality director', evidence:'measurement records traced most defects to one recently replaced cutting tool',
      result:'the temporary split reduces supply risk while giving the original supplier a defined route to restore normal volume',
      keyword:'deviation', keyMeaning:'a measurable departure from a required standard or expected value',
      vocab: rows(['deviation|편차|Inspectors recorded a dimensional deviation.','quarantine|격리하다|The failed batch was quarantined.','defect|결함|The defect rate increased in one shipment.','corrective action|시정조치|The supplier submitted a corrective action plan.','inspection|검사|Two shipments must pass enhanced inspection.','shipment|출하분|Previous shipments met the standard.','backup supplier|대체 공급업체|A backup supplier receives part of the volume.','trace|원인을 추적하다|Records traced the defects to one tool.'])
    },
    {
      name:'Community Health Outreach', org:'Civic Health Network', domain:'public program evaluation',
      issue:'whether to expand a weekend screening program after the first quarter produced high attendance but uneven follow-up care',
      initial:'open the same weekend clinic model in four additional districts',
      revised:'expand to two districts first and add a follow-up coordinator before opening more sites', deadline:'January 15',
      metric:'screening attendance exceeded the target by 28 percent, but only 61 percent of high-risk participants completed a follow-up appointment',
      condition:'further expansion requires the follow-up completion rate to exceed 75 percent for two consecutive months',
      exception:'districts without weekday primary-care access may receive a mobile follow-up clinic even before the threshold is reached',
      stakeholder:'the program director', evidence:'participant interviews identified appointment scheduling and transportation as the main barriers after screening',
      result:'the phased model treats attendance and continuity of care as separate measures of program success',
      keyword:'uptake', keyMeaning:'the extent to which people begin using or participating in a service',
      vocab: rows(['uptake|이용률·참여율|Program uptake was higher than expected.','screening|검진|Weekend screening attracted many participants.','follow-up|후속 진료|Follow-up completion remained below target.','outreach|지역사회 접촉활동|Outreach increased attendance.','barrier|장애요인|Transportation was a major barrier.','continuity|연속성|The program aims to improve continuity of care.','threshold|기준치|Expansion depends on a 75 percent threshold.','participant|참여자|Participants described scheduling difficulties.'])
    },
    {
      name:'Research Grant Allocation', org:'Lumen Research Foundation', domain:'research funding',
      issue:'how to distribute a limited grant budget between early-stage exploratory studies and projects with strong preliminary evidence',
      initial:'award most funding to projects with the highest external-review scores',
      revised:'reserve 30 percent of the budget for high-risk exploratory studies and use the remaining 70 percent for evidence-backed projects', deadline:'March 4',
      metric:'review scores predicted publication output reasonably well but were less useful in identifying projects that later opened new research areas',
      condition:'exploratory awards must include a six-month milestone that tests the central assumption before additional funds are released',
      exception:'projects involving essential safety monitoring may receive continuation funding outside the competitive allocation',
      stakeholder:'the scientific advisory board', evidence:'a five-year portfolio review found that several low-ranked exploratory projects produced the foundation’s most cited follow-up programs',
      result:'the mixed portfolio balances measurable near-term performance with a controlled allowance for uncertain but potentially transformative research',
      keyword:'robust', keyMeaning:'strong enough to remain reliable under scrutiny or changing conditions',
      vocab: rows(['robust|견고한|The board wanted robust evidence before expansion.','allocation|배분|The new allocation reserves funds for exploration.','preliminary|예비의|Some projects had strong preliminary evidence.','milestone|중간 목표|A six-month milestone tests the main assumption.','portfolio|포트폴리오|The portfolio includes low- and high-risk studies.','transformative|획기적인|Exploratory work may produce transformative results.','assumption|가정|The first milestone tests a central assumption.','continuation|지속 지원|Safety monitoring may receive continuation funding.'])
    },
    {
      name:'Cross-Border Delivery Delay', org:'Orion Logistics', domain:'international logistics',
      issue:'how to reduce repeated customs delays for temperature-sensitive shipments entering three different markets',
      initial:'add two days of buffer time to every international delivery schedule',
      revised:'pre-clear documents for two markets and keep a one-day buffer only for the route with inconsistent inspection times', deadline:'April 21',
      metric:'document-related delays averaged 19 hours, while physical inspections added more than 30 hours on only one route',
      condition:'pre-clearance will be used only when customers submit complete product codes and certificates forty-eight hours before departure',
      exception:'emergency medical shipments may use the fastest available route even when pre-clearance documentation is incomplete',
      stakeholder:'the regional logistics manager', evidence:'shipment records showed that missing classification codes caused most avoidable holds in the two faster markets',
      result:'route-specific rules reduce unnecessary buffer time while preserving extra protection where inspection uncertainty remains high',
      keyword:'clearance', keyMeaning:'official permission for goods to pass through customs',
      vocab: rows(['clearance|통관 승인|Customs clearance was delayed by missing codes.','classification|분류|Product classification codes must be complete.','buffer|여유시간|Only one route keeps a full-day buffer.','certificate|증명서|Customers submit certificates before departure.','inspection|검사|Physical inspection varies by market.','shipment|배송물|Temperature-sensitive shipments require careful timing.','pre-clear|사전 통관하다|Two routes use pre-clearance.','hold|보류·억류|Missing documents caused avoidable customs holds.'])
    }
  ];

  const PACKS = {
    lexical: {
      lens:'how precise lexical choices change the scope, tone, and practical meaning of a message',
      moves:['distinguish multiple meanings by grammar and object choice','track how word families change grammatical roles','compare near-synonyms by strength and typical subject','recognize verb–noun combinations as single processing units','judge adjective–noun combinations for naturalness and precision','treat preposition choice as part of lexical meaning','separate conversational, business, and formal register','process phrasal verbs and fixed expressions as semantic units','notice limiting adverbs that narrow the force of a claim','classify vocabulary errors by sense, form, register, or collocation'],
      vocab: rows(['address|다루다·주소를 쓰다|The report addresses the scheduling problem.','issue|쟁점·발행하다|The committee discussed a material issue.','account|설명하다·계정|The model accounts for seasonal demand.','subject|~의 적용을 받는·주제|Approval is subject to two conditions.','substantial|상당한|The change produced a substantial saving.','tentative|잠정적인|The team published a tentative schedule.','eligible|자격이 있는|Only eligible applicants receive reimbursement.','retain|유지하다|The company retained one narrow exception.','allocate|배분하다|Managers allocated capacity by actual usage.','implement|시행하다|The revised policy will be implemented next month.','derive|도출하다|The conclusion is derived from verified evidence.','constrain|제한하다|Contract terms constrain the available options.','explicit|명시적인|The memo states an explicit condition.','implicit|암묵적인|The argument depends on an implicit assumption.','marginal|미미한·한계의|The smallest teams saw only a marginal gain.','viable|실행 가능한|The staged plan remained financially viable.','consecutive|연속적인|Two consecutive reviews are required.','material|중대한|A material difference can change the decision.'])
    },
    syntax: {
      lens:'how clause hierarchy, compression, and scope determine who did what, under which condition, and with what limitation',
      moves:['separate main verbs from embedded clauses','identify exactly which noun a relative clause modifies','restore reduced relative clauses to full clauses','recover hidden actors and actions from nominalizations','infer responsibility when passive voice omits the actor','remove parenthetical material to expose the sentence frame','read inversion without losing tense or emphasis','restore omitted elements in parallel structures','define the scope of negation and modal verbs','decompress a dense sentence and rebuild it without changing meaning'],
      vocab: rows(['whereas|~인 반면|Whereas one unit improved, another remained unchanged.','notwithstanding|~에도 불구하고|The plan proceeded notwithstanding the added cost.','provided that|~라는 조건으로|The exception applies provided that notice is given.','thereby|그렇게 함으로써|The team reduced waste, thereby lowering cost.','respectively|각각|The two rates were 12 and 18 percent, respectively.','pursuant to|~에 따라|The review was conducted pursuant to policy.','therein|그 안에|The agreement and the conditions stated therein remain valid.','whereby|그에 의해|A process was introduced whereby users verify access.','inasmuch as|~인 점에서|The proposal is limited inasmuch as it covers one region.','albeit|비록 ~이지만|The pilot succeeded, albeit unevenly.','contingent|~에 달린|Funding is contingent on meeting the milestone.','preceding|앞선|The preceding paragraph defines the exception.','subsequent|후속의|Subsequent reviews confirmed the pattern.','embedded|내포된|An embedded clause interrupts the main sentence.','nominalization|명사화|Nominalization can hide the actor of an action.','modifier|수식어|The modifier applies only to the nearest noun phrase.','scope|적용범위|The scope of not changes the sentence meaning.','parallel|병렬의|Parallel structure makes the comparison easier to read.'])
    },
    cohesion: {
      lens:'how reference, lexical chains, and connectors bind separate sentences into one argument',
      moves:['trace pronouns to semantic rather than merely nearest antecedents','read summary demonstratives such as this change as compressed references','build lexical chains across repeated concepts','use contrast markers to predict a change in argumentative direction','recover causal links expressed without explicit connectors','weigh the main claim against concessions and limitations','assign a function to each paragraph','place a new sentence by matching reference and logic','separate topic sentences from supporting evidence','compress the full passage into a paragraph-function map'],
      vocab: rows(['antecedent|선행사|The pronoun refers to an earlier antecedent.','cohesion|응집성|Lexical repetition creates cohesion across paragraphs.','referent|지시대상|The reader must identify the correct referent.','transition|전환표현|A transition signals a change in direction.','concession|양보|The final paragraph includes an important concession.','qualification|제한조건|The recommendation contains a qualification.','sequence|순서|The sequence of events explains the decision.','corresponding|상응하는|Each claim has a corresponding piece of evidence.','former|전자|The former option is cheaper but less flexible.','latter|후자|The latter plan reduces initial cost.','subsequently|그 후에|The policy was subsequently revised.','consequently|그 결과|Demand fell; consequently, capacity was reduced.','nevertheless|그럼에도 불구하고|The evidence was limited; nevertheless, action was required.','therefore|그러므로|The condition failed; therefore, expansion stopped.','reference|지칭|Reference connects a sentence to earlier information.','lexical chain|어휘사슬|A lexical chain keeps one topic active.','topic sentence|주제문|The topic sentence states the paragraph’s central claim.','paragraph function|문단 기능|Paragraph function matters more than sentence-by-sentence translation.'])
    },
    paraphrase: {
      lens:'how the same proposition is reformulated through synonymy, grammatical change, abstraction, and altered information order',
      moves:['match a statement with a synonym-based reformulation','recognize active–passive equivalence','compare verbal and nominal forms of the same proposition','separate broader and narrower paraphrases','identify when a paraphrase adds an unsupported claim','match questions to evidence despite different vocabulary','distinguish literal repetition from conceptual equivalence','track numerical paraphrases and proportional expressions','rewrite conditions without changing logical force','reject distractors that preserve vocabulary but reverse meaning'],
      vocab: rows(['equivalent|동등한|The two sentences are equivalent in meaning.','restate|다시 표현하다|The report restates the condition more formally.','convey|전달하다|Both versions convey the same conclusion.','broaden|넓히다|The distractor improperly broadens the claim.','narrow|좁히다|The revised wording narrows the exception.','preserve|보존하다|A valid paraphrase preserves logical force.','reverse|뒤집다|One option reverses the causal relationship.','omit|생략하다|The short summary omits a secondary detail.','substitute|대체하다|A nominal phrase can substitute for a clause.','recast|다른 형태로 바꾸다|The active sentence was recast in passive form.','proportion|비율|The proportion rose even though the total fell.','correspond|대응하다|The option corresponds to the evidence.','distort|왜곡하다|An added condition distorts the original meaning.','inferential|추론의|An inferential paraphrase goes beyond literal wording.','literal|문자 그대로의|Literal matching can produce a wrong answer.','semantic|의미상의|Semantic equivalence matters more than word repetition.','reformulate|재구성해 표현하다|The learner reformulated the policy condition.','constraint|제약조건|A paraphrase must retain the original constraint.'])
    },
    inference: {
      lens:'how readers move from stated evidence to a conclusion without crossing the boundary into speculation',
      moves:['distinguish explicit facts from reasonable inferences','identify assumptions needed for a recommendation','separate necessary from merely possible conclusions','evaluate what new evidence would strengthen a claim','evaluate what evidence would weaken a claim','read causal claims against alternative explanations','identify the practical implication of a stated condition','infer likely next actions from procedural language','recognize when the text does not support a confident conclusion','write an inference together with the exact evidence chain that licenses it'],
      vocab: rows(['infer|추론하다|The reader can infer a likely next step.','assumption|가정|The recommendation relies on one assumption.','premise|전제|Two premises support the conclusion.','warrant|논거 연결근거|The warrant explains why the evidence supports the claim.','plausible|그럴듯한|The inference is plausible but not certain.','speculative|추측적인|The final option is too speculative.','corroborate|뒷받침하다|A second data source corroborates the finding.','undermine|약화시키다|New evidence may undermine the conclusion.','implication|함의|The condition has a practical implication.','causal|인과의|A causal claim requires more than correlation.','alternative|대안적 설명|The report considers an alternative explanation.','sufficient|충분한|The evidence is sufficient for a limited conclusion.','necessary|필요한|Approval is necessary but not sufficient.','probable|개연성 높은|The next action is probable given the procedure.','uncertain|불확실한|The long-term effect remains uncertain.','support|지지하다|The data support a narrower conclusion.','contradict|모순되다|The second memo does not contradict the first.','qualify|제한하다|Later evidence qualifies the initial claim.'])
    },
    multidoc: {
      lens:'how facts distributed across emails, notices, tables, and follow-up messages must be reconciled before a question can be answered',
      moves:['identify the role and date of each document','track one entity across different document types','resolve apparent conflicts by chronology','combine a table value with a written condition','identify which document changes an earlier instruction','separate shared facts from document-specific claims','map sender, recipient, and action responsibility','compare planned and actual outcomes','answer cross-document inference questions','build a compact evidence matrix before choosing an answer'],
      vocab: rows(['reconcile|조정·일치시키다|The reader reconciles two apparently conflicting notices.','chronology|시간순서|Chronology shows which instruction is current.','attachment|첨부자료|The attachment contains the revised table.','invoice|청구서|The invoice reflects the updated quantity.','amendment|수정사항|A later amendment changes the deadline.','correspondence|서신·연락|The correspondence records the decision process.','entry|표의 항목|One table entry confirms the revised figure.','discrepancy|불일치|The team investigated a discrepancy between records.','supersede|대체하다|The later notice supersedes the earlier instruction.','reference number|참조번호|The reference number links the email to the invoice.','recipient|수신자|The recipient is responsible for the next action.','dispatch|발송|Dispatch occurred after final approval.','confirmation|확인|A confirmation email records the new date.','revision|수정본|The revision changes only one condition.','matrix|매트릭스·표|An evidence matrix links claims to documents.','source|출처|Each answer must be tied to a source.','cross-reference|상호 참조하다|Readers cross-reference dates and quantities.','sequence|연속 과정|The document sequence reveals the final instruction.'])
    },
    policy: {
      lens:'how rules, thresholds, exceptions, numerical limits, and conditional language determine what action is permitted or required',
      moves:['separate a general rule from its trigger','distinguish mandatory from discretionary language','read numerical thresholds with units and time periods','apply an exception only to the stated category','track nested conditions in if–unless structures','distinguish eligibility from automatic entitlement','calculate which case falls inside a policy boundary','identify the authority responsible for approval','compare policy language with an operational example','solve a new case by applying rule, condition, exception, and result in order'],
      vocab: rows(['threshold|기준치|The threshold determines whether expansion may continue.','mandatory|의무적인|The safety review is mandatory.','discretionary|재량적인|The additional payment is discretionary.','eligible|자격이 있는|Eligible users may request reimbursement.','entitled|권리가 있는|Approval does not mean every applicant is entitled to payment.','exemption|면제|The policy contains a narrow exemption.','provision|조항|One provision controls late applications.','stipulate|규정하다|The agreement stipulates a forty-eight-hour notice period.','comply|준수하다|Users must comply with the reporting rule.','exceed|초과하다|Demand must exceed the threshold.','within|~이내에|The review must occur within two business days.','unless|~하지 않는 한|The fee applies unless an exception is documented.','subject to|~을 조건으로|Payment is subject to verification.','authorize|승인 권한을 부여하다|Only the director may authorize the exception.','applicable|적용되는|The rule is applicable to new contracts.','criterion|기준|Each criterion must be satisfied.','limit|한도|The policy sets a monthly limit.','prohibit|금지하다|The rule prohibits unsupported access.'])
    },
    teps: {
      lens:'how an argument develops through claim, evidence, counterargument, limitation, and implication in abstract nonfiction',
      moves:['identify the central claim rather than the general topic','separate evidence from illustrative examples','recognize a counterargument and the author’s response','locate the assumption connecting evidence to claim','distinguish correlation from causal explanation','track abstract nouns across a paragraph','interpret hedging and degrees of certainty','evaluate the function of an example','infer the author’s likely position on a related case','summarize the argument as claim–evidence–limit–implication'],
      vocab: rows(['assert|주장하다|The author asserts a limited causal claim.','evidence|근거|The evidence supports only part of the argument.','counterargument|반론|A counterargument challenges the proposed explanation.','limitation|한계|The final paragraph acknowledges a limitation.','implication|함의|The finding has a broader policy implication.','correlation|상관관계|Correlation alone does not prove causation.','causation|인과관계|The study cannot establish causation.','mechanism|작동기제|The author proposes a mechanism for the effect.','qualify|제한하다|The evidence qualifies the original claim.','tentative|잠정적인|The conclusion remains tentative.','robust|견고한|The result is robust across several tests.','plausibility|개연성|The second study increases the explanation’s plausibility.','framework|분석틀|The article uses a comparative framework.','normative|규범적인|A normative claim concerns what should be done.','empirical|경험적|The empirical data concern observed outcomes.','derive|도출하다|The implication is derived from the evidence.','scope|범위|The author carefully limits the scope of the claim.','nuance|미묘한 차이|Advanced reading requires attention to nuance.'])
    },
    book: {
      lens:'how chapter-level prose accumulates definitions, distinctions, examples, objections, and conclusions across a longer conceptual arc',
      moves:['identify the chapter’s governing question','track a definition after the wording changes','distinguish a concept from its example','follow a distinction across several paragraphs','map an objection to the claim it targets','recognize when the author narrows an earlier statement','connect a local paragraph to the larger chapter purpose','summarize a section without copying its wording','predict the next argumentative move','build a chapter map that can be recalled without reopening the text'],
      vocab: rows(['concept|개념|The chapter defines a central concept.','distinction|구별|A key distinction organizes the argument.','illustrate|예시하다|The case illustrates the broader principle.','objection|반론|The author answers a possible objection.','proposition|명제|The proposition is narrower than the chapter topic.','framework|체계·분석틀|The framework connects several examples.','underlying|기저의|The examples share an underlying structure.','elaborate|상세히 설명하다|The next section elaborates the definition.','contrast|대조하다|The author contrasts two models.','premise|전제|The second premise appears later in the chapter.','derive|도출하다|The conclusion is derived from the distinction.','scope|범위|The chapter narrows the scope of the concept.','coherent|일관된|A coherent summary preserves the argument.','cumulative|누적적인|The chapter develops a cumulative case.','recurring|반복되는|A recurring term links distant sections.','analogy|유추|An analogy explains an unfamiliar idea.','observation|관찰|The argument begins with a practical observation.','synthesis|종합|The final section provides a synthesis.'])
    },
    integration: {
      lens:'how lexical precision, syntax, cohesion, paraphrase, inference, and evidence retrieval operate together under time pressure',
      moves:['diagnose whether an error begins in vocabulary, syntax, or logic','read for purpose before details','use structure to decide where evidence is likely to appear','switch between scanning and close reading deliberately','reject distractors by naming the exact distortion','answer numerical and conditional questions without rereading everything','summarize a document set in a fixed evidence frame','revisit only the sentence that controls the disputed answer','compare accuracy before and after timed rereading','build a personal error protocol for the next hundred days'],
      vocab: rows(['diagnose|진단하다|The learner diagnoses the source of each error.','retrieve|회수하다|Evidence must be retrieved quickly.','distortion|왜곡|The distractor contains a scope distortion.','eliminate|제거하다|Two options can be eliminated immediately.','prioritize|우선순위를 두다|Readers prioritize controlling conditions.','allocate|배분하다|Time is allocated by question type.','verify|검증하다|The final step verifies the evidence line.','monitor|점검하다|The learner monitors accuracy under time pressure.','transfer|전이하다|A skill is transferred to an unfamiliar document.','integrate|통합하다|The task integrates vocabulary and reasoning.','accuracy|정확도|Accuracy is measured before speed.','pace|속도|A stable pace reduces careless rereading.','benchmark|기준점|The first timed set provides a benchmark.','error pattern|오류 유형|Each wrong answer is assigned an error pattern.','constraint|제약|Time is a constraint, not the learning objective.','evidence line|근거 문장|The evidence line must justify the answer.','review protocol|복습 절차|A review protocol prevents random repetition.','retention|유지·정착|Spaced review improves retention.'])
    }
  };

  const COLLOCATIONS = {
    lexical: rows(['reach an agreement|합의에 도달하다|The parties reached an agreement after review.','raise a concern|우려를 제기하다|The director raised a concern about unused capacity.','meet a requirement|요건을 충족하다|The vendor must meet the security requirement.','make an adjustment|조정하다|The team made an adjustment to the schedule.','draw a distinction|구별하다|The memo draws a distinction between users.','take effect|효력이 발생하다|The revised rule takes effect next month.','in response to|~에 대응하여|The plan changed in response to new evidence.','be subject to|~을 조건으로 하다|Approval is subject to verification.','account for|~을 설명하다·차지하다|Three units account for most usage.','in light of|~을 고려하여|The recommendation changed in light of the data.']),
    syntax: rows(['provided that|~라는 조건으로|The plan continues provided that demand remains high.','not only A but also B|A뿐 아니라 B도|The policy affects not only cost but also timing.','rather than|~라기보다|The issue concerns allocation rather than performance.','as opposed to|~와 대조적으로|Actual use is measured as opposed to estimated demand.','insofar as|~하는 범위에서|The exception applies insofar as safety is affected.','with respect to|~에 관하여|The rule differs with respect to contractors.','in the event that|~하는 경우에|The plan changes in the event that demand falls.','on the grounds that|~라는 이유로|The request was rejected on the grounds that evidence was incomplete.','by means of|~을 통해|Access is verified by means of audit logs.','in conjunction with|~와 함께|The interview is used in conjunction with a work sample.']),
    cohesion: rows(['refer back to|앞 내용을 가리키다|The phrase refers back to the earlier condition.','stand in contrast to|~와 대조되다|The later figure stands in contrast to the estimate.','lead to|~로 이어지다|The delay led to a policy review.','follow from|~에서 도출되다|The conclusion follows from the usage data.','in addition|게다가|In addition, the contract permits later expansion.','by contrast|대조적으로|By contrast, smaller teams used fewer seats.','as a consequence|그 결과|As a consequence, the purchase was reduced.','for this reason|이러한 이유로|For this reason, the committee staged the rollout.','in that respect|그 점에서|In that respect, the two cases differ.','at the same time|동시에|At the same time, the plan preserves flexibility.']),
    paraphrase: rows(['be equivalent to|~와 동등하다|The revised sentence is equivalent to the original.','be consistent with|~와 일치하다|The answer is consistent with the evidence.','amount to|사실상 ~에 해당하다|The added condition amounts to a narrower rule.','result in|~을 초래하다|The change resulted in lower initial cost.','be attributable to|~에 기인하다|Most delays were attributable to missing codes.','be intended to|~을 목적으로 하다|The policy is intended to reduce uncertainty.','in other words|다시 말해|In other words, the exception is limited.','to the extent that|~하는 범위에서|The claims match to the extent that they share the same condition.','be characterized by|~의 특징을 보이다|The process is characterized by staged approval.','be indicative of|~을 시사하다|The logs are indicative of uneven usage.']),
    inference: rows(['be likely to|~할 가능성이 높다|The next review is likely to add seats only if demand rises.','be consistent with|~와 양립하다|The evidence is consistent with a narrower conclusion.','lend support to|~을 뒷받침하다|The second dataset lends support to the proposal.','cast doubt on|~에 의문을 제기하다|The low response rate casts doubt on the broad claim.','depend on|~에 달려 있다|The conclusion depends on one assumption.','rule out|배제하다|The evidence does not rule out another explanation.','point to|~을 시사하다|The logs point to a localized problem.','be attributable to|~에 기인하다|The variation may be attributable to route differences.','on the basis of|~에 근거하여|The committee acted on the basis of verified data.','to the extent possible|가능한 범위에서|The team limited disruption to the extent possible.']),
    multidoc: rows(['according to the notice|공지에 따르면|According to the notice, the date has changed.','as shown in the table|표에 나타난 대로|As shown in the table, volume fell in June.','follow up on|후속조치하다|The manager followed up on the revised invoice.','refer to|참조하다|The email refers to the attached schedule.','be replaced by|~로 대체되다|The earlier instruction was replaced by a later notice.','be consistent with|~와 일치하다|The invoice is consistent with the confirmation email.','in the meantime|그동안|In the meantime, the original service continues.','as of|~현재|As of Friday, the revised terms are active.','in accordance with|~에 따라|The shipment was released in accordance with the new rule.','be responsible for|~을 담당하다|The recipient is responsible for the next approval.']),
    policy: rows(['be required to|~해야 한다|Applicants are required to provide evidence.','be eligible for|~의 자격이 있다|Qualified users are eligible for reimbursement.','be exempt from|~에서 면제되다|Emergency cases are exempt from the fee.','no later than|늦어도 ~까지|Notice must arrive no later than Friday.','up to|최대 ~까지|Users may reduce the booking by up to 10 percent.','in excess of|~을 초과하여|Usage in excess of the limit requires approval.','subject to approval|승인을 조건으로|Payment is subject to approval.','unless otherwise stated|달리 규정되지 않는 한|The general rule applies unless otherwise stated.','within the scope of|~의 범위 내에서|The request falls within the scope of the policy.','on condition that|~라는 조건으로|The exception applies on condition that records are complete.']),
    teps: rows(['support a claim|주장을 뒷받침하다|The evidence supports a limited claim.','challenge an assumption|가정을 문제삼다|The second study challenges the assumption.','draw a conclusion|결론을 도출하다|The author draws a cautious conclusion.','account for|~을 설명하다|The mechanism may account for the observed pattern.','be associated with|~와 관련되다|The factor is associated with higher participation.','be attributable to|~에 기인하다|The result may be attributable to selection effects.','raise the possibility|가능성을 제기하다|The data raise the possibility of another mechanism.','with the exception of|~을 제외하고|The pattern held with the exception of one group.','to a limited extent|제한된 정도로|The evidence generalizes only to a limited extent.','remain subject to|여전히 ~의 제약을 받다|The conclusion remains subject to uncertainty.']),
    book: rows(['introduce a distinction|구별을 도입하다|The chapter introduces a distinction between two models.','develop an argument|논증을 전개하다|The author develops the argument across several sections.','illustrate a point|요점을 예시하다|The case illustrates a broader point.','respond to an objection|반론에 답하다|The next section responds to an objection.','build on|~을 토대로 발전시키다|The later chapter builds on the earlier definition.','refer back to|앞부분을 다시 가리키다|The author refers back to the initial example.','in this sense|이 의미에서|In this sense, the concept is narrower than common usage.','at first glance|언뜻 보면|At first glance, the two positions appear similar.','by the same token|같은 논리로|By the same token, the exception has limits.','taken together|종합하면|Taken together, the examples support the distinction.']),
    integration: rows(['under time pressure|시간 압박 속에서|The reader retrieves evidence under time pressure.','rule out|배제하다|Two distractors can be ruled out quickly.','go back to|다시 확인하다|Go back to the controlling sentence only.','keep track of|추적하다|Keep track of conditions while scanning.','make an inference|추론하다|Make an inference only after locating evidence.','identify the source of|원인을 식별하다|Identify the source of each wrong answer.','in accordance with|~에 따라|Apply the rule in accordance with its conditions.','take into account|~을 고려하다|Take into account the exception and deadline.','at a glance|한눈에|The evidence matrix can be reviewed at a glance.','on the first pass|첫 회독에서|On the first pass, identify purpose and structure.'])
  };

  const SYNTAX = {
    lexical: rows(['S + V + O, subject to N|주절 뒤 조건 부가|The order will proceed, subject to final approval.','What matters is not A but B|대조 초점 구조|What matters is not total usage but verified demand.','S + V whether + clause|간접의문 명사절|The team examined whether the savings justified the change.','N + that-clause|명사 뒤 내용절|The assumption that demand would rise proved inaccurate.','By + -ing, S + V|수단·방법|By staging the purchase, the company reduced risk.','Not all + plural noun + V|부분부정|Not all departments benefited equally.']),
    syntax: rows(['Although A, B|양보절 + 주절|Although the pilot succeeded, adoption remained uneven.','N + reduced relative clause|축약 관계절|Applications submitted after Friday require approval.','Only after A did S V|도치|Only after the audit did the team revise the plan.','S + V that S + V, which...|내용절 + 계속적 관계절|The report states that demand fell, which changed the forecast.','The N of N + V|명사화 중심 구조|The reduction of unused capacity lowered cost.','If A unless B, C|중첩 조건|If demand rises unless supply expands, delays may return.']),
    cohesion: rows(['This + summary noun + V|앞 문장 요약지칭|This revision reduced the initial commitment.','A; however, B|세미콜론 대조|Usage rose; however, the smallest teams saw little benefit.','Because A, B; therefore, C|원인-결과 연쇄|Because demand fell, capacity was cut; therefore, cost declined.','While A, B|대조·양보|While the first metric improved, the second remained weak.','S V. Such + N + V|요약지칭|The policy added a threshold. Such a condition limits expansion.','A, whereas B|대조절|Large teams improved, whereas smaller teams did not.']),
    paraphrase: rows(['Active ↔ Passive|능동·수동 전환|The team revised the policy. / The policy was revised by the team.','Verb ↔ Nominalization|동사·명사화 전환|The firm reduced cost. / The reduction in cost was significant.','because ↔ due to|절·전치사구 전환|The plan changed because demand fell. / The plan changed due to lower demand.','if ↔ provided that|조건표현 전환|Expansion continues if demand rises. / Expansion continues provided that demand rises.','more than one third ↔ over 33%|수치 패러프레이즈|More than one third of users responded. / Over 33 percent responded.','not until ↔ only after|시간 제한 전환|The plan changed only after the audit.']),
    inference: rows(['must have + p.p.|과거에 대한 강한 추론|The team must have reviewed the logs before acting.','may have + p.p.|과거 가능성|The delay may have resulted from missing data.','If A, then B is likely to V|조건 기반 추론|If demand remains low, the firm is likely to delay expansion.','Given N, S + V|근거 제시|Given the audit results, a targeted response is reasonable.','S suggests that + clause|근거→추론|The pattern suggests that the problem is localized.','It does not follow that + clause|과잉추론 차단|It does not follow that the entire program failed.']),
    multidoc: rows(['According to A, while B states...|문서대조|According to the memo, the date changed, while the invoice shows the new quantity.','The N referred to in A|분사 수식|The order referred to in the email appears on the invoice.','After A had V-ed, B V-ed|문서 시간순서|After the notice had been revised, the supplier confirmed it.','What changed was N|초점구문|What changed was the delivery date, not the quantity.','Neither A nor B|양자 부정|Neither the invoice nor the email changes the unit price.','A, which was later superseded by B|후속 문서 대체|The first notice, which was later superseded, listed the old deadline.']),
    policy: rows(['If A, B must V|조건 + 의무|If the threshold is exceeded, the manager must report it.','Unless A, B applies|예외 조건|Unless an exemption is documented, the fee applies.','S may V only if A|허용 + 제한조건|Applicants may appeal only if new evidence is available.','No more than N|상한|No more than 10 percent may be reduced without a fee.','S is entitled to N provided that A|권리 + 조건|A user is entitled to payment provided that the claim is verified.','Notwithstanding A, B|예외 우선|Notwithstanding the general rule, emergency shipments may proceed.']),
    teps: rows(['Although A, the evidence does not establish B|양보 + 한계|Although rates rose, the evidence does not establish causation.','The extent to which A depends on B|정도·의존관계|The extent to which the result generalizes depends on the sample.','What appears to be A may instead reflect B|대안설명|What appears to be an effect may instead reflect selection.','A is consistent with B, but not sufficient to prove C|증거강도|The pattern is consistent with the theory but not sufficient to prove it.','If the author is correct, then...|논증 함의|If the author is correct, the policy should be tested gradually.','Rather than A, the findings suggest B|해석 수정|Rather than proving failure, the findings suggest uneven effects.']),
    book: rows(['By X, the author means Y|정의 구조|By capacity, the author means usable rather than nominal resources.','A distinction between X and Y|개념 구별|The chapter draws a distinction between access and use.','The claim that A does not imply B|함축 제한|The claim that cost fell does not imply that quality improved.','One reason for A is that B|논거 구조|One reason for staging the plan is that demand remains uncertain.','This objection assumes that A|반론의 숨은 가정|This objection assumes that administrative cost dominates.','Taken together, A and B suggest C|종합 구조|Taken together, the cases suggest a narrower principle.']),
    integration: rows(['Not only A but also B|통합 비교|The task tests not only vocabulary but also evidence retrieval.','The faster S V, the more...|상관 비교|The faster readers identify structure, the more time they save.','Having V-ed, S V|완료 분사구문|Having located the evidence, the reader evaluates the options.','Only if A can S V|조건 도치|Only if the condition is met can the exception apply.','What distinguishes A from B is N|구별 초점|What distinguishes the two answers is the scope of the condition.','S V, thereby -ing|결과 분사|The reader eliminates two options, thereby reducing rereading.'])
  };

  function normalizeParagraphs(paragraphs) {
    const next = paragraphs.slice();
    let total = countWords(next.join(' '));
    let guard = 0;
    while (total > 790 && guard++ < 80) {
      let index = -1;
      let max = 0;
      next.forEach((p, i) => {
        const ss = sentences(p);
        const wc = countWords(p);
        if (ss.length > 3 && wc > max) { index = i; max = wc; }
      });
      if (index < 0) break;
      const ss = sentences(next[index]);
      ss.pop();
      next[index] = ss.join(' ').trim();
      total = countWords(next.join(' '));
    }
    const pad = 'A disciplined reader should now separate what the passage states directly from what can only be inferred. Conditions, exceptions, measurements, and recommendations should be marked differently because they answer different kinds of questions. The second reading is therefore not a repetition of the first; it is an evidence audit that checks whether each conclusion is tied to the exact sentence that supports it.';
    let i = 0;
    while (total < 650) {
      next[i % next.length] += ` ${pad}`;
      i += 1;
      total = countWords(next.join(' '));
    }
    return next;
  }

  function buildPassage(branch, pack, move, c) {
    const p = [
      `${c.org} is reviewing ${c.issue}. The original plan was to ${c.initial}, and managers expected a final decision before ${c.deadline}. The review became more difficult when the first operating data showed that the outcome was not uniform. ${c.metric}. Because a practical decision has to connect performance with cost, timing, and risk, the team could not rely on a single headline number. It had to determine which facts were stable, which were conditional, and which mattered only for a particular group.`,
      `The first internal summary favored the original plan, but ${c.stakeholder} asked for a narrower reading of the evidence. ${c.evidence}. That finding did not by itself prove that the initial plan was wrong. It did, however, change the weight of the assumptions behind it. The review team therefore separated measured facts from interpretations and recommendations. This distinction matters because a statement can be factually accurate while still supporting more than one reasonable course of action.`,
      `After the second review, the team proposed a revised approach: ${c.revised}. The proposal was not unconditional. ${c.condition}. It also retained one limited exception: ${c.exception}. A reader who notices only the main action may miss the legal or operational force of those qualifications. The revised plan is therefore best understood as a rule with a trigger, a scope, and an exception rather than as a simple yes-or-no decision.`,
      `The advanced focus for this lesson is ${move}. This requires attention to ${pack.lens}. In the passage, the word “${c.keyword}” means ${c.keyMeaning}. The intended meaning is established not by the word in isolation but by its grammatical position, the nouns around it, and the decision the sentence is trying to express. The same principle applies to longer structures: readers should postpone interpretation until they know what modifies what and which clause carries the main assertion.`,
      `A competing view favored the original approach because it was easier to administer and easier to explain. That argument was not irrational. A simpler procedure can reduce training time, approval steps, and coordination costs. Yet simplicity is only one criterion. The review team compared it with the cost of unused capacity, the reliability of the evidence, and the consequences of applying one rule to groups with different needs. The disagreement therefore concerned the weight of competing reasons rather than a dispute about the basic facts.`,
      `The case also shows why advanced reading depends on logical boundaries. A measured figure is evidence; a description such as successful or inefficient is an interpretation; a proposal is a recommended action. A condition limits when that action may occur, and an exception identifies a class to which the general rule does not fully apply. These categories often appear in the same paragraph. TOEIC, TEPS, reports, and books can all test whether the reader preserves those distinctions when the wording changes or the relevant evidence appears several sentences away.`,
      `The committee ultimately accepted the revised approach. ${c.result}. It also required a follow-up review so that the decision would be checked against new evidence rather than becoming permanent by default. This requirement creates a second decision point: if the relevant condition is satisfied, the organization may continue or expand the plan; if it is not, the earlier recommendation must be reconsidered. The important reading skill is to identify that future branch in the logic before answering a question about what is likely to happen next.`,
      `On the first reading, reconstruct the situation without translating every sentence: identify the problem, the evidence that changed the discussion, the revised action, the condition, and the exception. On the second reading, apply today’s focus and mark the exact expressions that control scope or inference. A strong summary should explain why ${c.org} changed its approach, what evidence justified that change, and what must happen before the next stage. If the summary omits the condition or exception, it is too broad even if the general topic is correct.`
    ];
    return normalizeParagraphs(p);
  }

  function buildVocabulary(pack, c, dayIndex) {
    const branchSet = rotate(pack.vocab, dayIndex, 12);
    const caseSet = rotate(c.vocab, dayIndex % c.vocab.length, 6);
    return [...branchSet, ...caseSet].map((item, idx) => ({...item, tier: idx < 10 ? 'CORE' : 'EXT'}));
  }

  function buildCollocations(branchId, dayIndex) {
    return rotate(COLLOCATIONS[branchId] || COLLOCATIONS.integration, dayIndex, 8);
  }

  function buildSyntax(branchId, dayIndex) {
    return rotate(SYNTAX[branchId] || SYNTAX.integration, dayIndex, 4);
  }

  function shuffleQuestion(question, seed) {
    const options = question.options.slice();
    const correct = options[question.answer];
    const shift = seed % options.length;
    const rotated = [...options.slice(shift), ...options.slice(0, shift)];
    return {...question, options: rotated, answer: rotated.indexOf(correct)};
  }

  function specialQuestion(branchId, c) {
    const map = {
      lexical: {q:`In this passage, which interpretation of “${c.keyword}” is most appropriate?`, a:c.keyMeaning, d:['a purely literal everyday meaning','a meaning unrelated to the decision','a decorative expression with no practical effect'], x:'문맥·문법·결정 목적을 함께 보아야 하는 어휘 정밀도 문제입니다.'},
      syntax: {q:'Which reading strategy best handles a long sentence containing several conditions and modifiers?', a:'Locate the main clause first, then attach subordinate material according to scope.', d:['Translate each word before identifying the verb.','Assume every modifier applies to the nearest noun.','Ignore passive constructions because the actor is omitted.'], x:'복문은 주절을 먼저 확보한 뒤 종속절과 수식범위를 계층적으로 붙여야 합니다.'},
      cohesion: {q:'What should a reader do when a phrase such as “this requirement” appears?', a:'Identify the earlier proposition or condition summarized by the phrase.', d:['Treat it as a new topic with no antecedent.','Link it automatically to the nearest noun.','Skip it because demonstratives do not affect logic.'], x:'요약지칭은 앞 문장 전체나 조건을 받을 수 있으므로 의미상 선행내용을 찾아야 합니다.'},
      paraphrase: {q:'Which feature is essential for a valid paraphrase of the revised plan?', a:'It must preserve the condition and exception even if the wording changes.', d:['It must reuse most of the original vocabulary.','It should make the recommendation stronger.','It may omit numerical or conditional limits.'], x:'패러프레이즈는 표현이 아니라 명제의 범위·조건·논리적 힘을 보존해야 합니다.'},
      inference: {q:'Which principle keeps an inference from becoming speculation?', a:'Every inference should be traceable to stated evidence and a defensible reasoning step.', d:['Choose the most detailed option.','Prefer any outcome that seems realistic in daily life.','Treat an unstated possibility as a confirmed fact.'], x:'추론은 본문 근거와 그 근거에서 결론으로 가는 연결이 모두 설명되어야 합니다.'},
      multidoc: {q:'When two documents appear to conflict, what should be checked first?', a:'Their dates, roles, and whether a later document supersedes an earlier instruction.', d:['Which document is longer.','Which document repeats more vocabulary from the question.','Whether both documents use the same font or format.'], x:'복합문서는 시간순서와 문서 기능을 먼저 확인해야 실제 충돌인지 후속 수정인지 판단할 수 있습니다.'},
      policy: {q:'How should the general rule and the stated exception be applied?', a:'Apply the rule first, then test whether the case satisfies the exact exception conditions.', d:['Apply the exception whenever it seems fair.','Ignore the general rule once an exception exists.','Treat eligibility as automatic entitlement.'], x:'정책문서는 규칙→요건→예외→효과 순으로 포섭해야 범위를 넓히지 않습니다.'},
      teps: {q:'Which statement best describes a careful argumentative conclusion?', a:'It should match the strength and scope of the evidence and acknowledge relevant limitations.', d:['It should be broader than the evidence to show insight.','It should ignore counterarguments once one dataset supports the claim.','It should convert correlation into causation whenever the pattern is strong.'], x:'TEPS·학술형 독해에서는 증거 강도보다 강한 결론을 피하고 한계를 함께 읽어야 합니다.'},
      book: {q:'What is the best way to retain a long chapter after reading?', a:'Build a map of the governing question, key distinctions, evidence, objections, and conclusion.', d:['Memorize the first sentence of every paragraph.','Record every unfamiliar word without hierarchy.','Reread the chapter from the beginning after each difficult sentence.'], x:'원서 독해는 문장 기억보다 장 전체의 논증 지도와 개념관계 유지가 핵심입니다.'},
      integration: {q:'Under time pressure, what should be verified before changing an answer?', a:'The exact evidence line and the type of error that made the original option doubtful.', d:['Whether another option contains more familiar words.','Whether the passage feels generally positive or negative.','Whether the longest option seems more complete.'], x:'통합 실전에서는 근거 회수와 오류유형 확인이 무작위 재독보다 효율적입니다.'}
    };
    const s = map[branchId] || map.integration;
    return {question:s.q, options:[s.a, ...s.d], answer:0, explanationKo:s.x, evidence:'오늘의 심화기술과 본문의 조건·근거 구조'};
  }

  function buildQuestions(branchId, c, dayNo) {
    const qs = [
      {
        question:`What is the main purpose of the passage about ${c.org}?`,
        options:[`To explain why ${c.org} revised its original plan after reviewing evidence and conditions.`,`To advertise a new service to outside customers.`,`To argue that all operational changes should be avoided.`,`To provide a historical account unrelated to a current decision.`], answer:0,
        explanationKo:'본문 전체는 초기안→새 근거→수정안→조건·예외→후속검토의 구조입니다.', evidence:`The team proposed a revised approach: ${c.revised}.`
      },
      {
        question:'Which statement is explicitly required by the revised approach?',
        options:[c.condition,'Every exception must be removed immediately.','The original plan must be completed without review.','No follow-up evidence may be considered.'], answer:0,
        explanationKo:'수정안의 명시적 조건을 직접 묻는 세부정보 문제입니다.', evidence:c.condition
      },
      {
        question:'Which situation is treated as an exception to the general approach?',
        options:[c.exception,'Any case that costs more than expected.','Any request made before the deadline.','Every department that disagrees with the recommendation.'], answer:0,
        explanationKo:'일반규칙과 예외의 적용대상을 구별해야 합니다.', evidence:c.exception
      },
      {
        question:'What can reasonably be inferred from the evidence described in the passage?',
        options:['The organization prefers a narrower decision tied to verified evidence rather than a uniform response based on one headline figure.','The organization has concluded that the entire project failed.','The organization will never reconsider the revised plan.','The original evidence was fabricated and therefore unusable.'], answer:0,
        explanationKo:'본문은 전면 실패가 아니라 집단별 차이와 조건을 반영한 좁은 결정을 지지합니다.', evidence:c.evidence
      },
      specialQuestion(branchId, c),
      {
        question:'Which statement best distinguishes evidence from interpretation in the passage?',
        options:[`${c.metric} is a measured result, while describing the overall initiative as successful would be an interpretation.`,`Both the numerical result and the word successful are direct measurements.`,`The revised plan is itself a measured fact rather than a recommendation.`,`The exception proves that the numerical evidence is incorrect.`], answer:0,
        explanationKo:'수치·관찰은 증거이고, 성공/실패 평가는 해석이며, 수정안은 권고·결정입니다.', evidence:c.metric
      }
    ];
    return qs.map((q, i) => shuffleQuestion(q, dayNo + i * 2));
  }

  function buildTransfer(branch, focus, c, move) {
    return [
      {title:'60-word summary', instruction:`본문을 다시 보지 않고 ${c.org}의 문제·핵심근거·수정안·조건·예외를 60단어 이내 영어로 요약합니다.`},
      {title:'Precision rewrite', instruction:`“${move}” 기술을 적용해 본문의 핵심 문장 하나를 의미 범위를 바꾸지 않고 다른 구조로 재작성합니다.`},
      {title:'Evidence map', instruction:'Claim → Evidence → Condition → Exception → Next action의 5칸으로 본문을 재구성합니다.'},
      {title:'Timed retrieval', instruction:'90초 안에 수정안을 바꾼 핵심 근거 2개와 조건 1개를 본문에서 다시 찾아 표시합니다.'}
    ];
  }

  data.branches.forEach((branch, branchIndex) => {
    const pack = PACKS[branch.id] || PACKS.integration;
    branch.lessons = (branch.focuses || []).map((focus, dayIndex) => {
      const dayNo = branchIndex * 10 + dayIndex + 1;
      const c = CASES[(dayIndex + branchIndex * 3) % CASES.length];
      const move = pack.moves[dayIndex % pack.moves.length];
      const paragraphs = buildPassage(branch, pack, move, c);
      return {
        day: dayNo,
        focusTitle: focus[0],
        focusKo: focus[1],
        reading: {
          title: `${c.name} · ${branch.eyebrow}`,
          instructionKo:`첫 회독에서는 문제·근거·수정안·조건·예외만 잡고 끝까지 읽습니다. 두 번째 회독에서 ‘${focus[0]}’을 집중 표시합니다.`,
          paragraphs,
          wordCount: countWords(paragraphs.join(' ')),
          summaryKo:`${c.org}는 ${c.issue} 문제를 검토한 뒤, ${c.evidence}라는 근거를 반영해 수정안을 채택했습니다. 핵심은 전면적인 판단이 아니라 조건과 예외를 포함한 좁은 의사결정입니다.`
        },
        vocabulary: buildVocabulary(pack, c, dayIndex),
        collocations: buildCollocations(branch.id, dayIndex),
        syntax: buildSyntax(branch.id, dayIndex),
        questions: buildQuestions(branch.id, c, dayNo),
        transfer: buildTransfer(branch, focus, c, move)
      };
    });
  });

  data.actualLearningData = {
    version:'2.1',
    days: data.branches.reduce((sum, b) => sum + (b.lessons?.length || 0), 0),
    readingTarget:'650~800 words',
    vocabularyPerDay:18,
    collocationsPerDay:8,
    syntaxPerDay:4,
    questionsPerDay:6,
    transferTasksPerDay:4
  };
})();
