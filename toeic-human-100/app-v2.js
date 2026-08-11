const CATEGORIES = {
  read: { label: "장문읽기", part: "LONG READING" },
  analyze: { label: "해부·학습", part: "VOCAB · GRAMMAR · STRUCTURE" },
  apply: { label: "문제·복습", part: "PART 5 · 6 · 7" },
  speed: { label: "스피드퀴즈", part: "PART 5 SPEED QUIZ" }
};
const categoryOrder = Object.keys(CATEGORIES);
const $ = (id) => document.getElementById(id);
const els = {
  dayLabel: $("dayLabel"), dayHeadline: $("dayHeadline"), dateLabel: $("dateLabel"),
  progressRing: $("progressRing"), progressNumber: $("progressNumber"),
  dailyProgressText: $("dailyProgressText"), dailyProgressBar: $("dailyProgressBar"),
  badge: $("badge"), partBadge: $("partBadge"), cardContent: $("cardContent"),
  quizArea: $("quizArea"), speakBtn: $("speakBtn"), completeBtn: $("completeBtn"),
  prevDayBtn: $("prevDayBtn"), nextDayBtn: $("nextDayBtn"), navDay: $("navDay"),
  totalCompleted: $("totalCompleted"), completedDays: $("completedDays"), wrongCount: $("wrongCount"),
  shareBtn: $("shareBtn"), resetBtn: $("resetBtn"), installBtn: $("installBtn"), toast: $("toast")
};

const COMPLETION_KEY = "toeic100_completed_v2";
const WRONG_KEY = "toeic100_wrong_v2";
const SPEED_MIGRATION_KEY = "toeic100_speed_quiz_migrated_v1";
let activeCategory = "read";
let activeDay = 1;
let autoDay = 1;
let deferredInstallPrompt = null;
let currentSpeechText = "";
let activeQuestions = new Map();
let speechToken = 0;

function kstDateString(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}
function formatKoreanDate(dateString) {
  const [y,m,d] = dateString.split("-").map(Number);
  return `${y}년 ${m}월 ${d}일`;
}
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'\"':"&quot;"}[c]));
}
function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.remove("show"), 2100);
}

function migrateLegacyProgress() {
  if (localStorage.getItem(COMPLETION_KEY)) return;
  let legacy = {};
  try { legacy = JSON.parse(localStorage.getItem("toeic100_completed") || "{}"); } catch {}
  const migrated = {};
  for (const [day, values] of Object.entries(legacy)) {
    const done = new Set(Array.isArray(values) ? values : []);
    const next = [];
    if (["vocab","expression","sentence"].every(key => done.has(key)) || done.has("read")) next.push("read");
    if (done.has("grammar") || done.has("analyze")) next.push("analyze");
    if (done.has("practice") || done.has("apply")) next.push("apply");
    if (next.length) migrated[day] = next;
  }
  localStorage.setItem(COMPLETION_KEY, JSON.stringify(migrated));

  if (!localStorage.getItem(WRONG_KEY)) {
    let oldWrong = [];
    try { oldWrong = JSON.parse(localStorage.getItem("toeic100_wrong") || "[]"); } catch {}
    localStorage.setItem(WRONG_KEY, JSON.stringify(oldWrong.map(day => `legacy-day-${day}`)));
  }
}
function getCompleted() {
  try { return JSON.parse(localStorage.getItem(COMPLETION_KEY) || "{}"); }
  catch { return {}; }
}
function setCompleted(data) { localStorage.setItem(COMPLETION_KEY, JSON.stringify(data)); }
function migrateSpeedProgress() {
  if (localStorage.getItem(SPEED_MIGRATION_KEY)) return;
  const data = getCompleted();
  let firstIncomplete = 101;
  for (let day = 1; day <= 100; day += 1) {
    const done = new Set(Array.isArray(data[day]) ? data[day] : []);
    if (!["read", "analyze", "apply"].every(category => done.has(category))) {
      firstIncomplete = day;
      break;
    }
  }
  for (let day = 1; day < firstIncomplete; day += 1) {
    data[day] ||= [];
    if (!data[day].includes("speed")) data[day].push("speed");
  }
  setCompleted(data);
  localStorage.setItem(SPEED_MIGRATION_KEY, "1");
}
function getWrong() {
  try { return JSON.parse(localStorage.getItem(WRONG_KEY) || "[]"); }
  catch { return []; }
}
function setWrong(data) { localStorage.setItem(WRONG_KEY, JSON.stringify([...new Set(data)])); }
function isCompleted(day, category) { return Boolean(getCompleted()[day]?.includes(category)); }
function dayIsComplete(day, data = getCompleted()) {
  const entries = new Set(Array.isArray(data[day]) ? data[day] : []);
  return categoryOrder.every(category => entries.has(category));
}
function firstIncompleteCategory(day, data = getCompleted()) {
  const entries = new Set(Array.isArray(data[day]) ? data[day] : []);
  return categoryOrder.find(category => !entries.has(category)) || "read";
}
function getAutoDay() {
  const data = getCompleted();
  for (let day = 1; day <= 100; day += 1) if (!dayIsComplete(day, data)) return day;
  return 100;
}
function toggleCompleted(day, category) {
  const data = getCompleted();
  data[day] ||= [];
  if (data[day].includes(category)) data[day] = data[day].filter(x => x !== category);
  else data[day].push(category);
  setCompleted(data);
}
function getV2Day(day) {
  if (typeof TOEIC_READING_V2 === "undefined" || !Array.isArray(TOEIC_READING_V2.days)) return null;
  return TOEIC_READING_V2.days.find(item => item.day === day) || null;
}
function getLegacy(category, day) {
  if (typeof TOEIC_CONTENT === "undefined") return null;
  return TOEIC_CONTENT?.[category]?.find(item => item.day === day) || null;
}
function updateUrl() {
  const url = new URL(location.href);
  url.searchParams.set("category", activeCategory);
  url.searchParams.delete("day");
  url.searchParams.delete("review");
  history.replaceState({}, "", url);
}

