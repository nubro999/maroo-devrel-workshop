# 지급 결과와 가스비 읽는 법

이번 PCL 실습에서는 **정상 지급은 성공했고, 송신자를 차단한 뒤에는 같은 지급이 실패했습니다.** 실패 거래는 실험에서 의도한 결과입니다.

## 먼저 볼 세 가지

| 로그 | 확인할 값 | 뜻 |
|---|---|---|
| normal-payment | status: 1, PolicyCheckPassed | 정책 검사를 통과해 거래가 성공함 |
| normal-payment-verification | recipientDelta: 1000000000000000, paymentCount: 1 | 수취인에게 0.001 tOKRW 지급됨 |
| blocked-state | recipientDelta: 0, countBefore: 1, countAfter: 1 | 차단 후에는 추가 지급되지 않음 |

recipientDelta는 수취인 잔액의 증가량입니다. 최소 단위로 표시하므로 숫자가 길게 보입니다. 이번 실행의 1000000000000000은 0.001 tOKRW입니다. paymentCount는 이 실습 계약에서 성공한 지급 횟수입니다.

- [정상 지급 거래](https://explorer-testnet.maroo.io/tx/0x44f86768832c69fc4bc5998d4926c48b52783c5a5e64391fbc60fe81427c9abd): status 1
- [차단된 지급 거래](https://explorer-testnet.maroo.io/tx/0xc879a3cbbf7061a54526f80443c9f759e10ecc9de7a6025ca95833756307648a): status 0
- [사용자 직접 실행 기록](../evidence/live-testnet/USER_PCL_RUN.json): 2026-09-27, Maroo chain 450815

위 사례는 사용자가 직접 실행한 로그와 로컬 결과 파일을 근거로 정리했습니다. 이번 문서 편집에서는 거래를 다시 전송하거나 RPC로 독립 재검증하지 않았습니다.

## Explorer에는 왜 Gwei라고 표시되나요?

Gwei는 Ethereum에서 사용하는 작은 금액 단위입니다. Maroo Explorer도 EVM에서 익숙한 단위 이름을 사용하는 것으로 보입니다. 이 표기가 ETH로 수수료를 냈다는 뜻은 아닙니다. Maroo의 가스비 자산은 OKRW이며, 이번 테스트넷 실행에서는 tOKRW가 사용됐습니다.

| 항목 | 의미 |
|---|---|
| Gas used | 영수증에 기록된 가스 사용량 |
| Gas price | 가스 1단위당 가격 |
| 총 수수료 | 가스 사용량 × 적용 가스 가격 |

화면의 Gwei 표기만 보고 이를 총 수수료나 ETH 금액으로 읽지 마세요. 이번 실습에서는 실행 로그의 fee 값을 tOKRW로 확인합니다. Explorer의 내부 단위 변환 구현은 확인하지 않았으므로 표기의 원인을 단정하지 않습니다.

참고: [Maroo 수수료 구조](https://litepaper.maroo.io/), [Ethereum의 gas와 Gwei 설명](https://ethereum.org/developers/docs/gas/).

## 실패했는데 왜 수수료가 발생하나요?

체인은 요청을 처리하고 정책을 검사한 뒤, 거절된 결과를 블록에 기록했습니다. 지급과 관련된 상태 변경은 되돌려지지만, 거래 처리에 따른 수수료는 발생합니다.

| 방금 실행한 실패 거래 | 결과 |
|---|---|
| 보내려던 금액 | 0.001 tOKRW |
| 실제 수취인 잔액 증가 | 0 |
| 로그에 기록된 거래 수수료 | 2.25 tOKRW |

즉, **지급액은 수취인에게 전달되지 않았고, 송신자는 실패 거래의 수수료를 부담했습니다.** 모든 실패가 같은 수수료를 쓰는 것은 아닙니다.

## 사전 검사와 실제 실패 거래는 다릅니다

1. blocked-preflight: 전송 전 RPC 시뮬레이션에서 InDenylist를 확인했습니다. 이 검사 자체는 온체인 거래가 아니므로 온체인 수수료가 없습니다.
2. blocked-payment-submission: 실패 영수증까지 확인하려고 실제 거래를 전송했습니다. 블록에 포함됐고 status 0과 수수료가 기록됐습니다.

일반 서비스는 사전 검사에서 거절된 요청을 보내지 않도록 만들 수 있습니다. 다만 검사 후 상태가 바뀔 수 있으므로 사전 검사 성공이 최종 거래 성공을 보장하지는 않습니다.

## 오류가 깨진 문자로 보이는 이유는 무엇인가요?

아래 Raw는 문장 대신 오류 식별자와 인자를 담은 Solidity custom error입니다.

```text
0x0201b218000000000000000000000000c4a50f04b3eb7b95f87639d6133db89e3cdc407c
```

공식 PCL ABI로 해석한 결과:

```text
InDenylist(0xC4A50f04B3eB7B95f87639d6133Db89E3cdC407C)
```

뜻은 ‘송신자 주소가 차단 목록에 있다’입니다. 터미널에서는 올바르게 해석됐지만 Explorer의 Decoded 표시가 깨졌습니다. 정책은 정상 작동했고, 오류 표시 방식은 DX 개선 대상으로 기록했습니다. Explorer 내부 원인은 미확인입니다.

## 마지막 로그는 무엇인가요?

- restore-allow-policy, status 1: 실험 후 차단 목록을 비웠습니다.
- direct-implementation, proxy only: 구현체를 직접 호출하는 경로를 실습 계약이 막았습니다. 이는 계약의 별도 보호장치이며 Denylist 거절과 다릅니다.

이번 실행은 Denylist 실습입니다. EAS 자격이나 Privacy 지급까지 실행한 것으로 해석하지 않습니다.
