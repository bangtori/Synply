import { FilterChip } from '@/components/ui/FilterChip';
import { SearchInput } from '@/components/ui/SearchInput';
import { ViewToggle, type ViewMode } from '@/components/ui/ViewToggle';

export interface ApplicationsToolbarProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  total: number;
}

// 검색 + 필터 칩 + 정렬 + 뷰 토글. 필터/정렬은 표현용(실제 적용 로직은 범위 밖).
export function ApplicationsToolbar({
  view,
  onViewChange,
  total,
}: ApplicationsToolbarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-[270px]">
          <SearchInput placeholder="회사·직무 검색" />
        </div>
        <FilterChip>전형 상태</FilterChip>
        <FilterChip>플랫폼</FilterChip>
        <FilterChip>기술 스택</FilterChip>
        <FilterChip>이력서 버전</FilterChip>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-text-muted">정렬 · 지원일 ↓</span>
          <ViewToggle value={view} onChange={onViewChange} />
        </div>
      </div>

      <p className="text-xs text-text-muted">
        전체 지원 기록{' '}
        <span className="font-bold text-ink-900">{total}</span>건
      </p>
    </div>
  );
}
