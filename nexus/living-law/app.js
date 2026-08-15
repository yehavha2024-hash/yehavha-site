(() => {
  'use strict';

  const data = window.LIVING_LAW_DATA;
  if (!data) return;

  const categoryMap = new Map(data.categories.map((item) => [item.id, item]));
  const $ = (selector, root = document) => root.querySelector(selector);
  const make = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  };
  const itemTitle = (item) => item.n === 48 ? '내 사진·영상을 허락 없이 올렸다면' : item.title;

  const CATEGORY_GUIDANCE = {
    crime: {
      steps: [
        'A4 한 장에 사건일시·장소·상대방·구체적 행위·피해결과를 시간순으로 적고, 각 사실 옆에 이를 뒷받침하는 증거번호를 붙이세요.',
        '경찰에 제출한 뒤에는 사건번호, 담당 수사관, 조사일, 추가 제출자료, 통지받은 날짜를 한 표에서 관리하세요.',
        '불송치 통지를 받았다면 이유를 문장별로 나누고 사실오인·누락증거·법리문제로 구분한 뒤 새 자료가 있는지 확인하세요.'
      ],
      why: '형사절차에서는 최초 진술과 원본증거, 접수·통지 시점이 이후 송치 여부와 이의절차를 판단하는 기준이 될 수 있습니다.',
      avoid: '상대방에게 반복 연락해 자백을 유도하거나 캡처·녹음·영상의 일부만 잘라 맥락을 바꾸지 마세요. 제출본과 별도로 원본 파일·원본 기기를 보관하세요.'
    },
    housing: {
      steps: [
        '계약서의 임대인·임차인, 목적물 주소, 보증금, 임대기간, 특약을 먼저 표시하고 등기사항증명서의 소유자와 일치하는지 확인하세요.',
        '보증금 지급일·계약종료 통지일·이사 예정일·열쇠 인도일·보증금 반환 여부를 날짜순으로 적으세요.',
        '보증금이 반환되지 않은 상태에서 이사해야 한다면 임차권등기명령 등 권리보전 수단의 요건과 등기 완료 시점을 확인한 뒤 이동 여부를 결정하세요.'
      ],
      why: '주거분쟁은 계약 문구만이 아니라 등기, 보증금 지급·반환, 점유와 인도 시점이 서로 맞아야 권리관계를 설명하기 쉽습니다.',
      avoid: '해지나 퇴거를 구두로만 통보하지 말고 문자·내용증명 등 확인 가능한 방식으로 남기세요. 보증금 회수와 대항력·우선변제 문제를 확인하지 않은 채 먼저 집을 비우지 마세요.'
    },
    property: {
      steps: [
        '현장 전체사진과 근접사진을 함께 찍고, 촬영 날짜·장소·침입 또는 주차 위치가 드러나게 보존하세요.',
        '퇴거·이동 요구를 했다면 누가 언제 어떤 내용으로 요구했고 상대방이 어떻게 반응했는지 기록하세요.',
        '반복되는 경우에는 매번 새 사건처럼 흩어두지 말고 날짜·시간·행위·사진번호를 한 표에 누적해 반복성을 보여주세요.'
      ],
      why: '사유지·건물 문제는 소유권·점유·관리권한과 실제 방해행위를 구분해야 하며, 현장상황과 관리자의 명시적 요구가 중요한 자료가 될 수 있습니다.',
      avoid: '상대 차량이나 물건을 훼손하거나 임의 견인·잠금·봉쇄·폐기하지 마세요. 권리침해를 막으려다 오히려 별도 손해배상이나 형사문제가 생길 수 있습니다.'
    },
    money: {
      steps: [
        '표를 만들어 채권 발생원인, 지급한 금액, 지급일, 반환약정, 변제기, 일부변제, 독촉일, 현재 잔액을 각각 적으세요.',
        '차용증이 없다면 계좌이체만 보지 말고 “갚겠다”, 반환일, 이자, 일부변제처럼 대여관계를 보여주는 문자·메신저·통화기록을 함께 묶으세요.',
        '상대방 주소가 정확해야 소장·지급명령 송달이 진행됩니다. 주소와 송달 가능성을 먼저 확인하고, 승소 뒤 압류·추심할 재산이 있는지도 별도로 판단하세요.',
        '소송비용·인지대·송달료·집행비용과 예상 회수금액을 비교해 실제로 소송하는 것이 경제적으로 의미가 있는지 계산하세요.'
      ],
      why: '금전분쟁은 권리가 인정되어도 송달, 소멸시효, 채무자의 자력과 집행가능성을 놓치면 실제 회수가 어려울 수 있습니다.',
      avoid: '차용증이 없다는 이유만으로 바로 포기하거나, 계좌이체 내역 하나만으로 대여관계가 자동 입증된다고 단정하지 마세요. 판결을 받는 것과 실제 돈을 회수하는 것은 별개의 단계입니다.'
    },
    privacy: {
      steps: [
        '무슨 정보가, 누가, 언제, 누구에게, 어떤 경로로 제공했는지를 다섯 칸으로 나누어 적고 이를 확인할 이메일·메신저·수신화면을 보존하세요.',
        '개인정보처리자에게 자신의 정보 처리내역과 제3자 제공 여부를 서면으로 문의하고, 답변일과 답변내용을 저장하세요.',
        '정보가 틀렸다면 정정·삭제, 더 이상 필요하지 않은 처리가 계속된다면 처리정지 또는 동의철회가 가능한지 공식 절차로 요구하세요.',
        '기관의 답변 또는 거절사유를 받은 뒤 개인정보 침해신고·분쟁조정 등 다음 절차에 필요한 자료를 한 묶음으로 정리하세요.'
      ],
      why: '개인정보 문제는 어떤 정보가 누구에게 어떤 근거로 제공되었는지와 정보주체가 어떤 권리를 행사했는지를 문서로 남기는 것이 핵심입니다.',
      avoid: '유출이 의심된다는 이유만으로 공개적으로 상대방을 지목하지 마세요. 먼저 제공경로와 수신자를 확인하고 본인의 열람·정정·삭제·처리정지 권리를 순서대로 행사하세요.'
    },
    stalking: {
      steps: [
        '전화·메시지·접근·기다림·배달·계정사칭·위치노출을 날짜와 시간별로 적고 각 행위에 해당하는 캡처·사진·CCTV 위치를 연결하세요.',
        '거부 의사를 표시했다면 그 표현이 담긴 원본 메시지를 보존하고, 그 이후에도 행위가 계속됐는지를 별도로 표시하세요.',
        '집·직장·학교 주변에서 반복된다면 이동경로와 출현장소를 표로 만들어 접근의 반복성과 생활상 불안을 설명할 수 있게 하세요.',
        '즉시 위험하거나 상대방이 현장에 있다면 자료정리보다 112 신고와 안전한 장소로 이동하는 것을 먼저 하세요.'
      ],
      why: '스토킹은 개별 행위 하나보다 상대방 의사에 반한 접근인지, 반복·지속되었는지, 불안·공포가 어떻게 누적됐는지가 함께 중요합니다.',
      avoid: '상대방을 직접 만나 사실을 확인하거나 혼자 해결하려 하지 마세요. 장문의 경고를 반복하기보다 한 번의 명확한 거부의사와 이후 행위의 기록이 더 중요할 수 있습니다.'
    },
    consumer: {
      steps: [
        '주문일·결제일·수령일·취소요청일·사업자 답변일을 적고 광고화면, 상품설명, 약관, 결제내역을 함께 보존하세요.',
        '단순 변심인지 표시·광고 또는 계약내용과 다르게 제공된 것인지 구분하세요. 적용되는 청약철회 기간이 달라질 수 있습니다.',
        '환불을 요구할 때는 전화만 하지 말고 주문번호·취소사유·요청금액·요청일이 남는 문자·이메일·플랫폼 문의기능을 사용하세요.',
        '사업자가 거절하면 거절사유와 약관 조항을 받아 두고 소비자상담·분쟁조정 단계에 그대로 제출할 수 있게 정리하세요.'
      ],
      why: '소비자분쟁은 광고·계약 내용과 실제 제공내용, 결제·수령·철회 시점, 사업자의 답변이 서로 어떻게 다른지가 핵심입니다.',
      avoid: '전화통화만으로 환불을 요구하고 끝내지 마세요. 청약철회 기간이 있는 사건은 요청일을 남기는 것이 특히 중요합니다.'
    },
    labor: {
      steps: [
        '근로계약서와 실제 근무내용이 다른지 비교하고, 급여명세서·입금내역·출퇴근기록·업무지시를 월별로 묶으세요.',
        '임금체불이면 지급일별로 “받아야 할 금액 / 실제 받은 금액 / 미지급액”을 계산해 총 체불액을 표로 만드세요.',
        '해고·징계라면 통지받은 날짜, 통지방법, 사유, 회사규정, 소명기회가 있었는지를 순서대로 적으세요.',
        '고용노동부 진정이나 노동위원회 절차를 이용할 때는 접수번호와 제출자료 목록을 남기고 회사 답변과 대조하세요.'
      ],
      why: '근로분쟁은 실제 근무사실과 임금·근로시간·업무지시·징계 또는 해고사유를 객관자료로 연결하는 것이 중요합니다.',
      avoid: '퇴사 직전에 회사 영업비밀이나 다른 직원 개인정보를 무단 반출하지 마세요. 본인의 근무·임금·지시와 관련하여 적법하게 보유할 수 있는 자료를 중심으로 정리하세요.'
    },
    family: {
      steps: [
        '가족관계, 혼인, 자녀, 재산, 채무, 상속문제를 한 문서에 섞지 말고 각각 별도의 목록으로 작성하세요.',
        '재산문제는 부동산·예금·보험·대출·사업재산을 나누고 명의자, 취득시기, 현재가액, 채무를 함께 적으세요.',
        '이혼·양육 문제는 감정적인 대화와 별도로 실제 양육시간, 비용부담, 학교·병원 기록 등 객관자료를 모으세요.',
        '상속은 사망일을 기준으로 재산과 채무를 동시에 확인하고 상속포기·한정승인 등 법정기간이 문제되는지 가장 먼저 확인하세요.'
      ],
      why: '가족·상속 사건은 감정적 주장보다 혼인·재산·채무·양육·상속관계를 객관자료로 분리해 보는 것이 중요합니다.',
      avoid: '상대방 계정·휴대폰을 무단으로 열람하거나 재산을 임의 처분하지 마세요. 상속이나 재산분할은 행동 하나가 이후 법적 판단에 영향을 줄 수 있습니다.'
    },
    traffic: {
      steps: [
        '사고 직후 사람의 안전을 먼저 확인하고 차량 위치, 파손부위, 신호, 차선, 노면, 주변 CCTV 위치를 촬영하세요.',
        '블랙박스 원본을 별도 저장하고 신고번호, 보험접수번호, 병원 진료일, 상대방 정보까지 한 기록표에 적으세요.',
        '합의 제안을 받으면 치료경과·수리비·휴업손해·후유증 여부를 정리한 뒤 합의서가 추가청구를 제한하는 문구인지 읽으세요.',
        '과태료·행정처분을 다투는 경우에는 처분서를 받은 날짜와 불복기간을 먼저 표시하고, 납부 전에 이의절차와 납부의 효과를 확인하세요.'
      ],
      why: '교통·행정 사건은 사고 직후의 현장자료와 통지서 수령일, 불복기간이 이후 과실·손해·처분 판단에 큰 영향을 줄 수 있습니다.',
      avoid: '현장에서 과실비율이나 최종 합의금까지 즉시 확정하지 마세요. 블랙박스 원본과 치료·손해자료를 확보한 뒤 합의의 범위를 판단하세요.'
    }
  };

  const LAW_GUIDES = [
    {key:'형사소송법 제223조', title:'고소', plain:'범죄로 피해를 입은 사람은 고소할 수 있다는 기본 규정입니다.', use:'피해자 본인이 범죄사실을 신고하고 처벌을 구하는 절차의 출발점입니다.'},
    {key:'형사소송법 제234조', title:'고발', plain:'누구든지 범죄가 있다고 생각하면 고발할 수 있고, 공무원은 직무 중 범죄가 있다고 판단한 경우 고발의무가 문제될 수 있다는 규정입니다.', use:'피해자가 아닌 제3자가 알리는 고발은 고소와 절차상 지위가 다를 수 있습니다.'},
    {key:'형사소송법 제237조', title:'고소·고발의 방식', plain:'고소·고발은 서면 또는 구술로 검사 또는 사법경찰관에게 할 수 있고, 구술로 접수하면 조서를 작성하도록 한 규정입니다.', use:'정해진 서식 자체보다 누가 언제 어디서 무엇을 했는지와 증거를 명확히 정리하는 것이 중요합니다.'},
    {key:'형사소송법 제245조의5', title:'사법경찰관의 사건송치 등', plain:'경찰이 혐의가 있다고 보면 사건과 증거를 검사에게 송치하고, 혐의가 없다고 보는 경우에도 그 이유를 적은 서면과 관계서류·증거물을 검사에게 송부하도록 한 규정입니다.', use:'경찰의 수사결과가 송치인지 불송치인지에 따라 이후 절차가 달라집니다.'},
    {key:'형사소송법 제245조의6', title:'고소인 등에 대한 송부통지', plain:'경찰이 사건을 검사에게 송치하지 않는 경우에는 고소인·고발인·피해자 등에게 불송치 취지와 이유를 서면으로 통지하도록 한 규정입니다.', use:'통지서를 받은 날짜와 불송치 이유를 보관해야 다음 대응을 판단할 수 있습니다.'},
    {key:'형사소송법 제245조의7', title:'고소인 등의 이의신청', plain:'불송치 통지를 받은 사람 중 고발인을 제외한 법정 대상자는 해당 경찰관서의 장에게 이의를 신청할 수 있고, 이의신청이 있으면 사건과 자료를 검사에게 송치하도록 한 규정입니다.', use:'본인이 이의신청 대상인지와 불송치 이유에 반박할 자료가 무엇인지 먼저 확인해야 합니다.'},
    {key:'형법 제347조', title:'사기', plain:'사람을 속여 재물의 교부를 받거나 재산상 이익을 취득한 경우를 처벌하는 규정입니다.', use:'돈을 받지 못했다는 사실만으로 사기가 되는 것은 아니고, 처음부터 상대를 속인 행위와 재산처분 사이의 관계가 중요합니다.'},
    {key:'민법 제598조', title:'소비대차의 의의', plain:'한쪽이 돈이나 같은 종류로 바꿔 쓸 수 있는 물건을 이전하고, 상대방이 같은 종류·품질·수량으로 반환하기로 약정하면 소비대차가 성립한다는 규정입니다.', use:'가족·지인 사이 돈이 대여인지 증여인지 다툴 때 반환약정이 있었는지가 핵심이 됩니다.'},
    {key:'민법 제750조', title:'불법행위의 내용', plain:'고의 또는 과실의 위법행위로 다른 사람에게 손해를 입힌 사람은 그 손해를 배상할 책임이 있다는 기본 규정입니다.', use:'손해배상을 청구하려면 위법행위, 고의·과실, 실제 손해, 행위와 손해 사이의 인과관계를 설명할 자료가 필요합니다.'},
    {key:'민사소송법 제98조', title:'소송비용 부담의 원칙', plain:'민사소송의 소송비용은 원칙적으로 패소한 당사자가 부담한다는 규정입니다.', use:'소송을 시작할 때 청구금액뿐 아니라 패소 가능성과 비용부담도 함께 계산해야 합니다.'},
    {key:'주택임대차보호법 제3조의3', title:'임차권등기명령', plain:'임대차가 끝났는데 보증금을 돌려받지 못한 임차인은 임차주택 소재지를 관할하는 법원에 임차권등기명령을 신청할 수 있다는 규정입니다.', use:'보증금을 받지 못한 채 이사해야 하는 경우 기존 대항력·우선변제권 보전에 중요한 수단이 될 수 있으므로 등기 완료 여부를 확인해야 합니다.'},
    {key:'개인정보 보호법 제17조', title:'개인정보의 제3자 제공', plain:'개인정보를 제3자에게 제공하려면 정보주체의 동의나 법에서 정한 근거가 필요하고, 동의를 받을 때에는 제공받는 자·목적·항목·보유기간 등을 알려야 한다는 규정입니다.', use:'이력서의 전화번호·주소 등이 다른 사람에게 전달됐다면 누구에게 어떤 근거로 제공했는지부터 확인해야 합니다.'},
    {key:'개인정보 보호법 제35조', title:'개인정보의 열람', plain:'정보주체는 개인정보처리자가 처리하는 자신의 개인정보를 열람해 달라고 요구할 수 있다는 규정입니다.', use:'무슨 정보가 보관·처리되고 있는지 모를 때 먼저 처리내역을 확인하는 출발점이 됩니다.'},
    {key:'개인정보 보호법 제36조', title:'개인정보의 정정·삭제', plain:'자신의 개인정보를 열람한 뒤 잘못된 정보의 정정 또는 삭제를 요구할 수 있고, 개인정보처리자는 필요한 조치를 한 후 결과를 알려야 한다는 규정입니다. 다른 법령이 보관을 요구하는 정보는 삭제가 제한될 수 있습니다.', use:'틀린 주소·연락처나 더 이상 보유할 필요가 없는 정보의 정정·삭제 요구에 사용됩니다.'},
    {key:'개인정보 보호법 제37조', title:'개인정보의 처리정지 등', plain:'정보주체는 자신의 개인정보 처리정지를 요구하거나 법이 허용하는 범위에서 동의를 철회할 수 있고, 개인정보처리자는 정당한 예외가 없으면 처리정지 조치를 해야 한다는 규정입니다.', use:'정보를 계속 이용하거나 제공하는 것을 중단시킬 필요가 있을 때 확인하는 규정입니다.'},
    {key:'스토킹범죄의 처벌 등에 관한 법률 제2조', title:'스토킹행위·스토킹범죄의 정의', plain:'상대방 의사에 반해 정당한 이유 없이 접근·추적·기다림·연락·물건 전달·정보 유포·사칭 등 법에서 정한 행위로 불안감이나 공포심을 일으키는 경우를 스토킹행위로 보고, 이를 지속적 또는 반복적으로 하면 스토킹범죄로 규정합니다.', use:'행위 하나만 떼어 보지 말고 거부의사, 반복성, 접근방식, 불안·공포의 누적을 시간순으로 정리해야 합니다.'},
    {key:'근로기준법 제23조', title:'해고 등의 제한', plain:'사용자는 정당한 이유 없이 근로자를 해고·휴직·정직·전직·감봉하거나 그 밖의 징벌을 할 수 없다는 규정입니다.', use:'해고나 징계를 받은 경우 회사가 제시한 사유와 실제 사실, 회사규정, 통지과정을 함께 확인해야 합니다.'},
    {key:'근로기준법 제36조', title:'금품 청산', plain:'근로자가 퇴직하거나 사망한 경우 사용자는 원칙적으로 지급사유가 생긴 때부터 14일 이내에 임금·보상금 등 금품을 지급해야 하고, 특별한 사정이 있으면 당사자 합의로 기한을 연장할 수 있다는 규정입니다.', use:'퇴직 후 임금이나 금품이 남아 있다면 퇴직일과 미지급액, 별도 지급기일 합의가 있었는지 확인해야 합니다.'},
    {key:'근로기준법 제43조', title:'임금 지급', plain:'임금은 원칙적으로 근로자에게 직접 전액을 통화로 지급하고, 매월 한 번 이상 일정한 날짜를 정해 지급해야 한다는 규정입니다.', use:'급여일·실제 입금액·공제내역을 월별로 비교하면 체불 여부를 정리하기 쉽습니다.'},
    {key:'전자상거래 등에서의 소비자보호에 관한 법률 제17조', title:'청약철회', plain:'통신판매에서 소비자는 원칙적으로 계약서면을 받거나 상품 공급이 시작된 때를 기준으로 7일 이내 청약철회를 할 수 있고, 표시·광고나 계약내용과 다르게 이행된 경우에는 더 긴 별도 기간이 적용될 수 있다는 규정입니다. 사용·훼손 등 일정한 경우에는 제한이 있습니다.', use:'주문일보다 실제 수령일, 취소요청일, 상품상태와 청약철회 제한사유를 정확히 기록해야 합니다.'},
    {key:'도로교통법 제54조', title:'사고발생 시의 조치', plain:'교통사고가 나면 운전자 등은 즉시 정차해 사상자 구호 등 필요한 조치를 하고 피해자에게 성명·전화번호·주소 등 인적사항을 제공해야 하며, 일정한 경우 경찰에 사고내용을 신고해야 한다는 규정입니다.', use:'사고 직후에는 과실비율 논쟁보다 구호·안전조치·인적사항 제공·현장기록이 먼저입니다.'},
    {key:'민법 제839조의2', title:'재산분할청구권', plain:'이혼한 배우자 일방은 다른 배우자에게 재산분할을 청구할 수 있고, 협의가 안 되면 가정법원이 공동으로 형성한 재산과 여러 사정을 고려해 분할액과 방법을 정하며, 청구권은 이혼한 날부터 2년이 지나면 소멸합니다.', use:'재산목록과 채무, 취득시기, 형성에 대한 기여자료를 빠르게 정리해야 합니다.'},
    {key:'민법 제840조', title:'재판상 이혼원인', plain:'배우자의 부정행위, 악의의 유기, 심히 부당한 대우, 3년 이상 생사불명, 혼인을 계속하기 어려운 중대한 사유 등 법이 정한 사유가 있으면 가정법원에 이혼을 청구할 수 있다는 규정입니다.', use:'단순한 갈등인지 법이 정한 재판상 이혼사유에 해당하는지 사실과 증거를 구분해 정리해야 합니다.'},
    {key:'민법 제1060조', title:'유언의 요식성', plain:'유언은 민법이 정한 방식에 따르지 않으면 효력이 생기지 않는다는 규정입니다.', use:'내용이 분명해도 자필증서·공정증서 등 선택한 유언방식의 형식요건을 지키지 않으면 효력이 문제될 수 있습니다.'}
  ];

  const LAW_FALLBACKS = [
    ['형법','범죄가 성립하는 요건과 형벌을 정한 기본 형사법입니다. 조문명만 보지 말고 실제 행위·고의 또는 과실·피해결과가 그 요건에 맞는지 확인해야 합니다.'],
    ['형사소송법','고소·고발, 수사, 송치, 재판 등 형사절차가 어떻게 진행되는지를 정한 법입니다. 접수·통지·이의신청 등 절차상 시점이 중요합니다.'],
    ['민법','계약, 채권, 손해배상, 가족·상속 등 개인 사이의 권리와 의무를 정한 기본법입니다. 계약내용과 실제 행위, 손해, 시점을 함께 봐야 합니다.'],
    ['민사소송법','민사재판의 관할, 소장, 송달, 증거, 재판과 소송비용 등 절차를 정한 법입니다. 권리가 있어도 관할과 송달, 청구취지·청구원인을 정확히 구성해야 합니다.'],
    ['민사집행법','판결·지급명령 같은 집행권원을 실제 압류·추심·경매로 실행하는 절차를 정한 법입니다. 승소와 실제 회수는 별개의 단계입니다.'],
    ['주택임대차보호법','주택 임차인의 대항력·우선변제권·임차권등기명령 등 보증금과 주거안정을 보호하기 위한 특별법입니다.'],
    ['개인정보 보호법','개인정보의 수집·이용·제공과 정보주체의 열람·정정·삭제·처리정지 등 권리를 정한 법입니다.'],
    ['스토킹범죄의 처벌 등에 관한 법률','스토킹행위의 범위, 긴급응급조치·잠정조치, 처벌과 피해자 보호절차를 정한 법입니다.'],
    ['근로기준법','임금·근로시간·휴일·해고 등 근로조건의 최저기준과 사용자의 의무를 정한 법입니다.'],
    ['전자상거래 등에서의 소비자보호에 관한 법률','온라인·통신판매에서 사업자의 정보제공 의무와 소비자의 청약철회·환급 등 권리를 정한 법입니다.'],
    ['도로교통법','도로에서의 통행방법, 운전의무, 교통사고 발생 시 조치와 각종 교통규칙을 정한 법입니다.'],
    ['행정심판법','행정기관의 처분이나 부작위에 대해 행정심판으로 다투는 절차를 정한 법입니다. 불복기간과 처분서를 받은 날짜가 중요합니다.'],
    ['행정소송법','행정처분의 취소·무효확인 등 법원에서 행정기관의 처분을 다투는 절차를 정한 법입니다. 제소기간과 관할을 먼저 확인해야 합니다.'],
    ['가정폭력범죄의 처벌 등에 관한 특례법','가정폭력 사건의 형사처리와 피해자 보호·임시조치 등 특별절차를 정한 법입니다.'],
    ['양육비 이행확보 및 지원에 관한 법률','양육비 채권의 이행확보와 양육비이행관리원 등의 지원절차를 정한 법입니다.'],
    ['질서위반행위규제법','과태료 부과·징수와 이의제기 절차의 공통기준을 정한 법입니다.'],
    ['자동차손해배상 보장법','자동차 운행으로 사람이 사망하거나 다친 경우의 손해배상과 보험제도 등을 정한 법입니다.']
  ];

  const searchInput = $('#lawSearch');
  const categoryFilters = $('#categoryFilters');
  const resultCount = $('#resultCount');
  const cards = $('#lawCards');
  const empty = $('#emptyState');
  const dialog = $('#lawDialog');
  const dialogBody = $('#dialogBody');
  const closeDialog = $('#closeDialog');
  const resetFilters = $('#resetFilters');
  let activeCategory = 'all';
  let query = '';

  function normal(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function lawGuide(raw) {
    const exact = LAW_GUIDES.find((entry) => raw.includes(entry.key));
    if (exact) return { ref: raw, title: exact.title, plain: exact.plain, use: exact.use };
    const fallback = LAW_FALLBACKS.find(([name]) => raw.includes(name));
    return {
      ref: raw,
      title: '',
      plain: fallback ? fallback[1] : '이 규정은 해당 사건에서 권리·의무 또는 절차의 근거가 될 수 있는 법률입니다. 조문 제목과 적용요건을 공식 법령에서 함께 확인해야 합니다.',
      use: '이 사건의 사실관계가 해당 법률의 요건에 실제로 들어맞는지를 증거와 함께 확인하는 것이 중요합니다.'
    };
  }

  function searchable(item) {
    const guide = CATEGORY_GUIDANCE[item.category] || {};
    const lawText = (item.laws || []).flatMap((law) => {
      const explained = lawGuide(law);
      return [explained.ref, explained.title, explained.plain, explained.use];
    });
    return normal([
      item.n,itemTitle(item),item.summary,item.now,item.route,item.caution,guide.why,guide.avoid,
      ...(guide.steps || []),...(item.evidence || []),...lawText,categoryMap.get(item.category)?.title
    ].join(' '));
  }

  function filteredItems() {
    return data.items.filter((item) => {
      const categoryOk = activeCategory === 'all' || item.category === activeCategory;
      const queryOk = !query || searchable(item).includes(query);
      return categoryOk && queryOk;
    });
  }

  function renderFilters() {
    categoryFilters.replaceChildren();
    const all = [{id:'all',icon:'◎',title:'전체',count:data.items.length}, ...data.categories.map((category) => ({
      ...category,
      count:data.items.filter((item) => item.category === category.id).length
    }))];
    all.forEach((category) => {
      const button = make('button', `filter-chip${activeCategory === category.id ? ' active' : ''}`);
      button.type = 'button';
      button.dataset.category = category.id;
      button.append(
        make('span','filter-icon',category.icon || '•'),
        make('span','filter-title',category.title),
        make('span','filter-count',String(category.count))
      );
      button.addEventListener('click', () => {
        activeCategory = category.id;
        renderFilters();
        renderCards();
      });
      categoryFilters.append(button);
    });
  }

  function makePreview(item) {
    const category = categoryMap.get(item.category) || {};
    const article = make('article', 'law-card');
    const top = make('div','law-card-top');
    const number = make('span','law-number',String(item.n).padStart(3,'0'));
    const badges = make('div','law-badges');
    badges.append(make('span','law-category',category.title || item.category));
    if (item.hot) badges.append(make('span','hot-badge','핵심'));
    top.append(number,badges);
    const title = make('h3','',itemTitle(item));
    const summary = make('p','law-summary',item.summary);
    const quick = make('div','quick-action');
    quick.append(make('span','quick-label','먼저'),make('p','',item.now));
    const law = make('div','law-basis-preview');
    law.append(make('span','quick-label','근거'),make('p','',(item.laws || []).slice(0,2).join(' · ')));
    const button = make('button','detail-button','구체적인 대응방법 보기');
    button.type = 'button';
    button.addEventListener('click', () => openDetail(item));
    article.append(top,title,summary,quick,law,button);
    return article;
  }

  function renderCards() {
    const list = filteredItems();
    cards.replaceChildren();
    resultCount.textContent = `${list.length}개 항목`;
    empty.hidden = list.length > 0;
    list.forEach((item) => cards.append(makePreview(item)));
  }

  function section(title, content, className='detail-section') {
    const block = make('section', className);
    block.append(make('h4','',title));
    if (typeof content === 'string') block.append(make('p','',content));
    else if (content) block.append(content);
    return block;
  }

  function listNode(items) {
    const list = make('ul','detail-list');
    (items || []).forEach((item) => list.append(make('li','',item)));
    return list;
  }

  function processNode(item) {
    const guide = CATEGORY_GUIDANCE[item.category] || {};
    const evidence = (item.evidence || []).join(' · ') || '관련 자료';
    const steps = [
      `1. 사실관계 정리 — ${item.now}`,
      `2. 자료 묶기 — ${evidence}을 준비하고 원본과 제출용 사본을 구분하세요. 각 자료에는 날짜·출처·무엇을 입증하는지 한 줄씩 적으세요.`,
      ...(guide.steps || []).map((step, index) => `${index + 3}. ${step}`),
      `${(guide.steps || []).length + 3}. 접수·진행 — ${item.route}`,
      `${(guide.steps || []).length + 4}. 접수 후 관리 — 접수번호·담당부서·제출자료·통지받은 날짜를 적고, 답변서나 결정문을 받으면 추가자료 제출 또는 이의·불복 기간이 있는지 즉시 표시하세요.`
    ];
    return listNode(steps);
  }

  function lawNode(item) {
    const wrap = make('div','law-guide-list');
    (item.laws || []).forEach((raw) => {
      const guide = lawGuide(raw);
      const card = make('article','law-guide-card');
      const heading = make('div','law-guide-heading');
      heading.append(make('strong','law-guide-ref',guide.ref));
      if (guide.title && !guide.ref.includes(`(${guide.title})`)) heading.append(make('span','law-guide-title',guide.title));
      const plain = make('p','law-guide-plain',guide.plain);
      const use = make('p','law-guide-use',`이 항목에서 보는 이유: ${guide.use}`);
      card.append(heading,plain,use);
      wrap.append(card);
    });
    return wrap;
  }

  function cautionNode(item) {
    const guide = CATEGORY_GUIDANCE[item.category] || {};
    const wrap = make('div','caution-detail');
    const primary = make('p','caution-primary',item.caution);
    const why = make('div','caution-point');
    why.append(make('strong','','놓치면 생기는 문제'),make('p','',guide.why || '사실관계와 증거, 절차상 시점을 놓치면 권리가 있어도 입증이나 권리행사가 어려워질 수 있습니다.'));
    const avoid = make('div','caution-point');
    avoid.append(make('strong','','이렇게 하지 마세요'),make('p','',guide.avoid || '상대방과의 분쟁을 키우거나 증거의 신뢰성을 떨어뜨릴 수 있는 행동은 피하고 원본자료와 공식 절차를 중심으로 대응하세요.'));
    wrap.append(primary,why,avoid);
    return wrap;
  }

  function procedureNode(item) {
    const wrap = make('div','procedure-detail');
    wrap.append(make('p','procedure-main',item.route));
    const list = make('ol','procedure-list');
    [
      '접수 전에는 담당기관과 필요한 서류를 확인하고 제출본을 복사하거나 파일로 보관하세요.',
      '접수할 때에는 접수증·사건번호·민원번호 등 진행상황을 확인할 수 있는 번호를 반드시 받아 두세요.',
      '접수 후에는 담당부서와 답변예정일을 기록하고, 통지서를 받은 날짜부터 불복기간이나 후속기한을 계산하세요.'
    ].forEach((text) => list.append(make('li','',text)));
    wrap.append(list);
    return wrap;
  }

  function sourceLinks(item) {
    const row = make('div','source-links');
    const used = new Set();
    (item.sources || []).forEach((key) => {
      if (used.has(key)) return;
      const source = data.sources[key];
      if (!source) return;
      used.add(key);
      const link = make('a','',`${source.label} ↗`);
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      row.append(link);
    });
    return row;
  }

  function openDetail(item) {
    const category = categoryMap.get(item.category) || {};
    dialogBody.replaceChildren();
    const header = make('header','dialog-header');
    const meta = make('div','dialog-meta');
    meta.append(make('span','law-number',String(item.n).padStart(3,'0')),make('span','law-category',category.title || item.category));
    if (item.hot) meta.append(make('span','hot-badge','핵심'));
    header.append(meta,make('h2','',itemTitle(item)),make('p','dialog-summary',item.summary));

    const action = make('div','action-panel');
    action.append(make('strong','','지금 할 일'),make('p','',item.now));

    dialogBody.append(
      header,
      action,
      section('실제 진행 순서',processNode(item),'detail-section practical-section'),
      section('확보할 자료·증거',listNode(item.evidence)),
      section('법은 이렇게 규정합니다',lawNode(item),'detail-section law-explanation-section'),
      section('접수·문의·다음 절차',procedureNode(item)),
      section('주의할 점',cautionNode(item),'detail-section caution-section'),
      section('공식 확인처',sourceLinks(item))
    );

    const footer = make('div','dialog-footer-note');
    footer.append(
      make('p','','생활법률 100선은 일반인이 일상에서 알아둘 법적 상식과 기본 대응절차를 정리한 참고자료이며, 이 내용은 개별 사건에 대한 법률자문이 아닙니다. 구체적인 계약·증거·금액·기한에 따라 적용되는 법과 결론이 달라질 수 있으므로 중요한 사건은 변호사·법무사·노무사·세무사 등 해당 분야 전문가 또는 공식기관의 최신 안내를 확인하세요.'),
      make('p','dialog-copyright','Copyright © 이명훈 2026. All rights reserved.')
    );
    dialogBody.append(footer);
    if (typeof dialog.showModal === 'function') dialog.showModal();
  }

  function close() {
    if (dialog.open) dialog.close();
  }

  searchInput.addEventListener('input', (event) => {
    query = normal(event.target.value);
    renderCards();
  });
  closeDialog.addEventListener('click', close);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });
  resetFilters.addEventListener('click', () => {
    activeCategory = 'all';
    query = '';
    searchInput.value = '';
    renderFilters();
    renderCards();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && dialog.open) close();
  });

  $('#updatedAt').textContent = data.updatedAt.replaceAll('-','.');
  $('#baselineDate').textContent = data.legalBaseline.replaceAll('-','.');
  $('#totalCount').textContent = String(data.items.length);
  renderFilters();
  renderCards();
})();
