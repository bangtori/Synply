'use client';

import { useState } from 'react';

import type { ApplicationStatus } from '@/constants/applicationStatus';
import type { KanbanColumn } from '@/lib/selectors/kanbanColumns';
import { cn } from '@/utils/cn';

import { ApplicationCard } from './ApplicationCard';

export interface MobileKanbanProps {
  columns: KanbanColumn[];
  fileNameById: Record<string, string>;
}

type Selected = ApplicationStatus | 'all';

function StatusChip({
  active,
  label,
  count,
  colorVar,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  colorVar?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border-[1.5px] px-3.5 py-2 text-2xs font-semibold transition',
        active
          ? 'border-brand bg-brand text-white'
          : 'border-border-default bg-surface-card text-text-body',
      )}
    >
      {colorVar && (
        <span
          className="size-[7px] rounded-full"
          style={{ background: active ? 'var(--white)' : colorVar }}
          aria-hidden
        />
      )}
      {label} {count}
    </button>
  );
}

// 모바일 칸반: 상태 필터칩(가로 스크롤) + 선택 상태의 단일 컬럼 카드.
export function MobileKanban({ columns, fileNameById }: MobileKanbanProps) {
  const [selected, setSelected] = useState<Selected>('all');

  const total = columns.reduce((sum, column) => sum + column.count, 0);
  const items =
    selected === 'all'
      ? columns.flatMap((column) => column.items)
      : (columns.find((column) => column.status === selected)?.items ?? []);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 overflow-x-auto px-4 pb-1">
        <StatusChip
          active={selected === 'all'}
          label="전체"
          count={total}
          onClick={() => setSelected('all')}
        />
        {columns.map((column) => (
          <StatusChip
            key={column.status}
            active={selected === column.status}
            label={column.label}
            count={column.count}
            colorVar={column.colorVar}
            onClick={() => setSelected(column.status)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 px-4">
        {items.length === 0 ? (
          <p className="py-10 text-center text-xs text-text-subtle">
            해당 상태의 지원 기록이 없어요.
          </p>
        ) : (
          items.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              fileName={
                application.submissionFileId
                  ? fileNameById[application.submissionFileId]
                  : undefined
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
