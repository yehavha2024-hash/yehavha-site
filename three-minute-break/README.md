# 3분 쉼표

GitHub에서 관리하는 모바일 중심 일일 순환 웹앱입니다.

## 운영 원본

실제 서비스 원본은 다음 파일과 자산입니다.

- `index.html` — 화면 구조
- `style.css` — 디자인
- `app.js` — 명언·생활영어·성경 핵심 의미·미니퀴즈 총 200개 콘텐츠와 앱 동작
- `manifest.webmanifest`, `sw.js`, `icons/` — PWA 구성
- `images/` — 카테고리별 배경 이미지
- `nexus.project.json` — Nexus 상태 추적 매니페스트

콘텐츠 원본은 `app.js` 하나입니다. 별도의 CSV나 검증보고서를 운영 원본으로 사용하지 않습니다.

## 콘텐츠 구성

- 명언 50개
- 생활영어 50개
- 성경 핵심 의미 50개
- 미니퀴즈 50개
- 총 200개 콘텐츠
- 한국시간(Asia/Seoul) 기준 날짜별 자동 순환
- 카테고리별 전용 배경 이미지 4장

## 검증·내보내기

`scripts/export-content.mjs`는 필요할 때 `app.js`를 검증하고 CSV 카탈로그와 검증보고서를 로컬에서 생성하는 보조 도구입니다. 이 결과물은 실행 원본이 아니며 `.gitignore`로 Git 재등록을 차단합니다.

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
