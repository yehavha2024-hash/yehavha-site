# YEHAVHA Project Copyright Footer Standard

Version: 3.0  
Updated: 2026-08-23

모든 YEHAVHA 프로젝트와 Nexus 하위 결과물의 웹 하단 권리표기는 Nexus 메인의 중앙정렬 단일열 Footer를 기준으로 통일합니다. 프로젝트마다 좌측정렬·우측정렬·2열 Footer를 별도로 만들지 않습니다.

## 1. 고정 표시 순서

1. 프로젝트명
2. 프로젝트 영문명 또는 짧은 성격 설명
3. `스카이예슈아 · 사업자등록번호 536-38-01234 · 대표 이명훈`
4. `Copyright © 이명훈 2026. All rights reserved.`
5. `문의 kimbrighth@gmail.com`
6. 콘텐츠 성격에 맞는 `AI 활용 안내`
7. `맨 위로 이동 ↑`

데스크톱과 모바일 모두 위 순서와 중앙정렬을 유지합니다. `맨 위로 이동`은 Footer의 마지막 항목으로 1개만 둡니다. 프로젝트 URL은 Footer에 중복 표시하지 않습니다.

사업자정보·Copyright·문의는 하나의 법적 메타 3행으로 취급하며 행 사이 margin은 0으로 유지합니다. AI 활용 안내와 맨 위로 이동에는 작은 위쪽 간격을 둘 수 있습니다.

## 2. 법적 메타데이터의 단일 기준

공개 Footer에 사용하는 사업자정보의 표준 문자열은 다음과 같습니다.

`스카이예슈아 · 사업자등록번호 536-38-01234 · 대표 이명훈`

Copyright 표준 문자열은 다음과 같습니다.

`Copyright © 이명훈 2026. All rights reserved.`

문의 주소는 다음과 같습니다.

`kimbrighth@gmail.com`

Nexus 내부 페이지와 독립 프로젝트를 구분하지 않고 위 사업자정보를 실제 Footer HTML에 직접 기록합니다. CSS `::before`, `::after`, `content` 또는 JavaScript로 사업자정보·Copyright·문의·AI 안내를 생성하거나 보충하지 않습니다. 화면에 보이는 법적 메타데이터와 HTML 원문이 일치해야 합니다.

사업자정보를 변경해야 할 경우 이 문서의 표준 문자열과 실제 Footer HTML을 함께 수정하고 감사 규칙으로 전체 누락 여부를 확인합니다.

## 3. 표준 DOM

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

클래스명은 프로젝트 구조에 따라 달라질 수 있지만 실제 표시 내용과 순서는 동일해야 합니다. Nexus 내부 페이지도 사업자정보를 CSS 가상요소에서 가져오지 않고 실제 Footer HTML에 기록합니다.

`#top`은 문서 시작점에 둡니다. `맨 위로 이동`은 기본 `<a href="#top">`를 사용하며 인라인 `onclick`, `window.scrollTo()`, 임의 scrollTop 보정으로 덮지 않습니다.

## 4. 단일 소유권 원칙

한 페이지에서 사이트 Footer의 레이아웃·정렬·타이포그래피를 결정하는 CSS 파일은 정확히 1개의 canonical owner만 둡니다.

- Nexus 공통 Footer는 `nexus/portal-v2.css`가 공통 shell을 소유합니다.
- compact 문서는 해당 canonical compact CSS가 Footer를 소유합니다.
- 독립 프로젝트는 `project-standard.css` 또는 단일 `style.css` 중 하나만 Footer를 소유합니다.
- 상세 다이얼로그 내부의 `.detail-footer`, `.document-footer`는 사이트 Footer와 별도 구성요소로 취급합니다.
- `footer-fix.css`, `footer-override.css`, `patch.css`, `hotfix.css` 등 임시 오버라이드 파일로 문제를 덮지 않습니다.
- 콘텐츠 JavaScript가 Footer 전체 DOM을 다시 만들지 않습니다.

