'use client';

// 임시 검증 페이지 — 공유 UI 프리미티브를 시안 스펙 시트와 1:1 육안 대조용.
// Phase B 검수 후 제거 가능. (정적 UI 범위)

import { useState, type ReactNode } from 'react';
import { Search } from 'lucide-react';

import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { DistributionBar } from '@/components/ui/DistributionBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { FilterChip } from '@/components/ui/FilterChip';
import { Input } from '@/components/ui/Input';
import { ResumeFileChip } from '@/components/ui/ResumeFileChip';
import { SearchInput } from '@/components/ui/SearchInput';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TechTag } from '@/components/ui/TechTag';
import { ViewToggle, type ViewMode } from '@/components/ui/ViewToggle';
import { BlockedDialog } from '@/components/feedback/BlockedDialog';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { STATUS_ORDER } from '@/constants/applicationStatus';
import { mockApplications } from '@/lib/mock/applications';
import { getStatusDistribution } from '@/lib/selectors/statusDistribution';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-mono text-3xs uppercase tracking-[0.08em] text-text-subtle">
        {title}
      </h2>
      <div className="flex flex-wrap items-center gap-3 rounded-[18px] border border-border-subtle bg-surface-card p-5">
        {children}
      </div>
    </section>
  );
}

export default function DesignSystemPage() {
  const [view, setView] = useState<ViewMode>('list');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [blockedOpen, setBlockedOpen] = useState(false);

  const distribution = getStatusDistribution(mockApplications);

  return (
    <main className="min-h-screen bg-surface-page px-10 py-12">
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <header>
          <p className="font-mono text-3xs uppercase tracking-[0.08em] text-text-subtle">
            Design System
          </p>
          <h1 className="font-display text-3xl text-ink-950">
            Synply 프리미티브
          </h1>
        </header>

        <Section title="Button">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </Section>

        <Section title="Input / SearchInput">
          <div className="w-60">
            <Input placeholder="회사명 입력" />
          </div>
          <div className="w-60">
            <Input defaultValue="토스" />
          </div>
          <div className="w-60">
            <Input placeholder="오류 상태" error />
          </div>
          <div className="w-60">
            <Input placeholder="비활성" disabled />
          </div>
          <div className="w-60">
            <SearchInput placeholder="회사·직무 검색" />
          </div>
        </Section>

        <Section title="StatusBadge (6단계)">
          {STATUS_ORDER.map((status) => (
            <StatusBadge key={status} status={status} />
          ))}
        </Section>

        <Section title="FilterChip">
          <FilterChip variant="default">전형 상태</FilterChip>
          <FilterChip variant="active">면접중 1</FilterChip>
          <FilterChip variant="selected">원티드</FilterChip>
          <FilterChip variant="removable">면접중</FilterChip>
        </Section>

        <Section title="TechTag">
          <TechTag label="React" />
          <TechTag label="TypeScript" />
          <TechTag label="Next.js" variant="removable" />
        </Section>

        <Section title="ViewToggle">
          <ViewToggle value={view} onChange={setView} />
          <span className="text-sm text-text-muted">선택: {view}</span>
        </Section>

        <Section title="StatCard">
          <StatCard label="총 지원" value={8} suffix="건" />
          <StatCard label="진행 중" value={5} suffix="건" />
          <StatCard label="서류 합격률" value={83} suffix="%" accent />
          <StatCard label="최종 합격" value={1} suffix="건" />
        </Section>

        <Section title="DistributionBar">
          <div className="w-full">
            <DistributionBar items={distribution} />
          </div>
        </Section>

        <Section title="Avatar / ResumeFileChip">
          <Avatar initial="T" />
          <Avatar initial="당" size={48} />
          <Avatar initial="배" size={56} />
          <ResumeFileChip connected fileName="이력서 v3.pdf" />
          <ResumeFileChip connected={false} />
        </Section>

        <Section title="EmptyState">
          <div className="w-full">
            <EmptyState
              mascot
              title="아직 등록된 지원 기록이 없어요"
              description="첫 지원 기록을 등록하면 전형 상태와 통계를 한곳에서 볼 수 있어요."
              action={<Button>첫 지원 기록 등록</Button>}
            />
          </div>
          <div className="w-full">
            <EmptyState
              icon={<Search size={28} strokeWidth={2} aria-hidden />}
              title="조건에 맞는 지원 기록이 없어요"
              description="검색어나 필터를 바꿔 보세요."
              action={<Button variant="secondary">필터 초기화</Button>}
            />
          </div>
        </Section>

        <Section title="Dialog (open/close)">
          <Button variant="danger" onClick={() => setConfirmOpen(true)}>
            삭제 확인 열기
          </Button>
          <Button variant="secondary" onClick={() => setBlockedOpen(true)}>
            삭제 차단 열기
          </Button>
        </Section>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="지원 기록을 삭제할까요?"
        description="되돌릴 수 없어요. 연결된 회고도 함께 삭제됩니다."
        onConfirm={() => setConfirmOpen(false)}
        onCancel={() => setConfirmOpen(false)}
      />
      <BlockedDialog
        open={blockedOpen}
        title="연결된 파일은 삭제할 수 없어요"
        description="연결된 지원 건이 있어 삭제할 수 없습니다. 먼저 지원 기록에서 연결을 해제하세요."
        actionLabel="연결 해제하러 가기"
        onClose={() => setBlockedOpen(false)}
        onAction={() => setBlockedOpen(false)}
      />
    </main>
  );
}
