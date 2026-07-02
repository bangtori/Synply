'use client';

import { AuthLayout } from '@/components/domain/auth/AuthLayout';
import { usePlatform } from '@/hooks/usePlatform';

import { SignupForm } from './SignupForm';
import { SignupMobileLayout } from './SignupMobileLayout';

export function SignupScreen() {
  const platform = usePlatform();

  if (platform === null) {
    return <div className="min-h-dvh bg-surface-page" />;
  }

  if (platform === 'mobile') {
    return <SignupMobileLayout />;
  }

  return (
    <AuthLayout variant="signup">
      <SignupForm />
    </AuthLayout>
  );
}
