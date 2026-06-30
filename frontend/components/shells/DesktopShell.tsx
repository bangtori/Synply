'use client';

import type { ComponentType, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardList, Files, LayoutDashboard } from 'lucide-react';

import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/utils/cn';

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
};

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: '대시보드', icon: LayoutDashboard },
  { href: '/applications', label: '지원 기록', icon: ClipboardList },
  { href: '/submission-files', label: '이력서 파일', icon: Files },
];

export interface DesktopShellProps {
  children: ReactNode;
}

export function DesktopShell({ children }: DesktopShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-surface-page">
      <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-border-subtle bg-surface-card py-[22px]">
        {/* 워드마크 (로고 에셋은 추후 추가) */}
        <div className="px-[22px]">
          <span className="font-display text-[23px] text-ink-950">Synply</span>
        </div>

        <nav className="mt-[30px] flex flex-col gap-[3px] px-3">
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-[12px] px-3.5 py-[11px] text-sm no-underline transition hover:no-underline',
                  active
                    ? 'bg-brand-subtle font-bold text-violet-700'
                    : 'font-semibold text-text-muted hover:bg-surface-sunken',
                )}
              >
                <Icon size={18} strokeWidth={2} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 하단 사용자 */}
        <div className="mt-auto flex items-center gap-3 px-[22px]">
          <Avatar initial="민" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink-900">김민지</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.04em] text-text-subtle">
              Job Seeker
            </p>
          </div>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
