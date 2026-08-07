# 3분 쉼표

기존 Direct Upload 원본 ZIP의 전체 자료를 이관한 GitHub 관리형 기준본입니다.

## 콘텐츠 구성

- 명언 50개
- 생활영어 50개
- 성경 핵심 의미 50개
- 미니퀴즈 50개
- 총 200개 콘텐츠
- 한국시간(Asia/Seoul) 기준 날짜별 자동 순환
- 카테고리별 전용 배경 이미지 4장
- PWA 설치 및 서비스워커 캐시 지원

실제 콘텐츠 원본은 `app.js`입니다. `app.js`를 수정하면 GitHub Actions가 `CONTENT_CATALOG.csv`와 `VALIDATION_REPORT.md`를 다시 생성하고 콘텐츠 수·중복·퀴즈 정답·해설을 검증합니다.

## GitHub → Cloudflare Pages

- Repository: `yehavha2024-hash/yehavha-site`
- Production branch: `main`
- Root directory: `three-minute-break`
- Framework preset: `None`
- Build command: `exit 0`
- Build output directory: `.`

새 Git-connected Pages 주소가 검증될 때까지 기존 Direct Upload 주소는 유지합니다. 새 주소가 확정되면 `nexus.project.json`을 공개 전환하여 YEHAVHA Nexus 링크를 자동 교체합니다.

## 통합 정보

- YEHAVHA Nexus: https://yehavha-nexus-hub.pages.dev/
- 문의: kimbrighth@gmail.com

Copyright © 이명훈 2026. All rights reserved.
