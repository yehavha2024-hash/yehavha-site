const LAW_SEARCH_URL = 'https://www.law.go.kr/DRF/lawSearch.do';
const LAW_SERVICE_URL = 'https://www.law.go.kr/DRF/lawService.do';
const G2B_BID_URL = 'https://apis.data.go.kr/1230000/ad/BidPublicInfoService';
const G2B_CONTRACT_URL = 'https://apis.data.go.kr/1230000/ao/CntrctInfoService';

const LAW_AUTH = Object.freeze({ env: 'LAW_OPEN_DATA_OC', param: 'OC' });
const DATA_GO_KR_AUTH = Object.freeze({ env: 'DATA_GO_KR_SERVICE_KEY', param: 'serviceKey' });

function lawList(target, title, allowedParams, fixedParams = {}) {
  return Object.freeze({
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
  });
}

function lawDetail(target, title, allowedParams, requiredParams = [], requiredAny = []) {
  return Object.freeze({
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
  });
}

function dataGoKrGet(axis, provider, title, url, allowedParams, fixedParams = {}, responseFormat = 'auto', requiredParams = []) {
  return Object.freeze({
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
  });
}

export const PUBLIC_DATA_SOURCES = Object.freeze({
  'law-current': lawList(
    'eflaw',
    '현행·시행예정 법령 목록',
    ['search', 'query', 'display', 'page', 'sort', 'date', 'efYd', 'ancYd', 'ancNo', 'rrClsCd', 'nb', 'org', 'knd', 'lsChapNo', 'gana', 'popYn'],
    { nw: '2,3' }
  ),
  'law-detail': lawDetail(
    'law',
    '법령 본문',
    ['ID', 'MST', 'LM', 'LD', 'LN', 'JO'],
    [],
    [['ID', 'MST', 'LM']]
  ),
  'precedent-list': lawList(
    'prec',
    '판례 목록',
    ['search', 'query', 'display', 'page', 'sort', 'date', 'prncYd', 'nb', 'org', 'curt', 'JO', 'gana', 'datSrcNm', 'popYn']
  ),
  'precedent-detail': lawDetail('prec', '판례 본문', ['ID', 'LM'], ['ID']),
  'admin-rule-list': lawList(
    'admrul',
    '행정규칙 목록',
    ['nw', 'search', 'query', 'display', 'page', 'org', 'knd', 'gana', 'sort', 'date', 'prmlYd', 'modYd', 'nb', 'popYn']
  ),
  'admin-rule-detail': lawDetail(
    'admrul',
    '행정규칙 본문',
    ['ID', 'LID', 'LM'],
    [],
    [['ID', 'LID', 'LM']]
  ),
  'interpretation-list': lawList(
    'expc',
    '법령해석례 목록',
    ['search', 'query', 'display', 'page', 'inq', 'rpl', 'gana', 'itmno', 'regYd', 'explYd', 'sort', 'popYn']
  ),
  'interpretation-detail': lawDetail('expc', '법령해석례 본문', ['ID', 'LM'], [], [['ID', 'LM']]),
  'ordinance-list': lawList(
    'ordin',
    '자치법규 목록',
    ['nw', 'search', 'query', 'display', 'page', 'sort', 'date', 'efYd', 'ancYd', 'ancNo', 'nb', 'org', 'sborg', 'knd', 'rrClsCd', 'ordinFd', 'lsChapNo', 'gana', 'popYn']
  ),
  'ordinance-detail': lawDetail('ordin', '자치법규 본문', ['ID', 'MST', 'LM'], [], [['ID', 'MST', 'LM']]),

  'g2b-bid-construction': dataGoKrGet(
    'local-government',
    '조달청 나라장터',
    '공사 입찰공고',
    `${G2B_BID_URL}/getBidPblancListInfoCnstwk`,
    ['pageNo', 'numOfRows', 'inqryDiv', 'inqryBgnDt', 'inqryEndDt', 'bidNtceNo'],
    { type: 'json' },
    'json'
  ),
  'g2b-bid-service': dataGoKrGet(
    'local-government',
    '조달청 나라장터',
    '용역 입찰공고',
    `${G2B_BID_URL}/getBidPblancListInfoServc`,
    ['pageNo', 'numOfRows', 'inqryDiv', 'inqryBgnDt', 'inqryEndDt', 'bidNtceNo'],
    { type: 'json' },
    'json'
  ),
  'g2b-contract-construction': dataGoKrGet(
    'local-government',
    '조달청 나라장터',
    '공사 계약현황',
    `${G2B_CONTRACT_URL}/getCntrctInfoListCnstwk`,
    ['pageNo', 'numOfRows', 'inqryDiv', 'inqryBgnDt', 'inqryEndDt', 'cntrctNo', 'bidNtceNo', 'dminsttNm', 'cntrctInsttNm'],
    { type: 'json' },
    'json'
  ),
  'g2b-contract-service': dataGoKrGet(
    'local-government',
    '조달청 나라장터',
    '용역 계약현황',
    `${G2B_CONTRACT_URL}/getCntrctInfoListServc`,
    ['pageNo', 'numOfRows', 'inqryDiv', 'inqryBgnDt', 'inqryEndDt', 'cntrctNo', 'bidNtceNo', 'dminsttNm', 'cntrctInsttNm'],
    { type: 'json' },
    'json'
  ),
  'nts-business-status': Object.freeze({
    axis: 'local-government',
    provider: '국세청',
    title: '사업자등록 상태조회',
    method: 'POST',
    url: 'https://api.odcloud.kr/api/nts-businessman/v1/status',
    auth: DATA_GO_KR_AUTH,
    fixedParams: {},
    allowedParams: [],
    requiredParams: [],
    bodyType: 'businessNumbers',
    responseFormat: 'json'
  }),

  'apt-trade': dataGoKrGet(
    'strategy',
    '국토교통부',
    '아파트 매매 실거래가',
    'https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev',
    ['LAWD_CD', 'DEAL_YMD', 'pageNo', 'numOfRows'],
    { pageNo: '1', numOfRows: '100' },
    'xml',
    ['LAWD_CD', 'DEAL_YMD']
  ),
  'weather-ultra-now': dataGoKrGet(
    'strategy',
    '기상청',
    '초단기실황',
    'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst',
    ['pageNo', 'numOfRows', 'base_date', 'base_time', 'nx', 'ny'],
    { dataType: 'JSON', pageNo: '1', numOfRows: '100' },
    'json',
    ['base_date', 'base_time', 'nx', 'ny']
  ),
  'weather-short-forecast': dataGoKrGet(
    'strategy',
    '기상청',
    '단기예보',
    'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst',
    ['pageNo', 'numOfRows', 'base_date', 'base_time', 'nx', 'ny'],
    { dataType: 'JSON', pageNo: '1', numOfRows: '100' },
    'json',
    ['base_date', 'base_time', 'nx', 'ny']
  ),
  'airkorea-forecast': dataGoKrGet(
    'strategy',
    '한국환경공단 에어코리아',
    '대기질 예보통보',
    'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth',
    ['numOfRows', 'pageNo', 'searchDate', 'InformCode'],
    { returnType: 'json', pageNo: '1', numOfRows: '100' },
    'json'
  ),
  'airkorea-realtime': dataGoKrGet(
    'strategy',
    '한국환경공단 에어코리아',
    '시도별 실시간 대기오염 측정정보',
    'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty',
    ['sidoName', 'pageNo', 'numOfRows', 'ver'],
    { returnType: 'json', pageNo: '1', numOfRows: '100', ver: '1.4' },
    'json',
    ['sidoName']
  ),
  'power-supply-current': dataGoKrGet(
    'strategy',
    '한국전력거래소',
    '현재 전력수급 현황',
    'https://apis.data.go.kr/B552115/sukub5mMaxDatetime2',
    ['tradeDay'],
    {},
    'xml',
    ['tradeDay']
  ),
  'kwater-rainfall-minute': dataGoKrGet(
    'strategy',
    '한국수자원공사',
    '우량관측소 분단위 관측정보',
    'https://apis.data.go.kr/B500001/dam/excllncobsrvt/mntrf/mntrflist',
    ['pageNo', 'numOfRows', 'sdate', 'stime', 'edate', 'etime', 'excll', 'tms'],
    { _type: 'json', pageNo: '1', numOfRows: '100' },
    'json',
    ['sdate', 'stime', 'edate', 'etime', 'excll', 'tms']
  )
});

export function getPublicDataSource(id) {
  return PUBLIC_DATA_SOURCES[id] || null;
}

export function listPublicDataSources() {
  return Object.entries(PUBLIC_DATA_SOURCES).map(([id, source]) => ({
    id,
    axis: source.axis,
    provider: source.provider,
    title: source.title,
    method: source.method,
    allowedParams: source.allowedParams,
    requiredParams: source.requiredParams || [],
    requiredAny: source.requiredAny || [],
    bodyType: source.bodyType || null
  }));
}
