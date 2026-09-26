# Privacy 검증 — Track B
## Linux 후속 검증 — 2026-09-27 KST

Windows 실행 차단 이후 WSL2에서 명령 실행을 복구했다. 고정 SHA의 별도 LF checkout을 `/tmp/maroo-privacy-run/clairveil`에 준비하고 기존 설치의 Go 1.25.13 linux/amd64 및 Node 22.14.0을 사용했다.

- 제출 저장소 테스트: 10/10 PASS.
- deposit/transfer SDK: 두 패키지 PASS. test/subtest 종료 이벤트 PASS 160 / SKIP 2. [비밀 없는 상태 요약](../evidence/local/LINUX_SDK_TESTS.json).
- 최초 Skip 2건은 artifact 생성 후 다시 실행해 모두 PASS했다. [후속 검사](../evidence/local/LINUX_ARTIFACT_TESTS.json).
- 새 Maroo 블록 19173032에서 공개 조회 5개 PASS. [새 조회](../evidence/live-testnet/PRIVACY_PUBLIC_PROBE_LINUX.json). 상태 변경 없음.
- 과거 블록 19163317의 PCL bytes를 공식 ABI로 해석하고 재인코딩 일치를 검사했다. [정책 구조](../evidence/local/PCL_DECODED.json). Privacy의 AND(EAS, denylist) 설정을 확인했으며 집행은 미검증이다.
- Linux node 및 개발용 artifact 준비 완료. 실제 체인에서 deposit 10 → transfer 7 → Bob scan 7 / Alice 잔여 3을 확인했다. 준비 거래를 포함한 3건 모두 블록 포함 code 0. [실행 증거](../evidence/local/LOCAL_PRIVACY_LIFECYCLE.json), [재현 절차](../demo/clairveil/LOCAL_RUN.md). Maroo 호환성·PCL 집행 성공은 아니다.

아래 표는 이전 Windows 검사 당시의 기록이다. Windows에서 발생한 OS 차단을 현재 Linux의 실패로 읽지 않는다.

## 이전 Windows 실행 결과

검증일: 2026-09-26 UTC. 시나리오: Compliant Confidential Vendor Payment.

**결론: 공개 테스트넷 조회와 외부 ABI 검사는 통과했다. Clairveil의 실행 환경에서 차단을 재현했다. 로컬 deposit → transfer → scan 및 valid Maroo Privacy 거래 성공은 아직 입증하지 못했다.**


| 구분 | 검사 | 결과와 해석 | 증거 |
|---|---|---|---|
| Live Testnet | chain ID 및 고정 블록 조회 | 450815 확인. 이후 조회를 같은 블록에 고정 | [공개 조회](../evidence/live-testnet/PRIVACY_PUBLIC_PROBE.json) |
| Live Testnet | PCL getParams / globalPolicies / contractPolicies(Privacy) | 3개 호출 PASS. Privacy에 정책 설정이 존재함. 실제 정책 집행·발신/수취인 자격·관리자 권한을 증명하지 않음 | 같은 JSON |
| Live Testnet | Privacy account code | 조회 PASS, 반환 0x. precompile이므로 코드 부재로 기능 부재를 판정하지 않음 | 같은 JSON |
| Live Testnet | 최근 1,000개 블록 Privacy 이벤트 조회 | 조회 PASS, 해당 구간 이벤트 없음. known-good 거래 확보에는 실패했으며 전체 사용 이력이 없다는 뜻이 아님 | 같은 JSON |
| Local | 공식 패키지 ABI, deposit/transfer outer encoding, uint64 overflow, 알려진/미지 오류 selector | 6개 검사 PASS. 합성 입력이며 유효한 proof가 아님 | [ABI 검사](../evidence/local/PRIVACY_ABI.json) |
| Local | 문서의 ABI import 경로 | FAIL, ERR_MODULE_NOT_FOUND. 배포 패키지의 다른 경로로 해결 | 같은 JSON |
| Local | upstream SHA 및 변경 여부 | af04cfc994a3da87a8b1b902eda0988feb512539, clean | [pin](../demo/clairveil/upstream.json) |
| Local | Go toolchain | Go 1.25.13 설치·실행 PASS. 캐시는 ignored .private 아래 | 재현 환경 아래 참조 |
| Local | SDK conformance/deposit/transfer/provertransport/proverservice | FAIL. 일부는 build failed, 일부는 native secret profile 거부. SDK 검증 완료 아님 | [환경 진단](../evidence/local/PRIVACY_ENVIRONMENT.md) |
| Local | WSL 진입 | BLOCKED, Wsl/EnumerateDistros/Service/E_ACCESSDENIED | 같은 진단 |
| Local | JS fixture validator | PASS. legacy/reference fixture 검사이며 V2 lifecycle 아님 | 같은 진단 |
| Local | 제출 저장소 typecheck / 테스트 | PASS / 10개 PASS | 같은 진단 |

