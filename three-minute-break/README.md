# 3분 쉼표

GitHub에서 관리하는 모바일 중심 일일 순환 웹앱입니다.

## 운영 원본

실제 서비스는 `index.html`에 선언된 순서대로 콘텐츠 계층을 합성합니다.

- `index.html` — 화면 구조와 실제 로드 순서의 단일 기준
- `style.css`, `nexus-shell.css`, `legal-quiz.css` — 화면 스타일
- `app.js` — 기본 콘텐츠와 앱 동작
- `legal-philosophy-quotes.js` — 명언 카테고리를 법철학 명언으로 교체
- `legal-quizzes.js` — 미니퀴즈 카테고리를 법률 퀴즈로 교체
- `content-expansion-20260814.js` — 네 카테고리의 현재 확장 콘텐츠 추가
- `manifest.webmanifest`, `sw.js`, `icons/` — PWA 구성
- `images/` — 카테고리별 배경 이미지
- `nexus.project.json` — Nexus 상태 추적 매니페스트

따라서 `app.js`만을 전체 콘텐츠 원본으로 간주하지 않습니다. 화면에 실제로 제공되는 콘텐츠는 `index.html`의 로드 순서로 결정되며, 검증도 같은 순서를 사용합니다.

## 콘텐츠 구성

- 명언
- 생활영어
- 성경 핵심 의미
- 미니퀴즈
- 한국시간(Asia/Seoul) 기준 날짜별 자동 순환
- 카테고리별 전용 배경 이미지 4장

카테고리별 실제 개수는 고정 숫자를 문서에 중복 저장하지 않고 `scripts/export-content.mjs`가 현재 런타임을 직접 실행하여 계산합니다. 이 방식으로 콘텐츠를 추가·교체해도 README 숫자가 오래된 상태로 남는 문제를 방지합니다.

## 검증·내보내기

`scripts/export-content.mjs`는 다음을 수행합니다.

- `index.html`의 실제 스크립트 로드 순서 확인
- 기본 콘텐츠와 교체·확장 콘텐츠를 같은 VM에서 합성
- 현재 카테고리별 콘텐츠 수 계산
- 제목 중복 검사
- 법률 퀴즈 보기·정답 인덱스·해설 검증
- Asia/Seoul 날짜 계산 확인
- 필요 시 CSV 카탈로그와 검증보고서 생성

`CONTENT_CATALOG.csv`와 `VALIDATION_REPORT.md`는 실행 원본이 아닌 진단 산출물이며 `.gitignore`로 Git 재등록을 차단합니다.

## GitHub → Cloudflare Pages

- Repository: `yehavha2024-hash/yehavha-site`
- Production branch: `main`
- Root directory: `three-minute-break`
- Framework preset: `None`
- Build command: `exit 0`
- Build output directory: `.`
- 운영 주소: https://yehavha-3min-rest.pages.dev/

## 통합 정보

- YEHAVHA Nexus: https://yehavha-nexus-hub.pages.dev/
- 문의: kimbrighth@gmail.com

Copyright © 이명훈 2026. All rights reserved.
