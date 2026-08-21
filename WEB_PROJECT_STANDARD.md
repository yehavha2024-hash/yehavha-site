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
- 정적 상세글의 목차가 `<ol>`을 사용하면 기본 순번을 유지한다. `list-style:none`으로 번호를 숨기지 않는다.
- 디자인상 기본 순번을 숨겨야 하는 경우에는 CSS counter 또는 HTML의 명시적 번호처럼 화면에 실제 번호가 남는 대체 로직을 같은 소유 파일에 반드시 둔다.
- 목차 번호는 본문 `h2` 장 번호와 동일한 순서를 유지하며 제목만 축약해도 장 번호는 제거하지 않는다.

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
- 동적 목차가 제목 자체의 번호를 사용한다면 CSS에서 번호를 다시 생성하지 않아 중복 번호를 방지한다.

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
- `<ol>` 목차의 번호를 제거한 뒤 대체 번호 표시를 두지 않는 CSS

## 5. 배포 규칙

- 운영 원본은 `index.html` 한 개로 유지한다.
- 캐시 정책은 `_headers` 한 곳에서 관리한다.
- 임시 redirect/worker는 문제 해결 후 제거한다.
- 자산 변경 시 명시적 버전 문자열을 사용하되, 임시 버전 파일을 별도로 누적하지 않는다.
- Nexus 및 동일 저장소의 단순 코드 수정·본문 수정·CSS 수정은 별도 요청이 없는 한 `main`에 직접 반영한다.
- 단순 수정에서 작업용 브랜치와 PR을 만들지 않는다. 이 저장소는 여러 Cloudflare Workers/Pages 프로젝트가 GitHub에 연결되어 있어 PR마다 Preview build와 bot 댓글이 생성되고 GitHub 메일이 `Re:` 스레드로 반복 발송될 수 있다.
- PR은 사용자가 명시적으로 요청하거나 대규모 구조변경·검토가 필요한 경우에만 사용한다.
- Cloudflare Preview가 필요하지 않은 프로젝트는 Cloudflare의 비생산 브랜치/Preview branch 자동 빌드를 사용하지 않는 것을 원칙으로 한다. 운영 배포는 production branch인 `main`을 기준으로 한다.

## 6. 규격 적용 완료 프로젝트

### 메인 저장소 `yehavha2024-hash/yehavha-site`
- `nexus/`
- `three-minute-break/`
- `toeic-human-100/`
- `legal-knowledge/`
- `legal-philosophy/`
- `ai-law-tech-foresight/`

위 6개 프로젝트는 `scripts/audit-web-architecture.mjs`와 `Web Architecture Audit` workflow로 지속 검사한다.

### 별도 저장소
- `yehavha2024-hash/ai-song-studio`
- `yehavha2024-hash/ai-law-research-institute`

각 별도 저장소는 자체 `scripts/audit-architecture.mjs`와 `Architecture Audit` workflow로 지속 검사한다.

## 7. 유지관리 기준

- 새 기능을 추가할 때 기존 소유 파일을 수정하고 보정용 JavaScript를 별도로 덧붙이지 않는다.
- footer·AI 고지·Copyright 변경은 정적 HTML 원본에서 처리한다.
- 상세문서 footer는 해당 상세문서 생성 모듈만 수정한다.
- 정적 목차 수정 시 본문 장 번호와 목차 번호가 1:1로 대응하는지 함께 확인한다.
- 감사 workflow가 실패하면 새 패치를 추가하기 전에 중복 소유·전역 감시·런타임 스타일 생성 여부부터 제거한다.
- 임시 배포 우회파일은 원인 해결 후 반드시 삭제한다.
