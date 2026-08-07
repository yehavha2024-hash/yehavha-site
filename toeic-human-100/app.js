const CATEGORIES = {
  vocab: { label: "핵심어휘", part: "800+ CORE" },
  expression: { label: "숙어·연어", part: "COLLOCATION" },
  sentence: { label: "문장암기", part: "SHADOWING" },
  grammar: { label: "문법함정", part: "READING KEY" },
  practice: { label: "실전문제", part: "PART 5·6·7" }
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
let activeCategory = "vocab";
let activeDay = 1;
let autoDay = 1;
let deferredInstallPrompt = null;
let currentSpeechText = "";

function kstDateString(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}
function formatKoreanDate(dateString) {
  const [y,m,d] = dateString.split("-").map(Number);
  return `${y}년 ${m}월 ${d}일`;
}
function dayDiff(start, end) {
  const a = Date.parse(`${start}T00:00:00+09:00`);
  const b = Date.parse(`${end}T00:00:00+09:00`);
  return Math.floor((b-a)/86400000);
}
function getStartDate() {
  let start = localStorage.getItem("toeic100_start_date");
  if (!start) { start = kstDateString(); localStorage.setItem("toeic100_start_date", start); }
  return start;
}
function getAutoDay() { return Math.min(100, Math.max(1, dayDiff(getStartDate(), kstDateString()) + 1)); }
function getCompleted() { try { return JSON.parse(localStorage.getItem("toeic100_completed") || "{}"); } catch { return {}; } }
function setCompleted(data) { localStorage.setItem("toeic100_completed", JSON.stringify(data)); }
function getWrong() { try { return JSON.parse(localStorage.getItem("toeic100_wrong") || "[]"); } catch { return []; } }
function setWrong(data) { localStorage.setItem("toeic100_wrong", JSON.stringify([...new Set(data)].sort((a,b)=>a-b))); }
function isCompleted(day, category) { return Boolean(getCompleted()[day]?.includes(category)); }
function toggleCompleted(day, category) {
  const data = getCompleted();
  data[day] ||= [];
  if (data[day].includes(category)) data[day] = data[day].filter(x => x !== category);
  else data[day].push(category);
  setCompleted(data);
}
function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
}
function showToast(message) {
  els.toast.textContent = message; els.toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => els.toast.classList.remove("show"), 2100);
}
function updateUrl({ share = false } = {}) {
  const url = new URL(location.href);
  url.searchParams.set("category", activeCategory);
  if (share || activeDay !== autoDay) url.searchParams.set("day", activeDay);
  else url.searchParams.delete("day");
  history.replaceState({}, "", url);
}
function speak(text) {
  if (!("speechSynthesis" in window)) return showToast("이 브라우저에서는 음성 재생을 지원하지 않습니다.");
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US"; utterance.rate = .82; utterance.pitch = 1;
  const voices = speechSynthesis.getVoices();
  const preferred = voices.find(v => /en-US/i.test(v.lang)) || voices.find(v => /^en/i.test(v.lang));
  if (preferred) utterance.voice = preferred;
  speechSynthesis.speak(utterance);
}
function renderVocab(item) {
  currentSpeechText = item.example;
  return `<h2 class="word-title">${escapeHtml(item.title)}</h2><span class="word-pos">${escapeHtml(item.pos)}</span>
    <p class="meaning">${escapeHtml(item.meaning)}</p>
    <p class="section-label">TOEIC EXAMPLE</p><div class="example-box"><p class="example-en">${escapeHtml(item.example)}</p><p class="example-ko">${escapeHtml(item.translation)}</p></div>
    <div class="tip-box"><strong>800+ 포인트</strong><br>${escapeHtml(item.tip || "문장 안에서 의미와 결합을 함께 기억하세요.")}</div>`;
}
function renderExpression(item) {
  currentSpeechText = item.example;
  return `<h2 class="word-title expression-title">${escapeHtml(item.title)}</h2><p class="meaning">${escapeHtml(item.meaning)}</p>
    <p class="section-label">BUSINESS CONTEXT</p><div class="example-box"><p class="example-en">${escapeHtml(item.example)}</p><p class="example-ko">${escapeHtml(item.translation)}</p></div>
    <div class="tip-box"><strong>전치사·결합 주의</strong><br>${escapeHtml(item.tip)}</div>`;
}
function renderSentence(item) {
  currentSpeechText = item.sentence;
  return `<p class="sentence-title">오늘 반드시 통째로 외울 문장</p><p class="sentence-main">${escapeHtml(item.sentence)}</p>
    <p class="section-label">CHUNK READING</p><div class="chunk-box">${escapeHtml(item.chunks)}</div>
    <p class="section-label">MEANING</p><div class="example-box"><p class="example-ko">${escapeHtml(item.translation)}</p></div>
    <div class="tip-box"><strong>암기 미션</strong><br>${escapeHtml(item.mission)}</div>`;
}
function renderGrammar(item) {
  currentSpeechText = item.example;
  return `<h2 class="grammar-title">${escapeHtml(item.title)}</h2><div class="rule-box">${escapeHtml(item.rule)}</div>
    <p class="section-label">CORRECT SENTENCE</p><div class="example-box"><p class="example-en">${escapeHtml(item.example)}</p></div>
    <div class="trap"><strong>오답 함정</strong><br>${escapeHtml(item.trap)}</div>`;
}
function renderPractice(item) {
  currentSpeechText = item.question.replace("_____", "blank");
  els.quizArea.hidden = false;
  els.quizArea.innerHTML = `<p class="question">${escapeHtml(item.question)}</p><div class="quiz-options">${item.options.map((o,i)=>`<button class="quiz-option" data-index="${i}"><strong>(${String.fromCharCode(65+i)})</strong> ${escapeHtml(o)}</button>`).join("")}</div><p class="quiz-result" id="quizResult">정답을 선택하세요.</p><div id="quizExplanation"></div>`;
  els.quizArea.querySelectorAll(".quiz-option").forEach(btn => btn.addEventListener("click", () => gradeQuestion(item, Number(btn.dataset.index))));
  return `<h2 class="grammar-title">${escapeHtml(item.title)}</h2><div class="rule-box">목표 영역: ${escapeHtml(item.focus)}<br>시간 목표: Part 5는 20초 이내</div>`;
}
function gradeQuestion(item, selected) {
  const buttons = [...els.quizArea.querySelectorAll(".quiz-option")];
  if (buttons.some(b => b.disabled)) return;
  buttons.forEach((b,i) => { b.disabled = true; if (i === item.answer) b.classList.add("correct"); });
  const correct = selected === item.answer;
  if (!correct) buttons[selected].classList.add("wrong");
  $("quizResult").textContent = correct ? "정답입니다." : `오답입니다. 정답은 (${String.fromCharCode(65+item.answer)})입니다.`;
  $("quizExplanation").innerHTML = `<div class="explanation-box"><strong>해설</strong><br>${escapeHtml(item.explanation)}</div>`;
  let wrong = getWrong();
  if (correct) wrong = wrong.filter(d => d !== activeDay); else wrong.push(activeDay);
  setWrong(wrong); updateStats();
}
function render() {
  const item = TOEIC_CONTENT[activeCategory][activeDay-1];
  els.quizArea.hidden = true; els.quizArea.innerHTML = "";
  els.badge.textContent = CATEGORIES[activeCategory].label;
  els.partBadge.textContent = activeCategory === "practice" ? item.part : CATEGORIES[activeCategory].part;
  let html = "";
  if (activeCategory === "vocab") html = renderVocab(item);
  if (activeCategory === "expression") html = renderExpression(item);
  if (activeCategory === "sentence") html = renderSentence(item);
  if (activeCategory === "grammar") html = renderGrammar(item);
  if (activeCategory === "practice") html = renderPractice(item);
  els.cardContent.innerHTML = html;
  els.speakBtn.hidden = activeCategory === "grammar" ? false : false;
  els.dayLabel.textContent = `DAY ${activeDay}`;
  els.dayHeadline.textContent = activeDay === autoDay ? "오늘의 5개 학습" : "복습 모드";
  els.dateLabel.textContent = activeDay === autoDay ? formatKoreanDate(kstDateString()) : `자동 진행일은 DAY ${autoDay}`;
  els.progressNumber.textContent = activeDay;
  els.progressRing.style.setProperty("--progress", `${activeDay}%`);
  els.navDay.textContent = `DAY ${activeDay}`;
  els.prevDayBtn.disabled = activeDay <= 1;
  els.nextDayBtn.disabled = activeDay >= 100;
  document.querySelectorAll(".category").forEach(btn => btn.classList.toggle("active", btn.dataset.category === activeCategory));
  const completed = isCompleted(activeDay, activeCategory);
  els.completeBtn.textContent = completed ? "학습 완료됨 ✓" : "오늘 학습 완료";
  els.completeBtn.classList.toggle("completed", completed);
  updateStats(); updateUrl();
}
function updateStats() {
  const data = getCompleted();
  const todayDone = data[activeDay]?.length || 0;
  const total = Object.values(data).reduce((sum, arr) => sum + new Set(arr).size, 0);
  const fullDays = Object.values(data).filter(arr => new Set(arr).size >= 5).length;
  els.dailyProgressText.textContent = `${todayDone} / 5`;
  els.dailyProgressBar.style.width = `${todayDone*20}%`;
  els.totalCompleted.textContent = total;
  els.completedDays.textContent = fullDays;
  els.wrongCount.textContent = getWrong().length;
}
function initFromUrl() {
  autoDay = getAutoDay();
  const params = new URLSearchParams(location.search);
  const category = params.get("category");
  const day = Number(params.get("day"));
  if (categoryOrder.includes(category)) activeCategory = category;
  activeDay = Number.isInteger(day) && day >= 1 && day <= 100 ? day : autoDay;
}
document.querySelectorAll(".category").forEach(btn => btn.addEventListener("click", () => { activeCategory = btn.dataset.category; render(); }));
els.prevDayBtn.addEventListener("click", () => { if (activeDay > 1) { activeDay--; render(); scrollTo({top:0,behavior:"smooth"}); } });
els.nextDayBtn.addEventListener("click", () => { if (activeDay < 100) { activeDay++; render(); scrollTo({top:0,behavior:"smooth"}); } });
els.speakBtn.addEventListener("click", () => speak(currentSpeechText));
els.completeBtn.addEventListener("click", () => { toggleCompleted(activeDay, activeCategory); render(); showToast(isCompleted(activeDay, activeCategory) ? "학습 완료를 기록했습니다." : "완료 기록을 취소했습니다."); });
els.shareBtn.addEventListener("click", async () => {
  const url = new URL(location.href); url.searchParams.set("category", activeCategory); url.searchParams.set("day", activeDay);
  const data = { title: `토익인간 DAY ${activeDay}`, text: `${CATEGORIES[activeCategory].label} · 토익인간 100일 프로젝트`, url: url.toString() };
  try { if (navigator.share) await navigator.share(data); else { await navigator.clipboard.writeText(url); showToast("학습 링크를 복사했습니다."); } } catch (e) { if (e.name !== "AbortError") showToast("공유하지 못했습니다."); }
});
els.resetBtn.addEventListener("click", () => {
  if (!confirm("오늘을 DAY 1로 다시 설정할까요? 기존 완료 기록과 오답 기록도 삭제됩니다.")) return;
  localStorage.setItem("toeic100_start_date", kstDateString());
  localStorage.removeItem("toeic100_completed"); localStorage.removeItem("toeic100_wrong");
  activeDay = autoDay = 1; render(); showToast("오늘을 DAY 1로 설정했습니다.");
});
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferredInstallPrompt = e; els.installBtn.hidden = false; });
els.installBtn.addEventListener("click", async () => { if (!deferredInstallPrompt) return; deferredInstallPrompt.prompt(); await deferredInstallPrompt.userChoice; deferredInstallPrompt = null; els.installBtn.hidden = true; });
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(()=>{}));
initFromUrl(); render();
