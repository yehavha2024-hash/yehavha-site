const TARGET_TYPES = Object.freeze({
  person: { label: '인물' },
  organization: { label: '회사·기관' },
  product: { label: '상품' },
  service: { label: '서비스' },
  place: { label: '장소' }
});

const SOURCE_QUERIES = Object.freeze({
  person: [
    { group: '기본정보', q: '"{target}" (프로필 OR 소개 OR 경력 OR 소속 OR 공식)', rank: 4 },
    { group: '공식·언론', q: '"{target}" (공식 OR 인터뷰 OR 경력 OR 보도)', rank: 3 },
    { group: '공개평가', q: '"{target}" (평가 OR 평판 OR 후기)', rank: 3 }
  ],
  organization: [
    { group: '기본정보', q: '"{target}" (회사소개 OR 기업소개 OR 기관소개 OR 사업 OR 서비스 OR 공식 홈페이지)', rank: 4 },
    { group: '재직·면접', q: '"{target}" (재직 OR 면접 OR 조직문화 OR 복지 OR 퇴사) 후기', rank: 4 },
    { group: '공개평가', q: '"{target}" (평판 OR 후기 OR 리뷰 OR 거래)', rank: 4 },
    { group: '공식·언론', q: '"{target}" (공시 OR 보도자료 OR 행정처분 OR 판결 OR 뉴스)', rank: 3 }
  ],
  product: [
    { group: '기본정보', q: '"{target}" (제품소개 OR 상품소개 OR 제조사 OR 사양 OR 공식)', rank: 4 },
    { group: '구매·사용', q: '"{target}" (구매후기 OR 사용기 OR 리뷰 OR 단점 OR 장점)', rank: 4 },
    { group: '문제·지원', q: '"{target}" (불량 OR 환불 OR AS OR 고객지원)', rank: 4 },
    { group: '공식·언론', q: '"{target}" (공식 OR 출시 OR 리콜 OR 뉴스)', rank: 3 }
  ],
  service: [
    { group: '기본정보', q: '"{target}" (서비스소개 OR 운영사 OR 이용방법 OR 공식 홈페이지)', rank: 4 },
    { group: '이용경험', q: '"{target}" (이용후기 OR 리뷰 OR 사용후기)', rank: 4 },
    { group: '문제·지원', q: '"{target}" (환불 OR 해지 OR 고객센터 OR 불만)', rank: 4 },
    { group: '공식·언론', q: '"{target}" (공식 OR 공지 OR 뉴스)', rank: 3 }
  ],
  place: [
    { group: '기본정보', q: '"{target}" (장소소개 OR 시설소개 OR 주소 OR 운영시간 OR 공식)', rank: 4 },
    { group: '방문경험', q: '"{target}" (방문후기 OR 리뷰 OR 카카오맵 OR 네이버지도)', rank: 4 },
    { group: '이용평가', q: '"{target}" (친절 OR 가격 OR 대기 OR 청결 OR 재방문)', rank: 4 },
    { group: '공식·언론', q: '"{target}" (공식 OR 공지 OR 뉴스)', rank: 3 }
  ]
});

