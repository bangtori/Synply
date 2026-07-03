'use client';

import type { ReactNode } from 'react';

import { usePlatform } from '@/hooks/usePlatform';

import { DesktopShell } from './DesktopShell';
import { MobileShell } from './MobileShell';

export interface AppShellProps {
  children: ReactNode;
}

// usePlatform으로 데스크탑/모바일 셸을 분기한다.
export function AppShell({ children }: AppShellProps) {
  const platform = usePlatform();

  // 플랫폼 확정 전(null): 하이드레이션 안전을 위해 셸 크롬 없이 본문만.
  if (platform === null) {
    return <div className="min-h-dvh bg-surface-page">{children}</div>;
  }

  if (platform === 'mobile') {
    return <MobileShell>{children}</MobileShell>;
  }

  return <DesktopShell>{children}</DesktopShell>;
}
