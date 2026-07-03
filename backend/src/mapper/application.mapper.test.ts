import { describe, expect, it } from 'vitest';

import {
  mapApplicationRowsToResponse,
  mapApplicationRowToDetailResponse,
  mapApplicationRowToResponse,
  mapApplicationStatusRowToResponse,
  mapCreateApplicationRequestToInsertData,
  mapUpdateApplicationRequestToUpdateData,
  mapUpdateApplicationStatusRequestToUpdateData,
} from './application.mapper.js';

import type { CreateApplicationRequest } from '../schemas/application.schema.js';
import type { ApplicationRow } from '../types/application.js';

const userId = 'user-001';

const createRequest: CreateApplicationRequest = {
  companyName: '토스',
  positionTitle: '프론트엔드',
  postingUrl: 'https://toss.im',
  deadlineDate: '2026-07-31',
  platform: '원티드',
  techStacks: ['React', 'TypeScript'],
  status: 'APPLIED',
  appliedAt: '2026-07-01',
};

const applicationRow: ApplicationRow = {
  application_id: 'app-001',
  user_id: userId,
  company_name: '토스',
  position_title: '프론트엔드',
  posting_url: 'https://toss.im',
  deadline_date: '2026-07-31',
  platform: '원티드',
  tech_stacks: ['React', 'TypeScript'],
  status: 'APPLIED',
  applied_at: '2026-07-01',
  created_at: '2026-07-01T00:00:00Z',
  updated_at: '2026-07-01T00:00:00Z',
};

describe('mapCreateApplicationRequestToInsertData 테스트', () => {
  it('생성 요청을 DB insert 데이터로 변환한다.', () => {
    const result = mapCreateApplicationRequestToInsertData(
      userId,
      createRequest,
    );

    expect(result).toEqual({
      user_id: userId,
      company_name: '토스',
      position_title: '프론트엔드',
      posting_url: 'https://toss.im',
      deadline_date: '2026-07-31',
      platform: '원티드',
      tech_stacks: ['React', 'TypeScript'],
      status: 'APPLIED',
      applied_at: '2026-07-01',
    });
  });

  it('선택값이 없으면 DB 기본 저장값으로 변환한다.', () => {
    const result = mapCreateApplicationRequestToInsertData(userId, {
      companyName: '토스',
      positionTitle: '프론트엔드',
    });

    expect(result).toMatchObject({
      user_id: userId,
      company_name: '토스',
      position_title: '프론트엔드',
      posting_url: null,
      deadline_date: null,
      platform: null,
      tech_stacks: [],
      status: 'APPLIED',
    });

    expect(result.applied_at).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  describe('mapApplicationRowToResponse 테스트', () => {
    it('DB row를 API 응답 형식으로 변환한다.', () => {
      const result = mapApplicationRowToResponse(applicationRow);

      expect(result).toEqual({
        id: 'app-001',
        companyName: '토스',
        positionTitle: '프론트엔드',
        postingUrl: 'https://toss.im',
        deadlineDate: '2026-07-31',
        platform: '원티드',
        techStacks: ['React', 'TypeScript'],
        status: 'APPLIED',
        appliedAt: '2026-07-01',
        createdAt: '2026-07-01T00:00:00Z',
        updatedAt: '2026-07-01T00:00:00Z',
      });
    });
  });

  describe('mapApplicationRowsToResponse 테스트', () => {
    it('DB row 배열을 API 목록 응답 형식으로 변환한다.', () => {
      const result = mapApplicationRowsToResponse([applicationRow]);

      expect(result).toEqual([
        {
          id: 'app-001',
          companyName: '토스',
          positionTitle: '프론트엔드',
          postingUrl: 'https://toss.im',
          deadlineDate: '2026-07-31',
          platform: '원티드',
          techStacks: ['React', 'TypeScript'],
          status: 'APPLIED',
          appliedAt: '2026-07-01',
          createdAt: '2026-07-01T00:00:00Z',
          updatedAt: '2026-07-01T00:00:00Z',
        },
      ]);
    });
    it('빈 배열을 전달하면 빈 배열을 반환한다.', () => {
      const result = mapApplicationRowsToResponse([]);

      expect(result).toEqual([]);
    });
  });
});

describe('mapUpdateApplicationRequestToUpdateData 테스트', () => {
  it('일부 필드만 전달하면 해당 필드만 DB update 데이터로 변환한다.', () => {
    const result = mapUpdateApplicationRequestToUpdateData({
      companyName: '토스',
      positionTitle: '프론트엔드',
    });
    expect(result).toEqual({
      company_name: '토스',
      position_title: '프론트엔드',
    });
  });
  it('undefined인 필드는 update 데이터에 포함하지 않는다.', () => {
    const result = mapUpdateApplicationRequestToUpdateData({
      companyName: '토스',
      positionTitle: undefined,
    });
    expect(result).toEqual({
      company_name: '토스',
    });
  });
  it('전달된 수정 필드가 없으면 빈 객체를 반환한다.', () => {
    const result = mapUpdateApplicationRequestToUpdateData({});
    expect(result).toEqual({});
  });
});

describe('mapApplicationRowToDetailResponse 테스트', () => {
  it('DB row를 API 상세 응답 형식으로 변환한다. 추후 파일, 메모 연결로 확장한다.', () => {
    const result = mapApplicationRowToDetailResponse(applicationRow);

    expect(result).toEqual({
      ...mapApplicationRowToResponse(applicationRow),
      submissionFiles: [],
      memo: null,
    });
  });
});

describe('mapUpdateApplicationStatusRequestToUpdateData 테스트', () => {
  it('전형 상태 변경 요청을 DB update 데이터로 변환한다.', () => {
    const result = mapUpdateApplicationStatusRequestToUpdateData({
      status: 'INTERVIEWING',
    });
    expect(result).toEqual({
      status: 'INTERVIEWING',
    });
  });
});

describe('mapApplicationStatusRowToResponse 테스트', () => {
  it('DB row를 API 응답 형식으로 변환한다.', () => {
    const result = mapApplicationStatusRowToResponse({
      application_id: 'app-001',
      status: 'INTERVIEWING',
      updated_at: '2026-07-01T00:00:00Z',
    });

    expect(result).toEqual({
      id: 'app-001',
      status: 'INTERVIEWING',
      updatedAt: '2026-07-01T00:00:00Z',
    });
  });
});
