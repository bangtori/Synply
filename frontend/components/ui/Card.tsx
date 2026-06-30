import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

export interface CardProps {
  /** 카드 헤더 제목 (없으면 헤더 영역 생략) */
  title?: string;
  /** 헤더 우측 액션 (링크/버튼 등) */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Card({ title, action, children, className }: CardProps) {
  const hasHeader = Boolean(title || action);

  return (
    <section
      className={cn(
        'rounded-[18px] border border-border-subtle bg-surface-card p-6 shadow-card',
        className,
      )}
    >
      {hasHeader && (
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h2 className="text-sm font-bold text-ink-900">{title}</h2>
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
