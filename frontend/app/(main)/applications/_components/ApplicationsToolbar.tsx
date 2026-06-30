'use client';

import { useState } from 'react';

import { FilterChip } from '@/components/ui/FilterChip';
import { SearchInput } from '@/components/ui/SearchInput';
import { ViewToggle, type ViewMode } from '@/components/ui/ViewToggle';

export interface ApplicationsToolbarProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  total: number;
}

const FILTERS = ['전형 상태', '플랫폼', '기술 스택', '이력서 버전'];

export function ApplicationsToolbar({
  view,
  onViewChange,
  total,
}: ApplicationsToolbarProps) {
  // 필터 선택은 표현용 로컬 상태. 실제 목 데이터 필터링·URL 동기화·API는 범위 밖(기능 단계).
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (label: string) =>
    setActiveFilters((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );

  const resetFilters = () => setActiveFilters([]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-[270px]">
          <SearchInput placeholder="회사·직무 검색" />
        </div>

        {FILTERS.map((label) => {
          const active = activeFilters.includes(label);
          return (
            <FilterChip
              key={label}
              variant={active ? 'selected' : 'default'}
              onClick={() => toggleFilter(label)}
            >
              {label}
            </FilterChip>
          );
        })}

        {activeFilters.length > 0 && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-semibold text-text-muted transition hover:text-text-body"
          >
            필터 초기화
          </button>
        )}

        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-text-muted">정렬 · 지원일 ↓</span>
          <ViewToggle value={view} onChange={onViewChange} />
        </div>
      </div>

      <p className="text-xs text-text-muted">
        전체 지원 기록 <span className="font-bold text-ink-900">{total}</span>건
      </p>
    </div>
  );
}
