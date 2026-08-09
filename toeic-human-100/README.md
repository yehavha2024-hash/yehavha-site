# 토익인간 100일 프로젝트

GitHub에서 관리하는 100일 모바일 영어 학습 웹앱입니다. V2부터는 TOEIC을 단순 문제풀이 과목으로 다루지 않고, 긴 영어 본문을 매일 읽으면서 어휘·숙어·문법·문장구조를 문맥 속에서 반복해 익히고, 각 날짜 하단의 TEPS 독해 확장으로 추상어휘·논리·추론을 넓혀 영어 원서 독해까지 연결합니다.

## V2 핵심 구조

- DAY 1~100의 TOEIC 장문 분량을 동일 수준으로 유지
- 기준 약 1,500 words, 허용범위 1,350~1,650 words
- 완료 체크는 5개가 아니라 3개
  - 장문읽기
  - 해부·학습
  - 문제·복습
- TOEIC 핵심어휘·숙어·연어·문법·구문·질문유형을 장문 안에서 반복노출
- 각 날짜 TOEIC 본문 하단에 `TEPS READING EXTENSION` 배치
- TEPS 확장에서는 더 높은 추상도와 논리밀도의 독해, 고급어휘, 빈칸·문맥·주제·추론 훈련을 추가
- 문장 단위 해석을 넘어 문단 기능, 지칭관계, 논리표지, 전체 맥락을 추적
- Part 5·6·7 문제를 당일 TOEIC 본문과 직접 연결
- TOEIC·TEPS 공식 기출문장을 복제하지 않고 평가영역과 독해유형을 참고해 자체 제작

전체 설계기준은 `READING_PROGRAM_V2.md`에 있습니다.

## 운영 원본

실제 서비스 원본은 다음 파일과 자산입니다.

- `index.html` — 화면 구조
- `style.css` — 기존 공통 디자인
- `reading-v2.css` — 장문독해 V2 디자인
- `teps-extension-v2.css` — TEPS 확장 디자인
- `app-v2.js` — V2 3단계 학습·진행·음성·문제 상호작용
- `teps-extension-ui-v2.js` — TOEIC 3단계 화면에 TEPS 확장을 결합
- `reading-content-v2.js` — DAY 001 V2 장문
- `reading-content-v2-days02-04.js`, `reading-content-v2-days05-07.js`, `reading-content-v2-days08-10.js` — DAY 002~010 V2 장문
- `teps-extension-v2.js` — DAY 001~010 TEPS 독해 확장
- `reading-content-v2-length-patch.js`, `teps-extension-length-patch.js` — 고정 분량 규격 보정
- `content.js` — 기존 100일 × 5영역 데이터. V2 전환 중 호환용으로 유지
- `master-lexicon-v2.json` — TOEIC·일반영어·학술 확장 마스터 어휘
- `manifest.webmanifest`, `sw.js`, `icons/` — PWA 구성
- `images/` — 배경 이미지
- `nexus.project.json` — Nexus 상태 추적 매니페스트

## 현재 전환 상태

- DAY 001~010: TOEIC 장문 V2 + TEPS 독해 확장 적용 완료
- DAY 011~100: 기존 콘텐츠를 3단계 UI로 묶어 표시하며 V2 장문 + TEPS 확장으로 순차 교체
- 기존 브라우저 진행기록은 V2의 3단계 구조로 가능한 범위에서 자동 이관

## DAY 001~010 검증 기준

- TOEIC 장문: 각 DAY 1,350~1,650 words
- TEPS 확장: 각 DAY 최소 180 words
- TOEIC 장문 최소 8문단
- TEPS 확장 문제 최소 3문항
- 완료축 `read / analyze / apply` 3개 유지
- 어휘 노출은 TOEIC 본문·분석·문제와 TEPS 확장을 함께 계산

## 누적 어휘관리

마스터 어휘는 NGSL 1.2, TSL 1.2, NAWL 1.2를 통합해 관리합니다.

- 고유 headword: 4,786
- 활용·표면형: 13,428
- TOEIC 특화 headword: 1,250
- 학술·원서 확장 headword: 959

`scripts/audit-reading-coverage-v2.mjs`가 실제 100일 학습 콘텐츠를 스캔해 미등장 단어와 반복노출 횟수를 계산합니다. 100일 완성 시 마스터 필수항목이 누락되어 있으면 완료로 판정하지 않는 구조입니다.

## 검증

- `scripts/validate-reading-v2.mjs` — 기본 V2 구조검증
- `scripts/validate-reading-v2-expanded.mjs` — TOEIC 장문·TEPS 확장 분량 및 DAY 구조검증
- `scripts/audit-reading-coverage-v2.mjs` — 마스터 어휘 누적 커버리지·반복노출 검사
- `.github/workflows/toeic-reading-v2-validate.yml` — GitHub Actions 자동검증

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
