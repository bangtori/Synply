# Synply 정적 UI 구현 계획 (데스크탑)

> 목적: 디자인 시안(`docs/design_draft`) 기반 **데스크탑 정적 UI** 구현 계획.
> 관련 문서: 코드 컨벤션 `docs/Synply_Frontend_Code_Convention.md`, UI 시안 개요 `docs/IMPLEMENTATION_PLAN.md`, 시안 핸드오프 `docs/design_draft/README.md`.

## 1. 배경 (Context)

Phase 0 셋업(폴더 골격·디자인 토큰·Tailwind `@theme`·라우트 6개)이 완료된 상태에서 시작한다.

- **역할 분담**: 정적 UI(컴포넌트·화면·목 데이터 렌더)는 구현하고, 데이터 fetch/검증/저장 등 **기능 로직은 사용자가 직접** 구현한다.
- 시안은 데스크탑 9프레임 + 모바일 10화면이며, 잎(leaf) 컴포넌트·목 데이터·상태맵은 양 플랫폼 100% 동일하다. **데스크탑을 먼저** 끝까지 구현하고 모바일은 다음 단계로 미룬다(공유 프리미티브는 그대로 재사용).

## 2. 확정된 범위

| 항목      | 결정                                                                                                                                                                    |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 플랫폼    | **데스크탑 먼저** (모바일 셸/뷰·`usePlatform`은 다음 단계)                                                                                                              |
| 상호작용  | **표현용 `useState`까지만** — 드로어/다이얼로그 open·close, 리스트↔칸반 토글, 필터 칩 selected, 상태 선택. URL 동기화(`?view` 등)·실제 필터링·submit·Zod 검증·저장·삭제 로직·optimistic update는 전부 제외(사용자 몫) |
| 데이터    | 전부 **목 데이터**(시안 `<script data-dc-script>` 값 그대로). TanStack Query/`<Providers>`는 데이터 연동 시점에 도입 → 지금 미사용                                      |
| 인증 화면 | login/signup은 시안 누락 → **추후**. 이번 범위 제외                                                                                                                     |

## 3. 데이터 흐름 (정적 단계 → 추후 전환 무리 없음)

```
page.tsx (thin) → XxxScreen.tsx (컨테이너: 목 데이터 import + 표현용 useState)
                → XxxScreen.desktop.tsx (props 받아 렌더)
                → 공유 프리미티브 (components/ui)
```

컨테이너가 지금은 `lib/mock`에서 직접 import하지만, 추후 `hooks → services → apiClient`로 교체하면 뷰는 그대로 유지된다. `*.mobile.tsx` + `usePlatform` 분기는 모바일 단계에서 추가한다.

---

## 4. Phase A — 도메인/목 데이터 토대

상태맵·합격률 공식은 **단일 소스**로 두고 UI에 중복하지 않는다(컨벤션 §10-3, §11).

- `constants/applicationStatus.ts`
  - `APPLICATION_STATUS` (`as const`) + `ApplicationStatus` 유니온 (키는 UPPER_SNAKE_CASE).
  - `STATUS_CONFIG: Record<ApplicationStatus, StatusMeta>` — `label`, `badgeClassName`(Tailwind, 컨벤션 §10-3 초안), `chartColorVar`, `includedInDocumentPassRate{Numerator,Denominator}`.
  - **라벨은 시안과 일치**(공백 없음): 지원완료 / 서류합격 / 면접중 / 최종합격 / 서류불합격 / 면접불합격.
  - `chartColorVar`는 시안 bar 색을 토큰으로: 지원완료 `var(--ink-300)`, 서류합격 `var(--info-500)`, 면접중 `var(--brand)`, 최종합격 `var(--success-500)`, 서류불합격 `var(--danger-500)`, 면접불합격 `var(--danger-deep)`. (badge 클래스 `bg-danger-deep` 등은 Phase 0 `@theme`에 이미 존재)
- `constants/fileType.ts` — 파일 관련 상수(필요 최소).
- `types/application.ts`, `types/submissionFile.ts` — `Application`, `SubmissionFile`(camelCase: companyName, positionTitle, status, platform, techStacks, appliedAt, 이력서 연결 등).
- `lib/mock/` (임시 스캐폴딩 데이터, 실제 API 도입 시 제거) — 시안 목 데이터 그대로:
  - `applications.ts`: 8건 (토스 / 당근마켓 / 네이버 / 카카오 / 우아한형제들 / 라인 / 쿠팡 / 무신사).
  - `submissionFiles.ts`: 4건 (이력서 v3/v2/v1 연결됨, v3-디자인 미연결).
