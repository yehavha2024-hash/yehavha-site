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
      focus: '사건번호·접수일·담당부서·조사일·통지일을 한 줄 타임라인으로 관리하세요.',
      why: '형사절차에서는 최초 진술의 일관성, 증거의 출처와 원본성, 접수·통지 시점이 이후 판단과 이의·불복 절차의 출발점이 될 수 있습니다.',
      avoid: '상대방에게 반복 연락해 자백을 유도하거나 캡처·녹음·영상의 일부만 잘라 맥락을 바꾸지 마세요. 제출 후에도 원본은 별도로 보관하는 편이 안전합니다.'
    },
    housing: {
      focus: '계약서·등기사항·보증금 입출금·문자·내용증명·열쇠 인도 시점을 하나의 날짜표로 맞춰 보세요.',
      why: '주거분쟁은 계약 내용만이 아니라 등기, 보증금 지급·반환, 점유와 인도 시점이 서로 맞아야 권리관계를 설명하기 쉽습니다.',
      avoid: '계약해지나 퇴거를 구두로만 통보하고 기록을 남기지 않거나, 보증금 회수와 점유·인도 관계를 확인하지 않은 채 먼저 집을 비우는 행동은 피하세요.'
    },
    property: {
      focus: '현장 사진·영상, 위치, 반복 횟수, 퇴거·이동 요구 일시와 상대방 반응을 시간순으로 기록하세요.',
      why: '사유지·건물 문제는 소유권·점유·관리권한과 실제 방해행위를 구분해야 하며, 현장 상황과 관리자의 명시적 요구가 중요한 자료가 될 수 있습니다.',
      avoid: '상대 차량이나 물건을 훼손하거나 임의 견인·잠금·봉쇄·폐기하지 마세요. 자력구제가 별도 민·형사 분쟁을 만들 수 있으므로 관리규약과 적법한 절차를 먼저 확인하세요.'
    },
    money: {
      focus: '채권 발생근거, 변제기, 독촉기록, 상대방 주소·재산 단서, 소멸시효 관련 시점을 따로 정리하세요.',
      why: '금전분쟁은 권리가 인정되어도 송달, 소멸시효, 채무자의 자력과 집행가능성을 놓치면 실제 회수가 어려울 수 있습니다.',
      avoid: '차용증이 없다는 이유만으로 곧바로 포기하거나, 반대로 계좌이체 내역 하나만으로 대여관계가 자동 입증된다고 단정하지 마세요. 판결 이후 집행 가능성도 함께 보세요.'
    },
    privacy: {
      focus: '정보의 종류, 최초 수집처, 제3자 제공 여부, 알게 된 날짜, 삭제·회수·처리정지 요청과 상대방 답변을 기록하세요.',
      why: '개인정보 문제는 어떤 정보가 누구에게 어떤 경로로 제공되었는지, 처리 근거와 동의 범위가 무엇이었는지를 확인하는 것이 핵심입니다.',
      avoid: '유출이 의심된다는 이유만으로 공개적으로 상대방을 지목하지 마세요. 화면·메일·수신자·제공경로를 보존한 뒤 열람·정정·삭제·처리정지 또는 신고 절차를 검토하세요.'
    },
    stalking: {
      focus: '전화·메시지·접근·배달·계정·위치노출을 날짜별로 모으고, 거부 의사 표시와 그 이후의 행위를 함께 기록하세요.',
      why: '스토킹은 개별 행위 하나보다 반복성, 상대방의 의사, 접근 방식과 공포·불안의 누적이 함께 문제될 수 있어 시간순 기록이 특히 중요합니다.',
      avoid: '위험을 확인하려고 혼자 만나거나 장문의 경고를 반복하지 마세요. 즉시 위험하면 112 등 긴급기관을 우선하고 위치·일정 공개를 줄이는 것이 좋습니다.'
    },
    consumer: {
      focus: '결제일, 수령일, 취소요청일, 사업자 답변, 상품·서비스 상태를 날짜순으로 정리하세요.',
      why: '소비자분쟁은 광고·계약 내용과 실제 제공내용, 결제·수령·철회 시점, 사업자의 답변이 서로 어떻게 다른지가 핵심입니다.',
      avoid: '전화로만 환불을 요구하고 기록을 남기지 마세요. 주문화면·광고문구·약관·결제내역·취소요청과 답변을 한 묶음으로 보존하세요.'
    },
    labor: {
      focus: '근로계약서, 급여명세, 출퇴근, 업무지시, 인사통지, 본인이 적법하게 보유한 메시지의 날짜를 서로 맞춰 보세요.',
      why: '근로분쟁은 실제 근무사실과 임금·근로시간·업무지시·징계 또는 해고 사유를 객관자료로 연결하는 것이 중요합니다.',
      avoid: '퇴사 전 회사의 영업비밀이나 타인의 개인정보를 무단 반출하지 마세요. 본인의 임금·근무·지시와 관련하여 적법하게 보유할 수 있는 자료 중심으로 정리하세요.'
    },
    family: {
      focus: '가족관계서류, 재산목록, 채무, 계좌, 등기, 자녀 관련 기록을 서로 섞지 말고 항목별로 분리하세요.',
      why: '가족·상속 사건은 감정적 주장보다 혼인·재산·채무·양육·상속관계를 객관자료로 분리해 보는 것이 중요합니다.',
      avoid: '상대방의 계정·휴대폰을 무단으로 열람하거나 재산을 임의 처분하지 마세요. 상속·이혼 관련 기간과 재산 처분의 효과는 행동 전에 먼저 확인하세요.'
    },
    traffic: {
      focus: '사고일시·장소, 신고번호, 보험접수번호, 진료일, 처분서 수령일을 하나의 기록표로 관리하세요.',
      why: '교통·행정 사건은 사고 직후의 현장자료와 통지서 수령일, 불복기간이 이후 과실·손해·처분 판단에 큰 영향을 줄 수 있습니다.',
      avoid: '현장에서 과실비율이나 최종 합의금까지 즉시 확정하려 하지 마세요. 블랙박스 원본, 현장사진, 진료자료와 처분서부터 확보한 뒤 절차를 판단하세요.'
    }
  };

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

  function searchable(item) {
    const guide = CATEGORY_GUIDANCE[item.category] || {};
    return normal([
      item.n,itemTitle(item),item.summary,item.now,item.route,item.caution,guide.focus,guide.why,guide.avoid,
      ...(item.evidence || []),...(item.laws || []),categoryMap.get(item.category)?.title
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

  function practicalChecklist(item) {
    const guide = CATEGORY_GUIDANCE[item.category] || {};
    const evidence = (item.evidence || []).slice(0, 3).join(' · ') || '관련 자료';
    return [
      `자료 정리: ${evidence}은 원본과 제출용 사본을 구분하고, 각 자료에 날짜·출처·무엇을 보여주는 자료인지 한 줄 메모를 붙이세요.`,
      '절차 기록: 신고·민원·조정·소송 등 어떤 절차를 이용하든 접수일, 접수번호, 담당부서, 제출문서 사본과 통지받은 날짜를 함께 보관하세요.',
      guide.focus || '사건의 핵심 날짜와 상대방의 대응을 시간순으로 정리하세요.',
      '결과 확인: 답변서·통지서·결정문을 받으면 결론만 보지 말고 받은 날짜, 이유, 추가자료 제출 또는 이의·불복 기간이 있는지부터 확인하세요.'
    ];
  }

  function cautionNode(item) {
    const guide = CATEGORY_GUIDANCE[item.category] || {};
    const wrap = make('div','caution-detail');
    const primary = make('p','caution-primary',item.caution);
    const why = make('div','caution-point');
    why.append(make('strong','','왜 중요한가'),make('p','',guide.why || '사건의 사실관계와 증거, 절차상 시점에 따라 결과가 달라질 수 있기 때문입니다.'));
    const avoid = make('div','caution-point');
    avoid.append(make('strong','','피해야 할 행동'),make('p','',guide.avoid || '상대방과의 분쟁을 키우거나 증거의 신뢰성을 떨어뜨릴 수 있는 행동은 피하고, 공식 절차와 원본자료를 중심으로 대응하세요.'));
    wrap.append(primary,why,avoid);
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
      section('실무 체크포인트',listNode(practicalChecklist(item)),'detail-section practical-section'),
      section('확보할 자료·증거',listNode(item.evidence)),
      section('법률 분류·핵심 근거',listNode(item.laws)),
      section('접수·문의·다음 절차',item.route),
      section('주의할 점 · 실제 실수',cautionNode(item),'detail-section caution-section'),
      section('공식 확인처',sourceLinks(item))
    );

    const note = make('div','dialog-disclaimer');
    note.append(
      make('strong','','개별 법률자문이 아닙니다.'),
      make('p','','이 항목은 일반적인 생활법률 정보와 대응순서를 설명하는 참고자료입니다. 실제 결론은 계약내용·증거·당사자 관계·사건 발생시점의 시행법에 따라 달라질 수 있습니다.'),
      make('p','','법정기간, 고액 손해, 형사사건, 신변위험, 보전처분·강제집행·상소처럼 결과에 큰 영향을 주는 사안은 공식기관의 최신 안내와 해당 업무범위의 자격전문가 확인을 거쳐 판단하세요.')
    );
    dialogBody.append(note);
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
