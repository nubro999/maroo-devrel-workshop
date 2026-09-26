# Maroo Developer Relations — Track B

**Primary: Track B (Enable). 현재 상태: Linux 로컬 Privacy 정상 흐름 검증 완료. Maroo 송금 및 Linux Privacy 흐름 검증 완료. PCL RPC simulation 비교 완료. 영상·최종 제출 준비 중.**

한국 은행·핀테크의 시니어 백엔드 엔지니어가 4~8주 PoC를 시작하는 상황을 가정합니다. 주제는 **Compliant Confidential Vendor Payment**입니다. 주제·역할·가치 흐름은 [SCENARIO](docs/SCENARIO.md)에서 변경합니다. 실행 코드는 특정 업종에 종속되지 않습니다.

공개 저장소: [nubro999/maroo-devrel-workshop](https://github.com/nubro999/maroo-devrel-workshop)

## 먼저 볼 곳

- [작업 지침](AGENTS.md), [실험 기록](WORKLOG.md), [DX 후보 기록](DX_LOG.md)
- [참가자 가이드](workshop/PARTICIPANT_GUIDE.md) → [Maroo 실행](demo/maroo/README.md)
- [실행 가능한 로컬 Privacy 실습](demo/clairveil/LOCAL_RUN.md)
- [Clairveil 준비와 정확한 pin](demo/clairveil/README.md), [기계 판독 SHA](demo/clairveil/upstream.json)
- [Privacy 검증 결과와 Maroo 연결 조건](docs/PRIVACY_VALIDATION.md)
- [요구사항 대응표](docs/REQUIREMENTS.md), [제출 노트](SUBMISSION_NOTES.md)
- [영상 링크](video-link.md)
- [Live 증거](evidence/live-testnet), [Local 증거](evidence/local), [문서 확인](evidence/docs-only)

## 실행 시작

Node.js 22.14+ (22 또는 24), npm, Git 필요. 이 디렉터리에서 실행합니다. PowerShell에서 npm 실행 정책 문제가 있으면 npm 대신 npm.cmd를 사용합니다.

```powershell
npm ci
npm run setup
npm run check:rpc
```

setup은 기존 .env를 덮어쓰지 않습니다. 공개 테스트넷 RPC는 기본 제공되며 키 없이 연결 확인이 가능합니다.
그다음 .env의 MAROO_ADDRESS, MAROO_RECIPIENT에 본인 테스트넷 지갑 주소를 입력하고 faucet에서 자금을 준비합니다.

```powershell
npm run balance
npm run transfer:okrw
# 미리보기 확인 후, .env에 테스트넷 전용 키를 설정했을 때만:
npm run transfer:okrw -- --broadcast
npm run explore:pcl
npm run explore:privacy
```

송금은 native value 전송입니다. ERC20 컨트랙트 호출이나 비공개 지급을 구현한 것이 아닙니다.
기본 실행은 estimateGas와 잔액을 확인할 뿐 서명하지 않습니다. 제출 후 타임아웃은 실패 확정이 아닙니다. 출력한 tx hash를 조회한 뒤 재시도 여부를 판단합니다.

## 검증과 증거

```powershell
npm run typecheck
npm test
npm run secrets:check
```

실행 결과는 무시되는 .private/evidence에 저장합니다. 검토·비식별화 후 해당 evidence 폴더에 복사하고 TEMPLATE.md를 채웁니다. 개인키·seed·인증 토큰·원본 provider 오류·지갑 note를 공개하지 마세요. [보안/공개 절차](docs/SECURITY.md)를 따릅니다.

## 현재 경계

- 실제 Maroo 1 tOKRW 송금 성공을 RPC로 재검증했습니다. [영수증·잔액 증거](evidence/live-testnet/OKRW_TRANSFER_VERIFIED.json).
- [PCL 한도 비교](demo/maroo/PCL_LAB.md): 실제 테스트넷 RPC simulation에서 한도 이하 통과/초과 정책 거부 확인. balance override 사용, broadcast 없음. explore 명령은 안내용입니다.
- Clairveil 확인 SHA: af04cfc994a3da87a8b1b902eda0988feb512539. Linux 로컬 체인에서 deposit → transfer → scan 완료. [증거](evidence/local/LOCAL_PRIVACY_LIFECYCLE.json).
- OKRW 송금만으로 PCL 및 Privacy 요구사항을 충족하지 않습니다.
- 로컬 proof/tx 성공은 Maroo 호환성 증거가 아닙니다.
- 공개 저장소와 재현 근거가 포함된 DX 피드백을 제공합니다. 영상 녹화·업로드와 지원자 최종 리허설은 아직 남아 있습니다.


