# Synply MVP — UI 시안 구현 계획서

> **목적**: 디자인 핸드오프(`README.md`, `screens/`, `design-system/tokens/`)를 바탕으로 **기능 제외 · 목 데이터 기반 UI 시안**을 구현하기 위한 작업 계획서.
> 이 문서는 **프로젝트 폴더로 옮겨서도 단독으로 작업을 이어갈 수 있도록** 자립형으로 작성되었습니다.

---

## 0. 확정 사항 (시작 전 합의됨)

| 항목 | 결정 | 비고 |
|---|---|---|
| 범위 | **UI 시안만** (기능·실제 API 제외, 목 데이터 사용) | |
| 스택 | **Next.js (App Router) + React 18 + TypeScript** | 화면 컴포넌트는 `"use client"` |
| 플랫폼 분기 | **화면 폭 기준 자동 전환** (matchMedia, 단일 브레이크포인트 ≈768px) | 하이드레이션 안전 처리 필요 |
| 스타일 | **토큰 CSS 6종 그대로 import** + CSS Modules(또는 vanilla-extract). 항상 `var(--token)` 참조 | hex 하드코딩 금지 |
| 아이콘 | **lucide-react** (시안의 인라인 SVG가 Lucide 호환) | |
| 상태관리 | 불필요 — 목 데이터 + 로컬 `useState` | |

> ⚠️ 옮길 때 함께 가져갈 것: `design-system/tokens/` 전체, `assets/`(로고·마스코트), 그리고 참고용으로 `screens/`, `README.md`. **`support.js`와 `.dc.html` 런타임은 프로젝트로 가져오지 말 것** (시안 참고용).

---

## 1. 파악한 디자인 내용 요약

### 1.1 디자인 토큰 (단일 진실 소스 — `design-system/tokens/`)
- **6종**: `colors.css` / `typography.css` / `spacing.css` / `elevation.css` / `fonts.css` / `base.css` → 그대로 link/import.
- **브랜드 색**: `--brand #5B2EE5`(violet, 주 액션·선택·링크) · `--brand-hover #4A1FC4` · `--brand-subtle`(선택 칩/배지 배경) · `--accent #FF892B`(서류 합격률 등 강조 **1곳만**).
- **중립 ink**(violet-tinted grey) 9단계: 텍스트 3단계(`--text-body`/`--text-muted`/`--text-subtle`), 보더 2단계(`--border-default`/`--border-subtle`).
- **표면**: `--surface-page` / `--surface-card` / `--surface-sunken` / `--surface-brand-soft`.
- **의미색**: success / warning / danger / info (각 500·100).
- **3서체** (모두 Google Fonts, `fonts.css`):
  - `--font-display` = **Do Hyeon** (400 단일) — 워드마크·통계 큰 숫자 전용. 작게 쓰지 말 것.
  - `--font-body` = **Noto Sans KR** (400↔800) — 제목·본문. 한·영.
  - `--font-mono` = **IBM Plex Mono** — 라벨·eyebrow(CAPS)·날짜·숫자·메타. **한글 글리프 없음 → 영문/숫자에만**.
- **Radius**: 카드 18px, 입력 14px(`--radius-md`), 버튼·칩 pill(999px).
- **Shadow**: violet-tinted (`rgba(40,16,101,…)`). `--shadow-sm`(카드), `--shadow-brand`(primary 글로우).
- **Motion**: `--ease-out` 120–360ms, 버튼 press = `scale(.97)` + `--ease-bounce`, 마스코트 `toriFloat` 6.5s.
- **Focus ring**: `--focus-ring` (3px 소프트 violet).

### 1.2 Synply 고유 비즈니스 규칙 (반드시 정확히)

**전형 상태 6단계 색상 매핑**

| 상태 | 배지 배경 | 배지 전경 | 차트색 | 합격률 분모 |
|---|---|---|---|---|
| 지원완료 | `--ink-100` | `--ink-700` | `#C2BED2` | **제외** |
| 서류합격 | `--info-100` | `--info-500` | `#2F7DEB` | 포함 |
| 면접중 | `--brand-subtle` | `--violet-700` | `#5B2EE5` | 포함 |
| 최종합격 | `--success-100` | `--success-500` | `#1FA971` | 포함 |
| 서류불합격 | `--danger-100` | `--danger-500` | `#E2453E` | **제외** |
| 면접불합격 | `#7E211D`(딥레드) | `#FFFFFF` | `#7E211D` | 포함 |

