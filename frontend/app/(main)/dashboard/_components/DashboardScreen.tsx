'use client';

import { useState } from 'react';

import { ApplicationFormDrawer } from '@/components/domain/applications/ApplicationFormDrawer';
import { mockApplications } from '@/lib/mock/applications';
import { getApplicationStats } from '@/lib/selectors/applicationStats';
import { getRecentApplications } from '@/lib/selectors/recentApplications';
import { getStatusDistribution } from '@/lib/selectors/statusDistribution';

import { DashboardDesktopView } from './DashboardScreen.desktop';

// 컨테이너: 목 데이터에서 파생값을 뽑고, 등록 드로어 open 상태를 관리한다.
// (추후 mock import만 데이터 훅으로 교체하면 뷰는 그대로 유지)
export function DashboardScreen() {
  const [createOpen, setCreateOpen] = useState(false);

  const stats = getApplicationStats(mockApplications);
  const distribution = getStatusDistribution(mockApplications);
  const recent = getRecentApplications(mockApplications, 5);

  return (
    <>
      <DashboardDesktopView
        stats={stats}
        distribution={distribution}
        recent={recent}
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
