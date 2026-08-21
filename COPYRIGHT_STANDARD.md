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

## 데이터 소유 원칙

Copyright·문의·AI 활용 안내·맨 위로 이동은 실제 HTML 요소에 기록합니다. 이 네 항목을 CSS `::before`, `::after`, `content`로 생성하거나 실제 텍스트를 숨긴 뒤 가상요소로 대체하지 않습니다.

사업자정보는 Nexus 전체에서 동일한 법적 메타데이터이므로 `nexus/portal-v2.css`의 전역 단일 원본으로 관리할 수 있습니다. 일반 Footer의 `.footer-meta::before`와 전문 연구 Footer의 `.research-footer-meta::before`가 동일 사업자정보를 표시합니다. 사업자정보를 수정할 때는 이 단일 원본만 수정합니다.

독립 저장소 프로젝트는 해당 프로젝트의 공통 Footer 코드에서 동일한 사업자정보를 한 번만 관리합니다.

## 표준 DOM

```html
<footer class="footer reader-site-footer" data-footer-standard="v2">
  <div class="container">
    <div class="footer-card">
      <strong>프로젝트명</strong>
      <p>프로젝트 영문명 또는 성격 설명</p>
      <div class="footer-meta">
        <!-- 사업자정보 단일 원본 -->
        <p>Copyright © 이명훈 2026. All rights reserved.</p>
        <p>문의 <a href="mailto:kimbrighth@gmail.com">kimbrighth@gmail.com</a></p>
        <p class="ai-disclosure">AI 활용 안내: ...</p>
        <p><a href="#top">맨 위로 이동 ↑</a></p>
      </div>
    </div>
  </div>
</footer>
```

클래스명은 프로젝트 구조에 따라 달라질 수 있지만 시각적 결과와 표시 순서는 동일해야 합니다.

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
- 본문 컨테이너와 동일한 최대폭 사용

모바일에서 좌측정렬로 전환하지 않습니다. 화면 폭이 좁아져도 중앙정렬 단일열을 유지합니다.

## AI 활용 안내

AI 활용 안내는 Copyright와 문의 다음에 배치하며 콘텐츠 성격에 맞게 작성합니다.

- 학습 콘텐츠: 예시·문항·학습자료의 AI 활용 범위와 운영자의 기획·검토 역할
- 법률 연구: 자료 탐색·구조화·초안 작성의 AI 활용과 법령·판례·출처 검토 및 최종 편집 책임
- 기술예측·정책 연구: 탐색·구조화·초안 작성의 AI 활용과 사실·전망 구분 및 최종 검토
- 포털·프로젝트 안내: 콘텐츠·문안·연구자료 정리에 AI를 활용할 수 있음을 표시

AI를 단독 저자나 최종 검증주체로 표현하지 않습니다.

## 재발 방지 원칙

- Footer 정렬을 프로젝트별 CSS에서 임의로 `left`, `right`, 2열 grid로 변경하지 않습니다.
- 공통 Footer를 별도 상세페이지에서 다시 정의하지 않습니다.
- 사업자정보·Copyright·문의·AI 안내의 글자크기를 본문 크기에 따라 확대하지 않습니다.
- 새 프로젝트를 추가할 때 Nexus 메인 Footer와 시각적으로 대조한 뒤 배포합니다.
- 구조 감사에서는 사업자정보 존재 여부, 표시 순서, 중앙정렬, 타이포그래피 규격을 함께 검사합니다.
