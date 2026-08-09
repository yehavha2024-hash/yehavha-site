# 토익인간 100일 프로젝트

GitHub에서 관리하는 100일 모바일 영어 학습 웹앱입니다. V2는 TOEIC을 단순 문제풀이 과목으로 다루지 않고, 긴 영어 본문을 매일 끝까지 읽으면서 어휘·숙어·문법·문장구조를 문맥 속에서 반복해 익히고, 각 날짜 하단의 TEPS 독해 확장으로 추상어휘·논리·추론을 넓혀 영어 원서 독해까지 연결합니다.

## V2 완성 상태

- DAY 001~100 TOEIC 장문 V2 구성 완료
- DAY 001~100 TEPS 독해 확장 구성 완료
- 완료축은 `장문읽기 / 해부·학습 / 문제·복습` 3개
- DAY 001~010은 개별 제작 장문 원본을 사용
- DAY 011~100은 100일 장르·주제 지도와 마스터 어휘 DB를 사용하는 결정론적 콘텐츠 빌더로 구성
- DAY 011~100 생성 장문은 최종 정규화 후 1,446~1,579 words
- TEPS 생성 확장은 205~223 words
- 전체 DAY는 TOEIC 장문 1,350~1,650 words 규격을 통과
- 기존 브라우저 진행기록은 V2 3단계 구조로 가능한 범위에서 자동 이관

## 학습 구조

1. `장문읽기`
   - 약 1,500단어 영어를 먼저 끝까지 읽음
   - 모르는 단어 때문에 중단하지 않고 주어·본동사·논리표지·문단기능을 유지
   - 같은 날짜 하단에 TEPS 독해 확장을 추가하여 추상어휘와 논리독해로 확장
2. `해부·학습`
   - 핵심어휘
   - 숙어·collocation·고정결합
   - 문법
   - 긴 문장구조
   - 핵심 문장 해체
   - TEPS 고급어휘·논리
3. `문제·복습`
   - TOEIC Part 5
   - TOEIC Part 6
   - TOEIC Part 7
   - TEPS 빈칸·문맥·주제·추론
   - 최종 재독

## 100일 장르 확장

전반부는 이메일·공지·광고·은행·회계·출장·보험·IT·배송·인사·시설·교통 등 TOEIC 실무장르를 폭넓게 다룹니다. 중반부에는 과학기술·환경·에너지·건강·교육·시장·계약·정책·개인정보·컴플라이언스 등 일반 비문학으로 확장하고, 후반부에는 설명문·비교에세이·원인결과·역사·과학·경제·법정책·AI·사회분석·논증문·원서형 챕터 및 TOEIC 복합문서 모의세트까지 연결합니다.

전체 장르·주제 지도는 `READING_100_DAY_MAP.md`에 있습니다.

## 마스터 어휘와 커버리지

마스터 어휘는 NGSL 1.2, TSL 1.2, NAWL 1.2를 통합해 관리합니다.

- 고유 headword: 4,786
- 활용·표면형: 13,428
- TOEIC 특화 headword: 1,250
- 학술·원서 확장 headword: 959

최종 자동감사 결과:

- 전체 등장 headword: 4,786 / 4,786 = 100%
- 전체 미등장 headword: 0
- DAY 080까지 미등장 headword: 0
- 최종 최소 반복기준 미달: 0
- 2회 이상 노출: 4,786
- 3회 이상 노출: 4,713
- 4회 이상 노출: 3,522
- 8회 이상 노출: 1,128

역할별 최종기준:

- TOEIC-specific: 최소 4회
- general-core: 최소 3회
- academic-book-extension: 최소 2회

각 역할군은 최종 감사에서 100% 커버리지를 통과했습니다.

## 커버리지 구현 원칙

마스터 전체를 단순 숨은 데이터로 계산하지 않습니다. DAY 011~100 장문에는 해당 날짜의 주제 본문과 함께 `TOEIC vocabulary`, `general nonfiction vocabulary`, `TEPS and book-reading vocabulary`의 controlled lexical bridge가 실제 학습 텍스트로 노출됩니다. 핵심 TOEIC 어휘와 주요 표현은 별도 어휘·문법·문제 해설에 집중하고, 폭넓은 일반·학술어휘는 장문을 포기하지 않고 문맥 속에서 견디고 재인식하는 훈련층으로 사용합니다.

따라서 4,786개 전수 커버리지는 모든 단어가 90개의 서로 다른 독립 예문으로 상세 해설되었다는 의미가 아니라, 100일 전체 학습 화면에서 마스터 어휘가 계획된 횟수만큼 실제 노출되고 핵심영역은 반복 해설·문제·문맥훈련으로 강화된다는 의미입니다.

## 주요 파일

- `index.html` — 화면 구조 및 전체 V2 로드 순서
- `style.css`, `reading-v2.css`, `teps-extension-v2.css` — 디자인
- `app-v2.js` — 3단계 학습·진행·음성·문제 상호작용
- `teps-extension-ui-v2.js` — TOEIC 3단계 화면과 TEPS 확장 결합
- `reading-content-v2.js` — DAY 001
- `reading-content-v2-days02-04.js`, `reading-content-v2-days05-07.js`, `reading-content-v2-days08-10.js` — DAY 002~010
- `reading-content-v2-days11-100-builder.js` — DAY 011~100 결정론적 콘텐츠 빌더
- `reading-content-v2-generated-compact-patch.js` — 생성 장문 1,350~1,650 words 정규화
- `reading-content-v2-ready-rerender.js` — 마스터 어휘 로드 후 UI 재렌더링
- `teps-extension-v2.js` — DAY 001~010 TEPS 확장
- `master-lexicon-v2.json` — 통합 마스터 어휘
- `coverage-policy-v2.json` — 전면노출·반복기준
- `content.js` — 기존 V1 데이터, 호환·기록이관용 유지
- `manifest.webmanifest`, `sw.js`, `icons/` — PWA 및 오프라인 캐시

## 자동검증

- `scripts/validate-reading-v2.mjs` — 기본 V2 구조검증
- `scripts/validate-reading-v2-expanded.mjs` — DAY 001~100 TOEIC 장문·TEPS 분량 및 구조검증
- `scripts/audit-reading-coverage-v2.mjs` — 4,786개 마스터 어휘의 DAY 080 전면노출 및 최종 반복기준 검사
- `scripts/plan-coverage-correction-v2.mjs` — 10일 단위 커버리지 정책과 상태 확인
- `.github/workflows/toeic-reading-v2-validate.yml` — GitHub Actions 자동검증

최종 검증에서는 문법검사, 100일 분량검사, TEPS 구조검사, 마스터 커버리지, 반복노출 기준이 모두 통과해야 성공으로 판정합니다.

## 저작권 원칙

TOEIC·TEPS 공식 기출문장을 대량 복제하지 않습니다. 시험의 일반적인 평가영역·독해유형·문서형식을 학습 목적으로 참고하고, 본문과 문항은 자체 제작·생성한 학습자료를 사용합니다.

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
