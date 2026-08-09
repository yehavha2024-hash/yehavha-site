# YEHAVHA 웹 프로젝트 구조 규격

## 1. 기본 원칙

모든 웹 프로젝트는 화면 구조, 디자인, 데이터, 동작의 책임을 분리한다. 동일한 UI 요소를 둘 이상의 파일이 다시 생성하거나 덮어쓰지 않는다.

### index.html
- 페이지의 실제 구조와 정적 콘텐츠를 소유한다.
- 메인 footer의 유일한 원본이다.
- Copyright, 문의, AI 활용 안내, 맨 위로 이동을 footer에 직접 포함한다.
- 대규모 인라인 CSS와 인라인 JavaScript를 두지 않는다.

### CSS
- 모든 시각적 표현은 CSS 파일이 소유한다.
- JavaScript에서 `<style>`을 생성하거나 CSS 문자열을 주입하지 않는다.
- 모바일 규칙도 CSS 파일에서 관리한다.

### config.js / data.js
- 데이터만 보유한다.
- `document`, `window.addEventListener`, `createElement`, `innerHTML` 등 DOM 조작을 하지 않는다.
- 가격, 시간, 이메일, 연구데이터 등 값만 제공한다.

### app.js
- 사용자 동작과 데이터 렌더링만 담당한다.
- 메인 footer를 생성하거나 다시 쓰지 않는다.
- 런타임 CSS를 삽입하지 않는다.
- 페이지 전체를 감시하는 MutationObserver를 사용하지 않는다.

### 동적 상세문서
- 상세문서가 dialog/modal에서 생성되는 경우 상세문서 생성 함수 또는 전용 모듈이 상세 footer를 한 번만 생성한다.
- 상세 footer에도 Copyright, 문의, AI 활용 안내를 포함한다.
- 필요한 MutationObserver는 상세문서 컨테이너처럼 좁은 범위에 한정한다.

## 2. Footer 표준

메인 footer 순서:
1. 프로젝트명 및 보조 설명
2. Copyright © 이명훈 2026. All rights reserved.
3. 문의 kimbrighth@gmail.com
4. 프로젝트 성격에 맞는 AI 활용 안내
5. 맨 위로 이동

메인 footer에는 `data-footer-standard="v1"`을 부여한다.

## 3. AI 활용 안내 원칙

- 프로젝트 성격에 맞게 구체적으로 작성한다.
- AI가 무엇에 사용되었는지와 사람이 무엇을 검토·관리하는지 구분한다.
- 법률·연구 프로젝트는 출처·원문·현행법 검증 필요성을 명시한다.
- 교육 프로젝트는 예시·프롬프트·수업자료와 강사의 기획·검토·운영을 구분한다.

## 4. 금지 패턴

- `config.js`에서 DOM 수정
- JavaScript에서 `.site-footer.innerHTML` 또는 메인 footer 전체 교체
- JavaScript에서 `document.createElement('style')`
- `document.documentElement` 또는 `document.body` 전체를 감시하는 MutationObserver
- 문제 해결을 위한 임시 `_worker.js`, 중복 `home-v2.html`, 강제 배포용 파일을 영구 유지
- 동일 고지문을 HTML과 여러 보정 JS에서 중복 소유

## 5. 배포 규칙

- 운영 원본은 `index.html` 한 개로 유지한다.
- 캐시 정책은 `_headers` 한 곳에서 관리한다.
- 임시 redirect/worker는 문제 해결 후 제거한다.
- 자산 변경 시 명시적 버전 문자열을 사용하되, 임시 버전 파일을 별도로 누적하지 않는다.

## 6. 현재 우선 적용 프로젝트

- `ai-law-tech-foresight/`
- `legal-philosophy/`
- 별도 저장소 `ai-song-studio`

이 규격을 기준으로 나머지 Nexus 연결 프로젝트도 순차적으로 정리한다.
