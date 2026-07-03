import { Download, FileText } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { SubmissionFile } from '@/types/submissionFile';
import { formatDot } from '@/utils/date';

export interface LinkedResumeCardProps {
  submissionFile: SubmissionFile | null;
}

export function LinkedResumeCard({ submissionFile }: LinkedResumeCardProps) {
  return (
    <Card title="연결된 이력서">
      {submissionFile ? (
        <div className="flex items-center gap-3">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-input bg-surface-sunken text-text-muted">
            <FileText size={18} strokeWidth={2} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink-900">
              {submissionFile.fileName}
            </p>
            <p className="font-mono text-3xs text-text-muted">
              {submissionFile.sizeLabel} · {formatDot(submissionFile.uploadedAt)}
            </p>
          </div>
          <Button variant="secondary" size="sm">
            <Download size={14} strokeWidth={2} aria-hidden />
            다운로드
          </Button>
        </div>
      ) : (
        <p className="text-xs text-text-subtle">연결된 이력서가 없어요.</p>
      )}
      <p className="mt-3 text-3xs text-text-subtle">
        파일 변경·연결 해제는 “수정”에서 처리합니다.
      </p>
    </Card>
  );
}