const FALLBACK_QUERIES = Object.freeze({
  person: [
    { group: '기본정보', q: '"{target}"', rank: 7 },
    { group: '기본정보', q: '{target} 프로필 경력', rank: 6 },
    { group: '공개평가', q: '"{target}" 평가 후기', rank: 5 },
    { group: '공식·언론', q: '"{target}" 뉴스 인터뷰', rank: 4 }
  ],
  organization: [
    { group: '기본정보', q: '"{target}"', rank: 7 },
    { group: '기본정보', q: '"{target}" 회사 기업정보', rank: 8 },
    { group: '기본정보', q: '"{target}" 홈페이지 대표 사업', rank: 7 },
    { group: '재직·면접', q: '"{target}" 잡플래닛', rank: 9 },
    { group: '재직·면접', q: '"{target}" 잡코리아', rank: 8 },
    { group: '재직·면접', q: '"{target}" 사람인', rank: 7 },
    { group: '공개평가', q: '"{target}" 후기 리뷰 평판', rank: 7 },
    { group: '공식·언론', q: '"{target}" 뉴스', rank: 5 }
  ],
  product: [
    { group: '기본정보', q: '"{target}"', rank: 7 },
    { group: '기본정보', q: '"{target}" 제조사 공식', rank: 7 },
    { group: '구매·사용', q: '"{target}" 리뷰 후기', rank: 7 },
    { group: '문제·지원', q: '"{target}" 환불 AS 불량', rank: 6 }
  ],
  service: [
    { group: '기본정보', q: '"{target}"', rank: 7 },
    { group: '기본정보', q: '"{target}" 운영사 공식', rank: 7 },
    { group: '이용경험', q: '"{target}" 이용후기 리뷰', rank: 7 },
    { group: '문제·지원', q: '"{target}" 환불 해지 고객센터', rank: 6 }
  ],
  place: [
    { group: '기본정보', q: '"{target}"', rank: 7 },
    { group: '기본정보', q: '"{target}" 주소 운영시간', rank: 7 },
    { group: '방문경험', q: '"{target}" 방문후기 리뷰', rank: 7 },
    { group: '이용평가', q: '"{target}" 친절 가격 청결', rank: 6 }
  ]
});

const TOPICS = Object.freeze({
  organization: {
    '업무강도': ['업무량','야근','업무강도','과중','워라밸','근무시간'],
    '조직문화': ['조직문화','수직적','수평적','소통','분위기','경영진'],
    '보상·복지': ['급여','연봉','복지','성과급','보상'],
    '채용·면접': ['면접','채용','입사','전형'],
    '퇴사·이직': ['퇴사','이직','퇴직','중도퇴사'],
    '거래·신뢰': ['납기','정산','거래','계약','신뢰','대금']
  },
  product: {
    '품질': ['품질','마감','내구성','불량','고장'],
    '가격·가치': ['가격','가성비','비싸','저렴'],
    '배송': ['배송','도착','지연','포장'],
    '사용성': ['사용','편리','불편','성능'],
    '사후지원': ['AS','A/S','환불','교환','고객센터']
  },
  service: {
    '서비스 품질': ['품질','서비스','처리','안정성'],
    '고객응대': ['고객센터','응대','친절','상담'],
    '가격·비용': ['가격','요금','비용','수수료'],
    '환불·해지': ['환불','해지','취소','위약금'],
    '사용성': ['사용','편리','불편','오류','장애']
  },
  place: {
    '친절·응대': ['친절','불친절','응대','직원'],
    '가격': ['가격','비싸','저렴','가성비'],
    '청결·시설': ['청결','위생','시설','깨끗'],
    '대기·예약': ['대기','예약','시간','줄'],
    '재방문': ['재방문','다시','추천','재이용']
  },
  person: {
    '공개경력': ['경력','재직','학력','활동','수상'],
    '전문성 평가': ['전문성','실력','성과','능력'],
    '공적 활동': ['발언','인터뷰','강연','저서','프로젝트'],
    '논쟁·상반평가': ['논란','비판','반박','평가']
  }
});

const POSITIVE = ['좋다','좋은','만족','추천','친절','빠르','우수','편리','안정','성장','개선','합리','긍정','장점','깨끗','신뢰'];
const NEGATIVE = ['나쁘','불만','불친절','느리','지연','비싸','불편','문제','오류','고장','과도','야근','수직','퇴사','환불','논란','비판','단점'];
const HIGH_RISK = ['사기꾼','범죄자','횡령','배임','성범죄','불법업체','마약','폭행','살인','탈세'];
const NON_REPUTATION_GROUPS = new Set(['기본정보','공식·언론']);

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type':'application/json; charset=utf-8',
      'cache-control':'no-store, max-age=0',
      'x-content-type-options':'nosniff'
    }
  });
}

