import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import type { ViewMode } from '@/components/ui/ViewToggle';
import type { Application } from '@/types/application';

import { ApplicationTable } from './ApplicationTable';
import { ApplicationsToolbar } from './ApplicationsToolbar';

export interface ApplicationsDesktopViewProps {
  applications: Application[];
  fileNameById: Record<string, string>;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ApplicationsDesktopView({
  applications,
  fileNameById,
  view,
  onViewChange,
}: ApplicationsDesktopViewProps) {
  return (
    <>
      <PageHeader
        eyebrow="Applications"
        title="지원 기록"
        action={<Button>지원 기록 등록</Button>}
      />

      <div className="flex flex-col gap-4 px-8 pb-8">
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
          <div className="rounded-[18px] border border-dashed border-border-default bg-surface-card p-12 text-center text-sm text-text-muted">
            칸반 보드는 다음 단계(D-3)에서 구현됩니다.
          </div>
        )}
      </div>
    </>
  );
}
