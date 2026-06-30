import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { ApplicationStatus } from '@/constants/applicationStatus';
import type { Application } from '@/types/application';

export interface ApplicationDetailTitleProps {
  application: Application;
  status: ApplicationStatus;
}

// 회사·직무 타이틀 + 현재 상태 배지
export function ApplicationDetailTitle({
  application,
  status,
}: ApplicationDetailTitleProps) {
  return (
    <div className="flex items-center gap-4 px-8 pb-6">
      <Avatar initial={application.companyInitial} size={56} />
      <div className="min-w-0">
        <h1 className="text-section font-extrabold text-ink-950">
          {application.companyName}
        </h1>
        <p className="text-sm text-text-muted">{application.positionTitle}</p>
      </div>
      <StatusBadge status={status} className="ml-1" />
    </div>
  );
}
