# YEHAVHA Nexus UI & Document Standard

Version: 2.0  
Updated: 2026-08-21

## 1. 목적

Nexus와 직접 운영하는 하위 페이지는 기능과 콘텐츠는 달라도 공통 인터페이스가 같은 시스템으로 보여야 합니다. 공통 UI를 페이지마다 다시 만들거나 보정 CSS·보정 JavaScript·인라인 스타일로 덮어쓰지 않습니다.

핵심 원칙은 **공통 외곽 1개 + 기능별 콘텐츠 1개**입니다.

- 공통 외곽 UI: 중앙 canonical owner가 한 번만 소유
- 기능별 UI: 해당 프로젝트의 canonical local owner가 한 번만 소유
- 새 페이지·새 연구노트·새 상세문서: 기존 두 계층을 상속하며 새로운 공통 규칙 파일을 만들지 않음

## 2. Nexus 공통 UI의 단일 소유자

메인 저장소의 Nexus 하위 페이지에서 다음 요소는 `nexus/portal-v2.css`가 유일하게 소유합니다.

- 기본 font family와 본문 기준 크기
- 공통 색상 token과 배경
- `.container` 기본 폭과 중앙정렬
- `← YEHAVHA NEXUS` 등 상위 복귀 링크
- 공통 Footer의 배경·정렬·간격·타이포그래피
- 사업자정보 고정 문자열
- 모바일에서의 공통 외곽 여백

하위 CSS는 위 선택자를 다시 정의하지 않습니다. 특히 `.container`, `.back-link`, `.nexus-link`, `.back`, `.footer`, `.footer-card`, `.footer-meta`, `.reader-site-footer`, `.research-footer`, `.research-footer-meta`를 콘텐츠 CSS가 재소유하지 않습니다.

## 3. 기능별 canonical owner

각 기능은 최대 하나의 로컬 스타일 소유자를 둡니다.

예시:

- 글·연구 아카이브: `nexus/articles/articles.css`
- 메인 포털 내부 계층: `nexus/nexus-standard.css`
- 개별 연구 프로젝트: 해당 프로젝트의 `styles.css` 또는 `project-standard.css` 중 명시된 canonical owner

로컬 owner는 해당 기능의 카드, 목차, 본문, 검색, 표, 학습 컴포넌트만 소유합니다. 공통 shell을 다시 선언하지 않습니다.

## 4. 로딩 계층 제한

Nexus 일반 하위 페이지의 기본 CSS 계층은 다음 두 개입니다.

1. `portal-v2.css` — 공통 shell
2. 기능별 canonical CSS — 콘텐츠

페이지별 날짜형 CSS, `fix.css`, `patch.css`, `override.css`, `mobile-flow.css`, 임시 contrast CSS를 세 번째·네 번째 레이어로 영구 추가하지 않습니다.

메인 포털처럼 상태 표시 등 독립 기능이 필요한 경우에만 명시적으로 추가 모듈을 허용합니다. 추가 모듈은 공통 shell이나 콘텐츠 typography를 덮지 않아야 합니다.

## 5. 공통 시각 규격

- 기본 배경: `#071225` 계열
- Panel: `rgba(8,18,38,.78)` 또는 `#0B1D33`
- Panel 강조: `#0D2948`
- 기본 글자: `#F2F6FF`
- 보조 글자: `#B8C9DF`
- 강조색: `#7AB8FF`
- 구분선: `rgba(255,255,255,.10)`
- 기본 서체: Pretendard → Noto Sans KR → Apple SD Gothic Neo → system sans-serif

페이지 전체를 흰색이나 별도 고유색으로 덮지 않습니다. 장식용 serif를 연구본문의 기본서체로 별도 지정하지 않습니다.

## 6. 너비·여백·셀 규격

- 포털·메인 최대폭: 약 1120–1160px
- 연구 상세본문: 약 850–860px
- 모바일 좌우 여백: 9–10px 이상
- 기본 간격: 4 / 8 / 12 / 16 / 24 / 32px 중심
- 카드 radius: 같은 층위에서 동일
- 의미 없는 `min-height` 또는 고정 높이 금지
- 내용이 짧은 메타 셀은 세로 카드로 늘리지 않고 가능한 범위에서 병렬 배치
- 3개 단순 상태값은 모바일에서도 원칙적으로 `3열 × 1행` 유지

## 7. 타이포그래피

공통 기준:

