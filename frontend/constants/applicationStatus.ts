// 전형 상태 단일 소스 — 라벨/배지 색/차트 색/서류 합격률 포함 여부를 한 곳에서 관리한다.
// (컨벤션 §10-2, §10-3) 라벨은 디자인 시안과 동일하게 공백 없이 사용한다.

export const APPLICATION_STATUS = {
  APPLIED: 'APPLIED',
  DOCUMENT_PASSED: 'DOCUMENT_PASSED',
  INTERVIEWING: 'INTERVIEWING',
  FINAL_PASSED: 'FINAL_PASSED',
  DOCUMENT_FAILED: 'DOCUMENT_FAILED',
  INTERVIEW_FAILED: 'INTERVIEW_FAILED',
} as const;

export type ApplicationStatus =
  (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];

// 칸반 컬럼·상태별 분포 등 반복 렌더링 시 사용하는 표시 순서 (시안 순서와 동일)
export const STATUS_ORDER: ApplicationStatus[] = [
  APPLICATION_STATUS.APPLIED,
  APPLICATION_STATUS.DOCUMENT_PASSED,
  APPLICATION_STATUS.INTERVIEWING,
  APPLICATION_STATUS.FINAL_PASSED,
  APPLICATION_STATUS.DOCUMENT_FAILED,
  APPLICATION_STATUS.INTERVIEW_FAILED,
];

export type StatusMeta = {
  label: string;
  /** 배지용 Tailwind 클래스 (배경 + 전경) */
  badgeClassName: string;
  /** 분포 바·차트용 색 (style로 CSS 변수 주입) */
  chartColorVar: string;
  /** 서류 합격률 분자 포함 여부 (서류를 통과한 상태) */
  includedInDocumentPassRateNumerator: boolean;
  /** 서류 합격률 분모 포함 여부 (서류 심사가 끝난 상태) */
  includedInDocumentPassRateDenominator: boolean;
};

export const STATUS_CONFIG: Record<ApplicationStatus, StatusMeta> = {
  APPLIED: {
    label: '지원완료',
    badgeClassName: 'bg-ink-100 text-ink-700',
    chartColorVar: 'var(--ink-300)',
    includedInDocumentPassRateNumerator: false,
    includedInDocumentPassRateDenominator: false, // 아직 서류 결과 미확정 → 분모 제외
  },
  DOCUMENT_PASSED: {
    label: '서류합격',
    badgeClassName: 'bg-info-100 text-info-500',
    chartColorVar: 'var(--info-500)',
    includedInDocumentPassRateNumerator: true,
    includedInDocumentPassRateDenominator: true,
  },
  INTERVIEWING: {
    label: '면접중',
    badgeClassName: 'bg-brand-subtle text-violet-700',
    chartColorVar: 'var(--brand)',
    includedInDocumentPassRateNumerator: true,
    includedInDocumentPassRateDenominator: true,
  },
  FINAL_PASSED: {
    label: '최종합격',
    badgeClassName: 'bg-success-100 text-success-500',
    chartColorVar: 'var(--success-500)',
    includedInDocumentPassRateNumerator: true,
    includedInDocumentPassRateDenominator: true,
  },
  DOCUMENT_FAILED: {
    label: '서류불합격',
    badgeClassName: 'bg-danger-100 text-danger-500',
    chartColorVar: 'var(--danger-500)',
    includedInDocumentPassRateNumerator: false, // 서류 탈락 → 분자 제외
    includedInDocumentPassRateDenominator: true, // 서류 심사는 완료됨 → 분모 포함
  },
  INTERVIEW_FAILED: {
    label: '면접불합격',
    badgeClassName: 'bg-danger-deep text-white',
    chartColorVar: 'var(--danger-deep)',
    includedInDocumentPassRateNumerator: true, // 서류는 통과한 뒤 면접 탈락 → 분자 포함
    includedInDocumentPassRateDenominator: true,
  },
};
