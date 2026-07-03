import { describe, expect, it } from 'vitest';

import {
  APPLICATION_STATUS,
  type ApplicationStatus,
} from '@/constants/applicationStatus';
import type { Application } from '@/types/application';

import { getApplicationStats } from './applicationStats';

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

const {
  APPLIED,
  DOCUMENT_PASSED,
  INTERVIEWING,
  FINAL_PASSED,
  DOCUMENT_FAILED,
  INTERVIEW_FAILED,
} = APPLICATION_STATUS;

describe('getApplicationStats', () => {
  it('빈 배열이면 합격률은 null', () => {
    expect(getApplicationStats([])).toEqual({
      total: 0,
      active: 0,
      finalPassCount: 0,
      documentPassRate: null,
    });
  });

  it('진행 중(active)은 지원완료+서류합격+면접중만 센다', () => {
    const apps = [
      app(APPLIED, '1'),
      app(DOCUMENT_PASSED, '2'),
      app(INTERVIEWING, '3'),
      app(FINAL_PASSED, '4'),
      app(DOCUMENT_FAILED, '5'),
      app(INTERVIEW_FAILED, '6'),
    ];
    expect(getApplicationStats(apps).active).toBe(3);
  });

  it('최종 합격 수를 센다', () => {
    const apps = [app(FINAL_PASSED, '1'), app(FINAL_PASSED, '2'), app(APPLIED, '3')];
    expect(getApplicationStats(apps).finalPassCount).toBe(2);
  });

  it('서류 결과 미확정(지원완료만)이면 분모 0 → null', () => {
    const apps = [app(APPLIED, '1'), app(APPLIED, '2')];
    expect(getApplicationStats(apps).documentPassRate).toBeNull();
  });

  it('서류불합격은 분모에 포함, 분자에서 제외', () => {
    // 분자 1(서류합격) / 분모 2(서류합격+서류불합격) = 50%
    const apps = [app(DOCUMENT_PASSED, '1'), app(DOCUMENT_FAILED, '2')];
    expect(getApplicationStats(apps).documentPassRate).toBe(50);
  });

  it('면접불합격은 서류 통과로 보아 분자 포함', () => {
    // 분자 1(면접불합격) / 분모 1 = 100%
    const apps = [app(INTERVIEW_FAILED, '1')];
    expect(getApplicationStats(apps).documentPassRate).toBe(100);
  });

  it('지원완료는 분모에서 제외된다', () => {
    // 지원완료 2건은 무시 → 분자 1 / 분모 1 = 100%
    const apps = [app(APPLIED, '1'), app(APPLIED, '2'), app(DOCUMENT_PASSED, '3')];
    expect(getApplicationStats(apps).documentPassRate).toBe(100);
  });

  it('합격률은 반올림한 정수', () => {
    // 분자 1 / 분모 3 = 33.33 → 33
    const apps = [
      app(DOCUMENT_PASSED, '1'),
      app(DOCUMENT_FAILED, '2'),
      app(DOCUMENT_FAILED, '3'),
    ];
    expect(getApplicationStats(apps).documentPassRate).toBe(33);
  });

  it('시안 목 데이터 분포(8건)에서 total 8 / active 5 / finalPass 1 / 83%', () => {
    const apps = [
      app(APPLIED, '1'),
      app(APPLIED, '2'),
      app(DOCUMENT_PASSED, '3'),
      app(DOCUMENT_PASSED, '4'),
      app(INTERVIEWING, '5'),
      app(FINAL_PASSED, '6'),
      app(DOCUMENT_FAILED, '7'),
      app(INTERVIEW_FAILED, '8'),
    ];
    expect(getApplicationStats(apps)).toEqual({
      total: 8,
      active: 5,
      finalPassCount: 1,
      documentPassRate: 83, // 분자 5 / 분모 6
    });
  });
});
