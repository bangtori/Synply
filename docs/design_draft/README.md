# Handoff: Synply MVP — 지원 기록 관리 SaaS

## Overview
Synply는 구직자가 **여러 채용 지원 현황을 한 곳에서 추적·관리**하는 SaaS입니다. 회사·직무별 지원 기록을 등록하고, 전형 상태를 6단계로 관리하며, 이력서 파일을 지원 건에 연결합니다. 대시보드에서 전체 현황(총 지원·진행 중·서류 합격률·상태별 분포)을 요약해 봅니다.

이 번들은 데스크탑/모바일 화면 시안과 디자인 시스템 정의(**v1 1차 확정**)를 담은 개발 핸드오프 패키지입니다.

## About the Design Files
이 폴더 `screens/`의 `.dc.html` 파일들은 **HTML로 만든 디자인 레퍼런스**입니다 — 의도한 모양·동작을 보여주는 프로토타입이며, 그대로 복사해 쓰는 프로덕션 코드가 아닙니다.

> ⚠️ `.dc.html`은 "Design Component" 포맷으로, 사내 프리뷰 런타임(`support.js`)에서 렌더되는 템플릿입니다. **이 런타임이나 `support.js`를 프로젝트에 가져오지 마세요.** 마크업·인라인 스타일·레이아웃 의도를 읽기 위한 참고용입니다. 각 파일은 `<x-dc>` 템플릿(마크업 + `{{ }}` 데이터 홀, `<sc-for>`/`<sc-if>` 반복·조건) + 하단 `<script data-dc-script>`(목업 데이터/상태 로직)으로 구성됩니다.

작업 목표는 이 디자인을 **타깃 코드베이스의 기존 환경과 패턴·라이브러리로 재구현**하는 것입니다. 환경이 아직 없다면 프로젝트에 가장 적합한 프레임워크(React 권장)를 택해 구현하세요.

## Fidelity
**High-fidelity.** 색상·타이포·간격·상호작용이 확정된 시안입니다. 색·간격·서체는 추측하지 말고 `design-system/tokens/`의 CSS 변수를 그대로 사용하세요.

---

## 파일 구성
```
design_handoff_synply/
├─ README.md                         ← 이 문서
├─ screens/
│  ├─ Synply MVP 화면셋.dc.html        ← 데스크탑 9개 프레임 (핵심)
│  ├─ Synply MVP 모바일.dc.html        ← 모바일 10개 화면
│  └─ Synply 디자인 시스템.dc.html      ← 토큰·컴포넌트·레이아웃 스펙 시트 (단일 진실 소스)
├─ design-system/tokens/             ← colors/typography/spacing/elevation/fonts/base.css (그대로 import 가능)
└─ assets/                           ← tori-dice-cutout.png(로고), tori-face-cutout.png(마스코트)
```
> `support.js`는 일부러 제외했습니다. **`Synply 디자인 시스템.dc.html`을 먼저 열어 보세요** — 모든 토큰·컴포넌트·상태가 한 화면에 정리돼 있습니다.

---

## Design Tokens
`design-system/tokens/`의 CSS가 단일 소스입니다(그대로 link/import). 핵심 값:

### Colors
**브랜드**: `--brand #5B2EE5`(주 액션·선택·링크) · `--brand-hover #4A1FC4` · `--brand-subtle #EAE3FD`(선택 칩/배지 배경) · `--accent #FF892B`(서류 합격률 등 강조 1곳만)

**중립 ink (violet-tinted grey)**: `ink-950 #150F2B`(본문 강조) → `surface-page #F7F6FB`(50). 텍스트는 3단계: `--text-body`(ink-800) · `--text-muted`(ink-600) · `--text-subtle`(ink-500). 보더는 `--border-default`(ink-300) / `--border-subtle`(ink-200).

**표면**: `--surface-page #F7F6FB` · `--surface-card #FFFFFF` · `--surface-sunken #EEECF4` · `--surface-brand-soft #F4F1FE`

**의미색**: success `#1FA971`/`#D8F3E7` · warning `#F2A20E`/`#FCEFD2` · danger `#E2453E`/`#FBDEDC` · info `#2F7DEB`/`#D9E8FC`

### 전형 상태 6단계 — 색상 매핑 (Synply 고유 정의)
| 상태 | 배지 배경 | 배지 전경 | 차트색 | 서류 합격률 분모 |
|---|---|---|---|---|
| 지원완료 | `--ink-100` | `--ink-700` | `#C2BED2` | **제외** |
| 서류합격 | `--info-100` | `--info-500` | `#2F7DEB` | 포함 |
| 면접중 | `--brand-subtle` | `--violet-700` | `#5B2EE5` | 포함 |
| 최종합격 | `--success-100` | `--success-500` | `#1FA971` | 포함 |
| 서류불합격 | `--danger-100` | `--danger-500` | `#E2453E` | **제외** |
| 면접불합격 | `#7E211D`(딥레드) | `#FFFFFF` | `#7E211D` | 포함 |

