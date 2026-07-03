import type { ReactNode } from 'react';

import { AuthBrandPanel } from './AuthBrandPanel';

export interface AuthLayoutProps {
  variant: 'login' | 'signup';
  children: ReactNode;
}

// 좌우 분할 인증 셸: 좌측 브랜드 패널(lg~) + 우측 폼.
export function AuthLayout({ variant, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-surface-page">
      <AuthBrandPanel variant={variant} />
      <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
        {children}
      </div>
    </div>
  );
}
