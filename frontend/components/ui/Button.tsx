import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary:
    'bg-brand text-white shadow-brand hover:bg-brand-hover disabled:bg-ink-200 disabled:opacity-70 disabled:shadow-none',
  secondary:
    'bg-surface-card text-violet-700 border-[1.5px] border-border-brand hover:bg-brand-subtle hover:border-brand disabled:text-ink-400 disabled:border-border-subtle',
  ghost:
    'bg-transparent text-text-body hover:bg-surface-sunken active:bg-ink-100 disabled:text-ink-400',
  danger:
    'bg-danger-500 text-white hover:brightness-95 active:brightness-90 disabled:opacity-45',
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-6 text-[15px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-bold transition',
        'active:scale-[0.97] disabled:cursor-not-allowed disabled:active:scale-100',
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
