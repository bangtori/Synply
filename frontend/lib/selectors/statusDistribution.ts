import {
  STATUS_CONFIG,
  STATUS_ORDER,
  type ApplicationStatus,
} from '@/constants/applicationStatus';
import type { Application } from '@/types/application';

export type StatusDistributionItem = {
  status: ApplicationStatus;
  label: string;
  count: number;
  colorVar: string;
};

// 상태별 분포 (세그먼트 바 + 범례용). STATUS_ORDER 순서로 6개 모두 반환.
export function getStatusDistribution(
  applications: Application[],
): StatusDistributionItem[] {
  return STATUS_ORDER.map((status) => ({
    status,
    label: STATUS_CONFIG[status].label,
    count: applications.filter((a) => a.status === status).length,
    colorVar: STATUS_CONFIG[status].chartColorVar,
  }));
}
