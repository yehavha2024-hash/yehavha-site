(() => {
  'use strict';
  const cases = Array.isArray(window.LEGAL_MIND_CASES) ? window.LEGAL_MIND_CASES : [];
  const modes = [
    {id:'판례 기반',no:'01',title:'판례 기반 사례훈련',desc:'공식 판결문을 사례로 재구성하고 사실·쟁점·법규범·포섭·결론이 연결되는 리걸 마인드를 읽습니다.'},
    {id:'현실 사례',no:'02',title:'현실생활 분쟁훈련',desc:'일상적인 분쟁을 법적 사실·법률관계·쟁점으로 변환하는 법률적 사고 구조를 읽습니다.'},
    {id:'사례변형',no:'03',title:'사례변형 훈련',desc:'사실 하나가 바뀔 때 어느 법적 요건과 법률효과가 움직이는지 구체적으로 비교합니다.'},
    {id:'종합훈련',no:'04',title:'종합 리걸 마인드 훈련',desc:'복수 당사자·청구권·증거·절차가 얽힌 사건을 하나의 법률적 사고 구조로 정리합니다.'}
  ];
  const state = {mode:'전체',area:'전체',level:'전체',search:''};
  const $ = sel => document.querySelector(sel);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const list = items => `<ul>${(items||[]).map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`;
  const para = items => Array.isArray(items) ? list(items) : `<p>${esc(items||'')}</p>`;
  const first = items => Array.isArray(items) && items.length ? items[0] : '';
  const joined = (items, limit = 3) => (Array.isArray(items) ? items.slice(0, limit) : []).join(' / ');
  const stripQuestion = value => String(value || '').replace(/[?？]\s*$/,'');

  const variationEffects = {
    C001:[
      {requirement:'주택 인도와 주민등록이라는 대항요건 중 주민등록의 계속성이 깨집니다.',effect:'기존 대항력의 유지 여부가 달라질 수 있으므로 주민등록 이전 시점부터 권리 공백과 제3자 우선순위를 다시 계산해야 합니다.',evidence:'전출·전입일, 실제 점유상태, 제3자 권리취득일을 같은 시간표에 놓습니다.'},
      {requirement:'점유를 잃기 전에 임차권등기를 마쳤다는 사실이 추가됩니다.',effect:'점유 상실 뒤 등기한 원사례와 달리 기존 대항력·우선변제권을 보전하는 제도적 효과가 문제되므로 권리 공백이 생기는지가 핵심이 됩니다.',evidence:'임차권등기 완료일과 실제 이사일의 선후관계를 확인합니다.'},
      {requirement:'점유 상실과 임차권등기 사이에 제3자의 권리취득이라는 중간사실이 들어옵니다.',effect:'새 임차권등기의 효력이 소급하지 않는다면 그 사이 권리를 취득한 제3자와의 우선순위가 달라질 수 있습니다.',evidence:'점유 상실일·제3자 등기일·임차권등기일을 날짜순으로 확정합니다.'}
    ],
    C002:[
      {requirement:'명의이전 직전에 실제 소송이 제기되어 추상적 채무가 아니라 구체적 집행위험이 현실화됩니다.',effect:'강제집행 면탈 목적을 추인하는 간접사실의 무게가 커져 부부간 명의신탁 특례의 예외 적용 가능성이 높아지는 방향으로 판단구조가 이동합니다.',evidence:'소장 송달일, 보전처분 여부, 명의이전일의 시간적 근접성을 봅니다.'},
      {requirement:'명의자인 배우자가 취득대금 대부분을 부담했다는 사실이 추가됩니다.',effect:'단순 명의신탁인지 자체가 먼저 흔들리므로 집행면탈 목적보다 실질적 소유·자금부담 관계가 선행 쟁점이 됩니다.',evidence:'계좌이체, 대출상환, 취득세 등 실제 자금출처를 확인합니다.'},
      {requirement:'강제집행 회피 외에 세금 절감이라는 별도 목적이 함께 존재합니다.',effect:'혼합된 동기 중 어떤 목적이 명의신탁의 실질적 원인이었는지를 나누어 보아야 하며 세금 목적의 존재만으로 집행면탈 목적이 자동 인정되지는 않습니다.',evidence:'명의이전 당시 채무상태, 세무자료, 당사자 설명을 비교합니다.'}
    ],
    C003:[
      {requirement:'제3자가 명의신탁 사실을 알고 있었다는 주관적 사정이 추가됩니다.',effect:'그 사실 하나로 결론을 정하지 않고 부동산실명법상 제3자 지위와 후속 거래의 권리취득 원인을 별도로 검토해야 합니다.',evidence:'제3자의 계약상대방, 대금지급, 명의신탁 인식 경위를 확인합니다.'},
      {requirement:'제3자가 명의수탁자와 별도의 매매계약을 체결했다는 독립 거래관계가 명확해집니다.',effect:'후속 취득자를 보호하는 제3자 규정의 적용 여부가 더 직접적인 핵심쟁점이 되고, 최초 명의신탁 무효만으로 후속 등기를 곧바로 무효라고 할 수 있는지 다시 판단합니다.',evidence:'후속 매매계약서와 대금지급 자료를 봅니다.'},
      {requirement:'후속 이전의 원인이 매매가 아니라 무상 증여로 바뀝니다.',effect:'제3자성 및 실체관계에 부합하는 등기 여부를 다시 검토해야 하며 유상거래에서 기대되는 대금지급 자료의 증명기능은 사라집니다.',evidence:'증여계약, 증여세 자료, 당사자 관계를 확인합니다.'}
    ],
    C004:[
      {requirement:'반환금의 최종 귀속이 피해회복이 아니라 회사 주주에게 돌아가는 것으로 바뀝니다.',effect:'예외적 반환을 정당화하던 공평·피해회복의 근거가 약해져 민법 제746조의 반환금지 원칙 쪽으로 판단이 이동할 수 있습니다.',evidence:'회생계획·배당구조와 반환금의 실제 귀속자를 확인합니다.'},
      {requirement:'수익자가 거래의 불법성을 알지 못했다는 사실이 추가됩니다.',effect:'수익자 측 불법성의 정도가 낮아져 급여자와 수익자의 불법성 비교가 달라지고 반환 예외의 필요성이 약해질 수 있습니다.',evidence:'업무지시, 교육자료, 인식 가능성을 보여주는 문서와 진술을 봅니다.'},
      {requirement:'급여자가 불법 구조의 주도자이고 수익자의 가담은 경미한 것으로 바뀝니다.',effect:'급여자 측 불법성이 훨씬 커지므로 스스로 불법을 주도한 자의 반환청구를 허용할 것인지가 중심이 되고 반환금지 원칙이 강해지는 방향으로 검토됩니다.',evidence:'의사결정 권한, 수익배분, 가담정도를 비교합니다.'}
    ],
    C005:[
      {requirement:'표현 장소가 다수인이 참여하는 단체채팅방으로 바뀝니다.',effect:'공연성·전파가능성 판단의 기초사실이 강화되고 사실 적시 여부와 별도로 다수에게 전달된 범위를 검토해야 합니다.',evidence:'채팅방 참여자 수, 실제 열람자, 재전파 정황을 확인합니다.'},
      {requirement:'행위자가 허위임을 인식하면서 구체적 사실을 말했다는 고의 관련 사실이 추가됩니다.',effect:'진실한 사실을 전제로 하는 형법 제310조의 위법성 조각 구조와 멀어지고 허위사실 적시 명예훼손의 구성요건 검토가 중심으로 이동합니다.',evidence:'사실 확인 과정, 반대자료 인식, 발언 전후 메시지를 봅니다.'},
      {requirement:'실명은 없지만 주변인이 누구인지 식별할 수 있다는 특정성 관련 사실이 추가됩니다.',effect:'이름의 기재 여부가 아니라 문맥상 피해자가 특정되는지가 핵심이므로 특정성 요건이 충족되는 방향으로 판단될 수 있습니다.',evidence:'별명·직책·상황정보와 수신자들의 인식 자료를 확인합니다.'}
    ],
    C006:[
      {requirement:'단순 언쟁에 그치지 않고 승객이 운전대를 잡는 직접적인 차량 통제행위가 추가됩니다.',effect:'형법 제314조의 위력 및 실제 업무방해와 연결되는 구체적 행위가 생기므로 업무방해 성립 가능성이 원사례보다 높아지는 방향으로 판단됩니다. 신체접촉이 있다면 다른 구성요건도 별도로 검토합니다.',evidence:'블랙박스에서 운전대 접촉, 지속시간, 차량정지·운행중단을 확인합니다.'},
      {requirement:'기사 측이 승객을 안전하지 않은 장소에 강제로 하차시켰다는 새로운 행위가 추가됩니다.',effect:'승객의 업무방해 여부와 별개로 운송계약상 안전한 운송·하차의무, 손해발생, 행정상 운송질서 위반 가능성 등 기사 측의 별도 법률문제가 생깁니다.',evidence:'정차 위치, 주변 위험도, 하차 요구 방식, 블랙박스·GPS를 확인합니다.'},
      {requirement:'승객의 행위가 욕설에 그치고 택시 운행은 계속되었다는 사실로 바뀝니다.',effect:'업무를 실제로 방해한 정도와 위력 판단은 약해지는 반면 욕설의 내용·상대방·공연성에 따라 모욕·협박 등 다른 구성요건의 검토가 분리되어야 합니다.',evidence:'욕설 원문, 운행 지속 여부, 제3자 존재와 녹음자료를 확인합니다.'}
    ],
    C007:[
      {requirement:'반환 약정을 직접 뒷받침하던 “갚겠다”는 메시지가 사라집니다.',effect:'송금만으로 소비대차를 바로 인정하기 어려워지고 대여인지 증여인지 간접사실을 조합하여 증명해야 하는 비중이 커집니다.',evidence:'일부변제, 세무·회계처리, 반환요구 시점, 과거 거래관행을 봅니다.'},
      {requirement:'을이 정기적으로 50만 원씩 세 차례 송금했다는 반복 변제 정황이 추가됩니다.',effect:'그 송금이 원금의 일부변제라고 설명될 수 있다면 반환 약정의 존재를 뒷받침하는 간접사실이 강화됩니다.',evidence:'송금 메모, 당사자 대화, 송금 주기와 원금잔액 계산을 확인합니다.'},
      {requirement:'원송금 당시 송금 메모에 “선물”이라는 표시가 존재합니다.',effect:'증여라는 설명을 지지하는 동시기 자료가 생겨 대여금 반환청구 측의 증명부담이 커집니다. 다만 다른 객관적 자료와 모순되는지도 함께 봅니다.',evidence:'원본 이체내역과 이후 반환약정 자료를 대조합니다.'}
    ],
    C008:[
      {requirement:'임대인이 통지 즉시 수리를 시도했지만 상층 세대가 출입을 거부했다는 제3자 장애사실이 추가됩니다.',effect:'임대인의 수선의무 자체와 별개로 지연에 대한 귀책사유·손해배상 범위가 달라질 수 있고 상층 세대 등 제3자의 책임·구상관계가 새로 중요해집니다.',evidence:'수리요청·방문기록, 출입거부 자료, 관리사무소 기록을 봅니다.'},
      {requirement:'임차인이 누수를 알고도 한 달 동안 임대인에게 알리지 않았다는 사실이 추가됩니다.',effect:'손해 확대 부분의 인과관계와 손해경감의무 관련 판단이 달라져 임대인에게 귀속되는 손해범위가 줄어들 수 있습니다.',evidence:'최초 발견일, 최초 통지일, 손상 확대 시점을 비교합니다.'},
      {requirement:'손상물이 일반 가구가 아니라 영업용 장비로 바뀝니다.',effect:'재산손해에 더해 영업중단·매출손실 등 확대손해가 문제될 수 있어 예견가능성·인과관계·손해액 증명이 더 중요해집니다.',evidence:'장비가액, 수리기간, 매출자료와 대체장비 가능성을 확인합니다.'}
    ],
    C009:[
      {requirement:'판매글에서 배터리 상태를 보장하지 않는다고 명시한 계약내용이 추가됩니다.',effect:'배터리 성능에 관한 매도인의 계약상 책임범위는 좁아질 수 있지만 별개의 메인보드 하자까지 같은 면책문구로 처리되는지는 따로 판단해야 합니다.',evidence:'판매글 전체 문구와 실제 하자 부위를 비교합니다.'},
      {requirement:'매도인이 일회성 개인 판매자가 아니라 전문 중고업자로 바뀝니다.',effect:'거래의 성격에 따라 설명의무·품질표시·소비자보호 규범의 적용 가능성이 커지고 단순 개인거래와 다른 책임구조를 검토하게 됩니다.',evidence:'반복 판매내역, 사업자 지위, 광고·보증조건을 확인합니다.'},
      {requirement:'매수인이 수령 후 제품을 임의분해했다는 사후행위가 추가됩니다.',effect:'하자가 거래 당시 존재했는지와 매수인의 분해가 고장을 발생·확대했는지라는 인과관계 쟁점이 커져 매도인의 방어가 강화될 수 있습니다.',evidence:'개봉·분해 시점, 수리업체 소견, 분해 전 작동기록을 봅니다.'}
    ],
    C010:[
      {requirement:'다수 단체방이 아니라 1대1 채팅으로 전달범위가 축소됩니다.',effect:'공연성 요건이 약해질 수 있으므로 제3자에게 전파될 가능성이나 실제 전파 정황이 있는지를 별도로 판단해야 합니다.',evidence:'수신자 수, 재전송 여부, 대화방 구조를 확인합니다.'},
      {requirement:'적시된 사실이 진실이라는 사실관계로 바뀝니다.',effect:'진실하다는 이유만으로 자동 면책되는 것이 아니라 형법 제307조 제1항의 구성요건과 제310조의 공공의 이익 요건을 별도로 검토하게 됩니다.',evidence:'사실의 진실성 자료와 발언 목적·공익성을 확인합니다.'},
      {requirement:'실명 대신 별명을 사용했지만 참여자 모두가 을을 지칭한다고 이해합니다.',effect:'표현대상의 특정성은 이름 자체보다 주변사정으로 식별 가능한지가 중요하므로 특정성 요건이 충족되는 방향으로 판단될 수 있습니다.',evidence:'별명 사용관행, 대화맥락, 참여자 진술을 봅니다.'}
    ],
    C011:[
      {requirement:'도급인이 “일단 해주세요”라고 작업은 승인했지만 가격에 관해서는 명시하지 않았습니다.',effect:'추가작업 요청의 존재는 강해지지만 추가대금의 액수·산정방식에 관한 합의가 별도 쟁점으로 남습니다.',evidence:'요청 직전 견적제시 여부와 동종 공사의 통상가격 자료를 봅니다.'},
      {requirement:'추가견적이 전달되었으나 명시적 답변 없이 공사가 진행·완료되었습니다.',effect:'침묵만으로 승낙을 단정하지 않고 견적을 인식한 뒤 공사를 계속 지시·수령한 행위가 묵시적 합의를 구성하는지 판단하게 됩니다.',evidence:'견적 수신기록, 이후 작업지시, 완성물 인수와 사용 여부를 확인합니다.'},
      {requirement:'추가공사에 중대한 하자가 있다는 사실이 새로 생깁니다.',effect:'추가대금 청구와 별도로 하자보수·손해배상·대금감액 또는 상계 항변이 결합되어 지급해야 할 최종 금액이 달라질 수 있습니다.',evidence:'하자감정, 보수비, 완성도와 사용가능성을 봅니다.'}
    ],
    C012:[
      {requirement:'대여를 뒷받침할 수 있었던 200만 원의 사후 송금마저 사라집니다.',effect:'일부변제라는 간접사실이 없어져 반환 약정의 증명이 더 어려워지고 다른 정황증거의 비중이 커집니다.',evidence:'세무·회계처리, 통화내역, 과거 거래관행을 더 중점적으로 봅니다.'},
      {requirement:'갑이 5년 동안 반환을 요구하지 않았다는 장기간의 무청구 상태가 추가됩니다.',effect:'증여였다는 상대방 설명을 강화하는 간접사실이 될 수 있고 대여라면 변제기·소멸시효 기산점도 함께 확인해야 합니다.',evidence:'최초 반환요구일, 약정 변제기, 중간 승인·변제 여부를 확인합니다.'},
      {requirement:'을 스스로 작성한 장부에 해당 금액을 “차입금”으로 기록한 자료가 추가됩니다.',effect:'채무자 측에서 나온 동시기 회계자료가 반환의무를 인정하는 강한 간접사실로 기능하여 대여금 청구 측의 증명구조가 강화됩니다.',evidence:'장부 작성시점, 회계처리의 지속성, 세무신고와 일치 여부를 봅니다.'}
    ],
    C013:[
      {requirement:'임차권등기가 이사 전인 3월 31일에 먼저 마쳐집니다.',effect:'점유 상실 뒤에 등기한 원사례와 달리 기존 대항력·우선변제권을 보전하는 효과가 문제되므로 4월 1일 이사 후에도 권리 공백이 생기는지 판단이 크게 달라집니다.',evidence:'임차권등기 완료일이 실제 이사일보다 앞서는지 확인합니다.'},
      {requirement:'점유만 상실하고 주민등록은 유지합니다.',effect:'대항요건 중 하나인 주택 인도가 계속되는지 문제가 되므로 주민등록만 남아 있다는 사정만으로 기존 대항력이 그대로 유지되는지 다시 판단해야 합니다.',evidence:'실제 이사·열쇠반환·점유상태와 주민등록을 함께 봅니다.'},
      {requirement:'근저당권자 병이 임차권 존재를 실제로 알고 있었다는 주관적 사정이 추가됩니다.',effect:'법정 대항요건과 등기순위가 중심인 구조에서 단순한 인식만으로 소멸한 대항력이 자동 복원되는 것은 아니므로, 병의 인식보다 각 시점의 법정 공시요건을 우선 확인합니다.',evidence:'권리취득일 당시 점유·주민등록·임차권등기 상태를 확정합니다.'}
    ],
    C014:[
      {requirement:'운전대 통제 대신 차량 밖에서 문을 두드리는 행위로 물리력의 대상과 강도가 약해집니다.',effect:'차량의 출발·운행을 직접 제어한 정도가 낮아져 업무방해의 위력·인과관계 판단이 달라질 수 있고 행위의 지속성·위협성에 따라 별도 구성요건을 검토합니다.',evidence:'행위 위치, 강도, 지속시간, 실제 운행중단 여부를 봅니다.'},
      {requirement:'문제행위가 차량이 이미 정차한 뒤 발생한 것으로 시간관계가 바뀝니다.',effect:'그 행위 때문에 차량이 정차했다는 인과관계는 약해지지만 재출발을 막았는지 여부에 따라 이후의 업무방해는 여전히 별도로 판단합니다.',evidence:'정차 원인, 행동 시작시점, 재출발 가능시간을 확인합니다.'},
      {requirement:'기사의 신체에 직접 접촉했다는 사실이 추가됩니다.',effect:'업무방해의 위력 판단이 강화되는 동시에 접촉의 정도에 따라 폭행 등 별도의 형사 구성요건과 민사상 손해배상 문제가 새로 생길 수 있습니다.',evidence:'접촉 부위·강도, 상해 여부, 영상·진단자료를 확인합니다.'}
    ],
    C015:[
      {requirement:'누수 원인이 건물 배관이 아니라 임차인 갑이 설치한 커피머신 배관으로 바뀝니다.',effect:'하자의 원인과 지배영역이 임차인 쪽으로 이동하므로 임대인에 대한 수선·손해배상 청구는 약해지고 오히려 임차인의 원상회복·손해배상 책임이 문제될 수 있습니다.',evidence:'배관 설치주체, 시공내역, 누수감정을 확인합니다.'},
      {requirement:'보험사가 손해를 먼저 전액 보상했다는 지급사실이 추가됩니다.',effect:'동일 손해의 이중회복을 피해야 하고 보험자의 대위·구상관계가 생길 수 있으므로 최종 청구주체와 잔존손해를 다시 계산해야 합니다.',evidence:'보험금 지급내역, 약관, 손해항목별 보상범위를 확인합니다.'},
      {requirement:'영업을 완전히 중단하지 않고 계속했지만 매출만 감소한 것으로 바뀝니다.',effect:'휴업손해보다는 매출감소에 따른 영업손해의 인과관계·손해액 증명이 중심이 되고 누수 외 다른 매출변동 요인을 배제해야 합니다.',evidence:'동기간 매출, 계절성, 영업시간, 누수 영향자료를 비교합니다.'}
    ],
    C016:[
      {requirement:'판매자가 일부 금액을 환불하고 계속 배송을 미루는 사후행위가 추가됩니다.',effect:'처음부터 이행할 의사가 없었다는 사기 고의의 추론은 다소 약해질 수 있지만 부분환불이 단순 지연을 가장하기 위한 것인지까지 전체 거래정황으로 판단해야 합니다. 민사상 채무불이행 문제는 별도로 남습니다.',evidence:'환불시점, 환불비율, 이후 약속과 실제 이행가능성을 봅니다.'},
      {requirement:'실제 물품이 존재했고 배송 중 분실되었다는 객관적 사실로 바뀝니다.',effect:'처음부터 존재하지 않는 물품을 가장한 기망이라는 형사구조는 약해지고 배송위험·계약이행·대금반환 등 민사상 책임배분이 중심으로 이동합니다.',evidence:'실물 보유자료, 운송장, 택배사 사고기록을 확인합니다.'},
      {requirement:'다른 피해자가 없고 판매사진도 실제 판매자가 촬영한 것으로 바뀝니다.',effect:'반복기망·사진도용이라는 사기 고의의 간접사실이 사라져 형사상 기망의도 증명이 약해지고 단순 계약불이행 가능성을 더 엄격히 구별해야 합니다.',evidence:'물품 보유 여부, 거래 당시 연락내용, 배송 준비 정황을 확인합니다.'}
    ]
  };

  function thought(label, text){
    return `<div class="thinking-note"><strong>${esc(label)}</strong><p>${esc(text)}</p></div>`;
  }

  function legalMindOverview(item){
    const rows = [
      ['법률관계', first(item.relation)],
      ['핵심 쟁점', first(item.issues)],
      ['판단규범', first(item.laws) || first(item.precedents)],
      ['증명', first(item.burden)],
      ['포섭', first(item.subsumption)],
      ['결론', first(item.conclusion)]
    ].filter(([,text])=>text);
    return `<div class="overview-flow">${rows.map(([label,text],index)=>`<div><b>${String(index+1).padStart(2,'0')}</b><strong>${esc(label)}</strong><span>${esc(text)}</span></div>`).join('')}</div>`;
  }

  function variationList(item){
    const effects = variationEffects[item.id] || [];
    return `<div class="variation-list">${(item.variations||[]).map((variation,index)=>{
      const effect = effects[index] || {requirement:'이 변형에서 달라진 사실을 원사례의 핵심 요건과 연결합니다.',effect:'달라진 요건이 권리·의무·책임 또는 절차상 지위에 어떤 법률효과를 만드는지 다시 포섭합니다.',evidence:'원사례와 다른 사실을 입증할 객관적 자료를 먼저 확인합니다.'};
      return `<div class="variation-item"><b>변형 ${String(index+1).padStart(2,'0')}</b><p>${esc(stripQuestion(variation))}</p><dl><div><dt>요건 변화</dt><dd>${esc(effect.requirement)}</dd></div><div><dt>법률효과</dt><dd>${esc(effect.effect)}</dd></div><div><dt>확인할 사실·증거</dt><dd>${esc(effect.evidence)}</dd></div></dl></div>`;
    }).join('')}</div>`;
  }

  function renderModes(){
    const root = $('#modeGrid');
    root.innerHTML = modes.map(mode => {
      const count = cases.filter(item => item.mode === mode.id).length;
      return `<button class="mode-card" type="button" data-mode="${esc(mode.id)}"><span class="mode-top"><span class="mode-no">${mode.no}</span><span class="mode-count">${count} CASES</span></span><h3>${esc(mode.title)}</h3><p>${esc(mode.desc)}</p></button>`;
    }).join('');
    root.addEventListener('click', e => {
      const btn = e.target.closest('[data-mode]');
      if (!btn) return;
      state.mode = btn.dataset.mode;
      syncFilters();
      renderCases();
      $('#caseTitle').scrollIntoView({behavior:'smooth',block:'start'});
    });
  }

  function buildFilters(){
    const modeRoot = $('#modeFilters');
    const areaRoot = $('#areaFilters');
    const areas = ['전체', ...new Set(cases.map(item => item.area))];
    modeRoot.innerHTML = ['전체',...modes.map(m=>m.id)].map(value=>`<button class="filter-btn${value==='전체'?' active':''}" type="button" data-filter-mode="${esc(value)}">${esc(value)}</button>`).join('');
    areaRoot.innerHTML = areas.map(value=>`<button class="filter-btn${value==='전체'?' active':''}" type="button" data-filter-area="${esc(value)}">${esc(value)}</button>`).join('');
    modeRoot.addEventListener('click',e=>{const b=e.target.closest('[data-filter-mode]');if(!b)return;state.mode=b.dataset.filterMode;syncFilters();renderCases();});
    areaRoot.addEventListener('click',e=>{const b=e.target.closest('[data-filter-area]');if(!b)return;state.area=b.dataset.filterArea;syncFilters();renderCases();});
    $('#levelFilter').addEventListener('change',e=>{state.level=e.target.value;renderCases();});
    $('#searchInput').addEventListener('input',e=>{state.search=e.target.value.trim().toLowerCase();renderCases();});
  }

  function syncFilters(){
    document.querySelectorAll('[data-filter-mode]').forEach(btn=>btn.classList.toggle('active',btn.dataset.filterMode===state.mode));
    document.querySelectorAll('[data-filter-area]').forEach(btn=>btn.classList.toggle('active',btn.dataset.filterArea===state.area));
  }

  function searchable(item){
    return [item.id,item.mode,item.level,item.area,item.title,item.summary,item.question,...(item.issues||[]),...(item.laws||[]),...(item.precedents||[])].join(' ').toLowerCase();
  }

  function filtered(){
    return cases.filter(item => (state.mode==='전체'||item.mode===state.mode) && (state.area==='전체'||item.area===state.area) && (state.level==='전체'||item.level===state.level) && (!state.search||searchable(item).includes(state.search)));
  }

  function renderCases(){
    const data = filtered();
    $('#resultCount').textContent = `${data.length}개 사례`;
    $('#emptyState').hidden = data.length > 0;
    $('#caseGrid').innerHTML = data.map(item => `<article class="case-card"><div class="case-index">${esc(item.id)}</div><div class="case-main"><div class="case-meta"><span>${esc(item.mode)}</span><span>${esc(item.area)}</span><span>${esc(item.level)}</span></div><h3>${esc(item.title)}</h3><p class="summary">${esc(item.summary)}</p><p class="question">출발 쟁점 · ${esc(item.question)}</p></div><button class="open-case" type="button" data-case="${esc(item.id)}">리걸 마인드 해설 보기</button></article>`).join('');
  }

  function step(no,title,body,open=false){return `<details class="step"${open?' open':''}><summary><span class="step-no">${no}</span><span class="step-title">${esc(title)}</span></summary><div class="step-body">${body}</div></details>`;}

  function openCase(id){
    const item = cases.find(c=>c.id===id); if(!item)return;
    const sources = (item.sources||[]).length ? `<div class="source-list">${item.sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join('')}</div>` : '<p>이 사례는 훈련용 가상사례입니다. 실제 적용 전 최신 공식 법령·판례를 별도로 확인하십시오.</p>';
    const argumentsHtml = `${thought('리걸 마인드','한쪽 주장만 강화하지 않습니다. 청구·문제제기 측의 가장 강한 논리와 상대방의 가장 강한 반론을 모두 세운 뒤, 어느 쪽이 법규범·증거·증명책임 구조와 더 잘 맞는지 비교합니다.')}<div class="two-col"><div class="argument-box"><strong>청구·문제제기 측의 논리</strong>${para(item.claimant)}</div><div class="argument-box"><strong>상대방의 반론</strong>${para(item.respondent)}</div></div>`;

    const factsThought = `아직 누가 옳은지 판단하지 않습니다. 먼저 사건을 시간순으로 고정합니다. 이 사례에서는 ${joined(item.facts,3)}${(item.facts||[]).length>3?' 등의 순서로 놓습니다.':'의 순서로 놓습니다.'}`;
    const legalFactsThought = `모든 사실에 같은 무게를 주지 않습니다. 결론을 움직이는 사실은 ${joined(item.legalFacts,4)}입니다. 감정·도덕평가보다 법적 요건의 충족 여부를 바꾸는 사실을 먼저 남깁니다.`;
    const relationThought = `당사자를 단순히 “누가 잘못했는가”로 보지 않고 권리·의무와 청구의 방향으로 바꿉니다. 이 사건의 기본 구조는 ${joined(item.relation,3)}입니다.`;
    const issuesThought = `일상적인 질문을 법원이 답할 수 있는 법적 판단 질문으로 바꿉니다. 이 사건에서 먼저 세울 쟁점은 ${joined(item.issues,3)}입니다. 쟁점이 정확해야 뒤의 조문·판례 검색도 정확해집니다.`;
    const normsThought = `쟁점을 먼저 정한 뒤 그 질문에 답하는 규범을 찾습니다. 적용 후보는 ${joined(item.laws,3)}${(item.precedents||[]).length?`이고, 판례에서는 ${joined(item.precedents,2)}를 확인합니다.`:'입니다.'} 조문은 요건과 법률효과를 주고 판례는 그 의미와 적용범위를 구체화합니다.`;
    const evidenceThought = `법적으로 중요한 사실도 증명되지 않으면 재판의 기초가 되기 어렵습니다. 이 사건에서는 ${joined(item.evidence,4)}가 핵심 자료가 되고, 증명책임은 ${joined(item.burden,2)}의 구조로 봅니다.`;
    const subsumptionThought = `여기가 리걸 마인드의 핵심입니다. 조문을 반복하는 것이 아니라 이미 정리한 사실을 법적 요건 하나하나에 대입합니다. 이 사례의 포섭 구조는 ${joined(item.subsumption,4)}입니다.`;
    const procedureThought = `실체법상 권리가 있다는 판단과 실제로 그 권리를 실현하는 절차는 구별합니다. 이 사건에서는 ${joined(item.procedure,3)}의 순서와 수단을 검토합니다.`;
    const conclusionThought = `결론은 직감이나 가치판단을 새로 덧붙이는 단계가 아닙니다. 앞서 정리한 사실·쟁점·규범·증거·포섭을 압축한 법률적 결과입니다. 이 사건의 결론은 ${joined(item.conclusion,3)}입니다.`;
    const variationThought = `사례변형은 같은 문장을 반복하는 단계가 아닙니다. 바뀐 사실이 어느 법적 요건을 변화시키고, 그 변화가 권리·의무·책임·우선순위·범죄성립 등 어떤 법률효과로 이어지는지를 원사례와 비교합니다.`;

    const disclaimer = `<footer class="detail-disclaimer"><strong>학습·검증 안내</strong><p>본 자료는 리걸 마인드와 법률적 사고 구조를 익히기 위한 교육·연구용 자료이며 개별 사건에 대한 법률자문이나 법률의견이 아닙니다.</p><p>일부 가상사례 구성과 학습용 해설·초안 정리에 생성형 AI를 활용했으며, 판례 기반 사례는 공식 판결문과 법령 원문을 기준으로 검증합니다. 실제 사건은 최신 법령·판례와 구체적 증거관계를 별도로 확인해야 합니다.</p><p>Copyright © 이명훈 2026. All rights reserved.</p></footer>`;

    $('#caseDetail').innerHTML = `<header class="detail-head"><div class="detail-kicker">${esc(item.id)} · ${esc(item.mode)} · ${esc(item.area)}</div><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p><div class="detail-meta"><span>${esc(item.level)}</span><span>${esc(item.mode)}</span><span>${esc(item.area)}</span></div></header><div class="training-question"><strong>읽는 방법</strong><span>먼저 스스로 답을 만들지 않습니다. 아래의 리걸 마인드 해설을 순서대로 읽으면서 “왜 이 단계에서 이 사실을 보고, 왜 다음 단계로 넘어가는가”를 추적하십시오.</span><em>출발 쟁점 · ${esc(item.question)}</em></div><div class="model-overview"><strong>전체 리걸 마인드 흐름</strong>${legalMindOverview(item)}</div><div class="detail-steps">${step('01','사실관계 — 판단 전에 사건의 시간축을 고정한다',thought('리걸 마인드',factsThought)+list(item.facts),true)}${step('02','법적으로 의미 있는 사실 — 결론을 움직이는 사실만 선별한다',thought('리걸 마인드',legalFactsThought)+list(item.legalFacts),true)}${step('03','당사자·법률관계 — 사람관계를 청구·권리·의무 관계로 바꾼다',thought('리걸 마인드',relationThought)+list(item.relation),true)}${step('04','핵심 쟁점 — 일상적 질문을 법적 판단 질문으로 바꾼다',thought('리걸 마인드',issuesThought)+list(item.issues),true)}${step('05','적용 법규범·판례 — 쟁점에 답하는 규범을 찾는다',thought('리걸 마인드',normsThought)+list(item.laws)+list(item.precedents),true)}${step('06','증거·증명책임 — 주장할 사실과 증명할 사실을 분리한다',thought('리걸 마인드',evidenceThought)+`<h4>핵심 증거</h4>${list(item.evidence)}<h4>증명책임</h4>${list(item.burden)}`)}${step('07','주장·반론 — 양쪽 논리를 같은 강도로 구성한다',argumentsHtml)}${step('08','포섭 — 구체적 사실을 법적 요건에 대입한다',thought('리걸 마인드',subsumptionThought)+list(item.subsumption),true)}${step('09','절차·구제 — 권리판단과 권리실현 수단을 구별한다',thought('리걸 마인드',procedureThought)+list(item.procedure))}${step('10','결론 — 앞 단계의 판단을 법률효과로 연결한다',thought('리걸 마인드',conclusionThought)+list(item.conclusion),true)}${step('11','사례변형 — 변경된 요건과 법률효과를 비교한다',thought('리걸 마인드',variationThought)+variationList(item),true)}${step('12','공식자료·검증 — 리걸 마인드 해설을 원문과 대조한다',thought('검증 원칙','판례 기반 사례는 반드시 판결문과 법령 원문에 다시 연결하고, 가상사례는 실제 사건에 그대로 대입하지 않습니다.')+sources)}</div>${disclaimer}`;
    $('#caseDialog').showModal();
  }

  $('#caseGrid').addEventListener('click',e=>{const b=e.target.closest('[data-case]');if(b)openCase(b.dataset.case);});
  $('#dialogClose').addEventListener('click',()=>$('#caseDialog').close());
  $('#caseDialog').addEventListener('click',e=>{if(e.target===$('#caseDialog'))$('#caseDialog').close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#caseDialog').open)$('#caseDialog').close();});
  document.querySelectorAll('a[href="#top"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();window.scrollTo({top:0,behavior:'smooth'});}));

  $('#totalCount').textContent = `사례 ${cases.length}`;
  renderModes(); buildFilters(); renderCases();
})();