**서류 합격률 공식**
```
서류 합격률 = (서류합격 + 면접중 + 최종합격 + 면접불합격) ÷ 서류 결과가 확정된 지원 수
- 지원완료·서류불합격은 분모에서 제외
- 분모가 0이면 "데이터 없음" 표시
```

### 1.3 화면 인벤토리

| # | 데스크탑 (1440×940, `screens/Synply MVP 화면셋.dc.html`) | 모바일 (390×844, `screens/Synply MVP 모바일.dc.html`) |
|---|---|---|
| 셸 | 좌측 240px **사이드바** (로고 / nav 3개 / 하단 사용자) | 상단 **헤더** + 하단 **탭바 3개** + 우하단 **FAB** |
| 대시보드 | 통계 4카드 + 상태별 분포(세그먼트 바+범례) + 최근 5건 | 통계 2×2 + 분포 + 최근 3건 |
| 지원 기록·리스트 | **표 6열**(회사·직무/상태/플랫폼/스택/지원일/이력서) | **카드 리스트** |
| 지원 기록·칸반 | **6컬럼 보드**(컬럼별 개수, 드래그 없음·"상태 변경") | **상태 필터 칩(가로 스크롤) + 단일 컬럼** |
| 검색/필터 | 인라인 툴바(검색 + 드롭다운 칩 + 정렬 + 뷰 토글) | **바텀시트**("필터" 버튼으로 열기) |
| 지원 상세 | **2단 그리드(1.6fr/1fr)** + 뒤로/수정/삭제 헤더 | 단일 컬럼 스택 + 뒤로/액션 헤더 바 |
| 이력서 관리 | 표 + 인라인 업로드 영역(진행률% 미표시) | 카드 + 업로드 영역 |
| 등록/수정 | 우측 **540px 드로어**(scrim 위) | **풀스크린/바텀 시트**(grabber) |
| 다이얼로그 | 중앙 모달 — 삭제 확인 / 삭제 차단 안내 | 동일 (공용) |
| 빈 상태 ×2 | 첫 진입(마스코트 CTA) / 결과 없음(필터 초기화) | 첫 진입 / 결과 없음 |

> **핵심**: 단순 반응형 재배치가 아니라 **셸·내비게이션·일부 화면이 플랫폼별로 재구성**됨 (표↔카드, 칸반보드↔필터칩, 드로어↔시트, 인라인필터↔바텀시트). 반면 **데이터·비즈니스 로직·토큰·잎(leaf) 컴포넌트는 100% 동일** (두 시안 파일의 목 데이터·상태맵이 글자 단위로 동일).

### 1.4 핵심 상호작용 디테일
- **등록 vs 수정 드로어/시트**: 같은 폼, 모드만 다름. 등록=빈 값·상태 기본값 "지원완료"·이력서 미연결·푸터 "등록" / 수정=기존 값·현재 상태 선택·"연결 해제" 노출·푸터 "저장". 저장 중 버튼 비활성화, 필수값(회사명·직무명) 누락 시 인라인 오류.
- **이력서 삭제 차단**: 연결된 파일은 삭제 불가(잠금 아이콘 + 차단 다이얼로그 → "연결 해제하러 가기").
- **모바일 FAB**: 스크롤 상단 = 확장형(아이콘+보조 라벨), 스크롤 >36px = 원형 축소(0.28s). 빈상태 첫진입은 중앙 CTA 있어 FAB 생략, 결과 없음은 스크롤 없어 확장 유지.
- **빈 상태 2종 구분**: 첫 진입(마스코트 + "첫 지원 기록 등록") vs 결과 없음(적용된 검색어·필터 명시 + "필터 초기화").

---

## 2. 설계 전략 — 플랫폼별 맞춤 디자인을 효율적으로 구성

3계층 구조로 **공유 최대화 / 분리 최소화**.

```
계층 1 · CORE (플랫폼 무관, 100% 공유)
  tokens/         토큰 CSS 그대로 import
  lib/domain      타입 · 6단계 상태맵 · 목 데이터
  lib/selectors   파생 통계(counts · statusDist · 서류 합격률 공식)
  hooks/          useApplications · useResumeFiles · useStats

계층 2 · UI PRIMITIVES (시각적으로 동일 → 공유)
  StatusBadge · Button · FilterChip · TechTag · Input · SearchInput
  ViewToggle · StatCard · DistributionBar · EmptyState · Avatar
  ResumeFileChip · ConfirmDialog · BlockedDialog

계층 3 · PLATFORM LAYER (분리)
  shells/   DesktopShell(사이드바)  |  MobileShell(헤더+탭바+FAB)
  screens/  화면별 컨테이너 + view.desktop / view.mobile (레이아웃이 다른 것만)
```

