# Submission Notes — Track B / Enable

현재 제출 자료는 코드·증거·워크숍·슬라이드·대본까지 구성했습니다. 영상 녹화·업로드와 지원자 최종 리허설은 남아 있습니다. **PCL/EAS는 Maroo 실제 거래, Privacy는 Clairveil 로컬 실행으로 분리합니다.**

## Assumptions / Discrepancies

대상은 기존 기업 지급 시스템을 온체인으로 확장하려는 한국 은행·핀테크 시니어 엔지니어입니다. 내부 지급 통제만으로 충분하면 Maroo가 반드시 필요하다고 주장하지 않습니다. 은행의 심사·원장 연동은 설계 맥락이며 구현하지 않았습니다.

- PCL 프록시에 Denylist와 EAS 조건을 붙이고 네이티브 tOKRW를 지급했습니다. 일반 송금, 프록시 호출, Privacy 호출은 다른 실행 경로입니다.
- EAS는 자체 발급 실습 자격입니다. resolver가 없으며 실제 KYB·신뢰할 발급자 제한을 구현하지 않았습니다.
- **유효한 false 증명도 지급이 성공했습니다. 이번 EAS_POLICY는 bool true를 강제하지 않았습니다.** 새 스키마·동일 계정/금액/만료/부가 데이터 조건에서 비교하고 온체인 데이터를 다시 읽었습니다. false 발급으로 차단하는 설계는 이 설정에서 작동하지 않습니다.
- attest 직후 인덱서 count가 0이었고 별도 indexAttestation 후 지급이 통과했습니다. 공식 인덱서 문서는 선택적 등록을 설명하지만 통합 튜토리얼의 발급 흐름만으로 인덱싱을 보장하지 않습니다.
- Privacy는 고정 Clairveil SHA의 개발용 아티팩트와 로컬 uclair를 사용했습니다. Maroo용 compatible artifact/query/serialization을 확보하지 못했으며 유효 proof를 제출하지 않았습니다.
- 사용자가 체험한 Maroo Experience 경로는 simulation입니다. 전체 사이트 기능을 부정하는 것이 아니라 해당 체험을 실제 EAS 발급 증거로 사용하지 않는다는 뜻입니다.
- 공식 Privacy 상세 예제와 현재 패키지 간 import 경로·오류 설명 차이가 있습니다. 공식 ABI 0.0.9 및 실제 결과를 기록하고 문서 자리표시자를 실행 성공으로 취급하지 않았습니다.

## Validation

### 환경·명령

Ubuntu 24.04.3 / WSL2, Node 22.14.0, ethers 6.17.0, @maroo-chain/contracts 0.0.9, solc 0.8.28, Go 1.25.13. Clairveil SHA `af04cfc994a3da87a8b1b902eda0988feb512539`.

원래 세션의 실행 스크립트로 아래 실제 테스트넷 거래를 만들었습니다. 제출용은 같은 실행 로직의 경로를 상대화하고 broadcast 명시·기존 출력 덮어쓰기 방지·영수증 기반 판정·복원 결과 확인을 추가했습니다. 포장 후 검증은 [VALIDATION](workshop/VALIDATION.md)에 구분합니다.

```bash
npm run lab:pcl -- --broadcast
npm run lab:eas -- --broadcast
npm run lab:boolean -- --broadcast
# 소스 clone/build/artifact를 포함한 로컬 명령은 demo/clairveil/LOCAL_RUN.md
npm run privacy:public
node scripts/decode-pcl-evidence.mjs
npm run typecheck
npm test
npm run secrets:check
```

### 실행 증거

| 분류 | 실제 결과 | 증거 |
|---|---|---|
| Live Testnet | PCL 프록시 등록·정상 지급·Denylist 차단·복원 | [RPC 재검증](evidence/live-testnet/PCL_PROXY_VERIFIED.json) |
| Live Testnet | EAS 미발급→실패 / 발급·인덱싱→성공 / 폐기→실패 | [실행](evidence/live-testnet/EAS_LIFECYCLE_EAS_RESULT.json), [재검증](evidence/live-testnet/EAS_LIFECYCLE_VERIFIED.json) |
| Live Testnet | false 및 true 모두 status 1, 각각 0.001 tOKRW 지급 | [실행](evidence/live-testnet/EAS_BOOLEAN_RESULT.json), [재검증](evidence/live-testnet/EAS_BOOLEAN_VERIFIED.json) |
| Live Testnet | 기존 1 tOKRW 송금 receipt status 1, 수취 잔액 0→1 | [증거](evidence/live-testnet/OKRW_TRANSFER_VERIFIED.json) |
| Simulation | balance override를 사용한 RPC 금액 경계 비교 | [결과](evidence/local/PCL_ESTIMATION_PROBE.json). 실제 포함 실패 거래와 별개 |
| Local | 실제 노드 deposit 10→transfer 7→Alice 3/Bob 7 | [결과](evidence/local/LOCAL_PRIVACY_LIFECYCLE.json) |
| Local | 새 계정·genesis 재현, 반복 scan 안정 | [결과](evidence/local/LOCAL_PRIVACY_REHEARSAL.json). build/artifact cache 재사용 |
| Docs Only | Maroo valid Privacy 준비 조사 | [현재 경계](docs/PRIVACY_VALIDATION.md) |

