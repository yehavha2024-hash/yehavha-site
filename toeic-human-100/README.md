# 토익인간 100일 프로젝트

GitHub에서 관리하는 100일 모바일 토익 학습 웹앱입니다.

## 운영 원본

실제 서비스 원본은 다음 파일과 자산입니다.

- `index.html` — 화면 구조
- `style.css` — 디자인
- `app.js` — 학습 진행·기록·음성·문제 상호작용
- `content.js` — 100일 × 5개 영역, 총 500개 학습카드의 단일 데이터 원본
- `manifest.webmanifest`, `sw.js`, `icons/` — PWA 구성
- `images/` — 배경 이미지
- `nexus.project.json` — Nexus 상태 추적 매니페스트

서비스는 `content.js`를 직접 읽습니다. `content.json`, CSV 카탈로그와 검증보고서는 실행 원본이 아닙니다.

## 콘텐츠 구성

- 핵심어휘 100개
- 숙어·연어 100개
- 문장암기 100개
- 문법함정 100개
- 실전문제 100개
- 100일 × 5개 영역 = 총 500개 학습카드
- 첫 접속일을 DAY 1로 저장하고 한국 날짜 기준으로 자동 진행
- 학습완료·완료일·오답문제 기록을 브라우저에 저장
- 브라우저 영어 TTS를 이용한 발음·문장 듣기

실전문제는 TOEIC의 일반적인 출제 형식과 업무 영어 문맥을 반영한 자체 제작 문항이며 ETS 또는 YBM의 공식 기출문제를 복제한 자료가 아닙니다.

## 검증·내보내기

`scripts/export-content.mjs`는 필요할 때 `content.js`의 100일 누락·중복·실전문제 정답·해설을 검증하고 JSON·CSV·검증보고서를 로컬에서 생성하는 보조 도구입니다. 이 결과물은 실행 원본이 아니며 `.gitignore`로 Git 재등록을 차단합니다.

## GitHub → Cloudflare Pages

- Repository: `yehavha2024-hash/yehavha-site`
- Production branch: `main`
- Root directory: `toeic-human-100`
- Framework preset: `None`
- Build command: `exit 0`
- Build output directory: `.`
- 운영 주소: https://yehavha-toeicman.pages.dev/

## 통합 정보

- YEHAVHA Nexus: https://yehavha-nexus-hub.pages.dev/
- 문의: kimbrighth@gmail.com

Copyright © 이명훈 2026. All rights reserved.
