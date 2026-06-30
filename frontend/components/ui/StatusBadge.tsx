import {
  STATUS_CONFIG,
  type ApplicationStatus,
} from '@/constants/applicationStatus';
import { cn } from '@/utils/cn';

export interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const meta = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-[0.85em] py-[0.55em] text-xs font-bold leading-none',
        meta.badgeClassName,
        className,
      )}
    >
      {meta.label}
    </span>
  );
}
