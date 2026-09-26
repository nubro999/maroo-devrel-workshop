# Clairveil 별도 체크아웃

확인한 SHA는 [upstream.json](upstream.json)에 기록합니다. **Linux 로컬 deposit → transfer → scan 실행 완료, Maroo 호환성 미검증**입니다.

공개 저장소에 vendor/submodule을 추가하지 않고 무시되는 .external/clairveil에 별도 clone합니다. 원본의 LICENSE/NOTICE를 유지하고 생성된 keys/artifacts를 제출 저장소에서 격리합니다.

```powershell
git clone -c core.autocrlf=false https://github.com/DELIGHT-LABS/clairveil.git .external/clairveil
git -C .external/clairveil checkout --detach af04cfc994a3da87a8b1b902eda0988feb512539
npm run clairveil:pin -- .external/clairveil
```

이 작업환경에서는 위 SHA의 읽기용 clone이 이미 있습니다. pin 도구는 다른 origin 또는 dirty checkout을 거절합니다. 수정할 경우 별도 fork/ref와 변경내역을 기록합니다.

generated source의 byte hash를 검사하므로 CRLF 변환을 피합니다. 기존 Windows clone의 두 generated 파일은 검증 중 원본 Git blob 바이트로 복원했습니다. [진단](../../evidence/local/CLAIRVEIL_LINE_ENDINGS.json).

## 재현 가능한 Linux 실행

[LOCAL_RUN.md](LOCAL_RUN.md)의 준비·실행·판정 절차를 따른다. `run-local.py`는 새 로컬 체인에서 실행하고 비밀 없는 결과만 별도 저장한다. 아래 내용 중 Windows 차단과 미실행 표시는 이전 조사 당시의 기록이다.

## 확인된 시작 경로

- [getting started](https://github.com/DELIGHT-LABS/clairveil/blob/af04cfc994a3da87a8b1b902eda0988feb512539/docs/clairveil-getting-started.md)
- [testing guide](https://github.com/DELIGHT-LABS/clairveil/blob/af04cfc994a3da87a8b1b902eda0988feb512539/docs/clairveil-testing-guide.md)
- [CLI reference](https://github.com/DELIGHT-LABS/clairveil/blob/af04cfc994a3da87a8b1b902eda0988feb512539/docs/clairveil-cli-reference.md)

상류 권장 도구: Go 1.25.13, Git, Make, Bash. Node 22+는 JS 예제에 사용합니다. **실습 기본 환경은 Linux/WSL2로 사용자 확정했습니다.** 이 Windows 환경에서는 Go 1.25.13을 로컬 캐시에 준비했지만 Unix syscall 빌드 실패와 native secret profile 거부를 재현했습니다. WSL 접근은 이 세션에서 E_ACCESSDENIED이며 전체 체인은 실행하지 못했습니다. [검증 보고서](../../docs/PRIVACY_VALIDATION.md)를 참조하세요.

Linux 터미널의 제출 저장소 루트에서 `bash demo/clairveil/verify-linux.sh`로 고정 SHA의 패키지 검사를 시작할 수 있습니다. 이 wrapper 자체는 Linux 실행 미검증입니다. 통과해도 artifact-gated test의 skip과 실제 chain lifecycle은 별도 확인해야 합니다.

준비된 checkout에서 다음은 실제 존재하는 정적 예제 검사입니다:

```powershell
npm --prefix .external/clairveil/examples/js-sdk-fixture-validator run validate
```

이 결과는 fixture/schema 검증이며 deposit→transfer→scan 증거가 아닙니다.

## V2 lifecycle 준비 gate

1. 동일 SHA 문서를 읽고 reviewed verifier artifacts 4개와 manifest, public V4 audit configuration을 확보합니다.
2. 구성의 chain_id, network_nonce32, initial_height, initial_audit_key(public key/PoP), circuit_set_identity와 artifact 일치를 검토합니다.
3. Bash/Go 환경에서 make build. make init은 바이너리 설치/명령 안내이며 genesis를 만들지 않습니다.
4. 같은 checkout의 CLI 문서로 accounts/genesis accounts/gentx/collect-gentxs 등 reference-chain 준비를 완료합니다.
5. 전용 --home 경로를 지정하고 init --audit-config, start --audit-config --audit-artifacts를 실행합니다. 임의 artifact/config를 만들어 유효하다고 간주하지 않습니다.
6. node와 prover가 같은 artifact를 사용하는지 확인하고 deposit→transfer→수신자 scan을 수동 검증합니다. 정확한 성공 명령을 evidence/local 템플릿에 기록한 후 workshop에 승격합니다.
7. 키/notes를 제외한 tx, commitment/nullifier 상태 및 수신 변화로 검증 범위를 남깁니다.

현재 upstream에는 native V2 end-to-end smoke target이 없습니다. make privacy-batch-joinsplit-localnet, reference-payroll-demo, reference-payroll-rehearsal은 각각 static/legacy/simulation 성격이며 live node 실행 증거가 아닙니다.

정리: 먼저 node/prover를 중지하고 사용한 --home와 artifacts 경로를 확인합니다. 재현에 필요한 manifest와 비밀 제거 증거를 남긴 뒤 해당 전용 로컬 경로만 정리합니다. 전체 사용자 홈 또는 테스트넷 상태는 초기화하지 않습니다.

