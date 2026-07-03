import type { SubmissionFile } from '@/types/submissionFile';

import { SubmissionFileCard } from './SubmissionFileCard';
import { SubmissionFileUpload } from './SubmissionFileUpload';

export interface SubmissionFilesMobileViewProps {
  files: SubmissionFile[];
  onDeleteClick: (file: SubmissionFile) => void;
}

export function SubmissionFilesMobileView({
  files,
  onDeleteClick,
}: SubmissionFilesMobileViewProps) {
  return (
    <div className="flex flex-col gap-4 px-4 py-5">
      <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-ink-950">
        이력서 파일
      </h1>
      <SubmissionFileUpload />
      <div className="flex flex-col gap-3">
        {files.map((file) => (
          <SubmissionFileCard
            key={file.id}
            file={file}
            onDeleteClick={onDeleteClick}
          />
        ))}
      </div>
      <p className="text-2xs text-text-subtle">
        연결된 지원 건이 있는 파일은 삭제할 수 없어요. 먼저 지원 기록에서 연결을
        해제하세요.
      </p>
    </div>
  );
}
