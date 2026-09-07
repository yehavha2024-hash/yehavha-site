const LAW_SEARCH_URL = 'https://www.law.go.kr/DRF/lawSearch.do';
const LAW_SERVICE_URL = 'https://www.law.go.kr/DRF/lawService.do';
const G2B_BID_URL = 'https://apis.data.go.kr/1230000/ad/BidPublicInfoService';
const G2B_CONTRACT_URL = 'https://apis.data.go.kr/1230000/ao/CntrctInfoService';
const ASSEMBLY_OPEN_API = 'https://open.assembly.go.kr/portal/openapi';

const LAW_AUTH = Object.freeze({ env: 'LAW_OPEN_DATA_OC', param: 'OC' });
const DATA_GO_KR_AUTH = Object.freeze({ env: 'DATA_GO_KR_SERVICE_KEY', param: 'serviceKey' });
const ASSEMBLY_AUTH = Object.freeze({ env: 'ASSEMBLY_API_KEY', param: 'KEY' });

function freezeSource(source, meta = {}) {
  return Object.freeze({
    category: meta.category || source.axis || 'public-data',
    owner: meta.owner || null,
    titleEn: meta.titleEn || '',
    cacheTtl: Number.isFinite(meta.cacheTtl) ? meta.cacheTtl : 900,
    sourceUrl: meta.sourceUrl || '',
    docsUrl: meta.docsUrl || '',
    activation: meta.activation || { state: 'active' },
    ...source
  });
}

function lawList(target, title, titleEn, allowedParams, fixedParams = {}) {
  return freezeSource({
    axis: 'legal',
    provider: '법제처 국가법령정보 공동활용',
    title,
    method: 'GET',
    url: LAW_SEARCH_URL,
    auth: LAW_AUTH,
    fixedParams: { target, type: 'JSON', ...fixedParams },
    allowedParams,
    requiredParams: [],
    responseFormat: 'json'
  }, {
    category: 'law', owner: 'legal-intelligence', titleEn, cacheTtl: 900,
    sourceUrl: 'https://www.law.go.kr/', docsUrl: 'https://www.law.go.kr/LSW/openApi/openApiInfo.do'
  });
}

function lawDetail(target, title, titleEn, allowedParams, requiredParams = [], requiredAny = []) {
  return freezeSource({
    axis: 'legal',
    provider: '법제처 국가법령정보 공동활용',
    title,
    method: 'GET',
    url: LAW_SERVICE_URL,
    auth: LAW_AUTH,
    fixedParams: { target, type: 'JSON' },
    allowedParams,
    requiredParams,
    requiredAny,
    responseFormat: 'json'
  }, {
    category: 'law', owner: 'legal-intelligence', titleEn, cacheTtl: 3600,
    sourceUrl: 'https://www.law.go.kr/', docsUrl: 'https://www.law.go.kr/LSW/openApi/openApiInfo.do'
  });
}

function dataGoKrGet(axis, owner, category, provider, title, titleEn, url, allowedParams, fixedParams = {}, responseFormat = 'auto', requiredParams = [], cacheTtl = 900, docsUrl = '') {
  return freezeSource({
    axis,
    provider,
    title,
    method: 'GET',
    url,
    auth: DATA_GO_KR_AUTH,
    fixedParams,
    allowedParams,
    requiredParams,
    responseFormat
  }, { category, owner, titleEn, cacheTtl, docsUrl });
}

function assemblyGet(code, title, titleEn, allowedParams, requiredParams = []) {
  return freezeSource({
    axis: 'legal',
    provider: '대한민국 국회 열린국회정보',
    title,
    method: 'GET',
    url: `${ASSEMBLY_OPEN_API}/${code}`,
    auth: ASSEMBLY_AUTH,
    fixedParams: { Type: 'json', pIndex: '1', pSize: '20' },
    allowedParams: ['pIndex', 'pSize', ...allowedParams],
    requiredParams,
    responseFormat: 'json'
  }, {
    category: 'legislation', owner: 'legal-intelligence', titleEn, cacheTtl: 900,
    sourceUrl: 'https://open.assembly.go.kr/', docsUrl: 'https://www.data.go.kr/data/15126096/openapi.do'
  });
}

