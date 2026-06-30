import { cn } from '@/utils/cn';

export interface AvatarProps {
  /** 초성/이니셜 (예: 'T', '당') */
  initial: string;
  /** 한 변 길이(px) */
  size?: number;
  className?: string;
}

export function Avatar({ initial, size = 36, className }: AvatarProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-brand-subtle font-bold text-violet-700',
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
      aria-hidden
    >
      {initial}
    </span>
  );
}
