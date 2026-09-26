# 참가자 가이드 — 70분 / 두 실행 경로

## 학습 목표

정책의 주체·관리자를 구분하고, 실제 지급 성공과 정책 거절을 영수증·상태로 판단합니다. 별도 로컬 환경에서 deposit→transfer→scan을 완료하며 공개 정보·비밀 자료와 Maroo 연결 선행 조건을 설명합니다.

## 사전 준비

[SETUP.md](SETUP.md)의 준비를 완료합니다. 설치·컴파일·회로 생성은 본 수업 시간 밖입니다. 자신의 테스트 계정과 수신자 주소를 사용합니다. 타인의 private key를 받거나 공유하지 않습니다.

| 시간 | 설명·실습 | 완료 기준 |
|---|---|---|
| 0–15 | 지급 업무 문제, 구조, PCL/EAS, 실행 경계 | 심사·발급·정책·지급 역할 설명 |
| 15–22 | 네트워크 확인, 프록시·Denylist 실습 | 등록 admin 확인, 정상/차단 영수증 |
| 22–34 | EAS 없음→발급·인덱싱→폐기 | 실패/성공/실패와 상태 변화 |
| 34–40 | false/true 결과 분석 | 유효 증명과 내부 bool 차이 설명 |
| 40–47 | Privacy 경계와 note·scan·키 설명 | Maroo와 로컬 구분 |
| 47–62 | 로컬 deposit→transfer→scan | code 0, Alice 3 / Bob 7 |
| 62–70 | 증거·실패 해석, 공개 범위 토론 | 각자의 성공/실패/미시도 기록 |

## 프로그램 1 / Maroo

```bash
npm run check:rpc
npm run lab:pcl -- --broadcast
npm run lab:eas -- --broadcast
```

[상세 코드·입력·정리](../demo/pcl/README.md). 지급 요청은 프록시로 보냅니다. EAS는 스키마를 식별하고 증명의 유효성을 평가하는 조건으로 사용됩니다. 발급 후 인덱서 등록 여부도 확인합니다. 실패 거래 수수료는 환불되는 지급액과 구분합니다.

확장 실험은 `npm run lab:boolean -- --broadcast`입니다. 시간 내 실행이 어려우면 기존 [false/true 증거](../evidence/live-testnet/EAS_BOOLEAN_VERIFIED.json)를 해석하고 '기존 증거 분석'으로 표시합니다. 직접 실행했다고 기록하지 않습니다.

## 프로그램 2 / 로컬 Clairveil

[LOCAL_RUN.md](../demo/clairveil/LOCAL_RUN.md)의 실행 명령을 사용합니다. 사전에 준비한 동일 버전 artifacts를 `--artifacts`로 지정하고 매번 새로운 run-dir를 사용합니다.

성공 기준: 예치·준비 self batch·최종 지급 모두 code 0, Alice 10→3, Bob 0→7, 반복 Bob scan 동일. PUBLIC_RESULT.json만 공유합니다. 원시 노트와 키는 공유하지 않습니다. 스크립트는 자신의 노드를 종료합니다.

## 결과 기록과 토론

1. 거래 해시, 포함 영수증, 잔액 변화 중 어디까지 확인했나요?
2. false인 증명이 유효하면 어떤 결과가 나왔고, 은행은 승인 취소를 어떻게 표현해야 하나요?
3. scan은 누가 어떤 키로 수행하며, 어떤 정보는 공개해서는 안 되나요?
4. 로컬 결과만으로 Maroo Privacy 성공을 주장할 수 없는 이유는 무엇인가요?

## 문서로 남기는 후속 확인 항목

별도 마무리 강의는 없습니다. 조직 PoC에서는 신뢰할 증명 발급자 제한, 기존 지급 요청 ID와 대사·중복 처리, Maroo 호환 증명 자료, 감사 권한·키 관리가 추가 확인 대상입니다. 이는 이번 완료 실적이 아닙니다.
