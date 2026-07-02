import type { CreateApplicationRequest } from '../schemas/application.schema.js';
import type {
  ApplicationListResponse,
  ApplicationResponse,
  ApplicationRow,
  CreateApplicationInsert,
  ApplicationDetailResponse,
} from '../types/application.js';

// 1. 생성 :  요청 → DB insert 타입
export function mapCreateApplicationRequestToInsertData(
  userId: string,
  request: CreateApplicationRequest,
): CreateApplicationInsert {
  return {
    user_id: userId,
    company_name: request.companyName,
    position_title: request.positionTitle,
    posting_url: request.postingUrl ?? null,
    deadline_date: request.deadlineDate ?? null,
    platform: request.platform ?? null,
    tech_stacks: request.techStacks ?? [],
    status: request.status ?? 'APPLIED',
    applied_at: request.appliedAt ?? new Date().toISOString().slice(0, 10),
  };
}

// 2. DB row → API 단건 응답
export function mapApplicationRowToResponse(
  row: ApplicationRow,
): ApplicationResponse {
  return {
    id: row.application_id,
    companyName: row.company_name,
    positionTitle: row.position_title,
    postingUrl: row.posting_url,
    deadlineDate: row.deadline_date,
    platform: row.platform,
    techStacks: row.tech_stacks,
    status: row.status,
    appliedAt: row.applied_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// 3. DB rows → API 목록 응답
export function mapApplicationRowsToResponse(
  rows: ApplicationRow[],
): ApplicationListResponse {
  return rows.map(mapApplicationRowToResponse);
}

// 4. DB row → API 상세 응답
export function mapApplicationRowToDetailResponse(
  row: ApplicationRow,
): ApplicationDetailResponse {
  return {
    ...mapApplicationRowToResponse(row),
    // TODO: 추후 파일/ 메모 테이블 생성 후 연결
    submissionFiles: [],
    memo: null,
  };
}
