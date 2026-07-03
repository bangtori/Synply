import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

export interface PageHeaderProps {
  /** 상단 eyebrow (Mono CAPS, 영문/숫자만) */
  eyebrow: string;
  title: string;
  /** 우측 주 액션 (한 화면 Primary 1개) */
  action?: ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-end justify-between gap-4 px-8 pb-5 pt-[26px]',
        className,
      )}
    >
      <div>
        <p className="mb-[7px] font-mono text-3xs uppercase tracking-[0.08em] text-text-subtle">
          {eyebrow}
        </p>
        <h1 className="text-title font-extrabold tracking-[-0.02em] text-ink-950">
          {title}
        </h1>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
