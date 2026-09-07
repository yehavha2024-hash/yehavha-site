import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import process from 'node:process';

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, 'nexus', 'ai-trends', 'data.json');
const LOOKBACK_DAYS = Number(process.env.AI_TRENDS_LOOKBACK_DAYS || 3);
const MAX_NEW_PER_RUN = Number(process.env.AI_TRENDS_MAX_NEW || 30);
const TIMEOUT_MS = Number(process.env.AI_TRENDS_TIMEOUT_MS || 20000);

const CATEGORY_LABELS = {
  frontier: '프런티어 AI·AGI (범용인공지능)·ASI (초지능)',
  agents: 'Agentic AI (에이전틱 AI)·Multi-Agent Systems (다중 에이전트 시스템)',
  physical: 'Physical AI (피지컬 AI)·로봇',
  autonomy: '자율주행·드론',
  compute: 'AI 컴퓨팅·메모리',
  'law-policy': '법·정책',
  research: '연구·논문',
  safety: '사건·안전',
  national: '국가사업'
};

const SOURCES = [
  {
    id: 'openai-news',
    name: 'OpenAI',
    url: 'https://openai.com/news/rss.xml',
    type: 'rss',
    maxItems: 8,
    include: /\b(ai|gpt|chatgpt|codex|model|agent|api|safety|research|robot|benchmark)\b/i
  },
  {
    id: 'github-changelog',
    name: 'GitHub Changelog',
    url: 'https://github.blog/changelog/feed/',
    type: 'rss',
    maxItems: 8,
    include: /\b(copilot|ai|model|agent|mcp|gpt|claude|gemini|llm|reasoning)\b/i
  },
  {
    id: 'google-blog',
    name: 'Google',
    url: 'https://blog.google/feed/',
    type: 'rss',
    maxItems: 8,
    include: /\b(ai|gemini|deepmind|model|agent|robot|tpu|machine learning|generative)\b/i
  },
  {
    id: 'huggingface-blog',
    name: 'Hugging Face',
    url: 'https://huggingface.co/blog/feed.xml',
    type: 'rss',
    maxItems: 6,
    include: /\b(model|agent|llm|transformer|robot|inference|benchmark|multimodal|reasoning|ai|diffusion)\b/i
  },
  {
    id: 'arxiv-cs-ai',
    name: 'arXiv cs.AI',
    url: 'https://rss.arxiv.org/rss/cs.AI',
    type: 'rss',
    maxItems: 5,
    include: /\b(agent|multi-agent|language model|foundation model|reasoning|robot|alignment|safety|benchmark|autonomous|artificial intelligence)\b/i
  },
  {
    id: 'nvidia-generative-ai',
    name: 'NVIDIA',
    url: 'https://blogs.nvidia.com/blog/category/generative-ai/feed/',
    type: 'rss',
    maxItems: 6,
    include: /./
  },
  {
    id: 'anthropic-news',
    name: 'Anthropic',
    url: 'https://www.anthropic.com/news',
    type: 'anthropic-html',
    maxItems: 6,
    include: /\b(claude|model|agent|safety|research|standard|security|ai)\b/i
  },
  {
    id: 'openai-release-notes',
    name: 'OpenAI Release Notes',
    url: 'https://openai.com/products/release-notes/',
    type: 'openai-release-html',
    maxItems: 8,
    include: /\b(gpt|chatgpt|codex|api|agent|model|reasoning|computer use|release|retir|sunset|deprecat)\b/i
  }
];

function decodeEntities(value = '') {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'");
}

