import type { ReactNode } from 'react';
import { ChevronDown, X } from 'lucide-react';

import { cn } from '@/utils/cn';

export type FilterChipVariant = 'default' | 'active' | 'selected' | 'removable';

export interface FilterChipProps {
  children: ReactNode;
  variant?: FilterChipVariant;
  onClick?: () => void;
  /** removable variant에서 × 클릭 시 */
  onRemove?: () => void;
  className?: string;
}

const VARIANT_CLASS: Record<FilterChipVariant, string> = {
  default: 'bg-surface-card text-text-body border-border-default',
  active: 'bg-brand text-white border-brand',
  selected: 'bg-brand-subtle text-violet-700 border-brand',
  removable: 'bg-brand-subtle text-violet-700 border-transparent',
};

const BASE =
  'inline-flex items-center gap-1.5 rounded-full border-[1.5px] px-3.5 py-[9px] text-[13px] font-semibold transition';

export function FilterChip({
  children,
  variant = 'default',
  onClick,
  onRemove,
  className,
}: FilterChipProps) {
  // removable: 본문은 비상호작용 span, × 만 실제 버튼 (버튼 중첩 방지)
  if (variant === 'removable') {
    return (
      <span className={cn(BASE, VARIANT_CLASS.removable, className)}>
        {children}
        <button
          type="button"
          aria-label="필터 제거"
          onClick={onRemove}
          className="ml-0.5 inline-flex opacity-60 hover:opacity-100"
        >
          <X size={13} strokeWidth={2.5} aria-hidden />
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(BASE, VARIANT_CLASS[variant], className)}
    >
      {variant === 'active' && (
        <span className="size-[7px] rounded-full bg-white" aria-hidden />
      )}
      {children}
      {variant === 'default' && (
        <ChevronDown size={14} strokeWidth={2.5} aria-hidden />
      )}
    </button>
  );
}
