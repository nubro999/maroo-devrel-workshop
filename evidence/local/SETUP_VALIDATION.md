# [Local] 작업환경 검증

확인일: 2026-09-26 Asia/Seoul. 환경: Windows, Node v22.14.0, npm 11.2.0. 최종 의존성은 package-lock.json 기준입니다. 제출 Git은 setup/track-b 브랜치이며 아직 commit/remote 없음.

| 명령 | 결과 | 입증 범위 |
|---|---|---|
| npm install --ignore-scripts | 설치 완료, audit 0 vulnerabilities (실행 시점) | 의존성 설치만 |
| npm run setup | .env 준비, 로컬 hooks 연결 | 기존 .env 유지 |
| npm run typecheck | 통과 | TypeScript 타입 검사 |
| npm test | 9/9 통과 | 금액·주소·체인 guard 3건 + secret guard 6건 |
| npm run secrets:check | 통과 | 현재 공개 후보의 best-effort 검사 |
| npm run explore:pcl / explore:privacy | Docs Only placeholder 출력 | ABI/온체인 기능 실행 아님 |
| npm run clairveil:pin -- .external/clairveil | SHA 기록 | clean upstream source inspection |
| npm --prefix .external/clairveil/examples/js-sdk-fixture-validator run validate | fixture validator passed | 정적 fixture; privacy lifecycle 아님 |

Clairveil SHA: af04cfc994a3da87a8b1b902eda0988feb512539.
정적 fixture 출력의 transfer payload hash: b92434782255b2976ecc6e36fdc22b76f10462bf1abc2f8a59274718f3903042. 이것은 tx hash가 아닙니다.

초기 실패/수정: npm 기본 사용자 cache 쓰기 EPERM → 무시되는 로컬 .npm-cache 설정. tsx 시작 중 uv_os_get_passwd ENOMEM → Node 22 내장 --experimental-strip-types 사용 및 .ts import로 통일. 변경 직후 남은 테스트 import 확장자 오류를 수정하고 전체 9건 재실행 통과. Node 22의 ExperimentalWarning은 정상 경고이며 실패로 숨기지 않습니다.

실제 RPC 조회는 ../live-testnet/RPC_CHECK.md에 별도로 기록합니다. balance, dry-run estimate, 실제 송금, PCL 집행, native V2 privacy, workshop 시간 검증은 미실행입니다. 테스트는 mainnet이나 실제 지갑 키를 사용하지 않습니다.
