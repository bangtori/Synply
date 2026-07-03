import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import type { ApplicationStats } from '@/lib/selectors/applicationStats';
import type { StatusDistributionItem } from '@/lib/selectors/statusDistribution';
import type { Application } from '@/types/application';

import { DashboardStats } from './DashboardStats';
import { RecentApplicationsCard } from './RecentApplicationsCard';
import { StatusDistributionCard } from './StatusDistributionCard';

export interface DashboardDesktopViewProps {
  stats: ApplicationStats;
  distribution: StatusDistributionItem[];
  recent: Application[];
  onRegister: () => void;
}

export function DashboardDesktopView({
  stats,
  distribution,
  recent,
  onRegister,
}: DashboardDesktopViewProps) {
  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="대시보드"
        action={<Button onClick={onRegister}>지원 기록 등록</Button>}
      />

      <div className="flex flex-col gap-6 px-8 pb-8">
        <DashboardStats stats={stats} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.5fr]">
          <StatusDistributionCard distribution={distribution} />
          <RecentApplicationsCard recent={recent} />
        </div>
      </div>
    </>
  );
}
