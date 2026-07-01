import type { RequestHandler } from 'express';

import { supabasePublic } from '../lib/supabase-public.js';

export const requireAuth: RequestHandler = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: '로그인이 필요합니다.',
        },
      });
      return;
    }

    const accessToken = authorization.replace('Bearer ', '');

    const {
      data: { user },
      error,
    } = await supabasePublic.auth.getUser(accessToken);

    if (error || !user) {
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: '유효하지 않은 인증 정보입니다.',
        },
      });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email ?? '',
    };

    req.accessToken = accessToken;

    next();
  } catch (error) {
    next(error);
  }
};
