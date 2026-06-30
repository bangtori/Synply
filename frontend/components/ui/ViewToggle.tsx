import { cn } from '@/utils/cn';

export type ViewMode = 'list' | 'kanban';

export interface ViewToggleProps {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
  className?: string;
}

const OPTIONS: { value: ViewMode; label: string }[] = [
  { value: 'list', label: '리스트' },
  { value: 'kanban', label: '칸반' },
];

export function ViewToggle({ value, onChange, className }: ViewToggleProps) {
  return (
    <div
      className={cn(
        'inline-flex gap-0.5 rounded-full bg-surface-sunken p-[3px]',
        className,
      )}
      role="tablist"
    >
      {OPTIONS.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-full px-3 py-1 text-[13px] transition',
              active
                ? 'bg-brand font-bold text-white'
                : 'font-semibold text-text-muted',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
