# Synply Frontend Code Convention

> 대상: Synply MVP 프론트엔드  
> 스택: Next.js App Router + React + TypeScript + Tailwind CSS + TanStack Query + React Hook Form + Zod  
> 목적: REST API 계약 기반 프론트엔드 구현, 플랫폼별 UI 분기, 디자인 토큰 기반 UI 구현을 일관되게 유지한다.

---

## 0. 기본 원칙

Synply 프론트엔드는 다음 원칙을 따른다.

- `app/`은 라우팅과 레이아웃 중심으로 얇게 유지한다.
- 실제 기능 코드는 `features/`에 둔다.
- 공유 UI는 `components/`에 둔다.
- 도메인 상수, selector, formatter, mapper는 `lib/`에 둔다.
- 컴포넌트에서 `fetch`를 직접 호출하지 않는다.
- 서비스 데이터는 Express REST API를 통해 호출한다.
- 로그인/회원가입은 Supabase Auth SDK를 사용한다.
- DB 컬럼명은 프론트로 끌고 오지 않는다.
- API/프론트 타입은 `camelCase`를 사용한다.
- enum key는 `UPPER_SNAKE_CASE`를 사용한다.
- 디자인 토큰을 단일 진실 소스로 사용한다.
- 플랫폼별로 화면 구조가 다르면 `view.desktop.tsx` / `view.mobile.tsx`로 분리한다.
- MVP에서는 Zustand를 사용하지 않는다. 전역 클라이언트 상태가 복잡해질 경우 후순위로 도입한다.

---

## 1. 폴더 구조

```txt
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (main)/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── applications/
│   │   │   └── page.tsx
│   │   └── submission-files/
│   │       └── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── features/
│   ├── auth/
│   ├── applications/
│   ├── submission-files/
│   ├── dashboard/
│   └── filter-options/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── shells/
│   └── feedback/
├── lib/
│   ├── api/
│   ├── constants/
│   ├── domain/
│   ├── mappers/
│   ├── query/
│   ├── selectors/
│   ├── supabase/
│   └── utils/
├── hooks/
└── types/
```

### 1-1. `app/`

Next.js App Router의 라우트, 레이아웃, 전역 CSS만 둔다.

- `page.tsx`는 가능하면 얇게 유지한다.
- 라우트별 실제 UI/상태/데이터 처리는 feature의 화면 컨테이너에 위임한다.
- `page.tsx`, `layout.tsx`는 Next.js 규칙에 따라 `default export`를 사용한다.
- 그 외 컴포넌트는 `named export`를 사용한다.

예시:

```tsx
// src/app/(main)/applications/page.tsx
import { ApplicationsScreen } from '@/features/applications/screens/ApplicationsScreen';

export default function ApplicationsPage() {
  return <ApplicationsScreen />;
}
```

### 1-2. `features/`

도메인 기능 단위 코드를 둔다.

```txt
features/applications/
├── api/
│   └── applications.api.ts
├── hooks/
│   ├── useApplicationsQuery.ts
│   ├── useApplicationDetailQuery.ts
│   ├── useCreateApplicationMutation.ts
│   ├── useUpdateApplicationMutation.ts
│   ├── useDeleteApplicationMutation.ts
│   └── useUpdateApplicationStatusMutation.ts
├── screens/
│   └── ApplicationsScreen/
│       ├── index.tsx
│       ├── view.desktop.tsx
│       └── view.mobile.tsx
├── components/
│   ├── ApplicationCard.tsx
│   ├── ApplicationTable.tsx
│   ├── ApplicationForm.tsx
│   ├── ApplicationDrawer.tsx
│   ├── ApplicationSheet.tsx
│   ├── ApplicationFilters.tsx
│   └── ApplicationStatusBadge.tsx
├── schemas/
│   └── application.schema.ts
├── types/
│   └── application.types.ts
└── utils/
    └── application.mapper.ts
```

역할:

| 폴더 | 역할 |
|---|---|
| `api/` | Express REST API 호출 함수 |
| `hooks/` | TanStack Query query/mutation hook |
| `screens/` | 화면 단위 컨테이너 및 플랫폼별 view |
| `components/` | feature 전용 UI 컴포넌트 |
| `schemas/` | Zod schema |
| `types/` | feature 전용 TypeScript 타입 |
| `utils/` | feature 전용 mapper/formatter |

### 1-3. `components/`

여러 feature에서 공유하는 UI를 둔다.

```txt
components/
├── ui/
│   ├── Button/
│   ├── Input/
│   ├── SearchInput/
│   ├── FilterChip/
│   ├── TechTag/
│   ├── StatusBadge/
│   ├── StatCard/
│   ├── DistributionBar/
│   ├── EmptyState/
│   └── ResumeFileChip/
├── shells/
│   ├── DesktopShell.tsx
│   └── MobileShell.tsx
├── layout/
│   ├── DesktopDrawer.tsx
│   ├── MobileSheet.tsx
│   └── PageHeader.tsx
└── feedback/
    ├── ConfirmDialog.tsx
    ├── BlockedDialog.tsx
    └── Toast.tsx
```

### 1-4. `lib/`

도메인 전역 로직과 공통 유틸을 둔다.

```txt
lib/
├── api/
│   ├── apiClient.ts
│   ├── ApiError.ts
│   └── authToken.ts
├── constants/
│   ├── applicationStatus.ts
│   └── fileType.ts
├── domain/
│   ├── application.ts
│   └── submissionFile.ts
├── mappers/
│   ├── application.mapper.ts
│   └── submissionFile.mapper.ts
├── query/
│   ├── queryClient.ts
│   └── queryKeys.ts
├── selectors/
│   ├── applicationStats.selector.ts
│   └── dashboard.selector.ts
├── supabase/
│   └── authClient.ts
└── utils/
    ├── cn.ts
    ├── date.ts
    └── format.ts
```

---

## 2. 파일 네이밍

| 종류 | 규칙 | 예시 |
|---|---|---|
| 폴더 | kebab-case 또는 도메인 단위 폴더명으로 통일 | `submission-files/`, `application-detail/` |
| 컴포넌트 파일 | PascalCase | `StatusBadge.tsx`, `DesktopShell.tsx` |
| 화면 컨테이너 | `index.tsx` | `ApplicationsScreen/index.tsx` |
| 플랫폼 뷰 | `view.desktop.tsx`, `view.mobile.tsx` | `ApplicationsScreen/view.desktop.tsx` |
| hook | camelCase + `use` 접두 | `useApplicationsQuery.ts` |
| API 함수 파일 | `<domain>.api.ts` | `applications.api.ts` |
| schema 파일 | `<domain>.schema.ts` | `application.schema.ts` |
| 타입 파일 | `*.types.ts` | `application.types.ts` |
| 유틸/selector | camelCase 또는 역할명 | `selectors.ts`, `application.mapper.ts` |
| CSS Module | `<Component>.module.css` | `StatusBadge.module.css` |

상대경로가 깊어지는 import는 금지한다.

```txt
금지: ../../../components/ui/Button
권장: @/components/ui/Button
```

---

## 3. Import / Export 컨벤션

### 3-1. Export

- `page.tsx`, `layout.tsx`만 `default export`를 사용한다.
- 나머지 컴포넌트, hook, util은 `named export`를 사용한다.
- `React.FC`는 사용하지 않는다.

```tsx
export interface StatusBadgeProps {
  status: ApplicationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span>{status}</span>;
}
```

### 3-2. Import 순서

```tsx
// 1. external
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. internal absolute
import { Button } from '@/components/ui/Button';
import { queryKeys } from '@/lib/query/queryKeys';

// 3. same feature relative
import { ApplicationCard } from './ApplicationCard';
```

그룹 사이에는 빈 줄을 둔다.

### 3-3. Type import

타입은 `import type`을 사용한다.

```ts
import type { ApplicationStatus } from '@/features/applications/types/application.types';
```

---

## 4. Server Component / Client Component 경계