function clean(value, max = 120) { return String(value || '').replace(/\s+/g,' ').trim().slice(0,max); }
function stripTags(value) { return String(value || '').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(); }
function decodeXml(value) { return String(value || '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'"); }
function tag(block, name) {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`,'i'));
  return m ? stripTags(decodeXml(m[1])) : '';
}
function parseRss(xml, provider, spec) {
  const items = [];
  const blocks = String(xml || '').match(/<item\b[\s\S]*?<\/item>/gi) || [];
  for (const block of blocks.slice(0,12)) {
    const title = tag(block,'title');
    const link = tag(block,'link');
    const description = tag(block,'description');
    const pubDate = tag(block,'pubDate');
    const sourceName = tag(block,'source');
    if (title && link) items.push({
      title,
      url:link,
      snippet:description,
      publishedAt:pubDate||null,
      provider,
      group:spec.group,
      queryRank:Number(spec.rank || 0),
      sourceName
    });
  }
  return items;
}
async function fetchText(url, timeoutMs = 5500) {
  const c = new AbortController();
  const timer = setTimeout(() => c.abort(), timeoutMs);
  try {
    const r = await fetch(url, {
      headers: {
        accept:'application/rss+xml, application/xml, text/xml;q=0.9, text/html;q=0.6',
        'user-agent':'YEHAVHA-NEXUS-Reputation/1.2 (+https://yehavha.com/)'
      },
      signal:c.signal
    });
    if (!r.ok) throw new Error(`upstream_${r.status}`);
    return await r.text();
  } finally {
    clearTimeout(timer);
  }
}
function bingRssUrl(q) { return `https://www.bing.com/search?format=rss&setlang=ko-KR&cc=KR&q=${encodeURIComponent(q)}`; }
function googleNewsUrl(q) { return `https://news.google.com/rss/search?hl=ko&gl=KR&ceid=KR:ko&q=${encodeURIComponent(q)}`; }
function normalizeUrl(url) {
  try {
    const u = new URL(url);
    ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid'].forEach(k => u.searchParams.delete(k));
    u.hash = '';
    return u.toString();
  } catch {
    return url;
  }
}
function dedupe(items) {
  const seen = new Set(), out = [];
  for (const item of items) {
    const url = normalizeUrl(item.url);
    const key = `${url}|${item.title.toLowerCase().replace(/\W/g,'').slice(0,60)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({...item,url});
  }
  return out;
}
function entityText(value) {
  return String(value || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/&[a-z0-9#]+;/gi,' ')
    .replace(/[\s"'`’‘“”·ㆍ•:;,.!?()[\]{}<>/\\|_+=~^*-]+/g,'');
}
function targetAliases(type, target) {
  const raw = String(target || '').normalize('NFKC').trim();
  const values = new Set([raw]);
  if (type === 'organization') {
    values.add(raw.replace(/\(주\)|㈜|주식회사|유한회사|재단법인|사단법인/gi,'').trim());
    values.add(raw.replace(/\b(co\.?|corp\.?|corporation|inc\.?|ltd\.?|llc)\b/gi,'').trim());
  }
  return [...values].map(entityText).filter(v => v.length >= 2);
}
function relevantToTarget(type, target, item) {
  let decodedUrl = item.url || '';
  try { decodedUrl = decodeURIComponent(decodedUrl); } catch {}
  const hay = entityText(`${item.title} ${item.snippet} ${item.sourceName || ''} ${decodedUrl}`);
  const aliases = targetAliases(type, target);
  if (aliases.some(alias => hay.includes(alias))) return true;

  const tokens = String(target || '').normalize('NFKC').toLowerCase()
    .split(/[\s"'`’‘“”·ㆍ•:;,.!?()[\]{}<>/\\|_+=~^*-]+/)
    .map(entityText)
    .filter(t => /[가-힣]/.test(t) ? t.length >= 2 : t.length >= 3);
  return tokens.length >= 2 && tokens.every(t => hay.includes(t));
}
function sourceHost(url) {
  try { return new URL(url).hostname.replace(/^www\./,''); } catch { return ''; }
}
function sortByRelevance(items) {
  return [...items].sort((a,b) => (b.queryRank || 0) - (a.queryRank || 0));
}
function diversify(items, perGroupHost = 3, max = 24) {
  const counts = new Map(), out = [];
  for (const item of sortByRelevance(items)) {
    const host = item.sourceName || sourceHost(item.url) || item.provider || 'unknown';
    const key = `${item.group}|${host}`;
    const count = counts.get(key) || 0;
    if (count >= perGroupHost) continue;
    counts.set(key, count + 1);
    out.push(item);
    if (out.length >= max) break;
  }
  return out;
}
function scoreSentiment(text) {
  const t = text.toLowerCase();
  let pos = 0, neg = 0;
  POSITIVE.forEach(k => { if (t.includes(k.toLowerCase())) pos++; });
  NEGATIVE.forEach(k => { if (t.includes(k.toLowerCase())) neg++; });
  return {direction:pos>neg?'positive':neg>pos?'negative':'neutral'};
}
function highRisk(text) {
  const t = text.toLowerCase();
  return HIGH_RISK.some(k => t.includes(k.toLowerCase()));
}
function topicMatches(type, text) {
  const groups = TOPICS[type] || {}, t = text.toLowerCase();
  return Object.entries(groups)
    .filter(([,words]) => words.some(w => t.includes(w.toLowerCase())))
    .map(([name]) => name);
}
function annotateEvidence(type, items) {
  return items.map((item,index) => {
    const text = `${item.title} ${item.snippet}`;
    return {
      id:`S${String(index+1).padStart(2,'0')}`,
      ...item,
      host:item.sourceName || sourceHost(item.url),
      topics:topicMatches(type,text),
      sentiment:scoreSentiment(text).direction,
      highRisk:highRisk(text)
    };
  });
}
function isStrongSignal(s) {
  if (s.state === 'negative') return s.negativeIndependentSources >= 2;
  if (s.state === 'positive') return s.positiveIndependentSources >= 2;
  if (s.state === 'conflicted') return s.independentSources >= 2 && s.positiveIndependentSources >= 1 && s.negativeIndependentSources >= 1;
  return s.neutralIndependentSources >= 2;
}
function buildSignals(type, evidence) {
  const m = new Map();
  for (const e of evidence) {
    if (e.highRisk) continue;
    for (const topic of e.topics) {
      if (!m.has(topic)) m.set(topic,{topic,positive:[],negative:[],neutral:[],hosts:new Set(),positiveHosts:new Set(),negativeHosts:new Set(),neutralHosts:new Set()});
      const r = m.get(topic);
      const sentiment = ['positive','negative','neutral'].includes(e.sentiment) ? e.sentiment : 'neutral';
      r[sentiment].push(e.id);
      if (e.host) {
        r.hosts.add(e.host);
        r[`${sentiment}Hosts`].add(e.host);
      }
    }
  }
  return [...m.values()].map(r => ({
    topic:r.topic,
    positive:r.positive,
    negative:r.negative,
    neutral:r.neutral,
    independentSources:r.hosts.size,
    positiveIndependentSources:r.positiveHosts.size,
    negativeIndependentSources:r.negativeHosts.size,
    neutralIndependentSources:r.neutralHosts.size,
    total:r.positive.length+r.negative.length+r.neutral.length,
    state:r.positive.length&&r.negative.length?'conflicted':r.negative.length>r.positive.length?'negative':r.positive.length>r.negative.length?'positive':'mixed'
  })).sort((a,b) => b.independentSources-a.independentSources || b.total-a.total).slice(0,8);
}
function hasHangul(value) { return /[가-힣]/.test(String(value || '')); }
function buildOverview(type, target, profileEvidence) {
  if (!profileEvidence.length) return '';
  const source = profileEvidence.find(e => e.group === '기본정보' && e.snippet)
    || profileEvidence.find(e => e.snippet)
    || profileEvidence[0];
  const snippet = clean(source.snippet, 360);
  if (snippet && (!hasHangul(target) || hasHangul(snippet)) && relevantToTarget(type, target, source)) return snippet;
  return `${target}에 관한 기본·공식 공개자료 ${profileEvidence.length}건이 확인되었습니다. 대표 확인 자료는 “${clean(source.title,120)}”입니다.`;
}
function buildProfile(type, target, evidence, reputationEvidence, signals, collection) {
  const profileEvidence = evidence.filter(e => NON_REPUTATION_GROUPS.has(e.group));
  const overview = buildOverview(type, target, profileEvidence);
  const strongSignals = signals.filter(isStrongSignal);

  let reputationStatus = 'none';
  let reputationMessage = `현재 자동 확인 범위에서는 ${target}에 관한 공개 평판·후기 자료가 확인되지 않았습니다. 자료가 없다는 사실 자체는 긍정 또는 부정 평가를 의미하지 않습니다.`;
  if (reputationEvidence.length > 0 && strongSignals.length === 0) {
    reputationStatus = 'insufficient';
    reputationMessage = `${target}에 관한 관련 평판·후기 자료 ${reputationEvidence.length}건은 확인됐지만, 같은 방향의 평가가 서로 다른 복수 출처에서 충분히 반복되지는 않았습니다. 현재 단계에서는 일반화된 평판으로 판단하지 않습니다.`;
  } else if (strongSignals.length > 0) {
    reputationStatus = 'available';
    reputationMessage = `${target}에 관해 서로 다른 복수 출처에서 반복되거나 상충하는 평판 신호가 확인됐습니다. 아래 신호와 개별 근거를 함께 확인해야 합니다.`;
  }

  if (profileEvidence.length) {
    return {
      status:'identified',
      overview:overview || `${target}에 관한 기본·공식 공개자료가 확인되었습니다.`,
      sourceIds:profileEvidence.slice(0,5).map(e => e.id),
      sourceCount:profileEvidence.length,
      reputationStatus,
      reputationMessage
    };
  }
  if (evidence.length) {
    return {
      status:'limited',
      overview:`${target}과 직접 연결되는 일부 공개자료는 확인됐지만, 대상을 안정적으로 설명할 기본·공식 소개 자료는 충분하지 않습니다. 동명이 대상이나 유사 명칭 여부를 추가 확인해야 합니다.`,
      sourceIds:evidence.slice(0,3).map(e => e.id),
      sourceCount:0,
      reputationStatus,
      reputationMessage
    };
  }

  if (collection.successfulRequests === 0) {
    return {
      status:'search-unavailable',
      overview:`${target}의 공개자료가 없다고 판단할 수 없습니다. 현재 자동 검색 공급원 연결이 정상적으로 완료되지 않아 결과를 수집하지 못했습니다.`,
      sourceIds:[], sourceCount:0,
      reputationStatus:'none',
      reputationMessage:'검색 연결 실패 상태이므로 평판 자료의 존재 여부도 판단하지 않습니다.'
    };
  }
  if (collection.rawCount > 0) {
    return {
      status:'unidentified',
      overview:`검색 후보 ${collection.rawCount}건은 확인됐지만 ${target}과 직접 연결되는 자료로 검증되지 않아 보고서에서 제외했습니다. 대상명만으로 동명이 대상이 섞일 수 있으므로 회사명 전체, 지역, 홈페이지 등 식별정보를 함께 입력하면 정확도가 높아집니다.`,
      sourceIds:[], sourceCount:0,
      reputationStatus:'none',
      reputationMessage:'직접 일치가 검증된 평판 자료가 없어 평판을 판단하지 않습니다.'
    };
  }
  return {
    status:'unidentified',
    overview:`자동 검색 공급원은 정상 응답했지만 ${target}에 관한 검색 결과가 반환되지 않았습니다. 다른 표기, 회사명 전체, 지역, 홈페이지 등을 포함해 다시 확인할 수 있습니다.`,
    sourceIds:[], sourceCount:0,
    reputationStatus:'none',
    reputationMessage:'확인 가능한 평판 자료가 없습니다. 자료 부재는 신뢰성이나 품질에 대한 긍정·부정 판단 근거가 아닙니다.'
  };
}
function reportSummary(target, signals, profile) {
  const strong = signals.filter(isStrongSignal).slice(0,3);
  if (!strong.length) return `${profile.overview} ${profile.reputationMessage}`;
  const parts = strong.map(s =>
    s.state === 'conflicted' ? `${s.topic}에서는 독립 출처 간 긍정·부정 평가가 함께 나타납니다`
    : s.state === 'negative' ? `${s.topic} 관련 부정적 신호가 독립된 복수 출처에서 반복됩니다`
    : s.state === 'positive' ? `${s.topic} 관련 긍정적 신호가 독립된 복수 출처에서 반복됩니다`
    : `${s.topic} 관련 언급이 독립된 복수 출처에서 반복됩니다`
  );
  return `${target}과 직접 연결되는 공개자료만 남겨 교차 확인했습니다. ${parts.join('. ')}. 아래 근거 원문을 함께 확인하십시오.`;
}
function searchLinks(type,target) {
  const q = encodeURIComponent(target);
  const links = [
    {label:'Google 웹검색',url:`https://www.google.com/search?q=${q}`},
    {label:'네이버 통합검색',url:`https://search.naver.com/search.naver?query=${q}`},
    {label:'다음 검색',url:`https://search.daum.net/search?q=${q}`}
  ];
  if (type === 'organization') links.push(
    {label:'잡코리아 관련검색',url:`https://www.google.com/search?q=site%3Ajobkorea.co.kr+${q}`},
    {label:'사람인 관련검색',url:`https://www.google.com/search?q=site%3Asaramin.co.kr+${q}`},
    {label:'잡플래닛 관련검색',url:`https://www.google.com/search?q=site%3Ajobplanet.co.kr+${q}`}
  );
  if (type === 'place') links.push(
    {label:'카카오맵 검색',url:`https://map.kakao.com/?q=${q}`},
    {label:'네이버지도 검색',url:`https://map.naver.com/p/search/${q}`}
  );
  if (type === 'product') links.push({label:'쿠팡 관련검색',url:`https://www.google.com/search?q=site%3Acoupang.com+${q}+상품평`});
  return links;
}

async function runQuery(spec, target, provider) {
  const query = spec.q.replaceAll('{target}',target);
  const url = provider === 'google-news' ? googleNewsUrl(query) : bingRssUrl(query);
  try {
    const xml = await fetchText(url);
    return { ok:true, items:parseRss(xml,provider === 'google-news' ? 'Google News RSS' : 'Bing Web RSS',spec) };
  } catch {
    return { ok:false, items:[] };
  }
}
async function collectBatch(specs, target) {
  const tasks = [];
  for (const spec of specs || []) {
    tasks.push(runQuery(spec,target,'bing'));
    if (spec.group === '공식·언론') tasks.push(runQuery(spec,target,'google-news'));
  }
  const results = await Promise.all(tasks);
  return {
    items:results.flatMap(r => r.items),
    requests:results.length,
    successful:results.filter(r => r.ok).length,
    failed:results.filter(r => !r.ok).length
  };
}
async function collect(type,target) {
  const primary = await collectBatch(SOURCE_QUERIES[type] || [],target);
  let combinedItems = primary.items;
  let requests = primary.requests;
  let successfulRequests = primary.successful;
  let failedRequests = primary.failed;
  let fallbackUsed = false;

  let raw = dedupe(combinedItems);
  let relevant = raw.filter(item => relevantToTarget(type,target,item));
  const hasProfile = relevant.some(item => NON_REPUTATION_GROUPS.has(item.group));

  if (relevant.length < 4 || !hasProfile) {
    fallbackUsed = true;
    const fallback = await collectBatch(FALLBACK_QUERIES[type] || [],target);
    combinedItems = combinedItems.concat(fallback.items);
    requests += fallback.requests;
    successfulRequests += fallback.successful;
    failedRequests += fallback.failed;
    raw = dedupe(combinedItems);
    relevant = raw.filter(item => relevantToTarget(type,target,item));
  }

  return {
    items:diversify(relevant,3,24),
    rawCount:raw.length,
    relevantCount:relevant.length,
    irrelevantCount:raw.length-relevant.length,
    fallbackUsed,
    requests,
    successfulRequests,
    failedRequests
  };
}

async function analyze(type,target) {
  const collection = await collect(type,target);
  const evidence = annotateEvidence(type,collection.items);
  const safe = evidence.filter(e => !e.highRisk);
  const held = evidence.filter(e => e.highRisk).map(e => ({
    id:e.id,
    reason:'고위험 주장 키워드가 포함되어 자동 요약에서 제외',
    url:e.url,
    title:e.title
  }));
  const reputationEvidence = safe.filter(e => !NON_REPUTATION_GROUPS.has(e.group));
  const signals = buildSignals(type,reputationEvidence);
  const generatedAt = new Date().toISOString();
  const profile = buildProfile(type,target,safe,reputationEvidence,signals,collection);

  return {
    ok:true,
    schema:'nexus-reputation-analysis-v3.1',
    target:{type,typeLabel:TARGET_TYPES[type].label,name:target},
    generatedAt,
    methodology:{
      mode:'public-source-osint',
      stages:['정밀 검색','직접명 검색 보강','대상명 직접일치 확인','기본정보 확인','평판자료 분리','중복 제거','출처 다양화','주제 분류','상반 평가 탐지','고위험 주장 분리','근거 연결'],
      note:`먼저 정밀 검색을 수행하고 결과가 적거나 기본정보가 없으면 대상명 직접검색과 유형별 보강검색을 자동으로 추가합니다. 검색 결과 중 대상명 또는 대상 식별 토큰이 실제 제목·본문·출처에 확인되는 자료만 남깁니다.${collection.fallbackUsed ? ' 이번 분석에는 직접검색 보강이 사용됐습니다.' : ''} 공개 웹에서 자동 확인 가능한 범위의 1차 분석이며 유료·로그인 제한 자료, 비공개 정보, 접근 제한 원문은 포함하지 않습니다.`
    },
    profile,
    executiveSummary:reportSummary(target,signals,profile),
    metrics:{
      sources:safe.length,
      profileSources:profile.sourceCount,
      reputationSources:reputationEvidence.length,
      independentHosts:new Set(safe.map(e => e.host).filter(Boolean)).size,
      filteredIrrelevant:collection.irrelevantCount,
      rawCandidates:collection.rawCount,
      matchedCandidates:collection.relevantCount,
      searchRequests:collection.requests,
      searchSucceeded:collection.successfulRequests,
      searchFailed:collection.failedRequests,
      fallbackUsed:collection.fallbackUsed,
      heldHighRisk:held.length,
      signals:signals.length
    },
    signals,
    evidence:safe,
    heldEvidence:held,
    searchLinks:searchLinks(type,target),
    disclaimer:'대상과 직접 연결되지 않는 검색 결과는 제외합니다. 자동 검색 공급원 장애와 실제 자료 부재를 구분합니다. 공개 평판 자료가 없거나 적다는 사실은 대상의 신뢰성이나 품질에 대한 긍정·부정 판단을 의미하지 않습니다. 중요한 결정에는 원문과 공식자료를 직접 확인하십시오.'
  };
}

export async function onRequestPost({request}) {
  let body;
  try { body = await request.json(); } catch { return json({ok:false,error:'invalid_json'},400); }
  const type = clean(body?.type,24), target = clean(body?.target,120);
  if (!TARGET_TYPES[type]) return json({ok:false,error:'invalid_type'},400);
  if (target.length < 2) return json({ok:false,error:'target_too_short'},400);
  return json(await analyze(type,target));
}

export async function onRequestGet({request}) {
  const url = new URL(request.url);
  const type = clean(url.searchParams.get('type'),24);
  const target = clean(url.searchParams.get('target'),120);
  if (type || target) {
    if (!TARGET_TYPES[type]) return json({ok:false,error:'invalid_type'},400);
    if (target.length < 2) return json({ok:false,error:'target_too_short'},400);
    return json(await analyze(type,target));
  }
  return json({
    ok:true,
    service:'NEXUS 평판 분석',
    version:'3.1',
    types:Object.entries(TARGET_TYPES).map(([id,v]) => ({id,label:v.label}))
  });
}
