# YEHAVHA Nexus — GitHub 자동배포형

운영 주소: https://yehavha.com/

운영 구조 기준일: 2026-08-21

YEHAVHA Nexus는 전략정보·대학·웹앱·연구·출판·미디어·교육·기획 프로젝트의 공식 진입점을 한곳에 모아 관리하는 통합 포털입니다.

## 운영 원본

Cloudflare Pages는 이 저장소의 `nexus/` 디렉터리를 Nexus 운영 원본으로 사용합니다.

- `nexus/index.html` — 포털 화면 구조
- `nexus/portal-v2.css`, `nexus/nexus-standard.css`, `nexus/status.css` — 기본 포털 스타일 계층
- `nexus/portal-enhancements.css` — 통합검색·대표 진입점·최근 업데이트·신뢰 레이어·성숙도 표시·중간 화면 반응형 보강 전용 스타일
- `nexus/portal-v2.js` — 카테고리·프로젝트 렌더링, 상태 병합, 통합검색·대표 진입점·최근 업데이트·SEO·집계형 이용행동 연결
- `nexus/projects.json` — 카테고리·연구그룹·프로젝트 카드의 유일한 표시정보 원본
- `nexus/approved-manifests.json` — 자동 상태 추적이 허용된 매니페스트 경로의 유일한 승인 레지스트리
- 각 승인된 `nexus.project.json` — 프로젝트별 상태 추적·콘텐츠 집계 규칙과 필요한 경우 내용검토일·자료/법령 기준일의 소유 원본
- `nexus/project-status.json` — 최근 운영수정일·콘텐츠 수·운영상태·검토 기준일을 병합한 자동 상태 출력물
- `nexus/scripts/update-status.mjs` — 승인된 프로젝트 상태정보 갱신
- `nexus/scripts/audit-runtime.mjs` — Nexus 데이터·하위 콘텐츠 런타임 검증
- `nexus/scripts/audit-portal-enhancements.mjs` — 통합검색·검증일·측정계층·소유권 중복 검증
- `nexus/scripts/audit-live-urls.mjs` — 실제 배포 URL·JSON·API·리다이렉트 스모크 테스트
- `scripts/audit-repo-hygiene.mjs` — 구버전·고아 파일·과도한 권한·소유권 중복 검증
- `scripts/audit-web-architecture.mjs` — 내부링크·로컬자산·Footer·Copyright·삭제경로·프로젝트 모델 검증
- `nexus/functions/lib/metrics.js` — 개인정보·검색어 원문 없이 일자별 집계형 이용행동만 기록하는 유일한 측정 스키마·이벤트 소유 코드
- `nexus/functions/api/access.js` — 접속횟수와 집계형 측정 조회·기록 API
- `nexus/functions/go.js` — 승인된 프로젝트 URL 이동과 프로젝트 클릭 집계
- `nexus/assets/portal-bg.webp` — 포털 배경
- `nexus/_headers` — 캐시 제어

## 데이터 역할과 소유권

표시정보, 승인정보, 상태정보, 하위 프로젝트 데이터와 이용측정의 책임을 분리합니다.

1. `projects.json`은 프로젝트 제목·설명·URL·카테고리·연구그룹만 관리합니다.
2. `approved-manifests.json`은 상태 추적이 승인된 매니페스트 경로만 관리합니다.
3. 각 `nexus.project.json`은 프로젝트 ID, 상태 추적·콘텐츠 집계 규칙과 필요한 검토 기준일만 관리합니다.
4. `update-status.mjs`는 승인 레지스트리에 등록된 매니페스트를 읽어 `project-status.json`만 갱신합니다.
5. `portal-v2.js`는 `projects.json`을 먼저 읽고 동일 ID의 `project-status.json` 상태값만 병합합니다.
6. Nexus 통합검색은 별도의 검색용 프로젝트 목록을 만들지 않고 위 두 원본을 병합한 현재 런타임 데이터만 검색합니다.
7. 대표 진입점·최근 업데이트·성숙도·신뢰 레이어는 표시 로직이며 프로젝트 원본을 별도로 소유하지 않습니다.
8. 상태파일을 읽지 못하더라도 기본 프로젝트 카드와 링크는 `projects.json`만으로 표시됩니다.
9. 카드 정의나 승인 매니페스트 목록을 다른 스크립트·문서·generated 파일에 다시 복제하지 않습니다.
10. `metrics.js`는 검색어·IP·User-Agent·Referer 같은 개인 또는 원문 이용정보를 저장하지 않고 이벤트 종류·프로젝트 ID·일자별 합계만 기록합니다.
11. `/go` 프로젝트 이동은 일반 페이지 접속횟수에서 제외하여 페이지 접속과 프로젝트 클릭을 중복 집계하지 않습니다.
12. 진단 보고서·검증 산출물은 운영 원본으로 저장하지 않고 GitHub Actions artifact 또는 로컬 임시파일로만 생성합니다.
13. Copyright와 문의·AI 활용 안내는 실제 HTML Footer가 소유하며 CSS `::after` 같은 가상요소가 문구를 생성하지 않습니다.

