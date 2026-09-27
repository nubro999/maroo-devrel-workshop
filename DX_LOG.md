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


## DX-008 — Explorer에서 PCL 커스텀 오류를 읽을 수 있는 거절 사유로 표시

**문제:** PCL이 지급 요청을 정상적으로 차단했지만, Explorer의 Revert reason → Decoded 영역에 읽을 수 없는 문자가 표시되어 개발자가 거절 이유를 알기 어렵다.

- 상태: 실제 테스트넷 거래 및 사용자 제공 UI 출력으로 관찰. Explorer 소스·내부 디코딩 구현은 미확인.
- 대상: 은행·핀테크 지급 PoC 개발자, 워크숍 참가자, 거래 실패를 확인하는 지원 담당자.
- 심각도: 중간. 정책 집행 자체는 작동하지만 실패 원인 진단이 어려워진다. 평가 의견이며 영향 범위를 전체 오류로 일반화하지 않는다.
- 제안 담당: Maroo Explorer 담당, PCL ABI·오류 설명 유지관리 담당.

### 재현과 증거

1. 다음 실제 테스트넷 실패 거래를 연다.
   https://explorer-testnet.maroo.io/tx/0xa365d1866e419ed9a8d8ac635bbaf0ef2ed94900c70ff83d18fcadd84556628c
2. Revert reason의 Raw와 Decoded 표시를 비교한다. 사용자 관찰 시 Decoded에는 제어문자·깨진 글자가 표시됐다.
3. 아래 Raw 값을 `@maroo-chain/contracts@0.0.9`의 IPcl ABI로 해석한다.

```text
0x0201b218000000000000000000000000c4a50f04b3eb7b95f87639d6133db89e3cdc407c
```

```javascript
import { Interface } from 'ethers';
import { iPclAbi } from '@maroo-chain/contracts/abi/precompiles/pcl/IPcl';

const raw = '0x0201b218000000000000000000000000c4a50f04b3eb7b95f87639d6133db89e3cdc407c';
const error = new Interface(iPclAbi).parseError(raw);
console.log(error.name, error.args[0]);
// InDenylist 0xC4A50f04B3eB7B95f87639d6133Db89E3cdC407C
```

실행 증거: 블록 19180957, receipt status 0. 같은 블록에서 호출을 재검증해 InDenylist를 확인했고, 수신자 잔액 변화는 0이며 지급 횟수도 1에서 증가하지 않았다. [RPC 재검증 기록](evidence/live-testnet/PCL_PROXY_VERIFIED.json).

### 사용자 영향

개발자는 정상적인 정책 거절을 데이터 손상이나 원인 불명의 시스템 오류로 오해할 수 있다. 현재는 ABI를 찾아 별도 코드로 해석해야 하므로 Explorer만으로 실패 이유를 설명하기 어렵다. 잘못된 재시도나 불필요한 지원 문의로 이어질 가능성이 있다.

### 개선 제안

- 체인 배포 버전에 맞는 PCL 커스텀 오류 ABI를 지원해 selector와 인자를 구조적으로 표시한다.
- 사람이 읽는 설명과 기술 정보를 함께 제공한다. 이 사례의 기대 표시는 다음과 같다.

```text
거절 사유: 차단 목록 조건에 해당하는 주소가 있어 지급이 거절되었습니다.
오류: InDenylist(address)
해당 주소: 0xC4A50f04B3eB7B95f87639d6133Db89E3cdC407C
```

- 원본 hex와 복사 기능을 유지한다. 주소 링크와 오류 문서 링크를 제공한다.
- 알 수 없는 selector나 잘못된 인코딩은 “해석할 수 없는 커스텀 오류”로 표시한다. 바이너리 데이터를 읽을 수 없는 문자열로 제시하지 않는다.
- AnyOfRejected처럼 하위 오류를 담는 경우 원본 구조를 보존하면서 각 원인을 펼쳐 볼 수 있게 한다.

### 개선 완료 기준

1. 위 거래가 InDenylist와 정확한 주소 인자로 표시된다.
2. 알 수 없는 selector에서도 화면이 깨지지 않고 Raw가 보존된다.
3. 일반 Error(string), Panic(uint256), 중첩 PCL 오류를 서로 구별한다.
4. 원본 값과 디코딩된 값을 복사할 수 있다.

### 원인 해석의 한계

