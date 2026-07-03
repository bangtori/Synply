import { SignupForm } from './SignupForm';

// 모바일 회원가입: 화이트 스크롤 폼 (로고 + 폼).
export function SignupMobileLayout() {
  return (
    <div className="min-h-dvh overflow-y-auto bg-surface-page">
      <div className="flex flex-col px-6 pb-8 pt-6">
        <div className="mb-5 flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/tori-dice-cutout.png"
            alt=""
            className="size-7 object-contain"
          />
          <span className="font-display text-xl text-ink-950">Synply</span>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
