import type { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/AppError.js';
import { ZodError } from 'zod';
import { ERROR_CODE, type ErrorCode } from '../errors/errorCode.js';

function mapZodErrorToErrorCode(error: ZodError): ErrorCode {
  const firstIssue = error.issues[0];
  const field = firstIssue?.path[0];

  if (
    firstIssue?.code === 'invalid_type' ||
    field === 'companyName' ||
    field === 'positionTitle'
  ) {
    return ERROR_CODE.REQUIRED_FIELD_MISSING;
  }

  if (field === 'status') {
    return ERROR_CODE.INVALID_STATUS;
  }

  if (field === 'fileType') {
    return ERROR_CODE.INVALID_FILE_TYPE;
  }

  return ERROR_CODE.VALIDATION_ERROR;
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
      },
    });
    return;
  }

  if (error instanceof ZodError) {
    const firstIssue = error.issues[0];
    res.status(400).json({
      error: {
        code: mapZodErrorToErrorCode(error),
        message: firstIssue?.message ?? '입력값이 올바르지 않습니다.',
      },
    });
    return;
  }

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: '서버 내부 오류가 발생했습니다.',
    },
  });
};
