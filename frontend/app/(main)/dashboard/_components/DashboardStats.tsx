import { StatCard } from '@/components/ui/StatCard';
import type { ApplicationStats } from '@/lib/selectors/applicationStats';

export interface DashboardStatsProps {
  stats: ApplicationStats;
}

// 통계 4카드 (총 지원 / 진행 중 / 서류 합격률 / 최종 합격)
export function DashboardStats({ stats }: DashboardStatsProps) {
  const hasRate = stats.documentPassRate !== null;

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard label="총 지원" value={stats.total} suffix="건" />
      <StatCard label="진행 중" value={stats.active} suffix="건" />
      <StatCard
        label="서류 합격률"
        value={hasRate ? stats.documentPassRate : '—'}
        suffix={hasRate ? '%' : undefined}
        accent
      />
      <StatCard label="최종 합격" value={stats.finalPassCount} suffix="건" />
    </div>
  );
}
