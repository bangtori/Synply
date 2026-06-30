import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { Application } from '@/types/application';
import { formatMonthDay } from '@/utils/date';

export interface RecentApplicationsCardProps {
  recent: Application[];
}

// 최근 지원 기록 (상위 N건)
export function RecentApplicationsCard({ recent }: RecentApplicationsCardProps) {
  return (
    <Card
      title="최근 지원 기록"
      action={
        <Link
          href="/applications"
          className="inline-flex items-center gap-0.5 text-[13px] font-semibold text-brand"
        >
          전체 보기
          <ChevronRight size={15} strokeWidth={2.5} aria-hidden />
        </Link>
      }
    >
      <ul className="divide-y divide-border-subtle">
        {recent.map((application) => (
          <li
            key={application.id}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar initial={application.companyInitial} size={36} />
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-bold text-ink-900">
                  {application.companyName}
                </p>
                <p className="truncate text-[11.5px] text-text-muted">
                  {application.positionTitle}
                </p>
              </div>
            </div>
            <StatusBadge status={application.status} />
            <span className="font-mono text-[11.5px] text-text-muted">
              {formatMonthDay(application.appliedAt)}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
