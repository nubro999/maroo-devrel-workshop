# DX Log — Track B

기존 제출 노트와 실행 기록에서 소급 정리한 후보다. 후보와 확인된 문제를 구별하고, 사용자 영향·심각도는 검증 후 갱신한다. 증거 없는 가설을 제품 결함으로 제출하지 않는다.

## DX-001 — localnet/payroll target의 검증 범위 인식

- 상태: [Docs Only], source 확인; 사용자 혼동 여부는 가설.
- Problem: 일부 target 이름만 보면 정적/legacy 검사를 실제 체인 흐름으로 오해할 수 있다.
- Reproduction / evidence: [고정 SHA testing guide](https://github.com/DELIGHT-LABS/clairveil/blob/af04cfc994a3da87a8b1b902eda0988feb512539/docs/clairveil-testing-guide.md)의 Batch and payroll gates 확인.
- Affected developer: 첫 실습을 준비하는 진행자.
- Severity: 중, 잠정.
- Why: 실행 증거의 종류를 잘못 분류할 가능성. 문서에는 실제 범위가 명시돼 있다.
- Suggested improvement: target 실행 출력 첫 줄에 STATIC/LEGACY 분류 표시.
- Suggested owner: Clairveil docs/tooling.
- Next verification: 실제 target 출력과 신규 참가자의 해석을 확인.

## DX-002 — native V2 수동 준비 부담

- 상태: [Local] Linux 실제 node와 새 계정 재현 완료. LOCAL_PRIVACY_LIFECYCLE.json 및 LOCAL_PRIVACY_REHEARSAL.json 참조.
- Problem: 고정 SHA에는 native V2 end-to-end smoke target이 없으며 audit config/artifacts 및 chain 준비가 필요하다.
- Reproduction / evidence: 같은 testing guide의 Local homes and ports, [프로젝트 준비 안내](demo/clairveil/README.md).
- Affected developer: 시간 제한이 있는 워크숍 참가자와 진행자.
- Severity: 높음, 잠정.
- Why: 준비 시간과 재현성을 사전에 예측하기 어렵다. 실제 소요 시간은 아직 측정하지 않았다.
- Suggested improvement: exact-pin preflight, 준비물 manifest, 수동 lifecycle checklist 제공.
- Suggested owner: Clairveil examples.
- 개선 확인: demo/clairveil/run-local.py로 개발용 artifact/config/node/거래/scan 준비를 묶어 새 계정과 체인에서 재현했다. 전체 참가자 리허설은 미완료.

## DX-003 — Maroo Privacy 공개 선행 자료 조사

- 상태: 미검증 조사 후보. 자료 부재나 제품 결함을 주장하지 않음.
- Problem: 현재 verifier에 맞는 circuit/artifact/query/fixture 확보 여부가 아직 확인되지 않았다.
- Reproduction / evidence: [출처 목록](docs/SOURCES.md)의 조사 범위; 전체 제공 여부는 미확인.
- Affected developer: 외부 privacy integrator.
- Severity: 미판정.
- Why: 누락 여부와 대체 경로 확인 전 영향 평가 불가.
- Suggested improvement: 공식 pin/manifest/known-good 경로를 먼저 찾고, 실제로 없는 항목만 요청.
- Suggested owner: Maroo DevRel/privacy.
- Next verification: 공개 자료별 URL·버전·재현 경로를 표로 정리.

## ENV-001 — 제한된 Windows 실행 환경

- 상태: [Local] 실패 관찰 후 실행 경로 수정. Maroo 제품 DX와 별도 분류.
- Problem: npm 기본 cache 쓰기 EPERM, tsx 시작 중 uv_os_get_passwd ENOMEM.
- Reproduction / evidence: [환경 검증 기록](evidence/local/SETUP_VALIDATION.md), WORKLOG의 AI Usage Candidates.
- Affected developer: 같은 제한 환경을 사용하는 개발자.
- Severity: 중, 해당 환경 한정.
- Why: 애플리케이션 실행 전에 설치/runner가 중단됨.
- Suggested improvement: 로컬 ignored cache, 런타임 요구사항, 검증된 Node 실행 경로 안내.
- Suggested owner: 이 제출 저장소 유지관리자.
- Confirmed scope: 변경 후 타입 검사·테스트·RPC 성공. ENOMEM의 OS 내부 원인은 미확정.

## ENV-002 — 세션 네트워크 권한으로 RPC 요청 중단

- 상태: [Local] 권한 요청 후 해소.
- Problem: 첫 balance 실행이 EACCES로 중단됨.
- Reproduction / evidence: WORKLOG 003, 2026-09-25T18:19:06.060Z 실패 후 권한 부여 및 재실행 성공.
- Affected developer: 제한된 실행 환경 사용자.
- Severity: 낮음 / 권한 부여 후 진행 가능.
- Why: 애플리케이션이나 체인 오류로 오진할 가능성.
- Suggested improvement: EACCES 발생 시 네트워크 실행 권한부터 확인하도록 안내.
- Suggested owner: 실행 환경/제출 도구 담당. Maroo 제품 결함으로 분류하지 않음.

## DX-004 — 키 접두사에 대한 모호한 오류

- Problem: 키가 있어도 0x 없는 64자리 hex이면 Set MAROO_PRIVATE_KEY 메시지를 출력해 누락으로 오해하게 함.
- Reproduction / evidence: 사용자 제공 2026-09-26T10:20:07.224Z 오류; 로컬 비밀 비출력 검사에서 keyPresent=true, bare64Hex=true, acceptedFormat=false 확인.
- Affected developer: 지갑에서 접두사 없는 키를 복사한 신규 참가자.
- Severity: 중 / 첫 송금 전에 중단되며 원인 안내가 부정확함.
- Suggested improvement: 두 형식 지원, 누락/형식 오류 메시지 분리. 구현 완료, 회귀 테스트 추가.
- Owner: 이 제출 저장소. Maroo 또는 지갑의 결함 아님.

## DX-005 — 원시 금액만 표시해 지급 검토가 어려움

- Problem: 긴 aokrw 정수 출력에 소수점과 사람이 읽는 tOKRW 금액이 없음.
- Reproduction / evidence: 사용자 피드백과 WORKLOG 007의 로컬 출력 검증.
- Affected developer: 송금액·잔액·수수료를 검토하는 참가자.
- Severity: 중 / 금액 오독 가능성이 있어 실제 송금 전 판단을 방해함.
- Why: 통화 단위를 사용자가 수동으로 변환해야 함.
- Suggested improvement: amounts_tOKRW를 앞부분에 추가하고 정밀도를 보존한 소수점 문자열 제공. 구현 및 로컬 검증 완료.
- Owner: 이 제출 저장소.

## DX-006 — Privacy ABI 예제의 import 경로와 배포 패키지 차이

- Problem: 현재 deposit 문서의 `@maroo-chain/contracts/abi/IPrivacy` 경로는 0.0.9에서 ERR_MODULE_NOT_FOUND. 실제 경로는 `@maroo-chain/contracts/abi/precompiles/privacy/IPrivacy`, export는 iPrivacyAbi.
- Reproduction / evidence: [로컬 검사](evidence/local/PRIVACY_ABI.json), [출처 목록](evidence/docs-only/PRIVACY_SOURCES.json). `npm run privacy:abi`로 재현.
- Affected developer: 문서 예제를 복사하는 EVM integrator.
- Severity: 중. 네트워크 호출 전 import 단계에서 중단되지만 검증한 대체 경로가 있음.
- Suggested improvement: 문서 import/export와 npm version을 함께 고정하고 배포 패키지 대상으로 예제 smoke test.
- Owner: Maroo Docs/package 담당.

## DX-007 — Clairveil 실습 전 지원 OS/CPU 안내

- Problem: 고정 SHA를 Windows에서 실행하면 syscall 빌드 실패와 native secret profile 거부가 발생한다. 일반 도구 설치 안내만으로는 사전 판별하기 어렵다.
- Reproduction / evidence: [환경 진단](evidence/local/PRIVACY_ENVIRONMENT.md), [전체 결과](evidence/local/CLAIRVEIL_TESTS.json).
- Affected developer: Windows 기반 신규 실습 참가자.
- Severity: 높음, 이 환경에서 privacy 정상 흐름 시작이 차단됨. Windows 지원 자체를 약속한 제품 결함이라는 뜻은 아님.
- Suggested improvement: getting-started 앞에 지원 OS/CPU preflight, Linux/WSL2 준비 및 artifact gate를 표시. 사용자 결정에 따라 이 제출 저장소 기본 환경을 Linux/WSL2로 변경.
- Owner: Clairveil docs/tooling 담당.
- 후속 확인: Linux에서 실제 node deposit → transfer → scan 및 새 계정 재현 완료.

## ENV-003 — generated source hash와 Windows CRLF 변환

- Problem: core.autocrlf=true checkout에서 generated source 2개가 기대 byte hash와 달라짐.
- Reproduction / evidence: [hash 비교 및 재검사](evidence/local/CLAIRVEIL_LINE_ENDINGS.json). Git 원본/LF 정규화 hash는 기대값과 정확히 일치. 원본 바이트 복원 후 2개 패키지 PASS.
- Affected developer: Git 줄바꿈 변환을 켠 참가자.
- Severity: 중. 올바른 코드를 가져와도 무결성 실패로 오해 가능.
- Suggested improvement: generated source에 upstream LF 속성을 명시하거나 clone에서 core.autocrlf=false를 저장. 암호 검사를 삭제하지 않는다.

## DX-003 조사 업데이트 — Maroo 연결 선행 자료

- 상태: [Docs Only] 조사 범위에서 미확보. 기능 부재로 확정하지 않음.
- Evidence: [연결 gate 표](docs/PRIVACY_VALIDATION.md), 공식 docs/패키지/release 조사 및 live 공개 조회.
- 현재 영향: compatible circuit/PK/VK/PI mapping, state/witness query, known-good fixture를 확보하지 못해 valid Privacy 재현에 진입하지 못함.
- Suggested improvement: 현재 배포와 묶인 versioned integration bundle 및 query/known-good tx 제공 경로 명시. production custody/운영 요구와 별도 설명.
