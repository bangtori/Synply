import { Card } from '@/components/ui/Card';
import type { Application } from '@/types/application';
import { formatDot } from '@/utils/date';

import { InfoRow } from './InfoRow';

export interface RecordInfoCardProps {
  application: Application;
}

export function RecordInfoCard({ application }: RecordInfoCardProps) {
  return (
    <Card title="기록 정보">
      <div className="divide-y divide-border-subtle">
        <InfoRow label="지원일">{formatDot(application.appliedAt)}</InfoRow>
        <InfoRow label="등록일">{formatDot(application.createdAt)}</InfoRow>
      </div>
    </Card>
  );
}
