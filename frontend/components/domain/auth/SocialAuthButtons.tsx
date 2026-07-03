// 추후 추가: 소셜 로그인(OAuth).
// 정적 UI 단계에서는 폼에서의 사용을 주석 처리해 두었고,
// 실제 Google/Apple OAuth 연동은 기능 단계에서 이 컴포넌트를 폼에 렌더해 연결한다.

export interface SocialAuthButtonsProps {
  variant: 'login' | 'signup';
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="#fff" aria-hidden>
      <path d="M16.36 1c.08 1.06-.34 2.1-.99 2.86-.66.77-1.74 1.36-2.79 1.28-.1-1.02.4-2.08 1-2.74C14.25 1.6 15.4 1.05 16.36 1zM20.6 17.13c-.5 1.15-.74 1.66-1.39 2.68-.9 1.42-2.18 3.2-3.76 3.21-1.4.01-1.77-.92-3.68-.91-1.9.01-2.3.93-3.71.9-1.58-.01-2.79-1.6-3.7-3.02C1.83 16.04 1.56 11.3 3.13 8.79c.9-1.45 2.32-2.36 3.86-2.36 1.57 0 2.55.92 3.85.92 1.26 0 2.03-.92 3.84-.92 1.37 0 2.82.75 3.85 2.04-3.38 1.85-2.83 6.67.07 7.66z" />
    </svg>
  );
}

const SOCIAL_BUTTON =
  'flex w-full items-center justify-center gap-2.5 rounded-input border-[1.5px] py-3 text-sm font-semibold transition';

export function SocialAuthButtons({ variant }: SocialAuthButtonsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          className={`${SOCIAL_BUTTON} border-border-default bg-surface-card text-ink-900 hover:bg-surface-sunken`}
        >
          <GoogleIcon />
          {variant === 'login' ? 'Google로 계속하기' : 'Google로 가입하기'}
        </button>

        {variant === 'login' && (
          // Apple 브랜드 컬러(#191919)는 서드파티 브랜드 규격이라 토큰 예외
          <button
            type="button"
            className={`${SOCIAL_BUTTON} border-[#191919] bg-[#191919] text-white`}
          >
            <AppleIcon />
            Apple로 계속하기
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border-subtle" />
        <span className="font-mono text-3xs text-text-subtle">또는 이메일로</span>
        <div className="h-px flex-1 bg-border-subtle" />
      </div>
    </div>
  );
}
