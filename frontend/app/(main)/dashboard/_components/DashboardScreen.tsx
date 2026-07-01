'use client';

import { useState } from 'react';

import { ApplicationFormDrawer } from '@/components/domain/applications/ApplicationFormDrawer';
import { usePlatform } from '@/hooks/usePlatform';
import { mockApplications } from '@/lib/mock/applications';
import { getApplicationStats } from '@/lib/selectors/applicationStats';
import { getRecentApplications } from '@/lib/selectors/recentApplications';
import { getStatusDistribution } from '@/lib/selectors/statusDistribution';

import { DashboardDesktopView } from './DashboardScreen.desktop';
import { DashboardMobileView } from './DashboardScreen.mobile';

// 컨테이너: 파생값 계산 + 플랫폼 분기 + (데스크탑) 등록 드로어.
export function DashboardScreen() {
  const platform = usePlatform();
  const [createOpen, setCreateOpen] = useState(false);

  const stats = getApplicationStats(mockApplications);
  const distribution = getStatusDistribution(mockApplications);

  if (platform === null) {
    return null; // 플랫폼 확정 전 (하이드레이션 안전)
  }

  if (platform === 'mobile') {
    return (
      <DashboardMobileView
        stats={stats}
        distribution={distribution}
        recent={getRecentApplications(mockApplications, 3)}
      />
    );
  }

  return (
    <>
      <DashboardDesktopView
        stats={stats}
        distribution={distribution}
        recent={getRecentApplications(mockApplications, 5)}
        onRegister={() => setCreateOpen(true)}
      />
      <ApplicationFormDrawer
        open={createOpen}
        mode="create"
        onClose={() => setCreateOpen(false)}
      />
    </>
  );
}
