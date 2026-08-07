# 토익인간 100일 프로젝트

기존 Direct Upload 원본 ZIP의 전체 학습자료를 이관한 GitHub 관리형 기준본입니다.

## 콘텐츠 구성

- 핵심어휘 100개
- 숙어·연어 100개
- 문장암기 100개
- 문법함정 100개
- 실전문제 100개
- 100일 × 5개 영역 = 총 500개 학습카드
- 첫 접속일을 DAY 1로 저장하고 한국 날짜 기준으로 자동 진행
- 학습완료·완료일·오답문제 기록을 브라우저에 저장
- 브라우저 영어 TTS를 이용한 발음·문장 듣기
- PWA 설치 및 서비스워커 캐시 지원

실제 학습데이터 원본은 `content.js`입니다. `content.js`를 수정하면 GitHub Actions가 `content.json`, `CONTENT_CATALOG.csv`, `VALIDATION_REPORT.md`를 다시 생성하고 100일 누락·중복·실전문제 정답·해설을 자동 검증합니다.

실전문제는 TOEIC의 일반적인 출제 형식과 업무 영어 문맥을 반영한 자체 제작 문항이며 ETS 또는 YBM의 공식 기출문제를 복제한 자료가 아닙니다.

## GitHub → Cloudflare Pages

- Repository: `yehavha2024-hash/yehavha-site`
- Production branch: `main`
- Root directory: `toeic-human-100`
- Framework preset: `None`
- Build command: `exit 0`
- Build output directory: `.`

새 Git-connected Pages 주소가 검증될 때까지 기존 Direct Upload 주소는 유지합니다. 새 주소가 확정되면 `nexus.project.json`을 공개 전환하여 YEHAVHA Nexus 링크를 자동 교체합니다.

## 통합 정보

- YEHAVHA Nexus: https://yehavha-nexus-hub.pages.dev/
- 문의: kimbrighth@gmail.com

Copyright © 이명훈 2026. All rights reserved.
