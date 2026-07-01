import type { Pagination } from './pagination.js';
import type { ApplicationStatus } from '../constants/application-status.js';

//DB
export type ApplicationRow = {
  application_id: string;
  user_id: string;
  company_name: string;
  position_title: string;
  posting_url: string | null;
  deadline_date: string | null;
  platform: string | null;
  tech_stacks: string[];
  status: ApplicationStatus;
  applied_at: string;
  created_at: string;
  updated_at: string;
};

// 단건 응답
export type ApplicationResponse = {
  id: string;
  companyName: string;
  positionTitle: string;
  postingUrl: string | null;
  deadlineDate: string | null;
  platform: string | null;
  techStacks: string[];
  status: ApplicationStatus;
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
};

// 목록 응답
export type ApplicationListResponse = ApplicationResponse[];

// 목록 응답 페이지네이션 포함
export type ApplicationListResult = {
  applications: ApplicationListResponse;
  pagination: Pagination;
};

// 생성 DB Insert
export type CreateApplicationInsert = {
  user_id: string;
  company_name: string;
  position_title: string;
  posting_url: string | null;
  deadline_date: string | null;
  platform: string | null;
  tech_stacks: string[];
  status: ApplicationStatus;
  applied_at: string;
};