**서류 합격률** = (서류합격 + 면접중 + 최종합격 + 면접불합격) ÷ 서류 결과가 확정된 지원 수. 지원완료·서류불합격은 분모에서 제외. 분모가 0이면 "데이터 없음" 표시.

### Typography
3서체 (모두 Google Fonts, `tokens/fonts.css`):
- `--font-display` = **Do Hyeon** (400 단일 weight) — 워드마크·통계 큰 숫자 전용. 작게 쓰지 말 것.
- `--font-body` = **Noto Sans KR** (400↔800) — 제목·본문. 한·영 모두.
- `--font-mono` = **IBM Plex Mono** — 라벨·eyebrow(CAPS+letter-spacing)·날짜·숫자·메타. **한글 글리프 없음** → 영문/숫자에만.

스케일: 페이지 타이틀 Noto 800/27px(-.02em) · 섹션·빈상태 800/21px · 행 제목 700/14px · 본문 400/15px(lh 1.65) · 통계 숫자 Do Hyeon 42px · eyebrow Mono 11px CAPS(.08em) · 메타/날짜 Mono 12px.

### Spacing / Radius / Shadow / Motion
- 4px 그리드. 카드 패딩 18–24px, 섹션 간격 20–28px.
- Radius: 카드 18px, 입력 14px(`--radius-md`), 버튼·칩 pill(999px).
- Shadow: **violet-tinted** (`rgba(40,16,101,…)`). `--shadow-sm`(카드), `--shadow-brand`(primary 글로우). 값은 `tokens/elevation.css`.
- Motion: `--ease-out` 120–360ms. 버튼 press엔 `--ease-bounce`(살짝 overshoot). 마스코트 `toriFloat` 6.5s bob.

### Assets / Icons
- `assets/tori-dice-cutout.png` — 로고 마크(사이드바·모바일 헤더 ~30px). `tori-face-cutout.png` — 마스코트(빈 상태 ~96–108px, float 애니메이션).
- 아이콘은 인라인 SVG(**Lucide** 호환, 2px stroke, round cap). 프로덕션은 `lucide-react` 등 정식 Lucide로 교체 권장.

---

## Screens / Views

### 데스크탑 — `screens/Synply MVP 화면셋.dc.html` (10 프레임, 1440×900~940 기준)
공통 셸: 좌측 **240px 사이드바**(로고 / 대시보드·지원 기록·이력서 nav / 하단 계정) + 우측 메인. nav active = `--brand-subtle` 배경 + `--violet-700` weight 700. 사이드바 하단 **계정 블록은 클릭 가능**(셰브론) — 누르면 위로 팝오버: 현재 이메일 + **로그아웃**(danger 레드). 01 프레임에 열린 상태 표시.

0. **로그인 / 회원가입** — 좌측 바이올렛 그라데이션 브랜드 패널(마스코트 + 카피) + 우측 폼. 로그인=소셜(Google·Apple) + 이메일/비번 + 로그인 유지 + 비번 찾기 / 회원가입=Google + 이름·이메일·비번 + 약관 동의. 두 화면 상호 전환 링크.
1. **대시보드** — 통계 4카드(총 지원·진행 중·서류 합격률·최종 합격, 숫자 Do Hyeon) + 좌 "상태별 지원 분포"(세그먼트 바+범례) / 우 "최근 지원 기록" 5건 + 전체 보기 이동. 우상단 등록 버튼.
2. **지원 기록 · 리스트** — 통계 없음. 검색 + 필터 칩(전형 상태/플랫폼/기술 스택/이력서 버전) + 정렬 + 리스트/칸반 토글, "전체 N건" 카운트, 표(회사·직무 / 상태 / 플랫폼 / 스택 / 지원일 / 이력서). 이력서 미연결은 점선 칩.
3. **지원 기록 · 칸반** — 통계 없음. 6단계 컬럼 + 컬럼별 개수. 카드 내 "상태 변경" 액션만(드래그 앤 드롭 없음).
4. **지원 상세** — 뒤로/수정/삭제 헤더 + 상태 변경(칩) + 공고 정보 + 연결 이력서(다운로드) + 결과 메모/회고. 파일 변경·연결 해제는 "수정"에서.
5. **이력서 파일 관리** — 인라인 업로드 영역(진행률% 미표시) + 파일 목록(파일명/업로드일/연결된 지원/액션). **연결된 파일은 삭제 차단**(잠금 아이콘 + 다이얼로그).
6. **등록 / 수정 드로어** — 우측 540px 드로어. **두 모드 분리**: 등록=빈 값·상태 기본값 "지원완료"·이력서 미연결·푸터 "등록" / 수정=기존 값·현재 상태 선택·연결 해제 노출·푸터 "저장".
7. **공용 다이얼로그** — 삭제 확인(되돌릴 수 없음 경고) / 삭제 차단 안내(연결 해제 유도). scrim 위 중앙.
8. **빈 상태 · 첫 진입** — 지원 기록 0건. 통계·목록 비고 중앙 마스코트 + "첫 지원 기록 등록" CTA.
9. **빈 상태 · 검색 결과 없음** — 적용된 검색어/필터 명시 + "필터 초기화" 유도(첫 진입과 구분).

