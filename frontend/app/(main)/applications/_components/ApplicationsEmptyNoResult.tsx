import { Search } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { FilterChip } from '@/components/ui/FilterChip';
import { SearchInput } from '@/components/ui/SearchInput';

// 검색/필터 결과 없음 빈 상태 — 적용된 검색어·필터 명시 + 필터 초기화.
// 적용된 조건은 시안과 동일한 데모 값(실제 검색/필터링은 기능 단계).
export function ApplicationsEmptyNoResult() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-[270px]">
          <SearchInput defaultValue="배달" placeholder="회사·직무 검색" />
        </div>
        <FilterChip variant="removable">면접중</FilterChip>
        <FilterChip variant="removable">원티드</FilterChip>
        <button
          type="button"
          className="text-xs font-semibold text-text-muted transition hover:text-text-body"
        >
          필터 초기화
        </button>
      </div>

      <EmptyState
        icon={<Search size={28} strokeWidth={2} aria-hidden />}
        title="조건에 맞는 지원 기록이 없어요"
        description="‘배달’ + 면접중 + 원티드 조건에 해당하는 기록이 없습니다. 검색어나 필터를 바꿔 보세요."
        action={<Button variant="secondary">필터 초기화</Button>}
      />
    </div>
  );
}
