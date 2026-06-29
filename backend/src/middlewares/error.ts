import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error);

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: '서버 내부 오류가 발생했습니다.',
    },
  });
};
