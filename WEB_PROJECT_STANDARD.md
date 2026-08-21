# YEHAVHA 웹 프로젝트 구조 규격

Version: 2.0  
Updated: 2026-08-21

## 1. 기본 원칙

모든 프로젝트는 **한 기능에 한 소유자** 원칙을 사용합니다. 문제를 해결할 때 새 보정파일을 덧붙이기보다 기존 canonical owner를 수정합니다.

책임은 다음처럼 나눕니다.

- HTML: 구조와 정적 콘텐츠
- CSS: 시각 표현
- data/config: 데이터
- app/runtime JS: 사용자 동작과 데이터 렌더링
- audit: 구조 위반 검증

동일 UI를 HTML·CSS·JS 여러 곳에서 다시 생성하거나 서로 덮지 않습니다.

## 2. Nexus 공통 shell

메인 저장소 `nexus/`의 공통 외곽 UI는 `nexus/portal-v2.css`가 소유합니다.

공통 shell 범위:

- 기본 typography
- 공통 container
- Nexus 복귀 링크
- 공통 배경 token
- Footer
- 사업자정보
- 모바일 공통 여백

하위 프로젝트는 이를 다시 정의하지 않습니다. 기능별 CSS는 자신의 카드·본문·목차·검색·표·학습 UI만 소유합니다.

## 3. HTML

- 실제 DOM 구조와 정적 텍스트의 원본입니다.
- Copyright·문의·AI 활용 안내·맨 위로 이동은 Footer HTML에 직접 둡니다.
- 사업자정보처럼 전 Nexus에서 완전히 동일한 고정 메타데이터만 중앙 shell에서 단일 생성할 수 있습니다.
- production 페이지에 대규모 `<style>` 또는 `<script>` 블록을 두지 않습니다.
- 새 상세문서가 생겨도 페이지 전용 CSS를 만들지 않고 기존 document type을 사용합니다.

## 4. CSS

- Nexus 하위 일반 페이지는 원칙적으로 `공통 shell 1개 + 로컬 canonical CSS 1개`만 사용합니다.
- 로컬 CSS가 `.container`, 공통 복귀링크, Footer를 다시 소유하지 않습니다.
- 모바일 규칙도 같은 canonical CSS에서 관리합니다.
- `!important`는 외부 라이브러리 충돌 또는 명확한 중앙 shell 강제처럼 소유권이 분명할 때만 사용합니다.

영구 추가 금지 파일명:

- `*-YYYYMMDD.css`
- `*-fix.css`
- `*-patch.css`
- `*-hotfix.css`
- `*-override.css`
- 임시 `mobile-*`, `contrast-fix-*` 계열

임시 패치를 만들었다면 검증 후 canonical CSS에 흡수하고 패치파일은 삭제합니다.

## 5. JavaScript

### config/data

- 데이터만 소유합니다.
- DOM 조작 금지
- CSS 주입 금지
- Footer 생성 금지

### app/runtime

- 사용자 동작과 데이터 렌더링만 담당합니다.
- 메인 Footer를 `innerHTML`로 교체하지 않습니다.
- `<style>`을 동적으로 만들지 않습니다.
- 전역 MutationObserver를 사용하지 않습니다.
- 같은 콘텐츠를 별도 후처리 JS가 재렌더링하지 않습니다.

## 6. 상세문서

동적·정적 상세문서는 콘텐츠 생성방식이 달라도 같은 외곽 규격을 사용합니다.

- 공통 shell
- 해당 프로젝트 canonical content CSS
- 동일 본문 type scale
- 동일 복귀링크
- 동일 Footer

정적 전문글이라는 이유로 별도 `research-footer.css`, `reader-fix.css` 등을 만들지 않습니다.

목차 번호는 본문 번호와 대응합니다. 번호를 숨기는 CSS를 사용할 경우 같은 canonical owner가 대체 번호를 책임집니다.

## 7. Footer

Footer 규격은 `COPYRIGHT_STANDARD.md` 한 문서를 기준으로 합니다.

Nexus 메인과 동일한 중앙정렬 단일열을 사용하며 콘텐츠 CSS가 좌측정렬·2열·다른 글자크기로 바꾸지 않습니다.

표시 순서:

1. 프로젝트명
2. 짧은 설명
3. 사업자정보
4. Copyright
5. 문의
6. AI 활용 안내
7. 맨 위로 이동

## 8. 캐시

- 캐시 정책은 `_headers`가 소유합니다.
- HTML과 운영 핵심 CSS에 `no-cache/no-store`가 적용된 경우 캐시 문제를 해결하기 위해 새 CSS 복사본을 만들지 않습니다.
- 쿼리 버전은 배포 식별용이며 새로운 소유 파일을 의미하지 않습니다.
- 구형 캐시 호환 규칙은 production CSS에 무기한 남기지 않습니다.

## 9. 감사와 구조 검증

기존 감사파일을 확장하여 사용합니다. 같은 목적의 감사파일을 계속 추가하지 않습니다.

- `scripts/audit-web-architecture.mjs`: 전체 웹 구조
- `scripts/audit-style-ownership.mjs`: CSS 소유권·중복 레이어·patch 파일
- `scripts/audit-business-footer.mjs`: 사업자정보·Footer canonical 규격
- `scripts/audit-repo-hygiene.mjs`: 삭제파일·불필요 생성물·단일 원본

`Web Architecture Audit`은 메일 반복을 피하기 위해 수동 실행을 유지합니다.

## 10. 변경 프로세스

수정 전에 반드시 다음 순서를 따릅니다.

1. 문제 화면 확인
2. 현재 owner 확인
3. 중복 owner 여부 확인
4. canonical owner만 수정
5. 기존 patch가 불필요해졌으면 삭제
6. 감사 규칙으로 재발 차단
7. 변경 파일 수를 검토
8. production 반영

새 파일 생성은 마지막 수단입니다. 기존 canonical owner로 해결 가능한 경우 새 CSS·JS·MD·DOM 제어파일을 만들지 않습니다.

## 11. GitHub와 배포

- production branch는 `main`입니다.
- 단순 변경은 불필요한 PR을 만들지 않습니다.
- 대규모 구조 변경은 안전한 작업 브랜치에서 수정·점검한 뒤, 별도 리뷰가 필요하지 않으면 PR 없이 fast-forward 방식으로 `main`에 반영할 수 있습니다.
- PR은 사용자가 요청하거나 실제 코드리뷰가 필요한 경우에만 사용합니다.
- Cloudflare Preview가 필요하지 않은 경우 PR/비생산 브랜치 자동배포를 작업 절차의 필수 단계로 만들지 않습니다.

## 12. 현재 canonical 예시

### Nexus 글·연구 아카이브

- 공통: `nexus/portal-v2.css`
- 콘텐츠: `nexus/articles/articles.css`
- 데이터/렌더링: `articles.json` + `articles.js`
- 날짜형 `public-layout-20260820.css`는 canonical CSS에 흡수 후 제거
- `index.html`과 `article.html`의 페이지별 `<style>`은 제거

이 패턴을 이후 Nexus 하위 문서 정리의 기준 모델로 사용합니다.
