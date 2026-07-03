'use client';

import { useState } from 'react';

import { ApplicationFormDrawer } from '@/components/domain/applications/ApplicationFormDrawer';
import { FilterChip } from '@/components/ui/FilterChip';
import { SearchInput } from '@/components/ui/SearchInput';
import { ViewToggle, type ViewMode } from '@/components/ui/ViewToggle';
import type { KanbanColumn } from '@/lib/selectors/kanbanColumns';
import type { Application } from '@/types/application';

import { ApplicationCard } from './ApplicationCard';
import { ApplicationsEmptyFirst } from './ApplicationsEmptyFirst';
import { ApplicationsEmptyNoResult } from './ApplicationsEmptyNoResult';
import { ApplicationsFilterSheet } from './ApplicationsFilterSheet';
import { MobileKanban } from './MobileKanban';

export interface ApplicationsMobileViewProps {
  applications: Application[];
  fileNameById: Record<string, string>;
  kanbanColumns: KanbanColumn[];
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  emptyState?: 'first' | 'no-result';
}

function MobileTitle() {
  return (
    <h1 className="px-4 pt-4 text-2xl font-extrabold tracking-[-0.02em] text-ink-950">
      지원 기록
    </h1>
  );
}

export function ApplicationsMobileView({
  applications,
  fileNameById,
  kanbanColumns,
  view,
  onViewChange,
  emptyState,
}: ApplicationsMobileViewProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  if (emptyState === 'first') {
    return (
      <>
        <MobileTitle />
        <ApplicationsEmptyFirst onRegister={() => setCreateOpen(true)} />
        <ApplicationFormDrawer
          open={createOpen}
          mode="create"
          onClose={() => setCreateOpen(false)}
        />
      </>
    );
  }

  if (emptyState === 'no-result') {
    return (
      <>
        <MobileTitle />
        <div className="px-4 pt-3">
          <ApplicationsEmptyNoResult />
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-3 py-4">
      <div className="flex flex-col gap-3 px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-ink-950">
            지원 기록
          </h1>
          <ViewToggle value={view} onChange={onViewChange} />
        </div>

        {view === 'list' && (
          <>
            <SearchInput placeholder="회사·직무 검색" />
            <div className="flex items-center justify-between">
              <FilterChip onClick={() => setFilterOpen(true)}>필터</FilterChip>
              <span className="text-2xs text-text-muted">
                전체{' '}
                <span className="font-bold text-ink-900">
                  {applications.length}
                </span>
                건
              </span>
            </div>
          </>
        )}
      </div>

      {view === 'list' ? (
        <div className="flex flex-col gap-3 px-4">
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              fileName={
                application.submissionFileId
                  ? fileNameById[application.submissionFileId]
                  : undefined
              }
            />
          ))}
        </div>
      ) : (
        <MobileKanban columns={kanbanColumns} fileNameById={fileNameById} />
      )}

      <ApplicationsFilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
      />
    </div>
  );
}
