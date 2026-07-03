import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { Application } from '@/types/application';

export interface ResultMemoCardProps {
  application: Application;
}

export function ResultMemoCard({ application }: ResultMemoCardProps) {
  return (
    <Card title="결과 메모">
      {application.memo ? (
        <p className="whitespace-pre-line rounded-input bg-surface-sunken p-4 text-sm leading-relaxed text-text-body">
          {application.memo}
        </p>
      ) : (
        <p className="rounded-input bg-surface-sunken p-4 text-sm text-text-subtle">
          작성된 메모가 없어요.
        </p>
      )}
      <div className="mt-3 flex items-center justify-between">
        <span className="font-mono text-3xs text-text-subtle">저장됨 · 방금</span>
        <Button variant="ghost" size="sm">
          메모 수정
        </Button>
      </div>
    </Card>
  );
}
