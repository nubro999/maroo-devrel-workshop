# 직접 작성하고 호출하는 터미널 실습

## 상황: 카페 A의 원두 대금 지급

가상 기업 카페 A가 은행의 기업 지급 서비스로 원두업체 B에 대금을 보냅니다. 참가자는 지급 서비스 개발자입니다.

- A–B: 카페 A의 송신 주소를 허용/차단하고 같은 지급 요청을 비교합니다. 차단 목록은 관리자가 지정하며 사기를 자동 탐지하지 않습니다.
- C: 이용 승인 증명 없음 → 유효 → 폐기 상태에 따라 차단 → 지급 → 차단을 확인합니다. 한 계정이 기업·관리자·발급자 역할을 겸하는 자체 발급 예제이며 은행 발급자 제한이나 bool=true 강제는 없습니다.
- D: 별도 Clairveil 로컬에서 Alice=카페 A, Bob=원두업체 B로 가정합니다. 공개 예치 10 → 비공개 지급 7 → note 잔액 3/7을 확인합니다. PCL과 통합한 거래는 아닙니다.

테스트 금액: Maroo 0.001 tOKRW / Clairveil 7 uclair. 실제 원두 가격을 뜻하지 않습니다.

macOS/Linux: 같은 학습 단계. 먼저 `npm run setup:account`를 실행합니다. 기존 .env는 재사용하며, 처음 실행할 때만 배정받은 테스트 개인키를 터미널에 입력합니다.

직접 작성: pay 함수, 정책 설정, EAS 요청, 검증 코드. 제공: ABI·RPC·트랜잭션 전송·노드 초기화·회로/prover. `send`는 한 거래만 전송하며 정책·지급을 자동 선택하지 않습니다. 원클릭 runner는 참고용으로 유지합니다.

Node 콘솔은 A2–C3 동안 유지합니다. 제출 해시가 저장된 `.private/terminal/transactions.jsonl`을 확인하고 타임아웃 때 같은 거래를 재전송하지 마세요. 콘솔이 끊기면 주소·UID 기록으로 상태를 먼저 확인하고 진행자에게 복구를 요청하세요.

## A1. 지급 함수를 직접 구현

**입력 위치:** OS 터미널 → 코드 편집기

**작성/조작할 부분:** Payment.sol의 pay 함수: 호출 경로·권한·금액 검사, 송금, 이벤트

```bash
mkdir -p .private/terminal
cp workshop/terminal/Payment.todo.sol .private/terminal/Payment.sol
# .private/terminal/Payment.sol을 편집기로 열어 TODO를 채우세요.
# 비교용 예시: workshop/terminal/Payment.solution.sol
```

**확인:** 제공: 초기화 코드. 직접 작성: pay 함수. 예시를 통째로 실행하기 전에 각 require가 막는 요청을 설명하세요.

## A2. 터미널에서 Node 콘솔 열기

**입력 위치:** OS 터미널

**작성/조작할 부분:** 이후 JavaScript는 Node의 > 프롬프트에 입력합니다.

```bash
env -u MAROO_PRIVATE_KEY -u MAROO_RECIPIENT node --env-file=.env
```

**확인:** 이 콘솔을 유지하세요. OS 명령으로 돌아갈 때는 .exit를 입력합니다.

## A3. 연결·컴파일

**입력 위치:** Node 콘솔

**작성/조작할 부분:** 체인과 계정 확인, 작성한 Solidity 컴파일

```javascript
var {wallet,recipient,provider,pcl,coder,Contract,ContractFactory,Interface,parseEther,ZeroAddress,ZeroHash,id,compile,send,decode,easTools} = await import('./workshop/terminal/context.mjs');
console.log(String((await provider.getNetwork()).chainId), wallet.address, recipient);
var artifact = compile();
console.log(artifact.abi.map(x => x.name).filter(Boolean));
```

**확인:** 450815, 본인 지급자·수취인 주소, pay·owner·paymentCount 확인. 제공된 context는 연결·컴파일·전송만 돕고 거래를 자동 실행하지 않습니다.

## A4. 구현체와 프록시 배포

**입력 위치:** Node 콘솔

