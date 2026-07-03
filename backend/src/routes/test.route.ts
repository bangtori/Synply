import { Router } from 'express';
import { supabasePublic } from '../lib/supabase-public.js';
import { requireAuth } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/async-handler.js';
import { sendSuccess } from '../utils/response.js';

export const testRouter = Router();

testRouter.get(
  '/supabase',
  asyncHandler(async (_req, res) => {
    const { data, error } = await supabasePublic
      .from('test_messages')
      .select('id, message, created_at')
      .order('id', { ascending: true });

    if (error) {
      throw error;
    }

    sendSuccess(res, data);
  }),
);

testRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    sendSuccess(res, req.user);
  }),
);
