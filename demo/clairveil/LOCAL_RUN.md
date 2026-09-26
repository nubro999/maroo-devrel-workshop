# Linux 로컬 Privacy 실습

이 흐름은 **Clairveil 로컬 체인**에서 개발용 artifact로 실행한다. Maroo 테스트넷 호환성, Maroo PCL 집행 또는 프로덕션 trusted setup을 증명하지 않는다. 자산도 테스트용 `uclair`이며 OKRW가 아니다.

## 직접 확인한 결과

고정 SHA `af04cfc994a3da87a8b1b902eda0988feb512539`, Go 1.25.13, Ubuntu/WSL2에서 실제 노드를 실행했다.

1. Alice가 10 uclair 입금: 포함된 거래 code 0, Alice note 잔액 10.
2. Bob의 입금 전 note 잔액 0.
3. Alice가 Bob에게 7 uclair 비공개 이체: 자동 dummy 준비 거래와 최종 이체 모두 포함 code 0.
4. 조회 결과 Alice 잔액 3, Bob 잔액 7.

[비밀 제거 실행 증거](../../evidence/local/LOCAL_PRIVACY_LIFECYCLE.json). 여기의 tx hash는 로컬 체인용이며 Maroo explorer에서 조회할 수 없다.

## 준비

Linux/WSL2, Git, Python 3, Go 1.25.13, 지원 CPU 명령(AES/PCLMULQDQ 등), 충분한 메모리·디스크가 필요하다. 첫 dependency 설치·빌드·artifact 생성은 **워크숍 사전 준비**로 분리한다. 검증 환경은 약 6 GiB 메모리와 2 GiB swap을 제공했다. 다른 환경의 소요 시간은 보장하지 않는다.

제출 저장소 루트에서 실행:

```bash
SUBMISSION_DIR="$PWD"
RUN_PARENT=$(mktemp -d /tmp/maroo-workshop.XXXXXX)
git -c core.autocrlf=false clone https://github.com/DELIGHT-LABS/clairveil.git "$RUN_PARENT/source"
git -C "$RUN_PARENT/source" checkout --detach af04cfc994a3da87a8b1b902eda0988feb512539
GOTOOLCHAIN=go1.25.13 python3 "$SUBMISSION_DIR/demo/clairveil/run-local.py" \
  --source "$RUN_PARENT/source" \
  --run-dir "$RUN_PARENT/run"
```

`--run-dir`는 아직 존재하지 않는 경로여야 한다. 스크립트는 원본 소스를 수정하지 않으며, 지정 경로에만 로컬 계정·체인·로그를 만든다. Go 다운로드에 필요한 네트워크 접근은 사전 준비에 필요하다. 체인 포트는 기본 localhost 28656/28657/28658이며 `--port`로 RPC 기준값을 바꿀 수 있다.

이미 준비한 **동일 버전 개발용 artifact**를 재사용할 경우 `--artifacts /absolute/path/to/artifacts`를 추가한다. registry와 공개 config의 circuit identity를 맞춰 검증한다. 이 옵션으로 사전 준비 시간을 줄일 수 있지만 로컬 계정과 체인 상태는 매번 새로 만든다.

## 성공 판정

종료 코드 0과 다음 출력을 확인한다:

```text
PASS: Alice 10 -> 3; Bob 0 -> 7; included transactions code 0; repeated scan stable.
```

`PUBLIC_RESULT.json`에는 포함 블록·tx hash·gas·이벤트 종류·지갑 요약 및 반복 조회 결과만 담는다. **그 파일만 증거로 공유한다.** 나머지 원본 로그, key JSON, audit private key와 지갑 캐시는 로컬 비밀 자료다.

## 참가자가 설명할 내용

- deposit의 공개 잔액 변화와 shielded note 생성은 어떻게 다른가?
- Bob은 무엇으로 자신의 note를 찾는가? 감사자는 어떤 별도 키를 신뢰하는가?
- 자동 dummy 준비가 추가 거래를 만드는 이유는 무엇인가?
- 로컬 성공을 Maroo 성공으로 주장하려면 어떤 추가 호환성 근거가 필요한가?
- `CheckTx` 접수와 실제 블록 실행 성공을 어떻게 구분했는가?

## 실패와 정리

실패 시 작업 디렉터리의 해당 `.stderr`와 `node.log`를 로컬에서 확인한다. 공개할 때는 키·note·개인정보를 제거한다. 스크립트는 성공/실패 후 자신이 시작한 노드를 종료하며, 재현에 필요한 파일은 남긴다. 재실행은 새로운 `--run-dir`를 사용한다. 필요한 PUBLIC_RESULT를 보존한 후 본인이 만든 실행 디렉터리만 삭제한다. 다른 체인이나 사용자 홈은 초기화하지 않는다.

이 스크립트는 정상 경로와 반복 scan을 검증한다. 이중 지출, 악의적 proof, 정책 집행, auditor 복호화 및 production 운영은 별도 검증 대상이다.
