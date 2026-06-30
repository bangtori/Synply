'use client';

import { DesktopDrawer } from '@/components/layout/DesktopDrawer';
import { Button } from '@/components/ui/Button';
import type { Application } from '@/types/application';
import type { SubmissionFile } from '@/types/submissionFile';

import { ApplicationForm } from './ApplicationForm';

export interface ApplicationFormDrawerProps {
  open: boolean;
  mode: 'create' | 'edit';
  application?: Application;
  submissionFile?: SubmissionFile | null;
  onClose: () => void;
}

// 등록/수정 드로어. 푸터 버튼은 표현용(저장 로직 없음 → onClose).
export function ApplicationFormDrawer({
  open,
  mode,
  application,
  submissionFile,
  onClose,
}: ApplicationFormDrawerProps) {
  const isEdit = mode === 'edit';

  return (
    <DesktopDrawer
      open={open}
      onClose={onClose}
      eyebrow={isEdit ? 'Edit Application' : 'New Application'}
      title={isEdit ? '지원 기록 수정' : '지원 기록 등록'}
      footer={
        <>
          <span className="mr-auto text-2xs text-text-subtle">
            <span className="text-danger-500">*</span> 필수 항목
          </span>
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button onClick={onClose}>{isEdit ? '저장' : '등록'}</Button>
        </>
      }
    >
      <ApplicationForm
        mode={mode}
        application={application}
        submissionFile={submissionFile}
      />
    </DesktopDrawer>
  );
}
