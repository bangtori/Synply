import { z } from 'zod';
import { APPLICATION_STATUS_VALUES } from '../constants/application-status.js';

export const applicationStatusSchema = z.enum(APPLICATION_STATUS_VALUES);

// 생성 요청 스키마
export const createApplicationSchema = z.object({
  companyName: z
    .string({ error: '회사명을 입력해 주세요.' })
    .trim()
    .min(1, '회사명을 입력해 주세요.'),
  positionTitle: z
    .string({ error: '직무명을 입력해 주세요.' })
    .trim()
    .min(1, '직무명을 입력해 주세요.'),
  postingUrl: z
    .url({
      message: '유효한 URL을 입력해주세요.',
    })
    .optional(),
  deadlineDate: z.iso.date().optional(),
  platform: z.string().trim().optional(),
  techStacks: z.array(z.string().trim().min(1)).optional(),
  status: applicationStatusSchema.optional(),
  appliedAt: z.iso.date().optional(),
  submissionFileIds: z.array(z.uuid()).max(1).optional(), // 우선 단일 연결 mvp, 이후 확장 예정
});

// 생성 요청 타입
export type CreateApplicationRequest = z.infer<typeof createApplicationSchema>;

// 수정 요청 스키마
export const updateApplicationSchema = createApplicationSchema
  .omit({
    submissionFileIds: true,
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: '수정할 필드를 하나 이상 입력해주세요.',
  });

// 수정 요청 타입
export type UpdateApplicationRequest = z.infer<typeof updateApplicationSchema>;

// 전형 상태 변경 요청 스키마
export const updateApplicationStatusSchema = z.object({
  status: applicationStatusSchema,
});

// 전형 상태 변경 요청 타입
export type UpdateApplicationStatusRequest = z.infer<
  typeof updateApplicationStatusSchema
>;
