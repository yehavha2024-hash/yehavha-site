(() => {
  'use strict';

  if (!Array.isArray(window.AI_LITERATURE_RECORDS)) return;

  const records = window.AI_LITERATURE_RECORDS;
  const patch = (id, changes) => {
    const record = records.find(item => item.id === id);
    if (record) Object.assign(record, changes);
  };

  // 2026-08-12 공식 개별 서지 대조 후 교체한 국내 학술논문 링크·서지.
  patch('kr-civil-lee-jonggu-2025', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003301928',
    access: 'KCI 개별 논문',
    sourceVerified: true
  });
  patch('kr-company-nam-nam-2025', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003259854',
    access: 'KCI 개별 논문',
    sourceVerified: true
  });
  patch('kr-company-kim-jaekyung-2026', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003327610',
    access: 'KCI 개별 논문',
    sourceVerified: true
  });
  patch('kr-company-han-seokhun-2009', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART001321547',
    access: 'KCI 개별 논문',
    sourceVerified: true
  });
  patch('kr-public-lee-heeok-2026', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003337148',
    access: 'KCI 개별 논문',
    sourceVerified: true
  });
  patch('kr-data-kim-hyunsook-2020', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART002586280',
    access: 'KCI 개별 논문',
    sourceVerified: true
  });
  patch('kr-ip-park-sungho-2025', {
    title: '생성형 AI 관련 저작권 침해소송에서 주장⋅증명책임에 관한 고찰',
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003192483',
    access: 'KCI 개별 논문',
    sourceVerified: true
  });
  patch('kr-ip-lee-daehee-warhol-2024', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003057206',
    access: 'KCI 개별 논문',
    sourceVerified: true
  });
  patch('kr-ip-choi-seungjae-2025', {
    title: '인공지능 시대 창작과 저작권법과 부정경쟁방지법의 역할 - 스타일 침해 논의를 중심으로 -',
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003241722',
    access: 'KCI 개별 논문',
    sourceVerified: true
  });
  patch('kr-ip-lee-bohyung-2026', {
    url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003336277',
    access: 'KCI 개별 논문',
    sourceVerified: true
  });

  // 학위명과 문헌유형을 혼동하지 않도록 박사학위논문 서지 단위를 교정.
  patch('thesis-kang-hyekyung-2024', {
    publication: '전남대학교 대학원 박사학위논문',
    sourceVerified: true
  });
  patch('thesis-kang-civil-procedure-2024', {
    publication: '고려대학교 대학원 박사학위논문',
    sourceVerified: true
  });
  patch('thesis-kim-automated-admin-2024', {
    publication: '고려대학교 대학원 박사학위논문',
    sourceVerified: true
  });
  patch('thesis-yoon-ai-criminal-2018', {
    publication: '서울대학교 대학원 박사학위논문',
    sourceVerified: true
  });

  const exactAcademicSource = url => {
    const value = String(url || '');
    if (!value) return false;
    if (/^https:\/\/doi\.org\/10\./i.test(value)) return true;
    if (/kci\.go\.kr\/.*(?:arti_id|artiId)=ART\d+/i.test(value)) return true;
    if (/journal\.kci\.go\.kr\/.*artiId=ART\d+/i.test(value)) return true;
    if (/riss\.kr\/search\/detail\/.*control_no=/i.test(value)) return true;
    if (/riss\.kr\/link\?id=A\d+/i.test(value)) return true;
    return false;
  };

  const exactThesisSource = url => {
    const value = String(url || '');
    if (!value) return false;
    if (/riss\.kr\/link\?id=T\d+/i.test(value)) return true;
    if (/riss\.kr\/search\/detail\/.*control_no=/i.test(value)) return true;
    if (/dbpia\.co\.kr\/journal\/detail\?nodeId=T\d+/i.test(value)) return true;
    if (/dcollection\.[^/]+\/srch\/srchDetail\/\d+/i.test(value)) return true;
    if (/dl\.nanet\.go\.kr\/detail\/KDMT\d+/i.test(value)) return true;
    if (/s-space\.snu\.ac\.kr\/handle\/\d+\/\d+$/i.test(value)) return true;
    return false;
  };

  const isDomesticArticle = record => record.type === '국내 학술논문';
  const isDoctoralThesis = record => String(record.type || '').includes('박사학위논문');

  // 정확한 개별 서지 링크가 없는 연구문헌은 공개 목록에서 제외한다.
  // 박도현 2021 박사학위논문은 존재·학위는 확인됐지만 기존 링크가 학술발표 페이지이므로
  // 개별 학위논문 레코드 URL을 확보하기 전까지 공개 목록에서 제외한다.
  const kept = records.filter(record => {
    if (isDomesticArticle(record)) {
      const ok = exactAcademicSource(record.url);
      if (ok) record.sourceVerified = true;
      return ok;
    }
    if (isDoctoralThesis(record)) {
      const ok = exactThesisSource(record.url);
      if (ok) record.sourceVerified = true;
      return ok;
    }
    return true;
  });

  window.AI_LITERATURE_RECORDS = kept;

  // 삭제된 문헌을 읽기 경로에서 자동 제거한다.
  const validIds = new Set(kept.map(record => record.id));
  if (Array.isArray(window.AI_LITERATURE_ROUTES)) {
    window.AI_LITERATURE_ROUTES.forEach(route => {
      if (Array.isArray(route.recordIds)) {
        route.recordIds = route.recordIds.filter(id => validIds.has(id));
      }
    });
  }
})();
