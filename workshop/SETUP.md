# 사전 준비

Linux/WSL2, Git, Node 22.14 또는 24, npm. Privacy는 Go 1.25.13 및 AES/PCLMULQDQ 등 지원 CPU가 필요합니다. 기존 검증 환경은 Ubuntu 24.04.3, 약 6GiB RAM과 2GiB swap이었습니다. 첫 빌드·회로 생성 소요 시간은 장비별로 다르며 70분에서 제외합니다.

```bash
git clone https://github.com/nubro999/maroo-devrel-workshop.git
cd maroo-devrel-workshop
npm ci
npm run setup
npm run check:rpc
npm run typecheck
npm test
```

`.env`에 테스트 전용 MAROO_PRIVATE_KEY, MAROO_ADDRESS, MAROO_RECIPIENT를 입력합니다. 지급자와 수취인은 달라야 합니다. 키는 녹화·채팅·공개 저장소에 포함하지 않습니다. [Faucet](https://faucet.maroo.io)에서 테스트 자금을 준비합니다. [공식 네트워크 정보](https://docs.maroo.io/resources/network/testnet-access)를 기준으로 chain ID 450815를 확인합니다.

lab:* 실행 수수료는 각 실험 100 tOKRW 상한을 두었으며 정상 관찰값은 각 18~28 tOKRW 수준이었습니다. lab:pcl→lab:eas 순서로 사전 리허설하고, 본 실습을 새로 시작할 때 해당 `.private` 실험 폴더는 보관용 이름으로 옮깁니다. 기존 폴더는 자동 덮어쓰지 않습니다.

Privacy는 [LOCAL_RUN.md](../demo/clairveil/LOCAL_RUN.md)로 고정 SHA 소스·개발용 artifacts를 준비하고 실제 성공을 미리 확인합니다. 본 실습에서는 준비한 artifacts와 Go 빌드 캐시를 재사용할 수 있습니다. 실행 출력이 나온 기존 파일만 보고 본인의 성공으로 판정하지 않습니다.

준비 완료: RPC 응답 / 잔액 / 서명 계정 일치 / 새 실험 디렉터리 / 로컬 노드·아티팩트 리허설 / 키를 숨긴 화면 공유.
