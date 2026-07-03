import { createClient } from '@supabase/supabase-js';

import { env } from '../config/env.js';

export function createSupabaseUserClient(accessToken: string) {
  return createClient(env.supabaseUrl, env.supabasePublishableKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}
