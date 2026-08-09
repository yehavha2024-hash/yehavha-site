const CATEGORIES = {
  read: { label: "장문읽기", part: "LONG READING" },
  analyze: { label: "해부·학습", part: "VOCAB · GRAMMAR · STRUCTURE" },
  apply: { label: "문제·복습", part: "PART 5 · 6 · 7" }
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

function questionHtml(item, qid, label) {
  activeQuestions.set(qid, item);
  return `<div class="practice-item" data-question="${escapeHtml(qid)}"><span class="practice-label">${escapeHtml(label)}</span><p class="question">${escapeHtml(item.question)}</p><div class="quiz-options">${(item.options || []).map((o,i)=>`<button class="quiz-option" data-qid="${escapeHtml(qid)}" data-index="${i}"><strong>(${String.fromCharCode(65+i)})</strong> ${escapeHtml(o)}</button>`).join("")}</div><p class="quiz-result">정답을 선택하세요.</p><div class="question-explanation"></div></div>`;
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
  } else {
    if (activeCategory === "read") html = renderLegacyRead(activeDay);
    if (activeCategory === "analyze") html = renderLegacyAnalyze(activeDay);
    if (activeCategory === "apply") html = renderLegacyApply(activeDay);
  }
  els.cardContent.innerHTML = html;
  bindQuizEvents();

  els.speakBtn.hidden = !currentSpeechText;
  els.dayLabel.textContent = `DAY ${activeDay}`;
  const currentDayComplete = dayIsComplete(activeDay);
  if (activeDay === autoDay) {
    els.dayHeadline.textContent = v2 ? "장문독해 · 3단계 학습" : "3단계 통합 학습";
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
  els.dailyProgressText.textContent = `${todayDone} / 3`;
  els.dailyProgressBar.style.width = `${Math.min(100, todayDone * (100/3))}%`;
  els.totalCompleted.textContent = total;
  els.completedDays.textContent = fullDays;
  els.wrongCount.textContent = getWrong().length;
}
function initFromUrl() {
  migrateLegacyProgress();
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
