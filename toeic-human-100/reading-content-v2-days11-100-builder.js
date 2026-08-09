/* TOEIC + TEPS Reading Immersion V2 — DAY 011~100 deterministic builder
   The builder uses master-lexicon-v2.json so every master headword is exposed by DAY 080
   and repeated through DAY 100 according to role minimums.
*/
(function (root) {
  const DAY_META = [
    [11,"은행안내 + 이메일","기업계좌 서비스","조건·수수료 비교","수량표현·비교"],
    [12,"청구서 설명 + 회계메일","인보이스 오류 수정","숫자·절차·책임 추적","전치사·수동태"],
    [13,"경비정책 + 출장보고","출장비 정산","규칙·예외·증빙","must·should·be required to"],
    [14,"보험안내 + 사고보고","업무용 차량 사고","사건순서·보장범위","과거완료·시간절"],
    [15,"구독정책 + 갱신공지","소프트웨어 구독","자동갱신·취소조건","unless·if·명사절"],
    [16,"소매점 광고 + 재고공지","계절 할인행사","가격·기간·재고 비교","비교급·수량표현"],
    [17,"식당 리뷰 + 예약문자","단체행사 예약","평가와 사실 구별","형용사·분사"],
    [18,"여행안내 + 일정표","지역 관광 프로그램","일정·장소·추천","미래표현·전치사구"],
    [19,"컨퍼런스 프로그램 + 이메일","국제세미나 참석","복수자료 정보결합","관계부사·to부정사"],
    [20,"분석기사","서비스 산업의 고객경험","주장·근거·사례","접속부사·병렬"],
    [21,"IT 공지 + 장애보고","서버 장애","문제→진단→복구","수동태·현재완료"],
    [22,"사이버보안 정책 + 경고메일","계정 보안","절차·금지·의무","명령문·조동사·조건절"],
    [23,"소프트웨어 업데이트 노트","기능 개선","이전·이후 비교","분사·관계절"],
    [24,"헬프데스크 티켓 연속문서","기술지원","질문·답변·해결단계","간접의문문·시제"],
    [25,"온라인 쇼핑카트 + 이메일","주문 변경","품목·가격·배송 연결","수량·대명사 지칭"],
    [26,"반품정책 + 고객메일","환불 요청","정책 적용·예외","if·unless·provided that"],
    [27,"마케팅 제안서","신제품 캠페인","목적·전략·예상효과","to·in order to·so that"],
    [28,"설문결과 보고서","고객만족도","데이터 해석·추론","비교·수량표현"],
    [29,"생산보고서","공장 생산성","과정·원인·성과","수동태·분사구문"],
    [30,"품질관리 사례분석","불량률 개선","문제·가설·검증","원인절·조건절"],
    [31,"유지보수 공지 + 작업보고","장비 정기점검","절차·순서","수동태·시간접속사"],
    [32,"인사정책","근무시간 제도","규칙·예외·대상","조동사·관계절"],
    [33,"성과평가 보고서","직원평가","기준·근거·결론","비교급·명사절"],
    [34,"교육안내 + 후기","직무교육","목적·효과·경험","동명사·to부정사"],
    [35,"채용기사 + 면접안내","인재선발 변화","일반론과 사례","관계절·분사수식"],
    [36,"이전지원 정책 + 이메일","직원 전근","조건·비용·일정","if·미래·수동태"],
    [37,"안전매뉴얼 + 사고보고","작업장 안전","규칙과 실제사건 대조","명령·수동태·원인"],
    [38,"건강복지 안내","직원 건강프로그램","혜택·자격·절차","be eligible for·관계절"],
    [39,"임대안내 + 계약요약","사무실 이전","조건·책임·기한","계약 고정표현·수동태"],
    [40,"건설진행 보고서","사옥 리모델링","진행상황·지연요인","현재완료진행·분사"],
    [41,"시설관리 공지","엘리베이터 점검","시간·대체수단","during·while·until"],
    [42,"항공공지 + 예약메일","항공편 변경","대안·시간표 연결","미래표현·수동태"],
    [43,"철도안내 + 문자","열차 운행변경","즉시정보 추출","시간전치사·조건"],
    [44,"렌터카 계약 + 안내","차량 대여","책임·추가요금","must·be liable for"],
    [45,"택배추적 + 고객센터","배송분실","사건순서 재구성","과거·과거완료"],
    [46,"날씨공지 + 행사메일","기상악화로 행사 변경","원인·결정·후속행동","due to·as a result"],
    [47,"일정변경 통보 + 답장","예약 재조정","제안·수락·대안","could·would·prefer"],
    [48,"공공시설 안내","도서관 운영변경","대상·기간·서비스","관계절·수동태"],
    [49,"도시서비스 기사","대중교통 개선","정책·효과·반응","현재완료·비교"],
    [50,"장문 설명문","도시가 서비스 문제를 해결하는 방식","긴 논리 유지","원인→대안→평가"],
    [51,"과학기술 특집","자동화와 업무","개념설명·사례","정의문·관계절"],
    [52,"환경보고서","기업 폐기물 감축","목표·수치·성과","비교·수동태"],
    [53,"에너지 기사","에너지 효율","원인·비용·장기효과","조건·비교"],
    [54,"지속가능성 보고","친환경 공급망","다단계 인과","분사·관계절"],
    [55,"건강정보 기사","직장인의 수면","설명·근거·권고","조동사·명사절"],
    [56,"소비자연구 리포트","구매행동 변화","데이터→해석","수량·비교·추론"],
    [57,"교육기사","성인학습 방식","주장·사례·반론","although·while"],
    [58,"출판안내 + 서평","신간 비즈니스 서적","요약·평가·추천","지칭·분사"],
    [59,"박물관 안내 + 기사","특별전시","일정과 배경지식 연결","관계부사·시간절"],
    [60,"비영리단체 보고서","기부 캠페인","목적·성과·향후계획","to·so that·미래"],
    [61,"시장분석 보고서","경쟁시장 변화","주장·근거·예측","비교·추세표현"],
    [62,"계약요약 + 협상메일","서비스 계약 갱신","조건·양보·수정","provided·unless·whereas"],
    [63,"조달공고 + 공급업체 제안","구매입찰","요건·가격·선정기준","수동태·관계절"],
    [64,"공급망 보고서","납품업체 변경","원인·리스크·대안","because·therefore"],
    [65,"협상 사례분석","가격협상","입장·양보·합의","조건법·would·could"],
    [66,"정책안내","회사 규정 개정","구·신 규정 비교","used to·no longer"],
    [67,"컴플라이언스 교육문","규정준수","의무·금지·예외","must·may not·be required"],
    [68,"개인정보 안내","고객데이터 처리","정의·목적·제한","수동태·명사절"],
    [69,"이사회 요약 + 뉴스","기업 의사결정","결정·이유·영향","간접화법"],
    [70,"장문 논증문","좋은 정책은 왜 설명 가능해야 하는가","주장·반론·재반론","논리표지 종합"],
    [71,"설명형 에세이","사람들이 긴 글을 피하는 이유","개념·원인·해결","추상명사·관계절"],
    [72,"비교 에세이","빠른 읽기와 정확한 읽기","비교논증","whereas·rather than"],
    [73,"원인·결과 에세이","정보과부하","다단계 인과","because·lead to·result in"],
    [74,"사례중심 에세이","작은 오류가 큰 문제로 커지는 과정","사건·원리 연결","조건·과거완료"],
    [75,"문제해결 에세이","조직 내 의사소통","문제·대안·평가","접속부사 종합"],
    [76,"역사적 설명문","사무기술의 변화","시간축 유지","과거·현재완료"],
    [77,"기술 설명문","클라우드 서비스의 기본원리","정의·과정·비유 연결","정의문·수동태·조건"],
    [78,"과학 설명문","증거와 가설이 검증되는 방식","가설·자료·한계 추적","조건절·수동태·명사절"],
    [79,"경제 설명문","가격과 인플레이션을 읽는 법","개념·수치·원인 구별","비교·원인절·추세표현"],
    [80,"학제간 종합리포트","업무영어에서 일반 비문학으로","전 영역 어휘 연결","복문·지칭·논리표지 종합"],
    [81,"인물 프로필 + 인터뷰","직업 전환과 전문성","시간축·동기·결과 연결","과거완료·간접화법"],
    [82,"역사·사회 기사","공공 커뮤니케이션의 변화","시대별 비교·원인","used to·현재완료·비교"],
    [83,"과학 특집","기억과 반복학습","과정설명·근거·한계","관계절·분사·명사절"],
    [84,"사회분석 에세이","신뢰와 제도의 역할","추상개념·사례·반론","although·whereas·that절"],
    [85,"경제 논증문","인센티브와 의도하지 않은 결과","원인·반례·재평가","조건법·result in·unless"],
    [86,"법·정책 설명문","규칙·예외·책임을 읽는 방식","요건·예외·효과 구별","provided that·unless·수동태"],
    [87,"기술 논증문","AI 의사결정 시스템","정의·위험·통제·반론","관계절·조건·수동태"],
    [88,"환경·도시 에세이","도시 회복탄력성","다중원인·대안평가","분사·원인절·비교"],
    [89,"문화 리뷰 + 해설","번역과 문맥","표현·의도·문화배경 연결","지칭·비교·양보"],
    [90,"장문 논증문","증거와 의견을 구별하는 법","주장·근거·추론 통합","논리표지·명사절 종합"],
    [91,"TOEIC 복합문서 모의세트","금융·출장 복합상황","복수문서 정보결합","시제·수량·조건 종합"],
    [92,"TOEIC 복합문서 모의세트","인사·IT 복합상황","대상·절차·변경 추적","관계절·수동태 종합"],
    [93,"TOEIC 복합문서 모의세트","물류·고객서비스 복합상황","원인·정책·후속행동","과거완료·조건 종합"],
    [94,"TOEIC 복합문서 모의세트","마케팅·소매 복합상황","광고·수치·정책 비교","비교·수량·분사 종합"],
    [95,"TOEIC 복합문서 모의세트","시설·행사 복합상황","시간표·공지·대안 연결","시간절·조동사 종합"],
    [96,"TEPS·원서 설명문","복잡한 개념을 정의하고 확장하기","정의·예시·한계","추상명사·관계절 종합"],
    [97,"TEPS·원서 논증문","반론을 읽고 재반박하기","주장·반론·재반론","양보·대조·조건 종합"],
    [98,"원서형 장문 챕터","한 주제를 여러 절에서 발전시키기","장거리 지칭·문단 논리","복문·대명사·접속 종합"],
    [99,"교차장르 종합독해","업무·과학·사회·정책 자료 통합","장르 전환·정보 통합","전 문법·구문 종합"],
    [100,"최종 장문 종합","시험영어에서 영어원서 독해로","전체 맥락·요약·추론","전 영역 종합"]
  ];

  const CORE_GLOSSES = {
    account:"계좌·계정", fee:"수수료", invoice:"청구서", expense:"비용", policy:"정책·규정",
    insurance:"보험", subscribe:"구독하다", inventory:"재고", reservation:"예약", conference:"회의·학술대회",
    server:"서버", security:"보안", update:"업데이트·갱신", refund:"환불", campaign:"캠페인",
    survey:"설문", production:"생산", quality:"품질", maintenance:"유지보수", performance:"성과·성능",
    training:"교육·훈련", safety:"안전", health:"건강", contract:"계약", construction:"건설",
    facility:"시설", flight:"항공편", schedule:"일정", delivery:"배송", weather:"날씨",
    library:"도서관", transport:"교통·운송", automation:"자동화", waste:"폐기물", energy:"에너지",
    supply:"공급", consumer:"소비자", education:"교육", publication:"출판", donation:"기부",
    market:"시장", negotiation:"협상", compliance:"준수", privacy:"개인정보·프라이버시", decision:"결정",
    evidence:"증거", argument:"논증·주장", context:"문맥", inference:"추론", consequence:"결과",
    responsibility:"책임", accurate:"정확한", available:"이용 가능한", require:"요구하다", provide:"제공하다",
    confirm:"확인하다", arrange:"조정·준비하다", compare:"비교하다", indicate:"나타내다", estimate:"추정하다"
  };

  const EXPRESSIONS = [
    ["in accordance with","~에 따라"],["be responsible for","~을 담당하다·책임지다"],["be required to","~하도록 요구되다"],
    ["no later than","늦어도 ~까지"],["as a result","그 결과"],["in response to","~에 대응하여"],
    ["in order to","~하기 위하여"],["according to","~에 따르면"],["be eligible for","~의 자격이 있다"],
    ["subject to","~을 조건으로·~의 적용을 받는"],["rather than","~라기보다·~대신"],["in addition to","~에 더하여"],
    ["on behalf of","~을 대신하여"],["with regard to","~에 관하여"],["as long as","~하는 한"],
    ["in contrast","대조적으로"],["as soon as","~하자마자"],["take into account","~을 고려하다"]
  ];

  const GRAMMAR_CYCLE = [
    ["관계절","명사 뒤의 who/which/that 절을 먼저 괄호로 묶고 본동사를 찾습니다."],
    ["수동태","be + p.p.에서 행위자보다 대상·절차·결과에 초점을 둡니다."],
    ["분사수식","명사 뒤의 -ing/-ed 덩어리를 압축된 관계절로 읽습니다."],
    ["명사절","that/whether/what 이하가 문장 안에서 하나의 명사 역할을 하는지 확인합니다."],
    ["부사절","because/although/while/if가 원인·양보·시간·조건 중 무엇을 표시하는지 구별합니다."],
    ["to부정사·동명사","동사의 목적·계획·행위명사 기능을 문맥에서 구분합니다."],
    ["시제·완료","기준시점보다 먼저 일어난 사건과 현재까지 이어지는 상태를 구별합니다."],
    ["비교·수량","more/less/fewer/most와 수량표현이 무엇을 비교하는지 추적합니다."],
    ["조동사","must/may/might/could/would가 의무·가능성·추정·가정 중 무엇인지 읽습니다."],
    ["전치사·접속사","뒤에 명사구가 오는지 완전한 절이 오는지 보고 구조를 판단합니다."]
  ];

  function requirement(entry) {
    const roles = entry.roles || [];
    let n = 1;
    if (roles.includes("toeic-specific")) n = Math.max(n,4);
    if (roles.includes("general-core")) n = Math.max(n,3);
    if (roles.includes("academic-book-extension")) n = Math.max(n,2);
    return n;
  }
  function schedule(entries) {
    const map = new Map();
    for (let d=11; d<=100; d++) map.set(d,[]);
    entries.forEach((entry,index) => {
      const used = new Set();
      const n = requirement(entry);
      for (let k=0; k<n; k++) {
        let day = k === 0 ? 11 + (index % 70) : 11 + ((index * 13 + k * 29) % 90);
        while (used.has(day)) day = 11 + ((day - 10) % 90);
        used.add(day);
        map.get(day).push(entry);
      }
    });
    return map;
  }
  function words(text) { return String(text||"").trim().split(/\s+/).filter(Boolean).length; }
  function titleCase(s) { return String(s).replace(/(^|\s)([a-z])/g,(_,a,b)=>a+b.toUpperCase()); }
  function chunk(items,n) {
    const out = Array.from({length:n},()=>[]);
    items.forEach((item,i)=>out[i%n].push(item));
    return out;
  }
  function listTerms(items,max=999) {
    return items.slice(0,max).map(x=>`“${x.lemma}”`).join(", ");
  }
  function lexicalBridge(items, index) {
    if (!items.length) return "";
    const t = items.filter(x=>(x.roles||[]).includes("toeic-specific"));
    const a = items.filter(x=>(x.roles||[]).includes("academic-book-extension") && !(x.roles||[]).includes("toeic-specific"));
    const g = items.filter(x=>!(x.roles||[]).includes("toeic-specific") && !(x.roles||[]).includes("academic-book-extension"));
    const pieces=[];
    if (t.length) pieces.push(`Operational material in this section also exposes the reader to ${listTerms(t)}. These terms belong to the controlled TOEIC vocabulary layer, so the aim is to meet them repeatedly inside complete sentences and documents rather than memorize a detached list.`);
    if (g.length) pieces.push(`General nonfiction vocabulary is broadened with ${listTerms(g)}. Some of these words may be familiar while others are not, but the reading rule remains the same: keep the grammatical frame active, infer what is possible from context, and continue to the end before checking details.`);
    if (a.length) pieces.push(`The TEPS and book-reading bridge adds ${listTerms(a)}. This wider lexical field is deliberate because an English book can move from business language to scientific, social, historical, or abstract vocabulary without warning, and a durable reader must tolerate that change without losing the larger argument.`);
    return pieces.join(" ");
  }

  const BASE_PARAGRAPHS = [
    (m)=>`The day's reading begins with ${m.topic}, presented through the conventions of ${m.genre}. A reader who is accustomed to short textbook sentences may initially notice individual words but lose the relation between sentences. The first task is therefore not translation. It is to keep reading until the situation, participants, purpose, and sequence of events become visible. In a TOEIC setting, this usually means identifying who is communicating, what decision or service is involved, which information is fixed, and which information may change. In a longer book, the same habit becomes the ability to retain a provisional model of the author's discussion while new evidence is added. The topic itself matters, but the deeper training goal is ${m.skill}.`,
    (m)=>`A realistic document about ${m.topic} rarely gives every important fact in one sentence. One paragraph may introduce a policy or proposal, another may state a cost or deadline, and a later message may qualify an earlier statement. Strong readers build a mental timeline instead of treating each sentence as an isolated translation problem. They notice expressions that signal continuity, contrast, cause, exception, and revision. When a statement is followed by however, nevertheless, because, unless, or as a result, the reader should expect the logical direction to change or become more precise. This habit is especially useful when several documents are combined, because the final answer often depends on information that is distributed across them rather than repeated in identical wording.`,
    (m)=>`The central issue in ${m.topic} can also be approached as an evidence problem. A claim may sound clear but still depend on conditions that are stated elsewhere. Numbers require a unit and a comparison point; recommendations require a reason; obligations require a rule and a person to whom the rule applies. Readers should ask what supports each conclusion and whether a later detail limits it. This does not mean reading suspiciously or slowly forever. It means learning to distinguish the sentence that provides evidence from the sentence that merely introduces a subject. Once that distinction becomes familiar, scanning becomes more accurate because the reader knows what kind of information must be found rather than searching for one repeated word.`,
    (m)=>`Grammar functions as a map for this process. Today's structural focus is ${m.grammar}. The purpose of learning the label is not to recite a rule but to keep a long sentence organized while reading. A relative clause may interrupt the subject before the main verb appears. A participial phrase may compress information that would otherwise require another clause. A passive construction may place the object of an action at the beginning because the process matters more than the actor. Conditional language may separate a general rule from an exception. When these patterns are recognized as familiar shapes, the reader can move through a sentence in meaningful chunks instead of attaching a Korean meaning to every word one by one.`,
    (m)=>`The practical side of ${m.topic} usually involves a decision. Someone must compare alternatives, confirm information, respond to a problem, or determine what action should occur next. The strongest reading strategy is to connect every recommendation to the fact that justifies it. If a schedule changes, identify the reason and the new obligation. If a fee is charged, identify the condition that triggers it. If a customer or employee makes a request, distinguish the request itself from the policy that controls whether it can be granted. These relationships are the raw material of TOEIC questions about purpose, inference, next action, and indicated information, but they are equally important in ordinary nonfiction because authors also organize arguments through reasons, qualifications, and consequences.`,
    (m)=>`A second difficulty arises when different expressions refer to the same idea. A text may describe an item as unavailable in one place and say that no units remain in another. A deadline may be paraphrased as the latest acceptable submission date. A writer may introduce a process by its full name and later refer to this procedure, the change, the measure, or it. Readers who depend on exact word matching often miss these connections. In ${m.topic}, paraphrase should therefore be treated as normal rather than exceptional. The goal is to recognize stable meaning even when the wording changes. This skill gradually reduces the need to translate because the reader begins to connect English expressions directly with concepts and relationships already established in the passage.`,
    (m)=>`Not every detail deserves equal attention. Long texts contain examples, names, dates, explanations, and background information, yet only some details control the main line of reasoning. A useful reader repeatedly asks what the current paragraph is doing: introducing a problem, giving evidence, presenting an exception, explaining a process, comparing options, or drawing a conclusion. This paragraph-function habit is one of the bridges from test reading to book reading. In an English book, a chapter may contain dozens of paragraphs, and no question tells the reader where to look. The reader must maintain the hierarchy independently. Training with ${m.topic} provides a smaller environment in which that hierarchy can be practiced every day.`,
    (m)=>`Speed should emerge from familiarity with structure, not from forcing the eyes to move faster. At first, a reader may need to return to the beginning of a long sentence because the main verb was missed or a pronoun reference was forgotten. Repeated exposure changes this. Common clause patterns begin to announce themselves, and familiar expressions are processed as units rather than as separate words. The same is true of questions. Phrases such as what is indicated, what can be inferred, why most likely, and what are readers asked to do become recognizable patterns. In this way, practice with ${m.topic} is not simply accumulation of information; it is repeated procedural training in how English packages information.`,
    (m)=>`The TEPS and original-reading extension pushes the same material beyond immediate workplace facts. It asks what principle can be generalized from the case, what assumption is required for a conclusion, what evidence would weaken a claim, or how an apparently simple decision fits a wider social or technical context. This shift is important because English books often leave more reasoning to the reader than business notices do. The vocabulary may become more abstract and the sentences may carry several qualifications before reaching their main point. Instead of abandoning the TOEIC foundation, the extension uses it: subject and verb tracking, clause boundaries, reference, logical connectors, and paraphrase remain the tools that allow a reader to handle more demanding prose.`,
    (m)=>`By the end of the reading, the learner should be able to summarize ${m.topic} without translating every sentence. A useful summary states the initial situation, the major complication or question, the evidence that matters, the response or conclusion, and any important limitation. If that outline can be reconstructed, the passage has been understood at a structural level even if several individual words remain uncertain. The final rereading should therefore feel different from the first. The text is the same, but more of its architecture is visible. Repeating this process across one hundred days is intended to make long English text ordinary: not easy in the sense that every word is known, but manageable because the reader has learned how to keep meaning connected from the first paragraph to the last.`
  ];

  function metaObj(row) { return {day:row[0],genre:row[1],topic:row[2],skill:row[3],grammar:row[4]}; }
  function makeParagraphs(meta, targets) {
    const groups = chunk(targets,10);
    const paragraphs = BASE_PARAGRAPHS.map((fn,i)=>`${fn(meta)} ${lexicalBridge(groups[i],i)}`.trim());
    let total = words(paragraphs.join(" "));
    const pad = `A further reading principle is to preserve the sentence frame when an unfamiliar expression appears. Instead of stopping immediately, identify the subject, locate the main verb, observe the connector, and decide whether the unknown item is essential to the author's claim. This controlled tolerance for uncertainty is what allows readers to finish long passages and later confirm vocabulary without losing the argument.`;
    let i=0;
    while (total < 1350) { paragraphs[i%paragraphs.length] += ` ${pad}`; i++; total=words(paragraphs.join(" ")); }
    return paragraphs;
  }

  function makeVocabulary(targets) {
    const preferred = targets.filter(x=>CORE_GLOSSES[x.lemma]).slice(0,12);
    const fallback = targets.filter(x=>!preferred.includes(x)).slice(0,Math.max(0,12-preferred.length));
    return [...preferred,...fallback].map(x=>({
      lemma:x.lemma,
      meaningKo:CORE_GLOSSES[x.lemma] || ((x.roles||[]).includes("toeic-specific") ? "TOEIC 핵심·실무 문맥어" : (x.roles||[]).includes("academic-book-extension") ? "TEPS·원서 확장 문맥어" : "일반 비문학 문맥어"),
      tier:(x.roles||[]).includes("toeic-specific")?"A":(x.roles||[]).includes("academic-book-extension")?"B":"C"
    }));
  }

  function makeDay(meta, targets) {
    const p = makeParagraphs(meta,targets);
    const g1=GRAMMAR_CYCLE[(meta.day-1)%GRAMMAR_CYCLE.length], g2=GRAMMAR_CYCLE[(meta.day+2)%GRAMMAR_CYCLE.length];
    const ex1=EXPRESSIONS[(meta.day-1)%EXPRESSIONS.length], ex2=EXPRESSIONS[(meta.day+5)%EXPRESSIONS.length], ex3=EXPRESSIONS[(meta.day+10)%EXPRESSIONS.length];
    return {
      day:meta.day,
      title:`${meta.topic} · Long Reading`,
      genre:meta.genre,
      blocks:["read","analyze","apply"],
      reading:{
        title:`DAY ${String(meta.day).padStart(3,"0")} — ${meta.topic}`,
        instructionKo:`약 1,500단어를 중간에 포기하지 말고 끝까지 읽으세요. 오늘의 핵심은 ${meta.skill}입니다. 모르는 단어가 있어도 먼저 문장구조와 문단기능을 유지합니다.`,
        paragraphs:p,
        summaryKo:`${meta.genre} 형식으로 ${meta.topic}을 읽으며 ${meta.skill}을 훈련합니다. 개별 단어 해석보다 문장구조, 문단기능, 근거와 결론의 연결을 우선합니다.`,
        paragraphFunctionsKo:["상황·주제 설정","정보 변화와 논리표지","증거와 조건","문법을 독해도구로 사용","행동·결정 연결","paraphrase와 지칭","문단 기능·정보 위계","구조 자동화와 속도","TEPS·원서 논리 확장","전체 요약·재독"]
      },
      vocabulary:makeVocabulary(targets),
      expressions:[ex1,ex2,ex3].map(([title,meaningKo])=>({title,meaningKo,tier:"A"})),
      grammar:[{title:g1[0],pointKo:g1[1]},{title:g2[0],pointKo:g2[1]},{title:meta.grammar,pointKo:`오늘 본문에서 ${meta.grammar} 구조가 긴 문장을 어떻게 조직하는지 반복해서 확인합니다.`}],
      sentenceStructures:[
        {title:"명사 + 수식절 + 본동사",example:"Readers who follow the supporting details can identify the main decision more accurately."},
        {title:"Although A, B",example:"Although several details may be unfamiliar, the main structure can still be followed."},
        {title:"S + V that + 절",example:"The report indicates that the final decision depends on evidence presented later."},
        {title:"If A, B",example:"If a condition changes, the reader must revise the earlier interpretation."}
      ],
      sentenceLab:[
        {sentence:"Readers who focus only on familiar words may miss the relationship between the condition stated earlier and the decision explained later.",chunks:["Readers","who focus only on familiar words","may miss","the relationship","between the condition stated earlier and the decision explained later"],explanationKo:"who절을 주어 수식으로 떼고 Readers may miss를 먼저 잡습니다."},
        {sentence:"Although the document contains several qualifications, the central claim becomes clearer once the reader identifies which information functions as evidence.",chunks:["Although the document contains several qualifications","the central claim becomes clearer","once the reader identifies","which information functions as evidence"],explanationKo:"Although 양보절 뒤의 본문장을 잡고, once절 안의 which 명사절을 이어 읽습니다."},
        {sentence:"The ability to preserve a provisional interpretation while later evidence modifies it is essential for long-form reading.",chunks:["The ability","to preserve a provisional interpretation","while later evidence modifies it","is essential","for long-form reading"],explanationKo:"긴 주어 The ability... 뒤의 본동사 is를 찾는 훈련입니다."}
      ],
      practice:{
        part5:[
          {focus:"품사",question:"The report explains the procedure _____ so that readers can follow each step.",options:["clear","clearly","clarity","clearing"],answer:1,explanation:"동사 explains를 수식하므로 부사 clearly가 필요합니다."},
          {focus:"관계절",question:"The employees _____ received the revised notice were asked to confirm the change.",options:["who","which","where","whose it"],answer:0,explanation:"사람을 선행사로 받는 주격 관계대명사 who가 필요합니다."},
          {focus:"조건",question:"The original arrangement will remain in effect _____ a new notice is issued.",options:["unless","because of","during","despite"],answer:0,explanation:"새 공지가 나오지 않는 한이라는 조건이므로 unless입니다."}
        ],
        part6:[
          {type:"문맥 연결",question:"Which connector best introduces a result that follows from the previous evidence?",options:["As a result","By contrast","For instance","Meanwhile"],answer:0,explanation:"앞 근거에서 직접 이어지는 결과이므로 As a result가 적절합니다."},
          {type:"지칭",question:"In a long passage, what should a reader do first when encountering 'this change'?",options:["Translate only the word change","Identify the earlier event or decision it refers to","Ignore the phrase","Assume it means the title"],answer:1,explanation:"지시어가 가리키는 앞 내용을 찾아야 문단 연결이 유지됩니다."}
        ],
        part7:[
          {type:"목적",question:`What is the main purpose of the DAY ${meta.day} passage?`,options:[`To explain ${meta.topic} while training structural reading`,`To list unrelated vocabulary only`,`To test pronunciation only`,`To teach translation without context`],answer:0,explanation:`${meta.topic}을 소재로 장문 구조와 정보관계를 읽는 것이 목적입니다.`,evidence:"The opening and closing paragraphs state the topic and the long-reading objective."},
          {type:"추론",question:"What can be inferred about the recommended reading method?",options:["Every unknown word must be checked immediately.","Readers should preserve the larger structure even when some vocabulary is uncertain.","Only short sentences should be studied.","Grammar labels are more important than meaning."],answer:1,explanation:"본문은 모르는 단어가 있어도 구조와 맥락을 유지하라고 반복합니다.",evidence:"Several paragraphs emphasize continuing through uncertainty and checking details later."},
          {type:"세부정보",question:"Which skill is repeatedly connected with faster reading?",options:["Skipping all modifiers","Recognizing recurring clause and question patterns","Reading only the first sentence","Memorizing Korean translations"],answer:1,explanation:"구문과 질문패턴의 자동 인식이 속도로 전환된다고 설명합니다.",evidence:"The paragraph on speed explicitly links familiarity with recurring structures to faster processing."},
          {type:"주제",question:"Which statement best summarizes the passage?",options:["Long reading develops when vocabulary, grammar, reference, and logic are processed as one connected system.","Reading skill depends only on knowing more words.","TOEIC and book reading require unrelated abilities.","A passage is understood only when every sentence is translated."],answer:0,explanation:"전체 프로그램의 핵심은 영어를 단어 집합이 아니라 연결된 의미체계로 읽는 것입니다.",evidence:"The final paragraph summarizes structural understanding and repeated rereading."}
        ]
      },
      review:{rereadInstructionKo:`두 번째 회독에서는 ${meta.skill}에 해당하는 표현을 표시하고, 각 문단의 기능을 한 문장으로 말한 뒤 다음 문단으로 넘어가세요.`,selfCheck:["끝까지 읽었는가","주어·본동사와 수식절을 구분했는가","문단별 기능과 전체 결론을 설명할 수 있는가","모르는 단어 때문에 전체 맥락을 포기하지 않았는가"]},
      coverage:{targetCount:targets.length,masterLemmas:targets.map(x=>x.lemma)}
    };
  }

  function tepsPassage(meta,targets) {
    const academic=targets.filter(x=>(x.roles||[]).includes("academic-book-extension"));
    const general=targets.filter(x=>!(x.roles||[]).includes("toeic-specific")).slice(0,36);
    const terms=[...academic.slice(0,24),...general.slice(0,18)].filter((x,i,a)=>a.findIndex(y=>y.lemma===x.lemma)===i);
    return `A more demanding reading of ${meta.topic} begins when the reader stops asking only what happened and starts asking why the explanation is persuasive. Evidence may support a conclusion without proving it absolutely, and a condition that is reasonable in one context may become inadequate in another. Skilled readers therefore distinguish description from inference, correlation from cause, and a general tendency from an exception. They also notice how an author limits a claim through words such as although, generally, potentially, or under certain conditions. The extension deliberately increases lexical variety. It may introduce ${listTerms(terms)}. These expressions represent the wider range encountered in TEPS passages and English nonfiction, where scientific, social, economic, cultural, and institutional vocabulary can occur within the same chapter. The objective is not to stop and memorize every item during the first reading. It is to maintain the argument, use syntax and surrounding evidence to narrow possible meanings, and then return to uncertain vocabulary after the structure of the passage is understood. Repeated practice turns unfamiliarity from a reason to stop into a manageable part of reading.`;
  }

  function makeTeps(meta,targets) {
    const vocab=targets.filter(x=>(x.roles||[]).includes("academic-book-extension")).slice(0,8).map(x=>[x.lemma,"TEPS·원서 확장 문맥에서 의미를 추론할 어휘"]);
    while(vocab.length<8) vocab.push([targets[vocab.length%targets.length]?.lemma || "context","문맥에서 의미를 추론할 어휘"]);
    return {
      day:meta.day,
      title:`TEPS 독해 확장 · ${meta.topic}`,
      passage:tepsPassage(meta,targets),
      vocabulary:vocab,
      logicKo:`TOEIC 본문의 사실관계를 넘어 ${meta.topic}에서 주장, 근거, 조건, 예외와 추론의 강도를 구별합니다. 모르는 고급어휘가 있어도 논리표지와 문장구조를 이용해 전체 주장을 유지하는 것이 목표입니다.`,
      questions:[
        {type:"빈칸",question:"The passage suggests that unfamiliar vocabulary should first be handled by _____ .",options:["abandoning the passage","maintaining the argument and using syntax and context","translating every word before continuing","ignoring grammar"],answer:1,explanation:"구조를 유지한 뒤 불확실한 어휘를 재확인하라고 설명합니다."},
        {type:"추론",question:"Which distinction is most consistent with the passage?",options:["Evidence and absolute proof are always identical.","A reasonable condition may not apply equally in every context.","All exceptions should be ignored.","Vocabulary alone determines comprehension."],answer:1,explanation:"조건과 결론의 적용범위를 문맥에 따라 판단해야 한다는 논리입니다."},
        {type:"주제",question:"What is the main purpose of the extension?",options:["To replace TOEIC reading with translation","To extend structural reading into abstract and interdisciplinary nonfiction","To remove unfamiliar vocabulary","To practice isolated grammar drills"],answer:1,explanation:"TOEIC 구조독해를 TEPS와 원서형 비문학으로 확장하는 것이 목적입니다."}
      ]
    };
  }

  function build(master) {
    const entries=(master && master.entries)||[];
    if (!entries.length) throw new Error("master lexicon entries missing");
    const targetMap=schedule(entries);
    const days=DAY_META.map(row=>{const meta=metaObj(row);return makeDay(meta,targetMap.get(meta.day)||[]);});
    const tepsDays=DAY_META.map(row=>{const meta=metaObj(row);return makeTeps(meta,targetMap.get(meta.day)||[]);});
    return {days,tepsDays,targetMap};
  }

  function attach(result) {
    if (typeof TOEIC_READING_V2 === "undefined") throw new Error("TOEIC_READING_V2 must load before builder");
    if (typeof TEPS_READING_EXTENSION_V2 === "undefined") throw new Error("TEPS_READING_EXTENSION_V2 must load before builder");
    for (const day of result.days) if (!TOEIC_READING_V2.days.some(x=>x.day===day.day)) TOEIC_READING_V2.days.push(day);
    TOEIC_READING_V2.days.sort((a,b)=>a.day-b.day);
    for (const day of result.tepsDays) if (!TEPS_READING_EXTENSION_V2.days.some(x=>x.day===day.day)) TEPS_READING_EXTENSION_V2.days.push(day);
    TEPS_READING_EXTENSION_V2.days.sort((a,b)=>a.day-b.day);
  }

  root.TOEIC_READING_V2_BUILDER={build,attach,requirement,DAY_META};

  if (typeof window !== "undefined" && typeof fetch === "function") {
    root.TOEIC_READING_V2_READY=fetch("master-lexicon-v2.json?v=20260809-v4")
      .then(r=>{if(!r.ok) throw new Error(`master lexicon HTTP ${r.status}`); return r.json();})
      .then(master=>{const result=build(master);attach(result);return result;})
      .catch(err=>{console.error("V2 DAY 011-100 builder failed",err);return null;});
  }
})(globalThis);
