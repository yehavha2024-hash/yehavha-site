const LAB_API = '/api/lab';
const LAST_KEY = 'nexusLab:lastRun:v2';
const HISTORY_KEY = 'nexusLab:runs:v2';
const DOCS_KEY = 'nexusLab:builders:v1';
const CUSTOM_SCENARIOS_KEY = 'nexusLab:customScenarios:v1';

const refs = {
  duration: document.getElementById('scenarioDuration'),
  role: document.getElementById('scenarioRole'),
  category: document.getElementById('scenarioCategory'),
  select: document.getElementById('scenarioSelect'),
  caseLabel: document.getElementById('scenarioCaseLabel'),
  scenarioTitle: document.getElementById('scenarioTitle'),
  scenarioSubtitle: document.getElementById('scenarioSubtitle'),
  library: document.getElementById('scenarioLibraryGrid'),
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
  resultScore: document.getElementById('resultScore'),
  compareA: document.getElementById('compareA'),
  compareB: document.getElementById('compareB'),
  compareButton: document.getElementById('compareButton'),
  compareView: document.getElementById('compareView'),
  historyList: document.getElementById('historyList'),
  builderForm: document.getElementById('builderForm'),
  builderTemplate: document.getElementById('builderTemplate'),
  builderPurpose: document.getElementById('builderPurpose'),
  builderContext: document.getElementById('builderContext'),
  builderConstraints: document.getElementById('builderConstraints'),
  builderCriteria: document.getElementById('builderCriteria'),
  builderAction: document.getElementById('builderAction'),
  builderOutput: document.getElementById('builderOutput'),
  saveBuilder: document.getElementById('saveBuilderButton'),
  copyBuilder: document.getElementById('copyBuilderButton'),
  modelControls: document.getElementById('modelControls'),
  modelRisk: document.getElementById('modelRisk'),
  responsibilityGrid: document.getElementById('responsibilityGrid'),
  modelNote: document.getElementById('modelNote'),
  workspaceStats: document.getElementById('workspaceStats'),
  workspaceRuns: document.getElementById('workspaceRuns'),
  workspaceDocs: document.getElementById('workspaceDocs'),
  workspaceScenarios: document.getElementById('workspaceScenarios'),
  studioForm: document.getElementById('studioForm'),
  studioTitle: document.getElementById('studioTitleInput'),
  studioRole: document.getElementById('studioRole'),
  studioSituation: document.getElementById('studioSituation'),
  studioChoice1: document.getElementById('studioChoice1'),
  studioChoice2: document.getElementById('studioChoice2'),
  studioChoice3: document.getElementById('studioChoice3'),
  saveScenario: document.getElementById('saveScenarioButton'),
  publicRuns: document.getElementById('publicRuns'),
  publicCompletions: document.getElementById('publicCompletions'),
  publicAverage: document.getElementById('publicAverage'),
  exportLab: document.getElementById('exportLabButton'),
  importLab: document.getElementById('importLabInput'),
  clearWorkspace: document.getElementById('clearWorkspaceButton'),
  operationStatus: document.getElementById('operationStatus')
};

let builtInScenarios = [];
let scenario = null;
let currentNodeId = null;
let pendingNext = null;
let metrics = {};
let score = 0;
let decisionPossible = 0;
let scoredNodes = new Set();
let finalScore = 0;
let runId = null;
let choiceLog = [];
let finishedResult = null;
let builderText = '';
let studioDraft = null;

const BUILDER_TEMPLATES = {
  'ai-adoption': {title:'AI 도입 검토서',checks:['업무범위와 자동화 대상','데이터·개인정보 처리','사람의 승인·개입 지점','공급자·로그·장애대응','파일럿 성과지표와 중단조건']},
  incident: {title:'사고 대응 보고서',checks:['사고 인지시점과 영향범위','즉시 통제조치','증거·로그 보전','역할·보고·대외소통','복구조건과 재발방지']},
  contract: {title:'계약 위험 검토표',checks:['업무·산출물 범위','데이터 처리와 보안','책임·면책·협조의무','변경관리·검수기준','종료·이관·기록 보존']},
  decision: {title:'의사결정 메모',checks:['문제 정의','확인된 사실과 미확인 사항','대안별 효과·비용·위험','판단기준과 우선순위','결정·실행·재검토 시점']}
};

