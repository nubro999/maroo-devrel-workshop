# Track B 영상 구성 — 목표 6분 30초

지원자가 자신의 말로 설명하고 실제 화면을 보여주는 리허설용 대본이다. 시간은 예상치이며 녹화 전 직접 읽고 5~8분으로 조정한다. 키·`.env`·원본 note·private 실행 폴더를 화면에 열지 않는다.

## 0:00–0:45 — 누구를 위한 워크숍인가

화면: README 첫 화면, Primary Track B, SCENARIO.

“이 워크숍은 기업 자금관리 PoC를 준비하는 시니어 백엔드 엔지니어를 대상으로 합니다. 공급업체 대금을 보낼 때 중요한 것은 돈을 보내는 것뿐 아니라, 정책에 맞는 지급인지 판단하고 거래 정보의 가시성을 관리하는 것입니다. 참가자가 이해하고, 실행하고, 결과를 확인하고, 실패를 진단할 수 있도록 구성했습니다.”

“실행은 세 가지로 분리했습니다. Maroo 테스트넷의 실제 OKRW 송금, 테스트넷 RPC에서의 PCL 시뮬레이션, 그리고 Clairveil 로컬 체인의 비공개 지급입니다. 이 셋이 하나의 live Privacy 거래라고 주장하지 않습니다.”

## 0:45–1:40 — 실제 Maroo 송금의 성공 기준

화면: evidence/live-testnet/OKRW_TRANSFER_VERIFIED.json과 해당 explorer.

“이것은 기존에 실행한 1 tOKRW 송금입니다. 체인 ID 450815, 블록 19148348, receipt status 1을 RPC로 다시 확인했습니다. 수신자 잔액은 직전 블록 0에서 포함 블록 1 tOKRW로 증가했습니다. 단순 RPC 연결이나 tx hash만 보여주는 대신 실제 포함 결과와 상태 변화를 확인합니다.”

“송금 미리보기는 서명하지 않습니다. 실제 제출 후 타임아웃이 나면 같은 hash를 먼저 조회해 중복 송금을 피하도록 안내했습니다. 이 송금은 투명한 native OKRW 송금이며 Privacy 성공 증거가 아닙니다.”

## 1:40–2:50 — PCL이 판정을 바꾸는 순간

화면: demo/maroo/PCL_LAB.md와 PCL_ESTIMATION_PROBE.json의 results/decoded 부분.

“정책을 단지 조회하는 데서 끝내지 않고 같은 발신자, 수신자와 블록에서 금액만 바꿨습니다. 1과 2백만 tOKRW는 가스 추정이 통과하고, 2백만 1 tOKRW는 거부됩니다. 공식 ABI로 중첩 오류를 해석하면 금액 상한 초과와 EAS 자격 부재가 나옵니다.”

“이것은 실제 테스트넷 RPC의 시뮬레이션입니다. 잔액 부족이 먼저 실험을 막지 않도록 가상 잔액 override를 사용했습니다. 실제로 이 큰 금액을 보유하거나 송금하지 않았고, 블록에 포함된 실패 거래도 아닙니다. 다른 자격을 가진 계정이나 변경된 정책에서는 결과가 달라질 수 있습니다.”

“참가자에게는 잔액 부족, 정책 거부, proof 오류를 구분하도록 묻습니다. EAS가 이 발신자의 자격을 검사한다는 사실을 수취 공급업체의 KYB 검증으로 확대하지 않습니다.”

## 2:50–4:20 — 로컬 Privacy 정상 흐름

화면: 실행 터미널의 공개 PASS 출력 또는 LOCAL_PRIVACY_REHEARSAL.json. 필요하면 실행 영상으로 전환.

“Maroo에 대응하는 verifier artifact와 조회 경로는 조사 범위에서 확보하지 못했습니다. 그래서 고정한 Clairveil 커밋에서 로컬 reference chain을 실행했습니다. 개발용 artifact, public audit config와 circuit identity를 맞추고 새 계정과 genesis를 준비했습니다.”

“여기서 Alice는 10 uclair를 입금합니다. 이 자산은 Maroo OKRW가 아닙니다. Alice가 Bob에게 7을 비공개 이체한 뒤 note를 조회하면 Alice는 3, Bob은 7입니다. 자동 dummy 준비 과정에서 추가 self batch 거래가 발생하므로 해당 receipt도 별도로 확인했습니다. 모든 거래가 블록에 포함되고 code 0인지 확인했습니다.”

“새 계정과 새 체인으로 다시 실행했고, Bob이 scan을 반복해도 잔액이 중복되지 않는 것도 확인했습니다. 단, 모든 실패 모드와 production 보안을 검증했다는 뜻은 아닙니다.”

## 4:20–5:15 — 70분 워크숍과 운영 경계

화면: PARTICIPANT_GUIDE의 시간표, LOCAL_RUN의 pre-work.

“설치·빌드·artifact 생성은 사전 준비로 분리합니다. 본 실습에서는 연결과 잔액, 실제 송금, 정책 비교, 로컬 Privacy와 결과 해석을 70분으로 설계했습니다. 각 구간에 성공 기준과 질문을 두었습니다. 전체 참가자 리허설 시간은 아직 확정하지 않았습니다.”

“지갑은 spend/view 키를 보관하고, 로컬 prover는 private witness를 처리합니다. 감사 키는 별도로 보관되며, 공개 체인 설정에는 public key와 possession proof만 들어갑니다. PCL 관리자와 RPC 운영자도 각각 신뢰 경계에 포함됩니다. 로컬 성공 이후에도 custody, prover 운영, 감사 권한, monitoring과 재시도 정책은 별도 PoC 과제입니다.”

## 5:15–6:10 — 실패에서 얻은 DX와 AI 검증

화면: SUBMISSION_NOTES의 DX/AI 표.

“세 가지 주요 마찰은 npm ABI import 경로 차이, Windows 실행 조건, 그리고 native V2의 수동 준비 부담이었습니다. 증거와 영향을 분리하고, 문서 담당자나 tooling 담당자가 취할 수 있는 개선안을 적었습니다. 제 제출물에서는 버전 고정과 Linux 실행 스크립트로 일부를 보완했습니다.”

“AI는 소스 조사와 스캐폴딩, 실제 실행 자동화를 가속했습니다. 하지만 공개 evidence만 보고 송금 미완료라고 잘못 판단하기도 했습니다. 비공개 실행 기록에서 기존 receipt를 찾고 온체인 결과를 대조해 수정했습니다. AI가 만든 문서보다 실제 기록을 우선했습니다.”

## 6:10–6:30 — 다음 단계

화면: Known Limitations.

“참가자는 이 결과를 바탕으로 자기 조직의 정책과 키 책임을 정하고 4~8주 PoC를 설계할 수 있습니다. Maroo live Privacy로 옮기려면 배포 circuit과 artifact, state/Merkle witness query, serialization의 호환성 근거가 더 필요합니다. 무엇을 실행했고 무엇이 남았는지 구분하는 것이 이 워크숍의 완료 기준입니다.”

## 녹화 전 지원자 확인

- 위 설계와 한계를 본인 말로 설명할 수 있는가?
- PCL balance override와 live/local 차이를 빠뜨리지 않았는가?
- 감사자 복호화를 실행한 것처럼 말하지 않았는가?
- 공개 저장소 URL과 실제 영상 URL을 README/video-link에 넣었는가?
- 실제 녹화 길이가 5~8분인가?
