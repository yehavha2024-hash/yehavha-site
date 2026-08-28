(()=>{
  const sections={
    content:document.getElementById('content'),
    editorial:document.getElementById('editorial'),
    questions:document.getElementById('questions'),
    proposal:document.getElementById('proposal')
  };
  if(!sections.content||!sections.editorial||!sections.questions||!sections.proposal)return;

  const css=document.createElement('style');
  css.textContent=`
  .ops-flow{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px}.ops-step{padding:7px;border:1px solid #dde1e6;border-radius:8px;background:#fff}.ops-step b{display:block;margin-bottom:2px;font-size:.7rem}.ops-step p{margin:0;font-size:.63rem;line-height:1.38}.ops-step .n{display:inline-block;margin-right:4px;font-size:.58rem;color:#667085}.ops-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px}.ops-card{padding:8px;border:1px solid #dde1e6;border-radius:8px;background:#fff}.ops-card h3{margin:0 0 4px;font-size:.76rem}.ops-card p{margin:0;font-size:.66rem;line-height:1.45}.ops-card ul{margin:4px 0 0;padding-left:16px}.ops-card li{margin:2px 0;font-size:.64rem;line-height:1.38}.ops-kv{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;margin-top:5px}.ops-kv span{padding:5px 6px;border:1px solid #e2e6ea;border-radius:7px;font-size:.61rem;line-height:1.32}.ops-kv b{display:block;margin-bottom:1px;font-size:.62rem}.ops-note{margin-top:5px;padding:6px 8px;border-left:3px solid #222;background:#f7f8fa;font-size:.63rem;line-height:1.42}.ops-table{display:grid;grid-template-columns:.78fr 1.25fr 1.35fr 1.1fr;gap:1px;background:#dfe3e8;border:1px solid #dfe3e8;border-radius:8px;overflow:hidden}.ops-table>div{padding:6px;background:#fff;font-size:.62rem;line-height:1.35}.ops-table .th{background:#f3f5f7;font-weight:900}.ops-question-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px}.ops-question{padding:7px 8px;border:1px solid #dde1e6;border-radius:8px;background:#fff}.ops-question strong{display:block;margin-bottom:3px;font-size:.7rem}.ops-question ol{margin:0;padding-left:18px}.ops-question li{margin:2px 0;font-size:.63rem;line-height:1.38}.proposal-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}.proposal-item{padding:7px 8px;border:1px solid #dde1e6;border-radius:8px;background:#fff}.proposal-item b{display:block;margin-bottom:2px;font-size:.68rem}.proposal-item p{margin:0;font-size:.62rem;line-height:1.4}.reject-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;margin-top:5px}.reject-grid span{padding:5px 6px;border:1px solid #e2e6ea;border-radius:7px;font-size:.6rem;line-height:1.35}.deliverable-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px}.deliverable-grid div{padding:7px;border:1px solid #dde1e6;border-radius:8px}.deliverable-grid strong{display:block;margin-bottom:2px;font-size:.68rem}.deliverable-grid p{margin:0;font-size:.61rem;line-height:1.36}.mini-head{margin:8px 0 4px;font-size:.72rem;font-weight:900}.section-sub{margin:6px 0 5px;font-size:.7rem;font-weight:900}.article-seq{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px}.article-card{position:relative;padding:8px 8px 8px 34px;border:1px solid #dde1e6;border-radius:8px}.article-card .num{position:absolute;left:9px;top:9px;font-size:.58rem;font-weight:900;color:#667085}.article-card h3{margin:0 0 2px;font-size:.7rem}.article-card p{margin:0;font-size:.63rem;line-height:1.4}.article-card small{display:block;margin-top:3px;font-size:.58rem;line-height:1.35;color:#59636f}
  @media(max-width:900px){.ops-flow{grid-template-columns:repeat(2,minmax(0,1fr))}.ops-kv,.deliverable-grid,.reject-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.proposal-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
  @media(max-width:620px){.ops-flow{grid-template-columns:repeat(2,minmax(0,1fr))}.ops-grid,.ops-question-grid,.article-seq{grid-template-columns:1fr}.ops-kv,.deliverable-grid,.reject-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.proposal-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.ops-table{grid-template-columns:.7fr 1.2fr 1.3fr 1fr}.ops-table>div{padding:4px;font-size:.56rem}}
  `;
  document.head.append(css);

  sections.content.innerHTML=`
    <div class="section-head"><p class="eyebrow">07 · CONTENT BUSINESS MANUAL</p><h2>콘텐츠·사업 기획 실무</h2><p>지역 핵심 프로젝트를 발견한 뒤 기사·사진·영상·교육·행사·AI·AX 중 무엇으로 연결할지 결정하고, 담당부서와 예산·일정·납품물을 확인해 실제 사업으로 만드는 순서입니다.</p></div>
    <div class="ops-flow">
      <div class="ops-step"><b><span class="n">01</span>프로젝트 선택</b><p>지역 핵심 프로젝트 DB에서 A·B 사업을 열고 사업기간, 관련지역, 관련인물, 2027 예산상태를 확인한다.</p></div>
      <div class="ops-step"><b><span class="n">02</span>공식자료 확보</b><p>주요업무계획, 예산서, 보도자료, 공고·입찰, 의회자료를 모아 사업명·기간·금액·담당부서를 확정한다.</p></div>
      <div class="ops-step"><b><span class="n">03</span>홍보목적 정의</b><p>정책 이해, 주민참여, 관광·투자유치, 성과확산, 이용안내 중 이번 콘텐츠가 해결할 한 가지 목적을 정한다.</p></div>
      <div class="ops-step"><b><span class="n">04</span>대상 독자 정의</b><p>주민, 기업, 관광객, 공무원, 타 지자체, 중앙정부 중 실제로 정보를 받아야 하는 대상을 정한다.</p></div>
      <div class="ops-step"><b><span class="n">05</span>콘텐츠 조합</b><p>기사만 필요한지, 단체장·부서장 발언, 현장사진, 영상, 교육·행사까지 필요한지 결과물 조합을 만든다.</p></div>
      <div class="ops-step"><b><span class="n">06</span>사업화 가능성 확인</b><p>담당부서가 예산을 보유하는지, 차년도 예산인지, 계약·과업으로 발주 가능한 성격인지 확인한다.</p></div>
      <div class="ops-step"><b><span class="n">07</span>제안·협의</b><p>한 페이지 요약 → 담당자 설명 → 범위·수량·일정 조정 → 정식 제안서 순으로 진행한다.</p></div>
      <div class="ops-step"><b><span class="n">08</span>제작·성과·후속</b><p>취재·제작·납품 후 게재·조회·참여·기관활용을 기록하고 다음 분기·다음연도 사업을 DB에 연결한다.</p></div>
    </div>
    <p class="mini-head">콘텐츠 패키지 기준</p>
    <div class="deliverable-grid">
      <div><strong>기본 기사형</strong><p>기획기사 1건 + 현장사진 5~8장. 기자 1명, 현장 1회. 정책·사업 설명이 중심일 때 사용.</p></div>
      <div><strong>취재 확장형</strong><p>기획기사 + 단체장·부서장 발언 + 현장사진 10~20장. 인물과 사업을 함께 보여줘야 할 때 사용.</p></div>
      <div><strong>영상 결합형</strong><p>기사 + 사진 + 본영상 2~4분 + 숏폼 1~3개. 현장 변화·시설·행사·이용방법을 보여줄 때 사용.</p></div>
      <div><strong>연간 사업형</strong><p>착수 → 중간 → 현장 → 성과 → 다음연도 4~6회. 장기 SOC·산업·도시·AI 사업에 적합.</p></div>
    </div>
    <div class="ops-grid" style="margin-top:5px">
      <div class="ops-card"><h3>한 사업에서 확장할 항목</h3><div class="ops-kv"><span><b>기사</b>정책·현장·성과</span><span><b>인물</b>단체장·부서장</span><span><b>사진·영상</b>현장 기록</span><span><b>보도자료</b>기관 배포</span><span><b>교육</b>공무원·주민</span><span><b>행사</b>포럼·설명회</span><span><b>웹</b>사업 안내</span><span><b>AI·AX</b>업무·서비스 개선</span></div></div>
      <div class="ops-card"><h3>실무자가 반드시 남길 기록</h3><div class="ops-kv"><span><b>공식 사업명</b>임의 축약 금지</span><span><b>담당부서</b>실·국·과·팀</span><span><b>예산상태</b>본예산·추경·차년도</span><span><b>사업기간</b>착수~종료</span><span><b>결과물</b>수량·규격</span><span><b>접촉기록</b>일자·내용</span><span><b>다음 일정</b>예산·공고·성과</span><span><b>근거 URL</b>공식자료</span></div></div>
    </div>
    <p class="ops-note">편집 목적의 일반 취재와 유료 홍보·제작·교육·용역은 업무 성격을 구분합니다. 유료사업은 “기사 게재 대가”가 아니라 해당 기관이 필요로 하는 명확한 제작·홍보·교육·행사·서비스 과업과 납품물을 기준으로 제안합니다.</p>`;

  sections.editorial.innerHTML=`
    <div class="section-head"><p class="eyebrow">08 · EDITORIAL MANUAL</p><h2>기획기사 제작 매뉴얼</h2><p>기획기사는 기관 홍보문을 옮기는 글이 아니라 “왜 시작됐고, 돈이 어디에 쓰이며, 지금 어디까지 왔고, 지역에 무엇이 달라지는가”를 독자가 한 번에 이해하게 만드는 기사입니다.</p></div>
    <p class="section-sub">취재 전 필수자료</p>
    <div class="ops-table"><div class="th">자료</div><div class="th">확인할 것</div><div class="th">기사에 쓰는 정보</div><div class="th">확보처</div><div>주요업무계획</div><div>정책목표·연도계획</div><div>왜 하는가, 올해 어디까지 하는가</div><div>지자체·실국</div><div>예산서·추경</div><div>총사업비·당해연도·재원</div><div>금액, 국비·지방비, 집행시기</div><div>예산부서·의회</div><div>공약·정책자료</div><div>정치적 출발점·약속</div><div>단체장 정책방향과 사업 연결</div><div>공약집·정책자료</div><div>공고·계약</div><div>수행기관·과업·기간</div><div>누가 실제 실행하는가</div><div>입찰·계약공개</div><div>보도·회의자료</div><div>쟁점·변경·지연·반대</div><div>현재 상태와 다른 시각</div><div>보도자료·의회</div></div>
    <p class="section-sub">기사 기본순서</p>
    <div class="article-seq">
      <div class="article-card"><span class="num">01</span><h3>제목·리드</h3><p>사업의 핵심 변화와 현재 시점을 한 문장으로 쓴다.</p><small>필수: 지역명 + 사업명 + 지금 발생한 변화.</small></div>
      <div class="article-card"><span class="num">02</span><h3>정책 배경</h3><p>공약·국가정책·지역현안 중 사업을 만든 직접 원인을 설명한다.</p><small>“왜 지금 시작됐는가”를 2~3문단 안에 정리.</small></div>
      <div class="article-card"><span class="num">03</span><h3>지역문제</h3><p>사업 전의 불편·부족·위험·산업문제를 수치와 사례로 보여준다.</p><small>인구, 이용자, 시간, 비용, 사고, 공급부족 등 기준값 확보.</small></div>
      <div class="article-card"><span class="num">04</span><h3>사업 구조</h3><p>대상·장소·기간·추진기관·수행기관·시설·서비스 내용을 구체화한다.</p><small>사업명을 설명하는 데 그치지 말고 실제 무엇을 만드는지 적는다.</small></div>
      <div class="article-card"><span class="num">05</span><h3>예산·집행</h3><p>총사업비와 올해 예산, 국비·지방비·민자 등을 분리한다.</p><small>예산 “확정”과 “요구·협의 중”을 반드시 구분.</small></div>
      <div class="article-card"><span class="num">06</span><h3>현재 진행상황</h3><p>계획·설계·공모·계약·착공·운영·완료 중 현재 위치를 표시한다.</p><small>다음 공식 일정도 함께 기록.</small></div>
      <div class="article-card"><span class="num">07</span><h3>인물·현장</h3><p>단체장·부서장 설명과 실제 이용자·주민·기업의 현장 반응을 배치한다.</p><small>발언은 정책방향, 현장은 실제 효과 검증에 사용.</small></div>
      <div class="article-card"><span class="num">08</span><h3>성과·쟁점·다음 단계</h3><p>성과지표와 동시에 지연·비용·갈등·운영상 문제를 확인하고 향후 일정을 적는다.</p><small>성과만 나열하지 않고 다음 취재시점을 남긴다.</small></div>
    </div>
    <p class="section-sub">사진·영상 확보 기준</p>
    <div class="ops-kv"><span><b>인물사진</b>정면·대화·업무 3~5장</span><span><b>현장전경</b>장소 이해 3~5장</span><span><b>세부장면</b>시설·표지·이용 5~10장</span><span><b>캡션</b>장소·인물·행위 명시</span><span><b>영상 인터뷰</b>원본 15~30분</span><span><b>B-roll</b>전경·이동·작업 15~30컷</span><span><b>본영상</b>2~4분</span><span><b>숏폼</b>핵심 메시지 1~3개</span></div>
    <p class="ops-note">연속기획은 같은 설명을 반복하지 않습니다. 1회 배경·계획 → 2회 인물·의사결정 → 3회 현장·집행 → 4회 주민·기업 효과 → 5회 성과·문제 → 6회 다음연도 계획으로 역할을 나눕니다.</p>`;

  sections.questions.innerHTML=`
    <div class="section-head"><p class="eyebrow">09 · QUESTION MANUAL</p><h2>인물·사업 질문 매뉴얼</h2><p>질문은 직위에 따라 달라집니다. 단체장에게는 방향과 우선순위, 부서장에게는 실행·예산, 실무 담당에게는 일정·수치·과업, 현장에는 실제 효과를 묻습니다.</p></div>
    <div class="ops-question-grid">
      <div class="ops-question"><strong>단체장·교육감·기관장</strong><ol><li>이번 임기에서 이 사업을 우선순위로 둔 가장 큰 이유는 무엇입니까?</li><li>지역의 어떤 문제를 언제까지 어떤 수준으로 바꾸려는 것입니까?</li><li>예산과 조직을 어디에 집중하고 있습니까?</li><li>중앙정부·의회·인접 지자체와 협의가 필요한 부분은 무엇입니까?</li><li>주민이 체감할 첫 번째 변화는 언제 나타납니까?</li><li>2027년과 임기 후반까지 이어질 다음 단계는 무엇입니까?</li></ol></div>
      <div class="ops-question"><strong>실·국장·과장·사업부서장</strong><ol><li>현재 사업은 계획·공모·계약·착공·운영 중 어느 단계입니까?</li><li>총사업비와 2026·2027년 예산은 각각 얼마이며 재원은 어떻게 구성됩니까?</li><li>올해 반드시 완료해야 할 과업과 다음 일정은 무엇입니까?</li><li>성과를 판단하는 지표는 무엇이며 현재 수치는 어느 정도입니까?</li><li>실행 과정에서 가장 큰 행정·기술·주민수용성 문제는 무엇입니까?</li><li>외부 홍보·영상·교육·행사·시스템 지원이 필요한 지점은 어디입니까?</li></ol></div>
      <div class="ops-question"><strong>팀장·담당자·수행기관</strong><ol><li>공식 사업명, 기간, 담당기관과 실제 수행기관은 어떻게 됩니까?</li><li>현재까지 완료한 과업과 남은 과업을 날짜로 설명해 주실 수 있습니까?</li><li>취재 가능한 현장·시설·참여자·기업은 누구입니까?</li><li>기사와 영상에 반드시 반영해야 할 정확한 수치·용어는 무엇입니까?</li><li>다음 공고·행사·준공·성과발표 일정은 언제입니까?</li><li>공개 가능한 사업계획서·예산·사진·도표·성과자료는 무엇입니까?</li></ol></div>
      <div class="ops-question"><strong>주민·기업·이용자·참여자</strong><ol><li>사업 전에는 어떤 불편이나 문제가 있었습니까?</li><li>실제로 이용하거나 참여한 뒤 무엇이 가장 크게 달라졌습니까?</li><li>시간·비용·매출·접근성·안전 측면에서 체감 변화가 있습니까?</li><li>아직 해결되지 않은 문제는 무엇입니까?</li><li>행정기관에 추가로 요구하고 싶은 것은 무엇입니까?</li><li>이 사업이 계속된다면 어떤 부분이 우선 개선돼야 합니까?</li></ol></div>
    </div>
    <p class="section-sub">질문 전·후 체크</p>
    <div class="ops-kv"><span><b>전</b>공식 직함 확인</span><span><b>전</b>사업명·예산 확인</span><span><b>전</b>질문 6~10개 압축</span><span><b>전</b>수치 확인자료 지참</span><span><b>후</b>인명·직책 재확인</span><span><b>후</b>숫자·날짜 검증</span><span><b>후</b>추가자료 요청</span><span><b>후</b>다음 취재일 등록</span></div>`;

  sections.proposal.innerHTML=`
    <div class="section-head"><p class="eyebrow">10 · PROPOSAL MANUAL</p><h2>제안서 작성 실무</h2><p>제안서를 받는 부서가 가장 먼저 보는 것은 “우리 부서 사업목표에 왜 필요한가, 정확히 무엇을 받는가, 언제 끝나는가, 얼마인가, 행정 부담은 얼마나 되는가”입니다. 회사 소개보다 이 다섯 가지를 먼저 보여줍니다.</p></div>
    <div class="proposal-grid">
      <div class="proposal-item"><b>01 사업명</b><p>기관명과 목적이 보이게 작성. “○○시 관광활성화 콘텐츠 제작”처럼 사업대상을 바로 알 수 있게 한다.</p></div>
      <div class="proposal-item"><b>02 추진배경</b><p>공약·업무계획·예산·현안 중 2~3개 사실만 제시한다. 일반적인 시장동향 설명은 줄인다.</p></div>
      <div class="proposal-item"><b>03 부서의 필요</b><p>인지도 부족, 주민참여, 기업유치, 이용안내, 성과확산 등 담당부서가 해결해야 할 문제를 명시한다.</p></div>
      <div class="proposal-item"><b>04 사업목적·대상</b><p>누구에게 무엇을 알리고 어떤 행동 또는 이해를 만들 것인지 한 문장으로 정한다.</p></div>
      <div class="proposal-item"><b>05 실행내용</b><p>취재, 기사, 사진, 영상, 교육, 행사, 웹, AI 지원 중 실제 수행할 항목만 적고 각각 횟수를 표시한다.</p></div>
      <div class="proposal-item"><b>06 납품물 규격</b><p>기사 건수, 글자수, 사진 장수, 영상 편수·길이, 교육시간, 보고서 페이지 등 검수 가능한 수량으로 쓴다.</p></div>
      <div class="proposal-item"><b>07 일정</b><p>착수 → 자료수령 → 취재 → 초안 → 검토 → 수정 → 게재·납품 → 결과보고 날짜를 표로 제시한다.</p></div>
      <div class="proposal-item"><b>08 기관 협조사항</b><p>담당자 1명, 자료제공, 촬영협조, 사실확인 등 기관이 해야 할 일을 최소화해 명확히 적는다.</p></div>
      <div class="proposal-item"><b>09 사업비</b><p>총액만 쓰지 말고 취재·촬영·편집·디자인·행사·교육 등 과업별 산출근거를 나눈다.</p></div>
      <div class="proposal-item"><b>10 성과지표</b><p>게재 건수, 영상 조회, 행사 참여, 자료 활용, 기업·관광 문의 등 사업목적과 연결되는 지표만 선택한다.</p></div>
      <div class="proposal-item"><b>11 검수·결과보고</b><p>무엇을 제출하면 완료인지 정한다. 원고, 원본사진, 영상파일, 참석명단, 결과보고서, 링크 목록 등을 명시한다.</p></div>
      <div class="proposal-item"><b>12 후속사업</b><p>처음부터 강매하지 않고 성과 확인 후 분기·반기·다음연도 확장 가능한 선택항목으로 제시한다.</p></div>
    </div>
    <p class="section-sub">부서 유형별 제안 초점</p>
    <div class="ops-table"><div class="th">부서</div><div class="th">관심사</div><div class="th">적합한 결과물</div><div class="th">제안서에서 강조</div><div>홍보·소통</div><div>인지도·정확한 메시지·확산</div><div>기사·사진·영상·보도자료</div><div>매체·배포·검수·일정</div><div>사업부서</div><div>사업설명·주민이해·성과</div><div>기획기사·현장취재·성과콘텐츠</div><div>사업목표·예산·성과지표</div><div>경제·산업</div><div>기업유치·투자·산업생태계</div><div>기업사례·영상·포럼·백서</div><div>기업 참여와 후속사업</div><div>문화·관광</div><div>방문·행사·지역브랜드</div><div>사진·영상·여행형 콘텐츠</div><div>시즌·동선·현장 활용</div><div>교육·인재</div><div>참여자·교육효과·확산</div><div>교육·교안·영상·성과기사</div><div>교육시간·대상·산출물</div><div>AI·AX</div><div>업무개선·서비스·도입성과</div><div>진단·교육·실증·시스템</div><div>현재업무→개선업무→성과</div></div>
    <p class="section-sub">첫 페이지에 반드시 보여줄 8개 항목</p>
    <div class="ops-kv"><span><b>1</b>사업명</span><span><b>2</b>왜 지금 필요한가</span><span><b>3</b>담당부서 목표</span><span><b>4</b>대상</span><span><b>5</b>핵심 결과물</span><span><b>6</b>기간</span><span><b>7</b>사업비</span><span><b>8</b>기대성과</span></div>
    <p class="section-sub">반려되기 쉬운 제안</p>
    <div class="reject-grid"><span>기관의 실제 사업과 연결되지 않은 일반 제안</span><span>“홍보해 드립니다”만 있고 납품물이 없는 제안</span><span>예산·집행시기를 확인하지 않은 제안</span><span>기관 협조가 과도하게 필요한 제안</span><span>기사·영상 수량과 규격이 불명확한 제안</span><span>회사 경력 소개가 사업 필요보다 앞서는 제안</span><span>성과지표 없이 노출효과만 강조한 제안</span><span>편집취재와 유료 과업의 성격이 불분명한 제안</span></div>
    <p class="ops-note">제안서는 담당자가 내부 보고에 그대로 사용할 수 있어야 합니다. 따라서 담당자가 다시 설명문을 만들지 않아도 되도록 사업목적, 필요성, 예산근거, 일정, 납품물, 성과를 짧고 명확하게 구조화합니다.</p>`;
})();
