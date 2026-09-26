# 증거 분류

| 디렉터리 / label | 의미 |
|---|---|
| live-testnet / Live Testnet | 실제 Maroo 요청/응답. read, estimate, submitted, included/reverted를 구별 |
| local / Local | 로컬 코드/체인/fixture 검사. 정확한 종류를 기록 |
| docs-only / Docs Only | 문서/소스 확인. 실행 증거 아님 |
| simulation / Simulation | 향후 모의 결과가 있다면 별도 생성. live/local chain 결과와 혼합 금지 |

TEMPLATE 파일은 증거가 아닙니다. CLI 기록은 .private/evidence에 먼저 저장되고 자동 공개되지 않습니다.
검토 후 공개본에는 UTC 시각, 환경, 정확한 재현 명령(credential 제외), 예상/실제, hash/log, 검증/미검증 범위를 남깁니다.
키·seed·bearer token·실제 개인정보·wallet note plaintext·proof witness는 게시하지 않습니다.
실패 시 raw 오류를 무작정 붙이지 말고 민감값을 제거한 정확한 오류·최초 실패 계층·누락 선행 조건을 기록합니다.

