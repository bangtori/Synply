import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';

export const supabasePublic = createClient(
  env.supabaseUrl,
  env.supabasePublishableKey,
);
