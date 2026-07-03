import {
  APPLICATION_STATUS,
  STATUS_CONFIG,
  type ApplicationStatus,
} from '@/constants/applicationStatus';
import type { Application } from '@/types/application';

// 진행 중으로 보는 상태: 지원완료 · 서류합격 · 면접중 (탈락/최종합격 제외)
const ACTIVE_STATUSES: ApplicationStatus[] = [
  APPLICATION_STATUS.APPLIED,
  APPLICATION_STATUS.DOCUMENT_PASSED,
  APPLICATION_STATUS.INTERVIEWING,
];

export type ApplicationStats = {
  total: number;
  active: number;
  finalPassCount: number;
  /** 서류 합격률(0~100 정수). 분모가 0이면 null → "데이터 없음" 표시 */
  documentPassRate: number | null;
};

export function getApplicationStats(
  applications: Application[],
): ApplicationStats {
  const total = applications.length;

  const active = applications.filter((a) =>
    ACTIVE_STATUSES.includes(a.status),
  ).length;

  const finalPassCount = applications.filter(
    (a) => a.status === APPLICATION_STATUS.FINAL_PASSED,
  ).length;

  const numerator = applications.filter(
    (a) => STATUS_CONFIG[a.status].includedInDocumentPassRateNumerator,
  ).length;
  const denominator = applications.filter(
    (a) => STATUS_CONFIG[a.status].includedInDocumentPassRateDenominator,
  ).length;

  const documentPassRate =
    denominator === 0 ? null : Math.round((numerator / denominator) * 100);

  return { total, active, finalPassCount, documentPassRate };
}
