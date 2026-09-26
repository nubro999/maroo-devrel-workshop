# Maroo Developer Relations — Track B / Enable

**정책을 지키는 지급과 비공개 지급을 각각 실행하고, 증거로 구분하는 70분 워크숍입니다.** 한국 은행·핀테크에서 기존 기업 지급 시스템을 온체인으로 확장하려는 시니어 백엔드·블록체인 엔지니어를 대상으로 합니다. EVM·RPC는 익숙하지만 Maroo와 ZK는 처음인 참가자를 가정합니다.

**[실습 커맨드 웹사이트](https://maroo-workshop-cheatsheet.zcb167.chatgpt.site)** — 설명은 10장 슬라이드, 복사·붙여넣기는 웹사이트에서 진행합니다.

## 리뷰어 시작점

1. [제출 노트](SUBMISSION_NOTES.md): 검증 결과·한계·AI 사용·DX.
2. [워크숍 슬라이드 PDF](workshop/Workshop_Slides.pdf) / [편집 PPTX](workshop/Workshop_Slides.pptx) / [진행 대본](workshop/Workshop_Speaker_Script.md).
3. [참가자 가이드](workshop/PARTICIPANT_GUIDE.md) / [진행자 가이드](workshop/FACILITATOR_GUIDE.md) / [문제 해결](workshop/TROUBLESHOOTING.md).
4. [실행 증거 색인](docs/EVIDENCE_INDEX.md), [리서치와 판단 과정](docs/RESEARCH_SYNTHESIS.md).
5. [영상 링크와 상태](video-link.md). **영상은 아직 녹화·업로드되지 않았습니다.** [7분 목표 대본](docs/VIDEO_SCRIPT.md).

## 두 실습과 검증 경계

| 실습 | 실제 확인 | 경계 |
|---|---|---|
| [Live Testnet] Maroo PCL·EAS | 프록시 정책 설정, OKRW 지급, Denylist 차단, EAS 미발급/발급/폐기 비교, false/true 비교 | 자체 발급 데모 자격. 실제 은행 KYB·발급자 제한 미검증 |
| [Local] Clairveil Privacy | deposit 10 → transfer 7 → Alice 3 / Bob 7 uclair, 반복 scan, 독립 초기 상태 재현 | Maroo Privacy 호환성·PCL 집행·감사자 복호화 증거 아님 |

`false` 증명도 지급이 통과했습니다. 이번 EAS_POLICY는 불리언 true를 강제하지 않았습니다. 승인 대상에게만 증명을 발급하고 취소 시 폐기하는 수명주기와 신뢰할 발급자 통제가 필요합니다.

## 실행

Linux/WSL2 권장. Node 22.14 또는 24, Git, npm이 필요합니다.

```bash
git clone https://github.com/nubro999/maroo-devrel-workshop.git
cd maroo-devrel-workshop
npm ci
npm run setup
npm run check:rpc
npm run privacy:public
```

`.env`에 테스트 전용 키·서로 다른 지급자/수취인 주소를 로컬에서 입력합니다. 실제 쓰기 명령:

```bash
npm run lab:pcl -- --broadcast
npm run lab:eas -- --broadcast
# 선택 확장 실습
npm run lab:boolean -- --broadcast
```

[실행·비용·정리 안내](demo/pcl/README.md). 상태 변경 없는 실행은 `--broadcast`를 생략합니다. 프록시 지급은 건당 0.001 tOKRW이며 실패 거래에도 수수료가 발생합니다. `explore:*`는 이전 조사용 placeholder이므로 실제 조회로 사용하지 않습니다.

Privacy는 [LOCAL_RUN.md](demo/clairveil/LOCAL_RUN.md)를 따라 별도 실행합니다. Go 1.25.13과 사전 빌드·개발용 아티팩트 준비가 필요합니다. Clairveil SHA: `af04cfc994a3da87a8b1b902eda0988feb512539`.

## 확인된 거래

- [Denylist 정상 지급](https://explorer-testnet.maroo.io/tx/0xebc1c13aca434e747041db34e1bb3ef8f81bc538a0d15c68611aa60a88221eb0) / [차단](https://explorer-testnet.maroo.io/tx/0xa365d1866e419ed9a8d8ac635bbaf0ef2ed94900c70ff83d18fcadd84556628c)
- [EAS 유효 자격 지급](https://explorer-testnet.maroo.io/tx/0xf70621810d9137187400b4493233e597529a094029630f027a328cf1d56c698d) / [폐기 후 차단](https://explorer-testnet.maroo.io/tx/0x9f9f3beb6477036c846f7cf99c3856bf235822b59513c82b3cced6613003f532)
- [false 증명 지급 성공](https://explorer-testnet.maroo.io/tx/0x69f42f10fd795af26af78f717d676b1e6bba05d119e9886e786ffec706afc07b)

## 남은 항목

- 지원자 본인의 최종 리허설, 한국어 5–8분 영상 녹화·업로드 및 링크 등록.
- Maroo Privacy용 호환 artifact·조회·serialization 연결 미확보. 임의 proof 전송 없이 로컬 reference path 사용.
- 참가자 전체 70분 진행 시간은 설계값이며 사람을 대상으로 검증하지 않았습니다.
- [준비 상태와 수동 검증](workshop/VALIDATION.md), [외부 소스·라이선스](docs/ATTRIBUTION.md).
