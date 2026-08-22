# YEHAVHA Project Copyright Footer Standard

모든 YEHAVHA 프로젝트와 하위 결과물의 웹 하단 권리표기는 **Nexus 메인의 중앙정렬 단일열 Footer**를 기준으로 통일합니다. 프로젝트마다 좌측정렬·우측정렬·2열 Footer를 별도로 만들지 않습니다.

## 고정 표시 순서

1. 프로젝트명
2. 프로젝트 영문명 또는 짧은 성격 설명
3. `스카이예슈아 · 사업자등록번호 536-38-01234 · 대표 이명훈`
4. `Copyright © 이명훈 2026. All rights reserved.`
5. `문의 kimbrighth@gmail.com`
6. 콘텐츠 성격에 맞는 `AI 활용 안내`
7. `맨 위로 이동 ↑`

데스크톱과 모바일 모두 위 순서와 중앙정렬을 그대로 유지합니다. `맨 위로 이동`은 Footer의 마지막 항목으로 1개만 둡니다. 프로젝트 URL은 Footer에 중복 노출하지 않습니다.

사업자정보·Copyright·문의는 하나의 법적 메타 3행으로 취급합니다. 이 세 행은 줄바꿈만 사용하고 행 사이 `margin`은 `0`으로 유지합니다. AI 활용 안내는 이 3행과 구분하기 위해 위쪽 간격을 둘 수 있으며, `맨 위로 이동`도 AI 안내와 구분되는 작은 위쪽 간격을 둘 수 있습니다.

## 데이터 소유 원칙

Copyright·문의·AI 활용 안내·맨 위로 이동은 실제 HTML 요소에 기록합니다. 이 네 항목을 CSS `::before`, `::after`, `content`로 생성하거나 실제 텍스트를 숨긴 뒤 가상요소로 대체하지 않습니다.

사업자정보는 Nexus 전체에서 동일한 법적 메타데이터이므로 `nexus/portal-v2.css`의 전역 단일 원본으로 관리할 수 있습니다. 일반 Footer의 `.footer-meta::before`와 전문 연구 Footer의 `.research-footer-meta::before`가 동일 사업자정보를 표시합니다. 사업자정보를 수정할 때는 이 단일 원본만 수정합니다.

독립 프로젝트와 독립 웹앱은 사업자정보를 해당 페이지의 실제 Footer HTML에 기록합니다. 독립 프로젝트에서는 CSS 가상요소를 사업자정보의 데이터 원본으로 사용하지 않습니다.

## 단일 소유권 원칙

하나의 페이지에서 사이트 Footer의 레이아웃·정렬·타이포그래피를 결정하는 CSS 파일은 **정확히 1개**만 둡니다. 기본 스타일, 상세문서 스타일, 콘텐츠 스타일, 반응형 보조 스타일이 같은 `.site-footer`를 다시 정의하지 않습니다.

- `project-standard.css`가 존재하는 프로젝트는 원칙적으로 이 파일이 사이트 Footer의 최종 시각 소유자가 됩니다.
- 단일 `style.css`만 사용하는 독립 웹앱은 그 파일 하나가 Footer를 소유할 수 있습니다.
- `styles.css`와 `project-standard.css`가 동시에 `.site-footer`를 정의하여 로드 순서에 따라 결과가 달라지는 구조를 금지합니다.
- 모바일 미디어쿼리에서 Footer를 다시 `left` 또는 `right`로 변경하지 않습니다.
- `footer-fix.css`, `footer-override.css`, `patch.css`, `hotfix.css` 같은 임시 오버라이드 파일을 새로 만들어 문제를 덮지 않습니다. 수정은 기존 canonical 소유 파일에 통합합니다.
- 상세 다이얼로그 안의 `.detail-footer`, `.document-footer` 등 문서 내부 Footer는 사이트 Footer와 별도 구성요소로 취급하며 선택자를 명확히 스코프합니다.

