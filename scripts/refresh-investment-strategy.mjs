import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PAGE = path.join(ROOT, 'nexus', 'investment-strategy', 'index.html');
const STOCK_CODE = '138360';
const STOCK_NAME = '앤로보틱스';
const KST = 'Asia/Seoul';

function number(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const parsed = Number(String(value).replace(/[^0-9+\-.]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function pct(value) {
  const n = number(value);
  return n === null ? '-' : `${n > 0 ? '+' : ''}${n.toFixed(2)}%`;
}

function num(value, digits = 2) {
  const n = number(value);
  return n === null ? '-' : n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function won(value) {
  const n = number(value);
  return n === null ? '-' : `${Math.round(n).toLocaleString('ko-KR')}원`;
}

function dotDate(value) {
  return value ? String(value).slice(0, 10).replaceAll('-', '.') : '-';
}

function shortDate(value) {
  const [, m, d] = String(value || '').slice(0, 10).split('-');
  return m && d ? `${Number(m)}월 ${Number(d)}일` : '-';
}

function todayKst() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: KST,
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  const p = Object.fromEntries(parts.map(item => [item.type, item.value]));
  return `${p.year}-${p.month}-${p.day}`;
}

async function getJson(url, required = false) {
  let last;
  for (let i = 0; i < 3; i += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; YEHAVHA-Nexus/1.0)',
          'Accept': 'application/json,text/plain,*/*',
          'Referer': 'https://m.stock.naver.com/'
        },
        signal: AbortSignal.timeout(15000)
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.json();
    } catch (error) {
      last = error;
      if (i < 2) await new Promise(resolve => setTimeout(resolve, (i + 1) * 1000));
    }
  }
  if (required) throw new Error(`Required market data fetch failed: ${url} (${last?.message || 'unknown'})`);
  console.warn(`Optional market data unavailable: ${url}`);
  return null;
}

function objects(value, out = []) {
  if (!value || typeof value !== 'object') return out;
  if (Array.isArray(value)) {
    for (const item of value) objects(item, out);
    return out;
  }
  out.push(value);
  for (const item of Object.values(value)) objects(item, out);
  return out;
}

function find(data, predicate) {
  return objects(data).find(item => {
    try { return predicate(item); } catch { return false; }
  }) || null;
}

function first(item, keys) {
  for (const key of keys) {
    const value = number(item?.[key]);
    if (value !== null) return value;
  }
  return null;
}

function record(item) {
  if (!item) return null;
  const close = first(item, ['closePrice', 'tradePrice', 'nv']);
  if (close === null) return null;
  return {
    date: String(item.localTradedAt || item.localDate || '').slice(0, 10),
    close,
    high: first(item, ['highPrice', 'hv']),
    low: first(item, ['lowPrice', 'lv']),
    volume: first(item, ['accumulatedTradingVolume', 'aq']),
    change: first(item, ['compareToPreviousClosePrice', 'changeValue', 'cv']),
    ratio: first(item, ['fluctuationsRatio', 'changeRate', 'cr'])
  };
}

