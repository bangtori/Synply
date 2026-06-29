# Synply REST API 설계서

## 1. 문서 목적

이 문서는 Synply 프론트엔드가 백엔드와 주고받는 API 요청/응답 구조를 정의한다. 데이터 모델 설계서에서 확정한 엔티티와 관계, 삭제/연결 정책을 기반으로 각 리소스별 엔드포인트, 요청 파라미터, 응답 형태, 에러 처리를 명세한다.

이 문서는 **프론트엔드 관점의 API 계약서**다. 실제 DB 쿼리 구조, 서버 구현 방식, 인증/인가 구현, Storage 연동 방식은 별도 기술 설계 문서에서 결정한다.

**네이밍 컨벤션:**
API 요청/응답 JSON은 프론트엔드 사용성을 위해 `camelCase`를 사용한다. 서버는 DB의 `snake_case` 컬럼을 API 응답에서 `camelCase`로 매핑해 반환한다. DB 컬럼명(`application_id`, `company_name`)과 API 필드명(`id` 또는 `applicationId`, `companyName`)은 서로 다를 수 있으며, 이 변환은 서버 레이어에서 처리한다. 예를 들어 DB의 `application_id`는 API 응답에서 `id`로, `submission_file_id`는 `id` 또는 `submissionFileId`로 매핑될 수 있다. enum key(`APPLIED`, `RESUME` 등)는 DB/API/프론트 모두 동일하게 `UPPER_SNAKE_CASE`를 사용한다.

> **v2 검수 반영:** 전형 상태값을 enum key 기반으로 통일, statusDistribution을 array 형태로 변경, 지원 기록 등록 시 제출 파일 일괄 연결 지원, 제출 파일 연결 일괄 교체 API 추가, 파일 업로드 방식 multipart 직접 업로드로 확정, 페이지네이션 방식 page/pageSize로 확정, 기술 스택 필터 AND 조건 설명 보완, 용어 정합성 수정.
>
> **v3 검수 반영:** fileType도 enum key 기반으로 통일, 모든 예시 JSON의 fileType 값 갱신, 제출 파일 응답에 mimeType 추가, submissionFiles.summary → submissionFiles.label로 필드명 변경, PUT /applications/:id/files 응답에 submissionFilesSummary 추가, POST/PUT 역할 구분 명확화, 단건 연결/해제 API 위상 정리, 인증 전제 문장 추가, fileType 관련 에러 보완.
>
> **v4 검수 반영:** Supabase Auth 기반 이메일/비밀번호 인증 확정, 사용자 소유권 원칙 명시, 공통 에러에 403 추가, API별 소유권 검증 설명 추가, 2차 안정화 항목 분리.
>
> **v5 검수 반영:** error.code를 도메인별 구체적 문자열 enum으로 세분화, 모든 API에 성공 응답(HTTP status + 반환 타입) 명시, 에러 표를 HTTP status / error.code / 설명 3열로 통일, 모든 인증 필요 API에 401 UNAUTHORIZED 추가, 타인 소유 리소스 접근 404 처리 기준 보완, 프론트엔드 에러 처리 기준 추가, Supabase Auth Bearer token 인증 방식 확정, 공통 요청 헤더 및 HTTP 요청 예시 추가.

---

## 2. API 설계 원칙

- API는 화면 컴포넌트 단위가 아니라 **리소스 단위**로 설계한다.
- 리스트 보기와 칸반 보기는 같은 지원 기록 데이터를 다른 방식으로 표현하므로, **동일한 목록 API**를 사용한다.
- 모바일과 데스크탑을 이유로 API를 분리하지 않는다.
- 상세 화면은 목록 카드보다 더 많은 필드를 필요로 하므로, 목록 응답과 상세 응답의 형태를 구분한다.
- 대시보드에서 필요한 요약 통계는 `GET /dashboard/summary` 하나로 묶어 제공한다.
- 제출 파일의 다운로드 URL은 파일 메타데이터 응답에 포함하지 않고, 별도 엔드포인트로 요청 시 발급한다.
- 검색·필터·정렬 조건은 모두 query string으로 전달하며, URL에 반영되어 새로고침 시 유지된다.
- 필터 옵션(플랫폼 목록, 기술 스택 목록, 제출 파일 목록)은 `/filter-options` 하위 엔드포인트로 묶어 제공한다.
- 전형 상태는 API 요청/응답 전반에서 enum key를 사용하며, 화면 라벨 변환은 프론트엔드에서 처리한다.
- 파일 유형(fileType)도 API 요청/응답 전반에서 enum key를 사용하며, 화면 라벨 변환은 프론트엔드에서 처리한다.

**인증 및 소유권 원칙:**
- 모든 API는 인증된 사용자만 호출할 수 있다. MVP 인증은 Supabase Auth 기반 이메일/비밀번호 방식을 사용한다.
- `userId`는 클라이언트 요청 body에서 받지 않는다. 생성 API에서 `userId`는 서버가 현재 인증 세션에서 추출해 설정한다.
- 조회/수정/삭제 API는 현재 로그인한 사용자 소유 데이터만 대상으로 한다. 타인 소유 리소스에 접근하면 `404` 또는 `403`을 반환한다.
- `PUT /applications/:id/files`에서 `application`과 `submissionFileIds`가 모두 현재 사용자 소유인지 서버에서 검증한다.
- 대시보드 통계, 필터 옵션은 모두 현재 로그인한 사용자 데이터 기준으로 집계한다.
- 데모 계정도 일반 사용자와 동일한 인증/소유권 구조를 사용한다.
- 인증/인가 구현 방식(세션 토큰 구조, 헤더 형식 등)은 백엔드 기술 설계에서 결정한다.

**인증 방식:**

인증이 필요한 모든 API는 `Authorization` 헤더를 사용한다.

```
Authorization: Bearer <access_token>
```

- `access_token`은 Supabase Auth 로그인 후 발급받는다.
- 프론트엔드는 인증이 필요한 모든 API 요청에 `Authorization` 헤더를 포함한다.
- 서버는 `Authorization` 헤더의 access token을 검증한 후 현재 사용자 정보를 추출한다.
- `userId`는 요청 body로 전달하지 않으며, 서버가 인증 세션에서 추출해 설정한다.

**공통 요청 헤더:**

| 헤더 | 값 | 적용 조건 |
|---|---|---|
| `Authorization` | `Bearer <access_token>` | 인증이 필요한 모든 API |
| `Content-Type` | `application/json` | JSON body를 전송하는 POST/PATCH/PUT 요청 |
| `Content-Type` | (브라우저 자동 설정) | `multipart/form-data` 파일 업로드 요청 (`POST /submission-files`). 직접 설정하지 않는다 |

