# YEHAVHA Nexus — GitHub 자동배포형

운영 주소: https://yehavha-nexus-hub.pages.dev/

운영 구조 기준일: 2026-08-17

YEHAVHA Nexus는 웹앱·연구·출판·미디어·AI 실무·교육·기획 프로젝트의 공식 진입점을 한곳에 모아 관리하는 통합 포털입니다.

## 운영 원본

Cloudflare Pages는 이 저장소의 `nexus/` 디렉터리를 Nexus 운영 원본으로 사용합니다.

- `nexus/index.html` — 포털 화면 구조
- `nexus/portal-v2.css`, `nexus/nexus-standard.css`, `nexus/status.css` — 현재 포털 스타일 계층
- `nexus/portal-v2.js` — 카테고리·프로젝트 렌더링 및 상태 병합
- `nexus/projects.json` — 카테고리·연구그룹·프로젝트 카드의 유일한 표시정보 원본
- `nexus/approved-manifests.json` — 자동 상태 추적이 허용된 매니페스트 경로의 유일한 승인 레지스트리
- `nexus/project-status.json` — 최근 업데이트일·콘텐츠 수·운영상태의 유일한 상태 원본
- `nexus/scripts/update-status.mjs` — 승인된 프로젝트 상태정보 갱신
- `nexus/scripts/audit-runtime.mjs` — Nexus 데이터·하위 콘텐츠 런타임 검증
- `nexus/scripts/audit-live-urls.mjs` — 실제 배포 URL·JSON·API·리다이렉트 스모크 테스트
- `scripts/audit-repo-hygiene.mjs` — 구버전·고아 파일·과도한 권한·소유권 중복 검증
- `nexus/assets/portal-bg.webp` — 포털 배경
- `nexus/_headers` — 캐시 제어

## 데이터 역할과 소유권

표시정보, 승인정보, 상태정보, 하위 프로젝트 데이터의 책임을 분리합니다.

1. `projects.json`은 프로젝트 제목·설명·URL·카테고리·연구그룹만 관리합니다.
2. `approved-manifests.json`은 상태 추적이 승인된 매니페스트 경로만 관리합니다.
3. 각 `nexus.project.json`은 프로젝트 ID와 상태 추적·콘텐츠 집계 규칙만 관리합니다.
4. `update-status.mjs`는 승인 레지스트리에 등록된 매니페스트를 읽어 `project-status.json`만 갱신합니다.
5. `portal-v2.js`는 `projects.json`을 먼저 읽고 동일 ID의 `project-status.json` 상태값만 병합합니다.
6. 상태파일을 읽지 못하더라도 기본 프로젝트 카드와 링크는 `projects.json`만으로 표시됩니다.
7. 카드 정의나 승인 매니페스트 목록을 다른 스크립트·문서·generated 파일에 다시 복제하지 않습니다.
8. 진단 보고서·검증 산출물은 운영 원본으로 저장하지 않고 GitHub Actions artifact 또는 로컬 임시파일로만 생성합니다.

## 승인된 자동관리 프로젝트

Nexus 상태갱신은 저장소 전체를 무차별 재귀 탐색하지 않습니다. `nexus/approved-manifests.json`에 등록된 경로만 승인된 자동관리 대상으로 읽습니다.

새 프로젝트는 먼저 `projects.json`에 카드 정의를 등록합니다. 자동 상태 추적이 필요한 경우에만 별도 `nexus.project.json`을 만들고 그 경로를 `approved-manifests.json`에 추가합니다. 상태 갱신 스크립트와 구조·런타임 감사 스크립트가 같은 레지스트리를 사용하므로 승인 목록을 각각 따로 유지하지 않습니다.

이 방식으로 구버전 폴더, 테스트 폴더, 잘못된 매니페스트가 포털 상태정보에 자동 편입되는 것을 차단합니다.

## 자동검증

`Web Architecture Audit`는 읽기 전용 권한으로 다음을 검사합니다.

- HTML 내부 링크와 로컬 자산 존재 여부
- Nexus 프로젝트 ID·카테고리·URL·리다이렉트 허용목록 일치
- 승인 레지스트리·매니페스트·상태파일 일치
- 구버전·generated·진단 산출물 재등장 여부
- 승인 목록의 중복 소유·하드코딩 재등장 여부
- Service Worker의 현재 런타임 자산 소유 여부
- 불필요한 GitHub Actions 쓰기 권한 여부
- 3분 쉼표 실제 콘텐츠 로드순서와 퀴즈 데이터
- Nexus 하위 데이터·본문 참조 무결성
- 실제 운영 URL, `projects.json`, `project-status.json`, `/api/access`, `/go` 응답

하위 프로젝트의 별도 검증은 해당 프로젝트 데이터 규칙에 따라 수행하며, 검증 결과를 운영 원본 파일과 섞지 않습니다.

## 상태 기준

- 최근 수정 후 7일 이내: `최근 업데이트`
- 8~30일: `운영 중`
- 31일 이상: `안정 운영`

프로젝트별 기준은 각 매니페스트에서 조정할 수 있습니다.

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

운영 기준 주소는 `https://yehavha-nexus-hub.pages.dev/`입니다.
