# 처음부터 준비하기 — Track B

상태: 참가자 온보딩 초안. 기존 개발자 환경에서 일부 명령을 확인했으나 새 PC에서 전체 절차를 리허설하지 않았다. 이 문서만으로 설치부터 Privacy까지 70분 내 완료한다고 보장하지 않는다.

## 0. 실습 폴더와 도구

Privacy 실습 기본 환경은 **Linux/WSL2**다(사용자 결정, 2026-09-26). Windows에서는 Maroo Node/TypeScript 실습을 진행할 수 있으나, 고정 Clairveil SHA의 native secret 연산과 일부 Unix syscall 코드는 Windows 실행에 실패했다. Linux/WSL2에서 별도 preflight를 통과한 뒤 Privacy 실습을 시작한다. 현재 세션의 WSL 접근 실패 및 미완료 항목은 [검증 보고서](../docs/PRIVACY_VALIDATION.md)를 참조한다.

Node.js 22.14 이상(22 또는 24 계열), npm, Git과 EVM 주소를 사용할 수 있는 지갑을 준비한다. 지갑 제품별 화면 절차는 아직 검증하지 않았다. 진행자는 리허설한 OS·버전·설치 안내를 배포 전에 확정한다.

PowerShell 또는 터미널에서 확인한다.

```sh
node --version
npm --version
git --version
```

Windows에서 npm.ps1 실행 정책 오류가 나면 npm 대신 npm.cmd를 사용한다. 관리자 권한이나 전역 실행 정책 변경을 기본 해결책으로 요구하지 않는다.

진행자가 제공한 실제 제출 저장소를 새 폴더에 clone하거나 소스를 받아 연다. 현재 공개 저장소 URL은 아직 없으므로 clone 주소를 임의로 제공하지 않는다. .env, node_modules, .external, .private 등 진행자의 로컬 상태를 복사하지 않는다. package.json이 있는 폴더를 터미널의 작업 폴더로 사용한다.

## 1. 의존성과 로컬 설정

```sh
npm ci
npm run setup
npm run check:rpc
```

성공 기준: 의존성 설치 완료, .env 생성, chain ID 450815와 블록 응답. setup은 기존 .env를 덮어쓰지 않는다. Git checkout에서는 검사 hooks도 설정한다.

실패하면 [Troubleshooting](TROUBLESHOOTING.md)을 보고 설치/권한/RPC 문제를 구분한다. 기존 evidence 파일이 있다고 자신의 연결이 성공한 것은 아니다.

## 2. 역할별 테스트 계정

