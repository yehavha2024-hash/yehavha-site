# 토익인간 100일 프로젝트

GitHub에서 관리하는 100일 모바일 영어 학습 웹앱입니다. TOEIC을 단순 문제풀이 과목으로 다루지 않고, 매일 감당 가능한 분량의 영어 본문을 끝까지 읽으면서 어휘·숙어·문법·문장구조를 분리 학습하고 TEPS 고급 독해와 영어 원서 독해까지 확장합니다.

## V3 학습 설계

- DAY 001~100 TOEIC 집중독해 구성
- DAY 001~100 TEPS 독해 확장 구성
- 본문 목표: 약 700~850 words
- 완료축: `장문읽기 / 해부·학습 / 문제·복습`
- 기존 4,786개 마스터 어휘 DB는 삭제하지 않고 선별·감사·확장학습용 원본 풀로 유지
- 핵심 활성어휘 목표: 약 2,520개
- 숙어·연어: 하루 최소 6개
- 문법: 하루 최소 3개
- 기존 브라우저 진행기록은 가능한 범위에서 그대로 유지

## 학습 구조

1. `장문읽기`
   - 약 700~850단어를 먼저 끝까지 읽음
   - 모르는 단어 때문에 중단하지 않고 주어·본동사·논리표지·문단기능을 유지
   - 마스터 어휘를 채우기 위한 인위적 어휘목록 문장과 반복문은 제거
   - 같은 날짜 하단의 TEPS 독해 확장으로 추상어휘와 논리독해를 확장
2. `해부·학습`
   - TOEIC 핵심 활성어휘와 일반 비문학 어휘
   - 숙어·collocation·구동사·고정결합
   - 문법과 긴 문장구조
   - 핵심 문장 해체
   - TEPS 고급어휘·논리
3. `문제·복습`
   - TOEIC Part 5·6·7
   - TEPS 빈칸·문맥·주제·추론
   - 오답과 취약 어휘 재확인
   - 최종 재독

## 마스터 어휘와 커버리지

마스터 어휘는 NGSL 1.2, TSL 1.2, NAWL 1.2를 통합해 관리합니다.

- 고유 headword: 4,786
- 활용·표면형: 13,428
- TOEIC 특화 headword: 1,250
- 학술·원서 확장 headword: 959

이전 설계는 4,786개 전수를 본문에 계획된 횟수만큼 실제 노출하기 위해 controlled lexical bridge와 반복 문장을 사용했습니다. 이 방식은 어휘 커버리지는 높았지만 본문이 약 1,500단어까지 길어지고 실제 독해 흐름이 무거워지는 문제가 있었습니다.

현재 설계는 독해량과 어휘량을 분리합니다.

- 마스터 4,786개: 전체 선별·감사·확장학습 풀
- 핵심 활성어휘 약 2,520개: 100일 동안 명시적으로 학습하는 우선 어휘
- DAY 011~100: 하루 신규 28개 중심, DAY 012부터 핵심어휘 2개 추가 재노출
- 선별 우선순위: `toeic-specific → general-core → academic-book-extension`
- TOEIC-specific 1,250개는 핵심 활성학습에 우선 포함
- 활성어휘 밖의 단어는 TEPS 확장·문제해설·재독·후속 확장학습에 활용

따라서 이제 `4,786개를 본문에 모두 집어넣는 것`을 학습 성공조건으로 사용하지 않습니다. 본문은 읽기 훈련, 어휘목록은 명시적 어휘학습이라는 서로 다른 기능을 담당합니다.

## 100일 장르 확장

전반부는 이메일·공지·광고·은행·회계·출장·보험·IT·배송·인사·시설·교통 등 TOEIC 실무장르를 폭넓게 다룹니다. 중반부에는 과학기술·환경·에너지·건강·교육·시장·계약·정책·개인정보·컴플라이언스로 확장하고, 후반부에는 설명문·비교에세이·원인결과·역사·과학·경제·법정책·AI·사회분석·논증문·원서형 챕터와 TOEIC 복합문서까지 연결합니다.

전체 장르·주제 지도는 `READING_100_DAY_MAP.md`에 있습니다.

## 주요 파일

- `index.html` — 화면 구조 및 V3 안내·로드 순서
- `app-v2.js` — 학습·진행·음성·문제 상호작용
- `reading-content-v2.js` — DAY 001
- `reading-content-v2-days02-04.js`, `reading-content-v2-days05-07.js`, `reading-content-v2-days08-10.js` — DAY 002~010
- `reading-content-v2-length-patch.js` — DAY 001~010 본문 700~850단어 정규화 및 숙어 보강
- `reading-content-v2-days11-100-builder.js` — DAY 011~100 장르·주제 기반 콘텐츠 빌더
- `reading-content-v2-generated-compact-patch.js` — DAY 011~100 본문 축약, lexical bridge 제거, 활성어휘 재배분
- `teps-extension-v2.js`, `teps-extension-length-patch.js` — TEPS 확장
- `master-lexicon-v2.json` — 4,786개 통합 마스터 어휘
- `coverage-policy-v2.json` — 짧은 독해·활성어휘·숙어·문법 커버리지 정책

## 자동검증

- `scripts/validate-reading-v2-expanded.mjs` — 100일 본문 700~850단어, 어휘·숙어·문법 및 TEPS 구조검증
- `scripts/audit-reading-coverage-v2.mjs` — 4,786개 원본 풀과 약 2,520개 핵심 활성어휘를 분리하여 감사

검증 기준도 과거의 `본문 1,350~1,650단어 + 4,786개 본문 전수노출`에서 `본문 가독성 + 핵심 활성어휘 + 숙어·문법 분리학습` 기준으로 변경합니다.

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
