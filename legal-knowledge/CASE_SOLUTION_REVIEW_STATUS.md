# 사례형 답안 수동검토 현황

기준일: 2026-08-07

## 운영 원칙

질문 1개를 추가하면 최소한 대응하는 법리적 해결안 1개를 동시에 추가한다.

자동 생성 논증은 누락 방지를 위한 최저 품질선이며, 주요 판례·AI 책임 항목은 `쟁점의 정리 → 규범 → 포섭 → 증거·증명책임 → 반론 → 결론`의 개별 맞춤형 해설로 교체한다.

판례형 사례변형은 원판결의 결정적 사실과 핵심법리를 먼저 확인하고, 변경된 사실이 판례의 ratio에 어떤 영향을 주는지를 논증한다. 신설 AI 법제처럼 직접 판례가 없는 분야에는 존재하지 않는 판례를 만들지 않는다.

## 1차 수동검토 완료

- 권한을 넘은 표현대리
- AI 기기·소프트웨어 결함과 제조물책임
- AI 손해의 과실·인과관계와 다수주체 책임귀속의 일반 사례변형
- 자동화된 결정에 대한 거부·설명·재처리 권리

## 2차 수동검토 완료 — 원문검증 판례 7개

1. 관습상 법정지상권 — `civil-superficies`
2. 이사의 선관주의·충실의무와 경영판단 — `commercial-director-duty`
3. 고의와 미필적 고의 — `criminal-dolus-eventualis`
4. 선택발명의 신규성·진보성 — `ip-selected-invention`
5. 진보성 판단과 사후적 고찰 금지 — `ip-inventive-step`
6. 상표 유사 판단 — `ip-trademark-similarity`
7. 디자인 유사 판단 — `ip-design-similarity`

각 판례형의 기존 사례변형은 판결의 결정적 사실을 변경한 뒤 원판결 법리가 변경사실에 어떻게 적용되는지를 개별적으로 논증하였다.

## 2차 수동검토 완료 — AI 책임 우선군

### 다중에이전트·Agentic AI 책임

`ai-civil-tort-allocation` 고난도 사례:
- 안전패치 제공 후 운영자의 업데이트 비활성화
- 기초모델·에이전트 오케스트레이터·센서·최종서비스의 다중주체 사고
- 핵심 사고로그 삭제와 증명책임·입증방해

다중에이전트 사고는 `통제가능성 → 주의의무 → 위반 → 결과기여 → 로그·증거 → 공동책임·구상` 순으로 판단한다.

### 자율주행 책임

`ai-auto-liability-autonomous` 일반·고난도 사례:
- 운전전환요구 직후 운전자 미반응
- 지도 업데이트 오류와 센서 오류의 복합원인
- OTA 업데이트 후 동일 유형 사고 반복
- 지도서버·센서·원격관제의 동시 실패
- 현실적으로 대응 불가능한 짧은 제어권 전환시간
- 개인정보를 이유로 한 사고로그 조기 삭제와 증거보존 충돌

피해자에 대한 외부적 운행자·보험 책임과 제조사·소프트웨어·지도·센서·관제 사업자 사이 최종 책임·구상을 분리한다.

### 의료 AI 책임

- `ai-digital-medical-products`
- `ai-medical-professional-duty`

제품안전·병원 운영·의료인의 독립적 임상판단·인과관계를 분리한다.

## 3차 수동검토 완료 — 우선 AI 법제

### 의료기기 규제 + 실제 의료사고 복합사례

`ai-medical-device-law`의 기존 사례 3개를 수동답안으로 교체하고 고난도 복합사례 3개를 문제와 해설을 동시에 추가하였다.

- 병원의 무단 재학습 + AI 오진 + 의료인의 독립판단 실패
- 제조사의 보안취약점 고지지연 + 병원의 패치지연 + 사이버공격
- 승인 환자군 밖 반복사용 + 성능저하 신호 무시 + 제조사의 사후경고 실패

### AI 저작권·AI 보조발명

- `ai-copyright-training-output`
- `ai-patent-inventorship`

학습행위와 출력침해를 분리하고 특허에서는 AI 사용 여부가 아니라 청구항별 인간의 실질적 창작기여를 중심으로 판단한다.

### 공공기관 자동결정·고영향 AI 기본권

- `ai-constitutional-framework`
- `ai-basic-high-impact`
- `ai-public-sector-impact-assessment`

헌법상 기본권 심사, AI기본법상 고영향 분류, 공공분야 영향평가의 시행시점과 중복조정 구조를 구별한다. 공공분야 영향평가 관련 미래 시행 규율은 시행 전 현행법처럼 서술하지 않는다.

### 플랫폼·신용평가·소비자 기만

- `ai-credit-automated-evaluation`
- `ai-consumer-basic-rights`
- `ai-ecommerce-deception`
- `ai-advertising-disclosure`
- `ai-competition-platform`

추천·신용평가·가짜후기·AI 광고·알고리즘 경쟁제한을 적용법·사실확정·반대법익·증거·조건부 결론까지 포함해 수동 논증하였다.

## 4차 수동검토 완료 — 민사·상사·민사소송·집행·보전

파일: `data-variation-solutions-manual-round4-civil.js`

6개 연구항목의 일반 사례 24개와 고난도 사례 12개, 총 36개 답안을 수동화하였다.