증거 색인은 [EVIDENCE_INDEX](docs/EVIDENCE_INDEX.md). 실패는 raw 오류를 ABI로 해석하고 당시 블록 eth_call, 영수증, 잔액 및 지급 횟수로 확인했습니다. 로컬 거래는 Maroo Explorer에서 조회할 수 없습니다. PCL 실험 후 정책 복원, EAS 실험 후 증명 폐기를 완료했습니다. 이전 환경 오류·조사 가설은 WORKLOG와 evidence에 남기고 최신 가이드와 구분합니다.

## AI Usage

사용 도구: Codex. AI가 코드와 문서를 생성하고 실행을 수행했으며, 사용자가 목적·범위·실험 순서를 결정했습니다.

1. **가속 — 자료와 실행 경계 정리:** 과제, 공식 문서, ABI, pinned Clairveil 소스를 분석해 요구사항·실행 경로·막힌 계층을 분리했습니다.
2. **가속 — 실험 자동화:** 프록시 배포·정책 변경·EAS 발급·인덱싱·폐기·결과 기록, 로컬 Privacy 준비·실행·scan, 오류 디코더를 만들고 실제 영수증과 상태를 대조했습니다.
3. **가속 — 교육 자료:** 합의한 두 프로그램을 슬라이드·대본·참가자·진행자 가이드·트러블슈팅으로 제작했습니다.
4. **오류와 수정:** explore:pcl을 실제 조회로 잘못 안내했습니다. 사용자가 placeholder-no-network-call 출력을 제시해 실제 privacy:public 및 정책 디코더로 정정했습니다. README에서 placeholder를 본 실습 명령에서 제거했습니다.
5. **오류와 수정:** 체험 사이트 인증 UI를 실물 EAS 발급 경로처럼 안내했으나 사용자가 해당 경로가 simulation임을 확인했습니다. 실제 자격 취득을 주장하지 않고 Privacy 선행 조건을 미완료로 기록했습니다.
6. **오류와 수정:** 공개 증거만 보고 과거 Maroo 송금을 미실행으로 판단했습니다. ignored receipt를 발견해 RPC로 재검증하고 불필요한 재송금을 피했습니다.

**사람의 명시적 판단:** Track B 집중, 잘못된 지급 방지 우선, Windows에서 WSL2 전환, 은행 엔지니어의 업무 문제부터 설명, PCL·Privacy를 두 프로그램으로 분리, 설명·실습 구성, 별도 PoC 마무리 강의 제거, false 값 비교 실험 요청, Explorer 및 체험 UX 문제 제보. 지원자의 독립 설명과 녹화 완료 여부는 아직 확인하지 않았습니다.

## DX Feedback

| 문제 | 근거·재현 | 영향·심각도 | 개선·담당 |
|---|---|---|---|
| Explorer에서 PCL 오류가 깨진 문자로 표시 | 실제 InDenylist 실패 거래 Raw를 공식 ABI로 해석. DX-008 | 지급 PoC 개발자의 실패 진단 지연, 중 | 버전별 오류 ABI·인자·쉬운 설명·원본 hex. Explorer |
| EAS 발급 후 인덱싱 단계 누락 가능 | 실제 attest 후 indexed=false/count=0, indexAttestation 후 통과 | 신규 통합자가 발급 성공과 지급 자격 인식을 혼동, 중 | 튜토리얼에 인덱싱·count 검증 명시. Docs/EAS |
| false 증명과 승인 조건의 의미 혼동 | false/true 실제 지급 모두 통과 | 기관 개발자가 false를 거절로 설계할 위험, 높음 | 유효 증명 보유와 payload 검사의 차이·발급자 통제 안내. Docs/PCL |
| Privacy ABI import와 배포 패키지 차이 | 0.0.9에서 기존 abi/IPrivacy 경로 실패, precompiles/privacy/IPrivacy 성공 | 네트워크 전에 실행 중단, 중 | 배포 패키지 대상 예제 smoke test. Docs/package |
| Windows native Privacy 실행 실패 | Unix syscall·secret profile 실패, Linux 정상 재현 | 워크숍 준비 차단, 높음 | 지원 OS/CPU 사전 검사·WSL 안내. Clairveil tooling |
| 체험 시작 문구 지속 노출 | 사용자 직접 보고, 독립 재현 미완료. DX-009 | 진행 중 혼란·불편, 낮음 잠정 | 첫 단계 전환 시 안내 숨김/갱신. Experience UX |

상세 범위·원인 가설·owner는 [DX_LOG](DX_LOG.md). false 동작을 제품 결함으로 단정하지 않으며, Explorer 내부 구현도 확인하지 않았습니다.

## Known Limitations

- 영상 녹화·업로드, 지원자 최종 리허설 미완료. 70분 전체 참가자 진행은 설계값입니다.
- Maroo Privacy 유효 payload 준비에 필요한 호환 자료를 확보하지 못했습니다. invalid proof 거절을 정상 연동으로 대체하지 않았습니다.
- 자체 발급 데모 EAS이며 실제 은행 심사·신뢰할 발급자 제한·만료 후 차단을 검증하지 않았습니다.
- 로컬 Privacy는 개발용 setup입니다. Maroo verifier 호환성, 감사자 복호화, 이중 지출·모든 공격 입력, 키 custody·운영 복구 전체를 검증하지 않았습니다.
- 익스플로러/공식 UI는 변경될 수 있습니다. 기록 시점과 증거를 기준으로 설명합니다.
- 자동 비밀정보 검사는 보조 수단이며 비밀 부재를 보증하지 않습니다. 본인 최종 화면·파일 검토가 필요합니다.