기본은 Server Component로 둔다.  
상호작용이 필요한 컨테이너, 화면 셸, 폼, 모달, 필터 UI에서만 `"use client"`를 사용한다.

`"use client"`가 필요한 경우:

- `useState`
- `useEffect`
- `useSearchParams`
- TanStack Query hook
- React Hook Form
- 이벤트 핸들러
- matchMedia/window 접근
- 드로어/모달/시트
- 필터 UI
- 파일 업로드 UI

권장 패턴:

```tsx
// app/(main)/applications/page.tsx
import { ApplicationsScreen } from '@/features/applications/screens/ApplicationsScreen';

export default function ApplicationsPage() {
  return <ApplicationsScreen />;
}
```

```tsx
// features/applications/screens/ApplicationsScreen/index.tsx
'use client';

import { usePlatform } from '@/hooks/usePlatform';

import { ApplicationsDesktopView } from './view.desktop';
import { ApplicationsMobileView } from './view.mobile';

export function ApplicationsScreen() {
  const platform = usePlatform();

  if (platform === null) {
    return <ApplicationsScreenSkeleton />;
  }

  if (platform === 'desktop') {
    return <ApplicationsDesktopView />;
  }

  return <ApplicationsMobileView />;
}
```

잎 컴포넌트인 `StatusBadge`, `Button`, `TechTag` 등에 불필요하게 `"use client"`를 붙이지 않는다.

---

## 5. 플랫폼 분기 컨벤션

Synply는 단순 반응형 재배치가 아니라 플랫폼별 UI 구조가 달라지는 화면이 있다.

| 기능 | Desktop | Mobile |
|---|---|---|
| 앱 셸 | 좌측 사이드바 | 상단 헤더 + 하단 탭바 + FAB |
| 지원 목록 | 표 | 카드 리스트 |
| 칸반 | 6컬럼 보드 | 상태 필터 칩 + 단일 컬럼 |
| 등록/수정 | 우측 드로어 | 풀스크린/바텀 시트 |
| 필터 | 인라인 툴바 | 바텀시트 |

### 5-1. 화면 구조

화면은 다음 구조를 따른다.

```txt
screen container
├── view.desktop.tsx
└── view.mobile.tsx
```

컨테이너가 데이터, 상태, event handler를 관리하고, 플랫폼 view는 props로 받은 데이터를 렌더링한다.

```txt
컨테이너: 데이터/상태/핸들러
desktop view: 데스크탑 마크업
mobile view: 모바일 마크업
shared leaf components: Button, StatusBadge, Input 등
```

### 5-2. `usePlatform`

- 단일 `usePlatform()` hook을 사용한다.
- 기준 폭은 약 768px이다.
- 첫 렌더에서는 `null`을 반환해 하이드레이션 mismatch를 방지한다.
- `useEffect`에서 `matchMedia`를 구독해 확정한다.
- `null` 상태에서는 skeleton 또는 shell placeholder만 렌더링한다.

반환 타입:

```ts
export type Platform = 'desktop' | 'mobile';

export function usePlatform(): Platform | null;
```

---

## 6. API 호출 컨벤션

프론트는 Supabase DB/Storage에 직접 접근하지 않는다.

```txt
로그인/회원가입:
Frontend → Supabase Auth SDK

서비스 데이터:
Frontend → Express REST API → Supabase DB/Storage
```

### 6-1. API 호출 계층

컴포넌트에서 직접 `fetch`하지 않는다.

```txt
Component
→ feature hook
→ feature api function
→ apiClient
→ Express REST API
```

예시:

```ts
// features/applications/api/applications.api.ts
import { apiClient } from '@/lib/api/apiClient';

import type {
  ApplicationListParams,
  ApplicationListResponse,
} from '../types/application.types';

export async function fetchApplications(
  params: ApplicationListParams,
): Promise<ApplicationListResponse> {
  return apiClient.get('/applications', { params });
}
```

### 6-2. Auth token

- 로그인/회원가입은 Supabase Auth SDK로 처리한다.
- 로그인 후 access token을 가져온다.
- `apiClient`는 Express REST API 요청의 `Authorization` header에 token을 포함한다.

