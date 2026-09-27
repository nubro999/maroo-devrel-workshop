# Worklog — Track B

## 011 — 2026-09-27 환경 복구 및 면접 과제 목적 재확인

### Goal
기존 작업을 보존하고 Track B 면접 과제의 실행 검증과 참가자 재현성에 다시 집중한다.

### Execution
[Local] 사용자가 Ubuntu에 bubblewrap 설치 완료를 알린 뒤 agent가 `bwrap --version`을 실행해 0.9.0을 확인했다. 기존 Windows 원본 작업 폴더를 WSL 경로로 조회하고 AGENTS.md, docs/REQUIREMENTS.md, WORKLOG.md, SUBMISSION_NOTES.md를 읽었다.

### Result
PASS — agent 명령 실행과 기존 작업 파일 읽기 복구. Privacy lifecycle 또는 테스트넷 상태 변경의 새로운 성공 증거는 아니다.

### Diagnosis
현재 shell 실행 차단은 bubblewrap 설치 후 해소됐다. 별도 Node 도구의 경로 오류 해결 여부는 재검증하지 않았다. 과거 대화 미리보기의 Track B/C 범위보다 최신 프로젝트 기록의 Track B 단독 결정을 따른다.

### Next Step
기존 증거와 미완료 항목을 기준으로 Linux Privacy 실행을 재개하고, 실제 송금·정책 집행·워크숍 재현성의 증거를 각각 확보한다. Interview Brief 원문은 이번에 다시 읽지 않았으며 요구사항 대응표를 참고했다.

### Human Judgment
사용자: “목적을 다시 새겨봐 지금 면접과제준비중이야.” 기존 기록의 정책에 맞는 지급 우선, 참가자 직접 실습, Track B 단독 범위를 유지한다.

주제: Compliant Confidential Vendor Payment. 기록 규칙은 [AGENTS.md](AGENTS.md)를 따른다. 과거 항목은 기존 증거와 대화에서 소급 정리했다. 기록되지 않은 실행 시각이나 판단은 추정하지 않는다.

## 001 — 작업환경과 첫 RPC 확인 (소급 기록)

[Submission: Validation] [Submission: Known Limitations]

### Goal
재현 가능한 Maroo 실행 환경을 만들고 테스트넷 연결을 확인한다.

### Initial Hypothesis
[AI Hypothesis] 공식 문서의 RPC와 chain ID를 사용하면 현재 환경에서 읽기 요청이 가능할 것이다. 실행으로 확인하기 전에는 가정이다.

### Source Grounding
[Docs Only] [출처 목록](docs/SOURCES.md): 공식 문서는 RPC, chain ID, native OKRW 송금 방법을 설명한다. 주소와 API가 문서에 있다는 사실만으로 현재 테스트넷에서 전체 경로가 사용 가능하다고 판단하지 않는다.

### Execution
- [Local] Windows / Node v22.14.0 / npm 11.2.0. 과거 실행의 정확한 시각은 개별 기록이 없는 경우 미기록.
- `npm run typecheck`, `npm test`: 타입 검사 및 9개 테스트 통과. [환경 검증 기록](evidence/local/SETUP_VALIDATION.md).
- [Live Testnet] 2026-09-25T17:54:19.535Z, `npm run check:rpc`.
- 입력: 공개 RPC, `eth_chainId`, `eth_getBlockByNumber(latest)`.
- 예상: chain 450815와 블록 응답. 실제: chain 450815, block 19089874.
- [RPC 원본 공개 응답](evidence/live-testnet/RPC_CHECK.json), [검증 설명](evidence/live-testnet/RPC_CHECK.md). 읽기 요청이므로 tx hash 없음.
- [Local] `npm --prefix .external/clairveil/examples/js-sdk-fixture-validator run validate`: fixture validator 통과. SHA 및 범위는 환경 검증 기록 참조.

### Result
PASS — 환경 검사, RPC 읽기, 정적 fixture 검사에 한정.
NOT TESTED — 실제 송금, PCL 정책 효과, Maroo Privacy, Clairveil deposit → transfer → scan.

### Diagnosis
RPC 읽기 성공은 상태 변경이나 Privacy 호환성을 입증하지 않는다. Clairveil fixture 검사는 실제 로컬 체인 lifecycle과 구분한다. 미실행 기능의 실패 계층은 unknown이며 임의로 BLOCKED 처리하지 않는다.

### Next Step
테스트넷 공개 지갑 주소와 자금 준비 후 잔액 조회부터 기록한다. 키는 채팅이나 공개 증거에 넣지 않는다.

### Human Judgment
사용자가 명시한 결정: Track B만 진행하며 주제는 Compliant Confidential Vendor Payment. 로컬 성공을 Maroo 성공으로 합치지 않고, wallet / prover / PCL admin / auditor / chain을 신뢰 경계의 중심으로 삼는다. 이 실행 결과에 대한 추가 해석은 아직 미기록.

## 002 — 지속 기록 규칙 도입

[Submission: Assumptions/Discrepancies] [Submission: AI Usage]

### Goal
사용자가 제공한 recorder/verification 지침을 Track B 프로젝트에 적용한다.

### Initial Hypothesis
없음. 사용자가 명시한 작업 방식이다.

### Source Grounding
[Docs Only] 사용자가 첨부한 지침을 읽고 Track B 단독 범위로 수정했다. 원문의 WORKLOG/DX_LOG, 증거 분류, AI 오류, Human Judgment, 세션 마감 규칙을 유지했다.

### Execution
[Local] AGENTS.md, WORKLOG.md, DX_LOG.md를 작성하고 README에 진입 링크를 추가했다. 정확한 실행 시각은 별도 수집하지 않음. 네트워크 호출이나 온체인 변경은 수행하지 않음.

### Result
PASS — 기록 파일과 지침 반영. 기능 실행의 성공을 의미하지 않는다.

### Diagnosis
해당 없음. 기존 기록으로 확인할 수 없는 사항은 미기록으로 남겼다.

### Next Step
다음 실제 실험부터 Goal → Hypothesis → Source → Execution → Result → Diagnosis → Next Step 형식으로 즉시 추가한다.

### Human Judgment
사용자는 첨부 지침에서 다른 Track을 제외하고 반영하도록 지시했다. 별도의 기술적 판단은 요청하거나 만들어내지 않았다.

## AI Usage Candidates

### 가속 사례
- Interview Brief를 요구사항 대응표와 워크숍 초안으로 구조화했다. 최종 충족 여부는 실행 증거로 판단한다.
- TypeScript 스캐폴드, 체인/입력 guard, secret 검사와 테스트를 구성했다. 검증 결과는 항목 001 참조.

### 오류 후보 1 — 실행 환경 가정
[Submission: AI Usage]
- AI가 적용한 가정: 기본 npm cache와 tsx가 현재 Windows 제한 환경에서 동작할 것이다.
- 확인: 실제 설치/실행에서 기본 cache EPERM, tsx의 uv_os_get_passwd ENOMEM을 관찰했다.
- 수정: ignored 로컬 cache와 Node 내장 TypeScript 실행으로 변경했다. 남은 테스트 import 확장자도 수정했다.
- 검증: 이후 타입 검사, 9개 테스트, RPC 읽기가 통과했다. 근거는 환경 검증 기록.
- 경계: ENOMEM의 OS 내부 원인은 확정하지 않았다. 프로토콜 문제로 분류하지 않는다.

