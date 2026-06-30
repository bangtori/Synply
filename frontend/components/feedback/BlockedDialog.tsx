'use client';

import { useId, type ReactNode } from 'react';
import { ShieldAlert } from 'lucide-react';

import { Button } from '@/components/ui/Button';

import { DialogShell } from './DialogShell';

export interface BlockedDialogProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  /** "연결 해제하러 가기" 등 보조 액션 라벨 (표현용) */
  actionLabel?: string;
  onClose: () => void;
  onAction?: () => void;
}

export function BlockedDialog({
  open,
  title,
  description,
  confirmLabel = '확인',
  actionLabel,
  onClose,
  onAction,
}: BlockedDialogProps) {
  const titleId = useId();

  return (
    <DialogShell open={open} onClose={onClose} labelledBy={titleId}>
      <div className="flex flex-col gap-4">
        <span className="inline-flex size-11 items-center justify-center rounded-full bg-warning-100 text-warning-500">
          <ShieldAlert size={22} strokeWidth={2} aria-hidden />
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
          <Button variant="ghost" onClick={onClose}>
            {confirmLabel}
          </Button>
          {actionLabel && (
            <Button variant="primary" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </DialogShell>
  );
}
