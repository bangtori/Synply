import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export interface ApplicationsEmptyFirstProps {
  onRegister: () => void;
}

// 첫 진입 빈 상태 — 마스코트 + 첫 등록 CTA
export function ApplicationsEmptyFirst({
  onRegister,
}: ApplicationsEmptyFirstProps) {
  return (
    <EmptyState
      mascot
      title="아직 등록된 지원 기록이 없어요"
      description="첫 지원 기록을 등록하면 전형 상태와 통계를 한곳에서 볼 수 있어요. 이력서는 나중에 연결해도 괜찮아요."
      action={<Button onClick={onRegister}>첫 지원 기록 등록</Button>}
    />
  );
}
