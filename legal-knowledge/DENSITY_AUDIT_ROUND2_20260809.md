# 105개 연구카드 제2차 밀도 감사 — 2026-08-09

## 목적

기존 `DENSITY_AUDIT_20260809.md`의 감사기준을 105개 전체에 다시 적용하여, 형식상 필드는 채워져 있으나 공통 정교화 문구에 대한 의존도가 상대적으로 높은 카드만 추출하고 개별 법리·증명·사례논증으로 정밀 보강한다.

## 감사기준

다음 요소를 카드별로 다시 확인하였다.

1. 핵심개념이 인접 제도와 구별되어 있는지
2. `doctrineDebate`가 법체계 공통문구가 아니라 해당 주제의 실제 해석대립을 설명하는지
3. `crossLawConflict`가 실제 적용되는 복수 법률과 책임경합을 구체적으로 연결하는지
4. `proofIssues`가 해당 사건에서 필요한 문서·로그·버전·행위자 자료를 특정하는지
5. 일반 사례와 고난도 사례에 쟁점·법리·포섭·증거·반론·결론이 대응하는지
6. 직접 판례가 없는 신설법에서 임의 판례를 만들지 않고 공식자료·인접법리·비교법의 한계를 표시하는지
7. 법령 시행일·검토일이 기준시점과 일치하는지
8. 이미 수동답안·판례 원문검증·개별 밀도보강이 완료된 항목에 중복 패치를 하지 않는지

## 105개 전수분류

### 1. 기존 일반법 49개

민사·상사·공법·형사법·지식재산·조세·전문법·법적추론 49개는 다음의 개별 작업으로 직접 심화되어 있다.

- 초기 수동검토
- 판례 원문검증
- 제2차 법리 정교화
- 사례형 수동답안 round 4~9

따라서 이번 2차 감사에서는 공통문구 의존도가 높은 신규 후보를 추출하지 않았다.

### 2. 2026-08-09 추가 핵심 법리 20개

새 20개는 `data-core-expansion-20-enrichment-*` 파일에서 이번 감사의 기준선 자체에 맞추어 별도 심화하였다. 학설 대립, 증명문제, 심화쟁점, 일반·고난도 사례해설이 이미 개별 작성되어 있으므로 2차 대상에서 제외하였다.

### 3. AI·디지털 법제 36개

#### 기존 개별 수동·정밀심화 17개

- `ai-product-liability`
- `ai-civil-tort-allocation`
- `ai-pipa-automated-decision`
- `ai-auto-liability-autonomous`
- `ai-digital-medical-products`
- `ai-medical-professional-duty`
- `ai-medical-device-law`
- `ai-copyright-training-output`
- `ai-patent-inventorship`
- `ai-constitutional-framework`
- `ai-basic-high-impact`
- `ai-public-sector-impact-assessment`
- `ai-credit-automated-evaluation`
- `ai-consumer-basic-rights`
- `ai-ecommerce-deception`
- `ai-advertising-disclosure`
- `ai-competition-platform`

#### 제1차 밀도보강 round 4 대상 18개

- `ai-basic-transparency`
- `ai-basic-impact-assessment`
- `ai-admin-automated-disposition`
- `ai-intelligent-information-framework`
- `ai-basic-frontier-safety`
- `ai-pipa-pseudonym-training`
- `ai-location-mobility-data`
- `ai-data-industry-assets`
- `ai-auto-management-safety`
- `ai-autonomous-vehicle-commercialization`
- `ai-road-traffic-autonomous-driver`
- `ai-outdoor-mobile-robot`
- `ai-drone-aviation-safety`
- `ai-uam-law`
- `ai-physical-robot-workplace-safety`
- `ai-software-promotion`
- `ai-ict-industry-promotion`
- `ai-ict-regulatory-sandbox`

위 두 집단을 합하면 35개가 개별 수동 또는 주제별 밀도보강을 직접 받았다.

## 제2차 정밀보강 대상 — 1개

전수 대조 결과 남은 카드는 다음 1개였다.

### `ai-basic-high-impact-duties`

제목: **고영향 AI 위험관리·설명·인간감독·문서화**

