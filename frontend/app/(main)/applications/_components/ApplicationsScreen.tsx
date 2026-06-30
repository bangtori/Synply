'use client';

import { useState } from 'react';

import type { ViewMode } from '@/components/ui/ViewToggle';
import { mockApplications } from '@/lib/mock/applications';
import { mockSubmissionFiles } from '@/lib/mock/submissionFiles';
import { getKanbanColumns } from '@/lib/selectors/kanbanColumns';

import { ApplicationsDesktopView } from './ApplicationsScreen.desktop';

// 컨테이너: 리스트/칸반 뷰 토글 등 표현용 상태를 관리한다.
// (실제 필터링/정렬/검색 로직은 범위 밖 — 사용자 직접 구현)
export function ApplicationsScreen() {
  const [view, setView] = useState<ViewMode>('list');

  const applications = mockApplications;
  const fileNameById = Object.fromEntries(
    mockSubmissionFiles.map((file) => [file.id, file.fileName]),
  );
  const kanbanColumns = getKanbanColumns(applications);

  return (
    <ApplicationsDesktopView
      applications={applications}
      fileNameById={fileNameById}
      kanbanColumns={kanbanColumns}
      view={view}
      onViewChange={setView}
    />
  );
}
