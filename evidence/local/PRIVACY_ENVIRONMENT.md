# [Local] Privacy 실행 환경 진단

2026-09-26 UTC, Windows amd64, Node v22.14.0, Go go1.25.13 windows/amd64.
Upstream: af04cfc994a3da87a8b1b902eda0988feb512539 (clean).

## 실행

저장소 루트의 `.private/go-path`, `.private/go-cache`, `.private/go-mod`, `.private/go-tmp`를 각각 GOPATH/GOCACHE/GOMODCACHE/GOTMPDIR로 지정하고 GOTOOLCHAIN=auto로 실행했다. 첫 Go 시도의 사용자 기본 GOPATH 쓰기 실패는 로컬 캐시 지정으로 해소했다. checksum 검증은 비활성화하지 않았다.

upstream 디렉터리에서 실행:

```text
go test ./x/privacy/client/sdk/conformance ./x/privacy/client/sdk/deposit ./x/privacy/client/sdk/transfer ./x/privacy/client/sdk/provertransport ./x/privacy/client/sdk/proverservice
```

예상: SDK 계약/직렬화/전송 테스트 실행. 실제: **FAIL**.

- reservation/durable_file_store.go:481: `undefined: syscall.Flock`, `syscall.LOCK_EX`, `syscall.LOCK_UN`.
- proverservice/service.go:605 등: `undefined: syscall.Getrusage`, `syscall.RUSAGE_SELF`; Windows Rusage 필드 차이.
- deposit/transfer 테스트: `unsupported native secret execution profile`.
- provertransport 테스트: 같은 오류로 panic.
- 이 첫 실행의 PowerShell 파이프라인 종료 코드는 Go 실패를 전달하지 않았다. **로그의 FAIL을 실제 결과로 사용**하며 후속 전체 검사에서는 Go exit code를 명시적으로 보존했다.

확정 원인: `x/privacy/crypto/internal/ctbn254/secretprofile/profile.go`는 OS를 linux/darwin으로 제한하고 AES 등 CPU 지원을 요구한다. Windows는 거부 대상이다. 이 guard나 upstream 코드를 수정하지 않았다.

`wsl --list --quiet`: **BLOCKED** — `Wsl/EnumerateDistros/Service/E_ACCESSDENIED`. WSL 미설치로 단정하지 않는다. 이 세션에서 Linux에 진입하지 못했다. Make/Docker 실행 경로도 확보하지 못했다.

## 독립 검사

- `npm --prefix .external/clairveil/examples/js-sdk-fixture-validator run validate`: PASS. 정적 fixture 검증이며 lifecycle 증거가 아니다.
- `npm run typecheck`: PASS.
- `npm test`: 10 tests PASS, 0 FAIL.
- `node scripts/verify-privacy-abi.mjs`: 합성 검사 6개 PASS. 문서 import 경로 1개 FAIL은 별도 재현.

원시 Go 출력에는 테스트 fixture 정보가 들어갈 수 있으므로 `.private/privacy-validation`에 보관하고 공개 증거에는 상태/테스트명/비밀 없는 오류만 남긴다.

## Human Judgment

사용자: **“Linux/WSL2를 기본 환경으로 한다.”** 현재 Windows 실행 실패를 근거로 참가자 기본 환경을 정했다. Linux에서 성공했다고 해석하지 않는다.

## 전체 패키지 실행과 후속 진단

`go test -json -count=1 -p 2 -timeout 3m ./x/privacy/... ./cmd/clairveil-setup ./app ./cmd/clairveild/cmd`를 실행했고 exit code 1을 보존했다. 33개 패키지 중 PASS 8 / FAIL 22 / no test files 3. test/subtest 종료 이벤트 PASS 923 / FAIL 266 / SKIP 17. [상태 목록](CLAIRVEIL_TESTS.json).

- circuit/keeper: 3분 timeout. 이 제한은 조사자가 설정했으며 성능 결함으로 단정하지 않는다. Linux 재실행 wrapper의 기본값은 20분으로 늘렸지만 실행 검증 전이다.
- secretprofile 테스트가 관찰한 환경: Windows amd64, AES=true, PolynomialMultiply=true, PureGo=false. 이 CPU에서는 OS 제한이 차단 원인이다. secretprofile 패키지 PASS는 지원 판단 로직의 테스트 통과이며 host의 native secret 사용 허가가 아니다. `TestCurrentProfile` 자체는 SKIP했다.
- frct/scalarct의 `TestPinnedGeneratedSourceHash`: core.autocrlf=true로 checkout 파일이 CRLF였다. Git 원본 blob 및 메모리에서 LF 정규화한 hash는 기대값과 정확히 일치했다. 해당 generated 파일 2개만 Git 원본 바이트로 복원했으며 알고리즘·guard는 수정하지 않았다. 두 패키지 재실행 exit 0 / PASS.
- reviewed artifact가 필요한 테스트, opt-in resource/timing 테스트가 SKIP됐다. 실제 node/prover/lifecycle 성공 증거는 없다.

원시 로그 `.private/privacy-validation/go-privacy-all.jsonl` 및 `go-line-endings-retest.jsonl`은 ignored 상태로 보관한다. 공개 증거에는 raw test vector를 포함하지 않는다.