```txt
Authorization: Bearer <supabase_access_token>
```

### 6-3. FormData

파일 업로드는 `multipart/form-data`를 사용한다.  
`FormData` 요청에서는 `Content-Type`을 직접 지정하지 않는다.

---

## 7. TanStack Query 컨벤션

### 7-1. query key

query key는 `lib/query/queryKeys.ts`에서 중앙 관리한다.

```ts
export const queryKeys = {
  applications: {
    all: ['applications'] as const,
    lists: () => [...queryKeys.applications.all, 'list'] as const,
    list: (filters: NormalizedApplicationFilters) =>
      [...queryKeys.applications.lists(), filters] as const,
    detail: (id: string) =>
      [...queryKeys.applications.all, 'detail', id] as const,
  },
  submissionFiles: {
    all: ['submissionFiles'] as const,
    list: () => [...queryKeys.submissionFiles.all, 'list'] as const,
  },
  dashboard: {
    summary: () => ['dashboard', 'summary'] as const,
  },
  filterOptions: {
    platforms: () => ['filterOptions', 'platforms'] as const,
    techStacks: () => ['filterOptions', 'techStacks'] as const,
    submissionFiles: () => ['filterOptions', 'submissionFiles'] as const,
  },
};
```

### 7-2. Feature hook

컴포넌트에서 `useQuery` / `useMutation`을 직접 쓰지 않고, feature hook으로 감싼다.

```ts
export function useApplicationsQuery(filters: ApplicationListParams) {
  const normalizedFilters = normalizeApplicationFilters(filters);

  return useQuery({
    queryKey: queryKeys.applications.list(normalizedFilters),
    queryFn: () => fetchApplications(normalizedFilters),
  });
}
```

### 7-3. Mutation 이름

```txt
useCreateApplicationMutation
useUpdateApplicationMutation
useDeleteApplicationMutation
useUpdateApplicationStatusMutation
useUploadSubmissionFileMutation
useDeleteSubmissionFileMutation
```

### 7-4. Optimistic update

MVP에서 optimistic update는 전형 상태 변경에만 적용한다.

- 상태 변경: optimistic update 적용
- 지원 기록 생성/수정/삭제: optimistic update 미적용
- 제출 파일 업로드/삭제: optimistic update 미적용
- 파일 연결 변경: optimistic update 미적용

### 7-5. 로그아웃

로그아웃 시 `queryClient.clear()`로 이전 사용자 캐시를 제거한다.

---

## 8. 상태 관리 컨벤션

### 8-1. 상태 분류

| 상태 종류 | 관리 방식 |
|---|---|
| 서버 상태 | TanStack Query |
| 폼 상태 | React Hook Form |
| 검증 | Zod |
| URL 상태 | search params |
| 드로어/모달/시트 | `useState` |
| 파일 업로드 UI 상태 | `useState` 또는 RHF |
| 플랫폼 분기 | `usePlatform` |
| 전역 client state | MVP에서는 사용하지 않음 |

### 8-2. Zustand

MVP에서는 Zustand를 사용하지 않는다.

후순위 도입 조건:

- 전역 토스트 큐가 복잡해질 때
- 전역 모달/confirm 관리가 필요할 때
- 여러 feature가 공유하는 클라이언트 상태가 생길 때
- 페이지를 넘나들며 유지해야 하는 임시 작업 상태가 생길 때

---

## 9. Form / Validation 컨벤션

폼은 React Hook Form + Zod를 사용한다.

```txt
schema: features/<domain>/schemas
form component: feature/components
submit 처리: drawer/sheet/container
```

### 9-1. Form 역할 분리

`ApplicationForm`은 입력 UI와 validation error 표시만 담당한다.

`ApplicationDrawer` / `ApplicationSheet` / 화면 컨테이너가 다음을 담당한다.

- create/update 모드 판단
- defaultValues 주입
- mutation 호출
- 성공 후 닫기
- 실패 시 에러 표시

### 9-2. Zod schema

