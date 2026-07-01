import { Check } from 'lucide-react';

export interface AuthBrandPanelProps {
  variant: 'login' | 'signup';
}

const SIGNUP_FEATURES = [
  '지원 기록을 한 곳에 모으기',
  '전형 상태와 서류 합격률 추적',
  '이력서 버전 연결 관리',
];

// 좌측 브랜드 패널 (바이올렛 그라데이션 + 로고/마스코트 + 카피).
// 데스크탑(lg~)에서만 표시. 모바일 인증은 별도(모바일 단계).
export function AuthBrandPanel({ variant }: AuthBrandPanelProps) {
  return (
    <div className="relative hidden w-[560px] shrink-0 flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-600 to-violet-800 p-[52px] lg:flex">
      {/* 데코 글로우 (장식용) */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 size-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,137,43,0.28),transparent_70%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-44 -left-28 size-[460px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.14),transparent_70%)]"
        aria-hidden
      />

      {/* 로고 + 워드마크 */}
      <div className="relative flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/tori-dice-cutout.png"
          alt=""
          className="size-9 object-contain drop-shadow-lg"
        />
        <span className="font-display text-2xl text-white">Synply</span>
      </div>

      {/* 마스코트 + 카피 */}
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/tori-face-cutout.png"
          alt=""
          className="mb-8 size-32 object-contain drop-shadow-2xl"
        />
        {variant === 'login' ? (
          <>
            <p className="text-hero font-extrabold leading-tight tracking-[-0.02em] text-white">
              흩어진 지원 현황을
              <br />한 곳에서.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
              회사·직무별 지원 기록과 전형 상태, 이력서 버전을 Synply 한 곳에서
              차분하게 관리하세요.
            </p>
          </>
        ) : (
          <>
            <p className="text-hero font-extrabold leading-tight tracking-[-0.02em] text-white">
              오늘부터
              <br />차분하게 시작해요.
            </p>
            <ul className="mt-6 flex max-w-sm flex-col gap-3.5">
              {SIGNUP_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-white/20">
                    <Check
                      size={14}
                      strokeWidth={3}
                      className="text-white"
                      aria-hidden
                    />
                  </span>
                  <span className="text-sm text-white/90">{feature}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* 하단 캡션 */}
      <p className="relative font-mono text-3xs tracking-[0.04em] text-white/60">
        {variant === 'login'
          ? 'MADE WITH PATIENCE, NOT PRESSURE'
          : '무료로 시작 · 카드 등록 없음'}
      </p>
    </div>
  );
}