### 오류 후보 2 — 문서 일괄 수정
[Submission: AI Usage]
- AI가 적용한 가정: PowerShell 중첩 배열의 모든 항목이 치환 쌍으로 순회될 것이다.
- 확인: 단일 쌍이 펼쳐져 SCENARIO의 viewing이 vieoing으로, RPC 문서의 공백이 T로 바뀐 도구 출력을 관찰했다.
- 원인: 해당 루프가 문자열을 쌍으로 취급하면서 문자 인덱스를 치환에 사용했다.
- 수정: 영향을 받은 두 문서를 원래 내용에 맞춰 복구하고 대상 문구만 제거했다.
- 검증: 문서 재조회, 제거 대상 검색, 상대 링크 확인 완료. 원본 RPC JSON은 변경하지 않았다.
- 경계: 이전 대화의 실행 출력이 근거이며 별도 원본 오류 로그는 저장하지 않았다. 최종 제출에 쓸 사례는 사람이 선택한다.

## Privacy 구분 기준

- Valid testnet 실행 선행 조건: compatible circuit ref, proving artifact, privacy state query, Merkle witness, serialization 또는 known-good fixture. 제공 여부와 호환성을 각각 확인한다.
- Production 작업: key custody, prover 운영, auditor/disclosure governance, PCL administration, monitoring, retries/reconciliation, upgrades, access control, incident recovery.
- 첫 범주의 미확인 항목을 두 번째 범주의 일반 운영 과제로 대체하지 않는다.

## 003 — 사용자 설정 후 잔액과 송금 미리보기

[Submission: Validation] [Submission: DX Feedback]

### Goal
설정된 테스트넷 주소의 잔액과 1 tOKRW 송금 준비 상태를 확인한다.

### Initial Hypothesis
[AI Hypothesis] faucet 잔액이 송금액과 추정 수수료를 충당할 것이다.

### Source Grounding
[Docs Only] 기존 docs/SOURCES.md의 native OKRW 경로. 실제 정책 효과와 키 일치는 별도 검증 대상이다.

### Execution
[Local] Windows / Node v22.14.0. 최초 balance 실행 2026-09-25T18:19:06.060Z에 EACCES. 네트워크 권한 부여 후 재시도.
[Live Testnet] `npm run balance`: 2026-09-25T18:19:28.543Z, block 19091358, 4999.0 tOKRW 확인.
[Live Testnet] `npm run transfer:okrw`: 2026-09-25T18:19:31.200Z, beforeBlock 19091360, 1 tOKRW 전송 미리보기 성공. 수신 잔액 0, gasLimit 124510, gasPrice 9000000000000 aokrw. 추정 가스 한도 기준 수수료 1.12059 tOKRW, 송금 포함 필요액 2.12059 tOKRW.
입력 주소 및 결과는 evidence/live-testnet/BALANCE_READY.json, TRANSFER_PREVIEW.json 참조. broadcast=false, 서명/전송 없음. 개인키는 출력하거나 검증하지 않았다.

### Result
PASS — 잔액과 eth_estimateGas 기반 미리보기.
NOT TESTED — 키와 발신자 일치, 실제 거래 포함, PCL 정책 인과관계, Privacy.

### Diagnosis
최초 계층: infrastructure. 관찰 사실: 권한 전 EACCES, 권한 부여 후 같은 명령 성공. 지갑이나 Maroo 장애의 증거는 없음. 가스 추정 성공은 실제 송금 성공을 보장하지 않음.

### Next Step
사용자가 대상과 금액을 확인한 뒤 실제 송금을 진행하고 receipt 및 잔액 변화를 기록한다.

### Human Judgment
미응답. 실제 송금 의사와 테스트 대상/금액 확인 대기.

## 004 — 정책에 맞는 지급을 이야기의 중심으로 선택

[Submission: Assumptions/Discrepancies] [Submission: Workshop]

### Goal
Compliant Confidential Vendor Payment의 핵심 업무 문제와 PoC 성공 기준을 정한다.

### Initial Hypothesis
[AI Hypothesis] 허용되는 지급과 조건 하나만 바꾼 거부 지급을 비교하면 참가자가 정책 집행의 가치를 이해하기 쉬울 것이다. 학습 효과와 실제 구현 가능성은 미검증.

### Source Grounding
사용자의 직접 답변이 우선순위의 근거다. 새로운 프로토콜 사실을 확인한 것은 아니다. [Docs Only] 기존 출처 목록만 있으며 PCL/EAS의 필요한 권한과 현재 설정은 추가 확인 대상이다.

### Execution
[Local] docs/SCENARIO.md에 정책 우선 서사, 정책 정의와 집행의 구분, 허용/거부 비교 실험 후보를 반영했다. 이 항목은 문서 변경 기록이며 네트워크 요청이나 실제 지급은 없음. 정확한 실행 시각은 미수집.

### Result
PASS — 사용자 우선순위 기록 및 시나리오 반영.
NOT TESTED — 정책 집행, 제안한 거부 사례, Privacy 정상 흐름.

### Diagnosis
실패 없음. 관찰 사실: 사용자가 잘못된 지급 방지를 더 중요하게 선택했다. 정책 적용 범위와 권한을 확인하기 전 특정 enforcement 경로를 가정하지 않는다.

### Next Step
공개 PCL 인터페이스와 일반 계정의 권한을 확인해, 허용/거부를 비교할 수 있는 정책 하나를 선정한다.

### Human Judgment
사용자 답변: “둘 다 인데, 잘못된 지급을 막는 것이 더 중요해. 규제를 준수하는 지, 정책에 알맞는 지를 정하고, 이에 맞춰서 돈을 송금하는거”
정책 적합성을 우선하고 기밀성도 유지한다는 결정이다. 구체적 규칙, 법적 판단, 정책 관리자 및 실제 송금 승인은 이 답변만으로 확정하지 않는다.

## 005 — 참가자 초기 설정을 포함한 직접 실습 설계

[Submission: Workshop] [Submission: Assumptions/Discrepancies]

### Goal
참가자가 새 환경에서 직접 설치·계정 준비·첫 지급을 수행하도록 안내한다.

### Initial Hypothesis
[AI Hypothesis] 설치 준비와 70분 본 실습을 분리하면 최초 참여자의 준비 상태와 학습 시간을 관리하기 쉽다. 전체 소요 시간은 미검증.

### Source Grounding
[Docs Only] 기존 공식 Maroo 접속 정보와 현재 스크립트/참가자 가이드. 새 PC 설치, 지갑 제품별 UI, faucet의 현재 발급 조건은 이번에 실행하지 않았다.

### Execution
[Local] workshop/SETUP.md를 작성하고 참가자/진행자 가이드에 연결했다. 문서 작업만 수행; 사용자를 대신한 송금 없음. 정확한 실행 시각 미수집.

### Result
PASS — 초기 설정부터 직접 실행하는 안내 반영.
NOT TESTED — clean PC 리허설, 참가자별 정책 격리, 전체 Privacy 환경 준비 시간.

### Diagnosis
실패 없음. 기존 개발자의 준비 완료 상태를 신규 참가자의 준비 완료로 간주하지 않는다.

### Next Step
사용자가 직접 테스트넷 송금 명령을 실행하고 tx hash와 결과를 확인한다. 정책 실습은 권한·인터페이스 검증 후 구성한다.