**HTTP 요청 예시 (지원 기록 등록):**

```
POST /applications
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "companyName": "토스",
  "positionTitle": "프론트엔드 엔지니어",
  "status": "APPLIED",
  "appliedAt": "2026-06-10"
}
```

**HTTP 요청 예시 (파일 업로드):**

```
POST /submission-files
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data; boundary=----FormBoundary...

[파일 바이너리 및 메타데이터]
```

---

## 3. 전형 상태 enum key 정의

API 요청/응답에서 전형 상태는 아래 enum key를 사용한다. 한글 라벨은 화면 표시 전용이며 API에서 사용하지 않는다.

| enum key | 화면 라벨 |
|---|---|
| `APPLIED` | 지원 완료 |
| `DOCUMENT_PASSED` | 서류 합격 |
| `INTERVIEWING` | 면접 중 |
| `FINAL_PASSED` | 최종 합격 |
| `DOCUMENT_FAILED` | 서류 불합격 |
| `INTERVIEW_FAILED` | 면접 불합격 |

API는 enum key를 반환하고, 프론트엔드는 위 매핑 테이블을 기준으로 화면 라벨로 변환한다. API 응답에 `statusLabel`을 포함할지는 프론트엔드 구현 방식에 따라 선택할 수 있으나, 기본 설계는 API가 enum key만 반환하는 방식으로 한다.

---

## 4. 파일 유형 enum key 정의

API 요청/응답에서 파일 유형은 아래 enum key를 사용한다. 한글 라벨은 화면 표시 전용이며 API에서 사용하지 않는다.

| enum key | 화면 라벨 |
|---|---|
| `RESUME` | 이력서 |
| `PORTFOLIO` | 포트폴리오 |
| `COVER_LETTER` | 자기소개서 |
| `CAREER_DESCRIPTION` | 경력기술서 |
| `ASSIGNMENT` | 과제 |
| `ETC` | 기타 |

API는 enum key를 반환하고, 프론트엔드는 위 매핑 테이블을 기준으로 화면 라벨로 변환한다. `POST /submission-files` 요청에서 `fileType`을 미전달하면 서버에서 `RESUME`을 기본값으로 적용한다.

---

## 5. 공통 응답 형식

모든 성공 응답은 아래 형태를 기본으로 한다.

```json
{
  "data": { },
  "meta": { }
}
```

- `data`: 실제 응답 페이로드. 단건이면 객체, 목록이면 배열.
- `meta`: 페이지네이션 정보, 총 건수 등 부가 정보. 해당 없는 경우 생략 가능.

**목록 응답 예시:**

```json
{
  "data": [ ... ],
  "meta": {
    "total": 42,
    "page": 1,
    "pageSize": 20,
    "hasNextPage": true
  }
}
```

**단건 응답 예시:**

```json
{
  "data": {
    "id": "app_001",
    "companyName": "토스",
    "status": "INTERVIEWING"
  }
}
```

---

## 6. 공통 에러 형식

에러 응답은 아래 형태를 따른다.

```json
{
  "error": {
    "code": "APPLICATION_NOT_FOUND",
    "message": "지원 기록을 찾을 수 없습니다."
  }
}
```

`error.code`는 프론트엔드 분기 처리를 위한 안정적인 문자열 enum이다. HTTP status는 네트워크/프로토콜 수준의 상태를 나타내고, `error.code`는 서비스 도메인에서 발생한 구체적인 에러 유형을 나타낸다. 숫자 error code는 사용하지 않는다.

**공통 에러 코드 목록:**

| HTTP status | error.code | 의미 |
|---:|---|---|
| 400 | `VALIDATION_ERROR` | 일반적인 입력값 검증 실패 |
| 400 | `REQUIRED_FIELD_MISSING` | 필수값 누락 |
| 400 | `INVALID_STATUS` | 허용되지 않은 전형 상태 enum key |
| 400 | `INVALID_FILE_TYPE` | 허용되지 않은 파일 유형 enum key |
| 400 | `UNSUPPORTED_FILE_FORMAT` | 지원하지 않는 파일 확장자 또는 MIME 타입 |
| 400 | `FILE_TOO_LARGE` | 파일 크기 제한 초과 |
| 401 | `UNAUTHORIZED` | 인증되지 않은 요청 |
| 403 | `FORBIDDEN` | 인증은 됐으나 해당 리소스 소유자가 아닌 경우 |
| 404 | `APPLICATION_NOT_FOUND` | 지원 기록을 찾을 수 없음 |
| 404 | `SUBMISSION_FILE_NOT_FOUND` | 제출 파일을 찾을 수 없음 |
| 404 | `APPLICATION_FILE_LINK_NOT_FOUND` | 지원 기록과 제출 파일의 연결 관계를 찾을 수 없음 |
| 409 | `SUBMISSION_FILE_ALREADY_LINKED` | 이미 연결된 파일을 중복 연결하려는 경우 |
| 409 | `SUBMISSION_FILE_IN_USE` | 연결된 지원 기록이 있어 제출 파일을 삭제할 수 없는 경우 |
| 500 | `INTERNAL_ERROR` | 서버 내부 오류 |

**403과 404 사용 기준:**
타인 소유 리소스 접근은 보안상 리소스 존재 여부를 숨기기 위해 `404`로 응답할 수 있다. 이 경우 `APPLICATION_NOT_FOUND`, `SUBMISSION_FILE_NOT_FOUND`처럼 리소스별 not found 코드를 사용한다. 권한 부족을 명확히 드러내도 되는 관리성 API나 정책 위반 상황에서는 `403 FORBIDDEN`을 사용할 수 있다.

**프론트엔드 에러 처리 기준:**
프론트엔드는 HTTP status와 `error.code`를 함께 사용해 에러를 처리한다.
- HTTP status: 인증 만료, 네트워크/서버 오류 등 큰 분류 판단
- `error.code`: 사용자에게 보여줄 토스트, 폼 에러, 다이얼로그 안내 문구 분기

예를 들어 `SUBMISSION_FILE_IN_USE`는 제출 파일 삭제 버튼 클릭 후 토스트로 안내하고, `REQUIRED_FIELD_MISSING`은 폼 필드 에러로 표시한다.

---

## 7. 지원 기록 API

### 7-1. 지원 기록 목록 조회

