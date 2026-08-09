(function(){
  const data=window.LEGAL_KNOWLEDGE||[];
  const patch=(id,v)=>{const item=data.find(x=>x.id===id);if(item)Object.assign(item,v);};
  const checked='2026.08.09';

  patch('civil-apparent-agency',{
    caseCourt:'대법원',caseDate:'2025.06.05',caseNo:'2023다232526',caseName:'대여금',caseResult:'상고기각',caseChecked:checked,
    caseScope:'대리행위 표시 없이 타인의 성명을 모용하여 본인인 것처럼 직접 법률행위를 한 경우에도, 모용자에게 기본대리권이 있고 상대방이 그를 본인이라고 믿은 데 정당한 사유가 있는 경우에 한하여 민법 제126조 표현대리 법리를 유추적용할 수 있다는 점과, 전문 금융회사의 정당한 사유 판단기준을 다룬다.',
    caseLimit:'명의모용 일반에 표현대리가 당연히 적용된다는 판결이 아니다. 기본대리권과 상대방의 정당한 사유가 모두 필요하고, 이 사건에서는 금융회사의 전문성·확인수단·관리구조 때문에 정당한 사유가 부정되었다.',
    caseOfficialUrl:'https://portal.scourt.go.kr/pgp/main.on?c=900&jisCntntsSrno=2025000016396&pgDvs=1&rnum=37&srchwd=%2A&w2xPath=PGP1011M04',caseOriginalChecked:true
  });

  patch('civil-superficies',{
    caseCourt:'대법원',caseDate:'2013.04.11',caseNo:'2009다62059',caseName:'건물명도 등',caseResult:'상고기각',caseChecked:checked,
    caseScope:'강제경매의 압류·선행 가압류보다 먼저 저당권이 설정되었다가 경매로 소멸하는 사안에서 관습상 법정지상권의 동일인 소유 판단시점을 저당권 설정 당시로 본 법리와, 당시 건축 중인 건물이 어느 정도 존재해야 하는지를 다룬다.',
    caseLimit:'모든 강제경매에서 저당권 설정시가 기준이라는 판결이 아니다. 압류·가압류보다 선행하는 저당권이 존재하고 그 저당권이 경매로 소멸하는 특수한 구조에서 담보가치의 예측가능성을 이유로 한 기준이다. 미완성 건물도 단순 착공만으로 충분하다고 한 것이 아니다.',
    caseOfficialUrl:'https://www.scourt.go.kr/supreme/news/NewsViewAction2.work?gubun=4&searchOption=&searchWord=&seqnum=4132',caseOriginalChecked:true
  });

  patch('commercial-director-duty',{
    caseCourt:'대법원',caseDate:'2023.03.30',caseNo:'2019다280481',caseName:'손해배상(기)',caseResult:'상고기각',caseChecked:checked,
    caseScope:'기업집단 소속 회사가 계열회사 지배권 방어를 위한 파생상품계약을 체결한 사안에서, 경영판단 존중의 전제가 되는 정보수집·조사·검토와 회사의 구체적 이익, 이해상충 및 다른 이사에 대한 감시의무의 내용을 판시하였다.',
    caseLimit:'계열회사 지원이나 경영권 방어를 일반적으로 위법하다고 한 판결이 아니다. 개별 회사가 얻는 구체적·객관적 이익과 손실위험, 의사결정 당시 조사·검토 수준을 계약별로 판단했으며 일부 계약에는 책임을 부정하였다. 또한 판결 당시 충실의무 조문과 2025년 개정 후 현행 상법 제382조의3을 구별해야 한다.',
    caseOfficialUrl:'https://www.scourt.go.kr/supreme/news/NewsViewAction2.work?gubun=4&searchOption=&searchWord=&seqnum=9129',caseOriginalChecked:true
  });

  patch('criminal-dolus-eventualis',{
    caseCourt:'대법원',caseDate:'2024.09.12',caseNo:'2024도4824',caseName:'공직선거법위반',caseResult:'일부 파기환송',caseChecked:checked,
    caseScope:'허위사실공표죄에서 미필적 고의도 가능하지만 구성요건적 사실의 허위 가능성에 대한 실제 인식이 선행되어야 하고, 단순한 확인의무 위반이나 부주의만으로 그 인식을 의제할 수 없다는 점을 판시하였다.',
    caseLimit:'모든 고의범의 미필적 고의 판단을 이 사건의 선거법상 사실관계와 동일하게 적용한다는 의미는 아니다. 일반 고의론의 인식요소와 용인요소를 확인하는 자료로 사용하되 개별 범죄의 구성요건과 보호법익을 별도로 검토해야 한다.',
    caseOfficialUrl:'https://www.scourt.go.kr/supreme/news/NewsViewAction2.work?gubun=4&seqnum=10054',caseOriginalChecked:true
  });

  patch('ip-selected-invention',{
    caseCourt:'특허법원',caseDate:'2006.11.01',caseNo:'2005허10107',caseName:'거절결정(특)',caseResult:'청구기각',caseChecked:checked,
    caseScope:'선행발명에 상위개념이 기재된 상황에서 특정 하위개념을 선택한 이른바 선택발명의 신규성·진보성을 판단하면서, 구체적 개시 여부와 질적으로 다른 효과 또는 양적으로 현저한 효과를 중심으로 판단한 사례다.',
    caseLimit:'대법원 판결이 아니라 특허법원 판결이며, 2006년 당시 전통적 선택발명 판단공식을 보여주는 사례다. 현대의 모든 선택발명에 현저한 효과를 독립된 절대요건으로 기계적으로 적용할 근거로 사용해서는 안 되고, 대법원 후속 법리와 특허법 제29조의 일반 신규성·진보성 구조를 함께 봐야 한다.',
    caseOfficialUrl:'https://www.scourt.go.kr/portal/dcboard/DcNewsViewAction.work?cbub_code=000700&gubun=44&seqnum=1245',caseOriginalChecked:true
  });

  patch('ip-inventive-step',{
    caseCourt:'대법원',caseDate:'2019.07.25',caseNo:'2018후12004',caseName:'등록정정(실)',caseResult:'파기환송',caseChecked:checked,
    caseScope:'실용신안의 진보성 판단에서 청구고안의 내용을 알고 난 뒤 선행기술을 재구성하는 사후적 고찰을 배제해야 한다는 원칙과, 심결취소소송에서 새로 제출된 자료가 단순 주지관용기술 증거가 아니라 실질적으로 새로운 공지기술인 경우 판단근거로 삼을 수 없다는 범위를 판시하였다.',
    caseLimit:'직접 대상은 특허가 아니라 실용신안의 정정심판 사건이다. 사후적 고찰 금지라는 진보성 판단원리는 특허에도 중요한 참고법리가 되지만, 사건의 절차적 판시는 실용신안 정정심판 및 심결취소소송의 구체적 맥락을 벗어나 과잉 일반화하지 않는다.',
    caseOfficialUrl:'https://www.scourt.go.kr/supreme/news/NewsViewAction2.work?gubun=4&searchOption=&searchWord=&seqnum=6747',caseOriginalChecked:true
  });

  patch('ip-trademark-similarity',{
    caseCourt:'대법원',caseDate:'2020.04.29',caseNo:'2019후11121',caseName:'등록무효(상)',caseResult:'상고기각',caseChecked:checked,
    caseScope:'상표 유사 여부를 외관·호칭·관념을 일반 수요자나 거래자의 입장에서 전체적·객관적·이격적으로 관찰하여 출처 오인·혼동 우려로 판단하고, 어느 한 요소가 유사하더라도 전체적으로 명확히 구별될 수 있으면 비유사할 수 있다는 법리를 판시하였다.',
    caseLimit:'관념이 같으면 언제나 유사하거나, 외관·호칭이 다르면 언제나 비유사하다는 판결이 아니다. 지정상품의 거래실정과 각 요소의 중요도를 포함하여 전체적인 출처혼동 가능성을 판단해야 하며, 기준 수요자는 보통의 주의력을 가진 우리나라 일반 수요자·거래자다.',
    caseOfficialUrl:'https://www.scourt.go.kr/supreme/news/NewsViewAction2.work?gubun=4&searchOption=&searchWord=&seqnum=7080',caseOriginalChecked:true
  });

  patch('ip-design-similarity',{
    caseCourt:'대법원',caseDate:'2020.09.03',caseNo:'2016후1710',caseName:'등록무효(디)',caseResult:'상고기각',caseChecked:checked,
    caseScope:'디자인 유사 여부는 각 요소를 분리하지 않고 전체 외관에 따른 심미감으로 판단하며, 기능 확보에 불가결한 형상은 중요도를 낮출 수 있지만 대체 가능한 형상이 존재한다면 단순히 기능 관련 형상이라는 이유만으로 중요도를 낮춰서는 안 된다는 법리를 판시하였다.',
    caseLimit:'기능과 관련된 형상은 모두 디자인 유사 판단에서 제외된다는 판결이 아니다. 기능상 불가결한지, 선택 가능한 대체형상이 있는지, 사용 시뿐 아니라 거래 시 외관에서 어떤 심미감을 주는지를 구체적으로 판단해야 한다.',
    caseOfficialUrl:'https://www.scourt.go.kr/supreme/news/NewsViewAction2.work?gubun=4&searchOption=&searchWord=&seqnum=7291',caseOriginalChecked:true
  });
})();