전체 Go 검사 결과와 skip은 [CLAIRVEIL_TESTS.json](../evidence/local/CLAIRVEIL_TESTS.json)에 기록했다. 최초 실행 33개 패키지: **PASS 8 / FAIL 22 / 테스트 없음 3**. test/subtest 종료 이벤트는 PASS 923 / FAIL 266 / SKIP 17이며 중첩되므로 독립 시나리오 개수로 합산하지 않는다. circuit와 keeper는 설정한 3분 제한에 걸렸다. native 지원 실패와 timeout을 제품 결함으로 합쳐 주장하지 않는다. artifact-gated integration test가 건너뛰어졌으므로 zk 패키지 PASS도 실제 artifact 흐름 완료가 아니다.

후속 진단에서 generated source 2개의 hash 실패 원인은 CRLF 변환으로 확정했다. 정확한 Git 원본 바이트로 복원한 뒤 frct/scalarct 두 패키지는 재검사 PASS했다. 최초 실패 기록은 유지한다. [줄바꿈 진단 및 재검사](../evidence/local/CLAIRVEIL_LINE_ENDINGS.json). 알고리즘이나 native guard는 바꾸지 않았다.

## 로컬 정상 흐름의 필수 gate

후속 항목은 선행 gate 실패 때문에 실행하지 못한 경우 BLOCKED로 표시한다. 소스에 테스트가 존재하는 것만으로 통과라고 하지 않는다.

| gate | 확인해야 할 조건 | 현재 판정 |
|---|---|---|
| 실행 환경 | Linux/macOS 지원 OS, 지원 CPU 명령, purego 비활성 | **FAIL — 현재 Windows**. Linux/WSL2를 실습 기본값으로 사용자 확정 |
| artifact | 4개 V2 circuit의 R1CS/PK/VK, manifest/hash 일치 | BLOCKED. 검토된 로컬 bundle 미확보. 개발용 setup 경로는 소스로 확인 |
| 공개 설정 | chain ID, network nonce, initial height, 감사 공개키/PoP, circuit identity | BLOCKED. V4 설정을 node/prover/artifact와 일치시켜야 함 |
| node/prover | genesis, 자금, 전용 home, 실제 블록 생성, readiness, V2 prover route | BLOCKED — 환경/설정 선행 필요 |
| deposit | 자금 차감, note 생성, proof 검증, commitment/root, receipt/event | BLOCKED — 실제 chain 미시작 |
| transfer | 소유권, same-root witness, 합계 보존, nullifier, 수취 output | BLOCKED |
| recipient scan | Bob만 note 복호화, 금액/asset 일치, cursor 재시작·중복 방지 | BLOCKED |
| 거절 조건 | 잘못된 root/proof, 타인 소유 note, 금액 불일치, 중복 지출, 만료·network/epoch replay | BLOCKED — 실행 중 체인 기준. 패키지 테스트 결과와 구분 |
| 실패 원자성 | 실패 시 잔액·Merkle tree·nullifier·이벤트 상태 불변 | BLOCKED — 실제 chain 기준 |
| 복구 | scan 재개, pending transaction 재조회, 재전송 중복 방지 | BLOCKED |
| 선택 확장 | withdraw, auditor 복호화, 잘못된 auditor/권한 거부 | BLOCKED |

## Maroo에 연결하기 위한 별도 gate

