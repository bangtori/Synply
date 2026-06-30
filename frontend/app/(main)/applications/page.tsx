import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';

export default function ApplicationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Applications"
        title="지원 기록"
        action={<Button>지원 기록 등록</Button>}
      />
      <div className="px-8 pb-8 text-sm text-text-muted">
        지원 기록 리스트/칸반은 다음 단계에서 구현됩니다.
      </div>
    </>
  );
}
