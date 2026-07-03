import { describe, expect, it } from 'vitest';

import {
  APPLICATION_STATUS,
  STATUS_CONFIG,
  STATUS_ORDER,
  type ApplicationStatus,
} from '@/constants/applicationStatus';
import type { Application } from '@/types/application';

import { getStatusDistribution } from './statusDistribution';

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

describe('getStatusDistribution', () => {
  it('STATUS_ORDER 순서로 6개 항목을 반환한다', () => {
    const result = getStatusDistribution([]);
    expect(result.map((item) => item.status)).toEqual(STATUS_ORDER);
  });

  it('상태별 개수를 세고, 라벨/색은 STATUS_CONFIG를 따른다', () => {
    const apps = [
      app(APPLICATION_STATUS.INTERVIEWING, '1'),
      app(APPLICATION_STATUS.INTERVIEWING, '2'),
      app(APPLICATION_STATUS.APPLIED, '3'),
    ];
    const result = getStatusDistribution(apps);
    const interviewing = result.find(
      (item) => item.status === APPLICATION_STATUS.INTERVIEWING,
    );

    expect(interviewing).toMatchObject({
      count: 2,
      label: STATUS_CONFIG[APPLICATION_STATUS.INTERVIEWING].label,
      colorVar: STATUS_CONFIG[APPLICATION_STATUS.INTERVIEWING].chartColorVar,
    });
  });

  it('전체 개수의 합은 입력 길이와 같다', () => {
    const apps = [
      app(APPLICATION_STATUS.APPLIED, '1'),
      app(APPLICATION_STATUS.FINAL_PASSED, '2'),
      app(APPLICATION_STATUS.DOCUMENT_FAILED, '3'),
    ];
    const sum = getStatusDistribution(apps).reduce(
      (acc, item) => acc + item.count,
      0,
    );
    expect(sum).toBe(apps.length);
  });
});
