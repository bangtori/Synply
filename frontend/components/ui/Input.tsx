import type { InputHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error = false, className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full rounded-input border-[1.5px] bg-surface-card px-[13px] py-[11px] text-sm text-ink-900',
        'placeholder:text-text-subtle focus:outline-none',
        'disabled:bg-surface-sunken disabled:text-ink-400 disabled:border-border-subtle',
        error
          ? 'border-danger-500 focus:border-danger-500 focus:shadow-[0_0_0_3px_var(--danger-100)]'
          : 'border-border-default focus:border-brand focus:shadow-[var(--focus-ring)]',
        className,
      )}
      {...props}
    />
  );
}
