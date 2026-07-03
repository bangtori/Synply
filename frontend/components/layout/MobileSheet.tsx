'use client';

import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

export interface MobileSheetProps {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  /** 하단 고정 푸터 (액션 버튼 등) */
  footer?: ReactNode;
  children: ReactNode;
}

// 하단 바텀시트 (grabber + scrim + ESC/backdrop 닫기). focus trap 고도화는 범위 밖.
export function MobileSheet({
  open,
  onClose,
  eyebrow,
  title,
  footer,
  children,
}: MobileSheetProps) {
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
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative flex max-h-[90dvh] flex-col rounded-t-[24px] bg-surface-card"
      >
        {/* grabber */}
        <div className="flex justify-center pt-3">
          <span className="h-1.5 w-10 rounded-full bg-border-default" />
        </div>

        <div className="flex items-start justify-between px-5 pb-3 pt-3">
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

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
          {children}
        </div>

        {footer && (
          <div className="flex items-center gap-2 border-t border-border-subtle px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
