import { describe, expect, it } from 'vitest';

import {
  APPLICATION_STATUS,
  STATUS_ORDER,
  type ApplicationStatus,
} from '@/constants/applicationStatus';
import type { Application } from '@/types/application';

import { getKanbanColumns } from './kanbanColumns';

function app(status: ApplicationStatus, id: string): Application {
  return {
    id,
    companyName: '회사',
    companyInitial: 'C',
    positionTitle: '직무',
    status,
    platform: '플랫폼',
    appliedAt: '2026-06-01',
    techStacks: [],
    submissionFileId: null,
    createdAt: '2026-06-01',
  };
}

describe('getKanbanColumns', () => {
  it('STATUS_ORDER 순서로 6개 컬럼을 반환한다', () => {
    const columns = getKanbanColumns([]);
    expect(columns.map((column) => column.status)).toEqual(STATUS_ORDER);
    expect(columns.every((column) => column.count === 0)).toBe(true);
  });

  it('상태별로 항목을 그룹화하고 개수를 센다', () => {
    const apps = [
      app(APPLICATION_STATUS.INTERVIEWING, '1'),
      app(APPLICATION_STATUS.INTERVIEWING, '2'),
      app(APPLICATION_STATUS.APPLIED, '3'),
    ];
    const columns = getKanbanColumns(apps);

    const interviewing = columns.find(
      (column) => column.status === APPLICATION_STATUS.INTERVIEWING,
    );
    expect(interviewing?.count).toBe(2);
    expect(interviewing?.items.map((item) => item.id)).toEqual(['1', '2']);

    const applied = columns.find(
      (column) => column.status === APPLICATION_STATUS.APPLIED,
    );
    expect(applied?.count).toBe(1);
  });
});
