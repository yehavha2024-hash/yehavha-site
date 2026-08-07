# YEHAVHA Nexus — GitHub 자동배포형

운영 주소: https://yehavha-nexus-hub.pages.dev/

기존 YEHAVHA Nexus의 화면 디자인, 배경, 카테고리 구조와 카드 스타일을 유지하면서 배포 방식을 GitHub → Cloudflare Pages 자동배포 구조로 변경한 버전입니다.

## 핵심 구조

- `index.html`: 기존 화면 구조의 셸
- `portal-v2.css`: 기존 디자인 그대로 유지
- `assets/portal-bg.webp`: 기존 배경 이미지 그대로 유지
- `projects.json`: 넥서스에 표시할 카테고리와 프로젝트의 단일 데이터 원본
- `portal-v2.js`: `projects.json`을 읽어 카드와 카테고리를 자동 생성
- `_headers`: HTML과 프로젝트 데이터는 즉시 갱신되도록 캐시 제어

## 콘텐츠 수정 방법

메인 화면의 카드 내용은 `index.html`을 직접 수정하지 않고 `projects.json`만 수정합니다.
기존 프로젝트의 제목·설명·링크를 바꾸면 해당 값이 메인 화면에 자동 반영됩니다.
새 프로젝트를 추가할 때는 `projects` 배열에 객체 하나를 추가합니다.
새 카테고리가 필요하면 `categories` 배열에 카테고리를 추가하고 프로젝트의 `category` 값을 그 ID에 맞춥니다.

GitHub의 `main` 브랜치에 커밋하면 Cloudflare Pages Git 연동 프로젝트가 자동으로 새 배포를 생성합니다.

## Cloudflare Pages 설정

- Git repository: `yehavha2024-hash/yehavha-site`
- Production branch: `main`
- Framework preset: None
- Root directory: `nexus`
- Build output directory: `.`
- 현재 정상 배포 중인 Build command 설정은 그대로 유지

기존 Direct Upload 방식의 `yehavha-nexus` 프로젝트는 백업용으로 유지할 수 있으며, 신규 운영 기준 주소는 `https://yehavha-nexus-hub.pages.dev/`입니다.
