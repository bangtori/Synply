import { Card } from '@/components/ui/Card';
import { TechTag } from '@/components/ui/TechTag';
import type { Application } from '@/types/application';
import { formatDot } from '@/utils/date';

import { InfoRow } from './InfoRow';

export interface PostingInfoCardProps {
  application: Application;
}

export function PostingInfoCard({ application }: PostingInfoCardProps) {
  return (
    <Card title="공고 정보">
      <div className="divide-y divide-border-subtle">
        <InfoRow label="회사명">{application.companyName}</InfoRow>
        <InfoRow label="직무명">{application.positionTitle}</InfoRow>
        <InfoRow label="공고 URL">
          {application.postingUrl ? (
            <a
              href={application.postingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-brand hover:underline"
            >
              {application.postingUrl}
            </a>
          ) : (
            '—'
          )}
        </InfoRow>
        <InfoRow label="마감일">
          {application.deadlineDate ? formatDot(application.deadlineDate) : '—'}
        </InfoRow>
        <InfoRow label="지원 플랫폼">{application.platform}</InfoRow>
        <InfoRow label="기술 스택">
          <span className="flex flex-wrap justify-end gap-1">
            {application.techStacks.map((stack) => (
              <TechTag key={stack} label={stack} />
            ))}
          </span>
        </InfoRow>
      </div>
    </Card>
  );
}
