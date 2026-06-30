import { Download, FileText, Link2, Lock, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import type { SubmissionFile } from '@/types/submissionFile';
import { formatDot } from '@/utils/date';

export interface SubmissionFilesTableProps {
  files: SubmissionFile[];
  onDeleteClick: (file: SubmissionFile) => void;
}

const TH =
  'px-6 py-3 text-left font-mono text-3xs font-semibold uppercase tracking-[0.07em] text-text-subtle';
const TD = 'px-6 py-3 align-middle';

export function SubmissionFilesTable({
  files,
  onDeleteClick,
}: SubmissionFilesTableProps) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-border-subtle bg-surface-card">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col className="w-[39%]" />
          <col className="w-[16%]" />
          <col className="w-[24%]" />
          <col className="w-[21%]" />
        </colgroup>

        <thead>
          <tr className="border-b border-border-subtle">
            <th scope="col" className={TH}>
              파일명 · 버전
            </th>
            <th scope="col" className={TH}>
              업로드
            </th>
            <th scope="col" className={TH}>
              연결된 지원
            </th>
            <th scope="col" className={TH}>
              액션
            </th>
          </tr>
        </thead>

        <tbody>
          {files.map((file) => (
            <tr
              key={file.id}
              className="border-b border-border-subtle last:border-0"
            >
              <td className={TD}>
                <div className="flex min-w-0 items-center gap-3">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-input bg-surface-sunken text-text-muted">
                    <FileText size={16} strokeWidth={2} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink-900">
                      {file.fileName}
                    </p>
                    <p className="font-mono text-3xs text-text-muted">
                      {file.sizeLabel}
                    </p>
                  </div>
                </div>
              </td>

              <td className={`${TD} font-mono text-2xs text-text-muted`}>
                {formatDot(file.uploadedAt)}
              </td>

              <td className={TD}>
                {file.linkedLabel ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-violet-700">
                    <Link2 size={14} strokeWidth={2} aria-hidden />
                    {file.linkedLabel}
                  </span>
                ) : (
                  <span className="text-xs text-text-subtle">연결 없음</span>
                )}
              </td>

              <td className={TD}>
                <div className="flex items-center gap-1.5">
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
                      title="연결된 지원 건이 있어 삭제할 수 없어요"
                      onClick={() => onDeleteClick(file)}
                    >
                      <Lock size={14} strokeWidth={2} aria-hidden />
                      삭제
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
