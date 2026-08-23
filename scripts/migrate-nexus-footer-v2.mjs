import fs from 'node:fs';

const BUSINESS = '스카이예슈아 · 사업자등록번호 536-38-01234 · 대표 이명훈';
const COPYRIGHT = 'Copyright © 이명훈 2026. All rights reserved.';
const touched = [];

const read = file => fs.readFileSync(file, 'utf8');
const write = (file, next) => {
  const prev = read(file);
  if (prev === next) return;
  fs.writeFileSync(file, next);
  touched.push(file);
};

const replaceFooter = (file, footer) => {
  const html = read(file);
  const next = html.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/i, footer);
  if (next === html) throw new Error(`footer not replaced: ${file}`);
  write(file, next);
};

const portalFooter = ({ title, description, ai }) => `<footer class="footer" data-footer-standard="v2">
  <div class="container">
    <div class="footer-card">
      <strong>${title}</strong>
      <p>${description}</p>
      <div class="footer-meta">
        <p>${COPYRIGHT}</p>
        <p>문의 <a href="mailto:kimbrighth@gmail.com">kimbrighth@gmail.com</a></p>
        <p class="ai-disclosure">${ai}</p>
        <p><a href="#top">맨 위로 이동 ↑</a></p>
      </div>
    </div>
  </div>
</footer>`;

const compactFooter = ({ title, description, ai }) => `<footer class="footer" data-footer-standard="v2"><strong>${title}</strong><p class="footer-description">${description}</p><div class="footer-meta"><p class="business-meta">${BUSINESS}</p><p>${COPYRIGHT}</p><p>문의 <a href="mailto:kimbrighth@gmail.com">kimbrighth@gmail.com</a></p><p class="ai-disclosure">${ai}</p><a href="#top">맨 위로 이동 ↑</a></div></footer>`;

const universityFooter = ({ title, description, ai }) => `<footer class="footer university-footer" data-footer-standard="v2"><strong>${title}</strong><p class="footer-description">${description}</p><div class="university-footer-meta"><p class="business-meta">${BUSINESS}</p><p>${COPYRIGHT}</p><p>문의 <a href="mailto:kimbrighth@gmail.com">kimbrighth@gmail.com</a></p><p class="ai-disclosure">${ai}</p><a href="#top">맨 위로 이동 ↑</a></div></footer>`;

// Main portal: structure is already compatible; remove the stale version marker.
{
  const file = 'nexus/index.html';
  write(file, read(file).replace('data-footer-standard="v1"', 'data-footer-standard="v2"'));
}

replaceFooter('nexus/ai-trends/index.html', portalFooter({
  title: 'AI 동향 브리프',
  description: 'AI Intelligence & Trend Brief · 기술·정책·연구·사건의 변화 추적',
  ai: 'AI 활용 안내: 공개된 원출처의 탐색·분류·요약과 초안 구조화에 생성형 AI를 활용할 수 있으며, 최종 분류·해석·연구 연결과 공개 여부는 관리자가 검토합니다.'
}));
{
  const file = 'nexus/ai-trends/index.html';
  write(file, read(file).replace('.source-link{width:100%;justify-content:flex-start}.footer-card{max-width:100%}', '.source-link{width:100%;justify-content:flex-start}'));
}

replaceFooter('nexus/initiatives/index.html', portalFooter({
  title: 'YEHAVHA NEXUS · Idea Hub',
  description: '사업·연구·콘텐츠·서비스 분야의 아이디어와 공개 프로젝트를 소개합니다.',
  ai: 'AI 활용 안내: 아이디어의 정리·분류·문안 구조화에 생성형 AI를 활용할 수 있으며, 공개 여부·우선순위·기획·편집·운영은 운영자가 결정합니다.'
}));

replaceFooter('nexus/publishing/index.html', portalFooter({
  title: 'YEHAVHA NEXUS · Publishing',
  description: '대표 전자책의 주제·소개와 주요 판매처를 한곳에서 확인할 수 있습니다.',
  ai: 'AI 활용 안내: 일부 도서 소개의 정리·구조화에 생성형 AI를 활용하며, 출간정보와 최종 소개 내용은 운영자가 확인합니다.'
}));

