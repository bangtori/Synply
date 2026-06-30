import type { StatusDistributionItem } from '@/lib/selectors/statusDistribution';
import { cn } from '@/utils/cn';

export interface DistributionBarProps {
  items: StatusDistributionItem[];
  className?: string;
}

// 세그먼트 바 + 범례. 색은 토큰 var를 style로 주입한다(컨벤션 §12-2).
export function DistributionBar({ items, className }: DistributionBarProps) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex h-[14px] gap-0.5 overflow-hidden rounded-full bg-surface-sunken">
        {items.map((item) => (
          <div
            key={item.status}
            style={{ flexGrow: item.count, background: item.colorVar }}
            aria-hidden
          />
        ))}
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
        {items.map((item) => (
          <li key={item.status} className="inline-flex items-center gap-1.5">
            <span
              className="size-[9px] rounded-full"
              style={{ background: item.colorVar }}
              aria-hidden
            />
            <span className="text-[12px] text-text-muted">{item.label}</span>
            <span className="font-mono text-[12px] font-medium text-text-body">
              {item.count}
            </span>
          </li>
        ))}
      </ul>
      {total === 0 && (
        <p className="text-[12px] text-text-subtle">데이터 없음</p>
      )}
    </div>
  );
}
