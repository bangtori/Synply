import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

import { ResumeFileChip } from '@/components/ui/ResumeFileChip';
import type { Application } from '@/types/application';
import { formatMonthDay } from '@/utils/date';

export interface ApplicationKanbanCardProps {
  application: Application;
  fileName?: string;
}

export function ApplicationKanbanCard({
  application,
  fileName,
}: ApplicationKanbanCardProps) {
  return (
    <article className="rounded-[12px] border border-border-subtle bg-surface-card p-3 shadow-card">
      <Link href={`/applications/${application.id}`} className="block">
        <p className="truncate text-sm font-bold text-ink-900 hover:text-brand">
          {application.companyName}
        </p>
        <p className="truncate text-2xs text-text-muted">
          {application.positionTitle}
        </p>
      </Link>
      <p className="mt-2 font-mono text-3xs text-text-subtle">
        {application.platform} · {formatMonthDay(application.appliedAt)}
      </p>

      <div className="mt-2 flex flex-col gap-1.5 border-t border-border-subtle pt-2">
        <ResumeFileChip
          connected={application.submissionFileId !== null}
          fileName={fileName}
        />
        {/* 상태 변경: 표현용(메뉴/실제 변경 로직은 범위 밖) */}
        <button
          type="button"
          className="inline-flex w-fit items-center gap-0.5 rounded-full px-2 py-1 text-3xs font-semibold text-text-muted transition hover:bg-surface-sunken"
        >
          상태 변경
          <ChevronDown size={12} strokeWidth={2.5} aria-hidden />
        </button>
      </div>
    </article>
  );
}
