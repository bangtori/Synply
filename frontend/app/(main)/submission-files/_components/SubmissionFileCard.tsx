import { Download, FileText, Link2, Lock, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import type { SubmissionFile } from '@/types/submissionFile';
import { formatDot } from '@/utils/date';

export interface SubmissionFileCardProps {
  file: SubmissionFile;
  onDeleteClick: (file: SubmissionFile) => void;
}

// 모바일 이력서 파일 카드
export function SubmissionFileCard({
  file,
  onDeleteClick,
}: SubmissionFileCardProps) {
  return (
    <div className="rounded-[18px] border border-border-subtle bg-surface-card p-4">
      <div className="flex items-center gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-input bg-surface-sunken text-text-muted">
          <FileText size={18} strokeWidth={2} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-ink-900">
            {file.fileName}
          </p>
          <p className="font-mono text-3xs text-text-muted">
            {file.sizeLabel} · {formatDot(file.uploadedAt)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-border-subtle pt-3">
        {file.linkedLabel ? (
          <span className="inline-flex min-w-0 items-center gap-1.5 text-2xs text-violet-700">
            <Link2 size={13} strokeWidth={2} aria-hidden />
            <span className="truncate">{file.linkedLabel}</span>
          </span>
        ) : (
          <span className="text-2xs text-text-subtle">연결 없음</span>
        )}

        <div className="flex shrink-0 items-center gap-1">
          <Button variant="ghost" size="sm">
            <Download size={14} strokeWidth={2} aria-hidden />
            다운로드
          </Button>
          {file.deletable ? (
            <Button
              variant="ghost"
              size="sm"
              className="text-danger-500 hover:bg-danger-100"
              onClick={() => onDeleteClick(file)}
            >
              <Trash2 size={14} strokeWidth={2} aria-hidden />
              삭제
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-text-subtle"
              onClick={() => onDeleteClick(file)}
            >
              <Lock size={14} strokeWidth={2} aria-hidden />
              삭제
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
