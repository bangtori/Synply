'use client';

import { useState } from 'react';

import type { ApplicationStatus } from '@/constants/applicationStatus';
import type { Application } from '@/types/application';
import type { SubmissionFile } from '@/types/submissionFile';

import { ApplicationFormDrawer } from '@/components/domain/applications/ApplicationFormDrawer';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';

import { ApplicationDetailDesktopView } from './ApplicationDetailScreen.desktop';

export interface ApplicationDetailScreenProps {
  application: Application;
  submissionFile: SubmissionFile | null;
}

// 컨테이너: 전형 상태 선택(표현용) 상태를 관리한다.
// (실제 상태 변경 저장/수정/삭제 로직은 범위 밖)
export function ApplicationDetailScreen({
  application,
  submissionFile,
}: ApplicationDetailScreenProps) {
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>(
    application.status,
  );
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <ApplicationDetailDesktopView
        application={application}
        submissionFile={submissionFile}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        onEdit={() => setEditOpen(true)}
        onDelete={() => setDeleteOpen(true)}
      />
      <ApplicationFormDrawer
        open={editOpen}
        mode="edit"
        application={application}
        submissionFile={submissionFile}
        onClose={() => setEditOpen(false)}
      />
      <ConfirmDialog
        open={deleteOpen}
        title="지원 기록을 삭제할까요?"
        description="되돌릴 수 없어요. 연결된 결과 메모도 함께 삭제됩니다."
        onConfirm={() => setDeleteOpen(false)}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}
