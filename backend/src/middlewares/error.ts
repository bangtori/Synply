import type { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/AppError.js';

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

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: '서버 내부 오류가 발생했습니다.',
    },
  });
};