| 항목 | 내용 |
|---|---|
| Method | `GET` |
| Endpoint | `/applications` |
| 설명 | 검색·필터·정렬 조건에 맞는 지원 기록 목록을 반환한다. 리스트 보기와 칸반 보기 모두 이 API를 사용한다. |
| 인증 | 필요 |
| 페이지네이션 | page/pageSize 기반 |

**Query Parameters:**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `q` | string | 선택 | 회사명 또는 직무명 텍스트 검색 |
| `status` | string[] | 선택 | 전형 상태 필터. enum key 사용. 복수 선택 가능. 예: `status=APPLIED&status=DOCUMENT_PASSED` |
| `platform` | string | 선택 | 지원 플랫폼 필터 |
| `techStacks` | string[] | 선택 | 기술 스택 필터. 복수 선택 시 AND 조건 (선택한 기술을 모두 포함하는 지원 기록) |
| `submissionFileId` | string | 선택 | 특정 제출 파일이 연결된 지원 기록만 조회 |
| `sort` | string | 선택 | 정렬 기준. 기본값: `appliedAt_desc` |
| `page` | number | 선택 | 페이지 번호. 기본값: 1 |
| `pageSize` | number | 선택 | 페이지 크기. 기본값: 20 |

**성공 응답:**

| HTTP status | 반환 |
|---:|---|
| 200 | 지원 기록 목록 배열 + pagination meta |

```json
{
  "data": [
    {
      "id": "app_001",
      "companyName": "토스",
      "positionTitle": "프론트엔드 엔지니어",
      "status": "INTERVIEWING",
      "platform": "원티드",
      "techStacks": ["React", "TypeScript"],
      "appliedAt": "2026-06-10",
      "submissionFiles": {
        "count": 1,
        "label": "이력서 v3.pdf"
      },
      "createdAt": "2026-06-10T09:00:00Z"
    }
  ],
  "meta": {
    "total": 8,
    "page": 1,
    "pageSize": 20,
    "hasNextPage": false
  }
}
```

> `submissionFiles.label`은 연결 파일이 1건이면 해당 파일의 `displayName`, 2건 이상이면 `"제출 파일 N건"` 형식으로 반환한다. 0건이면 `null`.

**에러:**

| HTTP status | error.code | 설명 |
|---:|---|---|
| 401 | `UNAUTHORIZED` | 인증되지 않은 요청 |
| 400 | `VALIDATION_ERROR` | query parameter 형식이 잘못됨 |
| 400 | `INVALID_STATUS` | 허용되지 않은 status enum key |
| 404 | `SUBMISSION_FILE_NOT_FOUND` | `submissionFileId`가 존재하지 않거나 현재 사용자 소유가 아님 |

---

### 7-2. 지원 기록 등록

| 항목 | 내용 |
|---|---|
| Method | `POST` |
| Endpoint | `/applications` |
| 설명 | 새 지원 기록을 등록한다. 등록 시 `submissionFileIds`로 제출 파일을 함께 연결할 수 있다. 지원 기록 수정 화면에서 제출 파일 연결 목록을 변경할 때는 `PUT /applications/:id/files`를 사용한다. |
| 인증 | 필요 |

**Request Body:**

```json
{
  "companyName": "토스",
  "positionTitle": "프론트엔드 엔지니어",
  "postingUrl": "https://www.wanted.co.kr/wd/198234",
  "deadline": "2026-06-25",
  "platform": "원티드",
  "techStacks": ["React", "TypeScript"],
  "status": "APPLIED",
  "appliedAt": "2026-06-10",
  "submissionFileIds": ["file_001", "file_003"]
}
```

| 필드 | 필수 | 설명 |
|---|---|---|
| `companyName` | 필수 | 회사명 |
| `positionTitle` | 필수 | 직무명 |
| `postingUrl` | 선택 | 공고 URL |
| `deadline` | 선택 | 마감일 |
| `platform` | 선택 | 지원 플랫폼 |
| `techStacks` | 선택 | 기술 스택 배열 |
| `status` | 선택 | 전형 상태 enum key. 미전달 시 서버에서 `APPLIED` 적용 |
| `appliedAt` | 선택 | 지원일. 미전달 시 서버에서 오늘 날짜 적용 |
| `submissionFileIds` | 선택 | 연결할 제출 파일 id 배열. 미전달 또는 빈 배열이면 파일 미연결로 등록 |

- `submissionFileIds`가 전달되면 지원 기록 생성과 함께 해당 제출 파일들을 연결한다.
- 배열에 존재하지 않거나 현재 사용자 소유가 아닌 파일 id가 포함된 경우 전체 생성이 실패한다(부분 생성 없음).

**성공 응답:**

| HTTP status | 반환 |
|---:|---|
| 201 | 생성된 지원 기록 상세 객체 |

응답 body는 7-3 지원 기록 상세 조회 응답 형태와 동일하다.

**에러:**

| HTTP status | error.code | 설명 |
|---:|---|---|
| 401 | `UNAUTHORIZED` | 인증되지 않은 요청 |
| 400 | `REQUIRED_FIELD_MISSING` | `companyName` 또는 `positionTitle` 누락 |
| 400 | `INVALID_STATUS` | 허용되지 않은 `status` enum key |
| 404 | `SUBMISSION_FILE_NOT_FOUND` | `submissionFileIds`에 존재하지 않거나 현재 사용자 소유가 아닌 파일 id 포함 |

---

### 7-3. 지원 기록 상세 조회

| 항목 | 내용 |
|---|---|
| Method | `GET` |
| Endpoint | `/applications/:id` |
| 설명 | 특정 지원 기록의 전체 정보를 반환한다. 목록 카드보다 더 많은 필드를 포함한다. |
| 인증 | 필요 |

**성공 응답:**

| HTTP status | 반환 |
|---:|---|
| 200 | 지원 기록 상세 객체 |

```json
{
  "data": {
    "id": "app_001",
    "companyName": "토스",
    "positionTitle": "프론트엔드 엔지니어",
    "postingUrl": "https://www.wanted.co.kr/wd/198234",
    "deadline": "2026-06-25",
    "platform": "원티드",
    "techStacks": ["React", "TypeScript"],
    "status": "INTERVIEWING",
    "appliedAt": "2026-06-10",
    "createdAt": "2026-06-10T09:00:00Z",
    "updatedAt": "2026-06-12T14:30:00Z",
    "submissionFiles": [
      {
        "id": "file_001",
        "displayName": "이력서 v3.pdf",
        "fileType": "RESUME",
        "mimeType": "application/pdf",
        "fileSize": 1258291,
        "uploadedAt": "2026-05-30T10:00:00Z"
      }
    ],
    "memo": {
      "content": "1차 면접 분위기 좋았음.",
      "updatedAt": "2026-06-12T14:30:00Z"
    }
  }
}
```

