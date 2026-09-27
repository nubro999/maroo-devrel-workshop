# Maroo 개발자 워크숍 — Track B / Enable

은행에서 승인한 기업만 온체인 지급을 실행하도록 만들 수 있을까요? 이 워크숍은 **Maroo의 지급 통제**와 **Clairveil의 비공개 지급**을 두 실습으로 나누어 확인합니다.

대상은 은행·핀테크의 시니어 백엔드·블록체인 엔지니어입니다. EVM, Solidity 연동, TypeScript와 JSON-RPC에는 익숙하지만 Maroo와 ZK는 처음이라고 가정합니다. MetaMask 사용 경험은 필수 조건이 아닙니다.

## 어디서부터 보면 되나요?

| 목적 | 자료 |
|---|---|
| 전체 흐름 이해 | [10장 슬라이드](workshop/Workshop_Slides.pdf) · [편집용 PPTX](workshop/Workshop_Slides_Updated.pptx) |
| 실습 따라 하기 | [참가자 가이드](workshop/PARTICIPANT_GUIDE.md) · [커맨드 사이트](https://maroo-workshop-cheatsheet.zcb167.chatgpt.site) |
| 로그·가스비 이해 | [지급 결과와 가스비 읽는 법](docs/GAS_AND_RESULTS.md) |
| 워크숍 진행 | [진행자 가이드](workshop/FACILITATOR_GUIDE.md) · [발표 대본](workshop/Workshop_Speaker_Script.md) |
| 검증·한계 검토 | [제출 노트](SUBMISSION_NOTES.md) · [실행 증거](docs/EVIDENCE_INDEX.md) |
| 제출 영상 확인 | [영상 상태](video-link.md) — 아직 녹화·업로드하지 않았습니다. |

커맨드 사이트는 현재 본인 전용입니다. 접근할 수 없으면 공개 저장소의 참가자 가이드와 [실습 코드 안내](demo/pcl/README.md)를 사용하세요.

## 무엇을 확인했나요?

| 환경 | 직접 확인한 결과 | 아직 확인하지 않은 것 |
|---|---|---|
| Maroo 테스트넷 | tOKRW 지급, Denylist 차단, EAS 발급·폐기에 따른 허용·거절 | 실제 은행 KYB, 신뢰할 발급자 제한 |
| Clairveil 로컬 | 10 uclair 예치 → Bob에게 7 지급 → Alice 3 / Bob 7 조회 | Maroo Privacy 호환성, 감사자 복호화 |

추가 비교에서는 유효한 **false 증명도 지급을 통과**했습니다. 이번 EAS_POLICY는 내부 bool이 true인지 강제하지 않았습니다. 승인 대상에게만 증명을 발급하고, 승인을 취소할 때 폐기하는 방식과 발급자 권한 관리가 필요합니다.

## 시작하기

Node 22.14 또는 24, Git, npm을 준비합니다. Maroo 실습은 PowerShell에서도 실행할 수 있습니다. 로컬 Privacy 실습은 Linux/WSL2에서 진행합니다.

```bash
git clone https://github.com/nubro999/maroo-devrel-workshop.git
cd maroo-devrel-workshop
npm ci
npm run setup
```

로컬 .env에 테스트 전용 키와 지급자·수취인 주소를 입력한 뒤 네트워크와 잔액을 확인하세요. 지급자와 수취인은 달라야 합니다.

```bash
npm run check:rpc
npm run balance
node demo/pcl/run.mjs --broadcast
node demo/pcl/eas-run.mjs --broadcast
```

위 두 node 명령은 **실제 테스트넷 거래를 전송**합니다. 건당 지급액은 0.001 tOKRW이며 실패 거래에도 수수료가 발생합니다. 비용과 복구 절차는 [PCL·EAS 실습 안내](demo/pcl/README.md)를 참고하세요. --broadcast를 생략하면 안내만 출력하며 실습은 실행되지 않습니다.

Privacy는 [로컬 실행 안내](demo/clairveil/LOCAL_RUN.md)를 따릅니다. Go 1.25.13과 사전 빌드·개발용 증명 자료가 필요합니다. 사용한 Clairveil SHA는 `af04cfc994a3da87a8b1b902eda0988feb512539`입니다.

## 실제 거래 보기

- 사용자 직접 실행: [정상 지급](https://explorer-testnet.maroo.io/tx/0x44f86768832c69fc4bc5998d4926c48b52783c5a5e64391fbc60fe81427c9abd) · [Denylist 차단](https://explorer-testnet.maroo.io/tx/0xc879a3cbbf7061a54526f80443c9f759e10ecc9de7a6025ca95833756307648a)
- 기존 EAS 실험: [유효 자격 지급](https://explorer-testnet.maroo.io/tx/0xf70621810d9137187400b4493233e597529a094029630f027a328cf1d56c698d) · [폐기 후 차단](https://explorer-testnet.maroo.io/tx/0x9f9f3beb6477036c846f7cf99c3856bf235822b59513c82b3cced6613003f532)

## 남은 작업

영상 녹화·업로드와 전체 워크숍 리허설이 남았습니다. 70분은 계획한 시간이며, 전체 진행 시간을 측정하지 않았습니다. Maroo에서 유효한 Privacy 거래를 만들기 위한 호환 증명 자료와 조회 경로도 확보하지 못했습니다.

[상세 검증 상태](workshop/VALIDATION.md) · [리서치 정리](docs/RESEARCH_SYNTHESIS.md) · [출처와 라이선스](docs/ATTRIBUTION.md)
