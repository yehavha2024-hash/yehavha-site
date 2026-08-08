# YEHAVHA Project Repository

YEHAVHA Nexus와 연결 프로젝트를 GitHub에서 관리하는 운영 저장소입니다.

## 운영 기준

이 저장소의 루트에는 별도의 웹사이트를 배포하지 않습니다. 각 프로젝트는 지정된 하위 디렉터리를 운영 원본으로 사용하며, Nexus는 `nexus/` 디렉터리만 공식 포털 원본으로 사용합니다.

운영 포털: https://yehavha-nexus-hub.pages.dev/

## 활성 프로젝트 디렉터리

- `nexus/` — YEHAVHA Nexus 통합 포털
- `three-minute-break/` — 3분 쉼표
- `toeic-human-100/` — 토익인간 100일 프로젝트
- `legal-knowledge/` — 법리·판례 연구
- `ai-law-tech-foresight/` — AI 법·기술 선제연구 아카이브

AI 법률연구소의 실제 운영 원본은 이 저장소에 복제하지 않습니다.

- 운영 저장소: `yehavha2024-hash/ai-law-research-institute`
- 운영 브랜치: `master`
- 운영 주소: https://yehavha-ai-law-institute.pages.dev/
- 이 저장소의 루트 `nexus.project.json`은 Nexus가 외부 AI 법률연구소의 업데이트 상태를 추적하기 위한 관리 매니페스트입니다.

## Nexus 프로젝트 등록 규칙

Nexus 자동갱신은 임의의 `nexus.project.json`을 재귀적으로 탐색하지 않습니다. 다음 승인 매니페스트만 읽습니다.

1. `nexus.project.json`
2. `three-minute-break/nexus.project.json`
3. `toeic-human-100/nexus.project.json`
4. `legal-knowledge/nexus.project.json`
5. `ai-law-tech-foresight/nexus.project.json`

새 프로젝트를 추가할 경우 `nexus/scripts/update-status.mjs`의 승인 목록에도 명시적으로 등록해야 합니다. 이 규칙은 과거 폴더, 테스트 폴더 또는 잘못된 매니페스트가 Nexus 카드로 다시 나타나는 것을 방지합니다.

## 파일 관리 원칙

- 루트에 프로젝트의 `index.html`, `style.css`, `script.js` 복사본을 두지 않습니다.
- 과거 배포본, ZIP 백업본, 테스트용 스캐폴드와 중복 소스는 운영 저장소에 남기지 않습니다.
- 프로젝트별 실제 운영에 필요한 소스와 검증·데이터 파일만 유지합니다.
- URL과 배포 경로는 `projects.json` 및 승인된 `nexus.project.json`을 기준으로 관리합니다.
- 자동생성 파일은 수동으로 다른 위치에 복제하지 않습니다.

## Nexus 자동갱신

`.github/workflows/refresh-nexus-status.yml`은 Nexus 상태정보 생성만 담당합니다. `nexus/scripts/update-status.mjs`가 승인된 프로젝트를 검증하고 다음 파일을 갱신합니다.

- `nexus/projects.generated.json`
- `nexus/project-status.json`

다른 프로젝트의 별도 검증 실패가 Nexus 상태 갱신을 막지 않도록 자동화 역할을 분리했습니다.

Copyright © 이명훈 2026. All rights reserved.
