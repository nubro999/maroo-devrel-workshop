# Validation — 실행 후 채우는 체크리스트

상태: **RPC와 환경 검사는 실행 완료, 나머지 기능 검증은 미완료**. 상세 결과는 [환경 검증 기록](../evidence/local/SETUP_VALIDATION.md)을 참조한다. 스크립트 자체 검사와 Track B 기능 검증은 별도다. 실제 결과는 루트 SUBMISSION_NOTES와 evidence에 기록한다.

## 깨끗한 환경

공개 제출 checkout을 새 디렉터리에 준비한다. 이전 `.env`, 계정, node_modules, 로컬 체인 상태를 복사하지 않는다. 루트 README의 런타임을 설치한다.

```sh
npm ci
npm run setup
npm run typecheck
npm test
npm run secrets:check
```

- [ ] OS·Node·npm 버전, 저장소 ref, package-lock을 기록했다.
- [ ] `.env`가 추적되지 않고 `.env.example`에 비밀값이 없다.
- [ ] Clairveil은 별도 ignored checkout이며 실제 SHA를 기록했다.
- [ ] upstream 코드 사용 범위·라이선스를 확인했다.

## 수동 스모크/증거

| 검증 | 통과 조건 | 증거 위치 | 상태 |
|---|---|---|---|
| RPC | 기대 체인·블록 응답 | evidence/live-testnet/RPC_CHECK.md | 성공 (read-only) |
| 잔액 조회 | 요청 주소와 원시 잔액 일치 | evidence/live-testnet/BALANCE_READY.json | 과거 실행 성공; 현재 잔액 아님 |
| transfer dry run | 전송되지 않고 대상/금액 검토 가능 | evidence/live-testnet/TRANSFER_PREVIEW.json | 과거 미리보기 성공; 서명/전송 없음 |
| OKRW live 제출 | 실제 상태 변경 시도 기록; 성공/실패 구분 | evidence/live-testnet/OKRW_TRANSFER_VERIFIED.json | 과거 사용자 거래 재검증 PASS |
| 송금 성공 판정 | receipt 성공과 수신자 잔액 변화 | evidence/live-testnet/OKRW_TRANSFER_VERIFIED.json | status 1, 수취 0→1 tOKRW |
| PCL | 정책이 실행/거부를 바꾸는 근거와 비교 입력 | evidence/local/PCL_ESTIMATION_PROBE.json | RPC simulation 경계 PASS; 온체인 거부 아님 |
| live Privacy 가능성 | circuit/artifact/query/serialization·호환성 확인 또는 누락 근거 | docs/PRIVACY_VALIDATION.md | 조사 범위의 누락 기록 완료; live 정상 흐름 BLOCKED |
| local Privacy | 같은 SHA에서 deposit → transfer → recipient scan 연결 | evidence/local/LOCAL_PRIVACY_LIFECYCLE.json | Linux 실제 노드에서 PASS; Maroo 호환성 아님 |
| 워크숍 리허설 | pre-work 후 60~75분 내 완료·실패 판정 가능 | evidence/local | 미실행 |

실패 시에는 명령·입력(비밀 제거)·시간·환경·예상/실제·최초 실패 계층·다음 확인을 기록한다. CLI exit 0만으로 온체인 성공이나 PCL 강제를 판정하지 않는다. placeholder 종료는 기능 검증 통과가 아니다.

## 초기화와 정리

Maroo 테스트넷 기록은 로컬 정리로 삭제되지 않는다. 새 전용 계정/수신자를 쓰고 이전 tx는 증거로 보존한다. 같은 금액 재전송을 초기화로 취급하지 않는다.

Clairveil 초기화는 고정 SHA의 upstream 절차를 확인한 뒤 해당 로컬 데이터 디렉터리에만 적용한다. 아직 검증된 reset 명령이 없으므로 임의 삭제 명령을 제공하지 않는다. 정리 전에 비밀이 없는 로그를 evidence에 옮기고, 실행 프로세스를 종료하고, 폐기할 로컬 테스트 키를 제거한다. 원본 로그·artifact·지갑 상태가 든 `.external`은 커밋하지 않는다.

## 최종 판정

- [ ] Primary B의 OKRW·PCL·Privacy 의미 있는 연결을 설명하고 실행/미실행을 구분했다.
- [ ] Track B 상태 변경 실제 시도와 end-to-end privacy 증거를 확보했다.
- [ ] live와 local의 결과를 합쳐 호환성/production 준비도를 주장하지 않았다.
- [ ] git 전체 기록까지 비밀·실제 개인정보를 검토했다. 자동 검사만으로 완전한 탐지를 보장하지 않는다.
- [ ] 영상 링크와 SHA, DX 3건, AI 오류 검증 사례가 실제 근거로 채워졌다.

