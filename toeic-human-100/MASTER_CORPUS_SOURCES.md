# TOEIC HUMAN V2 — Master Corpus Sources

## 목적

V2는 `기출단어 몇 개`라는 임의 숫자를 사용하지 않고, 공개적으로 검증 가능한 코퍼스 기반 어휘목록과 TOEIC 공식 공개자료를 결합해 마스터 커버리지를 관리한다.

ETS는 역대 TOEIC에 출제된 모든 어휘를 하나의 공식 완전목록으로 공개하지 않는다. 따라서 프로젝트에서 말하는 `TOEIC 마스터 어휘 전체`는 아래 공개·검증 가능한 기준목록과 지속적으로 발견되는 TOEIC 공식 샘플/OOV 보충목록의 합집합을 뜻한다.

## 1. NGSL 1.2

- New General Service List 1.2
- 일반 영어 핵심 기반
- 2,809개 headword 규모
- 프로젝트 역할: 모든 장문에 필요한 일반 고빈도 영어 기반
- License: CC BY-SA 4.0
- Source: https://www.newgeneralservicelist.com/new-general-service-list

## 2. TSL 1.2

- TOEIC Service List 1.2
- TOEIC 특화 어휘층
- 1,250개 규모
- NGSL과 결합 시 제작자 코퍼스 기준 최신 TOEIC 자료 약 98.5% lexical coverage 제시
- 프로젝트 역할: TOEIC에서 일반영어보다 상대적으로 특화되는 업무·시험 어휘 보강
- License: CC BY-SA 4.0
- Source: https://www.newgeneralservicelist.com/toeic-service-list

## 3. NAWL 1.2

- New Academic Word List 1.2
- 957개 학술영어 어휘
- 프로젝트 역할: TOEIC 점수를 넘어 영어 원서·비문학·학술적 설명문을 읽기 위한 확장층
- License: CC BY-SA 4.0
- Source: https://www.newgeneralservicelist.com/new-academic-word-list

## 4. TOEIC 공식 공개자료

우선순위는 ETS와 공식 TOEIC Program/IIBC의 공개 샘플·시험형식 자료다.

- ETS TOEIC Test Preparation Materials
  - Examinee Handbook
  - Listening & Reading Sample Tests
  - Official Learning and Preparation Course 안내
- IIBC 공식 TOEIC L&R Test Format
- IIBC 공식 Part 5·6·7 Sample Questions

Part 7 공식 설명은 magazine/newspaper article, e-mail, instant message 등 다양한 문서와 single/multiple passages를 사용한다고 명시한다. V2의 장르 배치는 이를 기준으로 확장한다.

공식 문제의 원문을 대량 복제하지 않는다. 공개 샘플에서는 다음 정보만 추출·활용한다.

- 문서 장르
- 문제유형
- 문법·어휘 출제축
- 고유명사를 제외한 OOV 후보
- 질문 패턴
- 정보 연결 방식

실제 학습본문과 문제는 독립적으로 새로 작성한다.

## 5. 마스터 어휘 확장 규칙

`master-lexicon-v2.json`은 NGSL + TSL + NAWL의 합집합을 자동 생성한다.

그 위에 별도 supplement를 추가한다.

1. TOEIC 공식 샘플에서 master에 없는 유효 어휘
2. 향후 합법적으로 확보한 공식 TOEIC 학습자료에서 발견되는 OOV
3. 영어 원서 독해를 위해 반복적으로 필요한 일반 비문학·논리 어휘
4. 숙어·구동사·collocation은 headword와 별도 항목으로 관리

## 6. 완성 판정

100일 콘텐츠가 완성됐다고 판정하려면 다음이 모두 충족되어야 한다.

- master lexicon의 목표 어휘가 최소 노출횟수를 충족
- TOEIC supplement OOV 미배치 0
- 핵심 숙어·collocation 미배치 0
- 필수 문법 미배치 0
- 필수 긴 문장구조 미배치 0
- Part 5·6·7 질문유형 미배치 0
- A급 항목의 반복노출 기준 충족
- 100일 장문 총 분량·문단 수 기준 충족

## Attribution

- Browne, C., Culligan, B., & Phillips, J. New General Service List.
- Browne, C. & Culligan, B. TOEIC Service List.
- Browne, C., Culligan, B., & Phillips, J. New Academic Word List.

위 NGSL Project 목록은 각 원 출처의 CC BY-SA 4.0 조건에 따라 출처를 명시해 사용한다.