- `lib/selectors/` (순수 함수, 테스트 가능 — 컨벤션 §11):
  - `applicationStats.ts`: total / active / finalPassCount / **documentPassRate(분모 제외 규칙: 지원완료·서류불합격 제외, 분모 0이면 null)**.
  - `statusDistribution.ts`(분포 바·범례), `kanbanColumns.ts`(6컬럼), `recentApplications.ts`(상위 N건).

## 5. Phase B — 공유 UI 프리미티브 (`components/ui`, `components/feedback`)

디자인 시스템 스펙(`Synply 디자인 시스템.dc.html` 03섹션)의 상태를 그대로 매핑. 전부 Tailwind+토큰, named export, union 타입 props, 도메인 로직 없음(컨벤션 §13).

- `utils/cn.ts` — 조건부 클래스 합성(외부 의존성 없이 truthy join. 추후 필요 시 clsx/tailwind-merge 검토).
- `components/ui/`: `Button`(primary/secondary/ghost/danger × size, hover/pressed/disabled), `Input` + `SearchInput`(default/focus/filled/error/disabled), `StatusBadge`(STATUS_CONFIG 주입), `FilterChip`(default/active/selected/removable), `TechTag`(readonly/removable), `ViewToggle`(리스트↔칸반 segmented), `StatCard`(라벨 Mono / 숫자 Do Hyeon 42px), `DistributionBar`(세그먼트 바 + 범례, 색은 `style`로 CSS 변수 주입 §12-2), `EmptyState`(마스코트 float / 검색 아이콘 2종), `Avatar`(초성 배지), `ResumeFileChip`(connected/missing 점선).
- `components/feedback/`: `ConfirmDialog`, `BlockedDialog`(scrim + 중앙 모달, 기본 접근성 `<button>`·ESC·backdrop까지. **focus trap 고도화는 제외**).
- **검증 아티팩트(권장)**: 임시 `app/design-system/page.tsx`에 모든 프리미티브 상태를 나열 → 토큰/색/폰트 시각 검수(시안 스펙 시트와 1:1 대조). 구현 완료 후 제거 가능.

## 6. Phase C — 데스크탑 셸 + 페이지 헤더

- `components/shells/DesktopShell.tsx`: 240px 사이드바(로고+워드마크 / nav 3개 active·default / 하단 사용자) + `<main>`. nav는 Next `<Link>`, active는 현재 경로 기준(`--brand-subtle` 배경 + `--violet-700` 700).
- `components/layout/PageHeader.tsx`: eyebrow(Mono CAPS) + 타이틀(Noto 800 27px) 좌 / 주 액션 우(한 화면 Primary 1개).
- `app/(main)/layout.tsx`: children을 `DesktopShell`로 감싼다(지금은 데스크탑 고정, 모바일 단계에서 `usePlatform` 분기 추가).
- **에셋 의존**: 로고 `tori-dice-cutout.png` · 마스코트 `tori-face-cutout.png`는 사용자가 `frontend/public/`에 추가. 도착 전엔 워드마크 텍스트/placeholder로 진행.

## 7. Phase D — 데스크탑 화면 (컨테이너 + `*.desktop.tsx`, 각 route `_components/`)

공유 많은 화면 → 분기 큰 화면 순. 각 화면은 컨테이너(목 데이터 + 표현용 state) + 데스크탑 뷰.

