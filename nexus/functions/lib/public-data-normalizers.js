const COMMON_TITLE_KO = ['title', 'name', '명칭', '공고명', '사업명', '법령명한글', '법령명', '사건명', '의안명', 'BILL_NAME'];
const COMMON_TITLE_EN = ['titleEn', 'title_en', '영문명', '법령명영문', '학교 영문명', 'BILL_NAME_ENG'];
const COMMON_DATE = ['date', '기준일자', '데이터기준일자', '수정일자', '공고일자', '시행일자', '선고일자', '의결일', 'PROPOSE_DT', 'PROC_DT'];
const COMMON_ORG = ['organization', '기관명', '소관부처명', '소관부처', '제공기관', '주관기관', '지원기관', '법원명', '법원', 'COMMITTEE'];
const COMMON_REGION = ['region', '지역', '시도명', '시군구명', '소재지', '소재지도로명주소', 'SIDO_NM'];
const COMMON_STATUS = ['status', '상태', '처리상태', '진행상태', '제개정구분명', '종국결과', 'PROC_RESULT_CD'];
const COMMON_SUMMARY = ['summary', '요약', '내용', '설명', '비고', '제안이유', '제안이유및주요내용', 'BILL_SUMMARY'];
const COMMON_ID = ['id', 'ID', '법령ID', '법령일련번호', '사건번호', '공고번호', '사업번호', 'BILL_ID', 'BILL_NO'];
const COMMON_URL = ['url', 'URL', 'link', '링크', '원문URL', '홈페이지주소', 'DETAIL_LINK'];

const RULES = Object.freeze({
  'law-current': {
    titleKo: ['법령명한글', '법령명'], titleEn: ['법령명영문'], date: ['시행일자', '공포일자'], org: ['소관부처명', '소관부처'], status: ['제개정구분명', '법령구분명'], id: ['법령ID', '법령일련번호']
  },
  'precedent-list': {
    titleKo: ['사건명', '판례명'], date: ['선고일자', '선고일'], org: ['법원명', '법원'], status: ['종국결과', '판결유형'], id: ['판례일련번호', '사건번호']
  },
  'admin-rule-list': {
    titleKo: ['행정규칙명', '행정규칙명한글', '명칭'], date: ['발령일자', '시행일자', '공포일자'], org: ['소관부처명', '발령기관명'], status: ['제개정구분명'], id: ['행정규칙ID', '행정규칙일련번호']
  },
  'interpretation-list': {
    titleKo: ['안건명', '법령해석례명', '질의제목'], date: ['회신일자', '해석일자'], org: ['회신기관명', '해석기관명'], status: ['회신구분명'], id: ['법령해석례일련번호', '안건번호']
  },
  'ordinance-list': {
    titleKo: ['자치법규명', '자치법규명한글', '법규명'], date: ['시행일자', '공포일자'], org: ['자치단체명', '소관부서명'], region: ['자치단체명'], status: ['제개정구분명'], id: ['자치법규ID', '자치법규일련번호']
  },
  'g2b-bid-construction': g2bBidRule(),
  'g2b-bid-service': g2bBidRule(),
  'g2b-bid-goods': g2bBidRule(),
  'g2b-contract-construction': g2bContractRule(),
  'g2b-contract-service': g2bContractRule(),
  'g2b-contract-goods': g2bContractRule(),
  'apt-trade': {
    titleKo: ['아파트', '아파트명', 'aptNm'], date: ['dealYear', '년', 'DEAL_YMD', '거래일'], org: [], region: ['sggCd', '법정동', 'umdNm'], status: ['거래유형', 'dealingGbn'], id: ['거래금액', 'dealAmount']
  },
  'customs-trade-total': {
    titleKo: ['statKor', 'statCdNm', '품목명'], date: ['year', '기간', 'balPayments'], org: ['관세청'], region: ['countryNm', '국가명'], status: [], id: []
  },
  'airkorea-realtime': {
    titleKo: ['stationName', '측정소명'], date: ['dataTime'], org: ['mangName'], region: ['sidoName'], status: ['khaiGrade', 'pm10Grade', 'pm25Grade'], id: ['stationName']
  },
  'airkorea-forecast': {
    titleKo: ['informCode', 'informOverall'], date: ['dataTime', 'informData'], org: ['informCause'], region: [], status: ['informGrade'], id: ['dataTime', 'informCode']
  },
  'weather-ultra-now': weatherRule(),
  'weather-short-forecast': weatherRule(),
  'assembly-bill-search': assemblyRule(),
  'assembly-bill-detail': assemblyRule(),
  'assembly-bill-review': assemblyRule()
});