- 지급자 Alice: 테스트 자금을 받고 지급을 서명한다.
- 공급업체 Bob: 지급을 받는다. Alice와 다른 공개 주소를 사용한다.
- 테스트 전용 지갑을 사용한다. 공개 주소와 개인키를 구분하고 seed/개인키는 제출물이나 채팅에 넣지 않는다.
- [공식 테스트넷 접속 정보](https://docs.maroo.io/resources/network/testnet-access)를 기준으로 지갑의 네트워크를 구성한다. 프로젝트 기본값은 chain 450815, RPC https://rpc-testnet.maroo.io, tOKRW 18 decimals이다.
- [Faucet](https://faucet.maroo.io)에서 지급자 주소에 테스트 자금을 요청한다. faucet의 현재 화면·발급 조건은 참가자 리허설에서 확인할 항목이다. 이 문서에는 미검증 UI 단계를 넣지 않았다.

## 3. .env 입력

편집기로 로컬 .env를 연다. 화면 공유/녹화 중에는 열지 않는다. 아래 변수 설명은 실제 값 대신 역할을 설명한 것이다.

| 변수 | 입력 |
|---|---|
| MAROO_RPC_URL | 기본 테스트넷 URL 유지 |
| MAROO_CHAIN_ID | 450815 |
| MAROO_ADDRESS | Alice의 공개 0x 주소 |
| MAROO_RECIPIENT | Bob의 공개 0x 주소 |
| MAROO_AMOUNT_OKRW | 첫 실습은 1 |
| MAROO_PRIVATE_KEY | Alice의 테스트 전용 키, 실제 송금 단계에서만 필요 |

Bob의 개인키는 이 송금 스크립트에 필요 없다. 새 지갑 생성·키 내보내기 자체는 지갑 제품의 공식 절차에 따라 본인이 수행한다. 키를 명령행 인자로 넣지 않는다.

## 4. 잔액과 미리보기

```sh
npm run balance
npm run transfer:okrw
```

성공 기준: 자신의 지급자 잔액 확인, 미리보기의 from/to/value 확인, broadcast=false, 추정 수수료를 포함한 잔액 충분. 참가자마다 주소·블록·가스 값은 달라진다. 부족한 잔액은 faucet에서 보충한 뒤 다시 확인한다.

이 단계는 [Live Testnet] 조회 및 가스 추정이다. 서명하거나 거래를 제출하지 않는다. 가스 추정은 업무 정책 집행 증명이 아니며 실제 거래 성공을 보장하지 않는다.

## 5. 본인이 첫 송금 실행

Bob의 주소와 1 tOKRW, 수수료, 테스트넷을 직접 확인한 뒤 실행한다.

```sh
npm run transfer:okrw -- --broadcast
```

성공 기준: transfer-submitted의 tx hash에 이어 transfer-receipt가 success이고 수취 잔액 변화를 확인할 수 있다. 출력된 explorer 링크에서 대상·금액·상태를 대조한다. receipt 출력에 senderBefore/After와 recipientBefore/After가 포함된다. 다른 거래가 함께 발생하면 블록 간 잔액 차이만으로 해당 송금의 효과를 단정하지 않는다.

실패 또는 타임아웃이면 tx hash 발급 여부부터 확인한다. hash가 있으면 explorer에서 상태를 먼저 확인하고 같은 송금을 무조건 재실행하지 않는다. 지급액과 가스 비용은 따로 확인한다.

## 6. 자기 증거와 해석

출력은 .private/evidence에 저장된다. 비밀정보가 없는지 확인한 뒤 자신의 증거 ID로 [템플릿](../evidence/live-testnet/TEMPLATE.md)을 작성한다. 기존 개발자 기록을 본인의 실행 증거로 재사용하지 않는다.

직접 답할 질문: 내가 확인한 것은 연결, 가스 추정, 제출, 포함 성공 중 어디까지인가? 지급이 성공했다는 근거는 무엇인가? 이번 송금에서 아직 검증하지 않은 업무 정책은 무엇인가?

## 7. 정책과 Privacy 준비 단계

첫 송금은 기본 연동 확인이다. 잘못된 지급 차단은 다음 실험에서 검증한다. 현재 explore:pcl/privacy는 Docs Only placeholder이므로 정책을 설정한 것으로 간주하지 않는다.

정책 실습을 배포하려면 진행자가 실제 사용 가능한 정책·권한, 허용/거부 입력, 예상 오류, 참가자별 상태 격리와 초기화 방법을 먼저 검증해야 한다. 참가자가 PCL 관리자 권한을 가진다고 가정하지 않는다.

Clairveil도 별도의 [준비 절차](../demo/clairveil/README.md)가 필요하다. source clone/fixture 검사와 실제 node/prover/privacy lifecycle을 구분한다. reviewed artifact/config, 빌드, chain 준비가 확인되지 않은 상태에서 정상 흐름을 실행 가능하다고 안내하지 않는다.

## 참가자 준비 완료 기준

- [ ] 새 소스에서 npm ci/setup을 실행했다.
- [ ] 개인별 테스트 계정 2개와 faucet 자금을 준비했다.
- [ ] 자기 RPC·잔액·미리보기 결과를 확인했다.
- [ ] 정책 실습 권한과 준비된 Clairveil 환경을 진행자와 확인했다.
- [ ] 키 공개 없이 증거를 남기는 방법을 안다.

설치·계정·artifact 준비까지 모두 행사에서 수행하려면 별도의 setup 시간을 편성한다. 70분 본 실습에는 위 준비 완료를 진입 조건으로 두며, pre-work 시간도 참가자 안내에 명시한다. 실제 시간은 clean 환경 리허설 후 확정한다.

### 개인키 형식

MAROO_PRIVATE_KEY는 64자리 16진수이며 앞의 0x는 있어도 없어도 된다. 키 누락과 형식 오류는 서로 다른 메시지로 안내한다. 이 검사는 서명 전 로컬 입력 검사이며 PCL 거부나 온체인 실패로 분류하지 않는다. 키 값은 공유하지 않는다.
