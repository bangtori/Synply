import { AppError } from '../errors/AppError.js';
import { ERROR_CODE } from '../errors/errorCode.js';
import { TABLE } from '../constants/table.js';
import { createSupabaseUserClient } from '../lib/supabase-user.js';
import {
  mapApplicationRowsToResponse,
  mapApplicationRowToDetailResponse,
  mapApplicationRowToResponse,
  mapApplicationStatusRowToResponse,
  mapCreateApplicationRequestToInsertData,
  mapUpdateApplicationRequestToUpdateData,
  mapUpdateApplicationStatusRequestToUpdateData,
} from '../mapper/application.mapper.js';
import type {
  CreateApplicationRequest,
  UpdateApplicationRequest,
  UpdateApplicationStatusRequest,
} from '../schemas/application.schema.js';
import type {
  ApplicationDetailResponse,
  ApplicationListResult,
  ApplicationResponse,
  ApplicationRow,
  ApplicationStatusResponse,
  ApplicationStatusRow,
} from '../types/application.js';

// 지원 기록 생성
// TODO: 상세 조회 모델로 반환값 변경 필요
export async function createApplication(
  accessToken: string,
  userId: string,
  request: CreateApplicationRequest,
): Promise<ApplicationResponse> {
  const supabase = createSupabaseUserClient(accessToken);

  const mappedData = mapCreateApplicationRequestToInsertData(userId, request);
  const { data, error } = await supabase
    .from(TABLE.APPLICATIONS)
    .insert(mappedData)
    .select()
    .single();

  if (error) {
    console.error('createApplication error:', error);
  }

  if (!data || error) {
    throw new AppError(
      500,
      ERROR_CODE.INTERNAL_ERROR,
      '지원 기록 생성에 실패했습니다.',
    );
  }

  return mapApplicationRowToResponse(data as ApplicationRow);
}

// 지원 기록 목록 조회
// TODO: 쿼리 작업 추가
export async function getApplications(
  accessToken: string,
  userId: string,
  pageSize: number,
  page: number,
): Promise<ApplicationListResult> {
  const supabase = createSupabaseUserClient(accessToken);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from(TABLE.APPLICATIONS)
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('applied_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new AppError(
      500,
      ERROR_CODE.INTERNAL_ERROR,
      '지원 기록 조회에 실패했습니다.',
    );
  }

  const total = count ?? 0;

  return {
    applications: mapApplicationRowsToResponse(
      (data as ApplicationRow[]) ?? [],
    ),
    pagination: {
      total,
      page,
      pageSize,
      hasNextPage: page * pageSize < total,
    },
  };
}

// 지원 기록 상세 조회
// TODO: file, memo 테이블 조인 구현 필요 -> 현재 임시 빈값 반환
export async function getApplicationDetail(
  accessToken: string,
  userId: string,
  applicationId: string,
): Promise<ApplicationDetailResponse> {
  const supabase = createSupabaseUserClient(accessToken);

  // 지원 기록 기본 정보
  const { data: appRow, error: appError } = await supabase
    .from(TABLE.APPLICATIONS)
    .select('*')
    .eq('user_id', userId)
    .eq('application_id', applicationId)
    .single();

  if (appError || !appRow) {
    throw new AppError(
      404,
      ERROR_CODE.APPLICATION_NOT_FOUND,
      '지원 기록을 찾을 수 없습니다.',
    );
  }

  return mapApplicationRowToDetailResponse(appRow as ApplicationRow);
}

// 지원 기록 수정
export async function updateApplication(
  accessToken: string,
  userId: string,
  applicationId: string,
  request: UpdateApplicationRequest,
): Promise<ApplicationDetailResponse> {
  const supabase = createSupabaseUserClient(accessToken);

  const updateData = mapUpdateApplicationRequestToUpdateData(request);

  const { data, error } = await supabase
    .from(TABLE.APPLICATIONS)
    .update(updateData)
    .eq('user_id', userId)
    .eq('application_id', applicationId)
    .select()
    .single();

  if (error || !data) {
    throw new AppError(
      404,
      ERROR_CODE.APPLICATION_NOT_FOUND,
      '지원 기록을 찾을 수 없습니다.',
    );
  }

  return mapApplicationRowToDetailResponse(data as ApplicationRow);
}

// 지원 기록 삭제
export async function deleteApplication(
  accessToken: string,
  userId: string,
  applicationId: string,
): Promise<void> {
  const supabase = createSupabaseUserClient(accessToken);

  const { data, error } = await supabase
    .from(TABLE.APPLICATIONS)
    .delete()
    .eq('user_id', userId)
    .eq('application_id', applicationId)
    .select();

  if (error || !data || data.length === 0) {
    throw new AppError(
      404,
      ERROR_CODE.APPLICATION_NOT_FOUND,
      '지원 기록을 찾을 수 없습니다.',
    );
  }
  return;
}

// 전형 상태 변경
export async function updateApplicationStatus(
  accessToken: string,
  userId: string,
  applicationId: string,
  request: UpdateApplicationStatusRequest,
): Promise<ApplicationStatusResponse> {
  const supabase = createSupabaseUserClient(accessToken);

  const updateData = mapUpdateApplicationStatusRequestToUpdateData(request);

  const { data, error } = await supabase
    .from(TABLE.APPLICATIONS)
    .update(updateData)
    .eq('user_id', userId)
    .eq('application_id', applicationId)
    .select('application_id, status, updated_at')
    .single();

  if (error || !data) {
    throw new AppError(
      404,
      ERROR_CODE.APPLICATION_NOT_FOUND,
      '지원 기록을 찾을 수 없습니다.',
    );
  }

  return mapApplicationStatusRowToResponse(data as ApplicationStatusRow);
}