| 요소 | 조사 결과 | 판정 |
|---|---|---|
| RPC/chain/주소 | 공식 RPC 연결 및 chain 확인. Privacy 0x100000000000000000000000000000000000000b, PCL 0x1000000000000000000000000000000000000005 | PASS — 조회 범위 |
| 공개 호출 ABI | @maroo-chain/contracts@0.0.9의 실제 ABI를 사용. Privacy 함수 9개 모두 상태 변경 함수이며 state/witness view 함수 없음 | PASS — 외부 형식만 |
| 실제 배포 버전 ↔ source/circuit | 현재 Maroo verifier와 고정 Clairveil SHA의 대응표 미확보 | BLOCKED |
| compatible PK/VK/manifest | 조사한 공식 자료에서 Maroo 배포 verifier에 대응하는 다운로드·identity 미확보 | BLOCKED |
| privacy state / Merkle witness | 조사한 공개 Contract/RPC 안내에서 외부 개발자용 재현 경로 미확보 | BLOCKED |
| 내부 proof serialization / public inputs | Solidity bytes 외형은 확인. prover proof와 deployed verifier 간 byte format/PI 매핑은 미확인 | BLOCKED |
| known-good fixture / tx | 제한된 이벤트 조회에서 확보하지 못함 | BLOCKED |
| PCL·authorization | 정책 설정 조회 성공. 실제 요청의 정책 통과/거절, 권한, EAS 대상은 미실행 | NOT TESTED |
| valid deposit → transfer → scan | 위 조건 확보 후 별도의 live 실행/receipt/state 검증 필요 | BLOCKED |

**조사 범위에서 확보하지 못했다는 뜻이며, Maroo에 기능이나 자료가 존재하지 않는다고 단정하지 않는다.** [공개 자료 조사 목록](../evidence/docs-only/PRIVACY_SOURCES.json). 로컬 개발용 setup으로 만든 키는 Maroo verifier 호환성을 제공하지 않는다.

## trust boundary와 production 과제

아래는 valid 테스트넷 실행의 선행 자료와 별도다. 이번 검사로 production-ready 판정을 내리지 않는다.

| 경계 | 반드시 입증할 것 | 이번 범위 |
|---|---|---|
| wallet → prover | 어떤 witness/비밀을 전달하는가, TLS/auth, 보관·로그 제한 | 전체 운영 검증 NOT TESTED |
| prover → chain | proof/PI binding, artifact identity, 잘못된 proof 거절 | ABI 외형만 PASS. 실제 proof 검증 BLOCKED |
| PCL admin → 지급자 | 관리자 권한, 정책 변경·우회·fail-closed, EAS 적용 대상 | 설정 조회 PASS, 집행 NOT TESTED |
| auditor → 거래 | 공개/비밀 감사키 구분, 권한·rotation·수집/lineage 완전성 | source 조사, 운영 NOT TESTED |
| chain → wallet | receipt 확정성, scan 재개, reorg·replay·reconciliation | 실제 lifecycle BLOCKED |

추가 production 과제: 키 custody/KMS, prover 격리·취소·rate limit, signed artifact provenance/정식 setup, 외부 보안 검토, 감사키 governance, monitoring, upgrade/migration, incident recovery. 이 항목을 공개 circuit/query 부재와 섞지 않는다.

## 재실행 및 완료 기준

저장소 루트에서:

```sh
npm ci
npm run privacy:abi
npm run privacy:public
```

첫 번째는 의존성 설치, 두 번째는 오프라인 합성 ABI 검사, 세 번째는 읽기 전용 testnet 검사다. 개인키를 읽거나 거래를 보내지 않는다.

Linux/WSL2가 사용 가능한 터미널에서는 고정 checkout을 준비한 뒤 `bash demo/clairveil/verify-linux.sh`로 upstream 검사를 실행한다. 이 새 wrapper의 Linux 실행은 아직 검증하지 않았다. 로그의 skip과 실패를 확인하고 artifact-gated integration test를 별도로 실행해야 한다.

그 다음 [Clairveil 준비 순서](../demo/clairveil/README.md)에 따라 검토된 bundle/config, 전용 node/prover를 준비한다. 실제 deposit/transfer tx와 Bob scan 결과, 전후 commitment/nullifier/잔액 상태를 비밀 제거 후 확보해야 로컬 정상 흐름 완료로 바꿀 수 있다.

Maroo 전환은 배포 circuit identity/PK/VK/PI serialization/query/known-good 자료가 확보된 뒤 별도 수행한다. 현재 판정의 첫 차단 계층은 로컬 **infrastructure**, Maroo **circuit/artifact 호환 정보 및 privacy state query**다.
