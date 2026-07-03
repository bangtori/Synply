import type { ApplicationStatus } from '@/constants/applicationStatus';

export type Application = {
  id: string;
  companyName: string;
  /** 아바타용 초성/이니셜 (예: 'T', '당') */
  companyInitial: string;
  positionTitle: string;
  status: ApplicationStatus;
  platform: string;
  postingUrl?: string;
  /** 마감일 ISO 'YYYY-MM-DD' */
  deadlineDate?: string;
  /** 지원일 ISO 'YYYY-MM-DD' */
  appliedAt: string;
  techStacks: string[];
  /** 연결된 제출 파일 id (미연결이면 null) */
  submissionFileId: string | null;
  /** 결과 메모/회고 */
  memo?: string;
  /** 등록일 ISO 'YYYY-MM-DD' */
  createdAt: string;
};
