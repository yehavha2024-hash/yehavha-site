# 법리·판례 연구 / Advanced Legal Studies

예하바 넥서스의 전문 법률지식 프로젝트용 정적 웹페이지입니다.

## 운영 원칙

- 데일리 강제형이 아니라 **주제 단위 누적형**으로 운영합니다.
- 현재는 신규 카드 추가보다 기존 49개 연구노트의 정교화를 우선합니다.
- 표준 구조는 개념 → 조문 → 요건 → 효과 → 쟁점 → 학설·해석론 → 판례 사실관계 → 법원 판단 → 법원 논증 → 핵심법리 → 반대논리·한계 → 사례변형 → 관련법리 → 관련판례 → 관련시험 → 기준일·검토일입니다.
- 판례형은 대법원·헌법재판소·특허법원 등 공식 판결 원문을 사실관계·판단·논증까지 대조한 뒤에만 원문검증 완료로 처리합니다.
- 모든 항목에 법령·판례 기준일과 최종 검토일을 관리합니다.
- 법령과 판례는 변경될 수 있으므로 공식 원문을 함께 연결합니다.
- 난도는 입문자가 아니라 변호사시험·법무사·변리사 및 LEET식 법적 추론 등 전문 법률영역을 기준으로 합니다.

세부 품질기준은 `QUALITY_POLICY.md`를 따릅니다.

## 데이터 구조

기본 콘텐츠는 분야별로 분리되어 있습니다.

- `data-civil.js` : 민사법
- `data-public.js` : 공법
- `data-criminal.js` : 형사법
- `data-ip.js` : 지식재산법
- `data-special.js` : 조세·전문법
- `data-reasoning.js`, `data-reasoning-advanced.js` : 법적 추론

기존 카드의 전문화는 신규 카드를 복제하지 않고 patch 파일에서 같은 `id`의 필드를 보강합니다.

- `data-verification-*.js` : 공식 판결 원문 대조가 끝난 판례형 보강
- `data-enrichment-*.js` : 법리·조문형 및 법적 추론형의 표준필드 보강
- `data-corrections.js` : 출처·메타데이터 등 소규모 정정

`schema.js`는 각 연구노트의 표준필드 충족상태와 판례 원문검증 상태를 계산합니다. `app.js`는 카드·검색·필터·상세보기와 품질 체크리스트를 표시하고 `status-ui.js`는 전체 진행상태를 자동 집계합니다.

## 주요 파일

- `index.html` : 화면 구조 및 데이터 로딩 순서
- `styles.css`, `enhancements.css` : 디자인
- `schema.js` : 16개 표준형 및 품질상태 계산
- `app.js` : 검색·필터·상세보기
- `status-ui.js` : 전체 항목/완성도/판례 원문검증 진행상태
- `QUALITY_POLICY.md` : 콘텐츠 품질 운영기준
- `wrangler.jsonc` : Cloudflare Workers 배포 설정

## 콘텐츠 수정 원칙

현재 49개가 안정화될 때까지 신규 카드 추가는 원칙적으로 보류합니다.

기존 항목을 수정할 때는 카드 `id`를 유지하고 다음을 우선 확인합니다.

1. 현행 법령 기준일
2. 공식 판결 원문
3. 판결 당시 적용법과 현행법의 차이
4. 판례 사실관계와 법원의 실제 논증
5. 학설·해석론과 반대논리
6. 사례변형과 관련 법리
7. 관련 시험 태그
8. 최종 검토일

## Cloudflare Workers 배포

GitHub `main` 브랜치를 Cloudflare Workers Builds와 연결하여 사용합니다.

- 프로젝트: `yehavha-legal-knowledge`
- Root directory: `legal-knowledge`
- Build command: 없음
- Deploy command: `npx wrangler deploy --name yehavha-legal-knowledge --assets=.`
- 배포 URL: `https://yehavha-legal-knowledge.danielie.workers.dev`

`main`에 변경이 반영되면 연결된 Cloudflare 빌드가 새 버전을 배포합니다.
