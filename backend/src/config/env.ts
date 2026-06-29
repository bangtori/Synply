import 'dotenv/config';

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`❌ Missing environment variable: ${name}`);
  }

  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),

  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3100',

  supabaseUrl: getEnv('SUPABASE_URL'),

  supabasePublishableKey: getEnv('SUPABASE_PUBLISHABLE_KEY'),

  supabaseSecretKey: getEnv('SUPABASE_SECRET_KEY'),
};