- `civil-mistake`
- `civil-adverse-possession`
- `civil-contract-termination`
- `civil-creditor-revocation`
- `civil-procedure-res-judicata`
- `civil-enforcement-provisional`

착오의 동기·위험배분, 자주점유 전환, 동시이행과 해제, 사해행위 공동담보, 기판력 기준시·상계, 가압류 보전필요성·과잉보전까지 사례별로 결론을 제시한다.

## 5차 수동검토 완료 — 헌법·행정법 일반

파일: `data-variation-solutions-manual-round5-public.js`

5개 연구항목의 일반 사례 20개와 고난도 사례 10개, 총 30개 답안을 수동화하였다.

- `public-proportionality`
- `public-equality`
- `public-rule-of-law`
- `public-admin-litigation`
- `public-state-liability`

과잉금지, 실질적 평등, 법률유보·위임한계, AI 평가의 처분성, 자동복지결정과 국가배상 등을 포함한다.

## 6차 수동검토 완료 — 형법·형사소송법 일반

파일: `data-variation-solutions-manual-round6-criminal.js`

5개 연구항목의 일반 사례 20개와 고난도 사례 10개, 총 30개 답안을 수동화하였다.

- `criminal-co-principal`
- `criminal-self-defense`
- `criminal-fraud`
- `criminal-illegal-evidence`
- `criminal-hearsay`

다중 AI 에이전트의 인간 실행지배, 보안 AI 오인방어, AI 사기챗봇, 클라우드 전자정보 압수수색, AI 요약 의료기록의 전문증거 문제까지 포함한다.

## 7차 수동검토 완료 — 지식재산법 일반

파일: `data-variation-solutions-manual-round7-ip.js`

5개 연구항목의 일반 사례 20개와 고난도 사례 10개, 총 30개 답안을 수동화하였다.

- `ip-equivalents`
- `ip-novelty`
- `ip-fair-use`
- `ip-copyright-originality`
- `ip-unfair-competition`

균등론·출원경과금반언, 단일 선행기술 신규성, AI 학습 공정이용, 인간-AI 복합창작의 보호범위, 데이터베이스·성과물 무단이용을 포함한다.

## 8차 수동검토 완료 — 조세·등기·공탁 등 전문법

파일: `data-variation-solutions-manual-round8-special.js`

7개 연구항목의 일반 사례 24개와 고난도 사례 14개, 총 38개 답안을 수동화하였다.

- `special-tax-legality`
- `special-tax-substance`
- `special-tax-obligation`
- `special-tax-appeal`
- `special-real-estate-registry`
- `special-performance-deposit`
- `special-commercial-registry`

AI 토큰 과세와 유추금지, 국제적 AI 플랫폼의 실질귀속, 전자세무 송달, 스마트계약과 부동산등기, AI 사기탐지와 변제공탁, AI 입력오류 상업등기까지 포함한다.

## 9차 수동검토 완료 — 법적 추론·논증

파일:
- `data-variation-solutions-manual-round9-reasoning-a.js`
- `data-variation-solutions-manual-round9-reasoning-b.js`

13개 연구항목의 일반 사례 52개와 고난도 사례 26개, 총 78개 논증을 수동화하였다.

- `reasoning-interpretation`
- `reasoning-subsump`
- `reasoning-argument`
- `reasoning-elements-facts`
- `reasoning-burden-proof`
- `reasoning-case-variation`
- `reasoning-premise-conclusion`
- `reasoning-necessary-sufficient`
- `reasoning-rule-exception`
- `reasoning-issue-spotting`
- `reasoning-analogy-contrary`
- `reasoning-counterexample`
- `reasoning-conflict`

법적 추론형은 단순한 정답 대신 `논증구조 → 규칙선택 → 사실포섭 → 반례·반론 → 조건부 또는 최종결론`을 제시한다.

## 실제 로딩 순서

`data-variation-solutions-manual-round1.js`
→ `data-variation-solutions-manual-round2.js`
→ `data-variation-solutions-manual-round3.js`
→ `data-variation-solutions-manual-round4-civil.js`
→ `data-variation-solutions-manual-round5-public.js`
→ `data-variation-solutions-manual-round6-criminal.js`
→ `data-variation-solutions-manual-round7-ip.js`
→ `data-variation-solutions-manual-round8-special.js`
→ `data-variation-solutions-manual-round9-reasoning-a.js`
→ `data-variation-solutions-manual-round9-reasoning-b.js`
→ `data-variation-solutions.js`
→ `schema.js`
→ `app.js`

수동검토 답안이 존재하는 사례는 수동 답안을 우선 사용하고 자동 생성 논증은 아직 수동검토하지 않은 사례의 최저 품질선으로만 남는다.

## 현재 단계

사용자가 지정한 순서인

`의료기기+실제 의료사고 복합사례 → AI 저작권·AI 보조발명 → 공공기관 자동결정·고영향 AI 기본권 → 플랫폼·신용평가·소비자 기만 → 나머지 일반 법리형`

의 수동답안 교체를 한 차례 완료하였다.

일반 법리형은 민사·공법·형사법·지식재산·전문법·법적 추론까지 수동답안화하였다. 자동 fallback은 삭제하지 않고 안전망으로 유지한다. 다음 품질관리 단계에서는 남아 있는 저우선 AI 규제·산업법 카드의 자동해설을 전수 검색하여 수동답안 비율을 추가로 높이고, 법령·시행령·고시의 최신성 및 사례에 인용된 규범의 기준일을 다시 대조한다.
