import type { InputHTMLAttributes } from 'react';
import { Search } from 'lucide-react';

import { cn } from '@/utils/cn';

export type SearchInputProps = InputHTMLAttributes<HTMLInputElement>;

export function SearchInput({ className, ...props }: SearchInputProps) {
  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle"
        size={16}
        strokeWidth={2}
        aria-hidden
      />
      <input
        type="search"
        className={cn(
          'w-full rounded-input border-[1.5px] border-border-default bg-surface-card py-[11px] pl-[38px] pr-[13px] text-sm text-ink-900',
          'placeholder:text-text-subtle focus:border-brand focus:shadow-[var(--focus-ring)] focus:outline-none',
          className,
        )}
        {...props}
      />
    </div>
  );
}
