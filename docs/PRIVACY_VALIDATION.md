# Privacy 검증 범위

[Local] Clairveil SHA af04cfc994a3da87a8b1b902eda0988feb512539, Go 1.25.13, Ubuntu/WSL2에서 실제 노드·개발용 회로를 사용했습니다. deposit 10, 준비 self batch, Bob에게 7 지급 모두 code 0. Alice 3 / Bob 7 및 반복 Bob scan을 확인했습니다. 새 계정·genesis로 재현했으며 artifacts와 build cache는 재사용했습니다.

증거: [최초 실행](../evidence/local/LOCAL_PRIVACY_LIFECYCLE.json), [독립 재현](../evidence/local/LOCAL_PRIVACY_REHEARSAL.json). 실행: [LOCAL_RUN](../demo/clairveil/LOCAL_RUN.md).

## Maroo 상태

[Live Testnet] Privacy 대상 PCL 설정을 조회했습니다. 지정 EAS 스키마는 bytes32 kakaoIdHash, uint8 version이며 당시 실행 계정의 해당 인덱서 증명 수는 0이었습니다. 자체 데모 EAS는 이 자격을 대신하지 않습니다. 사용자가 체험한 사이트 경로는 simulation이며 실제 UID/tx를 얻지 못했습니다.

[Docs Only] 유효한 Maroo Privacy 호출을 만들기 위한 현재 배포 circuit pin, compatible proving artifacts, public state/Merkle witness query, proof serialization/known-good fixture의 연결을 확보하지 못했습니다. 최초 실행 차단은 유효 payload 준비 단계이며, 온체인 proof 거절을 관찰한 것이 아닙니다. 임의 proof를 보내지 않았습니다.

## 신뢰·공개 경계

| 주체·표면 | 역할과 이번 범위 |
|---|---|
| 공개 EVM/RPC | 주소·해시·공개 금액·이벤트 등 노출. 모든 단계가 비공개라는 주장 금지 |
| 수신 지갑 | 자신의 키로 note를 찾아 잔액 확인. 로컬 검증 |
| prover | witness를 처리하는 신뢰 경계. 로컬 개발 환경 사용, 원격 서비스 운영 미검증 |
| 감사 주체 | 별도 감사키·접근 권한 설계 필요. config 설정은 했지만 복호화 실험은 미검증 |
| 정책 관리자·발급자 | 정책과 자격의 변경 권한. 데모와 운영 거버넌스 구분 |

운영용 키 custody, 감사 권한, 장애 복구, trusted setup·외부 보안 검토는 live 실행 선행 자료 확보와 별도 과제입니다.
