(()=>{
  const host=document.getElementById('pipeline');
  if(!host)return;

  const css=document.createElement('style');
  css.textContent=`
  .bd-boundary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;margin-bottom:6px}.bd-boundary>div{padding:7px 8px;border:1px solid #dfe3e8;border-radius:8px;background:#fff}.bd-boundary b{display:block;margin-bottom:2px;font-size:.68rem}.bd-boundary p{margin:0;font-size:.6rem;line-height:1.35}.bd-boundary .editorial{border-left:3px solid #111}.bd-boundary .ad{border-left:3px solid #6b7280}.bd-boundary .public{border-left:3px solid #374151}
  .bd-packages{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px}.bd-package{border:1px solid #dfe3e8;border-radius:8px;background:#fff;overflow:hidden}.bd-package summary{cursor:pointer;list-style:none;padding:7px 8px;min-height:58px}.bd-package summary::-webkit-details-marker{display:none}.bd-package[open] summary{background:#f6f7f9;border-bottom:1px solid #e3e6ea}.bd-package strong{display:block;font-size:.67rem;line-height:1.25}.bd-package summary span{display:block;margin-top:2px;font-size:.58rem;line-height:1.3;color:#59636f}.bd-price{font-size:.7rem!important;color:#111!important;font-weight:900}.bd-body{padding:6px}.bd-info{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:3px}.bd-info div{padding:5px 6px;border:1px solid #e5e7eb;border-radius:6px;font-size:.58rem;line-height:1.34}.bd-info b{display:block;margin-bottom:1px;font-size:.59rem}.bd-wide{grid-column:1/-1}.bd-check{margin:4px 0 0;padding-left:15px}.bd-check li{margin:1px 0;font-size:.57rem;line-height:1.32}
  .bd-subhead{margin:7px 0 4px;font-size:.68rem;font-weight:900}.bd-common{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px}.bd-common div{padding:6px;border:1px solid #e1e4e8;border-radius:7px;background:#fff}.bd-common b{display:block;margin-bottom:2px;font-size:.61rem}.bd-common p{margin:0;font-size:.57rem;line-height:1.32}.bd-options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px}.bd-options span{padding:5px 6px;border:1px solid #e1e4e8;border-radius:7px;font-size:.57rem;line-height:1.3}.bd-options b{display:block;font-size:.59rem;margin-bottom:1px}.bd-flow{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:3px}.bd-flow span{padding:5px 3px;border:1px solid #dfe3e8;border-radius:6px;text-align:center;font-size:.55rem;font-weight:850;line-height:1.24}.bd-annual{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px}.bd-annual div{padding:6px;border:1px solid #e1e4e8;border-radius:7px}.bd-annual b{display:block;font-size:.62rem}.bd-annual span{font-size:.57rem;line-height:1.3}.bd-note{margin-top:5px;padding:6px 8px;border-left:3px solid #222;background:#f7f8fa;font-size:.59rem;line-height:1.38}
  #proposal .proposal-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important}
  @media(max-width:900px){.bd-packages{grid-template-columns:repeat(3,minmax(0,1fr))}.bd-flow{grid-template-columns:repeat(4,minmax(0,1fr))}.bd-common,.bd-options,.bd-annual{grid-template-columns:repeat(2,minmax(0,1fr))}}
  @media(max-width:620px){.bd-boundary{grid-template-columns:1fr}.bd-packages{grid-template-columns:repeat(2,minmax(0,1fr))}.bd-info{grid-template-columns:repeat(2,minmax(0,1fr))}.bd-flow{grid-template-columns:repeat(3,minmax(0,1fr))}#proposal .proposal-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
  `;
  document.head.append(css);

  const packages=[
    {n:'정책 세미나',size:'30~40명 · 2~3시간',price:'650만원',purpose:'정책·산업·지역현안을 전문가 발표와 토론으로 설명',prep:'3~4주',people:'기획 1 · 진행 1 · 현장 2 · 사회자 · 발제 1~2',agency:'주제·정책자료 제공, 참석대상 확정, 내부검수',vendors:'행사장 · 음향 · 인쇄 · 현수막/배너 · 다과',deliver:'행사운영 · 자료집 40부 · 사진 · 참석현황 · 결과보고',items:['장소·좌석·등록공간','노트북·프로젝터·스크린','유·무선 마이크·기본 음향','발표자료·프로그램·명찰','현수막·안내물·생수·다과','사진기록·질의응답·결과정리']},
    {n:'정책·사업 설명회',size:'약 50명 · 2~3시간',price:'780만원',purpose:'주민·기업·이해관계자에게 정책·사업내용과 일정 설명',prep:'3~4주',people:'기획 1 · 진행 1 · 현장 3 · 사회자',agency:'설명자료·담당자 발표, 질의답변 책임자 지정',vendors:'행사장 · 음향/영상 · 인쇄 · 행사물 · 다과',deliver:'설명회 운영 · 자료집 60부 · FAQ/질의정리 · 사진 · 결과보고',items:['발표대·좌석·등록데스크','빔·스크린·노트북·마이크','사업설명자료·FAQ·질문지','현수막·배너·명찰·안내판','생수·다과·주차/동선 안내','참석자·질의응답·사진·결과보고']},
    {n:'정책 공청회',size:'80~100명 · 2~3시간',price:'1,480만원',purpose:'정책·개발사업의 주민·전문가·이해관계자 의견수렴',prep:'4~6주',people:'PM 1 · 기획/진행 2 · 현장 4 · 사회/좌장 · 발제/토론 3~4',agency:'공청 목적·법정절차 확인, 이해관계자 명단, 답변 담당자',vendors:'대관 · 음향/영상 · 인쇄 · 행사물 · 다과 · 필요시 속기',deliver:'공청회 운영 · 자료집 120부 · 참석현황 · 발언/질의정리 · 사진 · 결과보고',items:['행사장·대기실·등록공간','좌석·발표대·스크린·마이크시스템','발제·토론자료·공청회 자료집','현수막·배너·명찰·안내물','생수·다과·현장요원·동선관리','발언기록·질의응답·사진·결과보고']},
    {n:'정책 포럼',size:'100~150명 · 반일',price:'1,800만원',purpose:'중장기 정책을 전문가·기관·기업과 심층 논의하고 확산',prep:'4~6주',people:'PM 1 · 기획 2 · 현장 5 · 사회/좌장 · 발표/패널 4~6',agency:'주제·정책방향·주요 참석자 협의, 발표내용 검수',vendors:'대관 · 음향/영상 · 인쇄 · 행사물 · 다과',deliver:'포럼운영 · 정책자료집 · 사진 · 참석현황 · 토론정리 · 결과보고',items:['기조/주제발표·패널토론 구성','무대·발표대·스크린·음향','정책자료집·프로그램·명찰','등록·안내·내빈 동선','현수막·배너·다과','사진·토론내용·성과정리']},
    {n:'공무원·기관 실무교육',size:'30명 · 2시간',price:'220만원',purpose:'AI·AX·정책·법률·홍보 등 기관 업무역량 교육',prep:'2~3주',people:'기획 1 · 강사 1 · 운영 1',agency:'교육대상·장소·장비 제공, 교육목표 확정',vendors:'필요시 외부강사 · 교재인쇄',deliver:'강의 · 교안/PDF · 교육자료 · 참석현황 · 간단 결과정리',items:['교육목표·대상 수준 사전확인','강사 섭외·강의안 검수','프로젝터·노트북·마이크','교재·실습자료·필기도구','출석·질의·만족도','다회차·외부전문가 별도견적']},
    {n:'반일 실무 워크숍',size:'30명 · 4시간',price:'450만원',purpose:'강의와 실습을 결합해 실제 업무 결과물을 만드는 교육',prep:'3~4주',people:'기획 1 · 강사 1~2 · 운영 1',agency:'실습환경·계정·업무사례 제공',vendors:'외부강사 · 인쇄 · 필요시 PC/장비',deliver:'강의·실습 · 교재 · 템플릿 · 결과물 · 만족도/결과정리',items:['사전수요조사·업무사례 확보','강의 2시간+실습 2시간 기준','PC/인터넷/프로젝터 확인','교재·실습파일·템플릿','질의·피드백·성과정리','AI·법률 등 전문강사 추가 가능']},
    {n:'정책 백서·사례집',size:'약 80쪽 · 100부',price:'950만원',purpose:'사업 추진과정·성과·사례를 체계적으로 기록·확산',prep:'6~10주',people:'기획/취재 1 · 원고/편집 1 · 디자인/인쇄 외주',agency:'원자료·사진·통계·검수자 지정',vendors:'편집디자인 · 교정 · 인쇄',deliver:'기획 · 자료수집 · 인터뷰 · 원고 · 디자인 · 100부 인쇄 · PDF',items:['목차·편집방향 확정','사업자료·통계·사진 수집','관계자 인터뷰·사례 정리','원고작성·교정·기관검수','편집디자인·인쇄감리','페이지·부수·추가취재에 따라 조정']},
    {n:'성과보고회',size:'50~80명 · 2~3시간',price:'980만원',purpose:'연말·사업완료 시 성과와 다음단계 공유',prep:'3~5주',people:'기획 1 · 진행 1 · 현장 3 · 사회자',agency:'성과수치·사례·발표자 확정',vendors:'대관 · 음향/영상 · 인쇄 · 행사물 · 다과',deliver:'행사운영 · 성과자료 · 사진 · 참석현황 · 결과보고',items:['성과지표·사례·발표자료','발표대·빔·스크린·마이크','성과자료집·현수막·배너','등록·명찰·다과·현장운영','사진·질의·향후계획 기록','차년도 사업계획과 연결']},
    {n:'연간 정책사업 운영',size:'1개 사업 · 연간',price:'2,400만원',purpose:'단발행사가 아니라 중장기 사업의 설명·교육·행사·성과기록을 연간 관리',prep:'연간계획 3~4주',people:'PM 1 · 기획/운영 1~2 + 필요시 외부전문가',agency:'연간일정·핵심성과·담당부서 지정',vendors:'행사·인쇄·교육 등 회차별 외주',deliver:'분기별 사업자료 · 교육/세미나 1회 · 성과정리 · 연말 결과자료',items:['1분기 사업계획·기초자료','2분기 현장/교육 또는 설명','3분기 중간성과·차년도 연계','4분기 성과정리·결과자료','회차별 과업·수량 사전확정','행사규모 확대·영상은 별도']},
    {n:'AI·AX 업무진단',size:'1개 부서 · 워크숍 포함',price:'550만원',purpose:'반복업무·민원·자료관리 등 AI·AX 적용기회를 구체화',prep:'3~4주',people:'PM/분석 1 · 워크숍 운영 1',agency:'업무자료·담당자 인터뷰·보안범위 확정',vendors:'필요시 전문개발사 별도',deliver:'현행업무 분석 · 개선과제 · 우선순위 · 실행로드맵 · 워크숍',items:['업무흐름·반복작업 조사','데이터·보안·개인정보 점검','AI 적용 후보·효과 정의','직원 워크숍·의견수렴','우선순위·추진단계 제안','시스템 개발은 별도 사업']}
  ];

  const pkgHtml=packages.map((p,i)=>`<details class="bd-package"><summary><strong>${String(i+1).padStart(2,'0')} · ${p.n}</strong><span>${p.size}</span><span class="bd-price">${p.price} · VAT 별도</span></summary><div class="bd-body"><div class="bd-info"><div><b>목적</b>${p.purpose}</div><div><b>준비기간</b>${p.prep}</div><div><b>투입인력</b>${p.people}</div><div><b>기관 협조</b>${p.agency}</div><div><b>외부업체</b>${p.vendors}</div><div><b>결과물</b>${p.deliver}</div><div class="bd-wide"><b>기본 준비</b><ul class="bd-check">${p.items.map(x=>`<li>${x}</li>`).join('')}</ul></div></div></div></details>`).join('');

  host.innerHTML=`
  <div class="section-head"><p class="eyebrow">13 · BUSINESS DEVELOPMENT PLAN</p><h2>공공사업 상품·실행계획</h2><p>언론의 편집·보도와 유료사업을 분리하고, 공공기관이 실제 계약할 수 있는 행사·교육·출판·디지털·AI 과업을 규모·가격·준비요건까지 표준화합니다.</p></div>
  <div class="bd-boundary">
    <div class="editorial"><b>EDITORIAL · 언론보도</b><p>정책기사·현장취재·인물인터뷰·기획보도는 편집 판단에 따른 비판매 영역입니다. 기사 게재를 유료사업의 납품물이나 계약조건으로 두지 않습니다.</p></div>
    <div class="ad"><b>ADVERTISING · 광고</b><p>지면광고·배너·별도 광고상품은 광고임을 명확히 구분하고 회사의 공식 광고단가와 계약조건을 적용합니다.</p></div>
    <div class="public"><b>PUBLIC BUSINESS · 공공사업</b><p>세미나·설명회·공청회·포럼·교육·백서·성과보고·AI·AX 등 명확한 과업·수량·검수·결과물을 기준으로 계약합니다.</p></div>
  </div>
  <div class="bd-packages">${pkgHtml}</div>

  <p class="bd-subhead">행사 공통 준비요건</p>
  <div class="bd-common">
    <div><b>공간</b><p>행사장·대기실·등록공간·좌석·주차·내빈 및 참석자 동선.</p></div>
    <div><b>발표·음향</b><p>노트북·프로젝터·스크린·발표대·유/무선 마이크·스피커·멀티탭·인터넷.</p></div>
    <div><b>행사물</b><p>현수막·배너·안내판·명찰·프로그램·초청장·발표자료·정책자료·자료집.</p></div>
    <div><b>운영인력</b><p>PM·사회자/좌장·발제/토론·등록·안내·현장진행·사진·필요시 음향기사.</p></div>
    <div><b>참석자 관리</b><p>초청대상·참석확인·등록명부·내빈소개자료·질문접수·질의응답 진행.</p></div>
    <div><b>편의</b><p>생수·다과·필기도구·주차안내·장애인 접근·비상연락 및 안전동선.</p></div>
    <div><b>기록</b><p>사진·참석현황·발표자료·질의응답·주요발언·설문·성과자료를 남깁니다.</p></div>
    <div><b>사후</b><p>결과보고·검수자료·정산근거·납품파일·후속일정·차년도 연결사항을 정리합니다.</p></div>
  </div>

  <p class="bd-subhead">선택 옵션·추가단가</p>
  <div class="bd-options">
    <span><b>현장 기록영상</b>카메라 1대·원본 중심 +60만원</span><span><b>인터뷰 영상</b>1명·3~5분 +150만원</span><span><b>행사 요약영상</b>2~4분 1편 +180만원</span><span><b>숏폼</b>기존 촬영분 활용 +40만원/편</span>
    <span><b>생중계</b>장비·인력 포함 +150~300만원 이상</span><span><b>추가 운영인력</b>약 +18만원/인일 기준</span><span><b>전문가·강사</b>기관 수당기준·전문성에 따라 별도</span><span><b>대관·인쇄·출장</b>기본범위 초과분은 실제 견적 반영</span>
  </div>
  <p class="bd-note">표준가격은 기본형 사업계획·견적 작성용 기준이며 VAT 별도입니다. 기관의 과업범위, 대관조건, 전문가 수당기준, 인쇄부수, 지역출장, 계약조건에 따라 조정합니다. 영상은 인력 병목을 막기 위해 기본상품에서 제외하고 필요한 사업에만 옵션으로 적용합니다.</p>

  <p class="bd-subhead">계약·실행 흐름</p>
  <div class="bd-flow"><span>사업발굴</span><span>담당부서</span><span>사전접촉</span><span>간이기획</span><span>예산·계약방식</span><span>제안·견적</span><span>범위협의</span><span>계약·발주</span><span>실행계획</span><span>업체·인력섭외</span><span>현장점검·리허설</span><span>실행</span><span>검수·납품</span><span>결과보고·후속</span></div>

  <p class="bd-subhead">연간 사업계획 모델</p>
  <div class="bd-annual"><div><b>행사·교육</b><span>세미나 6 · 설명회 4 · 공청회 3 · 포럼 2</span></div><div><b>출판·성과</b><span>백서·사례집 2 · 성과보고회 2</span></div><div><b>장기사업</b><span>연간 정책사업 2 · AI·AX 진단 4</span></div><div><b>계획 방법</b><span>상품별 목표수량 × 표준가격으로 연간 사업규모를 산정하고 분기별 제안일정을 배치</span></div></div>
  `;
})();
