'use client';

import { useState } from 'react';

import { MobileSheet } from '@/components/layout/MobileSheet';
import { Button } from '@/components/ui/Button';
import {
  STATUS_CONFIG,
  STATUS_ORDER,
  type ApplicationStatus,
} from '@/constants/applicationStatus';
import { cn } from '@/utils/cn';

const SORTS = ['지원일 ↓', '지원일 ↑', '마감 임박'];

export interface ApplicationsFilterSheetProps {
  open: boolean;
  onClose: () => void;
}

// 모바일 필터 바텀시트. 선택 상태 표현까지만 (실제 필터링/정렬은 기능 단계).
export function ApplicationsFilterSheet({
  open,
  onClose,
}: ApplicationsFilterSheetProps) {
  const [statuses, setStatuses] = useState<ApplicationStatus[]>([]);
  const [sort, setSort] = useState(SORTS[0]);

  const toggleStatus = (status: ApplicationStatus) =>
    setStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((item) => item !== status)
        : [...prev, status],
    );

  const reset = () => {
    setStatuses([]);
    setSort(SORTS[0]);
  };

  return (
    <MobileSheet
      open={open}
      onClose={onClose}
      title="필터"
      footer={
        <>
          <Button variant="ghost" onClick={reset}>
            초기화
          </Button>
          <Button className="flex-1" onClick={onClose}>
            결과 보기
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <section className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-text-body">전형 상태</p>
          <div className="flex flex-wrap gap-2">
            {STATUS_ORDER.map((status) => {
              const active = statuses.includes(status);
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => toggleStatus(status)}
                  className={cn(
                    'rounded-full px-3.5 py-2 text-2xs font-bold transition',
                    active
                      ? STATUS_CONFIG[status].badgeClassName
                      : 'border border-border-default bg-surface-card text-text-muted',
                  )}
                >
                  {STATUS_CONFIG[status].label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-text-body">정렬</p>
          <div className="flex flex-wrap gap-2">
            {SORTS.map((item) => {
              const active = item === sort;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSort(item)}
                  className={cn(
                    'rounded-full border-[1.5px] px-3.5 py-2 text-2xs font-semibold transition',
                    active
                      ? 'border-brand bg-brand-subtle text-violet-700'
                      : 'border-border-default bg-surface-card text-text-body',
                  )}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </MobileSheet>
  );
}
