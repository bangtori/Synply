'use client';

import { useEffect, type ReactNode } from 'react';

export interface DialogShellProps {
  open: boolean;
  onClose: () => void;
  labelledBy?: string;
  children: ReactNode;
}

// scrim + 중앙 카드 + ESC/backdrop 닫기. focus trap 고도화는 범위 밖.
export function DialogShell({
  open,
  onClose,
  labelledBy,
  children,
}: DialogShellProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="relative w-[400px] max-w-[90vw] rounded-[20px] bg-surface-card p-6 shadow-pop"
      >
        {children}
      </div>
    </div>
  );
}
