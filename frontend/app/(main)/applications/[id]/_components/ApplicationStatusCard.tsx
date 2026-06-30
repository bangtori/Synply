import { ApplicationStatusSelector } from '@/components/domain/applications/ApplicationStatusSelector';
import { Card } from '@/components/ui/Card';
import type { ApplicationStatus } from '@/constants/applicationStatus';

export interface ApplicationStatusCardProps {
  selected: ApplicationStatus;
  onSelect: (status: ApplicationStatus) => void;
}

export function ApplicationStatusCard({
  selected,
  onSelect,
}: ApplicationStatusCardProps) {
  return (
    <Card title="전형 상태">
      <ApplicationStatusSelector selected={selected} onSelect={onSelect} />
    </Card>
  );
}