기존 카드 자체의 개념·요건·쟁점 설명은 충실했으나, AI 전체에 적용한 `data-refinement-ai-round3.js`의 공통 정교화에 상대적으로 많이 의존하고 있었고 다음의 시행령상 구체 규율이 개별 논증에 충분히 반영되지 않았다.

1. 위험관리·설명·이용자보호 주요 내용과 인간 관리·감독 담당자의 성명·연락처 게시
2. 영업비밀 사항의 게시 제외와 이용자·감독 필요 사이의 조정
3. 조치 이행근거의 5년 문서보관
4. 개발사업자의 기존 조치를 이용사업자가 원용할 수 있는 조건과 `중대한 기능변경`의 경계
5. 이용사업자의 자료요청과 개발사업자의 협력 노력
6. 다른 법령상 준하는 조치의 이행간주 범위를 항목별로 대응시키는 문제

## round 5 보강내용

적용 파일: `data-density-round5-high-impact-duties.js`

다음 필드를 전면적으로 개별화하였다.

- `concept`: 법 제34조와 시행령 제27조를 하나의 공급망 내부통제 구조로 재작성
- `requirements`: 위험관리·설명·이용자보호·실질적 인간감독·게시·5년 보관·공급망 협력·중복이행까지 세분화
- `effect`: 규제준수와 민사상 주의의무·증명효과를 구별
- `doctrineDebate`: 절차준수 대 실효성, 명목감독 대 실질감독, 공급망 분산책임 대 최종서비스 통합책임의 대립구조
- `comparativeLaw`: EU AI Act의 위험관리·투명성·인간감독·기술문서·로그 보관 구조와 비교
- `adjacentCaseLaw`: 직접 판례 미축적을 명시하고 민법·제조물책임·자동결정 등 인접법리의 사용범위를 한정
- `crossLawConflict`: 개인정보·신용·의료·자동차 등 분야별 규율과 제34조 이행간주의 관계를 조치별로 분석
- `proofIssues`: 위험등록부, 모델카드, 게시이력, 감독권한, 자료요청·회신, 기능변경, 5년 보관 등 8개 증명축
- `deepDive`: 게시와 영업비밀, 5년 보관, 중대한 기능변경, 공급망 정보비대칭
- `application`: 7단계 판단순서
- `hardVariations`: 4개 복합사례
- `hardVariationAnalyses`: 각 사례에 쟁점·법리·포섭·증거·반론·결론을 개별 작성

## 고난도 사례의 핵심축

1. 범용·기반모델을 채용 AI로 파인튜닝하고 에이전트 자동결정 기능까지 연결한 경우 기존 개발자의 제34조 조치를 원용할 수 있는지
2. 홈페이지에 감독 담당자가 표시되어 있으나 실제 검토시간·정보·중단권한이 없는 경우 실질적 인간감독인지
3. 위험관리 문서와 실제 운영로그가 불일치하고 사고 후 원본 로그가 소실된 경우 규제준수와 민사책임에서의 증명효과
4. 의료기기 등 개별 산업규제를 준수했다는 이유만으로 제34조 전체가 이행된 것으로 볼 수 있는지

## 최종결론

105개 전체를 재감사한 결과, 이번 감사기준상 **공통문구 의존도가 높아 별도의 제2차 정밀보강이 필요한 카드는 1개**로 확정하였다.

- 일반법 49개: 기존 직접 보강 유지
- 신규 핵심법리 20개: 신규 심화본 유지
- AI·디지털 36개: 기존 직접심화 17 + round4 18 + round5 1 = 36개 모두 주제별 개별화층 확보

따라서 현재 단계에서는 카드 수나 본문 길이를 일률적으로 더 늘리지 않는다. 이후 감사는 다음 세 항목을 중심으로 실시한다.

1. 최신 법령 개정·시행일 정합성
2. 직접 판례가 있는 카드의 판결 원문·사건번호·판시범위 정밀검증
3. 카드 사이 문장 유사도와 동일 논증 반복의 추가 제거

목표는 모든 105개 카드가 독립적으로 읽혀도 해당 주제의 법적 쟁점·규범·증거·반론·사례해결 구조를 자체적으로 갖도록 유지하는 것이다.
