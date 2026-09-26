# 출처와 버전

확인일: 2026-09-26. 외부 자료는 아래 확인 범위에서만 사용했습니다.

| 출처 | 확인한 값 / 범위 | 분류 |
|---|---|---|
| https://docs.maroo.io/resources/network/testnet-access | HTTPS RPC rpc-testnet.maroo.io, chain 450815, tOKRW 18 decimals, faucet/explorer | Docs Only |
| https://docs.maroo.io/guides/quickstart/sending-okrw | ethers v6 native value, aokrw 단위, receipt 및 수신 잔액 확인 | Docs Only |
| https://docs.maroo.io/resources/contracts/deployed-contracts | IOkrw 0x1000…0001, PCL …0005, EAS …0009, Agent …000A, ERC20 representation | Docs Only |
| https://docs.maroo.io/concepts/privacy | Privacy 0x100000000000000000000000000000000000000b | Docs Only |
| https://github.com/DELIGHT-LABS/clairveil/tree/af04cfc994a3da87a8b1b902eda0988feb512539 | README, Makefile, getting-started, testing-guide | Docs Only / source inspection |

정확한 전체 주소는 demo/maroo/config.ts에 모았습니다. 주소 확인은 호출 가능성 검증과 다릅니다.
Precompile에서 eth_getCode가 0x라고 해도 부재라고 결론 내리지 않습니다.
EAS preinstall 상세 주소는 공식 ABI를 확보한 뒤 IEas.getParams로 확인할 대상입니다.
Privacy/PCL ABI는 이 저장소에 추가하지 않았습니다.

Clairveil 원본은 Apache-2.0이며 upstream LICENSE/NOTICE를 따릅니다. 코드를 복사하거나 수정하지 않았고 별도 ignored checkout만 사용합니다. ethers/TypeScript는 package-lock.json으로 버전을 고정하며 각 배포 패키지의 LICENSE를 따릅니다. 이 제출물 자체의 공개 라이선스는 소유자가 게시 전에 결정합니다.