### 모바일 — `screens/Synply MVP 모바일.dc.html` (12 화면, 390×844 폰 목업)
하단 **탭바 3개**(대시보드·지원 기록·이력서) + 우하단 **등록 FAB**(탭바와 분리). 대시보드 헤더 우측 **아바타는 클릭 가능** — 누르면 아래로 드롭다운: 이름·이메일 + **로그아웃**(danger 레드).

0. 로그인(풀스크린 그라데이션 + 하단 폼 카드) · 0b. 회원가입(화이트 스크롤 폼) · 1. 대시보드 · 2. 지원 기록(카드 리스트) · 3. 지원 기록(상태 필터 칩 + 단일 컬럼 카드) · 4. 지원 상세 · 5. 등록 시트(풀스크린) · 6. 수정 시트 · 7. 검색/필터 바텀시트 · 8. 이력서 파일 관리 · 9. 빈 상태 첫 진입 · 10. 빈 상태 결과 없음.

**로그인/회원가입·계정 메뉴**는 데스크탑과 동일한 흐름·카피를 모바일 패턴(풀스크린/시트·드롭다운)으로 옮긴 것입니다.

**FAB 동작**: 스크롤 상단에선 `+ 지원 기록 등록` 확장형 pill, 스크롤하면(>36px) 원형 `+`로 축소(0.28s). 첫 진입 빈 상태는 중앙 CTA가 있어 FAB 생략. 결과 없음 화면은 스크롤이 없어 확장형 유지.

---

## Components (상태 포함)
`screens/Synply 디자인 시스템.dc.html`의 03·04 섹션에 모든 상태가 시각적으로 나열돼 있습니다. 구현 시 그대로 매핑하세요.

- **Button** — Primary / Secondary / Ghost / Danger × **Default · Hover · Pressed · Disabled**. 한 화면에 Primary 하나만. press = `scale(.97)` + bounce.
- **Input** — Default · Focus(3px 소프트 violet 링) · Filled · Error(danger 보더 + 인라인 메시지) · Disabled · Search(아이콘).
- **상태 배지** — 6단계(위 매핑). pill · weight 700 · 12px.
- **필터 칩** — Default · Active(filled brand) · Selected(subtle) · Removable(× 포함).
- **기술 태그** — Read-only(ink-50) vs Input(brand-subtle, × 제거).
- **뷰 토글** — 리스트↔칸반 segmented control.
- **FAB** — Expanded(라벨) / Collapsed(원형).
- **카드 / 통계 / 분포 세그먼트 바**.

## Layout & Navigation
디자인 시스템 04 섹션 참고:
- **데스크탑 사이드바** 240px (로고 / nav active·default / 하단 사용자).
- **데스크탑 페이지 헤더** (eyebrow + 타이틀 좌 / 주 액션 우).
- **모바일 하단 탭바** 3탭 균등 + 분리된 등록 FAB.
- **모바일 상태바 + 헤더** (기본 화면 헤더 / 상세·시트 헤더 = 뒤로 + 액션).
- **오버레이** — 데스크탑 우측 드로어(540px) · 모바일 풀스크린/바텀 시트 · 중앙 다이얼로그. 모두 scrim(ink 50% + blur) 위.

---

## Implementation Notes
- **권장 스택**: React + 디자인 시스템 토큰 CSS(`design-system/tokens/styles 또는 개별 css` link) + `lucide-react`.
- 색·간격·서체는 **반드시 `var(--token)`** 참조 — 시안의 인라인 hex를 하드코딩하지 말 것(시안은 토큰의 시각화일 뿐).
- 반응형: 데스크탑(사이드바)과 모바일(탭바)은 별도 셸. 태블릿 분기는 MVP 범위 밖 — 필요 시 사이드바 collapse로 확장.
- 6단계 상태와 서류 합격률 공식은 **비즈니스 규칙**이므로 위 표/공식을 정확히 따를 것(특히 분모 제외 조건).
- 데이터는 모두 목업입니다. 실제 스키마/API는 별도 요구사항 정의서 기준.
