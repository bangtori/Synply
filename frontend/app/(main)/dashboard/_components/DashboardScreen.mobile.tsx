import type { ApplicationStats } from '@/lib/selectors/applicationStats';
import type { StatusDistributionItem } from '@/lib/selectors/statusDistribution';
import type { Application } from '@/types/application';

import { DashboardStats } from './DashboardStats';
import { RecentApplicationsCard } from './RecentApplicationsCard';
import { StatusDistributionCard } from './StatusDistributionCard';

export interface DashboardMobileViewProps {
  stats: ApplicationStats;
  distribution: StatusDistributionItem[];
  recent: Application[];
}

// 모바일: 통계 2×2 + 분포 + 최근 3건을 단일 컬럼으로 쌓는다.
// (DashboardStats는 grid-cols-2라 모바일에서 2×2)
export function DashboardMobileView({
  stats,
  distribution,
  recent,
}: DashboardMobileViewProps) {
  return (
    <div className="flex flex-col gap-5 px-4 py-5">
      <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-ink-950">
        대시보드
      </h1>
      <DashboardStats stats={stats} />
      <StatusDistributionCard distribution={distribution} />
      <RecentApplicationsCard recent={recent} />
    </div>
  );
}
