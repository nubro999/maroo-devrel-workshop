# Troubleshooting

상태: **예상 실패 모드 가이드**. 아래 항목은 실제 발생한 장애 목록이 아니다. 재현된 사례만 SUBMISSION_NOTES의 DX Feedback에 증거와 함께 올린다.

| 증상 | 가능한 원인 | 확인 방법 | 해결/다음 행동 |
|---|---|---|---|
| 설치/TypeScript 실행 실패 | 지원하지 않는 Node, 미설치 의존성 | Node 버전과 package.json engines, npm 오류 확인 | 지원 버전에서 `npm ci` 후 typecheck; lock을 임의 변경하지 않음 |
| RPC timeout/HTTP 오류 | endpoint·네트워크·서비스 장애 | `npm run check:rpc`, 시각·오류 기록 | 공식 docs 설정 확인, 제한적 재시도; 지속 시 정제된 이전 로그로 전환 |
| chain ID 불일치 | 다른 네트워크 또는 잘못된 설정 | RPC 응답과 루트 설정 비교 | 올바른 테스트넷 확인 전 broadcast 중지 |
| balance가 주소 오류로 실패 | MAROO_ADDRESS 누락/오타 | `.env.example`과 공개 주소 형식 확인 | 테스트넷 조회 주소 수정; 개인키를 주소 필드에 입력하지 않음 |
| insufficient funds | 잔액/가스 부족 | 송신 주소 잔액, 금액, fee 추정 확인 | faucet 자산 보충 또는 금액 축소; 실제 자금 사용 금지 |
| dry run 후 tx hash 없음 | 기본 비전송 모드 | 출력의 mode 확인 | 예상 동작임; 실제 테스트넷 송금 의도 시에만 `--broadcast` |
| tx hash 있지만 실패/미확정 | 실행 revert, pending, 조회 지연 | 동일 hash의 receipt와 체인 상태 확인 | 상태 확정 전 중복 송금 금지; 실패 원인 기록 |
| PCL 탐색에 정책 결과 없음 | docs-only placeholder | demo/maroo 안내와 명령 출력 확인 | 문서/권한/ABI 확인 후 별도 구현; mock 허용 결과를 만들지 않음 |
| Privacy proof를 만들 수 없음 | 호환 circuit/artifact/query/serialization 미확인 | 필수 선행 자료를 URL·버전별 체크 | 최초 미확인 계층 기록 후 Clairveil local로 이동 |
| 로컬 proof/scan 실패 | SHA·artifact·상태·키 불일치 가능 | upstream 해당 SHA 절차와 같은 실행의 상태 확인 | 버전 일치 확인; 임의 artifact 교체 금지; sanitized 오류 수집 |
| 수취인이 note를 못 찾음 | 다른 수취 키, scan 범위/상태 불일치 가능 | 해당 버전의 수취·scan 설정과 tx 연결 확인 | 정확한 upstream 절차로 재검증; 다른 사람 키 수집 금지 |
| secrets 검사 실패 | 비밀값 또는 탐지 의심 문자열 | 파일 경로와 redacted 결과 확인 | 실제 비밀이면 파일·Git 기록 제거와 폐기/교체; false positive는 근거 검토 |

## 실패 분류

1. 연결 이전 설정 오류: 아직 live 상호작용을 수행하지 않았을 수 있다.
2. RPC 연결/조회 오류: 응답·시각·요청 종류를 보존한다.
3. 입력/정책/proof 거부: 실제 반환 오류와 근거를 기록하고 원인을 단정하지 않는다.
4. receipt 포함 후 revert: 상태 변경 성공이 아니다.
5. 선행 artifact/query 부재: 아직 proof 생성 단계에 도달하지 못했다. 무효 payload를 보내야 할 이유가 없다.

장애 시 진행자는 [대체 운영](FACILITATOR_GUIDE.md)을 적용한다. 로그 읽기에는 원래 실행 시각과 작성자를 표시하고, local/simulation을 live 성공 증거로 재분류하지 않는다.
