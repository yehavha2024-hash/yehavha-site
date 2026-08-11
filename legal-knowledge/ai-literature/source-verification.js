(() => {
  'use strict';

  if (!Array.isArray(window.AI_LITERATURE_RECORDS)) return;

  const records = window.AI_LITERATURE_RECORDS;
  const patch = (id, changes) => {
    const record = records.find(item => item.id === id);
    if (record) Object.assign(record, changes);
  };

  /*
   * SOURCE POLICY — 2026-08-12
   * 국내 학술논문과 박사학위논문은 URL 형태만으로 검증하지 않는다.
   * KCI·RISS·대학 dCollection·국회도서관·DBpia 등 개별 서지에서
   * 제목·저자·연도·권호/학위·쪽수를 직접 대조한 ID만 화이트리스트에 포함한다.
   * 미검증 문헌은 공개 목록에서 제외하고 검증 후에만 다시 추가한다.
   */

  // ─────────────────────────────────────────────
  // 1. 공식 서지와 다른 제목·출처를 개별 레코드 기준으로 교정
  // ─────────────────────────────────────────────

  patch('kr-civil-kim-jaewan-2023', {
    title: '제조물 책임법의 디지털 제조물책임으로의 확장을 위한 검토: EU 「제조물책임지침 개정안」을 중심으로',
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART002981000',
    access: 'KCI 개별 논문'
  });
  patch('kr-civil-lee-jonggu-2025', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003301928',
    access: 'KCI 개별 논문'
  });

  patch('kr-company-sung-jung-2025', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003296343',
    access: 'KCI 개별 논문'
  });
  patch('kr-company-nam-nam-2025', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003259854',
    access: 'KCI 개별 논문'
  });
  patch('kr-company-kim-jaekyung-2026', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003327610',
    access: 'KCI 개별 논문'
  });
  patch('kr-company-han-seokhun-2009', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART001321547',
    access: 'KCI 개별 논문'
  });

  patch('kr-public-kim-kim-2025', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003259766',
    access: 'KCI 개별 논문'
  });
  patch('kr-public-lee-kookhyun-2025', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003182516',
    access: 'KCI 개별 논문'
  });
  patch('kr-public-impact-2026', {
    title: '인공지능기본법상 고영향 인공지능 영향평가의 문제점 및 개선 방향에 관한 연구',
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003337205',
    access: 'KCI 개별 논문'
  });
  patch('kr-public-no-hyunsook-2026', {
    title: '인공지능 투명성 의무의 해석과 입법적 재구성 - 「인공지능기본법」 제31조를 중심으로',
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003345493',
    access: 'KCI 개별 논문'
  });
  patch('kr-public-sandbox-2026', {
    title: '인공지능기본법상 규제 샌드박스 제도화 연구 - EU 인공지능법의 규제 샌드박스와 디지털 옴니버스를 중심으로',
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003301074',
    access: 'KCI 개별 논문'
  });
  patch('kr-public-governance-2025', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003245252',
    access: 'KCI 개별 논문'
  });
  patch('kr-public-lee-changmin-2026', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003335998',
    access: 'KCI 개별 논문'
  });
  patch('kr-public-cho-kim-2021', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART002714993',
    access: 'KCI 개별 논문'
  });
  patch('kr-public-kim-kim-discrimination-2019', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART002485139',
    access: 'KCI 개별 논문'
  });
  patch('kr-public-kim-heejung-2020', {
    title: '지능정보화 시대의 알고리즘 차별에 대한 법적 소고 -미국의 알고리즘 차별 사례를 중심으로-',
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART002628487',
    access: 'KCI 개별 논문'
  });
  patch('kr-public-lee-heeok-2026', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003337148',
    access: 'KCI 개별 논문'
  });

  patch('kr-crim-medical-2025', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003245902',
    access: 'KCI 개별 논문'
  });
  patch('kr-crim-nam-2021', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART002729246',
    access: 'KCI 개별 논문'
  });
  patch('kr-crim-fu-2023', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART002958054',
    access: 'KCI 개별 논문'
  });
  patch('kr-crim-park-heesoo-2024', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003156768',
    access: 'KCI 개별 논문'
  });
  patch('kr-crim-strict-2026', {
    title: '미국 형법상 엄격책임의 이론과 현대적 전개:인공지능 시대 자율주행기술에 대한 적용 가능성을 중심으로',
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003311827',
    access: 'KCI 개별 논문'
  });
  patch('kr-crim-lee-seungjun-2023', {
    title: 'Level 4 자율주행자동차의 사고시 형사책임에 대한 외국의 입법동향과 방향성 -독일, 일본 및 영국 입법권고안의 시사점을 중심으로-',
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART002985969',
    access: 'KCI 개별 논문'
  });

  patch('kr-data-lee-lee-2024', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003059222',
    access: 'KCI 개별 논문'
  });
  patch('kr-data-lee-donggun-2023', {
    title: '인공지능 정보의 사용에 따른 개인정보보호에 관한 법적 연구 – 데이터 3법의「동의권」관련 분석을 중심으로 –',
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003001062',
    access: 'KCI 개별 논문'
  });
  patch('kr-data-kim-hyunsook-2020', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART002586280',
    access: 'KCI 개별 논문'
  });
  patch('kr-data-kim-junggil-2026', {
    title: '인공지능 시대 디지털 소비자 권리 체계의 재구성 - 알고리즘 설명요구권과 자동화된 의사결정 거부권을 중심으로 -',
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003313611',
    access: 'KCI 개별 논문'
  });

  patch('kr-ip-park-sungho-2025', {
    title: '생성형 AI 관련 저작권 침해소송에서 주장⋅증명책임에 관한 고찰',
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003192483',
    access: 'KCI 개별 논문'
  });
  patch('kr-ip-lee-daehee-warhol-2024', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003057206',
    access: 'KCI 개별 논문'
  });
  patch('kr-ip-yoon-kwonsoon-2025', {
    title: '미국의 인공지능 관련 저작물성 판단 법리의 개념화 및 법리의 타당성 분석: ‘표현요소 통제가능성(controllability of the expressive elements)’ 법리는 타당한가?',
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003198892',
    access: 'KCI 개별 논문'
  });
  patch('kr-ip-jung-yunkyung-2024', {
    title: '유럽연합 인공지능법(EU AI Act) 제정의 저작권법적 시사점',
    publication: 'IP & Data 法 4(2), 71-109',
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003152336',
    access: 'KCI 개별 논문'
  });
  patch('kr-ip-kwon-soonjae-2024', {
    title: '인공지능 학습 관련 저작권 침해소송의 현실적 문제에 관한 소고 - 미국 캘리포니아 북부지방법원 계류중 사건을 중심으로 -',
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003155382',
    access: 'KCI 개별 논문'
  });
  patch('kr-ip-park-hyejin-2026', {
    title: '인공지능 생성 기술문서의 선행기술성 — 공중이용가능성과 실시가능성을 중심으로 —',
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003320134',
    access: 'KCI 개별 논문'
  });
  patch('kr-ip-kwon-soonjae-2026', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003320141',
    access: 'KCI 개별 논문'
  });
  patch('kr-ip-choi-seungjae-2025', {
    title: '인공지능 시대 창작과 저작권법과 부정경쟁방지법의 역할 - 스타일 침해 논의를 중심으로 -',
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003241722',
    access: 'KCI 개별 논문'
  });
  patch('kr-ip-lee-bohyung-2026', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003336277',
    access: 'KCI 개별 논문'
  });

  // 기존 핵심 데이터 파일의 국내 논문도 개별 KCI 서지로 통일.
  patch('article-trustworthy-ai-2022', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART002877025',
    access: 'KCI 개별 논문'
  });
  patch('article-park-bias-2022', {
    url: 'https://www.riss.kr/link?id=A108081517',
    access: 'RISS 개별 논문'
  });
  patch('article-fairness-2023', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART002994595',
    access: 'KCI 개별 논문'
  });
  patch('article-human-intervention-2026', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003337578',
    access: 'KCI 개별 논문'
  });
  patch('article-copyright-genai-2025', {
    title: '생성형 AI와 저작권 문제 - 저작권 침해와 저작물성의 사례와 분석-',
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003222050',
    access: 'KCI 개별 논문'
  });
  patch('article-copyright-constitutional-2025', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003245251',
    access: 'KCI 개별 논문'
  });
  patch('article-patent-ai-2025', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003221055',
    access: 'KCI 개별 논문'
  });
  patch('article-hallucination-rights-2026', {
    publication: '법이론실무연구 14(1), 49-88',
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003314937',
    access: 'KCI 개별 논문'
  });
  patch('article-ai-search-liability-2025', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003276179',
    access: 'KCI 개별 논문'
  });
  patch('article-ai-washing-2025', {
    title: 'AI워싱의 민사법적 책임과 대응방안 - 인공지능기본법 정의규정을 중심으로-',
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003242758',
    access: 'KCI 개별 논문'
  });
  patch('article-ahn-ai-criminal-2017', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART002253379',
    access: 'KCI 개별 논문'
  });
  patch('article-kim-ai-crime-2023', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003003201',
    access: 'KCI 개별 논문'
  });
  patch('article-oh-ai-criminal-2025', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003286602',
    access: 'KCI 개별 논문'
  });
  patch('article-shin-new-ai-crime-2025', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003216631',
    access: 'KCI 개별 논문'
  });
  patch('article-han-ml-criminal-2025', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003247070',
    access: 'KCI 개별 논문'
  });

  // 박사학위논문은 학위명('법학박사')이 아니라 문헌유형 '박사학위논문'으로 표기.
  patch('thesis-kang-hyekyung-2024', { publication: '전남대학교 대학원 박사학위논문' });
  patch('thesis-kang-civil-procedure-2024', { publication: '고려대학교 대학원 박사학위논문' });
  patch('thesis-kim-automated-admin-2024', { publication: '고려대학교 대학원 박사학위논문' });
  patch('thesis-yoon-ai-criminal-2018', { publication: '서울대학교 대학원 박사학위논문' });

  // ─────────────────────────────────────────────
  // 2. 실제 서지 대조 완료 화이트리스트
  // ─────────────────────────────────────────────

  const VERIFIED_DOMESTIC_ARTICLES = new Set([
    // 핵심·기초 문헌
    'article-jeong-civil-2018',
    'article-shin-personhood-2018',
    'article-kim-error-2022',
    'article-lee-soeun-seo-2026',
    'article-training-data-liability-2025',
    'article-choi-company-2020',
    'article-namgung-director-2024',
    'article-trustworthy-ai-2022',
    'article-park-bias-2022',
    'article-fairness-2023',
    'article-human-intervention-2026',
    'article-copyright-genai-2025',
    'article-copyright-constitutional-2025',
    'article-patent-ai-2025',
    'article-hallucination-rights-2026',
    'article-ai-search-liability-2025',
    'article-ai-washing-2025',
    'article-ahn-ai-criminal-2017',
    'article-kim-ai-crime-2023',
    'article-oh-ai-criminal-2025',
    'article-shin-new-ai-crime-2025',
    'article-han-ml-criminal-2025',

    // 민사·책임법
    'kr-civil-lee-soo-2024',
    'kr-civil-lee-haewon-product-2021',
    'kr-civil-lee-kyungmi-2020',
    'kr-civil-kim-jaewan-2023',
    'kr-civil-lee-jonggu-2025',
    'kr-civil-shin-jihye-2026',
    'kr-civil-choi-minsu-2020',
    'kr-civil-kim-sungho-2020',
    'kr-civil-yoon-hyunsik-2021',
    'kr-civil-lee-sungjin-2020',
    'kr-civil-kim-jinwoo-capacity-2021',
    'kr-civil-ryu-changho-2016',
    'kr-civil-kim-jinwoo-av-2018',
    'kr-civil-jung-shindong-2025',

    // 상법·회사법
    'kr-company-lim-2025',
    'kr-company-sung-jung-2025',
    'kr-company-kim-jongwoo-2019',
    'kr-company-nam-nam-2025',
    'kr-company-kim-jaekyung-2026',
    'kr-company-han-seokhun-2009',
    'kr-company-kim-jihwan-2013',

    // 헌법·공법
    'kr-public-kim-kim-2025',
    'kr-public-lee-kookhyun-2025',
    'kr-public-han-joohee-2026',
    'kr-public-impact-2026',
    'kr-public-no-hyunsook-2026',
    'kr-public-sandbox-2026',
    'kr-public-governance-2025',
    'kr-public-lee-changmin-2026',
    'kr-public-cho-kim-2021',
    'kr-public-kim-kim-discrimination-2019',
    'kr-public-kim-heejung-2020',
    'kr-public-lee-heeok-2026',
    'kr-public-park-jinwan-2025',

    // 형사법
    'kr-crim-ryu-2026',
    'kr-crim-baek-2026',
    'kr-crim-lee-sangsoo-2025',
    'kr-crim-medical-2025',
    'kr-crim-nam-2021',
    'kr-crim-fu-2023',
    'kr-crim-park-heesoo-2024',
    'kr-crim-control-2026',
    'kr-crim-strict-2026',
    'kr-crim-lee-seungjun-2023',

    // 데이터·개인정보
    'kr-data-lee-lee-2024',
    'kr-data-lee-donggun-2023',
    'kr-data-kim-kyungsook-2026',
    'kr-data-kim-hyunsook-2020',
    'kr-data-kim-junggil-2026',
    'kr-data-lee-moon-2025',
    'kr-data-jung-dawo-2026',
    'kr-data-lee-hyungsuk-log-2025',
    'kr-data-lee-daehee-2026',
    'kr-data-kwon-jung-2026',

    // 지식재산
    'kr-ip-lee-cheolnam-2023',
    'kr-ip-park-sungho-2025',
    'kr-ip-lee-daehee-warhol-2024',
    'kr-ip-yoon-kwonsoon-2025',
    'kr-ip-jung-yunkyung-2024',
    'kr-ip-lee-cheolnam-2024',
    'kr-ip-shin-seohye-2023',
    'kr-ip-kwon-soonjae-2024',
    'kr-ip-lee-bohyung-2026',
    'kr-ip-park-hyejin-2026',
    'kr-ip-kwon-wonmyung-2026',
    'kr-ip-kwon-soonjae-2026',
    'kr-ip-choi-seungjae-2025',
    'kr-ip-park-woochul-2026'
  ]);

  const VERIFIED_DOCTORAL_THESES = new Set([
    'thesis-lee-tort-2021',
    'thesis-kang-hyekyung-2024',
    'thesis-kang-civil-procedure-2024',
    'thesis-kim-automated-admin-2024',
    'thesis-yoon-ai-criminal-2018',
    'kr-thesis-kim-jonggap-2021',
    'kr-thesis-son-eunji-2023',
    'kr-thesis-moon-2023',
    'kr-thesis-yang-2019',
    'kr-thesis-lee-sunghee-2020'
  ]);

  const isDomesticArticle = record => record.type === '국내 학술논문';
  const isDoctoralThesis = record => String(record.type || '').includes('박사학위논문');

  // 실제 서지 대조가 완료된 문헌만 공개. 미검증 자료는 화면에서 보류한다.
  const kept = records.filter(record => {
    if (isDomesticArticle(record)) {
      const verified = VERIFIED_DOMESTIC_ARTICLES.has(record.id);
      if (verified) record.sourceVerified = true;
      return verified;
    }
    if (isDoctoralThesis(record)) {
      const verified = VERIFIED_DOCTORAL_THESES.has(record.id);
      if (verified) record.sourceVerified = true;
      return verified;
    }
    return true;
  });

  window.AI_LITERATURE_RECORDS = kept;

  // 보류된 문헌은 읽기 경로에서도 제거한다.
  const validIds = new Set(kept.map(record => record.id));
  if (Array.isArray(window.AI_LITERATURE_ROUTES)) {
    window.AI_LITERATURE_ROUTES.forEach(route => {
      if (Array.isArray(route.recordIds)) {
        route.recordIds = route.recordIds.filter(id => validIds.has(id));
      }
    });
  }
})();
