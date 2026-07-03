import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

export interface StatCardProps {
  label: string;
  value: ReactNode;
  /** 단위/접미사 (예: '건', '%') */
  suffix?: string;
  /** 강조 색(서류 합격률 등) — accent(주황) */
  accent?: boolean;
  className?: string;
}

export function StatCard({
  label,
  value,
  suffix,
  accent = false,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-[18px] border border-border-subtle bg-surface-card px-[22px] py-5 shadow-card',
        className,
      )}
    >
      <p className="text-3xs font-medium text-text-muted">{label}</p>
      <p
        className={cn(
          'mt-2 font-display text-stat leading-none',
          accent ? 'text-accent' : 'text-ink-950',
        )}
      >
        {value}
        {suffix && <span className="ml-0.5 text-lg">{suffix}</span>}
      </p>
    </div>
  );
}
