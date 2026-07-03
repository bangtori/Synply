import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

export interface EmptyStateProps {
  /** 마스코트(첫 진입) 모드 — true면 토리 마스코트, false면 icon 표시 */
  mascot?: boolean;
  /** mascot=false일 때 가운데 표시할 아이콘 (예: 검색 아이콘) */
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  /** CTA 영역 (버튼 등) */
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  mascot = false,
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 px-6 py-16 text-center',
        className,
      )}
    >
      {mascot ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/tori-face-cutout.png"
          alt=""
          width={104}
          height={104}
          className="animate-tori-float"
        />
      ) : (
        icon && (
          <div className="flex size-16 items-center justify-center rounded-full bg-surface-sunken text-text-subtle">
            {icon}
          </div>
        )
      )}
      <div className="flex flex-col gap-2">
        <h2 className="text-section font-extrabold text-ink-950">{title}</h2>
        {description && (
          <p className="max-w-sm text-sm leading-relaxed text-text-muted">
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
