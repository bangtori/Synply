'use client';

import { useId, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/Button';

import { DialogShell } from './DialogShell';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = '삭제',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();

  return (
    <DialogShell open={open} onClose={onCancel} labelledBy={titleId}>
      <div className="flex flex-col gap-4">
        <span className="inline-flex size-11 items-center justify-center rounded-full bg-danger-100 text-danger-500">
          <AlertTriangle size={22} strokeWidth={2} aria-hidden />
        </span>
        <div className="flex flex-col gap-1.5">
          <h2 id={titleId} className="text-base font-extrabold text-ink-950">
            {title}
          </h2>
          {description && (
            <p className="text-sm leading-relaxed text-text-muted">
              {description}
            </p>
          )}
        </div>
        <div className="mt-2 flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </DialogShell>
  );
}
