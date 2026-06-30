import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="대시보드"
        action={<Button>지원 기록 등록</Button>}
      />
      <div className="px-8 pb-8 text-sm text-text-muted">
        대시보드 콘텐츠는 다음 단계에서 구현됩니다.
      </div>
    </>
  );
}