> `submissionFiles`는 연결된 제출 파일 전체 목록을 반환한다. 0건이면 빈 배열 `[]`.
> `memo`는 작성된 메모가 없으면 `null`.

**에러:**

| HTTP status | error.code | 설명 |
|---:|---|---|
| 401 | `UNAUTHORIZED` | 인증되지 않은 요청 |
| 404 | `APPLICATION_NOT_FOUND` | 지원 기록이 존재하지 않거나 현재 사용자 소유가 아님 |

---

### 7-4. 지원 기록 수정

| 항목 | 내용 |
|---|---|
| Method | `PATCH` |
| Endpoint | `/applications/:id` |
| 설명 | 지원 기록의 공고 정보(회사명, 직무명, 공고 URL, 마감일, 플랫폼, 기술 스택, 지원일)를 수정한다. 전형 상태 변경은 8-1 전형 상태 변경 API를, 제출 파일 연결 변경은 9-3 제출 파일 연결 일괄 교체 API를 사용한다. |
| 인증 | 필요 |

**Request Body:** 수정할 필드만 포함 (partial update)

```json
{
  "positionTitle": "프론트엔드 개발자",
  "deadline": "2026-06-30",
  "techStacks": ["React", "TypeScript", "Next.js"]
}
```

**성공 응답:**

| HTTP status | 반환 |
|---:|---|
| 200 | 수정된 지원 기록 상세 객체 |

응답 body는 7-3 지원 기록 상세 조회 응답 형태와 동일하다.

**에러:**

| HTTP status | error.code | 설명 |
|---:|---|---|
| 401 | `UNAUTHORIZED` | 인증되지 않은 요청 |
| 404 | `APPLICATION_NOT_FOUND` | 지원 기록이 존재하지 않거나 현재 사용자 소유가 아님 |
| 400 | `REQUIRED_FIELD_MISSING` | `companyName` 또는 `positionTitle`을 빈 값으로 수정하려는 경우 |
| 400 | `VALIDATION_ERROR` | 허용되지 않은 필드가 포함됨. `status` 변경은 `PATCH /applications/:id/status`를 사용한다 |

---

### 7-5. 지원 기록 삭제

| 항목 | 내용 |
|---|---|
| Method | `DELETE` |
| Endpoint | `/applications/:id` |
| 설명 | 지원 기록을 삭제한다. 연결된 결과 메모도 함께 삭제된다. 연결된 제출 파일 자체는 삭제되지 않으며, 연결 관계(application_submission_files)만 삭제된다. |
| 인증 | 필요 |

**성공 응답:**

| HTTP status | 반환 |
|---:|---|
| 204 | 본문 없음 |

**에러:**

| HTTP status | error.code | 설명 |
|---:|---|---|
| 401 | `UNAUTHORIZED` | 인증되지 않은 요청 |
| 404 | `APPLICATION_NOT_FOUND` | 지원 기록이 존재하지 않거나 현재 사용자 소유가 아님 |

---

## 8. 전형 상태 API

### 8-1. 전형 상태 변경

| 항목 | 내용 |
|---|---|
| Method | `PATCH` |
| Endpoint | `/applications/:id/status` |
| 설명 | 지원 기록의 전형 상태만 변경한다. 지원 기록 수정(7-4)과 분리한 이유는 상태 변경이 리스트/칸반 화면에서 빈번하게 발생하며, optimistic update 처리 단위로 구분하기 위함이다. |
| 인증 | 필요 |

**Request Body:**

```json
{
  "status": "DOCUMENT_PASSED"
}
```

**허용 값:** `APPLIED` | `DOCUMENT_PASSED` | `INTERVIEWING` | `FINAL_PASSED` | `DOCUMENT_FAILED` | `INTERVIEW_FAILED`

**성공 응답:**

| HTTP status | 반환 |
|---:|---|
| 200 | 변경된 상태 요약 객체 |

```json
{
  "data": {
    "id": "app_001",
    "status": "DOCUMENT_PASSED",
    "updatedAt": "2026-06-13T10:00:00Z"
  }
}
```

> 상태 변경 응답은 전체 지원 기록 대신 변경된 필드(`id`, `status`, `updatedAt`)만 반환한다. 프론트엔드가 캐시를 부분 업데이트하기에 충분한 정보다.

**에러:**

| HTTP status | error.code | 설명 |
|---:|---|---|
| 401 | `UNAUTHORIZED` | 인증되지 않은 요청 |
| 404 | `APPLICATION_NOT_FOUND` | 지원 기록이 존재하지 않거나 현재 사용자 소유가 아님 |
| 400 | `INVALID_STATUS` | 허용되지 않은 `status` enum key |

---

## 9. 제출 파일 연결 API

지원 기록에 제출 파일을 연결하거나 해제하는 API다. 제출 파일 자체의 업로드/삭제는 10장에서 다룬다.

### 9-1. 지원 기록에 제출 파일 단건 연결

| 항목 | 내용 |
|---|---|
| Method | `POST` |
| Endpoint | `/applications/:id/files` |
| 설명 | 특정 지원 기록에 이미 업로드된 제출 파일 1건을 연결한다. |
| 인증 | 필요 |

**Request Body:**

```json
{
  "submissionFileId": "file_001"
}
```

**성공 응답:**

| HTTP status | 반환 |
|---:|---|
| 201 | 생성된 연결 관계 객체 |

```json
{
  "data": {
    "id": "link_001",
    "applicationId": "app_001",
    "submissionFileId": "file_001"
  }
}
```

**에러:**

| HTTP status | error.code | 설명 |
|---:|---|---|
| 401 | `UNAUTHORIZED` | 인증되지 않은 요청 |
| 404 | `APPLICATION_NOT_FOUND` | 지원 기록이 존재하지 않거나 현재 사용자 소유가 아님 |
| 404 | `SUBMISSION_FILE_NOT_FOUND` | 제출 파일이 존재하지 않거나 현재 사용자 소유가 아님 |
| 409 | `SUBMISSION_FILE_ALREADY_LINKED` | 이미 연결된 파일에 중복 연결 시도 |

---

### 9-2. 지원 기록에서 제출 파일 단건 연결 해제

