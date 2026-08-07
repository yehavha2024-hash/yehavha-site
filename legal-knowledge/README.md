# 법리·판례 연구 / Advanced Legal Studies

예하바 넥서스의 전문 법률지식 프로젝트용 정적 웹페이지입니다.

## 운영 원칙

- 데일리 강제형이 아니라 **주제 단위 누적형**으로 운영합니다.
- 기존 49개 연구노트는 삭제·축소하지 않고 지속적으로 정교화합니다.
- AI·디지털 전환에서 반드시 숙지할 핵심 법령은 동일한 전문 기준으로 추가합니다. 2026-08-07 기준 AI 법제 34개를 추가하여 총 83개 연구항목 구조입니다.
- 표준 구조는 개념 → 조문 → 요건 → 효과 → 쟁점 → 학설·해석론 → 판례 사실관계 → 법원 판단 → 법원 논증 → 핵심법리 → 반대논리·한계 → 사례변형 → 관련법리 → 관련판례 → 관련시험 → 기준일·검토일입니다.
- 16개 표준형 충족여부는 내부 데이터 검증용이며 개별 연구노트 화면에는 체크리스트를 표시하지 않습니다.
- 판례형은 대법원·헌법재판소·특허법원 등 공식 판결 원문을 사실관계·판단·논증까지 대조한 뒤에만 원문검증 완료로 처리합니다.
- 모든 항목에 법령·판례 기준일과 최종 검토일을 관리합니다.
- 법령과 판례는 변경될 수 있으므로 공식 원문을 함께 연결합니다.
- 난도는 입문자가 아니라 변호사시험·법무사·변리사 및 LEET식 법적 추론 등 전문 법률영역을 기준으로 합니다.

세부 품질기준은 `QUALITY_POLICY.md`를 따릅니다.

## 법체계별 화면 분류

원본 데이터의 `area` 값은 호환성을 위해 유지하고 `schema.js`가 `systemArea`를 만들어 화면을 다음 법체계로 재분류합니다.

1. 헌법·공법
2. 민사·상사·책임법
3. 형사법
4. 데이터·플랫폼·소비자법
5. 모빌리티·로봇·항공법
6. 보건의료법
7. 지식재산법
8. AI 산업·융합법
9. 조세·전문법
10. 법적 추론

## 데이터 구조

기존 전문 법률 콘텐츠:

- `data-civil.js` : 민사법
- `data-public.js` : 공법
- `data-criminal.js` : 형사법
- `data-ip.js` : 지식재산법
- `data-special.js` : 조세·전문법
- `data-reasoning.js`, `data-reasoning-advanced.js` : 법적 추론

AI·디지털 법제 확장:

- `data-ai-foundation.js` : 헌법·인공지능기본법·행정자동화·국가 디지털 거버넌스
- `data-ai-data-consumer.js` : 개인정보·신용정보·위치정보·데이터·민사책임·소비자·플랫폼·경쟁
- `data-ai-mobility.js` : 자율주행차·로봇·드론·UAM·Physical AI 산업안전
- `data-ai-industry-medical-ip.js` : SW/ICT 진흥·규제샌드박스·디지털헬스·저작권·AI 발명

기존 카드의 전문화는 신규 카드를 복제하지 않고 patch 파일에서 같은 `id`의 필드를 보강합니다.

- `data-verification-*.js` : 공식 판결 원문 대조가 끝난 판례형 보강
- `data-enrichment-*.js` : 법리·조문형 및 법적 추론형의 표준필드 보강
- `data-corrections.js` : 출처·메타데이터 등 소규모 정정

`schema.js`는 각 연구노트의 16개 표준형 충족상태와 판례 원문검증 상태를 내부적으로 계산하고, 법체계별 `systemArea`를 부여합니다. `app.js`는 법체계·시험·세부분야 검색/필터와 연구노트 상세내용을 표시합니다. `status-ui.js`는 공개 화면에 전체 연구항목 수와 판례 원문검증 현황만 집계합니다.

## 주요 파일

- `index.html` : 화면 구조 및 데이터 로딩 순서
- `styles.css`, `enhancements.css` : 디자인
- `schema.js` : 내부 16개 표준형·품질상태 계산 및 법체계 분류
- `app.js` : 검색·필터·상세보기
- `status-ui.js` : 전체 항목/판례 원문검증 현황
- `QUALITY_POLICY.md` : 콘텐츠 품질 운영기준
- `wrangler.jsonc` : Cloudflare Workers 배포 설정

## 콘텐츠 정교화 원칙

모든 기존·신규 항목은 다음을 우선 확인합니다.

1. 현행 법령 기준일과 정확한 법률명
2. 공식 판결 원문
3. 판결 당시 적용법과 현행법의 차이
4. 판례 사실관계와 법원의 실제 논증
5. 학설 대립구조와 각 견해의 규범적 근거
6. 선행·대상·후속 판례의 관계
7. 반대논리·적용한계
8. 복수 법리 충돌과 증명책임까지 포함한 고난도 사례변형
9. 관련 법리·관련 시험 태그
10. 최종 검토일

AI 법제는 개별법 하나에 고립시키지 않고 관련 민사책임·공법·데이터·산업안전·지식재산 규율을 교차 연결합니다.

## Cloudflare Workers 배포

GitHub `main` 브랜치를 Cloudflare Workers Builds와 연결하여 사용합니다.

- 프로젝트: `yehavha-legal-knowledge`
- Root directory: `legal-knowledge`
- Build command: 없음
- Deploy command: `npx wrangler deploy --name yehavha-legal-knowledge --assets=.`
- 배포 URL: `https://yehavha-legal-knowledge.danielie.workers.dev`

`main`에 변경이 반영되면 연결된 Cloudflare 빌드가 새 버전을 배포합니다.
