import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import type { ViewMode } from '@/components/ui/ViewToggle';
import type { KanbanColumn } from '@/lib/selectors/kanbanColumns';
import type { Application } from '@/types/application';

import { ApplicationKanban } from './ApplicationKanban';
import { ApplicationTable } from './ApplicationTable';
import { ApplicationsEmptyFirst } from './ApplicationsEmptyFirst';
import { ApplicationsEmptyNoResult } from './ApplicationsEmptyNoResult';
import { ApplicationsToolbar } from './ApplicationsToolbar';

export interface ApplicationsDesktopViewProps {
  applications: Application[];
  fileNameById: Record<string, string>;
  kanbanColumns: KanbanColumn[];
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onRegister: () => void;
  emptyState?: 'first' | 'no-result';
}

export function ApplicationsDesktopView({
  applications,
  fileNameById,
  kanbanColumns,
  view,
  onViewChange,
  onRegister,
  emptyState,
}: ApplicationsDesktopViewProps) {
  return (
    <>
      <PageHeader
        eyebrow="Applications"
        title="지원 기록"
        action={<Button onClick={onRegister}>지원 기록 등록</Button>}
      />

      <div className="flex flex-col gap-4 px-8 pb-8">
        {emptyState === 'first' ? (
          <ApplicationsEmptyFirst onRegister={onRegister} />
        ) : emptyState === 'no-result' ? (
          <ApplicationsEmptyNoResult />
        ) : (
          <>
            <ApplicationsToolbar
              view={view}
              onViewChange={onViewChange}
              total={applications.length}
            />

            {view === 'list' ? (
              <ApplicationTable
                applications={applications}
                fileNameById={fileNameById}
              />
            ) : (
              <ApplicationKanban
                columns={kanbanColumns}
                fileNameById={fileNameById}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}