오류는 마지막 CSS가 이기는 방식으로 숨기지 않고 실제 canonical owner와 HTML 원문을 수정합니다.

## 5. 타이포그래피

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

Footer에는 Georgia, Noto Serif KR 등 장식용 serif를 사용하지 않습니다.

## 6. 색상과 간격

Nexus 라이트 인터페이스 기준을 그대로 적용합니다.

- 전체 정렬: `text-align:center`
- 배경: `#FFFFFF`
- 상단 경계선·구분선: `#CFD4DC`
- 프로젝트명: `#111111`
- 사업자정보·Copyright·문의·설명: `#111111`
- 링크: `#111111`
- Footer 전체 하단 여백: 약 32~36px
- 프로젝트 정보와 권리정보 사이에는 회색 구분선 1개
- 사업자정보·Copyright·문의 3행: `margin:0`
- AI 활용 안내: 법적 메타 3행과 구분되는 위쪽 간격 약 6px
- 맨 위로 이동: AI 안내와 구분되는 위쪽 간격 약 4~7px
- 본문 컨테이너와 동일한 최대폭 사용

테두리·구분선에 흰색 또는 반투명 흰색을 사용하지 않습니다. 모바일에서도 중앙정렬 단일열을 유지합니다.

## 7. AI 활용 안내

AI 활용 안내는 Copyright와 문의 다음에 배치하고 콘텐츠 성격에 맞게 작성합니다.

- 학습 콘텐츠: 예시·문항·학습자료의 AI 활용 범위와 운영자의 기획·검토 역할
- 법률 연구: 자료 탐색·구조화·초안 작성의 AI 활용과 법령·판례·출처 검토 및 최종 편집 책임
- 기술예측·정책 연구: 탐색·구조화·초안 작성의 AI 활용과 사실·전망 구분 및 최종 검토
- 포털·프로젝트 안내: 콘텐츠·문안·연구자료 정리에 AI를 활용할 수 있음을 표시

AI를 단독 저자나 최종 검증주체로 표현하지 않습니다.

## 8. 캐시·배포 원칙

- canonical CSS를 수정하면 필요할 때 해당 HTML의 CSS query version을 갱신합니다.
- Service Worker가 있는 웹앱은 HTML·CSS 구조 변경 시 cache name을 함께 올립니다.
- 이전 cache name은 제거합니다.
- HTML·CSS·JS는 network-first 또는 재검증 가능한 정책을 우선합니다.
- 오래된 파일을 뒤에 다시 로드하여 새 Footer를 덮는 방식으로 캐시 문제를 해결하지 않습니다.

## 9. 자동 회귀 방지

Nexus Footer 감사는 다음을 검사합니다.

- Footer 표준 `v2`
- 사업자정보 정확한 문자열
- Copyright 정확한 문자열
- 문의 mailto
- AI 활용 안내
- 맨 위로 이동 링크
- `사업자정보 → Copyright → 문의 → AI 활용 안내 → 맨 위로 이동` 순서
- CSS 가상요소를 이용한 사업자정보 생성 금지
- Footer CSS 순서 재배치 금지
- 임시 footer patch/override/hotfix 파일 재도입 금지

독립 프로젝트 감사도 동일한 법적 메타데이터를 기준으로 합니다.

## 10. 재발 방지 원칙

- 새 공개 페이지에는 사업자정보를 Footer HTML에 처음부터 기록합니다.
- Footer 정렬을 프로젝트별 보조 CSS에서 임의로 left, right, 2열 grid로 변경하지 않습니다.
- 사업자정보·Copyright·문의 3행 사이에 개별 margin을 추가하지 않습니다.
- 공통 Footer를 상세페이지마다 다시 정의하지 않습니다.
- 수정 시 새 override 파일을 만들지 않고 기존 canonical owner를 수정합니다.
- 사업자정보 누락을 CSS나 JavaScript로 보충하지 않습니다.