| 항목 | 내용 |
|---|---|
| Method | `DELETE` |
| Endpoint | `/applications/:applicationId/files/:submissionFileId` |
| 설명 | 특정 지원 기록과 특정 제출 파일의 연결을 해제한다. 제출 파일 자체는 삭제되지 않는다. |
| 인증 | 필요 |

**성공 응답:**

| HTTP status | 반환 |
|---:|---|
| 204 | 본문 없음 |

**에러:**

| HTTP status | error.code | 설명 |
|---:|---|---|
| 401 | `UNAUTHORIZED` | 인증되지 않은 요청 |
| 404 | `APPLICATION_FILE_LINK_NOT_FOUND` | 연결 관계가 존재하지 않거나 현재 사용자 소유 관계가 아님 |

---

### 9-3. 제출 파일 연결 일괄 교체

| 항목 | 내용 |
|---|---|
| Method | `PUT` |
| Endpoint | `/applications/:id/files` |
| 설명 | 특정 지원 기록에 연결된 제출 파일 목록을 요청으로 전달한 배열로 교체한다. **지원 기록 수정 화면에서 제출 파일 연결 목록을 변경할 때 사용하는 기본 API다.** 지원 기록 신규 등록 시 초기 파일 연결은 `POST /applications`의 `submissionFileIds`로 처리한다. 기존 연결을 모두 해제하고 전달된 목록으로 재연결한다. |
| 인증 | 필요 |

**Request Body:**

```json
{
  "submissionFileIds": ["file_001", "file_003"]
}
```

- 빈 배열 `[]`을 전달하면 모든 제출 파일 연결이 해제된다.
- 배열에 존재하지 않거나 현재 사용자 소유가 아닌 파일 id가 포함된 경우 교체 전체가 실패한다(부분 교체 없음).

**성공 응답:**

| HTTP status | 반환 |
|---:|---|
| 200 | 교체 후 제출 파일 목록 + 요약 |

```json
{
  "data": {
    "applicationId": "app_001",
    "submissionFiles": [
      {
        "id": "file_001",
        "displayName": "이력서 v3.pdf",
        "fileType": "RESUME",
        "mimeType": "application/pdf",
        "fileSize": 1258291,
        "uploadedAt": "2026-05-30T10:00:00Z"
      },
      {
        "id": "file_003",
        "displayName": "포트폴리오 2026.pdf",
        "fileType": "PORTFOLIO",
        "mimeType": "application/pdf",
        "fileSize": 3145728,
        "uploadedAt": "2026-06-01T11:00:00Z"
      }
    ],
    "submissionFilesSummary": {
      "count": 2,
      "label": "제출 파일 2건"
    }
  }
}
```

빈 배열로 모든 연결을 해제한 경우:

```json
{
  "data": {
    "applicationId": "app_001",
    "submissionFiles": [],
    "submissionFilesSummary": {
      "count": 0,
      "label": null
    }
  }
}
```

**에러:**

| HTTP status | error.code | 설명 |
|---:|---|---|
| 401 | `UNAUTHORIZED` | 인증되지 않은 요청 |
| 404 | `APPLICATION_NOT_FOUND` | 지원 기록이 존재하지 않거나 현재 사용자 소유가 아님 |
| 404 | `SUBMISSION_FILE_NOT_FOUND` | `submissionFileIds`에 존재하지 않거나 현재 사용자 소유가 아닌 파일 id 포함 |

**MVP 사용 정책:**

- 지원 기록 신규 등록 시 초기 제출 파일 연결: `POST /applications`의 `submissionFileIds` 사용.
- 지원 기록 수정 화면에서 제출 파일 연결 목록 변경: `PUT /applications/:id/files` 사용 (기본 API).
- 단건 연결(`POST /applications/:id/files`)과 단건 해제(`DELETE /applications/:applicationId/files/:submissionFileId`)는 MVP 프론트엔드 기본 구현에서 사용하지 않으며, 향후 상세 화면에서 개별 파일 액션이 필요할 경우 사용할 수 있는 보조 API로 유지한다.

---

## 10. 제출 파일 API

제출 파일 자체의 업로드, 목록 조회, 삭제, 다운로드 URL 발급을 다룬다.

### 10-1. 제출 파일 목록 조회

| 항목 | 내용 |
|---|---|
| Method | `GET` |
| Endpoint | `/submission-files` |
| 설명 | 업로드된 제출 파일 전체 목록을 반환한다. **제출 파일 관리 화면**과 **지원 기록 등록/수정 드로어의 파일 선택 목록**에서 사용한다. 파일 메타데이터와 `linkedApplicationCount`를 포함한 상세 목록이다. |
| 인증 | 필요 |
| 페이지네이션 | 없음 |

**성공 응답:**

| HTTP status | 반환 |
|---:|---|
| 200 | 제출 파일 목록 배열 |

```json
{
  "data": [
    {
      "id": "file_001",
      "displayName": "이력서 v3.pdf",
      "originalFileName": "이력서_최종.pdf",
      "fileType": "RESUME",
      "mimeType": "application/pdf",
      "fileSize": 1258291,
      "uploadedAt": "2026-05-30T10:00:00Z",
      "linkedApplicationCount": 2
    },
    {
      "id": "file_002",
      "displayName": "이력서 v3-디자인.pdf",
      "originalFileName": "이력서_디자인포지션.pdf",
      "fileType": "RESUME",
      "mimeType": "application/pdf",
      "fileSize": 1363148,
      "uploadedAt": "2026-06-01T11:00:00Z",
      "linkedApplicationCount": 0
    }
  ]
}
```

> `linkedApplicationCount`: 해당 파일이 연결된 지원 기록 수. 삭제 가능 여부 판단 및 UI 표시에 사용한다. 0이면 삭제 가능.

**에러:**

| HTTP status | error.code | 설명 |
|---:|---|---|
| 401 | `UNAUTHORIZED` | 인증되지 않은 요청 |

---

### 10-2. 제출 파일 업로드

| 항목 | 내용 |
|---|---|
| Method | `POST` |
| Endpoint | `/submission-files` |
| 설명 | 제출 파일을 업로드하고 메타데이터를 등록한다. MVP에서는 `multipart/form-data` 직접 업로드 방식을 사용한다. presigned URL 방식은 대용량 파일, 업로드 최적화, 보안 고도화가 필요할 때 후순위로 검토한다. |
| 인증 | 필요 |
| Content-Type | `multipart/form-data` |

**Request Body (form-data):**

| 필드 | 필수 | 설명 |
|---|---|---|
| `file` | 필수 | 업로드할 파일 바이너리 |
| `displayName` | 선택 | 표시명. 미전달 시 원본 파일명 사용 |
| `fileType` | 선택 | 파일 유형 enum key. 미전달 시 서버에서 `RESUME` 적용 |