이 원칙의 목적은 CSS cascade의 “마지막 파일이 이김” 방식으로 오류를 숨기는 것이 아니라, 애초에 같은 UI 영역을 여러 파일이 동시에 통제하지 못하게 하는 것입니다.

## 표준 DOM

독립 프로젝트의 기본 구조는 다음과 같습니다.

```html
<footer class="site-footer" data-footer-standard="v2">
  <div class="footer-brand">
    <strong>프로젝트명</strong>
    <p>프로젝트 영문명 또는 성격 설명</p>
  </div>
  <div class="footer-meta">
    <p class="business-meta">스카이예슈아 · 사업자등록번호 536-38-01234 · 대표 이명훈</p>
    <p>Copyright © 이명훈 2026. All rights reserved.</p>
    <p>문의 <a href="mailto:kimbrighth@gmail.com">kimbrighth@gmail.com</a></p>
    <p class="ai-disclosure">AI 활용 안내: ...</p>
    <a href="#top">맨 위로 이동 ↑</a>
  </div>
</footer>
```

Nexus 내부 페이지는 전역 Footer 컴포넌트 구조를 사용할 수 있으며, 사업자정보만 `nexus/portal-v2.css`의 승인된 단일 원본을 공유합니다. 클래스명은 프로젝트 구조에 따라 달라질 수 있지만 시각적 결과와 표시 순서는 동일해야 합니다.

`#top`은 sticky/fixed header가 아닌 문서 시작점에 둡니다. 권장 위치는 `body id="top"`, 최상위 `main id="top"`, 또는 비고정 문서 시작 요소입니다. sticky header에 `id="top"`을 두면 화면상 이미 상단에 붙어 있기 때문에 fragment navigation이 실제 문서 스크롤을 움직이지 않는 문제가 생길 수 있습니다. `맨 위로 이동`은 기본 `<a href="#top">`만 사용하며 인라인 `onclick`, `window.scrollTo()`, `scrollTop` 보정으로 동작을 덮지 않습니다.

## 타이포그래피

공통 서체:
`Pretendard, "Noto Sans KR", "Apple SD Gothic Neo", system-ui, -apple-system, sans-serif`

- 프로젝트명: 13px / 600 / line-height 1.5
- 영문 설명: 11px / 400 / line-height 1.7
- 사업자정보: 12px / 400 / line-height 1.7
- Copyright: 12px / 400 / line-height 1.7
- 문의: 12px / 400 / line-height 1.7
- AI 활용 안내: 11.5px / 400 / line-height 1.7
- 맨 위로 이동: 11px / 600 / line-height 1.7
- letter-spacing: 0

Footer에는 Georgia, Noto Serif KR 등 명조·장식용 서체를 사용하지 않습니다.

## 색상과 간격

- 전체 정렬: `text-align:center`
- 배경: `#050b19` 또는 동일 계열 Nexus 하단 배경
- 상단 경계선: `rgba(255,255,255,.09)`
- 프로젝트명: `#d7e1ea`
- 기본 텍스트: `#8fa1b3`
- 링크: `#a9bfd2`
- Footer 전체 하단 여백: 약 32~36px
- 프로젝트 정보와 권리정보 사이에는 얇은 구분선 1개
- 사업자정보·Copyright·문의 3행: `margin:0`
- AI 활용 안내: 3행 블록과 구분되는 위쪽 간격 약 6px
- 맨 위로 이동: AI 활용 안내와 구분되는 위쪽 간격 약 4~7px
- 본문 컨테이너와 동일한 최대폭 사용

모바일에서 좌측정렬로 전환하지 않습니다. 화면 폭이 좁아져도 중앙정렬 단일열을 유지합니다.

## AI 활용 안내

AI 활용 안내는 Copyright와 문의 다음에 배치하며 콘텐츠 성격에 맞게 작성합니다.

