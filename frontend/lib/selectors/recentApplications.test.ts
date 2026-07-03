import { describe, expect, it } from 'vitest';

import { APPLICATION_STATUS } from '@/constants/applicationStatus';
import type { Application } from '@/types/application';

import { getRecentApplications } from './recentApplications';

function app(id: string, appliedAt: string): Application {
  return {
    id,
    companyName: '회사',
    companyInitial: 'C',
    positionTitle: '직무',
    status: APPLICATION_STATUS.APPLIED,
    platform: '플랫폼',
    appliedAt,
    techStacks: [],
    submissionFileId: null,
    createdAt: appliedAt,
  };
}

describe('getRecentApplications', () => {
  const apps = [
    app('a', '2026-06-08'),
    app('b', '2026-06-15'),
    app('c', '2026-05-20'),
    app('d', '2026-06-10'),
  ];

  it('지원일 내림차순으로 정렬한다', () => {
    expect(getRecentApplications(apps).map((a) => a.id)).toEqual([
      'b',
      'd',
      'a',
      'c',
    ]);
  });

  it('limit 만큼만 반환한다', () => {
    expect(getRecentApplications(apps, 2).map((a) => a.id)).toEqual(['b', 'd']);
  });

  it('기본 limit은 5', () => {
    expect(getRecentApplications(apps)).toHaveLength(4);
  });

  it('원본 배열을 변형하지 않는다', () => {
    const original = apps.map((a) => a.id);
    getRecentApplications(apps);
    expect(apps.map((a) => a.id)).toEqual(original);
  });
});