> 허용 파일 형식은 PDF, Word(.docx/.doc)이며 파일 크기는 10MB 이하다. Storage 저장 경로, 다운로드 URL 만료 정책은 백엔드 기술 설계에서 결정한다. (파일 업로드 설계서에서 확정된 내용)

**성공 응답:**

| HTTP status | 반환 |
|---:|---|
| 201 | 업로드된 제출 파일 객체 |

```json
{
  "data": {
    "id": "file_003",
    "displayName": "포트폴리오 2026.pdf",
    "originalFileName": "portfolio_final.pdf",
    "fileType": "PORTFOLIO",
    "mimeType": "application/pdf",
    "fileSize": 3145728,
    "uploadedAt": "2026-06-13T15:00:00Z",
    "linkedApplicationCount": 0
  }
}
```

**에러:**

| HTTP status | error.code | 설명 |
|---:|---|---|
| 401 | `UNAUTHORIZED` | 인증되지 않은 요청 |
| 400 | `REQUIRED_FIELD_MISSING` | 업로드할 `file` 누락 |
| 400 | `UNSUPPORTED_FILE_FORMAT` | 지원하지 않는 파일 형식 |
| 400 | `FILE_TOO_LARGE` | 파일 크기 초과 (10MB 제한) |
| 400 | `INVALID_FILE_TYPE` | 허용되지 않은 `fileType` enum key |

---

### 10-3. 제출 파일 삭제

| 항목 | 내용 |
|---|---|
| Method | `DELETE` |
| Endpoint | `/submission-files/:id` |
| 설명 | 제출 파일을 삭제한다. 연결된 지원 기록이 있으면 삭제할 수 없다. |
| 인증 | 필요 |

**성공 응답:**

| HTTP status | 반환 |
|---:|---|
| 204 | 본문 없음 |

**에러:**

| HTTP status | error.code | 설명 |
|---:|---|---|
| 401 | `UNAUTHORIZED` | 인증되지 않은 요청 |
| 404 | `SUBMISSION_FILE_NOT_FOUND` | 제출 파일이 존재하지 않거나 현재 사용자 소유가 아님 |
| 409 | `SUBMISSION_FILE_IN_USE` | 연결된 지원 기록이 1건 이상 존재해 삭제 불가 |

> `SUBMISSION_FILE_IN_USE` 응답 시 프론트엔드는 "이 파일은 연결된 지원 기록이 있어 삭제할 수 없습니다" 안내를 표시한다.

---

### 10-4. 다운로드 URL 발급

| 항목 | 내용 |
|---|---|
| Method | `GET` |
| Endpoint | `/submission-files/:id/download-url` |
| 설명 | 특정 제출 파일의 다운로드 URL을 발급한다. 만료 시간이 있는 임시 URL(signed URL)로 발급하며, URL 만료 시간과 서명 방식은 백엔드 기술 설계에서 결정한다. |
| 인증 | 필요 |

**성공 응답:**

| HTTP status | 반환 |
|---:|---|
| 200 | 다운로드 URL + 만료 시각 |

```json
{
  "data": {
    "url": "https://storage.example.com/files/file_001?token=xxx&expires=1718272800",
    "expiresAt": "2026-06-13T16:00:00Z"
  }
}
```

**에러:**

| HTTP status | error.code | 설명 |
|---:|---|---|
| 401 | `UNAUTHORIZED` | 인증되지 않은 요청 |
| 404 | `SUBMISSION_FILE_NOT_FOUND` | 제출 파일이 존재하지 않거나 현재 사용자 소유가 아님 |

---

## 11. 결과 메모 API

결과 메모는 지원 기록에 종속된 리소스다. 독립적인 생성/삭제 없이 저장(upsert)만 제공한다.

### 11-1. 결과 메모 저장

| 항목 | 내용 |
|---|---|
| Method | `PUT` |
| Endpoint | `/applications/:id/memo` |
| 설명 | 지원 기록의 결과 메모를 저장한다. 메모가 없으면 생성, 있으면 덮어쓴다(upsert). 빈 문자열을 전달하면 메모 내용이 비워진다. |
| 인증 | 필요 |

**Request Body:**

```json
{
  "content": "1차 면접 분위기 좋았음. 라이브 코딩(React 상태 관리) + 간단한 시스템 디자인 질문."
}
```

**성공 응답:**

| HTTP status | 반환 |
|---:|---|
| 200 | 저장된 메모 객체 |

```json
{
  "data": {
    "content": "1차 면접 분위기 좋았음. 라이브 코딩(React 상태 관리) + 간단한 시스템 디자인 질문.",
    "updatedAt": "2026-06-12T14:30:00Z"
  }
}
```

> 결과 메모의 단독 조회 API는 두지 않는다. 메모 내용은 지원 기록 상세 조회(7-3) 응답에 포함된다.

**에러:**

| HTTP status | error.code | 설명 |
|---:|---|---|
| 401 | `UNAUTHORIZED` | 인증되지 않은 요청 |
| 404 | `APPLICATION_NOT_FOUND` | 지원 기록이 존재하지 않거나 현재 사용자 소유가 아님 |

---

## 12. 대시보드 API

### 12-1. 대시보드 요약 통계 조회

| 항목 | 내용 |
|---|---|
| Method | `GET` |
| Endpoint | `/dashboard/summary` |
| 설명 | 대시보드에 필요한 통계 요약과 최근 지원 기록을 한 번에 반환한다. 대시보드 화면 진입 시 단 1회 요청으로 필요한 데이터를 모두 받을 수 있도록 설계한다. |
| 인증 | 필요 |
| 페이지네이션 | 없음 |

**성공 응답:**

| HTTP status | 반환 |
|---:|---|
| 200 | 대시보드 요약 통계 + 최근 지원 기록 |

```json
{
  "data": {
    "stats": {
      "totalCount": 8,
      "inProgressCount": 5,
      "finalPassCount": 1,
      "documentPassRate": 0.83,
      "documentPassRateAvailable": true,
      "statusDistribution": [
        { "status": "APPLIED", "count": 2 },
        { "status": "DOCUMENT_PASSED", "count": 2 },
        { "status": "INTERVIEWING", "count": 1 },
        { "status": "FINAL_PASSED", "count": 1 },
        { "status": "DOCUMENT_FAILED", "count": 1 },
        { "status": "INTERVIEW_FAILED", "count": 1 }
      ]
    },
    "recentApplications": [
      {
        "id": "app_001",
        "companyName": "토스",
        "positionTitle": "프론트엔드 엔지니어",
        "status": "INTERVIEWING",
        "appliedAt": "2026-06-10",
        "submissionFiles": {
          "count": 1,
          "label": "이력서 v3.pdf"
        }
      }
    ]
  }
}
```