```ts
export const applicationFormSchema = z.object({
  companyName: z.string().min(1, '회사명을 입력해 주세요.'),
  positionTitle: z.string().min(1, '직무명을 입력해 주세요.'),
  postingUrl: z.string().url().optional().or(z.literal('')),
  deadlineDate: z.string().optional(),
  platform: z.string().optional(),
  techStacks: z.array(z.string()),
  status: applicationStatusSchema,
  appliedAt: z.string().optional(),
  submissionFileIds: z.array(z.string()),
});
```

---

## 10. 타입 컨벤션

### 10-1. API / Frontend 타입

API와 프론트엔드 타입은 `camelCase`를 사용한다.

```ts
export type Application = {
  id: string;
  companyName: string;
  positionTitle: string;
  postingUrl?: string;
  deadlineDate?: string;
  status: ApplicationStatus;
  platform?: string;
  techStacks: string[];
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
};
```

DB 컬럼명은 프론트 타입에 사용하지 않는다.

```txt
DB: deadline_date, size_bytes
API/FE: deadlineDate, sizeBytes
```

### 10-2. enum-like constant

TypeScript `enum`보다 `as const` 객체를 사용한다.

```ts
export const APPLICATION_STATUS = {
  APPLIED: 'APPLIED',
  DOCUMENT_PASSED: 'DOCUMENT_PASSED',
  INTERVIEWING: 'INTERVIEWING',
  FINAL_PASSED: 'FINAL_PASSED',
  DOCUMENT_FAILED: 'DOCUMENT_FAILED',
  INTERVIEW_FAILED: 'INTERVIEW_FAILED',
} as const;

export type ApplicationStatus =
  (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];
```

### 10-3. 상태 메타 단일 소스

상태 라벨, 배지 색, 차트 색, 서류 합격률 계산 포함 여부는 `STATUS_CONFIG` 하나로 관리한다.

```ts
export type StatusMeta = {
  label: string;
  badgeClassName: string;
  chartColorVar: string;
  includedInDocumentPassRateNumerator: boolean;
  includedInDocumentPassRateDenominator: boolean;
};

export const STATUS_CONFIG: Record<ApplicationStatus, StatusMeta> = {
  APPLIED: {
    label: '지원 완료',
    badgeClassName: 'applied',
    chartColorVar: 'var(--ink-400)',
    includedInDocumentPassRateNumerator: false,
    includedInDocumentPassRateDenominator: false,
  },
  DOCUMENT_PASSED: {
    label: '서류 합격',
    badgeClassName: 'documentPassed',
    chartColorVar: 'var(--info-500)',
    includedInDocumentPassRateNumerator: true,
    includedInDocumentPassRateDenominator: true,
  },
  INTERVIEWING: {
    label: '면접 중',
    badgeClassName: 'interviewing',
    chartColorVar: 'var(--brand)',
    includedInDocumentPassRateNumerator: true,
    includedInDocumentPassRateDenominator: true,
  },
  FINAL_PASSED: {
    label: '최종 합격',
    badgeClassName: 'finalPassed',
    chartColorVar: 'var(--success-500)',
    includedInDocumentPassRateNumerator: true,
    includedInDocumentPassRateDenominator: true,
  },
  DOCUMENT_FAILED: {
    label: '서류 불합격',
    badgeClassName: 'documentFailed',
    chartColorVar: 'var(--danger-500)',
    includedInDocumentPassRateNumerator: false,
    includedInDocumentPassRateDenominator: false,
  },
  INTERVIEW_FAILED: {
    label: '면접 불합격',
    badgeClassName: 'interviewFailed',
    chartColorVar: 'var(--danger-deep)',
    includedInDocumentPassRateNumerator: true,
    includedInDocumentPassRateDenominator: true,
  },
};
```

---

## 11. Selector / Domain Logic 컨벤션

통계 계산, 필터링, 상태별 집계는 UI 컴포넌트 안에서 직접 계산하지 않는다.  
순수 함수 selector로 분리한다.

