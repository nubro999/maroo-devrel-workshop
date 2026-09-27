# macOS / Linux 공통 Privacy 실행

Docker의 Linux 컨테이너에서 같은 스크립트를 실행합니다. Docker Desktop(macOS) 또는 Docker Engine(Linux)을 먼저 실행하세요. Docker에 메모리 8GB 이상을 배정하세요. Apple Silicon은 arm64, Intel/AMD는 amd64 기본 이미지를 사용합니다. 별도 x86 에뮬레이션을 강제하지 않습니다. 첫 실행 전에 CPU 기능을 자동 검사합니다. upstream은 amd64 AES/PCLMULQDQ, arm64 AES/PMULL/DIT를 요구합니다. macOS 실기기에서의 전체 실행은 아직 미검증입니다.

```bash
docker build -t maroo-privacy-lab -f demo/clairveil/container/Dockerfile demo/clairveil
mkdir -p .private/privacy-container
docker run --rm --init -e LAB_UID="$(id -u)" -e LAB_GID="$(id -g)" --mount type=volume,source=maroo-privacy-cache,target=/cache --mount "type=bind,source=$PWD/.private/privacy-container,target=/results" maroo-privacy-lab
cat .private/privacy-container/PUBLIC_RESULT.json
```

첫 실행은 소스 빌드와 증명 자료를 생성합니다. 재실행은 같은 명령으로 진행하며, 성공한 증명 자료와 Go 캐시를 재사용하고 계정과 체인은 새로 만듭니다. 외부 포트나 Maroo 개인키를 컨테이너에 전달하지 않습니다. 컨테이너를 강제 종료하면 마지막 성공 결과가 남을 수 있으므로 종료 코드와 결과의 timestamp를 함께 확인하세요.
