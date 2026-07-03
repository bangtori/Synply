import { describe, expect, it } from 'vitest';

import {
  createApplicationSchema,
  updateApplicationSchema,
  updateApplicationStatusSchema,
} from './application.schema.js';
const validRequest = {
  companyName: '토스',
  positionTitle: '프론트엔드',
  postingUrl: 'https://toss.im',
  deadlineDate: '2026-07-31',
  platform: '원티드',
  techStacks: ['React', 'TypeScript'],
  status: 'APPLIED',
  appliedAt: '2026-07-01',
  submissionFileIds: ['550e8400-e29b-41d4-a716-446655440000'],
} as const;

describe('createApplicationSchema 테스트', () => {
  describe('성공 케이스', () => {
    it('전체 필드를 올바르게 입력하면 성공한다.', () => {
      const result = createApplicationSchema.safeParse(validRequest);

      expect(result.success).toBe(true);
    });
    it('필수값만 입력하면 성공한다.', () => {
      const result = createApplicationSchema.safeParse({
        companyName: '토스',
        positionTitle: '프론트엔드 엔지니어',
      });

      expect(result.success).toBe(true);
    });
    it('문자열 앞뒤 공백을 제거한다.', () => {
      const result = createApplicationSchema.safeParse({
        companyName: '  토스  ',
        positionTitle: '  프론트엔드  ',
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.companyName).toBe('토스');
        expect(result.data.positionTitle).toBe('프론트엔드');
      }
    });
  });

  describe('필수값 누락 테스트', () => {
    it('companyName을 입력하지 않으면 실패한다.', () => {
      const result = createApplicationSchema.safeParse({
        ...validRequest,
        companyName: undefined,
      });
      expect(result.success).toBe(false);
    });
    it('positionTitle을 입력하지 않으면 실패한다.', () => {
      const result = createApplicationSchema.safeParse({
        ...validRequest,
        positionTitle: undefined,
      });
      expect(result.success).toBe(false);
    });
    it('companyName이 공백 문자열이면 실패한다.', () => {
      const result = createApplicationSchema.safeParse({
        ...validRequest,
        companyName: '   ',
      });
      expect(result.success).toBe(false);
    });
    it('positionTitle이 공백 문자열이면 실패한다.', () => {
      const result = createApplicationSchema.safeParse({
        ...validRequest,
        positionTitle: '   ',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('형식 검증 테스트', () => {
    it('postingUrl이 유효하지 않은 URL 형식이면 실패한다.', () => {
      const result = createApplicationSchema.safeParse({
        ...validRequest,
        postingUrl: 'invalid-url',
      });
      expect(result.success).toBe(false);
    });
    it('deadlineDate가 YYYY-MM-DD 형식이 아니면 실패한다.', () => {
      const result = createApplicationSchema.safeParse({
        ...validRequest,
        deadlineDate: '2026/07/01',
      });
      expect(result.success).toBe(false);
    });
    it('deadlineDate가 존재하지 않는 날짜면 실패한다.', () => {
      const result = createApplicationSchema.safeParse({
        ...validRequest,
        deadlineDate: '2026-13-01',
      });
      expect(result.success).toBe(false);
    });
    it('appliedAt이 YYYY-MM-DD 형식이 아니면 실패한다.', () => {
      const result = createApplicationSchema.safeParse({
        ...validRequest,
        appliedAt: '2026/07/01',
      });
      expect(result.success).toBe(false);
    });
    it('appliedAt이 존재하지 않는 날짜면 실패한다.', () => {
      const result = createApplicationSchema.safeParse({
        ...validRequest,
        appliedAt: '2026-10-99',
      });
      expect(result.success).toBe(false);
    });
    it('status가 유효하지 않은 상태 값이면 실패한다.', () => {
      const result = createApplicationSchema.safeParse({
        ...validRequest,
        status: 'INVALID',
      });
      expect(result.success).toBe(false);
    });
    it('techStacks에 빈 문자열이 포함되면 실패한다.', () => {
      const result = createApplicationSchema.safeParse({
        ...validRequest,
        techStacks: ['', 'React'],
      });
      expect(result.success).toBe(false);
    });
    it('techStacks에 공백 문자열이 포함되면 실패한다.', () => {
      const result = createApplicationSchema.safeParse({
        ...validRequest,
        techStacks: ['   ', 'React'],
      });
      expect(result.success).toBe(false);
    });
    it('submissionFileIds가 유효하지 않은 UUID 형식이면 실패한다.', () => {
      const result = createApplicationSchema.safeParse({
        ...validRequest,
        submissionFileIds: ['invalid-uuid'],
      });
      expect(result.success).toBe(false);
    });
    it('submissionFileIds에 2개 이상 전달하면 실패한다 (MVP)', () => {
      const result = createApplicationSchema.safeParse({
        ...validRequest,
        submissionFileIds: [
          '550e8400-e29b-41d4-a716-446655440000',
          '550e8400-e29b-41d4-a716-446655440000',
        ],
      });
      expect(result.success).toBe(false);
    });
  });
});
describe('updateApplicationSchema 테스트', () => {
  describe('성공 케이스', () => {
    it('수정 필드만 입력하면 성공한다. (필드 1개)', () => {
      const result = updateApplicationSchema.safeParse({
        companyName: '당근마켓',
      });
      expect(result.success).toBe(true);
    });
    it('수정 필드만 입력하면 성공한다. (필드 여러개)', () => {
      const result = updateApplicationSchema.safeParse({
        companyName: '당근마켓',
        positionTitle: '백엔드',
      });
      expect(result.success).toBe(true);
    });
  });
  describe('예외 테스트', () => {
    it('아무 필드도 전달하지 않으면 실패한다.', () => {
      const result = updateApplicationSchema.safeParse({});
      expect(result.success).toBe(false);
    });
    it('submissionFileIds는 수정 스키마에서 허용하지 않는다.', () => {
      const result = updateApplicationSchema.safeParse({
        submissionFileIds: ['550e8400-e29b-41d4-a716-446655440000'],
      });
      expect(result.success).toBe(false);
    });
  });
  describe('기존 검증 적용 테스트', () => {
    it('status에 잘못된 enum을 전달하면 실패한다.', () => {
      const result = updateApplicationSchema.safeParse({
        status: 'INVALID',
      });
      expect(result.success).toBe(false);
    });
    it('positionTitle이 공백이면 실패한다.', () => {
      const result = updateApplicationSchema.safeParse({
        positionTitle: '  ',
      });
      expect(result.success).toBe(false);
    });
  });
});

describe('updateApplicationStatusSchema 테스트', () => {
  describe('성공 케이스', () => {
    it('status만 입력하면 성공한다.', () => {
      const result = updateApplicationStatusSchema.safeParse({
        status: 'APPLIED',
      });
      expect(result.success).toBe(true);
    });
  });
  describe('예외 테스트', () => {
    it('status를 입력하지 않으면 실패한다.', () => {
      const result = updateApplicationStatusSchema.safeParse({});
      expect(result.success).toBe(false);
    });
    it('status가 유효하지 않은 상태 값이면 실패한다.', () => {
      const result = updateApplicationStatusSchema.safeParse({
        status: 'INVALID',
      });
      expect(result.success).toBe(false);
    });
    it('status 이외의 필드를 전달하면 실패한다.', () => {
      const result = updateApplicationStatusSchema.safeParse({
        status: 'APPLIED',
        companyName: '토스',
      });
      expect(result.success).toBe(false);
    });
  });
});