### Human Judgment
사용자: “직접 해보고 싶어. 어떻게 하면 될까? 그리고 이거는 아예 참여자들이 처음부터 세팅하는 걸 고려해서 해야해”. 직접 실습 및 처음부터의 참가자 설정 여정 포함은 명시적 요구다. 설치 pre-work 분리는 AI 제안이며 사용자 확정으로 기록하지 않는다.

## 006 — 송금 전 개인키 형식 검사 실패 수정

[Submission: Validation] [Submission: DX Feedback] [Submission: AI Usage]

### Goal
사용자가 직접 실행한 송금의 키 설정 오류를 비밀 노출 없이 진단한다.

### Initial Hypothesis
[AI Hypothesis] 키 누락, 형식 불일치 또는 .env 로딩 위치 문제일 수 있다.

### Source Grounding
[Docs Only] config.ts와 transfer-okrw.ts 검사: 기존 코드는 0x 접두사를 필수로 요구하고 누락/형식 오류를 같은 메시지로 처리했다.

### Execution
사용자 제공 로그: 2026-09-26T10:20:07.224Z, Windows / Node v22.14.0, transfer-okrw failed, UNCLASSIFIED, Set MAROO_PRIVATE_KEY in ignored .env.
[Local] 프로젝트 루트에서 .env 존재와 로딩 확인. 비밀값 대신 boolean만 출력: keyPresent=true, inheritedKeyInThisProcess=false, bare64Hex=true, acceptedFormat=false, hasWhitespace=false. 실제 키는 출력·복사하지 않음.
[Local] signingKey helper로 선택적 0x 지원과 누락/형식 오류 분리, 회귀 테스트 추가. .env는 수정하지 않음. 실제 송금 재시도는 하지 않음.

### Result
원인 확인: 기존 로컬 키 형식 검사. 최종 검사 결과는 아래 Verification에 기록.

### Diagnosis
최초 실패 계층: authorization — 로컬 서명 준비 단계. RPC/PCL/prover에서 거부한 것이 아니며 이 오류 경로는 서명 및 제출 이전이다. Live Testnet이라는 기존 라벨은 이 실패 자체가 온체인 실패임을 뜻하지 않는다.
확정 원인: 접두사 없는 키를 기존 정규식이 거절함. AI가 만든 입력 검사와 모호한 메시지가 신규 참가자의 첫 송금을 막은 사례다.

### Next Step
수정 검증 후 사용자가 직접 broadcast 명령을 다시 실행하고 receipt를 확인한다.

### Human Judgment
사용자가 제공한 실패 로그를 기록했다. 오류에 대한 사용자의 원인 해석은 아직 미응답.

### Verification
[Local] npm run typecheck 통과, npm test 10/10 통과. Wallet을 provider 없이 생성해 localKeyValid=true, matchesSender=true 확인. signed=false, broadcast=false. 이 확인은 키 값이나 서명을 출력하지 않았으며 네트워크 요청도 없다. 결과: PASS — 수정과 로컬 서명자 주소 확인; NOT TESTED — 실제 송금 포함 성공.

## 007 — 지급 금액의 소수점 표시 개선

[Submission: DX Feedback] [Submission: Validation]

### Goal
참가자가 긴 aokrw 정수 대신 읽을 수 있는 tOKRW 금액으로 지급을 확인하도록 한다.

### Initial Hypothesis
[AI Hypothesis] 원시 단위만 표시하는 출력이 금액 파악을 어렵게 한다.

### Source Grounding
[Docs Only] 기존 Maroo source 기록의 18 decimals 및 ethers formatEther 사용. 사용자: “숫자가 너무 커서 소숫점이 안보여”.

### Execution
[Local] evidence.ts에 amounts_tOKRW를 추가해 송금액·전후 잔액·실제 fee·추정 fee 한도 및 합계를 정확한 문자열로 표시. 원시 정수도 유지. 2026-09-26T10:25:19.311Z 로컬 예시로 1 tOKRW, 4999 tOKRW, 최소 단위 0.000000000000000001, fee 한도 1.12059 변환 확인. 임시 형식 검증 파일은 실제 거래 증거와 섞이지 않도록 제거.

### Result
PASS — typecheck 및 로컬 출력 검증. 실제 송금 또는 신규 네트워크 요청 없음.

### Diagnosis
확정 원인: 송금 출력에서 aokrw 정수만 표시. 부동소수점 Number 변환 없이 formatEther로 소수점 문자열을 추가했다. gasLimit/gasUsed는 통화량이 아니므로 변환하지 않는다.

### Next Step
사용자는 broadcast 없이 미리보기를 실행해 표시를 확인한다. 표시 확인을 위해 실제 거래를 재전송하지 않는다.

### Human Judgment
사용자는 기존 숫자 표시가 읽기 어렵다고 지적했다. 개선된 표시의 사용성 평가는 아직 미응답.

## 008 — 직접 읽을 자료와 정책 적용 대상 점검

[Submission: Workshop] [Submission: Assumptions/Discrepancies]

### Goal
정책 우선 지급 PoC에 필요한 읽기 순서를 제시하고 중요한 미확인 전제를 식별한다.

### Initial Hypothesis
[AI Hypothesis] 공급업체 수취 자격을 EAS/PCL로 검증하는 경로가 있을 수 있다. 현재 구현 가능성 미검증.

### Source Grounding
[Docs Only] https://docs.maroo.io/concepts/compliance 개요를 다시 확인. EAS_POLICY 요약은 발신자의 유효 attestation을 검사한다고 설명한다. 따라서 수취 공급업체 KYB 확인으로 곧바로 해석하지 않는다. 전역/컨트랙트 정책 범위, 관리자, 템플릿 실제 등록 여부도 별도 검증 필요.
[Docs Only] Maroo privacy, identity, core, sending-okrw 페이지와 고정 Clairveil docs/README.md 확인. 개별 PCL 상세 페이지 일부는 웹 도구 cache miss로 읽지 못했으며 개요만 확인했다.

### Execution
[Local] 읽기 목록을 대화로 정리. 온체인 호출/변경 없음. 정확한 시각 미수집.

### Result
PASS — 출처 기반 읽기 순서 정리.
NOT TESTED — 수취인 자격 집행 경로, 정책 설정 권한, 실제 정책 등록과 집행.

### Diagnosis
관찰 사실: 공식 개요의 EAS_POLICY 대상은 발신자. 이전 수취인 KYB 시나리오는 설계 후보이며 검증된 기능이 아님. 수취인 조건을 집행할 수 없다고 단정하는 것 역시 현재 근거 밖이다.

### Next Step
발신자/수취인 중 정책 평가 대상과 실제 호출 경로를 공식 상세 인터페이스 및 테스트넷 증거로 확인한다.

### Human Judgment
사용자가 직접 읽을 자료 정리를 요청했다. 특정 정책 선택은 아직 미확정.

## 009 — Privacy 정상 흐름과 Maroo 연결 조건 실행 검증

[Submission: Validation] [Submission: DX Feedback] [Submission: AI Usage] [Submission: Known Limitations] [Submission: Workshop]

### Goal
Clairveil deposit → transfer → scan 및 Maroo live 연결에 필요한 gate를 검사하고 실제 실행 가능 범위와 최초 차단 계층을 남긴다.

### Initial Hypothesis
[AI Hypothesis] 고정 upstream의 Go SDK 검사와 공개 Maroo ABI 조회를 통해 lifecycle 준비도를 판정할 수 있다. 이는 정상 흐름 성공 가정이 아니다.

