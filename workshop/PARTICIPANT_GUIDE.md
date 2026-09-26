# 참가자 가이드 — Track B (Primary)

처음 참여한다면 [처음부터 준비하기](SETUP.md)에서 시작한다. 기존 지갑, 로컬 .env, 캐시, artifact가 있다고 가정하지 않는다. 설치·지갑 준비도 전체 참가자 여정에 포함하며, 아래 70분은 준비 완료 후 본 실습 시간이다.

상태: **준비용 초안, 워크숍 미실행**. 이 문서의 예상 결과는 실행 증거가 아니다. 잠정 시나리오와 변경 지점은 [SCENARIO](../docs/SCENARIO.md)를 기준으로 한다.

대상은 기업 자금관리 PoC를 4~8주 안에 검토하는 한국의 시니어 백엔드·블록체인 엔지니어다. 공급업체 지급을 예제로 OKRW 가치 이전, PCL 지급 정책, Privacy 정보 보호를 연결한다. PCL은 공개 설정 조회·해석 및 실제 RPC simulation의 한도 경계 비교를 검증했다. 온체인 거부 거래는 미실행이다. Privacy는 별도 Linux 로컬 체인에서 정상 흐름을 검증했다.

## 학습 목표와 사전 준비

- Maroo 테스트넷 조회와 상태 변경을 구분하고 결과를 증거로 남긴다.
- deposit → private transfer → recipient scan을 검증된 live 경로 또는 Clairveil 로컬에서 재현한다.
- 정책 거부, proof/입력 거부, 인프라 오류, 선행 자료 부재를 분류한다.
- 지급자, 수취인, prover 운영자, RPC 운영자와 감사자의 데이터 가시성·키 책임을 설명한다.

Node.js 버전은 루트 README와 package.json을 따른다. Git, 테스트넷 전용 송신·수신 계정, faucet 자산을 준비한다. 개인키는 로컬 `.env`에만 입력하고 채팅·녹화·로그·Git에 넣지 않는다. `.env.example`은 예시만 담는다.

**워크숍 전** 루트 설치·검사를 완료하고, [Clairveil 안내](../demo/clairveil/README.md)에 따라 별도 checkout을 준비하고 사용 SHA를 기록한다. 전체 스택 빌드는 70분 실습에 포함하지 않는다. 진행자가 같은 SHA에서 실제 검증한 시작/초기화/실행 명령과 준비된 환경을 제공하기 전에는 privacy 구간을 실행 가능하다고 공지하지 않는다.

