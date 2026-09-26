# PCL·EAS 실제 지급 실습

Node 22.14 또는 24, npm, 테스트 계정과 수신자 주소가 필요합니다. 저장소 루트에서 실행합니다. 기본 실행은 안내만 출력합니다. `--broadcast`는 실제 테스트넷 거래를 전송합니다. `.env`의 `MAROO_PRIVATE_KEY`와 `MAROO_RECIPIENT`를 사용하며 키를 출력하지 않습니다. 기존 송금과 같은 계정을 쓰려면 MAROO_ADDRESS도 일치시키세요. PCL 데모의 지급액은 건당 0.001 tOKRW로 고정됩니다.

```bash
npm ci
npm run setup
npm run check:rpc
npm run lab:pcl
npm run lab:pcl -- --broadcast
npm run lab:eas -- --broadcast
# 추가 실험: false/true 값 비교
npm run lab:boolean -- --broadcast
```

## 무엇을 실행하는가?

| 명령 | 동작 | 기존 관찰 |
|---|---|---|
| lab:pcl | 전용 지급 구현체·Transparent 프록시 배포, Denylist 설정·지급·차단·복원 | 정상 지급 성공 / 차단 후 status 0 |
| lab:eas | 새 스키마 생성, 같은 프록시에 EAS 조건 연결, 미발급·발급·폐기 비교 | 없음→거절 / 유효→성공 / 폐기→거절 |
| lab:boolean | 새 스키마에서 false와 true 비교 | false도 성공. 내부 bool을 true로 강제하지 않음 |

EAS 데모는 문서의 등록·발급·조회 패턴을 기존 네이티브 지급 계약에 적용합니다. 자체 발급·resolver 없는 실습용 자격으로 실제 KYB와 다릅니다. 발급 후 Indexer.indexAttestation(uid)가 필요했습니다. lab:pcl을 먼저 성공시켜야 뒤 명령이 자신의 프록시를 재사용할 수 있습니다.

## 성공 판정과 비용

해시만 보지 말고 포함 영수증, PolicyCheckPassed, 수신자 잔액 변화 및 paymentCount를 확인합니다. 실패 사례는 의도적으로 실제 전송해 status 0 영수증을 얻으며 수수료가 발생합니다. historical 실험 수수료는 PCL 22.300173, EAS 17.810181, bool 비교 27.114012 tOKRW였습니다. 환경에 따라 달라집니다. 각 실행의 예상 최대 수수료 합계를 100 tOKRW로 제한합니다. 지급액은 별도입니다.

산출물은 `.private/pcl-proxy/`, `.private/eas-privacy-run/`, `.private/eas-boolean-run/`에 저장됩니다. schema·프록시는 매 실행 새로 생성되며, 기존 디렉터리가 있으면 덮어쓰지 않고 중단합니다. 같은 테스트 계정을 여러 프로세스에서 동시에 사용하지 마세요.

## 초기화·오류 복구

- 성공 후 실습 프록시 정책을 복원하고 데모 증명을 폐기합니다. 등록된 스키마와 거래 기록은 체인에 남습니다.
- 중단 시 마지막 submitted 해시의 영수증부터 조회합니다. 타임아웃을 실패로 간주해 재전송하지 않습니다.
- EAS 스크립트는 정책 복원을 시도하고 결과를 기록합니다. 강제 종료·네트워크 장애 시 복원이 보장되지 않으므로 RESULT의 restored/restoreFailure를 확인합니다.
- 재실행 전 실행 기록을 보관하고 `.private` 안의 해당 실험 폴더를 다른 이름으로 이동합니다. lab:pcl부터 새 프록시로 다시 시작합니다. 다른 사용자의 상태나 전체 홈은 삭제하지 않습니다.
- 로컬 폴더 변경은 체인 상태 초기화가 아닙니다.

원 실행 스크립트로 실제 테스트넷 거래가 검증되었습니다. 제출용은 경로를 상대화하고 broadcast 명시 및 출력 덮어쓰기 방지, 영수증 기반 실패 판정 및 정책 복원 결과 확인을 추가했습니다. 포장 후 네트워크 쓰기 재실행 여부는 workshop/VALIDATION.md에 구분해 기록합니다.
