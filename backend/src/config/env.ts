import dotenv from 'dotenv';

dotenv.config();

/**
 * Validated environment configuration.
 * Fails fast at startup if any required variable is missing.
 */
function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: parseInt(process.env.PORT ?? '5000', 10),
  MONGODB_URI: requireEnv('MONGODB_URI', 'mongodb://localhost:27017/turut'),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',
  CORS_ORIGIN: (process.env.CORS_ORIGIN ?? 'http://localhost:3000').split(',').map(s => s.trim()),
} as const;
