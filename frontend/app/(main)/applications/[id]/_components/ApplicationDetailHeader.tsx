import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/Button';

export interface ApplicationDetailHeaderProps {
  onEdit: () => void;
  onDelete: () => void;
}

// 뒤로가기 + 수정/삭제 헤더
export function ApplicationDetailHeader({
  onEdit,
  onDelete,
}: ApplicationDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between px-8 pb-4 pt-6">
      <Link
        href="/applications"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-body"
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
  );
}
