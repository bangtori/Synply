'use client';

import { useState } from 'react';

import { BlockedDialog } from '@/components/feedback/BlockedDialog';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { usePlatform } from '@/hooks/usePlatform';
import { mockSubmissionFiles } from '@/lib/mock/submissionFiles';
import type { SubmissionFile } from '@/types/submissionFile';

import { SubmissionFilesDesktopView } from './SubmissionFilesScreen.desktop';
import { SubmissionFilesMobileView } from './SubmissionFilesScreen.mobile';

// 컨테이너: 삭제 확인/차단 다이얼로그 open 상태를 관리한다.
// (실제 삭제/연결 해제 로직은 범위 밖)
export function SubmissionFilesScreen() {
  const platform = usePlatform();
  const files = mockSubmissionFiles;
  const [confirmTarget, setConfirmTarget] = useState<SubmissionFile | null>(
    null,
  );
  const [blockedTarget, setBlockedTarget] = useState<SubmissionFile | null>(
    null,
  );

  // 연결된 파일은 차단 다이얼로그, 삭제 가능 파일은 확인 다이얼로그
  const handleDeleteClick = (file: SubmissionFile) => {
    if (file.deletable) {
      setConfirmTarget(file);
    } else {
      setBlockedTarget(file);
    }
  };

  if (platform === null) {
    return null; // 플랫폼 확정 전 (하이드레이션 안전)
  }

  const filesView =
    platform === 'mobile' ? (
      <SubmissionFilesMobileView files={files} onDeleteClick={handleDeleteClick} />
    ) : (
      <SubmissionFilesDesktopView
        files={files}
        onDeleteClick={handleDeleteClick}
      />
    );

  return (
    <>
      {filesView}

      <ConfirmDialog
        open={confirmTarget !== null}
        title="이력서 파일을 삭제할까요?"
        description="삭제하면 되돌릴 수 없어요. 지원 기록은 그대로 남아요."
        onConfirm={() => setConfirmTarget(null)}
        onCancel={() => setConfirmTarget(null)}
      />
      <BlockedDialog
        open={blockedTarget !== null}
        title="연결된 파일은 삭제할 수 없어요"
        description="연결된 지원 건이 있어 삭제할 수 없습니다. 먼저 지원 기록에서 연결을 해제하세요."
        actionLabel="연결 해제하러 가기"
        onClose={() => setBlockedTarget(null)}
        onAction={() => setBlockedTarget(null)}
      />
    </>
  );
}
