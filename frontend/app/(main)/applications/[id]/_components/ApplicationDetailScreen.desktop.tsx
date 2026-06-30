import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, FileText } from 'lucide-react';

import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TechTag } from '@/components/ui/TechTag';
import type { ApplicationStatus } from '@/constants/applicationStatus';
import type { Application } from '@/types/application';
import type { SubmissionFile } from '@/types/submissionFile';
import { ApplicationStatusSelector } from '@/components/domain/applications/ApplicationStatusSelector';
import { formatDot } from '@/utils/date';

export interface ApplicationDetailDesktopViewProps {
  application: Application;
  submissionFile: SubmissionFile | null;
  selectedStatus: ApplicationStatus;
  onSelectStatus: (status: ApplicationStatus) => void;
  onEdit: () => void;
  onDelete: () => void;
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="shrink-0 text-xs text-text-muted">{label}</span>
      <span className="min-w-0 text-right text-xs text-text-body">{children}</span>
    </div>
  );
}

export function ApplicationDetailDesktopView({
  application,
  submissionFile,
  selectedStatus,
  onSelectStatus,
  onEdit,
  onDelete,
}: ApplicationDetailDesktopViewProps) {
  return (
    <>
      {/* 헤더: 뒤로 / 수정·삭제 */}
      <div className="flex items-center justify-between px-8 pb-4 pt-6">
        <Link
          href="/applications"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-body"
        >
          <ArrowLeft size={16} strokeWidth={2} aria-hidden />
          지원 기록
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onEdit}>
            수정
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-danger-500 hover:bg-danger-100"
            onClick={onDelete}
          >
            삭제
          </Button>
        </div>
      </div>

      {/* 타이틀 */}
      <div className="flex items-center gap-4 px-8 pb-6">
        <Avatar initial={application.companyInitial} size={56} />
        <div className="min-w-0">
          <h1 className="text-section font-extrabold text-ink-950">
            {application.companyName}
          </h1>
          <p className="text-sm text-text-muted">{application.positionTitle}</p>
        </div>
        <StatusBadge status={selectedStatus} className="ml-1" />
      </div>

      {/* 2단 그리드 */}
      <div className="grid grid-cols-[1.6fr_1fr] gap-6 px-8 pb-8">
        {/* 좌측 */}
        <div className="flex flex-col gap-6">
          <Card title="전형 상태">
            <ApplicationStatusSelector
              selected={selectedStatus}
              onSelect={onSelectStatus}
            />
          </Card>

          <Card title="공고 정보">
            <div className="divide-y divide-border-subtle">
              <InfoRow label="회사명">{application.companyName}</InfoRow>
              <InfoRow label="직무명">{application.positionTitle}</InfoRow>
              <InfoRow label="공고 URL">
                {application.postingUrl ? (
                  <a
                    href={application.postingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-brand hover:underline"
                  >
                    {application.postingUrl}
                  </a>
                ) : (
                  '—'
                )}
              </InfoRow>
              <InfoRow label="마감일">
                {application.deadlineDate
                  ? formatDot(application.deadlineDate)
                  : '—'}
              </InfoRow>
              <InfoRow label="지원 플랫폼">{application.platform}</InfoRow>
              <InfoRow label="기술 스택">
                <span className="flex flex-wrap justify-end gap-1">
                  {application.techStacks.map((stack) => (
                    <TechTag key={stack} label={stack} />
                  ))}
                </span>
              </InfoRow>
            </div>
          </Card>

          <Card title="결과 메모">
            {application.memo ? (
              <p className="whitespace-pre-line rounded-input bg-surface-sunken p-4 text-sm leading-relaxed text-text-body">
                {application.memo}
              </p>
            ) : (
              <p className="rounded-input bg-surface-sunken p-4 text-sm text-text-subtle">
                작성된 메모가 없어요.
              </p>
            )}
            <div className="mt-3 flex items-center justify-between">
              <span className="font-mono text-3xs text-text-subtle">
                저장됨 · 방금
              </span>
              <Button variant="ghost" size="sm">
                메모 수정
              </Button>
            </div>
          </Card>
        </div>

        {/* 우측 */}
        <div className="flex flex-col gap-6">
          <Card title="연결된 이력서">
            {submissionFile ? (
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-input bg-surface-sunken text-text-muted">
                  <FileText size={18} strokeWidth={2} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink-900">
                    {submissionFile.fileName}
                  </p>
                  <p className="font-mono text-3xs text-text-muted">
                    {submissionFile.sizeLabel} ·{' '}
                    {formatDot(submissionFile.uploadedAt)}
                  </p>
                </div>
                <Button variant="secondary" size="sm">
                  <Download size={14} strokeWidth={2} aria-hidden />
                  다운로드
                </Button>
              </div>
            ) : (
              <p className="text-xs text-text-subtle">연결된 이력서가 없어요.</p>
            )}
            <p className="mt-3 text-3xs text-text-subtle">
              파일 변경·연결 해제는 “수정”에서 처리합니다.
            </p>
          </Card>

          <Card title="기록 정보">
            <div className="divide-y divide-border-subtle">
              <InfoRow label="지원일">
                {formatDot(application.appliedAt)}
              </InfoRow>
              <InfoRow label="등록일">
                {formatDot(application.createdAt)}
              </InfoRow>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