**작성/조작할 부분:** 초기화 데이터를 ABI 인코딩하고 PCL 등록 프록시를 배포

```javascript
var factory = new ContractFactory(artifact.abi, artifact.evm.bytecode.object, wallet);
var deployed = await send('implementation', await factory.getDeployTransaction());
var implementation = deployed.contractAddress;
var api = new Interface(artifact.abi);
var init = coder.encode(['address','address','bytes'], [implementation,wallet.address,api.encodeFunctionData('initialize',[wallet.address])]);
var registered = await send('proxy', await pcl.deployPclProxy.populateTransaction(1,0n,init));
var event = registered.logs.map(l => { try { return pcl.interface.parseLog(l); } catch { return null; } }).find(e => e?.name === 'PclProxyDeployed');
var proxy = event.args.proxy;
var app = new Contract(proxy,artifact.abi,wallet);
console.log(proxy, await app.owner(), await pcl.pclProxy(proxy));
```

**확인:** 프록시 주소와 owner를 기록하세요. 프록시를 호출해야 해당 컨트랙트 정책이 적용됩니다.

## B1. 함수별 Denylist 정책 작성

**입력 위치:** Node 콘솔

**작성/조작할 부분:** templateId·ABI 인코딩한 policy·pay의 selector를 직접 구성

```javascript
var policyFor = addresses => ({
  _contract: proxy, admin: wallet.address,
  policies: [{templateId:'DENYLIST_POLICY',
    policy:coder.encode(['tuple(address[] addresses)'],[{addresses}]),
    selector:api.getFunction('pay').selector}]
});
await send('allow',await pcl.changeContractPolicies.populateTransaction(policyFor([])));
console.log(await pcl.contractPolicies(proxy));
```

**확인:** 빈 차단 목록을 조회하세요. 이 코드는 기존 템플릿에 설정값을 넣는 실습이며 PCL 엔진을 새로 구현하는 것은 아닙니다.

## B2. 지급 결과 검증 코드 작성

**입력 위치:** Node 콘솔

**작성/조작할 부분:** 영수증 status뿐 아니라 수취인 잔액·지급 횟수를 비교

```javascript
var checkPayment = async (label, expectedStatus) => {
  var balance = await provider.getBalance(recipient);
  var count = await app.paymentCount();
  var tx = await app.pay.populateTransaction(recipient,{value:parseEther('0.001')});
  var receipt = await send(label,tx,expectedStatus === 0 ? 500000n : undefined);
  var delta = (await provider.getBalance(recipient)) - balance;
  var countDelta = (await app.paymentCount()) - count;
  console.log({status:receipt.status,recipientDelta:String(delta),countDelta:String(countDelta)});
  if (receipt.status !== expectedStatus || delta !== (expectedStatus === 1 ? parseEther('0.001') : 0n) || countDelta !== BigInt(expectedStatus)) throw Error('Unexpected payment result');
};
await checkPayment('allowed-payment',1);
```

**확인:** status 1 · recipientDelta 1000000000000000 · countDelta 1. 먼저 성공 결과를 확인한 다음 차단 조건을 바꾸세요.

## B3. 송신자를 차단하고 같은 요청 비교

**입력 위치:** Node 콘솔

**작성/조작할 부분:** 목록에 지급자를 추가하고 오류·상태 불변을 확인

```javascript
await send('deny',await pcl.changeContractPolicies.populateTransaction(policyFor([wallet.address])));
try { await app.pay.staticCall(recipient,{value:parseEther('0.001')}); } catch(e) { console.log(decode(e)); }
await checkPayment('denied-payment',0);
await send('restore-allow',await pcl.changeContractPolicies.populateTransaction(policyFor([])));
```

**확인:** InDenylist · status 0 · 잔액·횟수 증가 0. 마지막 줄은 직접 복원하는 단계입니다.

## C1. EAS 스키마와 정책 작성

**입력 위치:** Node 콘솔

**작성/조작할 부분:** 증명의 스키마를 등록하고 EAS_POLICY 설정값을 작성