- 학습 콘텐츠: 예시·문항·학습자료의 AI 활용 범위와 운영자의 기획·검토 역할
- 법률 연구: 자료 탐색·구조화·초안 작성의 AI 활용과 법령·판례·출처 검토 및 최종 편집 책임
- 기술예측·정책 연구: 탐색·구조화·초안 작성의 AI 활용과 사실·전망 구분 및 최종 검토
- 포털·프로젝트 안내: 콘텐츠·문안·연구자료 정리에 AI를 활용할 수 있음을 표시

AI를 단독 저자나 최종 검증주체로 표현하지 않습니다.

## 캐시·배포 원칙

형식이 최신 코드에서 과거 코드로 되돌아오는 것처럼 보이는 현상을 막기 위해 배포 자산의 버전과 브라우저 캐시도 Footer 구조와 함께 관리합니다.

- canonical CSS를 수정하면 해당 HTML의 CSS query version도 함께 갱신합니다.
- Service Worker가 있는 웹앱은 HTML·CSS 구조 변경 시 cache name을 함께 올립니다.
- Service Worker 활성화 시 이전 cache name은 삭제합니다.
- HTML·CSS·JS 같은 코드 자산은 가능한 한 network-first 또는 재검증 가능한 정책을 사용하며, 과거 캐시를 영구 우선하지 않습니다.
- 오래된 파일을 단순히 뒤에 다시 로드하여 새 형식을 덮는 방식으로 캐시 문제를 해결하지 않습니다.

## 업데이트 경계

콘텐츠 업데이트와 UI 표준 업데이트의 책임을 분리합니다.

- 데이터·연구내용·문안 업데이트는 Footer DOM, `data-footer-standard`, canonical Footer CSS 소유권을 임의로 변경하지 않습니다.
- 콘텐츠 JS·JSON이 사이트 Footer DOM이나 정렬을 재작성하지 않습니다.
- Footer 규격 변경이 필요한 경우 이 표준과 canonical CSS를 먼저 변경한 뒤 각 프로젝트에 반영합니다.
- 날짜가 오래된 파일이라는 이유만으로 데이터·연구 모듈을 삭제하지 않습니다. 실제 런타임 중복 소유·덮어쓰기·미사용이 확인된 파일만 제거합니다.

## 자동 회귀 방지

`Web Architecture Audit`는 `main` push와 pull request에서 자동 실행합니다. `scripts/audit-business-footer.mjs`는 독립 프로젝트를 포함하여 다음 항목을 검사합니다.

- Footer 표준 `v2`
- 사업자정보·Copyright·문의·AI 안내·맨 위로 이동의 존재와 순서
- 사업자정보·Copyright·문의 3행의 무간격 규칙
- 사이트 Footer의 CSS 소유자 1개 원칙
- 중앙정렬 규칙 존재 여부
- `맨 위로 이동`의 native `#top` fragment 사용과 인라인 스크롤 보정 부재
- 별도 footer patch/override/hotfix CSS의 재도입 여부

이 감사가 실패하는 변경은 형식 회귀로 간주합니다.

## 재발 방지 원칙

- Footer 정렬을 프로젝트별 보조 CSS에서 임의로 `left`, `right`, 2열 grid로 변경하지 않습니다.
- 공통 Footer를 별도 상세페이지에서 다시 정의하지 않습니다.
- 사업자정보·Copyright·문의·AI 안내의 글자크기를 본문 크기에 따라 확대하지 않습니다.
- 사업자정보·Copyright·문의 3행 사이에 개별 `margin`을 추가하지 않습니다.
- `맨 위로 이동` 대상은 sticky header에 두지 않습니다.
- 새 프로젝트를 추가할 때 Nexus 메인 Footer와 시각적으로 대조한 뒤 배포합니다.
- 수정 시 새 override 파일을 만드는 대신 기존 소유 파일에서 충돌 원인을 제거합니다.
- 구조 감사에서는 사업자정보 존재 여부, 표시 순서, 중앙정렬, 타이포그래피, CSS 소유권, 3행 간격, top fragment 동작 규칙을 함께 검사합니다.