function textify(value = '') {
  return decodeEntities(value)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function clip(value, max = 360) {
  const clean = textify(value);
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

function slug(value = '') {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'update';
}

function normalizeUrl(value = '') {
  try {
    const url = new URL(value);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'source'].forEach(key => url.searchParams.delete(key));
    url.hash = '';
    url.pathname = url.pathname.replace(/\/$/, '') || '/';
    return url.toString();
  } catch {
    return value.trim();
  }
}

function normalizeTitle(value = '') {
  return textify(value)
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isoDate(value) {
  const parsed = value ? new Date(value) : new Date();
  if (Number.isNaN(parsed.getTime())) return new Date().toISOString().slice(0, 10);
  return parsed.toISOString().slice(0, 10);
}

function withinLookback(dateString) {
  const item = new Date(`${dateString}T23:59:59Z`).getTime();
  const cutoff = Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000;
  return item >= cutoff;
}

function tagValue(block, tag) {
  const escaped = tag.replace(':', '\\:');
  const match = block.match(new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, 'i'));
  return match ? match[1] : '';
}

function atomLink(block) {
  const preferred = block.match(/<link\b[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["'][^>]*>/i)
    || block.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*>/i);
  return preferred ? decodeEntities(preferred[1]) : '';
}

function parseFeed(xml, source) {
  const results = [];
  const itemBlocks = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map(match => match[0]);
  const entryBlocks = itemBlocks.length ? [] : [...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map(match => match[0]);
  const blocks = itemBlocks.length ? itemBlocks : entryBlocks;

  for (const block of blocks) {
    const title = textify(tagValue(block, 'title'));
    const description = tagValue(block, 'description') || tagValue(block, 'summary') || tagValue(block, 'content:encoded') || tagValue(block, 'content');
    const link = itemBlocks.length ? textify(tagValue(block, 'link') || tagValue(block, 'guid')) : atomLink(block);
    const date = isoDate(tagValue(block, 'pubDate') || tagValue(block, 'published') || tagValue(block, 'updated') || tagValue(block, 'dc:date'));
    const haystack = `${title} ${textify(description)}`;
    if (!title || !link || !source.include.test(haystack)) continue;
    results.push({ title, description: clip(description || title), link, date });
  }

  return results.slice(0, source.maxItems);
}

function parseAnthropic(html, source) {
  const results = [];
  const seen = new Set();
  const anchorRegex = /<a\b[^>]*href=["'](\/news\/[^"'#?]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  for (const match of html.matchAll(anchorRegex)) {
    const link = new URL(match[1], source.url).toString();
    if (seen.has(link)) continue;
    seen.add(link);
    const body = textify(match[2]);
    const dateMatch = body.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+20\d{2}\b/i);
    const date = dateMatch ? isoDate(dateMatch[0]) : new Date().toISOString().slice(0, 10);
    const title = body
      .replace(/\b(Announcements?|Product|Policy|Research|Features?|Case Study)\b/gi, ' ')
      .replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+20\d{2}\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!title || !source.include.test(title)) continue;
    results.push({ title: clip(title, 180), description: clip(body, 360), link, date });
    if (results.length >= source.maxItems) break;
  }
  return results;
}

function parseOpenAIReleaseNotes(html, source) {
  const results = [];
  const h2Regex = /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi;
  for (const match of html.matchAll(h2Regex)) {
    const title = textify(match[1]);
    if (!title || !source.include.test(title)) continue;
    const start = Math.max(0, match.index - 1800);
    const end = Math.min(html.length, (match.index || 0) + match[0].length + 2400);
    const neighborhood = textify(html.slice(start, end));
    const dateMatch = neighborhood.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+20\d{2}\b/i);
    if (!dateMatch) continue;
    results.push({
      title,
      description: clip(neighborhood.replace(title, '').trim(), 360),
      link: source.url,
      date: isoDate(dateMatch[0])
    });
    if (results.length >= source.maxItems) break;
  }
  return results;
}

function categoryFor(title, description, sourceId) {
  const hay = `${title} ${description}`.toLowerCase();
  const rules = [
    ['safety', /\b(safety|security|cyber|attack|vulnerab|incident|shutdown|jailbreak|prompt injection|red team|guardrail|containment|privacy)\b/i],
    ['law-policy', /\b(policy|regulat|law|act\b|governance|standard|copyright|compliance|nist|iso|eu ai|legislat)\b/i],
    ['physical', /\b(robot|robotics|humanoid|physical ai|embodied|vla|vision-language-action|hardware standard)\b/i],
    ['autonomy', /\b(autonomous driv|robotaxi|self-driving|drone|uas\b|bvlos|vehicle autonomy)\b/i],
    ['compute', /\b(gpu|tpu|npu|cuda|chip|semiconductor|memory|hbm|inference hardware|data ?center|compute)\b/i],
    ['agents', /\b(agent|agentic|multi-agent|mcp|computer use|tool use|copilot|workflow|automation)\b/i],
    ['research', /\b(arxiv|paper|research|benchmark|evaluation|dataset|leaderboard|study)\b/i],
    ['national', /\b(government|national|public sector|ministry|federal|state program|initiative|budget)\b/i],
    ['frontier', /\b(gpt|gemini|claude|llm|language model|foundation model|model release|multimodal|reasoning|open-weight|open weight)\b/i]
  ];
  for (const [category, regex] of rules) if (regex.test(hay)) return category;
  if (sourceId === 'arxiv-cs-ai') return 'research';
  return 'frontier';
}

function signalFor(title, description) {
  const hay = `${title} ${description}`;
  if (/retir|sunset|deprecat|end of support/i.test(hay)) return 'DEPRECATION (지원 종료·변경)';
  if (/security|safety|vulnerab|incident|attack|jailbreak/i.test(hay)) return 'SAFETY & SECURITY (안전·보안)';
  if (/policy|regulat|law|governance|standard|copyright/i.test(hay)) return 'POLICY & STANDARD (정책·표준)';
  if (/research|paper|benchmark|evaluation|dataset|arxiv/i.test(hay)) return 'RESEARCH UPDATE (연구 업데이트)';
  if (/introduc|launch|release|available|general availability|\bga\b|preview/i.test(hay)) return 'PRODUCT UPDATE (제품 업데이트)';
  return 'AI UPDATE (AI 업데이트)';
}

function importanceFor(category) {
  const map = {
    frontier: '모델 성능·가격·접근범위의 변화는 기존 AI 서비스의 모델 선택과 운영기준을 직접 바꿀 수 있으므로 적용 가능성과 전환 필요성을 확인할 가치가 있다.',
    agents: '에이전트의 도구 사용·권한·장기 작업 기능 변화는 실제 업무 자동화 범위와 통제·책임 구조에 직접 영향을 줄 수 있다.',
    physical: '물리 장비와 AI의 결합 변화는 안전통제·상호운용·현장 배치 기준과 제조자·통합자·운영자 간 책임경계에 영향을 줄 수 있다.',
    autonomy: '자율 시스템의 배치 확대는 운행 안전·원격지원·사고보고·보험 및 운영자 책임 구조를 변화시킬 수 있다.',
    compute: '컴퓨팅·반도체·추론 인프라 변화는 AI 서비스의 비용·속도·배치방식과 공급망 의존성에 직접 영향을 준다.',
    'law-policy': '법·정책·표준 변경은 AI 개발자·제공자·배포자·이용자의 준수의무와 위험관리 기준을 직접 바꿀 수 있다.',
    research: '새 연구·벤치마크는 모델과 에이전트의 능력·한계를 평가하는 기준을 바꾸고 후속 연구의 검증 대상을 제공한다.',
    safety: '안전·보안 변화는 권한통제, 모니터링, 중단장치, 로그 보존과 사고대응 체계를 재점검해야 할 신호가 된다.',
    national: '국가사업·공공투자 변화는 조달·인프라·표준·산업생태계의 방향을 결정하며 국내 적용 가능성에 영향을 줄 수 있다.'
  };
  return map[category] || map.frontier;
}

function researchFor(category) {
  const map = {
    frontier: '기초모델의 능력과 실제 서비스·에이전트 실행환경을 분리해 성능, 권한, 통제 가능성과 책임범위를 비교할 자료로 축적한다.',
    agents: 'Agentic AI와 다중 에이전트 시스템의 행위효과·권한위임·로그·감독·계층적 책임귀속 연구에 연결할 수 있다.',
    physical: 'Physical AI에서 모델 제공자·장비 제조자·시스템 통합자·현장 운영자의 기능별 의무와 손해귀속을 비교할 자료로 사용할 수 있다.',
    autonomy: '자율시스템의 인간 개입 가능성, 원격지원, 운영중단과 제조·운영 단계별 책임배분 연구에 연결할 수 있다.',
    compute: 'AI 시스템의 기반 인프라 계층이 서비스 지속성·위험통제·산업집중에 미치는 영향을 분석하는 자료로 활용할 수 있다.',
    'law-policy': 'AI 규범의 적용대상·시행일·의무주체와 실제 기술 구조를 대응시켜 비교법·책임법 연구의 근거자료로 축적한다.',
    research: '방법론·평가환경·재현성·한계를 확인해 Agentic AI 및 AI 책임 연구에서 기술적 전제로 사용할 수 있는지 검토한다.',
    safety: '사고 전 예방의무와 사고 후 책임을 구분하고 권한관리·모니터링·중단·로그 보존의 합리적 주의의무를 분석할 자료로 연결한다.',
    national: '공공조달·국가 인프라·산업지원이 기술표준과 책임구조 형성에 미치는 영향을 분석하는 정책자료로 축적한다.'
  };
  return map[category] || map.frontier;
}

function topicsFor(title, description, sourceName) {
  const hay = `${title} ${description}`;
  const tags = [sourceName];
  const candidates = [
    ['Agentic AI (에이전틱 AI)', /agentic|\bagent\b/i],
    ['Multi-Agent Systems (다중 에이전트 시스템)', /multi-agent/i],
    ['MCP (Model Context Protocol)', /\bmcp\b|model context protocol/i],
    ['Frontier Model (프런티어 모델)', /gpt|gemini|claude|frontier model|foundation model/i],
    ['AI Safety (AI 안전)', /safety|guardrail|containment|jailbreak/i],
    ['Cybersecurity (사이버보안)', /cyber|security|vulnerab|attack/i],
    ['Physical AI (피지컬 AI)', /physical ai|robot|humanoid|embodied/i],
    ['AI Compute (AI 컴퓨팅)', /gpu|tpu|npu|cuda|semiconductor|compute/i],
    ['AI Governance (AI 거버넌스)', /governance|regulat|policy|law|standard/i],
    ['Benchmark (벤치마크)', /benchmark|evaluation|leaderboard/i],
    ['Open Source (오픈소스)', /open source|open-source|open-weight|open weight/i]
  ];
  for (const [label, regex] of candidates) {
    if (regex.test(hay) && !tags.includes(label)) tags.push(label);
    if (tags.length >= 4) break;
  }
  return tags;
}

async function fetchText(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'YEHAVHA-NEXUS-AI-Update-Collector/1.0 (+https://yehavha.com/)'
      }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

async function collectSource(source) {
  const body = await fetchText(source.url);
  let items = [];
  if (source.type === 'rss') items = parseFeed(body, source);
  else if (source.type === 'anthropic-html') items = parseAnthropic(body, source);
  else if (source.type === 'openai-release-html') items = parseOpenAIReleaseNotes(body, source);
  return items
    .filter(item => withinLookback(item.date))
    .map(item => ({ ...item, source }));
}

function candidateToEntry(item) {
  const category = categoryFor(item.title, item.description, item.source.id);
  const normalizedUrl = normalizeUrl(item.link);
  const digest = crypto.createHash('sha1').update(`${item.title}|${normalizedUrl}`).digest('hex').slice(0, 10);
  return {
    id: `auto-${item.date}-${slug(item.source.id)}-${digest}`,
    date: item.date,
    category,
    categoryLabel: CATEGORY_LABELS[category],
    signal: signalFor(item.title, item.description),
    title: item.title,
    summary: item.description || `${item.source.name}의 최신 AI 업데이트입니다.`,
    importance: importanceFor(category),
    research: researchFor(category),
    topics: topicsFor(item.title, item.description, item.source.name),
    sources: [{ label: `${item.source.name} · ${item.date.replaceAll('-', '.')}`, url: normalizedUrl }],
    autoCollected: true,
    sourceId: item.source.id
  };
}

function existingIndexes(entries) {
  const urls = new Set();
  const titles = new Set();
  for (const entry of entries) {
    titles.add(normalizeTitle(entry.title));
    for (const source of entry.sources || []) urls.add(normalizeUrl(source.url));
  }
  return { urls, titles };
}

function ensureMetadata(data) {
  data.updateCadence = '6시간마다 자동 수집 · 중요 변화 발생 시 수시 반영';
  data.collector = {
    ...(data.collector || {}),
    mode: 'official-source-first',
    sourceCount: SOURCES.length,
    deduplication: 'normalized URL + normalized title',
    lookbackDays: LOOKBACK_DAYS
  };
}

async function main() {
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  const data = JSON.parse(raw);
  const entries = Array.isArray(data.entries) ? data.entries : [];
  const { urls, titles } = existingIndexes(entries);
  const failures = [];
  const collected = [];

  for (const source of SOURCES) {
    try {
      const items = await collectSource(source);
      collected.push(...items);
      console.log(`[ai-trends] ${source.name}: ${items.length} recent candidate(s)`);
    } catch (error) {
      failures.push(`${source.id}: ${error.message}`);
      console.warn(`[ai-trends] ${source.name} failed: ${error.message}`);
    }
  }

  if (failures.length === SOURCES.length) {
    throw new Error(`All AI update sources failed: ${failures.join('; ')}`);
  }

  const newEntries = [];
  collected
    .sort((a, b) => `${b.date}|${b.title}`.localeCompare(`${a.date}|${a.title}`))
    .forEach(item => {
      if (newEntries.length >= MAX_NEW_PER_RUN) return;
      const urlKey = normalizeUrl(item.link);
      const titleKey = normalizeTitle(item.title);
      if (!urlKey || !titleKey || urls.has(urlKey) || titles.has(titleKey)) return;
      const entry = candidateToEntry(item);
      newEntries.push(entry);
      urls.add(urlKey);
      titles.add(titleKey);
    });

  const metadataBefore = JSON.stringify({ updateCadence: data.updateCadence, collector: data.collector });
  ensureMetadata(data);
  const metadataAfter = JSON.stringify({ updateCadence: data.updateCadence, collector: data.collector });

  if (newEntries.length) {
    data.entries = [...newEntries, ...entries].sort((a, b) => `${b.date}|${b.id}`.localeCompare(`${a.date}|${a.id}`));
    data.updatedAt = new Date().toISOString().slice(0, 10);
    data.edition = data.updatedAt;
    data.collector.lastSuccessfulUpdateAt = new Date().toISOString();
    data.collector.lastAddedCount = newEntries.length;
  }

  const shouldWrite = newEntries.length > 0 || metadataBefore !== metadataAfter;
  if (!shouldWrite) {
    console.log(`[ai-trends] No new entries. ${failures.length} source(s) failed.`);
    return;
  }

  await fs.writeFile(DATA_PATH, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`[ai-trends] Added ${newEntries.length} new entr${newEntries.length === 1 ? 'y' : 'ies'}.`);
  if (failures.length) console.warn(`[ai-trends] Partial source failures: ${failures.join('; ')}`);
}

main().catch(error => {
  console.error(`[ai-trends] refresh failed: ${error.stack || error.message}`);
  process.exitCode = 1;
});
