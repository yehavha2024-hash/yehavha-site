# YEHAVHA Nexus — GitHub 자동배포형

운영 주소: https://yehavha-nexus-hub.pages.dev/

기존 YEHAVHA Nexus의 화면 디자인, 배경, 카테고리 구조와 카드 스타일을 유지하면서 배포 방식을 GitHub → Cloudflare Pages 자동배포 구조로 변경한 버전입니다.

## 핵심 구조

- `index.html`: 기존 화면 구조의 셸
- `portal-v2.css`: 기존 디자인 그대로 유지
- `status.css`: GitHub 자동관리 프로젝트의 상태정보 표시
- `assets/portal-bg.webp`: 기존 배경 이미지 그대로 유지
- `projects.json`: 카테고리와 외부·기본 프로젝트의 기준 데이터
- `projects.generated.json`: GitHub 자동관리 정보를 합쳐 생성되는 실제 표시 데이터
- `project-status.json`: GitHub 관리 프로젝트의 최근 업데이트일·콘텐츠 수·상태
- `portal-v2.js`: 생성 데이터를 읽어 카드와 카테고리를 자동 렌더링
- `scripts/update-status.mjs`: 프로젝트 매니페스트를 탐색하고 상태·콘텐츠 수를 계산
- `.github/workflows/refresh-nexus-status.yml`: GitHub 변경 및 일일 점검을 자동 실행
- `_headers`: HTML과 프로젝트 데이터의 캐시 제어

## 자동관리 프로젝트 등록 규칙

GitHub 저장소에서 넥서스가 자동관리해야 하는 프로젝트에는 해당 프로젝트 위치에 `nexus.project.json` 파일을 둡니다.

이 매니페스트에는 다음 정보를 정의합니다.

- 넥서스 카드의 카테고리·제목·설명·URL
- 최근 수정일을 추적할 GitHub 경로
- `최근 업데이트 / 운영 중 / 안정 운영` 상태 전환 기준
- 콘텐츠 수를 계산하는 방법과 표시 단위

현재 자동관리 대상:

- 저장소 루트 `nexus.project.json` → AI 법률연구소
- `legal-knowledge/nexus.project.json` → 법리·판례 연구

앞으로 새 GitHub 프로젝트에 `nexus.project.json`을 추가하면 `projects.json`을 직접 편집하지 않아도 새 카드가 자동으로 `projects.generated.json`에 추가됩니다.

## 상태 자동 갱신

GitHub Actions는 다음 경우 `node nexus/scripts/update-status.mjs`를 실행합니다.

1. `main` 브랜치에 실제 프로젝트 변경이 들어온 경우
2. 매일 1회 정기 점검
3. GitHub Actions 화면에서 수동 실행한 경우

상태 기준 기본값:

- 최근 수정 후 7일 이내: `최근 업데이트`
- 8~30일: `운영 중`
- 31일 이상: `안정 운영`

각 프로젝트 매니페스트에서 기간을 별도로 변경할 수 있습니다.

상태 생성 결과가 달라진 경우 GitHub Actions가 `project-status.json`과 `projects.generated.json`만 자동 커밋합니다. 이 자동 커밋은 Cloudflare Pages의 Git 연동에 의해 다시 배포되므로 Cloudflare에 ZIP을 수동 업로드할 필요가 없습니다.

## 콘텐츠 수 자동 계산

자동화 스크립트는 프로젝트별 매니페스트의 `tracking.count` 규칙을 사용합니다.

현재 예시:

- AI 법률연구소: 메인 페이지의 핵심 연구영역 수를 자동 집계
- 법리·판례 연구: 기본 연구데이터 파일들을 실행하여 `window.LEGAL_KNOWLEDGE`의 실제 연구노트 수를 자동 집계

따라서 법리·판례 연구에 연구노트가 추가되면 다음 GitHub 커밋 후 넥서스 카드의 `연구노트 N` 값도 자동으로 변경됩니다.

## 화면 표시

GitHub 자동관리 프로젝트에는 기존 디자인을 유지하면서 다음 정보만 추가 표시합니다.

- 최근 업데이트 상태
- 콘텐츠 수
- 마지막 업데이트 날짜

GitHub에서 직접 관리하지 않는 외부 전자책·유튜브·기타 서비스 카드는 기존 디자인 그대로 유지합니다.

## Cloudflare Pages 설정

- Git repository: `yehavha2024-hash/yehavha-site`
- Production branch: `main`
- Framework preset: None
- Root directory: `nexus`
- Build output directory: `.`
- 현재 정상 배포 중인 Build command 설정은 그대로 유지

기존 Direct Upload 방식의 `yehavha-nexus` 프로젝트는 백업용으로 유지할 수 있으며, 신규 운영 기준 주소는 `https://yehavha-nexus-hub.pages.dev/`입니다.
