'use client';

import { useState, type ReactNode } from 'react';
import { FileText, Upload } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TechTag } from '@/components/ui/TechTag';
import {
  APPLICATION_STATUS,
  type ApplicationStatus,
} from '@/constants/applicationStatus';
import type { Application } from '@/types/application';
import type { SubmissionFile } from '@/types/submissionFile';

import { ApplicationStatusSelector } from './ApplicationStatusSelector';

export interface ApplicationFormProps {
  mode: 'create' | 'edit';
  application?: Application;
  submissionFile?: SubmissionFile | null;
}

// 입력 필드용 (label로 감싸 암묵적 연결)
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-text-body">
        {label}
        {required && <span className="text-danger-500"> *</span>}
      </span>
      {children}
    </label>
  );
}

// 입력이 아닌 그룹용 (상태/스택/이력서)
function FieldGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-semibold text-text-body">{label}</p>
      {children}
    </div>
  );
}

// 등록/수정 공유 폼. 입력/기본값/모드별 차이만 표현하고,
// 실제 submit·Zod 검증·저장 로직은 범위 밖(사용자 직접 구현).
export function ApplicationForm({
  mode,
  application,
  submissionFile,
}: ApplicationFormProps) {
  const isEdit = mode === 'edit';
  const [status, setStatus] = useState<ApplicationStatus>(
    application?.status ?? APPLICATION_STATUS.APPLIED,
  );

  return (
    <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
      <div className="grid grid-cols-2 gap-3">
        <Field label="회사명" required>
          <Input
            placeholder="회사명 입력"
            defaultValue={application?.companyName}
          />
        </Field>
        <Field label="직무명" required>
          <Input
            placeholder="직무명 입력"
            defaultValue={application?.positionTitle}
          />
        </Field>
      </div>

      <Field label="공고 URL">
        <Input placeholder="https://" defaultValue={application?.postingUrl} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="마감일">
          <Input type="date" defaultValue={application?.deadlineDate} />
        </Field>
        <Field label="지원 플랫폼">
          <Input placeholder="예: 원티드" defaultValue={application?.platform} />
        </Field>
      </div>

      <FieldGroup label="기술 스택">
        <Input placeholder="기술 입력 후 Enter" />
        {application?.techStacks && application.techStacks.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {application.techStacks.map((stack) => (
              <TechTag key={stack} label={stack} variant="removable" />
            ))}
          </div>
        )}
      </FieldGroup>

      <FieldGroup label="전형 상태">
        <ApplicationStatusSelector selected={status} onSelect={setStatus} />
      </FieldGroup>

      <FieldGroup label="이력서 연결">
        {isEdit && submissionFile ? (
          <div className="flex items-center gap-3 rounded-input bg-surface-brand-soft p-3">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-input bg-surface-card text-text-muted">
              <FileText size={16} strokeWidth={2} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-ink-900">
                {submissionFile.fileName}
              </p>
              <p className="text-3xs font-medium text-success-500">연결됨</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-danger-500 hover:bg-danger-100"
            >
              연결 해제
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-input border-2 border-dashed border-border-default bg-surface-brand-soft py-6 text-center">
            <Upload size={18} strokeWidth={2} className="text-brand" aria-hidden />
            <p className="text-xs text-text-muted">
              보관된 파일에서 선택하거나 새 파일을 업로드하세요
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">
                보관함에서 선택
              </Button>
              <Button variant="ghost" size="sm">
                새 파일 업로드
              </Button>
            </div>
          </div>
        )}
      </FieldGroup>
    </form>
  );
}