**Response 필드 설명:**

| 필드 | 설명 |
|---|---|
| `stats.totalCount` | 전체 지원 기록 수 |
| `stats.inProgressCount` | 진행 중 수 (`APPLIED` + `DOCUMENT_PASSED` + `INTERVIEWING`) |
| `stats.finalPassCount` | 최종 합격 수 (`FINAL_PASSED`) |
| `stats.documentPassRate` | 서류 합격률 (0~1 범위 소수). 분모가 0이면 `null` |
| `stats.documentPassRateAvailable` | 서류 합격률 계산 가능 여부. `false`이면 "데이터 없음" 표시 |
| `stats.statusDistribution` | 전형 상태별 건수 배열. 상태 표시 순서를 보장하기 위해 array 형태로 반환한다 |
| `recentApplications` | 최근 지원 기록 목록. `appliedAt` 내림차순 N건 (건수는 화면별 UX 요구사항 문서에서 확정) |

**에러:**

| HTTP status | error.code | 설명 |
|---:|---|---|
| 401 | `UNAUTHORIZED` | 인증되지 않은 요청 |
| 500 | `INTERNAL_ERROR` | 통계 집계 실패 |

---

## 13. 필터 옵션 API

필터 UI에서 선택지를 구성하기 위한 동적 목록을 제공한다.

`GET /submission-files`와 `GET /filter-options/submission-files`는 역할이 다르다.

| API | 용도 | 포함 정보 |
|---|---|---|
| `GET /submission-files` | 제출 파일 관리 화면, 등록/수정 드로어 파일 선택 | 파일 메타데이터 전체 + `linkedApplicationCount` |
| `GET /filter-options/submission-files` | 지원 기록 필터 UI 선택지 구성 | `id`, `displayName`만 포함하는 경량 목록 |

### 13-1. 플랫폼 목록 조회

| 항목 | 내용 |
|---|---|
| Method | `GET` |
| Endpoint | `/filter-options/platforms` |
| 설명 | 사용자가 등록한 지원 기록에 존재하는 플랫폼 값의 중복 제거 목록을 반환한다. |

**성공 응답:**

| HTTP status | 반환 |
|---:|---|
| 200 | 플랫폼 문자열 배열 |

```json
{
  "data": ["원티드", "사람인", "잡코리아", "채용 홈페이지"]
}
```

**에러:**

| HTTP status | error.code | 설명 |
|---:|---|---|
| 401 | `UNAUTHORIZED` | 인증되지 않은 요청 |

---

### 13-2. 기술 스택 목록 조회

| 항목 | 내용 |
|---|---|
| Method | `GET` |
| Endpoint | `/filter-options/tech-stacks` |
| 설명 | 사용자가 등록한 지원 기록에 존재하는 기술 스택 값의 중복 제거 목록을 반환한다. |

**성공 응답:**

| HTTP status | 반환 |
|---:|---|
| 200 | 기술 스택 문자열 배열 |

```json
{
  "data": ["React", "TypeScript", "Next.js", "Vue", "JavaScript"]
}
```

**에러:**

| HTTP status | error.code | 설명 |
|---:|---|---|
| 401 | `UNAUTHORIZED` | 인증되지 않은 요청 |

---

### 13-3. 제출 파일 목록 조회 (필터용)

| 항목 | 내용 |
|---|---|
| Method | `GET` |
| Endpoint | `/filter-options/submission-files` |
| 설명 | 제출 파일 필터 선택지로 사용할 제출 파일의 `id`와 `displayName` 경량 목록을 반환한다. 파일명 검색/자동완성 등 고도화된 탐색 기능은 MVP에서 제외하며, 목록 전체를 로드해 UI에서 선택하는 방식으로 처리한다. |

**성공 응답:**

| HTTP status | 반환 |
|---:|---|
| 200 | 제출 파일 필터 옵션 배열 |

```json
{
  "data": [
    { "id": "file_001", "displayName": "이력서 v3.pdf" },
    { "id": "file_002", "displayName": "이력서 v2.pdf" },
    { "id": "file_003", "displayName": "포트폴리오 2026.pdf" }
  ]
}
```

**에러:**

| HTTP status | error.code | 설명 |
|---:|---|---|
| 401 | `UNAUTHORIZED` | 인증되지 않은 요청 |

---

## 14. 검색·필터·정렬 query 설계

### 14-1. Query Parameter 명세

`GET /applications` 에서 사용하는 전체 query parameter 조합이다.

| 파라미터 | 예시 | 설명 |
|---|---|---|
| `q` | `q=토스` | 회사명 또는 직무명 포함 검색 |
| `status` | `status=INTERVIEWING&status=DOCUMENT_PASSED` | 전형 상태 다중 선택. enum key 사용. OR 조건 |
| `platform` | `platform=원티드` | 지원 플랫폼 단일 선택 |
| `techStacks` | `techStacks=React&techStacks=TypeScript` | 기술 스택 다중 선택. AND 조건 |
| `submissionFileId` | `submissionFileId=file_001` | 특정 제출 파일이 연결된 기록 단일 선택 |
| `sort` | `sort=appliedAt_desc` | 정렬 기준 |
| `page` | `page=1` | 페이지 번호 |
| `pageSize` | `pageSize=20` | 페이지 크기 |

### 14-2. 정렬 기준 목록

| `sort` 값 | 설명 |
|---|---|
| `appliedAt_desc` | 지원일 내림차순 (기본값) |
| `appliedAt_asc` | 지원일 오름차순 |

> 현재 MVP에서는 지원일(`appliedAt`) 기준 정렬만 제공한다. 추가 정렬 기준은 후순위다.

### 14-3. URL 예시

```
GET /applications?q=프론트엔드&status=INTERVIEWING&status=DOCUMENT_PASSED&platform=원티드&techStacks=React&sort=appliedAt_desc&page=1
```

### 14-4. 필터 조합 동작 원칙

