'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

import { Input } from '@/components/ui/Input';

// 로그인 폼 (정적 UI). 실제 인증/submit·검증은 기능 단계(Supabase Auth).
export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      className="w-full max-w-[380px]"
      onSubmit={(event) => event.preventDefault()}
    >
      <p className="mb-2.5 font-mono text-3xs uppercase tracking-[0.08em] text-brand">
        Welcome Back
      </p>
      <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-ink-950">
        다시 오신 걸 환영해요
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        계정에 로그인하고 지원 현황을 이어서 관리하세요.
      </p>

      {/* 추후 추가: 소셜 로그인(OAuth) + "또는 이메일로" 구분선.
          기능 단계에서 아래를 활성화한다.
        <div className="mt-7">
          <SocialAuthButtons variant="login" />
        </div>
      */}

      <div className="mt-7 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-text-strong">이메일</span>
          <Input type="email" placeholder="you@example.com" autoComplete="email" />
        </label>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-strong">
              비밀번호
            </span>
            <button type="button" className="text-2xs text-text-link">
              비밀번호 찾기
            </button>
          </div>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호 입력"
              autoComplete="current-password"
              className="pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label="비밀번호 표시 전환"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle transition hover:text-text-body"
            >
              {showPassword ? (
                <EyeOff size={18} strokeWidth={2} aria-hidden />
              ) : (
                <Eye size={18} strokeWidth={2} aria-hidden />
              )}
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            defaultChecked
            className="size-[18px] rounded-md accent-[var(--brand)]"
          />
          <span className="text-xs text-text-body">로그인 상태 유지</span>
        </label>

        <button
          type="submit"
          className="w-full rounded-input bg-brand py-3.5 text-sm font-bold text-white shadow-brand transition hover:bg-brand-hover"
        >
          로그인
        </button>
      </div>

      <p className="mt-5 text-center text-xs text-text-muted">
        아직 계정이 없으세요?{' '}
        <Link href="/signup" className="font-bold text-violet-700">
          회원가입
        </Link>
      </p>
    </form>
  );
}
