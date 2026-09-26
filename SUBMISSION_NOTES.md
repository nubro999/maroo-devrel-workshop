# Submission Notes — Track B

현재 상태: Maroo 실제 송금 재검증, PCL RPC simulation 경계 비교, Clairveil 로컬 Privacy 정상 흐름 및 새 계정 재현 완료. 공개 저장소는 nubro999/maroo-devrel-workshop이다. 지원자 리허설·영상은 아직 미완료다.

## Assumptions / Discrepancies

- 대상은 한국 은행·핀테크·기업 자금관리 조직의 EVM/TypeScript 경험이 있는 시니어 엔지니어다. 4~8주 PoC를 준비하며 지급 정책, 정보 가시성, 키 책임과 실패 진단이 필요하다.
- Primary는 Track B만 제출한다. 시나리오는 Compliant Confidential Vendor Payment다. 지원자는 기밀성과 함께 **정책에 맞지 않는 지급 방지**를 우선했다.
- 세 실행 환경을 하나의 트랜잭션으로 합치지 않는다: `[Live Testnet]` native OKRW 송금, `[Simulation]` 테스트넷 RPC의 PCL 평가, `[Local]` Clairveil의 uclair 비공개 지급.
- Maroo 외부 인터페이스는 공식 Docs와 배포 패키지, Clairveil은 SHA `af04cfc994a3da87a8b1b902eda0988feb512539`를 기준으로 한다. 로컬 개발용 PK/VK는 Maroo verifier 호환 증거가 아니다.
- 고정 upstream의 기존 localnet/payroll target은 static/legacy 성격이다. 해당 출력으로 정상 흐름을 주장하지 않고 별도 node 초기화·입금·이체·scan을 수행했다.
- 초기 Windows 환경은 Unix syscall 및 native secret profile 조건에서 실패했다. 지원자 판단으로 Linux/WSL2를 기본 환경으로 전환했다. generated source의 CRLF 문제는 원본 LF를 유지해 해결했다.
- EAS 발신자 조건을 수취 공급업체 KYB 검증으로 바꿔 설명하지 않는다. 법적 규제 준수 자체를 인증하는 결과물이 아니다.
- UI, 핵심 프로토콜 수정, production custody, 모든 primitive 연동은 범위에서 제외한다.

## Validation

실제 명령·환경·성공/실패는 [WORKLOG](WORKLOG.md), [Privacy 보고서](docs/PRIVACY_VALIDATION.md), evidence 폴더에 기록했다.

