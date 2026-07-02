import { Router } from 'express';
import {
  createApplication,
  deleteApplication,
  getApplicationDetail,
  getApplications,
  updateApplication,
} from '../services/application.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { sendSuccess } from '../utils/response.js';
import {
  createApplicationSchema,
  updateApplicationSchema,
} from '../schemas/application.schema.js';
import { requireAuth } from '../middlewares/auth.js';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODE } from '../errors/errorCode.js';

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

// GET /applications/:id
applicationRouter.get(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const accessToken = req.accessToken!;
    const userId = req.user!.id;
    const applicationId = req.params.id;

    if (!applicationId || Array.isArray(applicationId)) {
      throw new AppError(
        400,
        ERROR_CODE.VALIDATION_ERROR,
        '지원 기록 id가 올바르지 않습니다.',
      );
    }
    const application = await getApplicationDetail(
      accessToken,
      userId,
      applicationId,
    );

    sendSuccess(res, application);
  }),
);

// PATCH /applications/:id
applicationRouter.patch(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const accessToken = req.accessToken!;
    const userId = req.user!.id;
    const applicationId = req.params.id;

    if (!applicationId || Array.isArray(applicationId)) {
      throw new AppError(
        400,
        ERROR_CODE.VALIDATION_ERROR,
        '지원 기록 id가 올바르지 않습니다.',
      );
    }

    const request = updateApplicationSchema.parse(req.body);

    const application = await updateApplication(
      accessToken,
      userId,
      applicationId,
      request,
    );

    sendSuccess(res, application);
  }),
);

// DELETE /applications/:id
applicationRouter.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const accessToken = req.accessToken!;
    const userId = req.user!.id;
    const applicationId = req.params.id;

    if (!applicationId || Array.isArray(applicationId)) {
      throw new AppError(
        400,
        ERROR_CODE.VALIDATION_ERROR,
        '지원 기록 id가 올바르지 않습니다.',
      );
    }

    await deleteApplication(accessToken, userId, applicationId);

    res.status(204).send();
  }),
);