function make(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}
function readLocal(key, fallback) {
  try { const parsed = JSON.parse(localStorage.getItem(key) || ''); return parsed ?? fallback; }
  catch (_) { return fallback; }
}
function writeLocal(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch (_) { return false; }
}
function clamp(value) { return Math.max(0, Math.min(100, Math.round(Number(value) || 0))); }
function makeRunId() { return globalThis.crypto?.randomUUID ? crypto.randomUUID() : `run-${Date.now()}-${Math.random().toString(16).slice(2)}`; }
function allScenarios() {
  const custom = readLocal(CUSTOM_SCENARIOS_KEY, []);
  const used = new Set();
  return [...builtInScenarios, ...custom].filter(item => {
    if (!item?.id || used.has(item.id)) return false;
    used.add(item.id); return true;
  });
}
function isScenarioValid(item) {
  if (!item || typeof item !== 'object') return false;
  if (!item.id || !item.title || !item.startNode || !item.nodes || !item.nodes[item.startNode]) return false;
  if (!item.metricLabels || !item.initialMetrics || !Array.isArray(item.results)) return false;
  return Object.values(item.nodes).every(node => Array.isArray(node?.options) && node.options.length > 0);
}
function currentDecisionPercent() { return decisionPossible > 0 ? clamp((score / decisionPossible) * 100) : 0; }
function snapshot(extra = {}) {
  return {runId,scenarioId:scenario?.id || '',currentNodeId,pendingNext,metrics,score:clamp(score),decisionPossible,finalScore:clamp(finalScore),choices:choiceLog,updatedAt:new Date().toISOString(),...extra};
}
function saveLast(extra = {}) { writeLocal(LAST_KEY, snapshot(extra)); }

async function apiEvent(eventType, payload = {}) {
  if (!scenario || !runId) return false;
  try {
    const response = await fetch(LAB_API,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({eventType,runId,scenarioId:scenario.id,stepId:payload.stepId || currentNodeId || '',choiceId:payload.choiceId || '',score:clamp(payload.score ?? finalScore ?? score),resultCode:payload.resultCode || '',state:snapshot(payload.state || {})})});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    refs.storage.textContent = 'D1 기록 연결됨 · 브라우저 작업공간에도 저장';
    return true;
  } catch (_) {
    refs.storage.textContent = '브라우저 작업공간에 저장됨 · 서버 기록 연결 확인 필요';
    return false;
  }
}

