# 검증 상태 — 2026-09-27

| 검증 | 상태 | 근거와 범위 |
|---|---|---|
| Maroo 실제 전송 | PASS | evidence/live-testnet의 receipt·상태 재조회 |
| PCL 프록시 허용/차단 | PASS | PCL_PROXY_RESULT, PCL_PROXY_VERIFIED |
| EAS 미발급/발급/폐기 | PASS | EAS_LIFECYCLE 기록·독립 재조회 |
| false/true 비교 | PASS | 둘 다 지급 통과; bool true 강제라는 가설은 반증 |
| 로컬 Privacy 전체 흐름 | PASS | LOCAL_PRIVACY_LIFECYCLE.json |
| 새 로컬 초기 상태 재현 | PASS | LOCAL_PRIVACY_REHEARSAL.json; 빌드/개발 artifacts 캐시 재사용 |
| 타입 검사·단위 테스트 | PASS | Node 22.14, npm run typecheck, npm test(10개) |
| 제출용 PCL 스크립트 구문·기본 실행 | PASS | 3개 구문 검사, --broadcast 없는 실행은 전송 없이 종료 |
| 새 경로 설치·오프라인 검사 | PASS | 공개 파일만 새 경로로 복사 후 npm ci 성공, typecheck·10개 테스트 통과. 지갑 없이 설치 검증 |
| 최종 제출용 코드의 추가 live 실행 | PCL 확인 / EAS 미확인 | 실제 실행 원본을 상대 경로·고유 schema·명시적 broadcast 옵션·영수증 기반 실패 판정·복원 결과 확인을 반영해 패키징; 사용자가 PCL 스크립트의 정상·차단·복원을 직접 실행함(USER_PCL_RUN). EAS·bool 공개본의 추가 실행은 미확인 |
| 슬라이드 | PASS | 10장/70분·7장/7분 목표, PDF 육안 검토; PPTX의 타 PC 폰트 렌더링은 별도 |
| 전체 참가자 70분 리허설 | NOT TESTED | 진행 시간은 설계값; 지원자 직접 리허설 필요 |
| Maroo Privacy 지급·감사자 복호화 | NOT TESTED | 호환 proof·조회·serialization 미확보; 로컬 결과와 구분 |
| 최종 녹화·공개 영상 링크 | NOT DONE | 지원자가 직접 녹화·업로드 |

## 재시작·복구

Maroo 실행은 새 프록시와 새 schema를 사용한다. 기존 .private 실험 폴더를 보관용 이름으로 이동한 다음 새 실험을 시작한다. 이는 이전 체인 상태를 삭제하지 않는다. 성공 종료 시 실험 증명은 폐기되고 프록시 정책은 복원된다. 중단 시 저장된 hash·RESULT를 확인하고, 미포함/불명확 거래를 확인하기 전에 재전송하지 않는다. cleanup 실패 여부는 결과에 별도로 기록된다.

Privacy는 기존 run-dir을 재사용하지 않고 새 경로로 genesis·계정·감사 설정을 만든다. 고정 source와 개발 artifacts 및 빌드 캐시는 재사용할 수 있다. 원시 logs, 키, note/witness는 공개 패키지에서 제외한다.

오프라인 대체 진행은 기존 증거를 분석한 것이며 참가자 자신의 실행 성공으로 기록하지 않는다.

## 최종 패키지 검사

Solidity 0.8.28/paris 컴파일과 공식 ABI의 InDenylist custom error 해석을 오프라인 확인했다. 문서의 로컬 링크 누락은 0건이며, 공개 대상 파일에 실제 로컬 테스트 개인키가 포함되지 않았음을 별도로 검사했다. 자동 비밀 검사는 best effort이며 원시 키·노드 상태는 패키지에 포함하지 않는다.

## 압축본과 실습 사이트

10장 슬라이드 PDF를 육안 확인하고 PPTX 페이지 수·링크를 점검했다. 실습 웹사이트의 8개 복사 대상, 내부 앵커, JavaScript 구문과 Bash 명령 구문을 확인했다. 사이트 배포 성공은 제공자의 상태 응답으로 확인했다. 이번 개편에서 테스트넷 거래를 추가 전송하지 않았다.

## 사용자 실행과 안내 수정

사용자가 PowerShell에서 node demo/pcl/run.mjs --broadcast를 직접 실행해 정상 지급·Denylist 거절·정책 복원을 확인했다(USER_PCL_RUN.json). 새 EAS·Privacy 실행을 의미하지는 않는다. npm의 옵션 전달 문제를 피하도록 문서와 사이트는 node 직접 실행으로 통일했다.

LOCAL_RUN과 사이트의 사전 준비 명령에 공유 GOPATH·GOCACHE를 추가했다. 스크립트의 setdefault는 이 값을 유지한다. 수정 명령의 구문은 확인했지만, 수정 후 전체 빌드·거래·소요 시간은 아직 재검증하지 않았다.
