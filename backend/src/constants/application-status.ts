export const APPLICATION_STATUS_VALUES = [
  'APPLIED',
  'DOCUMENT_PASSED',
  'INTERVIEWING',
  'FINAL_PASSED',
  'DOCUMENT_FAILED',
  'INTERVIEW_FAILED',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUS_VALUES)[number];
