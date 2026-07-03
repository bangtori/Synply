import type { ReactNode } from 'react';

import { AppShell } from '@/components/shells/AppShell';

// usePlatform 기반으로 Desktop/Mobile 셸을 분기한다(AppShell).
export default function MainLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
