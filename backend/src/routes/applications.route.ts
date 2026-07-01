import { Router } from 'express';
import {
  createApplication,
  getApplications,
} from '../services/application.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { sendSuccess } from '../utils/response.js';
import { createApplicationSchema } from '../schemas/application.schema.js';
import { requireAuth } from '../middlewares/auth.js';

export const applicationRouter = Router();

// GET /applications
// 지원 목록 조회
applicationRouter.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const accessToken = req.accessToken!;

    // 쿼리 파싱 -> 추가 쿼리 작업 필요
    const page = Number(req.query.page ?? 1);
    const pageSize = Number(req.query.pageSize ?? 20);

    // 서비스 호출
    const { applications, pagination } = await getApplications(
      accessToken,
      userId,
      pageSize,
      page,
    );

    // 성공 반환
    sendSuccess(res, applications, pagination);
  }),
);

// POST /applications
applicationRouter.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const accessToken = req.accessToken!;

    // 요청 검증
    const request = createApplicationSchema.parse(req.body);

    // 서비스 호출
    const application = await createApplication(accessToken, userId, request);

    // 성공 반환
    sendSuccess(res, application, undefined, 201);
  }),
);
