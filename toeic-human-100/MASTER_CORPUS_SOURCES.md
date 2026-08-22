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

## 4. 고등학교·수능 코퍼스 필수어휘 1,000 보강층

사용자 제공 분석자료 `고등학생 필수 어휘 1000 (빈도순)`을 고등학교 영어와 수능형 비문학 독해를 위한 별도 참고층으로 추가한다. 제공 파일명은 수능 20개년도 분석자료임을 나타내며, 자료 본문은 영어 지문 코퍼스 약 20만 단어를 분석하고 CEFR B1 이상 어휘 가운데 초·중학 기초어휘와 구체 명사를 제외했다고 설명한다.

- 원자료 규모: 1,000개 어휘
- 데이터 구조: 순위 · 단어 · 코퍼스 빈도 · 한국어 뜻
- 빈도 데이터: `high-school-csat-1000.csv`
- 뜻 데이터: `high-school-csat-1000-meanings.csv`
- 프로젝트 역할: 고등학교·수능 비문학에서 반복되는 추상어휘·학술어휘·논리어휘의 우선순위 참고
- 활용 방식: 기존 마스터 어휘와 겹치는 단어의 우선 학습·재노출·TEPS/원서 확장 판단에 빈도 신호로 활용
- 비강제 원칙: 이 1,000개를 100일 본문에 인위적으로 전부 삽입하지 않음
- 비대체 원칙: NGSL·TSL·NAWL 기반 `master-lexicon-v2.json` 4,786개를 대체하거나 마스터 개수를 임의로 변경하지 않음
- 원자료 보존: 제공자료의 표제어·빈도·한국어 뜻은 우선 그대로 보존하고, 철자·표제어 정규화·뜻 검수는 별도 검증 단계에서 수행

이 보강층은 TOEIC 공식 자료가 아니라 고등학교·수능 독해 어휘의 빈도 참고자료다. 따라서 TOEIC 특화어휘 여부와 수능 빈도는 서로 다른 신호로 관리한다.

## 5. TOEIC 공식 공개자료

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

## 6. 마스터 어휘 확장 규칙

`master-lexicon-v2.json`은 NGSL + TSL + NAWL의 합집합을 자동 생성한다.

그 위에 별도 supplement 또는 reference layer를 추가한다.

1. TOEIC 공식 샘플에서 master에 없는 유효 어휘
2. 향후 합법적으로 확보한 공식 TOEIC 학습자료에서 발견되는 OOV
3. 영어 원서 독해를 위해 반복적으로 필요한 일반 비문학·논리 어휘
4. 고등학교·수능 코퍼스 필수어휘 1,000의 빈도·우선순위 신호
5. 숙어·구동사·collocation은 headword와 별도 항목으로 관리

수능 코퍼스 보강층은 우선순위 참고자료이므로 기존 마스터에 없는 단어를 자동으로 핵심 활성어휘에 편입하지 않는다. 편입이 필요한 단어는 원문 빈도, 현재 마스터와의 중복 여부, 학습가치, 문맥 적합성을 별도로 검토한다.

## 7. 완성 판정

100일 콘텐츠가 완성됐다고 판정하려면 다음이 모두 충족되어야 한다.

- master lexicon의 목표 어휘가 최소 노출횟수를 충족
- TOEIC supplement OOV 미배치 0
- 핵심 숙어·collocation 미배치 0
- 필수 문법 미배치 0
- 필수 긴 문장구조 미배치 0
- Part 5·6·7 질문유형 미배치 0
- A급 항목의 반복노출 기준 충족
- 100일 장문 총 분량·문단 수 기준 충족
- 고등학교·수능 어휘 보강층은 별도 교집합·미포함·우선순위 감사를 수행하되 1,000개 전수 본문 삽입을 완성조건으로 삼지 않음

## Attribution

- Browne, C., Culligan, B., & Phillips, J. New General Service List.
- Browne, C. & Culligan, B. TOEIC Service List.
- Browne, C., Culligan, B., & Phillips, J. New Academic Word List.

위 NGSL Project 목록은 각 원 출처의 CC BY-SA 4.0 조건에 따라 출처를 명시해 사용한다.
