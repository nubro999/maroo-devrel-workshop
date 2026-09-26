# 비밀정보와 공개 제출

테스트넷 전용 계정을 사용합니다. 키/seed/API key를 코드, 명령행, 스크린샷, 증거 문서에 넣지 않습니다. .env.example은 공개 값과 빈 credential만 포함합니다.

- .env, .private, .external, wallet/keystore/proof 파일은 Git ignore 대상입니다.
- npm run setup은 로컬 pre-commit/pre-push 검사를 연결합니다.
- npm run secrets:check는 공개 후보 파일을 검사합니다. staged/history 검사도 hooks에서 수행합니다.
- 자동 검사는 모든 seed·새 형식 credential·이미지 속 비밀을 탐지할 수 없습니다. ignore는 이미 추적된 파일이나 강제 추가를 보호하지 않습니다.
- 출력은 allowlist 필드만 기록하며 raw provider 오류는 내보내지 않습니다. 정확한 RPC 오류가 필요하면 로컬에서 응답을 살펴 인증정보·서명 원문을 제거한 요약을 evidence 템플릿에 옮깁니다.
- 공개 전 git diff --cached, git status --short, npm run secrets:check, node scripts/check-secrets.mjs --history를 확인합니다.
- GitHub remote를 만든 뒤 secret scanning/push protection을 지원하는 경우 활성화합니다. 이 환경에서는 원격 저장소를 생성하지 않았습니다.
- 노출된 키는 파일 삭제만으로 해결되지 않습니다. 폐기/교체하고 기록과 공개 artifact에서 제거합니다.

Interview Brief 원문, 지갑 생성물, 실제 개인정보는 공개 자료에 포함하지 않았습니다. 자동 hook은 우회될 수 있으므로 공개 전 사람의 검토가 필요합니다.

