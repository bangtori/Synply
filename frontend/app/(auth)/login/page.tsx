import { AuthLayout } from '@/components/domain/auth/AuthLayout';

import { LoginForm } from './_components/LoginForm';

export default function LoginPage() {
  return (
    <AuthLayout variant="login">
      <LoginForm />
    </AuthLayout>
  );
}
