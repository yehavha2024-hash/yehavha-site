# YEHAVHA Nexus — GitHub 자동배포형

운영 주소: https://yehavha-nexus-hub.pages.dev/

YEHAVHA Nexus는 웹앱·연구·출판·미디어·교육 프로젝트의 공식 진입점을 한곳에 모아 관리하는 통합 포털입니다.

## 운영 원본

Cloudflare Pages는 이 저장소의 `nexus/` 디렉터리만 Nexus 운영 원본으로 사용합니다.

- `nexus/index.html`: 포털 화면 구조
- `nexus/portal-v2.css`: 공통 디자인
- `nexus/status.css`: 자동관리 상태 표시
- `nexus/portal-v2.js`: 카테고리·프로젝트 렌더링
- `nexus/projects.json`: 기본 프로젝트 기준 데이터
- `nexus/projects.generated.json`: GitHub 관리정보를 합친 실제 표시 데이터
- `nexus/project-status.json`: 최근 업데이트일·콘텐츠 수·운영상태
- `nexus/scripts/update-status.mjs`: 승인된 프로젝트만 상태정보 갱신
- `nexus/assets/portal-bg.webp`: 포털 배경
- `nexus/_headers`: 캐시 제어

## 승인된 자동관리 프로젝트

Nexus 자동갱신은 저장소 전체를 재귀 탐색하지 않습니다. 아래 다섯 개 매니페스트만 승인된 관리원본으로 읽습니다.

1. `nexus.project.json` — AI 법률연구소
2. `three-minute-break/nexus.project.json` — 3분 쉼표
3. `toeic-human-100/nexus.project.json` — 토익인간 100일 프로젝트
4. `legal-knowledge/nexus.project.json` — 법리·판례 연구
5. `ai-law-tech-foresight/nexus.project.json` — AI 법·기술 선제연구 아카이브

새 프로젝트를 Nexus 자동관리 대상으로 추가할 때에는 매니페스트 파일을 임의의 폴더에 만드는 방식이 아니라 `nexus/scripts/update-status.mjs`의 승인 목록에도 명시적으로 등록해야 합니다. 이 규칙으로 구버전 폴더나 잘못된 매니페스트가 포털에 자동 노출되는 것을 방지합니다.

## 데이터 생성 규칙

`projects.json`은 기본 카드와 카테고리의 기준 데이터입니다. `update-status.mjs`는 승인된 매니페스트에서 최근 수정일과 콘텐츠 수를 계산하여 `projects.generated.json`과 `project-status.json`을 갱신합니다.

검증 항목:

- 프로젝트 ID 중복 여부
- 카테고리 존재 여부
- 프로젝트 URL의 HTTP/HTTPS 형식
- 승인 매니페스트 누락 여부
- 콘텐츠 집계 규칙의 실행 가능 여부

`projects.generated.json`을 읽지 못할 경우 화면은 `projects.json`으로 안전하게 폴백합니다.

## 상태 기준

- 최근 수정 후 7일 이내: `최근 업데이트`
- 8~30일: `운영 중`
- 31일 이상: `안정 운영`

프로젝트별 기준은 각 매니페스트에서 조정할 수 있습니다.

## GitHub Actions

`.github/workflows/refresh-nexus-status.yml`은 Nexus 상태 갱신만 담당합니다. 다른 프로젝트의 학술자료 검증이나 콘텐츠 내보내기 작업과 분리하여, 하위 프로젝트의 별도 오류 때문에 Nexus 데이터 갱신이 멈추지 않도록 구성합니다.

실행 시점:

- 승인된 Nexus 관련 경로가 `main`에 변경될 때
- 매일 1회 정기 점검
- GitHub Actions에서 수동 실행할 때

변경이 있을 경우 `nexus/project-status.json`과 `nexus/projects.generated.json`만 자동 커밋합니다.

## Cloudflare Pages

- Git repository: `yehavha2024-hash/yehavha-site`
- Production branch: `main`
- Framework preset: None
- Root directory: `nexus`
- Build output directory: `.`

운영 기준 주소는 `https://yehavha-nexus-hub.pages.dev/`입니다.
