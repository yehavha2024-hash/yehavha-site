const LAB_API = '/api/lab';
const LOCAL_KEY = 'nexusLab:lastRun:v1';

const refs = {
  duration: document.getElementById('scenarioDuration'),
  role: document.getElementById('scenarioRole'),
  intro: document.getElementById('simulationIntro'),
  stage: document.getElementById('simulationStage'),
  result: document.getElementById('simulationResult'),
  start: document.getElementById('startButton'),
  restart: document.getElementById('restartButton'),
  retry: document.getElementById('retryButton'),
  copy: document.getElementById('copyResultButton'),
  phase: document.getElementById('phaseLabel'),
  stepTitle: document.getElementById('stepTitle'),
  situation: document.getElementById('situationText'),
  evidence: document.getElementById('evidenceList'),
  choices: document.getElementById('choiceGrid'),
  discovery: document.getElementById('discoveryPanel'),
  discoveryText: document.getElementById('discoveryText'),
  continueButton: document.getElementById('continueButton'),
  score: document.getElementById('scoreValue'),
  metricPanel: document.getElementById('metricPanel'),
  storage: document.getElementById('storageState'),
  resultTitle: document.getElementById('resultTitle'),
  resultMessage: document.getElementById('resultMessage'),
  resultScore: document.getElementById('resultScore')
};

let scenario = null;
let currentNodeId = null;
let pendingNext = null;
let metrics = {};
let score = 0;
let finalScore = 0;
let runId = null;
let choiceLog = [];
let finishedResult = null;

