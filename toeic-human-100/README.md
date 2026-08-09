# 토익인간 100일 프로젝트

GitHub에서 관리하는 100일 모바일 영어 학습 웹앱입니다. V2부터는 TOEIC을 단순 문제풀이 과목으로 다루지 않고, 긴 영어 본문을 매일 읽으면서 어휘·숙어·문법·문장구조를 문맥 속에서 반복해 익혀 영어 원서 독해까지 연결하는 장문독해 프로젝트로 재구성합니다.

## V2 핵심 구조

- DAY 1~100의 장문 분량을 동일 수준으로 유지
- 기준 약 1,500 words, 허용범위 1,350~1,650 words
- 완료 체크는 5개가 아니라 3개
  - 장문읽기
  - 해부·학습
  - 문제·복습
- TOEIC 핵심어휘·숙어·연어·문법·구문·질문유형을 장문 안에서 반복노출
- 문장 단위 해석을 넘어 문단 기능, 지칭관계, 논리표지, 전체 맥락을 추적
- Part 5·6·7 문제를 당일 본문과 직접 연결
- 실제 공식 기출문장 복제가 아니라 출제요소를 분석해 자체 제작한 학습자료 사용

전체 설계기준은 `READING_PROGRAM_V2.md`에 있습니다.

## 운영 원본

실제 서비스 원본은 다음 파일과 자산입니다.

- `index.html` — 화면 구조
- `style.css` — 기존 공통 디자인
- `reading-v2.css` — 장문독해 V2 디자인
- `app-v2.js` — V2 3단계 학습·진행·음성·문제 상호작용
- `reading-content-v2.js` — V2 장문 콘텐츠 원본
- `content.js` — 기존 100일 × 5영역 데이터. V2 전환 중 호환용으로 유지
- `manifest.webmanifest`, `sw.js`, `icons/` — PWA 구성
- `images/` — 배경 이미지
- `nexus.project.json` — Nexus 상태 추적 매니페스트

## 현재 전환 상태

- DAY 001: V2 완성형 장문 샘플 적용
- DAY 002~100: 기존 콘텐츠를 3단계 UI로 묶어 표시하며 V2 장문 콘텐츠로 순차 교체
- 기존 브라우저 진행기록은 V2의 3단계 구조로 가능한 범위에서 자동 이관

## DAY 001 V2 구성

- 약 1,600단어 수준의 장문
- 10개 문단
- 핵심어휘 40개
- 숙어·연어·고정결합 18개
- 핵심 문법 8개
- 문장구조 패턴 8개
- 긴 문장 집중해부 6개
- Part 5 4문항
- Part 6 2문항
- Part 7 8문항
- 최종 재독 및 자기점검

## 검증

`scripts/validate-reading-v2.mjs`는 다음을 검사하도록 설계되어 있습니다.

- 100일 누락·중복
- 하루 본문 분량
- 최소 문단 수
- 완료축 3개 유지
- 어휘·문법·문장구조·질문유형 커버리지
- 실전문제 해설 및 본문근거
- 장르 분포

기존 `scripts/export-content.mjs`는 V1 `content.js` 검증용으로 유지합니다.

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
