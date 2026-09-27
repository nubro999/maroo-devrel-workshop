# 파일로 실행하는 실습

카페 A가 원두업체 B에 지급하는 상황입니다. 완성된 예시 파일을 열어 확인·수정한 뒤 실행합니다. 명령은 저장소 루트의 macOS/Linux 터미널에서 실행합니다.

## 1. 연결·컴파일·프록시 배포

파일: `workshop/files/01-deploy.mjs`

```bash
nano workshop/files/01-deploy.mjs
env -u MAROO_PRIVATE_KEY -u MAROO_RECIPIENT node --env-file=.env workshop/files/01-deploy.mjs
```

## 2. 지급 허용 정책

파일: `workshop/files/02-allow.mjs`

```bash
nano workshop/files/02-allow.mjs
env -u MAROO_PRIVATE_KEY -u MAROO_RECIPIENT node --env-file=.env workshop/files/02-allow.mjs
```

## 3. 정상 지급

파일: `workshop/files/03-pay.mjs`

```bash
nano workshop/files/03-pay.mjs
env -u MAROO_PRIVATE_KEY -u MAROO_RECIPIENT node --env-file=.env workshop/files/03-pay.mjs
```

## 4. 지급 정지와 차단 확인

파일: `workshop/files/04-deny.mjs`

```bash
nano workshop/files/04-deny.mjs
env -u MAROO_PRIVATE_KEY -u MAROO_RECIPIENT node --env-file=.env workshop/files/04-deny.mjs
```

## 5. 승인 증명이 없는 지급 차단

파일: `workshop/files/05-eas-policy.mjs`

```bash
nano workshop/files/05-eas-policy.mjs
env -u MAROO_PRIVATE_KEY -u MAROO_RECIPIENT node --env-file=.env workshop/files/05-eas-policy.mjs
```

## 6. 승인 증명 발급과 지급

파일: `workshop/files/06-issue.mjs`

```bash
nano workshop/files/06-issue.mjs
env -u MAROO_PRIVATE_KEY -u MAROO_RECIPIENT node --env-file=.env workshop/files/06-issue.mjs
```

## 7. 승인 취소와 지급 차단

파일: `workshop/files/07-revoke.mjs`

```bash
nano workshop/files/07-revoke.mjs
env -u MAROO_PRIVATE_KEY -u MAROO_RECIPIENT node --env-file=.env workshop/files/07-revoke.mjs
```


Payment.sol은 완성 예시이며 TODO를 채울 필요가 없습니다. 실행 주소는 .private/file-lab/state.json에 저장됩니다. 오류가 나면 다음 단계로 넘어가지 마세요.
