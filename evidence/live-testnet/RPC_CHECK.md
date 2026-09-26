# [Live Testnet] RPC 연결 확인

- 상태: 성공, read-only
- 실행 UTC: 2026-09-25T17:54:19.535Z (한국 시각 2026-09-26)
- 환경: Windows / Node v22.14.0 / npm 11.2.0
- 재현 명령: npm run check:rpc
- RPC: https://rpc-testnet.maroo.io
- 호출: eth_chainId, eth_getBlockByNumber(latest)
- 예상: chain 450815와 최신 블록 응답
- 실제: chain 450815, block 19089874
- block hash: 0x3b1a8bdaf7eb446a627b16874111d5a45ac02a480bd42bc843058923bbc8a511
- 응답: RPC_CHECK.json
- stateChange: false; tx hash 없음
- 검증 범위: 테스트넷 연결과 chain 일치
- 미검증: 계정 잔액, OKRW 상태 변경, PCL/Privacy integration

이 조회는 Track B의 상태 변경 시도 요건을 충족하지 않습니다. 재실행 시 블록 번호는 변합니다.
