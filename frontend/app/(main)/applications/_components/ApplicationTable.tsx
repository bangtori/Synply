import { Avatar } from '@/components/ui/Avatar';
import { ResumeFileChip } from '@/components/ui/ResumeFileChip';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TechTag } from '@/components/ui/TechTag';
import type { Application } from '@/types/application';
import { cn } from '@/utils/cn';
import { formatMonthDay } from '@/utils/date';

export interface ApplicationTableProps {
  applications: Application[];
  fileNameById: Record<string, string>;
}

const COLS =
  'grid-cols-[2.4fr_1.1fr_0.95fr_1.7fr_0.8fr_1.15fr]';

const HEADERS = ['회사 · 직무', '전형 상태', '플랫폼', '기술 스택', '지원일', '이력서'];

export function ApplicationTable({
  applications,
  fileNameById,
}: ApplicationTableProps) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-border-subtle bg-surface-card">
      <div
        className={cn(
          'grid items-center gap-2 border-b border-border-subtle px-6 py-3',
          COLS,
        )}
      >
        {HEADERS.map((header) => (
          <div
            key={header}
            className="font-mono text-3xs font-semibold uppercase tracking-[0.07em] text-text-subtle"
          >
            {header}
          </div>
        ))}
      </div>

      {applications.map((application) => (
        <div
          key={application.id}
          className={cn(
            'grid items-center gap-2 border-b border-border-subtle px-6 py-3 transition last:border-0 hover:bg-violet-50',
            COLS,
          )}
        >
          <div className="flex min-w-0 items-center gap-3">
            <Avatar initial={application.companyInitial} size={36} />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink-900">
                {application.companyName}
              </p>
              <p className="truncate text-2xs text-text-muted">
                {application.positionTitle}
              </p>
            </div>
          </div>

          <div>
            <StatusBadge status={application.status} />
          </div>

          <div className="text-xs text-text-body">
            {application.platform}
          </div>

          <div className="flex flex-wrap gap-1">
            {application.techStacks.map((stack) => (
              <TechTag key={stack} label={stack} />
            ))}
          </div>

          <div className="font-mono text-2xs text-text-muted">
            {formatMonthDay(application.appliedAt)}
          </div>

          <div>
            <ResumeFileChip
              connected={application.submissionFileId !== null}
              fileName={
                application.submissionFileId
                  ? fileNameById[application.submissionFileId]
                  : undefined
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}