### Source Grounding
[Docs Only] [조사 목록](evidence/docs-only/PRIVACY_SOURCES.json), 공식 @maroo-chain/contracts@0.0.9, Clairveil SHA af04cfc994a3da87a8b1b902eda0988feb512539. 공식 문서를 HTTP로 직접 확인하고 패키지 tarball integrity 및 v0.6.0 handoff digest를 검증했다. handoff 안에는 .pk/.vk/.r1cs 파일이 없었다. 소스의 개발용 setup 명령은 확인했으나 Maroo 호환 artifact로 해석하지 않는다. 조사 범위에서 Maroo 배포 circuit identity/PK/VK/PI serialization/query/known-good fixture를 확보하지 못했다.

### Execution
2026-09-26~27 KST. Windows amd64, Node 22.14.0, Go 1.25.13. 명령·상태·로그 참조는 [Privacy 보고서](docs/PRIVACY_VALIDATION.md)에 모았다.

- [Live Testnet] 공식 chain 450815 확인. 블록 19163317에서 PCL params/global/Privacy contract policies 및 code, 최근 1,000블록 이벤트 조회 5개 PASS. stateChange=false. 이벤트 없음은 제한 구간의 결과다. 거래를 서명/전송하지 않았다.
- [Local] 공식 ABI 합성 검사 6개 PASS. 문서 import path는 ERR_MODULE_NOT_FOUND, 실제 배포 경로로 해결. proof 생성·실행 증거가 아니다.
- [Local] SDK 5개 패키지 실행 FAIL. Unix syscall 및 unsupported native secret execution profile 확인. GOPATH 기본 경로 권한 실패는 ignored 로컬 cache로 해결.
- [Local] 전체 Privacy 및 setup/app/node-command 포함 33개 패키지 실행: 최초 PASS 8 / FAIL 22 / no test files 3. test/subtest 완료 이벤트 PASS 923 / FAIL 266 / SKIP 17. 독립 시나리오 수가 아니다. circuit/keeper는 조사자가 지정한 3분 timeout; artifact-gated 테스트는 SKIP.
- [Local] generated source hash 2건은 CRLF 변환으로 확정. Git blob 및 LF 정규화 hash가 기대값과 일치. 2개 파일을 원본 바이트로 복원하고 frct/scalarct 재실행 PASS. index refresh 후 upstream clean, 알고리즘/guard 변경 없음. 최초 실행 결과는 보존.
- [Local] fixture validator PASS, 제출 저장소 typecheck PASS, 테스트 10/10 PASS. 비밀 검사 PASS(best effort).
- [Local] WSL 접근은 E_ACCESSDENIED. Linux의 전체 lifecycle을 실행하지 못했다. Linux 재실행 wrapper는 준비했으나 실행 미검증, 기본 timeout 20분.

### Result
PASS — 공개 조회, 외부 ABI 형식, 정적 fixture, 제출 저장소 검사, 줄바꿈 수정 후 2개 패키지.
FAIL — 최초 Windows upstream 테스트 실행.
BLOCKED — 현재 환경의 node/prover/lifecycle, valid Maroo Privacy 연결.
NOT TESTED — 실제 정책 집행, production 운영, Linux 실행 성공.

### Diagnosis
확정: Unix syscall 의존 및 native secretprofile의 Linux/macOS 허용 목록. CPU 검사에서 AES/PolynomialMultiply는 true였으며 OS에서 거부했다. 추가 hash 실패는 줄바꿈 문제로 해결. timeout을 제품 결함으로 단정하지 않는다. 로컬 최초 차단 계층은 infrastructure. Maroo는 circuit/artifact 호환 정보 및 privacy state query 확보가 선행 조건이며 기능 부재 주장이 아니다.

### Next Step
1. 접근 가능한 Linux/WSL2에서 원본 LF checkout 및 지원 CPU/Go 확인 후 재실행.
2. 개발용 artifact와 V4 설정 identity를 맞추고 실제 node/prover에서 deposit → transfer → Bob scan 증거 확보.
3. Maroo 배포 버전과 일치하는 artifact/query/serialization/fixture를 확보해 별도 live 검증.

### Human Judgment
사용자: **“Linux/WSL2를 기본 환경으로 한다.”** Windows에서 실행되지 않는 근본 원인 설명을 요청했고, 현재 구현의 지원 OS·syscall 의존성으로 설명했다. production 적합성에 대한 판단은 요청/수집하지 않았다.

### AI Usage Candidates — 이번 검증의 수정 사례
- AI가 npm package의 Solidity 폴더 일부만 보고 Privacy ABI가 없다고 잘못 말했다. dist의 실제 JavaScript ABI를 발견하고 즉시 정정했다. 공식 export 경로로 스크립트를 구현했으며 패키지의 ABI 부재를 DX 문제로 기록하지 않는다.
- 검색 캐시의 오래된 오류 설명과 현재 문서를 혼동할 뻔했다. 원본 HTTP 응답으로 확인해 오류 타입 모순을 문서 결함으로 제출하지 않았다.
- 첫 Go 실행의 PowerShell 파이프라인은 실패 exit code를 보존하지 않았다. 로그 FAIL을 기준으로 판정했고 후속 전체/재검사 명령에서 실제 Go exit를 명시적으로 반환했다.
- 광범위 검사에 3분 timeout을 적용해 circuit/keeper가 완료되지 않았다. 이를 알고리즘 실패로 분류하지 않고 Linux 후속 실행 제한을 늘렸다.
- 원본 fixture/암호 테스트 stdout에는 비밀 벡터가 포함될 수 있어 공개 결과에는 테스트 이름·상태·비밀 없는 진단만 저장했다.

## 010 — WSL 접근 거부 원인 분리 (진행 중)

### Goal
Linux/WSL2 실습에 진입하기 위해 WSL 접근 거부가 Windows 전체 문제인지 실행 환경 제한인지 구분한다.

### Initial Hypothesis
[AI Hypothesis] 현재 shell의 sandbox 사용자/권한과 실제 Windows 사용자의 WSL 등록·서비스 접근 범위가 다를 수 있다.

### Source Grounding
[Docs Only] Microsoft WSL basic commands: https://learn.microsoft.com/en-us/windows/wsl/basic-commands . 상태/배포판 확인 명령을 사용하며 재설치나 초기화를 먼저 시행하지 않는다.

### Execution
[Local] 2026-09-27 KST. wsl --version 성공: 2.7.3.0, kernel 6.6.114.1-1. WslService Running/Automatic. wsl --status 및 --list --verbose는 Wsl/EnumerateDistros/Service/E_ACCESSDENIED. 현재 프로세스 그룹에서 CodexSandboxUsers 확인. 일반 PowerShell에서 같은 목록 조회 결과를 사용자에게 요청했다.

### Result
PASS — WSL 바이너리 설치와 서비스 실행 확인.
BLOCKED — 현재 실행 환경의 배포판 조회. Windows 전체 장애 여부는 아직 미확정.

### Diagnosis
최초 계층 infrastructure/authorization. WSL 미설치 또는 고장으로 단정할 근거 없음. 현재 sandbox와 일반 사용자 실행 결과 비교 필요.

### Next Step
사용자의 일반 PowerShell 결과로 분기한다. 일반 환경이 정상이라면 지원되는 실행 환경을 사용하고, 같은 오류라면 Windows 서비스/정책 진단을 이어간다. 보안 설정 변경·서비스 재시작·배포판 초기화는 아직 시행하지 않았다.