function replaceRequired(html, regex, replacement, label) {
  if (!regex.test(html)) throw new Error(`Target not found: ${label}`);
  regex.lastIndex = 0;
  return html.replace(regex, replacement);
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceAsset(html, title, body) {
  const t = escapeRegex(title);
  return replaceRequired(
    html,
    new RegExp(`(<article class="card"><h3>${t}<\\/h3>[\\s\\S]*?<div class="current">)[\\s\\S]*?(<\\/div><\\/article>)`),
    `$1${body}$2`,
    `asset:${title}`
  );
}

function replaceCase(html, title, body) {
  const t = escapeRegex(title);
  return replaceRequired(
    html,
    new RegExp(`<section class="case-box"><h4>${t}<\\/h4>[\\s\\S]*?<\\/section>`),
    `<section class="case-box"><h4>${title}</h4>${body}</section>`,
    `case:${title}`
  );
}

function existingKpi(html, label) {
  const match = html.match(new RegExp(`<div class="kpi"><span>${escapeRegex(label)}<\\/span><strong>(.*?)<\\/strong><\\/div>`));
  return match?.[1] || '-';
}

function marketDirection(a, b) {
  if (a?.ratio === null || b?.ratio === null || !a || !b) return '지수별 흐름을 분리해 확인할 구간';
  if (a.ratio > 0 && b.ratio > 0) return '대형주와 성장주가 동반 상승한 구간';
  if (a.ratio < 0 && b.ratio < 0) return '대형주와 성장주가 동반 약세인 구간';
  return '대형주와 성장주 방향이 엇갈리는 차별화 구간';
}

function trend(history) {
  const avg = values => values.length ? values.reduce((s, v) => s + v, 0) / values.length : null;
  const closes5 = history.slice(0, 5).map(v => v.close).filter(Number.isFinite);
  const closes20 = history.slice(0, 20).map(v => v.close).filter(Number.isFinite);
  const volumes = history.slice(1, 21).map(v => v.volume).filter(v => Number.isFinite(v) && v > 0);
  const latest = history[0];
  const ma5 = avg(closes5);
  const ma20 = avg(closes20);
  const support = closes5.length ? Math.min(...closes5) : null;
  const resistance = closes5.length ? Math.max(...closes5) : null;
  const support20 = closes20.length ? Math.min(...closes20) : null;
  const resistance20 = closes20.length ? Math.max(...closes20) : null;
  const averageVolume = avg(volumes);
  const volumeRatio = latest?.volume && averageVolume ? latest.volume / averageVolume : null;
  const old = history[Math.min(4, history.length - 1)];
  const fiveDayRatio = old?.close ? (latest.close - old.close) / old.close * 100 : null;
  let state = '방향성 확인 구간';
  if (latest?.close && ma5 && ma20) {
    if (latest.close >= ma5 && latest.close >= ma20) state = '단기·중기 평균 위의 상승 우위 구간';
    else if (latest.close < ma5 && latest.close >= ma20) state = '중기 추세 안의 단기 조정 구간';
    else if (latest.close >= ma5 && latest.close < ma20) state = '중기 약세권의 단기 반등 구간';
    else state = '단기·중기 평균 아래의 약세 구간';
  }
  return { ma5, ma20, support, resistance, support20, resistance20, volumeRatio, fiveDayRatio, state };
}

function judgement(latest, t, nxtPrice) {
  let text = '가격 데이터와 거래량을 함께 확인하는 구간입니다.';
  if (latest?.close && t.ma5 && t.ma20) {
    if (latest.close >= t.ma5 && latest.close >= t.ma20) text = '단기·중기 이동평균을 모두 웃돌아 가격 흐름은 우호적이지만 추격보다 지지 확인이 우선입니다.';
    else if (latest.close < t.ma5 && latest.close >= t.ma20) text = '중기 흐름은 유지되지만 단기 조정 중이므로 단기 저항 회복 여부가 중요합니다.';
    else if (latest.close >= t.ma5 && latest.close < t.ma20) text = '중기 약세권에서 반등을 시도하는 단계로 20일 평균 회복 전까지는 보수적으로 봅니다.';
    else text = '단기·중기 평균 아래에 있어 기술적으로 약세 우위이며 지지선 이탈 여부를 먼저 확인합니다.';
  }
  if (t.resistance) text += ` 단기적으로 ${won(t.resistance)} 부근 저항과 거래량 증가 여부를 확인합니다.`;
  if (nxtPrice && latest?.close && nxtPrice !== latest.close) text += ` NXT 애프터마켓 최종 확인값은 ${won(nxtPrice)}으로 KRX 종가와 구분합니다.`;
  return `${text} 중기 판단은 로봇 사업 매출 기여와 본업 영업이익 개선이 실제 숫자로 확인되는지를 함께 봅니다.`;
}

async function main() {
  let html = fs.readFileSync(PAGE, 'utf8');
  const urls = {
    stock: `https://m.stock.naver.com/api/stock/${STOCK_CODE}/basic`,
    history: `https://m.stock.naver.com/api/stock/${STOCK_CODE}/price?pageSize=60&page=1`,
    polling: `https://polling.finance.naver.com/api/realtime?query=SERVICE_ITEM:${STOCK_CODE}`,
    kospi: 'https://m.stock.naver.com/api/index/KOSPI/basic',
    kosdaq: 'https://m.stock.naver.com/api/index/KOSDAQ/basic',
    usa: 'https://api.stock.naver.com/index/nation/USA',
    japan: 'https://api.stock.naver.com/index/nation/JPN',
    china: 'https://api.stock.naver.com/index/nation/CHN',
    fx: 'https://m.stock.naver.com/front-api/marketIndex/exchange/main',
    energy: 'https://m.stock.naver.com/front-api/marketIndex/energy',
    metals: 'https://m.stock.naver.com/front-api/marketIndex/metals',
    crypto: 'https://m.stock.naver.com/front-api/crypto/top?exchangeType=UPBIT&sortType=marketCap&page=1&pageSize=20'
  };

  const [stock, historyRaw, polling, kospiRaw, kosdaqRaw, usa, japan, china, fx, energy, metals, crypto] = await Promise.all([
    getJson(urls.stock, true), getJson(urls.history, true), getJson(urls.polling),
    getJson(urls.kospi, true), getJson(urls.kosdaq, true), getJson(urls.usa), getJson(urls.japan),
    getJson(urls.china), getJson(urls.fx), getJson(urls.energy), getJson(urls.metals), getJson(urls.crypto)
  ]);

  const rows = (Array.isArray(historyRaw) ? historyRaw : objects(historyRaw))
    .map(record).filter(v => v?.date && v.close !== null).sort((a, b) => b.date.localeCompare(a.date));
  const latest = rows[0] || record(stock);
  const tradeDate = latest?.date || String(stock?.localTradedAt || '').slice(0, 10);
  if (!tradeDate) throw new Error('Latest KRX trading date is unavailable.');

  const today = todayKst();
  if (process.env.GITHUB_EVENT_NAME === 'schedule' && tradeDate !== today) {
    console.log(`No new KRX session: latest=${tradeDate}, today=${today}`);
    return;
  }

  const kospi = record(kospiRaw);
  const kosdaq = record(kosdaqRaw);
  const sp500 = record(find(usa, v => v.reutersCode === '.INX'));
  const nasdaq = record(find(usa, v => v.reutersCode === '.IXIC')) || record(find(usa, v => v.reutersCode === '.NDX'));
  const nikkei = record(find(japan, v => /nikkei|닛케이/i.test(`${v.indexName || ''} ${v.indexNameEng || ''}`))) || record(find(japan, v => number(v.closePrice) !== null));
  const csi = record(find(china, v => /csi.?300|상해|shanghai/i.test(`${v.indexName || ''} ${v.indexNameEng || ''}`))) || record(find(china, v => number(v.closePrice) !== null));
  const usdkrw = record(find(fx, v => v.reutersCode === 'FX_USDKRW' || /USD.*KRW|미국.*USD/i.test(`${v.reutersCode || ''} ${v.name || ''}`)));
  const wti = record(find(energy, v => v.symbolCode === 'CL' || /WTI/i.test(v.name || '')));
  const brent = record(find(energy, v => v.symbolCode === 'BRN' || /Brent|브렌트/i.test(v.name || '')));
  const gold = record(find(metals, v => v.symbolCode === 'GC' || /Gold|국제.*금/i.test(v.name || '')));
  const btc = record(find(crypto, v => v.nfTicker === 'BTC'));
  const eth = record(find(crypto, v => v.nfTicker === 'ETH'));

  const baseRate = number((html.match(/<span>한국은행 기준금리<\/span><strong>([0-9.]+)%<\/strong>/) || [])[1]);
  const pollingItem = polling?.result?.areas?.[0]?.datas?.[0] || null;
  const shares = first(pollingItem, ['countOfListedStock']);
  const marketCap = latest?.close && shares ? `약 ${Math.round(latest.close * shares / 100000000).toLocaleString('ko-KR')}억원` : existingKpi(html, '시가총액');
  const low52 = first(stock, ['lowPriceOf52Weeks', 'lowPrice52Weeks']);
  const high52 = first(stock, ['highPriceOf52Weeks', 'highPrice52Weeks']);
  const range52 = low52 && high52 ? `${Math.round(low52).toLocaleString('ko-KR')}~${Math.round(high52).toLocaleString('ko-KR')}원` : existingKpi(html, '52주 범위');
  const nxtRoot = stock?.overMarketPriceInfo || pollingItem?.nxtOverMarketPriceInfo || null;
  const nxtObject = find(nxtRoot, v => first(v, ['overPrice', 'closePrice', 'price', 'nv']) !== null) || nxtRoot;
  const nxtPrice = first(nxtObject, ['overPrice', 'closePrice', 'price', 'nv']);
  const t = trend(rows);

  html = replaceRequired(html, /<div class="section-head"><h2>오늘의 시장 대시보드<\/h2><p>[\s\S]*?<\/p><\/div>/,
    `<div class="section-head"><h2>오늘의 시장 대시보드</h2><p>매 거래일 20:30 KST 자동 갱신 · ${dotDate(tradeDate)} 기준</p></div>`, 'dashboard-head');

  if (kospi) {
    html = replaceRequired(html, /<a class="kospi-native"[\s\S]*?<\/a>/,
      `<a class="kospi-native" href="https://data.krx.co.kr/" target="_blank" rel="noopener"><span class="kospi-mark">KR</span><span class="kospi-data"><small>KRX 종가 · ${dotDate(tradeDate)}</small><strong>${num(kospi.close)}</strong><em>${kospi.change !== null ? `${kospi.change > 0 ? '+' : ''}${num(kospi.change)} · ` : ''}${pct(kospi.ratio)}</em></span></a>`, 'kospi-card');
  }

  const koreaCard = kospi && kosdaq
    ? `<div class="snapshot-card"><h3>한국 증시 · ${marketDirection(kospi, kosdaq)}</h3><p>${shortDate(tradeDate)} KRX 종가 기준 KOSPI는 <b>${num(kospi.close)}(${pct(kospi.ratio)})</b>, KOSDAQ은 <b>${num(kosdaq.close)}(${pct(kosdaq.ratio)})</b>입니다. 지수보다 거래대금과 업종별 수급이 동반되는지를 함께 확인합니다.</p></div>`
    : '<div class="snapshot-card"><h3>한국 증시 · 최근 거래일 확인</h3><p>국내 지수 자동 조회가 지연돼 KRX와 상단 위젯에서 최근 종가를 확인합니다.</p></div>';
  const usCard = sp500 && nasdaq
    ? `<div class="snapshot-card"><h3>미국 증시 · 최근 완료 거래 기준</h3><p>S&amp;P 500은 <b>${num(sp500.close)}(${pct(sp500.ratio)})</b>, Nasdaq은 <b>${num(nasdaq.close)}(${pct(nasdaq.ratio)})</b>입니다. 한국시간 20:30에는 미국 정규장 개장 전일 수 있어 최근 완료 거래와 당일 위젯을 구분합니다.</p></div>`
    : '<div class="snapshot-card"><h3>미국 증시 · 최근 완료 거래 기준</h3><p>미국 지수는 상단 위젯에서 최신값을 확인합니다.</p></div>';
  const asiaCard = nikkei || csi
    ? `<div class="snapshot-card"><h3>아시아 · 국가별 흐름 비교</h3><p>${nikkei ? `Nikkei 225 ${num(nikkei.close)}(${pct(nikkei.ratio)})` : '일본 위젯 확인'} · ${csi ? `중국 주요지수 ${num(csi.close)}(${pct(csi.ratio)})` : '중국 위젯 확인'}. 한국시장과 같은 방향이라고 가정하지 않고 국가별로 비교합니다.</p></div>`
    : '<div class="snapshot-card"><h3>아시아 · 국가별 흐름 비교</h3><p>일본·중국 시장은 상단 위젯에서 최근 종가와 방향을 확인합니다.</p></div>';
  const fxCard = usdkrw
    ? `<div class="snapshot-card"><h3>환율 · USD/KRW</h3><p>USD/KRW는 <b>${num(usdkrw.close)}원(${pct(usdkrw.ratio)})</b>입니다. 원화 방향은 외국인 수급과 수입물가, 달러자산 원화 환산수익에 함께 영향을 줍니다.</p></div>`
    : '<div class="snapshot-card"><h3>환율 · USD/KRW</h3><p>환율은 상단 실시간 위젯에서 확인합니다.</p></div>';
  const commodityCard = gold || wti
    ? `<div class="snapshot-card"><h3>금·유가 · 자산별 방향 분리</h3><p>${gold ? `국제 금 <b>$${num(gold.close)}(${pct(gold.ratio)})</b>` : '금 위젯 확인'}, ${wti ? `WTI <b>$${num(wti.close)}(${pct(wti.ratio)})</b>` : 'WTI 위젯 확인'}입니다. 금과 원유의 위험요인을 분리합니다.</p></div>`
    : '<div class="snapshot-card"><h3>금·유가 · 자산별 방향 분리</h3><p>금과 유가는 상단 위젯에서 최신값을 확인합니다.</p></div>';
  const cryptoCard = btc && eth
    ? `<div class="snapshot-card"><h3>가상자산 · 20:30 KST 스냅샷</h3><p>Upbit 기준 Bitcoin은 <b>${Math.round(btc.close).toLocaleString('ko-KR')}원(${pct(btc.ratio)})</b>, Ethereum은 <b>${Math.round(eth.close).toLocaleString('ko-KR')}원(${pct(eth.ratio)})</b>입니다. 24시간 시장이므로 이후에도 계속 변동합니다.</p></div>`
    : '<div class="snapshot-card"><h3>가상자산 · 20:30 KST 스냅샷</h3><p>24시간 시장은 매일 20:30 KST를 넥서스 일일 기준시점으로 사용합니다.</p></div>';

  html = replaceRequired(html, /<div class="snapshot"><div class="snapshot-head">[\s\S]*?<\/div><\/div>\n<div class="market-dashboard">/,
    `<div class="snapshot"><div class="snapshot-head"><strong>오늘의 종합 시황</strong><span>분석 기준 ${dotDate(tradeDate)} · 20:30 KST</span></div><div class="snapshot-grid">${koreaCard}${usCard}${asiaCard}${fxCard}${commodityCard}${cryptoCard}</div></div>\n<div class="market-dashboard">`, 'snapshot');

  const signals = [
    `<div class="signal"><strong>1 · 증시</strong><span>${kospi && kosdaq ? `KOSPI ${pct(kospi.ratio)}, KOSDAQ ${pct(kosdaq.ratio)}. ${marketDirection(kospi, kosdaq)}.` : 'KRX 최근 종가 확인.'}</span></div>`,
    `<div class="signal"><strong>2 · 환율</strong><span>${usdkrw ? `USD/KRW ${num(usdkrw.close)}원(${pct(usdkrw.ratio)}).` : 'USD/KRW 위젯 확인.'}</span></div>`,
    `<div class="signal"><strong>3 · 유가</strong><span>${wti ? `WTI $${num(wti.close)}(${pct(wti.ratio)})${brent ? ` · Brent $${num(brent.close)}(${pct(brent.ratio)})` : ''}.` : 'WTI·Brent 위젯 확인.'}</span></div>`,
    `<div class="signal"><strong>4 · 금</strong><span>${gold ? `국제 금 $${num(gold.close)}(${pct(gold.ratio)}).` : '국제 금 위젯 확인.'}</span></div>`,
    `<div class="signal"><strong>5 · 코인</strong><span>${btc && eth ? `BTC ${pct(btc.ratio)}, ETH ${pct(eth.ratio)}. 20:30 이후 변동은 별도 확인.` : '20:30 기준점과 이후 변동을 구분.'}</span></div>`,
    `<div class="signal"><strong>6 · 금리</strong><span>${baseRate !== null ? `한국 기준금리 ${baseRate.toFixed(2)}%. 공식 변경 시 별도 검증 후 반영.` : '한국은행 공식 기준금리 확인.'}</span></div>`
  ].join('');
  html = replaceRequired(html, /<div class="signal-chain">[\s\S]*?<\/div><p class="source-strip">[\s\S]*?<\/p>/,
    `<div class="signal-chain">${signals}</div><p class="source-strip">일일 시세는 네이버 금융 공개 데이터와 페이지 내 TradingView 위젯을 기준으로 갱신합니다. KRX 정규장 종가와 NXT 애프터마켓 가격은 구분하며, 기업공시·실적·자본구조·기준금리는 공식 자료를 별도 검증한 뒤 기존 항목 안에서 수정합니다.</p>`, 'signals');

  html = replaceAsset(html, '증권', `<strong>현재 해석</strong><p>${kospi && kosdaq ? `최근 KRX 거래일 기준 KOSPI ${pct(kospi.ratio)}, KOSDAQ ${pct(kosdaq.ratio)}로 ${marketDirection(kospi, kosdaq)}입니다.` : '국내 지수의 최근 KRX 종가를 확인합니다.'} 지수 등락만 따라가기보다 거래대금, 외국인·기관 수급, 기업 실적을 함께 봅니다.</p><ul><li>기업: 매출·영업이익·현금흐름이 가격 상승을 따라가는지</li><li>시장: 외국인·기관 수급과 거래대금이 동반되는지</li><li>가격: KRX 종가와 NXT 애프터마켓 가격을 구분해 확인</li></ul>`);
  html = replaceAsset(html, '가상자산', `<strong>현재 해석</strong><p>${btc && eth ? `20:30 KST 기준 BTC ${pct(btc.ratio)}, ETH ${pct(eth.ratio)}입니다.` : '매일 20:30 KST를 일일 스냅샷으로 삼습니다.'} 24시간 시장이므로 기준시점 이후 급변 가능성을 별도로 봅니다.</p><ul><li>강세 확인: 현물 거래대금과 주요 자산 동조 여부</li><li>위험: 레버리지 청산, 달러·금리 변화, 규제·거래소 이벤트</li></ul>`);
  html = replaceAsset(html, '실물·대체자산', `<strong>현재 해석</strong><p>${gold ? `국제 금 ${pct(gold.ratio)}` : '금 위젯 확인'}, ${wti ? `WTI ${pct(wti.ratio)}` : 'WTI 위젯 확인'}입니다. 금의 통화·안전자산 성격과 원유의 공급·경기 민감도를 분리합니다.</p>`);
  if (baseRate !== null) {
    html = replaceAsset(html, '예금·적금·현금성 자산', `<strong>현재 해석</strong><p>현재 검증된 한국 기준금리는 ${baseRate.toFixed(2)}%입니다. 실제 예금·적금 상품금리는 금융기관별 최신 공시에서 다시 비교합니다.</p><ul><li>고정기간이 길수록 중도해지 불이익 확인</li><li>표시금리보다 세후금리·실수령액으로 비교</li></ul>`);
    html = replaceAsset(html, '경매·공매·입찰', `<strong>실제 판단 순서</strong><ul><li>등기부·대항력·우선변제·법정지상권 등 인수권리 확인</li><li>최근 실거래가와 동일 권역 낙찰가율 비교</li><li>취득세·명도·수리·체납·금융비용 합산</li><li>입찰상한 = 보수적 처분가 − 총비용 − 안전마진</li></ul><p>현재 기준금리 ${baseRate.toFixed(2)}%는 금융비용에 직접 영향을 주므로 과거 금리 기준으로 입찰상한을 두지 않습니다.</p>`);
  }

  const applied = kospi && kosdaq
    ? `<div class="applied"><strong>오늘 적용 예시:</strong> ${shortDate(tradeDate)} KRX 종가에서 KOSPI ${pct(kospi.ratio)}, KOSDAQ ${pct(kosdaq.ratio)}였습니다. ${marketDirection(kospi, kosdaq)}으로 읽되 지수 방향을 개별 종목 결론으로 바로 연결하지 않습니다.</div>`
    : '<div class="applied"><strong>오늘 적용 예시:</strong> 국내 지수의 최근 종가와 거래량을 먼저 확인한 뒤 개별 종목의 수급·실적·가격 구조를 분리합니다.</div>';
  html = replaceRequired(html, /<div class="applied"><strong>오늘 적용 예시:<\/strong>[\s\S]*?<\/div>/, applied, 'applied-example');

  html = replaceRequired(html, /<div class="section-head"><h2>분석 아카이브<\/h2><p>[\s\S]*?<\/p><\/div>/,
    '<div class="section-head"><h2>분석 아카이브</h2><p>새 카드를 누적하지 않고 기존 종목을 같은 위치에서 최신 분석으로 갱신합니다.</p></div>', 'archive-policy');
  html = replaceRequired(html, /<span class="stock-date">[\s\S]*?<\/span>/,
    `<span class="stock-date">자동 갱신 ${dotDate(today)} 20:30 KST · KRX 가격 기준 ${dotDate(tradeDate)} 종가</span>`, 'stock-date');
  html = replaceRequired(html, /<div class="stock-kpis">[\s\S]*?<\/div><div class="stock-grid">/,
    `<div class="stock-kpis"><div class="kpi"><span>KRX 기준가격</span><strong>${won(latest.close)}</strong></div><div class="kpi"><span>${shortDate(tradeDate)} 변동</span><strong>${pct(latest.ratio ?? stock?.fluctuationsRatio)}</strong></div><div class="kpi"><span>시가총액</span><strong>${marketCap}</strong></div><div class="kpi"><span>52주 범위</span><strong>${range52}</strong></div></div><div class="stock-grid">`, 'stock-kpis');

  const volumeText = t.volumeRatio === null ? '거래량은 추가 확인이 필요합니다.' : `당일 거래량은 최근 20거래일 평균의 약 ${t.volumeRatio.toFixed(2)}배입니다.`;
  const fiveText = t.fiveDayRatio === null ? '' : ` 최근 5거래일 기준 ${pct(t.fiveDayRatio)} 변동했습니다.`;
  html = replaceCase(html, '기업·사업 구조', '<p>기존 식품가공·자동화설비 사업에 2026년 로봇 전문기업 나이콤 인수·합병이 결합됐습니다. 단기 주가와 분리해 기존 설비 실적과 로봇 사업의 실제 매출 전환을 중심으로 확인합니다.</p>');
  html = replaceCase(html, '실적과 이익의 질', '<p>최근 확인된 정기보고서 기준 2025년 매출 234억원, 영업이익 6억원으로 영업흑자 전환했고 2026년 반기 별도 기준 매출 168억원, 영업이익 4억원, 순이익 44억원입니다. 순이익과 영업이익의 차이를 만드는 영업외 손익의 지속 가능성이 핵심입니다.</p>');
  html = replaceCase(html, '최근 가격 흐름', `<p>${shortDate(tradeDate)} KRX 종가는 ${won(latest.close)}(${pct(latest.ratio)})입니다.${fiveText} 현재는 ${t.state}입니다. ${volumeText}</p>`);
  const levels = [
    t.support ? `<li>${won(t.support)}: 최근 5거래일 단기 지지 후보</li>` : '',
    t.resistance ? `<li>${won(t.resistance)}: 최근 5거래일 단기 저항 후보</li>` : '',
    t.support20 && t.support20 !== t.support ? `<li>${won(t.support20)}: 최근 20거래일 주요 지지 후보</li>` : '',
    t.resistance20 && t.resistance20 !== t.resistance ? `<li>${won(t.resistance20)}: 최근 20거래일 주요 저항 후보</li>` : ''
  ].filter(Boolean).join('');
  html = replaceCase(html, '관찰 가격대', `<ul>${levels || '<li>가격 이력 데이터 재확인 필요</li>'}</ul>`);
  html = replaceCase(html, '자본구조 변화', '<p>7월 제3자배정 유상증자 13,513,514주가 추가 상장됐고 해당 물량은 2027년 7월 19일까지 의무보유입니다. 이후 2,531,302주가 소각돼 상장주식수는 87,973,934주입니다. 후속 상장·소각·전환 관련 공식 공시가 확인될 때 이 기존 문장을 갱신합니다.</p>');
  html = replaceCase(html, '핵심 위험', `<ul><li>급등·급락에서 확인된 높은 변동성</li><li>로봇 사업의 실제 실적 기여 속도 불확실</li><li>영업외 손익의 지속 가능성</li><li>${t.support ? `${won(t.support)} 부근 단기 지지 이탈 시 변동성 확대 가능성` : '단기 지지 이탈 시 변동성 확대 가능성'}</li></ul>`);
  html = replaceCase(html, '현재 판단', `<p>${judgement(latest, t, nxtPrice)}</p>`);

  const nxtNote = nxtPrice ? ` NXT 애프터마켓 최종 확인값은 ${won(nxtPrice)}이며 KRX 정규장 종가와 구분합니다.` : '';
  html = replaceRequired(html, /<div class="source-note">[\s\S]*?<a href="https:\/\/kind\.krx\.co\.kr\/"[\s\S]*?<\/a><\/div>/,
    `<div class="source-note">일일 자동 갱신: ${dotDate(today)} 20:30 KST. 가격·거래량·기술적 구간은 최근 완료 KRX 거래일(${dotDate(tradeDate)}) 공개 시세로 기존 항목을 덮어씁니다.${nxtNote} 기업공시·실적·자본구조·기준금리는 공식 자료를 별도 검증해 변동이 있을 때 같은 항목 안에서 수정합니다. <a href="https://kind.krx.co.kr/" target="_blank" rel="noopener">KRX KIND</a></div>`, 'source-note');

  if (!html.includes('새 카드를 누적하지 않고 기존 종목을 같은 위치에서 최신 분석으로 갱신합니다.')) {
    throw new Error('Overwrite-only policy marker missing.');
  }

  fs.writeFileSync(PAGE, html, 'utf8');
  console.log(`Investment strategy refreshed: ${STOCK_NAME}, KRX ${tradeDate}, ${won(latest.close)} (${pct(latest.ratio)})`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