function g2bBidRule() {
  return {
    titleKo: ['bidNtceNm', 'bidNtceName', 'ntceNm'], date: ['bidNtceDt', 'bidClseDt', 'opengDt'], org: ['ntceInsttNm', 'dminsttNm', 'orderInsttNm'], region: ['ntceInsttOfclTelNo'], status: ['bidMethdNm', 'cntrctCnclsMthdNm'], id: ['bidNtceNo'], url: ['bidNtceDtlUrl']
  };
}

function g2bContractRule() {
  return {
    titleKo: ['cntrctNm', 'contractNm', 'cntrctName'], date: ['cntrctCnclsDate', 'cntrctDt', 'contractDate'], org: ['cntrctInsttNm', 'dminsttNm', 'orderInsttNm'], region: [], status: ['cntrctCnclsMthdNm', 'cntrctGbnNm'], id: ['cntrctNo', 'bidNtceNo'], url: ['cntrctDtlInfoUrl']
  };
}

function weatherRule() {
  return {
    titleKo: ['category'], titleEn: [], date: ['baseDate', 'fcstDate'], org: [], region: ['nx', 'ny'], status: ['obsrValue', 'fcstValue'], id: ['baseDate', 'baseTime', 'category']
  };
}

function assemblyRule() {
  return {
    titleKo: ['BILL_NAME', 'BILL_NAME_KOR', '의안명'], titleEn: ['BILL_NAME_ENG'], date: ['PROPOSE_DT', 'PROC_DT', 'COMMITTEE_DT'], org: ['COMMITTEE', 'CURR_COMMITTEE'], region: [], status: ['PROC_RESULT_CD', 'PROC_RESULT', 'COMMITTEE_RESULT'], summary: ['BILL_SUMMARY', 'SUMMARY'], id: ['BILL_ID', 'BILL_NO'], url: ['DETAIL_LINK']
  };
}

function pick(record, keys = []) {
  for (const key of keys) {
    const value = record?.[key];
    if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
  }
  return '';
}

