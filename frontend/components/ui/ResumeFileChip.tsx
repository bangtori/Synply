import { FileText } from 'lucide-react';

import { cn } from '@/utils/cn';

export interface ResumeFileChipProps {
  /** 연결된 파일명 (connected일 때) */
  fileName?: string;
  /** 연결 여부 — false면 "이력서 미연결" 점선 칩 */
  connected: boolean;
  className?: string;
}

export function ResumeFileChip({
  fileName,
  connected,
  className,
}: ResumeFileChipProps) {
  if (!connected) {
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-full border border-dashed border-orange-300 bg-orange-50 px-2.5 py-1 text-2xs font-medium text-orange-600',
          className,
        )}
      >
        이력서 미연결
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs text-text-body',
        className,
      )}
    >
      <FileText size={15} strokeWidth={2} className="text-text-muted" aria-hidden />
      {fileName}
    </span>
  );
}
