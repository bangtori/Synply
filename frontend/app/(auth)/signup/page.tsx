import { AuthLayout } from '@/components/domain/auth/AuthLayout';

import { SignupForm } from './_components/SignupForm';

export default function SignupPage() {
  return (
    <AuthLayout variant="signup">
      <SignupForm />
    </AuthLayout>
  );
}
