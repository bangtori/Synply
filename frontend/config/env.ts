function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`❌ Missing environment variable: ${name}`);
  }

  return value;
}

export const env = {
  apiBaseUrl: getEnv('NEXT_PUBLIC_API_BASE_URL'),

  supabaseUrl: getEnv('NEXT_PUBLIC_SUPABASE_URL'),
  supabasePublishableKey: getEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'),
};
