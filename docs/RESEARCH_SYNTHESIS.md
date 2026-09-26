# 리서치·실행 과정에서 필요한 결론

## 1. 업무 문제와 선택

은행 내부 시스템은 이미 지급 통제를 수행할 수 있습니다. 이번 대상은 지급을 온체인으로 확장하는 엔지니어이며, 승인 상태가 실제 체인 실행에도 적용되는지를 질문합니다. 사용자는 지급 오류 방지를 우선하고 설명·실습 분리, PCL·Privacy 두 프로그램, 별도 PoC 마무리 강의 삭제를 결정했습니다.

## 2. 확인 순서와 증거

| 단계 | 확인 | 결과와 의미 |
|---|---|---|
| 과제 범위 | Track B 원문 | 60–75분 workshop, 상태 변경 Maroo 거래, 별도 end-to-end Privacy 필요 |
| 기존 자료 복구 | ignored receipt를 RPC와 대조 | 기존 1 tOKRW 실제 송금 확인. 공개 evidence만 보고 미실행이라던 AI 판단 수정 |
| 공식 ABI·정책 조회 | @maroo-chain/contracts 0.0.9 | 조회와 실제 집행을 구분 |
| RPC 금액 비교 | balance override simulation | 200만/200만1 경계. 실제 거래 거절 증거와 구분 |
| PCL 프록시 | 배포·Denylist 설정·전송 | 허용 status 1 / 거절 status 0 / 상태 변화 없음 |
| EAS 수명주기 | 등록·발급·인덱싱·폐기 | 없음→실패 / 유효→성공 / 폐기→실패 |
| EAS 데이터 의미 | false/true 새 스키마 비교 | 둘 다 성공. 유효한 증명과 bool 참은 별개 |
| Privacy 경계 | Maroo 문서·공개 interface·Clairveil | Maroo compatible artifact/query 미확보. 로컬 독립 경로 선택 |
| 로컬 정상 흐름 | pinned Clairveil 실제 노드 | 10→7+3, Bob scan, 새 초기 상태 재현 |
| 체험 UX | 사용자 보고 | 사용자가 진행한 경로는 simulation. 실제 EAS 발급 안내로 사용하지 않음 |

## 3. 읽어야 할 자료

- [실습 커맨드 웹사이트](https://maroo-workshop-cheatsheet.zcb167.chatgpt.site): 복사 가능한 실행 명령과 판정 기준.
- [Maroo Experience](https://experience.maroo.io/ko): 사용자가 경험한 시뮬레이션. 실제 EAS 자격 발급 증거와 구분.

- [PCL 구조](https://docs.maroo.io/concepts/compliance/pcl-dual-track-model): 프록시·전역/서비스별 정책.
- [EAS 튜토리얼](https://docs.maroo.io/guides/integration/tutorial-using-eas-on-maroo): 등록·발급·조회.
- [EAS 인덱서](https://docs.maroo.io/concepts/identity/eas-indexer): 선택적 인덱싱. 실제 실험에서는 별도 indexAttestation 필요.
- [Privacy 개념](https://docs.maroo.io/concepts/privacy): 정책 인식 프리컴파일 경계.
- [deposit](https://docs.maroo.io/apis/contract/contract-privacy-deposit), [transfer](https://docs.maroo.io/apis/contract/contract-privacy-transfer): 인자·예제. witness builder와 0x...를 완성된 실행 코드로 취급하지 않음.
- [Clairveil 고정 SHA](https://github.com/DELIGHT-LABS/clairveil/tree/af04cfc994a3da87a8b1b902eda0988feb512539): 로컬 reference 구현.
- [ClairveilJS](https://github.com/DELIGHT-LABS/clairveiljs): proof provider와 downstream 연결 선행 조건. 이번 local 검증 SHA와 자동 호환한다고 가정하지 않음.
- [BIS의 프로그래밍 가능한 금융 인프라 논의](https://www.bis.org/publications/aer-2025/next-generation-monetary-financial-system): 업무 배경 참고. 우리 실습이 은행 간 정산 효율을 검증한 것은 아님.

## 4. 설명할 때 지킬 경계

EAS attestation은 ZK proof가 아닙니다. PCL은 은행 심사 자체를 수행하지 않습니다. 실습 자격은 self-issued demo이며 발급자 제한을 검증하지 않았습니다. 일반 공개 지급과 Privacy 지급은 별도이고, Privacy 정책이 등록됐다는 조회만으로 집행 성공을 주장하지 않습니다. 로컬 uclair와 tOKRW는 다른 자산입니다. 감사자 복호화는 미검증입니다.

## 5. 정정한 AI 안내

explore:pcl을 실제 조회로 잘못 안내했으나 사용자가 placeholder 출력을 제시해 수정했습니다. 체험 사이트의 인증 UI를 실제 자격 발급 경로로 안내했으나 사용자가 simulation이라고 확인해 정정했습니다. 향후 UI·예제를 실제 체인 결과로 연결하기 전 tx/UID와 실행 증거를 요구합니다.
