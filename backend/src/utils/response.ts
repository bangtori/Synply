import type { Response } from 'express';

export function sendSuccess<T>(
  res: Response,
  data: T,
  meta?: Record<string, unknown>,
  statusCode = 200,
) {
  res.status(statusCode).json({
    data,
    ...(meta ? { meta } : {}),
  });
}
