import type { ReactNode } from 'react';

import { DesktopShell } from '@/components/shells/DesktopShell';

// 지금은 데스크탑 셸 고정. 모바일 단계에서 usePlatform으로 셸 분기를 추가한다.
export default function MainLayout({ children }: { children: ReactNode }) {
  return <DesktopShell>{children}</DesktopShell>;
}
