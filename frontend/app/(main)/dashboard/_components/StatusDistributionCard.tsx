import { Card } from '@/components/ui/Card';
import { DistributionBar } from '@/components/ui/DistributionBar';
import type { StatusDistributionItem } from '@/lib/selectors/statusDistribution';

export interface StatusDistributionCardProps {
  distribution: StatusDistributionItem[];
}

// 상태별 지원 분포 (세그먼트 바 + 범례)
export function StatusDistributionCard({
  distribution,
}: StatusDistributionCardProps) {
  return (
    <Card title="상태별 지원 분포">
      <DistributionBar items={distribution} />
    </Card>
  );
}
