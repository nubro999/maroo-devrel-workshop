# 실행 증거 색인

## 1. PCL / 실제 Maroo Testnet

프록시 `0x88efE0F72e5C095FE98a925682692D7787B5062F`, chain 450815.

| 조건 | 거래 해시 | 판정 |
|---|---|---|
| Denylist 정상 | 0xebc1c13aca434e747041db34e1bb3ef8f81bc538a0d15c68611aa60a88221eb0 | status 1, 수신자 +0.001 |
| Denylist 차단 | 0xa365d1866e419ed9a8d8ac635bbaf0ef2ed94900c70ff83d18fcadd84556628c | status 0, InDenylist |
| EAS 없음 | 0x5a71c85ce976cc3a29e1df5f3ccf37f072f8c9551c898a6de9f4ebb8d5b60f16 | status 0, EasNoAttestationReceived |
| EAS 유효 | 0xf70621810d9137187400b4493233e597529a094029630f027a328cf1d56c698d | status 1, PolicyCheckPassed |
| EAS 폐기 | 0x9f9f3beb6477036c846f7cf99c3856bf235822b59513c82b3cced6613003f532 | status 0, EasAttestationRevoked |
| false 유효 | 0x69f42f10fd795af26af78f717d676b1e6bba05d119e9886e786ffec706afc07b | status 1, bool true 강제 안 됨 |
| true 유효 | 0x9810ab00b4d6ec3dab6accd4aa5e2cb1c435bd1bc75a458bf8f039073b33a917 | status 1 |

Explorer 주소는 `https://explorer-testnet.maroo.io/tx/<hash>`입니다. [PCL JSON](../evidence/live-testnet/PCL_PROXY_VERIFIED.json), [EAS JSON](../evidence/live-testnet/EAS_LIFECYCLE_VERIFIED.json), [bool JSON](../evidence/live-testnet/EAS_BOOLEAN_VERIFIED.json). 전체 입력과 발생 순서는 각 RESULT JSON을 참고합니다. 지급액 단위는 tOKRW입니다.

## 2. Privacy / Local

[LOCAL_PRIVACY_LIFECYCLE](../evidence/local/LOCAL_PRIVACY_LIFECYCLE.json), [LOCAL_PRIVACY_REHEARSAL](../evidence/local/LOCAL_PRIVACY_REHEARSAL.json): deposit 10, transfer 7, Alice 3/Bob 7 uclair. 실제 포함 code 0와 반복 scan. Maroo Explorer 링크가 없는 로컬 거래입니다.

## 3. 보조 자료

PCL_ESTIMATION_PROBE는 balance override가 있는 Simulation입니다. PRIVACY_PUBLIC_PROBE는 조회 증거로, Privacy 상태 변경 성공이 아닙니다. 과거 조사 파일은 기록 시점의 상태이며 현재 판정은 SUBMISSION_NOTES와 PRIVACY_VALIDATION을 우선합니다.

## 사용자 직접 실행 — 2026-09-27

[USER_PCL_RUN.json](../evidence/live-testnet/USER_PCL_RUN.json): 프록시 0xA2C2517c26503A31a4A6aD54402f6eDEbfA0184a, 정상 지급·Denylist 거절·복원. [읽는 법](GAS_AND_RESULTS.md). 사용자 로그와 로컬 결과 파일 기준이며 이 편집에서 별도 RPC 재검증하지 않았습니다.
