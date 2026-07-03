import Link from 'next/link';

import { LoginFields } from './LoginFields';

// 모바일 로그인: 풀스크린 바이올렛 그라데이션 + 하단 폼 카드.
export function LoginMobileLayout() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <div
        className="absolute inset-0 bg-[linear-gradient(165deg,var(--violet-600),var(--violet-800))]"
        aria-hidden
      />
      <div
        className="absolute -right-28 -top-28 size-80 rounded-full bg-[radial-gradient(circle,rgba(255,137,43,0.3),transparent_70%)]"
        aria-hidden
      />

      <div className="relative flex flex-1 flex-col px-7 pb-8 pt-16">
        <div className="mb-8 flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/tori-dice-cutout.png"
            alt=""
            className="size-[30px] object-contain"
          />
          <span className="font-display text-2xl text-white">Synply</span>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/tori-face-cutout.png"
          alt=""
          className="mb-4 size-24 object-contain"
        />
        <p className="text-2xl font-extrabold leading-snug tracking-[-0.02em] text-white">
          다시 오신 걸
          <br />
          환영해요
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-white/80">
          로그인하고 지원 현황을 이어서 관리하세요.
        </p>

        <div className="flex-1" />

        <div className="rounded-[22px] bg-surface-card p-5 shadow-[0_20px_50px_rgba(0,0,0,0.28)]">
          <LoginFields />
          {/* 추후 추가: 소셜 로그인(OAuth) — 기능 단계에서 활성화 */}
        </div>

        <p className="mt-5 text-center text-xs text-white/85">
          아직 계정이 없으세요?{' '}
          <Link href="/signup" className="font-bold text-white">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