| 분류 | 검증 | 결과·증거 |
|---|---|---|
| Live Testnet | 과거 사용자 1 tOKRW 송금의 RPC 재검증 | chain 450815, block 19148348, receipt status 1, 수취 잔액 0→1. [거래](https://explorer-testnet.maroo.io/tx/0x0e47b177aea4f55b83967dcb3082a7e62e5f7afc13fe2bf068ff6ff27d4284ef), [JSON](evidence/live-testnet/OKRW_TRANSFER_VERIFIED.json). 이번 복구 중 새 송금 없음 |
| Live Testnet | 공개 PCL/Privacy 조회 | 블록 19173032에서 5개 조회 PASS. [JSON](evidence/live-testnet/PRIVACY_PUBLIC_PROBE_LINUX.json). 정책 집행 완료와 다름 |
| Simulation | PCL 금액 경계 비교 | 같은 블록 19174089에서 1 및 2,000,000은 추정 통과, 2,000,001은 AnyOfRejected → VolumeAboveMaxLimit/EasNoAttestationReceived. [JSON](evidence/local/PCL_ESTIMATION_PROBE.json). 잔액 override 사용, broadcast 없음 |
| Local | node + development artifact + 실제 Privacy lifecycle | deposit 10 → transfer 7 → Alice 잔여 3 / Bob 수취 7. 준비 batch를 포함한 3개 거래 모두 포함 code 0. [JSON](evidence/local/LOCAL_PRIVACY_LIFECYCLE.json) |
| Local | 새로운 계정/체인으로 재현 | run-local.py 완료, Bob 반복 scan 안정성 PASS. [JSON](evidence/local/LOCAL_PRIVACY_REHEARSAL.json). artifact/빌드 cache만 재사용 |
| Local | SDK 및 witness 검사 | Linux deposit/transfer 2개 패키지 PASS; 최초 test/subtest PASS 160 / SKIP 2. 이후 artifact를 넣어 skipped witness 2개 모두 PASS. [SDK](evidence/local/LINUX_SDK_TESTS.json), [artifact](evidence/local/LINUX_ARTIFACT_TESTS.json) |
| Local | 제출 저장소 검사 | Node 22.14.0 테스트 10/10 PASS. 비밀 자동 검사 PASS(best effort). 이 검사만으로 비밀 부재를 보증하지 않음 |
| Docs Only | Maroo Privacy live 선행 자료 조사 | 공개 자료 조사 범위에서 배포 circuit/artifact/query/serialization 연결 근거를 확보하지 못함. [조사 목록](evidence/docs-only/PRIVACY_SOURCES.json). 기능 부재 주장이 아님 |

재현 명령(제출 저장소 루트, Node 22):

```bash
node scripts/verify-known-transfer.mjs 0x0e47b177aea4f55b83967dcb3082a7e62e5f7afc13fe2bf068ff6ff27d4284ef
node scripts/probe-pcl-estimation.mjs
node scripts/decode-pcl-evidence.mjs
```

로컬 node는 [Linux 실행 절차](demo/clairveil/LOCAL_RUN.md)를 따른다. Python 3, Git, Go 1.25.13 linux/amd64 사용. 새 소스에서 빌드했고, 별도 chain home 및 로컬 시험 키를 생성했다. 준비된 bundle의 재사용은 공개 config/registry identity 검증을 거친다. 키·원본 지갑 note는 공개 evidence에서 제외했다.

과거 Windows 전체 Go 검사 실패, 제한 시간 초과, artifact skip은 원본 기록으로 보존했다. Linux의 제한된 성공을 전체 upstream 테스트 성공으로 확대하지 않는다. 전체 70분 참가자 리허설은 아직 수행하지 않았다.

## AI Usage

도구: Codex.

1. **요구사항·학습 여정 구조화:** Interview Brief에서 Track B 대응표, 참가자/진행자 가이드, 실패 분류·검증 기준을 만들었다. 파일 존재를 완료로 세지 않고 실제 증거와 대조했다.
2. **실행과 진단 가속:** TypeScript guard/증거 출력, 고정 upstream 분석, Linux 개발용 artifact·config 준비, node lifecycle 자동 재현, PCL 정책 bytes와 중첩 오류 해석을 구현했다. SDK 검사, 실제 local receipt·scan 및 RPC 결과로 확인했다.
3. **AI 오류와 수정:** 공개 evidence만 보고 실제 Maroo 송금을 아직 하지 않았다고 잘못 판단했다. ignored `.private/evidence`에 기존 성공 receipt가 남아 있음을 발견하고, 같은 hash의 RPC receipt status 1과 수취 잔액 0→1 tOKRW를 대조해 수정했다. 불필요한 중복 송금 없이 기록을 복구했다.
4. **추가 구현 오류:** AI의 초기 키 입력 검사가 0x 없는 64자리 hex를 누락으로 취급했다. 사용자의 실패 로그와 비밀을 출력하지 않는 형식 검사로 확인하고 두 형식 지원·오류 메시지 분리·회귀 테스트로 수정했다. WORKLOG 006 참조.

사람의 명시적 판단: Track B 단독 집중, 정책에 맞지 않는 지급 방지 우선, 참가자가 처음부터 직접 설정하고 실행하는 여정, Linux/WSL2 기본 환경. 세부 PCL simulation 설계와 최근 성공 결과의 해석은 AI가 제안·검증했으며, 지원자 설명 리허설과 최종 채택은 아직 필요하다.

## DX Feedback

| 문제 | 재현·근거 | 사용자·심각도 | 개선안·owner |
|---|---|---|---|
| Privacy ABI 예제와 npm 배포 경로 차이 | 0.0.9에서 문서의 abi/IPrivacy 경로는 ERR_MODULE_NOT_FOUND, 실제 abi/precompiles/privacy/IPrivacy 사용 성공. [검사](evidence/local/PRIVACY_ABI.json) | EVM integrator, 중: RPC 전에 import 실패 | 문서에 package version/import/export 고정 및 예제 smoke test. Maroo Docs/package 담당 |
| Windows에서 native Privacy 실행 차단 | Unix syscall 빌드 실패와 secret profile 지원 OS 거부. [환경 진단](evidence/local/PRIVACY_ENVIRONMENT.md). Linux에서 실제 lifecycle 성공 | Windows 기반 참가자, 높음: 정상 흐름 진입 차단. Windows 지원 약속 위반이라는 뜻은 아님 | getting-started에 OS/CPU preflight와 검증된 WSL 경로. Clairveil docs/tooling 담당 |
| native V2의 수동 준비 부담 | audit artifact 4종·공개 config/PoP·genesis·계정·gentx·node·scan을 별도 조합해야 했다. [실행 절차](demo/clairveil/LOCAL_RUN.md), [재현](evidence/local/LOCAL_PRIVACY_REHEARSAL.json) | 시간 제한 워크숍 진행자, 높음: 준비와 본 실습 분리 필요 | exact-pin 개발용 bootstrap과 공개 결과 요약 제공. Clairveil examples 담당. 이번 제출에서 run-local.py로 보완 |

추가 후보 및 이 제출 저장소 자체의 금액 표시·키 검사 문제는 [DX_LOG](DX_LOG.md)에 분리했다. 조사하지 않은 자료 부재를 제품 결함으로 확정하지 않는다.

## Known Limitations

- PCL 거부는 실제 테스트넷 RPC simulation이며 balance override를 사용했다. 포함된 거부 transaction, 관리자 권한/정책 변경, 모든 계정과 모든 경로의 집행을 입증하지 않는다.
- Maroo valid Privacy 정상 흐름은 미검증이다. 배포 circuit identity, compatible artifact, public state/Merkle witness query와 serialization/fixture 연결이 필요하다.
- 로컬 artifact는 개발용 setup이다. 새 source·chain·accounts로 재현했지만 두 번째 실행은 artifact와 빌드 cache를 재사용했다.
- auditor 복호화, 이중 지출/모든 공격 입력, 장애 복구 전체, wallet 암호화와 production custody는 이번 정상 흐름 검증에 포함되지 않았다.
- production 전에는 key custody, prover 운영·비밀 노출, auditor 권한, PCL administration, monitoring, retry/reconciliation, upgrade 및 incident recovery가 필요하다.
- 60~75분은 운영 설계값이며 참가자와의 전체 리허설로 확정하지 않았다. artifact/build는 pre-work다.
- 공개 저장소 URL은 README에 제공한다. 5~8분 영상 링크는 아직 추가해야 한다. 지원자는 최종 문서·비밀 검사·설명 내용을 직접 검토해야 한다.