### Human Judgment
사용자는 WSL 접근 문제 해결을 요청했다. 비교 결과 대기.

### 010 후속 확인 — 사용자 WSL 정상, agent 접근 차단 지속
[Local / 사용자 제공] 일반 PowerShell의 `wsl -- uname -r`는 6.6.114.1-microsoft-standard-WSL2, `wsl -- git --version`은 2.43.0. 당시 Ubuntu Go는 command not found. 이후 사용자는 설치 안내 실행을 완료했다고 알렸다.
[Local / agent 실행] `wsl -- go version` 및 `wsl -- git --version` 재시도는 Wsl/Service/CreateInstance/E_ACCESSDENIED. 사용자 Ubuntu의 장애가 아니라 현재 agent 실행 환경에서 접근이 차단된 사실을 확인했다. Go 설치 결과/버전은 직접 확인하지 못했으며 PASS로 기록하지 않는다.
Next Step: 사용자의 Ubuntu에서 `go version` 출력 확보. 비밀번호나 개인키는 필요하지 않다.

### 010 사용자 Ubuntu 개발 도구 확인
[Local / 사용자 제공] `go version`: go1.22.2 linux/amd64. `make --version`: GNU Make 4.3. `gcc --version`: Ubuntu GCC 13.3.0. 결과 PASS — Linux 기본 빌드 도구 설치 확인. Clairveil 요구 Go 1.25.13은 아직 Ubuntu에서 확인되지 않았다.
Next Step: Ubuntu에서 `GOTOOLCHAIN=go1.25.13 go version`으로 필요한 toolchain 다운로드/실행을 확인한다. Windows Go 및 Windows용 캐시와 구분한다. agent 직접 WSL 접근은 계속 BLOCKED이며 사용자가 제공한 실행 결과를 근거로 삼는다.

### 010 Linux Go toolchain 확인 완료
[Local / 사용자 제공] Ubuntu에서 `GOTOOLCHAIN=go1.25.13 go version` 실행: linux/amd64 toolchain 다운로드 후 `go version go1.25.13 linux/amd64`. PASS — 필요한 Linux Go 버전 실행 확인. native secret CPU gate 및 실제 Privacy 테스트는 아직 미실행.
Next Step: Ubuntu Linux 파일 시스템에 core.autocrlf=false로 별도 clone, 기존 SHA af04cfc994a3da87a8b1b902eda0988feb512539 checkout 후 전체 Privacy/setup/app/node-command 검사를 실행한다. stdout/stderr는 로컬 파일로 보관하고 공개 대화에는 패키지 상태 요약만 공유한다.

## 012 — 2026-09-27 Track B 원문 재확인 및 Linux 실행 시작

### Goal
남은 10시간 안에 Track B 제출을 완성하기 위해 원문 기준을 확인하고 Privacy 정상 흐름의 Linux 실행을 우선한다.

### Source Grounding
[Docs Only] 사용자가 지정한 Interview Brief 원문과 §8 Track B를 읽었다. OKRW/PCL/Privacy 모두 의미 있게 사용, Maroo 상태 변경 실제 시도, privacy end-to-end 흐름, 60~75분 workshop, 오류 5개 이상, DX 3개 이상, AI 가속 2개와 오류 수정 1개 이상, 5~8분 영상이 기준이다. Linux 빌드 자체를 과제 완료로 간주하지 않는다.

### Execution
[Local] 원본 checkout에서 /tmp/maroo-privacy-run/clairveil로 core.autocrlf=false, --no-hardlinks clone. HEAD af04cfc994a3da87a8b1b902eda0988feb512539 확인. 원본은 보존했다. Go 1.25.13 linux/amd64를 기존 설치에서 사용하고 전용 /tmp 캐시에 의존성을 준비했다.
[Local] Node v22.14.0으로 제출 저장소 테스트 10/10 PASS. 시스템 기본 Node v18 대신 기존 Node 22 절대 경로를 사용했다.
[Local] Go deposit/transfer 패키지 검사, 개발용 artifact setup, node binary build를 시작했다. 아직 완료 결과는 미확정. 로컬 개발용 artifact는 Maroo 호환 증거가 아니다.
[Local] scripts/decode-pcl-evidence.mjs로 기존 공개 조회의 policy bytes를 공식 ABI의 _policies tuple로 해석하고 재인코딩 일치를 검사한다. evidence/local/PCL_DECODED.json은 블록 19163317의 기존 조회 결과를 해석한 것이며 새 조회나 정책 집행 증거가 아니다. Privacy 정책은 AND(EAS_POLICY, DENYLIST_POLICY)로 해석됐다.

### Result
PASS — 제출 저장소 테스트. IN PROGRESS — upstream 빌드/검사 및 artifact 생성. NOT TESTED — node lifecycle, 실제 정책 집행.

### Diagnosis
이전 Windows 지원 OS 차단 이후 Linux에서 다음 실행 단계에 진입했다. 별도 node/proof/state 결과 전까지 lifecycle 성공으로 표시하지 않는다.

### Next Step
개발용 artifact 완료 후 동일 identity의 audit config와 전용 node를 준비한다. 사용자에게 기존 송금 성공 해시 유무를 요청해 중복 제출을 피한다.

### Human Judgment
사용자는 제출 마감까지 10시간 남았다고 알리고 작업 시작을 요청했다. 이전 실제 송금 결과는 응답 대기다.

### 012 중간 검증 결과
- [Local] Linux deposit/transfer SDK 2개 패키지 PASS. test/subtest 종료 이벤트 PASS 160, SKIP 2. Skip은 TestAuditV2DepositWitnessSatisfiesP3R1CS 및 TestAuditV2TransferWitnessSatisfiesP3R1CS이며 실제 artifact로 재실행이 필요하다. 원본 로그에서 stdout을 제외한 상태 요약을 evidence/local/LINUX_SDK_TESTS.json에 저장했다.
- [Live Testnet] 새 블록 19173032에서 공개 조회 5개 PASS. stateChange=false. 원본 과거 증거는 보존하고 evidence/live-testnet/PRIVACY_PUBLIC_PROBE_LINUX.json에 저장했다.
- [Local] PCL decoder의 재인코딩 일치 검사 PASS. workshop/VALIDATION.md의 과거 잔액/미리보기·PCL·자료 조사 상태를 기존 증거에 맞춰 수정했다. 실제 송금·PCL 집행·local lifecycle은 계속 미완료다.

## 013 — Linux 실제 Privacy lifecycle과 독립 재현 성공

### Goal
로컬 reference chain에서 입금·비공개 이체·수취 scan을 완료하고 새 계정/상태로 재현한다.

