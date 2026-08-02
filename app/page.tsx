const researchAreas = [
  {
    number: "01",
    title: "AI 행위효과와 책임귀속",
    text: "자율적 판단과 실행이 야기한 법적 효과를 분석하고, 개발자·배포자·이용자 간 책임 배분의 원칙을 연구합니다.",
  },
  {
    number: "02",
    title: "Agentic AI·다중 AI 에이전트",
    text: "목표를 설정하고 협업하는 에이전트 시스템의 의사결정 구조와 새로운 규율 가능성을 탐구합니다.",
  },
  {
    number: "03",
    title: "기능적 단위의 법적 지위",
    text: "AI를 단순한 도구가 아닌 기능적 행위 단위로 바라보고 권리·의무·책임의 경계를 재구성합니다.",
  },
  {
    number: "04",
    title: "AI 거버넌스 및 비교법",
    text: "한국·EU·미국의 제도 변화를 비교해 기술 혁신과 기본권 보호를 조화시키는 정책 모델을 제안합니다.",
  },
];

const archiveItems = [
  { type: "RESEARCH BRIEF", date: "2026. 07", title: "자율형 AI 에이전트의 행위와 민사책임 구조" },
  { type: "COMPARATIVE LAW", date: "2026. 05", title: "EU AI Act 이후의 고위험 AI 거버넌스" },
  { type: "WORKING PAPER", date: "2026. 02", title: "기능적 단위로서 AI의 법적 지위에 관한 시론" },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="AI 법률연구소 홈">
          <span className="brand-mark">AIL</span>
          <span><strong>AI 법률연구소</strong><small>AI LAW RESEARCH INSTITUTE</small></span>
        </a>
        <nav aria-label="주요 메뉴">
          <a href="#about">연구소</a><a href="#research">연구</a><a href="#archive">아카이브</a><a href="#lecture">강의·출판</a>
        </nav>
        <a className="header-cta" href="#contact">협력 문의 <span>↗</span></a>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid">
          <div className="eyebrow">LAW · TECHNOLOGY · GOVERNANCE</div>
          <div className="hero-copy">
            <h1>지능의 시대,<br /><em>책임의 법</em>을 설계합니다.</h1>
            <p>AI 법률연구소는 인공지능의 행위와 책임을 둘러싼 새로운 법적 질문을 연구하고, 기술과 사회가 함께 신뢰할 수 있는 제도를 만듭니다.</p>
            <div className="hero-actions">
              <a className="button primary" href="#research">연구 분야 보기 <span>→</span></a>
              <a className="button text-button" href="#about">연구소 소개 <span>↓</span></a>
            </div>
          </div>
          <aside className="hero-note">
            <span>FOCUS 2026</span>
            <strong>AI 책임법과<br />제도 설계</strong>
            <p>Agentic AI 시대의 책임 원칙과 국제 규범을 연구합니다.</p>
          </aside>
        </div>
        <div className="hero-index"><span>SEOUL · KOREA</span><span>INDEPENDENT RESEARCH INSTITUTE</span><span>EST. 2026</span></div>
      </section>

      <section className="about section" id="about">
        <div className="section-label">01 / ABOUT</div>
        <div className="about-content">
          <p className="lead">기술이 앞서가는 시대일수록<br />법은 더 정확한 질문을 던져야 합니다.</p>
          <div className="about-body">
            <h2>AI의 판단과 행동을 법은 어떻게 이해해야 하는가.</h2>
            <p>AI 법률연구소는 인공지능이 만들어내는 새로운 행위효과를 법이 어떻게 포착하고 책임을 배분할 것인지 탐구합니다. 기존 법리의 정교한 해석과 미래지향적 제도 설계를 연결합니다.</p>
            <p>학술 연구에 머무르지 않고 정책, 산업, 교육 현장과 협력하여 적용 가능한 원칙과 언어를 제시합니다.</p>
            <dl><div><dt>Research</dt><dd>AI 책임법 심층 연구</dd></div><div><dt>Policy</dt><dd>국내외 제도 비교·제언</dd></div><div><dt>Education</dt><dd>전문 강의와 지식 확산</dd></div></dl>
          </div>
        </div>
      </section>

      <section className="research section dark-section" id="research">
        <div className="section-head">
          <div><div className="section-label light">02 / RESEARCH AREAS</div><h2>핵심 연구 분야</h2></div>
          <p>AI가 인간과 사회에 미치는 법적 효과를 네 가지 축으로 연구합니다.</p>
        </div>
        <div className="research-grid">
          {researchAreas.map((item) => <article key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.text}</p><a href="#contact" aria-label={`${item.title} 연구 문의`}>연구 문의 →</a></article>)}
        </div>
      </section>

      <section className="profile section">
        <div className="section-label">03 / PEOPLE & PROJECTS</div>
        <div className="profile-grid">
          <div className="portrait" role="img" aria-label="대표 연구자 프로필 이미지 자리"><span>대표 연구자</span><strong>PROFILE</strong></div>
          <div className="profile-copy">
            <span className="overline">FOUNDER & DIRECTOR</span>
            <h2>법학의 언어로<br />AI 시대의 질서를 연구합니다.</h2>
            <p>AI의 행위성, 책임귀속, 기능적 법적 지위를 중심으로 민사법과 기술법의 접점을 연구합니다. 이론적 정합성과 제도적 실행 가능성을 함께 추구합니다.</p>
            <div className="credentials"><span>AI 책임법 연구</span><span>법학 석사 연구</span><span>박사 연구 프로젝트</span></div>
            <a className="inline-link" href="#contact">연구자 프로필 및 협업 문의 →</a>
          </div>
        </div>
        <div className="projects">
          <article><small>MASTER&apos;S THESIS</small><h3>AI 행위효과와 민사법상 책임귀속</h3><p>AI가 생성한 법적 효과의 귀속 기준과 관련 주체의 주의의무를 체계화합니다.</p></article>
          <article><small>DOCTORAL RESEARCH</small><h3>기능적 단위로서의 AI와 법적 지위</h3><p>다중 에이전트 환경에서 나타나는 독립적 기능 단위의 법적 의미를 연구합니다.</p></article>
        </div>
      </section>

      <section className="archive section" id="archive">
        <div className="section-head archive-head"><div><div className="section-label">04 / ARCHIVE</div><h2>AI 책임법 연구 아카이브</h2></div><p>연구 논문, 브리핑과 비교법 자료를 지속적으로 공개합니다.</p></div>
        <div className="archive-list">
          {archiveItems.map((item, index) => <a href="#contact" key={item.title}><span className="archive-no">0{index + 1}</span><span className="archive-meta">{item.type}<small>{item.date}</small></span><strong>{item.title}</strong><span className="round-arrow">↗</span></a>)}
        </div>
        <p className="archive-notice">자료 다운로드와 뉴스레터 구독 기능은 아카이브 개설 후 제공됩니다.</p>
      </section>

      <section className="content section" id="lecture">
        <div className="section-label">05 / KNOWLEDGE</div>
        <div className="content-grid">
          <article className="knowledge-card lecture-card"><span className="overline">LECTURES</span><h2>복잡한 AI 법률을<br />명확한 언어로.</h2><p>대학, 기업, 공공기관을 위한 맞춤형 강의와 세미나를 제공합니다.</p><ul><li>AI 책임법 입문과 최신 쟁점</li><li>Agentic AI와 기업 거버넌스</li><li>EU AI Act 비교법 강의</li></ul><a className="button pale" href="#contact">강의 의뢰하기 →</a></article>
          <article className="knowledge-card book-card"><span className="overline">PUBLICATIONS</span><div className="book-object"><small>AI LAW<br />SERIES 01</small><strong>AI 시대의<br />책임법</strong><span>AI 법률연구소</span></div><div><h2>전자책·출판물</h2><p>연구 결과를 실무자와 시민이 읽을 수 있는 책과 콘텐츠로 출간합니다.</p><span className="coming">출간 준비 중</span></div></article>
          <article className="knowledge-card media-card"><span className="overline">MEDIA</span><div className="play">▶</div><h2>HASHEM YESHUA</h2><p>AI, 법, 책임에 관한 연구 브리핑과 강의를 영상으로 만나보세요.</p><span className="coming">YOUTUBE CHANNEL · 연결 예정</span></article>
        </div>
      </section>

      <section className="contact section" id="contact">
        <div className="contact-intro"><div className="section-label light">06 / CONTACT</div><h2>새로운 질문에서<br />협력이 시작됩니다.</h2><p>공동 연구, 정책 자문, 강의 및 출판 협력을 제안해 주세요.</p><div className="contact-detail"><small>GENERAL INQUIRIES</small><span>contact@ailawri.org</span></div></div>
        <form action="mailto:contact@ailawri.org" method="post" encType="text/plain">
          <label>이름 / 기관<input name="name" required placeholder="성함 또는 기관명을 입력해 주세요" /></label>
          <label>이메일<input type="email" name="email" required placeholder="회신받을 이메일을 입력해 주세요" /></label>
          <label>문의 유형<select name="type" defaultValue=""><option value="" disabled>문의 유형을 선택해 주세요</option><option>공동 연구</option><option>정책·법률 자문</option><option>강의 의뢰</option><option>출판·미디어</option><option>기타</option></select></label>
          <label>문의 내용<textarea name="message" required rows={4} placeholder="문의하실 내용을 입력해 주세요" /></label>
          <button className="button submit" type="submit">문의 보내기 <span>→</span></button>
        </form>
      </section>

      <footer><a className="brand footer-brand" href="#top"><span className="brand-mark">AIL</span><span><strong>AI 법률연구소</strong><small>AI LAW RESEARCH INSTITUTE</small></span></a><p>AI의 행위와 책임, 그리고 법의 미래를 연구합니다.</p><div><span>© 2026 AI LAW RESEARCH INSTITUTE</span><a href="#top">BACK TO TOP ↑</a></div></footer>
    </main>
  );
}
