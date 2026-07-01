'use client';

import Link from 'next/link';

import { Input } from '@/components/ui/Input';

// 회원가입 폼 (정적 UI). 실제 가입/submit·검증은 기능 단계(Supabase Auth).
export function SignupForm() {
  return (
    <form
      className="w-full max-w-[380px]"
      onSubmit={(event) => event.preventDefault()}
    >
      <p className="mb-2.5 font-mono text-3xs uppercase tracking-[0.08em] text-brand">
        Get Started
      </p>
      <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-ink-950">
        Synply 계정 만들기
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        30초면 충분해요. 무료로 시작하세요.
      </p>

      {/* 추후 추가: 소셜 로그인(OAuth) + "또는 이메일로" 구분선.
          기능 단계에서 아래를 활성화한다.
        <div className="mt-6">
          <SocialAuthButtons variant="signup" />
        </div>
      */}

      <div className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-text-strong">이름</span>
          <Input placeholder="이름 입력" autoComplete="name" />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-text-strong">이메일</span>
          <Input type="email" placeholder="you@example.com" autoComplete="email" />
        </label>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-text-strong">비밀번호</span>
          <Input
            type="password"
            placeholder="8자 이상"
            autoComplete="new-password"
          />
          <p className="font-mono text-3xs text-text-subtle">
            영문·숫자 포함 8자 이상
          </p>
        </div>

        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            className="mt-0.5 size-[18px] rounded-md accent-[var(--brand)]"
          />
          <span className="text-2xs leading-relaxed text-text-muted">
            <button type="button" className="text-violet-700">
              이용약관
            </button>{' '}
            및{' '}
            <button type="button" className="text-violet-700">
              개인정보 처리방침
            </button>
            에 동의합니다.
          </span>
        </label>

        <button
          type="submit"
          className="w-full rounded-input bg-brand py-3.5 text-sm font-bold text-white shadow-brand transition hover:bg-brand-hover"
        >
          계정 만들기
        </button>
      </div>

      <p className="mt-5 text-center text-xs text-text-muted">
        이미 계정이 있으세요?{' '}
        <Link href="/login" className="font-bold text-violet-700">
          로그인
        </Link>
      </p>
    </form>
  );
}