### 분리/공유 판단 매트릭스

| 요소 | 처리 | 이유 |
|---|---|---|
| 토큰, 목 데이터, 상태맵, 합격률 공식 | **공유** | 두 플랫폼 동일 |
| StatusBadge·Button·Chip·Input·StatCard·EmptyState 내용 | **공유 (계층 2)** | 픽셀 단위로 동일 |
| 앱 셸(내비게이션) | **분리** | 사이드바 vs 탭바+헤더+FAB |
| 대시보드·상세·이력서·빈상태 | **공유 컴포넌트 + 플랫폼 래퍼** | 같은 블록 배치만 다름 |
| 지원 리스트 (표 vs 카드) | **뷰 분리** | 마크업 구조 다름 |
| 칸반 (보드 vs 필터칩 단일컬럼) | **뷰 분리** | 상호작용 모델 다름 |
| 등록/수정 (드로어 vs 시트), 필터 (툴바 vs 바텀시트) | **오버레이 컨테이너 분리 + 폼 본문 공유** | 필드는 동일, 그릇만 다름 |

### 플랫폼 분기 방법 (확정)
- 앱 루트에서 **단일 `usePlatform()` 훅** (matchMedia, ≈768px)으로 데스크탑/모바일 판정 → 셸·뷰 트리 한 번에 스위칭. 태블릿은 MVP 밖.
- **Next.js 하이드레이션 안전 처리**: 서버는 화면 폭을 모르므로 `usePlatform()`은 첫 렌더에서 `null`(미정) 반환, `useEffect`에서 matchMedia 구독 후 확정. 미정 구간엔 셸 골격/스켈레톤만 그려 깜빡임 최소화.
- 각 화면 = **컨테이너(데이터·상태) 1개** + **`view.desktop` / `view.mobile` 2개**. 컨테이너가 공유 훅으로 데이터를 뽑아 props로 전달 → 로직 중복 0.
- 폼처럼 필드는 같고 그릇만 다른 경우: `<ApplicationForm>`(공유)을 `<DesktopDrawer>` / `<MobileSheet>` 안에 배치.

### 권장 폴더 구조 (Next.js App Router)
```
app/
  layout.tsx              ← 토큰 CSS · 폰트 글로벌 로드
  page.tsx (등 라우트)     ← "use client" 컨테이너
components/
  ui/                     ← 공유 프리미티브 (계층 2)
  shells/  DesktopShell · MobileShell
  screens/
    <Name>/ index.tsx (컨테이너) + view.desktop.tsx + view.mobile.tsx
lib/    domain · selectors · mockData
hooks/  usePlatform · useApplications · useStats
```

---

## 3. 작업 일정 (1인 개발 기준 · 기능 제외 · 목 UI)

진행 시 각 Phase를 체크박스로 관리.

### Phase 0 — 셋업 (0.5일)
- [ ] Next.js(App Router) + TS 프로젝트 부트스트랩
- [ ] 토큰 CSS 6종 `app/layout.tsx` 글로벌 import, 폰트 로드 확인 (Do Hyeon / Noto Sans KR / IBM Plex Mono)
- [ ] `assets/` 로고·마스코트 배치
- [ ] 폴더 구조(계층 1/2/3) 생성
- [ ] `usePlatform()` + 빈 데스크탑/모바일 셸로 분기 검증 (하이드레이션 안전 패턴)

### Phase 1 — Core + 디자인 시스템 검증 (1.5일)
- [ ] `lib/domain`: 타입, 6단계 상태맵, 목 데이터 이식 (두 시안 공통값)
- [ ] `lib/selectors`: counts / total / statusDist / active + **서류 합격률 공식(분모 제외 규칙 정확히)**
- [ ] **디자인 시스템 스펙 페이지** 재현 (`Synply 디자인 시스템.dc.html` 03·04 섹션) — 잎 컴포넌트 상태 검수 기준점