- 여러 필터를 동시에 적용하면 AND 조건으로 결합한다. (예: `status=INTERVIEWING` + `platform=원티드` → 두 조건을 모두 만족하는 기록)
- 같은 파라미터를 여러 번 지정하면 OR 조건으로 처리한다. (예: `status=INTERVIEWING&status=DOCUMENT_PASSED` → 두 상태 중 하나인 기록)
- `techStacks` 복수 지정은 AND 조건으로 처리한다. (예: `techStacks=React&techStacks=TypeScript` → 두 기술 스택을 모두 포함한 기록) 기술 스택 필터는 선택한 기술을 모두 포함하는 지원 기록을 찾는 용도다. UI에서는 사용자가 혼동하지 않도록 "선택한 기술 모두 포함" 취지의 표현이 필요하다.
- 모든 파라미터가 없으면 전체 목록을 반환한다.

---

## 15. API별 프론트엔드 사용 위치

| API | 사용 화면/시점 |
|---|---|
| `GET /applications` | 지원 기록 관리 화면 (리스트 보기, 칸반 보기 모두 동일) |
| `POST /applications` | 지원 기록 등록 드로어 저장. `submissionFileIds`로 초기 제출 파일 연결 포함 |
| `GET /applications/:id` | 지원 기록 상세 화면 진입 |
| `PATCH /applications/:id` | 지원 기록 수정 드로어 저장 (공고 정보만) |
| `DELETE /applications/:id` | 지원 기록 삭제 확인 다이얼로그 확정 |
| `PATCH /applications/:id/status` | 리스트 상태 배지 변경, 칸반 카드 내 상태 변경 액션, 상세 화면 상태 변경 |
| `PUT /applications/:id/files` | 지원 기록 수정 드로어에서 제출 파일 연결 목록 변경 저장 (기본 사용 API) |
| `POST /applications/:id/files` | 제출 파일 단건 연결 (향후 상세 화면 개별 액션용 보조 API) |
| `DELETE /applications/:applicationId/files/:submissionFileId` | 제출 파일 단건 연결 해제 (향후 상세 화면 개별 액션용 보조 API) |
| `GET /submission-files` | 제출 파일 관리 화면, 지원 기록 등록/수정 드로어 파일 선택 영역 |
| `POST /submission-files` | 제출 파일 관리 화면 업로드, 지원 기록 등록/수정 드로어 인라인 업로드 |
| `DELETE /submission-files/:id` | 제출 파일 관리 화면 삭제 |
| `GET /submission-files/:id/download-url` | 지원 기록 상세 화면 다운로드, 제출 파일 관리 화면 다운로드 |
| `PUT /applications/:id/memo` | 지원 기록 상세 화면 메모 저장 |
| `GET /dashboard/summary` | 대시보드 화면 진입 |
| `GET /filter-options/platforms` | 지원 기록 관리 화면 필터 옵션 구성 |
| `GET /filter-options/tech-stacks` | 지원 기록 관리 화면 필터 옵션 구성 |
| `GET /filter-options/submission-files` | 지원 기록 관리 화면 제출 파일 필터 옵션 구성 |

---

## 에러 코드 확정 요약

### 도메인별 error.code 전체 목록

| error.code | HTTP status | 의미 | 사용 API |
|---|---:|---|---|
| `VALIDATION_ERROR` | 400 | 일반적인 입력값 검증 실패 | GET /applications, PATCH /applications/:id |
| `REQUIRED_FIELD_MISSING` | 400 | 필수값 누락 | POST /applications, PATCH /applications/:id, POST /submission-files |
| `INVALID_STATUS` | 400 | 허용되지 않은 status enum key | GET /applications, POST /applications, PATCH /applications/:id/status |
| `INVALID_FILE_TYPE` | 400 | 허용되지 않은 fileType enum key | POST /submission-files |
| `UNSUPPORTED_FILE_FORMAT` | 400 | 지원하지 않는 파일 확장자 또는 MIME 타입 | POST /submission-files |
| `FILE_TOO_LARGE` | 400 | 파일 크기 제한 초과 | POST /submission-files |
| `UNAUTHORIZED` | 401 | 인증되지 않은 요청 | 모든 API |
| `FORBIDDEN` | 403 | 인증됐으나 리소스 소유자가 아닌 경우 | (예외적 상황) |
| `APPLICATION_NOT_FOUND` | 404 | 지원 기록을 찾을 수 없음 | GET/PATCH/DELETE /applications/:id, PATCH /applications/:id/status, POST/PUT /applications/:id/files, PUT /applications/:id/memo |
| `SUBMISSION_FILE_NOT_FOUND` | 404 | 제출 파일을 찾을 수 없음 | GET /applications, POST /applications, PUT /applications/:id/files, POST /applications/:id/files, DELETE/GET /submission-files/:id |
| `APPLICATION_FILE_LINK_NOT_FOUND` | 404 | 지원 기록-제출 파일 연결 관계를 찾을 수 없음 | DELETE /applications/:applicationId/files/:submissionFileId |
| `SUBMISSION_FILE_ALREADY_LINKED` | 409 | 이미 연결된 파일 중복 연결 시도 | POST /applications/:id/files |
| `SUBMISSION_FILE_IN_USE` | 409 | 연결된 지원 기록이 있어 파일 삭제 불가 | DELETE /submission-files/:id |
| `INTERNAL_ERROR` | 500 | 서버 내부 오류 | GET /dashboard/summary |

### 응답/에러 명세 확정 요약

**성공 응답 HTTP status 기준:**
- `201`: POST /applications, POST /applications/:id/files, POST /submission-files (생성 API)
- `204`: DELETE /applications/:id, DELETE /applications/:applicationId/files/:submissionFileId, DELETE /submission-files/:id (삭제 API, 본문 없음)
- `200`: 그 외 모든 조회/수정 API

**에러 표 형식 통일:** 모든 API별 에러 표는 `HTTP status / error.code / 설명` 3열 구조로 통일됐다.

**UNAUTHORIZED 공통 포함:** 모든 인증 필요 API의 에러 표에 `401 UNAUTHORIZED`가 포함됐다.

**기존 넓은 코드 세분화:**
- `NOT_FOUND` → `APPLICATION_NOT_FOUND`, `SUBMISSION_FILE_NOT_FOUND`, `APPLICATION_FILE_LINK_NOT_FOUND`
- `CONFLICT` → `SUBMISSION_FILE_ALREADY_LINKED`, `SUBMISSION_FILE_IN_USE`
- `VALIDATION_ERROR` → `REQUIRED_FIELD_MISSING`, `INVALID_STATUS`, `INVALID_FILE_TYPE`, `UNSUPPORTED_FILE_FORMAT`, `FILE_TOO_LARGE`로 세분화 (일반 validation은 `VALIDATION_ERROR` 유지)