- 기본 본문: 15px, line-height 1.72–1.78
- 모바일 본문: 15px
- H1: `clamp(34px,4.8vw,52px)` 범위
- H2: 20–28px, 문서 성격에 따라 조절
- H3·카드 제목: 16–18px
- 카드 설명: 13.5–14.5px
- 보조 문구: 12–13px
- 메타·태그: 10.5–11.5px
- 목차 항목: 11–12px
- Footer: COPYRIGHT_STANDARD.md 고정 규격

본문이 많다는 이유로 16–18px로 별도 확대하거나, 셀이 많다는 이유로 9px 이하의 실질 본문을 사용하지 않습니다.

## 8. 글·연구 아카이브 표준

글 아카이브는 다음 두 파일만 UI를 소유합니다.

- `../portal-v2.css`: 공통 shell
- `articles.css`: 아카이브·독자·전문 법률글 콘텐츠

`index.html`, `article.html`, 정적 전문글은 별도 `<style>` 블록을 만들지 않습니다. 새로운 연구글이 추가돼도 별도의 CSS 파일을 만들지 않고 기존 `articles.css`의 문서 유형 안에 들어갑니다.

아카이브 현황 `주제 / 아카이브 글 / 업데이트`는 3열 1행 compact cell을 유지합니다.

동적 일반글과 정적 전문 법률글은 같은 reading scale을 사용합니다.

- 본문 15px
- 본문 폭 약 860px
- H2 약 19–21px
- H3 약 16px
- 목차 11–12px
- 출처·주의문 12.5–14px

## 9. 연구문서 표준

연구노트·전문연구·상세문서는 구조가 달라도 다음 외곽 규격은 동일합니다.

1. Nexus/상위 목록 복귀 링크
2. 문서 분류·제목·요약·메타
3. 목차
4. 본문
5. 출처/참고자료
6. 공통 Footer

목차 번호는 실제 본문 번호와 1:1 대응합니다. `<ol>` 번호를 숨기면 HTML 명시번호 또는 같은 canonical CSS의 counter를 사용하며, 번호 없는 목차를 만들지 않습니다.

## 10. Footer

Footer는 `COPYRIGHT_STANDARD.md`를 따릅니다.

- Nexus 메인과 동일한 중앙정렬 단일열
- 프로젝트명
- 짧은 설명
- 사업자정보
- Copyright
- 문의
- AI 활용 안내
- 맨 위로 이동

모바일에서도 좌측정렬·2열로 변경하지 않습니다. Footer의 글자크기와 순서를 콘텐츠 CSS가 다시 지정하지 않습니다.

## 11. 캐시 및 배포

Nexus HTML·핵심 CSS·하위 페이지는 `_headers`의 `no-cache, no-store, must-revalidate` 정책을 우선합니다.

- 단순 스타일 수정 때마다 새 CSS 파일을 만들지 않습니다.
- 쿼리 버전은 배포 식별에만 사용하며 파일명 자체에 날짜를 계속 누적하지 않습니다.
- 구형 브라우저 대응을 이유로 이전 shell CSS를 production 파일에 장기간 병존시키지 않습니다.
- 구형 호환 규칙이 필요하면 기간과 제거조건을 명시합니다.

## 12. 금지 패턴

- `*-YYYYMMDD.css`, `*-fix.css`, `*-patch.css`, `*-override.css`를 영구 production layer로 추가
- 페이지별 `<style>`로 canonical CSS 덮기
- JavaScript에서 `<style>` 생성
- JavaScript가 Footer 전체를 다시 생성
- 동일 법적 고지문을 여러 JS/CSS/HTML에서 각각 소유
- 하위 콘텐츠 CSS에서 공통 `.container`·복귀링크·Footer 재정의
- 오류를 해결하기 위해 새 보정파일을 먼저 추가하는 방식

오류가 생기면 새 레이어를 만들기 전에 현재 소유자가 누구인지 확인하고 **기존 canonical owner를 수정**합니다.

## 13. 유지보수 프로세스

새 기능 또는 문서 추가 순서:

1. 기존 document type 확인
2. 기존 canonical owner 확인
3. 데이터/HTML 콘텐츠 추가
4. 기존 CSS class 재사용
5. 필요한 경우 canonical local CSS에만 규칙 추가
6. style ownership audit 실행
7. 중복 파일·미참조 patch 확인
8. production 반영

새로운 CSS·JS·MD 제어문서는 기존 구조로 해결할 수 없다는 근거가 있을 때만 추가합니다. 추가하는 경우 기존 owner와 역할이 겹치지 않아야 합니다.