### Execution
[Local] 고정 SHA, Linux/WSL2, Go 1.25.13. 개발용 4-circuit bundle을 `go run -p 2 ./cmd/clairveil-setup -development -out ...`로 생성했다. 임의 proof를 사용하지 않았다. configgen.go는 upstream 공개 crypto API로 임의 감사 키·PoP·network nonce와 circuit identity를 구성한다. 비밀 키는 전용 0600 파일로 분리했다.
실제 node에 deposit 10uclair, auto-dummy 준비 batch, transfer 7uclair를 제출하고 RPC receipt의 code 0을 확인했다. Alice 10→3, Bob 0→7을 scan으로 확인. evidence/local/LOCAL_PRIVACY_LIFECYCLE.json 참조.
[Local] 새 계정과 새 genesis로 `demo/clairveil/run-local.py`를 실행했다. 준비된 동일 개발용 artifact와 빌드 캐시만 재사용했으며 체인/지갑 상태는 재사용하지 않았다. 두 번째 정상 흐름과 Bob 반복 scan 동일성 PASS. evidence/local/LOCAL_PRIVACY_REHEARSAL.json 참조. helper가 만든 두 번째 node는 종료했다. 최초 수동 실행 node는 현재 실행 중이며 영상 확인에 사용할 수 있다.
[Local] artifact를 넣은 두 witness 검사도 PASS. 전체 upstream suite나 production 보안 검증을 수행한 것은 아니다.

### Result
PASS — 실제 Linux 로컬 privacy deposit → transfer → scan, 새 상태 재현 및 반복 scan. NOT TESTED — Maroo verifier 호환성, 실제 PCL 거부, auditor 복호화, production readiness.

### Diagnosis
이전 Windows OS 차단을 Linux로 해소했고 개발용 bundle과 공개 V4 설정을 일치시켜 node를 실행했다. 자동 dummy는 이 버전에서 추가 self batch 거래를 발생시켜 별도 receipt를 기록했다. CLI stdout의 proof logger와 JSON이 섞여 첫 증거 parser가 실패했으며 명시적 JSON object 추출로 수정했다. 체인 실패가 아니라 로그 처리 오류다.

### Next Step
로컬 실습을 제출 가이드에 연결하고 Maroo 실제 송금의 기존 증거를 재검증한다. 참가자가 직접 실행하고 결과를 설명하는 리허설은 아직 필요하다.

### Human Judgment
이 결과에 대한 지원자의 해석은 아직 수집하지 않았다.

## 014 — 기존 Maroo 실제 송금 증거 복구

### Goal
중복 송금 없이 과거 상태 변경 결과를 확인한다.

### Execution
[Local] ignored .private/evidence에 2026-09-26T10:23:24.697Z의 성공 transfer-receipt 기록을 발견했다. 앞서 공개 evidence 폴더만 보고 송금 미완료라고 판단한 것은 잘못이었다.
[Live Testnet] scripts/verify-known-transfer.mjs로 기존 hash 0x0e47b177aea4f55b83967dcb3082a7e62e5f7afc13fe2bf068ff6ff27d4284ef를 읽기 전용 재조회했다. chain 450815, block 19148348, status 1, value 1 tOKRW, 수신자 전후 블록 잔액 0→1 tOKRW. 새 서명/전송 없음. evidence/live-testnet/OKRW_TRANSFER_VERIFIED.json 참조.

### Result
PASS — 기존 사용자 Maroo 상태 변경 송금의 온체인 재검증. PCL event는 receipt에서 확인되지 않았으며 정책 인과관계를 별도로 주장하지 않는다.

### AI Usage
AI가 공개 증거 폴더만 확인하고 송금 미완료라고 잘못 요약했다. ignored 실행 로그를 조사하고 RPC receipt/잔액을 대조해 정정했다. 사용자의 실제 실행과 문서의 미갱신 상태를 구분해야 한다.

### Next Step
제출 문서의 미완료 송금 표시를 정정하고 PCL 의미 있는 사용·거부 판정 근거를 보완한다.

## 015 — PCL RPC simulation에서 금액 경계 확인

### Goal
같은 지급 입력의 금액만 바꿔 PCL 통과/거부 원인을 확인한다.

### Source Grounding
[Docs Only] @maroo-chain/contracts@0.0.9 IPcl ABI의 VolumePolicy, LogicalPolicy와 custom errors. 과거 공개 정책 bytes의 AND/OR 구조는 별도 block snapshot이며 같은 시점 전체 상태라고 주장하지 않는다.

### Execution
[Simulation] scripts/probe-pcl-estimation.mjs, Maroo chain 450815, block 19174089. 동일 from/to/block에서 RPC balance override=100,000,000 tOKRW를 적용하고 value만 1/2,000,000/2,000,001로 바꿨다. 앞 두 요청은 eth_estimateGas 성공, 마지막은 AnyOfRejected. 공식 ABI로 childReverts를 재귀 해석해 VolumeAboveMaxLimit(max=2,000,000, value=2,000,001), EasNoAttestationReceived 및 하위 EAS 거부를 확인했다. 새 서명/전송·정책 변경 없음. evidence/local/PCL_ESTIMATION_PROBE.json 참조.

### Result
PASS — 실제 RPC simulation에서 기대한 한도 경계와 정책 오류 확인. NOT TESTED — 포함된 거부 transaction, 관리자 변경, 모든 사용자/정책 경로.

### Diagnosis
가상 잔액은 실제 자금 부족을 분리하기 위한 simulation 조건이다. 거부의 최초 확인 계층은 PCL/policy이며 무작위 revert를 정책 결과로 취급하지 않았다. OR의 다른 자격 경로가 있으므로 금액 상한을 모든 계정의 절대 제한으로 일반화하지 않는다.

### Next Step
지원자가 simulation/live/local 경계를 직접 설명하고 70분 운영안을 리허설한다. 영상과 공개 저장소 게시를 완료해야 최종 제출 완료다.

### Human Judgment
세 환경을 나눈 이유에 대한 지원자 설명을 요청했다. 응답 전에는 AI 해석을 지원자의 판단으로 기록하지 않는다.

### 마감 전 검토 상태
- 문서 로컬 링크 검사: 누락 0건. 최신 소스 비밀 자동 검사 PASS(best effort).
- 지원자 발표용 docs/VIDEO_SCRIPT.md(목표 6분 30초)를 작성했다. 실제 녹화·업로드는 미완료다.
- 원본 키·node state·artifact는 /tmp의 전용 실행 경로에 남겼고 공개 검토 ZIP에서 제외했다. 수동 실행 node도 검증 후 종료했다.
- GitHub 연결 계정은 hyeongseobshin으로 확인. 공개 저장소 위치/게시 선택과 지원자 Human Judgment 응답 대기다. 아직 원격 저장소를 생성하거나 게시하지 않았다.

## 016 — 공개 저장소 게시 준비

사용자가 공개 게시 대상으로 https://github.com/nubro999 를 지정했다. 저장된 해당 계정 인증으로 nubro999/maroo-devrel-workshop을 생성했다. 원본 .env, .private, .external, node_modules와 지갑·artifact는 제외하고 공개 파일만 검토한다. 비밀 자동 검사 PASS. 영상은 아직 미등록이며 미완료 표시를 유지한다.


## 검증 발견 — EAS 증명 내부의 false 값도 지급 통과

**실행 결과, `false`도 지급이 통과했다. 이번 `EAS_POLICY` 설정은 불리언 값이 `true`인지 강제하지 않았다.**

새 실험 스키마에서 동일 발신자·수신자·금액(0.001 tOKRW)·프록시·정책을 유지했다. `false`와 `true` 증명의 만료 시각과 부가 데이터도 동일하게 설정했고, EAS에 저장된 데이터 값을 직접 조회했다. `false` 증명을 폐기한 뒤 `true`를 발급하여 두 증명이 동시에 유효하지 않도록 했다. 스키마 resolver는 0 주소였다.