```javascript
var {addresses,registry,eas,indexer} = await easTools();
var {solidityPackedKeccak256} = await import('ethers');
var schemaText = 'bool workshopDemoEligible, bytes32 run'+Date.now();
var schemaUID = solidityPackedKeccak256(['string','address','bool'],[schemaText,ZeroAddress,true]);
await send('schema',await registry.register.populateTransaction(schemaText,ZeroAddress,true));
var easPolicy = {_contract:proxy,admin:wallet.address,policies:[{
  templateId:'EAS_POLICY',selector:api.getFunction('pay').selector,
  policy:coder.encode(['tuple(address easContract,address indexContract,bytes32 schemaUid)'],[{easContract:addresses.eas,indexContract:addresses.indexer,schemaUid:schemaUID}])
}]};
await send('bind-eas',await pcl.changeContractPolicies.populateTransaction(easPolicy));
await checkPayment('missing-credential',0);
```

**확인:** 증명이 없으므로 지급 차단. 정책 목록은 EAS로 교체됩니다. 기존 Denylist와 동시 조합하지 않습니다.

## C2. 증명 발급·인덱싱 후 지급

**입력 위치:** Node 콘솔

**작성/조작할 부분:** 증명 대상·만료 시각·데이터를 구성하고 UID를 인덱싱

```javascript
var expiry = BigInt((await provider.getBlock('latest')).timestamp + 3600);
var issued = await send('attest',await eas.attest.populateTransaction({schema:schemaUID,data:{
  recipient:wallet.address,expirationTime:expiry,revocable:true,refUID:ZeroHash,
  data:coder.encode(['bool','bytes32'],[true,id('workshop')]),value:0n
}}));
var attested = issued.logs.map(l=>{try{return eas.interface.parseLog(l)}catch{return null}}).find(e=>e?.name==='Attested');
var uid = attested.args.uid;
console.log(await eas.getAttestation(uid));
if (!(await indexer.isAttestationIndexed(uid))) await send('index',await indexer.indexAttestation.populateTransaction(uid));
await checkPayment('credentialed-payment',1);
```

**확인:** status 1 · 수취인 잔액 증가. 자체 발급 실습 자격입니다. bool=true를 강제하거나 은행 발급자를 제한한 구현은 아닙니다.

## C3. 증명 폐기 후 다시 검증

**입력 위치:** Node 콘솔

**작성/조작할 부분:** 같은 증명을 폐기하고 같은 지급을 다시 요청

```javascript
await send('revoke',await eas.revoke.populateTransaction({schema:schemaUID,data:{uid,value:0n}}));
console.log('revocationTime:',String((await eas.getAttestation(uid)).revocationTime));
try { await app.pay.staticCall(recipient,{value:parseEther('0.001')}); } catch(e) { console.log(decode(e)); }
await checkPayment('revoked-payment',0);
await send('restore-denylist',await pcl.changeContractPolicies.populateTransaction(policyFor([])));
provider.destroy();
```

**확인:** EasAttestationRevoked · status 0 · 잔액·횟수 증가 0. 복원 후 .exit로 Node 콘솔을 닫으세요.

## D1. 로컬 노드 준비

**입력 위치:** OS 터미널 A → 컨테이너 Bash

**작성/조작할 부분:** 제공: 빌드·개발용 증명 자료·초기 계정. 지급은 아직 실행하지 않습니다.

```bash
docker build -t maroo-privacy-lab -f demo/clairveil/container/Dockerfile demo/clairveil
mkdir -p .private/privacy-terminal
docker run --rm -it --init --name maroo-privacy-terminal \
  --mount type=volume,source=maroo-privacy-cache,target=/cache \
  --mount "type=bind,source=$PWD/.private/privacy-terminal,target=/results" \
  --entrypoint bash maroo-privacy-lab
```

**확인:** 여기부터 컨테이너 안의 Bash입니다. macOS/Linux 모두 같은 명령을 사용합니다.

## D2. 준비된 노드를 직접 시작

**입력 위치:** 컨테이너 Bash · 터미널 A

**작성/조작할 부분:** 노드 시작 명령의 RPC·체인 설정 확인

```bash
/opt/lab/check-cpu
python3 /opt/lab/prepare-terminal.py --source /opt/clairveil --run-dir "/results/session-$(date +%s)"
source /results/ACTIVE.env
"$BIN" start --home "$NODE_HOME" --audit-config "$CONFIG" --audit-artifacts "$ARTIFACTS" \
  --rpc.laddr "$RPC" --p2p.laddr tcp://127.0.0.1:28656 \
  --grpc.address 127.0.0.1:28658 --minimum-gas-prices 0uclair
```

