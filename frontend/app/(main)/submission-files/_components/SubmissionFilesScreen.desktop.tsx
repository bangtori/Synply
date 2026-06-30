import { PageHeader } from '@/components/layout/PageHeader';
import type { SubmissionFile } from '@/types/submissionFile';

import { SubmissionFileUpload } from './SubmissionFileUpload';
import { SubmissionFilesTable } from './SubmissionFilesTable';

export interface SubmissionFilesDesktopViewProps {
  files: SubmissionFile[];
  onDeleteClick: (file: SubmissionFile) => void;
}

export function SubmissionFilesDesktopView({
  files,
  onDeleteClick,
}: SubmissionFilesDesktopViewProps) {
  return (
    <>
      <PageHeader eyebrow="Resume Files" title="이력서 파일" />

      <div className="flex flex-col gap-4 px-8 pb-8">
        <SubmissionFileUpload />
        <SubmissionFilesTable files={files} onDeleteClick={onDeleteClick} />
        <p className="text-2xs text-text-subtle">
          연결된 지원 건이 있는 파일은 삭제할 수 없어요. 먼저 지원 기록에서 연결을
          해제하세요.
        </p>
      </div>
    </>
  );
}
