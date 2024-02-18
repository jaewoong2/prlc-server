# Prlc Web

## 링크 단축 서비스 Backend Repository

### 요구사항

#### MVP
- 링크 단축 (Create, Read, Update, Delete)
  - 원본링크 는 많은 단축링크를 갖습니다
  - 단축링크는 `썸네일`이 있음 (nullable)
  - 단축링크는 `단축링크` 값이 있음 (not null)
  - 단축링크는 `제목` 이 있음 (nullable)
  - 단축링크는 `작성자` 가 있음 (nullable)
  - 단축링크는 3일 후 삭제
    - 작성자가 Null 일 때 (3일 후 삭제)
    - DB 수준에서 Function 으로 제어

- 이미지 업로드시, S3에 이미지 최소화후 업로드
  - 로그인 회원만 사용 가능
  - S3에 트리거 걸지 / 백엔드 단에서 할지 결정
  - 원본데이터는 굳이 필요 하지 않을 듯

- 로그인 (**AWS Cognito**)
- 로그인 회원 (파이프 라인으로 제어)
  - 링크 편집 가능 (링크ID / 제목 / 단축링크)
  - 단축링크는 무제한 보관

- 로그인 세션 유지 얘는 어떻게 하지

#### NEXT
- 회원 등급 설정
- 결제 회원
  - 서브 도메인 발급
  - 무제한 발급
  - 무제한 저장
  - 페이지 내 비공개 여부 설정 가능
  - 링크 별 조회수 (그래프) 및 기타 인사이트 줌


  ------


  sharp 모듈 설치시 주의사항 ⚠️sharp는 OS의 바이너리를 이용하기 때문에 윈도우, 맥, 리눅스 OS에 따라 설치되는 모듈이 다르게 된다.단순히 npm install sharp 명령어를 실행할 경우 현재 내 컴퓨터의 OS와 CPU 아키텍쳐 사양에 맞게 전용 바이너리가 다운되게 된다.현 OS에서 쭉 사용할 것이면 문제는 없지만 만일 node_modules를 그대로 리눅스 서버로 들고가서 올려 사용할때 문제가 생기게 된다. 왜냐하면 윈도우 바이너리로 돌아가는 shap 패키지를 리눅에서 돌리려고 하니 돌아갈리가 없기 때문이다.이러한 문제는 윈도우 OS에서 개발하고 AWS Lambda 함수로 업로드 할때(람다는 아마존 리눅스로 돌아간다) 가장 빈번히 발생하는 문제이다.따라서 만일 리눅스 환경에서 사용할 예정이라면 다음과 같이 미리 옵션으로 플랫폼을 지정해서 사용해야 한다.
> npm install --platform=linux sharpCopy
[옵션]  --platform: 중 linux하나 darwin또는 win32.  --arch: x64, ia32, arm또는 arm64.  --arm-version: 6, 7또는 8( arm기본값은 6, arm64기본값은 8) 중 하나입니다.  --libc: glibc또는 musl. 이 옵션은 플랫폼에서만 작동하며 linux기본값은glibc  --sharp-install-force: 버전 호환성 및 하위 리소스 무결성 검사를 건너뜁니다.



https://inpa.tistory.com/entry/NODE-%F0%9F%93%9A-Sharp-%EB%AA%A8%EB%93%88-%EC%82%AC%EC%9A%A9%EB%B2%95-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%A6%AC%EC%82%AC%EC%9D%B4%EC%A7%95-%EC%9B%8C%ED%84%B0%EB%A7%88%ED%81%AC-%EB%84%A3%EA%B8%B0# prlc-server
