import { AppError } from '../errors/AppError.js';
import { ERROR_CODE } from '../errors/errorCode.js';
import { TABLE } from '../constants/table.js';
import { createSupabaseUserClient } from '../lib/supabase-user.js';
import {
  mapApplicationRowsToResponse,
  mapApplicationRowToResponse,
  mapCreateApplicationRequestToInsertData,
} from '../mapper/application.mapper.js';
import type { CreateApplicationRequest } from '../schemas/application.schema.js';
import type {
  ApplicationListResult,
  ApplicationResponse,
  ApplicationRow,
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
