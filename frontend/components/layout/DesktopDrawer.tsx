'use client';

import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

export interface DesktopDrawerProps {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  /** 하단 고정 푸터 (액션 버튼 등) */
  footer?: ReactNode;
  children: ReactNode;
}

// 우측 540px 드로어 (scrim + ESC/backdrop 닫기). focus trap 고도화는 범위 밖.
export function DesktopDrawer({
  open,
  onClose,
  eyebrow,
  title,
  footer,
  children,
}: DesktopDrawerProps) {
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
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative flex h-full w-[540px] max-w-full flex-col bg-surface-card shadow-[var(--shadow-xl)]"
      >
        <div className="flex items-start justify-between border-b border-border-subtle px-6 py-5">
          <div>
            {eyebrow && (
              <p className="mb-1 font-mono text-3xs uppercase tracking-[0.08em] text-text-subtle">
                {eyebrow}
              </p>
            )}
            <h2 className="text-base font-extrabold text-ink-950">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-text-muted transition hover:text-text-body"
          >
            <X size={20} strokeWidth={2} aria-hidden />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer && (
          <div className="flex items-center gap-2 border-t border-border-subtle px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