replaceFooter('nexus/publishing/detail.html', portalFooter({
  title: 'YEHAVHA NEXUS · Publishing',
  description: '대표 출간물의 핵심 내용과 판매처를 연결합니다.',
  ai: 'AI 활용 안내: 일부 도서 소개의 정리·구조화에 생성형 AI를 활용하며, 출간정보와 최종 소개 내용은 운영자가 검토·관리합니다.'
}));

replaceFooter('nexus/ai-legal-glossary/index.html', compactFooter({
  title: 'AI·법학 통합 용어·개념',
  description: 'AI · LAW TERMINOLOGY & CONCEPTS',
  ai: 'AI 활용 안내: 용어 설명의 정리·구조화에 생성형 AI를 활용할 수 있으며, 용어의 의미·법적 연결·표현과 최종 편집은 운영자가 검토합니다.'
}));
replaceFooter('nexus/ai-music-archive/index.html', compactFooter({
  title: 'AI 음악 제작·배포 아카이브',
  description: 'AI MUSIC PRODUCTION · DISTRIBUTION ARCHIVE',
  ai: 'AI 활용 안내: 음악·가사·영상 제작 과정에서 생성형 AI를 활용하며, 기획·가사 검토·선별·편집·공개와 최종 품질관리는 운영자가 수행합니다.'
}));
replaceFooter('nexus/education-hub/index.html', compactFooter({
  title: '교육 허브',
  description: 'PRACTICAL LEARNING HUB',
  ai: 'AI 활용 안내: 강좌 문안·예제·실습자료의 제작과 정리에 생성형 AI를 활용할 수 있으며, 강좌 구조·실습기준·검토·운영은 운영자가 관리합니다.'
}));

