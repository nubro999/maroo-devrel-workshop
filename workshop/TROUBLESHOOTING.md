# Troubleshooting

| 증상 | 원인·판정 범위 | 확인 | 대응 |
|---|---|---|---|
| explore:pcl에 Docs Only | 기존 안내용 placeholder. 관찰됨 | placeholder-no-network-call | privacy:public로 실제 정책 조회, decode-pcl-evidence로 해석 |
| Type Stripping 경고 | Node 실험 기능 경고. 관찰됨 | 다음 출력·종료 코드 | 경고와 실행 실패를 구분 |
| 체인 ID 불일치 | RPC 설정 오류 가능 | check:rpc, 450815 비교 | 올바른 테스트넷으로 수정 후 진행 |
| insufficient funds | 지급액+가스 부족 | balance 및 추정 비용 | faucet 자금 준비. 정책 차단으로 세지 않음 |
| EAS 발급했으나 자격 없음 | 인덱서 미등록 가능. 관찰됨 | getAttestation와 index count 비교 | indexAttestation 후 재조회 |
| EasAttestationRevoked | 폐기된 증명. 관찰됨 | revocationTime | 의도한 거절인지 확인. 재시도 대신 자격 수명주기 점검 |
| Explorer Decoded 깨진 문자 | 커스텀 오류 표시 문제. 사용자 관찰 | Raw를 IPcl ABI로 parseError | 오류 이름·주소를 함께 표시 |
| false 증명인데 지급 성공 | 이번 정책은 bool true를 강제하지 않음. 관찰됨 | data 디코딩·receipt·잔액 | 승인된 대상만 발급·취소 시 폐기. 발급자 제한 별도 |
| EEXIST 실행 디렉터리 | 이전 기록 덮어쓰기 방지 | .private/<실험> | 마지막 해시 확인 후 기록 보관·새 실행 |
| submitted 이후 timeout | 포함 여부 불명 | hash로 receipt 조회 | 무조건 재전송 금지 |
| 로컬 artifact/config 불일치 | 회로 identity·감사 설정·버전 차이 가능 | pinned SHA·manifest·node 로그 | 동일 번들과 새 전용 run-dir 사용 |
| Windows native 빌드 실패 | 해당 native 지원 환경 문제. 관찰됨 | Unix syscall·secret profile 로그 | 검증된 Linux/WSL2 경로 |
| Maroo Privacy proof 생성 불가 | 호환 artifact/query 미확보 | 공개 선행 자료 체크 | local reference 실습으로 전환, live 미완료 명시 |

3분 이상 인프라 문제에 막히면 진행자는 실제 저장 증거 분석으로 전환합니다. 기존 기록을 당일 참가자 성공으로 표시하지 않습니다. 원시 provider 오류·키·note를 공개하지 않습니다.