`nexus/search-index.json`, `nexus/projects.search.json`, `nexus/projects.generated.json`처럼 프로젝트나 검색정보를 중복 소유하는 별도 생성 파일은 만들지 않습니다. `audit-portal-enhancements.mjs`가 이러한 파일의 재등장을 실패 처리합니다.

## 통합검색과 발견성

메인 포털의 통합검색은 현재 등록된 프로젝트·연구영역의 제목, 설명, 분류, 연구그룹, 콘텐츠 라벨을 검색합니다. 검색 결과는 기존 `/go` 이동 경로를 사용합니다.

첫 화면에는 전체 프로젝트를 동일한 중요도로 반복하지 않고 대표 연구·실용서비스·공개 아카이브 진입점을 별도로 제시합니다. 최근 업데이트 목록은 `project-status.json`의 `lastUpdated`를 정렬하여 생성하므로 별도의 최근목록 파일을 유지하지 않습니다.

검색어 원문은 서버에 전송하거나 저장하지 않습니다. 검색 기능 사용 여부와 검색결과 진입 횟수만 집계형 이벤트로 기록할 수 있습니다.

## 검토일과 기준일

`lastUpdated`는 Git 변경이 발생한 운영수정일입니다. 콘텐츠의 실제 검토 시점과 혼동하지 않습니다.

정확성 기준일이 중요한 프로젝트는 승인된 `nexus.project.json` 안의 `review` 객체가 다음 값을 소유합니다.

- `contentReviewedAt` — 본문 내용을 마지막으로 실질 검토한 날짜
- `baselineAt` — 법령·정책·자료의 기준 날짜
- `baselineLabel` — `법령기준`, `자료기준`처럼 기준의 의미를 표시하는 짧은 라벨

이 값은 `update-status.mjs`가 `project-status.json`으로 전달하며 포털 카드에서 운영수정일과 별도로 표시할 수 있습니다. 현재 생활법률 100선과 AI 동향 브리프부터 적용하며 실제 검토가 이루어진 경우에만 날짜를 갱신합니다.

## 승인된 자동관리 프로젝트

Nexus 상태갱신은 저장소 전체를 무차별 재귀 탐색하지 않습니다. `nexus/approved-manifests.json`에 등록된 경로만 승인된 자동관리 대상으로 읽습니다.

새 프로젝트는 먼저 `projects.json`에 카드 정의를 등록합니다. 자동 상태 추적이 필요한 경우에만 별도 `nexus.project.json`을 만들고 그 경로를 `approved-manifests.json`에 추가합니다. 상태 갱신 스크립트와 구조·런타임 감사 스크립트가 같은 레지스트리를 사용하므로 승인 목록을 각각 따로 유지하지 않습니다.

이 방식으로 구버전 폴더, 테스트 폴더, 잘못된 매니페스트가 포털 상태정보에 자동 편입되는 것을 차단합니다.

## 자동검증

`Web Architecture Audit`는 읽기 전용 권한으로 다음을 검사합니다.