function splitSpeech(text, maxLength = 210) {
  const sentences = String(text).replace(/\s+/g, " ").match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
  const chunks = [];
  let current = "";
  for (const sentence of sentences) {
    const next = `${current} ${sentence}`.trim();
    if (next.length <= maxLength) current = next;
    else {
      if (current) chunks.push(current);
      if (sentence.length <= maxLength) current = sentence.trim();
      else {
        const words = sentence.trim().split(/\s+/);
        current = "";
        for (const word of words) {
          const test = `${current} ${word}`.trim();
          if (test.length > maxLength) { if (current) chunks.push(current); current = word; }
          else current = test;
        }
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}
function speak(text) {
  if (!("speechSynthesis" in window)) return showToast("이 브라우저에서는 음성 재생을 지원하지 않습니다.");
  speechSynthesis.cancel();
  const token = ++speechToken;
  const chunks = splitSpeech(text);
  let index = 0;
  const voices = speechSynthesis.getVoices();
  const preferred = voices.find(v => /en-US/i.test(v.lang)) || voices.find(v => /^en/i.test(v.lang));
  const next = () => {
    if (token !== speechToken || index >= chunks.length) return;
    const utterance = new SpeechSynthesisUtterance(chunks[index++]);
    utterance.lang = "en-US";
    utterance.rate = .82;
    utterance.pitch = 1;
    if (preferred) utterance.voice = preferred;
    utterance.onend = next;
    speechSynthesis.speak(utterance);
  };
  next();
}

function renderV2Read(day) {
  const paragraphs = day.reading?.paragraphs || [];
  currentSpeechText = paragraphs.join(" ");
  const functions = (day.reading?.paragraphFunctionsKo || []).map((text, i) => `<li><strong>${i+1}문단</strong> · ${escapeHtml(text)}</li>`).join("");
  return `
    <div class="reading-header">
      <h2 class="reading-title">${escapeHtml(day.reading?.title || day.title)}</h2>
      <p class="reading-instruction">${escapeHtml(day.reading?.instructionKo)}</p>
      <div class="reading-meta"><span>약 1,500단어 장문</span><span>${escapeHtml(day.genre)}</span><span>첫 회독: 끝까지 읽기</span></div>
    </div>
    <article class="long-reading">${paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join("")}</article>
    <details class="reading-details"><summary>1회독 후 전체 흐름 확인</summary><div><p class="example-ko">${escapeHtml(day.reading?.summaryKo)}</p><ol class="paragraph-functions">${functions}</ol></div></details>`;
}
function renderV2Analyze(day) {
  const vocab = (day.vocabulary || []).map(item => `<div class="lexicon-item"><strong>${escapeHtml(item.lemma || item.title)}</strong><span>${escapeHtml(item.meaningKo)}</span><span class="tier">${escapeHtml(item.tier || "")}</span></div>`).join("");
  const expressions = (day.expressions || []).map(item => `<div class="lexicon-item"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.meaningKo)}</span><span class="tier">${escapeHtml(item.tier || "")}</span></div>`).join("");
  const grammar = (day.grammar || []).map(item => `<div class="grammar-card"><strong>${escapeHtml(item.title)}</strong><br>${escapeHtml(item.pointKo)}</div>`).join("");
  const structures = (day.sentenceStructures || []).map(item => `<div class="structure-card"><strong>${escapeHtml(item.title)}</strong><br><span class="example-en">${escapeHtml(item.example)}</span></div>`).join("");
  const labs = (day.sentenceLab || []).map((item, i) => `<details class="sentence-lab"><summary>${i+1}. ${escapeHtml(item.sentence)}</summary><div class="sentence-lab-body">${(item.chunks || []).map(chunk => `<div class="chunk-line">${escapeHtml(chunk)}</div>`).join("")}<p class="sentence-explain">${escapeHtml(item.explanationKo)}</p></div></details>`).join("");
  currentSpeechText = (day.sentenceLab || []).map(item => item.sentence).join(" ") || (day.reading?.paragraphs || []).join(" ");
  return `
    <section class="analysis-section"><h3>핵심어휘</h3><p class="analysis-note">먼저 본문에서 만난 뒤 뜻을 확인합니다. 같은 단어는 이후 다른 장르와 문맥에서 반복됩니다.</p><div class="lexicon-grid">${vocab}</div></section>
    <section class="analysis-section"><h3>숙어·연어·고정결합</h3><div class="lexicon-grid">${expressions}</div></section>
    <section class="analysis-section"><h3>오늘 본문에서 익힐 문법</h3><div class="grammar-list">${grammar}</div></section>
    <section class="analysis-section"><h3>긴 문장 구조 패턴</h3><div class="structure-list">${structures}</div></section>
    <section class="analysis-section"><h3>긴 문장 해부</h3><p class="analysis-note">문장을 통째로 번역하기 전에 주어·본동사·절·수식덩어리를 먼저 찾습니다.</p>${labs}</section>
    <details class="reading-details"><summary>분석 후 본문 다시 읽기</summary><div><p class="example-ko">${escapeHtml(day.review?.rereadInstructionKo)}</p></div></details>`;
}

function prepareQuestionItem(item, qid) {
  const options = Array.isArray(item?.options) ? item.options : [];
  const match = String(qid).match(/^d(\d+)-speed-(\d+)$/);
  if (!match || options.length < 2) return item;
  const shift = (Number(match[1]) + Number(match[2])) % options.length;
  if (!shift) return item;
  return {
    ...item,
    options: [...options.slice(shift), ...options.slice(0, shift)],
    answer: (Number(item.answer) - shift + options.length) % options.length
  };
}
function questionHtml(item, qid, label) {
  const renderedItem = prepareQuestionItem(item, qid);
  activeQuestions.set(qid, renderedItem);
  return `<div class="practice-item" data-question="${escapeHtml(qid)}"><span class="practice-label">${escapeHtml(label)}</span><p class="question">${escapeHtml(renderedItem.question)}</p><div class="quiz-options">${(renderedItem.options || []).map((o,i)=>`<button class="quiz-option" data-qid="${escapeHtml(qid)}" data-index="${i}"><strong>(${String.fromCharCode(65+i)})</strong> ${escapeHtml(o)}</button>`).join("")}</div><p class="quiz-result">정답을 선택하세요.</p><div class="question-explanation"></div></div>`;
}

const SPEED_QUIZ_BANK = {
  "품사": [
    {question:"The revised proposal was considered highly _____ by the review committee.",options:["viable","viability","viably","revitalize"],answer:0,explanation:"consider A + 형용사 구조에서 목적격보어 자리에는 형용사 viable이 적절합니다."},
    {question:"The technician completed the inspection _____ before the afternoon briefing.",options:["thorough","thoroughly","thoroughness","more thorough"],answer:1,explanation:"동사 completed를 수식해야 하므로 부사 thoroughly가 정답입니다."}
  ],
  "시제": [
    {question:"By the time the client arrived, the project team _____ the final presentation.",options:["had completed","has completed","completes","will complete"],answer:0,explanation:"과거의 기준시점 arrived보다 먼저 끝난 일을 나타내므로 과거완료 had completed가 필요합니다."},
    {question:"Since the new policy was introduced, customer complaints _____ steadily.",options:["have declined","declined","will decline","declining"],answer:0,explanation:"since + 과거시점 이후 현재까지의 변화를 나타내므로 현재완료 have declined가 적절합니다."}
  ],
  "수동태": [
    {question:"All expense reports must _____ by a department manager before payment.",options:["be approved","approve","approved","approving"],answer:0,explanation:"보고서는 승인을 받는 대상이므로 조동사 뒤 수동태 must be approved가 필요합니다."},
    {question:"The replacement parts _____ to the regional office yesterday afternoon.",options:["were delivered","delivered","have deliver","delivering"],answer:0,explanation:"부품이 배송된 것이므로 과거 수동태 were delivered가 정답입니다."}
  ],
  "관계절": [
    {question:"Employees _____ work with confidential records must complete the security course.",options:["who","which","where","whose it"],answer:0,explanation:"사람인 Employees를 선행사로 받고 관계절 안에서 주어 역할을 하므로 who가 필요합니다."},
    {question:"The conference room _____ was renovated last month can seat forty people.",options:["that","where","what","when"],answer:0,explanation:"사물인 room을 선행사로 받고 관계절 안에서 주어 역할을 하므로 that이 적절합니다."}
  ],
  "접속사": [
    {question:"The shipment was postponed _____ several items failed the final inspection.",options:["because","although","despite","during"],answer:0,explanation:"뒤에 완전한 절이 오고 지연의 원인을 설명하므로 접속사 because가 정답입니다."},
    {question:"The outdoor event will proceed as scheduled _____ severe weather is reported.",options:["unless","because of","while","due to"],answer:0,explanation:"악천후가 보고되지 않는 한이라는 조건이므로 unless가 적절합니다."}
  ],
  "전치사": [
    {question:"The company has operated _____ strict compliance with the new safety rules.",options:["in","at","by","for"],answer:0,explanation:"in compliance with는 '~을 준수하여'라는 고정 표현입니다."},
    {question:"Applications received _____ Friday will be reviewed the following week.",options:["after","among","through","beside"],answer:0,explanation:"금요일 이후에 접수된 신청서라는 시간관계이므로 after가 적절합니다."}
  ],
  "준동사": [
    {question:"All participants are required _____ the online form before attending the workshop.",options:["to submit","submit","submitting","submitted"],answer:0,explanation:"be required to + 동사원형 구조이므로 to submit이 정답입니다."},
    {question:"The manager recommended _____ the supplier before placing another order.",options:["contacting","contact","to contacted","contacted"],answer:0,explanation:"recommend 뒤에는 동명사가 자연스럽게 오므로 contacting이 적절합니다."}
  ],
  "비교·수량": [
    {question:"The updated software is significantly _____ than the previous version.",options:["more reliable","reliably","most reliable","reliability"],answer:0,explanation:"than과 함께 두 대상을 비교하므로 비교급 more reliable이 필요합니다."},
    {question:"Only a _____ employees requested additional training after the orientation.",options:["few","little","much","amount"],answer:0,explanation:"셀 수 있는 복수명사 employees 앞에는 a few가 적절합니다."}
  ],
  "수일치": [
    {question:"Each of the regional offices _____ its own emergency procedure.",options:["has","have","having","to have"],answer:0,explanation:"Each가 주어의 중심이므로 단수동사 has를 사용합니다."},
    {question:"A series of customer surveys _____ scheduled for next month.",options:["is","are","were","have"],answer:0,explanation:"주어의 중심은 단수명사 series이므로 is가 적절합니다."}
  ],
  "명사절": [
    {question:"The committee has not decided _____ the contract should be renewed.",options:["whether","which","where","whose"],answer:0,explanation:"계약 갱신 여부를 나타내는 명사절을 이끌어야 하므로 whether가 적절합니다."},
    {question:"Please confirm _____ the revised schedule has been sent to all participants.",options:["whether","what","whose","where"],answer:0,explanation:"일정표가 발송되었는지 여부를 확인하는 문장이므로 whether가 정답입니다."}
  ],
  "분사": [
    {question:"Customers _____ in the premium plan receive priority technical support.",options:["enrolled","enrolling","enroll","to enroll"],answer:0,explanation:"premium plan에 등록된 고객이라는 수동 의미이므로 과거분사 enrolled가 적절합니다."},
    {question:"The documents _____ during the audit must be stored for five years.",options:["collected","collecting","collect","to collect"],answer:0,explanation:"감사 중 수집된 문서라는 수동 의미이므로 과거분사 collected가 필요합니다."}
  ],
  "조동사": [
    {question:"Employees _____ wear protective equipment while working in the testing area.",options:["must","would","could have","might have"],answer:0,explanation:"안전규정상 의무를 나타내므로 must가 가장 적절합니다."},
    {question:"The delivery _____ arrive before noon if traffic conditions remain normal.",options:["should","has","did","was"],answer:0,explanation:"정상적인 조건에서의 예상·가능성을 나타내므로 should가 적절합니다."}
  ]
};
const SPEED_FOCUS_ORDER = ["품사","시제","수동태","관계절","접속사","전치사","준동사","비교·수량","수일치","명사절","분사","조동사"];
function speedFocusKey(value = "") {
  const text = String(value).toLowerCase();
  if (/수동|passive/.test(text)) return "수동태";
  if (/과거완료|현재완료|시제|tense|perfect|미래/.test(text)) return "시제";
  if (/관계|relative/.test(text)) return "관계절";
  if (/접속|조건|양보|원인|although|while|unless|because/.test(text)) return "접속사";
  if (/전치사|preposition/.test(text)) return "전치사";
  if (/부정사|동명사|infinitive|gerund/.test(text)) return "준동사";
  if (/비교|수량|compar|quantity/.test(text)) return "비교·수량";
  if (/일치|수일치|agreement/.test(text)) return "수일치";
  if (/명사절|간접의문|whether|noun clause/.test(text)) return "명사절";
  if (/분사|participle/.test(text)) return "분사";
  if (/조동사|modal|must|should|could|would/.test(text)) return "조동사";
  if (/품사|형용사|부사|명사|어휘|word form|adjective|adverb/.test(text)) return "품사";
  return "";
}
function buildSpeedQuiz(day) {
  const dayNumber = Number(day?.day || activeDay || 1);
  const focusTexts = [
    ...(day?.practice?.part5 || []).map(item => item.focus),
    ...(day?.grammar || []).flatMap(item => [item.id, item.title])
  ];
  const keys = [];
  for (const text of focusTexts) {
    const key = speedFocusKey(text);
    if (key && !keys.includes(key)) keys.push(key);
    if (keys.length === 4) break;
  }
  let cursor = (dayNumber - 1) % SPEED_FOCUS_ORDER.length;
  while (keys.length < 4) {
    const key = SPEED_FOCUS_ORDER[cursor % SPEED_FOCUS_ORDER.length];
    if (!keys.includes(key)) keys.push(key);
    cursor += 1;
  }
  return keys.slice(0, 4).map((key, index) => {
    const variants = SPEED_QUIZ_BANK[key];
    const item = variants[(dayNumber + index) % variants.length];
    return { ...item, focus: key };
  });
}
function renderSpeedQuiz(day) {
  activeQuestions = new Map();
  const items = buildSpeedQuiz(day);
  currentSpeechText = items.map(item => item.question).join(" ");
  return `
    <section class="review-box"><h3>토익 Part 5 스피드 퀴즈</h3><p><strong>추천 시간: 문제당 15~20초</strong><br>오늘 본문과 문법 포인트에 연결되는 자체 제작 문항 4개를 빠르게 판단합니다. 정답을 고른 뒤 해설로 문법 근거를 확인하세요.</p></section>
    <section class="practice-group"><h3>문법·어휘 빠른 판단 4문제</h3>${items.map((q,i)=>questionHtml(q, `d${day?.day || activeDay}-speed-${i}`, `SPEED ${i+1} · ${q.focus}`)).join("")}</section>`;
}
function renderV2Apply(day) {
  activeQuestions = new Map();
  const p5 = (day.practice?.part5 || []).map((q,i)=>questionHtml(q, `d${day.day}-p5-${i}`, `PART 5 · ${q.focus || "문법·어휘"}`)).join("");
  const p6 = (day.practice?.part6 || []).map((q,i)=>questionHtml(q, `d${day.day}-p6-${i}`, `PART 6 · ${q.type || "문맥"}`)).join("");
  const p7 = (day.practice?.part7 || []).map((q,i)=>questionHtml(q, `d${day.day}-p7-${i}`, `PART 7 · ${q.type || "독해"}`)).join("");
  currentSpeechText = [...(day.practice?.part7 || [])].map(q => q.question).join(" ");
  return `
    <section class="practice-group"><h3>Part 5 · 문법과 어휘 판단</h3>${p5}</section>
    <section class="practice-group"><h3>Part 6 · 문맥과 연결</h3>${p6}</section>
    <section class="practice-group"><h3>Part 7 · 장문 이해와 근거 찾기</h3>${p7}</section>
    <section class="review-box"><h3>최종 재독</h3><p>${escapeHtml(day.review?.rereadInstructionKo)}</p><ul>${(day.review?.selfCheck || []).map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>`;
}

function renderLegacyRead(day) {
  const vocab = getLegacy("vocab", day);
  const expression = getLegacy("expression", day);
  const sentence = getLegacy("sentence", day);
  currentSpeechText = [sentence?.sentence, vocab?.example, expression?.example].filter(Boolean).join(" ");
  return `<div class="migration-note">이 날짜는 기존 100일 콘텐츠를 3단계 구조로 묶어 표시합니다. 장문 V2 콘텐츠로 순차 교체됩니다.</div><div class="legacy-combined">
    <div class="legacy-card"><h3>핵심어휘 · ${escapeHtml(vocab?.title)}</h3><p>${escapeHtml(vocab?.meaning)}</p><p class="example-en">${escapeHtml(vocab?.example)}</p><p>${escapeHtml(vocab?.translation)}</p></div>
    <div class="legacy-card"><h3>숙어·연어 · ${escapeHtml(expression?.title)}</h3><p>${escapeHtml(expression?.meaning)}</p><p class="example-en">${escapeHtml(expression?.example)}</p><p>${escapeHtml(expression?.translation)}</p></div>
    <div class="legacy-card"><h3>문장 읽기</h3><p class="example-en">${escapeHtml(sentence?.sentence)}</p><p>${escapeHtml(sentence?.translation)}</p><p>${escapeHtml(sentence?.chunks)}</p></div>
  </div>`;
}
function renderLegacyAnalyze(day) {
  const item = getLegacy("grammar", day);
  currentSpeechText = item?.example || "";
  return `<div class="migration-note">기존 문법카드를 V2의 분석단계에 통합해 표시합니다.</div><h2 class="grammar-title">${escapeHtml(item?.title)}</h2><div class="rule-box">${escapeHtml(item?.rule)}</div><p class="section-label">CORRECT SENTENCE</p><div class="example-box"><p class="example-en">${escapeHtml(item?.example)}</p></div><div class="trap"><strong>오답 함정</strong><br>${escapeHtml(item?.trap)}</div>`;
}
function renderLegacyApply(day) {
  const item = getLegacy("practice", day);
  activeQuestions = new Map();
  currentSpeechText = item?.question || "";
  return `<div class="migration-note">기존 실전문제를 V2의 적용단계에 통합해 표시합니다.</div><section class="practice-group"><h3>${escapeHtml(item?.part || "PART 5·6·7")}</h3>${item ? questionHtml(item, `legacy-day-${day}`, item.focus || "실전문제") : ""}</section>`;
}

function bindQuizEvents() {
  els.cardContent.querySelectorAll(".quiz-option").forEach(button => {
    button.addEventListener("click", () => {
      const qid = button.dataset.qid;
      const selected = Number(button.dataset.index);
      const item = activeQuestions.get(qid);
      const card = button.closest(".practice-item");
      if (!item || !card || card.dataset.graded === "1") return;
      card.dataset.graded = "1";
      const buttons = [...card.querySelectorAll(".quiz-option")];
      buttons.forEach((b,i) => { b.disabled = true; if (i === item.answer) b.classList.add("correct"); });
      const correct = selected === item.answer;
      if (!correct && buttons[selected]) buttons[selected].classList.add("wrong");
      card.querySelector(".quiz-result").textContent = correct ? "정답입니다." : `오답입니다. 정답은 (${String.fromCharCode(65+item.answer)})입니다.`;
      const evidence = item.evidence ? `<div class="evidence-box"><strong>본문 근거</strong><br>${escapeHtml(item.evidence)}</div>` : "";
      card.querySelector(".question-explanation").innerHTML = `<div class="explanation-box"><strong>해설</strong><br>${escapeHtml(item.explanation)}</div>${evidence}`;
      let wrong = getWrong();
      if (correct) wrong = wrong.filter(id => id !== qid);
      else wrong.push(qid);
      setWrong(wrong);
      updateStats();
    });
  });
}

function render() {
  els.quizArea.hidden = true;
  els.quizArea.innerHTML = "";
  activeQuestions = new Map();
  const v2 = getV2Day(activeDay);
  els.badge.textContent = CATEGORIES[activeCategory].label;
  els.partBadge.textContent = CATEGORIES[activeCategory].part;
  let html = "";
  if (v2) {
    if (activeCategory === "read") html = renderV2Read(v2);
    if (activeCategory === "analyze") html = renderV2Analyze(v2);
    if (activeCategory === "apply") html = renderV2Apply(v2);
    if (activeCategory === "speed") html = renderSpeedQuiz(v2);
  } else {
    if (activeCategory === "read") html = renderLegacyRead(activeDay);
    if (activeCategory === "analyze") html = renderLegacyAnalyze(activeDay);
    if (activeCategory === "apply") html = renderLegacyApply(activeDay);
    if (activeCategory === "speed") html = renderSpeedQuiz({ day: activeDay });
  }
  els.cardContent.innerHTML = html;
  bindQuizEvents();

  els.speakBtn.hidden = !currentSpeechText;
  els.dayLabel.textContent = `DAY ${activeDay}`;
  const currentDayComplete = dayIsComplete(activeDay);
  if (activeDay === autoDay) {
    els.dayHeadline.textContent = v2 ? "장문독해 · 4단계 학습" : "4단계 통합 학습";
    els.dateLabel.textContent = formatKoreanDate(kstDateString());
  } else if (currentDayComplete && activeDay < autoDay) {
    els.dayHeadline.textContent = "학습 완료";
    els.dateLabel.textContent = `다음 학습은 DAY ${autoDay}`;
  } else {
    els.dayHeadline.textContent = "복습 모드";
    els.dateLabel.textContent = `현재 진행일은 DAY ${autoDay}`;
  }

  els.progressNumber.textContent = activeDay;
  els.progressRing.style.setProperty("--progress", `${activeDay}%`);
  els.navDay.textContent = `DAY ${activeDay}`;
  els.prevDayBtn.disabled = activeDay <= 1;
  els.nextDayBtn.disabled = activeDay >= 100;
  document.querySelectorAll(".category").forEach(btn => btn.classList.toggle("active", btn.dataset.category === activeCategory));
  const completed = isCompleted(activeDay, activeCategory);
  els.completeBtn.textContent = completed ? "이 단계 완료됨 ✓" : "이 단계 완료";
  els.completeBtn.classList.toggle("completed", completed);
  updateStats();
  updateUrl();
}

function updateStats() {
  const data = getCompleted();
  const todayDone = categoryOrder.filter(category => data[activeDay]?.includes(category)).length;
  const total = Object.values(data).reduce((sum, arr) => sum + new Set((arr || []).filter(v => categoryOrder.includes(v))).size, 0);
  const fullDays = Object.keys(data).filter(day => dayIsComplete(Number(day), data)).length;
  els.dailyProgressText.textContent = `${todayDone} / ${categoryOrder.length}`;
  els.dailyProgressBar.style.width = `${Math.min(100, todayDone * (100/categoryOrder.length))}%`;
  els.totalCompleted.textContent = total;
  els.completedDays.textContent = fullDays;
  els.wrongCount.textContent = getWrong().length;
}
function initFromUrl() {
  migrateLegacyProgress();
  migrateSpeedProgress();
  autoDay = getAutoDay();
  const params = new URLSearchParams(location.search);
  const category = params.get("category");
  const day = Number(params.get("day"));
  const review = params.get("review") === "1";
  if (review && Number.isInteger(day) && day >= 1 && day <= 100) {
    activeDay = day;
    activeCategory = categoryOrder.includes(category) ? category : firstIncompleteCategory(activeDay);
    return;
  }
  activeDay = autoDay;
  activeCategory = firstIncompleteCategory(activeDay);
}

document.querySelectorAll(".category").forEach(btn => btn.addEventListener("click", () => {
  activeCategory = btn.dataset.category;
  render();
}));
els.prevDayBtn.addEventListener("click", () => {
  if (activeDay > 1) {
    activeDay--;
    activeCategory = firstIncompleteCategory(activeDay);
    render();
    scrollTo({top:0,behavior:"smooth"});
  }
});
els.nextDayBtn.addEventListener("click", () => {
  if (activeDay < 100) {
    activeDay++;
    activeCategory = firstIncompleteCategory(activeDay);
    render();
    scrollTo({top:0,behavior:"smooth"});
  }
});
els.speakBtn.addEventListener("click", () => speak(currentSpeechText));
els.completeBtn.addEventListener("click", () => {
  const wasCompleted = isCompleted(activeDay, activeCategory);
  toggleCompleted(activeDay, activeCategory);
  autoDay = getAutoDay();
  const nowCompleted = isCompleted(activeDay, activeCategory);
  const finishedDay = nowCompleted && dayIsComplete(activeDay);
  render();
  if (finishedDay && !wasCompleted && activeDay < 100) showToast(`DAY ${activeDay} 완료 · 다음 학습은 DAY ${autoDay}입니다.`);
  else if (finishedDay && activeDay === 100) showToast("DAY 100까지 모든 학습을 완료했습니다.");
  else showToast(nowCompleted ? "단계 완료를 기록했습니다." : "완료 기록을 취소했습니다.");
});
els.shareBtn.addEventListener("click", async () => {
  const url = new URL(location.href);
  url.searchParams.set("category", activeCategory);
  url.searchParams.set("day", activeDay);
  url.searchParams.set("review", "1");
  const data = { title: `토익인간 DAY ${activeDay}`, text: `${CATEGORIES[activeCategory].label} · 장문독해 100일 프로젝트`, url: url.toString() };
  try {
    if (navigator.share) await navigator.share(data);
    else { await navigator.clipboard.writeText(url.toString()); showToast("학습 링크를 복사했습니다."); }
  } catch (e) { if (e.name !== "AbortError") showToast("공유하지 못했습니다."); }
});
els.resetBtn.addEventListener("click", () => {
  if (!confirm("학습 진행 기록을 초기화하고 DAY 1부터 다시 시작할까요? 완료 기록과 오답 기록이 삭제됩니다.")) return;
  localStorage.removeItem(COMPLETION_KEY);
  localStorage.removeItem(WRONG_KEY);
  localStorage.removeItem(SPEED_MIGRATION_KEY);
  localStorage.removeItem("toeic100_completed");
  localStorage.removeItem("toeic100_wrong");
  activeDay = autoDay = 1;
  activeCategory = "read";
  render();
  showToast("DAY 1부터 다시 시작합니다.");
});
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  deferredInstallPrompt = e;
  els.installBtn.hidden = false;
});
els.installBtn.addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  els.installBtn.hidden = true;
});
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js?v=20260809-v2").catch(()=>{}));
}
initFromUrl();
render();