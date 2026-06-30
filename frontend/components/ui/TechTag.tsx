import { X } from 'lucide-react';

import { cn } from '@/utils/cn';

export type TechTagVariant = 'readonly' | 'removable';

export interface TechTagProps {
  label: string;
  variant?: TechTagVariant;
  onRemove?: () => void;
  className?: string;
}

export function TechTag({
  label,
  variant = 'readonly',
  onRemove,
  className,
}: TechTagProps) {
  if (variant === 'removable') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full bg-brand-subtle px-2 py-0.5 font-mono text-xs font-semibold text-violet-700',
          className,
        )}
      >
        {label}
        <button
          type="button"
          aria-label={`${label} 제거`}
          onClick={onRemove}
          className="inline-flex opacity-70 hover:opacity-100"
        >
          <X size={12} strokeWidth={2.5} aria-hidden />
        </button>
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-border-subtle bg-ink-50 px-2 py-0.5 font-mono text-[11px] text-text-muted',
        className,
      )}
    >
      {label}
    </span>
  );
}