| 조건 | 실제 포함 거래 결과 |
|---|---|
| 증명 없음 | status 0, EasNoAttestationReceived, 지급 없음 |
| 유효한 false 증명 | status 1, PolicyCheckPassed, 수신자 +0.001 tOKRW |
| false 증명 폐기 | status 0, EasAttestationRevoked, 추가 지급 없음 |
| 유효한 true 증명 | status 1, PolicyCheckPassed, 수신자 +0.001 tOKRW |

- [false 지급 성공 거래](https://explorer-testnet.maroo.io/tx/0x69f42f10fd795af26af78f717d676b1e6bba05d119e9886e786ffec706afc07b)
- [true 지급 성공 거래](https://explorer-testnet.maroo.io/tx/0x9810ab00b4d6ec3dab6accd4aa5e2cb1c435bd1bc75a458bf8f039073b33a917)
- [실행 기록](evidence/live-testnet/EAS_BOOLEAN_RESULT.json) / [독립 RPC 재조회](evidence/live-testnet/EAS_BOOLEAN_VERIFIED.json)

**PoC 설계 의미:** 이 설정에서 승인 여부를 false 값으로 기록하는 것만으로는 지급을 차단할 수 없다. 유효한 증명 보유를 승인으로 사용하는 경우, 승인 대상에게만 증명을 발급하고 승인 취소 시 폐기하는 수명주기가 필요하다. 신뢰할 발급자 제한은 별도로 구현·검증해야 한다.

**해석 범위:** 이 실험은 해당 스키마와 EAS_POLICY에서 불리언 true를 강제하지 않음을 보여준다. 다른 정책·resolver의 데이터 검사를 일반화하거나 제품 결함으로 단정하지 않는다. 실제 KYB 심사, 발급자 제한, 만료 후 차단, Privacy 지급은 이 실험에서 검증하지 않았다. 종료 시 두 증명 모두 폐기하고 프록시 정책을 이전 상태로 복원했다.


## 017 — 최종 워크숍 패키지와 제출 자료 제작 (2026-09-27)

### Goal
[Workshop Design] Track B 전체 산출물을 최신 실제 증거와 맞추고 지원자의 직접 수행 항목을 구분한다. 이전 로그의 게시 대기·simulation-only 표시는 당시 상태이며 아래가 최신이다.

### Initial Hypothesis
[AI Hypothesis] EAS 데이터 true가 승인을 표현할 수 있다고 보았으나 비교 실행에서 false도 통과했다. 최종 시나리오는 유효한 자격 보유와 폐기에 맞춘다. 신뢰할 발급자 통제는 별도 미검증이다.

### Source Grounding
[Docs Only] Interview Brief Track B, docs.maroo.io PCL dual-track/EAS/Privacy, @maroo-chain/contracts 0.0.9, 고정 Clairveil SHA를 사용했다. 출처는 docs/RESEARCH_SYNTHESIS.md와 ATTRIBUTION.md 참조.

### Execution
[Live Testnet] 기존 PCL/EAS/불리언 실험과 독립 RPC 재조회 결과를 evidence/live-testnet에 보존했다. 이 패키징 단계에서 새 유료 거래를 실행하지 않았다.
[Local] Node 22.14에서 타입 검사·단위 테스트 10개·3개 PCL 실행 파일 구문 검사 및 broadcast 없는 안전한 기본 실행을 확인했다. 신규 경로 설치 검증은 workshop/VALIDATION.md 참조.
[Workshop Design] 22장 70분 워크숍 PPTX/PDF·진행 대본, 참가자/진행자/설치/문제해결 가이드, 7장 영상 PPTX/PDF·7분 목표 대본, 요구사항·증거·리서치·사용자 작업 목록을 작성했다.

### Result
PASS — 실제 검증 증거와 교육 자료 패키징. NOT TESTED — 최종 경로 버전의 추가 live 전송, 전체 사람 대상 리허설, Maroo Privacy 호환 지급·감사자 복호화. NOT DONE — 지원자 영상 녹화·업로드.

### Diagnosis
[DX Feedback] Explorer custom error 표시, 체험 시뮬레이션 안내, EAS 인덱싱과 데이터 조건 오해를 문서화했다. 관찰과 추정 원인을 구분하며 UI 내부 원인을 단정하지 않는다.

### Next Step
지원자는 자료 검토·리허설 후 5–8분 한국어 영상을 녹화·업로드하고 video-link.md에 실제 링크를 입력한 뒤 지정 채널로 제출한다.

### Human Judgment
사용자가 명시한 대상 우선 설계, PCL/Privacy 분리, false 비교 검증, 다음 단계 강의 제외와 UX 개선 제안을 반영했다. 영상·이해·독립 리허설이 완료되었다고 대신 주장하지 않는다.


## 018 — 슬라이드 압축·아키텍처 다이어그램·실습 웹사이트 (2026-09-27)

### Goal
[Workshop Design] 사용자 요청에 따라 설명 페이지를 줄이고 커맨드를 별도 배포 웹사이트로 분리한다.

### Initial Hypothesis
[AI Hypothesis] 10장의 설명 자료와 한 페이지 커맨드 사이트가 발표·실습 전환을 단순하게 만들 것으로 설계했다. 교육 효과는 참가자 리허설 전이다.

### Source Grounding
[Docs Only] Maroo PCL dual-track·EAS 튜토리얼·Privacy 공식 문서를 다시 확인했다. 프록시 훅과 구현체 호출 관계를 다이어그램으로 표현했다. Experience는 사용자 확인 시뮬레이션 경로로 표시했다.

### Execution
[Local] 22장을 10장으로 압축, 은행 연결·Maroo 계층·프록시·로컬 Privacy 다이어그램과 PDF/PPTX 클릭 링크 추가. 기존 70분 시간 배분은 유지했다. 8개 복사 명령·Bash/JS 구문·내부 링크를 확인했다.
[Workshop Design] 사이트는 환경 준비/PCL·EAS/로컬 Privacy/성공 기준/참고자료로 구성했다. 네이티브 배포 상태 응답에서 성공을 확인했다. 실제 테스트넷 거래 추가 전송 없음.

### Result
PASS — 슬라이드·사이트 소스·배포. NOT TESTED — 전체 참가자 리허설과 이번 명령을 통한 추가 live 전송.

### Diagnosis
사이트는 지갑·개인키 입력과 자동 전송 기능이 없다. 사용자 환경의 키는 로컬 .env에서만 입력한다. 기존 검증과 당일 실행을 구분한다.

### Next Step
지원자는 압축본과 실습 사이트로 설명·실습을 리허설한다. 영상 녹화는 여전히 지원자 수행 항목이다.

### Human Judgment
사용자가 아키텍처 도식과 체험·참고 링크를 요구하고, 페이지 수를 줄이며 실습 커맨드를 웹사이트로 분리하기로 결정했다.


## 019 — White × Maroo 시각 개편 (2026-09-27)

### Goal
[Workshop Design] 사용자가 요청한 Canva 스타일과 화이트·Maroo 코어 색 조합을 슬라이드·실습 사이트에 반영한다.

### Initial Hypothesis
[AI Hypothesis] 큰 제목·여백·페이지별 다른 레이아웃이 기존 반복 카드보다 발표 흐름을 명확하게 보여줄 것으로 설계했다. 사용자 선호 최종 확인 전이다.

### Source Grounding
[Docs Only] https://www.maroo.io/en 에서 CSS의 --teal:#0096aa, --orange:#ff8c50 및 --teal-dark:#007a8a를 확인했다. 공식 브랜드 매뉴얼 확보를 주장하지 않는다.

### Execution
[Local] 워크숍 10장·영상 7장 PDF/PPTX에 흰 배경, 청록·주황 강조, 큰 표지·결과 숫자, 둥근 도식과 열린 비교 레이아웃을 적용했다. 워크숍 PDF 전체 미리보기와 영상 표지를 확인했다. 사이트 CSS와 favicon만 변경, JS 구문 검사 및 로컬 HTTP 200 확인.

### Result
PASS — 시각 자료·사이트 테마 변경. 상태 변경 거래·실습 결과 변경 없음. 사용자 최종 디자인 선호는 확인 전.

### Diagnosis
[Workshop Design] Canva 스타일은 시각 참고이며 실제 Canva 편집기 사용으로 표기하지 않는다. 사이트 접근 범위는 기존 본인 전용 설정을 유지한다.

### Next Step
지원자가 새 PDF와 편집용 PPTX로 발표를 검토한다. 실제 영상 녹화는 여전히 미완료다.

### Human Judgment
사용자가 이전 디자인을 거절하고 화이트·Maroo 코어 색 조합과 Canva 스타일을 명시했다.


## 020 — 원문 기준 제출 감사 (2026-09-27)

### Goal
[Submission: Validation] 과제 원문 §6·§8·§10–11·§14–15와 최신 commit 5680b0e를 대조한다.

### Initial Hypothesis
[AI Hypothesis] 영상 외 요구도 대부분 충족했을 것으로 보았으나 캐시 재사용 안내의 코드 불일치와 설명 깊이 문제를 발견했다.

### Source Grounding
[Docs Only] 원문은 Maroo 상태 변경 + 로컬 Privacy 흐름을 허용하고, disclosure·키·신뢰 경계 설명 및 실제 5–8분 영상을 요구한다. 사이트·슬라이드 장수·고급 디자인은 필수가 아니다.

### Execution
[Live Testnet] 새 거래 없이 chain 450815와 기존 receipt 9건 status·block 재조회 일치.
[Local] 타입 검사, 10개 테스트, broadcast 없는 3개 lab 기본 실행, history 비밀 검사 PASS. Markdown 로컬 링크 누락 0. PPTX 10/7장 확인. 빈 환경 변수에서 run-local.py의 환경 설정 부분을 평가해 매 run-dir별 GOPATH/GOCACHE가 달라짐을 재현했다. 전체 빌드 실행은 아니다.
[Docs Only] 사이트 접근 정책은 owner 1명 custom, 실제 영상 URL 없음. disclosure 설명은 개요 수준이다.

### Result
PARTIAL — 핵심 실습·증거는 충족, 영상 필수 미충족. 캐시 기본 경로와 수업 시간 재현, 사이트 접근, disclosure 구체성 보완 필요. 최종 패키지의 추가 live E2E는 미검증이다.

### Diagnosis
캐시 문제는 제출 wrapper/가이드 계층이며 Maroo 체인 결함이 아니다. 사이트는 배포 성공이지만 공개 접근이 아니다. 실제 감사 복호화 실행을 필수로 오해하지 않고 설명 요구와 구분했다.

### Next Step
캐시 설정 보완·최종 명령 리허설, disclosure/키/권한 표, 외부 접근 동선, 실제 영상 완성. 상세 보고서는 현재 작업 outputs/과제_기준_검증_보고서.md에 저장했다.


## 021 — 사용자 실습 기록과 문장 다듬기 (2026-09-27)

### Goal
[Submission: Workshop] 사용자가 이해하기 어려웠던 로그·Gwei·실패 수수료를 기록하고 문서와 실습 사이트의 문장을 개선한다.

### Initial Hypothesis
[AI Hypothesis] 명령→확인할 로그→결과 해석 순서와 짧은 문장이 실습 독해를 돕는다고 보고 자료를 재구성했다.

### Source Grounding
[Live Testnet] 사용자가 공유한 PowerShell 출력과 .private/pcl-proxy/RESULT.json이 일치하며 passed=true를 확인했다. USER_PCL_RUN으로 공개 결과만 보존했다.
[Docs Only] Ethereum gas 설명과 Maroo litepaper의 네이티브 수수료 설명을 연결했다. Explorer 내부 단위 변환 원인은 단정하지 않았다.

### Execution
[Local] README·참가자·진행자·시나리오·제출 노트·영상 대본의 표현을 다듬었다. GAS_AND_RESULTS에 실제 정상/차단 거래 링크, 수취인 증가량 0, 실패 수수료 2.25 tOKRW를 기록했다. 사이트의 표시 명령과 복사 데이터를 함께 node 직접 실행으로 수정했다. LOCAL_RUN과 사이트에 공유 Go cache 변수를 추가했다. 실행 코드의 체인 로직은 바꾸지 않았다.

### Result
PASS — 사용자 PCL 로그·로컬 결과 파일 대조와 문서 반영. 이 편집에서 새 거래를 전송하지 않았다. NOT TESTED — 공유 cache 수정 후 전체 실행 시간, EAS·Privacy 최종본의 새 실행.

### Diagnosis
[Submission: DX Feedback] Gwei의 의미·실패 수수료·npm 옵션 전달은 각각 설명과 도구 계층의 문제로 구분했다. 기존 감사에서 지적한 cache 경로를 안내에 고정했지만 재실행 측정 완료로 표시하지 않았다.

### Next Step
사용자는 로그 해설을 읽고 EAS 실습으로 진행할 수 있다. 실제 녹화·사이트 공개 선택·전체 시간 리허설은 남아 있다.

### Human Judgment
사용자가 PCL 스크립트를 직접 실행하고 정상/거절 거래를 열어 확인했다. 가스 단위와 실패 수수료 설명을 문서화하고 산출물 전반의 문장을 다듬도록 요청했다.

## 022 — 승인 상태 중심으로 핵심 시연 재구성 (2026-09-27)

### Goal
[Submission: Workshop] 미승인 차단 → 승인 후 지급 → 승인 취소 후 차단을 핵심 시연으로 구성한다.

### Initial Hypothesis
[AI Hypothesis] 발급·폐기 상태와 지급 결과를 연결하면 승인 정책의 효과를 명확히 설명할 수 있다.

### Source Grounding
[Live Testnet] 기존 EAS_LIFECYCLE 증거의 없음(status 0), 유효(status 1), 폐기(status 0)를 사용한다. false/true 모두 성공한 기존 결과는 삭제하거나 반대로 표현하지 않는다.

### Execution
[Local] 10장 워크숍, 7장 영상 자료와 대본, 참가자·진행자 가이드, 사이트를 같은 흐름으로 수정했다. bool 비교는 POLICY_CAVEATS와 사이트의 접힌 선택 실험에 남겼다.

### Result
기존 실행 근거에 맞춰 설명을 수정했다. 새 거래 전송이나 approved=false 차단 구현은 하지 않았다.

### Diagnosis
승인을 유효 자격 보유로 모델링한다. 자체 발급 실습이며 신뢰할 발급자 제한과 실제 KYB는 검증하지 않았다.

### Next Step
핵심 시연은 EAS 수명주기 실행 결과의 영수증과 수신자 증가량을 비교한다.

### Human Judgment
사용자가 false 통과를 핵심 시연으로 삼는 것에 이의를 제기하고, 승인 상태 중심 재구성을 요청했다.
