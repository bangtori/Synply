import { Router } from 'express';
import { supabasePublic } from '../lib/supabase-public.js';
import { requireAuth } from '../middlewares/auth.js';

export const testRouter = Router();

testRouter.get('/supabase', async (_req, res, next) => {
  try {
    const { data, error } = await supabasePublic
      .from('test_messages')
      .select('id, message, created_at')
      .order('id', { ascending: true });

    if (error) {
      throw error;
    }

    res.json({ data });
  } catch (error) {
    next(error);
  }
});

testRouter.get('/me', requireAuth, (req, res) => {
  res.json({
    data: req.user,
  });
});
