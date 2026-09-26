#!/usr/bin/env bash
# Run from the submission repository root. No node initialization or transactions.
set -euo pipefail
[[ "$(uname -s)" == Linux ]] || { echo 'Use Linux/WSL2 for this workshop.'; exit 1; }
command -v go >/dev/null
command -v git >/dev/null
expected=af04cfc994a3da87a8b1b902eda0988feb512539
[[ "$(git -C .external/clairveil rev-parse HEAD)" == "$expected" ]] || { echo 'Unexpected upstream commit'; exit 1; }
[[ -z "$(git -C .external/clairveil status --porcelain)" ]] || { echo 'Upstream checkout is dirty'; exit 1; }
repo="$(pwd)"
export GOPATH="$repo/.private/go-path-linux"
export GOCACHE="$repo/.private/go-cache-linux"
export GOMODCACHE="$repo/.private/go-mod-linux"
export GOTMPDIR="$repo/.private/go-tmp-linux"
export GOTOOLCHAIN=auto
mkdir -p "$GOPATH" "$GOCACHE" "$GOMODCACHE" "$GOTMPDIR" "$repo/.private/privacy-validation"
cd .external/clairveil
go version
# The upstream secretprofile also requires AES/PCLMULQDQ on amd64 or AES/PMULL/DIT on arm64.
# Tests must remain unmodified; do not disable the native secret execution guard.
go test -json -count=1 -p 2 -timeout "${CLAIRVEIL_TEST_TIMEOUT:-20m}" ./x/privacy/... ./cmd/clairveil-setup ./app ./cmd/clairveild/cmd \
  > "$repo/.private/privacy-validation/go-privacy-linux.jsonl" \
  2> "$repo/.private/privacy-validation/go-privacy-linux-build.log"
echo 'Tests finished. Inspect skipped artifact-gated tests before claiming coverage.'
echo 'This command does not demonstrate deposit -> transfer -> scan on a running chain.'
