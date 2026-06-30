import {
  STATUS_CONFIG,
  STATUS_ORDER,
  type ApplicationStatus,
} from '@/constants/applicationStatus';
import { cn } from '@/utils/cn';

export interface StatusSelectorProps {
  selected: ApplicationStatus;
  onSelect: (status: ApplicationStatus) => void;
}

// 전형 상태 선택 칩. 선택된 상태는 배지 색, 나머지는 아웃라인. (표현용)
export function StatusSelector({ selected, onSelect }: StatusSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {STATUS_ORDER.map((status) => {
        const meta = STATUS_CONFIG[status];
        const active = status === selected;
        return (
          <button
            key={status}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(status)}
            className={cn(
              'rounded-full px-3.5 py-2 text-2xs font-bold transition',
              active
                ? meta.badgeClassName
                : 'border border-border-default bg-surface-card text-text-muted hover:bg-surface-sunken',
            )}
          >
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}