- HTML 내부 링크와 로컬 자산 존재 여부
- Nexus 프로젝트 ID·카테고리·URL·리다이렉트 허용목록 일치
- 승인 레지스트리·매니페스트·상태파일 일치
- 통합검색이 `projects.json`·`project-status.json` 단일 원본을 그대로 소비하는지 여부
- 검색용 프로젝트 목록·generated 파일의 중복 생성 여부
- 내용검토일·기준일의 형식과 승인 매니페스트 소유권
- 집계형 측정이 공용 `metrics.js`를 사용하는지 여부
- 측정 코드에 IP·User-Agent·Referer·검색어 원문 수집 흔적이 없는지 여부
- `/go` 이동이 일반 접속횟수와 중복 집계되지 않는지 여부
- 통합검색·최근 업데이트·신뢰 레이어·구조화 데이터 생성 코드 존재 여부
- 구버전·generated·진단 산출물 재등장 여부
- 승인 목록의 중복 소유·하드코딩 재등장 여부
- Service Worker의 현재 런타임 자산 소유 여부
- 불필요한 GitHub Actions 쓰기 권한 여부
- 저장소 전체 JavaScript·MJS 구문과 JSON 파싱 가능 여부
- 삭제된 Nexus 프로젝트 경로·링크·포털 로직의 재등장 여부
- 표준 Copyright 문구·문의 mailto·AI 활용 안내의 명시적 HTML Footer 존재 여부
- CSS 가상요소가 Copyright 문구를 재생성하는지 여부
- 3분 쉼표 실제 콘텐츠 로드순서와 퀴즈 데이터
- Nexus 하위 데이터·본문 참조 무결성
- NEXUS UNIVERSITY 496개 과목·12개 Lesson·전공 교재 런타임 완전성
- 실제 운영 URL, `projects.json`, `project-status.json`, `/api/access`, `/go` 응답

하위 프로젝트의 별도 검증은 해당 프로젝트 데이터 규칙에 따라 수행하며, 검증 결과를 운영 원본 파일과 섞지 않습니다.

## 상태 기준

- 최근 수정 후 7일 이내: `최근 업데이트`
- 8~30일: `운영 중`
- 31일 이상: `안정 운영`

프로젝트별 기준은 각 매니페스트에서 조정할 수 있습니다.

메인 화면의 `최우선 정보`, `운영`, `연구 운영`, `아이디어` 표시는 프로젝트의 공개 성숙도를 빠르게 구분하기 위한 UI 분류이며 자동 상태의 `최근 업데이트/운영 중/안정 운영`과 역할이 다릅니다.

## 이용측정 원칙

Nexus 자체 측정은 개인 단위 분석보다 포털 개선에 필요한 최소 집계만 사용합니다.

- 페이지 접속횟수
- 프로젝트 이동 횟수
- 통합검색 사용 횟수
- 검색결과·대표 진입점·최근 업데이트 진입 횟수
- 링크 복사 횟수

집계 단위는 일자·이벤트·프로젝트 ID이며 검색어 내용, 방문자 IP, 브라우저 식별정보, Referer 원문은 저장하지 않습니다. 프로젝트 클릭은 기존 `/go` 경로에서 집계하고 `/go` 요청 자체는 일반 접속횟수에서 제외합니다.

## SEO 원칙

메인 포털은 기존 Open Graph·description 메타정보에 더해 canonical URL, robots 지시문, `WebSite`·`SearchAction`·등록 프로젝트 `hasPart` 구조화 데이터를 현재 `projects.json`에서 동적으로 생성합니다. SEO용 프로젝트 목록을 별도로 유지하지 않습니다.

개별 하위 프로젝트의 Article·Book·Course·WebApplication·ScholarlyArticle 구조화 데이터는 해당 하위 프로젝트가 자신의 콘텐츠 원본을 기준으로 관리합니다. 메인 포털이 하위 본문 메타데이터를 중복 소유하지 않습니다.

## GitHub Actions 권한 원칙

- 일반 감사·검증 워크플로: `contents: read`
- Nexus 상태 갱신 워크플로: `project-status.json` 변경이 필요하므로 제한적으로 `contents: write`
- TOEIC 마스터 어휘 빌드: canonical `master-lexicon-v2.json` 갱신에 한해 별도 write 권한 사용
- 진단용 워크플로는 결과를 저장소에 재커밋하지 않습니다.

`.github/workflows/refresh-nexus-status.yml`은 Nexus 상태 갱신만 담당하며 변경이 있을 때 `nexus/project-status.json`만 자동 커밋합니다.

## Cloudflare Pages

- Git repository: `yehavha2024-hash/yehavha-site`
- Production branch: `main`
- Framework preset: None
- Root directory: `nexus`
- Build output directory: `.`

운영 기준 주소는 `https://yehavha.com/`입니다.