관찰된 표시는 바이너리 오류 데이터를 문자열로 처리했을 때의 증상과 일치한다. 다만 내부 구현을 조사하지 않았으므로 UTF-8 강제 변환을 확정 원인으로 단정하지 않는다. 본 항목은 거래 실패 자체가 아니라 오류 설명 UI의 개선 제안이다. 외부 이슈로 게시하지 않았다.


## DX-009 — 체험 시작 안내 문구의 지속 노출 개선

**문제:** Maroo Experience 한국어 체험에서 사용자가 진행 중에도 “체험을 시작할게요!”라는 문구가 채팅창에 계속 떠 있어 불편하다고 보고했다. 시작 안내가 현재 진행 단계와 맞지 않게 남아 있어 대화의 흐름을 방해한다.

- 화면: https://experience.maroo.io/ko
- 관찰일: 2026-09-27
- 상태: 사용자 직접 체험 보고. 독립 재현·화면 캡처·내부 구현 확인은 미완료.
- 대상: Maroo를 처음 체험하는 사용자 및 워크숍 참가자.
- 심각도: 낮음, 잠정. 사용자가 불편을 보고했으나 기능 진행이 차단된 증거는 없음.
- 제안 담당: Maroo Experience 프런트엔드·대화 UX 담당.

### 관찰된 동작

체험 중 “체험을 시작할게요!” 문구가 채팅창에 계속 노출된다. 동일 메시지가 여러 번 추가되는지, 고정 안내인지, 입력 제안인지, 대화 기록 한 건이 남아 있는지는 아직 구분하지 못했다. 반복 생성이나 특정 렌더링 오류를 확정 원인으로 단정하지 않는다.

### 사용자 영향

체험이 진행 중인데 시작 안내가 계속 보여 현재 단계와 화면 메시지가 어긋난다. 사용자에게 불필요한 시각적 방해가 되며, 다음 안내나 행동에 집중하기 어렵게 할 수 있다.

### 개선 제안

- 시작 안내의 표시 조건을 체험 시작 전 또는 최초 시작 시점으로 한정한다.
- 안내 배너나 입력 제안이라면 시작 동작이 완료되거나 첫 실제 체험 단계로 전환될 때 숨긴다.
- 실제 대화 메시지라면 기록은 유지하되 고정 표시·자동 재노출·중복 추가를 피하고, 필요하면 접어서 볼 수 있게 한다.
- 진행 중 계속 필요한 안내 영역은 시작 문구 대신 현재 단계와 다음 행동을 보여준다.

### 개선 완료 기준

1. 시작 안내가 필요한 시점에만 표시된다.
2. 첫 체험 단계 이후 시작 안내가 고정되거나 반복적으로 시선을 차지하지 않는다.
3. 다음 단계 이동·재렌더링·세션 복귀로 동일 안내가 중복 추가되지 않는다.
4. 사용자가 명시적으로 체험을 새로 시작하면 안내를 다시 볼 수 있다.
5. 정상적인 대화 기록은 임의로 삭제하지 않는다.

### 후속 재현 확인

한국어 체험을 시작한 뒤 첫 안내·응답 및 다음 단계 전후의 화면을 비교한다. 문구가 어느 UI 요소에 속하는지와 최초 등장·지속·재등장 시점을 확인해 수정 위치를 특정한다. 현재 기록은 사용자 관찰에 근거한 UX 개선 제안이며 외부 이슈로 게시하지 않았다.


## DX-010 — EAS 발급 성공과 정책 조회 가능 상태를 구분하는 가이드
- 관찰 [Live Testnet]: 발급 직후 getAttestation은 존재하지만 isAttestationIndexed=false, received count=0. indexAttestation 이후 PCL 지급 성공.
- 재현: EAS_LIFECYCLE_EAS_RESULT.json의 index-status-after-attest → index-attestation → credentialed-payment 순서를 확인한다.
- 영향: 개발자가 발급 성공을 곧바로 PCL 자격 충족으로 오인한다.
- 심각도: Medium. 담당 제안: EAS/PCL 문서·SDK 담당.
- 개선: 공식 최소 예제에 인덱싱과 readback을 포함하고 자동/수동 인덱싱의 조건을 명시한다. SDK 자동화 여부는 별도 확인한다.
- 수용 기준: 새 자격 발급부터 인덱싱·정책 성공까지 복사 가능한 예제와 단계별 실패 진단 제공.