export const PUBLIC_DATA_SOURCES = Object.freeze({
  'law-current': lawList(
    'eflaw', '현행·시행예정 법령 목록', 'Current & Upcoming Laws',
    ['search', 'query', 'display', 'page', 'sort', 'date', 'efYd', 'ancYd', 'ancNo', 'rrClsCd', 'nb', 'org', 'knd', 'lsChapNo', 'gana', 'popYn'],
    { nw: '2,3' }
  ),
  'law-detail': lawDetail('law', '법령 본문', 'Law Text', ['ID', 'MST', 'LM', 'LD', 'LN', 'JO'], [], [['ID', 'MST', 'LM']]),
  'law-effective-detail': lawDetail('eflaw', '시행일 기준 법령 본문', 'Effective Law Text', ['ID', 'MST', 'efYd', 'JO'], [], [['ID', 'MST']]),
  'precedent-list': lawList('prec', '판례 목록', 'Court Precedents', ['search', 'query', 'display', 'page', 'sort', 'date', 'prncYd', 'nb', 'org', 'curt', 'JO', 'gana', 'datSrcNm', 'popYn']),
  'precedent-detail': lawDetail('prec', '판례 본문', 'Precedent Text', ['ID', 'LM'], ['ID']),
  'admin-rule-list': lawList('admrul', '행정규칙 목록', 'Administrative Rules', ['nw', 'search', 'query', 'display', 'page', 'org', 'knd', 'gana', 'sort', 'date', 'prmlYd', 'modYd', 'nb', 'popYn']),
  'admin-rule-detail': lawDetail('admrul', '행정규칙 본문', 'Administrative Rule Text', ['ID', 'LID', 'LM'], [], [['ID', 'LID', 'LM']]),
  'interpretation-list': lawList('expc', '법령해석례 목록', 'Statutory Interpretations', ['search', 'query', 'display', 'page', 'inq', 'rpl', 'gana', 'itmno', 'regYd', 'explYd', 'sort', 'popYn']),
  'interpretation-detail': lawDetail('expc', '법령해석례 본문', 'Interpretation Text', ['ID', 'LM'], [], [['ID', 'LM']]),
  'ordinance-list': lawList('ordin', '자치법규 목록', 'Local Ordinances', ['nw', 'search', 'query', 'display', 'page', 'sort', 'date', 'efYd', 'ancYd', 'ancNo', 'nb', 'org', 'sborg', 'knd', 'rrClsCd', 'ordinFd', 'lsChapNo', 'gana', 'popYn']),
  'ordinance-detail': lawDetail('ordin', '자치법규 본문', 'Local Ordinance Text', ['ID', 'MST', 'LM'], [], [['ID', 'MST', 'LM']]),

  'assembly-bill-search': assemblyGet('TVBPMBILL11', '국회 의안검색', 'National Assembly Bill Search', ['AGE', 'BILL_ID', 'BILL_NO', 'BILL_NAME', 'PROPOSER', 'COMMITTEE']),
  'assembly-bill-detail': assemblyGet('BILLINFODETAIL', '국회 의안 상세정보', 'National Assembly Bill Details', ['AGE', 'BILL_ID', 'BILL_NO'], [['BILL_ID', 'BILL_NO']]),
  'assembly-bill-review': assemblyGet('BILLJUDGE', '국회 의안 심사정보', 'National Assembly Bill Review', ['AGE', 'BILL_ID', 'BILL_NO'], [['BILL_ID', 'BILL_NO']]),

  'g2b-bid-construction': dataGoKrGet('local-government', 'local-government-planning', 'procurement', '조달청 나라장터', '공사 입찰공고', 'Construction Bids', `${G2B_BID_URL}/getBidPblancListInfoCnstwk`, ['pageNo', 'numOfRows', 'inqryDiv', 'inqryBgnDt', 'inqryEndDt', 'bidNtceNo'], { type: 'json' }, 'json', [], 300),
  'g2b-bid-service': dataGoKrGet('local-government', 'local-government-planning', 'procurement', '조달청 나라장터', '용역 입찰공고', 'Service Bids', `${G2B_BID_URL}/getBidPblancListInfoServc`, ['pageNo', 'numOfRows', 'inqryDiv', 'inqryBgnDt', 'inqryEndDt', 'bidNtceNo'], { type: 'json' }, 'json', [], 300),
  'g2b-bid-goods': dataGoKrGet('local-government', 'local-government-planning', 'procurement', '조달청 나라장터', '물품 입찰공고', 'Goods Bids', `${G2B_BID_URL}/getBidPblancListInfoThng`, ['pageNo', 'numOfRows', 'inqryDiv', 'inqryBgnDt', 'inqryEndDt', 'bidNtceNo'], { type: 'json' }, 'json', [], 300),
  'g2b-contract-construction': dataGoKrGet('local-government', 'local-government-planning', 'contract', '조달청 나라장터', '공사 계약현황', 'Construction Contracts', `${G2B_CONTRACT_URL}/getCntrctInfoListCnstwk`, ['pageNo', 'numOfRows', 'inqryDiv', 'inqryBgnDt', 'inqryEndDt', 'cntrctNo', 'bidNtceNo', 'dminsttNm', 'cntrctInsttNm'], { type: 'json' }, 'json', [], 300),
  'g2b-contract-service': dataGoKrGet('local-government', 'local-government-planning', 'contract', '조달청 나라장터', '용역 계약현황', 'Service Contracts', `${G2B_CONTRACT_URL}/getCntrctInfoListServc`, ['pageNo', 'numOfRows', 'inqryDiv', 'inqryBgnDt', 'inqryEndDt', 'cntrctNo', 'bidNtceNo', 'dminsttNm', 'cntrctInsttNm'], { type: 'json' }, 'json', [], 300),
  'g2b-contract-goods': dataGoKrGet('local-government', 'local-government-planning', 'contract', '조달청 나라장터', '물품 계약현황', 'Goods Contracts', `${G2B_CONTRACT_URL}/getCntrctInfoListThng`, ['pageNo', 'numOfRows', 'inqryDiv', 'inqryBgnDt', 'inqryEndDt', 'cntrctNo', 'bidNtceNo', 'dminsttNm', 'cntrctInsttNm'], { type: 'json' }, 'json', [], 300),
  'nts-business-status': freezeSource({
    axis: 'local-government', provider: '국세청', title: '사업자등록 상태조회', method: 'POST',
    url: 'https://api.odcloud.kr/api/nts-businessman/v1/status', auth: DATA_GO_KR_AUTH,
    fixedParams: {}, allowedParams: [], requiredParams: [], bodyType: 'businessNumbers', responseFormat: 'json'
  }, { category: 'business', owner: 'local-government-planning', titleEn: 'Business Registration Status', cacheTtl: 0 }),

  'apt-trade': dataGoKrGet('strategy', 'investment-strategy', 'real-estate', '국토교통부', '아파트 매매 실거래가', 'Apartment Transaction Prices', 'https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev', ['LAWD_CD', 'DEAL_YMD', 'pageNo', 'numOfRows'], { pageNo: '1', numOfRows: '100' }, 'xml', ['LAWD_CD', 'DEAL_YMD'], 1800, 'https://www.data.go.kr/'),
  'customs-trade-total': dataGoKrGet('strategy', 'intelligence-briefing', 'trade', '관세청', '월별 수출입총괄', 'Monthly Exports & Imports', 'https://apis.data.go.kr/1220000/Newtrade/getNewtradeList', ['strtYymm', 'endYymm'], {}, 'xml', ['strtYymm', 'endYymm'], 21600),
  'weather-ultra-now': dataGoKrGet('strategy', 'intelligence-briefing', 'weather', '기상청', '초단기실황', 'Ultra-short Weather Observation', 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst', ['pageNo', 'numOfRows', 'base_date', 'base_time', 'nx', 'ny'], { dataType: 'JSON', pageNo: '1', numOfRows: '100' }, 'json', ['base_date', 'base_time', 'nx', 'ny'], 300),
  'weather-short-forecast': dataGoKrGet('strategy', 'intelligence-briefing', 'weather', '기상청', '단기예보', 'Short-term Weather Forecast', 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst', ['pageNo', 'numOfRows', 'base_date', 'base_time', 'nx', 'ny'], { dataType: 'JSON', pageNo: '1', numOfRows: '100' }, 'json', ['base_date', 'base_time', 'nx', 'ny'], 900),
  'airkorea-forecast': dataGoKrGet('strategy', 'intelligence-briefing', 'environment', '한국환경공단 에어코리아', '대기질 예보통보', 'Air Quality Forecast', 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth', ['numOfRows', 'pageNo', 'searchDate', 'InformCode'], { returnType: 'json', pageNo: '1', numOfRows: '100' }, 'json', [], 900),
  'airkorea-realtime': dataGoKrGet('strategy', 'intelligence-briefing', 'environment', '한국환경공단 에어코리아', '시도별 실시간 대기오염 측정정보', 'Real-time Air Quality by Province', 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty', ['sidoName', 'pageNo', 'numOfRows', 'ver'], { returnType: 'json', pageNo: '1', numOfRows: '100', ver: '1.4' }, 'json', ['sidoName'], 300),
  'power-supply-current': dataGoKrGet('strategy', 'intelligence-briefing', 'energy', '한국전력거래소', '현재 전력수급 현황', 'Current Power Supply & Demand', 'https://apis.data.go.kr/B552115/sukub5mMaxDatetime2', ['tradeDay'], {}, 'xml', ['tradeDay'], 300),
  'kwater-rainfall-minute': dataGoKrGet('strategy', 'intelligence-briefing', 'water', '한국수자원공사', '우량관측소 분단위 관측정보', 'Minute Rainfall Observations', 'https://apis.data.go.kr/B500001/dam/excllncobsrvt/mntrf/mntrflist', ['pageNo', 'numOfRows', 'sdate', 'stime', 'edate', 'etime', 'excll', 'tms'], { _type: 'json', pageNo: '1', numOfRows: '100' }, 'json', ['sdate', 'stime', 'edate', 'etime', 'excll', 'tms'], 300)
});

export const PUBLIC_DATA_PROVIDER_CATALOG = Object.freeze({
  'local-finance-365': Object.freeze({
    axis: 'local-government', owner: 'local-government-planning', category: 'finance', provider: '행정안전부 지방재정365',
    title: '세부사업별 세출현황', titleEn: 'Local Finance 365 · Program Expenditure', datasetId: '15138857',
    docsUrl: 'https://www.data.go.kr/data/15138857/openapi.do', authEnv: 'LOFIN365_API_KEY',
    activation: { state: 'requires-provider-setup', reason: '지방재정365 제공기관 OpenAPI 인증키와 실제 호출 URL을 활성화한 뒤 공통 어댑터에 연결' }
  }),
  'sme24-notice': Object.freeze({
    axis: 'strategy', owner: 'intelligence-briefing', category: 'support-program', provider: '중소벤처24',
    title: '중소벤처24 공고정보', titleEn: 'SME24 Support Program Notices', datasetId: '15113191',
    docsUrl: 'https://www.data.go.kr/data/15113191/openapi.do', authEnv: 'SMES24_API_KEY',
    activation: { state: 'requires-provider-setup', reason: '중소벤처24 제공기관 API 인증·허용환경을 분리해 활성화' }
  }),
  'kosis-indicators': Object.freeze({
    axis: 'strategy', owner: 'intelligence-briefing', category: 'statistics', provider: 'KOSIS 국가통계포털',
    title: '목록별 지표 조회', titleEn: 'KOSIS Indicator Lists', datasetId: '15127766',
    docsUrl: 'https://www.data.go.kr/data/15127766/openapi.do', authEnv: 'KOSIS_API_KEY',
    activation: { state: 'requires-provider-setup', reason: 'KOSIS 인증키와 목록 ID를 연결한 뒤 전략정보 기준 데이터로 활성화' }
  }),
  'kiprisplus-ip': Object.freeze({
    axis: 'research', owner: 'intelligence-briefing', category: 'intellectual-property', provider: '지식재산처 KIPRISPlus',
    title: '특허·실용 지식재산 데이터', titleEn: 'KIPRISPlus Patent & Utility Model Data', datasetId: '15002128',
    docsUrl: 'https://www.data.go.kr/dataset/15002128/openapi.do', authEnv: 'KIPRISPLUS_API_KEY',
    activation: { state: 'requires-provider-setup', reason: '구형 검색 API를 사용하지 않고 현재 KIPRISPlus REST 서비스와 전용 인증을 연결' }
  }),
  'national-rnd-outcomes': Object.freeze({
    axis: 'research', owner: 'intelligence-briefing', category: 'r-and-d', provider: '한국과학기술정보연구원',
    title: '국가R&D 성과검색', titleEn: 'National R&D Outcomes Search', datasetId: '15077316',
    docsUrl: 'https://www.data.go.kr/data/15077316/openapi.do', authEnv: 'DATA_GO_KR_SERVICE_KEY',
    activation: { state: 'requires-endpoint-activation', reason: '활용신청 후 발급된 실제 서비스 URL을 확인해 공통 data.go.kr 어댑터에 등록' }
  }),
  'schoolinfo-disclosure': Object.freeze({
    axis: 'education', owner: 'n-university', category: 'school', provider: '한국교육학술정보원 학교알리미',
    title: '학교알리미 공시정보', titleEn: 'School Information Disclosure', datasetId: '15098092',
    docsUrl: 'https://www.data.go.kr/data/15098092/openapi.do', authEnv: 'DATA_GO_KR_SERVICE_KEY',
    activation: { state: 'requires-endpoint-activation', reason: '활용신청 후 학교 공시 항목별 엔드포인트를 N University 공통 스키마에 연결' }
  }),
  'university-info-standard': Object.freeze({
    axis: 'education', owner: 'n-university', category: 'university', provider: '공공데이터활용지원센터·한국대학교육협의회',
    title: '전국 대학·전문대학 정보', titleEn: 'Korean Universities & Colleges', datasetId: '15107736',
    docsUrl: 'https://www.data.go.kr/data/15107736/openapi.do', authEnv: 'DATA_GO_KR_SERVICE_KEY',
    activation: { state: 'requires-endpoint-activation', reason: '표준데이터 실제 호출 URL을 확인해 N University 기관 기준 데이터로 연결' }
  })
});

export function getPublicDataSource(id) {
  return PUBLIC_DATA_SOURCES[id] || null;
}

function publicSourceEntry(id, source) {
  return {
    id,
    axis: source.axis,
    owner: source.owner,
    category: source.category,
    provider: source.provider,
    title: source.title,
    titleEn: source.titleEn,
    method: source.method,
    cacheTtl: source.cacheTtl,
    activation: source.activation,
    allowedParams: source.allowedParams,
    requiredParams: source.requiredParams || [],
    requiredAny: source.requiredAny || [],
    bodyType: source.bodyType || null,
    docsUrl: source.docsUrl || ''
  };
}

export function listPublicDataSources() {
  return Object.entries(PUBLIC_DATA_SOURCES).map(([id, source]) => publicSourceEntry(id, source));
}

export function listPublicDataProviderCatalog() {
  return Object.entries(PUBLIC_DATA_PROVIDER_CATALOG).map(([id, source]) => ({ id, ...source }));
}