1. **대시보드** `app/(main)/dashboard/_components/` — StatCard×4 + DistributionBar(+범례) + 최근 5건.
2. **지원 리스트** `applications/_components/` — 검색/필터 툴바(SearchInput·FilterChip·정렬·ViewToggle) + 표 6열(회사·직무 / 상태 / 플랫폼 / 스택 / 지원일 / 이력서, 미연결 점선) + "전체 N건". **`useState`로만** 칸반과 토글 — `?view` URL 동기화는 제외(추후 기능 단계에서 직접).
3. **칸반** (같은 route) — 6컬럼 보드 + 컬럼별 개수 + 카드 내 "상태 변경"(드래그 없음).
4. **지원 상세** `applications/[id]/_components/` — 2단 그리드(1.6fr/1fr): 상태 선택 칩 + 공고 정보 + 연결 이력서 + 결과 메모 / 기록 정보.
5. **이력서 관리** `submission-files/_components/` — 인라인 업로드 영역(진행률% 없음) + 파일 표(연결됨/미연결, 연결 파일 삭제 차단 🔒).
6. **등록/수정 드로어** — 우측 540px `ApplicationDrawer` + 공유 `ApplicationForm`. **정적 UI 중심**: 입력 필드·기본값·모드별 차이(등록=빈 값·기본 "지원완료"·푸터 "등록" / 수정=기존 값·"연결 해제"·푸터 "저장")까지 구현. 등록 버튼 → `useState`로 open. **실제 submit·Zod validation 연결·저장 로직 제외**, error 상태 UI는 필요 시 표시용 샘플로만.
7. **필터(인라인 툴바)** — 필터 칩 selected 상태·필터 버튼·"필터 초기화" UI까지만. **실제 목 데이터 필터링·URL 동기화·API query 연결 제외**.
8. **빈 상태 ×2** — 첫 진입(마스코트 CTA) / 결과 없음(적용된 검색어·필터 + "필터 초기화").
9. **다이얼로그/드로어** — 삭제 확인 / 삭제 차단 UI + 표현용 open·close까지만. **실제 삭제 로직·"연결 해제하러 가기" 이동·focus trap 고도화 제외**.

## 8. Phase E — 검증

- `npm run build` + `npm run lint` 통과.
- `npm run dev`(포트 3100)로 각 라우트 육안 확인, 시안과 스크린샷 대조(색·간격·폰트: Do Hyeon=통계 숫자, Mono=eyebrow/날짜, **Mono에 한글 금지**).
- **선택(권장)**: `lib/selectors/*` Vitest 단위 테스트(특히 documentPassRate 분모 제외/0 처리) — 컨벤션 §16 우선순위 1.

---

## 9. 재사용 / 참고

- 디자인 토큰 → Tailwind 유틸리티 매핑은 Phase 0에서 완료(`frontend/app/globals.css` `@theme`): `bg-brand`, `text-text-body`, `bg-ink-100`, `bg-brand-subtle`, `text-violet-700`, `bg-danger-deep`, `font-display`, `rounded-card` 등 사용 가능.
- `STATUS_CONFIG` 초안: `docs/Synply_Frontend_Code_Convention.md` §10-3.
- 서류 합격률 selector 패턴: 컨벤션 §11.
- 목 데이터 원본 값: `docs/design_draft/screens/*.dc.html` 하단 `<script data-dc-script>`.

## 10. 범위 밖 (이번 단계 제외)

- 모바일 셸/뷰, `usePlatform` 분기 (다음 단계).
- 로그인/회원가입 화면 (시안 누락, 추후).
- **URL search params 동기화**(`?view`, 필터 등) — 추후 기능 단계.
- **실제 목 데이터 필터링 / API query 연결**.
- **폼 submit 처리·Zod validation 연결·저장 로직** (error UI는 표시용 샘플만).
- **실제 삭제 로직·"연결 해제하러 가기" 이동·focus trap 고도화**.
- **TanStack Query, `<Providers>`, Supabase Auth, API client, 실제 데이터 fetch** — 이번 단계 미구현(사용자 직접 구현).

---

## 11. 진행 체크리스트

- [ ] Phase A — constants(STATUS_CONFIG)·types·`lib/mock`·`lib/selectors`
- [ ] Phase B — `utils/cn` + 공유 프리미티브 + feedback 다이얼로그 (+ 임시 design-system 페이지)
- [ ] Phase C — DesktopShell · PageHeader · `(main)/layout.tsx`
- [ ] Phase D-1 대시보드
- [ ] Phase D-2 지원 리스트(표) + ViewToggle
- [ ] Phase D-3 칸반(6컬럼)
- [ ] Phase D-4 지원 상세(2단)
- [ ] Phase D-5 이력서 관리
- [ ] Phase D-6 등록/수정 드로어 + 공유 폼
- [ ] Phase D-7 필터 툴바
- [ ] Phase D-8 빈 상태 ×2
- [ ] Phase D-9 공용 다이얼로그
- [ ] Phase E — build/lint/시각 대조 (+ selector 테스트)