// Compact template: remove CSS-order compensation and make the HTML order canonical.
{
  const file = 'nexus/layer-compact.css';
  let css = read(file);
  const marker = '/* Compact document footer remains content-specific; return navigation is owned by portal-v2.css. */';
  const start = css.indexOf(marker);
  const end = css.indexOf('@media(max-width:760px)', start);
  if (start < 0 || end < 0) throw new Error('compact footer style block not found');
  const block = `/* Compact document footer: canonical v2 owner for compact pages. */\n.footer{margin-top:0;padding:18px 0 36px;border-top:1px solid rgba(255,255,255,.10);background:var(--footer-bg);color:var(--footer-text);font-family:Pretendard,"Noto Sans KR","Apple SD Gothic Neo",system-ui,-apple-system,sans-serif;letter-spacing:0;text-align:center}.footer>strong{display:block;color:#d7e1ea;font-size:13px;font-weight:600;line-height:1.5}.footer-description{margin:3px auto 0;color:var(--footer-text);font-size:11px;line-height:1.7}.footer-meta{display:flex;flex-direction:column;align-items:center;width:100%;max-width:920px;margin:13px auto 0;padding-top:13px;border-top:1px solid rgba(255,255,255,.07);text-align:center}.footer-meta::before{content:none!important;display:none!important}.footer-meta>p{margin:0 auto;color:var(--footer-text);font-size:12px;font-weight:400;line-height:1.7}.footer .ai-disclosure{max-width:920px;margin:6px auto 0;color:var(--footer-text);font-size:11.5px;line-height:1.7}.footer-meta>a{display:inline-block;margin-top:6px;color:var(--footer-link);font-size:11px;font-weight:600;line-height:1.7;text-decoration:none}.footer-meta a:not(:last-child){color:var(--footer-link)}\n`;
  css = css.slice(0, start) + block + css.slice(end);
  write(file, css);
}
for (const file of ['nexus/ai-legal-glossary/index.html','nexus/ai-music-archive/index.html','nexus/education-hub/index.html']) {
  write(file, read(file).replace(/\.\.\/layer-compact\.css\?v=[^"']+/g, '../layer-compact.css?v=20260823-footer-v2'));
}

// Living Law: move guidance out of the legal metadata footer and restore the canonical sequence.
{
  const file = 'nexus/living-law/index.html';
  const guidance = `<section class="legal-footer-guidance wrap" aria-label="생활법률 이용 안내"><p>생활법률 100선은 일반인이 일상에서 알아둘 법적 상식과 기본 대응절차를 이해하기 쉽게 정리한 참고자료이며, 개별 사건에 대한 법률자문이 아닙니다. 구체적인 계약·증거·금액·법정기한에 따라 적용되는 법과 결론이 달라질 수 있으므로 중요한 사건은 해당 분야 전문가 또는 공식기관의 최신 안내를 확인하세요.</p><nav aria-label="생활법률 관련 링크"><a href="https://www.law.go.kr/" target="_blank" rel="noopener noreferrer">최신 법령 확인 ↗</a><a href="../">YEHAVHA NEXUS</a></nav></section>`;
  const footer = `${guidance}\n<footer class="site-footer" data-footer-standard="v2"><div class="wrap footer-box"><strong>생활법률 100선</strong><p class="footer-description">PRACTICAL LIVING LAW · 100 ESSENTIALS</p><div class="footer-meta"><p class="business-meta">${BUSINESS}</p><p>${COPYRIGHT}</p><p>문의 <a href="mailto:kimbrighth@gmail.com">kimbrighth@gmail.com</a></p><p class="ai-disclosure">AI 활용 안내: 일부 생활법률 설명·요약·문안의 정리와 초안 작성에 생성형 AI를 활용하며, 법령·공식자료 확인과 최종 검토·편집은 운영자가 수행합니다.</p><a href="#top">맨 위로 이동 ↑</a></div></div></footer>`;
  replaceFooter(file, footer);
  write(file, read(file).replace('./style.css?v=20260815-3', './style.css?v=20260823-footer-v2'));
}
{
  const file = 'nexus/living-law/style.css';
  let css = read(file);
  const start = css.indexOf('.site-footer{padding:2px 0 32px}');
  const end = css.indexOf('.law-dialog{', start);
  if (start < 0 || end < 0) throw new Error('living-law footer style block not found');
  const block = `.legal-footer-guidance{margin-bottom:10px;padding:13px 15px;border:1px solid rgba(135,181,230,.10);border-radius:10px;background:rgba(7,18,37,.38);text-align:center}.legal-footer-guidance p{max-width:920px;margin:0 auto;color:#91a5b7;font-size:11.5px;line-height:1.65}.legal-footer-guidance nav{display:flex;justify-content:center;flex-wrap:wrap;gap:7px;margin-top:8px}.legal-footer-guidance a{color:#9ebbd6;text-decoration:none;font-size:11px;font-weight:650}.site-footer{padding:0 0 34px;background:#06111d;color:#8fa1b3;text-align:center}.footer-box{display:block;padding:16px 10px;border-top:1px solid rgba(255,255,255,.10);background:transparent;color:#8fa1b3;text-align:center}.footer-box>strong{display:block;color:#d7e1ea;font-size:13px;font-weight:600;line-height:1.5}.footer-description{margin:3px auto 0;color:#8fa1b3;font-size:11px;line-height:1.7}.footer-meta{display:flex;flex-direction:column;align-items:center;margin:12px auto 0;padding-top:12px;border-top:1px solid rgba(255,255,255,.07);text-align:center}.footer-meta p{margin:0 auto;color:#8fa1b3;font-size:12px;line-height:1.7}.footer-meta .ai-disclosure{max-width:920px;margin-top:6px;font-size:11.5px}.footer-meta a{display:inline-block;margin-top:6px;color:#a9bfd2;text-decoration:none;font-size:11px;font-weight:600;line-height:1.7}\n\n`;
  css = css.slice(0, start) + block + css.slice(end);
  write(file, css);
}

// TOEIC V2: replace the white card footer with the same centered legal metadata system.
replaceFooter('nexus/toeic-human-v2/index.html', `<footer class="site-footer" data-footer-standard="v2"><strong>심화 토익인간 V2</strong><p class="footer-description">ADVANCED TOEIC · TEPS · BOOK READING · 100 DAYS</p><div class="footer-meta"><p class="business-meta">${BUSINESS}</p><p>${COPYRIGHT}</p><p>문의 <a href="mailto:kimbrighth@gmail.com">kimbrighth@gmail.com</a></p><p class="ai-disclosure">AI 활용 안내: 일부 영어 본문과 학습문항은 생성형 AI를 활용하여 제작했으며, 전체 학습구조와 콘텐츠는 운영자가 직접 기획·검토·관리합니다. TOEIC·TEPS 공식 기출문제를 복제한 자료가 아닙니다.</p><a href="#top">맨 위로 이동 ↑</a></div></footer>`);
{
  const file = 'nexus/toeic-human-v2/index.html';
  write(file, read(file).replace('./style.css?v=20260815-v3', './style.css?v=20260823-footer-v2'));
}
{
  const file = 'nexus/toeic-human-v2/style.css';
  let css = read(file);
  const start = css.indexOf('.site-footer{padding:14px 16px');
  const end = css.indexOf('.toast{', start);
  if (start < 0 || end < 0) throw new Error('toeic footer style block not found');
  const block = `.site-footer{margin-top:8px;padding:16px 10px 28px;border:0;border-top:1px solid rgba(255,255,255,.10);border-radius:0;background:#06111d;color:#8fa1b3;box-shadow:none;text-align:center}.site-footer>strong{display:block;color:#d7e1ea;font-size:13px;font-weight:600;line-height:1.5}.site-footer>.footer-description{margin:3px auto 0;color:#8fa1b3;font-size:11px;line-height:1.7}.site-footer>.footer-meta{display:flex;flex-direction:column;align-items:center;margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,.07)}.footer-meta p{margin:0 auto;color:#8fa1b3;font-size:12px;line-height:1.7}.footer-meta .ai-disclosure{margin-top:6px;max-width:560px;font-size:11.5px}.footer-meta a{display:inline-block;margin-top:6px;color:#a9bfd2;font-size:11px;font-weight:600;text-decoration:none}\n`;
  css = css.slice(0, start) + block + css.slice(end);
  write(file, css);
}

// NEXUS UNIVERSITY: three pages shared one unstructured v1 footer.
replaceFooter('nexus/university/index.html', universityFooter({
  title: 'NEXUS UNIVERSITY',
  description: 'AI-Powered Self-Directed University Curriculum · 496 Courses · 5,952 Lessons',
  ai: 'AI 활용 안내: 일부 학습자료·문항·설명·구조화에 생성형 AI를 활용하며, 교육과정 설계·내용 검토·편집·품질관리는 운영자가 수행합니다.'
}));
replaceFooter('nexus/university/course.html', universityFooter({
  title: 'NEXUS UNIVERSITY',
  description: 'Course → Module → Lesson · Self-Directed Digital Learning',
  ai: 'AI 활용 안내: 일부 강의 설명·학습문항·연습자료의 생성과 구조화에 생성형 AI를 활용하며, 과목 설계·학술적 검토·편집·품질관리는 운영자가 수행합니다.'
}));
replaceFooter('nexus/university/quality-audit.html', universityFooter({
  title: 'NEXUS UNIVERSITY · Quality Audit Center',
  description: '496 Courses · 5,952 Lessons · Quality Assurance',
  ai: 'AI 활용 안내: 자동점검·분류·검수 후보 탐색에 생성형 AI와 자동화 도구를 활용할 수 있으나, 원자료 확인·검증상태 판정·최종 품질결정은 운영자가 수행합니다.'
}));
for (const file of ['nexus/university/index.html','nexus/university/course.html','nexus/university/quality-audit.html']) {
  write(file, read(file).replace(/\.\/university\.css\?v=[^"']+/g, './university.css?v=20260823-footer-v2'));
}
{
  const file = 'nexus/university/university.css';
  let css = read(file);
  const old = '.footer{margin-top:24px;padding:14px 0 20px;border-top:1px solid var(--line);color:#8da2b9;font-size:10.5px}.footer strong{color:#c8d7e7}';
  const next = '.university-footer{margin-top:18px;padding:16px 10px 28px;border-top:1px solid rgba(255,255,255,.10);background:#06111d;color:#8fa1b3;text-align:center}.university-footer>strong{display:block;color:#d7e1ea;font-size:13px;font-weight:600;line-height:1.5}.university-footer>.footer-description{margin:3px auto 0;color:#8fa1b3;font-size:11px;line-height:1.7}.university-footer-meta{display:flex;flex-direction:column;align-items:center;margin:12px auto 0;padding-top:12px;border-top:1px solid rgba(255,255,255,.07);text-align:center}.university-footer-meta p{margin:0 auto;color:#8fa1b3;font-size:12px;line-height:1.7}.university-footer-meta .ai-disclosure{max-width:920px;margin-top:6px;font-size:11.5px}.university-footer-meta a{display:inline-block;margin-top:6px;color:#a9bfd2;font-size:11px;font-weight:600;text-decoration:none}';
  if (!css.includes(old)) throw new Error('university footer style block not found');
  write(file, css.replace(old, next));
}

console.log(`Footer migration updated ${touched.length} file(s):`);
for (const file of touched) console.log(`- ${file}`);
