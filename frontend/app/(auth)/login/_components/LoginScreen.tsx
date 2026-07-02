'use client';

import { AuthLayout } from '@/components/domain/auth/AuthLayout';
import { usePlatform } from '@/hooks/usePlatform';

import { LoginForm } from './LoginForm';
import { LoginMobileLayout } from './LoginMobileLayout';

export function LoginScreen() {
  const platform = usePlatform();

  if (platform === null) {
    return <div className="min-h-dvh bg-surface-page" />;
  }

  if (platform === 'mobile') {
    return <LoginMobileLayout />;
  }

  return (
    <AuthLayout variant="login">
      <LoginForm />
    </AuthLayout>
  );
}
