(function(){
  const data=window.LEGAL_KNOWLEDGE||[];
  const patch=(id,sources,note)=>{
    const item=data.find(x=>x.id===id); if(!item)return;
    item.statuteSources=sources;
    item.articleManualReviewChecked='2026.08.09';
    item.articleManualReviewNote=note;
  };
  const law=(label,url)=>({label,url});

  patch('civil-rescission-restitution',[
    law('민법 제548조 해제의 효과·원상회복 · 국가법령정보센터','https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0548&lsiSeq=284415&urlMode=lsScJoRltInfoR'),
    law('민법 제549조 원상회복의무와 동시이행 · 국가법령정보센터','https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0549&lsiSeq=284415&urlMode=lsScJoRltInfoR')
  ],'계약해제 후 원상회복과 상환관계를 제548조·제549조로 분리 대조.');

  patch('special-registration-public-faith',[
    law('민법 제186조 부동산물권변동의 효력 · 국가법령정보센터','https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0186&lsiSeq=284415&urlMode=lsScJoRltInfoR'),
    law('부동산등기법 제3조 등기할 수 있는 권리 등 · 국가법령정보센터','https://law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1026156859')
  ],'등기의 효력은 민법 제186조, 등기대상 권리체계는 부동산등기법 제3조로 대조. 공신력 부정은 단일 조문이 아니라 등기법체계·판례법리임을 별도 유지.');

  patch('civil-creditor-revocation',[
    law('민법 제406조 채권자취소권 · 국가법령정보센터','https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=900140979'),
    law('민법 제407조 채권자취소의 효력 · 국가법령정보센터','https://www.law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1032053257')
  ],'성립·제척기간은 제406조, 취소·원상회복의 채권자 공동이익 효과는 제407조로 분리 대조.');

  patch('public-equality',[
    law('대한민국헌법 제11조 평등 · 국가법령정보센터','https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0011&lsiSeq=61603&urlMode=lsScJoRltInfoR')
  ],'평등원칙의 직접 헌법근거 제11조 대조. 심사강도·비교집단은 헌재법리 영역임.');

  patch('public-rule-of-law',[
    law('행정기본법 제8조 법치행정의 원칙 · 국가법령정보센터','https://www.law.go.kr/LSW/LsiJoLinkP.do?docType=JO&joNo=000800000&languageType=KO&lsNm=%ED%96%89%EC%A0%95%EA%B8%B0%EB%B3%B8%EB%B2%95&paras=1'),
    law('대한민국헌법 제37조 제2항 기본권 제한의 법률유보 · 국가법령정보센터','https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0037&lsiSeq=61603&urlMode=lsScJoRltInfoR')
  ],'행정작용 법률근거는 행정기본법 제8조, 기본권 제한의 헌법상 법률유보·한계는 헌법 제37조 제2항으로 대조.');

  patch('public-admin-litigation',[
    law('행정소송법 제2조 처분등의 정의 · 국가법령정보센터','https://www.law.go.kr/LSW/LsiJoLinkP.do?docType=JO&joNo=000200000&languageType=KO&lsNm=%ED%96%89%EC%A0%95%EC%86%8C%EC%86%A1%EB%B2%95&paras=1'),
    law('행정소송법 제12조 원고적격 · 국가법령정보센터','https://www.law.go.kr/LSW/LsiJoLinkP.do?docType=JO&joNo=001200000&languageType=KO&lsNm=%ED%96%89%EC%A0%95%EC%86%8C%EC%86%A1%EB%B2%95&paras=1')
  ],'처분성은 제2조, 취소를 구할 법률상 이익과 원고적격은 제12조로 분리 대조.');

  patch('criminal-co-principal',[
    law('형법 제30조 공동정범·제31조 교사범·제32조 종범 · 국가법령정보센터','https://law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1016592355')
  ],'공동정범과 교사·방조 경계를 제30조~제32조 현행조문으로 대조. 기능적 행위지배는 학설·판례상의 해석도구임.');

  patch('criminal-fraud',[
    law('형법 제347조 사기 · 국가법령정보센터','https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1032072203')
  ],'기망에 의한 재물교부·재산상이익 취득의 직접 구성요건인 제347조 현행조문 대조. 착오·처분행위·인과관계는 판례에 의해 구체화됨.');

  patch('ai-constitutional-framework',[
    law('대한민국헌법 제10조 인간의 존엄과 가치·행복추구권 · 국가법령정보센터','https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0010&lsiSeq=61603&urlMode=lsScJoRltInfoR'),
    law('대한민국헌법 제11조 평등 · 국가법령정보센터','https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0011&lsiSeq=61603&urlMode=lsScJoRltInfoR'),
    law('대한민국헌법 제17조 사생활의 비밀과 자유 · 국가법령정보센터','https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0017&lsiSeq=61603&urlMode=lsScJoRltInfoR'),
    law('대한민국헌법 제21조 표현의 자유 · 국가법령정보센터','https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0021&lsiSeq=61603&urlMode=lsScJoRltInfoR'),
    law('대한민국헌법 제37조 제2항 기본권 제한의 한계 · 국가법령정보센터','https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0037&lsiSeq=61603&urlMode=lsScJoRltInfoR')
  ],'AI 기본권 통제의 대표 직접근거를 인간존엄·평등·사생활·표현·기본권 제한조항으로 특정. 다른 기본권은 사안별 추가검토.');

  patch('ai-basic-high-impact',[
    law('인공지능기본법 제2조 고영향 인공지능 정의 · 국가법령정보센터','https://www.law.go.kr/LSW/lsLinkCommonInfo.do?lsJoLnkSeq=1031810747'),
    law('인공지능기본법 제33조 고영향 인공지능의 확인 · 국가법령정보센터','https://www.law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1031810895'),
    law('인공지능기본법 제34조 고영향 AI 사업자의 책무 · 국가법령정보센터','https://law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1031810845')
  ],'고영향성 정의·사전확인·분류 후 책무를 제2조·제33조·제34조로 구분 대조.');

  patch('ai-intelligent-information-framework',[
    law('지능정보화 기본법 제3조 지능정보사회 기본원칙 · 국가법령정보센터','https://www.law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1031511013'),
    law('지능정보화 기본법 제6조 지능정보사회 종합계획의 수립 · 국가법령정보센터','https://law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1013152333')
  ],'국가 디지털 거버넌스의 원칙과 종합계획 근거를 제3조·제6조로 직접 대조.');

  patch('ai-public-sector-impact-assessment',[
    law('인공지능 및 데이터 기반 행정 활성화에 관한 법률 제32조 공공분야 인공지능 영향평가 등 — 2027.02.28 시행 예정 · 국가법령정보센터','https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=283735&viewCls=lsRvsDocInfoR')
  ],'제32조의 사전 기본권 영향평가·결과 공표·위험관리방안 및 시행일 2027.02.28을 개정문으로 직접 대조.');

  patch('ai-location-mobility-data',[
    law('위치정보법 제18조 개인위치정보의 수집 · 국가법령정보센터','https://www.law.go.kr/lsLinkProc.do?chrClsCd=010202&joLnkStr=%EC%A0%9C18%EC%A1%B0+%EB%82%B4%EC%A7%80+%EC%A0%9C22%EC%A1%B0&joNo=001800000%5E001900000%5E002000000%5E002100000%5E002200000&lsId=009882&lsNm=%EC%9C%84%EC%B9%98%EC%A0%95%EB%B3%B4%EC%9D%98+%EB%B3%B4%ED%98%B8+%EB%B0%8F+%EC%9D%B4%EC%9A%A9+%EB%93%B1%EC%97%90+%EA%B4%80%ED%95%9C+%EB%B2%95%EB%A5%A0&mode=2'),
    law('위치정보법 제19조 개인위치정보의 이용 또는 제공 · 국가법령정보센터','https://www.law.go.kr/LSW/LsiJoLinkP.do?docType=JO&joNo=001900000&languageType=KO&lsNm=%EC%9C%84%EC%B9%98%EC%A0%95%EB%B3%B4%EC%9D%98%20%EB%B3%B4%ED%98%B8%20%EB%B0%8F%20%EC%9D%B4%EC%9A%A9%20%EB%93%B1%EC%97%90%20%EA%B4%80%ED%95%9C%20%EB%B2%95%EB%A5%A0&paras=1')
  ],'개인위치정보의 수집과 이용·제공을 제18조·제19조로 분리 대조.');

  patch('ai-product-liability',[
    law('제조물 책임법 제2조 정의 · 국가법령정보센터','https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0002&lsiSeq=193381&urlMode=lsScJoRltInfoR'),
    law('제조물 책임법 제3조 제조물 책임 · 국가법령정보센터','https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1000287243')
  ],'현행 제조물 개념과 결함 손해배상책임을 제2조·제3조로 분리 대조. 독립형 소프트웨어의 포섭 여부는 현행 문언의 해석·입법론으로 구분.');

  patch('ai-competition-platform',[
    law('공정거래법 제5조 시장지배적지위의 남용금지 · 국가법령정보센터','https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1032542611'),
    law('공정거래법 제40조 부당한 공동행위의 금지 · 국가법령정보센터','https://law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1032911241')
  ],'플랫폼 지배력은 제5조, 알고리즘 가격의 합의·정보교환 문제는 제40조로 분리 대조. 병행행위만으로 합의가 자동 인정되는 것은 아님.');

  patch('ai-auto-liability-autonomous',[
    law('자동차손해배상 보장법 제3조 자동차손해배상책임 · 국가법령정보센터','https://www.law.go.kr/LSW/LsiJoLinkP.do?docType=JO&joNo=000300000&languageType=KO&lsNm=%EC%9E%90%EB%8F%99%EC%B0%A8%EC%86%90%ED%95%B4%EB%B0%B0%EC%83%81%20%EB%B3%B4%EC%9E%A5%EB%B2%95&paras=1'),
    law('자동차손해배상 보장법 제29조의2 자율주행자동차사고 보험금등의 지급 등 · 국가법령정보센터','https://www.law.go.kr/LSW/LsiJoLinkP.do?docType=JO&joNo=002902000&languageType=KO&lsNm=%EC%9E%90%EB%8F%99%EC%B0%A8%EC%86%90%ED%95%B4%EB%B0%B0%EC%83%81%20%EB%B3%B4%EC%9E%A5%EB%B2%95&paras=1')
  ],'피해자에 대한 운행자책임은 제3조, 자율주행차 결함사고에서 보험자의 법률상 책임자에 대한 구상은 제29조의2로 분리 대조.');

  patch('ai-auto-management-safety',[
    law('자동차관리법 제2조 제1호의3 자율주행자동차 정의 · 국가법령정보센터','https://www.law.go.kr/LSW/lsLinkCommonInfo.do?lsJoLnkSeq=1033479975'),
    law('자동차관리법 제27조 임시운행의 허가 · 국가법령정보센터','https://www.law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1029372685'),
    law('자율주행자동차의 안전운행요건 등 시험운행에 관한 규정 · 국가법령정보센터','https://www.law.go.kr/LSW/admRulLsInfoP.do?admRulNm=%EC%9E%90%EC%9C%A8%EC%A3%BC%ED%96%89%EC%9E%90%EB%8F%99%EC%B0%A8%EC%9D%98+%EC%95%88%EC%A0%84%EC%9A%B4%ED%96%89%EC%9A%94%EA%B1%B4+%EB%93%B1+%EC%8B%9C%ED%97%98%EC%9A%B4%ED%96%89%EC%97%90+%EA%B4%80%ED%95%9C+%EA%B7%9C%EC%A0%95&docType=JO&joNo=001200000&languageType=KO&paras=1')
  ],'자율주행차 정의·시험연구 임시운행허가·세부 안전운행요건을 법률과 고시로 분리 대조.');

  patch('ai-autonomous-vehicle-commercialization',[
    law('자율주행자동차법 제2조 정의 · 국가법령정보센터','https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1029922801'),
    law('자율주행자동차법 제7조 시범운행지구의 지정 등 · 국가법령정보센터','https://www.law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1031876965'),
    law('자율주행자동차법 제40조 성능인증 · 국가법령정보센터','https://www.law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1028125469')
  ],'시범운행지구·특례와 안전기준이 없는 자율주행차의 성능인증을 제2조·제7조·제40조로 직접 대조.');

  patch('ai-uam-law',[
    law('도심항공교통법 제2조 정의 · 국가법령정보센터','https://www.law.go.kr/LSW/LsiJoLinkP.do?docType=JO&joNo=000200000&languageType=KO&lsNm=%EB%8F%84%EC%8B%AC%ED%95%AD%EA%B3%B5%EA%B5%90%ED%86%B5%20%ED%99%9C%EC%9A%A9%20%EC%B4%89%EC%A7%84%20%EB%B0%8F%20%EC%A7%80%EC%9B%90%EC%97%90%20%EA%B4%80%ED%95%9C%20%EB%B2%95%EB%A5%A0&paras=1'),
    law('도심항공교통법 제16조 시범운용구역의 규제특례 · 국가법령정보센터','https://www.law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1031865891'),
    law('도심항공교통법 제21조 보험 가입 의무 · 국가법령정보센터','https://www.law.go.kr/LSW/LsiJoLinkP.do?docType=JO&joNo=002100000&languageType=KO&lsNm=%EB%8F%84%EC%8B%AC%ED%95%AD%EA%B3%B5%EA%B5%90%ED%86%B5%20%ED%99%9C%EC%9A%A9%20%EC%B4%89%EC%A7%84%20%EB%B0%8F%20%EC%A7%80%EC%9B%90%EC%97%90%20%EA%B4%80%ED%95%9C%20%EB%B2%95%EB%A5%A0&paras=1')
  ],'UAM 개념·시범운용구역에서의 항공법 특례·책임보험을 제2조·제16조·제21조로 대조.');

  patch('ai-software-promotion',[
    law('소프트웨어 진흥법 제43조 소프트웨어사업 영향평가 · 국가법령정보센터','https://law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1024670555'),
    law('소프트웨어 진흥법 제49조 국가기관등의 소프트웨어사업 계약 등 · 국가법령정보센터','https://law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1027864063'),
    law('소프트웨어 진흥법 제50조 소프트웨어사업 과업심의위원회 · 국가법령정보센터','https://law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1027864091'),
    law('소프트웨어 진흥법 시행령 제47조 과업내용의 확정·변경 절차 등 · 국가법령정보센터','https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0047&lsiSeq=286139&urlMode=lsScJoRltInfoR')
  ],'공공 SW 사업의 시장영향평가·계약방식·과업확정/변경 및 금액·기간조정을 제43조·제49조·제50조와 시행령 제47조로 대조.');

  patch('ai-ict-industry-promotion',[
    law('정보통신산업 진흥법 제3조 국가 및 지방자치단체의 책무 · 국가법령정보센터','https://www.law.go.kr/LSW/LsiJoLinkP.do?docType=JO&joNo=000300000&languageType=KO&lsNm=%EC%A0%95%EB%B3%B4%ED%86%B5%EC%8B%A0%EC%82%B0%EC%97%85%20%EC%A7%84%ED%9D%A5%EB%B2%95&paras=1'),
    law('정보통신산업 진흥법 제5조 정보통신산업 진흥계획 · 국가법령정보센터','https://www.law.go.kr/LSW/LsiJoLinkP.do?docType=JO&joNo=000500000&languageType=KO&lsNm=%EC%A0%95%EB%B3%B4%ED%86%B5%EC%8B%A0%EC%82%B0%EC%97%85%20%EC%A7%84%ED%9D%A5%EB%B2%95&paras=1'),
    law('정보통신산업 진흥법 제26조 정보통신산업진흥원의 설립 등 · 국가법령정보센터','https://www.law.go.kr/LSW/lsLawLinkInfo.do?chrClsCd=010202&lsId=011006&lsJoLnkSeq=900538462'),
    law('정보통신산업 진흥법 제27조 산업진흥원의 사업 · 국가법령정보센터','https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1007949143')
  ],'ICT 산업진흥의 국가 책무·계획·NIPA 설립·사업범위를 제3조·제5조·제26조·제27조로 대조.');

  patch('ai-medical-device-law',[
    law('의료기기법 제2조 의료기기 정의(소프트웨어 포함) · 국가법령정보센터','https://www.law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1030255709'),
    law('의료기기법 제6조 제조업허가 및 제조허가·인증·신고 · 국가법령정보센터','https://www.law.go.kr/LSW/LsiJoLinkP.do?docType=JO&joNo=000600000&languageType=KO&lsNm=%EC%9D%98%EB%A3%8C%EA%B8%B0%EA%B8%B0%EB%B2%95&paras=1'),
    law('의료기기법 제10조 임상시험계획의 승인 등 · 국가법령정보센터','https://www.law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1028745731')
  ],'소프트웨어 의료기기 해당성·제조/품목 인허가·임상시험 승인 구조를 제2조·제6조·제10조로 대조.');

  patch('ai-medical-professional-duty',[
    law('의료법 제22조 진료기록부 등 · 국가법령정보센터','https://www.law.go.kr/LSW/LsiJoLinkP.do?docType=JO&joNo=008800002&languageType=KO&lsNm=%EC%9D%98%EB%A3%8C%EB%B2%95&paras=1'),
    law('의료법 제24조의2 의료행위에 관한 설명 · 국가법령정보센터','https://www.law.go.kr/LSW/LsiJoLinkP.do?docType=JO&joNo=002402000&languageType=KO&lsNm=%EC%9D%98%EB%A3%8C%EB%B2%95&paras=1'),
    law('민법 제750조 불법행위의 내용 · 국가법령정보센터','https://www.law.go.kr/LSW/LsiJoLinkP.do?docType=JO&joNo=075000000&languageType=KO&lsNm=%EB%AF%BC%EB%B2%95&paras=1')
  ],'AI 보조진료에서도 기록의무는 의료법 제22조, 법정 설명의무는 제24조의2의 적용범위를 정확히 한정하며, 일반 의료과실 손해배상은 민법 제750조 및 판례상 주의의무로 분석.');

  patch('ai-copyright-training-output',[
    law('저작권법 제2조 저작물·저작자 정의 · 국가법령정보센터','https://www.law.go.kr/LSW/LsiJoLinkP.do?docType=JO&joNo=000200000&languageType=KO&lsNm=%EC%A0%80%EC%9E%91%EA%B6%8C%EB%B2%95&paras=1'),
    law('저작권법 제35조의5 저작물의 공정한 이용 · 국가법령정보센터','https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1029423587')
  ],'생성물 저작자성의 출발점인 인간 창작 정의와 AI 학습 이용의 현행 일반 제한·예외 판단축인 제35조의5를 분리 대조. 한국법에 생성형 AI 학습을 포괄 면책하는 일반 조문이 있다고 표현하지 않음.');
})();