function makeRunId() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return `run-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
}

function snapshot(extra = {}) {
  return {
    runId,
    scenarioId: scenario?.id || '',
    currentNodeId,
    pendingNext,
    metrics,
    score: clamp(score),
    finalScore: clamp(finalScore),
    choices: choiceLog,
    updatedAt: new Date().toISOString(),
    ...extra
  };
}

function saveLocal(extra = {}) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(snapshot(extra)));
  } catch (_) {
    // The simulation remains usable even when browser storage is unavailable.
  }
}

async function apiEvent(eventType, payload = {}) {
  if (!scenario || !runId) return false;
  try {
    const response = await fetch(LAB_API, {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({
        eventType,
        runId,
        scenarioId: scenario.id,
        stepId: payload.stepId || currentNodeId || '',
        choiceId: payload.choiceId || '',
        score: clamp(payload.score ?? score),
        resultCode: payload.resultCode || '',
        state: snapshot(payload.state || {})
      })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    refs.storage.textContent = 'D1 저장 연결됨 · 선택 기록 동기화 중';
    return true;
  } catch (_) {
    refs.storage.textContent = '로컬 실행 중 · 서버 저장 연결을 확인하십시오';
    return false;
  }
}

function renderMetrics() {
  if (!scenario) return;
  refs.metricPanel.replaceChildren();
  Object.entries(scenario.metricLabels).forEach(([key, label]) => {
    const value = clamp(metrics[key]);
    const item = document.createElement('div');
    item.className = 'lab-metric';
    item.innerHTML = `
      <span class="lab-metric-label">${label}</span>
      <span class="lab-metric-value">${value}</span>
      <span class="lab-meter" aria-hidden="true"><span style="width:${value}%"></span></span>
    `;
    refs.metricPanel.append(item);
  });
}

function setView(view) {
  refs.intro.hidden = view !== 'intro';
  refs.stage.hidden = view !== 'stage';
  refs.result.hidden = view !== 'result';
  refs.restart.hidden = view === 'intro';
}

function renderNode(nodeId) {
  const node = scenario?.nodes?.[nodeId];
  if (!node) {
    finishSimulation();
    return;
  }

  currentNodeId = nodeId;
  pendingNext = null;
  refs.phase.textContent = node.phase;
  refs.stepTitle.textContent = node.title;
  refs.situation.textContent = node.situation;
  refs.score.textContent = clamp(score);
  refs.discovery.hidden = true;
  refs.discoveryText.textContent = '';
  refs.evidence.replaceChildren();
  refs.choices.replaceChildren();

  node.evidence.forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    refs.evidence.append(li);
  });

  node.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'lab-choice';
    button.innerHTML = `
      <span class="lab-choice-index">${String(index + 1).padStart(2, '0')}</span>
      <span class="lab-choice-copy"><strong>${option.label}</strong><span>${option.detail}</span></span>
    `;
    button.addEventListener('click', () => chooseOption(node, option, button));
    refs.choices.append(button);
  });

  renderMetrics();
  saveLocal({status: 'running'});
}

function chooseOption(node, option, selectedButton) {
  const buttons = [...refs.choices.querySelectorAll('.lab-choice')];
  if (buttons.some(button => button.disabled)) return;

  buttons.forEach(button => {
    button.disabled = true;
    if (button === selectedButton) button.classList.add('lab-choice-selected');
  });

  Object.entries(option.effects || {}).forEach(([key, delta]) => {
    metrics[key] = clamp((metrics[key] || 0) + Number(delta || 0));
  });

  score = clamp(score + Number(option.score || 0));
  pendingNext = option.next || null;
  choiceLog.push({
    stepId: currentNodeId,
    choiceId: option.id,
    label: option.label,
    scoreAfter: score,
    at: new Date().toISOString()
  });

  refs.score.textContent = score;
  refs.discoveryText.textContent = (option.facts || []).join(' ');
  refs.discovery.hidden = false;
  refs.continueButton.textContent = pendingNext ? '다음 단계' : '결과 확인';
  renderMetrics();
  saveLocal({status: 'choice-recorded'});
  void apiEvent('choice', {stepId: currentNodeId, choiceId: option.id});
  refs.discovery.scrollIntoView({behavior: 'smooth', block: 'nearest'});
}

function calculateFinalScore() {
  const metricKeys = Object.keys(scenario?.metricLabels || {});
  const metricAverage = metricKeys.length
    ? metricKeys.reduce((sum, key) => sum + clamp(metrics[key]), 0) / metricKeys.length
    : 0;
  const escalationPenalty = choiceLog.some(item => item.stepId === 'escalation') ? 12 : 0;
  return clamp((clamp(score) * 0.55) + (metricAverage * 0.45) - escalationPenalty);
}

function pickResult(resultScore) {
  return scenario.results.find(item => resultScore >= item.min) || scenario.results.at(-1);
}

function finishSimulation() {
  finalScore = calculateFinalScore();
  finishedResult = pickResult(finalScore);
  refs.resultTitle.textContent = finishedResult.title;
  refs.resultMessage.textContent = finishedResult.message;
  refs.resultScore.textContent = `${finalScore} / 100`;
  setView('result');
  saveLocal({
    status: 'completed',
    resultCode: finishedResult.code,
    decisionScore: clamp(score),
    finalScore
  });
  void apiEvent('complete', {
    score: finalScore,
    resultCode: finishedResult.code,
    state: {status: 'completed', decisionScore: clamp(score), finalScore}
  });
}

function startSimulation() {
  runId = makeRunId();
  currentNodeId = scenario.startNode;
  pendingNext = null;
  metrics = {...scenario.initialMetrics};
  score = 0;
  finalScore = 0;
  choiceLog = [];
  finishedResult = null;
  refs.storage.textContent = '훈련 기록 연결 중';
  setView('stage');
  renderNode(currentNodeId);
  void apiEvent('start', {stepId: currentNodeId});
}

function restartSimulation() {
  if (!scenario) return;
  startSimulation();
  document.getElementById('simulation')?.scrollIntoView({behavior: 'smooth', block: 'start'});
}

function buildResultText() {
  if (!scenario || !finishedResult) return '';
  const metricsText = Object.entries(scenario.metricLabels)
    .map(([key, label]) => `${label} ${clamp(metrics[key])}`)
    .join(' · ');
  const pathText = choiceLog.map((item, index) => `${index + 1}. ${item.label}`).join('\n');
  return `${scenario.title}\n${finishedResult.title} · ${finalScore}/100\n${metricsText}\n\n선택 경로\n${pathText}`;
}

async function copyResult() {
  const text = buildResultText();
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    refs.copy.textContent = '복사 완료';
    setTimeout(() => { refs.copy.textContent = '결과 요약 복사'; }, 1400);
  } catch (_) {
    refs.copy.textContent = '복사 실패';
  }
}

async function loadScenario() {
  try {
    const response = await fetch('./scenarios.json', {cache: 'no-store'});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    scenario = data.scenarios?.[0] || null;
    if (!scenario) throw new Error('scenario_missing');

    refs.duration.textContent = `${scenario.durationMinutes}분 훈련`;
    refs.role.textContent = scenario.role;
    metrics = {...scenario.initialMetrics};
    renderMetrics();
    refs.storage.textContent = '시나리오 준비 완료 · 시작 시 D1 기록 연결';
  } catch (_) {
    refs.storage.textContent = '시나리오를 불러오지 못했습니다';
    refs.start.disabled = true;
  }
}

refs.start.addEventListener('click', startSimulation);
refs.restart.addEventListener('click', restartSimulation);
refs.retry.addEventListener('click', restartSimulation);
refs.copy.addEventListener('click', copyResult);
refs.continueButton.addEventListener('click', () => {
  if (pendingNext) renderNode(pendingNext);
  else finishSimulation();
});

void loadScenario();
