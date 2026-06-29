@AGENTS.md

# Synply

## 1. 프로젝트 개요

Synply는 취업 지원 기록, 제출 파일, 전형 상태, 결과 메모를 한 흐름으로 연결해 관리하는 개인 취업 지원 기록 대시보드입니다.

## 2. 프로젝트 구조

Synply는 프론트엔드와 백엔드를 분리해서 구현한다.

- `frontend/`: Next.js App Router 기반 프론트엔드
- `backend/`: Node.js + Express + TypeScript 기반 REST API 서버
- `docs/`: 설계 문서, 코드 컨벤션, API 문서 등

데이터 흐름:

```txt
Frontend → Express REST API → Supabase PostgreSQL / Storage
```

인증 흐름:

```txt
Frontend → Supabase Auth
Frontend → Express API 요청 시 Authorization Bearer token 포함
Backend → Supabase access token 검증
```

- 프론트엔드는 로그인/회원가입 및 세션 관리에만 Supabase Auth SDK를 사용한다.
- 지원 기록, 제출 파일, 대시보드 데이터는 Express REST API를 통해 처리한다.

## 3. 기술 스택

### 프론트엔드

- Next.js
- React
- TypeScript
- Tailwind CSS
- TanStack Query v5
- React Hook Form
- Zod
- Supabase JS SDK
  - 로그인/회원가입 및 세션 관리에만 사용
- Vitest
- React Testing Library

### 백엔드

- Node.js
- Express
- TypeScript
- Zod
- Supabase JS SDK
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- multer
- cors
- dotenv

### 배포

- 프론트엔드: Vercel
- 백엔드: Railway 또는 Render
- Database/Auth/Storage: Supabase

## 4. 참고 문헌

- 프론트엔드 코드 컨벤션: docs/Synply_Frontend_Code_Convention.md
- 백엔드 코드 컨벤션: 추후 추가 예정
- UI 디자인 시안: docs/design_draft
  - 해당 폴더 내 README.md 먼저 읽고 폴더 내 전체 파일 탐색
- UI 개발 계획: docs/IMPLEMENTATION_PLAN.md
- REST API 문서: docs/Synply*REST_API*설계서.md

문서 간 내용이 충돌하면 작업을 중단하고, 사용자에게 확인 요청을 한다.

## 5. 코드 컨벤션

### 프론트 컨벤션 요약

자세한 내용은 프론트엔드 코드 컨벤션을 정리한 docs/Synply_Frontend_Code_Convention.md 파일을 확인한다.

### 백엔드 컨벤션 요약

추후 작성 예정

### Git 컨벤션

커밋 메시지는 아래 형식을 사용한다.

```txt
type: 작업 내용 (작업 내용은 한글로 작성한다.)
```

사용하는 type은 아래로 제한한다.

- feat: 기능 추가
- fix: 버그 수정
- docs: 문서 수정
- style: 코드 포맷팅, 스타일 수정
- refactor: 기능 변화 없는 구조 개선
- test: 테스트 추가 또는 수정
- chore: 설정, 패키지, 기타 작업
- design: UI 스타일, 레이아웃, 디자인 반영

## 6. 작업 규칙

- 작업 진행에 확신이 없을 때는 항상 사용자에게 확인 요청을 한다.
- 작업을 진행하기 전 관련 문서를 먼저 확인한다.
- 새로운 라이브러리는 필요성이 명확할 때만 추가한다.
- 단순하고 읽기 쉬운 구현을 우선한다.
- 문서와 주석은 기본적으로 한국어로 작성한다.
- 코드 식별자는 영어를 사용한다.

## 7. 하지 말 것

- 작업 범위를 임의로 넓히지 않는다.
- 프론트엔드에서 Supabase DB/Storage에 직접 접근하지 않는다. (Server Action 등 사용 금지)
- 디자인 색상을 hex 값으로 하드코딩하지 않는다.
- 비즈니스 규칙을 UI 컴포넌트에 중복 작성하지 않는다.
- Supabase service role key를 프론트엔드에 노출하지 않는다.