function renderMetrics() {
  if (!scenario) return;
  refs.metricPanel.replaceChildren();
  Object.entries(scenario.metricLabels).forEach(([key,label]) => {
    const value = clamp(metrics[key]);
    const item = make('div','lab-metric');
    const meter = make('span','lab-meter'); meter.setAttribute('aria-hidden','true');
    const bar = make('span'); bar.style.width = `${value}%`; meter.append(bar);
    item.append(make('span','lab-metric-label',label),make('span','lab-metric-value',String(value)),meter);
    refs.metricPanel.append(item);
  });
}
function setView(view) {
  refs.intro.hidden = view !== 'intro';
  refs.stage.hidden = view !== 'stage';
  refs.result.hidden = view !== 'result';
  refs.restart.hidden = view === 'intro';
}
function renderScenarioMeta() {
  if (!scenario) return;
  const list = allScenarios();
  const index = Math.max(0,list.findIndex(item => item.id === scenario.id));
  refs.duration.textContent = `${scenario.durationMinutes || 10}분 훈련`;
  refs.role.textContent = scenario.role || '의사결정 책임자';
  refs.category.textContent = scenario.category || '업무 판단';
  refs.caseLabel.textContent = `SCENARIO ${String(index + 1).padStart(2,'0')} · ${scenario.category || 'DECISION'}`;
  refs.scenarioTitle.textContent = scenario.title;
  refs.scenarioSubtitle.textContent = scenario.subtitle || '';
}
function prepareScenario(id,{scroll=false}={}) {
  const next = allScenarios().find(item => item.id === id);
  if (!next || !isScenarioValid(next)) return;
  scenario = next; refs.select.value = scenario.id;
  metrics = {...scenario.initialMetrics}; score = 0; decisionPossible = 0; scoredNodes = new Set(); finalScore = 0; choiceLog = []; finishedResult = null; currentNodeId = scenario.startNode; pendingNext = null;
  renderScenarioMeta(); renderMetrics(); setView('intro'); refs.score.textContent = '0'; refs.storage.textContent = '시나리오 준비 완료 · 시작하면 실행기록이 저장됩니다';
  if (scroll) document.getElementById('simulation')?.scrollIntoView({behavior:'smooth',block:'start'});
}
function renderNode(nodeId) {
  const node = scenario?.nodes?.[nodeId];
  if (!node) { finishSimulation(); return; }
  currentNodeId = nodeId; pendingNext = null;
  if (!scoredNodes.has(nodeId)) { decisionPossible += Math.max(...node.options.map(option => Number(option.score) || 0),0); scoredNodes.add(nodeId); }
  refs.phase.textContent = node.phase || ''; refs.stepTitle.textContent = node.title || ''; refs.situation.textContent = node.situation || ''; refs.score.textContent = String(currentDecisionPercent());
  refs.discovery.hidden = true; refs.discoveryText.textContent = ''; refs.evidence.replaceChildren(); refs.choices.replaceChildren();
  (node.evidence || []).forEach(text => refs.evidence.append(make('li','',text)));
  node.options.forEach((option,index) => {
    const button = make('button','lab-choice'); button.type = 'button';
    const copy = make('span','lab-choice-copy'); copy.append(make('strong','',option.label || `선택 ${index+1}`),make('span','',option.detail || ''));
    button.append(make('span','lab-choice-index',String(index+1).padStart(2,'0')),copy);
    button.addEventListener('click',() => chooseOption(node,option,button)); refs.choices.append(button);
  });
  renderMetrics(); saveLast({status:'running'});
}
function chooseOption(node,option,selectedButton) {
  const buttons = [...refs.choices.querySelectorAll('.lab-choice')]; if (buttons.some(button => button.disabled)) return;
  buttons.forEach(button => { button.disabled = true; if (button === selectedButton) button.classList.add('lab-choice-selected'); });
  Object.entries(option.effects || {}).forEach(([key,delta]) => { metrics[key] = clamp((metrics[key] || 0) + Number(delta || 0)); });
  score += Number(option.score || 0); pendingNext = option.next || null;
  choiceLog.push({stepId:currentNodeId,choiceId:option.id || '',label:option.label || '',scoreAfter:currentDecisionPercent(),at:new Date().toISOString()});
  refs.score.textContent = String(currentDecisionPercent()); refs.discoveryText.textContent = (option.facts || []).join(' '); refs.discovery.hidden = false; refs.continueButton.textContent = pendingNext ? '다음 단계' : '결과 확인';
  renderMetrics(); saveLast({status:'choice-recorded'}); void apiEvent('choice',{stepId:currentNodeId,choiceId:option.id || ''}); refs.discovery.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function calculateFinalScore() {
  const metricKeys = Object.keys(scenario?.metricLabels || {});
  const metricAverage = metricKeys.length ? metricKeys.reduce((sum,key) => sum + clamp(metrics[key]),0) / metricKeys.length : 0;
  return clamp((currentDecisionPercent() * .55) + (metricAverage * .45));
}
function pickResult(resultScore) {
  const sorted = [...(scenario?.results || [])].sort((a,b) => Number(b.min || 0) - Number(a.min || 0));
  return sorted.find(item => resultScore >= Number(item.min || 0)) || sorted.at(-1) || {code:'complete',title:'훈련 완료',message:'선택 결과가 저장되었습니다.'};
}
function addRunHistory() {
  const history = readLocal(HISTORY_KEY,[]);
  history.unshift({id:runId,scenarioId:scenario.id,scenarioTitle:scenario.title,category:scenario.category || '',completedAt:new Date().toISOString(),finalScore,resultCode:finishedResult?.code || '',resultTitle:finishedResult?.title || '',metrics:{...metrics},metricLabels:{...scenario.metricLabels},choices:choiceLog.map(item => ({...item}))});
  writeLocal(HISTORY_KEY,history.slice(0,40));
}
function finishSimulation() {
  finalScore = calculateFinalScore(); finishedResult = pickResult(finalScore);
  refs.resultTitle.textContent = finishedResult.title; refs.resultMessage.textContent = finishedResult.message; refs.resultScore.textContent = `${finalScore} / 100`; setView('result');
  saveLast({status:'completed',resultCode:finishedResult.code,decisionScore:currentDecisionPercent(),finalScore}); addRunHistory(); renderHistoryAndCompare(); renderWorkspace();
  void apiEvent('complete',{score:finalScore,resultCode:finishedResult.code,state:{status:'completed',decisionScore:currentDecisionPercent(),finalScore}});
}
function startSimulation() {
  if (!scenario) return; runId = makeRunId(); currentNodeId = scenario.startNode; pendingNext = null; metrics = {...scenario.initialMetrics}; score = 0; decisionPossible = 0; scoredNodes = new Set(); finalScore = 0; choiceLog = []; finishedResult = null;
  refs.storage.textContent = '훈련 기록 연결 중'; setView('stage'); renderNode(currentNodeId); void apiEvent('start',{stepId:currentNodeId});
}
function restartSimulation() { if (!scenario) return; startSimulation(); document.getElementById('simulation')?.scrollIntoView({behavior:'smooth',block:'start'}); }
function buildResultText() {
  if (!scenario || !finishedResult) return '';
  const metricsText = Object.entries(scenario.metricLabels).map(([key,label]) => `${label} ${clamp(metrics[key])}`).join(' · ');
  const pathText = choiceLog.map((item,index) => `${index+1}. ${item.label}`).join('\n');
  return `${scenario.title}\n${finishedResult.title} · ${finalScore}/100\n${metricsText}\n\n선택 경로\n${pathText}`;
}
async function copyText(text,button,originalLabel) {
  if (!text) return;
  try { await navigator.clipboard.writeText(text); if (button) { button.textContent = '복사 완료'; setTimeout(() => {button.textContent = originalLabel;},1200); } }
  catch (_) { if (button) button.textContent = '복사 실패'; }
}

function renderScenarioControls() {
  const list = allScenarios(); refs.select.replaceChildren();
  list.forEach(item => { const option = make('option','',`${item.category || '업무 판단'} · ${item.title}`); option.value = item.id; refs.select.append(option); });
  refs.library.replaceChildren(); const customIds = new Set(readLocal(CUSTOM_SCENARIOS_KEY,[]).map(item => item.id));
  list.forEach((item,index) => {
    const card = make('article','lab-library-card'); const top = make('div','lab-library-top');
    top.append(make('span','lab-library-number',String(index+1).padStart(2,'0')),make('h3','',item.title),make('span','lab-library-category',customIds.has(item.id) ? '직접 제작' : (item.category || '업무 판단')));
    card.append(top,make('p','',item.subtitle || ''));
    const footer = make('div','lab-library-footer');
    const meta = make('div','lab-library-meta'); meta.append(make('span','',`${item.durationMinutes || 10}분`),make('span','',item.role || '의사결정 책임자'),make('span','',`${Object.keys(item.nodes || {}).length}단계`));
    const button = make('button','lab-secondary-button','이 시나리오 실행'); button.type = 'button'; button.addEventListener('click',() => prepareScenario(item.id,{scroll:true}));
    footer.append(meta,button); card.append(footer); refs.library.append(card);
  });
  if (!scenario && list[0]) scenario = list[0]; if (scenario) prepareScenario(scenario.id);
}
function formatWhen(value) {
  if (!value) return ''; try { return new Intl.DateTimeFormat('ko-KR',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(value)); } catch (_) { return ''; }
}
function runLabel(run) { return `${run.scenarioTitle} · ${run.finalScore}점 · ${formatWhen(run.completedAt)}`; }
function renderHistoryAndCompare() {
  const history = readLocal(HISTORY_KEY,[]); refs.compareA.replaceChildren(); refs.compareB.replaceChildren();
  history.forEach((run,index) => { const a = make('option','',runLabel(run)); const b = make('option','',runLabel(run)); a.value = run.id; b.value = run.id; refs.compareA.append(a); refs.compareB.append(b); if (index === 0) refs.compareA.value = run.id; if (index === 1) refs.compareB.value = run.id; });
  refs.compareButton.disabled = history.length < 2; refs.historyList.replaceChildren();
  if (!history.length) refs.historyList.append(make('p','lab-empty','완료된 시뮬레이션이 아직 없습니다.'));
  else history.slice(0,8).forEach(run => { const row = make('div','lab-history-row'); const copy = make('div'); copy.append(make('strong','',run.scenarioTitle),make('span','',`${run.resultTitle} · ${formatWhen(run.completedAt)}`)); row.append(copy,make('b','',`${run.finalScore}`)); refs.historyList.append(row); });
  if (history.length >= 2) renderComparison(); else refs.compareView.replaceChildren(make('p','lab-empty','완료된 실행이 2개 이상이면 비교할 수 있습니다.'));
}
function renderComparison() {
  const history = readLocal(HISTORY_KEY,[]); const a = history.find(run => run.id === refs.compareA.value); const b = history.find(run => run.id === refs.compareB.value); refs.compareView.replaceChildren();
  if (!a || !b) { refs.compareView.append(make('p','lab-empty','비교할 두 실행을 선택하십시오.')); return; }
  const scoreA = make('div','lab-compare-score'); scoreA.append(make('div','',`A · ${a.scenarioTitle}`),make('strong','',`${a.finalScore}점`),make('span','',`${b.finalScore-a.finalScore >= 0 ? '+' : ''}${b.finalScore-a.finalScore} → B`));
  const scoreB = make('div','lab-compare-score'); scoreB.append(make('div','',`B · ${b.scenarioTitle}`),make('strong','',`${b.finalScore}점`),make('span','',b.resultTitle || ''));
  const metricsBlock = make('div','lab-compare-metrics'); const keys = [...new Set([...Object.keys(a.metrics || {}),...Object.keys(b.metrics || {})])];
  keys.forEach(key => { const label = b.metricLabels?.[key] || a.metricLabels?.[key] || key; const av = Number(a.metrics?.[key] ?? 0); const bv = Number(b.metrics?.[key] ?? 0); const row = make('div','lab-compare-metric'); row.append(make('span','',label),make('b','',`${av} → ${bv}`),make('em','',`${bv-av >= 0 ? '+' : ''}${bv-av}`)); metricsBlock.append(row); });
  refs.compareView.append(scoreA,scoreB,metricsBlock);
}

function builderValue(ref,fallback='미입력') { const value = ref?.value?.trim(); return value || fallback; }
function generateBuilderDocument(event) {
  event?.preventDefault(); const template = BUILDER_TEMPLATES[refs.builderTemplate.value] || BUILDER_TEMPLATES.decision; const date = new Intl.DateTimeFormat('ko-KR',{dateStyle:'long'}).format(new Date()); const checks = template.checks.map((item,index) => `${index+1}. ${item}`).join('\n');
  builderText = `${template.title}\n작성일 ${date}\n\n1. 목적\n${builderValue(refs.builderPurpose)}\n\n2. 상황 및 확인자료\n${builderValue(refs.builderContext)}\n\n3. 제약조건\n${builderValue(refs.builderConstraints)}\n\n4. 판단기준\n${builderValue(refs.builderCriteria)}\n\n5. 검토 체크포인트\n${checks}\n\n6. 결정 및 후속조치\n${builderValue(refs.builderAction)}\n\n7. 검증 메모\n- 입력자료의 최신성·출처 확인\n- 미확인 사실과 가정을 구분\n- 실행 전 책임자·기한·재검토 시점 확정`;
  refs.builderOutput.textContent = builderText;
}
function saveBuilderDocument() {
  if (!builderText) generateBuilderDocument(); const docs = readLocal(DOCS_KEY,[]); const template = BUILDER_TEMPLATES[refs.builderTemplate.value] || BUILDER_TEMPLATES.decision;
  docs.unshift({id:`doc-${Date.now()}`,title:builderValue(refs.builderPurpose,template.title),template:template.title,text:builderText,savedAt:new Date().toISOString()}); writeLocal(DOCS_KEY,docs.slice(0,40));
  refs.saveBuilder.textContent = '저장 완료'; setTimeout(() => {refs.saveBuilder.textContent = '작업공간에 저장';},1200); renderWorkspace();
}

function renderInteractiveModel() {
  const state = {}; refs.modelControls.querySelectorAll('input[data-model]').forEach(input => {state[input.dataset.model] = input.checked;});
  let risk = 25; if (state.external) risk += 10; if (state.personal) risk += 20; if (state.automation) risk += 20; if (state.human) risk -= 20; if (state.logs) risk -= 15; risk = clamp(risk); refs.modelRisk.textContent = `${risk} / 100`;
  const actors = [['운영조직',28+(state.personal?12:0)+(state.automation?10:0)],['통합·개발',24+(state.automation?8:0)+(state.logs?4:0)],['AI 공급자',state.external?24:8],['사람 승인자',state.human?24:8]]; const total = actors.reduce((sum,item) => sum+item[1],0) || 1;
  refs.responsibilityGrid.replaceChildren(); actors.forEach(([label,value]) => { const pct = Math.round((value/total)*100); const card = make('div','lab-responsibility-card'); card.append(make('span','',label),make('strong','',`${pct}%`),make('small','','통제 관여도')); refs.responsibilityGrid.append(card); });
  const notes = []; if (state.personal) notes.push('개인정보 처리'); if (state.external) notes.push('외부 서비스'); if (state.automation) notes.push('자동 외부행위'); if (state.human) notes.push('사전 승인'); if (state.logs) notes.push('상세 로그');
  refs.modelNote.textContent = `현재 조건: ${notes.join(' · ') || '기본 조건'} · 이 수치는 법적 책임 결론이 아니라 통제구조를 비교하기 위한 작동형 모델입니다.`;
}

function renderWorkspace() {
  const runs = readLocal(HISTORY_KEY,[]), docs = readLocal(DOCS_KEY,[]), custom = readLocal(CUSTOM_SCENARIOS_KEY,[]); refs.workspaceStats.replaceChildren();
  [['시뮬레이션',runs.length],['저장 문서',docs.length],['직접 만든 시나리오',custom.length]].forEach(([label,value]) => { const stat = make('div','lab-workspace-stat'); stat.append(make('span','',label),make('strong','',String(value))); refs.workspaceStats.append(stat); });
  function renderItems(host,items,formatter,empty) { host.replaceChildren(); if (!items.length) {host.append(make('p','lab-empty',empty)); return;} items.slice(0,5).forEach(item => { const row = make('div','lab-workspace-row'); const [title,meta] = formatter(item); row.append(make('strong','',title),make('span','',meta)); host.append(row); }); }
  renderItems(refs.workspaceRuns,runs,run => [run.scenarioTitle,`${run.finalScore}점 · ${formatWhen(run.completedAt)}`],'아직 실행기록이 없습니다.');
  renderItems(refs.workspaceDocs,docs,doc => [doc.title,`${doc.template} · ${formatWhen(doc.savedAt)}`],'저장한 문서가 없습니다.');
  renderItems(refs.workspaceScenarios,custom,item => [item.title,`${item.category || '직접 제작'} · ${Object.keys(item.nodes || {}).length}단계`],'직접 만든 시나리오가 없습니다.');
}

function studioScenarioFromForm() {
  const title = builderValue(refs.studioTitle,'직접 만든 의사결정 시나리오'); const role = builderValue(refs.studioRole,'의사결정 책임자'); const situation = builderValue(refs.studioSituation,'현재 상황을 확인하고 가장 적절한 대응을 선택하십시오.');
  const choices = [builderValue(refs.studioChoice1,'확인 가능한 사실과 위험을 먼저 정리한다'),builderValue(refs.studioChoice2,'일부 조건만 확인하고 바로 실행한다'),builderValue(refs.studioChoice3,'추가 확인 없이 즉시 결정한다')];
  return {id:`custom-${Date.now()}`,title,subtitle:situation.slice(0,120),durationMinutes:8,role,category:'직접 제작',startNode:'decision',initialMetrics:{quality:45,control:45,speed:55,trust:50},metricLabels:{quality:'판단 품질',control:'위험 통제',speed:'실행 속도',trust:'신뢰'},nodes:{decision:{phase:'1. 핵심 판단',title,situation,evidence:['입력된 상황을 기준으로 선택의 효과를 비교합니다.','입력된 조건을 바탕으로 선택과 지표를 같은 엔진에서 실행합니다.'],options:[{id:'choice-1',label:choices[0],detail:'근거와 통제를 먼저 확보하는 선택입니다.',effects:{quality:25,control:22,speed:-5,trust:15},score:25,facts:['판단근거와 후속조치가 명확해집니다.'],next:null},{id:'choice-2',label:choices[1],detail:'속도와 검증을 절충하는 선택입니다.',effects:{quality:8,control:5,speed:12,trust:3},score:15,facts:['일부 위험은 관리되지만 추가 확인이 필요합니다.'],next:null},{id:'choice-3',label:choices[2],detail:'속도를 우선하지만 검증이 부족한 선택입니다.',effects:{quality:-15,control:-18,speed:20,trust:-12},score:5,facts:['빠르게 진행되지만 오류와 재작업 가능성이 커집니다.'],next:null}]}},results:[{min:80,code:'strong',title:'구조화된 판단',message:'근거·통제·실행의 균형이 좋습니다.'},{min:55,code:'mixed',title:'보완 가능한 판단',message:'일부 조건을 더 확인하면 안정성이 높아집니다.'},{min:0,code:'weak',title:'재검토가 필요한 판단',message:'속도보다 근거와 통제조건을 먼저 보완할 필요가 있습니다.'}]};
}
function buildStudioScenario(event) {
  event?.preventDefault();
  studioDraft = studioScenarioFromForm();
  const submit = refs.studioForm.querySelector('button[type="submit"]');
  if (submit) {
    submit.textContent = '시나리오 생성 완료';
    setTimeout(() => { submit.textContent = '시나리오 만들기'; },1200);
  }
}
function saveStudioScenario() {
  const item = studioDraft || studioScenarioFromForm();
  if (!isScenarioValid(item)) {refs.saveScenario.textContent = '구조 확인 필요'; return;}
  if (!/^[A-Za-z0-9._:-]{1,120}$/.test(item.id || '')) item.id = `custom-${Date.now()}`;
  item.category = item.category || '직접 제작';
  const custom = readLocal(CUSTOM_SCENARIOS_KEY,[]); writeLocal(CUSTOM_SCENARIOS_KEY,[item,...custom.filter(existing => existing.id !== item.id)].slice(0,40)); refs.saveScenario.textContent = '저장 완료'; setTimeout(() => {refs.saveScenario.textContent = '라이브러리에 저장';},1200); studioDraft = null; renderScenarioControls(); renderWorkspace(); prepareScenario(item.id,{scroll:true});
}

function exportLabData() {
  const payload = {format:'NEXUS-LAB-OPEN-PACK',version:1,exportedAt:new Date().toISOString(),runs:readLocal(HISTORY_KEY,[]),documents:readLocal(DOCS_KEY,[]),scenarios:readLocal(CUSTOM_SCENARIOS_KEY,[])};
  const blob = new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `nexus-lab-${new Date().toISOString().slice(0,10)}.json`; document.body.append(a); a.click(); a.remove(); URL.revokeObjectURL(url); refs.operationStatus.textContent = '현재 브라우저의 LAB 데이터가 JSON 파일로 내보내졌습니다.';
}
async function importLabData(file) {
  if (!file) return;
  try {
    const payload = JSON.parse(await file.text()); if (payload.format !== 'NEXUS-LAB-OPEN-PACK') throw new Error('format');
    if (Array.isArray(payload.runs)) writeLocal(HISTORY_KEY,payload.runs.slice(0,40)); if (Array.isArray(payload.documents)) writeLocal(DOCS_KEY,payload.documents.slice(0,40)); if (Array.isArray(payload.scenarios)) writeLocal(CUSTOM_SCENARIOS_KEY,payload.scenarios.filter(isScenarioValid).slice(0,40));
    refs.operationStatus.textContent = 'LAB 데이터 가져오기가 완료됐습니다.'; renderScenarioControls(); renderHistoryAndCompare(); renderWorkspace();
  } catch (_) { refs.operationStatus.textContent = '가져오기 실패: NEXUS LAB 내보내기 JSON인지 확인하십시오.'; }
  finally { refs.importLab.value = ''; }
}
function clearWorkspace() {
  if (!globalThis.confirm('이 브라우저에 저장된 시뮬레이션 기록, 문서, 직접 만든 시나리오를 모두 비우시겠습니까?')) return;
  [LAST_KEY,HISTORY_KEY,DOCS_KEY,CUSTOM_SCENARIOS_KEY].forEach(key => localStorage.removeItem(key)); refs.operationStatus.textContent = '브라우저 작업공간을 비웠습니다.'; scenario = builtInScenarios[0] || null; renderScenarioControls(); renderHistoryAndCompare(); renderWorkspace();
}
async function loadPublicSummary() {
  try { const response = await fetch(LAB_API,{cache:'no-store'}); if (!response.ok) throw new Error(`HTTP ${response.status}`); const data = await response.json(); if (!data.ok) throw new Error('summary'); refs.publicRuns.textContent = new Intl.NumberFormat('ko-KR').format(data.runs || 0); refs.publicCompletions.textContent = new Intl.NumberFormat('ko-KR').format(data.completions || 0); refs.publicAverage.textContent = `${Number(data.averageScore || 0).toFixed(1)}`; }
  catch (_) { refs.publicRuns.textContent = '확인 불가'; refs.publicCompletions.textContent = '확인 불가'; refs.publicAverage.textContent = '확인 불가'; }
}
async function loadScenarios() {
  try { const response = await fetch('./scenarios.json',{cache:'no-store'}); if (!response.ok) throw new Error(`HTTP ${response.status}`); const data = await response.json(); builtInScenarios = Array.isArray(data.scenarios) ? data.scenarios.filter(isScenarioValid) : []; if (!builtInScenarios.length) throw new Error('scenario_missing'); scenario = builtInScenarios[0]; renderScenarioControls(); renderHistoryAndCompare(); renderWorkspace(); }
  catch (_) { refs.storage.textContent = '시나리오를 불러오지 못했습니다'; refs.start.disabled = true; }
}

refs.select.addEventListener('change',() => prepareScenario(refs.select.value));
refs.start.addEventListener('click',startSimulation);
refs.restart.addEventListener('click',restartSimulation);
refs.retry.addEventListener('click',restartSimulation);
refs.copy.addEventListener('click',() => copyText(buildResultText(),refs.copy,'결과 요약 복사'));
refs.continueButton.addEventListener('click',() => { if (pendingNext) renderNode(pendingNext); else finishSimulation(); });
refs.compareButton.addEventListener('click',renderComparison);
refs.builderForm.addEventListener('submit',generateBuilderDocument);
refs.saveBuilder.addEventListener('click',saveBuilderDocument);
refs.copyBuilder.addEventListener('click',() => copyText(builderText || refs.builderOutput.textContent,refs.copyBuilder,'복사'));
refs.modelControls.addEventListener('change',renderInteractiveModel);
refs.studioForm.addEventListener('submit',buildStudioScenario);
refs.studioForm.addEventListener('input',() => { studioDraft = null; });
refs.saveScenario.addEventListener('click',saveStudioScenario);
refs.exportLab.addEventListener('click',exportLabData);
refs.importLab.addEventListener('change',() => importLabData(refs.importLab.files?.[0]));
refs.clearWorkspace.addEventListener('click',clearWorkspace);

renderInteractiveModel();
void loadScenarios();
void loadPublicSummary();