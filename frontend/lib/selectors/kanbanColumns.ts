import {
  STATUS_CONFIG,
  STATUS_ORDER,
  type ApplicationStatus,
} from '@/constants/applicationStatus';
import type { Application } from '@/types/application';

export type KanbanColumn = {
  status: ApplicationStatus;
  label: string;
  colorVar: string;
  count: number;
  items: Application[];
};

// 6단계 칸반 컬럼 (STATUS_ORDER 순서). 각 컬럼에 해당 상태 지원 기록을 담는다.
export function getKanbanColumns(applications: Application[]): KanbanColumn[] {
  return STATUS_ORDER.map((status) => {
    const items = applications.filter((a) => a.status === status);
    return {
      status,
      label: STATUS_CONFIG[status].label,
      colorVar: STATUS_CONFIG[status].chartColorVar,
      count: items.length,
      items,
    };
  });
}