function stripMarkup(value) {
  return String(value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function decodeXml(value) {
  return String(value || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&amp;/g, '&');
}

function xmlItems(text) {
  if (typeof text !== 'string' || !text.includes('<')) return [];
  const out = [];
  const itemPattern = /<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi;
  let itemMatch;
  while ((itemMatch = itemPattern.exec(text))) {
    const record = {};
    const fieldPattern = /<([A-Za-z0-9_가-힣:-]+)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/g;
    let fieldMatch;
    while ((fieldMatch = fieldPattern.exec(itemMatch[1]))) {
      record[fieldMatch[1]] = stripMarkup(decodeXml(fieldMatch[2]));
    }
    if (Object.keys(record).length) out.push(record);
  }
  return out;
}

function arrayOfObjects(value) {
  return Array.isArray(value) && value.some((item) => item && typeof item === 'object' && !Array.isArray(item));
}

function extractRecords(payload) {
  if (!payload) return [];
  if (typeof payload === 'string') return xmlItems(payload);
  if (arrayOfObjects(payload)) return payload;
  if (typeof payload !== 'object') return [];

  const preferred = ['row', 'item', 'law', 'prec', 'admrul', 'expc', 'ordin', 'data', 'list'];
  const queue = [payload];
  const seen = new Set();
  let fallback = null;

  while (queue.length) {
    const value = queue.shift();
    if (!value || typeof value !== 'object' || seen.has(value)) continue;
    seen.add(value);

    for (const key of preferred) {
      if (arrayOfObjects(value[key])) return value[key];
      if (value[key] && typeof value[key] === 'object' && !Array.isArray(value[key])) {
        const child = value[key];
        if (Object.keys(child).length > 2 && !fallback) fallback = [child];
      }
    }

    for (const child of Object.values(value)) {
      if (arrayOfObjects(child) && !fallback) fallback = child;
      if (child && typeof child === 'object') queue.push(child);
    }
  }

  return fallback || [];
}

function normalizeDate(value, record, sourceId) {
  if (sourceId === 'apt-trade') {
    const year = pick(record, ['dealYear', '년']);
    const month = pick(record, ['dealMonth', '월']);
    const day = pick(record, ['dealDay', '일']);
    if (year && month) return `${year}-${String(month).padStart(2, '0')}${day ? `-${String(day).padStart(2, '0')}` : ''}`;
  }
  const raw = String(value || '').trim();
  if (/^\d{8}$/.test(raw)) return `${raw.slice(0,4)}-${raw.slice(4,6)}-${raw.slice(6,8)}`;
  return raw;
}

function summaryFor(sourceId, record, rule, source) {
  const direct = stripMarkup(pick(record, rule.summary || COMMON_SUMMARY));
  if (direct) return direct;

  if (sourceId.startsWith('g2b-bid-')) {
    return [pick(record, ['ntceInsttNm', 'dminsttNm']), pick(record, ['bidClseDt']), pick(record, ['presmptPrce', 'asignBdgtAmt']) ? `예정금액 ${pick(record, ['presmptPrce', 'asignBdgtAmt'])}` : ''].filter(Boolean).join(' · ');
  }
  if (sourceId.startsWith('g2b-contract-')) {
    return [pick(record, ['cntrctInsttNm', 'dminsttNm']), pick(record, ['totCntrctAmt', 'cntrctAmt']) ? `계약금액 ${pick(record, ['totCntrctAmt', 'cntrctAmt'])}` : ''].filter(Boolean).join(' · ');
  }
  if (sourceId === 'apt-trade') {
    return [pick(record, ['umdNm', '법정동']), pick(record, ['excluUseAr', '전용면적']) ? `전용 ${pick(record, ['excluUseAr', '전용면적'])}㎡` : '', pick(record, ['dealAmount', '거래금액']) ? `거래금액 ${pick(record, ['dealAmount', '거래금액'])}` : ''].filter(Boolean).join(' · ');
  }
  if (sourceId === 'airkorea-realtime') {
    return [`PM10 ${pick(record, ['pm10Value']) || '-'}㎍/㎥`, `PM2.5 ${pick(record, ['pm25Value']) || '-'}㎍/㎥`, `통합대기 ${pick(record, ['khaiValue']) || '-'}`].join(' · ');
  }
  if (sourceId.startsWith('weather-')) {
    return [pick(record, ['category']), pick(record, ['obsrValue', 'fcstValue'])].filter(Boolean).join(' ');
  }

  const pieces = [pick(record, rule.org || COMMON_ORG), pick(record, rule.status || COMMON_STATUS), pick(record, rule.date || COMMON_DATE)].filter(Boolean);
  return pieces.join(' · ') || `${source.provider} 공식 데이터`;
}

function originalUrl(record, rule, source) {
  return pick(record, rule.url || COMMON_URL) || source.sourceUrl || source.docsUrl || '';
}

function stableId(sourceId, record, rule, index, titleKo, date) {
  const direct = pick(record, rule.id || COMMON_ID);
  if (direct) return direct;
  const basis = `${titleKo}|${date}`.replace(/\s+/g, ' ').trim().slice(0, 160);
  return basis ? `${sourceId}:${basis}` : `${sourceId}:${index + 1}`;
}

function normalizedRecord(sourceId, source, record, index, fetchedAt) {
  const rule = RULES[sourceId] || {};
  const titleKo = stripMarkup(pick(record, rule.titleKo || COMMON_TITLE_KO)) || source.title;
  const exactEnglish = stripMarkup(pick(record, rule.titleEn || COMMON_TITLE_EN));
  const titleEn = exactEnglish || source.titleEn || '';
  const date = normalizeDate(pick(record, rule.date || COMMON_DATE), record, sourceId);
  const organization = stripMarkup(pick(record, rule.org || COMMON_ORG)) || source.provider;
  const region = stripMarkup(pick(record, rule.region || COMMON_REGION));
  const status = stripMarkup(pick(record, rule.status || COMMON_STATUS));

  return {
    source: sourceId,
    category: source.category || source.axis || 'public-data',
    title: { ko: titleKo, en: titleEn },
    date,
    organization,
    region,
    status,
    summary: summaryFor(sourceId, record, rule, source),
    original_url: originalUrl(record, rule, source),
    raw_id: stableId(sourceId, record, rule, index, titleKo, date),
    updated_at: fetchedAt,
    metadata: { provider: source.provider, axis: source.axis, ...record }
  };
}

export function normalizePublicData(sourceId, source, payload, fetchedAt = new Date().toISOString()) {
  const records = extractRecords(payload);
  return records.map((record, index) => normalizedRecord(sourceId, source, record, index, fetchedAt));
}

export const NEXUS_PUBLIC_DATA_SCHEMA = Object.freeze({
  version: 'nexus-public-data/v2',
  fields: ['source', 'category', 'title', 'date', 'organization', 'region', 'status', 'summary', 'original_url', 'raw_id', 'updated_at', 'metadata']
});