## DX-011 — EAS_POLICY가 검사하는 범위를 명시
- 관찰 [Live Testnet]: 이번 resolver=0 스키마에서 bool false와 true 모두 지급 성공. 정책이 bool true를 강제하지 않았음.
- 재현: EAS_BOOLEAN_EAS_RESULT.json의 false/true readback 및 포함 거래·잔액 변화 확인.
- 영향: approved=false 증명 발급만으로 지급을 차단할 것으로 오인할 수 있다.
- 심각도: High(통합 설계 오해의 영향). 담당 제안: PCL 문서·정책 템플릿 담당.
- 개선: 자격 존재·유효성, 데이터 조건, 신뢰할 발급자 조건을 분리한 표와 승인/폐기 예제 제공.
- 수용 기준: 템플릿별 검사·비검사 필드와 resolver/발급자 통제 책임이 명시됨.
- 제품 결함 판정 아님. 확인된 설정의 동작과 문서 명확성 제안이다.


## DX-012 — 가스 단위와 총 수수료를 구분하기 어려움

- 관찰: 사용자가 Explorer의 Gas fees (Gwei) 표기를 보고 결제 자산과 실패 수수료를 질문했다. 사용자 직접 보고이며 UI 내부 계산 구현은 미확인이다.
- 근거: USER_PCL_RUN의 blocked-payment-submission은 status 0, fee 2.25 tOKRW이고 수취인 증가량은 0이다.
- 영향 대상: Maroo를 처음 접하는 기관 연동 개발자.
- 심각도: 중. 실패한 지급액과 수수료, 가스 가격 단위와 결제 자산을 혼동할 수 있다.
- 개선: 총 수수료(tOKRW), 가스 사용량, 가스 단가를 분리하고 실패 시에도 수수료가 발생하는 이유를 짧게 안내한다.
- 제안 담당: Explorer UX·문서. 표시 계산 자체가 틀렸다고 단정하지 않는다.

## ENV-003 — PowerShell에서 broadcast 옵션이 스크립트에 전달되지 않음

- 관찰: npm run lab:pcl -- --broadcast가 npm 옵션 경고와 No transaction sent를 출력했다. 같은 사용자 환경에서 node demo/pcl/run.mjs --broadcast는 실제 실행됐다.
- 영향 대상: PowerShell에서 워크숍을 따라 하는 참가자.
- 심각도: 중. 복사한 명령으로 실습이 시작되지 않지만 실제 거래가 전송된 것은 아니다.
- 원인 범위: npm·셸 옵션 전달 계층. 버전별 상세 원인은 미확인이다.
- 개선: 참가자 문서와 사이트를 node 직접 실행 명령으로 통일했다.
- 담당: 워크숍 자료 유지관리자. Maroo 체인 오류로 분류하지 않는다.

## DX013 — 실습 참가자 동선의 불필요한 설명과 입력 부담
- Problem: 관찰 수수료·연구 결과·참고 링크가 실행 순서를 가렸다. 환경 파일을 수동 입력해야 했다.
- Evidence: 사용자 피드백으로 macOS/Linux 전체 경로와 5개 계정 준비 요청.
- Affected developer: 워크숍 참가자.
- Severity: 높음 — 첫 실행에 도달하기 전에 이탈할 수 있음.
- Suggested improvement: 순서대로 복사 가능한 명령, OS별 준비 안내, 로컬 계정 파일에서 .env 생성, 공통 Privacy 컨테이너.

## DX014 — Privacy CLI JSON 앞에 prover 로그 출력
- Problem: deposit --output json의 stdout에 gnark DBG 로그가 먼저 나와 json.load 전체 파싱이 실패한다.
- Evidence: 직접 CLI 검증에서 예치 거래는 접수됐지만 txhash 추출 단계 JSONDecodeError 발생. 예치 재전송 없이 기존 출력 마지막 JSON 줄을 파싱해 복구.
- Affected developer: CLI 실습 참가자와 자동화 작성자.
- Severity: 중간 — 전송 결과를 오해하고 재전송할 위험.
- Suggested improvement: 기계 판독 JSON은 stdout 단독 출력, 디버그 로그는 stderr. 단일 줄과 여러 줄 transaction JSON이 섞여 있어, 현재 CLI의 JSON 시작 줄부터 sed로 분리한다.
