import { Upload } from 'lucide-react';

import { Button } from '@/components/ui/Button';

// 인라인 업로드 영역 (진행률% 미표시). 실제 업로드 로직은 범위 밖.
export function SubmissionFileUpload() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-[18px] border-2 border-dashed border-border-brand bg-surface-brand-soft py-10 text-center">
      <span className="inline-flex size-11 items-center justify-center rounded-full bg-surface-card text-brand shadow-card">
        <Upload size={20} strokeWidth={2} aria-hidden />
      </span>
      <p className="mt-1 text-sm font-bold text-ink-900">파일 업로드</p>
      <p className="text-xs text-text-muted">
        PDF 권장 · 진행률(%)은 표시하지 않습니다
      </p>
      <Button variant="secondary" size="sm" className="mt-1">
        파일 선택
      </Button>
    </div>
  );
}
