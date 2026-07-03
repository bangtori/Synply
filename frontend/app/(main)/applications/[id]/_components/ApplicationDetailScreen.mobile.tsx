import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import type { ApplicationStatus } from '@/constants/applicationStatus';
import type { Application } from '@/types/application';
import type { SubmissionFile } from '@/types/submissionFile';

import { ApplicationDetailTitle } from './ApplicationDetailTitle';
import { ApplicationStatusCard } from './ApplicationStatusCard';
import { LinkedResumeCard } from './LinkedResumeCard';
import { PostingInfoCard } from './PostingInfoCard';
import { RecordInfoCard } from './RecordInfoCard';
import { ResultMemoCard } from './ResultMemoCard';

export interface ApplicationDetailMobileViewProps {
  application: Application;
  submissionFile: SubmissionFile | null;
  selectedStatus: ApplicationStatus;
  onSelectStatus: (status: ApplicationStatus) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ApplicationDetailMobileView({
  application,
  submissionFile,
  selectedStatus,
  onSelectStatus,
  onEdit,
  onDelete,
}: ApplicationDetailMobileViewProps) {
  return (
    <div className="flex flex-col">
      {/* 자체 헤더: 뒤로 + 수정/삭제 (셸 기본 헤더는 서브 라우트라 숨겨짐) */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border-subtle bg-surface-card px-4 py-3">
        <Link
          href="/applications"
          className="inline-flex items-center gap-1 text-xs font-semibold text-text-muted no-underline"
        >
          <ArrowLeft size={16} strokeWidth={2} aria-hidden />
          지원 기록
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onEdit}>
            수정
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-danger-500 hover:bg-danger-100"
            onClick={onDelete}
          >
            삭제
          </Button>
        </div>
      </div>

      {/* 본문 단일 컬럼 */}
      <div className="flex flex-col gap-5 px-4 py-5">
        <ApplicationDetailTitle
          application={application}
          status={selectedStatus}
        />
        <ApplicationStatusCard
          selected={selectedStatus}
          onSelect={onSelectStatus}
        />
        <PostingInfoCard application={application} />
        <LinkedResumeCard submissionFile={submissionFile} />
        <ResultMemoCard application={application} />
        <RecordInfoCard application={application} />
      </div>
    </div>
  );
}
