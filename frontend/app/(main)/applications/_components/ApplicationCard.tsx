import Link from 'next/link';

import { Avatar } from '@/components/ui/Avatar';
import { ResumeFileChip } from '@/components/ui/ResumeFileChip';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { Application } from '@/types/application';
import { formatMonthDay } from '@/utils/date';

export interface ApplicationCardProps {
  application: Application;
  fileName?: string;
}

// 모바일 지원 카드 (리스트/칸반 단일 컬럼 공용). 카드 전체가 상세로 가는 링크.
export function ApplicationCard({ application, fileName }: ApplicationCardProps) {
  return (
    <Link
      href={`/applications/${application.id}`}
      aria-label={`${application.companyName} · ${application.positionTitle} 상세 보기`}
      className="block rounded-[18px] border border-border-subtle bg-surface-card p-4 no-underline"
    >
      <div className="flex items-center gap-3">
        <Avatar initial={application.companyInitial} size={38} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-ink-900">
            {application.companyName}
          </p>
          <p className="truncate text-2xs text-text-muted">
            {application.positionTitle}
          </p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-border-subtle pt-3">
        <span className="font-mono text-2xs text-text-muted">
          {application.platform} · {formatMonthDay(application.appliedAt)}
        </span>
        <ResumeFileChip
          connected={application.submissionFileId !== null}
          fileName={fileName}
        />
      </div>
    </Link>
  );
}
