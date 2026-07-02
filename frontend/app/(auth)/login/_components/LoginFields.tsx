'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { Input } from '@/components/ui/Input';

// 로그인 입력부(이메일/비밀번호/유지/로그인). 데스크탑 폼과 모바일 카드가 공유.
export function LoginFields() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-text-strong">이메일</span>
        <Input type="email" placeholder="you@example.com" autoComplete="email" />
      </label>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-text-strong">비밀번호</span>
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
    </form>
  );
}
