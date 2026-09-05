# YEHAVHA Project Repository

YEHAVHA Nexus와 연결 프로젝트를 GitHub에서 관리하는 운영 저장소입니다.

## 운영 기준

이 저장소의 루트에는 별도의 웹사이트를 배포하지 않습니다. 각 프로젝트는 지정된 하위 디렉터리를 운영 원본으로 사용하며, Nexus는 `nexus/` 디렉터리만 공식 포털 원본으로 사용합니다.

운영 포털: https://yehavha.com/

## 활성 프로젝트 디렉터리

- `nexus/` — YEHAVHA Nexus 통합 포털 및 법학 학술연구 트랙
- `three-minute-break/` — 3분 쉼표
- `toeic-human-100/` — 토익인간 100일 프로젝트
- `legal-knowledge/` — 법리·판례 연구
- `legal-knowledge/ai-literature/` — 인공지능 법학 연구문헌 아카이브
- `ai-law-tech-foresight/` — AI 법·기술 선제연구 아카이브
- `legal-philosophy/` — 법철학·기본권 연구

AI 법률연구소의 실제 운영 원본은 이 저장소에 복제하지 않습니다.

- 운영 저장소: `yehavha2024-hash/ai-law-research-institute`
- 운영 브랜치: `master`
- 운영 주소: https://yehavha-ai-law-institute.pages.dev/
- 이 저장소의 루트 `nexus.project.json`은 Nexus가 외부 AI 법률연구소의 업데이트 상태를 추적하기 위한 관리 매니페스트입니다.

## Nexus 데이터 역할

Nexus의 프로젝트 정보는 역할별로 한 곳에서만 관리합니다.

- `nexus/projects.json`: 카테고리, 연구그룹, 카드 제목·설명·URL의 유일한 운영 원본
- `nexus/approved-manifests.json`: 자동 상태 추적이 허용된 `nexus.project.json` 경로의 유일한 승인 레지스트리
- 각 `nexus.project.json`: 해당 프로젝트의 상태 추적 경로·집계 규칙만 정의
- `nexus/project-status.json`: 자동 계산된 최근 업데이트일·콘텐츠 수·운영상태만 저장

카드 정의나 승인 매니페스트 목록을 다른 스크립트·문서·생성 파일에 다시 복제하지 않습니다.

## Nexus 프로젝트 등록 규칙

Nexus 자동갱신은 임의의 `nexus.project.json`을 재귀적으로 탐색하지 않습니다. `nexus/approved-manifests.json`에 명시된 경로만 승인된 상태 추적 대상으로 읽습니다.

새 프로젝트를 추가할 때는 먼저 `nexus/projects.json`에 카드 정의를 등록합니다. 자동 상태 추적이 필요한 경우에만 해당 프로젝트의 `nexus.project.json`을 만들고 그 경로를 `nexus/approved-manifests.json`에 추가합니다. `nexus/scripts/update-status.mjs`와 관련 감사 스크립트는 동일한 승인 레지스트리를 사용하므로 별도 승인 목록을 다시 수정하지 않습니다.

이 구조는 과거 폴더, 테스트 폴더 또는 잘못된 매니페스트가 Nexus 카드나 상태정보로 다시 나타나는 것을 차단합니다.

## 파일 관리 원칙

- 루트에 프로젝트의 `index.html`, `style.css`, `script.js` 복사본을 두지 않습니다.
- 과거 배포본, ZIP 백업본, 테스트용 스캐폴드와 중복 소스는 운영 저장소에 남기지 않습니다.
- 프로젝트별 실제 운영에 필요한 소스와 검증·데이터 파일만 유지합니다.
- URL과 카드 표시는 `nexus/projects.json`을 기준으로 관리합니다.
- 승인 대상 목록은 `nexus/approved-manifests.json`만 관리합니다.
- 매니페스트는 표시정보를 가지지 않고 상태 추적에 필요한 정보만 가집니다.
- 자동 상태 갱신은 `nexus/project-status.json`만 변경합니다.

## Nexus 자동갱신

`.github/workflows/refresh-nexus-status.yml`은 Nexus 상태정보 갱신만 담당합니다. `nexus/scripts/update-status.mjs`가 승인 레지스트리에 등록된 프로젝트를 검증하고 `nexus/project-status.json`만 갱신합니다.

일반 감사 워크플로는 읽기 권한만 사용하며, 다른 프로젝트의 별도 검증 실패가 Nexus 상태 갱신 역할과 섞이지 않도록 자동화 책임을 분리합니다.

Copyright © 이명훈 2026. All rights reserved.
