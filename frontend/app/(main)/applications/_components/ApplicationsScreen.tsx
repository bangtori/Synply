'use client';

import { useState } from 'react';

import type { ViewMode } from '@/components/ui/ViewToggle';
import { mockApplications } from '@/lib/mock/applications';
import { mockSubmissionFiles } from '@/lib/mock/submissionFiles';
import { getKanbanColumns } from '@/lib/selectors/kanbanColumns';

import { ApplicationFormDrawer } from '@/components/domain/applications/ApplicationFormDrawer';

import { ApplicationsDesktopView } from './ApplicationsScreen.desktop';

export interface ApplicationsScreenProps {
  /** 정적 빈 상태 검수용 프리뷰('first' | 'no-result'). 실제로는 데이터/필터링으로 결정됨 */
  emptyPreview?: string;
}

// 컨테이너: 리스트/칸반 뷰 토글 등 표현용 상태를 관리한다.
// (실제 필터링/정렬/검색 로직은 범위 밖 — 사용자 직접 구현)
export function ApplicationsScreen({ emptyPreview }: ApplicationsScreenProps) {
  // 리스트/칸반 토글은 표현용 로컬 상태라, 상세로 이동 후 뒤로가기/새로고침 시 'list'로 리셋된다.
  // 뒤로가기·공유에도 보존하려면 ?view 검색 파라미터 동기화가 필요(추후 기능 단계에서 직접 구현).
  const [view, setView] = useState<ViewMode>('list');
  const [createOpen, setCreateOpen] = useState(false);

  const applications = mockApplications;
  const fileNameById = Object.fromEntries(
    mockSubmissionFiles.map((file) => [file.id, file.fileName]),
  );
  const kanbanColumns = getKanbanColumns(applications);

  const emptyState =
    emptyPreview === 'first'
      ? 'first'
      : emptyPreview === 'no-result'
        ? 'no-result'
        : undefined;

  return (
    <>
      <ApplicationsDesktopView
        applications={applications}
        fileNameById={fileNameById}
        kanbanColumns={kanbanColumns}
        view={view}
        onViewChange={setView}
        onRegister={() => setCreateOpen(true)}
        emptyState={emptyState}
      />
      <ApplicationFormDrawer
        open={createOpen}
        mode="create"
        onClose={() => setCreateOpen(false)}
      />
    </>
  );
}