[확인한 upstream 테스트 가이드](https://github.com/DELIGHT-LABS/clairveil/blob/af04cfc994a3da87a8b1b902eda0988feb512539/docs/clairveil-testing-guide.md)에는 checked-in native V2 end-to-end smoke target이 없다. `make init`은 바이너리 설치와 명령 안내이며, `make reference-payroll-demo`는 legacy regression, `make privacy-batch-joinsplit-localnet`은 static fixture 검증이다. 이를 deposit → transfer → scan 완료로 세지 않는다. 수동 V2 준비에는 Go 1.25.13, Git/Make/Bash, 검토한 4-artifact 디렉터리, public V4 audit 설정, Cosmos 계정·genesis·gentx, node/prover 및 수동 tx/rescan 절차가 필요하다. 전체 준비와 검증은 실습 전 별도 작업이다.

```sh
npm ci
npm run setup
npm run typecheck
npm test
npm run secrets:check
```

## 70분 진행

| 시간 | 실습 | 성공 판정 |
|---|---|---|
| 0–8분 | 시나리오, live/local/docs-only 경계, 송신·수신 역할 확인 | 세 환경을 혼동하지 않고 설명 |
| 8–18분 | RPC 연결 및 잔액 조회 | chain ID·block·주소·원시 잔액 응답 기록 |
| 18–30분 | native OKRW transfer 사전 점검 후 테스트넷 제출 | 실제 제출 시도와 receipt 또는 오류 기록 |
| 30–40분 | PCL 정책 역할 및 Privacy 선행 자료 탐색 | 정책 의사결정 지점과 최초 미확인 계층 식별 |
| 40–60분 | 검증된 Clairveil 로컬 deposit → transfer → scan | 같은 실행에서 note/소비 상태/수취 scan 결과 연결 |
| 60–70분 | 증거 정리·disclosure 토론·PoC 계획 | 검증한 범위와 미검증 범위를 분리 |

### 1. 연결과 지급

루트 `.env`에 공개 RPC 설정과 조회할 `MAROO_ADDRESS`를 넣는다. 구체적인 전송 환경변수는 루트 `.env.example`을 따른다.

```sh
npm run check:rpc
npm run balance
npm run transfer:okrw
```

마지막 명령은 기본 dry run이다. 네트워크·송신자·수신자·금액·예상 수수료를 검토한다. dry run은 상태 변경 증거가 아니다. 테스트넷 전용 `MAROO_PRIVATE_KEY`를 로컬에 준비한 뒤 의도한 테스트넷 송금만 제출한다.

```sh
npm run transfer:okrw -- --broadcast
npm run balance
```

tx hash만으로 성공을 판정하지 않는다. receipt status와 송수신 잔액을 확인한다. 송신자 감소액은 송금액과 수수료를 포함할 수 있으므로 수신자 증가와 함께 확인한다. 실패하면 동일 tx의 상태를 먼저 조회하고 무조건 재전송하지 않는다.

### 2. PCL과 Privacy 경계

[PCL 비교 실습](../demo/maroo/PCL_LAB.md)을 수행한다.

```sh
node scripts/probe-pcl-estimation.mjs
```

이는 실제 테스트넷 RPC를 사용하는 `[Simulation]`이다. 같은 블록·계정·가상 잔액에서 금액만 1 / 2,000,000 / 2,000,001로 바꿔 추정 통과와 명시적 정책 거부를 비교한다. 잔액 override를 사용하며 서명/전송은 하지 않는다. `AnyOfRejected`의 하위 `VolumeAboveMaxLimit`와 EAS 오류를 해석한다. 가스 추정은 포함된 거래 성공/실패와 구분한다.

Maroo live Privacy는 circuit pin, 호환 proving artifact, privacy state/Merkle witness 조회, serialization 안내 또는 known-good fixture와 현재 verifier 호환성이 확인된 경우 우선한다. 없으면 정확한 누락 항목을 기록하고 로컬 경로로 이동한다. all-zero proof를 성공 경로처럼 보내지 않는다.

### 3. 로컬 Privacy

[Clairveil 안내](../demo/clairveil/README.md)의 **실제 검증된 SHA별 절차가 작성된 후** 실행한다. 단계별로 deposit 이전/이후 note, transfer 입력 소비 및 출력 생성, 수취인 scan으로 찾은 note를 연결해 기록한다. 출력 형식과 식별자는 해당 upstream 버전에서 확인한다. withdrawal/disclosure는 선택 확장이며 기본 성공 조건에 섞지 않는다.

[Linux 로컬 실행 가이드](../demo/clairveil/LOCAL_RUN.md)의 스크립트를 사용한다. 진행자는 artifact 생성과 빌드를 pre-work로 완료하고, 참가자는 새 계정/체인의 입금·이체·조회 결과를 확인한다. 성공 기준은 Alice 10 → 3, Bob 0 → 7, 각 거래의 블록 포함 code 0이다.

로컬 reference 자산을 Maroo live OKRW로 표현하지 않는다. 로컬 proof 성공은 Maroo verifier 호환성을 증명하지 않는다.

## 제출과 다음 단계

각 실행을 [live 템플릿](../evidence/live-testnet/TEMPLATE.md), [local 템플릿](../evidence/local/TEMPLATE.md), [문서 템플릿](../evidence/docs-only/TEMPLATE.md)에 구분해 남긴다. 로그는 비밀값을 제거한 후 첨부한다.

토론: PCL 정책을 우회할 수 있는 경로는 무엇인가? 누가 amount/recipient/metadata를 볼 수 있는가? prover에 넘긴 값은 무엇인가? disclosure 권한 철회·키 복구는 누가 운영하는가?

후속 PoC는 1–2주에 API/버전·키 책임을 고정하고, 3–4주에 정책 허용/거부와 privacy 정상 흐름을 구현하며, 5–6주에 감사·복구·장애를 검증한다. 7–8주에는 보안·컴플라이언스·운영 검토로 파일럿 조건을 결정한다.
