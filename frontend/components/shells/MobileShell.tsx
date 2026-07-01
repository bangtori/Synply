'use client';

import { useState, type ComponentType, type ReactNode, type UIEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardList, Files, LayoutDashboard, Plus } from 'lucide-react';

import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/utils/cn';

type Tab = {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
};

const TABS: Tab[] = [
  { href: '/dashboard', label: '대시보드', icon: LayoutDashboard },
  { href: '/applications', label: '지원 기록', icon: ClipboardList },
  { href: '/submission-files', label: '이력서', icon: Files },
];

export interface MobileShellProps {
  children: ReactNode;
}

// 상단 헤더 + 스크롤 본문 + 하단 탭바 + FAB(스크롤 시 확장↔축소).
export function MobileShell({ children }: MobileShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // 본문 스크롤 36px 초과 시 FAB 축소 (반복 setState 방지)
  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const next = event.currentTarget.scrollTop > 36;
    setCollapsed((prev) => (prev === next ? prev : next));
  };

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-surface-page">
      {/* 헤더 */}
      <header className="flex items-center justify-between border-b border-border-subtle bg-surface-card px-5 py-3.5">
        <Link href="/dashboard" className="flex items-center gap-2.5 no-underline">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/tori-dice-cutout.png"
            alt=""
            className="size-7 object-contain"
          />
          <span className="font-display text-xl text-ink-950">Synply</span>
        </Link>
        <Avatar initial="민" size={34} />
      </header>

      {/* 본문 (스크롤 영역) */}
      <div onScroll={handleScroll} className="min-h-0 flex-1 overflow-y-auto pb-24">
        {children}
      </div>

      {/* FAB (등록) — 실제 등록 시트 연결은 M-6 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[76px] z-10 flex items-center justify-end gap-2.5 px-4">
        {!collapsed && (
          <span className="pointer-events-auto rounded-full border border-border-subtle bg-surface-card px-3 py-1.5 font-mono text-3xs font-semibold text-text-muted shadow-card">
            지원 기록 등록
          </span>
        )}
        <button
          type="button"
          aria-label="지원 기록 등록"
          className="pointer-events-auto inline-flex size-14 items-center justify-center rounded-full bg-brand text-white shadow-brand transition"
        >
          <Plus size={22} strokeWidth={2.5} aria-hidden />
        </button>
      </div>

      {/* 하단 탭바 */}
      <nav className="flex items-center justify-around border-t border-border-subtle bg-surface-card px-3 pb-2 pt-2">
        {TABS.map((tab) => {
          const active =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center gap-1 no-underline',
                active ? 'text-violet-700' : 'text-text-subtle',
              )}
            >
              <Icon size={20} strokeWidth={2} />
              <span
                className={cn('text-3xs', active ? 'font-bold' : 'font-semibold')}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
