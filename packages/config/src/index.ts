import { z } from 'zod';

export const EnvironmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  DATABASE_URL: z.string().optional(),

  // Redis
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
  REDIS_URL: z.string().optional(),

  // Key Vault
  TOLLGATE_MASTER_KEK: z.string().min(32).optional(),

  // Gateway
  GATEWAY_PORT: z.coerce.number().default(8787),
  GATEWAY_HOST: z.string().default('0.0.0.0'),
  GATEWAY_CORS_ORIGINS: z.string().default('*'),
  GATEWAY_REDIS_FAIL_CLOSED: z.coerce.boolean().default(true),
  GATEWAY_REQUEST_TIMEOUT_MS: z.coerce.number().default(60000),

  // Worker
  WORKER_CONCURRENCY: z.coerce.number().default(5),
  USAGE_BATCH_SIZE: z.coerce.number().default(50),
  USAGE_FLUSH_INTERVAL_MS: z.coerce.number().default(5000),

  // Logging & Observability
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  SENTRY_DSN: z.string().optional(),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().optional(),
});

export type Environment = z.infer<typeof EnvironmentSchema>;

export function validateEnvironment(env: Record<string, unknown> = process.env): Environment {
  const result = EnvironmentSchema.safeParse(env);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`[Tollgate Config] Environment validation failed:\n${issues}`);
  }
  return result.data;
}
