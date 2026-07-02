import Link from 'next/link';

import { LoginFields } from './LoginFields';

// 데스크탑 로그인 폼 (헤더 + 입력부 + 회원가입 링크).
export function LoginForm() {
  return (
    <div className="w-full max-w-[380px]">
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
          기능 단계에서 components/domain/auth/SocialAuthButtons 를 여기에 렌더한다. */}

      <div className="mt-7">
        <LoginFields />
      </div>

      <p className="mt-5 text-center text-xs text-text-muted">
        아직 계정이 없으세요?{' '}
        <Link href="/signup" className="font-bold text-violet-700">
          회원가입
        </Link>
      </p>
    </div>
  );
}
