import type { ApplicationStatus } from '@/constants/applicationStatus';
import type { Application } from '@/types/application';
import type { SubmissionFile } from '@/types/submissionFile';

import { ApplicationDetailHeader } from './ApplicationDetailHeader';
import { ApplicationDetailTitle } from './ApplicationDetailTitle';
import { ApplicationStatusCard } from './ApplicationStatusCard';
import { LinkedResumeCard } from './LinkedResumeCard';
import { PostingInfoCard } from './PostingInfoCard';
import { RecordInfoCard } from './RecordInfoCard';
import { ResultMemoCard } from './ResultMemoCard';

export interface ApplicationDetailDesktopViewProps {
  application: Application;
  submissionFile: SubmissionFile | null;
  selectedStatus: ApplicationStatus;
  onSelectStatus: (status: ApplicationStatus) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ApplicationDetailDesktopView({
  application,
  submissionFile,
  selectedStatus,
  onSelectStatus,
  onEdit,
  onDelete,
}: ApplicationDetailDesktopViewProps) {
  return (
    <>
      <ApplicationDetailHeader onEdit={onEdit} onDelete={onDelete} />
      <div className="px-8 pb-6">
        <ApplicationDetailTitle application={application} status={selectedStatus} />
      </div>

      <div className="grid grid-cols-[1.6fr_1fr] gap-6 px-8 pb-8">
        <div className="flex flex-col gap-6">
          <ApplicationStatusCard
            selected={selectedStatus}
            onSelect={onSelectStatus}
          />
          <PostingInfoCard application={application} />
          <ResultMemoCard application={application} />
        </div>

        <div className="flex flex-col gap-6">
          <LinkedResumeCard submissionFile={submissionFile} />
          <RecordInfoCard application={application} />
        </div>
      </div>
    </>
  );
}