```ts
export function getDocumentPassRate(
  applications: Application[],
): number | null {
  const numerator = applications.filter((application) => {
    return STATUS_CONFIG[application.status].includedInDocumentPassRateNumerator;
  }).length;

  const denominator = applications.filter((application) => {
    return STATUS_CONFIG[application.status].includedInDocumentPassRateDenominator;
  }).length;

  if (denominator === 0) {
    return null;
  }

  return numerator / denominator;
}
```

주의:

- 실제 서비스에서는 대시보드 통계는 서버에서 계산한다.
- 목 UI 또는 프론트 시안에서는 selector로 동일한 규칙을 재현할 수 있다.
- selector는 테스트 가능해야 한다.

---

## 12. 스타일 컨벤션

Synply UI는 CSS Modules + 디자인 토큰을 사용한다.

### 12-1. 기본 원칙

- 색, 간격, 서체, 그림자, radius는 `var(--token)`을 사용한다.
- hex 하드코딩 금지.
- 컴포넌트 스타일은 CSS Module에 둔다.
- 글로벌 CSS는 token import와 최소 reset만 둔다.
- 인라인 style은 동적 CSS 변수 주입이 필요한 경우에만 허용한다.

```css
.badge {
  border-radius: var(--radius-pill);
  font-weight: 700;
  font-size: 12px;
}

.interviewing {
  background: var(--brand-subtle);
  color: var(--violet-700);
}
```

### 12-2. 동적 색상

JS에서 hex 문자열을 들고 다니지 않는다.

허용:

```tsx
<div style={{ '--bar-color': 'var(--brand)' } as React.CSSProperties} />
```

금지:

```tsx
<div style={{ backgroundColor: '#5B2EE5' }} />
```

### 12-3. 폰트

- `--font-body`: 기본 본문, 한글/영문
- `--font-mono`: 영문/숫자/날짜/eyebrow만 사용. 한글 금지
- `--font-display`: 워드마크, 통계 큰 숫자에만 사용. 작은 본문 금지

### 12-4. Primary 버튼

한 화면에 Primary 버튼은 하나만 둔다.  
나머지 주요하지 않은 액션은 Secondary, Ghost, Danger로 분리한다.

---

## 13. UI Primitive 컨벤션

공유 UI primitive는 플랫폼에 종속되지 않아야 한다.

대상:

```txt
Button
Input
SearchInput
FilterChip
TechTag
StatusBadge
ViewToggle
StatCard
DistributionBar
EmptyState
Avatar
ResumeFileChip
ConfirmDialog
BlockedDialog
```

규칙:

- 도메인 로직을 직접 갖지 않는다.
- 도메인 값이 필요한 경우 config를 주입받거나 도메인 wrapper를 따로 둔다.
- CSS Module과 token만 사용한다.
- variant/size/status는 명확한 union 타입으로 정의한다.

예시:

```tsx
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
}: ButtonProps) {
  return (
    <button
      className={cn(styles.button, styles[variant], styles[size])}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

---

## 14. 화면 구현 컨벤션

### 14-1. 화면 컨테이너

각 화면은 컨테이너 하나와 플랫폼 view 두 개로 구성한다.

```txt
DashboardScreen/
├── index.tsx
├── view.desktop.tsx
└── view.mobile.tsx
```

컨테이너 역할:

- query hook 호출
- URL search params 해석
- local UI state 관리
- drawer/sheet/dialog open 상태 관리
- event handler 생성
- desktop/mobile view 선택

view 역할:

- 플랫폼별 layout 렌더링
- props 기반 표시
- 비즈니스 로직 최소화

### 14-2. 화면별 분리 기준

| 화면 | Desktop | Mobile | 분리 방식 |
|---|---|---|---|
| Dashboard | 통계 4카드 + 분포 + 최근 5건 | 통계 2x2 + 분포 + 최근 3건 | view 분리 |
| Applications List | 표 | 카드 리스트 | view 분리 |
| Applications Kanban | 6컬럼 보드 | 상태 필터 칩 + 단일 컬럼 | view 분리 |
| Application Detail | 2단 그리드 | 단일 컬럼 | view 분리 |
| Submission Files | 표 + 인라인 업로드 | 카드 + 업로드 영역 | view 분리 |
| Application Form | DesktopDrawer | MobileSheet | shell만 분리, form 공유 |
| Filters | 인라인 툴바 | BottomSheet | wrapper 분리, 필터 본문 공유 |
| Dialog | 중앙 모달 | 중앙 모달 | 공용 |

---

## 15. 접근성 / 상호작용 컨벤션

- 모든 button은 실제 `<button>`을 사용한다.
- 클릭 가능한 div를 만들지 않는다.
- dialog/sheet/drawer는 focus trap, ESC 닫기, backdrop 클릭 정책을 명확히 한다.
- form input은 label과 연결한다.
- error message는 input과 연결한다.
- focus ring은 `var(--focus-ring)`을 사용한다.
- disabled 상태는 시각적으로만 표현하지 않고 실제 `disabled` 속성을 사용한다.
- FAB 축소/확장, 마스코트 float 등 motion은 `prefers-reduced-motion`을 고려한다.

---

## 16. 테스트 컨벤션

테스트 우선순위:

```txt
1. selector/domain logic
2. mapper
3. apiClient error handling
4. React Query hook invalidation
5. 주요 form validation
```

도구:

```txt
Vitest
React Testing Library
@testing-library/jest-dom
jsdom
```

파일명:

```txt
*.test.ts
*.test.tsx
```

테스트 예시:

```txt
applicationStats.selector.test.ts
application.mapper.test.ts
apiClient.test.ts
ApplicationForm.test.tsx
```

---

## 17. Lint / Format

- ESLint
- Prettier
- TypeScript strict mode
- import/order 권장
- 저장 시 미사용 import 제거
- path alias 사용
- `../../` 깊은 상대경로 지양
- TSX/CSS 내 hex 하드코딩 금지 룰 검토

권장 `tsconfig`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "verbatimModuleSyntax": true
  }
}
```

---

## 18. PR 전 체크리스트

- [ ] `app/`은 라우팅 중심으로 얇게 유지했는가?
- [ ] 기능 코드는 `features/`에 배치했는가?
- [ ] 컴포넌트에서 `fetch`를 직접 호출하지 않았는가?
- [ ] API 호출이 `feature/api` → `apiClient`를 거치는가?
- [ ] React Query hook을 feature hook으로 감쌌는가?
- [ ] DB snake_case가 프론트 타입으로 넘어오지 않았는가?
- [ ] API/FE 타입은 camelCase인가?
- [ ] enum key는 UPPER_SNAKE_CASE인가?
- [ ] 상태 색/라벨/합격률 규칙은 `STATUS_CONFIG` 한 곳에서만 관리되는가?
- [ ] 서류 합격률 공식은 확정 규칙과 일치하는가?
- [ ] 색/간격/서체/그림자/radius는 `var(--token)`을 사용하는가?
- [ ] hex 하드코딩이 없는가?
- [ ] IBM Plex Mono에 한글을 사용하지 않았는가?
- [ ] Do Hyeon은 워드마크/통계 큰 숫자에만 사용했는가?
- [ ] 한 화면에 Primary 버튼은 하나만 있는가?
- [ ] `"use client"`는 필요한 컨테이너/셸/인터랙션 컴포넌트에만 있는가?
- [ ] `page.tsx`/`layout.tsx`를 제외하고 named export를 사용했는가?
- [ ] `React.FC`를 사용하지 않았는가?
- [ ] 깊은 상대경로 대신 `@/` alias를 사용했는가?
- [ ] Desktop/Mobile 화면 구조가 필요한 곳에서 `view.desktop.tsx` / `view.mobile.tsx`로 분리되었는가?
- [ ] Dialog/Sheet/Drawer 접근성을 고려했는가?
- [ ] 로그아웃 시 React Query 캐시 clear 정책이 있는가?
- [ ] FormData 요청에서 Content-Type을 수동으로 지정하지 않았는가?
