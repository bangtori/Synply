import type { ReactNode } from 'react';

// 라벨/값 한 줄 (공고 정보·기록 정보 카드 공용)
export function InfoRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="shrink-0 text-xs text-text-muted">{label}</span>
      <span className="min-w-0 text-right text-xs text-text-body">
        {children}
      </span>
    </div>
  );
}