**확인:** 터미널 A를 켜 둡니다. 노드 블록 생성 로그를 확인하고 새 터미널 B를 여세요.

## D3. CLI 접속과 공통 옵션 작성

**입력 위치:** 새 OS 터미널 B → 컨테이너 Bash

**작성/조작할 부분:** 어느 계정·체인·노드로 보내는지 공통 옵션을 구성

```bash
docker exec -it maroo-privacy-terminal bash
```

**확인:** 컨테이너 진입 후 다음 블록을 실행하세요.

## D4. 예치하고 포함 결과 확인

**입력 위치:** 컨테이너 Bash · 터미널 B

**작성/조작할 부분:** Alice 예치 금액·계정·gas를 지정해 CLI 직접 호출

```bash
source /results/ACTIVE.env
COMMON=(--home "$NODE_HOME" --keyring-backend test --chain-id "$CHAIN" --node "$RPC")
"$BIN" status --node "$RPC"
"$BIN" tx privacy deposit 10uclair --from alice "${COMMON[@]}" --gas 3500000 --gas-prices 0uclair --yes --output json > /results/deposit.json
cat /results/deposit.json
DEPOSIT_TX=$(sed -n '/^{/,$p' /results/deposit.json | python3 -c 'import json,sys;print(json.load(sys.stdin)["txhash"])')
"$BIN" query tx "$DEPOSIT_TX" --node "$RPC" --output json
```

**확인:** tx가 아직 없으면 마지막 조회만 다시 실행하세요. 포함 결과의 code 0을 확인한 다음 진행합니다. 전송을 반복하지 마세요.

## D5. Bob 주소 조회 → 7 지급

**입력 위치:** 컨테이너 Bash · 터미널 B

**작성/조작할 부분:** 수취인의 비공개 주소와 지급액을 직접 지정

```bash
"$BIN" tx privacy list-notes --from alice "${COMMON[@]}" --json
"$BIN" tx privacy show-address --from bob "${COMMON[@]}" --output json > /results/bob-address.json
BOB=$(python3 -c 'import json;print(json.load(open("/results/bob-address.json"))["address"])')
"$BIN" tx privacy transfer "$BOB" 7uclair --from alice "${COMMON[@]}" --gas 9000000 --gas-prices 0uclair --yes --output json > /results/transfer.json
cat /results/transfer.json
TRANSFER_TX=$(sed -n '/^{/,$p' /results/transfer.json | python3 -c 'import json,sys;print(json.load(sys.stdin)["txhash"])')
"$BIN" query tx "$TRANSFER_TX" --node "$RPC" --output json
```

**확인:** 예치 후 Alice 10. 최종 지급 거래의 포함 code 0 확인. CLI가 증명 생성과 준비 거래를 수행하며 몇 분 걸릴 수 있습니다.

## D6. 잔액과 반복 조회 비교

**입력 위치:** 컨테이너 Bash · 터미널 B

**작성/조작할 부분:** 조회 결과를 파일로 저장하고 재조회 결과를 직접 비교

```bash
"$BIN" tx privacy list-notes --from alice "${COMMON[@]}" --json > /results/alice-after.json
"$BIN" tx privacy list-notes --from bob "${COMMON[@]}" --json > /results/bob-after.json
"$BIN" tx privacy list-notes --from bob "${COMMON[@]}" --json > /results/bob-repeat.json
python3 - <<'CHECK'
import json
read = lambda name: json.load(open('/results/'+name))['summary']
a, b, again = read('alice-after.json'), read('bob-after.json'), read('bob-repeat.json')
assert a['total_spendable'] == '3'
assert b['total_spendable'] == '7'
assert b == again
print('PASS: Alice 3 / Bob 7 / repeat scan stable')
CHECK
```

**확인:** 이 Python 검증을 직접 작성합니다. 원본 note 파일은 공유하지 마세요. 종료: 터미널 B에서 exit, A에서 Ctrl+C 후 exit.

