(function(){
  const data=window.LEGAL_KNOWLEDGE||[];
  const CHECKED='2026.08.09';
  const sourceFields=['statuteSources','relatedCases','officialGuidance','sources'];

  const articleDirectPath=/lsLinkCommonInfo|lsLawLinkInfo|LsiJoLinkP|lsLinkProc/i;
  const precedentDirectPath=/precInfoP|precStmdInfoP/i;
  const articleLabel=/제\s*\d+(?:조(?:의\d+)?)?(?:\s*제\d+항)?/;
  const lawOrStatuteLabel=/법|헌법|규칙|시행령|고시|Act|Regulation|Directive/i;

  const manuallyVerifiedArticles=new Set([
    'public-proportionality','public-legitimate-expectation','public-invalid-voidable-act','public-state-liability',
    'criminal-omission','criminal-causation-attribution','criminal-joint-principal','criminal-exclusionary-rule','criminal-dolus-eventualis',
    'commercial-director-duty','civil-apparent-agency','civil-superficies',
    'ip-inventive-step','ip-trademark-similarity','ip-design-similarity',
    'ai-basic-transparency','ai-basic-frontier-safety','ai-basic-high-impact-duties','ai-basic-impact-assessment',
    'ai-pipa-automated-decision','ai-credit-automated-evaluation','ai-data-industry-assets',
    'ai-road-traffic-autonomous-driver','ai-outdoor-mobile-robot','ai-physical-robot-workplace-safety'
  ]);

  function safeUrl(raw){
    try{return new URL(raw);}catch{return null;}
  }

  function sourceClass(src){
    const raw=src?.url||'';
    const u=safeUrl(raw);
    if(!u) return {code:'D',rank:5,kind:'오류',note:'URL 형식 오류'};
    if(u.protocol!=='https:' && u.protocol!=='http:') return {code:'D',rank:5,kind:'오류',note:'웹 링크가 아님'};
    const h=u.hostname.toLowerCase();
    const p=u.pathname+u.search;

    if(h==='law.go.kr'||h==='www.law.go.kr'){
      if(precedentDirectPath.test(p)) return {code:'A1',rank:1,kind:'국가법령정보센터 판례 직접',note:'공식 판례 직접경로'};
      if(articleDirectPath.test(p)) return {code:'A1',rank:1,kind:'국가법령정보센터 조문 직접',note:'공식 조문 직접경로'};
      if(/admRulLsInfoP/i.test(p)) return {code:'A1',rank:1,kind:'국가법령정보센터 행정규칙 직접',note:'공식 행정규칙 직접경로'};
      if(/\/법령\/|lsInfoP|lsSc\.do|lsRvsDoc/i.test(p)) return {code:'A2',rank:2,kind:'국가법령정보센터 법령',note:'공식 법령·연혁 페이지'};
      if(/precSc\.do|conLsEmpDtListP/i.test(p)) return {code:'B1',rank:3,kind:'국가법령정보센터 검색·관련자료',note:'공식이나 판례 직접고정링크보다 안정성이 낮음'};
      return {code:'A2',rank:2,kind:'국가법령정보센터',note:'공식 법령정보 출처'};
    }

    if(h==='portal.scourt.go.kr') return {code:'A2',rank:2,kind:'사법정보공개포털',note:'법원 공식 직접 페이지'};
    if(h.endsWith('scourt.go.kr')){
      if(/NewsViewAction|DcNewsViewAction/i.test(p)) return {code:'B1',rank:3,kind:'대한민국 법원 게시물',note:'공식 출처이나 외부 접근 시 웹 방화벽·리디렉션 영향 가능'};
      return {code:'A2',rank:2,kind:'대한민국 법원',note:'법원 공식 출처'};
    }

    if(h.endsWith('.go.kr')||h==='www.nia.or.kr'||h==='nia.or.kr') return {code:'A2',rank:2,kind:'국내 정부·공공기관',note:'정부·공공기관 공식 출처'};
    if(h==='eur-lex.europa.eu'||h==='data.europa.eu'||h.endsWith('.edpb.europa.eu')) return {code:'A2',rank:2,kind:'EU 공식',note:'EU 기관 공식 출처'};
    if(h.endsWith('.gov')||h==='www.copyright.gov'||h==='copyright.gov') return {code:'A2',rank:2,kind:'미국 정부 공식',note:'미국 연방기관 공식 출처'};

    if(h.includes('wipo.int')||h.includes('oecd.org')) return {code:'A2',rank:2,kind:'국제기구 공식',note:'국제기구 공식 출처'};
    if(h.includes('doi.org')||h.includes('ssrn.com')||h.includes('springer.com')||h.includes('oup.com')||h.includes('cambridge.org')) return {code:'C',rank:4,kind:'학술·2차 자료',note:'법적 권위는 1차 법원보다 낮음'};
    return {code:'C',rank:4,kind:'기타 보조자료',note:'공식 1차 법원 여부 별도 확인'};
  }

  function collectSources(item){
    const out=[];
    const seen=new Set();
    sourceFields.forEach(field=>{
      (item[field]||[]).forEach(src=>{
        if(!src||!src.url) return;
        const key=src.url.trim();
        if(seen.has(key)) return;
        seen.add(key);
        out.push({...src,field,...sourceClass(src)});
      });
    });
    if(item.caseOfficialUrl && !seen.has(item.caseOfficialUrl)){
      const src={label:`${item.caseNo||''} 공식 판례`,url:item.caseOfficialUrl,field:'caseOfficialUrl'};
      out.push({...src,...sourceClass(src)});
    }
    return out;
  }

  function sourceAudit(item){
    const entries=collectSources(item);
    const counts={A1:0,A2:0,B1:0,C:0,D:0};
    entries.forEach(x=>{counts[x.code]=(counts[x.code]||0)+1;});
    let grade='C';
    if(!entries.length) grade=item.area==='법적 추론'?'N':'C';
    else if(counts.D) grade='D';
    else if(counts.C) grade=counts.A1+counts.A2>=counts.C?'B':'C';
    else if(counts.B1) grade=counts.A1+counts.A2?'B+':'B';
    else if(counts.A1) grade='A';
    else grade='A-';
    const fragile=entries.filter(x=>x.code==='B1').map(x=>x.label);
    return {grade,entries,counts,fragile};
  }

  function articleAudit(item){
    if(item.area==='법적 추론') return {grade:'N',note:'방법론·추론형 카드로 특정 조문 정확성 등급을 적용하지 않음',refs:[]};
    const refs=(item.statuteSources||[]).filter(Boolean);
    if(!refs.length) return {grade:'C',note:'공식 조문·법령 출처가 없어 개별 재확인 필요',refs:[]};
    const parsed=refs.map(src=>{
      const cls=sourceClass(src);
      const hasArticle=articleLabel.test(src.label||'');
      const direct=hasArticle && cls.code==='A1' && /law\.go\.kr/i.test(src.url||'');
      return {label:src.label,url:src.url,hasArticle,direct,sourceGrade:cls.code};
    });
    const manual=manuallyVerifiedArticles.has(item.id);
    const directCount=parsed.filter(x=>x.direct).length;
    const numbered=parsed.filter(x=>x.hasArticle).length;
    const official=parsed.filter(x=>/^A/.test(x.sourceGrade)||x.sourceGrade==='B1').length;

    if(manual) return {grade:'A',note:'2026-08-09 공식 조문·판례 참조조문과 개별 대조 완료',refs:parsed};
    if(directCount && numbered===parsed.length) return {grade:'A-',note:'국가법령정보센터 직접 조문경로와 조문번호가 연결됨. 의미범위는 카드 적용 시 별도 해석 필요',refs:parsed};
    if(numbered && official===parsed.length) return {grade:'B+',note:'조문번호는 명시되어 있으나 일부 링크가 법률 전체·연혁 페이지이므로 직접 조문 고정링크 보강 권장',refs:parsed};
    if(official===parsed.length) return {grade:'B',note:'공식 법률 출처는 확인되나 특정 조문번호 직접성은 낮음. 광범위 법리카드는 허용하되 사례 적용 전 조문 특정 필요',refs:parsed};
    return {grade:'C',note:'조문번호 또는 1차 법원 연결을 개별 재확인해야 함',refs:parsed};
  }

  function precedentAudit(item){
    if(item.area==='법적 추론') return {grade:'PN',note:'판례의 권위가 아니라 추론·논증 방법 자체를 다루는 카드'};
    if(item.caseNo && item.caseOriginalChecked===true){
      if(/대법원|헌법재판소/.test(item.caseCourt||'')) return {grade:'P1',note:`${item.caseCourt} ${item.caseNo} 직접 판시·원문대조 카드`};
      return {grade:'P2',note:`${item.caseCourt||'전문·하급심'} ${item.caseNo} 직접 판시 카드. 상급심·후속판례와 함께 사용`};
    }
    const related=item.relatedCases||[];
    const supreme=related.filter(x=>/대법원|헌법재판소|헌재/.test(x.label||''));
    if(supreme.length) return {grade:'P3+',note:'대법원·헌재 인접판례를 법리 보강에 사용하지만 이 카드 자체의 직접 판시사건은 아님'};
    if(related.length) return {grade:'P3',note:'인접·유사 판례를 보조적으로 사용. 직접 ratio와 사실관계 일치 여부를 사례별 확인'};
    if(item.adjacentCaseLaw) return {grade:'P4+',note:'직접 판례 미축적 또는 비판례형 주제. 인접법리·공식 해석을 보조적으로 사용'};
    return {grade:'P4',note:'직접 판례 인용 없이 법령·학설 중심. 신설법·정책법에서는 정상적인 상태'};
  }

  data.forEach(item=>{
    const s=sourceAudit(item);
    const a=articleAudit(item);
    const p=precedentAudit(item);
    item.sourceAuditChecked=CHECKED;
    item.sourceLinkGrade=s.grade;
    item.sourceLinkAudit=s;
    item.articleAccuracyGrade=a.grade;
    item.articleAccuracyAudit=a;
    item.precedentCitationGrade=p.grade;
    item.precedentCitationAudit=p;
    item.citationAuditStage='출처·조문·판례 인용감사 2026-08-09';
  });

  const tally=(key)=>data.reduce((acc,item)=>{const v=item[key]||'미분류';acc[v]=(acc[v]||0)+1;return acc;},{});
  window.LEGAL_SOURCE_AUDIT_SUMMARY={
    total:data.length,
    checked:CHECKED,
    sourceGrades:tally('sourceLinkGrade'),
    articleGrades:tally('articleAccuracyGrade'),
    precedentGrades:tally('precedentCitationGrade'),
    weakSourceCards:data.filter(x=>['C','D'].includes(x.sourceLinkGrade)).map(x=>({id:x.id,title:x.title,grade:x.sourceLinkGrade})),
    articleReviewCards:data.filter(x=>x.articleAccuracyGrade==='C').map(x=>({id:x.id,title:x.title})),
    fragileCards:data.filter(x=>(x.sourceLinkAudit?.counts?.B1||0)>0).map(x=>({id:x.id,title:x.title,links:x.sourceLinkAudit.fragile}))
  };
})();