### Phase 2 — 공유 UI 프리미티브 (2일)
- [ ] StatusBadge(6단계)
- [ ] Button(Primary/Secondary/Ghost/Danger × Default·Hover·Pressed·Disabled)
- [ ] FilterChip(Default·Active·Selected·Removable)
- [ ] TechTag(Read-only / Input-removable)
- [ ] Input(Default·Focus·Filled·Error·Disabled) + SearchInput
- [ ] ViewToggle(리스트↔칸반 segmented)
- [ ] StatCard · DistributionBar(세그먼트 바 + 범례)
- [ ] EmptyState(마스코트 float / 검색 아이콘 2종)
- [ ] Avatar/InitialBadge · ResumeFileChip
- [ ] ConfirmDialog · BlockedDialog
- [ ] Phase 1 스펙 페이지와 1:1 대조 검수

### Phase 3 — 셸 2종 (1.5일)
- [ ] **DesktopShell**: 240px 사이드바(로고 / nav active·default / 하단 사용자) + 메인 + 페이지 헤더(eyebrow+타이틀 좌 / 주 액션 우)
- [ ] **MobileShell**: 상단 헤더(상태바 목업+로고+아바타 / 상세·시트용 뒤로+액션 변형) + 하단 탭바 3개 + **FAB(스크롤 시 확장↔원형 축소)**

### Phase 4 — 화면 구현 (5~6일) — 공유 많은 화면 → 분기 큰 화면 순
- [ ] 1. 대시보드 (D/M) — 0.75일
- [ ] 2. 지원 리스트: **표(D) / 카드(M)** — 1일
- [ ] 3. 칸반: **6컬럼 보드(D) / 필터칩 단일컬럼(M)** — 1일
- [ ] 4. 지원 상세: 2단(D) / 단일컬럼(M) — 0.75일
- [ ] 5. 이력서 관리: 표(D) / 카드(M) + 인라인 업로드 — 0.75일
- [ ] 6. 등록/수정: **드로어(D) / 시트(M)** + 공유 폼, 등록·수정 2모드 — 1일
- [ ] 7. 검색/필터: 인라인 툴바(D) / 바텀시트(M) — 0.5일
- [ ] 8. 빈 상태 ×2 (첫 진입 / 결과 없음) 양 플랫폼 — 0.5일
- [ ] 9. 다이얼로그(삭제·차단) 공용 — 0.25일

### Phase 5 — 통합 점검 & 폴리시 (1.5일)
- [ ] 라우팅 연결, 전 화면 양 플랫폼 토글 점검
- [ ] 토큰 일관성 감사(하드코딩 hex 색출), 폰트 적용 확인(**Mono에 한글 금지**)
- [ ] 모션(press bounce, FAB collapse, 마스코트 toriFloat), 포커스 링, 호버 상태
- [ ] 디자인 시안과 시각 대조(스크린샷 비교)

**합계 ≈ 13~14일 (약 2.5~3주)** — 컴포넌트 재사용으로 화면 단계 압축.

---

## 4. 구현 시 체크리스트 (반복 확인)
- [ ] 색·간격·서체는 **반드시 `var(--token)`** 참조 (시안 인라인 hex는 토큰 시각화일 뿐, 하드코딩 금지)
- [ ] 6단계 상태 색상 매핑 = §1.2 표 그대로
- [ ] 서류 합격률 = §1.2 공식 그대로 (지원완료·서류불합격 분모 제외, 분모 0이면 "데이터 없음")
- [ ] IBM Plex Mono에는 영문·숫자만 (한글 금지)
- [ ] Do Hyeon은 워드마크·통계 큰 숫자에만 (작게 쓰지 말 것)
- [ ] 한 화면에 Primary 버튼은 하나만
- [ ] 데스크탑/모바일은 별도 셸 — 단순 반응형이 아님
- [ ] 데이터는 전부 목업 (실제 스키마/API는 별도 요구사항 정의서 기준)

---

## 5. 참고 파일
- `README.md` — 핸드오프 개요·토큰 요약·화면 설명 (원본)
- `screens/Synply 디자인 시스템.dc.html` — 토큰·컴포넌트·상태 스펙 시트 (먼저 볼 것)
- `screens/Synply MVP 화면셋.dc.html` — 데스크탑 9프레임
- `screens/Synply MVP 모바일.dc.html` — 모바일 10화면
- `screens/Synply MVP 시안 (초기비교안).dc.html` — 참고용 초기 비교안 (구현 대상 아님)
- `design-system/tokens/*.css` — 그대로 import할 토큰
- `assets/tori-dice-cutout.png`(로고) · `assets/tori-face-cutout.png`(마스코트)
