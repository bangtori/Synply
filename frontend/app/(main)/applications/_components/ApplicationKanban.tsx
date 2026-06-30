import type { KanbanColumn } from '@/lib/selectors/kanbanColumns';

import { ApplicationKanbanCard } from './ApplicationKanbanCard';

export interface ApplicationKanbanProps {
  columns: KanbanColumn[];
  fileNameById: Record<string, string>;
}

// 6단계 칸반 보드 (드래그 없음). 컬럼별 개수 + 카드 목록.
export function ApplicationKanban({
  columns,
  fileNameById,
}: ApplicationKanbanProps) {
  return (
    <div className="flex gap-3">
      {columns.map((column) => (
        <section
          key={column.status}
          className="flex min-w-0 flex-1 flex-col gap-2 rounded-[18px] bg-surface-sunken p-3"
        >
          <header className="flex items-center gap-2 px-1">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ background: column.colorVar }}
              aria-hidden
            />
            <h2 className="truncate text-xs font-bold text-ink-900">
              {column.label}
            </h2>
            <span className="ml-auto font-mono text-2xs text-text-muted">
              {column.count}
            </span>
          </header>

          <div className="flex flex-col gap-2">
            {column.items.map((application) => (
              <ApplicationKanbanCard
                key={application.id}
                application={application}
                fileName={
                  application.submissionFileId
                    ? fileNameById[application.submissionFileId]
                    : undefined
                }
              />
            ))}
            {column.items.length === 0 && (
              <p className="px-1 py-3 text-center text-2xs text-text-subtle">
                없음
              </p>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
