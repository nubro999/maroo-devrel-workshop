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
| 최종 경로 버전의 추가 live 재전송 | NOT TESTED | 실제 실행 원본을 상대 경로·고유 schema·명시적 broadcast 옵션·영수증 기반 실패 판정·복원 결과 확인을 반영해 패키징; 추가 수수료 거래를 반복하지 않음 |
| 슬라이드 | PASS | 22장/70분·7장/7분 목표, PDF 육안 검토; PPTX의 타 PC 폰트 렌더링은 별도 |
| 전체 참가자 70분 리허설 | NOT TESTED | 진행 시간은 설계값; 지원자 직접 리허설 필요 |
| Maroo Privacy 지급·감사자 복호화 | NOT TESTED | 호환 proof·조회·serialization 미확보; 로컬 결과와 구분 |
| 최종 녹화·공개 영상 링크 | NOT DONE | 지원자가 직접 녹화·업로드 |

## 재시작·복구

Maroo 실행은 새 프록시와 새 schema를 사용한다. 기존 .private 실험 폴더를 보관용 이름으로 이동한 다음 새 실험을 시작한다. 이는 이전 체인 상태를 삭제하지 않는다. 성공 종료 시 실험 증명은 폐기되고 프록시 정책은 복원된다. 중단 시 저장된 hash·RESULT를 확인하고, 미포함/불명확 거래를 확인하기 전에 재전송하지 않는다. cleanup 실패 여부는 결과에 별도로 기록된다.

Privacy는 기존 run-dir을 재사용하지 않고 새 경로로 genesis·계정·감사 설정을 만든다. 고정 source와 개발 artifacts 및 빌드 캐시는 재사용할 수 있다. 원시 logs, 키, note/witness는 공개 패키지에서 제외한다.

오프라인 대체 진행은 기존 증거를 분석한 것이며 참가자 자신의 실행 성공으로 기록하지 않는다.

## 최종 패키지 검사

Solidity 0.8.28/paris 컴파일과 공식 ABI의 InDenylist custom error 해석을 오프라인 확인했다. 문서의 로컬 링크 누락은 0건이며, 공개 대상 파일에 실제 로컬 테스트 개인키가 포함되지 않았음을 별도로 검사했다. 자동 비밀 검사는 best effort이며 원시 키·노드 상태는 패키지에 포함하지 않는다.
