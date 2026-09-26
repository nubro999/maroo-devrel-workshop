# Maroo 스크립트

루트에서 npm run setup 후 사용합니다. 공식 값의 출처는 [SOURCES](../../docs/SOURCES.md)입니다.

| 명령 | 수행 | 필요한 값 |
|---|---|---|
| npm run check:rpc | chainId + latest block | 공개 RPC 기본값 |
| npm run balance | 지정 블록 잔액 | MAROO_ADDRESS |
| npm run transfer:okrw | 가스 추정·잔액·미리보기 | ADDRESS, RECIPIENT, AMOUNT |
| npm run transfer:okrw -- --broadcast | native OKRW 서명·송금·receipt | 위 값 + PRIVATE_KEY |
| npm run explore:pcl | Docs Only 탐색 목록 출력 | 없음 |
| npm run explore:privacy | Docs Only 선행 조건 출력 | 없음 |

체인 ID는 450815만 허용합니다. RPC는 HTTPS를 사용하며 embedded basic auth는 거절합니다. 가스 가격은 RPC 응답을 사용하고 gas estimate에 20% 여유를 둡니다. 실제 정책은 전송 시 바뀔 수 있으므로 estimate 성공은 포함 성공 보장이 아닙니다.

증거는 .private/evidence에 생성됩니다. 조회 실패/입력 실패/estimate 실패는 상태 변경 제출 증거가 아닙니다. transfer-submitted는 pending이고 receipt 성공 확인 전 성공으로 기재하지 않습니다. raw 에러는 민감정보 노출 방지를 위해 자동 출력하지 않습니다.

PCL 다음 작업: 공식 ABI/버전을 기록 → getParams/template 조회 → 필요한 권한 확인 → 정책 허용/거부의 인과관계 증명. 단순 주소 표시로 연동 완료 처리하지 않습니다.
Privacy 다음 작업: circuit pin, artifact, state/witness query, serialization/fixture를 모두 확인 → 호환성 확인 시 정상 경로 우선 → 없으면 최초 막힌 계층과 unblock 입력 기록. 무효 proof를 만들어 전송하지 않습니다.

